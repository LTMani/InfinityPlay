/**
 * Zombie Survival - UI & Screen Controller
 * Orchestrates menu transitions, HUD updates, Arsenal, Upgrades, Level Select, and Results screens.
 */

class UIManager {
  constructor() {
    this.currentScreen = 'MENU';
    this.currentWorldTab = 1;
    this.toastTimer = null;
  }

  init() {
    this.bindGlobalNavigation();
    this.updateMainMenuStats();
    this.showScreen('MENU');
  }

  bindGlobalNavigation() {
    // Top-level Menu buttons
    this._bind('btnPlay', () => this.showScreen('MODE_SELECT'));
    this._bind('btnLevels', () => {
      this.currentWorldTab = Math.min(10, Math.ceil((window.Storage.data.highestLevelUnlocked || 1) / 6));
      this.renderLevelSelect();
      this.showScreen('LEVEL_SELECT');
    });
    this._bind('btnMissions', () => {
      this.renderMissions();
      this.showScreen('MISSIONS');
    });
    this._bind('btnUpgrades', () => {
      this.renderPlayerUpgrades();
      this.showScreen('UPGRADES');
    });
    this._bind('btnArsenal', () => {
      this.renderArsenal();
      this.showScreen('ARSENAL');
    });
    this._bind('btnAchievements', () => {
      this.renderAchievements();
      this.showScreen('ACHIEVEMENTS');
    });
    this._bind('btnLeaderboard', () => {
      this.renderLeaderboard();
      this.showScreen('LEADERBOARD');
    });
    this._bind('btnSettings', () => {
      this.renderSettings();
      this.showScreen('SETTINGS');
    });
    this._bind('btnBackToInfinity', () => this.exitToInfinityPlay());

    // Back Buttons inside screens
    document.querySelectorAll('.btn-back-menu').forEach(b => {
      b.addEventListener('click', () => {
        window.Sound.playClick();
        this.updateMainMenuStats();
        this.showScreen('MENU');
      });
    });

    // Mode select buttons
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.getAttribute('data-mode');
        window.Sound.playClick();
        if (mode === 'STORY') {
          this.currentWorldTab = Math.min(10, Math.ceil((window.Storage.data.highestLevelUnlocked || 1) / 6));
          this.renderLevelSelect();
          this.showScreen('LEVEL_SELECT');
        } else if (mode === 'ENDLESS') {
          window.gameInstance.startEndlessMode();
        } else if (mode === 'WAVE_SURVIVAL') {
          window.gameInstance.startWaveSurvivalMode();
        } else if (mode === 'TIME_ATTACK') {
          window.gameInstance.startTimeAttackMode();
        } else if (mode === 'BOSS_CHALLENGE') {
          window.gameInstance.startBossChallengeMode();
        }
      });
    });

    // Pause screen buttons
    this._bind('btnResume', () => window.gameInstance.togglePause(false));
    this._bind('btnRestart', () => window.gameInstance.restartCurrentLevel());
    this._bind('btnPauseSettings', () => {
      this.renderSettings();
      document.getElementById('screenSettings').style.display = 'flex';
    });
    this._bind('btnPauseExit', () => {
      window.gameInstance.togglePause(false);
      window.gameInstance.state = 'MENU';
      this.updateMainMenuStats();
      this.showScreen('MENU');
    });

    // Results screen buttons
    this._bind('btnNextLevel', () => window.gameInstance.startNextLevel());
    this._bind('btnRetryLevel', () => window.gameInstance.restartCurrentLevel());
    this._bind('btnResultsLevelSelect', () => {
      this.renderLevelSelect();
      this.showScreen('LEVEL_SELECT');
    });
    this._bind('btnResultsArsenal', () => {
      this.renderArsenal();
      this.showScreen('ARSENAL');
    });
    this._bind('btnResultsMenu', () => {
      this.updateMainMenuStats();
      this.showScreen('MENU');
    });
  }

  _bind(id, fn) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.Sound.playClick();
        fn();
      });
    }
  }

  showScreen(screenId) {
    this.currentScreen = screenId;
    const screens = document.querySelectorAll('.game-screen');
    screens.forEach(s => s.classList.remove('active'));

    const hud = document.getElementById('gameHUD');
    const mobileControls = document.getElementById('mobileControls');

    if (screenId === 'PLAYING') {
      if (hud) hud.style.display = 'flex';
      if (mobileControls) mobileControls.style.display = 'block';
    } else {
      if (hud) hud.style.display = 'none';
      if (mobileControls) mobileControls.style.display = 'none';

      const target = document.getElementById(`screen${this._capitalize(screenId)}`);
      if (target) target.classList.add('active');
    }
  }

  _capitalize(str) {
    const parts = str.toLowerCase().split('_');
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  }

  updateMainMenuStats() {
    const st = window.Storage.data;
    const stats = st.stats;

    this._setText('statHighestLevel', `Level ${st.highestLevelUnlocked} / 60`);
    this._setText('statBestScore', stats.bestScore ? stats.bestScore.toLocaleString() : (st.endlessStats.bestScore || 0).toLocaleString());
    this._setText('statTotalKills', stats.totalKills.toLocaleString());

    const totalSeconds = stats.totalSurvivalTime || 0;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    this._setText('statSurvivalTime', `${mins}m ${secs}s`);

    this._setText('menuCoinDisplay', st.coins.toLocaleString());
    this._setText('menuXPDisplay', `Lv ${st.playerLevel} (${st.xp} XP)`);
  }

  _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // --- RENDER LEVEL SELECT (60 LEVELS, 10 WORLDS) ---
  renderLevelSelect() {
    const tabsContainer = document.getElementById('worldTabs');
    const levelsGrid = document.getElementById('levelsGrid');
    if (!tabsContainer || !levelsGrid) return;

    // Render 10 World tabs
    tabsContainer.innerHTML = window.WORLDS.map(w => `
      <button class="world-tab-btn ${w.id === this.currentWorldTab ? 'active' : ''}" data-world="${w.id}">
        World ${w.id}: ${w.name}
      </button>
    `).join('');

    tabsContainer.querySelectorAll('.world-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentWorldTab = parseInt(btn.getAttribute('data-world'), 10);
        window.Sound.playClick();
        this.renderLevelSelect();
      });
    });

    // Current World Info
    const currentWorld = window.WORLDS[this.currentWorldTab - 1];
    this._setText('worldTitle', `World ${currentWorld.id}: ${currentWorld.name}`);
    this._setText('worldDescription', `${currentWorld.theme} — ${currentWorld.desc}`);

    // Render levels 1-6 for this world
    const [startLvl, endLvl] = currentWorld.levels;
    const highest = window.Storage.data.highestLevelUnlocked || 1;
    const completed = window.Storage.data.completedLevels || {};

    let html = '';
    for (let i = startLvl; i <= endLvl; i++) {
      const lvl = window.LEVELS[i - 1];
      const isUnlocked = i <= highest;
      const rec = completed[i] || { stars: 0, score: 0 };

      let starsHtml = '';
      if (isUnlocked) {
        starsHtml = `
          <div class="level-stars">
            <span class="${rec.stars >= 1 ? 'star-filled' : 'star-empty'}">★</span>
            <span class="${rec.stars >= 2 ? 'star-filled' : 'star-empty'}">★</span>
            <span class="${rec.stars >= 3 ? 'star-filled' : 'star-empty'}">★</span>
          </div>
        `;
      }

      html += `
        <div class="level-card ${isUnlocked ? 'unlocked' : 'locked'} ${lvl.isBossLevel ? 'boss-level' : ''}" data-level="${i}">
          <div class="level-card-header">
            <span class="level-num">Sector ${i}</span>
            <span class="level-diff">${lvl.difficulty}</span>
          </div>
          <div class="level-name">${lvl.name}</div>
          <div class="level-objective">${lvl.objectiveDesc}</div>
          ${starsHtml}
          ${!isUnlocked ? '<div class="level-lock-badge">🔒 Locked</div>' : `<button class="btn btn-play-level">▶ Play</button>`}
        </div>
      `;
    }

    levelsGrid.innerHTML = html;

    levelsGrid.querySelectorAll('.level-card.unlocked').forEach(card => {
      card.addEventListener('click', () => {
        const lvlId = parseInt(card.getAttribute('data-level'), 10);
        window.Sound.playClick();
        window.gameInstance.startStoryLevel(lvlId);
      });
    });
  }

  // --- RENDER ARSENAL SCREEN ---
  renderArsenal() {
    const grid = document.getElementById('arsenalGrid');
    if (!grid) return;

    this._setText('arsenalCoins', window.Storage.data.coins.toLocaleString());

    const unlocked = window.Storage.data.unlockedWeapons;
    const equipped = window.Storage.data.equippedWeapon;
    const playerLevel = window.Storage.data.playerLevel;

    let html = '';
    for (let key of Object.keys(window.WEAPON_DEFINITIONS)) {
      const w = window.Upgrades.getModifiedWeapon(key);
      const isUnlocked = unlocked.includes(key);
      const isEquipped = equipped === key;
      const up = (window.Storage.data.weaponUpgrades && window.Storage.data.weaponUpgrades[key]) || {};

      html += `
        <div class="arsenal-card ${isEquipped ? 'equipped' : ''} ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="arsenal-card-header">
            <div>
              <span class="arsenal-category">${w.category}</span>
              <h3 class="arsenal-weapon-name">${w.name}</h3>
            </div>
            ${isEquipped ? '<span class="equipped-badge">EQUIPPED</span>' : ''}
          </div>

          <p class="arsenal-desc">${w.description}</p>

          <div class="arsenal-stats-grid">
            <div><span>Damage:</span> <strong>${w.damage}</strong></div>
            <div><span>Fire Rate:</span> <strong>${w.fireRate}/s</strong></div>
            <div><span>Magazine:</span> <strong>${w.ammo}</strong></div>
            <div><span>Reload:</span> <strong>${w.reloadTime}s</strong></div>
            <div><span>Range:</span> <strong>${w.range}px</strong></div>
          </div>

          <div class="arsenal-actions">
            ${isUnlocked ? `
              <button class="btn btn-equip ${isEquipped ? 'disabled' : ''}" data-weapon="${w.id}" ${isEquipped ? 'disabled' : ''}>
                ${isEquipped ? 'Currently Equipped' : 'Equip Weapon'}
              </button>
            ` : `
              <button class="btn btn-unlock-weapon" data-weapon="${w.id}">
                Unlock for 🪙 ${w.unlockCost} Coins
              </button>
            `}
          </div>

          ${isUnlocked ? `
            <div class="weapon-upgrades-row">
              <span style="font-size: 0.76rem; font-weight: 700; color: var(--color-cyan);">WEAPON WORKSHOP:</span>
              <div class="upgrade-buttons-group">
                ${this._renderWeaponStatButton(w.id, 'damage', '💥 Damage', up.damage || 0)}
                ${this._renderWeaponStatButton(w.id, 'fireRate', '⚡ Rate', up.fireRate || 0)}
                ${this._renderWeaponStatButton(w.id, 'mag', '🔋 Mag', up.mag || 0)}
                ${this._renderWeaponStatButton(w.id, 'reload', '🔄 Reload', up.reload || 0)}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    grid.innerHTML = html;

    // Equip handlers
    grid.querySelectorAll('.btn-equip').forEach(btn => {
      btn.addEventListener('click', () => {
        const wid = btn.getAttribute('data-weapon');
        window.Storage.equipWeapon(wid);
        if (window.gameInstance && window.gameInstance.player) {
          window.gameInstance.player.equipWeapon(wid);
        }
        window.Sound.playClick();
        this.renderArsenal();
      });
    });

    // Unlock handlers
    grid.querySelectorAll('.btn-unlock-weapon').forEach(btn => {
      btn.addEventListener('click', () => {
        const wid = btn.getAttribute('data-weapon');
        const res = window.Upgrades.unlockWeapon(wid);
        if (res.success) {
          this.showToast(`Unlocked ${window.WEAPON_DEFINITIONS[wid].name}!`, 'success');
          this.renderArsenal();
        } else {
          this.showToast(res.msg, 'error');
        }
      });
    });

    // Stat Upgrade handlers
    grid.querySelectorAll('.btn-upgrade-stat').forEach(btn => {
      btn.addEventListener('click', () => {
        const wid = btn.getAttribute('data-weapon');
        const stat = btn.getAttribute('data-stat');
        const res = window.Upgrades.buyWeaponUpgrade(wid, stat);
        if (res.success) {
          this.showToast(`Upgraded ${stat.toUpperCase()} to Lv ${res.newLevel}!`, 'success');
          this.renderArsenal();
        } else {
          this.showToast(res.msg, 'error');
        }
      });
    });
  }

  _renderWeaponStatButton(weaponId, statKey, label, curLevel) {
    const cfg = window.WEAPON_UPGRADE_CONFIG[statKey];
    const isMax = curLevel >= cfg.maxLevel;
    const cost = isMax ? 'MAX' : `🪙 ${cfg.costs[curLevel]}`;
    return `
      <button class="btn btn-upgrade-stat ${isMax ? 'maxed' : ''}" data-weapon="${weaponId}" data-stat="${statKey}" ${isMax ? 'disabled' : ''}>
        <span>${label} (Lv ${curLevel})</span>
        <small>${cost}</small>
      </button>
    `;
  }

  // --- RENDER PLAYER UPGRADES SCREEN ---
  renderPlayerUpgrades() {
    const container = document.getElementById('playerUpgradesList');
    if (!container) return;

    this._setText('playerUpgradeCoins', window.Storage.data.coins.toLocaleString());

    const up = window.Storage.data.playerUpgrades;
    let html = '';

    for (let key of Object.keys(window.PLAYER_UPGRADE_CONFIG)) {
      const cfg = window.PLAYER_UPGRADE_CONFIG[key];
      const curLvl = up[key] || 0;
      const isMax = curLvl >= cfg.maxLevel;
      const nextCost = isMax ? 'MAX' : `🪙 ${cfg.costs[curLvl]} Coins`;

      let progressBars = '';
      for (let b = 1; b <= cfg.maxLevel; b++) {
        progressBars += `<span class="pip ${b <= curLvl ? 'filled' : ''}"></span>`;
      }

      html += `
        <div class="player-upgrade-card">
          <div class="upgrade-icon">${cfg.icon}</div>
          <div class="upgrade-info">
            <div class="upgrade-title-row">
              <h4>${cfg.name}</h4>
              <span class="upgrade-level">Level ${curLvl} / ${cfg.maxLevel}</span>
            </div>
            <p class="upgrade-desc">${cfg.description}</p>
            <div class="upgrade-pips">${progressBars}</div>
          </div>
          <button class="btn btn-player-upgrade ${isMax ? 'maxed' : ''}" data-key="${key}" ${isMax ? 'disabled' : ''}>
            ${isMax ? 'MAXED OUT' : `Upgrade (${nextCost})`}
          </button>
        </div>
      `;
    }

    container.innerHTML = html;

    container.querySelectorAll('.btn-player-upgrade').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        const res = window.Upgrades.buyPlayerUpgrade(key);
        if (res.success) {
          this.showToast(`Upgraded ${window.PLAYER_UPGRADE_CONFIG[key].name}!`, 'success');
          this.renderPlayerUpgrades();
        } else {
          this.showToast(res.msg, 'error');
        }
      });
    });
  }

  // --- RENDER MISSIONS SCREEN ---
  renderMissions() {
    const list = document.getElementById('missionsList');
    if (!list) return;

    const saved = window.Storage.data.missions;
    let html = '';

    for (let m of window.MISSIONS_LIST) {
      const state = saved[m.id] || { progress: 0, completed: false, claimed: false };
      const pct = Math.min(100, Math.round((state.progress / m.target) * 100));

      html += `
        <div class="mission-card ${state.claimed ? 'claimed' : (state.completed ? 'ready' : '')}">
          <div class="mission-left">
            <div class="mission-header">
              <span class="mission-title">${m.title}</span>
              <span class="mission-reward-tag">+${m.reward.coins} 🪙 / +${m.reward.xp} ⭐</span>
            </div>
            <p class="mission-desc">${m.desc}</p>
            <div class="mission-progress-bar">
              <div class="mission-fill" style="width: ${pct}%;"></div>
            </div>
            <span class="mission-tracker-text">${state.progress} / ${m.target} ${m.unit}</span>
          </div>
          <div class="mission-right">
            ${state.claimed ? `
              <span class="claimed-badge">✓ Claimed</span>
            ` : (state.completed ? `
              <button class="btn btn-claim-reward" data-mission="${m.id}">CLAIM</button>
            ` : `
              <span class="in-progress-badge">${pct}%</span>
            `)}
          </div>
        </div>
      `;
    }

    list.innerHTML = html;

    list.querySelectorAll('.btn-claim-reward').forEach(btn => {
      btn.addEventListener('click', () => {
        const mid = btn.getAttribute('data-mission');
        if (window.Missions.claimReward(mid)) {
          this.showToast('Rewards Claimed!', 'success');
          this.renderMissions();
          this.updateMainMenuStats();
        }
      });
    });
  }

  // --- RENDER ACHIEVEMENTS SCREEN ---
  renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;

    const achs = window.Storage.data.achievements;
    let html = '';

    for (let a of window.ACHIEVEMENTS_LIST) {
      const isUnlocked = !!achs[a.id];
      html += `
        <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon">${a.icon}</div>
          <div class="achievement-info">
            <h4>${a.title}</h4>
            <p>${a.desc}</p>
            <span class="ach-status">${isUnlocked ? '✓ Unlocked' : '🔒 Locked'}</span>
          </div>
        </div>
      `;
    }

    grid.innerHTML = html;
  }

  // --- RENDER LEADERBOARD SCREEN ---
  renderLeaderboard() {
    const container = document.getElementById('leaderboardList');
    if (!container) return;

    const curStats = window.Storage.data.endlessStats;
    const rows = [
      { rank: 1, name: 'CyberSurvivor (You)', wave: curStats.highestWave || 12, score: curStats.bestScore || 148200, kills: curStats.mostKills || 640 },
      { rank: 2, name: 'VortexPilot', wave: 18, score: 135000, kills: 580 },
      { rank: 3, name: 'ApexPhantom', wave: 15, score: 112000, kills: 490 },
      { rank: 4, name: 'NeonSamurai', wave: 14, score: 98400,  kills: 420 },
      { rank: 5, name: 'GlitchBreaker', wave: 11, score: 76500, kills: 310 }
    ];

    container.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Survivor</th>
            <th>Highest Wave</th>
            <th>Score</th>
            <th>Zombies</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr class="${r.rank === 1 ? 'player-row' : ''}">
              <td><strong>#${r.rank}</strong></td>
              <td>${r.name}</td>
              <td>Wave ${r.wave}</td>
              <td><span style="color: var(--color-gold); font-weight: 700;">${r.score.toLocaleString()}</span></td>
              <td>${r.kills}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // --- RENDER SETTINGS SCREEN ---
  renderSettings() {
    const s = window.Storage.data.settings;
    const sfxToggle = document.getElementById('toggleSFX');
    const musicToggle = document.getElementById('toggleMusic');
    const shakeToggle = document.getElementById('toggleShake');
    const reloadToggle = document.getElementById('toggleAutoReload');

    if (sfxToggle) sfxToggle.checked = s.sfx;
    if (musicToggle) musicToggle.checked = s.music;
    if (shakeToggle) shakeToggle.checked = s.screenShake;
    if (reloadToggle) reloadToggle.checked = s.autoReload;

    if (sfxToggle) {
      sfxToggle.onchange = () => {
        s.sfx = sfxToggle.checked;
        window.Sound.setSFXEnabled(s.sfx);
        window.Storage.save();
      };
    }
    if (musicToggle) {
      musicToggle.onchange = () => {
        s.music = musicToggle.checked;
        window.Sound.setMusicEnabled(s.music);
        window.Storage.save();
      };
    }
    if (shakeToggle) {
      shakeToggle.onchange = () => {
        s.screenShake = shakeToggle.checked;
        window.Storage.save();
      };
    }
    if (reloadToggle) {
      reloadToggle.onchange = () => {
        s.autoReload = reloadToggle.checked;
        window.Storage.save();
      };
    }
  }

  // --- HUD REAL-TIME UPDATES ---
  updateHUD(player, waveManager, levelConfig, currentCombo, comboTimer, objectiveProgress) {
    if (!player) return;

    // Health bar
    const hpPct = Math.max(0, Math.min(100, (player.health / player.maxHealth) * 100));
    const hpFill = document.getElementById('hudHealthFill');
    const hpText = document.getElementById('hudHealthText');
    if (hpFill) hpFill.style.width = `${hpPct}%`;
    if (hpText) hpText.textContent = `${Math.ceil(player.health)} / ${player.maxHealth}`;

    // Armor bar
    const armorPct = Math.max(0, Math.min(100, (player.armor / player.maxArmor) * 100));
    const armorFill = document.getElementById('hudArmorFill');
    const armorText = document.getElementById('hudArmorText');
    if (armorFill) armorFill.style.width = `${armorPct}%`;
    if (armorText) armorText.textContent = `${Math.ceil(player.armor)} / ${player.maxArmor}`;

    // Ammo
    const ammoCount = document.getElementById('hudAmmoCount');
    const ammoReserve = document.getElementById('hudAmmoReserve');
    if (ammoCount) ammoCount.textContent = player.isReloading ? 'RELOADING' : `${player.ammo}`;
    if (ammoReserve) ammoReserve.textContent = `/ ${player.reserveAmmo}`;

    // Score & Wave
    this._setText('hudScore', player.score.toLocaleString());
    this._setText('hudWave', `WAVE ${waveManager.currentWave.toString().padStart(2, '0')}`);

    // Ability cooldown
    const abilityBadge = document.getElementById('hudAbilityStatus');
    if (abilityBadge) {
      if (player.skillCooldownTimer > 0) {
        abilityBadge.textContent = `${player.selectedSkill.toUpperCase()}: ${player.skillCooldownTimer.toFixed(1)}s`;
        abilityBadge.classList.add('cooling');
      } else {
        abilityBadge.textContent = `${player.selectedSkill.toUpperCase()} READY (SPACE)`;
        abilityBadge.classList.remove('cooling');
      }
    }

    // Combo multiplier
    const comboEl = document.getElementById('hudCombo');
    if (comboEl) {
      if (currentCombo > 1) {
        comboEl.style.display = 'block';
        comboEl.textContent = `COMBO x${currentCombo}`;
      } else {
        comboEl.style.display = 'none';
      }
    }

    // Objective tracker text
    const objEl = document.getElementById('hudObjective');
    if (objEl && levelConfig) {
      objEl.textContent = `${levelConfig.objective}: ${objectiveProgress}`;
    }
  }

  showWaveBanner(text) {
    const banner = document.getElementById('hudWaveBanner');
    if (!banner) return;
    banner.textContent = text;
    banner.classList.add('visible');
    setTimeout(() => {
      banner.classList.remove('visible');
    }, 2400);
  }

  showToast(msg, type = 'info') {
    let toast = document.getElementById('gameToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'gameToast';
      toast.className = 'game-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = `game-toast visible ${type}`;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }

  // --- RESULTS SCREEN ---
  showResults(levelConfig, stats) {
    this.showScreen('RESULTS');

    const titleEl = document.getElementById('resultsTitle');
    const starsEl = document.getElementById('resultsStars');
    const nextBtn = document.getElementById('btnNextLevel');

    if (stats.victory) {
      if (titleEl) titleEl.textContent = 'MISSION COMPLETE';
      window.Sound.playLevelComplete();
      if (nextBtn) nextBtn.style.display = 'inline-block';
    } else {
      if (titleEl) titleEl.textContent = 'SURVIVOR DEFEATED';
      window.Sound.playGameOver();
      if (nextBtn) nextBtn.style.display = 'none';
    }

    // Star rating display
    if (starsEl) {
      starsEl.innerHTML = `
        <span class="${stats.stars >= 1 ? 'star-filled' : 'star-empty'}">★</span>
        <span class="${stats.stars >= 2 ? 'star-filled' : 'star-empty'}">★</span>
        <span class="${stats.stars >= 3 ? 'star-filled' : 'star-empty'}">★</span>
      `;
    }

    this._setText('resScore', stats.score.toLocaleString());
    this._setText('resKills', stats.kills.toString());
    this._setText('resAccuracy', `${stats.accuracy}%`);
    this._setText('resCombo', `x${stats.maxCombo}`);

    const mins = Math.floor(stats.time / 60);
    const secs = Math.floor(stats.time % 60);
    this._setText('resTime', `${mins}:${secs.toString().padStart(2, '0')}`);

    this._setText('resRewardXP', `+${stats.rewardXP} XP`);
    this._setText('resRewardCoins', `+${stats.rewardCoins} COINS`);
  }

  exitToInfinityPlay() {
    window.Sound.playClick();
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'exitGame', gameId: 'zombie-survival' }, '*');
    } else {
      window.location.href = '../../index.html';
    }
  }
}

window.UIManager = UIManager;

