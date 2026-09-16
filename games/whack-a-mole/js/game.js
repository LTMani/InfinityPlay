/**
 * Whack-a-Mole: Arcade Edition - Central Game State Engine
 * Orchestrates 5 game modes, hole occupancy, controlled spawn cycles,
 * hit detection, combo scaling, reaction time tracking, and clean timer teardown.
 */

(function(window) {
  'use strict';

  const GAME_STATES = {
    MENU: 'MENU',
    MODE_SELECT: 'MODE_SELECT',
    LEVEL_SELECT: 'LEVEL_SELECT',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    COMPLETED: 'COMPLETED',
    GAME_OVER: 'GAME_OVER'
  };

  class WhackGame {
    constructor() {
      this.state = GAME_STATES.MENU;
      this.mode = 'classic'; // 'classic', 'time_attack', 'survival', 'endless', 'challenge'
      this.currentLevel = null;
      this.wave = 1;
      this.score = 0;
      this.hits = 0;
      this.misses = 0;
      this.combo = 1;
      this.maxCombo = 1;
      this.lives = 3;
      this.maxLives = 3;
      this.timeRemaining = 30.0;
      this.totalDuration = 30.0;
      this.reactionTimes = [];
      this.startTime = 0;

      // Board state
      this.totalHoles = 9;
      this.holes = []; // Array of hole objects

      // Spawning loop & timers
      this.spawnTimerId = null;
      this.rafTimerId = null;
      this.lastFrameTime = 0;

      this.championshipPhase = 1;

      // UI Callbacks
      this.onMoleSpawn = null;
      this.onMoleRetreat = null;
      this.onMoleHit = null;
      this.onTick = null;
      this.onScoreUpdate = null;
      this.onComboUpdate = null;
      this.onLivesUpdate = null;
      this.onLevelComplete = null;
      this.onGameOver = null;
      this.onPhaseChange = null;
    }

    /**
     * Start a campaign level
     */
    startLevel(levelId) {
      this.cleanupTimers();
      this.mode = 'classic';
      this.currentLevel = window.LevelSystem.getLevel(levelId);
      this.setupBoard(this.currentLevel.grid.rows * this.currentLevel.grid.cols);

      this.score = 0;
      this.hits = 0;
      this.misses = 0;
      this.combo = 1;
      this.maxCombo = 1;
      this.lives = 3;
      this.timeRemaining = this.currentLevel.duration;
      this.totalDuration = this.currentLevel.duration;
      this.reactionTimes = [];
      this.startTime = Date.now();
      this.state = GAME_STATES.PLAYING;

      if (this.currentLevel && this.currentLevel.isLevel100) {
        this.championshipPhase = 1;
        if (this.onPhaseChange) {
          const cfg = this.getChampionshipPhaseConfig(0);
          this.onPhaseChange(cfg.phase, cfg.name, cfg.subtext);
        }
      }

      this.startSpawning();
      this.startTimerLoop();
    }

    /**
     * Get dynamic phase configuration for Level 100 Championship
     */
    getChampionshipPhaseConfig(elapsedSec) {
      if (elapsedSec < 15) {
        return {
          phase: 1,
          name: 'PHASE 1: SPEED CALIBRATION',
          subtext: 'High-speed target acquisition! Rapid spawns active.',
          spawnInterval: 480,
          visibleDuration: 650,
          maxActiveMoles: 2,
          allowedTypes: ['normal', 'golden', 'speed']
        };
      } else if (elapsedSec < 30) {
        return {
          phase: 2,
          name: 'PHASE 2: HAZARD SURGE',
          subtext: 'DANGER! Bomb moles and Armored moles breach the arena!',
          spawnInterval: 400,
          visibleDuration: 580,
          maxActiveMoles: 3,
          allowedTypes: ['normal', 'golden', 'speed', 'armored', 'bomb']
        };
      } else if (elapsedSec < 45) {
        return {
          phase: 3,
          name: 'PHASE 3: CHAOS SWARM',
          subtext: 'Quadruple simultaneous emergence! Trick moles active!',
          spawnInterval: 340,
          visibleDuration: 500,
          maxActiveMoles: 4,
          allowedTypes: ['normal', 'golden', 'speed', 'armored', 'trick', 'bonus', 'bomb']
        };
      } else {
        return {
          phase: 4,
          name: 'FINAL PHASE: SINGULARITY OVERDRIVE',
          subtext: 'MAXIMUM OVERDRIVE! 5 SIMULTANEOUS TARGETS ACROSS 20 HOLES!',
          spawnInterval: 270,
          visibleDuration: 420,
          maxActiveMoles: 5,
          allowedTypes: ['normal', 'golden', 'speed', 'armored', 'trick', 'bonus', 'bomb']
        };
      }
    }

    /**
     * Start an arcade mode
     */
    startArcadeMode(modeType, challengeLevelId = null) {
      this.cleanupTimers();
      this.mode = modeType;

      if (modeType === 'challenge' && challengeLevelId) {
        this.currentLevel = window.LevelSystem.getLevel(challengeLevelId);
      } else {
        // Fallback default config for endless / survival / time attack
        this.currentLevel = {
          id: 0,
          title: modeType.toUpperCase(),
          grid: { rows: 3, cols: 3 },
          duration: modeType === 'time_attack' ? 60 : 9999,
          spawnInterval: 800,
          visibleDuration: 1100,
          maxActiveMoles: 2,
          allowedTypes: ['normal', 'golden', 'speed', 'armored', 'bomb'],
          scoreMultiplier: 1.5,
          starRequirements: { oneStar: 3000, twoStars: 6000, threeStars: 10000 }
        };
      }

      this.setupBoard(this.currentLevel.grid.rows * this.currentLevel.grid.cols);
      this.score = 0;
      this.hits = 0;
      this.misses = 0;
      this.combo = 1;
      this.maxCombo = 1;
      this.lives = modeType === 'survival' ? 3 : 3;
      this.timeRemaining = this.currentLevel.duration;
      this.totalDuration = this.currentLevel.duration;
      this.reactionTimes = [];
      this.startTime = Date.now();
      this.state = GAME_STATES.PLAYING;

      this.startSpawning();
      this.startTimerLoop();
    }

    setupBoard(holeCount) {
      this.totalHoles = holeCount;
      this.holes = [];
      for (let i = 0; i < holeCount; i++) {
        this.holes.push({
          id: i,
          isOccupied: false,
          moleType: null,
          hp: 1,
          spawnTime: 0,
          visibleDuration: 0,
          retreatTimeoutId: null,
          isWhacked: false
        });
      }
    }

    /**
     * Controlled Mole Spawn Cycle
     */
    startSpawning() {
      const scheduleNext = () => {
        if (this.state !== GAME_STATES.PLAYING) return;

        const interval = this.getDynamicSpawnInterval();
        this.spawnTimerId = setTimeout(() => {
          this.attemptSpawn();
          scheduleNext();
        }, interval);
      };

      scheduleNext();
    }

    attemptSpawn() {
      if (this.state !== GAME_STATES.PLAYING) return;

      let maxAllowed = this.currentLevel ? this.currentLevel.maxActiveMoles : 2;
      let allowed = this.currentLevel ? this.currentLevel.allowedTypes : ['normal'];
      let baseVisible = this.currentLevel ? this.currentLevel.visibleDuration : 1400;

      // Dynamic phase scaling for Level 100 Championship
      if (this.currentLevel && this.currentLevel.isLevel100) {
        const elapsed = this.totalDuration - this.timeRemaining;
        const phaseCfg = this.getChampionshipPhaseConfig(elapsed);
        maxAllowed = phaseCfg.maxActiveMoles;
        allowed = phaseCfg.allowedTypes;
        baseVisible = phaseCfg.visibleDuration;
      }

      const activeCount = this.holes.filter(h => h.isOccupied).length;
      if (activeCount >= maxAllowed) return;

      // Find available unoccupied holes
      const freeHoles = this.holes.filter(h => !h.isOccupied);
      if (freeHoles.length === 0) return;

      const chosenHole = freeHoles[Math.floor(Math.random() * freeHoles.length)];
      const moleType = window.MoleManager.pickRandomType(allowed);
      const moleDef = window.MoleManager.getDef(moleType);

      // Calculate visible duration
      const visibleMs = Math.round(baseVisible / moleDef.speedMultiplier);

      chosenHole.isOccupied = true;
      chosenHole.moleType = moleType;
      chosenHole.hp = moleDef.hp;
      chosenHole.spawnTime = Date.now();
      chosenHole.visibleDuration = visibleMs;
      chosenHole.isWhacked = false;

      // Callback to UI
      if (this.onMoleSpawn) {
        this.onMoleSpawn(chosenHole.id, moleType, chosenHole.hp);
      }

      // Schedule natural retreat if unhit
      chosenHole.retreatTimeoutId = setTimeout(() => {
        if (chosenHole.isOccupied && !chosenHole.isWhacked) {
          this.handleMoleEscape(chosenHole);
        }
      }, visibleMs);
    }

    getDynamicSpawnInterval() {
      if (this.currentLevel && this.currentLevel.isLevel100) {
        const elapsed = this.totalDuration - this.timeRemaining;
        const phaseCfg = this.getChampionshipPhaseConfig(elapsed);
        return phaseCfg.spawnInterval;
      }
      let interval = this.currentLevel ? this.currentLevel.spawnInterval : 1000;
      if (this.mode === 'endless') {
        const elapsedSec = (Date.now() - this.startTime) / 1000;
        interval = Math.max(350, interval - (elapsedSec * 4));
      }
      return interval;
    }

    /**
     * Handle player striking a hole index
     */
    whackHole(holeIndex, element = null) {
      if (this.state !== GAME_STATES.PLAYING) return;

      const hole = this.holes[holeIndex];
      if (!hole) return;

      // Mallet swing sound
      window.SoundEngine.playSwing();

      if (!hole.isOccupied || hole.isWhacked) {
        // Missed strike
        this.handleMiss(holeIndex, element);
        return;
      }

      // Target hit!
      const reactionTimeMs = Date.now() - hole.spawnTime;
      this.reactionTimes.push(reactionTimeMs);
      const moleDef = window.MoleManager.getDef(hole.moleType);

      // Handle Bomb Mole
      if (hole.moleType === 'bomb') {
        this.handleBombHit(hole, element);
        return;
      }

      // Handle Armored Mole (Hit 1)
      if (hole.moleType === 'armored' && hole.hp > 1) {
        hole.hp--;
        window.SoundEngine.playHit('armored', false);
        if (this.onMoleHit) {
          this.onMoleHit(hole.id, hole.moleType, hole.hp, false);
        }
        return;
      }

      // Successful mole defeat
      hole.isWhacked = true;
      hole.hp = 0;
      clearTimeout(hole.retreatTimeoutId);

      this.hits++;
      const mult = this.currentLevel ? this.currentLevel.scoreMultiplier : 1.0;
      const speedBonus = Math.round(Math.max(0, (hole.visibleDuration - reactionTimeMs) / hole.visibleDuration) * 150);
      const points = Math.round((moleDef.scoreValue + speedBonus) * mult * this.combo);
      this.score += points;

      // Update combo multiplier
      this.combo++;
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }

      // Sounds & FX
      window.SoundEngine.playHit(hole.moleType, true);
      if (this.combo === 3 || this.combo === 5 || this.combo === 10 || this.combo === 20) {
        window.SoundEngine.playCombo(this.combo);
      }

      // Record in save stats
      window.SaveManager.recordHit(hole.moleType, reactionTimeMs);
      window.SaveManager.recordCombo(this.combo);

      // UI Notifications
      if (this.onMoleHit) {
        this.onMoleHit(hole.id, hole.moleType, 0, true, points, this.combo, reactionTimeMs);
      }
      if (this.onScoreUpdate) {
        this.onScoreUpdate(this.score, points);
      }
      if (this.onComboUpdate) {
        this.onComboUpdate(this.combo);
      }

      // Bonus time in Time Attack mode
      if (this.mode === 'time_attack') {
        this.timeRemaining = Math.min(60, this.timeRemaining + 0.8);
      }

      // Retreat after whacked animation
      setTimeout(() => {
        this.clearHole(hole);
      }, 350);
    }

    handleBombHit(hole, element) {
      hole.isWhacked = true;
      clearTimeout(hole.retreatTimeoutId);

      this.combo = 1;
      this.score = Math.max(0, this.score - 300);
      window.SoundEngine.playBomb();
      window.SaveManager.recordHit('bomb', 0);

      if (this.mode === 'survival' || this.currentLevel.isChallenge) {
        this.lives--;
        if (this.onLivesUpdate) this.onLivesUpdate(this.lives);
      }

      if (this.onMoleHit) {
        this.onMoleHit(hole.id, 'bomb', 0, true, -300, 1, 0);
      }
      if (this.onScoreUpdate) this.onScoreUpdate(this.score, -300);
      if (this.onComboUpdate) this.onComboUpdate(1);

      setTimeout(() => {
        this.clearHole(hole);
      }, 300);

      if (this.lives <= 0) {
        this.triggerGameOver('Detonation! You ran out of lives.');
      }
    }

    handleMiss(holeIndex, element) {
      this.misses++;
      this.combo = 1;
      window.SoundEngine.playMiss();
      window.SaveManager.recordMiss();

      if (this.mode === 'survival') {
        this.lives--;
        if (this.onLivesUpdate) this.onLivesUpdate(this.lives);
        if (this.lives <= 0) {
          this.triggerGameOver('Eliminated! 3 misses reached.');
          return;
        }
      }

      if (this.onComboUpdate) this.onComboUpdate(1);
    }

    handleMoleEscape(hole) {
      clearTimeout(hole.retreatTimeoutId);
      const wasBomb = (hole.moleType === 'bomb');

      // Escaped standard mole breaks combo in survival or strict challenge
      if (!wasBomb) {
        if (this.mode === 'survival') {
          this.lives--;
          if (this.onLivesUpdate) this.onLivesUpdate(this.lives);
          if (this.lives <= 0) {
            this.clearHole(hole);
            this.triggerGameOver('A mole escaped! Out of lives.');
            return;
          }
        }
      }

      if (this.onMoleRetreat) {
        this.onMoleRetreat(hole.id);
      }

      this.clearHole(hole);
    }

    clearHole(hole) {
      hole.isOccupied = false;
      hole.moleType = null;
      hole.hp = 1;
      hole.isWhacked = false;
      clearTimeout(hole.retreatTimeoutId);
      hole.retreatTimeoutId = null;
    }

    /**
     * Microsecond Timer Loop
     */
    startTimerLoop() {
      this.lastFrameTime = performance.now();
      const loop = (now) => {
        if (this.state !== GAME_STATES.PLAYING) return;

        const delta = (now - this.lastFrameTime) / 1000;
        this.lastFrameTime = now;

        this.timeRemaining -= delta;
        if (this.onTick) {
          this.onTick(Math.max(0, this.timeRemaining), this.totalDuration);
        }

        // Check for Level 100 Championship Phase Transition
        if (this.currentLevel && this.currentLevel.isLevel100) {
          const elapsed = this.totalDuration - this.timeRemaining;
          const phaseCfg = this.getChampionshipPhaseConfig(elapsed);
          if (phaseCfg.phase !== this.championshipPhase) {
            this.championshipPhase = phaseCfg.phase;
            window.SoundEngine.playMilestone();
            if (this.onPhaseChange) {
              this.onPhaseChange(phaseCfg.phase, phaseCfg.name, phaseCfg.subtext);
            }
          }
        }

        if (this.timeRemaining <= 3.0 && this.timeRemaining > 0.1 && Math.floor(this.timeRemaining * 10) % 5 === 0) {
          window.SoundEngine.playTick();
        }

        if (this.timeRemaining <= 0) {
          this.timeRemaining = 0;
          this.handleTimeExpired();
          return;
        }

        this.rafTimerId = requestAnimationFrame(loop);
      };

      this.rafTimerId = requestAnimationFrame(loop);
    }

    handleTimeExpired() {
      this.cleanupTimers();

      if (this.mode === 'classic') {
        this.evaluateLevelCompletion();
      } else {
        this.triggerGameOver('Time Expired!');
      }
    }

    evaluateLevelCompletion() {
      this.state = GAME_STATES.COMPLETED;
      const totalAttempts = this.hits + this.misses;
      const accuracy = totalAttempts > 0 ? Math.round((this.hits / totalAttempts) * 100) : 0;
      const avgReaction = this.reactionTimes.length > 0
        ? Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length)
        : 0;
      const fastest = this.reactionTimes.length > 0 ? Math.min(...this.reactionTimes) : 0;

      // Determine Stars
      let stars = 1;
      if (this.currentLevel && this.currentLevel.starRequirements) {
        const req = this.currentLevel.starRequirements;
        if (this.score >= req.threeStars && accuracy >= (this.currentLevel.requiredAccuracy || 60)) {
          stars = 3;
        } else if (this.score >= req.twoStars) {
          stars = 2;
        } else {
          stars = 1;
        }
      }

      // Save progress with non-regression
      const saveResult = window.SaveManager.completeLevel(
        this.currentLevel.id,
        this.score,
        stars,
        accuracy,
        this.reactionTimes
      );

      if (this.currentLevel.id === 100) {
        window.SoundEngine.playMilestone();
      } else if (this.currentLevel.isChallenge) {
        window.SoundEngine.playMilestone();
      } else {
        window.SoundEngine.playVictory();
      }

      if (this.onLevelComplete) {
        this.onLevelComplete({
          level: this.currentLevel,
          score: this.score,
          stars: stars,
          hits: this.hits,
          misses: this.misses,
          accuracy: accuracy,
          maxCombo: this.maxCombo,
          avgReactionMs: avgReaction,
          fastestReactionMs: fastest,
          saveResult: saveResult,
          isLevel100: (this.currentLevel.id === 100)
        });
      }
    }

    triggerGameOver(reason = 'Game Over') {
      this.cleanupTimers();
      this.state = GAME_STATES.GAME_OVER;
      window.SoundEngine.playGameOver();

      let isNewHighScore = false;
      if (['time_attack', 'survival', 'endless'].includes(this.mode)) {
        isNewHighScore = window.SaveManager.saveModeScore(this.mode, this.score, this.wave);
      }

      const totalAttempts = this.hits + this.misses;
      const accuracy = totalAttempts > 0 ? Math.round((this.hits / totalAttempts) * 100) : 0;

      if (this.onGameOver) {
        this.onGameOver({
          reason,
          mode: this.mode,
          score: this.score,
          hits: this.hits,
          accuracy,
          maxCombo: this.maxCombo,
          isNewHighScore
        });
      }
    }

    cleanupTimers() {
      if (this.spawnTimerId) {
        clearTimeout(this.spawnTimerId);
        this.spawnTimerId = null;
      }
      if (this.rafTimerId) {
        cancelAnimationFrame(this.rafTimerId);
        this.rafTimerId = null;
      }
      if (this.holes) {
        this.holes.forEach(h => {
          if (h.retreatTimeoutId) {
            clearTimeout(h.retreatTimeoutId);
            h.retreatTimeoutId = null;
          }
        });
      }
    }

    pause() {
      if (this.state !== GAME_STATES.PLAYING) return;
      this.state = GAME_STATES.PAUSED;
      this.cleanupTimers();
    }

    resume() {
      if (this.state !== GAME_STATES.PAUSED) return;
      this.state = GAME_STATES.PLAYING;
      this.startSpawning();
      this.startTimerLoop();
    }
  }

  window.WhackGame = WhackGame;
  window.GAME_STATES = GAME_STATES;
})(typeof window !== 'undefined' ? window : this);
