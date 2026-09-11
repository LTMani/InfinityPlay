/**
 * InfinityPlay - City Builder Backend Manager (V2)
 * Authoritative game server validation, offline ticks, timers, troop training,
 * base defenses, campaign battles, daily missions, achievements, and persistence.
 */

const CityConfig = require('../../games/city-builder/js/engine/city-config');

class CityBuilderManager {
  constructor(store) {
    this.store = store;
  }

  /**
   * Retrieves or initializes a player's city, applying offline ticks and timer resolutions
   */
  getCity(userId, userName = 'Mayor') {
    let city = this.store.getCitySave(userId);
    if (!city || !city.version || city.version < 2) {
      city = CityConfig.createStarterCity(userId, userName);
      this.store.saveCitySave(userId, city);
    }

    // Apply tick to resolve completed timers, troop training, & calculate offline resources
    const offlineReport = this.applyTick(city);
    this.store.saveCitySave(userId, city);

    return { city, offlineReport };
  }

  /**
   * Applies offline progress, timer resolutions, and resource ticks
   */
  applyTick(city, now = Date.now()) {
    const elapsedSeconds = Math.max(0, Math.floor((now - (city.lastTickTime || now)) / 1000));
    let completedUpgrades = [];
    let completedConstructions = [];
    let completedTroops = [];

    // 1. Resolve completed building timers
    (city.buildings || []).forEach(bld => {
      if (bld.status && bld.status !== 'idle' && bld.finishTime && now >= bld.finishTime) {
        const spec = CityConfig.BUILDINGS[bld.type];
        if (bld.status === 'constructing') {
          bld.status = 'idle';
          bld.finishTime = null;
          city.stats.buildingsConstructed = (city.stats.buildingsConstructed || 0) + 1;
          this.addXP(city, (bld.level || 1) * 30);
          completedConstructions.push({ id: bld.id, name: spec ? spec.name : bld.type, level: bld.level });
        } else if (bld.status === 'upgrading') {
          bld.level = (bld.level || 1) + 1;
          bld.status = 'idle';
          bld.finishTime = null;
          city.stats.upgradesCompleted = (city.stats.upgradesCompleted || 0) + 1;
          this.addXP(city, bld.level * 50);
          this.progressDailyMission(city, 'm_upgrade', 1);
          completedUpgrades.push({ id: bld.id, name: spec ? spec.name : bld.type, level: bld.level });
        }
      }
    });

    // 2. Resolve troop training queue
    if (city.trainingQueue && city.trainingQueue.length > 0) {
      const remainingQueue = [];
      city.army = city.army || { guardian: 0, ranger: 0, vanguard: 0, heavy_defender: 0, energy_mage: 0, siege_unit: 0 };

      city.trainingQueue.forEach(item => {
        if (now >= item.finishTime) {
          city.army[item.unitId] = (city.army[item.unitId] || 0) + item.count;
          city.stats.unitsTrained = (city.stats.unitsTrained || 0) + item.count;
          this.addXP(city, item.count * 15);
          completedTroops.push({ unitId: item.unitId, count: item.count });
        } else {
          remainingQueue.push(item);
        }
      });
      city.trainingQueue = remainingQueue;
    }

    // 3. Compute dynamic storage caps based on Treasury and Storage buildings
    let goldCap = CityConfig.RESOURCES.gold.baseStorage;
    let woodCap = CityConfig.RESOURCES.wood.baseStorage;
    let stoneCap = CityConfig.RESOURCES.stone.baseStorage;
    let foodCap = CityConfig.RESOURCES.food.baseStorage;

    (city.buildings || []).forEach(bld => {
      const spec = CityConfig.BUILDINGS[bld.type];
      if (!spec) return;
      const levelData = spec.levels[Math.min((bld.level || 1) - 1, spec.levels.length - 1)];
      if (!levelData) return;

      if (bld.type === 'treasury' && levelData.goldCap) {
        goldCap += levelData.goldCap;
      } else if (bld.type === 'storage' && levelData.resourceCap) {
        woodCap += levelData.resourceCap;
        stoneCap += levelData.resourceCap;
        foodCap += levelData.resourceCap;
      }
    });

    // Check tech: polymer masonry (+25% storage cap)
    if (city.unlockedTechs && city.unlockedTechs.includes('reinforced_masonry')) {
      goldCap = Math.floor(goldCap * 1.25);
      woodCap = Math.floor(woodCap * 1.25);
      stoneCap = Math.floor(stoneCap * 1.25);
      foodCap = Math.floor(foodCap * 1.25);
    }

    city.storageCaps = {
      gold: goldCap,
      wood: woodCap,
      stone: stoneCap,
      food: foodCap,
      gems: 999999
    };

    // 4. Compute dynamic production rates per minute
    let goldRate = 0;
    let woodRate = 0;
    let stoneRate = 0;
    let foodRate = 0;

    (city.buildings || []).forEach(bld => {
      const spec = CityConfig.BUILDINGS[bld.type];
      if (!spec) return;
      const levelData = spec.levels[Math.min((bld.level || 1) - 1, spec.levels.length - 1)];
      if (!levelData || !levelData.rate) return;

      let bldRate = levelData.rate;

      // Tech bonuses
      if (bld.type === 'gold_mine' && city.unlockedTechs && city.unlockedTechs.includes('deep_mining')) {
        bldRate *= 1.20;
      }
      if (bld.type === 'lumber_yard' && city.unlockedTechs && city.unlockedTechs.includes('sawmill_steam')) {
        bldRate *= 1.20;
      }
      if (bld.type === 'stone_quarry' && city.unlockedTechs && city.unlockedTechs.includes('quarry_explosives')) {
        bldRate *= 1.25;
      }
      if (bld.type === 'farm' && city.unlockedTechs && city.unlockedTechs.includes('crop_rotation')) {
        bldRate *= 1.25;
      }

      if (bld.type === 'gold_mine') goldRate += bldRate;
      else if (bld.type === 'lumber_yard') woodRate += bldRate;
      else if (bld.type === 'stone_quarry') stoneRate += bldRate;
      else if (bld.type === 'farm') foodRate += bldRate;
    });

    // City Hall regional boost for Level 4+ (+15%)
    const cityHall = (city.buildings || []).find(b => b.type === 'city_hall');
    if (cityHall && cityHall.level >= 4) {
      goldRate *= 1.15;
      woodRate *= 1.15;
      stoneRate *= 1.15;
      foodRate *= 1.15;
    }

    // 5. Calculate accumulated resources over elapsed seconds
    let earned = { gold: 0, wood: 0, stone: 0, food: 0 };
    if (elapsedSeconds > 0) {
      const minutes = elapsedSeconds / 60;
      earned.gold = Math.floor(goldRate * minutes);
      earned.wood = Math.floor(woodRate * minutes);
      earned.stone = Math.floor(stoneRate * minutes);
      earned.food = Math.floor(foodRate * minutes);

      city.resources.gold = Math.min(city.storageCaps.gold, (city.resources.gold || 0) + earned.gold);
      city.resources.wood = Math.min(city.storageCaps.wood, (city.resources.wood || 0) + earned.wood);
      city.resources.stone = Math.min(city.storageCaps.stone, (city.resources.stone || 0) + earned.stone);
      city.resources.food = Math.min(city.storageCaps.food, (city.resources.food || 0) + earned.food);

      city.stats.totalGoldProduced = (city.stats.totalGoldProduced || 0) + earned.gold;
      city.stats.totalWoodProduced = (city.stats.totalWoodProduced || 0) + earned.wood;
      city.stats.totalStoneProduced = (city.stats.totalStoneProduced || 0) + earned.stone;
      city.stats.totalFoodProduced = (city.stats.totalFoodProduced || 0) + earned.food;
    }

    city.productionRates = {
      gold: Math.round(goldRate),
      wood: Math.round(woodRate),
      stone: Math.round(stoneRate),
      food: Math.round(foodRate)
    };

    // 6. Check daily missions 24-hour reset
    city.dailyMissions = city.dailyMissions || { lastReset: now, progress: {}, claimed: [] };
    if (now - (city.dailyMissions.lastReset || 0) >= 86400000) {
      city.dailyMissions.lastReset = now;
      city.dailyMissions.progress = {
        m_collect: 0,
        m_upgrade: 0,
        m_train: 0,
        m_battle: 0,
        m_trade: 0
      };
      city.dailyMissions.claimed = [];
    }

    // 7. Update City Power
    city.cityPower = CityConfig.calculateCityPower(city);
    city.lastTickTime = now;

    // Report for offline popup if away for > 15 seconds
    if (elapsedSeconds >= 15 && (earned.gold > 0 || earned.wood > 0 || completedUpgrades.length > 0)) {
      return {
        elapsedSeconds,
        earned,
        completedUpgrades,
        completedConstructions,
        completedTroops
      };
    }

    return null;
  }

