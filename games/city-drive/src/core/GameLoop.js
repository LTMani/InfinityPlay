/**
 * GameLoop.js
 * High-precision animation loop using requestAnimationFrame with
 * delta-time clamping and clean system lifecycle order.
 */

export class GameLoop {
  constructor(onUpdate, onRender) {
    this.onUpdate = onUpdate;
    this.onRender = onRender;

    this.isRunning = false;
    this.isPaused = false;

    this.lastTime = 0;
    this.rafId = null;
    this.maxDelta = 0.1; // 100ms clamp prevents physics tunnels on frame drop

    this._loop = this._loop.bind(this);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this._loop);
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.lastTime = performance.now(); // Reset baseline timestamp
  }

  _loop(currentTime) {
    if (!this.isRunning) return;

    this.rafId = requestAnimationFrame(this._loop);

    // Compute delta time in seconds
    let dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Guard against negative, zero, or excessively large delta times
    if (dt <= 0) return;
    if (dt > this.maxDelta) dt = this.maxDelta;

    if (!this.isPaused) {
      // 1. Systems update pipeline
      if (this.onUpdate) {
        this.onUpdate(dt);
      }
    }

    // 2. Render frame
    if (this.onRender) {
      this.onRender();
    }
  }
}

