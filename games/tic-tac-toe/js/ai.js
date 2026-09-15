/**
 * Tic-Tac-Toe: Ultimate Arena - AI Engine
 * Genuine algorithmic intelligence supporting Easy, Medium, Hard, and mathematically optimal Grandmaster Minimax
 */

(function() {
  'use strict';

  const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  class AIEngine {
    constructor() {
      this.thinkingTimer = null;
    }

    // Cancel any pending AI computation/move
    cancelThinking() {
      if (this.thinkingTimer) {
        clearTimeout(this.thinkingTimer);
        this.thinkingTimer = null;
      }
    }

    /**
     * Compute move with organic thinking delay
     * @param {Array} board - 9-element array ('X', 'O', or null)
     * @param {String} aiPiece - 'X' or 'O'
     * @param {String} difficulty - 'easy', 'medium', 'hard', 'grandmaster'
     * @param {Function} onMoveReady - Callback(cellIndex)
     */
    requestMove(board, aiPiece, difficulty, onMoveReady) {
      this.cancelThinking();

      const opponentPiece = aiPiece === 'X' ? 'O' : 'X';
      const availableMoves = this.getAvailableMoves(board);

      if (availableMoves.length === 0) return;

      // Realistic thinking time calculation
      let minDelay = 450;
      let maxDelay = 750;
      if (difficulty === 'easy') {
        minDelay = 350;
        maxDelay = 600;
      } else if (difficulty === 'grandmaster') {
        minDelay = 550;
        maxDelay = 850;
      }

      const thinkTime = Math.floor(minDelay + Math.random() * (maxDelay - minDelay));

      this.thinkingTimer = setTimeout(() => {
        this.thinkingTimer = null;
        let chosenIndex = null;

        switch (difficulty) {
          case 'easy':
            chosenIndex = this.getEasyMove(board, aiPiece, opponentPiece, availableMoves);
            break;
          case 'medium':
            chosenIndex = this.getMediumMove(board, aiPiece, opponentPiece, availableMoves);
            break;
          case 'hard':
            chosenIndex = this.getHardMove(board, aiPiece, opponentPiece, availableMoves);
            break;
          case 'grandmaster':
          default:
            chosenIndex = this.getGrandmasterMove(board, aiPiece, opponentPiece, availableMoves);
            break;
        }

        if (chosenIndex === null || !availableMoves.includes(chosenIndex)) {
          chosenIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }

        onMoveReady(chosenIndex);
      }, thinkTime);
    }

    getAvailableMoves(board) {
      const moves = [];
      for (let i = 0; i < 9; i++) {
        if (!board[i]) moves.push(i);
      }
      return moves;
    }

    checkWinner(board) {
      for (let i = 0; i < WIN_LINES.length; i++) {
        const [a, b, c] = WIN_LINES[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return { winner: board[a], line: WIN_LINES[i] };
        }
      }
      if (board.every(cell => cell !== null)) {
        return { winner: 'draw', line: null };
      }
      return null;
    }

    // Find instant win or block
    findWinningOrBlockingMove(board, targetPiece) {
      const available = this.getAvailableMoves(board);
      for (let i = 0; i < available.length; i++) {
        const idx = available[i];
        board[idx] = targetPiece;
        const res = this.checkWinner(board);
        board[idx] = null;
        if (res && res.winner === targetPiece) {
          return idx;
        }
      }
      return null;
    }

    /* ----------------------------------------------------
       EASY AI
       Intentionally makes casual mistakes, misses blocks
    ---------------------------------------------------- */
    getEasyMove(board, aiPiece, oppPiece, available) {
      // 25% chance to spot an immediate win
      if (Math.random() < 0.25) {
        const winMove = this.findWinningOrBlockingMove(board, aiPiece);
        if (winMove !== null) return winMove;
      }
      // 20% chance to block
      if (Math.random() < 0.20) {
        const blockMove = this.findWinningOrBlockingMove(board, oppPiece);
        if (blockMove !== null) return blockMove;
      }
      // Otherwise random move
      return available[Math.floor(Math.random() * available.length)];
    }

    /* ----------------------------------------------------
       MEDIUM AI
       Reasonable tactical play: blocks obvious threats,
       takes wins, sometimes makes imperfect positional moves
    ---------------------------------------------------- */
    getMediumMove(board, aiPiece, oppPiece, available) {
      // Always take immediate win if available
      const winMove = this.findWinningOrBlockingMove(board, aiPiece);
      if (winMove !== null) return winMove;

      // 80% chance to block immediate opponent win
      if (Math.random() < 0.80) {
        const blockMove = this.findWinningOrBlockingMove(board, oppPiece);
        if (blockMove !== null) return blockMove;
      }

      // Positional preference: 65% Minimax with depth limit, 35% positional heuristic
      if (Math.random() < 0.65) {
        const minimaxMove = this.minimax(board, aiPiece, oppPiece, 0, true, -Infinity, Infinity, 3);
        if (minimaxMove && minimaxMove.index !== undefined) {
          return minimaxMove.index;
        }
      }

      // Center preference
      if (available.includes(4) && Math.random() < 0.6) return 4;

      // Corners
      const corners = [0, 2, 6, 8].filter(c => available.includes(c));
      if (corners.length > 0 && Math.random() < 0.5) {
        return corners[Math.floor(Math.random() * corners.length)];
      }

      return available[Math.floor(Math.random() * available.length)];
    }

    /* ----------------------------------------------------
       HARD AI
       Strong Minimax-based play: searches depth,
       blocks threats, creates forks, rarely blunders
    ---------------------------------------------------- */
    getHardMove(board, aiPiece, oppPiece, available) {
      // 92% of the time, uses full minimax search
      if (Math.random() < 0.92) {
        const best = this.minimax(board, aiPiece, oppPiece, 0, true, -Infinity, Infinity, 9);
        if (best && best.index !== undefined) {
          return best.index;
        }
      }

      // Backup: Instant win or block
      const winMove = this.findWinningOrBlockingMove(board, aiPiece);
      if (winMove !== null) return winMove;
      const blockMove = this.findWinningOrBlockingMove(board, oppPiece);
      if (blockMove !== null) return blockMove;

      return available[Math.floor(Math.random() * available.length)];
    }

    /* ----------------------------------------------------
       GRANDMASTER AI
       Flawless Tic-Tac-Toe strategy using full Minimax
       with alpha-beta pruning + positional tie-breaking:
       1. Win
       2. Block
       3. Create Fork
       4. Block Fork
       5. Center
       6. Opposite Corner
       7. Empty Corner
       8. Empty Side
    ---------------------------------------------------- */
    getGrandmasterMove(board, aiPiece, oppPiece, available) {
      // First move optimization for high speed: center or corner
      if (available.length === 9) {
        // Open center or corner
        const openings = [4, 0, 2, 6, 8];
        return openings[Math.floor(Math.random() * openings.length)];
      }

      if (available.length === 8) {
        // If center is free, take center; if opponent took center, take corner
        if (board[4] === null) return 4;
        const corners = [0, 2, 6, 8];
        return corners[Math.floor(Math.random() * corners.length)];
      }

      // Check instant win
      const winMove = this.findWinningOrBlockingMove(board, aiPiece);
      if (winMove !== null) return winMove;

      // Check instant block
      const blockMove = this.findWinningOrBlockingMove(board, oppPiece);
      if (blockMove !== null) return blockMove;

      // Full Minimax with alpha-beta and depth scoring
      const best = this.minimax(board, aiPiece, oppPiece, 0, true, -Infinity, Infinity, 9);
      if (best && best.index !== undefined) {
        return best.index;
      }

      return available[0];
    }

    /**
     * Minimax algorithm with depth penalty and alpha-beta pruning
     */
    minimax(board, aiPiece, oppPiece, depth, isMaximizing, alpha, beta, maxDepth) {
      const result = this.checkWinner(board);
      if (result) {
        if (result.winner === aiPiece) return { score: 10 - depth };
        if (result.winner === oppPiece) return { score: depth - 10 };
        if (result.winner === 'draw') return { score: 0 };
      }

      if (depth >= maxDepth) return { score: 0 };

      const available = this.getAvailableMoves(board);
      if (available.length === 0) return { score: 0 };

      if (isMaximizing) {
        let bestScore = -Infinity;
        let bestIndex = available[0];

        // Strategic ordering: center, corners, edges for faster alpha-beta cutoffs
        const orderedMoves = this.orderMoves(available);

        for (let i = 0; i < orderedMoves.length; i++) {
          const move = orderedMoves[i];
          board[move] = aiPiece;
          const sim = this.minimax(board, aiPiece, oppPiece, depth + 1, false, alpha, beta, maxDepth);
          board[move] = null;

          if (sim.score > bestScore) {
            bestScore = sim.score;
            bestIndex = move;
          }
          alpha = Math.max(alpha, bestScore);
          if (beta <= alpha) break;
        }
        return { index: bestIndex, score: bestScore };
      } else {
        let bestScore = Infinity;
        let bestIndex = available[0];

        const orderedMoves = this.orderMoves(available);

        for (let i = 0; i < orderedMoves.length; i++) {
          const move = orderedMoves[i];
          board[move] = oppPiece;
          const sim = this.minimax(board, aiPiece, oppPiece, depth + 1, true, alpha, beta, maxDepth);
          board[move] = null;

          if (sim.score < bestScore) {
            bestScore = sim.score;
            bestIndex = move;
          }
          beta = Math.min(beta, bestScore);
          if (beta <= alpha) break;
        }
        return { index: bestIndex, score: bestScore };
      }
    }

    orderMoves(available) {
      const priorityOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];
      return priorityOrder.filter(idx => available.includes(idx));
    }
  }

  window.TTTAI = new AIEngine();
})();

