/**
 * Bus Simulator - World: Fuel Station
 * Petrol pump with fuel dispensers and shop
 */

(function () {
  'use strict';

  const EnvironmentObject = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EnvironmentObject) ||
    (typeof require !== 'undefined' ? require('./EnvironmentObject') : null);

  function FuelStation(id, x, y, options) {
    if (EnvironmentObject) {
      EnvironmentObject.call(this, id, 'fuel', x, y, options);
    } else {
      this.id = id || 'fuel_' + Math.random().toString(36).substr(2, 9);
      this.x = x; this.y = y;
    }

    this.name = options.name || 'Petrol Pump';
    this.fuelCapacity = options.fuelCapacity || 15000;
    this.fuelType = options.fuelType || 'diesel';
    this.pricePerLiter = options.pricePerLiter || 85;
    this.hasShop = options.hasShop !== undefined ? options.hasShop : true;

    this.currentFuel = this.fuelCapacity;
    this.active = true;
  }

  if (EnvironmentObject) {
    FuelStation.prototype = Object.create(EnvironmentObject.prototype);
    FuelStation.prototype.constructor = FuelStation;
  }

  FuelStation.prototype.refuel = function (amount) {
    const taken = Math.min(amount, this.currentFuel);
    this.currentFuel -= taken;
    return taken;
  };

  FuelStation.prototype.restock = function (amount) {
    this.currentFuel = Math.min(this.fuelCapacity, this.currentFuel + amount);
  };

  FuelStation.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;
    const s = this.scale * zoom;

    renderer.context.save();
    renderer.context.translate(cx, cy);

    // Fuel pumps (tall dispensers)
    renderer.context.fillStyle = '#1e293b';
    const pumpWidth = 3 * s;
    const pumpHeight = 12 * s;
    const pumpGap = 5 * s;
    const pumpCount = 4;
    const startX = -(pumpCount * pumpWidth + (pumpCount - 1) * pumpGap) / 2;

    for (let i = 0; i < pumpCount; i++) {
      const px = startX + i * (pumpWidth + pumpGap);
      renderer.context.fillRect(px, -pumpHeight + 4, pumpWidth, pumpHeight - 4);

      // Dispenser screen
      renderer.context.fillStyle = '#00f0ff';
      renderer.context.globalAlpha = 0.4;
      renderer.context.fillRect(px + 0.5 * s, -8 * s, 2 * s, 3 * s);
      renderer.context.globalAlpha = 1;
    }

    // Main shop building
    const shopW = 14 * s;
    const shopH = 10 * s;
    renderer.context.fillStyle = '#f59e0b';
    renderer.context.fillRect(-shopW / 2, -4 * s, shopW, shopH);

    // Shop roof overhang
    renderer.context.fillStyle = '#dc2626';
    renderer.context.fillRect(-shopW / 2 - 2, -4 * s, shopW + 4, 1.5 * s);

    // Brand sign
    renderer.context.fillStyle = '#ffffff';
    renderer.context.font = `${Math.max(7, 10 * s)}px Inter, sans-serif`;
    renderer.context.textAlign = 'center';
    renderer.context.fillText(this.name, 0, -8 * s);

    // Fuel type label
    renderer.context.font = `${Math.max(5, 7 * s)}px Inter, sans-serif`;
    renderer.context.fillStyle = '#cbd5e1';
    renderer.context.fillText(this.fuelType.toUpperCase(), 0, 2 * s);

    renderer.context.restore();
  };

  FuelStation.prototype.serialize = function () {
    return {
      id: this.id,
      type: 'fuel',
      x: this.x,
      y: this.y,
      name: this.name,
      fuelCapacity: this.fuelCapacity,
      fuelType: this.fuelType,
      pricePerLiter: this.pricePerLiter
    };
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.FuelStation = FuelStation;
  }
  if (typeof module !== 'undefined') {
    module.exports = FuelStation;
  }
})();
