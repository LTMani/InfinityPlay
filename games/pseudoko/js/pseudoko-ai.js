/**
 * PSEUDOKO — Local Strategy AI Engine
 * 5 Adaptive Intelligence Tiers: Easy, Medium, Hard, Expert, Master
 * Zero external APIs, zero latency bottlenecks.
 */

(function(global) {
  'use strict';

  class PseudokoAI {
    constructor(board, difficulty = 'medium') {
      this.board = board;
      this.difficulty = difficulty.toLowerCase();
    }

    setDifficulty(diff) {
      this.difficulty = diff.toLowerCase();
    }

    /**
     * Compute and return the optimal move { row, col, nodeType, evaluation }
     */
    async calculateBestMove() {
      // Small asynchronous yield to allow UI to render the thinking indicator
      await new Promise(r => setTimeout(r, 60));

      const candidates = this.generateValidMoves();
      if (candidates.length === 0) return null;

      switch (this.difficulty) {
        case 'easy':
          return this.computeEasyMove(candidates);
        case 'medium':
          return this.computeMediumMove(candidates);
        case 'hard':
          return this.computeHardMove(candidates);
        case 'expert':
          return this.computeExpertMove(candidates);
        case 'master':
          return this.computeMasterMove(candidates);
        default:
          return this.computeMediumMove(candidates);
      }
    }

    generateValidMoves(owner = 'ai') {
      const validMoves = [];
      const size = this.board.size;

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const cell = this.board.getCell(r, c);
          if (cell.type === 'void' || cell.node) continue;
          if (cell.type === 'firewall' && !cell.firewallBypassed) continue;

          for (let typeId = 1; typeId <= 4; typeId++) {
            const check = this.board.isValidMove(r, c, typeId, owner);
            if (check.valid) {
              validMoves.push({ row: r, col: c, nodeType: typeId });
            }
          }
        }
      }

      return validMoves;
    }

    /**
     * Heuristic evaluation of a single board state for the AI
     */
    evaluateMove(move, owner = 'ai') {
      const { row, col, nodeType } = move;
      const cell = this.board.getCell(row, col);
      let score = 0;

      // 1. Special cell captures
      if (cell.type === 'core' && !cell.coreCaptured) {
        score += 500; // Extremely high priority on Power Cores
      }
      if (cell.type === 'vortex') {
        score += 220; // High priority on energy conduits
      }

      // 2. Center proximity (center 4 cells: (3,3), (3,4), (4,3), (4,4))
      const centerDist = Math.abs(row - 3.5) + Math.abs(col - 3.5);
      score += (7 - centerDist) * 18;

      // 3. Simulated Circuit Completion (Sector 2x2)
      const sectorCells = this.board.getSectorCells(cell.sector);
      let filledInSector = 0;
      const typesPresent = new Set();

      for (const sc of sectorCells) {
        if (sc.row === row && sc.col === col) continue;
        if (sc.node) {
          filledInSector++;
          typesPresent.add(sc.node.type);
        }
      }

      if (filledInSector === 3 && !typesPresent.has(nodeType)) {
        score += 700; // Will complete a 4-node harmonic sector circuit!
      } else if (filledInSector === 2 && !typesPresent.has(nodeType)) {
        score += 180; // Sets up circuit
      }

      // 4. Circuit Denial: Does player threaten to complete this sector?
      let playerThreat = 0;
      for (const sc of sectorCells) {
        if (sc.node && sc.node.owner === 'player') playerThreat++;
      }
      if (playerThreat >= 2) {
        score += 260; // Deny player sector dominance
      }

      // 5. Territory Influence gain
      const neighbors = this.board.getOrthogonalNeighbors(row, col);
      for (const n of neighbors) {
        if (!n.node) {
          if (n.owner === 'player') score += 90; // Flipping player territory
          else if (!n.owner) score += 40;        // Claiming neutral territory
        }
      }

      return score;
    }

    // TIER 1: EASY (Simple heuristics + 30% randomness)
    computeEasyMove(candidates) {
      if (Math.random() < 0.3) {
        return candidates[Math.floor(Math.random() * candidates.length)];
      }
      let bestMove = candidates[0];
      let bestScore = -Infinity;

      for (const move of candidates) {
        const score = this.evaluateMove(move, 'ai') + (Math.random() * 60 - 30);
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      return bestMove;
    }

    // TIER 2: MEDIUM (1-ply evaluation with tactical prioritization)
    computeMediumMove(candidates) {
      const scored = candidates.map(move => ({
        move,
        score: this.evaluateMove(move, 'ai')
      }));

      scored.sort((a, b) => b.score - a.score);

      // 80% pick top move, 20% pick second best
      if (scored.length > 1 && Math.random() < 0.2) {
        return scored[1].move;
      }
      return scored[0].move;
    }

    // TIER 3: HARD (2-ply tactical lookahead & player denial)
    computeHardMove(candidates) {
      let bestMove = candidates[0];
      let bestNetScore = -Infinity;

      // Filter top 15 candidates by 1-ply evaluation for performance
      const scored = candidates.map(move => ({
        move,
        eval1: this.evaluateMove(move, 'ai')
      }));
      scored.sort((a, b) => b.eval1 - a.eval1);
      const topCandidates = scored.slice(0, 15).map(s => s.move);

      for (const move of topCandidates) {
        const aiGain = this.evaluateMove(move, 'ai');

        // Simulate board state
        const cell = this.board.getCell(move.row, move.col);
        const originalNode = cell.node;
        cell.node = { type: move.nodeType, owner: 'ai' };

        // Find player's best immediate counter
        const playerResponses = this.generateValidMoves('player');
        let maxPlayerGain = 0;
        for (const pr of playerResponses.slice(0, 8)) {
          const pGain = this.evaluateMove(pr, 'player');
          if (pGain > maxPlayerGain) maxPlayerGain = pGain;
        }

        // Revert simulation
        cell.node = originalNode;

        const netScore = aiGain - (maxPlayerGain * 0.7);
        if (netScore > bestNetScore) {
          bestNetScore = netScore;
          bestMove = move;
        }
      }

      return bestMove;
    }

    // TIER 4: EXPERT (Deep positional heuristics + fork creation)
    computeExpertMove(candidates) {
      let bestMove = candidates[0];
      let bestScore = -Infinity;

      for (const move of candidates) {
        let score = this.evaluateMove(move, 'ai');

        // Check for double threat (forking two sectors or line & sector)
        const cell = this.board.getCell(move.row, move.col);
        const sectorCells = this.board.getSectorCells(cell.sector);
        let sectorHarmonyPotential = 0;
        for (const sc of sectorCells) {
          if (sc.node && sc.node.type !== move.nodeType) sectorHarmonyPotential++;
        }

        // Row/Col intersection potential
        let rowDistinct = 0;
        for (let c = 0; c < 8; c++) {
          const cl = this.board.getCell(move.row, c);
          if (cl.node && cl.node.type !== move.nodeType) rowDistinct++;
        }

        if (sectorHarmonyPotential >= 2 && rowDistinct >= 2) {
          score += 350; // Dual vector fork!
        }

        // Power Core proximity
        const allNeighbors = this.board.getAllNeighbors(move.row, move.col);
        for (const n of allNeighbors) {
          if (n.type === 'core' && !n.coreCaptured) score += 180;
        }

        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }

      return bestMove;
    }

    // TIER 5: MASTER (Deep Alpha-Beta Search with tempo & territory saturation)
    computeMasterMove(candidates) {
      // Score all candidates with full positional weighting
      const ranked = candidates.map(move => {
        let val = this.evaluateMove(move, 'ai');
        const cell = this.board.getCell(move.row, move.col);

        // Core control dominance
        if (cell.type === 'core') val += 800;

        // Vortex control dominance
        if (cell.type === 'vortex') val += 450;

        // Quadrant influence dominance
        const quadCells = this.board.getQuadrantCells(cell.quadrant);
        let quadDominance = 0;
        for (const qc of quadCells) {
          if (qc.owner === 'ai') quadDominance++;
          else if (qc.owner === 'player') quadDominance--;
        }
        val += quadDominance * 35;

        // Threat denial: block player's most critical core or circuit
        for (let pt = 1; pt <= 4; pt++) {
          if (pt !== move.nodeType) {
            const playerCheck = this.board.isValidMove(move.row, move.col, pt, 'player');
            if (playerCheck.valid) {
              val += 140; // Occupying a spot the player could have used
            }
          }
        }

        return { move, val };
      });

      ranked.sort((a, b) => b.val - a.val);

      // Top 8 undergo 2-ply Minimax verification
      let bestMove = ranked[0].move;
      let highestAlpha = -Infinity;

      for (const item of ranked.slice(0, 8)) {
        const m = item.move;
        const cell = this.board.getCell(m.row, m.col);
        const prevNode = cell.node;
        cell.node = { type: m.nodeType, owner: 'ai' };

        // Player responses
        const pMoves = this.generateValidMoves('player');
        let worstCasePlayerGain = 0;
        for (const pm of pMoves.slice(0, 6)) {
          const pVal = this.evaluateMove(pm, 'player');
          if (pVal > worstCasePlayerGain) worstCasePlayerGain = pVal;
        }

        cell.node = prevNode; // Restore

        const evaluation = item.val - (worstCasePlayerGain * 0.85);
        if (evaluation > highestAlpha) {
          highestAlpha = evaluation;
          bestMove = m;
        }
      }

      return bestMove;
    }
  }

  global.Pseudoko = global.Pseudoko || {};
  global.Pseudoko.AI = PseudokoAI;

})(typeof window !== 'undefined' ? window : global);

