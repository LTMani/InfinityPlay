# CITY DRIVE — Phase 2: AI Traffic, Missions & Day/Night Atmosphere

**City Drive** is an original 3D browser-based city driving game built from scratch using **Three.js** and vanilla modern JavaScript (ES6+). It delivers an arcade driving experience with realistic vehicle physics, autonomous AI traffic simulation, checkpoint sprint and taxi courier missions, dynamic day/sunset/night atmospheric cycles with functional vehicle headlights, vehicle garage customization, audio synthesis, and full support for both desktop keyboard and mobile multitouch controls.

---

## What's New in Phase 2

### 1. Autonomous AI Traffic Simulation (`TrafficManager.js`, `TrafficVehicle.js`)
- **Multi-Class Vehicle Fleet**:
  - **Sedans**: Sleek passenger cars in diverse factory colors (red, blue, emerald, purple, silver, onyx).
  - **Yellow Taxis**: Iconic urban cabs with illuminated rooftop TAXI beacons and side checkerboard styling.
  - **Delivery Vans**: Commercial cargo transports with high-clearance box bodies.
- **Autonomous Driving AI**:
  - Lane following and lane centering across all 4 highway lanes.
  - Forward radar scanning detecting obstacles and leading cars to avoid rear-end collisions.
  - Smart autonomous lane-changing: scans adjacent lanes when obstructed, indicates with flashing turn signals, and executes smooth lane transitions.
  - Dynamic brake lights: illuminate brightly whenever an AI car decelerates.
  - Seamless recycling: vehicles ahead and behind are dynamically recycled to maintain optimal 60 FPS performance without memory leaks.

### 2. Objectives & Mission System (`MissionManager.js`)
- **Three Playable Mission Modes**:
  1. **Time Attack Checkpoint Sprint**: Race through glowing 3D holographic arches before time runs out. Each cleared checkpoint adds **+15 seconds** and **+250 points**.
  2. **City Courier / Taxi Fares**: Pick up passengers at roadside waypoints and deliver them to destinations within the target time limit, earning cash fares and bonus points.
  3. **Free Cruise**: Endless highway driving with high-score tracking and close near-miss combo streaks.
- **Near-Miss Scoring Engine**: Skimming past AI traffic at high speed (> 50 km/h) with under 2.2m clearance triggers a **"⚡ NEAR MISS! +50 PTS"** combo banner.
- **3D Animated Holographic Checkpoint Arches**: Majestic glowing arches with beacon orbs and floating energy curtains spanning the highway.
- **Mission Summary Reports**: Displays final score, checkpoints cleared, near misses, and distance traveled with replay options.

### 3. Dynamic Day / Night & Atmospheric Lighting (`Environment.js`)
- **Three Distinct Atmospheric States**:
  - **Day (`☀️`)**: Crisp sky blue atmosphere (`#93c5fd`), bright sun with real-time soft shadows.
  - **Sunset (`🌅`)**: Dramatic golden hour with amber skies (`#d97706`), low sun angles, and elongated shadows.
  - **Night (`🌙`)**: Deep midnight dark navy sky (`#090d16`), illuminated office window grids, glowing streetlights, and moody distance fog.
- **Functional Vehicle Headlights**:
  - Dual high-beam `SpotLight` projectors on the player car cast realistic light pools onto the asphalt in front of the car during dusk and night driving.
- **Interactive Atmospheric Toggle**: Press `T` or click the Sun/Moon icon in the top action bar to cycle atmospheres on the fly.

### 4. Vehicle Garage & Performance Tuning
- **Custom Paint Finishes**: Choose between Electric Blue, Crimson Red, Cyber Cyan, Midnight Onyx, Solar Yellow, Emerald Green, Violet Neon, and Alpine White.
- **Performance Tuning Sliders**:
  - **Engine Output**: Upgrade from Stage 1 (137 km/h) to Stage 3 Pro (155 km/h) with boosted acceleration thrust.
  - **Handling & Steering**: Upgrade tire grip and high-speed steering sensitivity.
  - **Braking Power**: Upgrade to ceramic sport brakes for high-authority stopping distance.
