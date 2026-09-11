/**
 * InfinityPlay - City Builder Procedural Audio Synthesizer (V2)
 * Rich Web Audio API sound effects for city building, military combat,
 * defense cannons, arrow volleys, energy beams, resource harvests, and fanfares.
 */

(function(exports) {
  'use strict';

  class CityAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
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
      this.init(); this.resume();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.035);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    }

    playPlace() {
      if (!this.enabled) return;
      this.init(); this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Heavy stone impact
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.16);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);

      // Thud rattle
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(540, now);
      osc2.frequency.exponentialRampToValueAtTime(180, now + 0.07);

      gain2.gain.setValueAtTime(0.18, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.07);
    }

    playWall() {
      if (!this.enabled) return;
      this.init(); this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }

    playHammer() {
      if (!this.enabled) return;
      this.init(); this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }

    playCoin() {
      if (!this.enabled) return;
      this.init(); this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Bell 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, now); // C6
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.2);

      // Bell 2
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.06); // E6
      gain2.gain.setValueAtTime(0.2, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.32);
    }

    playResourceCollect() {
      if (!this.enabled) return;
      this.init(); this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Arpeggio glissando: G5 -> C6 -> E6 -> G6
      const freqs = [783.99, 1046.5, 1318.51, 1567.98];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    }

    playGem() {
      if (!this.enabled) return;
      this.init(); this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.045;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.14, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      });
    }

    playUpgrade() {
      if (!this.enabled) return;
      this.init(); this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Triumphant fanfare
      const notes = [261.63, 392.00, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.6);
      });
    }

    playArrow() {
      if (!this.enabled) return;
      this.init(); this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.06);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }

    playCannon() {
      if (!this.enabled) return;
      this.init(); this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Deep rumble boom
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.28);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }

    playLaser() {
      if (!this.enabled) return;
      this.init(); this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.15);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }

    playVictory() {
      if (!this.enabled) return;
      this.init(); this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Trumpet fanfare chord: C4, G4, C5, E5, G5, C6
      const fanfare = [
        { f: 523.25, t: 0 },
        { f: 659.25, t: 0.12 },
        { f: 783.99, t: 0.24 },
        { f: 1046.5, t: 0.4 }
      ];

      fanfare.forEach(item => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + item.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, t);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.7);
      });
    }

    playDefeat() {
      if (!this.enabled) return;
      this.init(); this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [329.63, 293.66, 261.63, 220.0];
      notes.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.2;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.45);
      });
    }

    playError() {
      if (!this.enabled) return;
      this.init(); this.resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(130, now + 0.08);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  }

  exports.CityAudio = CityAudio;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.CityAudio = {}));
