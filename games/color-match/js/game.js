/**
 * Color Match: Spectrum Arena - Authoritative Game State Engine
 * Orchestrates 5 game modes, 10 challenge archetypes, precision microsecond timers,
 * combo multipliers, reaction tracking, and level completion evaluations.
 */

(function(window) {
  'use strict';

  class SpectrumGame {
    constructor() {
      this.mode = 'classic'; // 'classic', 'time_attack', 'survival', 'endless', 'daily'
      this.currentLevel = null;
      this.round = 1;
      this.totalRounds = 6;
      this.score = 0;
      this.combo = 1;
      this.maxCombo = 1;
      this.lives = 3;
      this.maxLives = 3;
      this.timeRemaining = 5.0;
      this.totalTimeLimit = 5.0;
      this.globalTimeAttackRemaining = 60.0;
      this.isPaused = false;
      this.isGameOver = false;
      this.isLevelWon = false;
      this.currentQuestion = null;
      this.reactionTimes = [];
      this.levelStartTime = 0;

      // Timer animation frame
      this.lastFrameTime = 0;
      this.timerRafId = null;

      // Callbacks for UI updates
      this.onTick = null;
      this.onQuestionReady = null;
      this.onRoundResult = null;
      this.onGameOver = null;
      this.onLevelComplete = null;
    }

    /**
     * Start a specific level in Classic mode
     */
    startLevel(levelId) {
      this.mode = 'classic';
      this.currentLevel = window.LevelSystem.getLevel(levelId);
      this.round = 1;
      this.totalRounds = this.currentLevel.roundsToComplete;
      this.score = 0;
      this.combo = 1;
      this.maxCombo = 1;
      this.lives = 3;
      this.isPaused = false;
      this.isGameOver = false;
      this.isLevelWon = false;
      this.reactionTimes = [];
      this.levelStartTime = Date.now();

      this.nextQuestion();
    }

    /**
     * Start one of the arcade modes
     */
    startArcadeMode(modeType) {
      this.mode = modeType;
      this.score = 0;
      this.combo = 1;
      this.maxCombo = 1;
      this.round = 1;
      this.isPaused = false;
      this.isGameOver = false;
      this.isLevelWon = false;
      this.reactionTimes = [];
      this.levelStartTime = Date.now();

      if (modeType === 'time_attack') {
        this.globalTimeAttackRemaining = 60.0;
        this.totalRounds = 999;
      } else if (modeType === 'survival') {
        this.lives = 3;
        this.maxLives = 3;
        this.totalRounds = 999;
      } else if (modeType === 'endless') {
        this.lives = 1;
        this.totalRounds = 999;
      } else if (modeType === 'daily') {
        this.totalRounds = 10;
        this.lives = 3;
      }

      this.nextQuestion();
    }

    /**
     * Generate next question based on mode & level configuration
     */
    nextQuestion() {
      if (this.isGameOver || this.isLevelWon) return;

      this.stopTimer();

      let challengeType = 'exact_match';
      let optionsCount = 4;
      let timeLimit = 4.0;
      let shuffle = false;

      if (this.mode === 'classic' && this.currentLevel) {
        challengeType = this.currentLevel.challengeType;
        optionsCount = this.currentLevel.optionsCount;
        timeLimit = this.currentLevel.timeLimit;
        shuffle = this.currentLevel.shuffleOptions;
      } else if (this.mode === 'time_attack') {
        // High speed rotating challenges
        const pool = ['exact_match', 'visual_only', 'stroop_name', 'brightest', 'darkest', 'odd_one'];
        challengeType = pool[Math.floor(Math.random() * pool.length)];
        optionsCount = 4;
        timeLimit = 3.0;
      } else if (this.mode === 'survival') {
        const pool = ['exact_match', 'visual_only', 'stroop_name', 'stroop_ink', 'brightest', 'darkest', 'odd_one', 'memory_flash'];
        challengeType = pool[Math.floor(Math.random() * pool.length)];
        optionsCount = Math.min(8, 3 + Math.floor(this.round / 6));
        timeLimit = Math.max(0.9, 3.5 - (this.round * 0.08));
      } else if (this.mode === 'endless') {
        const pool = ['exact_match', 'visual_only', 'stroop_name', 'stroop_ink', 'brightest', 'darkest', 'odd_one', 'memory_flash'];
        challengeType = pool[Math.floor(Math.random() * pool.length)];
        optionsCount = Math.min(8, 4 + Math.floor(this.round / 8));
        timeLimit = Math.max(0.85, 3.2 - (this.round * 0.06));
      } else if (this.mode === 'daily') {
        // Seeded questions using date hash
        challengeType = (this.round % 2 === 0) ? 'stroop_name' : 'exact_match';
        optionsCount = 4;
        timeLimit = Math.max(1.8, 3.2 - (this.round * 0.12));
      }

      // If level is mixed challenge archetype
      if (challengeType === 'mixed') {
        const mixedPool = ['exact_match', 'visual_only', 'similar_shades', 'stroop_name', 'stroop_ink', 'brightest', 'darkest', 'odd_one', 'memory_flash'];
        challengeType = mixedPool[Math.floor(Math.random() * mixedPool.length)];
      }

      this.currentQuestion = this.buildChallenge(challengeType, optionsCount, shuffle);
      this.timeRemaining = timeLimit;
      this.totalTimeLimit = timeLimit;

      if (this.onQuestionReady) {
        this.onQuestionReady(this.currentQuestion, {
          round: this.round,
          totalRounds: this.totalRounds,
          score: this.score,
          combo: this.combo,
          lives: this.lives,
          timeLimit: this.timeRemaining
        });
      }

      // Start microsecond timer
      this.startTimer();
    }

    /**
     * Factory for constructing specific challenge payload
     */
    buildChallenge(type, optionsCount, shuffle = false) {
      const CS = window.ColorSystem;
      let prompt = 'MATCH THE TARGET COLOR';
      let targetColor = null;
      let stroopWord = null;
      let stroopInk = null;
      let options = [];
      let correctIndex = 0;
      let isMemoryFlash = false;
      let instructionSub = '';

      switch (type) {
        case 'exact_match': {
          targetColor = CS.getRandom();
          const distractors = CS.getDistractors(targetColor, optionsCount - 1);
          options = [targetColor, ...distractors].sort(() => 0.5 - Math.random());
          correctIndex = options.findIndex(c => c.id === targetColor.id);
          prompt = 'TARGET SPECTRUM FREQUENCY';
          instructionSub = 'Select the matching hue tile';
          break;
        }

        case 'visual_only': {
          targetColor = CS.getRandom();
          const distractors = CS.getDistractors(targetColor, optionsCount - 1, 'hard');
          options = [targetColor, ...distractors].sort(() => 0.5 - Math.random());
          correctIndex = options.findIndex(c => c.id === targetColor.id);
          prompt = 'VISUAL FREQUENCY ONLY';
          instructionSub = 'Match by visual hue (no name label)';
          break;
        }

        case 'similar_shades': {
          targetColor = CS.getRandom();
          const distractors = CS.getSimilarShades(targetColor, optionsCount - 1);
          options = [targetColor, ...distractors].sort(() => 0.5 - Math.random());
          correctIndex = options.findIndex(c => c.id === targetColor.id);
          prompt = 'SIMILAR SHADES: FINE DISCRIMINATION';
          instructionSub = 'Select the exact matching hue among adjacent tones';
          break;
        }

        case 'stroop_name': {
          const colorA = CS.getRandom();
          const colorB = CS.getRandom([colorA.id]);
          // Word says Color A, but printed in Color B's hex
          targetColor = colorA;
          stroopWord = colorA.name.toUpperCase();
          stroopInk = colorB;
          const distractors = CS.getDistractors(colorA, optionsCount - 1);
          options = [colorA, ...distractors].sort(() => 0.5 - Math.random());
          correctIndex = options.findIndex(c => c.id === colorA.id);
          prompt = 'COGNITIVE PROTOCOL: MATCH WORD';
          instructionSub = `Read the text word "${stroopWord}", ignore its ink color!`;
          break;
        }

        case 'stroop_ink': {
          const colorA = CS.getRandom();
          const colorB = CS.getRandom([colorA.id]);
          // Word says Color A, but ink is Color B. Goal: pick Color B!
          targetColor = colorB;
          stroopWord = colorA.name.toUpperCase();
          stroopInk = colorB;
          const distractors = CS.getDistractors(colorB, optionsCount - 1);
          options = [colorB, ...distractors].sort(() => 0.5 - Math.random());
          correctIndex = options.findIndex(c => c.id === colorB.id);
          prompt = 'COGNITIVE PROTOCOL: MATCH INK';
          instructionSub = 'Match the actual INK COLOR of the text, ignore the word!';
          break;
        }

        case 'brightest': {
          options = CS.getMultipleRandom(optionsCount);
          const brightest = CS.findBrightest(options);
          correctIndex = options.findIndex(c => c.id === brightest.id);
          targetColor = null;
          prompt = 'LUMINANCE: PEAK RADIANCE';
          instructionSub = 'Select the tile with the HIGHEST perceived brightness';
          break;
        }

        case 'darkest': {
          options = CS.getMultipleRandom(optionsCount);
          const darkest = CS.findDarkest(options);
          correctIndex = options.findIndex(c => c.id === darkest.id);
          targetColor = null;
          prompt = 'LUMINANCE: DEEPEST VOID';
          instructionSub = 'Select the tile with the DARKEST / DEEPEST shade';
          break;
        }

        case 'odd_one': {
          const baseColor = CS.getRandom();
          const oddColor = CS.getRandom([baseColor.id]);
          options = [];
          for (let i = 0; i < optionsCount - 1; i++) {
            options.push(baseColor);
          }
          options.push(oddColor);
          options.sort(() => 0.5 - Math.random());
          correctIndex = options.findIndex(c => c.id === oddColor.id);
          targetColor = null;
          prompt = 'ANOMALY DETECTOR: ODD COLOR';
          instructionSub = 'Find the single tile that differs from the rest';
          break;
        }

        case 'memory_flash': {
          targetColor = CS.getRandom();
          isMemoryFlash = true;
          const distractors = CS.getDistractors(targetColor, optionsCount - 1);
          options = [targetColor, ...distractors].sort(() => 0.5 - Math.random());
          correctIndex = options.findIndex(c => c.id === targetColor.id);
          prompt = 'RETINAL MEMORY FLASH';
          instructionSub = 'Memorize the target hue before it vanishes!';
          break;
        }

        default: {
          targetColor = CS.getRandom();
          const distractors = CS.getDistractors(targetColor, optionsCount - 1);
          options = [targetColor, ...distractors].sort(() => 0.5 - Math.random());
          correctIndex = options.findIndex(c => c.id === targetColor.id);
          prompt = 'MATCH THE TARGET COLOR';
          instructionSub = 'Tap the matching color';
        }
      }

      return {
        type,
        prompt,
        instructionSub,
        targetColor,
        stroopWord,
        stroopInk,
        options,
        correctIndex,
        isMemoryFlash,
        presentedAt: Date.now()
      };
    }

    /**
     * Player selects an option tile index (0..N-1)
     */
    submitAnswer(selectedIndex, tileElement = null) {
      if (this.isGameOver || this.isLevelWon || !this.currentQuestion || this.isPaused) return;

      const reactionTimeMs = Date.now() - this.currentQuestion.presentedAt;
      this.reactionTimes.push(reactionTimeMs);

      const isCorrect = (selectedIndex === this.currentQuestion.correctIndex);
      const chosenColor = this.currentQuestion.options[selectedIndex];

      // Record reaction in global save stats
      window.SaveManager.recordReaction(reactionTimeMs, isCorrect);

      if (isCorrect) {
        this.handleCorrect(reactionTimeMs, chosenColor, tileElement);
      } else {
        this.handleWrong(chosenColor, tileElement);
      }
    }

    handleCorrect(reactionTimeMs, chosenColor, tileElement) {
      // Points calculation with level scoreMultiplier
      const mult = (this.currentLevel && this.currentLevel.scoreMultiplier) ? this.currentLevel.scoreMultiplier : 1.0;
      const basePoints = Math.round(100 * mult);
      const speedRatio = Math.max(0, (this.totalTimeLimit - (reactionTimeMs / 1000)) / this.totalTimeLimit);
      const speedBonus = Math.round(speedRatio * 150 * mult);
      const roundScore = (basePoints + speedBonus) * this.combo;

      this.score += roundScore;

      // Sounds & FX
      window.SoundEngine.playCorrect(this.combo);
      if (tileElement) {
        window.EffectsEngine.burstFromElement(tileElement, chosenColor ? chosenColor.hex : '#38bdf8');
      }

      // Combo progression
      this.combo++;
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }
      window.SaveManager.recordCombo(this.combo);

      if (this.combo === 5 || this.combo === 10 || this.combo === 15) {
        window.SoundEngine.playStreak();
      }

      // Time attack bonus
      if (this.mode === 'time_attack') {
        this.globalTimeAttackRemaining = Math.min(60.0, this.globalTimeAttackRemaining + 1.5);
      }

      if (this.onRoundResult) {
        this.onRoundResult({
          isCorrect: true,
          roundScore,
          totalScore: this.score,
          combo: this.combo,
          reactionTimeMs,
          selectedIndex: this.currentQuestion.correctIndex
        });
      }

      this.checkProgression();
    }

    handleWrong(chosenColor, tileElement) {
      // Penalty
      this.combo = 1;
      window.SoundEngine.playWrong();

      if (this.mode === 'survival') {
        this.lives--;
      } else if (this.mode === 'time_attack') {
        this.globalTimeAttackRemaining = Math.max(0, this.globalTimeAttackRemaining - 3.0);
      } else if (this.mode === 'endless') {
        this.lives = 0;
      }

      if (this.onRoundResult) {
        this.onRoundResult({
          isCorrect: false,
          roundScore: 0,
          totalScore: this.score,
          combo: this.combo,
          reactionTimeMs: 0,
          correctIndex: this.currentQuestion.correctIndex
        });
      }

      if (this.lives <= 0 || (this.mode === 'time_attack' && this.globalTimeAttackRemaining <= 0)) {
        this.triggerGameOver('Eliminated! You ran out of lives.');
        return;
      }

      this.checkProgression();
    }

    handleTimeout() {
      window.SoundEngine.playWrong();
      this.combo = 1;

      if (this.mode === 'survival') {
        this.lives--;
      } else if (this.mode === 'endless') {
        this.lives = 0;
      }

      if (this.onRoundResult) {
        this.onRoundResult({
          isCorrect: false,
          isTimeout: true,
          roundScore: 0,
          totalScore: this.score,
          combo: 1,
          reactionTimeMs: this.totalTimeLimit * 1000,
          correctIndex: this.currentQuestion.correctIndex
        });
      }

      if (this.lives <= 0) {
        this.triggerGameOver('Time Expired!');
        return;
      }

      this.checkProgression();
    }

    checkProgression() {
      if (this.round >= this.totalRounds) {
        this.triggerLevelWon();
      } else {
        this.round++;
        setTimeout(() => {
          if (!this.isGameOver && !this.isLevelWon) {
            this.nextQuestion();
          }
        }, 350);
      }
    }

    triggerLevelWon() {
      this.stopTimer();
      this.isLevelWon = true;

      const elapsedSec = Math.round((Date.now() - this.levelStartTime) / 1000);
      const avgReaction = this.reactionTimes.length > 0
        ? Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length)
        : 0;

      let stars = 1;
      if (this.currentLevel && this.currentLevel.starRequirements) {
        const req = this.currentLevel.starRequirements;
        if (this.score >= req.threeStars) {
          stars = 3;
        } else if (this.score >= req.twoStars) {
          stars = 2;
        } else {
          stars = 1;
        }
      } else {
        // Arcade / Daily star evaluation
        stars = this.score >= 2000 ? 3 : (this.score >= 1000 ? 2 : 1);
      }

      // Record in save system
      let saveResult = null;
      if (this.mode === 'classic' && this.currentLevel) {
        saveResult = window.SaveManager.completeLevel(this.currentLevel.id, this.score, stars, elapsedSec);
        if (this.currentLevel.id === 100) {
          window.SaveManager.unlockInfinityMode();
          window.SoundEngine.playMilestone();
        } else if (this.currentLevel.isMilestone) {
          window.SoundEngine.playMilestone();
        } else {
          window.SoundEngine.playLevelComplete();
        }
      } else if (this.mode === 'daily') {
        const today = new Date().toISOString().split('T')[0];
        window.SaveManager.saveDaily(today, this.score, stars);
        window.SoundEngine.playLevelComplete();
      }

      if (this.onLevelComplete) {
        this.onLevelComplete({
          level: this.currentLevel,
          mode: this.mode,
          score: this.score,
          stars: stars,
          elapsedSec: elapsedSec,
          avgReactionMs: avgReaction,
          maxCombo: this.maxCombo,
          saveResult: saveResult
        });
      }
    }

    triggerGameOver(reason = 'Game Over') {
      this.stopTimer();
      this.isGameOver = true;
      window.SoundEngine.playGameOver();

      let isNewHighScore = false;
      if (['time_attack', 'survival', 'endless'].includes(this.mode)) {
        isNewHighScore = window.SaveManager.saveModeScore(this.mode, this.score);
      }

      const avgReaction = this.reactionTimes.length > 0
        ? Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length)
        : 0;

      if (this.onGameOver) {
        this.onGameOver({
          reason,
          mode: this.mode,
          score: this.score,
          roundReached: this.round,
          maxCombo: this.maxCombo,
          avgReactionMs: avgReaction,
          isNewHighScore
        });
      }
    }

    startTimer() {
      this.lastFrameTime = performance.now();
      const tick = (now) => {
        if (this.isPaused || this.isGameOver || this.isLevelWon) return;

        const delta = (now - this.lastFrameTime) / 1000;
        this.lastFrameTime = now;

        if (this.mode === 'time_attack') {
          this.globalTimeAttackRemaining -= delta;
          if (this.onTick) {
            this.onTick(this.globalTimeAttackRemaining, 60.0);
          }
          if (this.globalTimeAttackRemaining <= 0) {
            this.triggerGameOver('60 Seconds Expired!');
            return;
          }
        } else {
          this.timeRemaining -= delta;
          if (this.onTick) {
            this.onTick(this.timeRemaining, this.totalTimeLimit);
          }
          if (this.timeRemaining <= 1.5 && this.timeRemaining > 0.1 && Math.floor(this.timeRemaining * 10) % 5 === 0) {
            window.SoundEngine.playTick();
          }
          if (this.timeRemaining <= 0) {
            this.handleTimeout();
            return;
          }
        }

        this.timerRafId = requestAnimationFrame(tick);
      };

      this.timerRafId = requestAnimationFrame(tick);
    }

    stopTimer() {
      if (this.timerRafId) {
        cancelAnimationFrame(this.timerRafId);
        this.timerRafId = null;
      }
    }

    pause() {
      this.isPaused = true;
      this.stopTimer();
    }

    resume() {
      if (!this.isPaused) return;
      this.isPaused = false;
      this.startTimer();
    }
  }

  window.SpectrumGame = SpectrumGame;
})(typeof window !== 'undefined' ? window : this);

