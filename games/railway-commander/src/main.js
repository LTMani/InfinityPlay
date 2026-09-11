/**
 * Railway Commander - Application Entry Point
 */

import { GameEngine } from './engine/GameEngine.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('Railway Commander: Canvas element #gameCanvas not found!');
    return;
  }

  const engine = new GameEngine(canvas);
  engine.init();

  // Expose engine instance for debugging & automated testing
  window.__railwayCommander = engine;
  console.log('Railway Commander initialized successfully.');
});
