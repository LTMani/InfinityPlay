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
    this.throttlePercent = 0; // 0% to 100%
    this.throttleLevel = 0;   // 0, 1, 2, 3, 4, 5 (for backward compat)
    this.brakeLevel = 0;      // 0, 1, 2, 3, 4, 5
    this.reverser = 'F';      // 'F' (Forward) or 'R' (Reverse)
    this.pantographUp = true; // 25kV OHE contact
    this.enginePower = true;  // Traction inverters
    this.doorsOpen = false;   // Passenger doors
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
    this.throttlePercent = 0;
    this.throttleLevel = 0;
    this.brakeLevel = 0;
    this.reverser = 'F';
    this.pantographUp = true;
    this.enginePower = true;
    this.doorsOpen = false;
    this.emergencyBrake = false;
    this.speedKmh = initialSpeed;
    this.speedMs = (initialSpeed * 1000) / 3600;
    this.positionMeters = startPosition;
    this.accelerationMs2 = 0;
    this.overspeedTimer = 0;
    this.overspeedWarning = false;
  }

  setThrottlePercent(pct) {
    this.throttlePercent = Math.max(0, Math.min(100, Math.round(pct)));
    this.throttleLevel = Math.round((this.throttlePercent / 100) * 5);
    if (this.throttlePercent > 0) {
      if (this.emergencyBrake) this.emergencyBrake = false;
      if (this.doorsOpen) this.doorsOpen = false; // close doors when driving
    }
  }

  setThrottle(level) {
    this.throttleLevel = Math.max(0, Math.min(5, Math.round(level)));
    this.throttlePercent = Math.round((this.throttleLevel / 5) * 100);
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
    if (this.throttlePercent < 100) {
      this.setThrottlePercent(Math.min(100, this.throttlePercent + 10));
      return true;
    }
    return false;
  }

  throttleDown() {
    if (this.throttlePercent > 0) {
      this.setThrottlePercent(Math.max(0, this.throttlePercent - 10));
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

  setReverser(dir) {
    if (this.speedKmh > 2.0) return false; // Safety lockout while moving
    this.reverser = dir === 'R' ? 'R' : 'F';
    return true;
  }

  togglePantograph() {
    this.pantographUp = !this.pantographUp;
    return this.pantographUp;
  }

  toggleEnginePower() {
    this.enginePower = !this.enginePower;
    return this.enginePower;
  }

  toggleDoors() {
    if (this.speedKmh > 1.5) return false; // Cannot open doors while train is moving
    this.doorsOpen = !this.doorsOpen;
    if (this.doorsOpen) {
      this.throttlePercent = 0;
      this.throttleLevel = 0;
    }
    return true;
  }

  applyEmergencyBrake() {
    this.emergencyBrake = true;
    this.throttlePercent = 0;
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
    const canDrive = this.pantographUp && this.enginePower && !this.doorsOpen && !this.emergencyBrake;
    if (this.throttlePercent > 0 && canDrive) {
      const appliedPowerKw = this.maxPowerKw * (this.throttlePercent / 100);

      // F = P / v at speed; at low speeds use starting tractive effort limit
      const currentV = Math.max(2.5, Math.abs(this.speedMs));
      tractiveForce = (appliedPowerKw * 1000) / currentV;

      // Locomotive adhesion limit (WAP-7 rated at 460 kN starting tractive effort)
      const maxAdhesionForce = this.massKg * 0.26 * this.gravity;
      tractiveForce = Math.min(tractiveForce, maxAdhesionForce);
    }

    // 2. Calculate Resistances (Friction + Aerodynamic Drag)
    const rollResistance = this.massKg * this.cRoll * this.gravity;
    const aeroDrag = this.cAero * (this.speedMs * this.speedMs) * 1000;
    const totalResistance = rollResistance + aeroDrag;

    // 3. Calculate Braking Force
    let brakeForce = 0;
    if (this.emergencyBrake) {
      // High-friction emergency deceleration (~1.55 m/s^2)
      brakeForce = this.massKg * 1.55;
    } else if (this.doorsOpen) {
      // Station door holding brake
      brakeForce = this.massKg * 1.2;
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
    if (this.speedMs < 0.05 && (this.brakeLevel > 0 || this.emergencyBrake || this.doorsOpen || tractiveForce === 0)) {
      if (this.throttlePercent === 0) {
        this.speedMs = 0;
        this.accelerationMs2 = 0;
      }
    }

    const maxSpeedMs = (this.maxSpeedKmh * 1000) / 3600;
    if (this.speedMs > maxSpeedMs) {
      this.speedMs = maxSpeedMs;
    }

    // Forward direction in normal passenger runs
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
      throttlePercent: this.throttlePercent,
      brakeLevel: this.brakeLevel,
      reverser: this.reverser,
      pantographUp: this.pantographUp,
      enginePower: this.enginePower,
      doorsOpen: this.doorsOpen,
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
