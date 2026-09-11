/**
 * PSEUDOKO — Endless Mode Engine
 * Procedurally generated infinite waves with cascading clears,
 * scaling difficulty, dynamic multipliers, and high score tracking.
 */

(function(global) {
  'use strict';

  class EndlessMode {
    constructor(board) {
      this.board = board;
      this.wave = 1;
      this.totalScore = 0;
      this.waveScore = 0;
      this.waveTargetScore = 1500;
      this.movesRemaining = 15;
      this.activeCombos = 1;
      this.isWaveComplete = false;
    }

    startNewSession() {
      this.wave = 1;
      this.totalScore = 0;
      this.waveScore = 0;
      this.waveTargetScore = 1500;
      this.movesRemaining = 16;
      this.activeCombos = 1;
      this.initWave(1);
    }

    initWave(waveNum) {
      this.wave = waveNum;
      this.waveScore = 0;
      this.waveTargetScore = 1200 + (waveNum * 600);
      this.movesRemaining = Math.max(12, 18 - Math.min(6, Math.floor(waveNum / 3)));
      this.board.initGrid();

      // Configure special cells based on wave depth
      const coreCount = Math.min(4, 1 + Math.floor(waveNum / 2));
      const fwCount = Math.min(5, Math.floor(waveNum / 3));
      const vortexCount = waveNum >= 4 ? 2 : 0;

      const placedCoords = new Set();

      // Place Cores
      for (let i = 0; i < coreCount; i++) {
        const r = 1 + Math.floor(Math.random() * 6);
        const c = 1 + Math.floor(Math.random() * 6);
        const key = `${r}_${c}`;
        if (!placedCoords.has(key)) {
          placedCoords.add(key);
          const cell = this.board.getCell(r, c);
          if (cell) cell.type = 'core';
        }
      }

      // Place Firewalls (Wave 3+)
      for (let i = 0; i < fwCount; i++) {
        const r = Math.floor(Math.random() * 8);
        const c = Math.floor(Math.random() * 8);
        const key = `${r}_${c}`;
        if (!placedCoords.has(key)) {
          placedCoords.add(key);
          const cell = this.board.getCell(r, c);
          if (cell) cell.type = 'firewall';
        }
      }

      // Place Vortex (Wave 4+)
      for (let i = 0; i < vortexCount; i++) {
        const r = 2 + Math.floor(Math.random() * 4);
        const c = 2 + Math.floor(Math.random() * 4);
        const key = `${r}_${c}`;
        if (!placedCoords.has(key)) {
          placedCoords.add(key);
          const cell = this.board.getCell(r, c);
          if (cell) cell.type = 'vortex';
        }
      }

      // Preplace 2-4 starting constraint nodes
      const seedCount = Math.min(6, 2 + Math.floor(waveNum / 4));
      for (let i = 0; i < seedCount; i++) {
        const r = Math.floor(Math.random() * 8);
        const c = Math.floor(Math.random() * 8);
        const key = `${r}_${c}`;
        if (!placedCoords.has(key)) {
          placedCoords.add(key);
          const typeId = 1 + (i % 4);
          const cell = this.board.getCell(r, c);
          if (cell) {
            cell.node = { type: typeId, owner: 'neutral', locked: true };
            cell.isPreplaced = true;
          }
        }
      }

      this.board.movesRemaining = this.movesRemaining;
      this.board.score = this.totalScore;
      this.board.updateInfluence();
    }

    /**
     * Handles move execution with endless cascading clears
     */
    processEndlessMove(r, c, nodeTypeId) {
      const result = this.board.placeNode(r, c, nodeTypeId, 'player');
      if (!result.success) return result;

      this.waveScore += result.scoreGain;
      this.totalScore = this.board.score;

      // Cascading line clear in endless: clear completed harmonic sectors/lines
      // so player can continue playing indefinitely without deadlock!
      if (result.events && result.events.some(e => e.type === 'circuit_resonance')) {
        this.clearCompletedCircuits();
      }

      // Check wave progression
      if (this.waveScore >= this.waveTargetScore) {
        this.waveCompleted = true;
      }

      return {
        ...result,
        wave: this.wave,
        waveScore: this.waveScore,
        waveTargetScore: this.waveTargetScore,
        totalScore: this.totalScore,
        isWaveComplete: this.waveScore >= this.waveTargetScore
      };
    }

    clearCompletedCircuits() {
      // In endless mode, clear locked circuits to free up space
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const cell = this.board.getCell(r, c);
          if (cell && cell.node && cell.node.locked && !cell.isPreplaced) {
            cell.node = null;
            cell.owner = 'player'; // Keeps territory
          }
        }
      }
      this.board.updateInfluence();
    }

    advanceToNextWave() {
      this.wave++;
      this.initWave(this.wave);
    }
  }

  global.Pseudoko = global.Pseudoko || {};
  global.Pseudoko.Endless = EndlessMode;

})(typeof window !== 'undefined' ? window : global);

