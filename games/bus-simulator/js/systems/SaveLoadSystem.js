/**
 * Bus Simulator - Save/Load System (27)
 * Serializes and deserializes the full game state to/from localStorage
 *
 * SKELETON - Core infrastructure implemented, integration tests pending
 */

(function () {
  'use strict';

  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const GameConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig) ||
    (typeof require !== 'undefined' ? require('../config/GameConfig') : null);
  const Player = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Player) ||
    (typeof require !== 'undefined' ? require('../entities/Player') : null);
  const GarageConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GarageConfig) || null;

  const SaveLoadSystem = {
    _saveKey: null,
    _autoSaveInterval: null,
    _lastSaveTime: 0,
    _pendingSystemData: null,

    init(modules) {
      this.modules = modules;
      this._saveKey = GameConfig ? GameConfig.save.key : 'bus_simulator_save_data';
      this._lastSaveTime = 0;

      // Auto-save timer
      const self = this;
      this._autoSaveInterval = setInterval(() => {
        self.autoSave();
      }, GameConfig ? GameConfig.save.autoSaveInterval : 15000);
    },

    /**
     * Load the player from localStorage, or create a new one.
     * @returns {Player}
     */
    loadPlayer() {
      if (typeof localStorage === 'undefined') {
        return new Player();
      }

      try {
        const saved = localStorage.getItem(this._saveKey);
        if (!saved) return new Player();

        const data = JSON.parse(saved);
        if (data.player) {
          const player = Player.deserialize(data.player);

          // Restore bus state
          if (player.garage && data.buses) {
            // Buses are already in player.garage from Player.deserialize
          }

          // Load subsystem states
          // Store for later restoration — systems may not be initialized yet
          // (loadPlayer runs during GameInitSystem.init, before GarageSystem.init).
          // restoreSystemData() is called by main.js after all systems are registered.
          if (data.systems && typeof data.systems === 'object') {
            this._pendingSystemData = data.systems;
          }

          // Phase 8: restore garage configuration
          if (data.garageConfig && GarageConfig && typeof GarageConfig.deserialize === 'function') {
            GarageConfig.deserialize(data.garageConfig);
          }

          EventManager.emit('gameLoaded', {
            player: player.serialize(),
            hasSave: true
          });

          return player;
        }

        return new Player();
      } catch (e) {
        console.warn('SaveLoadSystem: Failed to load save data:', e);
        return new Player();
      }
    },

    /**
     * Save the entire game state.
     * @param {Object} saveData - additional data to merge
     */
    saveGame(saveData) {
      if (typeof localStorage === 'undefined') return false;

      try {
        const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
        if (!player) return false;

        const saveState = {
          version: GameConfig ? GameConfig._version || '1.0.0' : '1.0.0',
          savedAt: Date.now(),
          player: player.serialize(),
          systems: this._collectSystemData(),
          // Phase 8: persist garage configuration
          garageConfig: (GarageConfig && typeof GarageConfig.serialize === 'function')
            ? GarageConfig.serialize()
            : null,
          ...(saveData || {})
        };

        localStorage.setItem(this._saveKey, JSON.stringify(saveState));
        this._lastSaveTime = Date.now();

        EventManager.emit('gameSaved', { saveState });
        return true;
      } catch (e) {
        console.warn('SaveLoadSystem: Failed to save game:', e);
        return false;
      }
    },

    autoSave() {
      if (this.modules.GameLoopSystem && this.modules.GameLoopSystem.getState()) {
        this.saveGame({ isAutoSave: true });
      }
    },

    manualSave() {
      const result = this.saveGame({ isAutoSave: false });
      if (result) {
        const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
        const toast = (typeof window !== 'undefined' && window.BusSim.Helpers && window.BusSim.Helpers.showNotification) ||
          (typeof window !== 'undefined' && window.InfinityPlay && window.InfinityPlay.Helpers && window.InfinityPlay.Helpers.showToast);
        if (toast) {
          toast('Game saved successfully!', 'success');
        }
      }
      return result;
    },

    deleteSave() {
      if (typeof localStorage === 'undefined') return false;
      try {
        localStorage.removeItem(this._saveKey);
        EventManager.emit('saveDeleted', {});
        return true;
      } catch (e) {
        return false;
      }
    },

    hasSave() {
      if (typeof localStorage === 'undefined') return false;
      return !!localStorage.getItem(this._saveKey);
    },

    _collectSystemData() {
      const data = {};
      const systemsToSerialize = [
        'DayNightSystem', 'WeatherSystem', 'RouteSystem', 'TripSystem',
        'FuelSystem', 'DamageSystem', 'MaintenanceSystem', 'GarageSystem',
        'TicketSystem', 'PassengerSystem', 'AchievementSystem',
        'ProgressionSystem', 'MissionSystem', 'NavigationSystem',
        'BoardingSystem', 'DropOffSystem'
      ];

      for (const name of systemsToSerialize) {
        const system = this.modules[name];
        if (system && typeof system.serialize === 'function') {
          data[name] = system.serialize();
        }
      }
      return data;
    },

    _restoreSystemData(data) {
      if (!data || typeof data !== 'object') return;
      if (!this.modules) return;
      const systemsToRestore = [
        'DayNightSystem', 'WeatherSystem', 'RouteSystem', 'TripSystem',
        'FuelSystem', 'DamageSystem', 'MaintenanceSystem', 'GarageSystem',
        'TicketSystem', 'PassengerSystem', 'AchievementSystem',
        'ProgressionSystem', 'MissionSystem', 'NavigationSystem',
        'BoardingSystem', 'DropOffSystem'
      ];

      for (const name of systemsToRestore) {
        const system = this.modules[name];
        if (system && typeof system.deserialize === 'function' && data[name]) {
          try {
            system.deserialize(data[name]);
          } catch (e) {
            console.warn('SaveLoadSystem: Failed to restore system ' + name + ':', e);
          }
        }
      }
    },

    /**
     * Restore system-specific saved state. Called by main.js after all
     * systems are registered and initialized, to ensure restored data is
     * not overwritten by a later init() call.
     */
    restoreSystemData() {
      if (this._pendingSystemData) {
        this._restoreSystemData(this._pendingSystemData);
        this._pendingSystemData = null;
      }
    },

    exportSave() {
      const player = this.modules.GameInitSystem ? this.modules.GameInitSystem.getPlayer() : null;
      if (!player) return null;

      const exportData = {
        version: GameConfig ? GameConfig._version || '1.0.0' : '1.0.0',
        exportedAt: Date.now(),
        player: player.serialize(),
        systems: this._collectSystemData()
      };

      return JSON.stringify(exportData, null, 2);
    },

    importSave(saveString) {
      try {
        const data = JSON.parse(saveString);
        if (!data.player) throw new Error('Invalid save format');

        const player = Player.deserialize(data.player);
        this.modules.GameInitSystem._player = player;

        if (data.systems) {
          this._restoreSystemData(data.systems);
        }

        EventManager.emit('saveImported', { success: true });
        return { success: true };
      } catch (e) {
        console.warn('SaveLoadSystem: Failed to import save:', e);
        EventManager.emit('saveImported', { success: false, error: e.message });
        return { success: false, error: e.message };
      }
    },

    destroy() {
      if (this._autoSaveInterval) {
        clearInterval(this._autoSaveInterval);
        this._autoSaveInterval = null;
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.SaveLoadSystem = SaveLoadSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = SaveLoadSystem;
  }
})();
