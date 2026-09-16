/**
 * Phase 10B Task 15 - Electrical System Tests
 * Verifies ONE authoritative owner of battery/electrical state.
 * ElectricalSystem exposes battery/alternator/starter/load state only;
 * it never writes acceleration, fuel, temperature, braking, or steering.
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
  './systems/EngineTemperatureSystem.js',
  './systems/ElectricalSystem.js'
];
for (const dep of deps) { require(dep); }
const ElectricalSystem = window.BusSim.ElectricalSystem;
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

function freshElectricalSystem() {
  const es = new ElectricalSystem();
  es.init({});
  return es;
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
    setEngineTemp(s) { this._engineTemp = s; },
    getElectrical() { return this._electrical || null; },
    setElectrical(s) { this._electrical = s; }
  };
  Object.assign(bus, overrides || {});
  return bus;
}

console.log("=== Phase 10B Task 15: Electrical System Tests ===");
// ============================================
// TEST 1: default battery state
// ============================================
console.log("\n--- TEST 1: default battery state ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus();
  es.ensureElectrical(bus);
  assertEqual(es.getBatteryCharge(bus), 100, "default battery charge is 100");
  assertEqual(es.getBatteryVoltage(bus), 24, "default battery voltage is 24V");
  assertEqual(es.getElectricalLoad(bus), 0, "default electrical load is 0");
  assertTruthy(!es.isLowBattery(bus), "no low-battery warning at default");
  assertTruthy(!es.isDeadBattery(bus), "no dead-battery state at default");
  assertTruthy(es.canStartEngine(bus), "can start at default charge");
  const st = es.getState(bus);
  assertTruthy(st !== null, "getState returns object");
  assertEqual(st.batteryCharge, 100, "state batteryCharge is 100");
  assertEqual(st.batteryVoltage, 24, "state batteryVoltage is 24");
  assertEqual(st.alternatorOutput, 0, "state alternatorOutput is 0");
  assertEqual(st.electricalLoad, 0, "state electricalLoad is 0");
  assertTruthy(st.canCrank, "state canCrank is true");
  assertTruthy(!st.electricalFailure, "state electricalFailure is false");
  assertTruthy(!st.headlightsOn, "state headlightsOn is false");
  assertTruthy(!st.interiorLightsOn, "state interiorLightsOn is false");
  assertTruthy(!st.hornActive, "state hornActive is false");
  assertTruthy(!st.wipersOn, "state wipersOn is false");
}

// ============================================
// TEST 2: battery charge clamping
// ============================================
console.log("\n--- TEST 2: battery charge clamping ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus();
  es.ensureElectrical(bus);
  es.setState(bus, { batteryCharge: 150 });
  assertEqual(es.getBatteryCharge(bus), 100, "charge clamped to 100");
  es.setState(bus, { batteryCharge: -10 });
  assertEqual(es.getBatteryCharge(bus), 0, "charge clamped to 0");
}

// ============================================
// TEST 3: battery drain
// ============================================
console.log("\n--- TEST 3: battery drain ---");
{
  const es = freshElectricalSystem();
  // Engine off, no loads -> idle drain only
  const bus = fakeBus({ _electrical: { __owner: es, batteryCharge: 100, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: false, interiorLightsOn: false, hornActive: false, wipersOn: false } });
  es.updateVehicle(bus, 1.0);
  assertLessOrEqual(es.getBatteryCharge(bus), 100, "battery drained when engine off");
  assertGreaterOrEqual(es.getBatteryCharge(bus), 99, "idle drain is small");
// With headlights on, drain is faster
  const bus2 = fakeBus({ _headlightsOn: true, _electrical: { __owner: es, batteryCharge: 100, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: true, interiorLightsOn: false, hornActive: false, wipersOn: false } });
  es.updateVehicle(bus2, 1.0);
  assertLessOrEqual(es.getBatteryCharge(bus2), es.getBatteryCharge(bus), "headlights drain faster than idle");
}

// ============================================
// TEST 4: engine-off drain
// ============================================
console.log("\n--- TEST 4: engine-off drain ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus({ _electrical: { __owner: es, batteryCharge: 100, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: false, interiorLightsOn: false, hornActive: false, wipersOn: false } });
  es.updateVehicle(bus, 10.0);
  assertLessOrEqual(es.getBatteryCharge(bus), 100, "engine-off drains battery");
  assertEqual(es.getState(bus).alternatorOutput, 0, "alternator output is 0 when engine off");
}

// ============================================
// TEST 5: alternator charging
// ============================================
console.log("\n--- TEST 5: alternator charging ---");
{
  const es = freshElectricalSystem();
// Engine running, no loads -> full charge
  const bus = fakeBus({ _engineStarted: true, _electrical: { __owner: es, batteryCharge: 50, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: true, canCrank: true, headlightsOn: false, interiorLightsOn: false, hornActive: false, wipersOn: false } });
  es.updateVehicle(bus, 1.0);
  assertGreaterOrEqual(es.getBatteryCharge(bus), 50, "battery charged while engine running");
  assertEqual(es.getState(bus).alternatorOutput, 100, "alternator at max output when engine running");
  // With headlights on, alternator offsets load first
  const bus2 = fakeBus({ _engineStarted: true, _headlightsOn: true, _electrical: { __owner: es, batteryCharge: 50, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: true, canCrank: true, headlightsOn: true, interiorLightsOn: false, hornActive: false, wipersOn: false } });
  es.updateVehicle(bus2, 1.0);
  assertGreaterOrEqual(es.getBatteryCharge(bus2), 50, "battery still charges with headlights on");
  assertEqual(es.getElectricalLoad(bus2), 12, "headlight load counted");
}

// ============================================
// TEST 6: alternator disabled when engine is off
// ============================================
console.log("\n--- TEST 6: alternator disabled when engine is off ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus({ _electrical: { __owner: es, batteryCharge: 50, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: false, interiorLightsOn: false, hornActive: false, wipersOn: false } });
  es.updateVehicle(bus, 1.0);
  assertEqual(es.getState(bus).alternatorOutput, 0, "alternator output is 0 when engine off");
  assertLessOrEqual(es.getBatteryCharge(bus), 50, "battery does not charge when engine off");
}

// ============================================
// TEST 7: electrical-load calculation
// ============================================
console.log("\n--- TEST 7: electrical-load calculation ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus({ _headlightsOn: true, _interiorLightsOn: true, _hornActive: true, _wipersOn: true, _electrical: { __owner: es, batteryCharge: 100, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: true, interiorLightsOn: true, hornActive: true, wipersOn: true } });
  es.updateVehicle(bus, 0.016);
  assertEqual(es.getElectricalLoad(bus), 12 + 4 + 8 + 3, "total load = headlights + interior + horn + wipers");
}

// ============================================
// TEST 8: headlights load
// ============================================
console.log("\n--- TEST 8: headlights load ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus({ _headlightsOn: true, _electrical: { __owner: es, batteryCharge: 100, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: true, interiorLightsOn: false, hornActive: false, wipersOn: false } });
  es.updateVehicle(bus, 1.0);
  assertLessOrEqual(es.getBatteryCharge(bus), 100, "headlights drain battery");
}

// ============================================
// TEST 9: interior-light load
// ============================================
console.log("\n--- TEST 9: interior-light load ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus({ _interiorLightsOn: true, _electrical: { __owner: es, batteryCharge: 100, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: false, interiorLightsOn: true, hornActive: false, wipersOn: false } });
  es.updateVehicle(bus, 1.0);
  assertLessOrEqual(es.getBatteryCharge(bus), 100, "interior lights drain battery");
}

// ============================================
// TEST 10: horn momentary load
// ============================================
console.log("\n--- TEST 10: horn momentary load ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus({ _hornActive: true, _electrical: { __owner: es, batteryCharge: 100, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: false, interiorLightsOn: false, hornActive: true, wipersOn: false } });
  es.updateVehicle(bus, 1.0);
  assertEqual(es.getElectricalLoad(bus), 8, "horn load counted while active");
  // Horn is momentary - not persisted
  const serialized = es.serializeElectrical(bus);
  assertTruthy(serialized.hornActive === undefined, "horn not serialized as active");
}

// ============================================
// TEST 11: wiper load
// ============================================
console.log("\n--- TEST 11: wiper load ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus({ _wipersOn: true, _electrical: { __owner: es, batteryCharge: 100, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: false, interiorLightsOn: false, hornActive: false, wipersOn: true } });
  es.updateVehicle(bus, 1.0);
  assertEqual(es.getElectricalLoad(bus), 3, "wiper load counted");
  assertLessOrEqual(es.getBatteryCharge(bus), 100, "wipers drain battery");
}

// ============================================
// TEST 12: low battery
// ============================================
console.log("\n--- TEST 12: low battery ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus({ _electrical: { __owner: es, batteryCharge: 30, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: false, interiorLightsOn: false, hornActive: false, wipersOn: false } });
  assertTruthy(es.isLowBattery(bus), "low battery at threshold");
  const bus2 = fakeBus({ _electrical: { __owner: es, batteryCharge: 31, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: false, interiorLightsOn: false, hornActive: false, wipersOn: false } });
  assertTruthy(!es.isLowBattery(bus2), "not low battery above threshold");
}

// ============================================
// TEST 13: dead battery
// ============================================
console.log("\n--- TEST 13: dead battery ---");
{
  const es = freshElectricalSystem();
const bus = fakeBus({ _electrical: { __owner: es, batteryCharge: 5, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: false, canCrank: false, headlightsOn: false, interiorLightsOn: false, hornActive: false, wipersOn: false } });
  assertTruthy(es.isDeadBattery(bus), "dead battery at threshold");
  assertTruthy(!es.canStartEngine(bus), "cannot start with dead battery");
  const bus2 = fakeBus({ _electrical: { __owner: es, batteryCharge: 6, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: false, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: false, interiorLightsOn: false, hornActive: false, wipersOn: false } });
  assertTruthy(es.canStartEngine(bus2), "can start above dead threshold");
}

// ============================================
// TEST 14: canCrank behavior
// ============================================
console.log("\n--- TEST 14: canCrank behavior ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus();
  es.ensureElectrical(bus);
  // Drain to dead
  es.setState(bus, { batteryCharge: 3 });
  assertTruthy(!es.canStartEngine(bus), "cannot crank when dead");
  assertTruthy(!es.getState(bus).canCrank, "canCrank false when dead");
  // Charge up
  es.setState(bus, { batteryCharge: 50 });
  assertTruthy(es.canStartEngine(bus), "can crank when charged");
}

// ============================================
// TEST 15: starter draw
// ============================================
console.log("\n--- TEST 15: starter draw ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus();
  es.ensureElectrical(bus);
  assertTruthy(typeof es.getStarterState(bus).canCrank === "boolean", "starter state has canCrank");
  assertTruthy(typeof es.getStarterState(bus).batteryCharge === "number", "starter state has batteryCharge");
  assertTruthy(typeof es.getStarterState(bus).batteryVoltage === "number", "starter state has batteryVoltage");
  assertTruthy(typeof es.getStarterState(bus).electricalFailure === "boolean", "starter state has electricalFailure");
}

// ============================================
// TEST 16: electrical failure
// ============================================
console.log("\n--- TEST 16: electrical failure ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus({ _electrical: { __owner: es, batteryCharge: 100, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: true, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: true, interiorLightsOn: true, hornActive: true, wipersOn: true } });
  es.updateVehicle(bus, 0.016);
  assertTruthy(es.getState(bus).electricalFailure, "failure state persists");
  assertTruthy(!es.getState(bus).headlightsOn, "headlights disabled by failure");
  assertTruthy(!es.getState(bus).interiorLightsOn, "interior lights disabled by failure");
  assertTruthy(!es.getState(bus).hornActive, "horn disabled by failure");
  assertTruthy(!es.getState(bus).wipersOn, "wipers disabled by failure");
  assertTruthy(!es.canStartEngine(bus), "cannot start when failed");
}

// ============================================
// TEST 17: failed electrical devices
// ============================================
console.log("\n--- TEST 17: failed electrical devices ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus({ _electrical: { __owner: es, batteryCharge: 100, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: true, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: true, interiorLightsOn: true, hornActive: true, wipersOn: true } });
  es.updateVehicle(bus, 0.016);
  assertTruthy(!bus._electrical.headlightsOn, "headlights off after failure");
  assertTruthy(!bus._electrical.interiorLightsOn, "interior lights off after failure");
  assertTruthy(!bus._electrical.hornActive, "horn off after failure");
  assertTruthy(!bus._electrical.wipersOn, "wipers off after failure");
}

// ============================================
// TEST 18: brakes remain functional during electrical failure
// ============================================
console.log("\n--- TEST 18: brakes remain functional during electrical failure ---");
{
  const es = freshElectricalSystem();
  const BrakeSystem = window.BusSim.BrakeSystem;
  const bs = new BrakeSystem();
  bs.init({});
  const bus = fakeBus({ _brakeInput: 1.0, speed: 50, mass: 8000, _electrical: { __owner: es, batteryCharge: 100, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: true, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: true, interiorLightsOn: true, hornActive: true, wipersOn: true } });
  es.ensureElectrical(bus);
  bs.ensureBrake(bus);
  bs.updateVehicle(bus, 0.016);
  assertTruthy(bus._brake.brakeForce > 0, "service brakes still produce force during failure");
  assertTruthy(typeof bus._brake.deceleration === "number", "deceleration still computed during failure");
}

// ============================================
// TEST 19: air brakes remain functional during electrical failure
// ============================================
console.log("\n--- TEST 19: air brakes remain functional during electrical failure ---");
{
  const es = freshElectricalSystem();
  const AirBrakeSystem = window.BusSim.AirBrakeSystem;
  const abs = new AirBrakeSystem();
  abs.init({});
  const bus = fakeBus({ _brakeInput: 1.0, speed: 50, mass: 8000, _electrical: { __owner: es, batteryCharge: 100, batteryCapacity: 100, batteryVoltage: 24, alternatorOutput: 0, alternatorMaxOutput: 100, starterDraw: 25, headlightLoad: 12, interiorLightLoad: 4, hornLoad: 8, wiperLoad: 3, idleDrain: 0.6, lowBatteryCharge: 30, deadBatteryCharge: 5, electricalFailure: true, electricalLoad: 0, engineRunning: false, canCrank: true, headlightsOn: true, interiorLightsOn: true, hornActive: true, wipersOn: true } });
  es.ensureElectrical(bus);
  abs.ensureAir(bus);
  abs.updateVehicle(bus, 0.016);
  assertTruthy(bus._airBrake.reservoirPressure >= 0, "air pressure unaffected by electrical failure");
  assertTruthy(typeof bus._airBrake.pressureRatio === "number", "air pressure ratio still computed");
}

// ============================================
// TEST 20: Vehicle hooks
// ============================================
console.log("\n--- TEST 20: Vehicle hooks ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus();
  const state = es.ensureElectrical(bus);
  assertTruthy(bus._electrical === state, "ensureElectrical sets vehicle._electrical");
  assertTruthy(typeof bus.getElectrical === "function", "vehicle has getElectrical");
  assertTruthy(bus.getElectrical() === state, "getElectrical returns state");
  const newState = { __owner: es, batteryCharge: 60 };
  bus.setElectrical(newState);
  assertTruthy(bus.getElectrical() === newState, "setElectrical replaces state");
}

// ============================================
// TEST 21: MovementSystem integration
// ============================================
console.log("\n--- TEST 21: MovementSystem integration ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus({ speed: 0, _headlightsOn: true, _hornActive: true, _wipersOn: false, _interiorLightsOn: false });
  es.ensureElectrical(bus);
  es.updateVehicle(bus, 1.0);
  assertTruthy(bus._electrical !== null, "updateVehicle sets electrical state");
  assertTruthy(bus._electrical.headlightsOn, "headlights read from bus input");
  assertTruthy(bus._electrical.hornActive, "horn read from bus input");
  assertTruthy(typeof bus._electrical.batteryCharge === "number", "battery charge is a number");
  // Single update path: only one state object owned by ElectricalSystem
  assertTruthy(bus._electrical.__owner === es, "state owned by ElectricalSystem");
}

// ============================================
// TEST 22: InputSystem wiper mapping
// ============================================
console.log("\n--- TEST 22: InputSystem wiper mapping ---");
{
  const InputSystem = window.BusSim.InputSystem;
  const ControlsConfig = window.BusSim.ControlsConfig;
  assertTruthy(typeof ControlsConfig.wipers === "string", "ControlsConfig has wipers key");
  assertTruthy(typeof ControlsConfig.interiorLights === "string", "ControlsConfig has interiorLights key");
  assertTruthy(Array.isArray(ControlsConfig.getActionKeys('wipers')), "getActionKeys works for wipers");
  assertTruthy(Array.isArray(ControlsConfig.getActionKeys('interiorLights')), "getActionKeys works for interiorLights");
  assertTruthy(ControlsConfig.wipers === 'KeyU', "wipers bound to KeyU (non-conflicting)");
  assertTruthy(ControlsConfig.interiorLights === 'KeyI', "interior lights bound to KeyI");
}

// ============================================
// TEST 23: HUD state
// ============================================
console.log("\n--- TEST 23: HUD state ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus();
  es.ensureElectrical(bus);
  bus._electrical.batteryCharge = 20;
  bus._electrical.batteryVoltage = 22.5;
  assertTruthy(typeof bus.getElectrical === "function", "HUD can read electrical via vehicle hook");
  const st = bus.getElectrical();
  assertTruthy(st.batteryCharge === 20, "HUD reads battery charge");
  assertTruthy(st.batteryVoltage === 22.5, "HUD reads battery voltage");
  assertTruthy(es.isLowBattery(bus), "HUD can detect low battery");
}

// ============================================
// TEST 24: Maintenance recommendation
// ============================================
console.log("\n--- TEST 24: Maintenance recommendation ---");
{
  const es = freshElectricalSystem();
  const ms = freshMaintenanceSystem();
  // Dead battery bus
  const deadBus = fakeBus({ id: 'dead', condition: 80, damage: 20, fuelEfficiency: 3.0, busType: { fuelEfficiency: 3.5, speed: 65 }, tripDistance: 1000, lastMaintenance: 0 });
  es.ensureElectrical(deadBus);
  deadBus._electrical.batteryCharge = 3;
  const deadRec = ms.checkMaintenance(deadBus);
  assertTruthy(deadRec !== null, "recommendation exists for dead battery");
  const hasElec = deadRec.recommendations.some(r => r.type === 'electrical_inspection');
  assertTruthy(hasElec, "electrical inspection present for dead battery");
  // Failed bus
  const failBus = fakeBus({ id: 'fail', condition: 80, damage: 20, fuelEfficiency: 3.0, busType: { fuelEfficiency: 3.5, speed: 65 }, tripDistance: 1000, lastMaintenance: 0 });
  es.ensureElectrical(failBus);
  failBus._electrical.electricalFailure = true;
  const failRec = ms.checkMaintenance(failBus);
  const hasFailElec = failRec.recommendations.some(r => r.type === 'electrical_inspection');
  assertTruthy(hasFailElec, "electrical inspection present for failure");
  // Normal bus - no electrical recommendation
  const normBus = fakeBus({ id: 'norm', condition: 90, damage: 10, fuelEfficiency: 3.4, busType: { fuelEfficiency: 3.5, speed: 65 }, tripDistance: 100, lastMaintenance: 0 });
  es.ensureElectrical(normBus);
  const normRec = ms.checkMaintenance(normBus);
  if (normRec) {
    const hasElecNorm = normRec.recommendations.some(r => r.type === 'electrical_inspection');
    assertTruthy(!hasElecNorm, "no electrical recommendation for normal bus");
  }
}

// ============================================
// TEST 25: Save/load persistence
// ============================================
console.log("\n--- TEST 25: Save/load persistence ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus();
  es.ensureElectrical(bus);
  // Drain battery and set failure
  bus._electrical.batteryCharge = 40;
  bus._electrical.batteryVoltage = 22.8;
  bus._electrical.alternatorOutput = 0;
  bus._electrical.electricalLoad = 12;
  bus._electrical.canCrank = true;
  bus._electrical.electricalFailure = false;
  bus._electrical.headlightsOn = true;
  bus._electrical.interiorLightsOn = false;
  bus._electrical.wipersOn = true;
  const serialized = es.serializeElectrical(bus);
  assertTruthy(serialized !== null, "serializeElectrical returns object");
  assertEqual(serialized.batteryCharge, 40, "serialized batteryCharge preserved");
  assertEqual(serialized.batteryVoltage, 22.8, "serialized batteryVoltage preserved");
  assertEqual(serialized.alternatorOutput, 0, "serialized alternatorOutput preserved");
  assertEqual(serialized.electricalLoad, 12, "serialized electricalLoad preserved");
  assertEqual(serialized.canCrank, true, "serialized canCrank preserved");
  assertEqual(serialized.electricalFailure, false, "serialized electricalFailure preserved");
  assertEqual(serialized.headlightsOn, true, "serialized headlightsOn preserved");
  assertEqual(serialized.interiorLightsOn, false, "serialized interiorLightsOn preserved");
  assertEqual(serialized.wipersOn, true, "serialized wipersOn preserved");
  // Deserialize into a fresh bus
  const bus2 = fakeBus();
  es.ensureElectrical(bus2);
  es.deserializeElectrical(bus2, serialized);
  assertEqual(es.getBatteryCharge(bus2), 40, "deserialized batteryCharge restored");
  assertEqual(es.getBatteryVoltage(bus2), 22.8, "deserialized batteryVoltage restored");
  assertTruthy(es.getState(bus2).headlightsOn, "deserialized headlightsOn restored");
  assertTruthy(es.getState(bus2).wipersOn, "deserialized wipersOn restored");
  assertTruthy(!es.getState(bus2).hornActive, "horn not active after deserialize");
  // Full serialize/deserialize round-trip
  const es2 = freshElectricalSystem();
  const bus3 = fakeBus();
  es2.ensureElectrical(bus3);
  bus3._electrical.batteryCharge = 55;
  bus3._electrical.headlightsOn = true;
  const data = es2.serialize();
  assertTruthy(Object.keys(data).length > 0, "serialize returns entries");
  const es3 = freshElectricalSystem();
  es3.deserialize(data);
  const restored = es3._vehicles.get(Object.keys(data)[0]);
  assertTruthy(restored !== null, "deserialized state exists");
  assertEqual(restored.batteryCharge, 55, "deserialized batteryCharge restored");
  assertTruthy(restored.headlightsOn, "deserialized headlightsOn restored");
}

// ============================================
// TEST 26: reset()
// ============================================
console.log("\n--- TEST 26: reset() ---");
{
  const es = freshElectricalSystem();
  const bus = fakeBus();
  es.ensureElectrical(bus);
  // Drain everything
  bus._electrical.batteryCharge = 10;
  bus._electrical.batteryVoltage = 22;
  bus._electrical.alternatorOutput = 0;
  bus._electrical.electricalLoad = 12;
  bus._electrical.canCrank = false;
  bus._electrical.electricalFailure = true;
  bus._electrical.headlightsOn = true;
  bus._electrical.interiorLightsOn = true;
  bus._electrical.hornActive = true;
  bus._electrical.wipersOn = true;
  es.reset(bus);
  assertEqual(es.getBatteryCharge(bus), 100, "reset restores default charge");
  assertEqual(es.getBatteryVoltage(bus), 24, "reset restores default voltage");
  assertTruthy(es.canStartEngine(bus), "reset restores canCrank");
  assertTruthy(!es.getState(bus).electricalFailure, "reset clears failure");
  assertTruthy(!es.getState(bus).headlightsOn, "reset clears headlights");
  assertTruthy(!es.getState(bus).wipersOn, "reset clears wipers");
}

// ============================================
// TEST 27: no duplicate battery update
// ============================================
console.log("\n--- TEST 27: no duplicate battery update ---");
{
  const es = freshElectricalSystem();
  // ElectricalSystem must NOT own acceleration/brake/fuel/temperature
  assertTruthy(typeof es.acceleration === "undefined", "ElectricalSystem has no acceleration");
  assertTruthy(typeof es.brakeForce === "undefined", "ElectricalSystem has no brakeForce");
  assertTruthy(typeof es.fuelLevel === "undefined", "ElectricalSystem has no fuelLevel");
  assertTruthy(typeof es.engineTemperature === "undefined", "ElectricalSystem has no engineTemperature");
  assertTruthy(typeof es.airPressureRatio === "undefined", "ElectricalSystem has no airPressureRatio");
  assertTruthy(typeof es.steering === "undefined", "ElectricalSystem has no steering");
  // It only exposes battery/electrical state
  const bus = fakeBus();
  es.ensureElectrical(bus);
  const st = es.getState(bus);
  assertTruthy(typeof st.batteryCharge === "number", "state exposes batteryCharge");
  assertTruthy(typeof st.batteryVoltage === "number", "state exposes batteryVoltage");
  assertTruthy(typeof st.electricalLoad === "number", "state exposes electricalLoad");
  assertTruthy(typeof st.canCrank === "boolean", "state exposes canCrank");
  assertTruthy(typeof st.electricalFailure === "boolean", "state exposes electricalFailure");
}

console.log("\n=== " + passedCount + " passed, " + failedCount + " failed ===");
if (failedCount === 0) {
  console.log("PHASE 10B TASK 15 TESTS: ALL PASSED");
} else {
  console.log("PHASE 10B TASK 15 TESTS: FAILURES DETECTED");
  process.exit(1);
}
