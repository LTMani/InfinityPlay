/**
 * Bus Simulator - Progression System (29)
 * Player leveling, XP tracking, and unlockable content
 *
 * SKELETON - Core progression implemented, unlock tree to expand in Phase 2
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const GameConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig) ||
    (typeof require !== 'undefined' ? require('../config/GameConfig') : null);
  const EconomyConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EconomyConfig) ||
    (typeof require !== 'undefined' ? require('../data/economy') : null);
  const BusTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.BusTypes) || null;

  const ProgressionSystem = {
    _levelUpgrades: [],
    _unlockedBusTypes: [],
    _unlockedRegions: [],
    _unlockedFeatures: [],

    init(modules) {
      this.modules = modules;
      this._levelUpgrades = [];
      this._unlockedBusTypes = [];
      this._unlockedRegions = [];
      this._unlockedFeatures = [];

      // Starting unlocks
      this._unlockBusType('pallevelugu');
      this._unlockBusType('express');
      this._unlockBusType('indra-ac');
      this._unlockRegion('ap');
      this._unlockRegion('tz');

      EventManager.on('levelUp', () => this._onLevelUp());
    },

    _onLevelUp() {
      const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
      if (!player) return;

      // Apply level-based unlocks
      const rewards = EconomyConfig ? EconomyConfig.revenue.levelRewards : [];
      const level = player.level;

      for (const reward of rewards) {
        if (reward.level === level) {
          for (const unlock of (reward.unlocks || [])) {
            this._applyUnlock(unlock, player);
          }
        }
      }

      // Standard unlocks by level
      if (level >= 5) this._unlockBusType('ultra-deluxe');
      if (level >= 10) this._unlockBusType('vennela');
      if (level >= 15) this._unlockBusType('amaravati');
      if (level >= 20) this._unlockBusType('super-luxury');
      if (level >= 20) this._unlockFeature('private-travels');
      if (level >= 25) this._unlockFeature('custom-livery');
      if (level >= 30) this._unlockRegion('karnataka');
      if (level >= 40) this._unlockRegion('tamil_nadu');
      if (level >= 50) this._unlockRegion('kerala');

      EventManager.emit('levelUpRewards', {
        level: level,
        upgrades: this._levelUpgrades
      });
    },

    _applyUnlock(unlockId, player) {
      if (unlockId.startsWith('bus-types.')) {
        this._unlockBusType(unlockId.replace('bus-types.', ''));
      } else if (unlockId.startsWith('regions.')) {
        this._unlockRegion(unlockId.replace('regions.', ''));
      }

      this._levelUpgrades.push(unlockId);
    },

    _unlockBusType(busTypeId) {
      if (!this._unlockedBusTypes.includes(busTypeId)) {
        this._unlockedBusTypes.push(busTypeId);
      }
    },

    _unlockRegion(regionId) {
      if (!this._unlockedRegions.includes(regionId)) {
        this._unlockedRegions.push(regionId);
      }
    },

    _unlockFeature(featureId) {
      if (!this._unlockedFeatures.includes(featureId)) {
        this._unlockedFeatures.push(featureId);
      }
    },

    getAvailableBusTypes() {
      return (BusTypes ? BusTypes.allBusTypes : []).filter(
        b => this._unlockedBusTypes.includes(b.id)
      );
    },

    getAvailableRegions() {
      return this._unlockedRegions;
    },

    getAvailableFeatures() {
      return this._unlockedFeatures;
    },

    isBusTypeUnlocked(busTypeId) {
      return this._unlockedBusTypes.includes(busTypeId);
    },

    isRegionUnlocked(regionId) {
      return this._unlockedRegions.includes(regionId);
    },

    isFeatureUnlocked(featureId) {
      return this._unlockedFeatures.includes(featureId);
    },

    getPlayerStats(player) {
      if (!player) return {};
      return {
        level: player.level,
        xp: player.xp,
        xpToNext: player.xpToNextLevel,
        xpProgress: player.xp / player.xpToNextLevel,
        money: player.money,
        totalDistance: player.totalDistance,
        totalRevenue: player.totalRevenue,
        tripsCompleted: player.tripsCompleted,
        busesOwned: player.garage ? player.garage.length : 0,
        unlockedBusTypes: this._unlockedBusTypes.length,
        unlockedRegions: this._unlockedRegions.length
      };
    },

    serialize() {
      return {
        unlockedBusTypes: this._unlockedBusTypes,
        unlockedRegions: this._unlockedRegions,
        unlockedFeatures: this._unlockedFeatures
      };
    },

    deserialize(data) {
      this._unlockedBusTypes = data.unlockedBusTypes || [];
      this._unlockedRegions = data.unlockedRegions || [];
      this._unlockedFeatures = data.unlockedFeatures || [];
    },

    destroy() {}
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.ProgressionSystem = ProgressionSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = ProgressionSystem;
  }
})();
