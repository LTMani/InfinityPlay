/**
 * InfinityPlay Ultimate Racing - Web Audio API Procedural Sound Synthesizer
 * Zero-asset, zero-lag dynamic engine, nitro, drift screech, collisions & synth music
 */

(function() {
  class AudioManager {
    constructor() {
      this.ctx = null;
      this.isInitialized = false;
      this.masterGain = null;
      this.sfxGain = null;
      this.musicGain = null;

      // Engine sound nodes
      this.engineOsc1 = null;
      this.engineOsc2 = null;
      this.engineFilter = null;
      this.engineGain = null;
      this.isEngineRunning = false;

      // Nitro & Drift sound nodes
      this.nitroGain = null;
      this.driftGain = null;
      this.noiseBuffer = null;

      // Music sequencer
      this.isMusicPlaying = false;
      this.musicTimer = null;
      this.musicStep = 0;

      // Bind interaction resume
      const resumeAudio = () => {
        if (!this.isInitialized) {
          this.init();
        } else if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      };
      window.addEventListener('pointerdown', resumeAudio, { once: false });
      window.addEventListener('keydown', resumeAudio, { once: false });
    }

    init() {
      if (this.isInitialized) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.createNoiseBuffer();
        this.setupContinuousEffects();
        this.isInitialized = true;
      } catch (e) {
        console.warn('Web Audio initialization error:', e);
      }
    }

    createNoiseBuffer() {
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of white noise
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    }

    setupContinuousEffects() {
      if (!this.ctx || !this.noiseBuffer) return;

      // 1. Setup Nitro Noise Node
      const nitroSource = this.ctx.createBufferSource();
      nitroSource.buffer = this.noiseBuffer;
      nitroSource.loop = true;

      const nitroFilter = this.ctx.createBiquadFilter();
      nitroFilter.type = 'bandpass';
      nitroFilter.frequency.setValueAtTime(850, this.ctx.currentTime);
      nitroFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      this.nitroGain = this.ctx.createGain();
      this.nitroGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      nitroSource.connect(nitroFilter);
      nitroFilter.connect(this.nitroGain);
      this.nitroGain.connect(this.sfxGain);
      nitroSource.start(0);

      // 2. Setup Drift Screech Noise Node
      const driftSource = this.ctx.createBufferSource();
      driftSource.buffer = this.noiseBuffer;
      driftSource.loop = true;

      const driftFilter = this.ctx.createBiquadFilter();
      driftFilter.type = 'bandpass';
      driftFilter.frequency.setValueAtTime(2200, this.ctx.currentTime);
      driftFilter.Q.setValueAtTime(6.0, this.ctx.currentTime);

      this.driftGain = this.ctx.createGain();
      this.driftGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      driftSource.connect(driftFilter);
      driftFilter.connect(this.driftGain);
      this.driftGain.connect(this.sfxGain);
      driftSource.start(0);
    }

    startEngine() {
      if (!this.ctx) this.init();
      if (!this.ctx || this.isEngineRunning) return;

      const now = this.ctx.currentTime;
      this.engineOsc1 = this.ctx.createOscillator();
      this.engineOsc2 = this.ctx.createOscillator();
      this.engineFilter = this.ctx.createBiquadFilter();
      this.engineGain = this.ctx.createGain();

      this.engineOsc1.type = 'sawtooth';
      this.engineOsc2.type = 'triangle';

      this.engineOsc1.frequency.setValueAtTime(65, now);
      this.engineOsc2.frequency.setValueAtTime(32.5, now);

      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(350, now);

      const settings = window.UR?.SaveSystem?.getSettings() || {};
      const targetVolume = settings.soundEffects !== false ? 0.22 : 0;
      this.engineGain.gain.setValueAtTime(targetVolume, now);

      this.engineOsc1.connect(this.engineFilter);
      this.engineOsc2.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.sfxGain);

      this.engineOsc1.start(now);
      this.engineOsc2.start(now);
      this.isEngineRunning = true;
    }

    stopEngine() {
      if (!this.isEngineRunning) return;
      try {
        if (this.engineOsc1) { this.engineOsc1.stop(); this.engineOsc1.disconnect(); }
        if (this.engineOsc2) { this.engineOsc2.stop(); this.engineOsc2.disconnect(); }
        if (this.engineGain) { this.engineGain.disconnect(); }
      } catch (e) {}
      this.isEngineRunning = false;
    }

    updateEngine(speedRatio, isAccelerating, isBraking) {
      if (!this.isEngineRunning || !this.ctx) return;
      const settings = window.UR?.SaveSystem?.getSettings() || {};
      if (settings.soundEffects === false) {
        if (this.engineGain) this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
        return;
      }

      const now = this.ctx.currentTime;
      const baseFreq = 60 + speedRatio * 180 + (isAccelerating ? 25 : 0) - (isBraking ? 15 : 0);
      const clampedFreq = Math.max(50, Math.min(320, baseFreq));

      this.engineOsc1.frequency.setTargetAtTime(clampedFreq, now, 0.05);
      this.engineOsc2.frequency.setTargetAtTime(clampedFreq * 0.5, now, 0.05);
      this.engineFilter.frequency.setTargetAtTime(250 + speedRatio * 1200, now, 0.08);

      const vol = 0.18 + speedRatio * 0.12;
      this.engineGain.gain.setTargetAtTime(vol, now, 0.05);
    }

    setNitroState(active) {
      if (!this.nitroGain || !this.ctx) return;
      const settings = window.UR?.SaveSystem?.getSettings() || {};
      const vol = active && settings.soundEffects !== false ? 0.35 : 0.0001;
      this.nitroGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.04);
    }

    setDriftState(intensity) {
      // intensity between 0.0 and 1.0
      if (!this.driftGain || !this.ctx) return;
      const settings = window.UR?.SaveSystem?.getSettings() || {};
      const vol = settings.soundEffects !== false ? Math.min(0.3, intensity * 0.3) : 0.0001;
      this.driftGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.05);
    }

    playCollision(intensity = 0.5) {
      if (!this.ctx) this.init();
      if (!this.ctx) return;
      const settings = window.UR?.SaveSystem?.getSettings() || {};
      if (settings.soundEffects === false) return;

      const now = this.ctx.currentTime;

      // Low bass thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);

      const impactVol = Math.min(0.6, 0.2 + intensity * 0.4);
      gain.gain.setValueAtTime(impactVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.25);

      // Metallic crunch noise burst
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(impactVol * 0.7, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.sfxGain);
        noise.start(now);
        noise.stop(now + 0.18);
      }
    }

    playCountdown(isFinal = false) {
      if (!this.ctx) this.init();
      if (!this.ctx) return;
      const settings = window.UR?.SaveSystem?.getSettings() || {};
      if (settings.soundEffects === false) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      if (isFinal) {
        // High GO tone
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.setValueAtTime(1174.66, now + 0.08); // D6
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.45);
      } else {
        // Warning 3-2-1 tone
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    }

    playVictory() {
      if (!this.ctx) this.init();
      if (!this.ctx) return;
      const settings = window.UR?.SaveSystem?.getSettings() || {};
      if (settings.soundEffects === false) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.35);
      });
    }

    playClick() {
      if (!this.ctx) this.init();
      if (!this.ctx) return;
      const settings = window.UR?.SaveSystem?.getSettings() || {};
      if (settings.soundEffects === false) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.05);
    }

    // Procedural Synthwave Music Generator
    startMusic() {
      if (this.isMusicPlaying) return;
      if (!this.ctx) this.init();
      if (!this.ctx) return;

      const settings = window.UR?.SaveSystem?.getSettings() || {};
      if (settings.music === false) return;

      this.isMusicPlaying = true;
      this.musicStep = 0;

      // 130 BPM, 16th note step = ~115ms
      const bassNotes = [110, 110, 130.81, 110, 146.83, 110, 130.81, 98]; // A2, A2, C3, A2, D3, A2, C3, G2
      const stepDuration = 0.115;

      const scheduleStep = () => {
        if (!this.isMusicPlaying || !this.ctx) return;
        const currentSettings = window.UR?.SaveSystem?.getSettings() || {};
        if (currentSettings.music === false) {
          this.stopMusic();
          return;
        }

        const now = this.ctx.currentTime;
        const noteFreq = bassNotes[this.musicStep % bassNotes.length];

        // Synthesize bass pluck
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(noteFreq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.exponentialRampToValueAtTime(120, now + stepDuration * 0.9);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.9);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + stepDuration);

        this.musicStep++;
        this.musicTimer = setTimeout(scheduleStep, stepDuration * 1000);
      };

      scheduleStep();
    }

    stopMusic() {
      this.isMusicPlaying = false;
      if (this.musicTimer) {
        clearTimeout(this.musicTimer);
        this.musicTimer = null;
      }
    }
  }

  window.UR = window.UR || {};
  window.UR.audio = new AudioManager();
})();

