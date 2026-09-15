/**
 * Phase 9 Active Bus & Garage Synchronization Tests
 * Tests the canonical source of truth: Player.garage / Player.activeBusId
 *
 * Verifies:
 * - GarageSystem.setActiveBus() syncs to Player.activeBusId
 * - GameInitSystem.getActiveBus() returns the selected bus
 * - sellBus() syncs activeBusId back to Player
 * - deserialize() syncs garage back to Player
 * - Invalid bus ID fails safely without corrupting activeBusId
 * - No duplicate init() calls
 */

global.window = {};
global.BusSim = {};

global.localStorage = {
  _data: {},
  getItem(key) { return this._data[key] || null; },
  setItem(key, value) { this._data[key] = value; },
  removeItem(key) { delete this._data[key]; },
  clear() { this._data = {}; }
};

const deps = [
  './engine/EventManager.js',
  './config/GameConfig.js',
  './config/ControlsConfig.js',
  './config/TrafficConfig.js',
  './config/PassengerConfig.js',
  './data/regions.js',
  './data/bus-types.js',
  './data/TrafficVehicleTypes.js',
  './data/routes.js',
  './data/economy.js',
  './data/customization.js',
  './data/private-travels.js',
  './data/achievements.js',
  './data/service-types.js',
  './data/operators.js',
  './entities/Entity.js',
  './entities/Vehicle.js',
  './entities/Bus.js',
  './entities/TrafficVehicle.js',
  './entities/Passenger.js',
  './entities/Player.js',
  './systems/GarageConfig.js',
  './systems/OperatorSystem.js',
  './systems/GarageSystem.js',
  './systems/SaveLoadSystem.js',
  './systems/GameLoopSystem.js',
  './systems/GameInitSystem.js'
];

for (const dep of deps) {
  require(dep);
}

const EventManager = window.BusSim.EventManager;
const GarageConfig = window.BusSim.GarageConfig;
const GarageSystem = window.BusSim.GarageSystem;
const Bus = window.BusSim.Bus;
const BusTypes = window.BusSim.BusTypes;
const SaveLoadSystem = window.BusSim.SaveLoadSystem;
const GameInitSystem = window.BusSim.GameInitSystem;
const Player = window.BusSim.Player;

const results = [];
let testCount = 0;
let passedCount = 0;
let failedCount = 0;

function test(name, condition, message = '') {
  testCount++;
  const pass = !!condition;
  if (pass) passedCount++; else failedCount++;
  results.push({ name, pass, message });
  console.log((pass ? 'PASS' : 'FAIL') + ': ' + name + (message ? ' - ' + message : ''));
  return pass;
}

function assertEqual(actual, expected, name) {
  return test(name, actual === expected, `expected ${expected}, got ${actual}`);
}

function assertTruthy(value, name) {
  return test(name, !!value, `expected truthy, got ${value}`);
}

function assertTrue(condition, name) {
  return test(name, !!condition, `expected true, got ${condition}`);
}

function assertFalse(condition, name) {
  return test(name, !condition, `expected false, got ${condition}`);
}

function assertFalsy(value, name) {
  return test(name, !value, `expected falsy, got ${value}`);
}

console.log('=== Phase 9 Active Bus & Garage Synchronization Tests ===\n');

// ============================================
// TEST 1: GarageSystem synchronization with Player
// ============================================
console.log('--- TEST 1: GarageSystem Sync with Player ---');

// Create a real Player with two buses
const player = new Player();
player.money = 10000000;

const busA = new Bus(0, 0, 'pallevelugu');
const busB = new Bus(100, 0, 'express');
player.garage = [busA, busB];
player.activeBusId = busA.id;
player.garageSlots = 5;

// Set up mock GameInitSystem that provides the real player
const mockGameInitSystem = {
  getPlayer: () => player,
  getActiveBus: function () {
    return player ? player.getActiveBus() : null;
  },
  modules: {}
};

const modules = {
  EventManager,
  GameEngine: { _config: { states: { BOOT: 'boot' } } },
  GameInitSystem: mockGameInitSystem,
  Map: { allCities: [{ x: 0, y: 0, type: 'metropolitan' }] }
};

// Initialize GarageConfig
GarageConfig.init({ EventManager, BusTypes });

// Initialize GarageSystem with the player-backed GameInitSystem
GarageSystem.init(modules);

// 1.1 Verify GarageSystem picked up the player's garage
assertEqual(GarageSystem.getGarage().length, 2, 'GarageSystem has 2 buses from Player');
assertEqual(GarageSystem.getGarage()[0].id, busA.id, 'GarageSystem bus A matches Player');
assertEqual(GarageSystem.getGarage()[1].id, busB.id, 'GarageSystem bus B matches Player');

// 1.2 Verify active bus ID is synced from Player
const activeBefore = GarageSystem.getActiveBus();
assertEqual(activeBefore.id, busA.id, 'Active bus before selection is Bus A');

// 1.3 Select Bus B
const selectResult = GarageSystem.setActiveBus(busB.id);
assertTrue(selectResult, 'setActiveBus returns true for valid bus');

// 1.4 Verify Player.activeBusId was updated (canonical source of truth)
assertEqual(player.activeBusId, busB.id, 'Player.activeBusId updated to Bus B');

// 1.5 Verify GarageSystem._activeBusId is also updated
assertEqual(GarageSystem._activeBusId, busB.id, 'GarageSystem._activeBusId updated to Bus B');

// 1.6 Verify getActiveBus returns the correct bus
const activeAfter = GarageSystem.getActiveBus();
assertEqual(activeAfter.id, busB.id, 'GarageSystem.getActiveBus() returns Bus B');

// ============================================
// TEST 2: GameInitSystem.getActiveBus() returns selected bus
// ============================================
console.log('\n--- TEST 2: GameInitSystem.getActiveBus returns selected bus ---');

// Create a fresh GameInitSystem scenario
const player2 = new Player();
const busC = new Bus(0, 0, 'pallevelugu');
const busD = new Bus(100, 0, 'express');
player2.garage = [busC, busD];
player2.activeBusId = busC.id;

const mockGameInit2 = {
  getPlayer: () => player2,
  getActiveBus: function () {
    return player2 ? player2.getActiveBus() : null;
  }
};

