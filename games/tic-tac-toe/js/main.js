/**
 * Tic-Tac-Toe: Ultimate Arena - Main Application Controller
 * Manages UI rendering, screen transitions, 3D piece generation, and user interactions
 */

(function() {
  'use strict';

  const App = {
    currentScreen: 'menu',
    setupConfig: {
      mode: 'AI',
      playerSymbol: 'X',
      difficulty: 'medium',
      firstMove: 'PLAYER',
      level: null
    },

    init() {
      // Initialize sub-modules
      if (window.TTTSave) window.TTTSave.init();
      if (window.TTTAudio) window.TTTAudio.init();
      if (window.TTTEffects) window.TTTEffects.init('effectsCanvas');

      this.cacheElements();
      this.bindEvents();
      this.renderBoardGrid();
      this.applySavedSettings();
      this.showScreen('menu');

      // Listen for achievement notifications
      window.addEventListener('tictactoe:achievement', (e) => {
        this.showAchievementToast(e.detail.achievement);
      });
    },

    cacheElements() {
      // Screens
      this.screens = {
        menu: document.getElementById('screenMenu'),
        setup: document.getElementById('screenSetup'),
        levels: document.getElementById('screenLevels'),
        game: document.getElementById('screenGame')
      };

      // Modals
      this.modals = {
        pause: document.getElementById('modalPause'),
        result: document.getElementById('modalResult'),
        settings: document.getElementById('modalSettings'),
        achievements: document.getElementById('modalAchievements'),
        confirm: document.getElementById('modalConfirm')
      };

      // Board & HUD
      this.boardEl = document.getElementById('tttBoard');
      this.winningLineSvg = document.getElementById('winningLineSvg');
      this.winningLineEl = document.getElementById('winningLine');
      this.turnIndicator = document.getElementById('turnIndicator');
      this.aiThinkingEl = document.getElementById('aiThinkingIndicator');
      this.roundDisplay = document.getElementById('hudRound');
      this.playerScoreDisplay = document.getElementById('hudPlayerScore');
      this.opponentScoreDisplay = document.getElementById('hudOpponentScore');
      this.drawsDisplay = document.getElementById('hudDraws');
      this.playerBadgeLabel = document.getElementById('hudPlayerLabel');
      this.opponentBadgeLabel = document.getElementById('hudOpponentLabel');
      this.difficultyBadge = document.getElementById('hudDifficulty');
      this.streakBadge = document.getElementById('hudStreak');
    },

    bindEvents() {
      // Main Menu Buttons
      document.getElementById('btnMenuPlayAI')?.addEventListener('click', () => {
        this.playUiSound();
        this.setupConfig.mode = 'AI';
        this.setupConfig.level = null;
        this.showScreen('setup');
      });

      document.getElementById('btnMenuPVP')?.addEventListener('click', () => {
        this.playUiSound();
        this.setupConfig.mode = 'PVP';
        this.setupConfig.playerSymbol = 'X';
        this.setupConfig.level = null;
        this.startMatch({
          mode: 'PVP',
          playerSymbol: 'X',
          difficulty: 'medium',
          firstMove: 'PLAYER'
        });
      });

      document.getElementById('btnMenuWatchAI')?.addEventListener('click', () => {
        this.playUiSound();
        this.setupConfig.mode = 'DEMO';
        this.setupConfig.difficulty = 'grandmaster';
        this.startMatch({
          mode: 'DEMO',
          playerSymbol: 'X',
          difficulty: 'grandmaster',
          firstMove: 'PLAYER'
        });
      });

      document.getElementById('btnMenuLevels')?.addEventListener('click', () => {
        this.playUiSound();
        this.renderLevelsList();
        this.showScreen('levels');
      });

      document.getElementById('btnMenuAchievements')?.addEventListener('click', () => {
        this.playUiSound();
        this.openAchievementsModal();
      });

      document.getElementById('btnMenuSettings')?.addEventListener('click', () => {
        this.playUiSound();
        this.openSettingsModal();
      });

      // Match Setup Controls
      this.bindSetupControls();

      // In-game HUD buttons
      document.getElementById('btnHudPause')?.addEventListener('click', () => {
        this.playUiSound();
        window.TTTGame.pauseGame();
        this.openModal('pause');
      });

      document.getElementById('btnHudRestart')?.addEventListener('click', () => {
        this.handleRestartRequest();
      });

      // Pause Modal Buttons
      document.getElementById('btnPauseResume')?.addEventListener('click', () => {
        this.playUiSound();
        this.closeModal('pause');
        window.TTTGame.resumeGame();
      });

      document.getElementById('btnPauseRestart')?.addEventListener('click', () => {
        this.playUiSound();
        this.closeModal('pause');
        window.TTTGame.restartRound();
      });

      document.getElementById('btnPauseSettings')?.addEventListener('click', () => {
        this.playUiSound();
        this.openSettingsModal();
      });

      document.getElementById('btnPauseQuit')?.addEventListener('click', () => {
        this.playUiSound();
        this.closeModal('pause');
        window.TTTAI.cancelThinking();
        this.showScreen('menu');
      });

      // Result Modal Buttons
      document.getElementById('btnResultNextRound')?.addEventListener('click', () => {
        this.playUiSound();
        this.closeModal('result');

        // If in Campaign Level and won, advance to next level if available
        if (this.setupConfig.level && window.TTTGame.state.winner === window.TTTGame.state.playerSymbol) {
          const nextLevelId = this.setupConfig.level + 1;
          const nextLevelDef = window.TTTSave.getLevel(nextLevelId);
          if (nextLevelDef) {
            this.setupConfig.level = nextLevelId;
            this.setupConfig.difficulty = nextLevelDef.difficulty;
            this.startMatch({
              mode: 'AI',
              playerSymbol: this.setupConfig.playerSymbol,
              difficulty: nextLevelDef.difficulty,
              level: nextLevelId,
              firstMove: 'PLAYER'
            });
            return;
          }
        }

        // Regular Next Round
        const nextRound = window.TTTGame.state.round + 1;
        const currentScores = window.TTTGame.state.scores;
        this.startMatch({
          mode: this.setupConfig.mode,
          playerSymbol: this.setupConfig.playerSymbol,
          difficulty: this.setupConfig.difficulty,
          level: this.setupConfig.level,
          firstMove: this.setupConfig.firstMove,
          round: nextRound,
          scores: currentScores
        });
      });

      document.getElementById('btnResultReplay')?.addEventListener('click', () => {
        this.playUiSound();
        this.closeModal('result');
        window.TTTGame.restartRound();
      });

      document.getElementById('btnResultMenu')?.addEventListener('click', () => {
        this.playUiSound();
        this.closeModal('result');
        this.showScreen('menu');
      });

      // Settings Modal toggles
      this.bindSettingsControls();

      // Game Controller event listeners
      window.TTTGame.on('stateChanged', (state) => this.updateHUD(state));
      window.TTTGame.on('turnChanged', (state) => this.updateTurnUI(state));
      window.TTTGame.on('piecePlaced', (data) => this.renderPlacedPiece(data.index, data.player));
      window.TTTGame.on('aiThinking', (data) => this.updateAIThinkingUI(data.isThinking));
      window.TTTGame.on('gameOver', (result) => this.handleGameOver(result));
      window.TTTGame.on('cellFocused', (index) => this.updateCellFocus(index));

      // Global Keyboard navigation
      window.addEventListener('keydown', (e) => this.handleGlobalKeyDown(e));

      // Global Volume Quick Toggle
      document.getElementById('btnGlobalMute')?.addEventListener('click', () => {
        const s = window.TTTSave.getSettings();
        const next = !s.sound;
        window.TTTSave.updateSettings({ sound: next });
        window.TTTAudio.setSoundEnabled(next);
        this.updateAudioIcon(next);
      });
    },

    playUiSound() {
      if (window.TTTAudio) window.TTTAudio.playClick();
    },

    bindSetupControls() {
      // Symbol Selection (X / O)
      const symbolBtns = document.querySelectorAll('.setup-symbol-btn');
      symbolBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.playUiSound();
          symbolBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.setupConfig.playerSymbol = btn.getAttribute('data-symbol');
        });
      });

      // Difficulty Selection
      const diffBtns = document.querySelectorAll('.setup-diff-btn');
      diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.playUiSound();
          diffBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.setupConfig.difficulty = btn.getAttribute('data-diff');
        });
      });

      // First Move Selection
      const firstMoveBtns = document.querySelectorAll('.setup-first-btn');
      firstMoveBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.playUiSound();
          firstMoveBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.setupConfig.firstMove = btn.getAttribute('data-first');
        });
      });

      // Start Match button
      document.getElementById('btnStartMatch')?.addEventListener('click', () => {
        this.playUiSound();
        this.startMatch({
          mode: 'AI',
          playerSymbol: this.setupConfig.playerSymbol,
          difficulty: this.setupConfig.difficulty,
          firstMove: this.setupConfig.firstMove,
          level: null
        });
      });

      // Back to Menu from Setup
      document.getElementById('btnSetupBack')?.addEventListener('click', () => {
        this.playUiSound();
        this.showScreen('menu');
      });

      // Back to Menu from Levels
      document.getElementById('btnLevelsBack')?.addEventListener('click', () => {
        this.playUiSound();
        this.showScreen('menu');
      });
    },

    bindSettingsControls() {
      const soundToggle = document.getElementById('settingSound');
      const musicToggle = document.getElementById('settingMusic');
      const animToggle = document.getElementById('settingAnim');
      const themeToggle = document.getElementById('settingTheme');
      const confirmToggle = document.getElementById('settingConfirmRestart');

      soundToggle?.addEventListener('change', (e) => {
        const val = e.target.checked;
        window.TTTSave.updateSettings({ sound: val });
        window.TTTAudio.setSoundEnabled(val);
        this.updateAudioIcon(val);
      });

      musicToggle?.addEventListener('change', (e) => {
        const val = e.target.checked;
        window.TTTSave.updateSettings({ music: val });
        window.TTTAudio.setMusicEnabled(val);
      });

      animToggle?.addEventListener('change', (e) => {
        const val = e.target.value;
        window.TTTSave.updateSettings({ animation: val });
      });

      themeToggle?.addEventListener('change', (e) => {
        const val = e.target.value;
        window.TTTSave.updateSettings({ theme: val });
        document.body.setAttribute('data-theme', val);
      });

      confirmToggle?.addEventListener('change', (e) => {
        const val = e.target.checked;
        window.TTTSave.updateSettings({ confirmRestart: val });
      });

      document.getElementById('btnCloseSettings')?.addEventListener('click', () => {
        this.playUiSound();
        this.closeModal('settings');
      });

      document.getElementById('btnCloseAchievements')?.addEventListener('click', () => {
        this.playUiSound();
        this.closeModal('achievements');
      });
    },

    applySavedSettings() {
      const s = window.TTTSave.getSettings();
      const soundToggle = document.getElementById('settingSound');
      const musicToggle = document.getElementById('settingMusic');
      const animToggle = document.getElementById('settingAnim');
      const themeToggle = document.getElementById('settingTheme');
      const confirmToggle = document.getElementById('settingConfirmRestart');

      if (soundToggle) soundToggle.checked = s.sound !== false;
      if (musicToggle) musicToggle.checked = s.music !== false;
      if (animToggle) animToggle.value = s.animation || 'full';
      if (themeToggle) themeToggle.value = s.theme || 'dark';
      if (confirmToggle) confirmToggle.checked = s.confirmRestart !== false;

      document.body.setAttribute('data-theme', s.theme || 'dark');
      this.updateAudioIcon(s.sound !== false);
    },

    updateAudioIcon(isSoundOn) {
      const btn = document.getElementById('btnGlobalMute');
      if (btn) {
        btn.innerHTML = isSoundOn ? '🔊' : '🔇';
        btn.title = isSoundOn ? 'Mute Audio' : 'Unmute Audio';
      }
    },

    showScreen(screenId) {
      this.currentScreen = screenId;
      Object.keys(this.screens).forEach(key => {
        const el = this.screens[key];
        if (el) {
          el.classList.toggle('active', key === screenId);
        }
      });

      // Clear any pending AI when leaving gameplay
      if (screenId !== 'game') {
        window.TTTAI.cancelThinking();
        if (window.TTTEffects) window.TTTEffects.clear();
      }
    },

    openModal(modalKey) {
      const modal = this.modals[modalKey];
      if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
      }
    },

    closeModal(modalKey) {
      const modal = this.modals[modalKey];
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
    },

    // Render the 3x3 Grid
    renderBoardGrid() {
      if (!this.boardEl) return;
      this.boardEl.innerHTML = '';

      const cellNames = [
        'Top Left', 'Top Center', 'Top Right',
        'Middle Left', 'Center', 'Middle Right',
        'Bottom Left', 'Bottom Center', 'Bottom Right'
      ];

      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'ttt-cell';
        cell.setAttribute('data-index', i);
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', `Cell ${i + 1}, ${cellNames[i]}, empty`);
        cell.setAttribute('tabindex', '0');

        // Internal cell bezel plate
        cell.innerHTML = `
          <div class="cell-inner">
            <div class="cell-piece-slot"></div>
          </div>
        `;

        cell.addEventListener('click', () => {
          window.TTTGame.handleCellClick(i);
        });

        cell.addEventListener('mouseenter', () => {
          window.TTTGame.focusedCellIndex = i;
          this.updateCellFocus(i);
        });

        this.boardEl.appendChild(cell);
      }
    },

    // Render 3D Piece into Cell
    renderPlacedPiece(index, player) {
      const cell = this.boardEl.querySelector(`[data-index="${index}"]`);
      if (!cell) return;

      const slot = cell.querySelector('.cell-piece-slot');
      if (!slot) return;

      cell.classList.add('occupied', player.toLowerCase());
      cell.setAttribute('aria-label', `Cell ${index + 1}, ${player}`);

      // Create realistic 3D sculpted piece
      slot.innerHTML = player === 'X' ? this.create3DXPiece() : this.create3DOPiece();

      // Trigger cell impact particles
      const rect = cell.getBoundingClientRect();
      const boardRect = this.boardEl.parentElement.getBoundingClientRect();
      const centerX = (rect.left + rect.width / 2) - boardRect.left;
      const centerY = (rect.top + rect.height / 2) - boardRect.top;
      const particleColor = player === 'X' ? '#38bdf8' : '#fbbf24';

      if (window.TTTEffects) {
        window.TTTEffects.triggerPlacementImpact(centerX, centerY, particleColor);
      }
    },

    create3DXPiece() {
      return `
        <div class="piece-3d piece-x">
          <div class="x-bar x-bar-1"></div>
          <div class="x-bar x-bar-2"></div>
        </div>
      `;
    },

    create3DOPiece() {
      return `
        <div class="piece-3d piece-o">
          <div class="o-ring-outer"></div>
          <div class="o-ring-inner"></div>
        </div>
      `;
    },

    updateHUD(state) {
      if (this.roundDisplay) {
        this.roundDisplay.textContent = `ROUND ${String(state.round).padStart(2, '0')}`;
      }

      if (this.playerScoreDisplay) {
        this.playerScoreDisplay.textContent = state.scores.player;
      }
      if (this.opponentScoreDisplay) {
        this.opponentScoreDisplay.textContent = state.scores.opponent;
      }
      if (this.drawsDisplay) {
        this.drawsDisplay.textContent = state.scores.draws;
      }

      // Badges
      if (this.playerBadgeLabel) {
        this.playerBadgeLabel.textContent = state.mode === 'PVP' ? 'PLAYER 1 (X)' : `PLAYER (${state.playerSymbol})`;
      }
      if (this.opponentBadgeLabel) {
        if (state.mode === 'PVP') {
          this.opponentBadgeLabel.textContent = 'PLAYER 2 (O)';
        } else if (state.mode === 'DEMO') {
          this.opponentBadgeLabel.textContent = 'AI 2 (O)';
        } else {
          this.opponentBadgeLabel.textContent = `${state.difficulty.toUpperCase()} AI (${state.opponentSymbol})`;
        }
      }

      if (this.difficultyBadge) {
        if (state.mode === 'AI') {
          this.difficultyBadge.textContent = state.difficulty.toUpperCase();
          this.difficultyBadge.className = `hud-diff-tag diff-${state.difficulty}`;
          this.difficultyBadge.style.display = 'inline-block';
        } else {
          this.difficultyBadge.style.display = 'none';
        }
      }

      if (this.streakBadge) {
        if (state.streak > 1 && state.mode === 'AI') {
          this.streakBadge.textContent = `STREAK x${state.streak}`;
          this.streakBadge.style.display = 'inline-block';
        } else {
          this.streakBadge.style.display = 'none';
        }
      }

      this.clearBoardVisuals();
      this.updateTurnUI(state);
    },

    updateTurnUI(state) {
      if (!this.turnIndicator) return;

      if (state.gameStatus !== 'playing') {
        this.turnIndicator.textContent = state.gameStatus.toUpperCase();
        return;
      }

      if (state.mode === 'DEMO') {
        this.turnIndicator.innerHTML = `<span class="turn-dot"></span> AI (${state.currentPlayer}) THINKING...`;
        return;
      }

      if (state.mode === 'PVP') {
        this.turnIndicator.innerHTML = `<span class="turn-dot"></span> PLAYER ${state.currentPlayer}'S TURN`;
        return;
      }

      // Player vs AI
      if (state.currentPlayer === state.playerSymbol) {
        this.turnIndicator.innerHTML = `<span class="turn-dot player-turn"></span> YOUR MOVE`;
      } else {
        this.turnIndicator.innerHTML = `<span class="turn-dot ai-turn"></span> AI THINKING...`;
      }
    },

    updateAIThinkingUI(isThinking) {
      if (this.aiThinkingEl) {
        this.aiThinkingEl.classList.toggle('active', isThinking);
      }
      if (this.turnIndicator && isThinking && window.TTTGame.state.mode === 'AI') {
        this.turnIndicator.innerHTML = `<span class="turn-dot ai-turn"></span> AI THINKING <span class="pulsing-dots">● ● ●</span>`;
      }
    },

    updateCellFocus(index) {
      const cells = this.boardEl.querySelectorAll('.ttt-cell');
      cells.forEach((c, idx) => {
        c.classList.toggle('keyboard-focused', idx === index);
      });
    },

    clearBoardVisuals() {
      const cells = this.boardEl.querySelectorAll('.ttt-cell');
      cells.forEach(c => {
        c.className = 'ttt-cell';
        const slot = c.querySelector('.cell-piece-slot');
        if (slot) slot.innerHTML = '';
      });
      if (this.winningLineSvg) {
        this.winningLineSvg.style.display = 'none';
      }
      if (this.winningLineEl) {
        this.winningLineEl.setAttribute('x1', '0');
        this.winningLineEl.setAttribute('y1', '0');
        this.winningLineEl.setAttribute('x2', '0');
        this.winningLineEl.setAttribute('y2', '0');
      }
    },

    handleRestartRequest() {
      const settings = window.TTTSave.getSettings();
      if (settings.confirmRestart && window.TTTGame.state.moveCount > 0 && window.TTTGame.state.gameStatus === 'playing') {
        this.openModal('confirm');
        const yesBtn = document.getElementById('btnConfirmYes');
        const noBtn = document.getElementById('btnConfirmNo');

        const cleanup = () => {
          yesBtn?.removeEventListener('click', onYes);
          noBtn?.removeEventListener('click', onNo);
          this.closeModal('confirm');
        };

        const onYes = () => {
          this.playUiSound();
          cleanup();
          window.TTTGame.restartRound();
        };

        const onNo = () => {
          this.playUiSound();
          cleanup();
        };

        yesBtn?.addEventListener('click', onYes);
        noBtn?.addEventListener('click', onNo);
      } else {
        this.playUiSound();
        window.TTTGame.restartRound();
      }
    },

    handleGameOver(result) {
      // 1. Highlight winning combination and animate laser vector line
      if (result.line && this.boardEl) {
        const cells = this.boardEl.querySelectorAll('.ttt-cell');
        result.line.forEach(idx => {
          cells[idx]?.classList.add('winning-cell');
        });

        this.drawWinningLine(result.line);
      }

      // 2. Particle fireworks if player won
      if (result.matchResult === 'win' && window.TTTEffects) {
        window.TTTEffects.triggerVictory();
      }

      // 3. Delay result modal slightly to appreciate the winning line animation
      setTimeout(() => {
        this.showResultModal(result);
      }, 1100);
    },

    drawWinningLine(line) {
      if (!this.winningLineSvg || !this.winningLineEl || !this.boardEl) return;

      const cells = this.boardEl.querySelectorAll('.ttt-cell');
      const firstCell = cells[line[0]];
      const lastCell = cells[line[2]];

      if (!firstCell || !lastCell) return;

      const boardRect = this.boardEl.getBoundingClientRect();
      const firstRect = firstCell.getBoundingClientRect();
      const lastRect = lastCell.getBoundingClientRect();

      const x1 = firstRect.left + firstRect.width / 2 - boardRect.left;
      const y1 = firstRect.top + firstRect.height / 2 - boardRect.top;
      const x2 = lastRect.left + lastRect.width / 2 - boardRect.left;
      const y2 = lastRect.top + lastRect.height / 2 - boardRect.top;

      this.winningLineEl.setAttribute('x1', x1);
      this.winningLineEl.setAttribute('y1', y1);
      this.winningLineEl.setAttribute('x2', x2);
      this.winningLineEl.setAttribute('y2', y2);

      this.winningLineSvg.style.display = 'block';
      this.winningLineEl.classList.remove('animate');
      void this.winningLineEl.offsetWidth; // Trigger reflow
      this.winningLineEl.classList.add('animate');
    },

    showResultModal(result) {
      const titleEl = document.getElementById('resultTitle');
      const subtitleEl = document.getElementById('resultSubtitle');
      const starsRow = document.getElementById('resultStarsRow');
      const scoreVal = document.getElementById('resultScoreVal');
      const xpVal = document.getElementById('resultXpVal');
      const streakVal = document.getElementById('resultStreakVal');
      const nextBtn = document.getElementById('btnResultNextRound');

      if (result.matchResult === 'win') {
        titleEl.textContent = 'VICTORY';
        titleEl.className = 'result-title win';
        subtitleEl.textContent = this.setupConfig.level ? `Level ${this.setupConfig.level} Complete!` : 'Exquisite strategic mastery!';

        // Star display
        let starsHtml = '';
        for (let s = 1; s <= 3; s++) {
          starsHtml += `<span class="result-star ${s <= result.stars ? 'earned' : 'empty'}">★</span>`;
        }
        starsRow.innerHTML = starsHtml;
        starsRow.style.display = 'flex';

        scoreVal.textContent = `+${result.scoreGained}`;
        xpVal.textContent = `+${result.xpGained} XP`;
        streakVal.textContent = result.streak > 1 ? `x${result.streak}` : '1';
        if (nextBtn) nextBtn.textContent = this.setupConfig.level ? 'NEXT LEVEL' : 'NEXT ROUND';
      } else if (result.matchResult === 'loss') {
        titleEl.textContent = 'DEFEAT';
        titleEl.className = 'result-title loss';
        subtitleEl.textContent = 'The opponent broke through your defenses.';
        starsRow.style.display = 'none';

        scoreVal.textContent = '0';
        xpVal.textContent = '+10 XP';
        streakVal.textContent = 'Reset';
        if (nextBtn) nextBtn.textContent = 'RETRY';
      } else {
        // Draw
        titleEl.textContent = 'STALEMATE';
        titleEl.className = 'result-title draw';
        subtitleEl.textContent = 'A balanced clash of equal minds.';
        starsRow.style.display = 'none';

        scoreVal.textContent = `+${result.scoreGained}`;
        xpVal.textContent = '+15 XP';
        streakVal.textContent = `${result.streak}`;
        if (nextBtn) nextBtn.textContent = 'PLAY AGAIN';
      }

      this.openModal('result');
    },

    // Campaign Level Selection
    renderLevelsList() {
      const listContainer = document.getElementById('levelsGrid');
      if (!listContainer) return;
      listContainer.innerHTML = '';

      const levels = window.TTTSave.getLevels();
      const unlocked = window.TTTSave.data.unlockedLevels;
      const completed = window.TTTSave.data.completedLevels;

      levels.forEach(lvl => {
        const isUnlocked = unlocked.includes(lvl.id);
        const comp = completed[lvl.id];
        const stars = comp ? comp.stars : 0;

        const card = document.createElement('div');
        card.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', isUnlocked ? '0' : '-1');
        card.setAttribute('aria-label', `Level ${lvl.id}: ${lvl.name}, ${isUnlocked ? 'unlocked' : 'locked'}`);

        let starsHtml = '';
        for (let s = 1; s <= 3; s++) {
          starsHtml += `<span class="lvl-star ${s <= stars ? 'active' : ''}">★</span>`;
        }

        card.innerHTML = `
          <div class="lvl-header">
            <span class="lvl-num">LEVEL ${String(lvl.id).padStart(2, '0')}</span>
            <span class="lvl-diff-tag diff-${lvl.difficulty}">${lvl.difficulty.toUpperCase()}</span>
          </div>
          <h4 class="lvl-name">${lvl.name}</h4>
          <p class="lvl-desc">${lvl.desc}</p>
          <div class="lvl-footer">
            <div class="lvl-stars">${starsHtml}</div>
            <div class="lvl-status">${isUnlocked ? (comp ? 'COMPLETED' : 'READY') : '🔒 LOCKED'}</div>
          </div>
        `;

        if (isUnlocked) {
          card.addEventListener('click', () => {
            this.playUiSound();
            this.setupConfig.level = lvl.id;
            this.setupConfig.difficulty = lvl.difficulty;
            this.startMatch({
              mode: 'AI',
              playerSymbol: 'X',
              difficulty: lvl.difficulty,
              level: lvl.id,
              firstMove: 'PLAYER'
            });
          });
        }

        listContainer.appendChild(card);
      });
    },

    // Achievements Modal
    openAchievementsModal() {
      const container = document.getElementById('achievementsList');
      if (!container) return;
      container.innerHTML = '';

      const achList = window.TTTSave.getAchievements();
      achList.forEach(ach => {
        const item = document.createElement('div');
        item.className = `achievement-item ${ach.unlocked ? 'unlocked' : 'locked'}`;
        item.innerHTML = `
          <div class="ach-icon">${ach.icon}</div>
          <div class="ach-info">
            <h4 class="ach-name">${ach.name}</h4>
            <p class="ach-desc">${ach.desc}</p>
          </div>
          <div class="ach-status">
            ${ach.unlocked ? '<span class="ach-badge-unlocked">UNLOCKED</span>' : '<span class="ach-badge-locked">LOCKED</span>'}
          </div>
        `;
        container.appendChild(item);
      });

      this.openModal('achievements');
    },

    showAchievementToast(achievement) {
      const toast = document.createElement('div');
      toast.className = 'achievement-toast animate-in';
      toast.innerHTML = `
        <div class="ach-toast-icon">${achievement.icon}</div>
        <div class="ach-toast-content">
          <span class="ach-toast-sub">ACHIEVEMENT UNLOCKED</span>
          <strong class="ach-toast-title">${achievement.name}</strong>
        </div>
      `;
      document.body.appendChild(toast);

      if (window.TTTAudio) window.TTTAudio.playLevelUnlocked();

      setTimeout(() => {
        toast.classList.add('animate-out');
        setTimeout(() => toast.remove(), 400);
      }, 4500);
    },

    openSettingsModal() {
      this.applySavedSettings();
      this.openModal('settings');
    },

    startMatch(config) {
      this.showScreen('game');
      window.TTTGame.startMatch(config);
    },

    handleGlobalKeyDown(e) {
      if (this.currentScreen !== 'game') return;

      if (e.key === 'Escape') {
        e.preventDefault();
        if (this.modals.pause.classList.contains('active')) {
          this.closeModal('pause');
          window.TTTGame.resumeGame();
        } else if (!this.modals.result.classList.contains('active')) {
          window.TTTGame.pauseGame();
          this.openModal('pause');
        }
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        if (!this.modals.pause.classList.contains('active') && !this.modals.result.classList.contains('active')) {
          e.preventDefault();
          this.handleRestartRequest();
        }
        return;
      }

      // Arrow keys navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const dir = e.key.replace('Arrow', '').toLowerCase();
        window.TTTGame.navigateCell(dir);
        return;
      }

      // Enter / Space to activate focused cell
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('ttt-cell') || e.target === document.body) {
          e.preventDefault();
          window.TTTGame.activateFocusedCell();
        }
      }
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    App.init();
    window.TTTApp = App;
  });
})();

