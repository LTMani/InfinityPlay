/**
 * InfinityPlay - City Builder V2 Comprehensive Isometric Canvas Renderer
 * 60 FPS 2.5D isometric projection, rich procedural architecture (Levels 1-10),
 * living citizens, ambient smoke, environmental flora, tactical battle visualizer, and camera bounds.
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

      // Camera state with smooth clamping bounds
      this.camera = {
        x: 0,
        y: 0,
        zoom: 1.0,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        lastMouseX: 0,
        lastMouseY: 0
      };

      // Hover and selection
      this.hoverTile = null; // { x, y }
      this.selectedBuildingId = null;

      // Placement preview
      this.placementMode = null; // { type, isValid, x, y }

      // Battle mode
      this.battleMode = null; // Active battle instance

      // Visual simulation state
      this.particles = [];
      this.smokeParticles = [];
      this.citizens = [];
      this.animTick = 0;

      // Environment props (procedurally generated trees, rocks, flowers outside main grid)
      this.envProps = this.generateEnvironmentProps();

      this.setupCanvas();
      this.initCitizens();
    }

    setupCanvas() {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas || !this.canvas.parentElement) return;
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.scale(dpr, dpr);
      this.viewWidth = rect.width;
      this.viewHeight = rect.height;
    }

    centerOn(gridX = 10, gridY = 10) {
      const iso = this.gridToIso(gridX, gridY);
      this.camera.x = this.viewWidth / 2 - iso.x * this.camera.zoom;
      this.camera.y = this.viewHeight / 2 - iso.y * this.camera.zoom - 40;
      this.clampCamera();
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

    clampCamera() {
      const size = this.config.GRID_SIZE || 20;
      const maxDist = size * this.tileW * 0.9;

      const worldCenterX = (this.viewWidth / 2 - this.camera.x) / this.camera.zoom;
      const worldCenterY = (this.viewHeight / 2 - this.camera.y) / this.camera.zoom;

      const clampedX = Math.max(-maxDist, Math.min(maxDist, worldCenterX));
      const clampedY = Math.max(-200, Math.min(size * this.tileH + 300, worldCenterY));

      this.camera.x = this.viewWidth / 2 - clampedX * this.camera.zoom;
      this.camera.y = this.viewHeight / 2 - clampedY * this.camera.zoom;
    }

    // Initialize walking villagers and patrol guards
    initCitizens() {
      const citizenTypes = ['villager', 'miner', 'lumberjack', 'guard'];
      for (let i = 0; i < 8; i++) {
        const isRoadX = Math.random() > 0.5;
        this.citizens.push({
          id: i,
          type: citizenTypes[i % citizenTypes.length],
          gx: isRoadX ? 10 : Math.floor(6 + Math.random() * 8),
          gy: isRoadX ? Math.floor(6 + Math.random() * 8) : 10,
          targetGx: isRoadX ? 10 : Math.floor(6 + Math.random() * 8),
          targetGy: isRoadX ? Math.floor(6 + Math.random() * 8) : 10,
          progress: Math.random(),
          speed: 0.008 + Math.random() * 0.006,
          facing: 'se',
          idleTicks: 0
        });
      }
    }

    generateEnvironmentProps() {
      const props = [];
      const size = this.config.GRID_SIZE || 20;

      // Outer boundary trees and natural boulders
      for (let i = -3; i <= size + 3; i++) {
        for (let j = -3; j <= size + 3; j++) {
          const isInsidePlayfield = (i >= 0 && i < size && j >= 0 && j < size);
          if (!isInsidePlayfield) {
            const seed = (Math.sin(i * 12.9898 + j * 78.233) * 43758.5453) % 1;
            if (seed > 0.45) {
              props.push({
                x: i,
                y: j,
                type: seed > 0.85 ? 'rock' : (seed > 0.65 ? 'pine' : 'oak'),
                scale: 0.8 + Math.abs(seed) * 0.4,
                seed: seed * 100
              });
            }
          }
        }
      }
      return props;
    }

    addFloater(text, gridX, gridY, color = '#fbbf24') {
      const iso = this.gridToIso(gridX + 0.5, gridY + 0.5);
      this.particles.push({
        text,
        x: iso.x,
        y: iso.y - 30,
        vy: -1.2,
        alpha: 1.0,
        color,
        life: 60
      });
    }

    addSmoke(gridX, gridY, color = 'rgba(200, 210, 220, 0.4)') {
      const iso = this.gridToIso(gridX + 0.5, gridY + 0.5);
      this.smokeParticles.push({
        x: iso.x + (Math.random() - 0.5) * 8,
        y: iso.y - 45,
        vx: (Math.random() - 0.3) * 0.4,
        vy: -0.6 - Math.random() * 0.4,
        radius: 3 + Math.random() * 3,
        alpha: 0.6,
        color
      });
    }

    // =========================================================================
    // MAIN RENDER LOOP
    // =========================================================================
    render(city) {
      if (!city) return;
      this.animTick++;

      const ctx = this.ctx;
      ctx.save();
      ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);

      // 1. Atmospheric Sky / Environment Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, this.viewHeight);
      bgGrad.addColorStop(0, '#040711');
      bgGrad.addColorStop(0.45, '#091024');
      bgGrad.addColorStop(1, '#050a16');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);

      // Camera transformation
      ctx.save();
      ctx.translate(this.camera.x, this.camera.y);
      ctx.scale(this.camera.zoom, this.camera.zoom);

      // If active battle mode, render the tactical battlefield instead of peacetime city
      if (this.battleMode && this.battleMode.active) {
        this.renderBattleField(ctx);
        ctx.restore();
        this.renderVignette(ctx);
        ctx.restore();
        return;
      }

      // 2. Render Outer Natural Environment (Wild trees & rocks)
      this.renderEnvironmentProps(ctx, true); // Background props (y <= 0)

      // 3. Render Terrain Grid Tiles
      this.renderTerrain(ctx);

      // 4. Render Foreground Environmental Props
      this.renderEnvironmentProps(ctx, false); // Foreground props

      // 5. Render Tile Hover / Range Highlight
      if (this.hoverTile && !this.placementMode) {
        this.renderTileHighlight(ctx, this.hoverTile.x, this.hoverTile.y, 'rgba(0, 240, 255, 0.25)', '#00f0ff');
      }

      // 6. Render Walking Citizens
      this.updateAndRenderCitizens(ctx);

      // 7. Render Buildings in depth-sorted order (x + y)
      this.renderBuildings(ctx, city);

      // 8. Render Placement Preview if in placement mode
      if (this.placementMode) {
        this.renderPlacementPreview(ctx, city);
      }

      // 9. Render Smoke & Floating Particle indicators
      this.renderSmoke(ctx);
      this.renderParticles(ctx);

      ctx.restore(); // Restore camera transform

      // 10. Vignette overlay on screen
      this.renderVignette(ctx);

      ctx.restore();
    }

    // =========================================================================
    // TERRAIN RENDERING
    // =========================================================================
    renderTerrain(ctx) {
      const size = this.config.GRID_SIZE || 20;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const iso = this.gridToIso(x, y);

          // Water canal on right flank (x >= 17, 3 <= y <= 16)
          const isWater = (x >= 17 && y >= 3 && y <= 16);
          // Main central crossroads (x=10, y=10) and paved plaza
          const isRoad = (x === 10 || y === 10 || (x >= 8 && x <= 11 && y >= 8 && y <= 11));

          if (isWater) {
            this.drawWaterTile(ctx, iso.x, iso.y, x, y);
          } else if (isRoad) {
            this.drawRoadTile(ctx, iso.x, iso.y, x, y);
          } else {
            this.drawGrassTile(ctx, iso.x, iso.y, x, y);
          }
        }
      }
    }

    drawGrassTile(ctx, x, y, gx, gy) {
      const hw = this.tileW / 2;
      const hh = this.tileH / 2;

      ctx.beginPath();
      ctx.moveTo(x, y - hh);
      ctx.lineTo(x + hw, y);
      ctx.lineTo(x, y + hh);
      ctx.lineTo(x - hw, y);
      ctx.closePath();

      // Checkerboard grass with natural biome tinting
      const isAlt = (gx + gy) % 2 === 0;
      ctx.fillStyle = isAlt ? '#13351b' : '#173f21';
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Occasional decorative wildflower tufts
      const flowerHash = (gx * 37 + gy * 73) % 19;
      if (flowerHash === 3) {
        ctx.fillStyle = '#fde047';
        ctx.fillRect(x - 3, y - 2, 2, 2);
        ctx.fillRect(x + 2, y + 1, 2, 2);
      } else if (flowerHash === 7) {
        ctx.fillStyle = '#f472b6';
        ctx.fillRect(x, y - 1, 2, 2);
      }
    }

    drawRoadTile(ctx, x, y, gx, gy) {
      const hw = this.tileW / 2;
      const hh = this.tileH / 2;

      ctx.beginPath();
      ctx.moveTo(x, y - hh);
      ctx.lineTo(x + hw, y);
      ctx.lineTo(x, y + hh);
      ctx.lineTo(x - hw, y);
      ctx.closePath();

      ctx.fillStyle = '#222838';
      ctx.fill();

      // Cobblestone border
      ctx.strokeStyle = '#333e56';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Cobblestone paver textures
      ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.fillRect(x - 4, y - 3, 3, 2);
      ctx.fillRect(x + 2, y + 1, 3, 2);
      ctx.fillRect(x - 1, y - 1, 2, 3);
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

      // Animated flowing waves
      const waveShift = Math.sin((gx + gy + this.animTick * 0.06)) * 0.12;
      ctx.fillStyle = `rgba(12, 98, 138, ${0.8 + waveShift})`;
      ctx.fill();

      // Shimmering water crest line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Water reflection sparkle
      const sparkle = (Math.sin(this.animTick * 0.1 + gx) + 1) / 2;
      if (sparkle > 0.75) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(x + Math.sin(gx) * 8, y + Math.cos(gy) * 4, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // =========================================================================
    // NATURAL FLORA & ROCKS (WILD ENVIRONMENT)
    // =========================================================================
    renderEnvironmentProps(ctx, backgroundOnly = true) {
      const wind = Math.sin(this.animTick * 0.04) * 2.5;

      for (const prop of this.envProps) {
        const isBack = prop.y <= 10;
        if (backgroundOnly !== isBack) continue;

        const iso = this.gridToIso(prop.x, prop.y);
        ctx.save();
        ctx.translate(iso.x, iso.y);

        if (prop.type === 'pine') {
          // Pine tree with wind sway
          ctx.fillStyle = '#1e3a24';
          ctx.beginPath();
          ctx.moveTo(0 + wind * 0.6, -42);
          ctx.lineTo(14, -8);
          ctx.lineTo(-14, -8);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#2d5a37';
          ctx.beginPath();
          ctx.moveTo(0 + wind * 0.4, -32);
          ctx.lineTo(12, -4);
          ctx.lineTo(-12, -4);
          ctx.closePath();
          ctx.fill();

          // Trunk
          ctx.fillStyle = '#451a03';
          ctx.fillRect(-2, -4, 4, 8);
        } else if (prop.type === 'oak') {
          // Lush leafy oak
          ctx.fillStyle = '#3f2212';
          ctx.fillRect(-3, -8, 6, 12);

          ctx.fillStyle = '#166534';
          ctx.beginPath();
          ctx.arc(0 + wind * 0.5, -22, 14, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(-4 + wind * 0.7, -25, 9, 0, Math.PI * 2);
          ctx.fill();
        } else if (prop.type === 'rock') {
          // Granite boulder
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.ellipse(0, -4, 9, 6, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    // =========================================================================
    // CITIZENS & WORKERS
    // =========================================================================
    updateAndRenderCitizens(ctx) {
      for (const c of this.citizens) {
        if (c.idleTicks > 0) {
          c.idleTicks--;
        } else {
          c.progress += c.speed;
          if (c.progress >= 1.0) {
            c.progress = 0;
            c.gx = c.targetGx;
            c.gy = c.targetGy;

            // Pick next street junction
            const isRoadX = Math.random() > 0.5;
            c.targetGx = isRoadX ? 10 : Math.floor(6 + Math.random() * 8);
            c.targetGy = isRoadX ? Math.floor(6 + Math.random() * 8) : 10;
            c.idleTicks = Math.floor(20 + Math.random() * 40);
          }
        }

        // Interpolate grid position
        const curX = c.gx + (c.targetGx - c.gx) * c.progress;
        const curY = c.gy + (c.targetGy - c.gy) * c.progress;
        const iso = this.gridToIso(curX, curY);

        const bob = Math.abs(Math.sin(this.animTick * 0.25)) * 2;

        ctx.save();
        ctx.translate(iso.x, iso.y - bob);

        // Citizen shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 2, 4, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        if (c.type === 'guard') {
          // Guard: Helm, blue tunic, spear
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(-2, -10, 4, 6);
          ctx.fillStyle = '#e2e8f0'; // Helmet
          ctx.beginPath();
          ctx.arc(0, -12, 2.5, 0, Math.PI * 2);
          ctx.fill();
          // Spear
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(3, -2); ctx.lineTo(3, -16);
          ctx.stroke();
        } else if (c.type === 'miner') {
          // Miner: Orange vest & pickaxe
          ctx.fillStyle = '#f97316';
          ctx.fillRect(-2, -9, 4, 6);
          ctx.fillStyle = '#fed7aa';
          ctx.beginPath();
          ctx.arc(0, -11, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Villager in green/brown tunic
          ctx.fillStyle = c.id % 2 === 0 ? '#15803d' : '#854d0e';
          ctx.fillRect(-2, -9, 4, 6);
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(0, -11, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // =========================================================================
    // SMOKE & PARTICLES
    // =========================================================================
    renderSmoke(ctx) {
      for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
        const p = this.smokeParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.radius += 0.12;
        p.alpha -= 0.008;

        if (p.alpha <= 0) {
          this.smokeParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    renderParticles(ctx) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.y += p.vy;
        p.alpha -= 0.018;
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
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 4;
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
      }
    }

    renderVignette(ctx) {
      const grad = ctx.createRadialGradient(
        this.viewWidth / 2, this.viewHeight / 2, Math.min(this.viewWidth, this.viewHeight) * 0.4,
        this.viewWidth / 2, this.viewHeight / 2, Math.max(this.viewWidth, this.viewHeight) * 0.85
      );
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, 'rgba(3, 5, 11, 0.7)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);
    }

    // =========================================================================
    // BUILDINGS RENDERING & PROCEDURAL ARCHITECTURE
    // =========================================================================
    renderBuildings(ctx, city) {
      if (!city || !city.buildings) return;

      // Depth sort by isometric distance (x + y + size offset)
      const sorted = [...city.buildings].sort((a, b) => {
        const aSpec = this.config.BUILDINGS[a.type] || { size: { w: 1, h: 1 } };
        const bSpec = this.config.BUILDINGS[b.type] || { size: { w: 1, h: 1 } };
        return (a.x + a.y + (aSpec.size.w + aSpec.size.h) * 0.5) - (b.x + b.y + (bSpec.size.w + bSpec.size.h) * 0.5);
      });

      for (const bld of sorted) {
        this.drawBuilding(ctx, bld);
      }
    }

    drawBuilding(ctx, bld) {
      const spec = this.config.BUILDINGS[bld.type];
      if (!spec) return;

      const size = spec.size || { w: 1, h: 1 };
      const centerGridX = bld.x + size.w / 2;
      const centerGridY = bld.y + size.h / 2;
      const iso = this.gridToIso(centerGridX, centerGridY);

      // Periodically spawn smoke from active production buildings
      if (this.animTick % 30 === 0 && ['gold_mine', 'lumber_yard', 'stone_quarry', 'unit_workshop'].includes(bld.type)) {
        this.addSmoke(centerGridX, centerGridY);
      }

      ctx.save();
      ctx.translate(iso.x, iso.y);

      // 1. Building Ground Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 6, size.w * 24, size.h * 13, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Selection Ring if selected
      const isSelected = this.selectedBuildingId === bld.id;
      if (isSelected) {
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, 6, size.w * 27, size.h * 15, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Draw defense range ring if defense structure
        const curLevelSpec = spec.levels ? spec.levels[Math.min(bld.level - 1, spec.levels.length - 1)] : null;
        if (curLevelSpec && curLevelSpec.range) {
          this.drawRangeRing(ctx, curLevelSpec.range);
        }
      }

      // 3. Dispatch specific building drawing method
      switch (bld.type) {
        case 'city_hall':
          this.drawCityHall(ctx, bld.level);
          break;
        case 'treasury':
          this.drawTreasury(ctx, bld.level);
          break;
        case 'storage':
          this.drawStorage(ctx, bld.level);
          break;
        case 'gold_mine':
          this.drawGoldMine(ctx, bld.level);
          break;
        case 'lumber_yard':
          this.drawLumberYard(ctx, bld.level);
          break;
        case 'stone_quarry':
          this.drawStoneQuarry(ctx, bld.level);
          break;
        case 'farm':
          this.drawFarm(ctx, bld.level);
          break;
        case 'marketplace':
          this.drawMarketplace(ctx, bld.level);
          break;
        case 'research_center':
          this.drawResearchCenter(ctx, bld.level);
          break;
        case 'training_grounds':
          this.drawTrainingGrounds(ctx, bld.level);
          break;
        case 'warrior_academy':
          this.drawWarriorAcademy(ctx, bld.level);
          break;
        case 'unit_workshop':
          this.drawUnitWorkshop(ctx, bld.level);
          break;
        case 'watch_tower':
          this.drawWatchTower(ctx, bld.level);
          break;
        case 'defense_cannon':
          this.drawDefenseCannon(ctx, bld.level);
          break;
        case 'energy_tower':
          this.drawEnergyTower(ctx, bld.level);
          break;
        case 'defense_wall':
          this.drawDefenseWall(ctx, bld.level);
          break;
        case 'hero_statue':
          this.drawHeroStatue(ctx, bld.level);
          break;
        case 'crystal_fountain':
          this.drawCrystalFountain(ctx, bld.level);
          break;
        default:
          this.drawGenericBuilding(ctx, spec.name);
          break;
      }

      // 4. Construction / Upgrade Scaffolding Overlay
      if (bld.status && bld.status !== 'idle') {
        this.drawConstructionScaffold(ctx, bld);
      }

      // 5. Building Level Badge
      this.drawLevelBadge(ctx, bld.level, 0, -58);

      // 6. Floating Resource Harvest Bubble if production building has accrued resources
      if (['gold_mine', 'lumber_yard', 'stone_quarry', 'farm'].includes(bld.type)) {
        this.drawHarvestBubble(ctx, bld.type, 0, -82);
      }

      ctx.restore();
    }

    // =========================================================================
    // PROCEDURAL BUILDING ARCHITECTURES (LEVELS 1 - 10)
    // =========================================================================

    // 1. City Hall: Town Hall -> Stone Capitol -> Sovereign Citadel -> Apex Wonder
    drawCityHall(ctx, level = 1) {
      const tier = level >= 8 ? 4 : (level >= 5 ? 3 : (level >= 3 ? 2 : 1));

      // Base Podium
      ctx.fillStyle = tier >= 3 ? '#0f172a' : '#1e293b';
      ctx.fillRect(-38, -14, 76, 22);

      // Columns (Pillars)
      const columnCount = tier >= 3 ? 6 : 4;
      ctx.fillStyle = tier >= 4 ? '#38bdf8' : (tier >= 3 ? '#94a3b8' : '#475569');
      for (let i = 0; i < columnCount; i++) {
        const cx = -28 + (i * (56 / (columnCount - 1)));
        ctx.fillRect(cx - 2, -34, 4, 20);
      }

      // Pediment / Triangular Architrave
      ctx.beginPath();
      ctx.moveTo(-42, -34);
      ctx.lineTo(0, tier >= 3 ? -62 : -54);
      ctx.lineTo(42, -34);
      ctx.closePath();
      ctx.fillStyle = tier >= 4 ? '#0284c7' : (tier >= 3 ? '#1e3a8a' : '#0369a1');
      ctx.fill();
      ctx.strokeStyle = tier >= 4 ? '#38bdf8' : '#60a5fa';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Central Clock Tower / Spire
      if (tier >= 2) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-14, -80, 28, 26);
        ctx.beginPath();
        ctx.arc(0, -68, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();

        // Gilded Dome / Apex Spire
        ctx.beginPath();
        ctx.moveTo(-16, -80);
        ctx.lineTo(0, tier >= 4 ? -112 : -100);
        ctx.lineTo(16, -80);
        ctx.closePath();
        ctx.fillStyle = tier >= 4 ? '#f59e0b' : '#d97706';
        ctx.fill();
      }

      // Fluttering Imperial Flag
      const flagWave = Math.sin(this.animTick * 0.1) * 3;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, tier >= 4 ? -112 : (tier >= 2 ? -100 : -60));
      ctx.lineTo(0, tier >= 4 ? -124 : (tier >= 2 ? -112 : -72));
      ctx.stroke();

      ctx.fillStyle = tier >= 4 ? '#ec4899' : '#00f0ff';
      ctx.beginPath();
      const flagTop = tier >= 4 ? -124 : (tier >= 2 ? -112 : -72);
      ctx.moveTo(0, flagTop);
      ctx.lineTo(12 + flagWave, flagTop + 4);
      ctx.lineTo(0, flagTop + 8);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Treasury: Vault -> Fortified Strongroom -> Gilded Treasury Fortress
    drawTreasury(ctx, level = 1) {
      const tier = level >= 6 ? 3 : (level >= 3 ? 2 : 1);

      // Solid Vault Block
      ctx.fillStyle = tier >= 3 ? '#1e1b4b' : '#1e293b';
      ctx.fillRect(-30, -18, 60, 28);
      ctx.strokeStyle = tier >= 3 ? '#a855f7' : '#eab308';
      ctx.lineWidth = 2;
      ctx.strokeRect(-30, -18, 60, 28);

      // Massive Round Steel Vault Door
      ctx.beginPath();
      ctx.arc(0, -4, 13, 0, Math.PI * 2);
      ctx.fillStyle = tier >= 3 ? '#7c3aed' : '#ca8a04';
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Vault Spoke Wheel
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, -4); ctx.lineTo(6, -4);
      ctx.moveTo(0, -10); ctx.lineTo(0, 2);
      ctx.stroke();

      // Gold bullion bars on side
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(16, 2, 10, 4);
      ctx.fillRect(18, -2, 8, 4);
    }

    // 3. Storage Depot: Warehouses, Silos & Gantry
    drawStorage(ctx, level = 1) {
      // Main Warehouse Body
      ctx.fillStyle = '#334155';
      ctx.fillRect(-32, -16, 44, 26);
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(-36, -16); ctx.lineTo(-10, -32); ctx.lineTo(16, -16); ctx.closePath();
      ctx.fill();

      // Tall Grain / Resource Silo
      ctx.fillStyle = '#64748b';
      ctx.fillRect(14, -30, 18, 40);
      ctx.beginPath();
      ctx.arc(23, -30, 9, Math.PI, 0);
      ctx.fillStyle = '#94a3b8';
      ctx.fill();

      // Loading bay door
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-22, -4, 14, 14);
    }

    // 4. Gold Mine: Minecart Track & Shaft Entrance
    drawGoldMine(ctx, level = 1) {
      // Rocky hill mound
      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.ellipse(0, 2, 28, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Mine entrance tunnel
      ctx.fillStyle = '#0c0a09';
      ctx.beginPath();
      ctx.arc(0, -4, 14, Math.PI, 0);
      ctx.fill();

      // Wooden support timber frame
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Minecart with golden nuggets
      ctx.fillStyle = '#44403c';
      ctx.fillRect(-7, 0, 14, 8);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(-2, 0, 3, 0, Math.PI * 2);
      ctx.arc(2, -1, 3, 0, Math.PI * 2);
      ctx.fill();

      // Winch tower (Level 3+)
      if (level >= 3) {
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-10, -18); ctx.lineTo(0, -36); ctx.lineTo(10, -18);
        ctx.stroke();
        // Spinning pulley wheel
        ctx.beginPath();
        ctx.arc(0, -36, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
      }
    }

    // 5. Lumber Yard: Log Cabin, Sawmill & Turning Saw
    drawLumberYard(ctx, level = 1) {
      // Wood cabin body
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-22, -14, 26, 22);

      // Pitched A-frame roof
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.moveTo(-26, -14); ctx.lineTo(-9, -30); ctx.lineTo(8, -14); ctx.closePath();
      ctx.fill();

      // Stacked timber logs
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.ellipse(14, 0, 8, 4, 0, 0, Math.PI * 2);
      ctx.ellipse(14, -5, 7, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rotating circular buzz saw
      const sawAngle = this.animTick * 0.2;
      ctx.save();
      ctx.translate(14, -14);
      ctx.rotate(sawAngle);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 6. Stone Quarry: Open Pit, Excavation Derrick & Crane
    drawStoneQuarry(ctx, level = 1) {
      // Stone pit depression
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(0, 4, 26, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Carved stone blocks
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-16, -2, 10, 8);
      ctx.fillRect(-4, 0, 9, 7);

      // Wooden derrick crane with hoisting cable
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(8, 2); ctx.lineTo(16, -32); ctx.lineTo(2, -32);
      ctx.stroke();

      // Cable and lifted block
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(2, -32); ctx.lineTo(2, -18);
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(0, -18, 5, 5);
    }

    // 7. Agricultural Farm: Barn, Wheat Furrows & Turning Windmill
    drawFarm(ctx, level = 1) {
      // Red barn body
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(-24, -12, 28, 20);

      // White X barn door
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-18, -4, 10, 12);
      ctx.beginPath();
      ctx.moveTo(-18, -4); ctx.lineTo(-8, 8);
      ctx.moveTo(-8, -4); ctx.lineTo(-18, 8);
      ctx.stroke();

      // White Gambrel barn roof
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(-26, -12); ctx.lineTo(-10, -28); ctx.lineTo(6, -12); ctx.closePath();
      ctx.fill();

      // Windmill tower & turning sail blades
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(10, -26, 12, 34);

      const bladeAngle = this.animTick * 0.05;
      ctx.save();
      ctx.translate(16, -26);
      ctx.rotate(bladeAngle);
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-14, 0); ctx.lineTo(14, 0);
      ctx.moveTo(0, -14); ctx.lineTo(0, 14);
      ctx.stroke();
      ctx.restore();
    }

    // 8. Grand Bazaar Marketplace: Canopied Pavilion & Trade Scales
    drawMarketplace(ctx, level = 1) {
      // Striped colored awnings
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-24, -14, 48, 22);

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-24, -14, 12, 22);
      ctx.fillRect(0, -14, 12, 22);

      // Roof Canopy
      ctx.beginPath();
      ctx.moveTo(-28, -14); ctx.lineTo(0, -32); ctx.lineTo(28, -14); ctx.closePath();
      ctx.fillStyle = '#0284c7';
      ctx.fill();

      // Brass balance scales on roof
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -32); ctx.lineTo(0, -42);
      ctx.moveTo(-8, -38); ctx.lineTo(8, -38);
      ctx.stroke();
    }

    // 9. Academy of Science: Observatory Dome & Telescope
    drawResearchCenter(ctx, level = 1) {
      // Academy Stone Base
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-28, -18, 56, 26);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.strokeRect(-28, -18, 56, 26);

      // Metallic Dome
      ctx.beginPath();
      ctx.arc(0, -18, 18, Math.PI, 0);
      ctx.fillStyle = '#312e81';
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Brass Telescope pointing skyward
      ctx.save();
      ctx.translate(2, -24);
      ctx.rotate(-0.65);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(0, -3, 26, 6);
      ctx.restore();

      // Pulsating magical energy glow
      const glow = (Math.sin(this.animTick * 0.08) + 1) / 2;
      ctx.beginPath();
      ctx.arc(0, -18, 7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${0.4 + glow * 0.4})`;
      ctx.fill();
    }

    // 10. Training Grounds (Military Barracks)
    drawTrainingGrounds(ctx, level = 1) {
      // Sand training yard
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-28, -16, 56, 26);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-28, -16, 56, 26);

      // Crossed swords emblem
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, -6); ctx.lineTo(10, 6);
      ctx.moveTo(10, -6); ctx.lineTo(-10, 6);
      ctx.stroke();

      // Archery target
      ctx.beginPath();
      ctx.arc(-16, -24, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444'; ctx.fill();
      ctx.beginPath();
      ctx.arc(-16, -24, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff'; ctx.fill();
      ctx.beginPath();
      ctx.arc(-16, -24, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444'; ctx.fill();

      // Weapon rack with halberds
      ctx.fillStyle = '#334155';
      ctx.fillRect(12, -22, 10, 14);
    }

    // 11. Warrior Academy (Elite Troop School)
    drawWarriorAcademy(ctx, level = 1) {
      // Fortified battle college
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-28, -20, 56, 30);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(-28, -20, 56, 30);

      // Twin turrets
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-32, -34, 12, 16);
      ctx.fillRect(20, -34, 12, 16);

      // Battlements
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-32, -38, 4, 4);
      ctx.fillRect(28, -38, 4, 4);

      // Glowing Runic Summoning Circle
      const glow = (Math.sin(this.animTick * 0.1) + 1) / 2;
      ctx.beginPath();
      ctx.arc(0, -6, 10, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 + glow * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 12. Unit Workshop (Siege Engine Manufactory)
    drawUnitWorkshop(ctx, level = 1) {
      // Industrial foundry body
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(-28, -16, 56, 26);
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.strokeRect(-28, -16, 56, 26);

      // Dual Foundry Chimneys
      ctx.fillStyle = '#44403c';
      ctx.fillRect(-20, -36, 8, 20);
      ctx.fillRect(12, -36, 8, 20);

      // Battering ram under assembly
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-12, -4, 24, 8);
      ctx.fillStyle = '#a8a29e';
      ctx.fillRect(10, -5, 6, 10);
    }

    // 13. Watch Tower (Defense)
    drawWatchTower(ctx, level = 1) {
      const height = Math.min(65, 36 + level * 3);

      // Tapered stone shaft
      ctx.fillStyle = level >= 6 ? '#0f172a' : '#334155';
      ctx.beginPath();
      ctx.moveTo(-10, 4);
      ctx.lineTo(10, 4);
      ctx.lineTo(7, -height);
      ctx.lineTo(-7, -height);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Lookout platform
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-12, -height - 8, 24, 8);

      // Wooden or slate cone roof
      ctx.beginPath();
      ctx.moveTo(-14, -height - 8);
      ctx.lineTo(0, -height - 24);
      ctx.lineTo(14, -height - 8);
      ctx.closePath();
      ctx.fillStyle = level >= 6 ? '#0284c7' : '#991b1b';
      ctx.fill();
    }

    // 14. Defense Cannon
    drawDefenseCannon(ctx, level = 1) {
      // Stone turntable mount
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Heavy Iron Cannon Barrel
      ctx.save();
      ctx.rotate(-0.5);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, -14, 12, 22);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-6, -14, 12, 22);
      ctx.restore();

      // Cannonballs stack
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(8, 2, 3, 0, Math.PI * 2);
      ctx.arc(12, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 15. Energy Tower (Tesla Obelisk)
    drawEnergyTower(ctx, level = 1) {
      // Dark crystalline pedestal
      ctx.fillStyle = '#09090b';
      ctx.fillRect(-12, -10, 24, 16);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(-12, -10, 24, 16);

      // Tall Obelisk Spire
      ctx.beginPath();
      ctx.moveTo(-8, -10);
      ctx.lineTo(0, -56);
      ctx.lineTo(8, -10);
      ctx.closePath();
      ctx.fillStyle = '#0369a1';
      ctx.fill();

      // Pulsating Mana Core Orb
      const pulse = (Math.sin(this.animTick * 0.15) + 1) / 2;
      ctx.beginPath();
      ctx.arc(0, -56, 8 + pulse * 2, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 16. Defensive Wall
    drawDefenseWall(ctx, level = 1) {
      // Stout granite rampart
      ctx.fillStyle = '#334155';
      ctx.fillRect(-16, -12, 32, 18);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-16, -12, 32, 18);

      // Crenellations
      ctx.fillStyle = '#475569';
      ctx.fillRect(-16, -18, 8, 6);
      ctx.fillRect(8, -18, 8, 6);

      // Torch
      const flicker = Math.sin(this.animTick * 0.3) * 1.5;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, -14, 3 + flicker, 0, Math.PI * 2);
      ctx.fill();
    }

    // 17. Heroic Monument (Decoration)
    drawHeroStatue(ctx, level = 1) {
      // Stepped Marble Plinth
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-14, -6, 28, 12);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-10, -14, 20, 8);

      // Carved Hero Figure
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-4, -30, 8, 16);
      // Head
      ctx.beginPath();
      ctx.arc(0, -34, 4, 0, Math.PI * 2);
      ctx.fill();
      // Raised sword
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(4, -28); ctx.lineTo(12, -42);
      ctx.stroke();
    }

    // 18. Aura Fountain (Decoration)
    drawCrystalFountain(ctx, level = 1) {
      // Circular basin
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Central fountain tier
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.ellipse(0, -8, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Splashing water spout
      const splash = Math.sin(this.animTick * 0.2) * 2;
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath();
      ctx.arc(0, -14 + splash, 3, 0, Math.PI * 2);
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
    // OVERLAYS, SCAFFOLDS, BADGES & INTERACTIVE BUBBLES
    // =========================================================================

    drawConstructionScaffold(ctx, bld) {
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-24, -40, 48, 44);

      // Diagonal braces
      ctx.beginPath();
      ctx.moveTo(-24, -40); ctx.lineTo(24, 4);
      ctx.moveTo(24, -40); ctx.lineTo(-24, 4);
      ctx.stroke();

      // Progress bar
      const now = Date.now();
      const spec = this.config.BUILDINGS[bld.type];
      const levelSpec = spec && spec.levels ? spec.levels[bld.level ? bld.level - 1 : 0] : { time: 10 };
      const totalDuration = (levelSpec.time || 10) * 1000;
      const remaining = Math.max(0, (bld.finishTime || now) - now);
      const progress = Math.min(1.0, Math.max(0, 1 - remaining / totalDuration));

      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(-25, -52, 50, 8);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1;
      ctx.strokeRect(-25, -52, 50, 8);

      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(-23, -50, 46 * progress, 4);
    }

    drawLevelBadge(ctx, level, x, y) {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(level || 1, x, y);
      ctx.restore();
    }

    drawHarvestBubble(ctx, type, x, y) {
      const bob = Math.sin(this.animTick * 0.1) * 3;
      const icons = {
        gold_mine: '🪙',
        lumber_yard: '🪵',
        stone_quarry: '🪨',
        farm: '🌾'
      };

      ctx.save();
      ctx.translate(x, y + bob);

      // Bubble glow
      ctx.fillStyle = 'rgba(14, 20, 36, 0.95)';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(icons[type] || '✨', 0, 1);
      ctx.restore();
    }

    drawRangeRing(ctx, rangeTiles) {
      const radiusX = rangeTiles * (this.tileW / 2);
      const radiusY = rangeTiles * (this.tileH / 2);

      ctx.save();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);

      ctx.beginPath();
      ctx.ellipse(0, 6, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

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

    renderPlacementPreview(ctx, city) {
      const mode = this.placementMode;
      const spec = this.config.BUILDINGS[mode.type];
      if (!spec) return;

      const size = spec.size || { w: 1, h: 1 };
      const fill = mode.isValid ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.4)';
      const stroke = mode.isValid ? '#22c55e' : '#ef4444';

      this.renderTileHighlight(ctx, mode.x, mode.y, fill, stroke, size.w, size.h);

      // Defense range ring preview
      const levelSpec = spec.levels ? spec.levels[0] : null;
      if (levelSpec && levelSpec.range) {
        const isoCenter = this.gridToIso(mode.x + size.w / 2, mode.y + size.h / 2);
        ctx.save();
        ctx.translate(isoCenter.x, isoCenter.y);
        this.drawRangeRing(ctx, levelSpec.range);
        ctx.restore();
      }

      // Ghost building icon
      const iso = this.gridToIso(mode.x + size.w / 2, mode.y + size.h / 2);
      ctx.save();
      ctx.translate(iso.x, iso.y);
      ctx.globalAlpha = 0.7;
      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(spec.icon, 0, -20);
      ctx.restore();
    }

    // =========================================================================
    // TACTICAL BATTLE RENDERING (STEP 9)
    // =========================================================================
    renderBattleField(ctx) {
      const battle = this.battleMode;
      if (!battle) return;

      // Render Red/Charred Battlefield Terrain
      const size = 16;
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const iso = this.gridToIso(x, y);
          const hw = this.tileW / 2;
          const hh = this.tileH / 2;

          ctx.beginPath();
          ctx.moveTo(iso.x, iso.y - hh);
          ctx.lineTo(iso.x + hw, iso.y);
          ctx.lineTo(iso.x, iso.y + hh);
          ctx.lineTo(iso.x - hw, iso.y);
          ctx.closePath();

          ctx.fillStyle = (x + y) % 2 === 0 ? '#381c1c' : '#291414';
          ctx.fill();
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Render Enemy Buildings / Towers
      for (const def of battle.defenses) {
        if (def.hp <= 0) continue;
        const iso = this.gridToIso(def.x, def.y);
        ctx.save();
        ctx.translate(iso.x, iso.y);

        // Building
        if (def.type === 'watch_tower') this.drawWatchTower(ctx, def.level);
        else if (def.type === 'defense_cannon') this.drawDefenseCannon(ctx, def.level);
        else if (def.type === 'energy_tower') this.drawEnergyTower(ctx, def.level);
        else if (def.type === 'defense_wall') this.drawDefenseWall(ctx, def.level);
        else this.drawCityHall(ctx, def.level);

        // Health Bar above enemy building
        const pct = Math.max(0, def.hp / def.maxHp);
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(-18, -60, 36, 5);
        ctx.fillStyle = pct > 0.5 ? '#22c55e' : (pct > 0.2 ? '#f59e0b' : '#ef4444');
        ctx.fillRect(-17, -59, 34 * pct, 3);

        ctx.restore();
      }

      // Render Attacking Player Units
      for (const unit of battle.units) {
        if (unit.hp <= 0) continue;
        const iso = this.gridToIso(unit.gx, unit.gy);
        ctx.save();
        ctx.translate(iso.x, iso.y);

        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(unit.icon, 0, -10);

        // Unit Health bar
        const hpPct = Math.max(0, unit.hp / unit.maxHp);
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(-10, -22, 20, 3);
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(-9, -21, 18 * hpPct, 1.5);

        ctx.restore();
      }

      // Render Projectiles (Arrows, Cannonballs, Laser Beams)
      for (const proj of battle.projectiles) {
        ctx.save();
        ctx.strokeStyle = proj.color || '#fbbf24';
        ctx.lineWidth = proj.type === 'beam' ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(proj.sx, proj.sy);
        ctx.lineTo(proj.tx, proj.ty);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  exports.CityRenderer = CityRenderer;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.CityRenderer = {}));
