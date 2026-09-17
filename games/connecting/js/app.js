/**
 * CONNECTING Puzzle Game - Application Bootstrap & Event Wire-Up
 */

(function() {
  'use strict';

  function initApp() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
      console.error('Game canvas element not found!');
      return;
    }

    // Initialize sound settings
    const settings = window.ConnectingStorage.getSettings();
    window.ConnectingAudio.setEnabled(settings.sound);
    window.ConnectingUI.updateSoundButtonUI();

    // Create Renderer
    const renderer = new window.BoardRenderer(canvas);
    window.ConnectingRenderer = renderer;

    // Create Input Controller
    const input = new window.InputController(canvas, renderer);
    window.ConnectingInput = input;

    // Responsive Canvas Resize
    function handleResize() {
      const container = document.getElementById('board-container');
      if (!container) return;

      const availWidth = Math.min(container.clientWidth, window.innerWidth - 24);
      // Give space for header and HUD
      const availHeight = window.innerHeight - 220;
      const targetSize = Math.max(260, Math.min(availWidth, availHeight, 560));

      renderer.resize(targetSize);
    }

    window.addEventListener('resize', handleResize);

    // Wire Engine Callbacks
    const engine = window.ConnectingEngine;

    engine.onStateChange = function(type, eng) {
      window.ConnectingUI.updateHUD(type, eng);
      renderer.render();
    };

    engine.onLevelComplete = function(data) {
      window.ConnectingUI.showWinModal(data);
    };

    // Auto-pause when user switches browser tabs
    document.addEventListener('visibilitychange', function() {
      if (document.hidden && engine.status === 'PLAYING') {
        engine.pauseGame();
        window.ConnectingUI.showModal(window.ConnectingUI.modalPause);
      }
    });

    // Start with the highest unlocked level or level 1
    const unlocked = window.ConnectingStorage.data.unlockedLevels;
    const initialLevelId = unlocked[unlocked.length - 1] || 1;

    handleResize();
    engine.loadLevel(initialLevelId);

    console.log('CONNECTING puzzle game initialized successfully on Level ' + initialLevelId);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
