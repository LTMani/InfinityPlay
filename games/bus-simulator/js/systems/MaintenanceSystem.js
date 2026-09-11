/**
 * Bus Simulator - Maintenance System (25)
 * Tracks bus wear, schedules maintenance, and manages repair costs
 *
 * SKELETON - Full gameplay logic to be implemented in Phase 2
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const EconomyConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EconomyConfig) ||
    (typeof require !== 'undefined' ? require('../data/economy') : null);

  const MaintenanceSystem = {
    maintenanceHistory: [],
    serviceIntervals: [],
    pendingMaintenance: [],

    init(modules) {
      this.modules = modules;
      this.maintenanceHistory = [];
      this.serviceIntervals = [];
      this.pendingMaintenance = [];
    },

    /**
     * Check if a bus needs maintenance based on condition and distance.
     * @param {Bus} bus
     * @returns {Object|null} maintenance recommendation or null
     */
    checkMaintenance(bus) {
      const recommendations = [];

      if (!bus) return null;

      // Check condition
      if (bus.condition < 50) {
        recommendations.push({
          type: 'repair',
          severity: 'critical',
          description: 'Bus body requires major repairs',
          cost: Math.round((100 - bus.condition) *
            (EconomyConfig ? EconomyConfig.expenses.damageRepairPerPercent : 150))
        });
      } else if (bus.condition < 80) {
        recommendations.push({
          type: 'repair',
          severity: 'moderate',
          description: 'Minor body repairs needed',
          cost: Math.round((100 - bus.condition) *
            (EconomyConfig ? EconomyConfig.expenses.damageRepairPerPercent : 150) * 0.5)
        });
      }

      // Check maintenance interval
      const interval = bus.maintenanceInterval || 5000;
      const distanceSince = bus.tripDistance - (bus.lastMaintenance || 0);
      if (distanceSince > interval) {
        recommendations.push({
          type: 'service',
          severity: 'routine',
          description: `Routine service due (${Math.round(distanceSince)} km since last service)`,
          cost: EconomyConfig ? EconomyConfig.expenses.routineMaintenanceBase : 8000
        });
      }

      // Check fuel system
      if (bus.fuelEfficiency < (bus.busType ? bus.busType.fuelEfficiency : 3.5) * 0.8) {
        recommendations.push({
          type: 'engine_tune',
          severity: 'moderate',
          description: 'Engine tuning needed for fuel efficiency',
          cost: 5000
        });
      }

      if (recommendations.length === 0) return null;

      return {
        busId: bus.id,
        recommendations: recommendations,
        totalCost: recommendations.reduce((sum, r) => sum + r.cost, 0)
      };
    },

    /**
     * Perform maintenance on a bus.
     * @param {Bus} bus
     * @param {Object} recommendation
     * @returns {Object} result with cost and new condition
     */
    performMaintenance(bus, recommendation) {
      if (!bus || !recommendation) return { success: false, error: 'Invalid parameters' };

      let totalCost = 0;

      for (const rec of recommendation.recommendations) {
        totalCost += rec.cost;

        switch (rec.type) {
          case 'repair':
            bus.repair(100 - bus.damage);
            break;
          case 'service':
            bus.lastMaintenance = bus.tripDistance;
            break;
          case 'engine_tune':
            if (bus.busType && BusTypes) {
              bus.fuelEfficiency = bus.busType.fuelEfficiency;
            }
            break;
        }
      }

      const record = {
        busId: bus.id,
        type: recommendation.recommendations.map(r => r.type),
        cost: totalCost,
        timestamp: Date.now()
      };
      this.maintenanceHistory.push(record);

      EventManager.emit('maintenancePerformed', {
        busId: bus.id,
        cost: totalCost,
        records: record
      });

      return {
        success: true,
        cost: totalCost,
        condition: bus.condition,
        newMaintenanceCondition: 100,
        record: record
      };
    },

    /**
     * Check all buses in the player's garage.
     * @returns {Array} list of maintenance recommendations
     */
    checkAllBuses() {
      const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
      if (!player || !player.garage) return [];

      const results = [];
      for (const bus of player.garage) {
        const recommendation = this.checkMaintenance(bus);
        if (recommendation) {
          results.push(recommendation);
        }
      }
      return results;
    },

    getMaintenanceHistory() {
      return this.maintenanceHistory;
    },

    getPendingMaintenance() {
      return this.checkAllBuses();
    },

    serialize() {
      return {
        maintenanceHistory: this.maintenanceHistory,
        serviceIntervals: this.serviceIntervals
      };
    },

    deserialize(data) {
      this.maintenanceHistory = data.maintenanceHistory || [];
      this.serviceIntervals = data.serviceIntervals || [];
    },

    destroy() {
      this.maintenanceHistory = [];
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.MaintenanceSystem = MaintenanceSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = MaintenanceSystem;
  }
})();
