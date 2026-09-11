/**
 * Bus Simulator - World: Market Area
 * Small local market with stalls and a covered area
 */

(function () {
  'use strict';

  const EnvironmentObject = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EnvironmentObject) ||
    (typeof require !== 'undefined' ? require('./EnvironmentObject') : null);

  function Market(id, x, y, options) {
    if (EnvironmentObject) {
      EnvironmentObject.call(this, id, 'market', x, y, options);
    } else {
      this.id = id || 'market_' + Math.random().toString(36).substr(2, 9);
      this.x = x; this.y = y;
    }

    this.name = options.name || 'Market';
    this.stallCount = options.stallCount || 8;
  }

  if (EnvironmentObject) {
    Market.prototype = Object.create(EnvironmentObject.prototype);
    Market.prototype.constructor = Market;
  }

  Market.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;
    const s = this.scale * zoom;

    renderer.context.save();
    renderer.context.translate(cx, cy);

    // Central covered area (blue tarp)
    renderer.context.fillStyle = '#0ea5e9';
    renderer.context.globalAlpha = 0.7;
    renderer.context.fillRect(-10 * s, -10 * s, 20 * s, 20 * s);
    renderer.context.globalAlpha = 1;

    // Support columns
    renderer.context.fillStyle = '#8B4513';
    const colPositions = [-8, -4, 0, 4, 8];
    for (const px of colPositions) {
      renderer.context.fillRect(px * s - 0.5 * s, -10 * s, 1 * s, 10 * s);
    }

    // Surrounding stalls (mixed colors)
    const stallColors = ['#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const stalls = [
      { x: -14, y: -8, w: 4, h: 3 },
      { x: 10, y: -8, w: 4, h: 3 },
      { x: -14, y: -3, w: 4, h: 3 },
      { x: 10, y: -3, w: 4, h: 3 },
      { x: -14, y: 2, w: 4, h: 3 },
      { x: 10, y: 2, w: 4, h: 3 },
      { x: -14, y: 7, w: 4, h: 3 },
      { x: 10, y: 7, w: 4, h: 3 }
    ];
    for (let i = 0; i < Math.min(stalls.length, this.stallCount); i++) {
      const st = stalls[i];
      renderer.context.fillStyle = stallColors[i % stallColors.length];
      renderer.context.fillRect(st.x * s, st.y * s, st.w * s, st.h * s);
    }

    // Center name
    renderer.context.fillStyle = '#ffffff';
    renderer.context.font = `${Math.max(6, 8 * s)}px Inter, sans-serif`;
    renderer.context.textAlign = 'center';
    renderer.context.fillText(this.name, 0, -1 * s);

    renderer.context.restore();
  };

  Market.prototype.serialize = function () {
    return {
      id: this.id,
      type: 'market',
      x: this.x,
      y: this.y,
      name: this.name,
      stallCount: this.stallCount
    };
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Market = Market;
  }
  if (typeof module !== 'undefined') {
    module.exports = Market;
  }
})();
