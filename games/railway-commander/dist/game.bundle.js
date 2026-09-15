/** Railway Commander - Standalone Game Bundle (Indian Railways WAP-7 Edition) */
(function() {
  "use strict";

  // --- Module: src/engine/TrainPhysics.js ---
  /**
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
      this.throttlePercent = 0; // 0% to 100%
      this.throttleLevel = 0;   // 0, 1, 2, 3, 4, 5 (for backward compat)
      this.brakeLevel = 0;      // 0, 1, 2, 3, 4, 5
      this.reverser = 'F';      // 'F' (Forward) or 'R' (Reverse)
      this.pantographUp = true; // 25kV OHE contact
      this.enginePower = true;  // Traction inverters
      this.doorsOpen = false;   // Passenger doors
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
      this.throttlePercent = 0;
      this.throttleLevel = 0;
      this.brakeLevel = 0;
      this.reverser = 'F';
      this.pantographUp = true;
      this.enginePower = true;
      this.doorsOpen = false;
      this.emergencyBrake = false;
      this.speedKmh = initialSpeed;
      this.speedMs = (initialSpeed * 1000) / 3600;
      this.positionMeters = startPosition;
      this.accelerationMs2 = 0;
      this.overspeedTimer = 0;
      this.overspeedWarning = false;
    }
  
    setThrottlePercent(pct) {
      this.throttlePercent = Math.max(0, Math.min(100, Math.round(pct)));
      this.throttleLevel = Math.round((this.throttlePercent / 100) * 5);
      if (this.throttlePercent > 0) {
        if (this.emergencyBrake) this.emergencyBrake = false;
        if (this.doorsOpen) this.doorsOpen = false; // close doors when driving
      }
    }
  
    setThrottle(level) {
      this.throttleLevel = Math.max(0, Math.min(5, Math.round(level)));
      this.throttlePercent = Math.round((this.throttleLevel / 5) * 100);
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
      if (this.throttlePercent < 100) {
        this.setThrottlePercent(Math.min(100, this.throttlePercent + 10));
        return true;
      }
      return false;
    }
  
    throttleDown() {
      if (this.throttlePercent > 0) {
        this.setThrottlePercent(Math.max(0, this.throttlePercent - 10));
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
  
    setReverser(dir) {
      if (this.speedKmh > 2.0) return false; // Safety lockout while moving
      this.reverser = dir === 'R' ? 'R' : 'F';
      return true;
    }
  
    togglePantograph() {
      this.pantographUp = !this.pantographUp;
      return this.pantographUp;
    }
  
    toggleEnginePower() {
      this.enginePower = !this.enginePower;
      return this.enginePower;
    }
  
    toggleDoors() {
      if (this.speedKmh > 1.5) return false; // Cannot open doors while train is moving
      this.doorsOpen = !this.doorsOpen;
      if (this.doorsOpen) {
        this.throttlePercent = 0;
        this.throttleLevel = 0;
      }
      return true;
    }
  
    applyEmergencyBrake() {
      this.emergencyBrake = true;
      this.throttlePercent = 0;
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
      const canDrive = this.pantographUp && this.enginePower && !this.doorsOpen && !this.emergencyBrake;
      if (this.throttlePercent > 0 && canDrive) {
        const appliedPowerKw = this.maxPowerKw * (this.throttlePercent / 100);
  
        // F = P / v at speed; at low speeds use starting tractive effort limit
        const currentV = Math.max(2.5, Math.abs(this.speedMs));
        tractiveForce = (appliedPowerKw * 1000) / currentV;
  
        // Locomotive adhesion limit (WAP-7 rated at 460 kN starting tractive effort)
        const maxAdhesionForce = this.massKg * 0.26 * this.gravity;
        tractiveForce = Math.min(tractiveForce, maxAdhesionForce);
      }
  
      // 2. Calculate Resistances (Friction + Aerodynamic Drag)
      const rollResistance = this.massKg * this.cRoll * this.gravity;
      const aeroDrag = this.cAero * (this.speedMs * this.speedMs) * 1000;
      const totalResistance = rollResistance + aeroDrag;
  
      // 3. Calculate Braking Force
      let brakeForce = 0;
      if (this.emergencyBrake) {
        // High-friction emergency deceleration (~1.55 m/s^2)
        brakeForce = this.massKg * 1.55;
      } else if (this.doorsOpen) {
        // Station door holding brake
        brakeForce = this.massKg * 1.2;
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
      if (this.speedMs < 0.05 && (this.brakeLevel > 0 || this.emergencyBrake || this.doorsOpen || tractiveForce === 0)) {
        if (this.throttlePercent === 0) {
          this.speedMs = 0;
          this.accelerationMs2 = 0;
        }
      }
  
      const maxSpeedMs = (this.maxSpeedKmh * 1000) / 3600;
      if (this.speedMs > maxSpeedMs) {
        this.speedMs = maxSpeedMs;
      }
  
      // Forward direction in normal passenger runs
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
        throttlePercent: this.throttlePercent,
        brakeLevel: this.brakeLevel,
        reverser: this.reverser,
        pantographUp: this.pantographUp,
        enginePower: this.enginePower,
        doorsOpen: this.doorsOpen,
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
  

  // --- Module: src/engine/TrackManager.js ---
  /**
   * Railway Commander - Track & Route Manager
   * Generates and manages railway track geometry, curvature,
   * speed limit zones, stations, signals, and procedural scenery elements.
   */
  
  class TrackManager {
    constructor() {
      this.totalDistanceMeters = 5000;
      this.segments = []; // Curvature & elevation segments
      this.speedLimitZones = []; // [{ from, to, limitKmh }]
      this.trackSwitches = []; // [{ position, direction, name }]
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
  
      this.trackSwitches = routeConfig.trackSwitches || [
        { position: 720, direction: 'right', name: 'Points No. 12B' }
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
  
      // 4. Station Platform Crowds & Indian Railway Life (Coolies, passengers, chai stalls)
      for (const st of this.stations) {
        const platLength = st.platformLength || 160;
        const platStart = st.stopPosition - platLength * 0.72;
        const platEnd = st.stopPosition + platLength * 0.28;
        const platSideX = 1.95; // right side platform
  
        // Coolies in red kurtas carrying heavy metal trunk boxes on their heads
        for (let pz = platStart + 12; pz < platEnd - 8; pz += 26) {
          this.scenery.push({
            type: 'coolie',
            position: pz,
            side: 1,
            dist: platSideX + 1.25,
            trunkColor: (Math.floor(pz) % 2 === 0) ? '#b45309' : '#0284c7'
          });
        }
  
        // Commuters & Passengers walking along the platform with bags
        for (let pz = platStart + 6; pz < platEnd - 4; pz += 16) {
          this.scenery.push({
            type: 'passenger',
            position: pz,
            side: 1,
            dist: platSideX + 1.8 + ((Math.floor(pz) % 4) * 0.28),
            shirtColor: ['#f8fafc', '#0284c7', '#ea580c', '#eab308', '#ec4899'][Math.floor(pz) % 5]
          });
        }
  
        // Indian Railway Chai & Snack Stalls ("CHAI / SNACKS")
        this.scenery.push({
          type: 'tea_stall',
          position: platStart + 35,
          side: 1,
          dist: platSideX + 3.1
        });
        if (platEnd - platStart > 110) {
          this.scenery.push({
            type: 'tea_stall',
            position: platStart + 105,
            side: 1,
            dist: platSideX + 3.1
          });
        }
  
        // Station Luggage Trolleys & wheelbarrows
        this.scenery.push({
          type: 'trolley',
          position: platStart + 20,
          side: 1,
          dist: platSideX + 2.2
        });
        this.scenery.push({
          type: 'trolley',
          position: platStart + 80,
          side: 1,
          dist: platSideX + 2.2
        });
  
        // Parked Opposing Passenger Rake / Coaches on Left Track (as seen in screenshot)
        this.scenery.push({
          type: 'parked_train',
          position: platStart - 30,
          endPosition: platEnd + 30,
          side: -1,
          dist: 3.4
        });
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
  
    /**
     * Get upcoming track switch / turnout
     */
    getNextTrackSwitch(currentPosition, lookAheadMeters = 800) {
      for (const sw of this.trackSwitches) {
        if (sw.position > currentPosition && (sw.position - currentPosition) <= lookAheadMeters) {
          return {
            ...sw,
            distanceMeters: Math.round(sw.position - currentPosition)
          };
        }
      }
      return null;
    }
  }
  

  // --- Module: src/engine/SignalSystem.js ---
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
  

  // --- Module: src/engine/StationSystem.js ---
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
  

  // --- Module: src/engine/MissionSystem.js ---
  /**
   * Railway Commander - Mission & Progression System
   * Defines handcrafted missions, objective tracking, score calculations,
   * and unlock progression.
   */
  
  const MISSIONS_DATA = [
    {
      id: 'mission-1',
      number: 1,
      title: 'Arakkonam Express',
      tagline: 'WAP-7 Rajdhani run to Arakkonam Junction',
      objective: 'Operate the WAP-7 Rajdhani Express. Follow signals, observe speed limits, negotiate track switches, and stop accurately at Arakkonam Junction Platform 1.',
      route: 'Chennai Central → Arakkonam Junction',
      distanceMeters: 2200,
      distanceFormatted: '2.2 km',
      speedLimitKmh: 70,
      targetTime: '10:45 PM',
      initialClock: '22:15',
      environment: 'city',
      timeOfDay: 'sunset', // sunset dusk matching reference screenshot
      weather: 'clear',
      rewardXp: 500,
      rewardCoins: 250,
      speedLimitZones: [
        { from: 0, to: 950, limitKmh: 70 },
        { from: 950, to: 2200, limitKmh: 50 }
      ],
      trackSwitches: [
        { position: 720, direction: 'right', name: 'Points No. 12B (Track Change)' }
      ],
      stations: [
        { 
          id: 'st_arakkonam', 
          name: 'ARAKKONAM', 
          nativeTamil: 'அரக்கோணம்', 
          nativeHindi: 'अरक्कोणम', 
          stopPosition: 1950, 
          platformLength: 170, 
          mandatory: true 
        }
      ],
      signals: [
        { id: 'sig_1', name: 'Chennai Central Outbound', positionMeters: 550, aspect: 'GREEN' },
        { id: 'sig_2', name: 'Arakkonam Outer Home Signal', positionMeters: 1450, aspect: 'YELLOW' }
      ]
    },
    {
      id: 'mission-2',
      number: 2,
      title: 'Rajdhani Superfast',
      tagline: '130 KMPH high-speed trunk route corridor',
      objective: 'Accelerate the WAP-7 rake to 130 km/h along the trunk main line. Execute smooth braking for Kanpur Central arrival.',
      route: 'New Delhi → Aligarh → Kanpur Central',
      distanceMeters: 3800,
      distanceFormatted: '3.8 km',
      speedLimitKmh: 130,
      targetTime: '11:30 PM',
      initialClock: '23:05',
      environment: 'city',
      timeOfDay: 'night',
      weather: 'clear',
      rewardXp: 850,
      rewardCoins: 450,
      speedLimitZones: [
        { from: 0, to: 700, limitKmh: 80 },
        { from: 700, to: 2600, limitKmh: 130 },
        { from: 2600, to: 3800, limitKmh: 50 }
      ],
      trackSwitches: [
        { position: 1100, direction: 'right', name: 'Aligarh Crossover' }
      ],
      stations: [
        { id: 'st_kanpur', name: 'KANPUR CENTRAL', nativeHindi: 'कानपुर सेंट्रल', stopPosition: 3580, platformLength: 180, mandatory: true }
      ],
      signals: [
        { id: 'sig_1', name: 'Depot Exit Block', positionMeters: 600, aspect: 'GREEN' },
        { id: 'sig_2', name: 'Trunk Corridor Clear', positionMeters: 1600, aspect: 'GREEN' },
        { id: 'sig_3', name: 'Kanpur Yard Approach', positionMeters: 3100, aspect: 'YELLOW' }
      ]
    },
    {
      id: 'mission-3',
      number: 3,
      title: 'Monsoon Express',
      tagline: 'Heavy monsoon downpour, wipers & caution signals',
      objective: 'Navigate heavy tropical rain and slippery tracks. Use wipers, sound the horn at crossings, and obey caution signals.',
      route: 'Howrah Junction → Burdwan Junction',
      distanceMeters: 4500,
      distanceFormatted: '4.5 km',
      speedLimitKmh: 80,
      targetTime: '06:15 PM',
      initialClock: '17:50',
      environment: 'industrial',
      timeOfDay: 'sunset',
      weather: 'rain',
      rewardXp: 1200,
      rewardCoins: 650,
      speedLimitZones: [
        { from: 0, to: 1000, limitKmh: 70 },
        { from: 1000, to: 2900, limitKmh: 90 },
        { from: 2900, to: 4500, limitKmh: 45 }
      ],
      trackSwitches: [
        { position: 1400, direction: 'left', name: 'Bally Bridge Divergence' }
      ],
      stations: [
        { id: 'st_burdwan', name: 'BURDWAN JN', nativeBengali: 'বর্ধমান', stopPosition: 4280, platformLength: 170, mandatory: true }
      ],
      signals: [
        { id: 'sig_1', name: 'Howrah Crossover', positionMeters: 750, aspect: 'GREEN' },
        { id: 'sig_2', name: 'Burdwan Warning', positionMeters: 2200, aspect: 'YELLOW' },
        { id: 'sig_3', name: 'Interlocking Holding Signal', positionMeters: 3300, aspect: 'RED', clearDistance: 320, clearDelay: 1.5 },
        { id: 'sig_4', name: 'Burdwan Platform Approach', positionMeters: 3950, aspect: 'YELLOW' }
      ]
    },
    {
      id: 'mission-4',
      number: 4,
      title: 'Western Ghats Summit',
      tagline: 'Mountain gradients, mist & precision stopping',
      objective: 'Drive an express run through foggy Western Ghat grades. Deliver pinpoint accurate station stops under foggy conditions.',
      route: 'Mumbai CSMT → Karjat → Lonavala Summit',
      distanceMeters: 5600,
      distanceFormatted: '5.6 km',
      speedLimitKmh: 90,
      targetTime: '08:45 AM',
      initialClock: '08:15',
      environment: 'alpine',
      timeOfDay: 'day',
      weather: 'fog',
      rewardXp: 1800,
      rewardCoins: 1000,
      speedLimitZones: [
        { from: 0, to: 1200, limitKmh: 65 },
        { from: 1200, to: 3400, limitKmh: 90 },
        { from: 3400, to: 5600, limitKmh: 50 }
      ],
      trackSwitches: [
        { position: 1900, direction: 'right', name: 'Ghats Mountain Bypass' }
      ],
      stations: [
        { id: 'st_karjat', name: 'KARJAT', nativeMarathi: 'कर्जत', stopPosition: 2350, platformLength: 140, mandatory: true },
        { id: 'st_lonavala', name: 'LONAVALA SUMMIT', nativeMarathi: 'लोonavla', stopPosition: 5350, platformLength: 160, mandatory: true }
      ],
      signals: [
        { id: 'sig_1', name: 'Ghat Outbound', positionMeters: 800, aspect: 'GREEN' },
        { id: 'sig_2', name: 'Karjat Distant', positionMeters: 1950, aspect: 'YELLOW' },
        { id: 'sig_3', name: 'Tunnel Portal Signal', positionMeters: 3500, aspect: 'GREEN' },
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
  

  // --- Module: src/engine/SoundManager.js ---
  /**
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
     * Modulates WAP-7 3-phase electric traction motor whine & rumble with throttle and speed
     */
    updateEngineSound(throttleInput, speedKmh) {
      if (!this.soundEnabled) {
        this.stopEngineSound();
        return;
      }
      this.resume();
      if (!this.ctx) return;
  
      const throttlePercent = typeof throttleInput === 'number' && throttleInput > 5 ? throttleInput : (throttleInput || 0) * 20;
  
      if (!this.engineRunning) {
        try {
          const now = this.ctx.currentTime;
          this.engineGain = this.ctx.createGain();
          this.engineGain.gain.setValueAtTime(0.01, now);
          this.engineGain.gain.exponentialRampToValueAtTime(0.22, now + 0.3);
  
          this.engineFilter = this.ctx.createBiquadFilter();
          this.engineFilter.type = 'lowpass';
          this.engineFilter.frequency.setValueAtTime(300, now);
  
          // Low rumble oscillator (blower / transformer hum)
          this.engineOsc1 = this.ctx.createOscillator();
          this.engineOsc1.type = 'sawtooth';
          this.engineOsc1.frequency.setValueAtTime(50, now); // 50 Hz mains traction hum
  
          // Sub-harmonic traction hum
          this.engineOsc2 = this.ctx.createOscillator();
          this.engineOsc2.type = 'triangle';
          this.engineOsc2.frequency.setValueAtTime(100, now);
  
          // High-frequency 3-phase electric traction motor whine (IGBT inverter)
          this.engineOsc3 = this.ctx.createOscillator();
          this.engineOsc3.type = 'sine';
          this.engineOsc3.frequency.setValueAtTime(450, now);
  
          this.engineOsc1.connect(this.engineFilter);
          this.engineOsc2.connect(this.engineFilter);
          this.engineOsc3.connect(this.engineFilter);
          this.engineFilter.connect(this.engineGain);
          this.engineGain.connect(this.masterGain);
  
          this.engineOsc1.start();
          this.engineOsc2.start();
          this.engineOsc3.start();
          this.engineRunning = true;
        } catch (e) {
          return;
        }
      }
  
      if (this.engineRunning && this.engineOsc1 && this.engineFilter && this.engineGain) {
        const now = this.ctx.currentTime;
        const speedRatio = Math.min(1.0, speedKmh / 140);
        const throttleRatio = throttlePercent / 100;
  
        // Transformer hum scales slightly (50 Hz to 90 Hz)
        const humFreq = 50 + (throttleRatio * 35) + (speedRatio * 15);
        // IGBT Traction motor whine climbs high with speed (350 Hz idle -> 1400 Hz at high speed)
        const inverterFreq = 380 + (throttleRatio * 320) + (speedRatio * 750);
        const filterCutoff = 350 + (throttleRatio * 450) + (speedRatio * 650);
        const volume = 0.12 + (throttleRatio * 0.16) + (speedRatio * 0.10);
  
        this.engineOsc1.frequency.setTargetAtTime(humFreq, now, 0.15);
        this.engineOsc2.frequency.setTargetAtTime(humFreq * 2, now, 0.15);
        if (this.engineOsc3) {
          this.engineOsc3.frequency.setTargetAtTime(inverterFreq, now, 0.15);
        }
        this.engineFilter.frequency.setTargetAtTime(filterCutoff, now, 0.15);
        this.engineGain.gain.setTargetAtTime(volume, now, 0.15);
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
            if (this.engineOsc3) { this.engineOsc3.stop(); this.engineOsc3.disconnect(); this.engineOsc3 = null; }
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
        const vol = Math.min(0.24, 0.06 + (speedKmh / 140) * 0.18);
  
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
     * Authentic Indian Railways RDSO Twin-Tone Electric Locomotive Air Horn (WAP-7)
     */
    playHorn(active = true) {
      if (!active) {
        if (this.hornGain && this.ctx) {
          const now = this.ctx.currentTime;
          this.hornGain.gain.setTargetAtTime(0.001, now, 0.12);
          setTimeout(() => {
            if (this.hornOsc1) { this.hornOsc1.stop(); this.hornOsc1.disconnect(); this.hornOsc1 = null; }
            if (this.hornOsc2) { this.hornOsc2.stop(); this.hornOsc2.disconnect(); this.hornOsc2 = null; }
            if (this.hornOsc3) { this.hornOsc3.stop(); this.hornOsc3.disconnect(); this.hornOsc3 = null; }
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
        this.hornGain.gain.exponentialRampToValueAtTime(0.42, now + 0.05);
  
        // Indian Railways dual air-horn tuning:
        // High chime: 494 Hz (B4) + 370 Hz (F#4) + 554 Hz (C#5)
        this.hornOsc1 = this.ctx.createOscillator();
        this.hornOsc1.type = 'sawtooth';
        this.hornOsc1.frequency.setValueAtTime(370.00, now); // F#4
  
        this.hornOsc2 = this.ctx.createOscillator();
        this.hornOsc2.type = 'sawtooth';
        this.hornOsc2.frequency.setValueAtTime(493.88, now); // B4
  
        this.hornOsc3 = this.ctx.createOscillator();
        this.hornOsc3.type = 'sawtooth';
        this.hornOsc3.frequency.setValueAtTime(554.37, now); // C#5
  
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, now);
  
        this.hornOsc1.connect(filter);
        this.hornOsc2.connect(filter);
        this.hornOsc3.connect(filter);
        filter.connect(this.hornGain);
        this.hornGain.connect(this.masterGain);
  
        this.hornOsc1.start(now);
        this.hornOsc2.start(now);
        this.hornOsc3.start(now);
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
        const duration = isEmergency ? 1.5 : 0.65;
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
        gain.gain.setValueAtTime(isEmergency ? 0.38 : 0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
  
        noise.start(now);
        noise.stop(now + duration);
      } catch (e) {}
    }
  
    /**
     * Authentic Indian Railways Iconic 4-Note Station Announcement Chime
     * Notes: C5 (523.25 Hz) -> G4 (392.00 Hz) -> G#4 (415.30 Hz) -> C5 (523.25 Hz)
     */
    playStationChime() {
      this.resume();
      if (!this.ctx || !this.soundEnabled) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [523.25, 392.00, 415.30, 523.25];
        const durations = [0.28, 0.28, 0.28, 0.45];
  
        let t = now;
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
  
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
  
          gain.gain.setValueAtTime(0.3, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + durations[idx] + 0.35);
  
          osc.connect(gain);
          gain.connect(this.masterGain);
  
          osc.start(t);
          osc.stop(t + durations[idx] + 0.4);
          t += durations[idx];
        });
      } catch (e) {}
    }
  
    /**
     * Passenger Doors Open/Close Sound with Warning Beeps & Pneumatic Piston
     */
    playDoorSound(isOpen) {
      this.resume();
      if (!this.ctx || !this.soundEnabled) return;
      try {
        const now = this.ctx.currentTime;
        // 2 warning beeps
        [0, 0.22].forEach(offset => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(isOpen ? 880 : 660, now + offset);
          gain.gain.setValueAtTime(0.2, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(now + offset);
          osc.stop(now + offset + 0.13);
        });
        // Pneumatic door hiss
        this.playAirBrakeHiss(false);
      } catch (e) {}
    }
  
    /**
     * Pantograph Raise/Lower Contact Spark Crackle
     */
    playPantographSpark() {
      this.resume();
      if (!this.ctx || !this.soundEnabled) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.26);
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
  

  // --- Module: src/engine/Renderer25D.js ---
  /**
   * Railway Commander - 2.5D Indian Railways Simulator Renderer
   * Features:
   * - Authentic Indian Railways WAP-7 Electric Locomotive in Rajdhani Express livery
   * - Red & cream LHB Rajdhani passenger coaches with lit passenger windows
   * - 3 Dynamic Camera Modes:
   *     1. 'platform' (Cinematic station platform view alongside passengers & coolies)
   *     2. 'cab' (Inside the WAP-7 cockpit with windshield & wipers)
   *     3. 'chase' (Elevated third-person follow cam)
   * - Station platforms (e.g. Arakkonam Junction) with tiled floors, red coping borders,
   *   yellow safety lines, blue corrugated canopy roof trusses, Indian Railways station boards (Tamil/English/Hindi)
   * - Animated platform life: Indian railway coolies in red kurtas carrying trunks on heads,
   *   walking passengers, luggage trolleys, and traditional "CHAI & SNACKS" stalls
   * - 25kV AC OHE overhead electrification catenary wires and steel portal gantries
   * - Double-track railway corridor with parked/opposing rakes on parallel track
   * - 4-aspect Indian railway color light signals and dynamic headlight bloom
   */
  
  class Renderer25D {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: false });
  
      // Camera Mode: 'platform' (cinematic station view), 'cab' (cockpit windshield), or 'chase' (elevated)
      this.cameraMode = 'platform';
  
      // Rain Particle Pool
      this.rainDrops = [];
      this.maxRainDrops = 160;
      this.initRain();
  
      // Wiper Animation State
      this.wiperAngle = 0;
      this.wiperDirection = 1;
  
      // Headlight & Spark Animation
      this.sparkTimer = 0;
      this.sparkActive = false;
      this.animTime = 0;
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
      if (mode === 'cab' || mode === 'chase' || mode === 'platform') {
        this.cameraMode = mode;
      } else {
        this.cameraMode = 'platform';
      }
    }
  
    cycleCameraMode() {
      if (this.cameraMode === 'platform') {
        this.setCameraMode('cab');
      } else if (this.cameraMode === 'cab') {
        this.setCameraMode('chase');
      } else {
        this.setCameraMode('platform');
      }
      return this.cameraMode;
    }
  
    getCameraModeLabel() {
      if (this.cameraMode === 'platform') return '🎥 PLATFORM VIEW';
      if (this.cameraMode === 'cab') return '🎥 CAB VIEW';
      return '🎥 CHASE VIEW';
    }
  
    /**
     * Main Render Frame
     */
    render(state, trackManager, signalSystem, stationSystem, missionConfig, dt = 0.016) {
      if (!this.width || !this.height) {
        this.resize();
      }
  
      this.animTime += dt;
  
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
  
      const timeOfDay = missionConfig?.timeOfDay || 'sunset';
      const weather = missionConfig?.weather || 'clear';
      const trainPos = state.positionMeters;
      const speedKmh = state.speedKmh;
  
      // Camera Configuration based on Active View Mode
      let cameraX = 0;
      let cameraHeight = 3.6;
      let cameraZ = trainPos - 7.5;
      let horizonY = h * 0.42;
      const focalLength = w * 0.78;
  
      if (this.cameraMode === 'platform') {
        // Cinematic platform view matching user's screenshot
        cameraX = 2.4; // positioned on right platform
        cameraHeight = 1.85; // standing human eye level on platform
        cameraZ = trainPos - 6.2; // alongside and slightly ahead of the loco nose
        horizonY = h * 0.42;
      } else if (this.cameraMode === 'cab') {
        // Driver windscreen view
        cameraX = 0.0;
        cameraHeight = 2.45;
        cameraZ = trainPos + 0.8;
        horizonY = h * 0.44;
      } else {
        // Chase follow cam
        cameraX = 0.0;
        cameraHeight = 4.8;
        cameraZ = trainPos - 9.5;
        horizonY = h * 0.39;
      }
  
      // 1. Draw Sky & Landscape
      this.drawSkyAndLandscape(ctx, w, h, horizonY, timeOfDay, weather, trainPos);
  
      // Track Geometry & Curvature
      const trackHalfGauge = 0.84; // broad gauge half-width (~1676mm Indian Broad Gauge)
      const baseCurvature = trackManager.getCurvatureAt(trainPos);
  
      // 3D Perspective Projection Function
      const project = (x, y, z) => {
        const relZ = z - cameraZ;
        if (relZ <= 0.2) return null;
        const scale = focalLength / relZ;
        const distFromCam = relZ;
        const curveOffset = baseCurvature * (distFromCam * distFromCam) * 0.15;
        const screenX = (w * 0.5) + (x - cameraX + curveOffset) * scale;
        const screenY = horizonY + (cameraHeight - y) * scale;
        return { x: screenX, y: screenY, scale, relZ };
      };
  
      // 2. Draw Ground & Ballast Beds (Double Track)
      this.drawGroundAndBallast(ctx, w, h, horizonY, project, cameraZ, timeOfDay);
  
      // 3. Draw Railroad Sleepers (Ties)
      this.drawRailTies(ctx, project, cameraZ, timeOfDay);
  
      // 4. Draw Steel Rails (Active Track + Left Parallel Track)
      this.drawSteelRails(ctx, project, cameraZ, trackHalfGauge, state.headlights, timeOfDay);
  
      // 5. Draw 25kV OHE Catenary Electric Wires
      this.drawOverheadCatenary(ctx, project, cameraZ, timeOfDay);
  
      // 6. Draw Stations, Platforms, Canopies & Boards
      this.drawStations(ctx, project, cameraZ, stationSystem, trackHalfGauge, timeOfDay);
  
      // 7. Draw Scenery (Coolies, passengers, tea stalls, catenary masts, buildings)
      this.drawScenery(ctx, project, cameraZ, trackManager, timeOfDay);
  
      // 8. Draw Railway Color Light Signals
      this.drawSignals(ctx, project, cameraZ, signalSystem, timeOfDay);
  
      // 9. Draw Headlight Projection Beams
      if (state.headlights) {
        this.drawHeadlightBeams(ctx, w, h, horizonY, this.cameraMode === 'cab', cameraX);
      }
  
      // 10. Draw 3D WAP-7 Rajdhani Train & Coaches (if not inside Cab View)
      if (this.cameraMode !== 'cab') {
        this.drawIndianTrain(ctx, project, cameraZ, trainPos, state, timeOfDay, dt);
      }
  
      // 11. Draw WAP-7 Driver Cockpit Frame (if Cab View Mode)
      if (this.cameraMode === 'cab') {
        this.drawCabCockpit(ctx, w, h, state, dt, weather);
      }
  
      // 12. Draw Weather Overlay (Rain / Fog)
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
        // Dusk / sunset as in reference screenshot
        skyGrad.addColorStop(0, '#0c1e3d'); // Deep twilight navy
        skyGrad.addColorStop(0.35, '#1e3a5f'); // Indigo
        skyGrad.addColorStop(0.7, '#2563eb'); // Indian Railway blue haze
        skyGrad.addColorStop(1.0, '#38bdf8'); // Horizon glow
      } else if (timeOfDay === 'night') {
        skyGrad.addColorStop(0, '#020617');
        skyGrad.addColorStop(0.6, '#090d1f');
        skyGrad.addColorStop(1.0, '#131b38');
      } else {
        // Daytime
        skyGrad.addColorStop(0, '#0284c7');
        skyGrad.addColorStop(0.5, '#38bdf8');
        skyGrad.addColorStop(1.0, '#bae6fd');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizonY + 2);
  
      // Moon / Evening Star
      if (timeOfDay === 'sunset' || timeOfDay === 'night') {
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = 'rgba(254, 240, 138, 0.6)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(w * 0.78, horizonY * 0.28, timeOfDay === 'night' ? 22 : 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
  
      // Distant City Skyline / Station Sheds (Parallax)
      const skylineScroll = (trainPos * 0.08) % (w * 0.4);
      ctx.fillStyle = timeOfDay === 'night' ? '#080d1e' : (timeOfDay === 'sunset' ? '#111827' : '#1e3a8a');
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      for (let x = -skylineScroll; x <= w + 120; x += 90) {
        const bH = 25 + Math.sin(x * 0.03) * 18 + (x % 30);
        ctx.lineTo(x, horizonY - bH);
        ctx.lineTo(x + 55, horizonY - bH);
        ctx.lineTo(x + 55, horizonY);
      }
      ctx.closePath();
      ctx.fill();
    }
  
    drawGroundAndBallast(ctx, w, h, horizonY, project, cameraZ, timeOfDay) {
      // Natural Ground (Dark earth / station apron)
      let groundGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      if (timeOfDay === 'night' || timeOfDay === 'sunset') {
        groundGrad.addColorStop(0, '#090d16');
        groundGrad.addColorStop(1.0, '#0f172a');
      } else {
        groundGrad.addColorStop(0, '#14532d');
        groundGrad.addColorStop(1.0, '#166534');
      }
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizonY, w, h - horizonY);
  
      const farZ = cameraZ + 380;
      const nearZ = cameraZ + 1.2;
  
      // 1. Main Track Gravel Ballast Bed (Active Track x = -2.2 to +2.2)
      const pFarL = project(-2.2, 0, farZ);
      const pFarR = project(2.2, 0, farZ);
      const pNearL = project(-2.8, 0, nearZ);
      const pNearR = project(2.8, 0, nearZ);
  
      if (pFarL && pFarR && pNearL && pNearR) {
        ctx.fillStyle = timeOfDay === 'night' ? '#1c1917' : '#292524'; // dark crushed granite ballast
        ctx.beginPath();
        ctx.moveTo(pFarL.x, pFarL.y);
        ctx.lineTo(pFarR.x, pFarR.y);
        ctx.lineTo(pNearR.x, pNearR.y);
        ctx.lineTo(pNearL.x, pNearL.y);
        ctx.closePath();
        ctx.fill();
      }
  
      // 2. Parallel Left Track Gravel Ballast Bed (x = -5.4 to -2.3)
      const pLeftFarL = project(-5.4, 0, farZ);
      const pLeftFarR = project(-2.3, 0, farZ);
      const pLeftNearL = project(-6.0, 0, nearZ);
      const pLeftNearR = project(-2.9, 0, nearZ);
  
      if (pLeftFarL && pLeftFarR && pLeftNearL && pLeftNearR) {
        ctx.fillStyle = timeOfDay === 'night' ? '#171717' : '#262626';
        ctx.beginPath();
        ctx.moveTo(pLeftFarL.x, pLeftFarL.y);
        ctx.lineTo(pLeftFarR.x, pLeftFarR.y);
        ctx.lineTo(pLeftNearR.x, pLeftNearR.y);
        ctx.lineTo(pLeftNearL.x, pLeftNearL.y);
        ctx.closePath();
        ctx.fill();
      }
    }
  
    drawRailTies(ctx, project, cameraZ, timeOfDay) {
      const tieSpacing = 0.85; // Indian Railways sleeper spacing
      const tieWidth = 1.35;   // half width for broad gauge concrete sleeper
      const startZ = Math.floor(cameraZ / tieSpacing) * tieSpacing;
      const endZ = cameraZ + 160;
  
      ctx.fillStyle = timeOfDay === 'night' ? '#27272a' : '#52525b'; // PSC concrete sleepers
  
      for (let z = endZ; z >= startZ; z -= tieSpacing) {
        if (z <= cameraZ + 0.5) continue;
  
        // Active Track Sleeper
        const pL = project(-tieWidth, 0.05, z);
        const pR = project(tieWidth, 0.05, z);
        if (pL && pR) {
          const thickness = Math.max(1.2, 3.8 * pL.scale);
          ctx.fillRect(pL.x, pL.y - thickness, pR.x - pL.x, thickness);
        }
  
        // Parallel Left Track Sleeper
        const pLeftL = project(-3.6 - tieWidth, 0.05, z);
        const pLeftR = project(-3.6 + tieWidth, 0.05, z);
        if (pLeftL && pLeftR) {
          const thickness = Math.max(1.0, 3.2 * pLeftL.scale);
          ctx.fillRect(pLeftL.x, pLeftL.y - thickness, pLeftR.x - pLeftL.x, thickness);
        }
      }
    }
  
    drawSteelRails(ctx, project, cameraZ, trackHalfGauge, headlightsOn, timeOfDay) {
      const steps = 40;
      const maxViewZ = 340;
      const stepSize = maxViewZ / steps;
  
      // Active Track Rails
      const leftRail = [];
      const rightRail = [];
      // Left Parallel Track Rails
      const leftTrkL = [];
      const leftTrkR = [];
  
      for (let i = 0; i <= steps; i++) {
        const z = cameraZ + 0.8 + (i * stepSize);
  
        const pL = project(-trackHalfGauge, 0.16, z);
        const pR = project(trackHalfGauge, 0.16, z);
        if (pL && pR) {
          leftRail.push(pL);
          rightRail.push(pR);
        }
  
        const pLL = project(-3.6 - trackHalfGauge, 0.16, z);
        const pLR = project(-3.6 + trackHalfGauge, 0.16, z);
        if (pLL && pLR) {
          leftTrkL.push(pLL);
          leftTrkR.push(pLR);
        }
      }
  
      // Render Shiny Steel Rails
      const drawRail = (pts, width, color) => {
        if (pts.length < 2) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
      };
  
      // Active track base and shiny chrome head
      drawRail(leftRail, 4, '#090d16');
      drawRail(rightRail, 4, '#090d16');
      drawRail(leftRail, 2.4, '#e2e8f0');
      drawRail(rightRail, 2.4, '#e2e8f0');
      drawRail(leftRail, 1.2, '#ffffff');
      drawRail(rightRail, 1.2, '#ffffff');
  
      // Parallel track rails
      drawRail(leftTrkL, 3, '#090d16');
      drawRail(leftTrkR, 3, '#090d16');
      drawRail(leftTrkL, 2, '#94a3b8');
      drawRail(leftTrkR, 2, '#94a3b8');
    }
  
    drawOverheadCatenary(ctx, project, cameraZ, timeOfDay) {
      // 25kV OHE Catenary Wire & Contact Wire
      const steps = 30;
      const stepSize = 10;
      const catenaryWire = [];
      const contactWire = [];
  
      for (let i = 0; i <= steps; i++) {
        const z = cameraZ + 0.8 + (i * stepSize);
        // Droop sag between masts
        const sag = Math.sin((z % 65) / 65 * Math.PI) * 0.18;
        const pTop = project(0, 5.8 - sag, z);
        const pContact = project(0, 5.2, z);
  
        if (pTop && pContact) {
          catenaryWire.push(pTop);
          contactWire.push(pContact);
        }
      }
  
      const drawWire = (pts, col, lw) => {
        if (pts.length < 2) return;
        ctx.strokeStyle = col;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
      };
  
      drawWire(catenaryWire, 'rgba(148, 163, 184, 0.4)', 1.2);
      drawWire(contactWire, 'rgba(253, 224, 71, 0.65)', 1.5); // copper contact wire
    }
  
    drawStations(ctx, project, cameraZ, stationSystem, trackHalfGauge, timeOfDay) {
      const stations = stationSystem.stations || [];
  
      for (const st of stations) {
        const dist = st.stopPosition - cameraZ;
        if (dist < -120 || dist > 450) continue;
  
        const platLength = st.platformLength || 160;
        const platStart = st.stopPosition - platLength * 0.72;
        const platEnd = st.stopPosition + platLength * 0.28;
        const platSideX = trackHalfGauge + 1.1; // 1.94m from center
        const platWidth = 5.2;
        const platHeight = 0.95; // high-level Indian Railway passenger platform
  
        // 1. Platform Deck Surface (Tiled stone)
        const pNearFront = project(platSideX, platHeight, Math.max(cameraZ + 0.8, platStart));
        const pNearBack = project(platSideX + platWidth, platHeight, Math.max(cameraZ + 0.8, platStart));
        const pFarFront = project(platSideX, platHeight, platEnd);
        const pFarBack = project(platSideX + platWidth, platHeight, platEnd);
  
        if (pNearFront && pNearBack && pFarFront && pFarBack) {
          // Platform Deck Stone Surface
          const platGrad = ctx.createLinearGradient(pNearFront.x, 0, pNearBack.x, 0);
          platGrad.addColorStop(0, '#cbd5e1'); // Stone grey tiles
          platGrad.addColorStop(0.3, '#94a3b8');
          platGrad.addColorStop(1.0, '#64748b');
  
          ctx.fillStyle = platGrad;
          ctx.beginPath();
          ctx.moveTo(pNearFront.x, pNearFront.y);
          ctx.lineTo(pNearBack.x, pNearBack.y);
          ctx.lineTo(pFarBack.x, pFarBack.y);
          ctx.lineTo(pFarFront.x, pFarFront.y);
          ctx.closePath();
          ctx.fill();
  
          // Platform Vertical Concrete Wall Facing Track
          const pNearBase = project(platSideX, 0, Math.max(cameraZ + 0.8, platStart));
          const pFarBase = project(platSideX, 0, platEnd);
          if (pNearBase && pFarBase) {
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.moveTo(pNearFront.x, pNearFront.y);
            ctx.lineTo(pFarFront.x, pFarFront.y);
            ctx.lineTo(pFarBase.x, pFarBase.y);
            ctx.lineTo(pNearBase.x, pNearBase.y);
            ctx.closePath();
            ctx.fill();
          }
  
          // Red Coping Stone Edge along Platform Edge (classic Indian Railway platform)
          const pNearRedBack = project(platSideX + 0.35, platHeight, Math.max(cameraZ + 0.8, platStart));
          const pFarRedBack = project(platSideX + 0.35, platHeight, platEnd);
          if (pNearRedBack && pFarRedBack) {
            ctx.fillStyle = '#b91c1c'; // Indian Red platform curb edge
            ctx.beginPath();
            ctx.moveTo(pNearFront.x, pNearFront.y);
            ctx.lineTo(pNearRedBack.x, pNearRedBack.y);
            ctx.lineTo(pFarRedBack.x, pFarRedBack.y);
            ctx.lineTo(pFarFront.x, pFarFront.y);
            ctx.closePath();
            ctx.fill();
          }
  
          // Yellow Platform Safety Line
          const pNearYellow = project(platSideX + 0.65, platHeight, Math.max(cameraZ + 0.8, platStart));
          const pFarYellow = project(platSideX + 0.65, platHeight, platEnd);
          if (pNearYellow && pFarYellow) {
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = Math.max(2, 4.5 * pNearYellow.scale);
            ctx.beginPath();
            ctx.moveTo(pNearYellow.x, pNearYellow.y);
            ctx.lineTo(pFarYellow.x, pFarYellow.y);
            ctx.stroke();
          }
  
          // Platform Corrugated Blue Canopy Roof Shed (as seen in screenshot)
          for (let postZ = platStart + 15; postZ < platEnd; postZ += 28) {
            if (postZ < cameraZ + 0.8) continue;
            const pPostBase = project(platSideX + 2.8, platHeight, postZ);
            const pPostTop = project(platSideX + 2.8, platHeight + 4.2, postZ);
            const pCanopyLeft = project(platSideX - 0.6, platHeight + 4.8, postZ);
            const pCanopyRight = project(platSideX + 5.0, platHeight + 4.4, postZ);
  
            if (pPostBase && pPostTop && pCanopyLeft && pCanopyRight) {
              // Steel Support Column
              ctx.strokeStyle = '#1e3a8a';
              ctx.lineWidth = Math.max(2.5, 6 * pPostBase.scale);
              ctx.beginPath();
              ctx.moveTo(pPostBase.x, pPostBase.y);
              ctx.lineTo(pPostTop.x, pPostTop.y);
              ctx.stroke();
  
              // Roof Triangular Steel Truss Girder
              ctx.strokeStyle = '#2563eb';
              ctx.lineWidth = Math.max(2, 4 * pPostBase.scale);
              ctx.beginPath();
              ctx.moveTo(pCanopyLeft.x, pCanopyLeft.y);
              ctx.lineTo(pPostTop.x, pPostTop.y);
              ctx.lineTo(pCanopyRight.x, pCanopyRight.y);
              ctx.stroke();
  
              // Corrugated Blue Metal Roof Sheet
              ctx.fillStyle = '#1d4ed8';
              ctx.fillRect(pCanopyLeft.x, pCanopyLeft.y - (4 * pPostBase.scale), Math.abs(pCanopyRight.x - pCanopyLeft.x), 5 * pPostBase.scale);
            }
          }
        }
  
        // 2. Indian Railways Yellow Enamel Station Board Signpost
        const pSignBase = project(platSideX + 2.8, platHeight, st.stopPosition - 18);
        const pSignTop = project(platSideX + 2.8, platHeight + 3.2, st.stopPosition - 18);
        if (pSignBase && pSignTop && pSignBase.scale > 0.002) {
          const signW = 140 * pSignBase.scale;
          const signH = 50 * pSignBase.scale;
  
          // Signpost Legs
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = Math.max(2, 4 * pSignBase.scale);
          ctx.beginPath();
          ctx.moveTo(pSignTop.x - signW * 0.35, pSignBase.y);
          ctx.lineTo(pSignTop.x - signW * 0.35, pSignTop.y);
          ctx.moveTo(pSignTop.x + signW * 0.35, pSignBase.y);
          ctx.lineTo(pSignTop.x + signW * 0.35, pSignTop.y);
          ctx.stroke();
  
          // Yellow Enamel Board
          ctx.fillStyle = '#facc15'; // Authentic Indian Railway yellow
          ctx.fillRect(pSignTop.x - signW * 0.5, pSignTop.y - signH * 0.5, signW, signH);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = Math.max(1.5, 3 * pSignBase.scale);
          ctx.strokeRect(pSignTop.x - signW * 0.5, pSignTop.y - signH * 0.5, signW, signH);
  
          // Station Names (Tamil / English / Hindi)
          if (signH > 18) {
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.font = `bold ${Math.max(8, Math.round(11 * pSignBase.scale * 10))}px Inter, sans-serif`;
            ctx.fillText(st.name || 'ARAKKONAM', pSignTop.x, pSignTop.y + 2);
  
            if (st.nativeTamil && signH > 28) {
              ctx.font = `bold ${Math.max(7, Math.round(8 * pSignBase.scale * 10))}px sans-serif`;
              ctx.fillText(st.nativeTamil, pSignTop.x, pSignTop.y - signH * 0.24);
            }
            if (st.nativeHindi && signH > 28) {
              ctx.font = `bold ${Math.max(7, Math.round(8 * pSignBase.scale * 10))}px sans-serif`;
              ctx.fillText(st.nativeHindi, pSignTop.x, pSignTop.y + signH * 0.32);
            }
            ctx.textAlign = 'left';
          }
        }
  
        // 3. STOP TARGET ZONE MARKER on Track & Platform
        const stopZ = st.stopPosition;
        if (stopZ > cameraZ + 0.5 && stopZ < cameraZ + 350) {
          const pStopL = project(-trackHalfGauge * 1.3, 0.08, stopZ);
          const pStopR = project(trackHalfGauge * 1.3, 0.08, stopZ);
          const pPlatStop = project(platSideX + 1.2, platHeight + 0.05, stopZ);
  
          if (pStopL && pStopR) {
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = Math.max(3, 7 * pStopL.scale);
            ctx.beginPath();
            ctx.moveTo(pStopL.x, pStopL.y);
            ctx.lineTo(pStopR.x, pStopR.y);
            ctx.stroke();
  
            if (pPlatStop && pPlatStop.scale > 0.003) {
              ctx.font = 'bold 12px Inter, sans-serif';
              ctx.fillStyle = '#ef4444';
              ctx.fillText('🛑 STOP TARGET', pPlatStop.x, pPlatStop.y);
            }
          }
        }
      }
    }
  
    drawScenery(ctx, project, cameraZ, trackManager, timeOfDay) {
      const scenery = trackManager.scenery || [];
  
      for (const item of scenery) {
        const relZ = item.position - cameraZ;
        if (relZ < 1 || relZ > 420) continue;
  
        // 1. Coolies (Porters in red kurtas carrying trunks on head)
        if (item.type === 'coolie') {
          const p = project(item.dist, 0.95, item.position);
          if (p && p.scale > 0.002) {
            const sc = p.scale * 14;
            const coolieH = 34 * sc;
            const coolieW = 14 * sc;
  
            // Red Kurta Body
            ctx.fillStyle = '#dc2626'; // Vibrant red
            ctx.fillRect(p.x - coolieW * 0.4, p.y - coolieH * 0.72, coolieW * 0.8, coolieH * 0.45);
  
            // Head with turban
            ctx.fillStyle = '#d97706'; // turban
            ctx.beginPath();
            ctx.arc(p.x, p.y - coolieH * 0.82, coolieW * 0.35, 0, Math.PI * 2);
            ctx.fill();
  
            // Dhoti / Trousers
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(p.x - coolieW * 0.35, p.y - coolieH * 0.32, coolieW * 0.3, coolieH * 0.32);
            ctx.fillRect(p.x + coolieW * 0.05, p.y - coolieH * 0.32, coolieW * 0.3, coolieH * 0.32);
  
            // Luggage Trunk Box Balanced on Head!
            ctx.fillStyle = item.trunkColor || '#b45309';
            ctx.fillRect(p.x - coolieW * 0.75, p.y - coolieH * 1.15, coolieW * 1.5, coolieH * 0.32);
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 1;
            ctx.strokeRect(p.x - coolieW * 0.75, p.y - coolieH * 1.15, coolieW * 1.5, coolieH * 0.32);
          }
        }
        // 2. Passengers walking with bags
        else if (item.type === 'passenger') {
          const p = project(item.dist, 0.95, item.position);
          if (p && p.scale > 0.002) {
            const sc = p.scale * 14;
            const passH = 32 * sc;
            const passW = 12 * sc;
  
            // Shirt
            ctx.fillStyle = item.shirtColor || '#f8fafc';
            ctx.fillRect(p.x - passW * 0.4, p.y - passH * 0.7, passW * 0.8, passH * 0.42);
  
            // Head
            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.arc(p.x, p.y - passH * 0.82, passW * 0.35, 0, Math.PI * 2);
            ctx.fill();
  
            // Trousers
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(p.x - passW * 0.35, p.y - passH * 0.3, passW * 0.3, passH * 0.3);
            ctx.fillRect(p.x + passW * 0.05, p.y - passH * 0.3, passW * 0.3, passH * 0.3);
  
            // Suitcase in hand
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(p.x + passW * 0.45, p.y - passH * 0.35, passW * 0.4, passH * 0.25);
          }
        }
        // 3. Indian Railway Chai / Snack Stall ("CHAI / SNACKS")
        else if (item.type === 'tea_stall') {
          const p = project(item.dist, 0.95, item.position);
          if (p && p.scale > 0.002) {
            const sc = p.scale * 16;
            const stallW = 45 * sc;
            const stallH = 38 * sc;
  
            // Counter Base
            ctx.fillStyle = '#78350f';
            ctx.fillRect(p.x - stallW * 0.5, p.y - stallH * 0.5, stallW, stallH * 0.5);
  
            // Warm Counter Illumination
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(p.x - stallW * 0.45, p.y - stallH * 0.85, stallW * 0.9, stallH * 0.35);
  
            // Chai Signboard
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(p.x - stallW * 0.5, p.y - stallH * 1.05, stallW, stallH * 0.22);
            if (stallW > 35) {
              ctx.fillStyle = '#ffffff';
              ctx.font = `bold ${Math.max(8, Math.round(9 * sc))}px Inter, sans-serif`;
              ctx.textAlign = 'center';
              ctx.fillText('CHAI / SNACKS', p.x, p.y - stallH * 0.9);
              ctx.textAlign = 'left';
            }
  
            // Striped Awning
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(p.x - stallW * 0.55, p.y - stallH * 1.15, stallW * 1.1, stallH * 0.12);
          }
        }
        // 4. Luggage Trolleys & Push Carts
        else if (item.type === 'trolley') {
          const p = project(item.dist, 0.95, item.position);
          if (p && p.scale > 0.002) {
            const sc = p.scale * 14;
            const tW = 28 * sc;
            const tH = 16 * sc;
  
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(p.x - tW * 0.5, p.y - tH * 0.5, tW, tH * 0.3);
  
            // Sacks and parcels
            ctx.fillStyle = '#d97706';
            ctx.fillRect(p.x - tW * 0.4, p.y - tH * 1.1, tW * 0.8, tH * 0.6);
  
            // Small Wheels
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(p.x - tW * 0.35, p.y - tH * 0.1, 3 * sc, 0, Math.PI * 2);
            ctx.arc(p.x + tW * 0.35, p.y - tH * 0.1, 3 * sc, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        // 5. Parked Opposing Passenger Rake on Left Track
        else if (item.type === 'parked_train') {
          const pFront = project(-3.6, 0.8, item.position);
          const pRear = project(-3.6, 0.8, item.endPosition || item.position + 60);
          if (pFront && pRear) {
            const sc = pFront.scale * 22;
            const coachH = 45 * sc;
            const coachW = 28 * sc;
  
            // Coach Body (Indian Railway Red/Blue)
            ctx.fillStyle = '#1e3a8a'; // Blue ICF livery on opposing train
            ctx.fillRect(pFront.x - coachW * 0.5, pFront.y - coachH, coachW, coachH);
  
            // Coach Windows with glowing warm light
            ctx.fillStyle = '#fef08a';
            const winCount = 4;
            for (let wIdx = 0; wIdx < winCount; wIdx++) {
              ctx.fillRect(
                pFront.x - coachW * 0.4 + (wIdx * coachW * 0.22),
                pFront.y - coachH * 0.65,
                coachW * 0.16,
                coachH * 0.28
              );
            }
          }
        }
        // 6. Overhead Electrification Catenary Portal Masts
        else if (item.type === 'catenary') {
          const pBase = project(item.side * 2.9, 0, item.position);
          const pTop = project(item.side * 2.9, 6.8, item.position);
          const pWireAnchor = project(0, 5.4, item.position);
  
          if (pBase && pTop && pWireAnchor) {
            ctx.strokeStyle = timeOfDay === 'night' ? '#334155' : '#64748b';
            ctx.lineWidth = Math.max(1.8, 3.8 * pBase.scale);
            ctx.beginPath();
            ctx.moveTo(pBase.x, pBase.y);
            ctx.lineTo(pTop.x, pTop.y);
            ctx.lineTo(pWireAnchor.x, pWireAnchor.y);
            ctx.stroke();
  
            // Insulator
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(pWireAnchor.x, pWireAnchor.y, Math.max(1.5, 3 * pBase.scale), 0, Math.PI * 2);
            ctx.fill();
          }
        }
        // 7. Trees
        else if (item.type === 'tree') {
          const p = project(item.side * item.dist, 0, item.position);
          if (p && p.scale > 0.002) {
            const treeH = 38 * p.scale * (item.scale || 1);
            const treeW = 24 * p.scale * (item.scale || 1);
  
            ctx.fillStyle = '#3e2723';
            ctx.fillRect(p.x - 2 * p.scale, p.y - treeH * 0.3, 4 * p.scale, treeH * 0.3);
  
            ctx.fillStyle = timeOfDay === 'night' ? '#064e3b' : (timeOfDay === 'sunset' ? '#14532d' : '#15803d');
            ctx.beginPath();
            ctx.arc(p.x, p.y - treeH * 0.65, treeW, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        // 8. Buildings
        else if (item.type === 'building') {
          const p = project(item.side * item.dist, 0, item.position);
          if (p && p.scale > 0.002) {
            const bW = item.width * p.scale * 12;
            const bH = item.height * p.scale * 14;
  
            ctx.fillStyle = item.color || '#1e293b';
            ctx.fillRect(p.x - bW * 0.5, p.y - bH, bW, bH);
          }
        }
      }
    }
  
    drawSignals(ctx, project, cameraZ, signalSystem, timeOfDay) {
      const signals = signalSystem.signals || [];
  
      for (const sig of signals) {
        const relZ = sig.positionMeters - cameraZ;
        if (relZ < 1 || relZ > 420) continue;
  
        const mastX = -2.4;
        const pBase = project(mastX, 0, sig.positionMeters);
        const pHead = project(mastX, 4.6, sig.positionMeters);
  
        if (pBase && pHead) {
          // Mast Pole
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = Math.max(2, 4.5 * pBase.scale);
          ctx.beginPath();
          ctx.moveTo(pBase.x, pBase.y);
          ctx.lineTo(pHead.x, pHead.y);
          ctx.stroke();
  
          // Signal Head Box
          const boxW = 18 * pHead.scale;
          const boxH = 44 * pHead.scale;
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(pHead.x - boxW * 0.5, pHead.y - boxH * 0.5, boxW, boxH);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.strokeRect(pHead.x - boxW * 0.5, pHead.y - boxH * 0.5, boxW, boxH);
  
          // Aspect Lenses: Red (Top), Yellow (Middle), Green (Bottom)
          const radius = Math.max(2, 4.6 * pHead.scale);
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
              ctx.shadowColor = colors[asp];
              ctx.shadowBlur = Math.max(8, 22 * pHead.scale);
              ctx.fillStyle = colors[asp];
            } else {
              ctx.shadowBlur = 0;
              ctx.fillStyle = '#1e293b';
            }
  
            ctx.beginPath();
            ctx.arc(pHead.x, lensY, radius, 0, Math.PI * 2);
            ctx.fill();
          });
  
          ctx.shadowBlur = 0;
        }
      }
    }
  
    drawHeadlightBeams(ctx, w, h, horizonY, isCab, cameraX) {
      const originX = w * 0.5 - (cameraX * w * 0.15);
      const originY = isCab ? h * 0.72 : h * 0.82;
  
      const grad = ctx.createRadialGradient(
        originX, originY, 15,
        originX, horizonY + 20, w * 0.7
      );
      grad.addColorStop(0, 'rgba(255, 255, 230, 0.5)');
      grad.addColorStop(0.35, 'rgba(255, 255, 200, 0.18)');
      grad.addColorStop(1.0, 'rgba(255, 255, 200, 0.0)');
  
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(originX - 45, originY);
      ctx.lineTo(w * 0.05, horizonY + 15);
      ctx.lineTo(w * 0.95, horizonY + 15);
      ctx.lineTo(originX + 45, originY);
      ctx.closePath();
      ctx.fill();
    }
  
    /**
     * Draw Full 3D Indian Railways WAP-7 Locomotive & Red LHB Coaches
     */
    drawIndianTrain(ctx, project, cameraZ, trainPos, state, timeOfDay, dt) {
      ctx.save();
  
      // 1. Draw Trailing LHB Passenger Coaches (Draw from rear-most forward)
      const coachLength = 23; // meters per LHB coach
      const numCoaches = 3;
  
      for (let cIdx = numCoaches - 1; cIdx >= 0; cIdx--) {
        const zStart = trainPos - 21.5 - (cIdx * coachLength);
        const zEnd = zStart - (coachLength - 1.2);
  
        const pFrontBaseL = project(-1.5, 0.85, zStart);
        const pFrontBaseR = project(1.5, 0.85, zStart);
        const pFrontTopL = project(-1.5, 3.85, zStart);
        const pFrontTopR = project(1.5, 3.85, zStart);
  
        const pRearBaseL = project(-1.5, 0.85, zEnd);
        const pRearBaseR = project(1.5, 0.85, zEnd);
        const pRearTopL = project(-1.5, 3.85, zEnd);
        const pRearTopR = project(1.5, 3.85, zEnd);
  
        if (pFrontBaseL && pFrontBaseR && pRearBaseL && pRearBaseR && pFrontTopL && pFrontTopR) {
          // Red LHB Coach Side Body (Rajdhani Red)
          ctx.fillStyle = '#b91c1c'; // Indian Railways Rajdhani Red
          ctx.beginPath();
          ctx.moveTo(pFrontBaseR.x, pFrontBaseR.y);
          ctx.lineTo(pRearBaseR.x, pRearBaseR.y);
          ctx.lineTo(pRearTopR.x, pRearTopR.y);
          ctx.lineTo(pFrontTopR.x, pFrontTopR.y);
          ctx.closePath();
          ctx.fill();
  
          // Cream/Yellow Window Band
          const pFrontBandBot = project(1.5, 1.8, zStart);
          const pFrontBandTop = project(1.5, 2.9, zStart);
          const pRearBandBot = project(1.5, 1.8, zEnd);
          const pRearBandTop = project(1.5, 2.9, zEnd);
          if (pFrontBandBot && pFrontBandTop && pRearBandBot && pRearBandTop) {
            ctx.fillStyle = '#fef08a'; // Cream band
            ctx.beginPath();
            ctx.moveTo(pFrontBandBot.x, pFrontBandBot.y);
            ctx.lineTo(pRearBandBot.x, pRearBandBot.y);
            ctx.lineTo(pRearBandTop.x, pRearBandTop.y);
            ctx.lineTo(pFrontBandTop.x, pFrontBandTop.y);
            ctx.closePath();
            ctx.fill();
  
            // Lit Passenger Windows with silhouettes
            for (let wZ = zStart - 3; wZ > zEnd + 2; wZ -= 3.8) {
              const pWinL = project(1.52, 1.95, wZ);
              const pWinR = project(1.52, 1.95, wZ - 2.2);
              const pWinTop = project(1.52, 2.75, wZ);
              if (pWinL && pWinR && pWinTop) {
                ctx.fillStyle = '#fde047'; // warm interior glow
                ctx.fillRect(pWinR.x, pWinTop.y, Math.abs(pWinL.x - pWinR.x), Math.abs(pWinL.y - pWinTop.y));
              }
            }
          }
  
          // Coach Curved Silver Roof
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.moveTo(pFrontTopL.x, pFrontTopL.y);
          ctx.lineTo(pFrontTopR.x, pFrontTopR.y);
          ctx.lineTo(pRearTopR.x, pRearTopR.y);
          ctx.lineTo(pRearTopL.x, pRearTopL.y);
          ctx.closePath();
          ctx.fill();
        }
      }
  
      // 2. Draw Indian Railways WAP-7 Electric Locomotive
      const zNose = trainPos;
      const zRear = trainPos - 21.0;
  
      // Projected Key Nose Vertices
      const pNoseBaseL = project(-1.55, 0.85, zNose);
      const pNoseBaseR = project(1.55, 0.85, zNose);
      const pNoseMidL = project(-1.50, 2.30, zNose);
      const pNoseMidR = project(1.50, 2.30, zNose);
      const pNoseTopL = project(-1.42, 3.90, zNose - 1.8); // aerodynamic slant
      const pNoseTopR = project(1.42, 3.90, zNose - 1.8);
  
      const pRearTopR = project(1.55, 4.0, zRear);
      const pRearBaseR = project(1.55, 0.85, zRear);
  
      if (pNoseBaseL && pNoseBaseR && pNoseMidL && pNoseMidR && pNoseTopL && pNoseTopR) {
        // 2a. Right Body Side Wall (if visible from angle)
        if (pRearBaseR && pRearTopR) {
          ctx.fillStyle = '#991b1b'; // Darker shaded red side
          ctx.beginPath();
          ctx.moveTo(pNoseBaseR.x, pNoseBaseR.y);
          ctx.lineTo(pRearBaseR.x, pRearBaseR.y);
          ctx.lineTo(pRearTopR.x, pRearTopR.y);
          ctx.lineTo(pNoseTopR.x, pNoseTopR.y);
          ctx.closePath();
          ctx.fill();
  
          // Yellow Side Stripe
          const pSideStripeNose = project(1.56, 2.1, zNose);
          const pSideStripeRear = project(1.56, 2.1, zRear);
          if (pSideStripeNose && pSideStripeRear) {
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = Math.max(3, 7 * pSideStripeNose.scale);
            ctx.beginPath();
            ctx.moveTo(pSideStripeNose.x, pSideStripeNose.y);
            ctx.lineTo(pSideStripeRear.x, pSideStripeRear.y);
            ctx.stroke();
          }
        }
  
        // 2b. Front Nose Face (Vibrant Indian Red)
        const frontGrad = ctx.createLinearGradient(pNoseBaseL.x, 0, pNoseBaseR.x, 0);
        frontGrad.addColorStop(0, '#991b1b');
        frontGrad.addColorStop(0.3, '#dc2626');
        frontGrad.addColorStop(0.7, '#ef4444');
        frontGrad.addColorStop(1.0, '#b91c1c');
  
        ctx.fillStyle = frontGrad;
        ctx.beginPath();
        ctx.moveTo(pNoseBaseL.x, pNoseBaseL.y);
        ctx.lineTo(pNoseBaseR.x, pNoseBaseR.y);
        ctx.lineTo(pNoseMidR.x, pNoseMidR.y);
        ctx.lineTo(pNoseTopR.x, pNoseTopR.y);
        ctx.lineTo(pNoseTopL.x, pNoseTopL.y);
        ctx.lineTo(pNoseMidL.x, pNoseMidL.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#7f1d1d';
        ctx.lineWidth = 2;
        ctx.stroke();
  
        // 2c. Front Yellow/Cream Chevron Cheatline (Signature Rajdhani design)
        const pCheatL = project(-1.52, 2.15, zNose);
        const pCheatR = project(1.52, 2.15, zNose);
        const pCheatMid = project(0, 1.75, zNose);
        if (pCheatL && pCheatR && pCheatMid) {
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.moveTo(pCheatL.x, pCheatL.y);
          ctx.lineTo(pCheatMid.x, pCheatMid.y);
          ctx.lineTo(pCheatR.x, pCheatR.y);
          ctx.lineTo(pCheatR.x, pCheatR.y + 12 * pCheatR.scale);
          ctx.lineTo(pCheatMid.x, pCheatMid.y + 14 * pCheatMid.scale);
          ctx.lineTo(pCheatL.x, pCheatL.y + 12 * pCheatL.scale);
          ctx.closePath();
          ctx.fill();
        }
  
        // 2d. Front Windshield (Twin cab windscreens)
        const pWinBL = project(-1.25, 2.65, zNose - 0.4);
        const pWinBR = project(1.25, 2.65, zNose - 0.4);
        const pWinTL = project(-1.18, 3.65, zNose - 1.4);
        const pWinTR = project(1.18, 3.65, zNose - 1.4);
        if (pWinBL && pWinBR && pWinTL && pWinTR) {
          ctx.fillStyle = '#082f49'; // dark reflective glass
          ctx.beginPath();
          ctx.moveTo(pWinBL.x, pWinBL.y);
          ctx.lineTo(pWinBR.x, pWinBR.y);
          ctx.lineTo(pWinTR.x, pWinTR.y);
          ctx.lineTo(pWinTL.x, pWinTL.y);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 1.5;
          ctx.stroke();
  
          // Center Windshield Divider
          const pWinMidB = project(0, 2.65, zNose - 0.4);
          const pWinMidT = project(0, 3.65, zNose - 1.4);
          if (pWinMidB && pWinMidT) {
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = Math.max(2, 4 * pWinMidB.scale);
            ctx.beginPath();
            ctx.moveTo(pWinMidB.x, pWinMidB.y);
            ctx.lineTo(pWinMidT.x, pWinMidT.y);
            ctx.stroke();
          }
        }
  
        // 2e. "Rajdhani Express" & "WAP-7" Text Insignia on Front
        const pInsignia = project(0, 2.35, zNose);
        if (pInsignia && pInsignia.scale > 0.0025) {
          ctx.textAlign = 'center';
          ctx.font = `bold ${Math.max(9, Math.round(13 * pInsignia.scale * 10))}px 'Inter', sans-serif`;
          ctx.fillStyle = '#fef08a';
          ctx.fillText('Rajdhani Express', pInsignia.x, pInsignia.y);
  
          // WAP-7 Class Badge
          ctx.font = `900 ${Math.max(8, Math.round(11 * pInsignia.scale * 10))}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = '#ffffff';
          ctx.fillText('WAP-7', pInsignia.x, pInsignia.y + 14 * pInsignia.scale * 10);
          ctx.textAlign = 'left';
        }
  
        // 2f. Indian Tricolor Flag on Front Nose
        const pFlag = project(-0.85, 2.05, zNose);
        if (pFlag && pFlag.scale > 0.002) {
          const flagW = 24 * pFlag.scale * 10;
          const flagH = 14 * pFlag.scale * 10;
          ctx.fillStyle = '#f97316'; // Saffron
          ctx.fillRect(pFlag.x, pFlag.y, flagW, flagH * 0.33);
          ctx.fillStyle = '#ffffff'; // White
          ctx.fillRect(pFlag.x, pFlag.y + flagH * 0.33, flagW, flagH * 0.33);
          ctx.fillStyle = '#16a34a'; // Green
          ctx.fillRect(pFlag.x, pFlag.y + flagH * 0.66, flagW, flagH * 0.33);
        }
  
        // 2g. High-Intensity LED Headlights
        const pHeadL = project(-0.95, 1.8, zNose);
        const pHeadR = project(0.95, 1.8, zNose);
        const pHeadTop = project(0, 3.85, zNose - 1.6);
  
        if (state.headlights) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 25;
  
          // Top Central High-Beam
          if (pHeadTop) {
            ctx.beginPath();
            ctx.arc(pHeadTop.x, pHeadTop.y, Math.max(3, 8 * pHeadTop.scale * 10), 0, Math.PI * 2);
            ctx.fill();
          }
          // Left & Right Dual Front Beams
          if (pHeadL && pHeadR) {
            ctx.beginPath();
            ctx.arc(pHeadL.x, pHeadL.y, Math.max(3, 7 * pHeadL.scale * 10), 0, Math.PI * 2);
            ctx.arc(pHeadR.x, pHeadR.y, Math.max(3, 7 * pHeadR.scale * 10), 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.shadowBlur = 0;
        }
  
        // Red Marker Lamps
        const pMarkerL = project(-1.25, 1.45, zNose);
        const pMarkerR = project(1.25, 1.45, zNose);
        if (pMarkerL && pMarkerR) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(pMarkerL.x, pMarkerL.y, Math.max(2, 4 * pMarkerL.scale * 10), 0, Math.PI * 2);
          ctx.arc(pMarkerR.x, pMarkerR.y, Math.max(2, 4 * pMarkerR.scale * 10), 0, Math.PI * 2);
          ctx.fill();
        }
  
        // 2h. Front Buffers & Coupler
        const pBufferL = project(-1.15, 0.95, zNose + 0.3);
        const pBufferR = project(1.15, 0.95, zNose + 0.3);
        if (pBufferL && pBufferR) {
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(pBufferL.x, pBufferL.y, Math.max(3, 9 * pBufferL.scale * 10), 0, Math.PI * 2);
          ctx.arc(pBufferR.x, pBufferR.y, Math.max(3, 9 * pBufferR.scale * 10), 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
  
        // 2i. Front Cowcatcher / Cattle Guard Grille (Red & White chevrons)
        const pCattleL = project(-1.45, 0.25, zNose + 0.2);
        const pCattleR = project(1.45, 0.25, zNose + 0.2);
        const pCattleT = project(0, 0.75, zNose);
        if (pCattleL && pCattleR && pCattleT) {
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.moveTo(pCattleL.x, pCattleL.y);
          ctx.lineTo(pCattleT.x, pCattleT.y);
          ctx.lineTo(pCattleR.x, pCattleR.y);
          ctx.closePath();
          ctx.fill();
  
          // White diagonal safety stripes
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(pCattleL.x + 10, pCattleL.y);
          ctx.lineTo(pCattleT.x, pCattleT.y);
          ctx.moveTo(pCattleR.x - 10, pCattleR.y);
          ctx.lineTo(pCattleT.x, pCattleT.y);
          ctx.stroke();
        }
  
        // 2j. Rooftop Pantograph & 25kV Electric Spark
        const pPantoBase = project(0, 4.15, zNose - 5.5);
        if (pPantoBase) {
          if (state.pantographUp) {
            const pPantoContact = project(0, 5.25, zNose - 5.5);
            const pPantoKnee = project(0.4, 4.7, zNose - 5.5);
  
            if (pPantoContact && pPantoKnee) {
              ctx.strokeStyle = '#dc2626'; // Red articulated arms
              ctx.lineWidth = Math.max(2, 4 * pPantoBase.scale * 10);
              ctx.beginPath();
              ctx.moveTo(pPantoBase.x, pPantoBase.y);
              ctx.lineTo(pPantoKnee.x, pPantoKnee.y);
              ctx.lineTo(pPantoContact.x, pPantoContact.y);
              ctx.stroke();
  
              // Copper contact shoe
              ctx.strokeStyle = '#f59e0b';
              ctx.lineWidth = Math.max(2.5, 6 * pPantoBase.scale * 10);
              ctx.beginPath();
              ctx.moveTo(pPantoContact.x - 16 * pPantoBase.scale * 10, pPantoContact.y);
              ctx.lineTo(pPantoContact.x + 16 * pPantoBase.scale * 10, pPantoContact.y);
              ctx.stroke();
  
              // Electric spark flash at contact wire when accelerating
              if (state.speedKmh > 15 && state.throttlePercent > 20 && Math.random() < 0.12) {
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#00f0ff';
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.arc(pPantoContact.x, pPantoContact.y, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
              }
            }
          } else {
            // Folded flat on roof
            ctx.strokeStyle = '#dc2626';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(pPantoBase.x - 12, pPantoBase.y);
            ctx.lineTo(pPantoBase.x + 12, pPantoBase.y);
            ctx.stroke();
          }
        }
      }
  
      ctx.restore();
    }
  
    drawCabCockpit(ctx, w, h, state, dt, weather) {
      ctx.save();
  
      // Left & Right Cab Pillars (WAP-7 Windscreen Architecture)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w * 0.14, 0);
      ctx.lineTo(w * 0.20, h * 0.72);
      ctx.lineTo(0, h * 0.72);
      ctx.closePath();
      ctx.fill();
  
      ctx.beginPath();
      ctx.moveTo(w, 0);
      ctx.lineTo(w * 0.86, 0);
      ctx.lineTo(w * 0.80, h * 0.72);
      ctx.lineTo(w, h * 0.72);
      ctx.closePath();
      ctx.fill();
  
      // Center Windshield Beam
      ctx.fillRect(w * 0.485, 0, w * 0.03, h * 0.72);
  
      // Cab Roof Trim
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, w, h * 0.08);
  
      // Windshield Wipers in Rain
      if (weather === 'rain') {
        this.wiperAngle += dt * 3.8 * this.wiperDirection;
        if (this.wiperAngle > 1.2) {
          this.wiperAngle = 1.2;
          this.wiperDirection = -1;
        } else if (this.wiperAngle < -0.2) {
          this.wiperAngle = -0.2;
          this.wiperDirection = 1;
        }
  
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 6;
        [w * 0.28, w * 0.72].forEach(bx => {
          ctx.beginPath();
          const by = h * 0.72;
          const len = h * 0.38;
          const ex = bx + Math.sin(this.wiperAngle) * len;
          const ey = by - Math.cos(this.wiperAngle) * len;
          ctx.moveTo(bx, by);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        });
      }
  
      // Driver Console Dashboard Bench
      const consoleGrad = ctx.createLinearGradient(0, h * 0.72, 0, h);
      consoleGrad.addColorStop(0, '#1e293b');
      consoleGrad.addColorStop(0.2, '#0f172a');
      consoleGrad.addColorStop(1.0, '#020617');
  
      ctx.fillStyle = consoleGrad;
      ctx.fillRect(0, h * 0.72, w, h * 0.28);
  
      // Console Dial Lights & Tractive Meter
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
  

  // --- Module: src/engine/UIManager.js ---
  /**
   * Railway Commander - Indian Railways WAP-7 Cockpit & UI Manager
   * Handles:
   * - Top HUD: Next Stop ARAKKONAM cluster, Amber digital 7-segment 22:15 clock,
   *   bold 80 KMPH speed readout, circular speed gauge, 70 KMPH speed limit dial
   * - Left Warnings: Red Signal in 200Mts, Speed Limit in 150Mts, Track Change in 230Mts
   * - Bottom Timetable: Arrival target & real-time driver log
   * - Driver Console: Emergency Stop button, Auxiliary dock (Panto, Power, Lights, Doors, Chime, big blue Horn),
   *   Reverser [F] [R], Throttle slider with percentage readout
   * - Menus, countdown, briefing, results, and pause modals
   */
  
  class UIManager {
    constructor(gameEngine) {
      this.engine = gameEngine;
      this.dom = {};
      this.notificationTimeout = null;
  
      // Simulation Clock
      this.simSeconds = 22 * 3600 + 15 * 60; // 22:15:00 default
      this.lastLogMessage = '9:40 PM | CAB ACTIVE • TRACK CLEAR';
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
  
      // Top Bar HUD
      this.dom.hudCameraBadge = document.getElementById('hudCameraBadge');
      this.dom.btnCameraToggle = document.getElementById('btnCameraToggle');
      this.dom.btnPauseGame = document.getElementById('btnPauseGame');
  
      this.dom.hudNextStopName = document.getElementById('hudNextStopName');
      this.dom.hudNextStopDist = document.getElementById('hudNextStopDist');
  
      this.dom.hudDigitalClock = document.getElementById('hudDigitalClock');
      this.dom.hudSpeedVal = document.getElementById('hudSpeedVal');
      this.dom.hudSpeedArc = document.getElementById('hudSpeedArc');
      this.dom.hudSpeedLimitVal = document.getElementById('hudSpeedLimitVal');
      this.dom.hudSpeedLimitBadge = document.getElementById('hudSpeedLimitBadge');
      this.dom.hudLimitTimer = document.getElementById('hudLimitTimer');
  
      // Left Alert Chips
      this.dom.hudLeftAlerts = document.getElementById('hudLeftAlerts');
      this.dom.alertSignalChip = document.getElementById('alertSignalChip');
      this.dom.alertSignalOptic = document.getElementById('alertSignalOptic');
      this.dom.alertSignalText = document.getElementById('alertSignalText');
  
      this.dom.alertSpeedChip = document.getElementById('alertSpeedChip');
      this.dom.alertSpeedSignVal = document.getElementById('alertSpeedSignVal');
      this.dom.alertSpeedText = document.getElementById('alertSpeedText');
  
      this.dom.alertTrackChangeChip = document.getElementById('alertTrackChangeChip');
      this.dom.alertTrackChangeText = document.getElementById('alertTrackChangeText');
  
      this.dom.hudOverspeedToast = document.getElementById('hudOverspeedToast');
  
      // Bottom Timetable & Status Capsule
      this.dom.hudTimetableTarget = document.getElementById('hudTimetableTarget');
      this.dom.hudStatusLog = document.getElementById('hudStatusLog');
  
      // Bottom Driver Console Controls
      this.dom.btnEmergencyBrake = document.getElementById('btnEmergencyBrake');
  
      this.dom.btnPantograph = document.getElementById('btnPantograph');
      this.dom.ledPantograph = document.getElementById('ledPantograph');
  
      this.dom.btnEnginePower = document.getElementById('btnEnginePower');
      this.dom.ledPower = document.getElementById('ledPower');
  
      this.dom.btnHeadlights = document.getElementById('btnHeadlights');
      this.dom.ledHeadlights = document.getElementById('ledHeadlights');
  
      this.dom.btnDoors = document.getElementById('btnDoors');
      this.dom.ledDoors = document.getElementById('ledDoors');
  
      this.dom.btnStationChime = document.getElementById('btnStationChime');
      this.dom.ledChime = document.getElementById('ledChime');
  
      this.dom.btnHorn = document.getElementById('btnHorn');
  
      this.dom.btnRevForward = document.getElementById('btnRevForward');
      this.dom.btnRevReverse = document.getElementById('btnRevReverse');
  
      this.dom.hudThrottleReadout = document.getElementById('hudThrottleReadout');
      this.dom.hudThrottleSlider = document.getElementById('hudThrottleSlider');
      this.dom.btnThrottleDown = document.getElementById('btnThrottleDown');
      this.dom.btnThrottleUp = document.getElementById('btnThrottleUp');
  
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
      // Menu navigation
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
  
      // Camera Mode Switcher Button
      this.dom.btnCameraToggle?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        const mode = this.engine.renderer.cycleCameraMode();
        if (this.dom.hudCameraBadge) {
          this.dom.hudCameraBadge.textContent = this.engine.renderer.getCameraModeLabel();
        }
        this.setEventLog(`CAMERA: ${mode.toUpperCase()} VIEW`);
      });
  
      // Pause Game Button
      this.dom.btnPauseGame?.addEventListener('click', () => {
        this.engine.soundManager.playClick();
        this.engine.pauseGame();
      });
  
      // Emergency Stop Button
      this.dom.btnEmergencyBrake?.addEventListener('click', () => {
        this.engine.applyEmergencyBrake();
        this.setEventLog('EMERGENCY BRAKE APPLIED');
        this.showNotification('🛑 EMERGENCY BRAKE ENGAGED!', 'danger');
      });
  
      // Pantograph Toggle Button
      this.dom.btnPantograph?.addEventListener('click', () => {
        const isUp = this.engine.physics.togglePantograph();
        this.engine.soundManager.playPantographSpark();
        if (this.dom.ledPantograph) {
          this.dom.ledPantograph.className = isUp ? 'aux-led on' : 'aux-led off';
        }
        this.dom.btnPantograph.classList.toggle('active', isUp);
        this.setEventLog(isUp ? 'PANTOGRAPH RAISED (25kV OHE)' : 'PANTOGRAPH LOWERED - NO TRACTION');
      });
  
      // Traction Inverter Power Toggle Button
      this.dom.btnEnginePower?.addEventListener('click', () => {
        const pwr = this.engine.physics.toggleEnginePower();
        this.engine.soundManager.playClick();
        if (this.dom.ledPower) {
          this.dom.ledPower.className = pwr ? 'aux-led on' : 'aux-led off';
        }
        this.dom.btnEnginePower.classList.toggle('active', pwr);
        this.setEventLog(pwr ? 'TRACTION INVERTERS ONLINE' : 'TRACTION INVERTERS OFFLINE');
      });
  
      // Headlights Toggle Button
      this.dom.btnHeadlights?.addEventListener('click', () => {
        const hl = this.engine.physics.toggleHeadlights();
        this.engine.soundManager.playClick();
        if (this.dom.ledHeadlights) {
          this.dom.ledHeadlights.className = hl ? 'aux-led on' : 'aux-led off';
        }
        this.dom.btnHeadlights.classList.toggle('active', hl);
        this.setEventLog(hl ? 'HEADLIGHTS HIGH BEAM ON' : 'HEADLIGHTS OFF');
      });
  
      // Passenger Doors Toggle Button
      this.dom.btnDoors?.addEventListener('click', () => {
        const ok = this.engine.physics.toggleDoors();
        if (ok) {
          const open = this.engine.physics.doorsOpen;
          this.engine.soundManager.playDoorSound(open);
          if (this.dom.ledDoors) {
            this.dom.ledDoors.className = open ? 'aux-led on' : 'aux-led off';
          }
          this.dom.btnDoors.classList.toggle('active', open);
          this.setEventLog(open ? 'DOORS OPEN - PLATFORM PASSENGERS' : 'DOORS CLOSED - SAFETY LOCKED');
        } else {
          this.showNotification('Cannot open doors while train is moving!', 'warning');
        }
      });
  
      // Station Announcement Chime Button
      this.dom.btnStationChime?.addEventListener('click', () => {
        this.engine.soundManager.playStationChime();
        this.setEventLog('STATION ANNOUNCEMENT CHIME');
        this.showNotification('📢 "Yatri kripya dhyan dein..."', 'info');
      });
  
      // Big Blue Circular Locomotive Horn Button (Touch & Mouse hold)
      const hornBtn = this.dom.btnHorn;
      if (hornBtn) {
        const hornStart = (e) => {
          e.preventDefault();
          this.engine.physics.setHorn(true);
          this.engine.soundManager.playHorn(true);
        };
        const hornEnd = (e) => {
          e.preventDefault();
          this.engine.physics.setHorn(false);
          this.engine.soundManager.playHorn(false);
        };
  
        hornBtn.addEventListener('mousedown', hornStart);
        hornBtn.addEventListener('mouseup', hornEnd);
        hornBtn.addEventListener('mouseleave', hornEnd);
        hornBtn.addEventListener('touchstart', hornStart, { passive: false });
        hornBtn.addEventListener('touchend', hornEnd, { passive: false });
      }
  
      // Reverser Selector [F] [R]
      this.dom.btnRevForward?.addEventListener('click', () => {
        if (this.engine.physics.setReverser('F')) {
          this.engine.soundManager.playClick();
          this.dom.btnRevForward.classList.add('active');
          this.dom.btnRevReverse.classList.remove('active');
          this.setEventLog('REVERSER: FORWARD (F)');
        }
      });
  
      this.dom.btnRevReverse?.addEventListener('click', () => {
        if (this.engine.physics.setReverser('R')) {
          this.engine.soundManager.playClick();
          this.dom.btnRevReverse.classList.add('active');
          this.dom.btnRevForward.classList.remove('active');
          this.setEventLog('REVERSER: REVERSE (R)');
        }
      });
  
      // Throttle Range Slider
      this.dom.hudThrottleSlider?.addEventListener('input', (e) => {
        const pct = parseInt(e.target.value, 10) || 0;
        this.engine.physics.setThrottlePercent(pct);
      });
  
      // Throttle Step Buttons
      this.dom.btnThrottleUp?.addEventListener('click', () => {
        this.engine.physics.throttleUp();
        this.engine.soundManager.playClick();
      });
  
      this.dom.btnThrottleDown?.addEventListener('click', () => {
        this.engine.physics.throttleDown();
        this.engine.soundManager.playClick();
      });
  
      // Sound & Settings
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
  
    setEventLog(msg) {
      this.lastLogMessage = `9:40 PM | ${msg}`;
      if (this.dom.hudStatusLog) {
        this.dom.hudStatusLog.textContent = this.lastLogMessage;
      }
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
      if (this.dom.hudCameraBadge) {
        this.dom.hudCameraBadge.textContent = this.engine.renderer.getCameraModeLabel();
      }
    }
  
    showPause() {
      this.showScreen('screenPause');
    }
  
    showMissionFailed(reason) {
      if (this.dom.failedReason) {
        this.dom.failedReason.textContent = reason || 'Safety regulations violation.';
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
  
    /**
     * Main HUD Frame Update
     */
    updateHUD(state, nextSignal, nextStation, missionConfig) {
      if (!state) return;
  
      // 1. Digital Speedometer & Speed Arc
      const speed = Math.round(state.speedKmh);
      if (this.dom.hudSpeedVal) {
        this.dom.hudSpeedVal.textContent = speed;
      }
  
      if (this.dom.hudSpeedArc) {
        // Circumference = 2 * PI * 38 = ~238.7
        const speedRatio = Math.min(1.0, speed / 140);
        const strokeOffset = 238 - (speedRatio * 180);
        this.dom.hudSpeedArc.style.strokeDashoffset = strokeOffset;
      }
  
      // Speed Limit Display
      if (this.dom.hudSpeedLimitVal) {
        this.dom.hudSpeedLimitVal.textContent = state.speedLimitKmh;
      }
  
      // Overspeed Toast
      if (this.dom.hudOverspeedToast) {
        if (state.overspeedWarning) {
          this.dom.hudOverspeedToast.classList.remove('hidden');
        } else {
          this.dom.hudOverspeedToast.classList.add('hidden');
        }
      }
  
      // 2. Top Center: Next Stop Station
      if (this.dom.hudNextStopName) {
        const stName = nextStation ? nextStation.name : (missionConfig?.stations?.[0]?.name || 'ARAKKONAM');
        this.dom.hudNextStopName.textContent = stName;
      }
      if (this.dom.hudNextStopDist) {
        if (nextStation) {
          this.dom.hudNextStopDist.textContent = `in ${nextStation.distanceMeters.toLocaleString()} Mts`;
        } else {
          this.dom.hudNextStopDist.textContent = 'ARRIVED';
        }
      }
  
      // 3. Digital Amber LED Clock (e.g. 22:15)
      if (this.dom.hudDigitalClock) {
        const clockStr = missionConfig?.initialClock || '22:15';
        this.dom.hudDigitalClock.textContent = clockStr;
      }
  
      // 4. Left Track Warnings Stack
      // 4a. Signal Alert
      if (this.dom.alertSignalChip && this.dom.alertSignalText) {
        if (nextSignal && nextSignal.distanceMeters <= 800) {
          this.dom.alertSignalChip.style.display = 'flex';
          this.dom.alertSignalText.textContent = `${nextSignal.aspect} SIGNAL in ${nextSignal.distanceMeters}Mts`;
          if (this.dom.alertSignalOptic) {
            this.dom.alertSignalOptic.className = `optic-lens-dot ${nextSignal.aspect.toLowerCase()}`;
          }
        } else {
          this.dom.alertSignalChip.style.display = 'none';
        }
      }
  
      // 4b. Speed Limit Notice Alert
      if (this.dom.alertSpeedChip && this.dom.alertSpeedText) {
        const speedNotice = this.engine.trackManager.getNextSpeedLimitNotice(state.positionMeters, 650);
        if (speedNotice) {
          this.dom.alertSpeedChip.style.display = 'flex';
          if (this.dom.alertSpeedSignVal) {
            this.dom.alertSpeedSignVal.textContent = speedNotice.nextLimit;
          }
          this.dom.alertSpeedText.textContent = `SPEED LIMIT in ${speedNotice.distance}Mts`;
        } else {
          this.dom.alertSpeedChip.style.display = 'none';
        }
      }
  
      // 4c. Track Change / Switch Notice Alert
      if (this.dom.alertTrackChangeChip && this.dom.alertTrackChangeText) {
        const trackSwitch = this.engine.trackManager.getNextTrackSwitch(state.positionMeters, 650);
        if (trackSwitch) {
          this.dom.alertTrackChangeChip.style.display = 'flex';
          this.dom.alertTrackChangeText.textContent = `TRACK CHANGE in ${trackSwitch.distanceMeters}Mts`;
        } else {
          this.dom.alertTrackChangeChip.style.display = 'none';
        }
      }
  
      // 5. Bottom Timetable Target
      if (this.dom.hudTimetableTarget && missionConfig) {
        const targetTime = missionConfig.targetTime || '10:45 PM';
        const destName = missionConfig.stations?.[missionConfig.stations.length - 1]?.name || 'ARAKKONAM';
        this.dom.hudTimetableTarget.textContent = `REACH ${destName} BY ${targetTime}`;
      }
  
      // Dynamic Log Status
      if (this.dom.hudStatusLog) {
        if (state.emergencyBrake) {
          this.dom.hudStatusLog.textContent = '9:40 PM | EMERGENCY BRAKE APPLIED';
        } else if (state.doorsOpen) {
          this.dom.hudStatusLog.textContent = '9:40 PM | DOORS OPEN • PASSENGERS BOARDING';
        } else if (state.overspeedWarning) {
          this.dom.hudStatusLog.textContent = '9:40 PM | ⚠ OVERSPEED RESTRICTION EXCEEDED';
        } else if (!state.pantographUp) {
          this.dom.hudStatusLog.textContent = '9:40 PM | PANTOGRAPH LOWERED • NO 25kV OHE';
        } else {
          this.dom.hudStatusLog.textContent = this.lastLogMessage;
        }
      }
  
      // 6. Throttle & Console Controls
      if (this.dom.hudThrottleReadout) {
        this.dom.hudThrottleReadout.textContent = `THROTTLE ${state.throttlePercent}%`;
      }
      if (this.dom.hudThrottleSlider) {
        if (document.activeElement !== this.dom.hudThrottleSlider) {
          this.dom.hudThrottleSlider.value = state.throttlePercent;
        }
      }
  
      // Aux button LEDs & states
      if (this.dom.ledPantograph) {
        this.dom.ledPantograph.className = state.pantographUp ? 'aux-led on' : 'aux-led off';
      }
      if (this.dom.btnPantograph) {
        this.dom.btnPantograph.classList.toggle('active', state.pantographUp);
      }
  
      if (this.dom.ledPower) {
        this.dom.ledPower.className = state.enginePower ? 'aux-led on' : 'aux-led off';
      }
      if (this.dom.btnEnginePower) {
        this.dom.btnEnginePower.classList.toggle('active', state.enginePower);
      }
  
      if (this.dom.ledHeadlights) {
        this.dom.ledHeadlights.className = state.headlights ? 'aux-led on' : 'aux-led off';
      }
      if (this.dom.btnHeadlights) {
        this.dom.btnHeadlights.classList.toggle('active', state.headlights);
      }
  
      if (this.dom.ledDoors) {
        this.dom.ledDoors.className = state.doorsOpen ? 'aux-led on' : 'aux-led off';
      }
      if (this.dom.btnDoors) {
        this.dom.btnDoors.classList.toggle('active', state.doorsOpen);
      }
  
      // Reverser buttons
      if (this.dom.btnRevForward && this.dom.btnRevReverse) {
        this.dom.btnRevForward.classList.toggle('active', state.reverser === 'F');
        this.dom.btnRevReverse.classList.toggle('active', state.reverser === 'R');
      }
  
      // Camera Badge
      if (this.dom.hudCameraBadge) {
        this.dom.hudCameraBadge.textContent = this.engine.renderer.getCameraModeLabel();
      }
    }
  
    showNotification(message, type = 'info', duration = 3200) {
      let banner = document.getElementById('hudNotificationToast');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'hudNotificationToast';
        banner.className = 'hud-alert-banner';
        document.body.appendChild(banner);
      }
  
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
  

  // --- Module: src/engine/InputManager.js ---
  /**
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
      if (key === 'Escape') {
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
  
        case 'p':
        case 'P':
          e.preventDefault();
          this.engine.onTogglePantograph();
          break;
  
        case 'o':
        case 'O':
          e.preventDefault();
          this.engine.onToggleDoors();
          break;
  
        case 'n':
        case 'N':
          e.preventDefault();
          this.engine.onStationChime();
          break;
  
        case 'r':
        case 'R':
          e.preventDefault();
          this.engine.onToggleReverser();
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
  

  // --- Module: src/engine/SaveManager.js ---
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
  

  // --- Module: src/engine/GameEngine.js ---
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
  
    applyEmergencyBrake() {
      this.onEmergencyBrake();
    }
  
    pauseGame() {
      this.togglePause();
    }
  
    onEmergencyBrake() {
      this.soundManager.resume();
      this.physics.applyEmergencyBrake();
      this.missionSystem.recordEmergencyBrake();
      this.soundManager.playAirBrakeHiss(true);
      this.uiManager.setEventLog('EMERGENCY BRAKE APPLIED');
      this.uiManager.showNotification('🛑 EMERGENCY BRAKE APPLIED!', 'danger');
    }
  
    onHorn(active) {
      this.physics.setHorn(active);
      this.soundManager.playHorn(active);
    }
  
    onToggleHeadlights() {
      const state = this.physics.toggleHeadlights();
      this.soundManager.playClick();
      if (this.uiManager.dom.ledHeadlights) {
        this.uiManager.dom.ledHeadlights.className = state ? 'aux-led on' : 'aux-led off';
      }
      if (this.uiManager.dom.btnHeadlights) {
        this.uiManager.dom.btnHeadlights.classList.toggle('active', state);
      }
      this.uiManager.setEventLog(state ? 'HEADLIGHTS HIGH BEAM ON' : 'HEADLIGHTS OFF');
      this.uiManager.showNotification(state ? 'Headlights: ON' : 'Headlights: OFF', 'info', 1500);
      return state;
    }
  
    onTogglePantograph() {
      this.soundManager.resume();
      const isUp = this.physics.togglePantograph();
      this.soundManager.playPantographSpark();
      if (this.uiManager.dom.ledPantograph) {
        this.uiManager.dom.ledPantograph.className = isUp ? 'aux-led on' : 'aux-led off';
      }
      if (this.uiManager.dom.btnPantograph) {
        this.uiManager.dom.btnPantograph.classList.toggle('active', isUp);
      }
      this.uiManager.setEventLog(isUp ? 'PANTOGRAPH RAISED (25kV OHE)' : 'PANTOGRAPH LOWERED - NO TRACTION');
      this.uiManager.showNotification(isUp ? 'Pantograph: RAISED' : 'Pantograph: LOWERED', 'info', 1500);
      return isUp;
    }
  
    onTogglePower() {
      this.soundManager.resume();
      const pwr = this.physics.toggleEnginePower();
      this.soundManager.playClick();
      if (this.uiManager.dom.ledPower) {
        this.uiManager.dom.ledPower.className = pwr ? 'aux-led on' : 'aux-led off';
      }
      if (this.uiManager.dom.btnEnginePower) {
        this.uiManager.dom.btnEnginePower.classList.toggle('active', pwr);
      }
      this.uiManager.setEventLog(pwr ? 'TRACTION INVERTERS ONLINE' : 'TRACTION INVERTERS OFFLINE');
      this.uiManager.showNotification(pwr ? 'Traction Power: ON' : 'Traction Power: OFF', 'info', 1500);
      return pwr;
    }
  
    onToggleDoors() {
      this.soundManager.resume();
      const ok = this.physics.toggleDoors();
      if (ok) {
        const open = this.physics.doorsOpen;
        this.soundManager.playDoorSound(open);
        if (this.uiManager.dom.ledDoors) {
          this.uiManager.dom.ledDoors.className = open ? 'aux-led on' : 'aux-led off';
        }
        if (this.uiManager.dom.btnDoors) {
          this.uiManager.dom.btnDoors.classList.toggle('active', open);
        }
        this.uiManager.setEventLog(open ? 'DOORS OPEN - PLATFORM PASSENGERS' : 'DOORS CLOSED - SAFETY LOCKED');
        this.uiManager.showNotification(open ? 'Passenger Doors: OPEN' : 'Passenger Doors: CLOSED', 'info', 1500);
      } else {
        this.uiManager.showNotification('Cannot open doors while train is moving!', 'warning', 2000);
      }
      return ok;
    }
  
    onStationChime() {
      this.soundManager.resume();
      this.soundManager.playStationChime();
      this.uiManager.setEventLog('STATION ANNOUNCEMENT CHIME');
      this.uiManager.showNotification('📢 "Yatri kripya dhyan dein..."', 'info', 2000);
    }
  
    onToggleReverser() {
      this.soundManager.resume();
      const next = this.physics.reverser === 'F' ? 'R' : 'F';
      if (this.physics.setReverser(next)) {
        this.soundManager.playClick();
        if (this.uiManager.dom.btnRevForward && this.uiManager.dom.btnRevReverse) {
          this.uiManager.dom.btnRevForward.classList.toggle('active', next === 'F');
          this.uiManager.dom.btnRevReverse.classList.toggle('active', next === 'R');
        }
        this.uiManager.setEventLog(`REVERSER: ${next === 'F' ? 'FORWARD (F)' : 'REVERSE (R)'}`);
        this.uiManager.showNotification(`Reverser: ${next === 'F' ? 'FORWARD' : 'REVERSE'}`, 'info', 1500);
      }
    }
  
    onToggleCamera() {
      this.soundManager.playClick();
      const mode = this.renderer.cycleCameraMode();
      if (this.uiManager.dom.hudCameraBadge) {
        this.uiManager.dom.hudCameraBadge.textContent = this.renderer.getCameraModeLabel();
      }
      this.uiManager.setEventLog(`CAMERA: ${mode.toUpperCase()} VIEW`);
      this.uiManager.showNotification(`Camera View: ${mode.toUpperCase()}`, 'info', 1500);
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
  

  // --- Module: src/main.js ---
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
