/**
 * VehiclePhysics.js
 * High-performance arcade vehicle physics model with bicycle kinematics.
 * Delivers immediate throttle response, punchy acceleration, high-authority braking,
 * agile speed-sensitive steering, and tuning upgrades.
 */

export class VehiclePhysics {
  constructor(config = {}) {
    // Configurable high-performance parameters
    this.maxSpeed = config.maxSpeed || 48.0;          // ~173 km/h base top speed
    this.reverseSpeed = config.reverseSpeed || 16.0;  // ~58 km/h
    this.acceleration = config.acceleration || 22.0;  // m/s^2 instant punchy acceleration
    this.reverseAcceleration = config.reverseAcceleration || 14.0;
    this.brakingForce = config.brakingForce || 34.0;  // m/s^2 high-authority braking
    this.handbrakeForce = config.handbrakeForce || 45.0;
    this.friction = config.friction || 2.0;           // Rolling resistance
    this.airDrag = config.airDrag || 0.0012;         // Aerodynamic drag
    this.wheelbase = config.wheelbase || 2.8;         // Distance between axles (meters)
    this.maxSteerAngle = config.maxSteerAngle || 0.65;// ~37 degrees for tight cornering
    this.highSpeedSteerFactor = config.highSpeedSteerFactor || 0.55; // Retains maneuverability at top speed

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
    // Stage 1: 165 km/h, Stage 2: 185 km/h, Stage 3: 205 km/h
    this.maxSpeed = 44.0 + (engineStage - 1) * 6.0;
    this.acceleration = 18.0 + (engineStage - 1) * 5.0;

    const handlingStage = Math.max(1, Math.min(3, tuning.handlingLevel || 2));
    this.maxSteerAngle = 0.58 + (handlingStage - 1) * 0.06;
    this.highSpeedSteerFactor = 0.48 + (handlingStage - 1) * 0.06;

    const brakeStage = Math.max(1, Math.min(3, tuning.brakesLevel || 2));
    this.brakingForce = 28.0 + (brakeStage - 1) * 6.0;
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
        targetPitch = 0.035;
        this.gear = 'D';
      } else {
        // Accelerate forward with sustained power curve
        const speedRatio = Math.max(0, this.speed / this.maxSpeed);
        const powerCurve = 1.0 - Math.pow(speedRatio, 3.5) * 0.65;
        this.speed += this.acceleration * throttle * powerCurve * dt;
        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        targetPitch = -0.035 * throttle; // Chassis squat
        this.gear = 'D';
      }
    } else if (throttle < -0.04) {
      const brakeMagnitude = Math.abs(throttle);
      if (isMovingForward) {
        // Forward braking
        this.speed -= this.brakingForce * brakeMagnitude * dt;
        if (this.speed < 0) this.speed = 0;
        targetPitch = 0.045 * brakeMagnitude; // Chassis nose dive
        this.gear = 'D';
      } else {
        // Reverse acceleration
        const revRatio = Math.abs(this.speed) / this.reverseSpeed;
        const revPower = 1.0 - Math.min(1.0, revRatio * 0.5);
        this.speed -= this.reverseAcceleration * brakeMagnitude * revPower * dt;
        if (this.speed < -this.reverseSpeed) this.speed = -this.reverseSpeed;
        targetPitch = 0.02;
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
      targetPitch = 0.06 * handbrakeInput;
    }

    // 3. Speed-sensitive steering
    const speedRatio = Math.min(1.0, Math.abs(this.speed) / this.maxSpeed);
    const speedSteerMultiplier = 1.0 - (1.0 - this.highSpeedSteerFactor) * (speedRatio * speedRatio);
    const targetSteerAngle = steerInput * this.maxSteerAngle * speedSteerMultiplier;

    // Fast steering rack response (18.0 vs old 8.0)
    const steerSpeed = 18.0;
    this.steeringAngle += (targetSteerAngle - this.steeringAngle) * Math.min(1.0, steerSpeed * dt);

    // 4. Bicycle Kinematic Yaw Calculation with low-speed agility
    if (Math.abs(this.speed) > 0.02 || Math.abs(throttle) > 0.05) {
      // Keep low-speed turn authority so the car is never locked when rolling or launching
      const turnSpeed = Math.max(4.2, Math.abs(this.speed));
      const direction = this.speed < -0.1 ? -1 : 1;
      const yawRate = (turnSpeed / this.wheelbase) * Math.tan(this.steeringAngle) * direction;
      this.heading += yawRate * dt;

      // Chassis roll opposite to centrifugal force
      const lateralAccel = yawRate * this.speed;
      const targetRoll = -Math.max(-0.14, Math.min(0.14, lateralAccel * 0.018));
      this.chassisRoll += (targetRoll - this.chassisRoll) * Math.min(1.0, 12.0 * dt);
    } else {
      this.chassisRoll += (0 - this.chassisRoll) * Math.min(1.0, 12.0 * dt);
    }

    // Smooth chassis pitch recovery
    this.chassisPitch += (targetPitch - this.chassisPitch) * Math.min(1.0, 10.0 * dt);

    // 5. Position integration
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
  onCollision(normalX, normalZ, restitution = 0.25) {
    this.speed = -this.speed * restitution;
    this.position.x += normalX * 0.35;
    this.position.z += normalZ * 0.35;
    this.chassisPitch = -0.09;
  }
}
