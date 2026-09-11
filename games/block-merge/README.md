# BLOCK MERGE — Number Merge Puzzle Game

> **"Merge numbers. Reach infinity."**

BLOCK MERGE is a high-octane, responsive, modern number puzzle game inspired by 2048, crafted specifically for the **InfinityPlay** web gaming platform.

---

## 🎮 Key Features

- **Exact 2048 Algorithm**:
  - Deterministic 4×4 grid sliding logic with directional compression.
  - Colliding identical numbers merge once per move (e.g., `2 + 2 + 2` yields `4 + 2`, not `8`; `2 + 2 + 2 + 2` yields `4 + 4`).
  - Spawns 2 initial blocks at game start (90% chance of 2, 10% chance of 4).
  - Spawns 1 new block only on valid moves (a move that changes board layout).
  - Full game over detection when grid is completely filled and no adjacent horizontal/vertical merges remain.
- **Scoring & High Score**:
  - Score reflects the sum of all merged block values.
  - Floating neon `+N` points addition indicators.
  - Persistent High Score saved automatically in `localStorage`.
- **1-Move Undo System**:
  - Snapshot-based state restoration.
  - Restores previous board grid and exact score.
  - Disabled until a move is performed; can only undo once per turn to maintain challenge balance.
- **Auto-Save & Session Resume**:
  - Game state is continuously saved in `localStorage`.
  - "Resume Game?" modal triggers when reopening an active session.
  - Reset confirmation prevents accidental loss of high-scoring games.
- **Synthesized Web Audio Engine**:
  - Zero external MP3/WAV dependencies; 100% procedurally synthesized with the browser's native `AudioContext`.
  - Move swoosh, frequency-scaled merge chimes, fanfare chords for 2048 victory, low game-over sound, and UI clicks.
  - Sound ON/OFF toggle with persistent user preference.
- **Responsive & Touch-Optimized**:
  - Keyboard controls: Arrow Keys (`↑`, `↓`, `←`, `→`) or WASD.
  - Mobile swipe gestures with 30px swipe threshold and viewport scroll prevention (`touch-action: none`).
  - Fluid CSS transforms with dynamic font scaling for large numbers (128, 1024, 2048, 4096+).

---

## 🛠️ Architecture & Separation of Concerns

```
games/block-merge/
├── css/
│   ├── block-merge.css    # Responsive HUD, board styling, modals, and animations
│   └── tiles.css          # Block colors, neon glows, gradients, and keyframes
├── js/
│   ├── GameEngine.js      # Pure 2048 algorithm, sliding, merging, and state snapshots
│   ├── StorageManager.js  # Safe localStorage wrapper with corruption fallback
│   ├── SoundManager.js    # Procedural Web Audio API sound synthesizer
│   ├── InputManager.js    # Keyboard & touch swipe handler
│   ├── UIManager.js       # DOM renderer, dynamic metrics, and modal manager
│   └── app.js             # Central coordinator & InfinityPlay portal bridge
├── assets/                # Logos and cover art
├── index.html             # Standalone & embeddable game viewport
├── start-game.bat         # Windows one-click launcher
├── test-engine.mjs        # Automated unit test suite (23 assertions)
└── README.md              # Documentation
```

---

## 🧪 Testing

Run the automated algorithmic test suite:
```bash
node games/block-merge/test-engine.mjs
```
Expected output:
```
✔ All 23 GameEngine tests passed successfully!
```

---

## 🚀 How to Play

1. **Via InfinityPlay Portal**:
   - Start the local server: `node server/server.js`
   - Open `http://localhost:3000` in any modern browser.
   - Select **BLOCK MERGE** from the **Puzzle** category.
2. **Standalone**:
   - Double-click `start-game.bat` or open `games/block-merge/index.html` directly.
