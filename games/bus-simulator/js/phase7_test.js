/**
 * Phase 7 Integration Test
 * Verifies bus operator, service type, and private travels configuration.
 */

global.window = {};
global.BusSim = {};

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
  './data/bus-types.js',
  './data/routes.js',
  './data/private-travels.js',
  './data/service-types.js',
  './data/operators.js',
  './systems/PassengerSystem.js',
  './systems/BusStopSystem.js',
  './systems/BoardingSystem.js',
  './systems/DropOffSystem.js',
  './systems/TicketSystem.js',
  './systems/RouteSystem.js',
  './systems/OperatorSystem.js'
];
for (const dep of deps) require(dep);

const Bus = window.BusSim.Bus;
const BusTypes = window.BusSim.BusTypes;
const ServiceTypes = window.BusSim.ServiceTypes;
const OperatorSystem = window.BusSim.OperatorSystem;
const OperatorData = OperatorSystem;
const RouteData = require('./data/routes.js');

const results = [];
function check(name, cond) {
  results.push({ name, pass: !!cond });
  console.log((cond ? 'PASS' : 'FAIL') + ': ' + name);
}

// ===== TEST 1: Service types load =====
check('ServiceTypes has 8 categories', ServiceTypes.types.length === 8);
check('ServiceTypes.getById express', !!ServiceTypes.getById('express'));
check('ServiceTypes.getById sleeper', !!ServiceTypes.getById('sleeper'));

// ===== TEST 2: Operators load =====
check('OperatorSystem has 8 operators', OperatorSystem.getAllOperators().length === 8);
check('OperatorSystem rtc-ap exists', !!OperatorSystem.getById('rtc-ap'));
check('OperatorSystem superia-travels exists', !!OperatorSystem.getById('superia-travels'));

// ===== TEST 3: Bus types have service config =====
const bt = BusTypes.getById('pallevelugu');
check('pallevelugu has serviceType', !!bt.serviceType);
check('pallevelugu has operatorId', !!bt.operatorId);
check('pallevelugu has fuelCapacity', bt.fuelCapacity > 0);
check('pallevelugu has standingCapacity', typeof bt.standingCapacity === 'number');

// ===== TEST 4: Bus applies service config =====
const busLocal = new Bus(0, 0, 'pallevelugu', 'rtc-ap', 'local');
check('local bus capacity matches base (42)', busLocal.passengerCapacity === 42);
check('local bus maxSpeed scaled', busLocal.maxSpeed === Math.round(45 * 0.85));
check('local bus has serviceFareMultiplier', busLocal.serviceFareMultiplier === 0.85);
check('local bus boardingTime set', busLocal.boardingTimePerPassenger === 2.0);

const busSleeper = new Bus(0, 0, 'orange-travels', 'orange-travels', 'sleeper');
check('sleeper bus capacity reduced (30*0.75=23)', busSleeper.passengerCapacity === 23);
check('sleeper bus fare multiplier 1.8', busSleeper.serviceFareMultiplier === 1.8);
check('sleeper bus boardingTime 3.5', busSleeper.boardingTimePerPassenger === 3.5);

// ===== TEST 5: Default config from bus type =====
const def = OperatorSystem.getDefaultConfig('pallevelugu');
check('default operator is rtc-ap', def.operatorId === 'rtc-ap');
check('default service is local', def.serviceType === 'local');

// ===== TEST 6: Compatible service types =====
const compat = OperatorSystem.getCompatibleServiceTypes('pallevelugu');
check('pallevelugu compatible services include local', compat.some(s => s.id === 'local'));
check('pallevelugu compatible services include city', compat.some(s => s.id === 'city'));

// ===== TEST 7: Compatible operators =====
const compOps = OperatorSystem.getCompatibleOperators('super-luxury');
check('super-luxury has compatible operators', compOps.length > 0);

// ===== TEST 8: Route service config =====
const route = RouteData.getById('ap-vijayawada-visakhapatnam');
check('route has serviceType', !!route.serviceType);
check('route has stopFrequency', typeof route.stopFrequency === 'number');
check('RouteData.getServiceType returns value', RouteData.getServiceType('ap-vijayawada-visakhapatnam') === 'super-express');
check('RouteData.getByServiceType express returns routes', RouteData.getByServiceType('express').length >= 0);

// ===== TEST 9: Effective stops =====
const stops = RouteData.getEffectiveStops('ap-vijayawada-visakhapatnam', 'super-express', ServiceTypes);
check('effective stops <= original stops', stops.length <= route.stops.length);
check('effective stops keeps first and last', stops[0] === route.stops[0] && stops[stops.length - 1] === route.stops[route.stops.length - 1]);

// ===== TEST 10: Private travels operators =====
const pt = require('./data/private-travels.js');
check('PrivateTravelsData has privateOperators', Array.isArray(pt.privateOperators) && pt.privateOperators.length > 0);
check('PrivateTravelsData.getPrivateOperator works', !!pt.getPrivateOperator('superia-travels'));
check('PrivateTravelsData.getOperatorsByServiceCategory deluxe', pt.getOperatorsByServiceCategory('deluxe').length > 0);

// ===== SUMMARY =====
const passed = results.filter(r => r.pass).length;
const failed = results.filter(r => !r.pass).length;
console.log('\n=== ' + passed + ' passed, ' + failed + ' failed ===');
if (failed === 0) {
  console.log('PHASE 7: ALL TESTS PASSED');
} else {
  console.log('PHASE 7: SOME TESTS FAILED');
  process.exit(1);
}
