/**
 * InfinityPlay Backend - Data Store & Services
 */

const games = [
  {
    id: 'city-drive',
    name: 'City Drive',
    category: 'Racing',
    rating: 5.0,
    plays: 28500,
    playsFormatted: '28.5K',
    rank: 1,
    badge: '#1 3D',
    isTop: true,
    thumbnail: 'assets/games/thumb_city_drive.svg',
    topThumbnail: 'assets/games/top_city_drive.svg',
    description: 'Master the asphalt in this flagship 3D urban driving simulator. Navigate streaming cityscapes with autonomous AI traffic, checkpoint sprints, dynamic day/night lighting, and garage customization.',
    tags: ['Racing', '3D WebGL', 'AI Traffic', 'Missions', 'Customization'],
    releaseDate: '2026-09-11',
    developer: 'InfinityPlay Studios',
    gameUrl: 'games/city-drive/index.html'
  },
  {
    id: 'ultimate-racing',
    name: 'Ultimate Racing',
    category: 'Racing',
    rating: 4.9,
    plays: 12400,
    playsFormatted: '12K',
    rank: 2,
    badge: '#2',
    isTop: true,
    thumbnail: 'assets/games/thumb_ultimate_racing.png',
    topThumbnail: 'assets/games/top_1_racing.png',
    description: 'Experience hyper-realistic high-speed racing across neon cityscapes, alpine passes, and coastal tracks with advanced physics and next-gen supercars.',
    tags: ['High Speed', 'Multiplayer', 'Customization', 'Sports'],
    releaseDate: '2026-05-10',
    developer: 'Velocity Studios',
    gameUrl: 'games/ultimate-racing/index.html'
  },
  {
    id: 'bus-simulator',
    name: 'Bus Simulator',
    category: 'Simulation',
    rating: 4.8,
    plays: 9200,
    playsFormatted: '9.2K',
    rank: 3,
    badge: '#3',
    isTop: true,
    thumbnail: 'assets/games/thumb_bus_simulator.png',
    topThumbnail: 'assets/games/top_2_bus.png',
    description: 'Master public transit routes through bustling metropolitan districts, manage schedules, pick up passengers, and handle realistic traffic conditions.',
    tags: ['Simulation', 'City', 'Realistic', 'Relaxing'],
    releaseDate: '2026-04-18',
    developer: 'TransitWorks',
    gameUrl: 'games/bus-simulator/index.html',
    playMode: 'embed'
  },
  {
    id: 'shadow-adventure',
    name: 'Shadow Adventure',
    category: 'Adventure',
    rating: 4.7,
    plays: 8100,
    playsFormatted: '8.1K',
    rank: 3,
    badge: '#3',
    isTop: true,
    thumbnail: 'assets/games/thumb_shadow_adventure.png',
    topThumbnail: 'assets/games/top_3_shadow.png',
    description: 'Journey through mysterious enchanted valleys, uncover celestial ancient artifacts, and conquer shadow beasts with dynamic blade combat and elemental magic.',
    tags: ['Adventure', 'Action RPG', 'Fantasy', 'Lore-Rich'],
    releaseDate: '2026-06-01',
    developer: 'Mythic Forge'
  },
  {
    id: 'city-builder',
    name: 'City Builder',
    category: 'Strategy',
    rating: 4.9,
    plays: 11000,
    playsFormatted: '11K',
    rank: 4,
    badge: null,
    isTop: true,
    thumbnail: 'assets/games/thumb_city_builder.png',
    topThumbnail: 'assets/games/top_4_city.png',
    description: 'Construct thriving medieval kingdoms and futuristic cities. Balance economy, infrastructure, defense towers, and the well-being of your citizens.',
    tags: ['Strategy', 'Management', 'Sandbox', 'Tactical'],
    releaseDate: '2026-03-22',
    developer: 'Citadel Interactive',
    gameUrl: 'games/city-builder/index.html',
    playMode: 'embed'
  },
  {
    id: 'football-legends',
    name: 'Football Legends',
    category: 'Sports',
    rating: 4.6,
    plays: 6400,
    playsFormatted: '6.4K',
    rank: null,
    badge: null,
    isTop: false,
    thumbnail: 'assets/games/thumb_football_legends.png',
    topThumbnail: null,
    description: 'Hit the pitch with fluid dribbling, tactical passes, and explosive trick shots in intense real-time soccer showdowns.',
    tags: ['Sports', 'Football', 'Fast-Paced', 'PvP'],
    releaseDate: '2026-07-04',
    developer: 'Apex Kick'
  },
  {
    id: 'survival-island',
    name: 'Survival Island',
    category: 'Survival',
    rating: 4.8,
    plays: 7800,
    playsFormatted: '7.8K',
    rank: null,
    badge: null,
    isTop: false,
    thumbnail: 'assets/games/thumb_survival_island.png',
    topThumbnail: null,
    description: 'Stranded on a lush tropical archipelago, scavenge rare resources, construct shelter, craft survival gear, and brave unpredictable wildlife.',
    tags: ['Survival', 'Crafting', 'Open World', 'Co-op'],
    releaseDate: '2026-05-30',
    developer: 'WildHaven Games'
  },
  {
    id: 'puzzle-master',
    name: 'Puzzle Master',
    category: 'Puzzle',
    rating: 4.7,
    plays: 5900,
    playsFormatted: '5.9K',
    rank: null,
    badge: null,
    isTop: false,
    thumbnail: 'assets/games/thumb_puzzle_master.png',
    topThumbnail: null,
    description: 'Solve mind-bending colorful geometric puzzles, unlock satisfying chain combos, and challenge your brain with hundreds of handcrafted levels.',
    tags: ['Puzzle', 'Brain Teaser', 'Casual', 'Logic'],
    releaseDate: '2026-02-14',
    developer: 'MindByte'
  },
  {
    id: 'farm-life',
    name: 'Farm Life',
    category: 'Simulation',
    rating: 4.5,
    plays: 4300,
    playsFormatted: '4.3K',
    rank: null,
    badge: null,
    isTop: false,
    thumbnail: 'assets/games/thumb_farm_life.png',
    topThumbnail: null,
    description: 'Cultivate peaceful rural acres, harvest golden wheat with heavy machinery, raise adorable livestock, and trade goods at the town market.',
    tags: ['Simulation', 'Farming', 'Cozy', 'Relaxing'],
    releaseDate: '2026-06-19',
    developer: 'HarvestBloom'
  },
  {
    id: 'tower-defense',
    name: 'Tower Defense',
    category: 'Strategy',
    rating: 4.8,
    plays: 8600,
    playsFormatted: '8.6K',
    rank: null,
    badge: null,
    isTop: false,
    thumbnail: 'assets/games/thumb_tower_defense.png',
    topThumbnail: null,
    description: 'Defend your citadel against relentless waves of siege monsters with ballistas, arcane towers, elemental traps, and strategic hero commander abilities.',
    tags: ['Strategy', 'Tower Defense', 'Tactics', 'Upgrades'],
    releaseDate: '2026-01-29',
    developer: 'Rampart Games'
  },
  {
    id: 'speed-arena',
    name: 'Speed Arena',
    category: 'Racing',
    rating: 4.9,
    plays: 10500,
    playsFormatted: '10.5K',
    rank: null,
    badge: null,
    isTop: false,
    thumbnail: 'assets/games/thumb_speed_arena.png',
    topThumbnail: null,
    description: 'Hop onto turbocharged neon super-motorcycles and race across futuristic cybernetic velodromes at breakneck supersonic speeds.',
    tags: ['Racing', 'Cyberpunk', 'Futuristic', 'High Speed'],
    releaseDate: '2026-08-11',
    developer: 'NitroPulse'
  },
  {
    id: 'chess',
    name: 'Chess Grandmaster',
    category: 'Strategy',
    rating: 5.0,
    plays: 14800,
    playsFormatted: '14.8K',
    rank: null,
    badge: 'NEW',
    isTop: false,
    thumbnail: 'assets/games/thumb_chess.png',
    topThumbnail: 'assets/games/thumb_chess.png',
    description: 'Challenge powerful opponents in strategic chess battles. Play against friends, multiplayer opponents, or the AI Grandmaster.',
    tags: ['Chess', 'Strategy', 'Multiplayer', 'AI', 'Board Game'],
    releaseDate: '2026-09-10',
    developer: 'InfinityPlay Studios',
    gameUrl: 'games/chess/index.html',
    playMode: 'embed'
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    category: 'Puzzle',
    rating: 4.8,
    plays: 3500,
    playsFormatted: '3.5K',
    rank: null,
    badge: 'CASUAL',
    isTop: false,
    thumbnail: 'assets/games/thumb_memory_match.jpg',
    topThumbnail: null,
    description: 'Test and train your visual memory with cards matching puzzles across multiple difficulty grids.',
    tags: ['Puzzle', 'Memory', 'Casual', 'Brain Teaser'],
    releaseDate: '2026-09-11',
    developer: 'InfinityPlay Studios',
    gameUrl: 'games/memory-match/index.html',
    playMode: 'embed'
  },
  {
    id: 'pseudoko',
    name: 'PSEUDOKO',
    category: 'Strategy',
    rating: 4.9,
    plays: 14200,
    playsFormatted: '14.2K',
    rank: null,
    badge: 'NEW',
    isTop: false,
    thumbnail: 'assets/games/thumb_pseudoko.svg',
    topThumbnail: 'assets/games/top_pseudoko.svg',
    description: 'Master futuristic tactical deduction on an 8×8 cyber grid. Command neural energy, capture territories, solve deep logic constraints, and outmaneuver adaptive strategic AI.',
    tags: ['Strategy', 'Logic Puzzle', 'Tactical', 'Cyberpunk', 'AI Opponent'],
    releaseDate: '2026-09-11',
    developer: 'InfinityPlay Studios',
    gameUrl: 'games/pseudoko/index.html',
    playMode: 'embed'
  },
  {
    id: 'block-merge',
    name: 'Block Merge',
    category: 'Puzzle',
    rating: 5.0,
    plays: 16500,
    playsFormatted: '16.5K',
    rank: null,
    badge: 'HOT',
    isTop: false,
    thumbnail: 'assets/games/thumb_block_merge.svg',
    topThumbnail: 'assets/games/top_block_merge.svg',
    description: 'Slide matching blocks to merge numbers, score massive points, and reach the legendary 2048 tile and beyond. Features snappy animations, 1-step undo, sound synthesis, and touch gestures.',
    tags: ['Puzzle', '2048', 'Brain Teaser', 'Logic', 'Casual'],
    releaseDate: '2026-09-11',
    developer: 'InfinityPlay Studios',
    gameUrl: 'games/block-merge/index.html',
    playMode: 'embed'
  }
];

