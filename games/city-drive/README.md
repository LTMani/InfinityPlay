# CITY DRIVE — Phase 1: Core Driving Prototype

**City Drive** is an original 3D browser-based city driving game built from scratch using **Three.js** and vanilla modern JavaScript (ES6+). It delivers an arcade driving experience with realistic vehicle physics, follow camera dynamics, continuous urban scenery streaming, obstacle collisions, audio synthesis, and full support for both desktop keyboard and mobile multitouch controls.

---

## Features Implemented in Phase 1

### 1. Vehicle & Dynamics
- **Procedural 3D Sports Coupe**:
  - Aerodynamic chassis, glass greenhouse cabin, front splitter/grille, rear diffuser, rear sport spoiler, and dual chrome exhaust pipes.
  - 4 independently modeled wheels (treaded tires + alloy rims).
  - Front wheels pivot left/right around their vertical axis during steering.
  - All 4 wheels spin around their axle proportional to vehicle linear speed.
  - Dynamic headlights and reactive taillights (emissive intensity increases when braking and reversing).
- **Arcade Physics Model (`VehiclePhysics.js`)**:
  - Bicycle kinematics yaw rotation (`yawRate = (speed / wheelbase) * tan(steerAngle)`).
  - Gradual speed acceleration curve up to 137 km/h (38 m/s).
  - High-authority, smooth braking.
  - Controlled reverse gear logic up to 36 km/h.
  - Rolling resistance and aerodynamic drag when coasting.
  - Dynamic speed-sensitive steering: maximum steering angle tightens smoothly at high speeds to prevent twitchy snap spins while maintaining nimble response for parking and low-speed maneuvers.
  - Suspension simulation: chassis roll tilt during hard cornering and pitch dive/squat during braking and acceleration.

### 2. Follow Camera (`FollowCamera.js`)
- Third-person chase camera positioned behind and slightly elevated above the car.
- Smooth positional and lookAt interpolation (`lerp`).
- Adaptive FOV: smoothly expands at high speeds for a thrilling sense of momentum.
- Dynamic collision screen shake with quadratic decay on impact.
- Reverse gear viewpoint adaptation.

### 3. World & Road Streaming (`World.js`, `Road.js`, `Environment.js`)
- 4-lane wide asphalt boulevard with double yellow center median, white shoulder lines, dashed lane dividers, and curbs.
- Continuous chunk recycling system: road and city blocks stream seamlessly ahead of the player and recycle behind for unlimited continuous driving.
- Stylized urban skyline: modern high-rise office towers, residential buildings with procedural glowing window grids, rooftop HVAC penthouses, and radio spires.
- Atmospheric lighting: sun directional light casting soft shadows, ambient hemisphere sky fill, and horizon distance fog.
- Sidewalks with modern streetlamps and low-poly trees.

### 4. Collision System (`CollisionSystem.js`)
- 2D oriented bounding box (OBB) and boundary collision checks.
- Three distinct obstacle types:
  - Striped construction roadblock barriers with amber hazard beacons.
  - Concrete jersey barricades.
  - Reflective orange traffic cone clusters.
- Physical penetration resolution (prevents driving through obstacles).
- Kinetic energy absorption (-70% speed reduction and rebound impulse).
- Visual particle spark burst at point of impact.
- Guardrail constraints along outer road boundaries.

### 5. Heads-Up Display & UI (`HUD.js`)
- Automotive dashboard with large 3-digit speed readout (`042 KM/H`).
- Speedometer bar with progressive gradient glow.
- Real-time transmission gear badge (`D`, `R`, `P`).
- Distance traveled odometer.
- Top action bar: Audio toggle, Quick reset, and Pause buttons.
- Dynamic impact and status notification banner.
- Clean Start Screen with "CITY DRIVE" title and subtitle.
- Controls overview modal and Pause overlay.

### 6. Desktop & Mobile Multitouch Controls
- **Desktop Keyboard**:
  - `W` / `↑`: Accelerate
  - `S` / `↓`: Brake & Reverse
  - `A` / `←`: Steer Left
  - `D` / `→`: Steer Right
  - `Space`: Emergency Handbrake
  - `R`: Reset / Restart
  - `ESC`: Pause Game
  - Automatic suppression of default browser arrow/space scrolling.
- **Mobile Multitouch**:
  - Ergonomic virtual buttons: Steering cluster on the bottom-left, Gas & Brake pedals on the bottom-right.
  - Full simultaneous multitouch support (e.g. accelerating while steering).

### 7. Audio Synthesizer (`SoundEffects.js`)
- Zero-dependency procedural Web Audio API sound generator.
- Speed/throttle-responsive engine hum and pitch modulation.
- Thumping low-frequency impact boom on collisions.
- Audio mute toggle.

---

## File Structure

```
city-drive/
├── index.html                  # Main game document & UI layout
├── start-game.bat              # One-click Windows launcher
├── server.js                   # Minimal zero-dependency local static server
├── README.md                   # Complete documentation
│
├── styles/
│   └── game.css                # Automotive glassmorphism theme & responsive layout
│
└── src/
    ├── main.js                 # Application entry point
    │
    ├── libs/
    │   └── three.module.js     # Bundled Three.js (r160) for 100% offline support
    │
    ├── core/
    │   ├── Game.js             # Master game coordinator & Three.js setup
    │   ├── GameLoop.js         # Clamped delta-time animation loop
    │   └── InputManager.js     # Unified desktop & multitouch input processor
    │
    ├── vehicle/
    │   ├── Vehicle.js          # Procedural 3D sports coupe model & wheel assemblies
    │   ├── VehiclePhysics.js   # Arcade bicycle kinematics & speed-sensitive steering
    │   └── VehicleController.js# Input-to-physics binding & telemetry queries
    │
    ├── world/
    │   ├── World.js            # Endless chunk streaming & obstacle distribution
    │   ├── Road.js             # 4-lane asphalt road geometry, markings & curbs
    │   └── Environment.js      # Procedural buildings, streetlights, trees & lighting
    │
    ├── camera/
    │   └── FollowCamera.js     # Smooth 3rd-person follow camera with shake & FOV zoom
    │
    ├── collision/
    │   └── CollisionSystem.js  # 2D OBB collisions, spark particles & speed damping
    │
    ├── ui/
    │   └── HUD.js              # Speedometer, gear display, start menu & modal manager
    │
    └── audio/
        └── SoundEffects.js     # Procedural Web Audio API sound generator
```

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
Because the files are located in `games/city-drive/` within InfinityPlay, you can run InfinityPlay's server:
```bash
node server/server.js
```
And navigate to `http://localhost:3000/games/city-drive/`.

---

## Phase 2 Roadmap & Recommended Next Steps

1. **AI Traffic Simulation**: Add ambient AI vehicles (cars, buses, taxis) traveling in designated lanes with lane-changing and stopping logic.
2. **Objective & Destination Missions**: Checkpoint races, taxi delivery fares, and time trials.
3. **Vehicle Customization & Garage**: Color selection, rim styles, and upgradeable engine/handling stats.
4. **Enhanced City Architecture**: Curved road segments, 4-way intersections with working traffic lights, bridges, and tunnels.
5. **Day / Night Lighting Cycle**: Dynamic sun movement transitioning to vibrant neon-lit night driving.

