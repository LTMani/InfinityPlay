import { BuildingDefinition, PlacedBuilding } from '../types';
import { gridToScreen, TILE_HEIGHT, TILE_WIDTH } from '../core/Isometric';

export class BuildingRenderer {
  /**
   * Render real-world architectural buildings in 2.5D Isometric view.
   * Completely eliminates container boxes — renders real open-air canopies,
   * realistic EV charging stalls, architectural retail buildings, and motels.
   */
  public static renderBuilding(
    ctx: CanvasRenderingContext2D,
    building: PlacedBuilding,
    def: BuildingDefinition | undefined,
    cameraX: number,
    cameraY: number,
    zoom: number,
    hourOfDay: number
  ): void {
    const bw = building.width;
    const bh = building.height;
    const isNight = hourOfDay < 6 || hourOfDay >= 20;

    // Corner screen coordinates
    const top = gridToScreen(building.x, building.y, cameraX, cameraY, zoom);
    const right = gridToScreen(building.x + bw, building.y, cameraX, cameraY, zoom);
    const bottom = gridToScreen(building.x + bw, building.y + bh, cameraX, cameraY, zoom);
    const left = gridToScreen(building.x, building.y + bh, cameraX, cameraY, zoom);

    ctx.save();

    switch (building.type) {
      case 'PUMP_ISLAND':
        this.drawOpenAirGasCanopy(ctx, top, right, bottom, left, zoom, isNight, false);
        break;

      case 'EV_STATION':
        this.drawEVChargingStall(ctx, top, right, bottom, left, zoom, isNight);
        break;

      case 'MOTEL_ROOM':
        this.drawArchitecturalMotel(ctx, top, right, bottom, left, zoom, isNight, building);
        break;

      case 'MOTEL_CABIN':
        this.drawTruckerSleepPod(ctx, top, right, bottom, left, zoom, isNight, building);
        break;

      case 'CONVENIENCE_STORE':
        this.drawQuickMartStore(ctx, top, right, bottom, left, zoom, isNight);
        break;

      case 'DINER':
        this.drawStreamlinerDiner(ctx, top, right, bottom, left, zoom, isNight);
        break;

      case 'CAR_WASH':
        this.drawCarWashTunnel(ctx, top, right, bottom, left, zoom, isNight);
        break;

      case 'RESTROOM':
        this.drawRestroomPavilion(ctx, top, right, bottom, left, zoom, isNight);
        break;

      case 'BILLBOARD':
        this.drawHighwayMegaboard(ctx, bottom, zoom, isNight);
        break;

      case 'TREE':
        this.drawOasisPalmTree(ctx, bottom, zoom);
        break;

      case 'PARKING_CAR':
      case 'PARKING_TRUCK':
      case 'DRIVEWAY':
      default:
        this.drawPavedLot(ctx, top, right, bottom, left, zoom, building.type);
        break;
    }

    ctx.restore();
  }