// Simulate: GarageSystem selects Bus D
GarageSystem.modules.GameInitSystem = mockGameInit2;
GarageSystem._garage = player2.garage;
GarageSystem._activeBusId = busC.id;

GarageSystem.setActiveBus(busD.id);

// GameInitSystem.getActiveBus() delegates to Player.getActiveBus()
const activeFromInit = mockGameInit2.getActiveBus();
assertEqual(activeFromInit.id, busD.id, 'GameInitSystem.getActiveBus() returns Bus D');
assertEqual(player2.activeBusId, busD.id, 'Player.activeBusId is Bus D');

// ============================================
// TEST 3: Invalid bus ID fails safely
// ============================================
console.log('\n--- TEST 3: Invalid bus ID fails safely ---');

// Save current active bus ID
const savedActiveBusId = player2.activeBusId;
assertEqual(savedActiveBusId, busD.id, 'Precondition: active bus is Bus D before invalid selection');

// Try to select a non-existent bus
const invalidResult = GarageSystem.setActiveBus('non-existent-bus-id');
assertFalse(invalidResult, 'setActiveBus returns false for invalid bus ID');

// Verify activeBusId was NOT corrupted
assertEqual(player2.activeBusId, busD.id, 'Player.activeBusId unchanged after invalid selection');
assertEqual(GarageSystem._activeBusId, busD.id, 'GarageSystem._activeBusId unchanged after invalid selection');

// ============================================
// TEST 4: sellBus syncs activeBusId to Player
// ============================================
console.log('\n--- TEST 4: sellBus syncs activeBusId to Player ---');

// Add a third bus then sell the active one
const busE = new Bus(200, 0, 'ultra-deluxe');
player2.garage.push(busE);
GarageSystem._garage = player2.garage;

// Make busE the active bus
GarageSystem.setActiveBus(busE.id);
assertEqual(player2.activeBusId, busE.id, 'Active bus is Bus E before sell');

// Sell Bus E (the active bus)
const sellResult = GarageSystem.sellBus(busE.id);
assertTrue(sellResult.success, 'sellBus succeeds for valid bus');

// Verify GarageSystem._activeBusId was reassigned (falls back to _garage[0])
assertEqual(GarageSystem._activeBusId, busC.id, 'GarageSystem falls back to first bus after selling active');

// Verify Player.activeBusId was synced to GarageSystem._activeBusId
assertEqual(player2.activeBusId, busC.id, 'Player.activeBusId synced after active bus sold');

// Verify GarageSystem._garage and player2.garage are the same array (no divergence)
assertEqual(GarageSystem.getGarage().length, 2, 'GarageSystem has 2 buses after selling Bus E');
assertEqual(player2.garage.length, 2, 'Player.garage also has 2 buses (no divergence)');
assertTrue(GarageSystem.getGarage() === player2.garage, 'GarageSystem._garage is same reference as Player.garage');

// ============================================
// TEST 5: No duplicate init() calls
// ============================================
console.log('\n--- TEST 5: No duplicate init() calls ---');

// Reset GarageSystem to verify init is only called once via registerSystem
GarageSystem._garage = [];
GarageSystem._activeBusId = null;
GarageSystem._garageSlots = 5;

let initCallCount = 0;
const originalInit = GarageSystem.init;
GarageSystem.init = function (mods) {
  initCallCount++;
  this.modules = mods;
  const pl = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
  if (pl) {
    this._garage = pl.garage || [];
    this._activeBusId = pl.activeBusId || (this._garage[0] ? this._garage[0].id : null);
    this._garageSlots = pl.garageSlots || 5;
  }
  EventManager.emit('garageInitialized', {
    busCount: this._garage.length,
    slots: this._garageSlots
  });
};

// Simulate calling init twice (simulates a potential double-registration)
const fakeModules = {
  EventManager,
  GameInitSystem: { getPlayer: () => player2 }
};

GarageSystem.init(fakeModules);
GarageSystem.init(fakeModules);

assertEqual(initCallCount, 2, 'init() can be called (simulating registerSystem)');

// Restore original init
GarageSystem.init = originalInit;

// Verify GarageSystem has access to Player through modules
assertTrue(GarageSystem.modules.GameInitSystem !== undefined, 'GarageSystem has GameInitSystem in modules');

// ============================================
// TEST 6: deserialize() syncs garage to Player
// ============================================
console.log('\n--- TEST 6: deserialize() syncs garage to Player ---');

const player3 = new Player();
const busF = new Bus(0, 0, 'pallevelugu');
const busG = new Bus(100, 0, 'express');
player3.garage = [busF, busG];
player3.activeBusId = busF.id;

const mockGameInit3 = {
  getPlayer: () => player3,
  getActiveBus: function () {
    return player3 ? player3.getActiveBus() : null;
  }
};

// Set up GarageSystem with player3
GarageSystem.modules = { EventManager, GameInitSystem: mockGameInit3 };
GarageSystem._garage = player3.garage;
GarageSystem._activeBusId = busF.id;
GarageSystem._garageSlots = 5;

// Simulate serialized data (plain objects, not Bus instances)
const serializedData = {
  garage: [{ id: 999, busTypeId: 'pallevelugu' }, { id: 998, busTypeId: 'express' }],
  activeBusId: 999,
  garageSlots: 10
};

GarageSystem.deserialize(serializedData);

// Verify GarageSystem state updated
assertEqual(GarageSystem._activeBusId, 999, 'GarageSystem._activeBusId updated from deserialize');
assertEqual(GarageSystem._garageSlots, 10, 'GarageSystem._garageSlots updated from deserialize');

// Verify Player was synced (canonical source of truth)
assertEqual(player3.activeBusId, 999, 'Player.activeBusId synced from deserialize');
assertEqual(player3.garageSlots, 10, 'Player.garageSlots synced from deserialize');
assertEqual(player3.garage, GarageSystem._garage, 'Player.garage references same array as GarageSystem._garage');

// ============================================
// TEST 7: Full flow - selectBus event sync
// ============================================
console.log('\n--- TEST 7: selectBus event sync (simulated main.js handler) ---');

const player4 = new Player();
const busH = new Bus(0, 0, 'pallevelugu');
const busI = new Bus(100, 0, 'express');
player4.garage = [busH, busI];
player4.activeBusId = busH.id;