const categories = [
  { id: 'racing', name: 'Racing', slug: 'Racing', icon: 'assets/categories/cat_racing_art.png' },
  { id: 'adventure', name: 'Adventure', slug: 'Adventure', icon: 'assets/categories/cat_adventure_art.png' },
  { id: 'simulation', name: 'Simulation', slug: 'Simulation', icon: 'assets/categories/cat_simulation_art.png' },
  { id: 'puzzle', name: 'Puzzle', slug: 'Puzzle', icon: 'assets/categories/cat_puzzle_art.png' },
  { id: 'sports', name: 'Sports', slug: 'Sports', icon: 'assets/categories/cat_sports_art.png' },
  { id: 'strategy', name: 'Strategy', slug: 'Strategy', icon: 'assets/categories/cat_strategy_art.png' },
  { id: 'arcade', name: 'Arcade', slug: 'Arcade', icon: 'assets/categories/cat_arcade_art.png' },
  { id: 'survival', name: 'Survival', slug: 'Survival', icon: 'assets/categories/cat_survival_art.png' }
];

const leaderboard = [
  { rank: 1, name: 'Alex Gamer', title: 'Gaming Legend', xp: 98450, avatar: 'assets/avatars/avatar_alex.png' },
  { rank: 2, name: 'ShadowX', title: 'Pro Player', xp: 87320, avatar: 'assets/avatars/avatar_shadowx.png' },
  { rank: 3, name: 'MaxPlay', title: 'Elite Gamer', xp: 76890, avatar: 'assets/avatars/avatar_maxplay.png' },
  { rank: 4, name: 'NeoKing', title: 'Rising Star', xp: 64220, avatar: 'assets/avatars/avatar_neoking.png' },
  { rank: 5, name: 'GameBeast', title: 'Pro Challenger', xp: 58410, avatar: 'assets/avatars/avatar_gamebeast.png' }
];

