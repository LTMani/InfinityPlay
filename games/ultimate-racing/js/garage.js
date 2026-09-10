/**
 * InfinityPlay Ultimate Racing - Garage & Upgrades Controller
 * Manages car browsing, part upgrades (Level 1-5), and credits spending
 */

(function() {
  class GarageController {
    constructor() {
      this.selectedCarIndex = 0;
      this.cars = window.UR?.CARS || [];
    }

    init() {
      this.cars = window.UR?.CARS || [];
      const savedCar = window.UR.SaveSystem.getData().selectedCar;
      const idx = this.cars.findIndex(c => c.id === savedCar);
      this.selectedCarIndex = idx >= 0 ? idx : 0;
    }

    getCurrentCar() {
      return this.cars[this.selectedCarIndex] || this.cars[0];
    }

    nextCar() {
      this.selectedCarIndex = (this.selectedCarIndex + 1) % this.cars.length;
      this.render();
      window.UR.audio.playClick();
    }

    prevCar() {
      this.selectedCarIndex = (this.selectedCarIndex - 1 + this.cars.length) % this.cars.length;
      this.render();
      window.UR.audio.playClick();
    }

    selectCurrentCar() {
      const car = this.getCurrentCar();
      const isUnlocked = window.UR.SaveSystem.isCarUnlocked(car.id);
      if (!isUnlocked) {
        window.UR.HUD?.showNotification?.(car.unlock.text, 2500);
        return false;
      }

      window.UR.SaveSystem.getData().selectedCar = car.id;
      window.UR.SaveSystem.save();
      window.UR.audio.playClick();
      this.render();
      return true;
    }

    upgradePart(partKey) {
      const car = this.getCurrentCar();
      const isUnlocked = window.UR.SaveSystem.isCarUnlocked(car.id);
      if (!isUnlocked) return;

      const result = window.UR.SaveSystem.upgradePart(car.id, partKey);
      if (result.success) {
        window.UR.audio.playVictory();
        this.render();
      } else {
        window.UR.audio.playCollision(0.2);
        alert(result.reason);
      }
    }

    render() {
      const car = this.getCurrentCar();
      const saveData = window.UR.SaveSystem.getData();
      const isUnlocked = window.UR.SaveSystem.isCarUnlocked(car.id);
      const isSelected = saveData.selectedCar === car.id;
      const upgrades = window.UR.SaveSystem.getCarUpgrades(car.id);

      // Credits element
      const creditsEl = document.getElementById('garageCredits');
      if (creditsEl) creditsEl.textContent = saveData.credits.toLocaleString();

      // Car details
      const nameEl = document.getElementById('garageCarName');
      const tagEl = document.getElementById('garageCarTag');
      const descEl = document.getElementById('garageCarDesc');
      if (nameEl) nameEl.textContent = car.name;
      if (tagEl) tagEl.textContent = car.tagline;
      if (descEl) descEl.textContent = car.description;

      // Lock Badge / Status
      const lockBanner = document.getElementById('garageLockBanner');
      const selectBtn = document.getElementById('garageSelectBtn');
      if (lockBanner) {
        if (!isUnlocked) {
          lockBanner.style.display = 'block';
          lockBanner.textContent = `🔒 ${car.unlock.text}`;
        } else {
          lockBanner.style.display = 'none';
        }
      }

      if (selectBtn) {
        if (!isUnlocked) {
          selectBtn.disabled = true;
          selectBtn.textContent = 'Locked';
          selectBtn.className = 'btn btn-ghost disabled';
        } else if (isSelected) {
          selectBtn.disabled = true;
          selectBtn.textContent = '✓ Currently Selected';
          selectBtn.className = 'btn btn-success';
        } else {
          selectBtn.disabled = false;
          selectBtn.textContent = 'Select Car';
          selectBtn.className = 'btn btn-primary';
        }
      }

      // Stats bars
      this.renderStatBar('statTopSpeed', car.stats.topSpeed + (upgrades.engine - 1) * 12, 310);
      this.renderStatBar('statAccel', car.stats.acceleration + (upgrades.turbo - 1) * 0.5, 10);
      this.renderStatBar('statHandling', car.stats.handling + (upgrades.handling - 1) * 0.4, 10);
      this.renderStatBar('statBraking', car.stats.braking + (upgrades.brakes - 1) * 0.4, 10);
      this.renderStatBar('statNitro', car.stats.nitro + (upgrades.nitro - 1) * 0.5, 10);

      // Upgrade Parts UI
      const parts = ['engine', 'turbo', 'brakes', 'handling', 'nitro'];
      for (const p of parts) {
        const lvl = upgrades[p] || 1;
        const lvlEl = document.getElementById(`partLvl_${p}`);
        const costEl = document.getElementById(`partCost_${p}`);
        const btnEl = document.getElementById(`partBtn_${p}`);

        if (lvlEl) lvlEl.textContent = `Lv.${lvl} / 5`;
        if (costEl) {
          costEl.textContent = lvl >= 5 ? 'MAX' : `${window.UR.SaveSystem.getUpgradeCost(lvl)} CR`;
        }
        if (btnEl) {
          btnEl.disabled = !isUnlocked || lvl >= 5 || saveData.credits < window.UR.SaveSystem.getUpgradeCost(lvl);
        }
      }

      // Render 2D Car Preview Canvas
      this.renderCarPreviewCanvas(car);
    }

    renderStatBar(elementId, value, maxVal) {
      const el = document.getElementById(elementId);
      if (!el) return;
      const pct = Math.min(100, Math.round((value / maxVal) * 100));
      el.style.width = `${pct}%`;
      const numSpan = el.parentElement.parentElement.querySelector('.stat-value');
      if (numSpan) {
        numSpan.textContent = typeof value === 'number' && value > 50 ? `${Math.round(value)} KM/H` : value.toFixed(1);
      }
    }

    renderCarPreviewCanvas(car) {
      const canvas = document.getElementById('garageCarCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Cyber grid background
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Glowing turntable pedestal
      const cx = w / 2;
      const cy = h * 0.65;
      const pedGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 140);
      pedGrad.addColorStop(0, car.visuals.glowColor || 'rgba(0, 240, 255, 0.4)');
      pedGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = pedGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 150, 45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Top/3-Quarter Vector Representation of the Car
      ctx.save();
      ctx.translate(cx, cy - 20);

      const carW = 200;
      const carH = 100;

      // Drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.ellipse(0, 25, carW * 0.55, carH * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Main body
      ctx.fillStyle = car.visuals.bodyColor;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-carW / 2, -carH / 2, carW, carH, [16, 16, 8, 8]);
      } else {
        ctx.rect(-carW / 2, -carH / 2, carW, carH);
      }
      ctx.fill();

      // Racing stripes
      ctx.fillStyle = car.visuals.stripes;
      ctx.fillRect(-carW * 0.08, -carH / 2, carW * 0.16, carH);

      // Cockpit
      ctx.fillStyle = car.visuals.windshield;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-carW * 0.25, -carH * 0.35, carW * 0.5, carH * 0.7, 10);
      } else {
        ctx.rect(-carW * 0.25, -carH * 0.35, carW * 0.5, carH * 0.7);
      }
      ctx.fill();

      // Front headlights
      ctx.fillStyle = car.visuals.headlights;
      ctx.fillRect(-carW * 0.42, -carH * 0.45, 12, 10);
      ctx.fillRect(-carW * 0.42, carH * 0.35, 12, 10);

      // Rear taillights
      ctx.fillStyle = car.visuals.tailLights;
      ctx.fillRect(carW * 0.40, -carH * 0.45, 8, carH * 0.9);

      // Wheels
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-carW * 0.38, -carH * 0.58, 28, 10);
      ctx.fillRect(-carW * 0.38, carH * 0.48, 28, 10);
      ctx.fillRect(carW * 0.22, -carH * 0.58, 28, 10);
      ctx.fillRect(carW * 0.22, carH * 0.48, 28, 10);

      ctx.restore();
    }
  }

  window.UR = window.UR || {};
  window.UR.garage = new GarageController();
})();

