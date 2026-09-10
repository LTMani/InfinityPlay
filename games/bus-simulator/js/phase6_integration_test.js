/**
 * Phase 6 Full Integration Test v2
 * Tests complete gameplay flow through event system:
 * 1. Bus approaches stop -> BusStopSystem detects arrival
 * 2. BusStopSystem emits arrivedAtStop -> BoardingSystem/DropOffSystem respond
 * 3. Gradual boarding with ticket generation
 * 4. Bus travels to destination
 * 5. At destination -> DropOffSystem handles alighting
 */

global.window = {};
window.BusSim = {};

// Load all dependencies first
const deps = [
  './engine/EventManager.js',
  './config/GameConfig.js',
  './config/PassengerConfig.js',
  './entities/Entity.js',
  './entities/Vehicle.js',
  './entities/Bus.js',
  './entities/Passenger.js',
  './entities/Player.js',
  './world/BusStop.js',
  './world/City.js',
  './world/Road.js',
  './world/roads/CurvedRoad.js',
  './world/roads/Intersection.js',
  './world/roads/Roundabout.js',
  './world/data/APWorldData.js',
  './world/landmarks/EnvironmentObject.js',
  './world/landmarks/TollGate.js',
  './world/landmarks/FuelStation.js',
  './world/landmarks/TeaStall.js',
  './world/landmarks/Restaurant.js',
  './world/landmarks/Market.js',
  './world/bus_stations/BusStation.js',
  './world/Map.js',
  './world/WorldGenerator.js',
  './data/economy.js',
  './data/bus-types.js',
  './data/routes.js',
  './data/private-travels.js',
  './systems/GameLoopSystem.js',
  './systems/GameInitSystem.js',
  './systems/DayNightSystem.js',
  './systems/RouteSystem.js',
  './systems/PassengerSystem.js',
  './systems/BusStopSystem.js',
  './systems/BoardingSystem.js',
  './systems/DropOffSystem.js',
  './systems/TicketSystem.js',
  './systems/TripSystem.js'
];

for (const dep of deps) {
  require(dep);
}

const EventManager = window.BusSim.EventManager;
const WorldGenerator = window.BusSim.WorldGenerator;
const Bus = window.BusSim.Bus;
const Passenger = window.BusSim.Passenger;

const PassengerSystem = window.BusSim.PassengerSystem;
const BusStopSystem = window.BusSim.BusStopSystem;
const BoardingSystem = window.BusSim.BoardingSystem;
const DropOffSystem = window.BusSim.DropOffSystem;
const TicketSystem = window.BusSim.TicketSystem;
const TripSystem = window.BusSim.TripSystem;
const GameLoopSystem = window.BusSim.GameLoopSystem;
const GameInitSystem = window.BusSim.GameInitSystem;
const DayNightSystem = window.BusSim.DayNightSystem;
const RouteSystem = window.BusSim.RouteSystem;
const RouteData = require('./data/routes.js');

// Set up modules object
const modules = {
  EventManager: EventManager,
  GameConfig: require('./config/GameConfig.js'),
  GameLoopSystem: GameLoopSystem,
  GameInitSystem: GameInitSystem,
  DayNightSystem: DayNightSystem,
  RouteSystem: RouteSystem,
  PassengerSystem: PassengerSystem,
  BusStopSystem: BusStopSystem,
  BoardingSystem: BoardingSystem,
  DropOffSystem: DropOffSystem,
  TicketSystem: TicketSystem,
  TripSystem: TripSystem
};

// Initialize EventManager
EventManager._events = {};

// Generate AP world
const world = WorldGenerator.generateAPWorld();
modules.Map = world;

// Create bus at spawn position
const bus = new Bus(world.spawnPosition.x, world.spawnPosition.y, 'palleveluru');
bus.speed = 0;
bus.targetSpeed = 0;
bus.angle = 0;

// Set up GameInitSystem mock
GameInitSystem._initialized = true;
GameInitSystem.player = { getActiveBus: () => bus };
modules.GameInitSystem.getActiveBus = () => bus;
modules.GameInitSystem.getPlayer = () => GameInitSystem.player;