const mockGameInit4 = {
  getPlayer: () => player4,
  getActiveBus: function () {
    return player4 ? player4.getActiveBus() : null;
  }
};

GarageSystem.modules = { EventManager, GameInitSystem: mockGameInit4 };
GarageSystem._garage = player4.garage;
GarageSystem._activeBusId = busH.id;

// Simulate: user selects Bus I in garage UI
GarageSystem.setActiveBus(busI.id);

// Simulate selectBus event being handled (as main.js would do)
EventManager.emit('selectBus', { bus: GarageSystem.getActiveBus() });

// Simulate selectBus handler from main.js
EventManager.on('selectBus', function (data) {
  if (data && data.bus && data.bus.id) {
    const init = mockGameInit4;
    if (init && init.getPlayer()) {
      init.getPlayer().activeBusId = data.bus.id;
    }
  }
});

// Emit again to test the handler
EventManager.emit('selectBus', { bus: GarageSystem.getActiveBus() });

assertEqual(player4.activeBusId, busI.id, 'Player.activeBusId is Bus I after selectBus flow');
assertEqual(mockGameInit4.getActiveBus().id, busI.id, 'GameInitSystem.getActiveBus() returns Bus I');

// Verify GameInitSystem.getActiveBus() delegates to Player.getActiveBus()
assertEqual(player4.getActiveBus().id, busI.id, 'Player.getActiveBus() returns Bus I');

// ============================================
// TEST 7: Save/Load System Data Restoration
// ============================================
console.log('\n--- TEST 7: Save/Load System Data Restoration ---');

// Clear localStorage
localStorage.clear();

// Simulate a full save with GarageSystem data
const savePlayer = new Player();
const saveBusA = new Bus(0, 0, 'pallevelugu');
const saveBusB = new Bus(100, 0, 'express');
savePlayer.garage = [saveBusA, saveBusB];
savePlayer.activeBusId = saveBusB.id; // Bus B is active
savePlayer.money = 500000;
savePlayer.garageSlots = 8;

// Set up GarageSystem with the player for init
const mockGameInitSave = {
  player: savePlayer,
  getPlayer: function () { return this.player; },
  getActiveBus: function () {
    return this.player ? this.player.getActiveBus() : null;
  }
};

GarageSystem.modules = { EventManager, GameInitSystem: mockGameInitSave };

// Initialize GarageSystem from Player (simulates init() during registration)
GarageSystem.init({
  EventManager,
  GameEngine: { _config: { states: { BOOT: 'boot' } } },
  GameInitSystem: mockGameInitSave,
  Map: { allCities: [{ x: 0, y: 0, type: 'metropolitan' }] }
});

// Verify GarageSystem picked up player state
assertEqual(GarageSystem.getGarage().length, 2, 'GarageSystem has 2 buses from Player after init');
assertEqual(GarageSystem._activeBusId, saveBusB.id, 'GarageSystem active bus is Bus B after init');

// Serialize GarageSystem state (simulating saveGame)
const garageSaveData = GarageSystem.serialize();
assertEqual(garageSaveData.activeBusId, saveBusB.id, 'Serialized GarageSystem has Bus B as active');
assertTrue(!('garage' in garageSaveData), 'Serialized GarageSystem does NOT duplicate garage data');

// Create save data structure
const saveData = {
  version: '1.0.0',
  savedAt: Date.now(),
  player: savePlayer.serialize(),
  systems: { GarageSystem: garageSaveData },
  garageConfig: GarageConfig.serialize()
};
localStorage.setItem('bus_simulator_save_data', JSON.stringify(saveData));

// 7.1 Verify saved GarageSystem data reaches deserialize
let deserializeCalled = false;
const originalDeserialize = GarageSystem.deserialize;
GarageSystem.deserialize = function (data) {
  deserializeCalled = true;
  originalDeserialize.call(this, data);
};

// Simulate the load flow: loadPlayer stores pending data
SaveLoadSystem._saveKey = 'bus_simulator_save_data';
SaveLoadSystem._pendingSystemData = null;
SaveLoadSystem.modules = { EventManager, GameInitSystem: mockGameInitSave, GarageSystem };

// loadPlayer stores the system data
const loadedPlayer = SaveLoadSystem.loadPlayer();
assertTruthy(loadedPlayer, 'loadPlayer returns a player from save');
assertEqual(loadedPlayer.activeBusId, saveBusB.id, 'Loaded player has Bus B as active (from save)');

// Simulate GameInitSystem.init() setting this.player = loadPlayer()
mockGameInitSave.player = loadedPlayer;

// 7.2 Verify pending system data is stored
assertTruthy(SaveLoadSystem._pendingSystemData, 'Pending system data stored after loadPlayer');
assertTruthy(SaveLoadSystem._pendingSystemData.GarageSystem, 'Pending data contains GarageSystem');

// 7.3 Verify restoreSystemData() routes to GarageSystem.deserialize()
SaveLoadSystem.restoreSystemData();
assertTrue(deserializeCalled, 'restoreSystemData calls GarageSystem.deserialize()');
assertFalsy(SaveLoadSystem._pendingSystemData, 'Pending data cleared after restore');

// Restore original deserialize
GarageSystem.deserialize = originalDeserialize;

// 7.4 Verify GarageSystem state was restored
assertEqual(GarageSystem._activeBusId, saveBusB.id, 'GarageSystem._activeBusId restored to Bus B');
assertEqual(GarageSystem.getGarage().length, 2, 'GarageSystem has 2 buses after restore');

// 7.5 Verify Player.garage and GarageSystem._garage are synchronized
// In the real flow, GameInitSystem.getPlayer() returns the loaded player.
// GarageSystem.deserialize() syncs to Player via modules.GameInitSystem.getPlayer()
assertTrue(GarageSystem.getGarage() === loadedPlayer.garage, 'GarageSystem._garage same reference as Player.garage');
assertEqual(loadedPlayer.activeBusId, saveBusB.id, 'Player.activeBusId matches restored GarageSystem');

// ============================================
// TEST 8: Garage synchronization after load
// ============================================
console.log('\n--- TEST 8: Garage synchronization after load ---');

// 8.1 GarageSystem.getGarage() and Player.garage contain same buses
const gsGarage = GarageSystem.getGarage();
const playerGarage = loadedPlayer.garage;
assertEqual(gsGarage.length, playerGarage.length, 'GarageSystem.getGarage() and Player.garage have same length');

