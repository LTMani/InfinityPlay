/**
 * InfinityPlay Ultimate Racing - Bootstrap & Canvas Orchestrator
 */

(function() {
  function initGame() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
      console.error('Canvas element #gameCanvas not found!');
      return;
    }

    // Set high-resolution display scaling
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      if (window.UR?.game?.renderer) {
        window.UR.game.renderer.resize(canvas.width, canvas.height);
      }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Bootstrap Game
    const game = new window.UR.GameManager();
    window.UR.game = game;
    game.init(canvas);

    // Initial audio prompt resume on first click
    const startPrompt = () => {
      if (window.UR?.audio) {
        window.UR.audio.init();
      }
    };
    window.addEventListener('click', startPrompt, { once: true });
    window.addEventListener('keydown', startPrompt, { once: true });

    console.log('⚡ Ultimate Racing bootstrapped successfully.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }
})();

