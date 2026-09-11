/**
 * InfinityPlay - City Builder Client Game Engine (V2)
 * Coordinates user interaction, bounded camera, placement mode with on-screen confirm/cancel,
 * tactile resource collection, troop recruitment queues, defense systems,
 * and real-time tactical AI battle simulation.
 */

(function(exports) {
  'use strict';

  class CityGame {
    constructor(config, audio, renderer, apiClient) {
      this.config = config;
      this.audio = audio;
      this.renderer = renderer;
      this.api = apiClient;

      this.city = null;
      this.selectedBuilding = null;
      this.moveModeBuildingId = null;

      // Local ticker interval
      this.tickerInterval = null;
      this.isOnline = true;

      // Active battle simulation state
      this.battle = null;
      this.battleInterval = null;
    }

    async init(user) {
      this.user = user || { id: 'user_tharun', name: 'Tharun' };

      // Load initial city state from server (with localStorage fallback)
      const res = await this.api.getState(this.user.id, this.user.name);
      if (res && res.city) {
        this.city = res.city;
        if (res.offlineReport) {
          this.showOfflineModal(res.offlineReport);
        }
      } else {
        this.city = this.config.createStarterCity(this.user.id, this.user.name);
      }

      // Center camera on City Command Center
      const ch = (this.city.buildings || []).find(b => b.type === 'city_hall');
      if (ch) {
        this.renderer.centerOn(ch.x, ch.y);
      } else {
        this.renderer.centerOn(12, 12);
      }

      // Start client production tick
      this.startTicker();

      // Bind all canvas and keyboard events
      this.bindInputEvents();

      // Update initial HUD
      this.updateHUD();
    }

    // =========================================================================
    // 1. PRODUCTION & TIMER TICKER
    // =========================================================================
    startTicker() {
      if (this.tickerInterval) clearInterval(this.tickerInterval);

      this.tickerInterval = setInterval(() => {
        if (!this.city) return;

        // 1. Accrue 1 second worth of production
        const rates = this.city.productionRates || { gold: 16, wood: 20, stone: 18, food: 24 };
        const caps = this.city.storageCaps || { gold: 6000, wood: 5000, stone: 5000, food: 5000 };

        this.city.resources.gold = Math.min(caps.gold, (this.city.resources.gold || 0) + rates.gold / 60);
        this.city.resources.wood = Math.min(caps.wood, (this.city.resources.wood || 0) + rates.wood / 60);
        this.city.resources.stone = Math.min(caps.stone, (this.city.resources.stone || 0) + rates.stone / 60);
        this.city.resources.food = Math.min(caps.food, (this.city.resources.food || 0) + rates.food / 60);

        // 2. Check upgrade timers
        const now = Date.now();
        let timerCompleted = false;
        (this.city.buildings || []).forEach(b => {
          if (b.status && b.status !== 'idle' && b.finishTime && now >= b.finishTime) {
            timerCompleted = true;
          }
        });

        // 3. Check troop training queue
        if (this.city.trainingQueue && this.city.trainingQueue.length > 0) {
          if (this.city.trainingQueue.some(q => now >= q.finishTime)) {
            timerCompleted = true;
          }
        }

        if (timerCompleted) {
          this.syncWithServer();
          this.audio.playUpgrade();
        }

        // 4. Update HUD and active Inspector
        this.updateHUD();
        if (this.selectedBuilding) {
          this.updateInspector(this.selectedBuilding);
        }
      }, 1000);
    }

    async syncWithServer() {
      const res = await this.api.collect(this.user.id);
      if (res && res.city) {
        this.city = res.city;
        this.updateHUD();
        if (this.selectedBuilding) {
          this.selectedBuilding = this.city.buildings.find(b => b.id === this.selectedBuilding.id);
          this.updateInspector(this.selectedBuilding);
        }
      }
    }

    // =========================================================================
    // 2. USER INTERACTION & CAMERA CONTROLS
    // =========================================================================
    bindInputEvents() {
      const canvas = this.renderer.canvas;

      // Mouse Move
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (this.renderer.camera.isDragging) {
          const dx = mx - this.renderer.camera.lastMouseX;
          const dy = my - this.renderer.camera.lastMouseY;
          this.renderer.camera.x += dx;
          this.renderer.camera.y += dy;
          this.renderer.camera.vx = dx;
          this.renderer.camera.vy = dy;
          this.renderer.camera.lastMouseX = mx;
          this.renderer.camera.lastMouseY = my;
          return;
        }

        const grid = this.renderer.screenToGrid(mx, my);
        this.renderer.hoverTile = grid;

        // Update placement preview
        if (this.renderer.placementMode) {
          this.updatePlacementCoords(grid.x, grid.y);
        }
      });

      // Mouse Down
      canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        this.renderer.camera.isDragging = true;
        this.renderer.camera.dragStartX = e.clientX - rect.left;
        this.renderer.camera.dragStartY = e.clientY - rect.top;
        this.renderer.camera.lastMouseX = e.clientX - rect.left;
        this.renderer.camera.lastMouseY = e.clientY - rect.top;
        this.renderer.camera.vx = 0;
        this.renderer.camera.vy = 0;
      });

      // Mouse Up / Click Threshold
      window.addEventListener('mouseup', (e) => {
        if (!this.renderer.camera.isDragging) return;
        this.renderer.camera.isDragging = false;

        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const dist = Math.hypot(mx - this.renderer.camera.dragStartX, my - this.renderer.camera.dragStartY);

        // Treat as click if moved fewer than 6 pixels
        if (dist < 6 && mx >= 0 && mx <= rect.width && my >= 0 && my <= rect.height) {
          this.handleCanvasClick(mx, my);
        }
      });

      // Zoom via Mouse Wheel centered on cursor
      canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomDelta = e.deltaY < 0 ? 1.12 : 0.89;
        const newZoom = Math.min(this.renderer.camera.maxZoom, Math.max(this.renderer.camera.minZoom, this.renderer.camera.zoom * zoomDelta));

        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        this.renderer.camera.x = mx - (mx - this.renderer.camera.x) * (newZoom / this.renderer.camera.zoom);
        this.renderer.camera.y = my - (my - this.renderer.camera.y) * (newZoom / this.renderer.camera.zoom);
        this.renderer.camera.zoom = newZoom;
      }, { passive: false });

      // Touch Gestures for Mobile & Tablets
      let touchStartDist = 0;
      canvas.addEventListener('touchstart', (e) => {
        const rect = canvas.getBoundingClientRect();
        if (e.touches.length === 1) {
          const t = e.touches[0];
          this.renderer.camera.isDragging = true;
          this.renderer.camera.dragStartX = t.clientX - rect.left;
          this.renderer.camera.dragStartY = t.clientY - rect.top;
          this.renderer.camera.lastMouseX = t.clientX - rect.left;
          this.renderer.camera.lastMouseY = t.clientY - rect.top;
        } else if (e.touches.length === 2) {
          this.renderer.camera.isDragging = false;
          touchStartDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
        }
      });

      canvas.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        if (e.touches.length === 1 && this.renderer.camera.isDragging) {
          const t = e.touches[0];
          const mx = t.clientX - rect.left;
          const my = t.clientY - rect.top;
          const dx = mx - this.renderer.camera.lastMouseX;
          const dy = my - this.renderer.camera.lastMouseY;
          this.renderer.camera.x += dx;
          this.renderer.camera.y += dy;
          this.renderer.camera.lastMouseX = mx;
          this.renderer.camera.lastMouseY = my;

          const grid = this.renderer.screenToGrid(mx, my);
          this.renderer.hoverTile = grid;
          if (this.renderer.placementMode) {
            this.updatePlacementCoords(grid.x, grid.y);
          }
        } else if (e.touches.length === 2) {
          const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          if (touchStartDist > 0) {
            const factor = dist / touchStartDist;
            this.renderer.camera.zoom = Math.min(this.renderer.camera.maxZoom, Math.max(this.renderer.camera.minZoom, this.renderer.camera.zoom * factor));
            touchStartDist = dist;
          }
        }
      }, { passive: true });

      canvas.addEventListener('touchend', (e) => {
        if (e.touches.length === 0) {
          this.renderer.camera.isDragging = false;
        }
      });

      // Escape key cancel
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.renderer.placementMode) {
            this.cancelPlacement();
          } else {
            this.closeAllDrawers();
          }
        }
      });
    }

    // =========================================================================
    // 3. CANVAS CLICK & RESOURCE HARVEST
    // =========================================================================
    handleCanvasClick(screenX, screenY) {
      // If in Battle Mode: clicking perimeter deploys selected unit
      if (this.battle && this.battle.active) {
        this.handleBattleClick(screenX, screenY);
        return;
      }

      const grid = this.renderer.screenToGrid(screenX, screenY);

      // If in placement mode: attempt to place building
      if (this.renderer.placementMode) {
        if (this.renderer.placementMode.isValid) {
          this.executePlacement(this.renderer.placementMode.type, this.renderer.placementMode.x, this.renderer.placementMode.y);
        } else {
          this.audio.playError();
          window.CityApp.showToast('Invalid placement location (blocked or out of bounds).', 'error');
        }
        return;
      }

      // If in move mode: relocate selected building
      if (this.moveModeBuildingId) {
        this.executeMove(this.moveModeBuildingId, grid.x, grid.y);
        return;
      }

      // Check if clicked an existing building or its floating resource bubble
      const clicked = (this.city.buildings || []).find(b => {
        const spec = this.config.BUILDINGS[b.type] || { size: { w: 1, h: 1 } };
        const w = spec.size ? spec.size.w : 1;
        const h = spec.size ? spec.size.h : 1;
        return grid.x >= b.x && grid.x < b.x + w && grid.y >= b.y && grid.y < b.y + h;
      });

      if (clicked) {
        // If resource building is clicked, harvest tactile floating resources
        if (['gold_mine', 'lumber_yard', 'stone_quarry', 'farm'].includes(clicked.type) && (!clicked.status || clicked.status === 'idle')) {
          this.harvestBuildingResources(clicked);
        }

        this.audio.playClick();
        this.selectBuilding(clicked);
      } else {
        this.deselectBuilding();
      }
    }

    harvestBuildingResources(bld) {
      const resTypeMap = {
        gold_mine: 'gold',
        lumber_yard: 'wood',
        stone_quarry: 'stone',
        farm: 'food'
      };
      const resType = resTypeMap[bld.type] || 'gold';
      const spec = this.config.BUILDINGS[bld.type];
      const lvlSpec = spec.levels[Math.min((bld.level || 1) - 1, spec.levels.length - 1)];
      const gain = Math.floor((lvlSpec.rate || 16) * 1.5);

      this.audio.playResourceCollect();
      this.renderer.addFlyingResource(bld.x, bld.y, resType);
      this.renderer.addFloater(`+${gain} ${this.config.RESOURCES[resType].name}`, bld.x, bld.y, this.config.RESOURCES[resType].color);

      // Accrue to city resources
      const cap = (this.city.storageCaps && this.city.storageCaps[resType]) || 5000;
      this.city.resources[resType] = Math.min(cap, (this.city.resources[resType] || 0) + gain);
      this.updateHUD();

      // Trigger background sync
      this.api.collect(this.user.id);
    }

    selectBuilding(bld) {
      this.selectedBuilding = bld;
      this.renderer.selectedBuildingId = bld.id;
      this.openInspector(bld);
    }

    deselectBuilding() {
      this.selectedBuilding = null;
      this.renderer.selectedBuildingId = null;
      this.closeInspector();
    }

    // =========================================================================
    // 4. PROFESSIONAL PLACEMENT SYSTEM
    // =========================================================================
    startPlacement(type) {
      this.closeAllDrawers();
      const spec = this.config.BUILDINGS[type];
      if (!spec) return;

      const defaultX = this.renderer.hoverTile ? Math.max(0, Math.min(this.config.GRID_SIZE - spec.size.w, this.renderer.hoverTile.x)) : 12;
      const defaultY = this.renderer.hoverTile ? Math.max(0, Math.min(this.config.GRID_SIZE - spec.size.h, this.renderer.hoverTile.y)) : 12;

      this.renderer.placementMode = {
        type,
        x: defaultX,
        y: defaultY,
        isValid: this.checkPlacementValidity(type, defaultX, defaultY)
      };

      const banner = document.getElementById('placementBanner');
      if (banner) {
        banner.classList.add('active');
        document.getElementById('placementBuildingName').textContent = spec.name;
      }
    }

    updatePlacementCoords(gx, gy) {
      if (!this.renderer.placementMode) return;
      this.renderer.placementMode.x = gx;
      this.renderer.placementMode.y = gy;
      this.renderer.placementMode.isValid = this.checkPlacementValidity(this.renderer.placementMode.type, gx, gy);
    }

    cancelPlacement() {
      this.renderer.placementMode = null;
      this.moveModeBuildingId = null;
      const banner = document.getElementById('placementBanner');
      if (banner) banner.classList.remove('active');
    }

    confirmPlacementCurrent() {
      if (this.renderer.placementMode && this.renderer.placementMode.isValid) {
        this.executePlacement(this.renderer.placementMode.type, this.renderer.placementMode.x, this.renderer.placementMode.y);
      }
    }

    checkPlacementValidity(type, x, y) {
      const spec = this.config.BUILDINGS[type];
      if (!spec) return false;

      const w = spec.size ? spec.size.w : 1;
      const h = spec.size ? spec.size.h : 1;

      // 1. Grid boundary limits
      if (x < 0 || y < 0 || x + w > this.config.GRID_SIZE || y + h > this.config.GRID_SIZE) {
        return false;
      }

      // 2. Prevent placing inside water canal
      const isWater = (x >= 22 && y >= 3 && y <= 23) || (x >= 20 && y >= 10 && y <= 16);
      if (isWater) return false;

      // 3. Collision overlap with existing buildings
      const overlap = (this.city.buildings || []).some(b => {
        if (this.moveModeBuildingId && b.id === this.moveModeBuildingId) return false;
        const bSpec = this.config.BUILDINGS[b.type] || { size: { w: 1, h: 1 } };
        const bw = bSpec.size ? bSpec.size.w : 1;
        const bh = bSpec.size ? bSpec.size.h : 1;
        return !(x + w <= b.x || x >= b.x + bw || y + h <= b.y || y >= b.y + bh);
      });

      if (overlap) return false;

      // 4. Unique building check
      if (!this.moveModeBuildingId && spec.unique && (this.city.buildings || []).some(b => b.type === type)) {
        return false;
      }

      return true;
    }

    async executePlacement(type, x, y) {
      const res = await this.api.placeBuilding(this.user.id, type, x, y);
      if (res && res.success) {
        this.city = res.city;
        this.cancelPlacement();
        if (type === 'defensive_wall') {
          this.audio.playWall();
        } else {
          this.audio.playPlace();
        }
        this.renderer.addFloater('+1 Structure', x, y, '#22c55e');
        window.CityApp.showToast(`Constructing ${this.config.BUILDINGS[type].name}!`, 'success');
        this.updateHUD();
      } else {
        this.audio.playError();
        window.CityApp.showToast(res.error || 'Failed to construct building', 'error');
      }
    }

    startMove(buildingId) {
      this.closeInspector();
      const bld = (this.city.buildings || []).find(b => b.id === buildingId);
      if (!bld) return;

      this.moveModeBuildingId = buildingId;
      this.renderer.placementMode = {
        type: bld.type,
        x: bld.x,
        y: bld.y,
        isValid: true
      };

      const banner = document.getElementById('placementBanner');
      if (banner) {
        banner.classList.add('active');
        document.getElementById('placementBuildingName').textContent = `Relocate ${this.config.BUILDINGS[bld.type].name}`;
      }
    }

    async executeMove(buildingId, newX, newY) {
      const res = await this.api.moveBuilding(this.user.id, buildingId, newX, newY);
      if (res && res.success) {
        this.city = res.city;
        this.cancelPlacement();
        this.audio.playPlace();
        this.renderer.addFloater('Relocated', newX, newY, '#38bdf8');
        window.CityApp.showToast('Building relocated successfully!', 'info');
      } else {
        this.audio.playError();
        window.CityApp.showToast(res.error || 'Cannot relocate to that location', 'error');
      }
    }

    async upgradeBuilding(buildingId) {
      const res = await this.api.upgradeBuilding(this.user.id, buildingId);
      if (res && res.success) {
        this.city = res.city;
        this.selectedBuilding = this.city.buildings.find(b => b.id === buildingId);
        this.audio.playHammer();
        this.renderer.addFloater('Upgrading...', this.selectedBuilding.x, this.selectedBuilding.y, '#f59e0b');
        this.updateHUD();
        this.updateInspector(this.selectedBuilding);
        window.CityApp.showToast('Upgrade initiated!', 'info');
      } else {
        this.audio.playError();
        window.CityApp.showToast(res.error || 'Upgrade failed', 'error');
      }
    }

    async speedupBuilding(buildingId) {
      const res = await this.api.speedup(this.user.id, buildingId);
      if (res && res.success) {
        this.city = res.city;
        this.selectedBuilding = this.city.buildings.find(b => b.id === buildingId);
        this.audio.playGem();
        this.audio.playUpgrade();
        this.renderer.addFloater('Instant Complete! ✨', this.selectedBuilding.x, this.selectedBuilding.y, '#00f0ff');
        this.updateHUD();
        this.updateInspector(this.selectedBuilding);
        window.CityApp.showToast('Instant speedup complete!', 'success');
      } else {
        this.audio.playError();
        window.CityApp.showToast(res.error || 'Speedup failed', 'error');
      }
    }

    // =========================================================================
    // 5. TOP HUD & PROGRESSION SYNCHRONIZATION
    // =========================================================================
    updateHUD() {
      if (!this.city) return;

      const res = this.city.resources || {};
      const caps = this.city.storageCaps || {};
      const rates = this.city.productionRates || {};

      this.setResourceMeter('gold', res.gold, caps.gold, rates.gold);
      this.setResourceMeter('wood', res.wood, caps.wood, rates.wood);
      this.setResourceMeter('stone', res.stone, caps.stone, rates.stone);
      this.setResourceMeter('food', res.food, caps.food, rates.food);

      // Gems
      const gemEl = document.getElementById('resGemsVal');
      if (gemEl) gemEl.textContent = Math.floor(res.gems || 0).toLocaleString();

      // City Name, Level & Power
      const nameEl = document.getElementById('hudCityName');
      if (nameEl) nameEl.textContent = this.city.cityName || 'Mayor Domain';

      const popEl = document.getElementById('hudPopulation');
      if (popEl) popEl.textContent = `Pop: ${(this.city.population || 45).toLocaleString()}`;

      const powerEl = document.getElementById('hudCityPower');
      if (powerEl) powerEl.textContent = (this.city.cityPower || 450).toLocaleString();

      const lvlEl = document.getElementById('hudPlayerLevel');
      if (lvlEl) lvlEl.textContent = `Lv. ${this.city.level || 1}`;

      const xpBar = document.getElementById('hudXpFill');
      if (xpBar) {
        const curXp = this.city.xp || 0;
        const nxtXp = this.city.xpNext || 500;
        const pct = Math.min(100, Math.max(0, (curXp / nxtXp) * 100));
        xpBar.style.width = `${pct}%`;
      }
    }

    setResourceMeter(resId, current, max, rate) {
      current = Math.floor(current || 0);
      max = Math.floor(max || 5000);
      const percent = Math.min(100, Math.max(0, (current / max) * 100));

      const valEl = document.getElementById(`res_${resId}_val`);
      if (valEl) valEl.textContent = current.toLocaleString();

      const barEl = document.getElementById(`res_${resId}_bar`);
      if (barEl) barEl.style.width = `${percent}%`;

      const rateEl = document.getElementById(`res_${resId}_rate`);
      if (rateEl && rate !== undefined) {
        rateEl.textContent = `+${rate}/m`;
      }
    }

    // =========================================================================
    // 6. BUILDING INSPECTOR DRAWER
    // =========================================================================
    openInspector(bld) {
      const drawer = document.getElementById('buildingInspectorDrawer');
      if (!drawer) return;

      this.updateInspector(bld);
      drawer.classList.add('active');
    }

    updateInspector(bld) {
      if (!bld) return;
      const spec = this.config.BUILDINGS[bld.type];
      if (!spec) return;

      document.getElementById('inspIcon').textContent = spec.icon;
      document.getElementById('inspName').textContent = spec.name;
      document.getElementById('inspCategory').textContent = spec.category;
      document.getElementById('inspLevel').textContent = `Level ${bld.level || 1}`;
      document.getElementById('inspDesc').textContent = spec.description;

      const currentSpec = spec.levels[Math.min((bld.level || 1) - 1, spec.levels.length - 1)];
      const nextSpec = spec.levels[bld.level] || null;

      // Stats Pills
      const statsContainer = document.getElementById('inspStats');
      let statsHtml = '';
      if (currentSpec.rate) statsHtml += `<div class="stat-pill">⚡ Production: <strong>+${currentSpec.rate}/min</strong></div>`;
      if (currentSpec.goldCap) statsHtml += `<div class="stat-pill">🏦 Gold Storage: <strong>+${currentSpec.goldCap.toLocaleString()}</strong></div>`;
      if (currentSpec.resourceCap) statsHtml += `<div class="stat-pill">📦 Depot Storage: <strong>+${currentSpec.resourceCap.toLocaleString()}</strong></div>`;
      if (currentSpec.armyCap) statsHtml += `<div class="stat-pill">⚔️ Barracks Housing: <strong>+${currentSpec.armyCap} Units</strong></div>`;
      if (currentSpec.dps) statsHtml += `<div class="stat-pill">🏹 Turret DPS: <strong>${currentSpec.dps} dmg/s</strong></div>`;
      if (currentSpec.range) statsHtml += `<div class="stat-pill">🎯 Range: <strong>${currentSpec.range} tiles</strong></div>`;
      if (currentSpec.hp) statsHtml += `<div class="stat-pill">🛡️ Durability: <strong>${currentSpec.hp} HP</strong></div>`;
      if (currentSpec.tradeFee) statsHtml += `<div class="stat-pill">⚖️ Tariff: <strong>${Math.round(currentSpec.tradeFee * 100)}%</strong></div>`;
      statsContainer.innerHTML = statsHtml;

      // Upgrade Action Area
      const upgradeArea = document.getElementById('inspUpgradeArea');
      const isMaxLevel = bld.level >= spec.maxLevel;
      const isBusy = bld.status && bld.status !== 'idle';

      if (isBusy) {
        const remainingSec = Math.max(0, Math.ceil(((bld.finishTime || Date.now()) - Date.now()) / 1000));
        const gemCost = Math.max(1, Math.ceil(remainingSec / 60));
        upgradeArea.innerHTML = `
          <div class="timer-card">
            <div class="timer-title">⏳ ${bld.status === 'constructing' ? 'Under Construction' : 'Upgrading'}</div>
            <div class="timer-time">${this.formatDuration(remainingSec)} remaining</div>
            <button class="btn btn-gem-speedup" id="btnInspSpeedup">
              ⚡ Finish Instantly for ${gemCost} 💎
            </button>
          </div>
        `;
        document.getElementById('btnInspSpeedup').onclick = () => this.speedupBuilding(bld.id);
      } else if (isMaxLevel) {
        upgradeArea.innerHTML = `
          <div class="max-level-card">
            ⭐ Maximum Architectural Wonder Reached
          </div>
        `;
      } else if (nextSpec) {
        const ch = (this.city.buildings || []).find(b => b.type === 'city_hall');
        const chLevel = ch ? ch.level : 1;
        const reqMet = !nextSpec.reqCityHall || chLevel >= nextSpec.reqCityHall;

        const hasGold = (this.city.resources.gold || 0) >= (nextSpec.cost.gold || 0);
        const hasWood = (this.city.resources.wood || 0) >= (nextSpec.cost.wood || 0);
        const hasStone = (this.city.resources.stone || 0) >= (nextSpec.cost.stone || 0);
        const hasFood = (this.city.resources.food || 0) >= (nextSpec.cost.food || 0);
        const canAfford = hasGold && hasWood && hasStone && hasFood;

        upgradeArea.innerHTML = `
          <div class="upgrade-card">
            <div class="upgrade-header">
              <span>Upgrade to Level ${bld.level + 1}</span>
              <span style="font-size: 0.8rem; color: var(--city-cyan);">⏱ ${this.formatDuration(nextSpec.time)}</span>
            </div>
            ${!reqMet ? `<div class="req-warning">⚠️ Requires City Command Center Level ${nextSpec.reqCityHall}</div>` : ''}
            <div class="cost-pills">
              ${nextSpec.cost.gold ? `<span class="cost-pill ${hasGold ? '' : 'insufficient'}">🪙 ${nextSpec.cost.gold}</span>` : ''}
              ${nextSpec.cost.wood ? `<span class="cost-pill ${hasWood ? '' : 'insufficient'}">🪵 ${nextSpec.cost.wood}</span>` : ''}
              ${nextSpec.cost.stone ? `<span class="cost-pill ${hasStone ? '' : 'insufficient'}">🪨 ${nextSpec.cost.stone}</span>` : ''}
              ${nextSpec.cost.food ? `<span class="cost-pill ${hasFood ? '' : 'insufficient'}">🌾 ${nextSpec.cost.food}</span>` : ''}
            </div>
            <button class="btn btn-primary btn-upgrade-submit" id="btnInspUpgrade" ${(!reqMet || !canAfford) ? 'disabled' : ''}>
              ▲ Upgrade Structure
            </button>
          </div>
        `;
        const btn = document.getElementById('btnInspUpgrade');
        if (btn && reqMet && canAfford) {
          btn.onclick = () => this.upgradeBuilding(bld.id);
        }
      }

      // Relocate Button
      const moveBtn = document.getElementById('btnInspMove');
      if (moveBtn) {
        moveBtn.onclick = () => this.startMove(bld.id);
      }
    }

    closeInspector() {
      const drawer = document.getElementById('buildingInspectorDrawer');
      if (drawer) drawer.classList.remove('active');
    }

    closeAllDrawers() {
      this.closeInspector();
      document.querySelectorAll('.city-modal-overlay').forEach(m => m.classList.remove('active'));
    }

    showOfflineModal(report) {
      const modal = document.getElementById('offlineModal');
      const body = document.getElementById('offlineModalBody');
      if (!modal || !body) return;

      const mins = Math.floor(report.elapsedSeconds / 60);
      const hours = Math.floor(mins / 60);
      const timeStr = hours > 0 ? `${hours}h ${mins % 60}m` : `${mins} minutes`;

      body.innerHTML = `
        <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.5;">
          While you were away for <strong>${timeStr}</strong>, your domain flourished!
        </p>

        <div class="offline-gain-grid">
          <div class="offline-gain-item"><span>🪙 Gold</span><strong>+${(report.earned.gold || 0).toLocaleString()}</strong></div>
          <div class="offline-gain-item"><span>🪵 Wood</span><strong>+${(report.earned.wood || 0).toLocaleString()}</strong></div>
          <div class="offline-gain-item"><span>🪨 Stone</span><strong>+${(report.earned.stone || 0).toLocaleString()}</strong></div>
          <div class="offline-gain-item"><span>🌾 Food</span><strong>+${(report.earned.food || 0).toLocaleString()}</strong></div>
        </div>

        ${report.completedUpgrades && report.completedUpgrades.length > 0 ? `
          <div style="margin-top: 14px; padding: 10px; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 8px;">
            <strong style="color: #4ade80;">Completed Structures:</strong>
            <ul style="margin: 6px 0 0 16px; font-size: 0.85rem; color: #cbd5e1;">
              ${report.completedUpgrades.map(u => `<li>${u.name} (Level ${u.level})</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      `;

      modal.classList.add('active');
      this.audio.playCoin();
    }

    formatDuration(seconds) {
      seconds = Math.max(0, Math.floor(seconds || 0));
      if (seconds < 60) return `${seconds}s`;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      if (mins < 60) return `${mins}m ${secs > 0 ? secs + 's' : ''}`;
      const hours = Math.floor(mins / 60);
      return `${hours}h ${mins % 60}m`;
    }

    // =========================================================================
    // 7. REAL-TIME AI BATTLE SIMULATION ENGINE
    // =========================================================================
    launchBattle(targetNodeId) {
      this.closeAllDrawers();
      const node = this.config.CAMPAIGN_NODES.find(n => n.id === targetNodeId);
      if (!node) return;

      // Ensure player has troops
      const totalUnits = Object.values(this.city.army || {}).reduce((acc, c) => acc + c, 0);
      if (totalUnits === 0) {
        this.audio.playError();
        window.CityApp.showToast('You need to train troops in the Training Grounds before attacking!', 'error');
        return;
      }

      // Clone enemy city layout
      const enemyBuildings = node.enemyCity.buildings.map((b, idx) => ({
        id: `target_bld_${idx}`,
        type: b.type,
        level: b.level || 1,
        x: b.x,
        y: b.y,
        hp: b.hp,
        maxHp: b.hp,
        range: b.range || 0,
        dps: b.dps || 0,
        splash: b.splash || 0,
        lastAttackTime: 0
      }));

      this.battle = {
        active: true,
        node,
        enemyBuildings,
        units: [],
        projectiles: [],
        deployedCount: 0,
        selectedUnitType: Object.keys(this.city.army || {})[0] || 'guardian',
        timeLeft: 120, // 2 minutes battle timer
        destructionPercent: 0,
        totalBuildingHp: enemyBuildings.reduce((sum, b) => sum + b.maxHp, 0),
        casualties: {}
      };

      // Set renderer to battle mode
      this.renderer.battleMode = this.battle;
      this.renderer.centerOn(12, 12);

      // Open Battle HUD
      document.getElementById('battleHudOverlay').classList.add('active');
      document.getElementById('battleNodeName').textContent = node.name;
      this.updateBattleDeployBar();

      // Start 60 FPS battle tick
      if (this.battleInterval) clearInterval(this.battleInterval);
      this.battleInterval = setInterval(() => this.tickBattle(), 1000 / 30);
    }

    handleBattleClick(screenX, screenY) {
      if (!this.battle || !this.battle.active) return;
      const grid = this.renderer.screenToGrid(screenX, screenY);

      // Deployment rule: only allowed on outer perimeter (x <= 4, x >= 21, y <= 4, y >= 21)
      const isPerimeter = grid.x <= 5 || grid.x >= 20 || grid.y <= 5 || grid.y >= 20;
      if (!isPerimeter) {
        this.audio.playError();
        window.CityApp.showToast('Deploy units outside the enemy red perimeter zone!', 'info');
        return;
      }

      const uType = this.battle.selectedUnitType;
      const count = (this.city.army && this.city.army[uType]) || 0;
      if (count <= 0) {
        this.audio.playError();
        window.CityApp.showToast(`No more ${this.config.UNITS[uType].name}s available!`, 'error');
        return;
      }

      // Deduct from army
      this.city.army[uType]--;
      const spec = this.config.UNITS[uType];

      // Spawn unit
      this.battle.units.push({
        id: `unit_${Date.now()}_${Math.random()}`,
        type: uType,
        spec,
        x: grid.x,
        y: grid.y,
        hp: spec.hp,
        maxHp: spec.hp,
        speed: spec.moveSpeed,
        lastAttackTime: 0,
        targetBuildingId: null
      });

      this.audio.playClick();
      this.updateBattleDeployBar();
    }

    updateBattleDeployBar() {
      const container = document.getElementById('battleDeployUnitsContainer');
      if (!container || !this.battle) return;

      container.innerHTML = Object.entries(this.config.UNITS).map(([uId, uSpec]) => {
        const count = (this.city.army && this.city.army[uId]) || 0;
        const isSelected = this.battle.selectedUnitType === uId;
        return `
          <button class="battle-unit-card ${isSelected ? 'selected' : ''} ${count <= 0 ? 'depleted' : ''}" 
                  data-unit="${uId}">
            <span class="battle-unit-icon">${uSpec.icon}</span>
            <span class="battle-unit-count">x${count}</span>
            <span class="battle-unit-name">${uSpec.name}</span>
          </button>
        `;
      }).join('');

      container.querySelectorAll('.battle-unit-card').forEach(btn => {
        btn.onclick = () => {
          this.battle.selectedUnitType = btn.getAttribute('data-unit');
          this.updateBattleDeployBar();
        };
      });
    }

    tickBattle() {
      if (!this.battle || !this.battle.active) return;
      const b = this.battle;
      const now = Date.now();

      // 1. Advance Unit AI: Find target, walk, attack
      b.units.forEach(u => {
        if (u.hp <= 0) return;

        // Find nearest living building or preferred target
        let target = b.enemyBuildings.find(bld => bld.id === u.targetBuildingId && bld.hp > 0);
        if (!target) {
          // Select nearest building
          let bestDist = 9999;
          b.enemyBuildings.forEach(bld => {
            if (bld.hp <= 0) return;
            const dist = Math.hypot(bld.x - u.x, bld.y - u.y);
            const isDefense = ['watch_tower', 'defense_cannon', 'energy_tower'].includes(bld.type);
            const priority = (u.spec.targetPreference === 'defense' && isDefense) ? 0.4 : 1.0;
            const weightedDist = dist * priority;

            if (weightedDist < bestDist) {
              bestDist = weightedDist;
              target = bld;
            }
          });
          if (target) u.targetBuildingId = target.id;
        }

        if (!target) return; // All buildings destroyed!

        const dist = Math.hypot(target.x - u.x, target.y - u.y);

        // If in attack range, strike target
        if (dist <= u.spec.range) {
          if (now - u.lastAttackTime >= u.spec.attackSpeed * 1000) {
            u.lastAttackTime = now;
            let dmg = u.spec.damage;
            if (u.spec.id === 'siege_unit' && ['defensive_wall', 'watch_tower', 'defense_cannon'].includes(target.type)) {
              dmg *= 3.5;
            }

            target.hp -= dmg;
            this.renderer.addFloater(`-${Math.round(dmg)}`, target.x, target.y, '#ef4444');

            // Fire arrow / projectile
            if (u.spec.range > 2.0) {
              const startIso = this.renderer.gridToIso(u.x, u.y);
              const endIso = this.renderer.gridToIso(target.x, target.y);
              b.projectiles.push({
                type: 'arrow',
                x: startIso.x,
                y: startIso.y - 12,
                vx: (endIso.x - startIso.x) * 0.15,
                vy: (endIso.y - startIso.y) * 0.15,
                life: 7
              });
              this.audio.playArrow();
            }
          }
        } else {
          // Move towards target
          const dx = target.x - u.x;
          const dy = target.y - u.y;
          const len = Math.hypot(dx, dy) || 1;
          const step = (u.speed * 0.05);
          u.x += (dx / len) * step;
          u.y += (dy / len) * step;
        }
      });

      // 2. Defense Tower AI: Acquire approaching units and fire
      b.enemyBuildings.forEach(bld => {
        if (bld.hp <= 0 || !bld.dps || !bld.range) return;
        if (now - bld.lastAttackTime < (bld.attackSpeed || 1.0) * 1000) return;

        // Find nearest unit in range
        let targetUnit = null;
        let bestDist = bld.range;
        b.units.forEach(u => {
          if (u.hp <= 0) return;
          const dist = Math.hypot(u.x - bld.x, u.y - bld.y);
          if (dist <= bestDist) {
            bestDist = dist;
            targetUnit = u;
          }
        });

        if (targetUnit) {
          bld.lastAttackTime = now;
          const startIso = this.renderer.gridToIso(bld.x + 0.5, bld.y + 0.5);
          const endIso = this.renderer.gridToIso(targetUnit.x, targetUnit.y);

          // Tower weapon types
          if (bld.type === 'watch_tower') {
            b.projectiles.push({
              type: 'arrow',
              x: startIso.x,
              y: startIso.y - 30,
              vx: (endIso.x - startIso.x) * 0.18,
              vy: (endIso.y - startIso.y) * 0.18,
              life: 6
            });
            targetUnit.hp -= bld.dps;
            this.audio.playArrow();
          } else if (bld.type === 'defense_cannon') {
            b.projectiles.push({
              type: 'cannon',
              x: startIso.x,
              y: startIso.y - 20,
              vx: (endIso.x - startIso.x) * 0.12,
              vy: (endIso.y - startIso.y) * 0.12,
              life: 8
            });
            // Splash damage
            b.units.forEach(nearby => {
              if (nearby.hp > 0 && Math.hypot(nearby.x - targetUnit.x, nearby.y - targetUnit.y) <= (bld.splash || 1.5)) {
                nearby.hp -= bld.dps;
              }
            });
            this.audio.playCannon();
          } else if (bld.type === 'energy_tower') {
            b.projectiles.push({
              type: 'laser',
              startX: startIso.x,
              startY: startIso.y - 35,
              x: endIso.x,
              y: endIso.y - 10,
              life: 5
            });
            targetUnit.hp -= bld.dps;
            this.audio.playLaser();
          }

          if (targetUnit.hp <= 0) {
            b.casualties[targetUnit.type] = (b.casualties[targetUnit.type] || 0) + 1;
            this.renderer.addFloater('Casualty', targetUnit.x, targetUnit.y, '#ef4444');
          }
        }
      });

      // 3. Update Projectiles
      for (let i = b.projectiles.length - 1; i >= 0; i--) {
        const p = b.projectiles[i];
        if (p.vx) p.x += p.vx;
        if (p.vy) p.y += p.vy;
        p.life--;
        if (p.life <= 0) b.projectiles.splice(i, 1);
      }

      // 4. Calculate destruction percentage & stars
      let currentLivingHp = 0;
      b.enemyBuildings.forEach(bld => {
        if (bld.hp > 0) currentLivingHp += bld.hp;
      });
      const destroyedHp = Math.max(0, b.totalBuildingHp - currentLivingHp);
      b.destructionPercent = Math.min(100, Math.floor((destroyedHp / b.totalBuildingHp) * 100));

      const ch = b.enemyBuildings.find(bld => bld.type === 'city_hall');
      let stars = 0;
      if (b.destructionPercent >= 50) stars = 1;
      if (ch && ch.hp <= 0) stars = Math.max(stars, 2);
      if (b.destructionPercent >= 100) stars = 3;

      // Update battle HUD elements
      const pctEl = document.getElementById('battleDestructionPercent');
      if (pctEl) pctEl.textContent = `${b.destructionPercent}%`;

      const barEl = document.getElementById('battleDestructionFill');
      if (barEl) barEl.style.width = `${b.destructionPercent}%`;

      // Check win condition (100% destruction) or army eliminated
      const livingUnits = b.units.filter(u => u.hp > 0).length;
      const remainingTroopsToDeploy = Object.values(this.city.army || {}).reduce((acc, c) => acc + c, 0);

      if (b.destructionPercent >= 100 || (livingUnits === 0 && remainingTroopsToDeploy === 0 && b.units.length > 0)) {
        this.finishBattle(stars);
      }
    }

    async finishBattle(stars) {
      if (!this.battle) return;
      clearInterval(this.battleInterval);
      const b = this.battle;
      this.battle = null;
      this.renderer.battleMode = null;

      document.getElementById('battleHudOverlay').classList.remove('active');

      // Submit authoritative results to server
      const res = await this.api.battleResult(this.user.id, b.node.id, b.destructionPercent, stars, b.casualties);
      if (res && res.success) {
        this.city = res.city;
        this.updateHUD();
      }

      // Play victory fanfare / defeat sound
      if (stars > 0) {
        this.audio.playVictory();
      } else {
        this.audio.playDefeat();
      }

      this.showBattleResultModal(b, stars, (res && res.lootAwarded) || b.node.loot);
    }

    showBattleResultModal(battleInfo, stars, loot) {
      const modal = document.getElementById('battleResultModal');
      const body = document.getElementById('battleResultModalBody');
      if (!modal || !body) return;

      const isVictory = stars > 0;
      const starsHtml = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

      body.innerHTML = `
        <div class="battle-result-card ${isVictory ? 'victory' : 'defeat'}">
          <div class="battle-result-stars">${starsHtml}</div>
          <h2 class="battle-result-title">${isVictory ? 'VICTORY!' : 'DEFEAT'}</h2>
          <p class="battle-result-subtitle">${battleInfo.node.name} — ${battleInfo.destructionPercent}% Destruction</p>

          ${isVictory ? `
            <div class="battle-loot-box">
              <h4>Spoils of War Acquired:</h4>
              <div class="offline-gain-grid">
                <div class="offline-gain-item"><span>🪙 Gold</span><strong>+${(loot.gold || 0).toLocaleString()}</strong></div>
                <div class="offline-gain-item"><span>🪵 Wood</span><strong>+${(loot.wood || 0).toLocaleString()}</strong></div>
                <div class="offline-gain-item"><span>🪨 Stone</span><strong>+${(loot.stone || 0).toLocaleString()}</strong></div>
                <div class="offline-gain-item"><span>🌾 Food</span><strong>+${(loot.food || 0).toLocaleString()}</strong></div>
              </div>
              ${loot.gems ? `<div style="margin-top: 10px; color: #00f0ff; font-weight: bold;">+${loot.gems} 💎 Premium Gems!</div>` : ''}
            </div>
          ` : `
            <p style="color: #cbd5e1; font-size: 0.9rem; margin: 16px 0;">
              Your forces were repelled by the stronghold defenses. Train more infantry, siege engines, and advance research before launching another offensive!
            </p>
          `}

          <button class="btn btn-primary" style="width: 100%; padding: 12px; margin-top: 16px;" onclick="CityApp.game.closeAllDrawers()">
            Return to City
          </button>
        </div>
      `;

      modal.classList.add('active');
    }
  }

  exports.CityGame = CityGame;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.CityGame = {}));
