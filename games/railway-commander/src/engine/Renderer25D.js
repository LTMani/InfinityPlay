/**
 * Railway Commander - 2.5D Perspective Railway Renderer
 * Renders pseudo-3D perspective railway tracks, ballast, ties, catenary wires,
 * 3D station platforms, stop markers, 3-aspect optical signals with bloom,
 * dynamic sky/lighting (Day/Sunset/Night), weather (Rain/Fog),
 * and dual camera modes (Elevated Track Chase & Driver Cab View).
 */

export class Renderer25D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });

    // Camera Mode: 'chase' (elevated 2.5D) or 'cab' (cockpit windshield)
    this.cameraMode = 'chase';

    // Rain Particle Pool
    this.rainDrops = [];
    this.maxRainDrops = 160;
    this.initRain();

    // Wiper Animation State
    this.wiperAngle = 0;
    this.wiperDirection = 1;

    // Headlight Flicker
    this.headlightPulse = 1.0;
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
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  setCameraMode(mode) {
    this.cameraMode = mode === 'cab' ? 'cab' : 'chase';
  }

  /**
   * Main Render Frame
   */
  render(state, trackManager, signalSystem, stationSystem, missionConfig, dt) {
    if (!this.width || !this.height) {
      this.resize();
    }

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    const timeOfDay = missionConfig?.timeOfDay || 'day';
    const weather = missionConfig?.weather || 'clear';
    const trainPos = state.positionMeters;
    const speedKmh = state.speedKmh;

    // Camera Configuration
    const isCab = this.cameraMode === 'cab';
    const horizonY = h * (isCab ? 0.44 : 0.40);
    const focalLength = w * 0.75;
    const cameraHeight = isCab ? 2.4 : 4.8;
    const cameraZ = isCab ? trainPos + 1.2 : trainPos - 8.5; // Chase cam is behind train

    // 1. Draw Sky & Backdrop (Day / Sunset / Night)
    this.drawSkyAndLandscape(ctx, w, h, horizonY, timeOfDay, weather, trainPos);

    // 2. Perspective Projection Setup
    // Track base width = 3.2m (standard gauge + ballast margins)
    const trackHalfGauge = 0.82; // standard 1435mm gauge half-width
    const ballastHalfWidth = 2.4;

    // Smooth Curvature Calculation over distance
    const baseCurvature = trackManager.getCurvatureAt(trainPos);

    // Helper: Project 3D point (worldX, worldY, worldZ) to 2D Screen
    const project = (x, y, z) => {
      const relZ = z - cameraZ;
      if (relZ <= 0.2) return null;
      const scale = focalLength / relZ;
      // Curvature shift
      const distFromCam = relZ;
      const curveOffset = baseCurvature * (distFromCam * distFromCam) * 0.15;
      const screenX = (w * 0.5) + (x + curveOffset) * scale;
      const screenY = horizonY + (cameraHeight - y) * scale;
      return { x: screenX, y: screenY, scale, relZ };
    };

    // 3. Draw Ballast Bed & Ground
    this.drawGroundAndBallast(ctx, w, h, horizonY, project, cameraZ, timeOfDay);

    // 4. Draw Railroad Ties (Sleepers)
    this.drawRailTies(ctx, project, cameraZ, timeOfDay);

    // 5. Draw Steel Rails
    this.drawSteelRails(ctx, project, cameraZ, trackHalfGauge, state.headlights, timeOfDay);

    // 6. Draw Stations & Platforms
    this.drawStations(ctx, project, cameraZ, stationSystem, trackHalfGauge, timeOfDay);

    // 7. Draw Scenery (Catenary Poles, Trees, Buildings)
    this.drawScenery(ctx, project, cameraZ, trackManager, timeOfDay);

    // 8. Draw Railway Signals
    this.drawSignals(ctx, project, cameraZ, signalSystem, timeOfDay);

    // 9. Draw Headlight Projection Beam (at night or sunset)
    if (state.headlights && (timeOfDay === 'night' || timeOfDay === 'sunset' || weather === 'fog')) {
      this.drawHeadlightBeams(ctx, w, h, horizonY, isCab);
    }

    // 10. Draw Locomotive Model (if Chase Camera Mode)
    if (!isCab) {
      this.drawChaseLocomotive(ctx, w, h, horizonY, state, timeOfDay);
    }

    // 11. Draw Cockpit Frame & Dashboard (if Cab View Mode)
    if (isCab) {
      this.drawCabCockpit(ctx, w, h, state, dt, weather);
    }

    // 12. Draw Weather Overlay (Rain Streaks / Fog)
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
      skyGrad.addColorStop(0, '#1e1b4b'); // Deep indigo
      skyGrad.addColorStop(0.4, '#7c2d12'); // Amber crimson
      skyGrad.addColorStop(0.8, '#ea580c'); // Bright orange
      skyGrad.addColorStop(1.0, '#fed7aa'); // Warm twilight
    } else if (timeOfDay === 'night') {
      skyGrad.addColorStop(0, '#030712');
      skyGrad.addColorStop(0.6, '#090d1f');
      skyGrad.addColorStop(1.0, '#131b38');
    } else {
      // Day
      skyGrad.addColorStop(0, '#1d4ed8');
      skyGrad.addColorStop(0.5, '#38bdf8');
      skyGrad.addColorStop(1.0, '#bae6fd');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizonY + 2);

    // Stars at Night
    if (timeOfDay === 'night') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < 40; i++) {
        const starX = ((i * 137.5) % w);
        const starY = ((i * 89.3) % (horizonY * 0.7));
        ctx.fillRect(starX, starY, 1.5, 1.5);
      }
      // Moon
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = 'rgba(254, 240, 138, 0.6)';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(w * 0.82, horizonY * 0.3, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (timeOfDay === 'sunset') {
      // Sun sinking near horizon
      ctx.fillStyle = '#ffedd5';
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(w * 0.65, horizonY * 0.85, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Distant Mountain Ranges (Parallax Layer 1)
    const mountainScroll = (trainPos * 0.04) % (w * 0.5);
    ctx.fillStyle = timeOfDay === 'night' ? '#080d1e' : (timeOfDay === 'sunset' ? '#431407' : '#1e3a8a');
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    for (let x = -mountainScroll; x <= w + 100; x += 120) {
      const peakHeight = 45 + Math.sin(x * 0.02) * 35;
      ctx.lineTo(x + 60, horizonY - peakHeight);
      ctx.lineTo(x + 120, horizonY);
    }
    ctx.closePath();
    ctx.fill();

    // Midground Hills / City Skyline (Parallax Layer 2)
    const hillScroll = (trainPos * 0.12) % (w * 0.3);
    ctx.fillStyle = timeOfDay === 'night' ? '#0b1329' : (timeOfDay === 'sunset' ? '#701a75' : '#047857');
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    for (let x = -hillScroll; x <= w + 100; x += 80) {
      const hillHeight = 22 + Math.sin(x * 0.035) * 18;
      ctx.lineTo(x + 40, horizonY - hillHeight);
      ctx.lineTo(x + 80, horizonY);
    }
    ctx.closePath();
    ctx.fill();
  }

  drawGroundAndBallast(ctx, w, h, horizonY, project, cameraZ, timeOfDay) {
    // Terrain Ground (Green grass / Dark gravel / Night terrain)
    let groundGrad = ctx.createLinearGradient(0, horizonY, 0, h);
    if (timeOfDay === 'night') {
      groundGrad.addColorStop(0, '#040810');
      groundGrad.addColorStop(1.0, '#0b111e');
    } else if (timeOfDay === 'sunset') {
      groundGrad.addColorStop(0, '#2d1810');
      groundGrad.addColorStop(1.0, '#1c1917');
    } else {
      groundGrad.addColorStop(0, '#15803d');
      groundGrad.addColorStop(1.0, '#166534');
    }
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, horizonY, w, h - horizonY);

    // Ballast Bed (Trapezoid gravel track bed)
    const farZ = cameraZ + 380;
    const nearZ = cameraZ + 1.2;

    const pFarL = project(-2.2, 0, farZ);
    const pFarR = project(2.2, 0, farZ);
    const pNearL = project(-2.9, 0, nearZ);
    const pNearR = project(2.9, 0, nearZ);

    if (pFarL && pFarR && pNearL && pNearR) {
      ctx.fillStyle = timeOfDay === 'night' ? '#181b22' : '#334155';
      ctx.beginPath();
      ctx.moveTo(pFarL.x, pFarL.y);
      ctx.lineTo(pFarR.x, pFarR.y);
      ctx.lineTo(pNearR.x, pNearR.y);
      ctx.lineTo(pNearL.x, pNearL.y);
      ctx.closePath();
      ctx.fill();

      // Ballast gravel shoulder edges
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pFarL.x, pFarL.y);
      ctx.lineTo(pNearL.x, pNearL.y);
      ctx.moveTo(pFarR.x, pFarR.y);
      ctx.lineTo(pNearR.x, pNearR.y);
      ctx.stroke();
    }
  }

  drawRailTies(ctx, project, cameraZ, timeOfDay) {
    const tieSpacing = 0.85; // meters
    const tieWidth = 1.35; // half width (2.7m total sleeper length)
    const startZ = Math.floor(cameraZ / tieSpacing) * tieSpacing;
    const endZ = cameraZ + 160;

    ctx.fillStyle = timeOfDay === 'night' ? '#1c1917' : '#451a03'; // Wooden/Concrete sleepers
    ctx.strokeStyle = '#0c0a09';

    for (let z = endZ; z >= startZ; z -= tieSpacing) {
      if (z <= cameraZ + 0.5) continue;
      const pL = project(-tieWidth, 0.05, z);
      const pR = project(tieWidth, 0.05, z);
      if (!pL || !pR) continue;

      const tieThickness = Math.max(1.2, 3.8 * pL.scale);
      ctx.lineWidth = 1;
      ctx.fillRect(pL.x, pL.y - tieThickness, pR.x - pL.x, tieThickness);
    }
  }

  drawSteelRails(ctx, project, cameraZ, trackHalfGauge, headlightsOn, timeOfDay) {
    const steps = 40;
    const maxViewZ = 350;
    const stepSize = maxViewZ / steps;

    // Left & Right Rails Points
    const leftRail = [];
    const rightRail = [];

    for (let i = 0; i <= steps; i++) {
      const z = cameraZ + 0.8 + (i * stepSize);
      const pL = project(-trackHalfGauge, 0.16, z);
      const pR = project(trackHalfGauge, 0.16, z);
      if (pL && pR) {
        leftRail.push(pL);
        rightRail.push(pR);
      }
    }

    if (leftRail.length < 2) return;

    // Draw Rail Base Shadow
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    this.strokeRailPath(ctx, leftRail);
    this.strokeRailPath(ctx, rightRail);

    // Draw Steel Rail Top (Shiny metallic chrome line)
    ctx.strokeStyle = timeOfDay === 'night' && headlightsOn ? '#e2e8f0' : '#cbd5e1';
    ctx.lineWidth = 2.5;
    this.strokeRailPath(ctx, leftRail);
    this.strokeRailPath(ctx, rightRail);

    // Inner rail highlight
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    this.strokeRailPath(ctx, leftRail);
    this.strokeRailPath(ctx, rightRail);
  }

  strokeRailPath(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  }

  drawStations(ctx, project, cameraZ, stationSystem, trackHalfGauge, timeOfDay) {
    const stations = stationSystem.stations || [];

    for (const st of stations) {
      const dist = st.stopPosition - cameraZ;
      if (dist < -80 || dist > 450) continue;

      // Platform is positioned on the right side of the track
      const platStart = st.stopPosition - st.platformLength + 20;
      const platEnd = st.stopPosition + 35;
      const platSideX = trackHalfGauge + 1.2;
      const platWidth = 4.5;
      const platHeight = 0.95; // elevated platform level

      // 1. Platform Concrete Surface
      const pNearFront = project(platSideX, platHeight, Math.max(cameraZ + 0.8, platStart));
      const pNearBack = project(platSideX + platWidth, platHeight, Math.max(cameraZ + 0.8, platStart));
      const pFarFront = project(platSideX, platHeight, platEnd);
      const pFarBack = project(platSideX + platWidth, platHeight, platEnd);

      if (pNearFront && pNearBack && pFarFront && pFarBack) {
        // Platform Deck Surface
        ctx.fillStyle = timeOfDay === 'night' ? '#334155' : '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(pNearFront.x, pNearFront.y);
        ctx.lineTo(pNearBack.x, pNearBack.y);
        ctx.lineTo(pFarBack.x, pFarBack.y);
        ctx.lineTo(pFarFront.x, pFarFront.y);
        ctx.closePath();
        ctx.fill();

        // Platform Concrete Wall Face
        const pNearBase = project(platSideX, 0, Math.max(cameraZ + 0.8, platStart));
        const pFarBase = project(platSideX, 0, platEnd);
        if (pNearBase && pFarBase) {
          ctx.fillStyle = timeOfDay === 'night' ? '#1e293b' : '#64748b';
          ctx.beginPath();
          ctx.moveTo(pNearFront.x, pNearFront.y);
          ctx.lineTo(pFarFront.x, pFarFront.y);
          ctx.lineTo(pFarBase.x, pFarBase.y);
          ctx.lineTo(pNearBase.x, pNearBase.y);
          ctx.closePath();
          ctx.fill();
        }

        // Yellow Platform Safety Line
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = Math.max(1.5, 3 * pNearFront.scale);
        ctx.beginPath();
        ctx.moveTo(pNearFront.x, pNearFront.y);
        ctx.lineTo(pFarFront.x, pFarFront.y);
        ctx.stroke();

        // Platform Roof Canopy Posts
        for (let postZ = platStart + 20; postZ < platEnd; postZ += 35) {
          if (postZ < cameraZ + 1) continue;
          const pPostBase = project(platSideX + 2.0, platHeight, postZ);
          const pPostTop = project(platSideX + 2.0, platHeight + 3.8, postZ);
          const pRoofOuter = project(platSideX - 0.5, platHeight + 4.2, postZ);
          if (pPostBase && pPostTop && pRoofOuter) {
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = Math.max(2, 4 * pPostBase.scale);
            ctx.beginPath();
            ctx.moveTo(pPostBase.x, pPostBase.y);
            ctx.lineTo(pPostTop.x, pPostTop.y);
            ctx.lineTo(pRoofOuter.x, pRoofOuter.y);
            ctx.stroke();
          }
        }
      }

      // 2. STOP ZONE MARKER (Vibrant Green/Yellow target box on tracks & platform)
      const stopZ = st.stopPosition;
      if (stopZ > cameraZ + 0.5 && stopZ < cameraZ + 350) {
        const pStopL = project(-trackHalfGauge * 1.3, 0.08, stopZ);
        const pStopR = project(trackHalfGauge * 1.3, 0.08, stopZ);
        const pPlatStop = project(platSideX + 1.2, platHeight + 0.05, stopZ);

        if (pStopL && pStopR) {
          // Track Stop Line Marker
          ctx.strokeStyle = '#ef4444'; // Bright Red Target Stop Line
          ctx.lineWidth = Math.max(2.5, 6 * pStopL.scale);
          ctx.beginPath();
          ctx.moveTo(pStopL.x, pStopL.y);
          ctx.lineTo(pStopR.x, pStopR.y);
          ctx.stroke();

          // Chevron Stripes on Stop Box
          ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
          const pBoxBackL = project(-trackHalfGauge * 1.3, 0.08, stopZ - 3);
          const pBoxBackR = project(trackHalfGauge * 1.3, 0.08, stopZ - 3);
          if (pBoxBackL && pBoxBackR) {
            ctx.beginPath();
            ctx.moveTo(pBoxBackL.x, pBoxBackL.y);
            ctx.lineTo(pBoxBackR.x, pBoxBackR.y);
            ctx.lineTo(pStopR.x, pStopR.y);
            ctx.lineTo(pStopL.x, pStopL.y);
            ctx.closePath();
            ctx.fill();
          }

          // STOP TARGET Text on Platform
          if (pPlatStop && pPlatStop.scale > 0.003) {
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.fillStyle = '#ef4444';
            ctx.fillText('🛑 STOP HERE', pPlatStop.x, pPlatStop.y);
          }
        }

        // Station Name Board Signpost
        const pSignBase = project(platSideX + 2.5, platHeight, st.stopPosition - 15);
        const pSignTop = project(platSideX + 2.5, platHeight + 2.6, st.stopPosition - 15);
        if (pSignBase && pSignTop && pSignBase.scale > 0.0025) {
          const signW = 90 * pSignBase.scale;
          const signH = 34 * pSignBase.scale;
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(pSignTop.x - signW * 0.5, pSignTop.y - signH * 0.5, signW, signH);
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(pSignTop.x - signW * 0.5, pSignTop.y - signH * 0.5, signW, signH);

          ctx.font = 'bold 12px Inter, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(st.name, pSignTop.x, pSignTop.y + 4);
          ctx.textAlign = 'left';
        }
      }
    }
  }

  drawScenery(ctx, project, cameraZ, trackManager, timeOfDay) {
    const scenery = trackManager.scenery || [];

    for (const item of scenery) {
      const relZ = item.position - cameraZ;
      if (relZ < 1 || relZ > 420) continue;

      if (item.type === 'catenary') {
        // Overhead Electrification Mast & Portal
        const pBase = project(item.side * 2.8, 0, item.position);
        const pTop = project(item.side * 2.8, 6.8, item.position);
        const pWireAnchor = project(0, 5.4, item.position);

        if (pBase && pTop && pWireAnchor) {
          ctx.strokeStyle = timeOfDay === 'night' ? '#334155' : '#64748b';
          ctx.lineWidth = Math.max(1.5, 3.5 * pBase.scale);

          // Vertical Mast Pole
          ctx.beginPath();
          ctx.moveTo(pBase.x, pBase.y);
          ctx.lineTo(pTop.x, pTop.y);
          // Horizontal Cantilever Arm over rails
          ctx.lineTo(pWireAnchor.x, pWireAnchor.y);
          ctx.stroke();

          // Insulator bushing
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(pWireAnchor.x, pWireAnchor.y, Math.max(1.5, 3 * pBase.scale), 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (item.type === 'tree') {
        const p = project(item.side * item.dist, 0, item.position);
        if (p && p.scale > 0.002) {
          const treeH = 38 * p.scale * item.scale;
          const treeW = 24 * p.scale * item.scale;

          // Tree trunk
          ctx.fillStyle = '#3e2723';
          ctx.fillRect(p.x - 2 * p.scale, p.y - treeH * 0.3, 4 * p.scale, treeH * 0.3);

          // Foliage
          ctx.fillStyle = timeOfDay === 'night' ? '#064e3b' : (timeOfDay === 'sunset' ? '#14532d' : '#15803d');
          ctx.beginPath();
          ctx.arc(p.x, p.y - treeH * 0.65, treeW, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (item.type === 'building') {
        const p = project(item.side * item.dist, 0, item.position);
        if (p && p.scale > 0.002) {
          const bW = item.width * p.scale * 12;
          const bH = item.height * p.scale * 14;

          ctx.fillStyle = item.color;
          ctx.fillRect(p.x - bW * 0.5, p.y - bH, bW, bH);

          // Lit windows at night
          if (timeOfDay === 'night' || timeOfDay === 'sunset') {
            ctx.fillStyle = '#fef08a';
            const winRows = 4;
            const winCols = 3;
            for (let r = 0; r < winRows; r++) {
              for (let c = 0; c < winCols; c++) {
                if ((r + c + item.position) % 2 === 0) {
                  ctx.fillRect(
                    p.x - bW * 0.4 + (c * (bW * 0.28)),
                    p.y - bH + 8 + (r * (bH * 0.22)),
                    Math.max(2, 4 * p.scale),
                    Math.max(2, 5 * p.scale)
                  );
                }
              }
            }
          }
        }
      }
    }
  }

  drawSignals(ctx, project, cameraZ, signalSystem, timeOfDay) {
    const signals = signalSystem.signals || [];

    for (const sig of signals) {
      const relZ = sig.positionMeters - cameraZ;
      if (relZ < 1 || relZ > 420) continue;

      // Signal mast located on left side of track
      const mastX = -2.4;
      const pBase = project(mastX, 0, sig.positionMeters);
      const pHead = project(mastX, 4.6, sig.positionMeters);

      if (pBase && pHead) {
        // Mast Pole
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = Math.max(1.8, 4 * pBase.scale);
        ctx.beginPath();
        ctx.moveTo(pBase.x, pBase.y);
        ctx.lineTo(pHead.x, pHead.y);
        ctx.stroke();

        // Signal Head Enclosure Box
        const boxW = 16 * pHead.scale;
        const boxH = 42 * pHead.scale;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(pHead.x - boxW * 0.5, pHead.y - boxH * 0.5, boxW, boxH);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(pHead.x - boxW * 0.5, pHead.y - boxH * 0.5, boxW, boxH);

        // Aspect Lenses: Red (Top), Yellow (Middle), Green (Bottom)
        const radius = Math.max(1.8, 4.2 * pHead.scale);
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
            // Neon Glow / Bloom
            ctx.shadowColor = colors[asp];
            ctx.shadowBlur = Math.max(6, 20 * pHead.scale);
            ctx.fillStyle = colors[asp];
          } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#1e293b'; // Unlit lens
          }

          ctx.beginPath();
          ctx.arc(pHead.x, lensY, radius, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.shadowBlur = 0;
      }
    }
  }

  drawHeadlightBeams(ctx, w, h, horizonY, isCab) {
    const originX = w * 0.5;
    const originY = isCab ? h * 0.72 : h * 0.78;

    const grad = ctx.createRadialGradient(
      originX, originY, 15,
      originX, horizonY + 30, w * 0.65
    );
    grad.addColorStop(0, 'rgba(255, 255, 230, 0.45)');
    grad.addColorStop(0.35, 'rgba(255, 255, 200, 0.18)');
    grad.addColorStop(1.0, 'rgba(255, 255, 200, 0.0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(originX - 45, originY);
    ctx.lineTo(w * 0.1, horizonY + 20);
    ctx.lineTo(w * 0.9, horizonY + 20);
    ctx.lineTo(originX + 45, originY);
    ctx.closePath();
    ctx.fill();
  }

  drawChaseLocomotive(ctx, w, h, horizonY, state, timeOfDay) {
    // 3D perspective elevated chase view of modern high-speed locomotive
    const centerX = w * 0.5;
    const locoBaseY = h * 0.86;
    const locoWidth = w * 0.26;
    const locoHeight = h * 0.22;

    // Aerodynamic Nose Wedge
    ctx.save();
    
    // Train Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.ellipse(centerX, locoBaseY + 6, locoWidth * 0.65, locoHeight * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body Gradient (Cyber Blue / Midnight Steel)
    const bodyGrad = ctx.createLinearGradient(centerX - locoWidth * 0.5, 0, centerX + locoWidth * 0.5, 0);
    bodyGrad.addColorStop(0, '#0369a1');
    bodyGrad.addColorStop(0.3, '#0284c7');
    bodyGrad.addColorStop(0.5, '#38bdf8');
    bodyGrad.addColorStop(0.7, '#0284c7');
    bodyGrad.addColorStop(1.0, '#0369a1');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(centerX - locoWidth * 0.42, locoBaseY);
    ctx.lineTo(centerX - locoWidth * 0.32, locoBaseY - locoHeight);
    ctx.lineTo(centerX + locoWidth * 0.32, locoBaseY - locoHeight);
    ctx.lineTo(centerX + locoWidth * 0.42, locoBaseY);
    ctx.closePath();
    ctx.fill();

    // Windshield Glass (dark cyan reflective tint)
    ctx.fillStyle = '#082f49';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - locoWidth * 0.25, locoBaseY - locoHeight * 0.45);
    ctx.lineTo(centerX - locoWidth * 0.20, locoBaseY - locoHeight * 0.85);
    ctx.lineTo(centerX + locoWidth * 0.20, locoBaseY - locoHeight * 0.85);
    ctx.lineTo(centerX + locoWidth * 0.25, locoBaseY - locoHeight * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // High-Intensity Front LED Headlights
    if (state.headlights) {
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#ffffff';

      // Left LED Cluster
      ctx.fillRect(centerX - locoWidth * 0.28, locoBaseY - locoHeight * 0.3, 16, 8);
      // Right LED Cluster
      ctx.fillRect(centerX + locoWidth * 0.28 - 16, locoBaseY - locoHeight * 0.3, 16, 8);
      // Center Top High-Beam
      ctx.fillRect(centerX - 8, locoBaseY - locoHeight * 0.94, 16, 7);

      ctx.shadowBlur = 0;
    }

    // Racing/Platform Striping
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(centerX - locoWidth * 0.35, locoBaseY - locoHeight * 0.25, locoWidth * 0.7, 4);

    ctx.restore();
  }

  drawCabCockpit(ctx, w, h, state, dt, weather) {
    // Driver Cockpit Frame & Windscreen Overlay
    ctx.save();

    // Left & Right Cab Pillars
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w * 0.12, 0);
    ctx.lineTo(w * 0.18, h * 0.75);
    ctx.lineTo(0, h * 0.75);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w, 0);
    ctx.lineTo(w * 0.88, 0);
    ctx.lineTo(w * 0.82, h * 0.75);
    ctx.lineTo(w, h * 0.75);
    ctx.closePath();
    ctx.fill();

    // Cockpit Roof Trim
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, h * 0.08);

    // Windshield Wipers in Rain
    if (weather === 'rain') {
      this.wiperAngle += dt * 3.5 * this.wiperDirection;
      if (this.wiperAngle > 1.2) {
        this.wiperAngle = 1.2;
        this.wiperDirection = -1;
      } else if (this.wiperAngle < -0.2) {
        this.wiperAngle = -0.2;
        this.wiperDirection = 1;
      }

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 5;
      ctx.beginPath();
      const wiperBaseX = w * 0.35;
      const wiperBaseY = h * 0.72;
      const wiperLen = h * 0.38;
      const endX = wiperBaseX + Math.sin(this.wiperAngle) * wiperLen;
      const endY = wiperBaseY - Math.cos(this.wiperAngle) * wiperLen;
      ctx.moveTo(wiperBaseX, wiperBaseY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Driver Console Dashboard Bench
    const consoleGrad = ctx.createLinearGradient(0, h * 0.72, 0, h);
    consoleGrad.addColorStop(0, '#1e293b');
    consoleGrad.addColorStop(0.2, '#0f172a');
    consoleGrad.addColorStop(1.0, '#020617');

    ctx.fillStyle = consoleGrad;
    ctx.fillRect(0, h * 0.72, w, h * 0.28);

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
