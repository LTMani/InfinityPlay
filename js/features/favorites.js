/**
 * InfinityPlay - Favorites & "My Games" Feature
 */

(function() {
  const Favorites = {
    isMyGamesActive: false,

    init() {
      this.updateHeaderBadge();

      window.addEventListener('favoritesUpdated', () => {
        this.updateHeaderBadge();
        if (this.isMyGamesActive) {
          this.renderMyGames();
        }
      });
    },

    updateHeaderBadge() {
      const favs = window.InfinityPlay.Storage.getFavorites();
      const badge = document.getElementById('myGamesCountBadge');
      if (badge) {
        badge.textContent = favs.length;
        badge.style.display = favs.length > 0 ? 'inline-flex' : 'none';
      }
    },

    toggleMyGamesView() {
      this.isMyGamesActive = !this.isMyGamesActive;
      const myGamesBtn = document.getElementById('myGamesBtn');
      if (myGamesBtn) {
        myGamesBtn.classList.toggle('active', this.isMyGamesActive);
      }

      if (this.isMyGamesActive) {
        this.renderMyGames();
        const section = document.getElementById('allGamesSection');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
        window.InfinityPlay.Helpers.showToast('Showing your saved games', 'favorite');
      } else {
        window.InfinityPlay.Filtering.clearFilter();
      }
    },

    renderMyGames() {
      const favs = window.InfinityPlay.Storage.getFavorites();
      const games = window.InfinityPlay.gamesData.filter(g => favs.includes(g.id));
      
      window.InfinityPlay.Filtering.updateActiveFilterUI(`My Games (${games.length})`);
      window.InfinityPlay.GameCard.renderAllGames(games);
    }
  };

  window.InfinityPlay = window.InfinityPlay || {};
  window.InfinityPlay.Favorites = Favorites;
})();
