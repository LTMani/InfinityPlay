/**
 * Bus Simulator - World: Environment Object
 * Base class for decorative world objects (trees, buildings, roadside structures)
 */

(function () {
  'use strict';

  const POI = (typeof window !== 'undefined' && window.BusSim && window.BusSim.POI) ||
    (typeof require !== 'undefined' ? require('../POI') : null);

  function EnvironmentObject(id, type, x, y, options) {
    if (POI) {
      POI.call(this, id, type, x, y, options);
    } else {
      this.id = id || 'envobj_' + Math.random().toString(36).substr(2, 9);
      this.type = type;
      this.x = x;
      this.y = y;
      this.name = options.name || type;
      this.active = true;
    }

    this.envType = type;
    this.variant = options.variant || 0;
    this.scale = options.scale || 1;
    this.rotation = options.rotation || 0;
  }

  if (POI) {
    EnvironmentObject.prototype = Object.create(POI.prototype);
    EnvironmentObject.prototype.constructor = EnvironmentObject;
  }

  EnvironmentObject.prototype.update = function (dt) {
  };

  EnvironmentObject.prototype.draw = function (renderer, camera) {
    const zoom = camera ? camera.zoom : 1;
    const cx = (this.x - (camera ? camera.x : 0)) * zoom + renderer.width / 2;
    const cy = (this.y - (camera ? camera.y : 0)) * zoom + renderer.height / 2;
    const scale = this.scale * zoom;

    renderer.context.save();
    renderer.context.translate(cx, cy);
    renderer.context.rotate(this.rotation);

    switch (this.envType) {
      case 'coconut_tree':
        this._drawCoconutTree(renderer, scale);
        break;
      case 'palm_tree':
        this._drawPalmTree(renderer, scale);
        break;
      case 'field_paddy':
        this._drawField(renderer, scale, '#8fbc8f', '#4a7c3a');
        break;
      case 'field_cotton':
        this._drawField(renderer, scale, '#f0e68c', '#daa520');
        break;
      case 'field_groundnut':
        this._drawField(renderer, scale, '#cd853f', '#8b4513');
        break;
      case 'field_flowers':
        this._drawField(renderer, scale, '#ff69b4', '#da70d6');
        break;
    }

    renderer.context.restore();
  };

  EnvironmentObject.prototype._drawCoconutTree = function (renderer, scale) {
    // Trunk
    renderer.context.fillStyle = '#8B4513';
    renderer.context.fillRect(-1 * scale, -20 * scale, 2 * scale, 22 * scale);

    // Leaves (coconut fronds)
    renderer.context.fillStyle = '#228B22';
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const len = 12 * scale;
      renderer.context.beginPath();
      renderer.context.moveTo(0, -18 * scale);
      renderer.context.lineTo(Math.cos(angle) * len, Math.sin(angle) * len - 18 * scale);
      renderer.context.lineWidth = 1.5 * scale;
      renderer.context.strokeStyle = '#228B22';
      renderer.context.stroke();
    }

    // Coconut bunch
    renderer.context.fillStyle = '#8B4513';
    renderer.context.beginPath();
    renderer.context.arc(0, -20 * scale, 3 * scale, 0, Math.PI * 2);
    renderer.context.fill();
  };

  EnvironmentObject.prototype._drawPalmTree = function (renderer, scale) {
    // Trunk
    renderer.context.fillStyle = '#8B4513';
    renderer.context.fillRect(-0.8 * scale, -18 * scale, 1.6 * scale, 20 * scale);

    // Palm fronds
    renderer.context.fillStyle = '#228B22';
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      renderer.context.beginPath();
      renderer.context.ellipse(0, -16 * scale, 10 * scale, 2 * scale, angle, 0, Math.PI * 2);
      renderer.context.fill();
    }
  };

  EnvironmentObject.prototype._drawField = function (renderer, scale, color1, color2) {
    const w = 20 * scale;
    const h = 15 * scale;

    renderer.context.fillStyle = color1;
    renderer.context.fillRect(-w / 2, -h / 2, w, h);

    // Field boundary
    renderer.context.strokeStyle = color2;
    renderer.context.lineWidth = 1;
    renderer.context.strokeRect(-w / 2, -h / 2, w, h);

    // Crop rows
    renderer.context.strokeStyle = color2;
    renderer.context.globalAlpha = 0.3;
    for (let i = -w / 2 + 2; i < w / 2; i += 3) {
      renderer.context.beginPath();
      renderer.context.moveTo(i, -h / 2);
      renderer.context.lineTo(i, h / 2);
      renderer.context.stroke();
    }
    renderer.context.globalAlpha = 1;
  };

  EnvironmentObject.prototype.serialize = function () {
    return {
      id: this.id,
      type: this.envType,
      x: this.x,
      y: this.y,
      variant: this.variant,
      scale: this.scale,
      rotation: this.rotation
    };
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.EnvironmentObject = EnvironmentObject;
  }
  if (typeof module !== 'undefined') {
    module.exports = EnvironmentObject;
  }
})();
