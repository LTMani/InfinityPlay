/**
 * Bus Simulator - Master Game Configuration
 * Centralized configuration constants for all game tunables
 */

(function () {
  'use strict';

  const GameConfig = {

    // ===== Display =====
    canvas: {
      width: 1280,
      height: 720,
      aspectRatio: 16 / 9
    },

    // ===== Game States =====
    states: {
      BOOT: 'boot',
      MENU: 'menu',
      GARAGE: 'garage',
      CUSTOMIZATION: 'customization',
      PLAYING: 'playing',
      PAUSED: 'paused',
      MISSION_COMPLETE: 'mission_complete',
      GAME_OVER: 'game_over'
    },

    // ===== Player Settings =====
    player: {
      startingMoney: 50000,
      startingBankLoan: 0,
      startingXp: 0,
      startingLevel: 1,
      xpPerLevel: 1000,
      maxLevel: 100
    },

    // ===== Bus Physics =====
    physics: {
      // Base bus parameters
      maxSpeed: 65,            // km/h (top speed for most buses)
      maxSpeedHighway: 80,     // km/h on highways
      maxSpeedCity: 40,        // km/h in city limits
      acceleration: 8.0,       // m/s^2 rate of acceleration
      maxAcceleration: 12.0,
      deceleration: 10.0,
      brakeDeceleration: 25.0,
      maxSteeringAngle: 35,    // degrees
      steeringReturnSpeed: 4.0,
      turnRate: 1.8,           // degrees per frame at given speed
      idleRPM: 600,
      redlineRPM: 3200,

      // Drag / friction
      airResistance: 0.0008,
      rollingResistance: 0.012,

      // Fuel consumption (liters per 100 km)
      fuelConsumptionBase: 45.0,

      // Passenger capacity
      maxPassengers: 40,

      // Boarding / alighting time per passenger (seconds)
      boardingTime: 2.5,
      alightingTime: 1.5
    },

    // ===== World Scale =====
    world: {
      pixelsPerKm: 400,
      mapScale: 0.5,        // minimap scale factor
      cityRadius: 1200,     // px from city center
      stopDensity: 0.7      // fraction of roads that have stops
    },

    // ===== Economy Multipliers =====
    economy: {
      // Base fare per km (game coins)
      baseFarePerKm: 12.5,
      // Night premium multiplier (00:00 - 05:00)
      nightPremium: 1.25,
      // Weekend premium
      weekendPremium: 1.15,
      // Weather penalty
      rainEffect: 0.9,
      // Toll cost ranges
      tollMin: 20,
      tollMax: 120,
      // Fuel price per liter (coins)
      fuelPrice: 85,
      // Maintenance cost multipliers
      maintenancePerKm: 3.5,
      // Ticket price multiplier
      ticketMultiplier: 1.0,
      // Damage repair cost per %
      damageRepairCost: 150
    },

    // ===== Region Settings =====
    regions: {
      ap: {
        name: 'Andhra Pradesh',
        color: '#f4a261',
        cities: ['Vijayawada', 'Guntur', 'Visakhapatnam', 'Tirupati',
          'Nellore', 'Kurnool', 'Rajahmundry', 'Kadapa',
          'Anantapur', 'Amaravati']
      },
      tz: {
        name: 'Telangana',
        color: '#2a9d8f',
        cities: ['Hyderabad', 'Warangal', 'Karimnagar',
          'Nizamabad', 'Khammam', 'Nalgonda']
      }
    },

    // ===== Time Scale =====
    time: {
      gameSecondsPerRealSecond: 60,  // 1 real sec = 1 min game time
      dayLengthSeconds: 24 * 60,     // 24 min day (scaled)
      dawnStart: 5,
      dayStart: 6,
      duskStart: 18,
      nightStart: 19
    },

    // ===== Save System =====
    save: {
      key: 'bus_simulator_save_data',
      autoSaveInterval: 15000  // 15 seconds
    },

    // ===== Achievement Thresholds =====
    achievements: {
      firstTripDistance: 10,
      totalDistance: 1000,
      perfectOnTime: 5,
      totalPassengersServed: 500,
      totalRevenue: 100000
    },

    // ===== Debug =====
    debug: {
      showFPS: false,
      showGrid: false,
      showColliders: false,
      invincible: false
    },

    // ===== UI Constants =====
    ui: {
      speedoWidth: 200,
      speedoHeight: 200,
      navLineWidth: 220
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.GameConfig = GameConfig;
  }
  if (typeof module !== 'undefined') {
    module.exports = GameConfig;
  }
})();
