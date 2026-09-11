/**
 * Bus Simulator - Drop Off System
 * Manages passenger alighting at their destinations:
 * - Detects passengers whose destination matches current stop
 * - Gradual alighting with timing
 * - Passenger tracking and state updates
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const GameConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig) ||
    (typeof require !== 'undefined' ? require('../config/GameConfig') : null);
  const PassengerConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.PassengerConfig) ||
    (typeof require !== 'undefined' ? require('../config/PassengerConfig') : null);

  const DropOffSystem = {
    _alighting: false,
    _alightingPassengers: [],
    _alightingTimer: 0,
    _alightingProgress: 0,
    _currentStop: null,
    _totalAlightedThisStop: 0,

    init(modules) {
      this.modules = modules;

      if (EventManager) {
        EventManager.on('arrivedAtStop', (data) => {
          this.startDropOff(data.stop, data.bus);
        });
      }
    },

    startDropOff(stop, bus) {
      if (!bus || !stop) return;

      this._alighting = true;
      this._currentStop = stop;
      this._alightingTimer = 0;
      this._alightingProgress = 0;
      this._totalAlightedThisStop = 0;
      this._alightingPassengers = [];

      const pcfg = PassengerConfig || {};
      const boardingCfg = pcfg.boarding || {};
      // Phase 7: service-specific alight time takes priority over config default
      const alightTime = (bus && bus.alightTimePerPassenger)
        ? bus.alightTimePerPassenger
        : (boardingCfg.alightTimePerPassenger || 1.5);

      const stopId = stop.id;
      const boardedPassengers = bus.boardedPassengers || [];

      // Find passengers whose destination is this stop
      const toAlight = [];
      for (let i = 0; i < boardedPassengers.length; i++) {
        const p = boardedPassengers[i];
        const destId = p.destinationStopId || p.destination;
        if (destId === stopId) {
          toAlight.push(p);
        }
      }

      this._alightingPassengers = toAlight;

      if (toAlight.length > 0) {
        // Mark passengers as alighting
        for (let i = 0; i < toAlight.length; i++) {
          toAlight[i].state = 'alighting';
          toAlight[i].alightingProgress = 0;
        }

        EventManager.emit('passengersAlighting', {
          stop: stop,
          count: toAlight.length,
          alightTime: alightTime
        });

        this._emitFeedback('alighting', toAlight.length + ' passengers getting off...');
      }
    },

    update(dt) {
      if (!this._alighting || this._alightingPassengers.length === 0) {
        if (this._alighting && this._alightingPassengers.length === 0) {
          this.completeDropOff();
        }
        return;
      }

      const bus = this.modules.GameInitSystem ? this.modules.GameInitSystem.getActiveBus() : null;
      if (!bus) {
        this._alighting = false;
        return;
      }

      const pcfg = PassengerConfig || {};
      const boardingCfg = pcfg.boarding || {};
      const alightTime = boardingCfg.alightTimePerPassenger || 1.5;

      this._alightingTimer += dt;

      if (this._alightingTimer >= alightTime) {
        this._alightingTimer -= alightTime;

        const passenger = this._alightingPassengers.shift();
        if (passenger) {
          // Remove from bus
          if (typeof bus.disembarkPassenger === 'function') {
            bus.disembarkPassenger(passenger);
          } else {
            bus.passengersOnBoard--;
            if (bus.passengersOnBoard < 0) bus.passengersOnBoard = 0;
          }

          // Update passenger state
          passenger.state = 'alighted';
          passenger.active = false;

          this._totalAlightedThisStop++;

          // Track stats
          const passengerSystem = this.modules.PassengerSystem;
          if (passengerSystem) passengerSystem.recordAlighted(1);

          EventManager.emit('passengerAlighted', {
            passenger: passenger,
            onBoard: bus.passengersOnBoard,
            capacity: bus.passengerCapacity
          });
        }
      }
    },

    completeDropOff() {
      this._alighting = false;
      this._alightingPassengers = [];
      this._alightingTimer = 0;
      this._alightingProgress = 0;

      const bus = this.modules.GameInitSystem ? this.modules.GameInitSystem.getActiveBus() : null;
      const onBoard = bus ? bus.passengersOnBoard : 0;

      EventManager.emit('passengersAlighted', {
        count: this._totalAlightedThisStop,
        onBoard: onBoard,
        capacity: bus ? bus.passengerCapacity : 0,
        alighted: this._totalAlightedThisStop
      });
    },

    isAlighting() {
      return this._alighting;
    },

    getAlightingProgress() {
      if (!this._alighting || this._alightingPassengers.length === 0) return 1;
      const pcfg = PassengerConfig || {};
      const alightTime = (pcfg.boarding && pcfg.boarding.alightTimePerPassenger) || 1.5;
      return this._alightingTimer / alightTime;
    },

    getAlightingCount() {
      return this._alightingPassengers.length;
    },

    getAlightedThisStop() {
      return this._totalAlightedThisStop;
    },

    getPassengersToAlight(bus, stop) {
      if (!bus || !bus.boardedPassengers || !stop) return [];
      const stopId = stop.id;
      return bus.boardedPassengers.filter(p => {
        const destId = p.destinationStopId || p.destination;
        return destId === stopId;
      });
    },

    _emitFeedback(type, message) {
      if (EventManager) {
        EventManager.emit('hudFeedback', {
          type: type,
          message: message,
          duration: 3.0
        });
      }
    },

    serialize() {
      return {
        alighting: this._alighting,
        remaining: this._alightingPassengers.length,
        alightedThisStop: this._totalAlightedThisStop
      };
    },

    deserialize(data) {
      this._alighting = data.alighting || false;
    },

    destroy() {
      this._alighting = false;
      this._alightingPassengers = [];
      this._currentStop = null;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.DropOffSystem = DropOffSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = DropOffSystem;
  }
})();
