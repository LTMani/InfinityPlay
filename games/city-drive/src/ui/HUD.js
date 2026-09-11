/**
 * HUD.js
 * Controls the Start Screen, game mode selection, in-game automotive dashboard,
 * mission telemetry, garage customizer, summary report, and touch controls.
 */

export class HUD {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    // callbacks: {
    //   onStart(mode), onRestart(), onPause(), onResume(), onToggleAudio(),
    //   onCycleTimeOfDay(), onColorChange(hex), onTuningChange(tuning), onReturnMenu()
    // }

    this.selectedLevel = 1;
    this.selectedColor = 0x2563eb;
    this.tuning = { engineLevel: 2, handlingLevel: 2, brakesLevel: 2 };

    // Level descriptions
    this.levelDescriptions = {};
    for (let i = 1; i <= 10; i++) {
      this.levelDescriptions[i] = `Level ${i}: Drive to the destination ${i * 1000}m away before time runs out! Watch out for traffic!`;
    }

    // Cache DOM Elements
    this.startScreen = document.getElementById('startScreen');
    this.btnPlay = document.getElementById('btnPlay');
    this.btnControls = document.getElementById('btnControls');
    this.controlsModal = document.getElementById('controlsModal');
    this.btnCloseControls = document.getElementById('btnCloseControls');

    // Modes
    this.modeTabs = document.querySelectorAll('.mode-tab');
    this.modeDescription = document.getElementById('modeDescription');

    // Garage
    this.btnGarageOpen = document.getElementById('btnGarageOpen');
    this.garageModal = document.getElementById('garageModal');
    this.btnCloseGarage = document.getElementById('btnCloseGarage');
    this.colorSwatches = document.querySelectorAll('.swatch-btn');
    this.tuneEngine = document.getElementById('tuneEngine');
    this.tuneHandling = document.getElementById('tuneHandling');
    this.tuneBrakes = document.getElementById('tuneBrakes');
    this.labelEngine = document.getElementById('labelEngine');
    this.labelHandling = document.getElementById('labelHandling');
    this.labelBrakes = document.getElementById('labelBrakes');

    // In-game HUD
    this.gameHUD = document.getElementById('gameHUD');
    this.hudSpeedNumber = document.getElementById('hudSpeedNumber');
    this.hudSpeedBar = document.getElementById('hudSpeedBar');
    this.hudGear = document.getElementById('hudGear');
    this.hudDistance = document.getElementById('hudDistance');
    this.hudBanner = document.getElementById('hudBanner');
    this.hudMissionTimer = document.getElementById('hudMissionTimer');
    this.hudMissionObjective = document.getElementById('hudMissionObjective');
    this.hudScore = document.getElementById('hudScore');

    // Top action buttons
    this.btnTimeToggle = document.getElementById('btnTimeToggle');
    this.btnAudioToggle = document.getElementById('btnAudioToggle');
    this.btnHudRestart = document.getElementById('btnHudRestart');
    this.btnHudPause = document.getElementById('btnHudPause');

    // Pause Modal
    this.pauseModal = document.getElementById('pauseModal');
    this.btnResume = document.getElementById('btnResume');
    this.btnPauseRestart = document.getElementById('btnPauseRestart');
    this.btnPauseMenu = document.getElementById('btnPauseMenu');

    // Summary Modal
    this.summaryModal = document.getElementById('summaryModal');
    this.summaryTitle = document.getElementById('summaryTitle');
    this.summarySubtitle = document.getElementById('summarySubtitle');
    this.statFinalScore = document.getElementById('statFinalScore');
    this.statCheckpoints = document.getElementById('statCheckpoints');
    this.statCheckpointsLabel = document.getElementById('statCheckpointsLabel');
    this.statNearMisses = document.getElementById('statNearMisses');
    this.statDistance = document.getElementById('statDistance');
    this.btnSummaryRestart = document.getElementById('btnSummaryRestart');
    this.btnSummaryMenu = document.getElementById('btnSummaryMenu');

    // Mobile touch
    this.touchControls = document.getElementById('touchControls');

    this.bannerTimeout = null;

