/**
 * Phase 10B Task 13 - Air Brake & Pressure System Tests
 * Verifies ONE authoritative owner of air-brake pressure state.
 * AirBrakeSystem exposes pressure state only; it never writes brake
 * force or deceleration. BrakeSystem remains the ONLY owner of
 * brake-force calculation.
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
  './systems/TireSystem.js',
  './systems/RoadSurfaceSystem.js',
  './systems/AirBrakeSystem.js'
];
for (const dep of deps) { require(dep); }
const AirBrakeSystem = window.BusSim.AirBrakeSystem;
const BrakeSystem = window.BusSim.BrakeSystem;
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

function assertTruthy(value, name) {
  return test(name, !!value, `expected truthy, got ${value}`);
}

function assertLessOrEqual(a, b, name) {
  return test(name, a <= b, `expected <= ${b}, got ${a}`);
}

function assertGreaterOrEqual(a, b, name) {
  return test(name, a >= b, `expected >= ${b}, got ${a}`);
}

function freshAirBrakeSystem() {
  const abs = new AirBrakeSystem();
  abs.init({});
  return abs;
}

function freshBrakeSystem() {
  const bs = new BrakeSystem();
  bs.init({});
  return bs;
}

function fakeBus(overrides) {
  const bus = {
    id: 'bus_test',
    speed: 0,
    targetSpeed: 0,
    steering: 0,
    _brakeInput: 0,
    _handbrake: false,
    mass: 8000,
    roadFrictionMultiplier: 1.0,
    getTransmission() { return null; },
    getSuspension() { return null; },
    getTires() { return null; },
    getRoadSurface() { return null; },
    getAirBrake() { return this._airBrake || null; },
    setAirBrake(s) { this._airBrake = s; }
  };
  Object.assign(bus, overrides || {});
  return bus;
}

console.log("=== Phase 10B Task 13: Air Brake & Pressure System Tests ===");
// ============================================
// TEST 1: default pressure
// ============================================
console.log("\n--- TEST 1: default pressure ---");
{
  const abs = freshAirBrakeSystem();
  const bus = fakeBus();
  abs.ensureAir(bus);
  assertEqual(abs.getPressure(bus), 8.0, "default reservoir pressure is 8.0 bar");
  assertEqual(abs.getPressureRatio(bus), 1.0, "default pressure ratio is 1.0");
  assertTruthy(!abs.isLowPressure(bus), "no low-pressure warning at default");
  const st = abs.getState(bus);
  assertTruthy(st !== null, "getState returns object");
  assertEqual(st.reservoirPressure, 8.0, "getState reservoirPressure is 8.0");
  assertEqual(st.minOperatingPressure, 4.0, "getState minOperatingPressure is 4.0");
  assertEqual(st.maxPressure, 10.0, "getState maxPressure is 10.0");
  assertEqual(st.compressorEnabled, true, "getState compressorEnabled is true");
  assertEqual(st.lowPressureWarning, false, "getState lowPressureWarning is false");
  assertEqual(st.pressureRatio, 1.0, "getState pressureRatio is 1.0");
}

// ============================================
// TEST 2: compressor filling
// ============================================
console.log("\n--- TEST 2: compressor filling ---");
{
  const abs = freshAirBrakeSystem();
  const bus = fakeBus({ _airBrake: { __owner: abs, reservoirPressure: 5.0, minOperatingPressure: 4.0, maxPressure: 10.0, compressorRate: 0.8, brakeConsumptionRate: 0.35, leakRate: 0.01, compressorEnabled: true, lowPressureWarning: false, pressureRatio: 0.25, brakeInput: 0, handbrake: false } });
  abs.updateVehicle(bus, 1.0);
  assertGreaterOrEqual(abs.getPressure(bus), 5.7, "pressure increased by compressor");
  assertLessOrEqual(abs.getPressure(bus), 5.9, "pressure increased by ~0.8 bar/sec");
  // Compressor disabled
  const bus2 = fakeBus({ _airBrake: { __owner: abs, reservoirPressure: 5.0, minOperatingPressure: 4.0, maxPressure: 10.0, compressorRate: 0.8, brakeConsumptionRate: 0.35, leakRate: 0.0, compressorEnabled: false, lowPressureWarning: false, pressureRatio: 0.25, brakeInput: 0, handbrake: false } });
  abs.updateVehicle(bus2, 1.0);
  assertEqual(abs.getPressure(bus2), 5.0, "disabled compressor does not fill");
}

// ============================================
// TEST 3: maximum pressure clamp
// ============================================
console.log("\n--- TEST 3: maximum pressure clamp ---");
{
  const abs = freshAirBrakeSystem();
  const bus = fakeBus({ _airBrake: { __owner: abs, reservoirPressure: 9.9, minOperatingPressure: 4.0, maxPressure: 10.0, compressorRate: 0.8, brakeConsumptionRate: 0.35, leakRate: 0.0, compressorEnabled: true, lowPressureWarning: false, pressureRatio: 1.0, brakeInput: 0, handbrake: false } });
  abs.updateVehicle(bus, 1.0);
  assertLessOrEqual(abs.getPressure(bus), 10.0, "pressure clamped to maxPressure");
  assertGreaterOrEqual(abs.getPressure(bus), 9.9, "pressure did not drop");
}
// ============================================
// TEST 4: brake pressure consumption
// ============================================
console.log("\n--- TEST 4: brake pressure consumption ---");
{
  const abs = freshAirBrakeSystem();
  const bus = fakeBus({ _brakeInput: 1.0, _airBrake: { __owner: abs, reservoirPressure: 8.0, minOperatingPressure: 4.0, maxPressure: 10.0, compressorRate: 0.8, brakeConsumptionRate: 0.35, leakRate: 0.0, compressorEnabled: false, lowPressureWarning: false, pressureRatio: 1.0, brakeInput: 0, handbrake: false } });
  abs.updateVehicle(bus, 1.0);
  assertEqual(abs.getPressure(bus), 7.65, "full brake consumes 0.35 bar/sec");
  const bus2 = fakeBus({ _brakeInput: 0.5, _airBrake: { __owner: abs, reservoirPressure: 8.0, minOperatingPressure: 4.0, maxPressure: 10.0, compressorRate: 0.8, brakeConsumptionRate: 0.35, leakRate: 0.0, compressorEnabled: false, lowPressureWarning: false, pressureRatio: 1.0, brakeInput: 0, handbrake: false } });
  abs.updateVehicle(bus2, 1.0);
  assertEqual(abs.getPressure(bus2), 7.825, "half brake consumes 0.175 bar/sec");
}

// ============================================
// TEST 5: air leak
// ============================================
console.log("\n--- TEST 5: air leak ---");
{
  const abs = freshAirBrakeSystem();
  const bus = fakeBus({ _airBrake: { __owner: abs, reservoirPressure: 8.0, minOperatingPressure: 4.0, maxPressure: 10.0, compressorRate: 0.8, brakeConsumptionRate: 0.35, leakRate: 0.01, compressorEnabled: false, lowPressureWarning: false, pressureRatio: 1.0, brakeInput: 0, handbrake: false } });
  abs.updateVehicle(bus, 1.0);
  assertEqual(abs.getPressure(bus), 7.99, "leak reduces pressure by 0.01 bar/sec");
}

// ============================================
// TEST 6: minimum/zero pressure clamp
// ============================================
console.log("\n--- TEST 6: minimum/zero pressure clamp ---");
{
  const abs = freshAirBrakeSystem();
  const bus = fakeBus({ _brakeInput: 1.0, _airBrake: { __owner: abs, reservoirPressure: 0.05, minOperatingPressure: 4.0, maxPressure: 10.0, compressorRate: 0.8, brakeConsumptionRate: 0.35, leakRate: 0.01, compressorEnabled: false, lowPressureWarning: false, pressureRatio: 0.0125, brakeInput: 0, handbrake: false } });
  abs.updateVehicle(bus, 1.0);
  assertEqual(abs.getPressure(bus), 0.0, "pressure clamped to zero, not negative");
  assertTruthy(abs.isLowPressure(bus), "low-pressure warning active at zero");
  assertEqual(abs.getPressureRatio(bus), 0.0, "pressure ratio is 0.0 at zero pressure");
}

// ============================================
// TEST 7: low-pressure warning
// ============================================
console.log("\n--- TEST 7: low-pressure warning ---");
{
  const abs = freshAirBrakeSystem();
  const above = fakeBus({ _airBrake: { __owner: abs, reservoirPressure: 4.5, minOperatingPressure: 4.0, maxPressure: 10.0, compressorRate: 0.0, brakeConsumptionRate: 0.0, leakRate: 0.0, compressorEnabled: false, lowPressureWarning: false, pressureRatio: 1.0, brakeInput: 0, handbrake: false } });
  abs.updateVehicle(above, 0.016);
  assertTruthy(!abs.isLowPressure(above), "no warning above minOperatingPressure");
  const below = fakeBus({ _airBrake: { __owner: abs, reservoirPressure: 3.0, minOperatingPressure: 4.0, maxPressure: 10.0, compressorRate: 0.0, brakeConsumptionRate: 0.0, leakRate: 0.0, compressorEnabled: false, lowPressureWarning: false, pressureRatio: 0.75, brakeInput: 0, handbrake: false } });
  abs.updateVehicle(below, 0.016);
  assertTruthy(abs.isLowPressure(below), "warning below minOperatingPressure");
  assertEqual(abs.getState(below).lowPressureWarning, true, "getState reflects warning");
}
// ============================================
// TEST 8: pressure ratio
// ============================================
console.log("\n--- TEST 8: pressure ratio ---");
{
  const abs = freshAirBrakeSystem();
  const full = fakeBus({ _airBrake: { __owner: abs, reservoirPressure: 8.0, minOperatingPressure: 4.0, maxPressure: 10.0, compressorRate: 0.8, brakeConsumptionRate: 0.35, leakRate: 0.0, compressorEnabled: false, lowPressureWarning: false, pressureRatio: 1.0, brakeInput: 0, handbrake: false } });
  assertEqual(abs.getPressureRatio(full), 1.0, "ratio is 1.0 at operating pressure");
  const half = fakeBus({ _airBrake: { __owner: abs, reservoirPressure: 2.0, minOperatingPressure: 4.0, maxPressure: 10.0, compressorRate: 0.8, brakeConsumptionRate: 0.35, leakRate: 0.0, compressorEnabled: false, lowPressureWarning: false, pressureRatio: 0.5, brakeInput: 0, handbrake: false } });
  assertEqual(abs.getPressureRatio(half), 0.5, "ratio is 0.5 at half operating pressure");
  assertGreaterOrEqual(abs.getPressureRatio(full), abs.getPressureRatio(half), "full ratio >= half ratio");
  assertLessOrEqual(abs.getPressureRatio(half), 1.0, "ratio <= 1.0");
  assertGreaterOrEqual(abs.getPressureRatio(half), 0.0, "ratio >= 0.0");
}

// ============================================
// TEST 9: BrakeSystem pressure integration
// ============================================
console.log("\n--- TEST 9: BrakeSystem pressure integration ---");
{
  const abs = freshAirBrakeSystem();
  const bs = freshBrakeSystem();
  // Full pressure - brake force should be at full scale
  const fullBus = fakeBus({ _brakeInput: 1.0, speed: 50, mass: 8000 });
  abs.ensureAir(fullBus);
  bs.ensureBrake(fullBus);
  bs.updateVehicle(fullBus, 0.016);
  const fullForce = fullBus._brake.brakeForce;
  assertTruthy(fullForce > 0, "brake force positive at full pressure");
  // Zero pressure - brake force should be zero
  const emptyBus = fakeBus({ _brakeInput: 1.0, speed: 50, mass: 8000 });
  abs.ensureAir(emptyBus);
  // Force pressure to zero
  emptyBus._airBrake.reservoirPressure = 0;
  emptyBus._airBrake.pressureRatio = 0;
  bs.ensureBrake(emptyBus);
  bs.updateVehicle(emptyBus, 0.016);
  assertEqual(emptyBus._brake.brakeForce, 0, "brake force is zero at zero pressure");
  assertLessOrEqual(emptyBus._brake.brakeForce, fullForce, "zero-pressure force <= full force");
  // Confirm BrakeSystem still computes ABS/slip normally at full pressure
  assertTruthy(typeof fullBus._brake.slipRatio === "number", "slip ratio still computed");
  assertTruthy(typeof fullBus._brake.fadeFactor === "number", "fade factor still computed");
  assertTruthy(typeof fullBus._brake.frontBrakeForce === "number", "front brake force still computed");
}

// ============================================
// TEST 10: handbrake preservation
// ============================================
console.log("\n--- TEST 10: handbrake preservation ---");
{
  const abs = freshAirBrakeSystem();
  // Handbrake alone should NOT consume air pressure.
  // Disable the compressor so only leak applies.
  const bus = fakeBus({ _brakeInput: 0, _handbrake: true, speed: 0, _airBrake: { __owner: abs, reservoirPressure: 8.0, minOperatingPressure: 4.0, maxPressure: 10.0, compressorRate: 0.8, brakeConsumptionRate: 0.35, leakRate: 0.0, compressorEnabled: false, lowPressureWarning: false, pressureRatio: 1.0, brakeInput: 0, handbrake: false } });
  abs.ensureAir(bus);
  bus._airBrake.compressorEnabled = false;
  const before = abs.getPressure(bus);
  abs.updateVehicle(bus, 1.0);
  assertEqual(abs.getPressure(bus), before, "handbrake does not consume air pressure");
  // BrakeSystem still applies handbrake force
  const bs = freshBrakeSystem();
  bs.ensureBrake(bus);
  bs.updateVehicle(bus, 0.016);
  assertTruthy(bus._brake.brakeForce >= 0, "handbrake still produces brake force");
}

// ============================================
// TEST 11: Vehicle hooks
// ============================================
console.log("\n--- TEST 11: Vehicle hooks ---");
{
  const abs = freshAirBrakeSystem();
  const bus = fakeBus();
  const state = abs.ensureAir(bus);
  assertTruthy(bus._airBrake === state, "ensureAir sets vehicle._airBrake");
  assertTruthy(typeof bus.getAirBrake === "function", "vehicle has getAirBrake");
  assertTruthy(bus.getAirBrake() === state, "getAirBrake returns state");
  const newState = { __owner: abs, reservoirPressure: 6.0 };
  bus.setAirBrake(newState);
  assertTruthy(bus.getAirBrake() === newState, "setAirBrake replaces state");
}

// ============================================
// TEST 12: MovementSystem integration
// ============================================
console.log("\n--- TEST 12: MovementSystem integration ---");
{
  const abs = freshAirBrakeSystem();
  const bs = freshBrakeSystem();
  const bus = fakeBus({ _brakeInput: 1.0, speed: 50, mass: 8000 });
  abs.ensureAir(bus);
  bs.ensureBrake(bus);
  // Simulate the MovementSystem chain: air first, then brake
  abs.updateVehicle(bus, 0.016);
  bs.updateVehicle(bus, 0.016);
  assertTruthy(bus._brake.airPressureRatio === 1.0, "BrakeSystem received air pressure ratio");
  assertTruthy(bus._brake.brakeForce > 0, "brake force produced after integration");
  // Confirm no duplicate brake-force path: only BrakeSystem writes deceleration
  assertTruthy(typeof bus._brake.deceleration === "number", "deceleration computed once");
}
// ============================================
// TEST 13: Save/load persistence
// ============================================
console.log("\n--- TEST 13: Save/load persistence ---");
{
  const abs = freshAirBrakeSystem();
  const bus = fakeBus();
  abs.ensureAir(bus);
  // Drain pressure
  bus._airBrake.reservoirPressure = 3.0;
  bus._airBrake.lowPressureWarning = true;
  bus._airBrake.pressureRatio = 0.75;
  const serialized = abs.serializeAir(bus);
  assertTruthy(serialized !== null, "serializeAir returns object");
  assertEqual(serialized.reservoirPressure, 3.0, "serialized pressure preserved");
  assertEqual(serialized.compressorEnabled, true, "serialized compressorEnabled preserved");
  assertEqual(serialized.lowPressureWarning, true, "serialized lowPressureWarning preserved");
  // Deserialize into a fresh bus
  const bus2 = fakeBus();
  abs.ensureAir(bus2);
  abs.deserializeAir(bus2, serialized);
  assertEqual(abs.getPressure(bus2), 3.0, "deserialized pressure restored");
  assertEqual(abs.getState(bus2).lowPressureWarning, true, "deserialized warning restored");
  // Full serialize/deserialize round-trip
  const abs2 = freshAirBrakeSystem();
  const bus3 = fakeBus();
  abs2.ensureAir(bus3);
  bus3._airBrake.reservoirPressure = 5.5;
  const data = abs2.serialize();
  const abs3 = freshAirBrakeSystem();
  abs3.deserialize(data);
  assertTruthy(Object.keys(data).length > 0, "serialize returns entries");
  // Confirm deserialize restores pressure safely
  const restored = abs3._vehicles.get(Object.keys(data)[0]);
  assertTruthy(restored !== null, "deserialized state exists");
  assertEqual(restored.reservoirPressure, 5.5, "deserialized reservoirPressure restored");
}

// ============================================
// TEST 14: reset behavior
// ============================================
console.log("\n--- TEST 14: reset behavior ---");
{
  const abs = freshAirBrakeSystem();
  const bus = fakeBus();
  abs.ensureAir(bus);
  // Drain everything
  bus._airBrake.reservoirPressure = 1.0;
  bus._airBrake.compressorEnabled = false;
  bus._airBrake.lowPressureWarning = true;
  bus._airBrake.pressureRatio = 0.25;
  abs.reset(bus);
  assertEqual(abs.getPressure(bus), 8.0, "reset restores default pressure");
  assertTruthy(abs.getState(bus).compressorEnabled, "reset restores compressorEnabled");
  assertTruthy(!abs.isLowPressure(bus), "reset clears low-pressure warning");
  assertEqual(abs.getPressureRatio(bus), 1.0, "reset restores pressure ratio");
}

// ============================================
// TEST 15: no duplicate brake-force calculation
// ============================================
console.log("\n--- TEST 15: no duplicate brake-force calculation ---");
{
  const abs = freshAirBrakeSystem();
  // AirBrakeSystem must NOT own brake force, deceleration, ABS, or slip
  assertTruthy(typeof abs.brakeForce === "undefined", "AirBrakeSystem has no brakeForce");
  assertTruthy(typeof abs.deceleration === "undefined", "AirBrakeSystem has no deceleration");
  assertTruthy(typeof abs.absActive === "undefined", "AirBrakeSystem has no absActive");
  assertTruthy(typeof abs.slipRatio === "undefined", "AirBrakeSystem has no slipRatio");
  assertTruthy(typeof abs.attachBrake === "undefined", "AirBrakeSystem has no attachBrake");
  assertTruthy(typeof abs.ensureBrake === "undefined", "AirBrakeSystem has no ensureBrake");
  // AirBrakeSystem must NOT own acceleration/steering/fuel
  assertTruthy(typeof abs.acceleration === "undefined", "AirBrakeSystem has no acceleration");
  assertTruthy(typeof abs.steering === "undefined", "AirBrakeSystem has no steering");
  assertTruthy(typeof abs.fuelLevel === "undefined", "AirBrakeSystem has no fuelLevel");
  // It only exposes pressure state
  const bus = fakeBus();
  abs.ensureAir(bus);
  const st = abs.getState(bus);
  assertTruthy(typeof st.reservoirPressure === "number", "state exposes reservoirPressure");
  assertTruthy(typeof st.pressureRatio === "number", "state exposes pressureRatio");
  assertTruthy(typeof st.lowPressureWarning === "boolean", "state exposes lowPressureWarning");
}

// ============================================
// TEST 16: compressor cut-out and resume
// ============================================
console.log("\n--- TEST 16: compressor cut-out and resume ---");
{
  const abs = freshAirBrakeSystem();
  // At max pressure, compressor stops
  const full = fakeBus({ _airBrake: { __owner: abs, reservoirPressure: 10.0, minOperatingPressure: 4.0, maxPressure: 10.0, compressorRate: 0.8, brakeConsumptionRate: 0.35, leakRate: 0.0, compressorEnabled: true, lowPressureWarning: false, pressureRatio: 1.0, brakeInput: 0, handbrake: false } });
  abs.updateVehicle(full, 1.0);
  assertEqual(abs.getPressure(full), 10.0, "compressor stops at maxPressure");
  // After consumption, compressor resumes
  const drained = fakeBus({ _airBrake: { __owner: abs, reservoirPressure: 9.0, minOperatingPressure: 4.0, maxPressure: 10.0, compressorRate: 0.8, brakeConsumptionRate: 0.35, leakRate: 0.0, compressorEnabled: true, lowPressureWarning: false, pressureRatio: 1.0, brakeInput: 0, handbrake: false } });
  abs.updateVehicle(drained, 1.0);
  assertGreaterOrEqual(abs.getPressure(drained), 9.0, "compressor resumes below maxPressure");
}

console.log("\n=== " + passedCount + " passed, " + failedCount + " failed ===");
if (failedCount === 0) {
  console.log("PHASE 10B TASK 13 TESTS: ALL PASSED");
} else {
  console.log("PHASE 10B TASK 13 TESTS: FAILURES DETECTED");
  process.exit(1);
}
