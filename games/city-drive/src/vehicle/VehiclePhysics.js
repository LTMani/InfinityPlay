/**
 * VehiclePhysics.js
 * Balanced arcade vehicle physics model with bicycle kinematics.
 * Features speed-sensitive steering attenuation, caster self-aligning highway stability,
 * strict yaw rate limits, and controllable acceleration curve.
 */

export class VehiclePhysics {
  constructor(config = {}) {
    // Balanced, comfortable driving parameters (10% speed & acceleration boost)
    this.maxSpeed = config.maxSpeed || 44.0;          // ~158 km/h base top speed (+10%)
    this.reverseSpeed = config.reverseSpeed || 13.2;  // ~48 km/h (+10%)
    this.acceleration = config.acceleration || 16.5;  // m/s^2 acceleration (+10%)
    this.reverseAcceleration = config.reverseAcceleration || 11.0;
    this.brakingForce = config.brakingForce || 32.0;  // m/s^2 crisp reliable stopping
    this.handbrakeForce = config.handbrakeForce || 42.0;
    this.friction = config.friction || 2.2;           // Rolling resistance
    this.airDrag = config.airDrag || 0.0015;         // Aerodynamic drag
    this.wheelbase = config.wheelbase || 2.8;         // Distance between axles (meters)
    this.maxSteerAngle = config.maxSteerAngle || 0.45;// ~26 degrees at low parking speed

    // State
    this.speed = 0;              // Current longitudinal velocity (m/s, signed: + forward, - reverse)
    this.steeringAngle = 0;      // Current wheel steer angle (radians)
    this.heading = 0;            // Yaw orientation angle (radians)
    this.lateralVelocity = 0;    // Sideways drift velocity (m/s)

    // Visual dynamics
    this.chassisRoll = 0;        // Lean on turns
    this.chassisPitch = 0;       // Squat / dive
    this.gear = 'P';             // 'D', 'R', 'P'

    // Position in 3D world
    this.position = { x: 0, y: 0, z: 0 };
  }

  applyTuning(tuning = {}) {
    const engineStage = Math.max(1, Math.min(3, tuning.engineLevel || 2));
    // Stage 1: 150 km/h, Stage 2: 170 km/h, Stage 3: 190 km/h
    this.maxSpeed = 41.8 + (engineStage - 1) * 5.5;
    this.acceleration = 14.3 + (engineStage - 1) * 3.85;

    const handlingStage = Math.max(1, Math.min(3, tuning.handlingLevel || 2));
    this.maxSteerAngle = 0.40 + (handlingStage - 1) * 0.04;

    const brakeStage = Math.max(1, Math.min(3, tuning.brakesLevel || 2));
    this.brakingForce = 28.0 + (brakeStage - 1) * 5.0;
  }

  reset(x = 0, y = 0, z = 0, heading = 0) {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.heading = heading;
    this.speed = 0;
    this.steeringAngle = 0;
    this.lateralVelocity = 0;
    this.chassisRoll = 0;
    this.chassisPitch = 0;
    this.gear = 'P';
  }

