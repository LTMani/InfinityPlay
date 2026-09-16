/**
 * Bus Simulator - Air Brake System (Phase 10B Task 13)
 *
 * ONE authoritative owner of air-brake pressure state.
 *
 * Responsibilities:
 *   - reservoir pressure (bar)
 *   - compressor fill / cut-out behavior
 *   - brake pressure consumption
 *   - air leak
 *   - low-pressure warning
 *   - pressure ratio (0..1) representing available braking pressure
 *
 * Does NOT duplicate brake-force, deceleration, ABS, tire grip, suspension
 * load, road friction, temperature/fade, acceleration, steering, or fuel.
 * BrakeSystem remains the ONLY owner of brake-force calculation.
 * AirBrakeSystem only exposes a pressure ratio that BrakeSystem multiplies
 * into its existing force calculation.
 */
(function () {
  'use strict';

  const DEFAULT_AIR = {
    reservoirPressure: 8.0,   // bar (typical bus air reservoir)
    minOperatingPressure: 4.0, // bar below which warning triggers
    maxPressure: 10.0,         // bar compressor cut-out
    compressorRate: 0.8,       // bar/sec when filling
    brakeConsumptionRate: 0.35, // bar/sec at full brake input
    leakRate: 0.01,            // bar/sec
    compressorEnabled: true,
    lowPressureWarning: false
  };

  function AirBrakeSystem() {
    this._modules = null;
    this._active = true;
    this._vehicles = new Map();
  }

  AirBrakeSystem.prototype.init = function (modules) {
    this._modules = modules;
    this._active = true;
    this._vehicles = new Map();
  };

  AirBrakeSystem.prototype.update = function (dt) {
    if (!this._active) return;
    for (const [, state] of this._vehicles) {
      this._updateAir(state, dt);
    }
  };

  // MovementSystem calls this before the physics step so air pressure is
  // current for the BrakeSystem pressure-ratio gate. AirBrakeSystem never
  // writes brake force or deceleration.
  AirBrakeSystem.prototype.updateVehicle = function (vehicle, dt) {
    if (!vehicle) return;
    const state = this.ensureAir(vehicle);
    if (!state) return;
    // Snapshot inputs the air model consumes
    state.brakeInput = typeof vehicle._brakeInput === 'number' ? vehicle._brakeInput : 0;
    state.handbrake = !!vehicle._handbrake;
    this._updateAir(state, dt);
  };

  AirBrakeSystem.prototype._updateAir = function (state, dt) {
    if (!state) return;
    const dtSafe = dt > 0 ? dt : 0.016;

    // ---- Air leak (always present) ----
    state.reservoirPressure = Math.max(0,
      state.reservoirPressure - state.leakRate * dtSafe);

    // ---- Compressor fill ----
    // Compressor only runs when enabled and pressure is below cut-out.
    if (state.compressorEnabled && state.reservoirPressure < state.maxPressure) {
      state.reservoirPressure = Math.min(state.maxPressure,
        state.reservoirPressure + state.compressorRate * dtSafe);
    }

    // ---- Brake pressure consumption ----
    // Service braking consumes pressure proportional to brake input.
    // Handbrake is mechanical and does NOT consume air pressure.
    const brakeInput = Math.max(0, Math.min(1, state.brakeInput || 0));
    if (brakeInput > 0) {
      state.reservoirPressure = Math.max(0,
        state.reservoirPressure - state.brakeConsumptionRate * brakeInput * dtSafe);
    }

    // ---- Low-pressure warning ----
    state.lowPressureWarning = state.reservoirPressure < state.minOperatingPressure;

    // ---- Pressure ratio (0..1) ----
    // Ratio of current pressure to the nominal operating pressure.
    // At or above minOperatingPressure the ratio is 1.0; below it falls
    // linearly to 0 at zero pressure. This is the single value BrakeSystem
    // multiplies into its existing force calculation.
    const ratio = state.reservoirPressure / Math.max(0.0001, state.minOperatingPressure);
    state.pressureRatio = Math.max(0, Math.min(1, ratio));
  };

  // ---- Query methods ----

  AirBrakeSystem.prototype.getPressure = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    return state ? state.reservoirPressure : DEFAULT_AIR.reservoirPressure;
  };

  AirBrakeSystem.prototype.getPressureRatio = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    return state ? state.pressureRatio : 1.0;
  };

  AirBrakeSystem.prototype.isLowPressure = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    return state ? state.lowPressureWarning : false;
  };

  AirBrakeSystem.prototype.getState = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    if (!state) return null;
    return {
      reservoirPressure: state.reservoirPressure,
      minOperatingPressure: state.minOperatingPressure,
      maxPressure: state.maxPressure,
      compressorEnabled: state.compressorEnabled,
      lowPressureWarning: state.lowPressureWarning,
      pressureRatio: state.pressureRatio
    };
  };

  AirBrakeSystem.prototype.setState = function (vehicle, stateData) {
    const state = this.ensureAir(vehicle);
    if (!state || !stateData) return;
    if (typeof stateData.reservoirPressure === 'number') {
      state.reservoirPressure = Math.max(0, Math.min(state.maxPressure, stateData.reservoirPressure));
    }
    if (typeof stateData.compressorEnabled === 'boolean') {
      state.compressorEnabled = stateData.compressorEnabled;
    }
    if (typeof stateData.lowPressureWarning === 'boolean') {
      state.lowPressureWarning = stateData.lowPressureWarning;
    }
    const ratio = state.reservoirPressure / Math.max(0.0001, state.minOperatingPressure);
    state.pressureRatio = Math.max(0, Math.min(1, ratio));
  };

  AirBrakeSystem.prototype.reset = function (vehicle) {
    const state = this.ensureAir(vehicle);
    if (!state) return;
    state.reservoirPressure = DEFAULT_AIR.reservoirPressure;
    state.compressorEnabled = DEFAULT_AIR.compressorEnabled;
    state.lowPressureWarning = false;
    state.pressureRatio = 1.0;
    state.brakeInput = 0;
    state.handbrake = false;
  };

  AirBrakeSystem.prototype._getVehicleState = function (vehicle) {
    if (!vehicle) return null;
    return vehicle._airBrake && vehicle._airBrake.__owner === this
      ? vehicle._airBrake : null;
  };

  // ---- Vehicle integration helpers ----
  AirBrakeSystem.prototype.ensureAir = function (vehicle) {
    if (!vehicle) return null;
    if (vehicle._airBrake && vehicle._airBrake.__owner === this) {
      return vehicle._airBrake;
    }
    const state = this._createAir(vehicle);
    vehicle._airBrake = state;
    return state;
  };

  AirBrakeSystem.prototype._createAir = function (vehicle) {
    const defaults = vehicle && vehicle.airBrakeConfig ? vehicle.airBrakeConfig : DEFAULT_AIR;
    const state = {
      __owner: this,
      reservoirPressure: defaults.reservoirPressure || DEFAULT_AIR.reservoirPressure,
      minOperatingPressure: defaults.minOperatingPressure || DEFAULT_AIR.minOperatingPressure,
      maxPressure: defaults.maxPressure || DEFAULT_AIR.maxPressure,
      compressorRate: defaults.compressorRate || DEFAULT_AIR.compressorRate,
      brakeConsumptionRate: defaults.brakeConsumptionRate || DEFAULT_AIR.brakeConsumptionRate,
      leakRate: defaults.leakRate || DEFAULT_AIR.leakRate,
      compressorEnabled: defaults.compressorEnabled !== undefined ? defaults.compressorEnabled : DEFAULT_AIR.compressorEnabled,
      lowPressureWarning: false,
      pressureRatio: 1.0,
      brakeInput: 0,
      handbrake: false
    };
    this._vehicles.set(vehicle.id || ('v_' + Math.random().toString(36).slice(2)), state);
    return state;
  };

  AirBrakeSystem.prototype.attachAir = function (vehicle) {
    if (!vehicle) return null;
    const state = this._vehicles.get(vehicle.id);
    if (state) {
      vehicle._airBrake = state;
      return state;
    }
    return this.ensureAir(vehicle);
  };

  // ---- Save/load ----
  // Persist only the transient air-brake state. Static configuration
  // (pressure limits, rates) is owned by DEFAULT_AIR and never saved.
  AirBrakeSystem.prototype.serializeAir = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    if (!state) return null;
    return {
      reservoirPressure: state.reservoirPressure,
      compressorEnabled: state.compressorEnabled,
      lowPressureWarning: state.lowPressureWarning
    };
  };

  AirBrakeSystem.prototype.deserializeAir = function (vehicle, data) {
    const state = this.ensureAir(vehicle);
    if (!state || !data) return;
    if (typeof data.reservoirPressure === 'number') {
      state.reservoirPressure = Math.max(0, Math.min(state.maxPressure, data.reservoirPressure));
    }
    if (typeof data.compressorEnabled === 'boolean') {
      state.compressorEnabled = data.compressorEnabled;
    }
    if (typeof data.lowPressureWarning === 'boolean') {
      state.lowPressureWarning = data.lowPressureWarning;
    }
    const ratio = state.reservoirPressure / Math.max(0.0001, state.minOperatingPressure);
    state.pressureRatio = Math.max(0, Math.min(1, ratio));
  };

  AirBrakeSystem.prototype.serialize = function () {
    const data = {};
    for (const [id, state] of this._vehicles) {
      data[id] = {
        reservoirPressure: state.reservoirPressure,
        compressorEnabled: state.compressorEnabled,
        lowPressureWarning: state.lowPressureWarning
      };
    }
    return data;
  };

  AirBrakeSystem.prototype.deserialize = function (data) {
    if (!data || typeof data !== 'object') return;
    for (const [id, stateData] of Object.entries(data)) {
      let existing = this._vehicles.get(id);
      if (!existing) {
        existing = {
          __owner: this,
          reservoirPressure: DEFAULT_AIR.reservoirPressure,
          minOperatingPressure: DEFAULT_AIR.minOperatingPressure,
          maxPressure: DEFAULT_AIR.maxPressure,
          compressorRate: DEFAULT_AIR.compressorRate,
          brakeConsumptionRate: DEFAULT_AIR.brakeConsumptionRate,
          leakRate: DEFAULT_AIR.leakRate,
          compressorEnabled: DEFAULT_AIR.compressorEnabled,
          lowPressureWarning: false,
          pressureRatio: 1.0,
          brakeInput: 0,
          handbrake: false
        };
        this._vehicles.set(id, existing);
      }
      if (typeof stateData.reservoirPressure === 'number') {
        existing.reservoirPressure = Math.max(0, Math.min(existing.maxPressure, stateData.reservoirPressure));
      }
      if (typeof stateData.compressorEnabled === 'boolean') {
        existing.compressorEnabled = stateData.compressorEnabled;
      }
      if (typeof stateData.lowPressureWarning === 'boolean') {
        existing.lowPressureWarning = stateData.lowPressureWarning;
      }
      const ratio = existing.reservoirPressure / Math.max(0.0001, existing.minOperatingPressure);
      existing.pressureRatio = Math.max(0, Math.min(1, ratio));
    }
  };

  AirBrakeSystem.prototype.destroy = function () {
    this._active = false;
    this._vehicles.clear();
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.AirBrakeSystem = AirBrakeSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = AirBrakeSystem;
  }
})();
