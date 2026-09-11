/**
 * Railway Commander - Train Physics Engine
 * Simulates momentum, tractive effort, progressive pneumatic brakes,
 * rolling resistance, aerodynamic drag, and speed limits.
 */

export class TrainPhysics {
  constructor(config = {}) {
    // Train Physical Attributes
    this.massKg = config.massKg || 180000; // 180 tons (Locomotive + 4 passenger coaches)
    this.maxSpeedKmh = config.maxSpeedKmh || 140; // Max rated locomotive speed
    this.maxPowerKw = config.maxPowerKw || 3200; // Electric/Diesel-Electric horsepower
    
    // Controls State
    this.throttleLevel = 0; // 0, 1, 2, 3, 4, 5
    this.brakeLevel = 0;    // 0, 1, 2, 3, 4, 5
    this.emergencyBrake = false;
    this.headlights = true;
    this.hornActive = false;

    // Kinematic State
    this.speedKmh = 0;       // Current speed in km/h
    this.speedMs = 0;        // Current speed in m/s
    this.positionMeters = 0; // Distance traveled along the track (m)
    this.accelerationMs2 = 0;// Current acceleration in m/s^2
    this.speedLimitKmh = 80; // Default line speed limit

    // Resistance Coefficients (Davis Equation inspired)
    this.cRoll = 0.0015;      // Rolling friction coefficient
    this.cAero = 0.00035;     // Aerodynamic drag coefficient
    this.gravity = 9.81;

    // Overspeed Tracking
    this.overspeedTimer = 0;
    this.overspeedWarning = false;
  }

  reset(startPosition = 0, initialSpeed = 0) {
    this.throttleLevel = 0;
    this.brakeLevel = 0;
    this.emergencyBrake = false;
    this.speedKmh = initialSpeed;
    this.speedMs = (initialSpeed * 1000) / 3600;
    this.positionMeters = startPosition;
    this.accelerationMs2 = 0;
    this.overspeedTimer = 0;
    this.overspeedWarning = false;
  }

  setThrottle(level) {
    this.throttleLevel = Math.max(0, Math.min(5, Math.round(level)));
    if (this.throttleLevel > 0 && this.emergencyBrake) {
      this.emergencyBrake = false;
    }
  }

  setBrake(level) {
    this.brakeLevel = Math.max(0, Math.min(5, Math.round(level)));
    if (this.brakeLevel > 0) {
      this.emergencyBrake = false;
    }
  }

  throttleUp() {
    if (this.throttleLevel < 5) {
      this.setThrottle(this.throttleLevel + 1);
      return true;
    }
    return false;
  }

  throttleDown() {
    if (this.throttleLevel > 0) {
      this.setThrottle(this.throttleLevel - 1);
      return true;
    }
    return false;
  }

  brakeUp() {
    if (this.brakeLevel < 5) {
      this.setBrake(this.brakeLevel + 1);
      return true;
    }
    return false;
  }

  brakeDown() {
    if (this.brakeLevel > 0) {
      this.setBrake(this.brakeLevel - 1);
      return true;
    }
    return false;
  }

  applyEmergencyBrake() {
    this.emergencyBrake = true;
    this.throttleLevel = 0;
    this.brakeLevel = 5;
  }

  releaseEmergencyBrake() {
    this.emergencyBrake = false;
    this.brakeLevel = 0;
  }

  toggleHeadlights() {
    this.headlights = !this.headlights;
    return this.headlights;
  }

  setHorn(active) {
    this.hornActive = Boolean(active);
  }

  setSpeedLimit(kmh) {
    this.speedLimitKmh = Math.max(20, kmh);
  }

