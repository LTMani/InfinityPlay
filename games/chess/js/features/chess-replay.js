/**
 * InfinityPlay - Chess Match Replay & PGN Analysis Viewer
 * Allows users to step through completed matches move-by-move,
 * jump to positions, auto-play with adjustable speed, view evaluation bars,
 * and export standard PGN / FEN.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChessReplay = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {

  class ChessReplay {
    constructor(chessEngineClass) {
      this.Chess = chessEngineClass;
      this.match = null;
      this.fens = [];
      this.moves = [];
      this.currentIndex = 0;
      this.isPlaying = false;
      this.playInterval = null;
      this.speedMs = 1500;
      this.onPositionChange = null;
    }

    /**
     * Load a match record or array of moves
     */
    loadMatch(matchData) {
      this.stopAutoPlay();
      this.match = matchData;
      this.moves = matchData.history || [];
      this.fens = [];

      const engine = new this.Chess();
      this.fens.push(engine.fen());

      for (const m of this.moves) {
        if (m.san) {
          engine.move(m.san);
        } else if (m.from && m.to) {
          engine.move(m);
        }
        this.fens.push(engine.fen());
      }

      this.currentIndex = this.fens.length - 1; // Default to final position
      this.notifyChange();
    }

    notifyChange() {
      if (this.onPositionChange) {
        const fen = this.fens[this.currentIndex];
        const move = this.currentIndex > 0 ? this.moves[this.currentIndex - 1] : null;
        this.onPositionChange({
          index: this.currentIndex,
          total: this.fens.length - 1,
          fen,
          move,
          isPlaying: this.isPlaying
        });
      }
    }

    first() {
      this.stopAutoPlay();
      this.currentIndex = 0;
      this.notifyChange();
    }

    prev() {
      this.stopAutoPlay();
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.notifyChange();
      }
    }

    next() {
      this.stopAutoPlay();
      if (this.currentIndex < this.fens.length - 1) {
        this.currentIndex++;
        this.notifyChange();
      }
    }

    last() {
      this.stopAutoPlay();
      this.currentIndex = this.fens.length - 1;
      this.notifyChange();
    }

    goTo(index) {
      this.stopAutoPlay();
      if (index >= 0 && index < this.fens.length) {
        this.currentIndex = index;
        this.notifyChange();
      }
    }

    togglePlay(speedMs = this.speedMs) {
      if (this.isPlaying) {
        this.stopAutoPlay();
      } else {
        this.startAutoPlay(speedMs);
      }
    }

    startAutoPlay(speedMs = 1500) {
      this.stopAutoPlay();
      this.speedMs = speedMs;
      this.isPlaying = true;

      if (this.currentIndex >= this.fens.length - 1) {
        this.currentIndex = 0;
        this.notifyChange();
      }

      this.playInterval = setInterval(() => {
        if (this.currentIndex < this.fens.length - 1) {
          this.currentIndex++;
          this.notifyChange();
        } else {
          this.stopAutoPlay();
        }
      }, this.speedMs);

      this.notifyChange();
    }

    stopAutoPlay() {
      if (this.playInterval) {
        clearInterval(this.playInterval);
        this.playInterval = null;
      }
      this.isPlaying = false;
      this.notifyChange();
    }

    getCurrentFen() {
      return this.fens[this.currentIndex] || '';
    }

    /**
     * Compute evaluation material differential for current FEN
     */
    getEvaluation() {
      const fen = this.getCurrentFen();
      if (!fen) return 0;
      const engine = new this.Chess(fen);
      return engine.getMaterialDifference();
    }

    /**
     * Export PGN string
     */
    getPgn() {
      if (!this.match) return '';
      const engine = new this.Chess();
      this.moves.forEach(m => {
        if (m.san) engine.move(m.san);
        else engine.move(m);
      });
      return engine.pgn({
        White: this.match.whitePlayer?.name || 'White',
        Black: this.match.blackPlayer?.name || 'Black',
        Result: this.match.result?.winner === 'w' ? '1-0' : (this.match.result?.winner === 'b' ? '0-1' : '1/2-1/2')
      });
    }
  }

  return ChessReplay;
}));

