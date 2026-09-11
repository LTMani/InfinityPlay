/**
 * Railway Commander - Input Manager
 * Handles keyboard controls, on-screen touch buttons, and responsive inputs
 * without interfering with parent platform page navigation.
 */

export class InputManager {
  constructor(gameEngine) {
    this.engine = gameEngine;
    this.keyState = {};
    this.enabled = true;
    this.touchBindings = [];
  }

  bindControls() {
    // Keyboard Event Listener
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // Bind on-screen UI buttons if present
    this.bindTouchButton('btnThrottleUp', () => this.engine.onThrottleUp());
    this.bindTouchButton('btnThrottleDown', () => this.engine.onThrottleDown());
    this.bindTouchButton('btnBrakeUp', () => this.engine.onBrakeUp());
    this.bindTouchButton('btnBrakeDown', () => this.engine.onBrakeDown());
    this.bindTouchButton('btnEmergencyBrake', () => this.engine.onEmergencyBrake());
    this.bindTouchButton('btnHeadlights', () => this.engine.onToggleHeadlights());
    this.bindTouchButton('btnCameraToggle', () => this.engine.onToggleCamera());
    this.bindTouchButton('btnPauseGame', () => this.engine.togglePause());

    // Horn button supports hold / release
    const hornBtn = document.getElementById('btnHorn');
    if (hornBtn) {
      const startHorn = (e) => {
        if (e) e.preventDefault();
        this.engine.onHorn(true);
      };
      const stopHorn = (e) => {
        if (e) e.preventDefault();
        this.engine.onHorn(false);
      };

      hornBtn.addEventListener('mousedown', startHorn);
      window.addEventListener('mouseup', stopHorn);
      hornBtn.addEventListener('touchstart', startHorn, { passive: false });
      window.addEventListener('touchend', stopHorn);
    }
  }

  bindTouchButton(elementId, callback) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const handler = (e) => {
      e.preventDefault();
      if (!this.enabled) return;
      callback();
    };

    el.addEventListener('click', handler);
    this.touchBindings.push({ el, handler });
  }

  handleKeyDown(e) {
    if (!this.enabled) return;

    // Ignore when user is typing in an input or textarea
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
      return;
    }

    const key = e.key;

    // Pause toggle
    if (key === 'Escape' || key === 'p' || key === 'P') {
      e.preventDefault();
      this.engine.togglePause();
      return;
    }

    // Controls only work during active driving
    if (this.engine.state !== 'DRIVING') {
      return;
    }

    switch (key) {
      case 'w':
      case 'W':
      case 'ArrowUp':
        e.preventDefault();
        this.engine.onThrottleUp();
        break;

      case 's':
      case 'S':
      case 'ArrowDown':
        e.preventDefault();
        this.engine.onBrakeUp();
        break;

      case 'a':
      case 'A':
      case 'ArrowLeft':
        e.preventDefault();
        this.engine.onThrottleDown();
        break;

      case 'd':
      case 'D':
      case 'ArrowRight':
        e.preventDefault();
        this.engine.onBrakeDown();
        break;

      case ' ': // Spacebar
        e.preventDefault();
        this.engine.onEmergencyBrake();
        break;

      case 'h':
      case 'H':
        e.preventDefault();
        if (!this.keyState['h']) {
          this.keyState['h'] = true;
          this.engine.onHorn(true);
        }
        break;

      case 'l':
      case 'L':
        e.preventDefault();
        this.engine.onToggleHeadlights();
        break;

      case 'c':
      case 'C':
        e.preventDefault();
        this.engine.onToggleCamera();
        break;
    }
  }

  handleKeyUp(e) {
    const key = e.key;
    if (key === 'h' || key === 'H') {
      this.keyState['h'] = false;
      this.engine.onHorn(false);
    }
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
  }
}