  /**
   * Physics Integration Loop
   * @param {number} dt Seconds elapsed since last frame
   */
  update(dt) {
    if (dt <= 0) return;
    dt = Math.min(dt, 0.1); // clamp delta time for numerical stability

    // 1. Calculate Tractive Effort (Acceleration Force)
    let tractiveForce = 0;
    if (this.throttleLevel > 0 && !this.emergencyBrake) {
      // Throttle notches: 1 = 18%, 2 = 38%, 3 = 60%, 4 = 82%, 5 = 100%
      const throttleFactors = [0, 0.18, 0.38, 0.60, 0.82, 1.0];
      const appliedPowerKw = this.maxPowerKw * throttleFactors[this.throttleLevel];

      // F = P / v at speed; at low speeds use starting tractive effort limit
      const currentV = Math.max(2.5, this.speedMs);
      tractiveForce = (appliedPowerKw * 1000) / currentV;

      // Locomotive adhesion limit (cannot exceed wheel grip on steel rails)
      const maxAdhesionForce = this.massKg * 0.22 * this.gravity;
      tractiveForce = Math.min(tractiveForce, maxAdhesionForce);
    }

    // 2. Calculate Resistances (Friction + Aerodynamic Drag)
    const rollResistance = this.massKg * this.cRoll * this.gravity;
    const aeroDrag = this.cAero * (this.speedMs * this.speedMs) * 1000;
    const totalResistance = rollResistance + aeroDrag;

    // 3. Calculate Braking Force
    let brakeForce = 0;
    if (this.emergencyBrake) {
      // High-friction emergency deceleration (~1.45 m/s^2)
      brakeForce = this.massKg * 1.45;
    } else if (this.brakeLevel > 0) {
      // Progressive service brake notches: 1 = 0.18 m/s^2, 2 = 0.36, 3 = 0.55, 4 = 0.78, 5 = 1.08
      const brakeDecels = [0, 0.18, 0.36, 0.55, 0.78, 1.08];
      brakeForce = this.massKg * brakeDecels[this.brakeLevel];
    }

    // 4. Net Force & Acceleration
    let netForce = tractiveForce - totalResistance;

    // Apply braking opposing motion
    if (this.speedMs > 0.001) {
      netForce -= brakeForce;
    } else if (this.speedMs < -0.001) {
      netForce += brakeForce;
    }

    this.accelerationMs2 = netForce / this.massKg;

    // 5. Velocity Integration
    this.speedMs += this.accelerationMs2 * dt;

    // Handle stopping cleanly when speed is negligible with active braking or zero power
    if (this.speedMs < 0.05 && (this.brakeLevel > 0 || this.emergencyBrake || tractiveForce === 0)) {
      if (this.throttleLevel === 0) {
        this.speedMs = 0;
        this.accelerationMs2 = 0;
      }
    }

    const maxSpeedMs = (this.maxSpeedKmh * 1000) / 3600;
    if (this.speedMs > maxSpeedMs) {
      this.speedMs = maxSpeedMs;
    }

    // Forward direction only in normal passenger runs
    if (this.speedMs < 0) {
      this.speedMs = 0;
      this.accelerationMs2 = 0;
    }

    // 6. Convert to km/h and update distance
    this.speedKmh = (this.speedMs * 3600) / 1000;
    this.positionMeters += this.speedMs * dt;

    // 7. Overspeed monitoring
    const overspeedThreshold = this.speedLimitKmh + 2.0; // 2 km/h margin of error
    if (this.speedKmh > overspeedThreshold) {
      this.overspeedWarning = true;
      this.overspeedTimer += dt;
    } else {
      this.overspeedWarning = false;
      this.overspeedTimer = Math.max(0, this.overspeedTimer - dt * 1.5);
    }
  }

  getState() {
    return {
      speedKmh: Math.round(this.speedKmh * 10) / 10,
      speedMs: this.speedMs,
      positionMeters: Math.round(this.positionMeters * 10) / 10,
      positionKm: (this.positionMeters / 1000).toFixed(2),
      acceleration: Math.round(this.accelerationMs2 * 100) / 100,
      throttleLevel: this.throttleLevel,
      brakeLevel: this.brakeLevel,
      emergencyBrake: this.emergencyBrake,
      headlights: this.headlights,
      hornActive: this.hornActive,
      speedLimitKmh: this.speedLimitKmh,
      overspeedWarning: this.overspeedWarning,
      overspeedDuration: this.overspeedTimer,
      isStopped: this.speedKmh < 0.2
    };
  }
}
