/** Railway Commander - Standalone Game Bundle */
(function() {
  "use strict";

  // --- Module: engine/TrainPhysics.js ---
  ﻿/**
   * Railway Commander - Train Physics Engine
   * Simulates momentum, tractive effort, progressive pneumatic brakes,
   * rolling resistance, aerodynamic drag, and speed limits.
   */
  
  class TrainPhysics {
    constructor(config = {}) {
      // Train Physical Attributes
      this.massKg = config.massKg || 180000; // 180 tons (Locomotive + 4 passenger coaches)
      this.maxSpeedKmh = config.maxSpeedKmh || 140; // Max rated locomotive speed
      this.maxPowerKw = config.maxPowerKw || 3200; // Electric/Diesel-Electric horsepower
      
      // Controls State
      this.throttleLevel = 0; // 0, 1, 2, 3, 4, 5
      this.brakeLevel = 0;    // 0, 1, 2, 3, 4, 5
      this.emergencyBrake = false;
      this.headlights = true;
      this.hornActive = false;
  
      // Kinematic State
      this.speedKmh = 0;       // Current speed in km/h
      this.speedMs = 0;        // Current speed in m/s
      this.positionMeters = 0; // Distance traveled along the track (m)
      this.accelerationMs2 = 0;// Current acceleration in m/s^2
      this.speedLimitKmh = 80; // Default line speed limit
  
      // Resistance Coefficients (Davis Equation inspired)
      this.cRoll = 0.0015;      // Rolling friction coefficient
      this.cAero = 0.00035;     // Aerodynamic drag coefficient
      this.gravity = 9.81;
  
      // Overspeed Tracking
      this.overspeedTimer = 0;
      this.overspeedWarning = false;
    }
  
    reset(startPosition = 0, initialSpeed = 0) {
      this.throttleLevel = 0;
      this.brakeLevel = 0;
      this.emergencyBrake = false;
      this.speedKmh = initialSpeed;
      this.speedMs = (initialSpeed * 1000) / 3600;
      this.positionMeters = startPosition;
      this.accelerationMs2 = 0;
      this.overspeedTimer = 0;
      this.overspeedWarning = false;
    }
  
    setThrottle(level) {
      this.throttleLevel = Math.max(0, Math.min(5, Math.round(level)));
      if (this.throttleLevel > 0 && this.emergencyBrake) {
        this.emergencyBrake = false;
      }
    }
  
    setBrake(level) {
      this.brakeLevel = Math.max(0, Math.min(5, Math.round(level)));
      if (this.brakeLevel > 0) {
        this.emergencyBrake = false;
      }
    }
  
    throttleUp() {
      if (this.throttleLevel < 5) {
        this.setThrottle(this.throttleLevel + 1);
        return true;
      }
      return false;
    }
  
    throttleDown() {
      if (this.throttleLevel > 0) {
        this.setThrottle(this.throttleLevel - 1);
        return true;
      }
      return false;
    }
  
    brakeUp() {
      if (this.brakeLevel < 5) {
        this.setBrake(this.brakeLevel + 1);
        return true;
      }
      return false;
    }
  
    brakeDown() {
      if (this.brakeLevel > 0) {
        this.setBrake(this.brakeLevel - 1);
        return true;
      }
      return false;
    }
  
    applyEmergencyBrake() {
      this.emergencyBrake = true;
      this.throttleLevel = 0;
      this.brakeLevel = 5;
    }
  
    releaseEmergencyBrake() {
      this.emergencyBrake = false;
      this.brakeLevel = 0;
    }
  
    toggleHeadlights() {
      this.headlights = !this.headlights;
      return this.headlights;
    }
  
    setHorn(active) {
      this.hornActive = Boolean(active);
    }
  
    setSpeedLimit(kmh) {
      this.speedLimitKmh = Math.max(20, kmh);
    }
  
    /**
     * Physics Integration Loop
     * @param {number} dt Seconds elapsed since last frame
     */
    update(dt) {
      if (dt <= 0) return;
      dt = Math.min(dt, 0.1); // clamp delta time for numerical stability
  
      // 1. Calculate Tractive Effort (Acceleration Force)
      let tractiveForce = 0;
      if (this.throttleLevel > 0 && !this.emergencyBrake) {
        // Throttle notches: 1 = 18%, 2 = 38%, 3 = 60%, 4 = 82%, 5 = 100%
        const throttleFactors = [0, 0.18, 0.38, 0.60, 0.82, 1.0];
        const appliedPowerKw = this.maxPowerKw * throttleFactors[this.throttleLevel];
  
        // F = P / v at speed; at low speeds use starting tractive effort limit
        const currentV = Math.max(2.5, this.speedMs);
        tractiveForce = (appliedPowerKw * 1000) / currentV;
  
        // Locomotive adhesion limit (cannot exceed wheel grip on steel rails)
        const maxAdhesionForce = this.massKg * 0.22 * this.gravity;
        tractiveForce = Math.min(tractiveForce, maxAdhesionForce);
      }
  
      // 2. Calculate Resistances (Friction + Aerodynamic Drag)
      const rollResistance = this.massKg * this.cRoll * this.gravity;
      const aeroDrag = this.cAero * (this.speedMs * this.speedMs) * 1000;
      const totalResistance = rollResistance + aeroDrag;
  
      // 3. Calculate Braking Force
      let brakeForce = 0;
      if (this.emergencyBrake) {
        // High-friction emergency deceleration (~1.45 m/s^2)
        brakeForce = this.massKg * 1.45;
      } else if (this.brakeLevel > 0) {
        // Progressive service brake notches: 1 = 0.18 m/s^2, 2 = 0.36, 3 = 0.55, 4 = 0.78, 5 = 1.08
        const brakeDecels = [0, 0.18, 0.36, 0.55, 0.78, 1.08];
        brakeForce = this.massKg * brakeDecels[this.brakeLevel];
      }
  
      // 4. Net Force & Acceleration
      let netForce = tractiveForce - totalResistance;
  
      // Apply braking opposing motion
      if (this.speedMs > 0.001) {
        netForce -= brakeForce;
      } else if (this.speedMs < -0.001) {
        netForce += brakeForce;
      }
  
      this.accelerationMs2 = netForce / this.massKg;
  
      // 5. Velocity Integration
      this.speedMs += this.accelerationMs2 * dt;
  
      // Handle stopping cleanly when speed is negligible with active braking or zero power
      if (this.speedMs < 0.05 && (this.brakeLevel > 0 || this.emergencyBrake || tractiveForce === 0)) {
        if (this.throttleLevel === 0) {
          this.speedMs = 0;
          this.accelerationMs2 = 0;
        }
      }
  
      const maxSpeedMs = (this.maxSpeedKmh * 1000) / 3600;
      if (this.speedMs > maxSpeedMs) {
        this.speedMs = maxSpeedMs;
      }
  
      // Forward direction only in normal passenger runs
      if (this.speedMs < 0) {
        this.speedMs = 0;
        this.accelerationMs2 = 0;
      }
  
      // 6. Convert to km/h and update distance
      this.speedKmh = (this.speedMs * 3600) / 1000;
      this.positionMeters += this.speedMs * dt;
  
      // 7. Overspeed monitoring
      const overspeedThreshold = this.speedLimitKmh + 2.0; // 2 km/h margin of error
      if (this.speedKmh > overspeedThreshold) {
        this.overspeedWarning = true;
        this.overspeedTimer += dt;
      } else {
        this.overspeedWarning = false;
        this.overspeedTimer = Math.max(0, this.overspeedTimer - dt * 1.5);
      }
    }
  
    getState() {
      return {
        speedKmh: Math.round(this.speedKmh * 10) / 10,
        speedMs: this.speedMs,
        positionMeters: Math.round(this.positionMeters * 10) / 10,
        positionKm: (this.positionMeters / 1000).toFixed(2),
        acceleration: Math.round(this.accelerationMs2 * 100) / 100,
        throttleLevel: this.throttleLevel,
        brakeLevel: this.brakeLevel,
        emergencyBrake: this.emergencyBrake,
        headlights: this.headlights,
        hornActive: this.hornActive,
        speedLimitKmh: this.speedLimitKmh,
        overspeedWarning: this.overspeedWarning,
        overspeedDuration: this.overspeedTimer,
        isStopped: this.speedKmh < 0.2
      };
    }
  }
  

  // --- Module: engine/TrackManager.js ---
  ﻿/**
   * Railway Commander - Track & Route Manager
   * Generates and manages railway track geometry, curvature,
   * speed limit zones, stations, signals, and procedural scenery elements.
   */
  
  class TrackManager {
    constructor() {
      this.totalDistanceMeters = 5000;
      this.segments = []; // Curvature & elevation segments
      this.speedLimitZones = []; // [{ from, to, limitKmh }]
      this.stations = []; // [{ id, name, stopPosition, platformLength, nameSide }]
      this.signals = []; // [{ id, position, defaultAspect, isDynamic }]
      this.scenery = []; // [{ type, position, offsetSide, scale, variant }]
      this.catenarySpacing = 65; // meters between electrification gantries
    }
  
    /**
     * Load route data for a specific mission
     * @param {Object} routeConfig Mission route definition
     */
    loadRoute(routeConfig) {
      this.totalDistanceMeters = routeConfig.totalDistanceMeters || routeConfig.distanceMeters || 4000;
      this.segments = routeConfig.segments || [
        { from: 0, to: 800, curve: 0, grade: 0 },
        { from: 800, to: 1600, curve: 0.0004, grade: 0.005 },
        { from: 1600, to: 2400, curve: -0.0003, grade: -0.002 },
        { from: 2400, to: this.totalDistanceMeters, curve: 0, grade: 0 }
      ];
  
      this.speedLimitZones = routeConfig.speedLimitZones || [
        { from: 0, to: 800, limitKmh: 60 },
        { from: 800, to: 2800, limitKmh: 100 },
        { from: 2800, to: this.totalDistanceMeters, limitKmh: 50 }
      ];
  
      this.stations = routeConfig.stations || [];
      this.signals = routeConfig.signals || [];
  
      // Build trackside scenery based on route environment
      this.generateScenery(routeConfig.environment || 'city');
    }
  
    generateScenery(environment) {
      this.scenery = [];
  
      // 1. Electrification Catenary Poles (both sides or overhead gantry)
      for (let pos = 20; pos < this.totalDistanceMeters + 300; pos += this.catenarySpacing) {
        this.scenery.push({
          type: 'catenary',
          position: pos,
          side: (Math.floor(pos / this.catenarySpacing) % 2 === 0) ? -1 : 1,
          width: 4.8,
          height: 7.2
        });
      }
  
      // 2. Kilometre / Mileposts every 250m
      for (let pos = 250; pos < this.totalDistanceMeters; pos += 250) {
        this.scenery.push({
          type: 'milepost',
          position: pos,
          side: 1,
          label: (pos / 1000).toFixed(1) + ' km'
        });
      }
  
      // 3. Environment Scenery (Trees, Buildings, Streetlights, Mountain Backdrops)
      const isCity = environment === 'city' || environment === 'industrial';
      const isAlpine = environment === 'alpine' || environment === 'mountain';
  
      const step = 45; // meters
      for (let pos = 40; pos < this.totalDistanceMeters + 200; pos += step) {
        // Check if too close to a station platform
        const nearStation = this.stations.some(st => Math.abs(st.stopPosition - pos) < 120);
  
        // Left side object
        const leftDist = 8 + (pos % 7) * 2.2;
        const rightDist = 8 + (pos % 11) * 2.1;
  
        if (!nearStation) {
          if (isCity) {
            // City skyscrapers / industrial warehouses / billboards
            if (pos % 90 === 0) {
              this.scenery.push({
                type: 'building',
                position: pos,
                side: -1,
                dist: leftDist + 12,
                height: 25 + (pos % 40),
                width: 18 + (pos % 15),
                color: (pos % 2 === 0) ? '#1e293b' : '#0f172a'
              });
            }
            if (pos % 120 === 0) {
              this.scenery.push({
                type: 'building',
                position: pos + 25,
                side: 1,
                dist: rightDist + 14,
                height: 30 + (pos % 35),
                width: 20 + (pos % 12),
                color: '#1e1e38'
              });
            }
          }
  
          // Trackside trees & vegetation
          if (!isCity || pos % 135 !== 0) {
            this.scenery.push({
              type: 'tree',
              position: pos,
              side: -1,
              dist: leftDist,
              scale: 0.8 + (pos % 5) * 0.15,
              variant: (pos % 3)
            });
            this.scenery.push({
              type: 'tree',
              position: pos + 18,
              side: 1,
              dist: rightDist,
              scale: 0.85 + (pos % 4) * 0.12,
              variant: ((pos + 1) % 3)
            });
          }
        }
  
        // Overhead Railway Bridges at key points
        if (pos === 1200 || pos === 2800) {
          this.scenery.push({
            type: 'overhead_bridge',
            position: pos,
            height: 8.5
          });
        }
      }
    }
  
    /**
     * Get track curvature at a specific meter coordinate
     * Returns curve delta for smooth 2.5D perspective bending
     */
    getCurvatureAt(positionMeters) {
      for (const seg of this.segments) {
        if (positionMeters >= seg.from && positionMeters < seg.to) {
          return seg.curve || 0;
        }
      }
      return 0;
    }
  
    /**
     * Get track grade / slope at a specific meter coordinate
     */
    getGradeAt(positionMeters) {
      for (const seg of this.segments) {
        if (positionMeters >= seg.from && positionMeters < seg.to) {
          return seg.grade || 0;
        }
      }
      return 0;
    }
  
    /**
     * Get active speed limit at position
     */
    getSpeedLimitAt(positionMeters) {
      for (const zone of this.speedLimitZones) {
        if (positionMeters >= zone.from && positionMeters < zone.to) {
          return zone.limitKmh;
        }
      }
      return 80;
    }
  
    /**
     * Look ahead for upcoming speed limit change
     */
    getNextSpeedLimitNotice(currentPosition, lookAheadMeters = 800) {
      for (const zone of this.speedLimitZones) {
        if (zone.from > currentPosition && (zone.from - currentPosition) <= lookAheadMeters) {
          return {
            distance: Math.round(zone.from - currentPosition),
            nextLimit: zone.limitKmh
          };
        }
      }
      return null;
    }
  
    /**
     * Get next upcoming station
     */
    getNextStation(currentPosition) {
      for (const st of this.stations) {
        if (st.stopPosition >= currentPosition - 15) {
          return {
            ...st,
            distanceMeters: Math.round(st.stopPosition - currentPosition)
          };
        }
      }
      return null;
    }
  }
  

  // --- Module: engine/SignalSystem.js ---
  /**
   * Railway Commander - Railway Signal System
   * Controls 3-aspect block signals (Green, Yellow, Red),
   * aspect clearance timing, approach warnings, and ATS red-signal violation detection.
   */
  
  class SignalSystem {
    constructor() {
      this.signals = [];
      this.violations = 0;
      this.cautionPenalties = 0;
    }
  
    loadSignals(signalsList) {
      this.violations = 0;
      this.cautionPenalties = 0;
      this.signals = (signalsList || []).map((s, idx) => ({
        id: s.id || `SIG_${idx + 1}`,
        positionMeters: s.positionMeters,
        aspect: s.aspect || 'GREEN',
        initialAspect: s.aspect || 'GREEN',
        clearDistance: s.clearDistance || null,
        clearTimeRemaining: s.clearDelay || null,
        passed: false,
        name: s.name || `Block Signal #${idx + 1}`
      }));
    }
  
    reset() {
      this.violations = 0;
      this.cautionPenalties = 0;
      for (const sig of this.signals) {
        sig.aspect = sig.initialAspect;
        sig.passed = false;
      }
    }
  
    /**
     * Update signal logic and check for violations
     */
    update(trainPosition, speedKmh, dt) {
      let result = {
        failure: false,
        failureReason: '',
        warning: null,
        passedSignal: null
      };
  
      for (const sig of this.signals) {
        const distance = sig.positionMeters - trainPosition;
  
        // 1. Dynamic Signal Clearing Logic
        if (sig.clearDistance && !sig.passed && distance > 0 && distance <= sig.clearDistance) {
          if (sig.aspect === 'RED' && speedKmh <= 45) {
            if (sig.clearTimeRemaining !== null) {
              sig.clearTimeRemaining -= dt;
              if (sig.clearTimeRemaining <= 0) {
                sig.aspect = 'GREEN';
                result.warning = `Signal ${sig.name} cleared to PROCEED (GREEN)`;
              }
            } else {
              sig.aspect = 'GREEN';
              result.warning = `Signal ${sig.name} cleared to PROCEED (GREEN)`;
            }
          }
        }
  
        // 2. Check Passing of Signal
        if (!sig.passed && trainPosition >= sig.positionMeters) {
          sig.passed = true;
          result.passedSignal = sig;
  
          // VIOLATION: PASSED RED SIGNAL (SPAD)
          if (sig.aspect === 'RED') {
            this.violations++;
            result.failure = true;
            result.failureReason = `SPAD Violation: You passed a RED signal at ${(sig.positionMeters / 1000).toFixed(2)} km.`;
            return result;
          }
  
          // Passed Yellow at high speed (Overspeeding caution)
          if (sig.aspect === 'YELLOW' && speedKmh > 50) {
            this.cautionPenalties++;
            result.warning = `Caution Penalty: Passed YELLOW signal exceeding 50 km/h (${Math.round(speedKmh)} km/h)`;
          }
        }
  
        // 3. Proximity Caution Warnings
        if (!sig.passed && distance > 0 && distance < 250) {
          if (sig.aspect === 'RED') {
            result.warning = `DANGER: Red Signal ahead in ${Math.round(distance)}m! Stop immediately!`;
          } else if (sig.aspect === 'YELLOW' && speedKmh > 50) {
            result.warning = `Prepare to slow down: Yellow Signal in ${Math.round(distance)}m. Target 40 km/h.`;
          }
        }
      }
  
      return result;
    }
  
    getNextSignal(trainPosition) {
      for (const sig of this.signals) {
        if (sig.positionMeters > trainPosition - 2) {
          return {
            id: sig.id,
            name: sig.name,
            aspect: sig.aspect,
            distanceMeters: Math.max(0, Math.round(sig.positionMeters - trainPosition)),
            positionMeters: sig.positionMeters
          };
        }
      }
      return null;
    }
  
    getSignalsInRange(trainPosition, rangeMeters = 700) {
      return this.signals.filter(
        sig => sig.positionMeters >= trainPosition - 30 && sig.positionMeters <= trainPosition + rangeMeters
      );
    }
  }
  

  // --- Module: engine/StationSystem.js ---
  /**
   * Railway Commander - Station & Stopping Accuracy System
   * Manages station approaches, platform stop zones, stopping precision metrics,
   * passenger boarding timers, and departure clearance.
   */
  
  class StationSystem {
    constructor() {
      this.stations = [];
      this.currentStationIndex = 0;
      this.activeStation = null;
      this.stopAccuracyHistory = [];
      this.boardingTimer = 0;
      this.isBoarding = false;
      this.boardingCompleted = false;
      this.missedStations = 0;
    }
  
    loadStations(stationsList) {
      this.stations = (stationsList || []).map((st, idx) => ({
        id: st.id || `STATION_${idx + 1}`,
        name: st.name || `Station ${idx + 1}`,
        stopPosition: st.stopPosition,
        platformLength: st.platformLength || 140,
        approachDistance: 500,
        enterDistance: 120,
        mandatory: st.mandatory !== false,
        completed: false,
        isMissed: false,
        stopRating: null,
        offsetMeters: null
      }));
      this.currentStationIndex = 0;
      this.activeStation = this.stations[0] || null;
      this.stopAccuracyHistory = [];
      this.boardingTimer = 0;
      this.isBoarding = false;
      this.boardingCompleted = false;
      this.missedStations = 0;
    }
  
    reset() {
      for (const st of this.stations) {
        st.completed = false;
        st.isMissed = false;
        st.stopRating = null;
        st.offsetMeters = null;
      }
      this.currentStationIndex = 0;
      this.activeStation = this.stations[0] || null;
      this.stopAccuracyHistory = [];
      this.boardingTimer = 0;
      this.isBoarding = false;
      this.boardingCompleted = false;
      this.missedStations = 0;
    }
  
    update(trainPosition, speedKmh, isStopped, dt) {
      const station = this.activeStation;
      if (!station || station.completed || station.isMissed) {
        return null;
      }
  
      const distanceToStop = station.stopPosition - trainPosition;
      const platformStart = station.stopPosition - station.platformLength + 20;
      const platformEnd = station.stopPosition + 25;
  
      // 1. Handle Passenger Boarding Countdown
      if (this.isBoarding) {
        this.boardingTimer -= dt;
        if (this.boardingTimer <= 0) {
          this.isBoarding = false;
          this.boardingCompleted = true;
          station.completed = true;
          
          this.currentStationIndex++;
          this.activeStation = this.stations[this.currentStationIndex] || null;
  
          return {
            type: 'BOARDING_COMPLETE',
            stationName: station.name,
            message: `Passengers boarded at ${station.name}. Cleared for departure! 🟢`
          };
        }
        return {
          type: 'BOARDING_PROGRESS',
          stationName: station.name,
          timeLeft: Math.ceil(this.boardingTimer),
          message: `Boarding passengers... ${Math.ceil(this.boardingTimer)}s (Keep brakes applied)`
        };
      }
  
      // 2. Check if train completely stopped near the platform
      if (isStopped && !station.completed && !this.boardingCompleted) {
        if (trainPosition >= platformStart && trainPosition <= platformEnd) {
          const offset = trainPosition - station.stopPosition;
          const absOffset = Math.abs(offset);
          station.offsetMeters = Math.round(offset * 10) / 10;
  
          let rating = 'GOOD';
          let points = 250;
          let badge = 'GOOD STOP';
  
          if (absOffset <= 2.5) {
            rating = 'PERFECT';
            points = 500;
            badge = '🌟 PERFECT STOP!';
          } else if (absOffset <= 7.5) {
            rating = 'GOOD';
            points = 300;
            badge = '👍 GOOD STOP';
          } else {
            rating = 'ACCEPTABLE';
            points = 150;
            badge = 'ACCEPTABLE STOP';
          }
  
          station.stopRating = rating;
          this.stopAccuracyHistory.push({
            stationId: station.id,
            stationName: station.name,
            rating,
            offsetMeters: station.offsetMeters,
            points
          });
  
          this.isBoarding = true;
          this.boardingTimer = 5.0;
  
          return {
            type: 'ACCURATE_STOP',
            stationName: station.name,
            rating,
            badge,
            points,
            offsetMeters: station.offsetMeters,
            message: `${badge} (${absOffset.toFixed(1)}m from marker) +${points} pts`
          };
        }
      }
  
      // 3. Check for Missed / Overshot Station
      if (trainPosition > platformEnd + 15 && !station.completed) {
        station.isMissed = true;
        this.missedStations++;
        this.currentStationIndex++;
        this.activeStation = this.stations[this.currentStationIndex] || null;
  
        return {
          type: 'MISSED_STATION',
          stationName: station.name,
          message: `MISSED STOP: You failed to stop at ${station.name} platform!`,
          mandatory: station.mandatory
        };
      }
  
      // 4. Proximity Announcements
      if (distanceToStop > 0 && distanceToStop <= station.approachDistance) {
        if (distanceToStop <= station.enterDistance) {
          return {
            type: 'PREPARE_TO_STOP',
            stationName: station.name,
            distanceMeters: Math.round(distanceToStop),
            message: `Entering ${station.name}: Prepare to Stop (Marker in ${Math.round(distanceToStop)}m)`
          };
        } else {
          return {
            type: 'APPROACHING_STATION',
            stationName: station.name,
            distanceMeters: Math.round(distanceToStop),
            message: `Approaching ${station.name} (${Math.round(distanceToStop)}m)`
          };
        }
      }
  
      return null;
    }
  
    getCurrentStation() {
      return this.activeStation;
    }
  
    getStationsInRange(trainPosition, rangeMeters = 700) {
      return this.stations.filter(
        st => st.stopPosition >= trainPosition - 80 && st.stopPosition <= trainPosition + rangeMeters
      );
    }
  
    allStationsCompleted() {
      return this.stations.length > 0 && this.stations.every(st => st.completed);
    }
  
    getCompletionSummary() {
      const completedCount = this.stations.filter(st => st.completed).length;
      const totalCount = this.stations.length;
      return {
        completedCount,
        totalCount,
        missedCount: this.missedStations,
        history: this.stopAccuracyHistory
      };
    }
  }
  

  // --- Module: engine/SaveManager.js ---
  /**
   * Railway Commander - Save Manager
   * Manages resilient persistence to LocalStorage with fallback handling,
   * corrupted JSON recovery, and driver profile progression.
   */
  
  const STORAGE_KEY = 'railway_commander_save_v1';
  const SETTINGS_KEY = 'railway_commander_settings_v1';
  
  class SaveManager {
    constructor() {
      this.progress = this.loadProgress();
      this.settings = this.loadSettings();
    }
  
    getStorage() {
      try {
        if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
        if (typeof localStorage !== 'undefined') return localStorage;
      } catch (e) {}
      return null;
    }
  
    loadProgress() {
      const defaultData = {
        driverName: 'Train Commander',
        driverLevel: 1,
        totalXp: 0,
        coins: 150,
        unlockedMissions: ['mission-1'],
        completedMissions: [],
        bestScores: {},
        missionStars: {}
      };
  
      try {
        const storage = this.getStorage();
        if (!storage) return defaultData;
  
        const raw = storage.getItem(STORAGE_KEY);
        if (!raw) return defaultData;
  
        const parsed = JSON.parse(raw);
        return {
          ...defaultData,
          ...parsed,
          unlockedMissions: Array.isArray(parsed.unlockedMissions) && parsed.unlockedMissions.length > 0
            ? parsed.unlockedMissions
            : ['mission-1'],
          completedMissions: Array.isArray(parsed.completedMissions) ? parsed.completedMissions : [],
          bestScores: parsed.bestScores || {},
          missionStars: parsed.missionStars || {}
        };
      } catch (e) {
        return defaultData;
      }
    }
  
    saveProgress() {
      try {
        const storage = this.getStorage();
        if (storage) {
          storage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
        }
      } catch (e) {
        console.warn('RailwayCommander: Failed to write save to localStorage', e);
      }
    }
  
    loadSettings() {
      const defaultSettings = {
        sound: true,
        music: true,
        quality: 'HIGH',
        cameraMode: 'chase'
      };
  
      try {
        const storage = this.getStorage();
        if (!storage) return defaultSettings;
  
        const raw = storage.getItem(SETTINGS_KEY);
        if (!raw) return defaultSettings;
        return { ...defaultSettings, ...JSON.parse(raw) };
      } catch (e) {
        return defaultSettings;
      }
    }
  
    saveSettings(settings) {
      this.settings = { ...this.settings, ...settings };
      try {
        const storage = this.getStorage();
        if (storage) {
          storage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
        }
      } catch (e) {
        console.warn('RailwayCommander: Failed to write settings to localStorage', e);
      }
    }
  
    getProgress() {
      return this.progress;
    }
  
    recordMissionCompletion({ missionId, score, stars, earnedXp, earnedCoins, nextMissionId }) {
      if (!this.progress.completedMissions.includes(missionId)) {
        this.progress.completedMissions.push(missionId);
      }
  
      if (nextMissionId && !this.progress.unlockedMissions.includes(nextMissionId)) {
        this.progress.unlockedMissions.push(nextMissionId);
      }
  
      const currentBest = this.progress.bestScores[missionId] || 0;
      if (score > currentBest) {
        this.progress.bestScores[missionId] = score;
      }
  
      const currentStars = this.progress.missionStars[missionId] || 0;
      if (stars > currentStars) {
        this.progress.missionStars[missionId] = stars;
      }
  
      this.progress.totalXp += (earnedXp || 0);
      this.progress.coins += (earnedCoins || 0);
      this.progress.driverLevel = Math.max(1, Math.floor(this.progress.totalXp / 1000) + 1);
  
      this.saveProgress();
    }
  
    resetProgress() {
      this.progress = {
        driverName: 'Train Commander',
        driverLevel: 1,
        totalXp: 0,
        coins: 150,
        unlockedMissions: ['mission-1'],
        completedMissions: [],
        bestScores: {},
        missionStars: {}
      };
      this.saveProgress();
    }
  }
  

  // --- Module: engine/MissionSystem.js ---
  ﻿/**
   * Railway Commander - Mission & Progression System
   * Defines handcrafted missions, objective tracking, score calculations,
   * and unlock progression.
   */
  
  const MISSIONS_DATA = [
    {
      id: 'mission-1',
      number: 1,
      title: 'Training Run',
      tagline: 'Master train controls & safe station stopping',
      objective: 'Learn throttle and brake controls, maintain the 60 km/h speed limit, and stop accurately at Riverside Junction.',
      route: 'Central Depot → Riverside Junction',
      distanceMeters: 1800,
      distanceFormatted: '1.8 km',
      speedLimitKmh: 60,
      environment: 'city',
      timeOfDay: 'day', // 'day' | 'sunset' | 'night'
      weather: 'clear', // 'clear' | 'rain' | 'fog'
      rewardXp: 500,
      rewardCoins: 250,
      speedLimitZones: [
        { from: 0, to: 1800, limitKmh: 60 }
      ],
      stations: [
        { id: 'st_riverside', name: 'Riverside Junction', stopPosition: 1620, platformLength: 130, mandatory: true }
      ],
      signals: [
        { id: 'sig_1', name: 'Depot Exit Signal', positionMeters: 550, aspect: 'GREEN' },
        { id: 'sig_2', name: 'Riverside Approach Signal', positionMeters: 1250, aspect: 'GREEN' }
      ]
    },
    {
      id: 'mission-2',
      number: 2,
      title: 'City Express',
      tagline: 'Dynamic speed limit transitions & multi-station timetable',
      objective: 'Operate an express commuter run. Accelerate through the 100 km/h high-speed zone and execute smooth stops at both stations.',
      route: 'Central Depot → Riverside Junction → Metro Harbor',
      distanceMeters: 3800,
      distanceFormatted: '3.8 km',
      speedLimitKmh: 100,
      environment: 'city',
      timeOfDay: 'sunset',
      weather: 'clear',
      rewardXp: 850,
      rewardCoins: 450,
      speedLimitZones: [
        { from: 0, to: 700, limitKmh: 60 },
        { from: 700, to: 2400, limitKmh: 100 },
        { from: 2400, to: 3800, limitKmh: 50 }
      ],
      stations: [
        { id: 'st_riverside', name: 'Riverside Junction', stopPosition: 1550, platformLength: 130, mandatory: true },
        { id: 'st_metro_harbor', name: 'Metro Harbor', stopPosition: 3580, platformLength: 140, mandatory: true }
      ],
      signals: [
        { id: 'sig_1', name: 'Depot Exit Block', positionMeters: 600, aspect: 'GREEN' },
        { id: 'sig_2', name: 'Riverside Approach', positionMeters: 1200, aspect: 'YELLOW' },
        { id: 'sig_3', name: 'Corridor High-Speed Signal', positionMeters: 2200, aspect: 'GREEN' },
        { id: 'sig_4', name: 'Harbor Yard Approach', positionMeters: 3100, aspect: 'YELLOW' }
      ]
    },
    {
      id: 'mission-3',
      number: 3,
      title: 'Signal Master',
      tagline: 'Strict signal compliance & dynamic holding blocks',
      objective: 'Navigate high-traffic industrial junctions. Obey caution yellows and holding red signals with zero SPAD violations.',
      route: 'North Harbor → Iron Valley → Grand Central',
      distanceMeters: 4500,
      distanceFormatted: '4.5 km',
      speedLimitKmh: 80,
      environment: 'industrial',
      timeOfDay: 'night',
      weather: 'rain',
      rewardXp: 1200,
      rewardCoins: 650,
      speedLimitZones: [
        { from: 0, to: 1000, limitKmh: 70 },
        { from: 1000, to: 2900, limitKmh: 90 },
        { from: 2900, to: 4500, limitKmh: 45 }
      ],
      stations: [
        { id: 'st_iron_valley', name: 'Iron Valley Works', stopPosition: 2150, platformLength: 130, mandatory: true },
        { id: 'st_grand_central', name: 'Grand Central Terminal', stopPosition: 4280, platformLength: 160, mandatory: true }
      ],
      signals: [
        { id: 'sig_1', name: 'Harbor Crossover', positionMeters: 750, aspect: 'GREEN' },
        { id: 'sig_2', name: 'Iron Valley Warning', positionMeters: 1750, aspect: 'YELLOW' },
        { 
          id: 'sig_3', 
          name: 'Interlocking Holding Signal', 
          positionMeters: 2950, 
          aspect: 'RED', 
          clearDistance: 320, 
          clearDelay: 1.5 // Clears to Green when train slows to <= 45 km/h within 320m
        },
        { id: 'sig_4', name: 'Grand Central Approach', positionMeters: 3950, aspect: 'YELLOW' }
      ]
    },
    {
      id: 'mission-4',
      number: 4,
      title: 'Precision Driver',
      tagline: 'Mountain passenger express & precision stopping',
      objective: 'Drive an express run through scenic alpine mountain grades. Deliver pinpoint accurate station stops under foggy weather conditions.',
      route: 'Grand Central → Pine Valley → Alpine Summit',
      distanceMeters: 5600,
      distanceFormatted: '5.6 km',
      speedLimitKmh: 110,
      environment: 'alpine',
      timeOfDay: 'day',
      weather: 'fog',
      rewardXp: 1800,
      rewardCoins: 1000,
      speedLimitZones: [
        { from: 0, to: 1200, limitKmh: 70 },
        { from: 1200, to: 3400, limitKmh: 110 },
        { from: 3400, to: 5600, limitKmh: 55 }
      ],
      stations: [
        { id: 'st_pine_valley', name: 'Pine Valley Station', stopPosition: 2350, platformLength: 130, mandatory: true },
        { id: 'st_alpine_summit', name: 'Alpine Summit High Terminal', stopPosition: 5350, platformLength: 150, mandatory: true }
      ],
      signals: [
        { id: 'sig_1', name: 'Valley Outbound', positionMeters: 800, aspect: 'GREEN' },
        { id: 'sig_2', name: 'Pine Valley Distant', positionMeters: 1950, aspect: 'YELLOW' },
        { id: 'sig_3', name: 'Alpine Tunnel Portal Signal', positionMeters: 3300, aspect: 'GREEN' },
        { id: 'sig_4', name: 'Summit Approach Signal', positionMeters: 4900, aspect: 'YELLOW' }
      ]
    }
  ];
  
  class MissionSystem {
    constructor(saveManager) {
      this.saveManager = saveManager;
      this.currentMission = null;
      this.missionStartTime = 0;
      this.elapsedTime = 0;
  
      // Mission Score Metrics
      this.overspeedTimeTotal = 0;
      this.emergencyBrakeCount = 0;
      this.safeDrivingBonus = 1000;
    }
  
    getMissions() {
      const saved = this.saveManager.getProgress();
      return MISSIONS_DATA.map(m => {
        const isUnlocked = m.number === 1 || saved.unlockedMissions.includes(m.id);
        const isCompleted = saved.completedMissions.includes(m.id);
        const bestScore = saved.bestScores[m.id] || 0;
        const stars = saved.missionStars[m.id] || 0;
  
        return {
          ...m,
          isUnlocked,
          isCompleted,
          bestScore,
          stars
        };
      });
    }
  
    getMissionById(id) {
      return MISSIONS_DATA.find(m => m.id === id) || MISSIONS_DATA[0];
    }
  
    startMission(missionId) {
      this.currentMission = this.getMissionById(missionId);
      this.missionStartTime = performance.now();
      this.elapsedTime = 0;
      this.overspeedTimeTotal = 0;
      this.emergencyBrakeCount = 0;
      this.safeDrivingBonus = 1000;
      return this.currentMission;
    }
  
    recordOverspeed(dt) {
      this.overspeedTimeTotal += dt;
    }
  
    recordEmergencyBrake() {
      this.emergencyBrakeCount++;
    }
  
    /**
     * Calculate final score, stars, rank and rewards
     */
    evaluateResults(stationSummary, signalViolations, totalDistanceDriven) {
      const mission = this.currentMission;
      if (!mission) return null;
  
      let baseScore = 1200; // Base safe driving completion
      let stopScore = 0;
  
      // Stop accuracy points
      if (stationSummary && stationSummary.history) {
        for (const record of stationSummary.history) {
          stopScore += record.points || 0;
        }
      }
  
      // Penalties
      const overspeedPenalty = Math.round(this.overspeedTimeTotal * 25);
      const emergencyBrakePenalty = this.emergencyBrakeCount * 120;
      const missedStationPenalty = (stationSummary?.missedCount || 0) * 600;
      const signalPenalty = signalViolations * 800;
  
      let finalScore = Math.max(0, baseScore + stopScore - overspeedPenalty - emergencyBrakePenalty - missedStationPenalty - signalPenalty);
  
      // Star & Rating Assignment
      let stars = 1;
      let rank = 'C';
  
      const maxExpectedScore = baseScore + (mission.stations.length * 500);
      const scoreRatio = finalScore / maxExpectedScore;
  
      if (scoreRatio >= 0.88 && signalViolations === 0 && (stationSummary?.missedCount || 0) === 0) {
        stars = 3;
        rank = 'S';
      } else if (scoreRatio >= 0.72 && signalViolations === 0) {
        stars = 3;
        rank = 'A';
      } else if (scoreRatio >= 0.52) {
        stars = 2;
        rank = 'B';
      } else {
        stars = 1;
        rank = 'C';
      }
  
      // Calculate Rewards
      const xpMultiplier = stars === 3 ? 1.0 : (stars === 2 ? 0.75 : 0.5);
      const coinsMultiplier = stars === 3 ? 1.0 : (stars === 2 ? 0.75 : 0.5);
  
      const earnedXp = Math.round(mission.rewardXp * xpMultiplier);
      const earnedCoins = Math.round(mission.rewardCoins * coinsMultiplier);
  
      // Save Progress & Unlock Next Mission
      const currentIdx = MISSIONS_DATA.findIndex(m => m.id === mission.id);
      let nextMissionId = null;
      if (currentIdx >= 0 && currentIdx < MISSIONS_DATA.length - 1) {
        nextMissionId = MISSIONS_DATA[currentIdx + 1].id;
      }
  
      this.saveManager.recordMissionCompletion({
        missionId: mission.id,
        score: finalScore,
        stars,
        earnedXp,
        earnedCoins,
        nextMissionId
      });
  
      return {
        missionId: mission.id,
        missionTitle: mission.title,
        finalScore,
        stars,
        rank,
        earnedXp,
        earnedCoins,
        nextMissionId,
        breakdown: {
          baseScore,
          stopScore,
          overspeedPenalty,
          emergencyBrakePenalty,
          signalViolations,
          missedStations: stationSummary?.missedCount || 0,
          stopsRecorded: stationSummary?.history?.length || 0
        }
      };
    }
  }
  

  // --- Module: engine/SoundManager.js ---
  ﻿/**
   * Railway Commander - Web Audio API Synthesizer & Sound Manager
   * Generates realistic train engine RPM hum, track click-clack, pneumatic air brakes,
   * locomotive horn chords, station chimes, and alarms without external audio file dependencies.
   */
  
  class SoundManager {
    constructor(saveManager) {
      this.saveManager = saveManager;
      this.soundEnabled = true;
      this.musicEnabled = true;
  
      if (saveManager && saveManager.settings) {
        this.soundEnabled = saveManager.settings.sound !== false;
        this.musicEnabled = saveManager.settings.music !== false;
      }
  
      this.ctx = null;
      this.masterGain = null;
  
      // Continuous Sound Nodes
      this.engineOsc1 = null;
      this.engineOsc2 = null;
      this.engineFilter = null;
      this.engineGain = null;
      this.engineRunning = false;
  
      // Track click-clack timing
      this.lastWheelClickDistance = 0;
      this.wheelClickInterval = 28; // Rail joints every 28 meters
    }
  
    init() {
      if (this.ctx) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.soundEnabled ? 1.0 : 0.0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      } catch (e) {
        console.warn('SoundManager: AudioContext could not be created', e);
      }
    }
  
    resume() {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }
  
    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.soundEnabled ? 1.0 : 0.0, this.ctx.currentTime);
      }
      if (this.saveManager) {
        this.saveManager.saveSettings({ sound: this.soundEnabled });
      }
      return this.soundEnabled;
    }
  
    /**
     * Start or update continuous locomotive engine sound
     * Modulates engine pitch and filter cutoff with throttle and speed
     */
    updateEngineSound(throttleLevel, speedKmh) {
      if (!this.soundEnabled) {
        this.stopEngineSound();
        return;
      }
      this.resume();
      if (!this.ctx) return;
  
      if (!this.engineRunning) {
        try {
          const now = this.ctx.currentTime;
          this.engineGain = this.ctx.createGain();
          this.engineGain.gain.setValueAtTime(0.01, now);
          this.engineGain.gain.exponentialRampToValueAtTime(0.18, now + 0.3);
  
          this.engineFilter = this.ctx.createBiquadFilter();
          this.engineFilter.type = 'lowpass';
          this.engineFilter.frequency.setValueAtTime(120, now);
  
          // Low rumble oscillator
          this.engineOsc1 = this.ctx.createOscillator();
          this.engineOsc1.type = 'sawtooth';
          this.engineOsc1.frequency.setValueAtTime(45, now);
  
          // Sub-harmonic diesel buzz
          this.engineOsc2 = this.ctx.createOscillator();
          this.engineOsc2.type = 'triangle';
          this.engineOsc2.frequency.setValueAtTime(90, now);
  
          this.engineOsc1.connect(this.engineFilter);
          this.engineOsc2.connect(this.engineFilter);
          this.engineFilter.connect(this.engineGain);
          this.engineGain.connect(this.masterGain);
  
          this.engineOsc1.start();
          this.engineOsc2.start();
          this.engineRunning = true;
        } catch (e) {
          return;
        }
      }
  
      if (this.engineRunning && this.engineOsc1 && this.engineFilter && this.engineGain) {
        const now = this.ctx.currentTime;
        const speedRatio = Math.min(1.0, speedKmh / 140);
        const throttleRatio = throttleLevel / 5;
  
        // Base engine frequency (45Hz idle -> 135Hz full throttle at speed)
        const targetFreq = 42 + (throttleRatio * 45) + (speedRatio * 48);
        const targetCutoff = 100 + (throttleRatio * 220) + (speedRatio * 180);
        const targetVolume = 0.12 + (throttleRatio * 0.14) + (speedRatio * 0.08);
  
        this.engineOsc1.frequency.setTargetAtTime(targetFreq, now, 0.15);
        this.engineOsc2.frequency.setTargetAtTime(targetFreq * 2, now, 0.15);
        this.engineFilter.frequency.setTargetAtTime(targetCutoff, now, 0.15);
        this.engineGain.gain.setTargetAtTime(targetVolume, now, 0.15);
      }
    }
  
    stopEngineSound() {
      if (this.engineRunning && this.engineGain && this.ctx) {
        try {
          const now = this.ctx.currentTime;
          this.engineGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          setTimeout(() => {
            if (this.engineOsc1) { this.engineOsc1.stop(); this.engineOsc1.disconnect(); this.engineOsc1 = null; }
            if (this.engineOsc2) { this.engineOsc2.stop(); this.engineOsc2.disconnect(); this.engineOsc2 = null; }
            this.engineRunning = false;
          }, 250);
        } catch (e) {
          this.engineRunning = false;
        }
      }
    }
  
    /**
     * Periodic rail joint click-clack
     */
    updateWheelJoints(currentPositionMeters, speedKmh) {
      if (!this.soundEnabled || speedKmh < 10) return;
  
      if (currentPositionMeters - this.lastWheelClickDistance >= this.wheelClickInterval) {
        this.lastWheelClickDistance = currentPositionMeters;
        this.playRailClickClack(speedKmh);
      }
    }
  
    playRailClickClack(speedKmh) {
      this.resume();
      if (!this.ctx || !this.soundEnabled) return;
      try {
        const now = this.ctx.currentTime;
        const vol = Math.min(0.22, 0.05 + (speedKmh / 140) * 0.17);
  
        // Strike 1
        this.createClickImpulse(now, vol);
        // Strike 2 (clack) slightly delayed
        const delay = Math.max(0.04, 0.14 - (speedKmh / 140) * 0.07);
        this.createClickImpulse(now + delay, vol * 0.85);
      } catch (e) {}
    }
  
    createClickImpulse(time, volume) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
  
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(380, time);
      filter.Q.setValueAtTime(3, time);
  
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, time);
      osc.frequency.exponentialRampToValueAtTime(60, time + 0.045);
  
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);
  
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
  
      osc.start(time);
      osc.stop(time + 0.05);
    }
  
    /**
     * Powerful Dual-Tone Locomotive Horn
     */
    playHorn(active = true) {
      if (!active) {
        if (this.hornGain && this.ctx) {
          const now = this.ctx.currentTime;
          this.hornGain.gain.setTargetAtTime(0.001, now, 0.1);
          setTimeout(() => {
            if (this.hornOsc1) { this.hornOsc1.stop(); this.hornOsc1.disconnect(); this.hornOsc1 = null; }
            if (this.hornOsc2) { this.hornOsc2.stop(); this.hornOsc2.disconnect(); this.hornOsc2 = null; }
            this.hornGain = null;
          }, 150);
        }
        return;
      }
  
      this.resume();
      if (!this.ctx || !this.soundEnabled || this.hornGain) return;
  
      try {
        const now = this.ctx.currentTime;
        this.hornGain = this.ctx.createGain();
        this.hornGain.gain.setValueAtTime(0.001, now);
        this.hornGain.gain.exponentialRampToValueAtTime(0.35, now + 0.08);
  
        // American Nathan K3L style chord: ~311 Hz (Eb4) and ~440 Hz (A4)
        this.hornOsc1 = this.ctx.createOscillator();
        this.hornOsc1.type = 'sawtooth';
        this.hornOsc1.frequency.setValueAtTime(311.13, now);
  
        this.hornOsc2 = this.ctx.createOscillator();
        this.hornOsc2.type = 'sawtooth';
        this.hornOsc2.frequency.setValueAtTime(440.00, now);
  
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);
  
        this.hornOsc1.connect(filter);
        this.hornOsc2.connect(filter);
        filter.connect(this.hornGain);
        this.hornGain.connect(this.masterGain);
  
        this.hornOsc1.start(now);
        this.hornOsc2.start(now);
      } catch (e) {}
    }
  
    /**
     * Pneumatic Air Brake Dump / Release Hiss
     */
    playAirBrakeHiss(isEmergency = false) {
      this.resume();
      if (!this.ctx || !this.soundEnabled) return;
  
      try {
        const now = this.ctx.currentTime;
        const duration = isEmergency ? 1.4 : 0.6;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
  
        // Generate pink/white noise
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
        }
  
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
  
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(isEmergency ? 1600 : 1200, now);
        filter.Q.setValueAtTime(1.5, now);
  
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(isEmergency ? 0.35 : 0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
  
        noise.start(now);
        noise.stop(now + duration);
      } catch (e) {}
    }
  
    /**
     * Station Arrival Bell / Chime
     */
    playStationChime() {
      this.resume();
      if (!this.ctx || !this.soundEnabled) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [659.25, 523.25]; // E5 then C5
        notes.forEach((freq, idx) => {
          const t = now + (idx * 0.28);
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
  
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
  
          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
  
          osc.connect(gain);
          gain.connect(this.masterGain);
  
          osc.start(t);
          osc.stop(t + 0.85);
        });
      } catch (e) {}
    }
  
    /**
     * Overspeed / Red Signal Proximity Warning Buzzer
     */
    playWarningBeep() {
      this.resume();
      if (!this.ctx || !this.soundEnabled) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
  
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
  
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  
        osc.connect(gain);
        gain.connect(this.masterGain);
  
        osc.start(now);
        osc.stop(now + 0.13);
      } catch (e) {}
    }
  
    /**
     * Mission Complete Fanfare
     */
    playVictoryFanfare() {
      this.resume();
      if (!this.ctx || !this.soundEnabled) return;
      try {
        const now = this.ctx.currentTime;
        const arpeggio = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        arpeggio.forEach((freq, idx) => {
          const t = now + (idx * 0.14);
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
  
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
  
          gain.gain.setValueAtTime(0.24, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  
          osc.connect(gain);
          gain.connect(this.masterGain);
  
          osc.start(t);
          osc.stop(t + 0.65);
        });
      } catch (e) {}
    }
  
    /**
     * Mission Failure Descending Tone
     */
    playFailureSound() {
      this.resume();
      if (!this.ctx || !this.soundEnabled) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
  
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(75, now + 0.8);
  
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
  
        osc.connect(gain);
        gain.connect(this.masterGain);
  
        osc.start(now);
        osc.stop(now + 0.85);
      } catch (e) {}
    }
  
    playClick() {
      this.resume();
      if (!this.ctx || !this.soundEnabled) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
  
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
  
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  
        osc.connect(gain);
        gain.connect(this.masterGain);
  
        osc.start(now);
        osc.stop(now + 0.045);
      } catch (e) {}
    }
  }
  

  // --- Module: engine/Renderer25D.js ---
  /**
   * Railway Commander - 2.5D Perspective Railway Renderer
   * Renders pseudo-3D perspective railway tracks, ballast, ties, catenary wires,
   * 3D station platforms, stop markers, 3-aspect optical signals with bloom,
   * dynamic sky/lighting (Day/Sunset/Night), weather (Rain/Fog),
   * and dual camera modes (Elevated Track Chase & Driver Cab View).
   */
  
  class Renderer25D {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: false });
  
      // Camera Mode: 'chase' (elevated 2.5D) or 'cab' (cockpit windshield)
      this.cameraMode = 'chase';
  
      // Rain Particle Pool
      this.rainDrops = [];
      this.maxRainDrops = 160;
      this.initRain();
  
      // Wiper Animation State
      this.wiperAngle = 0;
      this.wiperDirection = 1;
  
      // Headlight Flicker
      this.headlightPulse = 1.0;
    }
  
    initRain() {
      this.rainDrops = [];
      for (let i = 0; i < this.maxRainDrops; i++) {
        this.rainDrops.push({
          x: Math.random(),
          y: Math.random(),
          speed: 0.8 + Math.random() * 0.6,
          length: 12 + Math.random() * 15
        });
      }
    }
  
    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = (rect.width > 0 ? rect.width : window.innerWidth) || 800;
      const cssH = (rect.height > 0 ? rect.height : window.innerHeight) || 600;
      this.canvas.width = Math.floor(cssW * dpr);
      this.canvas.height = Math.floor(cssH * dpr);
      this.width = this.canvas.width;
      this.height = this.canvas.height;
    }
  
    setCameraMode(mode) {
      this.cameraMode = mode === 'cab' ? 'cab' : 'chase';
    }
  
    /**
     * Main Render Frame
     */
    render(state, trackManager, signalSystem, stationSystem, missionConfig, dt) {
      if (!this.width || !this.height) {
        this.resize();
      }
  
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
  
      const timeOfDay = missionConfig?.timeOfDay || 'day';
      const weather = missionConfig?.weather || 'clear';
      const trainPos = state.positionMeters;
      const speedKmh = state.speedKmh;
  
      // Camera Configuration
      const isCab = this.cameraMode === 'cab';
      const horizonY = h * (isCab ? 0.44 : 0.40);
      const focalLength = w * 0.75;
      const cameraHeight = isCab ? 2.4 : 4.8;
      const cameraZ = isCab ? trainPos + 1.2 : trainPos - 8.5; // Chase cam is behind train
  
      // 1. Draw Sky & Backdrop (Day / Sunset / Night)
      this.drawSkyAndLandscape(ctx, w, h, horizonY, timeOfDay, weather, trainPos);
  
      // 2. Perspective Projection Setup
      // Track base width = 3.2m (standard gauge + ballast margins)
      const trackHalfGauge = 0.82; // standard 1435mm gauge half-width
      const ballastHalfWidth = 2.4;
  
      // Smooth Curvature Calculation over distance
      const baseCurvature = trackManager.getCurvatureAt(trainPos);
  
      // Helper: Project 3D point (worldX, worldY, worldZ) to 2D Screen
      const project = (x, y, z) => {
        const relZ = z - cameraZ;
        if (relZ <= 0.2) return null;
        const scale = focalLength / relZ;
        // Curvature shift
        const distFromCam = relZ;
        const curveOffset = baseCurvature * (distFromCam * distFromCam) * 0.15;
        const screenX = (w * 0.5) + (x + curveOffset) * scale;
        const screenY = horizonY + (cameraHeight - y) * scale;
        return { x: screenX, y: screenY, scale, relZ };
      };
  
      // 3. Draw Ballast Bed & Ground
      this.drawGroundAndBallast(ctx, w, h, horizonY, project, cameraZ, timeOfDay);
  
      // 4. Draw Railroad Ties (Sleepers)
      this.drawRailTies(ctx, project, cameraZ, timeOfDay);
  
      // 5. Draw Steel Rails
      this.drawSteelRails(ctx, project, cameraZ, trackHalfGauge, state.headlights, timeOfDay);
  
      // 6. Draw Stations & Platforms
      this.drawStations(ctx, project, cameraZ, stationSystem, trackHalfGauge, timeOfDay);
  
      // 7. Draw Scenery (Catenary Poles, Trees, Buildings)
      this.drawScenery(ctx, project, cameraZ, trackManager, timeOfDay);
  
      // 8. Draw Railway Signals
      this.drawSignals(ctx, project, cameraZ, signalSystem, timeOfDay);
  
      // 9. Draw Headlight Projection Beam (at night or sunset)
      if (state.headlights && (timeOfDay === 'night' || timeOfDay === 'sunset' || weather === 'fog')) {
        this.drawHeadlightBeams(ctx, w, h, horizonY, isCab);
      }
  
      // 10. Draw Locomotive Model (if Chase Camera Mode)
      if (!isCab) {
        this.drawChaseLocomotive(ctx, w, h, horizonY, state, timeOfDay);
      }
  
      // 11. Draw Cockpit Frame & Dashboard (if Cab View Mode)
      if (isCab) {
        this.drawCabCockpit(ctx, w, h, state, dt, weather);
      }
  
      // 12. Draw Weather Overlay (Rain Streaks / Fog)
      if (weather === 'rain') {
        this.drawRain(ctx, w, h, speedKmh, dt);
      } else if (weather === 'fog') {
        this.drawFog(ctx, w, h, horizonY);
      }
    }
  
    drawSkyAndLandscape(ctx, w, h, horizonY, timeOfDay, weather, trainPos) {
      // Sky Gradient
      let skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      if (timeOfDay === 'sunset') {
        skyGrad.addColorStop(0, '#1e1b4b'); // Deep indigo
        skyGrad.addColorStop(0.4, '#7c2d12'); // Amber crimson
        skyGrad.addColorStop(0.8, '#ea580c'); // Bright orange
        skyGrad.addColorStop(1.0, '#fed7aa'); // Warm twilight
      } else if (timeOfDay === 'night') {
        skyGrad.addColorStop(0, '#030712');
        skyGrad.addColorStop(0.6, '#090d1f');
        skyGrad.addColorStop(1.0, '#131b38');
      } else {
        // Day
        skyGrad.addColorStop(0, '#1d4ed8');
        skyGrad.addColorStop(0.5, '#38bdf8');
        skyGrad.addColorStop(1.0, '#bae6fd');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizonY + 2);
  
      // Stars at Night
      if (timeOfDay === 'night') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let i = 0; i < 40; i++) {
          const starX = ((i * 137.5) % w);
          const starY = ((i * 89.3) % (horizonY * 0.7));
          ctx.fillRect(starX, starY, 1.5, 1.5);
        }
        // Moon
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = 'rgba(254, 240, 138, 0.6)';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(w * 0.82, horizonY * 0.3, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (timeOfDay === 'sunset') {
        // Sun sinking near horizon
        ctx.fillStyle = '#ffedd5';
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(w * 0.65, horizonY * 0.85, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
  
      // Distant Mountain Ranges (Parallax Layer 1)
      const mountainScroll = (trainPos * 0.04) % (w * 0.5);
      ctx.fillStyle = timeOfDay === 'night' ? '#080d1e' : (timeOfDay === 'sunset' ? '#431407' : '#1e3a8a');
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      for (let x = -mountainScroll; x <= w + 100; x += 120) {
        const peakHeight = 45 + Math.sin(x * 0.02) * 35;
        ctx.lineTo(x + 60, horizonY - peakHeight);
        ctx.lineTo(x + 120, horizonY);
      }
      ctx.closePath();
      ctx.fill();
  
      // Midground Hills / City Skyline (Parallax Layer 2)
      const hillScroll = (trainPos * 0.12) % (w * 0.3);
      ctx.fillStyle = timeOfDay === 'night' ? '#0b1329' : (timeOfDay === 'sunset' ? '#701a75' : '#047857');
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      for (let x = -hillScroll; x <= w + 100; x += 80) {
        const hillHeight = 22 + Math.sin(x * 0.035) * 18;
        ctx.lineTo(x + 40, horizonY - hillHeight);
        ctx.lineTo(x + 80, horizonY);
      }
      ctx.closePath();
      ctx.fill();
    }
  
    drawGroundAndBallast(ctx, w, h, horizonY, project, cameraZ, timeOfDay) {
      // Terrain Ground (Green grass / Dark gravel / Night terrain)
      let groundGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      if (timeOfDay === 'night') {
        groundGrad.addColorStop(0, '#040810');
        groundGrad.addColorStop(1.0, '#0b111e');
      } else if (timeOfDay === 'sunset') {
        groundGrad.addColorStop(0, '#2d1810');
        groundGrad.addColorStop(1.0, '#1c1917');
      } else {
        groundGrad.addColorStop(0, '#15803d');
        groundGrad.addColorStop(1.0, '#166534');
      }
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizonY, w, h - horizonY);
  
      // Ballast Bed (Trapezoid gravel track bed)
      const farZ = cameraZ + 380;
      const nearZ = cameraZ + 1.2;
  
      const pFarL = project(-2.2, 0, farZ);
      const pFarR = project(2.2, 0, farZ);
      const pNearL = project(-2.9, 0, nearZ);
      const pNearR = project(2.9, 0, nearZ);
  
      if (pFarL && pFarR && pNearL && pNearR) {
        ctx.fillStyle = timeOfDay === 'night' ? '#181b22' : '#334155';
        ctx.beginPath();
        ctx.moveTo(pFarL.x, pFarL.y);
        ctx.lineTo(pFarR.x, pFarR.y);
        ctx.lineTo(pNearR.x, pNearR.y);
        ctx.lineTo(pNearL.x, pNearL.y);
        ctx.closePath();
        ctx.fill();
  
        // Ballast gravel shoulder edges
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pFarL.x, pFarL.y);
        ctx.lineTo(pNearL.x, pNearL.y);
        ctx.moveTo(pFarR.x, pFarR.y);
        ctx.lineTo(pNearR.x, pNearR.y);
        ctx.stroke();
      }
    }
  
    drawRailTies(ctx, project, cameraZ, timeOfDay) {
      const tieSpacing = 0.85; // meters
      const tieWidth = 1.35; // half width (2.7m total sleeper length)
      const startZ = Math.floor(cameraZ / tieSpacing) * tieSpacing;
      const endZ = cameraZ + 160;
  
      ctx.fillStyle = timeOfDay === 'night' ? '#1c1917' : '#451a03'; // Wooden/Concrete sleepers
      ctx.strokeStyle = '#0c0a09';
  
      for (let z = endZ; z >= startZ; z -= tieSpacing) {
        if (z <= cameraZ + 0.5) continue;
        const pL = project(-tieWidth, 0.05, z);
        const pR = project(tieWidth, 0.05, z);
        if (!pL || !pR) continue;
  
        const tieThickness = Math.max(1.2, 3.8 * pL.scale);
        ctx.lineWidth = 1;
        ctx.fillRect(pL.x, pL.y - tieThickness, pR.x - pL.x, tieThickness);
      }
    }
  
    drawSteelRails(ctx, project, cameraZ, trackHalfGauge, headlightsOn, timeOfDay) {
      const steps = 40;
      const maxViewZ = 350;
      const stepSize = maxViewZ / steps;
  
      // Left & Right Rails Points
      const leftRail = [];
      const rightRail = [];
  
      for (let i = 0; i <= steps; i++) {
        const z = cameraZ + 0.8 + (i * stepSize);
        const pL = project(-trackHalfGauge, 0.16, z);
        const pR = project(trackHalfGauge, 0.16, z);
        if (pL && pR) {
          leftRail.push(pL);
          rightRail.push(pR);
        }
      }
  
      if (leftRail.length < 2) return;
  
      // Draw Rail Base Shadow
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      this.strokeRailPath(ctx, leftRail);
      this.strokeRailPath(ctx, rightRail);
  
      // Draw Steel Rail Top (Shiny metallic chrome line)
      ctx.strokeStyle = timeOfDay === 'night' && headlightsOn ? '#e2e8f0' : '#cbd5e1';
      ctx.lineWidth = 2.5;
      this.strokeRailPath(ctx, leftRail);
      this.strokeRailPath(ctx, rightRail);
  
      // Inner rail highlight
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      this.strokeRailPath(ctx, leftRail);
      this.strokeRailPath(ctx, rightRail);
    }
  
    strokeRailPath(ctx, points) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }
  
    drawStations(ctx, project, cameraZ, stationSystem, trackHalfGauge, timeOfDay) {
      const stations = stationSystem.stations || [];
  
      for (const st of stations) {
        const dist = st.stopPosition - cameraZ;
        if (dist < -80 || dist > 450) continue;
  
        // Platform is positioned on the right side of the track
        const platStart = st.stopPosition - st.platformLength + 20;
        const platEnd = st.stopPosition + 35;
        const platSideX = trackHalfGauge + 1.2;
        const platWidth = 4.5;
        const platHeight = 0.95; // elevated platform level
  
        // 1. Platform Concrete Surface
        const pNearFront = project(platSideX, platHeight, Math.max(cameraZ + 0.8, platStart));
        const pNearBack = project(platSideX + platWidth, platHeight, Math.max(cameraZ + 0.8, platStart));
        const pFarFront = project(platSideX, platHeight, platEnd);
        const pFarBack = project(platSideX + platWidth, platHeight, platEnd);
  
        if (pNearFront && pNearBack && pFarFront && pFarBack) {
          // Platform Deck Surface
          ctx.fillStyle = timeOfDay === 'night' ? '#334155' : '#94a3b8';
          ctx.beginPath();
          ctx.moveTo(pNearFront.x, pNearFront.y);
          ctx.lineTo(pNearBack.x, pNearBack.y);
          ctx.lineTo(pFarBack.x, pFarBack.y);
          ctx.lineTo(pFarFront.x, pFarFront.y);
          ctx.closePath();
          ctx.fill();
  
          // Platform Concrete Wall Face
          const pNearBase = project(platSideX, 0, Math.max(cameraZ + 0.8, platStart));
          const pFarBase = project(platSideX, 0, platEnd);
          if (pNearBase && pFarBase) {
            ctx.fillStyle = timeOfDay === 'night' ? '#1e293b' : '#64748b';
            ctx.beginPath();
            ctx.moveTo(pNearFront.x, pNearFront.y);
            ctx.lineTo(pFarFront.x, pFarFront.y);
            ctx.lineTo(pFarBase.x, pFarBase.y);
            ctx.lineTo(pNearBase.x, pNearBase.y);
            ctx.closePath();
            ctx.fill();
          }
  
          // Yellow Platform Safety Line
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = Math.max(1.5, 3 * pNearFront.scale);
          ctx.beginPath();
          ctx.moveTo(pNearFront.x, pNearFront.y);
          ctx.lineTo(pFarFront.x, pFarFront.y);
          ctx.stroke();
  
          // Platform Roof Canopy Posts
          for (let postZ = platStart + 20; postZ < platEnd; postZ += 35) {
            if (postZ < cameraZ + 1) continue;
            const pPostBase = project(platSideX + 2.0, platHeight, postZ);
            const pPostTop = project(platSideX + 2.0, platHeight + 3.8, postZ);
            const pRoofOuter = project(platSideX - 0.5, platHeight + 4.2, postZ);
            if (pPostBase && pPostTop && pRoofOuter) {
              ctx.strokeStyle = '#0284c7';
              ctx.lineWidth = Math.max(2, 4 * pPostBase.scale);
              ctx.beginPath();
              ctx.moveTo(pPostBase.x, pPostBase.y);
              ctx.lineTo(pPostTop.x, pPostTop.y);
              ctx.lineTo(pRoofOuter.x, pRoofOuter.y);
              ctx.stroke();
            }
          }
        }
  
        // 2. STOP ZONE MARKER (Vibrant Green/Yellow target box on tracks & platform)
        const stopZ = st.stopPosition;
        if (stopZ > cameraZ + 0.5 && stopZ < cameraZ + 350) {
          const pStopL = project(-trackHalfGauge * 1.3, 0.08, stopZ);
          const pStopR = project(trackHalfGauge * 1.3, 0.08, stopZ);
          const pPlatStop = project(platSideX + 1.2, platHeight + 0.05, stopZ);
  
          if (pStopL && pStopR) {
            // Track Stop Line Marker
            ctx.strokeStyle = '#ef4444'; // Bright Red Target Stop Line
            ctx.lineWidth = Math.max(2.5, 6 * pStopL.scale);
            ctx.beginPath();
            ctx.moveTo(pStopL.x, pStopL.y);
            ctx.lineTo(pStopR.x, pStopR.y);
            ctx.stroke();
  
            // Chevron Stripes on Stop Box
            ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
            const pBoxBackL = project(-trackHalfGauge * 1.3, 0.08, stopZ - 3);
            const pBoxBackR = project(trackHalfGauge * 1.3, 0.08, stopZ - 3);
            if (pBoxBackL && pBoxBackR) {
              ctx.beginPath();
              ctx.moveTo(pBoxBackL.x, pBoxBackL.y);
              ctx.lineTo(pBoxBackR.x, pBoxBackR.y);
              ctx.lineTo(pStopR.x, pStopR.y);
              ctx.lineTo(pStopL.x, pStopL.y);
              ctx.closePath();
              ctx.fill();
            }
  
            // STOP TARGET Text on Platform
            if (pPlatStop && pPlatStop.scale > 0.003) {
              ctx.font = 'bold 12px Inter, sans-serif';
              ctx.fillStyle = '#ef4444';
              ctx.fillText('🛑 STOP HERE', pPlatStop.x, pPlatStop.y);
            }
          }
  
          // Station Name Board Signpost
          const pSignBase = project(platSideX + 2.5, platHeight, st.stopPosition - 15);
          const pSignTop = project(platSideX + 2.5, platHeight + 2.6, st.stopPosition - 15);
          if (pSignBase && pSignTop && pSignBase.scale > 0.0025) {
            const signW = 90 * pSignBase.scale;
            const signH = 34 * pSignBase.scale;
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(pSignTop.x - signW * 0.5, pSignTop.y - signH * 0.5, signW, signH);
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(pSignTop.x - signW * 0.5, pSignTop.y - signH * 0.5, signW, signH);
  
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(st.name, pSignTop.x, pSignTop.y + 4);
            ctx.textAlign = 'left';
          }
        }
      }
    }
  
    drawScenery(ctx, project, cameraZ, trackManager, timeOfDay) {
      const scenery = trackManager.scenery || [];
  
      for (const item of scenery) {
        const relZ = item.position - cameraZ;
        if (relZ < 1 || relZ > 420) continue;
  
        if (item.type === 'catenary') {
          // Overhead Electrification Mast & Portal
          const pBase = project(item.side * 2.8, 0, item.position);
          const pTop = project(item.side * 2.8, 6.8, item.position);
          const pWireAnchor = project(0, 5.4, item.position);
  
          if (pBase && pTop && pWireAnchor) {
            ctx.strokeStyle = timeOfDay === 'night' ? '#334155' : '#64748b';
            ctx.lineWidth = Math.max(1.5, 3.5 * pBase.scale);
  
            // Vertical Mast Pole
            ctx.beginPath();
            ctx.moveTo(pBase.x, pBase.y);
            ctx.lineTo(pTop.x, pTop.y);
            // Horizontal Cantilever Arm over rails
            ctx.lineTo(pWireAnchor.x, pWireAnchor.y);
            ctx.stroke();
  
            // Insulator bushing
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(pWireAnchor.x, pWireAnchor.y, Math.max(1.5, 3 * pBase.scale), 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (item.type === 'tree') {
          const p = project(item.side * item.dist, 0, item.position);
          if (p && p.scale > 0.002) {
            const treeH = 38 * p.scale * item.scale;
            const treeW = 24 * p.scale * item.scale;
  
            // Tree trunk
            ctx.fillStyle = '#3e2723';
            ctx.fillRect(p.x - 2 * p.scale, p.y - treeH * 0.3, 4 * p.scale, treeH * 0.3);
  
            // Foliage
            ctx.fillStyle = timeOfDay === 'night' ? '#064e3b' : (timeOfDay === 'sunset' ? '#14532d' : '#15803d');
            ctx.beginPath();
            ctx.arc(p.x, p.y - treeH * 0.65, treeW, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (item.type === 'building') {
          const p = project(item.side * item.dist, 0, item.position);
          if (p && p.scale > 0.002) {
            const bW = item.width * p.scale * 12;
            const bH = item.height * p.scale * 14;
  
            ctx.fillStyle = item.color;
            ctx.fillRect(p.x - bW * 0.5, p.y - bH, bW, bH);
  
            // Lit windows at night
            if (timeOfDay === 'night' || timeOfDay === 'sunset') {
              ctx.fillStyle = '#fef08a';
              const winRows = 4;
              const winCols = 3;
              for (let r = 0; r < winRows; r++) {
                for (let c = 0; c < winCols; c++) {
                  if ((r + c + item.position) % 2 === 0) {
                    ctx.fillRect(
                      p.x - bW * 0.4 + (c * (bW * 0.28)),
                      p.y - bH + 8 + (r * (bH * 0.22)),
                      Math.max(2, 4 * p.scale),
                      Math.max(2, 5 * p.scale)
                    );
                  }
                }
              }
            }
          }
        }
      }
    }
  
    drawSignals(ctx, project, cameraZ, signalSystem, timeOfDay) {
      const signals = signalSystem.signals || [];
  
      for (const sig of signals) {
        const relZ = sig.positionMeters - cameraZ;
        if (relZ < 1 || relZ > 420) continue;
  
        // Signal mast located on left side of track
        const mastX = -2.4;
        const pBase = project(mastX, 0, sig.positionMeters);
        const pHead = project(mastX, 4.6, sig.positionMeters);
  
        if (pBase && pHead) {
          // Mast Pole
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = Math.max(1.8, 4 * pBase.scale);
          ctx.beginPath();
          ctx.moveTo(pBase.x, pBase.y);
          ctx.lineTo(pHead.x, pHead.y);
          ctx.stroke();
  
          // Signal Head Enclosure Box
          const boxW = 16 * pHead.scale;
          const boxH = 42 * pHead.scale;
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(pHead.x - boxW * 0.5, pHead.y - boxH * 0.5, boxW, boxH);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.strokeRect(pHead.x - boxW * 0.5, pHead.y - boxH * 0.5, boxW, boxH);
  
          // Aspect Lenses: Red (Top), Yellow (Middle), Green (Bottom)
          const radius = Math.max(1.8, 4.2 * pHead.scale);
          const offsets = [-boxH * 0.28, 0, boxH * 0.28];
          const aspects = ['RED', 'YELLOW', 'GREEN'];
          const colors = {
            RED: '#ef4444',
            YELLOW: '#f59e0b',
            GREEN: '#22c55e'
          };
  
          aspects.forEach((asp, idx) => {
            const lensY = pHead.y + offsets[idx];
            const isActive = sig.aspect === asp;
  
            if (isActive) {
              // Neon Glow / Bloom
              ctx.shadowColor = colors[asp];
              ctx.shadowBlur = Math.max(6, 20 * pHead.scale);
              ctx.fillStyle = colors[asp];
            } else {
              ctx.shadowBlur = 0;
              ctx.fillStyle = '#1e293b'; // Unlit lens
            }
  
            ctx.beginPath();
            ctx.arc(pHead.x, lensY, radius, 0, Math.PI * 2);
            ctx.fill();
          });
  
          ctx.shadowBlur = 0;
        }
      }
    }
  
    drawHeadlightBeams(ctx, w, h, horizonY, isCab) {
      const originX = w * 0.5;
      const originY = isCab ? h * 0.72 : h * 0.78;
  
      const grad = ctx.createRadialGradient(
        originX, originY, 15,
        originX, horizonY + 30, w * 0.65
      );
      grad.addColorStop(0, 'rgba(255, 255, 230, 0.45)');
      grad.addColorStop(0.35, 'rgba(255, 255, 200, 0.18)');
      grad.addColorStop(1.0, 'rgba(255, 255, 200, 0.0)');
  
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(originX - 45, originY);
      ctx.lineTo(w * 0.1, horizonY + 20);
      ctx.lineTo(w * 0.9, horizonY + 20);
      ctx.lineTo(originX + 45, originY);
      ctx.closePath();
      ctx.fill();
    }
  
    drawChaseLocomotive(ctx, w, h, horizonY, state, timeOfDay) {
      // 3D perspective elevated chase view of modern high-speed locomotive
      const centerX = w * 0.5;
      const locoBaseY = h * 0.86;
      const locoWidth = w * 0.26;
      const locoHeight = h * 0.22;
  
      // Aerodynamic Nose Wedge
      ctx.save();
      
      // Train Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(centerX, locoBaseY + 6, locoWidth * 0.65, locoHeight * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
  
      // Body Gradient (Cyber Blue / Midnight Steel)
      const bodyGrad = ctx.createLinearGradient(centerX - locoWidth * 0.5, 0, centerX + locoWidth * 0.5, 0);
      bodyGrad.addColorStop(0, '#0369a1');
      bodyGrad.addColorStop(0.3, '#0284c7');
      bodyGrad.addColorStop(0.5, '#38bdf8');
      bodyGrad.addColorStop(0.7, '#0284c7');
      bodyGrad.addColorStop(1.0, '#0369a1');
  
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.moveTo(centerX - locoWidth * 0.42, locoBaseY);
      ctx.lineTo(centerX - locoWidth * 0.32, locoBaseY - locoHeight);
      ctx.lineTo(centerX + locoWidth * 0.32, locoBaseY - locoHeight);
      ctx.lineTo(centerX + locoWidth * 0.42, locoBaseY);
      ctx.closePath();
      ctx.fill();
  
      // Windshield Glass (dark cyan reflective tint)
      ctx.fillStyle = '#082f49';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - locoWidth * 0.25, locoBaseY - locoHeight * 0.45);
      ctx.lineTo(centerX - locoWidth * 0.20, locoBaseY - locoHeight * 0.85);
      ctx.lineTo(centerX + locoWidth * 0.20, locoBaseY - locoHeight * 0.85);
      ctx.lineTo(centerX + locoWidth * 0.25, locoBaseY - locoHeight * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
  
      // High-Intensity Front LED Headlights
      if (state.headlights) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#ffffff';
  
        // Left LED Cluster
        ctx.fillRect(centerX - locoWidth * 0.28, locoBaseY - locoHeight * 0.3, 16, 8);
        // Right LED Cluster
        ctx.fillRect(centerX + locoWidth * 0.28 - 16, locoBaseY - locoHeight * 0.3, 16, 8);
        // Center Top High-Beam
        ctx.fillRect(centerX - 8, locoBaseY - locoHeight * 0.94, 16, 7);
  
        ctx.shadowBlur = 0;
      }
  
      // Racing/Platform Striping
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(centerX - locoWidth * 0.35, locoBaseY - locoHeight * 0.25, locoWidth * 0.7, 4);
  
      ctx.restore();
    }
  
    drawCabCockpit(ctx, w, h, state, dt, weather) {
      // Driver Cockpit Frame & Windscreen Overlay
      ctx.save();
  
      // Left & Right Cab Pillars
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w * 0.12, 0);
      ctx.lineTo(w * 0.18, h * 0.75);
      ctx.lineTo(0, h * 0.75);
      ctx.closePath();
      ctx.fill();
  
      ctx.beginPath();
      ctx.moveTo(w, 0);
      ctx.lineTo(w * 0.88, 0);
      ctx.lineTo(w * 0.82, h * 0.75);
      ctx.lineTo(w, h * 0.75);
      ctx.closePath();
      ctx.fill();
  
      // Cockpit Roof Trim
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, w, h * 0.08);
  
      // Windshield Wipers in Rain
      if (weather === 'rain') {
        this.wiperAngle += dt * 3.5 * this.wiperDirection;
        if (this.wiperAngle > 1.2) {
          this.wiperAngle = 1.2;
          this.wiperDirection = -1;
        } else if (this.wiperAngle < -0.2) {
          this.wiperAngle = -0.2;
          this.wiperDirection = 1;
        }
  
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 5;
        ctx.beginPath();
        const wiperBaseX = w * 0.35;
        const wiperBaseY = h * 0.72;
        const wiperLen = h * 0.38;
        const endX = wiperBaseX + Math.sin(this.wiperAngle) * wiperLen;
        const endY = wiperBaseY - Math.cos(this.wiperAngle) * wiperLen;
        ctx.moveTo(wiperBaseX, wiperBaseY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
  
      // Driver Console Dashboard Bench
      const consoleGrad = ctx.createLinearGradient(0, h * 0.72, 0, h);
      consoleGrad.addColorStop(0, '#1e293b');
      consoleGrad.addColorStop(0.2, '#0f172a');
      consoleGrad.addColorStop(1.0, '#020617');
  
      ctx.fillStyle = consoleGrad;
      ctx.fillRect(0, h * 0.72, w, h * 0.28);
  
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.72);
      ctx.lineTo(w, h * 0.72);
      ctx.stroke();
  
      ctx.restore();
    }
  
    drawRain(ctx, w, h, speedKmh, dt) {
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
      ctx.lineWidth = 1.5;
  
      const slant = 18 + (speedKmh / 140) * 45;
  
      ctx.beginPath();
      for (const drop of this.rainDrops) {
        drop.y += drop.speed * (dt * 60) * 0.025;
        drop.x += (slant / w) * (dt * 60) * 0.025;
  
        if (drop.y > 1) {
          drop.y = 0;
          drop.x = Math.random();
        }
        if (drop.x > 1) drop.x = 0;
  
        const px = drop.x * w;
        const py = drop.y * h;
  
        ctx.moveTo(px, py);
        ctx.lineTo(px + slant * 0.4, py + drop.length);
      }
      ctx.stroke();
    }
  
    drawFog(ctx, w, h, horizonY) {
      const fogGrad = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 120);
      fogGrad.addColorStop(0, 'rgba(203, 213, 225, 0.45)');
      fogGrad.addColorStop(0.5, 'rgba(226, 232, 240, 0.65)');
      fogGrad.addColorStop(1.0, 'rgba(241, 245, 249, 0.0)');
  
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, horizonY - 40, w, 160);
    }
  }
  

  // --- Module: engine/InputManager.js ---
  ﻿/**
   * Railway Commander - Input Manager
   * Handles keyboard controls, on-screen touch buttons, and responsive inputs
   * without interfering with parent platform page navigation.
   */
  
  class InputManager {
    constructor(gameEngine) {
      this.engine = gameEngine;
      this.keyState = {};
      this.enabled = true;
      this.touchBindings = [];
    }
  
    bindControls() {
      // Keyboard Event Listener
      window.addEventListener('keydown', (e) => this.handleKeyDown(e));
      window.addEventListener('keyup', (e) => this.handleKeyUp(e));
  
      // Bind on-screen UI buttons if present
      this.bindTouchButton('btnThrottleUp', () => this.engine.onThrottleUp());
      this.bindTouchButton('btnThrottleDown', () => this.engine.onThrottleDown());
      this.bindTouchButton('btnBrakeUp', () => this.engine.onBrakeUp());
      this.bindTouchButton('btnBrakeDown', () => this.engine.onBrakeDown());
      this.bindTouchButton('btnEmergencyBrake', () => this.engine.onEmergencyBrake());
      this.bindTouchButton('btnHeadlights', () => this.engine.onToggleHeadlights());
      this.bindTouchButton('btnCameraToggle', () => this.engine.onToggleCamera());
      this.bindTouchButton('btnPauseGame', () => this.engine.togglePause());
  
      // Horn button supports hold / release
      const hornBtn = document.getElementById('btnHorn');
      if (hornBtn) {
        const startHorn = (e) => {
          if (e) e.preventDefault();
          this.engine.onHorn(true);
        };
        const stopHorn = (e) => {
          if (e) e.preventDefault();
          this.engine.onHorn(false);
        };
  
        hornBtn.addEventListener('mousedown', startHorn);
        window.addEventListener('mouseup', stopHorn);
        hornBtn.addEventListener('touchstart', startHorn, { passive: false });
        window.addEventListener('touchend', stopHorn);
      }
    }
  
    bindTouchButton(elementId, callback) {
      const el = document.getElementById(elementId);
      if (!el) return;
  
      const handler = (e) => {
        e.preventDefault();
        if (!this.enabled) return;
        callback();
      };
  
      el.addEventListener('click', handler);
      this.touchBindings.push({ el, handler });
    }
  
    handleKeyDown(e) {
      if (!this.enabled) return;
  
      // Ignore when user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }
  
      const key = e.key;
  
      // Pause toggle
      if (key === 'Escape' || key === 'p' || key === 'P') {
        e.preventDefault();
        this.engine.togglePause();
        return;
      }
  
      // Controls only work during active driving
      if (this.engine.state !== 'DRIVING') {
        return;
      }
  
      switch (key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
          e.preventDefault();
          this.engine.onThrottleUp();
          break;
  
        case 's':
        case 'S':
        case 'ArrowDown':
          e.preventDefault();
          this.engine.onBrakeUp();
          break;
  
        case 'a':
        case 'A':
        case 'ArrowLeft':
          e.preventDefault();
          this.engine.onThrottleDown();
          break;
  
        case 'd':
        case 'D':
        case 'ArrowRight':
          e.preventDefault();
          this.engine.onBrakeDown();
          break;
  
        case ' ': // Spacebar
          e.preventDefault();
          this.engine.onEmergencyBrake();
          break;
  
        case 'h':
        case 'H':
          e.preventDefault();
          if (!this.keyState['h']) {
            this.keyState['h'] = true;
            this.engine.onHorn(true);
          }
          break;
  
        case 'l':
        case 'L':
          e.preventDefault();
          this.engine.onToggleHeadlights();
          break;
  
        case 'c':
        case 'C':
          e.preventDefault();
          this.engine.onToggleCamera();
          break;
      }
    }
  
    handleKeyUp(e) {
      const key = e.key;
      if (key === 'h' || key === 'H') {
        this.keyState['h'] = false;
        this.engine.onHorn(false);
      }
    }
  
    setEnabled(enabled) {
      this.enabled = Boolean(enabled);
    }
  }
  

  // --- Module: engine/UIManager.js ---
  /**
   * Railway Commander - UI Manager
   * Handles HUD gauges, digital speedometer, throttle/brake LED indicators,
   * warning banners, mission briefing, countdowns, pause, game-over, and results modals.
   */
  
  class UIManager {
    constructor(gameEngine) {
      this.engine = gameEngine;
      this.dom = {};
      this.notificationTimeout = null;
    }
  
    init() {
      this.cacheDomElements();
      this.bindEvents();
    }
  
    cacheDomElements() {
      // Screens
      this.dom.screenMainMenu = document.getElementById('screenMainMenu');
      this.dom.screenMissions = document.getElementById('screenMissions');
      this.dom.screenProgress = document.getElementById('screenProgress');
      this.dom.screenSettings = document.getElementById('screenSettings');
      this.dom.screenBriefing = document.getElementById('screenBriefing');
      this.dom.gameHUD = document.getElementById('gameHUD');
      this.dom.screenCountdown = document.getElementById('screenCountdown');
      this.dom.screenPause = document.getElementById('screenPause');
      this.dom.screenComplete = document.getElementById('screenComplete');
      this.dom.screenFailed = document.getElementById('screenFailed');
  
      // HUD Elements
      this.dom.hudSpeedVal = document.getElementById('hudSpeedVal');
      this.dom.hudSpeedGaugeNeedle = document.getElementById('hudSpeedGaugeNeedle');
      this.dom.hudSpeedLimitVal = document.getElementById('hudSpeedLimitVal');
      this.dom.hudOverspeedBadge = document.getElementById('hudOverspeedBadge');
  
      this.dom.hudThrottleFill = document.getElementById('hudThrottleFill');
      this.dom.hudThrottleLevel = document.getElementById('hudThrottleLevel');
      this.dom.hudBrakeFill = document.getElementById('hudBrakeFill');
      this.dom.hudBrakeLevel = document.getElementById('hudBrakeLevel');
      this.dom.hudEBrakeBadge = document.getElementById('hudEBrakeBadge');
  
      this.dom.hudSignalIcon = document.getElementById('hudSignalIcon');
      this.dom.hudSignalDist = document.getElementById('hudSignalDist');
      this.dom.hudSignalName = document.getElementById('hudSignalName');
  
      this.dom.hudStationName = document.getElementById('hudStationName');
      this.dom.hudStationDist = document.getElementById('hudStationDist');
      this.dom.hudDistanceDriven = document.getElementById('hudDistanceDriven');
  
      this.dom.hudMissionName = document.getElementById('hudMissionName');
      this.dom.hudMissionObjective = document.getElementById('hudMissionObjective');
      this.dom.hudAlertBanner = document.getElementById('hudAlertBanner');
      this.dom.hudCameraBadge = document.getElementById('hudCameraBadge');
      this.dom.hudHeadlightsBadge = document.getElementById('hudHeadlightsBadge');
  
      // Countdown
      this.dom.countdownNumber = document.getElementById('countdownNumber');
  
      // Briefing elements
      this.dom.briefingTitle = document.getElementById('briefingTitle');
      this.dom.briefingTagline = document.getElementById('briefingTagline');
      this.dom.briefingRoute = document.getElementById('briefingRoute');
      this.dom.briefingDistance = document.getElementById('briefingDistance');
      this.dom.briefingSpeedLimit = document.getElementById('briefingSpeedLimit');
      this.dom.briefingObjective = document.getElementById('briefingObjective');
      this.dom.briefingStations = document.getElementById('briefingStations');
  
      // Complete Screen elements
      this.dom.completeTitle = document.getElementById('completeTitle');
      this.dom.completeScore = document.getElementById('completeScore');
      this.dom.completeRank = document.getElementById('completeRank');
      this.dom.completeStars = document.getElementById('completeStars');
      this.dom.completeXp = document.getElementById('completeXp');
      this.dom.completeCoins = document.getElementById('completeCoins');
      this.dom.completeBreakdown = document.getElementById('completeBreakdown');
  
      // Failed Screen elements
      this.dom.failedReason = document.getElementById('failedReason');
  
      // Missions List Container
      this.dom.missionsListGrid = document.getElementById('missionsListGrid');
  
      // Progress Elements
      this.dom.progressLevel = document.getElementById('progressLevel');
      this.dom.progressXp = document.getElementById('progressXp');
      this.dom.progressCoins = document.getElementById('progressCoins');
      this.dom.progressStarsTotal = document.getElementById('progressStarsTotal');
      this.dom.progressMissionsTotal = document.getElementById('progressMissionsTotal');
    }
  
    bindEvents() {
      document.getElementById('btnMenuPlay')?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        this.engine.prepareMission('mission-1');
      });
      document.getElementById('btnMenuMissions')?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        this.showMissionsScreen();
      });
      document.getElementById('btnMenuProgress')?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        this.showProgressScreen();
      });
      document.getElementById('btnMenuSettings')?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        this.showSettingsScreen();
      });
  
      document.querySelectorAll('.btn-back-menu').forEach(btn => {
        btn.addEventListener('click', () => {
          this.engine.soundManager.playClick();
          this.showMainMenu();
        });
      });
  
      document.getElementById('btnStartJourney')?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        this.engine.beginJourneyCountdown();
      });
  
      document.getElementById('btnResumeGame')?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        this.engine.resumeGame();
      });
      document.getElementById('btnRestartGame')?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        this.engine.restartCurrentMission();
      });
      document.getElementById('btnQuitToMenu')?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        this.engine.quitToMenu();
      });
  
      document.getElementById('btnRetryFailed')?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        this.engine.restartCurrentMission();
      });
      document.getElementById('btnFailedMenu')?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        this.engine.quitToMenu();
      });
  
      document.getElementById('btnNextMission')?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        const res = this.engine.lastMissionResult;
        if (res && res.nextMissionId) {
          this.engine.prepareMission(res.nextMissionId);
        } else {
          this.showMissionsScreen();
        }
      });
      document.getElementById('btnRetryComplete')?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        this.engine.restartCurrentMission();
      });
      document.getElementById('btnCompleteMenu')?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        this.engine.quitToMenu();
      });
  
      const sfxBtn = document.getElementById('btnSettingSound');
      if (sfxBtn) {
        sfxBtn.addEventListener('click', () => {
          const active = this.engine.soundManager.toggleSound();
          sfxBtn.classList.toggle('active', active);
          sfxBtn.textContent = active ? 'ON' : 'OFF';
        });
      }
  
      const musicBtn = document.getElementById('btnSettingMusic');
      if (musicBtn) {
        musicBtn.addEventListener('click', () => {
          const active = !this.engine.soundManager.musicEnabled;
          this.engine.soundManager.musicEnabled = active;
          this.engine.saveManager.saveSettings({ music: active });
          musicBtn.classList.toggle('active', active);
          musicBtn.textContent = active ? 'ON' : 'OFF';
        });
      }
  
      document.querySelectorAll('.quality-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.engine.soundManager.playClick();
          const q = btn.getAttribute('data-quality');
          this.engine.saveManager.saveSettings({ quality: q });
          document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    }
  
    showScreen(targetId) {
      const screens = [
        'screenMainMenu', 'screenMissions', 'screenProgress', 'screenSettings',
        'screenBriefing', 'screenCountdown', 'screenPause', 'screenComplete', 'screenFailed'
      ];
  
      screens.forEach(id => {
        const el = this.dom[id];
        if (el) {
          if (id === targetId) {
            el.classList.add('active');
            el.style.display = 'flex';
          } else {
            el.classList.remove('active');
            el.style.display = 'none';
          }
        }
      });
  
      if (targetId === 'gameHUD' || targetId === 'screenCountdown') {
        if (this.dom.gameHUD) {
          this.dom.gameHUD.classList.remove('hidden');
          this.dom.gameHUD.style.display = 'flex';
        }
      } else if (targetId === 'screenPause') {
        if (this.dom.gameHUD) {
          this.dom.gameHUD.classList.remove('hidden');
          this.dom.gameHUD.style.display = 'flex';
        }
      } else {
        if (this.dom.gameHUD) {
          this.dom.gameHUD.classList.add('hidden');
          this.dom.gameHUD.style.display = 'none';
        }
      }
    }
  
    showMainMenu() {
      this.showScreen('screenMainMenu');
    }
  
    showMissionsScreen() {
      this.renderMissionsList();
      this.showScreen('screenMissions');
    }
  
    showProgressScreen() {
      const p = this.engine.saveManager.getProgress();
      if (this.dom.progressLevel) this.dom.progressLevel.textContent = `Level ${p.driverLevel}`;
      if (this.dom.progressXp) this.dom.progressXp.textContent = `${p.totalXp.toLocaleString()} XP`;
      if (this.dom.progressCoins) this.dom.progressCoins.textContent = `${p.coins.toLocaleString()} 🪙`;
  
      const totalStars = Object.values(p.missionStars || {}).reduce((a, b) => a + b, 0);
      if (this.dom.progressStarsTotal) this.dom.progressStarsTotal.textContent = `${totalStars} ★`;
      if (this.dom.progressMissionsTotal) this.dom.progressMissionsTotal.textContent = `${p.completedMissions.length} / 4`;
  
      this.showScreen('screenProgress');
    }
  
    showSettingsScreen() {
      const s = this.engine.saveManager.settings;
      const sfxBtn = document.getElementById('btnSettingSound');
      if (sfxBtn) {
        sfxBtn.classList.toggle('active', s.sound !== false);
        sfxBtn.textContent = s.sound !== false ? 'ON' : 'OFF';
      }
  
      const musicBtn = document.getElementById('btnSettingMusic');
      if (musicBtn) {
        musicBtn.classList.toggle('active', s.music !== false);
        musicBtn.textContent = s.music !== false ? 'ON' : 'OFF';
      }
  
      document.querySelectorAll('.quality-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-quality') === (s.quality || 'HIGH'));
      });
  
      this.showScreen('screenSettings');
    }
  
    showBriefing(mission) {
      if (!mission) return;
      if (this.dom.briefingTitle) this.dom.briefingTitle.textContent = `MISSION ${mission.number}: ${mission.title}`;
      if (this.dom.briefingTagline) this.dom.briefingTagline.textContent = mission.tagline;
      if (this.dom.briefingRoute) this.dom.briefingRoute.textContent = mission.route;
      if (this.dom.briefingDistance) this.dom.briefingDistance.textContent = mission.distanceFormatted;
      if (this.dom.briefingSpeedLimit) this.dom.briefingSpeedLimit.textContent = `${mission.speedLimitKmh} km/h`;
      if (this.dom.briefingObjective) this.dom.briefingObjective.textContent = mission.objective;
  
      if (this.dom.briefingStations) {
        this.dom.briefingStations.innerHTML = (mission.stations || []).map((s, idx) => `
          <div class="briefing-station-item">
            <span class="station-dot">🚉</span>
            <span class="station-name">${s.name} (${(s.stopPosition / 1000).toFixed(1)} km)</span>
          </div>
        `).join('');
      }
  
      this.showScreen('screenBriefing');
    }
  
    showCountdown(number) {
      if (this.dom.countdownNumber) {
        this.dom.countdownNumber.textContent = number;
        this.dom.countdownNumber.classList.remove('pulse');
        void this.dom.countdownNumber.offsetWidth;
        this.dom.countdownNumber.classList.add('pulse');
      }
      this.showScreen('screenCountdown');
    }
  
    showHUD() {
      this.showScreen('gameHUD');
    }
  
    showPause() {
      this.showScreen('screenPause');
    }
  
    showMissionFailed(reason) {
      if (this.dom.failedReason) {
        this.dom.failedReason.textContent = reason || 'Mission rules violation.';
      }
      this.showScreen('screenFailed');
    }
  
    showMissionComplete(results) {
      if (!results) return;
  
      if (this.dom.completeTitle) this.dom.completeTitle.textContent = `${results.missionTitle} Completed! 🎉`;
      if (this.dom.completeScore) this.dom.completeScore.textContent = `${results.finalScore.toLocaleString()} PTS`;
      if (this.dom.completeRank) this.dom.completeRank.textContent = results.rank;
      if (this.dom.completeStars) {
        let starsHtml = '';
        for (let i = 1; i <= 3; i++) {
          starsHtml += i <= results.stars ? '⭐ ' : '☆ ';
        }
        this.dom.completeStars.textContent = starsHtml.trim();
      }
      if (this.dom.completeXp) this.dom.completeXp.textContent = `+${results.earnedXp} XP`;
      if (this.dom.completeCoins) this.dom.completeCoins.textContent = `+${results.earnedCoins} COINS`;
  
      if (this.dom.completeBreakdown) {
        const b = results.breakdown;
        this.dom.completeBreakdown.innerHTML = `
          <div class="score-row"><span>Base Safe Driving:</span><strong>+${b.baseScore}</strong></div>
          <div class="score-row"><span>Station Stop Accuracy:</span><strong>+${b.stopScore}</strong></div>
          <div class="score-row"><span>Overspeed Deduction:</span><strong style="color: #ef4444;">-${b.overspeedPenalty}</strong></div>
          <div class="score-row"><span>Emergency Brake Penalty:</span><strong style="color: #ef4444;">-${b.emergencyBrakePenalty}</strong></div>
          <div class="score-row"><span>SPAD Signal Violations:</span><strong style="color: ${b.signalViolations > 0 ? '#ef4444' : '#22c55e'};">${b.signalViolations}</strong></div>
        `;
      }
  
      const nextBtn = document.getElementById('btnNextMission');
      if (nextBtn) {
        nextBtn.style.display = results.nextMissionId ? 'inline-flex' : 'none';
      }
  
      this.showScreen('screenComplete');
    }
  
    renderMissionsList() {
      const container = this.dom.missionsListGrid;
      if (!container) return;
  
      const missions = this.engine.missionSystem.getMissions();
  
      container.innerHTML = missions.map(m => {
        const isLocked = !m.isUnlocked;
        let starStr = '';
        for (let i = 1; i <= 3; i++) {
          starStr += i <= m.stars ? '★' : '☆';
        }
  
        return `
          <div class="mission-card ${isLocked ? 'locked' : ''} ${m.isCompleted ? 'completed' : ''}" 
               data-mission-id="${m.id}">
            <div class="mission-header-row">
              <span class="mission-number-pill">MISSION ${m.number}</span>
              <span class="mission-status-pill ${m.isCompleted ? 'comp' : (isLocked ? 'lock' : 'ready')}">
                ${m.isCompleted ? '✓ COMPLETED' : (isLocked ? '🔒 LOCKED' : '▶ READY')}
              </span>
            </div>
  
            <h3 class="mission-card-title">${m.title}</h3>
            <p class="mission-card-tagline">${m.tagline}</p>
  
            <div class="mission-meta-grid">
              <div><span class="meta-lbl">ROUTE:</span> <strong>${m.route}</strong></div>
              <div><span class="meta-lbl">DISTANCE:</span> <strong>${m.distanceFormatted}</strong></div>
              <div><span class="meta-lbl">SPEED LIMIT:</span> <strong>${m.speedLimitKmh} km/h</strong></div>
              <div><span class="meta-lbl">STATIONS:</span> <strong>${(m.stations || []).length} Stops</strong></div>
            </div>
  
            <div class="mission-footer-row">
              <div class="mission-stars">${m.isCompleted ? starStr : '☆☆☆'}</div>
              <button class="btn btn-select-mission" ${isLocked ? 'disabled' : ''} data-mission-id="${m.id}">
                ${isLocked ? '🔒 Locked' : (m.isCompleted ? 'Replay' : 'Drive')}
              </button>
            </div>
          </div>
        `;
      }).join('');
  
      container.querySelectorAll('.mission-card').forEach(card => {
        card.addEventListener('click', () => {
          const missionId = card.getAttribute('data-mission-id');
          const isLocked = card.classList.contains('locked');
          if (missionId && !isLocked) {
            this.engine.soundManager.playClick();
            this.engine.prepareMission(missionId);
          }
        });
      });
  
      container.querySelectorAll('.btn-select-mission').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const missionId = btn.getAttribute('data-mission-id');
          if (missionId) {
            this.engine.soundManager.playClick();
            this.engine.prepareMission(missionId);
          }
        });
      });
    }
  
    updateHUD(state, nextSignal, nextStation, missionConfig) {
      if (!state) return;
  
      const speed = Math.round(state.speedKmh);
      if (this.dom.hudSpeedVal) {
        this.dom.hudSpeedVal.textContent = speed;
      }
  
      if (this.dom.hudSpeedGaugeNeedle) {
        const ratio = Math.min(1.0, speed / 140);
        const angle = -120 + (ratio * 240);
        this.dom.hudSpeedGaugeNeedle.style.transform = `rotate(${angle}deg)`;
      }
  
      if (this.dom.hudSpeedLimitVal) {
        this.dom.hudSpeedLimitVal.textContent = state.speedLimitKmh;
      }
      if (this.dom.hudOverspeedBadge) {
        if (state.overspeedWarning) {
          this.dom.hudOverspeedBadge.classList.remove('hidden');
          this.dom.hudOverspeedBadge.textContent = '⚠ OVERSPEEDING';
        } else {
          this.dom.hudOverspeedBadge.classList.add('hidden');
        }
      }
  
      if (this.dom.hudThrottleLevel) {
        this.dom.hudThrottleLevel.textContent = `T: ${state.throttleLevel}/5`;
      }
      if (this.dom.hudThrottleFill) {
        this.dom.hudThrottleFill.style.width = `${(state.throttleLevel / 5) * 100}%`;
      }
  
      if (this.dom.hudBrakeLevel) {
        this.dom.hudBrakeLevel.textContent = `B: ${state.brakeLevel}/5`;
      }
      if (this.dom.hudBrakeFill) {
        this.dom.hudBrakeFill.style.width = `${(state.brakeLevel / 5) * 100}%`;
      }
  
      if (this.dom.hudEBrakeBadge) {
        this.dom.hudEBrakeBadge.style.display = state.emergencyBrake ? 'inline-block' : 'none';
      }
  
      if (nextSignal) {
        const colors = { GREEN: '🟢', YELLOW: '🟡', RED: '🔴' };
        if (this.dom.hudSignalIcon) this.dom.hudSignalIcon.textContent = colors[nextSignal.aspect] || '🟢';
        if (this.dom.hudSignalDist) this.dom.hudSignalDist.textContent = `${nextSignal.distanceMeters}m`;
        if (this.dom.hudSignalName) this.dom.hudSignalName.textContent = nextSignal.name;
      } else {
        if (this.dom.hudSignalIcon) this.dom.hudSignalIcon.textContent = '🟢';
        if (this.dom.hudSignalDist) this.dom.hudSignalDist.textContent = '--';
        if (this.dom.hudSignalName) this.dom.hudSignalName.textContent = 'Track Clear';
      }
  
      if (nextStation) {
        if (this.dom.hudStationName) this.dom.hudStationName.textContent = nextStation.name;
        if (this.dom.hudStationDist) this.dom.hudStationDist.textContent = `${nextStation.distanceMeters}m`;
      } else {
        if (this.dom.hudStationName) this.dom.hudStationName.textContent = 'Terminus Reached';
        if (this.dom.hudStationDist) this.dom.hudStationDist.textContent = '0m';
      }
  
      if (this.dom.hudDistanceDriven) {
        this.dom.hudDistanceDriven.textContent = `${state.positionKm} km`;
      }
  
      if (missionConfig) {
        if (this.dom.hudMissionName) this.dom.hudMissionName.textContent = missionConfig.title;
        if (this.dom.hudMissionObjective) this.dom.hudMissionObjective.textContent = missionConfig.objective;
      }
  
      if (this.dom.hudHeadlightsBadge) {
        this.dom.hudHeadlightsBadge.textContent = state.headlights ? '💡 LIGHTS ON' : '💡 LIGHTS OFF';
        this.dom.hudHeadlightsBadge.classList.toggle('active', state.headlights);
      }
      if (this.dom.hudCameraBadge) {
        this.dom.hudCameraBadge.textContent = this.engine.renderer.cameraMode === 'cab' ? '🎥 CAB VIEW' : '🎥 CHASE VIEW';
      }
    }
  
    showNotification(message, type = 'info', duration = 3000) {
      const banner = this.dom.hudAlertBanner;
      if (!banner) return;
  
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
      }
  
      banner.textContent = message;
      banner.className = `hud-alert-banner show ${type}`;
  
      this.notificationTimeout = setTimeout(() => {
        banner.classList.remove('show');
      }, duration);
    }
  }
  

  // --- Module: engine/GameEngine.js ---
  /**
   * Railway Commander - Master Game Engine
   * Orchestrates game state machine, main loop, physics integration,
   * signal checking, station stops, audio generation, and UI updates.
   */
  
  
  
  
  
  
  
  
  
  
  
  
  class GameEngine {
    constructor(canvas) {
      this.canvas = canvas;
      
      // Core Subsystems
      this.saveManager = new SaveManager();
      this.soundManager = new SoundManager(this.saveManager);
      this.physics = new TrainPhysics();
      this.trackManager = new TrackManager();
      this.signalSystem = new SignalSystem();
      this.stationSystem = new StationSystem();
      this.missionSystem = new MissionSystem(this.saveManager);
      this.renderer = new Renderer25D(canvas);
      this.uiManager = new UIManager(this);
      this.inputManager = new InputManager(this);
  
      // State Machine
      // 'MENU' | 'BRIEFING' | 'COUNTDOWN' | 'DRIVING' | 'PAUSED' | 'COMPLETE' | 'FAILED'
      this.state = 'MENU';
      this.currentMission = null;
      this.lastMissionResult = null;
  
      // Loop Timing
      this.lastTime = 0;
      this.isRunning = false;
      this.countdownTimer = 3;
      this.countdownInterval = null;
    }
  
    init() {
      this.renderer.resize();
      window.addEventListener('resize', () => this.renderer.resize());
  
      this.uiManager.init();
      this.inputManager.bindControls();
  
      // Start in Main Menu
      this.state = 'MENU';
      this.uiManager.showMainMenu();
  
      // Start Master Render Loop
      this.isRunning = true;
      this.lastTime = performance.now();
      requestAnimationFrame((t) => this.gameLoop(t));
    }
  
    /**
     * Main Simulation Loop
     */
    gameLoop(currentTime) {
      if (!this.isRunning) return;
  
      const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
      this.lastTime = currentTime;
  
      if (this.state === 'DRIVING') {
        this.updateDriving(dt);
      }
  
      // Always render canvas
      const trainState = this.physics.getState();
      this.renderer.render(
        trainState,
        this.trackManager,
        this.signalSystem,
        this.stationSystem,
        this.currentMission,
        dt
      );
  
      // Update HUD if in driving or countdown
      if (this.state === 'DRIVING' || this.state === 'COUNTDOWN' || this.state === 'PAUSED') {
        const nextSig = this.signalSystem.getNextSignal(this.physics.positionMeters);
        const nextSt = this.trackManager.getNextStation(this.physics.positionMeters);
        this.uiManager.updateHUD(trainState, nextSig, nextSt, this.currentMission);
      }
  
      requestAnimationFrame((t) => this.gameLoop(t));
    }
  
    /**
     * Physics, Signal, Station & Rule Updates
     */
    updateDriving(dt) {
      // 1. Dynamic Speed Limit Updates
      const curSpeedLimit = this.trackManager.getSpeedLimitAt(this.physics.positionMeters);
      this.physics.setSpeedLimit(curSpeedLimit);
  
      // 2. Train Physics Integration
      this.physics.update(dt);
  
      // 3. Audio Updates
      this.soundManager.updateEngineSound(this.physics.throttleLevel, this.physics.speedKmh);
      this.soundManager.updateWheelJoints(this.physics.positionMeters, this.physics.speedKmh);
  
      // 4. Overspeed Monitoring & Penalty
      if (this.physics.overspeedWarning) {
        this.missionSystem.recordOverspeed(dt);
        if (this.physics.overspeedTimer > 10.0) {
          this.failMission(`Safety Failure: Exceeded line speed limit of ${curSpeedLimit} km/h for more than 10 seconds!`);
          return;
        }
      }
  
      // 5. Signal System Checking
      const sigEvent = this.signalSystem.update(this.physics.positionMeters, this.physics.speedKmh, dt);
      if (sigEvent.failure) {
        this.failMission(sigEvent.failureReason);
        return;
      }
      if (sigEvent.warning) {
        this.uiManager.showNotification(sigEvent.warning, 'warning');
        this.soundManager.playWarningBeep();
      }
  
      // 6. Station Proximity & Accuracy Checking
      const stationEvent = this.stationSystem.update(
        this.physics.positionMeters,
        this.physics.speedKmh,
        this.physics.speedKmh < 0.2,
        dt
      );
  
      if (stationEvent) {
        if (stationEvent.type === 'APPROACHING_STATION' || stationEvent.type === 'PREPARE_TO_STOP') {
          this.uiManager.showNotification(stationEvent.message, 'info');
        } else if (stationEvent.type === 'ACCURATE_STOP') {
          this.uiManager.showNotification(stationEvent.message, 'success');
          this.soundManager.playStationChime();
        } else if (stationEvent.type === 'BOARDING_COMPLETE') {
          this.uiManager.showNotification(stationEvent.message, 'success');
          this.soundManager.playAirBrakeHiss(false);
        } else if (stationEvent.type === 'MISSED_STATION') {
          this.uiManager.showNotification(stationEvent.message, 'danger');
          this.soundManager.playWarningBeep();
          if (stationEvent.mandatory) {
            this.failMission(`Mission Rule Violation: You completely bypassed scheduled platform stop at ${stationEvent.stationName}!`);
            return;
          }
        }
      }
  
      // 7. Mission Destination / Completion Check
      const trackEnd = this.trackManager.totalDistanceMeters;
      if (this.physics.positionMeters >= trackEnd - 25) {
        // Must come to a safe stop at terminus
        if (this.physics.speedKmh < 1.0) {
          this.completeMission();
        } else {
          this.uiManager.showNotification('Approaching Terminus Buffer: Apply brakes to stop!', 'warning');
        }
      }
    }
  
    // --- Controls Handlers ---
  
    onThrottleUp() {
      this.soundManager.resume();
      if (this.physics.throttleUp()) {
        this.soundManager.playClick();
      }
    }
  
    onThrottleDown() {
      this.soundManager.resume();
      if (this.physics.throttleDown()) {
        this.soundManager.playClick();
      }
    }
  
    onBrakeUp() {
      this.soundManager.resume();
      if (this.physics.brakeUp()) {
        this.soundManager.playAirBrakeHiss(false);
      }
    }
  
    onBrakeDown() {
      this.soundManager.resume();
      if (this.physics.brakeDown()) {
        this.soundManager.playAirBrakeHiss(false);
      }
    }
  
    onEmergencyBrake() {
      this.soundManager.resume();
      this.physics.applyEmergencyBrake();
      this.missionSystem.recordEmergencyBrake();
      this.soundManager.playAirBrakeHiss(true);
      this.uiManager.showNotification('EMERGENCY BRAKE APPLIED!', 'danger');
    }
  
    onHorn(active) {
      this.physics.setHorn(active);
      this.soundManager.playHorn(active);
    }
  
    onToggleHeadlights() {
      const state = this.physics.toggleHeadlights();
      this.soundManager.playClick();
      this.uiManager.showNotification(state ? 'Headlights: ON' : 'Headlights: OFF', 'info', 1500);
    }
  
    onToggleCamera() {
      this.soundManager.playClick();
      const newMode = this.renderer.cameraMode === 'chase' ? 'cab' : 'chase';
      this.renderer.setCameraMode(newMode);
      this.uiManager.showNotification(`Camera View: ${newMode.toUpperCase()}`, 'info', 1500);
    }
  
    togglePause() {
      if (this.state === 'DRIVING') {
        this.state = 'PAUSED';
        this.soundManager.stopEngineSound();
        this.uiManager.showPause();
      } else if (this.state === 'PAUSED') {
        this.resumeGame();
      }
    }
  
    resumeGame() {
      if (this.state === 'PAUSED') {
        this.state = 'DRIVING';
        this.uiManager.showHUD();
      }
    }
  
    // --- Mission Progression & Flow ---
  
    prepareMission(missionId) {
      const mission = this.missionSystem.startMission(missionId);
      this.currentMission = mission;
  
      // Load Track & Systems
      this.trackManager.loadRoute(mission);
      this.signalSystem.loadSignals(mission.signals);
      this.stationSystem.loadStations(mission.stations);
      this.physics.reset(0, 0);
  
      this.state = 'BRIEFING';
      this.uiManager.showBriefing(mission);
    }
  
    beginJourneyCountdown() {
      this.state = 'COUNTDOWN';
      this.countdownTimer = 3;
      this.uiManager.showCountdown('3');
      this.soundManager.playClick();
  
      if (this.countdownInterval) clearInterval(this.countdownInterval);
  
      this.countdownInterval = setInterval(() => {
        this.countdownTimer--;
        if (this.countdownTimer === 2) {
          this.uiManager.showCountdown('2');
          this.soundManager.playClick();
        } else if (this.countdownTimer === 1) {
          this.uiManager.showCountdown('1');
          this.soundManager.playClick();
        } else if (this.countdownTimer === 0) {
          this.uiManager.showCountdown('GO!');
          this.soundManager.playStationChime();
        } else {
          clearInterval(this.countdownInterval);
          this.countdownInterval = null;
          this.startDriving();
        }
      }, 1000);
    }
  
    startDriving() {
      this.state = 'DRIVING';
      this.uiManager.showHUD();
      this.uiManager.showNotification('Route Clear. Increase Throttle to depart 🟢', 'success');
    }
  
    failMission(reason) {
      this.state = 'FAILED';
      this.soundManager.stopEngineSound();
      this.soundManager.playFailureSound();
      this.physics.applyEmergencyBrake();
      this.uiManager.showMissionFailed(reason);
    }
  
    completeMission() {
      this.state = 'COMPLETE';
      this.soundManager.stopEngineSound();
      this.soundManager.playVictoryFanfare();
  
      const results = this.missionSystem.evaluateResults(
        this.stationSystem.getCompletionSummary(),
        this.signalSystem.violations,
        this.physics.positionMeters
      );
  
      this.lastMissionResult = results;
      this.uiManager.showMissionComplete(results);
    }
  
    restartCurrentMission() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
      this.soundManager.stopEngineSound();
      if (this.currentMission) {
        this.prepareMission(this.currentMission.id);
      } else {
        this.prepareMission('mission-1');
      }
    }
  
    quitToMenu() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
      this.soundManager.stopEngineSound();
      this.physics.reset(0, 0);
      this.state = 'MENU';
      this.uiManager.showMainMenu();
    }
  }
  

  // --- Module: main.js ---
  /**
   * Railway Commander - Application Entry Point
   */
  
  
  
  window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
      console.error('Railway Commander: Canvas element #gameCanvas not found!');
      return;
    }
  
    const engine = new GameEngine(canvas);
    engine.init();
  
    // Expose engine instance for debugging & automated testing
    window.__railwayCommander = engine;
    console.log('Railway Commander initialized successfully.');
  });
  

})();
