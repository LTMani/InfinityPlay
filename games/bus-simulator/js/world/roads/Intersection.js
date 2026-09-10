/**
 * Bus Simulator - World: Road Intersection
 * Where multiple roads meet, supporting junction logic for navigation
 */

(function () {
  'use strict';

  function Intersection(id, x, y, options) {
    this.id = id || 'intersection_' + Math.random().toString(36).substr(2, 9);
    this.x = x || 0;
    this.y = y || 0;
    this.name = options.name || 'Intersection';
    this.type = options.type || 'standard'; // standard | roundabout | t_junction | cross
    this.connectedRoads = options.connectedRoads || [];
    this.active = true;

    // Traffic control
    this.hasTrafficLights = options.hasTrafficLights || false;
    this.signalState = 'red'; // red | yellow | green
    this.signalTimer = 0;

    // Visual
    this.radius = options.radius || 8;
    this.surface = options.surface || 'asphalt';

    // Approach direction for each connected road
    this.approaches = [];
    this._buildApproaches();
  }

  Intersection.prototype._buildApproaches = function () {
    // This will be populated by RoadNetwork after roads are connected
  };

  Intersection.prototype.addRoad = function (roadId) {
    if (this.connectedRoads.indexOf(roadId) === -1) {
      this.connectedRoads.push(roadId);
    }
  };

  Intersection.prototype.getConnectedRoads = function () {
    return this.connectedRoads;
  };

  Intersection.prototype.isAt = function (x, y, tolerance) {
    const dist = Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
    return dist <= (tolerance || this.radius);
  };

  Intersection.prototype.update = function (dt) {
    // Traffic light simulation (future use)
    if (this.hasTrafficLights) {
      this.signalTimer += dt;
      if (this.signalTimer > 5 && this.signalState === 'green') {
        this.signalState = 'yellow';
        this.signalTimer = 0;
      } else if (this.signalTimer > 2 && this.signalState === 'yellow') {
        this.signalState = 'red';
        this.signalTimer = 0;
      } else if (this.signalTimer > 8 && this.signalState === 'red') {
        this.signalState = 'green';
        this.signalTimer = 0;
      }
    }
  };

  Intersection.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;
    const radius = this.radius * zoom;

    renderer.context.save();

    // Intersection paving
    renderer.context.fillStyle = this.surface === 'asphalt' ? '#374151' : '#8d7a63';
    renderer.context.globalAlpha = 0.8;
    renderer.context.beginPath();
    renderer.context.arc(cx, cy, radius, 0, Math.PI * 2);
    renderer.context.fill();
    renderer.context.globalAlpha = 1;

    // Traffic lights
    if (this.hasTrafficLights) {
      const lightColors = {
        red: '#ef4444',
        yellow: '#fbbf24',
        green: '#10b981'
      };
      const color = lightColors[this.signalState];
      renderer.context.fillStyle = color;
      renderer.context.beginPath();
      renderer.context.arc(cx + 10, cy - 10, 2, 0, Math.PI * 2);
      renderer.context.fill();
    }

    // Road name label
    if (radius > 6) {
      renderer.context.font = `${Math.max(8, radius * 0.4)}px Inter, sans-serif`;
      renderer.context.fillStyle = '#ffffff';
      renderer.context.textAlign = 'center';
      renderer.context.textBaseline = 'middle';
      renderer.context.fillText(this.name, cx, cy + radius + 6);
    }

    renderer.context.restore();
  };

  Intersection.prototype.serialize = function () {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      name: this.name,
      type: this.type,
      connectedRoads: this.connectedRoads,
      hasTrafficLights: this.hasTrafficLights,
      radius: this.radius,
      surface: this.surface
    };
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Intersection = Intersection;
  }
  if (typeof module !== 'undefined') {
    module.exports = Intersection;
  }
})();
