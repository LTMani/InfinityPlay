/**
 * InfinityPlay Ultimate Racing - Collision System
 * Handles vehicle-vehicle, barrier, and off-road boundary collisions with physical feedback
 */

(function() {
  class CollisionSystem {
    constructor() {
      this.CAR_WIDTH_NORM = 0.34;  // normalized lateral width (-1 to 1 road)
      this.CAR_LENGTH_Z = 130;     // depth overlap distance in world units
    }

    checkCollisions(player, aiManager, trafficManager, particleSystem, camera, audio) {
      if (player.hasFinished) return;

      const playerZ = player.z;
      const playerX = player.x;

      if (player.collisionCooldown > 0) {
        player.collisionCooldown -= 0.016;
      }

      // 1. Player vs Civilian Traffic
      const traffic = trafficManager.getVehicles();
      for (const vehicle of traffic) {
        const dz = Math.abs(vehicle.z - playerZ);
        if (dz < this.CAR_LENGTH_Z) {
          const dx = Math.abs(vehicle.x - playerX);
          if (dx < this.CAR_WIDTH_NORM) {
            this.handleVehicleCollision(player, vehicle, particleSystem, camera, audio);
            break;
          }
        }
      }

      // 2. Player vs AI Opponents
      const aiList = aiManager.getOpponents();
      for (const ai of aiList) {
        const dz = Math.abs(ai.z - playerZ);
        if (dz < this.CAR_LENGTH_Z) {
          const dx = Math.abs(ai.x - playerX);
          if (dx < this.CAR_WIDTH_NORM) {
            this.handleAICollision(player, ai, particleSystem, camera, audio);
            break;
          }
        }
      }

      // 3. Player vs Side Barriers (when player reaches boundary |x| >= 0.89)
      if (Math.abs(player.x) >= 0.89 && player.collisionCooldown <= 0 && Math.abs(player.speed) > 300) {
        this.handleBarrierCollision(player, particleSystem, camera, audio);
      }
    }

    handleVehicleCollision(player, vehicle, particleSystem, camera, audio) {
      if (player.collisionCooldown > 0) return;

      player.collisionCooldown = 0.45;
      player.perfectLapCandidate = false;

      // Drop speed significantly
      const impactRatio = Math.min(1.0, player.speed / (player.effectiveStats?.maxSpeed || 8000));
      player.speed = Math.max(0, player.speed * 0.45);

      // Lateral pushback
      const pushDirection = player.x > vehicle.x ? 0.35 : -0.35;
      player.x += pushDirection;
      vehicle.x -= pushDirection * 0.5;

      // Audio, camera shake & sparks
      if (audio) audio.playCollision(impactRatio);
      if (camera) camera.shake(12 * impactRatio, 0.3);
      if (particleSystem) {
        particleSystem.spawnSparks(player.x, player.z, 20);
        particleSystem.spawnDebris(player.x, player.z, 8);
      }
    }

    handleAICollision(player, ai, particleSystem, camera, audio) {
      if (player.collisionCooldown > 0) return;

      player.collisionCooldown = 0.35;
      player.perfectLapCandidate = false;

      // Moderate speed bump
      const impactRatio = Math.min(1.0, player.speed / (player.effectiveStats?.maxSpeed || 8000));
      player.speed = Math.max(0, player.speed * 0.65);
      ai.speed = Math.max(0, ai.speed * 0.7);

      // Bounce apart
      const pushDir = player.x > ai.x ? 0.25 : -0.25;
      player.x += pushDir;
      ai.x -= pushDir;

      if (audio) audio.playCollision(impactRatio * 0.8);
      if (camera) camera.shake(8 * impactRatio, 0.25);
      if (particleSystem) {
        particleSystem.spawnSparks(player.x, player.z, 15);
      }
    }

    handleBarrierCollision(player, particleSystem, camera, audio) {
      player.collisionCooldown = 0.25;
      player.perfectLapCandidate = false;

      const impactRatio = Math.min(1.0, Math.abs(player.speed) / (player.effectiveStats?.maxSpeed || 8000));
      player.speed = Math.max(0, player.speed * 0.75);

      // Clamp to barrier limit
      player.x = player.x > 0 ? 0.90 : -0.90;

      if (audio) audio.playCollision(impactRatio * 0.6);
      if (camera) camera.shake(6 * impactRatio, 0.2);
      if (particleSystem) {
        particleSystem.spawnSparks(player.x > 0 ? 1.0 : -1.0, player.z, 14);
      }
    }
  }

  window.UR = window.UR || {};
  window.UR.collision = new CollisionSystem();
})();

