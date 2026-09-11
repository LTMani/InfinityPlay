/**
 * Bus Simulator - World: Toll Gate
 * Highway toll plaza with entry/exit booths
 */

(function () {
  'use strict';

  const EnvironmentObject = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EnvironmentObject) ||
    (typeof require !== 'undefined' ? require('./EnvironmentObject') : null);

  function TollGate(id, x, y, options) {
    if (EnvironmentObject) {
      EnvironmentObject.call(this, id, 'toll', x, y, options);
    } else {
      this.id = id || 'toll_' + Math.random().toString(36).substr(2, 9);
      this.x = x; this.y = y;
    }

    this.name = options.name || 'Toll Plaza';
    this.fee = options.fee || 15;
    this.boothCount = options.boothCount || 3;
    this.laneWidth = 4;

    // Entry and exit points (for navigation)
    this.entryPoint = { x: x, y: y + 30 };
    this.exitPoint = { x: x, y: y - 30 };
  }

  if (EnvironmentObject) {
    TollGate.prototype = Object.create(EnvironmentObject.prototype);
    TollGate.prototype.constructor = TollGate;
  }

  TollGate.prototype.update = function (dt) {
  };

  TollGate.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;
    const scale = this.scale * zoom;

    renderer.context.save();
    renderer.context.translate(cx, cy);

    // Toll building (booth row)
    renderer.context.fillStyle = '#8B4513';
    for (let i = 0; i < this.boothCount; i++) {
      const bx = (i - (this.boothCount - 1) / 2) * (this.laneWidth * scale + 2);
      renderer.context.fillRect(bx - this.laneWidth * scale / 2, -8 * scale, this.laneWidth * scale, 8 * scale);
    }

    // Canopy roof
    renderer.context.fillStyle = '#8b5cf6';
    renderer.context.globalAlpha = 0.8;
    const roofWidth = (this.boothCount * (this.laneWidth * scale + 2)) + 4 * scale;
    renderer.context.fillRect(-roofWidth / 2, -10 * scale, roofWidth, 3 * scale);
    renderer.context.globalAlpha = 1;

    // Toll sign
    renderer.context.fillStyle = '#fbbf24';
    renderer.context.font = `${Math.max(8, 10 * scale)}px Inter, sans-serif`;
    renderer.context.textAlign = 'center';
    renderer.context.fillText('TOLL', 0, -14 * scale);

    // Name sign
    renderer.context.fillStyle = '#ffffff';
    renderer.context.font = `${Math.max(6, 8 * scale)}px Inter, sans-serif`;
    renderer.context.fillText(this.name, 0, 6 * scale);

    renderer.context.restore();
  };

  TollGate.prototype.serialize = function () {
    return {
      id: this.id,
      type: 'toll',
      x: this.x,
      y: this.y,
      name: this.name,
      fee: this.fee,
      boothCount: this.boothCount
    };
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.TollGate = TollGate;
  }
  if (typeof module !== 'undefined') {
    module.exports = TollGate;
  }
})();
