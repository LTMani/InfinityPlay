# InfinityPlay — Gaming Platform Frontend

> **"One Platform. Infinite Play."**

InfinityPlay is a next-generation multi-game web gaming portal and dashboard built strictly with **HTML5, CSS3, and Vanilla JavaScript**. Designed with a deep dark futuristic aesthetic, neon lighting, glassmorphism, responsive 3-column architecture, and browser-side persistence with `localStorage`.

---

## 🎮 Features

- **Modern Futuristic Aesthetic**: Deep navy/slate background (`#080a12`), glowing purple, electric blue, and neon cyan accents, glassmorphic panels, and smooth hover micro-interactions.
- **Dynamic Game Card Rendering**: All game cards are dynamically generated from a centralized data source (`games-data.js`) with zero duplicated HTML markup.
- **Live Search & Autocomplete**: Real-time filtering by game title, category, and tags with instant thumbnail previews. Press `/` anywhere to focus search.
- **Interactive Category Filtering**: 8 categories (Racing, Adventure, Simulation, Puzzle, Sports, Strategy, Arcade, Survival) with active glow states and responsive layouts.
- **My Games & Favorites**: Add or remove any game from favorites using local browser storage (`localStorage`).
- **Recently Played Tracking**: Automatically updates the leaderboard recently played list whenever a game is launched.
- **Top Players Leaderboard**: Global XP leaderboard showcasing top players with ranking shield badges and avatars.
- **Interactive Game Details & Launcher**: Click "Play" on any game to view screenshots, tags, developer details, and launch the game modal.
- **100% Zero Frameworks**: Pure semantic HTML5, modern CSS3 custom properties (CSS variables), Flexbox, CSS Grid, and modular vanilla JavaScript.
- **Fully Responsive**: Optimized for desktop (1920px, 1440px), laptops (1280px), tablets (1024px, 768px), and mobile devices (480px, 375px).

---

## 📁 Project Structure

```
InfinityPlay/
│
├── index.html                  # Main application dashboard
│
├── css/
│   ├── variables.css           # Design tokens, color palette, gradients, glows
│   ├── reset.css               # Box model reset & normalization
│   ├── global.css              # Global typography, buttons, badges, modals, toasts
│   ├── layout.css              # 3-column dashboard layout (Left - Main - Right)
│   ├── header.css              # Sticky top header, capsule search, profile menu
│   ├── sidebar.css             # Collapsible left navigation & promo card
│   ├── hero.css                # Futuristic hero banner & carousel dots
│   ├── cards.css               # Category cards, Top Games & All Games grids
│   ├── leaderboard.css         # Top Players & Recently Played right sidebar
│   ├── animations.css          # Glow pulses, float, and fade-in keyframes
│   └── responsive.css          # Mobile & tablet media queries
│
├── js/
│   ├── app.js                  # Main application coordinator & modal handlers
│   │
│   ├── data/
│   │   ├── games-data.js       # Centralized dataset of all 10 platform games
│   │   └── categories-data.js  # Category definitions & styling tokens
│   │
│   ├── components/
│   │   ├── header.js           # Search bar, shortcuts, notification menu
│   │   ├── sidebar.js          # Navigation active states & drawer toggles
│   │   ├── game-card.js        # Dynamic card rendering & play triggers
│   │   └── leaderboard.js      # Top players & leaderboard logic
│   │
│   ├── features/
│   │   ├── search.js           # Live search engine with autocomplete
│   │   ├── filtering.js        # Category filtering & sorting logic
│   │   ├── favorites.js        # "My Games" persistence with localStorage
│   │   └── recently-played.js  # Play history tracker with localStorage
│   │
│   └── utils/
│       ├── helpers.js          # Formatting (12K, 98,450), toasts, debouncing
│       └── storage.js          # LocalStorage abstractions
│
├── assets/
│   ├── images/                 # Hero battlestation background & promo visuals
│   ├── icons/                  # Interface icons
│   ├── logos/                  # Infinity logo assets
│   └── games/                  # Thumbnails for all 10 games
│
└── README.md
```

---

## 🕹 The 10 Platform Games

1. **Ultimate Racing** (Racing • ★ 4.9 • 12K Plays)
2. **Bus Simulator** (Simulation • ★ 4.8 • 9.2K Plays)
3. **Shadow Adventure** (Adventure • ★ 4.7 • 8.1K Plays)
4. **City Builder** (Strategy • ★ 4.9 • 11K Plays)
5. **Football Legends** (Sports • ★ 4.6 • 6.4K Plays)
6. **Survival Island** (Survival • ★ 4.8 • 7.8K Plays)
7. **Puzzle Master** (Puzzle • ★ 4.7 • 5.9K Plays)
8. **Farm Life** (Simulation • ★ 4.5 • 4.3K Plays)
9. **Tower Defense** (Strategy • ★ 4.8 • 8.6K Plays)
10. **Speed Arena** (Racing • ★ 4.9 • 10.5K Plays)
11. **Chess Grandmaster** (Strategy • ★ 5.0 • Playable)
12. **Memory Match** (Puzzle • ★ 4.8 • Playable)
13. **City Drive** (Racing • ★ 4.9 • 13.5K Plays • Playable 3D Three.js)

---

## 🚀 Game Integration Guide

To integrate playable canvas, WebGL, or iframe games:
1. Open `js/data/games-data.js`.
2. Add your game URL or canvas entry point to the target game object:
   ```javascript
   {
     id: 'ultimate-racing',
     gameUrl: 'games/ultimate-racing/index.html',
     ...
   }
   ```
3. Update `launchGameModal` in `js/app.js` to embed an `<iframe>` or initialize your canvas renderer inside the `#gameModalBody` container.

---

## ⚡ Node.js Backend & REST APIs

InfinityPlay includes a lightweight, native Node.js backend server with zero external dependencies.

### Running the Server
```bash
# Start server (default: http://localhost:3000)
npm start

# Or start with auto-reload (Node.js 18+)
npm run dev
```

### Available REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health and uptime |
| `GET` | `/api/stats` | Platform metrics (games, plays, active players) |
| `GET` | `/api/games` | Query games (`?category=Racing`, `?search=term`, `?sort=popular\|newest\|rating`) |
| `GET` | `/api/games/:id` | Individual game details and assets |
| `GET` | `/api/categories` | 8 categories with live game counts |
| `GET` | `/api/leaderboard` | Top 5 players XP rankings and avatars |
| `GET` | `/api/recently-played` | User's recent gaming activity |
| `POST` | `/api/recently-played` | Add game to recent activity (`{ "gameId": "ultimate-racing" }`) |
| `GET` | `/api/favorites` | List of bookmarked favorite games |
| `POST` | `/api/favorites/toggle` | Toggle favorite state (`{ "gameId": "city-builder" }`) |
| `POST` | `/api/auth/login` | User login (`{ "email", "password" }`) |
| `POST` | `/api/auth/register` | User registration (`{ "username", "email", "password" }`) |

---

## 💻 Local Frontend Usage

You can run InfinityPlay either:
1. **With the Node.js backend**: Run `npm start` and visit `http://localhost:3000`.
2. **As a standalone client**: Double-click `index.html` directly in any web browser. The frontend automatically falls back to client-side data and local storage when running offline or without the server!

 
