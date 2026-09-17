/**
 * Zombie Survival - Levels, Worlds, and Maps Database
 * Centralized registry of 60 REAL playable levels across 10 distinct worlds.
 */

const WORLDS = [
  { id: 1,  name: 'Outbreak',          theme: 'Abandoned Suburb',    levels: [1, 6],   desc: 'Initial infection zone. Slow zombies and basic objectives.' },
  { id: 2,  name: 'Abandoned City',    theme: 'Downtown Streets',    levels: [7, 12],  desc: 'Urban ruins. Rapid Runner mutants emerge from subway alleys.' },
  { id: 3,  name: 'Dark Streets',      theme: 'Midnight City',       levels: [13, 18], desc: 'Zero street illumination. Increased horde frequency.' },
  { id: 4,  name: 'Industrial Zone',   theme: 'Factory Complex',     levels: [19, 24], desc: 'Heavy Tank behemoths break through blast gates.' },
  { id: 5,  name: 'Infected District', theme: 'Biohazard Quarter',   levels: [25, 30], desc: 'Shielded drones and swarmer packs roam toxic ruins.' },
  { id: 6,  name: 'Dead Highway',      theme: 'Interstate 80 Ruins', levels: [31, 36], desc: 'Overturned vehicle chokepoints and agile Hunter spitters.' },
  { id: 7,  name: 'Quarantine Zone',   theme: 'Checkpoint Delta',    levels: [37, 42], desc: 'Barbed barricades and Elite Commander command squads.' },
  { id: 8,  name: 'Nightmare City',    theme: 'Ruined Metropolis',   levels: [43, 48], desc: 'Extreme zombie density with mixed elite strike waves.' },
  { id: 9,  name: 'Last Stand',        theme: 'Evacuation Outpost',  levels: [49, 54], desc: 'Desperate military bunker perimeter defenses.' },
  { id: 10, name: 'Final Outbreak',    theme: 'Citadel Zero',        levels: [55, 60], desc: 'Final campaign championship culminating in the Level 60 Overlord.' }
];