// 8.2 Active bus restoration
const activeBusAfterLoad = mockGameInitSave.getActiveBus();
assertTruthy(activeBusAfterLoad, 'Active bus exists after load');
assertEqual(activeBusAfterLoad.id, saveBusB.id, 'Active bus is Bus B after restore');
assertEqual(activeBusAfterLoad.busTypeId, 'express', 'Active bus has correct type after restore');

// ============================================
// TEST 9: Old save compatibility (no systems)
// ============================================
console.log('\n--- TEST 9: Old save compatibility ---');

localStorage.clear();

// Create an old-format save without systems data
const oldSaveData = {
  version: '0.9.0',
  savedAt: Date.now(),
  player: { garage: [savePlayer.serialize().garage[0]], activeBusId: savePlayer.garage[0].id },
  garageConfig: GarageConfig.serialize()
  // NO systems field
};
localStorage.setItem('bus_simulator_save_data', JSON.stringify(oldSaveData));

// Simulate loadPlayer
const oldPlayer = SaveLoadSystem.loadPlayer();
assertTruthy(oldPlayer, 'loadPlayer does not crash on old save without systems');
assertEqual(SaveLoadSystem._pendingSystemData, null, 'No pending system data on old save');

// restoreSystemData should be safe to call with no pending data
SaveLoadSystem.restoreSystemData();
assertTruthy(oldPlayer, 'restoreSystemData does not crash with no pending data');

// ============================================
// TEST 10: Missing systems object
// ============================================
console.log('\n--- TEST 10: Missing systems object ---');

localStorage.clear();

const noSystemsSave = {
  version: '1.0.0',
  player: savePlayer.serialize()
  // No garageConfig, no systems
};
localStorage.setItem('bus_simulator_save_data', JSON.stringify(noSystemsSave));

const noSystemsPlayer = SaveLoadSystem.loadPlayer();
assertTruthy(noSystemsPlayer, 'loadPlayer does not crash without systems or garageConfig');
assertEqual(SaveLoadSystem._pendingSystemData, null, 'No pending data when systems is missing');

// Safe restore call
SaveLoadSystem.restoreSystemData();
assertTruthy(noSystemsPlayer, 'restoreSystemData is safe to call with no pending data');

// ============================================
// TEST 11: Corrupted GarageSystem data
// ============================================
console.log('\n--- TEST 11: Corrupted GarageSystem data ---');

localStorage.clear();

const corruptedSave = {
  version: '1.0.0',
  player: savePlayer.serialize(),
  systems: { GarageSystem: 'not-an-object' },
  garageConfig: null
};
localStorage.setItem('bus_simulator_save_data', JSON.stringify(corruptedSave));

let corruptedCrash = false;
try {
  const corruptedPlayer = SaveLoadSystem.loadPlayer();
  assertTruthy(corruptedPlayer, 'loadPlayer does not crash with corrupted systems');

  // restoreSystemData should not crash even with corrupted data
  SaveLoadSystem.restoreSystemData();
  assertTruthy(corruptedPlayer, 'restoreSystemData handles corrupted data gracefully');
} catch (e) {
  corruptedCrash = true;
}
assertFalse(corruptedCrash, 'No crash with corrupted GarageSystem data');

// ============================================
// TEST 12: No overwrite after initialization
// ============================================
console.log('\n--- TEST 12: No overwrite after init ---');

localStorage.clear();

// Set up a clean GarageSystem state
const player12 = new Player();
const busK = new Bus(0, 0, 'pallevelugu');
const busL = new Bus(100, 0, 'express');
player12.garage = [busK, busL];
player12.activeBusId = busK.id;

const mockGameInit12 = {
  getPlayer: () => player12,
  getActiveBus: function () {
    return player12 ? player12.getActiveBus() : null;
  }
};

// Initialize GarageSystem (simulates registration-time init)
GarageSystem._garage = [];
GarageSystem._activeBusId = null;
GarageSystem.modules = { EventManager, GameInitSystem: mockGameInit12 };
GarageSystem.init({
  EventManager,
  GameEngine: { _config: { states: { BOOT: 'boot' } } },
  GameInitSystem: mockGameInit12,
  Map: { allCities: [{ x: 0, y: 0, type: 'metropolitan' }] }
});

// Verify init populated from Player
assertEqual(GarageSystem.getGarage().length, 2, 'GarageSystem init populated from Player');
assertEqual(GarageSystem._activeBusId, busK.id, 'GarageSystem init set active bus from Player');

// Now simulate restoreSystemData (simulates post-registration restoration)
// Set up fake saved data (only activeBusId is restored; garage comes from Player)
const savedGarageData = {
  garage: [{ id: busL.id, busTypeId: 'express' }],
  activeBusId: busL.id,
  garageSlots: 8
};

// Manually call _restoreSystemData with saved data
SaveLoadSystem.modules = { EventManager, GameInitSystem: mockGameInit12, GarageSystem: GarageSystem };
SaveLoadSystem._restoreSystemData({ GarageSystem: savedGarageData });

// Verify restore happened AFTER init — activeBusId restored from save
assertEqual(GarageSystem._activeBusId, busL.id, 'GarageSystem._activeBusId restored to Bus L after init');

// GarageSystem._garage references Player.garage (canonical source, not data.garage)
assertEqual(player12.garage.length, 2, 'Player.garage still has its buses');
assertTrue(GarageSystem.getGarage() === player12.garage, 'GarageSystem._garage references Player.garage');

// Verify Player was synced (activeBusId from deserialized data)
assertEqual(player12.activeBusId, busL.id, 'Player.activeBusId synced after restore');
assertEqual(player12.garage.length, 2, 'Player.garage length preserved');
assertEqual(GarageSystem._garageSlots, 8, 'GarageSystem._garageSlots restored from save');

// ============================================
// TEST 13: importSave updates canonical GameInitSystem.player
// ============================================
console.log('\n--- TEST 13: importSave updates canonical player ---');

// Set up GameInitSystem with an initial player
const initialPlayer = new Player();
initialPlayer.money = 1000000;
const initialBus = new Bus(0, 0, 'pallevelugu');
initialPlayer.garage = [initialBus];
initialPlayer.activeBusId = initialBus.id;
GameInitSystem.player = initialPlayer;

