/**
 * Bus Simulator - Trip System (18)
 * Tracks trip progress, metrics, and completion rewards
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const EconomyConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EconomyConfig) ||
    (typeof require !== 'undefined' ? require('../data/economy') : null);

  const TripSystem = {
    currentTrip: null,
    tripStartTime: 0,
    tripDistance: 0,
    passengersCarried: 0,
    onTime: true,
    perfectRating: true,
    accidentFree: true,
    fuelUsed: 0,
    tollCost: 0,
    maintenanceCost: 0,
    totalRevenue: 0,
    totalExpenses: 0,

    init(modules) {
      this.modules = modules;
      this._resetTrip();
    },

    startTrip(route) {
      this._resetTrip();
      this.currentTrip = route;
      this.tripStartTime = Date.now();

      EventManager.emit('tripStarted', { route: route });
    },

    _resetTrip() {
      this.tripDistance = 0;
      this.passengersCarried = 0;
      this.onTime = true;
      this.perfectRating = true;
      this.accidentFree = true;
      this.fuelUsed = 0;
      this.tollCost = 0;
      this.maintenanceCost = 0;
      this.totalRevenue = 0;
      this.totalExpenses = 0;
    },

    update(dt) {
      const bus = this.modules.GameInitSystem ? this.modules.GameInitSystem.getActiveBus() : null;
      const loop = this.modules.GameLoopSystem;

      if (!bus || !loop || !loop.canPlay()) return;

      // Track distance
      this.tripDistance += (bus.speed / 3.6) * dt;

      // Track fuel used
      const fuelRate = bus.fuelEfficiency ? (bus.speed / (bus.fuelEfficiency || 3.0)) * 0.0278
        : 0;
      this.fuelUsed += fuelRate * dt;

      // Track tolls
      const tollSystem = this._checkTollGate(bus);
      if (tollSystem) this.tollCost += tollSystem;
    },

    _checkTollGate(bus) {
      const pois = this.modules.Map ? this.modules.Map.pois : [];
      if (!pois || !bus) return 0;

      const threshold = 80;
      for (const poi of pois) {
        if (poi.type === 'toll') {
          const dist = Math.sqrt(Math.pow(poi.x - bus.x, 2) + Math.pow(poi.y - bus.y, 2));
          if (dist < threshold && !poi._collected) {
            poi._collected = true;
            const cost = (EconomyConfig && EconomyConfig.expenses.tollCharges) ?
              (EconomyConfig.expenses.tollCharges.min +
               Math.random() * (EconomyConfig.expenses.tollCharges.max - EconomyConfig.expenses.tollCharges.min)) :
              45;

            EventManager.emit('tollPaid', { amount: cost, poi: poi });
            return Math.round(cost);
          }
        }
      }
      return 0;
    },

    addPassengers(count) {
      this.passengersCarried += count;
    },

    registerAccident(damageAmount) {
      this.accidentFree = false;
      this.perfectRating = false;
      this.maintenanceCost += damageAmount * (EconomyConfig ? EconomyConfig.expenses.damageRepairPerPercent : 150);

      EventManager.emit('accidentReported', { damage: damageAmount });
    },

    completeTrip() {
      const route = this.currentTrip;
      if (!route) return null;

      // Calculate revenue
      const ticketSystem = this.modules.TicketSystem;
      const revenue = ticketSystem ? ticketSystem.payRevenue() : 0;
      this.totalRevenue = revenue;

      // Calculate expenses
      this.totalExpenses = (this.fuelUsed * (EconomyConfig ? EconomyConfig.expenses.fuelPricePerLiter : 85))
        + this.tollCost + this.maintenanceCost;

      // Apply route rewards
      let routeReward = (EconomyConfig ? EconomyConfig.revenue.routeCompletionBase : 500);
      const dayNight = this.modules.DayNightSystem;
      if (dayNight) {
        routeReward *= dayNight.isNight ? (EconomyConfig ? EconomyConfig.revenue.timeOfDayMultipliers.night : 1.8) : 1.0;
      }

      // On-time bonus
      if (this.onTime) {
        routeReward += (EconomyConfig ? EconomyConfig.revenue.onTimeBonus : 200);
      }

      // Perfect trip bonus
      if (this.perfectRating && this.accidentFree && this.onTime) {
        routeReward = Math.round(routeReward * 1.5);
        routeReward += (EconomyConfig ? EconomyConfig.revenue.perfectTripBonus : 1000);
      }

      // Weather multiplier
      const weather = this.modules.WeatherSystem;
      if (weather) {
        routeReward = Math.round(routeReward * weather.getWeatherMultiplier());
      }

      const netIncome = this.totalRevenue + routeReward - this.totalExpenses;

      const tripResult = {
        route: route,
        distance: Math.round(this.tripDistance),
        passengers: this.passengersCarried,
        revenue: this.totalRevenue,
        expenses: this.totalExpenses,
        routeReward: routeReward,
        netIncome: netIncome,
        fuelUsed: Math.round(this.fuelUsed),
        onTime: this.onTime,
        perfect: this.perfectRating,
        accidentFree: this.accidentFree,
        duration: (Date.now() - this.tripStartTime) / 1000
      };

      // Update player stats
      const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
      if (player) {
        player.addMoney(netIncome);
        player.addTrip(tripResult);
      }

      // Reset for next trip
      this._resetTrip();

      EventManager.emit('tripCompleted', tripResult);

      return tripResult;
    },

    cancelTrip() {
      this._resetTrip();
      this.currentTrip = null;
      EventManager.emit('tripCancelled', {});
    },

    getTripStats() {
      return {
        distance: Math.round(this.tripDistance),
        passengers: this.passengersCarried,
        fuelUsed: Math.round(this.fuelUsed),
        revenue: this.totalRevenue,
        expenses: this.totalExpenses,
        onTime: this.onTime,
        perfect: this.perfectRating
      };
    },

    serialize() {
      return {
        currentTripId: this.currentTrip ? this.currentTrip.id : null,
        tripDistance: this.tripDistance,
        passengersCarried: this.passengersCarried,
        fuelUsed: this.fuelUsed
      };
    },

    deserialize(data) {
      if (data.currentTripId) {
        const routeData = (typeof require !== 'undefined' ? require('../data/routes') : null);
        if (routeData) {
          this.currentTrip = routeData.getById(data.currentTripId);
        }
      }
      this.tripDistance = data.tripDistance || 0;
      this.passengersCarried = data.passengersCarried || 0;
      this.fuelUsed = data.fuelUsed || 0;
    },

    destroy() {
      this._resetTrip();
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.TripSystem = TripSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = TripSystem;
  }
})();
