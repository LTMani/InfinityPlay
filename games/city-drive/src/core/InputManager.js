/**
 * InputManager.js
 * Handles desktop keyboard and mobile touch inputs with zero lag.
 * Supports dual code/key identification, immediate arcade throttle response,
 * speed steering build-up, and auto-start triggers.
 */

export class InputManager {
  constructor() {
    // Current raw digital states
    this.raw = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      handbrake: false,
      horn: false
    };

    // Fast analog outputs [-1, 1]
    this.throttle = 0; // -1 (brake/rev) to +1 (accelerate)
    this.steer = 0;    // -1 (full left) to +1 (full right)
    this.handbrake = 0;// 0 to 1

    // Single-frame action flags
    this.startRequested = false;
    this.restartRequested = false;
    this.pauseRequested = false;
    this.timeOfDayRequested = false;

    // Device detection
    this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // Active touch button bindings
    this.touchStates = {
      gas: false,
      brake: false,
      left: false,
      right: false,
      handbrake: false,
      horn: false
    };

    this._setupKeyboardListeners();
    this._setupTouchControls();
  }

  _setupKeyboardListeners() {
    const PREVENT_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space']);

    window.addEventListener('keydown', (e) => {
      if (PREVENT_KEYS.has(e.code) || PREVENT_KEYS.has(e.key)) {
        e.preventDefault();
      }

      const code = e.code || '';
      const k = (e.key || '').toLowerCase();

      if (code === 'KeyW' || code === 'ArrowUp' || k === 'w' || k === 'arrowup') {
        this.raw.forward = true;
        this.startRequested = true;
      } else if (code === 'KeyS' || code === 'ArrowDown' || k === 's' || k === 'arrowdown') {
        this.raw.backward = true;
        this.startRequested = true;
      } else if (code === 'KeyA' || code === 'ArrowLeft' || k === 'a' || k === 'arrowleft') {
        this.raw.left = true;
      } else if (code === 'KeyD' || code === 'ArrowRight' || k === 'd' || k === 'arrowright') {
        this.raw.right = true;
      } else if (code === 'Space' || k === ' ') {
        this.raw.handbrake = true;
        this.startRequested = true;
      } else if (code === 'Enter' || k === 'enter') {
        this.startRequested = true;
      } else if (code === 'KeyR' || k === 'r') {
        this.restartRequested = true;
      } else if (code === 'KeyT' || k === 't') {
        this.timeOfDayRequested = true;
      } else if (code === 'KeyH' || k === 'h') {
        this.raw.horn = true;
      } else if (code === 'Escape' || k === 'escape') {
        this.pauseRequested = true;
      }
    }, { passive: false });

    window.addEventListener('keyup', (e) => {
      if (PREVENT_KEYS.has(e.code) || PREVENT_KEYS.has(e.key)) {
        e.preventDefault();
      }

      const code = e.code || '';
      const k = (e.key || '').toLowerCase();

      if (code === 'KeyW' || code === 'ArrowUp' || k === 'w' || k === 'arrowup') {
        this.raw.forward = false;
      } else if (code === 'KeyS' || code === 'ArrowDown' || k === 's' || k === 'arrowdown') {
        this.raw.backward = false;
      } else if (code === 'KeyA' || code === 'ArrowLeft' || k === 'a' || k === 'arrowleft') {
        this.raw.left = false;
      } else if (code === 'KeyD' || code === 'ArrowRight' || k === 'd' || k === 'arrowright') {
        this.raw.right = false;
      } else if (code === 'Space' || k === ' ') {
        this.raw.handbrake = false;
      } else if (code === 'KeyH' || k === 'h') {
        this.raw.horn = false;
      }
    }, { passive: false });

    // Reset inputs when window loses focus to prevent stuck keys
    window.addEventListener('blur', () => {
      this.resetAll();
    });
  }

  _setupTouchControls() {
    const bindTouchButton = (elementId, stateKey) => {
      const el = document.getElementById(elementId);
      if (!el) return;

      const setPressed = (pressed, e) => {
        if (e && e.cancelable) e.preventDefault();
        this.touchStates[stateKey] = pressed;
        if (pressed) {
          el.classList.add('active');
          if (stateKey === 'gas' || stateKey === 'brake') {
            this.startRequested = true;
          }
        } else {
          el.classList.remove('active');
        }
      };

      el.addEventListener('touchstart', (e) => setPressed(true, e), { passive: false });
      el.addEventListener('touchend', (e) => setPressed(false, e), { passive: false });
      el.addEventListener('touchcancel', (e) => setPressed(false, e), { passive: false });

      // Mouse fallback for desktop testing
      el.addEventListener('mousedown', (e) => setPressed(true, e));
      el.addEventListener('mouseup', (e) => setPressed(false, e));
      el.addEventListener('mouseleave', (e) => setPressed(false, e));
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._bindAllTouchButtons(bindTouchButton));
    } else {
      this._bindAllTouchButtons(bindTouchButton);
    }
  }

  _bindAllTouchButtons(binder) {
    binder('btnSteerLeft', 'left');
    binder('btnSteerRight', 'right');
    binder('btnGas', 'gas');
    binder('btnBrake', 'brake');
    binder('btnHandbrake', 'handbrake');
    binder('btnHorn', 'horn');
  }

  /**
   * Update smoothed inputs each frame with ultra-fast arcade response.
   * @param {number} dt Delta time in seconds
   */
  update(dt) {
    const forwardActive = this.raw.forward || this.touchStates.gas;
    const backwardActive = this.raw.backward || this.touchStates.brake;
    const leftActive = this.raw.left || this.touchStates.left;
    const rightActive = this.raw.right || this.touchStates.right;
    const handbrakeActive = this.raw.handbrake || this.touchStates.handbrake;

    let targetThrottle = 0;
    if (forwardActive && !backwardActive) {
      targetThrottle = 1.0;
    } else if (backwardActive && !forwardActive) {
      targetThrottle = -1.0;
    }

    let targetSteer = 0;
    if (leftActive && !rightActive) {
      targetSteer = 1.0; // Left (positive steer)
    } else if (rightActive && !leftActive) {
      targetSteer = -1.0; // Right
    }

    // Ultra-fast throttle response (almost instant)
    const throttleRate = targetThrottle !== 0 ? 32.0 : 22.0;
    this.throttle += (targetThrottle - this.throttle) * Math.min(1.0, throttleRate * dt);
    if (Math.abs(this.throttle) < 0.001) this.throttle = 0;

    // Snappy steering response
    const steerRate = targetSteer !== 0 ? 30.0 : 25.0;
    this.steer += (targetSteer - this.steer) * Math.min(1.0, steerRate * dt);
    if (Math.abs(this.steer) < 0.001) this.steer = 0;

    this.handbrake = handbrakeActive ? 1.0 : 0.0;
  }

  consumeStart() {
    const val = this.startRequested;
    this.startRequested = false;
    return val;
  }

  consumeRestart() {
    const val = this.restartRequested;
    this.restartRequested = false;
    return val;
  }

  consumePause() {
    const val = this.pauseRequested;
    this.pauseRequested = false;
    return val;
  }

  consumeTimeOfDayToggle() {
    const val = this.timeOfDayRequested;
    this.timeOfDayRequested = false;
    return val;
  }

  isHornActive() {
    return this.raw.horn || this.touchStates.horn;
  }

  resetAll() {
    this.raw.forward = false;
    this.raw.backward = false;
    this.raw.left = false;
    this.raw.right = false;
    this.raw.handbrake = false;
    this.raw.horn = false;

    this.touchStates.gas = false;
    this.touchStates.brake = false;
    this.touchStates.left = false;
    this.touchStates.right = false;
    this.touchStates.handbrake = false;
    this.touchStates.horn = false;

    this.throttle = 0;
    this.steer = 0;
    this.handbrake = 0;
    this.startRequested = false;
    this.restartRequested = false;
    this.pauseRequested = false;
    this.timeOfDayRequested = false;

    document.querySelectorAll('.touch-btn').forEach(btn => btn.classList.remove('active'));
  }
}