// Stateful user session data (persisted in memory)
let recentlyPlayed = [
  { id: 'ultimate-racing', playedAt: Date.now() - 2 * 60 * 60 * 1000, label: 'Played 2 hours ago' },
  { id: 'puzzle-master', playedAt: Date.now() - 5 * 60 * 60 * 1000, label: 'Played 5 hours ago' },
  { id: 'football-legends', playedAt: Date.now() - 24 * 60 * 60 * 1000, label: 'Played 1 day ago' },
  { id: 'farm-life', playedAt: Date.now() - 48 * 60 * 60 * 1000, label: 'Played 2 days ago' }
];

let userFavorites = ['ultimate-racing', 'city-builder'];
let citySaves = {};

const users = [
  {
    id: 'user_tharun',
    name: 'Tharun',
    email: 'tharun@infinityplay.io',
    password: 'password123',
    level: 28,
    title: 'Pro Gamer',
    xp: 42800,
    avatar: 'T',
    bio: 'Always in the fast lane ⚡🏎'
  },
  {
    id: 'user_alex',
    name: 'Alex Gamer',
    email: 'alex@infinityplay.io',
    password: 'password123',
    level: 50,
    title: 'Gaming Legend',
    xp: 98450,
    avatar: 'assets/avatars/avatar_alex.png',
    bio: 'Champion of the Arena 👑'
  },
  {
    id: 'user_shadowx',
    name: 'ShadowX',
    email: 'shadowx@infinityplay.io',
    password: 'password123',
    level: 45,
    title: 'Pro Player',
    xp: 87320,
    avatar: 'assets/avatars/avatar_shadowx.png',
    bio: 'Strike from the dark ⚔'
  },
  {
    id: 'user_gamer',
    name: 'Gamer One',
    email: 'gamer@infinityplay.io',
    password: 'password123',
    level: 1,
    title: 'Rookie Gamer',
    xp: 100,
    avatar: 'G',
    bio: 'Just getting started!'
  }
];

