import { PlacedBuilding } from '../../types';
import { gameEvents } from '../../core/EventBus';
import { sound } from '../../audio/SoundEngine';

export interface CommercialMetrics {
  storeRevenue: number;
  dinerRevenue: number;
  carWashRevenue: number;
  storeInventoryLevel: number; // 0 - 100%
}

export class StoreManager {
  public storeInventory: number = 100; // percent
  public avgStoreTicket: number = 14.50;
  public avgDinerMealPrice: number = 22.00;
  public carWashPrice: number = 18.00;

  public storeRevenue: number = 0;
  public dinerRevenue: number = 0;
  public carWashRevenue: number = 0;

  /**
   * Process customer shopping at convenience store
   */
  public visitStore(store: PlacedBuilding, customerHunger: number): number {
    if (this.storeInventory <= 5) return 0;

    // Hungry travelers buy more snacks/drinks
    const multiplier = customerHunger > 60 ? 1.5 : 1.0;
    const bill = +(this.avgStoreTicket * multiplier).toFixed(2);

    this.storeInventory = Math.max(0, this.storeInventory - 1.2);
    this.storeRevenue += bill;
    store.revenueTotal += bill;

    sound.playCashSound();
    gameEvents.emit('STORE_PURCHASE', { storeId: store.id, amount: bill });

    return bill;
  }

  /**
   * Process customer eating at diner
   */
  public visitDiner(diner: PlacedBuilding, passengerCount: number): number {
    const mealCount = Math.max(1, passengerCount);
    const bill = +(this.avgDinerMealPrice * mealCount).toFixed(2);

    this.dinerRevenue += bill;
    diner.revenueTotal += bill;

    sound.playCashSound();
    gameEvents.emit('MEAL_SERVED', { dinerId: diner.id, amount: bill });

    return bill;
  }

  /**
   * Process vehicle using the car wash
   */
  public visitCarWash(carWash: PlacedBuilding): number {
    const bill = this.carWashPrice;
    this.carWashRevenue += bill;
    carWash.revenueTotal += bill;

    sound.playCashSound();
    return bill;
  }

  /**
   * Restock store inventory
   */
  public restockStore(): number {
    const needed = 100 - this.storeInventory;
    const cost = +(needed * 12.0).toFixed(2); // $12 per unit
    this.storeInventory = 100;
    return cost;
  }

  public getMetrics(): CommercialMetrics {
    return {
      storeRevenue: +this.storeRevenue.toFixed(2),
      dinerRevenue: +this.dinerRevenue.toFixed(2),
      carWashRevenue: +this.carWashRevenue.toFixed(2),
      storeInventoryLevel: Math.round(this.storeInventory)
    };
  }
}
