/**
 * Storage Manager class
 * Handles saving and loading settings and state to localStorage
 */
class StorageManager {
  constructor() {
    this.prefix = 'pomodoro_';
  }

  // Settings
  getDefaultSettings() {
    return {
      workDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      sessionsBeforeLongBreak: 4,
      audioEnabled: true,
      theme: 'professional',
      exercisePreferences: {
        difficulty: 'any',
        excludeFloorExercises: false,
        excludeEquipment: false
      },
      hasSeenWelcome: false
    };
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(
        this.prefix + 'settings',
        JSON.stringify(settings)
      );
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  loadSettings() {
    try {
      const data = localStorage.getItem(this.prefix + 'settings');
      if (data) {
        const settings = JSON.parse(data);
        // Merge with defaults to handle any missing fields
        return { ...this.getDefaultSettings(), ...settings };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return this.getDefaultSettings();
  }

  // Timer State (for resuming after page reload)
  saveTimerState(state) {
    try {
      localStorage.setItem(
        this.prefix + 'timer_state',
        JSON.stringify({
          ...state,
          timestamp: Date.now()
        })
      );
      return true;
    } catch (error) {
      console.error('Error saving timer state:', error);
      return false;
    }
  }

  loadTimerState() {
    try {
      const data = localStorage.getItem(this.prefix + 'timer_state');
      if (data) {
        const state = JSON.parse(data);

        // Only restore state if it's less than 5 minutes old
        const age = Date.now() - state.timestamp;
        if (age < 5 * 60 * 1000) {
          return state;
        }
      }
    } catch (error) {
      console.error('Error loading timer state:', error);
    }
    return null;
  }

  clearTimerState() {
    try {
      localStorage.removeItem(this.prefix + 'timer_state');
    } catch (error) {
      console.error('Error clearing timer state:', error);
    }
  }

  // Welcome Panel
  hasSeenWelcome() {
    try {
      const data = localStorage.getItem(this.prefix + 'hasSeenWelcome');
      return data === 'true';
    } catch (error) {
      console.error('Error checking welcome status:', error);
      return false;
    }
  }

  setWelcomeSeen() {
    try {
      localStorage.setItem(this.prefix + 'hasSeenWelcome', 'true');
      return true;
    } catch (error) {
      console.error('Error setting welcome status:', error);
      return false;
    }
  }

  resetWelcome() {
    try {
      localStorage.removeItem(this.prefix + 'hasSeenWelcome');
      return true;
    } catch (error) {
      console.error('Error resetting welcome status:', error);
      return false;
    }
  }

  // Clear all data
  clearAll() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}
