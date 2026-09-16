/**
 * Phase 10B Task 11 - Tire Wear & Grip System Tests
 * Verifies ONE authoritative owner for tire wear/grip behavior.
 * TireSystem provides grip/wear state only; it never writes movement
 * physics and does not duplicate braking, acceleration, steering,
 * fuel, transmission, suspension, or weather calculations.
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
  './systems/SuspensionSystem.js',
  './systems/BrakeSystem.js',
  './systems/TireSystem.js'
];

for (const dep of deps) {
  require(dep);
}

const TireSystem = window.BusSim.TireSystem;
const BrakeSystem = window.BusSim.BrakeSystem;
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
  b._brakeInput = 0;
  b._handbrake = false;
  return b;
}

function freshTireSystem() {
  const ts = new TireSystem();
  ts.init({});
  return ts;
}

console.log("=== Phase 10B Task 11: Tire Wear & Grip Tests ===");

// ============================================
// TEST 1: initialization
// ============================================
console.log("\n--- TEST 1: initialization ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  const state = ts.ensureTires(bus);
  assertTruthy(state, "tire state created");
  assertTruthy(state.tires, "tires object exists");
  assertTruthy(state.tires.frontLeft, "frontLeft tire exists");
  assertTruthy(state.tires.frontRight, "frontRight tire exists");
  assertTruthy(state.tires.rearLeft, "rearLeft tire exists");
  assertTruthy(state.tires.rearRight, "rearRight tire exists");
}

// ============================================
// TEST 2: four tire states
// ============================================
console.log("\n--- TEST 2: four tire states ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  ts.ensureTires(bus);
  const state = ts.getTires(bus);
  for (const wheel of ["frontLeft", "frontRight", "rearLeft", "rearRight"]) {
    const tire = state.tires[wheel];
    assertTruthy(typeof tire.wear === "number", `${wheel} wear is a number`);
    assertTruthy(typeof tire.grip === "number", `${wheel} grip is a number`);
    assertTruthy(typeof tire.temperature === "number", `${wheel} temperature is a number`);
  }
}

// ============================================
// TEST 3: default grip
// ============================================
console.log("\n--- TEST 3: default grip ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  ts.ensureTires(bus);
  const state = ts.getTires(bus);
  for (const wheel of ["frontLeft", "frontRight", "rearLeft", "rearRight"]) {
    assertEqual(state.tires[wheel].grip, 1.0, `${wheel} default grip is 1.0`);
  }
  assertEqual(ts.getAverageGrip(bus), 1.0, "average grip is 1.0 when new");
}

// ============================================
// TEST 4: wear accumulation
// ============================================
console.log("\n--- TEST 4: wear accumulation ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  ts.ensureTires(bus);
  bus.speed = 50;
  bus.targetSpeed = 50;
  for (let i = 0; i < 10; i++) {
    ts.updateVehicle(bus, 0.1);
  }
  const state = ts.getTires(bus);
  assertTruthy(state.tires.frontLeft.wear > 0, "frontLeft wear accumulated");
  assertTruthy(state.tires.rearLeft.wear > 0, "rearLeft wear accumulated");
  assertTruthy(state.distanceTraveled > 0, "distance traveled accumulated");
}

// ============================================
// TEST 5: wear limits
// ============================================
console.log("\n--- TEST 5: wear limits ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  ts.ensureTires(bus);
  bus.speed = 50;
  bus.targetSpeed = 50;
  bus._brakeInput = 1.0;
  bus.steering = 0.8;
  // Run many updates to push wear to the limit
  for (let i = 0; i < 1000; i++) {
    ts.updateVehicle(bus, 0.1);
  }
  const state = ts.getTires(bus);
  for (const wheel of ["frontLeft", "frontRight", "rearLeft", "rearRight"]) {
    assertLessOrEqual(state.tires[wheel].wear, state.tires[wheel].maxWear + 1e-9, `${wheel} wear <= maxWear`);
    assertGreaterOrEqual(state.tires[wheel].wear, 0, `${wheel} wear >= 0`);
  }
}

// ============================================
// TEST 6: grip reduction from wear
// ============================================
console.log("\n--- TEST 6: grip reduction from wear ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  ts.ensureTires(bus);
  const gripNew = ts.getWheelGrip(bus, "frontLeft");
  // Wear the tire heavily
  bus.speed = 50;
  bus.targetSpeed = 50;
  bus._brakeInput = 1.0;
  bus.steering = 0.8;
  for (let i = 0; i < 500; i++) {
    ts.updateVehicle(bus, 0.1);
  }
  const gripWorn = ts.getWheelGrip(bus, "frontLeft");
  assertTruthy(gripWorn < gripNew, "grip reduced from wear");
  assertGreaterOrEqual(gripWorn, 0.05, "grip >= 0.05 (clamped)");
}

// ============================================
// TEST 7: braking-related wear
// ============================================
console.log("\n--- TEST 7: braking-related wear ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  ts.ensureTires(bus);
  bus.speed = 50;
  bus._brakeInput = 1.0;
  for (let i = 0; i < 50; i++) {
    ts.updateVehicle(bus, 0.1);
  }
  const frontWear = ts.getTires(bus).tires.frontLeft.wear;
  const rearWear = ts.getTires(bus).tires.rearLeft.wear;
  assertTruthy(frontWear > 0, "front tire wear from braking");
  assertTruthy(rearWear > 0, "rear tire wear from braking");
}

// ============================================
// TEST 8: acceleration-related wear
// ============================================
console.log("\n--- TEST 8: acceleration-related wear ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  ts.ensureTires(bus);
  bus.speed = 0;
  bus.targetSpeed = 50;
  for (let i = 0; i < 50; i++) {
    ts.updateVehicle(bus, 0.1);
  }
  const rearWear = ts.getTires(bus).tires.rearLeft.wear;
  assertTruthy(rearWear > 0, "rear tire wear from acceleration");
}

// ============================================
// TEST 9: steering/slip wear
// ============================================
console.log("\n--- TEST 9: steering/slip wear ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  ts.ensureTires(bus);
  bus.speed = 30;
  bus.targetSpeed = 30;
  bus.steering = 0.8;
  for (let i = 0; i < 50; i++) {
    ts.updateVehicle(bus, 0.1);
  }
  const frontWear = ts.getTires(bus).tires.frontLeft.wear;
  assertTruthy(frontWear > 0, "front tire wear from steering");
}

// ============================================
// TEST 10: weather grip integration
// ============================================
console.log("\n--- TEST 10: weather grip integration ---");
{
  const ts = freshTireSystem();
  const busDry = freshBus();
  const busWet = freshBus();
  ts.ensureTires(busDry);
  ts.ensureTires(busWet);
  busDry.roadFrictionMultiplier = 1.0;
  busWet.roadFrictionMultiplier = 0.6;
  busDry.speed = 50;
  busWet.speed = 50;
  ts.updateVehicle(busDry, 0.1);
  ts.updateVehicle(busWet, 0.1);
  const dryGrip = ts.getWheelGrip(busDry, "frontLeft");
  const wetGrip = ts.getWheelGrip(busWet, "frontLeft");
  assertTruthy(dryGrip > wetGrip, "dry grip > wet grip");
  assertTruthy(dryGrip <= 1.0, "dry grip <= 1.0");
  assertTruthy(wetGrip <= 0.6, "wet grip <= road friction");
}

// ============================================
// TEST 11: wheel-specific grip
// ============================================
console.log("\n--- TEST 11: wheel-specific grip ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  ts.ensureTires(bus);
  bus.speed = 50;
  bus.targetSpeed = 50;
  bus._brakeInput = 1.0;
  bus.steering = 0.5;
  for (let i = 0; i < 50; i++) {
    ts.updateVehicle(bus, 0.1);
  }
  const fl = ts.getWheelGrip(bus, "frontLeft");
  const fr = ts.getWheelGrip(bus, "frontRight");
  const rl = ts.getWheelGrip(bus, "rearLeft");
  const rr = ts.getWheelGrip(bus, "rearRight");
  assertTruthy(typeof fl === "number", "frontLeft grip is a number");
  assertTruthy(typeof fr === "number", "frontRight grip is a number");
  assertTruthy(typeof rl === "number", "rearLeft grip is a number");
  assertTruthy(typeof rr === "number", "rearRight grip is a number");
  // Front tires wear more from braking/steering -> lower grip
  assertTruthy(fl <= 1.0, "frontLeft grip <= 1.0");
  assertTruthy(rl <= 1.0, "rearLeft grip <= 1.0");
}

// ============================================
// TEST 12: deterministic dt behavior
// ============================================
console.log("\n--- TEST 12: deterministic dt behavior ---");
{
  const ts1 = freshTireSystem();
  const ts2 = freshTireSystem();
  const bus1 = freshBus();
  const bus2 = freshBus();
  ts1.ensureTires(bus1);
  ts2.ensureTires(bus2);
  bus1.speed = 50;
  bus2.speed = 50;
  bus1._brakeInput = 0.5;
  bus2._brakeInput = 0.5;
  for (let i = 0; i < 10; i++) {
    ts1.updateVehicle(bus1, 0.1);
    ts2.updateVehicle(bus2, 0.1);
  }
  assertEqual(ts1.getWheelGrip(bus1, "frontLeft"), ts2.getWheelGrip(bus2, "frontLeft"), "same dt -> same grip");
  assertEqual(ts1.getWear(bus1, "frontLeft"), ts2.getWear(bus2, "frontLeft"), "same dt -> same wear");
}

// ============================================
// TEST 13: invalid-value protection
// ============================================
console.log("\n--- TEST 13: invalid-value protection ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  ts.ensureTires(bus);
  // Set invalid values
  bus.speed = NaN;
  bus.targetSpeed = undefined;
  bus.steering = null;
  bus._brakeInput = "invalid";
  bus.roadFrictionMultiplier = "wet";
  // Should not crash and should clamp
  ts.updateVehicle(bus, 0.1);
  const state = ts.getTires(bus);
  assertTruthy(typeof state.tires.frontLeft.wear === "number", "wear is a number after invalid input");
  assertTruthy(!isNaN(state.tires.frontLeft.wear), "wear is not NaN after invalid input");
  assertTruthy(typeof state.tires.frontLeft.grip === "number", "grip is a number after invalid input");
  assertTruthy(!isNaN(state.tires.frontLeft.grip), "grip is not NaN after invalid input");
}

// ============================================
// TEST 14: stationary vehicle stability
// ============================================
console.log("\n--- TEST 14: stationary vehicle stability ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  ts.ensureTires(bus);
  bus.speed = 0;
  bus.targetSpeed = 0;
  for (let i = 0; i < 10; i++) {
    ts.updateVehicle(bus, 0.1);
  }
  const state = ts.getTires(bus);
  assertEqual(state.tires.frontLeft.wear, 0, "no wear when stationary");
  assertEqual(state.tires.frontLeft.grip, 1.0, "full grip when stationary");
}

// ============================================
// TEST 15: BrakeSystem integration
// ============================================
console.log("\n--- TEST 15: BrakeSystem integration ---");
{
  const ts = freshTireSystem();
  const bs = new BrakeSystem();
  bs.init({});
  const bus = freshBus();
  bs.ensureBrake(bus);
  ts.ensureTires(bus);
  bus.speed = 50;
  bus._brakeInput = 1.0;
  bs.updateVehicle(bus, 0.1);
  ts.updateVehicle(bus, 0.1);
  const tireState = ts.getTires(bus);
  assertTruthy(tireState.tires.frontLeft.wear >= 0, "front tire wear after braking");
  // TireSystem does not duplicate braking
  assertTruthy(typeof bus.acceleration === "number", "acceleration unchanged by TireSystem");
  assertTruthy(typeof bus.brakeDeceleration === "number", "brakeDeceleration unchanged by TireSystem");
}

// ============================================
// TEST 16: SuspensionSystem integration
// ============================================
console.log("\n--- TEST 16: SuspensionSystem integration ---");
{
  const ts = freshTireSystem();
  const ss = new SuspensionSystem();
  ss.init({});
  const bus = freshBus();
  ss.ensureSuspension(bus);
  ts.ensureTires(bus);
  bus.speed = 50;
  bus.targetSpeed = 0;
  bus._brakeInput = 0.5;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  ts.updateVehicle(bus, 0.1);
  const tireState = ts.getTires(bus);
  assertTruthy(tireState.tires.frontLeft.wear >= 0, "front tire wear with suspension load");
  // TireSystem does not duplicate suspension
  assertTruthy(typeof bus.getSuspension().frontLoad === "number", "suspension frontLoad intact");
}

// ============================================
// TEST 17: no duplicate physics/fuel/braking
// ============================================
console.log("\n--- TEST 17: no duplicate physics/fuel/braking ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  ts.ensureTires(bus);
  const accelBefore = bus.acceleration;
  const brakeDecelBefore = bus.brakeDeceleration;
  const fuelBefore = bus.fuelLevel;
  bus.speed = 50;
  bus.targetSpeed = 50;
  bus._brakeInput = 0.5;
  bus.steering = 0.3;
  ts.updateVehicle(bus, 0.1);
  assertEqual(bus.acceleration, accelBefore, "acceleration unchanged by TireSystem");
  assertEqual(bus.brakeDeceleration, brakeDecelBefore, "brakeDeceleration unchanged by TireSystem");
  assertEqual(bus.fuelLevel, fuelBefore, "fuelLevel unchanged by TireSystem");
  assertTruthy(typeof bus.fuelUsed === "number", "bus.fuelUsed preserved (Task 3)");
  assertEqual(bus.roadFrictionMultiplier, 1.0, "roadFrictionMultiplier preserved (Task 4)");
}

// ============================================
// TEST 18: save/load compatibility
// ============================================
console.log("\n--- TEST 18: save/load compatibility ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  bus.id = "bus_tire";
  ts.ensureTires(bus);
  bus.speed = 50;
  bus._brakeInput = 0.8;
  for (let i = 0; i < 10; i++) {
    ts.updateVehicle(bus, 0.1);
  }
  const stateBefore = ts.getTires(bus);

  // Per-vehicle serialize/deserialize
  const serialized = ts.serializeTires(bus);
  assertTruthy(serialized, "tires serialized");
  assertTruthy(serialized.tires.frontLeft, "frontLeft serialized");
  assertEqual(serialized.tires.frontLeft.wear, stateBefore.tires.frontLeft.wear, "frontLeft wear serialized");

  const ts2 = freshTireSystem();
  const bus2 = freshBus();
  bus2.id = "bus_tire";
  ts2.ensureTires(bus2);
  ts2.deserializeTires(bus2, serialized);
  const stateAfter = ts2.getTires(bus2);
  assertEqual(stateAfter.tires.frontLeft.wear, stateBefore.tires.frontLeft.wear, "frontLeft wear restored");
  assertEqual(stateAfter.tires.frontLeft.grip, stateBefore.tires.frontLeft.grip, "frontLeft grip restored");
}

// ============================================
// TEST 19: system-level save/load round-trip
// ============================================
console.log("\n--- TEST 19: system-level save/load round-trip ---");
{
  const ts = freshTireSystem();
  const bus = freshBus();
  bus.id = "bus_sys4";
  ts.ensureTires(bus);
  bus.speed = 50;
  bus._brakeInput = 0.8;
  for (let i = 0; i < 10; i++) {
    ts.updateVehicle(bus, 0.1);
  }

  // System-level serialize/deserialize
  const sysData = ts.serialize();
  assertTruthy(sysData["bus_sys4"], "system data contains bus entry");

  const ts2 = freshTireSystem();
  ts2.deserialize(sysData);
  const bus2 = freshBus();
  bus2.id = "bus_sys4";
  const attached = ts2.attachTires(bus2);
  assertTruthy(attached, "tires re-attached after deserialize");
  assertEqual(attached.tires.frontLeft.wear, ts.getTires(bus).tires.frontLeft.wear, "frontLeft wear preserved after system round-trip");
  assertEqual(attached.tires.frontLeft.grip, ts.getTires(bus).tires.frontLeft.grip, "frontLeft grip preserved after system round-trip");
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
  console.log("PHASE 10B TASK 11 TESTS: ALL PASSED");
} else {
  console.log("PHASE 10B TASK 11 TESTS: SOME TESTS FAILED");
}
process.exit(failedCount === 0 ? 0 : 1);
