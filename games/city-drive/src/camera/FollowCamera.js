/**
 * FollowCamera.js
 * Smooth third-person chase camera with rotation tracking,
 * dynamic speed-FOV zoom, and impact screen shake.
 */

import * as THREE from 'three';

export class FollowCamera {
  constructor(aspectRatio = window.innerWidth / window.innerHeight) {
    this.baseFov = 58;
    this.maxFov = 68;

    this.camera = new THREE.PerspectiveCamera(this.baseFov, aspectRatio, 0.1, 1200);

    // Desired camera offsets relative to vehicle (meters)
    this.distance = 7.2;   // Distance behind vehicle
    this.height = 3.1;     // Height above vehicle
    this.lookAhead = 3.5;  // Look target distance ahead of vehicle center
    this.lookHeight = 1.3; // Height of focal target

    // Follow smoothing factors
    this.positionSmoothness = 7.5; // Lerp rate for position
    this.lookSmoothness = 10.0;     // Lerp rate for look target

    // Internal working vectors to prevent GC allocations
    this.currentLookAt = new THREE.Vector3();
    this.targetLookAt = new THREE.Vector3();
    this.targetPosition = new THREE.Vector3();

    // Collision shake state
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
  }

  /**
   * Instantly snaps camera behind vehicle without interpolation.
   * Useful on game start or restart.
   */
  snap(physics) {
    const heading = physics.heading;
    const sinH = Math.sin(heading);
    const cosH = Math.cos(heading);

    // Position behind the car
    this.camera.position.x = physics.position.x + sinH * this.distance;
    this.camera.position.y = physics.position.y + this.height;
    this.camera.position.z = physics.position.z + cosH * this.distance;

    // LookAt ahead of car
    this.currentLookAt.x = physics.position.x - sinH * this.lookAhead;
    this.currentLookAt.y = physics.position.y + this.lookHeight;
    this.currentLookAt.z = physics.position.z - cosH * this.lookAhead;

    this.camera.lookAt(this.currentLookAt);
    this.shakeIntensity = 0;
  }

  /**
   * Updates camera position and orientation each frame.
   * @param {VehiclePhysics} physics
   * @param {number} dt Delta time
   */
  update(physics, dt) {
    if (dt <= 0) return;

    const heading = physics.heading;
    const sinH = Math.sin(heading);
    const cosH = Math.cos(heading);

    // 1. Calculate desired camera position
    // If moving backwards in reverse gear, pull camera back slightly further for better rear visibility
    const isReversing = physics.gear === 'R' && physics.speed < -0.5;
    const effectiveDistance = isReversing ? this.distance + 1.2 : this.distance;
    const effectiveHeight = isReversing ? this.height + 0.5 : this.height;

    this.targetPosition.x = physics.position.x + sinH * effectiveDistance;
    this.targetPosition.y = physics.position.y + effectiveHeight;
    this.targetPosition.z = physics.position.z + cosH * effectiveDistance;

    // 2. Calculate desired lookAt target (point in front of vehicle)
    const lookAheadDist = isReversing ? -this.lookAhead * 0.5 : this.lookAhead;
    this.targetLookAt.x = physics.position.x - sinH * lookAheadDist;
    this.targetLookAt.y = physics.position.y + this.lookHeight;
    this.targetLookAt.z = physics.position.z - cosH * lookAheadDist;

    // 3. Smoothly interpolate position and lookAt
    const posAlpha = Math.min(1.0, this.positionSmoothness * dt);
    this.camera.position.lerp(this.targetPosition, posAlpha);

    const lookAlpha = Math.min(1.0, this.lookSmoothness * dt);
    this.currentLookAt.lerp(this.targetLookAt, lookAlpha);

    // 4. Collision Screen Shake processing
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
      const progress = Math.max(0, this.shakeTimer / this.shakeDuration);
      const currentTrauma = this.shakeIntensity * (progress * progress); // Quadratic falloff

      const shakeX = (Math.random() * 2 - 1) * currentTrauma;
      const shakeY = (Math.random() * 2 - 1) * currentTrauma * 0.7;
      const shakeZ = (Math.random() * 2 - 1) * currentTrauma * 0.5;

      this.camera.position.x += shakeX;
      this.camera.position.y += shakeY;
      this.camera.position.z += shakeZ;
    }

    this.camera.lookAt(this.currentLookAt);

    // 5. Dynamic speed-dependent FOV
    const speedRatio = Math.min(1.0, Math.abs(physics.speed) / physics.maxSpeed);
    const targetFov = this.baseFov + (this.maxFov - this.baseFov) * (speedRatio * speedRatio);
    if (Math.abs(this.camera.fov - targetFov) > 0.1) {
      this.camera.fov += (targetFov - this.camera.fov) * Math.min(1.0, 4.0 * dt);
      this.camera.updateProjectionMatrix();
    }
  }

  /**
   * Triggers camera shake on collision impact.
   * @param {number} intensity Max offset in meters (e.g. 0.35)
   * @param {number} duration Duration in seconds (e.g. 0.45)
   */
  triggerImpactShake(intensity = 0.35, duration = 0.45) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }

  /**
   * Handles window resize.
   */
  onResize(aspectRatio) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }
}

