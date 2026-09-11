/**
 * Bus Simulator - Garage System (26)
 * Manages player's bus fleet, garage slots, and bus selection
 *
 * SKELETON - Core logic implemented, UI to be expanded in Phase 2
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const BusTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.BusTypes) || null;
  const Bus = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Bus) ||
    (typeof require !== 'undefined' ? require('../entities/Bus') : null);
  const EconomyConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EconomyConfig) ||
    (typeof require !== 'undefined' ? require('../data/economy') : null);
  const GarageConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GarageConfig) || null;
  const OperatorSystem = (typeof window !== 'undefined' && window.BusSim && window.BusSim.OperatorSystem) || null;

  const GarageSystem = {
    _garage: [],
    _activeBusId: null,
    _garageSlots: 5,
    _maxGarageSlots: 50,

    init(modules) {
      this.modules = modules;

      const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
      if (player) {
        this._garage = player.garage || [];
        this._activeBusId = player.activeBusId || (this._garage[0] ? this._garage[0].id : null);
        this._garageSlots = player.garageSlots || 5;
      }

      EventManager.emit('garageInitialized', {
        busCount: this._garage.length,
        slots: this._garageSlots
      });
    },

    /**
     * Purchase a new bus and add it to the garage.
     * @param {string} busTypeId
     * @returns {Object} result
     */
    purchaseBus(busTypeId) {
      const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
      if (!player) return { success: false, error: 'Player not found' };

      const busType = BusTypes ? BusTypes.getById(busTypeId) : null;
      if (!busType) return { success: false, error: 'Bus type not found' };

      if (this._garage.length >= this._garageSlots) {
        return { success: false, error: 'Garage is full' };
      }

      // Apply discount for company-owned bus
      let cost = busType.price;
      const discount = EconomyConfig ? EconomyConfig.economy.busPurchaseDiscount : 0;
      cost = Math.round(cost * (1 - discount));

      if (!player.canAfford(cost)) {
        return { success: false, error: 'Not enough money', cost: cost };
      }

      const bus = new Bus(0, 0, busTypeId);
      const company = player.company;
      if (company && typeof company.generateFleetNumber === 'function' ||
          (company && company.fleetPrefix)) {
        bus.fleetNumber = this._generateFleetNumber(company, this._garage.length);
      }

      // Position near depot
      const map = this.modules.Map;
      if (map && map.allCities && map.allCities.length > 0) {
        const city = map.allCities.find(c => c.type === 'metropolitan') || map.allCities[0];
        bus.x = city.x;
        bus.y = city.y;
      }

      player.spendMoney(cost);
      this._garage.push(bus);

      EventManager.emit('busPurchased', {
        busId: bus.id,
        busType: busTypeId,
        busName: busType.displayName,
        cost: cost
      });

      return { success: true, bus: bus, cost: cost };
    },

    _generateFleetNumber(company, index) {
      const prefix = company.fleetPrefix || 'MH';
      const num = company ? (company.nextFleetNumber || (index + 1)) : (index + 1);
      company.nextFleetNumber = (num + 1);
      const padded = String(num).padStart(3, '0');
      return `${prefix}-${padded}`;
    },

    /**
     * Set the active bus.
     */
    setActiveBus(busId) {
      const bus = this._garage.find(b => b.id === busId);
      if (!bus) return false;

      this._activeBusId = busId;

      // Sync to canonical source of truth (Player)
      const player = this.modules && this.modules.GameInitSystem
        ? this.modules.GameInitSystem.getPlayer()
        : null;
      if (player) player.activeBusId = busId;

      EventManager.emit('busSelected', { busId: busId });
      return true;
    },

    getActiveBus() {
      return this._garage.find(b => b.id === this._activeBusId) || this._garage[0] || null;
    },

    getGarage() {
      return this._garage;
    },

    getGarageInfo() {
      return {
        buses: this._garage.length,
        slots: this._garageSlots,
        maxSlots: this._maxGarageSlots,
        activeBusId: this._activeBusId,
        totalValue: this._garage.reduce((sum, b) => sum + (b.value || 0), 0)
      };
    },

    upgradeGarageSlots() {
      const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
      if (!player) return { success: false };

      const cost = this._garageSlots * 10000;
      if (!player.canAfford(cost)) return { success: false, error: 'Not enough money', cost };

      player.spendMoney(cost);
      this._garageSlots = Math.min(this._maxGarageSlots, this._garageSlots + 5);
      player.garageSlots = this._garageSlots;

      EventManager.emit('garageUpgraded', { slots: this._garageSlots, cost });
      return { success: true, slots: this._garageSlots, cost };
    },

    sellBus(busId) {
      const idx = this._garage.findIndex(b => b.id === busId);
      if (idx < 0) return { success: false, error: 'Bus not found' };
      if (this._garage.length <= 1) return { success: false, error: 'Cannot sell last bus' };

      const bus = this._garage[idx];
      const resaleValue = Math.round(bus.value * 0.7);

      this._garage.splice(idx, 1);

      if (this._activeBusId === busId) {
        this._activeBusId = this._garage[0] ? this._garage[0].id : null;
      }

      const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
      if (player) {
        player.addMoney(resaleValue);
        // Sync active bus to canonical source of truth
        player.activeBusId = this._activeBusId;
      }

      EventManager.emit('busSold', { busId: busId, value: resaleValue });
      return { success: true, value: resaleValue };
    },

