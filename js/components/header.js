/**
 * InfinityPlay - Header Component
 */

(function() {
  const Header = {
    init() {
      this.bindSidebarToggle();
      this.bindNotifications();
      this.bindProfileMenu();
      this.bindKeyboardShortcut();
      this.bindMyGamesButton();
      this.bindBrandLogo();
      this.bindBlockMergeLogo();
    },

    bindSidebarToggle() {
      const hamburger = document.getElementById('hamburgerBtn');
      const sidebar = document.getElementById('leftSidebar');
      const overlay = document.getElementById('sidebarOverlay');

      if (hamburger && sidebar && overlay) {
        hamburger.addEventListener('click', () => {
          sidebar.classList.toggle('open');
          overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
          sidebar.classList.remove('open');
          overlay.classList.remove('active');
        });
      }
    },

    bindNotifications() {
      const btn = document.getElementById('notificationBtn');
      const dropdown = document.getElementById('notificationDropdown');

      if (btn && dropdown) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.classList.toggle('active');
          const profileMenu = document.getElementById('profileDropdown');
          if (profileMenu) profileMenu.classList.remove('active');
        });

        document.addEventListener('click', (e) => {
          if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
            dropdown.classList.remove('active');
          }
        });
      }
    },

    bindProfileMenu() {
      const trigger = document.getElementById('profileTrigger');
      const menu = document.getElementById('profileDropdown');

      if (trigger && menu) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          menu.classList.toggle('active');
          const notif = document.getElementById('notificationDropdown');
          if (notif) notif.classList.remove('active');
        });

        document.addEventListener('click', (e) => {
          if (!menu.contains(e.target) && !trigger.contains(e.target)) {
            menu.classList.remove('active');
          }
        });
      }
    },

    bindKeyboardShortcut() {
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        window.addEventListener('keydown', (e) => {
          if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
          }
        });
      }
    },

    bindMyGamesButton() {
      const btn = document.getElementById('myGamesBtn');
      if (btn) {
        btn.addEventListener('click', () => {
          window.InfinityPlay.Favorites.toggleMyGamesView();
        });
      }
    },

    bindBrandLogo() {
      const logo = document.getElementById('brandLogo');
      if (logo) {
        logo.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.InfinityPlay.Filtering) {
            window.InfinityPlay.Filtering.clearFilter();
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    },

    bindBlockMergeLogo() {
      const launchBlockMerge = (e) => {
        e.preventDefault();
        const games = (window.InfinityPlay && window.InfinityPlay.gamesData) || [];
        const game = games.find(g => g.id === 'block-merge') || {
          id: 'block-merge',
          name: 'Block Merge',
          gameUrl: 'games/block-merge/index.html',
          playMode: 'embed'
        };

        if (window.InfinityPlay && window.InfinityPlay.App && typeof window.InfinityPlay.App.launchEmbeddedGame === 'function') {
          window.InfinityPlay.App.launchEmbeddedGame(game);
        } else {
          window.location.href = 'games/block-merge/index.html';
        }
      };

      const headerLogo = document.getElementById('headerBlockMergeLogo');
      if (headerLogo) {
        headerLogo.addEventListener('click', launchBlockMerge);
      }

      const sidebarBtn = document.getElementById('sidebarBlockMergeBtn');
      if (sidebarBtn) {
        sidebarBtn.addEventListener('click', launchBlockMerge);
      }
    }
  };

  window.InfinityPlay = window.InfinityPlay || {};
  window.InfinityPlay.Header = Header;
})();
