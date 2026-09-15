import { Vehicle, VehicleClass } from '../types';
import { gridToScreen, TILE_HEIGHT, TILE_WIDTH } from '../core/Isometric';

export class VehicleRenderer {
  /**
   * Render a realistic vehicle in 2.5D isometric perspective
   */
  public static renderVehicle(
    ctx: CanvasRenderingContext2D,
    v: Vehicle,
    cameraX: number,
    cameraY: number,
    zoom: number,
    hourOfDay: number
  ): void {
    const sc = gridToScreen(v.x, v.y, cameraX, cameraY, zoom);
    const halfH = (TILE_HEIGHT / 2) * zoom;
    const isNight = hourOfDay < 6 || hourOfDay >= 20;
    const isDusk = (hourOfDay >= 18 && hourOfDay < 20) || (hourOfDay >= 6 && hourOfDay < 8);

    const drawX = sc.x;
    const drawY = sc.y + halfH;

    ctx.save();

    // 1. Draw Directional Headlight Cones at Night/Dusk
    if (isNight || isDusk) {
      this.drawHeadlights(ctx, v, drawX, drawY, zoom, isNight ? 0.35 : 0.18);
    }

    // 2. Draw Realistic Drop Shadow
    this.drawDropShadow(ctx, v, drawX, drawY, zoom);

    // 3. Render Vehicle Geometry based on Class
    switch (v.vehicleClass) {
      case 'SEMI_TRUCK':
      case 'REEFER_TRUCK':
        this.drawSemiTruck(ctx, v, drawX, drawY, zoom, isNight);
        break;
      case 'CAMPER_RV':
        this.drawCamperRV(ctx, v, drawX, drawY, zoom, isNight);
        break;
      case 'SPORTS_CAR':
        this.drawSportsCar(ctx, v, drawX, drawY, zoom, isNight);
        break;
      case 'ELECTRIC_CAR':
        this.drawElectricCar(ctx, v, drawX, drawY, zoom, isNight);
        break;
      case 'SUV':
        this.drawSUV(ctx, v, drawX, drawY, zoom, isNight);
        break;
      case 'MOTORCYCLE':
        this.drawMotorcycle(ctx, v, drawX, drawY, zoom);
        break;
      case 'SEDAN':
      default:
        this.drawSedan(ctx, v, drawX, drawY, zoom, isNight);
        break;
    }

    // 4. Glowing Red Taillights at Night
    if (isNight || isDusk) {
      this.drawTaillights(ctx, v, drawX, drawY, zoom);
    }

    ctx.restore();
  }

