/**
 * Bus Simulator - Passenger System
 * Manages passenger generation at bus stops, lifecycle tracking,
 * destination assignment, and passenger pool management.
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const Passenger = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Passenger) ||
    (typeof require !== 'undefined' ? require('../entities/Passenger') : null);
  const PassengerConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.PassengerConfig) ||
    (typeof require !== 'undefined' ? require('../config/PassengerConfig') : null);

  const PassengerSystem = {
    totalSpawned: 0,
    totalBoarded: 0,
    totalAlighted: 0,
    totalLost: 0,
    _activePassengers: [],
    _waitingQueue: [],
    _spawnTimer: 0,
    _active: true,

    init(modules) {
      this.modules = modules;
      this.totalSpawned = 0;
      this.totalBoarded = 0;
      this.totalAlighted = 0;
      this.totalLost = 0;
      this._activePassengers = [];
      this._waitingQueue = [];
      this._spawnTimer = 0;
      this._active = (PassengerConfig ? PassengerConfig.active : true);
    },

    update(dt) {
      if (!this._active || !this.modules.Map) return;

      const pcfg = PassengerConfig || {};
      const map = this.modules.Map;
      const allStops = map.allBusStops || [];
      if (allStops.length < 2) return;

      // Passenger generation timer
      this._spawnTimer += dt;

      // Spawn passengers at stops
      if (this._spawnTimer >= 0.5) {
        this._spawnTimer = 0;
        this._generatePassengersAtStops(allStops, dt);
      }

      // Update all active passengers
      for (let i = this._activePassengers.length - 1; i >= 0; i--) {
        const p = this._activePassengers[i];
        if (p && p.update) p.update(dt);

        if (p && p.state === 'waiting' && p.isBored && p.isBored()) {
          p.destroy();
          this._activePassengers.splice(i, 1);
          this.totalLost++;
        }
      }
    },

    _generatePassengersAtStops(allStops, dt) {
      const pcfg = PassengerConfig || {};
      const maxQueue = pcfg.maxQueuePerStop || 30;
      const spawnRate = pcfg.spawnRate || 1.5;
      const interval = pcfg.spawnInterval || {};

      // Get time of day multiplier
      const dayNight = this.modules.DayNightSystem;
      const timeOfDay = dayNight ? dayNight.getTimeOfDay() : 'day';
      const timeMult = (pcfg.timeOfDayMultipliers && pcfg.timeOfDayMultipliers[timeOfDay]) || 1.0;

      // Determine road type for the first stop (or use 'local_road' as default)
      const roadType = 'local_road';
      const baseInterval = interval[roadType] || 10;

      for (let i = 0; i < allStops.length; i++) {
        const stop = allStops[i];
        if (!stop.isActive || !stop.passengers) continue;

        // Skip if queue is full
        if (stop.passengers.length >= maxQueue) continue;

        // Chance to spawn based on interval
        const spawnChance = (spawnRate * dt) / baseInterval * timeMult;
        if (Math.random() < spawnChance) {
          this._spawnPassengerAtStop(stop, allStops);
        }
      }
    },

    _spawnPassengerAtStop(stop, allStops) {
      if (!Passenger) return null;

      // Find a destination stop (avoid same stop)
      const candidateStops = allStops.filter(s => s.id !== stop.id && s.isActive);
      if (candidateStops.length === 0) return null;

      // Try to use stop-specific destination distribution
      let destStopId = null;
      if (stop.getRandomDestination) {
        destStopId = stop.getRandomDestination(candidateStops, true);
      }
      if (!destStopId) {
        const randomStop = candidateStops[Math.floor(Math.random() * candidateStops.length)];
        destStopId = randomStop.id;
      }

      // Calculate distance for fare
      const destStop = allStops.find(s => s.id === destStopId);
      let distance = 100;
      if (destStop) {
        distance = Math.sqrt(Math.pow(destStop.x - stop.x, 2) + Math.pow(destStop.y - stop.y, 2));
      }

      const p = new Passenger(
        stop.x + (Math.random() - 0.5) * 4,
        stop.y + (Math.random() - 0.5) * 4,
        destStopId,
        stop.id
      );

      p.setDestination(destStopId, distance);

      stop.passengers.push(p);
      this._activePassengers.push(p);
      this.totalSpawned++;

      EventManager.emit('passengerSpawned', {
        passenger: p,
        stop: stop
      });

      return p;
    },

    generatePassengersAtStop(stop, count) {
      const passengers = [];
      const pcfg = PassengerConfig || {};
      const maxQueue = pcfg.maxQueuePerStop || 30;
      const spawnCount = Math.min(count || 1, maxQueue - (stop.passengers ? stop.passengers.length : 0));

      const allStops = this.modules.Map ? (this.modules.Map.allBusStops || []) : [];
      const candidateStops = allStops.filter(s => s.id !== stop.id && s.isActive);
      if (candidateStops.length === 0) {
        // Fallback: spawn passengers with random destinations
        for (let i = 0; i < spawnCount; i++) {
          if (Passenger) {
            const p = new Passenger(
              stop.x + (Math.random() - 0.5) * 3,
              stop.y + (Math.random() - 0.5) * 3
            );
            p.state = 'waiting';
            stop.passengers.push(p);
            this._activePassengers.push(p);
            this.totalSpawned++;
            passengers.push(p);
          }
        }
        return passengers;
      }

      for (let i = 0; i < spawnCount; i++) {
        if (Passenger) {
          const destStop = candidateStops[Math.floor(Math.random() * candidateStops.length)];
          const distance = Math.sqrt(Math.pow(destStop.x - stop.x, 2) + Math.pow(destStop.y - stop.y, 2));
          const p = new Passenger(
            stop.x + (Math.random() - 0.5) * 3,
            stop.y + (Math.random() - 0.5) * 3,
            destStop.id,
            stop.id
          );
          p.setDestination(destStop.id, distance);
          p.state = 'waiting';
          stop.passengers.push(p);
          this._activePassengers.push(p);
          this.totalSpawned++;
          passengers.push(p);
        }
      }

      EventManager.emit('passengersGenerated', {
        stop: stop,
        count: passengers.length
      });

      return passengers;
    },

    getActiveCount() {
      return this._activePassengers.length;
    },

    getTotalSpawned() {
      return this.totalSpawned;
    },

    getTotalBoarded() {
      return this.totalBoarded;
    },

    getTotalAlighted() {
      return this.totalAlighted;
    },

    recordBoarded(count) {
      this.totalBoarded += count;
    },

    recordAlighted(count) {
      this.totalAlighted += count;
    },

    getWaitingCount(stopId) {
      if (!this.modules.Map) return 0;
      const stop = this.modules.Map.allBusStops.find(s => s.id === stopId);
      return stop ? (stop.passengers ? stop.passengers.length : 0) : 0;
    },

    serialize() {
      return {
        totalSpawned: this.totalSpawned,
        totalBoarded: this.totalBoarded,
        totalAlighted: this.totalAlighted,
        totalLost: this.totalLost,
        activeCount: this._activePassengers.length
      };
    },

    deserialize(data) {
      this.totalSpawned = data.totalSpawned || 0;
      this.totalBoarded = data.totalBoarded || 0;
      this.totalAlighted = data.totalAlighted || 0;
      this.totalLost = data.totalLost || 0;
    },

    destroy() {
      this._activePassengers = [];
      this._waitingQueue = [];
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.PassengerSystem = PassengerSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = PassengerSystem;
  }
})();
