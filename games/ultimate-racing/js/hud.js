/**
 * InfinityPlay Ultimate Racing - Heads-Up Display (HUD) Controller
 * Renders Speedometer, Tachometer, Nitro Gauge, Lap Times, Leaderboard Rank, Drift Multiplier & Minimap
 */

(function() {
  class HUD {
    constructor() {
      // DOM HUD Elements
      this.hudContainer = document.getElementById('gameHUD');
      this.posText = document.getElementById('hudPosition');
      this.lapText = document.getElementById('hudLap');
      this.timeText = document.getElementById('hudTime');
      this.bestLapText = document.getElementById('hudBestLap');
      this.speedNumber = document.getElementById('hudSpeedNum');
      this.speedBar = document.getElementById('hudSpeedBar');
      this.gearText = document.getElementById('hudGear');
      this.nitroFill = document.getElementById('hudNitroFill');
      this.nitroText = document.getElementById('hudNitroText');
      this.driftScoreWrap = document.getElementById('hudDriftWrap');
      this.driftScoreNum = document.getElementById('hudDriftNum');
      this.minimapCanvas = document.getElementById('hudMinimap');
      this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;
      this.notificationBanner = document.getElementById('hudNotification');

      this.notificationTimer = null;
    }

    formatTime(ms) {
      if (!ms || ms <= 0) return '00:00.000';
      const totalSec = ms / 1000;
      const mins = Math.floor(totalSec / 60);
      const secs = Math.floor(totalSec % 60);
      const millis = Math.floor((ms % 1000));
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
    }

    showNotification(msg, duration = 2000) {
      if (!this.notificationBanner) return;
      this.notificationBanner.textContent = msg;
      this.notificationBanner.classList.add('active');
      if (this.notificationTimer) clearTimeout(this.notificationTimer);
      this.notificationTimer = setTimeout(() => {
        this.notificationBanner.classList.remove('active');
      }, duration);
    }

    update(player, track, aiManager, gameMode) {
      if (!this.hudContainer) return;

      // 1. Position
      if (this.posText) {
        if (gameMode === 'time-trial') {
          this.posText.textContent = 'SOLO';
        } else {
          const totalRacers = (aiManager ? aiManager.getOpponents().length : 4) + 1;
          this.posText.textContent = `${player.position} / ${totalRacers}`;
        }
      }

      // 2. Lap Count
      if (this.lapText) {
        this.lapText.textContent = `LAP ${player.lap} / ${player.maxLaps}`;
      }

      // 3. Race Time & Best Lap
      if (this.timeText) {
        this.timeText.textContent = this.formatTime(player.raceTime);
      }
      if (this.bestLapText) {
        this.bestLapText.textContent = player.bestLapTime ? `BEST: ${this.formatTime(player.bestLapTime)}` : 'BEST: --:--.---';
      }

      // 4. Speedometer & Tachometer
      const kmh = player.getSpeedKmH();
      if (this.speedNumber) {
        this.speedNumber.textContent = kmh;
      }
      if (this.speedBar) {
        const pct = Math.min(100, Math.round((kmh / 300) * 100));
        this.speedBar.style.width = `${pct}%`;
      }

      // Compute Gear roughly from speed
      if (this.gearText) {
        let gear = 1;
        if (kmh > 240) gear = 6;
        else if (kmh > 190) gear = 5;
        else if (kmh > 140) gear = 4;
        else if (kmh > 90) gear = 3;
        else if (kmh > 45) gear = 2;
        this.gearText.textContent = kmh > 0 ? `GEAR ${gear}` : 'N';
      }

      // 5. Nitro Boost Meter
      if (this.nitroFill) {
        const nitroPct = Math.max(0, Math.min(100, Math.round(player.nitroMeter)));
        this.nitroFill.style.width = `${nitroPct}%`;
        if (this.nitroText) {
          this.nitroText.textContent = `${nitroPct}%`;
        }
      }

      // 6. Drift Score
      if (this.driftScoreWrap && this.driftScoreNum) {
        if (player.isDrifting && player.currentDriftScore > 50) {
          this.driftScoreWrap.style.display = 'flex';
          this.driftScoreNum.textContent = `+${player.currentDriftScore.toLocaleString()}`;
        } else {
          this.driftScoreWrap.style.display = 'none';
        }
      }

      // 7. Minimap Radar
      const settings = window.UR?.SaveSystem?.getSettings() || {};
      if (settings.showMinimap && this.minimapCtx && this.minimapCanvas) {
        this.renderMinimap(player, track, aiManager);
      }
    }

    renderMinimap(player, track, aiManager) {
      const ctx = this.minimapCtx;
      const w = this.minimapCanvas.width;
      const h = this.minimapCanvas.height;
      ctx.clearRect(0, 0, w, h);

      const path = track.minimapPath;
      const bounds = track.minimapBounds;
      if (!path || path.length < 10 || !bounds) return;

      const pad = 14;
      const scaleX = (w - pad * 2) / bounds.width;
      const scaleZ = (h - pad * 2) / bounds.height;
      const scale = Math.min(scaleX, scaleZ);

      const midX = (bounds.minX + bounds.maxX) / 2;
      const midZ = (bounds.minZ + bounds.maxZ) / 2;
      const offX = w / 2 - midX * scale;
      // Invert Z so driving forward on start straight moves UPWARDS, and right turns curve RIGHT
      const offY = h / 2 + midZ * scale;

      const toScreen = (pt) => ({
        x: offX + pt.x * scale,
        y: offY - pt.z * scale
      });

      // 1. Draw True Closed Circuit Ribbon
      ctx.beginPath();
      const firstPt = toScreen(path[0]);
      ctx.moveTo(firstPt.x, firstPt.y);
      const step = Math.max(1, Math.floor(path.length / 160));
      for (let i = step; i < path.length; i += step) {
        const pt = toScreen(path[i]);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();

      // Outer track bed ribbon
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.lineWidth = 7;
      ctx.stroke();

      // Outer luminous circuit boundary
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.40)';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Inner crisp racing centerline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.90)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // 2. Draw Sector Checkpoint Badges (S1, S2, S3)
      const segments = track.segments || [];
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (seg.checkpoint > 0 && path[i]) {
          const cpPt = toScreen(path[i]);
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(cpPt.x, cpPt.y, 3.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(`S${seg.checkpoint}`, cpPt.x, cpPt.y - 4);
        }
      }

      // 3. Draw Start / Finish Line Checkered Marker
      const startPt = toScreen(path[0]);
      const nextStartPt = toScreen(path[Math.min(5, path.length - 1)]);
      const sdx = nextStartPt.x - startPt.x;
      const sdy = nextStartPt.y - startPt.y;
      const sLen = Math.hypot(sdx, sdy) || 1;
      const snx = -sdy / sLen;
      const sny = sdx / sLen;

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(startPt.x - snx * 5, startPt.y - sny * 5);
      ctx.lineTo(startPt.x + snx * 5, startPt.y + sny * 5);
      ctx.stroke();

      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(startPt.x, startPt.y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 4. Draw All Active AI Opponent Blips
      const trackLength = track.length || 1;
      const segCount = path.length;
      if (aiManager) {
        for (const ai of aiManager.getOpponents()) {
          const aiSegFloat = (ai.z % trackLength) / track.segmentLength;
          const aiSegIdx = Math.floor(aiSegFloat) % segCount;
          const aiSegFrac = aiSegFloat - Math.floor(aiSegFloat);
          const pA = path[aiSegIdx] || path[0];
          const pB = path[(aiSegIdx + 1) % segCount] || pA;
          const aiX = pA.x + (pB.x - pA.x) * aiSegFrac;
          const aiZ = pA.z + (pB.z - pA.z) * aiSegFrac;

          const aiPt = toScreen({ x: aiX, z: aiZ });
          ctx.fillStyle = ai.color || '#ef4444';
          ctx.beginPath();
          ctx.arc(aiPt.x, aiPt.y, 3.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#0a0d16';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // 5. Draw Player Blip with Direction Arrow & Lateral Lane Offset
      const playerSegFloat = (player.z % trackLength) / track.segmentLength;
      const playerSegIdx = Math.floor(playerSegFloat) % segCount;
      const playerSegFrac = playerSegFloat - Math.floor(playerSegFloat);
      const currPt = path[playerSegIdx] || path[0];
      const nextPt = path[(playerSegIdx + 1) % segCount] || currPt;

      const interpX = currPt.x + (nextPt.x - currPt.x) * playerSegFrac;
      const interpZ = currPt.z + (nextPt.z - currPt.z) * playerSegFrac;

      const tdx = nextPt.x - currPt.x;
      const tdz = nextPt.z - currPt.z;
      const tLen = Math.hypot(tdx, tdz) || 1;
      // Normal vector pointing right of track
      const normX = -tdz / tLen;
      const normZ = tdx / tLen;

      // Lateral lane offset
      const latOffset = (player.x || 0) * (track.roadWidth * 0.40);
      const pPt = toScreen({
        x: interpX + normX * latOffset,
        z: interpZ + normZ * latOffset
      });

      // Direction angle on screen
      const screenAngle = Math.atan2(-(nextPt.z - currPt.z), nextPt.x - currPt.x);

      ctx.save();
      ctx.translate(pPt.x, pPt.y);

      // Player glowing halo
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Heading arrow pointing forward along circuit
      ctx.rotate(screenAngle);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(-3, -3);
      ctx.lineTo(-1.5, 0);
      ctx.lineTo(-3, 3);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  window.UR = window.UR || {};
  window.UR.HUD = HUD;
})();

