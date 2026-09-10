/**
 * Bus Simulator - World: Road Network
 * Represents a road segment between two points with lane logic
 */

(function () {
  'use strict';

  function Road(id, x1, y1, x2, y2, options) {
    this.id = id || 'road_' + Math.random().toString(36).substr(2, 9);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.width = options.width || 20;
    this.lanes = options.lanes || 2;
    this.laneWidth = this.width / this.lanes;
    this.roadType = options.roadType || 'highway'; // highway | city | village
    this.surface = options.surface || 'asphalt';
    this.speedLimit = options.speedLimit || (this.roadType === 'highway' ? 80 : 40);

    this.connections = options.connections || [];
    this.nodes = this._generateNodes();
  }

  Road.prototype._generateNodes = function () {
    const nodes = [];
    const steps = Math.max(2, Math.ceil(this.getDistance() / 20));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      nodes.push({
        x: this.x1 + (this.x2 - this.x1) * t,
        y: this.y1 + (this.y2 - this.y1) * t,
        t: t
      });
    }
    return nodes;
  };

  Road.prototype.getDistance = function () {
    return Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2));
  };

  Road.prototype.getDirection = function () {
    return Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
  };

  Road.prototype.getMidpoint = function () {
    return {
      x: (this.x1 + this.x2) / 2,
      y: (this.y1 + this.y2) / 2
    };
  };

  Road.prototype.getWidthAt = function (t) {
    return this.width;
  };

  Road.prototype.getNearestPoint = function (px, py) {
    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return { x: this.x1, y: this.y1, t: 0 };

    const t = Math.max(0, Math.min(1, ((px - this.x1) * dx + (py - this.y1) * dy) / lenSq));
    return {
      x: this.x1 + t * dx,
      y: this.y1 + t * dy,
      t: t
    };
  };

  Road.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx1 = (this.x1 - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy1 = (this.y1 - (camera ? camera.y : 0)) * zoom + renderer.height / 2;
    const cx2 = (this.x2 - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy2 = (this.y2 - (camera ? camera.y : 0)) * zoom + renderer.height / 2;

    const w = this.width * zoom;

    renderer.context.save();

    // Road fill
    renderer.context.strokeStyle = this.roadType === 'highway' ? '#293548' : '#374151';
    renderer.context.lineWidth = w;
    renderer.context.lineCap = 'round';
    renderer.context.beginPath();
    renderer.context.moveTo(cx1, cy1);
    renderer.context.lineTo(cx2, cy2);
    renderer.context.stroke();

    // Road markings (dashed center line)
    if (this.lanes >= 2) {
      renderer.context.strokeStyle = '#fbbf24';
      renderer.context.lineWidth = Math.max(1, w * 0.02);
      renderer.context.setLineDash([w * 0.3, w * 0.25]);
      renderer.context.lineCap = 'round';
      renderer.context.beginPath();
      renderer.context.moveTo(cx1, cy1);
      renderer.context.lineTo(cx2, cy2);
      renderer.context.stroke();
      renderer.context.setLineDash([]);
    }

    renderer.context.restore();
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Road = Road;
  }
  if (typeof module !== 'undefined') {
    module.exports = Road;
  }
})();
