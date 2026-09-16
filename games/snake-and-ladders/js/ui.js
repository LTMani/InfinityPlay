/**
 * Snake & Ladders - User Interface & Screen Controller
 * Handles screen transitions, HUD updates, victory celebration confetti, modals, and toasts.
 */

(function() {
  'use strict';

  class UIController {
    constructor() {
      this.currentScreen = 'menu';
      this.confettiCanvas = null;
      this.confettiCtx = null;
      this.confettiParticles = [];
      this.confettiAnimId = null;
    }

    init() {
      this.bindScreens();
      this.bindModals();
      this.bindSettings();
      this.bindSetup();
      this.initConfetti();
      this.applySavedTheme();

      // Check for saved game on initial load
      this.updateResumeButtonVisibility();

      // Keyboard navigation: Space/Enter rolls dice if game active, Esc pauses
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.currentScreen === 'game' && !window.SNGame.isGameOver) {
            this.togglePauseModal();
          }
        } else if (e.key === ' ' || e.key === 'Enter') {
          // If active in game screen and not in input
          if (this.currentScreen === 'game' && !['INPUT', 'SELECT', 'BUTTON'].includes(document.activeElement.tagName)) {
            const rollBtn = document.getElementById('btnRollDice');
            if (rollBtn && !rollBtn.disabled) {
              rollBtn.click();
            }
          }
        }
      });
    }

    /* ---------------- SCREEN TRANSITIONS ---------------- */
    showScreen(screenId) {
      this.currentScreen = screenId;
      document.querySelectorAll('.app-screen').forEach(scr => {
        scr.classList.remove('active');
      });

      const target = document.getElementById(`screen-${screenId}`);
      if (target) {
        target.classList.add('active');
      }

      if (screenId === 'menu') {
        this.updateResumeButtonVisibility();
      }
    }

    updateResumeButtonVisibility() {
      const resumeBtn = document.getElementById('btnMenuResume');
      if (!resumeBtn) return;
      if (window.SNStorage && window.SNStorage.hasSavedGame()) {
        resumeBtn.style.display = 'flex';
      } else {
        resumeBtn.style.display = 'none';
      }
    }

    /* ---------------- SETUP & MODES ---------------- */
    bindScreens() {
      // Menu screen buttons
      document.getElementById('btnMenuPVC')?.addEventListener('click', () => {
        this.openSetupForMode('pvc');
      });

      document.getElementById('btnMenuPVP')?.addEventListener('click', () => {
        this.openSetupForMode('pvp');
      });

      document.getElementById('btnMenu2VCPU')?.addEventListener('click', () => {
        this.openSetupForMode('2v_cpu');
      });

      document.getElementById('btnMenu4P')?.addEventListener('click', () => {
        this.openSetupForMode('local_4p');
      });

      document.getElementById('btnMenuResume')?.addEventListener('click', () => {
        const savedData = window.SNStorage ? window.SNStorage.loadGame() : null;
        if (savedData) {
          this.showScreen('game');
          window.SNGame.restoreSavedGame(savedData);
          this.showToast('Game resumed successfully!', 'info');
        }
      });

      document.getElementById('btnMenuStats')?.addEventListener('click', () => {
        this.openStatsModal();
      });

      document.getElementById('btnMenuAchievements')?.addEventListener('click', () => {
        this.openAchievementsModal();
      });

      document.getElementById('btnMenuSettings')?.addEventListener('click', () => {
        this.openSettingsModal();
      });

      // Exit button to InfinityPlay platform
      document.getElementById('btnExitToPortal')?.addEventListener('click', (e) => {
        // If active in embedded iframe, post message to parent
        if (window.parent && window.parent !== window) {
          e.preventDefault();
          window.parent.postMessage({ type: 'exitGame' }, '*');
        }
      });
    }

    openSetupForMode(mode) {
      window.SNGame.mode = mode;
      const titleEl = document.getElementById('setupModeTitle');
      const container = document.getElementById('setupPlayersContainer');
      if (!container) return;

      const titles = {
        'pvc': 'Player vs Computer (1v1)',
        'pvp': 'Local 2 Players (PvP)',
        '2v_cpu': '2 Players vs Computer',
        'local_4p': '4 Players Showdown'
      };
      if (titleEl) titleEl.textContent = titles[mode] || 'Game Setup';

      let playerConfigs = [];
      const presets = window.DEFAULT_TOKENS;

      if (mode === 'pvc') {
        playerConfigs = [
          { ...presets[0], name: 'Player 1', isAI: false },
          { ...presets[1], name: 'Computer', isAI: true }
        ];
      } else if (mode === 'pvp') {
        playerConfigs = [
          { ...presets[0], name: 'Player 1', isAI: false },
          { ...presets[1], name: 'Player 2', isAI: false }
        ];
      } else if (mode === '2v_cpu') {
        playerConfigs = [
          { ...presets[0], name: 'Player 1', isAI: false },
          { ...presets[1], name: 'Player 2', isAI: false },
          { ...presets[2], name: 'Computer', isAI: true }
        ];
      } else if (mode === 'local_4p') {
        playerConfigs = [
          { ...presets[0], name: 'Player 1', isAI: false },
          { ...presets[1], name: 'Player 2', isAI: false },
          { ...presets[2], name: 'Player 3', isAI: false },
          { ...presets[3], name: 'Player 4', isAI: false }
        ];
      }

      container.innerHTML = playerConfigs.map((p, idx) => `
        <div class="setup-player-card" data-index="${idx}">
          <div class="setup-player-header">
            <span class="setup-player-badge" style="background: ${p.color};">${p.symbol}</span>
            <input type="text" class="setup-player-name-input" value="${p.name}" maxlength="14" aria-label="Player ${idx + 1} Name">
            <label class="setup-ai-toggle">
              <input type="checkbox" class="setup-is-ai-check" ${p.isAI ? 'checked' : ''}>
              <span>CPU</span>
            </label>
          </div>
        </div>
      `).join('');

      this.showScreen('setup');
    }

    bindSetup() {
      document.getElementById('btnStartMatch')?.addEventListener('click', () => {
        const rows = document.querySelectorAll('.setup-player-card');
        const presets = window.DEFAULT_TOKENS;
        const playerConfigs = [];

        rows.forEach((row, idx) => {
          const nameInput = row.querySelector('.setup-player-name-input');
          const isAiCheck = row.querySelector('.setup-is-ai-check');
          const name = (nameInput?.value || `Player ${idx + 1}`).trim();
          const isAI = isAiCheck?.checked || false;

          playerConfigs.push({
            ...presets[idx % presets.length],
            id: `p${idx + 1}`,
            name,
            isAI
          });
        });

        // Read settings from storage
        const currentSettings = window.SNStorage.getSettings();

        this.showScreen('game');
        window.SNGame.startNewGame(playerConfigs, currentSettings);
      });

      document.getElementById('btnBackFromSetup')?.addEventListener('click', () => {
        this.showScreen('menu');
      });
    }

    /* ---------------- HUD UPDATES ---------------- */
    renderPlayerStatusCards(players) {
      const container = document.getElementById('hudPlayersList');
      if (!container) return;

      container.innerHTML = players.map(p => `
        <div class="hud-player-card" id="hud-player-${p.id}" style="--player-accent: ${p.color};">
          <div class="hud-player-badge">
            <span class="hud-player-icon">${p.symbol}</span>
            <div class="hud-player-info">
              <div class="hud-player-name">${p.name} ${p.isAI ? '<span class="hud-bot-tag">AI</span>' : ''}</div>
              <div class="hud-player-pos" id="hud-pos-${p.id}">Cell: <strong>${p.position === 0 ? 'START' : p.position}</strong> / 100</div>
            </div>
          </div>
          <div class="hud-progress-bar">
            <div class="hud-progress-fill" id="hud-bar-${p.id}" style="width: ${p.position}%; background: ${p.color};"></div>
          </div>
        </div>
      `).join('');
    }

    updatePlayerPositionInCard(playerId, newPos) {
      const posEl = document.getElementById(`hud-pos-${playerId}`);
      const barEl = document.getElementById(`hud-bar-${playerId}`);
      if (posEl) {
        posEl.innerHTML = `Cell: <strong>${newPos === 0 ? 'START' : newPos}</strong> / 100`;
      }
      if (barEl) {
        barEl.style.width = `${newPos}%`;
      }
    }

    highlightActivePlayerCard(playerId) {
      document.querySelectorAll('.hud-player-card').forEach(card => {
        card.classList.remove('active-turn');
      });
      const activeCard = document.getElementById(`hud-player-${playerId}`);
      if (activeCard) {
        activeCard.classList.add('active-turn');
      }
    }

    updateTurnBanner(player) {
      const banner = document.getElementById('currentTurnBanner');
      if (!banner) return;
      banner.innerHTML = `
        <span class="turn-dot" style="background: ${player.color}; box-shadow: 0 0 10px ${player.glow};"></span>
        <span>${player.name}'s Turn ${player.isAI ? '(AI)' : ''}</span>
      `;
    }

    setStatusMessage(msg) {
      const el = document.getElementById('gameStatusMessage');
      if (el) el.textContent = msg;
    }

    showEventBanner(text, type = 'ladder') {
      const banner = document.getElementById('floatingEventBanner');
      if (!banner) return;
      banner.className = `floating-event-banner banner-${type} active`;
      banner.textContent = text;

      setTimeout(() => {
        banner.classList.remove('active');
      }, 1600);
    }

    highlightCellEffect(cellNum, type) {
      const cell = document.querySelector(`.cell-${cellNum}`);
      if (!cell) return;
      cell.classList.add(`highlight-${type}`);
      setTimeout(() => {
        cell.classList.remove(`highlight-${type}`);
      }, 1200);
    }

    /* ---------------- MODALS & POPUPS ---------------- */
    bindModals() {
      // Pause button in HUD
      document.getElementById('btnGamePause')?.addEventListener('click', () => {
        this.togglePauseModal();
      });

      // Pause modal actions
      document.getElementById('btnPauseResume')?.addEventListener('click', () => {
        this.closeModal('pauseModal');
        window.SNGame.resume();
      });

      document.getElementById('btnPauseRestart')?.addEventListener('click', () => {
        this.closeModal('pauseModal');
        const configs = window.SNGame.players.map(p => ({ ...p, position: 0 }));
        window.SNGame.startNewGame(configs, window.SNGame.settings);
      });

      document.getElementById('btnPauseQuit')?.addEventListener('click', () => {
        this.closeModal('pauseModal');
        this.showConfirmDialog(
          'Abandon Game',
          'Are you sure you want to exit to the Main Menu? Current match progress will be lost.',
          () => {
            if (window.SNStorage) window.SNStorage.clearSave();
            this.showScreen('menu');
          }
        );
      });

      // Close modal on overlay click or close button
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal || e.target.closest('.btn-modal-close')) {
            const modalId = modal.id;
            this.closeModal(modalId);
            if (modalId === 'pauseModal') {
              window.SNGame.resume();
            }
          }
        });
      });
    }

    togglePauseModal() {
      const modal = document.getElementById('pauseModal');
      if (!modal) return;
      if (modal.classList.contains('active')) {
        this.closeModal('pauseModal');
        window.SNGame.resume();
      } else {
        window.SNGame.pause();
        this.openModal('pauseModal');
      }
    }

    openModal(modalId) {
      const m = document.getElementById(modalId);
      if (m) m.classList.add('active');
    }

    closeModal(modalId) {
      const m = document.getElementById(modalId);
      if (m) m.classList.remove('active');
    }

    showConfirmDialog(title, message, onConfirm) {
      const modal = document.getElementById('confirmModal');
      if (!modal) {
        if (confirm(message)) onConfirm();
        return;
      }
      document.getElementById('confirmModalTitle').textContent = title;
      document.getElementById('confirmModalMsg').textContent = message;

      const confirmBtn = document.getElementById('btnConfirmAccept');
      const cancelBtn = document.getElementById('btnConfirmCancel');

      const cleanup = () => {
        this.closeModal('confirmModal');
        confirmBtn.removeEventListener('click', confirmHandler);
        cancelBtn.removeEventListener('click', cancelHandler);
      };

      const confirmHandler = () => {
        cleanup();
        onConfirm();
      };

      const cancelHandler = () => {
        cleanup();
      };

      confirmBtn.addEventListener('click', confirmHandler);
      cancelBtn.addEventListener('click', cancelHandler);
      this.openModal('confirmModal');
    }

    /* ---------------- SETTINGS ---------------- */
    bindSettings() {
      const soundCheck = document.getElementById('settingSound');
      const musicCheck = document.getElementById('settingMusic');
      const animCheck = document.getElementById('settingAnimations');
      const extraTurnCheck = document.getElementById('settingExtraTurn');
      const exactFinishCheck = document.getElementById('settingExactFinish');
      const diffSelect = document.getElementById('settingDifficulty');
      const themeSelect = document.getElementById('settingTheme');

      const s = window.SNStorage.getSettings();
      if (soundCheck) soundCheck.checked = s.sound !== false;
      if (musicCheck) musicCheck.checked = s.music === true;
      if (animCheck) animCheck.checked = s.animations !== false;
      if (extraTurnCheck) extraTurnCheck.checked = s.extraTurnOn6 !== false;
      if (exactFinishCheck) exactFinishCheck.checked = s.exactFinish !== false;
      if (diffSelect) diffSelect.value = s.difficulty || 'medium';
      if (themeSelect) themeSelect.value = s.theme || 'classic';

      const saveCurrent = () => {
        const newSettings = {
          sound: soundCheck ? soundCheck.checked : true,
          music: musicCheck ? musicCheck.checked : false,
          animations: animCheck ? animCheck.checked : true,
          extraTurnOn6: extraTurnCheck ? extraTurnCheck.checked : true,
          exactFinish: exactFinishCheck ? exactFinishCheck.checked : true,
          difficulty: diffSelect ? diffSelect.value : 'medium',
          theme: themeSelect ? themeSelect.value : 'classic'
        };
        window.SNStorage.saveSettings(newSettings);
        window.SNGame.settings = { ...window.SNGame.settings, ...newSettings };

        if (window.SNAudio) {
          window.SNAudio.setSoundEnabled(newSettings.sound);
          window.SNAudio.setMusicEnabled(newSettings.music);
        }

        this.applyTheme(newSettings.theme);
      };

      [soundCheck, musicCheck, animCheck, extraTurnCheck, exactFinishCheck, diffSelect, themeSelect].forEach(input => {
        input?.addEventListener('change', saveCurrent);
      });

      // Reset settings button
      document.getElementById('btnResetSettings')?.addEventListener('click', () => {
        localStorage.removeItem('infinityplay_snake_ladders_settings');
        window.SNStorage.settings = window.SNStorage.loadSettings();
        const resetS = window.SNStorage.getSettings();
        if (soundCheck) soundCheck.checked = resetS.sound;
        if (musicCheck) musicCheck.checked = resetS.music;
        if (animCheck) animCheck.checked = resetS.animations;
        if (extraTurnCheck) extraTurnCheck.checked = resetS.extraTurnOn6;
        if (exactFinishCheck) exactFinishCheck.checked = resetS.exactFinish;
        if (diffSelect) diffSelect.value = resetS.difficulty;
        if (themeSelect) themeSelect.value = resetS.theme;
        saveCurrent();
        this.showToast('Settings reset to defaults', 'info');
      });
    }

    openSettingsModal() {
      this.openModal('settingsModal');
    }

    /* ---------------- THEMES ---------------- */
    applyTheme(theme) {
      document.body.setAttribute('data-theme', theme);
    }

    applySavedTheme() {
      const s = window.SNStorage.getSettings();
      this.applyTheme(s.theme || 'classic');
    }

    /* ---------------- STATISTICS & ACHIEVEMENTS MODALS ---------------- */
    openStatsModal() {
      const stats = window.SNStorage.getStats();
      const body = document.getElementById('statsModalBody');
      if (!body) return;

      body.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-num">${stats.gamesPlayed}</span>
            <span class="stat-label">Matches Played</span>
          </div>
          <div class="stat-card">
            <span class="stat-num" style="color: #4ade80;">${stats.gamesWon}</span>
            <span class="stat-label">Victories</span>
          </div>
          <div class="stat-card">
            <span class="stat-num" style="color: #f87171;">${stats.gamesLost}</span>
            <span class="stat-label">Defeats</span>
          </div>
          <div class="stat-card">
            <span class="stat-num" style="color: #f59e0b;">${stats.bestStreak}</span>
            <span class="stat-label">Best Win Streak</span>
          </div>
          <div class="stat-card">
            <span class="stat-num">${stats.totalDiceRolls}</span>
            <span class="stat-label">Total Rolls</span>
          </div>
          <div class="stat-card">
            <span class="stat-num" style="color: #38bdf8;">${stats.laddersClimbed}</span>
            <span class="stat-label">Ladders Climbed</span>
          </div>
          <div class="stat-card">
            <span class="stat-num" style="color: #a78bfa;">${stats.snakesEncountered}</span>
            <span class="stat-label">Snakes Encountered</span>
          </div>
          <div class="stat-card">
            <span class="stat-num" style="color: #fbbf24;">${stats.sixesRolled}</span>
            <span class="stat-label">Sixes Rolled</span>
          </div>
        </div>
      `;
      this.openModal('statsModal');
    }

    openAchievementsModal() {
      const achs = window.SNStorage.getAchievements();
      const list = document.getElementById('achievementsModalList');
      if (!list) return;

      list.innerHTML = achs.map(a => `
        <div class="achievement-item ${a.unlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon">${a.icon}</div>
          <div class="achievement-details">
            <div class="achievement-title">${a.title} ${a.unlocked ? '✓' : ''}</div>
            <div class="achievement-desc">${a.desc}</div>
            <div class="achievement-prog-bar">
              <div class="achievement-prog-fill" style="width: ${(a.progress / a.max) * 100}%;"></div>
            </div>
            <div class="achievement-prog-text">${a.progress} / ${a.max}</div>
          </div>
        </div>
      `).join('');

      this.openModal('achievementsModal');
    }

    showAchievementToast(ach) {
      const toast = document.createElement('div');
      toast.className = 'achievement-toast';
      toast.innerHTML = `
        <span style="font-size: 1.5rem;">${ach.icon}</span>
        <div>
          <div style="font-size: 0.72rem; text-transform: uppercase; color: #fbbf24; font-weight: 800;">Achievement Unlocked!</div>
          <strong style="color: #ffffff; font-size: 0.95rem;">${ach.title}</strong>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add('active'), 10);
      setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 400);
      }, 3500);
    }

    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `game-toast toast-${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add('active'), 10);
      setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 300);
      }, 2500);
    }

    /* ---------------- VICTORY CELEBRATION ---------------- */
    showVictoryModal(winner, matchData) {
      const modal = document.getElementById('victoryModal');
      if (!modal) return;

      document.getElementById('victoryWinnerName').textContent = `${winner.name} Wins!`;
      document.getElementById('victoryWinnerIcon').textContent = winner.symbol;
      document.getElementById('victoryTurnsCount').textContent = matchData.totalTurns;
      document.getElementById('victoryRollsCount').textContent = matchData.totalRolls;
      document.getElementById('victoryLaddersCount').textContent = matchData.laddersClimbed;
      document.getElementById('victorySnakesCount').textContent = matchData.snakesHit;

      this.startConfetti();
      this.openModal('victoryModal');

      // Actions
      document.getElementById('btnVictoryPlayAgain').onclick = () => {
        this.stopConfetti();
        this.closeModal('victoryModal');
        const configs = matchData.allPlayers.map(p => ({ ...p, position: 0 }));
        window.SNGame.startNewGame(configs, window.SNGame.settings);
      };

      document.getElementById('btnVictoryMenu').onclick = () => {
        this.stopConfetti();
        this.closeModal('victoryModal');
        this.showScreen('menu');
      };
    }

    initConfetti() {
      this.confettiCanvas = document.getElementById('confettiCanvas');
      if (!this.confettiCanvas) return;
      this.confettiCtx = this.confettiCanvas.getContext('2d');
      this.resizeConfetti();
      window.addEventListener('resize', () => this.resizeConfetti());
    }

    resizeConfetti() {
      if (!this.confettiCanvas) return;
      this.confettiCanvas.width = window.innerWidth;
      this.confettiCanvas.height = window.innerHeight;
    }

    startConfetti() {
      if (!this.confettiCanvas || !this.confettiCtx) return;
      this.resizeConfetti();
      this.confettiParticles = [];
      const colors = ['#ef4444', '#38bdf8', '#facc15', '#4ade80', '#c084fc', '#fb923c'];

      for (let i = 0; i < 140; i++) {
        this.confettiParticles.push({
          x: Math.random() * this.confettiCanvas.width,
          y: -Math.random() * this.confettiCanvas.height * 0.5,
          w: Math.random() * 8 + 6,
          h: Math.random() * 12 + 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: Math.random() * 4 - 2,
          vy: Math.random() * 3 + 2.5,
          rot: Math.random() * 360,
          rotSpeed: Math.random() * 6 - 3
        });
      }

      const animate = () => {
        this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
        this.confettiParticles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.rotSpeed;

          if (p.y > this.confettiCanvas.height) {
            p.y = -10;
            p.x = Math.random() * this.confettiCanvas.width;
          }

          this.confettiCtx.save();
          this.confettiCtx.translate(p.x, p.y);
          this.confettiCtx.rotate((p.rot * Math.PI) / 180);
          this.confettiCtx.fillStyle = p.color;
          this.confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          this.confettiCtx.restore();
        });

        this.confettiAnimId = requestAnimationFrame(animate);
      };

      if (this.confettiAnimId) cancelAnimationFrame(this.confettiAnimId);
      this.confettiAnimId = requestAnimationFrame(animate);
    }

    stopConfetti() {
      if (this.confettiAnimId) {
        cancelAnimationFrame(this.confettiAnimId);
        this.confettiAnimId = null;
      }
      if (this.confettiCtx && this.confettiCanvas) {
        this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
      }
    }
  }

  window.SNUI = new UIController();
  document.addEventListener('DOMContentLoaded', () => {
    window.SNDice.init();
    window.SNUI.init();
  });
})();
