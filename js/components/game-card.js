/**
 * InfinityPlay - Game Card Component
 * Dynamically renders Top Games and All Games cards
 */

(function() {
  const GameCard = {
    /**
     * Renders the 4 prominent Top Games cards
     */
    renderTopGames(containerId = 'topGamesGrid') {
      const container = document.getElementById(containerId);
      if (!container) return;

      const topGames = window.InfinityPlay.gamesData.filter(g => g.isTop);
      const favs = window.InfinityPlay.Storage.getFavorites();

      container.innerHTML = topGames.map(game => {
        const isFav = favs.includes(game.id);
        const rankBadge = game.badge ? `
          <div class="rank-badge rank-${game.rank}">
            ${game.badge}
          </div>
        ` : '';

        const thumbImg = game.topThumbnail || game.thumbnail;

        return `
          <div class="top-game-card" data-game-id="${game.id}">
            <div class="top-game-media">
              ${rankBadge}
              <button class="card-fav-btn ${isFav ? 'favorited' : ''}" 
                      data-game-id="${game.id}" 
                      title="${isFav ? 'Remove from My Games' : 'Add to My Games'}">
                ${isFav ? '❤' : '♡'}
              </button>
              <img src="${thumbImg}" alt="${game.name}" class="top-game-img" loading="lazy">
            </div>

            <div class="top-game-info">
              <h3 class="top-game-title" title="${game.name}">${game.name}</h3>
              
              <div class="top-game-meta-row">
                <span class="top-game-category">${game.category}</span>
                <div class="top-game-footer">
                  <div class="top-game-rating">
                    <span class="star">★</span>
                    <span>${game.rating.toFixed(1)}</span>
                    <span class="top-game-plays-count">(${game.playsFormatted})</span>
                  </div>
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
                <button class="btn btn-play top-play-btn" data-game-id="${game.id}">
                  ▶ Play
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      this.bindCardEvents(container);
    },

    /**
     * Renders the 10 All Games cards dynamically
     */
    renderAllGames(gamesList = null, containerId = 'allGamesGrid') {
      const container = document.getElementById(containerId);
      if (!container) return;

      const games = gamesList || window.InfinityPlay.gamesData;
      const countEl = document.getElementById('allGamesCount');
      if (countEl) {
        countEl.textContent = `(${games.length})`;
      }

      if (games.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted);">
            <div style="font-size: 2.5rem; margin-bottom: 10px;">🎮</div>
            <h3 style="color: #ffffff; margin-bottom: 6px;">No games found</h3>
            <p style="font-size: 0.85rem;">Try adjusting your search query or selected category filter.</p>
            <button class="btn btn-primary" style="margin-top: 14px;" onclick="window.InfinityPlay.Filtering.clearFilter()">
              View All Games
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = games.map(game => {
        return `
          <div class="compact-game-card" data-game-id="${game.id}" title="${game.name}">
            <div class="compact-media">
              <img src="${game.thumbnail}" alt="${game.name}" class="compact-img" loading="lazy">
              <div class="compact-play-overlay">
                <span class="compact-play-icon">▶</span>
              </div>
            </div>
            <div class="compact-info">
              <div class="compact-title">${game.name}</div>
              <div class="compact-category">${game.category}</div>
              <div class="compact-rating">
                <span class="star">★</span>
                <span>${game.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      this.bindCardEvents(container);
    },

    /**
     * Binds click handlers on card elements
     */
    bindCardEvents(container) {
      // Play buttons & card clicks
      container.querySelectorAll('.top-play-btn, .compact-game-card').forEach(el => {
        el.addEventListener('click', (e) => {
          // If favorite button was clicked inside card, don't trigger play
          if (e.target.closest('.card-fav-btn')) return;

          const gameId = el.getAttribute('data-game-id') || el.closest('[data-game-id]')?.getAttribute('data-game-id');
          if (gameId) {
            window.InfinityPlay.App.launchGameModal(gameId);
          }
        });
      });

      // Favorite toggle buttons
      container.querySelectorAll('.card-fav-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const gameId = btn.getAttribute('data-game-id');
          const isNowFav = window.InfinityPlay.API
            ? await window.InfinityPlay.API.toggleFavorite(gameId)
            : window.InfinityPlay.Storage.toggleFavorite(gameId);
          
          btn.classList.toggle('favorited', isNowFav);
          btn.innerHTML = isNowFav ? '❤' : '♡';
          btn.title = isNowFav ? 'Remove from My Games' : 'Add to My Games';

          const game = window.InfinityPlay.gamesData.find(g => g.id === gameId);
          const name = game ? game.name : 'Game';
          
          window.InfinityPlay.Helpers.showToast(
            isNowFav ? `Added ${name} to My Games` : `Removed ${name} from My Games`,
            'favorite'
          );
        });
      });
    }
  };

  window.InfinityPlay = window.InfinityPlay || {};
  window.InfinityPlay.GameCard = GameCard;
})();
