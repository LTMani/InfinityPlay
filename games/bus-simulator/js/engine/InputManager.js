/**
 * Bus Simulator - Input Manager
 * Handles keyboard and mouse input state tracking
 */

(function () {
  'use strict';

  const InputManager = {
    _keys: {},
    _justPressed: {},
    _justReleased: {},
    _mouse: { x: 0, y: 0, pressed: false, justPressed: false },
    _deadzone: 0.15,
    _initialized: false,

    init(canvas) {
      if (this._initialized) return;

      window.addEventListener('keydown', (e) => {
        if (!this._keys[e.code]) {
          this._justPressed[e.code] = true;
        }
        this._keys[e.code] = true;
      });

      window.addEventListener('keyup', (e) => {
        this._justReleased[e.code] = true;
        this._keys[e.code] = false;
      });

      if (canvas) {
        canvas.addEventListener('mousemove', (e) => {
          const rect = canvas.getBoundingClientRect();
          this._mouse.x = e.clientX - rect.left;
          this._mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mousedown', (e) => {
          this._mouse.pressed = true;
          this._mouse.justPressed = true;
        });

        canvas.addEventListener('mouseup', (e) => {
          this._mouse.pressed = false;
        });

        canvas.addEventListener('mouseleave', () => {
          this._mouse.pressed = false;
        });
      }

      window.addEventListener('blur', () => {
        this._keys = {};
        this._mouse.pressed = false;
      });

      this._initialized = true;
    },

    isKeyDown(code) {
      return !!this._keys[code];
    },

    isKeyJustPressed(code) {
      return !!this._justPressed[code];
    },

    isKeyJustReleased(code) {
      return !!this._justReleased[code];
    },

    getMouse() {
      return this._mouse;
    },

    getMousePosition() {
      return { x: this._mouse.x, y: this._mouse.y };
    },

    isMousePressed() {
      return this._mouse.pressed;
    },

    isMouseJustPressed() {
      const result = this._mouse.justPressed;
      this._mouse.justPressed = false;
      return result;
    },

    /**
     * Returns a normalized axis value [-1, 1] from two key codes.
     * Useful for WASD / arrow key combinations.
     */
    getAxis(negativeKey, positiveKey) {
      let value = 0;
      if (this.isKeyDown(negativeKey)) value -= 1;
      if (this.isKeyDown(positiveKey)) value += 1;
      if (Math.abs(value) < this._deadzone) return 0;
      return value;
    },

    resetFrame() {
      this._justPressed = {};
      this._justReleased = {};
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.InputManager = InputManager;
  }
  if (typeof module !== 'undefined') {
    module.exports = InputManager;
  }
})();
