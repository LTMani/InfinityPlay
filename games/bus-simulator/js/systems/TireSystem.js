/**
 * Bus Simulator - Tire System (Phase 10B Task 11)
 *
 * ONE authoritative owner for tire wear and grip behavior.
 *
 * Responsibilities:
 *   - four tire states (frontLeft, frontRight, rearLeft, rearRight)
 *   - wear from distance, braking, acceleration, steering, slip, road conditions
 *   - grip affected by wear, road/weather friction, temperature, wheel slip
 *   - query methods: getAverageGrip(), getWheelGrip(wheel), getWear(wheel)
 *
 * Does NOT duplicate braking, acceleration, steering, fuel, transmission,
 * suspension, or weather calculations. MovementSystem remains the
 * movement/physics coordinator. TireSystem only provides grip/wear state
 * that other systems consult; it never writes movement physics.
 */

(function () {
  'use strict';

  const DEFAULT_TIRE = {
    initialGrip: 1.0,
    maxWear: 1.0,
    wearPerKm: 0.0008,
    brakeWearFactor: 0.0004,
    accelWearFactor: 0.0003,
    steerWearFactor: 0.0005,
    slipWearFactor: 0.0006,
    roadConditionFactor: 1.0,
    gripWearSlope: 0.85
  };

  function TireSystem() {
    this._vehicles = new Map();
    this._modules = null;
    this._active = true;
  }

  TireSystem.prototype.init = function (modules) {
    this._modules = modules;
    this._vehicles = new Map();
    this._active = true;
  };

  TireSystem.prototype.update = function (dt) {
    if (!this._active) return;
    for (const [, state] of this._vehicles) {
      this._updateTire(state, dt);
    }
  };
  // MovementSystem calls this before the physics step so tire wear/grip are
  // current for the deceleration/acceleration gates.
  TireSystem.prototype.updateVehicle = function (vehicle, dt) {
    if (!vehicle) return;
    const state = this.ensureTires(vehicle);
    if (!state) return;
    state.speed = typeof vehicle.speed === 'number' ? vehicle.speed : 0;
    state.targetSpeed = typeof vehicle.targetSpeed === 'number' ? vehicle.targetSpeed : 0;
    state.steering = typeof vehicle.steering === 'number' ? vehicle.steering : 0;
    state.brakeInput = typeof vehicle._brakeInput === 'number' ? vehicle._brakeInput : 0;
    state.handbrake = !!vehicle._handbrake;
state.roadFriction = (typeof vehicle.roadFrictionMultiplier === 'number')
      ? vehicle.roadFrictionMultiplier : 1.0;
    // Phase 10B Task 12: consult the road surface's tire wear multiplier.
    // RoadSurfaceSystem owns surface data; TireSystem only reads it.
    const surface = (typeof vehicle.getRoadSurface === 'function')
      ? vehicle.getRoadSurface() : null;
    state.roadSurface = surface;
    // Suspension wheel-load (optional integration)
    const susp = (typeof vehicle.getSuspension === 'function') ? vehicle.getSuspension() : null;
    if (susp) {
      state.frontLoad = susp.frontLoad;
      state.rearLoad = susp.rearLoad;
    }
    // Brake ABS/slip (optional integration)
    const brake = (typeof vehicle.getBrake === 'function') ? vehicle.getBrake() : null;
    if (brake) {
      state.absActive = !!brake.absActive;
      state.slipRatio = typeof brake.slipRatio === 'number' ? brake.slipRatio : 0;
    }
    this._updateTire(state, dt);
  };

  TireSystem.prototype._updateTire = function (state, dt) {
    if (!state) return;
    const dtSafe = dt > 0 ? dt : 0.016;

    // ---- Distance traveled ----
    const speedKmh = Math.abs(state.speed || 0);
    const distanceKm = (speedKmh / 3.6) * dtSafe;
    state.distanceTraveled = (state.distanceTraveled || 0) + distanceKm;

// ---- Road condition factor (from weather friction) ----
    const roadWearMult = 1.0 + (1.0 - state.roadFriction) * 0.5;
    // Phase 10B Task 12: multiply wear by the road surface's tireWear
    // multiplier. RoadSurfaceSystem owns surface data; TireSystem only
    // reads the tire-wear component it needs.
    const surfaceWear = (state.roadSurface && typeof state.roadSurface.tireWearMultiplier === 'number')
      ? state.roadSurface.tireWearMultiplier : 1.0;

    // ---- Per-wheel wear accumulation ----
    const wheels = ['frontLeft', 'frontRight', 'rearLeft', 'rearRight'];
    for (const wheel of wheels) {
      const tire = state.tires[wheel];
      if (!tire) continue;

      // Base distance wear
      let wearDelta = tire.wearPerKm * distanceKm;

      // Brake wear (front tires wear more from braking)
      if (state.brakeInput > 0) {
        const brakeWear = tire.brakeWearFactor * state.brakeInput * (speedKmh / 50) * dtSafe * 60;
        wearDelta += brakeWear * (wheel.indexOf('front') === 0 ? 1.2 : 0.8);
      }

      // Acceleration wear (rear tires wear more from acceleration)
      if (state.targetSpeed > state.speed) {
        const accelWear = tire.accelWearFactor * (Math.min(1, (state.targetSpeed - state.speed) / 20)) * dtSafe * 60;
        wearDelta += accelWear * (wheel.indexOf('rear') === 0 ? 1.2 : 0.8);
      }

      // Steering wear (front tires wear more from steering)
      const steerMag = Math.abs(state.steering || 0);
      if (steerMag > 0) {
        const steerWear = tire.steerWearFactor * steerMag * dtSafe * 60;
        wearDelta += steerWear * (wheel.indexOf('front') === 0 ? 1.3 : 0.7);
      }

      // Slip wear (from ABS slip)
      if (state.slipRatio > 0) {
        const slipWear = tire.slipWearFactor * state.slipRatio * dtSafe * 60;
        wearDelta += slipWear;
      }

// Apply road condition multiplier
      wearDelta *= roadWearMult * surfaceWear;

      // Accumulate and clamp
      tire.wear = Math.min(tire.maxWear, (tire.wear || 0) + wearDelta);

      // ---- Grip from wear ----
      const wearFrac = tire.wear / Math.max(0.0001, tire.maxWear);
      const wearGrip = Math.max(0.2, 1.0 - wearFrac * tire.gripWearSlope);

      // ---- Grip from road/weather friction ----
      const roadGrip = state.roadFriction;

      // ---- Combined grip ----
      tire.grip = Math.max(0.05, Math.min(1.0, wearGrip * roadGrip));

      // ---- Temperature (simplified) ----
      const heatGen = (state.slipRatio || 0) * 30 + (speedKmh > 10 ? 5 : 0);
      tire.temperature = Math.max(15, Math.min(120, (tire.temperature || 15) + heatGen * dtSafe));
      if (speedKmh < 1) {
        tire.temperature = Math.max(15, (tire.temperature || 15) - 10 * dtSafe);
      }
    }

    // ---- Store aggregate state ----
    state.averageGrip = this._computeAverageGrip(state);
  };

  TireSystem.prototype._computeAverageGrip = function (state) {
    if (!state || !state.tires) return 1.0;
    const wheels = ['frontLeft', 'frontRight', 'rearLeft', 'rearRight'];
    let sum = 0;
    let count = 0;
    for (const wheel of wheels) {
      const tire = state.tires[wheel];
      if (tire && typeof tire.grip === 'number') {
        sum += tire.grip;
        count++;
      }
    }
    return count > 0 ? sum / count : 1.0;
  };

  // ---- Vehicle integration helpers ----
  TireSystem.prototype.ensureTires = function (vehicle) {
    if (!vehicle) return null;
    if (vehicle._tires && vehicle._tires.__owner === this) {
      return vehicle._tires;
    }
    const state = this._createTires(vehicle);
    vehicle._tires = state;
    return state;
  };

  TireSystem.prototype._createTires = function (vehicle) {
    const defaults = vehicle && vehicle.tireConfig ? vehicle.tireConfig : DEFAULT_TIRE;
    const makeTire = () => ({
      wear: 0,
      grip: defaults.initialGrip || 1.0,
      temperature: 15,
      wearPerKm: defaults.wearPerKm || DEFAULT_TIRE.wearPerKm,
      brakeWearFactor: defaults.brakeWearFactor || DEFAULT_TIRE.brakeWearFactor,
      accelWearFactor: defaults.accelWearFactor || DEFAULT_TIRE.accelWearFactor,
      steerWearFactor: defaults.steerWearFactor || DEFAULT_TIRE.steerWearFactor,
      slipWearFactor: defaults.slipWearFactor || DEFAULT_TIRE.slipWearFactor,
      maxWear: defaults.maxWear || DEFAULT_TIRE.maxWear,
      gripWearSlope: defaults.gripWearSlope || DEFAULT_TIRE.gripWearSlope
    });
    const state = {
      __owner: this,
      tires: {
        frontLeft: makeTire(),
        frontRight: makeTire(),
        rearLeft: makeTire(),
        rearRight: makeTire()
      },
      distanceTraveled: 0,
      speed: 0,
      targetSpeed: 0,
      steering: 0,
      brakeInput: 0,
      handbrake: false,
      roadFriction: 1.0,
      frontLoad: 0,
      rearLoad: 0,
      absActive: false,
      slipRatio: 0,
      averageGrip: 1.0
    };
    this._vehicles.set(vehicle.id || ('v_' + Math.random().toString(36).slice(2)), state);
    return state;
  };

  TireSystem.prototype.getTires = function (vehicle) {
    if (!vehicle) return null;
    return vehicle._tires || null;
  };

  TireSystem.prototype.getWheelGrip = function (vehicle, wheel) {
    const state = this.getTires(vehicle);
    if (!state || !state.tires || !state.tires[wheel]) return 1.0;
    const tire = state.tires[wheel];
    return (typeof tire.grip === 'number') ? tire.grip : 1.0;
  };

  TireSystem.prototype.getWear = function (vehicle, wheel) {
    const state = this.getTires(vehicle);
    if (!state || !state.tires || !state.tires[wheel]) return 0;
    const tire = state.tires[wheel];
    return (typeof tire.wear === 'number') ? tire.wear : 0;
  };

  TireSystem.prototype.getAverageGrip = function (vehicle) {
    const state = this.getTires(vehicle);
    if (!state) return 1.0;
    return (typeof state.averageGrip === 'number') ? state.averageGrip : 1.0;
  };

  TireSystem.prototype.resetTires = function (vehicle) {
    const state = this.ensureTires(vehicle);
    if (!state) return;
    for (const wheel of Object.keys(state.tires)) {
      state.tires[wheel].wear = 0;
      state.tires[wheel].grip = DEFAULT_TIRE.initialGrip;
      state.tires[wheel].temperature = 15;
    }
    state.distanceTraveled = 0;
    state.averageGrip = this._computeAverageGrip(state);
  };

  TireSystem.prototype.serializeTires = function (vehicle) {
    const state = this.getTires(vehicle);
    if (!state) return null;
    const tires = {};
    for (const [wheel, tire] of Object.entries(state.tires)) {
      tires[wheel] = {
        wear: tire.wear,
        grip: tire.grip,
        temperature: tire.temperature
      };
    }
    return {
      tires,
      distanceTraveled: state.distanceTraveled,
      averageGrip: state.averageGrip
    };
  };

  TireSystem.prototype.deserializeTires = function (vehicle, data) {
    const state = this.ensureTires(vehicle);
    if (!state || !data) return;
    if (data.distanceTraveled !== undefined) state.distanceTraveled = data.distanceTraveled;
    if (data.averageGrip !== undefined) state.averageGrip = data.averageGrip;
    if (data.tires && typeof data.tires === 'object') {
      for (const [wheel, tireData] of Object.entries(data.tires)) {
        if (state.tires[wheel]) {
          if (typeof tireData.wear === 'number') state.tires[wheel].wear = tireData.wear;
          if (typeof tireData.grip === 'number') state.tires[wheel].grip = tireData.grip;
          if (typeof tireData.temperature === 'number') state.tires[wheel].temperature = tireData.temperature;
        }
      }
    }
  };

  TireSystem.prototype.serialize = function () {
    const data = {};
    for (const [id, state] of this._vehicles) {
      const tires = {};
      for (const [wheel, tire] of Object.entries(state.tires)) {
        tires[wheel] = { wear: tire.wear, grip: tire.grip, temperature: tire.temperature };
      }
      data[id] = { tires, distanceTraveled: state.distanceTraveled, averageGrip: state.averageGrip };
    }
    return data;
  };

  TireSystem.prototype.deserialize = function (data) {
    if (!data || typeof data !== 'object') return;
    for (const [id, stateData] of Object.entries(data)) {
      let existing = this._vehicles.get(id);
      if (!existing) {
        existing = {
          __owner: this,
          tires: {
            frontLeft: { wear: 0, grip: 1.0, temperature: 15 },
            frontRight: { wear: 0, grip: 1.0, temperature: 15 },
            rearLeft: { wear: 0, grip: 1.0, temperature: 15 },
            rearRight: { wear: 0, grip: 1.0, temperature: 15 }
          },
          distanceTraveled: 0,
          speed: 0,
          targetSpeed: 0,
          steering: 0,
          brakeInput: 0,
          handbrake: false,
          roadFriction: 1.0,
          frontLoad: 0,
          rearLoad: 0,
          absActive: false,
          slipRatio: 0,
          averageGrip: 1.0
        };
        this._vehicles.set(id, existing);
      }
      if (stateData.distanceTraveled !== undefined) existing.distanceTraveled = stateData.distanceTraveled;
      if (stateData.averageGrip !== undefined) existing.averageGrip = stateData.averageGrip;
      if (stateData.tires && typeof stateData.tires === 'object') {
        for (const [wheel, tireData] of Object.entries(stateData.tires)) {
          if (existing.tires[wheel]) {
            if (typeof tireData.wear === 'number') existing.tires[wheel].wear = tireData.wear;
            if (typeof tireData.grip === 'number') existing.tires[wheel].grip = tireData.grip;
            if (typeof tireData.temperature === 'number') existing.tires[wheel].temperature = tireData.temperature;
          }
        }
      }
    }
  };

  TireSystem.prototype.attachTires = function (vehicle) {
    if (!vehicle) return null;
    const state = this._vehicles.get(vehicle.id);
    if (state) {
      vehicle._tires = state;
      return state;
    }
    return this.ensureTires(vehicle);
  };

  TireSystem.prototype.destroy = function () {
    this._vehicles.clear();
    this._active = false;
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.TireSystem = TireSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = TireSystem;
  }
})();
