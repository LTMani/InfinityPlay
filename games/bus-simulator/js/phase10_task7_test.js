/**
 * Phase 10A Task 7 - Garage / SaveLoad Integration Audit & Fix Tests
 * Verifies garage save/load, garageConfig, activeBusId, garageSlots,
 * Bus instance reconstruction, import safety, and restoration ordering.
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

// Deterministic Math.random for reproducible tests
let _randomSeed = 42;
Math.random = function () {
  const x = Math.sin(_randomSeed++) * 10000;
  return x - Math.floor(x);
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
  './systems/GameInitSystem.js',
  './systems/InputSystem.js',
  './systems/MovementSystem.js',
  './systems/CameraSystem.js',
  './systems/CollisionSystem.js',
  './systems/RoadSystem.js',
  './systems/TrafficSystem.js',
  './systems/AIVehicleSystem.js',
  './systems/PassengerSystem.js',
  './systems/BusStopSystem.js',
  './systems/BoardingSystem.js',
  './systems/DropOffSystem.js',
  './systems/TicketSystem.js',
  './systems/RouteSystem.js',
  './systems/TripSystem.js',
  './systems/DayNightSystem.js',
  './systems/WeatherSystem.js',
  './systems/FuelSystem.js',
  './systems/DamageSystem.js',
  './systems/MaintenanceSystem.js',
  './systems/AchievementSystem.js',
  './systems/ProgressionSystem.js',
  './systems/MissionSystem.js',
  './systems/NavigationSystem.js'
];

for (const dep of deps) {
  require(dep);
}

const Player = window.BusSim.Player;
const Bus = window.BusSim.Bus;
const GarageConfig = window.BusSim.GarageConfig;
const SaveLoadSystem = window.BusSim.SaveLoadSystem;
const EventManager = window.BusSim.EventManager;

const results = [];
let testCount = 0;
let passedCount = 0;
let failedCount = 0;

function test(name, condition, message = "") {
  testCount++;
  const pass = !!condition;
  if (pass) passedCount++; else failedCount++;
  results.push({ name, pass, message });
  console.log((pass ? "PASS" : "FAIL") + ": " + name + (message ? " - " + message : ""));
  return pass;
}

function assertEqual(actual, expected, name) {
  return test(name, actual === expected, `expected ${expected}, got ${actual}`);
}

function assertTrue(condition, name) {
  return test(name, !!condition, `expected true, got ${condition}`);
}

function assertFalse(condition, name) {
  return test(name, !condition, `expected false, got ${condition}`);
}

function assertTruthy(value, name) {
  return test(name, !!value, `expected truthy, got ${value}`);
}

function makeModules() {
  const player = new Player();
  const mockGameInit = {
    _player: player,
    getPlayer: () => player,
    getActiveBus: () => player.getActiveBus()
  };
  return {
    EventManager,
    GameEngine: { _config: { states: { BOOT: "boot", PLAYING: "playing", PAUSED: "paused" } } },
    GameInitSystem: mockGameInit,
    GameLoopSystem: { canPlay: () => true, getState: () => "playing" },
    SaveLoadSystem
  };
}

console.log("=== Phase 10A Task 7: Garage / SaveLoad Integration Tests ===");

// ============================================
// TEST 1: garage save/load preserves Bus instances
// ============================================
console.log("\n--- TEST 1: garage save/load preserves Bus instances ---");
{
  const player = new Player();
  const bus = new Bus(0, 0, "pallevelugu");
  bus.id = "bus_1";
  bus.fuelLevel = 120;
  bus.fuelUsed = 5;
  player.garage = [bus];
  player.activeBusId = bus.id;

  const serialized = player.serialize();
  const restored = Player.deserialize(serialized);

  assertEqual(restored.garage.length, 1, "one bus restored");
  const restoredBus = restored.garage[0];
  assertTruthy(typeof restoredBus.update === "function", "restored bus has update method");
  assertTruthy(typeof restoredBus.refuel === "function", "restored bus has refuel method");
  assertTruthy(typeof restoredBus.startTrip === "function", "restored bus has startTrip method");
  assertEqual(restoredBus.id, "bus_1", "bus id preserved");
  assertEqual(restoredBus.fuelLevel, 120, "fuelLevel preserved");
  assertEqual(restoredBus.fuelUsed, 5, "fuelUsed preserved");
  assertEqual(restored.activeBusId, "bus_1", "activeBusId preserved");
}

// ============================================
// TEST 2: garageConfig save/load
// ============================================
console.log("\n--- TEST 2: garageConfig save/load ---");
{
  GarageConfig.init(makeModules());
  GarageConfig.setBusType("express");
  GarageConfig.setBusNumber("MH-02-BUS-002");

  const serialized = GarageConfig.serialize();
  assertEqual(serialized.busTypeId, "express", "busTypeId serialized");
  assertEqual(serialized.busNumber, "MH-02-BUS-002", "busNumber serialized");

  // Deserialize into a fresh config
  GarageConfig.init(makeModules());
  GarageConfig.deserialize(serialized);
  assertEqual(GarageConfig.getConfig().busTypeId, "express", "busTypeId restored");
  assertEqual(GarageConfig.getConfig().busNumber, "MH-02-BUS-002", "busNumber restored");
}

// ============================================
// TEST 3: activeBusId synchronization
// ============================================
console.log("\n--- TEST 3: activeBusId synchronization ---");
{
  const player = new Player();
  const busA = new Bus(0, 0, "pallevelugu");
  busA.id = "bus_a";
  const busB = new Bus(0, 0, "express");
  busB.id = "bus_b";
  player.garage = [busA, busB];
  player.activeBusId = "bus_a";

  const serialized = player.serialize();
  const restored = Player.deserialize(serialized);
  assertEqual(restored.activeBusId, "bus_a", "activeBusId preserved");
  assertTruthy(restored.getActiveBus().id === "bus_a", "getActiveBus returns correct bus");
}

// ============================================
// TEST 4: garageSlots synchronization
// ============================================
console.log("\n--- TEST 4: garageSlots synchronization ---");
{
  const player = new Player();
  player.garageSlots = 10;
  const bus = new Bus(0, 0, "pallevelugu");
  bus.id = "bus_1";
  player.garage = [bus];
  player.activeBusId = bus.id;

  const serialized = player.serialize();
  assertEqual(serialized.garageSlots, 10, "garageSlots serialized");
  const restored = Player.deserialize(serialized);
  assertEqual(restored.garageSlots, 10, "garageSlots restored");
}

// ============================================
// TEST 5: Bus instances survive deserialize (methods intact)
// ============================================
console.log("\n--- TEST 5: Bus instances survive deserialize ---");
{
  const player = new Player();
  const bus = new Bus(0, 0, "pallevelugu");
  bus.id = "bus_1";
  bus.fuelLevel = 100;
  bus.fuelCapacity = 180;
  bus.fuelEfficiency = 3.2;
  bus.startTrip();
  bus.speed = 40;
  bus.update(0.1);
  player.garage = [bus];
  player.activeBusId = bus.id;

  const serialized = player.serialize();
  const restored = Player.deserialize(serialized);
  const restoredBus = restored.garage[0];

// Verify the restored bus is a real Bus instance with all methods
  assertTrue(typeof restoredBus.update === "function", "update method intact");
  assertTrue(typeof restoredBus.refuel === "function", "refuel method intact");
  assertTrue(typeof restoredBus.startTrip === "function", "startTrip method intact");
  assertTrue(typeof restoredBus.setTargetSpeed === "function", "setTargetSpeed method intact");
  assertTrue(typeof restoredBus.brake === "function", "brake method intact");

  // Verify the bus still functions after restore
  restoredBus.refuel(20);
  assertTrue(restoredBus.fuelLevel > 100, "bus functions after restore (refuel works)");

  // Verify fuel accounting from Task 3 is preserved
  assertTrue(typeof restoredBus.fuelUsed === "number", "fuelUsed field preserved");
}

// ============================================
// TEST 6: import with missing garageConfig
// ============================================
console.log("\n--- TEST 6: import with missing garageConfig ---");
{
  const modules = makeModules();
  SaveLoadSystem.init(modules);
  GarageConfig.init(modules);

  const player = new Player();
  const bus = new Bus(0, 0, "pallevelugu");
  bus.id = "bus_1";
  player.garage = [bus];
  player.activeBusId = bus.id;

  const saveData = {
    version: "1.0.0",
    savedAt: Date.now(),
    player: player.serialize(),
    systems: {}
    // NOTE: no garageConfig field - simulates legacy/missing config
  };

  const result = SaveLoadSystem.importSave(JSON.stringify(saveData));
  assertTrue(result.success, "import succeeds with missing garageConfig");
  // GarageConfig should have a valid config (fallback to defaults)
  const cfg = GarageConfig.getConfig();
  assertTruthy(cfg, "garageConfig has valid config after import");
  assertTruthy(cfg.busTypeId, "garageConfig has busTypeId after import");
}

// ============================================
// TEST 7: system data restoration ordering
// ============================================
console.log("\n--- TEST 7: system data restoration ordering ---");
{
  const modules = makeModules();
  SaveLoadSystem.init(modules);
  GarageConfig.init(modules);

  const player = new Player();
  const bus = new Bus(0, 0, "pallevelugu");
  bus.id = "bus_1";
  player.garage = [bus];
  player.activeBusId = bus.id;

  // Save
  const saveData = {
    version: "1.0.0",
    savedAt: Date.now(),
    player: player.serialize(),
    systems: {},
    garageConfig: GarageConfig.serialize()
  };

  // Store in localStorage
  localStorage.setItem("bus_simulator_save_data", JSON.stringify(saveData));

  // Load via loadPlayer
  const loaded = SaveLoadSystem.loadPlayer();
  assertTruthy(loaded, "loadPlayer returns a player");
  assertTruthy(loaded.garage.length === 1, "loaded player has 1 bus");
  assertTruthy(typeof loaded.garage[0].update === "function", "loaded bus is a real Bus instance");
  assertEqual(loaded.activeBusId, "bus_1", "activeBusId preserved after loadPlayer");

  // Restore system data (simulating main.js _restoreSystemData)
  SaveLoadSystem.restoreSystemData();
  assertTrue(true, "restoreSystemData completes without error");
}

// ============================================
// TEST 8: repeated save/load determinism
// ============================================
console.log("\n--- TEST 8: repeated save/load determinism ---");
{
  const player = new Player();
  const bus = new Bus(0, 0, "pallevelugu");
  bus.id = "bus_1";
  bus.fuelLevel = 100;
  player.garage = [bus];
  player.activeBusId = bus.id;
  player.money = 5000;

  // Round-trip twice
  const s1 = player.serialize();
  const r1 = Player.deserialize(s1);
  const s2 = r1.serialize();
  const r2 = Player.deserialize(s2);

  assertEqual(r2.money, 5000, "money preserved across double round-trip");
  assertEqual(r2.garage[0].id, "bus_1", "bus id preserved across double round-trip");
  assertEqual(r2.garage[0].fuelLevel, 100, "fuelLevel preserved across double round-trip");
  assertEqual(r2.activeBusId, "bus_1", "activeBusId preserved across double round-trip");
}

// ============================================
// SUMMARY
// ============================================
console.log("\n=== RESULTS ===");
for (const r of results) {
  console.log((r.pass ? "PASS" : "FAIL") + ": " + r.name + (r.message ? " - " + r.message : ""));
}

console.log("\n=== " + passedCount + " passed, " + failedCount + " failed ===");
if (failedCount === 0) {
  console.log("PHASE 10A TASK 7 TESTS: ALL PASSED");
} else {
  console.log("PHASE 10A TASK 7 TESTS: SOME TESTS FAILED");
}
// Force exit: SaveLoadSystem.init() creates a setInterval (auto-save timer)
// that would otherwise keep the Node process alive.
process.exit(failedCount === 0 ? 0 : 1);
