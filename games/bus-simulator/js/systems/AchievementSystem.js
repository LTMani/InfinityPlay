/**
 * Bus Simulator - Achievement System (28)
 * Tracks and unlocks game-specific achievements
 *
 * SKELETON - Achievement tracking implemented, UI rendering in UIManager
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const BusSimAchievements = (typeof window !== 'undefined' && window.BusSim && window.BusSim.BusSimAchievements) ||
    (typeof require !== 'undefined' ? require('../data/achievements') : null);
  const GameConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig) ||
    (typeof require !== 'undefined' ? require('../config/GameConfig') : null);

  const AchievementSystem = {
    _achievements: [],
    _unlocked: [],
    _progress: {},

    init(modules) {
      this.modules = modules;

      // Clone achievement definitions
      const source = BusSimAchievements;
      if (source && source instanceof Array) {
        this._achievements = source.map(a => ({ ...a }));
      } else if (source && source.achievements) {
        this._achievements = source.achievements.map(a => ({ ...a }));
      } else {
        this._achievements = [];
      }

      this._unlocked = [];
      this._progress = {};

      // Bind to events that trigger achievement checks
      EventManager.on('tripCompleted', () => this._checkAchievements());
      EventManager.on('busPurchased', () => this._checkAchievements());
      EventManager.on('passengerBoarded', () => this._checkAchievements());
      EventManager.on('refuelComplete', () => this._checkAchievements());
      EventManager.on('maintenancePerformed', () => this._checkAchievements());
      EventManager.on('damageTaken', () => this._checkAchievements());
      EventManager.on('gameLoaded', () => this._checkAchievements());
      EventManager.on('levelUp', () => this._checkAchievements());

      this._checkAchievements();
    },

    _checkAchievements() {
      const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
      const tripSystem = this.modules.TripSystem;
      const passengerSystem = this.modules.PassengerSystem;
      const garageSystem = this.modules.GarageSystem;
      const fuelSystem = this.modules.FuelSystem;
      const damageSystem = this.modules.DamageSystem;
      const maintenanceSystem = this.modules.MaintenanceSystem;

      for (const ach of this._achievements) {
        if (this._unlocked.includes(ach.id)) continue;

        const unlocked = this._evaluateAchievement(ach, {
          player, tripSystem, passengerSystem, garageSystem,
          fuelSystem, damageSystem, maintenanceSystem, gameConfig: GameConfig
        });

        if (unlocked) {
          this._unlockAchievement(ach);
        }
      }
    },

    _evaluateAchievement(ach, ctx) {
      const criteria = ach.criteria;
      if (!criteria || !ctx) return false;

      const c = criteria.type;
      const t = criteria.threshold;
      const p = ctx.player;

      switch (c) {
        case 'trip_complete':
          return (ctx.tripSystem && ctx.tripSystem.tripsCompleted) >= t;
        case 'clean_trips':
          return (p && p.tripsCompleted - p.accidentCount) >= t;
        case 'on_time_trips':
          return (p && p.onTimeTrips) >= t;
        case 'passengers_served':
          return (p && p.totalPassengersServed) >= t;
        case 'total_distance':
          return (p && p.totalDistance) >= t;
        case 'fuel_efficient_trip':
          return (ctx.fuelSystem && ctx.fuelSystem._totalFuelPurchased) > 0 &&
                 (ctx.tripSystem && ctx.tripSystem.tripsCompleted) >= 1;
        case 'night_trips':
          const dayNight = this.modules.DayNightSystem;
          if (!dayNight) return false;
          return dayNight.isNight && (p && p.tripsCompleted) >= t;
        case 'total_revenue':
          return (p && p.totalRevenue) >= t;
        case 'buses_owned':
          return (p && p.garage && p.garage.length) >= t;
        case 'full_customization':
          const garage = ctx.garageSystem;
          if (!garage || !garage.getActiveBus()) return false;
          const bus = garage.getActiveBus();
          return bus.customization.exterior.accessories.length > 0 &&
                 bus.customization.interior.seatStyle !== 'fabric-red';
        case 'regions_completed':
          return this._countCompletedRegions(p) >= t;
        case 'perfect_trip':
          // Track if any trip was perfect
          return this._progress['perfect_trip'] > 0;
        case 'rain_trips':
          return this._progress['rain_trips'] > 0;
        case 'player_level':
          return (p && p.level) >= t;
        case 'max_speed_reached':
          return this._progress['max_speed'] >= t;
        case 'zero_expense_trip':
          return this._progress['zero_expense'] > 0;
        case 'tolls_crossed':
          return this._progress['tolls'] >= t;
        case 'drive_to_stop':
        case 'pick_up_passengers':
        case 'complete_short_route':
          return this._progress[c] > 0;
        default:
          return false;
      }
    },

    _countCompletedRegions(player) {
      if (!player) return 0;
      // Based on cities visited (tracked through routes)
      return (player._visitedRegions || []).length;
    },

    _trackProgress(eventType) {
      this._progress[eventType] = (this._progress[eventType] || 0) + 1;
    },

    _unlockAchievement(ach) {
      this._unlocked.push(ach.id);

      const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
      if (player) {
        player.addXP(ach.xp || 0);
        if (ach.rewards && ach.rewards.coins) {
          player.addMoney(ach.rewards.coins);
        }
      }

      EventManager.emit('achievementUnlocked', {
        id: ach.id,
        title: ach.title,
        description: ach.description,
        icon: ach.icon,
        xp: ach.xp,
        rewards: ach.rewards
      });

      // Track for platform integration
      EventManager.emit('platformAchievement', {
        id: ach.id,
        title: ach.title,
        xp: ach.xp
      });

      this._checkAchievements();
    },

    getAchievements() {
      return this._achievements.map(a => ({
        ...a,
        unlocked: this._unlocked.includes(a.id)
      }));
    },

    getUnlocked() {
      return this._unlocked;
    },

    isUnlocked(id) {
      return this._unlocked.includes(id);
    },

    track(eventType, value) {
      if (value !== undefined) {
        this._progress[eventType] = value;
      } else {
        this._trackProgress(eventType);
      }
      this._checkAchievements();
    },

    serialize() {
      return {
        unlocked: this._unlocked,
        progress: this._progress
      };
    },

    deserialize(data) {
      this._unlocked = data.unlocked || [];
      this._progress = data.progress || {};
      this._checkAchievements();
    },

    destroy() {}
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.AchievementSystem = AchievementSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = AchievementSystem;
  }
})();
