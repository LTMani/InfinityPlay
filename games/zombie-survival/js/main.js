/**
 * Zombie Survival - Main Initialization Entry Point
 * Mounts the Canvas, initializes engine, listens for parent window events.
 */

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('[ZombieSurvival] Game canvas not found!');
    return;
  }

  // Instantiate global game engine
  window.gameInstance = new GameEngine();
  window.gameInstance.init(canvas);

  // Parent window postMessage listener for embedded iframe on InfinityPlay
  window.addEventListener('message', (e) => {
    if (!e.data) return;

    if (e.data.type === 'parentKeyEvent') {
      const keyEvent = new KeyboardEvent('keydown', {
        key: e.data.key,
        code: e.data.code,
        bubbles: true
      });
      window.dispatchEvent(keyEvent);
    }
  });

  // Prevent default arrow key / space page scrolling
  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
  }, { passive: false });

  console.log('⚡ Zombie Survival initialized successfully.');
});

