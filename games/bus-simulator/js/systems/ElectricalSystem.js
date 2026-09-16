/**
 * Bus Simulator - Electrical System (Phase 10B Task 15)
 *
 * ONE authoritative owner of battery / electrical state.
 *
 * Responsibilities:
 *   - battery charge (0-100) and voltage
 *   - alternator charging while the engine is running
 *   - starter / cranking draw and canCrank state
 *   - electrical loads: headlights, interior lights, horn, wipers
 *   - electrical failure state
 *
 * Does NOT duplicate acceleration, fuel consumption, engine temperature,
 * braking, air-brake pressure, steering, or weather friction.
 * MovementSystem remains the movement/physics coordinator.
 * FuelSystem remains the sole owner of fuel depletion.
 * EngineTemperatureSystem remains the sole owner of temperature.
 */
(function () {
  'use strict';

  const DEFAULT_ELEC = {
    batteryCharge: 100,        // 0-100 percent
    batteryCapacity: 100,      // nominal capacity units
    batteryVoltage: 24,        // volts (24V bus system)
    alternatorOutput: 0,       // current output (units/s)
    alternatorMaxOutput: 100,  // max charge output
    starterDraw: 25,           // units/s while cranking
    // Electrical load draws (units/s)
    headlightLoad: 12,
    interiorLightLoad: 4,
    hornLoad: 8,
    wiperLoad: 3,
    // Idle drain when engine is off (units/s)
    idleDrain: 0.6,
    // Thresholds
    lowBatteryCharge: 30,      // warning threshold
    deadBatteryCharge: 5,      // cannot crank
    // Failure
    electricalFailure: false
  };

  function ElectricalSystem() {
    this._modules = null;
    this._active = true;
    this._vehicles = new Map();
  }

  ElectricalSystem.prototype.init = function (modules) {
    this._modules = modules;
    this._active = true;
    this._vehicles = new Map();
  };

  ElectricalSystem.prototype.update = function (dt) {
    if (!this._active) return;
    for (const [, state] of this._vehicles) {
      this._updateElectrical(state, dt);
    }
  };

  // MovementSystem calls this before the physics step so battery/alternator
  // state and electrical loads are current. ElectricalSystem never writes
  // acceleration, fuel, temperature, braking, or steering.
  ElectricalSystem.prototype.updateVehicle = function (vehicle, dt) {
    if (!vehicle) return;
    const state = this.ensureElectrical(vehicle);
    if (!state) return;
    // Snapshot inputs the electrical model consumes. We read only existing
    // vehicle fields; no acceleration or fuel math is duplicated here.
    state.engineRunning = this._isEngineRunning(vehicle);
    // Electrical loads from existing input actions (no input mapping dup).
    state.headlightsOn = !!vehicle._headlightsOn;
    state.interiorLightsOn = !!vehicle._interiorLightsOn;
    state.hornActive = !!vehicle._hornActive;
    state.wipersOn = !!vehicle._wipersOn;
    this._updateElectrical(state, dt);
  };

  ElectricalSystem.prototype._isEngineRunning = function (vehicle) {
    // Engine is considered running when the vehicle is active and either
    // moving or explicitly flagged as started. We do not duplicate any
    // engine-start logic; this is a coarse read of existing state.
    if (!vehicle) return false;
    if (vehicle._engineStarted === true) return true;
    if (vehicle.active && typeof vehicle.speed === 'number' && vehicle.speed > 0) return true;
    return false;
  };

  ElectricalSystem.prototype._updateElectrical = function (state, dt) {
    if (!state) return;
    const dtSafe = dt > 0 ? dt : 0.016;

    // ---- Compute active electrical load ----
    let load = 0;
    if (state.headlightsOn) load += state.headlightLoad;
    if (state.interiorLightsOn) load += state.interiorLightLoad;
    if (state.hornActive) load += state.hornLoad;
    if (state.wipersOn) load += state.wiperLoad;
    state.electricalLoad = load;

    // ---- Battery drain ----
    // When the engine is off, the battery supplies all active load plus a
    // small idle drain. When the engine is running, the alternator offsets
    // the load first and charges the remainder.
    if (state.engineRunning) {
      // Alternator output: charge first offsets load, remainder charges battery.
      const netCharge = Math.max(0, state.alternatorMaxOutput - load);
      state.alternatorOutput = state.alternatorMaxOutput;
      state.batteryCharge = Math.min(state.batteryCapacity,
        state.batteryCharge + netCharge * dtSafe);
    } else {
      state.alternatorOutput = 0;
      const drain = load + state.idleDrain;
      state.batteryCharge = Math.max(0, state.batteryCharge - drain * dtSafe);
    }

    // ---- Battery voltage ----
    // Voltage scales with charge: 24V nominal, dropping toward ~22V when
    // nearly empty and rising slightly when charging.
    const chargeFrac = state.batteryCharge / state.batteryCapacity;
    state.batteryVoltage = Math.round((22 + chargeFrac * 4) * 100) / 100;

    // ---- canCrank ----
    // Dead/low battery prevents cranking.
    state.canCrank = state.batteryCharge > state.deadBatteryCharge;

    // ---- Electrical failure ----
    // Failure is a persistent flag set by external triggers (e.g. severe
    // overload or damage). It disables non-critical devices but never
    // service brakes, air brakes, or steering.
    if (state.electricalFailure) {
      state.headlightsOn = false;
      state.interiorLightsOn = false;
      state.hornActive = false;
      state.wipersOn = false;
    }
  };

  // ---- Query methods ----

  ElectricalSystem.prototype.getBatteryCharge = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    return state ? state.batteryCharge : DEFAULT_ELEC.batteryCharge;
  };

  ElectricalSystem.prototype.getBatteryVoltage = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    return state ? state.batteryVoltage : DEFAULT_ELEC.batteryVoltage;
  };

  ElectricalSystem.prototype.getElectricalLoad = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    return state ? state.electricalLoad : 0;
  };

  ElectricalSystem.prototype.isLowBattery = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    return state ? state.batteryCharge <= state.lowBatteryCharge : false;
  };

  ElectricalSystem.prototype.isDeadBattery = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    return state ? state.batteryCharge <= state.deadBatteryCharge : false;
  };

  ElectricalSystem.prototype.canStartEngine = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    if (!state) return true;
    if (state.electricalFailure) return false;
    return state.canCrank;
  };

  ElectricalSystem.prototype.getStarterState = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    if (!state) return { canCrank: true, batteryCharge: DEFAULT_ELEC.batteryCharge };
    return {
      canCrank: state.canCrank,
      batteryCharge: state.batteryCharge,
      batteryVoltage: state.batteryVoltage,
      electricalFailure: state.electricalFailure
    };
  };

  ElectricalSystem.prototype.getState = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    if (!state) return null;
    return {
      batteryCharge: state.batteryCharge,
      batteryCapacity: state.batteryCapacity,
      batteryVoltage: state.batteryVoltage,
      alternatorOutput: state.alternatorOutput,
      alternatorMaxOutput: state.alternatorMaxOutput,
      electricalLoad: state.electricalLoad,
      canCrank: state.canCrank,
      electricalFailure: state.electricalFailure,
      headlightsOn: state.headlightsOn,
      interiorLightsOn: state.interiorLightsOn,
      hornActive: state.hornActive,
      wipersOn: state.wipersOn,
      engineRunning: state.engineRunning,
      isLowBattery: state.batteryCharge <= state.lowBatteryCharge,
      isDeadBattery: state.batteryCharge <= state.deadBatteryCharge
    };
  };

  ElectricalSystem.prototype.setState = function (vehicle, stateData) {
    const state = this.ensureElectrical(vehicle);
    if (!state || !stateData) return;
    if (typeof stateData.batteryCharge === 'number') {
      state.batteryCharge = Math.max(0, Math.min(state.batteryCapacity, stateData.batteryCharge));
    }
    if (typeof stateData.batteryVoltage === 'number') {
      state.batteryVoltage = stateData.batteryVoltage;
    }
    if (typeof stateData.alternatorOutput === 'number') {
      state.alternatorOutput = stateData.alternatorOutput;
    }
    if (typeof stateData.electricalLoad === 'number') {
      state.electricalLoad = stateData.electricalLoad;
    }
    if (typeof stateData.canCrank === 'boolean') {
      state.canCrank = stateData.canCrank;
    }
    if (typeof stateData.electricalFailure === 'boolean') {
      state.electricalFailure = stateData.electricalFailure;
    }
    if (typeof stateData.headlightsOn === 'boolean') {
      state.headlightsOn = stateData.headlightsOn;
    }
    if (typeof stateData.interiorLightsOn === 'boolean') {
      state.interiorLightsOn = stateData.interiorLightsOn;
    }
    if (typeof stateData.hornActive === 'boolean') {
      state.hornActive = stateData.hornActive;
    }
    if (typeof stateData.wipersOn === 'boolean') {
      state.wipersOn = stateData.wipersOn;
    }
    if (typeof stateData.engineRunning === 'boolean') {
      state.engineRunning = stateData.engineRunning;
    }
    // Recompute derived fields
    state.canCrank = state.batteryCharge > state.deadBatteryCharge;
  };

  ElectricalSystem.prototype.reset = function (vehicle) {
    const state = this.ensureElectrical(vehicle);
    if (!state) return;
    state.batteryCharge = DEFAULT_ELEC.batteryCharge;
    state.batteryVoltage = DEFAULT_ELEC.batteryVoltage;
    state.alternatorOutput = DEFAULT_ELEC.alternatorOutput;
    state.electricalLoad = 0;
    state.canCrank = true;
    state.electricalFailure = false;
    state.headlightsOn = false;
    state.interiorLightsOn = false;
    state.hornActive = false;
    state.wipersOn = false;
    state.engineRunning = false;
  };

