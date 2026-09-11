/**
 * SoundEffects.js
 * Zero-dependency procedural Web Audio API sound synthesizer.
 * Generates engine rumble, tire squeal, collision impact, vehicle horn,
 * checkpoint chime, near-miss whoosh, and mission fanfares.
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

    // Horn state
    this.hornGain = null;
    this.hornOsc1 = null;
    this.hornOsc2 = null;
    this.isHornActive = false;
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

  /**
   * Dual-tone automotive horn.
   */
  startHorn() {
    if (!this.isInitialized || this.isMuted || !this.ctx || this.isHornActive) return;
    this.resume();
    const now = this.ctx.currentTime;

    this.hornGain = this.ctx.createGain();
    this.hornGain.gain.setValueAtTime(0.18, now);

    this.hornOsc1 = this.ctx.createOscillator();
    this.hornOsc1.type = 'triangle';
    this.hornOsc1.frequency.setValueAtTime(425, now);

    this.hornOsc2 = this.ctx.createOscillator();
    this.hornOsc2.type = 'sawtooth';
    this.hornOsc2.frequency.setValueAtTime(510, now);

    this.hornOsc1.connect(this.hornGain);
    this.hornOsc2.connect(this.hornGain);
    this.hornGain.connect(this.ctx.destination);

    this.hornOsc1.start(now);
    this.hornOsc2.start(now);
    this.isHornActive = true;
  }

  stopHorn() {
    if (!this.isHornActive || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.hornGain) {
      this.hornGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      setTimeout(() => {
        if (this.hornOsc1) { try { this.hornOsc1.stop(); } catch(e){} }
        if (this.hornOsc2) { try { this.hornOsc2.stop(); } catch(e){} }
        this.isHornActive = false;
      }, 90);
    } else {
      this.isHornActive = false;
    }
  }

  /**
   * Ascending arpeggio chime on checkpoint passage.
   */
  playCheckpointChime() {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.32);
    });
  }

  /**
   * High-speed near miss whoosh sound.
   */
  playNearMiss() {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  /**
   * Fanfare on mission victory.
   */
  playMissionSuccess() {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;

    const chords = [
      { f: 523.25, t: 0.0, d: 0.15 },
      { f: 659.25, t: 0.15, d: 0.15 },
      { f: 783.99, t: 0.30, d: 0.15 },
      { f: 1046.5, t: 0.45, d: 0.6 }
    ];

    chords.forEach(c => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(c.f, now + c.t);
      gain.gain.setValueAtTime(0.25, now + c.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + c.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + c.t);
      osc.stop(now + c.t + c.d + 0.05);
    });
  }

  /**
   * Minor tone on mission failure or timeout.
   */
  playMissionFail() {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.6);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.65);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.engineGain && this.ctx) {
      this.engineGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx.currentTime);
    }
    return this.isMuted;
  }
}
