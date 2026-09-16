/**
 * Bus Simulator - Engine Temperature & Overheating System (Phase 10B Task 14)
 *
 * ONE authoritative owner of engine temperature / coolant state.
 *
 * Responsibilities:
 *   - engine temperature (deg C)
 *   - engine cooling / radiator behavior
 *   - coolant level and coolant effectiveness
 *   - overheating / critical-overheating state
 *   - performance multiplier derived from temperature
 *   - overheating damage accumulation through existing damage/condition
 *
 * Does NOT duplicate acceleration, fuel consumption, steering, braking,
 * suspension, tire wear, air-brake pressure, or weather friction.
 * MovementSystem remains the movement/physics coordinator.
 * FuelSystem remains the sole owner of fuel depletion.
 * MaintenanceSystem remains the sole owner of maintenance scheduling.
 */
(function () {
  'use strict';

  const DEFAULT_TEMP = {
    engineTemperature: 85,      // deg C (typical idle/warm engine)
    normalTemperature: 90,      // deg C (target operating range)
    warningTemperature: 105,    // deg C (driver warning light)
    overheatTemperature: 115,   // deg C (visible overheating)
    criticalTemperature: 125,   // deg C (severe damage risk)
    minTemperature: 60,         // deg C (engine must stay above this to run)
    maxTemperature: 140,        // deg C (absolute clamp)
    coolantLevel: 100,          // 0..100 percent
    minCoolantLevel: 0,
    maxCoolantLevel: 100,
    coolingEfficiency: 1.0,     // 0..1, reduced by low coolant
    overheating: false,
    criticalOverheat: false,
    // Heat generation rates (deg C/sec)
    idleHeatRate: 0.6,          // deg C/sec at idle
    cruisingHeatRate: 2.2,      // deg C/sec at moderate sustained load
    highLoadHeatRate: 5.5,      // deg C/sec at high sustained load
    // Cooling rates (deg C/sec)
    cruisingCoolRate: 3.0,      // deg C/sec while moving at moderate speed
    lowSpeedCoolRate: 1.0,      // deg C/sec at very low speed
    idleCoolRate: 0.4,          // deg C/sec when stopped
    // Overheating damage (percent per second)
    overheatDamageRate: 0.02,   // %/s above overheat threshold
    criticalDamageRate: 0.08    // %/s above critical threshold
  };

  function EngineTemperatureSystem() {
    this._modules = null;
    this._active = true;
    this._vehicles = new Map();
  }

  EngineTemperatureSystem.prototype.init = function (modules) {
    this._modules = modules;
    this._active = true;
    this._vehicles = new Map();
  };

  EngineTemperatureSystem.prototype.update = function (dt) {
    if (!this._active) return;
    for (const [, state] of this._vehicles) {
      this._updateTemp(state, dt);
    }
  };

  // MovementSystem calls this before the physics step so temperature,
  // coolant, overheating state, and performance multiplier are current.
  // EngineTemperatureSystem never writes acceleration or fuel.
  EngineTemperatureSystem.prototype.updateVehicle = function (vehicle, dt) {
    if (!vehicle) return;
    const state = this.ensureTemp(vehicle);
    if (!state) return;
    // Snapshot inputs the temperature model consumes.
    // We read only existing vehicle fields; no acceleration or fuel math
    // is duplicated here.
    state.speed = typeof vehicle.speed === 'number' ? vehicle.speed : 0;
    state.targetSpeed = typeof vehicle.targetSpeed === 'number' ? vehicle.targetSpeed : 0;
    state.throttle = typeof vehicle._throttle === 'number' ? vehicle._throttle : 0;
    state.reverseMode = !!vehicle.reverseMode;
    // Optional: read ambient temperature from WeatherSystem if available.
    const weatherSystem = this._modules ? this._modules.WeatherSystem : null;
    state.ambientTemp = (weatherSystem && typeof weatherSystem.getAmbientTemperature === 'function')
      ? weatherSystem.getAmbientTemperature() : 25;
    this._updateTemp(state, dt);
  };

  EngineTemperatureSystem.prototype._updateTemp = function (state, dt) {
    if (!state) return;
    const dtSafe = dt > 0 ? dt : 0.016;
    const speedMag = Math.abs(state.speed || 0);

    // ---- Engine load factor ----
    // Derived from existing speed and throttle demand. No acceleration
    // math is duplicated; this is a coarse load indicator used only to
    // scale heat generation.
    let load = 0.4; // baseline idle load
    if (speedMag > 0) {
      load += 0.4; // running load
      if (state.throttle > 0.5) load += 0.4; // high throttle
      if (state.targetSpeed > state.speed) load += 0.2; // accelerating
    } else if (state.throttle > 0) {
      load += 0.3; // throttle applied at low speed
    }
    load = Math.max(0.2, Math.min(1.0, load));

    // ---- Heat generation ----
    let heatRate = state.idleHeatRate;
    if (speedMag > 20) {
      heatRate = state.cruisingHeatRate;
      if (load > 0.7) heatRate = state.highLoadHeatRate;
    } else if (speedMag > 0) {
      heatRate = state.cruisingHeatRate * 0.6;
    }
    const heatGenerated = heatRate * load * dtSafe;

    // ---- Cooling ----
    // Cooling is stronger while moving, weaker at low speed, weakest at
    // idle. Coolant level reduces cooling efficiency.
    const coolantFrac = state.coolantLevel / Math.max(1, state.maxCoolantLevel);
    const coolantEffect = Math.max(0.05, coolantFrac); // never fully disable
    let coolRate;
    if (speedMag > 20) {
      coolRate = state.cruisingCoolRate;
    } else if (speedMag > 0) {
      coolRate = state.lowSpeedCoolRate;
    } else {
      coolRate = state.idleCoolRate;
    }
    const cooling = coolRate * coolantEffect * dtSafe;
    // Cooling targets the ambient/normal range, not absolute zero.
    const tempAboveNormal = Math.max(0, state.engineTemperature - state.normalTemperature);
    const effectiveCooling = Math.min(cooling, tempAboveNormal);

    // ---- Apply temperature change ----
    let nextTemp = state.engineTemperature + heatGenerated - effectiveCooling;
    // Never drop below the safe minimum temperature.
    nextTemp = Math.max(state.minTemperature, nextTemp);
    // Clamp to absolute maximum.
    nextTemp = Math.min(state.maxTemperature, nextTemp);
    state.engineTemperature = nextTemp;

    // ---- Coolant loss under overheating ----
    // Coolant is consumed (boils off) when severely overheated.
    if (state.engineTemperature >= state.overheatTemperature) {
      const boilLoss = 0.4 * dtSafe; // %/s lost while overheating
      state.coolantLevel = Math.max(state.minCoolantLevel, state.coolantLevel - boilLoss);
    }

    // ---- Overheating state transitions ----
    state.overheating = state.engineTemperature >= state.overheatTemperature;
    state.criticalOverheat = state.engineTemperature >= state.criticalTemperature;

    // ---- Performance multiplier ----
    // 1.0 at/below warning, mild reduction above warning, stronger above
    // overheat, severe above critical.
    let perf = 1.0;
    if (state.engineTemperature >= state.criticalTemperature) {
      perf = 0.35;
    } else if (state.engineTemperature >= state.overheatTemperature) {
      const t = (state.engineTemperature - state.overheatTemperature)
        / (state.criticalTemperature - state.overheatTemperature);
      perf = 0.7 - t * 0.35; // 0.7 -> 0.35
    } else if (state.engineTemperature >= state.warningTemperature) {
      const t = (state.engineTemperature - state.warningTemperature)
        / (state.overheatTemperature - state.warningTemperature);
      perf = 0.95 - t * 0.25; // 0.95 -> 0.7
    }
    state.performanceMultiplier = Math.max(0.35, Math.min(1.0, perf));
  };

  // ---- Query methods ----

  EngineTemperatureSystem.prototype.getTemperature = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    return state ? state.engineTemperature : DEFAULT_TEMP.engineTemperature;
  };

  EngineTemperatureSystem.prototype.getCoolantLevel = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    return state ? state.coolantLevel : DEFAULT_TEMP.coolantLevel;
  };

  EngineTemperatureSystem.prototype.getCoolingEfficiency = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    if (!state) return DEFAULT_TEMP.coolingEfficiency;
    const coolantFrac = state.coolantLevel / Math.max(1, state.maxCoolantLevel);
    return Math.max(0.05, coolantFrac);
  };

  EngineTemperatureSystem.prototype.isOverheating = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    return state ? state.overheating : false;
  };

  EngineTemperatureSystem.prototype.isCritical = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    return state ? state.criticalOverheat : false;
  };

  EngineTemperatureSystem.prototype.getPerformanceMultiplier = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    return state ? (state.performanceMultiplier || 1.0) : 1.0;
  };

  EngineTemperatureSystem.prototype.getState = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    if (!state) return null;
    return {
      engineTemperature: state.engineTemperature,
      normalTemperature: state.normalTemperature,
      warningTemperature: state.warningTemperature,
      overheatTemperature: state.overheatTemperature,
      criticalTemperature: state.criticalTemperature,
      coolantLevel: state.coolantLevel,
      minCoolantLevel: state.minCoolantLevel,
      maxCoolantLevel: state.maxCoolantLevel,
      coolingEfficiency: this.getCoolingEfficiency(vehicle),
      overheating: state.overheating,
      criticalOverheat: state.criticalOverheat,
      performanceMultiplier: state.performanceMultiplier
    };
  };

  EngineTemperatureSystem.prototype.setState = function (vehicle, stateData) {
    const state = this.ensureTemp(vehicle);
    if (!state || !stateData) return;
    if (typeof stateData.engineTemperature === 'number') {
      state.engineTemperature = Math.max(state.minTemperature,
        Math.min(state.maxTemperature, stateData.engineTemperature));
    }
    if (typeof stateData.coolantLevel === 'number') {
      state.coolantLevel = Math.max(state.minCoolantLevel,
        Math.min(state.maxCoolantLevel, stateData.coolantLevel));
    }
    if (typeof stateData.overheating === 'boolean') {
      state.overheating = stateData.overheating;
    }
    if (typeof stateData.criticalOverheat === 'boolean') {
      state.criticalOverheat = stateData.criticalOverheat;
    }
    if (typeof stateData.coolingEfficiency === 'number') {
      state.coolingEfficiency = Math.max(0.05, Math.min(1.0, stateData.coolingEfficiency));
    }
    this._recomputePerformance(state);
  };

  EngineTemperatureSystem.prototype._recomputePerformance = function (state) {
    if (!state) return;
    let perf = 1.0;
    if (state.engineTemperature >= state.criticalTemperature) {
      perf = 0.35;
    } else if (state.engineTemperature >= state.overheatTemperature) {
      const t = (state.engineTemperature - state.overheatTemperature)
        / (state.criticalTemperature - state.overheatTemperature);
      perf = 0.7 - t * 0.35;
    } else if (state.engineTemperature >= state.warningTemperature) {
      const t = (state.engineTemperature - state.warningTemperature)
        / (state.overheatTemperature - state.warningTemperature);
      perf = 0.95 - t * 0.25;
    }
    state.performanceMultiplier = Math.max(0.35, Math.min(1.0, perf));
    state.overheating = state.engineTemperature >= state.overheatTemperature;
    state.criticalOverheat = state.engineTemperature >= state.criticalTemperature;
  };

  EngineTemperatureSystem.prototype.reset = function (vehicle) {
    const state = this.ensureTemp(vehicle);
    if (!state) return;
    state.engineTemperature = DEFAULT_TEMP.engineTemperature;
    state.coolantLevel = DEFAULT_TEMP.coolantLevel;
    state.coolingEfficiency = DEFAULT_TEMP.coolingEfficiency;
    state.overheating = false;
    state.criticalOverheat = false;
    state.performanceMultiplier = 1.0;
    state.speed = 0;
    state.targetSpeed = 0;
    state.throttle = 0;
    state.reverseMode = false;
  };

  EngineTemperatureSystem.prototype._getVehicleState = function (vehicle) {
    if (!vehicle) return null;
    return vehicle._engineTemp && vehicle._engineTemp.__owner === this
      ? vehicle._engineTemp : null;
  };

  // ---- Vehicle integration helpers ----
  EngineTemperatureSystem.prototype.ensureTemp = function (vehicle) {
    if (!vehicle) return null;
    if (vehicle._engineTemp && vehicle._engineTemp.__owner === this) {
      return vehicle._engineTemp;
    }
    const state = this._createTemp(vehicle);
    vehicle._engineTemp = state;
    return state;
  };

  EngineTemperatureSystem.prototype._createTemp = function (vehicle) {
    const defaults = vehicle && vehicle.engineTempConfig ? vehicle.engineTempConfig : DEFAULT_TEMP;
    const state = {
      __owner: this,
      engineTemperature: defaults.engineTemperature || DEFAULT_TEMP.engineTemperature,
      normalTemperature: defaults.normalTemperature || DEFAULT_TEMP.normalTemperature,
      warningTemperature: defaults.warningTemperature || DEFAULT_TEMP.warningTemperature,
      overheatTemperature: defaults.overheatTemperature || DEFAULT_TEMP.overheatTemperature,
      criticalTemperature: defaults.criticalTemperature || DEFAULT_TEMP.criticalTemperature,
      minTemperature: defaults.minTemperature || DEFAULT_TEMP.minTemperature,
      maxTemperature: defaults.maxTemperature || DEFAULT_TEMP.maxTemperature,
      coolantLevel: defaults.coolantLevel || DEFAULT_TEMP.coolantLevel,
      minCoolantLevel: defaults.minCoolantLevel || DEFAULT_TEMP.minCoolantLevel,
      maxCoolantLevel: defaults.maxCoolantLevel || DEFAULT_TEMP.maxCoolantLevel,
      coolingEfficiency: defaults.coolingEfficiency || DEFAULT_TEMP.coolingEfficiency,
      overheating: false,
      criticalOverheat: false,
      performanceMultiplier: 1.0,
      idleHeatRate: defaults.idleHeatRate || DEFAULT_TEMP.idleHeatRate,
      cruisingHeatRate: defaults.cruisingHeatRate || DEFAULT_TEMP.cruisingHeatRate,
      highLoadHeatRate: defaults.highLoadHeatRate || DEFAULT_TEMP.highLoadHeatRate,
      cruisingCoolRate: defaults.cruisingCoolRate || DEFAULT_TEMP.cruisingCoolRate,
      lowSpeedCoolRate: defaults.lowSpeedCoolRate || DEFAULT_TEMP.lowSpeedCoolRate,
      idleCoolRate: defaults.idleCoolRate || DEFAULT_TEMP.idleCoolRate,
      overheatDamageRate: defaults.overheatDamageRate || DEFAULT_TEMP.overheatDamageRate,
      criticalDamageRate: defaults.criticalDamageRate || DEFAULT_TEMP.criticalDamageRate,
      speed: 0,
      targetSpeed: 0,
      throttle: 0,
      reverseMode: false,
      ambientTemp: 25
    };
    this._vehicles.set(vehicle.id || ('v_' + Math.random().toString(36).slice(2)), state);
    return state;
  };

  EngineTemperatureSystem.prototype.attachTemp = function (vehicle) {
    if (!vehicle) return null;
    const state = this._vehicles.get(vehicle.id);
    if (state) {
      vehicle._engineTemp = state;
      return state;
    }
    return this.ensureTemp(vehicle);
  };

  // ---- Overheating damage accumulation ----
  // Uses the EXISTING vehicle damage/condition mechanism. This method
  // does not create a second damage system; it only increments the
  // existing bus.damage field and recomputes condition/maxSpeed.
  EngineTemperatureSystem.prototype.applyOverheatDamage = function (vehicle, dt) {
    const state = this._getVehicleState(vehicle);
    if (!state || !vehicle) return;
    if (typeof vehicle.damage !== 'number') return;
    let rate = 0;
    if (state.criticalOverheat) {
      rate = state.criticalDamageRate;
    } else if (state.overheating) {
      rate = state.overheatDamageRate;
    }
    if (rate <= 0) return;
    const damageDelta = rate * dt;
    vehicle.damage = Math.min(100, (vehicle.damage || 0) + damageDelta);
    // Recompute condition from existing damage (same formula as Bus.update)
    if (typeof vehicle.condition !== 'undefined') {
      vehicle.condition = Math.max(0, 100 - vehicle.damage);
    }
    if (vehicle.damage > 80 && typeof vehicle.maxSpeed === 'number') {
      const base = (vehicle.busType ? vehicle.busType.speed : 65);
      vehicle.maxSpeed = base * 0.7;
    }
    if (typeof vehicle.isDamaged !== 'undefined') {
      vehicle.isDamaged = vehicle.damage > 10;
    }
  };

  // ---- Save/load ----
  // Persist only transient engine state. Static configuration is owned
  // by DEFAULT_TEMP and never saved.
  EngineTemperatureSystem.prototype.serializeTemp = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    if (!state) return null;
    return {
      engineTemperature: state.engineTemperature,
      coolantLevel: state.coolantLevel,
      overheating: state.overheating,
      criticalOverheat: state.criticalOverheat
    };
  };

