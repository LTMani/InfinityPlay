/**
 * Bus Simulator - Fuel System (23)
 * Manages fuel consumption, refueling, and fuel station interaction
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const EconomyConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EconomyConfig) ||
    (typeof require !== 'undefined' ? require('../data/economy') : null);

  const FuelSystem = {
    _lowFuelThreshold: 0.15,   // 15% of capacity
    _nearFuelThreshold: 0.30,  // 30%
    _refueling: false,
    _refuelAmount: 0,
    _totalFuelPurchased: 0,
    _totalSpent: 0,

    init(modules) {
      this.modules = modules;
      this._refueling = false;
      this._refuelAmount = 0;
      this._totalFuelPurchased = 0;
      this._totalSpent = 0;
    },

    update(bus, dt) {
      if (!bus) return;

      bus.isLowFuel = bus.fuelLevel <= bus.fuelCapacity * this._lowFuelThreshold;

      if (this._refueling) {
        this._refuelAmount = Math.min(
          bus.fuelCapacity - bus.fuelLevel,
          bus.fuelEfficiency * dt * 0.1
        );
        bus.fuelLevel += this._refuelAmount;

        if (bus.fuelLevel >= bus.fuelCapacity) {
          bus.fuelLevel = bus.fuelCapacity;
          this.completeRefuel();
        }

        EventManager.emit('fuelUpdating', {
          current: bus.fuelLevel,
          capacity: bus.fuelCapacity,
          added: this._refuelAmount
        });
      }
    },

    startRefuel(bus, amount) {
      if (!bus || bus.fuelLevel >= bus.fuelCapacity) return false;

      this._refueling = true;
      this._refuelAmount = amount || bus.fuelCapacity - bus.fuelLevel;
    },

    completeRefuel() {
      this._refueling = false;
      this._totalFuelPurchased += this._refuelAmount;
      const cost = Math.round(this._refuelAmount * (EconomyConfig ? EconomyConfig.expenses.fuelPricePerLiter : 85));
      this._totalSpent += cost;

      EventManager.emit('refuelComplete', {
        amount: this._refuelAmount,
        cost: cost
      });

      this._refuelAmount = 0;
    },

    refuelFull(bus) {
      if (!bus) return { amount: 0, cost: 0 };

      const needed = bus.fuelCapacity - bus.fuelLevel;
      const cost = Math.round(needed * (EconomyConfig ? EconomyConfig.expenses.fuelPricePerLiter : 85));

      bus.fuelLevel = bus.fuelCapacity;
      bus.isLowFuel = false;
      this._totalFuelPurchased += needed;
      this._totalSpent += cost;

      EventManager.emit('refuelComplete', { amount: needed, cost: cost });

      return { amount: needed, cost: cost };
    },

    getFuelInfo(bus) {
      if (!bus) return null;

      return {
        current: bus.fuelLevel,
        capacity: bus.fuelCapacity,
        percent: Math.round((bus.fuelLevel / bus.fuelCapacity) * 100),
        isLow: bus.fuelLevel <= bus.fuelCapacity * this._lowFuelThreshold,
        isNearEmpty: bus.fuelLevel <= bus.fuelCapacity * 0.1,
        efficiency: bus.fuelEfficiency,
        range: Math.round(bus.fuelLevel * bus.fuelEfficiency),
        totalPurchased: this._totalFuelPurchased,
        totalSpent: this._totalSpent
      };
    },

    getNearestFuelStation(bus) {
      const map = this.modules.Map;
      if (!map || !map.pois || !bus) return null;

      let nearest = null;
      let minDist = Infinity;

      for (const poi of map.pois) {
        if (poi.type === 'fuel') {
          const dist = Math.sqrt(Math.pow(poi.x - bus.x, 2) + Math.pow(poi.y - bus.y, 2));
          if (dist < minDist) {
            minDist = dist;
            nearest = poi;
          }
        }
      }
      return nearest;
    },

    serialize() {
      return {
        totalFuelPurchased: this._totalFuelPurchased,
        totalSpent: this._totalSpent,
        refueling: this._refueling
      };
    },

    deserialize(data) {
      this._totalFuelPurchased = data.totalFuelPurchased || 0;
      this._totalSpent = data.totalSpent || 0;
      this._refueling = data.refueling || false;
    },

    destroy() {
      this._refueling = false;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.FuelSystem = FuelSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = FuelSystem;
  }
})();