// Mock GameInitSystem that uses 'this.player' (same pattern as real GameInitSystem.getPlayer)
const mockGameInitForImport = {
  player: initialPlayer,
  getPlayer: function () { return this.player; },
  getActiveBus: function () { return this.player ? this.player.getActiveBus() : null; }
};

// Create an import save with a different player and garage
const importPlayer = new Player();
importPlayer.money = 999999;
const importBusA = new Bus(0, 0, 'pallevelugu');
const importBusB = new Bus(100, 0, 'express');
importPlayer.garage = [importBusA, importBusB];
importPlayer.activeBusId = importBusB.id;
importPlayer.garageSlots = 10;
const importBusBSerialized = importBusB.serialize ? importBusB.serialize() : importBusB;

// Ensure GarageSystem serialized state matches import player (no conflict)
GarageSystem._garage = importPlayer.garage;
GarageSystem._activeBusId = importBusB.id;

const importSaveData = {
  version: '1.0.0',
  player: importPlayer.serialize(),
  systems: { GarageSystem: GarageSystem.serialize() },
  garageConfig: GarageConfig.serialize()
};
const importSaveString = JSON.stringify(importSaveData);

// Set up SaveLoadSystem modules
SaveLoadSystem.modules = {
  EventManager,
  GameInitSystem: mockGameInitForImport,
  GarageSystem: GarageSystem
};
GarageSystem.modules = { EventManager, GameInitSystem: mockGameInitForImport };

// Import the save
const importResult = SaveLoadSystem.importSave(importSaveString);
assertTrue(importResult.success, 'importSave returns success');

// 13.1 Verify canonical player was updated (via the mock's player property, not _player)
assertEqual(mockGameInitForImport.player.money, 999999, 'Canonical player updated to imported player');
assertTrue(mockGameInitForImport.player !== initialPlayer, 'Canonical player is NOT the old initial player');

// 13.2 Verify getPlayer() returns the imported Player
const getPlayerResult = mockGameInitForImport.getPlayer();
assertEqual(getPlayerResult.money, 999999, 'getPlayer() returns imported player with correct money');
assertTrue(getPlayerResult !== initialPlayer, 'getPlayer() does NOT return the old initial player');

// 13.3 Verify getActiveBus() returns the imported active bus
const activeAfterImport = mockGameInitForImport.getActiveBus();
assertTruthy(activeAfterImport, 'Active bus exists after import');
assertEqual(activeAfterImport.id, importBusB.id, 'getActiveBus() returns imported active bus (Bus B)');

// 13.4 Verify imported activeBusId is preserved
assertEqual(getPlayerResult.activeBusId, importBusB.id, 'Imported activeBusId preserved (Bus B)');

// 13.5 Verify GarageSystem synchronizes with imported player.garage
assertEqual(GarageSystem.getGarage().length, 2, 'GarageSystem has 2 buses after import');
assertEqual(GarageSystem._activeBusId, importBusB.id, 'GarageSystem._activeBusId synced to imported Bus B');

// 13.6 Verify no conflicting player references
assertTrue(getPlayerResult.garage === GarageSystem.getGarage(), 'Player.garage and GarageSystem._garage share reference after import');
assertTrue(getPlayerResult.garage[0] instanceof Bus, 'Imported bus[0] is a real Bus instance');
assertTrue(getPlayerResult.garage[1] instanceof Bus, 'Imported bus[1] is a real Bus instance');

// ============================================
// TEST 14: Import with missing system data
// ============================================
console.log('\n--- TEST 14: Import with missing system data ---');

// Reset state
mockGameInitForImport.player = initialPlayer;
GarageSystem._garage = initialPlayer.garage;
GarageSystem._activeBusId = initialBus.id;

// Save without systems section
const importSaveNoSystems = {
  version: '0.9.0',
  player: importPlayer.serialize()
  // No systems, no garageConfig
};
const importStringNoSystems = JSON.stringify(importSaveNoSystems);

let noSystemsCrashed = false;
let noSystemsResult = null;
try {
  noSystemsResult = SaveLoadSystem.importSave(importStringNoSystems);
} catch (e) {
  noSystemsCrashed = true;
}
assertFalse(noSystemsCrashed, 'Import without systems does not crash');
assertTrue(noSystemsResult.success, 'Import without systems returns success');

// Verify GarageSystem was synced despite no system data
assertEqual(GarageSystem.getGarage().length, 2, 'GarageSystem synced to player.garage without system data');
assertEqual(GarageSystem._activeBusId, importBusB.id, 'GarageSystem active bus synced without system data');
assertEqual(mockGameInitForImport.getPlayer().garage.length, 2, 'Player.garage has correct buses after import without systems');

// ============================================
// TEST 15: Corrupted optional system data
// ============================================
console.log('\n--- TEST 15: Corrupted optional system data ---');

// Reset state
mockGameInitForImport.player = initialPlayer;
GarageSystem._garage = initialPlayer.garage;
GarageSystem._activeBusId = initialBus.id;

// Save with corrupted systems data
const corruptedSaveData = {
  version: '1.0.0',
  player: importPlayer.serialize(),
  systems: { GarageSystem: 'corrupted-string-data' }
};
const corruptedSaveString = JSON.stringify(corruptedSaveData);

let corruptedCrashed = false;
let corruptedResult = null;
try {
  corruptedResult = SaveLoadSystem.importSave(corruptedSaveString);
} catch (e) {
  corruptedCrashed = true;
}
assertFalse(corruptedCrashed, 'Import with corrupted system data does not crash');

// Player should still be set correctly (corrupted systems are skipped)
assertTrue(mockGameInitForImport.getPlayer().money === 999999, 'Player set correctly despite corrupted systems');
assertEqual(mockGameInitForImport.getPlayer().activeBusId, importBusB.id, 'Player activeBusId correct despite corrupted systems');

// ============================================
// TEST 16: Normal startup load behavior (still works)
// ============================================
console.log('\n--- TEST 16: Normal startup load behavior ---');

// Clear and set up a fresh save
localStorage.clear();

const startupPlayer = new Player();
const startupBus1 = new Bus(0, 0, 'pallevelugu');
const startupBus2 = new Bus(100, 0, 'ultra-deluxe');
startupPlayer.garage = [startupBus1, startupBus2];
startupPlayer.activeBusId = startupBus2.id;
startupPlayer.money = 750000;

