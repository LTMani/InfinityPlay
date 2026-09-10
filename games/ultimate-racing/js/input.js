/**
 * InfinityPlay Ultimate Racing - Input Controller
 * Handles Keyboard, Pointer/Touch Controls, and Virtual Gamepad
 */

(function() {
  class InputController {
    constructor() {
      this.keys = {
        accelerate: false,
        brake: false,
        steerLeft: false,
        steerRight: false,
        drift: false,
        nitro: false,
        reset: false,
        pause: false
      };

      this.touchActive = {
        accelerate: false,
        brake: false,
        steerLeft: false,
        steerRight: false,
        drift: false,
        nitro: false
      };

      // Raw key mappings (event.code)
      this.codeMap = {
        'KeyW': 'accelerate',
        'ArrowUp': 'accelerate',
        'KeyS': 'brake',
        'ArrowDown': 'brake',
        'KeyA': 'steerLeft',
        'ArrowLeft': 'steerLeft',
        'KeyD': 'steerRight',
        'ArrowRight': 'steerRight',
        'Space': 'drift',
        'ShiftLeft': 'nitro',
        'ShiftRight': 'nitro',
        'KeyR': 'reset',
        'Escape': 'pause'
      };

      this.isTouchDevice = false;
      this.initEvents();
    }

    /**
     * Normalizes keyboard input across event.code and event.key
     * Supports both lowercase and uppercase naturally
     */
    getAction(code, key) {
      if (code && this.codeMap[code]) {
        return this.codeMap[code];
      }
      if (key) {
        const k = key.toLowerCase();
        if (k === 'w' || k === 'arrowup') return 'accelerate';
        if (k === 's' || k === 'arrowdown') return 'brake';
        if (k === 'a' || k === 'arrowleft') return 'steerLeft';
        if (k === 'd' || k === 'arrowright') return 'steerRight';
        if (k === ' ' || k === 'space' || k === 'spacebar') return 'drift';
        if (k === 'shift') return 'nitro';
        if (k === 'r') return 'reset';
        if (k === 'escape' || k === 'esc') return 'pause';
      }
      return null;
    }

    initEvents() {
      // Attach to window so keys are intercepted even when canvas is not directly focused
      window.addEventListener('keydown', (e) => {
        const action = this.getAction(e.code, e.key);
        if (action) {
          // Prevent browser scrolling on Arrow keys and Space bar during gameplay
          const k = (e.key || '').toLowerCase();
          if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code) ||
              ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) {
            e.preventDefault();
          }
          this.keys[action] = true;
        }
      });

      window.addEventListener('keyup', (e) => {
        const action = this.getAction(e.code, e.key);
        if (action) {
          this.keys[action] = false;
        }
      });

      // Clear input state when losing window focus or switching tabs to prevent stuck keys
      window.addEventListener('blur', () => this.clear());
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.clear();
      });

      // Detect touch capabilities
      window.addEventListener('touchstart', () => {
        this.isTouchDevice = true;
        document.body.classList.add('has-touch');
      }, { once: true });
    }

    bindTouchButton(element, action) {
      if (!element) return;

      const setPressed = (pressed) => {
        this.touchActive[action] = pressed;
        if (pressed) {
          element.classList.add('pressed');
        } else {
          element.classList.remove('pressed');
        }
      };

      // Pointer events for robust multi-touch support
      element.addEventListener('pointerdown', (e) => {
        if (e.cancelable) e.preventDefault();
        try { element.setPointerCapture(e.pointerId); } catch (_) {}
        setPressed(true);
      });

      element.addEventListener('pointerup', (e) => {
        if (e.cancelable) e.preventDefault();
        try { element.releasePointerCapture(e.pointerId); } catch (_) {}
        setPressed(false);
      });

      element.addEventListener('pointercancel', () => {
        setPressed(false);
      });

      element.addEventListener('pointerleave', () => {
        setPressed(false);
      });

      element.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    isActionActive(action) {
      return Boolean(this.keys[action] || this.touchActive[action]);
    }

    getSteerAxis() {
      let axis = 0;
      if (this.isActionActive('steerLeft')) axis -= 1;
      if (this.isActionActive('steerRight')) axis += 1;
      return axis;
    }

    getThrottleAxis() {
      let axis = 0;
      if (this.isActionActive('accelerate')) axis += 1;
      if (this.isActionActive('brake')) axis -= 1;
      return axis;
    }

    clear() {
      for (const k of Object.keys(this.keys)) {
        this.keys[k] = false;
      }
      for (const k of Object.keys(this.touchActive)) {
        this.touchActive[k] = false;
      }
    }

    consumeReset() {
      if (this.keys.reset) {
        this.keys.reset = false;
        return true;
      }
      return false;
    }

    consumePause() {
      if (this.keys.pause) {
        this.keys.pause = false;
        return true;
      }
      return false;
    }
  }

  window.UR = window.UR || {};
  window.UR.input = new InputController();
})();