- **Local Persistence**: Vehicle paint finishes and tuning configurations persist in `localStorage`.

### 5. Enhanced Audio Synthesizer (`SoundEffects.js`)
- **Car Horn**: Realistic dual-tone automotive horn triggered via `H` key or mobile horn button.
- **Checkpoint Chimes**: Melodic ascending 4-note arpeggio on clearing gates.
- **Near-Miss Whoosh**: Stereo doppler swoosh on overtaking AI cars.
- **Mission Fanfares**: Victory and failure synth jingles.

---

## File Structure

```
city-drive/
├── index.html                  # Main WebGL canvas, HUD, modals, and touch UI
├── start-game.bat              # One-click Windows launcher
├── server.js                   # Minimal zero-dependency local static server
├── README.md                   # Complete documentation
│
├── styles/
│   └── game.css                # Glassmorphic HUD, mode tabs, garage, and summary styles
│
└── src/
    ├── main.js                 # Application entry point
    │
    ├── libs/
    │   └── three.module.js     # Bundled Three.js (r160) for 100% offline support
    │
    ├── core/
    │   ├── Game.js             # Master game coordinator & loop
    │   ├── GameLoop.js         # Clamped delta-time animation loop
    │   └── InputManager.js     # Desktop keyboard & multitouch inputs
    │
    ├── vehicle/
    │   ├── Vehicle.js          # Procedural 3D sports coupe, headlights & wheels
    │   ├── VehiclePhysics.js   # Kinematic bicycle model, drag & tuning
    │   └── VehicleController.js# Input binding, color & telemetry
    │
    ├── traffic/
    │   ├── TrafficVehicle.js   # Procedural Sedans, Taxis, Vans with autonomous AI
    │   └── TrafficManager.js   # Traffic pooling, streaming & near-miss detection
    │
    ├── missions/
    │   └── MissionManager.js   # Time Attack checkpoints, Courier & Free Cruise
    │
    ├── world/
    │   ├── World.js            # Endless chunk streaming & obstacle distribution
    │   ├── Road.js             # 4-lane asphalt road geometry & lane markings
    │   └── Environment.js      # Day/Sunset/Night lighting, streetlamps & skyline
    │
    ├── camera/
    │   └── FollowCamera.js     # Smooth 3rd-person follow camera with shake & FOV zoom
    │
    ├── collision/
    │   └── CollisionSystem.js  # 2D OBB collisions, sparks, barrier & traffic impact
    │
    ├── ui/
    │   └── HUD.js              # Speedometer, mission timer, garage & summary modals
    │
    └── audio/
        └── SoundEffects.js     # Web Audio engine, horn, chimes, and collision sound
```

---

## Controls

| Key / Control | Action |
| --- | --- |
| `W` / `↑` | Accelerate forward |
| `S` / `↓` | Brake & Reverse |
| `A` / `D` or `←` / `→` | Steer Left / Right |
| `Space` | Emergency Handbrake |
| `H` | Sound Car Horn |
| `T` | Cycle Day / Sunset / Night atmosphere |
| `R` | Quick Reset Vehicle / Restart Sprint |
| `ESC` | Pause Game Menu |
| **Touch Controls** | Virtual Steer Left/Right, Gas, Brake, Handbrake, and Horn |

---

## How to Run

### Method 1: Double-Click Launcher (Windows)
Double-click `start-game.bat`. This starts the local server and automatically launches `http://localhost:8080` in your default browser.

### Method 2: Command Line via Node.js
```bash
cd city-drive
node server.js
```
Then open `http://localhost:8080` in your browser.

### Method 3: InfinityPlay Integration
```bash
node server/server.js
```
And navigate to `http://localhost:3000/games/city-drive/`.
