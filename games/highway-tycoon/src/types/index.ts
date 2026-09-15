export type GameSpeed = 0 | 1 | 2 | 5;

export type TileType = 
  | 'EMPTY'
  | 'GRASS'
  | 'HIGHWAY'
  | 'RAMP_OFF'
  | 'RAMP_ON'
  | 'DRIVEWAY'
  | 'PARKING_CAR'
  | 'PARKING_TRUCK'
  | 'PUMP_ISLAND'
  | 'EV_STATION'
  | 'MOTEL_ROOM'
  | 'MOTEL_CABIN'
  | 'CONVENIENCE_STORE'
  | 'DINER'
  | 'CAR_WASH'
  | 'RESTROOM'
  | 'BILLBOARD'
  | 'TREE';

export type FuelType = 'REGULAR' | 'PREMIUM' | 'DIESEL' | 'ELECTRIC';

export interface GridCoord {
  x: number;
  y: number;
}

export interface ScreenCoord {
  x: number;
  y: number;
}

export interface BuildingDefinition {
  id: string;
  type: TileType;
  name: string;
  category: 'PETROL' | 'HOSPITALITY' | 'COMMERCIAL' | 'INFRASTRUCTURE' | 'DECOR';
  cost: number;
  dailyUpkeep: number;
  width: number;
  height: number;
  description: string;
  unlockLevel: number;
  color: string;
  secondaryColor?: string;
  capacity?: number;
}

export interface PlacedBuilding {
  id: string;
  defId: string;
  type: TileType;
  x: number;
  y: number;
  width: number;
  height: number;
  level: number;
  condition: number; // 0 - 100%
  active: boolean;
  assignedStaffId?: string;
  // Specific properties
  fuelStock?: number;
  fuelCapacity?: number;
  roomStatus?: 'VACANT_CLEAN' | 'OCCUPIED' | 'VACANT_DIRTY' | 'MAINTENANCE';
  currentOccupantId?: string;
  occupiedUntil?: number; // game time
  revenueTotal: number;
}

export type VehicleClass = 
  | 'SEDAN'
  | 'SUV'
  | 'SPORTS_CAR'
  | 'SEMI_TRUCK'
  | 'REEFER_TRUCK'
  | 'CAMPER_RV'
  | 'ELECTRIC_CAR'
  | 'TOUR_BUS'
  | 'MOTORCYCLE';

export type VehicleState = 
  | 'HIGHWAY_APPROACH'
  | 'DECIDING_EXIT'
  | 'ENTERING_RAMP'
  | 'DRIVING_TO_PARKING'
  | 'PARKED'
  | 'QUEUING_FOR_PUMP'
  | 'REFUELING'
  | 'DRIVING_TO_MOTEL'
  | 'AT_MOTEL'
  | 'DRIVING_TO_STORE'
  | 'SHOPPING'
  | 'DRIVING_TO_DINER'
  | 'EATING'
  | 'DRIVING_TO_EXIT'
  | 'EXITING_RAMP'
  | 'HIGHWAY_LEAVE';

export interface Vehicle {
  id: string;
  vehicleClass: VehicleClass;
  color: string;
  fuelType: FuelType;
  fuelLevel: number; // 0 - 100
  fuelCapacityLiters: number;
  driverName: string;
  passengers: number;
  
  // Driver Needs
  fatigue: number; // 0 - 100 (100 = exhausted)
  hunger: number;  // 0 - 100 (100 = starving)
  bladder: number; // 0 - 100 (100 = desperate)
  cash: number;
  patience: number; // 0 - 100
  
  // Simulation Positioning
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  heading: number; // angle in radians or 4-dir
  lane: number;
  state: VehicleState;
  stateTimer: number;
  targetBuildingId?: string;
  targetSlotIndex?: number;
  path: GridCoord[];
  pathIndex: number;
  
  hasStopped: boolean;
  spentTotal: number;
  ratingScore?: number;
  ratingReview?: string;
}

export interface FuelTankData {
  type: FuelType;
  currentLiters: number;
  maxCapacityLiters: number;
  costPerLiterWholesale: number;
  retailPricePerLiter: number;
  reorderThreshold: number;
  autoReorder: boolean;
  orderPending: boolean;
}

export type StaffRole = 
  | 'PUMP_ATTENDANT'
  | 'HOUSEKEEPER'
  | 'CASHIER'
  | 'COOK'
  | 'MECHANIC'
  | 'SECURITY';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  salaryPerHour: number;
  skill: number; // 1 - 10
  stamina: number; // 0 - 100
  morale: number; // 0 - 100
  assignedBuildingId?: string;
  shift: 'DAY' | 'NIGHT' | 'SWING';
  isWorking: boolean;
  hireDate: number;
}

export interface FinancialRecord {
  timestamp: number;
  day: number;
  hour: number;
  category: 'FUEL' | 'MOTEL' | 'STORE' | 'DINER' | 'SERVICES' | 'SALARIES' | 'UPKEEP' | 'WHOLESALE_FUEL' | 'LOAN_INTEREST' | 'CONSTRUCTION';
  amount: number; // positive = income, negative = expense
  description: string;
}

export interface Review {
  id: string;
  author: string;
  vehicleClass: VehicleClass;
  stars: number; // 1 to 5
  text: string;
  day: number;
  hour: number;
  tags: ('fuel' | 'sleep' | 'food' | 'cleanliness' | 'speed' | 'price')[];
}

export interface Scenario {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  initialCash: number;
  highwaySpeedLimit: number;
  trafficVolumeRate: number; // multiplier
  objectives: {
    id: string;
    description: string;
    target: number;
    current: number;
    completed: boolean;
  }[];
  mapWidth: number;
  mapHeight: number;
  weatherPattern: 'DESERT' | 'TEMPERATE' | 'WINTER' | 'COASTAL';
}

export interface ResearchTech {
  id: string;
  name: string;
  cost: number;
  description: string;
  category: 'EFFICIENCY' | 'CAPACITY' | 'LUXURY' | 'MARKETING';
  unlocked: boolean;
  prerequisites: string[];
  effectDescription: string;
}

export interface GameStats {
  totalCarsServiced: number;
  totalTrucksServiced: number;
  litersFuelSold: number;
  roomsBooked: number;
  storeItemsSold: number;
  mealsServed: number;
  totalRevenue: number;
  reputationStars: number; // 1.0 - 5.0
  totalReviewsCount: number;
}