serialize() {
      return {
        garage: this._garage.map(b => b.serialize ? b.serialize() : b),
        activeBusId: this._activeBusId,
        garageSlots: this._garageSlots
      };
    },

    // ===== Phase 8: Garage configuration & preview =====

    /**
     * Returns the list of available bus types for selection.
     */
    getAvailableBusTypes() {
      return BusTypes ? BusTypes.allBusTypes : [];
    },

    /**
     * Builds a preview bus (not added to the garage) from a configuration.
     * Used by the garage UI to show live statistics before committing.
     */
    buildPreview(config) {
      if (!Bus) return null;
      const cfg = config || (GarageConfig ? GarageConfig.getConfig() : null);
      if (!cfg) return null;

      const bus = new Bus(
        0, 0,
        cfg.busTypeId,
        cfg.operatorId,
        cfg.serviceType,
        cfg.busNumber,
        cfg.destinationBoard,
        cfg.customization
      );
      return bus;
    },

    /**
     * Returns the statistics object for a bus (preview or active).
     */
    getBusStatistics(bus) {
      if (!bus) return null;
      const bt = bus.busType;
      return {
        busTypeId: bus.busTypeId,
        name: bt ? bt.displayName : 'Unknown Bus',
        category: bt ? bt.category : null,
        bodyType: bt ? bt.bodyType : null,
        operatorId: bus.operatorId || null,
        serviceType: bus.serviceType || 'city',
        passengerCapacity: bus.passengerCapacity,
        standingCapacity: bus.maxStanding || 0,
        availableSeats: Math.max(0, bus.passengerCapacity - (bus.maxStanding || 0)),
        maxSpeed: bus.maxSpeed,
        acceleration: bus.acceleration || 6.5,
        handling: bus.turnRate || 1.5,
        fareMultiplier: bus.serviceFareMultiplier || 1.0,
        boardingTime: bus.boardingTimePerPassenger || 2.5,
        alightTime: bus.alightTimePerPassenger || 1.5,
        fuelCapacity: bus.fuelCapacity,
        fuelEfficiency: bus.fuelEfficiency,
        comfort: bt ? bt.comfort : 5,
        busNumber: bus.busNumber || null,
        destinationBoard: bus.destinationBoard || null
      };
    },

    /**
     * Validates a garage configuration.
     */
    validateConfig(config) {
      const cfg = config || (GarageConfig ? GarageConfig.getConfig() : null);
      if (!cfg) return { valid: false, errors: ['No configuration'] };

      const errors = [];
      if (!cfg.busTypeId) errors.push('No bus type selected');
      if (!cfg.operatorId) errors.push('No operator selected');
      if (!cfg.serviceType) errors.push('No service type selected');

      if (BusTypes && cfg.busTypeId) {
        const bt = BusTypes.getById(cfg.busTypeId);
        if (!bt) errors.push('Bus type not found: ' + cfg.busTypeId);
      }

      if (OperatorSystem && cfg.operatorId) {
        const op = OperatorSystem.getById(cfg.operatorId);
        if (!op) errors.push('Operator not found: ' + cfg.operatorId);
      }

      return { valid: errors.length === 0, errors, config: cfg };
    },

    /**
     * Applies a configuration to the active bus (if one exists).
     */
    applyConfigToActiveBus(config) {
      const cfg = config || (GarageConfig ? GarageConfig.getConfig() : null);
      const bus = this.getActiveBus();
      if (!bus || !cfg) return false;

      if (cfg.busTypeId) {
        const bt = BusTypes ? BusTypes.getById(cfg.busTypeId) : null;
        bus.busTypeId = cfg.busTypeId;
        if (bt) bus.busType = bt;
      }
      if (typeof bus.setService === 'function') {
        bus.setService(cfg.serviceType, cfg.operatorId);
      }
      if (cfg.customization && typeof bus.setCustomization === 'function') {
        bus.setCustomization(cfg.customization);
      }
      if (cfg.busNumber) bus.busNumber = cfg.busNumber;
      if (cfg.destinationBoard) bus.destinationBoard = cfg.destinationBoard;
      if (cfg.operatorId) bus.operatorId = cfg.operatorId;

      if (EventManager) {
        EventManager.emit('garageConfigApplied', { busId: bus.id, config: cfg });
      }
      return true;
    },

    /**
     * Returns the active garage configuration (from GarageConfig if available).
     */
    getActiveConfig() {
      if (GarageConfig) return GarageConfig.getConfig();
      const bus = this.getActiveBus();
      if (!bus) return null;
      return {
        busTypeId: bus.busTypeId,
        operatorId: bus.operatorId || null,
        serviceType: bus.serviceType || 'city',
        busNumber: bus.busNumber || null,
        destinationBoard: bus.destinationBoard || null,
        customization: bus.customization || {}
      };
    },

    deserialize(data) {
      this._garage = data.garage || [];
      this._activeBusId = data.activeBusId || (this._garage[0] ? this._garage[0].id : null);
      this._garageSlots = data.garageSlots || 5;

      // Sync to canonical source of truth (Player) to prevent divergence
      const player = this.modules && this.modules.GameInitSystem
        ? this.modules.GameInitSystem.getPlayer()
        : null;
      if (player) {
        player.garage = this._garage;
        player.activeBusId = this._activeBusId;
        player.garageSlots = this._garageSlots;
      }
    },

    destroy() {
      this._garage = [];
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.GarageSystem = GarageSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = GarageSystem;
  }
})();
