/**
 * PSEUDOKO — Web Audio API Synthesizer
 * Zero external audio assets, zero broken links.
 * Rich cyberpunk ambient music loop and responsive UI/gameplay sound effects.
 */

(function(global) {
  'use strict';

  class PseudokoAudio {
    constructor() {
      this.ctx = null;
      this.bgmGain = null;
      this.sfxGain = null;
      this.masterGain = null;
      this.isBgmPlaying = false;
      this.bgmTimer = null;

      // Settings
      this.bgmEnabled = true;
      this.sfxEnabled = true;
      this.masterVolume = 0.8;
      this.bgmVolume = 0.45;
      this.sfxVolume = 0.8;

      this.bgmStep = 0;
      this.bgmScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C Major Pentatonic
    }

    init() {
      if (this.ctx) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.bgmEnabled ? this.bgmVolume : 0, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      } catch (e) {
        console.warn('Web Audio API not supported or initialized yet:', e);
      }
    }

    ensureContext() {
      if (!this.ctx) this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    setMasterVolume(val) {
      this.masterVolume = Math.max(0, Math.min(1, val));
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
      }
    }

    setBgmVolume(val) {
      this.bgmVolume = Math.max(0, Math.min(1, val));
      if (this.bgmGain && this.ctx) {
        const target = this.bgmEnabled ? this.bgmVolume : 0;
        this.bgmGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
      }
    }

    setSfxVolume(val) {
      this.sfxVolume = Math.max(0, Math.min(1, val));
      if (this.sfxGain && this.ctx) {
        const target = this.sfxEnabled ? this.sfxVolume : 0;
        this.sfxGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
      }
    }

    toggleBgm(enable) {
      this.bgmEnabled = enable !== undefined ? enable : !this.bgmEnabled;
      if (this.bgmGain && this.ctx) {
        const target = this.bgmEnabled ? this.bgmVolume : 0;
        this.bgmGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
      }
      if (this.bgmEnabled && !this.isBgmPlaying) {
        this.startBGM();
      }
      return this.bgmEnabled;
    }

    toggleSfx(enable) {
      this.sfxEnabled = enable !== undefined ? enable : !this.sfxEnabled;
      if (this.sfxGain && this.ctx) {
        const target = this.sfxEnabled ? this.sfxVolume : 0;
        this.sfxGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
      }
      return this.sfxEnabled;
    }

    // ==========================================
    // PROCEDURAL BGM (Cyber Ambient Synth Loop)
    // ==========================================
    startBGM() {
      this.ensureContext();
      if (!this.ctx || this.isBgmPlaying) return;
      this.isBgmPlaying = true;
      this.scheduleBgmNotes();
    }

    stopBGM() {
      this.isBgmPlaying = false;
      if (this.bgmTimer) {
        clearTimeout(this.bgmTimer);
        this.bgmTimer = null;
      }
    }

    scheduleBgmNotes() {
      if (!this.isBgmPlaying) return;

      const now = this.ctx.currentTime;
      const bpm = 95;
      const beat = 60 / bpm;
      const stepDuration = beat / 2; // Eighth note

      // Play ambient bass drone every 8 steps
      if (this.bgmStep % 8 === 0) {
        this.playDrone(now, stepDuration * 8);
      }

      // Arpeggio note
      const noteIdx = [0, 2, 4, 6, 7, 4, 5, 2][this.bgmStep % 8];
      const freq = this.bgmScale[noteIdx];
      this.playArpNote(freq, now, stepDuration * 0.85);

      this.bgmStep++;

      this.bgmTimer = setTimeout(() => {
        this.scheduleBgmNotes();
      }, stepDuration * 1000);
    }

    playDrone(time, duration) {
      if (!this.ctx || !this.bgmGain) return;
      try {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65.41, time); // C2

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(180, time);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.25, time + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(time);
        osc.stop(time + duration);
      } catch (e) {}
    }

    playArpNote(freq, time, duration) {
      if (!this.ctx || !this.bgmGain) return;
      try {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, time);
        filter.frequency.exponentialRampToValueAtTime(250, time + duration);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.18, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(time);
        osc.stop(time + duration);
      } catch (e) {}
    }

    // ==========================================
    // SOUND EFFECTS (SFX)
    // ==========================================

    playClick() {
      if (!this.sfxEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.05);
      } catch (e) {}
    }

    playValidMove() {
      if (!this.sfxEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        // Dual crystal chime
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.03);

          gain.gain.setValueAtTime(0.001, now + i * 0.03);
          gain.gain.linearRampToValueAtTime(0.28, now + i * 0.03 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.22);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(now + i * 0.03);
          osc.stop(now + i * 0.03 + 0.22);
        });
      } catch (e) {}
    }

    playWrongMove() {
      if (!this.sfxEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.16);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.18);
      } catch (e) {}
    }

    playCircuitCombo(comboCount = 1) {
      if (!this.sfxEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const base = 440 * (1 + (comboCount - 1) * 0.15);
        const chord = [base, base * 1.25, base * 1.5, base * 2]; // Major chord arpeggio

        chord.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          gain.gain.setValueAtTime(0.001, now + idx * 0.05);
          gain.gain.linearRampToValueAtTime(0.35, now + idx * 0.05 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.45);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.45);
        });
      } catch (e) {}
    }

    playCoreCapture() {
      if (!this.sfxEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.35);
      } catch (e) {}
    }

    playVictory() {
      if (!this.sfxEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        // Triumphant Cyberpunk Fanfare (C5 -> E5 -> G5 -> C6)
        const notes = [
          { f: 523.25, t: 0.00, d: 0.18 },
          { f: 659.25, t: 0.16, d: 0.18 },
          { f: 783.99, t: 0.32, d: 0.22 },
          { f: 1046.50, t: 0.52, d: 0.65 }
        ];

        notes.forEach(n => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.f, now + n.t);

          gain.gain.setValueAtTime(0.001, now + n.t);
          gain.gain.linearRampToValueAtTime(0.4, now + n.t + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(now + n.t);
          osc.stop(now + n.t + n.d);
        });
      } catch (e) {}
    }

    playDefeat() {
      if (!this.sfxEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(75, now + 0.6);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.6);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.65);
      } catch (e) {}
    }
  }

  global.Pseudoko = global.Pseudoko || {};
  global.Pseudoko.Audio = new PseudokoAudio();

})(typeof window !== 'undefined' ? window : global);

