/**
 * InfinityPlay - City Builder Isometric Canvas Renderer (V2)
 * High-performance 60 FPS 2.5D isometric engine with:
 * - 26x26 rich terrain (lush grass variations, animated river canal, cobblestone paths, natural scatter)
 * - Bounded camera with pan momentum and smooth zoom
 * - 10-level progressive visual evolution for all buildings
 * - Autonomous walking citizens and chimney smoke particles
 * - Floating resource collection bubbles and animated fly-to-HUD resources
 * - Wall auto-connection (ortho/corner/junction)
 * - Defense range circles
 * - Real-time tactical battle visualization (deployed units, arrows, cannon shells, laser beams, destruction fire)
 */

(function(exports) {
  'use strict';

  class CityRenderer {
    constructor(canvas, config) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.config = config;

      // Isometric tile metrics
      this.tileW = 68;
      this.tileH = 34;

      // Camera state with smooth panning & bounded limits
      this.camera = {
        x: 0,
        y: 0,
        zoom: 0.95,
        minZoom: 0.45,
        maxZoom: 2.1,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        lastMouseX: 0,
        lastMouseY: 0,
        vx: 0,
        vy: 0
      };

      // Hover and selection
      this.hoverTile = null; // { x, y }
      this.selectedBuildingId = null;

      // Placement preview
      this.placementMode = null; // { type, isValid, x, y }

      // Dynamic life & particle systems
      this.particles = [];       // floating texts, sparkles, smoke puffs
      this.flyingLoot = [];       // resources flying from building to top HUD
      this.citizens = [];         // wandering villagers/workers
      this.animTick = 0;

      // Battle rendering state
      this.battleMode = null;     // { active: bool, units: [], projectiles: [], enemyBuildings: [] }

      this.setupCanvas();
      this.initCitizens();
    }

    setupCanvas() {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.scale(dpr, dpr);
      this.viewWidth = rect.width;
      this.viewHeight = rect.height;
    }

    centerOn(gridX = 12, gridY = 12) {
      const iso = this.gridToIso(gridX, gridY);
      this.camera.x = this.viewWidth / 2 - iso.x * this.camera.zoom;
      this.camera.y = this.viewHeight / 2 - iso.y * this.camera.zoom - 30;
      this.camera.vx = 0;
      this.camera.vy = 0;
    }

    gridToIso(x, y) {
      return {
        x: (x - y) * (this.tileW / 2),
        y: (x + y) * (this.tileH / 2)
      };
    }

    screenToGrid(screenX, screenY) {
      const worldX = (screenX - this.camera.x) / this.camera.zoom;
      const worldY = (screenY - this.camera.y) / this.camera.zoom;

      const halfW = this.tileW / 2;
      const halfH = this.tileH / 2;

      const gx = Math.floor((worldX / halfW + worldY / halfH) / 2);
      const gy = Math.floor((worldY / halfH - worldX / halfW) / 2);

      return { x: gx, y: gy };
    }

    // Camera boundary clamping: keeps the city on screen
    clampCamera() {
      const size = this.config.GRID_SIZE;
      const centerIso = this.gridToIso(size / 2, size / 2);
      const maxDist = (size * this.tileW) * 0.7 * this.camera.zoom;

      const centerX = this.viewWidth / 2 - centerIso.x * this.camera.zoom;
      const centerY = this.viewHeight / 2 - centerIso.y * this.camera.zoom;

      this.camera.x = Math.max(centerX - maxDist, Math.min(centerX + maxDist, this.camera.x));
      this.camera.y = Math.max(centerY - maxDist, Math.min(centerY + maxDist, this.camera.y));
    }

    addFloater(text, gridX, gridY, color = '#fbbf24') {
      const iso = this.gridToIso(gridX + 0.5, gridY + 0.5);
      this.particles.push({
        type: 'text',
        text,
        x: iso.x,
        y: iso.y - 35,
        vy: -1.3,
        alpha: 1.0,
        color,
        life: 60
      });
    }

    addFlyingResource(fromGx, fromGy, resType) {
      const startIso = this.gridToIso(fromGx + 0.5, fromGy + 0.5);
      const iconMap = { gold: '🪙', wood: '🪵', stone: '🪨', food: '🌾', gems: '💎' };

      // Target top resource HUD roughly
      const targetScreenX = this.viewWidth * 0.45;
      const targetScreenY = 30;

      this.flyingLoot.push({
        x: startIso.x,
        y: startIso.y - 30,
        startX: startIso.x,
        startY: startIso.y - 30,
        targetScreenX,
        targetScreenY,
        progress: 0,
        icon: iconMap[resType] || '🪙',
        speed: 0.035 + Math.random() * 0.015
      });
    }

    addSmokePuff(gx, gy) {
      const iso = this.gridToIso(gx + 0.5, gy + 0.5);
      this.particles.push({
        type: 'smoke',
        x: iso.x + (Math.random() * 6 - 3),
        y: iso.y - 45,
        vx: (Math.random() - 0.5) * 0.4 + 0.3, // drifts right
        vy: -0.7 - Math.random() * 0.4,
        radius: 3 + Math.random() * 3,
        alpha: 0.65,
        life: 55
      });
    }

    // Citizens wandering paths
    initCitizens() {
      this.citizens = [];
      const roles = ['builder', 'farmer', 'merchant', 'guard'];
      for (let i = 0; i < 8; i++) {
        this.citizens.push({
          x: 10 + Math.floor(Math.random() * 7),
          y: 10 + Math.floor(Math.random() * 7),
          targetX: 10 + Math.floor(Math.random() * 7),
          targetY: 10 + Math.floor(Math.random() * 7),
          progress: Math.random(),
          speed: 0.005 + Math.random() * 0.005,
          role: roles[i % roles.length],
          dir: 1
        });
      }
    }

    updateCitizens() {
      const size = this.config.GRID_SIZE;
      this.citizens.forEach(c => {
        c.progress += c.speed;
        if (c.progress >= 1.0) {
          c.x = c.targetX;
          c.y = c.targetY;
          c.progress = 0;
          // Pick new neighboring target along road or grass
          const offsets = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
          const pick = offsets[Math.floor(Math.random() * offsets.length)];
          c.targetX = Math.max(4, Math.min(size - 5, c.x + pick.x));
          c.targetY = Math.max(4, Math.min(size - 5, c.y + pick.y));
          c.dir = pick.x >= 0 ? 1 : -1;
        }
      });
    }

    // =========================================================================
    // MAIN RENDER LOOP
    // =========================================================================
    render(city) {
      if (!city) return;
      this.animTick++;

      // Pan inertia dampening
      if (!this.camera.isDragging) {
        this.camera.x += this.camera.vx;
        this.camera.y += this.camera.vy;
        this.camera.vx *= 0.88;
        this.camera.vy *= 0.88;
      }
      this.clampCamera();

      // Update citizens and occasional smoke
      this.updateCitizens();
      if (this.animTick % 25 === 0) {
        (city.buildings || []).forEach(b => {
          if (['gold_mine', 'stone_quarry', 'lumber_yard', 'city_hall'].includes(b.type)) {
            this.addSmokePuff(b.x, b.y);
          }
        });
      }

      const ctx = this.ctx;
      ctx.save();
      ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);

      // Deep atmospheric background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, this.viewHeight);
      bgGrad.addColorStop(0, '#04060d');
      bgGrad.addColorStop(0.5, '#0a0e1c');
      bgGrad.addColorStop(1, '#070913');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);

      // Camera space transform
      ctx.save();
      ctx.translate(this.camera.x, this.camera.y);
      ctx.scale(this.camera.zoom, this.camera.zoom);

      // 1. Render Terrain Tiles (26x26)
      this.renderTerrain(ctx);

      // 2. Render Tile Hover / Placement cursor
      if (this.hoverTile && !this.placementMode) {
        this.renderTileHighlight(ctx, this.hoverTile.x, this.hoverTile.y, 'rgba(0, 240, 255, 0.25)', '#00f0ff');
      }

      // 3. Render Defense Range Circle if selected building is a defense tower
      if (this.selectedBuildingId) {
        const selBld = (city.buildings || []).find(b => b.id === this.selectedBuildingId);
        if (selBld) {
          const spec = this.config.BUILDINGS[selBld.type];
          if (spec && spec.category === 'Defense') {
            const lvlSpec = spec.levels[Math.min((selBld.level || 1) - 1, spec.levels.length - 1)];
            if (lvlSpec && lvlSpec.range) {
              this.renderDefenseRange(ctx, selBld.x + (spec.size.w / 2), selBld.y + (spec.size.h / 2), lvlSpec.range);
            }
          }
        }
      }

      // 4. Render Buildings in depth-sorted order
      this.renderBuildings(ctx, city);

      // 5. Render Autonomous Citizens
      this.renderCitizens(ctx);

      // 6. Render Placement Preview if active
      if (this.placementMode) {
        this.renderPlacementPreview(ctx, city);
      }

      // 7. Render Battle Simulation Entities (Units, Arrows, Cannonballs, Beams)
      if (this.battleMode && this.battleMode.active) {
        this.renderBattleEntities(ctx);
      }

      // 8. Render Floating Particles & Text
      this.renderParticles(ctx);

      ctx.restore(); // Camera transform restored

      // 9. Render Flying Resources that curve into top HUD (Screen Space)
      this.renderFlyingLoot(ctx);

      // 10. Vignette frame
      this.renderVignette(ctx);

      ctx.restore();
    }

    // =========================================================================
    // 1. TERRAIN & NATURAL SCATTER
    // =========================================================================
    renderTerrain(ctx) {
      const size = this.config.GRID_SIZE;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const iso = this.gridToIso(x, y);

          // Water canal on east border with gentle curve
          const isWater = (x >= 22 && y >= 3 && y <= 23) || (x >= 20 && y >= 10 && y <= 16);
          // Cobblestone Main Avenues (Crossway at center)
          const isMainRoad = (x === 12 || y === 12 || (x >= 10 && x <= 14 && y >= 10 && y <= 14));
          // Dirt Pathways
          const isDirtPath = (!isMainRoad && !isWater && ((x === 6 && y >= 6 && y <= 18) || (x === 18 && y >= 6 && y <= 18)));

          if (isWater) {
            this.drawWaterTile(ctx, iso.x, iso.y, x, y);
          } else if (isMainRoad) {
            this.drawRoadTile(ctx, iso.x, iso.y);
          } else if (isDirtPath) {
            this.drawDirtTile(ctx, iso.x, iso.y);
          } else {
            // Lush natural grass variations with subtle noise
            const alt = (x * 7 + y * 13) % 5 === 0;
            const dark = (x + y) % 2 === 0;
            this.drawGrassTile(ctx, iso.x, iso.y, alt, dark);
          }

          // Natural scatter: trees, bushes, rocks at borders
          if (!isWater && !isMainRoad && !isDirtPath) {
            const hash = (x * 31 + y * 17) % 23;
            if (hash === 1 && (x < 6 || x > 18 || y < 6 || y > 18)) {
              this.drawOakTree(ctx, iso.x, iso.y);
            } else if (hash === 2 && (x < 5 || y < 5 || y > 20)) {
              this.drawPineTree(ctx, iso.x, iso.y);
            } else if (hash === 3 && (x < 8 || y < 8)) {
              this.drawRock(ctx, iso.x, iso.y);
            } else if (hash === 4) {
              this.drawBush(ctx, iso.x, iso.y);
            }
          }
        }
      }
    }

    drawGrassTile(ctx, x, y, alt, dark) {
      const hw = this.tileW / 2;
      const hh = this.tileH / 2;

      ctx.beginPath();
      ctx.moveTo(x, y - hh);
      ctx.lineTo(x + hw, y);
      ctx.lineTo(x, y + hh);
      ctx.lineTo(x - hw, y);
      ctx.closePath();

      if (alt) {
        ctx.fillStyle = '#1c4224'; // Lush green accent
      } else if (dark) {
        ctx.fillStyle = '#14331a'; // Deep green
      } else {
        ctx.fillStyle = '#183a1e'; // Base green
      }
      ctx.fill();

      // Subtle tile seam
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    drawRoadTile(ctx, x, y) {
      const hw = this.tileW / 2;
      const hh = this.tileH / 2;

      ctx.beginPath();
      ctx.moveTo(x, y - hh);
      ctx.lineTo(x + hw, y);
      ctx.lineTo(x, y + hh);
      ctx.lineTo(x - hw, y);
      ctx.closePath();

      ctx.fillStyle = '#262d3d'; // Chiseled stone cobbles
      ctx.fill();

      ctx.strokeStyle = '#3c455c';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Pavement stones
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fillRect(x - 3, y - 2, 6, 4);
    }

    drawDirtTile(ctx, x, y) {
      const hw = this.tileW / 2;
      const hh = this.tileH / 2;

      ctx.beginPath();
      ctx.moveTo(x, y - hh);
      ctx.lineTo(x + hw, y);
      ctx.lineTo(x, y + hh);
      ctx.lineTo(x - hw, y);
      ctx.closePath();

      ctx.fillStyle = '#3a2d1d'; // Packed dirt trail
      ctx.fill();

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    drawWaterTile(ctx, x, y, gx, gy) {
      const hw = this.tileW / 2;
      const hh = this.tileH / 2;

      ctx.beginPath();
      ctx.moveTo(x, y - hh);
      ctx.lineTo(x + hw, y);
      ctx.lineTo(x, y + hh);
      ctx.lineTo(x - hw, y);
      ctx.closePath();

      // Animated sine wave flow
      const wave = Math.sin(gx * 0.8 + gy * 0.8 + this.animTick * 0.06) * 0.12;
      ctx.fillStyle = `rgba(12, 128, 160, ${0.82 + wave})`;
      ctx.fill();

      // Shoreline frothing surf
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Sunlight water glint
      if ((this.animTick + gx * 5 + gy * 3) % 40 < 4) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 2, y - 1, 4, 2);
      }
    }

    drawOakTree(ctx, x, y) {
      // Trunk
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(x - 2, y - 12, 4, 12);

      // Canopy with wind sway
      const sway = Math.sin(this.animTick * 0.04 + x) * 1.5;
      ctx.fillStyle = '#1e5e2f';
      ctx.beginPath();
      ctx.arc(x + sway, y - 18, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#2d7a3e';
      ctx.beginPath();
      ctx.arc(x + sway - 2, y - 21, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    drawPineTree(ctx, x, y) {
      ctx.fillStyle = '#452a19';
      ctx.fillRect(x - 1.5, y - 8, 3, 8);

      const sway = Math.sin(this.animTick * 0.04 + y) * 1.2;
      ctx.fillStyle = '#134e2a';

      // Tier 1
      ctx.beginPath();
      ctx.moveTo(x + sway, y - 24);
      ctx.lineTo(x + sway + 7, y - 14);
      ctx.lineTo(x + sway - 7, y - 14);
      ctx.closePath();
      ctx.fill();

      // Tier 2
      ctx.beginPath();
      ctx.moveTo(x + sway, y - 17);
      ctx.lineTo(x + sway + 9, y - 7);
      ctx.lineTo(x + sway - 9, y - 7);
      ctx.closePath();
      ctx.fill();
    }

    drawRock(ctx, x, y) {
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.ellipse(x, y - 2, 7, 5, 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.ellipse(x - 2, y - 3, 4, 3, 0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    drawBush(ctx, x, y) {
      ctx.fillStyle = '#1e5628';
      ctx.beginPath();
      ctx.arc(x - 3, y - 2, 4, 0, Math.PI * 2);
      ctx.arc(x + 3, y - 2, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // =========================================================================
    // 2. HIGHLIGHTS & DEFENSE RANGE
    // =========================================================================
    renderTileHighlight(ctx, gx, gy, fillStyle, strokeStyle, w = 1, h = 1) {
      const hw = this.tileW / 2;
      const hh = this.tileH / 2;

      const top = this.gridToIso(gx, gy);
      const right = this.gridToIso(gx + w, gy);
      const bottom = this.gridToIso(gx + w, gy + h);
      const left = this.gridToIso(gx, gy + h);

      ctx.beginPath();
      ctx.moveTo(top.x, top.y - hh);
      ctx.lineTo(right.x + hw, right.y);
      ctx.lineTo(bottom.x, bottom.y + hh);
      ctx.lineTo(left.x - hw, left.y);
      ctx.closePath();

      ctx.fillStyle = fillStyle;
      ctx.fill();

      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    renderDefenseRange(ctx, centerGx, centerGy, range) {
      const iso = this.gridToIso(centerGx, centerGy);
      const rx = range * this.tileW;
      const ry = range * this.tileH;

      ctx.beginPath();
      ctx.ellipse(iso.x, iso.y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
      ctx.fill();

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.55)';
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // =========================================================================
    // 3. BUILDINGS & 10-LEVEL VISUAL EVOLUTION
    // =========================================================================
    renderBuildings(ctx, city) {
      const buildings = city.buildings || [];

      // Sort buildings depth-first (x + y + size) so nearer structures overlap farther ones properly
      const sorted = [...buildings].sort((a, b) => {
        const specA = this.config.BUILDINGS[a.type] || { size: { w: 1, h: 1 } };
        const specB = this.config.BUILDINGS[b.type] || { size: { w: 1, h: 1 } };
        const depthA = a.x + a.y + (specA.size.w + specA.size.h);
        const depthB = b.x + b.y + (specB.size.w + specB.size.h);
        return depthA - depthB;
      });

      sorted.forEach(bld => {
        this.drawBuilding(ctx, bld, city);
      });
    }

    drawBuilding(ctx, bld, city) {
      const spec = this.config.BUILDINGS[bld.type];
      if (!spec) return;

      const size = spec.size || { w: 1, h: 1 };
      const iso = this.gridToIso(bld.x + size.w / 2, bld.y + size.h / 2);
      const isSelected = this.selectedBuildingId === bld.id;
      const level = bld.level || 1;

      // Selection indicator ring
      if (isSelected) {
        this.renderTileHighlight(ctx, bld.x, bld.y, 'rgba(0, 240, 255, 0.18)', '#00f0ff', size.w, size.h);
      }

      ctx.save();
      ctx.translate(iso.x, iso.y);

      // Building ground drop shadow
      ctx.beginPath();
      ctx.ellipse(0, 6, size.w * 26, size.h * 13, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
      ctx.fill();

      // Render architectural structure based on type & level
      switch (bld.type) {
        case 'city_hall':
          this.drawCityHall(ctx, level);
          break;
        case 'treasury':
          this.drawTreasury(ctx, level);
          break;
        case 'storage':
          this.drawStorage(ctx, level);
          break;
        case 'gold_mine':
          this.drawGoldExtractor(ctx, level);
          break;
        case 'lumber_yard':
          this.drawTimberWorks(ctx, level);
          break;
        case 'stone_quarry':
          this.drawStoneFoundry(ctx, level);
          break;
        case 'farm':
          this.drawFoodFarm(ctx, level);
          break;
        case 'marketplace':
          this.drawMarketplace(ctx, level);
          break;
        case 'research_center':
          this.drawResearchInstitute(ctx, level);
          break;
        case 'training_grounds':
          this.drawTrainingGrounds(ctx, level);
          break;
        case 'warrior_academy':
          this.drawWarriorAcademy(ctx, level);
          break;
        case 'unit_workshop':
          this.drawUnitWorkshop(ctx, level);
          break;
        case 'defensive_wall':
          this.drawDefensiveWall(ctx, bld, city);
          break;
        case 'watch_tower':
          this.drawWatchTower(ctx, level);
          break;
        case 'defense_cannon':
          this.drawDefenseCannon(ctx, level);
          break;
        case 'energy_tower':
          this.drawEnergyTower(ctx, level);
          break;
        case 'garden_fountain':
          this.drawFountain(ctx);
          break;
        case 'victory_statue':
          this.drawStatue(ctx);
          break;
        case 'guard_post':
          this.drawGuardPost(ctx);
          break;
        default:
          this.drawGenericBuilding(ctx, spec.name);
          break;
      }

      // Construction / Upgrade Scaffolding overlay
      if (bld.status && bld.status !== 'idle') {
        this.drawConstructionScaffold(ctx, bld);
      }

      // Floating Resource Bubble (for resource producers when idle)
      if (['gold_mine', 'lumber_yard', 'stone_quarry', 'farm'].includes(bld.type) && (!bld.status || bld.status === 'idle')) {
        this.drawResourceCollectionBubble(ctx, bld);
      }

      // Level Badge
      if (spec.maxLevel > 1) {
        this.drawLevelBadge(ctx, level, 0, -size.h * 28);
      }

      ctx.restore();
    }

    // --- ARCHITECTURE RENDERERS ---

    // 1. City Command Center (Levels 1 to 10)
    drawCityHall(ctx, level) {
      const tier = Math.min(5, Math.ceil(level / 2)); // 1 to 5

      // Base Podium
      ctx.fillStyle = tier >= 4 ? '#334155' : '#1e293b';
      ctx.fillRect(-42, -16, 84, 24);

      // Columns
      ctx.fillStyle = tier >= 3 ? '#94a3b8' : '#64748b';
      for (let i = -36; i <= 36; i += 18) {
        ctx.fillRect(i - 3, -32, 6, 18);
      }

      // Main Keep
      ctx.fillStyle = tier >= 5 ? '#0f172a' : '#1e293b';
      ctx.fillRect(-32, -44, 64, 20);

      // Grand Roof
      ctx.fillStyle = tier >= 4 ? '#b45309' : (tier >= 3 ? '#1e3a8a' : '#78350f');
      ctx.beginPath();
      ctx.moveTo(-44, -44);
      ctx.lineTo(0, -66);
      ctx.lineTo(44, -44);
      ctx.closePath();
      ctx.fill();

      // Clock / Sentry Tower
      if (tier >= 2) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(-12, -74, 24, 18);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(0, -65, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Fluttering Imperial Banners
      if (tier >= 3) {
        const flutter = Math.sin(this.animTick * 0.08) * 3;
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(-36, -44); ctx.lineTo(-36 + flutter, -52); ctx.lineTo(-36, -60);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(36, -44); ctx.lineTo(36 + flutter, -52); ctx.lineTo(36, -60);
        ctx.closePath();
        ctx.fill();
      }

      // Apex Wonder Radiant Crystal
      if (tier === 5) {
        const aura = (Math.sin(this.animTick * 0.08) + 1) / 2;
        ctx.beginPath();
        ctx.arc(0, -82, 7 + aura * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${0.4 + aura * 0.4})`;
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -82, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Treasury Vault (Levels 1 to 10)
    drawTreasury(ctx, level) {
      const tier = Math.min(5, Math.ceil(level / 2));

      // Fortified Vault Stone Base
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-36, -14, 72, 22);

      // Iron Rebar & Studs
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-32, -34, 64, 22);

      // Vault Round Blast Door
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(0, -22, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Gold Ingot Stacks outside
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-28, 0, 10, 5);
      ctx.fillRect(18, 0, 10, 5);
      if (tier >= 3) {
        ctx.fillRect(-26, -5, 8, 4);
        ctx.fillRect(20, -5, 8, 4);
      }

      // Tier 4-5 High-Security Turret
      if (tier >= 4) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-10, -48, 20, 14);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, -42, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Storage Depot (Levels 1 to 10)
    drawStorage(ctx, level) {
      const tier = Math.min(5, Math.ceil(level / 2));

      // Warehouse Sheds
      ctx.fillStyle = '#334155';
      ctx.fillRect(-36, -18, 72, 26);

      // Curved Corrugated Roof
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(0, -18, 36, Math.PI, 0);
      ctx.fill();

      // Wooden loading doors
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-14, -8, 28, 16);

      // Grain / Timber Sacks
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-30, 0, 8, 8);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(22, 0, 8, 8);

      // Additional Silos for Tier 3+
      if (tier >= 3) {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-42, -32, 10, 24);
        ctx.beginPath();
        ctx.arc(-37, -32, 5, Math.PI, 0);
        ctx.fill();
      }
    }

    // 4. Gold Extractor (Levels 1 to 10)
    drawGoldExtractor(ctx, level) {
      const tier = Math.min(5, Math.ceil(level / 2));

      // Mine Entry Shaft
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-16, -14, 32, 20);

      // Timber Pit Arch
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 3;
      ctx.strokeRect(-14, -14, 28, 20);

      // Pit Cave (Dark center)
      ctx.fillStyle = '#020617';
      ctx.fillRect(-10, -10, 20, 16);

      // Minecart & Track
      ctx.fillStyle = '#475569';
      ctx.fillRect(-18, 4, 36, 3);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(2, -2, 12, 8);

      // Gold Ore inside cart
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(4, -5, 8, 4);

      // Derrick Lift Beam for Tier 2+
      if (tier >= 2) {
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(0, -32);
        ctx.lineTo(8, -26);
        ctx.stroke();
      }

      // Steam chimney for Tier 4+
      if (tier >= 4) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(-14, -30, 6, 16);
      }
    }

    // 5. Timber Works (Levels 1 to 10)
    drawTimberWorks(ctx, level) {
      const tier = Math.min(5, Math.ceil(level / 2));

      // Wood Cabin
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-16, -14, 32, 18);

      // Thatch / Plank Roof
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.moveTo(-20, -14);
      ctx.lineTo(0, -28);
      ctx.lineTo(20, -14);
      ctx.closePath();
      ctx.fill();

      // Stacked Wood Logs
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-18, 4, 14, 6);
      ctx.fillRect(6, 4, 12, 6);

      // Rotating Saw Blade or Waterwheel
      const sawAngle = this.animTick * 0.08;
      ctx.save();
      ctx.translate(14, -4);
      ctx.rotate(sawAngle);
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 6. Stone Foundry (Levels 1 to 10)
    drawStoneFoundry(ctx, level) {
      const tier = Math.min(5, Math.ceil(level / 2));

      // Chiseled Granite Quarry Pit
      ctx.fillStyle = '#334155';
      ctx.fillRect(-18, -14, 36, 20);

      // Cut Ashlar Blocks
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-14, -6, 10, 8);
      ctx.fillRect(2, -4, 12, 8);

      // Crane Derrick
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(12, 4);
      ctx.lineTo(12, -32);
      ctx.lineTo(-4, -24);
      ctx.stroke();

      // Hanging boulder
      ctx.strokeStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(-4, -24);
      ctx.lineTo(-4, -14);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.fillRect(-7, -14, 7, 7);
    }

    // 7. Food Farm (Levels 1 to 10)
    drawFoodFarm(ctx, level) {
      const tier = Math.min(5, Math.ceil(level / 2));

      // Red Barn
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(-14, -14, 28, 18);

      // Barn Roof
      ctx.fillStyle = '#450a0a';
      ctx.beginPath();
      ctx.moveTo(-17, -14);
      ctx.lineTo(-8, -26);
      ctx.lineTo(8, -26);
      ctx.lineTo(17, -14);
      ctx.closePath();
      ctx.fill();

      // Golden Wheat Fields
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(-22, 2, 10, 6);
      ctx.fillRect(10, 2, 10, 6);

      // Windmill Sails (rotating with animTick)
      const angle = this.animTick * 0.04;
      ctx.save();
      ctx.translate(0, -22);
      ctx.rotate(angle);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-13, 0); ctx.lineTo(13, 0);
      ctx.moveTo(0, -13); ctx.lineTo(0, 13);
      ctx.stroke();
      ctx.restore();
    }

    // 8. Marketplace (Grand Bazaar)
    drawMarketplace(ctx, level) {
      // Stone Plaza
      ctx.fillStyle = '#334155';
      ctx.fillRect(-32, -12, 64, 20);

      // Striped Silk Bazaar Canopy
      const stripes = ['#ef4444', '#f8fafc', '#ef4444', '#f8fafc', '#ef4444'];
      const w = 56 / stripes.length;
      stripes.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(-28 + i * w, -34, w, 18);
      });

      // Roof Peaks
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(-28, -34);
      ctx.lineTo(0, -46);
      ctx.lineTo(28, -34);
      ctx.closePath();
      ctx.fill();

      // Wooden support poles
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-24, -16); ctx.lineTo(-24, 6);
      ctx.moveTo(24, -16); ctx.lineTo(24, 6);
      ctx.stroke();

      // Fruit & spice market baskets
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-12, -4, 6, 6);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(6, -4, 6, 6);
    }

    // 9. Research Institute (Academy of Science)
    drawResearchInstitute(ctx, level) {
      // Octagonal Science Base
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-28, -20, 56, 26);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.strokeRect(-28, -20, 56, 26);

      // Metallic Dome
      ctx.beginPath();
      ctx.arc(0, -20, 20, Math.PI, 0);
      ctx.fillStyle = '#312e81';
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Brass Telescope pointing skyward
      ctx.save();
      ctx.translate(2, -26);
      ctx.rotate(-0.65);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(0, -4, 28, 7);
      ctx.restore();

      // Pulsating magical energy core
      const glow = (Math.sin(this.animTick * 0.08) + 1) / 2;
      ctx.beginPath();
      ctx.arc(0, -20, 8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${0.4 + glow * 0.4})`;
      ctx.fill();
    }

    // 10. Training Grounds (Infantry Barracks)
    drawTrainingGrounds(ctx, level) {
      // Dirt & Gravel Arena
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-34, -14, 68, 24);

      // Barracks Bunkhouse
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-30, -32, 28, 20);
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(-34, -32); ctx.lineTo(-16, -44); ctx.lineTo(2, -32);
      ctx.closePath();
      ctx.fill();

      // Straw Combat Training Dummy
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(16, -18, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(13, -13, 6, 10);
      ctx.fillRect(8, -10, 16, 3); // Arms

      // Weapon Rack
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(4, 2); ctx.lineTo(4, -14);
      ctx.moveTo(8, 2); ctx.lineTo(8, -14);
      ctx.stroke();
    }

    // 11. Warrior Academy (Elite Champions)
    drawWarriorAcademy(ctx, level) {
      // Stone Sparring Dojo
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-34, -16, 68, 26);

      // Columns & Crests
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-30, -38, 60, 22);

      // Temple Arch
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(-34, -38); ctx.lineTo(0, -52); ctx.lineTo(34, -38);
      ctx.closePath();
      ctx.fill();

      // Crossed Broadswords Crest
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, -26); ctx.lineTo(8, -14);
      ctx.moveTo(8, -26); ctx.lineTo(-8, -14);
      ctx.stroke();
    }

    // 12. Unit Workshop (Siege Engineering)
    drawUnitWorkshop(ctx, level) {
      // Stone & Iron Machine Shed
      ctx.fillStyle = '#18181b';
      ctx.fillRect(-34, -16, 68, 26);

      // Smelting Chimney
      ctx.fillStyle = '#71717a';
      ctx.fillRect(16, -46, 12, 30);

      // Heavy Iron Anvil
      ctx.fillStyle = '#a1a1aa';
      ctx.fillRect(-10, -8, 20, 12);

      // Rotating Gear Wheel
      const angle = this.animTick * 0.05;
      ctx.save();
      ctx.translate(-20, -22);
      ctx.rotate(angle);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.strokeRect(-6, -6, 12, 12);
      ctx.restore();
    }

    // 13. Defensive Wall (Auto-connecting battlements)
    drawDefensiveWall(ctx, bld, city) {
      const level = bld.level || 1;
      const tier = Math.min(5, Math.ceil(level / 2));

      // Check adjacent walls (ortho neighbors)
      const blds = city.buildings || [];
      const hasN = blds.some(b => b.type === 'defensive_wall' && b.x === bld.x && b.y === bld.y - 1);
      const hasS = blds.some(b => b.type === 'defensive_wall' && b.x === bld.x && b.y === bld.y + 1);
      const hasW = blds.some(b => b.type === 'defensive_wall' && b.x === bld.x - 1 && b.y === bld.y);
      const hasE = blds.some(b => b.type === 'defensive_wall' && b.x === bld.x + 1 && b.y === bld.y);

      // Central Pillar
      ctx.fillStyle = tier >= 4 ? '#1e293b' : (tier >= 2 ? '#334155' : '#78350f');
      ctx.fillRect(-8, -18, 16, 22);

      // Crenelated Battlement Cap
      ctx.fillStyle = tier >= 4 ? '#0284c7' : '#475569';
      ctx.fillRect(-10, -24, 20, 6);

      // Connect North / South
      if (hasN || hasS) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(-6, -16, 12, 18);
      }
      // Connect West / East
      if (hasW || hasE) {
        ctx.fillStyle = '#475569';
        ctx.fillRect(-16, -14, 32, 14);
      }
    }

    // 14. Watch Tower (Levels 1 to 10)
    drawWatchTower(ctx, level) {
      const tier = Math.min(5, Math.ceil(level / 2));

      // Tower Stone Base
      ctx.fillStyle = tier >= 3 ? '#1e293b' : '#334155';
      ctx.fillRect(-10, -10, 20, 16);

      // Tall Sentry Shaft
      ctx.fillStyle = tier >= 4 ? '#0f172a' : '#475569';
      ctx.fillRect(-8, -42, 16, 32);

      // Archer Crow's Nest Platform
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-14, -50, 28, 8);

      // Piercing Arrow / Ballista on top
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, -54); ctx.lineTo(6, -54);
      ctx.moveTo(0, -58); ctx.lineTo(0, -50);
      ctx.stroke();

      // Guard archer silhouette
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(0, -56, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 15. Defense Cannon (Levels 1 to 10)
    drawDefenseCannon(ctx, level) {
      const tier = Math.min(5, Math.ceil(level / 2));

      // Heavy Stone Turret Base
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-28, -12, 56, 20);

      // Turret Turntable
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(0, -14, 18, 0, Math.PI * 2);
      ctx.fill();

      // Swivel Cannon Barrel pointing out
      ctx.save();
      ctx.translate(0, -16);
      ctx.rotate(-0.4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, -6, 28, 12);

      // Muzzle Band
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(24, -7, 4, 14);
      ctx.restore();

      // Cannonball Stacks
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-16, 0, 4, 0, Math.PI * 2);
      ctx.arc(-10, 0, 4, 0, Math.PI * 2);
      ctx.arc(-13, -5, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 16. Energy Tower (Levels 1 to 10)
    drawEnergyTower(ctx, level) {
      const tier = Math.min(5, Math.ceil(level / 2));

      // Hexagonal Arcane Pedestal
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-22, -14, 44, 20);

      // 3 Focusing Pylons
      ctx.fillStyle = '#312e81';
      ctx.fillRect(-18, -44, 6, 32);
      ctx.fillRect(12, -44, 6, 32);

      // Floating Center Energy Crystal (levitates with sine wave)
      const lev = Math.sin(this.animTick * 0.08) * 4;
      ctx.save();
      ctx.translate(0, -48 + lev);
      ctx.rotate(this.animTick * 0.03);

      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(8, 0);
      ctx.lineTo(0, 14);
      ctx.lineTo(-8, 0);
      ctx.closePath();
      ctx.fill();

      // Aura
      ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 17. Fountain
    drawFountain(ctx) {
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.ellipse(0, -1, 13, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Spouting Water jet
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -1); ctx.lineTo(0, -16);
      ctx.stroke();
    }

    // 18. Statue
    drawStatue(ctx) {
      ctx.fillStyle = '#475569';
      ctx.fillRect(-8, -10, 16, 12);

      // Bronze Hero
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-4, -28, 8, 18);
      ctx.beginPath();
      ctx.arc(0, -32, 4, 0, Math.PI * 2);
      ctx.fill();

      // Hero sword
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(4, -30); ctx.lineTo(12, -42);
      ctx.stroke();
    }

    // 19. Guard Post
    drawGuardPost(ctx) {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-8, -16, 16, 20);

      // Banner Pole
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, 4); ctx.lineTo(10, -30);
      ctx.stroke();

      // Fluttering Red Banner
      const f = Math.sin(this.animTick * 0.08) * 3;
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(10, -30); ctx.lineTo(20 + f, -24); ctx.lineTo(10, -18);
      ctx.closePath();
      ctx.fill();
    }

    drawGenericBuilding(ctx, name) {
      ctx.fillStyle = '#334155';
      ctx.fillRect(-20, -20, 40, 24);
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(-24, -20); ctx.lineTo(0, -36); ctx.lineTo(24, -20); ctx.closePath();
      ctx.fill();
    }

    // =========================================================================
    // 4. FLOATING RESOURCE COLLECTION BUBBLE
    // =========================================================================
    drawResourceCollectionBubble(ctx, bld) {
      const iconMap = {
        gold_mine: '🪙',
        lumber_yard: '🪵',
        stone_quarry: '🪨',
        farm: '🌾'
      };
      const icon = iconMap[bld.type] || '✨';
      const bob = Math.sin(this.animTick * 0.07 + (bld.x * 5)) * 4;

      const yPos = -46 + bob;

      // Outer Glowing Bubble
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, yPos, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(14, 165, 233, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Resource Emoji Icon
      ctx.font = '15px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(icon, 0, yPos);

      ctx.restore();
    }

    // =========================================================================
    // 5. SCAFFOLDING & LEVEL BADGES
    // =========================================================================
    drawConstructionScaffold(ctx, bld) {
      // Yellow hazard scaffolding
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-26, -44, 52, 48);

      ctx.beginPath();
      ctx.moveTo(-26, -44); ctx.lineTo(26, 4);
      ctx.moveTo(26, -44); ctx.lineTo(-26, 4);
      ctx.stroke();

      // Progress bar
      const now = Date.now();
      const spec = this.config.BUILDINGS[bld.type];
      const levelSpec = spec.levels[bld.level ? bld.level - 1 : 0] || spec.levels[0];
      const totalDuration = (levelSpec.time || 10) * 1000;
      const remaining = Math.max(0, (bld.finishTime || now) - now);
      const progress = Math.min(1.0, Math.max(0, 1 - remaining / totalDuration));

      // Bar container
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(-26, -56, 52, 8);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1;
      ctx.strokeRect(-26, -56, 52, 8);

      // Progress fill
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(-24, -54, 48 * progress, 4);
    }

    drawLevelBadge(ctx, level, x, y) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(level || 1, x, y);
    }

    // =========================================================================
    // 6. CITIZENS & LIFE ANIMATIONS
    // =========================================================================
    renderCitizens(ctx) {
      this.citizens.forEach(c => {
        const curIso = this.gridToIso(c.x, c.y);
        const tgtIso = this.gridToIso(c.targetX, c.targetY);

        const x = curIso.x + (tgtIso.x - curIso.x) * c.progress;
        const y = curIso.y + (tgtIso.y - curIso.y) * c.progress;

        const bob = Math.abs(Math.sin(this.animTick * 0.25)) * 3;

        ctx.save();
        ctx.translate(x, y - bob);

        // Citizen shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 2 + bob, 4, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Clothes color by role
        const roleColors = {
          builder: '#f59e0b',
          farmer: '#84cc16',
          merchant: '#06b6d4',
          guard: '#ef4444'
        };
        ctx.fillStyle = roleColors[c.role] || '#ffffff';
        ctx.fillRect(-2, -8, 4, 6);

        // Head
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(0, -10, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    }

    // =========================================================================
    // 7. PLACEMENT GHOST PREVIEW
    // =========================================================================
    renderPlacementPreview(ctx, city) {
      const mode = this.placementMode;
      const spec = this.config.BUILDINGS[mode.type];
      if (!spec) return;

      const size = spec.size || { w: 1, h: 1 };
      const fill = mode.isValid ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.45)';
      const stroke = mode.isValid ? '#22c55e' : '#ef4444';

      this.renderTileHighlight(ctx, mode.x, mode.y, fill, stroke, size.w, size.h);

      // Ghost structure representation
      const iso = this.gridToIso(mode.x + size.w / 2, mode.y + size.h / 2);
      ctx.save();
      ctx.translate(iso.x, iso.y);
      ctx.globalAlpha = 0.65;
      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(spec.icon, 0, -22);
      ctx.restore();
    }

    // =========================================================================
    // 8. REAL-TIME BATTLE ENTITIES
    // =========================================================================
    renderBattleEntities(ctx) {
      const b = this.battleMode;
      if (!b) return;

      // 1. Render deployed troops
      (b.units || []).forEach(u => {
        if (u.hp <= 0) return;
        const iso = this.gridToIso(u.x, u.y);
        ctx.save();
        ctx.translate(iso.x, iso.y);

        // Unit shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 2, 7, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Unit Sprite Icon
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(u.spec.icon, 0, -12);

        // Small Health Bar
        const hpPercent = Math.max(0, u.hp / u.maxHp);
        ctx.fillStyle = '#000000';
        ctx.fillRect(-10, -24, 20, 3);
        ctx.fillStyle = hpPercent > 0.4 ? '#22c55e' : '#ef4444';
        ctx.fillRect(-10, -24, 20 * hpPercent, 3);

        ctx.restore();
      });

      // 2. Render Projectiles (arrows, cannon shells, laser beams)
      (b.projectiles || []).forEach(p => {
        ctx.save();
        if (p.type === 'arrow') {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
          ctx.stroke();
        } else if (p.type === 'cannon') {
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'laser') {
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(p.startX, p.startY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
        ctx.restore();
      });
    }

    // =========================================================================
    // 9. PARTICLES & FLYING LOOT
    // =========================================================================
    renderParticles(ctx) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];

        if (p.type === 'smoke') {
          p.x += p.vx;
          p.y += p.vy;
          p.radius += 0.08;
          p.alpha -= 0.012;
          p.life--;

          if (p.life <= 0 || p.alpha <= 0) {
            this.particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.fillStyle = `rgba(203, 213, 225, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Floating Text
          p.y += p.vy;
          p.alpha -= 0.016;
          p.life--;

          if (p.life <= 0 || p.alpha <= 0) {
            this.particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.font = 'bold 13px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.85)';
          ctx.shadowBlur = 4;
          ctx.fillText(p.text, p.x, p.y);
          ctx.restore();
        }
      }
    }

    renderFlyingLoot(ctx) {
      for (let i = this.flyingLoot.length - 1; i >= 0; i--) {
        const item = this.flyingLoot[i];
        item.progress += item.speed;

        // Screen space interpolation
        // Start position in screen coords
        const startScreenX = item.startX * this.camera.zoom + this.camera.x;
        const startScreenY = item.startY * this.camera.zoom + this.camera.y;

        const curX = startScreenX + (item.targetScreenX - startScreenX) * item.progress;
        const curY = startScreenY + (item.targetScreenY - startScreenY) * item.progress;

        ctx.save();
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.fillText(item.icon, curX, curY);
        ctx.restore();

        if (item.progress >= 1.0) {
          this.flyingLoot.splice(i, 1);
        }
      }
    }

    renderVignette(ctx) {
      const grad = ctx.createRadialGradient(
        this.viewWidth / 2, this.viewHeight / 2, Math.min(this.viewWidth, this.viewHeight) * 0.45,
        this.viewWidth / 2, this.viewHeight / 2, Math.max(this.viewWidth, this.viewHeight) * 0.85
      );
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, 'rgba(4, 6, 12, 0.7)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);
    }
  }

  exports.CityRenderer = CityRenderer;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.CityRenderer = {}));
