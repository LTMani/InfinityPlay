/**
 * TrafficManager.js
 * Manages the dynamic spawning, lane population, continuous recycling,
 * and AI simulation of ambient traffic vehicles.
 */

import { TrafficVehicle } from './TrafficVehicle.js';

export class TrafficManager {
  constructor(scene) {
    this.scene = scene;
    this.vehicles = [];
    this.maxVehicles = 10;

    // Traffic variety configuration
    this.vehicleTemplates = [
      { type: 'sedan', color: 0xef4444 }, // Red
      { type: 'sedan', color: 0x3b82f6 }, // Blue
      { type: 'sedan', color: 0xe2e8f0 }, // Silver
      { type: 'sedan', color: 0x10b981 }, // Emerald
      { type: 'taxi',  color: 0xeab308 }, // Yellow Cab
      { type: 'taxi',  color: 0xeab308 }, // Yellow Cab
      { type: 'van',   color: 0x0284c7 }, // Sky Blue Delivery
      { type: 'van',   color: 0x475569 }, // Slate Van
      { type: 'sedan', color: 0x8b5cf6 }, // Purple
      { type: 'sedan', color: 0x0f172a }  // Dark Onyx
    ];

    // Near-miss tracking set to prevent multiple triggers for one overtake
    this.nearMissCooldowns = new Map();

    this._initPool();
  }

  _initPool() {
    for (let i = 0; i < this.maxVehicles; i++) {
      const template = this.vehicleTemplates[i % this.vehicleTemplates.length];
      const vehicle = new TrafficVehicle(this.scene, template.type, template.color);
      this.vehicles.push(vehicle);
    }
  }

  /**
   * Initializes initial traffic layout starting from z = -60m ahead of player.
   */
  init(playerZ = 0) {
    // Clear cooldowns
    this.nearMissCooldowns.clear();

    const lanePositions = [-5.7, -1.9, 1.9, 5.7];
    const initialSpacing = 35; // meters between spawns

    this.vehicles.forEach((vehicle, idx) => {
      const lane = idx % lanePositions.length;
      // Stagger along -Z ahead of player (from -60m to -380m)
      const spawnZ = playerZ - 60 - idx * initialSpacing - Math.random() * 15;
      const speed = 55 + Math.random() * 25; // 55 to 80 km/h
      vehicle.spawn(lane, spawnZ, speed);
    });
  }

  /**
   * Main per-frame update loop for traffic.
   * @param {number} dt Delta time
   * @param {Object} playerPhysics Player physics state { position, speed, heading }
   * @param {Array<Object>} worldObstacles Static obstacles from CollisionSystem
   * @param {function} onNearMiss Callback when player skims closely past traffic
   */
  update(dt, playerPhysics, worldObstacles, onNearMiss) {
    const playerZ = playerPhysics ? playerPhysics.position.z : 0;
    const playerSpeed = playerPhysics ? playerPhysics.speed : 0;

    for (let i = 0; i < this.vehicles.length; i++) {
      const vehicle = this.vehicles[i];
      vehicle.update(dt, this.vehicles, playerPhysics, worldObstacles);

      // Check for recycling
      // Since driving forward moves along -Z:
      // A vehicle is behind player if vehicle.position.z > playerZ + 70
      // A vehicle is too far ahead if vehicle.position.z < playerZ - 420
      const isTooFarBehind = vehicle.position.z > playerZ + 75;
      const isTooFarAhead = vehicle.position.z < playerZ - 450;

      if (isTooFarBehind || isTooFarAhead) {
        this._recycleVehicle(vehicle, playerZ);
      }

      // Check for Near-Miss bonus
      // Occurs when player overtakes traffic at high speed (> 50 km/h) with very close lateral margin (< 2.2m)
      if (playerPhysics && onNearMiss && playerSpeed > 14.0) { // > ~50 km/h
        const dx = Math.abs(playerPhysics.position.x - vehicle.position.x);
        const dz = Math.abs(playerPhysics.position.z - vehicle.position.z);

        if (dx > 1.2 && dx < 2.4 && dz < 2.5) {
          const now = performance.now();
          const lastTime = this.nearMissCooldowns.get(vehicle) || 0;

          if (now - lastTime > 4000) {
            this.nearMissCooldowns.set(vehicle, now);
            onNearMiss(vehicle);
          }
        }
      }
    }
  }

  _recycleVehicle(vehicle, playerZ) {
    // Find open lane at the forward spawn horizon (~180m to ~320m ahead)
    const spawnZ = playerZ - 180 - Math.random() * 140;

    // Pick lane with least congestion around spawnZ
    let bestLane = Math.floor(Math.random() * 4);
    let minNearby = 999;

    for (let lane = 0; lane < 4; lane++) {
      let nearby = 0;
      const laneX = [-5.7, -1.9, 1.9, 5.7][lane];
      for (let j = 0; j < this.vehicles.length; j++) {
        const v = this.vehicles[j];
        if (v === vehicle) continue;
        if (Math.abs(v.position.x - laneX) < 1.8 && Math.abs(v.position.z - spawnZ) < 30) {
          nearby++;
        }
      }
      if (nearby < minNearby) {
        minNearby = nearby;
        bestLane = lane;
      }
    }

    const speed = 55 + Math.random() * 25;
    vehicle.spawn(bestLane, spawnZ, speed);
  }

  reset(playerZ = 0) {
    this.init(playerZ);
  }

  clear() {
    this.vehicles.forEach(v => v.dispose());
    this.vehicles = [];
  }
}

