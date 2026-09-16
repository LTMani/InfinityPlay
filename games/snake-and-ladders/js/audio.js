/**
 * Snake & Ladders - Web Audio Synthesizer
 * 100% procedural sound effects and ambient music without external audio files.
 */

(function() {
  'use strict';

  class AudioManager {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.sfxGain = null;
      this.musicGain = null;
      this.isSoundEnabled = true;
      this.isMusicEnabled = false;
      this.ambientTimer = null;
      this.isInitialized = false;
    }

    init() {
      if (this.isInitialized) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.isSoundEnabled ? 1.0 : 0.0001, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.isMusicEnabled ? 0.22 : 0.0001, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.isInitialized = true;
      } catch (e) {
        console.warn('[Snake & Ladders Audio] Web Audio failed to initialize:', e);
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
      if (this.sfxGain && this.ctx) {
        const t = this.ctx.currentTime;
        this.sfxGain.gain.cancelScheduledValues(t);
        this.sfxGain.gain.setValueAtTime(this.isSoundEnabled ? 1.0 : 0.0001, t);
      }
    }

    setMusicEnabled(enabled) {
      this.isMusicEnabled = !!enabled;
      if (this.musicGain && this.ctx) {
        const t = this.ctx.currentTime;
        this.musicGain.gain.cancelScheduledValues(t);
        this.musicGain.gain.setValueAtTime(this.isMusicEnabled ? 0.22 : 0.0001, t);
      }
      if (this.isMusicEnabled) {
        this.resume();
        this.startAmbientMusic();
      } else {
        this.stopAmbientMusic();
      }
    }

    // UI Click Sound
    playClick() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.05);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.05);
    }

    // Dice Tumble / Roll Sound (series of rapid wooden clicks and rumble)
    playDiceRoll() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const baseT = this.ctx.currentTime;
      const clicks = 8;
      for (let i = 0; i < clicks; i++) {
        const offset = (i * 0.07) + (Math.random() * 0.02);
        const t = baseT + offset;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = Math.random() > 0.5 ? 'triangle' : 'square';
        osc.frequency.setValueAtTime(160 + Math.random() * 280, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.04);

        const vol = 0.08 + (i / clicks) * 0.12;
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.04);
      }
    }

    // Dice Final Settle / Clatter Hit
    playDiceSettle() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.12);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.12);
    }

    // Token Step Sound (crisp tactile token move)
    playStep() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.06);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.06);
    }

    // Ladder Climb Sound (ascending harmonic major arpeggio)
    playLadder() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      const baseT = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        const t = baseT + (i * 0.09);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.28);
      });
    }

    // Snake Slide Sound (descending pitch with subtle slide resonance)
    playSnake() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(680, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.65);

      // Low pass filter for warm reptile sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, t);
      filter.frequency.exponentialRampToValueAtTime(200, t + 0.65);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.65);
    }

    // Bounce / Blocked Move Sound (when exact finish exceeds 100)
    playBounce() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.15);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.15);
    }

    // Extra Turn Fanfare (rolled a 6)
    playExtraTurn() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A major
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteT = t + (i * 0.07);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteT);

        gain.gain.setValueAtTime(0.2, noteT);
        gain.gain.exponentialRampToValueAtTime(0.001, noteT + 0.2);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(noteT);
        osc.stop(noteT + 0.2);
      });
    }

    // Victory Fanfare (glorious celebration chords)
    playVictory() {
      if (!this.isSoundEnabled) return;
      this.resume();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      // Fanfare sequence: C4, G4, C5, E5, G5 (triumph)
      const sequence = [
        { f: 261.63, t: 0.00, d: 0.18 },
        { f: 392.00, t: 0.18, d: 0.18 },
        { f: 523.25, t: 0.36, d: 0.22 },
        { f: 659.25, t: 0.58, d: 0.22 },
        { f: 783.99, t: 0.80, d: 0.60 },
        { f: 1046.50, t: 0.80, d: 0.60 }
      ];

      sequence.forEach(item => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteT = t + item.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, noteT);

        gain.gain.setValueAtTime(0.28, noteT);
        gain.gain.exponentialRampToValueAtTime(0.001, noteT + item.d);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(noteT);
        osc.stop(noteT + item.d);
      });
    }

    // Procedural Ambient Music (gentle evolving lush chords)
    startAmbientMusic() {
      if (this.ambientTimer || !this.isMusicEnabled) return;

      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 392.00]  // G7
      ];

      let chordIndex = 0;

      const playNextChord = () => {
        if (!this.isMusicEnabled || !this.ctx) return;
        const currentChord = chords[chordIndex];
        chordIndex = (chordIndex + 1) % chords.length;

        const t = this.ctx.currentTime;
        const duration = 4.2;

        currentChord.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(600, t);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.04, t + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.musicGain);

          osc.start(t);
          osc.stop(t + duration);
        });
      };

      playNextChord();
      this.ambientTimer = setInterval(playNextChord, 4000);
    }

    stopAmbientMusic() {
      if (this.ambientTimer) {
        clearInterval(this.ambientTimer);
        this.ambientTimer = null;
      }
    }
  }

  window.SNAudio = new AudioManager();
})();
