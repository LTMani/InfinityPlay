/**
 * Color Match: Spectrum Arena - DOM UI Renderer & Screen Controller
 * Handles HUD rendering, target prism displays, dynamic grid layouts,
 * serpentine world maps, modal controllers, and achievement toasts.
 */

(function(window) {
  'use strict';

  class UIManager {
    constructor() {
      // Containers & screens
      this.screens = {
        menu: document.getElementById('menuScreen'),
        game: document.getElementById('gameScreen'),
        levelMap: document.getElementById('levelMapScreen'),
        modes: document.getElementById('modesScreen')
      };

      // Modals
      this.modals = {
        pause: document.getElementById('pauseModal'),
        victory: document.getElementById('victoryModal'),
        gameOver: document.getElementById('gameOverModal'),
        achievements: document.getElementById('achievementsModal'),
        howToPlay: document.getElementById('howToPlayModal')
      };

      // HUD elements
      this.hud = {
        score: document.getElementById('hudScore'),
        round: document.getElementById('hudRound'),
        combo: document.getElementById('hudCombo'),
        comboBadge: document.getElementById('hudComboBadge'),
        livesContainer: document.getElementById('hudLives'),
        timerBar: document.getElementById('hudTimerFill'),
        timerText: document.getElementById('hudTimerText'),
        modeTitle: document.getElementById('hudModeTitle')
      };

      // Game area elements
      this.gameArea = {
        arena: document.getElementById('gameArena'),
        promptTitle: document.getElementById('promptTitle'),
        promptSub: document.getElementById('promptSub'),
        targetPrism: document.getElementById('targetPrism'),
        targetSwatch: document.getElementById('targetSwatch'),
        targetSymbol: document.getElementById('targetSymbol'),
        targetLabel: document.getElementById('targetLabel'),
        optionsGrid: document.getElementById('optionsGrid')
      };

      // Map elements
      this.mapContainer = document.getElementById('worldMapContainer');
      this.currentWorldTab = 1;

      // Sound toggle button
      this.soundBtn = document.getElementById('btnSoundToggle');
      this.colorBlindToggle = document.getElementById('btnColorBlindToggle');
    }

    init() {
      // Listen for achievement unlocked events
      window.addEventListener('achievementUnlocked', (e) => {
        this.showAchievementToast(e.detail);
      });

      this.updateSoundBtn();
    }

    /**
     * Switch active top-level screen
     */
    showScreen(screenName) {
      Object.keys(this.screens).forEach(key => {
        if (this.screens[key]) {
          if (key === screenName) {
            this.screens[key].classList.remove('hidden');
          } else {
            this.screens[key].classList.add('hidden');
          }
        }
      });
      // Close all modals when switching screen
      this.closeAllModals();
    }

    showModal(modalName) {
      if (this.modals[modalName]) {
        this.modals[modalName].classList.remove('hidden');
      }
    }

    closeModal(modalName) {
      if (this.modals[modalName]) {
        this.modals[modalName].classList.add('hidden');
      }
    }

    closeAllModals() {
      Object.keys(this.modals).forEach(key => {
        if (this.modals[key]) this.modals[key].classList.add('hidden');
      });
    }

    updateSoundBtn() {
      if (!this.soundBtn) return;
      const muted = window.SoundEngine.muted;
      this.soundBtn.textContent = muted ? '🔇' : '🔊';
      this.soundBtn.setAttribute('title', muted ? 'Unmute Audio' : 'Mute Audio');
    }

    /**
     * Render the active question onto the Arena
     */
    renderQuestion(question, meta, onTileSelect) {
      // Update HUD metadata
      if (this.hud.score) this.hud.score.textContent = meta.score.toLocaleString();
      if (this.hud.round) this.hud.round.textContent = `${meta.round}/${meta.totalRounds > 100 ? '∞' : meta.totalRounds}`;
      if (this.hud.combo) this.hud.combo.textContent = `${meta.combo}x`;

      if (this.hud.comboBadge) {
        if (meta.combo >= 2) {
          this.hud.comboBadge.classList.remove('hidden');
          this.hud.comboBadge.classList.add('pulse');
        } else {
          this.hud.comboBadge.classList.add('hidden');
          this.hud.comboBadge.classList.remove('pulse');
        }
      }

      // Lives
      if (this.hud.livesContainer) {
        if (meta.lives !== undefined) {
          this.hud.livesContainer.innerHTML = '';
          for (let i = 0; i < 3; i++) {
            const heart = document.createElement('span');
            heart.className = `life-heart ${i < meta.lives ? 'alive' : 'lost'}`;
            heart.textContent = '♥';
            this.hud.livesContainer.appendChild(heart);
          }
        }
      }

      // Prompts
      if (this.gameArea.promptTitle) this.gameArea.promptTitle.textContent = question.prompt;
      if (this.gameArea.promptSub) this.gameArea.promptSub.textContent = question.instructionSub;

      // Target Prism presentation
      this.renderTargetPrism(question);

      // Options Grid
      this.renderOptionsGrid(question, onTileSelect);
    }

    renderTargetPrism(question) {
      const prism = this.gameArea.targetPrism;
      const swatch = this.gameArea.targetSwatch;
      const symbol = this.gameArea.targetSymbol;
      const label = this.gameArea.targetLabel;

      if (!prism || !swatch) return;

      // Reset animation states
      prism.className = 'target-prism';
      swatch.style.background = 'none';
      swatch.style.boxShadow = 'none';
      symbol.textContent = '';
      label.textContent = '';
      label.style.color = '#ffffff';

      if (question.type === 'brightest' || question.type === 'darkest' || question.type === 'odd_one') {
        // No single target to match; display inquiry emblem
        swatch.style.background = 'radial-gradient(circle, #1e293b 0%, #0f172a 100%)';
        symbol.textContent = question.type === 'brightest' ? '☀' : (question.type === 'darkest' ? '🌑' : '❓');
        symbol.style.fontSize = '3rem';
        label.textContent = 'SCAN OPTIONS';
        label.style.color = '#94a3b8';
        return;
      }

      if (question.type === 'stroop_name' || question.type === 'stroop_ink') {
        // Display Stroop colored word
        swatch.style.background = 'radial-gradient(circle, #1e1b4b 0%, #0f172a 100%)';
        label.textContent = question.stroopWord;
        label.style.color = question.stroopInk.hex;
        label.style.fontSize = '2.2rem';
        label.style.fontWeight = '900';
        symbol.textContent = question.stroopInk.symbol;
        return;
      }

      // Standard Target Color
      const color = question.targetColor;
      if (color) {
        swatch.style.background = color.gradient;
        swatch.style.boxShadow = `0 0 35px ${color.glow}`;
        symbol.textContent = color.symbol;
        symbol.style.color = color.textColor;

        if (question.type === 'visual_only') {
          label.textContent = '???';
          label.style.color = '#64748b';
        } else {
          label.textContent = color.name.toUpperCase();
          label.style.color = '#ffffff';
        }

        // Memory flash vanishing effect
        if (question.isMemoryFlash) {
          prism.classList.add('memory-flash-active');
          setTimeout(() => {
            swatch.style.background = '#1e293b';
            swatch.style.boxShadow = 'none';
            symbol.textContent = '❔';
            label.textContent = 'RECALL COLOR';
          }, 900);
        }
      }
    }

    renderOptionsGrid(question, onTileSelect) {
      const grid = this.gameArea.optionsGrid;
      if (!grid) return;

      grid.innerHTML = '';
      const count = question.options.length;

      // Apply appropriate grid column class
      grid.className = 'options-grid';
      if (count === 2) grid.classList.add('grid-cols-2');
      else if (count === 3) grid.classList.add('grid-cols-3');
      else if (count === 4) grid.classList.add('grid-cols-2-2');
      else if (count === 6) grid.classList.add('grid-cols-3-2');
      else if (count >= 8) grid.classList.add('grid-cols-4-2');

      const isColorBlind = window.SaveManager.state.colorBlindMode;

      question.options.forEach((optColor, idx) => {
        const btn = document.createElement('button');
        btn.className = 'color-tile-btn';
        btn.setAttribute('data-index', idx);
        btn.setAttribute('aria-label', `Option ${idx + 1}: ${optColor.name}`);
        btn.style.setProperty('--tile-glow', optColor.glow);
        btn.style.setProperty('--tile-gradient', optColor.gradient);

        btn.innerHTML = `
          <div class="tile-swatch" style="background: ${optColor.gradient};">
            <span class="tile-key-badge">${idx + 1}</span>
            <span class="tile-symbol" style="color: ${optColor.textColor};">${optColor.symbol}</span>
          </div>
          <span class="tile-name-label ${isColorBlind ? 'visible' : ''}">${optColor.name}</span>
        `;

        btn.addEventListener('click', (e) => {
          onTileSelect(idx, btn);
        });

        grid.appendChild(btn);
      });
    }

    /**
     * Update progress bar
     */
    updateTimer(remaining, total) {
      if (!this.hud.timerBar) return;
      const ratio = Math.max(0, Math.min(1, remaining / total));
      this.hud.timerBar.style.width = `${ratio * 100}%`;

      if (this.hud.timerText) {
        this.hud.timerText.textContent = `${Math.max(0, remaining).toFixed(1)}s`;
      }

      if (ratio <= 0.25) {
        this.hud.timerBar.classList.add('warning-pulse');
      } else {
        this.hud.timerBar.classList.remove('warning-pulse');
      }
    }

    /**
     * Render the serpentine 10-world level map
     */
    renderWorldMap(onLevelSelect) {
      if (!this.mapContainer) return;

      const save = window.SaveManager.state;
      const worlds = window.LevelSystem.worlds;

      let html = `
        <div class="world-tabs-bar">
          ${worlds.map(w => `
            <button class="world-tab-btn ${w.id === this.currentWorldTab ? 'active' : ''}" data-world="${w.id}">
              <span class="tab-icon">${w.icon}</span>
              <span class="tab-name">W${w.id}</span>
            </button>
          `).join('')}
        </div>
      `;

      const currentWorld = window.LevelSystem.getWorld(this.currentWorldTab);
      const levels = window.LevelSystem.getLevelsForWorld(this.currentWorldTab);

      html += `
        <div class="world-card-banner" style="border-left: 5px solid ${currentWorld.theme};">
          <div class="banner-meta">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="banner-world-num">WORLD ${currentWorld.id}</span>
              <span class="banner-diff-badge" style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 10px; font-size: 0.72rem; font-weight: 800; color: ${currentWorld.theme};">${currentWorld.difficulty.toUpperCase()}</span>
            </div>
            <h3 class="banner-world-title">${currentWorld.name}</h3>
            <p class="banner-world-desc">${currentWorld.description}</p>
          </div>
        </div>
        <div class="levels-serpentine-grid">
      `;

      levels.forEach(lvl => {
        const isUnlocked = (lvl.id <= save.unlockedLevel);
        const stars = save.levelStars[lvl.id] || 0;
        const bestScore = save.levelHighScores[lvl.id] || 0;
        const isChamp = lvl.isLevel100;

        html += `
          <button class="level-node-btn ${isUnlocked ? 'unlocked' : 'locked'} ${lvl.isMilestone ? 'milestone-node' : ''} ${isChamp ? 'championship-node' : ''}"
                  data-level-id="${lvl.id}" ${!isUnlocked ? 'disabled' : ''} title="${lvl.title}: ${lvl.description}">
            ${isChamp ? '<span class="milestone-crown" style="background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff;">👑 20-RD FINALE</span>' : (lvl.isMilestone ? '<span class="milestone-crown">👑 BOSS</span>' : '')}
            <span class="level-num">${lvl.id}</span>
            <div class="level-stars-row">
              <span class="star ${stars >= 1 ? 'earned' : ''}">★</span>
              <span class="star ${stars >= 2 ? 'earned' : ''}">★</span>
              <span class="star ${stars >= 3 ? 'earned' : ''}">★</span>
            </div>
            ${isUnlocked && bestScore > 0 ? `<span class="level-best-score">${bestScore}</span>` : ''}
          </button>
        `;
      });

      html += `</div>`;

      // If Level 100 has been beaten or Infinity Mode is unlocked, render the Infinity Mode portal!
      if (save.infinityModeUnlocked || save.unlockedLevel > 100) {
        html += `
          <div class="infinity-portal-card">
            <div class="portal-meta">
              <span class="portal-badge">UNLOCKED</span>
              <h4>♾️ INFINITY MODE ACTIVATED</h4>
              <p>Procedural endless spectrum scaling beyond Level 100. Ascend the infinite singularity!</p>
            </div>
            <button id="btnLaunchInfinity" class="modal-btn modal-btn-primary" style="padding: 10px 20px;">ENTER INFINITY ❯</button>
          </div>
        `;
      }
      this.mapContainer.innerHTML = html;

      // Bind world tab buttons
      this.mapContainer.querySelectorAll('.world-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.currentWorldTab = parseInt(btn.getAttribute('data-world'), 10);
          window.SoundEngine.playButtonClick();
          this.renderWorldMap(onLevelSelect);
        });
      });

      // Bind level node clicks
      this.mapContainer.querySelectorAll('.level-node-btn.unlocked').forEach(btn => {
        btn.addEventListener('click', () => {
          const lvlId = parseInt(btn.getAttribute('data-level-id'), 10);
          window.SoundEngine.playButtonClick();
          onLevelSelect(lvlId);
        });
      });

      // Bind Infinity Mode launcher
      const btnInfinity = this.mapContainer.querySelector('#btnLaunchInfinity');
      if (btnInfinity) {
        btnInfinity.addEventListener('click', () => {
          window.SoundEngine.playButtonClick();
          const targetLevel = Math.max(101, save.unlockedLevel);
          onLevelSelect(targetLevel);
        });
      }
    }

    /**
     * Render Achievements Modal
     */
    renderAchievementsModal() {
      const modal = this.modals.achievements;
      if (!modal) return;

      const listContainer = modal.querySelector('.achievements-list');
      if (!listContainer) return;

      const achievements = window.SaveManager.getAchievements();
      listContainer.innerHTML = achievements.map(ach => `
        <div class="achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}">
          <div class="ach-icon">${ach.icon}</div>
          <div class="ach-info">
            <h4 class="ach-title">${ach.title}</h4>
            <p class="ach-desc">${ach.desc}</p>
            ${ach.unlocked ? `<span class="ach-date">Unlocked ✓</span>` : `<span class="ach-locked">Locked</span>`}
          </div>
        </div>
      `).join('');

      this.showModal('achievements');
    }

    /**
     * Show brief banner toast when an achievement is achieved
     */
    showAchievementToast(achievement) {
      const toast = document.createElement('div');
      toast.className = 'achievement-toast animate-slide-in';
      toast.innerHTML = `
        <span class="toast-badge">ACHIEVEMENT UNLOCKED!</span>
        <div class="toast-body">
          <span class="toast-icon">${achievement.icon}</span>
          <div>
            <strong>${achievement.title}</strong>
            <p>${achievement.desc}</p>
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('animate-slide-out');
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 400);
      }, 3500);
    }

    /**
     * Render Level Complete / Victory Modal
     */
    renderVictoryModal(data, onNextLevel, onReplay, onMap) {
      const modal = this.modals.victory;
      if (!modal) return;

      const title = modal.querySelector('#victoryTitle');
      const scoreEl = modal.querySelector('#victoryScore');
      const timeEl = modal.querySelector('#victoryTime');
      const starsRow = modal.querySelector('#victoryStars');
      const xpEl = modal.querySelector('#victoryXP');
      const nextBtn = modal.querySelector('#btnVictoryNext');
      const replayBtn = modal.querySelector('#btnVictoryReplay');
      const mapBtn = modal.querySelector('#btnVictoryMap');

      if (title) {
        title.textContent = data.level && data.level.isMilestone
          ? '🌟 MILESTONE DOMINATED!'
          : 'SPECTRUM CLEAR!';
      }
      if (scoreEl) scoreEl.textContent = data.score.toLocaleString();
      if (timeEl) timeEl.textContent = `${data.elapsedSec}s (Avg ${data.avgReactionMs}ms)`;
      if (xpEl && data.saveResult) {
        xpEl.textContent = `+${data.saveResult.earnedXP} XP • +${data.saveResult.earnedCoins} Coins`;
      }

      if (starsRow) {
        starsRow.innerHTML = `
          <span class="modal-star ${data.stars >= 1 ? 'earned pop' : ''}">★</span>
          <span class="modal-star ${data.stars >= 2 ? 'earned pop' : ''}">★</span>
          <span class="modal-star ${data.stars >= 3 ? 'earned pop' : ''}">★</span>
        `;
      }

      if (nextBtn) {
        nextBtn.onclick = () => {
          this.closeModal('victory');
          onNextLevel();
        };
      }
      if (replayBtn) {
        replayBtn.onclick = () => {
          this.closeModal('victory');
          onReplay();
        };
      }
      if (mapBtn) {
        mapBtn.onclick = () => {
          this.closeModal('victory');
          onMap();
        };
      }

      this.showModal('victory');
    }

    /**
     * Render Game Over Modal
     */
    renderGameOverModal(data, onRetry, onMenu) {
      const modal = this.modals.gameOver;
      if (!modal) return;

      const reasonEl = modal.querySelector('#gameOverReason');
      const scoreEl = modal.querySelector('#gameOverScore');
      const roundEl = modal.querySelector('#gameOverRound');
      const retryBtn = modal.querySelector('#btnGameOverRetry');
      const menuBtn = modal.querySelector('#btnGameOverMenu');

      if (reasonEl) reasonEl.textContent = data.reason;
      if (scoreEl) scoreEl.textContent = data.score.toLocaleString();
      if (roundEl) roundEl.textContent = `Round / Wave: ${data.roundReached}`;

      if (retryBtn) {
        retryBtn.onclick = () => {
          this.closeModal('gameOver');
          onRetry();
        };
      }
      if (menuBtn) {
        menuBtn.onclick = () => {
          this.closeModal('gameOver');
          onMenu();
        };
      }

      this.showModal('gameOver');
    }
  }

  window.UIManager = new UIManager();
})(typeof window !== 'undefined' ? window : this);

