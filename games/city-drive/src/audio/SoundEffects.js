/**
 * SoundEffects.js
 * Zero-dependency procedural Web Audio API sound synthesizer.
 * Generates engine rumble, tire squeal, and collision impact sounds.
 */

export class SoundEffects {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isInitialized = false;

    // Engine oscillator nodes
    this.engineOsc1 = null;
    this.engineOsc2 = null;
    this.engineGain = null;
    this.engineFilter = null;

    // Screech noise nodes
    this.screechGain = null;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();

      // 1. Engine sound synthesizer
      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.01, this.ctx.currentTime);

      this.engineFilter = this.ctx.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(350, this.ctx.currentTime);

      this.engineOsc1 = this.ctx.createOscillator();
      this.engineOsc1.type = 'sawtooth';
      this.engineOsc1.frequency.setValueAtTime(45, this.ctx.currentTime);

      this.engineOsc2 = this.ctx.createOscillator();
      this.engineOsc2.type = 'triangle';
      this.engineOsc2.frequency.setValueAtTime(90, this.ctx.currentTime);

      this.engineOsc1.connect(this.engineFilter);
      this.engineOsc2.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.engineOsc1.start();
      this.engineOsc2.start();

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio init failed:', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Updates engine pitch and volume based on vehicle telemetry.
   */
  update(speedKmh, throttle) {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;

    const baseFreq = 42;
    const speedRatio = Math.min(1.0, speedKmh / 140);
    const targetFreq = baseFreq + speedRatio * 180 + Math.abs(throttle) * 35;
    const filterFreq = 300 + speedRatio * 1200 + Math.abs(throttle) * 600;

    const now = this.ctx.currentTime;
    this.engineOsc1.frequency.setTargetAtTime(targetFreq, now, 0.08);
    this.engineOsc2.frequency.setTargetAtTime(targetFreq * 2.01, now, 0.08);
    this.engineFilter.frequency.setTargetAtTime(filterFreq, now, 0.08);

    const targetGain = 0.04 + speedRatio * 0.08 + Math.abs(throttle) * 0.05;
    this.engineGain.gain.setTargetAtTime(targetGain, now, 0.08);
  }

  /**
   * Collision impact sound with low-frequency thump and noise burst.
   */
  playCollision() {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;

    // Low boom oscillator
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(140, now);
    boomOsc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

    boomGain.gain.setValueAtTime(0.4, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    boomOsc.connect(boomGain);
    boomGain.connect(this.ctx.destination);

    boomOsc.start(now);
    boomOsc.stop(now + 0.35);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.engineGain && this.ctx) {
      this.engineGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx.currentTime);
    }
    return this.isMuted;
  }
}

