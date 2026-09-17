// AIPlayer.js - Automated Opponent with Difficulty Settings & Natural Timing

export class AIPlayer {
  constructor(gameEngine, onRollRequest) {
    this.gameEngine = gameEngine;
    this.onRollRequest = onRollRequest;
    this.isThinking = false;

    this.gameEngine.on('turnChange', ({ player }) => {
      if (player && player.isAI && this.gameEngine.canRoll()) {
        this.queueAITurn(player);
      }
    });

    this.gameEngine.on('stateChange', ({ state }) => {
      if (state === 'IDLE') {
        const player = this.gameEngine.getCurrentPlayer();
        if (player && player.isAI && !this.isThinking) {
          this.queueAITurn(player);
        }
      }
    });
  }

  queueAITurn(player) {
    if (this.isThinking) return;
    this.isThinking = true;

    const difficulty = this.gameEngine.aiDifficulty || 'medium';
    let delay = 1200;

    if (difficulty === 'easy') {
      delay = 1400 + Math.random() * 400;
    } else if (difficulty === 'medium') {
      delay = 950 + Math.random() * 300;
    } else if (difficulty === 'hard') {
      delay = 700 + Math.random() * 200;
    }

    setTimeout(() => {
      if (
        this.gameEngine.state === 'IDLE' &&
        this.gameEngine.getCurrentPlayer()?.id === player.id &&
        !this.gameEngine.winner
      ) {
        this.isThinking = false;
        if (this.onRollRequest) {
          this.onRollRequest();
        }
      } else {
        this.isThinking = false;
      }
    }, delay);
  }
}
