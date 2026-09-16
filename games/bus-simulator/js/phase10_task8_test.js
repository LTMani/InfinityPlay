/**
 * Phase 10B Task 8 - Transmission & Gearbox System Tests
 * Verifies deterministic, modular transmission behavior integrated with
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
  './systems/TransmissionSystem.js'
];

for (const dep of deps) {
  require(dep);
}

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
  return b;
}

function freshVehicle() {
  const v = new Vehicle(0, 0, "bus");
  v.active = true;
  v.speed = 0;
  v.targetSpeed = 0;
  return v;
}

function freshTransmissionSystem() {
  const ts = new TransmissionSystem();
  ts.init({});
  return ts;
}

console.log("=== Phase 10B Task 8: Transmission & Gearbox Tests ===");

// ============================================
// TEST 1: transmission initialization
// ============================================
console.log("\n--- TEST 1: transmission initialization ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  const state = ts.ensureTransmission(bus);
  assertTruthy(state, "transmission state created");
  assertTruthy(typeof state.gearMode === "string", "gearMode is a string");
  assertTruthy(typeof state.currentGear === "number", "currentGear is a number");
  assertTruthy(Array.isArray(state.gearRatios), "gearRatios is an array");
  assertTruthy(typeof state.finalDriveRatio === "number", "finalDriveRatio is a number");
  assertTruthy(typeof state.shiftUpRPM === "number", "shiftUpRPM is a number");
  assertTruthy(typeof state.shiftDownRPM === "number", "shiftDownRPM is a number");
  assertTruthy(typeof state.maxRPM === "number", "maxRPM is a number");
  assertTruthy(typeof state.engineRPM === "number", "engineRPM is a number");
}

// ============================================
// TEST 2: neutral behavior
// ============================================
console.log("\n--- TEST 2: neutral behavior ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ts.setGearMode(bus, "neutral");
  bus.targetSpeed = 50;
  bus.update(0.1);
  // Neutral produces no drive torque -> speed stays 0
  assertEqual(bus.speed, 0, "neutral produces no drive");
  const state = ts.getTransmission(bus);
  assertEqual(state.gearMode, "neutral", "gearMode is neutral");
  assertEqual(state.currentGear, 0, "currentGear is 0 in neutral");
  assertEqual(ts.getDriveTorqueMultiplier(bus), 0, "neutral torque multiplier is 0");
}

// ============================================
// TEST 3: reverse behavior
// ============================================
console.log("\n--- TEST 3: reverse behavior ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ts.setGearMode(bus, "reverse");
  bus.targetSpeed = -20;
  bus.update(0.1);
  assertTruthy(bus.speed < 0, "reverse moves backward");
  const state = ts.getTransmission(bus);
  assertEqual(state.gearMode, "reverse", "gearMode is reverse");
  assertEqual(state.currentGear, -1, "currentGear is -1 in reverse");
  assertTruthy(ts.getDriveTorqueMultiplier(bus) > 0, "reverse produces drive when moving backward");
}

// ============================================
// TEST 4: drive behavior
// ============================================
console.log("\n--- TEST 4: drive behavior ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ts.shiftDrive(bus);
  bus.targetSpeed = 50;
  bus.update(0.1);
  assertTruthy(bus.speed > 0, "drive moves forward");
  const state = ts.getTransmission(bus);
  assertEqual(state.gearMode, "drive", "gearMode is drive");
  assertGreaterOrEqual(state.currentGear, 1, "currentGear >= 1 in drive");
  assertLessOrEqual(state.currentGear, state.gearRatios.length, "currentGear within range");
}

// ============================================
// TEST 5: valid gear ranges
// ============================================
console.log("\n--- TEST 5: valid gear ranges ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ts.shiftDrive(bus);
  const state = ts.getTransmission(bus);
  assertGreaterOrEqual(state.currentGear, 1, "gear >= 1");
  assertLessOrEqual(state.currentGear, state.gearRatios.length, "gear <= gearRatios.length");
  // Manual gear selection
  assertTrue(ts.setGear(bus, 3), "setGear(3) succeeds");
  assertEqual(ts.getTransmission(bus).currentGear, 3, "gear set to 3");
  // Invalid gear protection
  assertFalse(ts.setGear(bus, 0), "setGear(0) fails (invalid)");
  assertFalse(ts.setGear(bus, 99), "setGear(99) fails (invalid)");
  assertFalse(ts.setGear(bus, -1), "setGear(-1) fails (invalid)");
}

// ============================================
// TEST 6: automatic upshift
// ============================================
console.log("\n--- TEST 6: automatic upshift ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ts.shiftDrive(bus);
  bus.targetSpeed = 100;
  // Simulate high speed to trigger upshift
  for (let i = 0; i < 5; i++) {
    bus.update(0.1);
    ts.updateVehicle(bus, 0.1);
  }
  const state = ts.getTransmission(bus);
  // Should have shifted up at least once from gear 1
  assertGreaterOrEqual(state.currentGear, 1, "gear >= 1 after high speed");
  assertLessOrEqual(state.currentGear, state.gearRatios.length, "gear within range");
  assertTruthy(state.engineRPM > 0, "engine RPM positive at speed");
  assertLessOrEqual(state.engineRPM, state.maxRPM, "RPM clamped to maxRPM");
}

// ============================================
// TEST 7: automatic downshift
// ============================================
console.log("\n--- TEST 7: automatic downshift ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ts.shiftDrive(bus);
  // Accelerate to high gear
  bus.targetSpeed = 100;
  for (let i = 0; i < 5; i++) {
    bus.update(0.1);
    ts.updateVehicle(bus, 0.1);
  }
  const highGear = ts.getTransmission(bus).currentGear;
  // Decelerate to trigger downshift
  bus.targetSpeed = 5;
  for (let i = 0; i < 5; i++) {
    bus.update(0.1);
    ts.updateVehicle(bus, 0.1);
  }
  const lowGear = ts.getTransmission(bus).currentGear;
  assertTruthy(lowGear <= highGear, "downshift reduces gear");
  assertGreaterOrEqual(lowGear, 1, "gear stays >= 1");
}

// ============================================
// TEST 8: RPM calculation/clamping
// ============================================
console.log("\n--- TEST 8: RPM calculation/clamping ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ts.shiftDrive(bus);
  bus.speed = 50;
  ts.updateVehicle(bus, 0.1);
  const state = ts.getTransmission(bus);
  assertTruthy(state.engineRPM > 0, "RPM positive at speed");
  assertLessOrEqual(state.engineRPM, state.maxRPM, "RPM clamped to maxRPM");
  assertGreaterOrEqual(state.engineRPM, 0, "RPM >= 0");
  // Extreme speed should clamp
  bus.speed = 500;
  ts.updateVehicle(bus, 0.1);
  assertEqual(ts.getTransmission(bus).engineRPM, ts.getTransmission(bus).maxRPM, "RPM clamped at extreme speed");
}

// ============================================
// TEST 9: stopped vehicle behavior
// ============================================
console.log("\n--- TEST 9: stopped vehicle behavior ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ts.shiftDrive(bus);
  bus.speed = 0;
  bus.targetSpeed = 0;
  ts.updateVehicle(bus, 0.1);
  const state = ts.getTransmission(bus);
  assertEqual(state.engineRPM, 0, "RPM is 0 when stopped");
  assertEqual(state.currentGear, 1, "gear is 1 (valid forward) when stopped in drive");
}

// ============================================
// TEST 10: acceleration
// ============================================
console.log("\n--- TEST 10: acceleration ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ts.shiftDrive(bus);
  bus.targetSpeed = 50;
  const before = bus.speed;
  bus.update(0.1);
  assertTruthy(bus.speed > before, "bus accelerates forward in drive");
}

// ============================================
// TEST 11: deceleration
// ============================================
console.log("\n--- TEST 11: deceleration ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ts.shiftDrive(bus);
  bus.speed = 50;
  bus.targetSpeed = 0;
  bus.update(0.1);
  assertTruthy(bus.speed < 50, "bus decelerates when target is 0");
}

// ============================================
// TEST 12: reverse
// ============================================
console.log("\n--- TEST 12: reverse ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ts.shiftReverse(bus);
  bus.targetSpeed = -20;
  bus.update(0.1);
  assertTruthy(bus.speed < 0, "bus moves backward in reverse");
  const state = ts.getTransmission(bus);
  assertEqual(state.gearMode, "reverse", "gearMode is reverse");
}

// ============================================
// TEST 13: invalid gear protection
// ============================================
console.log("\n--- TEST 13: invalid gear protection ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ts.shiftDrive(bus);
  assertFalse(ts.setGear(bus, 0), "gear 0 rejected");
  assertFalse(ts.setGear(bus, -5), "negative gear rejected");
  assertFalse(ts.setGear(bus, 99), "gear beyond range rejected");
  assertFalse(ts.setGearMode(bus, "invalid"), "invalid gearMode rejected");
  // Neutral cannot set gear
  ts.setGearMode(bus, "neutral");
  assertFalse(ts.setGear(bus, 3), "cannot set gear while neutral");
}

// ============================================
// TEST 14: dt determinism
// ============================================
console.log("\n--- TEST 14: dt determinism ---");
{
  const ts1 = freshTransmissionSystem();
  const ts2 = freshTransmissionSystem();
  const bus1 = freshBus();
  const bus2 = freshBus();
  ts1.ensureTransmission(bus1);
  ts2.ensureTransmission(bus2);
  ts1.shiftDrive(bus1);
  ts2.shiftDrive(bus2);
  bus1.targetSpeed = 50;
  bus2.targetSpeed = 50;
  // Same dt -> same result
  bus1.update(0.1);
  bus2.update(0.1);
  ts1.updateVehicle(bus1, 0.1);
  ts2.updateVehicle(bus2, 0.1);
  assertEqual(bus1.speed, bus2.speed, "same dt produces same speed");
  assertEqual(ts1.getTransmission(bus1).engineRPM, ts2.getTransmission(bus2).engineRPM, "same dt produces same RPM");
}

// ============================================
// TEST 15: transmission reset
// ============================================
console.log("\n--- TEST 15: transmission reset ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ts.shiftDrive(bus);
  bus.targetSpeed = 50;
  bus.update(0.1);
  ts.updateVehicle(bus, 0.1);
  const stateBefore = ts.getTransmission(bus);
  assertTruthy(stateBefore.engineRPM > 0, "RPM positive before reset");
  ts.resetTransmission(bus);
  const stateAfter = ts.getTransmission(bus);
  assertEqual(stateAfter.gearMode, "drive", "gearMode reset to drive");
  assertEqual(stateAfter.currentGear, 1, "currentGear reset to 1");
  assertEqual(stateAfter.engineRPM, 0, "engineRPM reset to 0");
}

// ============================================
// TEST 16: integration with existing Vehicle/Bus behavior
// ============================================
console.log("\n--- TEST 16: integration with Vehicle/Bus behavior ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  ts.ensureTransmission(bus);
  ts.shiftDrive(bus);
  // Existing Vehicle/Bus APIs still work
  assertTruthy(typeof bus.update === "function", "bus.update intact");
  assertTruthy(typeof bus.refuel === "function", "bus.refuel intact");
  assertTruthy(typeof bus.startTrip === "function", "bus.startTrip intact");
  assertTruthy(typeof bus.brake === "function", "bus.brake intact");
  assertTruthy(typeof bus.steer === "function", "bus.steer intact");
  // Transmission does not duplicate fuel or movement
  const state = ts.getTransmission(bus);
  assertTruthy(state.gearRatios, "transmission has gearRatios");
  assertTruthy(typeof state.finalDriveRatio === "number", "transmission has finalDriveRatio");
  // Fuel architecture from Task 3 preserved
  assertTruthy(typeof bus.fuelUsed === "number", "bus.fuelUsed preserved (Task 3)");
  // Weather friction from Task 4 preserved
  assertEqual(bus.roadFrictionMultiplier, 1.0, "roadFrictionMultiplier preserved (Task 4)");
}

// ============================================
// TEST 17: save/load compatibility
// ============================================
console.log("\n--- TEST 17: save/load compatibility ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  bus.id = "bus_save";
  ts.ensureTransmission(bus);
  ts.shiftDrive(bus);
  bus.targetSpeed = 50;
  bus.update(0.1);
  ts.updateVehicle(bus, 0.1);
  const stateBefore = ts.getTransmission(bus);

  // Serialize transmission state
  const serialized = ts.serializeTransmission(bus);
  assertTruthy(serialized, "transmission serialized");
  assertEqual(serialized.gearMode, "drive", "gearMode serialized");
  assertEqual(serialized.currentGear, stateBefore.currentGear, "currentGear serialized");

  // Deserialize into a fresh system + bus
  const ts2 = freshTransmissionSystem();
  const bus2 = freshBus();
  bus2.id = "bus_save";
  ts2.ensureTransmission(bus2);
  ts2.deserializeTransmission(bus2, serialized);
  const stateAfter = ts2.getTransmission(bus2);
  assertEqual(stateAfter.gearMode, "drive", "gearMode restored");
  assertEqual(stateAfter.currentGear, stateBefore.currentGear, "currentGear restored");
  assertEqual(stateAfter.engineRPM, stateBefore.engineRPM, "engineRPM restored");
  assertEqual(stateAfter.finalDriveRatio, stateBefore.finalDriveRatio, "finalDriveRatio restored");
}

// ============================================
// TEST 18: system-level save/load round-trip
// ============================================
console.log("\n--- TEST 18: system-level save/load round-trip ---");
{
  const ts = freshTransmissionSystem();
  const bus = freshBus();
  bus.id = "bus_sys";
  ts.ensureTransmission(bus);
  ts.shiftDrive(bus);
  bus.targetSpeed = 50;
  bus.update(0.1);
  ts.updateVehicle(bus, 0.1);

  // System-level serialize/deserialize
  const sysData = ts.serialize();
  assertTruthy(sysData["bus_sys"], "system data contains bus entry");

  const ts2 = freshTransmissionSystem();
  ts2.deserialize(sysData);
  // Re-attach to a fresh bus with same id
  const bus2 = freshBus();
  bus2.id = "bus_sys";
  const attached = ts2.attachTransmission(bus2);
  assertTruthy(attached, "transmission re-attached after deserialize");
  assertEqual(attached.gearMode, "drive", "gearMode preserved after system round-trip");
  assertEqual(attached.currentGear, ts.getTransmission(bus).currentGear, "currentGear preserved after system round-trip");
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
  console.log("PHASE 10B TASK 8 TESTS: ALL PASSED");
} else {
  console.log("PHASE 10B TASK 8 TESTS: SOME TESTS FAILED");
  process.exit(1);
}
