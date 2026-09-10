/**
 * Bus Simulator - Economy Data
 * Transport economy configuration for earnings and expenses
 */

(function () {
  'use strict';

  const economyConfig = {
    // ===== Revenue Streams =====
    revenue: {
      // Per-passenger fare scaled by distance
      baseFarePerKm: 12.5,

      // Route bonuses based on difficulty
      difficultyMultipliers: {
        easy: 1.0,
        medium: 1.3,
        hard: 1.8
      },

      // Time-of-day multipliers
      timeOfDayMultipliers: {
        dawn: 1.5,    // 5am-8am
        day: 1.0,     // 8am-6pm
        evening: 1.2, // 6pm-8pm
        night: 1.8    // 8pm-5am
      },

      // Weather effect on fares
      weatherMultipliers: {
        clear: 1.0,
        cloudy: 1.05,
        rain: 0.9,
        storm: 0.75
      },

      // On-time bonus
      onTimeBonus: 200,
      perfectTripBonus: 1000,

      // Route completion reward
      routeCompletionBase: 500,

      // Daily bonus for operating
      dailyOperatingBonus: 1500
    },

    // ===== Expense Streams =====
    expenses: {
      // Fuel costs
      fuelPricePerLiter: 85,        // coins per liter

      // Maintenance per km driven
      maintenancePerKm: 3.5,
      routineMaintenanceBase: 8000,

      // Toll charges
      tollCharges: {
        min: 20,
        max: 120
      },

      // Driver wages per trip
      driverWagePerTrip: 500,
      driverDailyWage: 1200,

      // Insurance
      insuranceMonthly: 15000,

      // Bus purchase
      busPurchaseDiscount: 0.15,    // 15% discount for owned buses

      // Damage repair cost per 1% damage
      damageRepairPerPercent: 150,

      // Depreciation
      annualDepreciation: 0.15
    },

    // ===== In-Game Currency =====
    currencies: {
      coins: {
        name: 'Game Coins',
        symbol: '₵',
        color: '#fbbf24'
      },
      reputation: {
        name: 'Reputation',
        symbol: '★',
        color: '#00f0ff'
      }
    },

    // ===== Leveling Rewards =====
    levelRewards: [
      { level: 1, coins: 0, unlocks: [] },
      { level: 5, coins: 5000, unlocks: ['bus-types.express'] },
      { level: 10, coins: 15000, unlocks: ['bus-types.ultra-deluxe'] },
      { level: 15, coins: 30000, unlocks: ['bus-types.indra-ac'] },
      { level: 20, coins: 50000, unlocks: ['private-travels'] },
      { level: 25, coins: 80000, unlocks: ['bus-types.super-luxury'] },
      { level: 30, coins: 120000, unlocks: ['regions.karnataka'] }
    ],

    // ===== Trip Earnings Calculation =====
    calculateTripRevenue(tripData) {
      const cfg = this;
      const route = tripData.route;
      if (!route) return 0;

      let baseRevenue = route.distance * cfg.revenue.baseFarePerKm;

      // Difficulty bonus
      const diffMult = cfg.revenue.difficultyMultipliers[route.difficulty] || 1.0;
      baseRevenue *= diffMult;

      // Time multiplier
      const timeMult = cfg.revenue.timeOfDayMultipliers[tripData.timeOfDay] || 1.0;
      baseRevenue *= timeMult;

      // Weather multiplier
      const weatherMult = cfg.revenue.weatherMultipliers[tripData.weather] || 1.0;
      baseRevenue *= weatherMult;

      // Passenger load factor
      const loadFactor = tripData.passengers / tripData.capacity;
      baseRevenue *= loadFactor * 0.9 + 0.1;

      // On-time bonus
      if (tripData.onTime) {
        baseRevenue += cfg.revenue.onTimeBonus;
      }

      // Perfect trip bonus
      if (tripData.perfect) {
        baseRevenue *= 1.5;
        baseRevenue += cfg.revenue.perfectTripBonus;
      }

      // Round to nearest integer
      return Math.round(baseRevenue);
    },

    calculateFuelCost(distance, fuelEfficiency) {
      return Math.round((distance / fuelEfficiency) * this.expenses.fuelPricePerLiter);
    },

    calculateMaintenanceCost(distance, condition) {
      return Math.round(distance * this.maintenancePerKm / Math.max(condition / 100, 0.3));
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.EconomyConfig = economyConfig;
  }
  if (typeof module !== 'undefined') {
    module.exports = economyConfig;
  }
})();
