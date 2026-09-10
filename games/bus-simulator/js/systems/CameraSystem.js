/**
 * Bus Simulator - Camera System (8)
 * Follows the player's bus with configurable zoom and offset
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const GameConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig) ||
    (typeof require !== 'undefined' ? require('../config/GameConfig') : null);

  const CameraSystem = {
    x: 0,
    y: 0,
    zoom: 1.2,
    minZoom: 0.6,
    maxZoom: 2.5,
    targetZoom: 1.2,
    followSpeed: 3.0,
    offsetX: 100,    // slight lead in direction of travel
    offsetY: 80,     // look ahead

    _target: { x: 0, y: 0 },
    _shaking: false,
    _shakeIntensity: 0,
    _shakeDuration: 0,

    init(modules) {
      this.modules = modules;
      const em = EventManager;

      em.on('cameraShake', (data) => {
        this.shake(data.intensity || 10, data.duration || 0.5);
      });

      em.on('cameraZoomTo', (data) => {
        this.zoomTo(data.zoom, data.duration || 1);
      });
    },

    update(dt) {
      if (this.modules && this.modules.GameInitSystem) {
        const bus = this.modules.GameInitSystem.getActiveBus();
        if (bus) {
          this.follow(bus, dt);
        }
      }
    },

    follow(target, dt) {
      if (!target) return;

      // Calculate target position (behind and above the bus)
      const lookAheadX = Math.sin(target.angle) * this.offsetX;
      const lookAheadY = -Math.cos(target.angle) * this.offsetY;

      this._target.x = target.x + lookAheadX;
      this._target.y = target.y + lookAheadY;

      // Smooth follow
      this.x += (this._target.x - this.x) * this.followSpeed * dt;
      this.y += (this._target.y - this.y) * this.followSpeed * dt;

      // Apply zoom interpolation
      this.zoom += (this.targetZoom - this.zoom) * 5 * dt;

      // Screen shake effect
      if (this._shaking) {
        const offset = (Math.random() - 0.5) * this._shakeIntensity;
        this.x += offset;
        this.y += offset;
        this._shakeDuration -= dt;
        if (this._shakeDuration <= 0) {
          this._shaking = false;
        }
      }
    },

    shake(intensity, duration) {
      this._shaking = true;
      this._shakeIntensity = intensity;
      this._shakeDuration = duration;
    },

    zoomTo(targetZoom, duration) {
      this.targetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, targetZoom));
    },

    zoomIn() {
      this.targetZoom = Math.min(this.maxZoom, this.targetZoom + 0.2);
    },

    zoomOut() {
      this.targetZoom = Math.max(this.minZoom, this.targetZoom - 0.2);
    },

    setZoom(zoom) {
      this.zoom = zoom;
      this.targetZoom = zoom;
    },

    toScreen(x, y) {
      const renderer = this.modules && this.modules.Renderer;
      if (!renderer) return { x, y };
      return {
        x: x - this.x + renderer.width / 2,
        y: y - this.y + renderer.height / 2
      };
    },

    getCameraObject() {
      return {
        x: this.x,
        y: this.y,
        zoom: this.zoom
      };
    },

    update(dt) {
      // Camera is updated via follow() in MovementSystem
    },

    destroy() {
      this._shaking = false;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.CameraSystem = CameraSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = CameraSystem;
  }
})();
