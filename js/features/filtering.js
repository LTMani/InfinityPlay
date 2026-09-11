/**
 * InfinityPlay - Category & Filter Feature
 */

(function() {
  const Filtering = {
    currentCategory: null,
    currentQuery: null,

    init() {
      this.bindCategoryCards();
      this.bindViewAllLinks();
    },

    bindCategoryCards() {
      const cards = document.querySelectorAll('.category-card');
      cards.forEach(card => {
        card.addEventListener('click', () => {
          const category = card.getAttribute('data-category');
          if (this.currentCategory === category) {
            // Toggle off
            this.clearFilter();
          } else {
            this.filterByCategory(category);
          }
        });
      });
    },

    bindViewAllLinks() {
      const viewAllCategories = document.getElementById('viewAllCategoriesBtn');
      if (viewAllCategories) {
        viewAllCategories.addEventListener('click', (e) => {
          e.preventDefault();
          this.clearFilter();
          window.InfinityPlay.Helpers.showToast('Showing all categories', 'info');
        });
      }

      const viewAllTopGames = document.getElementById('viewAllTopGamesBtn');
      if (viewAllTopGames) {
        viewAllTopGames.addEventListener('click', (e) => {
          e.preventDefault();
          this.sortByPopular();
          const section = document.getElementById('allGamesSection');
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
      }

      const viewAllGames = document.getElementById('viewAllGamesBtn');
      if (viewAllGames) {
        viewAllGames.addEventListener('click', (e) => {
          e.preventDefault();
          this.clearFilter();
          const section = document.getElementById('allGamesSection');
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
      }
    },

    filterByCategory(category) {
      this.currentCategory = category;
      this.currentQuery = null;

      // Update active state on category cards
      document.querySelectorAll('.category-card').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-category') === category);
      });

      // Update active state on sidebar links
      document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.getAttribute('data-category') === category);
      });

      // Filter games
      const filtered = window.InfinityPlay.gamesData.filter(g => 
        g.category.toLowerCase() === category.toLowerCase()
      );

      this.updateActiveFilterUI(`Category: ${category}`);
      window.InfinityPlay.GameCard.renderAllGames(filtered);
    },

    filterByQuery(query) {
      this.currentQuery = query;
      this.currentCategory = null;

      // Clear card active states
      document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));

      const filtered = window.InfinityPlay.gamesData.filter(game => {
        const nameMatch = game.name.toLowerCase().includes(query);
        const catMatch = game.category.toLowerCase().includes(query);
        const tagMatch = game.tags.some(t => t.toLowerCase().includes(query));
        return nameMatch || catMatch || tagMatch;
      });

      this.updateActiveFilterUI(`Search: "${query}"`);
      window.InfinityPlay.GameCard.renderAllGames(filtered);
    },

    sortByNewest() {
      const sorted = [...window.InfinityPlay.gamesData].sort((a, b) => 
        new Date(b.releaseDate) - new Date(a.releaseDate)
      );
      this.updateActiveFilterUI('Sorted: Newest Releases');
      window.InfinityPlay.GameCard.renderAllGames(sorted);
      window.InfinityPlay.Helpers.showToast('Sorted by New Releases', 'info');
    },

    sortByPopular() {
      const sorted = [...window.InfinityPlay.gamesData].sort((a, b) => b.plays - a.plays);
      this.updateActiveFilterUI('Sorted: Most Popular');
      window.InfinityPlay.GameCard.renderAllGames(sorted);
      window.InfinityPlay.Helpers.showToast('Sorted by Most Popular', 'info');
    },

    clearFilter() {
      this.currentCategory = null;
      this.currentQuery = null;

      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.value = '';

      document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
      document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.getAttribute('data-nav') === 'home');
      });

      this.updateActiveFilterUI(null);
      window.InfinityPlay.GameCard.renderAllGames(window.InfinityPlay.gamesData);
    },

    updateActiveFilterUI(filterLabel) {
      let filterBar = document.getElementById('activeFilterBar');
      if (!filterBar) {
        const allGamesSec = document.getElementById('allGamesSection');
        if (!allGamesSec) return;
        
        filterBar = document.createElement('div');
        filterBar.id = 'activeFilterBar';
        filterBar.className = 'active-filter-bar';
        allGamesSec.querySelector('.section-header').insertAdjacentElement('afterend', filterBar);
      }

      if (!filterLabel) {
        filterBar.style.display = 'none';
        filterBar.innerHTML = '';
        return;
      }

      filterBar.style.display = 'flex';
      filterBar.innerHTML = `
        <span class="active-filter-pill">
          ${filterLabel}
          <button class="clear-filter-btn" title="Clear filter" onclick="window.InfinityPlay.Filtering.clearFilter()">✕</button>
        </span>
      `;
    }
  };

  window.InfinityPlay = window.InfinityPlay || {};
  window.InfinityPlay.Filtering = Filtering;
})();
