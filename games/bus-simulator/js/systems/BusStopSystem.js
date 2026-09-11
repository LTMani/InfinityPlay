/**
 * Bus Simulator - Bus Stop System
 * Manages bus stop detection, stop validation, passenger queuing,
 * and stop interaction with proper stop duration timing.
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const PassengerConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.PassengerConfig) ||
    (typeof require !== 'undefined' ? require('../config/PassengerConfig') : null);

  const BusStopSystem = {
    nearestStop: null,
    currentStop: null,
    isAtStop: false,
    stopProximity: false,
    proximityThreshold: 60,

    _stopTimer: 0,
    _minStopDuration: 2.0,
    _isStopValid: false,

    init(modules) {
      this.modules = modules;
      this.nearestStop = null;
      this.currentStop = null;
      this.isAtStop = false;
      this.stopProximity = false;
      this._stopTimer = 0;
      this._isStopValid = false;

      const pcfg = PassengerConfig || {};
      const stopCfg = pcfg.stopDetection || {};
      this._minStopDuration = stopCfg.minStopDuration || 2.0;
      this.proximityThreshold = stopCfg.stopDistanceTolerance || 50;
    },

    update(busArg, dt) {
      // Support both (bus, dt) and (dt) call signatures
      let bus, realDt;
      if (typeof busArg === 'number') {
        realDt = busArg;
        bus = this.modules.GameInitSystem ? this.modules.GameInitSystem.getActiveBus() : null;
      } else {
        bus = busArg;
        realDt = dt;
      }

      if (!bus || !this.modules.Map) return;

      const map = this.modules.Map;
      const allStops = map.allBusStops || [];

      if (allStops.length === 0) return;

      const pcfg = PassengerConfig || {};
      const stopCfg = pcfg.stopDetection || {};
      const maxBoardingSpeed = stopCfg.maxBoardingSpeed || 5;
      const tolerance = stopCfg.stopDistanceTolerance || 50;
      const angleTol = stopCfg.angleTolerance || 0.8;

      let nearest = null;
      let minDist = Infinity;

      for (let i = 0; i < allStops.length; i++) {
        const stop = allStops[i];
        const dist = Math.sqrt(Math.pow(stop.x - bus.x, 2) + Math.pow(stop.y - bus.y, 2));
        if (dist < minDist) {
          minDist = dist;
          nearest = stop;
        }
      }

      this.nearestStop = nearest;
      this.stopProximity = nearest && minDist < this.proximityThreshold;

      // Check valid stop conditions
      const speedOk = Math.abs(bus.speed || 0) <= maxBoardingSpeed;
      const distanceOk = minDist < tolerance;
      const stopValid = speedOk && distanceOk && nearest;

      if (this.stopProximity && !this.isAtStop && speedOk && minDist < (tolerance / 1.5)) {
        this._triggerStopInteraction(bus, nearest);
        this._stopTimer = 0;
        this._isStopValid = true;
      }

      // Track stop duration
      if (this.isAtStop) {
        if (this._isStopValid) {
          this._stopTimer += dt;
        } else {
          this._stopTimer = 0;
        }

        // Re-validate stop conditions
        this._isStopValid = speedOk && distanceOk;
      }

      // Update current stop passengers
      if (this.currentStop && this.currentStop.update) {
        this.currentStop.update(dt);
      }

      // Check for invalid stop (player moved away or speed too high)
      if (this.isAtStop && !stopValid && this._stopTimer < this._minStopDuration * 0.5) {
        this.completeStop();
      }
    },

    _triggerStopInteraction(bus, stop) {
      this.currentStop = stop;
      this.isAtStop = true;
      this._stopTimer = 0;
      this._isStopValid = true;

      if (bus.targetSpeed !== undefined) {
        bus.targetSpeed = 0;
      }

      EventManager.emit('arrivedAtStop', {
        stop: stop,
        bus: bus,
        waiting: stop.passengers ? stop.passengers.length : 0
      });

      EventManager.emit('requestPassengerBoarding', {
        stop: stop,
        bus: bus
      });

      this.emitFeedback('stop', 'Arrived at ' + (stop.name || 'Bus Stop'));
    },

    isStopValid() {
      return this._isStopValid;
    },

    getStopDuration() {
      return this._stopTimer;
    },

    isStopDurationComplete() {
      return this._stopTimer >= this._minStopDuration;
    },

    completeStop() {
      this.isAtStop = false;
      this.currentStop = null;
      this._stopTimer = 0;
      this._isStopValid = false;
      EventManager.emit('stopCompleted', {});
    },

    emitFeedback(type, message) {
      if (EventManager) {
        EventManager.emit('hudFeedback', { type: type, message: message, duration: 3.0 });
      }
    },

    getNearestStop() {
      return this.nearestStop;
    },

    getStopProximity() {
      const bus = this.modules.GameInitSystem ? this.modules.GameInitSystem.getActiveBus() : null;
      let dist = 0;
      if (bus && this.nearestStop) {
        dist = Math.sqrt(Math.pow(this.nearestStop.x - bus.x, 2) + Math.pow(this.nearestStop.y - bus.y, 2));
      }
      return {
        nearStop: this.stopProximity,
        isAtStop: this.isAtStop,
        distance: dist,
        stop: this.nearestStop,
        stopValid: this._isStopValid,
        stopDuration: this._stopTimer
      };
    },

    draw(renderer, camera) {
      if (this.modules.Map) {
        for (const stop of this.modules.Map.allBusStops) {
          stop.draw(renderer, camera);
        }
      }

      // Debug: show boarding zones
      const pcfg = PassengerConfig || {};
      if (pcfg.debug && pcfg.debug.enabled && pcfg.debug.showBoardingZones) {
        if (this.modules.Map && this.modules.Map.allBusStops) {
          for (const stop of this.modules.Map.allBusStops) {
            if (stop.draw) {
              renderer.context.save();
              renderer.context.setTransform(1, 0, 0, 1, 0, 0);
              const cx = (stop.x - (camera ? camera.x : 0)) * (camera ? camera.zoom : 1) + renderer.width / 2;
              const cy = (stop.y - (camera ? camera.y : 0)) * (camera ? camera.zoom : 1) + renderer.height / 2;
              const r = (stop.boardingZoneRadius || 30) * (camera ? camera.zoom : 1);
              renderer.context.strokeStyle = 'rgba(0, 255, 255, 0.5)';
              renderer.context.lineWidth = 2;
              renderer.context.beginPath();
              renderer.context.arc(cx, cy, r, 0, Math.PI * 2);
              renderer.context.stroke();
              renderer.context.restore();
            }
          }
        }
      }
    },

    serialize() {
      const map = this.modules.Map;
      if (!map) return {};

      return {
        currentStopId: this.currentStop ? this.currentStop.id : null,
        isAtStop: this.isAtStop,
        stopTimer: this._stopTimer
      };
    },

    destroy() {
      this.nearestStop = null;
      this.currentStop = null;
      this.isAtStop = false;
      this._stopTimer = 0;
      this._isStopValid = false;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.BusStopSystem = BusStopSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = BusStopSystem;
  }
})();
