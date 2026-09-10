/**
 * InfinityPlay - Helper Utilities
 */

(function() {
  const Helpers = {
    /**
     * Formats play count numbers into compact strings (e.g. 12000 -> 12K)
     */
    formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
      }
      return Number(num).toLocaleString();
    },

    /**
     * Formats XP scores (e.g. 98450 -> 98,450)
     */
    formatXP(xp) {
      return Number(xp).toLocaleString();
    },

    /**
     * Returns an SVG star icon
     */
    renderStarIcon() {
      return `<svg class="star-icon" viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>`;
    },

    /**
     * Debounce function for inputs
     */
    debounce(func, wait = 250) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },

    /**
     * Show responsive toast notification
     */
    showToast(message, type = 'info') {
      let container = document.getElementById('toastContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      let icon = 'ℹ';
      if (type === 'success') icon = '✓';
      if (type === 'warning') icon = '⚠';
      if (type === 'favorite') icon = '❤';

      toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
      `;

      container.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3200);
    }
  };

  window.InfinityPlay = window.InfinityPlay || {};
  window.InfinityPlay.Helpers = Helpers;
})();
