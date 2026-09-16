/**
 * Bus Simulator - Road Surface System (Phase 10B Task 12)
 *
 * ONE authoritative owner of road-surface data.
 *
 * Responsibilities:
 *   - surface properties: gripMultiplier, rollingResistance,
 *     tireWearMultiplier, suspensionRoughness, brakingGripMultiplier
 *   - surfaces: asphalt, concrete, gravel, dirt, mud, wetAsphalt, roughRoad
 *   - query methods: getSurface(name), getEffectiveGrip(...),
 *     getRollingResistance(...), getTireWearMultiplier(...),
 *     getSuspensionRoughness(...)
 *
 * Does NOT directly apply acceleration, braking, steering, suspension
 * movement, tire wear, or fuel consumption. It only exposes surface
 * properties that other systems consult. Weather remains authoritative
 * for weather friction; final effective grip combines road surface +
 * existing weather friction + tire grip.
 */

(function () {
  'use strict';

  const DEFAULT_SURFACE = {
    asphalt: {
      gripMultiplier: 1.0,
      rollingResistance: 0.012,
      tireWearMultiplier: 1.0,
      suspensionRoughness: 0.0,
      brakingGripMultiplier: 1.0
    },
    concrete: {
      gripMultiplier: 0.98,
      rollingResistance: 0.010,
      tireWearMultiplier: 0.9,
      suspensionRoughness: 0.05,
      brakingGripMultiplier: 0.98
    },
    gravel: {
      gripMultiplier: 0.62,
      rollingResistance: 0.045,
      tireWearMultiplier: 2.2,
      suspensionRoughness: 0.6,
      brakingGripMultiplier: 0.55
    },
    dirt: {
      gripMultiplier: 0.72,
      rollingResistance: 0.030,
      tireWearMultiplier: 1.6,
      suspensionRoughness: 0.4,
      brakingGripMultiplier: 0.68
    },
    mud: {
      gripMultiplier: 0.42,
      rollingResistance: 0.065,
      tireWearMultiplier: 3.0,
      suspensionRoughness: 0.8,
      brakingGripMultiplier: 0.38
    },
    wetAsphalt: {
      gripMultiplier: 0.82,
      rollingResistance: 0.014,
      tireWearMultiplier: 1.15,
      suspensionRoughness: 0.0,
      brakingGripMultiplier: 0.80
    },
    roughRoad: {
      gripMultiplier: 0.78,
      rollingResistance: 0.022,
      tireWearMultiplier: 1.4,
      suspensionRoughness: 0.5,
      brakingGripMultiplier: 0.75
    }
  };

  function RoadSurfaceSystem() {
    this._modules = null;
    this._active = true;
    this._surfaceCache = new Map();
  }

  RoadSurfaceSystem.prototype.init = function (modules) {
    this._modules = modules;
    this._active = true;
    this._surfaceCache = new Map();
  };

  RoadSurfaceSystem.prototype.update = function (dt) {
    // Road surface data is static; no per-frame updates required.
    // This method exists for symmetry with other systems.
    if (!this._active) return;
  };

  // ---- Surface queries ----

  RoadSurfaceSystem.prototype.getSurface = function (name) {
    // Case-insensitive lookup that preserves camelCase keys.
    // "wetAsphalt", "WETASPHALT", and "wetasphalt" must all resolve to
    // the wetAsphalt surface rather than falling back to asphalt.
    if (typeof name !== 'string') name = 'asphalt';
    const cached = this._surfaceCache.get(name);
    if (cached) return cached;
    let surface = DEFAULT_SURFACE[name];
    if (!surface) {
      const lower = name.toLowerCase();
      for (const key in DEFAULT_SURFACE) {
        if (key.toLowerCase() === lower) {
          surface = DEFAULT_SURFACE[key];
          break;
        }
      }
    }
    if (!surface) surface = DEFAULT_SURFACE.asphalt;
    this._surfaceCache.set(name, surface);
    return surface;
  };

  RoadSurfaceSystem.prototype.getSurfaceNames = function () {
    return Object.keys(DEFAULT_SURFACE);
  };

  // ---- Effective grip ----
  // Final grip = road surface grip * weather friction * tire grip.
  // Weather remains authoritative for weather friction; TireSystem
  // remains authoritative for tire grip. RoadSurfaceSystem only owns
  // the road-surface component.
  RoadSurfaceSystem.prototype.getEffectiveGrip = function (roadSurface, weatherFriction, tireGrip) {
    const surface = this.getSurface(roadSurface);
    const wf = (typeof weatherFriction === 'number') ? weatherFriction : 1.0;
    const tg = (typeof tireGrip === 'number') ? tireGrip : 1.0;
    const grip = surface.gripMultiplier * wf * tg;
    return Math.max(0.05, Math.min(1.0, grip));
  };

  RoadSurfaceSystem.prototype.getRollingResistance = function (roadSurface) {
    const surface = this.getSurface(roadSurface);
    return (typeof surface.rollingResistance === 'number') ? surface.rollingResistance : DEFAULT_SURFACE.asphalt.rollingResistance;
  };

  RoadSurfaceSystem.prototype.getTireWearMultiplier = function (roadSurface) {
    const surface = this.getSurface(roadSurface);
    return (typeof surface.tireWearMultiplier === 'number') ? surface.tireWearMultiplier : DEFAULT_SURFACE.asphalt.tireWearMultiplier;
  };

  RoadSurfaceSystem.prototype.getSuspensionRoughness = function (roadSurface) {
    const surface = this.getSurface(roadSurface);
    return (typeof surface.suspensionRoughness === 'number') ? surface.suspensionRoughness : DEFAULT_SURFACE.asphalt.suspensionRoughness;
  };

  RoadSurfaceSystem.prototype.getBrakingGripMultiplier = function (roadSurface) {
    const surface = this.getSurface(roadSurface);
    return (typeof surface.brakingGripMultiplier === 'number') ? surface.brakingGripMultiplier : DEFAULT_SURFACE.asphalt.brakingGripMultiplier;
  };

  // ---- Vehicle integration ----
  // MovementSystem calls this before the physics step so the active bus
  // has current road-surface properties for grip/wear/rolling-resistance
  // gates. RoadSurfaceSystem never writes movement physics.
  RoadSurfaceSystem.prototype.updateVehicle = function (vehicle, dt) {
    if (!vehicle) return;
    // Determine the road surface the vehicle is currently on.
    // If the vehicle already carries a roadSurface field (e.g. set by
    // RoadSystem/Map), reuse it; otherwise default to asphalt.
    const surfaceName = (typeof vehicle.roadSurface === 'string') ? vehicle.roadSurface : 'asphalt';
    const surface = this.getSurface(surfaceName);
    vehicle._roadSurface = surface;
    vehicle._roadSurfaceName = surfaceName;
  };

  RoadSurfaceSystem.prototype.getVehicleSurface = function (vehicle) {
    if (!vehicle) return DEFAULT_SURFACE.asphalt;
    return vehicle._roadSurface || this.getSurface(vehicle.roadSurface || 'asphalt');
  };

  RoadSurfaceSystem.prototype.getVehicleSurfaceName = function (vehicle) {
    if (!vehicle) return 'asphalt';
    return vehicle._roadSurfaceName || vehicle.roadSurface || 'asphalt';
  };

  // ---- Save/load ----
  // Road surface data is static configuration; no per-vehicle transient
  // state needs to be persisted. This API exists for symmetry and to
  // support future dynamic surface changes.
  RoadSurfaceSystem.prototype.serialize = function () {
    return {};
  };

  RoadSurfaceSystem.prototype.deserialize = function (data) {
    // Static configuration; nothing to restore.
    if (!data || typeof data !== 'object') return;
  };

  RoadSurfaceSystem.prototype.destroy = function () {
    this._active = false;
    this._surfaceCache.clear();
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.RoadSurfaceSystem = RoadSurfaceSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = RoadSurfaceSystem;
  }
})();