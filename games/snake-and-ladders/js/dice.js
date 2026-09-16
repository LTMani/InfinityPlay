/**
 * Snake & Ladders - 3D Dice Component
 * Generates genuine randomized rolls (1-6) with smooth 3D CSS tumbling animations and audio.
 */

(function() {
  'use strict';

  // Rotation angles [X, Y] corresponding to standard dice faces 1 to 6
  const DICE_FACE_TRANSFORMS = {
    1: 'rotateX(0deg) rotateY(0deg)',
    2: 'rotateX(-90deg) rotateY(0deg)',
    3: 'rotateX(0deg) rotateY(-90deg)',
    4: 'rotateX(0deg) rotateY(90deg)',
    5: 'rotateX(90deg) rotateY(0deg)',
    6: 'rotateX(180deg) rotateY(0deg)'
  };

  class DiceController {
    constructor() {
      this.diceEl = null;
      this.rollBtn = null;
      this.valueDisplayEl = null;
      this.isRolling = false;
      this.currentValue = 1;
      this.onRollComplete = null;
    }

    init(diceSelector = '#cubeDice', btnSelector = '#btnRollDice', displaySelector = '#diceValueDisplay') {
      this.diceEl = document.querySelector(diceSelector);
      this.rollBtn = document.querySelector(btnSelector);
      this.valueDisplayEl = document.querySelector(displaySelector);

      if (this.diceEl) {
        this.setFace(1);
      }

      if (this.rollBtn) {
        this.rollBtn.addEventListener('click', async () => {
          if (!this.isRolling && !this.rollBtn.disabled) {
            const finalVal = await this.roll();
            if (window.SNGame && !window.SNGame.isGameOver && !window.SNGame.isMoving) {
              const currentP = window.SNGame.getCurrentPlayer();
              if (currentP && !currentP.isAI) {
                window.SNGame.handleRoll(finalVal);
              }
            }
          }
        });
      }
    }

    /**
     * Executes a physical animated roll, resolving with a random value from 1 to 6.
     */
    roll() {
      if (this.isRolling) return Promise.resolve(this.currentValue);
      this.isRolling = true;
      this.setDisabled(true);

      // Play sound
      if (window.SNAudio) {
        window.SNAudio.playDiceRoll();
      }

      // Generate fair cryptographic / Math.random value 1-6
      const finalValue = Math.floor(Math.random() * 6) + 1;
      this.currentValue = finalValue;

      return new Promise((resolve) => {
        if (!this.diceEl) {
          this.isRolling = false;
          resolve(finalValue);
          return;
        }

        // Add wild 3D tumble spins
        const extraSpinsX = (Math.floor(Math.random() * 3) + 2) * 360;
        const extraSpinsY = (Math.floor(Math.random() * 3) + 2) * 360;

        // Base face angle
        let baseTransform = DICE_FACE_TRANSFORMS[finalValue];

        this.diceEl.classList.add('rolling');
        this.diceEl.style.transition = 'transform 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.2)';
        this.diceEl.style.transform = `rotateX(${extraSpinsX}deg) rotateY(${extraSpinsY}deg) ${baseTransform}`;

        if (this.valueDisplayEl) {
          this.valueDisplayEl.textContent = '...';
          this.valueDisplayEl.classList.add('rolling-pulse');
        }

        setTimeout(() => {
          this.diceEl.classList.remove('rolling');
          this.diceEl.style.transition = 'none';
          this.diceEl.style.transform = baseTransform;

          if (this.valueDisplayEl) {
            this.valueDisplayEl.textContent = finalValue;
            this.valueDisplayEl.classList.remove('rolling-pulse');
          }

          if (window.SNAudio) {
            window.SNAudio.playDiceSettle();
          }

          this.isRolling = false;

          // Record in stats
          if (window.SNStorage) {
            window.SNStorage.recordRoll(finalValue);
          }

          if (typeof this.onRollComplete === 'function') {
            this.onRollComplete(finalValue);
          }

          resolve(finalValue);
        }, 720);
      });
    }

    setFace(value) {
      if (value < 1 || value > 6) value = 1;
      this.currentValue = value;
      if (this.diceEl) {
        this.diceEl.style.transition = 'none';
        this.diceEl.style.transform = DICE_FACE_TRANSFORMS[value];
      }
      if (this.valueDisplayEl) {
        this.valueDisplayEl.textContent = value;
      }
    }

    setDisabled(disabled) {
      if (this.rollBtn) {
        this.rollBtn.disabled = !!disabled;
        this.rollBtn.setAttribute('aria-disabled', !!disabled);
        if (disabled) {
          this.rollBtn.classList.add('btn-disabled');
        } else {
          this.rollBtn.classList.remove('btn-disabled');
        }
      }
    }
  }

  window.SNDice = new DiceController();
})();
