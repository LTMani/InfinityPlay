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
    // Phase 10B Task 17: signal phase advancement is owned exclusively by
    // TrafficSignalSystem. Intersection is now a passive data holder for
    // hasTrafficLights / signalState / signalTimer and does NOT advance
    // its own phase here. Map.update() still calls this method for non-
    // signal work (if any) but never mutates signalState/signalTimer.
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
      signalState: this.signalState,
      signalTimer: this.signalTimer,
      radius: this.radius,
      surface: this.surface
    };
  };

  // Phase 10B Task 17: restore signal state from serialized data.
  // Backward compatible — saves without signalState/signalTimer keep the
  // default (red / 0) without corrupting.
  Intersection.prototype.deserialize = function (data) {
    if (!data) return;
    if (typeof data.id === 'string') this.id = data.id;
    if (typeof data.x === 'number') this.x = data.x;
    if (typeof data.y === 'number') this.y = data.y;
    if (typeof data.name === 'string') this.name = data.name;
    if (typeof data.type === 'string') this.type = data.type;
    if (Array.isArray(data.connectedRoads)) this.connectedRoads = data.connectedRoads;
    if (typeof data.hasTrafficLights === 'boolean') this.hasTrafficLights = data.hasTrafficLights;
    if (typeof data.radius === 'number') this.radius = data.radius;
    if (typeof data.surface === 'string') this.surface = data.surface;
    // Signal state is restored defensively: unknown values fall back to red.
    if (data.signalState === 'red' || data.signalState === 'yellow' || data.signalState === 'green') {
      this.signalState = data.signalState;
    } else {
      this.signalState = 'red';
    }
    if (typeof data.signalTimer === 'number' && isFinite(data.signalTimer) && data.signalTimer >= 0) {
      this.signalTimer = data.signalTimer;
    } else {
      this.signalTimer = 0;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Intersection = Intersection;
  }
  if (typeof module !== 'undefined') {
    module.exports = Intersection;
  }
})();
