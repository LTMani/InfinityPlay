import { 
  BuildingDefinition, 
  GridCoord, 
  PlacedBuilding, 
  Vehicle 
} from '../types';
import { 
  gridToScreen, 
  TILE_WIDTH, 
  TILE_HEIGHT 
} from '../core/Isometric';
import { BuildingRenderer } from './BuildingRenderer';
import { VehicleRenderer } from './VehicleRenderer';

export interface Particle {
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  life: number;
}

export class CanvasRenderer {
  public ctx: CanvasRenderingContext2D;
  public cameraX: number = 0;
  public cameraY: number = 0;
  public zoom: number = 1.0;
  public particles: Particle[] = [];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public setCamera(x: number, y: number, zoom: number) {
    this.cameraX = x;
    this.cameraY = y;
    this.zoom = zoom;
  }

  public addParticle(text: string, gx: number, gy: number, color: string = '#10b981') {
    const screen = gridToScreen(gx, gy, this.cameraX, this.cameraY, this.zoom);
    this.particles.push({
      text,
      x: screen.x,
      y: screen.y - 20,
      color,
      alpha: 1.0,
      life: 1.5
    });
  }

  /**
   * Main Render Frame
   */
  public render(
    mapWidth: number,
    mapHeight: number,
    buildings: PlacedBuilding[],
    vehicles: Vehicle[],
    buildingDefs: Record<string, BuildingDefinition>,
    hoverGrid: GridCoord | null,
    selectedBuildDef: BuildingDefinition | null,
    canAffordBuild: boolean,
    hourOfDay: number, // 0 - 24
    deltaTimeSec: number
  ): void {
    const ctx = this.ctx;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // 1. Natural Environment Ground (Fills Entire Screen — No Empty Void!)
    const isNight = hourOfDay < 6 || hourOfDay >= 20;
    ctx.fillStyle = isNight ? '#0b1120' : '#172033';
    ctx.fillRect(0, 0, width, height);

    // 2. Realistic Landscape Terrain & Paved Service Plaza
    this.drawLandscapeAndPlaza(mapWidth, mapHeight);

    // 3. Multi-Lane Interstate Highway with Guardrails & Markings
    this.drawInterstateHighway(mapWidth);

    // 4. Overhead Highway Gantry Exit Sign
    this.drawHighwayGantrySign(mapWidth);

    // 5. World Entities (Buildings & Vehicles) with Painter's Algorithm Depth Sorting
    this.drawWorldEntities(buildings, vehicles, buildingDefs, hourOfDay);

    // 6. Build Placement Hover Preview Ghost
    if (hoverGrid && selectedBuildDef) {
      this.drawBuildGhost(hoverGrid, selectedBuildDef, canAffordBuild);
    }

    // 7. Day / Dusk / Night Atmospheric Lighting Filter
    this.applyAtmosphericLighting(hourOfDay, width, height);

    // 8. Floating Text Particles
    this.drawParticles(deltaTimeSec);
  }

