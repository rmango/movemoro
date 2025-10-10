/**
 * Audio Manager class
 * Handles playing notification sounds
 */
class AudioManager {
  constructor() {
    this.isMuted = false;
    this.audioContext = null;
    this.notificationPermission = 'default';
    this.permissionRequested = false;
    this.setupVisibilityHandler();
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  /**
   * Request notification permission for background alerts
   */
  async requestNotificationPermission() {
    if ('Notification' in window) {
      try {
        // Check current permission first
        if (Notification.permission === 'granted') {
          this.notificationPermission = 'granted';
        } else if (Notification.permission === 'denied') {
          this.notificationPermission = 'denied';
        } else {
          // Only request if not already decided
          this.notificationPermission = await Notification.requestPermission();
        }
      } catch (error) {
        console.log('Notification permission error:', error);
      }
    }
  }

  /**
   * Show browser notification (works even in background)
   */
  showNotification(title, body, soundType = 'default') {
    if (this.isMuted) return;

    // Always play Web Audio API beeps (works in foreground and background)
    if (soundType === 'workComplete') {
      // Play an ascending three-tone chime
      this.playBeep(523, 120); // C
      setTimeout(() => this.playBeep(659, 120), 100); // E
      setTimeout(() => this.playBeep(784, 200), 200); // G
    } else if (soundType === 'breakComplete') {
      // Play a simple two-tone
      this.playBeep(600, 150);
      setTimeout(() => this.playBeep(500, 150), 120);
    } else {
      // Default two-tone notification
      this.playBeep(800, 150);
      setTimeout(() => this.playBeep(600, 150), 100);
    }

    if ('Notification' in window) {
      // Always check current permission state
      const currentPermission = Notification.permission;

      if (currentPermission === 'granted') {
        try {
          const notification = new Notification(title, {
            body: body,
            requireInteraction: false,
            silent: true  // We handle sound separately
          });

          // Auto-close after 4 seconds
          setTimeout(() => notification.close(), 4000);

          // Focus window when notification is clicked
          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        } catch (error) {
          console.error('Error showing notification:', error);
        }
      } else if (currentPermission === 'default') {
        // Try to request permission again
        this.requestNotificationPermission();
      }
    }
  }

  /**
   * Play notification sound using Audio element (works in background)
   */
  playNotificationSound(soundType = 'default') {
    try {
      // Different beep patterns for different notification types
      const beepSound = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZURE';

      if (soundType === 'workComplete') {
        // Play three beeps for work complete with longer delays
        const audio1 = new Audio(beepSound);
        audio1.volume = 0.7;
        audio1.play().catch(err => console.error('Error playing sound 1:', err));

        setTimeout(() => {
          const audio2 = new Audio(beepSound);
          audio2.volume = 0.8;
          audio2.play().catch(err => console.error('Error playing sound 2:', err));
        }, 200);

        setTimeout(() => {
          const audio3 = new Audio(beepSound);
          audio3.volume = 0.9;
          audio3.play().catch(err => console.error('Error playing sound 3:', err));
        }, 400);
      } else if (soundType === 'breakComplete') {
        // Play two beeps for break complete
        const audio1 = new Audio(beepSound);
        audio1.volume = 0.7;
        audio1.play().catch(err => console.error('Error playing sound 1:', err));

        setTimeout(() => {
          const audio2 = new Audio(beepSound);
          audio2.volume = 0.6;
          audio2.play().catch(err => console.error('Error playing sound 2:', err));
        }, 200);
      } else {
        // Default single beep
        const audio = new Audio(beepSound);
        audio.volume = 0.7;
        audio.play().catch(err => console.error('Error playing sound:', err));
      }
    } catch (error) {
      console.error('Error creating notification audio:', error);
    }
  }

  /**
   * Setup handler to resume audio context when page becomes visible
   */
  setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    });
  }

  /**
   * Play a simple beep using Web Audio API
   * This creates a beep without needing audio files
   */
  async playBeep(frequency = 800, duration = 200) {
    if (this.isMuted) return;

    try {
      // Create audio context if it doesn't exist
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      // Resume audio context if suspended (e.g., page was in background)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
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

    // If page is hidden, show browser notification instead
    if (document.hidden) {
      this.showNotification('Movemoro', 'Time to check in!');
    } else {
      // Play beep for foreground (richer sound)
      this.playBeep(800, 150);
      setTimeout(() => this.playBeep(600, 150), 100);
    }
  }

  /**
   * Play work complete sound (encouraging, upbeat)
   */
  playWorkComplete() {
    if (this.isMuted) return;

    // Always show notification with sound
    this.showNotification('Work Session Complete! 🎉', 'Time for a quick exercise to unlock your break!', 'workComplete');
  }

  /**
   * Play break complete sound (gentle, back to work)
   */
  playBreakComplete() {
    if (this.isMuted) return;

    // Always show notification with sound
    this.showNotification('Break Complete! ⏰', 'Ready to get back to work?', 'breakComplete');
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
