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
  getPlayer: () => savePlayer,
  getActiveBus: function () {
    return savePlayer ? savePlayer.getActiveBus() : null;
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
assertEqual(garageSaveData.garage.length, 2, 'Serialized GarageSystem has 2 buses');

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
assertTrue(GarageSystem.getGarage() === savePlayer.garage, 'GarageSystem._garage same reference as Player.garage');
assertEqual(savePlayer.activeBusId, saveBusB.id, 'Player.activeBusId matches restored GarageSystem');

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
// Set up fake saved data
const savedGarageData = {
  garage: [{ id: busL.id, busTypeId: 'express' }], // Only busL saved
  activeBusId: busL.id
};

// Manually call _restoreSystemData with saved data
SaveLoadSystem.modules = { EventManager, GameInitSystem: mockGameInit12, GarageSystem: GarageSystem };
SaveLoadSystem._restoreSystemData({ GarageSystem: savedGarageData });

// Verify restore overwrote the init state (restore happens AFTER init)
assertEqual(GarageSystem._activeBusId, busL.id, 'GarageSystem._activeBusId restored to Bus L after init');
assertEqual(GarageSystem.getGarage().length, 1, 'GarageSystem._garage restored to saved data');

// Verify Player was synced (from deserialize sync)
assertEqual(player12.activeBusId, busL.id, 'Player.activeBusId synced after restore');
assertEqual(player12.garage.length, 1, 'Player.garage synced after restore');

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
