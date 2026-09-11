/**
 * HUD.js
 * Controls the Start Screen, in-game automotive dashboard,
 * speedometer gauge, collision alerts, pause modal, and mobile touch UI.
 */

export class HUD {
  constructor(callbacks = {}) {
    this.callbacks = callbacks; // { onStart, onRestart, onPause, onResume, onToggleAudio }

    // Cache DOM element references
    this.startScreen = document.getElementById('startScreen');
    this.btnPlay = document.getElementById('btnPlay');
    this.btnControls = document.getElementById('btnControls');
    this.controlsModal = document.getElementById('controlsModal');
    this.btnCloseControls = document.getElementById('btnCloseControls');

    this.gameHUD = document.getElementById('gameHUD');
    this.hudSpeedNumber = document.getElementById('hudSpeedNumber');
    this.hudSpeedBar = document.getElementById('hudSpeedBar');
    this.hudGear = document.getElementById('hudGear');
    this.hudDistance = document.getElementById('hudDistance');
    this.hudBanner = document.getElementById('hudBanner');

    this.pauseModal = document.getElementById('pauseModal');
    this.btnResume = document.getElementById('btnResume');
    this.btnPauseRestart = document.getElementById('btnPauseRestart');
    this.btnHudRestart = document.getElementById('btnHudRestart');
    this.btnHudPause = document.getElementById('btnHudPause');
    this.btnAudioToggle = document.getElementById('btnAudioToggle');

    this.touchControls = document.getElementById('touchControls');

    this.bannerTimeout = null;

    this._bindEvents();
  }

  _bindEvents() {
    // Start Screen
    if (this.btnPlay) {
      this.btnPlay.addEventListener('click', () => {
        this.hideStartScreen();
        if (this.callbacks.onStart) this.callbacks.onStart();
      });
    }

    if (this.btnControls) {
      this.btnControls.addEventListener('click', () => {
        this.showControlsModal(true);
      });
    }

    if (this.btnCloseControls) {
      this.btnCloseControls.addEventListener('click', () => {
        this.showControlsModal(false);
      });
    }

    // Top HUD buttons
    if (this.btnHudRestart) {
      this.btnHudRestart.addEventListener('click', () => {
        if (this.callbacks.onRestart) this.callbacks.onRestart();
      });
    }

    if (this.btnHudPause) {
      this.btnHudPause.addEventListener('click', () => {
        if (this.callbacks.onPause) this.callbacks.onPause();
      });
    }

    if (this.btnAudioToggle) {
      this.btnAudioToggle.addEventListener('click', () => {
        if (this.callbacks.onToggleAudio) {
          const isMuted = this.callbacks.onToggleAudio();
          this.btnAudioToggle.textContent = isMuted ? '🔇' : '🔊';
        }
      });
    }

    // Pause Modal
    if (this.btnResume) {
      this.btnResume.addEventListener('click', () => {
        this.showPauseModal(false);
        if (this.callbacks.onResume) this.callbacks.onResume();
      });
    }

    if (this.btnPauseRestart) {
      this.btnPauseRestart.addEventListener('click', () => {
        this.showPauseModal(false);
        if (this.callbacks.onRestart) this.callbacks.onRestart();
      });
    }
  }

  showStartScreen() {
    if (this.startScreen) this.startScreen.classList.remove('hidden');
    if (this.gameHUD) this.gameHUD.classList.add('hidden');
    if (this.pauseModal) this.pauseModal.classList.add('hidden');
    if (this.touchControls) this.touchControls.classList.add('hidden');
  }

  hideStartScreen() {
    if (this.startScreen) this.startScreen.classList.add('hidden');
    if (this.gameHUD) this.gameHUD.classList.remove('hidden');

    // Show touch controls if on touch or mobile screen
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 900);
    if (isTouch && this.touchControls) {
      this.touchControls.classList.remove('hidden');
    }
  }

  showControlsModal(visible) {
    if (this.controlsModal) {
      if (visible) {
        this.controlsModal.classList.remove('hidden');
      } else {
        this.controlsModal.classList.add('hidden');
      }
    }
  }

  showPauseModal(visible) {
    if (this.pauseModal) {
      if (visible) {
        this.pauseModal.classList.remove('hidden');
      } else {
        this.pauseModal.classList.add('hidden');
      }
    }
  }

  /**
   * Updates in-game dashboard telemetry displays.
   */
  updateTelemetry(speedKmh, gear, distanceMeters) {
    // 3-digit zero-padded speed display: e.g. 042
    if (this.hudSpeedNumber) {
      const paddedSpeed = String(Math.min(999, Math.max(0, speedKmh))).padStart(3, '0');
      this.hudSpeedNumber.textContent = paddedSpeed;
    }

    // Speed bar fill (0 to 140 km/h)
    if (this.hudSpeedBar) {
      const fillPercent = Math.min(100, Math.round((speedKmh / 140) * 100));
      this.hudSpeedBar.style.width = `${fillPercent}%`;
    }

    // Gear indicator
    if (this.hudGear) {
      this.hudGear.textContent = gear;
      this.hudGear.className = `gear-badge gear-${gear.toLowerCase()}`;
    }

    // Distance display
    if (this.hudDistance) {
      this.hudDistance.textContent = `${distanceMeters} M`;
    }
  }

  /**
   * Displays temporary collision or game event banner.
   */
  showNotification(message, type = 'danger', durationMs = 1200) {
    if (!this.hudBanner) return;

    if (this.bannerTimeout) clearTimeout(this.bannerTimeout);

    this.hudBanner.textContent = message;
    this.hudBanner.className = `hud-banner show banner-${type}`;

    this.bannerTimeout = setTimeout(() => {
      this.hudBanner.className = 'hud-banner';
    }, durationMs);
  }
}

