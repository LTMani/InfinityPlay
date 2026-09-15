import { FuelType, Review, VehicleClass } from '../../types';

const DRIVER_FIRST_NAMES = ['Hank', 'Evelyn', 'Chet', 'Mona', 'Donovan', 'Jolene', 'Gus', 'Wanda', 'Travis', 'Loretta', 'Vince', 'Brenda', 'Sal', 'Misty'];
const VEHICLE_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b', '#ffffff', '#1e293b', '#ec4899'];

const POSITIVE_REVIEWS = [
  "Cheapest diesel on Route 66! Restrooms were sparkling clean.",
  "That diner pancake stack saved my life after a 12-hour haul.",
  "Quiet cabins, blackout curtains, slept like a baby. 10/10 trucker stop.",
  "Ultra fast EV charger, grab a hot coffee while you charge.",
  "Awesome stop! Gas pump was super fast and friendly staff.",
  "Great atmosphere, nice lighting at night, felt very safe."
];

const NEGATIVE_REVIEWS = [
  "Waited 15 minutes for a fuel dispenser! Need more pumps.",
  "Fuel prices are highway robbery! Bring down the rates.",
  "Dirty motel room! Housekeeper didn't restock the towels.",
  "Store was out of coffee and energy drinks. Very disappointed.",
  "Long line for the restroom, dirty floors."
];

export class CustomerFactory {
  public static createRandomVehicle(startHighwayX: number, highwayY: number, lane: number): any {
    const classes: VehicleClass[] = [
      'SEDAN', 'SEDAN', 'SUV', 'SUV', 'SPORTS_CAR', 
      'SEMI_TRUCK', 'SEMI_TRUCK', 'REEFER_TRUCK', 
      'CAMPER_RV', 'ELECTRIC_CAR', 'MOTORCYCLE'
    ];

    const vClass = classes[Math.floor(Math.random() * classes.length)];
    const color = VEHICLE_COLORS[Math.floor(Math.random() * VEHICLE_COLORS.length)];
    const driverName = DRIVER_FIRST_NAMES[Math.floor(Math.random() * DRIVER_FIRST_NAMES.length)];

    let fuelType: FuelType = 'REGULAR';
    let fuelCapacityLiters = 55;
    let passengers = 1;

    switch (vClass) {
      case 'SEMI_TRUCK':
      case 'REEFER_TRUCK':
        fuelType = 'DIESEL';
        fuelCapacityLiters = 400;
        passengers = 1;
        break;
      case 'ELECTRIC_CAR':
        fuelType = 'ELECTRIC';
        fuelCapacityLiters = 80; // kWh
        passengers = Math.floor(Math.random() * 3) + 1;
        break;
      case 'SPORTS_CAR':
        fuelType = 'PREMIUM';
        fuelCapacityLiters = 65;
        passengers = 1 + (Math.random() > 0.5 ? 1 : 0);
        break;
      case 'SUV':
      case 'CAMPER_RV':
        fuelType = Math.random() > 0.4 ? 'REGULAR' : 'DIESEL';
        fuelCapacityLiters = vClass === 'CAMPER_RV' ? 120 : 75;
        passengers = Math.floor(Math.random() * 4) + 1;
        break;
      case 'TOUR_BUS':
        fuelType = 'DIESEL';
        fuelCapacityLiters = 350;
        passengers = 25;
        break;
      default:
        fuelType = 'REGULAR';
        fuelCapacityLiters = 50;
        passengers = Math.floor(Math.random() * 3) + 1;
        break;
    }

    // Randomized starting needs
    const fuelLevel = Math.floor(Math.random() * 65) + 10; // 10% - 75%
    const fatigue = Math.floor(Math.random() * 80) + 15;   // 15% - 95%
    const hunger = Math.floor(Math.random() * 85) + 10;
    const bladder = Math.floor(Math.random() * 70) + 10;
    const cash = Math.floor(Math.random() * 300) + 60;

    return {
      id: `veh_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      vehicleClass: vClass,
      color,
      fuelType,
      fuelLevel,
      fuelCapacityLiters,
      driverName,
      passengers,
      fatigue,
      hunger,
      bladder,
      cash,
      patience: 100,
      x: startHighwayX,
      y: highwayY,
      targetX: startHighwayX,
      targetY: highwayY,
      speed: 0.12 + Math.random() * 0.04,
      heading: 0,
      lane,
      state: 'HIGHWAY_APPROACH',
      stateTimer: 0,
      path: [],
      pathIndex: 0,
      hasStopped: false,
      spentTotal: 0
    };
  }

  public static generateReview(
    vehicle: any,
    wasSatisfied: boolean,
    day: number,
    hour: number
  ): Review {
    const list = wasSatisfied ? POSITIVE_REVIEWS : NEGATIVE_REVIEWS;
    const text = list[Math.floor(Math.random() * list.length)];
    const stars = wasSatisfied ? (Math.random() > 0.3 ? 5 : 4) : (Math.random() > 0.4 ? 2 : 1);

    const tags: Review['tags'] = [];
    if (vehicle.fuelType === 'DIESEL') tags.push('fuel');
    if (vehicle.fatigue > 60) tags.push('sleep');
    if (vehicle.hunger > 60) tags.push('food');
    tags.push('speed');

    return {
      id: `rev_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      author: `${vehicle.driverName} (${vehicle.vehicleClass.replace('_', ' ')})`,
      vehicleClass: vehicle.vehicleClass,
      stars,
      text,
      day,
      hour,
      tags
    };
  }
}
