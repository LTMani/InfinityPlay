/**
 * Phase 10A Task 3 - Fuel Consumption Double-Counting Fix Tests
 * Verifies ONE authoritative fuel-consumption path:
 *   - Bus.update() owns actual fuel tank depletion and records bus.fuelUsed
 *   - TripSystem observes bus.fuelUsed; it never re-simulates fuel
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

const EventManager = window.BusSim.EventManager;
const Bus = window.BusSim.Bus;
const BusTypes = window.BusSim.BusTypes;
const EconomyConfig = window.BusSim.EconomyConfig;
const TripSystem = window.BusSim.TripSystem;
const GameInitSystem = window.BusSim.GameInitSystem;
const SaveLoadSystem = window.BusSim.SaveLoadSystem;
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

function assertTrue(condition, name) {
  return test(name, !!condition, `expected true, got ${condition}`);
}

function assertFalse(condition, name) {
  return test(name, !condition, `expected false, got ${condition}`);
}

function assertTruthy(value, name) {
  return test(name, !!value, `expected truthy, got ${value}`);
}

function makeModules(bus) {
  const player = new Player();
  player.garage = [bus];
  player.activeBusId = bus.id;
  const mockGameInit = {
    _player: player,
    getPlayer: () => player,
    getActiveBus: () => bus
  };
  return {
    EventManager,
    GameEngine: { _config: { states: { BOOT: 'boot', PLAYING: 'playing', PAUSED: 'paused' } } },
    GameInitSystem: mockGameInit,
    GameLoopSystem: { canPlay: () => true, getState: () => 'playing' },
    Map: { pois: [], allCities: [{ x: 0, y: 0, type: 'metropolitan' }] }
  };
}

function freshBus(typeId) {
  const b = new Bus(0, 0, typeId || 'pallevelugu');
  b.active = true;
  b.targetSpeed = 0;
  b.speed = 0;
  b.fuelUsed = 0;
  return b;
}

function freshTripSystem(bus) {
  const ts = Object.create(TripSystem);
  Object.assign(ts, TripSystem);
  ts.init(makeModules(bus));
  return ts;
}

console.log('=== Phase 10A Task 3: Fuel Double-Count Fix Tests ===');

// ============================================
// TEST 1: fuel decreases exactly once per update
// ============================================
console.log('\n--- TEST 1: Fuel decreases exactly once ---');
{
  const bus = freshBus('pallevelugu');
  const before = bus.fuelLevel;
  bus.speed = 30;
  bus.update(0.1);
  assertTruthy(bus.fuelLevel < before, 'fuel decreased after moving update');
  assertEqual(bus.fuelUsed, before - bus.fuelLevel, 'fuelUsed equals actual fuel decrease');
  assertTruthy(bus.fuelUsed > 0, 'fuelUsed is positive after moving');
  assertTruthy(bus.fuelUsed === before - bus.fuelLevel, 'no double count: fuelUsed == delta only');
}

// ============================================
// TEST 2: TripSystem.fuelUsed matches actual Bus fuel consumption
// ============================================
console.log('\n--- TEST 2: TripSystem.fuelUsed matches actual consumption ---');
{
  const bus = freshBus('pallevelugu');
  const ts = freshTripSystem(bus);
  bus.startTrip();
  bus.speed = 40;
  bus.update(0.1);
  ts.update(0.1);
  assertEqual(ts.fuelUsed, bus.fuelUsed, 'TripSystem.fuelUsed equals bus.fuelUsed after update');
}

// ============================================
// TEST 3: No double-counting over multiple ticks
// ============================================
console.log('\n--- TEST 3: No double-counting over multiple ticks ---');
{
  const bus = freshBus('pallevelugu');
  const ts = freshTripSystem(bus);
  bus.startTrip();
  const startFuel = bus.fuelLevel;
  for (let i = 0; i < 10; i++) {
    bus.speed = 50;
    bus.update(0.1);
    ts.update(0.1);
  }
  const consumed = startFuel - bus.fuelLevel;
  assertEqual(bus.fuelUsed, consumed, 'bus.fuelUsed equals total fuel consumed');
  assertEqual(ts.fuelUsed, bus.fuelUsed, 'TripSystem.fuelUsed equals bus.fuelUsed');
  assertTruthy(ts.fuelUsed < consumed * 1.5, 'no double-count: fuelUsed not ~2x consumed');
}

// ============================================
// TEST 4: Different fuel efficiencies
// ============================================
console.log('\n--- TEST 4: Different fuel efficiencies ---');
{
  const busA = freshBus('pallevelugu');
  const busB = freshBus('express');
  busA.speed = 50;
  busB.speed = 50;
  const fuelA = busA.fuelLevel;
  const fuelB = busB.fuelLevel;
  busA.update(0.1);
  busB.update(0.1);
  const usedA = fuelA - busA.fuelLevel;
  const usedB = fuelB - busB.fuelLevel;
  assertTruthy(usedA > 0 && usedB > 0, 'both buses consumed fuel');
  assertTruthy(Math.abs(usedA - usedB) > 1e-9, 'different efficiencies produce different consumption');
  assertTruthy(busA.fuelEfficiency !== busB.fuelEfficiency, 'efficiency values differ');
}

// ============================================
// TEST 5: Zero-speed / idle behavior
// ============================================
console.log('\n--- TEST 5: Zero-speed behavior ---');
{
  const bus = freshBus('pallevelugu');
  const before = bus.fuelLevel;
  bus.speed = 0;
  bus.update(0.1);
  assertEqual(bus.fuelLevel, before, 'no fuel consumed at zero speed');
  assertEqual(bus.fuelUsed, 0, 'fuelUsed stays zero at idle');
}

// ============================================
// TEST 6: Fuel never becomes negative
// ============================================
console.log('\n--- TEST 6: Fuel never negative ---');
{
  const bus = freshBus('pallevelugu');
  bus.fuelLevel = 0.001;
  bus.speed = 60;
  bus.update(1.0);
  assertTruthy(bus.fuelLevel >= 0, 'fuel never negative');
  assertTruthy(bus.fuelLevel <= 0.001, 'fuel clamped near zero');
}

// ============================================
// TEST 7: Refueling still works
// ============================================
console.log('\n--- TEST 7: Refueling ---');
{
  const bus = freshBus('pallevelugu');
  bus.speed = 50;
  bus.update(0.1);
  const usedBeforeRefuel = bus.fuelUsed;
  const levelBefore = bus.fuelLevel;
  bus.refuel(50);
  assertTruthy(bus.fuelLevel > levelBefore, 'refuel increases fuel level');
  assertEqual(bus.fuelUsed, usedBeforeRefuel, 'refuel does not change fuelUsed');
}

// ============================================
// TEST 8: Trip expense uses correct fuelUsed
// ============================================
console.log('\n--- TEST 8: Trip expense uses correct fuelUsed ---');
{
  const bus = freshBus('pallevelugu');
  const ts = freshTripSystem(bus);
  bus.startTrip();
  ts.startTrip({ id: 'r1', name: 'Route 1' });
  bus.speed = 40;
  bus.update(0.1);
  ts.update(0.1);
  const result = ts.completeTrip();
  const expectedFuelExpense = Math.round(bus.fuelUsed * EconomyConfig.expenses.fuelPricePerLiter);
  assertTruthy(result.expenses >= expectedFuelExpense, 'expenses include fuel cost');
  assertEqual(Math.round(result.fuelUsed), Math.round(bus.fuelUsed), 'trip result fuelUsed matches bus');
  assertTruthy(result.expenses >= result.fuelUsed * EconomyConfig.expenses.fuelPricePerLiter, 'fuel expense uses correct fuelUsed');
}

// ============================================
// TEST 9: startTrip resets fuelUsed
// ============================================
console.log('\n--- TEST 9: startTrip resets fuelUsed ---');
{
  const bus = freshBus('pallevelugu');
  bus.speed = 40;
  bus.update(0.1);
  assertTruthy(bus.fuelUsed > 0, 'fuelUsed positive before startTrip');
  bus.startTrip();
  assertEqual(bus.fuelUsed, 0, 'startTrip resets fuelUsed to 0');
}

// ============================================
// TEST 10: completeTrip re-syncs fuelUsed
// ============================================
console.log('\n--- TEST 10: completeTrip re-syncs fuelUsed ---');
{
  const bus = freshBus('pallevelugu');
  const ts = freshTripSystem(bus);
  bus.startTrip();
  ts.startTrip({ id: 'r1', name: 'Route 1' });
  bus.speed = 40;
  bus.update(0.1);
  ts.update(0.1);
  // Directly modify bus.fuelUsed to simulate a tick not yet observed by TripSystem
  bus.fuelUsed += 0.5;
  const result = ts.completeTrip();
  assertEqual(Math.round(result.fuelUsed), Math.round(bus.fuelUsed), 'completeTrip re-syncs fuelUsed from bus');
  assertTruthy(Math.round(result.fuelUsed) === Math.round(bus.fuelUsed), 'result.fuelUsed matches bus');
}

// ============================================
// TEST 11: JSON save/load round-trip preserves fuel state
// ============================================
console.log('\n--- TEST 11: JSON save/load round-trip ---');
{
  const bus = freshBus('pallevelugu');
  bus.speed = 40;
  bus.startTrip();
  bus.update(0.1);
  bus.update(0.1);
  const usedBefore = bus.fuelUsed;
  const levelBefore = bus.fuelLevel;

  // Simulate localStorage JSON round-trip
  const player = new Player();
  player.garage = [bus];
  player.activeBusId = bus.id;
  const saved = JSON.parse(JSON.stringify(player.serialize()));
  const restored = Player.deserialize(saved);
  const restoredBus = restored.garage[0];
  assertTruthy(Math.abs(restoredBus.fuelLevel - levelBefore) < 1e-9, 'fuelLevel preserved across JSON save/load');
  assertTruthy(Math.abs(restoredBus.fuelUsed - usedBefore) < 1e-9, 'fuelUsed preserved across JSON save/load');
}

// ============================================
// SUMMARY
// ============================================
console.log('\n=== RESULTS ===');
for (const r of results) {
  console.log((r.pass ? 'PASS' : 'FAIL') + ': ' + r.name + (r.message ? ' - ' + r.message : ''));
}

console.log('\n=== ' + passedCount + ' passed, ' + failedCount + ' failed ===');
if (failedCount === 0) {
  console.log('PHASE 10A TASK 3 TESTS: ALL PASSED');
} else {
  console.log('PHASE 10A TASK 3 TESTS: SOME TESTS FAILED');
  process.exit(1);
}


