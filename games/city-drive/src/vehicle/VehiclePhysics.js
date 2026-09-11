/**
 * VehiclePhysics.js
 * Arcade-style vehicle physics model using bicycle kinematics.
 * Handles acceleration, braking, reverse, coasting friction, speed-sensitive steering,
 * lateral grip/drift, and suspension roll/pitch dynamics.
 */

export class VehiclePhysics {
  constructor(config = {}) {
    // Configurable performance parameters
    this.maxSpeed = config.maxSpeed || 38.0;          // ~137 km/h (m/s)
    this.reverseSpeed = config.reverseSpeed || 10.0;  // ~36 km/h
    this.acceleration = config.acceleration || 12.0;  // m/s^2 forward thrust
    this.reverseAcceleration = config.reverseAcceleration || 8.0;
    this.brakingForce = config.brakingForce || 22.0;  // m/s^2 smooth high-authority braking
    this.handbrakeForce = config.handbrakeForce || 30.0;
    this.friction = config.friction || 2.4;           // Natural rolling drag
    this.airDrag = config.airDrag || 0.002;           // Quadratic aero resistance
    this.wheelbase = config.wheelbase || 2.8;         // Distance between axles (meters)
    this.maxSteerAngle = config.maxSteerAngle || 0.52;// ~30 degrees at low speed
    this.highSpeedSteerFactor = config.highSpeedSteerFactor || 0.35; // Sensitivity at max speed

    // State
    this.speed = 0;              // Current longitudinal velocity (m/s, signed: + forward, - reverse)
    this.steeringAngle = 0;      // Current wheel steer angle (radians)
    this.heading = 0;            // Yaw orientation angle (radians)
    this.lateralVelocity = 0;    // Sideways drift velocity (m/s)

    // Visual dynamics (for chassis animation)
    this.chassisRoll = 0;        // Lean on turns
    this.chassisPitch = 0;       // Squat / dive
    this.gear = 'P';             // 'D', 'R', 'P'

    // Position in 3D world
    this.position = { x: 0, y: 0, z: 0 };
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
    dt = Math.min(dt, 0.1); // Guard against massive lag spikes

    const isMovingForward = this.speed > 0.1;
    const isMovingBackward = this.speed < -0.1;
    const isNearlyStopped = Math.abs(this.speed) <= 0.1;

    let targetPitch = 0;

    // 1. Throttle / Braking / Reverse arbitration
    if (throttle > 0.05) {
      // Forward throttle requested
      if (isMovingBackward) {
        // Car moving reverse -> Apply brake towards 0
        this.speed += this.brakingForce * dt;
        if (this.speed > 0) this.speed = 0;
        targetPitch = 0.03; // Braking dip
        this.gear = 'D';
      } else {
        // Accelerate forward
        const accelFade = 1.0 - Math.min(1.0, (this.speed / this.maxSpeed) * 0.7);
        this.speed += this.acceleration * throttle * accelFade * dt;
        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        targetPitch = -0.02 * throttle; // Chassis squat
        this.gear = 'D';
      }
    } else if (throttle < -0.05) {
      // Backward / Brake requested
      const brakeMagnitude = Math.abs(throttle);
      if (isMovingForward) {
        // Car moving forward -> Apply smooth brake
        this.speed -= this.brakingForce * brakeMagnitude * dt;
        if (this.speed < 0) this.speed = 0;
        targetPitch = 0.04 * brakeMagnitude; // Chassis dive
        this.gear = 'D';
      } else {
        // Reverse acceleration
        const reverseFade = 1.0 - Math.min(1.0, Math.abs(this.speed) / this.reverseSpeed);
        this.speed -= this.reverseAcceleration * brakeMagnitude * reverseFade * dt;
        if (this.speed < -this.reverseSpeed) this.speed = -this.reverseSpeed;
        targetPitch = 0.015;
        this.gear = 'R';
      }
    } else {
      // Coasting - apply rolling friction and air resistance
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

    // 3. Speed-sensitive steering
    // At high speed, reduce max steering angle smoothly to maintain realistic highway stability
    const speedRatio = Math.min(1.0, Math.abs(this.speed) / this.maxSpeed);
    const speedSteerMultiplier = 1.0 - (1.0 - this.highSpeedSteerFactor) * (speedRatio * speedRatio);
    const targetSteerAngle = steerInput * this.maxSteerAngle * speedSteerMultiplier;

    // Smooth steering wheel rack response
    const steerSpeed = 8.0;
    this.steeringAngle += (targetSteerAngle - this.steeringAngle) * Math.min(1.0, steerSpeed * dt);

    // 4. Bicycle Kinematic Yaw Calculation
    // Yaw rate omega = (v / L) * tan(delta)
    if (Math.abs(this.speed) > 0.05) {
      const yawRate = (this.speed / this.wheelbase) * Math.tan(this.steeringAngle);
      this.heading += yawRate * dt;

      // Chassis roll opposite to turning centrifugal force
      const lateralAccel = yawRate * this.speed;
      const targetRoll = -Math.max(-0.12, Math.min(0.12, lateralAccel * 0.015));
      this.chassisRoll += (targetRoll - this.chassisRoll) * Math.min(1.0, 10.0 * dt);
    } else {
      this.chassisRoll += (0 - this.chassisRoll) * Math.min(1.0, 10.0 * dt);
    }

    // Smooth chassis pitch recovery
    this.chassisPitch += (targetPitch - this.chassisPitch) * Math.min(1.0, 8.0 * dt);

    // 5. Position integration
    // Heading 0 points down the road (along +Z or -Z, let's use -Z as world forward)
    // forward vector: (-sin(heading), 0, -cos(heading))
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
   * @param {number} normalX Normal vector pointing out of obstacle
   * @param {number} normalZ
   * @param {number} restitution Energy retention (0 to 1)
   */
  onCollision(normalX, normalZ, restitution = 0.25) {
    // Reverse speed direction slightly and absorb kinetic energy
    this.speed = -this.speed * restitution;

    // Push slightly along normal
    this.position.x += normalX * 0.4;
    this.position.z += normalZ * 0.4;

    // Trigger visual bumper pitch shock
    this.chassisPitch = -0.08;
  }
}