  /**
   * Headlight light cone illuminating the asphalt ahead of the car
   */
  private static drawHeadlights(
    ctx: CanvasRenderingContext2D,
    v: Vehicle,
    x: number,
    y: number,
    zoom: number,
    intensity: number
  ): void {
    ctx.save();
    const beamLength = 70 * zoom;
    const beamSpread = 32 * zoom;

    // Headlight cone facing forward (East / Highway flow)
    const grad = ctx.createRadialGradient(
      x + 15 * zoom, y - 4 * zoom, 2 * zoom,
      x + beamLength, y - 4 * zoom, beamLength
    );
    grad.addColorStop(0, `rgba(254, 240, 138, ${intensity * 1.5})`);
    grad.addColorStop(0.4, `rgba(253, 224, 71, ${intensity * 0.8})`);
    grad.addColorStop(1, 'rgba(253, 224, 71, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x + 12 * zoom, y - 4 * zoom);
    ctx.lineTo(x + beamLength, y - 4 * zoom - beamSpread / 2);
    ctx.lineTo(x + beamLength, y - 4 * zoom + beamSpread / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /**
   * Realistic contact shadow
   */
  private static drawDropShadow(
    ctx: CanvasRenderingContext2D,
    v: Vehicle,
    x: number,
    y: number,
    zoom: number
  ): void {
    const isTruck = v.vehicleClass === 'SEMI_TRUCK' || v.vehicleClass === 'REEFER_TRUCK';
    const isRV = v.vehicleClass === 'CAMPER_RV';
    const len = (isTruck ? 52 : isRV ? 38 : 26) * zoom;
    const width = (isTruck ? 14 : isRV ? 13 : 11) * zoom;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x - (isTruck ? 8 * zoom : 0), y + 2 * zoom, len * 0.52, width * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * 18-Wheeler Heavy Freight Semi-Truck with Kenworth Tractor & 53ft Trailer
   */
  private static drawSemiTruck(
    ctx: CanvasRenderingContext2D,
    v: Vehicle,
    x: number,
    y: number,
    zoom: number,
    isNight: boolean
  ): void {
    const isReefer = v.vehicleClass === 'REEFER_TRUCK';

    // Dimensions
    const cabLength = 20 * zoom;
    const cabWidth = 14 * zoom;
    const cabHeight = 16 * zoom;

    const trailerLength = 38 * zoom;
    const trailerWidth = 14 * zoom;
    const trailerHeight = 20 * zoom;

    const trailerX = x - 22 * zoom;
    const cabX = x + 8 * zoom;

    // --- 1. Semi Trailer ---
    // Trailer Shadow / Underside
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(trailerX - trailerLength / 2, y - 4 * zoom, trailerLength, 3 * zoom);

    // Trailer Body (White or Stainless Steel Corrugated)
    const trailerColor = isReefer ? '#f1f5f9' : '#e2e8f0';
    ctx.fillStyle = trailerColor;
    ctx.fillRect(trailerX - trailerLength / 2, y - trailerHeight, trailerLength, trailerHeight - 4 * zoom);

    // Corrugation ribs
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    for (let rx = trailerX - trailerLength / 2 + 4 * zoom; rx < trailerX + trailerLength / 2 - 2 * zoom; rx += 4 * zoom) {
      ctx.beginPath();
      ctx.moveTo(rx, y - trailerHeight);
      ctx.lineTo(rx, y - 4 * zoom);
      ctx.stroke();
    }

    // Trailer Roof Trim
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(trailerX - trailerLength / 2, y - trailerHeight - 2 * zoom, trailerLength, 2 * zoom);

    // Tandem Dual Wheels (Rear of trailer)
    this.drawWheel(ctx, trailerX - trailerLength / 2 + 5 * zoom, y - 1 * zoom, 4.5 * zoom);
    this.drawWheel(ctx, trailerX - trailerLength / 2 + 13 * zoom, y - 1 * zoom, 4.5 * zoom);

    // Thermo-King Refrigeration Unit (if Reefer)
    if (isReefer) {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(trailerX + trailerLength / 2 - 4 * zoom, y - trailerHeight + 2 * zoom, 4 * zoom, 8 * zoom);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(trailerX + trailerLength / 2 - 3 * zoom, y - trailerHeight + 4 * zoom, 2 * zoom, 3 * zoom);
    }

    // --- 2. Tractor Cab ---
    // Cab Body (Painted in driver's vehicle color)
    ctx.fillStyle = v.color;
    ctx.fillRect(cabX - cabLength / 2, y - cabHeight, cabLength, cabHeight - 3 * zoom);

    // Aerodynamic Roof Fairing / Deflector
    ctx.fillStyle = this.adjustBrightness(v.color, -15);
    ctx.beginPath();
    ctx.moveTo(cabX - cabLength / 2, y - cabHeight);
    ctx.lineTo(cabX + cabLength * 0.1, y - cabHeight - 4 * zoom);
    ctx.lineTo(cabX + cabLength / 2 - 2 * zoom, y - cabHeight);
    ctx.closePath();
    ctx.fill();

    // Windshield & Side Windows
    ctx.fillStyle = isNight ? '#0369a1' : '#bae6fd';
    ctx.fillRect(cabX + 2 * zoom, y - cabHeight + 3 * zoom, 6 * zoom, 5 * zoom);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(cabX - 4 * zoom, y - cabHeight + 3 * zoom, 4 * zoom, 4 * zoom);

    // Chrome Front Bumper & Large Grille
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(cabX + cabLength / 2 - 2 * zoom, y - 8 * zoom, 3 * zoom, 7 * zoom);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(cabX + cabLength / 2 - 2 * zoom, y - 8 * zoom, 3 * zoom, 7 * zoom);

    // Vertical Chrome Exhaust Smoke Stacks
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cabX - cabLength / 2 + 2 * zoom, y - cabHeight - 6 * zoom, 2 * zoom, 10 * zoom);
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(cabX - cabLength / 2 + 3 * zoom, y - cabHeight - 6 * zoom, 1.2 * zoom, 0, Math.PI * 2);
    ctx.fill();

    // Tractor Wheels (Front steer wheel + tandem drive wheels)
    this.drawWheel(ctx, cabX + cabLength / 2 - 4 * zoom, y - 1 * zoom, 4.5 * zoom);
    this.drawWheel(ctx, cabX - cabLength / 2 + 4 * zoom, y - 1 * zoom, 4.5 * zoom);

    // Headlight Lens
    ctx.fillStyle = isNight ? '#fef08a' : '#fef9c3';
    ctx.fillRect(cabX + cabLength / 2, y - 6 * zoom, 2 * zoom, 3 * zoom);
  }

  /**
   * Realistic Passenger Sedan
   */
  private static drawSedan(
    ctx: CanvasRenderingContext2D,
    v: Vehicle,
    x: number,
    y: number,
    zoom: number,
    isNight: boolean
  ): void {
    const len = 24 * zoom;
    const height = 9 * zoom;

    // Lower Chassis & Body
    ctx.fillStyle = v.color;
    ctx.beginPath();
    ctx.moveTo(x - len / 2, y - 3 * zoom);
    ctx.lineTo(x - len / 2 + 3 * zoom, y - height * 0.7);
    ctx.lineTo(x - len * 0.15, y - height * 0.7);
    // Windshield slope
    ctx.lineTo(x + 1 * zoom, y - height);
    // Roofline
    ctx.lineTo(x + len * 0.25, y - height);
    // Rear window slope
    ctx.lineTo(x + len * 0.45, y - height * 0.65);
    ctx.lineTo(x + len / 2, y - height * 0.6);
    ctx.lineTo(x + len / 2, y - 3 * zoom);
    ctx.closePath();
    ctx.fill();

    // Metallic body highlight
    ctx.strokeStyle = this.adjustBrightness(v.color, 35);
    ctx.lineWidth = 1 * zoom;
    ctx.stroke();

    // Glass Greenhouse (Windshield & Windows)
    ctx.fillStyle = isNight ? '#075985' : '#7dd3fc';
    ctx.beginPath();
    ctx.moveTo(x - 2 * zoom, y - height * 0.7);
    ctx.lineTo(x + 2 * zoom, y - height + 1 * zoom);
    ctx.lineTo(x + len * 0.22, y - height + 1 * zoom);
    ctx.lineTo(x + len * 0.38, y - height * 0.7);
    ctx.closePath();
    ctx.fill();

    // Wheels
    this.drawWheel(ctx, x - len * 0.3, y - 1 * zoom, 3.5 * zoom);
    this.drawWheel(ctx, x + len * 0.3, y - 1 * zoom, 3.5 * zoom);

    // Front Headlight
    ctx.fillStyle = isNight ? '#fef08a' : '#ffffff';
    ctx.fillRect(x + len / 2 - 1 * zoom, y - height * 0.55, 2 * zoom, 2.5 * zoom);
  }

  /**
   * High-riding SUV
   */
  private static drawSUV(
    ctx: CanvasRenderingContext2D,
    v: Vehicle,
    x: number,
    y: number,
    zoom: number,
    isNight: boolean
  ): void {
    const len = 26 * zoom;
    const height = 12 * zoom;

    // Body
    ctx.fillStyle = v.color;
    ctx.fillRect(x - len / 2, y - height + 2 * zoom, len, height - 4 * zoom);

    // Roof Luggage Rails
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - len * 0.3, y - height, len * 0.6, 2 * zoom);

    // Large Glass Cabin
    ctx.fillStyle = isNight ? '#0c4a6e' : '#38bdf8';
    ctx.fillRect(x - len * 0.25, y - height + 3 * zoom, len * 0.65, 4 * zoom);

    // Flared Wheel Arches & Rugged Tires
    this.drawWheel(ctx, x - len * 0.3, y, 4.2 * zoom);
    this.drawWheel(ctx, x + len * 0.3, y, 4.2 * zoom);

    // Front Chrome Bullbar
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x + len / 2 - 1 * zoom, y - 6 * zoom, 2 * zoom, 5 * zoom);
  }

  /**
   * Aerodynamic Sports Car with Rear Wing
   */
  private static drawSportsCar(
    ctx: CanvasRenderingContext2D,
    v: Vehicle,
    x: number,
    y: number,
    zoom: number,
    isNight: boolean
  ): void {
    const len = 24 * zoom;
    const height = 7 * zoom;

    // Low-slung Aerodynamic Body
    ctx.fillStyle = v.color;
    ctx.beginPath();
    ctx.moveTo(x - len / 2, y - 2 * zoom);
    ctx.lineTo(x - len * 0.2, y - height);
    ctx.lineTo(x + len * 0.2, y - height);
    ctx.lineTo(x + len / 2, y - 2 * zoom);
    ctx.closePath();
    ctx.fill();

    // Rear Carbon Spoiler / Wing
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - len / 2 - 2 * zoom, y - height - 3 * zoom, 5 * zoom, 2 * zoom);
    ctx.fillRect(x - len / 2, y - height - 1 * zoom, 1 * zoom, 2 * zoom);

    // Tinted Racing Windshield
    ctx.fillStyle = isNight ? '#0284c7' : '#0ea5e9';
    ctx.fillRect(x - len * 0.1, y - height + 1 * zoom, len * 0.28, 3 * zoom);

    // Low-profile Alloy Wheels
    this.drawWheel(ctx, x - len * 0.3, y - 1 * zoom, 3.2 * zoom);
    this.drawWheel(ctx, x + len * 0.3, y - 1 * zoom, 3.2 * zoom);

    // Aggressive Xenon Headlights
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(x + len / 2 - 2 * zoom, y - 4 * zoom, 2 * zoom, 2 * zoom);
  }

