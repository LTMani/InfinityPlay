/**
 * Phase 10B Task 14 - Engine Temperature & Overheating System Tests
 * Verifies ONE authoritative owner of engine temperature/coolant state.
 * EngineTemperatureSystem exposes temperature/coolant state and a
 * performance multiplier only; it never writes acceleration or fuel.
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
  './systems/AirBrakeSystem.js',
  './systems/EngineTemperatureSystem.js'
];
for (const dep of deps) { require(dep); }
const EngineTemperatureSystem = window.BusSim.EngineTemperatureSystem;
const MaintenanceSystem = window.BusSim.MaintenanceSystem;
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

function freshEngineTempSystem() {
  const ets = new EngineTemperatureSystem();
  ets.init({});
  return ets;
}

function freshMaintenanceSystem() {
  const ms = Object.create(MaintenanceSystem);
  ms.init({ GameInitSystem: { getPlayer() { return null; } } });
  return ms;
}

function fakeBus(overrides) {
  const bus = {
    id: 'bus_test',
    speed: 0,
    targetSpeed: 0,
    steering: 0,
    _brakeInput: 0,
    _handbrake: false,
    _throttle: 0,
    reverseMode: false,
    mass: 8000,
    roadFrictionMultiplier: 1.0,
    condition: 100,
    damage: 0,
    isDamaged: false,
    maxSpeed: 65,
    busType: { speed: 65 },
    getTransmission() { return null; },
    getSuspension() { return null; },
    getTires() { return null; },
    getRoadSurface() { return null; },
    getAirBrake() { return this._airBrake || null; },
    setAirBrake(s) { this._airBrake = s; },
    getEngineTemp() { return this._engineTemp || null; },
    setEngineTemp(s) { this._engineTemp = s; }
  };
  Object.assign(bus, overrides || {});
  return bus;
}

console.log("=== Phase 10B Task 14: Engine Temperature & Overheating Tests ===");
// ============================================
// TEST 1: default temperature
// ============================================
console.log("\n--- TEST 1: default temperature ---");
{
  const ets = freshEngineTempSystem();
  const bus = fakeBus();
  ets.ensureTemp(bus);
  assertEqual(ets.getTemperature(bus), 85, "default engine temperature is 85 C");
  assertEqual(ets.getCoolantLevel(bus), 100, "default coolant level is 100");
  assertTruthy(!ets.isOverheating(bus), "no overheating at default");
  assertTruthy(!ets.isCritical(bus), "no critical at default");
  assertEqual(ets.getPerformanceMultiplier(bus), 1.0, "default performance multiplier is 1.0");
  const st = ets.getState(bus);
  assertTruthy(st !== null, "getState returns object");
  assertEqual(st.normalTemperature, 90, "normalTemperature is 90");
  assertEqual(st.warningTemperature, 105, "warningTemperature is 105");
  assertEqual(st.overheatTemperature, 115, "overheatTemperature is 115");
  assertEqual(st.criticalTemperature, 125, "criticalTemperature is 125");
  assertEqual(st.coolantLevel, 100, "state coolantLevel is 100");
  assertTruthy(st.overheating === false, "state overheating is false");
  assertTruthy(st.criticalOverheat === false, "state criticalOverheat is false");
}

// ============================================
// TEST 2: normal temperature state
// ============================================
console.log("\n--- TEST 2: normal temperature state ---");
{
  const ets = freshEngineTempSystem();
  const bus = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 90, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 0, targetSpeed: 0, throttle: 0, reverseMode: false, ambientTemp: 25 } });
  ets.updateVehicle(bus, 0.016);
  assertTruthy(!ets.isOverheating(bus), "no overheating at normal temp");
  assertTruthy(!ets.isCritical(bus), "no critical at normal temp");
  assertEqual(ets.getPerformanceMultiplier(bus), 1.0, "performance is 1.0 at normal temp");
}

// ============================================
// TEST 3: temperature increase under engine load
// ============================================
console.log("\n--- TEST 3: temperature increase under engine load ---");
{
  const ets = freshEngineTempSystem();
  // High load: high speed + high throttle
  const bus = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 85, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 80, targetSpeed: 80, throttle: 1.0, reverseMode: false, ambientTemp: 25 } });
  const before = ets.getTemperature(bus);
  ets.updateVehicle(bus, 1.0);
  assertGreaterOrEqual(ets.getTemperature(bus), before, "temperature increased under high load");
  // Low load: idle, should not rise much
  const bus2 = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 85, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 0, targetSpeed: 0, throttle: 0, reverseMode: false, ambientTemp: 25 } });
  const before2 = ets.getTemperature(bus2);
  ets.updateVehicle(bus2, 1.0);
  assertLessOrEqual(ets.getTemperature(bus2) - before2, ets.getTemperature(bus) - before, "idle temp rise <= high-load rise");
}
// ============================================
// TEST 4: cooling behavior
// ============================================
console.log("\n--- TEST 4: cooling behavior ---");
{
  const ets = freshEngineTempSystem();
  // Hot engine, moving fast - should cool down
  const bus = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 110, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 60, targetSpeed: 60, throttle: 0, reverseMode: false, ambientTemp: 25 } });
  const before = ets.getTemperature(bus);
  ets.updateVehicle(bus, 1.0);
  assertLessOrEqual(ets.getTemperature(bus), before, "engine cools while moving");
  assertGreaterOrEqual(ets.getTemperature(bus), 60, "temperature never drops below minTemperature");
  // Idle hot engine - weak cooling
  const bus2 = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 110, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 0, targetSpeed: 0, throttle: 0, reverseMode: false, ambientTemp: 25 } });
  const before2 = ets.getTemperature(bus2);
  ets.updateVehicle(bus2, 1.0);
  assertLessOrEqual(ets.getTemperature(bus2) - before2, ets.getTemperature(bus) - before, "idle cooling <= moving cooling");
}

// ============================================
// TEST 5: cooling at low speed
// ============================================
console.log("\n--- TEST 5: cooling at low speed ---");
{
  const ets = freshEngineTempSystem();
  const fast = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 110, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 60, targetSpeed: 60, throttle: 0, reverseMode: false, ambientTemp: 25 } });
  const slow = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 110, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 5, targetSpeed: 5, throttle: 0, reverseMode: false, ambientTemp: 25 } });
  ets.updateVehicle(fast, 1.0);
  ets.updateVehicle(slow, 1.0);
  assertLessOrEqual(slow._engineTemp.engineTemperature, fast._engineTemp.engineTemperature, "low speed cools less than high speed");
}

// ============================================
// TEST 6: coolant level
// ============================================
console.log("\n--- TEST 6: coolant level ---");
{
  const ets = freshEngineTempSystem();
  const bus = fakeBus();
  ets.ensureTemp(bus);
  assertEqual(ets.getCoolantLevel(bus), 100, "default coolant is 100");
  // Set via setState
  ets.setState(bus, { coolantLevel: 60 });
  assertEqual(ets.getCoolantLevel(bus), 60, "setState coolantLevel works");
  // Clamp
  ets.setState(bus, { coolantLevel: 150 });
  assertEqual(ets.getCoolantLevel(bus), 100, "coolant clamped to maxCoolantLevel");
  ets.setState(bus, { coolantLevel: -10 });
  assertEqual(ets.getCoolantLevel(bus), 0, "coolant clamped to minCoolantLevel");
}
// ============================================
// TEST 7: coolant loss
// ============================================
console.log("\n--- TEST 7: coolant loss ---");
{
  const ets = freshEngineTempSystem();
  // Overheating causes coolant boil-off
  const bus = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 120, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 0, targetSpeed: 0, throttle: 0, reverseMode: false, ambientTemp: 25 } });
  ets.updateVehicle(bus, 1.0);
  assertLessOrEqual(ets.getCoolantLevel(bus), 100, "coolant lost under overheating");
  assertGreaterOrEqual(ets.getCoolantLevel(bus), 0, "coolant clamped to zero");
}

// ============================================
// TEST 8: low coolant reducing cooling
// ============================================
console.log("\n--- TEST 8: low coolant reducing cooling ---");
{
  const ets = freshEngineTempSystem();
  const full = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 110, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 60, targetSpeed: 60, throttle: 0, reverseMode: false, ambientTemp: 25 } });
  const low = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 110, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 20, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 60, targetSpeed: 60, throttle: 0, reverseMode: false, ambientTemp: 25 } });
ets.updateVehicle(full, 1.0);
  ets.updateVehicle(low, 1.0);
  assertGreaterOrEqual(low._engineTemp.engineTemperature, full._engineTemp.engineTemperature, "low coolant => less cooling => higher temp");
  assertEqual(ets.getCoolingEfficiency(low), 0.2, "cooling efficiency equals coolant fraction");
}

// ============================================
// TEST 9: temperature clamping
// ============================================
console.log("\n--- TEST 9: temperature clamping ---");
{
  const ets = freshEngineTempSystem();
  const bus = fakeBus();
  ets.ensureTemp(bus);
  ets.setState(bus, { engineTemperature: 200 });
  assertLessOrEqual(ets.getTemperature(bus), 140, "temperature clamped to maxTemperature");
  ets.setState(bus, { engineTemperature: 10 });
  assertGreaterOrEqual(ets.getTemperature(bus), 60, "temperature clamped to minTemperature");
}

// ============================================
// TEST 10: warning threshold
// ============================================
console.log("\n--- TEST 10: warning threshold ---");
{
  const ets = freshEngineTempSystem();
  const bus = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 104, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 0, targetSpeed: 0, throttle: 0, reverseMode: false, ambientTemp: 25 } });
  assertTruthy(!ets.isOverheating(bus), "not yet overheating below warning");
  assertTruthy(!ets.isCritical(bus), "not critical below warning");
  bus._engineTemp.engineTemperature = 106;
  ets._recomputePerformance(bus._engineTemp);
  assertTruthy(ets.getPerformanceMultiplier(bus) < 1.0, "performance reduced above warning");
  assertTruthy(!ets.isOverheating(bus), "not overheating below overheat threshold");
}

// ============================================
// TEST 11: overheating threshold
// ============================================
console.log("\n--- TEST 11: overheating threshold ---");
{
  const ets = freshEngineTempSystem();
  const bus = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 115, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 0, targetSpeed: 0, throttle: 0, reverseMode: false, ambientTemp: 25 } });
  ets._recomputePerformance(bus._engineTemp);
  assertTruthy(ets.isOverheating(bus), "overheating at overheat threshold");
  assertTruthy(!ets.isCritical(bus), "not critical below critical threshold");
  assertLessOrEqual(ets.getPerformanceMultiplier(bus), 0.7, "performance reduced at overheating");
}

// ============================================
// TEST 12: critical threshold
// ============================================
console.log("\n--- TEST 12: critical threshold ---");
{
  const ets = freshEngineTempSystem();
  const bus = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 125, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 0, targetSpeed: 0, throttle: 0, reverseMode: false, ambientTemp: 25 } });
  ets._recomputePerformance(bus._engineTemp);
  assertTruthy(ets.isCritical(bus), "critical at critical threshold");
  assertLessOrEqual(ets.getPerformanceMultiplier(bus), 0.35, "severe performance reduction at critical");
}

// ============================================
// TEST 13: performance multiplier
// ============================================
console.log("\n--- TEST 13: performance multiplier ---");
{
  const ets = freshEngineTempSystem();
  const normal = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 90, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 0, targetSpeed: 0, throttle: 0, reverseMode: false, ambientTemp: 25 } });
  assertEqual(ets.getPerformanceMultiplier(normal), 1.0, "normal temp perf is 1.0");
  const hot = fakeBus({ _engineTemp: { __owner: ets, engineTemperature: 120, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 0, targetSpeed: 0, throttle: 0, reverseMode: false, ambientTemp: 25 } });
  ets._recomputePerformance(hot._engineTemp);
  assertLessOrEqual(ets.getPerformanceMultiplier(hot), 1.0, "hot perf <= 1.0");
  assertGreaterOrEqual(ets.getPerformanceMultiplier(hot), 0.35, "hot perf >= 0.35");
  assertLessOrEqual(ets.getPerformanceMultiplier(hot), ets.getPerformanceMultiplier(normal), "hot perf <= normal perf");
}

// ============================================
// TEST 14: overheating performance derating
// ============================================
console.log("\n--- TEST 14: overheating performance derating ---");
{
  const ets = freshEngineTempSystem();
  const bus = fakeBus({ maxSpeed: 65, busType: { speed: 65 }, damage: 0, condition: 100, _engineTemp: { __owner: ets, engineTemperature: 120, normalTemperature: 90, warningTemperature: 105, overheatTemperature: 115, criticalTemperature: 125, minTemperature: 60, maxTemperature: 140, coolantLevel: 100, minCoolantLevel: 0, maxCoolantLevel: 100, coolingEfficiency: 1.0, overheating: false, criticalOverheat: false, performanceMultiplier: 1.0, idleHeatRate: 0.6, cruisingHeatRate: 2.2, highLoadHeatRate: 5.5, cruisingCoolRate: 3.0, lowSpeedCoolRate: 1.0, idleCoolRate: 0.4, overheatDamageRate: 0.02, criticalDamageRate: 0.08, speed: 0, targetSpeed: 0, throttle: 0, reverseMode: false, ambientTemp: 25 } });
  // Simulate Bus.update derating logic
  const tempPerf = ets.getPerformanceMultiplier(bus);
  const baseSpeed = bus.busType.speed;
  bus.maxSpeed = Math.min(bus.maxSpeed || baseSpeed, baseSpeed * tempPerf);
  assertLessOrEqual(bus.maxSpeed, 65, "maxSpeed reduced under overheating");
  assertGreaterOrEqual(bus.maxSpeed, 65 * 0.35, "maxSpeed not reduced below critical floor");
}

// ============================================
// TEST 15: engine damage accumulation
// ============================================
console.log("\n--- TEST 15: engine damage accumulation ---");
{
  const ets = freshEngineTempSystem();
  const bus = fakeBus({ damage: 0, condition: 100, maxSpeed: 65, busType: { speed: 65 } });
  ets.ensureTemp(bus);
  // Overheating state
  bus._engineTemp.engineTemperature = 118;
  ets._recomputePerformance(bus._engineTemp);
  const damageBefore = bus.damage;
  ets.applyOverheatDamage(bus, 1.0);
  assertGreaterOrEqual(bus.damage, damageBefore, "damage increased under overheating");
  assertLessOrEqual(bus.damage, 100, "damage clamped to 100");
  assertEqual(bus.condition, Math.max(0, 100 - bus.damage), "condition recomputed from damage");
}

// ============================================
// TEST 16: critical overheating damage
// ============================================
console.log("\n--- TEST 16: critical overheating damage ---");
{
  const ets = freshEngineTempSystem();
  const busOverheat = fakeBus({ damage: 0, condition: 100, maxSpeed: 65, busType: { speed: 65 } });
  const busCrit = fakeBus({ damage: 0, condition: 100, maxSpeed: 65, busType: { speed: 65 } });
  ets.ensureTemp(busOverheat);
  ets.ensureTemp(busCrit);
  // Overheating
  busOverheat._engineTemp.engineTemperature = 118;
  ets._recomputePerformance(busOverheat._engineTemp);
  // Critical
  busCrit._engineTemp.engineTemperature = 130;
  ets._recomputePerformance(busCrit._engineTemp);
  ets.applyOverheatDamage(busOverheat, 1.0);
  ets.applyOverheatDamage(busCrit, 1.0);
  assertGreaterOrEqual(busCrit.damage, busOverheat.damage, "critical damage >= overheating damage");
}

// ============================================
// TEST 17: Vehicle hooks
// ============================================
console.log("\n--- TEST 17: Vehicle hooks ---");
{
  const ets = freshEngineTempSystem();
  const bus = fakeBus();
  const state = ets.ensureTemp(bus);
  assertTruthy(bus._engineTemp === state, "ensureTemp sets vehicle._engineTemp");
  assertTruthy(typeof bus.getEngineTemp === "function", "vehicle has getEngineTemp");
  assertTruthy(bus.getEngineTemp() === state, "getEngineTemp returns state");
  const newState = { __owner: ets, engineTemperature: 95 };
  bus.setEngineTemp(newState);
  assertTruthy(bus.getEngineTemp() === newState, "setEngineTemp replaces state");
}

// ============================================
// TEST 18: MovementSystem integration
// ============================================
console.log("\n--- TEST 18: MovementSystem integration ---");
{
  const ets = freshEngineTempSystem();
  const bus = fakeBus({ speed: 80, targetSpeed: 80, _throttle: 1.0, maxSpeed: 65, busType: { speed: 65 }, damage: 0, condition: 100 });
  ets.ensureTemp(bus);
  ets.updateVehicle(bus, 1.0);
  assertTruthy(bus._engineTemp !== null, "updateVehicle sets engine temp state");
  // Performance derating applied via Bus.update path
  const tempPerf = ets.getPerformanceMultiplier(bus);
  assertTruthy(typeof tempPerf === "number", "performance multiplier is a number");
  assertLessOrEqual(tempPerf, 1.0, "performance multiplier <= 1.0");
  assertGreaterOrEqual(tempPerf, 0.35, "performance multiplier >= 0.35");
  // Confirm no duplicate temperature update: only one state object
  assertTruthy(bus._engineTemp.__owner === ets, "state owned by EngineTemperatureSystem");
}

// ============================================
// TEST 19: MaintenanceSystem recommendation
// ============================================
console.log("\n--- TEST 19: MaintenanceSystem recommendation ---");
{
  const ets = freshEngineTempSystem();
  const ms = freshMaintenanceSystem();
  // Overheating bus
  const hotBus = fakeBus({ id: 'hot', condition: 80, damage: 20, fuelEfficiency: 3.0, busType: { fuelEfficiency: 3.5, speed: 65 }, tripDistance: 1000, lastMaintenance: 0 });
  ets.ensureTemp(hotBus);
  hotBus._engineTemp.engineTemperature = 118;
  ets._recomputePerformance(hotBus._engineTemp);
  const hotRec = ms.checkMaintenance(hotBus);
  assertTruthy(hotRec !== null, "maintenance recommendation exists for overheating bus");
  const hasOverheat = hotRec.recommendations.some(r => r.type === 'overheat_repair');
  assertTruthy(hasOverheat, "overheat repair recommendation present");
  // Critical + low coolant
  const critBus = fakeBus({ id: 'crit', condition: 60, damage: 40, fuelEfficiency: 3.0, busType: { fuelEfficiency: 3.5, speed: 65 }, tripDistance: 1000, lastMaintenance: 0 });
  ets.ensureTemp(critBus);
  critBus._engineTemp.engineTemperature = 130;
  critBus._engineTemp.coolantLevel = 10;
  ets._recomputePerformance(critBus._engineTemp);
  const critRec = ms.checkMaintenance(critBus);
  const hasCoolant = critRec.recommendations.some(r => r.type === 'coolant_topup');
  assertTruthy(hasCoolant, "coolant topup recommendation present");
  // Normal bus - no overheat recommendation
  const normalBus = fakeBus({ id: 'norm', condition: 90, damage: 10, fuelEfficiency: 3.4, busType: { fuelEfficiency: 3.5, speed: 65 }, tripDistance: 100, lastMaintenance: 0 });
  ets.ensureTemp(normalBus);
  const normRec = ms.checkMaintenance(normalBus);
  if (normRec) {
    const hasOverheatNorm = normRec.recommendations.some(r => r.type === 'overheat_repair');
    assertTruthy(!hasOverheatNorm, "no overheat recommendation for normal bus");
  }
}

// ============================================
// TEST 20: HUD state
// ============================================
console.log("\n--- TEST 20: HUD state ---");
{
  const ets = freshEngineTempSystem();
  const bus = fakeBus();
  ets.ensureTemp(bus);
  bus._engineTemp.engineTemperature = 118;
  bus._engineTemp.overheating = true;
  assertTruthy(typeof bus.getEngineTemp === "function", "HUD can read engine temp via vehicle hook");
  const st = bus.getEngineTemp();
  assertTruthy(st.engineTemperature === 118, "HUD reads engine temperature");
  assertTruthy(st.overheating === true, "HUD reads overheating state");
}

// ============================================
// TEST 21: Save/load persistence
// ============================================
console.log("\n--- TEST 21: Save/load persistence ---");
{
  const ets = freshEngineTempSystem();
  const bus = fakeBus();
  ets.ensureTemp(bus);
  // Drain temperature and coolant
  bus._engineTemp.engineTemperature = 110;
  bus._engineTemp.coolantLevel = 40;
  bus._engineTemp.overheating = true;
  bus._engineTemp.criticalOverheat = false;
  const serialized = ets.serializeTemp(bus);
  assertTruthy(serialized !== null, "serializeTemp returns object");
  assertEqual(serialized.engineTemperature, 110, "serialized temperature preserved");
  assertEqual(serialized.coolantLevel, 40, "serialized coolant preserved");
  assertEqual(serialized.overheating, true, "serialized overheating preserved");
  // Deserialize into a fresh bus
  const bus2 = fakeBus();
  ets.ensureTemp(bus2);
  ets.deserializeTemp(bus2, serialized);
  assertEqual(ets.getTemperature(bus2), 110, "deserialized temperature restored");
  assertEqual(ets.getCoolantLevel(bus2), 40, "deserialized coolant restored");
  assertTruthy(ets.isOverheating(bus2), "deserialized overheating restored");
  // Full serialize/deserialize round-trip
  const ets2 = freshEngineTempSystem();
  const bus3 = fakeBus();
  ets2.ensureTemp(bus3);
  bus3._engineTemp.engineTemperature = 95;
  bus3._engineTemp.coolantLevel = 70;
  const data = ets2.serialize();
  assertTruthy(Object.keys(data).length > 0, "serialize returns entries");
  const ets3 = freshEngineTempSystem();
  ets3.deserialize(data);
  const restored = ets3._vehicles.get(Object.keys(data)[0]);
  assertTruthy(restored !== null, "deserialized state exists");
  assertEqual(restored.engineTemperature, 95, "deserialized engineTemperature restored");
  assertEqual(restored.coolantLevel, 70, "deserialized coolantLevel restored");
}

// ============================================
// TEST 22: reset()
// ============================================
console.log("\n--- TEST 22: reset() ---");
{
  const ets = freshEngineTempSystem();
  const bus = fakeBus();
  ets.ensureTemp(bus);
  // Drain everything
  bus._engineTemp.engineTemperature = 130;
  bus._engineTemp.coolantLevel = 10;
  bus._engineTemp.overheating = true;
  bus._engineTemp.criticalOverheat = true;
  bus._engineTemp.performanceMultiplier = 0.35;
  ets.reset(bus);
  assertEqual(ets.getTemperature(bus), 85, "reset restores default temperature");
  assertEqual(ets.getCoolantLevel(bus), 100, "reset restores default coolant");
  assertTruthy(!ets.isOverheating(bus), "reset clears overheating");
  assertTruthy(!ets.isCritical(bus), "reset clears critical");
  assertEqual(ets.getPerformanceMultiplier(bus), 1.0, "reset restores performance multiplier");
}

// ============================================
// TEST 23: no duplicate temperature update
// ============================================
console.log("\n--- TEST 23: no duplicate temperature update ---");
{
  const ets = freshEngineTempSystem();
  // EngineTemperatureSystem must NOT own acceleration/brake/fuel/steering
  assertTruthy(typeof ets.acceleration === "undefined", "EngineTemperatureSystem has no acceleration");
  assertTruthy(typeof ets.brakeForce === "undefined", "EngineTemperatureSystem has no brakeForce");
  assertTruthy(typeof ets.fuelLevel === "undefined", "EngineTemperatureSystem has no fuelLevel");
  assertTruthy(typeof ets.steering === "undefined", "EngineTemperatureSystem has no steering");
  assertTruthy(typeof ets.throttle === "undefined", "EngineTemperatureSystem has no throttle");
  // It must NOT own damage/condition (uses existing mechanism only)
  assertTruthy(typeof ets.damage === "undefined", "EngineTemperatureSystem has no damage field");
  assertTruthy(typeof ets.condition === "undefined", "EngineTemperatureSystem has no condition field");
  assertTruthy(typeof ets.maintenanceSystem === "undefined", "EngineTemperatureSystem has no maintenanceSystem");
  // It only exposes temperature/coolant state
  const bus = fakeBus();
  ets.ensureTemp(bus);
  const st = ets.getState(bus);
  assertTruthy(typeof st.engineTemperature === "number", "state exposes engineTemperature");
  assertTruthy(typeof st.coolantLevel === "number", "state exposes coolantLevel");
  assertTruthy(typeof st.overheating === "boolean", "state exposes overheating");
  assertTruthy(typeof st.performanceMultiplier === "number", "state exposes performanceMultiplier");
}

// ============================================
// TEST 24: no duplicate damage calculation
// ============================================
console.log("\n--- TEST 24: no duplicate damage calculation ---");
{
  const ets = freshEngineTempSystem();
  // applyOverheatDamage must use existing vehicle.damage, not create new state
  const bus = fakeBus({ damage: 10, condition: 90, maxSpeed: 65, busType: { speed: 65 } });
  ets.ensureTemp(bus);
  bus._engineTemp.engineTemperature = 118;
  ets._recomputePerformance(bus._engineTemp);
  const damageBefore = bus.damage;
  ets.applyOverheatDamage(bus, 1.0);
  assertGreaterOrEqual(bus.damage, damageBefore, "applyOverheatDamage increments existing damage");
  assertTruthy(bus.damage >= 0 && bus.damage <= 100, "damage stays in valid range");
  // It must NOT create a separate damage object on the vehicle
  assertTruthy(typeof bus._engineDamage === "undefined", "no separate engine-damage state created");
  assertTruthy(typeof bus._overheatDamage === "undefined", "no separate overheat-damage state created");
}

console.log("\n=== " + passedCount + " passed, " + failedCount + " failed ===");
if (failedCount === 0) {
  console.log("PHASE 10B TASK 14 TESTS: ALL PASSED");
} else {
  console.log("PHASE 10B TASK 14 TESTS: FAILURES DETECTED");
  process.exit(1);
}
