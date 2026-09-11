/**
 * Bus Simulator - World: Bus Stop
 * A location where passengers wait and buses pick them up
 */

(function () {
  'use strict';

  const Passenger = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Passenger) ||
    (typeof require !== 'undefined' ? require('../entities/Passenger') : null);

  function BusStop(id, x, y, options) {
    this.id = id || 'stop_' + Math.random().toString(36).substr(2, 9);
    this.x = x || 0;
    this.y = y || 0;
    this.name = options.name || 'Bus Stop';
    this.cityId = options.cityId || null;
    this.routeIds = options.routeIds || [];
    this.isActive = options.isActive !== false;

    this.passengers = [];  // Passenger objects waiting here
    this.maxQueue = 30;
    this.spawnInterval = options.spawnInterval || 10; // seconds between spawns
    this._spawnTimer = 0;

    this.shelter = options.shelter || false;
    this.bench = options.bench !== false;
    this.sign = options.sign || true;

    this.color = '#00f0ff';
    this.size = 2;

    // Stop zones for precise boarding/detection
    this.boardingZoneRadius = options.boardingZoneRadius || 30;
    this.stopZoneLength = options.stopZoneLength || 20;
    this.stopZoneWidth = options.stopZoneWidth || 15;
    this.facingAngle = options.facingAngle || null; // Direction bus should face when stopped

    // Destination distribution map (stopId -> probability)
    this.destinationDistribution = options.destinationDistribution || {};
  }

  BusStop.prototype.update = function (dt) {
    if (!this.isActive) return;

    // Spawn passengers
    this._spawnTimer += dt;
    if (this._spawnTimer >= this.spawnInterval && this.passengers.length < this.maxQueue) {
      this.spawnPassenger();
      this._spawnTimer = 0;
    }

    // Update passengers
    for (let i = this.passengers.length - 1; i >= 0; i--) {
      this.passengers[i].update(dt);
      if (!this.passengers[i].active) {
        this.passengers.splice(i, 1);
      }
    }
  };

  BusStop.prototype.spawnPassenger = function () {
    if (Passenger) {
      const p = new Passenger(this.x, this.y + (Math.random() - 0.5) * 2);
      this.passengers.push(p);
    }
  };

  BusStop.prototype.addPassenger = function (passenger) {
    if (this.passengers.length < this.maxQueue) {
      this.passengers.push(passenger);
    }
  };

  BusStop.prototype.removePassenger = function (passenger) {
    const idx = this.passengers.indexOf(passenger);
    if (idx >= 0) {
      this.passengers.splice(idx, 1);
      return true;
    }
    return false;
  };

  BusStop.prototype.getWaitingCount = function () {
    return this.passengers.filter(p => p.state === 'waiting').length;
  };

  BusStop.prototype.embarkPassengers = function (bus, maxCount) {
    const count = Math.min(maxCount, this.passengers.length,
      bus.passengerCapacity - bus.passengersOnBoard);
    const embarked = [];
    for (let i = 0; i < count; i++) {
      const p = this.passengers.shift();
      if (p) {
        p.state = 'boarding';
        p.boardingProgress = 0;
        bus.passengersOnBoard++;
        embarked.push(p);
      }
    }
    return embarked.length;
  };

  BusStop.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;

    renderer.context.save();
    renderer.context.translate(cx, cy);

    const size = this.size * zoom;

    // Bus stop shelter
    if (this.shelter) {
      renderer.context.fillStyle = 'rgba(56, 189, 248, 0.3)';
      renderer.context.fillRect(-size, -size * 0.5, size * 2, size * 0.5);
      renderer.context.strokeStyle = this.color;
      renderer.context.lineWidth = Math.max(1, zoom * 0.5);
      renderer.context.strokeRect(-size, -size * 0.5, size * 2, size * 0.5);
    }

    // Sign
    if (this.sign) {
      renderer.context.fillStyle = this.color;
      renderer.context.beginPath();
      renderer.context.moveTo(0, -size * 0.5);
      renderer.context.lineTo(0, -size * 1.5);
      renderer.context.lineTo(size * 0.8, -size * 1.5);
      renderer.context.closePath();
      renderer.context.fill();
    }

    // Bench
    if (this.bench) {
      renderer.context.fillStyle = 'rgba(26, 31, 47, 0.8)';
      renderer.context.fillRect(-size, size * 0.3, size * 2, size * 0.3);
    }

    // Waiting passengers
    for (let i = 0; i < Math.min(this.passengers.length, 8); i++) {
      const p = this.passengers[i];
      renderer.context.fillStyle = p.gender === 'male' ? '#3b82f6' : '#ec4899';
      renderer.context.beginPath();
      renderer.context.arc(
        (i - 3.5) * size * 0.4,
        size * 0.5,
        Math.max(1.5, size * 0.25),
        0, Math.PI * 2
      );
      renderer.context.fill();
    }

    renderer.context.restore();
  };

  BusStop.prototype.getBoardingZone = function () {
    return {
      x: this.x,
      y: this.y,
      radius: this.boardingZoneRadius
    };
  };

  BusStop.prototype.canBoardAt = function (busX, busY, busAngle, tolerance) {
    const dist = Math.sqrt(Math.pow(busX - this.x, 2) + Math.pow(busY - this.y, 2));
    if (dist > (tolerance || this.boardingZoneRadius)) return false;

    if (this.facingAngle !== null) {
      let angleDiff = Math.abs(busAngle - this.facingAngle);
      angleDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff);
      if (angleDiff > (tolerance || 0.5)) return false;
    }

    return true;
  };

  BusStop.prototype.getRandomDestination = function (allStops, excludeSelf) {
    if (!this.destinationDistribution || Object.keys(this.destinationDistribution).length === 0) {
      // Fallback: pick random stop from all stops
      const candidates = excludeSelf ? allStops.filter(s => s.id !== this.id) : allStops;
      if (candidates.length === 0) return null;
      return candidates[Math.floor(Math.random() * candidates.length)].id;
    }

    const roll = Math.random();
    let cumulative = 0;
    const entries = Object.entries(this.destinationDistribution);
    for (const [destId, prob] of entries) {
      cumulative += prob;
      if (roll <= cumulative) {
        return destId;
      }
    }

    // Fallback
    const candidates = excludeSelf ? allStops.filter(s => s.id !== this.id) : allStops;
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)].id;
  };

  BusStop.prototype.serialize = function () {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      name: this.name,
      cityId: this.cityId,
      routeIds: this.routeIds,
      isActive: this.isActive,
      shelter: this.shelter,
      bench: this.bench,
      sign: this.sign,
      boardingZoneRadius: this.boardingZoneRadius,
      stopZoneLength: this.stopZoneLength,
      stopZoneWidth: this.stopZoneWidth,
      facingAngle: this.facingAngle,
      destinationDistribution: this.destinationDistribution
    };
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.BusStop = BusStop;
  }
  if (typeof module !== 'undefined') {
    module.exports = BusStop;
  }
})();
