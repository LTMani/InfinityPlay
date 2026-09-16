/**
 * Whack-a-Mole: Arcade Edition - DOM UI Renderer & Board Controller
 * Handles dynamic 3D hole rendering with soil rims and overflow masks,
 * realistic wooden mallet cursor animation, HUD elements, world map, and modal controllers.
 */

(function(window) {
  'use strict';

  class UIManager {
    constructor() {
      this.screens = {
        menu: document.getElementById('menuScreen'),
        game: document.getElementById('gameScreen'),
        levelMap: document.getElementById('levelMapScreen'),
        modes: document.getElementById('modesScreen')
      };

      this.modals = {
        pause: document.getElementById('pauseModal'),
        victory: document.getElementById('victoryModal'),
        gameOver: document.getElementById('gameOverModal'),
        achievements: document.getElementById('achievementsModal'),
        howToPlay: document.getElementById('howToPlayModal')
      };

      this.hud = {
        score: document.getElementById('hudScore'),
        timeBar: document.getElementById('hudTimerFill'),
        timeText: document.getElementById('hudTimerText'),
        combo: document.getElementById('hudCombo'),
        comboBadge: document.getElementById('hudComboBadge'),
        livesRow: document.getElementById('hudLivesRow'),
        levelTag: document.getElementById('hudLevelTag')
      };

      this.boardContainer = document.getElementById('gameBoard');
      this.malletEl = document.getElementById('gameMallet');
      this.mapContainer = document.getElementById('worldMapContainer');
      this.currentWorldTab = 1;

      // Sound button
      this.btnSound = document.getElementById('btnSoundToggle');
    }

    init() {
      // Listen for achievement unlocked events
      window.addEventListener('achievementUnlocked', (e) => {
        this.showAchievementToast(e.detail);
      });

      this.setupMalletCursor();
      this.updateSoundBtn();
    }

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
      Object.keys(this.modals).forEach(k => {
        if (this.modals[k]) this.modals[k].classList.add('hidden');
      });
    }

    updateSoundBtn() {
      if (!this.btnSound) return;
      const enabled = window.SoundEngine.soundEnabled;
      this.btnSound.textContent = enabled ? '🔊' : '🔇';
    }

    /**
     * Setup custom 3D wooden mallet that follows mouse/touch and strikes on click
     */
    setupMalletCursor() {
      if (!this.malletEl) return;

      const onPointerMove = (e) => {
        // Position mallet near cursor with realistic offset
        this.malletEl.style.left = `${e.clientX}px`;
        this.malletEl.style.top = `${e.clientY}px`;
      };

      window.addEventListener('mousemove', onPointerMove);

      window.addEventListener('mousedown', () => {
        this.animateMalletStrike();
      });

      // Mobile touch move
      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          this.malletEl.style.left = `${e.touches[0].clientX}px`;
          this.malletEl.style.top = `${e.touches[0].clientY}px`;
        }
      }, { passive: true });
    }

    animateMalletStrike() {
      if (!this.malletEl) return;
      this.malletEl.classList.remove('striking');
      void this.malletEl.offsetWidth; // reflow
      this.malletEl.classList.add('striking');
      setTimeout(() => {
        this.malletEl.classList.remove('striking');
      }, 160);
    }

    /**
     * Build dynamic 3D board grid
     */
    renderBoard(grid, onHoleWhack) {
      if (!this.boardContainer) return;
      this.boardContainer.innerHTML = '';

      const rows = grid.rows || 3;
      const cols = grid.cols || 3;
      const totalHoles = rows * cols;

      this.boardContainer.className = `game-board grid-${rows}x${cols}`;

      for (let i = 0; i < totalHoles; i++) {
        const hole = document.createElement('div');
        hole.className = 'board-hole';
        hole.setAttribute('data-hole-id', i);

        hole.innerHTML = `
          <!-- Hole Rim & Soil Mound -->
          <div class="hole-rim"></div>
          <!-- Hole Depth Cavity -->
          <div class="hole-cavity">
            <!-- Mole Container with Clipping Overflow Mask -->
            <div class="mole-container" id="mole-${i}">
              <!-- Dynamic mole SVG injected here -->
            </div>
          </div>
          <!-- Numeric Hotkey Badge (for 1-9) -->
          ${i < 9 ? `<span class="hole-key-badge">${i + 1}</span>` : ''}
        `;

        // Click / Tap listener
        hole.addEventListener('pointerdown', (e) => {
          this.animateMalletStrike();
          onHoleWhack(i, hole);
        });

        this.boardContainer.appendChild(hole);
      }
    }

    /**
     * Spawn mole in designated hole
     */
    spawnMoleInHole(holeId, moleType, hp) {
      const container = document.getElementById(`mole-${holeId}`);
      if (!container) return;

      container.innerHTML = window.MoleManager.renderMoleSvg(moleType, hp, false);
      container.className = 'mole-container surfaced';
    }

    /**
     * Animate mole being hit
     */
    whackMoleInHole(holeId, moleType, remainingHp, isDead, scoreGain, combo, reactionMs) {
      const container = document.getElementById(`mole-${holeId}`);
      if (!container) return;

      if (!isDead && remainingHp > 0) {
        // Armored mole cracked
        container.innerHTML = window.MoleManager.renderMoleSvg(moleType, remainingHp, false);
        container.classList.add('cracked');
        setTimeout(() => container.classList.remove('cracked'), 150);
        return;
      }

      // Defeated mole
      container.innerHTML = window.MoleManager.renderMoleSvg(moleType, 0, true);
      container.className = 'mole-container whacked';

      // Floating score popup
      const holeEl = document.querySelector(`.board-hole[data-hole-id="${holeId}"]`);
      if (holeEl) {
        const rect = holeEl.getBoundingClientRect();
        const text = scoreGain > 0 ? `+${scoreGain}` : `${scoreGain}`;
        const typeClass = moleType === 'bomb' ? 'floating-bomb' : (moleType === 'golden' ? 'floating-gold' : 'floating-score');
        window.EffectsEngine.spawnFloatingText(document.body, rect.left + rect.width / 2, rect.top, text, typeClass);

        // Spawn Canvas splinters/sparks
        const fxCanvas = document.getElementById('effectsCanvas');
        if (fxCanvas) {
          const cRect = fxCanvas.getBoundingClientRect();
          window.EffectsEngine.spawnHitParticles(rect.left + rect.width / 2 - cRect.left, rect.top + rect.height / 2 - cRect.top, moleType);
        }
      }
    }

    /**
     * Natural mole retreat without being hit
     */
    retreatMoleFromHole(holeId) {
      const container = document.getElementById(`mole-${holeId}`);
      if (!container) return;

      container.className = 'mole-container retreating';
      setTimeout(() => {
        container.className = 'mole-container';
        container.innerHTML = '';
      }, 250);
    }

    updateTimer(remaining, total) {
      if (this.hud.timeBar) {
        const ratio = Math.max(0, Math.min(1, remaining / total));
        this.hud.timeBar.style.width = `${ratio * 100}%`;
        if (ratio <= 0.25) {
          this.hud.timeBar.classList.add('warning-pulse');
        } else {
          this.hud.timeBar.classList.remove('warning-pulse');
        }
      }
      if (this.hud.timeText) {
        const secs = Math.ceil(remaining);
        const mins = Math.floor(secs / 60);
        const remSecs = secs % 60;
        this.hud.timeText.textContent = `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
      }
    }

    updateScore(score) {
      if (this.hud.score) {
        this.hud.score.textContent = score.toLocaleString();
      }
    }

    updateCombo(combo) {
      if (this.hud.combo) {
        this.hud.combo.textContent = `${combo}x`;
      }
      if (this.hud.comboBadge) {
        if (combo >= 2) {
          this.hud.comboBadge.classList.remove('hidden');
          this.hud.comboBadge.classList.add('pulse');
        } else {
          this.hud.comboBadge.classList.add('hidden');
          this.hud.comboBadge.classList.remove('pulse');
        }
      }
    }

    updateLives(lives) {
      if (!this.hud.livesRow) return;
      this.hud.livesRow.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const heart = document.createElement('span');
        heart.className = `life-heart ${i < lives ? 'alive' : 'lost'}`;
        heart.textContent = '❤️';
        this.hud.livesRow.appendChild(heart);
      }
    }

    /**
     * Show Championship Phase Transition Banner
     */
    showPhaseBanner(phase, title, subtitle = '') {
      let banner = document.getElementById('hudPhaseBanner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'hudPhaseBanner';
        banner.className = 'hud-phase-banner';
        const arena = document.getElementById('gameBoardWrapper') || document.getElementById('gameScreen');
        if (arena) arena.appendChild(banner);
      }
      banner.innerHTML = `
        <div class="phase-banner-content phase-${phase}">
          <div class="phase-badge">STAGE ${phase}/4</div>
          <h3 class="phase-title">${title}</h3>
          <p class="phase-subtext">${subtitle}</p>
        </div>
      `;
      banner.classList.remove('hidden', 'fade-out');
      banner.classList.add('visible');

      if (this.phaseBannerTimer) clearTimeout(this.phaseBannerTimer);
      this.phaseBannerTimer = setTimeout(() => {
        banner.classList.add('fade-out');
        setTimeout(() => {
          banner.classList.remove('visible', 'fade-out');
          banner.classList.add('hidden');
        }, 500);
      }, 2600);
    }

    /**
     * Serpentine 10-World Level Selection Screen
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
          <button class="level-node-btn ${isUnlocked ? 'unlocked' : 'locked'} ${lvl.isChallenge ? 'milestone-node' : ''} ${isChamp ? 'championship-node' : ''}"
                  data-level-id="${lvl.id}" ${!isUnlocked ? 'disabled' : ''} title="${lvl.title}: ${lvl.description}">
            ${isChamp ? '<span class="milestone-crown" style="background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff;">👑 FINALE</span>' : (lvl.isChallenge ? '<span class="milestone-crown">👑 BOSS</span>' : '')}
            <span class="level-num">${lvl.id}</span>
            <div class="level-stars-row">
              <span class="star ${stars >= 1 ? 'earned' : ''}">⭐</span>
              <span class="star ${stars >= 2 ? 'earned' : ''}">⭐</span>
              <span class="star ${stars >= 3 ? 'earned' : ''}">⭐</span>
            </div>
            ${isUnlocked && bestScore > 0 ? `<span class="level-best-score">${bestScore}</span>` : ''}
          </button>
        `;
      });

      html += `</div>`;

      // Infinity Mode Portal Card if Level 100 beaten
      if (save.infinityModeUnlocked || save.unlockedLevel > 100) {
        html += `
          <div class="infinity-portal-card">
            <div class="portal-meta">
              <span class="portal-badge">UNLOCKED</span>
              <h4>♾️ INFINITY MODE ACTIVATED</h4>
              <p>Procedural endless arcade whacking beyond Level 100. How many waves can you conquer?</p>
            </div>
            <button id="btnLaunchInfinity" class="modal-btn modal-btn-primary" style="padding: 10px 20px;">ENTER INFINITY ❯</button>
          </div>
        `;
      }

      this.mapContainer.innerHTML = html;

      // Bind world tabs
      this.mapContainer.querySelectorAll('.world-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.currentWorldTab = parseInt(btn.getAttribute('data-world'), 10);
          window.SoundEngine.playHit('normal', false);
          this.renderWorldMap(onLevelSelect);
        });
      });

      // Bind level buttons
      this.mapContainer.querySelectorAll('.level-node-btn.unlocked').forEach(btn => {
        btn.addEventListener('click', () => {
          const lvlId = parseInt(btn.getAttribute('data-level-id'), 10);
          window.SoundEngine.playHit('normal', false);
          onLevelSelect(lvlId);
        });
      });

      const btnInf = this.mapContainer.querySelector('#btnLaunchInfinity');
      if (btnInf) {
        btnInf.addEventListener('click', () => {
          window.SoundEngine.playHit('golden', true);
          const target = Math.max(101, save.unlockedLevel);
          onLevelSelect(target);
        });
      }
    }

    /**
     * Render Achievements list
     */
    renderAchievementsModal() {
      const modal = this.modals.achievements;
      if (!modal) return;
      const list = modal.querySelector('.achievements-list');
      if (!list) return;

      const achievements = window.SaveManager.getAchievements();
      list.innerHTML = achievements.map(ach => `
        <div class="achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}">
          <div class="ach-icon">${ach.icon}</div>
          <div class="ach-info">
            <h4 class="ach-title">${ach.title}</h4>
            <p class="ach-desc">${ach.desc}</p>
            ${ach.unlocked ? '<span class="ach-date">Unlocked ✓</span>' : '<span class="ach-locked">Locked</span>'}
          </div>
        </div>
      `).join('');

      this.showModal('achievements');
    }

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
     * Render Victory / Level Complete Modal
     */
    renderVictoryModal(data, onNext, onReplay, onMap) {
      const modal = this.modals.victory;
      if (!modal) return;

      const titleEl = modal.querySelector('#victoryTitle');
      const starsRow = modal.querySelector('#victoryStars');
      const scoreEl = modal.querySelector('#victoryScore');
      const statsEl = modal.querySelector('#victoryStats');
      const rewardEl = modal.querySelector('#victoryRewards');
      const nextBtn = modal.querySelector('#btnVictoryNext');
      const replayBtn = modal.querySelector('#btnVictoryReplay');
      const mapBtn = modal.querySelector('#btnVictoryMap');

      if (titleEl) {
        titleEl.textContent = data.isLevel100
          ? '👑 MOLE CHAMPION!'
          : (data.level && data.level.isChallenge ? '⭐ CHALLENGE CONQUERED!' : 'BURROW CLEARED!');
      }

      if (starsRow) {
        starsRow.innerHTML = `
          <span class="modal-star ${data.stars >= 1 ? 'earned pop' : ''}">⭐</span>
          <span class="modal-star ${data.stars >= 2 ? 'earned pop' : ''}">⭐</span>
          <span class="modal-star ${data.stars >= 3 ? 'earned pop' : ''}">⭐</span>
        `;
      }

      if (scoreEl) scoreEl.textContent = data.score.toLocaleString();
      if (statsEl) {
        statsEl.textContent = `Accuracy: ${data.accuracy}% • Best Combo: ${data.maxCombo}x • Fastest: ${(data.fastestReactionMs / 1000).toFixed(2)}s`;
      }
      if (rewardEl && data.saveResult) {
        rewardEl.textContent = `+${data.saveResult.earnedXP} XP • +${data.saveResult.earnedCoins} Coins`;
      }

      if (nextBtn) {
        nextBtn.onclick = () => {
          this.closeModal('victory');
          onNext();
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
      const retryBtn = modal.querySelector('#btnGameOverRetry');
      const menuBtn = modal.querySelector('#btnGameOverMenu');

      if (reasonEl) reasonEl.textContent = data.reason;
      if (scoreEl) scoreEl.textContent = data.score.toLocaleString();

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

