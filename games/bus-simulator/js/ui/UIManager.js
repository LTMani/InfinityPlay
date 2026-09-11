/**
 * Bus Simulator - UI Manager
 * Central coordinator for all game UI rendering and layering
 *
 * SKELETON - Layer management implemented, sub-systems as modules
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) || null;

  const UIManager = {
    _layers: {},
    _uiCanvas: null,
    _uiCtx: null,
    _elements: {},
    _activeUI: null,

    init(modules) {
      this.modules = modules;
      this._layers = {};
      this._elements = {};
      this._activeUI = null;

      // Get UI canvas (separate from game canvas)
      if (typeof document !== 'undefined') {
        this._uiCanvas = document.getElementById('ui-canvas');
        if (this._uiCanvas) {
          this._uiCtx = this._uiCanvas.getContext('2d');
        }
      }

      // Register event listeners for state changes
      if (EventManager) {
        const em = EventManager;
        em.on('gameStateChanged', (data) => this._handleStateChange(data));
        em.on('tripCompleted', (data) => this._showTripSummary(data));
        em.on('achievementUnlocked', (data) => this._showAchievementToast(data));
        em.on('busPurchased', (data) => this._showToast(`${data.busName} purchased!`, 'success'));
        em.on('tollPaid', (data) => this._showToast(`Toll: ${data.amount} coins`, 'info'));
        em.on('refuelComplete', (data) => this._showToast(`Refueled: ${data.amount}L (${data.cost} coins)`, 'info'));
      }
    },

    _handleStateChange(data) {
      if (data.new === 'playing') {
        this.hideAll();
      } else if (data.new === 'menu') {
        this.show('menu');
      } else if (data.new === 'garage') {
        this.show('garage');
      }
    },

    registerUI(name, uiModule) {
      this._layers[name] = uiModule;
      if (uiModule && typeof uiModule.init === 'function') {
        uiModule.init(this.modules);
      }
    },

    getUI(name) {
      return this._layers[name];
    },

    show(uiName) {
      this.hideAll();
      this._activeUI = uiName;

      if (this._layers[uiName] && typeof this._layers[uiName].show === 'function') {
        this._layers[uiName].show();
      }
    },

    hide(uiName) {
      if (this._layers[uiName] && typeof this._layers[uiName].hide === 'function') {
        this._layers[uiName].hide();
      }
      if (this._activeUI === uiName) this._activeUI = null;
    },

    hideAll() {
      for (const name in this._layers) {
        if (this._layers[name] && typeof this._layers[name].hide === 'function') {
          this._layers[name].hide();
        }
      }
      this._activeUI = null;
    },

    update(dt) {
      for (const name in this._layers) {
        if (this._layers[name] && typeof this._layers[name].update === 'function') {
          this._layers[name].update(dt);
        }
      }
    },

    render(dt) {
      if (this._activeUI && this._layers[this._activeUI] &&
          typeof this._layers[this._activeUI].render === 'function') {
        this._layers[this._activeUI].render(this._uiCtx, dt);
      }

      const loop = this.modules.GameLoopSystem;
      const config = this.modules.GameConfig || (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig);
      const playingState = config ? config.states.PLAYING : 'playing';
      const pausedState = config ? config.states.PAUSED : 'paused';
      const currentState = loop && loop.getState ? loop.getState() : null;

      if (currentState === playingState || currentState === pausedState) {
        const hud = this._layers['hud'];
        if (hud && typeof hud.render === 'function') {
          hud.render(this._uiCtx, dt);
        }
      }
    },

    _showToast(message, type) {
      const toastSystem = this._layers['notifications'] || this.modules.Helpers;
      if (toastSystem && typeof toastSystem.showNotification === 'function') {
        toastSystem.showNotification(message, type);
      } else if (typeof window !== 'undefined' && window.InfinityPlay &&
                window.InfinityPlay.Helpers && typeof window.InfinityPlay.Helpers.showToast === 'function') {
        window.InfinityPlay.Helpers.showToast(message, type);
      }
    },

    _showTripSummary(tripData) {
      const economyUI = this._layers['economy'];
      if (economyUI && typeof economyUI.showTripSummary === 'function') {
        economyUI.showTripSummary(tripData);
      }
    },

    _showAchievementToast(data) {
      this._showToast(`Achievement Unlocked: ${data.title} (+${data.xp} XP)`, 'success');
    },

    isUIElementVisible(elementId) {
      return this._elements[elementId] ? this._elements[elementId].visible : false;
    },

    showGameOver(stats) {
      this.show('gameover');
      const gameOverUI = this._layers['gameover'];
      if (gameOverUI && typeof gameOverUI.setStats === 'function') {
        gameOverUI.setStats(stats);
      }
    },

    destroy() {
      for (const name in this._layers) {
        if (this._layers[name] && typeof this._layers[name].destroy === 'function') {
          this._layers[name].destroy();
        }
      }
      this._layers = {};
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.UIManager = UIManager;
  }
  if (typeof module !== 'undefined') {
    module.exports = UIManager;
  }
})();
