/**
 * Bus Simulator - Transmission System (Phase 10B Task 8)
 *
 * ONE authoritative owner for transmission/gearbox behavior.
 *
 * Responsibilities:
 *   - currentGear, gearMode (neutral/reverse/drive), engineRPM
 *   - gearRatios, finalDriveRatio, shiftUpRPM, shiftDownRPM, maxRPM
 *   - automatic upshift/downshift based on RPM
 *   - manual gear selection
 *   - invalid gear / impossible RPM protection
 *   - dt-based deterministic behavior
 *
 * Does NOT duplicate acceleration, braking, steering, resistance, or fuel
 * consumption. MovementSystem remains responsible for vehicle movement.
 * The transmission only gates available drive torque based on gear/RPM.
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);

  // Centralized, configurable default gearbox for buses.
  const DEFAULT_GEARBOX = {
    gearMode: 'drive',          // 'neutral' | 'reverse' | 'drive'
    currentGear: 1,
    forwardGears: 5,
    gearRatios: [4.5, 3.2, 2.1, 1.4, 1.0],
    finalDriveRatio: 3.7,
    shiftUpRPM: 3200,
    shiftDownRPM: 1400,
    maxRPM: 5000,
    idleRPM: 800
  };

  const GEAR_MODES = { NEUTRAL: 'neutral', REVERSE: 'reverse', DRIVE: 'drive' };

  function TransmissionSystem() {
    this._vehicles = new Map();
    this._modules = null;
    this._active = true;
  }

  TransmissionSystem.prototype.init = function (modules) {
    this._modules = modules;
    this._vehicles = new Map();
    this._active = true;
  };

TransmissionSystem.prototype.update = function (dt) {
    if (!this._active) return;
    for (const [id, state] of this._vehicles) {
      this._updateTransmission(state, dt);
    }
  };

  // Update a specific vehicle's transmission state and keep the vehicle's
  // _transmission reference in sync. Called by MovementSystem before the
  // physics step so gear/RPM are current for the drive-torque gate.
  TransmissionSystem.prototype.updateVehicle = function (vehicle, dt) {
    if (!vehicle) return;
    const state = this.ensureTransmission(vehicle);
    if (!state) return;
    state.speed = typeof vehicle.speed === 'number' ? vehicle.speed : 0;
    this._updateTransmission(state, dt);
  };

  TransmissionSystem.prototype._updateTransmission = function (state, dt) {
    if (!state) return;

    // Compute engine RPM from vehicle speed and current gear.
    // RPM = speed * gearRatio * finalDriveRatio * (1000 / 60) scaled factor
    const speedKmh = Math.abs(state.speed || 0);
    const gearRatio = this._currentGearRatio(state);
    const effectiveRatio = gearRatio * state.finalDriveRatio;
    // Approximate: 1 km/h ~= 10 RPM at 1:1 final drive for a bus-scale model
    state.engineRPM = Math.round(speedKmh * effectiveRatio * 10);

    // Clamp RPM
    state.engineRPM = Math.max(0, Math.min(state.maxRPM, state.engineRPM));

    // Automatic shifting only in drive mode
    if (state.gearMode === GEAR_MODES.DRIVE) {
      this._autoShift(state);
    }

    // Prevent invalid gear values
    this._validateGear(state);
  };

  TransmissionSystem.prototype._currentGearRatio = function (state) {
    if (!state) return 0;
    if (state.gearMode === GEAR_MODES.NEUTRAL) return 0;
    if (state.gearMode === GEAR_MODES.REVERSE) {
      return state.reverseGearRatio || -2.5;
    }
    // Drive
    const idx = Math.max(0, Math.min(state.gearRatios.length - 1, state.currentGear - 1));
    return state.gearRatios[idx] || 1.0;
  };

  TransmissionSystem.prototype._autoShift = function (state) {
    if (!state) return;
    const speed = state.speed || 0;
    if (speed <= 0) {
      // Stopped: ensure a valid forward gear
      if (state.currentGear < 1) state.currentGear = 1;
      return;
    }

    if (state.engineRPM >= state.shiftUpRPM && state.currentGear < state.gearRatios.length) {
      state.currentGear += 1;
    } else if (state.engineRPM <= state.shiftDownRPM && state.currentGear > 1) {
      state.currentGear -= 1;
    }
  };

  TransmissionSystem.prototype._validateGear = function (state) {
    if (!state) return;
    if (state.gearMode === GEAR_MODES.NEUTRAL) {
      state.currentGear = 0;
      return;
    }
    if (state.gearMode === GEAR_MODES.REVERSE) {
      state.currentGear = -1;
      return;
    }
    // Drive
    const maxGear = Math.max(1, state.gearRatios.length);
    if (state.currentGear < 1) state.currentGear = 1;
    if (state.currentGear > maxGear) state.currentGear = maxGear;
  };

  // ---- Vehicle integration helpers ----

  TransmissionSystem.prototype.ensureTransmission = function (vehicle) {
    if (!vehicle) return null;
    if (vehicle._transmission && vehicle._transmission.__owner === this) {
      return vehicle._transmission;
    }
    const state = this._createTransmission(vehicle);
    vehicle._transmission = state;
    return state;
  };

  TransmissionSystem.prototype._createTransmission = function (vehicle) {
    const defaults = vehicle && vehicle.gearboxConfig
      ? vehicle.gearboxConfig
      : DEFAULT_GEARBOX;
    const state = {
      __owner: this,
      gearMode: defaults.gearMode || GEAR_MODES.DRIVE,
      currentGear: defaults.currentGear || 1,
      forwardGears: defaults.forwardGears || 5,
      gearRatios: (defaults.gearRatios && defaults.gearRatios.slice()) || [4.5, 3.2, 2.1, 1.4, 1.0],
      finalDriveRatio: defaults.finalDriveRatio || 3.7,
      shiftUpRPM: defaults.shiftUpRPM || 3200,
      shiftDownRPM: defaults.shiftDownRPM || 1400,
      maxRPM: defaults.maxRPM || 5000,
      idleRPM: defaults.idleRPM || 800,
      reverseGearRatio: defaults.reverseGearRatio || -2.5,
      engineRPM: 0,
      speed: (vehicle && typeof vehicle.speed === 'number') ? vehicle.speed : 0
    };
    this._vehicles.set(vehicle.id || ('v_' + Math.random().toString(36).slice(2)), state);
    return state;
  };

  TransmissionSystem.prototype.getTransmission = function (vehicle) {
    if (!vehicle) return null;
    return vehicle._transmission || null;
  };

  TransmissionSystem.prototype.getDriveTorqueMultiplier = function (vehicle) {
    const state = this.getTransmission(vehicle);
    if (!state) return 0;
    if (state.gearMode === GEAR_MODES.NEUTRAL) return 0;
    if (state.gearMode === GEAR_MODES.REVERSE) {
      // Reverse only produces drive when moving backward
      return (vehicle.speed || 0) < 0 ? 1 : 0;
    }
    // Drive: scale by gear ratio (lower gear = more torque, higher gear = less)
    const ratio = this._currentGearRatio(state) || 1;
    return Math.max(0.1, Math.min(1, 1 / ratio));
  };

  TransmissionSystem.prototype.isMovingForward = function (vehicle) {
    const state = this.getTransmission(vehicle);
    if (!state) return false;
    if (state.gearMode === GEAR_MODES.NEUTRAL) return false;
    if (state.gearMode === GEAR_MODES.REVERSE) return (vehicle.speed || 0) < 0;
    return (vehicle.speed || 0) >= 0;
  };

  TransmissionSystem.prototype.setGearMode = function (vehicle, mode) {
    const state = this.ensureTransmission(vehicle);
    if (!state) return false;
    if (mode !== GEAR_MODES.NEUTRAL && mode !== GEAR_MODES.REVERSE && mode !== GEAR_MODES.DRIVE) {
      return false;
    }
    state.gearMode = mode;
    this._validateGear(state);
    return true;
  };

  TransmissionSystem.prototype.setGear = function (vehicle, gear) {
    const state = this.ensureTransmission(vehicle);
    if (!state) return false;
    if (state.gearMode === GEAR_MODES.NEUTRAL) return false;
    if (state.gearMode === GEAR_MODES.REVERSE) {
      state.currentGear = -1;
      return true;
    }
    const maxGear = Math.max(1, state.gearRatios.length);
    if (gear < 1 || gear > maxGear) return false;
    state.currentGear = gear;
    return true;
  };

  TransmissionSystem.prototype.shiftNeutral = function (vehicle) {
    return this.setGearMode(vehicle, GEAR_MODES.NEUTRAL);
  };

  TransmissionSystem.prototype.shiftReverse = function (vehicle) {
    return this.setGearMode(vehicle, GEAR_MODES.REVERSE);
  };

  TransmissionSystem.prototype.shiftDrive = function (vehicle) {
    const ok = this.setGearMode(vehicle, GEAR_MODES.DRIVE);
    if (ok) {
      const state = this.getTransmission(vehicle);
      if (state && state.currentGear < 1) state.currentGear = 1;
    }
    return ok;
  };

  TransmissionSystem.prototype.resetTransmission = function (vehicle) {
    const state = this.ensureTransmission(vehicle);
    if (!state) return;
    state.gearMode = DEFAULT_GEARBOX.gearMode;
    state.currentGear = DEFAULT_GEARBOX.currentGear;
    state.engineRPM = 0;
    state.speed = 0;
    this._validateGear(state);
  };

  TransmissionSystem.prototype.serializeTransmission = function (vehicle) {
    const state = this.getTransmission(vehicle);
    if (!state) return null;
    return {
      gearMode: state.gearMode,
      currentGear: state.currentGear,
      engineRPM: state.engineRPM,
      gearRatios: state.gearRatios.slice(),
      finalDriveRatio: state.finalDriveRatio,
      shiftUpRPM: state.shiftUpRPM,
      shiftDownRPM: state.shiftDownRPM,
      maxRPM: state.maxRPM
    };
  };

  TransmissionSystem.prototype.deserializeTransmission = function (vehicle, data) {
    const state = this.ensureTransmission(vehicle);
    if (!state || !data) return;
    if (data.gearMode) state.gearMode = data.gearMode;
    if (typeof data.currentGear === 'number') state.currentGear = data.currentGear;
    if (typeof data.engineRPM === 'number') state.engineRPM = data.engineRPM;
    if (Array.isArray(data.gearRatios)) state.gearRatios = data.gearRatios.slice();
    if (typeof data.finalDriveRatio === 'number') state.finalDriveRatio = data.finalDriveRatio;
    if (typeof data.shiftUpRPM === 'number') state.shiftUpRPM = data.shiftUpRPM;
    if (typeof data.shiftDownRPM === 'number') state.shiftDownRPM = data.shiftDownRPM;
    if (typeof data.maxRPM === 'number') state.maxRPM = data.maxRPM;
    this._validateGear(state);
  };

TransmissionSystem.prototype.destroy = function () {
    this._vehicles.clear();
    this._active = false;
  };

  // ---- Save/load integration ----
  // SaveLoadSystem calls these on the system instance directly. The system
  // stores its per-vehicle transmission state in an internal map keyed by
  // vehicle id. On deserialize it re-attaches state to restored Bus
  // instances using the same id.
  TransmissionSystem.prototype.serialize = function () {
    const data = {};
    for (const [id, state] of this._vehicles) {
      data[id] = {
        gearMode: state.gearMode,
        currentGear: state.currentGear,
        engineRPM: state.engineRPM,
        gearRatios: state.gearRatios.slice(),
        finalDriveRatio: state.finalDriveRatio,
        shiftUpRPM: state.shiftUpRPM,
        shiftDownRPM: state.shiftDownRPM,
        maxRPM: state.maxRPM,
        reverseGearRatio: state.reverseGearRatio
      };
    }
    return data;
  };

  TransmissionSystem.prototype.deserialize = function (data) {
    if (!data || typeof data !== 'object') return;
    for (const [id, stateData] of Object.entries(data)) {
      const existing = this._vehicles.get(id);
      if (existing) {
        if (stateData.gearMode) existing.gearMode = stateData.gearMode;
        if (typeof stateData.currentGear === 'number') existing.currentGear = stateData.currentGear;
        if (typeof stateData.engineRPM === 'number') existing.engineRPM = stateData.engineRPM;
        if (Array.isArray(stateData.gearRatios)) existing.gearRatios = stateData.gearRatios.slice();
        if (typeof stateData.finalDriveRatio === 'number') existing.finalDriveRatio = stateData.finalDriveRatio;
        if (typeof stateData.shiftUpRPM === 'number') existing.shiftUpRPM = stateData.shiftUpRPM;
        if (typeof stateData.shiftDownRPM === 'number') existing.shiftDownRPM = stateData.shiftDownRPM;
        if (typeof stateData.maxRPM === 'number') existing.maxRPM = stateData.maxRPM;
        if (typeof stateData.reverseGearRatio === 'number') existing.reverseGearRatio = stateData.reverseGearRatio;
        this._validateGear(existing);
      }
    }
  };

  // Re-attach transmission state to a restored Bus instance by id.
  TransmissionSystem.prototype.attachTransmission = function (vehicle) {
    if (!vehicle) return null;
    const state = this._vehicles.get(vehicle.id);
    if (state) {
      vehicle._transmission = state;
      return state;
    }
    return this.ensureTransmission(vehicle);
  };

  // Expose
  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.TransmissionSystem = TransmissionSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = TransmissionSystem;
  }
})();