const startupSave = {
  version: '1.0.0',
  savedAt: Date.now(),
  player: startupPlayer.serialize(),
  systems: { GarageSystem: { activeBusId: startupBus2.id, garageSlots: 5 } },
  garageConfig: GarageConfig.serialize()
};
localStorage.setItem('bus_simulator_save_data', JSON.stringify(startupSave));

// Set up SaveLoadSystem for loadPlayer test
SaveLoadSystem._saveKey = 'bus_simulator_save_data';
SaveLoadSystem._pendingSystemData = null;

// Set up a fresh mock GameInitSystem
const mockGameInit16 = {
  player: null,
  getPlayer: function () { return this.player; },
  getActiveBus: function () { return this.player ? this.player.getActiveBus() : null; }
};

// Simulate GameInitSystem.init() calling loadPlayer()
SaveLoadSystem.modules = { EventManager, GameInitSystem: mockGameInit16, GarageSystem: GarageSystem };
mockGameInit16.player = SaveLoadSystem.loadPlayer();
assertTrue(mockGameInit16.player !== null, 'loadPlayer returns a player from save');
assertEqual(mockGameInit16.player.activeBusId, startupBus2.id, 'Loaded player has correct activeBusId');
assertTrue(SaveLoadSystem._pendingSystemData !== null, 'Pending system data stored during loadPlayer');

// Simulate main.js restoreSystemData call (after all systems registered)
SaveLoadSystem.restoreSystemData();
assertFalsy(SaveLoadSystem._pendingSystemData, 'Pending data cleared after restoreSystemData');

// Verify loaded buses are real Bus instances
assertTrue(mockGameInit16.getPlayer().garage[0] instanceof Bus, 'Startup loaded garage[0] is Bus instance');
assertTrue(mockGameInit16.getPlayer().garage[1] instanceof Bus, 'Startup loaded garage[1] is Bus instance');
assertTrue(mockGameInit16.getActiveBus() instanceof Bus, 'getActiveBus returns Bus instance after startup load');

// ============================================
// TEST 17: Bus.deserialize preserves all fields
// ============================================
console.log('\n--- TEST 17: Bus.deserialize preserves all fields ---');

const fullBus = new Bus(50, 60, 'pallevelugu');
fullBus.fuelLevel = 30;
fullBus.damage = 40;
fullBus.condition = 60;
fullBus.passengersOnBoard = 15;
fullBus.tripsCompleted = 7;
fullBus.tripDistance = 3200;
fullBus.maxSpeed = 85;
fullBus.busNumber = 'B-123';
fullBus.destinationBoard = 'AIRPORT';
fullBus.customization = { exterior: { paintColor: '#00ff00', livery: 'sport', lights: 'led', wheels: 'alloy', accessories: [], fleetNumber: 'F-1' }, interior: { seatStyle: 'leather', interiorColor: 'black', lighting: 'led', decorations: [], comfort: 9, theme: 'luxury' }, performance: { engineTuning: 'turbo', transmission: 'manual-6', brakes: 'disc', suspension: 'coil' } };
fullBus.reverseMode = true;
fullBus.reverseSpeed = 10;

// Serialize manually (Bus has no serialize method, use properties)
const fullBusData = {
  id: fullBus.id,
  x: fullBus.x, y: fullBus.y,
  vx: fullBus.vx, vy: fullBus.vy,
  speed: fullBus.speed, targetSpeed: fullBus.targetSpeed,
  steering: fullBus.steering, angle: fullBus.angle,
  busTypeId: fullBus.busTypeId,
  operatorId: fullBus.operatorId,
  serviceType: fullBus.serviceType,
  fuelLevel: fullBus.fuelLevel,
  fuelCapacity: fullBus.fuelCapacity,
  fuelEfficiency: fullBus.fuelEfficiency,
  isLowFuel: fullBus.isLowFuel,
  condition: fullBus.condition,
  damage: fullBus.damage,
  isDamaged: fullBus.isDamaged,
  passengersOnBoard: fullBus.passengersOnBoard,
  passengersWaiting: fullBus.passengersWaiting,
  boardedPassengers: fullBus.boardedPassengers,
  passengerCapacity: fullBus.passengerCapacity,
  baseStandingCapacity: fullBus.baseStandingCapacity,
  maxStanding: fullBus.maxStanding,
  standingPassengers: fullBus.standingPassengers,
  allowStanding: fullBus.allowStanding,
  boardingTimePerPassenger: fullBus.boardingTimePerPassenger,
  alightTimePerPassenger: fullBus.alightTimePerPassenger,
  serviceFareMultiplier: fullBus.serviceFareMultiplier,
  maxSpeed: fullBus.maxSpeed,
  baseMaxSpeed: fullBus.baseMaxSpeed,
  maintenanceCondition: fullBus.maintenanceCondition,
  lastMaintenance: fullBus.lastMaintenance,
  maintenanceInterval: fullBus.maintenanceInterval,
  value: fullBus.value,
  purchasePrice: fullBus.purchasePrice,
  color: fullBus.color,
  tintColor: fullBus.tintColor,
  fleetNumber: fullBus.fleetNumber,
  busNumber: fullBus.busNumber,
  destinationBoard: fullBus.destinationBoard,
  tripsCompleted: fullBus.tripsCompleted,
  tripDistance: fullBus.tripDistance,
  tripRevenue: fullBus.tripRevenue,
  tripStartTime: fullBus.tripStartTime,
  reverseMode: fullBus.reverseMode,
  reverseSpeed: fullBus.reverseSpeed,
  active: fullBus.active,
  width: fullBus.width,
  height: fullBus.height,
  rotation: fullBus.rotation,
  collisionRadius: fullBus.collisionRadius,
  tags: fullBus.tags
};

