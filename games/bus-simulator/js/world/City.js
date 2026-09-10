/**
 * Bus Simulator - World: City
 * Represents a city/town/village with its bus stops and landmarks
 */

(function () {
  'use strict';

  function City(data) {
    this.id = data.id || 'city_' + Math.random().toString(36).substr(2, 9);
    this.name = data.name || 'Unnamed';
    this.region = data.region || 'ap';
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.type = data.type || 'town'; // metropolitan | major | capital | town | village
    this.population = data.population || 50000;
    this.radius = data.radius || 1200;

    this.busStops = data.busStops || [];
    this.poi = data.poi || [];  // points of interest
    this.color = data.color || '#00f0ff';

    this._passengerGenTimer = 0;
    this._passengerGenInterval = 5 + Math.random() * 5;

    this._updateDisplay();
  }

  City.prototype._updateDisplay = function () {
    const typeColors = {
      metropolitan: '#00f0ff',
      capital: '#fbbf24',
      major: '#10b981',
      town: '#60a5fa',
      village: '#a78bfa'
    };
    this.displayColor = typeColors[this.type] || '#60a5fa';

    const typeSizes = {
      metropolitan: 28,
      capital: 24,
      major: 20,
      town: 16,
      village: 12
    };
    this.displaySize = typeSizes[this.type] || 16;
  };

  City.prototype.update = function (dt) {
    this._passengerGenTimer += dt;
  };

  City.prototype.getDisplayName = function () {
    return this.name;
  };

  City.prototype.getTypeLabel = function () {
    const labels = {
      metropolitan: 'Metropolitan',
      capital: 'Capital City',
      major: 'Major City',
      town: 'Town',
      village: 'Village'
    };
    return labels[this.type] || this.type;
  };

  City.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;

    const size = this.displaySize * zoom;

    renderer.context.save();

    // City circle
    renderer.context.fillStyle = this.displayColor;
    renderer.context.globalAlpha = 0.3 + (this.population / 2000000) * 0.4;
    renderer.context.beginPath();
    renderer.context.arc(cx, cy, size, 0, Math.PI * 2);
    renderer.context.fill();

    renderer.context.globalAlpha = 1;
    renderer.context.beginPath();
    renderer.context.arc(cx, cy, size * 0.6, 0, Math.PI * 2);
    renderer.context.fillStyle = this.displayColor;
    renderer.context.fill();

    // City name label
    if (size > 8) {
      renderer.context.font = `${Math.max(8, size * 0.3)}px Inter, sans-serif`;
      renderer.context.fillStyle = '#ffffff';
      renderer.context.textAlign = 'center';
      renderer.context.textBaseline = 'middle';
      renderer.context.fillText(this.name, cx, cy + size + 4);
    }

    renderer.context.restore();
  };

  City.prototype.drawLabel = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;
    const size = this.displaySize * zoom;

    if (size > 8) {
      renderer.context.save();
      renderer.context.font = `${Math.max(10, size * 0.35)}px Inter, sans-serif`;
      renderer.context.fillStyle = 'rgba(255, 255, 255, 0.8)';
      renderer.context.textAlign = 'center';
      renderer.context.textBaseline = 'middle';
      renderer.context.fillText(this.name, cx, cy + size + 6);
      renderer.context.restore();
    }
  };

  City.prototype.serialize = function () {
    return {
      id: this.id,
      name: this.name,
      region: this.region,
      x: this.x,
      y: this.y,
      type: this.type,
      population: this.population,
      radius: this.radius,
      busStops: this.busStops,
      poi: this.poi,
      color: this.color
    };
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.City = City;
  }
  if (typeof module !== 'undefined') {
    module.exports = City;
  }
})();
