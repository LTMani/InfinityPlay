/**
 * Quick Math: Infinity Challenge - Scoring & Multiplier Engine
 * Computes base scores, speed bonuses, streak multipliers, accuracy,
 * 1-3 star ratings, and Level XP/Credit reward economics.
 */

(function() {
  'use strict';

  const Scoring = {
    BASE_POINTS: 100,

    /**
     * Calculates score details for a correct answer
     * @param {number} timeRemaining - seconds remaining
     * @param {number} timeLimit - total question time limit in seconds
     * @param {number} currentStreak - current consecutive correct count
     */
    calculateScore(timeRemaining, timeLimit, currentStreak) {
      const timeElapsed = Math.max(0, timeLimit - timeRemaining);
      let speedBonus = 0;
      let speedTier = 'NORMAL';

      // Very fast: within first 25% of time limit or under 1.5s
      if (timeElapsed <= 1.2 || timeRemaining >= timeLimit * 0.75) {
        speedBonus = 100;
        speedTier = 'LIGHTNING';
      } else if (timeElapsed <= 2.8 || timeRemaining >= timeLimit * 0.45) {
        speedBonus = 50;
        speedTier = 'FAST';
      }

      // Streak multiplier mapping
      let multiplier = 1.0;
      if (currentStreak >= 5) multiplier = 3.0;
      else if (currentStreak === 4) multiplier = 2.0;
      else if (currentStreak === 3) multiplier = 1.5;
      else if (currentStreak === 2) multiplier = 1.2;

      const subtotal = this.BASE_POINTS + speedBonus;
      const totalEarned = Math.round(subtotal * multiplier);

      return {
        base: this.BASE_POINTS,
        speedBonus,
        speedTier,
        multiplier,
        totalEarned,
        timeElapsed: parseFloat(timeElapsed.toFixed(2))
      };
    },

    /**
     * Computes accuracy percentage safely (never NaN)
     */
    calculateAccuracy(correct, total) {
      if (!total || total <= 0) return 0;
      return Math.min(100, Math.max(0, Math.round((correct / total) * 100)));
    },

    /**
     * Evaluates 1-3 star rating for Classic & Level mode rounds
     */
    evaluateStars(score, accuracy, totalQuestions = 10, isSpecialFail = false) {
      if (isSpecialFail) return 0;

      // Dynamic thresholds scaled by number of questions in round
      const qFactor = totalQuestions / 10;
      const threeStarScore = Math.round(1600 * qFactor);
      const twoStarScore = Math.round(1000 * qFactor);

      // 3 Stars: High score and >= 90% accuracy
      if (score >= threeStarScore && accuracy >= 90) return 3;
      // 2 Stars: >= 70% accuracy and respectable score
      if (score >= twoStarScore && accuracy >= 70) return 2;
      // 1 Star: Minimum completion with >= 50% accuracy
      if (accuracy >= 50) return 1;

      return 0;
    },

    /**
     * Calculates XP and Credits economy rewards for a completed level
     */
    calculateRewards(levelConfig, stars, accuracy) {
      if (stars <= 0) return { xp: 0, credits: 0, isPerfect: false };

      const baseXP = levelConfig?.rewards?.xp || 150;
      const baseCredits = levelConfig?.rewards?.credits || 50;

      let starMultiplier = 0.6;
      if (stars === 2) starMultiplier = 0.85;
      if (stars === 3) starMultiplier = 1.0;

      const isPerfect = accuracy === 100;
      const perfectBonusMultiplier = isPerfect ? 1.5 : 1.0;

      const finalXP = Math.round(baseXP * starMultiplier * perfectBonusMultiplier);
      const finalCredits = Math.round(baseCredits * starMultiplier * perfectBonusMultiplier);

      return {
        xp: finalXP,
        credits: finalCredits,
        isPerfect
      };
    }
  };

  window.QuickMath = window.QuickMath || {};
  window.QuickMath.Scoring = Scoring;
})();
