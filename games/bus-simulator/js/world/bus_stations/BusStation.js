/**
 * Bus Simulator - World: Bus Station
 * Major bus station with platforms, entry/exit roads, and parking bays
 */

(function () {
  'use strict';

  const EnvironmentObject = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EnvironmentObject) ||
    (typeof require !== 'undefined' ? require('../landmarks/EnvironmentObject') : null);

  function BusStation(id, x, y, options) {
    if (EnvironmentObject) {
      EnvironmentObject.call(this, id, 'bus_station', x, y, options);
    } else {
      this.id = id || 'station_' + Math.random().toString(36).substr(2, 9);
      this.x = x; this.y = y;
    }

    this.name = options.name || 'Bus Station';
    this.stationType = options.type || 'town'; // major | town | village
    this.platforms = options.platforms || 4;
    this.entryRoad = options.entryRoad || null;
    this.exitRoad = options.exitRoad || null;

    // Platform layout
    this.platformLength = 20;
    this.platformWidth = 6;
    this.platformSpacing = 3;

    // Parking bays
    this.parkingBays = options.parkingBays || Math.min(12, this.platforms * 2);

    // Buildings
    this.buildingWidth = 24;
    this.buildingLength = this.platforms * (this.platformLength + this.platformSpacing) + 6;

    // Spawn points (where the player's bus appears when entering the station)
    this.startPositions = [];
    this._calculateStartPositions();

    // Entry/exit points
    this.entryPoint = { x: x, y: y + this.buildingLength / 2 + 5 };
    this.exitPoint = { x: x, y: y - this.buildingLength / 2 - 5 };
  }

  if (EnvironmentObject) {
    BusStation.prototype = Object.create(EnvironmentObject.prototype);
    BusStation.prototype.constructor = BusStation;
  }

  BusStation.prototype._calculateStartPositions = function () {
    this.startPositions = [];
    const startY = -this.buildingLength / 2 + this.platformLength / 2;
    for (let i = 0; i < this.platforms; i++) {
      this.startPositions.push({
        x: this.x + (i - (this.platforms - 1) / 2) * (this.platformWidth + this.platformSpacing),
        y: this.y + startY + i * (this.platformLength + this.platformSpacing),
        angle: 0
      });
    }
  };

  BusStation.prototype.getNearestPlatform = function (busX, busY) {
    let nearest = null;
    let minDist = Infinity;
    for (const pos of this.startPositions) {
      const dist = Math.sqrt(Math.pow(busX - pos.x, 2) + Math.pow(busY - pos.y, 2));
      if (dist < minDist) {
        minDist = dist;
        nearest = pos;
      }
    }
    return nearest;
  };

  BusStation.prototype.update = function (dt) {
  };

  BusStation.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;
    const s = this.scale * zoom;

    renderer.context.save();
    renderer.context.translate(cx, cy);
    renderer.context.scale(s, s);

    // Station building
    renderer.context.fillStyle = this.stationType === 'major' ? '#60a5fa' : '#94a3b8';
    renderer.context.fillRect(-this.buildingWidth / 2, -this.buildingLength / 2, this.buildingWidth, this.buildingLength);

    // Roof overhang
    renderer.context.fillStyle = '#ef4444';
    renderer.context.globalAlpha = 0.7;
    renderer.context.fillRect(-this.buildingWidth / 2 - 2, -this.buildingLength / 2 - 2, this.buildingWidth + 4, this.buildingLength + 4);
    renderer.context.globalAlpha = 1;

    // Platforms
    renderer.context.fillStyle = '#293548';
    const startY = -this.buildingLength / 2 + 4;
    for (let i = 0; i < this.platforms; i++) {
      const py = startY + i * (this.platformLength + this.platformSpacing);
      const px = -this.platformWidth / 2;
      renderer.context.fillRect(px, py, this.platformWidth, this.platformLength);

      // Platform number
      renderer.context.fillStyle = '#ffffff';
      renderer.context.font = '3px Inter, sans-serif';
      renderer.context.textAlign = 'center';
      renderer.context.fillText(`P${i + 1}`, 0, py + this.platformLength / 2);
      renderer.context.fillStyle = '#293548';
    }

    // Parking bays
    renderer.context.fillStyle = '#1e293b';
    const bayY = this.buildingLength / 2 + 2;
    const baySpacing = 3;
    for (let i = 0; i < this.parkingBays; i++) {
      const bx = -this.buildingWidth / 2 + 2 + (i % 2) * 8;
      const by = bayY + Math.floor(i / 2) * baySpacing;
      if (by > this.buildingLength / 2 + 12) break;
      renderer.context.fillRect(bx, by, 6, 2.5);
    }

    // Roof stripes (Indian flag colors pattern)
    renderer.context.fillStyle = '#138808';
    renderer.context.fillRect(-this.buildingWidth / 2 - 2, -this.buildingLength / 2 - 2, this.buildingWidth + 4, 0.5);
    renderer.context.fillStyle = '#ff0000';
    renderer.context.fillRect(-this.buildingWidth / 2 - 2, -this.buildingLength / 2 - 1, this.buildingWidth + 4, 0.5);

    // Station name
    renderer.context.fillStyle = '#ffffff';
    renderer.context.font = `${Math.max(4, 5 * s)}px Inter, sans-serif`;
    renderer.context.textAlign = 'center';
    renderer.context.fillText(this.name, 0, -this.buildingLength / 2 - 3);
    renderer.context.restore();
  };

  BusStation.prototype.serialize = function () {
    return {
      id: this.id,
      type: 'bus_station',
      x: this.x,
      y: this.y,
      name: this.name,
      stationType: this.stationType,
      platforms: this.platforms,
      entryRoad: this.entryRoad,
      exitRoad: this.exitRoad,
      parkingBays: this.parkingBays
    };
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.BusStation = BusStation;
  }
  if (typeof module !== 'undefined') {
    module.exports = BusStation;
  }
})();