EngineTemperatureSystem.prototype.deserializeTemp = function (vehicle, data) {
    const state = this.ensureTemp(vehicle);
    if (!state || !data) return;
    if (typeof data.engineTemperature === 'number') {
      state.engineTemperature = Math.max(state.minTemperature,
        Math.min(state.maxTemperature, data.engineTemperature));
    }
    if (typeof data.coolantLevel === 'number') {
      state.coolantLevel = Math.max(state.minCoolantLevel,
        Math.min(state.maxCoolantLevel, data.coolantLevel));
    }
    // Recompute derived fields first, then honor explicitly saved boolean
    // flags so a persisted overheating state survives round-trip even if
    // the saved temperature is below the current threshold.
    this._recomputePerformance(state);
    if (typeof data.overheating === 'boolean') {
      state.overheating = data.overheating;
    }
    if (typeof data.criticalOverheat === 'boolean') {
      state.criticalOverheat = data.criticalOverheat;
    }
  };

  EngineTemperatureSystem.prototype.serialize = function () {
    const data = {};
    for (const [id, state] of this._vehicles) {
      data[id] = {
        engineTemperature: state.engineTemperature,
        coolantLevel: state.coolantLevel,
        overheating: state.overheating,
        criticalOverheat: state.criticalOverheat
      };
    }
    return data;
  };

  EngineTemperatureSystem.prototype.deserialize = function (data) {
    if (!data || typeof data !== 'object') return;
    for (const [id, stateData] of Object.entries(data)) {
      let existing = this._vehicles.get(id);
      if (!existing) {
        existing = {
          __owner: this,
          engineTemperature: DEFAULT_TEMP.engineTemperature,
          normalTemperature: DEFAULT_TEMP.normalTemperature,
          warningTemperature: DEFAULT_TEMP.warningTemperature,
          overheatTemperature: DEFAULT_TEMP.overheatTemperature,
          criticalTemperature: DEFAULT_TEMP.criticalTemperature,
          minTemperature: DEFAULT_TEMP.minTemperature,
          maxTemperature: DEFAULT_TEMP.maxTemperature,
          coolantLevel: DEFAULT_TEMP.coolantLevel,
          minCoolantLevel: DEFAULT_TEMP.minCoolantLevel,
          maxCoolantLevel: DEFAULT_TEMP.maxCoolantLevel,
          coolingEfficiency: DEFAULT_TEMP.coolingEfficiency,
          overheating: false,
          criticalOverheat: false,
          performanceMultiplier: 1.0,
          idleHeatRate: DEFAULT_TEMP.idleHeatRate,
          cruisingHeatRate: DEFAULT_TEMP.cruisingHeatRate,
          highLoadHeatRate: DEFAULT_TEMP.highLoadHeatRate,
          cruisingCoolRate: DEFAULT_TEMP.cruisingCoolRate,
          lowSpeedCoolRate: DEFAULT_TEMP.lowSpeedCoolRate,
          idleCoolRate: DEFAULT_TEMP.idleCoolRate,
          overheatDamageRate: DEFAULT_TEMP.overheatDamageRate,
          criticalDamageRate: DEFAULT_TEMP.criticalDamageRate,
          speed: 0,
          targetSpeed: 0,
          throttle: 0,
          reverseMode: false,
          ambientTemp: 25
        };
        this._vehicles.set(id, existing);
      }
      if (typeof stateData.engineTemperature === 'number') {
        existing.engineTemperature = Math.max(existing.minTemperature,
          Math.min(existing.maxTemperature, stateData.engineTemperature));
      }
      if (typeof stateData.coolantLevel === 'number') {
        existing.coolantLevel = Math.max(existing.minCoolantLevel,
          Math.min(existing.maxCoolantLevel, stateData.coolantLevel));
      }
      if (typeof stateData.overheating === 'boolean') {
        existing.overheating = stateData.overheating;
      }
      if (typeof stateData.criticalOverheat === 'boolean') {
        existing.criticalOverheat = stateData.criticalOverheat;
      }
      this._recomputePerformance(existing);
    }
  };

  EngineTemperatureSystem.prototype.destroy = function () {
    this._active = false;
    this._vehicles.clear();
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.EngineTemperatureSystem = EngineTemperatureSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = EngineTemperatureSystem;
  }
})();
