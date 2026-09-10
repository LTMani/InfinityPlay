/**
 * Bus Simulator - Traffic Configuration
 * Controls traffic density, spawning rules, optimization, and AI behavior.
 * All values are data-driven and configurable.
 */

(function () {
  'use strict';

  const TrafficConfig = {

    active: true,

    // Maximum total AI traffic vehicles active at once
    maxVehicles: 60,

    // Maximum AI buses (public/private service buses)
    maxAIBuses: 12,

    // Spawn rate (seconds between spawn attempts)
    spawnInterval: 1.0,

    // Minimum distance from player to spawn a vehicle
    playerSpawnExclusionRadius: 600,

    // Minimum distance from player to keep a vehicle active
    playerDespawnRadius: 1200,

    // Distance threshold for considering a vehicle "near" the player for AI awareness
    playerAwarenessRadius: 200,

    // Traffic density multiplier per road type (0.0 to 1.0)
    densityByRoadType: {
      highway: 0.8,
      state_highway: 0.7,
      local_road: 0.9,
      village_road: 0.4
    },

    // Base spawn rates per road type (vehicles per spawn interval)
    spawnRateByRoadType: {
      highway: 0.4,
      state_highway: 0.6,
      local_road: 0.8,
      village_road: 0.3
    },

    // Vehicle category distribution weights (for fallback when no road-type filter)
    categoryWeights: {
      two_wheeler: 0.25,
      three_wheeler: 0.15,
      passenger: 0.35,
      goods: 0.15,
      public_transport: 0.15,
      agricultural: 0.05
    },

    // Safe distance configuration
    safeDistance: {
      // Base multiplier applied to vehicle length
      multiplier: 2.0,
      // Minimum safe distance in world units
      minimum: 12,
      // Speed-proportional additional distance
      speedFactor: 0.5
    },

    // AI driving behavior parameters
    ai: {
      // How often (seconds) the AI re-evaluates its path/target
      reevaluateInterval: 0.5,
      // Steering sensitivity (higher = more responsive)
      steeringSensitivity: 2.5,
      // How much the AI brakes when an obstacle is detected (multiplier of deceleration)
      obstacleBrakeFactor: 1.0,
      // Distance at which AI starts reacting to obstacles
      obstacleDetectionRange: 80,
      // Speed variance for individual vehicles (random factor)
      speedVariance: 0.15,
      // Lane change probability per second
      laneChangeProbability: 0.2,
      // Minimum time to stay in a lane before changing
      laneMinHoldTime: 3.0
    },

    // Intersection behavior
    intersections: {
      // Probability of taking each exit at an intersection (0-1)
      turnProbability: 0.35,
      // Probability of going straight at an intersection
      straightProbability: 0.5,
      // Probability of turning left (Indian: drive on left)
      leftProbability: 0.1,
      // Probability of turning right
      rightProbability: 0.05,
      // Minimum stop time at an intersection (seconds)
      minStopTime: 1.0,
      // Maximum stop time at an intersection (seconds)
      maxStopTime: 3.0
    },

    // Roundabout behavior
    roundabouts: {
      // Probability of entering a roundabout
      entryProbability: 0.7,
      // Minimum circulation speed (km/h)
      minCirculationSpeed: 15,
      // Exit after N connections (1 = first exit)
      preferFirstExit: true,
      // Circulating direction: true = clockwise (India)
      clockwise: true
    },

    // Optimization settings
    optimization: {
      // Only update vehicles within this distance of the camera
      updateRadius: 1500,
      // Only draw vehicles within this distance of the camera
      drawRadius: 1800,
      // How often (seconds) to check for despawn candidates
      despawnCheckInterval: 2.0,
      // Despawn vehicles this far beyond the map bounds
      mapMargin: 500
    },

    // Debug settings (disabled by default)
    debug: {
      showPaths: false,
      showSpawnPoints: false,
      showDespawnPoints: false,
      showSafeDistance: false,
      showSpeed: false,
      showActiveCount: false,
      // Enable by setting via GameConfig or URL param ?traffic_debug=1
      enabled: false
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.TrafficConfig = TrafficConfig;
  }
  if (typeof module !== 'undefined') {
    module.exports = TrafficConfig;
  }
})();
