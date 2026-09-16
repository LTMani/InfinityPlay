/**
 * Railway Commander - Authentic 2.5D Indian Railways Simulator Renderer
 * 
 * Implements high-fidelity perspective rendering for:
 * 1. Indian Railways WAP-7 Electric Locomotive in Rajdhani Express livery
 * 2. LHB Rajdhani passenger coaches with lit interior windows & roof ribs
 * 3. 3 Dynamic Camera Modes:
 *    - 'platform': Cinematic station platform view alongside passengers, coolies, and canopy
 *    - 'cab': First-person driver cockpit view with windshield, wipers & console
 *    - 'chase': Elevated third-person follow cam
 * 4. Arakkonam Junction platform:
 *    - Paved stone tiles with perspective joint lines
 *    - Red coping curb stones & bright yellow tactile safety line
 *    - Blue corrugated iron canopy roof with steel rafters, support columns & warm ceiling lamps
 *    - Trilingual station signboards (Tamil: அரக்கோணம் / English: ARAKKONAM / Hindi: अरक्कोणम)
 * 5. Platform life & crowds:
 *    - Coolies in red kurtas carrying luggage trunks on heads
 *    - Passengers with rolling bags & suitcases
 *    - Traditional "CHAI / SNACKS" tea stall with illuminated display & awning
 *    - Luggage wheel trolleys & parcel carts
 * 6. Track & Electrification:
 *    - Broad gauge active track + parallel depot track with parked ICF rake
 *    - Concrete sleepers with metal pandrol clips & crushed granite ballast bed
 *    - Polished steel rails with specular headlight highlights
 *    - 25kV OHE catenary wires, steel lattice masts, cantilevers & acceleration spark flashes
 * 7. Multi-aspect optical signals, volumetric headlight beams & weather overlays
 */