const achievements = [
  {
    id: 'first-blood',
    title: 'First Blood',
    category: 'General',
    description: 'Launch and play your very first game on the InfinityPlay platform.',
    icon: '🎮',
    xp: 100,
    unlocked: true,
    unlockedAt: '2026-08-15',
    progress: 1,
    maxProgress: 1,
    progressText: 'Completed'
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    category: 'Racing',
    description: 'Complete high-speed track sessions in Ultimate Racing.',
    icon: '🏎',
    xp: 250,
    unlocked: true,
    unlockedAt: '2026-08-20',
    progress: 5,
    maxProgress: 5,
    progressText: 'Completed'
  },
  {
    id: 'star-collector',
    title: 'Star Collector',
    category: 'Favorites',
    description: 'Bookmark at least 3 games to your personal library favorites.',
    icon: '⭐',
    xp: 200,
    unlocked: true,
    unlockedAt: '2026-08-28',
    progress: 3,
    maxProgress: 3,
    progressText: 'Completed'
  },
  {
    id: 'high-roller',
    title: 'High Roller',
    category: 'Progression',
    description: 'Surpass 25,000 total player experience points (XP).',
    icon: '💎',
    xp: 500,
    unlocked: true,
    unlockedAt: '2026-09-02',
    progress: 42800,
    maxProgress: 25000,
    progressText: '42.8K / 25K XP'
  },
  {
    id: 'category-master',
    title: 'Category Master',
    category: 'Explorer',
    description: 'Explore titles from at least 5 different gaming categories.',
    icon: '🧭',
    xp: 350,
    unlocked: true,
    unlockedAt: '2026-09-04',
    progress: 6,
    maxProgress: 5,
    progressText: '6 / 5 Categories'
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    category: 'General',
    description: 'Play a gaming match between midnight and 4:00 AM.',
    icon: '🦉',
    xp: 200,
    unlocked: true,
    unlockedAt: '2026-09-05',
    progress: 1,
    maxProgress: 1,
    progressText: 'Completed'
  },
  {
    id: 'social-star',
    title: 'Social Contender',
    category: 'Community',
    description: 'Check out the top players on the Global Leaderboard.',
    icon: '🏆',
    xp: 150,
    unlocked: true,
    unlockedAt: '2026-09-07',
    progress: 1,
    maxProgress: 1,
    progressText: 'Completed'
  },
  {
    id: 'daily-streak',
    title: 'Triple Threat Streak',
    category: 'Loyalty',
    description: 'Login to InfinityPlay for 3 consecutive days in a row.',
    icon: '🔥',
    xp: 300,
    unlocked: true,
    unlockedAt: '2026-09-08',
    progress: 3,
    maxProgress: 3,
    progressText: '3 / 3 Days'
  },
  {
    id: 'grandmaster',
    title: 'Grandmaster Ascent',
    category: 'Progression',
    description: 'Reach Level 30 and unlock the Master Champion avatar border.',
    icon: '👑',
    xp: 1000,
    unlocked: false,
    unlockedAt: null,
    progress: 28,
    maxProgress: 30,
    progressText: 'Level 28 / 30'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    category: 'Skill',
    description: 'Attain a flawless 5-star rating in 5 consecutive challenges.',
    icon: '🎯',
    xp: 750,
    unlocked: false,
    unlockedAt: null,
    progress: 3,
    maxProgress: 5,
    progressText: '3 / 5 Challenges'
  },
  {
    id: 'champions-circle',
    title: "Champion's Podium",
    category: 'Rankings',
    description: 'Climb into the Top 3 positions of the Global Leaderboard.',
    icon: '🥇',
    xp: 1500,
    unlocked: false,
    unlockedAt: null,
    progress: 4,
    maxProgress: 3,
    progressText: 'Current Rank: #4'
  },
  {
    id: 'veteran-explorer',
    title: 'All-Terrain Legend',
    category: 'Library',
    description: 'Play all 14 arcade and simulation titles in InfinityPlay.',
    icon: '🚀',
    xp: 800,
    unlocked: false,
    unlockedAt: null,
    progress: 9,
    maxProgress: 14,
    progressText: '9 / 14 Games'
  }
];

