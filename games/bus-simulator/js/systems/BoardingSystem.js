/**
 * Bus Simulator - Boarding System
 * Manages the passenger boarding process:
 * - Gradual boarding with timing
 * - Capacity enforcement
 * - Ticket generation via TicketSystem
 * - Passenger tracking on the bus
 * - Passenger feedback events
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const GameConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig) ||
    (typeof require !== 'undefined' ? require('../config/GameConfig') : null);
  const PassengerConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.PassengerConfig) ||
    (typeof require !== 'undefined' ? require('../config/PassengerConfig') : null);

  const BoardingSystem = {
    _boarding: false,
    _boardingPassengers: [],
    _boardingProgress: 0,
    _boardingTimer: 0,
    _boardingCount: 0,
    _currentStop: null,
    _totalBoardedThisStop: 0,

    init(modules) {
      this.modules = modules;
      this._boarding = false;
      this._boardingPassengers = [];
      this._boardingProgress = 0;
      this._boardingTimer = 0;
      this._totalBoardedThisStop = 0;

      if (EventManager) {
        EventManager.on('arrivedAtStop', (data) => {
          this.startBoarding(data.stop, data.bus);
        });
      }
    },

    startBoarding(stop, bus) {
      if (!bus || !stop) return;

      this._boarding = true;
      this._currentStop = stop;
      this._boardingProgress = 0;
      this._boardingTimer = 0;
      this._totalBoardedThisStop = 0;

      const pcfg = PassengerConfig || {};
      const boardingCfg = pcfg.boarding || {};
      // Phase 7: service-specific boarding time takes priority over config default
      const timePerPassenger = (bus && bus.boardingTimePerPassenger)
        ? bus.boardingTimePerPassenger
        : (boardingCfg.timePerPassenger || 2.5);

      // Get available capacity
      const availableSpace = bus.getAvailableCapacity ? bus.getAvailableCapacity() :
        (bus.passengerCapacity - bus.passengersOnBoard);

      // Get waiting passengers eligible to board
      const waiting = stop.passengers ? stop.passengers.filter(p => p.state === 'waiting') : [];
      const boardingCount = Math.min(availableSpace, waiting.length);

      // Select passengers to board
      this._boardingPassengers = [];
      for (let i = 0; i < boardingCount; i++) {
        if (waiting[i]) {
          waiting[i].state = 'boarding';
          waiting[i].boardingProgress = 0;
          this._boardingPassengers.push(waiting[i]);
        }
      }

      this._boardingCount = boardingCount;

      if (boardingCount > 0) {
        EventManager.emit('boardingStarted', {
          stop: stop,
          count: boardingCount,
          capacity: bus.passengerCapacity,
          current: bus.passengersOnBoard,
          boardingTime: timePerPassenger
        });

        this._emitFeedback('boarding', 'Boarding ' + boardingCount + ' passengers...');
      } else if (availableSpace === 0) {
        this._emitFeedback('warning', 'Bus is full!');
        EventManager.emit('busFull', { stop: stop, capacity: bus.passengerCapacity });
      } else if (waiting.length === 0) {
        this._emitFeedback('info', 'No passengers waiting.');
      }
    },

    update(dt) {
      if (!this._boarding || !this._currentStop || this._boardingPassengers.length === 0) {
        if (this._boarding && this._boardingPassengers.length === 0) {
          this.completeBoarding();
        }
        return;
      }

      const bus = this.modules.GameInitSystem ? this.modules.GameInitSystem.getActiveBus() : null;
      if (!bus) {
        this._boarding = false;
        return;
      }

      const pcfg = PassengerConfig || {};
      const boardingCfg = pcfg.boarding || {};
      const timePerPassenger = boardingCfg.timePerPassenger || 2.5;

      this._boardingTimer += dt;

      // Board one passenger per timePerPassenger interval
      if (this._boardingTimer >= timePerPassenger) {
        this._boardingTimer -= timePerPassenger;

        const passenger = this._boardingPassengers.shift();
        if (passenger) {
          // Assign ticket if ticket system is available
          const ticketSystem = this.modules.TicketSystem;
          if (ticketSystem && typeof ticketSystem.generateTicket === 'function') {
            ticketSystem.generateTicket(
              passenger,
              this._currentStop,
              null, // destination stop will be resolved later
              this._calculateDistance(passenger, bus),
              bus
            );
          }

          // Mark as riding
          passenger.state = 'riding';

          // Add to bus's passenger list
          if (typeof bus.embarkPassenger === 'function') {
            bus.embarkPassenger(passenger);
          } else {
            bus.passengersOnBoard++;
          }

          // Remove from stop queue
          if (this._currentStop.passengers) {
            const idx = this._currentStop.passengers.indexOf(passenger);
            if (idx >= 0) this._currentStop.passengers.splice(idx, 1);
          }

          this._totalBoardedThisStop++;

          // Track stats
          const passengerSystem = this.modules.PassengerSystem;
          if (passengerSystem) passengerSystem.recordBoarded(1);

          EventManager.emit('passengerBoarded', {
            passenger: passenger,
            onBoard: bus.passengersOnBoard,
            capacity: bus.passengerCapacity,
            waitingNow: this._currentStop.passengers ? this._currentStop.passengers.length : 0
          });
        }
      }
    },

    _calculateDistance(passenger, bus) {
      // Calculate distance from origin stop to destination stop
      const allStops = this.modules.Map ? (this.modules.Map.allBusStops || []) : [];
      const origin = allStops.find(s => s.id === passenger.originStopId);
      const dest = allStops.find(s => s.id === passenger.destinationStopId);
      if (origin && dest) {
        return Math.sqrt(Math.pow(dest.x - origin.x, 2) + Math.pow(dest.y - origin.y, 2));
      }
      if (origin && bus) {
        return Math.sqrt(Math.pow(bus.x - origin.x, 2) + Math.pow(bus.y - origin.y, 2));
      }
      return 100;
    },

    completeBoarding() {
      this._boarding = false;
      this._boardingPassengers = [];
      this._boardingProgress = 0;
      this._boardingTimer = 0;

      const bus = this.modules.GameInitSystem ? this.modules.GameInitSystem.getActiveBus() : null;
      const onBoard = bus ? bus.passengersOnBoard : 0;

      EventManager.emit('boardingCompleted', {
        onBoard: onBoard,
        capacity: bus ? bus.passengerCapacity : 0,
        boardedThisStop: this._totalBoardedThisStop
      });
    },

    isBoarding() {
      return this._boarding;
    },

    getBoardingProgress() {
      if (!this._boarding || this._boardingPassengers.length === 0) return 1;
      const pcfg = PassengerConfig || {};
      const timePerPassenger = (pcfg.boarding && pcfg.boarding.timePerPassenger) || 2.5;
      return this._boardingTimer / timePerPassenger;
    },

    getBoardingCount() {
      return this._boardingCount;
    },

    getBoardedThisStop() {
      return this._totalBoardedThisStop;
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
        boarding: this._boarding,
        remaining: this._boardingPassengers.length,
        boardedThisStop: this._totalBoardedThisStop
      };
    },

    deserialize(data) {
      this._boarding = data.boarding || false;
    },

    destroy() {
      this._boarding = false;
      this._boardingPassengers = [];
      this._currentStop = null;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.BoardingSystem = BoardingSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = BoardingSystem;
  }
})();
