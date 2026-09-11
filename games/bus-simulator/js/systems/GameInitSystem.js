/**
 * Bus Simulator - Game Init System (1)
 * Initializes the game world, entities, and all subsystems
 */

(function () {
  'use strict';

  const GameConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GameConfig) ||
    (typeof require !== 'undefined' ? require('../config/GameConfig') : null);
  const EventManager = (typeof window !== 'undefined' && window.BusSim && window.BusSim.EventManager) ||
    (typeof require !== 'undefined' ? require('../engine/EventManager') : null);
  const WorldGenerator = (typeof window !== 'undefined' && window.BusSim && window.BusSim.WorldGenerator) ||
    (typeof require !== 'undefined' ? require('../world/WorldGenerator') : null);
  const Map = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Map) ||
    (typeof require !== 'undefined' ? require('../world/Map') : null);
  const Bus = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Bus) ||
    (typeof require !== 'undefined' ? require('../entities/Bus') : null);
  const Player = (typeof window !== 'undefined' && window.BusSim && window.BusSim.Player) ||
    (typeof require !== 'undefined' ? require('../entities/Player') : null);
  const SaveLoadSystem = (typeof window !== 'undefined' && window.BusSim && window.BusSim.SaveLoadSystem) || null;
  const PrivateTravelsData = (typeof window !== 'undefined' && window.BusSim && window.BusSim.PrivateTravelsData) || null;
  const BusTypes = (typeof window !== 'undefined' && window.BusSim && window.BusSim.BusTypes) || null;
  const GarageConfig = (typeof window !== 'undefined' && window.BusSim && window.BusSim.GarageConfig) || null;

  const GameInitSystem = {
    _initialized: false,

     init(modules) {
      this.engine = modules.GameEngine;
      this.modules = modules;

      const config = GameConfig;

      // Create game map (use prototype world for playable demo)
      this.gameMap = new Map();
      this.gameMap.initialize();
      modules.Map = this.gameMap;

      // Load or create player
      this.player = SaveLoadSystem
        ? SaveLoadSystem.loadPlayer()
        : new Player();

      if (!this.player.level) this.player.level = 1;

      // Create starting fleet
      if (!this.player.garage || this.player.garage.length === 0) {
        const config = GarageConfig ? GarageConfig.getConfig() : null;
        const cfg = config || { busTypeId: 'pallevelugu', operatorId: null, serviceType: 'local', busNumber: null, destinationBoard: null, customization: null };
        const starterBusType = BusTypes ? BusTypes.getById(cfg.busTypeId) : null;

        if (Bus) {
          const spawnPos = this.gameMap.spawnPosition ||
            (this.gameMap.allCities[0] || { x: 0, y: 0 });

          // Phase 8: create the bus from the active garage configuration
          const bus = this._createConfiguredBus(spawnPos.x, spawnPos.y, cfg, starterBusType);
          bus.angle = -Math.PI / 2; // face up (north) at spawn
          this.player.garage.push(bus);
          this.player.activeBusId = bus.id;

          // Initialize bus state
          bus.fuelLevel = Math.min(bus.fuelCapacity, bus.fuelCapacity * 0.75);
        }
      }

      // Initialize company if not set
      if (!this.player.company) {
        this.player.company = PrivateTravelsData
          ? JSON.parse(JSON.stringify(PrivateTravelsData.defaultCompany))
          : { name: 'My Bus Company', reputation: 50, level: 1 };
      }

      this._initialized = true;

      EventManager.emit('gameInitialized', {
        player: this.player.serialize(),
        map: this.gameMap
      });

      return this;
    },

    getPlayer() {
      return this.player;
    },

    getGameMap() {
      return this.gameMap;
    },

    getActiveBus() {
      return this.player ? this.player.getActiveBus() : null;
    },

    isInitialized() {
      return this._initialized;
    },

    destroy() {
      this._initialized = false;
    },

    /**
     * Phase 8: Creates a Bus entity from a garage configuration.
     * Falls back to safe defaults if no configuration is provided.
     */
    _createConfiguredBus(x, y, cfg, starterBusType) {
      const safeCfg = cfg || { busTypeId: 'pallevelugu', operatorId: null, serviceType: 'local', busNumber: null, destinationBoard: null, customization: null };
      const busTypeId = safeCfg.busTypeId || 'pallevelugu';
      const operatorId = safeCfg.operatorId || (starterBusType ? starterBusType.operatorId : null);
      const serviceType = safeCfg.serviceType || (starterBusType ? starterBusType.serviceType : 'local');
      const bus = new Bus(x, y, busTypeId, operatorId, serviceType, safeCfg.busNumber, safeCfg.destinationBoard, safeCfg.customization);

      if (starterBusType) {
        bus.color = starterBusType.livery ? starterBusType.livery.color : bus.color;
        bus.DispatchColor = starterBusType.livery ? starterBusType.livery.color : '#f59e0b';
      }
      return bus;
    },

    update(dt) {
      if (this.gameMap) this.gameMap.update(dt);
    }
  };

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.GameInitSystem = GameInitSystem;
  }
  if (typeof module !== 'undefined') {
    module.exports = GameInitSystem;
  }
})();
