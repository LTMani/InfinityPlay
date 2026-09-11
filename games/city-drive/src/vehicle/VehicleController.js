/**
 * VehicleController.js
 * Bridges player input with vehicle physics and rendering.
 * Provides controls for reset, gear monitoring, and telemetry queries.
 */

import { VehiclePhysics } from './VehiclePhysics.js';
import { Vehicle } from './Vehicle.js';

export class VehicleController {
  constructor(scene, options = {}) {
    this.physics = new VehiclePhysics(options.physicsConfig || {});
    this.vehicle = new Vehicle(scene, options.color || 0x2563eb);
    this.distanceTraveled = 0;
  }

  /**
   * Resets vehicle to starting line.
   */
  reset(x = 0, y = 0, z = 0, heading = 0) {
    this.physics.reset(x, y, z, heading);
    this.distanceTraveled = 0;
    this.vehicle.update(this.physics, 0.016);
  }

  /**
   * Main update step.
   * @param {number} dt Delta time
   * @param {InputManager} inputManager
   */
  update(dt, inputManager) {
    // Read input values
    const throttle = inputManager.throttle;
    const steer = inputManager.steer;
    const handbrake = inputManager.handbrake;

    // Advance physics
    this.physics.update(dt, throttle, steer, handbrake);

    // Track total forward distance
    if (this.physics.speed > 0) {
      this.distanceTraveled += this.physics.speed * dt;
    }

    // Sync 3D visual mesh
    this.vehicle.update(this.physics, dt);
  }

  /**
   * Telemetry getters for HUD
   */
  getSpeedKmh() {
    return this.physics.getSpeedKmh();
  }

  getSpeedMps() {
    return this.physics.speed;
  }

  getGear() {
    return this.physics.gear;
  }

  getSteerAngle() {
    return this.physics.steeringAngle;
  }

  getPosition() {
    return this.physics.position;
  }

  getHeading() {
    return this.physics.heading;
  }

  getDistanceMeters() {
    return Math.floor(this.distanceTraveled);
  }

  onCollision(normalX, normalZ) {
    this.physics.onCollision(normalX, normalZ);
  }
}

