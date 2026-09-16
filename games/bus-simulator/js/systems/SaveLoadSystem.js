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

          // Phase 10B Task 8: re-attach transmission state to restored Bus
          // instances by id so gear/RPM survive save/load.
          const transmissionSystem = this.modules
            ? this.modules.TransmissionSystem
            : null;
          if (transmissionSystem && typeof transmissionSystem.attachTransmission === 'function') {
            if (player.garage) {
              for (const bus of player.garage) {
                transmissionSystem.attachTransmission(bus);
              }
            }
          }

          // Phase 10B Task 9: re-attach suspension state to restored Bus
          // instances by id so compression/roll/pitch survive save/load.
          const suspensionSystem = this.modules
            ? this.modules.SuspensionSystem
            : null;
          if (suspensionSystem && typeof suspensionSystem.attachSuspension === 'function') {
            if (player.garage) {
              for (const bus of player.garage) {
                suspensionSystem.attachSuspension(bus);
              }
            }
          }

          // Phase 10B Task 10: re-attach brake state to restored Bus
          // instances by id so brakeTemp/fade/ABS survive save/load.
          const brakeSystem = this.modules
            ? this.modules.BrakeSystem
            : null;
          if (brakeSystem && typeof brakeSystem.attachBrake === 'function') {
            if (player.garage) {
              for (const bus of player.garage) {
                brakeSystem.attachBrake(bus);
              }
            }
          }

          // Phase 10B Task 11: re-attach tire state to restored Bus
          // instances by id so wear/grip survive save/load.
          const tireSystem = this.modules
            ? this.modules.TireSystem
            : null;
          if (tireSystem && typeof tireSystem.attachTires === 'function') {
            if (player.garage) {
              for (const bus of player.garage) {
                tireSystem.attachTires(bus);
              }
            }
          }

          // Phase 10B Task 13: re-attach air-brake state to restored Bus
          // instances by id so reservoir pressure survives save/load.
          const airBrakeSystem = this.modules
            ? this.modules.AirBrakeSystem
            : null;
          if (airBrakeSystem && typeof airBrakeSystem.attachAir === 'function') {
            if (player.garage) {
              for (const bus of player.garage) {
                airBrakeSystem.attachAir(bus);
              }
            }
          }

          // Phase 10B Task 14: re-attach engine temperature state to
          // restored Bus instances by id so temperature/coolant survive
          // save/load.
          const engineTempSystem = this.modules
            ? this.modules.EngineTemperatureSystem
            : null;
          if (engineTempSystem && typeof engineTempSystem.attachTemp === 'function') {
            if (player.garage) {
              for (const bus of player.garage) {
                engineTempSystem.attachTemp(bus);
              }
            }
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
        'TransmissionSystem', 'SuspensionSystem', 'BrakeSystem', 'TireSystem',
        'AirBrakeSystem', 'EngineTemperatureSystem',
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
        'TransmissionSystem', 'SuspensionSystem', 'BrakeSystem', 'TireSystem',
        'TicketSystem', 'PassengerSystem', 'AchievementSystem',
        'ProgressionSystem', 'MissionSystem', 'NavigationSystem',
        'BoardingSystem', 'DropOffSystem'
      ];

      for (const name of systemsToRestore) {
        const system = this.modules[name];
        if (system && typeof system.deserialize === 'function' && data[name] && typeof data[name] === 'object') {
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
        systems: this._collectSystemData(),
        garageConfig: (GarageConfig && typeof GarageConfig.serialize === 'function')
          ? GarageConfig.serialize()
          : null
      };

      return JSON.stringify(exportData, null, 2);
    },

    importSave(saveString) {
      try {
        const data = JSON.parse(saveString);
        if (!data.player) throw new Error('Invalid save format');

        const player = Player.deserialize(data.player);

        // Set the canonical player reference (not _player, which getPlayer ignores)
        const gameInit = this.modules && this.modules.GameInitSystem;
        if (gameInit) {
          gameInit.player = player;
        }

        // Phase 8: restore garage configuration
        if (data.garageConfig && GarageConfig && typeof GarageConfig.deserialize === 'function') {
          GarageConfig.deserialize(data.garageConfig);
        }

        // Restore system-specific saved state (e.g., GarageSystem)
        if (data.systems) {
          this._restoreSystemData(data.systems);
        } else {
          // No system data — sync GarageSystem to the imported Player
          this._syncGarageSystemToPlayer();
        }

        // Phase 10A Task 7: restore garage configuration safely with a
        // fallback when the imported save has no/legacy garageConfig.
        if (data.garageConfig && GarageConfig && typeof GarageConfig.deserialize === 'function') {
          GarageConfig.deserialize(data.garageConfig);
        } else if (GarageConfig && typeof GarageConfig.init === 'function') {
          // Legacy/missing config: re-init to defaults so the garage UI has
          // a valid configuration instead of a null/undefined state.
          GarageConfig.init(this.modules);
        }

        EventManager.emit('saveImported', { success: true });
        return { success: true };
      } catch (e) {
        console.warn('SaveLoadSystem: Failed to import save:', e);
        EventManager.emit('saveImported', { success: false, error: e.message });
        return { success: false, error: e.message };
      }
    },

    /**
     * Ensures GarageSystem references the current Player's garage.
     * Called when no explicit system save data is available.
     */
    _syncGarageSystemToPlayer() {
      const gameInit = this.modules && this.modules.GameInitSystem;
      const garageSystem = this.modules && this.modules.GarageSystem;
      if (!gameInit || !garageSystem) return;

      const player = gameInit.getPlayer();
      if (!player) return;

      garageSystem._garage = player.garage;
      garageSystem._activeBusId = player.activeBusId ||
        (player.garage[0] ? player.garage[0].id : null);
      garageSystem._garageSlots = player.garageSlots || 5;
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
