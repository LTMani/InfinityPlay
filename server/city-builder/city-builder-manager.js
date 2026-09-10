/**
 * InfinityPlay - City Builder V2 Authoritative Game Server Manager
 * Authoritative validation for:
 * - Real-time production ticks & offline progress
 * - Dynamic storage and troop capacity
 * - Military unit training queues & instant speedups
 * - Tactical AI Stronghold Battles & plunder rewards
 * - Daily missions & achievements
 * - Interactive resource collection
 */

const CityConfig = require('../../games/city-builder/js/engine/city-config');

class CityBuilderManager {
  constructor(store) {
    this.store = store;
  }

  /**
   * Retrieves or initializes a player's city, applying offline progress and timers
   */
  getCity(userId, userName = 'Mayor') {
    let city = this.store.getCitySave(userId);
    if (!city) {
      city = CityConfig.createStarterCity(userId, userName);
      this.store.saveCitySave(userId, city);
    }

    // Apply tick to resolve completed timers, training queues & calculate offline progress
    const offlineReport = this.applyTick(city);
    this.store.saveCitySave(userId, city);

    return { city, offlineReport };
  }

  /**
   * Applies offline progress, timer resolutions, training queues, and resource ticks
   */
  applyTick(city, now = Date.now()) {
    const elapsedSeconds = Math.max(0, Math.floor((now - (city.lastTickTime || now)) / 1000));
    let completedUpgrades = [];
    let completedConstructions = [];

    // Ensure V2 fields exist on legacy save objects
    if (!city.army) {
      city.army = { guardian: 4, ranger: 2, vanguard: 0, heavy_defender: 0, energy_mage: 0, siege_unit: 0 };
    }
    if (!city.trainingQueue) city.trainingQueue = [];
    if (!city.completedStrongholds) city.completedStrongholds = [];
    if (!city.dailyMissions) city.dailyMissions = JSON.parse(JSON.stringify(CityConfig.DAILY_MISSIONS));

    // 1. Resolve completed building constructions and upgrades
    city.buildings.forEach(bld => {
      if (bld.status && bld.status !== 'idle' && bld.finishTime && now >= bld.finishTime) {
        const spec = CityConfig.BUILDINGS[bld.type];
        if (bld.status === 'constructing') {
          bld.status = 'idle';
          bld.finishTime = null;
          city.stats.buildingsConstructed = (city.stats.buildingsConstructed || 0) + 1;
          completedConstructions.push({ id: bld.id, name: spec ? spec.name : bld.type, level: bld.level });
        } else if (bld.status === 'upgrading') {
          bld.level = (bld.level || 1) + 1;
          bld.status = 'idle';
          bld.finishTime = null;
          city.stats.upgradesCompleted = (city.stats.upgradesCompleted || 0) + 1;
          completedUpgrades.push({ id: bld.id, name: spec ? spec.name : bld.type, level: bld.level });
        }
      }
    });

    // 2. Resolve military unit training queue
    if (city.trainingQueue.length > 0) {
      for (let i = city.trainingQueue.length - 1; i >= 0; i--) {
        const item = city.trainingQueue[i];
        if (now >= item.finishTime) {
          city.army[item.unitType] = (city.army[item.unitType] || 0) + item.count;
          city.trainingQueue.splice(i, 1);
        }
      }
    }

    // 3. Compute dynamic storage caps based on Treasury, Storage, and Tech
    let goldCap = CityConfig.RESOURCES.gold.baseStorage;
    let woodCap = CityConfig.RESOURCES.wood.baseStorage;
    let stoneCap = CityConfig.RESOURCES.stone.baseStorage;
    let foodCap = CityConfig.RESOURCES.food.baseStorage;

    city.buildings.forEach(bld => {
      if (bld.status === 'idle' || bld.status === 'upgrading') {
        const spec = CityConfig.BUILDINGS[bld.type];
        if (!spec) return;
        const levelData = spec.levels[Math.min(bld.level - 1, spec.levels.length - 1)];
        if (!levelData) return;

        if (bld.type === 'treasury' && levelData.goldCap) {
          goldCap += levelData.goldCap;
        } else if (bld.type === 'storage' && levelData.resourceCap) {
          woodCap += levelData.resourceCap;
          stoneCap += levelData.resourceCap;
          foodCap += levelData.resourceCap;
        }
      }
    });

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

    // 4. Compute troop housing capacity
    let troopCapacity = 25;
    city.buildings.forEach(bld => {
      const spec = CityConfig.BUILDINGS[bld.type];
      if (spec && (spec.category === CityConfig.CATEGORIES.MILITARY || bld.type === 'city_hall')) {
        const lvl = spec.levels[Math.min((bld.level || 1) - 1, spec.levels.length - 1)];
        if (lvl && lvl.troopCap) troopCapacity += lvl.troopCap;
      }
    });
    city.troopCapacity = troopCapacity;

    // 5. Compute dynamic production rates per minute
    let goldRate = 0;
    let woodRate = 0;
    let stoneRate = 0;
    let foodRate = 0;

    city.buildings.forEach(bld => {
      if (bld.status === 'idle' || bld.status === 'upgrading') {
        const spec = CityConfig.BUILDINGS[bld.type];
        if (!spec) return;
        const levelData = spec.levels[Math.min(bld.level - 1, spec.levels.length - 1)];
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
      }
    });

    // City Hall regional boost for Level 4+
    const cityHall = city.buildings.find(b => b.type === 'city_hall');
    if (cityHall && cityHall.level >= 4) {
      goldRate *= 1.15;
      woodRate *= 1.15;
      stoneRate *= 1.15;
      foodRate *= 1.15;
    }

    // 6. Accrue offline resources
    const minutes = elapsedSeconds / 60;
    const earned = {
      gold: Math.floor(goldRate * minutes),
      wood: Math.floor(woodRate * minutes),
      stone: Math.floor(stoneRate * minutes),
      food: Math.floor(foodRate * minutes)
    };

    if (elapsedSeconds > 0) {
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

    // 7. Calculate City Power rating
    let power = 100;
    city.buildings.forEach(bld => {
      power += (bld.level || 1) * 40;
      const spec = CityConfig.BUILDINGS[bld.type];
      const lvl = spec?.levels?.[Math.min((bld.level || 1) - 1, spec.levels.length - 1)];
      if (lvl?.power) power += lvl.power;
    });

    if (city.army) {
      power += (city.army.guardian || 0) * 15;
      power += (city.army.ranger || 0) * 22;
      power += (city.army.vanguard || 0) * 35;
      power += (city.army.heavy_defender || 0) * 48;
      power += (city.army.energy_mage || 0) * 60;
      power += (city.army.siege_unit || 0) * 75;
    }
    power += (city.unlockedTechs ? city.unlockedTechs.length : 0) * 100;
    city.power = power;

    city.lastTickTime = now;

    if (elapsedSeconds >= 15) {
      return {
        elapsedSeconds,
        earned,
        completedUpgrades,
        completedConstructions
      };
    }

    return null;
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

    if (spec.unique && city.buildings.some(b => b.type === type)) {
      return { error: `${spec.name} is already built. Only 1 is permitted.` };
    }

    const w = spec.size ? spec.size.w : 1;
    const h = spec.size ? spec.size.h : 1;
    if (x < 0 || y < 0 || x + w > CityConfig.GRID_SIZE || y + h > CityConfig.GRID_SIZE) {
      return { error: 'Placement coordinates are outside city borders.' };
    }

    const hasOverlap = city.buildings.some(b => {
      const bSpec = CityConfig.BUILDINGS[b.type] || { size: { w: 1, h: 1 } };
      const bw = bSpec.size ? bSpec.size.w : 1;
      const bh = bSpec.size ? bSpec.size.h : 1;
      return !(x + w <= b.x || x >= b.x + bw || y + h <= b.y || y >= b.y + bh);
    });
    if (hasOverlap) {
      return { error: 'Location is blocked by another structure.' };
    }

    const level1 = spec.levels[0];
    const cityHall = city.buildings.find(b => b.type === 'city_hall');
    const chLevel = cityHall ? cityHall.level : 1;
    if (level1.reqCityHall && chLevel < level1.reqCityHall) {
      return { error: `Requires City Hall Level ${level1.reqCityHall} to construct.` };
    }

    const cost = level1.cost;
    if (
      (city.resources.gold || 0) < (cost.gold || 0) ||
      (city.resources.wood || 0) < (cost.wood || 0) ||
      (city.resources.stone || 0) < (cost.stone || 0) ||
      (city.resources.food || 0) < (cost.food || 0)
    ) {
      return { error: 'Insufficient resources to construct this building.' };
    }

    city.resources.gold -= (cost.gold || 0);
    city.resources.wood -= (cost.wood || 0);
    city.resources.stone -= (cost.stone || 0);
    city.resources.food -= (cost.food || 0);

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
    city.stats.buildingsConstructed = (city.stats.buildingsConstructed || 0) + 1;

    this.applyTick(city);
    this.store.saveCitySave(userId, city);

    return { success: true, city, building: newBuilding };
  }

  /**
   * Upgrades an existing building to the next level
   */
  upgradeBuilding(userId, buildingId) {
    const { city } = this.getCity(userId);
    const building = city.buildings.find(b => b.id === buildingId);
    if (!building) return { error: 'Building not found' };
    if (building.status && building.status !== 'idle') return { error: 'Building is already busy undergoing construction' };

    const spec = CityConfig.BUILDINGS[building.type];
    if (building.level >= spec.maxLevel) return { error: 'Building has reached maximum upgrade level' };

    const nextLevelSpec = spec.levels[building.level];
    if (!nextLevelSpec) return { error: 'No upgrade path available' };

    const cityHall = city.buildings.find(b => b.type === 'city_hall');
    const chLevel = cityHall ? cityHall.level : 1;
    if (nextLevelSpec.reqCityHall && chLevel < nextLevelSpec.reqCityHall) {
      return { error: `Requires City Hall Level ${nextLevelSpec.reqCityHall} to upgrade.` };
    }

    const cost = nextLevelSpec.cost;
    if (
      (city.resources.gold || 0) < (cost.gold || 0) ||
      (city.resources.wood || 0) < (cost.wood || 0) ||
      (city.resources.stone || 0) < (cost.stone || 0) ||
      (city.resources.food || 0) < (cost.food || 0)
    ) {
      return { error: 'Insufficient resources to upgrade this building.' };
    }

    city.resources.gold -= (cost.gold || 0);
    city.resources.wood -= (cost.wood || 0);
    city.resources.stone -= (cost.stone || 0);
    city.resources.food -= (cost.food || 0);

    let duration = nextLevelSpec.time;
    if (city.unlockedTechs && city.unlockedTechs.includes('scaffolding')) {
      duration = Math.max(2, Math.floor(duration * 0.85));
    }

    building.status = 'upgrading';
    building.finishTime = Date.now() + duration * 1000;

    this.store.saveCitySave(userId, city);
    return { success: true, city, building };
  }

  /**
   * Instant speedup using premium gems
   */
  speedup(userId, buildingId) {
    const { city } = this.getCity(userId);
    const building = city.buildings.find(b => b.id === buildingId);
    if (!building || !building.finishTime) return { error: 'Building has no active timer' };

    const remainingSeconds = Math.max(0, Math.ceil((building.finishTime - Date.now()) / 1000));
    const gemCost = Math.max(1, Math.ceil(remainingSeconds / 60));

    if ((city.resources.gems || 0) < gemCost) {
      return { error: `Need ${gemCost} Gems for instant speedup.` };
    }

    city.resources.gems -= gemCost;
    if (building.status === 'upgrading') {
      building.level = (building.level || 1) + 1;
      city.stats.upgradesCompleted = (city.stats.upgradesCompleted || 0) + 1;
    } else if (building.status === 'constructing') {
      city.stats.buildingsConstructed = (city.stats.buildingsConstructed || 0) + 1;
    }

    building.status = 'idle';
    building.finishTime = null;

    this.applyTick(city);
    this.store.saveCitySave(userId, city);

    return { success: true, city, building, gemsSpent: gemCost };
  }

  /**
   * Relocates a building
   */
  moveBuilding(userId, buildingId, newX, newY) {
    const { city } = this.getCity(userId);
    const building = city.buildings.find(b => b.id === buildingId);
    if (!building) return { error: 'Building not found' };

    const spec = CityConfig.BUILDINGS[building.type] || { size: { w: 1, h: 1 } };
    const w = spec.size.w;
    const h = spec.size.h;

    if (newX < 0 || newY < 0 || newX + w > CityConfig.GRID_SIZE || newY + h > CityConfig.GRID_SIZE) {
      return { error: 'Target coordinates are outside city borders.' };
    }

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
   * Enqueues unit training
   */
  trainUnits(userId, unitType, count) {
    const { city } = this.getCity(userId);
    const unitSpec = CityConfig.UNITS[unitType];
    if (!unitSpec) return { error: 'Unknown unit type' };

    count = parseInt(count, 10);
    if (isNaN(count) || count <= 0) return { error: 'Invalid recruit count' };

    // Check building requirement
    const requiredBuilding = city.buildings.find(b => b.type === unitSpec.reqBuilding && b.status === 'idle');
    if (!requiredBuilding) {
      const bName = CityConfig.BUILDINGS[unitSpec.reqBuilding]?.name || unitSpec.reqBuilding;
      return { error: `Requires ${bName} to recruit ${unitSpec.name}.` };
    }
    if (requiredBuilding.level < unitSpec.reqLevel) {
      return { error: `Requires ${CityConfig.BUILDINGS[unitSpec.reqBuilding].name} Level ${unitSpec.reqLevel}.` };
    }

    // Check housing space
    let currentArmyHousing = 0;
    if (city.army) {
      for (const [uType, uCount] of Object.entries(city.army)) {
        const uSpec = CityConfig.UNITS[uType];
        if (uSpec) currentArmyHousing += (uCount || 0) * (uSpec.housing || 1);
      }
    }
    const neededHousing = count * (unitSpec.housing || 1);
    if (currentArmyHousing + neededHousing > (city.troopCapacity || 25)) {
      return { error: `Exceeds troop housing capacity (${currentArmyHousing + neededHousing}/${city.troopCapacity}). Upgrade Training Grounds to expand capacity.` };
    }

    // Check costs
    const totalCost = {
      gold: (unitSpec.cost.gold || 0) * count,
      wood: (unitSpec.cost.wood || 0) * count,
      stone: (unitSpec.cost.stone || 0) * count,
      food: (unitSpec.cost.food || 0) * count
    };

    if (
      (city.resources.gold || 0) < totalCost.gold ||
      (city.resources.wood || 0) < totalCost.wood ||
      (city.resources.stone || 0) < totalCost.stone ||
      (city.resources.food || 0) < totalCost.food
    ) {
      return { error: 'Insufficient resources to train recruits.' };
    }

    // Deduct resources
    city.resources.gold -= totalCost.gold;
    city.resources.wood -= totalCost.wood;
    city.resources.stone -= totalCost.stone;
    city.resources.food -= totalCost.food;

    // Calculate queue finish time
    const now = Date.now();
    let queueStart = now;
    if (city.trainingQueue.length > 0) {
      const last = city.trainingQueue[city.trainingQueue.length - 1];
      if (last.finishTime > now) queueStart = last.finishTime;
    }
    const duration = unitSpec.trainTime * count * 1000;
    const queueItem = {
      id: `tr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      unitType,
      count,
      startTime: queueStart,
      finishTime: queueStart + duration
    };

    city.trainingQueue.push(queueItem);
    this.store.saveCitySave(userId, city);

    return { success: true, city, queueItem };
  }

  /**
   * Executes tactical AI battle against World Map Stronghold
   */
  executeBattle(userId, strongholdId, deployedUnits) {
    const { city } = this.getCity(userId);
    const stronghold = CityConfig.WORLD_STRONGHOLDS.find(s => s.id === strongholdId);
    if (!stronghold) return { error: 'Stronghold does not exist' };

    if (!city.army) return { error: 'No army available' };

    // Validate player owns the deployed units
    let totalDeployedPower = 0;
    let totalTroops = 0;
    for (const [uType, count] of Object.entries(deployedUnits)) {
      const available = city.army[uType] || 0;
      if (count > available) {
        return { error: `Cannot deploy more ${uType}s than available in barracks.` };
      }
      totalTroops += count;
      const uSpec = CityConfig.UNITS[uType];
      if (uSpec) {
        totalDeployedPower += count * (uSpec.damage * 2 + uSpec.hp / 5);
      }
    }

    if (totalTroops === 0) {
      return { error: 'Must deploy at least 1 unit to initiate battle.' };
    }

    // Battle simulation
    const difficultyRatio = totalDeployedPower / stronghold.recommendedPower;
    const isVictory = difficultyRatio >= 0.70;

    let stars = 0;
    if (isVictory) {
      stars = difficultyRatio >= 1.4 ? 3 : (difficultyRatio >= 1.0 ? 2 : 1);
    }

    // Casualties calculation (15% to 35% on victory, 60% on defeat)
    const casualtyRate = isVictory ? Math.max(0.1, 0.35 - (difficultyRatio - 0.7) * 0.2) : 0.65;
    const casualties = {};
    for (const [uType, count] of Object.entries(deployedUnits)) {
      const lost = Math.min(count, Math.ceil(count * casualtyRate));
      casualties[uType] = lost;
      city.army[uType] = Math.max(0, (city.army[uType] || 0) - lost);
    }

    // Award plunder loot upon victory
    let earnedLoot = null;
    if (isVictory) {
      earnedLoot = JSON.parse(JSON.stringify(stronghold.loot));
      city.resources.gold = Math.min(city.storageCaps.gold, (city.resources.gold || 0) + earnedLoot.gold);
      city.resources.wood = Math.min(city.storageCaps.wood, (city.resources.wood || 0) + earnedLoot.wood);
      city.resources.stone = Math.min(city.storageCaps.stone, (city.resources.stone || 0) + earnedLoot.stone);
      city.resources.food = Math.min(city.storageCaps.food, (city.resources.food || 0) + earnedLoot.food);
      city.resources.gems = (city.resources.gems || 0) + earnedLoot.gems;
      city.xp = (city.xp || 0) + earnedLoot.xp;

      if (!city.completedStrongholds.includes(strongholdId)) {
        city.completedStrongholds.push(strongholdId);
      }
      city.stats.battlesWon = (city.stats.battlesWon || 0) + 1;
    }

    this.applyTick(city);
    this.store.saveCitySave(userId, city);

    return {
      success: true,
      victory: isVictory,
      stars,
      casualties,
      loot: earnedLoot,
      city
    };
  }

  /**
   * Claims a daily mission reward
   */
  claimDailyMission(userId, missionId) {
    const { city } = this.getCity(userId);
    const mission = city.dailyMissions?.find(m => m.id === missionId);
    if (!mission) return { error: 'Mission not found' };
    if (mission.completed) return { error: 'Mission already claimed' };

    mission.completed = true;
    if (mission.reward.gold) city.resources.gold += mission.reward.gold;
    if (mission.reward.wood) city.resources.wood += mission.reward.wood;
    if (mission.reward.stone) city.resources.stone += mission.reward.stone;
    if (mission.reward.food) city.resources.food += mission.reward.food;
    if (mission.reward.gems) city.resources.gems += mission.reward.gems;
    if (mission.reward.xp) city.xp = (city.xp || 0) + mission.reward.xp;

    this.store.saveCitySave(userId, city);
    return { success: true, city, reward: mission.reward };
  }

  /**
   * Trades resources at Marketplace
   */
  trade(userId, fromRes, toRes, amount) {
    const { city } = this.getCity(userId);
    const market = city.buildings.find(b => b.type === 'marketplace' && b.status === 'idle');
    if (!market) return { error: 'Requires an active Marketplace to conduct trade.' };

    if (!CityConfig.RESOURCES[fromRes] || !CityConfig.RESOURCES[toRes] || fromRes === toRes) {
      return { error: 'Invalid resource pair selected for trade.' };
    }

    amount = parseInt(amount, 10);
    if (isNaN(amount) || amount <= 0) return { error: 'Trade amount must be positive.' };

    if ((city.resources[fromRes] || 0) < amount) {
      return { error: `Insufficient ${CityConfig.RESOURCES[fromRes].name} to trade.` };
    }

    const spec = CityConfig.BUILDINGS.marketplace;
    const levelSpec = spec.levels[Math.min(market.level - 1, spec.levels.length - 1)];
    const feePercent = levelSpec ? levelSpec.tradeFee : 0.25;

    const received = Math.floor(amount * (1 - feePercent));
    const capTo = (city.storageCaps && city.storageCaps[toRes]) || 5000;

    city.resources[fromRes] -= amount;
    city.resources[toRes] = Math.min(capTo, (city.resources[toRes] || 0) + received);

    this.store.saveCitySave(userId, city);
    return { success: true, city, traded: amount, received };
  }

  /**
   * Researches a technology in the Academy
   */
  research(userId, techId) {
    const { city } = this.getCity(userId);
    const academy = city.buildings.find(b => b.type === 'research_center' && b.status === 'idle');
    if (!academy) return { error: 'Requires an active Academy of Science.' };

    const tech = CityConfig.TECH_TREE.find(t => t.id === techId);
    if (!tech) return { error: 'Unknown technology.' };

    city.unlockedTechs = city.unlockedTechs || [];
    if (city.unlockedTechs.includes(techId)) return { error: 'Technology already researched.' };

    if (academy.level < tech.tier) return { error: `Requires Academy of Science Level ${tech.tier}.` };

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
    this.applyTick(city);
    this.store.saveCitySave(userId, city);

    return { success: true, city, tech };
  }

  /**
   * Resets city to starter template
   */
  resetCity(userId, userName = 'Mayor') {
    const fresh = CityConfig.createStarterCity(userId, userName);
    this.store.saveCitySave(userId, fresh);
    return { success: true, city: fresh };
  }
}

module.exports = CityBuilderManager;
