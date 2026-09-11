/**
 * InfinityPlay - Production-Grade Standard Chess Engine
 * Complete implementation of standard FIDE rules:
 * - Legal move generation & validation
 * - Check, Checkmate & Stalemate detection
 * - Castling (kingside & queenside with path attack checks)
 * - En passant captures
 * - Pawn promotions (Queen, Rook, Bishop, Knight)
 * - Draw detection (Threefold repetition, 50-move rule, insufficient material)
 * - FEN string parsing & generation
 * - Standard Algebraic Notation (SAN) generation with disambiguation
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChessEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {

  const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  const PIECE_VALUES = {
    p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000
  };

  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

  // Helper conversions: square string <-> coordinates { x: 0..7, y: 0..7 } (0,0 is a1)
  function squareToCoord(sq) {
    if (!sq || sq.length < 2) return null;
    const file = sq.charCodeAt(0) - 97; // 'a' -> 0
    const rank = sq.charCodeAt(1) - 49; // '1' -> 0
    if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
    return { x: file, y: rank };
  }

  function coordToSquare(x, y) {
    if (x < 0 || x > 7 || y < 0 || y > 7) return null;
    return String.fromCharCode(97 + x) + (y + 1);
  }

  class Chess {
    constructor(fen = START_FEN) {
      this.load(fen);
    }

    /**
     * Reset board to starting position
     */
    reset() {
      return this.load(START_FEN);
    }

    /**
     * Load a position from FEN
     */
    load(fen) {
      const tokens = (fen || START_FEN).trim().split(/\s+/);
      const piecePlacement = tokens[0];
      const activeColor = tokens[1] || 'w';
      const castling = tokens[2] || '-';
      const enPassant = tokens[3] || '-';
      const halfmove = parseInt(tokens[4], 10) || 0;
      const fullmove = parseInt(tokens[5], 10) || 1;

      // 8x8 Board: board[y][x], where y = 0 is Rank 1, y = 7 is Rank 8
      this.board = Array(8).fill(null).map(() => Array(8).fill(null));

      const rows = piecePlacement.split('/');
      for (let r = 0; r < 8; r++) {
        const rankIdx = 7 - r; // FEN begins with rank 8 (r=0 -> rankIdx=7)
        let fileIdx = 0;
        for (const char of rows[r]) {
          if (/\d/.test(char)) {
            fileIdx += parseInt(char, 10);
          } else {
            const color = char === char.toUpperCase() ? 'w' : 'b';
            const type = char.toLowerCase();
            this.board[rankIdx][fileIdx] = { color, type };
            fileIdx++;
          }
        }
      }

      this.turn = activeColor;
      this.castling = {
        K: castling.includes('K'),
        Q: castling.includes('Q'),
        k: castling.includes('k'),
        q: castling.includes('q')
      };
      this.enPassant = enPassant !== '-' ? enPassant : null;
      this.halfmoveClock = halfmove;
      this.fullmoveNumber = fullmove;

      this.history = [];
      this.positionHistory = [this.getPositionKey()];
      this.capturedPieces = { w: [], b: [] };

      return true;
    }

    /**
     * Get piece at a square ('e4')
     */
    get(square) {
      const c = squareToCoord(square);
      if (!c) return null;
      const piece = this.board[c.y][c.x];
      return piece ? { ...piece } : null;
    }

    /**
     * Put a piece on square
     */
    put(piece, square) {
      const c = squareToCoord(square);
      if (!c) return false;
      this.board[c.y][c.x] = { color: piece.color, type: piece.type.toLowerCase() };
      return true;
    }

    /**
     * Remove piece from square
     */
    remove(square) {
      const c = squareToCoord(square);
      if (!c) return null;
      const piece = this.board[c.y][c.x];
      this.board[c.y][c.x] = null;
      return piece;
    }

    /**
     * Generate standard FEN
     */
    fen() {
      let res = '';
      for (let y = 7; y >= 0; y--) {
        let emptyCount = 0;
        for (let x = 0; x < 8; x++) {
          const piece = this.board[y][x];
          if (!piece) {
            emptyCount++;
          } else {
            if (emptyCount > 0) {
              res += emptyCount;
              emptyCount = 0;
            }
            const char = piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
            res += char;
          }
        }
        if (emptyCount > 0) res += emptyCount;
        if (y > 0) res += '/';
      }

      res += ' ' + this.turn;

      let castling = '';
      if (this.castling.K) castling += 'K';
      if (this.castling.Q) castling += 'Q';
      if (this.castling.k) castling += 'k';
      if (this.castling.q) castling += 'q';
      res += ' ' + (castling || '-');

      res += ' ' + (this.enPassant || '-');
      res += ' ' + this.halfmoveClock;
      res += ' ' + this.fullmoveNumber;

      return res;
    }

    /**
     * Normalized position key for threefold repetition
     */
    getPositionKey() {
      let res = '';
      for (let y = 7; y >= 0; y--) {
        for (let x = 0; x < 8; x++) {
          const p = this.board[y][x];
          res += p ? (p.color + p.type) : '.';
        }
      }
      res += ':' + this.turn;
      let c = '';
      if (this.castling.K) c += 'K';
      if (this.castling.Q) c += 'Q';
      if (this.castling.k) c += 'k';
      if (this.castling.q) c += 'q';
      res += ':' + (c || '-');
      res += ':' + (this.enPassant || '-');
      return res;
    }

    /**
     * Check if a square is under attack by a given color
     */
    isSquareAttacked(targetSq, attackingColor) {
      const tc = typeof targetSq === 'string' ? squareToCoord(targetSq) : targetSq;
      if (!tc) return false;

      const pawnDir = attackingColor === 'w' ? 1 : -1;
      const pawnRank = tc.y - pawnDir;

      // 1. Pawn attacks
      if (pawnRank >= 0 && pawnRank <= 7) {
        if (tc.x > 0) {
          const p = this.board[pawnRank][tc.x - 1];
          if (p && p.color === attackingColor && p.type === 'p') return true;
        }
        if (tc.x < 7) {
          const p = this.board[pawnRank][tc.x + 1];
          if (p && p.color === attackingColor && p.type === 'p') return true;
        }
      }

      // 2. Knight attacks
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dx, dy] of knightMoves) {
        const nx = tc.x + dx;
        const ny = tc.y + dy;
        if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
          const p = this.board[ny][nx];
          if (p && p.color === attackingColor && p.type === 'n') return true;
        }
      }

      // 3. Bishop / Queen diagonal rays
      const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      for (const [dx, dy] of diagDirs) {
        let step = 1;
        while (true) {
          const nx = tc.x + dx * step;
          const ny = tc.y + dy * step;
          if (nx < 0 || nx > 7 || ny < 0 || ny > 7) break;
          const p = this.board[ny][nx];
          if (p) {
            if (p.color === attackingColor && (p.type === 'b' || p.type === 'q')) {
              return true;
            }
            break; // path blocked
          }
          step++;
        }
      }

      // 4. Rook / Queen orthogonal rays
      const orthoDirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
      for (const [dx, dy] of orthoDirs) {
        let step = 1;
        while (true) {
          const nx = tc.x + dx * step;
          const ny = tc.y + dy * step;
          if (nx < 0 || nx > 7 || ny < 0 || ny > 7) break;
          const p = this.board[ny][nx];
          if (p) {
            if (p.color === attackingColor && (p.type === 'r' || p.type === 'q')) {
              return true;
            }
            break; // path blocked
          }
          step++;
        }
      }

      // 5. King attacks (1 step)
      const kingSteps = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];
      for (const [dx, dy] of kingSteps) {
        const nx = tc.x + dx;
        const ny = tc.y + dy;
        if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
          const p = this.board[ny][nx];
          if (p && p.color === attackingColor && p.type === 'k') return true;
        }
      }

      return false;
    }

    /**
     * Find square coordinates of the King of given color
     */
    findKing(color) {
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const p = this.board[y][x];
          if (p && p.color === color && p.type === 'k') {
            return { x, y };
          }
        }
      }
      return null;
    }

    /**
     * Check if given color's king is currently in check
     */
    inCheck(color = this.turn) {
      const kingCoord = this.findKing(color);
      if (!kingCoord) return false;
      const opponentColor = color === 'w' ? 'b' : 'w';
      return this.isSquareAttacked(kingCoord, opponentColor);
    }

    /**
     * Generate all pseudo-legal moves for active color
     */
    generatePseudoMoves(color = this.turn) {
      const moves = [];
      const forwardDir = color === 'w' ? 1 : -1;
      const startRank = color === 'w' ? 1 : 6;
      const promoRank = color === 'w' ? 7 : 0;
      const oppColor = color === 'w' ? 'b' : 'w';

      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const p = this.board[y][x];
          if (!p || p.color !== color) continue;

          const fromSq = coordToSquare(x, y);

          // --- PAWN ---
          if (p.type === 'p') {
            const nextY = y + forwardDir;
            if (nextY >= 0 && nextY <= 7) {
              // 1. Single forward push
              if (!this.board[nextY][x]) {
                if (nextY === promoRank) {
                  ['q', 'r', 'b', 'n'].forEach(promo => {
                    moves.push({ from: fromSq, to: coordToSquare(x, nextY), promotion: promo, piece: 'p' });
                  });
                } else {
                  moves.push({ from: fromSq, to: coordToSquare(x, nextY), piece: 'p' });

                  // 2. Double forward push from start rank
                  const doubleY = y + forwardDir * 2;
                  if (y === startRank && !this.board[doubleY][x]) {
                    moves.push({ from: fromSq, to: coordToSquare(x, doubleY), piece: 'p' });
                  }
                }
              }

              // 3. Diagonal captures
              for (const dx of [-1, 1]) {
                const targetX = x + dx;
                if (targetX >= 0 && targetX <= 7) {
                  const targetPiece = this.board[nextY][targetX];
                  const targetSq = coordToSquare(targetX, nextY);

                  // Standard capture
                  if (targetPiece && targetPiece.color === oppColor) {
                    if (nextY === promoRank) {
                      ['q', 'r', 'b', 'n'].forEach(promo => {
                        moves.push({ from: fromSq, to: targetSq, promotion: promo, captured: targetPiece.type, piece: 'p' });
                      });
                    } else {
                      moves.push({ from: fromSq, to: targetSq, captured: targetPiece.type, piece: 'p' });
                    }
                  }

                  // En passant capture
                  if (this.enPassant && targetSq === this.enPassant) {
                    moves.push({ from: fromSq, to: targetSq, captured: 'p', isEnPassant: true, piece: 'p' });
                  }
                }
              }
            }
          }

          // --- KNIGHT ---
          else if (p.type === 'n') {
            const steps = [
              [-2, -1], [-2, 1], [-1, -2], [-1, 2],
              [1, -2], [1, 2], [2, -1], [2, 1]
            ];
            for (const [dx, dy] of steps) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
                const tp = this.board[ny][nx];
                if (!tp) {
                  moves.push({ from: fromSq, to: coordToSquare(nx, ny), piece: 'n' });
                } else if (tp.color === oppColor) {
                  moves.push({ from: fromSq, to: coordToSquare(nx, ny), captured: tp.type, piece: 'n' });
                }
              }
            }
          }

          // --- BISHOP / ROOK / QUEEN ---
          else if (p.type === 'b' || p.type === 'r' || p.type === 'q') {
            const dirs = [];
            if (p.type === 'b' || p.type === 'q') {
              dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
            }
            if (p.type === 'r' || p.type === 'q') {
              dirs.push([0, -1], [0, 1], [-1, 0], [1, 0]);
            }

            for (const [dx, dy] of dirs) {
              let step = 1;
              while (true) {
                const nx = x + dx * step;
                const ny = y + dy * step;
                if (nx < 0 || nx > 7 || ny < 0 || ny > 7) break;
                const tp = this.board[ny][nx];
                if (!tp) {
                  moves.push({ from: fromSq, to: coordToSquare(nx, ny), piece: p.type });
                } else {
                  if (tp.color === oppColor) {
                    moves.push({ from: fromSq, to: coordToSquare(nx, ny), captured: tp.type, piece: p.type });
                  }
                  break; // blocked
                }
                step++;
              }
            }
          }

          // --- KING ---
          else if (p.type === 'k') {
            const steps = [
              [-1, -1], [-1, 0], [-1, 1],
              [0, -1],           [0, 1],
              [1, -1],  [1, 0],  [1, 1]
            ];
            for (const [dx, dy] of steps) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
                const tp = this.board[ny][nx];
                if (!tp) {
                  moves.push({ from: fromSq, to: coordToSquare(nx, ny), piece: 'k' });
                } else if (tp.color === oppColor) {
                  moves.push({ from: fromSq, to: coordToSquare(nx, ny), captured: tp.type, piece: 'k' });
                }
              }
            }

            // --- CASTLING ---
            // King cannot castle out of check
            if (!this.inCheck(color)) {
              if (color === 'w' && y === 0 && x === 4) {
                // White Kingside: e1 -> g1
                if (this.castling.K && !this.board[0][5] && !this.board[0][6]) {
                  if (!this.isSquareAttacked({ x: 5, y: 0 }, 'b') && !this.isSquareAttacked({ x: 6, y: 0 }, 'b')) {
                    moves.push({ from: 'e1', to: 'g1', isCastling: 'K', piece: 'k' });
                  }
                }
                // White Queenside: e1 -> c1
                if (this.castling.Q && !this.board[0][3] && !this.board[0][2] && !this.board[0][1]) {
                  if (!this.isSquareAttacked({ x: 3, y: 0 }, 'b') && !this.isSquareAttacked({ x: 2, y: 0 }, 'b')) {
                    moves.push({ from: 'e1', to: 'c1', isCastling: 'Q', piece: 'k' });
                  }
                }
              } else if (color === 'b' && y === 7 && x === 4) {
                // Black Kingside: e8 -> g8
                if (this.castling.k && !this.board[7][5] && !this.board[7][6]) {
                  if (!this.isSquareAttacked({ x: 5, y: 7 }, 'w') && !this.isSquareAttacked({ x: 6, y: 7 }, 'w')) {
                    moves.push({ from: 'e8', to: 'g8', isCastling: 'k', piece: 'k' });
                  }
                }
                // Black Queenside: e8 -> c8
                if (this.castling.q && !this.board[7][3] && !this.board[7][2] && !this.board[7][1]) {
                  if (!this.isSquareAttacked({ x: 3, y: 7 }, 'w') && !this.isSquareAttacked({ x: 2, y: 7 }, 'w')) {
                    moves.push({ from: 'e8', to: 'c8', isCastling: 'q', piece: 'k' });
                  }
                }
              }
            }
          }

        }
      }

      return moves;
    }

    /**
     * Apply move to board without history tracking (internal testing)
     */
    makeInternalMove(move) {
      const from = squareToCoord(move.from);
      const to = squareToCoord(move.to);
      const piece = this.board[from.y][from.x];

      const captured = this.board[to.y][to.x];
      this.board[to.y][to.x] = piece;
      this.board[from.y][from.x] = null;

      // Handle promotion
      if (move.promotion) {
        this.board[to.y][to.x] = { color: piece.color, type: move.promotion };
      }

      // Handle en passant capture
      let epCapture = null;
      if (move.isEnPassant) {
        const epY = piece.color === 'w' ? to.y - 1 : to.y + 1;
        epCapture = this.board[epY][to.x];
        this.board[epY][to.x] = null;
      }

      // Handle castling rook movement
      if (move.isCastling) {
        if (move.isCastling === 'K') {
          this.board[0][5] = this.board[0][7];
          this.board[0][7] = null;
        } else if (move.isCastling === 'Q') {
          this.board[0][3] = this.board[0][0];
          this.board[0][0] = null;
        } else if (move.isCastling === 'k') {
          this.board[7][5] = this.board[7][7];
          this.board[7][7] = null;
        } else if (move.isCastling === 'q') {
          this.board[7][3] = this.board[7][0];
          this.board[7][0] = null;
        }
      }

      return { piece, captured, epCapture };
    }

    undoInternalMove(move, undoInfo) {
      const from = squareToCoord(move.from);
      const to = squareToCoord(move.to);

      this.board[from.y][from.x] = undoInfo.piece;
      this.board[to.y][to.x] = undoInfo.captured;

      if (move.isEnPassant && undoInfo.epCapture) {
        const epY = undoInfo.piece.color === 'w' ? to.y - 1 : to.y + 1;
        this.board[epY][to.x] = undoInfo.epCapture;
      }

      if (move.isCastling) {
        if (move.isCastling === 'K') {
          this.board[0][7] = this.board[0][5];
          this.board[0][5] = null;
        } else if (move.isCastling === 'Q') {
          this.board[0][0] = this.board[0][3];
          this.board[0][3] = null;
        } else if (move.isCastling === 'k') {
          this.board[7][7] = this.board[7][5];
          this.board[7][5] = null;
        } else if (move.isCastling === 'q') {
          this.board[7][0] = this.board[7][3];
          this.board[7][3] = null;
        }
      }
    }

    /**
     * Returns true if a pseudo move is fully legal
     */
    isMoveLegal(move, color = this.turn) {
      const undoInfo = this.makeInternalMove(move);
      const leavesInCheck = this.inCheck(color);
      this.undoInternalMove(move, undoInfo);
      return !leavesInCheck;
    }

    /**
     * Generate all strict legal moves for active color
     * Options: { square: 'e4', verbose: true }
     */
    legalMoves(options = {}) {
      const pseudos = this.generatePseudoMoves(this.turn);
      const legals = [];

      for (const m of pseudos) {
        if (options.square && m.from !== options.square) continue;

        if (this.isMoveLegal(m, this.turn)) {
          // Generate SAN for this legal move
          m.san = this.moveToSan(m, pseudos);
          legals.push(m);
        }
      }

      return legals;
    }

    /**
     * Compute Standard Algebraic Notation (SAN)
     */
    moveToSan(move, allMoves = null) {
      if (move.isCastling) {
        return (move.isCastling === 'K' || move.isCastling === 'k') ? 'O-O' : 'O-O-O';
      }

      const piece = this.get(move.from);
      if (!piece) return move.from + '-' + move.to;

      let san = '';

      if (piece.type === 'p') {
        if (move.captured || move.isEnPassant) {
          san += move.from.charAt(0) + 'x' + move.to;
        } else {
          san += move.to;
        }
        if (move.promotion) {
          san += '=' + move.promotion.toUpperCase();
        }
      } else {
        san += piece.type.toUpperCase();

        // Check if disambiguation is required
        if (allMoves) {
          const competitors = allMoves.filter(m => 
            m.to === move.to && 
            m.from !== move.from && 
            m.piece === piece.type &&
            this.isMoveLegal(m, piece.color)
          );

          if (competitors.length > 0) {
            const sameFile = competitors.some(c => c.from.charAt(0) === move.from.charAt(0));
            const sameRank = competitors.some(c => c.from.charAt(1) === move.from.charAt(1));

            if (!sameFile) {
              san += move.from.charAt(0);
            } else if (!sameRank) {
              san += move.from.charAt(1);
            } else {
              san += move.from;
            }
          }
        }

        if (move.captured) {
          san += 'x';
        }
        san += move.to;
      }

      // Check if move gives check or checkmate
      const undoInfo = this.makeInternalMove(move);
      const nextColor = piece.color === 'w' ? 'b' : 'w';
      const check = this.inCheck(nextColor);

      if (check) {
        // Test if checkmate
        const oppLegals = this.generatePseudoMoves(nextColor).filter(m => this.isMoveLegal(m, nextColor));
        san += (oppLegals.length === 0) ? '#' : '+';
      }

      this.undoInternalMove(move, undoInfo);

      return san;
    }

    /**
     * Execute a move: string ('e4', 'Nf3') or object ({ from: 'e2', to: 'e4', promotion: 'q' })
     */
    move(moveInput) {
      let candidate = null;
      const legals = this.legalMoves();

      if (typeof moveInput === 'string') {
        const clean = moveInput.trim();
        candidate = legals.find(m => m.san === clean || `${m.from}${m.to}` === clean || `${m.from}-${m.to}` === clean);
      } else if (typeof moveInput === 'object') {
        candidate = legals.find(m => 
          m.from === moveInput.from && 
          m.to === moveInput.to && 
          (!moveInput.promotion || m.promotion === moveInput.promotion.toLowerCase())
        );
      }

      if (!candidate) return null;

      // Save state before move for full undo capability
      const prevState = {
        board: this.board.map(row => row.map(p => p ? { ...p } : null)),
        turn: this.turn,
        castling: { ...this.castling },
        enPassant: this.enPassant,
        halfmoveClock: this.halfmoveClock,
        fullmoveNumber: this.fullmoveNumber,
        fen: this.fen()
      };

      const fromCoord = squareToCoord(candidate.from);
      const toCoord = squareToCoord(candidate.to);
      const piece = this.board[fromCoord.y][fromCoord.x];
      const captured = this.board[toCoord.y][toCoord.x];

      // Track captured piece
      if (captured) {
        this.capturedPieces[this.turn].push(captured.type);
      } else if (candidate.isEnPassant) {
        this.capturedPieces[this.turn].push('p');
      }

      // Update 50-move clock
      if (piece.type === 'p' || captured || candidate.isEnPassant) {
        this.halfmoveClock = 0;
      } else {
        this.halfmoveClock++;
      }

      // Execute on board
      this.makeInternalMove(candidate);

      // Update Castling Rights if King or Rooks move/captured
      if (piece.type === 'k') {
        if (piece.color === 'w') {
          this.castling.K = false;
          this.castling.Q = false;
        } else {
          this.castling.k = false;
          this.castling.q = false;
        }
      }
      if (piece.type === 'r') {
        if (candidate.from === 'h1') this.castling.K = false;
        else if (candidate.from === 'a1') this.castling.Q = false;
        else if (candidate.from === 'h8') this.castling.k = false;
        else if (candidate.from === 'a8') this.castling.q = false;
      }
      // If rook is captured
      if (candidate.to === 'h1') this.castling.K = false;
      else if (candidate.to === 'a1') this.castling.Q = false;
      else if (candidate.to === 'h8') this.castling.k = false;
      else if (candidate.to === 'a8') this.castling.q = false;

      // Update En Passant target
      if (piece.type === 'p' && Math.abs(toCoord.y - fromCoord.y) === 2) {
        const epY = piece.color === 'w' ? fromCoord.y + 1 : fromCoord.y - 1;
        this.enPassant = coordToSquare(fromCoord.x, epY);
      } else {
        this.enPassant = null;
      }

      // Increment fullmove
      if (this.turn === 'b') {
        this.fullmoveNumber++;
      }

      // Switch turn
      this.turn = this.turn === 'w' ? 'b' : 'w';

      // Save to history
      const executedRecord = {
        ...candidate,
        piece: piece.type,
        color: piece.color,
        captured: captured ? captured.type : (candidate.isEnPassant ? 'p' : null),
        fenAfter: this.fen(),
        prevState
      };

      this.history.push(executedRecord);
      this.positionHistory.push(this.getPositionKey());

      return executedRecord;
    }

    /**
     * Undo last executed move
     */
    undo() {
      if (this.history.length === 0) return null;
      const lastMove = this.history.pop();
      this.positionHistory.pop();

      const prev = lastMove.prevState;
      this.board = prev.board;
      this.turn = prev.turn;
      this.castling = prev.castling;
      this.enPassant = prev.enPassant;
      this.halfmoveClock = prev.halfmoveClock;
      this.fullmoveNumber = prev.fullmoveNumber;

      // Pop captured piece list
      if (lastMove.captured) {
        const list = this.capturedPieces[lastMove.color];
        const idx = list.lastIndexOf(lastMove.captured);
        if (idx >= 0) list.splice(idx, 1);
      }

      return lastMove;
    }

    /**
     * Game Status Checks
     */
    isCheck() {
      return this.inCheck(this.turn);
    }

    isCheckmate() {
      return this.inCheck(this.turn) && this.legalMoves().length === 0;
    }

    isStalemate() {
      return !this.inCheck(this.turn) && this.legalMoves().length === 0;
    }

    isThreefoldRepetition() {
      const current = this.getPositionKey();
      let count = 0;
      for (const key of this.positionHistory) {
        if (key === current) count++;
      }
      return count >= 3;
    }

    isInsufficientMaterial() {
      const pieces = { w: [], b: [] };
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const p = this.board[y][x];
          if (p) {
            pieces[p.color].push({ ...p, square: coordToSquare(x, y) });
          }
        }
      }

      // If any pawns, queens, or rooks exist -> sufficient material
      for (const col of ['w', 'b']) {
        if (pieces[col].some(p => p.type === 'p' || p.type === 'q' || p.type === 'r')) {
          return false;
        }
      }

      const wCount = pieces.w.length;
      const bCount = pieces.b.length;

      // 1. King vs King
      if (wCount === 1 && bCount === 1) return true;

      // 2. King + Knight/Bishop vs King
      if ((wCount === 2 && bCount === 1) || (wCount === 1 && bCount === 2)) {
        const minorSide = wCount === 2 ? pieces.w : pieces.b;
        const minor = minorSide.find(p => p.type !== 'k');
        if (minor && (minor.type === 'b' || minor.type === 'n')) return true;
      }

      // 3. King + Bishop vs King + Bishop with same square color
      if (wCount === 2 && bCount === 2) {
        const wMinor = pieces.w.find(p => p.type === 'b');
        const bMinor = pieces.b.find(p => p.type === 'b');
        if (wMinor && bMinor) {
          const wc = squareToCoord(wMinor.square);
          const bc = squareToCoord(bMinor.square);
          const wColorSquare = (wc.x + wc.y) % 2;
          const bColorSquare = (bc.x + bc.y) % 2;
          if (wColorSquare === bColorSquare) return true;
        }
      }

      return false;
    }

    isDraw() {
      return (
        this.isStalemate() ||
        this.halfmoveClock >= 100 || // 50-move rule
        this.isThreefoldRepetition() ||
        this.isInsufficientMaterial()
      );
    }

    isGameOver() {
      return this.isCheckmate() || this.isDraw();
    }

    getDrawReason() {
      if (this.isStalemate()) return 'stalemate';
      if (this.halfmoveClock >= 100) return '50_move_rule';
      if (this.isThreefoldRepetition()) return 'threefold_repetition';
      if (this.isInsufficientMaterial()) return 'insufficient_material';
      return null;
    }

    /**
     * Calculate material balance: returns White advantage in points (e.g. +3, -2)
     */
    getMaterialDifference() {
      let whiteScore = 0;
      let blackScore = 0;

      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const p = this.board[y][x];
          if (p && p.type !== 'k') {
            const val = PIECE_VALUES[p.type] || 0;
            if (p.color === 'w') whiteScore += val;
            else blackScore += val;
          }
        }
      }

      return Math.round((whiteScore - blackScore) / 100);
    }

    /**
     * Export complete match PGN
     */
    pgn(headerTags = {}) {
      const headers = {
        Event: 'InfinityPlay Chess Grandmaster',
        Site: 'InfinityPlay Online',
        Date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
        Round: '1',
        White: 'Player 1',
        Black: 'Player 2',
        Result: this.isCheckmate() 
          ? (this.turn === 'w' ? '0-1' : '1-0') 
          : (this.isDraw() ? '1/2-1/2' : '*'),
        ...headerTags
      };

      let output = '';
      for (const [k, v] of Object.entries(headers)) {
        output += `[${k} "${v}"]\n`;
      }
      output += '\n';

      let moveStr = '';
      for (let i = 0; i < this.history.length; i++) {
        if (i % 2 === 0) {
          const turnNum = Math.floor(i / 2) + 1;
          moveStr += `${turnNum}. `;
        }
        moveStr += `${this.history[i].san} `;
      }

      moveStr += headers.Result;
      output += moveStr.trim();
      return output;
    }
  }

  return Chess;
}));

