/**
 * Audio Manager class
 * Handles playing notification sounds
 */
class AudioManager {
  constructor() {
    this.isMuted = false;
    this.audioContext = null;
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  /**
   * Play a simple beep using Web Audio API
   * This creates a beep without needing audio files
   */
  playBeep(frequency = 800, duration = 200) {
    if (this.isMuted) return;

    try {
      // Create audio context if it doesn't exist
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.7, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + duration / 1000
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.error('Error playing beep:', error);
    }
  }

  /**
   * Play a pleasant notification sound (two-tone)
   */
  playNotification() {
    if (this.isMuted) return;

    // Play a pleasant two-tone chime
    this.playBeep(800, 150);
    setTimeout(() => this.playBeep(600, 150), 100);
  }

  /**
   * Play work complete sound (encouraging, upbeat)
   */
  playWorkComplete() {
    if (this.isMuted) return;

    // Play an ascending three-tone chime
    this.playBeep(523, 120); // C
    setTimeout(() => this.playBeep(659, 120), 100); // E
    setTimeout(() => this.playBeep(784, 200), 200); // G
  }

  /**
   * Play break complete sound (gentle, back to work)
   */
  playBreakComplete() {
    if (this.isMuted) return;

    // Play a simple two-tone
    this.playBeep(600, 150);
    setTimeout(() => this.playBeep(500, 150), 120);
  }

  /**
   * Load and play an audio file (for future use)
   */
  playSound(audioUrl) {
    if (this.isMuted) return;

    try {
      const audio = new Audio(audioUrl);
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  }
}
