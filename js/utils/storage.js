/**
 * InfinityPlay - LocalStorage Utility
 * Manages favorites and recently played state
 */

(function() {
  const FAVORITES_KEY = 'infinityplay_favorites';
  const RECENTLY_PLAYED_KEY = 'infinityplay_recently_played';

  const defaultRecentlyPlayed = [
    { id: 'ultimate-racing', playedAt: Date.now() - 2 * 60 * 60 * 1000, label: 'Played 2 hours ago' },
    { id: 'puzzle-master', playedAt: Date.now() - 5 * 60 * 60 * 1000, label: 'Played 5 hours ago' },
    { id: 'football-legends', playedAt: Date.now() - 24 * 60 * 60 * 1000, label: 'Played 1 day ago' },
    { id: 'farm-life', playedAt: Date.now() - 48 * 60 * 60 * 1000, label: 'Played 2 days ago' }
  ];

  const Storage = {
    getFavorites() {
      try {
        const data = localStorage.getItem(FAVORITES_KEY);
        return data ? JSON.parse(data) : ['ultimate-racing', 'city-builder'];
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
        return JSON.parse(data);
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