  /**
   * Continuous Landscape Terrain & Paved Service Plaza (NO Wireframe Grid Lines)
   */
  private drawLandscapeAndPlaza(mapWidth: number, mapHeight: number): void {
    const ctx = this.ctx;
    const halfW = (TILE_WIDTH / 2) * this.zoom;
    const halfH = (TILE_HEIGHT / 2) * this.zoom;

    // Expand terrain rendering beyond map boundaries to fill screen
    for (let x = -4; x < mapWidth + 6; x++) {
      for (let y = -2; y < mapHeight + 6; y++) {
        const screen = gridToScreen(x, y, this.cameraX, this.cameraY, this.zoom);

        // Frustum Culling
        if (
          screen.x + halfW < -150 || 
          screen.x - halfW > ctx.canvas.width + 150 ||
          screen.y + halfH < -150 || 
          screen.y - halfH > ctx.canvas.height + 150
        ) {
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(screen.x, screen.y);
        ctx.lineTo(screen.x + halfW, screen.y + halfH);
        ctx.lineTo(screen.x, screen.y + halfH * 2);
        ctx.lineTo(screen.x - halfW, screen.y + halfH);
        ctx.closePath();

        // Check if inside Service Plaza Paved Loop (x: 5-26, y: 6-16)
        const isPlazaPavement = (y >= 6 && y <= 16 && x >= 5 && x <= 26);
        const isHighwayCorridor = (y >= 1 && y <= 4);

        if (isPlazaPavement) {
          // Paved Asphalt Tarmac
          ctx.fillStyle = '#1e293b';
          ctx.fill();

          // Subtle Asphalt Border
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 0.4;
          ctx.stroke();

          // Painted Yellow Directional Pavement Arrow on Entry
          if (y === 6 && x === 7) {
            ctx.fillStyle = '#facc15';
            ctx.font = `bold ${Math.max(8, 9 * this.zoom)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('➔ PLAZA ENTRY', screen.x, screen.y + halfH + 2 * this.zoom);
          }
          if (y === 6 && x === 23) {
            ctx.fillStyle = '#10b981';
            ctx.font = `bold ${Math.max(8, 9 * this.zoom)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('➔ HIGHWAY EXIT', screen.x, screen.y + halfH + 2 * this.zoom);
          }
        } else if (isHighwayCorridor) {
          // Highway gravel shoulder
          ctx.fillStyle = '#1e2638';
          ctx.fill();
        } else {
          // Continuous Earth & Desert Grass Landscape
          const checker = (x + y) % 2 === 0;
          ctx.fillStyle = checker ? '#1b2436' : '#172030';
          ctx.fill();
        }
      }
    }
  }

  /**
   * Real-world Multi-lane Interstate Highway with Guardrails, Median & Markings
   */
  private drawInterstateHighway(mapWidth: number): void {
    const ctx = this.ctx;
    const halfW = (TILE_WIDTH / 2) * this.zoom;
    const halfH = (TILE_HEIGHT / 2) * this.zoom;

    // Draw Highway Tarmac across lanes y = 2 and y = 3 from edge to edge
    for (let x = -4; x < mapWidth + 6; x++) {
      for (let y = 2; y <= 3; y++) {
        const sc = gridToScreen(x, y, this.cameraX, this.cameraY, this.zoom);

        ctx.beginPath();
        ctx.moveTo(sc.x, sc.y);
        ctx.lineTo(sc.x + halfW, sc.y + halfH);
        ctx.lineTo(sc.x, sc.y + halfH * 2);
        ctx.lineTo(sc.x - halfW, sc.y + halfH);
        ctx.closePath();

        // Dark Tarmac Asphalt
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        // Lane separator
        if (y === 2) {
          // White Dashed Lane Dividers
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.lineWidth = 1.6 * this.zoom;
          ctx.beginPath();
          ctx.moveTo(sc.x - halfW * 0.2, sc.y + halfH * 0.8);
          ctx.lineTo(sc.x + halfW * 0.3, sc.y + halfH * 1.3);
          ctx.stroke();
        }
      }

      // Double Solid Yellow Median Striping along highway top edge (y = 2)
      const medSc = gridToScreen(x, 2, this.cameraX, this.cameraY, this.zoom);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.4 * this.zoom;
      ctx.beginPath();
      ctx.moveTo(medSc.x - halfW * 0.3, medSc.y + halfH * 0.3);
      ctx.lineTo(medSc.x + halfW * 1.3, medSc.y + halfH * 1.3);
      ctx.stroke();

      // Metal Corrugated Highway Guardrail along top edge
      this.drawGuardrail(ctx, medSc.x - halfW * 0.3, medSc.y + halfH * 0.3, medSc.x + halfW * 1.3, medSc.y + halfH * 1.3, this.zoom);
    }

    // Off-Ramp Deceleration Chevron Markings (x = 5, y = 4)
    const offRamp = gridToScreen(5, 4, this.cameraX, this.cameraY, this.zoom);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5 * this.zoom;
    ctx.beginPath();
    ctx.arc(offRamp.x, offRamp.y + halfH, 7 * this.zoom, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.font = `bold ${Math.max(8, 9 * this.zoom)}px 'Chakra Petch', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('EXIT 142 ➔', offRamp.x, offRamp.y + halfH - 10 * this.zoom);

    // On-Ramp Acceleration Merge (x = 24, y = 4)
    const onRamp = gridToScreen(24, 4, this.cameraX, this.cameraY, this.zoom);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5 * this.zoom;
    ctx.beginPath();
    ctx.arc(onRamp.x, onRamp.y + halfH, 7 * this.zoom, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.font = `bold ${Math.max(8, 9 * this.zoom)}px 'Chakra Petch', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('➔ MERGE I-66', onRamp.x, onRamp.y + halfH - 10 * this.zoom);
  }

  /**
   * Overhead Interstate Highway Exit Gantry Sign spanning lanes
   */
  private drawHighwayGantrySign(mapWidth: number): void {
    const ctx = this.ctx;
    const gantry = gridToScreen(4, 2, this.cameraX, this.cameraY, this.zoom);
    const halfH = (TILE_HEIGHT / 2) * this.zoom;
    const x = gantry.x;
    const y = gantry.y + halfH;
    const gantryH = 46 * this.zoom;

    // Steel Gantry Support Posts
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2.5 * this.zoom;
    ctx.beginPath();
    ctx.moveTo(x - 22 * this.zoom, y);
    ctx.lineTo(x - 22 * this.zoom, y - gantryH);
    ctx.lineTo(x + 22 * this.zoom, y - gantryH);
    ctx.lineTo(x + 22 * this.zoom, y);
    ctx.stroke();

    // Green Reflective Interstate Highway Sign Board
    const signW = 42 * this.zoom;
    const signH = 20 * this.zoom;
    const signX = x - signW / 2;
    const signY = y - gantryH - signH / 2;

    ctx.fillStyle = '#15803d'; // US Interstate Green
    ctx.fillRect(signX, signY, signW, signH);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1 * this.zoom;
    ctx.strokeRect(signX, signY, signW, signH);

    // Sign Legend
    ctx.fillStyle = '#ffffff';
    ctx.font = `black ${Math.max(6, 7 * this.zoom)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('EXIT 142 ➔', x, signY + 7 * this.zoom);
    ctx.font = `bold ${Math.max(5, 5.5 * this.zoom)}px sans-serif`;
    ctx.fillText('OASIS FUEL • FOOD', x, signY + 13 * this.zoom);
    ctx.fillText('MOTEL & TRUCKER REST', x, signY + 18 * this.zoom);
  }

  /**
   * Metal Highway Guardrail
   */
  private drawGuardrail(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    zoom: number
  ): void {
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2 * zoom;
    ctx.beginPath();
    ctx.moveTo(x1, y1 - 4 * zoom);
    ctx.lineTo(x2, y2 - 4 * zoom);
    ctx.stroke();
  }

  /**
   * Draw World Entities with Painter's Algorithm Depth Sorting
   */
  private drawWorldEntities(
    buildings: PlacedBuilding[],
    vehicles: Vehicle[],
    buildingDefs: Record<string, BuildingDefinition>,
    hourOfDay: number
  ): void {
    const ctx = this.ctx;

    const entities: {
      type: 'BUILDING' | 'VEHICLE';
      sortKey: number;
      data: any;
    }[] = [];

    buildings.forEach(b => {
      entities.push({
        type: 'BUILDING',
        sortKey: b.x + b.width / 2 + b.y + b.height / 2,
        data: b
      });
    });

    vehicles.forEach(v => {
      entities.push({
        type: 'VEHICLE',
        sortKey: v.x + v.y,
        data: v
      });
    });

    entities.sort((a, b) => a.sortKey - b.sortKey);

    entities.forEach(ent => {
      if (ent.type === 'BUILDING') {
        BuildingRenderer.renderBuilding(
          ctx,
          ent.data,
          buildingDefs[ent.data.defId],
          this.cameraX,
          this.cameraY,
          this.zoom,
          hourOfDay
        );
      } else {
        VehicleRenderer.renderVehicle(
          ctx,
          ent.data,
          this.cameraX,
          this.cameraY,
          this.zoom,
          hourOfDay
        );
      }
    });
  }

  private drawBuildGhost(
    grid: GridCoord,
    def: BuildingDefinition,
    canAfford: boolean
  ): void {
    const ctx = this.ctx;
    const bw = def.width;
    const bh = def.height;

    const top = gridToScreen(grid.x, grid.y, this.cameraX, this.cameraY, this.zoom);
    const right = gridToScreen(grid.x + bw, grid.y, this.cameraX, this.cameraY, this.zoom);
    const bottom = gridToScreen(grid.x + bw, grid.y + bh, this.cameraX, this.cameraY, this.zoom);
    const left = gridToScreen(grid.x, grid.y + bh, this.cameraX, this.cameraY, this.zoom);
    const halfH = (TILE_HEIGHT / 2) * this.zoom;

    ctx.fillStyle = canAfford ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)';
    ctx.strokeStyle = canAfford ? '#10b981' : '#ef4444';
    ctx.lineWidth = 2 * this.zoom;

    ctx.beginPath();
    ctx.moveTo(top.x, top.y + halfH);
    ctx.lineTo(right.x, right.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH);
    ctx.lineTo(left.x, left.y + halfH);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  private applyAtmosphericLighting(hourOfDay: number, width: number, height: number): void {
    const ctx = this.ctx;

    // Golden Sunset / Dusk (18:00 - 20:00)
    if (hourOfDay >= 18 && hourOfDay < 20) {
      const progress = (hourOfDay - 18) / 2;
      ctx.fillStyle = `rgba(180, 83, 9, ${0.12 + progress * 0.12})`;
      ctx.fillRect(0, 0, width, height);
    }

    // Deep Midnight Atmosphere (20:00 - 06:00)
    if (hourOfDay < 6 || hourOfDay >= 20) {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.45)';
      ctx.fillRect(0, 0, width, height);
    }
  }

  private drawParticles(deltaTimeSec: number): void {
    const ctx = this.ctx;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= deltaTimeSec;
      p.y -= 25 * deltaTimeSec;
      p.alpha = Math.max(0, p.life / 1.5);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.font = `bold ${Math.max(12, 13 * this.zoom)}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = p.color;
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 5;
      ctx.textAlign = 'center';
      ctx.fillText(p.text, p.x, p.y);
      ctx.restore();
    }
  }
}
