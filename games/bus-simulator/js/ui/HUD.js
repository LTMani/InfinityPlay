/**
 * Bus Simulator - HUD (Heads-Up Display)
 * Renders speedometer, fuel, passengers, navigation, and minimap
 *
 * SKELETON - Display methods implemented, visual polish in Phase 2
 */

(function () {
  'use strict';

  const GameConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig) ||
    (typeof require !== 'undefined' ? require('../config/GameConfig') : null);

  const HUD = {
    _canvas: null,
    _ctx: null,
    _visible: true,
    _speedoVisible: true,
    _navVisible: true,
    _minimapVisible: true,
    _feedbackMessages: [],
    _feedbackId: 0,

     init(modules) {
      this.modules = modules;

      // Only look for canvas if not already set (setCanvas may have been called)
      if (!this._canvas && typeof document !== 'undefined') {
        this._canvas = document.getElementById('ui-canvas');
        if (this._canvas) {
          this._ctx = this._canvas.getContext('2d');
        }
      }

      // Listen for feedback events
      const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) || null;
      if (EventManager) {
        EventManager.on('hudFeedback', (data) => {
          this.showFeedback(data.type, data.message, data.duration);
        });
      }
    },

    setCanvas(canvas) {
      this._canvas = canvas;
      this._ctx = canvas ? canvas.getContext('2d') : null;
    },

    show() {
      this._visible = true;
    },

    hide() {
      this._visible = false;
    },

    update(dt) {
      // HUD updates from event data
      this._updateFeedback(dt);
    },

    _updateFeedback(dt) {
      for (let i = this._feedbackMessages.length - 1; i >= 0; i--) {
        const msg = this._feedbackMessages[i];
        msg.timer -= dt;
        if (msg.timer <= 0) {
          this._feedbackMessages.splice(i, 1);
        }
      }
    },

    showFeedback(type, message, duration) {
      this._feedbackMessages.push({
        id: this._feedbackId++,
        type: type,
        message: message,
        timer: duration || 3.0
      });
    },

    render(ctx, dt) {
      if (!this._visible || !ctx) return;

      const bus = this.modules.GameInitSystem ? this.modules.GameInitSystem.getActiveBus() : null;
      if (!bus) return;

      const loop = this.modules.GameLoopSystem;
      const isPaused = loop && loop.getState &&
        (loop.getState() === (GameConfig ? GameConfig.states.PAUSED : 'paused'));

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.imageSmoothingEnabled = true;

      // Pause overlay
      if (isPaused) {
        this._drawPauseOverlay(ctx);
      }

      // Speedometer
      if (this._speedoVisible) {
        this._drawSpeedometer(ctx, bus);
      }

      // Gear / Direction indicator
      this._drawGearIndicator(ctx, bus);

      // Fuel, maintenance, passengers (top bar)
      this._drawStatusBar(ctx, bus);

      // Navigation (bottom) - simplified for prototype
      // (hidden during prototype)

      // Draw feedback messages
      this._drawFeedback(ctx);

      // Draw current stop info
      this._drawStopInfo(ctx, bus);

      ctx.restore();
    },

    _drawPauseOverlay(ctx) {
      const w = this._canvas ? this._canvas.width : 1280;
      const h = this._canvas ? this._canvas.height : 720;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, w, h);

      ctx.font = 'bold 48px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PAUSED', w / 2, h / 2 - 40);

      ctx.font = '14px Inter, sans-serif';
      ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
      ctx.fillText('Press P to Resume', w / 2, h / 2 + 10);

      ctx.shadowBlur = 0;
    },

    _drawFeedback(ctx) {
      if (this._feedbackMessages.length === 0) return;

      const msgs = this._feedbackMessages.slice(-3); // Show last 3
      const startY = 100;
      const lineHeight = 24;

      ctx.save();
      for (let i = 0; i < msgs.length; i++) {
        const msg = msgs[i];
        const alpha = Math.max(0, msg.timer / 3.0);
        const y = startY + i * lineHeight;

        const colors = {
          boarding: 'rgba(16, 185, 129, 0.8)',
          alighting: 'rgba(245, 158, 11, 0.8)',
          stop: 'rgba(0, 240, 255, 0.8)',
          warning: 'rgba(239, 68, 68, 0.8)',
          info: 'rgba(255, 255, 255, 0.8)'
        };
        ctx.fillStyle = colors[msg.type] || colors.info;
        ctx.globalAlpha = alpha;

        // Background
        ctx.fillRect(24, y - 2, 280, 20);
        ctx.globalAlpha = alpha;
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(msg.message, 30, y + 8);
      }
      ctx.restore();
    },

    _drawStopInfo(ctx, bus) {
      const busStopSystem = this.modules.BusStopSystem;
      if (!busStopSystem) return;

      const proximity = busStopSystem.getStopProximity();
      if (!proximity.nearStop && !proximity.isAtStop) return;

      const stop = proximity.stop;
      if (!stop) return;

      // Draw stop name banner
      const bannerY = 72 + 200 + 16 + 50; // Below gear indicator
      const bannerW = 200;
      const bannerH = 30;

      ctx.save();

      // Background
      ctx.fillStyle = proximity.isAtStop ?
        'rgba(16, 185, 129, 0.85)' : 'rgba(255, 255, 255, 0.15)';
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.lineWidth = 1;
      ctx.fillRect(24, bannerY, bannerW, bannerH);
      ctx.strokeRect(24, bannerY, bannerW, bannerH);

      // Stop name
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('🛑 ' + (stop.name || 'Bus Stop'), 30, bannerY + 10);

      // Waiting count
      if (stop.passengers && stop.passengers.length > 0) {
        ctx.font = '11px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('👥 Waiting: ' + stop.passengers.length, 30, bannerY + 22);
      }

      // Stop valid indicator
      if (proximity.isAtStop) {
        const validText = proximity.stopValid ? 'READY TO BOARD' : 'TOO FAST - SLOW DOWN';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillStyle = proximity.stopValid ? '#10b981' : '#ef4444';
        ctx.textAlign = 'right';
        ctx.fillText(validText, 24 + bannerW - 4, bannerY + 10);
      }

      ctx.restore();
    },

    _drawGearIndicator(ctx, bus) {
      const gearX = 24;
      const gearY = 72 + 200 + 16;
      const gearW = 60;
      const gearH = 44;

      const isReverse = bus.reverseMode || (bus.speed < 0);
      const gearText = isReverse ? 'R' : (Math.abs(bus.speed) < 2 ? 'N' : 'D');
      const gearColor = isReverse ? '#ef4444' : '#00f0ff';

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(gearX, gearY, gearW, gearH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(gearX, gearY, gearW, gearH);

      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillStyle = gearColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(gearText, gearX + gearW / 2, gearY + gearH / 2 - 4);

      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('GEAR', gearX + gearW / 2, gearY + gearH / 2 + 10);
    },

    _drawSpeedometer(ctx, bus) {
      const w = GameConfig ? GameConfig.ui.speedoWidth : 200;
      const h = GameConfig ? GameConfig.ui.speedoHeight : 200;
      const x = 24;
      const y = 72;

      const speed = bus.speed;
      const maxSpeed = bus.maxSpeed;
      const speedRatio = Math.max(0, Math.min(1, speed / maxSpeed));
      const angle = -Math.PI / 2 + speedRatio * Math.PI * 1.5;

      ctx.save();
      ctx.translate(x + w / 2, y + h / 2);

      // Outer ring
      ctx.beginPath();
      ctx.arc(0, 0, w / 2 - 8, -Math.PI / 2 - Math.PI * 0.25, Math.PI / 2 + Math.PI * 0.25);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 12;
      ctx.stroke();

      // Fill arc (speed)
      ctx.beginPath();
      ctx.arc(0, 0, w / 2 - 8, -Math.PI / 2 - Math.PI * 0.25, angle);
      ctx.strokeStyle = this._getSpeedColor(speedRatio);
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 15;
      ctx.shadowColor = this._getSpeedColor(speedRatio);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Speed text
      ctx.font = 'bold 28px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(speed), 0, 8);

      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('km/h', 0, 22);

      // Tick marks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i <= 10; i++) {
        const tickAngle = -Math.PI / 2 - Math.PI * 0.25 + (Math.PI * 1.5) * (i / 10);
        const x1 = Math.cos(tickAngle) * (w / 2 - 20);
        const y1 = Math.sin(tickAngle) * (w / 2 - 20);
        const x2 = Math.cos(tickAngle) * (w / 2 - 12);
        const y2 = Math.sin(tickAngle) * (w / 2 - 12);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.restore();
    },

    _getSpeedColor(ratio) {
      if (ratio < 0.5) return '#00f0ff';  // blue (efficient)
      if (ratio < 0.8) return '#fbbf24';  // yellow (moderate)
      return '#ef4444';                   // red (high)
    },

    _drawStatusBar(ctx, bus) {
      const barY = 16;

      // Fuel
      const fuelPct = bus.fuelLevel / bus.fuelCapacity;
      const fuelX = 180;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(fuelX, barY, 120, 18);

      ctx.fillStyle = fuelPct < 0.15 ? '#ef4444' : '#10b981';
      ctx.fillRect(fuelX, barY, 120 * fuelPct, 18);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(fuelX, barY, 120, 18);

      ctx.font = '11px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(`⛽ ${Math.round(fuelPct * 100)}%`, fuelX + 4, barY + 13);

      // Maintenance / Condition
      const condX = 310;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(condX, barY, 120, 18);

      const condPct = bus.condition / 100;
      ctx.fillStyle = condPct < 0.3 ? '#ef4444' : (condPct < 0.6 ? '#fbbf24' : '#10b981');
      ctx.fillRect(condX, barY, 120 * condPct, 18);

      ctx.strokeRect(condX, barY, 120, 18);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`🔧 ${Math.round(condPct * 100)}%`, condX + 4, barY + 13);

      // Passengers
      const passX = 440;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(passX, barY, 140, 18);

      const occPct = bus.getOccupancy();
      ctx.fillStyle = occPct > 0.9 ? '#ef4444' : (occPct > 0.5 ? '#fbbf24' : '#00f0ff');
      ctx.fillRect(passX, barY, 140 * occPct, 18);

      ctx.strokeRect(passX, barY, 140, 18);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(`👥 ${bus.passengersOnBoard}/${bus.passengerCapacity}`, passX + 4, barY + 13);

      // Boarding indicator
      const boardingSystem = this.modules.BoardingSystem;
      if (boardingSystem && boardingSystem.isBoarding && boardingSystem.isBoarding()) {
        const bp = boardingSystem.getBoardingProgress();
        const bc = boardingSystem.getBoardedThisStop();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
        ctx.fillRect(passX, barY + 22, 140 * bp, 4);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.strokeRect(passX, barY + 22, 140, 4);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText('Boarding: ' + bc, passX + 2, barY + 32);
      }

      // Alighting indicator
      const dropOffSystem = this.modules.DropOffSystem;
      if (dropOffSystem && dropOffSystem.isAlighting && dropOffSystem.isAlighting()) {
        const ap = dropOffSystem.getAlightingProgress();
        const ac = dropOffSystem.getAlightedThisStop();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.8)';
        ctx.fillRect(passX, barY + 22, 140 * ap, 4);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.strokeRect(passX, barY + 22, 140, 4);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText('Alighting: ' + ac, passX + 2, barY + 34);
      }

      // Trip revenue
      const tripSystem = this.modules.TripSystem;
      if (tripSystem && tripSystem.totalRevenue > 0) {
        const revX = 590;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(revX, barY, 140, 18);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(revX, barY, (tripSystem.totalRevenue / 5000) * 140, 18);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.strokeRect(revX, barY, 140, 18);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`₵ ${tripSystem.totalRevenue.toLocaleString()}`, revX + 4, barY + 13);
      }
    },

    _drawNavigation(ctx, bus) {
      const nav = this.modules.NavigationSystem;
      if (!nav) return;

      const next = nav.getNextInstruction();
      const barY = 680;
      const barW = 400;
      const barX = (this._canvas ? this._canvas.width : 1280) / 2 - barW / 2;

      // Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(barX, barY, barW, 70);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(barX, barY, barW, 70);

      // Next turn icon + instruction
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(next.icon, barX + 20, barY + 20);

      ctx.font = '13px Inter, sans-serif';
      ctx.fillText(next.instruction, barX + 50, barY + 20);

      // Distance
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillStyle = '#00f0ff';
      ctx.fillText(`${next.distance} m`, barX + 200, barY + 40);

      // Route progress
      const routeSystem = this.modules.RouteSystem;
      if (routeSystem && routeSystem.activeRoute) {
        const progress = routeSystem.getProgress() * 100;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(barX, barY + 52, barW, 6);
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(barX, barY + 52, barW * routeSystem.getProgress(), 6);

        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${Math.round(progress)}% - ${routeSystem.getRouteName()}`, barX + 4, barY + 45);
      }
    },

    _drawMinimap(ctx, bus) {
      const map = this.modules.Map;
      if (!map) return;

      const size = 160;
      const x = (this._canvas ? this._canvas.width : 1280) - size - 24;
      const y = 100;

      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(x, y, size, size);
      ctx.strokeRect(x, y, size, size);

      // Draw cities
      if (map.allCities) {
        const scale = size / 8000;
        for (const city of map.allCities) {
          const cx = x + (city.x * scale);
          const cy = y + (city.y * scale);
          const citySize = Math.max(2, city.displaySize * scale * 0.7);

          ctx.fillStyle = city.displayColor || '#00f0ff';
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(cx, cy, citySize, 0, Math.PI * 2);
          ctx.fill();

          // Highlight player position
          if (bus) {
            const bx = x + (bus.x * scale);
            const by = y + (bus.y * scale);
            ctx.fillStyle = '#fbbf24';
            ctx.globalAlpha = 0.9;
            ctx.beginPath();
            ctx.arc(bx, by, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    },

    _drawDamageIndicator(ctx) {
      const w = this._canvas ? this._canvas.width : 1280;
      const h = this._canvas ? this._canvas.height : 720;

      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.fillRect(0, 0, w, h);

      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText('⚠ BUS DAMAGED', w / 2, 50);
    },

    toggleSpeedo() {
      this._speedoVisible = !this._speedoVisible;
    },

    toggleNav() {
      this._navVisible = !this._navVisible;
    },

    toggleMinimap() {
      this._minimapVisible = !this._minimapVisible;
    },

    destroy() {
      this._canvas = null;
      this._ctx = null;
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.HUD = HUD;
  }
  if (typeof module !== 'undefined') {
    module.exports = HUD;
  }
})();