  addXP(city, amount) {
    city.xp = (city.xp || 0) + amount;
    city.xpNext = city.xpNext || 500;
    while (city.xp >= city.xpNext) {
      city.xp -= city.xpNext;
      city.level = (city.level || 1) + 1;
      city.xpNext = Math.floor(city.xpNext * 1.35);
      city.resources.gems = (city.resources.gems || 0) + 10; // Level up gem bonus!
    }
  }

  progressDailyMission(city, missionId, amount = 1) {
    city.dailyMissions = city.dailyMissions || { lastReset: Date.now(), progress: {}, claimed: [] };
    city.dailyMissions.progress = city.dailyMissions.progress || {};
    city.dailyMissions.progress[missionId] = (city.dailyMissions.progress[missionId] || 0) + amount;
  }

  /**
   * Places a new building on the grid
   */
  placeBuilding(userId, type, x, y) {
    const { city } = this.getCity(userId);
    const spec = CityConfig.BUILDINGS[type];
    if (!spec) {
      return { error: 'Unknown building type' };
    }

    // 1. Check unique constraint
    if (spec.unique && city.buildings.some(b => b.type === type)) {
      return { error: `${spec.name} is already built. Only 1 is permitted.` };
    }

    // 2. Check grid bounds
    const w = spec.size ? spec.size.w : 1;
    const h = spec.size ? spec.size.h : 1;
    if (x < 0 || y < 0 || x + w > CityConfig.GRID_SIZE || y + h > CityConfig.GRID_SIZE) {
      return { error: 'Placement coordinates are outside city borders.' };
    }

    // 3. Check collision with existing buildings
    const hasOverlap = city.buildings.some(b => {
      const bSpec = CityConfig.BUILDINGS[b.type] || { size: { w: 1, h: 1 } };
      const bw = bSpec.size ? bSpec.size.w : 1;
      const bh = bSpec.size ? bSpec.size.h : 1;
      return !(x + w <= b.x || x >= b.x + bw || y + h <= b.y || y >= b.y + bh);
    });
    if (hasOverlap) {
      return { error: 'Location is blocked by another building.' };
    }

    // 4. Check requirements
    const level1 = spec.levels[0];
    const cityHall = city.buildings.find(b => b.type === 'city_hall');
    const chLevel = cityHall ? cityHall.level : 1;
    if (level1.reqCityHall && chLevel < level1.reqCityHall) {
      return { error: `Requires City Command Center Level ${level1.reqCityHall} to construct.` };
    }

    // 5. Check costs
    const cost = level1.cost;
    if (
      (city.resources.gold || 0) < (cost.gold || 0) ||
      (city.resources.wood || 0) < (cost.wood || 0) ||
      (city.resources.stone || 0) < (cost.stone || 0) ||
      (city.resources.food || 0) < (cost.food || 0)
    ) {
      return { error: 'Insufficient resources to construct this building.' };
    }

    // Deduct cost
    city.resources.gold -= (cost.gold || 0);
    city.resources.wood -= (cost.wood || 0);
    city.resources.stone -= (cost.stone || 0);
    city.resources.food -= (cost.food || 0);

    // Apply tech speedup if available
    let duration = level1.time;
    if (city.unlockedTechs && city.unlockedTechs.includes('scaffolding')) {
      duration = Math.max(2, Math.floor(duration * 0.85));
    }

    const newBuilding = {
      id: `bld_${type}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      level: 1,
      x,
      y,
      status: duration > 0 ? 'constructing' : 'idle',
      finishTime: duration > 0 ? Date.now() + duration * 1000 : null
    };

    city.buildings.push(newBuilding);
    city.cityPower = CityConfig.calculateCityPower(city);
    this.store.saveCitySave(userId, city);

    return { success: true, city, building: newBuilding };
  }

  /**
   * Upgrades an existing building to the next level
   */
  upgradeBuilding(userId, buildingId) {
    const { city } = this.getCity(userId);
    const building = city.buildings.find(b => b.id === buildingId);
    if (!building) return { error: 'Building not found.' };

    if (building.status !== 'idle') {
      return { error: 'Building is currently busy.' };
    }

    const spec = CityConfig.BUILDINGS[building.type];
    if (!spec) return { error: 'Building spec not found.' };

    const currentLevel = building.level || 1;
    if (currentLevel >= spec.maxLevel) {
      return { error: 'Building is already at maximum level.' };
    }

    const nextSpec = spec.levels[currentLevel];
    if (!nextSpec) return { error: 'Next level specifications not found.' };

    // Check City Hall requirement
    const cityHall = city.buildings.find(b => b.type === 'city_hall');
    const chLevel = cityHall ? cityHall.level : 1;
    if (building.type !== 'city_hall' && nextSpec.reqCityHall && chLevel < nextSpec.reqCityHall) {
      return { error: `Upgrade requires City Command Center Level ${nextSpec.reqCityHall}.` };
    }

    // Check resource costs
    const cost = nextSpec.cost;
    if (
      (city.resources.gold || 0) < (cost.gold || 0) ||
      (city.resources.wood || 0) < (cost.wood || 0) ||
      (city.resources.stone || 0) < (cost.stone || 0) ||
      (city.resources.food || 0) < (cost.food || 0)
    ) {
      return { error: 'Insufficient resources to initiate upgrade.' };
    }

    // Deduct resources
    city.resources.gold -= (cost.gold || 0);
    city.resources.wood -= (cost.wood || 0);
    city.resources.stone -= (cost.stone || 0);
    city.resources.food -= (cost.food || 0);

    let duration = nextSpec.time;
    if (city.unlockedTechs && city.unlockedTechs.includes('scaffolding')) {
      duration = Math.max(3, Math.floor(duration * 0.85));
    }

    building.status = 'upgrading';
    building.finishTime = Date.now() + duration * 1000;

    this.store.saveCitySave(userId, city);

    return {
      success: true,
      city,
      building,
      duration,
      finishTime: building.finishTime
    };
  }

  /**
   * Speeds up or completes an ongoing construction or upgrade with Gems
   */
  speedup(userId, buildingId) {
    const { city } = this.getCity(userId);
    const building = city.buildings.find(b => b.id === buildingId);
    if (!building) return { error: 'Building not found.' };

    if (!building.status || building.status === 'idle') {
      return { error: 'Building is not currently constructing or upgrading.' };
    }

    const now = Date.now();
    const remainingSeconds = Math.max(0, Math.ceil(((building.finishTime || now) - now) / 1000));

    if (remainingSeconds > 0) {
      const gemCost = Math.max(1, Math.ceil(remainingSeconds / 60));
      if ((city.resources.gems || 0) < gemCost) {
        return { error: `Insufficient Gems. Need ${gemCost} 💎, you have ${city.resources.gems || 0} 💎.` };
      }
      city.resources.gems -= gemCost;
    }

    // Finalize timer immediately
    building.finishTime = now;
    this.applyTick(city, now);
    this.store.saveCitySave(userId, city);

    return { success: true, city, building };
  }

  /**
   * Moves a building to new grid coordinates
   */
  moveBuilding(userId, buildingId, newX, newY) {
    const { city } = this.getCity(userId);
    const building = city.buildings.find(b => b.id === buildingId);
    if (!building) return { error: 'Building not found.' };

    const spec = CityConfig.BUILDINGS[building.type] || { size: { w: 1, h: 1 } };
    const w = spec.size ? spec.size.w : 1;
    const h = spec.size ? spec.size.h : 1;

    // Check bounds
    if (newX < 0 || newY < 0 || newX + w > CityConfig.GRID_SIZE || newY + h > CityConfig.GRID_SIZE) {
      return { error: 'Target coordinates are outside city borders.' };
    }

    // Check collision with other buildings
    const hasOverlap = city.buildings.some(b => {
      if (b.id === buildingId) return false;
      const bSpec = CityConfig.BUILDINGS[b.type] || { size: { w: 1, h: 1 } };
      const bw = bSpec.size ? bSpec.size.w : 1;
      const bh = bSpec.size ? bSpec.size.h : 1;
      return !(newX + w <= b.x || newX >= b.x + bw || newY + h <= b.y || newY >= b.y + bh);
    });

    if (hasOverlap) {
      return { error: 'Target location is occupied by another structure.' };
    }

    building.x = newX;
    building.y = newY;
    this.store.saveCitySave(userId, city);

    return { success: true, city, building };
  }

  /**
   * Trades resources at the Marketplace
   */
  trade(userId, fromRes, toRes, amount) {
    const { city } = this.getCity(userId);
    const market = city.buildings.find(b => b.type === 'marketplace' && b.status === 'idle');
    if (!market) {
      return { error: 'Requires an active Marketplace to conduct trade.' };
    }

    if (!CityConfig.RESOURCES[fromRes] || !CityConfig.RESOURCES[toRes] || fromRes === toRes) {
      return { error: 'Invalid resource pair selected for trade.' };
    }

    if (fromRes === 'gems' || toRes === 'gems') {
      return { error: 'Gems cannot be directly traded on the market.' };
    }

    amount = parseInt(amount, 10);
    if (isNaN(amount) || amount <= 0) {
      return { error: 'Trade amount must be a positive integer.' };
    }

    if ((city.resources[fromRes] || 0) < amount) {
      return { error: `Insufficient ${CityConfig.RESOURCES[fromRes].name} to trade.` };
    }

    const spec = CityConfig.BUILDINGS.marketplace;
    const levelSpec = spec.levels[Math.min(market.level - 1, spec.levels.length - 1)];
    const feePercent = levelSpec ? levelSpec.tradeFee : 0.25;

    const received = Math.floor(amount * (1 - feePercent));
    if (received <= 0) {
      return { error: 'Trade amount is too small after market tariffs.' };
    }

    const currentTo = city.resources[toRes] || 0;
    const capTo = (city.storageCaps && city.storageCaps[toRes]) || 5000;
    if (currentTo >= capTo) {
      return { error: `${CityConfig.RESOURCES[toRes].name} storage is already at maximum capacity!` };
    }

    city.resources[fromRes] -= amount;
    city.resources[toRes] = Math.min(capTo, currentTo + received);
    this.progressDailyMission(city, 'm_trade', 1);

    this.store.saveCitySave(userId, city);

    return {
      success: true,
      city,
      traded: amount,
      received,
      feePercent: Math.round(feePercent * 100)
    };
  }

  /**
   * Researches a technology in the Research Institute
   */
  research(userId, techId) {
    const { city } = this.getCity(userId);
    const academy = city.buildings.find(b => b.type === 'research_center' && b.status === 'idle');
    if (!academy) {
      return { error: 'Requires an active Research Institute to research technologies.' };
    }

    const tech = CityConfig.TECH_TREE.find(t => t.id === techId);
    if (!tech) return { error: 'Unknown technology.' };

    city.unlockedTechs = city.unlockedTechs || [];
    if (city.unlockedTechs.includes(techId)) {
      return { error: 'Technology is already unlocked.' };
    }

    if (academy.level < tech.tier) {
      return { error: `Requires Research Institute Level ${tech.tier}.` };
    }

    // Check cost
    const cost = tech.cost;
    if (
      (city.resources.gold || 0) < (cost.gold || 0) ||
      (city.resources.wood || 0) < (cost.wood || 0) ||
      (city.resources.stone || 0) < (cost.stone || 0) ||
      (city.resources.food || 0) < (cost.food || 0)
    ) {
      return { error: 'Insufficient resources to fund research.' };
    }

    city.resources.gold -= (cost.gold || 0);
    city.resources.wood -= (cost.wood || 0);
    city.resources.stone -= (cost.stone || 0);
    city.resources.food -= (cost.food || 0);

    city.unlockedTechs.push(techId);
    this.addXP(city, tech.tier * 60);

    this.applyTick(city);
    this.store.saveCitySave(userId, city);

    return { success: true, city, tech };
  }

  /**
   * Trains troops in the military queue
   */
  trainTroops(userId, unitId, count = 1) {
    const { city } = this.getCity(userId);
    const unitSpec = CityConfig.UNITS[unitId];
    if (!unitSpec) return { error: 'Unknown unit type.' };

    count = parseInt(count, 10);
    if (isNaN(count) || count <= 0) return { error: 'Invalid recruitment count.' };

    // Check required training structure
    const reqBuilding = city.buildings.find(b => b.type === unitSpec.requiredBuilding && b.status === 'idle');
    if (!reqBuilding) {
      const bSpec = CityConfig.BUILDINGS[unitSpec.requiredBuilding];
      return { error: `Requires an active ${bSpec ? bSpec.name : 'Military Building'} to train ${unitSpec.name}s.` };
    }

    if ((reqBuilding.level || 1) < unitSpec.requiredBuildingLevel) {
      return { error: `Requires ${CityConfig.BUILDINGS[unitSpec.requiredBuilding].name} Level ${unitSpec.requiredBuildingLevel}.` };
    }

    // Check army housing capacity
    let totalArmyCap = 40;
    (city.buildings || []).forEach(b => {
      const bSpec = CityConfig.BUILDINGS[b.type];
      if (bSpec && bSpec.levels) {
        const lvlData = bSpec.levels[Math.min((b.level || 1) - 1, bSpec.levels.length - 1)];
        if (lvlData && lvlData.armyCap) totalArmyCap += lvlData.armyCap;
      }
    });

    let currentHousing = 0;
    Object.entries(city.army || {}).forEach(([uId, uCount]) => {
      const spec = CityConfig.UNITS[uId];
      if (spec) currentHousing += (spec.housing || 1) * uCount;
    });
    (city.trainingQueue || []).forEach(q => {
      const spec = CityConfig.UNITS[q.unitId];
      if (spec) currentHousing += (spec.housing || 1) * q.count;
    });

    if (currentHousing + (unitSpec.housing || 1) * count > totalArmyCap) {
      return { error: `Army housing limit exceeded (${currentHousing}/${totalArmyCap}). Upgrade Training Grounds to house more troops.` };
    }

    // Check resource costs
    const totalCost = {
      food: (unitSpec.cost.food || 0) * count,
      wood: (unitSpec.cost.wood || 0) * count,
      stone: (unitSpec.cost.stone || 0) * count,
      gold: (unitSpec.cost.gold || 0) * count
    };

    if (
      (city.resources.food || 0) < totalCost.food ||
      (city.resources.wood || 0) < totalCost.wood ||
      (city.resources.stone || 0) < totalCost.stone ||
      (city.resources.gold || 0) < totalCost.gold
    ) {
      return { error: 'Insufficient resources to train this regiment.' };
    }

    // Deduct resources
    city.resources.food -= totalCost.food;
    city.resources.wood -= totalCost.wood;
    city.resources.stone -= totalCost.stone;
    city.resources.gold -= totalCost.gold;

    const totalDuration = unitSpec.trainTime * count;
    city.trainingQueue = city.trainingQueue || [];
    city.trainingQueue.push({
      id: `queue_${unitId}_${Date.now()}`,
      unitId,
      count,
      startTime: Date.now(),
      finishTime: Date.now() + totalDuration * 1000,
      totalDuration
    });

    this.progressDailyMission(city, 'm_train', count);
    this.store.saveCitySave(userId, city);

    return { success: true, city, queue: city.trainingQueue };
  }

  /**
   * Resolves a tactical battle on the World Map
   */
  resolveBattle(userId, targetId, destructionPercent, stars, casualties = {}) {
    const { city } = this.getCity(userId);
    const node = CityConfig.CAMPAIGN_NODES.find(n => n.id === targetId);
    if (!node) return { error: 'Unknown campaign destination.' };

    destructionPercent = Math.min(100, Math.max(0, parseInt(destructionPercent, 10) || 0));
    stars = Math.min(3, Math.max(0, parseInt(stars, 10) || 0));

    // Deduct casualties from army
    Object.entries(casualties).forEach(([uId, loss]) => {
      if (city.army && city.army[uId]) {
        city.army[uId] = Math.max(0, city.army[uId] - loss);
      }
    });

    city.campaignProgress = city.campaignProgress || {};
    const existing = city.campaignProgress[targetId] || { completed: false, stars: 0, bestDestruction: 0 };

    let lootAwarded = { gold: 0, wood: 0, stone: 0, food: 0, gems: 0 };
    if (stars > 0) {
      const multiplier = destructionPercent / 100;
      lootAwarded.gold = Math.floor((node.loot.gold || 0) * multiplier);
      lootAwarded.wood = Math.floor((node.loot.wood || 0) * multiplier);
      lootAwarded.stone = Math.floor((node.loot.stone || 0) * multiplier);
      lootAwarded.food = Math.floor((node.loot.food || 0) * multiplier);
      if (stars === 3 && existing.stars < 3) {
        lootAwarded.gems = node.loot.gems || 10;
      }

      city.resources.gold = Math.min(city.storageCaps.gold, (city.resources.gold || 0) + lootAwarded.gold);
      city.resources.wood = Math.min(city.storageCaps.wood, (city.resources.wood || 0) + lootAwarded.wood);
      city.resources.stone = Math.min(city.storageCaps.stone, (city.resources.stone || 0) + lootAwarded.stone);
      city.resources.food = Math.min(city.storageCaps.food, (city.resources.food || 0) + lootAwarded.food);
      city.resources.gems = (city.resources.gems || 0) + lootAwarded.gems;

      city.campaignProgress[targetId] = {
        completed: true,
        stars: Math.max(existing.stars, stars),
        bestDestruction: Math.max(existing.bestDestruction, destructionPercent)
      };

      city.stats.battlesWon = (city.stats.battlesWon || 0) + 1;
      this.addXP(city, stars * 120);
      this.progressDailyMission(city, 'm_battle', 1);
    }

    city.cityPower = CityConfig.calculateCityPower(city);
    this.store.saveCitySave(userId, city);

    return {
      success: true,
      city,
      stars,
      destructionPercent,
      lootAwarded
    };
  }

  /**
   * Claims rewards for a completed daily mission
   */
  claimMission(userId, missionId) {
    const { city } = this.getCity(userId);
    const mission = CityConfig.DAILY_MISSIONS.find(m => m.id === missionId);
    if (!mission) return { error: 'Unknown mission.' };

    city.dailyMissions = city.dailyMissions || { lastReset: Date.now(), progress: {}, claimed: [] };
    if (city.dailyMissions.claimed.includes(missionId)) {
      return { error: 'Mission reward already claimed today.' };
    }

    const currentProg = (city.dailyMissions.progress && city.dailyMissions.progress[missionId]) || 0;
    if (currentProg < mission.target) {
      return { error: 'Mission requirement not yet completed.' };
    }

    city.resources.gems = (city.resources.gems || 0) + (mission.rewardGems || 0);
    if (mission.rewardGold) city.resources.gold = Math.min(city.storageCaps.gold, (city.resources.gold || 0) + mission.rewardGold);
    if (mission.rewardWood) city.resources.wood = Math.min(city.storageCaps.wood, (city.resources.wood || 0) + mission.rewardWood);
    if (mission.rewardStone) city.resources.stone = Math.min(city.storageCaps.stone, (city.resources.stone || 0) + mission.rewardStone);
    if (mission.rewardFood) city.resources.food = Math.min(city.storageCaps.food, (city.resources.food || 0) + mission.rewardFood);

    city.dailyMissions.claimed.push(missionId);
    this.addXP(city, 40);
    this.store.saveCitySave(userId, city);

    return { success: true, city, mission };
  }

  /**
   * Claims rewards for a completed lifetime achievement
   */
  claimAchievement(userId, achId) {
    const { city } = this.getCity(userId);
    const ach = CityConfig.ACHIEVEMENTS.find(a => a.id === achId);
    if (!ach) return { error: 'Unknown achievement.' };

    city.claimedAchievements = city.claimedAchievements || [];
    if (city.claimedAchievements.includes(achId)) {
      return { error: 'Achievement already claimed.' };
    }

    // Verify conditions
    const ch = city.buildings.find(b => b.type === 'city_hall');
    const chLevel = ch ? ch.level : 1;
    if (ach.reqCityHall && chLevel < ach.reqCityHall) return { error: 'Requirement not met.' };
    if (ach.reqBuildingCount && city.buildings.length < ach.reqBuildingCount) return { error: 'Requirement not met.' };

    city.resources.gems = (city.resources.gems || 0) + (ach.rewardGems || 0);
    city.claimedAchievements.push(achId);
    this.addXP(city, 100);
    this.store.saveCitySave(userId, city);

    return { success: true, city, achievement: ach };
  }

  /**
   * Returns global rankings
   */
  getRankings() {
    const allCities = this.store.getAllCitySaves();
    const ranked = allCities.map(c => ({
      userId: c.userId,
      cityName: c.cityName,
      level: c.level || 1,
      cityPower: c.cityPower || CityConfig.calculateCityPower(c),
      battlesWon: (c.stats && c.stats.battlesWon) || 0,
      buildingsCount: (c.buildings || []).length
    })).sort((a, b) => b.cityPower - a.cityPower);

    const mockMayors = [
      { userId: 'bot_alex', name: 'Alex', cityName: 'Avalon Citadel', level: 14, cityPower: 4820, battlesWon: 28, buildingsCount: 22 },
      { userId: 'bot_elena', name: 'Elena', cityName: 'Solaris Metropolis', level: 12, cityPower: 3950, battlesWon: 21, buildingsCount: 19 },
      { userId: 'bot_marcus', name: 'Marcus', cityName: 'Ironclad Redoubt', level: 9, cityPower: 2680, battlesWon: 15, buildingsCount: 16 }
    ];

    const combined = [...ranked, ...mockMayors].sort((a, b) => b.cityPower - a.cityPower);
    return combined.slice(0, 10).map((r, idx) => ({
      rank: idx + 1,
      name: r.name || r.cityName || 'Mayor',
      ...r
    }));
  }

  /**
   * Resets player city to initial template
   */
  resetCity(userId, userName = 'Mayor') {
    const fresh = CityConfig.createStarterCity(userId, userName);
    this.store.saveCitySave(userId, fresh);
    return { success: true, city: fresh };
  }
}

module.exports = CityBuilderManager;
