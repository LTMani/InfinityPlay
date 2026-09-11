class AudioController {
    constructor() {
        this.enabled = SaveSystem.get().settings.sound;
        
        // We'll use simple AudioContext synths instead of external assets for reliability
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('Web Audio API not supported');
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = SaveSystem.toggleSound();
        return this.enabled;
    }

    playTone(frequency, type, duration, vol = 0.1) {
        if (!this.enabled || !this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playFlip() {
        this.playTone(400, 'sine', 0.1, 0.05);
    }

    playMatch() {
        this.playTone(800, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(1200, 'sine', 0.2, 0.1), 100);
    }

    playMismatch() {
        this.playTone(300, 'square', 0.2, 0.05);
        setTimeout(() => this.playTone(200, 'square', 0.3, 0.05), 100);
    }

    playComplete() {
        this.playTone(400, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(600, 'sine', 0.1, 0.1), 150);
        setTimeout(() => this.playTone(800, 'sine', 0.1, 0.1), 300);
        setTimeout(() => this.playTone(1200, 'sine', 0.4, 0.1), 450);
    }

    playClick() {
        this.playTone(600, 'sine', 0.05, 0.05);
    }
}

const audio = new AudioController();

