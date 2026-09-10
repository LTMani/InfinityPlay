/**
 * InfinityPlay - Sidebar Navigation Component
 */

(function() {
  const Sidebar = {
    init() {
      this.bindNavLinks();
      this.bindCategoryLinks();
      this.bindPromoButton();
    },

    bindNavLinks() {
      const navLinks = document.querySelectorAll('.nav-link[data-nav]');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          const navTarget = link.getAttribute('data-nav');
          if (navTarget === 'home') {
            window.InfinityPlay.Filtering.clearFilter();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (navTarget === 'games') {
            const section = document.getElementById('allGamesSection');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
          } else if (navTarget === 'popular') {
            const section = document.getElementById('topGamesSection');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
          } else if (navTarget === 'new-games') {
            window.InfinityPlay.Filtering.sortByNewest();
          } else if (navTarget === 'rankings') {
            const leaderboard = document.querySelector('.right-sidebar');
            if (leaderboard) leaderboard.scrollIntoView({ behavior: 'smooth' });
          } else if (navTarget === 'profile') {
            window.InfinityPlay.App.openProfileModal();
          } else if (navTarget === 'settings') {
            window.InfinityPlay.App.openSettingsModal();
          } else if (navTarget === 'achievements') {
            window.InfinityPlay.App.openAchievementsModal();
          }

          // Close sidebar on mobile
          const sidebar = document.getElementById('leftSidebar');
          const overlay = document.getElementById('sidebarOverlay');
          if (sidebar && overlay && window.innerWidth <= 1024) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
          }
        });
      });
    },

    bindCategoryLinks() {
      const catLinks = document.querySelectorAll('.nav-link[data-category]');
      catLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const category = link.getAttribute('data-category');
          window.InfinityPlay.Filtering.filterByCategory(category);

          // Update active link
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          // Scroll to games
          const section = document.getElementById('allGamesSection');
          if (section) section.scrollIntoView({ behavior: 'smooth' });

          // Close sidebar on mobile
          const sidebar = document.getElementById('leftSidebar');
          const overlay = document.getElementById('sidebarOverlay');
          if (sidebar && overlay && window.innerWidth <= 1024) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
          }
        });
      });
    },

    bindPromoButton() {
      const promoBtn = document.getElementById('sidebarSignInBtn');
      if (promoBtn) {
        promoBtn.addEventListener('click', () => {
          window.InfinityPlay.App.openAuthModal('signin');
        });
      }
    }
  };

  window.InfinityPlay = window.InfinityPlay || {};
  window.InfinityPlay.Sidebar = Sidebar;
})();
