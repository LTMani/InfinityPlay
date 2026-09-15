import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine, PLAZA_LEVELS } from '../core/GameEngine';
import { ParkingBayManager } from '../rendering/3d/ParkingBayManager';

describe('Level Progression & Tycoon Unlocks', () => {
  let engine: GameEngine;
  let bayManager: ParkingBayManager;

  beforeEach(() => {
    engine = new GameEngine();
    bayManager = new ParkingBayManager();
  });

  it('should start with $0 bootstrap cash and Level 1 solitary pump', () => {
    expect(engine.economy.cash).toBe(0);
    expect(engine.plazaLevel).toBe(1);
    expect(PLAZA_LEVELS.length).toBe(100);

    const config = engine.getCurrentLevelConfig();
    expect(config.level).toBe(1);
    expect(config.name).toBe('Level 1: Solitary Roadside Pump');
    expect(config.unlockedFeatures).toContain('Regular Gasoline Pump');
  });

  it('should earn cash when customers are served from $0 bootstrap', () => {
    expect(engine.economy.cash).toBe(0);
    expect(engine.totalCustomersServed).toBe(0);

    engine.recordCustomerServed(65, 'Fuel Fill');
    expect(engine.economy.cash).toBe(65);
    expect(engine.totalCustomersServed).toBe(1);
  });

  it('should prevent truck diesel bay reservations at Level 1', () => {
    const bay = bayManager.requestBay('FUEL', 'truck_1', 1, true);
    expect(bay).toBeNull();
  });

  it('should allow car gas bay reservations at Level 1', () => {
    const bay = bayManager.requestBay('FUEL', 'car_1', 1, false);
    expect(bay).not.toBeNull();
    expect(bay?.category).toBe('FUEL');
  });

  it('should allow truck commercial diesel bay reservations at Level 2+', () => {
    const bay = bayManager.requestBay('FUEL', 'truck_1', 2, true);
    expect(bay).not.toBeNull();
    expect(bay?.category).toBe('FUEL');
    // Deep bay clearance: X >= 34m, buffer >= 29m from service road (X = 5m)
    expect(bay!.position.x).toBeGreaterThanOrEqual(34);
    expect(bay!.position.x - 5).toBeGreaterThanOrEqual(29);
  });

  it('should block level upgrade without meeting development prerequisite', () => {
    const next = engine.getNextLevelConfig()!;
    engine.economy.cash = next.upgradeCost + 1000;
    engine.totalCustomersServed = 0; // Level 2 requires serving 4 customers

    // Cash is sufficient, but development requirement is not met:
    const check = engine.canUpgradePlazaLevel();
    expect(check.eligible).toBe(false);
    expect(check.reason).toContain('Must develop plaza');
    expect(engine.upgradePlazaLevel()).toBe(false);
    expect(engine.plazaLevel).toBe(1);
  });

  it('should successfully level up when BOTH cash and development prerequisites are met', () => {
    const next = engine.getNextLevelConfig()!;
    engine.economy.cash = next.upgradeCost + 500;
    engine.totalCustomersServed = 4; // Meets requirement

    const check = engine.canUpgradePlazaLevel();
    expect(check.eligible).toBe(true);
    expect(engine.upgradePlazaLevel()).toBe(true);
    expect(engine.plazaLevel).toBe(2);
    expect(engine.economy.cash).toBe(500);
  });

  it('should allow purchasing land parcels when affordable', () => {
    expect(engine.purchasedParcels.has('plot_north')).toBe(false);
    engine.economy.cash = 1000;
    expect(engine.buyLandParcel('plot_north')).toBe(false); // costs $3,500

    engine.economy.cash = 5000;
    expect(engine.buyLandParcel('plot_north')).toBe(true);
    expect(engine.purchasedParcels.has('plot_north')).toBe(true);
    expect(engine.economy.cash).toBe(1500); // 5000 - 3500
  });

  it('should upgrade facility capacity when upgraded by user', () => {
    expect(engine.fuelCapacityLevel).toBe(1);
    engine.economy.cash = 5000;
    expect(engine.upgradeFacilityCapacity('FUEL')).toBe(true);
    expect(engine.fuelCapacityLevel).toBe(2);
    expect(engine.economy.cash).toBe(3800); // 5000 - 1200
  });

  it('should allow expanding highway lanes to 6 lanes', () => {
    expect(engine.highwayLanesLevel).toBe(4);
    engine.economy.cash = 50000;
    expect(engine.upgradeHighwayLanes()).toBe(true);
    expect(engine.highwayLanesLevel).toBe(6);
    expect(engine.economy.cash).toBe(5000); // 50000 - 45000
  });
});
