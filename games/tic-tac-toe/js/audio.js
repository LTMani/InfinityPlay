/**
 * Tic-Tac-Toe: Ultimate Arena - Web Audio Synthesizer
 * Procedural audio generation for tactile clacks, fanfares, UI, and ambient music
 */

(function() {
  'use strict';

  class AudioManager {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.musicGain = null;
      this.sfxGain = null;
      this.isSoundEnabled = true;
      this.isMusicEnabled = true;
      this.ambientOsc1 = null;
      this.ambientOsc2 = null;
      this.ambientInterval = null;
      this.isInitialized = false;
    }

    init() {
      if (this.isInitialized) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        // Read settings from TTTSave if available
        if (window.TTTSave) {
          const s = window.TTTSave.getSettings();
          this.isSoundEnabled = s.sound !== false;
          this.isMusicEnabled = s.music !== false;
        }

        this.isInitialized = true;
        if (this.isMusicEnabled) {
          this.startAmbientMusic();
        }
      } catch (e) {
        console.warn('[Tic-Tac-Toe Audio] Web Audio failed to initialize:', e);
      }
    }

    resume() {
      if (!this.ctx) {
        this.init();
      } else if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    setSoundEnabled(enabled) {
      this.isSoundEnabled = !!enabled;
      if (this.sfxGain && this.ctx) {
        this.sfxGain.gain.setValueAtTime(this.isSoundEnabled ? 1.0 : 0.0001, this.ctx.currentTime);
      }
    }

    setMusicEnabled(enabled) {
      this.isMusicEnabled = !!enabled;
      if (this.isMusicEnabled) {
        this.resume();
        this.startAmbientMusic();
      } else {
        this.stopAmbientMusic();
      }
    }

    // UI Click sound
    playClick() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(350, t + 0.04);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.04);
    }

    // Tactile piece placement (solid wood/metal impact)
    playPiecePlacement(symbol = 'X') {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;

      // Component 1: Thud (Low body)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      const baseFreq = symbol === 'X' ? 140 : 120;
      osc1.frequency.setValueAtTime(baseFreq, t);
      osc1.frequency.exponentialRampToValueAtTime(45, t + 0.09);
      gain1.gain.setValueAtTime(0.4, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      osc1.connect(gain1);
      gain1.connect(this.sfxGain);
      osc1.start(t);
      osc1.stop(t + 0.09);

      // Component 2: Metallic / Stone Click
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      const highFreq = symbol === 'X' ? 1250 : 1450;
      osc2.frequency.setValueAtTime(highFreq, t);
      osc2.frequency.exponentialRampToValueAtTime(400, t + 0.05);
      gain2.gain.setValueAtTime(0.2, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      osc2.start(t);
      osc2.stop(t + 0.05);
    }

    // AI move indicator sound
    playAIMove() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.linearRampToValueAtTime(660, t + 0.06);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.08);
    }

    // Invalid move error
    playInvalid() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.setValueAtTime(130, t + 0.05);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.12);
    }

    // Victory Fanfare (Ascending chord: C4 - E4 - G4 - C5 with gentle sustain)
    playVictory() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      const startT = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        const noteT = startT + i * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = i === notes.length - 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, noteT);

        const duration = i === notes.length - 1 ? 0.7 : 0.3;
        gain.gain.setValueAtTime(0.001, noteT);
        gain.gain.linearRampToValueAtTime(0.2, noteT + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, noteT + duration);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(noteT);
        osc.stop(noteT + duration);
      });
    }

    // Defeat (Descending minor notes)
    playDefeat() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const notes = [392.00, 369.99, 329.63, 293.66];
      const startT = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        const noteT = startT + i * 0.14;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteT);

        const duration = 0.35;
        gain.gain.setValueAtTime(0.18, noteT);
        gain.gain.exponentialRampToValueAtTime(0.001, noteT + duration);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(noteT);
        osc.stop(noteT + duration);
      });
    }

    // Draw Sound (Subtle neutral chime)
    playDraw() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const notes = [329.63, 392.00, 440.00];
      const startT = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        const noteT = startT + i * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteT);

        gain.gain.setValueAtTime(0.12, noteT);
        gain.gain.exponentialRampToValueAtTime(0.001, noteT + 0.4);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(noteT);
        osc.stop(noteT + 0.4);
      });
    }

    // Level Unlocked Chime
    playLevelUnlocked() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880];
      const startT = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        const noteT = startT + i * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteT);

        gain.gain.setValueAtTime(0.15, noteT);
        gain.gain.exponentialRampToValueAtTime(0.001, noteT + 0.45);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(noteT);
        osc.stop(noteT + 0.45);
      });
    }

    // Ambient background synth drone (Warm, cinematic, ultra-subtle)
    startAmbientMusic() {
      if (!this.isMusicEnabled || this.ambientOsc1) return;
      this.resume();
      if (!this.ctx) return;

      try {
        const t = this.ctx.currentTime;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, t);

        this.ambientOsc1 = this.ctx.createOscillator();
        this.ambientOsc1.type = 'sine';
        this.ambientOsc1.frequency.setValueAtTime(110, t); // A2

        this.ambientOsc2 = this.ctx.createOscillator();
        this.ambientOsc2.type = 'sine';
        this.ambientOsc2.frequency.setValueAtTime(164.81, t); // E3

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.001, t);
        this.ambientGain.gain.linearRampToValueAtTime(0.12, t + 2.0);

        this.ambientOsc1.connect(filter);
        this.ambientOsc2.connect(filter);
        filter.connect(this.ambientGain);
        this.ambientGain.connect(this.musicGain);

        this.ambientOsc1.start(t);
        this.ambientOsc2.start(t);
      } catch (e) {
        console.warn('[Tic-Tac-Toe Audio] Ambient music start error:', e);
      }
    }

    stopAmbientMusic() {
      if (!this.ambientOsc1) return;
      try {
        const t = this.ctx ? this.ctx.currentTime : 0;
        if (this.ambientGain && this.ctx) {
          this.ambientGain.gain.linearRampToValueAtTime(0.0001, t + 0.5);
        }
        setTimeout(() => {
          if (this.ambientOsc1) {
            try { this.ambientOsc1.stop(); this.ambientOsc1.disconnect(); } catch (e) {}
            this.ambientOsc1 = null;
          }
          if (this.ambientOsc2) {
            try { this.ambientOsc2.stop(); this.ambientOsc2.disconnect(); } catch (e) {}
            this.ambientOsc2 = null;
          }
        }, 550);
      } catch (e) {
        this.ambientOsc1 = null;
        this.ambientOsc2 = null;
      }
    }
  }

  window.TTTAudio = new AudioManager();
})();

