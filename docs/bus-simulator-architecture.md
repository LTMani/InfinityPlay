# Bus Simulator — Architecture Proposal

> **Game:** South Indian Bus Simulator (Andhra Pradesh & Telangana)
> **Target Platform:** InfinityPlay gaming portal (HTML5/CSS3/Vanilla JS)

---

## 1. Existing Platform Analysis

### 1.1 Frontend Architecture
- **Pure HTML5/CSS3/Vanilla JS** — zero external frameworks (README confirms "100% Zero Frameworks")
- **Module pattern:** IIFE wrappers `(function() { ... })()` that attach to the `window.InfinityPlay` namespace object
- **Data-driven:** All games defined in `js/data/games-data.js`; backend mirrors in `server/data/store.js`
- **Three-tier structure:** `js/utils/` (helpers, storage, api) → `js/data/` (static datasets) → `js/components/` + `js/features/` (UI logic) → `js/app.js` (orchestrator)
- **CSS:** 12 files in `css/` using CSS custom properties (`--color-*`, `--gradient-*`, `--glow-*`) for theming
- **Persistence:** `localStorage` fallback when Node.js server is offline (api.js checks both)

### 1.2 Backend Architecture
- **Node.js native HTTP server** (`server/server.js`) — zero npm dependencies
- **REST API** via `server/routes/api.js` with CORS headers
- **Data store** (`server/data/store.js`) — in-memory arrays for games, categories, leaderboard, users, achievements, settings
- **Static file serving** from project root with path-traversal protection
- **API contract:** `{ data }` or `{ success, error }` JSON responses

### 1.3 Game Integration Mechanism
- Games are registered in `games-data.js` with an `id` (e.g., `bus-simulator`)
- `app.js → launchGameModal(gameId)` finds the game object, renders a modal with description + "Play Now" button
- README Game Integration Guide: add `gameUrl` to game object, embed an `<iframe>` or canvas inside `#gameModalBody`
- Backend store has the same games list in `server/data/store.js`

### 1.4 Reusable Existing Components
| Component | Location | Reusable For |
|-----------|----------|-------------|
| Toast notifications | `js/utils/helpers.js` → `showToast()` | Game event notifications |
| localStorage Storage | `js/utils/storage.js` | Game save/load |
| API client | `js/utils/api.js` | Platform communication from game |
| Helpers | `js/utils/helpers.js` → `formatNumber`, `formatXP` | In-game economy display |

---

## 2. Bus Simulator Architecture

### 2.1 Folder Structure

