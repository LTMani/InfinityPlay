/**
 * Phase 10A Task 6 - Passenger.isBored() Fix Tests
 * Verifies deterministic, safe Passenger.isBored() behavior.
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

const Passenger = window.BusSim.Passenger;

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

function freshPassenger() {
  return new Passenger(0, 0, "vijayawada", "stop_1");
}

console.log("=== Phase 10A Task 6: Passenger.isBored() Tests ===");

// ============================================
// TEST 1: isBored exists
// ============================================
console.log("\n--- TEST 1: isBored exists ---");
{
  const p = freshPassenger();
  assertTruthy(typeof p.isBored === "function", "isBored is a function");
  assertTruthy(typeof p.isBored() === "boolean", "isBored returns a boolean");
}

// ============================================
// TEST 2: returns boolean
// ============================================
console.log("\n--- TEST 2: returns boolean ---");
{
  const p = freshPassenger();
  const result = p.isBored();
  assertEqual(typeof result, "boolean", "isBored returns boolean type");
}

// ============================================
// TEST 3: normal passenger is not bored
// ============================================
console.log("\n--- TEST 3: normal passenger is not bored ---");
{
  const p = freshPassenger();
  // Fresh passenger: anger = 0, waitTime = 0
  assertFalse(p.isBored(), "fresh passenger is not bored");
  assertEqual(p.anger, 0, "fresh passenger anger is 0");
}

// ============================================
// TEST 4: boredom threshold behavior
// ============================================
console.log("\n--- TEST 4: boredom threshold behavior ---");
{
  const p = freshPassenger();
  // Anger below threshold -> not bored
  p.anger = 50;
  assertFalse(p.isBored(), "anger 50 is not bored");
// Anger at threshold -> bored
  p.anger = 100;
  assertTrue(p.isBored(), "anger 100 is bored");
  // After update with no wait time, anger recomputes from waitTime (0),
  // so the passenger is no longer bored. This verifies isBored reflects
  // the current anger value rather than a stale flag.
  p.update(0.1);
  assertFalse(p.isBored(), "anger recomputed after update with no wait");
}

// ============================================
// TEST 5: high boredom becomes bored
// ============================================
console.log("\n--- TEST 5: high boredom becomes bored ---");
{
  const p = freshPassenger();
  p.anger = 99;
  assertFalse(p.isBored(), "anger 99 not yet bored");
  p.anger = 100;
  assertTrue(p.isBored(), "anger 100 becomes bored");
}

// ============================================
// TEST 6: missing/default boredom data is safe
// ============================================
console.log("\n--- TEST 6: missing/default data is safe ---");
{
  const p = freshPassenger();
  // Simulate missing anger (e.g. after deserialize)
  p.anger = undefined;
  assertFalse(p.isBored(), "undefined anger is safe (not bored)");
  p.anger = null;
  assertFalse(p.isBored(), "null anger is safe (not bored)");
  p.anger = 0;
  assertFalse(p.isBored(), "zero anger is safe (not bored)");
  delete p.anger;
  assertFalse(p.isBored(), "missing anger is safe (not bored)");
}

// ============================================
// TEST 7: repeated calls are deterministic
// ============================================
console.log("\n--- TEST 7: repeated calls deterministic ---");
{
  const p = freshPassenger();
  p.anger = 100;
  const r1 = p.isBored();
  const r2 = p.isBored();
  const r3 = p.isBored();
  assertEqual(r1, r2, "first and second calls match");
  assertEqual(r2, r3, "second and third calls match");
  assertEqual(r1, true, "bored passenger returns true consistently");

  const p2 = freshPassenger();
  p2.anger = 0;
  assertEqual(p2.isBored(), p2.isBored(), "non-bored passenger returns consistent false");
}

// ============================================
// TEST 8: existing passenger behavior remains functional
// ============================================
console.log("\n--- TEST 8: existing passenger behavior ---");
{
  const p = freshPassenger();
  // State machine still works
  assertEqual(p.state, "waiting", "initial state is waiting");
  p.board();
  assertEqual(p.state, "boarding", "board() transitions to boarding");
  p.ride();
  assertEqual(p.state, "riding", "ride() transitions to riding");
  p.alight();
  assertEqual(p.state, "alighting", "alight() transitions to alighting");

  // update() still accumulates anger/waitTime
  const p2 = freshPassenger();
  p2.update(10);
  assertTruthy(p2.waitTime >= 10, "update accumulates waitTime");
  assertTruthy(p2.anger > 0, "update accumulates anger");
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
  console.log("PHASE 10A TASK 6 TESTS: ALL PASSED");
} else {
  console.log("PHASE 10A TASK 6 TESTS: SOME TESTS FAILED");
  process.exit(1);
}