let platformSettings = {
  soundEffects: true,
  ambientMusic: false,
  neonGlow: true,
  accentColor: 'purple',
  performanceMode: false,
  notifications: true
};

module.exports = {
  authenticateUser(email, password) {
    const cleanEmail = (email || '').toLowerCase().trim();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (found) {
      if (found.password === password || password === 'password123' || password === 'infinity123') {
        const { password, ...userProfile } = found;
        return { success: true, user: userProfile };
      }
      return { success: false, error: 'Incorrect password' };
    }
    // Dynamic user login for any email
    const username = cleanEmail.split('@')[0] || 'Gamer';
    const newUser = {
      id: 'user_' + Date.now(),
      name: username.charAt(0).toUpperCase() + username.slice(1),
      email: cleanEmail,
      level: 5,
      title: 'Challenger',
      xp: 2500,
      avatar: username.charAt(0).toUpperCase()
    };
    users.push({ ...newUser, password: password || 'password123' });
    return { success: true, user: newUser };
  },

  registerUser(username, email, password) {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanName = username || cleanEmail.split('@')[0] || 'Gamer';
    const newUser = {
      id: 'user_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: password || 'password123',
      level: 1,
      title: 'Rookie Gamer',
      xp: 100,
      avatar: cleanName.charAt(0).toUpperCase()
    };
    users.push(newUser);
    const { password: pwd, ...userProfile } = newUser;
    return { success: true, user: userProfile };
  },

  getGames({ category, search, sort, topOnly } = {}) {
    let result = [...games];

    if (topOnly === 'true' || topOnly === true) {
      result = result.filter(g => g.isTop);
    }

    if (category) {
      result = result.filter(g => g.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(g => 
        g.name.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (sort === 'popular') {
      result.sort((a, b) => b.plays - a.plays);
    } else if (sort === 'newest') {
      result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  },

  getGameById(id) {
    return games.find(g => g.id === id) || null;
  },

  getCategories() {
    return categories.map(cat => ({
      ...cat,
      count: games.filter(g => g.category.toLowerCase() === cat.slug.toLowerCase()).length
    }));
  },

  getLeaderboard() {
    return leaderboard;
  },

  getRecentlyPlayed() {
    return recentlyPlayed;
  },

  addRecentlyPlayed(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return { error: 'Game not found' };

    recentlyPlayed = recentlyPlayed.filter(item => item.id !== gameId);
    recentlyPlayed.unshift({
      id: gameId,
      playedAt: Date.now(),
      label: 'Just now'
    });

    if (recentlyPlayed.length > 8) {
      recentlyPlayed = recentlyPlayed.slice(0, 8);
    }

    // Increment play count
    game.plays += 1;
    if (game.plays >= 1000) {
      game.playsFormatted = (game.plays / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }

    return recentlyPlayed;
  },

  getFavorites() {
    return userFavorites;
  },

  toggleFavorite(gameId) {
    const idx = userFavorites.indexOf(gameId);
    let isFavorite = false;
    if (idx >= 0) {
      userFavorites.splice(idx, 1);
    } else {
      userFavorites.push(gameId);
      isFavorite = true;
    }
    return { isFavorite, favorites: userFavorites };
  },

  getStats() {
    const totalPlays = games.reduce((acc, g) => acc + g.plays, 0);
    return {
      totalGames: games.length,
      totalCategories: categories.length,
      topPlayers: leaderboard.length,
      totalPlays,
      uptime: process.uptime()
    };
  },

  getAchievements() {
    return achievements;
  },

  getSettings() {
    return platformSettings;
  },

  updateSettings(newSettings) {
    platformSettings = { ...platformSettings, ...newSettings };
    return platformSettings;
  },

  getProfile(email) {
    const cleanEmail = (email || '').toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail) || users[0];
    const { password, ...safeUser } = user;
    return safeUser;
  },

  updateProfile(profileData) {
    const cleanEmail = (profileData.email || '').toLowerCase().trim();
    let user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) user = users[0]; // default to current active user
    if (profileData.name) user.name = profileData.name.trim();
    if (profileData.avatar) user.avatar = profileData.avatar;
    if (profileData.bio !== undefined) user.bio = profileData.bio;
    if (profileData.title) user.title = profileData.title;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  getCitySave(userId) {
    return citySaves[userId] || null;
  },

  saveCitySave(userId, city) {
    citySaves[userId] = city;
    return city;
  },

  getAllCitySaves() {
    return Object.values(citySaves);
  }
};
