// SoundManager.js - Procedural Web Audio API Sound Engine

export class SoundManager {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.musicEnabled = true;
    this.sfxVolume = 0.7;
    this.musicVolume = 0.25;

    this.musicInterval = null;
    this.musicStep = 0;
    this.musicGain = null;
    this.sfxGain = null;
    this.reverbNode = null;

    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();

      // Master Gains
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.ctx.destination);

      this.createReverb();
      this.isInitialized = true;

      if (this.musicEnabled) {
        this.startMusic();
      }
    } catch (e) {
      console.warn('AudioContext initialization failed or blocked:', e);
    }
  }

  ensureContext() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  createReverb() {
    if (!this.ctx) return;
    const length = this.ctx.sampleRate * 1.5;
    const impulse = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = impulse.getChannelData(c);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = impulse;
    this.reverbNode.connect(this.sfxGain);
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.value = enabled ? this.sfxVolume : 0;
    }
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.value = enabled ? this.musicVolume : 0;
    }
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  // Realistic wooden dice tumble clatter
  playDiceRoll() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bounces = 5;
    let delay = 0;

    for (let i = 0; i < bounces; i++) {
      delay += 0.08 + Math.random() * 0.06;
      const hitTime = now + delay;
      const pitch = 220 + Math.random() * 140;

      // Wooden body resonance
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, hitTime);
      osc.frequency.exponentialRampToValueAtTime(70, hitTime + 0.05);

      gain.gain.setValueAtTime(0.4 / (i + 1), hitTime);
      gain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.06);

      // Noise click for impact edge
      const bufferSize = this.ctx.sampleRate * 0.02;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = (Math.random() * 2 - 1) * (1 - j / bufferSize);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3 / (i + 1), hitTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.02);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(hitTime);
      osc.stop(hitTime + 0.07);
      noise.start(hitTime);
    }
  }

  // Solid wooden token hop impact
  playTokenHop() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Wooden knock
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    // Subtle table knock click
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1200;

    osc.connect(gain);
    gain.connect(this.sfxGain);
    if (this.reverbNode) gain.connect(this.reverbNode);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Ascending wooden ladder step
  playLadderStep(stepIndex = 0) {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreq = 380 + (stepIndex * 40);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.12);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    if (this.reverbNode) gain.connect(this.reverbNode);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Descending serpentine snake slither & hiss
  playSnakeHiss() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 1.2;

    // Filtered noise swoosh
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 4.0;
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + duration);
  }

  // Celebratory victory fanfare
  playVictory() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // C Major Arpeggio Fanfare: C4, E4, G4, C5, E5, G5
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];

    notes.forEach((freq, idx) => {
      const noteTime = now + (idx * 0.14);
      const isLast = idx === notes.length - 1;
      const duration = isLast ? 1.5 : 0.4;

      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, noteTime); // Harmonic overtone

      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.sfxGain);
      if (this.reverbNode) gain.connect(this.reverbNode);

      osc.start(noteTime);
      osc.stop(noteTime + duration);
      osc2.start(noteTime);
      osc2.stop(noteTime + duration);
    });
  }

  // Crisp tactile button click
  playButtonClick() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Subtle acoustic tabletop background music loop
  startMusic() {
    if (this.musicInterval || !this.musicEnabled) return;
    this.ensureContext();

    // Warm pentatonic tabletop notes (Hz)
    const melody = [
      261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00,
      329.63, 392.00, 293.66, 329.63, 261.63, 220.00, 261.63, 293.66
    ];

    this.musicInterval = setInterval(() => {
      if (!this.musicEnabled || !this.ctx || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const freq = melody[this.musicStep % melody.length];
      this.musicStep++;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 1.0);
    }, 650);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}
