/**
 * Zombie Survival - Audio Engine
 * High-fidelity Web Audio API procedural sound synthesizer and ambient music generator.
 * Zero external audio dependencies = 0ms latency, zero 404 errors.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.musicEnabled = true;
    this.masterVolume = 0.8;
    this.musicVolume = 0.35;
    this.sfxVolume = 0.7;
    this.musicNode = null;
    this.isMusicPlaying = false;
    this.ambientInterval = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized && this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setSFXEnabled(val) {
    this.sfxEnabled = !!val;
  }

  setMusicEnabled(val) {
    this.musicEnabled = !!val;
    if (!this.musicEnabled) {
      this.stopMusic();
    } else if (!this.isMusicPlaying) {
      this.startMusic();
    }
  }

  // --- PROCEDURAL SFX GENERATION ---

  playShoot(type = 'starter') {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    switch (type) {
      case 'starter': // Crisp energy blaster
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(110, t + 0.12);
        gain.gain.setValueAtTime(0.35 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.12);
        break;

      case 'rapid': // High pitch laser pulse
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(240, t + 0.08);
        gain.gain.setValueAtTime(0.28 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.start(t);
        osc.stop(t + 0.08);
        break;

      case 'pulse': // Punchy tactical rifle burst
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(720, t);
        osc.frequency.exponentialRampToValueAtTime(90, t + 0.14);
        gain.gain.setValueAtTime(0.4 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        osc.start(t);
        osc.stop(t + 0.14);
        break;

      case 'scatter': // Energy shotgun punch + noise
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.22);
        gain.gain.setValueAtTime(0.55 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.start(t);
        osc.stop(t + 0.22);
        this._playNoise(0.18, 0.4 * this.sfxVolume, 400);
        break;

      case 'plasma': // Heavy deep plasma orb
        osc.type = 'square';
        osc.frequency.setValueAtTime(280, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.3);
        gain.gain.setValueAtTime(0.5 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.3);
        break;

      case 'shock': // Electric sizzle
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, t);
        osc.frequency.setValueAtTime(900, t + 0.04);
        osc.frequency.setValueAtTime(1600, t + 0.08);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.18);
        gain.gain.setValueAtTime(0.35 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.start(t);
        osc.stop(t + 0.18);
        break;

      case 'arc': // Arc cannon electric zap
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2200, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.15);
        gain.gain.setValueAtTime(0.3 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.15);
        break;

      case 'burst': // Radial energy burst blast
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.35);
        gain.gain.setValueAtTime(0.6 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.start(t);
        osc.stop(t + 0.35);
        this._playNoise(0.25, 0.45 * this.sfxVolume, 600);
        break;

      case 'freeze': // Cold cryo hiss
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 0.2);
        gain.gain.setValueAtTime(0.3 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
        this._playNoise(0.15, 0.25 * this.sfxVolume, 2500);
        break;

      default:
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(150, t + 0.1);
        gain.gain.setValueAtTime(0.3 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
    }
  }

  playHit(isCrit = false, isShield = false) {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    if (isShield) {
      // Metallic resonant deflecting ping
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, t);
      osc.frequency.exponentialRampToValueAtTime(450, t + 0.12);
      gain.gain.setValueAtTime(0.35 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    } else if (isCrit) {
      // Sharp crunching critical ping
      osc.type = 'square';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.16);
      gain.gain.setValueAtTime(0.45 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    } else {
      // Standard impact thud
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.09);
      gain.gain.setValueAtTime(0.28 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    }

    osc.start(t);
    osc.stop(t + 0.16);
  }

  playZombieDefeat(isBoss = false) {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    if (isBoss) {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.8);
      gain.gain.setValueAtTime(0.6 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      osc.start(t);
      osc.stop(t + 0.8);
      this._playNoise(0.6, 0.5 * this.sfxVolume, 250);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.15);
      gain.gain.setValueAtTime(0.3 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.15);
    }
  }

  playDash() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();
    this._playNoise(0.16, 0.35 * this.sfxVolume, 1200);
  }

  playShield() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(750, t + 0.25);
    gain.gain.setValueAtTime(0.4 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  playEMP() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1500, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.45);
    gain.gain.setValueAtTime(0.5 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.45);
    this._playNoise(0.3, 0.4 * this.sfxVolume, 800);
  }

  playReload() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    // Click 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(800, t);
    gain1.gain.setValueAtTime(0.25 * this.sfxVolume, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(t);
    osc1.stop(t + 0.05);

    // Click 2 (cocking snap)
    setTimeout(() => {
      if (!this.ctx) return;
      const t2 = this.ctx.currentTime;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1200, t2);
      gain2.gain.setValueAtTime(0.3 * this.sfxVolume, t2);
      gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.06);
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start(t2);
      osc2.stop(t2 + 0.06);
    }, 140);
  }

  playPickup(type = 'coin') {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    if (type === 'coin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, t); // B5
      osc.frequency.setValueAtTime(1318.51, t + 0.07); // E6
      gain.gain.setValueAtTime(0.35 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.start(t);
      osc.stop(t + 0.22);
    } else if (type === 'health' || type === 'armor') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.setValueAtTime(659.25, t + 0.08);
      osc.frequency.setValueAtTime(880, t + 0.16);
      gain.gain.setValueAtTime(0.4 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t);
      osc.stop(t + 0.3);
    } else {
      // Ammo / XP
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, t); // D5
      osc.frequency.setValueAtTime(880, t + 0.06); // A5
      gain.gain.setValueAtTime(0.3 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.start(t);
      osc.stop(t + 0.18);
    }
  }

  playWaveStart() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.setValueAtTime(220, t + 0.18);
    osc.frequency.setValueAtTime(330, t + 0.36);
    gain.gain.setValueAtTime(0.45 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.6);
  }

  playBossAlarm() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(650, t);
        osc.frequency.exponentialRampToValueAtTime(320, t + 0.28);
        gain.gain.setValueAtTime(0.45 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.28);
      }, i * 320);
    }
  }

  playLevelComplete() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.38 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.35);
      }, idx * 110);
    });
  }

  playGameOver() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();
    const notes = [440, 415.3, 392, 349.23, 261.63];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.4 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.4);
      }, idx * 160);
    });
  }

  playClick() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);
    gain.gain.setValueAtTime(0.2 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  playUpgrade() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.25);
    gain.gain.setValueAtTime(0.4 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  _playNoise(duration, volume, filterFreq) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq || 1000, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
  }

  // --- PROCEDURAL AMBIENT TENSION MUSIC ---

  startMusic() {
    if (!this.musicEnabled || this.isMusicPlaying || !this.ctx) return;
    this.isMusicPlaying = true;

    // Rhythmic synthesizer pulse generator
    const chords = [
      [55, 110, 164.81], // A1 / A2 / E3
      [49, 98, 146.83],  // G1 / G2 / D3
      [43.65, 87.3, 130.81], // F1 / F2 / C3
      [55, 110, 164.81]
    ];
    let step = 0;

    const tick = () => {
      if (!this.isMusicPlaying || !this.musicEnabled || !this.ctx) return;
      const t = this.ctx.currentTime;
      const chord = chords[step % chords.length];
      step++;

      // Deep sub bass drone
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx === 0 ? 'sine' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(240, t);

        gain.gain.setValueAtTime(0.08 * this.musicVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 1.8);
      });

      // Ambient sci-fi arpeggio note
      if (step % 2 === 0) {
        const arpOsc = this.ctx.createOscillator();
        const arpGain = this.ctx.createGain();
        arpOsc.type = 'sine';
        const arpNotes = [440, 523.25, 659.25, 783.99, 880];
        const randomNote = arpNotes[Math.floor(Math.random() * arpNotes.length)];
        arpOsc.frequency.setValueAtTime(randomNote, t + 0.4);
        arpGain.gain.setValueAtTime(0.05 * this.musicVolume, t + 0.4);
        arpGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

        arpOsc.connect(arpGain);
        arpGain.connect(this.masterGain);
        arpOsc.start(t + 0.4);
        arpOsc.stop(t + 1.2);
      }
    };

    tick();
    this.ambientInterval = setInterval(tick, 1900);
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }
}

// Global Audio Instance
window.Sound = new SoundEngine();

