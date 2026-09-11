/**
 * Bus Simulator - Garage Configuration Store (Phase 8)
 * Central active configuration for the player's selected bus.
 * Holds bus type, operator, service, customization, and identity fields.
 * No economy, no external APIs.
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const BusTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.BusTypes) ||
    (typeof require !== 'undefined' ? require('../data/bus-types') : null);

  const DEFAULT_CONFIG = {
    busTypeId: 'pallevelugu',
    operatorId: null,
    serviceType: 'local',
    busNumber: 'MH-01-BUS-001',
    destinationBoard: 'Depot - City Center',
    customization: {
      exterior: {
        paintColor: '#f59e0b',
        livery: 'standard',
        lights: 'stock',
        wheels: 'steel',
        accessories: [],
        fleetNumber: null
      },
      interior: {
        seatStyle: 'fabric-red',
        interiorColor: 'beige',
        lighting: 'warm-white',
        decorations: [],
        comfort: 5,
        theme: 'standard'
      },
      performance: {
        engineTuning: 'stock',
        transmission: 'manual-5',
        brakes: 'drum',
        suspension: 'leaf'
      }
    }
  };

  const GarageConfig = {
    config: null,

    init(modules) {
      this.modules = modules;
      this.config = this._clone(DEFAULT_CONFIG);
      this._resolveDefaults();
    },

    _resolveDefaults() {
      const bt = BusTypes ? BusTypes.getById(this.config.busTypeId) : null;
      if (bt) {
        if (!this.config.operatorId && bt.operatorId) {
          this.config.operatorId = bt.operatorId;
        }
        if (bt.serviceType && (!this.config.serviceType || this.config.serviceType === 'local')) {
          this.config.serviceType = bt.serviceType;
        }
      }
    },

    setBusType(busTypeId) {
      const bt = BusTypes ? BusTypes.getById(busTypeId) : null;
      if (!bt) return false;
      this.config.busTypeId = busTypeId;
      if (bt.operatorId) this.config.operatorId = bt.operatorId;
      if (bt.serviceType) this.config.serviceType = bt.serviceType;
      this._notify();
      return true;
    },

    setOperator(operatorId) {
      this.config.operatorId = operatorId;
      this._notify();
      return true;
    },

    setServiceType(serviceType) {
      this.config.serviceType = serviceType;
      this._notify();
      return true;
    },

    setCustomization(customization) {
      this.config.customization = this._clone(customization || {});
      this._notify();
      return true;
    },

    setBusNumber(number) {
      this.config.busNumber = number;
      this._notify();
      return true;
    },

    setDestinationBoard(text) {
      this.config.destinationBoard = text;
      this._notify();
      return true;
    },

    getConfig() {
      return this._clone(this.config);
    },

    validate() {
      const errors = [];
      if (!this.config.busTypeId) errors.push('No bus type selected');
      if (!this.config.operatorId) errors.push('No operator selected');
      if (!this.config.serviceType) errors.push('No service type selected');
      return { valid: errors.length === 0, errors };
    },

    reset() {
      this.config = this._clone(DEFAULT_CONFIG);
      this._resolveDefaults();
      this._notify();
      return true;
    },

    _clone(obj) {
      return JSON.parse(JSON.stringify(obj || {}));
    },

    _notify() {
      if (EventManager) {
        EventManager.emit('garageConfigChanged', { config: this.getConfig() });
      }
    },

    serialize() {
      return this._clone(this.config);
    },

    deserialize(data) {
      if (!data) return;
      this.config = this._clone(DEFAULT_CONFIG);
      Object.assign(this.config, data);
      this._resolveDefaults();
    },

    destroy() {
      this.config = null;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.GarageConfig = GarageConfig;
  }
  if (typeof module !== 'undefined') {
    module.exports = GarageConfig;
  }
})();