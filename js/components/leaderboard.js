/**
 * InfinityPlay - Leaderboard & Right Sidebar Component
 */

(function() {
  const topPlayersData = [
    {
      rank: 1,
      name: 'Alex Gamer',
      title: 'Gaming Legend',
      xp: 98450,
      avatar: 'assets/avatars/avatar_alex.png'
    },
    {
      rank: 2,
      name: 'ShadowX',
      title: 'Pro Player',
      xp: 87320,
      avatar: 'assets/avatars/avatar_shadowx.png'
    },
    {
      rank: 3,
      name: 'MaxPlay',
      title: 'Elite Gamer',
      xp: 76890,
      avatar: 'assets/avatars/avatar_maxplay.png'
    },
    {
      rank: 4,
      name: 'NeoKing',
      title: 'Rising Star',
      xp: 64220,
      avatar: 'assets/avatars/avatar_neoking.png'
    },
    {
      rank: 5,
      name: 'GameBeast',
      title: 'Pro Challenger',
      xp: 58410,
      avatar: 'assets/avatars/avatar_gamebeast.png'
    }
  ];

  const Leaderboard = {
    init() {
      this.renderTopPlayers();
      this.bindPromoButton();
    },

    renderTopPlayers(containerId = 'topPlayersList') {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = topPlayersData.map(player => {
        return `
          <div class="player-item" data-player="${player.name}">
            <div class="player-left">
              <div class="player-rank-shield rank-${player.rank}">
                ${player.rank}
              </div>
              <div class="player-avatar-wrapper rank-${player.rank}">
                <img src="${player.avatar}" alt="${player.name}" class="player-avatar-img">
              </div>
              <div class="player-details">
                <span class="player-name">${player.name}</span>
                <span class="player-title">${player.title}</span>
              </div>
            </div>
            <span class="player-xp">${window.InfinityPlay.Helpers.formatXP(player.xp)}</span>
          </div>
        `;
      }).join('');

      container.querySelectorAll('.player-item').forEach(item => {
        item.addEventListener('click', () => {
          const playerName = item.getAttribute('data-player');
          window.InfinityPlay.Helpers.showToast(`Viewing ${playerName}'s profile`, 'info');
        });
      });
    },

    bindPromoButton() {
      const createBtn = document.getElementById('promoCreateAccountBtn');
      if (createBtn) {
        createBtn.addEventListener('click', () => {
          window.InfinityPlay.App.openAuthModal('signup');
        });
      }
    }
  };

  window.InfinityPlay = window.InfinityPlay || {};
  window.InfinityPlay.Leaderboard = Leaderboard;
})();
