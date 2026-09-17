/**
 * Zombie Survival V2 - Levels, Worlds, and Maps Database
 * Centralized registry of 60 REAL playable levels across 10 distinct worlds.
 * Features 10 atmospheric map environments, Day/Dusk/Night cycles, and dynamic Weather.
 */

const WORLDS = [
  { id: 1,  name: 'Outbreak',          theme: 'Abandoned Suburb',    levels: [1, 6],   desc: 'Initial infection zone. Daylight streets, slow mutants, and survival basics.' },
  { id: 2,  name: 'Downtown Streets',  theme: 'Ruined Urban Center', levels: [7, 12],  desc: 'Urban alleys and subway entrances. Agile Runner mutants sprint through traffic.' },
  { id: 3,  name: 'Midnight City',     theme: 'Dark Metropolis',     levels: [13, 18], desc: 'Zero streetlights. Rain-slicked asphalt and sudden swarmer ambushes.' },
  { id: 4,  name: 'Industrial Zone',   theme: 'Factory Complex',     levels: [19, 24], desc: 'Heavy Tank behemoths break through blast gates in chemical fog.' },
  { id: 5,  name: 'Biohazard Quarter', theme: 'Infected District',   levels: [25, 30], desc: 'Shielded drones and Volatile Exploders roam toxic industrial ruins.' },
  { id: 6,  name: 'Dead Highway',      theme: 'Interstate 80 Ruins', levels: [31, 36], desc: 'Overturned vehicle chokepoints, stormy skies, and agile Hunter spitters.' },
  { id: 7,  name: 'Quarantine Zone',   theme: 'Checkpoint Delta',    levels: [37, 42], desc: 'Barbed barricades, Necro Healer support units, and Elite Commander squads.' },
  { id: 8,  name: 'Nightmare City',    theme: 'Ruined Megacity',     levels: [43, 48], desc: 'Extreme density, electrical storms, and aggressive mixed mutant hordes.' },
  { id: 9,  name: 'Last Stand',        theme: 'Evacuation Outpost',  levels: [49, 54], desc: 'Desperate military bunker perimeter defenses with relentless assaults.' },
  { id: 10, name: 'Citadel Zero',      theme: 'Citadel Apex',        levels: [55, 60], desc: 'Final campaign championship culminating in the Level 60 Overlord Sovereign.' }
];

