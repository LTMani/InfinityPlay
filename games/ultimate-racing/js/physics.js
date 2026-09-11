/**
 * InfinityPlay Ultimate Racing - Arcade Driving Physics Engine
 * Handles acceleration, drag, speed-sensitive steering, drift dynamics, and nitro
 */

(function() {
  class PhysicsEngine {
    constructor() {
      // Base physical constants
      this.GRAVITY = 9.8;
      this.ROAD_FRICTION = 0.985;
      this.OFFROAD_FRICTION = 0.88;
      this.AERO_DRAG = 0.0015;
    }

    /**
     * Computes the upgraded stats of a car given its base specs and parts levels (1-5)
     */
    computeCarStats(carData, upgrades = {}) {
      const u = upgrades || { engine: 1, turbo: 1, brakes: 1, handling: 1, nitro: 1 };

      // Multipliers: level 1 is 1.0, level 5 is ~1.30
      const engineMult = 1 + (u.engine - 1) * 0.07;
      const turboMult = 1 + (u.turbo - 1) * 0.075;
      const brakesMult = 1 + (u.brakes - 1) * 0.08;
      const handlingMult = 1 + (u.handling - 1) * 0.06;
      const nitroMult = 1 + (u.nitro - 1) * 0.09;

      const baseTopSpeed = carData.stats.topSpeed; // km/h (e.g. 240)
      const baseAccel = carData.stats.acceleration; // e.g. 7.5
      const baseHandling = carData.stats.handling;   // e.g. 8.0
      const baseBraking = carData.stats.braking;     // e.g. 7.5
      const baseNitro = carData.stats.nitro;         // e.g. 7.0

      // Map km/h to internal world units per second (segment length = 200 units)
      // 300 km/h ~ 12,000 units/s
      const maxSpeedUnits = (baseTopSpeed * engineMult) * 40;
      const maxNitroSpeedUnits = maxSpeedUnits * (1.18 + (nitroMult - 1) * 0.1);

      return {
        maxSpeed: maxSpeedUnits,
        maxNitroSpeed: maxNitroSpeedUnits,
        accelRate: baseAccel * turboMult * 920,
        brakeRate: baseBraking * brakesMult * 2200,
        steerRate: (baseHandling / 7.5) * handlingMult * 1.85,
        nitroBurnRate: 32 / (0.8 + nitroMult * 0.2), // percent per sec
        nitroRegenRate: 14 * (0.8 + nitroMult * 0.2), // percent per sec
        displayTopSpeedKmH: Math.round(baseTopSpeed * engineMult)
      };
    }

    /**
     * Updates player physical state for one frame
     */
    updatePlayerPhysics(player, input, currentSegment, dt, sensitivity = 1.0) {
      const stats = player.effectiveStats;
      if (!stats) return;

      // 1. Check Nitro Activation
      const wantsNitro = input.isActionActive('nitro');
      if (wantsNitro && player.nitroMeter > 5 && player.speed > 500) {
        player.isNitroActive = true;
        player.nitroMeter = Math.max(0, player.nitroMeter - stats.nitroBurnRate * dt);
        player.nitroBurnCount += dt;
      } else {
        player.isNitroActive = false;
        // Passive regen when not boosting
        player.nitroMeter = Math.min(100, player.nitroMeter + stats.nitroRegenRate * dt);
      }

      // 2. Throttle & Acceleration
      const throttle = input.getThrottleAxis();
      const currentMax = player.isNitroActive ? stats.maxNitroSpeed : stats.maxSpeed;

      if (throttle > 0) {
        const boostMultiplier = player.isNitroActive ? 1.6 : 1.0;
        player.speed += stats.accelRate * boostMultiplier * dt;
        if (player.speed > currentMax) {
          player.speed = Math.max(currentMax, player.speed - 800 * dt);
        }
      } else if (throttle < 0) {
        // Braking / Reverse
        if (player.speed > 0) {
          player.speed -= stats.brakeRate * dt;
          if (player.speed < 0) player.speed = 0;
        } else {
          // Controlled slow reverse
          player.speed = Math.max(-stats.maxSpeed * 0.25, player.speed - stats.accelRate * 0.4 * dt);
        }
      } else {
        // Natural deceleration / rolling resistance
        player.speed *= Math.pow(this.ROAD_FRICTION, dt * 60);
        if (Math.abs(player.speed) < 20) player.speed = 0;
      }

      // 3. Off-road penalty check (x is in [-1, 1] on road, outside is off-road)
      const isOffRoad = Math.abs(player.x) > 1.05;
      player.isOffRoad = isOffRoad;
      if (isOffRoad) {
        player.speed *= Math.pow(this.OFFROAD_FRICTION, dt * 60);
      }

      // 4. Centrifugal force from track curve (Balanced so player steering can comfortably take the apex)
      const speedRatio = Math.abs(player.speed) / stats.maxSpeed;
      const isIce = Boolean(currentSegment && currentSegment.isIce);
      if (currentSegment && currentSegment.curve) {
        const iceMultiplier = isIce ? 1.32 : 1.0;
        const centrifugal = currentSegment.curve * (speedRatio * speedRatio) * 0.65 * iceMultiplier * dt;
        player.x -= centrifugal;
      }

      // 5. Steering Dynamics (Speed-sensitive, responsive at all speeds)
      const steerInput = input.getSteerAxis();
      const iceHandlingMod = isIce ? 0.80 : 1.0;
      // Agile at all speeds: responsive turn-in whether stationary, cruising, or high speed
      const speedSteerFactor = (player.speed === 0 
        ? 0.75 
        : Math.max(0.60, 1.10 - speedRatio * 0.35)) * iceHandlingMod;

      // Dynamic visual steering yaw angle for rendering feedback
      const targetSteerAngle = steerInput * 0.14;
      player.steeringAngle = (player.steeringAngle || 0) * 0.80 + targetSteerAngle * 0.20;

      // 6. Drift Dynamics (Space + Steer or hard turns on ice)
      const wantsDrift = (input.isActionActive('drift') || (isIce && Math.abs(steerInput) > 0.7 && speedRatio > 0.45)) &&
        Math.abs(steerInput) > 0 &&
        (speedRatio > 0.12 || Math.abs(player.speed) > 800 || (player.isDrifting && Math.abs(player.speed) > 400));
      if (wantsDrift) {
        player.isDrifting = true;
        player.driftDuration += dt;
        // Lateral slide boost
        const driftLateralForce = steerInput * stats.steerRate * 1.55 * speedSteerFactor * sensitivity * dt;
        player.x += driftLateralForce;
        // Visual tilt angle smoothly ramps
        player.driftAngle = player.driftAngle * 0.82 + (steerInput * 0.45) * 0.18;
        // Accumulate drift points
        const pointsThisTick = Math.round(180 * Math.max(0.1, speedRatio) * (1 + player.driftDuration * 1.2));
        player.currentDriftScore += pointsThisTick;
        player.totalDriftScore += pointsThisTick;
      } else {
        if (player.isDrifting) {
          // Exited drift: record drift score
          if (player.currentDriftScore > player.bestSingleDrift) {
            player.bestSingleDrift = player.currentDriftScore;
          }
          player.currentDriftScore = 0;
          player.driftDuration = 0;
        }
        player.isDrifting = false;
        player.driftAngle *= 0.80; // restore orientation

        // Standard responsive steering
        const standardLateralForce = steerInput * stats.steerRate * speedSteerFactor * sensitivity * dt;
        player.x += standardLateralForce;

        // Subtle self-stabilization when driving straight
        if (steerInput === 0 && Math.abs(player.x) > 0.02) {
          player.x *= (1 - 0.12 * dt);
        }
      }

      // 7. Strict Physical Road Boundary Enforcement
      // Road half-width is normalized to 1.0 (asphalt edge), curb + shoulder up to 1.08 (guardrail barrier).
      // Considering vehicle half-width (~0.18), the vehicle center is physically clamped to 0.90.
      // At +/-0.90, the outer wheels contact the curb/shoulder right against the guardrail.
      const MAX_LATERAL_LIMIT = 0.90;
      const isHittingLeftBarrier = player.x <= -MAX_LATERAL_LIMIT;
      const isHittingRightBarrier = player.x >= MAX_LATERAL_LIMIT;

      if (isHittingLeftBarrier) {
        player.x = -MAX_LATERAL_LIMIT;
        // Edge friction / resistance slows down the vehicle when scraping barrier
        player.speed *= Math.pow(0.93, dt * 60);
        // Trigger barrier scrape feedback if moving fast
        if (Math.abs(player.speed) > 400 && player.collisionCooldown <= 0) {
          window.UR?.collision?.handleBarrierCollision(player, null, null, window.UR?.audio);
        }
      } else if (isHittingRightBarrier) {
        player.x = MAX_LATERAL_LIMIT;
        player.speed *= Math.pow(0.93, dt * 60);
        if (Math.abs(player.speed) > 400 && player.collisionCooldown <= 0) {
          window.UR?.collision?.handleBarrierCollision(player, null, null, window.UR?.audio);
        }
      }

      // Robust coordinate sanitation (prevent NaN or Infinity)
      if (!Number.isFinite(player.x)) player.x = 0;
      if (!Number.isFinite(player.z)) player.z = 0;
      if (!Number.isFinite(player.speed)) player.speed = 0;
      player.x = Math.max(-MAX_LATERAL_LIMIT, Math.min(MAX_LATERAL_LIMIT, player.x));

      // Player is on curb when |x| > 0.76 (outer wheel crossing white edge line)
      player.isOnCurb = Math.abs(player.x) > 0.76;
      player.isOffRoad = false; // Road boundary strictly guarantees vehicle remains on track

      // 8. Update Track Progression (z coordinate)
      player.z += player.speed * dt;
      if (player.z < 0) player.z = 0; // prevent negative distance
    }
  }

  window.UR = window.UR || {};
  window.UR.physics = new PhysicsEngine();
})();

