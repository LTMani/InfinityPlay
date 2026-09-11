/**
 * PSEUDOKO — UI Manager & Screen Controller
 * Orchestrates all 12 game screens, 8x8 grid rendering, HUD animations,
 * modals, particle effects, and user interactions.
 */

(function(global) {
  'use strict';

  class PseudokoUI {
    constructor() {
      this.currentScreen = 'screenLaunch';
      this.selectedNodeType = 1; // Alpha default
      this.activeAbility = null; // 'scan' | 'emp' | 'overcharge'
      this.activeTierFilter = 'all';
    }

    init() {
      this.bindGlobalEvents();
      this.renderLevelSelectGrid();
      this.renderAchievementsScreen();
      this.renderStatisticsScreen();
      this.loadSettingsUI();
    }

    // ==========================================
    // SCREEN NAVIGATION (12 Screens)
    // ==========================================
    showScreen(screenId) {
      document.querySelectorAll('.pk-screen').forEach(s => s.classList.remove('active'));
      const target = document.getElementById(screenId);
      if (target) {
        target.classList.add('active');
        this.currentScreen = screenId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Contextual updates
      if (screenId === 'screenLevelSelect') {
        this.renderLevelSelectGrid();
      } else if (screenId === 'screenStats') {
        this.renderStatisticsScreen();
      } else if (screenId === 'screenAchievements') {
        this.renderAchievementsScreen();
      } else if (screenId === 'screenSettings') {
        this.loadSettingsUI();
      }

      if (global.Pseudoko.Audio) {
        global.Pseudoko.Audio.playClick();
      }
    }

    // ==========================================
    // 8x8 TACTICAL BOARD RENDERING
    // ==========================================
    renderBoard(board) {
      const container = document.getElementById('pkBoardGrid');
      if (!container) return;

      container.innerHTML = '';

      for (let r = 0; r < board.size; r++) {
        for (let c = 0; c < board.size; c++) {
          const cellData = board.getCell(r, c);
          const cellEl = document.createElement('div');
          cellEl.className = 'pk-cell';
          cellEl.dataset.row = r;
          cellEl.dataset.col = c;
          cellEl.title = `Coordinate ${cellData.coord} (Sector ${cellData.sector + 1})`;

          // Special cell types
          if (cellData.type !== 'empty') {
            cellEl.classList.add(`type-${cellData.type}`);
          }

          // Influence classes
          if (cellData.owner === 'player') {
            cellEl.classList.add('influence-player');
          } else if (cellData.owner === 'ai') {
            cellEl.classList.add('influence-ai');
          }

          // Placed node
          if (cellData.node) {
            const glyph = document.createElement('div');
            const typeInfo = global.Pseudoko.NODE_TYPES[board.getNodeKeyById(cellData.node.type)];
            glyph.className = `pk-node-glyph pk-node-${cellData.node.type}`;
            if (cellData.node.owner === 'ai') glyph.classList.add('pk-node-ai');
            glyph.textContent = typeInfo.symbol;
            cellEl.appendChild(glyph);

            if (cellData.node.locked) {
              cellEl.classList.add('locked');
            }
          }

          // Click handler
          cellEl.addEventListener('click', () => {
            this.handleCellClick(r, c);
          });

          container.appendChild(cellEl);
        }
      }
    }

    handleCellClick(r, c) {
      if (this.activeAbility === 'emp') {
        global.Pseudoko.App.executeEmpAbility(r, c);
        this.activeAbility = null;
        document.querySelectorAll('.pk-ability-btn').forEach(b => b.classList.remove('active'));
        return;
      }

      global.Pseudoko.App.handlePlayerPlacement(r, c, this.selectedNodeType);
    }

    triggerCellError(r, c) {
      const cellEl = document.querySelector(`.pk-cell[data-row="${r}"][data-col="${c}"]`);
      if (cellEl) {
        cellEl.classList.remove('error-shake');
        void cellEl.offsetWidth; // Trigger reflow
        cellEl.classList.add('error-shake');
        setTimeout(() => cellEl.classList.remove('error-shake'), 400);
      }
    }

    triggerCircuitResonanceEffect(circuits) {
      circuits.forEach(circuit => {
        circuit.cells.forEach(cell => {
          const cellEl = document.querySelector(`.pk-cell[data-row="${cell.row}"][data-col="${cell.col}"]`);
          if (cellEl) {
            cellEl.classList.remove('circuit-glow');
            void cellEl.offsetWidth;
            cellEl.classList.add('circuit-glow');
            setTimeout(() => cellEl.classList.remove('circuit-glow'), 850);
          }
        });
      });
    }

    highlightTacticalScan(moves) {
      // Clear previous scan highlights
      document.querySelectorAll('.pk-cell.scan-highlight').forEach(el => el.classList.remove('scan-highlight'));

      // Highlight top 3 recommended positions
      moves.slice(0, 3).forEach(m => {
        const el = document.querySelector(`.pk-cell[data-row="${m.row}"][data-col="${m.col}"]`);
        if (el) el.classList.add('scan-highlight');
      });

      this.showToast(`Tactical Scan complete: Optimal nodes highlighted in gold.`, 'info');
    }

    // ==========================================
    // HUD UPDATES
    // ==========================================
    updateHUD(data) {
      const elScore = document.getElementById('pkHudScore');
      const elMoves = document.getElementById('pkHudMoves');
      const elCombo = document.getElementById('pkHudCombo');
      const elTerritory = document.getElementById('pkHudTerritory');
      const elModeTitle = document.getElementById('pkHudModeTitle');

      if (elScore) elScore.textContent = data.score.toLocaleString();
      if (elMoves) {
        elMoves.textContent = data.movesRemaining;
        elMoves.style.color = data.movesRemaining <= 3 ? '#f43f5e' : '#ffffff';
      }
      if (elCombo) {
        elCombo.textContent = `${data.combo}x`;
        elCombo.style.color = data.combo >= 3 ? '#ec4899' : (data.combo >= 2 ? '#00f0ff' : '#ffffff');
      }
      if (elTerritory) elTerritory.textContent = `${data.territoryPercent}%`;
      if (elModeTitle && data.modeTitle) elModeTitle.textContent = data.modeTitle;

      // Objective box
      const elObjTitle = document.getElementById('pkObjTitle');
      const elObjDesc = document.getElementById('pkObjDesc');
      if (elObjTitle && data.objectiveTitle) elObjTitle.textContent = data.objectiveTitle;
      if (elObjDesc && data.objectiveDesc) elObjDesc.textContent = data.objectiveDesc;
    }

    // ==========================================
    // CAMPAIGN LEVEL SELECTOR (100 Levels)
    // ==========================================
    renderLevelSelectGrid(tierFilter = 'all') {
      const container = document.getElementById('pkLevelsGrid');
      if (!container) return;

      const levels = global.Pseudoko.Levels.getAllLevels();
      const storage = global.Pseudoko.Storage;

      container.innerHTML = '';

      levels.forEach(lvl => {
        if (tierFilter !== 'all' && lvl.tier !== tierFilter) return;

        const isUnlocked = storage.isLevelUnlocked(lvl.id);
        const lvlData = storage.getLevelData(lvl.id);
        const stars = lvlData ? lvlData.stars : 0;

        const card = document.createElement('div');
        card.className = `pk-level-card ${!isUnlocked ? 'locked' : ''}`;
        card.title = `${lvl.name} (${lvl.tierInfo.name})`;

        let starSymbols = '☆☆☆';
        if (stars === 1) starSymbols = '★☆☆';
        else if (stars === 2) starSymbols = '★★☆';
        else if (stars === 3) starSymbols = '★★★';

        card.innerHTML = `
          <div class="pk-level-num">${lvl.id}</div>
          <div class="pk-level-stars">${isUnlocked ? starSymbols : '🔒'}</div>
        `;

        if (isUnlocked) {
          card.addEventListener('click', () => {
            global.Pseudoko.App.startCampaignLevel(lvl.id);
          });
        }

        container.appendChild(card);
      });
    }

    // ==========================================
    // STATISTICS SCREEN
    // ==========================================
    renderStatisticsScreen() {
      const stats = global.Pseudoko.Storage.data.stats;
      const camp = global.Pseudoko.Storage.data.campaign;
      const daily = global.Pseudoko.Storage.data.daily;
      const endless = global.Pseudoko.Storage.data.endless;

      const totalGames = stats.totalGamesPlayed || 0;
      const wins = stats.totalWins || 0;
      const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      setVal('statTotalGames', totalGames);
      setVal('statTotalWins', wins);
      setVal('statWinRate', `${winRate}%`);
      setVal('statTotalScore', (stats.totalScoreEarned || 0).toLocaleString());
      setVal('statTotalStars', `${camp.totalStars || 0} / 300`);
      setVal('statCampaignProgress', `${Object.keys(camp.completedLevels).length} / 100 Levels`);
      setVal('statEndlessWave', `Wave ${endless.highestWave || 1}`);
      setVal('statEndlessHighScore', (endless.highScore || 0).toLocaleString());
      setVal('statDailyStreak', `${daily.currentStreak || 0} Days`);
      setVal('statDailyBestStreak', `${daily.bestStreak || 0} Days`);
      setVal('statTotalCircuits', stats.totalCircuitsCompleted || 0);
      setVal('statTotalCores', stats.totalCoresCaptured || 0);
    }

    // ==========================================
    // ACHIEVEMENTS SCREEN
    // ==========================================
    renderAchievementsScreen() {
      const container = document.getElementById('pkAchievementsList');
      if (!container) return;

      const list = global.Pseudoko.Achievements.getAll();
      container.innerHTML = '';

      list.forEach(ach => {
        const item = document.createElement('div');
        item.className = 'pk-setting-row';
        item.style.opacity = ach.unlocked ? '1' : '0.55';
        item.innerHTML = `
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="font-size: 1.8rem;">${ach.icon}</div>
            <div class="pk-setting-info">
              <span class="pk-setting-name">${ach.title}</span>
              <span class="pk-setting-desc">${ach.description}</span>
            </div>
          </div>
          <div style="text-align: right;">
            <span class="pk-badge ${ach.unlocked ? 'pk-badge-cyan' : 'pk-badge-purple'}">
              ${ach.unlocked ? 'UNLOCKED' : `+${ach.xp} XP`}
            </span>
          </div>
        `;
        container.appendChild(item);
      });
    }

    // ==========================================
    // SETTINGS SCREEN
    // ==========================================
    loadSettingsUI() {
      const s = global.Pseudoko.Storage.getSettings();

      const bgmToggle = document.getElementById('toggleBgm');
      const sfxToggle = document.getElementById('toggleSfx');
      const masterSlider = document.getElementById('sliderMaster');
      const bgmSlider = document.getElementById('sliderBgm');
      const sfxSlider = document.getElementById('sliderSfx');

      if (bgmToggle) bgmToggle.classList.toggle('active', s.bgmEnabled);
      if (sfxToggle) sfxToggle.classList.toggle('active', s.sfxEnabled);
      if (masterSlider) masterSlider.value = Math.round(s.masterVolume * 100);
      if (bgmSlider) bgmSlider.value = Math.round(s.bgmVolume * 100);
      if (sfxSlider) sfxSlider.value = Math.round(s.sfxVolume * 100);

      this.applyTheme(s.theme || 'cyan');
    }

    applyTheme(theme) {
      document.body.classList.remove('theme-matrix', 'theme-synthwave', 'theme-gold');
      if (theme !== 'cyan') {
        document.body.classList.add(`theme-${theme}`);
      }
    }

    // ==========================================
    // MODALS: VICTORY & DEFEAT
    // ==========================================
    showVictoryModal(result) {
      const modal = document.getElementById('modalVictory');
      if (!modal) return;

      const starsEl = document.getElementById('victoryStars');
      const scoreEl = document.getElementById('victoryScore');
      const descEl = document.getElementById('victoryDesc');

      let starIcons = '★☆☆';
      if (result.stars === 2) starIcons = '★★☆';
      else if (result.stars === 3) starIcons = '★★★';

      if (starsEl) starsEl.textContent = starIcons;
      if (scoreEl) scoreEl.textContent = `Score: ${result.score.toLocaleString()}`;
      if (descEl) descEl.textContent = result.message || 'Tactical matrix harmonized successfully.';

      modal.classList.add('active');
      if (global.Pseudoko.Audio) global.Pseudoko.Audio.playVictory();
    }

    showDefeatModal(message = 'Moves depleted. Tactical grid compromised.') {
      const modal = document.getElementById('modalDefeat');
      if (!modal) return;

      const descEl = document.getElementById('defeatDesc');
      if (descEl) descEl.textContent = message;

      modal.classList.add('active');
      if (global.Pseudoko.Audio) global.Pseudoko.Audio.playDefeat();
    }

    closeModals() {
      document.querySelectorAll('.pk-modal-overlay').forEach(m => m.classList.remove('active'));
    }

    // ==========================================
    // TOAST NOTIFICATIONS
    // ==========================================
    showToast(message, type = 'info') {
      let container = document.getElementById('pkToastContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'pkToastContainer';
        container.className = 'pk-toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = 'pk-toast';
      toast.innerHTML = `
        <span style="font-size: 1.2rem;">${type === 'achievement' ? '🏆' : (type === 'success' ? '⚡' : 'ℹ')}</span>
        <span style="font-size: 0.86rem; font-weight: 600; color: #ffffff;">${message}</span>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        toast.style.transition = 'all 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(15px)';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

    showAchievementToast(ach) {
      this.showToast(`Achievement Unlocked: ${ach.title} (+${ach.xp} XP)`, 'achievement');
    }

    // ==========================================
    // EVENT BINDINGS
    // ==========================================
    bindGlobalEvents() {
      // Launch screen start button
      const btnLaunchStart = document.getElementById('btnLaunchStart');
      if (btnLaunchStart) {
        btnLaunchStart.addEventListener('click', () => {
          if (global.Pseudoko.Audio) {
            global.Pseudoko.Audio.init();
            global.Pseudoko.Audio.startBGM();
          }
          this.showScreen('screenMainMenu');
        });
      }

      // Main Menu navigation buttons
      const menuBindings = [
        ['btnMenuPlay', () => this.showScreen('screenModeSelect')],
        ['btnMenuLevels', () => this.showScreen('screenLevelSelect')],
        ['btnMenuDaily', () => global.Pseudoko.App.startDailyChallenge()],
        ['btnMenuStats', () => this.showScreen('screenStats')],
        ['btnMenuAchievements', () => this.showScreen('screenAchievements')],
        ['btnMenuSettings', () => this.showScreen('screenSettings')],
        ['btnMenuHowToPlay', () => this.showScreen('screenHowToPlay')]
      ];

      menuBindings.forEach(([id, fn]) => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', fn);
      });

      // Back to Menu buttons
      document.querySelectorAll('.pk-btn-back-menu').forEach(b => {
        b.addEventListener('click', () => this.showScreen('screenMainMenu'));
      });

      // Mode Selection buttons
      const btnModeCampaign = document.getElementById('btnModeCampaign');
      if (btnModeCampaign) btnModeCampaign.addEventListener('click', () => this.showScreen('screenLevelSelect'));

      const btnModeEndless = document.getElementById('btnModeEndless');
      if (btnModeEndless) btnModeEndless.addEventListener('click', () => global.Pseudoko.App.startEndlessMode());

      const btnModeDaily = document.getElementById('btnModeDaily');
      if (btnModeDaily) btnModeDaily.addEventListener('click', () => global.Pseudoko.App.startDailyChallenge());

      const btnModeSkirmish = document.getElementById('btnModeSkirmish');
      if (btnModeSkirmish) btnModeSkirmish.addEventListener('click', () => global.Pseudoko.App.startAISkirmish('medium'));

      // Node Palette Selection
      document.querySelectorAll('.pk-palette-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const typeId = parseInt(btn.dataset.type, 10);
          this.selectedNodeType = typeId;
          document.querySelectorAll('.pk-palette-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (global.Pseudoko.Audio) global.Pseudoko.Audio.playClick();
        });
      });

      // Abilities Buttons
      const btnAbilityScan = document.getElementById('btnAbilityScan');
      if (btnAbilityScan) {
        btnAbilityScan.addEventListener('click', () => {
          global.Pseudoko.App.executeScanAbility();
        });
      }

      const btnAbilityEmp = document.getElementById('btnAbilityEmp');
      if (btnAbilityEmp) {
        btnAbilityEmp.addEventListener('click', () => {
          this.activeAbility = this.activeAbility === 'emp' ? null : 'emp';
          btnAbilityEmp.classList.toggle('active', this.activeAbility === 'emp');
          this.showToast('EMP Target Mode active: Click any firewall or cell to purge.', 'info');
        });
      }

      const btnAbilityUndo = document.getElementById('btnAbilityUndo');
      if (btnAbilityUndo) {
        btnAbilityUndo.addEventListener('click', () => {
          global.Pseudoko.App.executeUndo();
        });
      }

      // In-game Pause & Controls
      const btnGameplayPause = document.getElementById('btnGameplayPause');
      if (btnGameplayPause) {
        btnGameplayPause.addEventListener('click', () => {
          const modal = document.getElementById('modalPause');
          if (modal) modal.classList.add('active');
        });
      }

      const btnResumeGame = document.getElementById('btnResumeGame');
      if (btnResumeGame) {
        btnResumeGame.addEventListener('click', () => this.closeModals());
      }

      const btnRestartGame = document.getElementById('btnRestartGame');
      if (btnRestartGame) {
        btnRestartGame.addEventListener('click', () => {
          this.closeModals();
          global.Pseudoko.App.restartCurrentSession();
        });
      }

      // Victory Next & Replay
      const btnVictoryNext = document.getElementById('btnVictoryNext');
      if (btnVictoryNext) {
        btnVictoryNext.addEventListener('click', () => {
          this.closeModals();
          global.Pseudoko.App.startNextCampaignLevel();
        });
      }

      const btnVictoryReplay = document.getElementById('btnVictoryReplay');
      if (btnVictoryReplay) {
        btnVictoryReplay.addEventListener('click', () => {
          this.closeModals();
          global.Pseudoko.App.restartCurrentSession();
        });
      }

      // Defeat Retry
      const btnDefeatRetry = document.getElementById('btnDefeatRetry');
      if (btnDefeatRetry) {
        btnDefeatRetry.addEventListener('click', () => {
          this.closeModals();
          global.Pseudoko.App.restartCurrentSession();
        });
      }

      // Level Select Tier Filter Tabs
      document.querySelectorAll('.pk-tier-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.pk-tier-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const tier = tab.dataset.tier;
          this.activeTierFilter = tier;
          this.renderLevelSelectGrid(tier);
        });
      });

      // Settings toggles & sliders
      const toggleBgm = document.getElementById('toggleBgm');
      if (toggleBgm) {
        toggleBgm.addEventListener('click', () => {
          const enabled = global.Pseudoko.Audio.toggleBgm();
          toggleBgm.classList.toggle('active', enabled);
          global.Pseudoko.Storage.updateSettings({ bgmEnabled: enabled });
        });
      }

      const toggleSfx = document.getElementById('toggleSfx');
      if (toggleSfx) {
        toggleSfx.addEventListener('click', () => {
          const enabled = global.Pseudoko.Audio.toggleSfx();
          toggleSfx.classList.toggle('active', enabled);
          global.Pseudoko.Storage.updateSettings({ sfxEnabled: enabled });
        });
      }

      const sliderBgm = document.getElementById('sliderBgm');
      if (sliderBgm) {
        sliderBgm.addEventListener('input', (e) => {
          const val = e.target.value / 100;
          global.Pseudoko.Audio.setBgmVolume(val);
          global.Pseudoko.Storage.updateSettings({ bgmVolume: val });
        });
      }

      const sliderSfx = document.getElementById('sliderSfx');
      if (sliderSfx) {
        sliderSfx.addEventListener('input', (e) => {
          const val = e.target.value / 100;
          global.Pseudoko.Audio.setSfxVolume(val);
          global.Pseudoko.Storage.updateSettings({ sfxVolume: val });
        });
      }

      // Theme Picker Dots
      document.querySelectorAll('.pk-theme-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          const theme = dot.dataset.theme;
          this.applyTheme(theme);
          global.Pseudoko.Storage.updateSettings({ theme });
          this.showToast(`Theme applied: ${theme.toUpperCase()}`, 'info');
        });
      });

      // Reset progress button
      const btnResetProgress = document.getElementById('btnResetProgress');
      if (btnResetProgress) {
        btnResetProgress.addEventListener('click', () => {
          if (confirm('Are you sure you want to reset all PSEUDOKO campaign progress, stars, and statistics?')) {
            global.Pseudoko.Storage.resetAll();
            this.renderLevelSelectGrid();
            this.renderStatisticsScreen();
            this.renderAchievementsScreen();
            this.showToast('All PSEUDOKO data has been reset to default.', 'info');
          }
        });
      }

      // Keyboard Controls
      window.addEventListener('keydown', (e) => {
        if (e.key === '1') {
          document.querySelector('.pk-palette-btn[data-type="1"]')?.click();
        } else if (e.key === '2') {
          document.querySelector('.pk-palette-btn[data-type="2"]')?.click();
        } else if (e.key === '3') {
          document.querySelector('.pk-palette-btn[data-type="3"]')?.click();
        } else if (e.key === '4') {
          document.querySelector('.pk-palette-btn[data-type="4"]')?.click();
        } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
          global.Pseudoko.App.executeUndo();
        } else if (e.key === 'Escape') {
          if (this.currentScreen === 'screenGameplay') {
            document.getElementById('btnGameplayPause')?.click();
          } else {
            this.closeModals();
          }
        }
      });
    }
  }

  global.Pseudoko = global.Pseudoko || {};
  global.Pseudoko.UI = new PseudokoUI();

})(typeof window !== 'undefined' ? window : global);

