/**
 * Web Audio API synthesizer for tactile acoustic feedback on keypresses
 */
class SoundEffects {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    const saved = localStorage.getItem('precision_calc_sound');
    if (saved !== null) {
      this.enabled = saved === 'true';
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    localStorage.setItem('precision_calc_sound', String(val));
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public play(type: 'number' | 'operator' | 'action' | 'equals' | 'clear' | 'error' = 'number') {
    if (!this.enabled) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      let freq = 600;
      let duration = 0.035;
      let peakGain = 0.04;

      switch (type) {
        case 'number':
          freq = 520;
          osc.type = 'sine';
          duration = 0.03;
          peakGain = 0.03;
          break;
        case 'operator':
          freq = 740;
          osc.type = 'triangle';
          duration = 0.04;
          peakGain = 0.04;
          break;
        case 'action':
          freq = 440;
          osc.type = 'sine';
          duration = 0.035;
          peakGain = 0.035;
          break;
        case 'equals':
          freq = 880;
          osc.type = 'triangle';
          duration = 0.06;
          peakGain = 0.05;
          break;
        case 'clear':
          freq = 330;
          osc.type = 'sine';
          duration = 0.045;
          peakGain = 0.04;
          break;
        case 'error':
          freq = 180;
          osc.type = 'sawtooth';
          duration = 0.12;
          peakGain = 0.05;
          break;
      }

      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + duration);

      gain.gain.setValueAtTime(peakGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // AudioContext may be blocked before gesture
    }

    // Trigger physical device haptic vibration if available
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        if (type === 'equals') {
          navigator.vibrate(20);
        } else if (type === 'error') {
          navigator.vibrate([30, 20, 30]);
        } else {
          navigator.vibrate(8);
        }
      }
    } catch {
      // Ignore vibration errors
    }
  }
}

export const soundManager = new SoundEffects();
