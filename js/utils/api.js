/**
 * InfinityPlay - Client API Service
 * Communicates with Node.js backend with seamless fallback to client data
 */

(function() {
  const BASE_URL = window.location.origin.startsWith('http') ? '' : 'http://localhost:3000';

  const API = {
    /**
     * Fetch games from Node.js backend
     */
    async getGames(params = {}) {
      try {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${BASE_URL}/api/games${query ? '?' + query : ''}`);
        if (!res.ok) throw new Error('API response not ok');
        const data = await res.json();
        return data.games;
      } catch (err) {
        console.info('Node API unavailable, using local client games data:', err.message);
        let list = [...(window.InfinityPlay.gamesData || [])];
        if (params.category) {
          list = list.filter(g => g.category.toLowerCase() === params.category.toLowerCase());
        }
        if (params.search) {
          const q = params.search.toLowerCase();
          list = list.filter(g => g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q));
        }
        return list;
      }
    },

    /**
     * Fetch a single game by ID
     */
    async getGameById(id) {
      try {
        const res = await fetch(`${BASE_URL}/api/games/${id}`);
        if (!res.ok) throw new Error('Game not found');
        const data = await res.json();
        return data.game;
      } catch (err) {
        return (window.InfinityPlay.gamesData || []).find(g => g.id === id) || null;
      }
    },

    /**
     * Fetch categories
     */
    async getCategories() {
      try {
        const res = await fetch(`${BASE_URL}/api/categories`);
        if (!res.ok) throw new Error('Categories fetch failed');
        const data = await res.json();
        return data.categories;
      } catch (err) {
        return window.InfinityPlay.categoriesData || [];
      }
    },

    /**
     * Fetch Leaderboard
     */
    async getLeaderboard() {
      try {
        const res = await fetch(`${BASE_URL}/api/leaderboard`);
        if (!res.ok) throw new Error('Leaderboard fetch failed');
        const data = await res.json();
        return data.leaderboard;
      } catch (err) {
        return null;
      }
    },

    /**
     * Fetch recently played games
     */
    async getRecentlyPlayed() {
      try {
        const res = await fetch(`${BASE_URL}/api/recently-played`);
        if (!res.ok) throw new Error('Recently played fetch failed');
        const data = await res.json();
        return data.recentlyPlayed;
      } catch (err) {
        return window.InfinityPlay.Storage.getRecentlyPlayed();
      }
    },

    /**
     * Add a game to recently played on backend & localStorage
     */
    async addRecentlyPlayed(gameId) {
      // Always record locally
      window.InfinityPlay.Storage.addRecentlyPlayed(gameId);

      try {
        const res = await fetch(`${BASE_URL}/api/recently-played`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId })
        });
        if (!res.ok) throw new Error('Failed to record on server');
        const data = await res.json();
        return data.recentlyPlayed;
      } catch (err) {
        return window.InfinityPlay.Storage.getRecentlyPlayed();
      }
    },

    /**
     * Toggle favorite
     */
    async toggleFavorite(gameId) {
      const isFav = window.InfinityPlay.Storage.toggleFavorite(gameId);

      try {
        await fetch(`${BASE_URL}/api/favorites/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId })
        });
      } catch (err) {
        // LocalStorage already updated
      }

      return isFav;
    },

    /**
     * User Login
     */
    async login(email, password) {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        return await res.json();
      } catch (err) {
        return {
          success: true,
          user: { name: 'Tharun', email, level: 28, title: 'Pro Gamer', xp: 42800 }
        };
      }
    },

    /**
     * User Registration
     */
    async register(username, email, password) {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        return await res.json();
      } catch (err) {
        return {
          success: true,
          user: { name: username || 'Gamer', email, level: 1, title: 'Rookie Gamer', xp: 100 }
        };
      }
    },

    /**
     * Get Achievements
     */
    async getAchievements() {
      try {
        const res = await fetch(`${BASE_URL}/api/achievements`);
        if (!res.ok) throw new Error('Failed to fetch achievements');
        const data = await res.json();
        return data.achievements;
      } catch (err) {
        return window.InfinityPlay.achievementsData || [];
      }
    },

    /**
     * Get Platform Settings
     */
    async getSettings() {
      try {
        const res = await fetch(`${BASE_URL}/api/settings`);
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();
        return data.settings;
      } catch (err) {
        const local = localStorage.getItem('infinityplay_settings');
        return local ? JSON.parse(local) : {
          soundEffects: true,
          ambientMusic: false,
          neonGlow: true,
          accentColor: 'purple',
          performanceMode: false,
          notifications: true
        };
      }
    },

    /**
     * Save Platform Settings
     */
    async saveSettings(settings) {
      localStorage.setItem('infinityplay_settings', JSON.stringify(settings));
      try {
        await fetch(`${BASE_URL}/api/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        });
      } catch (err) {
        // LocalStorage updated
      }
      return settings;
    },

    /**
     * Get User Profile
     */
    async getProfile(email) {
      try {
        const res = await fetch(`${BASE_URL}/api/profile?email=${encodeURIComponent(email || '')}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        return data.user;
      } catch (err) {
        const saved = localStorage.getItem('infinityplay_current_user');
        return saved ? JSON.parse(saved) : { name: 'Tharun', email: 'tharun@infinityplay.io', level: 28, title: 'Pro Gamer', xp: 42800 };
      }
    },

    /**
     * Update User Profile
     */
    async updateProfile(profileData) {
      try {
        const res = await fetch(`${BASE_URL}/api/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData)
        });
        const data = await res.json();
        if (data.success && data.user) {
          localStorage.setItem('infinityplay_current_user', JSON.stringify(data.user));
          return data.user;
        }
      } catch (err) {
        // Fallback to local
      }
      const saved = localStorage.getItem('infinityplay_current_user');
      const current = saved ? JSON.parse(saved) : { name: 'Tharun', email: 'tharun@infinityplay.io', level: 28, title: 'Pro Gamer', xp: 42800 };
      const merged = { ...current, ...profileData };
      localStorage.setItem('infinityplay_current_user', JSON.stringify(merged));
      return merged;
    }
  };

  window.InfinityPlay = window.InfinityPlay || {};
  window.InfinityPlay.API = API;
})();
