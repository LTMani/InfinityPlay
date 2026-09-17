/**
 * Nokia Snake - UI & Canvas Renderer
 * Handles LCD Canvas rendering, pixel-perfect snake segments, directional eyes,
 * screen switching, modals, and HUD updates.
 */

(function() {
  'use strict';

  const COLOR_THEMES = {
    green: {
      bg: '#9ba88d',
      pixel: '#1f271b',
      ghost: 'rgba(31, 39, 27, 0.06)',
      border: '#1f271b',
      accent: '#2c3926'
    },
    amber: {
      bg: '#c29a4a',
      pixel: '#2b1c06',
      ghost: 'rgba(43, 28, 6, 0.06)',
      border: '#2b1c06',
      accent: '#3e2808'
    },
    mono: {
      bg: '#8c9597',
      pixel: '#16191b',
      ghost: 'rgba(22, 25, 27, 0.06)',
      border: '#16191b',
      accent: '#262b2e'
    }
  };

  class UIManager {
    constructor() {
      this.engine = window.NokiaSnake.engine;
      this.storage = window.NokiaSnake.storage;
      this.audio = window.NokiaSnake.audio;

      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

      this.gridSize = 20;
      this.cellSize = 20; // Canvas is 400x400 internally
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.currentScreen = 'menu';
      this.theme = COLOR_THEMES.green;

      this.init();
    }

    init() {
      this.engine.setUI(this);
      this.applyTheme(this.storage.settings.theme || 'green');
      this.setupCanvas();
      this.bindDOMEvents();
      this.updateMenuStats();
      this.showScreen('menu');

      // Initial idle render on canvas
      this.render(this.engine.snake, this.engine.food);
    }

    applyTheme(themeKey) {
      this.theme = COLOR_THEMES[themeKey] || COLOR_THEMES.green;
      const root = document.documentElement;
      root.style.setProperty('--lcd-bg', this.theme.bg);
      root.style.setProperty('--lcd-pixel', this.theme.pixel);
      root.style.setProperty('--lcd-border', this.theme.border);
    }

    setupCanvas() {
      if (!this.canvas || !this.ctx) return;

      // Fixed 400x400 virtual resolution (20x20 grid with 20px cells)
      const baseSize = 400;
      this.canvas.width = baseSize * this.dpr;
      this.canvas.height = baseSize * this.dpr;

      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);
      this.ctx.imageSmoothingEnabled = false;

      this.cellSize = baseSize / this.gridSize;
    }

    bindDOMEvents() {
      // Menu screen buttons
      document.getElementById('btnStartGame')?.addEventListener('click', () => {
        this.audio.playClick();
        this.engine.start();
      });

      document.getElementById('btnHowToPlay')?.addEventListener('click', () => {
        this.audio.playClick();
        this.openModal('modalHowToPlay');
      });

      document.getElementById('btnSettings')?.addEventListener('click', () => {
        this.audio.playClick();
        this.syncSettingsUI();
        this.openModal('modalSettings');
      });

      document.getElementById('btnStats')?.addEventListener('click', () => {
        this.audio.playClick();
        this.syncStatsUI();
        this.openModal('modalStats');
      });

      // Pause screen buttons
      document.getElementById('btnResumeGame')?.addEventListener('click', () => {
        this.audio.playClick();
        this.engine.resume();
      });

      document.getElementById('btnRestartGame')?.addEventListener('click', () => {
        this.audio.playClick();
        this.engine.restart();
      });

      document.getElementById('btnPauseMenu')?.addEventListener('click', () => {
        this.audio.playClick();
        this.engine.toMenu();
      });

      // Game Over buttons
      document.getElementById('btnPlayAgain')?.addEventListener('click', () => {
        this.audio.playClick();
        this.engine.restart();
      });

      document.getElementById('btnGameOverMenu')?.addEventListener('click', () => {
        this.audio.playClick();
        this.engine.toMenu();
      });

      // Top bar actions
      document.getElementById('btnSoundToggle')?.addEventListener('click', () => {
        const newSound = !this.storage.settings.sound;
        this.storage.saveSettings({ sound: newSound });
        this.audio.setSoundEnabled(newSound);
        this.updateSoundIcons();
      });

      // Modal close buttons
      document.querySelectorAll('.retro-modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
          this.audio.playClick();
          this.closeModals();
        });
      });

      // Close modal on outside click
      document.querySelectorAll('.retro-modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) {
            this.closeModals();
          }
        });
      });

      // Settings form events
      document.getElementById('settingSoundToggle')?.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        this.storage.saveSettings({ sound: enabled });
        this.audio.setSoundEnabled(enabled);
        this.updateSoundIcons();
      });

      document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          if (e.target.checked) {
            this.storage.saveSettings({ difficulty: e.target.value });
            this.audio.playClick();
          }
        });
      });

      document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          if (e.target.checked) {
            this.storage.saveSettings({ theme: e.target.value });
            this.applyTheme(e.target.value);
            this.render(this.engine.snake, this.engine.food);
            this.audio.playClick();
          }
        });
      });

      document.getElementById('settingScanlinesToggle')?.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        this.storage.saveSettings({ scanlines: enabled });
        document.getElementById('lcdOverlay')?.classList.toggle('no-scanlines', !enabled);
        this.audio.playClick();
      });

      // Reset stats button
      document.getElementById('btnResetStats')?.addEventListener('click', () => {
        if (confirm('Reset all game statistics and high score?')) {
          this.storage.resetStats();
          this.syncStatsUI();
          this.updateMenuStats();
          this.updateHUD(0, 0, 0);
          this.audio.playClick();
        }
      });

      // Window resize listener
      window.addEventListener('resize', () => {
        this.setupCanvas();
        this.render(this.engine.snake, this.engine.food);
      });

      this.updateSoundIcons();
      if (!this.storage.settings.scanlines) {
        document.getElementById('lcdOverlay')?.classList.add('no-scanlines');
      }
    }

    updateSoundIcons() {
      const isSound = this.storage.settings.sound;
      const btn = document.getElementById('btnSoundToggle');
      if (btn) {
        btn.textContent = isSound ? '🔊' : '🔇';
        btn.title = isSound ? 'Mute Sound' : 'Unmute Sound';
      }
      const checkbox = document.getElementById('settingSoundToggle');
      if (checkbox) {
        checkbox.checked = isSound;
      }
    }

    updateMenuStats() {
      const menuHigh = document.getElementById('menuHighScore');
      if (menuHigh) {
        menuHigh.textContent = this.storage.highScore.toString().padStart(4, '0');
      }
    }

    showScreen(screenName) {
      this.currentScreen = screenName;

      // Screen elements
      const scrMenu = document.getElementById('screenMenu');
      const scrGame = document.getElementById('screenGame');
      const scrPause = document.getElementById('overlayPause');
      const scrGameOver = document.getElementById('overlayGameOver');

      if (scrMenu) scrMenu.classList.toggle('active', screenName === 'menu');
      if (scrGame) scrGame.classList.toggle('active', screenName === 'game');
      if (scrPause) scrPause.classList.toggle('active', screenName === 'pause');
      if (scrGameOver) scrGameOver.classList.toggle('active', screenName === 'gameover');

      if (screenName === 'menu') {
        this.updateMenuStats();
      }
    }

    openModal(modalId) {
      this.closeModals();
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
      }
    }

    closeModals() {
      document.querySelectorAll('.retro-modal-backdrop').forEach(m => m.classList.remove('active'));
    }

    syncSettingsUI() {
      const settings = this.storage.settings;
      this.updateSoundIcons();

      const diffRadio = document.querySelector(`input[name="difficulty"][value="${settings.difficulty}"]`);
      if (diffRadio) diffRadio.checked = true;

      const themeRadio = document.querySelector(`input[name="theme"][value="${settings.theme}"]`);
      if (themeRadio) themeRadio.checked = true;

      const scanlineCheck = document.getElementById('settingScanlinesToggle');
      if (scanlineCheck) scanlineCheck.checked = settings.scanlines;
    }

    syncStatsUI() {
      const stats = this.storage.stats;
      document.getElementById('statGamesPlayed').textContent = stats.gamesPlayed;
      document.getElementById('statGamesOver').textContent = stats.gamesOver;
      document.getElementById('statHighestScore').textContent = stats.highestScore;
      document.getElementById('statTotalFood').textContent = stats.totalFoodCollected;
      document.getElementById('statLongestSnake').textContent = stats.longestSnake;
      document.getElementById('statBestScore').textContent = stats.bestScore;
    }

    updateHUD(score, highScore, food) {
      const hudScore = document.getElementById('hudScore');
      const hudHigh = document.getElementById('hudHighScore');
      const hudFood = document.getElementById('hudFood');

      if (hudScore) hudScore.textContent = score.toString().padStart(4, '0');
      if (hudHigh) hudHigh.textContent = highScore.toString().padStart(4, '0');
      if (hudFood) hudFood.textContent = food.toString().padStart(3, '0');
    }

    onGameStart() {
      this.closeModals();
      this.showScreen('game');
      this.updateHUD(0, this.storage.highScore, 0);
    }

    onGamePause() {
      this.showScreen('pause');
    }

    onGameResume() {
      this.showScreen('game');
    }

    onGameOver(reason, score, highScore, isNewHighScore) {
      const reasonEl = document.getElementById('gameOverReason');
      const scoreEl = document.getElementById('gameOverScore');
      const highEl = document.getElementById('gameOverHigh');
      const newHighBanner = document.getElementById('gameOverNewHighBanner');

      if (reasonEl) {
        if (reason === 'wall') reasonEl.textContent = 'CRASHED INTO WALL!';
        else if (reason === 'self') reasonEl.textContent = 'SELF COLLISION!';
        else if (reason === 'victory') reasonEl.textContent = 'GRID FULL! YOU WON!';
        else reasonEl.textContent = 'GAME OVER';
      }

      if (scoreEl) scoreEl.textContent = score.toString().padStart(4, '0');
      if (highEl) highEl.textContent = highScore.toString().padStart(4, '0');

      if (newHighBanner) {
        newHighBanner.style.display = isNewHighScore && score > 0 ? 'block' : 'none';
      }

      this.showScreen('gameover');
    }

    /**
     * Renders the complete 20x20 LCD scene
     */
    render(snake, food) {
      if (!this.ctx || !this.canvas) return;

      const ctx = this.ctx;
      const size = this.cellSize;
      const theme = this.theme;

      // 1. Clear background to LCD tint
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, 400, 400);

      // 2. Render subtle ghost pixel grid (dot matrix feel)
      ctx.fillStyle = theme.ghost;
      for (let y = 0; y < this.gridSize; y++) {
        for (let x = 0; x < this.gridSize; x++) {
          ctx.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
        }
      }

      // 3. Render Food item (Classic pixel bug/apple)
      if (food && typeof food.x === 'number') {
        const fx = food.x * size;
        const fy = food.y * size;
        ctx.fillStyle = theme.pixel;

        // Draw 3x3 pixel cluster with cross shape
        const p = size / 5;
        // Center cross
        ctx.fillRect(fx + p * 1.5, fy + p * 1.5, p * 2, p * 2);
        // Top dot
        ctx.fillRect(fx + p * 2, fy + p * 0.5, p, p);
        // Bottom dot
        ctx.fillRect(fx + p * 2, fy + p * 3.5, p, p);
        // Left dot
        ctx.fillRect(fx + p * 0.5, fy + p * 2, p, p);
        // Right dot
        ctx.fillRect(fx + p * 3.5, fy + p * 2, p, p);
      }

      // 4. Render Snake segments
      if (snake && snake.segments && snake.segments.length > 0) {
        ctx.fillStyle = theme.pixel;

        // Render body segments (skip head for special eye treatment)
        for (let i = 1; i < snake.segments.length; i++) {
          const seg = snake.segments[i];
          const sx = seg.x * size;
          const sy = seg.y * size;

          // Segment block with 1px inset margin
          ctx.fillRect(sx + 1, sy + 1, size - 2, size - 2);

          // Subtle inset hole in center of segment for classic Nokia LCD segment look
          ctx.fillStyle = theme.bg;
          ctx.fillRect(sx + size / 2 - 1, sy + size / 2 - 1, 2, 2);
          ctx.fillStyle = theme.pixel;
        }

        // Render Head
        const head = snake.head;
        const hx = head.x * size;
        const hy = head.y * size;

        // Main head block
        ctx.fillRect(hx + 1, hy + 1, size - 2, size - 2);

        // Directional pixel eyes (using theme.bg as eye color)
        ctx.fillStyle = theme.bg;
        const eyeSize = 3;
        const dir = snake.direction;

        if (dir.name === 'RIGHT') {
          ctx.fillRect(hx + size - 5, hy + 4, eyeSize, eyeSize);
          ctx.fillRect(hx + size - 5, hy + size - 7, eyeSize, eyeSize);
        } else if (dir.name === 'LEFT') {
          ctx.fillRect(hx + 3, hy + 4, eyeSize, eyeSize);
          ctx.fillRect(hx + 3, hy + size - 7, eyeSize, eyeSize);
        } else if (dir.name === 'UP') {
          ctx.fillRect(hx + 4, hy + 3, eyeSize, eyeSize);
          ctx.fillRect(hx + size - 7, hy + 3, eyeSize, eyeSize);
        } else if (dir.name === 'DOWN') {
          ctx.fillRect(hx + 4, hy + size - 5, eyeSize, eyeSize);
          ctx.fillRect(hx + size - 7, hy + size - 5, eyeSize, eyeSize);
        }
      }

      // 5. Border Wall
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 398, 398);
    }
  }

  window.NokiaSnake = window.NokiaSnake || {};
  window.NokiaSnake.ui = new UIManager();
})();
