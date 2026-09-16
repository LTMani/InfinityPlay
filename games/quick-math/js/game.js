/**
 * Quick Math: Infinity Challenge - Core Game Engine
 * State machine managing session lifecycles, 100-Level progression,
 * special challenge rules (NO_MISTAKE, TIME_TRIAL, DOUBLE_SPEED, INFINITY_CHAMPIONSHIP),
 * timer loops, anti-cheat locks, and Infinity Mode.
 */

(function() {
  'use strict';

  const STATES = {
    MENU: 'MENU',
    MODE_SELECT: 'MODE_SELECT',
    LEVEL_SELECT: 'LEVEL_SELECT',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    RESULT: 'RESULT'
  };

  const MODES = {
    CLASSIC: 'classic',
    TIME_ATTACK: 'time_attack',
    SURVIVAL: 'survival',
    ENDLESS: 'endless',
    DAILY: 'daily',
    INFINITY: 'infinity'
  };

  class GameManager {
    constructor() {
      this.state = STATES.MENU;
      this.mode = MODES.CLASSIC;
      this.currentLevel = 1;
      this.currentLevelConfig = null;

      // Session metrics
      this.questionIndex = 0;
      this.totalQuestionsInRound = 10;
      this.score = 0;
      this.streak = 0;
      this.maxStreak = 0;
      this.combo = 0;
      this.correctCount = 0;
      this.wrongCount = 0;
      this.timeoutCount = 0;
      this.totalQuestionsAnswered = 0;
      this.lives = 3;
      this.totalAnswerTimes = [];

      // Timing state
      this.timeRemaining = 0;
      this.timeLimit = 10;
      this.timeAttackRemaining = 60.0;
      this.lastTickTime = null;
      this.animFrameId = null;
      this.lastTimestamp = null;
      this.nextQuestionTimeout = null;
      this.isLocked = false;

      // Active Question & Pre-generated pipeline
      this.currentQuestion = null;
      this.questionsList = [];

      // Callbacks for UI
      this.onStateChange = null;
      this.onQuestionLoaded = null;
      this.onTimerUpdate = null;
      this.onQuestionResolved = null;
      this.onRoundComplete = null;
    }

    setState(newState) {
      this.state = newState;
      if (this.onStateChange) this.onStateChange(this.state);
    }

    /**
     * Starts a new game session
     */
    startSession(mode = MODES.CLASSIC, level = 1) {
      this.cleanupTimers();

      this.mode = mode;
      this.currentLevel = Math.max(1, parseInt(level, 10) || 1);
      this.questionIndex = 0;
      this.score = 0;
      this.streak = 0;
      this.maxStreak = 0;
      this.combo = 0;
      this.correctCount = 0;
      this.wrongCount = 0;
      this.timeoutCount = 0;
      this.totalQuestionsAnswered = 0;
      this.lives = 3;
      this.totalAnswerTimes = [];
      this.timeAttackRemaining = 60.0;
      this.isLocked = false;

      if (this.mode === MODES.CLASSIC) {
        this.currentLevelConfig = window.QuickMath.LevelsEngine
          ? window.QuickMath.LevelsEngine.getLevelConfig(this.currentLevel)
          : window.QuickMath.QuestionEngine.getLevelConfig(this.currentLevel);

        this.totalQuestionsInRound = this.currentLevelConfig.questionCount || 10;
        this.questionsList = [];
        for (let i = 0; i < this.totalQuestionsInRound; i++) {
          this.questionsList.push(window.QuickMath.QuestionEngine.generateQuestion(this.currentLevelConfig));
        }
      } else if (this.mode === MODES.DAILY) {
        this.totalQuestionsInRound = 10;
        this.currentLevelConfig = null;
        const daily = window.QuickMath.QuestionEngine.generateDailyChallenge();
        this.questionsList = daily.questions;
      } else if (this.mode === MODES.INFINITY) {
        this.totalQuestionsInRound = Infinity;
        this.currentLevelConfig = null;
        this.questionsList = [];
      } else {
        // TIME_ATTACK, SURVIVAL, ENDLESS
        this.totalQuestionsInRound = Infinity;
        this.currentLevelConfig = null;
        this.questionsList = [];
      }

      this.setState(STATES.PLAYING);
      this.loadNextQuestion();
    }

    /**
     * Loads the next question in the pipeline
     */
    loadNextQuestion() {
      this.cleanupTimers();
      this.isLocked = false;

      // Check for round completion in fixed-length modes
      if ((this.mode === MODES.CLASSIC || this.mode === MODES.DAILY) && this.questionIndex >= this.totalQuestionsInRound) {
        this.completeRound(false);
        return;
      }

      this.questionIndex++;

      if ((this.mode === MODES.CLASSIC || this.mode === MODES.DAILY) && this.questionsList.length >= this.questionIndex) {
        this.currentQuestion = this.questionsList[this.questionIndex - 1];
      } else if (this.mode === MODES.INFINITY) {
        // Post-Level 100 Infinity Mode: procedurally escalate across 90-100+
        const dynamicLevel = Math.min(100, 85 + Math.floor(this.correctCount / 4));
        this.currentQuestion = window.QuickMath.QuestionEngine.generateQuestion(dynamicLevel);
      } else {
        // Continuous modes
        let levelToGenerate = this.currentLevel;
        if (this.mode === MODES.ENDLESS) {
          levelToGenerate = Math.min(100, 1 + Math.floor(this.correctCount / 4) * 3);
        } else if (this.mode === MODES.SURVIVAL) {
          levelToGenerate = Math.min(100, 5 + Math.floor(this.correctCount / 3) * 4);
        } else if (this.mode === MODES.TIME_ATTACK) {
          levelToGenerate = Math.min(100, 10 + Math.floor(this.correctCount / 5) * 5);
        }
        this.currentQuestion = window.QuickMath.QuestionEngine.generateQuestion(levelToGenerate);
      }

      this.timeLimit = this.currentQuestion.timeLimit || 10;
      this.timeRemaining = this.timeLimit;
      this.lastTickTime = Math.ceil(this.timeRemaining);
      this.lastTimestamp = performance.now();

      if (this.onQuestionLoaded) {
        this.onQuestionLoaded({
          question: this.currentQuestion,
          questionIndex: this.questionIndex,
          totalQuestions: this.totalQuestionsInRound,
          mode: this.mode,
          lives: this.lives,
          score: this.score,
          streak: this.streak,
          combo: this.combo,
          levelConfig: this.currentLevelConfig
        });
      }

      this.startTimerLoop();
    }

    /**
     * Timer animation frame loop
     */
    startTimerLoop() {
      const step = (now) => {
        if (this.state !== STATES.PLAYING || this.isLocked) return;

        const delta = (now - this.lastTimestamp) / 1000;
        this.lastTimestamp = now;

        if (this.mode === MODES.TIME_ATTACK) {
          this.timeAttackRemaining = Math.max(0, this.timeAttackRemaining - delta);
          if (this.onTimerUpdate) {
            this.onTimerUpdate(this.timeAttackRemaining, 60.0);
          }

          const currentSec = Math.ceil(this.timeAttackRemaining);
          if (currentSec <= 5 && currentSec !== this.lastTickTime) {
            this.lastTickTime = currentSec;
            window.QuickMath.SoundFX?.playTick(currentSec <= 2);
          }

          if (this.timeAttackRemaining <= 0) {
            this.handleTimeAttackExpiry();
            return;
          }
        } else {
          this.timeRemaining = Math.max(0, this.timeRemaining - delta);
          if (this.onTimerUpdate) {
            this.onTimerUpdate(this.timeRemaining, this.timeLimit);
          }

          const currentSec = Math.ceil(this.timeRemaining);
          if (currentSec <= 3 && currentSec > 0 && currentSec !== this.lastTickTime) {
            this.lastTickTime = currentSec;
            window.QuickMath.SoundFX?.playTick(currentSec === 1);
          }

          if (this.timeRemaining <= 0) {
            this.handleQuestionTimeout();
            return;
          }
        }

        this.animFrameId = requestAnimationFrame(step);
      };

      this.animFrameId = requestAnimationFrame(step);
    }

    /**
     * Evaluates player's selected option
     */
    submitAnswer(selectedAnswerIndex) {
      if (this.state !== STATES.PLAYING || this.isLocked || !this.currentQuestion) return;

      this.isLocked = true;
      this.cleanupTimers();

      const chosenValue = this.currentQuestion.options[selectedAnswerIndex];
      const isCorrect = chosenValue === this.currentQuestion.correctAnswer;
      const answerDuration = Math.max(0.1, this.timeLimit - this.timeRemaining);
      this.totalAnswerTimes.push(answerDuration);
      this.totalQuestionsAnswered++;

      let scoreDetails = null;

      if (isCorrect) {
        this.correctCount++;
        this.streak++;
        this.combo++;
        if (this.streak > this.maxStreak) this.maxStreak = this.streak;

        scoreDetails = window.QuickMath.Scoring.calculateScore(
          this.timeRemaining,
          this.timeLimit,
          this.streak
        );

        // Special rule bonus (e.g. Infinity Championship x1.25 bonus)
        if (this.currentLevelConfig?.specialRule === 'INFINITY_CHAMPIONSHIP') {
          scoreDetails.totalEarned = Math.round(scoreDetails.totalEarned * 1.25);
        }

        this.score += scoreDetails.totalEarned;
        window.QuickMath.SoundFX?.playCorrect(scoreDetails.speedBonus);
        window.QuickMath.Effects?.triggerCorrectPulse();

        // Speed demon achievement check
        if (answerDuration <= 1.0) {
          window.QuickMath.SaveManager.unlockAchievement('SPEED_DEMON');
        }
      } else {
        this.wrongCount++;
        this.streak = 0;
        this.combo = 0;
        window.QuickMath.SoundFX?.playWrong();
        window.QuickMath.Effects?.triggerShake();

        if (this.mode === MODES.SURVIVAL) {
          this.lives--;
        }

        // Special challenge rule: NO_MISTAKE triggers instant failure
        if (this.currentLevelConfig?.specialRule === 'NO_MISTAKE') {
          if (this.onQuestionResolved) {
            this.onQuestionResolved({
              isCorrect: false,
              selectedAnswerIndex,
              correctAnswer: this.currentQuestion.correctAnswer,
              correctAnswerIndex: this.currentQuestion.options.indexOf(this.currentQuestion.correctAnswer),
              scoreDetails: null,
              score: this.score,
              streak: 0,
              combo: 0,
              lives: 0,
              specialFailReason: 'NO MISTAKE RULE VIOLATED'
            });
          }

          this.nextQuestionTimeout = setTimeout(() => {
            this.completeRound(true);
          }, 850);
          return;
        }
      }

      if (this.onQuestionResolved) {
        this.onQuestionResolved({
          isCorrect,
          selectedAnswerIndex,
          correctAnswer: this.currentQuestion.correctAnswer,
          correctAnswerIndex: this.currentQuestion.options.indexOf(this.currentQuestion.correctAnswer),
          scoreDetails,
          score: this.score,
          streak: this.streak,
          combo: this.combo,
          lives: this.lives
        });
      }

      // Check Survival game over
      if (this.mode === MODES.SURVIVAL && this.lives <= 0) {
        this.nextQuestionTimeout = setTimeout(() => {
          this.completeRound(true);
        }, 800);
        return;
      }

      // Transition to next question
      this.nextQuestionTimeout = setTimeout(() => {
        this.loadNextQuestion();
      }, 750);
    }

    /**
     * Handles timeout for an individual question
     */
    handleQuestionTimeout() {
      if (this.isLocked) return;
      this.isLocked = true;
      this.cleanupTimers();

      this.timeoutCount++;
      this.wrongCount++;
      this.streak = 0;
      this.combo = 0;
      this.totalQuestionsAnswered++;
      this.totalAnswerTimes.push(this.timeLimit);

      window.QuickMath.SoundFX?.playWrong();
      window.QuickMath.Effects?.triggerTimeoutFlash();

      if (this.mode === MODES.SURVIVAL) {
        this.lives--;
      }

      // Special rule: NO_MISTAKE triggers instant failure on timeout
      if (this.currentLevelConfig?.specialRule === 'NO_MISTAKE') {
        if (this.onQuestionResolved) {
          this.onQuestionResolved({
            isCorrect: false,
            isTimeout: true,
            selectedAnswerIndex: -1,
            correctAnswer: this.currentQuestion.correctAnswer,
            correctAnswerIndex: this.currentQuestion.options.indexOf(this.currentQuestion.correctAnswer),
            scoreDetails: null,
            score: this.score,
            streak: 0,
            combo: 0,
            lives: 0,
            specialFailReason: 'TIMEOUT ON NO-MISTAKE LEVEL'
          });
        }

        this.nextQuestionTimeout = setTimeout(() => {
          this.completeRound(true);
        }, 850);
        return;
      }

      if (this.onQuestionResolved) {
        this.onQuestionResolved({
          isCorrect: false,
          isTimeout: true,
          selectedAnswerIndex: -1,
          correctAnswer: this.currentQuestion.correctAnswer,
          correctAnswerIndex: this.currentQuestion.options.indexOf(this.currentQuestion.correctAnswer),
          scoreDetails: null,
          score: this.score,
          streak: this.streak,
          combo: this.combo,
          lives: this.lives
        });
      }

      if (this.mode === MODES.SURVIVAL && this.lives <= 0) {
        this.nextQuestionTimeout = setTimeout(() => {
          this.completeRound(true);
        }, 800);
        return;
      }

      this.nextQuestionTimeout = setTimeout(() => {
        this.loadNextQuestion();
      }, 850);
    }

    handleTimeAttackExpiry() {
      this.isLocked = true;
      this.cleanupTimers();
      window.QuickMath.SoundFX?.playWrong();
      this.completeRound(false);
    }

    pause() {
      if (this.state !== STATES.PLAYING) return;
      this.cleanupTimers();
      this.setState(STATES.PAUSED);
    }

    resume() {
      if (this.state !== STATES.PAUSED) return;
      this.lastTimestamp = performance.now();
      this.setState(STATES.PLAYING);
      this.startTimerLoop();
    }

    restart() {
      this.cleanupTimers();
      this.startSession(this.mode, this.currentLevel);
    }

    completeRound(isFailed = false) {
      this.cleanupTimers();
      this.isLocked = true;

      const accuracy = window.QuickMath.Scoring.calculateAccuracy(
        this.correctCount,
        this.totalQuestionsAnswered
      );

      const avgTime = this.totalAnswerTimes.length > 0
        ? parseFloat((this.totalAnswerTimes.reduce((a, b) => a + b, 0) / this.totalAnswerTimes.length).toFixed(2))
        : 0;

      let stars = 0;
      let rewards = { xp: 0, credits: 0, isPerfect: false };

      if (this.mode === MODES.CLASSIC && !isFailed) {
        stars = window.QuickMath.Scoring.evaluateStars(
          this.score,
          accuracy,
          this.totalQuestionsInRound,
          isFailed
        );

        rewards = window.QuickMath.Scoring.calculateRewards(
          this.currentLevelConfig,
          stars,
          accuracy
        );

        window.QuickMath.SaveManager.saveLevelResult(
          this.currentLevel,
          this.score,
          stars,
          accuracy,
          avgTime,
          rewards.xp,
          rewards.credits
        );
      }

      window.QuickMath.SaveManager.saveModeHighScore(this.mode, this.score);
      window.QuickMath.SaveManager.recordGameStats({
        total: this.totalQuestionsAnswered,
        correct: this.correctCount,
        wrong: this.wrongCount,
        timedOut: this.timeoutCount,
        bestStreak: this.maxStreak,
        accuracy,
        score: this.score,
        mode: this.mode === MODES.CLASSIC ? `Level ${this.currentLevel}` : this.mode
      });

      window.QuickMath.SaveManager.addLeaderboardEntry({
        score: this.score,
        accuracy,
        mode: this.mode === MODES.CLASSIC ? `World ${Math.ceil(this.currentLevel / 10)} L${this.currentLevel}` : this.mode
      });

      const isPerfect = accuracy === 100 && this.totalQuestionsAnswered >= 5 && !isFailed;
      const isLevel100Clear = this.currentLevel === 100 && stars >= 1 && !isFailed;

      if (isPerfect) {
        window.QuickMath.Effects?.triggerPerfectCelebration();
      } else if (stars === 3 || (!isFailed && this.score > 2500)) {
        window.QuickMath.SoundFX?.playFanfare();
        window.QuickMath.Effects?.burstVictory();
      }

      if (isLevel100Clear) {
        window.QuickMath.Effects?.triggerChampionshipVictory();
      }

      this.setState(STATES.RESULT);

      if (this.onRoundComplete) {
        this.onRoundComplete({
          mode: this.mode,
          level: this.currentLevel,
          levelConfig: this.currentLevelConfig,
          score: this.score,
          correct: this.correctCount,
          wrong: this.wrongCount,
          timedOut: this.timeoutCount,
          total: this.totalQuestionsAnswered,
          accuracy,
          bestStreak: this.maxStreak,
          avgTime,
          stars,
          rewards,
          isPerfect,
          isLevel100Clear,
          isFailed
        });
      }
    }

    cleanupTimers() {
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      if (this.nextQuestionTimeout) {
        clearTimeout(this.nextQuestionTimeout);
        this.nextQuestionTimeout = null;
      }
    }
  }

  window.QuickMath = window.QuickMath || {};
  window.QuickMath.GameManager = GameManager;
  window.QuickMath.STATES = STATES;
  window.QuickMath.MODES = MODES;
})();
