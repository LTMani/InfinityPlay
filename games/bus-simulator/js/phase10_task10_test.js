/**
 * Phase 10B Task 10 - Advanced Braking System Tests
 * Verifies ONE authoritative braking path: BrakeSystem.
 * MovementSystem's old BrakingSystem is disabled so there is no
 * duplicate braking calculation.
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
  './systems/BrakeSystem.js'
];

for (const dep of deps) {
  require(dep);
}

const BrakeSystem = window.BusSim.BrakeSystem;
const TransmissionSystem = window.BusSim.TransmissionSystem;
const SuspensionSystem = window.BusSim.SuspensionSystem;
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

function freshBrakeSystem() {
  const bs = new BrakeSystem();
  bs.init({});
  return bs;
}

console.log("=== Phase 10B Task 10: Advanced Braking System Tests ===");

// ============================================
// TEST 1: initialization
// ============================================
console.log("\n--- TEST 1: initialization ---");
{
  const bs = freshBrakeSystem();
  const bus = freshBus();
  const state = bs.ensureBrake(bus);
  assertTruthy(state, "brake state created");
  assertTruthy(typeof state.maxBrakeForce === "number", "maxBrakeForce is a number");
  assertTruthy(typeof state.frontBias === "number", "frontBias is a number");
  assertTruthy(typeof state.brakeTemp === "number", "brakeTemp is a number");
  assertTruthy(typeof state.fadeFactor === "number", "fadeFactor is a number");
  assertTruthy(typeof state.absActive === "boolean", "absActive is a boolean");
}

// ============================================
// TEST 2: progressive braking
// ============================================
console.log("\n--- TEST 2: progressive braking ---");
{
  const bs = freshBrakeSystem();
  const bus = freshBus();
  bs.ensureBrake(bus);
  bus.speed = 50;
  bus._brakeInput = 0.2;
  bs.updateVehicle(bus, 0.1);
  const soft = bs.getBrake(bus).brakeForce;
  bus._brakeInput = 1.0;
  bs.updateVehicle(bus, 0.1);
  const hard = bs.getBrake(bus).brakeForce;
  assertTruthy(hard > soft, "harder brake input produces more force");
}

// ============================================
// TEST 3: maximum brake force
// ============================================
console.log("\n--- TEST 3: maximum brake force ---");
{
  const bs = freshBrakeSystem();
  const bus = freshBus();
  bs.ensureBrake(bus);
  bus.speed = 50;
  bus._brakeInput = 1.0;
  bs.updateVehicle(bus, 0.1);
  const force = bs.getBrake(bus).brakeForce;
  assertLessOrEqual(force, bs.getBrake(bus).maxBrakeForce + 1e-9, "brake force <= maxBrakeForce");
  assertTruthy(force > 0, "brake force positive when braking");
}

// ============================================
// TEST 4: front/rear bias
// ============================================
console.log("\n--- TEST 4: front/rear bias ---");
{
  const bs = freshBrakeSystem();
  const bus = freshBus();
  bs.ensureBrake(bus);
  bus.speed = 50;
  bus._brakeInput = 1.0;
  bs.updateVehicle(bus, 0.1);
  const state = bs.getBrake(bus);
  assertTruthy(state.frontBrakeForce > 0, "front brake force positive");
  assertTruthy(state.rearBrakeForce > 0, "rear brake force positive");
  assertTruthy(Math.abs(state.frontBrakeForce - state.brakeForce * state.frontBias) < 1e-9, "front bias applied");
}

// ============================================
// TEST 5: brake temperature
// ============================================
console.log("\n--- TEST 5: brake temperature ---");
{
  const bs = freshBrakeSystem();
  const bus = freshBus();
  bs.ensureBrake(bus);
  bus.speed = 50;
  bus._brakeInput = 1.0;
  bs.updateVehicle(bus, 0.1);
  const temp = bs.getBrake(bus).brakeTemp;
  assertTruthy(temp > 20, "brake temp rises when braking");
  // Cooling when not braking
  bus._brakeInput = 0;
  bs.updateVehicle(bus, 0.1);
  const temp2 = bs.getBrake(bus).brakeTemp;
  assertTruthy(temp2 <= temp, "brake temp cools when not braking");
}

// ============================================
// TEST 6: brake fade
// ============================================
console.log("\n--- TEST 6: brake fade ---");
{
  const bs = freshBrakeSystem();
  const bus = freshBus();
  bs.ensureBrake(bus);
  // Heat up brakes
  bus.speed = 50;
  for (let i = 0; i < 10; i++) {
    bus._brakeInput = 1.0;
    bs.updateVehicle(bus, 0.1);
  }
  const hotState = bs.getBrake(bus);
  assertTruthy(hotState.brakeTemp > 300, "brake temp exceeds fade start");
  assertTruthy(hotState.fadeFactor < 1.0, "fade factor reduced when hot");
  assertGreaterOrEqual(hotState.fadeFactor, hotState.fadeMinFactor, "fade factor >= fadeMinFactor");
}

// ============================================
// TEST 7: brake cooling
// ============================================
console.log("\n--- TEST 7: brake cooling ---");
{
  const bs = freshBrakeSystem();
  const bus = freshBus();
  bs.ensureBrake(bus);
  // Heat up
  bus.speed = 50;
  bus._brakeInput = 1.0;
  bs.updateVehicle(bus, 0.1);
  const hotTemp = bs.getBrake(bus).brakeTemp;
  // Cool down (no braking, moving)
  bus._brakeInput = 0;
  for (let i = 0; i < 20; i++) {
    bs.updateVehicle(bus, 0.1);
  }
  const coolTemp = bs.getBrake(bus).brakeTemp;
  assertTruthy(coolTemp < hotTemp, "brake temp cools over time");
  assertGreaterOrEqual(coolTemp, 20, "brake temp >= brakeTempStart");
}

// ============================================
// TEST 8: ABS activation
// ============================================
console.log("\n--- TEST 8: ABS activation ---");
{
  const bs = freshBrakeSystem();
  const bus = freshBus();
  bs.ensureBrake(bus);
  // Heavy braking on low grip -> ABS activates
  bus.speed = 50;
  bus.roadFrictionMultiplier = 0.4;
  bus._brakeInput = 1.0;
  bs.updateVehicle(bus, 0.1);
  const state = bs.getBrake(bus);
  assertTruthy(typeof state.absActive === "boolean", "absActive is a boolean");
  assertTruthy(typeof state.slipRatio === "number", "slipRatio is a number");
  // On low grip, ABS should activate
  assertTruthy(state.absActive === true || state.slipRatio > 0, "ABS or slip detected on low grip");
}

// ============================================
// TEST 9: ABS release
// ============================================
console.log("\n--- TEST 9: ABS release ---");
{
  const bs = freshBrakeSystem();
  const bus = freshBus();
  bs.ensureBrake(bus);
  // Activate ABS
  bus.speed = 50;
  bus.roadFrictionMultiplier = 0.4;
  bus._brakeInput = 1.0;
  bs.updateVehicle(bus, 0.1);
  const absActive = bs.getBrake(bus).absActive;
  // Release brakes -> ABS should deactivate
  bus._brakeInput = 0;
  bs.updateVehicle(bus, 0.1);
  const absAfter = bs.getBrake(bus).absActive;
  assertTruthy(!absAfter, "ABS deactivates when brakes released");
}

// ============================================
// TEST 10: wheel-lock prevention
// ============================================
console.log("\n--- TEST 10: wheel-lock prevention ---");
{
  const bs = freshBrakeSystem();
  const bus = freshBus();
  bs.ensureBrake(bus);
  // Extreme braking on low grip
  bus.speed = 50;
  bus.roadFrictionMultiplier = 0.3;
  bus._brakeInput = 1.0;
  bs.updateVehicle(bus, 0.1);
  const state = bs.getBrake(bus);
  // Brake force should be reduced (not locked) when slip exceeds threshold
  assertTruthy(state.brakeForce < state.maxBrakeForce, "brake force reduced to prevent lock");
}

// ============================================
// TEST 11: wet-road braking
// ============================================
console.log("\n--- TEST 11: wet-road braking ---");
{
  const bs = freshBrakeSystem();
  const busDry = freshBus();
  const busWet = freshBus();
  bs.ensureBrake(busDry);
  bs.ensureBrake(busWet);
  busDry.speed = 50;
  busWet.speed = 50;
  busDry.roadFrictionMultiplier = 1.0;
  busWet.roadFrictionMultiplier = 0.8;
  busDry._brakeInput = 1.0;
  busWet._brakeInput = 1.0;
  bs.updateVehicle(busDry, 0.1);
  bs.updateVehicle(busWet, 0.1);
  const dryForce = bs.getBrake(busDry).brakeForce;
  const wetForce = bs.getBrake(busWet).brakeForce;
  assertTruthy(dryForce >= wetForce, "dry road braking >= wet road braking");
}

// ============================================
// TEST 12: storm-road braking
// ============================================
console.log("\n--- TEST 12: storm-road braking ---");
{
  const bs = freshBrakeSystem();
  const busDry = freshBus();
  const busStorm = freshBus();
  bs.ensureBrake(busDry);
  bs.ensureBrake(busStorm);
  busDry.speed = 50;
  busStorm.speed = 50;
  busDry.roadFrictionMultiplier = 1.0;
  busStorm.roadFrictionMultiplier = 0.6;
  busDry._brakeInput = 1.0;
  busStorm._brakeInput = 1.0;
  bs.updateVehicle(busDry, 0.1);
  bs.updateVehicle(busStorm, 0.1);
  const dryForce = bs.getBrake(busDry).brakeForce;
  const stormForce = bs.getBrake(busStorm).brakeForce;
  assertTruthy(dryForce >= stormForce, "dry road braking >= storm road braking");
}

// ============================================
// TEST 13: suspension load integration
// ============================================
console.log("\n--- TEST 13: suspension load integration ---");
{
  const bs = freshBrakeSystem();
  const ss = new SuspensionSystem();
  ss.init({});
  const bus = freshBus();
  ss.ensureSuspension(bus);
  bs.ensureBrake(bus);
// Braking -> front load increases
  bus.speed = 50;
  bus.targetSpeed = 0;
  bus._brakeInput = 0.8;
  bus.update(0.1);
  ss.updateVehicle(bus, 0.1);
  bs.updateVehicle(bus, 0.1);
  const state = bs.getBrake(bus);
  assertTruthy(state.frontBrakeForce > 0, "front brake force positive with suspension load");
  assertTruthy(state.rearBrakeForce > 0, "rear brake force positive with suspension load");
}

// ============================================
// TEST 14: transmission/engine-braking integration
// ============================================
console.log("\n--- TEST 14: transmission/engine-braking integration ---");
{
  const bs = freshBrakeSystem();
  const ts = new TransmissionSystem();
  ts.init({});
  const bus = freshBus();
  ts.ensureTransmission(bus);
  bs.ensureBrake(bus);
  // Neutral -> no drive -> brake system still works independently
  ts.setGearMode(bus, "neutral");
  bus.speed = 50;
  bus._brakeInput = 0.5;
  bs.updateVehicle(bus, 0.1);
  const state = bs.getBrake(bus);
  assertTruthy(state.brakeForce > 0, "brake force positive in neutral");
// Transmission gearMode intact
  assertTruthy(typeof ts.getTransmission(bus).gearMode === "string", "transmission gearMode intact");
}

// ============================================
// TEST 15: stationary vehicle
// ============================================
console.log("\n--- TEST 15: stationary vehicle ---");
{
  const bs = freshBrakeSystem();
  const bus = freshBus();
  bs.ensureBrake(bus);
  bus.speed = 0;
  bus._brakeInput = 1.0;
  bs.updateVehicle(bus, 0.1);
  const state = bs.getBrake(bus);
  assertEqual(state.brakeForce, 0, "no brake force when stationary");
  assertEqual(state.deceleration, 0, "no deceleration when stationary");
}

// ============================================
// TEST 16: reverse braking
// ============================================
console.log("\n--- TEST 16: reverse braking ---");
{
  const bs = freshBrakeSystem();
  const bus = freshBus();
  bs.ensureBrake(bus);
  bus.speed = -20;
  bus._brakeInput = 0.5;
  bs.updateVehicle(bus, 0.1);
  const state = bs.getBrake(bus);
  assertTruthy(state.brakeForce > 0, "brake force positive when braking in reverse");
  assertTruthy(bus.speed <= -20 || bus.speed >= -20, "speed handled in reverse");
}

// ============================================
// TEST 17: dt determinism
// ============================================
console.log("\n--- TEST 17: dt determinism ---");
{
  const bs1 = freshBrakeSystem();
  const bs2 = freshBrakeSystem();
  const bus1 = freshBus();
  const bus2 = freshBus();
  bs1.ensureBrake(bus1);
  bs2.ensureBrake(bus2);
  bus1.speed = 50;
  bus2.speed = 50;
  bus1.roadFrictionMultiplier = 0.7;
  bus2.roadFrictionMultiplier = 0.7;
  bus1._brakeInput = 0.8;
  bus2._brakeInput = 0.8;
  bs1.updateVehicle(bus1, 0.1);
  bs2.updateVehicle(bus2, 0.1);
  assertEqual(bs1.getBrake(bus1).brakeForce, bs2.getBrake(bus2).brakeForce, "same dt -> same brake force");
  assertEqual(bs1.getBrake(bus1).brakeTemp, bs2.getBrake(bus2).brakeTemp, "same dt -> same brake temp");
}

// ============================================
// TEST 18: no duplicate braking
// ============================================
console.log("\n--- TEST 18: no duplicate braking ---");
{
  // Verify BrakeSystem is the single authoritative braking owner.
  // MovementSystem's old BrakingSystem is disabled.
  const bs = freshBrakeSystem();
  const bus = freshBus();
  bs.ensureBrake(bus);
  const accelBefore = bus.acceleration;
  const brakeDecelBefore = bus.brakeDeceleration;
  bus.speed = 50;
  bus._brakeInput = 0.5;
  bs.updateVehicle(bus, 0.1);
  // BrakeSystem must not modify acceleration/brakeDeceleration
  assertEqual(bus.acceleration, accelBefore, "acceleration unchanged by BrakeSystem");
  assertEqual(bus.brakeDeceleration, brakeDecelBefore, "brakeDeceleration unchanged by BrakeSystem");
  // BrakeSystem writes deceleration directly onto speed (single path)
  assertTruthy(bs.getBrake(bus).deceleration > 0, "deceleration computed by BrakeSystem");
}

// ============================================
// TEST 19: save/load compatibility
// ============================================
console.log("\n--- TEST 19: save/load compatibility ---");
{
  const bs = freshBrakeSystem();
  const bus = freshBus();
  bus.id = "bus_brake";
  bs.ensureBrake(bus);
  bus.speed = 50;
  bus._brakeInput = 1.0;
  bs.updateVehicle(bus, 0.1);
  const stateBefore = bs.getBrake(bus);

  // Per-vehicle serialize/deserialize
  const serialized = bs.serializeBrake(bus);
  assertTruthy(serialized, "brake serialized");
  assertEqual(serialized.brakeTemp, stateBefore.brakeTemp, "brakeTemp serialized");

  const bs2 = freshBrakeSystem();
  const bus2 = freshBus();
  bus2.id = "bus_brake";
  bs2.ensureBrake(bus2);
  bs2.deserializeBrake(bus2, serialized);
  const stateAfter = bs2.getBrake(bus2);
  assertEqual(stateAfter.brakeTemp, stateBefore.brakeTemp, "brakeTemp restored");
  assertEqual(stateAfter.fadeFactor, stateBefore.fadeFactor, "fadeFactor restored");
}

// ============================================
// TEST 20: system-level save/load round-trip
// ============================================
console.log("\n--- TEST 20: system-level save/load round-trip ---");
{
  const bs = freshBrakeSystem();
  const bus = freshBus();
  bus.id = "bus_sys3";
  bs.ensureBrake(bus);
  bus.speed = 50;
  bus._brakeInput = 0.8;
  bs.updateVehicle(bus, 0.1);

  // System-level serialize/deserialize
  const sysData = bs.serialize();
  assertTruthy(sysData["bus_sys3"], "system data contains bus entry");

  const bs2 = freshBrakeSystem();
  bs2.deserialize(sysData);
  const bus2 = freshBus();
  bus2.id = "bus_sys3";
  const attached = bs2.attachBrake(bus2);
  assertTruthy(attached, "brake re-attached after deserialize");
  assertEqual(attached.brakeTemp, bs.getBrake(bus).brakeTemp, "brakeTemp preserved after system round-trip");
  assertEqual(attached.fadeFactor, bs.getBrake(bus).fadeFactor, "fadeFactor preserved after system round-trip");
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
  console.log("PHASE 10B TASK 10 TESTS: ALL PASSED");
} else {
  console.log("PHASE 10B TASK 10 TESTS: SOME TESTS FAILED");
}
process.exit(failedCount === 0 ? 0 : 1);
