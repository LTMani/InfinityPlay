# Railway Commander (2.5D Train Driving Simulator)

**"Drive. Signal. Stop. Deliver."**

Railway Commander is a browser-based 2.5D train driving simulation game built inside the **InfinityPlay** platform. Players step into the locomotive cabin of a modern passenger train to master acceleration, progressive braking, railway signal compliance, speed limit zones, and pinpoint station stopping accuracy.

---

## Key Features

1. **2.5D Perspective World Engine**
   - High-performance canvas projection rendering curved railway tracks, sleepers/ties, ballast gravel, and electrification catenary poles.
   - Dual perspective camera modes:
     - **Elevated 2.5D Chase View**: Cinematic isometric/third-person view behind the aerodynamic locomotive.
     - **Cab View**: Realistic cockpit windshield perspective with driver dashboard console and rain wipers.
   - Dynamic time of day: ☀️ **Day**, 🌅 **Sunset**, 🌙 **Night** (with functioning locomotive high-beam headlights).
   - Dynamic weather: ☀️ **Clear**, 🌧 **Rain** (wet track sheen & raindrops), 🌫 **Fog** (atmospheric depth fogging).

2. **Realistic Train Physics**
   - **6-Level Throttle (0 to 5)**: Progressive tractive effort modeling wheel adhesion and locomotive power.
   - **6-Level Progressive Brakes (0 to 5)**: Smooth pneumatic air brake pressure drops.
   - **Emergency Brake**: Maximum deceleration clamp valve.
   - **Inertia & Momentum**: Davis equation resistance (rolling friction & aerodynamic drag) ensures the train coasts realistically rather than stopping abruptly.

3. **Railway Signaling & ATS Enforcement**
   - 🟢 **Green**: Track clear, proceed at line speed.
   - 🟡 **Yellow**: Caution, reduce speed to advisory limit (40 km/h).
   - 🔴 **Red**: Danger, absolute stop required before the signal marker.
   - **SPAD (Signal Passed At Danger) Failure**: Violation of red signals triggers instant automatic train stop and mission failure.

4. **Station & Stop Accuracy System**
   - Approach notifications ("Approaching [Station] in 500m", "Prepare to Stop").
   - Precision Stop Box on the tracks with target line:
     - 🌟 **PERFECT STOP** (within ±2.5m): +500 PTS
     - 👍 **GOOD STOP** (within ±7.5m): +300 PTS
     - ❌ **MISSED STOP**: Penalty or mission failure.
   - Automated passenger boarding sequence with timer and departure whistle.

5. **Mission Progression & Scoring**
   - **Mission 1: Training Run** (1.8 km, 60 km/h limit, 1 Station)
   - **Mission 2: City Express** (3.8 km, 100 km/h corridor, 2 Stations, Sunset)
   - **Mission 3: Signal Master** (4.5 km, dynamic signals, night/rain)
   - **Mission 4: Precision Driver** (5.6 km, alpine grade, fog, multi-stop precision)
   - Complete scoring system with ⭐⭐⭐ stars, ranks (S/A/B/C), XP, and coin rewards.

6. **Web Audio API Procedural Sound Engine**
   - Zero external audio file dependencies (no 404s).
   - Synthesizes diesel/electric traction motor RPM whines, wheel-rail clatter rhythm, pneumatic air brake releases, dual-tone locomotive horn blasts, and station chimes.

7. **Responsive & Mobile-Friendly Controls**
   - Desktop keyboard controls: <kbd>W</kbd>/<kbd>S</kbd>, <kbd>A</kbd>/<kbd>D</kbd>, <kbd>SPACE</kbd>, <kbd>H</kbd>, <kbd>L</kbd>, <kbd>C</kbd>, <kbd>ESC</kbd>.
   - Touch buttons on mobile and tablet displays.

---

## Standalone Quick Launch
Double-click `start-game.bat` in this folder to launch the game directly in your default browser.