// Initialize DayNightSystem
DayNightSystem.init(modules);

// Initialize RouteSystem
RouteSystem.init(modules);
RouteSystem.activeRoute = {
  id: 'route_0',
  name: 'Test Route',
  distance: 500,
  stops: []
};
RouteSystem.setRoute('route_0');

// Initialize all Phase 6 systems (order matches main.js registration)
PassengerSystem.init(modules);
BusStopSystem.init(modules);
BoardingSystem.init(modules);
DropOffSystem.init(modules);
TicketSystem.init(modules);
TripSystem.init(modules);

// Initialize GameLoopSystem
GameLoopSystem.init(modules);

const GameConfig = modules.GameConfig;
GameLoopSystem.setState(GameConfig.states.PLAYING);

// Find two stops for our test
const stop1 = world.allBusStops[0];
const stop2 = world.allBusStops[5];

console.log('=== Phase 6 Full Integration Test v2 ===');
console.log('Stop 1:', stop1.name, 'at', '(' + Math.round(stop1.x) + ', ' + Math.round(stop1.y) + ')');
console.log('Stop 2:', stop2.name, 'at', '(' + Math.round(stop2.x) + ', ' + Math.round(stop2.y) + ')');

// Spawn 5 passengers at stop1, all heading to stop2
const spawned = PassengerSystem.generatePassengersAtStop(stop1, 5);
for (const p of spawned) {
  p.setDestination(stop2.id, 500);
}
console.log('\n--- Initial State ---');
console.log('Stop 1 waiting:', stop1.passengers.length);
console.log('Bus passengers:', bus.passengersOnBoard);
console.log('Tickets sold:', TicketSystem.totalTicketsSold);
console.log('Revenue:', TicketSystem.totalRevenue);

// Track events
const eventLog = [];
const eventNames = ['arrivedAtStop', 'boardingStarted', 'boardingCompleted',
  'passengersAlighting', 'passengersAlighted', 'passengerBoarded',
  'passengerAlighted', 'fareCollected', 'hudFeedback', 'stopCompleted'];
for (const name of eventNames) {
  EventManager.on(name, (data) => {
    eventLog.push(name + (data ? JSON.stringify(data).substring(0, 80) : ''));
  });
}

const results = [];

// === PHASE 1: Approach Stop 1 ===
console.log('\n--- Approaching Stop 1 ---');

bus.x = stop1.x;
bus.y = stop1.y;
bus.speed = 2; // Below maxBoardingSpeed (5)

// Run BusStopSystem updates to trigger stop detection
for (let i = 0; i < 50; i++) {
  BusStopSystem.update(bus, 0.05);
}

const phase1Pass = BusStopSystem.isAtStop && BusStopSystem.currentStop === stop1;
console.log('BusStopSystem detected stop:', phase1Pass);
console.log('BoardingSystem started:', BoardingSystem.isBoarding());
console.log('Boarding count:', BoardingSystem.getBoardingCount());
results.push({ name: 'BusStopSystem detects arrival', pass: phase1Pass });

// === PHASE 2: Boarding Process ===
console.log('\n--- Boarding Process ---');

// Simulate 15 seconds of game time (enough to board all 5 at 2.5s each = 12.5s)
// Only run BoardingSystem and BusStopSystem (not PassengerSystem to avoid new spawns)
for (let i = 0; i < 300; i++) {
  BusStopSystem.update(bus, 0.05);
  BoardingSystem.update(0.05);
  DropOffSystem.update(0.05);
}

// Capture boarding state BEFORE traveling
const boardingState = {
  busPassengers: bus.passengersOnBoard,
  boardedPassengersArray: bus.boardedPassengers.length,
  ticketsOnPassengers: bus.boardedPassengers.filter(p => p.ticket).length,
  boardingCompleted: !BoardingSystem.isBoarding()
};

