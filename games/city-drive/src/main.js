/**
 * main.js
 * Entry point for CITY DRIVE.
 * Boots the Game instance when DOM is ready.
 */

import { Game } from './core/Game.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('Canvas #gameCanvas not found in DOM.');
    return;
  }

  try {
    // Instantiate game
    const game = new Game(canvas);
    window.cityDriveGame = game; // Exposed for debugging or platform integration
    console.log('City Drive Phase 1 initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize City Drive:', err);
  }
});

