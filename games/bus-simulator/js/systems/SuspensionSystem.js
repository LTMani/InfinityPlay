/**
 * Bus Simulator - Suspension System (Phase 10B Task 9)
 *
 * ONE authoritative owner for suspension and weight-transfer behavior.
 *
 * Responsibilities:
 *   - suspension compression / rebound / damping
 *   - front & rear load distribution
 *   - acceleration / braking / lateral weight transfer
 *   - body roll and pitch
 *   - configurable bus parameters (mass, CoM, wheelbase, track width,
 *     stiffness, damping, compression/rebound limits)
 *
 * Does NOT duplicate acceleration, braking, steering, transmission, fuel
 * consumption, collision damage, or weather friction. MovementSystem
 * remains the movement/physics coordinator. Suspension state represents
 * actual calculated vehicle dynamics and only feeds back into the physics
 * path through documented hooks (load transfer, roll/pitch).
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);

  // Configurable default suspension for buses.
  const DEFAULT_SUSPENSION = {
    mass: 8000,
    wheelbase: 5.0,
    trackWidth: 2.4,
    centerOfMass: 0.5,
    stiffness: 180000,
    damping: 12000,
    maxCompression: 0.35,
    maxRebound: 0.25,
    rollStiffness: 40000,
    pitchStiffness: 60000
  };

  function SuspensionSystem() {
    this._vehicles = new Map();
    this._modules = null;
    this._active = true;
  }

  SuspensionSystem.prototype.init = function (modules) {
    this._modules = modules;
    this._vehicles = new Map();
    this._active = true;
  };

  SuspensionSystem.prototype.update = function (dt) {
    if (!this._active) return;
    for (const [, state] of this._vehicles) {
      this._updateSuspension(state, dt);
    }
  };

  // Update a specific vehicle's suspension state. MovementSystem calls this
  // before the physics step so compression/roll/pitch are current.
  SuspensionSystem.prototype.updateVehicle = function (vehicle, dt) {
    if (!vehicle) return;
    const state = this.ensureSuspension(vehicle);
    if (!state) return;
    // Snapshot inputs used by the suspension model
    state.prevSpeed = state.speed;
    state.speed = typeof vehicle.speed === 'number' ? vehicle.speed : 0;
    state.targetSpeed = typeof vehicle.targetSpeed === 'number' ? vehicle.targetSpeed : 0;
    state.steering = typeof vehicle.steering === 'number' ? vehicle.steering : 0;
    state.roadFriction = (typeof vehicle.roadFrictionMultiplier === 'number')
      ? vehicle.roadFrictionMultiplier : 1.0;
    this._updateSuspension(state, dt);
  };

SuspensionSystem.prototype._updateSuspension = function (state, dt) {
    if (!state) return;
    const dtSafe = dt > 0 ? dt : 0.016;

    // ---- Longitudinal weight transfer (acceleration / braking) ----
    // Use the relationship between targetSpeed and current speed to infer
    // whether the vehicle is accelerating or braking. This is robust to
    // first-frame prevSpeed initialization and produces deterministic results.
    const speed = state.speed || 0;
    const target = state.targetSpeed || 0;
    let accelLong = 0;
    if (target > speed) {
      // Accelerating toward target
      accelLong = (target - speed) / dtSafe;
    } else if (target < speed) {
      // Braking toward target
      accelLong = (target - speed) / dtSafe;
    }
    // Normalize: a typical bus acceleration/braking is ~25 km/h/s.
    const accelNorm = Math.max(-1, Math.min(1, accelLong / 25));
    const comFront = state.centerOfMass;
    const comRear = 1 - comFront;
    // Positive accel (forward) loads the rear; negative (braking) loads front.
    const transferFrac = accelNorm * state.mass * state.wheelbase;
    let frontLoad = state.mass * comFront - transferFrac * comRear;
    let rearLoad = state.mass * comRear + transferFrac * comFront;
    // Clamp loads to physically valid non-negative values
    frontLoad = Math.max(0, frontLoad);
    rearLoad = Math.max(0, rearLoad);

    // ---- Lateral weight transfer (turning) ----
    // Lateral transfer scales with steering input and speed.
    const speedKmh = Math.abs(state.speed || 0);
    const steerMag = Math.abs(state.steering || 0);
    const lateralAccel = (speedKmh / 3.6) * steerMag * 2.0; // approx m/s^2
    const lateralTransfer = (lateralAccel * state.mass * state.centerOfMassHeight) / (state.trackWidth / 2);
    // Direction: positive steering (right) transfers load to the left.
    const leftLoad = state.mass / 2 - Math.sign(state.steering || 0) * lateralTransfer * 0.5;
    const rightLoad = state.mass / 2 + Math.sign(state.steering || 0) * lateralTransfer * 0.5;

    // ---- Suspension compression per corner (simplified 2-corner model) ----
    // Front compression from front load; rear from rear load.
    const staticFront = state.mass * state.centerOfMass;
    const staticRear = state.mass * (1 - state.centerOfMass);
    const frontCompression = this._solveSpring(state, frontLoad - staticFront, dtSafe);
    const rearCompression = this._solveSpring(state, rearLoad - staticRear, dtSafe);

    // ---- Body roll (lateral) ----
    // Roll torque from lateral transfer, resisted by roll stiffness and damping.
    const rollTorque = lateralTransfer * (state.trackWidth / 2);
    const rollDamping = state.rollVelocity * state.rollStiffness * 0.1;
    const rollAccel = (rollTorque - rollDamping) / Math.max(1, state.mass);
    state.rollVelocity += rollAccel * dtSafe;
    state.bodyRoll = Math.max(-0.6, Math.min(0.6, state.bodyRoll + state.rollVelocity * dtSafe));

    // ---- Pitch (longitudinal) ----
    const pitchTorque = transferFrac * state.wheelbase;
    const pitchDamping = state.pitchVelocity * state.pitchStiffness * 0.1;
    const pitchAccel = (pitchTorque - pitchDamping) / Math.max(1, state.mass);
    state.pitchVelocity += pitchAccel * dtSafe;
    state.pitch = Math.max(-0.5, Math.min(0.5, state.pitch + state.pitchVelocity * dtSafe));

    // ---- Store results ----
    state.frontCompression = frontCompression;
    state.rearCompression = rearCompression;
    state.frontLoad = frontLoad;
    state.rearLoad = rearLoad;
state.leftLoad = leftLoad;
    state.rightLoad = rightLoad;
  };

  // ---- Spring solver: compression from load, damped, clamped ----
  SuspensionSystem.prototype._solveSpring = function (state, loadDelta, dt) {
    const current = state.compression || 0;
    const velocity = state.compressionVelocity || 0;
    const springForce = -state.stiffness * current;
    const dampingForce = -state.damping * velocity;
    const accel = (springForce + dampingForce + loadDelta) / Math.max(1, state.mass);
    const newVelocity = velocity + accel * dt;
    const newCompression = current + newVelocity * dt;
    const clamped = Math.max(-state.maxRebound, Math.min(state.maxCompression, newCompression));
    state.compressionVelocity = (clamped - current) / Math.max(0.001, dt);
    return clamped;
  };

  // ---- Vehicle integration helpers ----
  SuspensionSystem.prototype.ensureSuspension = function (vehicle) {
    if (!vehicle) return null;
    if (vehicle._suspension && vehicle._suspension.__owner === this) {
      return vehicle._suspension;
    }
    const state = this._createSuspension(vehicle);
    vehicle._suspension = state;
    return state;
  };

  SuspensionSystem.prototype._createSuspension = function (vehicle) {
    const defaults = vehicle && vehicle.suspensionConfig
      ? vehicle.suspensionConfig
      : DEFAULT_SUSPENSION;
    const state = {
      __owner: this,
      mass: defaults.mass || DEFAULT_SUSPENSION.mass,
      wheelbase: defaults.wheelbase || DEFAULT_SUSPENSION.wheelbase,
      trackWidth: defaults.trackWidth || DEFAULT_SUSPENSION.trackWidth,
      centerOfMass: defaults.centerOfMass || DEFAULT_SUSPENSION.centerOfMass,
      centerOfMassHeight: defaults.centerOfMassHeight || (defaults.trackWidth ? defaults.trackWidth * 0.5 : 1.2),
      stiffness: defaults.stiffness || DEFAULT_SUSPENSION.stiffness,
      damping: defaults.damping || DEFAULT_SUSPENSION.damping,
      maxCompression: defaults.maxCompression || DEFAULT_SUSPENSION.maxCompression,
      maxRebound: defaults.maxRebound || DEFAULT_SUSPENSION.maxRebound,
      rollStiffness: defaults.rollStiffness || DEFAULT_SUSPENSION.rollStiffness,
      pitchStiffness: defaults.pitchStiffness || DEFAULT_SUSPENSION.pitchStiffness,
      compression: 0,
      compressionVelocity: 0,
      frontCompression: 0,
      rearCompression: 0,
      frontLoad: (defaults.mass || 0) * (defaults.centerOfMass || 0.5),
      rearLoad: (defaults.mass || 0) * (1 - (defaults.centerOfMass || 0.5)),
      leftLoad: (defaults.mass || 0) / 2,
      rightLoad: (defaults.mass || 0) / 2,
      bodyRoll: 0,
      rollVelocity: 0,
      pitch: 0,
      pitchVelocity: 0,
      speed: (vehicle && typeof vehicle.speed === 'number') ? vehicle.speed : 0,
      prevSpeed: 0,
      targetSpeed: 0,
      steering: 0,
      roadFriction: 1.0
    };
    this._vehicles.set(vehicle.id || ('v_' + Math.random().toString(36).slice(2)), state);
    return state;
  };

  SuspensionSystem.prototype.getSuspension = function (vehicle) {
    if (!vehicle) return null;
    return vehicle._suspension || null;
  };

  SuspensionSystem.prototype.resetSuspension = function (vehicle) {
    const state = this.ensureSuspension(vehicle);
    if (!state) return;
    state.compression = 0;
    state.compressionVelocity = 0;
    state.frontCompression = 0;
    state.rearCompression = 0;
    state.bodyRoll = 0;
    state.rollVelocity = 0;
    state.pitch = 0;
    state.pitchVelocity = 0;
    state.speed = 0;
    state.prevSpeed = 0;
  };

  SuspensionSystem.prototype.serializeSuspension = function (vehicle) {
    const state = this.getSuspension(vehicle);
    if (!state) return null;
    return {
      compression: state.compression,
      frontCompression: state.frontCompression,
      rearCompression: state.rearCompression,
      bodyRoll: state.bodyRoll,
      pitch: state.pitch,
      frontLoad: state.frontLoad,
      rearLoad: state.rearLoad
    };
  };

  SuspensionSystem.prototype.deserializeSuspension = function (vehicle, data) {
    const state = this.ensureSuspension(vehicle);
    if (!state || !data) return;
    if (typeof data.compression === 'number') state.compression = data.compression;
    if (typeof data.frontCompression === 'number') state.frontCompression = data.frontCompression;
    if (typeof data.rearCompression === 'number') state.rearCompression = data.rearCompression;
    if (typeof data.bodyRoll === 'number') state.bodyRoll = data.bodyRoll;
    if (typeof data.pitch === 'number') state.pitch = data.pitch;
    if (typeof data.frontLoad === 'number') state.frontLoad = data.frontLoad;
    if (typeof data.rearLoad === 'number') state.rearLoad = data.rearLoad;
  };

  SuspensionSystem.prototype.serialize = function () {
    const data = {};
    for (const [id, state] of this._vehicles) {
      data[id] = {
        compression: state.compression,
        frontCompression: state.frontCompression,
        rearCompression: state.rearCompression,
        bodyRoll: state.bodyRoll,
        pitch: state.pitch,
        frontLoad: state.frontLoad,
        rearLoad: state.rearLoad
      };
    }
    return data;
  };

SuspensionSystem.prototype.deserialize = function (data) {
    if (!data || typeof data !== 'object') return;
    for (const [id, stateData] of Object.entries(data)) {
      let existing = this._vehicles.get(id);
      if (!existing) {
        // Create a placeholder entry so deserialized state survives even
        // when no matching vehicle was registered yet (e.g. fresh system).
        existing = {
          __owner: this,
          mass: DEFAULT_SUSPENSION.mass,
          wheelbase: DEFAULT_SUSPENSION.wheelbase,
          trackWidth: DEFAULT_SUSPENSION.trackWidth,
          centerOfMass: DEFAULT_SUSPENSION.centerOfMass,
          centerOfMassHeight: DEFAULT_SUSPENSION.trackWidth * 0.5,
          stiffness: DEFAULT_SUSPENSION.stiffness,
          damping: DEFAULT_SUSPENSION.damping,
          maxCompression: DEFAULT_SUSPENSION.maxCompression,
          maxRebound: DEFAULT_SUSPENSION.maxRebound,
          rollStiffness: DEFAULT_SUSPENSION.rollStiffness,
          pitchStiffness: DEFAULT_SUSPENSION.pitchStiffness,
          compression: 0,
          compressionVelocity: 0,
          frontCompression: 0,
          rearCompression: 0,
          frontLoad: DEFAULT_SUSPENSION.mass * DEFAULT_SUSPENSION.centerOfMass,
          rearLoad: DEFAULT_SUSPENSION.mass * (1 - DEFAULT_SUSPENSION.centerOfMass),
          leftLoad: DEFAULT_SUSPENSION.mass / 2,
          rightLoad: DEFAULT_SUSPENSION.mass / 2,
          bodyRoll: 0,
          rollVelocity: 0,
          pitch: 0,
          pitchVelocity: 0,
          speed: 0,
          prevSpeed: 0,
          targetSpeed: 0,
          steering: 0,
          roadFriction: 1.0
        };
        this._vehicles.set(id, existing);
      }
      if (typeof stateData.compression === 'number') existing.compression = stateData.compression;
      if (typeof stateData.frontCompression === 'number') existing.frontCompression = stateData.frontCompression;
      if (typeof stateData.rearCompression === 'number') existing.rearCompression = stateData.rearCompression;
      if (typeof stateData.bodyRoll === 'number') existing.bodyRoll = stateData.bodyRoll;
      if (typeof stateData.pitch === 'number') existing.pitch = stateData.pitch;
      if (typeof stateData.frontLoad === 'number') existing.frontLoad = stateData.frontLoad;
      if (typeof stateData.rearLoad === 'number') existing.rearLoad = stateData.rearLoad;
    }
  };

  SuspensionSystem.prototype.attachSuspension = function (vehicle) {
    if (!vehicle) return null;
    const state = this._vehicles.get(vehicle.id);
    if (state) {
      vehicle._suspension = state;
      return state;
    }
    return this.ensureSuspension(vehicle);
  };

  SuspensionSystem.prototype.destroy = function () {
    this._vehicles.clear();
    this._active = false;
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.SuspensionSystem = SuspensionSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = SuspensionSystem;
  }
})();