  /**
   * REAL-WORLD OPEN-AIR GAS STATION CANOPY
   * Open underneath! Cars drive directly under the canopy onto the concrete island.
   * Features 4 structural steel pillars, dual fuel dispensers with hoses, and an elevated canopy roof.
   */
  private static drawOpenAirGasCanopy(
    ctx: CanvasRenderingContext2D,
    top: any,
    right: any,
    bottom: any,
    left: any,
    zoom: number,
    isNight: boolean,
    isDieselOnly: boolean
  ): void {
    const halfH = (TILE_HEIGHT / 2) * zoom;
    const canopyClearance = 52 * zoom; // Height of open air under canopy
    const canopyThickness = 12 * zoom;

    // --- 1. Ground Level: Paved Island & Concrete Curbs ---
    // Raised concrete pump island in center
    const islandCX = (top.x + bottom.x) / 2;
    const islandCY = (top.y + bottom.y) / 2 + halfH;
    const islandW = (bottom.x - left.x) * 0.7;
    const islandH = 12 * zoom;

    // Concrete Island Base
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(islandCX, islandCY, islandW * 0.5, islandH * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Yellow Hazard Safety Curb on Island
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2 * zoom;
    ctx.stroke();

    // --- 2. Dual Fuel Dispensers on Island ---
    // Pump 1
    this.drawDetailedDispenser(ctx, islandCX - 12 * zoom, islandCY - 4 * zoom, zoom, isDieselOnly);
    // Pump 2
    this.drawDetailedDispenser(ctx, islandCX + 12 * zoom, islandCY - 4 * zoom, zoom, isDieselOnly);

    // Steel Safety Bollards at island tips
    this.drawBollard(ctx, islandCX - islandW * 0.45, islandCY, zoom);
    this.drawBollard(ctx, islandCX + islandW * 0.45, islandCY, zoom);

    // --- 3. Four Structural Steel Support Columns ---
    const pillarPositions = [
      { x: left.x + 8 * zoom, y: left.y + halfH },
      { x: right.x - 8 * zoom, y: right.y + halfH },
      { x: top.x + 12 * zoom, y: top.y + halfH },
      { x: bottom.x - 12 * zoom, y: bottom.y + halfH }
    ];

    pillarPositions.forEach(p => {
      // Column Base Plate
      ctx.fillStyle = '#475569';
      ctx.fillRect(p.x - 2 * zoom, p.y - 3 * zoom, 4 * zoom, 3 * zoom);

      // Steel Column
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(p.x - 1.5 * zoom, p.y - canopyClearance, 3 * zoom, canopyClearance);

      // Column Highlight
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(p.x - 1.5 * zoom, p.y - canopyClearance, 1 * zoom, canopyClearance);
    });

    // --- 4. Night Lighting Pool Under Canopy ---
    if (isNight) {
      ctx.fillStyle = 'rgba(254, 240, 138, 0.22)';
      ctx.beginPath();
      ctx.ellipse(islandCX, islandCY, islandW * 0.9, islandH * 1.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // --- 5. Elevated Canopy Roof (Floating Above Ground!) ---
    // Underbelly Ceiling
    ctx.fillStyle = isNight ? '#1e293b' : '#f1f5f9';
    ctx.beginPath();
    ctx.moveTo(top.x, top.y + halfH - canopyClearance);
    ctx.lineTo(right.x, right.y + halfH - canopyClearance);
    ctx.lineTo(bottom.x, bottom.y + halfH - canopyClearance);
    ctx.lineTo(left.x, left.y + halfH - canopyClearance);
    ctx.closePath();
    ctx.fill();

    // Fluorescent Light Strips Flush in Ceiling
    ctx.fillStyle = isNight ? '#ffffff' : '#e2e8f0';
    ctx.shadowColor = isNight ? '#fef08a' : 'transparent';
    ctx.shadowBlur = isNight ? 10 : 0;
    ctx.fillRect(islandCX - 16 * zoom, top.y + halfH - canopyClearance + 6 * zoom, 10 * zoom, 2 * zoom);
    ctx.fillRect(islandCX + 6 * zoom, top.y + halfH - canopyClearance + 6 * zoom, 10 * zoom, 2 * zoom);
    ctx.shadowBlur = 0;

    // Left Fascia Band
    ctx.fillStyle = isDieselOnly ? '#059669' : '#d97706';
    ctx.beginPath();
    ctx.moveTo(left.x, left.y + halfH - canopyClearance);
    ctx.lineTo(bottom.x, bottom.y + halfH - canopyClearance);
    ctx.lineTo(bottom.x, bottom.y + halfH - canopyClearance - canopyThickness);
    ctx.lineTo(left.x, left.y + halfH - canopyClearance - canopyThickness);
    ctx.closePath();
    ctx.fill();

    // Right Fascia Band
    ctx.fillStyle = isDieselOnly ? '#10b981' : '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(bottom.x, bottom.y + halfH - canopyClearance);
    ctx.lineTo(right.x, right.y + halfH - canopyClearance);
    ctx.lineTo(right.x, right.y + halfH - canopyClearance - canopyThickness);
    ctx.lineTo(bottom.x, bottom.y + halfH - canopyClearance - canopyThickness);
    ctx.closePath();
    ctx.fill();

    // Canopy Roof Surface (Top)
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(top.x, top.y + halfH - canopyClearance - canopyThickness);
    ctx.lineTo(right.x, right.y + halfH - canopyClearance - canopyThickness);
    ctx.lineTo(bottom.x, bottom.y + halfH - canopyClearance - canopyThickness);
    ctx.lineTo(left.x, left.y + halfH - canopyClearance - canopyThickness);
    ctx.closePath();
    ctx.fill();

    // Illuminated Brand Logo on Fascia
    ctx.fillStyle = '#ffffff';
    ctx.font = `black ${Math.max(9, 10 * zoom)}px 'Chakra Petch', sans-serif`;
    ctx.textAlign = 'center';
    ctx.shadowColor = isNight ? (isDieselOnly ? '#34d399' : '#fbbf24') : 'transparent';
    ctx.shadowBlur = isNight ? 8 : 0;
    ctx.fillText(
      isDieselOnly ? 'DIESEL FREIGHT' : 'OASIS 76',
      (left.x + bottom.x) / 2,
      bottom.y + halfH - canopyClearance - 3 * zoom
    );
    ctx.shadowBlur = 0;
  }

  /**
   * Detailed Dual Fuel Dispenser Pump
   */
  private static drawDetailedDispenser(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    zoom: number,
    isDiesel: boolean
  ): void {
    const w = 8 * zoom;
    const h = 18 * zoom;

    // Pump Body
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - w / 2, y - h, w, h);

    // Fuel Grade Panel
    ctx.fillStyle = isDiesel ? '#10b981' : '#f59e0b';
    ctx.fillRect(x - w / 2 + 1 * zoom, y - h + 3 * zoom, w - 2 * zoom, 5 * zoom);

    // Digital Gallons/Price LED Readout
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - w / 2 + 1.5 * zoom, y - h + 9 * zoom, w - 3 * zoom, 4 * zoom);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x - w / 2 + 2 * zoom, y - h + 10 * zoom, w - 4 * zoom, 2 * zoom);

    // Fuel Hose & Hanging Nozzle
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2 * zoom;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y - 8 * zoom);
    ctx.bezierCurveTo(x - w / 2 - 3 * zoom, y - 6 * zoom, x - w / 2 - 2 * zoom, y - 1 * zoom, x - w / 2, y - 2 * zoom);
    ctx.stroke();
  }

  /**
   * REAL-WORLD EV CHARGING STALL (NOT A CONTAINER BOX!)
   * Features green asphalt parking stall with white EV stencil,
   * plus slim aerodynamic Tesla/Electrify America style charging pedestals.
   */
  private static drawEVChargingStall(
    ctx: CanvasRenderingContext2D,
    top: any,
    right: any,
    bottom: any,
    left: any,
    zoom: number,
    isNight: boolean
  ): void {
    const halfH = (TILE_HEIGHT / 2) * zoom;

    // 1. Green Painted Asphalt Parking Stall Surface
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.moveTo(top.x, top.y + halfH);
    ctx.lineTo(right.x, right.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH);
    ctx.lineTo(left.x, left.y + halfH);
    ctx.closePath();
    ctx.fill();

    // White Stall Border Lines
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.5 * zoom;
    ctx.stroke();

    // White Painted EV Stencil on Asphalt
    const stallCX = (top.x + bottom.x) / 2;
    const stallCY = (top.y + bottom.y) / 2 + halfH;
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(7, 8 * zoom)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('⚡ EV ONLY', stallCX, stallCY + 4 * zoom);

    // 2. Slim Modern Charging Pedestal at Head of Stall
    const pedX = (top.x + right.x) / 2;
    const pedY = (top.y + right.y) / 2 + halfH - 4 * zoom;
    const pedW = 8 * zoom;
    const pedH = 26 * zoom;

    // Concrete Mount Pad
    ctx.fillStyle = '#64748b';
    ctx.fillRect(pedX - pedW / 2 - 1 * zoom, pedY - 2 * zoom, pedW + 2 * zoom, 3 * zoom);

    // White Enamel Pedestal Body
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(pedX - pedW / 2, pedY - pedH, pedW, pedH, 2 * zoom);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Hollow Center Cutout with Glowing Cyan Status Ring
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(pedX, pedY - pedH + 10 * zoom, 2.5 * zoom, 4 * zoom, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = isNight ? 10 : 4;
    ctx.beginPath();
    ctx.arc(pedX, pedY - pedH + 10 * zoom, 2 * zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Liquid-Cooled Charging Cable
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8 * zoom;
    ctx.beginPath();
    ctx.moveTo(pedX + pedW / 2, pedY - pedH + 12 * zoom);
    ctx.quadraticCurveTo(pedX + pedW / 2 + 3 * zoom, pedY - 4 * zoom, pedX + pedW / 2, pedY - 2 * zoom);
    ctx.stroke();
  }

  /**
   * REAL-WORLD CONVENIENCE STORE (OASIS QUICKMART)
   * Real retail architecture with glass storefront, illuminated aisles,
   * 3D rooftop parapet logo, automatic sliding doors, and outdoor ice merchandiser.
   */
  private static drawQuickMartStore(
    ctx: CanvasRenderingContext2D,
    top: any,
    right: any,
    bottom: any,
    left: any,
    zoom: number,
    isNight: boolean
  ): void {
    const halfH = (TILE_HEIGHT / 2) * zoom;
    const bHeight = 46 * zoom;

    // --- 1. Masonry Walls (Modern Commercial Stucco) ---
    ctx.fillStyle = '#334155'; // Left wall
    ctx.beginPath();
    ctx.moveTo(left.x, left.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH - bHeight);
    ctx.lineTo(left.x, left.y + halfH - bHeight);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1e293b'; // Right wall
    ctx.beginPath();
    ctx.moveTo(bottom.x, bottom.y + halfH);
    ctx.lineTo(right.x, right.y + halfH);
    ctx.lineTo(right.x, right.y + halfH - bHeight);
    ctx.lineTo(bottom.x, bottom.y + halfH - bHeight);
    ctx.closePath();
    ctx.fill();

    // --- 2. Floor-to-Ceiling Glass Storefront ---
    const glassX = left.x + 6 * zoom;
    const glassW = (bottom.x - left.x) - 12 * zoom;
    const glassY = bottom.y + halfH - 28 * zoom;
    const glassH = 24 * zoom;

    // Illuminated Store Interior (Warm Glow with Snack Aisles)
    ctx.fillStyle = isNight ? '#fef08a' : '#f0fdf4';
    ctx.fillRect(glassX, glassY, glassW, glassH);

    // Interior Snack Gondola Shelves & Beverage Cooler Wall
    ctx.fillStyle = '#b45309';
    ctx.fillRect(glassX + 4 * zoom, glassY + 9 * zoom, glassW - 8 * zoom, 4 * zoom);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(glassX + 4 * zoom, glassY + 16 * zoom, glassW - 8 * zoom, 3 * zoom);

    // Dark Aluminum Window Frames & Central Mullion
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5 * zoom;
    ctx.strokeRect(glassX, glassY, glassW, glassH);
    ctx.beginPath();
    ctx.moveTo(glassX + glassW / 2, glassY);
    ctx.lineTo(glassX + glassW / 2, glassY + glassH);
    ctx.stroke();

    // Automatic Sliding Doors (Center)
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(glassX + glassW / 2 - 4 * zoom, glassY + 6 * zoom, 8 * zoom, 18 * zoom);
    ctx.strokeStyle = '#0284c7';
    ctx.strokeRect(glassX + glassW / 2 - 4 * zoom, glassY + 6 * zoom, 8 * zoom, 18 * zoom);

    // Outdoor Merchandiser Ice Chest ("ICE")
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(left.x - 2 * zoom, bottom.y + halfH - 12 * zoom, 7 * zoom, 10 * zoom);
    ctx.strokeStyle = '#0284c7';
    ctx.strokeRect(left.x - 2 * zoom, bottom.y + halfH - 12 * zoom, 7 * zoom, 10 * zoom);
    ctx.fillStyle = '#0284c7';
    ctx.font = `black ${Math.max(5, 6 * zoom)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('ICE', left.x + 1.5 * zoom, bottom.y + halfH - 6 * zoom);

    // --- 3. Flat Commercial Roof with HVAC Units ---
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(top.x, top.y + halfH - bHeight);
    ctx.lineTo(right.x, right.y + halfH - bHeight);
    ctx.lineTo(bottom.x, bottom.y + halfH - bHeight);
    ctx.lineTo(left.x, left.y + halfH - bHeight);
    ctx.closePath();
    ctx.fill();

    // Rooftop HVAC Condenser Units
    ctx.fillStyle = '#64748b';
    ctx.fillRect(top.x + 8 * zoom, top.y + halfH - bHeight - 6 * zoom, 8 * zoom, 6 * zoom);
    ctx.fillRect(top.x + 22 * zoom, top.y + halfH - bHeight - 5 * zoom, 7 * zoom, 5 * zoom);

    // --- 4. Illuminated Green Brand Parapet Sign ---
    ctx.fillStyle = '#059669';
    ctx.fillRect(left.x + 4 * zoom, bottom.y + halfH - bHeight - 8 * zoom, glassW + 4 * zoom, 10 * zoom);
    ctx.fillStyle = '#ffffff';
    ctx.font = `black ${Math.max(9, 10 * zoom)}px 'Chakra Petch', sans-serif`;
    ctx.textAlign = 'center';
    ctx.shadowColor = isNight ? '#34d399' : 'transparent';
    ctx.shadowBlur = isNight ? 10 : 0;
    ctx.fillText('24/7 QUICKMART', (left.x + bottom.x) / 2, bottom.y + halfH - bHeight - 1 * zoom);
    ctx.shadowBlur = 0;
  }

  /**
   * REAL-WORLD 2-STORY ROADSIDE MOTEL
   * Red-tile shingle roof, exterior concrete walkway with steel railing,
   * numbered doors, curtained glowing windows, and iconic freestanding neon sign.
   */
  private static drawArchitecturalMotel(
    ctx: CanvasRenderingContext2D,
    top: any,
    right: any,
    bottom: any,
    left: any,
    zoom: number,
    isNight: boolean,
    building: PlacedBuilding
  ): void {
    const halfH = (TILE_HEIGHT / 2) * zoom;
    const bHeight = 52 * zoom;

    // --- 1. Stucco / Terracotta Exterior Walls ---
    ctx.fillStyle = '#9a3412'; // Warm Desert Terracotta
    ctx.beginPath();
    ctx.moveTo(left.x, left.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH - bHeight);
    ctx.lineTo(left.x, left.y + halfH - bHeight);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.moveTo(bottom.x, bottom.y + halfH);
    ctx.lineTo(right.x, right.y + halfH);
    ctx.lineTo(right.x, right.y + halfH - bHeight);
    ctx.lineTo(bottom.x, bottom.y + halfH - bHeight);
    ctx.closePath();
    ctx.fill();

    // --- 2. Concrete 2nd-Floor Exterior Walkway with Railing ---
    const midY = bottom.y + halfH - bHeight * 0.52;
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(left.x, midY, (bottom.x - left.x), 3 * zoom);

    // Steel Safety Handrail
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.2 * zoom;
    ctx.beginPath();
    ctx.moveTo(left.x, midY - 6 * zoom);
    ctx.lineTo(bottom.x, midY - 6 * zoom);
    ctx.stroke();

    // --- 3. Ground & Upper Level Room Doors & Windows ---
    const isOccupied = building.roomStatus === 'OCCUPIED';

    // Ground Floor Door 101 & Window
    const d1X = left.x + (bottom.x - left.x) * 0.28;
    const d1Y = bottom.y + halfH - 20 * zoom;
    ctx.fillStyle = '#451a03';
    ctx.fillRect(d1X, d1Y, 7 * zoom, 18 * zoom);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(d1X + 5 * zoom, d1Y + 9 * zoom, 1 * zoom, 2 * zoom); // Brass handle

    const w1X = left.x + (bottom.x - left.x) * 0.65;
    ctx.fillStyle = isNight && isOccupied ? '#fef08a' : isNight ? '#0369a1' : '#bae6fd';
    ctx.fillRect(w1X, d1Y + 3 * zoom, 10 * zoom, 11 * zoom);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1;
    ctx.strokeRect(w1X, d1Y + 3 * zoom, 10 * zoom, 11 * zoom);

    // AC Condenser Unit under Window
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(w1X, d1Y + 15 * zoom, 8 * zoom, 4 * zoom);

    // 2nd Floor Door 201 & Window
    const d2Y = midY - 20 * zoom;
    ctx.fillStyle = '#451a03';
    ctx.fillRect(d1X, d2Y, 7 * zoom, 18 * zoom);

    ctx.fillStyle = isNight && isOccupied ? '#fef08a' : isNight ? '#0369a1' : '#bae6fd';
    ctx.fillRect(w1X, d2Y + 3 * zoom, 10 * zoom, 11 * zoom);
    ctx.strokeRect(w1X, d2Y + 3 * zoom, 10 * zoom, 11 * zoom);

    // --- 4. Sloping Spanish Clay Tile Shingle Roof ---
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.moveTo(top.x, top.y + halfH - bHeight - 8 * zoom);
    ctx.lineTo(right.x + 3 * zoom, right.y + halfH - bHeight);
    ctx.lineTo(bottom.x, bottom.y + halfH - bHeight);
    ctx.lineTo(left.x - 3 * zoom, left.y + halfH - bHeight);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 1.5 * zoom;
    ctx.stroke();

    // --- 5. Glowing Rooftop Neon "MOTEL - VACANCY" Sign ---
    const signX = (top.x + bottom.x) / 2;
    const signY = top.y + halfH - bHeight - 16 * zoom;

    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(signX - 18 * zoom, signY, 36 * zoom, 13 * zoom);
    ctx.strokeStyle = '#818cf8';
    ctx.strokeRect(signX - 18 * zoom, signY, 36 * zoom, 13 * zoom);

    ctx.fillStyle = '#c084fc';
    ctx.font = `bold ${Math.max(8, 9 * zoom)}px 'Chakra Petch', sans-serif`;
    ctx.textAlign = 'center';
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = isNight ? 10 : 3;
    ctx.fillText('MOTEL 66', signX, signY + 7.5 * zoom);

    ctx.font = `bold ${Math.max(6, 6.5 * zoom)}px sans-serif`;
    ctx.fillStyle = isOccupied ? '#ef4444' : '#22c55e';
    ctx.shadowColor = isOccupied ? '#f87171' : '#4ade80';
    ctx.fillText(isOccupied ? 'NO VACANCY' : 'VACANCY', signX, signY + 11.5 * zoom);
    ctx.shadowBlur = 0;
  }

  /**
   * Soundproof Trucker Sleep Pod
   */
  private static drawTruckerSleepPod(
    ctx: CanvasRenderingContext2D,
    top: any,
    right: any,
    bottom: any,
    left: any,
    zoom: number,
    isNight: boolean,
    building: PlacedBuilding
  ): void {
    const halfH = (TILE_HEIGHT / 2) * zoom;
    const bHeight = 36 * zoom;

    // Dark Corrugated Steel Pod
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(left.x, left.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH - bHeight);
    ctx.lineTo(left.x, left.y + halfH - bHeight);
    ctx.closePath();
    ctx.fill();

    // Heavy Security Steel Door
    const doorX = (left.x + bottom.x) / 2 - 5 * zoom;
    const doorY = bottom.y + halfH - 22 * zoom;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(doorX, doorY, 10 * zoom, 20 * zoom);
    ctx.strokeStyle = '#6366f1';
    ctx.strokeRect(doorX, doorY, 10 * zoom, 20 * zoom);

    // Warm Porch Lantern
    ctx.fillStyle = isNight ? '#fef08a' : '#cbd5e1';
    ctx.shadowColor = isNight ? '#fef08a' : 'transparent';
    ctx.shadowBlur = isNight ? 8 : 0;
    ctx.beginPath();
    ctx.arc(doorX + 13 * zoom, doorY + 4 * zoom, 2 * zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Flat Roof & HVAC Cap
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(top.x, top.y + halfH - bHeight);
    ctx.lineTo(right.x, right.y + halfH - bHeight);
    ctx.lineTo(bottom.x, bottom.y + halfH - bHeight);
    ctx.lineTo(left.x, left.y + halfH - bHeight);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect((top.x + bottom.x) / 2 - 3 * zoom, top.y + halfH - bHeight - 5 * zoom, 6 * zoom, 5 * zoom);

    const isOccupied = building.roomStatus === 'OCCUPIED';
    ctx.fillStyle = isOccupied ? '#ef4444' : '#10b981';
    ctx.font = `bold ${Math.max(7, 8 * zoom)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(isOccupied ? '💤 ASLEEP' : 'VACANT', (left.x + bottom.x) / 2, doorY - 4 * zoom);
  }

  /**
   * Classic American Chrome Streamliner Roadside Diner
   */
  private static drawStreamlinerDiner(
    ctx: CanvasRenderingContext2D,
    top: any,
    right: any,
    bottom: any,
    left: any,
    zoom: number,
    isNight: boolean
  ): void {
    const halfH = (TILE_HEIGHT / 2) * zoom;
    const bHeight = 46 * zoom;

    // Polished Chrome Aluminum Wall
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(left.x, left.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH - bHeight);
    ctx.lineTo(left.x, left.y + halfH - bHeight);
    ctx.closePath();
    ctx.fill();

    // Red Enamel Racing Stripe
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(left.x, bottom.y + halfH - 8 * zoom, (bottom.x - left.x), 4 * zoom);

    // Warm Illuminated Diner Panoramic Windows
    const winY = bottom.y + halfH - 26 * zoom;
    const winH = 16 * zoom;
    const winW = (bottom.x - left.x) - 10 * zoom;
    ctx.fillStyle = isNight ? '#fef08a' : '#fdba74';
    ctx.fillRect(left.x + 5 * zoom, winY, winW, winH);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5 * zoom;
    ctx.strokeRect(left.x + 5 * zoom, winY, winW, winH);

    // Diner Roof with Curved Chrome Edges
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(top.x, top.y + halfH - bHeight);
    ctx.lineTo(right.x, right.y + halfH - bHeight);
    ctx.lineTo(bottom.x, bottom.y + halfH - bHeight);
    ctx.lineTo(left.x, left.y + halfH - bHeight);
    ctx.closePath();
    ctx.fill();

    // Stainless Steel Kitchen Chimney
    ctx.fillStyle = '#64748b';
    ctx.fillRect(top.x + 10 * zoom, top.y + halfH - bHeight - 10 * zoom, 4 * zoom, 10 * zoom);

    // Rooftop Glowing Neon Burger Sign
    const signX = (top.x + bottom.x) / 2;
    const signY = top.y + halfH - bHeight - 16 * zoom;

    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(signX - 16 * zoom, signY, 32 * zoom, 12 * zoom);
    ctx.strokeStyle = '#f87171';
    ctx.strokeRect(signX - 16 * zoom, signY, 32 * zoom, 12 * zoom);

    ctx.fillStyle = '#fef08a';
    ctx.font = `bold ${Math.max(8, 9 * zoom)}px 'Chakra Petch', sans-serif`;
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = isNight ? 10 : 3;
    ctx.fillText('🍔 DINER & GRILL', signX, signY + 8 * zoom);
    ctx.shadowBlur = 0;
  }

  /**
   * Express Tunnel Car Wash
   */
  private static drawCarWashTunnel(
    ctx: CanvasRenderingContext2D,
    top: any,
    right: any,
    bottom: any,
    left: any,
    zoom: number,
    isNight: boolean
  ): void {
    const halfH = (TILE_HEIGHT / 2) * zoom;
    const bHeight = 38 * zoom;

    ctx.fillStyle = 'rgba(2, 132, 199, 0.75)';
    ctx.beginPath();
    ctx.moveTo(left.x, left.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH - bHeight);
    ctx.lineTo(left.x, left.y + halfH - bHeight);
    ctx.closePath();
    ctx.fill();

    // Height Clearance Warning Bar
    ctx.fillStyle = '#eab308';
    ctx.fillRect(left.x + 4 * zoom, bottom.y + halfH - bHeight + 4 * zoom, (bottom.x - left.x) - 8 * zoom, 3 * zoom);

    // Rotating Foam Wash Cylinders
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(left.x + 8 * zoom, bottom.y + halfH - 24 * zoom, 6 * zoom, 18 * zoom);
    ctx.fillRect(bottom.x - 14 * zoom, bottom.y + halfH - 24 * zoom, 6 * zoom, 18 * zoom);

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(8, 9 * zoom)}px 'Chakra Petch', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('EXPRESS CAR WASH', (left.x + bottom.x) / 2, bottom.y + halfH - bHeight);
  }

  /**
   * Sanitary Restroom Pavilion
   */
  private static drawRestroomPavilion(
    ctx: CanvasRenderingContext2D,
    top: any,
    right: any,
    bottom: any,
    left: any,
    zoom: number,
    isNight: boolean
  ): void {
    const halfH = (TILE_HEIGHT / 2) * zoom;
    const bHeight = 30 * zoom;

    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.moveTo(left.x, left.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH - bHeight);
    ctx.lineTo(left.x, left.y + halfH - bHeight);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(7, 8 * zoom)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('🚻 RESTROOMS', (left.x + bottom.x) / 2, bottom.y + halfH - 12 * zoom);
  }

  /**
   * 60ft Highway Billboard
   */
  private static drawHighwayMegaboard(
    ctx: CanvasRenderingContext2D,
    bottom: any,
    zoom: number,
    isNight: boolean
  ): void {
    const x = bottom.x;
    const y = bottom.y;
    const mastHeight = 48 * zoom;

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2 * zoom;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - mastHeight);
    ctx.stroke();

    const bbW = 54 * zoom;
    const bbH = 26 * zoom;
    const bbX = x - bbW / 2;
    const bbY = y - mastHeight - bbH;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bbX - 2 * zoom, bbY - 2 * zoom, bbW + 4 * zoom, bbH + 4 * zoom);

    const bgGrad = ctx.createLinearGradient(bbX, bbY, bbX + bbW, bbY + bbH);
    bgGrad.addColorStop(0, '#be185d');
    bgGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(bbX, bbY, bbW, bbH);

    ctx.fillStyle = '#fde047';
    ctx.font = `black ${Math.max(8, 9 * zoom)}px 'Chakra Petch', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('ROUTE 66 OASIS', x, bbY + 9 * zoom);

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(6, 6.5 * zoom)}px sans-serif`;
    ctx.fillText('NEXT EXIT • DIESEL • MOTEL', x, bbY + 17 * zoom);
    ctx.fillText('☕ 24/7 MART & BURGERS', x, bbY + 23 * zoom);
  }

  /**
   * Tropical Oasis Palm Tree
   */
  private static drawOasisPalmTree(
    ctx: CanvasRenderingContext2D,
    bottom: any,
    zoom: number
  ): void {
    const x = bottom.x;
    const y = bottom.y;
    const trunkHeight = 36 * zoom;

    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(x, y, 7 * zoom, 4 * zoom, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#854d0e';
    ctx.lineWidth = 3.5 * zoom;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 4 * zoom, y - trunkHeight * 0.4, x - 3 * zoom, y - trunkHeight * 0.7, x + 2 * zoom, y - trunkHeight);
    ctx.stroke();

    const crownX = x + 2 * zoom;
    const crownY = y - trunkHeight;

    const fronds = [
      { dx: -18, dy: -6 },
      { dx: 18, dy: -6 },
      { dx: -12, dy: -14 },
      { dx: 12, dy: -14 },
      { dx: -16, dy: 6 },
      { dx: 16, dy: 6 }
    ];

    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 2.5 * zoom;
    fronds.forEach(f => {
      ctx.beginPath();
      ctx.moveTo(crownX, crownY);
      ctx.quadraticCurveTo(crownX + (f.dx * 0.6) * zoom, crownY + (f.dy * 0.5 - 4) * zoom, crownX + f.dx * zoom, crownY + f.dy * zoom);
      ctx.stroke();
    });
  }

  /**
   * Paved Surface (Parking bays, Driveway)
   */
  private static drawPavedLot(
    ctx: CanvasRenderingContext2D,
    top: any,
    right: any,
    bottom: any,
    left: any,
    zoom: number,
    type: string
  ): void {
    const halfH = (TILE_HEIGHT / 2) * zoom;

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(top.x, top.y + halfH);
    ctx.lineTo(right.x, right.y + halfH);
    ctx.lineTo(bottom.x, bottom.y + halfH);
    ctx.lineTo(left.x, left.y + halfH);
    ctx.closePath();
    ctx.fill();

    if (type === 'PARKING_CAR' || type === 'PARKING_TRUCK') {
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.5 * zoom;
      ctx.beginPath();
      ctx.moveTo(left.x + 4 * zoom, left.y + halfH);
      ctx.lineTo(top.x + 4 * zoom, top.y + halfH);
      ctx.moveTo(bottom.x - 4 * zoom, bottom.y + halfH);
      ctx.lineTo(right.x - 4 * zoom, right.y + halfH);
      ctx.stroke();
    }
  }

  private static drawBollard(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    zoom: number
  ): void {
    ctx.fillStyle = '#eab308';
    ctx.fillRect(x - 1.5 * zoom, y - 8 * zoom, 3 * zoom, 8 * zoom);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 1.5 * zoom, y - 6 * zoom, 3 * zoom, 2 * zoom);
  }
}
