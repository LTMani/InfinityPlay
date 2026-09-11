global.window = {};
global.BusSim = {};

// Load all deps
const deps = [
  './engine/EventManager.js',
  './config/GameConfig.js',
  './config/PassengerConfig.js',
  './entities/Entity.js',
  './entities/Vehicle.js',
  './entities/Bus.js',
  './entities/Passenger.js',
  './world/BusStop.js',
  './world/WorldGenerator.js',
  './world/Map.js',
  './data/economy.js',
  './systems/PassengerSystem.js',
  './systems/BusStopSystem.js',
  './systems/BoardingSystem.js',
  './systems/DropOffSystem.js',
  './systems/TicketSystem.js'
];
for (const dep of deps) require(dep);

const WG = require('./world/WorldGenerator.js');
const world = WG.generateAPWorld();
const stop1 = world.allBusStops[0];
const stop2 = world.allBusStops[5];

const Passenger = require('./entities/Passenger.js');
const Bus = require('./entities/Bus.js');
const TicketSystem = require('./systems/TicketSystem.js');
const BoardingSystem = require('./systems/BoardingSystem.js');
const DropOffSystem = require('./systems/DropOffSystem.js');
const PassengerSystem = require('./systems/PassengerSystem.js');
const BusStopSystem = require('./systems/BusStopSystem.js');

const bus = new Bus(stop1.x, stop1.y, 'pallevelugu');

const mockModules = {
  Map: { allBusStops: world.allBusStops },
  GameInitSystem: { getActiveBus: () => bus },
  TicketSystem: TicketSystem,
  PassengerSystem: PassengerSystem,
  BusStopSystem: BusStopSystem
};

TicketSystem.init(mockModules);
PassengerSystem.init(mockModules);
BoardingSystem.init(mockModules);
DropOffSystem.init(mockModules);
BusStopSystem.init(mockModules);

// Spawn 5 passengers at stop1
const spawned = PassengerSystem.generatePassengersAtStop(stop1, 5);
console.log('=== Boarding Test ===');
console.log('Spawned:', spawned.length);
console.log('Waiting:', stop1.passengers.length);

// Set destinations for all passengers
for (const p of stop1.passengers) {
  p.setDestination(stop2.id, 200);
}

// Start boarding
BoardingSystem.startBoarding(stop1, bus);

// Simulate 20 seconds (should board 5 passengers at 2.5s each = ~12.5s needed)
for (let i = 0; i < 400; i++) {
  BoardingSystem.update(0.05);
  PassengerSystem.update(0.05);
}

console.log('Boarded this stop:', BoardingSystem.getBoardedThisStop());
console.log('Bus onboard:', bus.passengersOnBoard);
console.log('BoardedPassengers array:', bus.boardedPassengers.length);
console.log('Waiting remaining:', stop1.passengers.length);
console.log('Boarding complete:', !BoardingSystem.isBoarding());

// Verify tickets were generated
console.log('Tickets generated:', TicketSystem._tickets.length);
for (const t of TicketSystem._tickets) {
  console.log('  Ticket:', t.ticketId, 'fare:', t.fare, 'paid:', t.paid);
}

// Move to destination and test drop-off
console.log('\n=== Drop-off Test ===');
bus.x = stop2.x;
bus.y = stop2.y;
BusStopSystem.update(bus, 0.016);

const toAlight = bus.getAlightingPassengers(stop2.id);
console.log('Passengers to alight:', toAlight.length);

// Start drop-off
DropOffSystem.startDropOff(stop2, bus);

// Simulate alighting (1.5s per passenger, 5 passengers = 7.5s)
for (let i = 0; i < 200; i++) {
  DropOffSystem.update(0.05);
  BusStopSystem.update(bus, 0.05);
}

console.log('Alighted this stop:', DropOffSystem.getAlightedThisStop());
console.log('Bus onboard after:', bus.passengersOnBoard);
console.log('BoardedPassengers after:', bus.boardedPassengers.length);

console.log('\n=== All Phase 6 Tests Passed ===');
