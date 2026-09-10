/**
 * InfinityPlay - Search Feature
 * Handles real-time search across games and categories
 */

(function() {
  const Search = {
    init() {
      this.searchInput = document.getElementById('searchInput');
      this.searchDropdown = document.getElementById('searchDropdown');
      if (!this.searchInput || !this.searchDropdown) return;

      this.bindEvents();
    },

    bindEvents() {
      // Input event with debounce
      this.searchInput.addEventListener('input', window.InfinityPlay.Helpers.debounce((e) => {
        const query = e.target.value.trim().toLowerCase();
        this.performSearch(query);
      }, 150));

      // Focus event
      this.searchInput.addEventListener('focus', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length > 0) {
          this.performSearch(query);
        }
      });

      // Keyboard navigation: Enter to filter grid, Escape to close
      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = this.searchInput.value.trim().toLowerCase();
          this.searchDropdown.classList.remove('active');
          window.InfinityPlay.Filtering.filterByQuery(query);
          const gamesSection = document.getElementById('allGamesSection');
          if (gamesSection) gamesSection.scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'Escape') {
          this.searchDropdown.classList.remove('active');
          this.searchInput.blur();
        }
      });

      // Click outside to close
      document.addEventListener('click', (e) => {
        if (!this.searchInput.contains(e.target) && !this.searchDropdown.contains(e.target)) {
          this.searchDropdown.classList.remove('active');
        }
      });
    },

    performSearch(query) {
      if (!query || query.length === 0) {
        this.searchDropdown.classList.remove('active');
        return;
      }

      const games = window.InfinityPlay.gamesData;
      const matches = games.filter(game => {
        const nameMatch = game.name.toLowerCase().includes(query);
        const catMatch = game.category.toLowerCase().includes(query);
        const tagMatch = game.tags.some(t => t.toLowerCase().includes(query));
        return nameMatch || catMatch || tagMatch;
      });

      this.renderDropdown(matches, query);
    },

    renderDropdown(matches, query) {
      if (matches.length === 0) {
        this.searchDropdown.innerHTML = `
          <div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 0.82rem;">
            No games matching "<strong>${query}</strong>"
          </div>
        `;
        this.searchDropdown.classList.add('active');
        return;
      }

      this.searchDropdown.innerHTML = matches.slice(0, 6).map(game => {
        return `
          <div class="search-result-item" data-game-id="${game.id}">
            <img src="${game.thumbnail}" alt="${game.name}" class="search-result-thumb">
            <div class="search-result-info">
              <span class="search-result-title">${game.name}</span>
              <div class="search-result-meta">
                <span>${game.category}</span>
                <span>•</span>
                <span style="color: var(--color-gold);">★ ${game.rating.toFixed(1)}</span>
                <span>•</span>
                <span>${game.playsFormatted} plays</span>
              </div>
            </div>
            <button class="btn btn-play" style="padding: 4px 12px; font-size: 0.78rem;">Play</button>
          </div>
        `;
      }).join('');

      this.searchDropdown.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const gameId = item.getAttribute('data-game-id');
          this.searchDropdown.classList.remove('active');
          window.InfinityPlay.App.launchGameModal(gameId);
        });
      });

      this.searchDropdown.classList.add('active');
    }
  };

  window.InfinityPlay = window.InfinityPlay || {};
  window.InfinityPlay.Search = Search;
})();
