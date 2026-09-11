/**
 * InfinityPlay - City Builder Master Application Coordinator (V2)
 * Orchestrates HUD, isometric canvas, army recruiting, world map expeditions, 
 * tactical AI battles, research academy, bazaar, and daily rankings.
 */

(function() {
  'use strict';

  // Resilient API Client with automatic localStorage fallback
  const ApiClient = {
    async request(endpoint, method = 'GET', body = null) {
      try {
        const options = {
          method,
          headers: { 'Content-Type': 'application/json' }
        };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(endpoint, options);
        return await res.json();
      } catch (err) {
        console.warn(`API request to ${endpoint} failed, utilizing local fallback:`, err.message);
        return null;
      }
    },

    async getState(userId, userName) {
      const res = await this.request(`/api/city-builder/state?userId=${encodeURIComponent(userId)}&userName=${encodeURIComponent(userName)}`);
      if (res && res.city) {
        this.saveLocal(userId, res.city);
        return res;
      }

      // LocalStorage fallback
      const local = localStorage.getItem(`infinity_city_${userId}`);
      if (local) {
        try {
          return { success: true, city: JSON.parse(local) };
        } catch (e) {}
      }
      return null;
    },

    async placeBuilding(userId, type, x, y) {
      const res = await this.request('/api/city-builder/place', 'POST', { userId, type, x, y });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    async upgradeBuilding(userId, buildingId) {
      const res = await this.request('/api/city-builder/upgrade', 'POST', { userId, buildingId });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    async speedup(userId, buildingId) {
      const res = await this.request('/api/city-builder/speedup', 'POST', { userId, buildingId });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    async moveBuilding(userId, buildingId, newX, newY) {
      const res = await this.request('/api/city-builder/move', 'POST', { userId, buildingId, x: newX, y: newY });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    async trade(userId, fromResource, toResource, amount) {
      const res = await this.request('/api/city-builder/trade', 'POST', { userId, fromResource, toResource, amount });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    async research(userId, techId) {
      const res = await this.request('/api/city-builder/research', 'POST', { userId, techId });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    async collect(userId) {
      const res = await this.request('/api/city-builder/collect', 'POST', { userId });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    async trainUnits(userId, unitType, count) {
      const res = await this.request('/api/city-builder/train', 'POST', { userId, unitType, count });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    async executeBattle(userId, strongholdId, units) {
      const res = await this.request('/api/city-builder/battle', 'POST', { userId, strongholdId, deployedUnits: units, units });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    async claimMission(userId, missionId) {
      const res = await this.request('/api/city-builder/claim-mission', 'POST', { userId, missionId });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    async resetCity(userId, userName) {
      const res = await this.request('/api/city-builder/reset', 'POST', { userId, userName });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    saveLocal(userId, city) {
      try {
        localStorage.setItem(`infinity_city_${userId}`, JSON.stringify(city));
      } catch (e) {}
    }
  };

  const CityApp = {
    audio: null,
    renderer: null,
    game: null,
    currentUser: null,
    activeRankingsTab: 'missions',

    init() {
      // 1. Detect authenticated user from InfinityPlay
      this.detectUser();

      // 2. Initialize Audio & Renderer
      this.audio = new CityAudio.CityAudio();
      const canvas = document.getElementById('cityCanvas');
      this.renderer = new CityRenderer.CityRenderer(canvas, CityConfig);

      // 3. Initialize Game Engine
      this.game = new CityGame.CityGame(CityConfig, this.audio, this.renderer, ApiClient);
      this.game.init(this.currentUser);

      // 4. Start Render Loop
      this.startRenderLoop();

      // 5. Bind UI Buttons & Modals
      this.bindUI();

      console.log('⚡ City Builder Realm of Empires V2 booted for', this.currentUser.name);
    },

    detectUser() {
      try {
        const stored = localStorage.getItem('infinityplay_current_user');
        if (stored) {
          this.currentUser = JSON.parse(stored);
        }
      } catch (e) {}

      if (!this.currentUser) {
        this.currentUser = {
          id: 'user_tharun',
          name: 'Tharun',
          level: 28,
          title: 'Pro Gamer'
        };
      }
    },

    startRenderLoop() {
      const loop = () => {
        try {
          if (this.game && this.game.city) {
            this.renderer.render(this.game.city);
          }
        } catch (err) {
          console.error('Render error:', err);
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },

    bindUI() {
      // Exit Game to InfinityPlay Dashboard
      const exitBtn = document.getElementById('btnExitGame');
      if (exitBtn) {
        exitBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.audio.playClick();
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'exitGame', gameId: 'city-builder' }, '*');
          } else {
            window.location.href = '../../index.html';
          }
        });
      }

      // Center Map button
      const centerBtn = document.getElementById('btnCenterMap');
      if (centerBtn) {
        centerBtn.addEventListener('click', () => {
          this.audio.playClick();
          const ch = this.game.city.buildings.find(b => b.type === 'city_hall');
          if (ch) this.renderer.centerOn(ch.x, ch.y);
          else this.renderer.centerOn(10, 10);
        });
      }

      // Audio mute toggle
      const audioBtn = document.getElementById('btnToggleAudio');
      if (audioBtn) {
        audioBtn.addEventListener('click', () => {
          this.audio.enabled = !this.audio.enabled;
          audioBtn.innerHTML = this.audio.enabled ? '<span>🔊</span>' : '<span>🔇</span>';
          this.showToast(this.audio.enabled ? 'Sound enabled' : 'Sound muted', 'info');
        });
      }

      // Placement cancel button
      const cancelPlacementBtn = document.getElementById('btnCancelPlacement');
      if (cancelPlacementBtn) {
        cancelPlacementBtn.addEventListener('click', () => {
          this.audio.playClick();
          this.game.cancelPlacement();
        });
      }

      // Close buttons for modals & drawers
      document.querySelectorAll('.city-modal-close, .modal-backdrop-clickable').forEach(el => {
        el.addEventListener('click', () => {
          this.audio.playClick();
          this.game.closeAllDrawers();
        });
      });

      // Bottom Dock Buttons
      const btnBuild = document.getElementById('btnDockBuild');
      if (btnBuild) btnBuild.addEventListener('click', () => this.openBuildModal());

      const btnArmy = document.getElementById('btnDockArmy');
      if (btnArmy) btnArmy.addEventListener('click', () => this.openArmyModal());

      const btnWorld = document.getElementById('btnDockWorld');
      if (btnWorld) btnWorld.addEventListener('click', () => this.openWorldModal());

      const btnResearch = document.getElementById('btnDockResearch');
      if (btnResearch) btnResearch.addEventListener('click', () => this.openResearchModal());

      const btnMarket = document.getElementById('btnDockMarket');
      if (btnMarket) btnMarket.addEventListener('click', () => this.openMarketModal());

      const btnRankings = document.getElementById('btnDockRankings');
      if (btnRankings) btnRankings.addEventListener('click', () => this.openRankingsModal());

      // Bind rankings modal tabs
      document.querySelectorAll('.rank-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.audio.playClick();
          document.querySelectorAll('.rank-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeRankingsTab = btn.getAttribute('data-tab');
          this.renderRankingsContent();
        });
      });
    },

    // =========================================================================
    // 1. BUILD MENU MODAL (All 6 Categories)
    // =========================================================================
    openBuildModal() {
      try {
        this.audio.playClick();
        this.game.closeAllDrawers();

        const modal = document.getElementById('buildModal');
        if (!modal) return;

        this.renderBuildGrid(CityConfig.CATEGORIES.CORE);
        this.bindBuildTabs();

        modal.classList.add('active');
      } catch (err) {
        console.error('Error opening build modal:', err);
      }
    },

    bindBuildTabs() {
      const tabs = document.querySelectorAll('.build-tab-btn');
      tabs.forEach(tab => {
        tab.onclick = () => {
          this.audio.playClick();
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const cat = tab.getAttribute('data-cat');
          this.renderBuildGrid(cat);
        };
      });
    },

    renderBuildGrid(category) {
      const container = document.getElementById('buildGridContainer');
      if (!container || !this.game.city) return;

      const buildings = Object.values(CityConfig.BUILDINGS).filter(b => b.category === category);
      const ch = this.game.city.buildings.find(b => b.type === 'city_hall');
      const chLevel = ch ? ch.level : 1;

      container.innerHTML = buildings.map(spec => {
        const level1 = spec.levels[0];
        const cost = level1.cost || {};
        const alreadyBuilt = spec.unique && this.game.city.buildings.some(b => b.type === spec.type);
        const reqMet = !level1.reqCityHall || chLevel >= level1.reqCityHall;

        const hasGold = (this.game.city.resources.gold || 0) >= (cost.gold || 0);
        const hasWood = (this.game.city.resources.wood || 0) >= (cost.wood || 0);
        const hasStone = (this.game.city.resources.stone || 0) >= (cost.stone || 0);
        const hasFood = (this.game.city.resources.food || 0) >= (cost.food || 0);
        const canAfford = hasGold && hasWood && hasStone && hasFood;

        const disabled = alreadyBuilt || !reqMet || !canAfford;

        let statusText = 'Construct';
        if (alreadyBuilt) statusText = 'Built (Max 1)';
        else if (!reqMet) statusText = `Req: Town Hall Lv ${level1.reqCityHall}`;
        else if (!canAfford) statusText = 'Need Resources';

        return `
          <div class="build-card ${disabled ? 'disabled' : ''}">
            <div class="build-card-header">
              <span class="build-card-icon">${spec.icon}</span>
              <div>
                <h4 class="build-card-title">${spec.name}</h4>
                <span class="build-card-size">${spec.size.w}x${spec.size.h} Grid</span>
              </div>
            </div>

            <p class="build-card-desc">${spec.description}</p>

            <div class="build-card-costs">
              ${cost.gold ? `<span class="cost-tag ${hasGold ? '' : 'insufficient'}">🪙 ${cost.gold}</span>` : ''}
              ${cost.wood ? `<span class="cost-tag ${hasWood ? '' : 'insufficient'}">🪵 ${cost.wood}</span>` : ''}
              ${cost.stone ? `<span class="cost-tag ${hasStone ? '' : 'insufficient'}">🪨 ${cost.stone}</span>` : ''}
              ${cost.food ? `<span class="cost-tag ${hasFood ? '' : 'insufficient'}">🌾 ${cost.food}</span>` : ''}
            </div>

            <button class="btn btn-primary btn-build-action" 
                    data-type="${spec.type}" 
                    ${disabled ? 'disabled' : ''}>
              ${statusText}
            </button>
          </div>
        `;
      }).join('');

      // Bind build triggers
      container.querySelectorAll('.btn-build-action:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.getAttribute('data-type');
          this.audio.playClick();
          this.game.startPlacement(type);
        });
      });
    },

    // =========================================================================
    // 2. ARMY COMMAND & TROOP RECRUITMENT MODAL
    // =========================================================================
    openArmyModal() {
      try {
        this.audio.playClick();
        this.game.closeAllDrawers();

        const modal = document.getElementById('armyModal');
        if (!modal) return;

        this.renderArmyCamp();
        modal.classList.add('active');
      } catch (err) {
        console.error('Error opening army modal:', err);
      }
    },

    renderArmyCamp() {
      const body = document.getElementById('armyModalBody');
      if (!body || !this.game.city) return;

      const city = this.game.city;
      const army = city.army || {};
      const queue = city.trainingQueue || [];

      // Calculate total troops and army power
      let totalTroops = 0;
      let totalArmyPower = 0;
      Object.keys(army).forEach(unitType => {
        const count = army[unitType] || 0;
        totalTroops += count;
        const spec = CityConfig.UNITS[unitType];
        if (spec) {
          const pwr = spec.power || Math.floor((spec.damage || 20) * 2 + (spec.hp || 100) * 0.5);
          totalArmyPower += count * pwr;
        }
      });

      const capacity = city.troopCapacity || city.armyCapacity || 50;

      let html = `
        <div class="army-stats-bar">
          <div class="army-stat-chip">
            <span>🛡️ Total Forces:</span>
            <span class="army-stat-val">${totalTroops} / ${capacity}</span>
          </div>
          <div class="army-stat-chip">
            <span>⚡ Military Power:</span>
            <span class="army-stat-val" style="color: #fbbf24;">${totalArmyPower.toLocaleString()}</span>
          </div>
          <div class="army-stat-chip">
            <span>⏳ Training Slots:</span>
            <span class="army-stat-val" style="color: #4ade80;">${queue.length} Active</span>
          </div>
        </div>

        <div class="army-unit-grid">
      `;

      // Render 6 Unit Cards
      Object.values(CityConfig.UNITS).forEach(unit => {
        const currentCount = army[unit.id] || 0;
        const reqBuilding = city.buildings.find(b => b.type === unit.reqBuilding);
        const reqMet = reqBuilding && reqBuilding.level >= (unit.reqLevel || 1);

        const hasGold1 = (city.resources.gold || 0) >= (unit.cost.gold || 0);
        const hasFood1 = (city.resources.food || 0) >= (unit.cost.food || 0);
        const canAfford1 = hasGold1 && hasFood1;

        const hasSpace = totalTroops < capacity;
        const unitDmg = unit.damage || 20;
        const unitPwr = unit.power || Math.floor(unitDmg * 2 + (unit.hp || 100) * 0.5);
        const unitRole = unit.role || 'Combat Infantry';
        const unitTier = unit.tier || (unit.reqLevel || 1);

        html += `
          <div class="army-unit-card">
            <div class="unit-card-header">
              <div class="unit-card-icon">${unit.icon}</div>
              <div class="unit-card-title">
                <h4>${unit.name}</h4>
                <span>${unitRole} • Tier ${unitTier}</span>
              </div>
            </div>

            <div class="unit-stats-pills">
              <span class="unit-pill atk">⚔️ ${unitDmg} ATK</span>
              <span class="unit-pill hp">🛡️ ${unit.hp} HP</span>
              <span class="unit-pill pwr">⚡ ${unitPwr} PWR</span>
            </div>

            <div class="unit-cost-row">
              <span>Cost: 🪙 ${unit.cost.gold || 0} • 🌾 ${unit.cost.food || 0}</span>
              <span>⏱ ${unit.trainTime}s</span>
            </div>

            <div style="font-size: 0.78rem; color: #94a3b8; display: flex; justify-content: space-between;">
              <span>Barracks: <strong style="color: #ffffff;">${currentCount}</strong></span>
              ${!reqMet ? `<span style="color: #f87171;">Req: ${CityConfig.BUILDINGS[unit.reqBuilding]?.name || unit.reqBuilding} Lv ${unit.reqLevel || 1}</span>` : ''}
            </div>

            <div class="unit-train-action">
              <button class="btn btn-primary unit-train-btn" 
                      data-unit="${unit.id}" 
                      data-count="1" 
                      ${(!reqMet || !canAfford1 || !hasSpace) ? 'disabled' : ''}>
                Train x1
              </button>
              <button class="btn btn-ghost" 
                      data-unit="${unit.id}" 
                      data-count="5" 
                      style="font-size: 0.76rem; padding: 6px 8px;"
                      ${(!reqMet || !canAfford1 || !hasSpace) ? 'disabled' : ''}>
                x5
              </button>
            </div>
          </div>
        `;
      });

      html += `</div>`;

      // Active Training Queue Section
      if (queue.length > 0) {
        html += `
          <div class="training-queue-section">
            <div class="training-queue-title">
              <span>Active Training Regiments</span>
              <span style="font-size: 0.75rem; color: var(--city-muted);">${queue.length} in progress</span>
            </div>
            <div class="queue-items-list">
        `;

        const now = Date.now();
        queue.forEach(q => {
          const uSpec = CityConfig.UNITS[q.unitType] || { name: q.unitType, icon: '⚔️', trainTime: 10 };
          const remainingSec = Math.max(0, Math.ceil((q.finishTime - now) / 1000));
          const totalSec = q.totalTime || (uSpec.trainTime * q.count);
          const percent = Math.min(100, Math.max(0, ((totalSec - remainingSec) / totalSec) * 100));
          const gemCost = Math.max(1, Math.ceil(remainingSec / 60));

          html += `
            <div class="queue-item">
              <div class="queue-item-info">
                <span style="font-size: 1.3rem;">${uSpec.icon}</span>
                <div>
                  <strong>${q.count}x ${uSpec.name}</strong>
                  <div style="font-size: 0.72rem; color: #94a3b8;">${remainingSec}s remaining</div>
                </div>
              </div>

              <div class="queue-progress-bar">
                <div class="queue-progress-fill" style="width: ${percent}%;"></div>
              </div>

              <button class="btn btn-ghost btn-speedup-queue" 
                      data-qid="${q.id}" 
                      data-gems="${gemCost}"
                      style="font-size: 0.74rem; color: #38bdf8; border-color: rgba(56, 189, 248, 0.4);">
                ⚡ Finish (${gemCost} 💎)
              </button>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      }

      body.innerHTML = html;

      // Bind Unit Training buttons
      body.querySelectorAll('.unit-train-btn, .btn-ghost[data-count]').forEach(btn => {
        btn.onclick = async () => {
          const unitType = btn.getAttribute('data-unit');
          const count = parseInt(btn.getAttribute('data-count'), 10) || 1;
          const res = await this.game.api.trainUnits(this.currentUser.id, unitType, count);
          if (res && res.success) {
            this.game.city = res.city;
            this.audio.playHammer();
            this.showToast(`Training ${count}x ${CityConfig.UNITS[unitType].name}!`, 'success');
            this.renderArmyCamp();
            this.game.updateHUD();
          } else {
            this.audio.playError();
            this.showToast(res.error || 'Cannot train unit', 'error');
          }
        };
      });

      // Bind instant speedup on training queue
      body.querySelectorAll('.btn-speedup-queue').forEach(btn => {
        btn.onclick = async () => {
          const qid = btn.getAttribute('data-qid');
          const res = await this.game.api.speedup(this.currentUser.id, 'queue_' + qid);
          if (res && res.success) {
            this.game.city = res.city;
            this.audio.playGem();
            this.audio.playUpgrade();
            this.showToast('Regiment training completed instantly!', 'success');
            this.renderArmyCamp();
            this.game.updateHUD();
          } else {
            this.audio.playError();
            this.showToast(res.error || 'Speedup failed', 'error');
          }
        };
      });
    },

    // =========================================================================
    // 3. WORLD MAP EXPEDITIONS & STRONGHOLD CAMPAIGN
    // =========================================================================
    openWorldModal() {
      try {
        this.audio.playClick();
        this.game.closeAllDrawers();

        const modal = document.getElementById('worldModal');
        const body = document.getElementById('worldModalBody');
        if (!modal || !body) return;

        const beaten = this.game.city.strongholdsBeaten || {};
        const completedList = this.game.city.completedStrongholds || [];

        let totalStars = 0;
        CityConfig.WORLD_STRONGHOLDS.forEach(sh => {
          const s = beaten[sh.id] || (completedList.includes(sh.id) ? 3 : 0);
          totalStars += s;
        });

        let html = `
          <div style="font-size: 0.88rem; color: #cbd5e1; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span>Select an enemy stronghold to launch a tactical expedition:</span>
            <span style="color: #fbbf24; font-weight: 800;">⭐ Stars Earned: ${totalStars}/15</span>
          </div>
          <div class="world-provinces-list">
        `;

        CityConfig.WORLD_STRONGHOLDS.forEach(sh => {
          const stars = beaten[sh.id] || (completedList.includes(sh.id) ? 3 : 0);
          const isDefeated = stars > 0;
          const loot = sh.loot || {};
          const shPower = sh.recommendedPower || sh.power || 400;

          let starsHtml = '';
          for (let i = 1; i <= 3; i++) {
            starsHtml += `<span style="color: ${i <= stars ? '#fbbf24' : 'rgba(255,255,255,0.2)'};">★</span>`;
          }

          html += `
            <div class="world-stronghold-card ${isDefeated ? 'defeated' : ''}">
              <div class="stronghold-header">
                <span class="stronghold-icon">${sh.icon || '⚔️'}</span>
                <span class="stronghold-badge ${isDefeated ? 'badge-conquered' : ''}">
                  ${isDefeated ? 'Conquered' : `Tier ${sh.tier || 1}`}
                </span>
              </div>

              <div>
                <h3 style="margin: 0 0 4px 0; color: #ffffff; font-size: 1.05rem;">${sh.name}</h3>
                <p style="margin: 0; color: #94a3b8; font-size: 0.78rem;">${sh.desc || ''}</p>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.82rem; font-weight: 800; color: #ef4444;">🛡️ Power: ${shPower.toLocaleString()}</span>
                <div class="stronghold-stars">${starsHtml}</div>
              </div>

              <div class="stronghold-loot-preview">
                <span style="color: #cbd5e1; font-weight: 700; font-size: 0.74rem;">Plunder Spoils:</span>
                <div class="stronghold-loot-item">
                  <span>🪙 ${(loot.gold || 0).toLocaleString()} Gold</span>
                  <span>🪨 ${(loot.stone || 0).toLocaleString()} Stone</span>
                </div>
                <div class="stronghold-loot-item">
                  <span>🪵 ${(loot.wood || 0).toLocaleString()} Wood</span>
                  <span style="color: #38bdf8;">💎 ${loot.gems || 0} Gems</span>
                </div>
              </div>

              <button class="btn btn-primary btn-attack-stronghold" 
                      data-shid="${sh.id}">
                ⚔️ March to Battle
              </button>
            </div>
          `;
        });

        html += `</div>`;
        body.innerHTML = html;

        // Bind attack buttons
        body.querySelectorAll('.btn-attack-stronghold').forEach(btn => {
          btn.onclick = () => {
            const shId = btn.getAttribute('data-shid');
            const sh = CityConfig.WORLD_STRONGHOLDS.find(s => s.id === shId);
            if (sh) this.openBattlePrepModal(sh);
          };
        });

        modal.classList.add('active');
      } catch (err) {
        console.error('Error opening world modal:', err);
      }
    },

    // =========================================================================
    // 4. BATTLE PREPARATION & TACTICAL SIMULATION MODAL
    // =========================================================================
    openBattlePrepModal(stronghold) {
      try {
        this.audio.playClick();
        this.game.closeAllDrawers();

        const modal = document.getElementById('battleModal');
        const title = document.getElementById('battleModalTitle');
        const body = document.getElementById('battleModalBody');
        if (!modal || !body) return;

        title.innerHTML = `<span>⚔️</span><span>Expedition: ${stronghold.name}</span>`;

        const army = this.game.city.army || {};
        const totalTroops = Object.values(army).reduce((a, b) => a + b, 0);

        if (totalTroops === 0) {
          body.innerHTML = `
            <div class="modal-locked-notice">
              <span style="font-size: 3rem;">🛡️</span>
              <h3>No Available Troops</h3>
              <p>You have no combat troops in your barracks. Recruit units from the <strong>Army</strong> tab before marching to war!</p>
              <button class="btn btn-primary" id="btnGoTrainTroops" style="margin-top: 14px;">
                ⚔️ Open Barracks
              </button>
            </div>
          `;
          document.getElementById('btnGoTrainTroops').onclick = () => this.openArmyModal();
          modal.classList.add('active');
          return;
        }

        const enemyPower = stronghold.recommendedPower || stronghold.power || 400;

        // Deployment Sliders Interface
        let html = `
          <div class="battle-prep-panel">
            <div class="battle-matchup-header">
              <div>
                <div style="font-size: 0.76rem; color: var(--city-muted); text-transform: uppercase;">Expedition Force</div>
                <div id="prepPlayerPower" style="font-size: 1.4rem; font-weight: 900; color: #38bdf8;">0</div>
              </div>
              <div class="battle-army-vs">VS</div>
              <div>
                <div style="font-size: 0.76rem; color: var(--city-muted); text-transform: uppercase;">${stronghold.name}</div>
                <div style="font-size: 1.4rem; font-weight: 900; color: #ef4444;">${enemyPower.toLocaleString()}</div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
              <span>Deploy Expedition Force:</span>
              <button class="btn btn-ghost" id="btnDeployAllTroops" style="font-size: 0.74rem;">Deploy Maximum</button>
            </div>

            <div class="troop-deploy-slider-list" id="troopDeployList">
        `;

        Object.keys(army).forEach(unitType => {
          const count = army[unitType] || 0;
          if (count <= 0) return;
          const uSpec = CityConfig.UNITS[unitType] || { name: unitType, icon: '⚔️', damage: 20, hp: 100 };
          const uPwr = uSpec.power || Math.floor((uSpec.damage || 20) * 2 + (uSpec.hp || 100) * 0.5);

          html += `
            <div class="deploy-slider-row">
              <div class="deploy-unit-name">
                <span>${uSpec.icon}</span>
                <span>${uSpec.name}</span>
              </div>
              <input type="range" class="deploy-slider-input" 
                     data-unit="${unitType}" 
                     data-power="${uPwr}"
                     min="0" max="${count}" value="${count}">
              <div class="deploy-count-val" id="valDeploy_${unitType}">${count}</div>
            </div>
          `;
        });

        html += `
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 8px;">
              <span style="font-size: 0.82rem; color: #94a3b8;">Forecast:</span>
              <span id="prepWinChance" style="font-weight: 800; font-size: 0.88rem;">Calculating...</span>
            </div>

            <button class="btn btn-primary" id="btnCommenceAssault" style="padding: 12px; font-size: 0.95rem;">
              ⚔️ Commence Assault
            </button>
          </div>
        `;

        body.innerHTML = html;

        // Update calculations
        const updateDeployCalc = () => {
          let totalPwr = 0;
          let totalDeployed = 0;
          const sliders = body.querySelectorAll('.deploy-slider-input');
          sliders.forEach(slider => {
            const val = parseInt(slider.value, 10) || 0;
            const uPwr = parseInt(slider.getAttribute('data-power'), 10) || 10;
            const uType = slider.getAttribute('data-unit');
            totalPwr += val * uPwr;
            totalDeployed += val;
            const countEl = document.getElementById(`valDeploy_${uType}`);
            if (countEl) countEl.textContent = val;
          });

          const pwrEl = document.getElementById('prepPlayerPower');
          if (pwrEl) pwrEl.textContent = totalPwr.toLocaleString();

          const chanceEl = document.getElementById('prepWinChance');
          const ratio = totalPwr / enemyPower;
          if (totalDeployed === 0) {
            chanceEl.innerHTML = `<span style="color: #ef4444;">Select troops to deploy</span>`;
            document.getElementById('btnCommenceAssault').disabled = true;
          } else if (ratio < 0.6) {
            chanceEl.innerHTML = `<span style="color: #ef4444;">⚠️ High Risk (Defeat Likely)</span>`;
            document.getElementById('btnCommenceAssault').disabled = false;
          } else if (ratio < 1.0) {
            chanceEl.innerHTML = `<span style="color: #f59e0b;">⚖️ Balanced Conflict (~50%)</span>`;
            document.getElementById('btnCommenceAssault').disabled = false;
          } else if (ratio < 1.5) {
            chanceEl.innerHTML = `<span style="color: #38bdf8;">✓ Favorable Victory (~80%)</span>`;
            document.getElementById('btnCommenceAssault').disabled = false;
          } else {
            chanceEl.innerHTML = `<span style="color: #22c55e;">★ Overwhelming Supremacy (100%)</span>`;
            document.getElementById('btnCommenceAssault').disabled = false;
          }
        };

        body.querySelectorAll('.deploy-slider-input').forEach(slider => {
          slider.oninput = updateDeployCalc;
        });

        const deployAllBtn = document.getElementById('btnDeployAllTroops');
        if (deployAllBtn) {
          deployAllBtn.onclick = () => {
            body.querySelectorAll('.deploy-slider-input').forEach(slider => {
              slider.value = slider.max;
            });
            updateDeployCalc();
          };
        }

        // Commence Assault Trigger
        const assaultBtn = document.getElementById('btnCommenceAssault');
        if (assaultBtn) {
          assaultBtn.onclick = async () => {
            const deployed = {};
            body.querySelectorAll('.deploy-slider-input').forEach(slider => {
              const count = parseInt(slider.value, 10) || 0;
              if (count > 0) {
                deployed[slider.getAttribute('data-unit')] = count;
              }
            });

            // Run Server Battle Simulation
            const res = await this.game.api.executeBattle(this.currentUser.id, stronghold.id, deployed);
            if (res && res.success) {
              this.game.city = res.city;
              this.runTacticalBattleVisualizer(stronghold, deployed, res);
            } else {
              this.audio.playError();
              this.showToast(res.error || 'Expedition failed', 'error');
            }
          };
        }

        updateDeployCalc();
        modal.classList.add('active');
      } catch (err) {
        console.error('Error opening battle prep modal:', err);
      }
    },

    // Animated Real-Time Tactical Combat Visualizer
    runTacticalBattleVisualizer(stronghold, deployedUnits, battleResult) {
      const body = document.getElementById('battleModalBody');
      if (!body) return;

      body.innerHTML = `
        <div style="text-align: center;">
          <h4 style="margin: 0 0 10px 0; color: #ffffff;">Assaulting ${stronghold.name}...</h4>
          <div class="battle-canvas-container">
            <canvas id="tacticalBattleCanvas" width="480" height="260"></canvas>
          </div>
          <div style="font-size: 0.84rem; color: #94a3b8;" id="battleStatusTicker">
            🛡️ Vanguard forces clashing with defensive barricades...
          </div>
        </div>
      `;

      const canvas = document.getElementById('tacticalBattleCanvas');
      const ctx = canvas.getContext('2d');

      // Tactical combatants particles
      const combatants = [];
      const deployedKeys = Object.keys(deployedUnits);
      for (let i = 0; i < 16; i++) {
        const uType = deployedKeys[i % deployedKeys.length] || 'guardian';
        const uSpec = CityConfig.UNITS[uType] || { icon: '⚔️' };
        combatants.push({
          x: 40 + Math.random() * 80,
          y: 40 + Math.random() * 180,
          vx: 1.8 + Math.random() * 1.5,
          vy: (Math.random() - 0.5) * 1.2,
          icon: uSpec.icon,
          team: 'player'
        });
      }

      for (let i = 0; i < 16; i++) {
        combatants.push({
          x: 360 + Math.random() * 80,
          y: 40 + Math.random() * 180,
          vx: -(1.8 + Math.random() * 1.5),
          vy: (Math.random() - 0.5) * 1.2,
          icon: '👹',
          team: 'enemy'
        });
      }

      const projectiles = [];
      let startTime = Date.now();
      const animDuration = 2400;

      const playCombatFrame = () => {
        const elapsed = Date.now() - startTime;
        ctx.fillStyle = '#0b101d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 40) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }

        // Projectiles
        if (Math.random() < 0.25) {
          projectiles.push({
            x: 100, y: 50 + Math.random() * 160,
            tx: 380, ty: 50 + Math.random() * 160,
            progress: 0,
            color: '#00f0ff'
          });
        }
        if (Math.random() < 0.25) {
          projectiles.push({
            x: 380, y: 50 + Math.random() * 160,
            tx: 100, ty: 50 + Math.random() * 160,
            progress: 0,
            color: '#ef4444'
          });
        }

        projectiles.forEach((p, idx) => {
          p.progress += 0.08;
          const cx = p.x + (p.tx - p.x) * p.progress;
          const cy = p.y + (p.ty - p.y) * p.progress - Math.sin(p.progress * Math.PI) * 40;

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(cx, cy, 3, 0, Math.PI * 2);
          ctx.fill();

          if (p.progress >= 1) projectiles.splice(idx, 1);
        });

        // Update combatants
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        combatants.forEach(c => {
          c.x += c.vx;
          c.y += c.vy;

          if (c.team === 'player' && c.x > 220) c.vx = -Math.abs(c.vx);
          if (c.team === 'player' && c.x < 30) c.vx = Math.abs(c.vx);
          if (c.team === 'enemy' && c.x < 260) c.vx = Math.abs(c.vx);
          if (c.team === 'enemy' && c.x > 450) c.vx = -Math.abs(c.vx);

          if (c.y < 30 || c.y > canvas.height - 30) c.vy *= -1;

          ctx.fillText(c.icon, c.x, c.y);
        });

        if (elapsed < animDuration) {
          requestAnimationFrame(playCombatFrame);
        } else {
          this.renderBattleResult(stronghold, battleResult);
        }
      };

      requestAnimationFrame(playCombatFrame);
    },

    renderBattleResult(stronghold, res) {
      const body = document.getElementById('battleModalBody');
      if (!body) return;

      const isVictory = res.victory;
      const stars = res.stars || 0;
      const loot = res.loot || {};
      const casualties = res.casualties || {};

      let starsHtml = '';
      for (let i = 1; i <= 3; i++) {
        starsHtml += `<span style="color: ${i <= stars ? '#fbbf24' : 'rgba(255,255,255,0.2)'};">★</span>`;
      }

      if (isVictory) {
        this.audio.playUpgrade();
      } else {
        this.audio.playError();
      }

      let casualtiesHtml = '';
      const lostKeys = Object.keys(casualties);
      if (lostKeys.length > 0) {
        casualtiesHtml = lostKeys.map(k => `<span>${CityConfig.UNITS[k]?.name || k}: <strong>-${casualties[k]}</strong></span>`).join(' • ');
      } else {
        casualtiesHtml = '<span style="color: #4ade80;">Flawless victory! No friendly casualties.</span>';
      }

      body.innerHTML = `
        <div class="battle-result-banner ${isVictory ? 'victory' : 'defeat'}">
          <div class="battle-result-stars">${starsHtml}</div>
          <h2 style="margin: 0 0 6px 0; font-size: 1.6rem; color: #ffffff;">
            ${isVictory ? 'VICTORY ACHIEVED!' : 'EXPEDITION REPELLED!'}
          </h2>
          <p style="margin: 0; font-size: 0.86rem; color: #cbd5e1;">
            ${isVictory ? `The forces of ${stronghold.name} have been conquered!` : 'Your expedition suffered heavy resistance and retreated.'}
          </p>
        </div>

        ${isVictory ? `
          <div style="font-size: 0.85rem; font-weight: 800; color: #cbd5e1; margin-bottom: 6px;">Plunder Loot Secured:</div>
          <div class="plunder-loot-grid">
            <div class="plunder-item" style="color: #fbbf24;">🪙 +${(loot.gold || 0).toLocaleString()} Gold</div>
            <div class="plunder-item" style="color: #94a3b8;">🪨 +${(loot.stone || 0).toLocaleString()} Stone</div>
            <div class="plunder-item" style="color: #a78bfa;">🪵 +${(loot.wood || 0).toLocaleString()} Wood</div>
            <div class="plunder-item" style="color: #38bdf8;">💎 +${loot.gems || 0} Gems</div>
          </div>
        ` : ''}

        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 14px; margin-top: 12px; font-size: 0.8rem; color: #94a3b8;">
          <strong style="color: #ffffff;">Expedition Casualties:</strong> ${casualtiesHtml}
        </div>

        <div style="display: flex; gap: 10px; margin-top: 16px;">
          <button class="btn btn-ghost" id="btnReturnWorld" style="flex: 1; padding: 10px;">
            🗺️ World Map
          </button>
          <button class="btn btn-primary" id="btnCloseBattleModal" style="flex: 1; padding: 10px;">
            ✓ Return to City
          </button>
        </div>
      `;

      document.getElementById('btnReturnWorld').onclick = () => this.openWorldModal();
      document.getElementById('btnCloseBattleModal').onclick = () => {
        this.game.closeAllDrawers();
        this.game.updateHUD();
      };

      this.game.updateHUD();
    },

    // =========================================================================
    // 5. GRAND BAZAAR RESOURCE EXCHANGE MODAL
    // =========================================================================
    openMarketModal() {
      try {
        this.audio.playClick();
        this.game.closeAllDrawers();

        const modal = document.getElementById('marketModal');
        const body = document.getElementById('marketModalBody');
        if (!modal || !body) return;

        const market = this.game.city.buildings.find(b => b.type === 'marketplace' && b.status === 'idle');
        if (!market) {
          body.innerHTML = `
            <div class="modal-locked-notice">
              <span style="font-size: 3rem;">⚖️</span>
              <h3>Grand Bazaar Not Constructed</h3>
              <p>Construct a Marketplace from the <strong>Development</strong> build menu to trade resources.</p>
            </div>
          `;
          modal.classList.add('active');
          return;
        }

        const spec = CityConfig.BUILDINGS.marketplace;
        const levelSpec = spec.levels[Math.min(market.level - 1, spec.levels.length - 1)];
        const tariff = Math.round((levelSpec.tradeFee || 0.25) * 100);

        body.innerHTML = `
          <div class="trade-interface">
            <div class="trade-tariff-badge">Market Tariff: <strong>${tariff}%</strong> (Level ${market.level} Bazaar)</div>
            
            <div class="trade-selectors">
              <div class="trade-group">
                <label>Give Material:</label>
                <select id="tradeFromRes" class="trade-select">
                  <option value="wood">🪵 Wood (${Math.floor(this.game.city.resources.wood || 0)})</option>
                  <option value="stone">🪨 Stone (${Math.floor(this.game.city.resources.stone || 0)})</option>
                  <option value="food">🌾 Food (${Math.floor(this.game.city.resources.food || 0)})</option>
                  <option value="gold">🪙 Gold (${Math.floor(this.game.city.resources.gold || 0)})</option>
                </select>
              </div>

              <span class="trade-arrow">➔</span>

              <div class="trade-group">
                <label>Receive Material:</label>
                <select id="tradeToRes" class="trade-select">
                  <option value="stone">🪨 Stone</option>
                  <option value="gold">🪙 Gold</option>
                  <option value="wood">🪵 Wood</option>
                  <option value="food">🌾 Food</option>
                </select>
              </div>
            </div>

            <div class="trade-amount-row">
              <label>Amount to Exchange:</label>
              <div style="display: flex; gap: 8px;">
                <input type="number" id="tradeAmountInput" class="trade-input" value="100" min="10" step="50">
                <button class="btn btn-ghost" id="tradeQuick250">+250</button>
                <button class="btn btn-ghost" id="tradeQuick1000">+1,000</button>
              </div>
              <div class="trade-calc-output" id="tradeCalcOutput">Receive: <strong>75</strong> Stone</div>
            </div>

            <button class="btn btn-primary btn-trade-submit" id="btnExecuteTrade">
              ⚖️ Confirm Trade
            </button>
          </div>
        `;

        // Live update trade calculations
        const updateCalc = () => {
          const from = document.getElementById('tradeFromRes').value;
          const to = document.getElementById('tradeToRes').value;
          const amt = parseInt(document.getElementById('tradeAmountInput').value, 10) || 0;
          const out = Math.floor(amt * (1 - (levelSpec.tradeFee || 0.25)));
          const outEl = document.getElementById('tradeCalcOutput');
          if (from === to) {
            outEl.innerHTML = `<span style="color: #f87171;">Select different resources to trade</span>`;
            document.getElementById('btnExecuteTrade').disabled = true;
          } else {
            outEl.innerHTML = `Receive: <strong style="color: var(--color-cyan);">${out.toLocaleString()}</strong> ${CityConfig.RESOURCES[to].name}`;
            document.getElementById('btnExecuteTrade').disabled = amt <= 0 || (this.game.city.resources[from] || 0) < amt;
          }
        };

        document.getElementById('tradeFromRes').onchange = updateCalc;
        document.getElementById('tradeToRes').onchange = updateCalc;
        document.getElementById('tradeAmountInput').oninput = updateCalc;
        document.getElementById('tradeQuick250').onclick = () => {
          document.getElementById('tradeAmountInput').value = parseInt(document.getElementById('tradeAmountInput').value || 0, 10) + 250;
          updateCalc();
        };
        document.getElementById('tradeQuick1000').onclick = () => {
          document.getElementById('tradeAmountInput').value = parseInt(document.getElementById('tradeAmountInput').value || 0, 10) + 1000;
          updateCalc();
        };

        document.getElementById('btnExecuteTrade').onclick = async () => {
          const from = document.getElementById('tradeFromRes').value;
          const to = document.getElementById('tradeToRes').value;
          const amt = parseInt(document.getElementById('tradeAmountInput').value, 10);
          const res = await this.game.api.trade(this.currentUser.id, from, to, amt);
          if (res && res.success) {
            this.game.city = res.city;
            this.audio.playCoin();
            this.showToast(`Traded ${amt} ${CityConfig.RESOURCES[from].name} for ${res.received} ${CityConfig.RESOURCES[to].name}!`, 'success');
            this.openMarketModal();
          } else {
            this.audio.playError();
            this.showToast(res.error || 'Trade failed', 'error');
          }
        };

        updateCalc();
        modal.classList.add('active');
      } catch (err) {
        console.error('Error opening market modal:', err);
      }
    },

    // =========================================================================
    // 6. ACADEMY OF SCIENCE TECH TREE MODAL
    // =========================================================================
    openResearchModal() {
      try {
        this.audio.playClick();
        this.game.closeAllDrawers();

        const modal = document.getElementById('researchModal');
        const body = document.getElementById('researchModalBody');
        if (!modal || !body) return;

        const academy = this.game.city.buildings.find(b => b.type === 'research_center' && b.status === 'idle');
        if (!academy) {
          body.innerHTML = `
            <div class="modal-locked-notice">
              <span style="font-size: 3rem;">🔬</span>
              <h3>Academy of Science Required</h3>
              <p>Construct the Academy of Science from the <strong>Development</strong> build menu to research technologies.</p>
            </div>
          `;
          modal.classList.add('active');
          return;
        }

        body.innerHTML = `
          <div class="tech-grid">
            ${CityConfig.TECH_TREE.map(tech => {
              const isUnlocked = this.game.city.unlockedTechs && this.game.city.unlockedTechs.includes(tech.id);
              const canResearch = academy.level >= tech.tier;

              const hasGold = (this.game.city.resources.gold || 0) >= (tech.cost.gold || 0);
              const hasWood = (this.game.city.resources.wood || 0) >= (tech.cost.wood || 0);
              const hasStone = (this.game.city.resources.stone || 0) >= (tech.cost.stone || 0);
              const hasFood = (this.game.city.resources.food || 0) >= (tech.cost.food || 0);
              const canAfford = hasGold && hasWood && hasStone && hasFood;

              return `
                <div class="tech-card ${isUnlocked ? 'unlocked' : ''} ${!canResearch ? 'locked' : ''}">
                  <div class="tech-card-top">
                    <span class="tech-icon">${tech.icon}</span>
                    <div style="flex: 1;">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h4 class="tech-title">${tech.name}</h4>
                        <span class="tech-tier">Tier ${tech.tier}</span>
                      </div>
                      <p class="tech-desc">${tech.description}</p>
                    </div>
                  </div>

                  <div class="tech-costs">
                    ${tech.cost.gold ? `<span class="cost-tag ${hasGold ? '' : 'insufficient'}">🪙 ${tech.cost.gold}</span>` : ''}
                    ${tech.cost.wood ? `<span class="cost-tag ${hasWood ? '' : 'insufficient'}">🪵 ${tech.cost.wood}</span>` : ''}
                    ${tech.cost.stone ? `<span class="cost-tag ${hasStone ? '' : 'insufficient'}">🪨 ${tech.cost.stone}</span>` : ''}
                    ${tech.cost.food ? `<span class="cost-tag ${hasFood ? '' : 'insufficient'}">🌾 ${tech.cost.food}</span>` : ''}
                  </div>

                  <div style="margin-top: 10px;">
                    ${isUnlocked ? `
                      <div class="tech-status-unlocked">✓ Researched & Active</div>
                    ` : `
                      <button class="btn btn-primary btn-tech-research" 
                              data-tech="${tech.id}" 
                              ${(!canResearch || !canAfford) ? 'disabled' : ''}>
                        ${!canResearch ? `Requires Academy Lv ${tech.tier}` : 'Research Technology'}
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;

        // Bind research buttons
        body.querySelectorAll('.btn-tech-research:not([disabled])').forEach(btn => {
          btn.onclick = async () => {
            const techId = btn.getAttribute('data-tech');
            const res = await this.game.api.research(this.currentUser.id, techId);
            if (res && res.success) {
              this.game.city = res.city;
              this.audio.playGem();
              this.audio.playUpgrade();
              this.showToast(`Researched ${res.tech.name}!`, 'success');
              this.openResearchModal();
            } else {
              this.audio.playError();
              this.showToast(res.error || 'Research failed', 'error');
            }
          };
        });

        modal.classList.add('active');
      } catch (err) {
        console.error('Error opening research modal:', err);
      }
    },

    // =========================================================================
    // 7. RANKINGS & DAILY MISSIONS MODAL
    // =========================================================================
    openRankingsModal() {
      try {
        this.audio.playClick();
        this.game.closeAllDrawers();

        const modal = document.getElementById('rankingsModal');
        if (!modal) return;

        this.renderRankingsContent();
        modal.classList.add('active');
      } catch (err) {
        console.error('Error opening rankings modal:', err);
      }
    },

    renderRankingsContent() {
      const body = document.getElementById('rankingsModalBody');
      if (!body || !this.game.city) return;

      if (this.activeRankingsTab === 'missions') {
        this.renderDailyMissions(body);
      } else {
        this.renderLeaderboard(body);
      }
    },

    renderDailyMissions(container) {
      const city = this.game.city;
      const missions = city.dailyMissions || CityConfig.DAILY_MISSIONS || [];

      let html = `<div class="missions-list">`;

      missions.forEach(m => {
        const goal = m.goal || 1;
        const current = m.current || 0;
        const isCompleted = m.completed || current >= goal;
        const isClaimed = !!m.claimed;
        const percent = Math.min(100, Math.floor((current / goal) * 100));
        const reward = m.reward || { gems: 10, gold: 500 };

        let rewardStr = '';
        if (reward.gems) rewardStr += `+${reward.gems} 💎 `;
        if (reward.gold) rewardStr += `+${reward.gold} 🪙 `;
        if (reward.xp) rewardStr += `+${reward.xp} XP `;

        html += `
          <div class="mission-item-card ${isCompleted ? 'completed' : ''}">
            <div class="mission-info" style="flex: 1;">
              <h4>${m.title}</h4>
              <p>${m.desc}</p>
              <div class="mission-progress-bar-wrap">
                <div class="mission-progress-fill" style="width: ${percent}%;"></div>
              </div>
              <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 4px;">
                Progress: <strong>${Math.min(current, goal)} / ${goal}</strong>
              </div>
            </div>

            <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
              <span style="font-weight: 800; font-size: 0.88rem; color: #38bdf8;">
                ${rewardStr}
              </span>
              ${isClaimed ? `
                <span class="quest-badge" style="background: rgba(34,197,94,0.2); color: #4ade80;">✓ Claimed</span>
              ` : `
                <button class="btn btn-primary btn-claim-mission" 
                        data-mid="${m.id}" 
                        ${!isCompleted ? 'disabled' : ''}>
                  ${isCompleted ? 'Claim Reward' : 'In Progress'}
                </button>
              `}
            </div>
          </div>
        `;
      });

      html += `</div>`;
      container.innerHTML = html;

      // Bind claim buttons
      container.querySelectorAll('.btn-claim-mission:not([disabled])').forEach(btn => {
        btn.onclick = async () => {
          const mid = btn.getAttribute('data-mid');
          const res = await this.game.api.claimMission(this.currentUser.id, mid);
          if (res && res.success) {
            this.game.city = res.city;
            this.audio.playGem();
            this.showToast('Daily mission reward claimed!', 'success');
            this.renderRankingsContent();
            this.game.updateHUD();
          } else {
            this.audio.playError();
            this.showToast(res.error || 'Claim failed', 'error');
          }
        };
      });
    },

    renderLeaderboard(container) {
      const cityPower = this.game.city.power || this.game.city.cityPower || 1200;
      const ch = this.game.city.buildings.find(b => b.type === 'city_hall');
      const chLevel = ch ? ch.level : 1;

      const leaderboard = [
        { rank: 1, name: 'Emperor Aurelius', title: 'Grand Imperator', level: 10, power: 14850, avatar: '👑' },
        { rank: 2, name: 'Valerius the Bold', title: 'High Commander', level: 9, power: 11200, avatar: '⚔️' },
        { rank: 3, name: this.currentUser.name || 'Tharun', title: 'Lord of the Realm', level: chLevel, power: cityPower, avatar: '🛡️', isPlayer: true },
        { rank: 4, name: 'Archon Lysander', title: 'Master of Coin', level: 8, power: 8900, avatar: '⚖️' },
        { rank: 5, name: 'Lady Eleanor', title: 'Grand Scholar', level: 7, power: 7400, avatar: '🔬' },
        { rank: 6, name: 'Baron Von Stahl', title: 'Iron Defender', level: 6, power: 5800, avatar: '🏰' },
        { rank: 7, name: 'Shadowblade', title: 'Frontier Pioneer', level: 5, power: 4200, avatar: '🗡️' },
        { rank: 8, name: 'Novice Builder', title: 'Citizen Architect', level: 4, power: 3100, avatar: '🌲' }
      ];

      // Sort by power descending
      leaderboard.sort((a, b) => b.power - a.power);
      leaderboard.forEach((item, index) => item.rank = index + 1);

      let html = `
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Warlord</th>
              <th>Title</th>
              <th>City Lv</th>
              <th style="text-align: right;">Power</th>
            </tr>
          </thead>
          <tbody>
      `;

      leaderboard.forEach(entry => {
        const isPlayer = !!entry.isPlayer;
        html += `
          <tr style="${isPlayer ? 'background: rgba(0, 240, 255, 0.08); font-weight: 800;' : ''}">
            <td>
              <span class="leaderboard-rank-badge rank-${entry.rank <= 3 ? entry.rank : 'other'}">
                ${entry.rank}
              </span>
            </td>
            <td>
              <span style="margin-right: 6px;">${entry.avatar}</span>
              <strong style="${isPlayer ? 'color: var(--city-cyan);' : 'color: #ffffff;'}">${entry.name}</strong>
              ${isPlayer ? ' (You)' : ''}
            </td>
            <td style="color: #94a3b8;">${entry.title}</td>
            <td>${entry.level}</td>
            <td style="text-align: right; color: #fbbf24; font-weight: 800;">${entry.power.toLocaleString()}</td>
          </tr>
        `;
      });

      html += `
          </tbody>
        </table>
      `;

      container.innerHTML = html;
    },

    // Toast Notifications
    showToast(message, type = 'info') {
      let container = document.getElementById('cityToastContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'cityToastContainer';
        container.className = 'city-toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `city-toast toast-${type}`;
      toast.textContent = message;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, 3200);
    }
  };

  window.CityApp = CityApp;

  // Auto-boot on DOM ready or immediately if already loaded
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        CityApp.init();
      });
    } else {
      CityApp.init();
    }
  }

})();
