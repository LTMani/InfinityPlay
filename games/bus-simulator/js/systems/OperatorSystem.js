/**
 * Bus Simulator - Operator System (Phase 7)
 * Manages operator selection, service configuration, and depot association.
 * Provides a runtime layer over the static js/data/operators.js data.
 *
 * All operator names and branding are original fictional creations.
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const OperatorData = (typeof window !== 'undefined' && window.BusSim && window.BusSim.OperatorSystem) ||
    (typeof require !== 'undefined' ? require('../data/operators') : null);
  const ServiceTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.ServiceTypes) ||
    (typeof require !== 'undefined' ? require('../data/service-types') : null);
  const BusTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.BusTypes) ||
    (typeof require !== 'undefined' ? require('../data/bus-types') : null);

  const OperatorSystem = {
    activeOperatorId: null,
    activeServiceType: 'city',
    _depots: {},

    init(modules) {
      this.modules = modules;
      this.activeOperatorId = null;
      this.activeServiceType = 'city';
      this._depots = {};

      // Seed default depots for each operator
      if (OperatorData) {
        for (const op of OperatorData.getAll()) {
          this._depots[op.id] = {
            operatorId: op.id,
            buses: [],
            services: op.preferredServiceTypes || []
          };
        }
      }

      if (EventManager) {
        EventManager.on('operatorSelected', (data) => {
          this.setActiveOperator(data.operatorId);
        });
        EventManager.on('serviceSelected', (data) => {
          this.setActiveServiceType(data.serviceType);
        });
        EventManager.on('busPurchased', (data) => {
          this._assignBusToDepot(data.busId, data.operatorId);
        });
      }
    },

    /**
     * Set the currently active operator.
     */
    setActiveOperator(operatorId) {
      const op = OperatorData ? OperatorData.getById(operatorId) : null;
      if (!op) return false;
      this.activeOperatorId = operatorId;
      if (EventManager) EventManager.emit('operatorChanged', { operatorId: operatorId, operator: op });
      return true;
    },

    /**
     * Set the currently active service type.
     */
    setActiveServiceType(serviceType) {
      const svc = ServiceTypes ? ServiceTypes.getById(serviceType) : null;
      if (!svc) return false;
      this.activeServiceType = serviceType;
      if (EventManager) EventManager.emit('serviceChanged', { serviceType: serviceType, service: svc });
      return true;
    },

    /**
     * Returns the currently active operator object.
     */
    getActiveOperator() {
      if (!this.activeOperatorId || !OperatorData) return null;
      return OperatorData.getById(this.activeOperatorId);
    },

    /**
     * Returns the currently active service config.
     */
    getActiveService() {
      if (!ServiceTypes) return null;
      return ServiceTypes.getById(this.activeServiceType);
    },

    /**
     * Returns all operators.
     */
    getAllOperators() {
      return OperatorData ? OperatorData.getAll() : [];
    },

    /**
     * Returns an operator by id (convenience wrapper).
     */
    getById(operatorId) {
      return OperatorData ? OperatorData.getById(operatorId) : null;
    },

    /**
     * Returns operators filtered by type.
     */
    getOperatorsByType(type) {
      return OperatorData ? OperatorData.getByType(type) : [];
    },

    /**
     * Returns service types compatible with the given bus type.
     */
    getCompatibleServiceTypes(busTypeId) {
      if (!BusTypes || !ServiceTypes) return ServiceTypes ? ServiceTypes.types : [];
      const bt = BusTypes.getById(busTypeId);
      if (!bt) return ServiceTypes.types;
      const ids = bt.serviceTypes && bt.serviceTypes.length
        ? bt.serviceTypes
        : (bt.serviceType ? [bt.serviceType] : ['city']);
      return ServiceTypes.types.filter(s => ids.includes(s.id));
    },

    /**
     * Returns operators whose preferred service types overlap with the
     * service types compatible with the given bus type.
     */
    getCompatibleOperators(busTypeId) {
      if (!OperatorData || !BusTypes) return OperatorData ? OperatorData.getAll() : [];
      const bt = BusTypes.getById(busTypeId);
      if (!bt) return OperatorData.getAll();
      return OperatorData.getByBusType(bt);
    },

    /**
     * Returns the depot state for an operator.
     */
    getDepot(operatorId) {
      return this._depots[operatorId] || null;
    },

    /**
     * Assign a bus to an operator's depot.
     */
    _assignBusToDepot(busId, operatorId) {
      const targetId = operatorId || this.activeOperatorId;
      if (!targetId) return false;
      if (!this._depots[targetId]) {
        this._depots[targetId] = { operatorId: targetId, buses: [], services: [] };
      }
      if (!this._depots[targetId].buses.includes(busId)) {
        this._depots[targetId].buses.push(busId);
      }
      return true;
    },

    /**
     * Returns the default operator and service for a bus type.
     */
    getDefaultConfig(busTypeId) {
      const bt = BusTypes ? BusTypes.getById(busTypeId) : null;
      return {
        operatorId: bt && bt.operatorId ? bt.operatorId : null,
        serviceType: bt && bt.serviceType ? bt.serviceType : 'city'
      };
    },

    serialize() {
      return {
        activeOperatorId: this.activeOperatorId,
        activeServiceType: this.activeServiceType,
        depots: this._depots
      };
    },

    deserialize(data) {
      if (!data) return;
      this.activeOperatorId = data.activeOperatorId || null;
      this.activeServiceType = data.activeServiceType || 'city';
      this._depots = data.depots || {};
    },

    destroy() {
      this.activeOperatorId = null;
      this.activeServiceType = 'city';
      this._depots = {};
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.OperatorSystem = OperatorSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = OperatorSystem;
  }
})();