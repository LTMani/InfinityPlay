/**
 * Bus Simulator - Renderer
 * Canvas drawing abstraction layer
 */

(function () {
  'use strict';

  const Renderer = {
    _canvas: null,
    _ctx: null,
    _width: 0,
    _height: 0,
    _camera: { x: 0, y: 0, zoom: 1 },
    _fontCache: {},

    init(canvas, width, height) {
      this._canvas = canvas;
      this._ctx = canvas.getContext('2d');
      this._width = width;
      this._height = height;
      canvas.width = width;
      canvas.height = height;

      this._ctx.imageSmoothingEnabled = true;
      this._fontCache = {};
    },

    get context() {
      return this._ctx;
    },

    get canvas() {
      return this._canvas;
    },

    get width() {
      return this._width;
    },

    get height() {
      return this._height;
    },

    setCamera(x, y, zoom) {
      this._camera.x = x;
      this._camera.y = y;
      if (zoom !== undefined) this._camera.zoom = zoom;
    },

    getCamera() {
      return { x: this._camera.x, y: this._camera.y, zoom: this._camera.zoom };
    },

    cameraPos() {
      return this._camera;
    },

    applyCamera() {
      const s = this._camera.zoom;
      this._ctx.setTransform(s, 0, 0, s, -this._camera.x * s + this._width / 2, -this._camera.y * s + this._height / 2);
    },

    resetTransform() {
      this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    },

    clear() {
      this._ctx.clearRect(0, 0, this._width, this._height);
    },

    clearRect(r, g, b, a) {
      this._ctx.fillStyle = `rgba(${r},${g},${b},${a || 1})`;
      this._ctx.fillRect(0, 0, this._width, this._height);
    },

    fillRect(x, y, w, h, color) {
      this._ctx.fillStyle = color;
      this._ctx.fillRect(x, y, w, h);
    },

    strokeRect(x, y, w, h, color, lineWidth) {
      this._ctx.strokeStyle = color;
      this._ctx.lineWidth = lineWidth || 1;
      this._ctx.strokeRect(x, y, w, h);
    },

    fillCircle(cx, cy, radius, color) {
      this._ctx.fillStyle = color;
      this._ctx.beginPath();
      this._ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      this._ctx.fill();
    },

    strokeCircle(cx, cy, radius, color, lineWidth) {
      this._ctx.strokeStyle = color;
      this._ctx.lineWidth = lineWidth || 1;
      this._ctx.beginPath();
      this._ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      this._ctx.stroke();
    },

    drawLine(x1, y1, x2, y2, color, lineWidth, dash) {
      this._ctx.strokeStyle = color;
      this._ctx.lineWidth = lineWidth || 1;
      if (dash) this._ctx.setLineDash(dash);
      else this._ctx.setLineDash([]);

      this._ctx.beginPath();
      this._ctx.moveTo(x1, y1);
      this._ctx.lineTo(x2, y2);
      this._ctx.stroke();
    },

    drawPolygon(points, color, stroke) {
      if (!points || points.length === 0) return;
      this._ctx.beginPath();
      this._ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        this._ctx.lineTo(points[i].x, points[i].y);
      }
      this._ctx.closePath();

      if (color) {
        this._ctx.fillStyle = color;
        this._ctx.fill();
      }
      if (stroke) {
        this._ctx.strokeStyle = stroke;
        this._ctx.lineWidth = 1;
        this._ctx.stroke();
      }
    },

    drawRotatedRect(x, y, w, h, angle, color, strokeColor) {
      this._ctx.save();
      this._ctx.translate(x + w / 2, y + h / 2);
      this._ctx.rotate(angle);
      if (color) {
        this._ctx.fillStyle = color;
        this._ctx.fillRect(-w / 2, -h / 2, w, h);
      }
      if (strokeColor) {
        this._ctx.strokeStyle = strokeColor;
        this._ctx.lineWidth = 1;
        this._ctx.strokeRect(-w / 2, -h / 2, w, h);
      }
      this._ctx.restore();
    },

    drawSprite(image, x, y, w, h, angle) {
      if (!image) return;
      this._ctx.save();
      if (angle) {
        this._ctx.translate(x + w / 2, y + h / 2);
        this._ctx.rotate(angle);
        this._ctx.drawImage(image, -w / 2, -h / 2, w, h);
      } else {
        this._ctx.drawImage(image, x, y, w, h);
      }
      this._ctx.restore();
    },

    drawText(text, x, y, options) {
      options = options || {};
      const fontKey = `${options.size || 16}px ${options.family || 'Inter, sans-serif'}`;
      if (this._fontCache[fontKey] !== fontKey) {
        this._ctx.font = fontKey;
      } else {
        this._ctx.font = fontKey;
      }
      this._ctx.textAlign = options.align || 'left';
      this._ctx.textBaseline = options.baseline || 'top';
      this._ctx.fillStyle = options.color || '#ffffff';
      this._ctx.fillText(text, x, y);
      if (options.stroke) {
        this._ctx.strokeStyle = options.stroke;
        this._ctx.lineWidth = options.strokeWidth || 2;
        this._ctx.strokeText(text, x, y);
      }
    },

    measureText(text, fontSize) {
      this._ctx.font = `${fontSize || 16}px Inter, sans-serif`;
      return this._ctx.measureText(text).width;
    },

    setGlobalAlpha(alpha) {
      this._ctx.globalAlpha = alpha;
    },

    resetAlpha() {
      this._ctx.globalAlpha = 1;
    },

    save() {
      this._ctx.save();
    },

    restore() {
      this._ctx.restore();
    },

    translate(x, y) {
      this._ctx.translate(x, y);
    },

    rotate(angle) {
      this._ctx.rotate(angle);
    },

    scale(sx, sy) {
      this._ctx.scale(sx, sy);
    },

    createLinearGradient(x0, y0, x1, y1, stops) {
      const grad = this._ctx.createLinearGradient(x0, y0, x1, y1);
      stops.forEach(stop => {
        grad.addColorStop(stop.offset, stop.color);
      });
      return grad;
    },

    createRadialGradient(x0, y0, r0, x1, y1, r1, stops) {
      const grad = this._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
      stops.forEach(stop => {
        grad.addColorStop(stop.offset, stop.color);
      });
      return grad;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.Renderer = Renderer;
  }
  if (typeof module !== 'undefined') {
    module.exports = Renderer;
  }
})();
