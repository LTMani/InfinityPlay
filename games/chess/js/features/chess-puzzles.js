/**
 * InfinityPlay - Daily Chess Challenges & Tactical Puzzles
 * Provides curated masterclass tactical puzzles (Forks, Pins, Smothered Mates,
 * Back Rank Mates, Discovered Checks) with interactive verification, hints, and XP awards.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ChessPuzzles = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {

  const PUZZLE_BANK = [
    {
      id: 'puzzle_1',
      title: 'The Royal Knight Fork',
      theme: 'Tactics • Fork',
      difficulty: 'Easy',
      rating: 1100,
      xp: 150,
      fen: 'r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 6',
      playerColor: 'w',
      description: 'Find the devastating knight fork that regains material with advantage.',
      hint: 'Look for an undefended black piece on e4 that can be captured with tempo.',
      solution: [
        { move: 'Nxe4', reply: 'd5' },
        { move: 'Bd3', reply: null }
      ]
    },
    {
      id: 'puzzle_2',
      title: 'Back Rank Annihilation',
      theme: 'Checkmate • Back Rank',
      difficulty: 'Medium',
      rating: 1400,
      xp: 200,
      fen: '3r2k1/p4ppp/1p6/8/8/8/PP3PPP/4R1K1 b - - 0 1',
      playerColor: 'b',
      description: 'Black to move. Exploit White\'s vulnerable back rank to deliver checkmate.',
      hint: 'White\'s king has no luft (escape square on the second rank). Push your rook directly to the 1st rank!',
      solution: [
        { move: 'Rd1', reply: 'Rxd1' },
        { move: 'Rxd1', reply: null } // mate
      ]
    },
    {
      id: 'puzzle_3',
      title: 'Smothered Mate Legacy',
      theme: 'Masterclass • Smothered Mate',
      difficulty: 'Expert',
      rating: 1850,
      xp: 350,
      fen: '6k1/5ppp/8/8/8/8/1Q4PP/5NNK w - - 0 1',
      playerColor: 'w',
      description: 'White to move and deliver a classic textbook checkmate in 1 move.',
      hint: 'The Black king has no legal moves. Deliver checkmate with the Queen on b8!',
      solution: [
        { move: 'Qb8', reply: null }
      ]
    },
    {
      id: 'puzzle_4',
      title: 'The Greek Gift Strike',
      theme: 'Attack • Bishop Sacrifice',
      difficulty: 'Hard',
      rating: 1650,
      xp: 250,
      fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 7',
      playerColor: 'w',
      description: 'White to move. Pin Black\'s knight on f6 to disrupt their defensive structure.',
      hint: 'Pin the knight to the queen with your dark-squared bishop!',
      solution: [
        { move: 'Bg5', reply: 'h6' },
        { move: 'Bh4', reply: null }
      ]
    },
    {
      id: 'puzzle_5',
      title: 'Discovered Double Attack',
      theme: 'Tactics • Discovered Attack',
      difficulty: 'Medium',
      rating: 1350,
      xp: 200,
      fen: 'r1bqk2r/pp2bppp/2n1pn2/3p4/3P4/2PB1N2/PP3PPP/RNBQ1RK1 w kq - 0 8',
      playerColor: 'w',
      description: 'White to move. Seize dynamic central initiative and open lines.',
      hint: 'Break open the center with a pawn strike!',
      solution: [
        { move: 'Re1', reply: 'O-O' },
        { move: 'e4', reply: null }
      ]
    }
  ];

  class ChessPuzzles {
    constructor() {
      this.puzzles = PUZZLE_BANK;
      this.currentPuzzleIndex = 0;
      this.currentStep = 0;
      this.solvedPuzzles = new Set();

      try {
        const saved = localStorage.getItem('infinityplay_solved_puzzles');
        if (saved) {
          this.solvedPuzzles = new Set(JSON.parse(saved));
        }
      } catch (e) {}
    }

    /**
     * Get Daily Puzzle based on calendar day
     */
    getDailyPuzzle() {
      const today = new Date();
      const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
      const index = dayOfYear % this.puzzles.length;
      this.currentPuzzleIndex = index;
      this.currentStep = 0;
      return this.puzzles[index];
    }

    getPuzzleById(id) {
      const p = this.puzzles.find(x => x.id === id) || this.puzzles[0];
      this.currentStep = 0;
      return p;
    }

    /**
     * Verify user move against current puzzle step
     * Returns: { correct: true/false, nextMove: 'replyMove' or null, finished: true/false }
     */
    checkMove(puzzle, sanMove, uciMove = '') {
      const step = puzzle.solution[this.currentStep];
      if (!step) return { correct: false };

      const expected = step.move;
      const isCorrect = sanMove.includes(expected) || expected.includes(sanMove) || (uciMove && uciMove.includes(expected));

      if (isCorrect) {
        this.currentStep++;

        if (this.currentStep >= puzzle.solution.length || !step.reply) {
          // Completed puzzle!
          this.markPuzzleSolved(puzzle.id);
          return {
            correct: true,
            finished: true,
            reply: null,
            xp: puzzle.xp
          };
        }

        // Return opponent's forced reply
        return {
          correct: true,
          finished: false,
          reply: step.reply
        };
      }

      return {
        correct: false,
        finished: false
      };
    }

    markPuzzleSolved(puzzleId) {
      this.solvedPuzzles.add(puzzleId);
      try {
        localStorage.setItem('infinityplay_solved_puzzles', JSON.stringify(Array.from(this.solvedPuzzles)));
      } catch (e) {}

      // Add platform XP
      try {
        const u = localStorage.getItem('infinityplay_current_user');
        if (u) {
          const user = JSON.parse(u);
          user.xp = (user.xp || 0) + 150;
          localStorage.setItem('infinityplay_current_user', JSON.stringify(user));
        }
      } catch (e) {}
    }

    isSolved(puzzleId) {
      return this.solvedPuzzles.has(puzzleId);
    }
  }

  return ChessPuzzles;
}));

