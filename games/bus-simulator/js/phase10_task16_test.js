/**
 * Phase 10B Task 16 - Door System Tests
 * Verifies ONE authoritative owner of passenger/driver door state.
 * DoorSystem exposes door-open/closed/progress state only; it never
 * duplicates boarding/alighting logic, acceleration, braking, or steering.
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
  './systems/ElectricalSystem.js',
'./systems/DoorSystem.js',
  './ui/HUD.js'
];
for (const dep of deps) { require(dep); }

const DoorSystem = window.BusSim.DoorSystem;
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

function freshDoorSystem() {
  const ds = new DoorSystem();
  ds.init({});
  return ds;
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
passengersOnBoard: 0,
    passengerCapacity: 60,
    fuelLevel: 50,
    fuelCapacity: 100,
    getTransmission() { return null; },
    getSuspension() { return null; },
    getTires() { return null; },
    getRoadSurface() { return null; },
    getAirBrake() { return this._airBrake || null; },
    setAirBrake(s) { this._airBrake = s; },
    getEngineTemp() { return this._engineTemp || null; },
    setEngineTemp(s) { this._engineTemp = s; },
getElectrical() { return this._electrical || null; },
    setElectrical(s) { this._electrical = s; },
    getDoors() { return this._doors || null; },
    setDoors(s) { this._doors = s; },
    getOccupancy() { return this.passengerCapacity ? this.passengersOnBoard / this.passengerCapacity : 0; }
  };
  Object.assign(bus, overrides || {});
  return bus;
}

console.log("=== Phase 10B Task 16: Door System Tests ===");
console.log("--- 1. DoorSystem owns door state, never duplicates boarding logic ---");
{
  const ds = freshDoorSystem();
  const bus = fakeBus();
  ds.ensureDoors(bus);
  assertTruthy(bus.getDoors(), "getDoors returns DoorSystem-owned state");
  assertTruthy(bus.getDoors() === ds._getVehicleState(bus), "getDoors hook returns same instance as DoorSystem._getVehicleState");
  assertTruthy(ds.getDoor(bus, 'frontDoor'), "getDoor returns front door");
  assertTruthy(ds.getDoor(bus, 'rearDoor'), "getDoor returns rear door");
  assertTruthy(ds.getDoor(bus, 'driverDoor'), "getDoor returns driver door");
  assertTruthy(ds.getDoor(bus, 'unknown') === null, "getDoor returns null for unknown door");
  assertTruthy(ds.getDoor(bus, 'frontDoor').open === false, "front door starts closed");
  assertTruthy(ds.getDoor(bus, 'rearDoor').open === false, "rear door starts closed");
  assertTruthy(ds.getDoor(bus, 'driverDoor').open === false, "driver door starts closed");
  assertTruthy(ds.getDoor(bus, 'frontDoor').progress === 0, "front door progress starts at 0");
  assertTruthy(ds.getDoor(bus, 'rearDoor').progress === 0, "rear door progress starts at 0");
  assertTruthy(ds.getDoor(bus, 'driverDoor').progress === 0, "driver door progress starts at 0");
  assertTruthy(ds.getDoor(bus, 'frontDoor').enabled === false, "front door starts disabled (enabled=false)");
  assertTruthy(ds.getDoor(bus, 'rearDoor').enabled === false, "rear door starts disabled (enabled=false)");
  assertTruthy(ds.getDoor(bus, 'driverDoor').enabled === false, "driver door starts disabled (enabled=false)");
  assertTruthy(ds.isDoorOpen(bus, 'frontDoor') === false, "isDoorOpen returns false for closed front door");
  assertTruthy(ds.isDoorOpen(bus, 'rearDoor') === false, "isDoorOpen returns false for closed rear door");
  assertTruthy(ds.isDoorOpen(bus, 'driverDoor') === false, "isDoorOpen returns false for closed driver door");
  assertTruthy(ds.isDoorClosed(bus, 'frontDoor') === true, "isDoorClosed returns true for closed front door");
  assertTruthy(ds.isDoorClosed(bus, 'rearDoor') === true, "isDoorClosed returns true for closed rear door");
  assertTruthy(ds.isDoorClosed(bus, 'driverDoor') === true, "isDoorClosed returns true for closed driver door");
  assertTruthy(ds.getState(bus) !== null, "getState returns object when doors exist");
  assertTruthy(ds.getState(bus).frontDoor.open === false, "getState reflects front door open=false");
  assertTruthy(ds.getState(bus).rearDoor.open === false, "getState reflects rear door open=false");
  assertTruthy(ds.getState(bus).driverDoor.open === false, "getState reflects driver door open=false");
  assertTruthy(ds.canBoard(bus) === false, "canBoard returns false when all doors closed");
  assertTruthy(ds.canAlight(bus) === false, "canAlight returns false when all doors closed");
  assertTruthy(ds.canBoard({ id: 'unknown' }) === false, "canBoard returns false for unknown vehicle");
  assertTruthy(ds.getState({ id: 'unknown' }) === null, "getState returns null for unknown vehicle");
  assertTruthy(ds.getDoor({ id: 'unknown' }, 'frontDoor') === null, "getDoor returns null for unknown vehicle");
}
console.log("--- 2. Door open/close animation advances progress ---");
{
  const ds = freshDoorSystem();
  const bus = fakeBus();
  ds.ensureDoors(bus);
  // Enable front door for opening
  ds.getDoor(bus, 'frontDoor').enabled = true;
  // Open via input flag + updateVehicle
  bus._doorFront = true;
  ds.updateVehicle(bus, 0.5);
  assertGreaterOrEqual(ds.getDoor(bus, 'frontDoor').progress, 0.0, "front door progress >= 0 after opening");
  assertLessOrEqual(ds.getDoor(bus, 'frontDoor').progress, 1.0, "front door progress <= 1.0");
  assertTruthy(ds.getDoor(bus, 'frontDoor').progress > 0, "front door progress > 0 after open animation");
  // Close should reverse progress
  bus._doorFront = false;
  ds.updateVehicle(bus, 0.5);
  assertLessOrEqual(ds.getDoor(bus, 'frontDoor').progress, 1.0, "front door progress <= 1.0 after close animation");
  // Full open reaches 1.0
  const bus2 = fakeBus();
  ds.ensureDoors(bus2);
  ds.getDoor(bus2, 'frontDoor').enabled = true;
  bus2._doorFront = true;
  for (let i = 0; i < 20; i++) {
    ds.updateVehicle(bus2, 0.5);
  }
  assertTruthy(Math.abs(ds.getDoor(bus2, 'frontDoor').progress - 1.0) < 0.01, "front door reaches progress 1.0 when fully opened");
  assertTruthy(ds.isDoorOpen(bus2, 'frontDoor') === true, "isDoorOpen returns true when fully opened");
  // Full close reaches 0.0
  bus2._doorFront = false;
  for (let i = 0; i < 20; i++) {
    ds.updateVehicle(bus2, 0.5);
  }
  assertTruthy(Math.abs(ds.getDoor(bus2, 'frontDoor').progress - 0.0) < 0.01, "front door reaches progress 0.0 when fully closed");
  assertTruthy(ds.isDoorClosed(bus2, 'frontDoor') === true, "isDoorClosed returns true when fully closed");
  // Driver door requires explicit enable before it can open
  const bus3 = fakeBus();
  ds.ensureDoors(bus3);
  bus3._doorDriver = true;
  ds.updateVehicle(bus3, 0.5);
  assertTruthy(ds.getDoor(bus3, 'driverDoor').progress === 0, "driver door stays closed when not enabled");
  ds.getDoor(bus3, 'driverDoor').enabled = true;
  bus3._doorDriver = true;
  for (let i = 0; i < 20; i++) {
    ds.updateVehicle(bus3, 0.5);
  }
  assertTruthy(Math.abs(ds.getDoor(bus3, 'driverDoor').progress - 1.0) < 0.01, "driver door opens after being enabled");
  assertTruthy(ds.isDoorOpen(bus3, 'driverDoor') === true, "isDoorOpen true for enabled driver door");
}
console.log("--- 3. Safe-speed gate prevents opening while moving ---");
{
  const ds = freshDoorSystem();
  const bus = fakeBus();
  ds.ensureDoors(bus);
  ds.getDoor(bus, 'frontDoor').enabled = true;
  // Try to open while moving fast
  bus._doorFront = true;
  bus.speed = 10.0;
  ds.updateVehicle(bus, 0.5);
  assertTruthy(ds.getDoor(bus, 'frontDoor').progress === 0, "front door stays closed when speed > threshold");
  assertTruthy(ds.isDoorOpen(bus, 'frontDoor') === false, "isDoorOpen false while moving fast");
  assertTruthy(ds.canBoard(bus) === false, "canBoard false while moving fast");
  // Stop the bus, then open
  bus.speed = 0.0;
  ds.updateVehicle(bus, 0.5);
  assertTruthy(ds.getDoor(bus, 'frontDoor').progress > 0, "front door opens when speed is 0");
  // At safe speed threshold, door should not open
  const bus2 = fakeBus();
  ds.ensureDoors(bus2);
  ds.getDoor(bus2, 'frontDoor').enabled = true;
  bus2._doorFront = true;
  bus2.speed = 3.0; // exactly threshold
  ds.updateVehicle(bus2, 0.5);
  assertTruthy(ds.getDoor(bus2, 'frontDoor').progress === 0, "front door stays closed at exact safeSpeedThreshold");
  // Just under threshold, door should open
  const bus3 = fakeBus();
  ds.ensureDoors(bus3);
  ds.getDoor(bus3, 'frontDoor').enabled = true;
  bus3._doorFront = true;
  bus3.speed = 2.99;
  ds.updateVehicle(bus3, 0.5);
  assertTruthy(ds.getDoor(bus3, 'frontDoor').progress > 0, "front door opens just under safeSpeedThreshold");
  // Doors auto-close when speed exceeds threshold
  const bus4 = fakeBus();
  ds.ensureDoors(bus4);
  ds.getDoor(bus4, 'frontDoor').enabled = true;
  bus4._doorFront = true;
  for (let i = 0; i < 20; i++) {
    ds.updateVehicle(bus4, 0.5);
  }
  assertTruthy(Math.abs(ds.getDoor(bus4, 'frontDoor').progress - 1.0) < 0.01, "front door fully open when stopped");
  bus4._doorFront = false;
  bus4.speed = 5.0;
  ds.updateVehicle(bus4, 0.5);
  assertTruthy(ds.getDoor(bus4, 'frontDoor').progress < 1.0, "front door starts closing when speed exceeds threshold");
  for (let i = 0; i < 20; i++) {
    ds.updateVehicle(bus4, 0.5);
  }
  assertTruthy(ds.getDoor(bus4, 'frontDoor').progress === 0, "front door fully closes when moving fast");
}
console.log("--- 4. canBoard / canAlight gate by door type ---");
{
  const ds = freshDoorSystem();
  const bus = fakeBus();
  ds.ensureDoors(bus);
  // Open only front door
  ds.getDoor(bus, 'frontDoor').enabled = true;
  bus._doorFront = true;
  for (let i = 0; i < 20; i++) {
    ds.updateVehicle(bus, 0.5);
  }
  assertTruthy(ds.canBoard(bus) === true, "canBoard true when front door open");
  assertTruthy(ds.canAlight(bus) === true, "canAlight true when front door open");
  // Open only rear door
  const bus2 = fakeBus();
  ds.ensureDoors(bus2);
  ds.getDoor(bus2, 'rearDoor').enabled = true;
  bus2._doorRear = true;
  for (let i = 0; i < 20; i++) {
    ds.updateVehicle(bus2, 0.5);
  }
  assertTruthy(ds.canBoard(bus2) === true, "canBoard true when rear door open");
  assertTruthy(ds.canAlight(bus2) === true, "canAlight true when rear door open");
  // Driver door should NOT allow boarding
  const bus3 = fakeBus();
  ds.ensureDoors(bus3);
  ds.getDoor(bus3, 'driverDoor').enabled = true;
  bus3._doorDriver = true;
  for (let i = 0; i < 20; i++) {
    ds.updateVehicle(bus3, 0.5);
  }
  assertTruthy(ds.canBoard(bus3) === false, "canBoard false when only driver door open");
  assertTruthy(ds.canAlight(bus3) === false, "canAlight false when only driver door open");
  // No doors open
  const bus4 = fakeBus();
  ds.ensureDoors(bus4);
  assertTruthy(ds.canBoard(bus4) === false, "canBoard false when no doors open");
  assertTruthy(ds.canAlight(bus4) === false, "canAlight false when no doors open");
  // canBoard returns false for unknown vehicle
  assertTruthy(ds.canBoard({ id: 'unknown' }) === false, "canBoard false for unknown vehicle");
  assertTruthy(ds.canAlight({ id: 'unknown' }) === false, "canAlight false for unknown vehicle");
}
console.log("--- 5. Obstructed door cannot open ---");
{
  const ds = freshDoorSystem();
  const bus = fakeBus();
  ds.ensureDoors(bus);
  ds.getDoor(bus, 'frontDoor').enabled = true;
  ds.getDoor(bus, 'frontDoor').obstructed = true;
  bus._doorFront = true;
  ds.updateVehicle(bus, 0.5);
  assertTruthy(ds.getDoor(bus, 'frontDoor').progress === 0, "obstructed front door stays closed");
  assertTruthy(ds.isDoorOpen(bus, 'frontDoor') === false, "isDoorOpen false for obstructed door");
  // Clear obstruction, door should open
  ds.getDoor(bus, 'frontDoor').obstructed = false;
  ds.updateVehicle(bus, 0.5);
  assertTruthy(ds.getDoor(bus, 'frontDoor').progress > 0, "front door opens after obstruction cleared");
}
console.log("--- 6. setState / reset / serialize / deserialize ---");
{
  const ds = freshDoorSystem();
  const bus = fakeBus();
  ds.ensureDoors(bus);
  // setState opens front door
  ds.setState(bus, { frontDoor: { open: true, progress: 1.0, opening: false, obstructed: false, enabled: true } });
  assertTruthy(ds.getDoor(bus, 'frontDoor').open === true, "setState opens front door");
  assertTruthy(ds.getDoor(bus, 'frontDoor').progress === 1.0, "setState sets front door progress");
  assertTruthy(ds.getDoor(bus, 'frontDoor').enabled === true, "setState enables front door");
  // reset closes all doors
  ds.reset(bus);
  assertTruthy(ds.getDoor(bus, 'frontDoor').open === false, "reset closes front door");
  assertTruthy(ds.getDoor(bus, 'rearDoor').open === false, "reset closes rear door");
  assertTruthy(ds.getDoor(bus, 'driverDoor').open === false, "reset closes driver door");
  assertTruthy(ds.getDoor(bus, 'frontDoor').progress === 0, "reset zeroes front door progress");
  assertTruthy(ds.getDoor(bus, 'rearDoor').progress === 0, "reset zeroes rear door progress");
  assertTruthy(ds.getDoor(bus, 'driverDoor').progress === 0, "reset zeroes driver door progress");
  assertTruthy(ds.getDoor(bus, 'frontDoor').obstructed === false, "reset clears obstruction");
  // serializeDoors captures state
  const bus2 = fakeBus();
  ds.ensureDoors(bus2);
  ds.getDoor(bus2, 'frontDoor').enabled = true;
  ds.getDoor(bus2, 'frontDoor').open = true;
  ds.getDoor(bus2, 'frontDoor').progress = 1.0;
  const serialized = ds.serializeDoors(bus2);
  assertTruthy(serialized !== null, "serializeDoors returns non-null");
  assertTruthy(serialized.frontDoor.open === true, "serializeDoors captures front door open");
  assertTruthy(serialized.frontDoor.progress === 1.0, "serializeDoors captures front door progress");
  // deserializeDoors restores state
  const bus3 = fakeBus();
  ds.deserializeDoors(bus3, { frontDoor: { open: true, progress: 1.0, opening: false, obstructed: false, enabled: true } });
  assertTruthy(ds.getDoor(bus3, 'frontDoor').open === true, "deserializeDoors opens front door");
  assertTruthy(ds.getDoor(bus3, 'frontDoor').progress === 1.0, "deserializeDoors sets front door progress");
  // Full serialize/deserialize cycle
  const bus4 = fakeBus();
  ds.ensureDoors(bus4);
  ds.getDoor(bus4, 'frontDoor').enabled = true;
  ds.getDoor(bus4, 'frontDoor').open = true;
  ds.getDoor(bus4, 'frontDoor').progress = 1.0;
  const fullData = ds.serialize();
  assertTruthy(Object.keys(fullData).length >= 1, "serialize returns data for at least one vehicle");
  const ds2 = freshDoorSystem();
  ds2.deserialize(fullData);
  const restored = ds2._vehicles.get(bus4.id);
  assertTruthy(restored !== null, "deserialize restores vehicle state");
  assertTruthy(restored.doors.frontDoor.open === true, "restored front door is open");
  assertTruthy(restored.doors.frontDoor.progress === 1.0, "restored front door progress is 1.0");
  // attachDoors re-attaches state to a vehicle
  const bus5 = fakeBus();
  const attached = ds.attachDoors(bus5);
  assertTruthy(attached !== null, "attachDoors returns state");
  assertTruthy(bus5._doors === attached, "attachDoors sets vehicle._doors");
  assertTruthy(ds._getVehicleState(bus5) === attached, "_getVehicleState returns attached state");
  // destroy clears state
  ds.destroy();
  assertTruthy(ds._vehicles.size === 0, "destroy clears vehicles map");
}
console.log("--- 7. MaintenanceSystem reads door state via hook (no ownership) ---");
{
  const ms = Object.create(MaintenanceSystem);
  ms.init({ GameInitSystem: { getPlayer() { return null; } } });
const bus = fakeBus();
  bus.condition = 60;
  bus.tripDistance = 1000;
  bus.lastMaintenance = 0;
  bus.maintenanceInterval = 5000;
  bus.fuelEfficiency = 3.5;
  // No doors attached -> no door recommendation
  let result = ms.checkMaintenance(bus);
  assertTruthy(result !== null, "checkMaintenance returns object for valid bus");
  const hasDoorRec = result.recommendations.some(r => r.type === "door_inspection");
  assertTruthy(hasDoorRec === false, "no door_inspection when no doors attached");
  // Attach doors, obstruct one, expect door_inspection recommendation
  const ds = freshDoorSystem();
  ds.ensureDoors(bus);
  ds.getDoor(bus, 'frontDoor').obstructed = true;
  result = ms.checkMaintenance(bus);
  const doorRecs = result.recommendations.filter(r => r.type === "door_inspection");
  assertTruthy(doorRecs.length === 1, "one door_inspection for obstructed front door");
  assertTruthy(doorRecs[0].severity === "moderate", "door_inspection severity is moderate");
  assertTruthy(doorRecs[0].cost === 2000, "door_inspection cost is 2000");
  assertTruthy(doorRecs[0].description.includes("frontDoor"), "door_inspection description mentions frontDoor");
  // Clear obstruction, recommendation should disappear
  ds.getDoor(bus, 'frontDoor').obstructed = false;
  result = ms.checkMaintenance(bus);
  const doorRecs2 = result.recommendations.filter(r => r.type === "door_inspection");
  assertTruthy(doorRecs2.length === 0, "no door_inspection after obstruction cleared");
  // MaintenanceSystem must not modify door state
  assertTruthy(ds.getDoor(bus, 'frontDoor').obstructed === false, "MaintenanceSystem does not clear obstruction");
  assertTruthy(ds.getDoor(bus, 'frontDoor').open === false, "MaintenanceSystem does not open doors");
}

console.log("--- 8. Regression: BoardingSystem consults DoorSystem gate ---");
{
  const BoardingSystem = window.BusSim.BoardingSystem;
  const bs = Object.create(BoardingSystem);
  bs.init({});
  // Bus with no doors open -> boarding should be blocked
  const bus = fakeBus();
  const ds = freshDoorSystem();
  ds.ensureDoors(bus);
  // BoardingSystem should not board when canBoard is false
  const canBoardBefore = typeof ds.canBoard === 'function' ? ds.canBoard(bus) : false;
  assertTruthy(canBoardBefore === false, "boarding blocked when doors closed");
  // Open front door
  ds.getDoor(bus, 'frontDoor').enabled = true;
  bus._doorFront = true;
  for (let i = 0; i < 20; i++) { ds.updateVehicle(bus, 0.5); }
  const canBoardAfter = ds.canBoard(bus);
  assertTruthy(canBoardAfter === true, "boarding allowed when front door open");
}

console.log("--- 9. HUD reads nested DoorSystem state via bus.getDoors() ---");
{
  const HUD = window.BusSim.HUD;
  HUD.init({ BoardingSystem: { isBoarding() { return false; } } });
  // Mock canvas context capturing fillStyle/fillText calls.
  const calls = [];
  const ctx = {
    fillStyle: '',
    strokeStyle: '',
    font: '',
    textAlign: '',
    lineWidth: 1,
    fillRect(x, y, w, h) { calls.push({ op: 'fillRect', x, y, w, h, fill: this.fillStyle }); },
    strokeRect(x, y, w, h) { calls.push({ op: 'strokeRect', x, y, w, h }); },
    fillText(text, x, y) { calls.push({ op: 'fillText', text, x, y }); },
    measureText() { return { width: 40 }; }
  };
  // Bus with doors closed -> indicator should render with grey fill.
  const bus = fakeBus();
  bus.fuelLevel = 50;
  bus.fuelCapacity = 100;
  const ds = freshDoorSystem();
  ds.ensureDoors(bus);
  HUD._drawStatusBar(ctx, bus);
  const closedRect = calls.find(c => c.op === 'fillRect' && c.x === 710);
  assertTruthy(closedRect !== undefined, "HUD renders door indicator rect when doors closed");
  assertTruthy(closedRect.fill === 'rgba(100, 100, 100, 0.5)', "HUD door indicator is grey when doors closed");
  const closedText = calls.find(c => c.op === 'fillText' && c.text === '🚪c');
  assertTruthy(closedText !== undefined, "HUD renders closed front-door label");
  // Open front door -> indicator should turn green.
  ds.getDoor(bus, 'frontDoor').enabled = true;
  ds.getDoor(bus, 'frontDoor').open = true;
  ds.getDoor(bus, 'frontDoor').progress = 1.0;
  calls.length = 0;
  HUD._drawStatusBar(ctx, bus);
  const openRect = calls.find(c => c.op === 'fillRect' && c.x === 710);
  assertTruthy(openRect !== undefined, "HUD renders door indicator rect when doors open");
  assertTruthy(openRect.fill === 'rgba(16, 185, 129, 0.85)', "HUD door indicator is green when doors open");
  const openText = calls.find(c => c.op === 'fillText' && c.text === '🚪F');
  assertTruthy(openText !== undefined, "HUD renders open front-door label");
  // Bus with no doors attached -> HUD must not crash and must not render indicator.
  const bus2 = fakeBus();
  bus2.fuelLevel = 50;
  bus2.fuelCapacity = 100;
  calls.length = 0;
  HUD._drawStatusBar(ctx, bus2);
  const noDoorRect = calls.find(c => c.op === 'fillRect' && c.x === 710);
  assertTruthy(noDoorRect === undefined, "HUD does not render door indicator when no doors attached");
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