const MAP_TEMPLATES = {
  map1: {
    id: 'map1',
    name: 'Abandoned Suburb',
    width: 1600,
    height: 1200,
    floorColor: '#0b1120',
    gridColor: 'rgba(30, 41, 59, 0.4)',
    obstacles: [
      { x: 300, y: 250, w: 180, h: 90, type: 'house', label: 'Residence A' },
      { x: 800, y: 200, w: 220, h: 100, type: 'house', label: 'Residence B' },
      { x: 450, y: 700, w: 200, h: 120, type: 'house', label: 'Residence C' },
      { x: 1050, y: 650, w: 240, h: 110, type: 'house', label: 'Residence D' },
      { x: 680, y: 480, w: 120, h: 60, type: 'car', label: 'Police Cruiser' },
      { x: 250, y: 550, w: 90, h: 50, type: 'car', label: 'Sedan' }
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
  map2: {
    id: 'map2',
    name: 'Downtown Ruins',
    width: 1800,
    height: 1400,
    floorColor: '#090d16',
    gridColor: 'rgba(30, 41, 59, 0.5)',
    obstacles: [
      { x: 350, y: 250, w: 240, h: 220, type: 'building', label: 'Bank Tower' },
      { x: 1100, y: 250, w: 260, h: 200, type: 'building', label: 'Metro Station' },
      { x: 350, y: 850, w: 250, h: 220, type: 'building', label: 'Commercial Complex' },
      { x: 1100, y: 850, w: 260, h: 240, type: 'building', label: 'Parking Garage' },
      { x: 750, y: 480, w: 140, h: 60, type: 'bus', label: 'City Bus' },
      { x: 820, y: 780, w: 130, h: 55, type: 'car', label: 'Delivery Van' }
    ],
    streetLamps: [
      { x: 250, y: 650, radius: 180 },
      { x: 900, y: 320, radius: 200 },
      { x: 900, y: 1000, radius: 200 },
      { x: 1550, y: 650, radius: 180 }
    ],
    spawns: [
      { x: 120, y: 200 }, { x: 900, y: 90 }, { x: 1680, y: 180 },
      { x: 120, y: 1250 }, { x: 900, y: 1300 }, { x: 1680, y: 1250 }
    ]
  },
  map3: {
    id: 'map3',
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
  }
};

// Generate 60 fully playable, balanced campaign levels
function generateAll60Levels() {
  const levels = [];

  const objectivesList = [
    { type: 'ELIMINATE', desc: (req) => `Eliminate ${req} infected mutants.` },
    { type: 'SURVIVE',   desc: (req) => `Survive the relentless assault for ${req} seconds.` },
    { type: 'COLLECT',   desc: (req) => `Collect ${req} emergency supply crates.` },
    { type: 'PROTECT',   desc: (req) => `Defend the power beacon until extraction.` },
    { type: 'ESCAPE',    desc: (req) => `Reach the extraction zone within ${req} seconds.` },
    { type: 'BOSS',      desc: (req) => `Defeat the sector Boss!` }
  ];

  for (let i = 1; i <= 60; i++) {
    const worldIndex = Math.floor((i - 1) / 6);
    const world = WORLDS[worldIndex];
    const levelInWorld = ((i - 1) % 6) + 1;
    const isBossLevel = (levelInWorld === 6);

    let objType = 'ELIMINATE';
    let targetAmount = 15 + i * 4;
    let timeLimit = null;

    if (isBossLevel) {
      objType = 'BOSS';
      targetAmount = 1;
    } else {
      const objChoice = (i % 5);
      if (objChoice === 1) {
        objType = 'SURVIVE';
        targetAmount = 45 + Math.min(60, i * 2); // 45 to 105 seconds
        timeLimit = targetAmount;
      } else if (objChoice === 2) {
        objType = 'COLLECT';
        targetAmount = 4 + Math.min(8, Math.floor(i / 8));
        timeLimit = 75 + i * 2;
      } else if (objChoice === 3) {
        objType = 'PROTECT';
        targetAmount = 50 + i; // Beacon health or defend timer (60s)
        timeLimit = 60;
      } else if (objChoice === 4) {
        objType = 'ESCAPE';
        targetAmount = 55 + i * 2; // Time limit to reach exit
        timeLimit = targetAmount;
      } else {
        objType = 'ELIMINATE';
        targetAmount = 18 + i * 3;
      }
    }

    // Determine enemy pool based on level progression
    const enemyTypes = ['normal'];
    if (i >= 5)  enemyTypes.push('runner');
    if (i >= 12) enemyTypes.push('swarmer');
    if (i >= 18) enemyTypes.push('tank');
    if (i >= 24) enemyTypes.push('shielded');
    if (i >= 30) enemyTypes.push('hunter');
    if (i >= 36) enemyTypes.push('elite');

    // Boss identity
    let bossType = null;
    if (isBossLevel) {
      if (i === 6 || i === 18) bossType = 'abomination';
      else if (i === 12 || i === 30) bossType = 'cybertitan';
      else if (i === 24 || i === 42) bossType = 'harvester';
      else if (i === 60) bossType = 'overlord';
      else bossType = 'abomination';
    }

    // Map selection
    const mapKey = (i % 3 === 1) ? 'map1' : (i % 3 === 2 ? 'map2' : 'map3');

    // Difficulty label
    let diff = 'Very Easy';
    if (i > 6 && i <= 12) diff = 'Easy';
    else if (i > 12 && i <= 18) diff = 'Easy / Medium';
    else if (i > 18 && i <= 30) diff = 'Medium';
    else if (i > 30 && i <= 42) diff = 'Hard';
    else if (i > 42 && i <= 54) diff = 'Very Hard';
    else if (i > 54 && i < 60) diff = 'Extreme';
    else if (i === 60) diff = 'FINAL CHAMPIONSHIP';

    const waveCount = isBossLevel ? 3 : (2 + Math.min(5, Math.floor(i / 10)));
    const totalEnemies = isBossLevel ? (25 + i * 2) : (18 + i * 3);

    levels.push({
      id: i,
      name: isBossLevel ? `Sector ${i}: ${world.name} Boss` : `Sector ${i}: ${world.name} - Stage ${levelInWorld}`,
      worldId: world.id,
      worldName: world.name,
      mapId: mapKey,
      objective: objType,
      objectiveTarget: targetAmount,
      objectiveDesc: isBossLevel 
        ? `Defeat the ${bossType.toUpperCase()} commanding Sector ${i}!`
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
      levelScaling: 1.0 + (i - 1) * 0.05,
      isBossLevel: isBossLevel,
      bossType: bossType,
      reward: {
        xp: 150 + i * 35,
        coins: 80 + i * 20
      },
      starRequirements: {
        star1: 'Complete Level Objective',
        star2: 'Finish with > 50% Health',
        star3: 'Achieve > 75% Accuracy or fast clear'
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

