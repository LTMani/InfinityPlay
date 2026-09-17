/**
 * Bus Simulator - Traffic Signal System (Phase 10B Task 17)
 *
 * ONE centralized owner of traffic-signal phase timing.
 *
 * Responsibilities:
 *   - advance red/green/yellow phase timers
 *   - expose getSignalState() / isRed() / isGreen() / isYellow()
 *   - provide a single query point for AI and player vehicles
 *
 * Does NOT duplicate:
 *   - braking logic (BrakeSystem remains authoritative)
 *   - acceleration / steering / movement physics
 *   - boarding / door logic
 *   - road-surface data
 *
 * Intersection.update() no longer advances its own signal phase;
 * TrafficSignalSystem is the ONLY system that mutates
 * intersection.signalState / intersection.signalTimer.
 */

(function () {
  'use strict';

  const VALID_STATES = ['red', 'yellow', 'green'];

  // Default phase durations (seconds). Configurable via TrafficConfig.
  const DEFAULT_PHASES = {
    greenTime: 8.0,
    yellowTime: 2.0,
    redTime: 8.0
  };

  function TrafficSignalSystem() {
    this._modules = null;
    this._active = true;
    this._intersections = []; // cached reference to map.intersections
    this._map = null;
  }

  TrafficSignalSystem.prototype.init = function (modules) {
    this._modules = modules;
    this._active = true;
    this._intersections = [];
    this._map = modules ? modules.Map : null;
    this._syncIntersections();
  };

  TrafficSignalSystem.prototype._syncIntersections = function () {
    if (this._map && this._map.intersections) {
      this._intersections = this._map.intersections;
    } else {
      this._intersections = [];
    }
  };

  TrafficSignalSystem.prototype._getPhases = function () {
    const cfg = (this._modules && this._modules.TrafficConfig)
      ? this._modules.TrafficConfig
      : (typeof TrafficConfig !== 'undefined' ? TrafficConfig : null);
    const signals = cfg && cfg.signals ? cfg.signals : {};
    return {
      greenTime: typeof signals.greenTime === 'number' ? signals.greenTime : DEFAULT_PHASES.greenTime,
      yellowTime: typeof signals.yellowTime === 'number' ? signals.yellowTime : DEFAULT_PHASES.yellowTime,
      redTime: typeof signals.redTime === 'number' ? signals.redTime : DEFAULT_PHASES.redTime
    };
  };

  TrafficSignalSystem.prototype._getIntersection = function (intersection) {
    if (!intersection) return null;
    if (intersection.id && this._intersections) {
      for (let i = 0; i < this._intersections.length; i++) {
        if (this._intersections[i].id === intersection.id) {
          return this._intersections[i];
        }
      }
    }
    return intersection;
  };

  TrafficSignalSystem.prototype.update = function (dt) {
    if (!this._active) return;
    if (!this._intersections || this._intersections.length === 0) return;

    const cfg = (this._modules && this._modules.TrafficConfig)
      ? this._modules.TrafficConfig
      : (typeof TrafficConfig !== 'undefined' ? TrafficConfig : null);
    const signals = cfg && cfg.signals ? cfg.signals : null;
    // Master toggle — when signals.enabled is false the system still
    // advances timers (so the value stays meaningful) but never mutates
    // signalState. This keeps disabled signals deterministic and
    // backward-compatible with saves that predate the toggle.
    const enabled = !(signals && signals.enabled === false);

    const phases = this._getPhases();
    const safeDt = dt > 0 ? dt : 0.016;

    for (let i = 0; i < this._intersections.length; i++) {
      const int = this._intersections[i];
      if (!int || !int.hasTrafficLights) continue;

      // Normalize any malformed state before advancing.
      if (VALID_STATES.indexOf(int.signalState) === -1) {
        int.signalState = 'red';
      }
      if (typeof int.signalTimer !== 'number' || !isFinite(int.signalTimer)) {
        int.signalTimer = 0;
      }

      int.signalTimer += safeDt;

      if (!enabled) continue;

      switch (int.signalState) {
        case 'green':
          if (int.signalTimer >= phases.greenTime) {
            int.signalState = 'yellow';
            int.signalTimer = 0;
          }
          break;
        case 'yellow':
          if (int.signalTimer >= phases.yellowTime) {
            int.signalState = 'red';
            int.signalTimer = 0;
          }
          break;
        case 'red':
          if (int.signalTimer >= phases.redTime) {
            int.signalState = 'green';
            int.signalTimer = 0;
          }
          break;
        default:
          break;
      }
    }
  };

  // ---- Query helpers ----

  TrafficSignalSystem.prototype.getSignalState = function (intersection) {
    const int = this._getIntersection(intersection);
    if (!int || !int.hasTrafficLights) return null;
    if (VALID_STATES.indexOf(int.signalState) === -1) return 'red';
    return int.signalState;
  };

  TrafficSignalSystem.prototype.isRed = function (intersection) {
    return this.getSignalState(intersection) === 'red';
  };

  TrafficSignalSystem.prototype.isYellow = function (intersection) {
    return this.getSignalState(intersection) === 'yellow';
  };

  TrafficSignalSystem.prototype.isGreen = function (intersection) {
    return this.getSignalState(intersection) === 'green';
  };

  TrafficSignalSystem.prototype.hasLights = function (intersection) {
    const int = this._getIntersection(intersection);
    return !!(int && int.hasTrafficLights);
  };

  TrafficSignalSystem.prototype.getTimer = function (intersection) {
    const int = this._getIntersection(intersection);
    if (!int || typeof int.signalTimer !== 'number') return 0;
    return int.signalTimer;
  };

  TrafficSignalSystem.prototype.getPhases = function () {
    return this._getPhases();
  };

  // ---- State mutation (used only by tests / save-load) ----

  TrafficSignalSystem.prototype.setSignalState = function (intersection, state) {
    if (VALID_STATES.indexOf(state) === -1) return false;
    const int = this._getIntersection(intersection);
    if (!int || !int.hasTrafficLights) return false;
    int.signalState = state;
    int.signalTimer = 0;
    return true;
  };

  TrafficSignalSystem.prototype.reset = function () {
    if (!this._intersections) return;
    for (let i = 0; i < this._intersections.length; i++) {
      const int = this._intersections[i];
      if (int && int.hasTrafficLights) {
        int.signalState = 'red';
        int.signalTimer = 0;
      }
    }
  };

  TrafficSignalSystem.prototype.destroy = function () {
    this._active = false;
    this._modules = null;
    this._map = null;
    this._intersections = [];
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.TrafficSignalSystem = TrafficSignalSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = TrafficSignalSystem;
  }
})();