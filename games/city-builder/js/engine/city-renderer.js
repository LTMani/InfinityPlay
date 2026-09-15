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

      // Natural obstacles inside the village area (matching screenshot)
      props.push({ x: 8, y: 11, type: 'stump', scale: 1.0 }); // Stump near Town Hall
      props.push({ x: 10, y: 4, type: 'rock', scale: 1.1 });  // Large boulder above
      props.push({ x: 9, y: 13, type: 'pine', scale: 1.0 });  // Pine tree south
      props.push({ x: 5, y: 7, type: 'oak', scale: 1.05 });   // Oak tree west
      props.push({ x: 5, y: 12, type: 'stump', scale: 0.9 }); // Stump southwest
      props.push({ x: 14, y: 4, type: 'rock', scale: 0.95 }); // Boulder northeast
      props.push({ x: 15, y: 13, type: 'oak', scale: 1.1 });  // Oak tree southeast
      props.push({ x: 5, y: 4, type: 'bush', scale: 1.0 });   // Bush northwest

      // Outer boundary wild forest and boulders
      for (let i = -3; i <= size + 3; i++) {
        for (let j = -3; j <= size + 3; j++) {
          const isInsidePlayfield = (i >= 0 && i < size && j >= 0 && j < size);
          if (!isInsidePlayfield) {
            const seed = (Math.sin(i * 12.9898 + j * 78.233) * 43758.5453) % 1;
            if (seed > 0.45) {
              let type = 'oak';
              if (seed > 0.82) type = 'rock';
              else if (seed > 0.65) type = 'pine';
              else if (seed > 0.55) type = 'stump';
              props.push({
                x: i,
                y: j,
                type,
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
    // MAIN RENDER LOOP (Clash of Clans Theme)
    // =========================================================================
    render(city) {
      if (!city) return;
      this.animTick++;

      const ctx = this.ctx;
      ctx.save();
      ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);

      // 1. Lush Daytime Environment Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, this.viewHeight);
      bgGrad.addColorStop(0, '#82b535');
      bgGrad.addColorStop(0.35, '#74a72d');
      bgGrad.addColorStop(0.7, '#679b25');
      bgGrad.addColorStop(1, '#57881c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);

      // Camera transformation
      ctx.save();
      ctx.translate(this.camera.x, this.camera.y);
      ctx.scale(this.camera.zoom, this.camera.zoom);

      // If active battle mode, render the tactical battlefield instead of peacetime village
      if (this.battleMode && this.battleMode.active) {
        this.renderBattleField(ctx);
        ctx.restore();
        this.renderVignette(ctx);
        ctx.restore();
        return;
      }

      // 2. Render Outer Natural Environment (Wild trees, pine trees, rocks & stumps)
      this.renderEnvironmentProps(ctx, true); // Background props

      // 3. Render Vibrant Checkerboard Grass Terrain
      this.renderTerrain(ctx);

      // 4. Render Foreground Environmental Props
      this.renderEnvironmentProps(ctx, false); // Foreground props

      // 5. Render Tile Hover Highlight
      if (this.hoverTile && !this.placementMode && !this.selectedBuildingId) {
        this.renderTileHighlight(ctx, this.hoverTile.x, this.hoverTile.y, 'rgba(255, 255, 255, 0.22)', 'rgba(255, 255, 255, 0.6)');
      }

      // 6. Render Walking Villagers and Builders
      this.updateAndRenderCitizens(ctx);

      // 7. Render Buildings in depth-sorted order (with selection footprint and floating labels)
      this.renderBuildings(ctx, city);

      // 8. Render Placement Preview if in placement mode
      if (this.placementMode) {
        this.renderPlacementPreview(ctx, city);
      }

      // 9. Render Smoke & Floating Particle indicators
      this.renderSmoke(ctx);
      this.renderParticles(ctx);

      ctx.restore(); // Restore camera transform

      // 10. Subtle sunlit vignette overlay on screen
      this.renderVignette(ctx);

      ctx.restore();
    }

    // =========================================================================
    // TERRAIN RENDERING (Clash of Clans Checkerboard Grass)
    // =========================================================================
    renderTerrain(ctx) {
      const size = this.config.GRID_SIZE || 20;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const iso = this.gridToIso(x, y);
          this.drawGrassTile(ctx, iso.x, iso.y, x, y);
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

      // Alternating bright sunny grass checkerboard tiles
      const isAlt = (gx + gy) % 2 === 0;
      ctx.fillStyle = isAlt ? '#7eb338' : '#6ea22d';
      ctx.fill();

      // Subtle light grass grid seam
      ctx.strokeStyle = 'rgba(148, 206, 58, 0.38)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Natural wildflower tufts and clover specks
      const flowerHash = (gx * 43 + gy * 79) % 23;
      if (flowerHash === 3) {
        // Yellow buttercup flowers
        ctx.fillStyle = '#fde047';
        ctx.fillRect(x - 3, y - 2, 2.5, 2.5);
        ctx.fillRect(x + 3, y + 1, 2.5, 2.5);
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(x - 2, y - 1, 1, 1);
      } else if (flowerHash === 7) {
        // White daisy petals
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 1, y - 3, 2.5, 2.5);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(x + 1.5, y - 2.5, 1, 1);
      } else if (flowerHash === 13) {
        // Deep clover blades
        ctx.fillStyle = '#4d7c0f';
        ctx.fillRect(x - 4, y + 2, 3, 1.5);
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
          // Clash of Clans layered evergreen pine tree
          ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
          ctx.beginPath();
          ctx.ellipse(0, 2, 14, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          // Trunk
          ctx.fillStyle = '#5c2b09';
          ctx.fillRect(-3, -8, 6, 10);

          // Tier 1 bottom
          ctx.fillStyle = '#1e3f20';
          ctx.beginPath();
          ctx.moveTo(0 + wind * 0.2, -36);
          ctx.lineTo(16, -6);
          ctx.lineTo(-16, -6);
          ctx.closePath();
          ctx.fill();

          // Tier 2 mid
          ctx.fillStyle = '#2d5a30';
          ctx.beginPath();
          ctx.moveTo(0 + wind * 0.4, -48);
          ctx.lineTo(13, -18);
          ctx.lineTo(-13, -18);
          ctx.closePath();
          ctx.fill();

          // Tier 3 top
          ctx.fillStyle = '#3e7842';
          ctx.beginPath();
          ctx.moveTo(0 + wind * 0.6, -60);
          ctx.lineTo(9, -32);
          ctx.lineTo(-9, -32);
          ctx.closePath();
          ctx.fill();
        } else if (prop.type === 'oak') {
          // Lush cartoon deciduous Oak tree
          ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
          ctx.beginPath();
          ctx.ellipse(0, 4, 18, 9, 0, 0, Math.PI * 2);
          ctx.fill();

          // Wooden trunk & roots
          ctx.fillStyle = '#5c2e0b';
          ctx.fillRect(-4, -10, 8, 14);

          // Base shadow foliage
          ctx.fillStyle = '#1c5e26';
          ctx.beginPath();
          ctx.arc(0 + wind * 0.3, -26, 18, 0, Math.PI * 2);
          ctx.fill();

          // Mid green foliage
          ctx.fillStyle = '#2e8b3e';
          ctx.beginPath();
          ctx.arc(-5 + wind * 0.4, -30, 14, 0, Math.PI * 2);
          ctx.arc(6 + wind * 0.4, -28, 13, 0, Math.PI * 2);
          ctx.fill();

          // Highlight top canopy
          ctx.fillStyle = '#4ade80';
          ctx.beginPath();
          ctx.arc(-2 + wind * 0.5, -36, 10, 0, Math.PI * 2);
          ctx.fill();
        } else if (prop.type === 'rock') {
          // Smooth granite boulder
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.beginPath();
          ctx.ellipse(2, 2, 14, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.ellipse(0, -4, 13, 9, -0.1, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Highlight
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.ellipse(-3, -7, 6, 3, -0.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (prop.type === 'stump') {
          // Authentic tree stump with cut growth rings (as in screenshot)
          ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
          ctx.beginPath();
          ctx.ellipse(1, 2, 11, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          // Bark body
          ctx.fillStyle = '#5c2b09';
          ctx.beginPath();
          ctx.moveTo(-9, -2);
          ctx.lineTo(9, -2);
          ctx.lineTo(8, 5);
          ctx.lineTo(-8, 5);
          ctx.closePath();
          ctx.fill();

          // Cut top wood slab
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.ellipse(0, -3, 9, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Concentric growth rings
          ctx.strokeStyle = '#92400e';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(0, -3, 5, 2.8, 0, 0, Math.PI * 2);
          ctx.stroke();
        } else if (prop.type === 'bush') {
          // Flowering green bush
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.arc(0, -6, 9, 0, Math.PI * 2);
          ctx.arc(-6, -4, 7, 0, Math.PI * 2);
          ctx.arc(6, -4, 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fde047';
          ctx.fillRect(-3, -8, 2, 2);
          ctx.fillRect(4, -6, 2, 2);
        }

        ctx.restore();
      }
    }

    // =========================================================================
    // LIVING VILLAGERS & BUILDERS (Clash of Clans Theme)
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

            // Pick next destination near buildings
            const isRoadX = Math.random() > 0.5;
            c.targetGx = isRoadX ? 10 : Math.floor(7 + Math.random() * 6);
            c.targetGy = isRoadX ? Math.floor(7 + Math.random() * 6) : 10;
            c.idleTicks = Math.floor(30 + Math.random() * 60);
          }
        }

        // Interpolate grid position
        const curX = c.gx + (c.targetGx - c.gx) * c.progress;
        const curY = c.gy + (c.targetGy - c.gy) * c.progress;
        const iso = this.gridToIso(curX, curY);

        const bob = Math.abs(Math.sin(this.animTick * 0.25)) * 2.5;

        ctx.save();
        ctx.translate(iso.x, iso.y - bob);

        // Character shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 3, 5, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        if (c.id % 2 === 0) {
          // Clash of Clans Villager Girl: Pink dress, brown hair bun, cute walk
          // Dress
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.moveTo(-4, 1);
          ctx.lineTo(4, 1);
          ctx.lineTo(2, -7);
          ctx.lineTo(-2, -7);
          ctx.closePath();
          ctx.fill();

          // Face
          ctx.fillStyle = '#fed7aa';
          ctx.beginPath();
          ctx.arc(0, -10, 3, 0, Math.PI * 2);
          ctx.fill();

          // Brown hair & bun
          ctx.fillStyle = '#5c2b09';
          ctx.beginPath();
          ctx.arc(0, -12, 3, 0, Math.PI * 2);
          ctx.arc(2, -13, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Clash of Clans Builder: Blue tunic/overalls, leather cap, wooden hammer
          // Body
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(-3, -7, 6, 8);

          // Head & skin
          ctx.fillStyle = '#fed7aa';
          ctx.beginPath();
          ctx.arc(0, -10, 3, 0, Math.PI * 2);
          ctx.fill();

          // Leather Builder Cap
          ctx.fillStyle = '#78350f';
          ctx.fillRect(-4, -13, 8, 3);
          ctx.beginPath();
          ctx.arc(0, -13, 3, Math.PI, 0);
          ctx.fill();

          // Wooden Hammer in hand
          ctx.fillStyle = '#92400e';
          ctx.fillRect(4, -8, 2, 6);
          ctx.fillStyle = '#a8a29e';
          ctx.fillRect(3, -11, 4, 3);
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
    // BUILDINGS RENDERING & PROCEDURAL ARCHITECTURE (Clash of Clans Theme)
    // =========================================================================
    renderBuildings(ctx, city) {
      if (!city || !city.buildings) return;

      // 1. Draw green checked grid footprint underneath the currently selected building
      if (this.selectedBuildingId) {
        const selBld = city.buildings.find(b => b.id === this.selectedBuildingId);
        if (selBld) {
          const selSpec = this.config.BUILDINGS[selBld.type] || { size: { w: 1, h: 1 } };
          const sw = selSpec.size ? selSpec.size.w : 1;
          const sh = selSpec.size ? selSpec.size.h : 1;
          this.drawSelectionFootprint(ctx, selBld.x, selBld.y, sw, sh);
        }
      }

      // 2. Depth sort by isometric distance (x + y + size offset)
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

      // Periodically spawn smoke from Town Hall, Mines, or Workshops
      if (this.animTick % 28 === 0 && ['city_hall', 'gold_mine', 'lumber_yard', 'unit_workshop'].includes(bld.type)) {
        this.addSmoke(centerGridX, centerGridY);
      }

      ctx.save();
      ctx.translate(iso.x, iso.y);

      // 1. Building Ground Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 8, size.w * 25, size.h * 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Defense range ring if defense structure is selected
      const isSelected = this.selectedBuildingId === bld.id;
      if (isSelected) {
        const curLevelSpec = spec.levels ? spec.levels[Math.min(bld.level - 1, spec.levels.length - 1)] : null;
        if (curLevelSpec && curLevelSpec.range) {
          this.drawRangeRing(ctx, curLevelSpec.range);
        }
      }

      // 3. Dispatch specific Clash of Clans building drawing method
      switch (bld.type) {
        case 'city_hall':
          this.drawCityHall(ctx, bld.level);
          break;
        case 'builder_hut':
          this.drawBuilderHut(ctx, bld.level, bld.isSleeping);
          break;
        case 'treasury':
          this.drawTreasury(ctx, bld.level); // Gold Storage
          break;
        case 'storage':
        case 'elixir_storage':
          this.drawElixirStorage(ctx, bld.level); // Elixir Storage
          break;
        case 'gold_mine':
          this.drawGoldMine(ctx, bld.level);
          break;
        case 'elixir_collector':
          this.drawElixirCollector(ctx, bld.level);
          break;
        case 'training_grounds':
        case 'barracks':
          this.drawTrainingGrounds(ctx, bld.level); // Barracks with swords
          break;
        case 'army_camp':
          this.drawArmyCamp(ctx, bld.level); // Camp with campfire
          break;
        case 'defense_cannon':
          this.drawDefenseCannon(ctx, bld.level); // Cannon
          break;
        case 'watch_tower':
          this.drawWatchTower(ctx, bld.level); // Archer Tower
          break;
        case 'energy_tower':
          this.drawEnergyTower(ctx, bld.level);
          break;
        case 'defense_wall':
          this.drawDefenseWall(ctx, bld.level);
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
        case 'warrior_academy':
          this.drawWarriorAcademy(ctx, bld.level);
          break;
        case 'unit_workshop':
          this.drawUnitWorkshop(ctx, bld.level);
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

      // 5. Floating Interactive Bubbles & Signs
      if (bld.type === 'gold_mine') {
        this.drawGoldBubble(ctx, 0, -56);
      } else if (bld.type === 'elixir_collector') {
        this.drawElixirBubble(ctx, 0, -56);
      } else if (bld.type === 'training_grounds' || bld.type === 'barracks') {
        this.drawTrainBubble(ctx, 0, -66);
      } else if (bld.type === 'builder_hut' && bld.isSleeping) {
        this.drawSleepingZ(ctx, 0, -36);
      }

      // 6. Floating Title and Level text if building is selected (matches screenshot!)
      if (isSelected) {
        this.drawFloatingBuildingLabel(ctx, spec.name, bld.level, 0, -66 - (size.h * 8));
      }

      ctx.restore();
    }

    // =========================================================================
    // PROCEDURAL BUILDING ARCHITECTURES (LEVELS 1 - 10)
    // =========================================================================

    // =========================================================================
    // PROCEDURAL CLASH OF CLANS ARCHITECTURE (Town Hall, Mines, Barracks, Camp)
    // =========================================================================

    // 1. Town Hall (Matches screenshot: caramel wood plank roof, stone base, arched door, chimney)
    drawCityHall(ctx, level = 2) {
      // Dimensions
      const bw = 56;
      const bh = 32;

      // Base Stone Foundation
      ctx.fillStyle = '#475569';
      ctx.fillRect(-bw / 2 - 2, -12, bw + 4, 22);

      // Stone Wall Body with brick texture
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-bw / 2, -18, bw, 24);

      // Stone Brick Seams
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Horizontal seam
      ctx.moveTo(-bw / 2, -6); ctx.lineTo(bw / 2, -6);
      // Vertical seams
      ctx.moveTo(-16, -18); ctx.lineTo(-16, -6);
      ctx.moveTo(16, -18); ctx.lineTo(16, -6);
      ctx.moveTo(-4, -6); ctx.lineTo(-4, 6);
      ctx.stroke();

      // Arched Entrance Doorway (front center)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, -2, 8, Math.PI, 0);
      ctx.lineTo(8, 6);
      ctx.lineTo(-8, 6);
      ctx.closePath();
      ctx.fill();

      // Stone Door Trim
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Wooden Door Planks inside
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-6, -2, 12, 8);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -2); ctx.lineTo(0, 6);
      ctx.stroke();

      // Entrance Stone Step
      ctx.fillStyle = '#334155';
      ctx.fillRect(-10, 6, 20, 3);

      // Warm Caramel Wood Plank Hip Roof (Clash of Clans signature!)
      // Shaded roof underbody
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.moveTo(-bw / 2 - 4, -18);
      ctx.lineTo(0, -48);
      ctx.lineTo(bw / 2 + 4, -18);
      ctx.closePath();
      ctx.fill();

      // Main caramel roof surface
      ctx.fillStyle = '#c27a2e';
      ctx.beginPath();
      ctx.moveTo(-bw / 2 - 2, -18);
      ctx.lineTo(0, -46);
      ctx.lineTo(bw / 2 + 2, -18);
      ctx.closePath();
      ctx.fill();

      // Roof Wooden Planks Texture
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 1.5;
      for (let i = -14; i <= 14; i += 6) {
        ctx.beginPath();
        ctx.moveTo(i * 1.6, -18);
        ctx.lineTo(i * 0.5, -44);
        ctx.stroke();
      }

      // Overhang Rafter Eaves
      ctx.strokeStyle = '#5c2b09';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-bw / 2 - 4, -18);
      ctx.lineTo(bw / 2 + 4, -18);
      ctx.stroke();

      // Ridge Beam on Roof Apex
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-16, -48, 32, 4);

      // Stone Chimney on Roof Ridge (with smoke puffs!)
      ctx.fillStyle = '#475569';
      ctx.fillRect(10, -56, 10, 14);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(10, -56, 10, 14);
      ctx.fillStyle = '#1e293b'; // Chimney flue hole
      ctx.fillRect(11, -57, 8, 2);

      // Animated Smoke Puffs rising from chimney
      const smokeOffset = (this.animTick * 0.4) % 24;
      const smokeAlpha = Math.max(0, 1 - smokeOffset / 24);
      ctx.fillStyle = `rgba(240, 240, 245, ${smokeAlpha * 0.75})`;
      ctx.beginPath();
      ctx.arc(15 + Math.sin(this.animTick * 0.08) * 3, -60 - smokeOffset, 3.5 + smokeOffset * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Level 3+ Red Banner and Gold Trim
      if (level >= 3) {
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(-8, -14, 16, 10);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-8, -4, 16, 2);
      }
    }

    // 2. Builder's Hut (Small wooden cabin with saw & hammer rooftop sign)
    drawBuilderHut(ctx, level = 1, isSleeping = false) {
      // Wood Log Cabin Walls
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-14, -8, 28, 16);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1;
      // Log horizontal seams
      ctx.beginPath();
      ctx.moveTo(-14, -2); ctx.lineTo(14, -2);
      ctx.moveTo(-14, 3); ctx.lineTo(14, 3);
      ctx.stroke();

      // Arched Wood Door
      ctx.fillStyle = '#3e1f07';
      ctx.beginPath();
      ctx.arc(0, 0, 4, Math.PI, 0);
      ctx.lineTo(4, 8);
      ctx.lineTo(-4, 8);
      ctx.closePath();
      ctx.fill();

      // Dark Wood Shingle Roof
      ctx.fillStyle = '#5c2b09';
      ctx.beginPath();
      ctx.moveTo(-18, -8);
      ctx.lineTo(0, -24);
      ctx.lineTo(18, -8);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#3e1b04';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-18, -8); ctx.lineTo(0, -24); ctx.lineTo(18, -8);
      ctx.stroke();

      // Front Rooftop Wooden Signpost with Saw & Hammer Emblem!
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-9, -28, 18, 12);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-9, -28, 18, 12);

      // Mini Saw & Hammer Icon on Signboard
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-5, -23, 10, 2); // Saw blade
      ctx.fillStyle = '#d97706';
      ctx.fillRect(2, -26, 2, 8);   // Hammer handle
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, -27, 6, 3);   // Hammer head
    }

    // 3. Gold Storage (Wooden basin overflowing with glistening gold coins!)
    drawTreasury(ctx, level = 1) {
      // Wooden & Stone Fortified Basin
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(0, 4, 28, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iron corner banding
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Massive Overflowing Mountain of Golden Coins (matches screenshot!)
      const grad = ctx.createRadialGradient(-4, -6, 2, 0, 0, 22);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.4, '#facc15');
      grad.addColorStop(0.8, '#eab308');
      grad.addColorStop(1, '#a16207');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.ellipse(0, -4, 25, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Coin texture details and sparkles
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(-8, -8, 3, 0, Math.PI * 2);
      ctx.arc(4, -10, 3.5, 0, Math.PI * 2);
      ctx.arc(-3, -2, 4, 0, Math.PI * 2);
      ctx.arc(10, -3, 3, 0, Math.PI * 2);
      ctx.fill();

      // Glistening coin spark
      const shine = (Math.sin(this.animTick * 0.12) + 1) / 2;
      if (shine > 0.7) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-4, -12, 3, 3);
        ctx.fillRect(8, -6, 2, 2);
      }
    }

    // 4. Elixir Storage (Spherical transparent glass cauldron with purple elixir)
    drawElixirStorage(ctx, level = 1) {
      // 4-legged wooden cradle stand
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-18, -4, 6, 14);
      ctx.fillRect(12, -4, 6, 14);
      ctx.fillRect(-16, 6, 32, 4);

      // Glass Spherical Vat Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(0, 6, 22, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Purple Glowing Elixir Fluid Inside
      const elixirGrad = ctx.createRadialGradient(-6, -16, 3, 0, -10, 20);
      elixirGrad.addColorStop(0, '#f472b6');
      elixirGrad.addColorStop(0.4, '#d946ef');
      elixirGrad.addColorStop(0.8, '#a21caf');
      elixirGrad.addColorStop(1, '#581c87');
      ctx.fillStyle = elixirGrad;

      ctx.beginPath();
      ctx.arc(0, -10, 19, 0, Math.PI * 2);
      ctx.fill();

      // Animated liquid wave surface
      const wave = Math.sin(this.animTick * 0.1) * 2;
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.ellipse(0, -18 + wave, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glass Container Highlights & Reflections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -10, 20, Math.PI * 0.8, Math.PI * 1.4);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.ellipse(-9, -20, 6, 2.5, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Gold Mine (Wooden timber ramp entering underground shaft + golden nuggets)
    drawGoldMine(ctx, level = 1) {
      // Rocky hill mound
      ctx.fillStyle = '#57534e';
      ctx.beginPath();
      ctx.ellipse(0, 4, 24, 13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dark Mine Entrance Tunnel
      ctx.fillStyle = '#0c0a09';
      ctx.beginPath();
      ctx.arc(0, -2, 12, Math.PI, 0);
      ctx.fill();

      // Wooden Arch Frame
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Wooden Cart Rail Track leading inside
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, 8); ctx.lineTo(-3, -2);
      ctx.moveTo(6, 8); ctx.lineTo(3, -2);
      ctx.stroke();

      // Golden Ore Nuggets on ramp and ground
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(-8, 3, 3, 0, Math.PI * 2);
      ctx.arc(-2, 4, 3.5, 0, Math.PI * 2);
      ctx.arc(6, 2, 3, 0, Math.PI * 2);
      ctx.arc(10, 5, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Side Wooden Derrick Crane & Pulley
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(12, 4); ctx.lineTo(16, -26); ctx.lineTo(8, -26);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(8, -26, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
    }

    // 6. Elixir Collector (Glass vat with swirling purple elixir liquid + brass suction pipe)
    drawElixirCollector(ctx, level = 1) {
      // Wooden & Metal Base
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(0, 4, 20, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glass Vat Cylinder filled with Glowing Purple Elixir
      const grad = ctx.createLinearGradient(-10, 0, 10, 0);
      grad.addColorStop(0, '#a21caf');
      grad.addColorStop(0.4, '#d946ef');
      grad.addColorStop(0.8, '#f472b6');
      grad.addColorStop(1, '#86198f');
      ctx.fillStyle = grad;

      ctx.fillRect(-10, -22, 20, 24);

      // Bubbling Liquid Top
      const bubbleY = Math.sin(this.animTick * 0.12) * 1.5;
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.ellipse(0, -22 + bubbleY, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glass Highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.fillRect(-7, -20, 3, 18);

      // Brass Suction Piping arching over
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(8, -20);
      ctx.quadraticCurveTo(18, -22, 16, 2);
      ctx.stroke();

      // Piston pump lever
      ctx.fillStyle = '#451a03';
      ctx.fillRect(14, 0, 5, 5);
    }

    // 7. Barracks (Terracotta red roof with giant crossed silver swords on roof!)
    drawTrainingGrounds(ctx, level = 1) {
      // Sturdy Stone Base
      ctx.fillStyle = '#475569';
      ctx.fillRect(-22, -10, 44, 18);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-22, -10, 44, 18);

      // Wooden Entrance Door
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-6, -4, 12, 12);

      // Sloped Terracotta Red Roof (Clash of Clans signature)
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.moveTo(-26, -10);
      ctx.lineTo(0, -32);
      ctx.lineTo(26, -10);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Giant Crossed Silver Swords Mounted on Roof Peak (Matches screenshot!)
      ctx.save();
      ctx.translate(0, -32);

      // Sword 1 (\)
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-11, -11); ctx.lineTo(11, 11);
      ctx.stroke();
      // Guard & Pommel 1
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-13, -7); ctx.lineTo(-7, -13);
      ctx.stroke();

      // Sword 2 (/)
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(11, -11); ctx.lineTo(-11, 11);
      ctx.stroke();
      // Guard & Pommel 2
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(13, -7); ctx.lineTo(7, -13);
      ctx.stroke();

      ctx.restore();
    }

    // 8. Army Camp (Campground with lively animated central campfire!)
    drawArmyCamp(ctx, level = 1) {
      // Open Green Encampment Area
      ctx.fillStyle = 'rgba(74, 222, 128, 0.22)';
      ctx.beginPath();
      ctx.ellipse(0, 2, 34, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Perimeter Stone Posts
      ctx.fillStyle = '#64748b';
      const posts = [
        { x: -28, y: 0 }, { x: 28, y: 0 },
        { x: -16, y: -12 }, { x: 16, y: -12 },
        { x: -16, y: 12 }, { x: 16, y: 12 }
      ];
      for (const p of posts) {
        ctx.fillRect(p.x - 2, p.y - 3, 4, 6);
      }

      // Authentic Animated Campfire in Center (Matches screenshot!)
      // Charcoal ash base
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.ellipse(0, 2, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Crossed Wood Logs
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-8, 4); ctx.lineTo(8, -1);
      ctx.moveTo(-6, -1); ctx.lineTo(6, 4);
      ctx.stroke();

      // Glowing Coals Core
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      // Multi-layer Animated Flickering Fire Flames
      const f1 = Math.sin(this.animTick * 0.3) * 2;
      const f2 = Math.cos(this.animTick * 0.25) * 2.5;

      // Red Outer Flame
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.beginPath();
      ctx.moveTo(-6, 2);
      ctx.quadraticCurveTo(-4, -10 + f1, 0, -18 + f1);
      ctx.quadraticCurveTo(4, -10 + f2, 6, 2);
      ctx.closePath();
      ctx.fill();

      // Orange Mid Flame
      ctx.fillStyle = 'rgba(249, 115, 22, 0.9)';
      ctx.beginPath();
      ctx.moveTo(-4, 2);
      ctx.quadraticCurveTo(-2, -8 + f2, 0, -14 + f2);
      ctx.quadraticCurveTo(2, -8 + f1, 4, 2);
      ctx.closePath();
      ctx.fill();

      // Bright Golden Yellow Core Flame
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(-2, 1);
      ctx.lineTo(0, -9 + f1 * 0.5);
      ctx.lineTo(2, 1);
      ctx.closePath();
      ctx.fill();

      // Fire Embers drifting upward
      const sparkY = (this.animTick * 0.6) % 20;
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(Math.sin(this.animTick * 0.1) * 3, -16 - sparkY, 1.5, 1.5);
    }

    // 9. Cannon (Cast-iron cannon barrel on wooden 4-legged turntable mount)
    drawDefenseCannon(ctx, level = 1) {
      // 4-Legged Wooden Turntable Pedestal
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-10, 4, 4, 6);
      ctx.fillRect(6, 4, 4, 6);

      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.ellipse(0, 2, 14, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Heavy Cast-Iron Cannon Barrel angled diagonally
      ctx.save();
      ctx.rotate(-0.5);

      // Barrel shadow and body
      ctx.fillStyle = '#111827';
      ctx.fillRect(-6, -16, 12, 22);

      // Gold/Brass reinforcement rings
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(-6, -16, 12, 22);

      // Cannon Muzzle
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(0, -16, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#eab308';
      ctx.stroke();

      ctx.restore();

      // Small stack of 3 black iron cannonballs
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(10, 1, 3, 0, Math.PI * 2);
      ctx.arc(14, -1, 3, 0, Math.PI * 2);
      ctx.arc(12, -4, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 10. Watch Tower / Archer Tower
    drawWatchTower(ctx, level = 1) {
      const height = Math.min(62, 38 + level * 2);

      // Wooden Trestle Legs & Stone Foundation
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-11, 4); ctx.lineTo(-7, -height);
      ctx.moveTo(11, 4); ctx.lineTo(7, -height);
      ctx.moveTo(-9, -height * 0.5); ctx.lineTo(9, -height * 0.5);
      ctx.stroke();

      // Elevated Platform with Timber Railing
      ctx.fillStyle = '#92400e';
      ctx.fillRect(-13, -height - 4, 26, 6);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-13, -height - 4, 26, 6);

      // Sentry Archer on top
      ctx.fillStyle = '#ec4899'; // Archer tunic
      ctx.fillRect(-3, -height - 12, 6, 8);
      ctx.fillStyle = '#fed7aa'; // Head
      ctx.beginPath();
      ctx.arc(0, -height - 15, 3, 0, Math.PI * 2);
      ctx.fill();
      // Bow
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(4, -height - 12, 6, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
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

    // Clash of Clans 3D Bobbing Gold Mine Bubble
    drawGoldBubble(ctx, x, y) {
      const bob = Math.sin(this.animTick * 0.08) * 4;
      ctx.save();
      ctx.translate(x, y + bob);

      // Outer bubble glow / rim
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Inner gold coin 1 (background)
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(3, -2, 7, 0, Math.PI * 2);
      ctx.fill();

      // Inner gold coin 2 (foreground)
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(-2, 2, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Coin stamped detail
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(-2, 2, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Specular glass gloss highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.ellipse(-5, -6, 4.5, 2.5, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Clash of Clans 3D Bobbing Purple Elixir Bubble
    drawElixirBubble(ctx, x, y) {
      const bob = Math.sin(this.animTick * 0.08 + 1.2) * 4;
      ctx.save();
      ctx.translate(x, y + bob);

      // Outer bubble glow / rim
      ctx.fillStyle = 'rgba(24, 10, 40, 0.75)';
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#c026d3';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Glowing Purple Droplet
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.quadraticCurveTo(8, -1, 6, 6);
      ctx.arc(0, 5, 6, 0, Math.PI, false);
      ctx.quadraticCurveTo(-8, -1, 0, -9);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(0, 5, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Specular glass gloss
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.ellipse(-5, -6, 4.5, 2.5, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Barracks "Train" sign / sword bubble
    drawTrainBubble(ctx, x, y) {
      const bob = Math.sin(this.animTick * 0.06) * 3;
      ctx.save();
      ctx.translate(x, y + bob);

      // Parchment banner
      ctx.fillStyle = 'rgba(254, 243, 199, 0.95)';
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(-24, -11, 48, 22, 6);
      } else {
        ctx.rect(-24, -11, 48, 22);
      }
      ctx.fill();
      ctx.stroke();

      // Swords / Train text
      ctx.font = '900 10px "Arial Black", sans-serif';
      ctx.fillStyle = '#78350f';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚔️ TRAIN', 0, 1);

      ctx.restore();
    }

    // Builder Sleeping Zs
    drawSleepingZ(ctx, x, y) {
      ctx.save();
      for (let i = 0; i < 3; i++) {
        const progress = ((this.animTick * 0.03 + i * 0.33) % 1.0);
        const alpha = Math.sin(progress * Math.PI);
        const zx = x + Math.sin(progress * 4) * 6 + (i - 1) * 6;
        const zy = y - progress * 24;
        const size = 9 + i * 3;

        ctx.fillStyle = `rgba(147, 197, 253, ${alpha})`;
        ctx.strokeStyle = `rgba(30, 58, 138, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.font = `bold ${size}px "Arial Black", sans-serif`;
        ctx.strokeText('Z', zx, zy);
        ctx.fillText('Z', zx, zy);
      }
      ctx.restore();
    }

    // Floating Building Name & Level Label (Town Hall Level 2)
    drawFloatingBuildingLabel(ctx, name, level, x, y) {
      ctx.save();
      const title = name || 'Building';
      const sub = `Level ${level || 1}`;

      ctx.font = '900 13px "Arial Black", sans-serif';
      const w = Math.max(ctx.measureText(title).width, 70) + 20;

      // Dark translucent badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x - w / 2, y - 20, w, 36, 8);
      } else {
        ctx.rect(x - w / 2, y - 20, w, 36);
      }
      ctx.fill();
      ctx.stroke();

      // Title
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(title, x, y - 7);
      ctx.fillText(title, x, y - 7);

      // Level
      ctx.font = 'bold 11px "Arial Black", sans-serif';
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.5;
      ctx.strokeText(sub, x, y + 8);
      ctx.fillText(sub, x, y + 8);

      ctx.restore();
    }

    // Vibrant green checked footprint underneath selected building
    drawSelectionFootprint(ctx, gx, gy, w = 1, h = 1) {
      const hw = this.tileW / 2;
      const hh = this.tileH / 2;

      ctx.save();
      // Draw individual isometric tile check patterns
      for (let tx = gx; tx < gx + w; tx++) {
        for (let ty = gy; ty < gy + h; ty++) {
          const isEven = (tx + ty) % 2 === 0;
          ctx.fillStyle = isEven ? 'rgba(74, 222, 128, 0.45)' : 'rgba(34, 197, 94, 0.6)';

          const top = this.gridToIso(tx, ty);
          const right = this.gridToIso(tx + 1, ty);
          const bottom = this.gridToIso(tx + 1, ty + 1);
          const left = this.gridToIso(tx, ty + 1);

          ctx.beginPath();
          ctx.moveTo(top.x, top.y);
          ctx.lineTo(right.x, right.y);
          ctx.lineTo(bottom.x, bottom.y);
          ctx.lineTo(left.x, left.y);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Strong outer white/bright green border around entire footprint
      const outerTop = this.gridToIso(gx, gy);
      const outerRight = this.gridToIso(gx + w, gy);
      const outerBottom = this.gridToIso(gx + w, gy + h);
      const outerLeft = this.gridToIso(gx, gy + h);

      ctx.beginPath();
      ctx.moveTo(outerTop.x, outerTop.y);
      ctx.lineTo(outerRight.x, outerRight.y);
      ctx.lineTo(outerBottom.x, outerBottom.y);
      ctx.lineTo(outerLeft.x, outerLeft.y);
      ctx.closePath();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.stroke();

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
