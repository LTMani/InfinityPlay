/**
 * Bus Simulator - Door System (Phase 10B Task 16)
 *
 * ONE authoritative owner of passenger/driver door state.
 *
 * Responsibilities:
 *   - front passenger door
 *   - rear passenger door
 *   - driver door (where supported)
 *   - open/closed state and opening/closing progress
 *   - movement safety lock (doors lock while moving)
 *   - obstruction/safety state
 *   - configurable operation speed
 *
 * Does NOT duplicate boarding/alighting logic, acceleration, braking,
 * steering, fuel, engine temperature, or air-brake pressure.
 * BoardingSystem and DropOffSystem remain the sole owners of the
 * passenger boarding/alighting process; DoorSystem only exposes the
 * door-open gate they consult.
 */

(function () {
  'use strict';

  const DEFAULT_DOOR = {
    openSpeed: 1.6,
    closeSpeed: 2.0,
    safeSpeedThreshold: 3.0,
    frontDoor: { open: false, opening: false, progress: 0, obstructed: false },
    rearDoor: { open: false, opening: false, progress: 0, obstructed: false },
driverDoor: { open: false, opening: false, progress: 0, obstructed: false, enabled: false }
  };

  // Deep clone a door template so each vehicle gets its own independent
  // door state instead of sharing the DEFAULT_DOOR object.
  function cloneDoor(template) {
    return {
      open: !!template.open,
      opening: !!template.opening,
      progress: typeof template.progress === 'number' ? template.progress : 0,
      obstructed: !!template.obstructed,
      enabled: !!template.enabled
    };
  }

  function DoorSystem() {
    this._modules = null;
    this._active = true;
    this._vehicles = new Map();
  }

  DoorSystem.prototype.init = function (modules) {
    this._modules = modules;
    this._active = true;
    this._vehicles = new Map();
  };

  DoorSystem.prototype.update = function (dt) {
    if (!this._active) return;
    for (const [, state] of this._vehicles) {
      this._updateDoor(state, dt);
    }
  };

  // MovementSystem calls this once per frame before the physics step.
  // DoorSystem never writes acceleration, braking, or steering.
  DoorSystem.prototype.updateVehicle = function (vehicle, dt) {
    if (!vehicle) return;
    const state = this.ensureDoors(vehicle);
    if (!state) return;
    state.speed = typeof vehicle.speed === 'number' ? vehicle.speed : 0;
    // Snapshot input actions (no input mapping duplicated).
    state.frontInput = !!vehicle._doorFront;
    state.rearInput = !!vehicle._doorRear;
    state.driverInput = !!vehicle._doorDriver;
    this._updateDoor(state, dt);
  };

  DoorSystem.prototype._updateDoor = function (state, dt) {
    if (!state) return;
    const dtSafe = dt > 0 ? dt : 0.016;
    const speed = Math.abs(state.speed || 0);
    const moving = speed >= state.safeSpeedThreshold;

    // Movement safety lock: doors auto-close while the bus is moving.
if (moving) {
      for (const key of ['frontDoor', 'rearDoor', 'driverDoor']) {
        const door = state.doors[key];
        if (!door) continue;
        if (door.open) door.opening = false;
        if (door.progress > 0) {
          door.progress = Math.max(0, door.progress - state.closeSpeed * dtSafe);
        }
        if (door.progress <= 0) {
          door.open = false;
          door.progress = 0;
        }
      }
      return;
    }

    this._processDoor(state.doors.frontDoor, state.frontInput, state.openSpeed, state.closeSpeed, dtSafe);
    this._processDoor(state.doors.rearDoor, state.rearInput, state.openSpeed, state.closeSpeed, dtSafe);
    if (state.doors.driverDoor && state.doors.driverDoor.enabled) {
      this._processDoor(state.doors.driverDoor, state.driverInput, state.openSpeed, state.closeSpeed, dtSafe);
    }
  };

  DoorSystem.prototype._processDoor = function (door, wantOpen, openSpeed, closeSpeed, dt) {
    if (!door) return;
    // Obstructed door cannot open and must not report fully closed.
    if (door.obstructed) {
      door.opening = false;
      if (door.progress > 0) {
        door.progress = Math.max(0, door.progress - closeSpeed * dt);
        if (door.progress <= 0) door.open = false;
      }
      return;
    }
    if (wantOpen) {
      door.opening = true;
      door.progress = Math.min(1, door.progress + openSpeed * dt);
      if (door.progress >= 1) {
        door.open = true;
        door.opening = false;
        door.progress = 1;
      }
    } else {
      door.opening = false;
      door.progress = Math.max(0, door.progress - closeSpeed * dt);
      if (door.progress <= 0) {
        door.open = false;
        door.progress = 0;
      }
    }
  };

  // ---- Query methods ----

  DoorSystem.prototype.getDoor = function (vehicle, doorName) {
    const state = this._getVehicleState(vehicle);
    if (!state || !state.doors[doorName]) return null;
    return state.doors[doorName];
  };

  DoorSystem.prototype.isDoorOpen = function (vehicle, doorName) {
    const door = this.getDoor(vehicle, doorName);
    return door ? door.open : false;
  };

  DoorSystem.prototype.isDoorClosed = function (vehicle, doorName) {
    const door = this.getDoor(vehicle, doorName);
    return door ? !door.open && !door.opening : true;
  };

  DoorSystem.prototype.canBoard = function (vehicle) {
    // Boarding allowed only when a passenger door is open.
    const state = this._getVehicleState(vehicle);
    if (!state) return false;
    return state.doors.frontDoor.open || state.doors.rearDoor.open;
  };

  DoorSystem.prototype.canAlight = function (vehicle) {
    return this.canBoard(vehicle);
  };

  DoorSystem.prototype.getState = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    if (!state) return null;
    const result = {};
    for (const key of ['frontDoor', 'rearDoor', 'driverDoor']) {
      const d = state.doors[key];
      if (d) {
        result[key] = {
          open: d.open,
          opening: d.opening,
          progress: d.progress,
          obstructed: d.obstructed,
          enabled: d.enabled
        };
      }
    }
    return result;
  };

  DoorSystem.prototype.setState = function (vehicle, stateData) {
    const state = this.ensureDoors(vehicle);
    if (!state || !stateData) return;
    for (const key of ['frontDoor', 'rearDoor', 'driverDoor']) {
      const d = stateData.doors ? stateData.doors[key] : stateData[key];
      if (d && state.doors[key]) {
        const door = state.doors[key];
        if (typeof d.open === 'boolean') door.open = d.open;
        if (typeof d.opening === 'boolean') door.opening = d.opening;
        if (typeof d.progress === 'number') door.progress = Math.max(0, Math.min(1, d.progress));
        if (typeof d.obstructed === 'boolean') door.obstructed = d.obstructed;
        if (typeof d.enabled === 'boolean') door.enabled = d.enabled;
      }
    }
  };

  DoorSystem.prototype.reset = function (vehicle) {
    const state = this.ensureDoors(vehicle);
    if (!state) return;
    for (const key of ['frontDoor', 'rearDoor', 'driverDoor']) {
      const door = state.doors[key];
      if (door) {
        door.open = false;
        door.opening = false;
        door.progress = 0;
        door.obstructed = false;
      }
    }
    state.speed = 0;
    state.frontInput = false;
    state.rearInput = false;
    state.driverInput = false;
  };

  DoorSystem.prototype._getVehicleState = function (vehicle) {
    if (!vehicle) return null;
    return vehicle._doors && vehicle._doors.__owner === this
      ? vehicle._doors : null;
  };

  // ---- Vehicle integration helpers ----
  DoorSystem.prototype.ensureDoors = function (vehicle) {
    if (!vehicle) return null;
    if (vehicle._doors && vehicle._doors.__owner === this) {
      return vehicle._doors;
    }
    const state = this._createDoors(vehicle);
    vehicle._doors = state;
    return state;
  };

  DoorSystem.prototype._createDoors = function (vehicle) {
    const cfg = vehicle && vehicle.doorConfig ? vehicle.doorConfig : {};
    const state = {
      __owner: this,
      openSpeed: cfg.openSpeed || DEFAULT_DOOR.openSpeed,
      closeSpeed: cfg.closeSpeed || DEFAULT_DOOR.closeSpeed,
      safeSpeedThreshold: cfg.safeSpeedThreshold || DEFAULT_DOOR.safeSpeedThreshold,
      speed: 0,
      frontInput: false,
      rearInput: false,
      driverInput: false,
      doors: {
        frontDoor: Object.assign(
          cloneDoor(DEFAULT_DOOR.frontDoor),
          cfg.frontDoor || {}
        ),
        rearDoor: Object.assign(
          cloneDoor(DEFAULT_DOOR.rearDoor),
          cfg.rearDoor || {}
        ),
        driverDoor: Object.assign(
          cloneDoor(DEFAULT_DOOR.driverDoor),
          cfg.driverDoor || {}
        )
      }
    };
    this._vehicles.set(vehicle.id || ('v_' + Math.random().toString(36).slice(2)), state);
    return state;
  };

  DoorSystem.prototype.attachDoors = function (vehicle) {
    if (!vehicle) return null;
    const state = this._vehicles.get(vehicle.id);
    if (state) {
      vehicle._doors = state;
      return state;
    }
    return this.ensureDoors(vehicle);
  };

  // ---- Save/load ----
  DoorSystem.prototype.serializeDoors = function (vehicle) {
    const state = this._getVehicleState(vehicle);
    if (!state) return null;
    const result = {};
    for (const key of ['frontDoor', 'rearDoor', 'driverDoor']) {
      const d = state.doors[key];
      if (d) {
        result[key] = {
          open: d.open,
          opening: d.opening,
          progress: d.progress,
          obstructed: d.obstructed,
          enabled: d.enabled
        };
      }
    }
    return result;
  };

  DoorSystem.prototype.deserializeDoors = function (vehicle, data) {
    const state = this.ensureDoors(vehicle);
    if (!state || !data) return;
    for (const key of ['frontDoor', 'rearDoor', 'driverDoor']) {
      const d = data[key];
      const door = state.doors[key];
      if (d && door) {
        if (typeof d.open === 'boolean') door.open = d.open;
        if (typeof d.opening === 'boolean') door.opening = d.opening;
        if (typeof d.progress === 'number') door.progress = Math.max(0, Math.min(1, d.progress));
        if (typeof d.obstructed === 'boolean') door.obstructed = d.obstructed;
        if (typeof d.enabled === 'boolean') door.enabled = d.enabled;
      }
    }
  };

  DoorSystem.prototype.serialize = function () {
    const data = {};
    for (const [id, state] of this._vehicles) {
      const result = {};
      for (const key of ['frontDoor', 'rearDoor', 'driverDoor']) {
        const d = state.doors[key];
        if (d) {
          result[key] = {
            open: d.open,
            opening: d.opening,
            progress: d.progress,
            obstructed: d.obstructed,
            enabled: d.enabled
          };
        }
      }
      data[id] = result;
    }
    return data;
  };

  DoorSystem.prototype.deserialize = function (data) {
    if (!data || typeof data !== 'object') return;
    for (const [id, stateData] of Object.entries(data)) {
      let existing = this._vehicles.get(id);
      if (!existing) {
        existing = {
          __owner: this,
          openSpeed: DEFAULT_DOOR.openSpeed,
          closeSpeed: DEFAULT_DOOR.closeSpeed,
          safeSpeedThreshold: DEFAULT_DOOR.safeSpeedThreshold,
          speed: 0,
          frontInput: false,
          rearInput: false,
          driverInput: false,
          doors: {
            frontDoor: cloneDoor(DEFAULT_DOOR.frontDoor),
            rearDoor: cloneDoor(DEFAULT_DOOR.rearDoor),
            driverDoor: cloneDoor(DEFAULT_DOOR.driverDoor)
          }
        };
        this._vehicles.set(id, existing);
      }
      for (const key of ['frontDoor', 'rearDoor', 'driverDoor']) {
        const d = stateData[key];
        const door = existing.doors[key];
        if (d && door) {
          if (typeof d.open === 'boolean') door.open = d.open;
          if (typeof d.opening === 'boolean') door.opening = d.opening;
          if (typeof d.progress === 'number') door.progress = Math.max(0, Math.min(1, d.progress));
          if (typeof d.obstructed === 'boolean') door.obstructed = d.obstructed;
          if (typeof d.enabled === 'boolean') door.enabled = d.enabled;
        }
      }
    }
  };

  DoorSystem.prototype.destroy = function () {
    this._active = false;
    this._vehicles.clear();
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.DoorSystem = DoorSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = DoorSystem;
  }
})();