export class Renderer25D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });

    // Camera Mode: 'platform' (default cinematic view), 'cab' (windscreen), or 'chase' (rear follow)
    this.cameraMode = 'platform';

    // Rain Particle Pool
    this.rainDrops = [];
    this.maxRainDrops = 160;
    this.initRain();

    // Wiper Animation State
    this.wiperAngle = 0;
    this.wiperDirection = 1;

    // Headlight & Spark Animation
    this.animTime = 0;
  }

  initRain() {
    this.rainDrops = [];
    for (let i = 0; i < this.maxRainDrops; i++) {
      this.rainDrops.push({
        x: Math.random(),
        y: Math.random(),
        speed: 0.8 + Math.random() * 0.6,
        length: 12 + Math.random() * 15
      });
    }
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = (rect.width > 0 ? rect.width : window.innerWidth) || 1280;
    const cssH = (rect.height > 0 ? rect.height : window.innerHeight) || 720;
    this.canvas.width = Math.floor(cssW * dpr);
    this.canvas.height = Math.floor(cssH * dpr);
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  setCameraMode(mode) {
    if (mode === 'cab' || mode === 'trackside' || mode === 'chase' || mode === 'platform') {
      this.cameraMode = (mode === 'chase') ? 'trackside' : mode;
    } else {
      this.cameraMode = 'platform';
    }
  }

  cycleCameraMode() {
    if (this.cameraMode === 'platform') {
      this.setCameraMode('cab');
    } else if (this.cameraMode === 'cab') {
      this.setCameraMode('trackside');
    } else {
      this.setCameraMode('platform');
    }
    return this.cameraMode;
  }

  getCameraModeLabel() {
    if (this.cameraMode === 'platform') return '🎥 PLATFORM VIEW';
    if (this.cameraMode === 'cab') return '🎥 CAB VIEW';
    return '🎥 TRACKSIDE VIEW';
  }

  /**
   * Main Render Frame
   */
  render(state, trackManager, signalSystem, stationSystem, missionConfig, dt = 0.016) {
    if (!this.width || !this.height) {
      this.resize();
    }

    this.animTime += dt;

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    const timeOfDay = missionConfig?.timeOfDay || 'sunset';
    const weather = missionConfig?.weather || 'clear';
    const trainPos = state.positionMeters;
    const speedKmh = state.speedKmh;

    // Track Geometry & Curvature
    const trackHalfGauge = 0.838; // Indian Broad Gauge 1676mm / 2 = 0.838m
    const baseCurvature = trackManager?.getCurvatureAt ? trackManager.getCurvatureAt(trainPos) : 0;

    let project;
    let horizonY;
    let cameraZ;

    if (this.cameraMode === 'platform') {
      // Three-quarters cinematic platform view matching reference image
      // Standing on Platform 1 walking lane looking towards approaching WAP-7 locomotive & platform life
      const cameraX = 2.6; // standing on platform 1 walking lane
      const cameraHeight = 1.90; // human eye level on platform (0.85m above 1.05m platform)
      cameraZ = trainPos + 11.2; // positioned 11.2m ahead of the loco nose
      horizonY = h * 0.40;
      const focalLength = w * 0.78;

      project = (x, y, z) => {
        const relZ = cameraZ - z;
        if (relZ <= 0.4) return null;
        const scale = focalLength / relZ;
        const distFromCam = relZ;
        const curveOffset = baseCurvature * (distFromCam * distFromCam) * 0.08;
        const screenX = (w * 0.48) + (x - cameraX - curveOffset) * scale;
        const screenY = horizonY + (cameraHeight - y) * scale;
        return { x: screenX, y: screenY, scale, relZ };
      };
    } else if (this.cameraMode === 'cab') {
      // Driver windscreen cockpit view looking forward (+Z) down track
      const cameraX = 0.32; // loco pilot seat on right/center side
      const cameraHeight = 2.40; // driver eye line in WAP-7 cab
      cameraZ = trainPos;
      horizonY = h * 0.44;
      const focalLength = w * 0.82;

      project = (x, y, z) => {
        const relZ = z - cameraZ;
        if (relZ <= 0.3) return null;
        const scale = focalLength / relZ;
        const distFromCam = relZ;
        const curveOffset = baseCurvature * (distFromCam * distFromCam) * 0.12;
        const screenX = (w * 0.50) + (x - cameraX + curveOffset) * scale;
        const screenY = horizonY + (cameraHeight - y) * scale;
        return { x: screenX, y: screenY, scale, relZ };
      };
    } else {
      // Trackside / railfan elevated exterior cam looking back at approaching train
      const cameraX = -3.8;
      const cameraHeight = 3.4;
      cameraZ = trainPos + 18.0;
      horizonY = h * 0.42;
      const focalLength = w * 0.76;

      project = (x, y, z) => {
        const relZ = cameraZ - z;
        if (relZ <= 0.4) return null;
        const scale = focalLength / relZ;
        const distFromCam = relZ;
        const curveOffset = baseCurvature * (distFromCam * distFromCam) * 0.08;
        const screenX = (w * 0.54) + (x - cameraX - curveOffset) * scale;
        const screenY = horizonY + (cameraHeight - y) * scale;
        return { x: screenX, y: screenY, scale, relZ };
      };
    }

    // 1. Draw Sky & Landscape
    this.drawSkyAndLandscape(ctx, w, h, horizonY, timeOfDay, weather, trainPos);

    // 2. Draw Ground & Ballast Beds (Double Track Corridor)
    this.drawGroundAndBallast(ctx, w, h, horizonY, project, trainPos, timeOfDay);

    // 3. Draw Railroad Sleepers (Concrete Ties with Pandrol Clips)
    this.drawRailTies(ctx, project, trainPos, timeOfDay);

    // 4. Draw Steel Rails (Active Broad Gauge Track + Parallel Track)
    this.drawSteelRails(ctx, project, trainPos, trackHalfGauge, state.headlights, timeOfDay);

    // 5. Draw 25kV OHE Catenary Electric Wires
    this.drawOverheadCatenary(ctx, project, trainPos, timeOfDay);

    // 6. Draw Station Platform (Arakkonam Junction: Floor, Red Curb, Yellow Line, Canopy, Signboard)
    this.drawStationPlatform(ctx, project, trainPos, stationSystem, timeOfDay);

    // 7. Draw Scenery (Coolies, Passengers, Chai Stall, Catenary Masts, Parked Train)
    this.drawScenery(ctx, project, trainPos, trackManager, timeOfDay);

    // 8. Draw Color Light Signals
    this.drawSignals(ctx, project, trainPos, signalSystem, timeOfDay);

    // 9. Draw Volumetric Headlight Beams
    if (state.headlights) {
      this.drawHeadlightBeams(ctx, w, h, horizonY, this.cameraMode, trainPos, project);
    }

    // 10. Draw 3D WAP-7 Locomotive & LHB Coaches (in Platform or Chase View)
    if (this.cameraMode !== 'cab') {
      this.drawIndianTrain(ctx, project, trainPos, state, timeOfDay, dt);
    }

    // 11. Draw WAP-7 Cockpit Windscreen Frame (in Cab View)
    if (this.cameraMode === 'cab') {
      this.drawCabCockpit(ctx, w, h, state, dt, weather);
    }

    // 12. Weather Overlays (Rain & Fog)
    if (weather === 'rain') {
      this.drawRain(ctx, w, h, speedKmh, dt);
    } else if (weather === 'fog') {
      this.drawFog(ctx, w, h, horizonY);
    }
  }

  drawSkyAndLandscape(ctx, w, h, horizonY, timeOfDay, weather, trainPos) {
    // Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    if (timeOfDay === 'sunset') {
      // Rich twilight dusk matching reference screenshot
      skyGrad.addColorStop(0, '#09152b'); // Deep twilight navy
      skyGrad.addColorStop(0.35, '#16284a'); // Indigo
      skyGrad.addColorStop(0.70, '#244578'); // Electric dusk blue
      skyGrad.addColorStop(1.0, '#3b6ea8'); // Horizon haze
    } else if (timeOfDay === 'night') {
      skyGrad.addColorStop(0, '#020612');
      skyGrad.addColorStop(0.5, '#070f24');
      skyGrad.addColorStop(1.0, '#0e1b38');
    } else {
      // Day
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(0.6, '#38bdf8');
      skyGrad.addColorStop(1.0, '#bae6fd');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizonY + 2);

    // Distant Stars
    if (timeOfDay === 'sunset' || timeOfDay === 'night') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      const stars = [
        [0.12, 0.15], [0.28, 0.08], [0.45, 0.22], [0.65, 0.11],
        [0.78, 0.25], [0.88, 0.09], [0.93, 0.18], [0.35, 0.30]
      ];
      stars.forEach(([sx, sy]) => {
        ctx.fillRect(sx * w, sy * horizonY, 1.8, 1.8);
      });
    }

    // Distant City Skyline & Railway Depot Silhouettes (Parallax)
    const scroll = (trainPos * 0.12) % 360;
    ctx.fillStyle = timeOfDay === 'night' ? '#060a17' : (timeOfDay === 'sunset' ? '#0c1424' : '#1e293b');
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    for (let x = -scroll; x <= w + 120; x += 60) {
      const bH = 20 + Math.sin(x * 0.04) * 14 + (Math.abs(x % 50) * 0.4);
      ctx.lineTo(x, horizonY - bH);
      ctx.lineTo(x + 40, horizonY - bH);
      ctx.lineTo(x + 40, horizonY);
    }
    ctx.closePath();
    ctx.fill();

    // Distant Radio Towers with red hazard beacons
    for (let x = 120; x < w; x += 380) {
      ctx.strokeStyle = '#0a101f';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, horizonY);
      ctx.lineTo(x, horizonY - 48);
      ctx.stroke();

      // Blinking red beacon
      ctx.fillStyle = (Math.floor(this.animTime * 2) % 2 === 0) ? '#ef4444' : 'rgba(239, 68, 68, 0.2)';
      ctx.beginPath();
      ctx.arc(x, horizonY - 48, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawGroundAndBallast(ctx, w, h, horizonY, project, trainPos, timeOfDay) {
    // Ground Base
    const groundGrad = ctx.createLinearGradient(0, horizonY, 0, h);
    if (timeOfDay === 'night' || timeOfDay === 'sunset') {
      groundGrad.addColorStop(0, '#090d16');
      groundGrad.addColorStop(1.0, '#0f172a');
    } else {
      groundGrad.addColorStop(0, '#14532d');
      groundGrad.addColorStop(1.0, '#166534');
    }
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, horizonY, w, h - horizonY);

    const isLookingBackward = this.cameraMode !== 'cab';
    const nearZ = isLookingBackward ? trainPos - 120 : trainPos + 0.6;
    const farZ = isLookingBackward ? (this.cameraMode === 'trackside' ? trainPos + 18.0 : trainPos + 11.2) : trainPos + 260;

    // 1. Active Track Dark Crushed Granite Ballast Bed (x = -1.6m to +1.6m)
    const pFarL = project(-1.6, 0, farZ);
    const pFarR = project(1.6, 0, farZ);
    const pNearL = project(-1.6, 0, nearZ);
    const pNearR = project(1.6, 0, nearZ);

    if (pFarL && pFarR && pNearL && pNearR) {
      ctx.fillStyle = timeOfDay === 'night' ? '#1c1917' : '#292524';
      ctx.beginPath();
      ctx.moveTo(pFarL.x, pFarL.y);
      ctx.lineTo(pFarR.x, pFarR.y);
      ctx.lineTo(pNearR.x, pNearR.y);
      ctx.lineTo(pNearL.x, pNearL.y);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Parallel Left Track Ballast Bed (x = -5.4m to -2.2m)
    const pLeftFarL = project(-5.4, 0, farZ);
    const pLeftFarR = project(-2.2, 0, farZ);
    const pLeftNearL = project(-5.4, 0, nearZ);
    const pLeftNearR = project(-2.2, 0, nearZ);

    if (pLeftFarL && pLeftFarR && pLeftNearL && pLeftNearR) {
      ctx.fillStyle = timeOfDay === 'night' ? '#141414' : '#222222';
      ctx.beginPath();
      ctx.moveTo(pLeftFarL.x, pLeftFarL.y);
      ctx.lineTo(pLeftFarR.x, pLeftFarR.y);
      ctx.lineTo(pLeftNearR.x, pLeftNearR.y);
      ctx.lineTo(pLeftNearL.x, pLeftNearL.y);
      ctx.closePath();
      ctx.fill();
    }
  }

  drawRailTies(ctx, project, trainPos, timeOfDay) {
    const tieSpacing = 0.82; // Indian Railways PSC sleeper spacing (~0.82m)
    const tieHalfWidth = 1.30; // 2.6m total concrete sleeper length

    const isLookingBackward = this.cameraMode !== 'cab';
    const minZ = isLookingBackward ? trainPos - 85 : trainPos + 0.6;
    const maxZ = isLookingBackward ? (this.cameraMode === 'trackside' ? trainPos + 18.0 : trainPos + 11.2) : trainPos + 180;

    const startZ = Math.floor(minZ / tieSpacing) * tieSpacing;

    ctx.fillStyle = timeOfDay === 'night' ? '#2d3038' : '#4a505e'; // Pre-stressed concrete grey

    for (let z = startZ; z <= maxZ; z += tieSpacing) {
      // Active Track Sleeper
      const pL = project(-tieHalfWidth, 0.08, z);
      const pR = project(tieHalfWidth, 0.08, z);

      if (pL && pR && pL.scale > 0.05) {
        const thickness = Math.max(1.2, Math.min(14, 0.16 * pL.scale));
        const wTie = pR.x - pL.x;
        ctx.fillRect(pL.x, pL.y - thickness, wTie, thickness);

        // Pandrol clip fastenings (dark iron spots on sleeper)
        if (pL.scale > 25) {
          ctx.fillStyle = '#0f172a';
          const pClipL = project(-0.84, 0.10, z);
          const pClipR = project(0.84, 0.10, z);
          if (pClipL && pClipR) {
            const clipW = Math.max(2, 0.09 * pL.scale);
            ctx.fillRect(pClipL.x - clipW * 0.5, pClipL.y - thickness, clipW, thickness * 0.7);
            ctx.fillRect(pClipR.x - clipW * 0.5, pClipR.y - thickness, clipW, thickness * 0.7);
          }
          ctx.fillStyle = timeOfDay === 'night' ? '#2d3038' : '#4a505e';
        }
      }

      // Parallel Left Track Sleeper
      const pLL = project(-3.8 - tieHalfWidth, 0.08, z);
      const pLR = project(-3.8 + tieHalfWidth, 0.08, z);
      if (pLL && pLR && pLL.scale > 0.05) {
        const thickness = Math.max(1.0, Math.min(12, 0.14 * pLL.scale));
        ctx.fillRect(pLL.x, pLL.y - thickness, pLR.x - pLL.x, thickness);
      }
    }
  }

  drawSteelRails(ctx, project, trainPos, trackHalfGauge, headlightsOn, timeOfDay) {
    const isLookingBackward = this.cameraMode !== 'cab';
    const steps = 35;
    const minZ = isLookingBackward ? trainPos - 90 : trainPos + 0.6;
    const maxZ = isLookingBackward ? (this.cameraMode === 'trackside' ? trainPos + 18.0 : trainPos + 11.2) : trainPos + 220;
    const stepSize = (maxZ - minZ) / steps;

    const leftRail = [];
    const rightRail = [];
    const leftTrkL = [];
    const leftTrkR = [];

    for (let i = 0; i <= steps; i++) {
      const z = minZ + (i * stepSize);

      // Active Track Rails
      const pL = project(-trackHalfGauge, 0.18, z);
      const pR = project(trackHalfGauge, 0.18, z);
      if (pL && pR) {
        leftRail.push(pL);
        rightRail.push(pR);
      }

      // Parallel Left Track Rails
      const pLL = project(-3.8 - trackHalfGauge, 0.18, z);
      const pLR = project(-3.8 + trackHalfGauge, 0.18, z);
      if (pLL && pLR) {
        leftTrkL.push(pLL);
        leftTrkR.push(pLR);
      }
    }

    const drawRailStroke = (pts, color, width) => {
      if (pts.length < 2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    };

    // Dark Rail Web Base
    drawRailStroke(leftRail, '#0a0f1d', 4.0);
    drawRailStroke(rightRail, '#0a0f1d', 4.0);
    drawRailStroke(leftTrkL, '#0a0f1d', 3.0);
    drawRailStroke(leftTrkR, '#0a0f1d', 3.0);

    // Steel Specular Highlight on Railheads
    drawRailStroke(leftRail, '#94a3b8', 2.4);
    drawRailStroke(rightRail, '#94a3b8', 2.4);
    drawRailStroke(leftTrkL, '#64748b', 1.8);
    drawRailStroke(leftTrkR, '#64748b', 1.8);

    // Glistening Chrome Top Reflection from Headlights & Platform Lamps
    drawRailStroke(leftRail, '#ffffff', 1.2);
    drawRailStroke(rightRail, '#ffffff', 1.2);
  }

  drawOverheadCatenary(ctx, project, trainPos, timeOfDay) {
    const isLookingBackward = this.cameraMode !== 'cab';
    const steps = 25;
    const minZ = isLookingBackward ? trainPos - 80 : trainPos + 0.6;
    const maxZ = isLookingBackward ? (this.cameraMode === 'trackside' ? trainPos + 18.0 : trainPos + 11.2) : trainPos + 220;
    const stepSize = (maxZ - minZ) / steps;

    const catenaryWire = [];
    const contactWire = [];

    for (let i = 0; i <= steps; i++) {
      const z = minZ + (i * stepSize);
      // Realistic catenary droop sag between masts (span ~65m)
      const sag = Math.sin(((z % 65) / 65) * Math.PI) * 0.16;
      const pTop = project(0, 5.85 - sag, z);
      const pContact = project(0, 5.30, z); // 25kV contact wire

      if (pTop && pContact) {
        catenaryWire.push(pTop);
        contactWire.push(pContact);
      }
    }

    const drawWire = (pts, col, lw) => {
      if (pts.length < 2) return;
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    };

    // Messenger Wire & Contact Wire
    drawWire(catenaryWire, 'rgba(148, 163, 184, 0.45)', 1.2);
    drawWire(contactWire, 'rgba(253, 224, 71, 0.70)', 1.5); // copper contact wire
  }

  /**
   * Station Platform (Arakkonam Junction)
   * Continuous corrugated blue canopy roof, paved stone deck, red coping curb stones,
   * yellow tactile line, steel support columns, ceiling fluorescent lamps, and trilingual yellow station signboard.
   */
  drawStationPlatform(ctx, project, trainPos, stationSystem, timeOfDay) {
    let zClose, zFar;
    if (this.cameraMode === 'cab') {
      zClose = trainPos + 0.8;
      zFar = trainPos + 220;
    } else if (this.cameraMode === 'trackside') {
      zClose = trainPos + 17.0;
      zFar = trainPos - 90;
    } else {
      zClose = trainPos + 9.6;
      zFar = trainPos - 90;
    }

    const minZ = Math.min(zClose, zFar);
    const maxZ = Math.max(zClose, zFar);

    const platSideX = 1.95; // right edge facing active track
    const platWidth = 5.5;  // platform width
    const platHeight = 1.05; // high-level Indian passenger platform

    const pNearFront = project(platSideX, platHeight, zClose);
    const pNearBack = project(platSideX + platWidth, platHeight, zClose);
    const pFarFront = project(platSideX, platHeight, zFar);
    const pFarBack = project(platSideX + platWidth, platHeight, zFar);

    if (pNearFront && pNearBack && pFarFront && pFarBack) {
      // 1. Platform Deck Surface (Paved stone slabs with perspective depth)
      const platGrad = ctx.createLinearGradient(pNearFront.x, 0, pNearBack.x, 0);
      platGrad.addColorStop(0, '#e2e8f0'); // Grey stone tiles
      platGrad.addColorStop(0.4, '#cbd5e1');
      platGrad.addColorStop(1.0, '#94a3b8');

      ctx.fillStyle = platGrad;
      ctx.beginPath();
      ctx.moveTo(pNearFront.x, pNearFront.y);
      ctx.lineTo(pNearBack.x, pNearBack.y);
      ctx.lineTo(pFarBack.x, pFarBack.y);
      ctx.lineTo(pFarFront.x, pFarFront.y);
      ctx.closePath();
      ctx.fill();

      // Platform Stone Tile Grid Lines
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)';
      ctx.lineWidth = 1;
      for (let z = Math.floor(minZ / 4) * 4; z <= maxZ; z += 4) {
        const ptL = project(platSideX, platHeight, z);
        const ptR = project(platSideX + platWidth, platHeight, z);
        if (ptL && ptR) {
          ctx.beginPath();
          ctx.moveTo(ptL.x, ptL.y);
          ctx.lineTo(ptR.x, ptR.y);
          ctx.stroke();
        }
      }

      // 2. Vertical Concrete Face facing track
      const pNearBase = project(platSideX, 0, zClose);
      const pFarBase = project(platSideX, 0, zFar);
      if (pNearBase && pFarBase) {
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(pNearFront.x, pNearFront.y);
        ctx.lineTo(pFarFront.x, pFarFront.y);
        ctx.lineTo(pFarBase.x, pFarBase.y);
        ctx.lineTo(pNearBase.x, pNearBase.y);
        ctx.closePath();
        ctx.fill();
      }

      // 3. Indian Red Coping Curb Stones along Track Edge
      const pNearRedBack = project(platSideX + 0.35, platHeight, zClose);
      const pFarRedBack = project(platSideX + 0.35, platHeight, zFar);
      if (pNearRedBack && pFarRedBack) {
        ctx.fillStyle = '#b91c1c'; // Classic Indian Railways Red platform edge
        ctx.beginPath();
        ctx.moveTo(pNearFront.x, pNearFront.y);
        ctx.lineTo(pNearRedBack.x, pNearRedBack.y);
        ctx.lineTo(pFarRedBack.x, pFarRedBack.y);
        ctx.lineTo(pFarFront.x, pFarFront.y);
        ctx.closePath();
        ctx.fill();
      }

      // 4. Bright Yellow Tactile Safety Line
      const pNearYellow = project(platSideX + 0.65, platHeight, zClose);
      const pFarYellow = project(platSideX + 0.65, platHeight, zFar);
      if (pNearYellow && pFarYellow) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = Math.max(2, Math.min(6, 0.08 * pNearYellow.scale));
        ctx.beginPath();
        ctx.moveTo(pNearYellow.x, pNearYellow.y);
        ctx.lineTo(pFarYellow.x, pFarYellow.y);
        ctx.stroke();
      }

      // 5. Continuous Blue Corrugated Iron Canopy Platform Roof Overhead
      const pCanopyNearL = project(platSideX - 0.4, platHeight + 4.8, zClose);
      const pCanopyNearR = project(platSideX + 5.5, platHeight + 4.4, zClose);
      const pCanopyFarL = project(platSideX - 0.4, platHeight + 4.8, zFar);
      const pCanopyFarR = project(platSideX + 5.5, platHeight + 4.4, zFar);

      if (pCanopyNearL && pCanopyNearR && pCanopyFarL && pCanopyFarR) {
        const canopyGrad = ctx.createLinearGradient(pCanopyNearL.x, 0, pCanopyNearR.x, 0);
        canopyGrad.addColorStop(0, '#1e3a8a');
        canopyGrad.addColorStop(0.3, '#1d4ed8');
        canopyGrad.addColorStop(0.7, '#2563eb');
        canopyGrad.addColorStop(1.0, '#1e40af');

        ctx.fillStyle = canopyGrad;
        ctx.beginPath();
        ctx.moveTo(pCanopyNearL.x, pCanopyNearL.y);
        ctx.lineTo(pCanopyNearR.x, pCanopyNearR.y);
        ctx.lineTo(pCanopyFarR.x, pCanopyFarR.y);
        ctx.lineTo(pCanopyFarL.x, pCanopyFarL.y);
        ctx.closePath();
        ctx.fill();

        // Corrugated roof rib lines
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.25)';
        ctx.lineWidth = 1;
        for (let cz = Math.floor(minZ / 5) * 5; cz <= maxZ; cz += 5) {
          const pRibL = project(platSideX - 0.4, platHeight + 4.8, cz);
          const pRibR = project(platSideX + 5.5, platHeight + 4.4, cz);
          if (pRibL && pRibR) {
            ctx.beginPath();
            ctx.moveTo(pRibL.x, pRibL.y);
            ctx.lineTo(pRibR.x, pRibR.y);
            ctx.stroke();
          }
        }
      }

      // Support Columns, Rafter Trusses & Ceiling Fluorescent Lights
      const pillarSpacing = 24;
      const startPillarZ = Math.floor(minZ / pillarSpacing) * pillarSpacing;

      for (let pz = startPillarZ; pz <= maxZ; pz += pillarSpacing) {
        const pPostBase = project(platSideX + 2.8, platHeight, pz);
        const pPostTop = project(platSideX + 2.8, platHeight + 4.2, pz);
        const pCanopyLeft = project(platSideX - 0.4, platHeight + 4.8, pz);
        const pCanopyRight = project(platSideX + 5.5, platHeight + 4.4, pz);

        if (pPostBase && pPostTop && pCanopyLeft && pCanopyRight && pPostBase.scale > 0.05) {
          // Structural Steel Column
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = Math.max(2.5, Math.min(10, 0.16 * pPostBase.scale));
          ctx.beginPath();
          ctx.moveTo(pPostBase.x, pPostBase.y);
          ctx.lineTo(pPostTop.x, pPostTop.y);
          ctx.stroke();

          // Triangular Steel Roof Truss
          ctx.strokeStyle = '#1e3a8a';
          ctx.lineWidth = Math.max(1.8, Math.min(6, 0.09 * pPostBase.scale));
          ctx.beginPath();
          ctx.moveTo(pCanopyLeft.x, pCanopyLeft.y);
          ctx.lineTo(pPostTop.x, pPostTop.y);
          ctx.lineTo(pCanopyRight.x, pCanopyRight.y);
          ctx.stroke();

          // Overhead Fluorescent Ceiling Tube Light
          const pLamp = project(platSideX + 2.0, platHeight + 4.1, pz);
          if (pLamp && pLamp.scale > 15) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#fef08a';
            ctx.shadowBlur = 10;
            ctx.fillRect(pLamp.x - 14, pLamp.y - 2, 28, 4);
            ctx.shadowBlur = 0;

            // Warm Light Pool on Platform Floor
            const pFloorPool = project(platSideX + 2.0, platHeight, pz);
            if (pFloorPool) {
              const radGrad = ctx.createRadialGradient(
                pFloorPool.x, pFloorPool.y, 6,
                pFloorPool.x, pFloorPool.y, Math.max(25, 0.9 * pFloorPool.scale)
              );
              radGrad.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
              radGrad.addColorStop(1, 'rgba(254, 240, 138, 0.0)');
              ctx.fillStyle = radGrad;
              ctx.beginPath();
              ctx.arc(pFloorPool.x, pFloorPool.y, Math.max(25, 0.9 * pFloorPool.scale), 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // 6. Indian Railways Yellow Enamel Station Signboard
      const signZ = (this.cameraMode === 'cab') ? trainPos + 35 : trainPos - 6.5;
      const pSignBase = project(platSideX + 3.2, platHeight, signZ);
      const pSignTop = project(platSideX + 3.2, platHeight + 3.0, signZ);

      if (pSignBase && pSignTop && pSignBase.scale > 10) {
        const sc = pSignBase.scale;
        const signW = 2.4 * sc; // 2.4m wide signboard
        const signH = 0.85 * sc; // 0.85m tall signboard

        // Twin Support Legs
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = Math.max(2, 0.08 * sc);
        ctx.beginPath();
        ctx.moveTo(pSignTop.x - signW * 0.35, pSignBase.y);
        ctx.lineTo(pSignTop.x - signW * 0.35, pSignTop.y);
        ctx.moveTo(pSignTop.x + signW * 0.35, pSignBase.y);
        ctx.lineTo(pSignTop.x + signW * 0.35, pSignTop.y);
        ctx.stroke();

        // Authentic Indian Railways Enamel Yellow Board
        ctx.fillStyle = '#facc15';
        ctx.fillRect(pSignTop.x - signW * 0.5, pSignTop.y - signH * 0.5, signW, signH);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1.5, 0.04 * sc);
        ctx.strokeRect(pSignTop.x - signW * 0.5, pSignTop.y - signH * 0.5, signW, signH);

        // Station Names (Tamil / English / Hindi)
        if (signH > 22) {
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';

          // English: ARAKKONAM
          const fSizeEng = Math.max(9, Math.round(0.22 * sc));
          ctx.font = `900 ${fSizeEng}px 'Inter', sans-serif`;
          ctx.fillText('ARAKKONAM', pSignTop.x, pSignTop.y + fSizeEng * 0.3);

          // Tamil: அரக்கோணம்
          if (signH > 38) {
            const fSizeNative = Math.max(8, Math.round(0.16 * sc));
            ctx.font = `bold ${fSizeNative}px sans-serif`;
            ctx.fillText('அரக்கோணம்', pSignTop.x, pSignTop.y - signH * 0.24);

            // Hindi: अरक्कोणम
            ctx.fillText('अरक्कोणम', pSignTop.x, pSignTop.y + signH * 0.36);
          }
          ctx.textAlign = 'left';
        }
      }
    }
  }

  /**
   * Scenery Elements (Depth-Sorted with Painter's Algorithm):
   * Coolies in red kurtas carrying trunks, walking passengers with bags,
   * Chai & snack stalls, luggage trolleys, parked opposing train rake, and catenary gantries.
   */
  drawScenery(ctx, project, trainPos, trackManager, timeOfDay) {
    const rawScenery = trackManager?.scenery || [];

    // Map and depth-sort scenery items from furthest to nearest
    const scenery = rawScenery.map(item => {
      const p = project(item.dist || 3.4, 1.05, item.position);
      return { item, p, relZ: p ? p.relZ : -1 };
    }).filter(o => o.p && o.p.scale > 6 && o.p.scale < 250);

    // Sort descending by distance (furthest items drawn first)
    scenery.sort((a, b) => b.relZ - a.relZ);

    for (const { item, p } of scenery) {
      // 1. Indian Railways Coolie (Porter in red kurta carrying luggage trunk on head)
      if (item.type === 'coolie') {
        const sc = p.scale;
        const hCoolie = 1.72 * sc;
        const wCoolie = 0.55 * sc;

        // White Dhoti / Pyjamas (standing on platform at p.y)
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(p.x - wCoolie * 0.35, p.y - hCoolie * 0.48, wCoolie * 0.32, hCoolie * 0.48);
        ctx.fillRect(p.x + wCoolie * 0.03, p.y - hCoolie * 0.48, wCoolie * 0.32, hCoolie * 0.48);

        // Traditional Scarlet Red Kurta
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(p.x - wCoolie * 0.45, p.y - hCoolie * 0.85, wCoolie * 0.90, hCoolie * 0.42);

        // Brass Porter Arm Badge
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(p.x - wCoolie * 0.52, p.y - hCoolie * 0.74, wCoolie * 0.18, hCoolie * 0.10);

        // Head & Turban
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(p.x, p.y - hCoolie * 0.90, wCoolie * 0.28, 0, Math.PI * 2);
        ctx.fill();

        // Turban Cloth Roll (Head Cushion Pad / Gamchha)
        ctx.fillStyle = '#e11d48'; // Red rolled gamchha on head
        ctx.fillRect(p.x - wCoolie * 0.38, p.y - hCoolie * 1.05, wCoolie * 0.76, hCoolie * 0.08);

        // Large Metal Luggage Trunk Balanced Directly on Head Cushion
        const trunkW = 0.88 * sc;
        const trunkH = 0.38 * sc;
        const trunkBottomY = p.y - hCoolie * 1.05;
        ctx.fillStyle = item.trunkColor || '#b45309';
        ctx.fillRect(p.x - trunkW * 0.5, trunkBottomY - trunkH, trunkW, trunkH);
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = Math.max(1, 0.025 * sc);
        ctx.strokeRect(p.x - trunkW * 0.5, trunkBottomY - trunkH, trunkW, trunkH);

        // Trunk Metal Corner Brackets & Latches
        ctx.fillStyle = '#fde047';
        const bSize = Math.max(2, 0.06 * sc);
        ctx.fillRect(p.x - trunkW * 0.5, trunkBottomY - trunkH, bSize, bSize);
        ctx.fillRect(p.x + trunkW * 0.5 - bSize, trunkBottomY - trunkH, bSize, bSize);
        ctx.fillRect(p.x - trunkW * 0.5, trunkBottomY - bSize, bSize, bSize);
        ctx.fillRect(p.x + trunkW * 0.5 - bSize, trunkBottomY - bSize, bSize, bSize);

        // Arms Raised Holding Trunk Sides (Iconic Coolie Pose!)
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = Math.max(2.5, 0.08 * sc);
        ctx.beginPath();
        ctx.moveTo(p.x - wCoolie * 0.40, p.y - hCoolie * 0.80);
        ctx.lineTo(p.x - trunkW * 0.46, trunkBottomY - trunkH * 0.20);
        ctx.moveTo(p.x + wCoolie * 0.40, p.y - hCoolie * 0.80);
        ctx.lineTo(p.x + trunkW * 0.46, trunkBottomY - trunkH * 0.20);
        ctx.stroke();
      }
      // 2. Platform Passengers with Bags & Rolling Suitcases
      else if (item.type === 'passenger') {
        const sc = p.scale;
        const hPass = 1.70 * sc;
        const wPass = 0.50 * sc;

        // Dark Trousers / Legs (standing on platform deck at p.y)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(p.x - wPass * 0.38, p.y - hPass * 0.46, wPass * 0.34, hPass * 0.46);
        ctx.fillRect(p.x + wPass * 0.04, p.y - hPass * 0.46, wPass * 0.34, hPass * 0.46);

        // Shoes
        ctx.fillStyle = '#020617';
        ctx.fillRect(p.x - wPass * 0.42, p.y - hPass * 0.06, wPass * 0.40, hPass * 0.06);
        ctx.fillRect(p.x + wPass * 0.02, p.y - hPass * 0.06, wPass * 0.40, hPass * 0.06);

        // Shirt Torso
        ctx.fillStyle = item.shirtColor || '#0284c7';
        ctx.fillRect(p.x - wPass * 0.45, p.y - hPass * 0.82, wPass * 0.90, hPass * 0.38);

        // Arms at sides
        ctx.fillStyle = item.shirtColor || '#0284c7';
        ctx.fillRect(p.x - wPass * 0.58, p.y - hPass * 0.80, wPass * 0.16, hPass * 0.34);
        ctx.fillRect(p.x + wPass * 0.42, p.y - hPass * 0.80, wPass * 0.16, hPass * 0.34);

        // Neck & Head
        ctx.fillStyle = '#78350f';
        ctx.fillRect(p.x - wPass * 0.12, p.y - hPass * 0.88, wPass * 0.24, hPass * 0.08);
        ctx.beginPath();
        ctx.arc(p.x, p.y - hPass * 0.92, wPass * 0.26, 0, Math.PI * 2);
        ctx.fill();

        // Rolling Suitcase in Hand (for passengers with bags)
        if (item.shirtColor !== '#f8fafc') {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(p.x + wPass * 0.48, p.y - hPass * 0.38, wPass * 0.38, hPass * 0.35);
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = Math.max(1, 0.02 * sc);
          ctx.strokeRect(p.x + wPass * 0.48, p.y - hPass * 0.38, wPass * 0.38, hPass * 0.35);
          // Suitcase handle
          ctx.strokeStyle = '#64748b';
          ctx.beginPath();
          ctx.moveTo(p.x + wPass * 0.60, p.y - hPass * 0.38);
          ctx.lineTo(p.x + wPass * 0.60, p.y - hPass * 0.50);
          ctx.stroke();
        }
      }
      // 3. Indian Railway Chai & Snack Stall ("CHAI / SNACKS")
      else if (item.type === 'tea_stall') {
        const sc = p.scale;
        const stallW = 2.4 * sc;
        const stallH = 2.0 * sc;

        // Counter Base (sitting firmly on platform surface at p.y)
        ctx.fillStyle = '#451a03';
        ctx.fillRect(p.x - stallW * 0.5, p.y - stallH * 0.45, stallW, stallH * 0.45);

        // Warm Illuminated Display Shelves with snacks and tea kettle
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(p.x - stallW * 0.45, p.y - stallH * 0.75, stallW * 0.9, stallH * 0.30);

        // Snack Jars
        ctx.fillStyle = '#b45309';
        const numJars = 4;
        for (let j = 0; j < numJars; j++) {
          ctx.fillRect(p.x - stallW * 0.4 + (j * stallW * 0.22), p.y - stallH * 0.70, stallW * 0.14, stallH * 0.20);
        }

        // Red Header Board with "CHAI / SNACKS"
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(p.x - stallW * 0.5, p.y - stallH * 0.98, stallW, stallH * 0.23);
        if (stallW > 35) {
          ctx.fillStyle = '#ffffff';
          ctx.font = `900 ${Math.max(8, Math.round(0.12 * sc))}px 'Inter', sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('CHAI / SNACKS', p.x, p.y - stallH * 0.81);
          ctx.textAlign = 'left';
        }

        // Striped Yellow/Red Awning
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(p.x - stallW * 0.55, p.y - stallH * 1.12, stallW * 1.1, stallH * 0.14);
      }
      // 4. Station Luggage Trolley & Wheelbarrow
      else if (item.type === 'trolley') {
        const sc = p.scale;
        const tW = 1.4 * sc;
        const tH = 0.8 * sc;

        // Metal Frame
        ctx.fillStyle = '#334155';
        ctx.fillRect(p.x - tW * 0.5, p.y - tH * 0.45, tW, tH * 0.30);

        // Stack of Burlap Parcels
        ctx.fillStyle = '#b45309';
        ctx.fillRect(p.x - tW * 0.4, p.y - tH * 0.95, tW * 0.8, tH * 0.55);

        // Wheels
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(p.x - tW * 0.35, p.y - tH * 0.12, Math.max(2, 0.08 * sc), 0, Math.PI * 2);
        ctx.arc(p.x + tW * 0.35, p.y - tH * 0.12, Math.max(2, 0.08 * sc), 0, Math.PI * 2);
        ctx.fill();
      }
      // 5. Parked Opposing Passenger Rake on Left Track (Blue ICF Coaches)
      else if (item.type === 'parked_train') {
        const coachLength = 22;
        for (let k = 0; k < 2; k++) {
          const cZ = item.position + (k * coachLength);
          const pF = project(-3.8, 0.85, cZ);
          const pR = project(-3.8, 0.85, cZ + coachLength - 1);
          if (pF && pR && pF.scale > 5 && pF.scale < 250) {
            const sc = pF.scale;
            const cH = 3.6 * sc;
            const cW = 2.8 * sc;

            // Iconic Indian Railway Blue ICF Livery
            ctx.fillStyle = '#1e3a8a';
            ctx.fillRect(pF.x - cW * 0.5, pF.y - cH, cW, cH);

            // Light Blue Waist Stripe
            ctx.fillStyle = '#60a5fa';
            ctx.fillRect(pF.x - cW * 0.5, pF.y - cH * 0.65, cW, cH * 0.10);

            // Warm Lit Passenger Windows
            ctx.fillStyle = '#fef08a';
            const winCount = 3;
            for (let wIdx = 0; wIdx < winCount; wIdx++) {
              ctx.fillRect(
                pF.x - cW * 0.38 + (wIdx * cW * 0.28),
                pF.y - cH * 0.58,
                cW * 0.20,
                cH * 0.22
              );
            }
          }
        }
      }
      // 6. 25kV OHE Catenary Steel Lattice Portal Masts
      else if (item.type === 'catenary') {
        const pBase = project(item.side * 2.8, 0, item.position);
        const pTop = project(item.side * 2.8, 6.6, item.position);
        const pWireAnchor = project(0, 5.3, item.position);

        if (pBase && pTop && pWireAnchor && pBase.scale > 5 && pBase.scale < 250) {
          ctx.strokeStyle = timeOfDay === 'night' ? '#334155' : '#64748b';
          ctx.lineWidth = Math.max(1.8, Math.min(8, 0.12 * pBase.scale));
          ctx.beginPath();
          ctx.moveTo(pBase.x, pBase.y);
          ctx.lineTo(pTop.x, pTop.y);
          ctx.lineTo(pWireAnchor.x, pWireAnchor.y);
          ctx.stroke();

          // Ceramic Insulator
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(pWireAnchor.x, pWireAnchor.y, Math.max(2, 0.08 * pBase.scale), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  drawSignals(ctx, project, trainPos, signalSystem, timeOfDay) {
    const signals = signalSystem?.signals || [];

    for (const sig of signals) {
      const mastX = -2.2; // left side of main track
      const pBase = project(mastX, 0, sig.positionMeters);
      const pHead = project(mastX, 4.4, sig.positionMeters);

      if (pBase && pHead && pHead.scale > 8 && pHead.scale < 250) {
        const sc = pHead.scale;

        // Signal Mast Post
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = Math.max(2, Math.min(8, 0.12 * sc));
        ctx.beginPath();
        ctx.moveTo(pBase.x, pBase.y);
        ctx.lineTo(pHead.x, pHead.y);
        ctx.stroke();

        // Signal Head Box with Visor
        const boxW = 0.42 * sc;
        const boxH = 1.05 * sc;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(pHead.x - boxW * 0.5, pHead.y - boxH * 0.5, boxW, boxH);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(pHead.x - boxW * 0.5, pHead.y - boxH * 0.5, boxW, boxH);

        // Aspect Lenses: Red (Top), Yellow (Middle), Green (Bottom)
        const radius = Math.max(2.5, Math.min(10, 0.10 * sc));
        const offsets = [-boxH * 0.28, 0, boxH * 0.28];
        const aspects = ['RED', 'YELLOW', 'GREEN'];
        const colors = {
          RED: '#ef4444',
          YELLOW: '#f59e0b',
          GREEN: '#22c55e'
        };

        aspects.forEach((asp, idx) => {
          const lensY = pHead.y + offsets[idx];
          const isActive = sig.aspect === asp;

          if (isActive) {
            ctx.shadowColor = colors[asp];
            ctx.shadowBlur = Math.max(8, Math.min(24, 0.35 * sc));
            ctx.fillStyle = colors[asp];
          } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#1e293b';
          }

          ctx.beginPath();
          ctx.arc(pHead.x, lensY, radius, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.shadowBlur = 0;
      }
    }
  }

  drawHeadlightBeams(ctx, w, h, horizonY, cameraMode, trainPos, project) {
    if (cameraMode === 'cab') {
      const grad = ctx.createRadialGradient(
        w * 0.5, h * 0.72, 20,
        w * 0.5, horizonY + 20, w * 0.65
      );
      grad.addColorStop(0, 'rgba(255, 255, 230, 0.45)');
      grad.addColorStop(0.4, 'rgba(255, 255, 200, 0.16)');
      grad.addColorStop(1.0, 'rgba(255, 255, 200, 0.0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(w * 0.5 - 50, h * 0.72);
      ctx.lineTo(w * 0.05, horizonY + 20);
      ctx.lineTo(w * 0.95, horizonY + 20);
      ctx.lineTo(w * 0.5 + 50, h * 0.72);
      ctx.closePath();
      ctx.fill();
    } else {
      // Platform / Trackside View Volumetric Beam from Locomotive Nose
      const pHead = project(0, 2.8, trainPos);
      const beamZ = (cameraMode === 'platform') ? trainPos + 9.5 : trainPos + 16.0;
      const pFarLeft = project(-2.2, 0.1, beamZ);
      const pFarRight = project(1.2, 0.1, beamZ);

      if (pHead && pFarLeft && pFarRight) {
        const grad = ctx.createRadialGradient(
          pHead.x, pHead.y, 8,
          (pFarLeft.x + pFarRight.x) * 0.5, (pFarLeft.y + pHead.y) * 0.5, Math.abs(pFarRight.x - pFarLeft.x) * 1.8
        );
        grad.addColorStop(0, 'rgba(255, 255, 230, 0.35)');
        grad.addColorStop(0.5, 'rgba(255, 255, 200, 0.12)');
        grad.addColorStop(1.0, 'rgba(255, 255, 200, 0.0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(pHead.x, pHead.y);
        ctx.lineTo(pFarLeft.x, pFarLeft.y);
        ctx.lineTo(pFarRight.x, pFarRight.y);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  /**
   * Authentic Indian Railways WAP-7 Locomotive in Rajdhani Livery & Trailing LHB Coaches
   */
  drawIndianTrain(ctx, project, trainPos, state, timeOfDay, dt) {
    ctx.save();

    // 1. Draw Trailing LHB Rajdhani Passenger Coaches (rear to front)
    const coachLength = 23; // meters per LHB coach
    const numCoaches = 3;

    for (let cIdx = numCoaches - 1; cIdx >= 0; cIdx--) {
      const zStart = trainPos - 21.0 - (cIdx * coachLength);
      const zEnd = zStart - (coachLength - 1.0);

      const pF_BL = project(-1.48, 0.85, zStart);
      const pF_BR = project(1.48, 0.85, zStart);
      const pF_TL = project(-1.48, 3.80, zStart);
      const pF_TR = project(1.48, 3.80, zStart);

      const pR_BL = project(-1.48, 0.85, zEnd);
      const pR_BR = project(1.48, 0.85, zEnd);
      const pR_TL = project(-1.48, 3.80, zEnd);
      const pR_TR = project(1.48, 3.80, zEnd);

      // Right Side Wall (Platform View)
      if (pF_BR && pR_BR && pF_TR && pR_TR) {
        ctx.fillStyle = '#b91c1c'; // Rajdhani Red
        ctx.beginPath();
        ctx.moveTo(pF_BR.x, pF_BR.y);
        ctx.lineTo(pR_BR.x, pR_BR.y);
        ctx.lineTo(pR_TR.x, pR_TR.y);
        ctx.lineTo(pF_TR.x, pF_TR.y);
        ctx.closePath();
        ctx.fill();

        // Cream / Golden Yellow Window Band
        const pBandF_B = project(1.49, 1.80, zStart);
        const pBandF_T = project(1.49, 2.85, zStart);
        const pBandR_B = project(1.49, 1.80, zEnd);
        const pBandR_T = project(1.49, 2.85, zEnd);

        if (pBandF_B && pBandF_T && pBandR_B && pBandR_T) {
          ctx.fillStyle = '#fef08a'; // Cream band
          ctx.beginPath();
          ctx.moveTo(pBandF_B.x, pBandF_B.y);
          ctx.lineTo(pBandR_B.x, pBandR_B.y);
          ctx.lineTo(pBandR_T.x, pBandR_T.y);
          ctx.lineTo(pBandF_T.x, pBandF_T.y);
          ctx.closePath();
          ctx.fill();

          // Warm Lit Interior Passenger Windows
          for (let wZ = zStart - 3; wZ > zEnd + 2; wZ -= 3.8) {
            const pWinL = project(1.50, 1.95, wZ);
            const pWinR = project(1.50, 1.95, wZ - 2.2);
            const pWinT = project(1.50, 2.70, wZ);

            if (pWinL && pWinR && pWinT) {
              ctx.fillStyle = '#fde047'; // warm yellow interior light
              const wW = Math.abs(pWinL.x - pWinR.x);
              const wH = Math.abs(pWinL.y - pWinT.y);
              ctx.fillRect(pWinR.x, pWinT.y, wW, wH);

              // Passenger Silhouette
              if (wW > 8) {
                ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
                ctx.beginPath();
                ctx.arc(pWinR.x + wW * 0.5, pWinT.y + wH * 0.45, wW * 0.22, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        }
      }

      // Left Side Wall (Trackside View)
      if (pF_BL && pR_BL && pF_TL && pR_TL) {
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.moveTo(pF_BL.x, pF_BL.y);
        ctx.lineTo(pR_BL.x, pR_BL.y);
        ctx.lineTo(pR_TL.x, pR_TL.y);
        ctx.lineTo(pF_TL.x, pF_TL.y);
        ctx.closePath();
        ctx.fill();

        // Cream / Golden Yellow Window Band
        const pBandLF_B = project(-1.49, 1.80, zStart);
        const pBandLF_T = project(-1.49, 2.85, zStart);
        const pBandLR_B = project(-1.49, 1.80, zEnd);
        const pBandLR_T = project(-1.49, 2.85, zEnd);

        if (pBandLF_B && pBandLF_T && pBandLR_B && pBandLR_T) {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.moveTo(pBandLF_B.x, pBandLF_B.y);
          ctx.lineTo(pBandLR_B.x, pBandLR_B.y);
          ctx.lineTo(pBandLR_T.x, pBandLR_T.y);
          ctx.lineTo(pBandLF_T.x, pBandLF_T.y);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Curved Silver Roof
      if (pF_TL && pF_TR && pR_TR && pR_TL) {
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(pF_TL.x, pF_TL.y);
        ctx.lineTo(pF_TR.x, pF_TR.y);
        ctx.lineTo(pR_TR.x, pR_TR.y);
        ctx.lineTo(pR_TL.x, pR_TL.y);
        ctx.closePath();
        ctx.fill();
      }
    }

    // 2. Draw WAP-7 Locomotive Body
    const zNose = trainPos;
    const zRear = trainPos - 21.0;

    const pN_BL = project(-1.50, 0.85, zNose);
    const pN_BR = project(1.50, 0.85, zNose);
    const pN_ML = project(-1.45, 2.20, zNose);
    const pN_MR = project(1.45, 2.20, zNose);
    const pN_TL = project(-1.38, 3.85, zNose - 1.6); // aerodynamic nose slant
    const pN_TR = project(1.38, 3.85, zNose - 1.6);

    const pR_BL = project(-1.50, 0.85, zRear);
    const pR_BR = project(1.50, 0.85, zRear);
    const pR_TL = project(-1.45, 3.90, zRear);
    const pR_TR = project(1.45, 3.90, zRear);

    if (pN_BL && pN_BR && pN_ML && pN_MR && pN_TL && pN_TR) {
      // 2a-right. Right Body Side Wall (facing platform)
      if (pR_BR && pR_TR) {
        ctx.fillStyle = '#991b1b'; // Darker shaded red side
        ctx.beginPath();
        ctx.moveTo(pN_BR.x, pN_BR.y);
        ctx.lineTo(pR_BR.x, pR_BR.y);
        ctx.lineTo(pR_TR.x, pR_TR.y);
        ctx.lineTo(pN_TR.x, pN_TR.y);
        ctx.closePath();
        ctx.fill();

        // Yellow Side Stripe along waist
        const pSideF = project(1.51, 2.05, zNose);
        const pSideR = project(1.51, 2.05, zRear);
        if (pSideF && pSideR) {
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = Math.max(2, Math.min(8, 0.08 * pSideF.scale));
          ctx.beginPath();
          ctx.moveTo(pSideF.x, pSideF.y);
          ctx.lineTo(pSideR.x, pSideR.y);
          ctx.stroke();
        }

        // Circular Machine Room Louvers / Ventilation Grilles
        for (let lz = zNose - 6.5; lz >= zRear + 4; lz -= 3.6) {
          const pLouver = project(1.51, 2.65, lz);
          if (pLouver && pLouver.scale > 10) {
            const lr = Math.max(3, Math.min(10, 0.12 * pLouver.scale));
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.arc(pLouver.x, pLouver.y, lr, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Driver Cab Side Door & Grab Handrail
        const pDoorB = project(1.51, 0.95, zNose - 3.2);
        const pDoorT = project(1.51, 3.10, zNose - 3.2);
        if (pDoorB && pDoorT && pDoorB.scale > 12) {
          ctx.strokeStyle = '#e2e8f0'; // Chrome vertical handrail
          ctx.lineWidth = Math.max(1.5, 0.02 * pDoorB.scale);
          ctx.beginPath();
          ctx.moveTo(pDoorB.x, pDoorB.y);
          ctx.lineTo(pDoorT.x, pDoorT.y);
          ctx.stroke();
        }
      }

      // 2a-left. Left Body Side Wall (visible in trackside mode)
      if (pR_BL && pR_TL) {
        ctx.fillStyle = '#7f1d1d';
        ctx.beginPath();
        ctx.moveTo(pN_BL.x, pN_BL.y);
        ctx.lineTo(pR_BL.x, pR_BL.y);
        ctx.lineTo(pR_TL.x, pR_TL.y);
        ctx.lineTo(pN_TL.x, pN_TL.y);
        ctx.closePath();
        ctx.fill();

        // Yellow Side Stripe along waist
        const pSideLF = project(-1.51, 2.05, zNose);
        const pSideLR = project(-1.51, 2.05, zRear);
        if (pSideLF && pSideLR) {
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = Math.max(2, Math.min(8, 0.08 * pSideLF.scale));
          ctx.beginPath();
          ctx.moveTo(pSideLF.x, pSideLF.y);
          ctx.lineTo(pSideLR.x, pSideLR.y);
          ctx.stroke();
        }
      }

      // 2a-roof. Locomotive Curved Roof
      if (pN_TL && pN_TR && pR_TL && pR_TR) {
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(pN_TL.x, pN_TL.y);
        ctx.lineTo(pN_TR.x, pN_TR.y);
        ctx.lineTo(pR_TR.x, pR_TR.y);
        ctx.lineTo(pR_TL.x, pR_TL.y);
        ctx.closePath();
        ctx.fill();
      }

      // 2b. Front Aerodynamic Nose Face (Vibrant Indian Railways Red)
      const frontGrad = ctx.createLinearGradient(pN_BL.x, 0, pN_BR.x, 0);
      frontGrad.addColorStop(0, '#991b1b');
      frontGrad.addColorStop(0.3, '#dc2626');
      frontGrad.addColorStop(0.7, '#ef4444');
      frontGrad.addColorStop(1.0, '#b91c1c');

      ctx.fillStyle = frontGrad;
      ctx.beginPath();
      ctx.moveTo(pN_BL.x, pN_BL.y);
      ctx.lineTo(pN_BR.x, pN_BR.y);
      ctx.lineTo(pN_MR.x, pN_MR.y);
      ctx.lineTo(pN_TR.x, pN_TR.y);
      ctx.lineTo(pN_TL.x, pN_TL.y);
      ctx.lineTo(pN_ML.x, pN_ML.y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 2c. Golden-Yellow Chevron Cheatline on Front Nose
      const pCheatL = project(-1.48, 2.10, zNose);
      const pCheatR = project(1.48, 2.10, zNose);
      const pCheatMid = project(0, 1.70, zNose);
      if (pCheatL && pCheatR && pCheatMid) {
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(pCheatL.x, pCheatL.y);
        ctx.lineTo(pCheatMid.x, pCheatMid.y);
        ctx.lineTo(pCheatR.x, pCheatR.y);
        ctx.lineTo(pCheatR.x, pCheatR.y + Math.max(3, 0.12 * pCheatR.scale));
        ctx.lineTo(pCheatMid.x, pCheatMid.y + Math.max(4, 0.14 * pCheatMid.scale));
        ctx.lineTo(pCheatL.x, pCheatL.y + Math.max(3, 0.12 * pCheatL.scale));
        ctx.closePath();
        ctx.fill();
      }

      // 2d. Twin Windshield Cab Windows
      const pWinBL = project(-1.20, 2.60, zNose - 0.4);
      const pWinBR = project(1.20, 2.60, zNose - 0.4);
      const pWinTL = project(-1.14, 3.60, zNose - 1.4);
      const pWinTR = project(1.14, 3.60, zNose - 1.4);

      if (pWinBL && pWinBR && pWinTL && pWinTR) {
        ctx.fillStyle = '#082f49'; // Dark tinted glass
        ctx.beginPath();
        ctx.moveTo(pWinBL.x, pWinBL.y);
        ctx.lineTo(pWinBR.x, pWinBR.y);
        ctx.lineTo(pWinTR.x, pWinTR.y);
        ctx.lineTo(pWinTL.x, pWinTL.y);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Center Windshield Pillar Divider
        const pWinMidB = project(0, 2.60, zNose - 0.4);
        const pWinMidT = project(0, 3.60, zNose - 1.4);
        if (pWinMidB && pWinMidT) {
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = Math.max(2, 0.06 * pWinMidB.scale);
          ctx.beginPath();
          ctx.moveTo(pWinMidB.x, pWinMidB.y);
          ctx.lineTo(pWinMidT.x, pWinMidT.y);
          ctx.stroke();
        }
      }

      // 2e. "Rajdhani Express" & "WAP-7" Insignia on Front Brow
      const pInsignia = project(0, 2.30, zNose);
      if (pInsignia && pInsignia.scale > 18) {
        ctx.textAlign = 'center';
        const fSizeRaj = Math.max(8, Math.round(0.14 * pInsignia.scale));
        ctx.font = `bold ${fSizeRaj}px 'Inter', sans-serif`;
        ctx.fillStyle = '#fef08a';
        ctx.fillText('Rajdhani Express', pInsignia.x, pInsignia.y);

        // WAP-7 Class Badge
        const fSizeWap = Math.max(7, Math.round(0.12 * pInsignia.scale));
        ctx.font = `900 ${fSizeWap}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText('WAP-7', pInsignia.x, pInsignia.y + fSizeRaj * 1.15);
        ctx.textAlign = 'left';
      }

      // 2f. Indian Tricolor Flag Emblem on Front Nose
      const pFlag = project(-0.85, 2.05, zNose);
      if (pFlag && pFlag.scale > 18) {
        const sc = pFlag.scale;
        const flagW = 0.36 * sc;
        const flagH = 0.22 * sc;

        ctx.fillStyle = '#f97316'; // Saffron
        ctx.fillRect(pFlag.x, pFlag.y, flagW, flagH * 0.33);
        ctx.fillStyle = '#ffffff'; // White
        ctx.fillRect(pFlag.x, pFlag.y + flagH * 0.33, flagW, flagH * 0.33);
        ctx.fillStyle = '#16a34a'; // Green
        ctx.fillRect(pFlag.x, pFlag.y + flagH * 0.66, flagW, flagH * 0.33);
      }

      // 2g. High-Intensity Central Twin Headlights & Lower Marker Lamps
      const pHeadTop = project(0, 3.80, zNose - 1.5);
      const pHeadL = project(-0.95, 1.75, zNose);
      const pHeadR = project(0.95, 1.75, zNose);

      if (state.headlights) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 18;

        if (pHeadTop) {
          const r = Math.max(2.5, Math.min(8, 0.08 * pHeadTop.scale));
          ctx.beginPath();
          ctx.arc(pHeadTop.x, pHeadTop.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        if (pHeadL && pHeadR) {
          const r = Math.max(2, Math.min(7, 0.07 * pHeadL.scale));
          ctx.beginPath();
          ctx.arc(pHeadL.x, pHeadL.y, r, 0, Math.PI * 2);
          ctx.arc(pHeadR.x, pHeadR.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // Red Marker Lamps
      const pMarkerL = project(-1.25, 1.45, zNose);
      const pMarkerR = project(1.25, 1.45, zNose);
      if (pMarkerL && pMarkerR) {
        ctx.fillStyle = '#ef4444';
        const r = Math.max(1.8, Math.min(5, 0.05 * pMarkerL.scale));
        ctx.beginPath();
        ctx.arc(pMarkerL.x, pMarkerL.y, r, 0, Math.PI * 2);
        ctx.arc(pMarkerR.x, pMarkerR.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2h. Steel Buffer Beam
      const pBeamBL = project(-1.48, 0.82, zNose + 0.1);
      const pBeamBR = project(1.48, 0.82, zNose + 0.1);
      const pBeamTL = project(-1.48, 1.05, zNose + 0.1);
      const pBeamTR = project(1.48, 1.05, zNose + 0.1);
      if (pBeamBL && pBeamBR && pBeamTL && pBeamTR) {
        ctx.fillStyle = '#1e1b18'; // dark heavy steel buffer beam
        ctx.beginPath();
        ctx.moveTo(pBeamBL.x, pBeamBL.y);
        ctx.lineTo(pBeamBR.x, pBeamBR.y);
        ctx.lineTo(pBeamTR.x, pBeamTR.y);
        ctx.lineTo(pBeamTL.x, pBeamTL.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Buffers (Twin Round Side Discs)
      const pBufL = project(-1.05, 0.94, zNose + 0.35);
      const pBufR = project(1.05, 0.94, zNose + 0.35);
      if (pBufL && pBufR) {
        const r = Math.max(3, Math.min(11, 0.12 * pBufL.scale));
        [pBufL, pBufR].forEach(pb => {
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(pb.x, pb.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }

      // Center Knuckle CBC Coupler
      const pCoupler = project(0, 0.92, zNose + 0.4);
      if (pCoupler) {
        const cW = Math.max(4, Math.min(14, 0.14 * pCoupler.scale));
        const cH = Math.max(4, Math.min(12, 0.12 * pCoupler.scale));
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(pCoupler.x - cW * 0.5, pCoupler.y - cH * 0.5, cW, cH);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.strokeRect(pCoupler.x - cW * 0.5, pCoupler.y - cH * 0.5, cW, cH);
      }

      // 2i. Cowcatcher / Cattle Guard Pilot Grille (wedge slatted steel pilot below buffer beam)
      const pCowTopL = project(-1.30, 0.82, zNose);
      const pCowTopR = project(1.30, 0.82, zNose);
      const pCowBotL = project(-1.18, 0.28, zNose + 0.25);
      const pCowBotR = project(1.18, 0.28, zNose + 0.25);
      const pCowTip = project(0, 0.28, zNose + 0.45);

      if (pCowTopL && pCowTopR && pCowBotL && pCowBotR && pCowTip) {
        // Pilot Grille Base
        ctx.fillStyle = '#991b1b'; // Darker red body
        ctx.beginPath();
        ctx.moveTo(pCowTopL.x, pCowTopL.y);
        ctx.lineTo(pCowTopR.x, pCowTopR.y);
        ctx.lineTo(pCowBotR.x, pCowBotR.y);
        ctx.lineTo(pCowTip.x, pCowTip.y);
        ctx.lineTo(pCowBotL.x, pCowBotL.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#7f1d1d';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // White Diagonal Safety Hazard Stripes
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1.5, Math.min(3.5, 0.035 * pCowTopL.scale));
        const numStripes = 6;
        for (let sIdx = 1; sIdx <= numStripes; sIdx++) {
          const tFrac = sIdx / (numStripes + 1);
          const topX = pCowTopL.x + (pCowTopR.x - pCowTopL.x) * tFrac;
          const topY = pCowTopL.y;
          const botX = topX + (topX < pCowTip.x ? 8 : -8);
          const botY = pCowTip.y;
          ctx.beginPath();
          ctx.moveTo(topX, topY);
          ctx.lineTo(botX, botY);
          ctx.stroke();
        }
      }

      // 2j. Rooftop Pantograph contacting 25kV OHE contact wire
      const pPantoBase = project(0, 4.10, zNose - 5.5);
      if (pPantoBase) {
        if (state.pantographUp) {
          const pPantoContact = project(0, 5.30, zNose - 5.5);
          const pPantoKnee = project(0.4, 4.75, zNose - 5.5);

          if (pPantoContact && pPantoKnee) {
            ctx.strokeStyle = '#dc2626'; // Articulated red arm
            ctx.lineWidth = Math.max(2, Math.min(6, 0.06 * pPantoBase.scale));
            ctx.beginPath();
            ctx.moveTo(pPantoBase.x, pPantoBase.y);
            ctx.lineTo(pPantoKnee.x, pPantoKnee.y);
            ctx.lineTo(pPantoContact.x, pPantoContact.y);
            ctx.stroke();

            // Copper contact shoe
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = Math.max(2.5, Math.min(8, 0.09 * pPantoBase.scale));
            const shoeW = Math.max(12, Math.min(36, 0.35 * pPantoBase.scale));
            ctx.beginPath();
            ctx.moveTo(pPantoContact.x - shoeW * 0.5, pPantoContact.y);
            ctx.lineTo(pPantoContact.x + shoeW * 0.5, pPantoContact.y);
            ctx.stroke();

            // Electric spark flash at contact wire when accelerating
            if (state.speedKmh > 10 && state.throttlePercent > 20 && Math.random() < 0.10) {
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#38bdf8';
              ctx.shadowBlur = 16;
              ctx.beginPath();
              ctx.arc(pPantoContact.x, pPantoContact.y, 6, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        } else {
          // Pantograph folded down on roof
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(pPantoBase.x - 14, pPantoBase.y);
          ctx.lineTo(pPantoBase.x + 14, pPantoBase.y);
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }

  /**
   * Driver Cab Cockpit View (First-Person)
   * Detailed WAP-7 cockpit windscreen pillars, dashboard console, twin wipers, and dials.
   */
  drawCabCockpit(ctx, w, h, state, dt, weather) {
    ctx.save();

    // 1. Windshield Glass Reflections & Edge Tinting
    const glassGrad = ctx.createLinearGradient(0, 0, 0, h * 0.58);
    glassGrad.addColorStop(0, 'rgba(15, 23, 42, 0.35)');
    glassGrad.addColorStop(0.18, 'rgba(2, 132, 199, 0.06)');
    glassGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glassGrad;
    ctx.fillRect(0, 0, w, h * 0.58);

    // 2. Windshield Wipers (parked at bottom in clear weather, sweeping in rain)
    if (weather === 'rain') {
      this.wiperAngle += dt * 3.8 * this.wiperDirection;
      if (this.wiperAngle > 1.15) {
        this.wiperAngle = 1.15;
        this.wiperDirection = -1;
      } else if (this.wiperAngle < -0.20) {
        this.wiperAngle = -0.20;
        this.wiperDirection = 1;
      }
    } else {
      // Parked smoothly at bottom edge
      this.wiperAngle = -0.15;
    }

    // Draw twin heavy-duty wipers
    [w * 0.28, w * 0.72].forEach(bx => {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      const by = h * 0.58;
      const len = h * 0.38;
      const ex = bx + Math.sin(this.wiperAngle) * len;
      const ey = by - Math.cos(this.wiperAngle) * len;
      ctx.moveTo(bx, by);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // Wiper blade perpendicular bar
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      const bAng = this.wiperAngle + Math.PI / 2;
      const bLen = 30;
      ctx.beginPath();
      ctx.moveTo(ex - Math.cos(bAng) * bLen, ey - Math.sin(bAng) * bLen);
      ctx.lineTo(ex + Math.cos(bAng) * bLen, ey + Math.sin(bAng) * bLen);
      ctx.stroke();
    });

    // 3. Cab Structural Windscreen Pillars
    // Left A-pillar
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w * 0.12, 0);
    ctx.lineTo(w * 0.15, h * 0.58);
    ctx.lineTo(0, h * 0.58);
    ctx.closePath();
    ctx.fill();

    // Right A-pillar
    ctx.beginPath();
    ctx.moveTo(w, 0);
    ctx.lineTo(w * 0.88, 0);
    ctx.lineTo(w * 0.85, h * 0.58);
    ctx.lineTo(w, h * 0.58);
    ctx.closePath();
    ctx.fill();

    // Center divider pillar (slim with rubber seal)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(w * 0.494, 0, w * 0.012, h * 0.58);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(w * 0.494, 0, w * 0.012, h * 0.58);

    // Cab Roof Ceiling
    const roofGrad = ctx.createLinearGradient(0, 0, 0, h * 0.10);
    roofGrad.addColorStop(0, '#020617');
    roofGrad.addColorStop(0.7, '#0f172a');
    roofGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = roofGrad;
    ctx.fillRect(0, 0, w, h * 0.085);

    // Twin Dark Green Acrylic Sun Visors
    ctx.fillStyle = 'rgba(5, 46, 22, 0.55)'; // Deep emerald sunshade tint
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    [w * 0.14, w * 0.52].forEach(vx => {
      ctx.fillRect(vx, h * 0.06, w * 0.34, h * 0.08);
      ctx.strokeRect(vx, h * 0.06, w * 0.34, h * 0.08);
    });

    // 4. Loco Pilot Driver Console Desk (from h * 0.58 to bottom)
    const deskGrad = ctx.createLinearGradient(0, h * 0.58, 0, h);
    deskGrad.addColorStop(0, '#1e293b');
    deskGrad.addColorStop(0.12, '#0f172a');
    deskGrad.addColorStop(0.50, '#090d16');
    deskGrad.addColorStop(1.0, '#020617');

    ctx.fillStyle = deskGrad;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.58);
    ctx.lineTo(w, h * 0.58);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Console Chamfer Bezel Accent Line
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.58);
    ctx.lineTo(w, h * 0.58);
    ctx.stroke();

    // 5. Working Cockpit Instruments & Analog Gauges
    const drawGauge = (cx, cy, r, val, minV, maxV, label, unit, colorNeedle = '#ef4444') => {
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      const dialGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r - 3);
      dialGrad.addColorStop(0, '#1e293b');
      dialGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = dialGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
      ctx.fill();

      const startAngle = -Math.PI * 0.75;
      const endAngle = Math.PI * 0.75;
      const numTicks = 8;
      for (let t = 0; t <= numTicks; t++) {
        const ang = startAngle + (t / numTicks) * (endAngle - startAngle);
        const x1 = cx + Math.cos(ang) * (r - 6);
        const y1 = cy + Math.sin(ang) * (r - 6);
        const x2 = cx + Math.cos(ang) * (r - 12);
        const y2 = cy + Math.sin(ang) * (r - 12);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.fillStyle = '#cbd5e1';
      ctx.font = `bold ${Math.max(7, Math.round(r * 0.22))}px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(label, cx, cy + r * 0.40);
      ctx.fillStyle = '#38bdf8';
      ctx.font = `600 ${Math.max(6, Math.round(r * 0.16))}px 'JetBrains Mono', monospace`;
      ctx.fillText(unit, cx, cy + r * 0.62);

      const clampedVal = Math.max(minV, Math.min(maxV, val));
      const valFrac = (clampedVal - minV) / (maxV - minV);
      const needleAngle = startAngle + valFrac * (endAngle - startAngle);
      ctx.strokeStyle = colorNeedle;
      ctx.lineWidth = 2;
      ctx.shadowColor = colorNeedle;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(needleAngle) * (r - 8), cy + Math.sin(needleAngle) * (r - 8));
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const gaugeY = h * 0.67;

    // Gauge 1: Speedometer (0 - 160 km/h)
    drawGauge(w * 0.38, gaugeY, 36, state.speedKmh || 0, 0, 160, 'SPEED', 'KM/H', '#f87171');

    // Gauge 2: Duplex Air Brake Pressure (BP: 0 - 6 bar)
    const bpPressure = state.brakesApplied ? Math.max(0, 5.0 - ((state.brakePercent || 0) / 100) * 5.0) : 5.0;
    drawGauge(w * 0.62, gaugeY, 36, bpPressure, 0, 6, 'BRAKE', 'BP BAR', '#4ade80');

    // Gauge 3: 25kV OHE Voltage Meter (0 - 30 kV)
    const oheKv = state.pantographUp ? 25.0 : 0.0;
    drawGauge(w * 0.24, gaugeY, 26, oheKv, 0, 30, 'OHE', '25 kV', '#facc15');

    // Gauge 4: Traction Motor Current (0 - 1000 A)
    const motorAmps = ((state.throttlePercent || 0) / 100) * (state.speedKmh > 5 ? 750 : 350);
    drawGauge(w * 0.76, gaugeY, 26, motorAmps, 0, 1000, 'MOTOR', 'AMPS', '#38bdf8');

    // Center Console Display: Traction Notch & WAP-7 Loco Plate
    const notchVal = Math.round(((state.throttlePercent || 0) / 100) * 32);
    ctx.fillStyle = '#020617';
    ctx.fillRect(w * 0.46, gaugeY - 26, w * 0.08, 22);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1;
    ctx.strokeRect(w * 0.46, gaugeY - 26, w * 0.08, 22);

    ctx.fillStyle = '#22c55e';
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(`NOTCH N${notchVal}`, w * 0.50, gaugeY - 11);

    // Brass Plaque
    ctx.fillStyle = '#b45309';
    ctx.fillRect(w * 0.43, gaugeY + 4, w * 0.14, 16);
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1;
    ctx.strokeRect(w * 0.43, gaugeY + 4, w * 0.14, 16);

    ctx.fillStyle = '#fef08a';
    ctx.font = "bold 8px 'Inter', sans-serif";
    ctx.fillText('CLW • WAP-7 30201', w * 0.50, gaugeY + 15);
    ctx.textAlign = 'left';

    ctx.restore();
  }

  drawRain(ctx, w, h, speedKmh, dt) {
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
    ctx.lineWidth = 1.5;

    const slant = 18 + (speedKmh / 140) * 45;

    ctx.beginPath();
    for (const drop of this.rainDrops) {
      drop.y += drop.speed * (dt * 60) * 0.025;
      drop.x += (slant / w) * (dt * 60) * 0.025;

      if (drop.y > 1) {
        drop.y = 0;
        drop.x = Math.random();
      }
      if (drop.x > 1) drop.x = 0;

      const px = drop.x * w;
      const py = drop.y * h;

      ctx.moveTo(px, py);
      ctx.lineTo(px + slant * 0.4, py + drop.length);
    }
    ctx.stroke();
  }

  drawFog(ctx, w, h, horizonY) {
    const fogGrad = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 120);
    fogGrad.addColorStop(0, 'rgba(203, 213, 225, 0.45)');
    fogGrad.addColorStop(0.5, 'rgba(226, 232, 240, 0.65)');
    fogGrad.addColorStop(1.0, 'rgba(241, 245, 249, 0.0)');

    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, horizonY - 40, w, 160);
  }
}
