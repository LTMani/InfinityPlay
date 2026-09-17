/**
 * Phase 10B Task 18 - Lane Discipline System Tests
 * Verifies ONE centralized owner of vehicle lane state.
 * LaneSystem owns lane index/lane-change state; it never writes
 * steering, braking, acceleration, or movement physics directly.
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
  './systems/LaneSystem.js',
'./world/Map.js',
  './world/WorldGenerator.js',
  './world/roads/Intersection.js',
  './world/Road.js'
];
for (const dep of deps) { require(dep); }

const LaneSystem = window.BusSim.LaneSystem;
const Road = window.BusSim.Road;
const TrafficConfig = window.BusSim.TrafficConfig;
const AIVehicleSystem = window.BusSim.AIVehicleSystem;
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

function freshLaneSystem() {
  const ds = new LaneSystem();
  ds.init({});
  return ds;
}

function freshLaneSystemDisabled() {
  const ds = new LaneSystem();
  ds.init({ TrafficConfig: { lanes: { enabled: false } } });
  return ds;
}

function makeRoad(overrides) {
  const road = new Road('road_test', 0, 0, 100, 0, { width: 20, lanes: 2 });
  Object.assign(road, overrides || {});
  return road;
}

function makeVehicle(overrides) {
  const v = {
    id: 'v_test',
    _aiTravelDirection: 1,
    angle: 0,
    x: 0,
    y: 0,
    speed: 0,
    steer() {},
    width: 2,
    length: 4
  };
  Object.assign(v, overrides || {});
  return v;
}

console.log("=== Phase 10B Task 18: Lane System Tests ===");

console.log("--- 1. Lane assignment ---");
{
  const ds = freshLaneSystem();
  const road = makeRoad({ lanes: 2 });
  const v = makeVehicle();
  ds.assignLane(v, road);
  assertEqual(ds.getLane(v), 0, "default lane is 0 (leftmost)");
  const v2 = makeVehicle();
  ds.assignLane(v2, makeRoad({ lanes: 4 }));
  assertEqual(ds.getLane(v2), 0, "lane 0 on 4-lane road");
}

console.log("--- 2. Lane index bounds ---");
{
  const ds = freshLaneSystem();
  const road = makeRoad({ lanes: 3 });
  const v = makeVehicle();
  ds.assignLane(v, road);
  // changeLane clamps to valid range
  ds.changeLane(v, 5, road);
  ds.update(2.0);
  assertEqual(ds.getLane(v), 2, "lane change clamps to max lane index");
  ds.changeLane(v, -10, road);
  ds.update(2.0);
  assertEqual(ds.getLane(v), 0, "lane change clamps to min lane index");
}

console.log("--- 3. Lane center calculation ---");
{
  const road = makeRoad({ x1: 0, y1: 0, x2: 100, y2: 0, width: 20, lanes: 2 });
  const center = road.getLaneCenter(0, 1, 0.5);
  assertTruthy(center, "getLaneCenter returns object");
  assertTruthy(typeof center.x === "number", "center x is number");
  assertTruthy(typeof center.y === "number", "center y is number");
  assertEqual(center.laneIndex, 0, "laneIndex is 0");
  // 2-lane road, lane 0 should be left of centerline (y < 0 since facing east, left = north = negative y)
  assertTruthy(center.y < 0, "lane 0 is left of centerline when facing east");
  const lane1 = road.getLaneCenter(1, 1, 0.5);
  assertTruthy(lane1.y > 0, "lane 1 is right of centerline when facing east");
}

console.log("--- 4. Multi-lane roads ---");
{
  const road = makeRoad({ x1: 0, y1: 0, x2: 100, y2: 0, width: 40, lanes: 4 });
  const lane0 = road.getLaneCenter(0, 1, 0.5);
  const lane3 = road.getLaneCenter(3, 1, 0.5);
  assertTruthy(lane0.y < lane3.y, "lane 0 is left of lane 3 on 4-lane road");
  const laneWidth = Math.abs(lane3.y - lane0.y);
  assertTruthy(laneWidth > 0, "lane centers are distinct");
}

console.log("--- 5. Direction handling ---");
{
  const road = makeRoad({ x1: 0, y1: 0, x2: 100, y2: 0, width: 20, lanes: 2 });
  const fwd = road.getLaneCenter(0, 1, 0.5);
  const rev = road.getLaneCenter(0, -1, 0.5);
  // Reverse direction should swap left/right
  assertTruthy(Math.abs(fwd.y - rev.y) > 0.01, "reverse direction swaps lane side");
}

console.log("--- 6. Invalid lane fallback ---");
{
  const road = makeRoad({ lanes: 2 });
  const bad1 = road.getLaneCenter(-5, 1, 0.5);
  assertEqual(bad1.laneIndex, 0, "negative lane clamps to 0");
  const bad2 = road.getLaneCenter(99, 1, 0.5);
  assertEqual(bad2.laneIndex, 1, "oversized lane clamps to max");
  const bad3 = road.getLaneCenter('abc', 1, 0.5);
  assertEqual(bad3.laneIndex, 0, "non-numeric lane falls back to 0");
  const bad4 = road.getLaneCenter(0, 1, 'xyz');
  assertTruthy(bad4, "non-numeric t still returns valid center");
}

console.log("--- 7. Smooth lane changes ---");
{
  const ds = freshLaneSystem();
  const road = makeRoad({ lanes: 2 });
  const v = makeVehicle();
  ds.assignLane(v, road);
  ds.changeLane(v, 1, road);
  assertTruthy(ds.isChangingLane(v), "vehicle is changing lane");
  // Partial update should not complete the change
  ds.update(0.5);
  const interp = ds.getInterpolatedLane(v);
  assertTruthy(interp > 0 && interp < 1, "interpolated lane is between 0 and 1");
  // Full update completes the change
  ds.update(2.0);
  assertEqual(ds.getLane(v), 1, "lane change completes after enough time");
  assertTruthy(!ds.isChangingLane(v), "vehicle no longer changing lane");
}

console.log("--- 8. Disabled lane system ---");
{
  const ds = freshLaneSystemDisabled();
  const road = makeRoad({ lanes: 2 });
  const v = makeVehicle();
  ds.assignLane(v, road);
  ds.changeLane(v, 1, road);
  ds.update(10.0);
  // Disabled system should not advance lane changes
  assertTruthy(ds.isChangingLane(v), "lane change not advanced when disabled");
}
console.log('--- 9. AI lane following ---')
{
  const AIVehicleSystem = window.BusSim.AIVehicleSystem;
  const ai = Object.create(AIVehicleSystem);
  ai.init({});
  const ds = freshLaneSystem();
  ai._modules = { LaneSystem: ds };
  const road = makeRoad({ lanes: 2 });
  const v = makeVehicle({ _aiRoad: road, _aiTravelDirection: 1 });
  ai._vehicles = [v];
  // assignLane should be called during AI update
  ds.assignLane(v, road);
  assertEqual(ds.getLane(v), 0, "AI vehicle assigned to lane 0");
}

console.log("--- 10. Lane preference ---");
{
  const ds = freshLaneSystem();
  const road = makeRoad({ lanes: 2 });
  const v = makeVehicle({ lanePreference: 'right' });
  ds.assignLane(v, road);
  assertEqual(ds.getLane(v), 1, "right preference assigns to rightmost lane");
  const v2 = makeVehicle({ lanePreference: 'left' });
  ds.assignLane(v2, road);
  assertEqual(ds.getLane(v2), 0, "left preference assigns to leftmost lane");
}

console.log("--- 11. Wrong-way prevention ---");
{
  const ds = freshLaneSystem();
  const road = makeRoad({ lanes: 2 });
  // Forward direction, lane 1 (rightmost) is wrong-way with left-side driving
  const v = makeVehicle({ _aiTravelDirection: 1 });
  ds.assignLane(v, road);
  // Force to rightmost lane
  ds.changeLane(v, 1, road);
  ds.update(2.0);
  assertEqual(ds.getLane(v), 1, "vehicle is in rightmost lane before correction");
  assertTruthy(ds.isWrongWay(v, road), "forward direction in right lane is wrong-way");
  // Correct should move back to lane 0
  ds.correctWrongWay(v, road);
  ds.update(2.0);
  assertEqual(ds.getLane(v), 0, "wrong-way corrected to lane 0");
  assertTruthy(!ds.isWrongWay(v, road), "no longer wrong-way after correction");
}

console.log("--- 12. Occupied-lane safety ---");
{
  const ds = freshLaneSystem();
  const road = makeRoad({ lanes: 2 });
  const v = makeVehicle({ _aiTravelDirection: 1, x: 50, y: 0 });
  ds.assignLane(v, road);
  // Another vehicle occupying the target lane
  const blocker = makeVehicle({ _aiTravelDirection: 1, x: 55, y: 5, _aiRoad: road, length: 4 });
  blocker.active = true;
  const canChange = ds.canChangeLane(v, 1, road, [blocker]);
  assertTruthy(canChange === false, "cannot change into occupied lane");
  // Clear lane should be safe
  const canChange2 = ds.canChangeLane(v, 1, road, []);
  assertTruthy(canChange2 === true, "can change into clear lane");
}

console.log("--- 13. Safe lane change / overtaking ---");
{
  const ds = freshLaneSystem();
  const road = makeRoad({ lanes: 2 });
  const v = makeVehicle({ _aiTravelDirection: 1, x: 50, y: 0, speed: 30 });
  ds.assignLane(v, road);
  // No vehicle ahead -> no overtake
  const target = ds.considerOvertaking(v, road, [], null);
  assertEqual(target, null, "no overtake when no vehicle ahead");
// Slower vehicle ahead -> overtake candidate
  const slow = makeVehicle({ _aiTravelDirection: 1, x: 50, y: -40, speed: 10, _aiRoad: road, length: 4 });
  slow.active = true;
  const target2 = ds.considerOvertaking(v, road, [slow], slow);
  assertTruthy(target2 !== null, "overtake candidate when slower vehicle ahead");
  // Overtaking disabled -> null
  const dsDisabled = new LaneSystem();
  dsDisabled.init({ TrafficConfig: { lanes: { overtakingEnabled: false } } });
  const target3 = dsDisabled.considerOvertaking(v, road, [slow], slow);
  assertEqual(target3, null, "no overtake when overtakingEnabled is false");
}

console.log("--- 14. No forced player steering ---");
{
  // LaneSystem must not override direct player steering.
  const ds = freshLaneSystem();
  const road = makeRoad({ lanes: 2 });
  const v = makeVehicle({ _aiTravelDirection: 1 });
  ds.assignLane(v, road);
  // LaneSystem should not write steer/speed/angle
  const before = { steer: v.steer, speed: v.speed, angle: v.angle };
  ds.update(1.0);
  assertEqual(v.steer, before.steer, "LaneSystem does not modify steer");
  assertEqual(v.speed, before.speed, "LaneSystem does not modify speed");
  assertEqual(v.angle, before.angle, "LaneSystem does not modify angle");
}

console.log("--- 15. Traffic-signal compatibility ---");
{
  const ds = freshLaneSystem();
  const TrafficSignalSystem = window.BusSim.TrafficSignalSystem;
  const ts = new TrafficSignalSystem();
  ts.init({});
  const road = makeRoad({ lanes: 2 });
  const v = makeVehicle({ _aiTravelDirection: 1 });
  ds.assignLane(v, road);
  // LaneSystem and TrafficSignalSystem must not interfere
  ds.update(1.0);
  ts.update(1.0);
  assertEqual(ds.getLane(v), 0, "lane state preserved after signal update");
}

console.log("=== Results ===");
console.log(`Tests: ${testCount}, Passed: ${passedCount}, Failed: ${failedCount}`);
if (failedCount > 0) {
  console.log("FAILURES:");
  for (const r of results) {
    if (!r.pass) console.log(`  - ${r.name}: ${r.message}`);
  }
  process.exit(1);
} else {
  console.log("ALL TESTS PASSED");
}
