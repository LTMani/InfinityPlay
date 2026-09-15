import { FuelTankData, FuelType } from '../../types';
import { gameEvents } from '../../core/EventBus';
import { sound } from '../../audio/SoundEngine';

export class FuelStorage {
  public tanks: Record<FuelType, FuelTankData> = {
    REGULAR: {
      type: 'REGULAR',
      currentLiters: 12000,
      maxCapacityLiters: 25000,
      costPerLiterWholesale: 0.85,
      retailPricePerLiter: 1.45,
      reorderThreshold: 4000,
      autoReorder: true,
      orderPending: false
    },
    PREMIUM: {
      type: 'PREMIUM',
      currentLiters: 6000,
      maxCapacityLiters: 15000,
      costPerLiterWholesale: 1.05,
      retailPricePerLiter: 1.85,
      reorderThreshold: 2500,
      autoReorder: true,
      orderPending: false
    },
    DIESEL: {
      type: 'DIESEL',
      currentLiters: 18000,
      maxCapacityLiters: 40000,
      costPerLiterWholesale: 0.95,
      retailPricePerLiter: 1.65,
      reorderThreshold: 8000,
      autoReorder: true,
      orderPending: false
    },
    ELECTRIC: {
      type: 'ELECTRIC',
      currentLiters: 1000, // Representing kWh
      maxCapacityLiters: 1000,
      costPerLiterWholesale: 0.12, // cost per kWh
      retailPricePerLiter: 0.45,
      reorderThreshold: 0,
      autoReorder: false,
      orderPending: false
    }
  };

  private crudeOilMarketIndex: number = 80.0; // $ per barrel
  private marketTimer: number = 0;

  /**
   * Updates wholesale market prices based on simulated crude oil volatility
   */
  public update(deltaTimeSec: number): void {
    this.marketTimer += deltaTimeSec;
    if (this.marketTimer >= 30) {
      this.marketTimer = 0;
      // Fluctuate crude oil +- 2%
      const delta = (Math.random() - 0.49) * 2.0;
      this.crudeOilMarketIndex = Math.max(45, Math.min(140, this.crudeOilMarketIndex + delta));

      // Adjust wholesale costs accordingly
      const factor = this.crudeOilMarketIndex / 80.0;
      this.tanks.REGULAR.costPerLiterWholesale = +(0.85 * factor).toFixed(2);
      this.tanks.PREMIUM.costPerLiterWholesale = +(1.05 * factor).toFixed(2);
      this.tanks.DIESEL.costPerLiterWholesale = +(0.95 * factor).toFixed(2);
    }
  }

  /**
   * Dispense fuel to a customer vehicle
   */
  public dispenseFuel(type: FuelType, litersNeeded: number): { litersDispensed: number; costToCustomer: number } {
    const tank = this.tanks[type];
    if (!tank) return { litersDispensed: 0, costToCustomer: 0 };

    if (type === 'ELECTRIC') {
      // Direct grid connection, always available
      const cost = litersNeeded * tank.retailPricePerLiter;
      return { litersDispensed: litersNeeded, costToCustomer: +cost.toFixed(2) };
    }

    const available = tank.currentLiters;
    const toDispense = Math.min(available, litersNeeded);
    tank.currentLiters -= toDispense;

    // Check low fuel warning
    if (tank.currentLiters < tank.reorderThreshold && !tank.orderPending) {
      if (tank.autoReorder) {
        this.triggerReorder(type);
      } else {
        gameEvents.emit('LOW_FUEL_WARNING', { fuelType: type, remaining: tank.currentLiters });
      }
    }

    const costToCustomer = +(toDispense * tank.retailPricePerLiter).toFixed(2);
    return { litersDispensed: toDispense, costToCustomer };
  }

  /**
   * Trigger fuel delivery tanker order
   */
  public triggerReorder(type: FuelType): { orderedLiters: number; wholesaleCost: number } | null {
    const tank = this.tanks[type];
    if (!tank || tank.orderPending || type === 'ELECTRIC') return null;

    const neededLiters = tank.maxCapacityLiters - tank.currentLiters;
    if (neededLiters <= 500) return null;

    tank.orderPending = true;
    const wholesaleCost = +(neededLiters * tank.costPerLiterWholesale).toFixed(2);

    // Delivery arrives in 10 seconds
    setTimeout(() => {
      tank.currentLiters = tank.maxCapacityLiters;
      tank.orderPending = false;
      sound.playPumpSound();
      gameEvents.emit('FLOATING_TEXT', {
        text: `⛽ Tanker Refilled: +${Math.round(neededLiters)}L ${type}`,
        x: 0,
        y: 0,
        color: '#10b981'
      });
    }, 8000);

    return { orderedLiters: neededLiters, wholesaleCost };
  }

  public setRetailPrice(type: FuelType, price: number): void {
    if (this.tanks[type]) {
      this.tanks[type].retailPricePerLiter = Math.max(0.1, +price.toFixed(2));
    }
  }

  public toggleAutoReorder(type: FuelType): boolean {
    if (this.tanks[type] && type !== 'ELECTRIC') {
      this.tanks[type].autoReorder = !this.tanks[type].autoReorder;
      return this.tanks[type].autoReorder;
    }
    return false;
  }

  public getCrudeOilPrice(): number {
    return +this.crudeOilMarketIndex.toFixed(2);
  }
}
