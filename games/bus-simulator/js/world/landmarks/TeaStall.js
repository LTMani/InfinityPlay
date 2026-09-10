/**
 * Bus Simulator - World: Tea Stall
 * Small roadside tea/dosa stall common along Indian highways
 */

(function () {
  'use strict';

  const EnvironmentObject = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EnvironmentObject) ||
    (typeof require !== 'undefined' ? require('./EnvironmentObject') : null);

  function TeaStall(id, x, y, options) {
    if (EnvironmentObject) {
      EnvironmentObject.call(this, id, 'tea_stall', x, y, options);
    } else {
      this.id = id || 'teastall_' + Math.random().toString(36).substr(2, 9);
      this.x = x; this.y = y;
    }

    this.name = options.name || 'Tea Stall';
    this.specialty = options.specialty || 'Tea';
    this.hasSeating = options.hasSeating !== undefined ? options.hasSeating : true;
  }

  if (EnvironmentObject) {
    TeaStall.prototype = Object.create(EnvironmentObject.prototype);
    TeaStall.prototype.constructor = TeaStall;
  }

  TeaStall.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;
    const s = this.scale * zoom;

    renderer.context.save();
    renderer.context.translate(cx, cy);

    // Stall canopy (blue tarp)
    renderer.context.fillStyle = '#0ea5e9';
    renderer.context.globalAlpha = 0.8;
    renderer.context.fillRect(-6 * s, -8 * s, 12 * s, 6 * s);
    renderer.context.globalAlpha = 1;

    // Stall counter (wood)
    renderer.context.fillStyle = '#8B451B';
    renderer.context.fillRect(-5 * s, -3 * s, 10 * s, 4 * s);

    // Signboard
    renderer.context.fillStyle = '#fbbf24';
    renderer.context.fillRect(-6 * s, -10 * s, 12 * s, 2 * s);

    // Sign text
    renderer.context.fillStyle = '#1e293b';
    renderer.context.font = `${Math.max(5, 7 * s)}px Inter, sans-serif`;
    renderer.context.textAlign = 'center';
    renderer.context.fillText(this.name, 0, -9 * s);

    // Specialty text
    renderer.context.fillStyle = '#ffffff';
    renderer.context.font = `${Math.max(4, 6 * s)}px Inter, sans-serif`;
    renderer.context.fillText(this.specialty, 0, -1 * s);

    // Seating (plastic stools)
    if (this.hasSeating) {
      renderer.context.fillStyle = '#60a5fa';
      for (let i = -2; i <= 2; i += 2) {
        renderer.context.beginPath();
        renderer.context.arc(i * 2 * s, 2 * s, 1 * s, 0, Math.PI * 2);
        renderer.context.fill();
      }
    }

    renderer.context.restore();
  };

  TeaStall.prototype.serialize = function () {
    return {
      id: this.id,
      type: 'tea_stall',
      x: this.x,
      y: this.y,
      name: this.name,
      specialty: this.specialty
    };
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.TeaStall = TeaStall;
  }
  if (typeof module !== 'undefined') {
    module.exports = TeaStall;
  }
})();
