/**
 * InfinityPlay - Recently Played Feature
 */

(function() {
  const RecentlyPlayed = {
    init() {
      this.render();

      window.addEventListener('recentlyPlayedUpdated', () => {
        this.render();
      });
    },

    render(containerId = 'recentlyPlayedList') {
      const container = document.getElementById(containerId);
      if (!container) return;

      const recentList = window.InfinityPlay.Storage.getRecentlyPlayed();
      const allGames = window.InfinityPlay.gamesData;

      if (!recentList || recentList.length === 0) {
        container.innerHTML = `
          <div style="font-size: 0.78rem; color: var(--text-muted); padding: 8px 0;">
            No games played yet. Click "Play" on any game to start!
          </div>
        `;
        return;
      }

      container.innerHTML = recentList.slice(0, 4).map(item => {
        const game = allGames.find(g => g.id === item.id);
        if (!game) return '';

        const timeLabel = item.label || window.InfinityPlay.Storage.formatTimeAgo(item.playedAt);

        return `
          <div class="recent-game-item" data-game-id="${game.id}" title="Play ${game.name}">
            <img src="${game.thumbnail}" alt="${game.name}" class="recent-game-thumb" loading="lazy">
            <div class="recent-game-info">
              <span class="recent-game-title">${game.name}</span>
              <span class="recent-game-time">${timeLabel}</span>
            </div>
          </div>
        `;
      }).join('');

      container.querySelectorAll('.recent-game-item').forEach(el => {
        el.addEventListener('click', () => {
          const gameId = el.getAttribute('data-game-id');
          if (gameId) {
            window.InfinityPlay.App.launchGameModal(gameId);
          }
        });
      });
    }
  };

  window.InfinityPlay = window.InfinityPlay || {};
  window.InfinityPlay.RecentlyPlayed = RecentlyPlayed;
})();
