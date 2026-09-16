/**
 * Whack-a-Mole: Arcade Edition - Main Application Controller
 * Bootstraps game components, wires events, handles keyboard controls (1-9, P, Esc, R, M),
 * and coordinates screen transitions.
 */

(function(window) {
  'use strict';

  let game = null;
  let activeLevelId = 1;

  function initApp() {
    // 1. Visual Effects
    const fxCanvas = document.getElementById('effectsCanvas');
    if (fxCanvas) {
      window.EffectsEngine.init(fxCanvas);
    }

    // 2. Game Engine
    game = new window.WhackGame();

    // 3. UI Manager
    window.UIManager.init();

    // 4. Hook Game events to UI
    game.onMoleSpawn = (holeId, moleType, hp) => {
      window.UIManager.spawnMoleInHole(holeId, moleType, hp);
    };

    game.onMoleRetreat = (holeId) => {
      window.UIManager.retreatMoleFromHole(holeId);
    };

    game.onMoleHit = (holeId, moleType, remainingHp, isDead, scoreGain, combo, reactionMs) => {
      window.UIManager.whackMoleInHole(holeId, moleType, remainingHp, isDead, scoreGain, combo, reactionMs);
      if (moleType === 'bomb') {
        const board = document.getElementById('gameBoard');
        window.EffectsEngine.screenShake(board, 12, 300);
      }
    };

    game.onTick = (remaining, total) => {
      window.UIManager.updateTimer(remaining, total);
    };

    game.onScoreUpdate = (score) => {
      window.UIManager.updateScore(score);
    };

    game.onComboUpdate = (combo) => {
      window.UIManager.updateCombo(combo);
    };

    game.onLivesUpdate = (lives) => {
      window.UIManager.updateLives(lives);
    };

    game.onLevelComplete = (summary) => {
      window.UIManager.renderVictoryModal(
        summary,
        // On Next Level
        () => {
          activeLevelId++;
          startCampaignLevel(activeLevelId);
        },
        // On Replay
        () => {
          startCampaignLevel(activeLevelId);
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
            startCampaignLevel(activeLevelId);
          } else {
            game.startArcadeMode(game.mode);
          }
        },
        // On Menu
        () => {
          updateMenuStats();
          window.UIManager.showScreen('menu');
        }
      );
    };

    // 5. Wire Buttons
    bindMenuButtons();

    // 6. Wire Keyboard
    bindKeyboardControls();

    // 7. Update initial stats
    updateMenuStats();
  }

  function startCampaignLevel(levelId) {
    activeLevelId = levelId;
    window.UIManager.showScreen('game');

    const lvl = window.LevelSystem.getLevel(levelId);
    if (window.UIManager.hud.levelTag) {
      window.UIManager.hud.levelTag.textContent = `LEVEL ${levelId}`;
    }

    // Render board for this level's grid dimensions
    window.UIManager.renderBoard(lvl.grid, (holeIndex, holeEl) => {
      game.whackHole(holeIndex, holeEl);
    });

    // Reset HUD
    window.UIManager.updateScore(0);
    window.UIManager.updateCombo(1);
    window.UIManager.updateLives(3);
    window.UIManager.updateTimer(lvl.duration, lvl.duration);

    // Apply night mode theme if World 4
    const boardWrap = document.getElementById('gameBoardWrapper');
    if (boardWrap) {
      boardWrap.classList.toggle('night-garden-theme', !!lvl.isNightMode);
    }

    game.startLevel(levelId);
  }

  function openLevelMap() {
    window.UIManager.showScreen('levelMap');
    window.UIManager.renderWorldMap((lvlId) => {
      startCampaignLevel(lvlId);
    });
  }

  function updateMenuStats() {
    const save = window.SaveManager.state;
    const totalStars = window.SaveManager.getTotalStars();

    const starsEl = document.getElementById('menuTotalStars');
    const levelEl = document.getElementById('menuHighestLevel');
    const comboEl = document.getElementById('menuBestCombo');
    const hitsEl = document.getElementById('menuTotalHits');
    const coinsEl = document.getElementById('menuCoins');

    if (starsEl) starsEl.textContent = `${totalStars}/300`;
    if (levelEl) levelEl.textContent = `Lv ${save.unlockedLevel}`;
    if (comboEl) comboEl.textContent = `${save.stats.highestCombo}x`;
    if (hitsEl) hitsEl.textContent = save.stats.totalHits.toLocaleString();
    if (coinsEl) coinsEl.textContent = save.coins.toLocaleString();
  }

  function bindMenuButtons() {
    // Play button on menu
    const btnPlay = document.getElementById('btnPlayGame');
    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        window.SoundEngine.playHit('normal', false);
        const unlocked = window.SaveManager.state.unlockedLevel;
        startCampaignLevel(unlocked);
      });
    }

    // World Map button
    const btnMap = document.getElementById('btnLevelMap');
    if (btnMap) {
      btnMap.addEventListener('click', () => {
        window.SoundEngine.playHit('normal', false);
        openLevelMap();
      });
    }

    // Modes button
    const btnModes = document.getElementById('btnGameModes');
    if (btnModes) {
      btnModes.addEventListener('click', () => {
        window.SoundEngine.playHit('normal', false);
        window.UIManager.showScreen('modes');
      });
    }

    // Achievements button
    const btnAch = document.getElementById('btnAchievements');
    if (btnAch) {
      btnAch.addEventListener('click', () => {
        window.SoundEngine.playHit('normal', false);
        window.UIManager.renderAchievementsModal();
      });
    }

    // How to Play button
    const btnHow = document.getElementById('btnHowToPlay');
    if (btnHow) {
      btnHow.addEventListener('click', () => {
        window.SoundEngine.playHit('normal', false);
        window.UIManager.showModal('howToPlay');
      });
    }

    // Sound toggle
    const btnSound = document.getElementById('btnSoundToggle');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        window.SoundEngine.toggleSound();
        window.UIManager.updateSoundBtn();
      });
    }

    // In-game Pause button
    const btnPause = document.getElementById('btnPause');
    if (btnPause) {
      btnPause.addEventListener('click', () => {
        window.SoundEngine.playHit('normal', false);
        game.pause();
        window.UIManager.showModal('pause');
      });
    }

    // Resume button
    const btnResume = document.getElementById('btnResume');
    if (btnResume) {
      btnResume.addEventListener('click', () => {
        window.SoundEngine.playHit('normal', false);
        window.UIManager.closeModal('pause');
        game.resume();
      });
    }

    // Restart button
    const btnRestart = document.getElementById('btnRestart');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        window.SoundEngine.playHit('normal', false);
        window.UIManager.closeModal('pause');
        if (game.mode === 'classic') {
          startCampaignLevel(activeLevelId);
        } else {
          game.startArcadeMode(game.mode);
        }
      });
    }

    // Quit button
    const btnQuit = document.getElementById('btnQuit');
    if (btnQuit) {
      btnQuit.addEventListener('click', () => {
        window.SoundEngine.playHit('normal', false);
        game.cleanupTimers();
        window.UIManager.closeModal('pause');
        updateMenuStats();
        window.UIManager.showScreen('menu');
      });
    }

    // Map & Modes back buttons
    const btnMapBack = document.getElementById('btnMapBack');
    if (btnMapBack) {
      btnMapBack.addEventListener('click', () => {
        window.SoundEngine.playHit('normal', false);
        updateMenuStats();
        window.UIManager.showScreen('menu');
      });
    }

    const btnModesBack = document.getElementById('btnModesBack');
    if (btnModesBack) {
      btnModesBack.addEventListener('click', () => {
        window.SoundEngine.playHit('normal', false);
        updateMenuStats();
        window.UIManager.showScreen('menu');
      });
    }

    // Arcade Mode Cards
    document.querySelectorAll('.mode-card[data-mode]').forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.getAttribute('data-mode');
        window.SoundEngine.playHit('normal', false);
        window.UIManager.showScreen('game');

        if (window.UIManager.hud.levelTag) {
          window.UIManager.hud.levelTag.textContent = mode.replace('_', ' ').toUpperCase();
        }

        const grid = (mode === 'endless') ? { rows: 4, cols: 3 } : { rows: 3, cols: 3 };
        window.UIManager.renderBoard(grid, (holeIdx, el) => {
          game.whackHole(holeIdx, el);
        });

        window.UIManager.updateScore(0);
        window.UIManager.updateCombo(1);
        window.UIManager.updateLives(3);
        window.UIManager.updateTimer(60, 60);

        game.startArcadeMode(mode);
      });
    });

    // Close buttons (X) on modals
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.SoundEngine.playHit('normal', false);
        const modal = btn.closest('.modal-backdrop');
        if (modal) modal.classList.add('hidden');
        if (modal && modal.id === 'pauseModal' && game.state === window.GAME_STATES.PAUSED) {
          game.resume();
        }
      });
    });
  }

  function bindKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key;

      // Digits 1-9 whacks hole index 0-8
      if (/^[1-9]$/.test(key)) {
        const holeIdx = parseInt(key, 10) - 1;
        const holes = document.querySelectorAll('.board-hole');
        if (holes && holes[holeIdx]) {
          window.UIManager.animateMalletStrike();
          game.whackHole(holeIdx, holes[holeIdx]);
        }
        return;
      }

      // P or Escape for Pause
      if (key === 'Escape' || key.toLowerCase() === 'p') {
        const pauseModal = document.getElementById('pauseModal');
        if (!pauseModal) return;

        if (pauseModal.classList.contains('hidden')) {
          if (game.state === window.GAME_STATES.PLAYING) {
            game.pause();
            window.UIManager.showModal('pause');
          }
        } else {
          window.UIManager.closeModal('pause');
          game.resume();
        }
        return;
      }

      // R for Restart
      if (key.toLowerCase() === 'r') {
        if (game.state === window.GAME_STATES.PLAYING || game.state === window.GAME_STATES.GAME_OVER) {
          if (game.mode === 'classic') {
            startCampaignLevel(activeLevelId);
          } else {
            game.startArcadeMode(game.mode);
          }
        }
        return;
      }

      // M for Sound Toggle
      if (key.toLowerCase() === 'm') {
        window.SoundEngine.toggleSound();
        window.UIManager.updateSoundBtn();
        return;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})(typeof window !== 'undefined' ? window : this);

