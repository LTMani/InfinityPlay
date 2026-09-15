import { 
  BuildingDefinition, 
  GameSpeed, 
  PlacedBuilding, 
  Review, 
  Scenario 
} from '../types';
import { BUILDING_DEFINITIONS } from '../data/buildingDefinitions';
import { SCENARIOS } from '../data/scenarios';
import { FuelStorage } from '../simulation/petrol/FuelStorage';
import { RoomManager } from '../simulation/hospitality/RoomManager';
import { StoreManager } from '../simulation/commercial/StoreManager';
import { StaffManager } from '../simulation/staff/StaffManager';
import { EconomyEngine } from '../simulation/economy/EconomyEngine';
import { VehicleManager } from '../simulation/traffic/VehicleManager';
import { gameEvents } from './EventBus';
import { sound } from '../audio/SoundEngine';

const SAVE_KEY = 'HIGHWAY_OASIS_TYCOON_SAVE_V2';

import { PROG_100_LEVELS, PlazaLevelConfig } from '../data/progressionLevels';

export type PlazaLevel = PlazaLevelConfig;
export const PLAZA_LEVELS: PlazaLevelConfig[] = PROG_100_LEVELS;

export class GameEngine {
  public scenario: Scenario;
  public buildings: PlacedBuilding[] = [];
  public fuelStorage: FuelStorage = new FuelStorage();
  public roomManager: RoomManager = new RoomManager();
  public storeManager: StoreManager = new StoreManager();
  public staffManager: StaffManager = new StaffManager();
  public economy: EconomyEngine;
  public vehicleManager: VehicleManager = new VehicleManager();

  // Clock
  public day: number = 1;
  public hour: number = 8;
  public minute: number = 0;
  public gameSpeed: GameSpeed = 1;
  private tickAccumulator: number = 0;

  // Level Progression & Capacity Upgrades
  public plazaLevel: number = 1;
  public fuelCapacityLevel: number = 1;
  public storeCapacityLevel: number = 1;
  public motelCapacityLevel: number = 1;

  // Territory & Highway Expansions
  public purchasedParcels: Set<string> = new Set();
  public highwayLanesLevel: number = 4;
  public totalCustomersServed: number = 0;

  // Reputation & Reviews
  public reputationStars: number = 3.8;
  public reviews: Review[] = [];
  public unlockedTechIds: Set<string> = new Set();

  constructor(scenarioId: string = 'route_66_revival') {
    const sc = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];
    this.scenario = sc;
    this.economy = new EconomyEngine(sc.initialCash);

