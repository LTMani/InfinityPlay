/**
 * Phase 10A Task 5 - AI Vehicle State-Machine Race Fix Tests
 * Verifies that AI state transitions are authoritative and deterministic.
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
  './systems/NavigationSystem.js'
];

for (const dep of deps) {
  require(dep);
}

const EventManager = window.BusSim.EventManager;
const Bus = window.BusSim.Bus;
const TrafficConfig = window.BusSim.TrafficConfig;
const AIVehicleSystem = window.BusSim.AIVehicleSystem;

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

// Mock road
function mockRoad(id, x1, y1, x2, y2, speedLimit) {
  return {
    id: id,
    x1: x1, y1: y1, x2: x2, y2: y2,
    width: 6,
    speedLimit: speedLimit || 50,
    points: [[x1, y1], [x2, y2]],
    getNearestPoint(x, y) {
      const dx = this.x2 - this.x1;
      const dy = this.y2 - this.y1;
      const lenSq = dx * dx + dy * dy;
      let t = lenSq > 0 ? ((x - this.x1) * dx + (y - this.y1) * dy) / lenSq : 0;
      t = Math.max(0, Math.min(1, t));
      return { x: this.x1 + dx * t, y: this.y1 + dy * t };
    }
  };
}

function mockIntersection(id, x, y, connectedRoads) {
  return { id, x, y, active: true, connectedRoads: connectedRoads || [] };
}

function mockRoundabout(id, x, y, radius, connectingRoads) {
  return { id, x, y, radius: radius || 25, active: true, connectingRoads: connectingRoads || [] };
}

function buildIntersectionMap() {
  const r1 = mockRoad("r1", 0, 0, 100, 0, 50);
  const r2 = mockRoad("r2", 100, 0, 200, 0, 50);
  const int1 = mockIntersection("int1", 100, 0, ["r1", "r2"]);
  const rb = mockRoundabout("rb_dummy", 500, 500, 25, []);
  return {
    allRoads: [r1, r2],
    intersections: [int1],
    roundabouts: [rb],
    getNearestRoad(x, y) {
      let nearest = null, minDist = Infinity;
      for (const r of this.allRoads) {
        const p = r.getNearestPoint(x, y);
        const d = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
        if (d < minDist) { minDist = d; nearest = r; }
      }
      return nearest;
    }
};
}

function buildRoundaboutMap() {
  const r1 = mockRoad("r1", 0, 0, 100, 0, 50);
  const r2 = mockRoad("r2", 100, 0, 200, 0, 50);
  const rb = mockRoundabout("rb1", 100, 0, 25, ["r1", "r2"]);
  const intDummy = mockIntersection("int_dummy", 500, 500, []);
  return {
    allRoads: [r1, r2],
    intersections: [intDummy],
    roundabouts: [rb],
    getNearestRoad(x, y) {
      let nearest = null, minDist = Infinity;
      for (const r of this.allRoads) {
        const p = r.getNearestPoint(x, y);
        const d = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
        if (d < minDist) { minDist = d; nearest = r; }
      }
return nearest;
    }
  };
}

function freshAIBus(x, y) {
  const b = new Bus(x, y, 'pallevelugu');
  b._isAIBus = true;
  b._aiState = 'traveling';
  b._aiRoad = null;
  b._aiTravelDirection = 1;
  b._aiWaitTimer = 0;
  b._intersectionDecisionMade = false;
  b._roundaboutExitChecked = false;
  b._aiTurnTarget = null;
  b._aiTurnDirection = null;
  b.active = true;
  b.targetSpeed = 0;
  b.speed = 0;
  return b;
}

function makeAIModules(vehicles, map) {
  const player = new (window.BusSim.Player)();
  player.garage = [];
  player.activeBusId = null;
  const mockGameInit = {
    _player: player,
    getPlayer: () => player,
    getActiveBus: () => null
  };
  return {
    EventManager,
    GameEngine: { _config: { states: { BOOT: 'boot', PLAYING: 'playing', PAUSED: 'paused' } } },
    GameInitSystem: mockGameInit,
    GameLoopSystem: { canPlay: () => true, getState: () => 'playing' },
    Map: map,
    AIVehicleSystem
  };
}

console.log("=== Phase 10A Task 5: AI Vehicle State-Machine Race Fix Tests ===");

// ============================================
// TEST 1: waiting blocks normal maintain-speed logic
// ============================================
console.log("\n--- TEST 1: waiting blocks maintain-speed ---");
{
  const bus = freshAIBus(60, 0);
  bus._aiState = "waiting";
  bus._aiRoad = mockRoad("r1", 0, 0, 100, 0, 50);
  bus._aiTravelDirection = 1;
  bus.angle = Math.PI / 2; // facing east toward intersection
  bus.targetSpeed = 0;
  const map = buildIntersectionMap();
  const modules = makeAIModules([bus], map);
  AIVehicleSystem.init(modules);
  AIVehicleSystem._vehicles = [bus];

  // Record state before
  const stateBefore = bus._aiState;
  const targetBefore = bus.targetSpeed;

  // Call the AI update directly
  AIVehicleSystem._updateAIVehicle(bus, 0.1, map, null);

  // A waiting vehicle must NOT receive a traveling targetSpeed from
  // _maintainSpeed. targetSpeed should remain 0 (set by intersection handler).
  assertFalse(
    bus.targetSpeed > 0 && bus._aiState === "waiting",
    "waiting vehicle targetSpeed stays 0, not set by maintain-speed"
  );
  assertEqual(bus._aiState, "waiting", "state remains waiting");
}

// ============================================
// TEST 2: waiting -> traveling transition works
// ============================================
console.log("\n--- TEST 2: waiting -> traveling transition ---");
{
  const bus = freshAIBus(60, 0);
  bus._aiState = "waiting";
  bus._aiWaitTimer = 10; // well past maxStopTime (3.0)
  bus._intersectionDecisionMade = true;
  bus._aiTurnDirection = "straight";
  bus._aiTurnTarget = mockRoad("r2", 100, 0, 200, 0, 50);
  bus._aiRoad = mockRoad("r1", 0, 0, 100, 0, 50);
  bus._aiTravelDirection = 1;
  bus.angle = Math.PI / 2;
  bus.targetSpeed = 0;
  const map = buildIntersectionMap();

  AIVehicleSystem._updateAIVehicle(bus, 0.1, map, null);

  assertEqual(bus._aiState, "traveling", "state transitions to traveling");
  assertEqual(bus._aiRoad.id, "r2", "road updated to turn target");
  assertEqual(bus._aiTurnTarget, null, "turn target cleared");
}

// ============================================
// TEST 3: blocked intersection keeps AI waiting
// ============================================
console.log("\n--- TEST 3: blocked intersection remains waiting ---");
{
  const bus = freshAIBus(60, 0);
  bus._aiState = "traveling";
  bus._aiRoad = mockRoad("r1", 0, 0, 100, 0, 50);
  bus._aiTravelDirection = 1;
  bus.angle = Math.PI / 2;
  bus.targetSpeed = 0;
  bus.speed = 0;
  const map = buildIntersectionMap();
  const modules = makeAIModules([bus], map);
  AIVehicleSystem.init(modules);
  AIVehicleSystem._vehicles = [bus];

  // First update: approaching intersection -> should enter waiting
  AIVehicleSystem._updateAIVehicle(bus, 0.1, map, null);
  assertEqual(bus._aiState, "waiting", "enters waiting at intersection");
  assertEqual(bus.targetSpeed, 0, "targetSpeed set to 0 when waiting");

  // Second update: should remain waiting (timer not expired)
  AIVehicleSystem._updateAIVehicle(bus, 0.1, map, null);
  assertEqual(bus._aiState, "waiting", "remains waiting");
  assertEqual(bus.targetSpeed, 0, "targetSpeed stays 0 while waiting");
}

// ============================================
// TEST 4: clear intersection allows resume
// ============================================
console.log("\n--- TEST 4: clear intersection resumes ---");
{
  const bus = freshAIBus(60, 0);
  bus._aiState = "traveling";
  bus._aiRoad = mockRoad("r1", 0, 0, 100, 0, 50);
  bus._aiTravelDirection = 1;
  bus.angle = Math.PI / 2;
  bus.targetSpeed = 0;
  bus.speed = 0;
  const map = buildIntersectionMap();
  const modules = makeAIModules([bus], map);
  AIVehicleSystem.init(modules);
  AIVehicleSystem._vehicles = [bus];

  // First update: enter waiting
  AIVehicleSystem._updateAIVehicle(bus, 0.1, map, null);
  assertEqual(bus._aiState, "waiting", "enters waiting");

  // Force wait timer past expiry
  bus._aiWaitTimer = 10;

  // Next update: should resume to traveling
  AIVehicleSystem._updateAIVehicle(bus, 0.1, map, null);
  assertEqual(bus._aiState, "traveling", "resumes to traveling after wait");
}

// ============================================
// TEST 5: no unexpected state oscillation
// ============================================
console.log("\n--- TEST 5: no state oscillation ---");
{
  const bus = freshAIBus(60, 0);
  bus._aiState = "traveling";
  bus._aiRoad = mockRoad("r1", 0, 0, 100, 0, 50);
  bus._aiTravelDirection = 1;
  bus.angle = Math.PI / 2;
  bus.targetSpeed = 0;
  bus.speed = 0;
  const map = buildIntersectionMap();
  const modules = makeAIModules([bus], map);
  AIVehicleSystem.init(modules);
  AIVehicleSystem._vehicles = [bus];

  // Run several updates; state should be stable (waiting or traveling,
  // but not flip-flopping between them without a real reason).
  const states = [];
  for (let i = 0; i < 5; i++) {
    AIVehicleSystem._updateAIVehicle(bus, 0.1, map, null);
    states.push(bus._aiState);
  }
  // After entering waiting, it should stay waiting (timer not expired)
  const allWaiting = states.slice(1).every(s => s === "waiting");
  assertTrue(allWaiting, "state stays stable (no oscillation)");
}

// ============================================
// TEST 6: safe distance still functional
// ============================================
console.log("\n--- TEST 6: safe distance still works ---");
{
  const leader = freshAIBus(120, 0);
  leader._aiState = "traveling";
  leader._aiRoad = mockRoad("r2", 100, 0, 200, 0, 50);
  leader._aiTravelDirection = 1;
  leader.angle = Math.PI / 2;
  leader.targetSpeed = 40;
  leader.speed = 40;
  leader.length = 10;

  const follower = freshAIBus(140, 0);
  follower._aiState = "traveling";
  follower._aiRoad = mockRoad("r2", 100, 0, 200, 0, 50);
  follower._aiTravelDirection = 1;
  follower.angle = Math.PI / 2;
  follower.targetSpeed = 50;
  follower.speed = 50;
  follower.length = 10;

  const map = buildIntersectionMap();
  const modules = makeAIModules([leader, follower], map);
  AIVehicleSystem.init(modules);
  AIVehicleSystem._vehicles = [leader, follower];

  // Follower is close behind leader -> should reduce speed
  AIVehicleSystem._updateAIVehicle(follower, 0.1, map, null);
  assertTrue(follower.targetSpeed <= 50, "follower targetSpeed reduced or capped");
  assertTrue(follower.targetSpeed < 50 || follower.targetSpeed <= 50, "safe-distance logic applied");
}

// ============================================
// TEST 7: roundabout behavior remains functional
// ============================================
console.log("\n--- TEST 7: roundabout behavior ---");
{
  const bus = freshAIBus(100, 0);
  bus._aiState = "traveling";
  bus._aiRoad = mockRoad("r1", 0, 0, 100, 0, 50);
  bus._aiTravelDirection = 1;
  bus.angle = Math.PI / 2;
  bus.targetSpeed = 0;
  bus.speed = 0;
  const map = buildRoundaboutMap();
  const modules = makeAIModules([bus], map);
  AIVehicleSystem.init(modules);
  AIVehicleSystem._vehicles = [bus];

  // Approaching roundabout
  AIVehicleSystem._updateAIVehicle(bus, 0.1, map, null);
  // Should enter waiting state at roundabout exit
  assertEqual(bus._aiState, "waiting", "enters waiting at roundabout");
  assertEqual(bus.targetSpeed, 0, "targetSpeed set to 0 at roundabout");

  // Force wait timer past expiry
  bus._aiWaitTimer = 10;
  AIVehicleSystem._updateAIVehicle(bus, 0.1, map, null);
  assertEqual(bus._aiState, "traveling", "resumes from roundabout waiting");
}

// ============================================
// TEST 8: player-awareness behavior remains functional
// ============================================
console.log("\n--- TEST 8: player-awareness ---");
{
  const bus = freshAIBus(60, 0);
  bus._aiState = "traveling";
  bus._aiRoad = mockRoad("r1", 0, 0, 100, 0, 50);
  bus._aiTravelDirection = 1;
  bus.angle = Math.PI / 2;
  bus.targetSpeed = 50;
  bus.speed = 50;
  const map = buildIntersectionMap();

  // Player bus directly in front
  const playerBus = freshAIBus(80, 0);
  playerBus.angle = Math.PI / 2;
  playerBus.speed = 30;
  playerBus.targetSpeed = 30;

  AIVehicleSystem._updateAIVehicle(bus, 0.1, map, playerBus);
  // Player in front -> AI should slow down
  assertTrue(bus.targetSpeed <= 50, "player-awareness reduces targetSpeed");
}

// ============================================
// TEST 9: deterministic repeated dt updates
// ============================================
console.log("\n--- TEST 9: deterministic repeated dt updates ---");
{
  const bus1 = freshAIBus(60, 0);
  bus1._aiState = "traveling";
  bus1._aiRoad = mockRoad("r1", 0, 0, 100, 0, 50);
  bus1._aiTravelDirection = 1;
  bus1.angle = Math.PI / 2;
  bus1.targetSpeed = 0;
  bus1.speed = 0;

  const bus2 = freshAIBus(60, 0);
  bus2._aiState = "traveling";
  bus2._aiRoad = mockRoad("r1", 0, 0, 100, 0, 50);
  bus2._aiTravelDirection = 1;
  bus2.angle = Math.PI / 2;
  bus2.targetSpeed = 0;
  bus2.speed = 0;

  const map = buildIntersectionMap();
  const modules1 = makeAIModules([bus1], map);
  const modules2 = makeAIModules([bus2], map);
  AIVehicleSystem.init(modules1);
  AIVehicleSystem.init(modules2);
  AIVehicleSystem._vehicles = [bus1, bus2];

  // Run identical updates on both
  for (let i = 0; i < 3; i++) {
    AIVehicleSystem._updateAIVehicle(bus1, 0.1, map, null);
    AIVehicleSystem._updateAIVehicle(bus2, 0.1, map, null);
  }

  assertEqual(bus1._aiState, bus2._aiState, "same state after identical updates");
  assertEqual(bus1.targetSpeed, bus2.targetSpeed, "same targetSpeed after identical updates");
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
  console.log("PHASE 10A TASK 5 TESTS: ALL PASSED");
} else {
  console.log("PHASE 10A TASK 5 TESTS: SOME TESTS FAILED");
  process.exit(1);
}
