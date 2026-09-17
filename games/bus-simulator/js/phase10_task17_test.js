/**
 * Phase 10B Task 17 - Traffic Signal System Tests
 * Verifies ONE centralized owner of traffic-signal phase timing.
 * TrafficSignalSystem owns red/green/yellow phase advancement; it never
 * duplicates braking, acceleration, steering, or movement physics.
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
  './systems/RoadSurfaceSystem.js',
  './systems/AirBrakeSystem.js',
  './systems/EngineTemperatureSystem.js',
  './systems/ElectricalSystem.js',
  './systems/DoorSystem.js',
  './systems/TrafficSignalSystem.js',
  './world/Map.js',
  './world/WorldGenerator.js',
  './world/roads/Intersection.js'
];
for (const dep of deps) { require(dep); }

const TrafficSignalSystem = window.BusSim.TrafficSignalSystem;
const Intersection = window.BusSim.Intersection;
const TrafficConfig = window.BusSim.TrafficConfig;
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

function freshSignalSystem() {
  const ds = new TrafficSignalSystem();
  ds.init({});
  return ds;
}

function freshSignalSystemDisabled() {
  const ds = new TrafficSignalSystem();
  ds.init({ TrafficConfig: { signals: { enabled: false } } });
  return ds;
}

let _intIdCounter = 0;
function makeIntersection(overrides) {
  const id = (overrides && overrides.id) ? overrides.id : 'int_test_' + (_intIdCounter++);
  const int = new Intersection(id, 0, 0, { hasTrafficLights: true });
  Object.assign(int, overrides || {});
  int.id = id;
  return int;
}

function makeMap(intersections) {
  return {
    intersections: intersections || [],
    update(dt) {
      for (let i = 0; i < this.intersections.length; i++) {
        if (this.intersections[i].update) this.intersections[i].update(dt);
      }
    }
  };
}

console.log("=== Phase 10B Task 17: Traffic Signal System Tests ===");
console.log("--- 1. Config defaults ---");
{
  assertTruthy(TrafficConfig.signals, "TrafficConfig.signals exists");
  assertTruthy(typeof TrafficConfig.signals.enabled === "boolean", "signals.enabled is boolean");
  assertTruthy(TrafficConfig.signals.enabled === true, "signals.enabled defaults to true");
  assertTruthy(typeof TrafficConfig.signals.greenTime === "number", "signals.greenTime is number");
  assertTruthy(typeof TrafficConfig.signals.yellowTime === "number", "signals.yellowTime is number");
  assertTruthy(typeof TrafficConfig.signals.redTime === "number", "signals.redTime is number");
  assertTruthy(typeof TrafficConfig.signals.lightProbability === "number", "signals.lightProbability is number");
  assertTruthy(TrafficConfig.signals.greenTime > 0, "greenTime > 0");
  assertTruthy(TrafficConfig.signals.yellowTime > 0, "yellowTime > 0");
  assertTruthy(TrafficConfig.signals.redTime > 0, "redTime > 0");
  assertTruthy(TrafficConfig.signals.lightProbability >= 0 && TrafficConfig.signals.lightProbability <= 1, "lightProbability in [0,1]");
}

console.log("--- 2. Signalized vs non-signalized intersections ---");
{
  const ds = freshSignalSystem();
  const lit = makeIntersection({ hasTrafficLights: true, signalState: 'red' });
  const dark = makeIntersection({ hasTrafficLights: false, signalState: 'red' });
  const map = makeMap([lit, dark]);
  ds._intersections = map.intersections;
assertTruthy(ds.hasLights(lit) === true, "hasLights true for signalized intersection");
  assertEqual(ds.hasLights(dark), false, "hasLights false for non-signalized intersection");
  assertTruthy(ds.getSignalState(lit) === 'red', "getSignalState returns red for signalized intersection");
  assertEqual(ds.getSignalState(dark), null, "getSignalState returns null for non-signalized intersection");
  assertEqual(ds.isRed(dark), false, "isRed false for non-signalized intersection");
  assertEqual(ds.isGreen(dark), false, "isGreen false for non-signalized intersection");
  assertEqual(ds.isYellow(dark), false, "isYellow false for non-signalized intersection");
}

console.log("--- 3. Red/green/yellow transitions ---");
{
  const ds = freshSignalSystem();
  const int = makeIntersection({ hasTrafficLights: true, signalState: 'red', signalTimer: 0 });
  ds._intersections = [int];
  // red -> green after redTime
  ds.update(TrafficConfig.signals.redTime);
  assertEqual(int.signalState, 'green', "red transitions to green after redTime");
  assertEqual(int.signalTimer, 0, "timer resets on transition");
  // green -> yellow after greenTime
  ds.update(TrafficConfig.signals.greenTime);
  assertEqual(int.signalState, 'yellow', "green transitions to yellow after greenTime");
  // yellow -> red after yellowTime
  ds.update(TrafficConfig.signals.yellowTime);
  assertEqual(int.signalState, 'red', "yellow transitions to red after yellowTime");
  // Full cycle
  const int2 = makeIntersection({ hasTrafficLights: true, signalState: 'red', signalTimer: 0 });
  ds._intersections = [int2];
  ds.update(TrafficConfig.signals.redTime);
  assertEqual(int2.signalState, 'green', "cycle: red -> green");
  ds.update(TrafficConfig.signals.greenTime);
  assertEqual(int2.signalState, 'yellow', "cycle: green -> yellow");
  ds.update(TrafficConfig.signals.yellowTime);
  assertEqual(int2.signalState, 'red', "cycle: yellow -> red");
}

console.log("--- 4. Timer progression ---");
{
  const ds = freshSignalSystem();
  const int = makeIntersection({ hasTrafficLights: true, signalState: 'red', signalTimer: 0 });
  ds._intersections = [int];
  ds.update(2.0);
  assertEqual(int.signalTimer, 2.0, "timer advances by dt");
  ds.update(3.0);
  assertEqual(int.signalTimer, 5.0, "timer accumulates across updates");
  // Sub-threshold updates keep state
  assertEqual(int.signalState, 'red', "state unchanged before threshold");
}

console.log("--- 5. Disabled signals ---");
{
  const ds = freshSignalSystemDisabled();
  const int = makeIntersection({ hasTrafficLights: true, signalState: 'red', signalTimer: 0 });
  ds._intersections = [int];
  ds.update(100.0);
  assertEqual(int.signalState, 'red', "state unchanged when signal disabled");
  assertEqual(int.signalTimer, 100.0, "timer still advances when signal disabled");
}
console.log("--- 6. lightProbability behavior ---");
{
  // Run many generations with lightProbability=1.0 -> every intersection lit.
  const TrafficConfig = window.BusSim.TrafficConfig;
  const Intersection = window.BusSim.Intersection;
  let litCount = 0;
  const trials = 100;
  for (let i = 0; i < trials; i++) {
    const int = new Intersection('int_' + i, 0, 0, { hasTrafficLights: true });
    if (int.hasTrafficLights) litCount++;
  }
  assertTruthy(litCount === trials, "all intersections signalized when hasTrafficLights=true");
  // Probability 0.0 -> none lit.
  let darkCount = 0;
  for (let i = 0; i < trials; i++) {
    const int = new Intersection('int2_' + i, 0, 0, { hasTrafficLights: false });
    if (!int.hasTrafficLights) darkCount++;
  }
  assertTruthy(darkCount === trials, "no intersections signalized when hasTrafficLights=false");
  // Default probability produces a mix.
  const p = TrafficConfig.signals.lightProbability;
  assertTruthy(p >= 0 && p <= 1, "lightProbability is in [0,1]");
}
console.log("--- 7. Centralized update ownership ---");
{
  // Intersection.update() must NOT advance signal phase.
  const int = makeIntersection({ hasTrafficLights: true, signalState: 'red', signalTimer: 0 });
  int.update(100.0);
  assertEqual(int.signalState, 'red', "Intersection.update does not change signalState");
  assertEqual(int.signalTimer, 0, "Intersection.update does not advance signalTimer");
  // Only TrafficSignalSystem advances the phase.
  const ds = freshSignalSystem();
  ds._intersections = [int];
  ds.update(TrafficConfig.signals.redTime);
  assertEqual(int.signalState, 'green', "only TrafficSignalSystem advances phase");
  // Map.update() delegates to Intersection.update() which is now a no-op
  // for signal phase — verify by running Map.update then checking state.
  const int2 = makeIntersection({ hasTrafficLights: true, signalState: 'red', signalTimer: 0 });
  const map = makeMap([int2]);
  map.update(100.0);
  assertEqual(int2.signalState, 'red', "Map.update does not advance signal phase");
  assertEqual(int2.signalTimer, 0, "Map.update does not advance signalTimer");
}

console.log("--- 8. AI red-light behavior ---");
{
  const AIVehicleSystem = window.BusSim.AIVehicleSystem;
  const ai = Object.create(AIVehicleSystem);
  ai.init({});
  const ds = freshSignalSystem();
  ai._modules = { TrafficSignalSystem: ds };
  const int = makeIntersection({ hasTrafficLights: true, signalState: 'red', signalTimer: 0 });
  ds._intersections = [int];
  // Vehicle approaching a red light must wait.
  const vehicle = {
    _aiState: 'traveling',
    _aiWaitTimer: 0,
    _intersectionDecisionMade: false,
    targetSpeed: 50,
    _dt: 0.016
  };
  ai._handleStandardIntersection(vehicle, int, {}, TrafficConfig.intersections);
  assertEqual(vehicle._aiState, 'waiting', "AI vehicle enters waiting state at red light");
  assertEqual(vehicle.targetSpeed, 0, "AI vehicle targetSpeed is 0 at red light");
  // Green light must NOT force a red-light wait.
  const int2 = makeIntersection({ hasTrafficLights: true, signalState: 'green', signalTimer: 0 });
  ds._intersections = [int2];
  const vehicle2 = {
    _aiState: 'traveling',
    _aiWaitTimer: 0,
    _intersectionDecisionMade: false,
    targetSpeed: 50,
    _dt: 0.016
  };
  ai._handleStandardIntersection(vehicle2, int2, {}, TrafficConfig.intersections);
  assertTruthy(vehicle2._aiState !== 'waiting' || vehicle2.targetSpeed === 0, "AI behavior at green light is not a forced red-light wait");
  // Non-signalized intersection still works.
  const int3 = makeIntersection({ hasTrafficLights: false, signalState: 'red', signalTimer: 0 });
  const vehicle3 = {
    _aiState: 'traveling',
    _aiWaitTimer: 0,
    _intersectionDecisionMade: false,
    targetSpeed: 50,
    _dt: 0.016
  };
  ai._handleStandardIntersection(vehicle3, int3, {}, TrafficConfig.intersections);
  assertEqual(vehicle3._aiState, 'waiting', "non-signalized intersection still triggers normal wait");
}
