/**
 * Bus Simulator - Game Engine
 * Main game loop manager, state coordinator, and module registry
 */

(function () {
  'use strict';

  const GameEngine = {
    _running: false,
    _paused: false,
    _lastTime: 0,
    _accumulator: 0,
    _dt: 1 / 60,
    _fps: 0,
    _frameCount: 0,
    _fpsTimer: 0,

    _state: 'boot',
    _systems: {},
    _entities: [],
    _modules: {},

    _debug: {
      fps: 0,
      fpsUpdateInterval: 200
    },

    init(config, onReady) {
      this._config = config;
      this._state = config.states.BOOT;

      this.render = this.render.bind(this);
      this._loop = this._loop.bind(this);

      if (onReady) onReady.call(this);
    },

    /**
     * Register a system module.
     * Systems must have: init(data), update(dt), destroy()
     */
    registerSystem(name, system) {
      this._systems[name] = system;
      if (system.init) {
        system.init(this._modules);
      }
      return system;
    },

    getSystem(name) {
      return this._systems[name];
    },

    registerModule(name, module) {
      this._modules[name] = module;
    },

    getModule(name) {
      return this._modules[name];
    },

    addEntity(entity) {
      if (!this._entities.includes(entity)) {
        this._entities.push(entity);
      }
      return entity;
    },

    removeEntity(entity) {
      const idx = this._entities.indexOf(entity);
      if (idx >= 0) {
        this._entities.splice(idx, 1);
      }
    },

    getEntities() {
      return this._entities;
    },

    setState(newState) {
      const oldState = this._state;
      this._state = newState;
      this.emit('stateChanged', { old: oldState, new: newState });
      return oldState;
    },

    getState() {
      return this._state;
    },

    start() {
      if (this._running) return;
      this._running = true;
      this._lastTime = 0;
      this._accumulator = 0;
      requestAnimationFrame(this._loop);
    },

    stop() {
      this._running = false;
    },

    pause() {
      this._paused = true;
    },

    resume() {
      this._paused = false;
    },

    isPaused() {
      return this._paused;
    },

    isRunning() {
      return this._running;
    },

    _loop(timestamp) {
      if (!this._running) return;

      const currentTime = timestamp || 0;

      if (this._lastTime === 0) {
        this._lastTime = currentTime;
      }

      const frameTime = currentTime - this._lastTime;
      this._lastTime = currentTime;

      let dt = frameTime / 1000;
      // Clamp frame time to prevent spiral of death
      if (dt > 0.25) dt = 0.25;

      this._accumulator += dt;

      // Fixed timestep updates (only when not paused)
      if (!this._paused) {
        while (this._accumulator >= this._dt) {
          this._fixedUpdate(this._dt);
          this._accumulator -= this._dt;
        }
      }

      const alpha = this._paused ? 1 : this._accumulator / this._dt;
      this._render(alpha);

      // FPS calculation
      this._frameCount++;
      this._fpsTimer += dt;
      if (this._fpsTimer >= this._debug.fpsUpdateInterval / 1000) {
        this._fps = Math.round(this._frameCount / this._fpsTimer);
        this._frameCount = 0;
        this._fpsTimer = 0;
      }

      requestAnimationFrame(this._loop);
    },

    _fixedUpdate(dt) {
      // Update all systems in registration order
      const keys = Object.keys(this._systems);
      for (let i = 0; i < keys.length; i++) {
        const system = this._systems[keys[i]];
        if (system && system.update) {
          system.update(dt);
        }
      }

      // Update entities
      for (let i = 0; i < this._entities.length; i++) {
        if (this._entities[i].update) {
          this._entities[i].update(dt);
        }
      }

      // Reset frame-based input
      const input = this._modules.InputManager;
      if (input && input.resetFrame) {
        input.resetFrame();
      }

      this.emit('fixedUpdate', dt);
    },

    _render(alpha) {
      this.emit('render', alpha);
    },

    emit(eventName, data) {
      const em = this._modules.EventManager;
      if (em) em.emit(eventName, data);
    },

    on(eventName, callback, context) {
      const em = this._modules.EventManager;
      if (em) em.on(eventName, callback, context);
    },

    getFPS() {
      return this._fps;
    },

    get deltaTime() {
      return this._dt;
    },

    destroy() {
      this._running = false;
      this._entities = [];
      const keys = Object.keys(this._systems);
      for (let i = 0; i < keys.length; i++) {
        if (this._systems[keys[i]].destroy) {
          this._systems[keys[i]].destroy();
        }
      }
      this._systems = {};
      this._modules = {};
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.GameEngine = GameEngine;
  }
  if (typeof module !== 'undefined') {
    module.exports = GameEngine;
  }
})();
