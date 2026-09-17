/**
 * Nokia Snake - Main Application Entry Point
 * Hooks platform integration, exit triggers, audio unlocking, and tab visibility events.
 */

(function() {
  'use strict';

  function initApp() {
    console.log('🐍 Nokia Snake initialized.');

    // Audio unlock on first user gesture anywhere
    const unlockAudio = () => {
      if (window.NokiaSnake.audio) {
        window.NokiaSnake.audio.resume();
      }
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    // Exit Button to InfinityPlay Platform
    const exitBtn = document.getElementById('btnExitPortal');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        // If embedded in InfinityPlay iframe
        if (window.parent && window.parent !== window) {
          e.preventDefault();
          window.parent.postMessage({ type: 'exitGame' }, '*');
        }
      });
    }

    // Auto-pause when page loses focus / tab switches
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (window.NokiaSnake.engine && window.NokiaSnake.engine.state === 'PLAYING') {
          window.NokiaSnake.engine.pause();
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
