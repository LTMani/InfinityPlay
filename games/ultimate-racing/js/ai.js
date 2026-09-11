/**
 * InfinityPlay Ultimate Racing - AI Opponents System
 * Simulates 5 distinct AI rivals with waypoint pathfinding, curve braking, overtaking, and collision recovery
 */

(function() {
  const AI_RIVALS_CONFIG = [
    {
      name: 'Nova',
      carName: 'Velocity X',
      color: '#38bdf8',
      accent: '#0369a1',
      speedFactor: 0.96,
      accelFactor: 0.95,
      aggression: 0.65,
      skill: 0.85,
      preferredLane: -0.4
    },
    {
      name: 'Rex',
      carName: 'Nitro GT',
      color: '#ef4444',
      accent: '#991b1b',
      speedFactor: 0.99,
      accelFactor: 1.02,
      aggression: 0.90,
      skill: 0.82,
      preferredLane: 0.45
    },
    {
      name: 'Shadow',
      carName: 'Phantom R',
      color: '#a855f7',
      accent: '#581c87',
      speedFactor: 0.97,
      accelFactor: 0.94,
      aggression: 0.55,
      skill: 0.94,
      preferredLane: -0.2
    },
    {
      name: 'Blaze',
      carName: 'Cyberbolt',
      color: '#f97316',
      accent: '#c2410c',
      speedFactor: 1.01,
      accelFactor: 0.98,
      aggression: 0.85,
      skill: 0.88,
      preferredLane: 0.2
    },
    {
      name: 'Vortex',
      carName: 'Apex RS',
      color: '#10b981',
      accent: '#047857',
      speedFactor: 0.98,
      accelFactor: 0.96,
      aggression: 0.70,
      skill: 0.90,
      preferredLane: 0.0
    }
  ];

  class AIOpponent {
    constructor(config, startingIndex, trackLength) {
      this.name = config.name;
      this.carName = config.carName;
      this.color = config.color;
      this.accent = config.accent;
      this.speedFactor = config.speedFactor;
      this.accelFactor = config.accelFactor;
      this.aggression = config.aggression;
      this.skill = config.skill;
      this.preferredLane = config.preferredLane !== undefined ? config.preferredLane : 0.0;
      this.targetX = this.preferredLane;

      // Stagger starting grid positions ahead of player (Player starts at z = 240, x = 0.2)
      const gridSlots = [
        { z: 620, x: -0.42 }, // Row 1 Left (Pole)
        { z: 520, x: 0.42 },  // Row 1 Right
        { z: 420, x: -0.42 }, // Row 2 Left
        { z: 320, x: 0.42 },  // Row 2 Right
        { z: 220, x: -0.42 }  // Row 3 Left
      ];
      const slot = gridSlots[startingIndex % gridSlots.length];
      this.x = slot.x;
      this.z = slot.z;
      this.targetX = slot.x;

      this.speed = 0;
      this.maxSpeed = 9200 * this.speedFactor;
      this.accel = 6200 * this.accelFactor;

      // Race tracking
      this.lap = 1;
      this.maxLaps = 3;
      this.currentCheckpoint = 0;
      this.checkpointsPassed = [false, false, false];
      this.finishLineArmed = false;
      this.lapDistanceTravelled = 0;
      this.lastFinishCrossingZ = -1000;
      this.totalDistance = this.z;
      this.hasFinished = false;
      this.finishTime = null;
      this.position = startingIndex + 1; // initial starting rank
      this.laneChangeTimer = Math.random() * 2;
    }

    update(dt, player, segments, trafficList, trackLength, difficulty = 'Medium') {
      if (this.hasFinished) {
        // Slow down gradually after crossing finish
        this.speed = Math.max(0, this.speed - 3000 * dt);
        this.z += this.speed * dt;
        return;
      }

      // Difficulty speed adjustment
      let diffMult = 1.0;
      if (difficulty === 'Easy') diffMult = 0.88;
      if (difficulty === 'Hard') diffMult = 1.05;
      if (difficulty === 'Expert') diffMult = 1.12;

      const targetMax = this.maxSpeed * diffMult;

      // Determine current segment
      const segmentIndex = Math.floor((this.z % trackLength) / 200);
      const currentSegment = segments[segmentIndex] || segments[0];

      // 1. Waypoint lookup & lookahead for upcoming braking zones
      const waypoint = currentSegment.waypoint || { idealX: 0, recommendedSpeedRatio: 1.0, isBrakingZone: false };
      
      const lookaheadSegments = 12;
      let minSpeedRatio = waypoint.recommendedSpeedRatio;
      for (let i = 1; i <= lookaheadSegments; i++) {
        const nextSeg = segments[(segmentIndex + i) % segments.length];
        if (nextSeg && nextSeg.waypoint) {
          if (nextSeg.waypoint.recommendedSpeedRatio < minSpeedRatio) {
            minSpeedRatio = nextSeg.waypoint.recommendedSpeedRatio;
          }
        }
      }

      // 2. Safe Cornering Speed calculation based on waypoints and driver skill
      const skillSpeedBuff = (this.skill - 0.8) * 0.15;
      const effectiveSpeedRatio = Math.min(1.0, minSpeedRatio + skillSpeedBuff);
      const targetSpeed = targetMax * effectiveSpeedRatio;

      // 3. Throttle & Braking
      if (this.speed < targetSpeed) {
        this.speed = Math.min(targetSpeed, this.speed + this.accel * dt);
      } else {
        // Active braking into corner
        this.speed = Math.max(targetSpeed, this.speed - 5000 * dt);
      }

      // 4. Racing Line Navigation: Follow authored idealX with personal lane offset
      const personalOffset = (this.targetX - waypoint.idealX) * 0.2;
      let desiredX = waypoint.idealX + (this.preferredLane * 0.25);

      // On long straights (idealX near 0), occasionally explore overtaking lanes
      if (Math.abs(waypoint.idealX) < 0.15) {
        this.laneChangeTimer -= dt;
        if (this.laneChangeTimer <= 0) {
          this.laneChangeTimer = 2.0 + Math.random() * 3.0;
          const lanes = [-0.5, -0.2, 0.2, 0.5];
          this.preferredLane = lanes[Math.floor(Math.random() * lanes.length)];
        }
        desiredX = this.preferredLane;
      }

      // 5. Dynamic Collision Avoidance (Player & Traffic)
      const distToPlayer = player.z - this.z;
      if (distToPlayer > 0 && distToPlayer < 750 && Math.abs(player.x - this.x) < 0.55) {
        // Player ahead in racing line: slipstream then overtake to whichever side has more room
        desiredX = player.x > 0 ? player.x - 0.65 : player.x + 0.65;
      }

      for (const vehicle of trafficList) {
        const dist = vehicle.z - this.z;
        if (dist > 0 && dist < 650 && Math.abs(vehicle.x - this.x) < 0.5) {
          desiredX = vehicle.x > 0 ? -0.55 : 0.55;
          break;
        }
      }

      // 6. Safe Road Boundary Enforcement (Stay strictly on asphalt surface)
      desiredX = Math.max(-0.80, Math.min(0.80, desiredX));
      this.targetX = desiredX;

      // Smooth steering toward targetX
      const steerDelta = (this.targetX - this.x);
      const steerSpeed = 2.8 + this.skill * 1.2;
      this.x += Math.max(-1.8, Math.min(1.8, steerDelta * steerSpeed * dt));

      // Off-road emergency recovery
      if (Math.abs(this.x) > 0.88) {
        this.x -= Math.sign(this.x) * 1.5 * dt;
      }

      // 7. Update Distance & Progression
      const stepZ = this.speed * dt;
      this.z += stepZ;
      this.totalDistance += stepZ;
      this.lapDistanceTravelled += stepZ;

      // Sequential Checkpoint Validation
      if (currentSegment.checkpoint > 0) {
        if (currentSegment.checkpoint === this.currentCheckpoint + 1) {
          this.currentCheckpoint = currentSegment.checkpoint;
          this.checkpointsPassed[this.currentCheckpoint - 1] = true;
          if (this.currentCheckpoint === 3) {
            this.finishLineArmed = true;
          }
        }
      }

      // Authoritative Finish Line Crossing Check
      const currentSegmentIndex = currentSegment.index;
      const currDist = this.z % trackLength;
      if (
        this.finishLineArmed &&
        this.currentCheckpoint === 3 &&
        this.lapDistanceTravelled >= trackLength * 0.85 &&
        (currDist < 600 || currentSegmentIndex < 4) &&
        (this.z - this.lastFinishCrossingZ > trackLength * 0.5)
      ) {
        this.lastFinishCrossingZ = this.z;
        if (this.lap < this.maxLaps) {
          this.lap++;
          this.currentCheckpoint = 0;
          this.checkpointsPassed = [false, false, false];
          this.finishLineArmed = false;
          this.lapDistanceTravelled = 0;
        } else {
          this.hasFinished = true;
          this.finishTime = this.totalDistance;
        }
      }
    }
  }

  class AIManager {
    constructor() {
      this.opponents = [];
    }

    createOpponents(trackLength, count = 5) {
      const selectedRivals = AI_RIVALS_CONFIG.slice(0, Math.max(1, Math.min(5, count)));
      this.opponents = selectedRivals.map((cfg, idx) => {
        return new AIOpponent(cfg, idx, trackLength);
      });
      return this.opponents;
    }

    update(dt, player, segments, trafficList, trackLength, difficulty) {
      for (const ai of this.opponents) {
        ai.update(dt, player, segments, trafficList, trackLength, difficulty);
      }
    }

    getOpponents() {
      return this.opponents;
    }
  }

  window.UR = window.UR || {};
  window.UR.AIManager = AIManager;
  window.UR.AIOpponent = AIOpponent;
})();

