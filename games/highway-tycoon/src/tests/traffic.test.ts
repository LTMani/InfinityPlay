import { describe, it, expect } from 'vitest';
import { CustomerFactory } from '../simulation/customer/CustomerNeeds';
import { HighwayNetwork } from '../simulation/traffic/HighwayNetwork';

describe('CustomerFactory & Highway Routing', () => {
  it('should generate vehicles with valid need distributions', () => {
    const v = CustomerFactory.createRandomVehicle(0, 3, 3);

    expect(v.id).toBeDefined();
    expect(v.speed).toBeGreaterThan(0);
    expect(v.fuelLevel).toBeGreaterThanOrEqual(10);
    expect(v.fuelLevel).toBeLessThanOrEqual(75);
    expect(v.fatigue).toBeGreaterThanOrEqual(15);
    expect(['REGULAR', 'PREMIUM', 'DIESEL', 'ELECTRIC']).toContain(v.fuelType);
  });

  it('should compute valid highway entrance and exit paths', () => {
    const highway = new HighwayNetwork();
    const dummyBuilding = {
      id: 'pump_1',
      defId: 'PUMP_ISLAND',
      type: 'PUMP_ISLAND' as const,
      x: 12,
      y: 9,
      width: 2,
      height: 1,
      level: 1,
      condition: 100,
      active: true,
      revenueTotal: 0
    };

    const pathToBuilding = highway.generatePathToBuilding(dummyBuilding);
    expect(pathToBuilding.length).toBeGreaterThan(0);
    expect(pathToBuilding[0]).toEqual({ x: 5, y: 3 }); // starts at off-ramp
    expect(pathToBuilding[pathToBuilding.length - 1]).toEqual({ x: 12, y: 9 }); // reaches target

    const pathToExit = highway.generatePathToExit(12, 9);
    expect(pathToExit.length).toBeGreaterThan(0);
    expect(pathToExit[pathToExit.length - 1]).toEqual({ x: 24, y: 3 }); // reaches on-ramp merge
  });

  it('should generate customer reviews with star ratings and feedback', () => {
    const v = CustomerFactory.createRandomVehicle(0, 3, 3);
    const review = CustomerFactory.generateReview(v, true, 1, 14);

    expect(review.id).toBeDefined();
    expect(review.stars).toBeGreaterThanOrEqual(4);
    expect(review.text.length).toBeGreaterThan(10);
    expect(review.day).toBe(1);
    expect(review.hour).toBe(14);
  });
});
