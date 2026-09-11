/**
 * Bus Simulator - Main Entry Point
 * Bootstraps the game engine, registers all systems, and starts the game loop
 */

(function () {
  'use strict';

  const GameEngine = window.BusSim.GameEngine;
  const EventManager = window.BusSim.EventManager;
  const InputManager = window.BusSim.InputManager;
  const Renderer = window.BusSim.Renderer;
  const GameConfig = window.BusSim.GameConfig;
  const AssetLoader = window.BusSim.AssetLoader;

  // Core Systems
  const GameInitSystem = window.BusSim.GameInitSystem;
  const GameLoopSystem = window.BusSim.GameLoopSystem;
  const InputSystem = window.BusSim.InputSystem;
  const MovementSystem = window.BusSim.MovementSystem;
  const CameraSystem = window.BusSim.CameraSystem;
  const CollisionSystem = window.BusSim.CollisionSystem;
  const RoadSystem = window.BusSim.RoadSystem;
  const DayNightSystem = window.BusSim.DayNightSystem;
  const TrafficSystem = window.BusSim.TrafficSystem;
  const AIVehicleSystem = window.BusSim.AIVehicleSystem;

  // Gameplay Systems
  const PassengerSystem = window.BusSim.PassengerSystem;
  const BusStopSystem = window.BusSim.BusStopSystem;
  const BoardingSystem = window.BusSim.BoardingSystem;
  const DropOffSystem = window.BusSim.DropOffSystem;
  const TicketSystem = window.BusSim.TicketSystem;
  const RouteSystem = window.BusSim.RouteSystem;
  const TripSystem = window.BusSim.TripSystem;
  const OperatorSystem = window.BusSim.OperatorSystem;
  const GarageConfig = window.BusSim.GarageConfig;
  const GarageSystem = window.BusSim.GarageSystem;
  const SaveLoadSystem = window.BusSim.SaveLoadSystem;

  // UI
  const UIManager = window.BusSim.UIManager;
  const HUD = window.BusSim.HUD;
  const MenuSystem = window.BusSim.MenuSystem;

  let canvas, uiCanvas, renderer, engine;

  const busSim = {
    init() {
      this._setupCanvases();

      // Initialize renderer
      renderer = Renderer;
      renderer.init(canvas, GameConfig.canvas.width, GameConfig.canvas.height);

      // Initialize engine
      engine = GameEngine;
      engine.init(GameConfig, () => {
        this._registerModules();
        this._registerSystems();
        this._restoreSystemData();
        this._setupEventHandlers();
      });

      this._start();
    },

    _setupCanvases() {
      if (typeof document !== 'undefined') {
        canvas = document.getElementById('game-canvas');
        uiCanvas = document.getElementById('ui-canvas');

        if (canvas) {
          canvas.width = GameConfig.canvas.width;
          canvas.height = GameConfig.canvas.height;
        }
        if (uiCanvas) {
          uiCanvas.width = GameConfig.canvas.width;
          uiCanvas.height = GameConfig.canvas.height;
        }
      }
    },

    _registerModules() {
      engine.registerModule('EventManager', EventManager);
      engine.registerModule('InputManager', InputManager);
      engine.registerModule('Renderer', renderer);
      engine.registerModule('GameEngine', engine);
      engine.registerModule('GameConfig', GameConfig);
      engine.registerModule('AssetLoader', AssetLoader);
    },

  _registerSystems() {
      // Core systems (ordered by dependency for init)
      const coreSystems = [
        ['GameLoopSystem', GameLoopSystem],
        ['SaveLoadSystem', SaveLoadSystem],
        ['GarageConfig', GarageConfig],
        ['GameInitSystem', GameInitSystem],
        ['GarageSystem', GarageSystem],
        ['InputSystem', InputSystem],
        ['MovementSystem', MovementSystem],
        ['CameraSystem', CameraSystem],
        ['CollisionSystem', CollisionSystem],
        ['RoadSystem', RoadSystem],
        ['DayNightSystem', DayNightSystem],
        ['TrafficSystem', TrafficSystem],
        ['AIVehicleSystem', AIVehicleSystem],
        ['RouteSystem', RouteSystem],
        ['PassengerSystem', PassengerSystem],
        ['BusStopSystem', BusStopSystem],
        ['BoardingSystem', BoardingSystem],
        ['DropOffSystem', DropOffSystem],
        ['TicketSystem', TicketSystem],
        ['TripSystem', TripSystem],
        ['OperatorSystem', OperatorSystem],
        ['UIManager', UIManager]
      ];

      for (const [name, system] of coreSystems) {
        engine.registerSystem(name, system);
        engine.registerModule(name, system);
      }

      // UI systems
      HUD.setCanvas(uiCanvas);
      engine.registerSystem('HUD', HUD);
      engine.registerModule('HUD', HUD);
      engine.registerSystem('MenuSystem', MenuSystem);
      engine.registerModule('MenuSystem', MenuSystem);

      // Register UI modules with UIManager
      if (UIManager && typeof UIManager.registerUI === 'function') {
        UIManager.registerUI('hud', HUD);
        UIManager.registerUI('menu', MenuSystem);
      }

      // Subscribe to render event
      engine.on('render', (alpha) => this._render(alpha));
    },

    _restoreSystemData() {
      if (SaveLoadSystem && typeof SaveLoadSystem.restoreSystemData === 'function') {
        SaveLoadSystem.restoreSystemData();
      }
    },

    _setupEventHandlers() {
      // Listen for bus selection (ensures active bus is synced before startGame)
      EventManager.on('selectBus', (data) => {
        if (data && data.bus && data.bus.id) {
          const init = engine.getSystem('GameInitSystem');
          if (init && init.getPlayer()) {
            init.getPlayer().activeBusId = data.bus.id;
          }
        }
      });

      // Listen for main menu "Start Driving" action
      EventManager.on('startGame', () => {
        const loop = engine.getSystem('GameLoopSystem');
        if (loop) loop.setState(GameConfig.states.PLAYING);
        engine.resume();
        if (MenuSystem) MenuSystem.hide();
      });

      // Listen for quit to platform
      EventManager.on('quitToPlatform', () => {
        this._quitToPlatform();
      });

      // Listen for pause toggle
      EventManager.on('togglePause', () => {
        const loop = engine.getSystem('GameLoopSystem');
        if (!loop) return;
        if (loop.getState() === GameConfig.states.PLAYING) {
          loop.setState(GameConfig.states.PAUSED);
          engine.pause();
          if (MenuSystem) MenuSystem.showMenu('pause');
        } else if (loop.getState() === GameConfig.states.PAUSED) {
          loop.setState(GameConfig.states.PLAYING);
          engine.resume();
          if (MenuSystem) MenuSystem.hide();
        }
      });

      // Window-level keydown for pause (works even when engine is paused)
      window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyP') {
          e.preventDefault();
          EventManager.emit('togglePause');
        }
      });
    },

    _start() {
      // Show loading screen
      this._showLoading();

      // Load assets (currently none, but structure is in place)
      AssetLoader.loadQueue([]).then(() => {
        // Initialize game state
        const loop = engine.getSystem('GameLoopSystem');
        if (loop) {
          loop.setState(GameConfig.states.MENU);
        }
        engine.start();

        // Show main menu
        setTimeout(() => {
          this._hideLoading();
          if (MenuSystem) MenuSystem.showMenu('main');
        }, 300);

        EventManager.emit('gameReady', {});
      }).catch((err) => {
        console.error('Bus Simulator: Asset loading failed:', err);
        this._hideLoading();
        this._showError('Failed to load game assets. Please refresh the page.');
      });
    },

    _showLoading() {
      if (typeof document !== 'undefined') {
        const loading = document.getElementById('busLoadingScreen');
        if (loading) loading.style.display = 'flex';
      }
    },

    _hideLoading() {
      if (typeof document !== 'undefined') {
        const loading = document.getElementById('busLoadingScreen');
        if (loading) loading.style.display = 'none';
      }
    },

    _showError(message) {
      if (typeof document !== 'undefined') {
        const overlay = document.getElementById('bus-ui-overlay');
        if (overlay) {
          overlay.innerHTML = `
            <div class="bus-error" style="position:fixed;inset:0;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;z-index:2000;">
              <div style="text-align:center;color:#ef4444;padding:40px;">
                <div style="font-size:2rem;font-weight:800;margin-bottom:10px;">⚠ Game Error</div>
                <div style="font-size:0.9rem;color:#cbd5e1;">${message}</div>
              </div>
            </div>
          `;
        }
      }
    },

    _quitToPlatform() {
      if (typeof window !== 'undefined') {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'busSimExit' }, '*');
        }
      }
    },

    _render(alpha) {
      const loop = engine.getSystem('GameLoopSystem');
      if (!loop) return;

      const state = loop.getState();

      if (state === GameConfig.states.PLAYING || state === GameConfig.states.PAUSED) {
        this._renderWorld();
      }

      // Clear UI canvas for fresh HUD/render
      if (uiCanvas && uiCanvas.width) {
        const uiCtx = uiCanvas.getContext('2d');
        uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
      }

      // Render UI (HUD + overlays)
      if (UIManager && typeof UIManager.render === 'function') {
        UIManager.render(0);
      }
    },

    _renderWorld() {
      renderer.clear();

      // Sky background
      const dayNight = engine.getSystem('DayNightSystem');
      const skyColor = dayNight ? dayNight.getSkyColor() : null;
      if (skyColor && skyColor.top) {
        const ctx = renderer.context;
        const gradient = ctx.createLinearGradient(0, 0, 0, renderer.height);
        gradient.addColorStop(0, skyColor.top);
        gradient.addColorStop(1, skyColor.bottom);
        renderer.fillRect(0, 0, renderer.width, renderer.height, gradient);
      } else {
        renderer.clearRect(8, 12, 35, 1);
      }

      // Get camera and apply
      const camera = CameraSystem.getCameraObject();
      renderer.setCamera(camera.x, camera.y, camera.zoom);

      // Draw map (environment + roads)
      const gameMap = engine.getModule('Map');
      if (gameMap && typeof gameMap.draw === 'function') {
        gameMap.draw(renderer, camera);
      }

      // Draw bus stops
      const busStopSystem = engine.getSystem('BusStopSystem') || (engine.getModule('Map') ? null : null);
      if (engine.getModule('Map') && engine.getModule('Map').allBusStops) {
        const map = engine.getModule('Map');
        for (let i = 0; i < map.allBusStops.length; i++) {
          if (map.allBusStops[i].draw) {
            map.allBusStops[i].draw(renderer, camera);
          }
        }
      }

      // Draw the active bus (player's bus)
      const activeBus = GameInitSystem.getActiveBus();
      if (activeBus) {
        activeBus.draw(renderer, camera);
      }

      // Draw AI traffic vehicles
      if (engine) {
        const trafficSystem = engine.getSystem('TrafficSystem');
        if (trafficSystem && typeof trafficSystem.draw === 'function') {
          trafficSystem.draw(renderer, camera);
        }
        const aiVehicleSystem = engine.getSystem('AIVehicleSystem');
        if (aiVehicleSystem && typeof aiVehicleSystem.draw === 'function') {
          aiVehicleSystem.draw(renderer, camera);
        }
      }

      // Reset transform for UI overlays
      renderer.resetTransform();

      // Collision debug
      const collisionSystem = engine.getSystem('CollisionSystem');
      if (collisionSystem && typeof collisionSystem.debugDraw === 'function') {
        collisionSystem.debugDraw(renderer, camera);
      }
    },

    restart() {
      window.location.reload();
    }
  };

  // PostMessage bridge for parent frame communication
  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'busSimInit') {
      busSim.init();
    }
  });

  if (typeof window !== 'undefined') {
    window.BusSim = window.BusSim || {};
    window.BusSim.busSim = busSim;

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => busSim.init());
    } else {
      busSim.init();
    }
  }
})();
