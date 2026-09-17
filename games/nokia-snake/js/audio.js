/**
 * Nokia Snake - Procedural Web Audio Synthesizer
 * Generates authentic 8-bit / piezo buzzer square wave sounds without external audio files.
 */

(function() {
  'use strict';

  class SoundManager {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.isSoundEnabled = true;
      this.isInitialized = false;
    }

    init() {
      if (this.isInitialized) return;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        this.ctx = new AudioContextClass();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.isInitialized = true;
      } catch (e) {
        console.warn('[NokiaSnake] Web Audio initialization failed:', e);
      }
    }

    resume() {
      if (!this.ctx) {
        this.init();
      } else if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    setSoundEnabled(enabled) {
      this.isSoundEnabled = !!enabled;
    }

    /**
     * Plays an authentic retro square wave tone
     */
    playTone(frequency, durationMs, type = 'square', gainLevel = 0.25) {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        const startTime = this.ctx.currentTime;
        const stopTime = startTime + (durationMs / 1000);

        gain.gain.setValueAtTime(gainLevel, startTime);
        // Exponential ramp to avoid clicks
        gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(stopTime);
      } catch (e) {
        // Safe silence on failure
      }
    }

    /**
     * Food eaten: quick double-tone chirp
     */
    playEat() {
      if (!this.isSoundEnabled) return;
      this.playTone(520, 45, 'square', 0.25);
      setTimeout(() => {
        this.playTone(780, 65, 'square', 0.25);
      }, 50);
    }

    /**
     * Game start: retro arpeggio
     */
    playStart() {
      if (!this.isSoundEnabled) return;
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 70, 'square', 0.2);
        }, idx * 75);
      });
    }

    /**
     * Collision / Game over: low buzzer drop
     */
    playGameOver() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.35);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.4);
      } catch (e) {}
    }

    /**
     * Pause / Unpause toggle
     */
    playPause() {
      if (!this.isSoundEnabled) return;
      this.playTone(480, 50, 'square', 0.18);
      setTimeout(() => {
        this.playTone(360, 60, 'square', 0.18);
      }, 60);
    }

    /**
     * Simple button click tick
     */
    playClick() {
      if (!this.isSoundEnabled) return;
      this.playTone(800, 18, 'square', 0.1);
    }

    /**
     * Fanfare on high score achievement
     */
    playHighScore() {
      if (!this.isSoundEnabled) return;
      const fanNotes = [523.25, 659.25, 783.99, 1046.50];
      fanNotes.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 120, 'square', 0.25);
        }, i * 110);
      });
    }
  }

  window.NokiaSnake = window.NokiaSnake || {};
  window.NokiaSnake.audio = new SoundManager();
})();