    this.setupInitialBuildings();
    this.loadFromStorage();
  }

  /**
   * Place starter infrastructure
   */
  private setupInitialBuildings(): void {
    if (this.buildings.length > 0) return;

    // Starter Pump Island at (10, 8)
    this.buildBuilding('PUMP_ISLAND', 10, 8, true);

    // Starter EV Charging Station at (14, 8)
    this.buildBuilding('EV_STATION', 14, 8, true);

    // Starter Motel Room at (17, 10)
    this.buildBuilding('MOTEL_ROOM', 17, 10, true);

    // Starter Convenience Store at (11, 12)
    this.buildBuilding('CONVENIENCE_STORE', 11, 12, true);
  }

  /**
   * Construct a building on the map
   */
  public buildBuilding(defId: string, x: number, y: number, free: boolean = false): boolean {
    const def = BUILDING_DEFINITIONS[defId];
    if (!def) return false;

    if (!free && !this.economy.canAfford(def.cost)) {
      return false;
    }

    // Check collision with existing buildings
    const collides = this.buildings.some(b => {
      return (
        x < b.x + b.width &&
        x + def.width > b.x &&
        y < b.y + b.height &&
        y + def.height > b.y
      );
    });

    if (collides) return false;

    // Deduct cost
    if (!free) {
      this.economy.recordTransaction('CONSTRUCTION', -def.cost, `Constructed ${def.name}`, this.day, this.hour);
      sound.playCashSound();
    }

    const newBuilding: PlacedBuilding = {
      id: `bld_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      defId,
      type: def.type,
      x,
      y,
      width: def.width,
      height: def.height,
      level: 1,
      condition: 100,
      active: true,
      revenueTotal: 0,
      roomStatus: (def.type === 'MOTEL_ROOM' || def.type === 'MOTEL_CABIN') ? 'VACANT_CLEAN' : undefined
    };

    this.buildings.push(newBuilding);

    // Check scenario objectives
    this.checkObjectives();

    return true;
  }

  /**
   * Demolish building with 50% salvage value
   */
  public demolishBuilding(id: string): boolean {
    const idx = this.buildings.findIndex(b => b.id === id);
    if (idx === -1) return false;

    const b = this.buildings[idx];
    const def = BUILDING_DEFINITIONS[b.defId];
    const salvage = def ? Math.round(def.cost * 0.4) : 0;

    this.buildings.splice(idx, 1);
    if (salvage > 0) {
      this.economy.recordTransaction('CONSTRUCTION', salvage, `Demolition Salvage: ${def.name}`, this.day, this.hour);
    }
    sound.playCashSound();
    return true;
  }

  /**
   * Main game tick
   */
  public tick(deltaTimeRealSec: number): void {
    if (this.gameSpeed === 0) return;

    const simDeltaSec = deltaTimeRealSec * this.gameSpeed;

    // Advance In-Game Clock: 1 real second at 1x = 1 in-game minute
    this.tickAccumulator += simDeltaSec;
    if (this.tickAccumulator >= 1.0) {
      const minutesPassed = Math.floor(this.tickAccumulator);
      this.tickAccumulator -= minutesPassed;

      this.minute += minutesPassed;
      while (this.minute >= 60) {
        this.minute -= 60;
        this.hour++;

        // Hourly actions
        this.onHourPassed();

        if (this.hour >= 24) {
          this.hour = 0;
          this.day++;
          this.onDayPassed();
        }
      }
    }

    // 1. Update Fuel Market volatility
    this.fuelStorage.update(simDeltaSec);

    // 2. Update Hospitality Rooms & Housekeeping
    const hasHousekeepers = this.staffManager.hasActiveHousekeeper();
    const cleanMult = this.staffManager.getHousekeepingSpeedMultiplier();
    this.roomManager.updateRooms(this.buildings, this.hour, hasHousekeepers, cleanMult, simDeltaSec);

    // 3. Update Vehicle Spawning & Highway Traffic
    const hasBillboard = this.buildings.some(b => b.type === 'BILLBOARD' && b.active);
    this.vehicleManager.updateSpawning(simDeltaSec, this.scenario.mapWidth, this.scenario.trafficVolumeRate, hasBillboard);

    // 4. Update Vehicles Simulation
    this.vehicleManager.updateVehicles(
      simDeltaSec,
      this.buildings,
      this.fuelStorage,
      this.roomManager,
      this.storeManager,
      this.economy,
      this.day,
      this.hour,
      (rev) => this.addReview(rev)
    );

    // Check scenario objectives
    this.checkObjectives();
  }

  private onHourPassed(): void {
    // Pay staff hourly salaries
    const totalSalaries = this.staffManager.getHourlySalariesTotal();
    if (totalSalaries > 0) {
      this.economy.recordTransaction('SALARIES', -totalSalaries, `Hourly Staff Payroll`, this.day, this.hour);
    }

    // Building hourly utility upkeep
    const isSolar = this.unlockedTechIds.has('SOLAR_CANOPY');
    const upkeepFactor = isSolar ? 0.5 : 1.0;

    let hourlyUpkeep = 0;
    this.buildings.forEach(b => {
      const def = BUILDING_DEFINITIONS[b.defId];
      if (def) hourlyUpkeep += (def.dailyUpkeep / 24) * upkeepFactor;
    });

    if (hourlyUpkeep > 0) {
      this.economy.recordTransaction('UPKEEP', -Math.round(hourlyUpkeep), 'Facility Power & Utilities', this.day, this.hour);
    }
  }

  private onDayPassed(): void {
    // Process daily loan repayments
    this.economy.processDailyLoanPayments(this.day);

    // Auto-save game state every new day
    this.saveToStorage();
  }

  public addReview(review: Review): void {
    this.reviews.unshift(review);
    if (this.reviews.length > 50) this.reviews.pop();

    // Recalculate moving average rating
    const avg = this.reviews.reduce((sum, r) => sum + r.stars, 0) / this.reviews.length;
    this.reputationStars = +(avg).toFixed(1);
  }

  private checkObjectives(): void {
    this.scenario.objectives.forEach(obj => {
      if (obj.completed) return;

      if (obj.id === 'build_pumps') {
        obj.current = this.buildings.filter(b => b.type === 'PUMP_ISLAND').length;
      } else if (obj.id === 'build_motel' || obj.id === 'trucker_cabins') {
        obj.current = this.buildings.filter(b => b.type === 'MOTEL_ROOM' || b.type === 'MOTEL_CABIN').length;
      } else if (obj.id === 'serve_customers') {
        obj.current = this.vehicleManager.totalServicedCount;
      } else if (obj.id === 'reputation') {
        obj.current = this.reputationStars;
      } else if (obj.id === 'diner_built') {
        obj.current = this.buildings.filter(b => b.type === 'DINER').length;
      } else if (obj.id === 'revenue_target') {
        obj.current = this.economy.totalRevenue;
      }

      if (obj.current >= obj.target) {
        obj.completed = true;
        sound.playFanfare();
        gameEvents.emit('FLOATING_TEXT', {
          text: `🎉 Objective Completed: ${obj.description}!`,
          x: 15,
          y: 8,
          color: '#fbbf24'
        });
      }
    });
  }

  public unlockTech(techId: string, cost: number): boolean {
    if (!this.economy.canAfford(cost) || this.unlockedTechIds.has(techId)) return false;

    this.economy.recordTransaction('SERVICES', -cost, `R&D Tech: ${techId}`, this.day, this.hour);
    this.unlockedTechIds.add(techId);
    sound.playFanfare();
    return true;
  }

  public getCurrentLevelConfig(): PlazaLevel {
    return PLAZA_LEVELS.find(l => l.level === this.plazaLevel) || PLAZA_LEVELS[0];
  }

  public getNextLevelConfig(): PlazaLevel | null {
    return PLAZA_LEVELS.find(l => l.level === this.plazaLevel + 1) || null;
  }

  public checkDevelopmentPrerequisite(nextConfig: PlazaLevelConfig): { met: boolean; details: string } {
    const req = nextConfig.requiredDev;
    switch (req.type) {
      case 'FUEL_CAPACITY': {
        const met = this.fuelCapacityLevel >= req.value;
        return { met, details: `Fuel Capacity: ${this.fuelCapacityLevel}/${req.value}` };
      }
      case 'STORE_CAPACITY': {
        const met = this.storeCapacityLevel >= req.value;
        return { met, details: `Store Capacity: ${this.storeCapacityLevel}/${req.value}` };
      }
      case 'MOTEL_CAPACITY': {
        const met = this.motelCapacityLevel >= req.value;
        return { met, details: `Motel Capacity: ${this.motelCapacityLevel}/${req.value}` };
      }
      case 'LAND_PARCELS': {
        const met = this.purchasedParcels.size >= req.value;
        return { met, details: `Land Plots: ${this.purchasedParcels.size}/${req.value}` };
      }
      case 'CUSTOMERS_SERVED': {
        const met = this.totalCustomersServed >= req.value;
        return { met, details: `Customers Served: ${this.totalCustomersServed}/${req.value}` };
      }
      case 'HIGHWAY_LANES': {
        const met = this.highwayLanesLevel >= req.value;
        return { met, details: `Highway Lanes: ${this.highwayLanesLevel}/${req.value}` };
      }
      case 'REPUTATION': {
        const met = this.reputationStars >= req.value;
        return { met, details: `Reputation: ${this.reputationStars.toFixed(1)}★ / ${req.value.toFixed(1)}★` };
      }
      default:
        return { met: true, details: '' };
    }
  }

  public canUpgradePlazaLevel(): { eligible: boolean; reason?: string } {
    const next = this.getNextLevelConfig();
    if (!next) return { eligible: false, reason: 'Maximum Level Reached' };

    if (this.economy.cash < next.upgradeCost) {
      return { 
        eligible: false, 
        reason: `Need $${(next.upgradeCost - this.economy.cash).toLocaleString()} more cash` 
      };
    }

    const devCheck = this.checkDevelopmentPrerequisite(next);
    if (!devCheck.met) {
      return {
        eligible: false,
        reason: `Must develop plaza: ${next.requiredDev.label} (${devCheck.details})`
      };
    }

    return { eligible: true };
  }

  public upgradePlazaLevel(): boolean {
    const check = this.canUpgradePlazaLevel();
    if (!check.eligible) return false;

    const next = this.getNextLevelConfig()!;
    this.economy.recordTransaction('CONSTRUCTION', -next.upgradeCost, `Plaza Upgraded to ${next.name}`, this.day, this.hour);
    this.plazaLevel += 1;
    this.reputationStars = Math.min(5.0, this.reputationStars + 0.05);
    sound.playFanfare();
    gameEvents.emit('PLAZA_LEVEL_UPGRADED', { level: this.plazaLevel });
    return true;
  }

  public getParcelCost(parcelId: string): number {
    switch (parcelId) {
      case 'plot_north': return 3500;
      case 'plot_east': return 8000;
      case 'plot_south': return 15000;
      case 'plot_deep_east': return 28000;
      default: return 5000;
    }
  }

  public buyLandParcel(parcelId: string): boolean {
    if (this.purchasedParcels.has(parcelId)) return false;
    const cost = this.getParcelCost(parcelId);
    if (this.economy.cash < cost) return false;

    this.economy.recordTransaction('CONSTRUCTION', -cost, `Purchased Land Parcel (${parcelId})`, this.day, this.hour);
    this.purchasedParcels.add(parcelId);
    sound.playCashSound();
    gameEvents.emit('LAND_PARCEL_PURCHASED', { parcelId });
    return true;
  }

  public upgradeHighwayLanes(): boolean {
    if (this.highwayLanesLevel >= 6) return false;
    const cost = 45000;
    if (this.economy.cash < cost) return false;

    this.economy.recordTransaction('CONSTRUCTION', -cost, `Expanded Interstate Highway to 6 Lanes`, this.day, this.hour);
    this.highwayLanesLevel = 6;
    sound.playFanfare();
    gameEvents.emit('HIGHWAY_LANES_UPGRADED', { lanes: 6 });
    return true;
  }

  public recordCustomerServed(amount: number, description: string = 'Fueling Customer'): void {
    this.totalCustomersServed += 1;
    this.economy.recordTransaction('FUEL', amount, description, this.day, this.hour);
  }

  public upgradeFacilityCapacity(category: 'FUEL' | 'SHOP' | 'MOTEL'): boolean {
    let cost = 1200;
    if (category === 'FUEL') cost = 1200 * this.fuelCapacityLevel;
    if (category === 'SHOP') cost = 1500 * this.storeCapacityLevel;
    if (category === 'MOTEL') cost = 2000 * this.motelCapacityLevel;

    if (this.economy.cash < cost) return false;

    this.economy.recordTransaction('CONSTRUCTION', -cost, `Upgraded ${category} Capacity`, this.day, this.hour);
    if (category === 'FUEL') this.fuelCapacityLevel += 1;
    if (category === 'SHOP') this.storeCapacityLevel += 1;
    if (category === 'MOTEL') this.motelCapacityLevel += 1;

    sound.playCashSound();
    gameEvents.emit('CAPACITY_UPGRADED', { category });
    return true;
  }

  public saveToStorage(): void {
    try {
      const data = {
        day: this.day,
        hour: this.hour,
        cash: this.economy.cash,
        buildings: this.buildings,
        reputationStars: this.reputationStars,
        unlockedTechIds: Array.from(this.unlockedTechIds),
        scenarioId: this.scenario.id
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Unable to auto-save to localStorage', e);
    }
  }

  public loadFromStorage(): boolean {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);

      this.day = data.day || 1;
      this.hour = data.hour || 8;
      this.economy.cash = data.cash || this.scenario.initialCash;
      if (Array.isArray(data.buildings) && data.buildings.length > 0) {
        this.buildings = data.buildings;
      }
      this.reputationStars = data.reputationStars || 3.8;
      if (Array.isArray(data.unlockedTechIds)) {
        this.unlockedTechIds = new Set(data.unlockedTechIds);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  public resetGame(): void {
    localStorage.removeItem(SAVE_KEY);
    window.location.reload();
  }
}