console.log('Bus passengers after boarding:', boardingState.busPassengers);
console.log('BoardedPassengers array length:', boardingState.boardedPassengersArray);
console.log('Tickets on passengers:', boardingState.ticketsOnPassengers);
console.log('Boarding complete:', boardingState.boardingCompleted);
console.log('BoardingSystem.getBoardedThisStop():', BoardingSystem.getBoardedThisStop());

const phase2Pass = boardingState.busPassengers === 5 &&
  boardingState.boardedPassengersArray === 5 &&
  boardingState.ticketsOnPassengers === 5;
console.log('All 5 passengers boarded with tickets:', phase2Pass);
results.push({ name: 'All passengers boarded with tickets', pass: phase2Pass });

// === PHASE 3: Travel to Stop 2 ===
console.log('\n--- Traveling to Stop 2 ---');

// Complete current stop
BusStopSystem.completeStop();

// Move bus to stop2
bus.x = stop2.x;
bus.y = stop2.y;
bus.speed = 2;

// Run stop detection
for (let i = 0; i < 50; i++) {
  BusStopSystem.update(bus, 0.05);
}

const phase3Pass = BusStopSystem.isAtStop && BusStopSystem.currentStop === stop2;
console.log('Arrived at stop2:', phase3Pass);
console.log('DropOffSystem alighting:', DropOffSystem.isAlighting());
console.log('Passengers to alight:', bus.getAlightingPassengers(stop2.id).length);
results.push({ name: 'BusStopSystem detects arrival at stop2', pass: phase3Pass });

// === PHASE 4: Alighting Process ===
console.log('\n--- Alighting Process ---');

for (let i = 0; i < 200; i++) {
  BusStopSystem.update(bus, 0.05);
  BoardingSystem.update(0.05);
  DropOffSystem.update(0.05);
}

const phase4Pass = bus.passengersOnBoard === 0 &&
  bus.boardedPassengers.length === 0 &&
  DropOffSystem.getAlightedThisStop() === 5;
console.log('Bus passengers after alighting:', bus.passengersOnBoard);
console.log('BoardedPassengers array after:', bus.boardedPassengers.length);
console.log('Alighted this stop:', DropOffSystem.getAlightedThisStop());
results.push({ name: 'All passengers alighted at destination', pass: phase4Pass });

// === PHASE 5: Revenue Collection ===
console.log('\n--- Revenue Check ---');
const phase5Pass = TicketSystem.totalRevenue > 0 || TicketSystem.totalTicketsSold >= 5;
console.log('Tickets sold:', TicketSystem.totalTicketsSold);
console.log('Total revenue:', TicketSystem.totalRevenue);
console.log('Pending fare:', TicketSystem.pendingFare);
results.push({ name: 'Revenue/ticket tracking', pass: phase5Pass });

// === PHASE 6: PassengerSystem Stats ===
console.log('\n--- PassengerSystem Stats ---');
const phase6Pass = PassengerSystem.getTotalBoarded() === 5 &&
  PassengerSystem.getTotalAlighted() === 5;
console.log('Total boarded:', PassengerSystem.getTotalBoarded());
console.log('Total alighted:', PassengerSystem.getTotalAlighted());
console.log('Total spawned:', PassengerSystem.getTotalSpawned());
results.push({ name: 'PassengerSystem tracks boarded/alighted', pass: phase6Pass });

// === SUMMARY ===
console.log('\n=== EVENT LOG (key events) ===');
console.log('Total events logged:', eventLog.length);
for (const e of eventLog.slice(0, 15)) {
  console.log('  ', e);
}

console.log('\n=== RESULTS ===');
const passed = results.filter(r => r.pass).length;
const failed = results.filter(r => !r.pass).length;
for (const r of results) {
  console.log((r.pass ? 'PASS' : 'FAIL') + ': ' + r.name);
}
console.log('\n=== ' + passed + ' passed, ' + failed + ' failed ===');
if (failed === 0) {
  console.log('FULL GAMEPLAY FLOW: ALL TESTS PASSED');
} else {
  console.log('FULL GAMEPLAY FLOW: SOME TESTS FAILED');
  process.exit(1);
}