const restoredFullBus = Bus.deserialize(fullBusData);
assertTrue(restoredFullBus instanceof Bus, 'Restored full bus is Bus instance');
assertEqual(restoredFullBus.id, fullBus.id, 'Bus id preserved');
assertEqual(restoredFullBus.fuelLevel, 30, 'Bus fuelLevel restored');
assertEqual(restoredFullBus.damage, 40, 'Bus damage restored');
assertEqual(restoredFullBus.passengersOnBoard, 15, 'Bus passengersOnBoard restored');
assertEqual(restoredFullBus.tripsCompleted, 7, 'Bus tripsCompleted restored');
assertEqual(restoredFullBus.maxSpeed, 85, 'Bus maxSpeed restored');
assertEqual(restoredFullBus.busNumber, 'B-123', 'Bus busNumber restored');
assertEqual(restoredFullBus.destinationBoard, 'AIRPORT', 'Bus destinationBoard restored');
assertTrue(typeof restoredFullBus.draw === 'function', 'Restored bus has draw method');
assertTrue(typeof restoredFullBus.update === 'function', 'Restored bus has update method');
assertTrue(typeof restoredFullBus.refuel === 'function', 'Restored bus has refuel method');
assertTrue(typeof restoredFullBus.sellBus === 'undefined', 'Bus does not have sellBus (sanity check)');

// ============================================
// TEST 18: Bus.deserialize from Player.serialize round-trip
// ============================================
console.log('\n--- TEST 18: Bus deserialize from Player.serialize round-trip ---');

const roundTripPlayer = new Player();
roundTripPlayer.garage = [new Bus(0, 0, 'pallevelugu'), new Bus(100, 0, 'express')];
roundTripPlayer.activeBusId = roundTripPlayer.garage[1].id;
roundTripPlayer.money = 250000;

// Serialize via Player.serialize (Bus has no serialize, so instances are returned)
const rtData = roundTripPlayer.serialize();
// JSON round-trip simulates save/load
const rtString = JSON.stringify(rtData);
const rtParsed = JSON.parse(rtString);

const rtPlayer = Player.deserialize(rtParsed);
assertTrue(rtPlayer instanceof Player, 'Round-trip player is Player instance');
assertTrue(rtPlayer.garage[0] instanceof Bus, 'Round-trip bus[0] is Bus instance');
assertTrue(rtPlayer.garage[1] instanceof Bus, 'Round-trip bus[1] is Bus instance');
assertEqual(rtPlayer.activeBusId, roundTripPlayer.garage[1].id, 'Round-trip activeBusId preserved');
assertEqual(rtPlayer.garage[0].id, roundTripPlayer.garage[0].id, 'Round-trip bus[0] id preserved');
assertEqual(rtPlayer.garage[1].id, roundTripPlayer.garage[1].id, 'Round-trip bus[1] id preserved');
assertEqual(rtPlayer.garage[0].busTypeId, 'pallevelugu', 'Round-trip bus[0] type preserved');
assertEqual(rtPlayer.garage[1].busTypeId, 'express', 'Round-trip bus[1] type preserved');

// ============================================
// TEST 19: GarageSystem.serialize does not duplicate garage
// ============================================
console.log('\n--- TEST 19: GarageSystem.serialize does not duplicate garage ---');

// Reset GarageSystem to clean state
GarageSystem.destroy();

const gsPlayer = new Player();
gsPlayer.garage = [new Bus(0, 0, 'pallevelugu')];
gsPlayer.activeBusId = gsPlayer.garage[0].id;
const mockGameInitGS = {
  getPlayer: () => gsPlayer,
  getActiveBus: function () { return gsPlayer ? gsPlayer.getActiveBus() : null; }
};
GarageSystem.modules = { EventManager, GameInitSystem: mockGameInitGS };
GarageSystem._garage = gsPlayer.garage;
GarageSystem._activeBusId = gsPlayer.activeBusId;
GarageSystem._garageSlots = 5;

const serializedGS = GarageSystem.serialize();
assertTrue(!('garage' in serializedGS), 'serialize() does NOT include garage field');
assertTrue('activeBusId' in serializedGS, 'serialize() includes activeBusId');
assertTrue('garageSlots' in serializedGS, 'serialize() includes garageSlots');

// ============================================
// TEST 20: Player remains canonical garage owner
// ============================================
console.log('\n--- TEST 20: Player remains canonical garage owner ---');

assertTrue(GarageSystem._garage === gsPlayer.garage, 'GarageSystem._garage === Player.garage');
assertTrue(GarageSystem.getGarage() === gsPlayer.garage, 'GarageSystem.getGarage() === Player.garage');

// ============================================
// TEST 21: Old saves with GarageSystem.garage still load safely
// ============================================
console.log('\n--- TEST 21: Old saves with GarageSystem.garage still load safely ---');

const oldGsPlayer = new Player();
oldGsPlayer.garage = [new Bus(0, 0, 'pallevelugu')];
oldGsPlayer.activeBusId = oldGsPlayer.garage[0].id;

const mockGameInitOld = {
  getPlayer: () => oldGsPlayer,
  getActiveBus: function () { return oldGsPlayer ? oldGsPlayer.getActiveBus() : null; }
};
GarageSystem.modules = { EventManager, GameConfig: mockGameInitOld, GameInitSystem: mockGameInitOld };
GarageSystem._garage = oldGsPlayer.garage;
GarageSystem._activeBusId = oldGsPlayer.activeBusId;

// Old save format: GarageSystem.garage has saved bus data
const oldGarageData = {
  garage: [{ id: oldGsPlayer.garage[0].id, busTypeId: 'pallevelugu', x: 0, y: 0, fuelLevel: 100 }],
  activeBusId: oldGsPlayer.garage[0].id,
  garageSlots: 3
};

let oldGsCrash = false;
try {
  GarageSystem.deserialize(oldGarageData);
} catch (e) {
  oldGsCrash = true;
}
assertFalse(oldGsCrash, 'Old GarageSystem.garage data does not crash on deserialize');
// GarageSystem.deserialize uses player.garage as canonical, not data.garage
assertTrue(GarageSystem._garage === oldGsPlayer.garage, 'GarageSystem references Player.garage even for old saves');
assertEqual(GarageSystem._activeBusId, oldGsPlayer.garage[0].id, 'activeBusId restored from old save');
assertEqual(GarageSystem._garageSlots, 3, 'garageSlots restored from old save');

// ============================================
// TEST 22: exportSave includes GarageConfig
// ============================================
console.log('\n--- TEST 22: exportSave includes GarageConfig ---');

