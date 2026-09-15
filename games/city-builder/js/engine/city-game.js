/**
 * InfinityPlay - City Builder Client Engine
 * Handles user interaction, placement mode, HUD synchronization, inspectors, and modals
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
    }

    async init(user) {
      this.user = user || { id: 'user_tharun', name: 'Tharun' };

      // Load initial state from server
      const res = await this.api.getState(this.user.id, this.user.name);
      if (res && res.city) {
        this.city = res.city;
        if (res.offlineReport) {
          this.showOfflineModal(res.offlineReport);
        }
      } else {
        // Fallback starter city
        this.city = this.config.createStarterCity(this.user.id, this.user.name);
      }

      // Center camera onto City Hall
      const ch = this.city.buildings.find(b => b.type === 'city_hall');
      if (ch) {
        this.renderer.centerOn(ch.x, ch.y);
      } else {
        this.renderer.centerOn(10, 10);
      }

      // Start client production tick
      this.startTicker();

      // Bind input events
      this.bindInputEvents();

      // Update initial HUD
      this.updateHUD();
    }

    startTicker() {
      if (this.tickerInterval) clearInterval(this.tickerInterval);

      this.tickerInterval = setInterval(() => {
        if (!this.city) return;

        // 1. Accrue 1 second worth of production
        const rates = this.city.productionRates || { gold: 12, wood: 16, stone: 14, food: 20 };
        const caps = this.city.storageCaps || { gold: 5000, wood: 4000, stone: 4000, food: 4000 };

        this.city.resources.gold = Math.min(caps.gold, (this.city.resources.gold || 0) + rates.gold / 60);
        this.city.resources.wood = Math.min(caps.wood, (this.city.resources.wood || 0) + rates.wood / 60);
        this.city.resources.stone = Math.min(caps.stone, (this.city.resources.stone || 0) + rates.stone / 60);
        this.city.resources.food = Math.min(caps.food, (this.city.resources.food || 0) + rates.food / 60);

        // 2. Check upgrade timers and training queue
        const now = Date.now();
        let timerCompleted = false;
        this.city.buildings.forEach(b => {
          if (b.status && b.status !== 'idle' && b.finishTime && now >= b.finishTime) {
            timerCompleted = true;
          }
        });

        if (this.city.trainingQueue && this.city.trainingQueue.length > 0) {
          this.city.trainingQueue.forEach(q => {
            if (now >= q.finishTime) {
              timerCompleted = true;
            }
          });
        }

        if (timerCompleted) {
          this.syncWithServer();
          this.audio.playUpgrade();
          if (window.CityApp && window.CityApp.showToast) {
            window.CityApp.showToast('Upgrade or Military Training completed!', 'success');
          }
          const armyModal = document.getElementById('armyModal');
          if (armyModal && armyModal.classList.contains('active') && window.CityApp && window.CityApp.renderArmyCamp) {
            window.CityApp.renderArmyCamp();
          }
        }

        // 3. Update HUD and active Inspector if open
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

    bindInputEvents() {
      const canvas = this.renderer.canvas;

      // Mouse Down (Canvas)
      canvas.addEventListener('mousedown', (e) => {
        if (e.button !== 0 && e.button !== 1) return; // Left or middle click
        const rect = canvas.getBoundingClientRect();
        this.renderer.camera.isDragging = true;
        this.renderer.camera.dragStartX = e.clientX - rect.left;
        this.renderer.camera.dragStartY = e.clientY - rect.top;
        this.renderer.camera.lastMouseX = e.clientX - rect.left;
        this.renderer.camera.lastMouseY = e.clientY - rect.top;
      });

      // Mouse Move on Window (ensures smooth dragging even over HUDs or bottom bar)
      window.addEventListener('mousemove', (e) => {
        if (!this.renderer.camera.isDragging) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const dx = mx - this.renderer.camera.lastMouseX;
        const dy = my - this.renderer.camera.lastMouseY;
        this.renderer.camera.x += dx;
        this.renderer.camera.y += dy;
        this.renderer.camera.lastMouseX = mx;
        this.renderer.camera.lastMouseY = my;
        this.renderer.clampCamera();
      });

      // Mouse Move on Canvas (Hover & Placement Preview only when NOT dragging)
      canvas.addEventListener('mousemove', (e) => {
        if (this.renderer.camera.isDragging) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const grid = this.renderer.screenToGrid(mx, my);
        this.renderer.hoverTile = grid;

        // Update placement preview
        if (this.renderer.placementMode) {
          this.updatePlacementCoords(grid.x, grid.y);
        }
      });

      // Mouse Up / Click
      window.addEventListener('mouseup', (e) => {
        if (!this.renderer.camera.isDragging) return;
        this.renderer.camera.isDragging = false;

        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const dist = Math.hypot(mx - this.renderer.camera.dragStartX, my - this.renderer.camera.dragStartY);

        // Click threshold: only trigger click action if mouse did not drag
        if (dist < 6 && mx >= 0 && mx <= rect.width && my >= 0 && my <= rect.height) {
          this.handleCanvasClick(mx, my);
        }
      });

      // Wheel Event: Smooth Trackpad Panning vs Zooming
      canvas.addEventListener('wheel', (e) => {
        e.preventDefault();

        // While dragging the map, ignore all wheel zoom events
        if (this.renderer.camera.isDragging) return;

        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        // Trackpad Two-Finger Pan:
        // Modern trackpads fire wheel events without ctrlKey and with pixel-based smooth deltas.
        // Swiping two fingers down/up should PAN the map, NOT zoom!
        const isTrackpadPan = !e.ctrlKey && (Math.abs(e.deltaX) > 0 || (e.deltaMode === 0 && Math.abs(e.deltaY) < 35));

        if (isTrackpadPan) {
          this.renderer.camera.x -= e.deltaX;
          this.renderer.camera.y -= e.deltaY;
          this.renderer.clampCamera();
          return;
        }

        // Deliberate Zoom Gestures (Pinch-to-zoom with Ctrl or discrete mouse scroll wheel)
        let zoomFactor;
        if (e.ctrlKey) {
          // Trackpad pinch-to-zoom
          zoomFactor = Math.pow(0.995, e.deltaY);
        } else {
          // Discrete mouse scroll wheel notches (gentle 8% steps instead of harsh jumps)
          zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
        }

        const oldZoom = this.renderer.camera.zoom;
        const newZoom = Math.min(2.0, Math.max(0.45, oldZoom * zoomFactor));
        if (Math.abs(newZoom - oldZoom) < 0.001) return;

        // Zoom centered on cursor position
        this.renderer.camera.x = mx - (mx - this.renderer.camera.x) * (newZoom / oldZoom);
        this.renderer.camera.y = my - (my - this.renderer.camera.y) * (newZoom / oldZoom);
        this.renderer.camera.zoom = newZoom;
        this.renderer.clampCamera();
      }, { passive: false });

      // Touch Gestures for Mobile, Tablet & Touchscreens
      let touchStartDist = 0;
      let touchStartZoom = 1.0;
      let touchMidX = 0;
      let touchMidY = 0;

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
          const t0 = e.touches[0];
          const t1 = e.touches[1];
          touchStartDist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
          touchStartZoom = this.renderer.camera.zoom;
          touchMidX = ((t0.clientX + t1.clientX) / 2) - rect.left;
          touchMidY = ((t0.clientY + t1.clientY) / 2) - rect.top;
        }
      }, { passive: false });

      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
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
          this.renderer.clampCamera();

          const grid = this.renderer.screenToGrid(mx, my);
          this.renderer.hoverTile = grid;
          if (this.renderer.placementMode) {
            this.updatePlacementCoords(grid.x, grid.y);
          }
        } else if (e.touches.length === 2 && touchStartDist > 0) {
          const t0 = e.touches[0];
          const t1 = e.touches[1];
          const dist = Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
          const ratio = dist / touchStartDist;
          const newZoom = Math.min(2.0, Math.max(0.45, touchStartZoom * ratio));
          const oldZoom = this.renderer.camera.zoom;

          if (Math.abs(newZoom - oldZoom) > 0.001) {
            this.renderer.camera.x = touchMidX - (touchMidX - this.renderer.camera.x) * (newZoom / oldZoom);
            this.renderer.camera.y = touchMidY - (touchMidY - this.renderer.camera.y) * (newZoom / oldZoom);
            this.renderer.camera.zoom = newZoom;
            this.renderer.clampCamera();
          }
        }
      }, { passive: false });

      canvas.addEventListener('touchend', (e) => {
        if (e.touches.length === 0) {
          this.renderer.camera.isDragging = false;
          touchStartDist = 0;
        } else if (e.touches.length === 1) {
          // One finger remains: transition smoothly to single-finger drag
          const rect = canvas.getBoundingClientRect();
          const t = e.touches[0];
          this.renderer.camera.isDragging = true;
          this.renderer.camera.lastMouseX = t.clientX - rect.left;
          this.renderer.camera.lastMouseY = t.clientY - rect.top;
          touchStartDist = 0;
        }
      });

      // Escape key exits placement or closes drawers
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

    handleCanvasClick(screenX, screenY) {
      // 1. Tactical Battle Unit Deployment
      if (this.renderer.battleMode && this.renderer.battleMode.active) {
        const grid = this.renderer.screenToGrid(screenX, screenY);
        this.handleBattleCanvasClick(grid.x, grid.y);
        return;
      }

      // 2. Clickable Floating Harvest Bubbles
      const bubble = this.renderer.getClickedBubble(screenX, screenY);
      if (bubble) {
        this.collectFromBubble(bubble);
        return;
      }

      const grid = this.renderer.screenToGrid(screenX, screenY);

      // If in placement mode: attempt to place building
      if (this.renderer.placementMode) {
        if (this.renderer.placementMode.isValid) {
          this.executePlacement(this.renderer.placementMode.type, this.renderer.placementMode.x, this.renderer.placementMode.y);
        } else {
          this.audio.playError();
          window.CityApp.showToast('Invalid placement location.', 'error');
        }
        return;
      }

      // If in move mode: attempt to move selected building
      if (this.moveModeBuildingId) {
        this.executeMove(this.moveModeBuildingId, grid.x, grid.y);
        return;
      }

      // Check if clicked on an existing building
      const clicked = this.city.buildings.find(b => {
        const spec = this.config.BUILDINGS[b.type] || { size: { w: 1, h: 1 } };
        const w = spec.size ? spec.size.w : 1;
        const h = spec.size ? spec.size.h : 1;
        return grid.x >= b.x && grid.x < b.x + w && grid.y >= b.y && grid.y < b.y + h;
      });

      if (clicked) {
        this.audio.playClick();
        this.selectBuilding(clicked);

        // Interactive harvest collection on clicking production structures
        if (['gold_mine', 'elixir_collector', 'lumber_yard', 'stone_quarry', 'farm', 'energy_tower'].includes(clicked.type)) {
          this.syncWithServer();
          this.audio.playCoin();
          const icons = { gold_mine: '🪙 Gold', elixir_collector: '💧 Elixir', lumber_yard: '🪵 Wood', stone_quarry: '🪨 Stone', farm: '🌾 Food', energy_tower: '⚡ Energy' };
          this.renderer.addFloater(`+Harvest ${icons[clicked.type] || ''}`, clicked.x, clicked.y, '#22c55e');
        }
      } else {
        this.deselectBuilding();
      }
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

    startPlacement(type) {
      this.closeAllDrawers();
      const spec = this.config.BUILDINGS[type];
      if (!spec) return;

      const defaultX = this.renderer.hoverTile ? this.renderer.hoverTile.x : 9;
      const defaultY = this.renderer.hoverTile ? this.renderer.hoverTile.y : 9;

      this.renderer.placementMode = {
        type,
        x: defaultX,
        y: defaultY,
        isValid: this.checkPlacementValidity(type, defaultX, defaultY)
      };

      document.getElementById('placementBanner').classList.add('active');
      document.getElementById('placementBuildingName').textContent = spec.name;
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
      document.getElementById('placementBanner').classList.remove('active');
    }

    checkPlacementValidity(type, x, y) {
      const spec = this.config.BUILDINGS[type];
      if (!spec) return false;

      const w = spec.size ? spec.size.w : 1;
      const h = spec.size ? spec.size.h : 1;

      // 1. Grid boundary
      if (x < 0 || y < 0 || x + w > this.config.GRID_SIZE || y + h > this.config.GRID_SIZE) {
        return false;
      }

      // 2. Overlap with existing buildings
      const overlap = this.city.buildings.some(b => {
        if (this.moveModeBuildingId && b.id === this.moveModeBuildingId) return false;
        const bSpec = this.config.BUILDINGS[b.type] || { size: { w: 1, h: 1 } };
        const bw = bSpec.size ? bSpec.size.w : 1;
        const bh = bSpec.size ? bSpec.size.h : 1;
        return !(x + w <= b.x || x >= b.x + bw || y + h <= b.y || y >= b.y + bh);
      });

      if (overlap) return false;

      // 3. Unique building check
      if (!this.moveModeBuildingId && spec.unique && this.city.buildings.some(b => b.type === type)) {
        return false;
      }

      return true;
    }

    async executePlacement(type, x, y) {
      const res = await this.api.placeBuilding(this.user.id, type, x, y);
      if (res && res.success) {
        this.city = res.city;
        this.cancelPlacement();
        this.audio.playPlace();
        this.renderer.addFloater('+1 Building', x, y, '#22c55e');
        window.CityApp.showToast(`Constructing ${this.config.BUILDINGS[type].name}!`, 'success');
        this.updateHUD();
      } else {
        this.audio.playError();
        window.CityApp.showToast(res.error || 'Failed to construct building', 'error');
      }
    }

    startMove(buildingId) {
      this.closeInspector();
      const bld = this.city.buildings.find(b => b.id === buildingId);
      if (!bld) return;

      this.moveModeBuildingId = buildingId;
      this.renderer.placementMode = {
        type: bld.type,
        x: bld.x,
        y: bld.y,
        isValid: true
      };

      document.getElementById('placementBanner').classList.add('active');
      document.getElementById('placementBuildingName').textContent = `Move ${this.config.BUILDINGS[bld.type].name}`;
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
        window.CityApp.showToast('Upgrade started!', 'info');
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
        this.renderer.addFloater('Complete! ✨', this.selectedBuilding.x, this.selectedBuilding.y, '#00f0ff');
        this.updateHUD();
        this.updateInspector(this.selectedBuilding);
        window.CityApp.showToast('Instant speedup complete!', 'success');
      } else {
        this.audio.playError();
        window.CityApp.showToast(res.error || 'Speedup failed', 'error');
      }
    }

    // HUD Update
    updateHUD() {
      if (!this.city) return;

      const res = this.city.resources || {};
      const caps = this.city.storageCaps || {};
      const rates = this.city.productionRates || {};

      // Resource Values & Meters
      this.setResourceMeter('gold', res.gold, caps.gold, rates.gold);
      this.setResourceMeter('elixir', res.elixir, caps.elixir, rates.elixir);
      this.setResourceMeter('wood', res.wood, caps.wood, rates.wood);
      this.setResourceMeter('stone', res.stone, caps.stone, rates.stone);
      this.setResourceMeter('food', res.food, caps.food, rates.food);

      // Gems
      const gemEl = document.getElementById('resGemsVal');
      if (gemEl) gemEl.textContent = Math.floor(res.gems || 0).toLocaleString().replace(/,/g, ' ');

      // Player Name / City Name
      const nameEl = document.getElementById('hudCityName');
      if (nameEl) nameEl.textContent = this.city.userName || this.city.cityName || 'HULKSDEN';

      // Experience Level & XP Bar
      const levelEl = document.getElementById('hudPlayerLevel');
      if (levelEl) levelEl.textContent = this.city.level || 1;

      const xpFillEl = document.getElementById('hudXpFill');
      if (xpFillEl) {
        const xpPct = Math.min(100, Math.max(12, ((this.city.xp || 35) % 100)));
        xpFillEl.style.width = `${xpPct}%`;
      }

      // Builders
      const buildersEl = document.getElementById('hudBuildersVal');
      if (buildersEl) {
        const free = this.city.builders ? this.city.builders.free : 2;
        const total = this.city.builders ? this.city.builders.total : 2;
        buildersEl.textContent = `${free}/${total}`;
      }

      // Trophies
      const tropEl = document.getElementById('hudTrophies');
      if (tropEl) tropEl.textContent = this.city.trophies !== undefined ? this.city.trophies : 0;

      // Shield Status
      const shieldTimerEl = document.getElementById('hudShieldTimer');
      if (shieldTimerEl) shieldTimerEl.textContent = this.city.shield || 'None';

      const shieldStatusEl = document.getElementById('hudShieldStatusVal');
      if (shieldStatusEl) shieldStatusEl.textContent = this.city.shield || 'None';

      // Population & Power (for backwards compatibility)
      const popEl = document.getElementById('hudPopulation');
      if (popEl) popEl.textContent = `Pop: ${(this.city.population || 50).toLocaleString()}`;

      const powerEl = document.querySelector('#hudCityPower span');
      if (powerEl) powerEl.textContent = (this.city.cityPower || 1200).toLocaleString();
    }

    setResourceMeter(resId, current, max, rate) {
      current = Math.floor(current || 0);
      max = Math.floor(max || 5000);
      const percent = Math.min(100, Math.max(0, (current / max) * 100));

      const valEl = document.getElementById(`res_${resId}_val`);
      if (valEl) valEl.textContent = current.toLocaleString().replace(/,/g, ' ');

      const barEl = document.getElementById(`res_${resId}_bar`);
      if (barEl) barEl.style.width = `${percent}%`;

      const rateEl = document.getElementById(`res_${resId}_rate`);
      if (rateEl && rate !== undefined) {
        rateEl.textContent = `+${rate}/m`;
      }
    }

    // Building Inspector Drawer & Clash of Clans Action Deck
    openInspector(bld) {
      this.updateInspector(bld);

      // Open Clash of Clans Bottom-Center Action Deck
      const actionDeck = document.getElementById('cocActionDeck');
      if (actionDeck) actionDeck.classList.add('active');
    }

    updateInspector(bld) {
      if (!bld) return;
      const spec = this.config.BUILDINGS[bld.type];
      if (!spec) return;

      const currentSpec = spec.levels[Math.min(bld.level - 1, spec.levels.length - 1)];
      const nextSpec = spec.levels[bld.level] || null;
      const isMaxLevel = bld.level >= spec.maxLevel;
      const isBusy = bld.status && bld.status !== 'idle';

      // 1. Update Detailed Drawer (accessible via Info card)
      const inspIcon = document.getElementById('inspIcon');
      if (inspIcon) inspIcon.textContent = spec.icon;
      const inspName = document.getElementById('inspName');
      if (inspName) inspName.textContent = spec.name;
      const inspCat = document.getElementById('inspCategory');
      if (inspCat) inspCat.textContent = spec.category;
      const inspLvl = document.getElementById('inspLevel');
      if (inspLvl) inspLvl.textContent = `Level ${bld.level || 1}`;
      const inspDesc = document.getElementById('inspDesc');
      if (inspDesc) inspDesc.textContent = spec.description;

      const statsContainer = document.getElementById('inspStats');
      if (statsContainer) {
        let statsHtml = '';
        if (currentSpec.rate) statsHtml += `<div class="stat-pill">⚡ Rate: <strong>+${currentSpec.rate}/min</strong></div>`;
        if (currentSpec.goldCap) statsHtml += `<div class="stat-pill">🏦 Storage: <strong>+${currentSpec.goldCap.toLocaleString()} Gold</strong></div>`;
        if (currentSpec.resourceCap) statsHtml += `<div class="stat-pill">📦 Capacity: <strong>+${currentSpec.resourceCap.toLocaleString()}</strong></div>`;
        if (currentSpec.dps) statsHtml += `<div class="stat-pill">⚔️ DPS: <strong>${currentSpec.dps}</strong></div>`;
        statsContainer.innerHTML = statsHtml;
      }

      // 2. Update Clash of Clans Bottom-Center Action Deck
      const deckTitle = document.getElementById('cocDeckTitle');
      if (deckTitle) deckTitle.textContent = `${spec.name} (Level ${bld.level || 1})`;

      // Info Card
      const cardInfo = document.getElementById('cocCardInfo');
      if (cardInfo) {
        cardInfo.onclick = () => {
          const drawer = document.getElementById('buildingInspectorDrawer');
          if (drawer) drawer.classList.toggle('active');
        };
      }

      // Upgrade / Speedup Card
      const cardUpgrade = document.getElementById('cocCardUpgrade');
      const cardSpeedup = document.getElementById('cocCardSpeedup');
      const costIcon = document.getElementById('cocCardCostIcon');
      const costVal = document.getElementById('cocCardCostVal');

      if (isBusy) {
        const remainingSec = Math.max(0, Math.ceil(((bld.finishTime || Date.now()) - Date.now()) / 1000));
        const gemCost = Math.max(1, Math.ceil(remainingSec / 60));

        if (cardUpgrade) cardUpgrade.style.display = 'none';
        if (cardSpeedup) {
          cardSpeedup.style.display = 'flex';
          const speedupCostEl = document.getElementById('cocCardSpeedupCost');
          if (speedupCostEl) speedupCostEl.textContent = gemCost;
          cardSpeedup.onclick = () => this.speedupBuilding(bld.id);
        }
      } else {
        if (cardSpeedup) cardSpeedup.style.display = 'none';
        if (cardUpgrade) {
          cardUpgrade.style.display = 'flex';
          if (isMaxLevel) {
            if (costVal) costVal.textContent = 'MAX';
            cardUpgrade.disabled = true;
          } else if (nextSpec) {
            cardUpgrade.disabled = false;
            let primaryCost = nextSpec.cost ? (nextSpec.cost.gold || nextSpec.cost.elixir || nextSpec.cost.wood || 0) : 0;
            let icon = nextSpec.cost && nextSpec.cost.elixir ? '💧' : '🪙';
            if (costIcon) costIcon.textContent = icon;
            if (costVal) costVal.textContent = primaryCost.toLocaleString().replace(/,/g, ' ');
            cardUpgrade.onclick = () => this.upgradeBuilding(bld.id);
          }
        }
      }

      // Contextual Card (Train, Collect, Magic Items, Army)
      const cardContext = document.getElementById('cocCardContext');
      const contextIcon = document.getElementById('cocCardContextIcon');
      const contextLabel = document.getElementById('cocCardContextLabel');

      if (cardContext && contextIcon && contextLabel) {
        if (['training_grounds', 'barracks'].includes(bld.type)) {
          contextIcon.textContent = '⚔️';
          contextLabel.textContent = 'Train';
          cardContext.onclick = () => window.CityApp.openArmyModal();
        } else if (bld.type === 'gold_mine') {
          contextIcon.textContent = '🪙';
          contextLabel.textContent = 'Collect';
          cardContext.onclick = () => {
            this.syncWithServer();
            this.audio.playCoin();
            this.renderer.addFloater('+Harvest Gold', bld.x, bld.y, '#fbbf24');
          };
        } else if (bld.type === 'elixir_collector') {
          contextIcon.textContent = '💧';
          contextLabel.textContent = 'Collect';
          cardContext.onclick = () => {
            this.syncWithServer();
            this.audio.playCoin();
            this.renderer.addFloater('+Harvest Elixir', bld.x, bld.y, '#ec4899');
          };
        } else if (bld.type === 'army_camp') {
          contextIcon.textContent = '🏕️';
          contextLabel.textContent = 'Army';
          cardContext.onclick = () => window.CityApp.openArmyModal();
        } else if (bld.type === 'city_hall') {
          contextIcon.textContent = '✨';
          contextLabel.textContent = 'Magic Items';
          cardContext.onclick = () => window.CityApp.showToast('Magic Items vault is ready!', 'info');
        } else {
          contextIcon.textContent = '✨';
          contextLabel.textContent = 'Special';
          cardContext.onclick = () => {
            const drawer = document.getElementById('buildingInspectorDrawer');
            if (drawer) drawer.classList.toggle('active');
          };
        }
      }

      // Move Card
      const cardMove = document.getElementById('cocCardMove');
      if (cardMove) {
        cardMove.onclick = () => this.startMove(bld.id);
      }

      // Drawer move button
      const moveBtn = document.getElementById('btnInspMove');
      if (moveBtn) {
        moveBtn.onclick = () => this.startMove(bld.id);
      }
    }

    closeInspector() {
      const drawer = document.getElementById('buildingInspectorDrawer');
      if (drawer) drawer.classList.remove('active');

      const actionDeck = document.getElementById('cocActionDeck');
      if (actionDeck) actionDeck.classList.remove('active');
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
          While you were away for <strong>${timeStr}</strong>, your citizens worked diligently!
        </p>

        <div class="offline-gain-grid">
          <div class="offline-gain-item"><span>🪙 Gold</span><strong>+${(report.earned.gold || 0).toLocaleString()}</strong></div>
          <div class="offline-gain-item"><span>🪵 Wood</span><strong>+${(report.earned.wood || 0).toLocaleString()}</strong></div>
          <div class="offline-gain-item"><span>🪨 Stone</span><strong>+${(report.earned.stone || 0).toLocaleString()}</strong></div>
          <div class="offline-gain-item"><span>🌾 Food</span><strong>+${(report.earned.food || 0).toLocaleString()}</strong></div>
        </div>

        ${report.completedUpgrades && report.completedUpgrades.length > 0 ? `
          <div style="margin-top: 14px; padding: 10px; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 8px;">
            <strong style="color: #4ade80;">Completed Upgrades:</strong>
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
    // CLICKABLE FLOATING HARVEST BUBBLES
    // =========================================================================
    collectFromBubble(bubble) {
      this.audio.playBubblePop();
      if (!this.city.resources) this.city.resources = {};

      const grid = this.renderer.screenToGrid(bubble.worldX, bubble.worldY);

      if (bubble.resource === 'gold') {
        const caps = this.city.storageCaps || { gold: 20000 };
        this.city.resources.gold = Math.min(caps.gold || 50000, (this.city.resources.gold || 0) + bubble.amount);
        this.renderer.addFloater(`+${bubble.amount} 🪙`, grid.x, grid.y, '#fbbf24');
      } else {
        const caps = this.city.storageCaps || { elixir: 20000 };
        this.city.resources.elixir = Math.min(caps.elixir || 50000, (this.city.resources.elixir || 0) + bubble.amount);
        this.renderer.addFloater(`+${bubble.amount} 💧`, grid.x, grid.y, '#d946ef');
      }

      this.updateHUD();
      if (this.api && this.user) {
        this.api.collect(this.user.id);
      }
    }

    // =========================================================================
    // REAL-TIME TACTICAL COMBAT (CLASH OF CLANS RAID ENGINE)
    // =========================================================================
    startTacticalBattle(stronghold, deployedUnits) {
      this.closeAllDrawers();
      this.deselectBuilding();

      const uKeys = Object.keys(deployedUnits).filter(k => (deployedUnits[k] || 0) > 0);
      const firstUnit = uKeys[0] || 'guardian';

      this.renderer.battleMode = {
        active: true,
        stronghold,
        selectedDeployUnit: firstUnit,
        remainingUnits: { ...deployedUnits },
        totalDeployable: Object.values(deployedUnits).reduce((a, b) => a + b, 0),
        units: [],
        defenses: this.generateStrongholdDefenses(stronghold),
        projectiles: [],
        stolenGold: 0,
        stolenElixir: 0,
        stars: 0,
        townHallDestroyed: false,
        destructionPct: 0
      };

      // Center camera onto battlefield center
      this.renderer.centerOn(8, 8);

      // Play War Horn
      this.audio.playBattleHorn();

      // Show Battle HUD Overlay
      const hud = document.getElementById('battleHudOverlay');
      if (hud) {
        hud.classList.add('active');
        const nodeName = document.getElementById('battleNodeName');
        if (nodeName) nodeName.textContent = stronghold.name || 'Goblin Outpost';
        const pctEl = document.getElementById('battleDestructionPercent');
        if (pctEl) pctEl.textContent = '0%';
        const fillEl = document.getElementById('battleDestructionFill');
        if (fillEl) fillEl.style.width = '0%';
      }

      this.renderBattleDeployTray();

      const retreatBtn = document.getElementById('btnBattleRetreat');
      if (retreatBtn) {
        retreatBtn.onclick = () => {
          this.concludeBattle(false, 'Retreated from battle');
        };
      }
    }

    generateStrongholdDefenses(stronghold) {
      const defs = [];
      const lvl = stronghold.level || 1;

      // 1. Central Goblin Town Hall
      defs.push({ id: 'th', type: 'city_hall', x: 7, y: 7, level: lvl, hp: 800 * lvl, maxHp: 800 * lvl, isTownHall: true });

      // 2. Storages (Contain large loot)
      defs.push({ id: 'res1', type: 'treasury', x: 5, y: 7, level: lvl, hp: 450 * lvl, maxHp: 450 * lvl, lootGold: 750 * lvl });
      defs.push({ id: 'res2', type: 'storage', x: 9, y: 7, level: lvl, hp: 450 * lvl, maxHp: 450 * lvl, lootElixir: 750 * lvl });

      // 3. Defensive Cannons
      defs.push({ id: 'c1', type: 'defense_cannon', x: 7, y: 4, level: lvl, hp: 400 * lvl, maxHp: 400 * lvl, cooldown: 10, range: 6 });
      defs.push({ id: 'c2', type: 'defense_cannon', x: 7, y: 10, level: lvl, hp: 400 * lvl, maxHp: 400 * lvl, cooldown: 30, range: 6 });

      // 4. Archer Tower (Level 2+)
      if (lvl >= 2) {
        defs.push({ id: 't1', type: 'watch_tower', x: 4, y: 4, level: lvl, hp: 350 * lvl, maxHp: 350 * lvl, cooldown: 20, range: 7 });
      }

      // 5. Protective Wall Ring
      const wallGrid = [
        [4, 6], [4, 7], [4, 8], [10, 6], [10, 7], [10, 8],
        [6, 4], [8, 4], [6, 10], [8, 10]
      ];
      wallGrid.forEach(([wx, wy], idx) => {
        defs.push({ id: `w_${idx}`, type: 'defense_wall', x: wx, y: wy, level: lvl, hp: 280 * lvl, maxHp: 280 * lvl, isWall: true });
      });

      return defs;
    }

    renderBattleDeployTray() {
      const container = document.getElementById('battleDeployUnitsContainer');
      if (!container || !this.renderer.battleMode) return;

      const b = this.renderer.battleMode;
      let html = '';

      Object.keys(b.remainingUnits).forEach(unitType => {
        const count = b.remainingUnits[unitType] || 0;
        const uSpec = CityConfig.UNITS[unitType] || { name: unitType, icon: '⚔️' };
        const isSelected = b.selectedDeployUnit === unitType;

        html += `
          <div class="battle-deploy-card ${isSelected ? 'active-unit' : ''} ${count <= 0 ? 'depleted' : ''}" data-unit="${unitType}">
            <div class="deploy-card-icon">${uSpec.icon}</div>
            <div class="deploy-card-name">${uSpec.name}</div>
            <div class="deploy-card-badge">x${count}</div>
          </div>
        `;
      });

      container.innerHTML = html;

      container.querySelectorAll('.battle-deploy-card').forEach(card => {
        card.onclick = () => {
          const uType = card.getAttribute('data-unit');
          if (b.remainingUnits[uType] > 0) {
            b.selectedDeployUnit = uType;
            this.audio.playClick();
            this.renderBattleDeployTray();
          }
        };
      });
    }

    handleBattleCanvasClick(gx, gy) {
      const b = this.renderer.battleMode;
      if (!b || !b.active) return;

      const size = 16;
      // Must deploy outside the red boundary
      const isOutside = (gx < 0 || gx >= size || gy < 0 || gy >= size);
      if (!isOutside) {
        this.audio.playError();
        if (window.CityApp && window.CityApp.showToast) {
          window.CityApp.showToast('Deploy troops outside the red perimeter!', 'warning');
        }
        return;
      }

      const uType = b.selectedDeployUnit;
      if (!uType || !b.remainingUnits[uType] || b.remainingUnits[uType] <= 0) {
        this.audio.playError();
        return;
      }

      // Consume unit
      b.remainingUnits[uType]--;

      // Spawn unit
      const uSpec = CityConfig.UNITS[uType] || { name: 'Troop', icon: '⚔️', hp: 120, damage: 25, speed: 1.0 };
      const speed = (uType === 'goblin' ? 0.055 : (uType === 'giant' ? 0.024 : 0.038));
      const range = (uType === 'archer' ? 4.5 : 1.2);

      b.units.push({
        id: Math.random(),
        type: uType,
        icon: uSpec.icon,
        gx: Math.max(-2, Math.min(18, gx)),
        gy: Math.max(-2, Math.min(18, gy)),
        hp: uSpec.hp || 120,
        maxHp: uSpec.hp || 120,
        damage: uSpec.damage || 25,
        speed,
        range,
        cooldown: 0
      });

      this.audio.playPlace();
      this.renderBattleDeployTray();
    }

    update() {
      if (this.renderer.battleMode && this.renderer.battleMode.active) {
        this.updateBattle();
      }
    }

    updateBattle() {
      const b = this.renderer.battleMode;
      if (!b || !b.active) return;

      const livingDefenses = b.defenses.filter(d => d.hp > 0);

      // 1. Update Player Troops
      for (const unit of b.units) {
        if (unit.hp <= 0) continue;
        if (unit.cooldown > 0) unit.cooldown--;

        // Select target based on troop specialty
        let target = null;
        if (unit.type === 'giant') {
          // Giants prioritize defenses
          target = livingDefenses.find(d => ['defense_cannon', 'watch_tower', 'energy_tower'].includes(d.type)) || livingDefenses[0];
        } else if (unit.type === 'goblin') {
          // Goblins prioritize storages & mines
          target = livingDefenses.find(d => ['treasury', 'storage', 'gold_mine', 'elixir_collector'].includes(d.type)) || livingDefenses[0];
        } else {
          // Barbarians / Archers target closest building
          let closestDist = Infinity;
          for (const def of livingDefenses) {
            const dist = Math.hypot(def.x - unit.gx, def.y - unit.gy);
            if (dist < closestDist) {
              closestDist = dist;
              target = def;
            }
          }
        }

        if (target) {
          const dist = Math.hypot(target.x - unit.gx, target.y - unit.gy);
          if (dist > unit.range) {
            // March toward target
            const angle = Math.atan2(target.y - unit.gy, target.x - unit.gx);
            unit.gx += Math.cos(angle) * unit.speed;
            unit.gy += Math.sin(angle) * unit.speed;
          } else {
            // Attack target
            if (unit.cooldown <= 0) {
              unit.cooldown = 45;
              const dmg = unit.type === 'goblin' && ['treasury', 'storage'].includes(target.type) ? unit.damage * 2 : unit.damage;
              target.hp -= dmg;
              this.audio.playSwordClash();

              this.renderer.addFloater(`-${dmg}`, target.x, target.y, '#ef4444');

              if (target.hp <= 0) {
                // Building destroyed!
                this.audio.playWallHit();
                if (target.isTownHall && !b.townHallDestroyed) {
                  b.townHallDestroyed = true;
                  b.stars = Math.max(b.stars, 1) + 1;
                  this.renderer.addFloater('⭐ TOWN HALL DESTROYED!', target.x, target.y - 1, '#fde047');
                }
                if (target.lootGold) {
                  b.stolenGold += target.lootGold;
                  this.renderer.addFloater(`+${target.lootGold} 🪙`, target.x, target.y, '#fbbf24');
                }
                if (target.lootElixir) {
                  b.stolenElixir += target.lootElixir;
                  this.renderer.addFloater(`+${target.lootElixir} 💧`, target.x, target.y, '#d946ef');
                }

                // Recalculate destruction percentage
                const nonWalls = b.defenses.filter(d => !d.isWall);
                const destroyedNonWalls = nonWalls.filter(d => d.hp <= 0).length;
                const pct = Math.floor((destroyedNonWalls / Math.max(1, nonWalls.length)) * 100);
                b.destructionPct = pct;

                const pctEl = document.getElementById('battleDestructionPercent');
                if (pctEl) pctEl.textContent = `${pct}%`;
                const fillEl = document.getElementById('battleDestructionFill');
                if (fillEl) fillEl.style.width = `${pct}%`;

                if (pct >= 50 && b.stars < 1) {
                  b.stars = Math.max(b.stars, 1);
                }
                if (pct >= 100) {
                  b.stars = 3;
                  this.concludeBattle(true, '100% Total Destruction!');
                  return;
                }
              }
            }
          }
        }
      }

      // 2. Update Defenses (Cannons / Archer Towers)
      for (const def of b.defenses) {
        if (def.hp <= 0) continue;
        if (def.cooldown > 0) def.cooldown--;

        if (['defense_cannon', 'watch_tower'].includes(def.type)) {
          const livingTroops = b.units.filter(u => u.hp > 0);
          let closestTroop = null;
          let closestDist = def.range || 6;

          for (const troop of livingTroops) {
            const dist = Math.hypot(troop.gx - def.x, troop.gy - def.y);
            if (dist <= closestDist) {
              closestDist = dist;
              closestTroop = troop;
            }
          }

          if (closestTroop) {
            const isoDef = this.renderer.gridToIso(def.x + 0.5, def.y + 0.5);
            const isoTgt = this.renderer.gridToIso(closestTroop.gx, closestTroop.gy);
            def.angle = Math.atan2(isoTgt.y - isoDef.y, isoTgt.x - isoDef.x) + Math.PI / 2;

            if (def.cooldown <= 0) {
              def.cooldown = 55;
              def.firingAnim = 7;
              this.audio.playCannon();

              b.projectiles.push({
                type: def.type === 'watch_tower' ? 'arrow' : 'cannonball',
                targetUnit: closestTroop,
                damage: def.type === 'watch_tower' ? 24 : 45,
                sx: isoDef.x,
                sy: isoDef.y - 12,
                tx: isoTgt.x,
                ty: isoTgt.y,
                cx: isoDef.x,
                cy: isoDef.y - 12,
                vx: (isoTgt.x - isoDef.x) * 0.08,
                vy: (isoTgt.y - isoDef.y) * 0.08,
                progress: 0
              });
            }
          }
        }
      }

      // 3. Update Projectiles
      for (let i = b.projectiles.length - 1; i >= 0; i--) {
        const p = b.projectiles[i];
        p.progress += 0.09;
        p.cx = p.sx + (p.tx - p.sx) * p.progress;
        p.cy = p.sy + (p.ty - p.sy) * p.progress - Math.sin(p.progress * Math.PI) * 35;

        if (p.progress >= 1) {
          if (p.targetUnit && p.targetUnit.hp > 0) {
            p.targetUnit.hp -= p.damage;
            this.renderer.addSmoke(p.targetUnit.gx, p.targetUnit.gy, 'rgba(239, 68, 68, 0.4)');
          }
          b.projectiles.splice(i, 1);
        }
      }

      // 4. Check if battle concluded (all units deployed and died)
      const allDeployed = Object.values(b.remainingUnits).every(c => c <= 0);
      const allLivingDead = b.units.every(u => u.hp <= 0);
      if (allDeployed && allLivingDead && b.units.length > 0) {
        this.concludeBattle(b.destructionPct >= 50, b.destructionPct >= 50 ? 'Victory!' : 'Defeat');
      }
    }

    concludeBattle(victory, subtitle = '') {
      const b = this.renderer.battleMode;
      if (!b || !b.active) return;
      b.active = false;

      // Award Stolen Resources & Trophies to Player City
      if (!this.city.resources) this.city.resources = {};
      const earnedGold = Math.max(200, b.stolenGold || (victory ? 1200 : 300));
      const earnedElixir = Math.max(200, b.stolenElixir || (victory ? 1200 : 300));
      const earnedTrophies = victory ? (b.stars === 3 ? 30 : (b.stars === 2 ? 20 : 12)) : 0;

      this.city.resources.gold = (this.city.resources.gold || 0) + earnedGold;
      this.city.resources.elixir = (this.city.resources.elixir || 0) + earnedElixir;
      this.city.trophies = (this.city.trophies || 0) + earnedTrophies;

      if (victory) {
        this.audio.playVictoryFanfare();
      } else {
        this.audio.playDefeatSound();
      }

      // Hide Battle HUD Overlay
      const hud = document.getElementById('battleHudOverlay');
      if (hud) hud.classList.remove('active');

      this.syncWithServer();
      this.updateHUD();

      if (window.CityApp && window.CityApp.showBattleSummary) {
        window.CityApp.showBattleSummary({
          victory,
          stars: Math.max(victory ? 1 : 0, b.stars),
          destructionPct: b.destructionPct,
          lootGold: earnedGold,
          lootElixir: earnedElixir,
          trophies: earnedTrophies,
          subtitle
        });
      }

      this.renderer.battleMode = null;
      const ch = this.city.buildings.find(bld => bld.type === 'city_hall');
      if (ch) this.renderer.centerOn(ch.x, ch.y);
    }
  }

  exports.CityGame = CityGame;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.CityGame = {}));

