/**
 * InfinityPlay Ultimate Racing - 2.5D Pseudo-3D Perspective Road & Car Renderer
 * Professional Arcade Racing Engine with True Curvature Accumulation,
 * Calibrated 2-3 Lane Dark Wet Asphalt Road, Vertical 3D Guardrail Barriers,
 * Attached Red/White Curbs, Enclosed Tunnels, and On-Road Racing Decals.
 */

(function() {
  class RoadRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: false });
      this.width = canvas.width;
      this.height = canvas.height;
      this.skyOffset = 0;
      this.cityOffset = 0;
    }

    resize(width, height) {
      this.width = width;
      this.height = height;
      this.canvas.width = width;
      this.canvas.height = height;
    }

    /**
     * 3D to 2D perspective projection formula
     * Calibrated for authentic 2-3 lane arcade racing perspective
     * roadWidth = 600 world units (half-width = 300)
     */
    project(p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) {
      const dz = p.world.z - cameraZ;
      p.screen.scale = cameraDepth / Math.max(1, dz);
      p.screen.x = Math.round(width / 2 + (p.screen.scale * (p.world.x - cameraX) * (width / 2)));
      p.screen.y = Math.round(height / 2 - (p.screen.scale * (p.world.y - cameraY) * (height / 2)));
      // Road half-width on screen (calibrated so full road occupies ~50-54% of screen width at bottom)
      p.screen.w = Math.round(p.screen.scale * (roadWidth * 0.44) * (width / 2));
      p.screen.leftX = p.screen.x - p.screen.w;
      p.screen.rightX = p.screen.x + p.screen.w;
    }

    render(track, player, camera, aiManager, trafficManager, particleSystem) {
      const ctx = this.ctx;
      const width = this.width;
      const height = this.height;

      // 0. Completely clear canvas buffer and apply solid dark night foundation
      // Eradicates all ghosting, frame trails, duplicate cars, and un-cleared buffer leakage
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#050711';
      ctx.fillRect(0, 0, width, height);

      const segments = track.segments;
      const trackLength = track.length;
      const currentLapZ = Math.floor(player.z / trackLength) * trackLength;
      const baseSegmentIndex = Math.floor((player.z % trackLength) / 200);
      const baseSegment = segments[baseSegmentIndex] || segments[0];

      // Save canvas state for camera tilt & screen shake
      ctx.save();
      if (camera.shakeOffset.x || camera.shakeOffset.y) {
        ctx.translate(camera.shakeOffset.x, camera.shakeOffset.y);
      }
      if (camera.tilt) {
        ctx.translate(width / 2, height * 0.58);
        ctx.rotate(camera.tilt);
        ctx.translate(-width / 2, -height * 0.58);
      }

      // 1. Render Parallax Sky & Skyline
      this.renderSkyAndHorizon(ctx, track.config, baseSegment.curve, player.speed);

      // 2. Project all visible segments with cumulative road curvature
      const drawDistance = track.config.drawDistance || 280;
      const baseIndex = baseSegment.index;

      // Cumulative curvature integration (the core of authentic arcade road bending)
      const segPct = (player.z % 200) / 200;
      let dx = -(baseSegment.curve * segPct) * 0.35;
      let x = 0;
      const renderSegments = [];

      for (let n = 0; n < drawDistance; n++) {
        const segmentIndex = (baseIndex + n) % segments.length;
        const segment = segments[segmentIndex];
        const loopZ = currentLapZ + ((baseIndex + n >= segments.length) ? trackLength : 0);

        // Apply cumulative curve to world X coordinates
        segment.p1.world.x = x;
        segment.p2.world.x = x + dx;
        segment.p1.world.z = (segment.baseZ1 !== undefined ? segment.baseZ1 : segment.index * 200) + loopZ;
        segment.p2.world.z = (segment.baseZ2 !== undefined ? segment.baseZ2 : (segment.index + 1) * 200) + loopZ;

        this.project(segment.p1, camera.x, camera.y, camera.z, camera.depth, width, height, track.roadWidth);
        this.project(segment.p2, camera.x, camera.y, camera.z, camera.depth, width, height, track.roadWidth);

        x += dx;
        dx += segment.curve * 0.35;

        // Clip segments that are entirely behind the camera
        if (segment.p2.world.z <= camera.z) {
          continue;
        }

        renderSegments.push(segment);
      }

      // Draw road segments from back to front (Painter's algorithm guarantees clean contiguous overdraw)
      for (let i = renderSegments.length - 1; i >= 0; i--) {
        const seg = renderSegments[i];
        this.renderSegmentPolygon(ctx, seg, width);
      }

      // 3. Render Roadside Scenery, AI Opponents, and Traffic depth-sorted
      this.renderDepthObjects(ctx, renderSegments, player, aiManager, trafficManager, trackLength, width, height);

      // 4. Render Player Car (Always front and center, sitting on asphalt)
      this.renderPlayerCar(ctx, player, width, height, camera, track);

      // 5. Render HUD Turn Indicator if approaching sharp curve
      this.renderTurnIndicatorHUD(ctx, baseSegment, segments, baseSegmentIndex, width, height);

      // 6. Optional Diagnostic Debug Overlay (Centerline, Edges, AI Racing Line)
      this.renderDebugOverlay(ctx, track, player, renderSegments, aiManager, width, height);

      // Restore camera transforms
      ctx.restore();

      // 6. Render Screen-Space Weather & Speed Streaks
      const isSpeeding = player.getSpeedRatio() > 0.85;
      particleSystem.renderScreenParticles(ctx, width, height, track.config.sceneryConfig, isSpeeding, player.isNitroActive);
    }

    renderSkyAndHorizon(ctx, trackConfig, currentCurve, playerSpeed) {
      const width = this.width;
      const height = this.height;
      const colors = trackConfig.colors;

      // Update parallax offsets
      this.skyOffset = (this.skyOffset - currentCurve * 0.8) % width;
      this.cityOffset = (this.cityOffset - currentCurve * 1.5) % width;

      // Sky Gradient
      const horizonY = height * 0.52;
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, colors.skyTop);
      skyGrad.addColorStop(1, colors.skyBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY);

      // Subtle atmospheric horizon glow (No giant bright cyan rectangle!)
      if (colors.horizonGlow) {
        const glowGrad = ctx.createLinearGradient(0, horizonY - 45, 0, horizonY);
        glowGrad.addColorStop(0, 'transparent');
        glowGrad.addColorStop(1, colors.horizonGlow);
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, horizonY - 45, width, 45);
      }

      // Parallax Distant Skyline / Mountains
      if (trackConfig.sceneryConfig.type === 'city') {
        this.drawCitySkyline(ctx, width, horizonY, this.cityOffset);
      } else if (trackConfig.sceneryConfig.type === 'mountain') {
        this.drawMountainSkyline(ctx, width, horizonY, this.cityOffset);
      } else {
        this.drawCoastalSkyline(ctx, width, horizonY, this.cityOffset);
      }
    }

    drawCitySkyline(ctx, width, horizonY, offset) {
      ctx.save();
      // Layer 1: Distant dark towers
      ctx.fillStyle = '#050711';
      const buildingWidth = 55;
      const count = Math.ceil(width / buildingWidth) + 4;
      const startX = (offset % (buildingWidth * 2)) - buildingWidth * 2;

      for (let i = 0; i < count; i++) {
        const bx = startX + i * buildingWidth;
        const bHeight = 85 + Math.sin(i * 1.3) * 50 + ((i % 4) * 26);
        ctx.fillRect(bx, horizonY - bHeight, buildingWidth - 5, bHeight);

        // Neon roof antenna / trim
        if (i % 3 === 0) {
          ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#ec4899';
          ctx.fillRect(bx, horizonY - bHeight, buildingWidth - 5, 2);
          ctx.fillRect(bx + buildingWidth * 0.45, horizonY - bHeight - 14, 2, 14);
          ctx.fillStyle = '#050711';
        }
      }

      // Layer 2: Midground illuminated buildings with subtle window grids
      ctx.fillStyle = '#090d1c';
      const w2 = 80;
      const count2 = Math.ceil(width / w2) + 2;
      const startX2 = ((offset * 1.4) % (w2 * 2)) - w2 * 2;
      for (let i = 0; i < count2; i++) {
        const bx = startX2 + i * w2;
        const bH = 60 + Math.sin(i * 2.1) * 30;
        ctx.fillRect(bx, horizonY - bH, w2 - 8, bH);

        // Window grid dots
        ctx.fillStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(236, 72, 153, 0.22)';
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 3; c++) {
            ctx.fillRect(bx + 8 + c * 20, horizonY - bH + 10 + r * 12, 7, 3);
          }
        }
        ctx.fillStyle = '#090d1c';
      }

      ctx.restore();
    }

    drawMountainSkyline(ctx, width, horizonY, offset) {
      ctx.save();
      // Back Ridge
      ctx.fillStyle = '#0f0a1a';
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      const step = 80;
      const count = Math.ceil(width / step) + 4;
      const startX = (offset % (step * 2)) - step * 2;

      for (let i = 0; i <= count; i++) {
        const mx = startX + i * step;
        const my = horizonY - 70 - Math.sin(i * 0.8) * 50;
        ctx.lineTo(mx, my);
      }
      ctx.lineTo(width, horizonY);
      ctx.closePath();
      ctx.fill();

      // Front Mountain Ridge with sharp peaks
      ctx.fillStyle = '#171024';
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      const step2 = 60;
      const count2 = Math.ceil(width / step2) + 4;
      const startX2 = ((offset * 1.5) % (step2 * 2)) - step2 * 2;

      for (let i = 0; i <= count2; i++) {
        const mx = startX2 + i * step2;
        const my = horizonY - 42 - Math.cos(i * 1.2) * 32;
        ctx.lineTo(mx, my);
      }
      ctx.lineTo(width, horizonY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    drawCoastalSkyline(ctx, width, horizonY, offset) {
      ctx.save();
      // Deep ocean horizon strip
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(0, horizonY - 18, width, 24);

      // Distant islands
      ctx.fillStyle = '#042f4c';
      ctx.beginPath();
      ctx.ellipse(width * 0.28 + (offset * 0.3) % width, horizonY - 10, 130, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(width * 0.75 + (offset * 0.35) % width, horizonY - 12, 170, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /**
     * Professional Road Hierarchy Renderer:
     * Dark Terrain Outside -> 3D Upright Barriers -> Paved Shoulders -> Red/White Racing Curbs -> Solid Edge Lines -> Dark Wet Asphalt -> Dashed Lane Dividers -> On-Road Decals
     */
    renderSegmentPolygon(ctx, seg, width) {
      const p1 = seg.p1.screen;
      const p2 = seg.p2.screen;

      const left1 = p1.leftX;
      const right1 = p1.rightX;
      const left2 = p2.leftX;
      const right2 = p2.rightX;

      const curbW1 = Math.max(2, p1.w * 0.045);
      const curbW2 = Math.max(2, p2.w * 0.045);

      const shoulderW1 = Math.max(2, p1.w * 0.035);
      const shoulderW2 = Math.max(2, p2.w * 0.035);

      const barrierH1 = Math.max(3, p1.w * 0.15);
      const barrierH2 = Math.max(3, p2.w * 0.15);

      const leftOuter1 = left1 - curbW1 - shoulderW1;
      const leftOuter2 = left2 - curbW2 - shoulderW2;
      const rightOuter1 = right1 + curbW1 + shoulderW1;
      const rightOuter2 = right2 + curbW2 + shoulderW2;

      // 1. Terrain / Tunnel Background (Drawn only OUTSIDE the road and barriers)
      if (seg.isTunnel) {
        // Enclosed Tunnel: draw dark solid interior walls and ceiling
        const tunnelHeight1 = p1.w * 1.3;
        const tunnelHeight2 = p2.w * 1.3;

        // Left Tunnel Solid Wall
        this.drawPolygon(ctx,
          0, p1.y,
          leftOuter1, p1.y,
          leftOuter2, p2.y,
          0, p2.y,
          '#060912'
        );

        // Right Tunnel Solid Wall
        this.drawPolygon(ctx,
          rightOuter1, p1.y,
          width, p1.y,
          width, p2.y,
          rightOuter2, p2.y,
          '#060912'
        );

        // Overhead Tunnel Roof / Ceiling
        this.drawPolygon(ctx,
          0, p1.y - tunnelHeight1,
          width, p1.y - tunnelHeight1,
          width, p2.y - tunnelHeight2,
          0, p2.y - tunnelHeight2,
          '#04060d'
        );
      } else {
        // Normal outdoor ground on left and right outside the barriers (NO cyan surface!)
        // Left terrain
        this.drawPolygon(ctx,
          0, p1.y,
          leftOuter1, p1.y,
          leftOuter2, p2.y,
          0, p2.y,
          seg.color.grass
        );
        // Right terrain
        this.drawPolygon(ctx,
          rightOuter1, p1.y,
          width, p1.y,
          width, p2.y,
          rightOuter2, p2.y,
          seg.color.grass
        );
      }

      // 2. Physical 3D Vertical Barriers / Guardrails (Enclosing the track)
      if (seg.color.barrier) {
        // Left Barrier Vertical Face
        this.drawPolygon(ctx,
          leftOuter1, p1.y,
          leftOuter1, p1.y - barrierH1,
          leftOuter2, p2.y - barrierH2,
          leftOuter2, p2.y,
          seg.color.barrier
        );

        // Left Barrier Reflector Top Rail
        ctx.strokeStyle = seg.color.barrierTop || '#64748b';
        ctx.lineWidth = Math.max(1, p1.scale * 3.5);
        ctx.beginPath();
        ctx.moveTo(leftOuter1, p1.y - barrierH1);
        ctx.lineTo(leftOuter2, p2.y - barrierH2);
        ctx.stroke();

        // Right Barrier Vertical Face
        this.drawPolygon(ctx,
          rightOuter1, p1.y,
          rightOuter1, p1.y - barrierH1,
          rightOuter2, p2.y - barrierH2,
          rightOuter2, p2.y,
          seg.color.barrier
        );

        // Right Barrier Reflector Top Rail
        ctx.strokeStyle = seg.color.barrierTop || '#64748b';
        ctx.lineWidth = Math.max(1, p1.scale * 3.5);
        ctx.beginPath();
        ctx.moveTo(rightOuter1, p1.y - barrierH1);
        ctx.lineTo(rightOuter2, p2.y - barrierH2);
        ctx.stroke();
      }

      // 3. Paved Asphalt Shoulder (Between Barrier and Curb)
      // Left Shoulder
      this.drawPolygon(ctx,
        leftOuter1, p1.y,
        left1 - curbW1, p1.y,
        left2 - curbW2, p2.y,
        leftOuter2, p2.y,
        seg.color.shoulder || '#0e111a'
      );

      // Right Shoulder
      this.drawPolygon(ctx,
        right1 + curbW1, p1.y,
        rightOuter1, p1.y,
        rightOuter2, p2.y,
        right2 + curbW2, p2.y,
        seg.color.shoulder || '#0e111a'
      );

      // 4. Authentic Racing Curbs (Rumble Strips, alternating Red/White)
      // Left Curb
      this.drawPolygon(ctx,
        left1 - curbW1, p1.y,
        left1, p1.y,
        left2, p2.y,
        left2 - curbW2, p2.y,
        seg.color.rumble
      );

      // Right Curb
      this.drawPolygon(ctx,
        right1, p1.y,
        right1 + curbW1, p1.y,
        right2 + curbW2, p2.y,
        right2, p2.y,
        seg.color.rumble
      );

      // Subtle Outer Curb LED Edge Line (only if track specifies curbLed)
      if (seg.color.curbLed) {
        ctx.strokeStyle = seg.color.curbLed;
        ctx.lineWidth = Math.max(1, p1.scale * 2.5);
        ctx.beginPath();
        ctx.moveTo(left1 - curbW1, p1.y);
        ctx.lineTo(left2 - curbW2, p2.y);
        ctx.moveTo(right1 + curbW1, p1.y);
        ctx.lineTo(right2 + curbW2, p2.y);
        ctx.stroke();
      }

      // 5. Main Road Surface (Dark Wet Asphalt)
      this.drawPolygon(ctx,
        left1, p1.y,
        right1, p1.y,
        right2, p2.y,
        left2, p2.y,
        seg.isTunnel ? '#0a0d16' : seg.color.road
      );

      // 5.5 Authentic Checkered Start / Finish Line spanning across the road
      if (seg.isFinishLine) {
        const checkerCols = 10;
        const isOddRow = (seg.index % 2 === 0);
        for (let c = 0; c < checkerCols; c++) {
          const u1 = c / checkerCols;
          const u2 = (c + 1) / checkerCols;
          const cx1 = left1 + (right1 - left1) * u1;
          const cx2 = left1 + (right1 - left1) * u2;
          const cx3 = left2 + (right2 - left2) * u2;
          const cx4 = left2 + (right2 - left2) * u1;
          const isWhite = (c % 2 === (isOddRow ? 0 : 1));
          this.drawPolygon(ctx, cx1, p1.y, cx2, p1.y, cx3, p2.y, cx4, p2.y, isWhite ? '#f8fafc' : '#090d16');
        }
        // Bold finish line border
        this.drawPolygon(ctx, left1, p1.y - 2, right1, p1.y - 2, right1, p1.y + 1, left1, p1.y + 1, '#ffffff');
      }

      // 5.6 Sector Checkpoint Timing Line across road
      if (seg.checkpoint > 0) {
        const cpColors = ['#38bdf8', '#a855f7', '#ec4899'];
        const cpCol = cpColors[(seg.checkpoint - 1) % cpColors.length] || '#ec4899';
        // Timing transponder strip
        this.drawPolygon(ctx, left1, p1.y, right1, p1.y, right2, p2.y, left2, p2.y, cpCol);
        // Transponder center line
        const midY1 = (p1.y + p2.y) * 0.5;
        this.drawPolygon(ctx, left1, midY1 - 2, right1, midY1 - 2, right2, midY1 + 1, left2, midY1 + 1, '#ffffff');
      }

      // Subtle damp specular sheen down center of asphalt
      if (!seg.isTunnel && !seg.isFinishLine && seg.checkpoint === 0 && p1.scale > 0.0008) {
        const sheenW1 = p1.w * 0.35;
        const sheenW2 = p2.w * 0.35;
        this.drawPolygon(ctx,
          p1.x - sheenW1, p1.y,
          p1.x + sheenW1, p1.y,
          p2.x + sheenW2, p2.y,
          p2.x - sheenW2, p2.y,
          'rgba(255, 255, 255, 0.022)'
        );
      }

      // 6. Crisp Solid White Outer Road Boundary Lines (Separates asphalt from curbs)
      const edgeLineW1 = Math.max(1.5, p1.w * 0.012);
      const edgeLineW2 = Math.max(1.5, p2.w * 0.012);

      // Left Edge White Line
      this.drawPolygon(ctx,
        left1, p1.y,
        left1 + edgeLineW1, p1.y,
        left2 + edgeLineW2, p2.y,
        left2, p2.y,
        seg.color.edgeLine || 'rgba(255, 255, 255, 0.9)'
      );

      // Right Edge White Line
      this.drawPolygon(ctx,
        right1 - edgeLineW1, p1.y,
        right1, p1.y,
        right2, p2.y,
        right2 - edgeLineW2, p2.y,
        seg.color.edgeLine || 'rgba(255, 255, 255, 0.9)'
      );


      // 7. On-Road Decals & Markings

      // 7a. Start / Finish Checkered Line
      if (seg.isFinishLine) {
        const checkCount = 8;
        const checkW1 = (p1.w * 2) / checkCount;
        const checkW2 = (p2.w * 2) / checkCount;
        for (let c = 0; c < checkCount; c++) {
          const isWhite = (c + seg.index) % 2 === 0;
          this.drawPolygon(ctx,
            left1 + c * checkW1, p1.y,
            left1 + (c + 1) * checkW1, p1.y,
            left2 + (c + 1) * checkW2, p2.y,
            left2 + c * checkW2, p2.y,
            isWhite ? '#ffffff' : '#080c14'
          );
        }
      }

      // 7b. Starting Grid Boxes (Pole, P2, P3, P4, P5 painted on tarmac)
      if (seg.index >= 4 && seg.index <= 14 && seg.index % 2 === 0) {
        const gridSlotIndex = Math.floor((seg.index - 4) / 2);
        const onLeft = gridSlotIndex % 2 === 0;
        const slotX1 = p1.x + (onLeft ? -p1.w * 0.42 : p1.w * 0.42);
        const slotX2 = p2.x + (onLeft ? -p2.w * 0.42 : p2.w * 0.42);
        const boxW1 = p1.w * 0.32;

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = Math.max(1, p1.scale * 3);
        ctx.strokeRect(slotX1 - boxW1 / 2, p1.y - (p1.y - p2.y), boxW1, Math.max(3, p1.y - p2.y));
      }

      // 7c. Braking Rubber Skid Marks on Corner Entry
      if (seg.waypoint && seg.waypoint.isBrakingZone && seg.index % 3 !== 0) {
        const skidOffset = seg.waypoint.idealX || 0;
        const skidX1 = p1.x + p1.w * skidOffset;
        const skidX2 = p2.x + p2.w * skidOffset;
        const tireTrackW1 = p1.w * 0.045;
        const tireTrackW2 = p2.w * 0.045;
        const tireDist1 = p1.w * 0.16;
        const tireDist2 = p2.w * 0.16;

        // Left tire skid
        this.drawPolygon(ctx,
          (skidX1 - tireDist1) - tireTrackW1, p1.y,
          (skidX1 - tireDist1) + tireTrackW1, p1.y,
          (skidX2 - tireDist2) + tireTrackW2, p2.y,
          (skidX2 - tireDist2) - tireTrackW2, p2.y,
          'rgba(8, 10, 16, 0.7)'
        );
        // Right tire skid
        this.drawPolygon(ctx,
          (skidX1 + tireDist1) - tireTrackW1, p1.y,
          (skidX1 + tireDist1) + tireTrackW1, p1.y,
          (skidX2 + tireDist2) + tireTrackW2, p2.y,
          (skidX2 + tireDist2) - tireTrackW2, p2.y,
          'rgba(8, 10, 16, 0.7)'
        );
      }

      // 7d. On-Road Directional Chevron Arrows
      if (seg.turnChevron && seg.index % 4 === 0) {
        const isRight = seg.turnChevron === 'chevron_right';
        const arrowW1 = p1.w * 0.22;
        const arrowX = p1.x;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = Math.max(1.5, p1.scale * 5);
        ctx.beginPath();
        if (isRight) {
          ctx.moveTo(arrowX - arrowW1 * 0.5, p1.y - 2);
          ctx.lineTo(arrowX + arrowW1 * 0.5, p1.y - (p1.y - p2.y) * 0.5);
          ctx.lineTo(arrowX - arrowW1 * 0.5, p2.y);
        } else {
          ctx.moveTo(arrowX + arrowW1 * 0.5, p1.y - 2);
          ctx.lineTo(arrowX - arrowW1 * 0.5, p1.y - (p1.y - p2.y) * 0.5);
          ctx.lineTo(arrowX + arrowW1 * 0.5, p2.y);
        }
        ctx.stroke();
      }

      // 8. Clean 3-Lane Markings (2 dashed lane dividers in crisp white)
      if (seg.color.lane !== 'transparent' && !seg.isFinishLine) {
        const laneW1 = Math.max(1, p1.w * 0.009);
        const laneW2 = Math.max(1, p2.w * 0.009);
        // 2 dividing lines for 3 lanes
        const laneOffsets = [-0.33, 0.33];
        for (const off of laneOffsets) {
          const l1 = p1.x + p1.w * off;
          const l2 = p2.x + p2.w * off;
          this.drawPolygon(ctx,
            l1 - laneW1, p1.y,
            l1 + laneW1, p1.y,
            l2 + laneW2, p2.y,
            l2 - laneW2, p2.y,
            seg.color.lane
          );
        }
      }

      // 9. Tunnel Overhead Neon Ceiling Rib
      if (seg.isTunnel && seg.index % 4 === 0) {
        const tunnelRoofH1 = p1.w * 1.25;
        const ribW = p1.w * 2.2;
        ctx.strokeStyle = seg.color.curbLed || '#38bdf8';
        ctx.lineWidth = Math.max(2, p1.scale * 8);
        ctx.beginPath();
        ctx.ellipse(p1.x, p1.y - tunnelRoofH1 * 0.35, ribW * 0.5, tunnelRoofH1 * 0.65, 0, Math.PI, 0);
        ctx.stroke();
      }
    }

    drawPolygon(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {
      if (!color || color === 'transparent') return;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
      ctx.closePath();
      ctx.fill();
    }

    renderDepthObjects(ctx, visibleSegments, player, aiManager, trafficManager, trackLength, width, height) {
      const drawList = [];

      // 1. Roadside scenery sprites
      for (let s = 0; s < visibleSegments.length; s++) {
        const seg = visibleSegments[s];
        for (let i = 0; i < seg.sprites.length; i++) {
          drawList.push({
            type: 'sprite',
            segment: seg,
            sprite: seg.sprites[i],
            z: seg.p1.world.z
          });
        }
      }

      // 2. AI Opponents (Each AI vehicle is rendered strictly ONCE per frame)
      if (aiManager && visibleSegments.length > 0) {
        const opponents = aiManager.getOpponents();
        const baseIndex = visibleSegments[0].index;
        const totalSegs = Math.round(trackLength / 200) || 1400;

        for (let i = 0; i < opponents.length; i++) {
          const ai = opponents[i];
          const aiSegFloat = (ai.z % trackLength) / 200;
          const aiSegIdx = (Math.floor(aiSegFloat) % totalSegs + totalSegs) % totalSegs;
          const n = (aiSegIdx - baseIndex + totalSegs) % totalSegs;

          if (n >= 0 && n < visibleSegments.length) {
            const matchedSeg = visibleSegments[n];
            const t = aiSegFloat - Math.floor(aiSegFloat);
            drawList.push({
              type: 'ai',
              entity: ai,
              segment: matchedSeg,
              t: t,
              z: matchedSeg.p1.world.z + t * 200
            });
          }
        }
      }

      // 3. Civilian Traffic
      if (trafficManager && visibleSegments.length > 0) {
        const vehicles = trafficManager.getVehicles();
        const baseIndex = visibleSegments[0].index;
        const totalSegs = Math.round(trackLength / 200) || 1400;

        for (let i = 0; i < vehicles.length; i++) {
          const vehicle = vehicles[i];
          const vehSegFloat = (vehicle.z % trackLength) / 200;
          const vehSegIdx = (Math.floor(vehSegFloat) % totalSegs + totalSegs) % totalSegs;
          const n = (vehSegIdx - baseIndex + totalSegs) % totalSegs;

          if (n >= 0 && n < visibleSegments.length) {
            const matchedSeg = visibleSegments[n];
            const t = vehSegFloat - Math.floor(vehSegFloat);
            drawList.push({
              type: 'traffic',
              entity: vehicle,
              segment: matchedSeg,
              t: t,
              z: matchedSeg.p1.world.z + t * 200
            });
          }
        }
      }

      // Sort from back to front (largest Z to smallest Z)
      drawList.sort((a, b) => b.z - a.z);

      // Render items
      for (let i = 0; i < drawList.length; i++) {
        const item = drawList[i];
        if (item.type === 'sprite') {
          this.renderSprite(ctx, item.segment, item.sprite, width);
        } else if (item.type === 'ai') {
          this.renderCarModel(ctx, item.entity, item.segment, item.t, width, height, player, true);
        } else if (item.type === 'traffic') {
          this.renderCarModel(ctx, item.entity, item.segment, item.t, width, height, player, false);
        }
      }
    }

    renderSprite(ctx, segment, sprite, width) {
      const p = segment.p1.screen;
      const spriteScale = p.scale * (sprite.scale || 1.0);
      const spriteX = p.x + (p.w * sprite.offset);
      const spriteY = p.y;

      ctx.save();
      if (sprite.type === 'start_arch') {
        // Start / Finish Gantry Arch spanning across the road
        const archW = p.w * 2.3;
        const archH = archW * 0.35;
        ctx.fillStyle = '#0a0d18';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = Math.max(1.5, p.scale * 6);
        ctx.strokeRect(p.x - archW / 2, spriteY - archH, archW, archH);
        ctx.fillRect(p.x - archW / 2, spriteY - archH, archW, archH);

        // Sign text
        ctx.fillStyle = '#38bdf8';
        ctx.font = `bold ${Math.max(8, Math.round(p.scale * 70))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('INFINITYPLAY RACING', p.x, spriteY - archH * 0.4);
      } else if (sprite.type === 'tunnel_portal') {
        // Massive Cyber Tunnel Entrance / Exit Portal Arch
        const portalW = p.w * 2.4;
        const portalH = portalW * 0.58;
        ctx.fillStyle = '#060913';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = Math.max(2.5, p.scale * 8);

        ctx.strokeRect(p.x - portalW / 2, spriteY - portalH, portalW, portalH);
        ctx.fillRect(p.x - portalW / 2, spriteY - portalH, portalW, portalH * 0.35);

        ctx.fillStyle = '#38bdf8';
        ctx.font = `bold ${Math.max(8, Math.round(p.scale * 65))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(sprite.text || 'CYBER TUNNEL', p.x, spriteY - portalH * 0.72);
      } else if (sprite.type === 'checkpoint_arch') {
        const archW = p.w * 2.2;
        const archH = archW * 0.32;
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = Math.max(1.5, p.scale * 5);
        ctx.strokeRect(p.x - archW / 2, spriteY - archH, archW, archH);
        ctx.fillStyle = '#ec4899';
        ctx.font = `bold ${Math.max(7, Math.round(p.scale * 55))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`CHECKPOINT ${sprite.checkpointNum}`, p.x, spriteY - archH * 0.35);
      } else if (sprite.type === 'brake_board') {
        // Professional Braking Distance Board (150m, 100m, 50m)
        const bW = Math.max(14, 75 * spriteScale);
        const bH = Math.max(16, 90 * spriteScale);
        ctx.fillStyle = '#0a0e1a';
        ctx.fillRect(spriteX - bW / 2, spriteY - bH, bW, bH);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = Math.max(1, spriteScale * 2.5);
        ctx.strokeRect(spriteX - bW / 2, spriteY - bH, bW, bH);

        // Distance text
        ctx.fillStyle = '#f8fafc';
        ctx.font = `bold ${Math.max(7, Math.round(spriteScale * 38))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`${sprite.distance}`, spriteX, spriteY - bH * 0.35);

        // Ground post
        ctx.fillStyle = '#475569';
        ctx.fillRect(spriteX - 2, spriteY - bH * 0.1, 4, bH * 0.2);
      } else if (sprite.type === 'chevron_right' || sprite.type === 'chevron_left') {
        // Neon Directional Turn Chevron Warning Sign
        const cW = Math.max(18, 85 * spriteScale);
        const cH = Math.max(16, 70 * spriteScale);
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(spriteX - cW / 2, spriteY - cH, cW, cH);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = Math.max(1, spriteScale * 2.5);
        ctx.strokeRect(spriteX - cW / 2, spriteY - cH, cW, cH);

        // Arrow shape
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        const isRight = sprite.type === 'chevron_right';
        if (isRight) {
          ctx.moveTo(spriteX - cW * 0.3, spriteY - cH * 0.8);
          ctx.lineTo(spriteX + cW * 0.2, spriteY - cH * 0.5);
          ctx.lineTo(spriteX - cW * 0.3, spriteY - cH * 0.2);
        } else {
          ctx.moveTo(spriteX + cW * 0.3, spriteY - cH * 0.8);
          ctx.lineTo(spriteX - cW * 0.2, spriteY - cH * 0.5);
          ctx.lineTo(spriteX + cW * 0.3, spriteY - cH * 0.2);
        }
        ctx.lineWidth = Math.max(2, spriteScale * 4);
        ctx.strokeStyle = '#f59e0b';
        ctx.stroke();
      } else if (sprite.type === 'skyscraper') {
        const bW = Math.max(20, 160 * spriteScale);
        const bH = Math.max(40, 420 * spriteScale);
        ctx.fillStyle = '#080c18';
        ctx.fillRect(spriteX - bW / 2, spriteY - bH, bW, bH);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = Math.max(0.5, spriteScale * 1.5);
        ctx.strokeRect(spriteX - bW / 2, spriteY - bH, bW, bH);
      } else if (sprite.type === 'neon_ad') {
        const signW = Math.max(16, 120 * spriteScale);
        const signH = Math.max(10, 70 * spriteScale);
        ctx.fillStyle = '#0a0f20';
        ctx.fillRect(spriteX - signW / 2, spriteY - signH - 30 * spriteScale, signW, signH);
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = Math.max(1, spriteScale * 2.5);
        ctx.strokeRect(spriteX - signW / 2, spriteY - signH - 30 * spriteScale, signW, signH);
      } else if (sprite.type === 'pine_tree') {
        const treeW = Math.max(12, 90 * spriteScale);
        const treeH = Math.max(20, 170 * spriteScale);
        ctx.fillStyle = '#102416';
        ctx.beginPath();
        ctx.moveTo(spriteX, spriteY - treeH);
        ctx.lineTo(spriteX + treeW / 2, spriteY);
        ctx.lineTo(spriteX - treeW / 2, spriteY);
        ctx.closePath();
        ctx.fill();
      } else if (sprite.type === 'palm_tree') {
        const treeW = Math.max(15, 110 * spriteScale);
        const treeH = Math.max(25, 200 * spriteScale);
        ctx.strokeStyle = '#4a3320';
        ctx.lineWidth = Math.max(2, spriteScale * 7);
        ctx.beginPath();
        ctx.moveTo(spriteX, spriteY);
        ctx.lineTo(spriteX + 15 * spriteScale, spriteY - treeH);
        ctx.stroke();
        ctx.fillStyle = '#047857';
        ctx.beginPath();
        ctx.ellipse(spriteX + 15 * spriteScale, spriteY - treeH, treeW * 0.6, treeH * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (sprite.type === 'rock_cliff' || sprite.type === 'cliff_rock') {
        const rockW = Math.max(20, 150 * spriteScale);
        const rockH = Math.max(25, 210 * spriteScale);
        ctx.fillStyle = '#221f1e';
        ctx.beginPath();
        ctx.moveTo(spriteX - rockW * 0.5, spriteY);
        ctx.lineTo(spriteX - rockW * 0.3, spriteY - rockH * 0.7);
        ctx.lineTo(spriteX, spriteY - rockH);
        ctx.lineTo(spriteX + rockW * 0.4, spriteY - rockH * 0.65);
        ctx.lineTo(spriteX + rockW * 0.5, spriteY);
        ctx.closePath();
        ctx.fill();
      } else if (sprite.type === 'cyber_tower') {
        const tW = Math.max(16, 110 * spriteScale);
        const tH = Math.max(40, 360 * spriteScale);
        ctx.fillStyle = '#080c16';
        ctx.fillRect(spriteX - tW * 0.3, spriteY - tH, tW * 0.6, tH);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = Math.max(1, spriteScale * 2);
        ctx.strokeRect(spriteX - tW * 0.3, spriteY - tH, tW * 0.6, tH);
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(spriteX, spriteY - tH - 10 * spriteScale, 8 * spriteScale, 0, Math.PI * 2);
        ctx.fill();
      } else if (sprite.type === 'bridge_pillar') {
        const pilW = Math.max(8, 45 * spriteScale);
        const pilH = Math.max(30, 260 * spriteScale);
        ctx.fillStyle = '#334155';
        ctx.fillRect(spriteX - pilW / 2, spriteY - pilH, pilW, pilH);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = Math.max(0.5, spriteScale * 1.5);
      } else if (sprite.type === 'sand_dune') {
        const dW = Math.max(30, 200 * spriteScale);
        const dH = Math.max(15, 120 * spriteScale);
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(spriteX, spriteY, dW * 0.5, dH, 0, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.ellipse(spriteX + dW * 0.1, spriteY, dW * 0.35, dH * 0.8, 0, Math.PI, 0);
        ctx.fill();
      } else if (sprite.type === 'canyon_wall') {
        const cW = Math.max(25, 180 * spriteScale);
        const cH = Math.max(40, 280 * spriteScale);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(spriteX - cW / 2, spriteY - cH, cW, cH);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(spriteX - cW / 2, spriteY - cH * 0.6, cW, cH * 0.25);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(spriteX - cW / 2, spriteY - cH * 0.25, cW, cH * 0.15);
      } else if (sprite.type === 'cactus') {
        const cW = Math.max(12, 65 * spriteScale);
        const cH = Math.max(20, 140 * spriteScale);
        ctx.fillStyle = '#15803d';
        ctx.fillRect(spriteX - cW * 0.15, spriteY - cH, cW * 0.3, cH);
        ctx.fillRect(spriteX - cW * 0.45, spriteY - cH * 0.7, cW * 0.3, cH * 0.12);
        ctx.fillRect(spriteX - cW * 0.45, spriteY - cH * 0.85, cW * 0.12, cH * 0.25);
        ctx.fillRect(spriteX + cW * 0.15, spriteY - cH * 0.55, cW * 0.3, cH * 0.12);
        ctx.fillRect(spriteX + cW * 0.33, spriteY - cH * 0.7, cW * 0.12, cH * 0.25);
      } else if (sprite.type === 'abandoned_tower') {
        const tW = Math.max(16, 110 * spriteScale);
        const tH = Math.max(35, 260 * spriteScale);
        ctx.fillStyle = '#57534e';
        ctx.fillRect(spriteX - tW / 2, spriteY - tH, tW, tH);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(spriteX - tW * 0.2, spriteY - tH * 0.8, tW * 0.4, tH * 0.1);
      } else if (sprite.type === 'ice_spire') {
        const sW = Math.max(14, 100 * spriteScale);
        const sH = Math.max(30, 260 * spriteScale);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(spriteX, spriteY - sH);
        ctx.lineTo(spriteX + sW / 2, spriteY);
        ctx.lineTo(spriteX - sW / 2, spriteY);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.moveTo(spriteX, spriteY - sH);
        ctx.lineTo(spriteX + sW * 0.15, spriteY);
        ctx.lineTo(spriteX - sW * 0.1, spriteY);
        ctx.closePath();
        ctx.fill();
      } else if (sprite.type === 'snow_pine') {
        const pW = Math.max(16, 110 * spriteScale);
        const pH = Math.max(25, 200 * spriteScale);
        ctx.fillStyle = '#0f3a22';
        ctx.beginPath();
        ctx.moveTo(spriteX, spriteY - pH);
        ctx.lineTo(spriteX + pW / 2, spriteY);
        ctx.lineTo(spriteX - pW / 2, spriteY);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#f0f9ff';
        ctx.beginPath();
        ctx.moveTo(spriteX, spriteY - pH);
        ctx.lineTo(spriteX + pW * 0.25, spriteY - pH * 0.5);
        ctx.lineTo(spriteX - pW * 0.25, spriteY - pH * 0.5);
        ctx.closePath();
        ctx.fill();
      } else if (sprite.type === 'glacier_wall') {
        const gW = Math.max(25, 190 * spriteScale);
        const gH = Math.max(35, 280 * spriteScale);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(spriteX - gW / 2, spriteY - gH, gW, gH);
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(spriteX - gW / 2, spriteY - gH, gW * 0.45, gH);
      } else if (sprite.type === 'jungle_tree') {
        const tW = Math.max(20, 150 * spriteScale);
        const tH = Math.max(30, 240 * spriteScale);
        ctx.fillStyle = '#422006';
        ctx.fillRect(spriteX - tW * 0.12, spriteY - tH * 0.6, tW * 0.24, tH * 0.6);
        ctx.fillStyle = '#065f46';
        ctx.beginPath();
        ctx.arc(spriteX, spriteY - tH * 0.65, tW * 0.48, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.arc(spriteX - tW * 0.15, spriteY - tH * 0.72, tW * 0.32, 0, Math.PI * 2);
        ctx.fill();
      } else if (sprite.type === 'ancient_ruin') {
        const rW = Math.max(20, 160 * spriteScale);
        const rH = Math.max(25, 220 * spriteScale);
        ctx.fillStyle = '#334155';
        ctx.fillRect(spriteX - rW / 2, spriteY - rH, rW * 0.25, rH);
        ctx.fillRect(spriteX + rW * 0.25, spriteY - rH, rW * 0.25, rH);
        ctx.fillRect(spriteX - rW * 0.55, spriteY - rH, rW * 1.1, rH * 0.28);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(spriteX - rW * 0.45, spriteY - rH * 0.7, rW * 0.15, rH * 0.1);
      } else if (sprite.type === 'waterfall_rock') {
        const wW = Math.max(20, 160 * spriteScale);
        const wH = Math.max(30, 240 * spriteScale);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(spriteX - wW / 2, spriteY - wH, wW, wH);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(spriteX - wW * 0.15, spriteY - wH, wW * 0.3, wH);
      } else if (sprite.type === 'volcano_peak') {
        const vW = Math.max(35, 260 * spriteScale);
        const vH = Math.max(45, 340 * spriteScale);
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.moveTo(spriteX - vW / 2, spriteY);
        ctx.lineTo(spriteX - vW * 0.15, spriteY - vH);
        ctx.lineTo(spriteX + vW * 0.15, spriteY - vH);
        ctx.lineTo(spriteX + vW / 2, spriteY);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(spriteX - vW * 0.15, spriteY - vH - 6 * spriteScale, vW * 0.3, 10 * spriteScale);
      } else if (sprite.type === 'magma_spire') {
        const mW = Math.max(14, 90 * spriteScale);
        const mH = Math.max(30, 230 * spriteScale);
        ctx.fillStyle = '#0c0a09';
        ctx.fillRect(spriteX - mW / 2, spriteY - mH, mW, mH);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(spriteX - mW * 0.1, spriteY - mH * 0.9, mW * 0.2, mH * 0.8);
      } else if (sprite.type === 'hologram_tower') {
        const hW = Math.max(18, 130 * spriteScale);
        const hH = Math.max(45, 380 * spriteScale);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(spriteX - hW / 2, spriteY - hH, hW, hH);
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = Math.max(1, spriteScale * 2);
        ctx.strokeRect(spriteX - hW / 2, spriteY - hH, hW, hH);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
        ctx.fillRect(spriteX - hW * 0.35, spriteY - hH * 0.7, hW * 0.7, hH * 0.2);
      } else if (sprite.type === 'cloud_pylon') {
        const pW = Math.max(12, 70 * spriteScale);
        const pH = Math.max(40, 320 * spriteScale);
        ctx.fillStyle = '#475569';
        ctx.fillRect(spriteX - pW / 2, spriteY - pH, pW, pH);
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.arc(spriteX, spriteY - pH, pW * 0.8, 0, Math.PI * 2);
        ctx.fill();
      } else if (sprite.type === 'sky_platform') {
        const sW = Math.max(25, 170 * spriteScale);
        const sH = Math.max(12, 60 * spriteScale);
        ctx.fillStyle = '#334155';
        ctx.fillRect(spriteX - sW / 2, spriteY - 140 * spriteScale, sW, sH);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(spriteX, spriteY - 140 * spriteScale, 8 * spriteScale, 0, Math.PI * 2);
        ctx.fill();
      } else if (sprite.type === 'grand_stand') {
        const gW = Math.max(30, 220 * spriteScale);
        const gH = Math.max(25, 190 * spriteScale);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(spriteX - gW / 2, spriteY - gH, gW, gH);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(spriteX - gW / 2, spriteY - gH, gW, gH * 0.15);
        ctx.fillStyle = '#38bdf8';
        for (let row = 0; row < 3; row++) {
          ctx.fillRect(spriteX - gW * 0.45, spriteY - gH * (0.3 + row * 0.2), gW * 0.9, gH * 0.08);
        }
      } else if (sprite.type === 'championship_monolith') {
        const mW = Math.max(18, 120 * spriteScale);
        const mH = Math.max(45, 380 * spriteScale);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(spriteX - mW / 2, spriteY - mH, mW, mH);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = Math.max(1.5, spriteScale * 3);
        ctx.strokeRect(spriteX - mW / 2, spriteY - mH, mW, mH);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(spriteX, spriteY - mH - 12 * spriteScale, 10 * spriteScale, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const w = Math.max(6, 40 * spriteScale);
        const h = Math.max(12, 90 * spriteScale);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(spriteX - w / 2, spriteY - h, w, h);
      }
      ctx.restore();
    }

    renderCarModel(ctx, vehicle, segment, t, width, height, player, isAI) {
      if (!segment) return;

      const p1 = segment.p1.screen;
      const p2 = segment.p2.screen;

      // Smoothly interpolate along the actual 3D road segment geometry
      const roadCenterX = p1.x + (p2.x - p1.x) * t;
      const roadCenterY = p1.y + (p2.y - p1.y) * t;
      const roadHalfW = p1.w + (p2.w - p1.w) * t;
      const scale = p1.scale + (p2.scale - p1.scale) * t;

      // Screen position strictly placed on the asphalt lane
      const screenX = Math.round(roadCenterX + roadHalfW * vehicle.x);
      const screenY = Math.round(roadCenterY);

      // Car dimensions proportional to 3-lane road width (~48% of lane half-width)
      const carW = Math.max(14, Math.round(roadHalfW * 0.48));
      const carH = Math.max(8, Math.round(carW * 0.52));

      ctx.save();
      // Drop Shadow squarely on the asphalt road surface
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.beginPath();
      ctx.ellipse(screenX, screenY, carW * 0.52, carH * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Main Chassis
      const color = isAI ? vehicle.color : (vehicle.model?.color || '#475569');
      ctx.fillStyle = color;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(screenX - carW / 2, screenY - carH, carW, carH, [Math.max(2, carW * 0.15), Math.max(2, carW * 0.15), 2, 2]);
      } else {
        ctx.rect(screenX - carW / 2, screenY - carH, carW, carH);
      }
      ctx.fill();

      // Cabin / Roof
      ctx.fillStyle = '#090d16';
      const cabinW = carW * 0.65;
      const cabinH = carH * 0.48;
      ctx.fillRect(screenX - cabinW / 2, screenY - carH * 1.35, cabinW, cabinH);

      // Rear Spoiler
      ctx.fillStyle = isAI ? vehicle.accent : '#94a3b8';
      ctx.fillRect(screenX - carW * 0.45, screenY - carH * 1.05, carW * 0.9, Math.max(2, carH * 0.12));

      // Glowing Taillights
      ctx.fillStyle = '#ef4444';
      const lightW = Math.max(3, carW * 0.18);
      const lightH = Math.max(2, carH * 0.22);
      ctx.fillRect(screenX - carW * 0.42, screenY - carH * 0.65, lightW, lightH);
      ctx.fillRect(screenX + carW * 0.42 - lightW, screenY - carH * 0.65, lightW, lightH);

      // AI Name Badge (Clean single pill label above car, no duplicates)
      if (isAI && scale > 0.0006) {
        const fontSize = Math.max(9, Math.min(13, Math.round(scale * 1200)));
        ctx.font = `bold ${fontSize}px sans-serif`;
        const textW = ctx.measureText(vehicle.name).width;
        const badgePadding = 5;
        const badgeW = textW + badgePadding * 2;
        const badgeH = fontSize + 4;
        const badgeY = screenY - carH * 1.6 - badgeH;

        ctx.fillStyle = 'rgba(10, 14, 26, 0.85)';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(screenX - badgeW / 2, badgeY, badgeW, badgeH, 3);
        } else {
          ctx.rect(screenX - badgeW / 2, badgeY, badgeW, badgeH);
        }
        ctx.fill();

        ctx.fillStyle = vehicle.color || '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(vehicle.name, screenX, badgeY + badgeH / 2);
      }

      ctx.restore();
    }

    renderPlayerCar(ctx, player, width, height, camera, track) {
      const carData = player.carData || { visuals: { bodyColor: '#00f0ff', accentColor: '#4f46e5', tailLights: '#ec4899', exhaustFlame: '#00f0ff' } };
      const visuals = carData.visuals;

      // Authentic 3-lane proportion: car occupies ~31% of road width (~195px on 1280 screen)
      const carW = Math.min(200, Math.max(120, width * 0.16));
      const carH = carW * 0.52;

      // Calculate dynamic screen X position responsive to player steering
      let carX = width / 2;
      if (camera && track) {
        const roadWidth = track.roadWidth || 520;
        const roadHalfWidth = roadWidth * 0.44;
        const playerWorldX = player.x * roadHalfWidth;
        const dz = 600; // chase camera distance behind player
        const scale = (camera.depth || 1.0) / dz;
        // Immediate dynamic lateral displacement before camera lerp catches up
        const lateralOffset = (playerWorldX - camera.x) * scale * (width / 2);
        carX = Math.round(width / 2 + Math.max(-width * 0.32, Math.min(width * 0.32, lateralOffset)));
      }
      const carY = height * 0.88;

      ctx.save();
      ctx.translate(carX, carY);

      // Apply body yaw roll when steering or drifting
      const totalYaw = (player.isDrifting ? player.driftAngle * 0.65 : 0) + (player.steeringAngle || 0);
      if (totalYaw) {
        ctx.rotate(totalYaw);
      }

      // Apply dynamic suspension bounce based on road speed and imperfections
      const speedRatio = player.getSpeedRatio ? player.getSpeedRatio() : 0;
      const suspensionBounce = Math.sin(player.z * 0.08) * (speedRatio * 1.8);
      ctx.translate(0, suspensionBounce);

      // 1. Dual Tire Contact Shadows directly on asphalt (Physical wheel contact occlusion)
      const tireShadowW = carW * 0.22;
      const tireShadowH = 6;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
      // Left tire patch
      ctx.beginPath();
      ctx.ellipse(-carW * 0.36, 4, tireShadowW * 0.5, tireShadowH * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Right tire patch
      ctx.beginPath();
      ctx.ellipse(carW * 0.36, 4, tireShadowW * 0.5, tireShadowH * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Main under-car ambient occlusion shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.70)';
      ctx.beginPath();
      ctx.ellipse(0, 4, carW * 0.48, carH * 0.20, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Wet Road Tire Spray (Fine mist kicking up behind tires)
      if (track && track.config && track.config.sceneryConfig && track.config.sceneryConfig.hasRain && player.speed > 1600) {
        const sprayAlpha = Math.min(0.28, (player.speed / 8000) * 0.28);
        ctx.fillStyle = `rgba(215, 230, 250, ${sprayAlpha})`;
        for (let sp = 0; sp < 3; sp++) {
          const spX1 = -carW * 0.36 + (Math.random() - 0.5) * 12;
          const spY1 = 8 + Math.random() * 14;
          ctx.beginPath();
          ctx.arc(spX1, spY1, 2 + Math.random() * 2.5, 0, Math.PI * 2);
          ctx.fill();

          const spX2 = carW * 0.36 + (Math.random() - 0.5) * 12;
          const spY2 = 8 + Math.random() * 14;
          ctx.beginPath();
          ctx.arc(spX2, spY2, 2 + Math.random() * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Subtle Wet Asphalt Under-Car Sheen
      const underglow = ctx.createRadialGradient(0, 0, 5, 0, 0, carW * 0.55);
      underglow.addColorStop(0, visuals.glowColor || 'rgba(56, 189, 248, 0.25)');
      underglow.addColorStop(1, 'transparent');
      ctx.fillStyle = underglow;
      ctx.fillRect(-carW * 0.65, -8, carW * 1.3, carH * 0.7);

      // 4. Faint Taillight Wet Ground Reflection
      ctx.fillStyle = 'rgba(236, 72, 153, 0.16)';
      ctx.fillRect(-carW * 0.42, 6, carW * 0.24, 12);
      ctx.fillRect(carW * 0.18, 6, carW * 0.24, 12);

      // 5. Wide Rear Body & Wheel Arches
      ctx.fillStyle = visuals.bodyColor;
      ctx.beginPath();
      ctx.moveTo(-carW * 0.5, 0);
      ctx.lineTo(-carW * 0.46, -carH * 0.55);
      ctx.lineTo(-carW * 0.38, -carH * 0.85);
      ctx.lineTo(carW * 0.38, -carH * 0.85);
      ctx.lineTo(carW * 0.46, -carH * 0.55);
      ctx.lineTo(carW * 0.5, 0);
      ctx.closePath();
      ctx.fill();

      // 5. Rear Diffuser & Dark Carbon Trim
      ctx.fillStyle = '#0a0d18';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-carW * 0.46, -carH * 0.45, carW * 0.92, carH * 0.5, [4, 4, 2, 2]);
      } else {
        ctx.rect(-carW * 0.46, -carH * 0.45, carW * 0.92, carH * 0.5);
      }
      ctx.fill();

      // 6. Cockpit / Tinted Glass Canopy
      ctx.fillStyle = visuals.windshield || 'rgba(10, 15, 30, 0.95)';
      ctx.beginPath();
      ctx.moveTo(-carW * 0.28, -carH * 0.82);
      ctx.lineTo(-carW * 0.22, -carH * 1.25);
      ctx.lineTo(carW * 0.22, -carH * 1.25);
      ctx.lineTo(carW * 0.28, -carH * 0.82);
      ctx.closePath();
      ctx.fill();

      // 7. Cyberpunk Dual Taillights
      const lightColor = visuals.tailLights || '#ec4899';
      ctx.fillStyle = lightColor;
      ctx.shadowColor = lightColor;
      ctx.shadowBlur = 8;
      ctx.fillRect(-carW * 0.42, -carH * 0.52, carW * 0.24, carH * 0.16);
      ctx.fillRect(carW * 0.18, -carH * 0.52, carW * 0.24, carH * 0.16);
      ctx.shadowBlur = 0;

      // 8. Active Nitro Exhaust Flames
      if (player.isNitroActive) {
        ctx.fillStyle = visuals.exhaustFlame || '#00f0ff';
        ctx.shadowColor = visuals.exhaustFlame || '#00f0ff';
        ctx.shadowBlur = 14;
        const flameLength = carH * (1.2 + Math.random() * 0.6);
        ctx.beginPath();
        ctx.moveTo(-carW * 0.18, carH * 0.1);
        ctx.lineTo(-carW * 0.12, flameLength);
        ctx.lineTo(-carW * 0.06, carH * 0.1);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(carW * 0.06, carH * 0.1);
        ctx.lineTo(carW * 0.12, flameLength);
        ctx.lineTo(carW * 0.18, carH * 0.1);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    }

    renderTurnIndicatorHUD(ctx, baseSegment, segments, baseSegmentIndex, width, height) {
      // Lookahead 15 segments for sharp turns to show clean HUD alert
      let sharpCurve = 0;
      for (let i = 4; i <= 20; i++) {
        const seg = segments[(baseSegmentIndex + i) % segments.length];
        if (seg && Math.abs(seg.curve) > 2.2) {
          sharpCurve = seg.curve;
          break;
        }
      }

      if (Math.abs(sharpCurve) > 2.2) {
        ctx.save();
        const isRight = sharpCurve > 0;
        const alertText = isRight ? '↱ SHARP RIGHT' : '↰ SHARP LEFT';
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        const boxW = 190;
        const boxH = 34;
        const boxX = width / 2 - boxW / 2;
        const boxY = height * 0.22;
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(alertText, width / 2, boxY + 22);
        ctx.restore();
      }
    }

    renderDebugOverlay(ctx, track, player, visibleSegments, aiManager, width, height) {
      if (!window.UR || !window.UR.debugMode || !visibleSegments || visibleSegments.length === 0) return;
      ctx.save();

      // 1. Centerline in Yellow
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < visibleSegments.length; i++) {
        const p = visibleSegments[i].p1.screen;
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // 2. Road Left Edge in Red & Right Edge in Green
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < visibleSegments.length; i++) {
        const p = visibleSegments[i].p1.screen;
        if (i === 0) ctx.moveTo(p.leftX, p.y);
        else ctx.lineTo(p.leftX, p.y);
      }
      ctx.stroke();

      ctx.strokeStyle = '#22c55e';
      ctx.beginPath();
      for (let i = 0; i < visibleSegments.length; i++) {
        const p = visibleSegments[i].p1.screen;
        if (i === 0) ctx.moveTo(p.rightX, p.y);
        else ctx.lineTo(p.rightX, p.y);
      }
      ctx.stroke();

      // 3. AI Racing Line in Cyan
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < visibleSegments.length; i++) {
        const seg = visibleSegments[i];
        const p = seg.p1.screen;
        const idealX = seg.waypoint ? seg.waypoint.idealX : 0;
        const rx = p.x + p.w * idealX;
        if (i === 0) ctx.moveTo(rx, p.y);
        else ctx.lineTo(rx, p.y);
      }
      ctx.stroke();

      // 4. Car Center Collision Limit Lines (+/-0.90) in Dashed Amber
      ctx.strokeStyle = '#f59e0b';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1.5;
      // Left limit
      ctx.beginPath();
      for (let i = 0; i < visibleSegments.length; i++) {
        const p = visibleSegments[i].p1.screen;
        const lx = p.x - p.w * 0.90;
        if (i === 0) ctx.moveTo(lx, p.y);
        else ctx.lineTo(lx, p.y);
      }
      ctx.stroke();
      // Right limit
      ctx.beginPath();
      for (let i = 0; i < visibleSegments.length; i++) {
        const p = visibleSegments[i].p1.screen;
        const rx = p.x + p.w * 0.90;
        if (i === 0) ctx.moveTo(rx, p.y);
        else ctx.lineTo(rx, p.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Diagnostic Telemetry Header Bar
      ctx.fillStyle = 'rgba(6, 9, 20, 0.92)';
      ctx.fillRect(10, 10, width - 20, 42);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, width - 20, 42);

      const trackLen = track.length || 1;
      const trackDist = Math.round(player.z % trackLen);
      const onRoadStatus = Math.abs(player.x) <= 0.76 ? 'ASPHALT (OK)' : (Math.abs(player.x) < 0.89 ? 'CURB (OK)' : 'BARRIER CLAMP');

      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `[DEBUG ENGINE] ${track.config.name.toUpperCase()} | DIST: ${trackDist}/${trackLen}m | LAP: ${player.lap}/${player.maxLaps} | CP: ${player.currentCheckpoint}/3 | ARMED: ${player.finishLineArmed ? 'YES' : 'NO'} | X: ${player.x.toFixed(3)} | STATUS: ${onRoadStatus}`,
        20, 31
      );

      ctx.restore();
    }
  }

  window.UR = window.UR || {};
  window.UR.RoadRenderer = RoadRenderer;
})();