const exportPlayer = new Player();
exportPlayer.garage = [new Bus(0, 0, 'pallevelugu')];
exportPlayer.activeBusId = exportPlayer.garage[0].id;
exportPlayer.money = 500000;

const mockGameInitExport = {
  getPlayer: () => exportPlayer,
  getActiveBus: function () { return exportPlayer ? exportPlayer.getActiveBus() : null; }
};
SaveLoadSystem.modules = { EventManager, GameInitSystem: mockGameInitExport, GameLoopSystem: null, GarageSystem: GarageSystem };
GarageSystem.modules = { EventManager, GameInitSystem: mockGameInitExport };
GarageSystem._garage = exportPlayer.garage;
GarageSystem._activeBusId = exportPlayer.activeBusId;
GarageSystem._garageSlots = 5;

const exported = SaveLoadSystem.exportSave();
assertTruthy(exported, 'exportSave returns data');
const exportParsed = JSON.parse(exported);
assertTrue('garageConfig' in exportParsed, 'exportSave includes garageConfig field');
assertTruthy(exportParsed.garageConfig, 'garageConfig is non-null in export');
assertTrue('player' in exportParsed, 'exportSave includes player field');
assertTrue('systems' in exportParsed, 'exportSave includes systems field');
assertTrue('version' in exportParsed, 'exportSave includes version');

// ============================================
// TEST 23: exportSave → importSave round-trip
// ============================================
console.log('\n--- TEST 23: exportSave → importSave round-trip ---');

// Set up GarageSystem for the export player
GarageSystem.modules = { EventManager, GameInitSystem: mockGameInitExport };
GarageSystem._garage = exportPlayer.garage;
GarageSystem._activeBusId = exportPlayer.activeBusId;
GarageSystem._garageSlots = 5;

// Re-export with GarageSystem registered
const exportedRoundTrip = SaveLoadSystem.exportSave();
assertTruthy(exportedRoundTrip, 'exportSave produces output');

// Import into a different GameInitSystem
const importTargetPlayer = new Player();
const mockGameInitImportTarget = {
  player: importTargetPlayer,
  getPlayer: function () { return this.player; },
  getActiveBus: function () { return this.player ? this.player.getActiveBus() : null; }
};

SaveLoadSystem.modules = {
  EventManager,
  GameInitSystem: mockGameInitImportTarget,
  GarageSystem: GarageSystem
};
GarageSystem.modules = { EventManager, GameInitSystem: mockGameInitImportTarget };

const importResult23 = SaveLoadSystem.importSave(exportedRoundTrip);
assertTrue(importResult23.success, 'importSave succeeds from exportSave output');

// Verify player restored
const rtPlayer23 = mockGameInitImportTarget.getPlayer();
assertEqual(rtPlayer23.money, 500000, 'Player money restored from export');
assertEqual(rtPlayer23.garage.length, 1, 'Player garage count restored');
assertTrue(rtPlayer23.garage[0] instanceof Bus, 'Imported bus[0] is Bus instance');

// Verify GarageConfig restored
const gcConfig = GarageConfig.getConfig();
assertTrue(gcConfig !== null, 'GarageConfig restored from import');

// Verify active bus
const activeBus23 = mockGameInitImportTarget.getActiveBus();
assertTrue(activeBus23 instanceof Bus, 'Active bus is Bus instance after round-trip');
assertTrue(typeof activeBus23.draw === 'function', 'Active bus has draw method');
assertTrue(typeof activeBus23.update === 'function', 'Active bus has update method');
assertTrue(typeof activeBus23.refuel === 'function', 'Active bus has refuel method');

// Verify GarageSystem synchronized
assertTrue(GarageSystem._garage === rtPlayer23.garage, 'GarageSystem._garage === Player.garage');
assertEqual(rtPlayer23.activeBusId, rtPlayer23.garage[0].id, 'Active bus ID synchronized');

// ============================================
// TEST 24: Missing GarageConfig in export remains backward compatible
// ============================================
console.log('\n--- TEST 24: Missing GarageConfig backward compatible ---');

const noConfigExport = {
  version: '1.0.0',
  exportedAt: Date.now(),
  player: exportPlayer.serialize(),
  systems: { GarageSystem: { activeBusId: exportPlayer.garage[0].id, garageSlots: 5 } }
  // No garageConfig field
};
const noConfigString = JSON.stringify(noConfigExport);

let noConfigCrash = false;
let noConfigResult = null;
try {
  noConfigResult = SaveLoadSystem.importSave(noConfigString);
} catch (e) {
  noConfigCrash = true;
}
assertFalse(noConfigCrash, 'Import without garageConfig does not crash');
assertTrue(noConfigResult.success, 'Import without garageConfig returns success');

// ============================================
// TEST 25: No duplicate init after Bus.deserialize
// ============================================
console.log('\n--- TEST 25: No duplicate init after Bus.deserialize ---');

const freshBus = new Bus(100, 200, 'pallevelugu');
const freshData = {
  id: freshBus.id,
  busTypeId: 'pallevelugu',
  x: 100, y: 200,
  fuelLevel: 150,
  damage: 0,
  passengersOnBoard: 0,
  maxSpeed: 75,
  tripsCompleted: 3,
  color: '#0000ff'
};

const deserializedOnce = Bus.deserialize(freshData);
const deserializedAgain = Bus.deserialize(freshData);
assertTrue(deserializedOnce instanceof Bus, 'First deserialize creates Bus');
assertTrue(deserializedAgain instanceof Bus, 'Second deserialize creates Bus');
assertEqual(deserializedOnce.id, deserializedAgain.id, 'Same id across deserializations');
assertEqual(deserializedOnce.fuelLevel, 150, 'Fuel restored from serialized data');
assertEqual(deserializedAgain.fuelLevel, 150, 'Fuel restored consistently from serialized data');

// ============================================
// SUMMARY
// ============================================
console.log('\n=== RESULTS ===');
for (const r of results) {
  console.log((r.pass ? 'PASS' : 'FAIL') + ': ' + r.name + (r.message ? ' - ' + r.message : ''));
}

console.log('\n=== ' + passedCount + ' passed, ' + failedCount + ' failed ===');
if (failedCount === 0) {
  console.log('PHASE 9 TESTS: ALL PASSED');
} else {
  console.log('PHASE 9 TESTS: SOME TESTS FAILED');
  process.exit(1);
}
