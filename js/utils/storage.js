/**
 * InfinityPlay - LocalStorage Utility
 * Manages favorites and recently played state
 */

(function() {
  const FAVORITES_KEY = 'infinityplay_favorites';
  const RECENTLY_PLAYED_KEY = 'infinityplay_recently_played';

  const REMOVED_GAME_IDS = new Set([
    'sports-football-legends',
    'football-legends',
    'survival-island',
    'puzzle-master',
    'tower-defense',
    'farm-life',
    'speed-arena',
    'shadow-adventure'
  ]);

  const defaultRecentlyPlayed = [
    { id: 'ultimate-racing', playedAt: Date.now() - 2 * 60 * 60 * 1000, label: 'Played 2 hours ago' },
    { id: 'city-drive', playedAt: Date.now() - 5 * 60 * 60 * 1000, label: 'Played 5 hours ago' },
    { id: 'tic-tac-toe', playedAt: Date.now() - 24 * 60 * 60 * 1000, label: 'Played 1 day ago' },
    { id: 'city-builder', playedAt: Date.now() - 48 * 60 * 60 * 1000, label: 'Played 2 days ago' }
  ];

  const Storage = {
    getFavorites() {
      try {
        const data = localStorage.getItem(FAVORITES_KEY);
        let list = data ? JSON.parse(data) : ['ultimate-racing', 'city-builder'];
        if (!Array.isArray(list)) list = ['ultimate-racing', 'city-builder'];
        const filtered = list.filter(id => typeof id === 'string' && !REMOVED_GAME_IDS.has(id));
        if (filtered.length !== list.length) {
          this.saveFavorites(filtered);
        }
        return filtered;
      } catch (e) {
        return ['ultimate-racing', 'city-builder'];
      }
    },

    saveFavorites(favorites) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { favorites } }));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
    },

    isFavorite(gameId) {
      return this.getFavorites().includes(gameId);
    },

    toggleFavorite(gameId) {
      const favs = this.getFavorites();
      const index = favs.indexOf(gameId);
      if (index >= 0) {
        favs.splice(index, 1);
      } else {
        favs.push(gameId);
      }
      this.saveFavorites(favs);
      return index < 0;
    },

    getRecentlyPlayed() {
      try {
        const data = localStorage.getItem(RECENTLY_PLAYED_KEY);
        if (!data) {
          this.saveRecentlyPlayed(defaultRecentlyPlayed);
          return defaultRecentlyPlayed;
        }
        let list = JSON.parse(data);
        if (!Array.isArray(list)) {
          this.saveRecentlyPlayed(defaultRecentlyPlayed);
          return defaultRecentlyPlayed;
        }
        const filtered = list.filter(item => item && item.id && !REMOVED_GAME_IDS.has(item.id));
        if (filtered.length !== list.length) {
          this.saveRecentlyPlayed(filtered);
        }
        return filtered;
      } catch (e) {
        return defaultRecentlyPlayed;
      }
    },

    saveRecentlyPlayed(list) {
      try {
        localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent('recentlyPlayedUpdated', { detail: { list } }));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
    },

    addRecentlyPlayed(gameId) {
      let list = this.getRecentlyPlayed().filter(item => item.id !== gameId);
      list.unshift({
        id: gameId,
        playedAt: Date.now(),
        label: 'Just now'
      });
      if (list.length > 8) {
        list = list.slice(0, 8);
      }
      this.saveRecentlyPlayed(list);
    },

    formatTimeAgo(timestamp) {
      if (!timestamp) return 'Recently';
      const diffSec = Math.floor((Date.now() - timestamp) / 1000);
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return 'Played ' + diffMin + ' min ago';
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return 'Played ' + diffHours + (diffHours > 1 ? ' hours' : ' hour') + ' ago';
      const diffDays = Math.floor(diffHours / 24);
      return 'Played ' + diffDays + (diffDays > 1 ? ' days' : ' day') + ' ago';
    }
  };

  window.InfinityPlay = window.InfinityPlay || {};
  window.InfinityPlay.Storage = Storage;
})();
