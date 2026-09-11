/**
 * InputManager.js
 * Handles desktop keyboard and mobile touch inputs.
 * Normalizes inputs into smooth, frame-independent control values.
 */

export class InputManager {
  constructor() {
    // Current raw digital states
    this.raw = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      handbrake: false
    };

    // Smoothed analog-like outputs [-1, 1]
    this.throttle = 0; // -1 (brake/rev) to +1 (accelerate)
    this.steer = 0;    // -1 (full left) to +1 (full right)
    this.handbrake = 0;// 0 to 1

    // Single-frame action flags
    this.restartRequested = false;
    this.pauseRequested = false;

    // Device detection
    this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // Active touch button bindings
    this.touchStates = {
      gas: false,
      brake: false,
      left: false,
      right: false,
      handbrake: false
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

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.raw.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.raw.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.raw.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.raw.right = true;
          break;
        case 'Space':
          this.raw.handbrake = true;
          break;
        case 'KeyR':
          this.restartRequested = true;
          break;
        case 'Escape':
          this.pauseRequested = true;
          break;
      }
    }, { passive: false });

    window.addEventListener('keyup', (e) => {
      if (PREVENT_KEYS.has(e.code) || PREVENT_KEYS.has(e.key)) {
        e.preventDefault();
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.raw.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.raw.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.raw.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.raw.right = false;
          break;
        case 'Space':
          this.raw.handbrake = false;
          break;
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
        } else {
          el.classList.remove('active');
        }
      };

      el.addEventListener('touchstart', (e) => setPressed(true, e), { passive: false });
      el.addEventListener('touchend', (e) => setPressed(false, e), { passive: false });
      el.addEventListener('touchcancel', (e) => setPressed(false, e), { passive: false });

      // Mouse fallback for UI testing on desktop
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
  }

  /**
   * Update smoothed inputs each frame.
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

    // Smooth throttle transition
    const throttleRate = targetThrottle !== 0 ? 8.0 : 6.0;
    this.throttle += (targetThrottle - this.throttle) * Math.min(1.0, throttleRate * dt);
    if (Math.abs(this.throttle) < 0.001) this.throttle = 0;

    // Smooth steering transition (keyboard/buttons benefit from progressive build-up)
    const steerRate = targetSteer !== 0 ? 9.0 : 12.0;
    this.steer += (targetSteer - this.steer) * Math.min(1.0, steerRate * dt);
    if (Math.abs(this.steer) < 0.001) this.steer = 0;

    this.handbrake = handbrakeActive ? 1.0 : 0.0;
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

  resetAll() {
    this.raw.forward = false;
    this.raw.backward = false;
    this.raw.left = false;
    this.raw.right = false;
    this.raw.handbrake = false;

    this.touchStates.gas = false;
    this.touchStates.brake = false;
    this.touchStates.left = false;
    this.touchStates.right = false;
    this.touchStates.handbrake = false;

    this.throttle = 0;
    this.steer = 0;
    this.handbrake = 0;
    this.restartRequested = false;
    this.pauseRequested = false;

    document.querySelectorAll('.touch-btn').forEach(btn => btn.classList.remove('active'));
  }
}