const MAP_TEMPLATES = {
  map1_suburb: {
    id: 'map1_suburb',
    name: 'Abandoned Suburb',
    width: 1600,
    height: 1200,
    floorColor: '#0b1120',
    gridColor: 'rgba(30, 41, 59, 0.4)',
    obstacles: [
      { x: 280, y: 220, w: 180, h: 100, type: 'house', label: 'Residence A' },
      { x: 820, y: 180, w: 220, h: 110, type: 'house', label: 'Residence B' },
      { x: 440, y: 720, w: 200, h: 120, type: 'house', label: 'Residence C' },
      { x: 1060, y: 660, w: 240, h: 110, type: 'house', label: 'Residence D' },
      { x: 680, y: 480, w: 120, h: 60, type: 'car', label: 'Police Cruiser' },
      { x: 240, y: 560, w: 90, h: 50, type: 'car', label: 'Sedan' }
    ],
    streetLamps: [
      { x: 220, y: 400, radius: 160 },
      { x: 740, y: 380, radius: 180 },
      { x: 1350, y: 400, radius: 170 },
      { x: 740, y: 850, radius: 180 }
    ],
    spawns: [
      { x: 100, y: 100 }, { x: 800, y: 80 }, { x: 1500, y: 120 },
      { x: 100, y: 1100 }, { x: 1500, y: 1100 }
    ]
  },
  map2_downtown: {
    id: 'map2_downtown',
    name: 'Downtown Streets',
    width: 1800,
    height: 1400,
    floorColor: '#090d16',
    gridColor: 'rgba(30, 41, 59, 0.5)',
    obstacles: [
      { x: 320, y: 240, w: 240, h: 220, type: 'building', label: 'Bank Tower' },
      { x: 1120, y: 240, w: 260, h: 200, type: 'building', label: 'Metro Station' },
      { x: 320, y: 860, w: 250, h: 220, type: 'building', label: 'Mall Center' },
      { x: 1120, y: 860, w: 260, h: 240, type: 'building', label: 'Parking Garage' },
      { x: 740, y: 480, w: 140, h: 60, type: 'bus', label: 'City Bus' },
      { x: 820, y: 780, w: 130, h: 55, type: 'car', label: 'Delivery Van' }
    ],
    streetLamps: [
      { x: 240, y: 650, radius: 180 },
      { x: 900, y: 320, radius: 200 },
      { x: 900, y: 1000, radius: 200 },
      { x: 1560, y: 650, radius: 180 }
    ],
    spawns: [
      { x: 120, y: 200 }, { x: 900, y: 90 }, { x: 1680, y: 180 },
      { x: 120, y: 1250 }, { x: 900, y: 1300 }, { x: 1680, y: 1250 }
    ]
  },
  map3_midnight: {
    id: 'map3_midnight',
    name: 'Midnight City',
    width: 1750,
    height: 1350,
    floorColor: '#040711',
    gridColor: 'rgba(15, 23, 42, 0.6)',
    obstacles: [
      { x: 280, y: 220, w: 260, h: 180, type: 'building', label: 'Arcade Complex' },
      { x: 1100, y: 220, w: 280, h: 190, type: 'building', label: 'Subway Depot' },
      { x: 400, y: 780, w: 240, h: 200, type: 'building', label: 'Apartments' },
      { x: 1150, y: 780, w: 260, h: 220, type: 'building', label: 'Night Market' },
      { x: 720, y: 520, w: 130, h: 65, type: 'bus', label: 'Derelict Coach' }
    ],
    streetLamps: [
      { x: 200, y: 550, radius: 150 },
      { x: 1450, y: 550, radius: 150 },
      { x: 800, y: 260, radius: 160 }
    ],
    spawns: [
      { x: 90, y: 120 }, { x: 880, y: 80 }, { x: 1650, y: 120 },
      { x: 90, y: 1220 }, { x: 1650, y: 1220 }
    ]
  },
  map4_factory: {
    id: 'map4_factory',
    name: 'Industrial Zone',
    width: 1900,
    height: 1500,
    floorColor: '#0c0f1d',
    gridColor: 'rgba(51, 65, 85, 0.4)',
    obstacles: [
      { x: 300, y: 250, w: 320, h: 180, type: 'factory', label: 'Smelter A' },
      { x: 1200, y: 250, w: 340, h: 190, type: 'factory', label: 'Smelter B' },
      { x: 300, y: 950, w: 300, h: 220, type: 'factory', label: 'Assembly Line' },
      { x: 1250, y: 950, w: 320, h: 200, type: 'factory', label: 'Chemical Silo' },
      { x: 800, y: 650, w: 200, h: 120, type: 'crates', label: 'Cargo Pallets' },
      { x: 550, y: 620, w: 100, h: 80, type: 'crates', label: 'Steel Crates' }
    ],
    streetLamps: [
      { x: 450, y: 600, radius: 180 },
      { x: 1350, y: 600, radius: 180 },
      { x: 900, y: 350, radius: 190 },
      { x: 900, y: 1100, radius: 190 }
    ],
    spawns: [
      { x: 100, y: 150 }, { x: 950, y: 100 }, { x: 1780, y: 150 },
      { x: 100, y: 1350 }, { x: 950, y: 1400 }, { x: 1780, y: 1350 }
    ]
  },
  map5_biohazard: {
    id: 'map5_biohazard',
    name: 'Biohazard Quarter',
    width: 1850,
    height: 1450,
    floorColor: '#061314',
    gridColor: 'rgba(16, 185, 129, 0.25)',
    obstacles: [
      { x: 350, y: 260, w: 260, h: 200, type: 'factory', label: 'Quarantine Lab' },
      { x: 1150, y: 260, w: 280, h: 210, type: 'factory', label: 'Containment Vault' },
      { x: 350, y: 880, w: 280, h: 220, type: 'building', label: 'Decontamination Unit' },
      { x: 1150, y: 880, w: 260, h: 220, type: 'factory', label: 'Toxic Reservoir' },
      { x: 780, y: 580, w: 150, h: 80, type: 'crates', label: 'Biohazard Barrels' }
    ],
    streetLamps: [
      { x: 400, y: 580, radius: 170 },
      { x: 1300, y: 580, radius: 170 },
      { x: 880, y: 320, radius: 180 }
    ],
    spawns: [
      { x: 120, y: 120 }, { x: 920, y: 90 }, { x: 1720, y: 120 },
      { x: 120, y: 1320 }, { x: 1720, y: 1320 }
    ]
  },
  map6_highway: {
    id: 'map6_highway',
    name: 'Interstate Highway',
    width: 2000,
    height: 1300,
    floorColor: '#0d0f17',
    gridColor: 'rgba(71, 85, 105, 0.4)',
    obstacles: [
      { x: 400, y: 200, w: 160, h: 70, type: 'bus', label: 'Tanker Truck' },
      { x: 950, y: 220, w: 140, h: 60, type: 'car', label: 'SUV' },
      { x: 1450, y: 200, w: 150, h: 65, type: 'bus', label: 'Cargo Hauler' },
      { x: 600, y: 700, w: 150, h: 65, type: 'car', label: 'Ambulance' },
      { x: 1100, y: 720, w: 160, h: 70, type: 'bus', label: 'Highway Bus' },
      { x: 300, y: 920, w: 200, h: 90, type: 'crates', label: 'Roadblock Barriers' },
      { x: 1350, y: 920, w: 220, h: 90, type: 'crates', label: 'Toll Booth Concrete' }
    ],
    streetLamps: [
      { x: 450, y: 450, radius: 190 },
      { x: 1000, y: 450, radius: 200 },
      { x: 1550, y: 450, radius: 190 }
    ],
    spawns: [
      { x: 100, y: 100 }, { x: 1000, y: 80 }, { x: 1900, y: 100 },
      { x: 100, y: 1200 }, { x: 1900, y: 1200 }
    ]
  },
  map7_quarantine: {
    id: 'map7_quarantine',
    name: 'Checkpoint Delta',
    width: 1800,
    height: 1400,
    floorColor: '#10141e',
    gridColor: 'rgba(234, 179, 8, 0.25)',
    obstacles: [
      { x: 320, y: 240, w: 220, h: 180, type: 'building', label: 'Guard Station A' },
      { x: 1180, y: 240, w: 220, h: 180, type: 'building', label: 'Guard Station B' },
      { x: 320, y: 880, w: 240, h: 200, type: 'building', label: 'Command Bunker' },
      { x: 1180, y: 880, w: 240, h: 200, type: 'building', label: 'Armory Storage' },
      { x: 740, y: 550, w: 180, h: 80, type: 'crates', label: 'Sandbag Fortification' }
    ],
    streetLamps: [
      { x: 300, y: 560, radius: 180 },
      { x: 1300, y: 560, radius: 180 },
      { x: 800, y: 300, radius: 190 },
      { x: 800, y: 1050, radius: 190 }
    ],
    spawns: [
      { x: 100, y: 120 }, { x: 880, y: 80 }, { x: 1680, y: 120 },
      { x: 100, y: 1280 }, { x: 1680, y: 1280 }
    ]
  },
  map8_nightmare: {
    id: 'map8_nightmare',
    name: 'Ruined Megacity',
    width: 1900,
    height: 1500,
    floorColor: '#0a0614',
    gridColor: 'rgba(168, 85, 247, 0.25)',
    obstacles: [
      { x: 340, y: 240, w: 280, h: 240, type: 'building', label: 'Collapsed Skyscraper' },
      { x: 1160, y: 240, w: 300, h: 220, type: 'building', label: 'Transit Terminal' },
      { x: 340, y: 920, w: 300, h: 240, type: 'building', label: 'Plaza Tower' },
      { x: 1160, y: 920, w: 280, h: 250, type: 'building', label: 'Sub-level Entrance' },
      { x: 750, y: 580, w: 160, h: 80, type: 'bus', label: 'Burned Bus' }
    ],
    streetLamps: [
      { x: 260, y: 620, radius: 170 },
      { x: 1450, y: 620, radius: 170 },
      { x: 850, y: 350, radius: 180 }
    ],
    spawns: [
      { x: 100, y: 120 }, { x: 950, y: 90 }, { x: 1780, y: 120 },
      { x: 100, y: 1380 }, { x: 1780, y: 1380 }
    ]
  },
  map9_bunker: {
    id: 'map9_bunker',
    name: 'Evacuation Outpost',
    width: 1850,
    height: 1450,
    floorColor: '#121624',
    gridColor: 'rgba(56, 189, 248, 0.3)',
    obstacles: [
      { x: 300, y: 260, w: 280, h: 190, type: 'building', label: 'Heavy Gun Emplacement' },
      { x: 1200, y: 260, w: 280, h: 190, type: 'building', label: 'Comms Relay Station' },
      { x: 300, y: 900, w: 280, h: 220, type: 'building', label: 'Medical Ward' },
      { x: 1200, y: 900, w: 280, h: 220, type: 'building', label: 'Shield Generator' },
      { x: 780, y: 580, w: 180, h: 100, type: 'crates', label: 'Ammunition Caches' }
    ],
    streetLamps: [
      { x: 420, y: 600, radius: 190 },
      { x: 1380, y: 600, radius: 190 },
      { x: 900, y: 360, radius: 200 },
      { x: 900, y: 1050, radius: 200 }
    ],
    spawns: [
      { x: 120, y: 120 }, { x: 920, y: 90 }, { x: 1720, y: 120 },
      { x: 120, y: 1320 }, { x: 1720, y: 1320 }
    ]
  },
  map10_citadel: {
    id: 'map10_citadel',
    name: 'Citadel Zero',
    width: 2100,
    height: 1600,
    floorColor: '#070312',
    gridColor: 'rgba(239, 68, 68, 0.35)',
    obstacles: [
      { x: 380, y: 280, w: 320, h: 220, type: 'building', label: 'Citadel Pylon Alpha' },
      { x: 1320, y: 280, w: 340, h: 220, type: 'building', label: 'Citadel Pylon Beta' },
      { x: 380, y: 1020, w: 320, h: 250, type: 'building', label: 'Citadel Pylon Gamma' },
      { x: 1320, y: 1020, w: 340, h: 250, type: 'building', label: 'Citadel Pylon Delta' },
      { x: 880, y: 680, w: 220, h: 120, type: 'crates', label: 'Dark Core Reactor' }
    ],
    streetLamps: [
      { x: 450, y: 650, radius: 200 },
      { x: 1550, y: 650, radius: 200 },
      { x: 1000, y: 380, radius: 210 },
      { x: 1000, y: 1200, radius: 210 }
    ],
    spawns: [
      { x: 120, y: 150 }, { x: 1050, y: 100 }, { x: 1950, y: 150 },
      { x: 120, y: 1450 }, { x: 1050, y: 1500 }, { x: 1950, y: 1450 }
    ]
  }
};

