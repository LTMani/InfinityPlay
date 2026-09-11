/**
 * InfinityPlay Ultimate Racing - Dynamic Racing Camera
 * Provides smooth interpolation, road elevation ground-tracking, banking/roll during curves,
 * speed-zoom, and trauma-based screen shake.
 */

(function() {
  class Camera {
    constructor() {
      this.x = 0;
      this.y = 1000;          // Height in world units (includes road elevation)
      this.z = 0;
      this.depth = 1.0;       // Distance to projection plane
      this.fieldOfView = 80;  // FOV in degrees

      // Smooth tracking state
      this.targetX = 0;
      this.targetY = 1000;
      this.tilt = 0;          // Roll / banking angle

      // Screen shake (Trauma model)
      this.trauma = 0;
      this.shakeIntensity = 0;
      this.shakeOffset = { x: 0, y: 0 };
    }

    reset(playerX = 0, playerZ = 0, playerY = 0, trackWidth = 520) {
      this.x = playerX * (trackWidth * 0.44);
      this.y = playerY + 800;
      this.z = playerZ - 600;
      this.targetX = this.x;
      this.tilt = 0;
      this.trauma = 0;
      this.shakeOffset = { x: 0, y: 0 };
    }

    shake(intensity, duration = 0.25) {
      const settings = window.UR?.SaveSystem?.getSettings() || {};
      if (settings.screenShake === false) return;
      this.trauma = Math.min(1.0, this.trauma + intensity * 0.1);
    }

    update(dt, player, trackWidth, roadElevation = 0) {
      // 1. Target horizontal position based on player lateral x and road half-width (0.44 factor)
      const roadHalfWidth = (trackWidth || 520) * 0.44;
      const targetWorldX = player.x * roadHalfWidth;
      // Smooth lerp follow
      this.x += (targetWorldX - this.x) * Math.min(1.0, 14 * dt);

      // 2. Camera Z sits behind player car in authentic arcade chase distance
      const targetZ = player.z - 600;
      this.z = targetZ;

      // 3. Camera Height: Ground-tracking elevation + dynamic acceleration lift
      const speedRatio = player.getSpeedRatio();
      const targetHeight = roadElevation + 750 + speedRatio * 50;
      this.y += (targetHeight - this.y) * Math.min(1.0, 12 * dt);

      // 4. Dynamic tilt / banking when steering or drifting
      const targetTilt = (player.isDrifting ? player.driftAngle * 0.7 : (player.x * 0.08));
      this.tilt += (targetTilt - this.tilt) * Math.min(1.0, 10 * dt);

      // 5. Dynamic FOV / Zoom based on speed and nitro
      const baseDepth = 1.0;
      const nitroZoom = player.isNitroActive ? 0.08 : 0.0;
      const targetDepth = baseDepth - speedRatio * 0.06 - nitroZoom;
      this.depth += (targetDepth - this.depth) * Math.min(1.0, 6 * dt);

      // 6. Calculate trauma screen shake
      if (this.trauma > 0) {
        this.trauma = Math.max(0, this.trauma - dt * 1.8);
        const shakePower = this.trauma * this.trauma;
        const maxOffset = 18;
        this.shakeOffset.x = (Math.random() * 2 - 1) * maxOffset * shakePower;
        this.shakeOffset.y = (Math.random() * 2 - 1) * maxOffset * shakePower;
      } else {
        this.shakeOffset.x = 0;
        this.shakeOffset.y = 0;
      }

      // Add slight continuous engine vibration when boosting
      if (player.isNitroActive) {
        this.shakeOffset.x += (Math.random() * 2 - 1) * 2.5;
        this.shakeOffset.y += (Math.random() * 2 - 1) * 2.5;
      }
    }
  }

  window.UR = window.UR || {};
  window.UR.Camera = Camera;
})();
