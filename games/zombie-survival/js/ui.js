/**
 * Zombie Survival V2 - UI & Screen Controller
 * Orchestrates menu transitions, Level Briefing modal, 3-2-1-GO Countdown,
 * Skill Tree allocation, Player Profile screen, Arsenal with 10 weapons & 8 modifiers, and real-time HUD.
 */

class UIManager {
  constructor() {
    this.currentScreen = 'MENU';
    this.currentWorldTab = 1;
    this.toastTimer = null;
    this.pendingLevelId = 1;
    this.countdownTimer = null;
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
    this._bind('btnSkillTree', () => {
      this.renderSkillTree();
      this.showScreen('SKILL_TREE');
    });
    this._bind('btnProfile', () => {
      this.renderProfile();
      this.showScreen('PROFILE');
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

    // Briefing Modal buttons
    this._bind('btnStartMission', () => {
      this.startMissionWithCountdown(this.pendingLevelId);
    });
    this._bind('btnBriefingCancel', () => {
      this.showScreen('LEVEL_SELECT');
    });

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

    this._setText('menuCoinDisplay', `${st.coins.toLocaleString()} 🪙`);
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

    // Render 6 levels for this world
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

    // Clicking unlocked level opens Briefing Modal!
    levelsGrid.querySelectorAll('.level-card.unlocked').forEach(card => {
      card.addEventListener('click', () => {
        const lvlId = parseInt(card.getAttribute('data-level'), 10);
        window.Sound.playClick();
        this.openLevelBriefing(lvlId);
      });
    });
  }

  // --- LEVEL BRIEFING MODAL ---
  openLevelBriefing(levelId) {
    const lvl = window.LEVELS[levelId - 1];
    if (!lvl) return;
    this.pendingLevelId = levelId;

    this._setText('briefingWorldTag', `WORLD ${lvl.worldId}: ${lvl.worldName.toUpperCase()} • SECTOR ${lvl.id}`);
    this._setText('briefingTitle', lvl.name);
    this._setText('briefingDesc', lvl.objectiveDesc);

    this._setText('briefingObjective', `${lvl.objective}: ${lvl.objectiveTarget} ${lvl.objective === 'SURVIVE' ? 'SECONDS' : (lvl.objective === 'COLLECT' ? 'BEACONS' : 'MUTANTS')}`);
    this._setText('briefingDifficulty', lvl.difficulty.toUpperCase());
    this._setText('briefingEnvironment', `${lvl.timeOfDay.toUpperCase()} • ${lvl.weather.toUpperCase()}`);
    this._setText('briefingWaves', `${lvl.waveCount} ASSAULT WAVES`);

    // Expected enemies badges
    const enemiesBox = document.getElementById('briefingEnemiesList');
    if (enemiesBox) {
      enemiesBox.innerHTML = lvl.enemyTypes.map(t => {
        const arch = window.ZOMBIE_TYPES[t] || { name: t };
        return `<span class="enemy-badge">${arch.name}</span>`;
      }).join('') + (lvl.isBossLevel ? `<span class="enemy-badge boss-badge">⚠️ ${lvl.bossType ? lvl.bossType.toUpperCase() : 'BOSS'}</span>` : '');
    }

    // Rewards
    const rewardsBox = document.getElementById('briefingRewards');
    if (rewardsBox) {
      rewardsBox.innerHTML = `
        <span>+${lvl.reward ? lvl.reward.xp : 200} XP</span>
        <span>+${lvl.reward ? lvl.reward.coins : 100} 🪙</span>
        ${lvl.isBossLevel ? '<span style="border-color: #ec4899; color: #ec4899;">WEAPON MODIFIER</span>' : ''}
      `;
    }

    this.showScreen('BRIEFING');
  }

  // --- 3-2-1-GO COUNTDOWN BEFORE MATCH ---
  startMissionWithCountdown(levelId) {
    const overlay = document.getElementById('countdownOverlay');
    const numEl = document.getElementById('countdownNum');
    const labelEl = document.getElementById('countdownLabel');
    if (!overlay || !numEl) {
      window.gameInstance.startStoryLevel(levelId);
      return;
    }

    overlay.style.display = 'flex';
    let step = 3;
    numEl.textContent = '3';
    if (labelEl) labelEl.textContent = 'PREPARE FOR BATTLE';
    window.Sound.playClick();

    if (this.countdownTimer) clearInterval(this.countdownTimer);

    this.countdownTimer = setInterval(() => {
      step--;
      if (step === 2) {
        numEl.textContent = '2';
        window.Sound.playClick();
      } else if (step === 1) {
        numEl.textContent = '1';
        window.Sound.playClick();
      } else if (step === 0) {
        numEl.textContent = 'GO!';
        if (labelEl) labelEl.textContent = 'ENGAGE HOSTILES';
        window.Sound.playWaveStart();
      } else {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        overlay.style.display = 'none';
        window.gameInstance.startStoryLevel(levelId);
      }
    }, 850);
  }

  // --- RENDER SKILL TREE SCREEN ---
  renderSkillTree() {
    const container = document.getElementById('skillTreeContainer');
    if (!container) return;

    const availableSP = window.Storage.data.skillPoints || 0;
    this._setText('skillPointsCount', availableSP.toString());

    const branches = window.SKILL_TREE_DEFINITIONS;
    const unlocked = window.Storage.data.unlockedSkills || [];

    let html = '';
    for (let branchKey of Object.keys(branches)) {
      const branch = branches[branchKey];
      html += `
        <div class="skill-branch-col">
          <div class="branch-title-box">
            <h3 class="branch-name" style="color: ${branch.color};">${branch.name.toUpperCase()}</h3>
            <p class="branch-desc">${branch.description}</p>
          </div>
          <div class="skill-nodes-list">
            ${branch.skills.map(node => {
              const isUnlocked = unlocked.includes(node.id);
              const meetsReq = !node.requires || unlocked.includes(node.requires);
              const canAfford = availableSP >= node.cost;

              let btnHtml;
              if (isUnlocked) {
                btnHtml = `<button class="btn-skill-action unlocked" disabled>✓ ACTIVE</button>`;
              } else if (meetsReq && canAfford) {
                btnHtml = `<button class="btn-skill-action can-unlock" data-node="${node.id}">UNLOCK (${node.cost} SP)</button>`;
              } else if (!meetsReq) {
                btnHtml = `<button class="btn-skill-action locked" disabled>REQUIRES PREVIOUS NODE</button>`;
              } else {
                btnHtml = `<button class="btn-skill-action locked" disabled>NEED ${node.cost} SP</button>`;
              }

              return `
                <div class="skill-node-card ${isUnlocked ? 'unlocked' : ''}">
                  <div class="skill-node-header">
                    <span class="skill-node-name">${node.name}</span>
                    <span class="skill-node-cost">⭐ ${node.cost} SP</span>
                  </div>
                  <p class="skill-node-desc">${node.desc}</p>
                  ${btnHtml}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = html;

    // Node unlock clicks
    container.querySelectorAll('.btn-skill-action.can-unlock').forEach(btn => {
      btn.addEventListener('click', () => {
        const nodeId = btn.getAttribute('data-node');
        const res = window.Upgrades.unlockSkillNode(nodeId);
        if (res.success) {
          window.Sound.playLevelComplete();
          this.showToast(`Unlocked Skill: ${res.node.name}!`, 'success');
          this.renderSkillTree();
        } else {
          this.showToast(res.msg, 'error');
        }
      });
    });
  }

  // --- RENDER OPERATIVE PROFILE SCREEN ---
  renderProfile() {
    const container = document.getElementById('profileContent');
    if (!container) return;

    const st = window.Storage.data;
    const stats = st.stats;

    // Determine Rank Title
    let rankTitle = 'Cadet Survivor';
    let rankBadge = 'RANK I • RECRUIT';
    if (st.playerLevel >= 46) {
      rankTitle = 'Apex Sovereign';
      rankBadge = 'RANK VI • LEGENDARY GRANDMASTER';
    } else if (st.playerLevel >= 31) {
      rankTitle = 'Citadel Commander';
      rankBadge = 'RANK V • APEX OPERATIVE';
    } else if (st.playerLevel >= 21) {
      rankTitle = 'Veteran Mutator';
      rankBadge = 'RANK IV • SPECIAL FORCES';
    } else if (st.playerLevel >= 13) {
      rankTitle = 'Hardened Ranger';
      rankBadge = 'RANK III • FRONTLINE VETERAN';
    } else if (st.playerLevel >= 6) {
      rankTitle = 'Frontline Scout';
      rankBadge = 'RANK II • OPERATIONAL AGENT';
    }

    // Calculate total stars
    let totalStars = 0;
    for (let k in st.completedLevels) {
      totalStars += (st.completedLevels[k].stars || 0);
    }

    // Format survival time
    const mins = Math.floor((stats.totalSurvivalTime || 0) / 60);
    const secs = Math.floor((stats.totalSurvivalTime || 0) % 60);

    container.innerHTML = `
      <div class="profile-identity-card">
        <div class="profile-avatar-circle">☣️</div>
        <div class="profile-identity-info">
          <span class="profile-rank-badge">${rankBadge}</span>
          <h2 class="profile-rank-title">${rankTitle}</h2>
          <div style="font-size: 0.85rem; color: #cbd5e1;">
            Survivor Level <strong style="color: var(--color-cyan);">${st.playerLevel}</strong> • 
            Experience: <strong style="color: var(--color-gold);">${st.xp} XP</strong> • 
            Skill Points Available: <strong style="color: var(--color-gold);">${st.skillPoints || 0}</strong>
          </div>
        </div>
      </div>

      <div class="profile-stats-grid">
        <div class="profile-stat-box">
          <span>MUTANTS DEFEATED</span>
          <strong>${stats.totalKills.toLocaleString()}</strong>
        </div>
        <div class="profile-stat-box">
          <span>CAMPAIGN PROGRESS</span>
          <strong>${st.highestLevelUnlocked} / 60</strong>
        </div>
        <div class="profile-stat-box">
          <span>STARS EARNED</span>
          <strong style="color: var(--color-gold);">${totalStars} / 180 ★</strong>
        </div>
        <div class="profile-stat-box">
          <span>HIGHEST ENDLESS WAVE</span>
          <strong style="color: var(--color-cyan);">${st.endlessStats.highestWave || 0}</strong>
        </div>
        <div class="profile-stat-box">
          <span>TOTAL SURVIVAL TIME</span>
          <strong>${mins}m ${secs}s</strong>
        </div>
        <div class="profile-stat-box">
          <span>BEST COMBAT COMBO</span>
          <strong style="color: var(--color-gold);">x${stats.maxCombo || 1}</strong>
        </div>
        <div class="profile-stat-box">
          <span>WEAPONS UNLOCKED</span>
          <strong>${st.unlockedWeapons.length} / 10</strong>
        </div>
        <div class="profile-stat-box">
          <span>MODIFIERS COLLECTED</span>
          <strong style="color: var(--color-pink);">${(st.inventory && st.inventory.modifiers) ? st.inventory.modifiers.length : 0} / 8</strong>
        </div>
      </div>
    `;
  }

  // --- RENDER ARSENAL SCREEN (10 WEAPONS & WORKSHOP) ---
  renderArsenal() {
    const grid = document.getElementById('arsenalGrid');
    if (!grid) return;

    this._setText('arsenalCoins', window.Storage.data.coins.toLocaleString());

    const unlocked = window.Storage.data.unlockedWeapons;
    const equipped = window.Storage.data.equippedWeapon;

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
        <span>${label}</span>
        <small>${isMax ? 'MAX' : cost}</small>
      </button>
    `;
  }

  // --- RENDER PLAYER UPGRADES SCREEN ---
  renderPlayerUpgrades() {
    const container = document.getElementById('playerUpgradesList');
    if (!container) return;

    this._setText('playerUpgradeCoins', window.Storage.data.coins.toLocaleString());

    let html = '';
    for (let key of Object.keys(window.PLAYER_UPGRADE_CONFIG)) {
      const cfg = window.PLAYER_UPGRADE_CONFIG[key];
      const curLvl = (window.Storage.data.playerUpgrades && window.Storage.data.playerUpgrades[key]) || (window.Storage.data.upgrades && window.Storage.data.upgrades[key]) || 0;
      const isMax = curLvl >= cfg.maxLevel;
      const cost = isMax ? 0 : cfg.costs[curLvl];

      let pips = '';
      for (let i = 0; i < cfg.maxLevel; i++) {
        pips += `<div class="pip ${i < curLvl ? 'filled' : ''}"></div>`;
      }

      html += `
        <div class="player-upgrade-card">
          <div class="upgrade-icon">${cfg.icon}</div>
          <div class="upgrade-info">
            <div class="upgrade-title-row">
              <h4>${cfg.name}</h4>
              <span class="upgrade-level">Lv ${curLvl} / ${cfg.maxLevel}</span>
            </div>
            <p class="upgrade-desc">${cfg.description}</p>
            <div class="upgrade-pips">${pips}</div>
          </div>
          <button class="btn btn-player-upgrade ${isMax ? 'disabled' : ''}" data-key="${key}" ${isMax ? 'disabled' : ''}>
            ${isMax ? 'MAX LEVEL' : `🪙 ${cost.toLocaleString()} Coins`}
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
    const container = document.getElementById('missionsList');
    if (!container) return;

    let html = '';
    for (let key of Object.keys(window.MISSIONS_CONFIG)) {
      const m = window.MISSIONS_CONFIG[key];
      const prog = window.Missions.getProgress(key);
      const isCompleted = window.Missions.isCompleted(key);
      const pct = Math.min(100, Math.round((prog / m.target) * 100));

      html += `
        <div class="mission-card ${isCompleted ? 'completed' : ''}">
          <div class="mission-info">
            <div class="mission-header">
              <span class="mission-badge">${m.badge}</span>
              <h4 class="mission-title">${m.title}</h4>
            </div>
            <p class="mission-desc">${m.description}</p>
            <div class="mission-progress-bar">
              <div class="mission-progress-fill" style="width: ${pct}%;"></div>
            </div>
            <div class="mission-footer">
              <span>Progress: ${prog} / ${m.target}</span>
              <span style="color: var(--color-gold);">Reward: +${m.reward.xp} XP, 🪙 ${m.reward.coins}</span>
            </div>
          </div>
          ${isCompleted ? '<div class="mission-check">✓ DONE</div>' : ''}
        </div>
      `;
    }

    container.innerHTML = html;
  }

  // --- RENDER ACHIEVEMENTS SCREEN ---
  renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;

    let html = '';
    for (let key of Object.keys(window.ACHIEVEMENTS_CONFIG)) {
      const a = window.ACHIEVEMENTS_CONFIG[key];
      const isUnlocked = window.Storage.data.achievements.includes(key);

      html += `
        <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon">${a.icon}</div>
          <div class="achievement-info">
            <h4 class="achievement-title">${a.title}</h4>
            <p class="achievement-desc">${a.description}</p>
            <span class="achievement-status">${isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}</span>
          </div>
        </div>
      `;
    }

    grid.innerHTML = html;
  }

  // --- RENDER LEADERBOARD SCREEN ---
  renderLeaderboard() {
    const list = document.getElementById('leaderboardList');
    if (!list) return;

    const entries = window.Storage.getLeaderboard();

    let rows = entries.map(entry => `
      <div class="leaderboard-row ${entry.isPlayer ? 'player-entry' : ''}">
        <span class="lb-rank">#${entry.rank}</span>
        <span class="lb-name">${entry.name} ${entry.isPlayer ? '(YOU)' : ''}</span>
        <span class="lb-wave">Wave ${entry.wave}</span>
        <span class="lb-score">${entry.score.toLocaleString()} PTS</span>
      </div>
    `).join('');

    list.innerHTML = `
      <div class="leaderboard-container">
        <div class="leaderboard-header">
          <span>RANK</span>
          <span>OPERATIVE</span>
          <span>WAVE</span>
          <span>SCORE</span>
        </div>
        ${rows}
      </div>
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
  updateHUD(player, waveManager, levelConfig, currentCombo, comboTimer, objectiveProgress, distObjective = null) {
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

    // In-game distance marker
    const distMarker = document.getElementById('hudDistMarker');
    const distText = document.getElementById('hudDistText');
    if (distMarker && distText) {
      if (distObjective !== null && distObjective !== undefined) {
        distMarker.style.display = 'flex';
        distText.textContent = `${distObjective.label}: ${distObjective.distance}m`;
      } else {
        distMarker.style.display = 'none';
      }
    }
  }

  showWaveBanner(text, color = null) {
    const banner = document.getElementById('hudWaveBanner');
    if (!banner) return;
    banner.textContent = text;
    if (color) {
      banner.style.color = color;
      banner.style.borderColor = color;
      banner.style.textShadow = `0 0 30px ${color}`;
    } else {
      banner.style.color = '#ffffff';
      banner.style.borderColor = 'var(--color-cyan)';
      banner.style.textShadow = '0 0 30px var(--color-cyan)';
    }
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
