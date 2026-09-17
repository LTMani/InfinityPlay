/**
 * CONNECTING Puzzle Game - UI Manager
 * Handles HUD, Level Select, Win Modal, Pause, How to Play, Stats, and Settings.
 */

(function() {
  'use strict';

  class UIManager {
    constructor() {
      this.currentView = 'game'; // 'game' | 'levels'
      this.activeTab = '5x5';
      this.initElements();
      this.bindEvents();
    }

    initElements() {
      // Screens
      this.gameScreen = document.getElementById('game-screen');
      this.levelSelectScreen = document.getElementById('level-select-screen');

      // HUD elements
      this.levelTitle = document.getElementById('hud-level-title');
      this.difficultyBadge = document.getElementById('hud-difficulty-badge');
      this.flowsText = document.getElementById('hud-flows');
      this.fillText = document.getElementById('hud-fill');
      this.movesText = document.getElementById('hud-moves');
      this.timerText = document.getElementById('hud-timer');

      // Buttons
      this.btnExit = document.getElementById('btn-exit');
      this.btnSound = document.getElementById('btn-sound');
      this.btnLevels = document.getElementById('btn-levels');
      this.btnHowToPlay = document.getElementById('btn-how-to-play');
      this.btnSettings = document.getElementById('btn-settings');
      this.btnStats = document.getElementById('btn-stats');

      this.btnHint = document.getElementById('btn-hint');
      this.btnReset = document.getElementById('btn-reset');
      this.btnPause = document.getElementById('btn-pause');

      // Modals
      this.modalWin = document.getElementById('modal-win');
      this.modalPause = document.getElementById('modal-pause');
      this.modalHelp = document.getElementById('modal-help');
      this.modalStats = document.getElementById('modal-stats');
      this.modalSettings = document.getElementById('modal-settings');

      // Win Modal Elements
      this.winStarsContainer = document.getElementById('win-stars');
      this.winTimeText = document.getElementById('win-time');
      this.winMovesText = document.getElementById('win-moves');
      this.winBestTimeText = document.getElementById('win-best-time');
      this.btnWinNext = document.getElementById('btn-win-next');
      this.btnWinReplay = document.getElementById('btn-win-replay');
      this.btnWinLevels = document.getElementById('btn-win-levels');

      // Pause Modal Buttons
      this.btnResume = document.getElementById('btn-resume');
      this.btnPauseRestart = document.getElementById('btn-pause-restart');
      this.btnPauseLevels = document.getElementById('btn-pause-levels');

      // Level Select Container
      this.levelsGrid = document.getElementById('levels-grid');
      this.tabButtons = document.querySelectorAll('.level-tab-btn');
      this.btnBackFromLevels = document.getElementById('btn-back-from-levels');

      // Settings toggles
      this.toggleSoundSetting = document.getElementById('toggle-sound');
      this.toggleColorblindSetting = document.getElementById('toggle-colorblind');
    }

    bindEvents() {
      // Exit button
      if (this.btnExit) {
        this.btnExit.addEventListener('click', () => this.handleExit());
      }

      // Sound button
      if (this.btnSound) {
        this.btnSound.addEventListener('click', () => {
          window.ConnectingAudio.playButtonClick();
          const current = window.ConnectingAudio.isEnabled();
          const next = !current;
          window.ConnectingAudio.setEnabled(next);
          window.ConnectingStorage.updateSetting('sound', next);
          this.updateSoundButtonUI();
        });
      }

      // Levels button from HUD
      if (this.btnLevels) {
        this.btnLevels.addEventListener('click', () => {
          window.ConnectingAudio.playButtonClick();
          this.showLevelSelect();
        });
      }

      // Back button from level select
      if (this.btnBackFromLevels) {
        this.btnBackFromLevels.addEventListener('click', () => {
          window.ConnectingAudio.playButtonClick();
          this.showGameScreen();
        });
      }

      // Level Select Tab buttons
      this.tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          window.ConnectingAudio.playButtonClick();
          this.tabButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeTab = btn.dataset.tab;
          this.renderLevelSelectGrid();
        });
      });

      // In-game controls
      if (this.btnHint) {
        this.btnHint.addEventListener('click', () => {
          window.ConnectingEngine.applyHint();
        });
      }

      if (this.btnReset) {
        this.btnReset.addEventListener('click', () => {
          window.ConnectingAudio.playButtonClick();
          window.ConnectingEngine.resetLevel();
        });
      }

      if (this.btnPause) {
        this.btnPause.addEventListener('click', () => {
          window.ConnectingAudio.playButtonClick();
          window.ConnectingEngine.pauseGame();
          this.showModal(this.modalPause);
        });
      }

      // Win Modal Actions
      if (this.btnWinNext) {
        this.btnWinNext.addEventListener('click', () => {
          window.ConnectingAudio.playButtonClick();
          this.hideModal(this.modalWin);
          const nextLevelId = window.ConnectingEngine.currentLevel.id + 1;
          if (nextLevelId <= 30) {
            window.ConnectingEngine.loadLevel(nextLevelId);
          } else {
            this.showLevelSelect();
          }
        });
      }

      if (this.btnWinReplay) {
        this.btnWinReplay.addEventListener('click', () => {
          window.ConnectingAudio.playButtonClick();
          this.hideModal(this.modalWin);
          window.ConnectingEngine.resetLevel();
        });
      }

      if (this.btnWinLevels) {
        this.btnWinLevels.addEventListener('click', () => {
          window.ConnectingAudio.playButtonClick();
          this.hideModal(this.modalWin);
          this.showLevelSelect();
        });
      }

      // Pause Modal Actions
      if (this.btnResume) {
        this.btnResume.addEventListener('click', () => {
          window.ConnectingAudio.playButtonClick();
          this.hideModal(this.modalPause);
          window.ConnectingEngine.resumeGame();
        });
      }

      if (this.btnPauseRestart) {
        this.btnPauseRestart.addEventListener('click', () => {
          window.ConnectingAudio.playButtonClick();
          this.hideModal(this.modalPause);
          window.ConnectingEngine.resetLevel();
        });
      }

      if (this.btnPauseLevels) {
        this.btnPauseLevels.addEventListener('click', () => {
          window.ConnectingAudio.playButtonClick();
          this.hideModal(this.modalPause);
          this.showLevelSelect();
        });
      }

      // Modals close buttons
      document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          window.ConnectingAudio.playButtonClick();
          const modal = btn.closest('.modal-overlay');
          if (modal) {
            this.hideModal(modal);
            if (modal === this.modalPause) {
              window.ConnectingEngine.resumeGame();
            }
          }
        });
      });

      // Help button
      if (this.btnHowToPlay) {
        this.btnHowToPlay.addEventListener('click', () => {
          window.ConnectingAudio.playButtonClick();
          this.showModal(this.modalHelp);
        });
      }

      // Stats button
      if (this.btnStats) {
        this.btnStats.addEventListener('click', () => {
          window.ConnectingAudio.playButtonClick();
          this.renderStatsAndAchievements();
          this.showModal(this.modalStats);
        });
      }

      // Settings button
      if (this.btnSettings) {
        this.btnSettings.addEventListener('click', () => {
          window.ConnectingAudio.playButtonClick();
          this.populateSettings();
          this.showModal(this.modalSettings);
        });
      }

      // Settings toggles
      if (this.toggleSoundSetting) {
        this.toggleSoundSetting.addEventListener('change', (e) => {
          const val = e.target.checked;
          window.ConnectingAudio.setEnabled(val);
          window.ConnectingStorage.updateSetting('sound', val);
          this.updateSoundButtonUI();
        });
      }

      if (this.toggleColorblindSetting) {
        this.toggleColorblindSetting.addEventListener('change', (e) => {
          const val = e.target.checked;
          window.ConnectingStorage.updateSetting('colorblind', val);
          if (window.ConnectingRenderer) {
            window.ConnectingRenderer.render();
          }
        });
      }
    }

    handleExit() {
      // Check if embedded in iframe
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'exitGame' }, '*');
      } else {
        window.location.href = '../../index.html';
      }
    }

    updateSoundButtonUI() {
      const isEnabled = window.ConnectingAudio.isEnabled();
      if (this.btnSound) {
        this.btnSound.textContent = isEnabled ? '🔊' : '🔇';
        this.btnSound.setAttribute('aria-label', isEnabled ? 'Mute Sound' : 'Unmute Sound');
      }
      if (this.toggleSoundSetting) {
        this.toggleSoundSetting.checked = isEnabled;
      }
    }

    showModal(modal) {
      if (!modal) return;
      modal.classList.add('active');
    }

    hideModal(modal) {
      if (!modal) return;
      modal.classList.remove('active');
    }

    showGameScreen() {
      this.currentView = 'game';
      this.gameScreen.classList.remove('hidden');
      this.levelSelectScreen.classList.add('hidden');
      if (window.ConnectingRenderer) {
        window.dispatchEvent(new Event('resize'));
      }
    }

    showLevelSelect() {
      this.currentView = 'levels';
      this.gameScreen.classList.add('hidden');
      this.levelSelectScreen.classList.remove('hidden');
      this.renderLevelSelectGrid();
    }

    renderLevelSelectGrid() {
      if (!this.levelsGrid) return;
      this.levelsGrid.innerHTML = '';

      const levels = window.CONNECTING_LEVELS || [];
      const filtered = levels.filter(lvl => {
        if (this.activeTab === '5x5') return lvl.size === 5;
        if (this.activeTab === '6x6') return lvl.size === 6;
        if (this.activeTab === '7x7') return lvl.size === 7;
        if (this.activeTab === '8x8') return lvl.size === 8;
        if (this.activeTab === '9x9') return lvl.size === 9;
        return true;
      });

      filtered.forEach(lvl => {
        const unlocked = window.ConnectingStorage.isLevelUnlocked(lvl.id);
        const record = window.ConnectingStorage.getLevelRecord(lvl.id);

        const card = document.createElement('div');
        card.className = `level-card ${unlocked ? 'unlocked' : 'locked'}`;

        if (unlocked) {
          card.addEventListener('click', () => {
            window.ConnectingAudio.playButtonClick();
            this.showGameScreen();
            window.ConnectingEngine.loadLevel(lvl.id);
          });
        }

        let starsHtml = '';
        if (unlocked) {
          const starsCount = record.stars || 0;
          for (let s = 1; s <= 3; s++) {
            starsHtml += `<span class="star ${s <= starsCount ? 'active' : ''}">★</span>`;
          }
        }

        card.innerHTML = `
          <div class="level-card-number">${lvl.id}</div>
          <div class="level-card-info">
            <span class="level-card-size">${lvl.size}x${lvl.size}</span>
            <span class="level-card-colors">${lvl.pairs.length} colors</span>
          </div>
          ${unlocked ? `<div class="level-card-stars">${starsHtml}</div>` : `<div class="level-card-lock">🔒</div>`}
          ${unlocked && record.completed ? `<div class="level-card-best">⚡ ${record.bestTime}s</div>` : ''}
        `;

        this.levelsGrid.appendChild(card);
      });
    }

    updateHUD(type, engine) {
      if (!engine || !engine.currentLevel) return;

      const lvl = engine.currentLevel;
      if (this.levelTitle) {
        this.levelTitle.textContent = `Level ${lvl.id}`;
      }
      if (this.difficultyBadge) {
        this.difficultyBadge.textContent = `${lvl.size}x${lvl.size} ${lvl.difficulty}`;
      }

      if (this.movesText) {
        this.movesText.textContent = engine.moves;
      }

      if (this.timerText) {
        const mins = Math.floor(engine.timer / 60).toString().padStart(2, '0');
        const secs = (engine.timer % 60).toString().padStart(2, '0');
        this.timerText.textContent = `${mins}:${secs}`;
      }

      const flows = engine.getFlowsStatus();
      if (this.flowsText) {
        this.flowsText.textContent = `${flows.completed}/${flows.total}`;
        if (flows.completed === flows.total) {
          this.flowsText.classList.add('complete');
        } else {
          this.flowsText.classList.remove('complete');
        }
      }

      const fill = engine.getBoardFillPercentage();
      if (this.fillText) {
        this.fillText.textContent = `${fill}%`;
        if (fill === 100) {
          this.fillText.classList.add('complete');
        } else {
          this.fillText.classList.remove('complete');
        }
      }
    }

    showWinModal(data) {
      const { level, stars, time, moves, record } = data;

      // Stars
      if (this.winStarsContainer) {
        this.winStarsContainer.innerHTML = '';
        for (let i = 1; i <= 3; i++) {
          const starEl = document.createElement('span');
          starEl.className = `win-star ${i <= stars ? 'earned' : ''}`;
          starEl.textContent = '★';
          this.winStarsContainer.appendChild(starEl);
        }
      }

      // Times & Moves
      if (this.winTimeText) this.winTimeText.textContent = `${time}s`;
      if (this.winMovesText) this.winMovesText.textContent = `${moves}`;
      if (this.winBestTimeText) this.winBestTimeText.textContent = `${record.bestTime}s`;

      // Next level button
      if (this.btnWinNext) {
        if (level.id >= 30) {
          this.btnWinNext.textContent = 'All Completed! 🏆';
        } else {
          this.btnWinNext.textContent = 'Next Level ➔';
        }
      }

      this.showModal(this.modalWin);
    }

    populateSettings() {
      const settings = window.ConnectingStorage.getSettings();
      if (this.toggleSoundSetting) {
        this.toggleSoundSetting.checked = settings.sound;
      }
      if (this.toggleColorblindSetting) {
        this.toggleColorblindSetting.checked = settings.colorblind;
      }
    }

    renderStatsAndAchievements() {
      const stats = window.ConnectingStorage.getStats();
      const achievements = window.ConnectingStorage.getAchievements();

      const elTotalSolved = document.getElementById('stat-total-solved');
      const elTotalMoves = document.getElementById('stat-total-moves');
      const elTotalTime = document.getElementById('stat-total-time');
      const elHintsUsed = document.getElementById('stat-hints-used');

      if (elTotalSolved) elTotalSolved.textContent = stats.totalPuzzlesSolved;
      if (elTotalMoves) elTotalMoves.textContent = stats.totalMoves;
      if (elTotalTime) {
        const mins = Math.floor(stats.totalTimePlayed / 60);
        elTotalTime.textContent = `${mins}m ${stats.totalTimePlayed % 60}s`;
      }
      if (elHintsUsed) elHintsUsed.textContent = stats.hintsUsed;

      // Achievements list
      const achContainer = document.getElementById('achievements-list');
      if (achContainer) {
        achContainer.innerHTML = '';
        const definitions = [
          { key: 'first_connection', name: 'First Connection', desc: 'Solve Level 1' },
          { key: 'flow_master_5x5', name: 'Flow Master', desc: 'Complete all 5x5 Beginner levels' },
          { key: 'labyrinth_walker_6x6', name: 'Labyrinth Walker', desc: 'Complete all 6x6 Easy levels' },
          { key: 'color_conduit_7x7', name: 'Color Conduit', desc: 'Complete all 7x7 Medium levels' },
          { key: 'grid_maestro_8x8', name: 'Grid Maestro', desc: 'Complete all 8x8 Hard levels' },
          { key: 'grandmaster_all', name: 'Grandmaster', desc: 'Complete all 30 puzzle levels' },
          { key: 'perfectionist_10', name: 'Perfectionist', desc: 'Earn 3 stars on at least 10 levels' },
          { key: 'speed_demon', name: 'Speed Demon', desc: 'Solve any level in under 15 seconds' },
          { key: 'pure_intuition', name: 'Pure Intuition', desc: 'Solve a level without using hints' }
        ];

        definitions.forEach(d => {
          const unlocked = achievements[d.key];
          const item = document.createElement('div');
          item.className = `achievement-item ${unlocked ? 'unlocked' : 'locked'}`;
          item.innerHTML = `
            <div class="ach-icon">${unlocked ? '🏆' : '🔒'}</div>
            <div class="ach-info">
              <div class="ach-name">${d.name}</div>
              <div class="ach-desc">${d.desc}</div>
            </div>
          `;
          achContainer.appendChild(item);
        });
      }
    }
  }

  window.ConnectingUI = new UIManager();
})();
