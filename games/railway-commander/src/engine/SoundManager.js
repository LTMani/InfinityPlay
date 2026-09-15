/**
 * Railway Commander - Web Audio API Synthesizer & Sound Manager
 * Generates realistic train engine RPM hum, track click-clack, pneumatic air brakes,
 * locomotive horn chords, station chimes, and alarms without external audio file dependencies.
 */

export class SoundManager {
  constructor(saveManager) {
    this.saveManager = saveManager;
    this.soundEnabled = true;
    this.musicEnabled = true;

    if (saveManager && saveManager.settings) {
      this.soundEnabled = saveManager.settings.sound !== false;
      this.musicEnabled = saveManager.settings.music !== false;
    }

    this.ctx = null;
    this.masterGain = null;

    // Continuous Sound Nodes
    this.engineOsc1 = null;
    this.engineOsc2 = null;
    this.engineFilter = null;
    this.engineGain = null;
    this.engineRunning = false;

    // Track click-clack timing
    this.lastWheelClickDistance = 0;
    this.wheelClickInterval = 28; // Rail joints every 28 meters
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.soundEnabled ? 1.0 : 0.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('SoundManager: AudioContext could not be created', e);
    }
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.soundEnabled ? 1.0 : 0.0, this.ctx.currentTime);
    }
    if (this.saveManager) {
      this.saveManager.saveSettings({ sound: this.soundEnabled });
    }
    return this.soundEnabled;
  }

  /**
   * Start or update continuous locomotive engine sound
   * Modulates WAP-7 3-phase electric traction motor whine & rumble with throttle and speed
   */
  updateEngineSound(throttleInput, speedKmh) {
    if (!this.soundEnabled) {
      this.stopEngineSound();
      return;
    }
    this.resume();
    if (!this.ctx) return;

    const throttlePercent = typeof throttleInput === 'number' && throttleInput > 5 ? throttleInput : (throttleInput || 0) * 20;

    if (!this.engineRunning) {
      try {
        const now = this.ctx.currentTime;
        this.engineGain = this.ctx.createGain();
        this.engineGain.gain.setValueAtTime(0.01, now);
        this.engineGain.gain.exponentialRampToValueAtTime(0.22, now + 0.3);

        this.engineFilter = this.ctx.createBiquadFilter();
        this.engineFilter.type = 'lowpass';
        this.engineFilter.frequency.setValueAtTime(300, now);

        // Low rumble oscillator (blower / transformer hum)
        this.engineOsc1 = this.ctx.createOscillator();
        this.engineOsc1.type = 'sawtooth';
        this.engineOsc1.frequency.setValueAtTime(50, now); // 50 Hz mains traction hum

        // Sub-harmonic traction hum
        this.engineOsc2 = this.ctx.createOscillator();
        this.engineOsc2.type = 'triangle';
        this.engineOsc2.frequency.setValueAtTime(100, now);

        // High-frequency 3-phase electric traction motor whine (IGBT inverter)
        this.engineOsc3 = this.ctx.createOscillator();
        this.engineOsc3.type = 'sine';
        this.engineOsc3.frequency.setValueAtTime(450, now);

        this.engineOsc1.connect(this.engineFilter);
        this.engineOsc2.connect(this.engineFilter);
        this.engineOsc3.connect(this.engineFilter);
        this.engineFilter.connect(this.engineGain);
        this.engineGain.connect(this.masterGain);

        this.engineOsc1.start();
        this.engineOsc2.start();
        this.engineOsc3.start();
        this.engineRunning = true;
      } catch (e) {
        return;
      }
    }

    if (this.engineRunning && this.engineOsc1 && this.engineFilter && this.engineGain) {
      const now = this.ctx.currentTime;
      const speedRatio = Math.min(1.0, speedKmh / 140);
      const throttleRatio = throttlePercent / 100;

      // Transformer hum scales slightly (50 Hz to 90 Hz)
      const humFreq = 50 + (throttleRatio * 35) + (speedRatio * 15);
      // IGBT Traction motor whine climbs high with speed (350 Hz idle -> 1400 Hz at high speed)
      const inverterFreq = 380 + (throttleRatio * 320) + (speedRatio * 750);
      const filterCutoff = 350 + (throttleRatio * 450) + (speedRatio * 650);
      const volume = 0.12 + (throttleRatio * 0.16) + (speedRatio * 0.10);

      this.engineOsc1.frequency.setTargetAtTime(humFreq, now, 0.15);
      this.engineOsc2.frequency.setTargetAtTime(humFreq * 2, now, 0.15);
      if (this.engineOsc3) {
        this.engineOsc3.frequency.setTargetAtTime(inverterFreq, now, 0.15);
      }
      this.engineFilter.frequency.setTargetAtTime(filterCutoff, now, 0.15);
      this.engineGain.gain.setTargetAtTime(volume, now, 0.15);
    }
  }

  stopEngineSound() {
    if (this.engineRunning && this.engineGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.engineGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        setTimeout(() => {
          if (this.engineOsc1) { this.engineOsc1.stop(); this.engineOsc1.disconnect(); this.engineOsc1 = null; }
          if (this.engineOsc2) { this.engineOsc2.stop(); this.engineOsc2.disconnect(); this.engineOsc2 = null; }
          if (this.engineOsc3) { this.engineOsc3.stop(); this.engineOsc3.disconnect(); this.engineOsc3 = null; }
          this.engineRunning = false;
        }, 250);
      } catch (e) {
        this.engineRunning = false;
      }
    }
  }

  /**
   * Periodic rail joint click-clack
   */
  updateWheelJoints(currentPositionMeters, speedKmh) {
    if (!this.soundEnabled || speedKmh < 10) return;

    if (currentPositionMeters - this.lastWheelClickDistance >= this.wheelClickInterval) {
      this.lastWheelClickDistance = currentPositionMeters;
      this.playRailClickClack(speedKmh);
    }
  }

  playRailClickClack(speedKmh) {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    try {
      const now = this.ctx.currentTime;
      const vol = Math.min(0.24, 0.06 + (speedKmh / 140) * 0.18);

      // Strike 1
      this.createClickImpulse(now, vol);
      // Strike 2 (clack) slightly delayed
      const delay = Math.max(0.04, 0.14 - (speedKmh / 140) * 0.07);
      this.createClickImpulse(now + delay, vol * 0.85);
    } catch (e) {}
  }

  createClickImpulse(time, volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(380, time);
    filter.Q.setValueAtTime(3, time);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, time);
    osc.frequency.exponentialRampToValueAtTime(60, time + 0.045);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  /**
   * Authentic Indian Railways RDSO Twin-Tone Electric Locomotive Air Horn (WAP-7)
   */
  playHorn(active = true) {
    if (!active) {
      if (this.hornGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.hornGain.gain.setTargetAtTime(0.001, now, 0.12);
        setTimeout(() => {
          if (this.hornOsc1) { this.hornOsc1.stop(); this.hornOsc1.disconnect(); this.hornOsc1 = null; }
          if (this.hornOsc2) { this.hornOsc2.stop(); this.hornOsc2.disconnect(); this.hornOsc2 = null; }
          if (this.hornOsc3) { this.hornOsc3.stop(); this.hornOsc3.disconnect(); this.hornOsc3 = null; }
          this.hornGain = null;
        }, 150);
      }
      return;
    }

    this.resume();
    if (!this.ctx || !this.soundEnabled || this.hornGain) return;

    try {
      const now = this.ctx.currentTime;
      this.hornGain = this.ctx.createGain();
      this.hornGain.gain.setValueAtTime(0.001, now);
      this.hornGain.gain.exponentialRampToValueAtTime(0.42, now + 0.05);

      // Indian Railways dual air-horn tuning:
      // High chime: 494 Hz (B4) + 370 Hz (F#4) + 554 Hz (C#5)
      this.hornOsc1 = this.ctx.createOscillator();
      this.hornOsc1.type = 'sawtooth';
      this.hornOsc1.frequency.setValueAtTime(370.00, now); // F#4

      this.hornOsc2 = this.ctx.createOscillator();
      this.hornOsc2.type = 'sawtooth';
      this.hornOsc2.frequency.setValueAtTime(493.88, now); // B4

      this.hornOsc3 = this.ctx.createOscillator();
      this.hornOsc3.type = 'sawtooth';
      this.hornOsc3.frequency.setValueAtTime(554.37, now); // C#5

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);

      this.hornOsc1.connect(filter);
      this.hornOsc2.connect(filter);
      this.hornOsc3.connect(filter);
      filter.connect(this.hornGain);
      this.hornGain.connect(this.masterGain);

      this.hornOsc1.start(now);
      this.hornOsc2.start(now);
      this.hornOsc3.start(now);
    } catch (e) {}
  }

  /**
   * Pneumatic Air Brake Dump / Release Hiss
   */
  playAirBrakeHiss(isEmergency = false) {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;

    try {
      const now = this.ctx.currentTime;
      const duration = isEmergency ? 1.5 : 0.65;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate pink/white noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(isEmergency ? 1600 : 1200, now);
      filter.Q.setValueAtTime(1.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(isEmergency ? 0.38 : 0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {}
  }

  /**
   * Authentic Indian Railways Iconic 4-Note Station Announcement Chime
   * Notes: C5 (523.25 Hz) -> G4 (392.00 Hz) -> G#4 (415.30 Hz) -> C5 (523.25 Hz)
   */
  playStationChime() {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 392.00, 415.30, 523.25];
      const durations = [0.28, 0.28, 0.28, 0.45];

      let t = now;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + durations[idx] + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + durations[idx] + 0.4);
        t += durations[idx];
      });
    } catch (e) {}
  }

  /**
   * Passenger Doors Open/Close Sound with Warning Beeps & Pneumatic Piston
   */
  playDoorSound(isOpen) {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    try {
      const now = this.ctx.currentTime;
      // 2 warning beeps
      [0, 0.22].forEach(offset => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(isOpen ? 880 : 660, now + offset);
        gain.gain.setValueAtTime(0.2, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.13);
      });
      // Pneumatic door hiss
      this.playAirBrakeHiss(false);
    } catch (e) {}
  }

  /**
   * Pantograph Raise/Lower Contact Spark Crackle
   */
  playPantographSpark() {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  /**
   * Overspeed / Red Signal Proximity Warning Buzzer
   */
  playWarningBeep() {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  }

  /**
   * Mission Complete Fanfare
   */
  playVictoryFanfare() {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    try {
      const now = this.ctx.currentTime;
      const arpeggio = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      arpeggio.forEach((freq, idx) => {
        const t = now + (idx * 0.14);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.65);
      });
    } catch (e) {}
  }

  /**
   * Mission Failure Descending Tone
   */
  playFailureSound() {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.8);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch (e) {}
  }

  playClick() {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {}
  }
}
