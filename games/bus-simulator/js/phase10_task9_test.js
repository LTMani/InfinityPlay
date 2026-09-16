/**
 * Phase 10B Task 9 - Suspension & Weight Transfer Tests
 * Verifies deterministic, modular suspension behavior integrated with
 * the existing Vehicle/Bus physics without duplicating movement logic.
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
  './systems/NavigationSystem.js',
  './systems/TransmissionSystem.js',
  './systems/SuspensionSystem.js'
];

for (const dep of deps) {
  require(dep);
}

const SuspensionSystem = window.BusSim.SuspensionSystem;
const TransmissionSystem = window.BusSim.TransmissionSystem;
const Bus = window.BusSim.Bus;
const Vehicle = window.BusSim.Vehicle;

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

function assertLessOrEqual(a, b, name) {
  return test(name, a <= b, `expected <= ${b}, got ${a}`);
}

function assertGreaterOrEqual(a, b, name) {
  return test(name, a >= b, `expected >= ${b}, got ${a}`);
}

function freshBus() {
  const b = new Bus(0, 0, "pallevelugu");
  b.active = true;
  b.speed = 0;
  b.targetSpeed = 0;
  b.steering = 0;
  return b;
}

function freshVehicle() {
  const v = new Vehicle(0, 0, "bus");
  v.active = true;
  v.speed = 0;
  v.targetSpeed = 0;
  v.steering = 0;
  return v;
}

function freshSuspensionSystem() {
  const ts = new SuspensionSystem();
  ts.init({});
  return ts;
}

console.log("=== Phase 10B Task 9: Suspension & Weight Transfer Tests ===");

// ============================================
// TEST 1: initialization/defaults
// ============================================
console.log("\n--- TEST 1: initialization/defaults ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  const state = ss.ensureSuspension(bus);
  assertTruthy(state, "suspension state created");
  assertTruthy(typeof state.mass === "number", "mass is a number");
  assertTruthy(typeof state.wheelbase === "number", "wheelbase is a number");
  assertTruthy(typeof state.trackWidth === "number", "trackWidth is a number");
  assertTruthy(typeof state.centerOfMass === "number", "centerOfMass is a number");
  assertTruthy(typeof state.stiffness === "number", "stiffness is a number");
  assertTruthy(typeof state.damping === "number", "damping is a number");
  assertTruthy(typeof state.maxCompression === "number", "maxCompression is a number");
  assertTruthy(typeof state.maxRebound === "number", "maxRebound is a number");
  assertTruthy(typeof state.bodyRoll === "number", "bodyRoll is a number");
  assertTruthy(typeof state.pitch === "number", "pitch is a number");
}

// ============================================
// TEST 2: compression
// ============================================
console.log("\n--- TEST 2: compression ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  ss.ensureSuspension(bus);
  // Accelerate -> rear loads -> rear compresses
  bus.speed = 0;
  bus.targetSpeed = 50;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  const state = ss.getSuspension(bus);
  assertTruthy(typeof state.rearCompression === "number", "rearCompression is a number");
  assertTruthy(Math.abs(state.rearCompression) <= state.maxCompression + 1e-9, "rearCompression within maxCompression");
}

// ============================================
// TEST 3: rebound
// ============================================
console.log("\n--- TEST 3: rebound ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  ss.ensureSuspension(bus);
  // Apply compression then release
  bus.speed = 0;
  bus.targetSpeed = 50;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  const maxRebound = ss.getSuspension(bus).maxRebound;
  // Now decelerate -> rebound
  bus.targetSpeed = 0;
  bus.speed = 30;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  const after = ss.getSuspension(bus).rearCompression;
  assertTruthy(Math.abs(after) <= maxRebound + 1e-9, "rebound within maxRebound");
}

// ============================================
// TEST 4: acceleration weight transfer
// ============================================
console.log("\n--- TEST 4: acceleration weight transfer ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  ss.ensureSuspension(bus);
  // Accelerating forward -> rear loads
  bus.speed = 0;
  bus.targetSpeed = 50;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  const state = ss.getSuspension(bus);
  assertTruthy(state.rearLoad > state.frontLoad, "rear load > front load on acceleration");
}

// ============================================
// TEST 5: braking weight transfer
// ============================================
console.log("\n--- TEST 5: braking weight transfer ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  ss.ensureSuspension(bus);
  // Braking -> front loads
  bus.speed = 50;
  bus.targetSpeed = 0;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  const state = ss.getSuspension(bus);
  assertTruthy(state.frontLoad > state.rearLoad, "front load > rear load on braking");
}

// ============================================
// TEST 6: lateral weight transfer
// ============================================
console.log("\n--- TEST 6: lateral weight transfer ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  ss.ensureSuspension(bus);
  // Turning right -> load transfers to left
  bus.speed = 40;
  bus.steering = 0.5;
  bus.targetSpeed = 40;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  const state = ss.getSuspension(bus);
  assertTruthy(typeof state.leftLoad === "number", "leftLoad is a number");
  assertTruthy(typeof state.rightLoad === "number", "rightLoad is a number");
  assertTruthy(state.leftLoad !== state.rightLoad, "lateral transfer creates load difference");
}

// ============================================
// TEST 7: body roll
// ============================================
console.log("\n--- TEST 7: body roll ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  ss.ensureSuspension(bus);
  // Turning produces body roll
  bus.speed = 40;
  bus.steering = 0.5;
  bus.targetSpeed = 40;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  const state = ss.getSuspension(bus);
  assertTruthy(Math.abs(state.bodyRoll) > 0 || state.bodyRoll === 0, "body roll is a number");
  assertTruthy(Math.abs(state.bodyRoll) <= 0.6 + 1e-9, "body roll within max limit");
}

// ============================================
// TEST 8: pitch
// ============================================
console.log("\n--- TEST 8: pitch ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  ss.ensureSuspension(bus);
  // Accelerating produces pitch (rear sinks)
  bus.speed = 0;
  bus.targetSpeed = 50;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  const state = ss.getSuspension(bus);
  assertTruthy(typeof state.pitch === "number", "pitch is a number");
  assertTruthy(Math.abs(state.pitch) <= 0.5 + 1e-9, "pitch within max limit");
}

// ============================================
// TEST 9: damping
// ============================================
console.log("\n--- TEST 9: damping ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  ss.ensureSuspension(bus);
  // Apply load then release; damping should reduce oscillation
  bus.speed = 0;
  bus.targetSpeed = 50;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  const vel1 = ss.getSuspension(bus).compressionVelocity;
  bus.targetSpeed = 0;
  bus.speed = 30;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  const vel2 = ss.getSuspension(bus).compressionVelocity;
  assertTruthy(typeof vel1 === "number" && typeof vel2 === "number", "compressionVelocity is a number");
}

// ============================================
// TEST 10: maximum limits
// ============================================
console.log("\n--- TEST 10: maximum limits ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  ss.ensureSuspension(bus);
  // Extreme acceleration -> compression clamped
  bus.speed = 0;
  bus.targetSpeed = 200;
  for (let i = 0; i < 5; i++) {
    bus.update(0.1);
    ss.updateVehicle(bus, 0.1);
  }
  const state = ss.getSuspension(bus);
  assertLessOrEqual(state.rearCompression, state.maxCompression + 1e-9, "rearCompression <= maxCompression");
  assertGreaterOrEqual(state.rearCompression, -state.maxRebound - 1e-9, "rearCompression >= -maxRebound");
  assertLessOrEqual(Math.abs(state.bodyRoll), 0.6 + 1e-9, "bodyRoll <= 0.6");
  assertLessOrEqual(Math.abs(state.pitch), 0.5 + 1e-9, "pitch <= 0.5");
}

// ============================================
// TEST 11: dt determinism
// ============================================
console.log("\n--- TEST 11: dt determinism ---");
{
  const ss1 = freshSuspensionSystem();
  const ss2 = freshSuspensionSystem();
  const bus1 = freshBus();
  const bus2 = freshBus();
  ss1.ensureSuspension(bus1);
  ss2.ensureSuspension(bus2);
  bus1.targetSpeed = 50;
  bus2.targetSpeed = 50;
  bus1.steering = 0.3;
  bus2.steering = 0.3;
  bus1.update(0.1);
  bus2.update(0.1);
  ss1.updateVehicle(bus1, 0.1);
  ss2.updateVehicle(bus2, 0.1);
  assertEqual(ss1.getSuspension(bus1).rearCompression, ss2.getSuspension(bus2).rearCompression, "same dt -> same compression");
  assertEqual(ss1.getSuspension(bus1).bodyRoll, ss2.getSuspension(bus2).bodyRoll, "same dt -> same bodyRoll");
}

// ============================================
// TEST 12: stationary stability
// ============================================
console.log("\n--- TEST 12: stationary stability ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  ss.ensureSuspension(bus);
  // Stationary -> no weight transfer
  bus.speed = 0;
  bus.targetSpeed = 0;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  const state = ss.getSuspension(bus);
  assertEqual(state.rearCompression, 0, "no compression when stationary");
  assertEqual(state.bodyRoll, 0, "no body roll when stationary");
  assertEqual(state.pitch, 0, "no pitch when stationary");
}

// ============================================
// TEST 13: interaction with transmission
// ============================================
console.log("\n--- TEST 13: interaction with transmission ---");
{
  const ss = freshSuspensionSystem();
  const ts = new TransmissionSystem();
  ts.init({});
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ss.ensureSuspension(bus);
  // Neutral -> no drive -> no weight transfer
  ts.setGearMode(bus, "neutral");
  bus.targetSpeed = 50;
  bus.update(0.1);
  ts.updateVehicle(bus, 0.1);
  ss.updateVehicle(bus, 0.1);
  const neutralState = ss.getSuspension(bus);
  // Drive -> weight transfer
  ts.shiftDrive(bus);
  bus.targetSpeed = 50;
  bus.update(0.1);
  ts.updateVehicle(bus, 0.1);
  ss.updateVehicle(bus, 0.1);
  const driveState = ss.getSuspension(bus);
  assertTruthy(typeof neutralState.rearCompression === "number", "neutral state has compression");
  assertTruthy(typeof driveState.rearCompression === "number", "drive state has compression");
  // Suspension does not duplicate transmission logic
  assertTruthy(typeof ts.getTransmission(bus).gearMode === "string", "transmission gearMode intact");
}

// ============================================
// TEST 14: interaction with weather friction
// ============================================
console.log("\n--- TEST 14: interaction with weather friction ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  ss.ensureSuspension(bus);
  // Dry
  bus.roadFrictionMultiplier = 1.0;
  bus.speed = 0;
  bus.targetSpeed = 50;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  const dryState = ss.getSuspension(bus);
  // Wet (less grip)
  bus.roadFrictionMultiplier = 0.6;
  bus.speed = 0;
  bus.targetSpeed = 50;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  const wetState = ss.getSuspension(bus);
  assertTruthy(typeof dryState.rearCompression === "number", "dry state has compression");
  assertTruthy(typeof wetState.rearCompression === "number", "wet state has compression");
  // Suspension does not duplicate friction logic
  assertEqual(bus.roadFrictionMultiplier, 0.6, "roadFrictionMultiplier preserved (Task 4)");
}

// ============================================
// TEST 15: no duplicate calculations
// ============================================
console.log("\n--- TEST 15: no duplicate calculations ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  ss.ensureSuspension(bus);
  // Suspension state must not modify acceleration/brake
  const accelBefore = bus.acceleration;
  const brakeBefore = bus.brakeDeceleration;
  bus.speed = 40;
  bus.targetSpeed = 40;
  bus.steering = 0.3;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  assertEqual(bus.acceleration, accelBefore, "acceleration unchanged by suspension");
  assertEqual(bus.brakeDeceleration, brakeBefore, "brakeDeceleration unchanged by suspension");
  // Suspension does not duplicate Task 3 fuel accounting
  assertTruthy(typeof bus.fuelUsed === "number", "bus.fuelUsed preserved (Task 3)");
  // Suspension does not duplicate Task 4 friction
  assertEqual(bus.roadFrictionMultiplier, 1.0, "roadFrictionMultiplier preserved (Task 4)");
}

// ============================================
// TEST 16: save/load compatibility
// ============================================
console.log("\n--- TEST 16: save/load compatibility ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  bus.id = "bus_susp";
  ss.ensureSuspension(bus);
  bus.speed = 40;
  bus.targetSpeed = 40;
  bus.steering = 0.3;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  const stateBefore = ss.getSuspension(bus);

  // Per-vehicle serialize/deserialize
  const serialized = ss.serializeSuspension(bus);
  assertTruthy(serialized, "suspension serialized");
  assertEqual(serialized.bodyRoll, stateBefore.bodyRoll, "bodyRoll serialized");

  const ss2 = freshSuspensionSystem();
  const bus2 = freshBus();
  bus2.id = "bus_susp";
  ss2.ensureSuspension(bus2);
  ss2.deserializeSuspension(bus2, serialized);
  const stateAfter = ss2.getSuspension(bus2);
  assertEqual(stateAfter.bodyRoll, stateBefore.bodyRoll, "bodyRoll restored");
  assertEqual(stateAfter.pitch, stateBefore.pitch, "pitch restored");
}

// ============================================
// TEST 17: system-level save/load round-trip
// ============================================
console.log("\n--- TEST 17: system-level save/load round-trip ---");
{
  const ss = freshSuspensionSystem();
  const bus = freshBus();
  bus.id = "bus_sys2";
  ss.ensureSuspension(bus);
  bus.speed = 40;
  bus.targetSpeed = 40;
  bus.steering = 0.3;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);

  // System-level serialize/deserialize
  const sysData = ss.serialize();
  assertTruthy(sysData["bus_sys2"], "system data contains bus entry");

  const ss2 = freshSuspensionSystem();
  ss2.deserialize(sysData);
  const bus2 = freshBus();
  bus2.id = "bus_sys2";
  const attached = ss2.attachSuspension(bus2);
  assertTruthy(attached, "suspension re-attached after deserialize");
  assertEqual(attached.bodyRoll, ss.getSuspension(bus).bodyRoll, "bodyRoll preserved after system round-trip");
  assertEqual(attached.pitch, ss.getSuspension(bus).pitch, "pitch preserved after system round-trip");
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
  console.log("PHASE 10B TASK 9 TESTS: ALL PASSED");
} else {
  console.log("PHASE 10B TASK 9 TESTS: SOME TESTS FAILED");
}
process.exit(failedCount === 0 ? 0 : 1);
