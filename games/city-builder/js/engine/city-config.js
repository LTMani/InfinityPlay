/**
 * InfinityPlay - City Builder Strategy Game Configuration (V2)
 * Shared authoritative game balance, building specifications (Levels 1 - 10),
 * military units, defense structures, tech tree, campaign battle maps, and formulas.
 */

(function(exports) {
  'use strict';

  // Grid dimensions for an expansive living city
  const GRID_SIZE = 26; // 26x26 isometric tiles

  // Resource types & display metadata
  const RESOURCES = {
    gold: { id: 'gold', name: 'Gold', icon: '🪙', color: '#fbbf24', baseStorage: 3000 },
    wood: { id: 'wood', name: 'Wood', icon: '🪵', color: '#a16207', baseStorage: 2500 },
    stone: { id: 'stone', name: 'Stone', icon: '🪨', color: '#94a3b8', baseStorage: 2000 },
    food: { id: 'food', name: 'Food', icon: '🌾', color: '#22c55e', baseStorage: 2500 },
    gems: { id: 'gems', name: 'Gems', icon: '💎', color: '#06b6d4', baseStorage: 999999 } // Premium/Earnable
  };

  // Building Categories
  const CATEGORIES = {
    CORE: 'Core',
    RESOURCES: 'Resources',
    DEVELOPMENT: 'Development',
    MILITARY: 'Military',
    DEFENSE: 'Defense',
    DECORATIONS: 'Decorations'
  };

  // Building Types & Specifications (Levels 1 - 10 with progressive stat growth)
  const BUILDINGS = {
    // -------------------------------------------------------------
    // CORE BUILDINGS
    // -------------------------------------------------------------
    city_hall: {
      type: 'city_hall',
      name: 'City Command Center',
      category: CATEGORIES.CORE,
      icon: '🏛️',
      description: 'The administrative heart of your city. Upgrading unlocks advanced buildings, defenses, and higher upgrade tiers.',
      size: { w: 2, h: 2 },
      maxLevel: 10,
      unique: true,
      levels: [
        { level: 1, cost: { gold: 0, wood: 0, stone: 0, food: 0 }, time: 0, reqCityHall: 1, popCap: 60, desc: 'City administration center. Max building level: 1.' },
        { level: 2, cost: { gold: 400, wood: 500, stone: 300, food: 200 }, time: 20, reqCityHall: 1, popCap: 140, desc: 'Unlocks Level 2 upgrades, Training Grounds, Watch Towers.' },
        { level: 3, cost: { gold: 1200, wood: 1500, stone: 1000, food: 800 }, time: 60, reqCityHall: 2, popCap: 300, desc: 'Unlocks Level 3 upgrades, Defense Cannons, Grand Bazaar.' },
        { level: 4, cost: { gold: 3000, wood: 3500, stone: 2800, food: 2000 }, time: 150, reqCityHall: 3, popCap: 600, desc: 'Unlocks Level 4 upgrades, Warrior Academy, +15% citywide yield.' },
        { level: 5, cost: { gold: 7000, wood: 8000, stone: 6500, food: 5000 }, time: 300, reqCityHall: 4, popCap: 1200, desc: 'Metropolitan status. Unlocks Level 5 upgrades, Energy Towers.' },
        { level: 6, cost: { gold: 15000, wood: 18000, stone: 14000, food: 11000 }, time: 600, reqCityHall: 5, popCap: 2400, desc: 'Grand Empire Capitol. Unlocks Unit Workshop & Level 6.' },
        { level: 7, cost: { gold: 30000, wood: 35000, stone: 28000, food: 22000 }, time: 1200, reqCityHall: 6, popCap: 4500, desc: 'Majestic Metropolis. Unlocks Level 7 upgrades.' },
        { level: 8, cost: { gold: 60000, wood: 70000, stone: 55000, food: 45000 }, time: 2400, reqCityHall: 7, popCap: 8500, desc: 'Sovereign Citadel. Unlocks Level 8 upgrades.' },
        { level: 9, cost: { gold: 120000, wood: 140000, stone: 110000, food: 90000 }, time: 4800, reqCityHall: 8, popCap: 15000, desc: 'Imperial Domain. Unlocks Level 9 upgrades.' },
        { level: 10, cost: { gold: 250000, wood: 280000, stone: 220000, food: 180000 }, time: 9600, reqCityHall: 9, popCap: 30000, desc: 'Apex Wonder Capitol. Maximum prosperity and military supremacy.' }
      ]
    },

    treasury: {
      type: 'treasury',
      name: 'Treasury Vault',
      category: CATEGORIES.CORE,
      icon: '🏦',
      description: 'Fortified subterranean vaults securing your empire’s wealth. Expands maximum Gold storage limit.',
      size: { w: 2, h: 2 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 200, wood: 300, stone: 150, food: 0 }, time: 15, reqCityHall: 1, goldCap: 6000, desc: 'Stores up to 6,000 Gold.' },
        { level: 2, cost: { gold: 600, wood: 800, stone: 500, food: 0 }, time: 45, reqCityHall: 2, goldCap: 15000, desc: 'Stores up to 15,000 Gold.' },
        { level: 3, cost: { gold: 1500, wood: 2000, stone: 1400, food: 0 }, time: 120, reqCityHall: 3, goldCap: 35000, desc: 'Stores up to 35,000 Gold.' },
        { level: 4, cost: { gold: 3500, wood: 4500, stone: 3200, food: 0 }, time: 240, reqCityHall: 4, goldCap: 75000, desc: 'Stores up to 75,000 Gold.' },
        { level: 5, cost: { gold: 8000, wood: 10000, stone: 7500, food: 0 }, time: 480, reqCityHall: 5, goldCap: 160000, desc: 'Stores up to 160,000 Gold.' },
        { level: 6, cost: { gold: 18000, wood: 22000, stone: 16000, food: 0 }, time: 900, reqCityHall: 6, goldCap: 350000, desc: 'Stores up to 350,000 Gold.' },
        { level: 7, cost: { gold: 38000, wood: 45000, stone: 34000, food: 0 }, time: 1800, reqCityHall: 7, goldCap: 750000, desc: 'Stores up to 750,000 Gold.' },
        { level: 8, cost: { gold: 80000, wood: 95000, stone: 72000, food: 0 }, time: 3600, reqCityHall: 8, goldCap: 1600000, desc: 'Stores up to 1,600,000 Gold.' },
        { level: 9, cost: { gold: 160000, wood: 190000, stone: 145000, food: 0 }, time: 7200, reqCityHall: 9, goldCap: 3500000, desc: 'Stores up to 3,500,000 Gold.' },
        { level: 10, cost: { gold: 320000, wood: 380000, stone: 290000, food: 0 }, time: 14400, reqCityHall: 10, goldCap: 8000000, desc: 'Apex Vault: Stores 8,000,000 Gold.' }
      ]
    },

    storage: {
      type: 'storage',
      name: 'Storage Depot',
      category: CATEGORIES.CORE,
      icon: '📦',
      description: 'Expansive reinforced warehouses expanding maximum storage capacities for Wood, Stone, and Food.',
      size: { w: 2, h: 2 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 150, wood: 200, stone: 200, food: 0 }, time: 15, reqCityHall: 1, resourceCap: 5000, desc: 'Increases Wood, Stone, and Food cap to 5,000 each.' },
        { level: 2, cost: { gold: 500, wood: 700, stone: 700, food: 0 }, time: 40, reqCityHall: 2, resourceCap: 12000, desc: 'Increases capacity to 12,000 each.' },
        { level: 3, cost: { gold: 1300, wood: 1800, stone: 1800, food: 0 }, time: 100, reqCityHall: 3, resourceCap: 30000, desc: 'Increases capacity to 30,000 each.' },
        { level: 4, cost: { gold: 3200, wood: 4000, stone: 4000, food: 0 }, time: 220, reqCityHall: 4, resourceCap: 65000, desc: 'Increases capacity to 65,000 each.' },
        { level: 5, cost: { gold: 7500, wood: 9000, stone: 9000, food: 0 }, time: 420, reqCityHall: 5, resourceCap: 140000, desc: 'Increases capacity to 140,000 each.' },
        { level: 6, cost: { gold: 16000, wood: 20000, stone: 20000, food: 0 }, time: 800, reqCityHall: 6, resourceCap: 300000, desc: 'Increases capacity to 300,000 each.' },
        { level: 7, cost: { gold: 35000, wood: 42000, stone: 42000, food: 0 }, time: 1600, reqCityHall: 7, resourceCap: 650000, desc: 'Increases capacity to 650,000 each.' },
        { level: 8, cost: { gold: 72000, wood: 88000, stone: 88000, food: 0 }, time: 3200, reqCityHall: 8, resourceCap: 1400000, desc: 'Increases capacity to 1,400,000 each.' },
        { level: 9, cost: { gold: 150000, wood: 180000, stone: 180000, food: 0 }, time: 6400, reqCityHall: 9, resourceCap: 3000000, desc: 'Increases capacity to 3,000,000 each.' },
        { level: 10, cost: { gold: 300000, wood: 360000, stone: 360000, food: 0 }, time: 12800, reqCityHall: 10, resourceCap: 7000000, desc: 'Apex Depot: 7,000,000 resource capacity.' }
      ]
    },

    // -------------------------------------------------------------
    // RESOURCE BUILDINGS
    // -------------------------------------------------------------
    gold_mine: {
      type: 'gold_mine',
      name: 'Gold Extractor',
      category: CATEGORIES.RESOURCES,
      icon: '⛏️',
      description: 'Excavates deep ore veins to extract pure gold bullion continuously for your city treasury.',
      size: { w: 1, h: 1 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 100, wood: 150, stone: 100, food: 50 }, time: 10, reqCityHall: 1, rate: 16, desc: '+16 Gold / minute' },
        { level: 2, cost: { gold: 300, wood: 400, stone: 300, food: 150 }, time: 30, reqCityHall: 1, rate: 38, desc: '+38 Gold / minute' },
        { level: 3, cost: { gold: 800, wood: 1000, stone: 750, food: 400 }, time: 75, reqCityHall: 2, rate: 85, desc: '+85 Gold / minute' },
        { level: 4, cost: { gold: 2000, wood: 2400, stone: 1800, food: 900 }, time: 160, reqCityHall: 3, rate: 180, desc: '+180 Gold / minute' },
        { level: 5, cost: { gold: 4800, wood: 5600, stone: 4200, food: 2100 }, time: 320, reqCityHall: 4, rate: 380, desc: '+380 Gold / minute' },
        { level: 6, cost: { gold: 11000, wood: 13000, stone: 9500, food: 4800 }, time: 640, reqCityHall: 5, rate: 800, desc: '+800 Gold / minute' },
        { level: 7, cost: { gold: 24000, wood: 28000, stone: 21000, food: 10500 }, time: 1200, reqCityHall: 6, rate: 1650, desc: '+1,650 Gold / minute' },
        { level: 8, cost: { gold: 50000, wood: 60000, stone: 44000, food: 22000 }, time: 2400, reqCityHall: 7, rate: 3400, desc: '+3,400 Gold / minute' },
        { level: 9, cost: { gold: 105000, wood: 125000, stone: 92000, food: 46000 }, time: 4800, reqCityHall: 8, rate: 7000, desc: '+7,000 Gold / minute' },
        { level: 10, cost: { gold: 220000, wood: 260000, stone: 190000, food: 95000 }, time: 9600, reqCityHall: 9, rate: 14500, desc: '+14,500 Gold / minute' }
      ]
    },

    lumber_yard: {
      type: 'lumber_yard',
      name: 'Timber Works',
      category: CATEGORIES.RESOURCES,
      icon: '🪓',
      description: 'Harvests timber and produces treated wood beams essential for building structures and training ranged units.',
      size: { w: 1, h: 1 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 80, wood: 50, stone: 80, food: 40 }, time: 8, reqCityHall: 1, rate: 20, desc: '+20 Wood / minute' },
        { level: 2, cost: { gold: 240, wood: 150, stone: 240, food: 120 }, time: 25, reqCityHall: 1, rate: 48, desc: '+48 Wood / minute' },
        { level: 3, cost: { gold: 650, wood: 400, stone: 650, food: 320 }, time: 60, reqCityHall: 2, rate: 110, desc: '+110 Wood / minute' },
        { level: 4, cost: { gold: 1600, wood: 1000, stone: 1600, food: 800 }, time: 130, reqCityHall: 3, rate: 230, desc: '+230 Wood / minute' },
        { level: 5, cost: { gold: 3800, wood: 2400, stone: 3800, food: 1800 }, time: 260, reqCityHall: 4, rate: 480, desc: '+480 Wood / minute' },
        { level: 6, cost: { gold: 9000, wood: 5500, stone: 9000, food: 4200 }, time: 520, reqCityHall: 5, rate: 1000, desc: '+1,000 Wood / minute' },
        { level: 7, cost: { gold: 20000, wood: 12000, stone: 20000, food: 9500 }, time: 1000, reqCityHall: 6, rate: 2100, desc: '+2,100 Wood / minute' },
        { level: 8, cost: { gold: 42000, wood: 26000, stone: 42000, food: 20000 }, time: 2000, reqCityHall: 7, rate: 4300, desc: '+4,300 Wood / minute' },
        { level: 9, cost: { gold: 88000, wood: 54000, stone: 88000, food: 42000 }, time: 4000, reqCityHall: 8, rate: 8800, desc: '+8,800 Wood / minute' },
        { level: 10, cost: { gold: 180000, wood: 110000, stone: 180000, food: 85000 }, time: 8000, reqCityHall: 9, rate: 18000, desc: '+18,000 Wood / minute' }
      ]
    },

    stone_quarry: {
      type: 'stone_quarry',
      name: 'Stone Foundry',
      category: CATEGORIES.RESOURCES,
      icon: '🧱',
      description: 'Quarries dense stone and casts fortified blocks vital for thick defensive walls and structural tiers.',
      size: { w: 1, h: 1 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 120, wood: 160, stone: 40, food: 50 }, time: 12, reqCityHall: 1, rate: 18, desc: '+18 Stone / minute' },
        { level: 2, cost: { gold: 340, wood: 420, stone: 120, food: 140 }, time: 35, reqCityHall: 1, rate: 42, desc: '+42 Stone / minute' },
        { level: 3, cost: { gold: 850, wood: 1050, stone: 300, food: 350 }, time: 80, reqCityHall: 2, rate: 95, desc: '+95 Stone / minute' },
        { level: 4, cost: { gold: 2100, wood: 2500, stone: 750, food: 850 }, time: 170, reqCityHall: 3, rate: 200, desc: '+200 Stone / minute' },
        { level: 5, cost: { gold: 5000, wood: 6000, stone: 1800, food: 2000 }, time: 340, reqCityHall: 4, rate: 420, desc: '+420 Stone / minute' },
        { level: 6, cost: { gold: 12000, wood: 14000, stone: 4200, food: 4600 }, time: 680, reqCityHall: 5, rate: 900, desc: '+900 Stone / minute' },
        { level: 7, cost: { gold: 26000, wood: 30000, stone: 9000, food: 10000 }, time: 1300, reqCityHall: 6, rate: 1850, desc: '+1,850 Stone / minute' },
        { level: 8, cost: { gold: 54000, wood: 64000, stone: 19000, food: 21000 }, time: 2600, reqCityHall: 7, rate: 3800, desc: '+3,800 Stone / minute' },
        { level: 9, cost: { gold: 112000, wood: 132000, stone: 40000, food: 44000 }, time: 5200, reqCityHall: 8, rate: 7800, desc: '+7,800 Stone / minute' },
        { level: 10, cost: { gold: 230000, wood: 270000, stone: 82000, food: 90000 }, time: 10400, reqCityHall: 9, rate: 16000, desc: '+16,000 Stone / minute' }
      ]
    },

    farm: {
      type: 'farm',
      name: 'Food Farm',
      category: CATEGORIES.RESOURCES,
      icon: '🚜',
      description: 'Grows golden crops and grain supplies to sustain population growth and train military battalions.',
      size: { w: 1, h: 1 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 70, wood: 120, stone: 50, food: 0 }, time: 8, reqCityHall: 1, rate: 24, desc: '+24 Food / minute' },
        { level: 2, cost: { gold: 200, wood: 320, stone: 140, food: 0 }, time: 22, reqCityHall: 1, rate: 58, desc: '+58 Food / minute' },
        { level: 3, cost: { gold: 550, wood: 850, stone: 380, food: 0 }, time: 55, reqCityHall: 2, rate: 130, desc: '+130 Food / minute' },
        { level: 4, cost: { gold: 1400, wood: 2100, stone: 950, food: 0 }, time: 120, reqCityHall: 3, rate: 270, desc: '+270 Food / minute' },
        { level: 5, cost: { gold: 3400, wood: 5000, stone: 2300, food: 0 }, time: 240, reqCityHall: 4, rate: 550, desc: '+550 Food / minute' },
        { level: 6, cost: { gold: 8000, wood: 11500, stone: 5300, food: 0 }, time: 480, reqCityHall: 5, rate: 1150, desc: '+1,150 Food / minute' },
        { level: 7, cost: { gold: 18000, wood: 25000, stone: 11500, food: 0 }, time: 950, reqCityHall: 6, rate: 2400, desc: '+2,400 Food / minute' },
        { level: 8, cost: { gold: 38000, wood: 54000, stone: 25000, food: 0 }, time: 1900, reqCityHall: 7, rate: 4900, desc: '+4,900 Food / minute' },
        { level: 9, cost: { gold: 80000, wood: 112000, stone: 52000, food: 0 }, time: 3800, reqCityHall: 8, rate: 10000, desc: '+10,000 Food / minute' },
        { level: 10, cost: { gold: 165000, wood: 230000, stone: 105000, food: 0 }, time: 7600, reqCityHall: 9, rate: 21000, desc: '+21,000 Food / minute' }
      ]
    },

    // -------------------------------------------------------------
    // DEVELOPMENT BUILDINGS
    // -------------------------------------------------------------
    marketplace: {
      type: 'marketplace',
      name: 'Marketplace',
      category: CATEGORIES.DEVELOPMENT,
      icon: '⚖️',
      description: 'A thriving international trade exchange allowing you to convert surplus materials into other vital resources.',
      size: { w: 2, h: 2 },
      maxLevel: 5,
      unique: true,
      levels: [
        { level: 1, cost: { gold: 500, wood: 600, stone: 400, food: 300 }, time: 30, reqCityHall: 2, tradeFee: 0.25, desc: 'Enables resource trading with 25% tariff.' },
        { level: 2, cost: { gold: 1500, wood: 1800, stone: 1200, food: 900 }, time: 90, reqCityHall: 3, tradeFee: 0.20, desc: 'Reduces trade tariff to 20%.' },
        { level: 3, cost: { gold: 4000, wood: 4800, stone: 3200, food: 2400 }, time: 200, reqCityHall: 4, tradeFee: 0.15, desc: 'Reduces trade tariff to 15%.' },
        { level: 4, cost: { gold: 10000, wood: 12000, stone: 8000, food: 6000 }, time: 450, reqCityHall: 5, tradeFee: 0.10, desc: 'Reduces trade tariff to 10%.' },
        { level: 5, cost: { gold: 25000, wood: 30000, stone: 20000, food: 15000 }, time: 900, reqCityHall: 6, tradeFee: 0.05, desc: 'Free Trade Hub: Only 5% tariff.' }
      ]
    },

    research_center: {
      type: 'research_center',
      name: 'Research Institute',
      category: CATEGORIES.DEVELOPMENT,
      icon: '🔬',
      description: 'Fosters scholars and alchemists uncovering groundbreaking technologies across Economy, Construction, Military, and Defense.',
      size: { w: 2, h: 2 },
      maxLevel: 5,
      unique: true,
      levels: [
        { level: 1, cost: { gold: 1000, wood: 1200, stone: 900, food: 600 }, time: 45, reqCityHall: 3, techTier: 1, desc: 'Unlocks Tier 1 scientific research.' },
        { level: 2, cost: { gold: 3000, wood: 3600, stone: 2700, food: 1800 }, time: 150, reqCityHall: 4, techTier: 2, desc: 'Unlocks Tier 2 advanced innovations.' },
        { level: 3, cost: { gold: 8000, wood: 9500, stone: 7200, food: 4800 }, time: 360, reqCityHall: 5, techTier: 3, desc: 'Unlocks Tier 3 master discoveries.' },
        { level: 4, cost: { gold: 20000, wood: 24000, stone: 18000, food: 12000 }, time: 800, reqCityHall: 6, techTier: 4, desc: 'Unlocks Tier 4 industrial breakthroughs.' },
        { level: 5, cost: { gold: 50000, wood: 60000, stone: 45000, food: 30000 }, time: 1800, reqCityHall: 7, techTier: 5, desc: 'Apex Academy: Unlocks celestial wonder technologies.' }
      ]
    },

    // -------------------------------------------------------------
    // MILITARY BUILDINGS
    // -------------------------------------------------------------
    training_grounds: {
      type: 'training_grounds',
      name: 'Training Grounds',
      category: CATEGORIES.MILITARY,
      icon: '⚔️',
      description: 'Infantry barracks for training brave Guardians, sharpshooter Rangers, and rapid Vanguards.',
      size: { w: 2, h: 2 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 300, wood: 400, stone: 200, food: 150 }, time: 20, reqCityHall: 2, armyCap: 30, desc: 'Trains Guardians. Army Cap: 30 units.' },
        { level: 2, cost: { gold: 700, wood: 900, stone: 500, food: 350 }, time: 50, reqCityHall: 2, armyCap: 50, desc: 'Trains Rangers. Army Cap: 50 units.' },
        { level: 3, cost: { gold: 1600, wood: 2000, stone: 1200, food: 800 }, time: 120, reqCityHall: 3, armyCap: 75, desc: 'Trains Vanguards. Army Cap: 75 units.' },
        { level: 4, cost: { gold: 3800, wood: 4600, stone: 2800, food: 1900 }, time: 250, reqCityHall: 4, armyCap: 110, desc: '+10% infantry training speed. Army Cap: 110.' },
        { level: 5, cost: { gold: 8500, wood: 10500, stone: 6500, food: 4200 }, time: 500, reqCityHall: 5, armyCap: 150, desc: 'Master Barracks. Army Cap: 150 units.' },
        { level: 6, cost: { gold: 18000, wood: 22000, stone: 14000, food: 9000 }, time: 1000, reqCityHall: 6, armyCap: 200, desc: 'Grand Warhall. Army Cap: 200 units.' },
        { level: 7, cost: { gold: 38000, wood: 46000, stone: 29000, food: 19000 }, time: 2000, reqCityHall: 7, armyCap: 260, desc: 'Imperial Legion Camp. Army Cap: 260 units.' },
        { level: 8, cost: { gold: 78000, wood: 94000, stone: 60000, food: 39000 }, time: 4000, reqCityHall: 8, armyCap: 340, desc: 'Warlord Bastion. Army Cap: 340 units.' },
        { level: 9, cost: { gold: 160000, wood: 190000, stone: 120000, food: 80000 }, time: 8000, reqCityHall: 9, armyCap: 440, desc: 'Supreme High Command. Army Cap: 440 units.' },
        { level: 10, cost: { gold: 320000, wood: 380000, stone: 240000, food: 160000 }, time: 16000, reqCityHall: 10, armyCap: 600, desc: 'Apex War Fortress. Army Cap: 600 units.' }
      ]
    },

    warrior_academy: {
      type: 'warrior_academy',
      name: 'Warrior Academy',
      category: CATEGORIES.MILITARY,
      icon: '🛡️',
      description: 'Elite martial institute conditioning Heavy Defenders and channeling mystical Energy Mages.',
      size: { w: 2, h: 2 },
      maxLevel: 5,
      unique: true,
      levels: [
        { level: 1, cost: { gold: 3500, wood: 4000, stone: 3000, food: 2500 }, time: 180, reqCityHall: 4, desc: 'Trains Heavy Defenders. Unlocks elite combat tactics.' },
        { level: 2, cost: { gold: 8000, wood: 9000, stone: 7000, food: 6000 }, time: 400, reqCityHall: 5, desc: 'Trains Energy Mages. +15% elite unit HP.' },
        { level: 3, cost: { gold: 18000, wood: 20000, stone: 16000, food: 14000 }, time: 800, reqCityHall: 6, desc: '+15% elite unit spell and weapon damage.' },
        { level: 4, cost: { gold: 40000, wood: 45000, stone: 36000, food: 32000 }, time: 1600, reqCityHall: 7, desc: 'Reduces elite troop training time by 20%.' },
        { level: 5, cost: { gold: 90000, wood: 100000, stone: 80000, food: 70000 }, time: 3200, reqCityHall: 8, desc: 'Apex Academy: Champions gain +25% attack speed.' }
      ]
    },

    unit_workshop: {
      type: 'unit_workshop',
      name: 'Unit Workshop',
      category: CATEGORIES.MILITARY,
      icon: '⚙️',
      description: 'Heavy engineering foundries constructing armored Siege Engines capable of shattering enemy walls.',
      size: { w: 2, h: 2 },
      maxLevel: 5,
      unique: true,
      levels: [
        { level: 1, cost: { gold: 12000, wood: 15000, stone: 14000, food: 8000 }, time: 450, reqCityHall: 6, desc: 'Constructs Siege Units with massive anti-fortification bonus.' },
        { level: 2, cost: { gold: 26000, wood: 32000, stone: 30000, food: 18000 }, time: 900, reqCityHall: 7, desc: 'Boosts Siege Unit armor and blast radius by 20%.' },
        { level: 3, cost: { gold: 55000, wood: 68000, stone: 64000, food: 38000 }, time: 1800, reqCityHall: 8, desc: '+25% Siege Engine damage against defensive cannons.' },
        { level: 4, cost: { gold: 110000, wood: 135000, stone: 128000, food: 75000 }, time: 3600, reqCityHall: 9, desc: 'High-torque gears: +30% movement speed for siege units.' },
        { level: 5, cost: { gold: 220000, wood: 270000, stone: 250000, food: 150000 }, time: 7200, reqCityHall: 10, desc: 'Apex Workshop: Deploys dreadnought-class artillery.' }
      ]
    },

    // -------------------------------------------------------------
    // DEFENSE BUILDINGS
    // -------------------------------------------------------------
    defensive_wall: {
      type: 'defensive_wall',
      name: 'Defensive Wall',
      category: CATEGORIES.DEFENSE,
      icon: '🧱',
      description: 'Thick masonry battlements that connect automatically with neighboring wall tiles to fortify your city boundaries.',
      size: { w: 1, h: 1 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 40, wood: 20, stone: 60, food: 0 }, time: 4, reqCityHall: 1, hp: 450, desc: 'Stone battlement. 450 HP.' },
        { level: 2, cost: { gold: 100, wood: 50, stone: 150, food: 0 }, time: 10, reqCityHall: 2, hp: 950, desc: 'Reinforced granite wall. 950 HP.' },
        { level: 3, cost: { gold: 250, wood: 120, stone: 380, food: 0 }, time: 25, reqCityHall: 3, hp: 1800, desc: 'Carved fortress wall. 1,800 HP.' },
        { level: 4, cost: { gold: 600, wood: 300, stone: 900, food: 0 }, time: 60, reqCityHall: 4, hp: 3200, desc: 'Iron-braced rampart. 3,200 HP.' },
        { level: 5, cost: { gold: 1400, wood: 700, stone: 2100, food: 0 }, time: 140, reqCityHall: 5, hp: 5500, desc: 'Citadel bastion wall. 5,500 HP.' },
        { level: 6, cost: { gold: 3200, wood: 1600, stone: 4800, food: 0 }, time: 300, reqCityHall: 6, hp: 9000, desc: 'Grand imperial curtain wall. 9,000 HP.' },
        { level: 7, cost: { gold: 7500, wood: 3800, stone: 11000, food: 0 }, time: 600, reqCityHall: 7, hp: 14500, desc: 'Sovereign rampart. 14,500 HP.' },
        { level: 8, cost: { gold: 16000, wood: 8000, stone: 24000, food: 0 }, time: 1200, reqCityHall: 8, hp: 22000, desc: 'Adamantine barrier. 22,000 HP.' },
        { level: 9, cost: { gold: 35000, wood: 18000, stone: 52000, food: 0 }, time: 2400, reqCityHall: 9, hp: 33000, desc: 'Celestial runic wall. 33,000 HP.' },
        { level: 10, cost: { gold: 80000, wood: 40000, stone: 120000, food: 0 }, time: 4800, reqCityHall: 10, hp: 50000, desc: 'Apex Aegis Wall: 50,000 HP.' }
      ]
    },

    watch_tower: {
      type: 'watch_tower',
      name: 'Watch Tower',
      category: CATEGORIES.DEFENSE,
      icon: '🏹',
      description: 'Elevated sentry tower staffed by elite archers firing rapid piercing arrows at approaching enemies.',
      size: { w: 1, h: 1 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 200, wood: 300, stone: 250, food: 0 }, time: 15, reqCityHall: 2, range: 4.5, dps: 30, attackSpeed: 0.8, hp: 600, desc: '30 DPS, 4.5 tile range.' },
        { level: 2, cost: { gold: 500, wood: 750, stone: 600, food: 0 }, time: 40, reqCityHall: 2, range: 4.8, dps: 65, attackSpeed: 0.8, hp: 1200, desc: '65 DPS, 4.8 tile range.' },
        { level: 3, cost: { gold: 1200, wood: 1800, stone: 1400, food: 0 }, time: 100, reqCityHall: 3, range: 5.0, dps: 130, attackSpeed: 0.75, hp: 2200, desc: '130 DPS, 5.0 tile range.' },
        { level: 4, cost: { gold: 2800, wood: 4200, stone: 3200, food: 0 }, time: 220, reqCityHall: 4, range: 5.2, dps: 240, attackSpeed: 0.75, hp: 3800, desc: '240 DPS, 5.2 tile range.' },
        { level: 5, cost: { gold: 6500, wood: 9500, stone: 7200, food: 0 }, time: 450, reqCityHall: 5, range: 5.5, dps: 420, attackSpeed: 0.7, hp: 6200, desc: '420 DPS, 5.5 tile range.' },
        { level: 6, cost: { gold: 14000, wood: 20000, stone: 16000, food: 0 }, time: 900, reqCityHall: 6, range: 5.8, dps: 720, attackSpeed: 0.7, hp: 9800, desc: '720 DPS, 5.8 tile range.' },
        { level: 7, cost: { gold: 30000, wood: 44000, stone: 34000, food: 0 }, time: 1800, reqCityHall: 7, range: 6.0, dps: 1200, attackSpeed: 0.65, hp: 15000, desc: '1,200 DPS, 6.0 tile range.' },
        { level: 8, cost: { gold: 64000, wood: 92000, stone: 70000, food: 0 }, time: 3600, reqCityHall: 8, range: 6.2, dps: 2000, attackSpeed: 0.65, hp: 23000, desc: '2,000 DPS, 6.2 tile range.' },
        { level: 9, cost: { gold: 135000, wood: 190000, stone: 145000, food: 0 }, time: 7200, reqCityHall: 9, range: 6.5, dps: 3200, attackSpeed: 0.6, hp: 34000, desc: '3,200 DPS, 6.5 tile range.' },
        { level: 10, cost: { gold: 280000, wood: 390000, stone: 300000, food: 0 }, time: 14400, reqCityHall: 10, range: 7.0, dps: 5200, attackSpeed: 0.6, hp: 50000, desc: 'Apex Sentry: 5,200 DPS.' }
      ]
    },

    defense_cannon: {
      type: 'defense_cannon',
      name: 'Defense Cannon',
      category: CATEGORIES.DEFENSE,
      icon: '💣',
      description: 'Cast iron defense cannon delivering thunderous explosive ordnance that inflicts area-of-effect splash damage on invader clusters.',
      size: { w: 2, h: 2 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 500, wood: 400, stone: 600, food: 0 }, time: 30, reqCityHall: 3, range: 5.5, dps: 55, splash: 1.5, attackSpeed: 2.0, hp: 900, desc: '55 AoE DPS, 5.5 tile range.' },
        { level: 2, cost: { gold: 1200, wood: 900, stone: 1500, food: 0 }, time: 70, reqCityHall: 3, range: 5.8, dps: 110, splash: 1.5, attackSpeed: 2.0, hp: 1800, desc: '110 AoE DPS, 5.8 tile range.' },
        { level: 3, cost: { gold: 2800, wood: 2200, stone: 3500, food: 0 }, time: 160, reqCityHall: 4, range: 6.0, dps: 210, splash: 1.6, attackSpeed: 1.9, hp: 3200, desc: '210 AoE DPS, 6.0 tile range.' },
        { level: 4, cost: { gold: 6500, wood: 5000, stone: 8000, food: 0 }, time: 340, reqCityHall: 5, range: 6.2, dps: 380, splash: 1.7, attackSpeed: 1.9, hp: 5500, desc: '380 AoE DPS, 6.2 tile range.' },
        { level: 5, cost: { gold: 15000, wood: 12000, stone: 18000, food: 0 }, time: 700, reqCityHall: 6, range: 6.5, dps: 680, splash: 1.8, attackSpeed: 1.8, hp: 9000, desc: '680 AoE DPS, 6.5 tile range.' },
        { level: 6, cost: { gold: 32000, wood: 25000, stone: 40000, food: 0 }, time: 1400, reqCityHall: 7, range: 6.8, dps: 1150, splash: 1.9, attackSpeed: 1.8, hp: 14500, desc: '1,150 AoE DPS, 6.8 tile range.' },
        { level: 7, cost: { gold: 70000, wood: 55000, stone: 85000, food: 0 }, time: 2800, reqCityHall: 8, range: 7.0, dps: 1950, splash: 2.0, attackSpeed: 1.7, hp: 22500, desc: '1,950 AoE DPS, 7.0 tile range.' },
        { level: 8, cost: { gold: 150000, wood: 115000, stone: 180000, food: 0 }, time: 5600, reqCityHall: 9, range: 7.2, dps: 3200, splash: 2.1, attackSpeed: 1.7, hp: 34000, desc: '3,200 AoE DPS, 7.2 tile range.' },
        { level: 9, cost: { gold: 310000, wood: 240000, stone: 370000, food: 0 }, time: 11200, reqCityHall: 9, range: 7.5, dps: 5200, splash: 2.2, attackSpeed: 1.6, hp: 51000, desc: '5,200 AoE DPS, 7.5 tile range.' },
        { level: 10, cost: { gold: 640000, wood: 500000, stone: 760000, food: 0 }, time: 22400, reqCityHall: 10, range: 8.0, dps: 8400, splash: 2.5, attackSpeed: 1.5, hp: 75000, desc: 'Apex Howitzer: 8,400 AoE DPS.' }
      ]
    },

    energy_tower: {
      type: 'energy_tower',
      name: 'Energy Tower',
      category: CATEGORIES.DEFENSE,
      icon: '⚡',
      description: 'Pulsating arcane crystal monolith unleashing concentrated beams of hyper-charged lightning that melt high-armor targets.',
      size: { w: 2, h: 2 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 3000, wood: 2000, stone: 3500, food: 0 }, time: 120, reqCityHall: 5, range: 5.0, dps: 120, attackSpeed: 1.0, hp: 1500, desc: '120 DPS penetrating beam.' },
        { level: 2, cost: { gold: 7000, wood: 4500, stone: 8000, food: 0 }, time: 260, reqCityHall: 5, range: 5.2, dps: 240, attackSpeed: 1.0, hp: 2800, desc: '240 DPS penetrating beam.' },
        { level: 3, cost: { gold: 16000, wood: 10000, stone: 18000, food: 0 }, time: 540, reqCityHall: 6, range: 5.5, dps: 450, attackSpeed: 0.95, hp: 5000, desc: '450 DPS penetrating beam.' },
        { level: 4, cost: { gold: 35000, wood: 22000, stone: 40000, food: 0 }, time: 1100, reqCityHall: 7, range: 5.8, dps: 820, attackSpeed: 0.95, hp: 8600, desc: '820 DPS penetrating beam.' },
        { level: 5, cost: { gold: 78000, wood: 48000, stone: 90000, food: 0 }, time: 2200, reqCityHall: 8, range: 6.0, dps: 1450, attackSpeed: 0.9, hp: 14200, desc: '1,450 DPS penetrating beam.' },
        { level: 6, cost: { gold: 170000, wood: 105000, stone: 195000, food: 0 }, time: 4400, reqCityHall: 9, range: 6.2, dps: 2500, attackSpeed: 0.9, hp: 22800, desc: '2,500 DPS penetrating beam.' },
        { level: 7, cost: { gold: 360000, wood: 220000, stone: 410000, food: 0 }, time: 8800, reqCityHall: 9, range: 6.5, dps: 4200, attackSpeed: 0.85, hp: 36000, desc: '4,200 DPS penetrating beam.' },
        { level: 8, cost: { gold: 750000, wood: 460000, stone: 850000, food: 0 }, time: 17600, reqCityHall: 10, range: 6.8, dps: 6800, attackSpeed: 0.85, hp: 55000, desc: '6,800 DPS penetrating beam.' },
        { level: 9, cost: { gold: 1550000, wood: 950000, stone: 1750000, food: 0 }, time: 35200, reqCityHall: 10, range: 7.2, dps: 10800, attackSpeed: 0.8, hp: 82000, desc: '10,800 DPS penetrating beam.' },
        { level: 10, cost: { gold: 3200000, wood: 1950000, stone: 3600000, food: 0 }, time: 70400, reqCityHall: 10, range: 7.8, dps: 17000, attackSpeed: 0.75, hp: 120000, desc: 'Apex Tesla Spire: 17,000 DPS.' }
      ]
    },

    // -------------------------------------------------------------
    // DECORATIONS
    // -------------------------------------------------------------
    garden_fountain: {
      type: 'garden_fountain',
      name: 'Garden Fountain',
      category: CATEGORIES.DECORATIONS,
      icon: '⛲',
      description: 'Carved marble water feature with blooming rosebeds. Radiates beauty and elevates municipal citizen happiness.',
      size: { w: 1, h: 1 },
      maxLevel: 1,
      levels: [
        { level: 1, cost: { gold: 300, wood: 200, stone: 400, food: 100 }, time: 10, reqCityHall: 1, desc: '+5% citizen happiness & city aesthetic.' }
      ]
    },

    victory_statue: {
      type: 'victory_statue',
      name: 'Victory Monument',
      category: CATEGORIES.DECORATIONS,
      icon: '🗽',
      description: 'Towering bronze monument honoring historical campaign triumphs and inspiring the city garrison.',
      size: { w: 1, h: 1 },
      maxLevel: 1,
      levels: [
        { level: 1, cost: { gold: 1000, wood: 500, stone: 1500, food: 0 }, time: 30, reqCityHall: 3, desc: '+100 City Power & proud civic prestige.' }
      ]
    },

    guard_post: {
      type: 'guard_post',
      name: 'Guard Post',
      category: CATEGORIES.DECORATIONS,
      icon: '🚩',
      description: 'Wooden watch checkpoint with proud royal banners demarcating territory and road intersections.',
      size: { w: 1, h: 1 },
      maxLevel: 1,
      levels: [
        { level: 1, cost: { gold: 150, wood: 250, stone: 100, food: 0 }, time: 5, reqCityHall: 1, desc: 'Territorial checkpoint marker.' }
      ]
    }
  };

  // ---------------------------------------------------------------
  // ORIGINAL MILITARY UNITS
  // ---------------------------------------------------------------
  const UNITS = {
    guardian: {
      id: 'guardian',
      name: 'Guardian',
      icon: '🛡️',
      role: 'Melee Vanguard',
      description: 'Sturdy front-line soldier equipped with broadsword and forged tower shield.',
      tier: 1,
      requiredBuilding: 'training_grounds',
      requiredBuildingLevel: 1,
      cost: { food: 40, wood: 20, gold: 10 },
      trainTime: 6,
      housing: 1,
      hp: 240,
      damage: 28,
      range: 1.0,
      attackSpeed: 1.0,
      moveSpeed: 1.2,
      targetPreference: 'any'
    },

    ranger: {
      id: 'ranger',
      name: 'Ranger',
      icon: '🏹',
      role: 'Long-Range Marksman',
      description: 'Keen-eyed sharpshooter raining precision arrows over walls from safe distance.',
      tier: 1,
      requiredBuilding: 'training_grounds',
      requiredBuildingLevel: 2,
      cost: { food: 50, wood: 45, gold: 15 },
      trainTime: 10,
      housing: 1,
      hp: 120,
      damage: 42,
      range: 4.8,
      attackSpeed: 0.9,
      moveSpeed: 1.35,
      targetPreference: 'any'
    },

    vanguard: {
      id: 'vanguard',
      name: 'Vanguard',
      icon: '🏇',
      role: 'Shock Cavalry',
      description: 'Swift armored cavalry unit charging enemy defensive flanks and resource stores.',
      tier: 2,
      requiredBuilding: 'training_grounds',
      requiredBuildingLevel: 3,
      cost: { food: 90, gold: 50, wood: 30 },
      trainTime: 18,
      housing: 2,
      hp: 380,
      damage: 52,
      range: 1.2,
      attackSpeed: 1.1,
      moveSpeed: 2.1,
      targetPreference: 'resource'
    },

    heavy_defender: {
      id: 'heavy_defender',
      name: 'Heavy Defender',
      icon: '🦾',
      role: 'Armored Colossus',
      description: 'Massive fortress tank built to absorb relentless turret fire while breaching defenses.',
      tier: 2,
      requiredBuilding: 'warrior_academy',
      requiredBuildingLevel: 1,
      cost: { food: 140, stone: 90, gold: 40 },
      trainTime: 30,
      housing: 3,
      hp: 950,
      damage: 38,
      range: 1.0,
      attackSpeed: 1.6,
      moveSpeed: 0.85,
      targetPreference: 'defense'
    },

    energy_mage: {
      id: 'energy_mage',
      name: 'Energy Mage',
      icon: '🔮',
      role: 'Arcane Striker',
      description: 'Mystical spellcaster unleashing explosive chain lightning bursts across clusters of buildings.',
      tier: 3,
      requiredBuilding: 'warrior_academy',
      requiredBuildingLevel: 2,
      cost: { food: 120, gold: 110, stone: 40 },
      trainTime: 36,
      housing: 2,
      hp: 180,
      damage: 95,
      range: 5.2,
      attackSpeed: 1.4,
      moveSpeed: 1.1,
      targetPreference: 'defense'
    },

    siege_unit: {
      id: 'siege_unit',
      name: 'Siege Unit',
      icon: '☄️',
      role: 'Heavy Catapult',
      description: 'Heavy artillery engine dealing 3.5x bonus damage to defensive towers and walls.',
      tier: 3,
      requiredBuilding: 'unit_workshop',
      requiredBuildingLevel: 1,
      cost: { wood: 200, stone: 160, gold: 80 },
      trainTime: 48,
      housing: 4,
      hp: 550,
      damage: 180,
      range: 6.8,
      attackSpeed: 2.4,
      moveSpeed: 0.7,
      targetPreference: 'defense'
    }
  };

  // ---------------------------------------------------------------
  // WORLD MAP CAMPAIGN NODES (AI Opponent Settlements)
  // ---------------------------------------------------------------
  const CAMPAIGN_NODES = [
    {
      id: 'node_glade',
      name: 'Whispering Glade',
      type: 'Bandit Outpost',
      icon: '🏕️',
      difficulty: 'Easy',
      recommendedPower: 250,
      loot: { gold: 1500, wood: 1200, stone: 800, food: 1000, gems: 15 },
      description: 'A rogue bandit encampment hoarding harvested timber and pillaged gold.',
      mapTheme: 'forest',
      enemyCity: {
        buildings: [
          { type: 'city_hall', level: 1, x: 12, y: 12, hp: 1200 },
          { type: 'treasury', level: 1, x: 10, y: 12, hp: 700 },
          { type: 'storage', level: 1, x: 14, y: 12, hp: 700 },
          { type: 'watch_tower', level: 1, x: 10, y: 10, hp: 600, range: 4.5, dps: 30 },
          { type: 'watch_tower', level: 1, x: 14, y: 10, hp: 600, range: 4.5, dps: 30 },
          { type: 'defensive_wall', level: 1, x: 9, y: 9, hp: 450 },
          { type: 'defensive_wall', level: 1, x: 10, y: 9, hp: 450 },
          { type: 'defensive_wall', level: 1, x: 14, y: 9, hp: 450 },
          { type: 'defensive_wall', level: 1, x: 15, y: 9, hp: 450 }
        ]
      }
    },
    {
      id: 'node_crag',
      name: 'Crag Ridge Garrison',
      type: 'Raider Stronghold',
      icon: '🏰',
      difficulty: 'Normal',
      recommendedPower: 750,
      loot: { gold: 3600, wood: 3000, stone: 2400, food: 2000, gems: 30 },
      description: 'A rocky ridge fortress boasting dual sentry towers and heavy black-powder cannons.',
      mapTheme: 'rocky',
      enemyCity: {
        buildings: [
          { type: 'city_hall', level: 2, x: 12, y: 12, hp: 2400 },
          { type: 'treasury', level: 2, x: 10, y: 12, hp: 1200 },
          { type: 'storage', level: 2, x: 14, y: 12, hp: 1200 },
          { type: 'gold_mine', level: 2, x: 10, y: 14, hp: 800 },
          { type: 'watch_tower', level: 2, x: 9, y: 9, hp: 1200, range: 4.8, dps: 65 },
          { type: 'watch_tower', level: 2, x: 15, y: 9, hp: 1200, range: 4.8, dps: 65 },
          { type: 'defense_cannon', level: 1, x: 12, y: 9, hp: 900, range: 5.5, dps: 55, splash: 1.5 },
          { type: 'defensive_wall', level: 2, x: 8, y: 8, hp: 950 },
          { type: 'defensive_wall', level: 2, x: 9, y: 8, hp: 950 },
          { type: 'defensive_wall', level: 2, x: 15, y: 8, hp: 950 },
          { type: 'defensive_wall', level: 2, x: 16, y: 8, hp: 950 }
        ]
      }
    },
    {
      id: 'node_crimson',
      name: 'Crimson Warlord Keep',
      type: 'Warlord Citadel',
      icon: '🌋',
      difficulty: 'Hard',
      recommendedPower: 1800,
      loot: { gold: 9000, wood: 8000, stone: 7000, food: 6000, gems: 50 },
      description: 'A heavily fortified volcanic citadel commanding an energy tower and reinforced ramparts.',
      mapTheme: 'crimson',
      enemyCity: {
        buildings: [
          { type: 'city_hall', level: 4, x: 12, y: 12, hp: 4800 },
          { type: 'treasury', level: 4, x: 10, y: 12, hp: 2500 },
          { type: 'storage', level: 4, x: 14, y: 12, hp: 2500 },
          { type: 'watch_tower', level: 3, x: 8, y: 8, hp: 2200, range: 5.0, dps: 130 },
          { type: 'watch_tower', level: 3, x: 16, y: 8, hp: 2200, range: 5.0, dps: 130 },
          { type: 'defense_cannon', level: 2, x: 10, y: 9, hp: 1800, range: 5.8, dps: 110, splash: 1.5 },
          { type: 'defense_cannon', level: 2, x: 14, y: 9, hp: 1800, range: 5.8, dps: 110, splash: 1.5 },
          { type: 'energy_tower', level: 1, x: 12, y: 8, hp: 1500, range: 5.0, dps: 120 }
        ]
      }
    },
    {
      id: 'node_iron',
      name: 'Iron Bastion Domain',
      type: 'Imperial Garrison',
      icon: '⚔️',
      difficulty: 'Expert',
      recommendedPower: 3800,
      loot: { gold: 22000, wood: 18000, stone: 17000, food: 15000, gems: 85 },
      description: 'Impenetrable steel bastions with multiple layered defense cannons and high-level watch towers.',
      mapTheme: 'industrial',
      enemyCity: {
        buildings: [
          { type: 'city_hall', level: 6, x: 12, y: 12, hp: 8500 },
          { type: 'treasury', level: 6, x: 10, y: 12, hp: 5000 },
          { type: 'storage', level: 6, x: 14, y: 12, hp: 5000 },
          { type: 'defense_cannon', level: 4, x: 9, y: 9, hp: 5500, range: 6.2, dps: 380, splash: 1.7 },
          { type: 'defense_cannon', level: 4, x: 15, y: 9, hp: 5500, range: 6.2, dps: 380, splash: 1.7 },
          { type: 'energy_tower', level: 3, x: 12, y: 8, hp: 5000, range: 5.5, dps: 450 },
          { type: 'watch_tower', level: 5, x: 8, y: 14, hp: 6200, range: 5.5, dps: 420 },
          { type: 'watch_tower', level: 5, x: 16, y: 14, hp: 6200, range: 5.5, dps: 420 }
        ]
      }
    },
    {
      id: 'node_obsidian',
      name: 'Obsidian Sovereign Citadel',
      type: 'Apex World Boss',
      icon: '👑',
      difficulty: 'Master Boss',
      recommendedPower: 7500,
      loot: { gold: 55000, wood: 45000, stone: 42000, food: 38000, gems: 200 },
      description: 'The supreme shadow fortress of the ancient realm. Defeating it brings eternal empire glory.',
      mapTheme: 'celestial',
      enemyCity: {
        buildings: [
          { type: 'city_hall', level: 8, x: 12, y: 12, hp: 16000 },
          { type: 'treasury', level: 8, x: 10, y: 12, hp: 9000 },
          { type: 'storage', level: 8, x: 14, y: 12, hp: 9000 },
          { type: 'energy_tower', level: 5, x: 10, y: 8, hp: 14200, range: 6.0, dps: 1450 },
          { type: 'energy_tower', level: 5, x: 14, y: 8, hp: 14200, range: 6.0, dps: 1450 },
          { type: 'defense_cannon', level: 6, x: 8, y: 12, hp: 14500, range: 6.8, dps: 1150, splash: 1.9 },
          { type: 'defense_cannon', level: 6, x: 16, y: 12, hp: 14500, range: 6.8, dps: 1150, splash: 1.9 },
          { type: 'watch_tower', level: 7, x: 12, y: 16, hp: 15000, range: 6.0, dps: 1200 }
        ]
      }
    }
  ];

  // ---------------------------------------------------------------
  // MULTI-BRANCH TECH TREE
  // ---------------------------------------------------------------
  const TECH_TREE = [
    // Branch 1: Economy
    {
      id: 'deep_mining',
      category: 'Economy',
      tier: 1,
      name: 'Deep-Shaft Extraction',
      icon: '⛏️',
      description: 'Pneumatic drills boost Gold Extractor yield by +20%.',
      cost: { gold: 800, wood: 600, stone: 800, food: 300 },
      effect: { type: 'boost_resource', resource: 'gold', percent: 20 }
    },
    {
      id: 'sawmill_steam',
      category: 'Economy',
      tier: 2,
      name: 'Steam-Powered Saws',
      icon: '🪓',
      description: 'Automated hydraulic mills increase Timber Works production by +20%.',
      cost: { gold: 2000, wood: 1500, stone: 1600, food: 900 },
      effect: { type: 'boost_resource', resource: 'wood', percent: 20 }
    },
    {
      id: 'crop_rotation',
      category: 'Economy',
      tier: 2,
      name: 'Hydro-Enriched Soils',
      icon: '🌾',
      description: 'Irrigation systems boost Food Farm yield by +25%.',
      cost: { gold: 2200, wood: 2400, stone: 1400, food: 1800 },
      effect: { type: 'boost_resource', resource: 'food', percent: 25 }
    },
    {
      id: 'quarry_explosives',
      category: 'Economy',
      tier: 3,
      name: 'Precision Blasting',
      icon: '💥',
      description: 'Controlled charges increase Stone Foundry extraction by +25%.',
      cost: { gold: 6000, wood: 5000, stone: 7500, food: 3500 },
      effect: { type: 'boost_resource', resource: 'stone', percent: 25 }
    },

    // Branch 2: Construction
    {
      id: 'scaffolding',
      category: 'Construction',
      tier: 1,
      name: 'Reinforced Scaffolding',
      icon: '🏗️',
      description: 'Modular titanium trusses reduce all construction and upgrade times by 15%.',
      cost: { gold: 700, wood: 900, stone: 500, food: 350 },
      effect: { type: 'speedup', percent: 15 }
    },
    {
      id: 'reinforced_masonry',
      category: 'Construction',
      tier: 3,
      name: 'Polymer Masonry',
      icon: '🏛️',
      description: 'Reinforces architectural vaults, expanding Treasury and Storage depot capacity by +25%.',
      cost: { gold: 5500, wood: 6500, stone: 7000, food: 3800 },
      effect: { type: 'boost_storage', percent: 25 }
    },

    // Branch 3: Military
    {
      id: 'steel_forging',
      category: 'Military',
      tier: 2,
      name: 'Damascus Metallurgy',
      icon: '⚔️',
      description: 'Tempered steel equipment grants all melee Guardians and Vanguards +20% damage.',
      cost: { gold: 3000, wood: 2500, stone: 3500, food: 2200 },
      effect: { type: 'boost_unit_damage', unit: 'melee', percent: 20 }
    },
    {
      id: 'composite_bows',
      category: 'Military',
      tier: 3,
      name: 'Recurve Bowcraft',
      icon: '🏹',
      description: 'Carbon-laminated recurve bows boost Ranger range by +0.6 tiles and damage by +15%.',
      cost: { gold: 6500, wood: 8000, stone: 4500, food: 4000 },
      effect: { type: 'boost_unit_range', unit: 'ranger', percent: 15 }
    },
    {
      id: 'siege_hydraulics',
      category: 'Military',
      tier: 4,
      name: 'Hydraulic Torsion',
      icon: '☄️',
      description: 'Increases Siege Unit bombardment range by +1.0 tile and wall shatter damage by +30%.',
      cost: { gold: 15000, wood: 18000, stone: 16000, food: 9000 },
      effect: { type: 'boost_unit_damage', unit: 'siege', percent: 30 }
    },

    // Branch 4: Defense
    {
      id: 'ballista_gears',
      category: 'Defense',
      tier: 2,
      name: 'High-Velocity Sights',
      icon: '🎯',
      description: 'Precision gears boost Watch Tower attack speed and damage by +18%.',
      cost: { gold: 2800, wood: 3200, stone: 3000, food: 1500 },
      effect: { type: 'boost_defense', tower: 'watch_tower', percent: 18 }
    },
    {
      id: 'high_explosives',
      category: 'Defense',
      tier: 3,
      name: 'Nitroglycerin Shells',
      icon: '💣',
      description: 'Expands Defense Cannon blast radius by +25% and damage by +20%.',
      cost: { gold: 7500, wood: 6000, stone: 9000, food: 3500 },
      effect: { type: 'boost_defense', tower: 'defense_cannon', percent: 20 }
    },
    {
      id: 'overcharged_crystals',
      category: 'Defense',
      tier: 4,
      name: 'Prismatic Focusing',
      icon: '⚡',
      description: 'Overcharges Energy Towers, increasing beam damage by +25% against heavy targets.',
      cost: { gold: 18000, wood: 14000, stone: 22000, food: 8000 },
      effect: { type: 'boost_defense', tower: 'energy_tower', percent: 25 }
    }
  ];

  // ---------------------------------------------------------------
  // DAILY MISSIONS & ACHIEVEMENTS
  // ---------------------------------------------------------------
  const DAILY_MISSIONS = [
    { id: 'm_collect', title: 'Harvest Master', desc: 'Collect resources from resource buildings 3 times', target: 3, rewardGems: 15, rewardGold: 1000 },
    { id: 'm_upgrade', title: 'Urban Development', desc: 'Upgrade any structure to a higher tier', target: 1, rewardGems: 20, rewardWood: 1200 },
    { id: 'm_train', title: 'Legion Assembly', desc: 'Train 5 military units in the Training Grounds', target: 5, rewardGems: 25, rewardFood: 1500 },
    { id: 'm_battle', title: 'Glorious Victory', desc: 'Win a battle on the World Map against an AI stronghold', target: 1, rewardGems: 35, rewardStone: 1200 },
    { id: 'm_trade', title: 'Bazaar Merchant', desc: 'Execute a trade at the Grand Bazaar', target: 1, rewardGems: 15, rewardGold: 800 }
  ];

  const ACHIEVEMENTS = [
    { id: 'ach_founder', title: 'City Founder', desc: 'Establish your city and upgrade City Command Center to Level 2', rewardGems: 30, reqCityHall: 2 },
    { id: 'ach_metropolis', title: 'Grand Metropolis', desc: 'Reach City Command Center Level 5', rewardGems: 75, reqCityHall: 5 },
    { id: 'ach_apex', title: 'Apex Sovereign', desc: 'Upgrade City Command Center to Level 10 Wonder status', rewardGems: 250, reqCityHall: 10 },
    { id: 'ach_builder', title: 'Master Architect', desc: 'Construct at least 15 active buildings in your city', rewardGems: 50, reqBuildingCount: 15 },
    { id: 'ach_fortress', title: 'Bastion of Iron', desc: 'Construct 4 defensive towers and 8 defensive wall segments', rewardGems: 60, reqDefenses: 12 },
    { id: 'ach_general', title: 'Supreme General', desc: 'Train an army of at least 50 military units', rewardGems: 80, reqTroops: 50 },
    { id: 'ach_conqueror', title: 'World Conqueror', desc: 'Conquer all 5 campaign strongholds on the World Map', rewardGems: 150, reqStars: 15 }
  ];

  // ---------------------------------------------------------------
  // STARTER CITY TEMPLATE
  // ---------------------------------------------------------------
  function createStarterCity(userId = 'default_user', userName = 'Mayor') {
    return {
      version: 2,
      userId,
      cityName: `${userName}'s Domain`,
      level: 1,
      xp: 0,
      xpNext: 500,
      cityPower: 450,
      population: 45,
      happiness: 96,
      resources: {
        gold: 1500,
        wood: 1200,
        stone: 900,
        food: 800,
        gems: 80
      },
      storageCaps: {
        gold: 6000,
        wood: 5000,
        stone: 5000,
        food: 5000,
        gems: 999999
      },
      army: {
        guardian: 8,
        ranger: 6,
        vanguard: 0,
        heavy_defender: 0,
        energy_mage: 0,
        siege_unit: 0
      },
      trainingQueue: [],
      campaignProgress: {
        node_glade: { completed: false, stars: 0, bestDestruction: 0 },
        node_crag: { completed: false, stars: 0, bestDestruction: 0 },
        node_crimson: { completed: false, stars: 0, bestDestruction: 0 },
        node_iron: { completed: false, stars: 0, bestDestruction: 0 },
        node_obsidian: { completed: false, stars: 0, bestDestruction: 0 }
      },
      dailyMissions: {
        lastReset: Date.now(),
        progress: {
          m_collect: 0,
          m_upgrade: 0,
          m_train: 0,
          m_battle: 0,
          m_trade: 0
        },
        claimed: []
      },
      claimedAchievements: [],
      lastTickTime: Date.now(),
      buildings: [
        // City Command Center at grid center (12, 12)
        { id: 'bld_city_hall_1', type: 'city_hall', level: 1, x: 12, y: 12, status: 'idle', finishTime: null },
        // Starter Resource Foundries & Extractors
        { id: 'bld_gold_1', type: 'gold_mine', level: 1, x: 8, y: 11, status: 'idle', finishTime: null },
        { id: 'bld_lumber_1', type: 'lumber_yard', level: 1, x: 8, y: 14, status: 'idle', finishTime: null },
        { id: 'bld_stone_1', type: 'stone_quarry', level: 1, x: 16, y: 11, status: 'idle', finishTime: null },
        { id: 'bld_farm_1', type: 'farm', level: 1, x: 16, y: 14, status: 'idle', finishTime: null },
        // Starter Storage & Training Grounds
        { id: 'bld_storage_1', type: 'storage', level: 1, x: 12, y: 8, status: 'idle', finishTime: null },
        { id: 'bld_barracks_1', type: 'training_grounds', level: 1, x: 12, y: 16, status: 'idle', finishTime: null },
        // Starter Defensive Wall and Watch Tower
        { id: 'bld_tower_1', type: 'watch_tower', level: 1, x: 6, y: 9, status: 'idle', finishTime: null },
        { id: 'bld_wall_1', type: 'defensive_wall', level: 1, x: 5, y: 9, status: 'idle', finishTime: null },
        { id: 'bld_wall_2', type: 'defensive_wall', level: 1, x: 5, y: 10, status: 'idle', finishTime: null },
        { id: 'bld_wall_3', type: 'defensive_wall', level: 1, x: 5, y: 11, status: 'idle', finishTime: null }
      ],
      unlockedTechs: [],
      stats: {
        totalGoldProduced: 0,
        totalWoodProduced: 0,
        totalStoneProduced: 0,
        totalFoodProduced: 0,
        buildingsConstructed: 11,
        upgradesCompleted: 0,
        battlesWon: 0,
        unitsTrained: 14
      }
    };
  }

  // Calculate City Power based on buildings, tech, army, and campaign stars
  function calculateCityPower(city) {
    if (!city) return 0;
    let power = 0;

    // 1. Buildings contribution
    (city.buildings || []).forEach(b => {
      const spec = BUILDINGS[b.type];
      const weight = spec && spec.category === CATEGORIES.DEFENSE ? 60 : 40;
      power += (b.level || 1) * weight;
    });

    // 2. Unlocked Techs (100 power each)
    power += (city.unlockedTechs || []).length * 100;

    // 3. Military Army
    const army = city.army || {};
    power += (army.guardian || 0) * 12;
    power += (army.ranger || 0) * 15;
    power += (army.vanguard || 0) * 28;
    power += (army.heavy_defender || 0) * 45;
    power += (army.energy_mage || 0) * 55;
    power += (army.siege_unit || 0) * 80;

    // 4. Campaign Stars
    const campaign = city.campaignProgress || {};
    Object.values(campaign).forEach(c => {
      power += (c.stars || 0) * 120;
    });

    return power;
  }

  // Exports
  exports.GRID_SIZE = GRID_SIZE;
  exports.RESOURCES = RESOURCES;
  exports.CATEGORIES = CATEGORIES;
  exports.BUILDINGS = BUILDINGS;
  exports.UNITS = UNITS;
  exports.CAMPAIGN_NODES = CAMPAIGN_NODES;
  exports.TECH_TREE = TECH_TREE;
  exports.DAILY_MISSIONS = DAILY_MISSIONS;
  exports.ACHIEVEMENTS = ACHIEVEMENTS;
  exports.createStarterCity = createStarterCity;
  exports.calculateCityPower = calculateCityPower;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.CityConfig = {}));