// Aliases for backwards compatibility with V1 map keys
MAP_TEMPLATES.map1 = MAP_TEMPLATES.map1_suburb;
MAP_TEMPLATES.map2 = MAP_TEMPLATES.map2_downtown;
MAP_TEMPLATES.map3 = MAP_TEMPLATES.map4_factory;

function generateAll60Levels() {
  const levels = [];

  const worldMapKeys = [
    'map1_suburb',
    'map2_downtown',
    'map3_midnight',
    'map4_factory',
    'map5_biohazard',
    'map6_highway',
    'map7_quarantine',
    'map8_nightmare',
    'map9_bunker',
    'map10_citadel'
  ];

  // Boss assignments for the 10 worlds
  const worldBosses = [
    'brute',     // World 1: The Brute
    'ravager',   // World 2: The Ravager
    'warden',    // World 3: The Warden
    'mutant',    // World 4: The Mutant
    'overlord',  // World 5: The Overlord
    'brute',     // World 6: The Brute (Reinforced)
    'ravager',   // World 7: The Ravager (Cyber-Slasher)
    'warden',    // World 8: The Warden (Aegis Arbiter)
    'mutant',    // World 9: The Mutant (Bio-Behemoth)
    'overlord'   // World 10: The Overlord (Final Sovereign)
  ];

  for (let i = 1; i <= 60; i++) {
    const worldIndex = Math.floor((i - 1) / 6);
    const world = WORLDS[worldIndex];
    const levelInWorld = ((i - 1) % 6) + 1;
    const isBossLevel = (levelInWorld === 6);

    // Objective types
    let objType = 'ELIMINATE';
    let targetAmount = 16 + i * 3;
    let timeLimit = null;

    if (isBossLevel) {
      objType = 'BOSS';
      targetAmount = 1;
    } else {
      const objChoice = (i % 5);
      if (objChoice === 1) {
        objType = 'SURVIVE';
        targetAmount = 45 + Math.min(65, i * 2); // 45s to 110s
        timeLimit = targetAmount;
      } else if (objChoice === 2) {
        objType = 'COLLECT';
        targetAmount = 4 + Math.min(8, Math.floor(i / 8));
        timeLimit = 75 + i * 2;
      } else if (objChoice === 3) {
        objType = 'PROTECT';
        targetAmount = 55 + i;
        timeLimit = 60;
      } else if (objChoice === 4) {
        objType = 'ESCAPE';
        targetAmount = 60 + i * 2;
        timeLimit = targetAmount;
      } else {
        objType = 'ELIMINATE';
        targetAmount = 18 + i * 3;
      }
    }

    // Progressive introduction of all 10 zombie archetypes
    const enemyTypes = ['normal'];
    if (i >= 3)  enemyTypes.push('runner');
    if (i >= 7)  enemyTypes.push('swarmer');
    if (i >= 11) enemyTypes.push('exploder');
    if (i >= 16) enemyTypes.push('tank');
    if (i >= 21) enemyTypes.push('shielded');
    if (i >= 27) enemyTypes.push('healer');
    if (i >= 33) enemyTypes.push('hunter');
    if (i >= 39) enemyTypes.push('elite');

    // Boss configuration
    let bossType = null;
    if (isBossLevel) {
      bossType = worldBosses[worldIndex];
    }

    // Map environment
    const mapKey = worldMapKeys[worldIndex];

    // Day / Dusk / Night cycles
    let timeOfDay = 'day';
    if (worldIndex === 2 || worldIndex === 7 || worldIndex === 9) {
      timeOfDay = 'night';
    } else if (levelInWorld >= 4) {
      timeOfDay = 'dusk';
    } else if (levelInWorld >= 2) {
      timeOfDay = (levelInWorld % 2 === 0) ? 'dusk' : 'day';
    }

    // Weather atmosphere
    let weather = 'clear';
    if (worldIndex === 1 || worldIndex === 5) {
      weather = (i % 2 === 0) ? 'rain' : 'clear';
    } else if (worldIndex === 3 || worldIndex === 4) {
      weather = (i % 2 === 0) ? 'fog' : 'clear';
    } else if (worldIndex === 2 || worldIndex === 7 || worldIndex === 9) {
      weather = (isBossLevel || i % 3 === 0) ? 'storm' : 'rain';
    }

    // Difficulty label
    let diff = 'Normal';
    if (i <= 6) diff = 'Recruit';
    else if (i <= 12) diff = 'Standard';
    else if (i <= 18) diff = 'Challenging';
    else if (i <= 24) diff = 'Hardened';
    else if (i <= 30) diff = 'Hostile';
    else if (i <= 36) diff = 'Severe';
    else if (i <= 42) diff = 'Nightmare';
    else if (i <= 48) diff = 'Inhuman';
    else if (i <= 54) diff = 'Extreme';
    else if (i < 60)  diff = 'Apocalypse';
    else if (i === 60) diff = 'FINAL CHAMPIONSHIP';

    const waveCount = isBossLevel ? 3 : (2 + Math.min(5, Math.floor(i / 10)));
    const totalEnemies = isBossLevel ? (26 + i * 2) : (18 + i * 3);

    levels.push({
      id: i,
      name: isBossLevel ? `Sector ${i}: ${world.name} Boss` : `Sector ${i}: ${world.name} - Stage ${levelInWorld}`,
      worldId: world.id,
      worldName: world.name,
      levelInWorld: levelInWorld,
      mapId: mapKey,
      objective: objType,
      objectiveTarget: targetAmount,
      objectiveDesc: isBossLevel
        ? `Defeat ${bossType ? bossType.toUpperCase() : 'BOSS'} commanding Sector ${i}!`
        : (objType === 'SURVIVE' ? `Survive for ${targetAmount} seconds.`
           : objType === 'COLLECT' ? `Recover all ${targetAmount} supply beacons.`
           : objType === 'PROTECT' ? `Defend the military transmitter for 60s.`
           : objType === 'ESCAPE' ? `Fight through to the extraction zone!`
           : `Eliminate ${targetAmount} infected hostiles.`),
      timeLimit: timeLimit,
      enemyTypes: enemyTypes,
      enemyCount: totalEnemies,
      waveCount: waveCount,
      difficulty: diff,
      levelScaling: 1.0 + (i - 1) * 0.045,
      isBossLevel: isBossLevel,
      bossType: bossType,
      timeOfDay: timeOfDay,
      weather: weather,
      reward: {
        xp: 150 + i * 35,
        coins: 80 + i * 20
      },
      starRequirements: {
        star1: 'Complete Primary Objective',
        star2: 'Finish with > 50% Health',
        star3: 'Achieve > 70% Accuracy or Quick Clear'
      },
      unlockRequirement: i === 1 ? null : `Complete Level ${i - 1}`
    });
  }

  return levels;
}

const LEVELS = generateAll60Levels();

window.WORLDS = WORLDS;
window.MAP_TEMPLATES = MAP_TEMPLATES;
window.LEVELS = LEVELS;
