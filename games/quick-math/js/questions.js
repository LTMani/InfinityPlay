/**
 * Quick Math: Infinity Challenge - Mathematical Question Engine
 * Supports 100 Playable Levels across 10 Worlds, including Arithmetic, BODMAS,
 * Logic Math (Missing Numbers), Number Sequences/Patterns, and Seeded Daily Challenges.
 * Guarantees integer division results, plausible distractors, and strictly 4 unique options.
 */

(function() {
  'use strict';

  // Seeded Linear Congruential Generator for deterministic runs (Daily Challenge & tests)
  class SeededRNG {
    constructor(seed) {
      this.m = 0x80000000;
      this.a = 1103515245;
      this.c = 12345;
      this.state = seed ? this._hashString(seed) : Math.floor(Math.random() * (this.m - 1));
    }

    _hashString(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    }

    next() {
      this.state = (this.a * this.state + this.c) % this.m;
      return this.state / (this.m - 1);
    }

    randInt(min, max) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    }
  }

  function getRandomInt(min, max, rng = null) {
    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }
    if (rng) return rng.randInt(min, max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(array, rng = null) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = rng ? rng.randInt(0, i) : Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Generates 3 unique, plausible distractors for a correct answer
   */
  function generateOptions(correctAnswer, operation, difficulty, rng = null) {
    const options = new Set([correctAnswer]);
    const maxAttempts = 40;
    let attempts = 0;

    // Common plausible delta offsets
    const baseDeltas = [-2, -1, 1, 2, -10, 10, -5, 5, -3, 3, -4, 4];
    shuffle(baseDeltas, rng);

    for (let delta of baseDeltas) {
      if (options.size >= 4) break;
      const candidate = correctAnswer + delta;
      if (candidate >= 0 && candidate !== correctAnswer) {
        options.add(candidate);
      }
    }

    // If still need more, generate nearby numbers within proportional radius
    while (options.size < 4 && attempts < maxAttempts) {
      attempts++;
      const range = Math.max(6, Math.round(Math.abs(correctAnswer) * 0.25));
      const delta = getRandomInt(-range, range, rng);
      const candidate = correctAnswer + delta;
      if (candidate >= 0 && candidate !== correctAnswer) {
        options.add(candidate);
      }
    }

    // Fallback: guaranteed 4 distinct options
    let fallbackOffset = 1;
    while (options.size < 4) {
      if (correctAnswer - fallbackOffset >= 0 && !options.has(correctAnswer - fallbackOffset)) {
        options.add(correctAnswer - fallbackOffset);
      } else if (!options.has(correctAnswer + fallbackOffset)) {
        options.add(correctAnswer + fallbackOffset);
      }
      fallbackOffset++;
    }

    return shuffle(Array.from(options), rng);
  }

  const QuestionEngine = {
    getLevelConfig(level) {
      if (window.QuickMath?.LevelsEngine) {
        return window.QuickMath.LevelsEngine.getLevelConfig(level);
      }
      return {
        id: level,
        world: Math.ceil(level / 10),
        difficulty: Math.min(10, Math.ceil(level / 10)),
        timeLimit: Math.max(4, 11 - Math.floor(level * 0.08)),
        operations: ['addition'],
        minNumber: 1,
        maxNumber: 10 + level * 2
      };
    },

    getAllLevelConfigs() {
      if (window.QuickMath?.LevelsEngine) {
        return window.QuickMath.LevelsEngine.getAllLevels();
      }
      return [];
    },

    /**
     * Generates a single question based on level ID (1-100+) or custom level configuration
     */
    generateQuestion(levelOrConfig = 1, rng = null) {
      let cfg = typeof levelOrConfig === 'object' && levelOrConfig !== null
        ? levelOrConfig
        : this.getLevelConfig(levelOrConfig);

      const operations = cfg.operations && cfg.operations.length > 0
        ? cfg.operations
        : ['addition'];

      const op = operations[getRandomInt(0, operations.length - 1, rng)];
      const min = cfg.minNumber || 1;
      const max = cfg.maxNumber || 15;

      let questionStr = '';
      let answer = 0;
      let opType = op;

      switch (op) {
        /* ------------------------------------------------------------------ */
        /* 1. ADDITION                                                        */
        /* ------------------------------------------------------------------ */
        case 'addition': {
          const a = getRandomInt(min, max, rng);
          const b = getRandomInt(min, max, rng);
          answer = a + b;
          questionStr = `${a} + ${b}`;
          break;
        }

        /* ------------------------------------------------------------------ */
        /* 2. SUBTRACTION                                                     */
        /* ------------------------------------------------------------------ */
        case 'subtraction': {
          const b = getRandomInt(min, max, rng);
          const ans = getRandomInt(Math.max(1, Math.floor(min * 0.5)), max, rng);
          const a = ans + b;
          answer = ans;
          questionStr = `${a} − ${b}`;
          break;
        }

        /* ------------------------------------------------------------------ */
        /* 3. MULTIPLICATION                                                  */
        /* ------------------------------------------------------------------ */
        case 'multiplication': {
          const maxFactor = Math.min(15, Math.max(9, Math.floor(max * 0.6)));
          const a = getRandomInt(Math.max(2, min), maxFactor, rng);
          const b = getRandomInt(2, Math.min(12, maxFactor), rng);
          answer = a * b;
          questionStr = `${a} × ${b}`;
          break;
        }

        /* ------------------------------------------------------------------ */
        /* 4. DIVISION (Guaranteed Clean Integer Result)                      */
        /* ------------------------------------------------------------------ */
        case 'division': {
          const divisor = getRandomInt(2, Math.min(12, Math.max(3, Math.floor(max * 0.4))), rng);
          const quotient = getRandomInt(Math.max(2, min), Math.max(3, Math.floor(max * 0.8)), rng);
          const dividend = divisor * quotient;
          answer = quotient;
          questionStr = `${dividend} ÷ ${divisor}`;
          break;
        }

        /* ------------------------------------------------------------------ */
        /* 5. MIXED 3-TERM CALCULATIONS                                       */
        /* ------------------------------------------------------------------ */
        case 'mixed': {
          const mixType = getRandomInt(0, 2, rng);
          if (mixType === 0) {
            const a = getRandomInt(min, max, rng);
            const b = getRandomInt(min, max, rng);
            const c = getRandomInt(1, Math.min(a + b - 1, max), rng);
            answer = a + b - c;
            questionStr = `${a} + ${b} − ${c}`;
          } else if (mixType === 1) {
            const a = getRandomInt(2, 9, rng);
            const b = getRandomInt(2, 8, rng);
            const c = getRandomInt(min, max, rng);
            answer = (a * b) + c;
            questionStr = `${a} × ${b} + ${c}`;
          } else {
            const a = getRandomInt(2, 9, rng);
            const b = getRandomInt(2, 8, rng);
            const prod = a * b;
            const c = getRandomInt(1, prod - 1, rng);
            answer = prod - c;
            questionStr = `${a} × ${b} − ${c}`;
          }
          break;
        }

        /* ------------------------------------------------------------------ */
        /* 6. BODMAS & PARENTHESES                                            */
        /* ------------------------------------------------------------------ */
        case 'bodmas':
        case 'parentheses': {
          const type = getRandomInt(0, 2, rng);
          if (type === 0) {
            // A + (B × C)
            const a = getRandomInt(min, max, rng);
            const b = getRandomInt(2, 7, rng);
            const c = getRandomInt(2, 8, rng);
            answer = a + (b * c);
            questionStr = `${a} + ${b} × ${c}`;
          } else if (type === 1) {
            // (A ÷ B) + C
            const divisor = getRandomInt(2, 8, rng);
            const quotient = getRandomInt(2, 10, rng);
            const dividend = divisor * quotient;
            const c = getRandomInt(min, max, rng);
            answer = quotient + c;
            questionStr = `(${dividend} ÷ ${divisor}) + ${c}`;
          } else {
            // (A - B) × C
            const b = getRandomInt(2, 10, rng);
            const diff = getRandomInt(2, 9, rng);
            const a = b + diff;
            const c = getRandomInt(2, 6, rng);
            answer = diff * c;
            questionStr = `(${a} − ${b}) × ${c}`;
          }
          break;
        }

        /* ------------------------------------------------------------------ */
        /* 7. LOGIC MATH: MISSING NUMBERS                                     */
        /* ------------------------------------------------------------------ */
        case 'missing_number': {
          const variant = getRandomInt(0, 3, rng);
          if (variant === 0) {
            // A + ? = C
            const a = getRandomInt(min, max, rng);
            const missing = getRandomInt(min, max, rng);
            const sum = a + missing;
            answer = missing;
            questionStr = getRandomInt(0, 1, rng) === 0 ? `${a} + ? = ${sum}` : `? + ${a} = ${sum}`;
          } else if (variant === 1) {
            // A - ? = C or ? - B = C
            const b = getRandomInt(min, max, rng);
            const c = getRandomInt(min, max, rng);
            const a = b + c;
            if (getRandomInt(0, 1, rng) === 0) {
              answer = b;
              questionStr = `${a} − ? = ${c}`;
            } else {
              answer = a;
              questionStr = `? − ${b} = ${c}`;
            }
          } else if (variant === 2) {
            // A × ? = C
            const a = getRandomInt(2, 12, rng);
            const missing = getRandomInt(2, 12, rng);
            const prod = a * missing;
            answer = missing;
            questionStr = getRandomInt(0, 1, rng) === 0 ? `${a} × ? = ${prod}` : `? × ${a} = ${prod}`;
          } else {
            // A ÷ ? = C or ? ÷ B = C
            const divisor = getRandomInt(2, 9, rng);
            const quotient = getRandomInt(2, 12, rng);
            const dividend = divisor * quotient;
            if (getRandomInt(0, 1, rng) === 0) {
              answer = divisor;
              questionStr = `${dividend} ÷ ? = ${quotient}`;
            } else {
              answer = dividend;
              questionStr = `? ÷ ${divisor} = ${quotient}`;
            }
          }
          break;
        }

        /* ------------------------------------------------------------------ */
        /* 8. NUMBER PATTERNS & SEQUENCES                                     */
        /* ------------------------------------------------------------------ */
        case 'pattern': {
          const patType = getRandomInt(0, 3, rng);
          if (patType === 0) {
            // Arithmetic step (+step): e.g. 15, 20, 25, ?, 35
            const start = getRandomInt(2, 20, rng);
            const step = getRandomInt(2, 8, rng);
            const seq = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
            // Replace index 3 with '?'
            answer = seq[3];
            questionStr = `${seq[0]}, ${seq[1]}, ${seq[2]}, ?, ${seq[4]}`;
          } else if (patType === 1) {
            // Decreasing step (-step): e.g. 50, 42, 34, ?, 18
            const step = getRandomInt(3, 7, rng);
            const end = getRandomInt(5, 20, rng);
            const seq = [end + 4 * step, end + 3 * step, end + 2 * step, end + step, end];
            answer = seq[3];
            questionStr = `${seq[0]}, ${seq[1]}, ${seq[2]}, ?, ${seq[4]}`;
          } else if (patType === 2) {
            // Geometric / doubling step (×2 or ×3): e.g. 2, 4, 8, ?, 32
            const start = getRandomInt(1, 4, rng);
            const mult = getRandomInt(2, 3, rng);
            const seq = [start, start * mult, start * mult * mult, start * Math.pow(mult, 3), start * Math.pow(mult, 4)];
            answer = seq[3];
            questionStr = `${seq[0]}, ${seq[1]}, ${seq[2]}, ?, ${seq[4]}`;
          } else {
            // Squares pattern: 1, 4, 9, ?, 25
            const offset = getRandomInt(1, 4, rng);
            const seq = [
              Math.pow(offset, 2),
              Math.pow(offset + 1, 2),
              Math.pow(offset + 2, 2),
              Math.pow(offset + 3, 2),
              Math.pow(offset + 4, 2)
            ];
            answer = seq[3];
            questionStr = `${seq[0]}, ${seq[1]}, ${seq[2]}, ?, ${seq[4]}`;
          }
          break;
        }

        /* ------------------------------------------------------------------ */
        /* 9. LOGIC COMPARISONS & EQUATION BALANCING                          */
        /* ------------------------------------------------------------------ */
        case 'logic': {
          // e.g. 12 + 15 = 20 + ? -> answer = 7
          const a = getRandomInt(min, max, rng);
          const b = getRandomInt(min, max, rng);
          const total = a + b;
          const c = getRandomInt(1, total - 1, rng);
          answer = total - c;
          questionStr = `${a} + ${b} = ${c} + ?`;
          break;
        }

        /* ------------------------------------------------------------------ */
        /* 10. ADVANCED MENTAL MATH & COMPOUND OPERANDS                       */
        /* ------------------------------------------------------------------ */
        case 'advanced':
        default: {
          const coin = getRandomInt(0, 1, rng);
          if (coin === 0) {
            const div = getRandomInt(3, 8, rng);
            const quot = getRandomInt(4, 12, rng);
            const num = div * quot;
            const b = getRandomInt(15, 60, rng);
            answer = quot + b;
            questionStr = `(${num} ÷ ${div}) + ${b}`;
          } else {
            const a = getRandomInt(12, 25, rng);
            const b = getRandomInt(3, 7, rng);
            const c = getRandomInt(10, 40, rng);
            answer = (a * b) - c;
            questionStr = `${a} × ${b} − ${c}`;
          }
          break;
        }
      }

      // Generate 4 strictly unique options
      const options = generateOptions(answer, opType, cfg.difficulty || 1, rng);

      return {
        question: questionStr.includes('?') ? questionStr : `${questionStr} = ?`,
        rawEquation: questionStr,
        correctAnswer: answer,
        options,
        difficulty: cfg.difficulty || 1,
        operation: opType,
        timeLimit: cfg.timeLimit || 10
      };
    },

    /**
     * Generates a 10-question Daily Challenge round deterministically from date string (YYYY-MM-DD)
     */
    generateDailyChallenge(dateStr = null) {
      const today = dateStr || new Date().toISOString().split('T')[0];
      const rng = new SeededRNG(today);
      const questions = [];

      // 10 Progressive milestone tiers across the 10 worlds
      const sampleLevels = [1, 12, 22, 33, 45, 55, 65, 75, 85, 95];
      for (let lvl of sampleLevels) {
        questions.push(this.generateQuestion(lvl, rng));
      }

      return {
        date: today,
        questions
      };
    }
  };

  window.QuickMath = window.QuickMath || {};
  window.QuickMath.QuestionEngine = QuestionEngine;
})();
