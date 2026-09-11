/**
 * Bus Simulator - Menu System
 * Main menu, pause menu, and game-over screens
 *
 * SKELETON - Menu structure defined, styling in CSS
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) || null;
  const GameConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig) ||
    (typeof require !== 'undefined' ? require('../config/GameConfig') : null);

  const MenuSystem = {
    _container: null,
    _isVisible: false,
    _currentMenu: 'main',
    _menuStack: [],

    init(modules) {
      this.modules = modules;

      if (typeof document !== 'undefined') {
        this._container = document.getElementById('bus-sim-ui-overlay');
        if (this._container) {
          this._container.style.display = 'none';
        }
      }

      if (EventManager) {
        EventManager.on('gameStateChanged', (data) => {
          if (data.new === GameConfig.states.MENU) {
            this.showMenu('main');
          } else if (data.new === GameConfig.states.PLAYING) {
            this.hide();
          } else if (data.new === GameConfig.states.PAUSED) {
            this.showMenu('pause');
          }
        });
      }
    },

    showMenu(menuName) {
      this._currentMenu = menuName;
      this._menuStack.push(menuName);
      this._renderMenu(menuName);
      this._isVisible = true;

      if (this._container) {
        this._container.style.display = 'block';
      }
    },

    hide() {
      this._isVisible = false;
      this._currentMenu = 'main';
      this._menuStack = [];

      if (this._container) {
        this._container.innerHTML = '';
        this._container.style.display = 'none';
      }
    },

    pushMenu(menuName) {
      this._menuStack.push(this._currentMenu);
      this.showMenu(menuName);
    },

    popMenu() {
      if (this._menuStack.length > 1) {
        this._menuStack.pop();
        this.showMenu(this._menuStack[this._menuStack.length - 1]);
      }
    },

    _renderMenu(menuName) {
      if (!this._container) return;

      this._container.innerHTML = '';

      switch (menuName) {
        case 'main':
          this._renderMainMenu();
          break;
        case 'pause':
          this._renderPauseMenu();
          break;
        case 'garage':
          this._renderGarageMenu();
          break;
        case 'missions':
          this._renderMissionsMenu();
          break;
        case 'settings':
          this._renderSettingsMenu();
          break;
        case 'gameover':
          this._renderGameOverMenu();
          break;
        default:
          this._renderMainMenu();
      }
    },

    _renderMainMenu() {
      this._container.innerHTML = `
        <div class="bus-menu bus-menu-main">
          <div class="bus-menu-title">SOUTH INDIAN BUS SIMULATOR</div>
          <div class="bus-menu-subtitle">Andhra Pradesh & Telangana</div>
          <div class="bus-menu-buttons">
            <button class="bus-btn bus-btn-primary" data-action="start-game">▶ START DRIVING</button>
            <button class="bus-btn" data-action="garage">🚍 MY GARAGE</button>
            <button class="bus-btn" data-action="missions">📋 MISSIONS</button>
            <button class="bus-btn" data-action="settings">⚙ SETTINGS</button>
            <button class="bus-btn bus-btn-danger" data-action="quit">✕ QUIT TO PLATFORM</button>
          </div>
          <div class="bus-menu-footer">Level ${this._getPlayerLevel()} • ⛽ ${this._getPlayerMoney()} coins</div>
        </div>
      `;
      this._bindMenuEvents();
    },

    _renderPauseMenu() {
      this._container.innerHTML = `
        <div class="bus-menu bus-menu-pause">
          <div class="bus-menu-title">PAUSED</div>
          <div class="bus-menu-buttons">
            <button class="bus-btn" data-action="resume">▶ RESUME</button>
            <button class="bus-btn" data-action="garage">🚍 GARAGE</button>
            <button class="bus-btn" data-action="missions">📋 MISSIONS</button>
            <button class="bus-btn" data-action="settings">⚙ SETTINGS</button>
            <button class="bus-btn bus-btn-danger" data-action="quit">✕ QUIT TO PLATFORM</button>
          </div>
        </div>
      `;
      this._bindMenuEvents();
    },

    _renderGarageMenu() {
      this._container.innerHTML = `
        <div class="bus-menu bus-menu-garage">
          <div class="bus-menu-title">MY GARAGE</div>
          <div class="bus-menu-back" data-action="back">← BACK</div>
          <div class="bus-garage-content" id="busGarageContent"></div>
        </div>
      `;
      this._bindMenuEvents();
      this._renderGarageContent();
    },

    _renderMissionsMenu() {
      this._container.innerHTML = `
        <div class="bus-menu bus-menu-missions">
          <div class="bus-menu-title">MISSIONS</div>
          <div class="bus-menu-back" data-action="back">← BACK</div>
          <div class="bus-missions-content" id="busMissionsContent"></div>
        </div>
      `;
      this._bindMenuEvents();
    },

    _renderSettingsMenu() {
      this._container.innerHTML = `
        <div class="bus-menu bus-menu-settings">
          <div class="bus-menu-title">SETTINGS</div>
          <div class="bus-menu-back" data-action="back">← BACK</div>
          <div class="bus-settings-content">
            <div class="bus-setting">
              <span>Volume</span>
              <input type="range" min="0" max="100" value="70" id="settingVolume">
            </div>
            <div class="bus-setting">
              <span>Fullscreen</span>
              <button class="bus-btn" data-action="toggle-fullscreen">Toggle</button>
            </div>
          </div>
        </div>
      `;
      this._bindMenuEvents();
    },

    _renderGameOverMenu() {
      this._container.innerHTML = `
        <div class="bus-menu bus-menu-gameover">
          <div class="bus-menu-title">GAME OVER</div>
          <div class="bus-menu-buttons">
            <button class="bus-btn" data-action="restart">↻ RESTART</button>
            <button class="bus-btn" data-action="main-menu">🏠 MAIN MENU</button>
          </div>
        </div>
      `;
      this._bindMenuEvents();
    },

    _renderGarageContent() {
      const garageUI = this.modules.UIManager ? this.modules.UIManager.getUI('garage') : null;
      if (garageUI && typeof garageUI.renderGarage === 'function') {
        garageUI.renderGarage();
      }
    },

    _bindMenuEvents() {
      if (!this._container) return;

      const buttons = this._container.querySelectorAll('[data-action]');
      for (const btn of buttons) {
        btn.removeEventListener('click', this._handleMenuAction);
        btn.addEventListener('click', this._handleMenuAction.bind(this));
      }
    },

    _handleMenuAction(e) {
      const action = e.currentTarget.getAttribute('data-action');
      if (!action) return;

      switch (action) {
        case 'start-game':
          this._startGame();
          break;
        case 'garage':
          this._showGarage();
          break;
        case 'missions':
          this._showMissions();
          break;
        case 'settings':
          this.showMenu('settings');
          break;
        case 'pause':
          this.showMenu('pause');
          break;
        case 'resume':
          this._resumeGame();
          break;
        case 'toggle-fullscreen':
          this._toggleFullscreen();
          break;
        case 'back':
          this.popMenu();
          break;
        case 'quit':
          this._quitToPlatform();
          break;
        case 'restart':
          this._restartGame();
          break;
        case 'main-menu':
          this._goToMainMenu();
          break;
      }
    },

    _startGame() {
      const garageSystem = this.modules.GarageSystem;
      const activeBus = garageSystem ? garageSystem.getActiveBus() : null;

      if (activeBus) {
        EventManager.emit('selectBus', { bus: activeBus });
      }

      if (EventManager) {
        EventManager.emit('startGame', {});
      } else {
        this.modules.GameEngine.setState(this.modules.GameEngine._config.states.PLAYING);
        this.hide();
      }
    },

    _resumeGame() {
      if (EventManager) {
        EventManager.emit('togglePause', { paused: false });
      } else {
        this.modules.GameEngine.setState(this.modules.GameEngine._config.states.PLAYING);
        this.modules.GameEngine.resume();
        this.hide();
      }
    },

    _quitToPlatform() {
      if (EventManager) {
        EventManager.emit('quitToPlatform', {});
      } else if (typeof window !== 'undefined') {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'busSimExit' }, '*');
        }
        window.location.href = '/';
      }
    },

    _restartGame() {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },

    _goToMainMenu() {
      this.modules.GameEngine.setState(this.modules.GameEngine._config.states.MENU);
      this.showMenu('main');
    },

    _toggleFullscreen() {
      if (typeof document !== 'undefined') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    },

    _getPlayerLevel() {
      const init = this.modules.GameInitSystem;
      const player = init ? init.getPlayer() : null;
      return player ? player.level : 1;
    },

    _getPlayerMoney() {
      const init = this.modules.GameInitSystem;
      const player = init ? init.getPlayer() : null;
      return player ? player.money.toLocaleString() : '0';
    },

    update(dt) {},

    destroy() {
      this._container = null;
      this._menuStack = [];
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.MenuSystem = MenuSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = MenuSystem;
  }
})();
