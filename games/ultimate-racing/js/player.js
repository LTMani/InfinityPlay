/**
 * InfinityPlay Ultimate Racing - Player Entity
 * Manages player state, car specs, lap timing, and scoring
 */

(function() {
  class Player {
    constructor() {
      this.resetAll();
    }

    resetAll() {
      this.x = 0;         // -1.0 (left edge of road) to 1.0 (right edge)
      this.y = 0;         // Elevation offset
      this.z = 0;         // Distance along track
      this.speed = 0;     // Current world velocity

      this.carData = null;
      this.upgrades = null;
      this.effectiveStats = null;

      this.nitroMeter = 100;
      this.isNitroActive = false;
      this.nitroBurnCount = 0; // cumulative seconds used for achievements

      this.isDrifting = false;
      this.driftAngle = 0;
      this.driftDuration = 0;
      this.currentDriftScore = 0;
      this.totalDriftScore = 0;
      this.bestSingleDrift = 0;

      this.isOffRoad = false;
      this.collisionCooldown = 0;
      this.stumbleTimer = 0;

      // Race timing, checkpoints, and laps
      this.lap = 1;
      this.maxLaps = 3;
      this.currentCheckpoint = 0;
      this.totalCheckpoints = 3;
      this.checkpointsPassed = [false, false, false];
      this.finishLineArmed = false;
      this.lapDistanceTravelled = 0;
      this.prevZ = 0;
      this.lastFinishCrossingZ = -1000;
      this.hasFinished = false;
      this.finishTime = null;
      this.raceTime = 0;
      this.currentLapTime = 0;
      this.bestLapTime = null;
      this.lapTimes = [];
      this.position = 1; // 1 to 6

      this.perfectLapCandidate = true;
      this.totalDistanceTravelled = 0; // in km
    }

    setupCar(carData, upgrades) {
      this.carData = carData;
      this.upgrades = upgrades;
      this.effectiveStats = window.UR.physics.computeCarStats(carData, upgrades);
      this.speed = 0;
      this.nitroMeter = 100;
      this.isNitroActive = false;
      this.isDrifting = false;
    }

    resetPosition(segmentIndex = null, trackLength = null) {
      this.x = 0;
      this.speed = 0;
      this.steeringAngle = 0;
      this.isDrifting = false;
      this.driftAngle = 0;
      this.currentDriftScore = 0;
      this.isNitroActive = false;
      if (segmentIndex !== null && trackLength !== null) {
        const lapOffset = (this.lap - 1) * trackLength;
        this.z = lapOffset + segmentIndex * 200;
        this.prevZ = this.z;
      }
    }

    getSpeedKmH() {
      if (!this.effectiveStats) return 0;
      const ratio = this.speed / this.effectiveStats.maxSpeed;
      return Math.max(0, Math.round(ratio * this.effectiveStats.displayTopSpeedKmH));
    }

    getSpeedRatio() {
      if (!this.effectiveStats) return 0;
      return Math.min(1.2, this.speed / this.effectiveStats.maxSpeed);
    }
  }

  window.UR = window.UR || {};
  window.UR.Player = Player;
})();

