/**
 * Phase 10B Task 12 - Road Surface System Tests
 * Verifies ONE authoritative owner for road-surface data.
 * RoadSurfaceSystem exposes surface properties only; it never writes
 * acceleration, braking, steering, suspension, tire wear, or fuel.
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
let _randomSeed = 42; Math.random = function () { const x = Math.sin(_randomSeed++) * 10000; return x - Math.floor(x); };
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
  './systems/RoadSurfaceSystem.js'
];
for (const dep of deps) { require(dep); }
const RoadSurfaceSystem = window.BusSim.RoadSurfaceSystem;
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

function freshRoadSurfaceSystem() {
  const rs = new RoadSurfaceSystem();
  rs.init({});
  return rs;
}

console.log("=== Phase 10B Task 12: Road Surface System Tests ===");
// ============================================
// TEST 1: initialization
// ============================================
console.log("\n--- TEST 1: initialization ---");
{
  const rs = new RoadSurfaceSystem();
  assertTruthy(typeof rs.init === "function", "init is a function");
  assertTruthy(typeof rs.getSurface === "function", "getSurface is a function");
  assertTruthy(typeof rs.getEffectiveGrip === "function", "getEffectiveGrip is a function");
  assertTruthy(typeof rs.getRollingResistance === "function", "getRollingResistance is a function");
  assertTruthy(typeof rs.getTireWearMultiplier === "function", "getTireWearMultiplier is a function");
  assertTruthy(typeof rs.getSuspensionRoughness === "function", "getSuspensionRoughness is a function");
  assertTruthy(typeof rs.getBrakingGripMultiplier === "function", "getBrakingGripMultiplier is a function");
  assertTruthy(typeof rs.updateVehicle === "function", "updateVehicle is a function");
  assertTruthy(typeof rs.destroy === "function", "destroy is a function");
  rs.init({});
  assertTruthy(rs._active, "system is active after init");
}

// ============================================
// TEST 2: asphalt defaults
// ============================================
console.log("\n--- TEST 2: asphalt defaults ---");
{
  const rs = freshRoadSurfaceSystem();
  const s = rs.getSurface("asphalt");
  assertEqual(s.gripMultiplier, 1.0, "asphalt gripMultiplier is 1.0");
  assertEqual(s.rollingResistance, 0.012, "asphalt rollingResistance is 0.012");
  assertEqual(s.tireWearMultiplier, 1.0, "asphalt tireWearMultiplier is 1.0");
  assertEqual(s.suspensionRoughness, 0.0, "asphalt suspensionRoughness is 0.0");
  assertEqual(s.brakingGripMultiplier, 1.0, "asphalt brakingGripMultiplier is 1.0");
}

// ============================================
// TEST 3: concrete
// ============================================
console.log("\n--- TEST 3: concrete ---");
{
  const rs = freshRoadSurfaceSystem();
  const s = rs.getSurface("concrete");
  assertEqual(s.gripMultiplier, 0.98, "concrete gripMultiplier is 0.98");
  assertEqual(s.rollingResistance, 0.010, "concrete rollingResistance is 0.010");
  assertEqual(s.tireWearMultiplier, 0.9, "concrete tireWearMultiplier is 0.9");
  assertEqual(s.suspensionRoughness, 0.05, "concrete suspensionRoughness is 0.05");
  assertEqual(s.brakingGripMultiplier, 0.98, "concrete brakingGripMultiplier is 0.98");
}

// ============================================
// TEST 4: gravel
// ============================================
console.log("\n--- TEST 4: gravel ---");
{
  const rs = freshRoadSurfaceSystem();
  const s = rs.getSurface("gravel");
  assertEqual(s.gripMultiplier, 0.62, "gravel gripMultiplier is 0.62");
  assertEqual(s.rollingResistance, 0.045, "gravel rollingResistance is 0.045");
  assertEqual(s.tireWearMultiplier, 2.2, "gravel tireWearMultiplier is 2.2");
  assertEqual(s.suspensionRoughness, 0.6, "gravel suspensionRoughness is 0.6");
  assertEqual(s.brakingGripMultiplier, 0.55, "gravel brakingGripMultiplier is 0.55");
}
// ============================================
// TEST 5: dirt
// ============================================
console.log("\n--- TEST 5: dirt ---");
{
  const rs = freshRoadSurfaceSystem();
  const s = rs.getSurface("dirt");
  assertEqual(s.gripMultiplier, 0.72, "dirt gripMultiplier is 0.72");
  assertEqual(s.rollingResistance, 0.030, "dirt rollingResistance is 0.030");
  assertEqual(s.tireWearMultiplier, 1.6, "dirt tireWearMultiplier is 1.6");
  assertEqual(s.suspensionRoughness, 0.4, "dirt suspensionRoughness is 0.4");
  assertEqual(s.brakingGripMultiplier, 0.68, "dirt brakingGripMultiplier is 0.68");
}

// ============================================
// TEST 6: mud
// ============================================
console.log("\n--- TEST 6: mud ---");
{
  const rs = freshRoadSurfaceSystem();
  const s = rs.getSurface("mud");
  assertEqual(s.gripMultiplier, 0.42, "mud gripMultiplier is 0.42");
  assertEqual(s.rollingResistance, 0.065, "mud rollingResistance is 0.065");
  assertEqual(s.tireWearMultiplier, 3.0, "mud tireWearMultiplier is 3.0");
  assertEqual(s.suspensionRoughness, 0.8, "mud suspensionRoughness is 0.8");
  assertEqual(s.brakingGripMultiplier, 0.38, "mud brakingGripMultiplier is 0.38");
}

// ============================================
// TEST 7: wetAsphalt
// ============================================
console.log("\n--- TEST 7: wetAsphalt ---");
{
  const rs = freshRoadSurfaceSystem();
  const s = rs.getSurface("wetAsphalt");
  assertEqual(s.gripMultiplier, 0.82, "wetAsphalt gripMultiplier is 0.82");
  assertEqual(s.rollingResistance, 0.014, "wetAsphalt rollingResistance is 0.014");
  assertEqual(s.tireWearMultiplier, 1.15, "wetAsphalt tireWearMultiplier is 1.15");
  assertEqual(s.suspensionRoughness, 0.0, "wetAsphalt suspensionRoughness is 0.0");
  assertEqual(s.brakingGripMultiplier, 0.80, "wetAsphalt brakingGripMultiplier is 0.80");
}

// ============================================
// TEST 8: roughRoad
// ============================================
console.log("\n--- TEST 8: roughRoad ---");
{
  const rs = freshRoadSurfaceSystem();
  const s = rs.getSurface("roughRoad");
  assertEqual(s.gripMultiplier, 0.78, "roughRoad gripMultiplier is 0.78");
  assertEqual(s.rollingResistance, 0.022, "roughRoad rollingResistance is 0.022");
  assertEqual(s.tireWearMultiplier, 1.4, "roughRoad tireWearMultiplier is 1.4");
  assertEqual(s.suspensionRoughness, 0.5, "roughRoad suspensionRoughness is 0.5");
  assertEqual(s.brakingGripMultiplier, 0.75, "roughRoad brakingGripMultiplier is 0.75");
}
// ============================================
// TEST 9: unknown surface fallback
// ============================================
console.log("\n--- TEST 9: unknown surface fallback ---");
{
  const rs = freshRoadSurfaceSystem();
  const unknown = rs.getSurface("nonexistent");
  const asphalt = rs.getSurface("asphalt");
  assertEqual(unknown.gripMultiplier, asphalt.gripMultiplier, "unknown grip falls back to asphalt");
  assertEqual(unknown.rollingResistance, asphalt.rollingResistance, "unknown rollingResistance falls back to asphalt");
  assertEqual(unknown.tireWearMultiplier, asphalt.tireWearMultiplier, "unknown tireWear falls back to asphalt");
  assertEqual(unknown.suspensionRoughness, asphalt.suspensionRoughness, "unknown suspensionRoughness falls back to asphalt");
  assertEqual(unknown.brakingGripMultiplier, asphalt.brakingGripMultiplier, "unknown brakingGrip falls back to asphalt");
  assertTruthy(unknown === asphalt, "unknown returns the asphalt object");
  const nullSurface = rs.getSurface(null);
  assertEqual(nullSurface.gripMultiplier, 1.0, "null surface falls back to asphalt");
  const undefinedSurface = rs.getSurface(undefined);
  assertEqual(undefinedSurface.gripMultiplier, 1.0, "undefined surface falls back to asphalt");
  const numberSurface = rs.getSurface(42);
  assertEqual(numberSurface.gripMultiplier, 1.0, "number surface falls back to asphalt");
  assertTruthy(rs.getSurfaceNames().includes("asphalt"), "surface names include asphalt");
  assertTruthy(rs.getSurfaceNames().includes("concrete"), "surface names include concrete");
  assertTruthy(rs.getSurfaceNames().includes("gravel"), "surface names include gravel");
  assertTruthy(rs.getSurfaceNames().includes("dirt"), "surface names include dirt");
  assertTruthy(rs.getSurfaceNames().includes("mud"), "surface names include mud");
  assertTruthy(rs.getSurfaceNames().includes("wetAsphalt"), "surface names include wetAsphalt");
  assertTruthy(rs.getSurfaceNames().includes("roughRoad"), "surface names include roughRoad");
  assertEqual(rs.getSurfaceNames().length, 7, "exactly 7 surface names");
}

// ============================================
// TEST 10: case-insensitive lookup
// ============================================
console.log("\n--- TEST 10: case-insensitive lookup ---");
{
  const rs = freshRoadSurfaceSystem();
  const lower = rs.getSurface("gravel");
  const upper = rs.getSurface("GRAVEL");
  const mixed = rs.getSurface("GrAvEl");
  assertTruthy(lower === upper, "GRAVEL resolves to gravel");
  assertTruthy(lower === mixed, "GrAvEl resolves to gravel");
}
// ============================================
// TEST 11: grip multiplier
// ============================================
console.log("\n--- TEST 11: grip multiplier ---");
{
  const rs = freshRoadSurfaceSystem();
  assertEqual(rs.getSurface("asphalt").gripMultiplier, 1.0, "asphalt grip is 1.0");
  assertEqual(rs.getSurface("gravel").gripMultiplier, 0.62, "gravel grip is 0.62");
  assertEqual(rs.getSurface("mud").gripMultiplier, 0.42, "mud grip is 0.42");
  assertGreaterOrEqual(rs.getSurface("asphalt").gripMultiplier, rs.getSurface("mud").gripMultiplier, "asphalt grip >= mud grip");
  assertLessOrEqual(rs.getSurface("mud").gripMultiplier, 1.0, "mud grip <= 1.0");
  assertGreaterOrEqual(rs.getSurface("mud").gripMultiplier, 0.0, "mud grip >= 0.0");
}

// ============================================
// TEST 12: rolling resistance
// ============================================
console.log("\n--- TEST 12: rolling resistance ---");
{
  const rs = freshRoadSurfaceSystem();
  assertEqual(rs.getSurface("asphalt").rollingResistance, 0.012, "asphalt rollingResistance is 0.012");
  assertEqual(rs.getSurface("gravel").rollingResistance, 0.045, "gravel rollingResistance is 0.045");
  assertEqual(rs.getSurface("mud").rollingResistance, 0.065, "mud rollingResistance is 0.065");
  assertGreaterOrEqual(rs.getSurface("gravel").rollingResistance, rs.getSurface("asphalt").rollingResistance, "gravel resistance >= asphalt");
}

// ============================================
// TEST 13: tire wear multiplier
// ============================================
console.log("\n--- TEST 13: tire wear multiplier ---");
{
  const rs = freshRoadSurfaceSystem();
  assertEqual(rs.getSurface("asphalt").tireWearMultiplier, 1.0, "asphalt tireWear is 1.0");
  assertEqual(rs.getSurface("gravel").tireWearMultiplier, 2.2, "gravel tireWear is 2.2");
  assertEqual(rs.getSurface("mud").tireWearMultiplier, 3.0, "mud tireWear is 3.0");
  assertGreaterOrEqual(rs.getSurface("mud").tireWearMultiplier, rs.getSurface("asphalt").tireWearMultiplier, "mud wear >= asphalt wear");
}

// ============================================
// TEST 14: suspension roughness
// ============================================
console.log("\n--- TEST 14: suspension roughness ---");
{
  const rs = freshRoadSurfaceSystem();
  assertEqual(rs.getSurface("asphalt").suspensionRoughness, 0.0, "asphalt roughness is 0.0");
  assertEqual(rs.getSurface("gravel").suspensionRoughness, 0.6, "gravel roughness is 0.6");
  assertEqual(rs.getSurface("mud").suspensionRoughness, 0.8, "mud roughness is 0.8");
  assertGreaterOrEqual(rs.getSurface("mud").suspensionRoughness, rs.getSurface("asphalt").suspensionRoughness, "mud roughness >= asphalt");
}

// ============================================
// TEST 15: braking grip multiplier
// ============================================
console.log("\n--- TEST 15: braking grip multiplier ---");
{
  const rs = freshRoadSurfaceSystem();
  assertEqual(rs.getSurface("asphalt").brakingGripMultiplier, 1.0, "asphalt brakingGrip is 1.0");
  assertEqual(rs.getSurface("gravel").brakingGripMultiplier, 0.55, "gravel brakingGrip is 0.55");
  assertEqual(rs.getSurface("mud").brakingGripMultiplier, 0.38, "mud brakingGrip is 0.38");
  assertGreaterOrEqual(rs.getSurface("asphalt").brakingGripMultiplier, rs.getSurface("mud").brakingGripMultiplier, "asphalt brakingGrip >= mud");
}
// ============================================
// TEST 16: effective grip
// ============================================
console.log("\n--- TEST 16: effective grip ---");
{
  const rs = freshRoadSurfaceSystem();
  assertEqual(rs.getEffectiveGrip("asphalt", 1.0, 1.0), 1.0, "asphalt clear tires = 1.0");
  assertEqual(rs.getEffectiveGrip("mud", 1.0, 1.0), 0.42, "mud clear tires = 0.42");
  assertEqual(rs.getEffectiveGrip("mud", 0.5, 1.0), 0.21, "mud rain tires = 0.21");
  assertEqual(rs.getEffectiveGrip("mud", 0.5, 0.9), 0.189, "mud rain worn tires = 0.189");
  assertEqual(rs.getEffectiveGrip("gravel", 1.0, 1.0), 0.62, "gravel clear tires = 0.62");
  assertLessOrEqual(rs.getEffectiveGrip("mud", 0.5, 0.9), 1.0, "effective grip <= 1.0");
  assertGreaterOrEqual(rs.getEffectiveGrip("mud", 0.5, 0.9), 0.05, "effective grip >= 0.05");
}

// ============================================
// TEST 17: weather friction interaction
// ============================================
console.log("\n--- TEST 17: weather friction interaction ---");
{
  const rs = freshRoadSurfaceSystem();
  const clear = rs.getEffectiveGrip("asphalt", 1.0, 1.0);
  const rain = rs.getEffectiveGrip("asphalt", 0.6, 1.0);
  const storm = rs.getEffectiveGrip("asphalt", 0.3, 1.0);
  assertEqual(clear, 1.0, "clear weather grip = 1.0");
  assertEqual(rain, 0.6, "rain weather grip = 0.6");
  assertEqual(storm, 0.3, "storm weather grip = 0.3");
  assertLessOrEqual(rain, clear, "rain grip <= clear grip");
  assertLessOrEqual(storm, rain, "storm grip <= rain grip");
  const mudClear = rs.getEffectiveGrip("mud", 1.0, 1.0);
  const mudRain = rs.getEffectiveGrip("mud", 0.5, 1.0);
  assertLessOrEqual(mudRain, mudClear, "mud rain <= mud clear");
  assertTruthy(typeof rs.getEffectiveGrip === "function", "getEffectiveGrip exists");
}

// ============================================
// TEST 18: deterministic behavior
// ============================================
console.log("\n--- TEST 18: deterministic behavior ---");
{
  const rs1 = freshRoadSurfaceSystem();
  const rs2 = freshRoadSurfaceSystem();
  for (const name of ["asphalt", "concrete", "gravel", "dirt", "mud", "wetAsphalt", "roughRoad"]) {
    assertEqual(rs1.getSurface(name).gripMultiplier, rs2.getSurface(name).gripMultiplier, `${name} grip deterministic`);
    assertEqual(rs1.getSurface(name).rollingResistance, rs2.getSurface(name).rollingResistance, `${name} rollingResistance deterministic`);
    assertEqual(rs1.getSurface(name).tireWearMultiplier, rs2.getSurface(name).tireWearMultiplier, `${name} tireWear deterministic`);
    assertEqual(rs1.getSurface(name).suspensionRoughness, rs2.getSurface(name).suspensionRoughness, `${name} suspensionRoughness deterministic`);
    assertEqual(rs1.getSurface(name).brakingGripMultiplier, rs2.getSurface(name).brakingGripMultiplier, `${name} brakingGrip deterministic`);
  }
  assertEqual(rs1.getEffectiveGrip("mud", 0.5, 0.9), rs2.getEffectiveGrip("mud", 0.5, 0.9), "effective grip deterministic");
  assertEqual(rs1.getRollingResistance("gravel"), rs2.getRollingResistance("gravel"), "rolling resistance deterministic");
  assertEqual(rs1.getTireWearMultiplier("mud"), rs2.getTireWearMultiplier("mud"), "tire wear deterministic");
  assertEqual(rs1.getSuspensionRoughness("roughRoad"), rs2.getSuspensionRoughness("roughRoad"), "suspension roughness deterministic");
  assertEqual(rs1.getBrakingGripMultiplier("gravel"), rs2.getBrakingGripMultiplier("gravel"), "braking grip deterministic");
}
// ============================================
// TEST 19: invalid / missing surface safety
// ============================================
console.log("\n--- TEST 19: invalid / missing surface safety ---");
{
  const rs = freshRoadSurfaceSystem();
  const asphalt = rs.getSurface("asphalt");
  const nullRes = rs.getRollingResistance(null);
  assertEqual(nullRes, asphalt.rollingResistance, "null rollingResistance falls back to asphalt");
  const undefWear = rs.getTireWearMultiplier(undefined);
  assertEqual(undefWear, asphalt.tireWearMultiplier, "undefined tireWear falls back to asphalt");
  const undefRough = rs.getSuspensionRoughness(undefined);
  assertEqual(undefRough, asphalt.suspensionRoughness, "undefined suspensionRoughness falls back to asphalt");
  const undefBrake = rs.getBrakingGripMultiplier(undefined);
  assertEqual(undefBrake, asphalt.brakingGripMultiplier, "undefined brakingGrip falls back to asphalt");
  const undefGrip = rs.getEffectiveGrip(undefined, undefined, undefined);
  assertEqual(undefGrip, 1.0, "undefined effective grip = 1.0");
  const nullGrip = rs.getEffectiveGrip(null, null, null);
  assertEqual(nullGrip, 1.0, "null effective grip = 1.0");
  const zeroGrip = rs.getEffectiveGrip("mud", 0, 0);
  assertGreaterOrEqual(zeroGrip, 0.05, "zero inputs clamped to 0.05");
  assertLessOrEqual(zeroGrip, 1.0, "zero inputs clamped to 1.0");
}

// ============================================
// TEST 20: no duplicate acceleration
// ============================================
console.log("\n--- TEST 20: no duplicate acceleration ---");
{
  const rs = freshRoadSurfaceSystem();
  assertTruthy(typeof rs.acceleration === "undefined", "RoadSurfaceSystem has no acceleration property");
  assertTruthy(typeof rs.apply === "undefined", "RoadSurfaceSystem has no apply method");
  assertTruthy(typeof rs.throttle === "undefined", "RoadSurfaceSystem has no throttle method");
  const surface = rs.getSurface("gravel");
  assertTruthy(typeof surface.gripMultiplier === "number", "surface exposes gripMultiplier only");
  assertTruthy(typeof surface.rollingResistance === "number", "surface exposes rollingResistance only");
}

// ============================================
// TEST 21: no duplicate braking
// ============================================
console.log("\n--- TEST 21: no duplicate braking ---");
{
  const rs = freshRoadSurfaceSystem();
  assertTruthy(typeof rs.brakeForce === "undefined", "RoadSurfaceSystem has no brakeForce property");
  assertTruthy(typeof rs.brakeDeceleration === "undefined", "RoadSurfaceSystem has no brakeDeceleration property");
  assertTruthy(typeof rs.absActive === "undefined", "RoadSurfaceSystem has no absActive property");
  const surface = rs.getSurface("mud");
  assertTruthy(typeof surface.brakingGripMultiplier === "number", "surface exposes brakingGripMultiplier only");
}

// ============================================
// TEST 22: no duplicate tire wear
// ============================================
console.log("\n--- TEST 22: no duplicate tire wear ---");
{
  const rs = freshRoadSurfaceSystem();
  assertTruthy(typeof rs.tires === "undefined", "RoadSurfaceSystem has no tires property");
  assertTruthy(typeof rs.wear === "undefined", "RoadSurfaceSystem has no wear property");
  assertTruthy(typeof rs.ensureTires === "undefined", "RoadSurfaceSystem has no ensureTires method");
  assertTruthy(typeof rs.attachTires === "undefined", "RoadSurfaceSystem has no attachTires method");
  const surface = rs.getSurface("gravel");
  assertTruthy(typeof surface.tireWearMultiplier === "number", "surface exposes tireWearMultiplier only");
}

// ============================================
// TEST 23: updateVehicle integration
// ============================================
console.log("\n--- TEST 23: updateVehicle integration ---");
{
  const rs = freshRoadSurfaceSystem();
  const fakeBus = { roadSurface: "mud", speed: 50 };
  rs.updateVehicle(fakeBus, 0.016);
  assertTruthy(fakeBus._roadSurface !== null, "updateVehicle sets _roadSurface");
  assertEqual(fakeBus._roadSurfaceName, "mud", "updateVehicle sets _roadSurfaceName");
  assertEqual(fakeBus._roadSurface.gripMultiplier, 0.42, "updateVehicle resolves mud surface");
  const noSurfaceBus = { speed: 0 };
  rs.updateVehicle(noSurfaceBus, 0.016);
  assertEqual(noSurfaceBus._roadSurfaceName, "asphalt", "updateVehicle defaults to asphalt");
  assertEqual(noSurfaceBus._roadSurface.gripMultiplier, 1.0, "updateVehicle resolves asphalt surface");
  const nullBus = null;
  rs.updateVehicle(nullBus, 0.016);
  assertTruthy(true, "updateVehicle handles null vehicle");
}

// ============================================
// TEST 24: destroy
// ============================================
console.log("\n--- TEST 24: destroy ---");
{
  const rs = freshRoadSurfaceSystem();
  rs.destroy();
  assertTruthy(!rs._active, "system is inactive after destroy");
  assertTruthy(rs._surfaceCache.size === 0, "surface cache cleared after destroy");
}

console.log("\n=== " + passedCount + " passed, " + failedCount + " failed ===");
if (failedCount === 0) {
  console.log("PHASE 10B TASK 12 TESTS: ALL PASSED");
} else {
  console.log("PHASE 10B TASK 12 TESTS: FAILURES DETECTED");
  process.exit(1);
}
