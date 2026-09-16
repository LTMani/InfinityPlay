/**
 * Snake & Ladders - Core Authoritative Game Engine
 * Orchestrates turns, step-by-step animated movement, snakes & ladders logic, exact finish rules, and win states.
 */

(function() {
  'use strict';

  class GameEngine {
    constructor() {
      this.mode = 'pvc';
      this.players = [];
      this.currentTurnIndex = 0;
      this.turnCount = 0;
      this.lastDice = 0;
      this.isGameOver = false;
      this.isMoving = false;
      this.isPaused = false;
      this.settings = {
        extraTurnOn6: true,
        exactFinish: true,
        difficulty: 'medium',
        animations: true
      };
    }

    /**
     * Initializes a fresh game with custom player configs and rule settings.
     */
    startNewGame(playerConfigs, settings = {}) {
      this.isGameOver = false;
      this.isMoving = false;
      this.isPaused = false;
      this.currentTurnIndex = 0;
      this.turnCount = 1;
      this.lastDice = 0;
      this.settings = { ...this.settings, ...settings };

      // Setup Players
      this.players = window.SNPlayerManager.setupPlayers(playerConfigs);

      // Render cells and SVG overlay
      const boardContainer = document.getElementById('boardCellsGrid');
      const tokensContainer = document.getElementById('boardTokensGrid');
      const svgOverlay = document.getElementById('boardSvg');
      if (boardContainer) window.SNBoard.renderCells(boardContainer, tokensContainer);
      if (svgOverlay) window.SNBoard.renderSvgOverlay(svgOverlay);

      // Update token positions
      window.SNPlayerManager.updateAllTokenPositions();

      // Clear previous saves
      if (window.SNStorage) {
        window.SNStorage.clearSave();
      }

      // Update UI HUD
      if (window.SNUI) {
        window.SNUI.renderPlayerStatusCards(this.players);
        window.SNUI.updateTurnBanner(this.getCurrentPlayer());
      }

      this.startTurn();
    }

    /**
     * Restores an in-progress game from saved state.
     */
    restoreSavedGame(saveData) {
      this.isGameOver = false;
      this.isMoving = false;
      this.isPaused = false;
      this.mode = saveData.mode || 'pvc';
      this.currentTurnIndex = saveData.currentTurnIndex || 0;
      this.turnCount = saveData.turnCount || 1;
      this.lastDice = saveData.lastDice || 1;
      this.settings = { ...this.settings, ...saveData.settings };

      // Setup players with preserved positions and stats
      this.players = window.SNPlayerManager.setupPlayers(saveData.players);

      // Render cells and SVG overlay
      const boardContainer = document.getElementById('boardCellsGrid');
      const tokensContainer = document.getElementById('boardTokensGrid');
      const svgOverlay = document.getElementById('boardSvg');
      if (boardContainer) window.SNBoard.renderCells(boardContainer, tokensContainer);
      if (svgOverlay) window.SNBoard.renderSvgOverlay(svgOverlay);

      // Render tokens
      window.SNPlayerManager.updateAllTokenPositions();

      if (window.SNDice) {
        window.SNDice.setFace(this.lastDice);
      }

      if (window.SNUI) {
        window.SNUI.renderPlayerStatusCards(this.players);
        window.SNUI.updateTurnBanner(this.getCurrentPlayer());
      }

      this.startTurn();
    }

    getCurrentPlayer() {
      return this.players[this.currentTurnIndex] || this.players[0];
    }

    /**
     * Initiates the turn for the active player.
     */
    async startTurn() {
      if (this.isGameOver || this.isPaused) return;

      const player = this.getCurrentPlayer();
      player.stats.turnsTaken++;

      // Highlight active token & update UI
      window.SNPlayerManager.setActivePlayer(player.id);
      if (window.SNUI) {
        window.SNUI.updateTurnBanner(player);
        window.SNUI.highlightActivePlayerCard(player.id);
      }

      if (player.isAI) {
        // AI Turn
        if (window.SNDice) window.SNDice.setDisabled(true);
        if (window.SNUI) window.SNUI.setStatusMessage(`${player.name} is rolling...`);

        const rollValue = await window.SNAI.takeTurn(player, this.settings.difficulty, () => {
          if (window.SNUI) window.SNUI.setStatusMessage(`${player.name} rolls!`);
        });

        if (rollValue !== null && !this.isGameOver && !this.isPaused) {
          this.handleRoll(rollValue);
        }
      } else {
        // Human Player Turn
        if (window.SNDice) window.SNDice.setDisabled(false);
        if (window.SNUI) window.SNUI.setStatusMessage(`Your turn, ${player.name}! Roll the dice.`);
      }
    }

    /**
     * Processes a dice roll outcome: exact finish check, step-by-step animation, encounters, and win logic.
     */
    async handleRoll(diceValue) {
      if (this.isGameOver || this.isMoving || this.isPaused) return;
      this.isMoving = true;
      this.lastDice = diceValue;

      const player = this.getCurrentPlayer();
      player.stats.rolls++;

      // Disable roll button during move execution
      if (window.SNDice) window.SNDice.setDisabled(true);

      const currentPos = player.position;
      const targetPos = currentPos + diceValue;

      // 1. EXACT FINISH RULE CHECK
      if (this.settings.exactFinish && targetPos > 100) {
        const required = 100 - currentPos;
        if (window.SNAudio) window.SNAudio.playBounce();
        if (window.SNUI) {
          window.SNUI.showEventBanner(`⚠️ Roll of ${diceValue} overshoots! Need exact roll of ${required} to win.`, 'warning');
          window.SNUI.setStatusMessage(`${player.name} needed ${required} to win. Turn consumed.`);
        }

        await this.delay(1100);
        this.finishTurn(diceValue === 6);
        return;
      }

      // 2. STEP-BY-STEP MOVEMENT ANIMATION
      const stepDelay = this.settings.animations ? 170 : 40;
      let animatedPos = currentPos;

      while (animatedPos < targetPos) {
        animatedPos++;
        player.position = animatedPos;
        if (animatedPos > player.stats.highestPos) {
          player.stats.highestPos = animatedPos;
        }

        window.SNPlayerManager.updateAllTokenPositions();
        if (window.SNAudio) window.SNAudio.playStep();
        if (window.SNUI) {
          window.SNUI.updatePlayerPositionInCard(player.id, animatedPos);
          window.SNUI.setStatusMessage(`${player.name} stepped to cell ${animatedPos}`);
        }

        await this.delay(stepDelay);
      }

      // Check if player directly reached 100
      if (player.position === 100) {
        await this.triggerVictory(player, diceValue === 1);
        return;
      }

      // 3. SNAKE OR LADDER ENCOUNTER CHECK
      const encounter = window.SNBoard.checkEncounter(player.position);
      if (encounter) {
        if (encounter.type === 'ladder') {
          player.stats.laddersHit++;
          if (window.SNStorage) window.SNStorage.recordLadder();
          if (window.SNAudio) window.SNAudio.playLadder();
          if (window.SNUI) {
            window.SNUI.showEventBanner(`🪜 LADDER! ${player.name} climbs from ${encounter.from} to ${encounter.to}!`, 'ladder');
            window.SNUI.highlightCellEffect(encounter.from, 'ladder');
          }

          await this.delay(650);

          // Animate glide to top
          player.position = encounter.to;
          if (player.position > player.stats.highestPos) {
            player.stats.highestPos = player.position;
          }
          window.SNPlayerManager.updateAllTokenPositions();
          if (window.SNUI) window.SNUI.updatePlayerPositionInCard(player.id, player.position);

          await this.delay(600);

          if (player.position === 100) {
            await this.triggerVictory(player, false);
            return;
          }
        } else if (encounter.type === 'snake') {
          player.stats.snakesHit++;
          if (window.SNStorage) window.SNStorage.recordSnake();
          if (window.SNAudio) window.SNAudio.playSnake();
          if (window.SNUI) {
            window.SNUI.showEventBanner(`🐍 OH NO! Snake bite! ${player.name} slides from ${encounter.from} to ${encounter.to}!`, 'snake');
            window.SNUI.highlightCellEffect(encounter.from, 'snake');
          }

          await this.delay(650);

          // Animate slide to tail
          player.position = encounter.to;
          window.SNPlayerManager.updateAllTokenPositions();
          if (window.SNUI) window.SNUI.updatePlayerPositionInCard(player.id, player.position);

          await this.delay(600);
        }
      }

      // 4. FINISH TURN & CHECK EXTRA ROLL
      this.finishTurn(diceValue === 6);
    }

    /**
     * Completes turn, handles extra roll on 6, or rotates to next player.
     */
    async finishTurn(rolledSix) {
      this.isMoving = false;
      if (this.isGameOver || this.isPaused) return;

      const player = this.getCurrentPlayer();

      // Check Extra Turn on 6 Rule
      if (this.settings.extraTurnOn6 && rolledSix) {
        if (window.SNAudio) window.SNAudio.playExtraTurn();
        if (window.SNUI) {
          window.SNUI.showEventBanner(`🎲 Rolled a 6! Extra turn for ${player.name}!`, 'extra');
          window.SNUI.setStatusMessage(`${player.name} rolled 6 and gets another roll!`);
        }

        await this.delay(900);
        this.startTurn();
        return;
      }

      // Normal turn transition
      this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
      if (this.currentTurnIndex === 0) {
        this.turnCount++;
      }

      // Auto-save game state
      if (window.SNStorage) {
        window.SNStorage.saveGame({
          players: this.players.map(p => ({
            id: p.id,
            name: p.name,
            colorName: p.colorName,
            color: p.color,
            glow: p.glow,
            symbol: p.symbol,
            svgShape: p.svgShape,
            isAI: p.isAI,
            position: p.position,
            stats: p.stats
          })),
          currentTurnIndex: this.currentTurnIndex,
          mode: this.mode,
          settings: this.settings,
          turnCount: this.turnCount,
          lastDice: this.lastDice
        });
      }

      await this.delay(300);
      this.startTurn();
    }

    /**
     * Handles victory celebration and match stats recording.
     */
    async triggerVictory(winner, rolledOneToWin) {
      this.isGameOver = true;
      this.isMoving = false;

      if (window.SNAI) window.SNAI.cancel();
      if (window.SNDice) window.SNDice.setDisabled(true);
      if (window.SNAudio) window.SNAudio.playVictory();

      // Record in storage
      if (window.SNStorage) {
        window.SNStorage.recordGameEnd(winner, this.players.length, rolledOneToWin);
      }

      if (window.SNUI) {
        window.SNUI.showVictoryModal(winner, {
          totalTurns: this.turnCount,
          totalRolls: winner.stats.rolls,
          laddersClimbed: winner.stats.laddersHit,
          snakesHit: winner.stats.snakesHit,
          allPlayers: this.players
        });
      }
    }

    pause() {
      this.isPaused = true;
      if (window.SNAI) window.SNAI.cancel();
      if (window.SNDice) window.SNDice.setDisabled(true);
    }

    resume() {
      this.isPaused = false;
      this.startTurn();
    }

    delay(ms) {
      return new Promise(res => setTimeout(res, ms));
    }
  }

  window.SNGame = new GameEngine();
})();
