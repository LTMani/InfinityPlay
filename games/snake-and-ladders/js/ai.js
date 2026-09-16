/**
 * Snake & Ladders - AI Opponent Controller
 * Manages automated AI decisions, fair rolls, natural pauses, and interrupt handling.
 */

(function() {
  'use strict';

  class AIPlayer {
    constructor() {
      this.pendingTimeout = null;
      this.isExecuting = false;
    }

    /**
     * Executes the AI turn with realistic natural pause.
     */
    takeTurn(player, difficulty = 'medium', onRollTriggered) {
      this.cancel();
      this.isExecuting = true;

      // Natural thinking delays
      const delays = {
        easy: 1200,
        medium: 900,
        hard: 600
      };
      const delay = delays[difficulty] || 900;

      // Small jitter for natural feel
      const jitter = Math.floor(Math.random() * 200) - 100;
      const finalDelay = Math.max(400, delay + jitter);

      return new Promise((resolve) => {
        this.pendingTimeout = setTimeout(async () => {
          this.pendingTimeout = null;
          if (!this.isExecuting) {
            resolve(null);
            return;
          }

          if (typeof onRollTriggered === 'function') {
            onRollTriggered(player);
          }

          if (window.SNDice) {
            const rollValue = await window.SNDice.roll();
            this.isExecuting = false;
            resolve(rollValue);
          } else {
            this.isExecuting = false;
            resolve(Math.floor(Math.random() * 6) + 1);
          }
        }, finalDelay);
      });
    }

    /**
     * Cancels any pending AI turn execution (e.g. on game pause or exit).
     */
    cancel() {
      if (this.pendingTimeout) {
        clearTimeout(this.pendingTimeout);
        this.pendingTimeout = null;
      }
      this.isExecuting = false;
    }
  }

  window.SNAI = new AIPlayer();
})();
