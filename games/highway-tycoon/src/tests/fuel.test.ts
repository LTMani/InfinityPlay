import { describe, it, expect, beforeEach } from 'vitest';
import { FuelStorage } from '../simulation/petrol/FuelStorage';

describe('FuelStorage & Underground Tank Logistics', () => {
  let fuelStorage: FuelStorage;

  beforeEach(() => {
    fuelStorage = new FuelStorage();
  });

  it('should initialize with correct default fuel reserves', () => {
    expect(fuelStorage.tanks.REGULAR.currentLiters).toBe(12000);
    expect(fuelStorage.tanks.DIESEL.currentLiters).toBe(18000);
    expect(fuelStorage.tanks.PREMIUM.currentLiters).toBe(6000);
  });

  it('should dispense fuel and calculate accurate customer billing', () => {
    const initialRegular = fuelStorage.tanks.REGULAR.currentLiters;
    const pricePerLiter = fuelStorage.tanks.REGULAR.retailPricePerLiter;
    const litersToDispense = 40;

    const result = fuelStorage.dispenseFuel('REGULAR', litersToDispense);

    expect(result.litersDispensed).toBe(40);
    expect(result.costToCustomer).toBe(+(40 * pricePerLiter).toFixed(2));
    expect(fuelStorage.tanks.REGULAR.currentLiters).toBe(initialRegular - 40);
  });

  it('should allow retail price adjustments', () => {
    fuelStorage.setRetailPrice('DIESEL', 2.15);
    expect(fuelStorage.tanks.DIESEL.retailPricePerLiter).toBe(2.15);

    const result = fuelStorage.dispenseFuel('DIESEL', 100);
    expect(result.costToCustomer).toBe(215.00);
  });

  it('should not dispense more fuel than available in tank', () => {
    fuelStorage.tanks.REGULAR.currentLiters = 25;
    const result = fuelStorage.dispenseFuel('REGULAR', 60);

    expect(result.litersDispensed).toBe(25);
    expect(fuelStorage.tanks.REGULAR.currentLiters).toBe(0);
  });

  it('should adjust crude oil wholesale index during market updates', () => {
    const initialPrice = fuelStorage.getCrudeOilPrice();
    fuelStorage.update(35); // triggers 30s market timer
    expect(fuelStorage.getCrudeOilPrice()).toBeGreaterThan(40);
  });
});
