/**
 * Bus Simulator - Passenger Configuration
 * Controls passenger generation rates, destination distribution,
 * queue management, and boarding/alighting parameters.
 */

(function () {
  'use strict';

  const PassengerConfig = {

    // Whether passenger system is active
    active: true,

    // Maximum passengers that can wait at a single stop
    maxQueuePerStop: 30,

    // Passenger spawn interval at each stop (seconds)
    spawnInterval: {
      highway: 15,
      state_highway: 12,
      local_road: 8,
      village_road: 5
    },

    // Passengers spawned per interval (base amount)
    spawnRate: 1.5,

    // Time of day multipliers for passenger spawn rate
    timeOfDayMultipliers: {
      dawn: 1.5,      // 5am-8am (rush hour)
      day: 1.0,       // 8am-6pm
      evening: 1.8,    // 6pm-8pm (rush hour)
      night: 0.3      // 8pm-5am
    },

    // Passenger category weights for generation
    categoryWeights: {
      commuter: 0.45,
      student: 0.20,
      worker: 0.15,
      tourist: 0.05,
      senior: 0.10,
      business: 0.05
    },

    // Waiting tolerance (passengers leave if waiting too long)
    patienceMultipliers: {
      highway: 1.5,
      state_highway: 1.2,
      local_road: 1.0,
      village_road: 2.0
    },

    // Boarding configuration
    boarding: {
      // Seconds per passenger to board
      timePerPassenger: 2.5,
      // Seconds per passenger to alight
      alightTimePerPassenger: 1.5,
      // Batch size (how many board per tick)
      batchSize: 1,
      // Whether children/elderly board slower
      slowBoardingMultiplier: 1.5
    },

    // Fare calculation
    fare: {
      // Base fare per km
      basePerKm: 8.0,
      // Minimum fare
      minimum: 10,
      // Maximum fare
      maximum: 500,
      // Distance calculation uses Euclidean world distance
      useStraightLine: true
    },

    // Stop detection configuration
    stopDetection: {
      // Maximum speed (km/h) at which boarding can begin
      maxBoardingSpeed: 5,
      // Distance tolerance from stop center
      stopDistanceTolerance: 50,
      // Minimum stop duration (seconds) before boarding completes
      minStopDuration: 2.0,
      // Maximum wait time for passengers before they leave
      maxWaitBeforeLeave: 180,
      // Angle tolerance for proper bus facing (radians)
      angleTolerance: 0.8
    },

    // Capacity configuration
    capacity: {
      // Buses support standing passengers (additional overflow)
      allowStanding: true,
      standingRatio: 0.3,  // 30% of seated capacity can stand
      // Weight factor for large passengers (affects effective capacity)
      passengerWeight: 1.0
    },

    // Debug
    debug: {
      showDestinations: false,
      showQueues: false,
      showBoardingZones: false,
      showPassengerStates: false,
      enabled: false
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.PassengerConfig = PassengerConfig;
  }
  if (typeof module !== 'undefined') {
    module.exports = PassengerConfig;
  }
})();
