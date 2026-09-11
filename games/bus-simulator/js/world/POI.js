/**
 * Bus Simulator - World: Point of Interest (Toll Gate, Fuel Station, Depot)
 * Shared base for all static world POIs
 */

(function () {
  'use strict';

  function POI(id, type, x, y, options) {
    this.id = id || 'poi_' + Math.random().toString(36).substr(2, 9);
    this.type = type;      // 'toll' | 'fuel' | 'depot' | 'garage'
    this.x = x || 0;
    this.y = y || 0;
    this.name = options.name || type;
    this.active = true;

    this.cost = options.cost || 0;
    this.color = options.color || '#00f0ff';
    this.icon = options.icon || '⚠';
    this.size = options.size || 1.5;

    // Service-specific
    this.fuelCapacity = options.fuelCapacity || 0;
    this.serviceFee = options.serviceFee || 0;
  }

  POI.prototype.update = function (dt) {
    // Static POI, no update needed
  };

  POI.prototype.interact = function (player, callback) {
    // Base interaction - overridden by specific POI types
    if (callback) callback();
  };

  POI.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;
    const size = this.size * zoom;

    renderer.context.save();
    renderer.context.translate(cx, cy);

    const typeColors = {
      toll: '#f59e0b',
      fuel: '#10b981',
      depot: '#8b5cf6',
      garage: '#00f0ff',
      bus_stop: '#fb6568'
    };

    renderer.context.fillStyle = typeColors[this.type] || this.color;
    renderer.context.globalAlpha = 0.3;
    renderer.context.beginPath();
    renderer.context.arc(0, 0, size, 0, Math.PI * 2);
    renderer.context.fill();

    renderer.context.globalAlpha = 1;
    renderer.context.font = `${Math.max(8, size * 0.8)}px monospace`;
    renderer.context.textAlign = 'center';
    renderer.context.textBaseline = 'middle';
    renderer.context.fillText(this.icon, 0, 0);

    renderer.context.restore();
  };

  POI.prototype.serialize = function () {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
      name: this.name,
      cost: this.cost,
      color: this.color,
      size: this.size
    };
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.POI = POI;
  }
  if (typeof module !== 'undefined') {
    module.exports = POI;
  }
})();
