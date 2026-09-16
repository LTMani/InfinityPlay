/**
 * Phase 10A Task 4 - Weather Friction -> Physics Integration Tests
 *
 * Verifies that WeatherSystem.getRoadFrictionMultiplier() is actually
 * consumed by the physics pipeline through a single integration point.
 *
 *   - MovementSystem sets bus.roadFrictionMultiplier from WeatherSystem
 *     before the physics step.
 *   - Vehicle.update() applies that multiplier to acceleration,
 *     deceleration, and rolling resistance.
 *   - Clear weather (1.0) preserves existing physics behavior.
 *   - Rain (0.8) and storm (0.6) reduce grip through the traction path.
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
const Vehicle = window.BusSim.Vehicle;
const Bus = window.BusSim.Bus;
const WeatherSystem = window.BusSim.WeatherSystem;
const MovementSystem = window.BusSim.MovementSystem;

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

function approxLess(a, b, eps, name) {
  return test(name, a <= b + eps, `expected <= ${b}, got ${a}`);
}

function approxEqual(a, b, eps, name) {
  return test(name, Math.abs(a - b) <= eps, `expected ~${b}, got ${a} (eps ${eps})`);
}

function approxGreater(a, b, eps, name) {
  return test(name, a >= b - eps, `expected >= ${b}, got ${a}`);
}

// Fresh Vehicle with controllable friction and speed.
function freshVehicle() {
  const v = new Vehicle(0, 0, 'bus');
  v.active = true;
  v.speed = 0;
  v.targetSpeed = 0;
  v.roadFrictionMultiplier = 1.0;
  return v;
}

// Fresh Bus with controllable friction and speed.
function freshBus() {
  const b = new Bus(0, 0, 'pallevelugu');
  b.active = true;
  b.speed = 0;
  b.targetSpeed = 0;
  b.roadFrictionMultiplier = 1.0;
  return b;
}

function makeMovementModules(bus) {
  const player = new (window.BusSim.Player)();
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
    InputSystem: {
      getThrottle: () => 1,
      getAction: (n) => (n === 'brake' ? 0 : (n === 'steerLeft' ? 0 : (n === 'steerRight' ? 0 : (n === 'handbrake' ? 0 : 0)))),
      getSteering: () => 0,
      accelerate: 1
    },
    WeatherSystem,
    Map: { pois: [], allCities: [{ x: 0, y: 0, type: 'metropolitan' }] }
  };
}

console.log('=== Phase 10A Task 4: Weather Friction -> Physics Tests ===');

// ============================================
// TEST 1: Clear weather baseline unchanged
// ============================================
console.log('\n--- TEST 1: Clear weather baseline unchanged ---');
{
  const v = freshVehicle();
  v.targetSpeed = 50;
  v.roadFrictionMultiplier = 1.0;
  const before = v.speed;
  v.update(0.1);
  // Clear friction (1.0) accelerates at the full throttle rate minus resistance.
  const fullThrottle = v.acceleration * 1.0 * 0.1 * 3.6; // 2.88
  assertTruthy(v.speed > 0, 'clear weather accelerates forward');
  assertTruthy(v.speed <= fullThrottle + 1e-9, 'clear weather does not exceed full throttle');
  // Resistance term is tiny at low speed; speed should be very close to full throttle
  approxEqual(v.speed, fullThrottle, 0.01, 'clear weather near full throttle');
  assertEqual(v.roadFrictionMultiplier, 1.0, 'friction stays at 1.0 for clear');
}

// ============================================
// TEST 2: Rain friction applied
// ============================================
console.log('\n--- TEST 2: Rain friction applied ---');
{
  const vClear = freshVehicle();
  const vRain = freshVehicle();
  vClear.targetSpeed = 50;
  vRain.targetSpeed = 50;
  vClear.roadFrictionMultiplier = 1.0;
  vRain.roadFrictionMultiplier = 0.8;
  vClear.update(0.1);
  vRain.update(0.1);
  approxGreater(vClear.speed, vRain.speed + 1e-9, 1e-9, 'clear accelerates faster than rain');
  assertTruthy(vRain.speed < vClear.speed, 'rain reduces acceleration vs clear');
}

// ============================================
// TEST 3: Storm friction applied
// ============================================
console.log('\n--- TEST 3: Storm friction applied ---');
{
  const vClear = freshVehicle();
  const vStorm = freshVehicle();
  vClear.targetSpeed = 50;
  vStorm.targetSpeed = 50;
  vClear.roadFrictionMultiplier = 1.0;
  vStorm.roadFrictionMultiplier = 0.6;
  vClear.update(0.1);
  vStorm.update(0.1);
  approxGreater(vClear.speed, vStorm.speed + 1e-9, 1e-9, 'clear accelerates faster than storm');
  approxGreater(vClear.speed, vStorm.speed * 1.3, 1e-9, 'storm grip notably lower than clear');
}

// ============================================
// TEST 4: Friction affects physics exactly once
// ============================================
console.log('\n--- TEST 4: Friction applied exactly once ---');
{
  const v = freshVehicle();
  v.targetSpeed = 50;
  v.roadFrictionMultiplier = 0.8;
  // Two identical ticks with same friction/target/dt must produce
  // identical speed deltas (friction applied exactly once per tick).
  const before1 = v.speed;
  v.update(0.1);
  const delta1 = v.speed - before1;
  const before2 = v.speed;
  v.update(0.1);
  const delta2 = v.speed - before2;
  // Deltas may differ slightly due to resistance compounding, but both
  // must be positive and the ratio must stay near 1.0 (not 2x).
  assertTruthy(delta1 > 0 && delta2 > 0, 'both ticks accelerate forward');
  const ratio = delta2 / delta1;
  assertTruthy(ratio > 0.9 && ratio < 1.1, 'deltas consistent (no double application)');
}

// ============================================
// TEST 5: Deterministic behavior
// ============================================
console.log('\n--- TEST 5: Deterministic behavior ---');
{
  const v1 = freshVehicle();
  const v2 = freshVehicle();
  v1.targetSpeed = 50;
  v2.targetSpeed = 50;
  v1.roadFrictionMultiplier = 0.7;
  v2.roadFrictionMultiplier = 0.7;
  v1.update(0.1);
  v2.update(0.1);
  assertEqual(v1.speed, v2.speed, 'same friction + inputs -> identical speed');
}

// ============================================
// TEST 6: Switching weather updates physics behavior
// ============================================
console.log('\n--- TEST 6: Switching weather updates physics ---');
{
  const v = freshVehicle();
  v.targetSpeed = 50;
  // Clear tick
  v.roadFrictionMultiplier = 1.0;
  const beforeClear = v.speed;
  v.update(0.1);
  const clearDelta = v.speed - beforeClear;
  // Switch to storm
  v.roadFrictionMultiplier = 0.6;
  const beforeStorm = v.speed;
  v.update(0.1);
  const stormDelta = v.speed - beforeStorm;
  // Storm delta must be smaller than clear delta (lower grip)
  approxGreater(clearDelta, stormDelta + 1e-9, 1e-9, 'storm reduces acceleration delta');
  assertTruthy(v.roadFrictionMultiplier === 0.6, 'friction reflects storm after switch');
}

// ============================================
// TEST 7: Existing weather multiplier values respected
// ============================================
console.log('\n--- TEST 7: Existing weather multiplier values respected ---');
{
  WeatherSystem.init({
    EventManager,
    GameLoopSystem: { canPlay: () => false, getState: () => 'menu' },
    DayNightSystem: { getBrightness: () => 1, getHours: () => 12 }
  });
  assertEqual(WeatherSystem.getRoadFrictionMultiplier(), 1.0, 'clear friction is 1.0');

  WeatherSystem._setWeather('rain', 0.8);
  assertEqual(WeatherSystem.getRoadFrictionMultiplier(), 0.8, 'rain friction is 0.8');

  WeatherSystem._setWeather('storm', 0.9);
  assertEqual(WeatherSystem.getRoadFrictionMultiplier(), 0.6, 'storm friction is 0.6');

  WeatherSystem._setWeather('cloudy', 0.5);
  assertEqual(WeatherSystem.getRoadFrictionMultiplier(), 1.0, 'cloudy friction is 1.0');
}

// ============================================
// TEST 8: MovementSystem integrates friction from WeatherSystem
// ============================================
console.log('\n--- TEST 8: MovementSystem integrates friction ---');
{
  const bus = freshBus();
  const modules = makeMovementModules(bus);
  MovementSystem.init(modules);
  // Set weather to rain
  modules.WeatherSystem._setWeather('rain', 0.8);
  bus.targetSpeed = 50;
  MovementSystem.update(0.1);
  assertTruthy(bus.roadFrictionMultiplier < 1.0, 'MovementSystem set friction from rain');
  assertEqual(bus.roadFrictionMultiplier, 0.8, 'friction value matches rain');

  // Switch to storm
  modules.WeatherSystem._setWeather('storm', 0.9);
  MovementSystem.update(0.1);
  assertEqual(bus.roadFrictionMultiplier, 0.6, 'friction updated to storm');

  // Switch to clear
  modules.WeatherSystem._setWeather('clear', 0.5);
  MovementSystem.update(0.1);
  assertEqual(bus.roadFrictionMultiplier, 1.0, 'friction restored to clear');
}

// ============================================
// TEST 9: Clear weather preserves existing physics (APIs unchanged)
// ============================================
console.log('\n--- TEST 9: Clear weather preserves existing physics ---');
{
  const bus = freshBus();
  bus.targetSpeed = 50;
  bus.roadFrictionMultiplier = 1.0;
  bus.update(0.1);
  // With friction=1.0, the vehicle accelerates at full throttle minus resistance
  const fullThrottle = bus.acceleration * 1.0 * 0.1 * 3.6;
  assertTruthy(bus.speed > 0, 'clear weather accelerates forward');
  approxEqual(bus.speed, fullThrottle, 0.01, 'clear weather near full throttle');
  // Verify existing APIs still work
  bus.accelerate(0.5);
  assertTruthy(typeof bus.targetSpeed === 'number', 'accelerate API intact');
  bus.brake(0.5);
  assertTruthy(typeof bus.speed === 'number', 'brake API intact');
  bus.steer(0.5);
  assertTruthy(typeof bus.steering === 'number', 'steer API intact');
}

// ============================================
// TEST 10: Braking affected by friction (traction path)
// ============================================
console.log('\n--- TEST 10: Braking affected by friction ---');
{
  const vClear = freshVehicle();
  const vRain = freshVehicle();
  vClear.speed = 50;
  vRain.speed = 50;
  vClear.targetSpeed = 0;
  vRain.targetSpeed = 0;
  vClear.roadFrictionMultiplier = 1.0;
  vRain.roadFrictionMultiplier = 0.6;
  vClear.update(0.1);
  vRain.update(0.1);
  // Clear should decelerate faster (more grip) than rain -> LOWER remaining speed
  test('clear stops faster than rain', vClear.speed < vRain.speed,
    `clear remaining ${vClear.speed}, rain remaining ${vRain.speed}`);
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
  console.log('PHASE 10A TASK 4 TESTS: ALL PASSED');
} else {
  console.log('PHASE 10A TASK 4 TESTS: SOME TESTS FAILED');
  process.exit(1);
}

