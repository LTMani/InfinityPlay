/**
 * CONNECTING Puzzle Game - Procedural Web Audio API Synthesizer
 * Zero external mp3/wav files - 100% reliable procedural synthesis.
 */

(function() {
  'use strict';

  class SoundManager {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      // Pentatonic pitch scale for colors
      this.notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
    }

    init() {
      if (this.ctx) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        console.warn('Web Audio API not supported:', e);
      }
    }

    ensureRunning() {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    setEnabled(val) {
      this.enabled = !!val;
    }

    isEnabled() {
      return this.enabled;
    }

    // Gentle soft click when extending path to a new cell
    playStep() {
      if (!this.enabled) return;
      this.ensureRunning();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    }

    // Melodic harmonic chime when connecting matching endpoints
    playConnect(colorIndex = 0) {
      if (!this.enabled) return;
      this.ensureRunning();
      if (!this.ctx) return;

      const baseFreq = this.notes[colorIndex % this.notes.length];
      const now = this.ctx.currentTime;

      // Two oscillator harmonics for a warm glassy bell tone
      [1, 2].forEach((mult, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(baseFreq * mult, now);

        const initialVol = idx === 0 ? 0.15 : 0.06;
        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.36);
      });
    }

    // Soft low blip when an intersecting path is cut or broken
    playBreak() {
      if (!this.enabled) return;
      this.ensureRunning();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    }

    // Sparkly magical chime for Hints
    playHint() {
      if (!this.enabled) return;
      this.ensureRunning();
      if (!this.ctx) return;

      const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major
      const now = this.ctx.currentTime;

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.06;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    }

    // Celebratory victory fanfare arpeggio on Level Complete
    playLevelComplete() {
      if (!this.enabled) return;
      this.ensureRunning();
      if (!this.ctx) return;

      const fanfare = [
        { freq: 392.00, start: 0.00, dur: 0.12 }, // G4
        { freq: 523.25, start: 0.10, dur: 0.12 }, // C5
        { freq: 659.25, start: 0.20, dur: 0.12 }, // E5
        { freq: 783.99, start: 0.30, dur: 0.18 }, // G5
        { freq: 1046.50, start: 0.45, dur: 0.60 } // C6 (long finish)
      ];

      const now = this.ctx.currentTime;

      fanfare.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + note.start;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, noteStart);

        gain.gain.setValueAtTime(0.18, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + note.dur + 0.05);
      });
    }

    // Generic button click sound
    playButtonClick() {
      if (!this.enabled) return;
      this.ensureRunning();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.05);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    }
  }

  window.ConnectingAudio = new SoundManager();
})();
