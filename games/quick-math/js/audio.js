/**
 * Quick Math: Infinity Challenge - Procedural Audio Engine
 * Pure Web Audio API sound synthesis with zero external audio file dependencies.
 */

(function() {
  'use strict';

  let audioCtx = null;
  let isSoundEnabled = true;
  let isMusicEnabled = true;
  let ambientOsc = null;
  let ambientGain = null;

  function getContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  const SoundFX = {
    init(settings) {
      if (settings) {
        isSoundEnabled = settings.sound !== false;
        isMusicEnabled = settings.music !== false;
      }
    },

    setSoundEnabled(val) {
      isSoundEnabled = !!val;
    },

    setMusicEnabled(val) {
      isMusicEnabled = !!val;
      if (!isMusicEnabled) {
        this.stopAmbient();
      } else {
        this.startAmbient();
      }
    },

    /**
     * Tactile UI button click
     */
    playClick() {
      if (!isSoundEnabled) return;
      const ctx = getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    },

    /**
     * Harmonic bell chime for correct answer
     */
    playCorrect(speedBonus = 0) {
      if (!isSoundEnabled) return;
      const ctx = getContext();
      if (!ctx) return;

      const baseFreq = speedBonus > 50 ? 587.33 : 523.25; // D5 or C5
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5]; // Major triad

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.setValueAtTime(0.25 - idx * 0.04, ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.04 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.04);
        osc.stop(ctx.currentTime + idx * 0.04 + 0.4);
      });
    },

    /**
     * Low resonance thud for incorrect answer
     */
    playWrong() {
      if (!isSoundEnabled) return;
      const ctx = getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.22);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    },

    /**
     * Subtle countdown clock tick
     */
    playTick(isUrgent = false) {
      if (!isSoundEnabled) return;
      const ctx = getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isUrgent ? 880 : 540, ctx.currentTime);

      gain.gain.setValueAtTime(isUrgent ? 0.2 : 0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    },

    /**
     * Level Up / Perfect completion fanfare
     */
    playFanfare() {
      if (!isSoundEnabled) return;
      const ctx = getContext();
      if (!ctx) return;

      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.22, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.55);
      });
    },

    /**
     * Magical achievement unlock chime
     */
    playAchievement() {
      if (!isSoundEnabled) return;
      const ctx = getContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.65);
      });
    },

    /**
     * Gentle ambient background synthesizer drone
     */
    startAmbient() {
      if (!isMusicEnabled) return;
      const ctx = getContext();
      if (!ctx || ambientOsc) return;

      try {
        ambientOsc = ctx.createOscillator();
        ambientGain = ctx.createGain();

        ambientOsc.type = 'sine';
        ambientOsc.frequency.setValueAtTime(55, ctx.currentTime); // Deep A1 note

        ambientGain.gain.setValueAtTime(0.025, ctx.currentTime);

        ambientOsc.connect(ambientGain);
        ambientGain.connect(ctx.destination);

        ambientOsc.start();
      } catch (e) {
        // Audio policy restrictions
      }
    },

    stopAmbient() {
      if (ambientOsc) {
        try {
          ambientOsc.stop();
          ambientOsc.disconnect();
        } catch (e) {}
        ambientOsc = null;
        ambientGain = null;
      }
    }
  };

  window.QuickMath = window.QuickMath || {};
  window.QuickMath.SoundFX = SoundFX;
})();

