/**
 * Bus Simulator - Damage System (24)
 * Tracks bus damage from collisions, wear, and environmental factors
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const EconomyConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EconomyConfig) ||
    (typeof require !== 'undefined' ? require('../data/economy') : null);

  const DamageSystem = {
    _collisionCooldown: 0,
    _cooldownDuration: 1.0, // seconds
    _totalDamageTaken: 0,
    _totalAccidents: 0,

    init(modules) {
      this.modules = modules;
      this._collisionCooldown = 0;
      this._totalDamageTaken = 0;
      this._totalAccidents = 0;

      EventManager.on('busCollision', (data) => {
        this._handleCollision(data);
      });
    },

    update(bus, dt) {
      if (this._collisionCooldown > 0) {
        this._collisionCooldown -= dt;
      }

      if (!bus) return;

      // Apply weather-based wear
      const weather = this.modules.WeatherSystem;
      if (weather && bus.speed > 0) {
        if (weather.weather === 'rain' || weather.weather === 'storm') {
          // Increased wear in bad weather
          bus.damage += dt * 0.05 * weather.precipitation;
        }
      }
    },

    _handleCollision(data) {
      if (this._collisionCooldown > 0) return; // Prevent burst damage
      this._collisionCooldown = this._cooldownDuration;

      const bus = data.bus || (this.modules.GameInitSystem ? this.modules.GameInitSystem.getActiveBus() : null);
      if (!bus) return;

      // Only take damage in non-debug mode
      const debug = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig && window.BusSim.GameConfig.debug) || {};
      if (debug.invincible) return;

      const impactSpeed = data.impactSpeed || 0;
      let damageAmount = 0;

      if (impactSpeed > 40) {
        damageAmount = Math.round((impactSpeed - 40) * 0.5);
      } else if (impactSpeed > 20) {
        damageAmount = Math.round((impactSpeed - 20) * 0.3);
      } else {
        damageAmount = 1;
      }

      damageAmount = Math.min(damageAmount, 25); // Cap per-collision damage

      bus.damage += damageAmount;
      bus.damage = Math.min(100, bus.damage);
      this._totalDamageTaken += damageAmount;

      if (impactSpeed > 30) {
        this._totalAccidents++;
      }

      EventManager.emit('damageTaken', {
        amount: damageAmount,
        totalDamage: bus.damage,
        impactSpeed: impactSpeed
      });

      // Notify trip system
      const tripSystem = this.modules.TripSystem;
      if (tripSystem) {
        tripSystem.registerAccident(damageAmount);
      }
    },

    checkCollision(bus, other, minDist) {
      if (!bus || !other) return false;

      const dx = bus.x - other.x;
      const dy = bus.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDist) {
        const impactSpeed = bus.speed;
        EventManager.emit('busCollision', {
          bus: bus,
          other: other,
          impactSpeed: impactSpeed,
          distance: dist
        });
        return true;
      }
      return false;
    },

    repair(bus, amount) {
      if (!bus) return false;
      bus.repair(amount);

      return {
        damage: bus.damage,
        condition: bus.condition,
        cost: amount * (EconomyConfig ? EconomyConfig.expenses.damageRepairPerPercent : 150)
      };
    },

    getDamageInfo(bus) {
      if (!bus) return null;
      return {
        damage: bus.damage,
        condition: bus.condition,
        isDamaged: bus.isDamaged,
        totalDamageTaken: this._totalDamageTaken,
        totalAccidents: this._totalAccidents
      };
    },

    serialize() {
      return {
        totalDamageTaken: this._totalDamageTaken,
        totalAccidents: this._totalAccidents
      };
    },

    deserialize(data) {
      this._totalDamageTaken = data.totalDamageTaken || 0;
      this._totalAccidents = data.totalAccidents || 0;
    },

    destroy() {}
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.DamageSystem = DamageSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = DamageSystem;
  }
})();