    this._bindEvents();
    this._loadSavedPreferences();
  }

  _bindEvents() {
    // 1. Mode selection tabs
    if (this.modeTabs) {
      this.modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          this.modeTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          this.selectedLevel = parseInt(tab.dataset.level, 10);
          if (this.modeDescription) {
            this.modeDescription.textContent = this.levelDescriptions[this.selectedLevel] || '';
          }
        });
      });
    }

    // 2. Play & Controls buttons
    if (this.btnPlay) {
      this.btnPlay.addEventListener('click', () => {
        this.btnPlay.blur();
        window.focus();
        this.hideStartScreen();
        if (this.callbacks.onStart) this.callbacks.onStart(this.selectedMode);
      });
    }

    if (this.btnControls) {
      this.btnControls.addEventListener('click', () => this.showControlsModal(true));
    }

    if (this.btnCloseControls) {
      this.btnCloseControls.addEventListener('click', () => this.showControlsModal(false));
    }

    // 3. Garage Modal
    if (this.btnGarageOpen) {
      this.btnGarageOpen.addEventListener('click', () => this.showGarageModal(true));
    }

    if (this.btnCloseGarage) {
      this.btnCloseGarage.addEventListener('click', () => {
        this.showGarageModal(false);
        this._savePreferences();
      });
    }

    if (this.colorSwatches) {
      this.colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
          this.colorSwatches.forEach(s => s.classList.remove('active'));
          swatch.classList.add('active');
          const hex = parseInt(swatch.dataset.color, 16);
          this.selectedColor = hex;
          if (this.callbacks.onColorChange) this.callbacks.onColorChange(hex);
        });
      });
    }

    // Tuning sliders
    const updateTuningDisplay = () => {
      const eng = parseInt(this.tuneEngine.value, 10);
      const hnd = parseInt(this.tuneHandling.value, 10);
      const brk = parseInt(this.tuneBrakes.value, 10);

      this.tuning = { engineLevel: eng, handlingLevel: hnd, brakesLevel: brk };

      const engLabels = ['STAGE 1 (165 KM/H)', 'STAGE 2 (187 KM/H)', 'STAGE 3 PRO (209 KM/H)'];
      const hndLabels = ['STAGE 1 (STANDARD)', 'STAGE 2 (HIGH GRIP)', 'STAGE 3 PRO (RACE SPEC)'];
      const brkLabels = ['STAGE 1 (OEM PADS)', 'STAGE 2 (SPORT PADS)', 'STAGE 3 PRO (CERAMIC)'];

      if (this.labelEngine) this.labelEngine.textContent = engLabels[eng - 1];
      if (this.labelHandling) this.labelHandling.textContent = hndLabels[hnd - 1];
      if (this.labelBrakes) this.labelBrakes.textContent = brkLabels[brk - 1];

      if (this.callbacks.onTuningChange) this.callbacks.onTuningChange(this.tuning);
    };

    if (this.tuneEngine) this.tuneEngine.addEventListener('input', updateTuningDisplay);
    if (this.tuneHandling) this.tuneHandling.addEventListener('input', updateTuningDisplay);
    if (this.tuneBrakes) this.tuneBrakes.addEventListener('input', updateTuningDisplay);

    // 4. In-Game Top Actions
    if (this.btnTimeToggle) {
      this.btnTimeToggle.addEventListener('click', () => {
        if (this.callbacks.onCycleTimeOfDay) {
          const mode = this.callbacks.onCycleTimeOfDay();
          const icons = { DAY: '☀️', SUNSET: '🌅', NIGHT: '🌙' };
          this.btnTimeToggle.textContent = icons[mode] || '☀️';
          this.showNotification(`ATMOSPHERE: ${mode}`, 'info', 1000);
        }
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

    // 5. Pause Modal
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

    if (this.btnPauseMenu) {
      this.btnPauseMenu.addEventListener('click', () => {
        this.showPauseModal(false);
        this.showStartScreen();
        if (this.callbacks.onReturnMenu) this.callbacks.onReturnMenu();
      });
    }

    // 6. Summary Modal
    if (this.btnSummaryRestart) {
      this.btnSummaryRestart.addEventListener('click', () => {
        this.showSummaryModal(false);
        if (this.callbacks.onRestart) this.callbacks.onRestart();
      });
    }

    if (this.btnSummaryMenu) {
      this.btnSummaryMenu.addEventListener('click', () => {
        this.showSummaryModal(false);
        this.showStartScreen();
        if (this.callbacks.onReturnMenu) this.callbacks.onReturnMenu();
      });
    }
  }

  _loadSavedPreferences() {
    try {
      const savedColor = localStorage.getItem('city_drive_color');
      if (savedColor && this.colorSwatches) {
        const hex = parseInt(savedColor, 16);
        this.selectedColor = hex;
        this.colorSwatches.forEach(s => {
          if (parseInt(s.dataset.color, 16) === hex) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      }
    } catch(e) {}
  }

  _savePreferences() {
    try {
      localStorage.setItem('city_drive_color', '0x' + this.selectedColor.toString(16));
    } catch(e) {}
  }

  showStartScreen() {
    if (this.startScreen) this.startScreen.classList.remove('hidden');
    if (this.gameHUD) this.gameHUD.classList.add('hidden');
    if (this.pauseModal) this.pauseModal.classList.add('hidden');
    if (this.summaryModal) this.summaryModal.classList.add('hidden');
    if (this.touchControls) this.touchControls.classList.add('hidden');
  }

  hideStartScreen() {
    if (this.startScreen) this.startScreen.classList.add('hidden');
    if (this.gameHUD) this.gameHUD.classList.remove('hidden');

    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 900);
    if (isTouch && this.touchControls) {
      this.touchControls.classList.remove('hidden');
    }
  }

  showControlsModal(visible) {
    if (this.controlsModal) {
      this.controlsModal.classList.toggle('hidden', !visible);
    }
  }

  showGarageModal(visible) {
    if (this.garageModal) {
      this.garageModal.classList.toggle('hidden', !visible);
    }
  }

  showPauseModal(visible) {
    if (this.pauseModal) {
      this.pauseModal.classList.toggle('hidden', !visible);
    }
  }

  showSummaryModal(visible, isSuccess = false, stats = {}) {
    if (!this.summaryModal) return;

    if (visible) {
      this.summaryModal.classList.remove('hidden');
      if (this.summaryTitle) {
        this.summaryTitle.textContent = isSuccess ? 'MISSION COMPLETE!' : 'TIME EXPIRED!';
      }
      if (this.summarySubtitle) {
        this.summarySubtitle.textContent = isSuccess
          ? 'Outstanding driving! All targets completed successfully.'
          : 'You ran out of time! Improve your speed and dodging.';
      }
      if (this.statFinalScore) this.statFinalScore.textContent = (stats.score || 0).toLocaleString();
      if (this.statCheckpoints) {
        const count = stats.mode === 'COURIER' ? (stats.deliveries || 0) : (stats.checkpoints || 0);
        this.statCheckpoints.textContent = count;
      }
      if (this.statCheckpointsLabel) {
        this.statCheckpointsLabel.textContent = stats.mode === 'COURIER' ? 'FARES DELIVERED' : 'CHECKPOINTS';
      }
      if (this.statNearMisses) this.statNearMisses.textContent = stats.nearMisses || 0;
      if (this.statDistance) this.statDistance.textContent = `${stats.distance || 0} M`;
    } else {
      this.summaryModal.classList.add('hidden');
    }
  }

  /**
   * Updates in-game dashboard telemetry displays.
   */
  updateTelemetry(speedKmh, gear, distanceMeters) {
    if (this.hudSpeedNumber) {
      const paddedSpeed = String(Math.min(999, Math.max(0, speedKmh))).padStart(3, '0');
      this.hudSpeedNumber.textContent = paddedSpeed;
    }

    if (this.hudSpeedBar) {
      const fillPercent = Math.min(100, Math.round((speedKmh / 150) * 100));
      this.hudSpeedBar.style.width = `${fillPercent}%`;
    }

    if (this.hudGear) {
      this.hudGear.textContent = gear;
      this.hudGear.className = `gear-badge gear-${gear.toLowerCase()}`;
    }

    if (this.hudDistance) {
      this.hudDistance.textContent = `${distanceMeters} M`;
    }
  }

  /**
   * Updates mission objective, timer, and score.
   */
  updateMissionTelemetry(timeRemainingSec, objectiveText, score, mode) {
    if (this.hudMissionTimer) {
      if (mode === 'FREE_CRUISE') {
        this.hudMissionTimer.textContent = '⏱ ENDLESS';
      } else {
        const mins = Math.floor(timeRemainingSec / 60);
        const secs = Math.floor(timeRemainingSec % 60);
        const formatted = `⏱ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        this.hudMissionTimer.textContent = formatted;
        if (timeRemainingSec <= 10) {
          this.hudMissionTimer.style.color = '#ef4444';
        } else {
          this.hudMissionTimer.style.color = '#fef08a';
        }
      }
    }

    if (this.hudMissionObjective && objectiveText) {
      this.hudMissionObjective.textContent = objectiveText;
    }

    if (this.hudScore) {
      this.hudScore.textContent = `⭐ ${(score || 0).toLocaleString()} PTS`;
    }
  }

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
