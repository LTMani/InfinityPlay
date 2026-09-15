/**
 * InfinityPlay - City Builder Procedural Audio Synthesizer
 * High-fidelity zero-dependency sound effects using the Web Audio API
 */

(function(exports) {
  'use strict';

  class CityAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.ambientGain = null;
      this.ambientOsc = null;
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      this.resume();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    }

    playPlace() {
      if (!this.enabled) return;
      this.init();
      this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Deep thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.14);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);

      // Wood tap transient
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(520, now);
      osc2.frequency.exponentialRampToValueAtTime(180, now + 0.06);

      gain2.gain.setValueAtTime(0.2, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.06);
    }

    playHammer() {
      if (!this.enabled) return;
      this.init();
      this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }

    playCoin() {
      if (!this.enabled) return;
      this.init();
      this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Bell 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.22);

      // Bell 2
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.07); // E6
      gain2.gain.setValueAtTime(0.2, now + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.07);
      osc2.stop(now + 0.35);
    }

    playGem() {
      if (!this.enabled) return;
      this.init();
      this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      });
    }

    playUpgrade() {
      if (!this.enabled) return;
      this.init();
      this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Majestic chord arpeggio: C4, G4, C5, E5, G5
      const notes = [261.63, 392.00, 523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.09;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.6);
      });
    }

    playError() {
      if (!this.enabled) return;
      this.init();
      this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(120, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }

    playCannon() {
      if (!this.enabled) return;
      this.init();
      this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Sub punch
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);

      // Noise blast crack
      try {
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        whiteNoise.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        whiteNoise.start(now);
      } catch (e) {}
    }

    playSwordClash() {
      if (!this.enabled) return;
      this.init();
      this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [1600, 2400, 3100];
      freqs.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 0.6, now + 0.08);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      });
    }

    playBattleHorn() {
      if (!this.enabled) return;
      this.init();
      this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [
        { f: 220, t: 0, d: 0.3 },    // A3
        { f: 277.18, t: 0.15, d: 0.4 }, // C#4
        { f: 329.63, t: 0.35, d: 0.7 }  // E4 war blast
      ];

      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.001, now + n.t);
        gain.gain.linearRampToValueAtTime(0.18, now + n.t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    }

    playBubblePop() {
      if (!this.enabled) return;
      this.init();
      this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Bubbly rising chirp
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.09);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);

      // Gold shimmer bell
      const bell = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(1760, now + 0.06); // A6
      bellGain.gain.setValueAtTime(0.15, now + 0.06);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      bell.connect(bellGain);
      bellGain.connect(this.ctx.destination);
      bell.start(now + 0.06);
      bell.stop(now + 0.3);
    }

    playVictoryFanfare() {
      if (!this.enabled) return;
      this.init();
      this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Triumphant Clash-style Fanfare
      const chords = [
        { freqs: [261.6, 329.6, 392.0], t: 0, d: 0.22 },      // C Major
        { freqs: [349.2, 440.0, 523.2], t: 0.24, d: 0.22 },   // F Major
        { freqs: [392.0, 493.8, 587.3], t: 0.48, d: 0.32 },   // G Major
        { freqs: [523.2, 659.2, 783.9, 1046.5], t: 0.82, d: 0.9 } // High C Major triumphant hold
      ];

      chords.forEach(c => {
        c.freqs.forEach(f => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + c.t);

          gain.gain.setValueAtTime(0.001, now + c.t);
          gain.gain.linearRampToValueAtTime(0.18, now + c.t + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + c.d);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + c.t);
          osc.stop(now + c.t + c.d);
        });
      });
    }

    playDefeatSound() {
      if (!this.enabled) return;
      this.init();
      this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [
        { f: 330, t: 0, d: 0.3 },      // E4
        { f: 311.13, t: 0.25, d: 0.35 },// Eb4
        { f: 293.66, t: 0.55, d: 0.6 }  // D4 somber
      ];

      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.12, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    }

    playWallHit() {
      if (!this.enabled) return;
      this.init();
      this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  }

  exports.CityAudio = CityAudio;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.CityAudio = {}));

