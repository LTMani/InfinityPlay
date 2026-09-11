/**
 * InfinityPlay - City Builder Master Application Coordinator (V2)
 * Manages user authentication, modal flows (Build Menu with 6 categories, Army Training Grounds,
 * World Campaign Map, Grand Bazaar, Academy of Science, Daily Missions & Leaderboard),
 * and connects real-time tactical battle UI with the server persistence API.
 */

(function() {
  'use strict';

  // =========================================================================
  // 1. API CLIENT WITH AUTHORITATIVE ENDPOINTS & LOCAL FALLBACK
  // =========================================================================
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

    async trainTroops(userId, unitType, count) {
      const res = await this.request('/api/city-builder/train', 'POST', { userId, unitId: unitType, unitType, count });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    async battleResult(userId, nodeId, destructionPercent, stars, casualties) {
      const res = await this.request('/api/city-builder/battle-result', 'POST', {
        userId,
        targetId: nodeId,
        nodeId,
        destructionPercent,
        stars,
        casualties
      });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    async claimMission(userId, missionId) {
      const res = await this.request('/api/city-builder/claim-mission', 'POST', { userId, missionId });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    async claimAchievement(userId, achievementId) {
      const res = await this.request('/api/city-builder/claim-achievement', 'POST', { userId, achievementId, achId: achievementId });
      if (res && res.city) this.saveLocal(userId, res.city);
      return res;
    },

    async getRankings() {
      const res = await this.request('/api/city-builder/rankings', 'GET');
      return res && res.rankings ? res.rankings : [];
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

  // =========================================================================
  // 2. CITY APP MASTER COORDINATOR
  // =========================================================================
  const CityApp = {
    audio: null,
    renderer: null,
    game: null,
    currentUser: null,
    activeQuestsTab: 'missions',

    init() {
      // 1. Detect authenticated user from InfinityPlay
      this.detectUser();

      // 2. Initialize Procedural Audio & Isometric Canvas Renderer
      this.audio = new CityAudio.CityAudio();
      const canvas = document.getElementById('cityCanvas');
      this.renderer = new CityRenderer.CityRenderer(canvas, CityConfig);

      // 3. Initialize Game Engine
      this.game = new CityGame.CityGame(CityConfig, this.audio, this.renderer, ApiClient);
      this.game.init(this.currentUser);

      // 4. Start 60 FPS Render Loop
      this.startRenderLoop();

      // 5. Bind UI Buttons & Modals
      this.bindUI();

      console.log('⚡ City Builder V2 Game initialized successfully for', this.currentUser.name);
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
      // Exit Game to InfinityPlay Platform
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
          const ch = (this.game.city.buildings || []).find(b => b.type === 'city_hall');
          if (ch) this.renderer.centerOn(ch.x, ch.y);
          else this.renderer.centerOn(12, 12);
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

      // Battle Retreat button
      const retreatBtn = document.getElementById('btnBattleRetreat');
      if (retreatBtn) {
        retreatBtn.addEventListener('click', () => {
          if (this.game.battle && this.game.battle.active) {
            this.audio.playClick();
            const stars = this.game.battle.destructionPercent >= 100 ? 3 : (this.game.battle.destructionPercent >= 50 ? 1 : 0);
            this.game.finishBattle(stars);
          }
        });
      }

      // Bottom Action Dock Buttons
      const btnBuild = document.getElementById('btnDockBuild');
      if (btnBuild) btnBuild.addEventListener('click', () => this.openBuildModal());

      const btnArmy = document.getElementById('btnDockArmy');
      if (btnArmy) btnArmy.addEventListener('click', () => this.openArmyModal());

      const btnWorld = document.getElementById('btnDockWorld');
      if (btnWorld) btnWorld.addEventListener('click', () => this.openWorldMapModal());

      const btnResearch = document.getElementById('btnDockResearch');
      if (btnResearch) btnResearch.addEventListener('click', () => this.openResearchModal());

      const btnMarket = document.getElementById('btnDockMarket');
      if (btnMarket) btnMarket.addEventListener('click', () => this.openMarketModal());

      const btnQuests = document.getElementById('btnDockQuests');
      if (btnQuests) btnQuests.addEventListener('click', () => this.openQuestsModal());
    },

    // =========================================================================
    // 3. BUILD MENU MODAL (6 Architectural Categories)
    // =========================================================================
    openBuildModal() {
      this.audio.playClick();
      this.game.closeAllDrawers();

      const modal = document.getElementById('buildModal');
      if (!modal) return;

      this.renderBuildGrid(CityConfig.CATEGORIES.CORE);
      this.bindBuildTabs();

      modal.classList.add('active');
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
      const ch = (this.game.city.buildings || []).find(b => b.type === 'city_hall');
      const chLevel = ch ? ch.level : 1;

      container.innerHTML = buildings.map(spec => {
        const level1 = spec.levels[0];
        const cost = level1.cost;
        const alreadyBuilt = spec.unique && (this.game.city.buildings || []).some(b => b.type === spec.type);
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
    // 4. ARMY TRAINING GROUNDS MODAL
    // =========================================================================
    openArmyModal() {
      this.audio.playClick();
      this.game.closeAllDrawers();

      const modal = document.getElementById('armyModal');
      const body = document.getElementById('armyModalBody');
      if (!modal || !body) return;

      const barracks = (this.game.city.buildings || []).find(b => b.type === 'training_grounds' || b.type === 'barracks');
      const barracksLevel = barracks ? barracks.level : 0;
      const armyCap = this.game.city.armyCapacity || 50;

      // Calculate current army count
      const army = this.game.city.army || {};
      let totalUnits = 0;
      Object.entries(army).forEach(([uId, count]) => {
        const spec = CityConfig.UNITS[uId] || { housing: 1 };
        totalUnits += count * (spec.housing || 1);
      });

      const queue = this.game.city.trainingQueue || [];
      const now = Date.now();

      body.innerHTML = `
        <div class="army-overview-bar">
          <div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #ffffff;">
              ${barracks ? `Training Grounds Level ${barracksLevel}` : 'Training Grounds Not Built (Construct in Military Tab)'}
            </div>
            <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 2px;">
              Army Strength: <strong>${Object.values(army).reduce((a, b) => a + b, 0)} troops</strong>
            </div>
          </div>
          <div class="army-cap-badge">
            Housing: <strong>${totalUnits} / ${armyCap}</strong>
          </div>
        </div>

        ${queue.length > 0 ? `
          <div class="army-queue-section">
            <div class="army-queue-title">
              <span>⏳ Active Recruitment Queue (${queue.length})</span>
            </div>
            <div class="army-queue-list">
              ${queue.map(q => {
                const uId = q.unitId || q.unitType;
                const spec = CityConfig.UNITS[uId] || { name: uId, icon: '⚔️' };
                const remSec = Math.max(0, Math.ceil((q.finishTime - now) / 1000));
                const gemSpeedup = Math.max(1, Math.ceil(remSec / 45));
                return `
                  <div class="army-queue-item">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 1.4rem;">${spec.icon}</span>
                      <div>
                        <strong style="color: #ffffff; font-size: 0.85rem;">${q.count}x ${spec.name}</strong>
                        <div style="font-size: 0.75rem; color: #00f0ff;">${this.game.formatDuration(remSec)} remaining</div>
                      </div>
                    </div>
                    <button class="btn btn-ghost btn-speedup-queue" style="color: #67e8f9; border-color: rgba(6, 182, 212, 0.4);" data-id="${q.id}">
                      ⚡ Instant (${gemSpeedup} 💎)
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <div class="unit-training-grid">
          ${Object.entries(CityConfig.UNITS).map(([uId, uSpec]) => {
            const reqBld = (this.game.city.buildings || []).find(b => (b.type === uSpec.requiredBuilding || (uSpec.requiredBuilding === 'training_grounds' && b.type === 'barracks')) && (!b.status || b.status === 'idle'));
            const unlocked = reqBld && reqBld.level >= uSpec.requiredBuildingLevel;
            const cost = uSpec.cost;

            const hasFood = (this.game.city.resources.food || 0) >= (cost.food || 0);
            const hasWood = (this.game.city.resources.wood || 0) >= (cost.wood || 0);
            const hasStone = (this.game.city.resources.stone || 0) >= (cost.stone || 0);
            const hasGold = (this.game.city.resources.gold || 0) >= (cost.gold || 0);
            const canAfford1 = hasFood && hasWood && hasStone && hasGold && (totalUnits + (uSpec.housing || 1) <= armyCap);

            return `
              <div class="unit-train-card ${!unlocked ? 'locked' : ''}">
                <div class="unit-train-header">
                  <span class="unit-train-icon">${uSpec.icon}</span>
                  <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <h4 style="font-size: 0.95rem; color: #ffffff; font-weight: 800;">${uSpec.name}</h4>
                      <span style="font-size: 0.75rem; color: #fbbf24; font-weight: 800;">In Army: ${army[uId] || 0}</span>
                    </div>
                    <div style="font-size: 0.75rem; color: #94a3b8;">${uSpec.role}</div>
                  </div>
                </div>

                <div class="unit-train-stats">
                  <div>⚔️ ATK: <strong>${uSpec.damage}</strong></div>
                  <div>🛡️ HP: <strong>${uSpec.hp}</strong></div>
                  <div>🎯 RNG: <strong>${uSpec.range}</strong></div>
                  <div>🏃 SPD: <strong>${uSpec.moveSpeed}</strong></div>
                  <div style="grid-column: span 2; color: #a5b4fc;">🎯 Focus: ${(uSpec.targetPreference || 'any').toUpperCase()}</div>
                </div>

                <div class="build-card-costs" style="margin: 4px 0;">
                  ${cost.food ? `<span class="cost-tag ${hasFood ? '' : 'insufficient'}">🌾 ${cost.food}</span>` : ''}
                  ${cost.wood ? `<span class="cost-tag ${hasWood ? '' : 'insufficient'}">🪵 ${cost.wood}</span>` : ''}
                  ${cost.stone ? `<span class="cost-tag ${hasStone ? '' : 'insufficient'}">🪨 ${cost.stone}</span>` : ''}
                  ${cost.gold ? `<span class="cost-tag ${hasGold ? '' : 'insufficient'}">🪙 ${cost.gold}</span>` : ''}
                  <span class="cost-tag">⏱ ${uSpec.trainTime}s</span>
                </div>

                <div class="unit-train-actions">
                  ${!unlocked ? `
                    <div style="font-size: 0.78rem; color: #f87171; font-weight: 700;">
                      Requires ${CityConfig.BUILDINGS[uSpec.requiredBuilding] ? CityConfig.BUILDINGS[uSpec.requiredBuilding].name : 'Building'} Lv ${uSpec.requiredBuildingLevel}
                    </div>
                  ` : `
                    <button class="btn btn-primary btn-train-unit" data-unit="${uId}" data-count="1" style="flex: 1; padding: 7px;" ${!canAfford1 ? 'disabled' : ''}>
                      Train 1
                    </button>
                    <button class="btn btn-ghost btn-train-unit" data-unit="${uId}" data-count="5" style="padding: 7px 10px;" ${!canAfford1 ? 'disabled' : ''}>
                      +5
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      // Bind train buttons
      body.querySelectorAll('.btn-train-unit').forEach(btn => {
        btn.onclick = async () => {
          const unit = btn.getAttribute('data-unit');
          const count = parseInt(btn.getAttribute('data-count'), 10) || 1;
          const res = await this.game.api.trainTroops(this.currentUser.id, unit, count);
          if (res && res.success) {
            this.game.city = res.city;
            this.audio.playHammer();
            this.showToast(`Recruiting ${count}x ${CityConfig.UNITS[unit].name}!`, 'success');
            this.openArmyModal();
          } else {
            this.audio.playError();
            this.showToast(res.error || 'Training failed', 'error');
          }
        };
      });

      // Bind speedup queue buttons
      body.querySelectorAll('.btn-speedup-queue').forEach(btn => {
        btn.onclick = async () => {
          const queueId = btn.getAttribute('data-id');
          const q = (this.game.city.trainingQueue || []).find(item => item.id === queueId);
          if (!q) return;

          const remSec = Math.max(0, Math.ceil((q.finishTime - Date.now()) / 1000));
          const gemSpeedup = Math.max(1, Math.ceil(remSec / 45));

          if ((this.game.city.resources.gems || 0) < gemSpeedup) {
            this.audio.playError();
            this.showToast('Insufficient gems for instant recruitment', 'error');
            return;
          }

          this.game.city.resources.gems -= gemSpeedup;
          q.finishTime = Date.now() - 1000;
          this.audio.playGem();
          this.audio.playUpgrade();
          await this.game.syncWithServer();
          this.openArmyModal();
        };
      });

      modal.classList.add('active');
    },

    // =========================================================================
    // 5. WORLD CAMPAIGN MAP MODAL
    // =========================================================================
    openWorldMapModal() {
      this.audio.playClick();
      this.game.closeAllDrawers();

      const modal = document.getElementById('worldMapModal');
      const body = document.getElementById('worldMapModalBody');
      if (!modal || !body) return;

      const playerPower = this.game.city.cityPower || 450;
      const progress = this.game.city.campaignProgress || {};

      body.innerHTML = `
        <div class="world-map-list">
          ${CityConfig.CAMPAIGN_NODES.map(node => {
            const nodeProg = progress[node.id] || { stars: 0 };
            const stars = typeof nodeProg === 'number' ? nodeProg : (nodeProg.stars || 0);
            const isPowerReady = playerPower >= node.recommendedPower;
            const starsHtml = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

            return `
              <div class="world-node-card">
                <div class="world-node-info">
                  <span class="world-node-icon">${node.icon}</span>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <h3 style="color: #ffffff; font-size: 1.1rem; font-weight: 800;">${node.name}</h3>
                      <span class="world-power-badge ${isPowerReady ? 'ready' : 'danger'}">
                        ${isPowerReady ? '✓ Match' : '⚠️ Challenging'}
                      </span>
                    </div>
                    <p style="color: #94a3b8; font-size: 0.82rem; margin-top: 2px;">${node.description}</p>
                    <div class="world-loot-preview">
                      <span>Rec. Power: <strong>${node.recommendedPower.toLocaleString()}</strong></span>
                      <span>|</span>
                      <span>Loot: 🪙 ${node.loot.gold.toLocaleString()} • 🪵 ${node.loot.wood.toLocaleString()} • 🌾 ${node.loot.food.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                  <div style="font-size: 1.2rem; letter-spacing: 2px; color: #fbbf24;">${starsHtml}</div>
                  <button class="btn btn-primary btn-attack-node" data-node="${node.id}" style="padding: 10px 20px;">
                    ⚔️ Attack Stronghold
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      // Bind attack buttons
      body.querySelectorAll('.btn-attack-node').forEach(btn => {
        btn.onclick = () => {
          const nodeId = btn.getAttribute('data-node');
          this.audio.playClick();
          this.game.launchBattle(nodeId);
        };
      });

      modal.classList.add('active');
    },

    // =========================================================================
    // 6. GRAND BAZAAR MARKETPLACE MODAL
    // =========================================================================
    openMarketModal() {
      this.audio.playClick();
      this.game.closeAllDrawers();

      const modal = document.getElementById('marketModal');
      const body = document.getElementById('marketModalBody');
      if (!modal || !body) return;

      const market = (this.game.city.buildings || []).find(b => b.type === 'marketplace' && (!b.status || b.status === 'idle'));
      if (!market) {
        body.innerHTML = `
          <div class="modal-locked-notice" style="text-align: center; padding: 24px;">
            <span style="font-size: 3rem;">⚖️</span>
            <h3 style="color: #ffffff; margin-top: 8px;">Grand Bazaar Not Constructed</h3>
            <p style="color: #94a3b8; margin-top: 4px;">Construct a Marketplace from the <strong>Development</strong> build menu to trade resources.</p>
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
          <div class="trade-tariff-badge" style="background: rgba(251, 191, 36, 0.15); border: 1px solid rgba(251, 191, 36, 0.35); color: #fbbf24; padding: 8px 14px; border-radius: 8px; font-weight: 700; margin-bottom: 14px;">
            Market Tariff: <strong>${tariff}%</strong> (Level ${market.level} Bazaar)
          </div>
          
          <div class="trade-selectors">
            <div class="trade-group">
              <label style="color: #94a3b8; font-size: 0.8rem; font-weight: 700;">Give Material:</label>
              <select id="tradeFromRes" class="trade-select" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.4); border: 1px solid var(--city-border); color: #ffffff; border-radius: 8px; margin-top: 4px;">
                <option value="wood">🪵 Wood (${Math.floor(this.game.city.resources.wood || 0).toLocaleString()})</option>
                <option value="stone">🪨 Stone (${Math.floor(this.game.city.resources.stone || 0).toLocaleString()})</option>
                <option value="food">🌾 Food (${Math.floor(this.game.city.resources.food || 0).toLocaleString()})</option>
                <option value="gold">🪙 Gold (${Math.floor(this.game.city.resources.gold || 0).toLocaleString()})</option>
              </select>
            </div>

            <span class="trade-arrow" style="color: var(--city-cyan); font-size: 1.5rem; align-self: center;">➔</span>

            <div class="trade-group">
              <label style="color: #94a3b8; font-size: 0.8rem; font-weight: 700;">Receive Material:</label>
              <select id="tradeToRes" class="trade-select" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.4); border: 1px solid var(--city-border); color: #ffffff; border-radius: 8px; margin-top: 4px;">
                <option value="stone">🪨 Stone</option>
                <option value="gold">🪙 Gold</option>
                <option value="wood">🪵 Wood</option>
                <option value="food">🌾 Food</option>
              </select>
            </div>
          </div>

          <div class="trade-amount-row" style="margin-top: 14px;">
            <label style="color: #94a3b8; font-size: 0.8rem; font-weight: 700;">Amount to Exchange:</label>
            <div style="display: flex; gap: 8px; margin-top: 4px;">
              <input type="number" id="tradeAmountInput" class="trade-input" value="100" min="10" step="50" style="flex: 1; padding: 8px; background: rgba(0,0,0,0.4); border: 1px solid var(--city-border); color: #ffffff; border-radius: 8px;">
              <button class="btn btn-ghost" id="tradeQuick250">+250</button>
              <button class="btn btn-ghost" id="tradeQuick1000">+1,000</button>
            </div>
            <div class="trade-calc-output" id="tradeCalcOutput" style="margin-top: 10px; font-size: 0.95rem;">Receive: <strong>75</strong> Stone</div>
          </div>

          <button class="btn btn-primary btn-trade-submit" id="btnExecuteTrade" style="width: 100%; padding: 12px; margin-top: 16px;">
            ⚖️ Confirm Trade
          </button>
        </div>
      `;

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
          outEl.innerHTML = `Receive: <strong style="color: var(--city-cyan);">${out.toLocaleString()}</strong> ${CityConfig.RESOURCES[to].name}`;
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
    },

    // =========================================================================
    // 7. ACADEMY OF SCIENCE TECH TREE MODAL
    // =========================================================================
    openResearchModal() {
      this.audio.playClick();
      this.game.closeAllDrawers();

      const modal = document.getElementById('researchModal');
      const body = document.getElementById('researchModalBody');
      if (!modal || !body) return;

      const academy = (this.game.city.buildings || []).find(b => b.type === 'research_center' && (!b.status || b.status === 'idle'));
      if (!academy) {
        body.innerHTML = `
          <div class="modal-locked-notice" style="text-align: center; padding: 24px;">
            <span style="font-size: 3rem;">🔬</span>
            <h3 style="color: #ffffff; margin-top: 8px;">Academy of Science Required</h3>
            <p style="color: #94a3b8; margin-top: 4px;">Construct the Academy of Science from the <strong>Development</strong> build menu to research technologies.</p>
          </div>
        `;
        modal.classList.add('active');
        return;
      }

      body.innerHTML = `
        <div class="tech-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px;">
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

                <div class="tech-costs" style="margin-top: 8px;">
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
    },

    // =========================================================================
    // 8. QUESTS, MISSIONS & LEADERBOARD MODAL
    // =========================================================================
    async openQuestsModal() {
      this.audio.playClick();
      this.game.closeAllDrawers();

      const modal = document.getElementById('questsModal');
      const body = document.getElementById('questsModalBody');
      if (!modal || !body) return;

      body.innerHTML = `
        <div class="quest-tabs">
          <button class="quest-tab-btn ${this.activeQuestsTab === 'missions' ? 'active' : ''}" data-tab="missions">📅 Daily Missions</button>
          <button class="quest-tab-btn ${this.activeQuestsTab === 'achievements' ? 'active' : ''}" data-tab="achievements">🏆 Empire Achievements</button>
          <button class="quest-tab-btn ${this.activeQuestsTab === 'leaderboard' ? 'active' : ''}" data-tab="leaderboard">👑 Global Leaderboard</button>
        </div>
        <div id="questTabContent"></div>
      `;

      // Tab click events
      body.querySelectorAll('.quest-tab-btn').forEach(btn => {
        btn.onclick = () => {
          this.audio.playClick();
          this.activeQuestsTab = btn.getAttribute('data-tab');
          this.openQuestsModal();
        };
      });

      const content = document.getElementById('questTabContent');
      if (this.activeQuestsTab === 'missions') {
        this.renderDailyMissions(content);
      } else if (this.activeQuestsTab === 'achievements') {
        this.renderAchievements(content);
      } else {
        await this.renderLeaderboard(content);
      }

      modal.classList.add('active');
    },

    renderDailyMissions(container) {
      const missionDefs = CityConfig.DAILY_MISSIONS || [];
      const mState = this.game.city.dailyMissions || { progress: {}, claimed: [] };

      container.innerHTML = `
        <div style="font-size: 0.8rem; color: var(--city-cyan); margin-bottom: 10px;">
          ⏱ Resets daily at 00:00 UTC. Complete tasks for gems and empire rewards!
        </div>
        <div class="quests-list">
          ${missionDefs.map(m => {
            const prog = (mState.progress && mState.progress[m.id]) || 0;
            const isClaimed = (mState.claimed || []).includes(m.id);
            const isCompleted = prog >= m.target;

            return `
              <div class="quest-card ${isClaimed ? 'completed' : ''}">
                <div>
                  <h4 style="color: #ffffff; font-size: 0.95rem; margin-bottom: 2px;">${m.title}</h4>
                  <p style="color: #94a3b8; font-size: 0.82rem;">${m.desc} (${prog}/${m.target})</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="quest-reward">+${m.rewardGems} 💎</span>
                  ${isClaimed ? `
                    <span class="quest-badge">✓ Claimed</span>
                  ` : `
                    <button class="btn btn-primary btn-claim-mission" data-id="${m.id}" ${!isCompleted ? 'disabled' : ''} style="padding: 6px 12px; font-size: 0.78rem;">
                      ${isCompleted ? 'Claim' : 'In Progress'}
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      container.querySelectorAll('.btn-claim-mission:not([disabled])').forEach(btn => {
        btn.onclick = async () => {
          const mId = btn.getAttribute('data-id');
          const res = await this.game.api.claimMission(this.currentUser.id, mId);
          if (res && res.success) {
            this.game.city = res.city;
            this.audio.playGem();
            this.showToast('Daily mission reward claimed!', 'success');
            this.openQuestsModal();
          } else {
            this.audio.playError();
            this.showToast(res.error || 'Claim failed', 'error');
          }
        };
      });
    },

    renderAchievements(container) {
      const achievements = CityConfig.ACHIEVEMENTS || [];
      const claimedList = this.game.city.claimedAchievements || [];
      const buildings = this.game.city.buildings || [];
      const ch = buildings.find(b => b.type === 'city_hall');
      const chLevel = ch ? ch.level : 1;

      // Count defense buildings
      const defenseCount = buildings.filter(b => ['watch_tower', 'defense_cannon', 'energy_tower', 'defensive_wall'].includes(b.type)).length;
      // Count total army
      const totalTroops = Object.values(this.game.city.army || {}).reduce((acc, c) => acc + c, 0);
      // Count stars
      let totalStars = 0;
      Object.values(this.game.city.campaignProgress || {}).forEach(p => {
        totalStars += typeof p === 'number' ? p : (p.stars || 0);
      });

      container.innerHTML = `
        <div class="quests-list">
          ${achievements.map(a => {
            const isClaimed = claimedList.includes(a.id);
            let met = false;
            if (a.reqCityHall && chLevel >= a.reqCityHall) met = true;
            if (a.reqBuildingCount && buildings.length >= a.reqBuildingCount) met = true;
            if (a.reqDefenses && defenseCount >= a.reqDefenses) met = true;
            if (a.reqTroops && totalTroops >= a.reqTroops) met = true;
            if (a.reqStars && totalStars >= a.reqStars) met = true;

            return `
              <div class="quest-card ${isClaimed ? 'completed' : ''}">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 1.8rem;">🏆</span>
                  <div>
                    <h4 style="color: #ffffff; font-size: 0.95rem; margin-bottom: 2px;">${a.title}</h4>
                    <p style="color: #94a3b8; font-size: 0.82rem;">${a.desc}</p>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="quest-reward">+${a.rewardGems} 💎</span>
                  ${isClaimed ? `
                    <span class="quest-badge">✓ Claimed</span>
                  ` : `
                    <button class="btn btn-primary btn-claim-achieve" data-id="${a.id}" ${!met ? 'disabled' : ''} style="padding: 6px 12px; font-size: 0.78rem;">
                      ${met ? 'Claim' : 'Locked'}
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      container.querySelectorAll('.btn-claim-achieve:not([disabled])').forEach(btn => {
        btn.onclick = async () => {
          const aId = btn.getAttribute('data-id');
          const res = await this.game.api.claimAchievement(this.currentUser.id, aId);
          if (res && res.success) {
            this.game.city = res.city;
            this.audio.playGem();
            this.audio.playVictory();
            this.showToast('Empire Achievement unlocked!', 'success');
            this.openQuestsModal();
          } else {
            this.audio.playError();
            this.showToast(res.error || 'Claim failed', 'error');
          }
        };
      });
    },

    async renderLeaderboard(container) {
      container.innerHTML = '<div style="text-align: center; padding: 20px; color: #94a3b8;">Loading realm rankings...</div>';
      const rankings = await this.game.api.getRankings();

      container.innerHTML = `
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Mayor & Domain</th>
              <th>Level</th>
              <th>City Power</th>
            </tr>
          </thead>
          <tbody>
            ${rankings.map(r => {
              const isMe = r.userId === this.currentUser.id;
              let rankBadge = `#${r.rank}`;
              if (r.rank === 1) rankBadge = '🥇 #1';
              else if (r.rank === 2) rankBadge = '🥈 #2';
              else if (r.rank === 3) rankBadge = '🥉 #3';

              return `
                <tr class="${isMe ? 'highlight' : ''}">
                  <td style="color: ${r.rank <= 3 ? '#fbbf24' : '#94a3b8'}; font-weight: 800;">${rankBadge}</td>
                  <td style="color: #ffffff; font-weight: 700;">
                    ${r.name} ${isMe ? '<span style="color: #00f0ff; font-size: 0.72rem;">(You)</span>' : ''}
                    <div style="font-size: 0.72rem; color: #94a3b8;">${r.cityName || 'Metropolis'}</div>
                  </td>
                  <td style="color: #00f0ff; font-weight: 700;">Lv. ${r.level || 1}</td>
                  <td style="color: #fbbf24; font-weight: 800;">⚔️ ${(r.cityPower || 450).toLocaleString()}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    },

    // =========================================================================
    // 9. TOAST NOTIFICATIONS
    // =========================================================================
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
      }, 3000);
    }
  };

  window.CityApp = CityApp;

  // Auto-boot on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    CityApp.init();
  });

})();
