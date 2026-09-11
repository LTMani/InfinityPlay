/**
 * InfinityPlay Ultimate Racing - Civilian Traffic System
 * Spawns and manages procedural civilian traffic along track lanes
 */

(function() {
  const TRAFFIC_MODELS = [
    { type: 'sedan', color: '#64748b', accent: '#94a3b8', width: 1.1, length: 1.2 },
    { type: 'van', color: '#334155', accent: '#475569', width: 1.2, length: 1.4 },
    { type: 'cruiser', color: '#4338ca', accent: '#6366f1', width: 1.15, length: 1.3 },
    { type: 'taxi', color: '#eab308', accent: '#ca8a04', width: 1.1, length: 1.2 },
    { type: 'sport', color: '#059669', accent: '#10b981', width: 1.1, length: 1.2 }
  ];

  const LANES = [-0.65, -0.22, 0.22, 0.65];

  class TrafficVehicle {
    constructor(z, laneIndex, trackLength) {
      this.init(z, laneIndex, trackLength);
    }

    init(z, laneIndex, trackLength) {
      this.model = TRAFFIC_MODELS[Math.floor(Math.random() * TRAFFIC_MODELS.length)];
      this.x = LANES[laneIndex % LANES.length];
      this.z = z;
      // Civilian speed is lower than racing speed (~40-60% of player speed)
      this.speed = 3800 + Math.random() * 2400;
      this.trackLength = trackLength;
      this.percent = (this.z % trackLength) / trackLength;
    }

    update(dt, playerZ, trackLength) {
      this.z += this.speed * dt;
      this.percent = (this.z % trackLength) / trackLength;

      // Despawn behind player and respawn ahead
      if (playerZ - this.z > 800) {
        // Respawn ahead of player safely
        this.z = playerZ + 3500 + Math.random() * 6000;
        this.x = LANES[Math.floor(Math.random() * LANES.length)];
        this.speed = 3800 + Math.random() * 2400;
        this.model = TRAFFIC_MODELS[Math.floor(Math.random() * TRAFFIC_MODELS.length)];
      }
    }
  }

  class TrafficManager {
    constructor() {
      this.vehicles = [];
      this.maxVehicles = 0;
    }

    init(trackLength, startZ = 2000) {
      this.vehicles = [];
    }

    update(dt, playerZ, trackLength) {
      // Civilian traffic disabled: pure racing between user and AI cars
    }

    getVehicles() {
      return this.vehicles;
    }
  }

  window.UR = window.UR || {};
  window.UR.TrafficManager = TrafficManager;
})();

