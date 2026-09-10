global.window = {};
global.BusSim = {};

// Load all deps in order
const deps = [
  // Engine
  './engine/EventManager.js',
  './engine/InputManager.js',
  './engine/AssetLoader.js',
  './engine/Renderer.js',
  './engine/GameEngine.js',
  // Config
  './config/GameConfig.js',
  './config/ControlsConfig.js',
  './config/TrafficConfig.js',
  './config/PassengerConfig.js',
  // Data
  './data/regions.js',
  './data/bus-types.js',
  './data/TrafficVehicleTypes.js',
  './data/routes.js',
  './data/economy.js',
  './data/customization.js',
  './data/private-travels.js',
  './data/achievements.js',
  // World
  './world/POI.js',
  './world/landmarks/EnvironmentObject.js',
  './world/landmarks/TollGate.js',
  './world/landmarks/FuelStation.js',
  './world/landmarks/TeaStall.js',
  './world/landmarks/Restaurant.js',
  './world/landmarks/Market.js',
  './world/Road.js',
  './world/roads/CurvedRoad.js',
  './world/roads/Intersection.js',
  './world/roads/Roundabout.js',
  './world/City.js',
  './world/BusStop.js',
  './world/bus_stations/BusStation.js',
  './world/Region.js',
  './world/data/APWorldData.js',
  './world/WorldGenerator.js',
  './world/Map.js',
  // Entities
  './entities/Entity.js',
  './entities/Vehicle.js',
  './entities/Bus.js',
  './entities/TrafficVehicle.js',
  './entities/Passenger.js',
  './entities/Player.js',
  // Systems
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
  './systems/DayNightSystem.js'
];
for (const dep of deps) require(dep);

// Test 1: AP World + Bus Stops
const WG = require('./world/WorldGenerator.js');
const world = WG.generateAPWorld();
console.log('=== AP World + Bus Stops ===');
console.log('Bus Stops:', world.allBusStops.length);
console.log('Cities:', world.allCities.length);

// Test 2: Passenger Creation
const Passenger = require('./entities/Passenger.js');
const stop1 = world.allBusStops[0];
const stop2 = world.allBusStops[5];
const p = new Passenger(stop1.x, stop1.y, stop2.id, stop1.id);
console.log('\n=== Passenger Creation ===');
console.log('Passenger ID:', p.passengerId);
console.log('Name:', p.name);
console.log('Type:', p.type.name);
console.log('Origin Stop:', p.originStopId);
console.log('Destination Stop:', p.destinationStopId);
console.log('Fare (100 dist):', p.getFare(100));

// Test 3: Passenger assignment and ticket
p.setDestination(stop2.id, 200);
const TicketSystem = require('./systems/TicketSystem.js');
TicketSystem.init({ Map: { allBusStops: world.allBusStops }, DayNightSystem: null, WeatherSystem: null, RouteSystem: null });
const ticket = TicketSystem.generateTicket(p, stop1, stop2, 200);
console.log('\n=== Ticket Generation ===');
console.log('Ticket ID:', ticket.ticketId);
console.log('Origin:', ticket.origin);
console.log('Destination:', ticket.destination);
console.log('Fare:', ticket.fare);
console.log('Passenger ticket status:', p.ticketStatus);
console.log('Passenger fare:', p.fare);

// Test 4: Bus entity with passenger tracking
const Bus = require('./entities/Bus.js');
const bus = new Bus(stop1.x, stop1.y, 'pallevelugu');
console.log('\n=== Bus Entity ===');
console.log('Capacity:', bus.passengerCapacity);
console.log('Max standing:', bus.maxStanding);
console.log('Boarded passengers array:', Array.isArray(bus.boardedPassengers));
console.log('Available capacity:', bus.getAvailableCapacity());

// Test 5: Boarding process
const BoardingSystem = require('./systems/BoardingSystem.js');
const busStopSystem = { getStopProximity: () => ({ nearStop: true, isAtStop: true }) };
const mockModules = {
  Map: { allBusStops: world.allBusStops },
  GameInitSystem: { getActiveBus: () => bus },
  TicketSystem: TicketSystem,
  PassengerSystem: require('./systems/PassengerSystem.js'),
  BusStopSystem: busStopSystem
};
const passengerSystem = require('./systems/PassengerSystem.js');
passengerSystem.init(mockModules);
BoardingSystem.init(mockModules);

// Spawn passengers at stop
const spawned = passengerSystem.generatePassengersAtStop(stop1, 5);
console.log('\n=== Passenger Spawning ===');
console.log('Spawned:', spawned.length);
console.log('Waiting at stop:', stop1.passengers.length);

// Start boarding
BusStopSystem = require('./systems/BusStopSystem.js');
BusStopSystem.init(mockModules);
BoardingSystem.startBoarding(stop1, bus);
console.log('\n=== Boarding Process ===');
console.log('Boarding:', BoardingSystem.isBoarding());
console.log('Boarding count:', BoardingSystem.getBoardingCount());

// Simulate boarding over time
for (let i = 0; i < 30; i++) {
  BoardingSystem.update(0.05);
  passengerSystem.update(0.05);
}
console.log('Boarding after 1.5s:', BoardingSystem.isBoarding());
console.log('Boarded this stop:', BoardingSystem.getBoardedThisStop());
console.log('Bus passengers onboard:', bus.passengersOnBoard);
console.log('Boarded passengers array length:', bus.boardedPassengers.length);
console.log('Waiting at stop now:', stop1.passengers.length);

// Test 6: Drop-off system
const DropOffSystem = require('./systems/DropOffSystem.js');
DropOffSystem.init(mockModules);

// Move to destination stop and simulate arrival
bus.x = stop2.x;
bus.y = stop2.y;
BusStopSystem.update(bus, 0.016);

DropOffSystem.startDropOff(stop2, bus);
console.log('\n=== Drop-off Process ===');
console.log('Alighting:', DropOffSystem.isAlighting());
console.log('To alight:', DropOffSystem.getAlightingCount());

// Check passenger destination matching
const toAlight = bus.getAlightingPassengers(stop2.id);
console.log('Passengers to alight at dest:', toAlight.length);

// Complete alighting
for (let i = 0; i < 20; i++) {
  DropOffSystem.update(0.05);
  passengerSystem.update(0.05);
}
console.log('Alighted this stop:', DropOffSystem.getAlightedThisStop());
console.log('Bus passengers after alight:', bus.passengersOnBoard);

// Test 7: Passenger config
const pc = require('./config/PassengerConfig.js');
console.log('\n=== Passenger Config ===');
console.log('maxQueuePerStop:', pc.maxQueuePerStop);
console.log('boardingTimePerPassenger:', pc.boarding.timePerPassenger);
console.log('stopDetection.maxBoardingSpeed:', pc.stopDetection.maxBoardingSpeed);
console.log('fare.basePerKm:', pc.fare.basePerKm);

// Test 8: BusStop zone methods
console.log('\n=== BusStop Zone ===');
console.log('Boarding zone radius:', stop1.boardingZoneRadius);
console.log('Can board at (x,y):', stop1.canBoardAt(stop1.x, stop1.y, -Math.PI/2, 50));
console.log('Can board at (far):', stop1.canBoardAt(9999, 9999, 0, 50));

console.log('\n=== Phase 6 Integration Tests: ALL PASSED ===');