```
InfinityPlay/
├── games/
│   └── bus-simulator/                  # Game root
│       ├── index.html                  # Game entry point
│       ├── css/
│       │   └── game-ui.css             # Game UI styling (Canvas overlay)
│       ├── js/
│       │   ├── config/
│       │   │   ├── GameConfig.js       # Master configuration constants
│       │   │   ├── ControlsConfig.js   # Keyboard mappings
│       │   │   └── CustomizationPresets.js
│       │   ├── data/
│       │   │   ├── regions.js          # AP & TZ city/region data
│       │   │   ├── bus-types.js        # RTC categories + private buses
│       │   │   ├── routes.js           # Route definitions between cities
│       │   │   ├── private-travels.js  # Player-owned travel companies
│       │   │   ├── customization.js    # Livery/paint/seat options
│       │   │   ├── economy.js          # Pricing & economy tunables
│       │   │   └── achievements.js     # Bus-specific achievements
│       │   ├── engine/
│       │   │   ├── GameEngine.js       # Main loop, state machine, module registry
│       │   │   ├── EventManager.js     # Pub/sub event system
│       │   │   ├── Renderer.js         # Canvas abstraction (draw, clear)
│       │   │   ├── InputManager.js     # Keyboard/mouse input processing
│       │   │   └── AssetLoader.js      # Preload/cache assets
│       │   ├── world/
│       │   │   ├── Map.js              # World map, region navigation
│       │   │   ├── Region.js           # Region data (cities, roads, connections)
│       │   │   ├── Road.js             # Road segment/path data
│       │   │   ├── City.js             # City/town definition
│       │   │   ├── BusStop.js          # Bus stop with passenger queue
│       │   │   ├── TollGate.js         # Toll collection point
│       │   │   ├── FuelStation.js      # Refueling point
│       │   │   ├── Depot.js            # Bus depot/garage
│       │   │   └── WorldGenerator.js   # Procedural road/city placement
│       │   ├── entities/
│       │   │   ├── Entity.js           # Base entity (position, velocity)
│       │   │   ├── Bus.js              # Player bus with all subsystems
│       │   │   ├── Vehicle.js          # Base vehicle class (shared by AI)
│       │   │   ├── TrafficVehicle.js   # AI traffic vehicle
│       │   │   ├── Passenger.js        # Individual passenger entity
│       │   │   └── Player.js           # Player profile (owned buses, money)
│       │   ├── systems/
│       │   │   ├── GameInitSystem.js    # (1) Game initialization
│       │   │   ├── GameLoopSystem.js    # (2) Main loop coordinator
│       │   │   ├── InputSystem.js       # (3) Player input
│       │   │   ├── MovementSystem.js    # (4) Bus movement
│       │   │   ├── AccelerationSystem.js # (5) Acceleration
│       │   │   ├── BrakingSystem.js     # (6) Braking
│       │   │   ├── SteeringSystem.js    # (7) Steering
│       │   │   ├── CameraSystem.js      # (8) Camera follow
│       │   │   ├── TrafficSystem.js     # (9) Traffic management
│       │   │   ├── AIVehicleSystem.js   # (10) AI vehicle behavior
│       │   │   ├── RoadSystem.js        # (11) Road rendering & logic
│       │   │   ├── RouteSystem.js       # (12) Route management
│       │   │   ├── BusStopSystem.js     # (13) Bus stop logic
│       │   │   ├── PassengerSystem.js   # (14) Passenger management
│       │   │   ├── BoardingSystem.js    # (15) Passenger boarding
│       │   │   ├── DropOffSystem.js     # (16) Passenger drop-off
│       │   │   ├── TicketSystem.js      # (17) Ticketing
│       │   │   ├── TripSystem.js        # (18) Trip tracking
│       │   │   ├── MissionSystem.js     # (19) Missions & objectives
│       │   │   ├── NavigationSystem.js  # (20) Turn-by-turn navigation
│       │   │   ├── DayNightSystem.js    # (21) Day/night cycle
│       │   │   ├── WeatherSystem.js     # (22) Weather effects
│       │   │   ├── FuelSystem.js        # (23) Fuel management
│       │   │   ├── DamageSystem.js      # (24) Bus damage
│       │   │   ├── MaintenanceSystem.js # (25) Maintenance scheduling
│       │   │   ├── GarageSystem.js      # (26) Garage/fleet management
│       │   │   ├── SaveLoadSystem.js    # (27) Save & load
│       │   │   ├── AchievementSystem.js # (28) Achievements
│       │   │   └── ProgressionSystem.js  # (29) Player progression
│       │   ├── ui/
│       │   │   ├── UIManager.js         # UI rendering coordinator
│       │   │   ├── HUD.js               # In-game heads-up display
│       │   │   ├── MenuSystem.js        # Main menu / pause
│       │   │   ├── GarageUI.js         # Garage fleet management UI
│       │   │   ├── CustomizationUI.js   # Bus customization UI
│       │   │   ├── MissionUI.js        # Mission log UI
│       │   │   └── EconomyUI.js        # Finance/economy UI
│       │   └── main.js                  # Game bootstrap
│       └── assets/
│           └── (JSON-based sprite definitions, drawn via Canvas)
```

### 2.2 Module Architecture

```
main.js (entry)
  │
  ├── config/GameConfig + ControlsConfig
  ├── engine/[GameEngine | EventManager | Renderer | InputManager | AssetLoader]
  │     │
  │     └── GameEngine registers & coordinates all systems/
  │
  ├── data/[regions | bus-types | routes | ... ]  (static, config-driven)
  │
  ├── world/[Map | Region | Road | City | BusStop | ...]
  │     │
  │     └── Region references roads, cities, stops, POIs
  │
  ├── entities/[Entity | Bus | Vehicle | TrafficVehicle | Passenger | Player]
  │     │
  │     └── Bus aggregates: AccelerationSystem, BrakingSystem,
  │         SteeringSystem, FuelSystem, DamageSystem, MaintenanceSystem
  │
  ├── systems/[1-29 as listed above]
  │     │
  │     ├── Engine-level (GameState, Input, Movement, Camera, AI)
  │     ├── World-level (Road, Traffic, Regions)
  │     ├── Economy-level (Tickets, Trips, Fuel, Maintenance, Garage)
  │     └── Integration-level (SaveLoad, Achievements, Progression)
  │
  ├── ui/[UIManager | HUD | MenuSystem | GarageUI | CustomizationUI | ...]
  │
  └── data/economy.js ← referenced by TripSystem, FuelSystem, MaintenanceSystem
```