ElectricalSystem.prototype._getVehicleState = function (vehicle) {
    if (!vehicle) return null;
    return vehicle._electrical && vehicle._electrical.__owner === this
      ? vehicle._electrical : null;
  };

  // ---- Vehicle integration helpers ----
  ElectricalSystem.prototype.ensureElectrical = function (vehicle) {
    if (!vehicle) return null;
    if (vehicle._electrical && vehicle._electrical.__owner === this) {
      return vehicle._electrical;
    }
    const state = this._createElectrical(vehicle);
    vehicle._electrical = state;
    return state;
  };

  ElectricalSystem.prototype._createElectrical = function (vehicle) {
    const defaults = vehicle && vehicle.electricalConfig ? vehicle.electricalConfig : DEFAULT_ELEC;
    const state = {
      __owner: this,
      batteryCharge: defaults.batteryCharge || DEFAULT_ELEC.batteryCharge,
      batteryCapacity: defaults.batteryCapacity || DEFAULT_ELEC.batteryCapacity,
      batteryVoltage: defaults.batteryVoltage || DEFAULT_ELEC.batteryVoltage,
      alternatorOutput: defaults.alternatorOutput || DEFAULT_ELEC.alternatorOutput,
      alternatorMaxOutput: defaults.alternatorMaxOutput || DEFAULT_ELEC.alternatorMaxOutput,
      starterDraw: defaults.starterDraw || DEFAULT_ELEC.starterDraw,
      headlightLoad: defaults.headlightLoad || DEFAULT_ELEC.headlightLoad,
      interiorLightLoad: defaults.interiorLightLoad || DEFAULT_ELEC.interiorLightLoad,
      hornLoad: defaults.hornLoad || DEFAULT_ELEC.hornLoad,
      wiperLoad: defaults.wiperLoad || DEFAULT_ELEC.wiperLoad,
      idleDrain: defaults.idleDrain || DEFAULT_ELEC.idleDrain,
      lowBatteryCharge: defaults.lowBatteryCharge || DEFAULT_ELEC.lowBatteryCharge,
      deadBatteryCharge: defaults.deadBatteryCharge || DEFAULT_ELEC.deadBatteryCharge,
      electricalFailure: false,
      electricalLoad: 0,
      engineRunning: false,
      canCrank: true,
      headlightsOn: false,
      interiorLightsOn: false,
      hornActive: false,
      wipersOn: false
    };
    this._vehicles.set(vehicle.id || ('v_' + Math.random().toString(36).slice(2)), state);
    return state;
  };

  ElectricalSystem.prototype.attachElectrical = function (vehicle) {
    if (!vehicle) return null;
    const state = this._vehicles.get(vehicle.id);
    if (state) {
      vehicle._electrical = state;
      return state;
    }
    return this.ensureElectrical(vehicle);
  };

  // ---- Save/load ----
  // Persist only transient electrical state. Static configuration is owned
  // by DEFAULT_ELEC and never saved.
  ElectricalSystem.prototype.serializeElectrical = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    if (!state) return null;
    return {
      batteryCharge: state.batteryCharge,
      batteryVoltage: state.batteryVoltage,
      alternatorOutput: state.alternatorOutput,
      electricalLoad: state.electricalLoad,
      canCrank: state.canCrank,
      electricalFailure: state.electricalFailure,
      headlightsOn: state.headlightsOn,
      interiorLightsOn: state.interiorLightsOn,
      wipersOn: state.wipersOn
    };
  };

  ElectricalSystem.prototype.deserializeElectrical = function (vehicle, data) {
    const state = this.ensureElectrical(vehicle);
    if (!state || !data) return;
    if (typeof data.batteryCharge === 'number') {
      state.batteryCharge = Math.max(0, Math.min(state.batteryCapacity, data.batteryCharge));
    }
    if (typeof data.batteryVoltage === 'number') {
      state.batteryVoltage = data.batteryVoltage;
    }
    if (typeof data.alternatorOutput === 'number') {
      state.alternatorOutput = data.alternatorOutput;
    }
    if (typeof data.electricalLoad === 'number') {
      state.electricalLoad = data.electricalLoad;
    }
    if (typeof data.canCrank === 'boolean') {
      state.canCrank = data.canCrank;
    }
    if (typeof data.electricalFailure === 'boolean') {
      state.electricalFailure = data.electricalFailure;
    }
    if (typeof data.headlightsOn === 'boolean') {
      state.headlightsOn = data.headlightsOn;
    }
    if (typeof data.interiorLightsOn === 'boolean') {
      state.interiorLightsOn = data.interiorLightsOn;
    }
    if (typeof data.wipersOn === 'boolean') {
      state.wipersOn = data.wipersOn;
    }
    // Horn is momentary - never persist it as active.
    state.hornActive = false;
    // Recompute derived fields
    state.canCrank = state.batteryCharge > state.deadBatteryCharge;
  };

  ElectricalSystem.prototype.serialize = function () {
    const data = {};
    for (const [id, state] of this._vehicles) {
      data[id] = {
        batteryCharge: state.batteryCharge,
        batteryVoltage: state.batteryVoltage,
        alternatorOutput: state.alternatorOutput,
        electricalLoad: state.electricalLoad,
        canCrank: state.canCrank,
        electricalFailure: state.electricalFailure,
        headlightsOn: state.headlightsOn,
        interiorLightsOn: state.interiorLightsOn,
        wipersOn: state.wipersOn
      };
    }
    return data;
  };

  ElectricalSystem.prototype.deserialize = function (data) {
    if (!data || typeof data !== 'object') return;
    for (const [id, stateData] of Object.entries(data)) {
      let existing = this._vehicles.get(id);
      if (!existing) {
        existing = {
          __owner: this,
          batteryCharge: DEFAULT_ELEC.batteryCharge,
          batteryCapacity: DEFAULT_ELEC.batteryCapacity,
          batteryVoltage: DEFAULT_ELEC.batteryVoltage,
          alternatorOutput: DEFAULT_ELEC.alternatorOutput,
          alternatorMaxOutput: DEFAULT_ELEC.alternatorMaxOutput,
          starterDraw: DEFAULT_ELEC.starterDraw,
          headlightLoad: DEFAULT_ELEC.headlightLoad,
          interiorLightLoad: DEFAULT_ELEC.interiorLightLoad,
          hornLoad: DEFAULT_ELEC.hornLoad,
          wiperLoad: DEFAULT_ELEC.wiperLoad,
          idleDrain: DEFAULT_ELEC.idleDrain,
          lowBatteryCharge: DEFAULT_ELEC.lowBatteryCharge,
          deadBatteryCharge: DEFAULT_ELEC.deadBatteryCharge,
          electricalFailure: false,
          electricalLoad: 0,
          engineRunning: false,
          canCrank: true,
          headlightsOn: false,
          interiorLightsOn: false,
          hornActive: false,
          wipersOn: false
        };
        this._vehicles.set(id, existing);
      }
      if (typeof stateData.batteryCharge === 'number') {
        existing.batteryCharge = Math.max(0, Math.min(existing.batteryCapacity, stateData.batteryCharge));
      }
      if (typeof stateData.batteryVoltage === 'number') {
        existing.batteryVoltage = stateData.batteryVoltage;
      }
      if (typeof stateData.alternatorOutput === 'number') {
        existing.alternatorOutput = stateData.alternatorOutput;
      }
      if (typeof stateData.electricalLoad === 'number') {
        existing.electricalLoad = stateData.electricalLoad;
      }
      if (typeof stateData.canCrank === 'boolean') {
        existing.canCrank = stateData.canCrank;
      }
      if (typeof stateData.electricalFailure === 'boolean') {
        existing.electricalFailure = stateData.electricalFailure;
      }
      if (typeof stateData.headlightsOn === 'boolean') {
        existing.headlightsOn = stateData.headlightsOn;
      }
      if (typeof stateData.interiorLightsOn === 'boolean') {
        existing.interiorLightsOn = stateData.interiorLightsOn;
      }
      if (typeof stateData.wipersOn === 'boolean') {
        existing.wipersOn = stateData.wipersOn;
      }
      // Horn is momentary - never persist it as active.
      existing.hornActive = false;
      existing.canCrank = existing.batteryCharge > existing.deadBatteryCharge;
    }
  };

  ElectricalSystem.prototype.destroy = function () {
    this._active = false;
    this._vehicles.clear();
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.ElectricalSystem = ElectricalSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = ElectricalSystem;
  }
})();
