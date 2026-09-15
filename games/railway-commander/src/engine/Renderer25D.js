/**
 * Railway Commander - 2.5D Indian Railways Simulator Renderer
 * Features:
 * - Authentic Indian Railways WAP-7 Electric Locomotive in Rajdhani Express livery
 * - Red & cream LHB Rajdhani passenger coaches with lit passenger windows
 * - 3 Dynamic Camera Modes:
 *     1. 'platform' (Cinematic station platform view alongside passengers & coolies)
 *     2. 'cab' (Inside the WAP-7 cockpit with windshield & wipers)
 *     3. 'chase' (Elevated third-person follow cam)
 * - Station platforms (e.g. Arakkonam Junction) with tiled floors, red coping borders,
 *   yellow safety lines, blue corrugated canopy roof trusses, Indian Railways station boards (Tamil/English/Hindi)
 * - Animated platform life: Indian railway coolies in red kurtas carrying trunks on heads,
 *   walking passengers, luggage trolleys, and traditional "CHAI & SNACKS" stalls
 * - 25kV AC OHE overhead electrification catenary wires and steel portal gantries
 * - Double-track railway corridor with parked/opposing rakes on parallel track
 * - 4-aspect Indian railway color light signals and dynamic headlight bloom
 */

export class Renderer25D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });

    // Camera Mode: 'platform' (cinematic station view), 'cab' (cockpit windshield), or 'chase' (elevated)
    this.cameraMode = 'platform';

    // Rain Particle Pool
    this.rainDrops = [];
    this.maxRainDrops = 160;
    this.initRain();

    // Wiper Animation State
    this.wiperAngle = 0;
    this.wiperDirection = 1;

    // Headlight & Spark Animation
    this.sparkTimer = 0;
    this.sparkActive = false;
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
    const cssW = (rect.width > 0 ? rect.width : window.innerWidth) || 800;
    const cssH = (rect.height > 0 ? rect.height : window.innerHeight) || 600;
    this.canvas.width = Math.floor(cssW * dpr);
    this.canvas.height = Math.floor(cssH * dpr);
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  setCameraMode(mode) {
    if (mode === 'cab' || mode === 'chase' || mode === 'platform') {
      this.cameraMode = mode;
    } else {
      this.cameraMode = 'platform';
    }
  }

  cycleCameraMode() {
    if (this.cameraMode === 'platform') {
      this.setCameraMode('cab');
    } else if (this.cameraMode === 'cab') {
      this.setCameraMode('chase');
    } else {
      this.setCameraMode('platform');
    }
    return this.cameraMode;
  }

  getCameraModeLabel() {
    if (this.cameraMode === 'platform') return '🎥 PLATFORM VIEW';
    if (this.cameraMode === 'cab') return '🎥 CAB VIEW';
    return '🎥 CHASE VIEW';
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

    // Camera Configuration based on Active View Mode
    let cameraX = 0;
    let cameraHeight = 3.6;
    let cameraZ = trainPos - 7.5;
    let horizonY = h * 0.42;
    const focalLength = w * 0.78;

    if (this.cameraMode === 'platform') {
      // Cinematic platform view matching user's screenshot
      cameraX = 2.4; // positioned on right platform
      cameraHeight = 1.85; // standing human eye level on platform
      cameraZ = trainPos - 6.2; // alongside and slightly ahead of the loco nose
      horizonY = h * 0.42;
    } else if (this.cameraMode === 'cab') {
      // Driver windscreen view
      cameraX = 0.0;
      cameraHeight = 2.45;
      cameraZ = trainPos + 0.8;
      horizonY = h * 0.44;
    } else {
      // Chase follow cam
      cameraX = 0.0;
      cameraHeight = 4.8;
      cameraZ = trainPos - 9.5;
      horizonY = h * 0.39;
    }

    // 1. Draw Sky & Landscape
    this.drawSkyAndLandscape(ctx, w, h, horizonY, timeOfDay, weather, trainPos);

    // Track Geometry & Curvature
    const trackHalfGauge = 0.84; // broad gauge half-width (~1676mm Indian Broad Gauge)
    const baseCurvature = trackManager.getCurvatureAt(trainPos);

    // 3D Perspective Projection Function
    const project = (x, y, z) => {
      const relZ = z - cameraZ;
      if (relZ <= 0.2) return null;
      const scale = focalLength / relZ;
      const distFromCam = relZ;
      const curveOffset = baseCurvature * (distFromCam * distFromCam) * 0.15;
      const screenX = (w * 0.5) + (x - cameraX + curveOffset) * scale;
      const screenY = horizonY + (cameraHeight - y) * scale;
      return { x: screenX, y: screenY, scale, relZ };
    };

    // 2. Draw Ground & Ballast Beds (Double Track)
    this.drawGroundAndBallast(ctx, w, h, horizonY, project, cameraZ, timeOfDay);

    // 3. Draw Railroad Sleepers (Ties)
    this.drawRailTies(ctx, project, cameraZ, timeOfDay);

    // 4. Draw Steel Rails (Active Track + Left Parallel Track)
    this.drawSteelRails(ctx, project, cameraZ, trackHalfGauge, state.headlights, timeOfDay);

    // 5. Draw 25kV OHE Catenary Electric Wires
    this.drawOverheadCatenary(ctx, project, cameraZ, timeOfDay);

    // 6. Draw Stations, Platforms, Canopies & Boards
    this.drawStations(ctx, project, cameraZ, stationSystem, trackHalfGauge, timeOfDay);

    // 7. Draw Scenery (Coolies, passengers, tea stalls, catenary masts, buildings)
    this.drawScenery(ctx, project, cameraZ, trackManager, timeOfDay);

    // 8. Draw Railway Color Light Signals
    this.drawSignals(ctx, project, cameraZ, signalSystem, timeOfDay);

    // 9. Draw Headlight Projection Beams
    if (state.headlights) {
      this.drawHeadlightBeams(ctx, w, h, horizonY, this.cameraMode === 'cab', cameraX);
    }

    // 10. Draw 3D WAP-7 Rajdhani Train & Coaches (if not inside Cab View)
    if (this.cameraMode !== 'cab') {
      this.drawIndianTrain(ctx, project, cameraZ, trainPos, state, timeOfDay, dt);
    }

    // 11. Draw WAP-7 Driver Cockpit Frame (if Cab View Mode)
    if (this.cameraMode === 'cab') {
      this.drawCabCockpit(ctx, w, h, state, dt, weather);
    }

    // 12. Draw Weather Overlay (Rain / Fog)
    if (weather === 'rain') {
      this.drawRain(ctx, w, h, speedKmh, dt);
    } else if (weather === 'fog') {
      this.drawFog(ctx, w, h, horizonY);
    }
  }

  drawSkyAndLandscape(ctx, w, h, horizonY, timeOfDay, weather, trainPos) {
    // Sky Gradient
    let skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    if (timeOfDay === 'sunset') {
      // Dusk / sunset as in reference screenshot
      skyGrad.addColorStop(0, '#0c1e3d'); // Deep twilight navy
      skyGrad.addColorStop(0.35, '#1e3a5f'); // Indigo
      skyGrad.addColorStop(0.7, '#2563eb'); // Indian Railway blue haze
      skyGrad.addColorStop(1.0, '#38bdf8'); // Horizon glow
    } else if (timeOfDay === 'night') {
      skyGrad.addColorStop(0, '#020617');
      skyGrad.addColorStop(0.6, '#090d1f');
      skyGrad.addColorStop(1.0, '#131b38');
    } else {
      // Daytime
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(0.5, '#38bdf8');
      skyGrad.addColorStop(1.0, '#bae6fd');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizonY + 2);

    // Moon / Evening Star
    if (timeOfDay === 'sunset' || timeOfDay === 'night') {
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = 'rgba(254, 240, 138, 0.6)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(w * 0.78, horizonY * 0.28, timeOfDay === 'night' ? 22 : 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Distant City Skyline / Station Sheds (Parallax)
    const skylineScroll = (trainPos * 0.08) % (w * 0.4);
    ctx.fillStyle = timeOfDay === 'night' ? '#080d1e' : (timeOfDay === 'sunset' ? '#111827' : '#1e3a8a');
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    for (let x = -skylineScroll; x <= w + 120; x += 90) {
      const bH = 25 + Math.sin(x * 0.03) * 18 + (x % 30);
      ctx.lineTo(x, horizonY - bH);
      ctx.lineTo(x + 55, horizonY - bH);
      ctx.lineTo(x + 55, horizonY);
    }
    ctx.closePath();
    ctx.fill();
  }

  drawGroundAndBallast(ctx, w, h, horizonY, project, cameraZ, timeOfDay) {
    // Natural Ground (Dark earth / station apron)
    let groundGrad = ctx.createLinearGradient(0, horizonY, 0, h);
    if (timeOfDay === 'night' || timeOfDay === 'sunset') {
      groundGrad.addColorStop(0, '#090d16');
      groundGrad.addColorStop(1.0, '#0f172a');
    } else {
      groundGrad.addColorStop(0, '#14532d');
      groundGrad.addColorStop(1.0, '#166534');
    }
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, horizonY, w, h - horizonY);

    const farZ = cameraZ + 380;
    const nearZ = cameraZ + 1.2;

    // 1. Main Track Gravel Ballast Bed (Active Track x = -2.2 to +2.2)
    const pFarL = project(-2.2, 0, farZ);
    const pFarR = project(2.2, 0, farZ);
    const pNearL = project(-2.8, 0, nearZ);
    const pNearR = project(2.8, 0, nearZ);

    if (pFarL && pFarR && pNearL && pNearR) {
      ctx.fillStyle = timeOfDay === 'night' ? '#1c1917' : '#292524'; // dark crushed granite ballast
      ctx.beginPath();
      ctx.moveTo(pFarL.x, pFarL.y);
      ctx.lineTo(pFarR.x, pFarR.y);
      ctx.lineTo(pNearR.x, pNearR.y);
      ctx.lineTo(pNearL.x, pNearL.y);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Parallel Left Track Gravel Ballast Bed (x = -5.4 to -2.3)
    const pLeftFarL = project(-5.4, 0, farZ);
    const pLeftFarR = project(-2.3, 0, farZ);
    const pLeftNearL = project(-6.0, 0, nearZ);
    const pLeftNearR = project(-2.9, 0, nearZ);

    if (pLeftFarL && pLeftFarR && pLeftNearL && pLeftNearR) {
      ctx.fillStyle = timeOfDay === 'night' ? '#171717' : '#262626';
      ctx.beginPath();
      ctx.moveTo(pLeftFarL.x, pLeftFarL.y);
      ctx.lineTo(pLeftFarR.x, pLeftFarR.y);
      ctx.lineTo(pLeftNearR.x, pLeftNearR.y);
      ctx.lineTo(pLeftNearL.x, pLeftNearL.y);
      ctx.closePath();
      ctx.fill();
    }
  }

  drawRailTies(ctx, project, cameraZ, timeOfDay) {
    const tieSpacing = 0.85; // Indian Railways sleeper spacing
    const tieWidth = 1.35;   // half width for broad gauge concrete sleeper
    const startZ = Math.floor(cameraZ / tieSpacing) * tieSpacing;
    const endZ = cameraZ + 160;

    ctx.fillStyle = timeOfDay === 'night' ? '#27272a' : '#52525b'; // PSC concrete sleepers

    for (let z = endZ; z >= startZ; z -= tieSpacing) {
      if (z <= cameraZ + 0.5) continue;

      // Active Track Sleeper
      const pL = project(-tieWidth, 0.05, z);
      const pR = project(tieWidth, 0.05, z);
      if (pL && pR) {
        const thickness = Math.max(1.2, 3.8 * pL.scale);
        ctx.fillRect(pL.x, pL.y - thickness, pR.x - pL.x, thickness);
      }

      // Parallel Left Track Sleeper
      const pLeftL = project(-3.6 - tieWidth, 0.05, z);
      const pLeftR = project(-3.6 + tieWidth, 0.05, z);
      if (pLeftL && pLeftR) {
        const thickness = Math.max(1.0, 3.2 * pLeftL.scale);
        ctx.fillRect(pLeftL.x, pLeftL.y - thickness, pLeftR.x - pLeftL.x, thickness);
      }
    }
  }

  drawSteelRails(ctx, project, cameraZ, trackHalfGauge, headlightsOn, timeOfDay) {
    const steps = 40;
    const maxViewZ = 340;
    const stepSize = maxViewZ / steps;

    // Active Track Rails
    const leftRail = [];
    const rightRail = [];
    // Left Parallel Track Rails
    const leftTrkL = [];
    const leftTrkR = [];

    for (let i = 0; i <= steps; i++) {
      const z = cameraZ + 0.8 + (i * stepSize);

      const pL = project(-trackHalfGauge, 0.16, z);
      const pR = project(trackHalfGauge, 0.16, z);
      if (pL && pR) {
        leftRail.push(pL);
        rightRail.push(pR);
      }

      const pLL = project(-3.6 - trackHalfGauge, 0.16, z);
      const pLR = project(-3.6 + trackHalfGauge, 0.16, z);
      if (pLL && pLR) {
        leftTrkL.push(pLL);
        leftTrkR.push(pLR);
      }
    }

    // Render Shiny Steel Rails
    const drawRail = (pts, width, color) => {
      if (pts.length < 2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    };

    // Active track base and shiny chrome head
    drawRail(leftRail, 4, '#090d16');
    drawRail(rightRail, 4, '#090d16');
    drawRail(leftRail, 2.4, '#e2e8f0');
    drawRail(rightRail, 2.4, '#e2e8f0');
    drawRail(leftRail, 1.2, '#ffffff');
    drawRail(rightRail, 1.2, '#ffffff');

    // Parallel track rails
    drawRail(leftTrkL, 3, '#090d16');
    drawRail(leftTrkR, 3, '#090d16');
    drawRail(leftTrkL, 2, '#94a3b8');
    drawRail(leftTrkR, 2, '#94a3b8');
  }

  drawOverheadCatenary(ctx, project, cameraZ, timeOfDay) {
    // 25kV OHE Catenary Wire & Contact Wire
    const steps = 30;
    const stepSize = 10;
    const catenaryWire = [];
    const contactWire = [];

    for (let i = 0; i <= steps; i++) {
      const z = cameraZ + 0.8 + (i * stepSize);
      // Droop sag between masts
      const sag = Math.sin((z % 65) / 65 * Math.PI) * 0.18;
      const pTop = project(0, 5.8 - sag, z);
      const pContact = project(0, 5.2, z);

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

    drawWire(catenaryWire, 'rgba(148, 163, 184, 0.4)', 1.2);
    drawWire(contactWire, 'rgba(253, 224, 71, 0.65)', 1.5); // copper contact wire
  }

  drawStations(ctx, project, cameraZ, stationSystem, trackHalfGauge, timeOfDay) {
    const stations = stationSystem.stations || [];

    for (const st of stations) {
      const dist = st.stopPosition - cameraZ;
      if (dist < -120 || dist > 450) continue;

      const platLength = st.platformLength || 160;
      const platStart = st.stopPosition - platLength * 0.72;
      const platEnd = st.stopPosition + platLength * 0.28;
      const platSideX = trackHalfGauge + 1.1; // 1.94m from center
      const platWidth = 5.2;
      const platHeight = 0.95; // high-level Indian Railway passenger platform

      // 1. Platform Deck Surface (Tiled stone)
      const pNearFront = project(platSideX, platHeight, Math.max(cameraZ + 0.8, platStart));
      const pNearBack = project(platSideX + platWidth, platHeight, Math.max(cameraZ + 0.8, platStart));
      const pFarFront = project(platSideX, platHeight, platEnd);
      const pFarBack = project(platSideX + platWidth, platHeight, platEnd);

      if (pNearFront && pNearBack && pFarFront && pFarBack) {
        // Platform Deck Stone Surface
        const platGrad = ctx.createLinearGradient(pNearFront.x, 0, pNearBack.x, 0);
        platGrad.addColorStop(0, '#cbd5e1'); // Stone grey tiles
        platGrad.addColorStop(0.3, '#94a3b8');
        platGrad.addColorStop(1.0, '#64748b');

        ctx.fillStyle = platGrad;
        ctx.beginPath();
        ctx.moveTo(pNearFront.x, pNearFront.y);
        ctx.lineTo(pNearBack.x, pNearBack.y);
        ctx.lineTo(pFarBack.x, pFarBack.y);
        ctx.lineTo(pFarFront.x, pFarFront.y);
        ctx.closePath();
        ctx.fill();

        // Platform Vertical Concrete Wall Facing Track
        const pNearBase = project(platSideX, 0, Math.max(cameraZ + 0.8, platStart));
        const pFarBase = project(platSideX, 0, platEnd);
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

        // Red Coping Stone Edge along Platform Edge (classic Indian Railway platform)
        const pNearRedBack = project(platSideX + 0.35, platHeight, Math.max(cameraZ + 0.8, platStart));
        const pFarRedBack = project(platSideX + 0.35, platHeight, platEnd);
        if (pNearRedBack && pFarRedBack) {
          ctx.fillStyle = '#b91c1c'; // Indian Red platform curb edge
          ctx.beginPath();
          ctx.moveTo(pNearFront.x, pNearFront.y);
          ctx.lineTo(pNearRedBack.x, pNearRedBack.y);
          ctx.lineTo(pFarRedBack.x, pFarRedBack.y);
          ctx.lineTo(pFarFront.x, pFarFront.y);
          ctx.closePath();
          ctx.fill();
        }

        // Yellow Platform Safety Line
        const pNearYellow = project(platSideX + 0.65, platHeight, Math.max(cameraZ + 0.8, platStart));
        const pFarYellow = project(platSideX + 0.65, platHeight, platEnd);
        if (pNearYellow && pFarYellow) {
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = Math.max(2, 4.5 * pNearYellow.scale);
          ctx.beginPath();
          ctx.moveTo(pNearYellow.x, pNearYellow.y);
          ctx.lineTo(pFarYellow.x, pFarYellow.y);
          ctx.stroke();
        }

        // Platform Corrugated Blue Canopy Roof Shed (as seen in screenshot)
        for (let postZ = platStart + 15; postZ < platEnd; postZ += 28) {
          if (postZ < cameraZ + 0.8) continue;
          const pPostBase = project(platSideX + 2.8, platHeight, postZ);
          const pPostTop = project(platSideX + 2.8, platHeight + 4.2, postZ);
          const pCanopyLeft = project(platSideX - 0.6, platHeight + 4.8, postZ);
          const pCanopyRight = project(platSideX + 5.0, platHeight + 4.4, postZ);

          if (pPostBase && pPostTop && pCanopyLeft && pCanopyRight) {
            // Steel Support Column
            ctx.strokeStyle = '#1e3a8a';
            ctx.lineWidth = Math.max(2.5, 6 * pPostBase.scale);
            ctx.beginPath();
            ctx.moveTo(pPostBase.x, pPostBase.y);
            ctx.lineTo(pPostTop.x, pPostTop.y);
            ctx.stroke();

            // Roof Triangular Steel Truss Girder
            ctx.strokeStyle = '#2563eb';
            ctx.lineWidth = Math.max(2, 4 * pPostBase.scale);
            ctx.beginPath();
            ctx.moveTo(pCanopyLeft.x, pCanopyLeft.y);
            ctx.lineTo(pPostTop.x, pPostTop.y);
            ctx.lineTo(pCanopyRight.x, pCanopyRight.y);
            ctx.stroke();

            // Corrugated Blue Metal Roof Sheet
            ctx.fillStyle = '#1d4ed8';
            ctx.fillRect(pCanopyLeft.x, pCanopyLeft.y - (4 * pPostBase.scale), Math.abs(pCanopyRight.x - pCanopyLeft.x), 5 * pPostBase.scale);
          }
        }
      }

      // 2. Indian Railways Yellow Enamel Station Board Signpost
      const pSignBase = project(platSideX + 2.8, platHeight, st.stopPosition - 18);
      const pSignTop = project(platSideX + 2.8, platHeight + 3.2, st.stopPosition - 18);
      if (pSignBase && pSignTop && pSignBase.scale > 0.002) {
        const signW = 140 * pSignBase.scale;
        const signH = 50 * pSignBase.scale;

        // Signpost Legs
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = Math.max(2, 4 * pSignBase.scale);
        ctx.beginPath();
        ctx.moveTo(pSignTop.x - signW * 0.35, pSignBase.y);
        ctx.lineTo(pSignTop.x - signW * 0.35, pSignTop.y);
        ctx.moveTo(pSignTop.x + signW * 0.35, pSignBase.y);
        ctx.lineTo(pSignTop.x + signW * 0.35, pSignTop.y);
        ctx.stroke();

        // Yellow Enamel Board
        ctx.fillStyle = '#facc15'; // Authentic Indian Railway yellow
        ctx.fillRect(pSignTop.x - signW * 0.5, pSignTop.y - signH * 0.5, signW, signH);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1.5, 3 * pSignBase.scale);
        ctx.strokeRect(pSignTop.x - signW * 0.5, pSignTop.y - signH * 0.5, signW, signH);

        // Station Names (Tamil / English / Hindi)
        if (signH > 18) {
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.font = `bold ${Math.max(8, Math.round(11 * pSignBase.scale * 10))}px Inter, sans-serif`;
          ctx.fillText(st.name || 'ARAKKONAM', pSignTop.x, pSignTop.y + 2);

          if (st.nativeTamil && signH > 28) {
            ctx.font = `bold ${Math.max(7, Math.round(8 * pSignBase.scale * 10))}px sans-serif`;
            ctx.fillText(st.nativeTamil, pSignTop.x, pSignTop.y - signH * 0.24);
          }
          if (st.nativeHindi && signH > 28) {
            ctx.font = `bold ${Math.max(7, Math.round(8 * pSignBase.scale * 10))}px sans-serif`;
            ctx.fillText(st.nativeHindi, pSignTop.x, pSignTop.y + signH * 0.32);
          }
          ctx.textAlign = 'left';
        }
      }

      // 3. STOP TARGET ZONE MARKER on Track & Platform
      const stopZ = st.stopPosition;
      if (stopZ > cameraZ + 0.5 && stopZ < cameraZ + 350) {
        const pStopL = project(-trackHalfGauge * 1.3, 0.08, stopZ);
        const pStopR = project(trackHalfGauge * 1.3, 0.08, stopZ);
        const pPlatStop = project(platSideX + 1.2, platHeight + 0.05, stopZ);

        if (pStopL && pStopR) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = Math.max(3, 7 * pStopL.scale);
          ctx.beginPath();
          ctx.moveTo(pStopL.x, pStopL.y);
          ctx.lineTo(pStopR.x, pStopR.y);
          ctx.stroke();

          if (pPlatStop && pPlatStop.scale > 0.003) {
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.fillStyle = '#ef4444';
            ctx.fillText('🛑 STOP TARGET', pPlatStop.x, pPlatStop.y);
          }
        }
      }
    }
  }

  drawScenery(ctx, project, cameraZ, trackManager, timeOfDay) {
    const scenery = trackManager.scenery || [];

    for (const item of scenery) {
      const relZ = item.position - cameraZ;
      if (relZ < 1 || relZ > 420) continue;

      // 1. Coolies (Porters in red kurtas carrying trunks on head)
      if (item.type === 'coolie') {
        const p = project(item.dist, 0.95, item.position);
        if (p && p.scale > 0.002) {
          const sc = p.scale * 14;
          const coolieH = 34 * sc;
          const coolieW = 14 * sc;

          // Red Kurta Body
          ctx.fillStyle = '#dc2626'; // Vibrant red
          ctx.fillRect(p.x - coolieW * 0.4, p.y - coolieH * 0.72, coolieW * 0.8, coolieH * 0.45);

          // Head with turban
          ctx.fillStyle = '#d97706'; // turban
          ctx.beginPath();
          ctx.arc(p.x, p.y - coolieH * 0.82, coolieW * 0.35, 0, Math.PI * 2);
          ctx.fill();

          // Dhoti / Trousers
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(p.x - coolieW * 0.35, p.y - coolieH * 0.32, coolieW * 0.3, coolieH * 0.32);
          ctx.fillRect(p.x + coolieW * 0.05, p.y - coolieH * 0.32, coolieW * 0.3, coolieH * 0.32);

          // Luggage Trunk Box Balanced on Head!
          ctx.fillStyle = item.trunkColor || '#b45309';
          ctx.fillRect(p.x - coolieW * 0.75, p.y - coolieH * 1.15, coolieW * 1.5, coolieH * 0.32);
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1;
          ctx.strokeRect(p.x - coolieW * 0.75, p.y - coolieH * 1.15, coolieW * 1.5, coolieH * 0.32);
        }
      }
      // 2. Passengers walking with bags
      else if (item.type === 'passenger') {
        const p = project(item.dist, 0.95, item.position);
        if (p && p.scale > 0.002) {
          const sc = p.scale * 14;
          const passH = 32 * sc;
          const passW = 12 * sc;

          // Shirt
          ctx.fillStyle = item.shirtColor || '#f8fafc';
          ctx.fillRect(p.x - passW * 0.4, p.y - passH * 0.7, passW * 0.8, passH * 0.42);

          // Head
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.arc(p.x, p.y - passH * 0.82, passW * 0.35, 0, Math.PI * 2);
          ctx.fill();

          // Trousers
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(p.x - passW * 0.35, p.y - passH * 0.3, passW * 0.3, passH * 0.3);
          ctx.fillRect(p.x + passW * 0.05, p.y - passH * 0.3, passW * 0.3, passH * 0.3);

          // Suitcase in hand
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(p.x + passW * 0.45, p.y - passH * 0.35, passW * 0.4, passH * 0.25);
        }
      }
      // 3. Indian Railway Chai / Snack Stall ("CHAI / SNACKS")
      else if (item.type === 'tea_stall') {
        const p = project(item.dist, 0.95, item.position);
        if (p && p.scale > 0.002) {
          const sc = p.scale * 16;
          const stallW = 45 * sc;
          const stallH = 38 * sc;

          // Counter Base
          ctx.fillStyle = '#78350f';
          ctx.fillRect(p.x - stallW * 0.5, p.y - stallH * 0.5, stallW, stallH * 0.5);

          // Warm Counter Illumination
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(p.x - stallW * 0.45, p.y - stallH * 0.85, stallW * 0.9, stallH * 0.35);

          // Chai Signboard
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(p.x - stallW * 0.5, p.y - stallH * 1.05, stallW, stallH * 0.22);
          if (stallW > 35) {
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.max(8, Math.round(9 * sc))}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('CHAI / SNACKS', p.x, p.y - stallH * 0.9);
            ctx.textAlign = 'left';
          }

          // Striped Awning
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(p.x - stallW * 0.55, p.y - stallH * 1.15, stallW * 1.1, stallH * 0.12);
        }
      }
      // 4. Luggage Trolleys & Push Carts
      else if (item.type === 'trolley') {
        const p = project(item.dist, 0.95, item.position);
        if (p && p.scale > 0.002) {
          const sc = p.scale * 14;
          const tW = 28 * sc;
          const tH = 16 * sc;

          ctx.fillStyle = '#1e293b';
          ctx.fillRect(p.x - tW * 0.5, p.y - tH * 0.5, tW, tH * 0.3);

          // Sacks and parcels
          ctx.fillStyle = '#d97706';
          ctx.fillRect(p.x - tW * 0.4, p.y - tH * 1.1, tW * 0.8, tH * 0.6);

          // Small Wheels
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(p.x - tW * 0.35, p.y - tH * 0.1, 3 * sc, 0, Math.PI * 2);
          ctx.arc(p.x + tW * 0.35, p.y - tH * 0.1, 3 * sc, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // 5. Parked Opposing Passenger Rake on Left Track
      else if (item.type === 'parked_train') {
        const pFront = project(-3.6, 0.8, item.position);
        const pRear = project(-3.6, 0.8, item.endPosition || item.position + 60);
        if (pFront && pRear) {
          const sc = pFront.scale * 22;
          const coachH = 45 * sc;
          const coachW = 28 * sc;

          // Coach Body (Indian Railway Red/Blue)
          ctx.fillStyle = '#1e3a8a'; // Blue ICF livery on opposing train
          ctx.fillRect(pFront.x - coachW * 0.5, pFront.y - coachH, coachW, coachH);

          // Coach Windows with glowing warm light
          ctx.fillStyle = '#fef08a';
          const winCount = 4;
          for (let wIdx = 0; wIdx < winCount; wIdx++) {
            ctx.fillRect(
              pFront.x - coachW * 0.4 + (wIdx * coachW * 0.22),
              pFront.y - coachH * 0.65,
              coachW * 0.16,
              coachH * 0.28
            );
          }
        }
      }
      // 6. Overhead Electrification Catenary Portal Masts
      else if (item.type === 'catenary') {
        const pBase = project(item.side * 2.9, 0, item.position);
        const pTop = project(item.side * 2.9, 6.8, item.position);
        const pWireAnchor = project(0, 5.4, item.position);

        if (pBase && pTop && pWireAnchor) {
          ctx.strokeStyle = timeOfDay === 'night' ? '#334155' : '#64748b';
          ctx.lineWidth = Math.max(1.8, 3.8 * pBase.scale);
          ctx.beginPath();
          ctx.moveTo(pBase.x, pBase.y);
          ctx.lineTo(pTop.x, pTop.y);
          ctx.lineTo(pWireAnchor.x, pWireAnchor.y);
          ctx.stroke();

          // Insulator
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(pWireAnchor.x, pWireAnchor.y, Math.max(1.5, 3 * pBase.scale), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // 7. Trees
      else if (item.type === 'tree') {
        const p = project(item.side * item.dist, 0, item.position);
        if (p && p.scale > 0.002) {
          const treeH = 38 * p.scale * (item.scale || 1);
          const treeW = 24 * p.scale * (item.scale || 1);

          ctx.fillStyle = '#3e2723';
          ctx.fillRect(p.x - 2 * p.scale, p.y - treeH * 0.3, 4 * p.scale, treeH * 0.3);

          ctx.fillStyle = timeOfDay === 'night' ? '#064e3b' : (timeOfDay === 'sunset' ? '#14532d' : '#15803d');
          ctx.beginPath();
          ctx.arc(p.x, p.y - treeH * 0.65, treeW, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // 8. Buildings
      else if (item.type === 'building') {
        const p = project(item.side * item.dist, 0, item.position);
        if (p && p.scale > 0.002) {
          const bW = item.width * p.scale * 12;
          const bH = item.height * p.scale * 14;

          ctx.fillStyle = item.color || '#1e293b';
          ctx.fillRect(p.x - bW * 0.5, p.y - bH, bW, bH);
        }
      }
    }
  }

  drawSignals(ctx, project, cameraZ, signalSystem, timeOfDay) {
    const signals = signalSystem.signals || [];

    for (const sig of signals) {
      const relZ = sig.positionMeters - cameraZ;
      if (relZ < 1 || relZ > 420) continue;

      const mastX = -2.4;
      const pBase = project(mastX, 0, sig.positionMeters);
      const pHead = project(mastX, 4.6, sig.positionMeters);

      if (pBase && pHead) {
        // Mast Pole
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = Math.max(2, 4.5 * pBase.scale);
        ctx.beginPath();
        ctx.moveTo(pBase.x, pBase.y);
        ctx.lineTo(pHead.x, pHead.y);
        ctx.stroke();

        // Signal Head Box
        const boxW = 18 * pHead.scale;
        const boxH = 44 * pHead.scale;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(pHead.x - boxW * 0.5, pHead.y - boxH * 0.5, boxW, boxH);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(pHead.x - boxW * 0.5, pHead.y - boxH * 0.5, boxW, boxH);

        // Aspect Lenses: Red (Top), Yellow (Middle), Green (Bottom)
        const radius = Math.max(2, 4.6 * pHead.scale);
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
            ctx.shadowBlur = Math.max(8, 22 * pHead.scale);
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

  drawHeadlightBeams(ctx, w, h, horizonY, isCab, cameraX) {
    const originX = w * 0.5 - (cameraX * w * 0.15);
    const originY = isCab ? h * 0.72 : h * 0.82;

    const grad = ctx.createRadialGradient(
      originX, originY, 15,
      originX, horizonY + 20, w * 0.7
    );
    grad.addColorStop(0, 'rgba(255, 255, 230, 0.5)');
    grad.addColorStop(0.35, 'rgba(255, 255, 200, 0.18)');
    grad.addColorStop(1.0, 'rgba(255, 255, 200, 0.0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(originX - 45, originY);
    ctx.lineTo(w * 0.05, horizonY + 15);
    ctx.lineTo(w * 0.95, horizonY + 15);
    ctx.lineTo(originX + 45, originY);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Draw Full 3D Indian Railways WAP-7 Locomotive & Red LHB Coaches
   */
  drawIndianTrain(ctx, project, cameraZ, trainPos, state, timeOfDay, dt) {
    ctx.save();

    // 1. Draw Trailing LHB Passenger Coaches (Draw from rear-most forward)
    const coachLength = 23; // meters per LHB coach
    const numCoaches = 3;

    for (let cIdx = numCoaches - 1; cIdx >= 0; cIdx--) {
      const zStart = trainPos - 21.5 - (cIdx * coachLength);
      const zEnd = zStart - (coachLength - 1.2);

      const pFrontBaseL = project(-1.5, 0.85, zStart);
      const pFrontBaseR = project(1.5, 0.85, zStart);
      const pFrontTopL = project(-1.5, 3.85, zStart);
      const pFrontTopR = project(1.5, 3.85, zStart);

      const pRearBaseL = project(-1.5, 0.85, zEnd);
      const pRearBaseR = project(1.5, 0.85, zEnd);
      const pRearTopL = project(-1.5, 3.85, zEnd);
      const pRearTopR = project(1.5, 3.85, zEnd);

      if (pFrontBaseL && pFrontBaseR && pRearBaseL && pRearBaseR && pFrontTopL && pFrontTopR) {
        // Red LHB Coach Side Body (Rajdhani Red)
        ctx.fillStyle = '#b91c1c'; // Indian Railways Rajdhani Red
        ctx.beginPath();
        ctx.moveTo(pFrontBaseR.x, pFrontBaseR.y);
        ctx.lineTo(pRearBaseR.x, pRearBaseR.y);
        ctx.lineTo(pRearTopR.x, pRearTopR.y);
        ctx.lineTo(pFrontTopR.x, pFrontTopR.y);
        ctx.closePath();
        ctx.fill();

        // Cream/Yellow Window Band
        const pFrontBandBot = project(1.5, 1.8, zStart);
        const pFrontBandTop = project(1.5, 2.9, zStart);
        const pRearBandBot = project(1.5, 1.8, zEnd);
        const pRearBandTop = project(1.5, 2.9, zEnd);
        if (pFrontBandBot && pFrontBandTop && pRearBandBot && pRearBandTop) {
          ctx.fillStyle = '#fef08a'; // Cream band
          ctx.beginPath();
          ctx.moveTo(pFrontBandBot.x, pFrontBandBot.y);
          ctx.lineTo(pRearBandBot.x, pRearBandBot.y);
          ctx.lineTo(pRearBandTop.x, pRearBandTop.y);
          ctx.lineTo(pFrontBandTop.x, pFrontBandTop.y);
          ctx.closePath();
          ctx.fill();

          // Lit Passenger Windows with silhouettes
          for (let wZ = zStart - 3; wZ > zEnd + 2; wZ -= 3.8) {
            const pWinL = project(1.52, 1.95, wZ);
            const pWinR = project(1.52, 1.95, wZ - 2.2);
            const pWinTop = project(1.52, 2.75, wZ);
            if (pWinL && pWinR && pWinTop) {
              ctx.fillStyle = '#fde047'; // warm interior glow
              ctx.fillRect(pWinR.x, pWinTop.y, Math.abs(pWinL.x - pWinR.x), Math.abs(pWinL.y - pWinTop.y));
            }
          }
        }

        // Coach Curved Silver Roof
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(pFrontTopL.x, pFrontTopL.y);
        ctx.lineTo(pFrontTopR.x, pFrontTopR.y);
        ctx.lineTo(pRearTopR.x, pRearTopR.y);
        ctx.lineTo(pRearTopL.x, pRearTopL.y);
        ctx.closePath();
        ctx.fill();
      }
    }

    // 2. Draw Indian Railways WAP-7 Electric Locomotive
    const zNose = trainPos;
    const zRear = trainPos - 21.0;

    // Projected Key Nose Vertices
    const pNoseBaseL = project(-1.55, 0.85, zNose);
    const pNoseBaseR = project(1.55, 0.85, zNose);
    const pNoseMidL = project(-1.50, 2.30, zNose);
    const pNoseMidR = project(1.50, 2.30, zNose);
    const pNoseTopL = project(-1.42, 3.90, zNose - 1.8); // aerodynamic slant
    const pNoseTopR = project(1.42, 3.90, zNose - 1.8);

    const pRearTopR = project(1.55, 4.0, zRear);
    const pRearBaseR = project(1.55, 0.85, zRear);

    if (pNoseBaseL && pNoseBaseR && pNoseMidL && pNoseMidR && pNoseTopL && pNoseTopR) {
      // 2a. Right Body Side Wall (if visible from angle)
      if (pRearBaseR && pRearTopR) {
        ctx.fillStyle = '#991b1b'; // Darker shaded red side
        ctx.beginPath();
        ctx.moveTo(pNoseBaseR.x, pNoseBaseR.y);
        ctx.lineTo(pRearBaseR.x, pRearBaseR.y);
        ctx.lineTo(pRearTopR.x, pRearTopR.y);
        ctx.lineTo(pNoseTopR.x, pNoseTopR.y);
        ctx.closePath();
        ctx.fill();

        // Yellow Side Stripe
        const pSideStripeNose = project(1.56, 2.1, zNose);
        const pSideStripeRear = project(1.56, 2.1, zRear);
        if (pSideStripeNose && pSideStripeRear) {
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = Math.max(3, 7 * pSideStripeNose.scale);
          ctx.beginPath();
          ctx.moveTo(pSideStripeNose.x, pSideStripeNose.y);
          ctx.lineTo(pSideStripeRear.x, pSideStripeRear.y);
          ctx.stroke();
        }
      }

      // 2b. Front Nose Face (Vibrant Indian Red)
      const frontGrad = ctx.createLinearGradient(pNoseBaseL.x, 0, pNoseBaseR.x, 0);
      frontGrad.addColorStop(0, '#991b1b');
      frontGrad.addColorStop(0.3, '#dc2626');
      frontGrad.addColorStop(0.7, '#ef4444');
      frontGrad.addColorStop(1.0, '#b91c1c');

      ctx.fillStyle = frontGrad;
      ctx.beginPath();
      ctx.moveTo(pNoseBaseL.x, pNoseBaseL.y);
      ctx.lineTo(pNoseBaseR.x, pNoseBaseR.y);
      ctx.lineTo(pNoseMidR.x, pNoseMidR.y);
      ctx.lineTo(pNoseTopR.x, pNoseTopR.y);
      ctx.lineTo(pNoseTopL.x, pNoseTopL.y);
      ctx.lineTo(pNoseMidL.x, pNoseMidL.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 2c. Front Yellow/Cream Chevron Cheatline (Signature Rajdhani design)
      const pCheatL = project(-1.52, 2.15, zNose);
      const pCheatR = project(1.52, 2.15, zNose);
      const pCheatMid = project(0, 1.75, zNose);
      if (pCheatL && pCheatR && pCheatMid) {
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(pCheatL.x, pCheatL.y);
        ctx.lineTo(pCheatMid.x, pCheatMid.y);
        ctx.lineTo(pCheatR.x, pCheatR.y);
        ctx.lineTo(pCheatR.x, pCheatR.y + 12 * pCheatR.scale);
        ctx.lineTo(pCheatMid.x, pCheatMid.y + 14 * pCheatMid.scale);
        ctx.lineTo(pCheatL.x, pCheatL.y + 12 * pCheatL.scale);
        ctx.closePath();
        ctx.fill();
      }

      // 2d. Front Windshield (Twin cab windscreens)
      const pWinBL = project(-1.25, 2.65, zNose - 0.4);
      const pWinBR = project(1.25, 2.65, zNose - 0.4);
      const pWinTL = project(-1.18, 3.65, zNose - 1.4);
      const pWinTR = project(1.18, 3.65, zNose - 1.4);
      if (pWinBL && pWinBR && pWinTL && pWinTR) {
        ctx.fillStyle = '#082f49'; // dark reflective glass
        ctx.beginPath();
        ctx.moveTo(pWinBL.x, pWinBL.y);
        ctx.lineTo(pWinBR.x, pWinBR.y);
        ctx.lineTo(pWinTR.x, pWinTR.y);
        ctx.lineTo(pWinTL.x, pWinTL.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Center Windshield Divider
        const pWinMidB = project(0, 2.65, zNose - 0.4);
        const pWinMidT = project(0, 3.65, zNose - 1.4);
        if (pWinMidB && pWinMidT) {
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = Math.max(2, 4 * pWinMidB.scale);
          ctx.beginPath();
          ctx.moveTo(pWinMidB.x, pWinMidB.y);
          ctx.lineTo(pWinMidT.x, pWinMidT.y);
          ctx.stroke();
        }
      }

      // 2e. "Rajdhani Express" & "WAP-7" Text Insignia on Front
      const pInsignia = project(0, 2.35, zNose);
      if (pInsignia && pInsignia.scale > 0.0025) {
        ctx.textAlign = 'center';
        ctx.font = `bold ${Math.max(9, Math.round(13 * pInsignia.scale * 10))}px 'Inter', sans-serif`;
        ctx.fillStyle = '#fef08a';
        ctx.fillText('Rajdhani Express', pInsignia.x, pInsignia.y);

        // WAP-7 Class Badge
        ctx.font = `900 ${Math.max(8, Math.round(11 * pInsignia.scale * 10))}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText('WAP-7', pInsignia.x, pInsignia.y + 14 * pInsignia.scale * 10);
        ctx.textAlign = 'left';
      }

      // 2f. Indian Tricolor Flag on Front Nose
      const pFlag = project(-0.85, 2.05, zNose);
      if (pFlag && pFlag.scale > 0.002) {
        const flagW = 24 * pFlag.scale * 10;
        const flagH = 14 * pFlag.scale * 10;
        ctx.fillStyle = '#f97316'; // Saffron
        ctx.fillRect(pFlag.x, pFlag.y, flagW, flagH * 0.33);
        ctx.fillStyle = '#ffffff'; // White
        ctx.fillRect(pFlag.x, pFlag.y + flagH * 0.33, flagW, flagH * 0.33);
        ctx.fillStyle = '#16a34a'; // Green
        ctx.fillRect(pFlag.x, pFlag.y + flagH * 0.66, flagW, flagH * 0.33);
      }

      // 2g. High-Intensity LED Headlights
      const pHeadL = project(-0.95, 1.8, zNose);
      const pHeadR = project(0.95, 1.8, zNose);
      const pHeadTop = project(0, 3.85, zNose - 1.6);

      if (state.headlights) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 25;

        // Top Central High-Beam
        if (pHeadTop) {
          ctx.beginPath();
          ctx.arc(pHeadTop.x, pHeadTop.y, Math.max(3, 8 * pHeadTop.scale * 10), 0, Math.PI * 2);
          ctx.fill();
        }
        // Left & Right Dual Front Beams
        if (pHeadL && pHeadR) {
          ctx.beginPath();
          ctx.arc(pHeadL.x, pHeadL.y, Math.max(3, 7 * pHeadL.scale * 10), 0, Math.PI * 2);
          ctx.arc(pHeadR.x, pHeadR.y, Math.max(3, 7 * pHeadR.scale * 10), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // Red Marker Lamps
      const pMarkerL = project(-1.25, 1.45, zNose);
      const pMarkerR = project(1.25, 1.45, zNose);
      if (pMarkerL && pMarkerR) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(pMarkerL.x, pMarkerL.y, Math.max(2, 4 * pMarkerL.scale * 10), 0, Math.PI * 2);
        ctx.arc(pMarkerR.x, pMarkerR.y, Math.max(2, 4 * pMarkerR.scale * 10), 0, Math.PI * 2);
        ctx.fill();
      }

      // 2h. Front Buffers & Coupler
      const pBufferL = project(-1.15, 0.95, zNose + 0.3);
      const pBufferR = project(1.15, 0.95, zNose + 0.3);
      if (pBufferL && pBufferR) {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(pBufferL.x, pBufferL.y, Math.max(3, 9 * pBufferL.scale * 10), 0, Math.PI * 2);
        ctx.arc(pBufferR.x, pBufferR.y, Math.max(3, 9 * pBufferR.scale * 10), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 2i. Front Cowcatcher / Cattle Guard Grille (Red & White chevrons)
      const pCattleL = project(-1.45, 0.25, zNose + 0.2);
      const pCattleR = project(1.45, 0.25, zNose + 0.2);
      const pCattleT = project(0, 0.75, zNose);
      if (pCattleL && pCattleR && pCattleT) {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(pCattleL.x, pCattleL.y);
        ctx.lineTo(pCattleT.x, pCattleT.y);
        ctx.lineTo(pCattleR.x, pCattleR.y);
        ctx.closePath();
        ctx.fill();

        // White diagonal safety stripes
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pCattleL.x + 10, pCattleL.y);
        ctx.lineTo(pCattleT.x, pCattleT.y);
        ctx.moveTo(pCattleR.x - 10, pCattleR.y);
        ctx.lineTo(pCattleT.x, pCattleT.y);
        ctx.stroke();
      }

      // 2j. Rooftop Pantograph & 25kV Electric Spark
      const pPantoBase = project(0, 4.15, zNose - 5.5);
      if (pPantoBase) {
        if (state.pantographUp) {
          const pPantoContact = project(0, 5.25, zNose - 5.5);
          const pPantoKnee = project(0.4, 4.7, zNose - 5.5);

          if (pPantoContact && pPantoKnee) {
            ctx.strokeStyle = '#dc2626'; // Red articulated arms
            ctx.lineWidth = Math.max(2, 4 * pPantoBase.scale * 10);
            ctx.beginPath();
            ctx.moveTo(pPantoBase.x, pPantoBase.y);
            ctx.lineTo(pPantoKnee.x, pPantoKnee.y);
            ctx.lineTo(pPantoContact.x, pPantoContact.y);
            ctx.stroke();

            // Copper contact shoe
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = Math.max(2.5, 6 * pPantoBase.scale * 10);
            ctx.beginPath();
            ctx.moveTo(pPantoContact.x - 16 * pPantoBase.scale * 10, pPantoContact.y);
            ctx.lineTo(pPantoContact.x + 16 * pPantoBase.scale * 10, pPantoContact.y);
            ctx.stroke();

            // Electric spark flash at contact wire when accelerating
            if (state.speedKmh > 15 && state.throttlePercent > 20 && Math.random() < 0.12) {
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#00f0ff';
              ctx.shadowBlur = 20;
              ctx.beginPath();
              ctx.arc(pPantoContact.x, pPantoContact.y, 8, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        } else {
          // Folded flat on roof
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(pPantoBase.x - 12, pPantoBase.y);
          ctx.lineTo(pPantoBase.x + 12, pPantoBase.y);
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }

  drawCabCockpit(ctx, w, h, state, dt, weather) {
    ctx.save();

    // Left & Right Cab Pillars (WAP-7 Windscreen Architecture)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w * 0.14, 0);
    ctx.lineTo(w * 0.20, h * 0.72);
    ctx.lineTo(0, h * 0.72);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w, 0);
    ctx.lineTo(w * 0.86, 0);
    ctx.lineTo(w * 0.80, h * 0.72);
    ctx.lineTo(w, h * 0.72);
    ctx.closePath();
    ctx.fill();

    // Center Windshield Beam
    ctx.fillRect(w * 0.485, 0, w * 0.03, h * 0.72);

    // Cab Roof Trim
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, h * 0.08);

    // Windshield Wipers in Rain
    if (weather === 'rain') {
      this.wiperAngle += dt * 3.8 * this.wiperDirection;
      if (this.wiperAngle > 1.2) {
        this.wiperAngle = 1.2;
        this.wiperDirection = -1;
      } else if (this.wiperAngle < -0.2) {
        this.wiperAngle = -0.2;
        this.wiperDirection = 1;
      }

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 6;
      [w * 0.28, w * 0.72].forEach(bx => {
        ctx.beginPath();
        const by = h * 0.72;
        const len = h * 0.38;
        const ex = bx + Math.sin(this.wiperAngle) * len;
        const ey = by - Math.cos(this.wiperAngle) * len;
        ctx.moveTo(bx, by);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      });
    }

    // Driver Console Dashboard Bench
    const consoleGrad = ctx.createLinearGradient(0, h * 0.72, 0, h);
    consoleGrad.addColorStop(0, '#1e293b');
    consoleGrad.addColorStop(0.2, '#0f172a');
    consoleGrad.addColorStop(1.0, '#020617');

    ctx.fillStyle = consoleGrad;
    ctx.fillRect(0, h * 0.72, w, h * 0.28);

    // Console Dial Lights & Tractive Meter
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.72);
    ctx.lineTo(w, h * 0.72);
    ctx.stroke();

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
