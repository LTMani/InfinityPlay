/**
 * Bus Simulator - Game Loop System (2)
 * Coordinates the main game loop, state management, and tick timing
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const GameConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig) ||
    (typeof require !== 'undefined' ? require('../config/GameConfig') : null);

  const GameLoopSystem = {
    _state: GameConfig ? GameConfig.states.BOOT : 'boot',
    _gameTime: 0,
    _tickRate: 30,
    _tickAccumulator: 0,
    _frameCount: 0,

     init(modules) {
      this.modules = modules;
      this._state = GameConfig.states.BOOT;
      this._gameTime = 0;
      this._tickAccumulator = 0;
      this._lastPauseKey = false;
    },

    setState(newState) {
      const old = this._state;
      this._state = newState;
      EventManager.emit('gameStateChanged', { old, new: newState });
    },

    getState() {
      return this._state;
    },

    canPlay() {
      return this._state === GameConfig.states.PLAYING;
    },

    update(dt) {
      if (this._state === GameConfig.states.PLAYING ||
          this._state === GameConfig.states.PAUSED) {
        this._gameTime += dt;
        this._tickAccumulator += dt;

        this._frameCount++;

        // Emit game tick event at tick rate
        while (this._tickAccumulator >= 1 / this._tickRate) {
          this._tickAccumulator -= 1 / this._tickRate;
          EventManager.emit('gameTick', { gameTime: this._gameTime });
        }

        EventManager.emit('gameUpdate', { dt, gameTime: this._gameTime });
      }
    },

    getGameTime() {
      return this._gameTime;
    },

    getGameTimeString() {
      const totalSeconds = Math.floor(this._gameTime);
      const hours = Math.floor(totalSeconds / 3600) % 24;
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const seconds = totalSeconds % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },

    destroy() {
      this._state = GameConfig.states.BOOT;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.GameLoopSystem = GameLoopSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = GameLoopSystem;
  }
})();