  /**
   * Main physics simulation step.
   * @param {number} dt Delta time in seconds
   * @param {number} throttle Normalized input [-1, 1]
   * @param {number} steerInput Normalized steer input [-1, 1] (positive = left)
   * @param {number} handbrakeInput Normalized handbrake [0, 1]
   */
  update(dt, throttle, steerInput, handbrakeInput) {
    if (dt <= 0) return;
    dt = Math.min(dt, 0.1);

    const isMovingForward = this.speed > 0.2;
    const isMovingBackward = this.speed < -0.2;
    const isNearlyStopped = Math.abs(this.speed) <= 0.2;

    let targetPitch = 0;

    // 1. Throttle / Braking / Reverse arbitration
    if (throttle > 0.04) {
      if (isMovingBackward) {
        // Reverse braking to stop
        this.speed += this.brakingForce * dt;
        if (this.speed > 0) this.speed = 0;
        targetPitch = 0.03;
        this.gear = 'D';
      } else {
        // Smooth forward acceleration
        const speedRatio = Math.max(0, this.speed / this.maxSpeed);
        const powerCurve = 1.0 - Math.pow(speedRatio, 2.8) * 0.6;
        this.speed += this.acceleration * throttle * powerCurve * dt;
        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        targetPitch = -0.025 * throttle; // Chassis squat
        this.gear = 'D';
      }
    } else if (throttle < -0.04) {
      const brakeMagnitude = Math.abs(throttle);
      if (isMovingForward) {
        // Forward braking
        this.speed -= this.brakingForce * brakeMagnitude * dt;
        if (this.speed < 0) this.speed = 0;
        targetPitch = 0.035 * brakeMagnitude; // Chassis nose dive
        this.gear = 'D';
      } else {
        // Reverse acceleration
        const revRatio = Math.abs(this.speed) / this.reverseSpeed;
        const revPower = 1.0 - Math.min(1.0, revRatio * 0.6);
        this.speed -= this.reverseAcceleration * brakeMagnitude * revPower * dt;
        if (this.speed < -this.reverseSpeed) this.speed = -this.reverseSpeed;
        targetPitch = 0.018;
        this.gear = 'R';
      }
    } else {
      // Natural rolling drag and aero resistance
      const drag = (this.friction + this.airDrag * (this.speed * this.speed)) * dt;
      if (this.speed > 0) {
        this.speed = Math.max(0, this.speed - drag);
      } else if (this.speed < 0) {
        this.speed = Math.min(0, this.speed + drag);
      }
      this.gear = isNearlyStopped ? 'P' : (this.speed < 0 ? 'R' : 'D');
    }

    // 2. Handbrake application
    if (handbrakeInput > 0.1) {
      const hbDrag = this.handbrakeForce * handbrakeInput * dt;
      if (this.speed > 0) {
        this.speed = Math.max(0, this.speed - hbDrag);
      } else if (this.speed < 0) {
        this.speed = Math.min(0, this.speed + hbDrag);
      }
      targetPitch = 0.05 * handbrakeInput;
    }

    // 3. High-Speed Steering Attenuation
    // As speed increases, max steer angle smoothly drops so the car never darts sideways violently
    const speedKmh = Math.abs(this.speed) * 3.6;
    let speedFactor = 1.0;
    if (speedKmh > 12) {
      // At 20 km/h: ~0.80
      // At 60 km/h: ~0.32
      // At 100+ km/h: ~0.16 (around 3.8 degrees max wheel angle!)
      speedFactor = Math.max(0.14, 1.0 - Math.min(0.86, Math.pow(speedKmh / 95, 1.3) * 0.86));
    }
    const targetSteerAngle = steerInput * this.maxSteerAngle * speedFactor;

    // Smooth progressive steering rack response (9.0 rad/s)
    const steerSpeed = 9.0;
    this.steeringAngle += (targetSteerAngle - this.steeringAngle) * Math.min(1.0, steerSpeed * dt);

    // 4. Bicycle Kinematic Yaw Calculation with strict safety bounds
    if (Math.abs(this.speed) > 0.05) {
      // Clamped turnSpeed ensures high-speed driving never generates runaway rotation
      const turnSpeed = Math.min(18.0, Math.abs(this.speed));
      const direction = this.speed < -0.1 ? -1 : 1;
      let yawRate = (turnSpeed / this.wheelbase) * Math.tan(this.steeringAngle) * direction;

      // Cap maximum yaw rate to prevent snap spinning (max ~42 deg/sec)
      const maxYawRate = 0.72;
      yawRate = Math.max(-maxYawRate, Math.min(maxYawRate, yawRate));

      this.heading += yawRate * dt;

      // Highway heading guard: car can never rotate sideways across the boulevard
      // Road forward direction is along -Z (heading = 0)
      this.heading = Math.max(-0.52, Math.min(0.52, this.heading)); // Max ±30 degrees

      // Dynamic chassis roll
      const lateralAccel = yawRate * this.speed;
      const targetRoll = -Math.max(-0.09, Math.min(0.09, lateralAccel * 0.012));
      this.chassisRoll += (targetRoll - this.chassisRoll) * Math.min(1.0, 8.0 * dt);
    } else {
      this.chassisRoll += (0 - this.chassisRoll) * Math.min(1.0, 8.0 * dt);
    }

    // 5. Caster self-aligning highway stability
    // When player releases steering (A/D neutral), smoothly guide car back to facing forward down lane
    if (Math.abs(steerInput) < 0.05 && Math.abs(this.speed) > 1.0) {
      const alignRate = 3.5;
      this.heading += (0 - this.heading) * Math.min(1.0, alignRate * dt);
    }

    // Smooth chassis pitch recovery
    this.chassisPitch += (targetPitch - this.chassisPitch) * Math.min(1.0, 8.0 * dt);

    // 6. Position integration
    const forwardX = -Math.sin(this.heading);
    const forwardZ = -Math.cos(this.heading);

    this.position.x += forwardX * this.speed * dt;
    this.position.z += forwardZ * this.speed * dt;
  }

  /**
   * Returns current speed in Kilometers Per Hour (km/h) for HUD.
   */
  getSpeedKmh() {
    return Math.abs(Math.round(this.speed * 3.6));
  }

  /**
   * Applies an obstacle collision impulse.
   */
  onCollision(normalX, normalZ, restitution = 0.22) {
    this.speed = -this.speed * restitution;
    this.position.x += normalX * 0.3;
    this.position.z += normalZ * 0.3;
    // Straighten heading slightly on guardrail/obstacle bounce
    this.heading *= 0.5;
    this.chassisPitch = -0.07;
  }
}
