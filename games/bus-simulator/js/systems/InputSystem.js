/**
 * Bus Simulator - Input System (3)
 * Processes keyboard/mouse input into game actions
 */

(function () {
  'use strict';

  const InputManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.InputManager) ||
    (typeof require !== 'undefined' ? require('../engine/InputManager') : null);
  const ControlsConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.ControlsConfig) ||
    (typeof require !== 'undefined' ? require('../config/ControlsConfig') : null);
  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);

  const InputSystem = {
    _actions: {},

    init(modules) {
      this.modules = modules;
      this._actions = {};

      if (InputManager && InputManager.init) {
        InputManager.init(modules.Renderer ? modules.Renderer.canvas : null);
      }

      this._bindWindowEvents();
    },

    _bindWindowEvents() {
      if (typeof window === 'undefined') return;

      window.addEventListener('keydown', (e) => {
        this._handleKey(e.code, true);
      });
      window.addEventListener('keyup', (e) => {
        this._handleKey(e.code, false);
      });
    },

    _handleKey(code, isDown) {
      if (isDown) {
        this._actions._justPressed = this._actions._justPressed || {};
        this._actions._justPressed[code] = true;
      }
    },

    /** Returns normalized action values [-1, 1] or 0/1 */
    getAction(actionName) {
      if (!ControlsConfig || !InputManager) return 0;

      const keys = ControlsConfig.getActionKeys(actionName);

      switch (actionName) {
        case 'accelerate':
          return (InputManager.isKeyDown(ControlsConfig.accelerate) ||
                  (ControlsConfig.accelerateAlt && InputManager.isKeyDown(ControlsConfig.accelerateAlt))) ? 1 : 0;
        case 'brake':
          return (InputManager.isKeyDown(ControlsConfig.brake) ||
                  (ControlsConfig.brakeAlt && InputManager.isKeyDown(ControlsConfig.brakeAlt))) ? 1 : 0;
        case 'steerLeft':
          return (InputManager.isKeyDown(ControlsConfig.steerLeft) ||
                  (ControlsConfig.steerLeftAlt && InputManager.isKeyDown(ControlsConfig.steerLeftAlt))) ? 1 : 0;
        case 'steerRight':
          return (InputManager.isKeyDown(ControlsConfig.steerRight) ||
                  (ControlsConfig.steerRightAlt && InputManager.isKeyDown(ControlsConfig.steerRightAlt))) ? 1 : 0;
        case 'handbrake':
          return InputManager.isKeyDown(ControlsConfig.handbrake) ? 1 : 0;
        case 'pause':
          return InputManager.isKeyJustPressed(ControlsConfig.pause) ? 1 : 0;
        case 'horn':
          return InputManager.isKeyDown(ControlsConfig.horn) ? 1 : 0;
        case 'toggleLights':
          if (InputManager.isKeyJustPressed(ControlsConfig.toggleLights)) return 1;
          return 0;
        case 'toggleView':
          return InputManager.isKeyJustPressed(ControlsConfig.toggleView) ? 1 : 0;
        default:
          for (const key of keys) {
            if (InputManager.isKeyDown(key)) return 1;
          }
          return 0;
      }
    },

    /** Combined steering: left=-1, right=+1 */
    getSteering() {
      const left = this.getAction('steerLeft');
      const right = this.getAction('steerRight');
      return right - left;
    },

    /** Combined throttle: 1 = accelerate, -1 = brake/reverse */
    getThrottle() {
      const accel = this.getAction('accelerate');
      const brake = this.getAction('brake');
      return accel - brake;
    },

    isActionPressed(actionName) {
      return this.getAction(actionName) !== 0;
    },

    isActionJustPressed(actionName) {
      if (!ControlsConfig || !InputManager) return false;
      const keys = ControlsConfig.getActionKeys(actionName);
      for (const key of keys) {
        if (InputManager.isKeyJustPressed(key)) return true;
      }
      return false;
    },

    update(dt) {
      // Input is queried per-frame via getAction()
      // This hook exists for potential input smoothing or rebinding
    },

    destroy() {
      this._actions = {};
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.InputSystem = InputSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = InputSystem;
  }
})();