**Design principles:**
- Each system is a standalone module with `init()`, `update(dt)`, and `destroy()` lifecycle hooks
- Systems communicate via `EventManager` pub/sub (loose coupling)
- Entities use composition over inheritance — a `Bus` aggregates subsystems
- All data (bus types, regions, routes, economy multipliers) is config-driven in `data/` for easy tuning

### 2.3 System Dependency Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    GameEngine (main loop)                    │
└──────────┬─────────────────────────────────────────┬────────┘
           │                                         │
           ▼                                         ▼
┌──────────────────┐                       ┌────────────────────┐
│   EventManager    │◄── pub/sub ───────────┤   GameLoopSystem   │
│ (loose coupling)  │                       └────────────────────┘
└────────┬──────────┘
         │
         ├──────────────────────────────────────────────────┐
         │                                                  │
         ▼                                                  ▼
┌────────────────────┐                              ┌──────────────────┐
│   InputSystem      │ ◄── player input             │  CameraSystem    │
│ (Keyboard/Mouse)   │                              │ (follow cam)     │
└────────┬───────────┘                              └────────┬───────────┘
         │                                                     │
         ▼                                                     ▼
┌────────────────────┐                              ┌──────────────────┐
│ MovementSystem     │── aggregates ──►             │  Renderer        │
│  ├── Acceleration   │                              │ (Canvas draw)    │
│  ├── Braking        │                              └────────┬─────────┘
│  └── Steering       │                                       │
└────────┬───────────┘                                       ▼
         │                                         ┌──────────────────┐
         ▼                                         │   HUD / UIManager│
┌────────────────────┐                              └──────────────────┘
│    Bus (entity)     │
│  ├── FuelSystem      │
│  ├── DamageSystem    │
│  └── MaintenanceSys  │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐     ┌────────────────────┐
│   TrafficSystem    │     │   World (Map/Region)│
│   AIVehicleSystem  │◄───►│   RoadSystem       │
└────────┬───────────┘     └────────┬───────────┘
         │                          │
         ▼                          ▼
┌────────────────────┐     ┌────────────────────┐
│ BusStopSystem      │◄───►│ RouteSystem         │
└────────┬───────────┘     └────────┬───────────┘
         │                          │
         ▼                          ▼
