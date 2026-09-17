/**
 * Bus Simulator - Lane System (Phase 10B Task 18)
 *
 * ONE centralized owner of vehicle lane state.
 *
 * Responsibilities:
 *   - assign each vehicle to a valid lane index on its current road
 *   - smooth lane changes (never teleport vehicles)
 *   - clamp lane indexes to the current road's lane count
 *   - expose getLane() / assignLane() / changeLane()
 *   - provide lane-center targets for AI road-following
 *
 * Does NOT duplicate:
 *   - steering forces (SteeringSystem remains authoritative)
 *   - braking forces (BrakeSystem remains authoritative)
 *   - acceleration / movement physics
 *   - traffic-signal phase timing
 *   - road-surface data
 *
 * LaneSystem only owns lane INDEX state and lane-change state.
 * It never writes vehicle.x, vehicle.y, vehicle.angle, vehicle.speed,
 * or vehicle.steer/brake directly.
 */

(function () {
  'use strict';

  // South Indian / Indian driving convention: drive on the LEFT side.
  // Lane 0 is the leftmost lane; lane N-1 is the rightmost.
  const DEFAULT_PREFERENCE = 'left';

  function LaneSystem() {
    this._modules = null;
    this._active = true;
    this._vehicles = new Map(); // vehicleId -> lane state
    this._laneChangeTimer = new Map(); // vehicleId -> progress 0..1
  }

  LaneSystem.prototype.init = function (modules) {
    this._modules = modules;
    this._active = true;
    this._vehicles = new Map();
    this._laneChangeTimer = new Map();
  };

  LaneSystem.prototype._getCfg = function () {
    const cfg = (this._modules && this._modules.TrafficConfig)
      ? this._modules.TrafficConfig
      : (typeof TrafficConfig !== 'undefined' ? TrafficConfig : null);
    return (cfg && cfg.lanes) ? cfg.lanes : {};
  };

  LaneSystem.prototype._getVehicleId = function (vehicle) {
    if (!vehicle) return null;
    return vehicle.id || (vehicle._laneSystemId = (vehicle._laneSystemId || ('lsv_' + Math.random().toString(36).slice(2, 8))));
  };

  LaneSystem.prototype._getState = function (vehicle) {
    const id = this._getVehicleId(vehicle);
    if (!id) return null;
    let state = this._vehicles.get(id);
    if (!state) {
      state = {
        id: id,
        laneIndex: 0,
        targetLaneIndex: 0,
        laneChangeProgress: 0,
        lanePreference: DEFAULT_PREFERENCE,
        changing: false
      };
      this._vehicles.set(id, state);
    }
    return state;
  };

  LaneSystem.prototype._clampLane = function (laneIndex, laneCount) {
    if (!laneCount || laneCount < 1) return 0;
    let n = typeof laneIndex === 'number' ? laneIndex : 0;
    if (!isFinite(n)) n = 0;
    n = Math.floor(n);
    if (n < 0) n = 0;
    if (n >= laneCount) n = laneCount - 1;
    return n;
  };

  LaneSystem.prototype.assignLane = function (vehicle, road) {
    if (!vehicle || !road) return null;
    const laneCount = road.lanes || 1;
    if (laneCount < 1) return null;

    const state = this._getState(vehicle);
    const cfg = this._getCfg();
    const pref = cfg.defaultLanePreference || DEFAULT_PREFERENCE;

    // Respect per-vehicle lane preference when set (e.g. 'left'/'right').
    const vehiclePref = vehicle.lanePreference;
    let effectivePref = pref;
    if (vehiclePref === 'left' || vehiclePref === 'right' || vehiclePref === 'center') {
      effectivePref = vehiclePref;
    } else if (vehiclePref === 'any') {
      effectivePref = pref;
    }

    // Left-side driving: default to lane 0 (leftmost).
    let preferred = 0;
    if (effectivePref === 'right' && laneCount > 1) {
      preferred = laneCount - 1;
    } else if (effectivePref === 'center' && laneCount > 1) {
      preferred = Math.floor(laneCount / 2);
    }

    state.laneIndex = this._clampLane(preferred, laneCount);
    state.targetLaneIndex = state.laneIndex;
    state.lanePreference = effectivePref;
    state.laneChangeProgress = 0;
    state.changing = false;
    return state;
  };

  // Phase 10B Task 18: safe occupied-lane check before a lane change.
  // Returns true when it is safe to move into targetLane on road.
  LaneSystem.prototype.canChangeLane = function (vehicle, targetLane, road, otherVehicles) {
    if (!vehicle || !road) return false;
    const laneCount = road.lanes || 1;
    const clamped = this._clampLane(targetLane, laneCount);
    if (clamped === this.getLane(vehicle)) return true;

    const cfg = this._getCfg();
    const safeDist = (typeof cfg.safeLaneChangeDistance === 'number' && cfg.safeLaneChangeDistance > 0)
      ? cfg.safeLaneChangeDistance : 25;

    if (!otherVehicles) return true;
    const targetCenter = road.getLaneCenter(clamped, vehicle._aiTravelDirection || 1, 0.5);
    if (!targetCenter) return true;

    for (let i = 0; i < otherVehicles.length; i++) {
      const other = otherVehicles[i];
      if (other === vehicle) continue;
      if (!other || !other.active) continue;
      // Only consider vehicles on the same road.
      if (other._aiRoad && road && other._aiRoad.id === road.id) {
        const dx = other.x - targetCenter.x;
        const dy = other.y - targetCenter.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < safeDist + (other.length || 4)) return false;
      }
    }
    return true;
  };

  LaneSystem.prototype.changeLane = function (vehicle, targetLane, road) {
    if (!vehicle) return false;
    const state = this._getState(vehicle);
    const laneCount = road ? (road.lanes || 1) : 1;
    const clamped = this._clampLane(targetLane, laneCount);

    if (clamped === state.laneIndex) {
      state.changing = false;
      state.laneChangeProgress = 0;
      state.targetLaneIndex = clamped;
      return true;
    }

    state.targetLaneIndex = clamped;
    state.changing = true;
    state.laneChangeProgress = 0;
    return true;
  };

  // Phase 10B Task 18: wrong-way prevention.
  // With left-side driving, lane 0 is the leftmost. A vehicle travelling
  // in the road's forward direction should never be assigned to the
  // rightmost lane unless overtaking is explicitly enabled and safe.
  LaneSystem.prototype.isWrongWay = function (vehicle, road) {
    if (!vehicle || !road) return false;
    const laneCount = road.lanes || 1;
    if (laneCount < 2) return false;
    const state = this._getState(vehicle);
    const dir = vehicle._aiTravelDirection || 1;
    // Forward direction with left-side driving: lane 0 is correct.
    // Reverse direction: the opposite side is correct.
    if (dir === 1) {
      return state.laneIndex > 0;
    } else {
      return state.laneIndex < laneCount - 1;
    }
  };

  LaneSystem.prototype.correctWrongWay = function (vehicle, road) {
    if (!vehicle || !road) return false;
    if (!this.isWrongWay(vehicle, road)) return false;
    const laneCount = road.lanes || 1;
    const dir = vehicle._aiTravelDirection || 1;
    const target = (dir === 1) ? 0 : (laneCount - 1);
    return this.changeLane(vehicle, target, road);
  };

  // Phase 10B Task 18: simple safe overtaking decision.
  // Returns the target lane index to move into, or null if no safe
  // overtaking move is available. Never switches lanes randomly.
  LaneSystem.prototype.considerOvertaking = function (vehicle, road, otherVehicles, vehicleAhead) {
    if (!vehicle || !road) return null;
    const cfg = this._getCfg();
    if (cfg.overtakingEnabled === false) return null;
    const laneCount = road.lanes || 1;
    if (laneCount < 2) return null;

    const currentLane = this.getLane(vehicle);
    if (currentLane === null) return null;

    // Only overtake when there is a slower vehicle ahead in our lane.
    if (!vehicleAhead) return null;
    if (vehicleAhead.speed >= vehicle.speed) return null;

    // Try the adjacent lane in the direction of travel.
    // Left-side driving: overtake on the right (lane+1).
    const candidates = [];
    if (currentLane + 1 < laneCount) candidates.push(currentLane + 1);
    if (currentLane - 1 >= 0) candidates.push(currentLane - 1);

    for (let i = 0; i < candidates.length; i++) {
      const target = candidates[i];
      if (this.canChangeLane(vehicle, target, road, otherVehicles)) {
        return target;
      }
    }
    return null;
  };

  LaneSystem.prototype.getLane = function (vehicle) {
    const state = this._getState(vehicle);
    return state ? state.laneIndex : null;
  };

  LaneSystem.prototype.getLaneState = function (vehicle) {
    return this._getState(vehicle);
  };

  LaneSystem.prototype.isChangingLane = function (vehicle) {
    const state = this._getState(vehicle);
    return !!(state && state.changing);
  };

  LaneSystem.prototype.update = function (dt) {
    if (!this._active) return;
    const cfg = this._getCfg();
    // Master toggle — when lanes.enabled is false the system does not
    // advance lane changes. This keeps disabled state deterministic and
    // backward-compatible with saves that predate the toggle.
    if (cfg.enabled === false) return;
    const speed = typeof cfg.laneChangeSpeed === 'number' && cfg.laneChangeSpeed > 0
      ? cfg.laneChangeSpeed : 1.0;
    const safeDt = dt > 0 ? dt : 0.016;

    for (const [, state] of this._vehicles) {
      if (!state.changing) continue;
      state.laneChangeProgress += speed * safeDt;
      if (state.laneChangeProgress >= 1) {
        state.laneChangeProgress = 1;
        state.laneIndex = state.targetLaneIndex;
        state.changing = false;
      }
    }
  };

  // ---- Query helpers ----

  LaneSystem.prototype.getInterpolatedLane = function (vehicle) {
    const state = this._getState(vehicle);
    if (!state) return 0;
    if (!state.changing) return state.laneIndex;
    const p = Math.max(0, Math.min(1, state.laneChangeProgress || 0));
    return state.laneIndex + (state.targetLaneIndex - state.laneIndex) * p;
  };

  LaneSystem.prototype.reset = function (vehicle) {
    const state = this._getState(vehicle);
    if (!state) return;
    state.laneIndex = 0;
    state.targetLaneIndex = 0;
    state.laneChangeProgress = 0;
    state.changing = false;
  };

  LaneSystem.prototype.destroy = function () {
    this._active = false;
    this._modules = null;
    this._vehicles.clear();
    this._laneChangeTimer.clear();
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.LaneSystem = LaneSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = LaneSystem;
  }
})();