/**
 * Bus Simulator - World: Highway Restaurant
 * Roadside restaurant/dhaba serving meals to travelers
 */

(function () {
  'use strict';

  const EnvironmentObject = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EnvironmentObject) ||
    (typeof require !== 'undefined' ? require('./EnvironmentObject') : null);

  function Restaurant(id, x, y, options) {
    if (EnvironmentObject) {
      EnvironmentObject.call(this, id, 'restaurant', x, y, options);
    } else {
      this.id = id || 'restaurant_' + Math.random().toString(36).substr(2, 9);
      this.x = x; this.y = y;
    }

    this.name = options.name || 'Highway Restaurant';
    this.cuisine = options.cuisine || 'Andhra';
    this.seatingCapacity = options.seatingCapacity || 40;
  }

  if (EnvironmentObject) {
    Restaurant.prototype = Object.create(EnvironmentObject.prototype);
    Restaurant.prototype.constructor = Restaurant;
  }

  Restaurant.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;
    const s = this.scale * zoom;

    renderer.context.save();
    renderer.context.translate(cx, cy);

    // Main building (rectangular with sloped roof)
    renderer.context.fillStyle = '#FCD34D';
    renderer.context.fillRect(-8 * s, -10 * s, 16 * s, 10 * s);

    // Sloped roof (red tiles)
    renderer.context.fillStyle = '#dc2626';
    renderer.context.beginPath();
    renderer.context.moveTo(-8 * s, -10 * s);
    renderer.context.lineTo(0, -14 * s);
    renderer.context.lineTo(8 * s, -10 * s);
    renderer.context.closePath();
    renderer.context.fill();

    // Entrance arch
    renderer.context.strokeStyle = '#8B4513';
    renderer.context.lineWidth = 1.5 * s;
    renderer.context.beginPath();
    renderer.context.arc(0, -2 * s, 2.5 * s, 0, Math.PI);
    renderer.context.stroke();

    // Signboard
    renderer.context.fillStyle = '#fbbf24';
    renderer.context.fillRect(-6 * s, -13 * s, 12 * s, 2 * s);
    renderer.context.fillStyle = '#1e293b';
    renderer.context.font = `${Math.max(5, 7 * s)}px Inter, sans-serif`;
    renderer.context.textAlign = 'center';
    renderer.context.fillText(this.name, 0, -12 * s);

    // Outdoor seating
    renderer.context.fillStyle = '#60a5fa';
    for (let i = -3; i <= 3; i += 3) {
      for (let j = 0; j < 3; j++) {
        renderer.context.beginPath();
        renderer.context.arc(i * 2 * s, -1 * s + j * 2 * s, 1 * s, 0, Math.PI * 2);
        renderer.context.fill();
      }
    }

    renderer.context.restore();
  };

  Restaurant.prototype.serialize = function () {
    return {
      id: this.id,
      type: 'restaurant',
      x: this.x,
      y: this.y,
      name: this.name,
      cuisine: this.cuisine,
      seatingCapacity: this.seatingCapacity
    };
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Restaurant = Restaurant;
  }
  if (typeof module !== 'undefined') {
    module.exports = Restaurant;
  }
})();
