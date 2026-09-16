/**
 * Color Match: Spectrum Arena - Main Application Controller
 * Bootstraps game components, wires event listeners, handles keyboard hotkeys (1-8, P, R, Esc, M, C),
 * and manages transitions between screens.
 */

(function(window) {
  'use strict';

  let game = null;
  let currentActiveLevelId = 1;

  function initApp() {
    // 1. Initialize Visual Effects
    const fxCanvas = document.getElementById('effectsCanvas');
    if (fxCanvas) {
      window.EffectsEngine.init(fxCanvas);
    }

    // 2. Initialize Game Engine
    game = new window.SpectrumGame();

    // 3. Initialize UI
    window.UIManager.init();

    // 4. Hook Game Engine Events to UI
    game.onQuestionReady = (question, meta) => {
      window.UIManager.renderQuestion(question, meta, (selectedIndex, tileEl) => {
        game.submitAnswer(selectedIndex, tileEl);
      });
    };

    game.onTick = (remaining, total) => {
      window.UIManager.updateTimer(remaining, total);
    };

    game.onRoundResult = (result) => {
      if (!result.isCorrect) {
        const arena = document.getElementById('gameArena');
        window.EffectsEngine.screenShake(arena, 8, 300);
      }
    };

    game.onLevelComplete = (summary) => {
      window.UIManager.renderVictoryModal(
        summary,
        // On Next Level
        () => {
          currentActiveLevelId++;
          startLevel(currentActiveLevelId);
        },
        // On Replay
        () => {
          startLevel(currentActiveLevelId);
        },
        // On Map
        () => {
          openLevelMap();
        }
      );
    };

    game.onGameOver = (summary) => {
      window.UIManager.renderGameOverModal(
        summary,
        // On Retry
        () => {
          if (game.mode === 'classic') {
            startLevel(currentActiveLevelId);
          } else {
            game.startArcadeMode(game.mode);
          }
        },
        // On Menu
        () => {
          window.UIManager.showScreen('menu');
        }
      );
    };

    // 5. Wire Navigation & Menu Buttons
    bindMenuButtons();

    // 6. Wire Keyboard Controls
    bindKeyboardControls();

    // 7. Render initial menu stats & badge
    updateMenuStats();
  }

  function startLevel(levelId) {
    currentActiveLevelId = levelId;
    window.UIManager.showScreen('game');
    const hudModeTitle = document.getElementById('hudModeTitle');
    if (hudModeTitle) {
      hudModeTitle.textContent = `LEVEL ${levelId}`;
    }
    game.startLevel(levelId);
  }

  function openLevelMap() {
    window.UIManager.showScreen('levelMap');
    window.UIManager.renderWorldMap((lvlId) => {
      startLevel(lvlId);
    });
  }

  function updateMenuStats() {
    const totalStars = window.SaveManager.getTotalStars();
    const highestLevel = window.SaveManager.state.unlockedLevel;
    const coins = window.SaveManager.state.coins;

    const starsEl = document.getElementById('menuTotalStars');
    const levelEl = document.getElementById('menuHighestLevel');
    const coinsEl = document.getElementById('menuCoins');

    if (starsEl) starsEl.textContent = `${totalStars}/300`;
    if (levelEl) levelEl.textContent = `Lv ${highestLevel}`;
    if (coinsEl) coinsEl.textContent = coins.toLocaleString();
  }

  function bindMenuButtons() {
    // Play button on main menu
    const btnPlay = document.getElementById('btnPlayGame');
    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        window.SoundEngine.playButtonClick();
        const unlocked = window.SaveManager.state.unlockedLevel;
        startLevel(unlocked);
      });
    }

    // World Map button
    const btnMap = document.getElementById('btnLevelMap');
    if (btnMap) {
      btnMap.addEventListener('click', () => {
        window.SoundEngine.playButtonClick();
        openLevelMap();
      });
    }

    // Modes button
    const btnModes = document.getElementById('btnGameModes');
    if (btnModes) {
      btnModes.addEventListener('click', () => {
        window.SoundEngine.playButtonClick();
        window.UIManager.showScreen('modes');
      });
    }

    // Achievements button
    const btnAch = document.getElementById('btnAchievements');
    if (btnAch) {
      btnAch.addEventListener('click', () => {
        window.SoundEngine.playButtonClick();
        window.UIManager.renderAchievementsModal();
      });
    }

    // How to Play button
    const btnHow = document.getElementById('btnHowToPlay');
    if (btnHow) {
      btnHow.addEventListener('click', () => {
        window.SoundEngine.playButtonClick();
        window.UIManager.showModal('howToPlay');
      });
    }

    // Sound toggle in header
    const btnSound = document.getElementById('btnSoundToggle');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        window.SoundEngine.toggleMute();
        window.UIManager.updateSoundBtn();
      });
    }

    // Color blind mode toggle
    const btnCB = document.getElementById('btnColorBlindToggle');
    if (btnCB) {
      btnCB.addEventListener('click', () => {
        window.SoundEngine.playButtonClick();
        window.SaveManager.state.colorBlindMode = !window.SaveManager.state.colorBlindMode;
        window.SaveManager.save();
        btnCB.classList.toggle('active', window.SaveManager.state.colorBlindMode);
        // Refresh question if active
        if (game.currentQuestion) {
          window.UIManager.renderOptionsGrid(game.currentQuestion, (idx, el) => {
            game.submitAnswer(idx, el);
          });
        }
      });
      if (window.SaveManager.state.colorBlindMode) {
        btnCB.classList.add('active');
      }
    }

    // In-game Pause button
    const btnPause = document.getElementById('btnPause');
    if (btnPause) {
      btnPause.addEventListener('click', () => {
        window.SoundEngine.playButtonClick();
        game.pause();
        window.UIManager.showModal('pause');
      });
    }

    // Resume button
    const btnResume = document.getElementById('btnResume');
    if (btnResume) {
      btnResume.addEventListener('click', () => {
        window.SoundEngine.playButtonClick();
        window.UIManager.closeModal('pause');
        game.resume();
      });
    }

    // Restart button in pause
    const btnRestart = document.getElementById('btnRestart');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        window.SoundEngine.playButtonClick();
        window.UIManager.closeModal('pause');
        if (game.mode === 'classic') {
          startLevel(currentActiveLevelId);
        } else {
          game.startArcadeMode(game.mode);
        }
      });
    }

    // Quit to menu from pause
    const btnQuit = document.getElementById('btnQuit');
    if (btnQuit) {
      btnQuit.addEventListener('click', () => {
        window.SoundEngine.playButtonClick();
        game.stopTimer();
        window.UIManager.closeModal('pause');
        updateMenuStats();
        window.UIManager.showScreen('menu');
      });
    }

    // Back to menu from Level Map
    const btnMapBack = document.getElementById('btnMapBack');
    if (btnMapBack) {
      btnMapBack.addEventListener('click', () => {
        window.SoundEngine.playButtonClick();
        updateMenuStats();
        window.UIManager.showScreen('menu');
      });
    }

    // Back to menu from Modes screen
    const btnModesBack = document.getElementById('btnModesBack');
    if (btnModesBack) {
      btnModesBack.addEventListener('click', () => {
        window.SoundEngine.playButtonClick();
        updateMenuStats();
        window.UIManager.showScreen('menu');
      });
    }

    // Arcade mode selection buttons
    const modeCards = document.querySelectorAll('.mode-card[data-mode]');
    modeCards.forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.getAttribute('data-mode');
        window.SoundEngine.playButtonClick();
        window.UIManager.showScreen('game');
        const hudModeTitle = document.getElementById('hudModeTitle');
        if (hudModeTitle) {
          hudModeTitle.textContent = mode.replace('_', ' ').toUpperCase();
        }
        game.startArcadeMode(mode);
      });
    });

    // Modal close buttons (X)
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.SoundEngine.playButtonClick();
        const modal = btn.closest('.modal-backdrop');
        if (modal) modal.classList.add('hidden');
        if (modal && modal.id === 'pauseModal' && game.isPaused) {
          game.resume();
        }
      });
    });
  }

  function bindKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      // Ignore key events when typing into inputs or textareas
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key;

      // Digit keys 1-8 for option selection
      if (/^[1-8]$/.test(key)) {
        const index = parseInt(key, 10) - 1;
        const buttons = document.querySelectorAll('.color-tile-btn');
        if (buttons && buttons[index]) {
          buttons[index].click();
        }
        return;
      }

      // Escape or 'P' for Pause
      if (key === 'Escape' || key.toLowerCase() === 'p') {
        const pauseModal = document.getElementById('pauseModal');
        if (!pauseModal) return;

        if (pauseModal.classList.contains('hidden')) {
          if (!game.isGameOver && !game.isLevelWon) {
            game.pause();
            window.UIManager.showModal('pause');
          }
        } else {
          window.UIManager.closeModal('pause');
          game.resume();
        }
        return;
      }

      // 'R' for Restart
      if (key.toLowerCase() === 'r') {
        if (!game.isPaused) {
          if (game.mode === 'classic') {
            startLevel(currentActiveLevelId);
          } else {
            game.startArcadeMode(game.mode);
          }
        }
        return;
      }

      // 'M' for Mute toggle
      if (key.toLowerCase() === 'm') {
        window.SoundEngine.toggleMute();
        window.UIManager.updateSoundBtn();
        return;
      }

      // 'C' for Color-blind toggle
      if (key.toLowerCase() === 'c') {
        const btnCB = document.getElementById('btnColorBlindToggle');
        if (btnCB) btnCB.click();
        return;
      }
    });
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})(typeof window !== 'undefined' ? window : this);