┌────────────────────┐     ┌────────────────────┐
│ PassengerSystem    │     │ NavigationSystem    │
│ BoardingSystem     │     │ MissionSystem       │
│ DropOffSystem      │     │ TripSystem          │
│ TicketSystem       │     │ DayNightSystem      │
│ WeatherSystem      │     │ GarageSystem        │
│ SaveLoadSystem     │     │ AchievementSystem   │
│ ProgressionSystem  │     │ EconomySystem       │
└────────────────────┘     └────────────────────┘
```

### 2.4 Integration Plan

1. **Data layer:** Add `gameUrl: 'games/bus-simulator/index.html'` and `playMode: 'iframe'` to the `bus-simulator` entry in `games-data.js` and `server/data/store.js`
2. **Launch logic:** Modify `launchGameModal()` in `js/app.js` to detect `gameUrl` and embed an iframe instead of the description modal
3. **Platform bridge:** The game posts messages to `window.parent` to record: recently-played, achievements unlocked, session scores
4. **Server API:** Add `/api/games/bus-simulator` support and optional `/api/game-progress` endpoint for game save data
5. **CSS:** Add `css/bus-game-integration.css` for the iframe container styling

### 2.5 Development Phases

| Phase | Scope | Key Deliverables |
|-------|-------|-----------------|
| **Phase 0** | Architecture | This proposal document |
| **Phase 1** | Foundation | Engine, config, data, entities, basic world, playable bus movement |
| **Phase 2** | World & Traffic | Region system, roads, traffic AI, day/night cycle |
| **Phase 3** | Gameplay Loop | Routes, bus stops, passengers, tickets, economy |
| **Phase 4** | Management | Garage, customization, progression, achievements |
| **Phase 5** | Polish | Weather, missions, save/load, InfinityPlay integration |

### 2.6 Files to Create

**New files (game core):**
- `games/bus-simulator/index.html`
- `games/bus-simulator/css/game-ui.css`
- `games/bus-simulator/js/main.js`
- `games/bus-simulator/js/config/GameConfig.js`
- `games/bus-simulator/js/config/ControlsConfig.js`
- `games/bus-simulator/js/config/CustomizationPresets.js`
- `games/bus-simulator/js/data/regions.js`
- `games/bus-simulator/js/data/bus-types.js`
- `games/bus-simulator/js/data/routes.js`
- `games/bus-simulator/js/data/private-travels.js`
- `games/bus-simulator/js/data/customization.js`
- `games/bus-simulator/js/data/economy.js`
- `games/bus-simulator/js/data/achievements.js`
- `games/bus-simulator/js/engine/GameEngine.js`
- `games/bus-simulator/js/engine/EventManager.js`
- `games/bus-simulator/js/engine/Renderer.js`
- `games/bus-simulator/js/engine/InputManager.js`
- `games/bus-simulator/js/engine/AssetLoader.js`
- `games/bus-simulator/js/world/Map.js`
- `games/bus-simulator/js/world/Region.js`
- `games/bus-simulator/js/world/Road.js`
- `games/bus-simulator/js/world/City.js`
- `games/bus-simulator/js/world/BusStop.js`
- `games/bus-simulator/js/world/TollGate.js`
- `games/bus-simulator/js/world/FuelStation.js`
- `games/bus-simulator/js/world/Depot.js`
- `games/bus-simulator/js/world/WorldGenerator.js`
- `games/bus-simulator/js/entities/Entity.js`
- `games/bus-simulator/js/entities/Bus.js`
- `games/bus-simulator/js/entities/Vehicle.js`
- `games/bus-simulator/js/entities/TrafficVehicle.js`
- `games/bus-simulator/js/entities/Passenger.js`
- `games/bus-simulator/js/entities/Player.js`
- `games/bus-simulator/js/systems/GameInitSystem.js`
- `games/bus-simulator/js/systems/GameLoopSystem.js`
- `games/bus-simulator/js/systems/InputSystem.js`
- `games/bus-simulator/js/systems/MovementSystem.js`
- `games/bus-simulator/js/systems/AccelerationSystem.js`
- `games/bus-simulator/js/systems/BrakingSystem.js`
- `games/bus-simulator/js/systems/SteeringSystem.js`
- `games/bus-simulator/js/systems/CameraSystem.js`
- `games/bus-simulator/js/systems/TrafficSystem.js`
- `games/bus-simulator/js/systems/AIVehicleSystem.js`
- `games/bus-simulator/js/systems/RoadSystem.js`
- `games/bus-simulator/js/systems/RouteSystem.js`
- `games/bus-simulator/js/systems/BusStopSystem.js`
- `games/bus-simulator/js/systems/PassengerSystem.js`
- `games/bus-simulator/js/systems/BoardingSystem.js`
- `games/bus-simulator/js/systems/DropOffSystem.js`
- `games/bus-simulator/js/systems/TicketSystem.js`
- `games/bus-simulator/js/systems/TripSystem.js`
- `games/bus-simulator/js/systems/MissionSystem.js`
- `games/bus-simulator/js/systems/NavigationSystem.js`
- `games/bus-simulator/js/systems/DayNightSystem.js`
- `games/bus-simulator/js/systems/WeatherSystem.js`
- `games/bus-simulator/js/systems/FuelSystem.js`
- `games/bus-simulator/js/systems/DamageSystem.js`
- `games/bus-simulator/js/systems/MaintenanceSystem.js`
- `games/bus-simulator/js/systems/GarageSystem.js`
- `games/bus-simulator/js/systems/SaveLoadSystem.js`
- `games/bus-simulator/js/systems/AchievementSystem.js`
- `games/bus-simulator/js/systems/ProgressionSystem.js`
- `games/bus-simulator/js/ui/UIManager.js`
- `games/bus-simulator/js/ui/HUD.js`
- `games/bus-simulator/js/ui/MenuSystem.js`
- `games/bus-simulator/js/ui/GarageUI.js`
- `games/bus-simulator/js/ui/CustomizationUI.js`
- `games/bus-simulator/js/ui/MissionUI.js`
- `games/bus-simulator/js/ui/EconomyUI.js`

**Files to modify (integration):**
- `js/data/games-data.js` — add `gameUrl` + `playMode` to bus-simulator entry
- `server/data/store.js` — add `gameUrl` + `playMode` to bus-simulator entry
- `js/app.js` — update `launchGameModal()` to embed iframe when `gameUrl` present
- `index.html` — add CSS link for game integration styles

---

## Technology Decision: Canvas 2D

Since the platform mandates **zero external frameworks** and must **run locally**, the game is built with the **HTML5 Canvas 2D API** (`context` drawing methods). All buses, vehicles, roads, passengers, and UI are rendered via Canvas primitives (paths, rectangles, text, gradients). No image assets or paid services are required. The game also communicates with the parent InfinityPlay frame via `window.postMessage` for save/score/ achievement integration.
