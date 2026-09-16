/**
 * Color Match: Spectrum Arena - Web Audio API Procedural Sound Engine
 * Zero external audio file dependencies. Rich harmonic chimes, combo pitch scaling,
 * tactile clicks, and optional ambient cosmic resonance pad.
 */

(function(window) {
  'use strict';

  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.ambientGain = null;
      this.ambientOsc1 = null;
      this.ambientOsc2 = null;
      this.muted = false;
      this.ambientEnabled = false;

      // Check saved settings
      try {
        const saved = localStorage.getItem('infinityplay_color_match_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.muted !== undefined) this.muted = !!parsed.muted;
          if (parsed.ambient !== undefined) this.ambientEnabled = !!parsed.ambient;
        }
      } catch (e) {
        // localStorage fallback
      }
    }

    /**
     * Lazy initialize AudioContext on user interaction
     */
    initContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.6, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        }
      } else if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.6, this.ctx.currentTime);
      }
      this.saveSettings();
      return this.muted;
    }

    setMuted(muteState) {
      this.muted = !!muteState;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.6, this.ctx.currentTime);
      }
      this.saveSettings();
    }

    saveSettings() {
      try {
        const current = JSON.parse(localStorage.getItem('infinityplay_color_match_settings') || '{}');
        current.muted = this.muted;
        current.ambient = this.ambientEnabled;
        localStorage.setItem('infinityplay_color_match_settings', JSON.stringify(current));
      } catch (e) {}
    }

    /**
     * Play correct answer sound. Pitch scales dynamically with combo multiplier.
     */
    playCorrect(combo = 1) {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Base frequency 440Hz (A4), scaling by semitones based on combo
      const semitones = Math.min(combo * 1.5, 18);
      const baseFreq = 440 * Math.pow(2, semitones / 12);

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.3);

      // Add harmonic overtone for higher combos
      if (combo >= 3) {
        const overtone = this.ctx.createOscillator();
        const overGain = this.ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(baseFreq * 2, now);
        overtone.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, now + 0.15);

        overGain.gain.setValueAtTime(0.15, now);
        overGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        overtone.connect(overGain);
        overGain.connect(this.masterGain);

        overtone.start(now);
        overtone.stop(now + 0.26);
      }
    }

    /**
     * Play wrong answer / penalty sound: Dissonant low buzzer
     */
    playWrong() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      // Dissonant minor second chord (130Hz & 138Hz)
      osc1.frequency.setValueAtTime(130, now);
      osc1.frequency.linearRampToValueAtTime(90, now + 0.28);

      osc2.frequency.setValueAtTime(138, now);
      osc2.frequency.linearRampToValueAtTime(95, now + 0.28);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.32);
      osc2.stop(now + 0.32);
    }

    /**
     * Play subtle timer warning tick
     */
    playTick() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.06);
    }

    /**
     * Play combo streak milestone chime (e.g. 5x, 10x)
     */
    playStreak() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + (idx * 0.06);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    }

    /**
     * Play victory / level complete triumphant chords
     */
    playLevelComplete() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Radiant major fanfare
      const notes = [440, 554.37, 659.25, 880]; // A major
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + (idx * 0.09);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.55);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
    }

    /**
     * Play milestone grand boss victory
     */
    playMilestone() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chords = [
        [523.25, 659.25, 783.99],
        [587.33, 739.99, 880.00],
        [659.25, 830.61, 987.77],
        [1046.50, 1318.51, 1567.98]
      ];

      chords.forEach((chord, step) => {
        const stepTime = now + (step * 0.16);
        chord.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, stepTime);

          gain.gain.setValueAtTime(0.18, stepTime);
          gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.45);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(stepTime);
          osc.stop(stepTime + 0.48);
        });
      });
    }

    /**
     * Play game over sound
     */
    playGameOver() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [440, 415.30, 392.00, 329.63]; // Descending chromatic/minor
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + (idx * 0.14);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.38);
      });
    }

    /**
     * Subtle tactile button click
     */
    playButtonClick() {
      if (this.muted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.05);
    }
  }

  window.SoundEngine = new SoundEngine();
})(typeof window !== 'undefined' ? window : this);

