/**
 * PSEUDOKO — Main Application Controller
 * Master orchestrator connecting Board, Levels, AI, Audio, Storage, and UI.
 */

(function(global) {
  'use strict';

  class PseudokoApp {
    constructor() {
      this.board = null;
      this.ai = null;
      this.endlessEngine = null;
      this.mode = 'campaign'; // 'campaign' | 'endless' | 'daily' | 'ai'
      this.activeLevel = null;
      this.isTurnLocked = false;
      this.sessionStartTime = 0;
      this.overchargedNextMove = false;
    }

    init() {
      console.log('⚡ Initializing PSEUDOKO Master System...');
      this.board = new global.Pseudoko.Board();
      this.ai = new global.Pseudoko.AI(this.board, 'medium');

      // Initialize UI & Audio
      global.Pseudoko.UI.init();
      global.Pseudoko.Audio.init();

      console.log('✅ PSEUDOKO engine ready.');
    }

    // ==========================================
    // CAMPAIGN MODE
    // ==========================================
    startCampaignLevel(levelId) {
      const lvl = global.Pseudoko.Levels.getLevelById(levelId);
      if (!lvl) return;

      this.mode = 'campaign';
      this.activeLevel = lvl;
      this.board.initGrid();
      this.board.score = 0;
      this.board.combo = 1;
      this.board.movesRemaining = lvl.moves;
      this.board.movesMade = 0;
      this.board.perfectDeductions = true;
      this.board.coresCaptured = 0;
      this.board.circuitsCompleted = 0;
      this.sessionStartTime = Date.now();

      // Configure Special Cells
      lvl.specialCells.forEach(sc => {
        const cell = this.board.getCell(sc.row, sc.col);
        if (cell) cell.type = sc.type;
      });

      // Configure Preplaced Constraint Nodes
      lvl.preplacedNodes.forEach(pn => {
        const cell = this.board.getCell(pn.row, pn.col);
        if (cell) {
          cell.node = { type: pn.type, owner: 'neutral', locked: true };
          cell.isPreplaced = true;
        }
      });

      this.board.updateInfluence();

      // Configure AI if applicable
      if (lvl.aiOpponent && lvl.aiOpponent.enabled) {
        this.ai.setDifficulty(lvl.aiOpponent.difficulty);
        document.getElementById('pkAiHudCard').style.display = 'flex';
        document.getElementById('pkAiName').textContent = `${lvl.aiOpponent.difficulty.toUpperCase()} AI`;
      } else {
        document.getElementById('pkAiHudCard').style.display = 'none';
      }

      // Update HUD and render board
      const territoryStats = this.board.getTerritoryStats();
      global.Pseudoko.UI.updateHUD({
        score: 0,
        movesRemaining: lvl.moves,
        combo: 1,
        territoryPercent: territoryStats.playerPercent,
        modeTitle: `Campaign: Level ${lvl.id} — ${lvl.name}`,
        objectiveTitle: `OBJECTIVE: ${lvl.tierInfo.name}`,
        objectiveDesc: lvl.objective.description
      });

      global.Pseudoko.UI.renderBoard(this.board);
      global.Pseudoko.UI.showScreen('screenGameplay');

      global.Pseudoko.Storage.data.stats.totalGamesPlayed++;
      global.Pseudoko.Storage.save();
    }

    startNextCampaignLevel() {
      if (!this.activeLevel) return;
      const nextId = this.activeLevel.id + 1;
      if (nextId <= 100) {
        this.startCampaignLevel(nextId);
      } else {
        global.Pseudoko.UI.showToast('Congratulations! You have conquered all 100 Campaign levels!', 'achievement');
        global.Pseudoko.UI.showScreen('screenMainMenu');
      }
    }

    // ==========================================
    // ENDLESS MODE
    // ==========================================
    startEndlessMode() {
      this.mode = 'endless';
      this.activeLevel = null;
      document.getElementById('pkAiHudCard').style.display = 'none';

      if (!this.endlessEngine) {
        this.endlessEngine = new global.Pseudoko.Endless(this.board);
      }
      this.endlessEngine.startNewSession();
      this.sessionStartTime = Date.now();

      const territoryStats = this.board.getTerritoryStats();
      global.Pseudoko.UI.updateHUD({
        score: 0,
        movesRemaining: this.endlessEngine.movesRemaining,
        combo: 1,
        territoryPercent: territoryStats.playerPercent,
        modeTitle: `Endless Mode: Wave 1`,
        objectiveTitle: `OBJECTIVE: SURVIVAL`,
        objectiveDesc: `Earn ${this.endlessEngine.waveTargetScore.toLocaleString()} pts to breach Wave 2`
      });

      global.Pseudoko.UI.renderBoard(this.board);
      global.Pseudoko.UI.showScreen('screenGameplay');

      global.Pseudoko.Storage.data.stats.totalGamesPlayed++;
      global.Pseudoko.Storage.save();
    }

    // ==========================================
    // DAILY CHALLENGE
    // ==========================================
    startDailyChallenge() {
      this.mode = 'daily';
      this.activeLevel = null;
      document.getElementById('pkAiHudCard').style.display = 'none';

      const puzzle = global.Pseudoko.Daily.generateDailyPuzzle();
      this.board.initGrid();
      this.board.score = 0;
      this.board.combo = 1;
      this.board.movesRemaining = puzzle.moves;
      this.board.movesMade = 0;
      this.board.perfectDeductions = true;
      this.sessionStartTime = Date.now();

      // Place special cells & nodes
      puzzle.specialCells.forEach(sc => {
        const cell = this.board.getCell(sc.row, sc.col);
        if (cell) cell.type = sc.type;
      });

      puzzle.preplacedNodes.forEach(pn => {
        const cell = this.board.getCell(pn.row, pn.col);
        if (cell) {
          cell.node = { type: pn.type, owner: 'neutral', locked: true };
          cell.isPreplaced = true;
        }
      });

      this.board.updateInfluence();

      const territoryStats = this.board.getTerritoryStats();
      global.Pseudoko.UI.updateHUD({
        score: 0,
        movesRemaining: puzzle.moves,
        combo: 1,
        territoryPercent: territoryStats.playerPercent,
        modeTitle: puzzle.title,
        objectiveTitle: `DAILY SEED: ${puzzle.date}`,
        objectiveDesc: puzzle.objective.description
      });

      global.Pseudoko.UI.renderBoard(this.board);
      global.Pseudoko.UI.showScreen('screenGameplay');

      global.Pseudoko.Storage.data.stats.totalGamesPlayed++;
      global.Pseudoko.Storage.save();
    }

    // ==========================================
    // AI SKIRMISH (VERSUS)
    // ==========================================
    startAISkirmish(difficulty = 'medium') {
      this.mode = 'ai';
      this.activeLevel = null;
      this.ai.setDifficulty(difficulty);

      this.board.initGrid();
      this.board.score = 0;
      this.board.combo = 1;
      this.board.movesRemaining = 18;
      this.board.movesMade = 0;
      this.board.perfectDeductions = true;
      this.sessionStartTime = Date.now();

      // Configure standard skirmish cores
      const coreCoords = [[2, 2], [5, 5], [2, 5], [5, 2]];
      coreCoords.forEach(([r, c]) => {
        const cell = this.board.getCell(r, c);
        if (cell) cell.type = 'core';
      });

      this.board.updateInfluence();

      document.getElementById('pkAiHudCard').style.display = 'flex';
      document.getElementById('pkAiName').textContent = `${difficulty.toUpperCase()} AI`;
      document.getElementById('pkAiStatus').textContent = 'Waiting for your move...';

      const territoryStats = this.board.getTerritoryStats();
      global.Pseudoko.UI.updateHUD({
        score: 0,
        movesRemaining: 18,
        combo: 1,
        territoryPercent: territoryStats.playerPercent,
        modeTitle: `AI Skirmish: ${difficulty.toUpperCase()}`,
        objectiveTitle: `VERSUS DUEL`,
        objectiveDesc: `Out-score and out-control the ${difficulty.toUpperCase()} AI before moves run out!`
      });

      global.Pseudoko.UI.renderBoard(this.board);
      global.Pseudoko.UI.showScreen('screenGameplay');

      global.Pseudoko.Storage.data.stats.totalGamesPlayed++;
      global.Pseudoko.Storage.save();
    }

    // ==========================================
    // PLAYER MOVE EXECUTION
    // ==========================================
    async handlePlayerPlacement(r, c, nodeTypeId) {
      if (this.isTurnLocked) return;

      const cell = this.board.getCell(r, c);
      if (!cell || cell.type === 'void') return;

      // Handle Endless mode custom move pipeline
      if (this.mode === 'endless') {
        const endlessRes = this.endlessEngine.processEndlessMove(r, c, nodeTypeId);
        if (!endlessRes.success) {
          global.Pseudoko.UI.triggerCellError(r, c);
          if (global.Pseudoko.Audio) global.Pseudoko.Audio.playWrongMove();
          global.Pseudoko.UI.showToast(endlessRes.reason || 'Invalid placement', 'error');
          return;
        }

        if (global.Pseudoko.Audio) global.Pseudoko.Audio.playValidMove();
        global.Pseudoko.UI.renderBoard(this.board);

        const stats = this.board.getTerritoryStats();
        global.Pseudoko.UI.updateHUD({
          score: endlessRes.totalScore,
          movesRemaining: this.board.movesRemaining,
          combo: endlessRes.combo,
          territoryPercent: stats.playerPercent,
          objectiveDesc: `Score ${endlessRes.waveScore} / ${endlessRes.waveTargetScore} pts for Wave ${endlessRes.wave + 1}`
        });

        if (endlessRes.isWaveComplete) {
          global.Pseudoko.UI.showToast(`Wave ${endlessRes.wave} Cleared! +5 Bonus Moves!`, 'success');
          if (global.Pseudoko.Audio) global.Pseudoko.Audio.playVictory();
          this.endlessEngine.advanceToNextWave();
          setTimeout(() => {
            global.Pseudoko.UI.renderBoard(this.board);
          }, 600);
        } else if (this.board.movesRemaining <= 0) {
          // Endless session ended
          global.Pseudoko.Storage.recordEndlessRun(this.endlessEngine.wave, this.endlessEngine.totalScore);
          global.Pseudoko.UI.showDefeatModal(`Endless Run Complete! Survived to Wave ${this.endlessEngine.wave} with ${this.endlessEngine.totalScore.toLocaleString()} pts.`);
        }
        return;
      }

      // Standard Move execution (Campaign, Daily, AI)
      const options = { overcharged: this.overchargedNextMove };
      this.overchargedNextMove = false;

      const res = this.board.placeNode(r, c, nodeTypeId, 'player', options);
      if (!res.success) {
        global.Pseudoko.UI.triggerCellError(r, c);
        if (global.Pseudoko.Audio) global.Pseudoko.Audio.playWrongMove();
        global.Pseudoko.UI.showToast(res.reason || 'Frequency overload conflict', 'error');
        return;
      }

      // Audio & VFX feedback
      if (global.Pseudoko.Audio) {
        if (res.events.some(e => e.type === 'circuit_resonance')) {
          global.Pseudoko.Audio.playCircuitCombo(res.combo);
        } else if (res.events.some(e => e.type === 'core_capture')) {
          global.Pseudoko.Audio.playCoreCapture();
        } else {
          global.Pseudoko.Audio.playValidMove();
        }
      }

      // Circuit resonance effects
      res.events.forEach(e => {
        if (e.type === 'circuit_resonance' && e.circuits) {
          global.Pseudoko.UI.triggerCircuitResonanceEffect(e.circuits);
          global.Pseudoko.UI.showToast(`⚡ Harmonic Circuit Resonated! +${e.bonus} pts`, 'success');
          global.Pseudoko.Storage.data.stats.totalCircuitsCompleted += e.count;
        }
        if (e.type === 'core_capture') {
          global.Pseudoko.UI.showToast(`🔋 Power Core Activated! +1 Bonus Move!`, 'success');
          global.Pseudoko.Storage.data.stats.totalCoresCaptured++;
        }
      });

      // Render updated board & HUD
      global.Pseudoko.UI.renderBoard(this.board);
      const territoryStats = this.board.getTerritoryStats();
      global.Pseudoko.UI.updateHUD({
        score: this.board.score,
        movesRemaining: this.board.movesRemaining,
        combo: res.combo,
        territoryPercent: territoryStats.playerPercent
      });

      // Check win/lose conditions
      const status = this.evaluateGameOutcome();
      if (status.complete) {
        this.finishGame(status);
        return;
      }

      // If playing against AI, trigger AI response turn
      if ((this.mode === 'ai' || (this.activeLevel && this.activeLevel.aiOpponent)) && this.board.movesRemaining > 0) {
        await this.executeAITurn();
      }
    }

    // ==========================================
    // AI TURN EXECUTION
    // ==========================================
    async executeAITurn() {
      this.isTurnLocked = true;
      const aiStatus = document.getElementById('pkAiStatus');
      if (aiStatus) aiStatus.textContent = 'Calculating optimal vector...';

      const aiMove = await this.ai.calculateBestMove();
      if (!aiMove) {
        this.isTurnLocked = false;
        if (aiStatus) aiStatus.textContent = 'No valid moves available.';
        return;
      }

      // Execute AI Move after brief humanized delay
      setTimeout(() => {
        const aiRes = this.board.placeNode(aiMove.row, aiMove.col, aiMove.nodeType, 'ai', { freeMove: true });
        global.Pseudoko.UI.renderBoard(this.board);

        const territoryStats = this.board.getTerritoryStats();
        global.Pseudoko.UI.updateHUD({
          score: this.board.score,
          movesRemaining: this.board.movesRemaining,
          combo: this.board.combo,
          territoryPercent: territoryStats.playerPercent
        });

        if (aiStatus) aiStatus.textContent = `Deployed ${global.Pseudoko.NODE_TYPES[this.board.getNodeKeyById(aiMove.nodeType)].symbol} at ${this.board.getCell(aiMove.row, aiMove.col).coord}`;

        this.isTurnLocked = false;

        // Check outcomes after AI turn
        const status = this.evaluateGameOutcome();
        if (status.complete) {
          this.finishGame(status);
        }
      }, 650);
    }

    // ==========================================
    // GAME OUTCOME EVALUATION
    // ==========================================
    evaluateGameOutcome() {
      const territory = this.board.getTerritoryStats();

      // 1. Campaign Mode
      if (this.mode === 'campaign' && this.activeLevel) {
        const obj = this.activeLevel.objective;
        let isWon = false;

        if (obj.type === 'score' && this.board.score >= obj.target) isWon = true;
        else if (obj.type === 'territory' && territory.playerPercent >= obj.target) isWon = true;
        else if (obj.type === 'cores' && this.board.coresCaptured >= obj.target) isWon = true;
        else if (obj.type === 'circuits' && this.board.circuitsCompleted >= obj.target) isWon = true;
        else if (obj.type === 'ai_duel' && this.board.movesRemaining <= 0) {
          isWon = territory.playerPercent > territory.aiPercent;
        }

        if (isWon) {
          return { complete: true, isVictory: true };
        } else if (this.board.movesRemaining <= 0) {
          return { complete: true, isVictory: false };
        }
      }

      // 2. Daily Challenge
      if (this.mode === 'daily') {
        const puzzle = global.Pseudoko.Daily.generateDailyPuzzle();
        if (this.board.score >= puzzle.objective.target) {
          return { complete: true, isVictory: true };
        } else if (this.board.movesRemaining <= 0) {
          return { complete: true, isVictory: false };
        }
      }

      // 3. AI Skirmish
      if (this.mode === 'ai') {
        if (this.board.movesRemaining <= 0) {
          const isVictory = territory.playerPercent > territory.aiPercent;
          return { complete: true, isVictory };
        }
      }

      return { complete: false };
    }

    finishGame(outcome) {
      const timeElapsed = Math.round((Date.now() - this.sessionStartTime) / 1000);
      const territoryStats = this.board.getTerritoryStats();

      if (outcome.isVictory) {
        // Calculate stars (1 to 3)
        let stars = 1;
        if (this.activeLevel) {
          const th = this.activeLevel.starThresholds;
          if (this.board.score >= th[2]) stars = 3;
          else if (this.board.score >= th[1]) stars = 2;
        } else {
          stars = this.board.movesRemaining >= 5 ? 3 : (this.board.movesRemaining >= 2 ? 2 : 1);
        }

        // Save progress
        if (this.mode === 'campaign' && this.activeLevel) {
          global.Pseudoko.Storage.completeLevel(this.activeLevel.id, stars, this.board.score);
        } else if (this.mode === 'daily') {
          const today = global.Pseudoko.Daily.getTodayDateString();
          global.Pseudoko.Storage.recordDailyChallenge(today, this.board.score, timeElapsed);
        } else if (this.mode === 'ai') {
          global.Pseudoko.Storage.recordAIDuelWin(this.ai.difficulty);
        }

        // Evaluate achievement unlocks
        global.Pseudoko.Achievements.evaluateGameplayTriggers({
          isVictory: true,
          mode: this.mode,
          stars: stars,
          score: this.board.score,
          combo: this.board.maxCombo,
          perfectDeductions: this.board.perfectDeductions,
          territoryPercent: territoryStats.playerPercent,
          timeSeconds: timeElapsed,
          aiLevel: this.ai ? this.ai.difficulty : null
        });

        global.Pseudoko.UI.showVictoryModal({
          stars,
          score: this.board.score,
          message: `Flawless execution! Solved in ${timeElapsed}s with ${territoryStats.playerPercent}% territory dominance.`
        });
      } else {
        global.Pseudoko.Storage.data.stats.totalDefeats++;
        global.Pseudoko.Storage.save();
        global.Pseudoko.UI.showDefeatModal(`Moves depleted before target objective fulfilled. Try scanning the matrix for harmonic conduits!`);
      }
    }

    restartCurrentSession() {
      if (this.mode === 'campaign' && this.activeLevel) {
        this.startCampaignLevel(this.activeLevel.id);
      } else if (this.mode === 'endless') {
        this.startEndlessMode();
      } else if (this.mode === 'daily') {
        this.startDailyChallenge();
      } else if (this.mode === 'ai') {
        this.startAISkirmish(this.ai ? this.ai.difficulty : 'medium');
      }
    }

    // ==========================================
    // TACTICAL ABILITIES
    // ==========================================
    executeScanAbility() {
      const moves = this.board.findTacticalMoves('player');
      if (moves.length > 0) {
        global.Pseudoko.UI.highlightTacticalScan(moves);
        if (global.Pseudoko.Audio) global.Pseudoko.Audio.playValidMove();
      } else {
        global.Pseudoko.UI.showToast('No optimal placement vectors found.', 'error');
      }
    }

    executeEmpAbility(r, c) {
      const purged = this.board.purgeCell(r, c);
      if (purged) {
        global.Pseudoko.UI.renderBoard(this.board);
        global.Pseudoko.UI.showToast(`EMP Blast purged cell at ${this.board.getCell(r, c).coord}!`, 'success');
        if (global.Pseudoko.Audio) global.Pseudoko.Audio.playCoreCapture();
      } else {
        global.Pseudoko.UI.showToast('EMP Target invalid: Only firewalls or non-permanent cells can be purged.', 'error');
      }
    }

    executeUndo() {
      const undone = this.board.undo();
      if (undone) {
        global.Pseudoko.UI.renderBoard(this.board);
        const stats = this.board.getTerritoryStats();
        global.Pseudoko.UI.updateHUD({
          score: this.board.score,
          movesRemaining: this.board.movesRemaining,
          combo: this.board.combo,
          territoryPercent: stats.playerPercent
        });
        global.Pseudoko.UI.showToast('Move undone.', 'info');
        if (global.Pseudoko.Audio) global.Pseudoko.Audio.playClick();
      } else {
        global.Pseudoko.UI.showToast('No previous moves to undo.', 'info');
      }
    }
  }

  global.Pseudoko = global.Pseudoko || {};
  global.Pseudoko.App = new PseudokoApp();

  // Auto-initialize on DOM ready or immediately if already loaded
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        global.Pseudoko.App.init();
      });
    } else {
      global.Pseudoko.App.init();
    }
  }

})(typeof window !== 'undefined' ? window : global);

