/**
 * InfinityPlay - City Builder Strategy Game Configuration
 * Shared game balance, building specifications, upgrade formulas, and tech tree
 */

(function(exports) {
  'use strict';

  // Grid dimensions
  const GRID_SIZE = 20; // 20x20 tiles

  // Resource types & display metadata
  const RESOURCES = {
    gold: { id: 'gold', name: 'Gold', icon: '🪙', color: '#fbbf24', baseStorage: 2000 },
    wood: { id: 'wood', name: 'Wood', icon: '🪵', color: '#a16207', baseStorage: 1500 },
    stone: { id: 'stone', name: 'Stone', icon: '🪨', color: '#94a3b8', baseStorage: 1200 },
    food: { id: 'food', name: 'Food', icon: '🌾', color: '#22c55e', baseStorage: 1500 },
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

  // Building Types & Specifications (Levels 1 - 10)
  const BUILDINGS = {
    city_hall: {
      type: 'city_hall',
      name: 'City Hall',
      category: CATEGORIES.CORE,
      icon: '🏛️',
      description: 'The administrative heart of your city. Upgrading City Hall unlocks advanced buildings and higher upgrade tiers for all structures.',
      size: { w: 2, h: 2 },
      maxLevel: 10,
      unique: true, // Only 1 can exist
      levels: [
        { level: 1, cost: { gold: 0, wood: 0, stone: 0, food: 0 }, time: 0, reqCityHall: 1, popCap: 50, desc: 'City administration center. Max building level: 1.' },
        { level: 2, cost: { gold: 400, wood: 500, stone: 300, food: 200 }, time: 20, reqCityHall: 1, popCap: 120, desc: 'Unlocks Level 2 upgrades, Marketplace, and Stone Quarry.' },
        { level: 3, cost: { gold: 1200, wood: 1500, stone: 1000, food: 800 }, time: 60, reqCityHall: 2, popCap: 250, desc: 'Unlocks Level 3 upgrades and Research Center.' },
        { level: 4, cost: { gold: 3000, wood: 3500, stone: 2800, food: 2000 }, time: 150, reqCityHall: 3, popCap: 500, desc: 'Unlocks Level 4 upgrades and +15% regional productivity.' },
        { level: 5, cost: { gold: 7000, wood: 8000, stone: 6500, food: 5000 }, time: 300, reqCityHall: 4, popCap: 1000, desc: 'Metropolitan status. Unlocks Level 5 upgrades.' },
        { level: 6, cost: { gold: 15000, wood: 18000, stone: 14000, food: 11000 }, time: 600, reqCityHall: 5, popCap: 2000, desc: 'Grand Empire Capitol. Unlocks Level 6 upgrades.' },
        { level: 7, cost: { gold: 30000, wood: 35000, stone: 28000, food: 22000 }, time: 1200, reqCityHall: 6, popCap: 3800, desc: 'Majestic Metropolis. Unlocks Level 7 upgrades.' },
        { level: 8, cost: { gold: 60000, wood: 70000, stone: 55000, food: 45000 }, time: 2400, reqCityHall: 7, popCap: 7000, desc: 'Sovereign Citadel. Unlocks Level 8 upgrades.' },
        { level: 9, cost: { gold: 120000, wood: 140000, stone: 110000, food: 90000 }, time: 4800, reqCityHall: 8, popCap: 12000, desc: 'Imperial Domain. Unlocks Level 9 upgrades.' },
        { level: 10, cost: { gold: 250000, wood: 280000, stone: 220000, food: 180000 }, time: 9600, reqCityHall: 9, popCap: 25000, desc: 'Apex Wonder Capitol. Maximum prosperity.' }
      ]
    },

    treasury: {
      type: 'treasury',
      name: 'Treasury Vault',
      category: CATEGORIES.CORE,
      icon: '🏦',
      description: 'Heavily fortified vaults securing your empire’s wealth. Significantly expands total Gold storage limit.',
      size: { w: 2, h: 2 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 200, wood: 300, stone: 150, food: 0 }, time: 15, reqCityHall: 1, goldCap: 5000, desc: 'Stores up to 5,000 Gold.' },
        { level: 2, cost: { gold: 600, wood: 800, stone: 500, food: 0 }, time: 45, reqCityHall: 2, goldCap: 12000, desc: 'Stores up to 12,000 Gold.' },
        { level: 3, cost: { gold: 1500, wood: 2000, stone: 1400, food: 0 }, time: 120, reqCityHall: 3, goldCap: 28000, desc: 'Stores up to 28,000 Gold.' },
        { level: 4, cost: { gold: 3500, wood: 4500, stone: 3200, food: 0 }, time: 240, reqCityHall: 4, goldCap: 60000, desc: 'Stores up to 60,000 Gold.' },
        { level: 5, cost: { gold: 8000, wood: 10000, stone: 7500, food: 0 }, time: 480, reqCityHall: 5, goldCap: 140000, desc: 'Stores up to 140,000 Gold.' },
        { level: 6, cost: { gold: 18000, wood: 22000, stone: 16000, food: 0 }, time: 900, reqCityHall: 6, goldCap: 300000, desc: 'Stores up to 300,000 Gold.' },
        { level: 7, cost: { gold: 38000, wood: 45000, stone: 34000, food: 0 }, time: 1800, reqCityHall: 7, goldCap: 65000, desc: 'Stores up to 650,000 Gold.' },
        { level: 8, cost: { gold: 80000, wood: 95000, stone: 72000, food: 0 }, time: 3600, reqCityHall: 8, goldCap: 1400000, desc: 'Stores up to 1,400,000 Gold.' },
        { level: 9, cost: { gold: 160000, wood: 190000, stone: 145000, food: 0 }, time: 7200, reqCityHall: 9, goldCap: 3000000, desc: 'Stores up to 3,000,000 Gold.' },
        { level: 10, cost: { gold: 320000, wood: 380000, stone: 290000, food: 0 }, time: 14400, reqCityHall: 10, goldCap: 7000000, desc: 'Stores up to 7,000,000 Gold.' }
      ]
    },

    storage: {
      type: 'storage',
      name: 'Resource Warehouse',
      category: CATEGORIES.CORE,
      icon: '📦',
      description: 'Expansive weatherproof silos and warehouses expanding maximum storage capacities for Wood, Stone, and Food.',
      size: { w: 2, h: 2 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 150, wood: 200, stone: 200, food: 0 }, time: 15, reqCityHall: 1, resourceCap: 4000, desc: 'Increases Wood, Stone, and Food storage to 4,000 each.' },
        { level: 2, cost: { gold: 500, wood: 700, stone: 700, food: 0 }, time: 40, reqCityHall: 2, resourceCap: 10000, desc: 'Increases capacity to 10,000 each.' },
        { level: 3, cost: { gold: 1300, wood: 1800, stone: 1800, food: 0 }, time: 100, reqCityHall: 3, resourceCap: 25000, desc: 'Increases capacity to 25,000 each.' },
        { level: 4, cost: { gold: 3200, wood: 4000, stone: 4000, food: 0 }, time: 220, reqCityHall: 4, resourceCap: 55000, desc: 'Increases capacity to 55,000 each.' },
        { level: 5, cost: { gold: 7500, wood: 9000, stone: 9000, food: 0 }, time: 420, reqCityHall: 5, resourceCap: 120000, desc: 'Increases capacity to 120,000 each.' },
        { level: 6, cost: { gold: 16000, wood: 20000, stone: 20000, food: 0 }, time: 800, reqCityHall: 6, resourceCap: 260000, desc: 'Increases capacity to 260,000 each.' },
        { level: 7, cost: { gold: 35000, wood: 42000, stone: 42000, food: 0 }, time: 1600, reqCityHall: 7, resourceCap: 550000, desc: 'Increases capacity to 550,000 each.' },
        { level: 8, cost: { gold: 72000, wood: 88000, stone: 88000, food: 0 }, time: 3200, reqCityHall: 8, resourceCap: 1200000, desc: 'Increases capacity to 1,200,000 each.' },
        { level: 9, cost: { gold: 150000, wood: 180000, stone: 180000, food: 0 }, time: 6400, reqCityHall: 9, resourceCap: 2500000, desc: 'Increases capacity to 2,500,000 each.' },
        { level: 10, cost: { gold: 300000, wood: 360000, stone: 360000, food: 0 }, time: 12800, reqCityHall: 10, resourceCap: 6000000, desc: 'Apex Warehouse: 6,000,000 capacity.' }
      ]
    },

    gold_mine: {
      type: 'gold_mine',
      name: 'Gold Mine',
      category: CATEGORIES.RESOURCES,
      icon: '⛏️',
      description: 'Extracts precious gold ore from rich veins below. Continually generates Gold over time.',
      size: { w: 1, h: 1 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 100, wood: 150, stone: 100, food: 50 }, time: 10, reqCityHall: 1, rate: 12, desc: '+12 Gold / minute' },
        { level: 2, cost: { gold: 300, wood: 400, stone: 300, food: 150 }, time: 30, reqCityHall: 1, rate: 30, desc: '+30 Gold / minute' },
        { level: 3, cost: { gold: 800, wood: 1000, stone: 750, food: 400 }, time: 75, reqCityHall: 2, rate: 70, desc: '+70 Gold / minute' },
        { level: 4, cost: { gold: 2000, wood: 2400, stone: 1800, food: 900 }, time: 160, reqCityHall: 3, rate: 150, desc: '+150 Gold / minute' },
        { level: 5, cost: { gold: 4800, wood: 5600, stone: 4200, food: 2100 }, time: 320, reqCityHall: 4, rate: 320, desc: '+320 Gold / minute' },
        { level: 6, cost: { gold: 11000, wood: 13000, stone: 9500, food: 4800 }, time: 640, reqCityHall: 5, rate: 680, desc: '+680 Gold / minute' },
        { level: 7, cost: { gold: 24000, wood: 28000, stone: 21000, food: 10500 }, time: 1200, reqCityHall: 6, rate: 1400, desc: '+1,400 Gold / minute' },
        { level: 8, cost: { gold: 50000, wood: 60000, stone: 44000, food: 22000 }, time: 2400, reqCityHall: 7, rate: 2900, desc: '+2,900 Gold / minute' },
        { level: 9, cost: { gold: 105000, wood: 125000, stone: 92000, food: 46000 }, time: 4800, reqCityHall: 8, rate: 6000, desc: '+6,000 Gold / minute' },
        { level: 10, cost: { gold: 220000, wood: 260000, stone: 190000, food: 95000 }, time: 9600, reqCityHall: 9, rate: 12500, desc: '+12,500 Gold / minute' }
      ]
    },

    lumber_yard: {
      type: 'lumber_yard',
      name: 'Lumber Yard',
      category: CATEGORIES.RESOURCES,
      icon: '🪓',
      description: 'Harvests timber and produces treated wood required for constructing and reinforcing buildings.',
      size: { w: 1, h: 1 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 80, wood: 50, stone: 80, food: 40 }, time: 8, reqCityHall: 1, rate: 16, desc: '+16 Wood / minute' },
        { level: 2, cost: { gold: 240, wood: 150, stone: 240, food: 120 }, time: 25, reqCityHall: 1, rate: 40, desc: '+40 Wood / minute' },
        { level: 3, cost: { gold: 650, wood: 400, stone: 650, food: 320 }, time: 60, reqCityHall: 2, rate: 90, desc: '+90 Wood / minute' },
        { level: 4, cost: { gold: 1600, wood: 1000, stone: 1600, food: 800 }, time: 130, reqCityHall: 3, rate: 190, desc: '+190 Wood / minute' },
        { level: 5, cost: { gold: 3800, wood: 2400, stone: 3800, food: 1800 }, time: 260, reqCityHall: 4, rate: 400, desc: '+400 Wood / minute' },
        { level: 6, cost: { gold: 9000, wood: 5500, stone: 9000, food: 4200 }, time: 520, reqCityHall: 5, rate: 850, desc: '+850 Wood / minute' },
        { level: 7, cost: { gold: 20000, wood: 12000, stone: 20000, food: 9500 }, time: 1000, reqCityHall: 6, rate: 1750, desc: '+1,750 Wood / minute' },
        { level: 8, cost: { gold: 42000, wood: 26000, stone: 42000, food: 20000 }, time: 2000, reqCityHall: 7, rate: 3600, desc: '+3,600 Wood / minute' },
        { level: 9, cost: { gold: 88000, wood: 54000, stone: 88000, food: 42000 }, time: 4000, reqCityHall: 8, rate: 7400, desc: '+7,400 Wood / minute' },
        { level: 10, cost: { gold: 180000, wood: 110000, stone: 180000, food: 85000 }, time: 8000, reqCityHall: 9, rate: 15000, desc: '+15,000 Wood / minute' }
      ]
    },

    stone_quarry: {
      type: 'stone_quarry',
      name: 'Stone Quarry',
      category: CATEGORIES.RESOURCES,
      icon: '🧱',
      description: 'Excavates granite and marble blocks crucial for strong foundations and advanced architectural upgrades.',
      size: { w: 1, h: 1 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 120, wood: 160, stone: 40, food: 50 }, time: 12, reqCityHall: 1, rate: 14, desc: '+14 Stone / minute' },
        { level: 2, cost: { gold: 340, wood: 420, stone: 120, food: 140 }, time: 35, reqCityHall: 1, rate: 35, desc: '+35 Stone / minute' },
        { level: 3, cost: { gold: 850, wood: 1050, stone: 300, food: 350 }, time: 80, reqCityHall: 2, rate: 80, desc: '+80 Stone / minute' },
        { level: 4, cost: { gold: 2100, wood: 2500, stone: 750, food: 850 }, time: 170, reqCityHall: 3, rate: 170, desc: '+170 Stone / minute' },
        { level: 5, cost: { gold: 5000, wood: 6000, stone: 1800, food: 2000 }, time: 340, reqCityHall: 4, rate: 360, desc: '+360 Stone / minute' },
        { level: 6, cost: { gold: 12000, wood: 14000, stone: 4200, food: 4600 }, time: 680, reqCityHall: 5, rate: 760, desc: '+760 Stone / minute' },
        { level: 7, cost: { gold: 26000, wood: 30000, stone: 9000, food: 10000 }, time: 1300, reqCityHall: 6, rate: 1550, desc: '+1,550 Stone / minute' },
        { level: 8, cost: { gold: 54000, wood: 64000, stone: 19000, food: 21000 }, time: 2600, reqCityHall: 7, rate: 3200, desc: '+3,200 Stone / minute' },
        { level: 9, cost: { gold: 112000, wood: 132000, stone: 40000, food: 44000 }, time: 5200, reqCityHall: 8, rate: 6600, desc: '+6,600 Stone / minute' },
        { level: 10, cost: { gold: 230000, wood: 270000, stone: 82000, food: 90000 }, time: 10400, reqCityHall: 9, rate: 13600, desc: '+13,600 Stone / minute' }
      ]
    },

    farm: {
      type: 'farm',
      name: 'Agricultural Farm',
      category: CATEGORIES.RESOURCES,
      icon: '🚜',
      description: 'Produces abundant grain and crops to feed your citizens and sustain expanding construction crews.',
      size: { w: 1, h: 1 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 70, wood: 120, stone: 50, food: 0 }, time: 8, reqCityHall: 1, rate: 20, desc: '+20 Food / minute' },
        { level: 2, cost: { gold: 200, wood: 320, stone: 140, food: 0 }, time: 22, reqCityHall: 1, rate: 50, desc: '+50 Food / minute' },
        { level: 3, cost: { gold: 550, wood: 850, stone: 380, food: 0 }, time: 55, reqCityHall: 2, rate: 110, desc: '+110 Food / minute' },
        { level: 4, cost: { gold: 1400, wood: 2100, stone: 950, food: 0 }, time: 120, reqCityHall: 3, rate: 230, desc: '+230 Food / minute' },
        { level: 5, cost: { gold: 3400, wood: 5000, stone: 2300, food: 0 }, time: 240, reqCityHall: 4, rate: 480, desc: '+480 Food / minute' },
        { level: 6, cost: { gold: 8000, wood: 11500, stone: 5300, food: 0 }, time: 480, reqCityHall: 5, rate: 1000, desc: '+1,000 Food / minute' },
        { level: 7, cost: { gold: 18000, wood: 25000, stone: 11500, food: 0 }, time: 950, reqCityHall: 6, rate: 2100, desc: '+2,100 Food / minute' },
        { level: 8, cost: { gold: 38000, wood: 54000, stone: 25000, food: 0 }, time: 1900, reqCityHall: 7, rate: 4300, desc: '+4,300 Food / minute' },
        { level: 9, cost: { gold: 80000, wood: 112000, stone: 52000, food: 0 }, time: 3800, reqCityHall: 8, rate: 8800, desc: '+8,800 Food / minute' },
        { level: 10, cost: { gold: 165000, wood: 230000, stone: 105000, food: 0 }, time: 7600, reqCityHall: 9, rate: 18000, desc: '+18,000 Food / minute' }
      ]
    },

    marketplace: {
      type: 'marketplace',
      name: 'Grand Bazaar',
      category: CATEGORIES.DEVELOPMENT,
      icon: '⚖️',
      description: 'A bustling trade exchange allowing you to convert surplus materials into other vital resources.',
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
      name: 'Academy of Science',
      category: CATEGORIES.DEVELOPMENT,
      icon: '🔬',
      description: 'Houses scholars and inventors exploring groundbreaking technologies that boost empire-wide production and speed.',
      size: { w: 2, h: 2 },
      maxLevel: 5,
      unique: true,
      levels: [
        { level: 1, cost: { gold: 1000, wood: 1200, stone: 900, food: 600 }, time: 45, reqCityHall: 3, techTier: 1, desc: 'Unlocks Tier 1 scientific research.' },
        { level: 2, cost: { gold: 3000, wood: 3600, stone: 2700, food: 1800 }, time: 150, reqCityHall: 4, techTier: 2, desc: 'Unlocks Tier 2 advanced innovations.' },
        { level: 3, cost: { gold: 8000, wood: 9500, stone: 7200, food: 4800 }, time: 360, reqCityHall: 5, techTier: 3, desc: 'Unlocks Tier 3 master discoveries.' },
        { level: 4, cost: { gold: 20000, wood: 24000, stone: 18000, food: 12000 }, time: 800, reqCityHall: 6, techTier: 4, desc: 'Unlocks Tier 4 industrial breakthroughs.' },
        { level: 5, cost: { gold: 50000, wood: 60000, stone: 45000, food: 30000 }, time: 1800, reqCityHall: 7, techTier: 5, desc: 'Apex Academy: Unlocks wonder technologies.' }
      ]
    },

    // =========================================================================
    // MILITARY BUILDINGS
    // =========================================================================
    training_grounds: {
      type: 'training_grounds',
      name: 'Training Grounds',
      category: CATEGORIES.MILITARY,
      icon: '⚔️',
      description: 'Drills and equips recruits into steadfast Guardians, sharpshooter Rangers, and swift Vanguard raiders.',
      size: { w: 2, h: 2 },
      maxLevel: 5,
      levels: [
        { level: 1, cost: { gold: 400, wood: 500, stone: 300, food: 350 }, time: 25, reqCityHall: 1, troopCap: 20, desc: 'Unlocks Guardians. +20 Troop Capacity.' },
        { level: 2, cost: { gold: 1200, wood: 1500, stone: 900, food: 800 }, time: 70, reqCityHall: 2, troopCap: 45, desc: 'Unlocks Rangers. +45 Troop Capacity.' },
        { level: 3, cost: { gold: 3200, wood: 4000, stone: 2400, food: 2200 }, time: 180, reqCityHall: 3, troopCap: 80, desc: 'Unlocks Vanguard Raiders. +80 Troop Capacity.' },
        { level: 4, cost: { gold: 8000, wood: 10000, stone: 6000, food: 5500 }, time: 420, reqCityHall: 4, troopCap: 130, desc: 'Veteran Barracks. +130 Troop Capacity.' },
        { level: 5, cost: { gold: 20000, wood: 24000, stone: 15000, food: 14000 }, time: 900, reqCityHall: 5, troopCap: 200, desc: 'Grand War College. +200 Troop Capacity.' }
      ]
    },

    warrior_academy: {
      type: 'warrior_academy',
      name: 'Warrior Academy',
      category: CATEGORIES.MILITARY,
      icon: '🛡️',
      description: 'Advanced combat school that trains heavy armored Defenders and mystical Energy Mages.',
      size: { w: 2, h: 2 },
      maxLevel: 5,
      levels: [
        { level: 1, cost: { gold: 1500, wood: 1200, stone: 1800, food: 1000 }, time: 90, reqCityHall: 3, troopCap: 30, desc: 'Unlocks Heavy Defenders.' },
        { level: 2, cost: { gold: 4000, wood: 3200, stone: 4800, food: 2600 }, time: 240, reqCityHall: 4, troopCap: 60, desc: 'Unlocks Energy Mages.' },
        { level: 3, cost: { gold: 9500, wood: 7500, stone: 11000, food: 6000 }, time: 540, reqCityHall: 5, troopCap: 100, desc: 'Master Tactics: +10% all troop attack power.' },
        { level: 4, cost: { gold: 22000, wood: 18000, stone: 26000, food: 14000 }, time: 1100, reqCityHall: 6, troopCap: 150, desc: 'Fortified Doctrine: +15% all troop health.' },
        { level: 5, cost: { gold: 50000, wood: 42000, stone: 58000, food: 32000 }, time: 2200, reqCityHall: 7, troopCap: 220, desc: 'Apex Academy: Champions of the Empire.' }
      ]
    },

    unit_workshop: {
      type: 'unit_workshop',
      name: 'Unit Workshop',
      category: CATEGORIES.MILITARY,
      icon: '⚙️',
      description: 'Industrial foundry manufacturing heavy Siege Rams engineered to demolish defensive walls and towers.',
      size: { w: 2, h: 2 },
      maxLevel: 5,
      levels: [
        { level: 1, cost: { gold: 2500, wood: 3500, stone: 2800, food: 1200 }, time: 140, reqCityHall: 4, desc: 'Unlocks Siege Rams. +20 Siege Capacity.' },
        { level: 2, cost: { gold: 6000, wood: 8500, stone: 6800, food: 3000 }, time: 340, reqCityHall: 5, desc: 'Reinforced Iron Plating: +20% Siege Ram HP.' },
        { level: 3, cost: { gold: 14000, wood: 19000, stone: 15000, food: 7000 }, time: 750, reqCityHall: 6, desc: 'High-Velocity Piston: +25% Siege Ram Wall Damage.' },
        { level: 4, cost: { gold: 32000, wood: 42000, stone: 34000, food: 16000 }, time: 1600, reqCityHall: 7, desc: 'Steam Traction Engine: +20% Siege Ram Speed.' },
        { level: 5, cost: { gold: 75000, wood: 95000, stone: 78000, food: 36000 }, time: 3200, reqCityHall: 8, desc: 'Legendary Siege Manufactory: +40% Destruction Power.' }
      ]
    },

    // =========================================================================
    // DEFENSE BUILDINGS
    // =========================================================================
    watch_tower: {
      type: 'watch_tower',
      name: 'Watch Tower',
      category: CATEGORIES.DEFENSE,
      icon: '🏹',
      description: 'Elevated stone battlement stationing marksmen that fire continuous piercing arrows at hostile invaders.',
      size: { w: 1, h: 1 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 150, wood: 200, stone: 150, food: 0 }, time: 12, reqCityHall: 1, range: 4.8, damage: 28, rate: 1.0, hp: 350, desc: 'Range: 4.8 | Damage: 28/s | HP: 350' },
        { level: 2, cost: { gold: 400, wood: 500, stone: 400, food: 0 }, time: 35, reqCityHall: 2, range: 5.0, damage: 45, rate: 1.0, hp: 550, desc: 'Range: 5.0 | Damage: 45/s | HP: 550' },
        { level: 3, cost: { gold: 950, wood: 1200, stone: 950, food: 0 }, time: 80, reqCityHall: 3, range: 5.2, damage: 70, rate: 1.1, hp: 850, desc: 'Range: 5.2 | Damage: 70/s | HP: 850' },
        { level: 4, cost: { gold: 2200, wood: 2800, stone: 2200, food: 0 }, time: 170, reqCityHall: 4, range: 5.5, damage: 110, rate: 1.1, hp: 1300, desc: 'Range: 5.5 | Damage: 110/s | HP: 1,300' },
        { level: 5, cost: { gold: 5000, wood: 6200, stone: 5000, food: 0 }, time: 350, reqCityHall: 5, range: 5.8, damage: 165, rate: 1.2, hp: 2000, desc: 'Range: 5.8 | Damage: 165/s | HP: 2,000' },
        { level: 6, cost: { gold: 11000, wood: 13500, stone: 11000, food: 0 }, time: 700, reqCityHall: 6, range: 6.0, damage: 240, rate: 1.2, hp: 3000, desc: 'Range: 6.0 | Damage: 240/s | HP: 3,000' },
        { level: 7, cost: { gold: 24000, wood: 29000, stone: 24000, food: 0 }, time: 1400, reqCityHall: 7, range: 6.2, damage: 350, rate: 1.3, hp: 4400, desc: 'Range: 6.2 | Damage: 350/s | HP: 4,400' },
        { level: 8, cost: { gold: 50000, wood: 60000, stone: 50000, food: 0 }, time: 2700, reqCityHall: 8, range: 6.5, damage: 500, rate: 1.3, hp: 6500, desc: 'Range: 6.5 | Damage: 500/s | HP: 6,500' },
        { level: 9, cost: { gold: 105000, wood: 125000, stone: 105000, food: 0 }, time: 5200, reqCityHall: 9, range: 6.8, damage: 720, rate: 1.4, hp: 9500, desc: 'Range: 6.8 | Damage: 720/s | HP: 9,500' },
        { level: 10, cost: { gold: 220000, wood: 260000, stone: 220000, food: 0 }, time: 10000, reqCityHall: 10, range: 7.2, damage: 1050, rate: 1.5, hp: 14000, desc: 'Apex Sniper Citadel: 1,050 Dmg/s' }
      ]
    },

    defense_cannon: {
      type: 'defense_cannon',
      name: 'Defense Cannon',
      category: CATEGORIES.DEFENSE,
      icon: '💣',
      description: 'Fires heavy explosive cannonballs that detonate on impact, decimating advancing enemy clusters.',
      size: { w: 1, h: 1 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 250, wood: 150, stone: 300, food: 0 }, time: 20, reqCityHall: 2, range: 4.2, damage: 65, rate: 0.6, splash: 1.2, hp: 450, desc: 'Range: 4.2 | Area Dmg: 65 | HP: 450' },
        { level: 2, cost: { gold: 650, wood: 400, stone: 800, food: 0 }, time: 50, reqCityHall: 2, range: 4.4, damage: 105, rate: 0.6, splash: 1.2, hp: 700, desc: 'Range: 4.4 | Area Dmg: 105 | HP: 700' },
        { level: 3, cost: { gold: 1500, wood: 900, stone: 1800, food: 0 }, time: 110, reqCityHall: 3, range: 4.6, damage: 165, rate: 0.65, splash: 1.3, hp: 1100, desc: 'Range: 4.6 | Area Dmg: 165 | HP: 1,100' },
        { level: 4, cost: { gold: 3400, wood: 2100, stone: 4200, food: 0 }, time: 220, reqCityHall: 4, range: 4.8, damage: 255, rate: 0.65, splash: 1.3, hp: 1700, desc: 'Range: 4.8 | Area Dmg: 255 | HP: 1,700' },
        { level: 5, cost: { gold: 7800, wood: 4800, stone: 9500, food: 0 }, time: 440, reqCityHall: 5, range: 5.0, damage: 380, rate: 0.7, splash: 1.4, hp: 2600, desc: 'Range: 5.0 | Area Dmg: 380 | HP: 2,600' },
        { level: 6, cost: { gold: 17000, wood: 10500, stone: 21000, food: 0 }, time: 850, reqCityHall: 6, range: 5.2, damage: 550, rate: 0.7, splash: 1.4, hp: 3900, desc: 'Range: 5.2 | Area Dmg: 550 | HP: 3,900' },
        { level: 7, cost: { gold: 36000, wood: 22000, stone: 44000, food: 0 }, time: 1650, reqCityHall: 7, range: 5.4, damage: 780, rate: 0.75, splash: 1.5, hp: 5800, desc: 'Range: 5.4 | Area Dmg: 780 | HP: 5,800' },
        { level: 8, cost: { gold: 75000, wood: 45000, stone: 90000, food: 0 }, time: 3200, reqCityHall: 8, range: 5.6, damage: 1100, rate: 0.75, splash: 1.5, hp: 8400, desc: 'Range: 5.6 | Area Dmg: 1,100 | HP: 8,400' },
        { level: 9, cost: { gold: 155000, wood: 92000, stone: 185000, food: 0 }, time: 6200, reqCityHall: 9, range: 5.8, damage: 1550, rate: 0.8, splash: 1.6, hp: 12000, desc: 'Range: 5.8 | Area Dmg: 1,550 | HP: 12,000' },
        { level: 10, cost: { gold: 310000, wood: 185000, stone: 370000, food: 0 }, time: 12000, reqCityHall: 10, range: 6.2, damage: 2200, rate: 0.85, splash: 1.8, hp: 17500, desc: 'Apex Howitzer: 2,200 Blast Dmg' }
      ]
    },

    energy_tower: {
      type: 'energy_tower',
      name: 'Energy Obelisk',
      category: CATEGORIES.DEFENSE,
      icon: '⚡',
      description: 'Harnesses raw ether crystals into a sustained high-voltage beam that pierces through enemy armored hulls.',
      size: { w: 1, h: 1 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 500, wood: 300, stone: 450, food: 0 }, time: 35, reqCityHall: 3, range: 5.2, damage: 110, rate: 1.2, hp: 600, desc: 'Range: 5.2 | Beam: 110/s | HP: 600' },
        { level: 2, cost: { gold: 1200, wood: 750, stone: 1100, food: 0 }, time: 80, reqCityHall: 3, range: 5.5, damage: 180, rate: 1.2, hp: 950, desc: 'Range: 5.5 | Beam: 180/s | HP: 950' },
        { level: 3, cost: { gold: 2700, wood: 1700, stone: 2500, food: 0 }, time: 175, reqCityHall: 4, range: 5.8, damage: 285, rate: 1.3, hp: 1450, desc: 'Range: 5.8 | Beam: 285/s | HP: 1,450' },
        { level: 4, cost: { gold: 6000, wood: 3800, stone: 5500, food: 0 }, time: 360, reqCityHall: 5, range: 6.0, damage: 440, rate: 1.3, hp: 2200, desc: 'Range: 6.0 | Beam: 440/s | HP: 2,200' },
        { level: 5, cost: { gold: 13000, wood: 8200, stone: 12000, food: 0 }, time: 720, reqCityHall: 6, range: 6.3, damage: 660, rate: 1.4, hp: 3300, desc: 'Range: 6.3 | Beam: 660/s | HP: 3,300' },
        { level: 6, cost: { gold: 28000, wood: 17500, stone: 26000, food: 0 }, time: 1400, reqCityHall: 7, range: 6.6, damage: 960, rate: 1.4, hp: 4800, desc: 'Range: 6.6 | Beam: 960/s | HP: 4,800' },
        { level: 7, cost: { gold: 58000, wood: 36000, stone: 54000, food: 0 }, time: 2700, reqCityHall: 8, range: 6.8, damage: 1380, rate: 1.5, hp: 7000, desc: 'Range: 6.8 | Beam: 1,380/s | HP: 7,000' },
        { level: 8, cost: { gold: 120000, wood: 75000, stone: 110000, food: 0 }, time: 5200, reqCityHall: 9, range: 7.1, damage: 1950, rate: 1.5, hp: 10000, desc: 'Range: 7.1 | Beam: 1,950/s | HP: 10,000' },
        { level: 9, cost: { gold: 245000, wood: 155000, stone: 225000, food: 0 }, time: 9800, reqCityHall: 10, range: 7.4, damage: 2700, rate: 1.6, hp: 14500, desc: 'Range: 7.4 | Beam: 2,700/s | HP: 14,500' },
        { level: 10, cost: { gold: 490000, wood: 310000, stone: 450000, food: 0 }, time: 18000, reqCityHall: 10, range: 7.8, damage: 3800, rate: 1.7, hp: 21000, desc: 'Apex Tesla Lance: 3,800 Thermal Beam/s' }
      ]
    },

    defense_wall: {
      type: 'defense_wall',
      name: 'Defensive Wall',
      category: CATEGORIES.DEFENSE,
      icon: '🧱',
      description: 'Solid fortified stone ramparts that funnel and delay enemy advances. Connects with adjacent walls.',
      size: { w: 1, h: 1 },
      maxLevel: 10,
      levels: [
        { level: 1, cost: { gold: 30, wood: 40, stone: 60, food: 0 }, time: 5, reqCityHall: 1, hp: 500, desc: 'Wall HP: 500' },
        { level: 2, cost: { gold: 80, wood: 100, stone: 150, food: 0 }, time: 15, reqCityHall: 2, hp: 900, desc: 'Wall HP: 900' },
        { level: 3, cost: { gold: 180, wood: 220, stone: 350, food: 0 }, time: 35, reqCityHall: 3, hp: 1500, desc: 'Wall HP: 1,500' },
        { level: 4, cost: { gold: 400, wood: 500, stone: 800, food: 0 }, time: 75, reqCityHall: 4, hp: 2400, desc: 'Wall HP: 2,400' },
        { level: 5, cost: { gold: 900, wood: 1100, stone: 1800, food: 0 }, time: 160, reqCityHall: 5, hp: 3700, desc: 'Wall HP: 3,700' },
        { level: 6, cost: { gold: 2000, wood: 2400, stone: 3900, food: 0 }, time: 320, reqCityHall: 6, hp: 5500, desc: 'Wall HP: 5,500' },
        { level: 7, cost: { gold: 4500, wood: 5200, stone: 8500, food: 0 }, time: 640, reqCityHall: 7, hp: 8000, desc: 'Wall HP: 8,000' },
        { level: 8, cost: { gold: 10000, wood: 11500, stone: 18500, food: 0 }, time: 1250, reqCityHall: 8, hp: 11500, desc: 'Wall HP: 11,500' },
        { level: 9, cost: { gold: 22000, wood: 25000, stone: 40000, food: 0 }, time: 2400, reqCityHall: 9, hp: 16500, desc: 'Wall HP: 16,500' },
        { level: 10, cost: { gold: 48000, wood: 55000, stone: 88000, food: 0 }, time: 4800, reqCityHall: 10, hp: 24000, desc: 'Apex Aegis Bastion: 24,000 HP' }
      ]
    },

    // =========================================================================
    // DECORATIONS & MONUMENTS
    // =========================================================================
    hero_statue: {
      type: 'hero_statue',
      name: 'Heroic Monument',
      category: CATEGORIES.DECORATIONS,
      icon: '🗿',
      description: 'Magnificent sculpted monument honoring fallen empire champions. Boosts citizen morale and City Power.',
      size: { w: 1, h: 1 },
      maxLevel: 3,
      levels: [
        { level: 1, cost: { gold: 500, wood: 200, stone: 800, food: 0 }, time: 30, reqCityHall: 2, power: 150, happiness: 5, desc: '+150 City Power, +5% Happiness' },
        { level: 2, cost: { gold: 1500, wood: 600, stone: 2400, food: 0 }, time: 90, reqCityHall: 3, power: 350, happiness: 10, desc: '+350 City Power, +10% Happiness' },
        { level: 3, cost: { gold: 4500, wood: 1800, stone: 7000, food: 0 }, time: 240, reqCityHall: 4, power: 800, happiness: 18, desc: '+800 City Power, +18% Happiness' }
      ]
    },

    crystal_fountain: {
      type: 'crystal_fountain',
      name: 'Aura Fountain',
      category: CATEGORIES.DECORATIONS,
      icon: '⛲',
      description: 'Luminescent fountain bubbling with enchanted celestial waters. Radiates immense beauty and empire prestige.',
      size: { w: 1, h: 1 },
      maxLevel: 3,
      levels: [
        { level: 1, cost: { gold: 800, wood: 400, stone: 1000, food: 0 }, time: 45, reqCityHall: 3, power: 250, happiness: 8, desc: '+250 City Power, +8% Happiness' },
        { level: 2, cost: { gold: 2400, wood: 1200, stone: 3000, food: 0 }, time: 130, reqCityHall: 4, power: 600, happiness: 15, desc: '+600 City Power, +15% Happiness' },
        { level: 3, cost: { gold: 7000, wood: 3500, stone: 8500, food: 0 }, time: 360, reqCityHall: 5, power: 1400, happiness: 25, desc: '+1,400 City Power, +25% Happiness' }
      ]
    }
  };

  // Technologies available in Academy of Science
  const TECH_TREE = [
    {
      id: 'scaffolding',
      tier: 1,
      name: 'Reinforced Scaffolding',
      icon: '🏗️',
      description: 'Modern scaffolding reduces construction and upgrade times by 15%.',
      cost: { gold: 800, wood: 1000, stone: 600, food: 400 },
      effect: { type: 'speedup', percent: 15 }
    },
    {
      id: 'deep_mining',
      tier: 1,
      name: 'Deep-Shaft Mining',
      icon: '⛏️',
      description: 'Advanced pneumatic drills boost all Gold Mine yields by 20%.',
      cost: { gold: 1200, wood: 800, stone: 1000, food: 500 },
      effect: { type: 'boost_resource', resource: 'gold', percent: 20 }
    },
    {
      id: 'sawmill_steam',
      tier: 2,
      name: 'Steam-Powered Saws',
      icon: '⚙️',
      description: 'High-torque steam saws increase Lumber Yard wood harvesting by 20%.',
      cost: { gold: 2500, wood: 2000, stone: 2200, food: 1200 },
      effect: { type: 'boost_resource', resource: 'wood', percent: 20 }
    },
    {
      id: 'crop_rotation',
      tier: 2,
      name: 'Four-Field Rotation',
      icon: '🌱',
      description: 'Soil nutrient management boosts Agricultural Farm yields by 25%.',
      cost: { gold: 2200, wood: 2600, stone: 1500, food: 2000 },
      effect: { type: 'boost_resource', resource: 'food', percent: 25 }
    },
    {
      id: 'reinforced_masonry',
      tier: 3,
      name: 'Polymer Masonry',
      icon: '🏰',
      description: 'Expands Treasury and Storage capacities by an additional 25%.',
      cost: { gold: 6000, wood: 7000, stone: 8000, food: 4000 },
      effect: { type: 'boost_storage', percent: 25 }
    },
    {
      id: 'quarry_explosives',
      tier: 3,
      name: 'Controlled Blasting',
      icon: '💥',
      description: 'Precision charges boost Stone Quarry extraction yields by 25%.',
      cost: { gold: 7500, wood: 6500, stone: 9000, food: 5000 },
      effect: { type: 'boost_resource', resource: 'stone', percent: 25 }
    }
  ];

  // =========================================================================
  // MILITARY UNITS SPECIFICATION
  // =========================================================================
  const UNITS = {
    guardian: {
      id: 'guardian',
      name: 'Guardian',
      icon: '🛡️',
      role: 'Melee Infantry',
      tier: 1,
      power: 176,
      description: 'Stalwart frontline swordsman with heavy iron plate and buckler.',
      hp: 240,
      damage: 28,
      range: 1.0,
      speed: 1.3,
      attackSpeed: 1.0,
      trainTime: 6,
      cost: { gold: 30, food: 25 },
      housing: 1,
      reqBuilding: 'training_grounds',
      reqLevel: 1
    },
    ranger: {
      id: 'ranger',
      name: 'Ranger',
      icon: '🏹',
      role: 'Ranged Sharpshooter',
      tier: 1,
      power: 146,
      description: 'Expert longbow archer capable of safely picking off defensive towers from a distance.',
      hp: 140,
      damage: 38,
      range: 4.6,
      speed: 1.1,
      attackSpeed: 0.9,
      trainTime: 10,
      cost: { gold: 45, wood: 40 },
      housing: 1,
      reqBuilding: 'training_grounds',
      reqLevel: 2
    },
    vanguard: {
      id: 'vanguard',
      name: 'Vanguard Raider',
      icon: '🐎',
      role: 'Mounted Cavalry',
      tier: 2,
      power: 274,
      description: 'Swift armored shock cavalry that breaches perimeter defenses with high momentum.',
      hp: 340,
      damage: 52,
      range: 1.0,
      speed: 2.2,
      attackSpeed: 1.2,
      trainTime: 18,
      cost: { gold: 90, food: 70 },
      housing: 2,
      reqBuilding: 'training_grounds',
      reqLevel: 3
    },
    heavy_defender: {
      id: 'heavy_defender',
      name: 'Heavy Defender',
      icon: '🪖',
      role: 'Armored Juggernaut',
      tier: 2,
      power: 473,
      description: 'Colossal shield bearer boasting massive hit points to absorb intense defensive turret fire.',
      hp: 850,
      damage: 24,
      range: 1.0,
      speed: 0.8,
      attackSpeed: 0.8,
      trainTime: 30,
      cost: { gold: 160, stone: 120, food: 60 },
      housing: 3,
      reqBuilding: 'warrior_academy',
      reqLevel: 1
    },
    energy_mage: {
      id: 'energy_mage',
      name: 'Energy Mage',
      icon: '🔮',
      role: 'Arcane Blaster',
      tier: 3,
      power: 270,
      description: 'Channels concentrated celestial plasma dealing high area-of-effect blast damage.',
      hp: 200,
      damage: 85,
      range: 4.0,
      speed: 1.0,
      attackSpeed: 0.8,
      splash: 1.4,
      trainTime: 38,
      cost: { gold: 200, stone: 80, food: 80 },
      housing: 2,
      reqBuilding: 'warrior_academy',
      reqLevel: 2
    },
    siege_unit: {
      id: 'siege_unit',
      name: 'Siege Ram',
      icon: '🪵',
      role: 'Fortress Breaker',
      tier: 3,
      power: 610,
      description: 'Heavy steam-assisted battering ram that deals 400% bonus damage to defensive towers and walls.',
      hp: 700,
      damage: 130, // 520 vs structures
      range: 1.0,
      speed: 0.7,
      attackSpeed: 0.6,
      siegeMultiplier: 4,
      trainTime: 50,
      cost: { wood: 260, stone: 160, gold: 120 },
      housing: 4,
      reqBuilding: 'unit_workshop',
      reqLevel: 1
    }
  };

  // =========================================================================
  // WORLD MAP CAMPAIGN STRONGHOLDS
  // =========================================================================
  const WORLD_STRONGHOLDS = [
    {
      id: 'stronghold_1',
      name: 'Goblin Outpost',
      icon: '🏕️',
      tier: 1,
      difficulty: 'Easy',
      desc: 'A rogue goblin campsite harassing frontier trade routes. Light wooden fortifications.',
      recommendedPower: 400,
      loot: { gold: 800, wood: 600, stone: 400, food: 500, gems: 10, xp: 120 },
      enemyDefenses: [
        { id: 'e1', type: 'watch_tower', x: 8, y: 7, level: 1, hp: 350, maxHp: 350 },
        { id: 'e2', type: 'defense_wall', x: 7, y: 8, level: 1, hp: 300, maxHp: 300 },
        { id: 'e3', type: 'defense_wall', x: 8, y: 8, level: 1, hp: 300, maxHp: 300 },
        { id: 'e4', type: 'defense_wall', x: 9, y: 8, level: 1, hp: 300, maxHp: 300 },
        { id: 'e5', type: 'city_hall', x: 8, y: 10, level: 1, hp: 800, maxHp: 800, isMain: true }
      ]
    },
    {
      id: 'stronghold_2',
      name: 'Bandit Bastion',
      icon: '🏰',
      tier: 2,
      difficulty: 'Medium',
      desc: 'A fortified ravine stronghold stockpiling plundered ore and lumber.',
      recommendedPower: 1200,
      loot: { gold: 2200, wood: 1800, stone: 1500, food: 1200, gems: 20, xp: 280 },
      enemyDefenses: [
        { id: 'e1', type: 'watch_tower', x: 6, y: 6, level: 2, hp: 550, maxHp: 550 },
        { id: 'e2', type: 'defense_cannon', x: 12, y: 6, level: 1, hp: 450, maxHp: 450 },
        { id: 'e3', type: 'defense_wall', x: 6, y: 8, level: 2, hp: 500, maxHp: 500 },
        { id: 'e4', type: 'defense_wall', x: 7, y: 8, level: 2, hp: 500, maxHp: 500 },
        { id: 'e5', type: 'defense_wall', x: 11, y: 8, level: 2, hp: 500, maxHp: 500 },
        { id: 'e6', type: 'defense_wall', x: 12, y: 8, level: 2, hp: 500, maxHp: 500 },
        { id: 'e7', type: 'city_hall', x: 9, y: 9, level: 2, hp: 1500, maxHp: 1500, isMain: true }
      ]
    },
    {
      id: 'stronghold_3',
      name: 'Shadow Fortress',
      icon: '🏯',
      tier: 3,
      difficulty: 'Hard',
      desc: 'An ancient obsidian citadel reinforced by twin watchtowers and heavy siege cannons.',
      recommendedPower: 2800,
      loot: { gold: 5500, wood: 4500, stone: 4000, food: 3500, gems: 35, xp: 600 },
      enemyDefenses: [
        { id: 'e1', type: 'watch_tower', x: 5, y: 5, level: 3, hp: 850, maxHp: 850 },
        { id: 'e2', type: 'watch_tower', x: 13, y: 5, level: 3, hp: 850, maxHp: 850 },
        { id: 'e3', type: 'defense_cannon', x: 9, y: 5, level: 2, hp: 700, maxHp: 700 },
        { id: 'e4', type: 'energy_tower', x: 9, y: 12, level: 1, hp: 600, maxHp: 600 },
        { id: 'e5', type: 'defense_wall', x: 6, y: 7, level: 3, hp: 800, maxHp: 800 },
        { id: 'e6', type: 'defense_wall', x: 12, y: 7, level: 3, hp: 800, maxHp: 800 },
        { id: 'e7', type: 'city_hall', x: 9, y: 8, level: 3, hp: 2800, maxHp: 2800, isMain: true }
      ]
    },
    {
      id: 'stronghold_4',
      name: 'Dragonspire Keep',
      icon: '🌋',
      tier: 4,
      difficulty: 'Expert',
      desc: 'Volcanic mountain redoubt armed with high-voltage Tesla Obelisks and double ramparts.',
      recommendedPower: 6000,
      loot: { gold: 12000, wood: 10000, stone: 9500, food: 8000, gems: 60, xp: 1200 },
      enemyDefenses: [
        { id: 'e1', type: 'energy_tower', x: 6, y: 5, level: 2, hp: 950, maxHp: 950 },
        { id: 'e2', type: 'energy_tower', x: 13, y: 5, level: 2, hp: 950, maxHp: 950 },
        { id: 'e3', type: 'defense_cannon', x: 9, y: 4, level: 3, hp: 1100, maxHp: 1100 },
        { id: 'e4', type: 'watch_tower', x: 9, y: 13, level: 4, hp: 1300, maxHp: 1300 },
        { id: 'e5', type: 'defense_wall', x: 6, y: 7, level: 4, hp: 1200, maxHp: 1200 },
        { id: 'e6', type: 'defense_wall', x: 13, y: 7, level: 4, hp: 1200, maxHp: 1200 },
        { id: 'e7', type: 'city_hall', x: 9, y: 8, level: 4, hp: 5000, maxHp: 5000, isMain: true }
      ]
    },
    {
      id: 'stronghold_5',
      name: "Emperor's Bastion",
      icon: '👑',
      tier: 5,
      difficulty: 'Boss',
      desc: 'The supreme imperial bastion of the continent. Colossal hoard of wealth and impenetrable defense grid.',
      recommendedPower: 12000,
      loot: { gold: 30000, wood: 25000, stone: 25000, food: 20000, gems: 150, xp: 3000 },
      enemyDefenses: [
        { id: 'e1', type: 'energy_tower', x: 5, y: 5, level: 3, hp: 1450, maxHp: 1450 },
        { id: 'e2', type: 'energy_tower', x: 14, y: 5, level: 3, hp: 1450, maxHp: 1450 },
        { id: 'e3', type: 'defense_cannon', x: 7, y: 4, level: 4, hp: 1700, maxHp: 1700 },
        { id: 'e4', type: 'defense_cannon', x: 12, y: 4, level: 4, hp: 1700, maxHp: 1700 },
        { id: 'e5', type: 'watch_tower', x: 9, y: 13, level: 5, hp: 2000, maxHp: 2000 },
        { id: 'e6', type: 'city_hall', x: 9, y: 8, level: 5, hp: 9000, maxHp: 9000, isMain: true }
      ]
    }
  ];

  // =========================================================================
  // DAILY MISSIONS
  // =========================================================================
  const DAILY_MISSIONS = [
    { id: 'm_collect_gold', title: 'Imperial Tax', desc: 'Harvest 1,000 Gold from mines', goal: 1000, current: 0, reward: { gold: 600, gems: 5 }, completed: false },
    { id: 'm_collect_wood', title: 'Lumber Supply', desc: 'Harvest 800 Wood from lumber yards', goal: 800, current: 0, reward: { wood: 500, gems: 5 }, completed: false },
    { id: 'm_train_troops', title: 'Legion Mobilization', desc: 'Train 5 combat units in barracks', goal: 5, current: 0, reward: { food: 600, gems: 10 }, completed: false },
    { id: 'm_upgrade_bld', title: 'Civic Modernization', desc: 'Complete 1 building upgrade', goal: 1, current: 0, reward: { stone: 600, gems: 10 }, completed: false },
    { id: 'm_win_battle', title: 'Frontier Conquest', desc: 'Defeat 1 AI Stronghold on World Map', goal: 1, current: 0, reward: { gems: 25, xp: 250 }, completed: false }
  ];

  // Default initial city state for a new player
  function createStarterCity(userId = 'default_user', userName = 'Mayor') {
    return {
      version: 2,
      userId,
      cityName: `${userName}'s Metropolis`,
      level: 1,
      xp: 0,
      power: 280, // City Power Rating
      population: 50,
      troopCapacity: 25,
      happiness: 95, // 0 - 100%
      resources: {
        gold: 1000,
        wood: 800,
        stone: 600,
        food: 500,
        gems: 50 // Starter gems for speedups
      },
      storageCaps: {
        gold: 5000,
        wood: 4000,
        stone: 4000,
        food: 4000,
        gems: 999999
      },
      army: {
        guardian: 4,
        ranger: 2,
        vanguard: 0,
        heavy_defender: 0,
        energy_mage: 0,
        siege_unit: 0
      },
      trainingQueue: [],
      completedStrongholds: [],
      dailyMissions: JSON.parse(JSON.stringify(DAILY_MISSIONS)),
      lastTickTime: Date.now(),
      buildings: [
        // City Hall at center
        {
          id: 'bld_city_hall_1',
          type: 'city_hall',
          level: 1,
          x: 9,
          y: 9,
          status: 'idle', // 'idle' | 'constructing' | 'upgrading'
          finishTime: null
        },
        // Starter Lumber Yard
        {
          id: 'bld_lumber_1',
          type: 'lumber_yard',
          level: 1,
          x: 6,
          y: 8,
          status: 'idle',
          finishTime: null,
          uncollected: 0
        },
        // Starter Gold Mine
        {
          id: 'bld_gold_1',
          type: 'gold_mine',
          level: 1,
          x: 12,
          y: 8,
          status: 'idle',
          finishTime: null,
          uncollected: 0
        },
        // Starter Farm
        {
          id: 'bld_farm_1',
          type: 'farm',
          level: 1,
          x: 6,
          y: 11,
          status: 'idle',
          finishTime: null,
          uncollected: 0
        },
        // Starter Stone Quarry
        {
          id: 'bld_stone_1',
          type: 'stone_quarry',
          level: 1,
          x: 12,
          y: 11,
          status: 'idle',
          finishTime: null,
          uncollected: 0
        }
      ],
      unlockedTechs: [],
      stats: {
        totalGoldProduced: 0,
        totalWoodProduced: 0,
        totalStoneProduced: 0,
        totalFoodProduced: 0,
        buildingsConstructed: 5,
        upgradesCompleted: 0,
        battlesWon: 0
      }
    };
  }

  // Exports
  exports.GRID_SIZE = GRID_SIZE;
  exports.RESOURCES = RESOURCES;
  exports.CATEGORIES = CATEGORIES;
  exports.BUILDINGS = BUILDINGS;
  exports.UNITS = UNITS;
  exports.WORLD_STRONGHOLDS = WORLD_STRONGHOLDS;
  exports.DAILY_MISSIONS = DAILY_MISSIONS;
  exports.TECH_TREE = TECH_TREE;
  exports.createStarterCity = createStarterCity;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.CityConfig = {}));