  /**
   * Sleek Electric Car (Tesla style) with Panoramic Glass Roof
   */
  private static drawElectricCar(
    ctx: CanvasRenderingContext2D,
    v: Vehicle,
    x: number,
    y: number,
    zoom: number,
    isNight: boolean
  ): void {
    const len = 24 * zoom;
    const height = 8.5 * zoom;

    // Minimalist Smooth Body
    ctx.fillStyle = v.color;
    ctx.beginPath();
    ctx.roundRect(x - len / 2, y - height + 1 * zoom, len, height - 3 * zoom, 3 * zoom);
    ctx.fill();

    // Panoramic Dark Tinted Glass Canopy
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(x - len * 0.25, y - height, len * 0.55, 4 * zoom, 2 * zoom);
    ctx.fill();

    // Aero Rims
    this.drawWheel(ctx, x - len * 0.3, y - 1 * zoom, 3.5 * zoom);
    this.drawWheel(ctx, x + len * 0.3, y - 1 * zoom, 3.5 * zoom);

    // LED DRL Light Bar
    ctx.fillStyle = '#a5f3fc';
    ctx.fillRect(x + len / 2 - 1 * zoom, y - 5 * zoom, 1.5 * zoom, 2.5 * zoom);
  }

  /**
   * Winnebago Camper RV
   */
  private static drawCamperRV(
    ctx: CanvasRenderingContext2D,
    v: Vehicle,
    x: number,
    y: number,
    zoom: number,
    isNight: boolean
  ): void {
    const len = 36 * zoom;
    const height = 15 * zoom;

    // Boxy Motorhome Body (Off-White with Accent Stripe)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x - len / 2, y - height + 2 * zoom, len, height - 4 * zoom);

    // RV Side Accent Graphic Stripe
    ctx.fillStyle = v.color;
    ctx.fillRect(x - len / 2, y - height * 0.5, len, 3 * zoom);

    // Rooftop AC Pod
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x - len * 0.1, y - height, 8 * zoom, 3 * zoom);

