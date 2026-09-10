/**
 * InfinityPlay - Strategic Chess AI Engine
 * 4 Difficulty Levels:
 * - Easy (~900 ELO): Fast, fun, intentional beginner inaccuracies
 * - Medium (~1400 ELO): Depth 3 Alpha-Beta with PST & center control
 * - Hard (~1800 ELO): Depth 4 + Quiescence search & opening principles
 * - Expert (~2100+ ELO): Iterative Deepening, Move Ordering (MVV-LVA), Transposition Table
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChessAI = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {

  const PIECE_VALS = {
    p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000
  };

  // Piece-Square Tables (White perspective, indexed [rank 7..0][file 0..7])
  // Rank 7 is rank 8, Rank 0 is rank 1
  const PST = {
    p: [
      [ 0,  0,  0,  0,  0,  0,  0,  0], // Rank 8 (promo)
      [50, 50, 50, 50, 50, 50, 50, 50], // Rank 7
      [10, 10, 20, 30, 30, 20, 10, 10], // Rank 6
      [ 5,  5, 10, 25, 25, 10,  5,  5], // Rank 5
      [ 0,  0,  0, 20, 20,  0,  0,  0], // Rank 4
      [ 5, -5,-10,  0,  0,-10, -5,  5], // Rank 3
      [ 5, 10, 10,-20,-20, 10, 10,  5], // Rank 2
      [ 0,  0,  0,  0,  0,  0,  0,  0]  // Rank 1
    ],
    n: [
      [-50,-40,-30,-30,-30,-30,-40,-50],
      [-40,-20,  0,  5,  5,  0,-20,-40],
      [-30,  5, 15, 20, 20, 15,  5,-30],
      [-30,  0, 18, 25, 25, 18,  0,-30],
      [-30,  5, 15, 20, 20, 15,  5,-30],
      [-30,  0, 10, 15, 15, 10,  0,-30],
      [-40,-20,  0,  0,  0,  0,-20,-40],
      [-50,-40,-30,-30,-30,-30,-40,-50]
    ],
    b: [
      [-20,-10,-10,-10,-10,-10,-10,-20],
      [-10,  5,  0,  0,  0,  0,  5,-10],
      [-10, 10, 10, 10, 10, 10, 10,-10],
      [-10,  0, 10, 15, 15, 10,  0,-10],
      [-10,  5,  5, 15, 15,  5,  5,-10],
      [-10,  0,  5, 10, 10,  5,  0,-10],
      [-10,  5,  0,  0,  0,  0,  5,-10],
      [-20,-10,-10,-10,-10,-10,-10,-20]
    ],
    r: [
      [ 0,  0,  0,  5,  5,  0,  0,  0],
      [15, 15, 15, 15, 15, 15, 15, 15], // 7th rank
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [ 0,  0,  0,  5,  5,  0,  0,  0]
    ],
    q: [
      [-20,-10,-10, -5, -5,-10,-10,-20],
      [-10,  0,  5,  0,  0,  0,  0,-10],
      [-10,  5,  5,  5,  5,  5,  0,-10],
      [  0,  0,  5,  5,  5,  5,  0, -5],
      [-5,  0,  5,  5,  5,  5,  0, -5],
      [-10,  0,  5,  5,  5,  5,  0,-10],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-20,-10,-10, -5, -5,-10,-10,-20]
    ],
    k_middle: [
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-20,-30,-30,-40,-40,-30,-30,-20],
      [-10,-20,-20,-20,-20,-20,-20,-10],
      [ 20, 20,  0,  0,  0,  0, 20, 20],
      [ 20, 30, 10,  0,  0, 10, 30, 20]
    ],
    k_endgame: [
      [-50,-40,-30,-20,-20,-30,-40,-50],
      [-30,-20,-10,  0,  0,-10,-20,-30],
      [-30,-10, 20, 30, 30, 20,-10,-30],
      [-30,-10, 30, 40, 40, 30,-10,-30],
      [-30,-10, 30, 40, 40, 30,-10,-30],
      [-30,-10, 20, 30, 30, 20,-10,-30],
      [-30,-30,  0,  0,  0,  0,-30,-30],
      [-50,-30,-30,-30,-30,-30,-30,-50]
    ]
  };

  // Opening book moves
  const OPENINGS = {
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1': ['e4', 'd4', 'Nf3', 'c4'],
    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1': ['e5', 'c5', 'e6', 'c6', 'Nf6'],
    'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1': ['d5', 'Nf6', 'e6', 'g6'],
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2': ['Nf3', 'Bc4', 'Nc3'],
    'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2': ['Nf3', 'Nc3', 'c3', 'd4']
  };

  class ChessAI {
    constructor() {
      this.transpositionTable = new Map();
      this.nodesEvaluated = 0;
    }

    /**
     * Clear transposition table
     */
    reset() {
      this.transpositionTable.clear();
      this.nodesEvaluated = 0;
    }

    /**
     * Evaluate board static position from perspective of active player
     */
    evaluate(chess) {
      if (chess.isCheckmate()) {
        return -999999;
      }
      if (chess.isDraw()) {
        return 0;
      }

      let score = 0;
      let pieceCount = 0;

      // Count total non-pawn pieces to determine endgame
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const p = chess.board[y][x];
          if (p && p.type !== 'k' && p.type !== 'p') pieceCount++;
        }
      }
      const isEndgame = pieceCount <= 6;

      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const p = chess.board[y][x];
          if (!p) continue;

          let val = PIECE_VALS[p.type] || 0;
          let pstScore = 0;

          const table = p.type === 'k' 
            ? (isEndgame ? PST.k_endgame : PST.k_middle) 
            : PST[p.type];

          if (table) {
            // White reads table from top (y=7 is rank 8 -> index 0)
            const tableY = p.color === 'w' ? (7 - y) : y;
            pstScore = table[tableY][x];
          }

          const totalPieceVal = val + pstScore;

          if (p.color === 'w') {
            score += totalPieceVal;
          } else {
            score -= totalPieceVal;
          }
        }
      }

      // Return evaluation from perspective of player to move
      return chess.turn === 'w' ? score : -score;
    }

    /**
     * Move ordering for alpha-beta pruning (Captures first via MVV-LVA)
     */
    orderMoves(chess, moves) {
      return moves.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        if (a.captured) {
          scoreA += 10 * PIECE_VALS[a.captured] - PIECE_VALS[a.piece];
        }
        if (a.promotion) {
          scoreA += PIECE_VALS[a.promotion];
        }

        if (b.captured) {
          scoreB += 10 * PIECE_VALS[b.captured] - PIECE_VALS[b.piece];
        }
        if (b.promotion) {
          scoreB += PIECE_VALS[b.promotion];
        }

        return scoreB - scoreA;
      });
    }

    /**
     * Quiescence Search on tactical captures to eliminate horizon effect
     */
    quiescence(chess, alpha, beta, depth = 0, maxQDepth = 3) {
      this.nodesEvaluated++;
      const standPat = this.evaluate(chess);

      if (standPat >= beta) return beta;
      if (standPat > alpha) alpha = standPat;
      if (depth >= maxQDepth) return alpha;

      // Only search captures in quiescence
      const captures = chess.legalMoves().filter(m => m.captured || m.promotion);
      const ordered = this.orderMoves(chess, captures);

      for (const m of ordered) {
        chess.makeInternalMove(m);
        chess.turn = chess.turn === 'w' ? 'b' : 'w';

        const score = -this.quiescence(chess, -beta, -alpha, depth + 1, maxQDepth);

        chess.turn = chess.turn === 'w' ? 'b' : 'w';
        chess.undoInternalMove(m, { piece: { color: chess.turn, type: m.piece }, captured: m.captured ? { color: chess.turn === 'w' ? 'b' : 'w', type: m.captured } : null });

        if (score >= beta) return beta;
        if (score > alpha) alpha = score;
      }

      return alpha;
    }

    /**
     * Minimax with Alpha-Beta Pruning
     */
    minimax(chess, depth, alpha, beta, useQuiescence = true) {
      this.nodesEvaluated++;

      if (depth <= 0) {
        return useQuiescence ? this.quiescence(chess, alpha, beta) : this.evaluate(chess);
      }

      if (chess.isGameOver()) {
        return this.evaluate(chess);
      }

      // Check transposition table
      const fenKey = chess.getPositionKey() + ':' + depth;
      if (this.transpositionTable.has(fenKey)) {
        return this.transpositionTable.get(fenKey);
      }

      const legals = chess.legalMoves();
      const ordered = this.orderMoves(chess, legals);

      let bestScore = -Infinity;

      for (const m of ordered) {
        const executed = chess.move(m);
        if (!executed) continue;

        const score = -this.minimax(chess, depth - 1, -beta, -alpha, useQuiescence);
        chess.undo();

        if (score > bestScore) {
          bestScore = score;
        }
        if (bestScore > alpha) {
          alpha = bestScore;
        }
        if (alpha >= beta) {
          break; // Alpha-Beta Cutoff
        }
      }

      this.transpositionTable.set(fenKey, bestScore);
      return bestScore;
    }

    /**
     * Get Best Strategic Move for chosen Difficulty
     * Difficulty: 'easy' | 'medium' | 'hard' | 'expert'
     */
    async getBestMove(chess, difficulty = 'medium', onProgress = null) {
      const legals = chess.legalMoves();
      if (legals.length === 0) return null;

      // 1. Check Opening Book (if on Hard or Expert)
      if (difficulty === 'hard' || difficulty === 'expert') {
        const fen = chess.fen();
        const bookMoves = OPENINGS[fen];
        if (bookMoves && bookMoves.length > 0) {
          const chosen = bookMoves[Math.floor(Math.random() * bookMoves.length)];
          const matchingMove = legals.find(m => m.san === chosen);
          if (matchingMove) {
            return matchingMove;
          }
        }
      }

      // 2. EASY: Depth 1-2 with 30% blunder rate
      if (difficulty === 'easy') {
        if (Math.random() < 0.35) {
          // Intentional random blunder/sub-optimal move
          return legals[Math.floor(Math.random() * legals.length)];
        }
        // Otherwise simple shallow evaluation (Depth 1)
        let bestScore = -Infinity;
        let bestMove = legals[0];
        for (const m of legals) {
          chess.move(m);
          const score = -this.evaluate(chess);
          chess.undo();
          if (score > bestScore) {
            bestScore = score;
            bestMove = m;
          }
        }
        return bestMove;
      }

      // 3. MEDIUM: Depth 3 Alpha-Beta, rare blunder (8%)
      if (difficulty === 'medium') {
        if (Math.random() < 0.08) {
          return legals[Math.floor(Math.random() * legals.length)];
        }

        const depth = 3;
        let bestScore = -Infinity;
        let bestMoves = [];
        const ordered = this.orderMoves(chess, legals);

        for (let i = 0; i < ordered.length; i++) {
          const m = ordered[i];
          chess.move(m);
          const score = -this.minimax(chess, depth - 1, -Infinity, Infinity, false);
          chess.undo();

          if (score > bestScore) {
            bestScore = score;
            bestMoves = [m];
          } else if (score === bestScore) {
            bestMoves.push(m);
          }

          if (onProgress && i % 4 === 0) {
            onProgress({ current: i + 1, total: ordered.length, depth });
            await new Promise(r => setTimeout(r, 0));
          }
        }

        return bestMoves[Math.floor(Math.random() * bestMoves.length)] || legals[0];
      }

      // 4. HARD: Depth 4 with Quiescence search
      if (difficulty === 'hard') {
        const depth = 4;
        let bestScore = -Infinity;
        let bestMoves = [];
        const ordered = this.orderMoves(chess, legals);

        for (let i = 0; i < ordered.length; i++) {
          const m = ordered[i];
          chess.move(m);
          const score = -this.minimax(chess, depth - 1, -Infinity, -bestScore, true);
          chess.undo();

          if (score > bestScore) {
            bestScore = score;
            bestMoves = [m];
          } else if (score === bestScore) {
            bestMoves.push(m);
          }

          if (onProgress && i % 3 === 0) {
            onProgress({ current: i + 1, total: ordered.length, depth });
            await new Promise(r => setTimeout(r, 0));
          }
        }

        return bestMoves[0] || legals[0];
      }

      // 5. EXPERT: Iterative Deepening (Depth 4-5) + Full Quiescence + Transposition Memo
      if (difficulty === 'expert') {
        this.transpositionTable.clear();
        let currentBest = legals[0];
        const maxDepth = 5;

        for (let d = 2; d <= maxDepth; d++) {
          let bestScore = -Infinity;
          let bestMoveThisDepth = null;
          const ordered = this.orderMoves(chess, legals);

          for (let i = 0; i < ordered.length; i++) {
            const m = ordered[i];
            chess.move(m);
            const score = -this.minimax(chess, d - 1, -Infinity, -bestScore, true);
            chess.undo();

            if (score > bestScore) {
              bestScore = score;
              bestMoveThisDepth = m;
            }

            if (onProgress) {
              onProgress({ current: i + 1, total: ordered.length, depth: d });
            }
          }

          if (bestMoveThisDepth) {
            currentBest = bestMoveThisDepth;
          }

          // If found mate, don't need to search deeper
          if (bestScore > 900000) break;
          await new Promise(r => setTimeout(r, 0));
        }

        return currentBest;
      }

      return legals[0];
    }
  }

  return ChessAI;
}));

