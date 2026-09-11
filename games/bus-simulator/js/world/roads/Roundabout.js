/**
 * Bus Simulator - World: Roundabout
 * Circular intersection for smooth traffic flow in towns
 */

(function () {
  'use strict';

  const Intersection = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Intersection) ||
    (typeof require !== 'undefined' ? require('./Intersection') : null);

  function Roundabout(id, x, y, options) {
    if (Intersection) {
      Intersection.call(this, id, x, y, {
        ...options,
        type: 'roundabout'
      });
    } else {
      this.id = id || 'roundabout_' + Math.random().toString(36).substr(2, 9);
      this.x = x;
      this.y = y;
      this.type = 'roundabout';
      this.connectedRoads = options.connectingRoads || [];
      this.active = true;
      this.hasTrafficLights = false;
      this.signalState = 'green';
    }

    this.radius = options.radius || 25;
    this.connectingRoads = options.connectingRoads || [];
    this.roadCount = this.connectingRoads.length;

    // Calculate entry angles for each connecting road
    this._entryAngles = [];
    this._calculateEntryAngles();
  }

  if (Intersection) {
    Roundabout.prototype = Object.create(Intersection.prototype);
    Roundabout.prototype.constructor = Roundabout;
  }

  Roundabout.prototype._calculateEntryAngles = function () {
    this._entryAngles = [];
    // Evenly distribute roads around the roundabout
    const angleStep = (Math.PI * 2) / this.roadCount;
    for (let i = 0; i < this.roadCount; i++) {
      this._entryAngles.push({
        roadId: this.connectingRoads[i],
        angle: i * angleStep
      });
    }
  };

  Roundabout.prototype.update = function (dt) {
    // Roundabouts have priority rule (clockwise in India)
    // Vehicles on roundabout have priority
  };

  Roundabout.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;
    const radius = this.radius * zoom;

    renderer.context.save();

    // Outer ring (asphalt)
    renderer.context.fillStyle = '#374151';
    renderer.context.beginPath();
    renderer.context.arc(cx, cy, radius, 0, Math.PI * 2);
    renderer.context.fill();

    // Inner island (green grass)
    const innerRadius = radius * 0.4;
    renderer.context.fillStyle = '#16a34a';
    renderer.context.globalAlpha = 0.7;
    renderer.context.beginPath();
    renderer.context.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    renderer.context.fill();
    renderer.context.globalAlpha = 1;

    // Circulating direction arrow
    renderer.context.strokeStyle = '#ffffff';
    renderer.context.lineWidth = 1;
    renderer.context.setLineDash([2, 4]);
    renderer.context.beginPath();
    renderer.context.arc(cx, cy, radius * 0.7, 0, Math.PI * 1.5);
    renderer.context.stroke();
    renderer.context.setLineDash([]);

    // Entry/exit points (small triangles)
    renderer.context.fillStyle = '#f59e0b';
    for (let i = 0; i < this._entryAngles.length; i++) {
      const angle = this._entryAngles[i].angle;
      const ex = cx + Math.cos(angle) * radius;
      const ey = cy + Math.sin(angle) * radius;
      const ex2 = cx + Math.cos(angle) * (radius + 4);
      const ey2 = cy + Math.sin(angle) * (radius + 4);
      renderer.context.save();
      renderer.context.translate(ex2, ey2);
      renderer.context.rotate(angle);
      renderer.context.beginPath();
      renderer.context.moveTo(-3, -2);
      renderer.context.lineTo(4, 0);
      renderer.context.lineTo(-3, 2);
      renderer.context.closePath();
      renderer.context.fill();
      renderer.context.restore();
    }

    renderer.context.restore();
  };

  Roundabout.prototype.serialize = function () {
    const base = Intersection ? Intersection.prototype.serialize.call(this) : {
      id: this.id, x: this.x, y: this.y, type: this.type,
      connectedRoads: this.connectedRoads
    };
    return {
      ...base,
      radius: this.radius,
      connectingRoads: this.connectingRoads,
      roadCount: this.roadCount
    };
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Roundabout = Roundabout;
  }
  if (typeof module !== 'undefined') {
    module.exports = Roundabout;
  }
})();
