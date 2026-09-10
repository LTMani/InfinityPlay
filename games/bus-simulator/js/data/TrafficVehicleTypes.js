/**
 * Bus Simulator - Traffic Vehicle Types
 * Configurable vehicle categories for Indian-inspired road traffic.
 * Each type defines physical dimensions, performance, and road preferences.
 */

(function () {
  'use strict';

  const TrafficVehicleTypes = {
    byId: {},

    all: [],

    getById(id) {
      return this.byId[id] || this.all[0];
    },

    getByRoadType(roadType) {
      const valid = [];
      for (let i = 0; i < this.all.length; i++) {
        const vt = this.all[i];
        if (vt.roadTypes.indexOf(roadType) >= 0) {
          valid.push(vt);
        }
      }
      return valid;
    },

    getRandom(roadType) {
      const pool = roadType ? this.getByRoadType(roadType) : this.all;
      if (pool.length === 0) return this.all[0];
      return pool[Math.floor(Math.random() * pool.length)];
    }
  };

  const types = [
    // ================================================================
    // TWO-WHEELED VEHICLES
    // ================================================================
    {
      id: 'motorcycle',
      category: 'two_wheeler',
      name: 'Motorcycle',
      roadTypes: ['highway', 'state_highway', 'local_road', 'village_road'],
      width: 0.8,
      length: 2.0,
      maxSpeed: 90,
      acceleration: 15.0,
      braking: 30.0,
      turnRate: 2.5,
      maxSteeringAngle: 40,
      speedVariance: 0.3,
      safeDistance: 15,
      lanePreference: 'edge',
      colorVariants: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ffffff', '#f9fafb'],
      spawnWeight: 1.0,
      liveryPattern: 'solid'
    },
    {
      id: 'scooter',
      category: 'two_wheeler',
      name: 'Scooter',
      roadTypes: ['highway', 'state_highway', 'local_road', 'village_road'],
      width: 0.7,
      length: 1.8,
      maxSpeed: 65,
      acceleration: 12.0,
      braking: 25.0,
      turnRate: 2.8,
      maxSteeringAngle: 42,
      speedVariance: 0.25,
      safeDistance: 12,
      lanePreference: 'edge',
      colorVariants: ['#ec4899', '#a855f7', '#06b6d4', '#fbbf24', '#ffffff', '#fcd34d'],
      spawnWeight: 1.2,
      liveryPattern: 'solid'
    },

    // ================================================================
    // THREE-WHEELED VEHICLES
    // ================================================================
    {
      id: 'auto_rikshaw',
      category: 'three_wheeler',
      name: 'Auto Rickshaw',
      roadTypes: ['local_road', 'village_road', 'state_highway'],
      width: 1.5,
      length: 3.0,
      maxSpeed: 55,
      acceleration: 8.0,
      braking: 20.0,
      turnRate: 2.2,
      maxSteeringAngle: 38,
      speedVariance: 0.2,
      safeDistance: 18,
      lanePreference: 'middle',
      colorVariants: ['#fbbf24', '#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#ffffff'],
      spawnWeight: 0.8,
      liveryPattern: 'solid'
    },

    // ================================================================
    // FOUR-WHEELED PASSENGER VEHICLES
    // ================================================================
    {
      id: 'car',
      category: 'passenger',
      name: 'Car',
      roadTypes: ['highway', 'state_highway', 'local_road', 'village_road'],
      width: 1.8,
      length: 4.2,
      maxSpeed: 85,
      acceleration: 10.0,
      braking: 28.0,
      turnRate: 1.8,
      maxSteeringAngle: 35,
      speedVariance: 0.15,
      safeDistance: 25,
      lanePreference: 'any',
      colorVariants: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f97316', '#ffffff', '#1e293b'],
      spawnWeight: 1.5,
      liveryPattern: 'solid'
    },
    {
      id: 'suv',
      category: 'passenger',
      name: 'SUV',
      roadTypes: ['highway', 'state_highway', 'local_road'],
      width: 2.0,
      length: 4.8,
      maxSpeed: 80,
      acceleration: 9.0,
      braking: 26.0,
      turnRate: 1.6,
      maxSteeringAngle: 34,
      speedVariance: 0.15,
      safeDistance: 30,
      lanePreference: 'any',
      colorVariants: ['#1e293b', '#0f172a', '#334155', '#475569', '#64748b', '#ffffff'],
      spawnWeight: 1.0,
      liveryPattern: 'solid'
    },
    {
      id: 'van',
      category: 'passenger',
      name: 'Van',
      roadTypes: ['highway', 'state_highway', 'local_road', 'village_road'],
      width: 2.0,
      length: 5.2,
      maxSpeed: 75,
      acceleration: 7.0,
      braking: 24.0,
      turnRate: 1.4,
      maxSteeringAngle: 32,
      speedVariance: 0.1,
      safeDistance: 32,
      lanePreference: 'middle',
      colorVariants: ['#f59e0b', '#eab308', '#ca8a04', '#a16207', '#ffffff', '#dc2626'],
      spawnWeight: 0.8,
      liveryPattern: 'solid'
    },

    // ================================================================
    // GOODS / COMMERCIAL VEHICLES
    // ================================================================
    {
      id: 'mini_truck',
      category: 'goods',
      name: 'Mini Truck',
      roadTypes: ['highway', 'state_highway', 'local_road'],
      width: 2.0,
      length: 5.5,
      maxSpeed: 70,
      acceleration: 6.0,
      braking: 22.0,
      turnRate: 1.2,
      maxSteeringAngle: 30,
      speedVariance: 0.1,
      safeDistance: 35,
      lanePreference: 'middle',
      colorVariants: ['#10b981', '#16a34a', '#15883e', '#22c55e', '#4ade80', '#ffffff'],
      spawnWeight: 0.6,
      liveryPattern: 'solid'
    },
    {
      id: 'truck',
      category: 'goods',
      name: 'Truck',
      roadTypes: ['highway', 'state_highway'],
      width: 2.4,
      length: 10.0,
      maxSpeed: 65,
      acceleration: 5.0,
      braking: 20.0,
      turnRate: 0.8,
      maxSteeringAngle: 28,
      speedVariance: 0.1,
      safeDistance: 50,
      lanePreference: 'right',
      colorVariants: ['#f59e0b', '#d97706', '#b45309', '#92400e', '#facc15', '#ffffff'],
      spawnWeight: 0.7,
      liveryPattern: 'striped'
    },

    // ================================================================
    // PUBLIC TRANSPORT
    // ================================================================
    {
      id: 'public_bus',
      category: 'public_transport',
      name: 'RTC Bus',
      roadTypes: ['highway', 'state_highway', 'local_road'],
      width: 2.5,
      length: 12.0,
      maxSpeed: 75,
      acceleration: 5.5,
      braking: 18.0,
      turnRate: 1.0,
      maxSteeringAngle: 30,
      speedVariance: 0.1,
      safeDistance: 40,
      lanePreference: 'middle',
      colorVariants: ['#f59e0b', '#10b981', '#0e4a6e', '#dc2626', '#ffffff'],
      spawnWeight: 0.6,
      liveryPattern: 'rtc'
    },
    {
      id: 'private_bus',
      category: 'public_transport',
      name: 'Private Bus',
      roadTypes: ['highway', 'state_highway', 'local_road'],
      width: 2.5,
      length: 13.0,
      maxSpeed: 80,
      acceleration: 6.0,
      braking: 20.0,
      turnRate: 1.1,
      maxSteeringAngle: 32,
      speedVariance: 0.15,
      safeDistance: 40,
      lanePreference: 'middle',
      colorVariants: ['#ef4444', '#3b82f6', '#8b5cf6', '#f97316', '#10b981', '#ffffff'],
      spawnWeight: 0.5,
      liveryPattern: 'private'
    },

    // ================================================================
    // AGRICULTURAL / SPECIAL PURPOSE
    // ================================================================
    {
      id: 'agricultural_tractor',
      category: 'agricultural',
      name: 'Tractor',
      roadTypes: ['village_road', 'local_road'],
      width: 2.0,
      length: 3.8,
      maxSpeed: 25,
      acceleration: 3.0,
      braking: 10.0,
      turnRate: 1.5,
      maxSteeringAngle: 35,
      speedVariance: 0.15,
      safeDistance: 20,
      lanePreference: 'edge',
      colorVariants: ['#a16207', '#f59e0b', '#eab308', '#ffffff'],
      spawnWeight: 0.3,
      liveryPattern: 'solid'
    },
    {
      id: 'agricultural_tractor_with_trailer',
      category: 'agricultural',
      name: 'Tractor with Trailer',
      roadTypes: ['village_road', 'local_road'],
      width: 2.2,
      length: 8.0,
      maxSpeed: 20,
      acceleration: 2.5,
      braking: 8.0,
      turnRate: 1.0,
      maxSteeringAngle: 30,
      speedVariance: 0.1,
      safeDistance: 40,
      lanePreference: 'edge',
      colorVariants: ['#a16207', '#f59e0b', '#eab308', '#ffffff'],
      spawnWeight: 0.2,
      liveryPattern: 'solid'
    }
  ];

  for (let i = 0; i < types.length; i++) {
    const vt = types[i];
    TrafficVehicleTypes.all.push(vt);
    TrafficVehicleTypes.byId[vt.id] = vt;
  }

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.TrafficVehicleTypes = TrafficVehicleTypes;
  }
  if (typeof module !== 'undefined') {
    module.exports = TrafficVehicleTypes;
  }
})();