    // Large Camper Windows
    ctx.fillStyle = isNight ? '#0369a1' : '#38bdf8';
    ctx.fillRect(x - len * 0.35, y - height + 4 * zoom, 6 * zoom, 4 * zoom);
    ctx.fillRect(x - len * 0.1, y - height + 4 * zoom, 8 * zoom, 4 * zoom);
    ctx.fillRect(x + len * 0.2, y - height + 4 * zoom, 5 * zoom, 5 * zoom); // Front cab window

    // Heavy Duty Wheels
    this.drawWheel(ctx, x - len * 0.3, y, 4 * zoom);
    this.drawWheel(ctx, x + len * 0.28, y, 4 * zoom);
  }

  /**
   * Motorcycle with Rider
   */
  private static drawMotorcycle(
    ctx: CanvasRenderingContext2D,
    v: Vehicle,
    x: number,
    y: number,
    zoom: number
  ): void {
    const len = 14 * zoom;

    // Wheels
    this.drawWheel(ctx, x - len / 2, y, 3 * zoom);
    this.drawWheel(ctx, x + len / 2, y, 3 * zoom);

    // Frame & Engine
    ctx.fillStyle = '#334155';
    ctx.fillRect(x - 3 * zoom, y - 4 * zoom, 7 * zoom, 3 * zoom);

    // Fuel Tank (in bike color)
    ctx.fillStyle = v.color;
    ctx.fillRect(x - 1 * zoom, y - 6 * zoom, 5 * zoom, 2.5 * zoom);

    // Rider Torso & Helmet
    ctx.fillStyle = '#1e293b'; // Leather jacket
    ctx.fillRect(x - 3 * zoom, y - 9 * zoom, 4 * zoom, 4 * zoom);
    ctx.fillStyle = '#ef4444'; // Helmet
    ctx.beginPath();
    ctx.arc(x - 1 * zoom, y - 11 * zoom, 2.2 * zoom, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Realistic Rubber Tire with Silver Hubcap
   */
  private static drawWheel(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number
  ): void {
    // Rubber Tire
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Silver Hubcap / Rim
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Glowing Red Taillights
   */
  private static drawTaillights(
    ctx: CanvasRenderingContext2D,
    v: Vehicle,
    x: number,
    y: number,
    zoom: number
  ): void {
    const isTruck = v.vehicleClass === 'SEMI_TRUCK' || v.vehicleClass === 'REEFER_TRUCK';
    const isRV = v.vehicleClass === 'CAMPER_RV';
    const rearX = x - (isTruck ? 41 : isRV ? 19 : 13) * zoom;

    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = 6 * zoom;
    ctx.fillRect(rearX, y - 5 * zoom, 2 * zoom, 3 * zoom);
    ctx.shadowBlur = 0;
  }

  private static adjustBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  }
}
