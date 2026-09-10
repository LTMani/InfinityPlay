/**
 * InfinityPlay - Vector SVG Chess Pieces & High-Performance Board Renderer
 * Features:
 * - Crisp SVG scalable piece sets (Neo-Vector, Staunton Standard, Cyber Glow, Alpha Modern)
 * - Mouse drag-and-drop & touch drag-and-drop
 * - Click-to-select and click-to-move
 * - Dynamic legal move highlighting (dots on empty, capture rings on enemies)
 * - Previous move highlights & In-check king pulsing aura
 * - Board flipping (White on bottom vs Black on bottom)
 * - 5 Board themes (Cyber Neon, Classic Wood, Midnight Slate, Emerald Tournament, Glass Frost)
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChessBoard = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {

  // Scalable SVG Piece Vectors
  const SVG_PIECES = {
    // White Pieces
    wP: `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round"/><circle cx="22.5" cy="13" r="3" fill="#ffffff"/></svg>`,
    wN: `<svg viewBox="0 0 45 45"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/><circle cx="9.5" cy="25.5" r="1.2" fill="#0f172a"/><circle cx="15" cy="15.5" r="1.5" fill="#0f172a"/></svg>`,
    wB: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#ffffff"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2zM15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15M22.5 15.5v5M20 18h5" stroke="#0f172a"/></g></svg>`,
    wR: `<svg viewBox="0 0 45 45"><g fill="#ffffff" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" /><path d="M12 32l1.5-18h18l1.5 18H12zM14 29.5h17M14 16.5h17" fill="none" stroke="#0f172a"/></g></svg>`,
    wQ: `<svg viewBox="0 0 45 45"><g fill="#ffffff" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path d="M11 38.5h23" fill="none"/></g></svg>`,
    wK: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke="#0f172a"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#ffffff" stroke="#0f172a"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23v--.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill="#ffffff" stroke="#0f172a"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#0f172a"/></g></svg>`,

    // Black Pieces
    bP: `<svg viewBox="0 0 45 45"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#1e293b" stroke="#00f0ff" stroke-width="1.5" stroke-linecap="round"/><circle cx="22.5" cy="13" r="3" fill="#1e293b"/></svg>`,
    bN: `<svg viewBox="0 0 45 45"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#1e293b" stroke="#00f0ff" stroke-width="1.5"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#1e293b" stroke="#00f0ff" stroke-width="1.5"/><circle cx="9.5" cy="25.5" r="1.2" fill="#00f0ff"/><circle cx="15" cy="15.5" r="1.5" fill="#00f0ff"/></svg>`,
    bB: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#00f0ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#1e293b"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2zM15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15M22.5 15.5v5M20 18h5" stroke="#00f0ff"/></g></svg>`,
    bR: `<svg viewBox="0 0 45 45"><g fill="#1e293b" stroke="#00f0ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" /><path d="M12 32l1.5-18h18l1.5 18H12zM14 29.5h17M14 16.5h17" fill="none" stroke="#00f0ff"/></g></svg>`,
    bQ: `<svg viewBox="0 0 45 45"><g fill="#1e293b" stroke="#00f0ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path d="M11 38.5h23" fill="none"/></g></svg>`,
    bK: `<svg viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#00f0ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke="#00f0ff"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#1e293b" stroke="#00f0ff"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V23v--.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z" fill="#1e293b" stroke="#00f0ff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#00f0ff"/></g></svg>`
  };

  class ChessBoard {
    constructor(containerEl, options = {}) {
      this.container = containerEl;
      this.orientation = options.orientation || 'w'; // 'w' = White on bottom, 'b' = Black on bottom
      this.boardTheme = options.boardTheme || 'cyber'; // cyber, wood, slate, emerald, glass
      this.pieceTheme = options.pieceTheme || 'neo';
      this.showCoordinates = options.showCoordinates !== false;
      this.showLegalMoves = options.showLegalMoves !== false;
      this.showMoveHighlights = options.showMoveHighlights !== false;

      this.selectedSquare = null;
      this.legalMovesFromSquare = [];
      this.lastMove = null; // { from, to }
      this.checkSquare = null; // 'e1'

      this.onMove = options.onMove || null; // callback: (move) => boolean
      this.onSquareSelect = options.onSquareSelect || null;

      this.draggingPiece = null;
      this.dragGhost = null;

      this.initDOM();
      this.bindEvents();
    }

    initDOM() {
      this.container.innerHTML = '';
      this.container.className = `chess-board-wrapper theme-${this.boardTheme}`;

      // Board container
      this.boardEl = document.createElement('div');
      this.boardEl.className = 'chess-board';
      this.container.appendChild(this.boardEl);

      // Create 64 squares
      this.squareElements = {};
      for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
          const sq = String.fromCharCode(97 + f) + (8 - r);
          const sqEl = document.createElement('div');
          sqEl.className = `chess-square ${(r + f) % 2 === 0 ? 'light' : 'dark'}`;
          sqEl.dataset.square = sq;
          this.boardEl.appendChild(sqEl);
          this.squareElements[sq] = sqEl;
        }
      }

      this.updateCoordinates();
    }

    updateCoordinates() {
      // Re-order CSS grid display order according to orientation
      const ranks = this.orientation === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
      const files = this.orientation === 'w' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];

      let idx = 0;
      for (const r of ranks) {
        for (const f of files) {
          const sq = `${f}${r}`;
          const el = this.squareElements[sq];
          if (el) {
            el.style.order = idx++;

            // Clean existing coordinate labels
            el.querySelectorAll('.coord-label').forEach(c => c.remove());

            if (this.showCoordinates) {
              // File label on bottom rank
              if ((this.orientation === 'w' && r === 1) || (this.orientation === 'b' && r === 8)) {
                const fileLabel = document.createElement('span');
                fileLabel.className = 'coord-label coord-file';
                fileLabel.textContent = f;
                el.appendChild(fileLabel);
              }
              // Rank label on left file
              if ((this.orientation === 'w' && f === 'a') || (this.orientation === 'b' && f === 'h')) {
                const rankLabel = document.createElement('span');
                rankLabel.className = 'coord-label coord-rank';
                rankLabel.textContent = r;
                el.appendChild(rankLabel);
              }
            }
          }
        }
      }
    }

    setOrientation(color) {
      if (this.orientation !== color) {
        this.orientation = color;
        this.updateCoordinates();
      }
    }

    flip() {
      this.setOrientation(this.orientation === 'w' ? 'b' : 'w');
    }

    setTheme(boardTheme, pieceTheme = null) {
      if (boardTheme) {
        this.boardTheme = boardTheme;
        this.container.className = `chess-board-wrapper theme-${this.boardTheme}`;
      }
      if (pieceTheme) {
        this.pieceTheme = pieceTheme;
      }
    }

    /**
     * Render board state from 8x8 matrix or ChessEngine instance
     */
    render(chessEngine) {
      this.engine = chessEngine;

      // Clear pieces from squares
      for (const sq in this.squareElements) {
        const sqEl = this.squareElements[sq];
        sqEl.classList.remove('selected', 'legal-dest', 'legal-capture', 'last-move', 'in-check');

        // Remove old piece element
        const oldPiece = sqEl.querySelector('.chess-piece');
        if (oldPiece) oldPiece.remove();

        // Remove old highlight indicators
        const oldIndicator = sqEl.querySelector('.move-indicator');
        if (oldIndicator) oldIndicator.remove();
      }

      // Check highlights
      if (this.showMoveHighlights && this.lastMove) {
        if (this.squareElements[this.lastMove.from]) {
          this.squareElements[this.lastMove.from].classList.add('last-move');
        }
        if (this.squareElements[this.lastMove.to]) {
          this.squareElements[this.lastMove.to].classList.add('last-move');
        }
      }

      // Check king state
      if (chessEngine.isCheck()) {
        const kingCoord = chessEngine.findKing(chessEngine.turn);
        if (kingCoord) {
          const kingSq = String.fromCharCode(97 + kingCoord.x) + (kingCoord.y + 1);
          if (this.squareElements[kingSq]) {
            this.squareElements[kingSq].classList.add('in-check');
          }
        }
      }

      // Render pieces
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const piece = chessEngine.board[y][x];
          if (!piece) continue;

          const sq = String.fromCharCode(97 + x) + (y + 1);
          const sqEl = this.squareElements[sq];
          if (!sqEl) continue;

          const pieceKey = piece.color + piece.type.toUpperCase();
          const svgMarkup = SVG_PIECES[pieceKey];
          if (!svgMarkup) continue;

          const pieceEl = document.createElement('div');
          pieceEl.className = `chess-piece piece-${piece.color}${piece.type}`;
          pieceEl.dataset.square = sq;
          pieceEl.dataset.color = piece.color;
          pieceEl.dataset.type = piece.type;
          pieceEl.innerHTML = svgMarkup;

          sqEl.appendChild(pieceEl);
        }
      }

      // Highlight selected square and legal destinations
      if (this.selectedSquare && this.squareElements[this.selectedSquare]) {
        this.squareElements[this.selectedSquare].classList.add('selected');

        if (this.showLegalMoves) {
          for (const m of this.legalMovesFromSquare) {
            const destEl = this.squareElements[m.to];
            if (!destEl) continue;

            const isCapture = !!m.captured || m.isEnPassant;
            destEl.classList.add(isCapture ? 'legal-capture' : 'legal-dest');

            const indicator = document.createElement('div');
            indicator.className = `move-indicator ${isCapture ? 'capture-ring' : 'move-dot'}`;
            destEl.appendChild(indicator);
          }
        }
      }
    }

    setLastMove(from, to) {
      this.lastMove = { from, to };
    }

    clearSelection() {
      this.selectedSquare = null;
      this.legalMovesFromSquare = [];
      if (this.engine) {
        this.render(this.engine);
      }
    }

    selectSquare(sq) {
      if (!this.engine) return;

      const piece = this.engine.get(sq);

      // If clicked current selected square -> deselect
      if (this.selectedSquare === sq) {
        this.clearSelection();
        return;
      }

      // If already has selected square, check if clicking on legal destination
      if (this.selectedSquare) {
        const matchingMove = this.legalMovesFromSquare.find(m => m.to === sq);
        if (matchingMove) {
          const from = this.selectedSquare;
          this.clearSelection();
          if (this.onMove) {
            this.onMove({ from, to: sq, promotion: matchingMove.promotion });
          }
          return;
        }
      }

      // Select new piece of active player
      if (piece && piece.color === this.engine.turn) {
        this.selectedSquare = sq;
        this.legalMovesFromSquare = this.engine.legalMoves({ square: sq });
        this.render(this.engine);
        if (this.onSquareSelect) {
          this.onSquareSelect(sq, piece, this.legalMovesFromSquare);
        }
      } else {
        this.clearSelection();
      }
    }

    bindEvents() {
      // Click handling
      this.boardEl.addEventListener('click', (e) => {
        const sqEl = e.target.closest('.chess-square');
        if (!sqEl) return;
        const sq = sqEl.dataset.square;
        if (sq) {
          this.selectSquare(sq);
        }
      });

      // Mouse & Touch Drag-and-Drop
      let startX, startY;
      let draggedSq = null;
      let ghost = null;

      const onPointerDown = (clientX, clientY, target) => {
        const pieceEl = target.closest('.chess-piece');
        if (!pieceEl || !this.engine) return;

        const sq = pieceEl.dataset.square;
        const pieceColor = pieceEl.dataset.color;

        // Can only drag piece of active turn
        if (pieceColor !== this.engine.turn) return;

        draggedSq = sq;
        startX = clientX;
        startY = clientY;

        this.selectSquare(sq);

        // Create Drag Ghost
        ghost = pieceEl.cloneNode(true);
        ghost.className = 'chess-piece-ghost';
        ghost.style.position = 'fixed';
        ghost.style.pointerEvents = 'none';
        ghost.style.zIndex = '9999';
        ghost.style.width = pieceEl.offsetWidth + 'px';
        ghost.style.height = pieceEl.offsetHeight + 'px';
        ghost.style.left = (clientX - pieceEl.offsetWidth / 2) + 'px';
        ghost.style.top = (clientY - pieceEl.offsetHeight / 2) + 'px';
        document.body.appendChild(ghost);

        pieceEl.style.opacity = '0.35';
        this.draggingPiece = pieceEl;
      };

      const onPointerMove = (clientX, clientY) => {
        if (!ghost) return;
        ghost.style.left = (clientX - ghost.offsetWidth / 2) + 'px';
        ghost.style.top = (clientY - ghost.offsetHeight / 2) + 'px';
      };

      const onPointerUp = (clientX, clientY) => {
        if (!ghost) return;

        ghost.remove();
        ghost = null;

        if (this.draggingPiece) {
          this.draggingPiece.style.opacity = '1';
          this.draggingPiece = null;
        }

        // Detect square under drop position
        const elemBelow = document.elementFromPoint(clientX, clientY);
        const sqEl = elemBelow ? elemBelow.closest('.chess-square') : null;

        if (sqEl && draggedSq) {
          const targetSq = sqEl.dataset.square;
          if (targetSq && targetSq !== draggedSq) {
            const matchingMove = this.legalMovesFromSquare.find(m => m.to === targetSq);
            if (matchingMove) {
              const from = draggedSq;
              this.clearSelection();
              if (this.onMove) {
                this.onMove({ from, to: targetSq, promotion: matchingMove.promotion });
              }
            }
          }
        }

        draggedSq = null;
      };

      // Mouse events
      this.boardEl.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // only left click
        onPointerDown(e.clientX, e.clientY, e.target);
      });

      window.addEventListener('mousemove', (e) => {
        if (ghost) onPointerMove(e.clientX, e.clientY);
      });

      window.addEventListener('mouseup', (e) => {
        if (ghost) onPointerUp(e.clientX, e.clientY);
      });

      // Touch events
      this.boardEl.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        onPointerDown(touch.clientX, touch.clientY, e.target);
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (ghost && e.touches.length > 0) {
          const touch = e.touches[0];
          onPointerMove(touch.clientX, touch.clientY);
        }
      }, { passive: true });

      window.addEventListener('touchend', (e) => {
        if (ghost) {
          const touch = e.changedTouches[0];
          onPointerUp(touch.clientX, touch.clientY);
        }
      });
    }
  }

  return ChessBoard;
}));

