/**
 * Main Application
 */
class PomodoroApp {
  constructor() {
    // Initialize managers
    this.storage = new StorageManager();
    this.audio = new AudioManager();
    this.exerciseManager = new ExerciseManager();
    this.themeManager = new ThemeManager();

    // Load settings
    this.settings = this.storage.loadSettings();
    this.audio.setMuted(!this.settings.audioEnabled);
    this.themeManager.setTheme(this.settings.theme || 'professional');

    // Timer state
    this.currentMode = 'work'; // 'work', 'break', 'longBreak'
    this.sessionCount = 0;
    this.selectedExercise = null;
    this.selectedExtensionExercise = null;
    this.breakExtensionShown = false;
    this.timer = null;

    // DOM elements
    this.elements = {
      timerDisplay: document.getElementById('timerDisplay'),
      timerTime: document.querySelector('.timer-time'),
      modeDisplay: document.getElementById('modeDisplay'),
      sessionCounter: document.getElementById('sessionCounter'),
      playPauseBtn: document.getElementById('playPauseBtn'),
      playIcon: document.querySelector('.play-icon'),
      pauseIcon: document.querySelector('.pause-icon'),
      resetBtn: document.getElementById('resetBtn'),
      skipBtn: document.getElementById('skipBtn'),
      helpBtn: document.getElementById('helpBtn'),
      progressCircle: document.querySelector('.progress-ring-circle'),
      welcomePanel: document.getElementById('welcomePanel'),
      welcomeStartBtn: document.getElementById('welcomeStartBtn'),
      welcomeSkipBtn: document.getElementById('welcomeSkipBtn'),
      welcomeCloseBtn: document.getElementById('welcomeCloseBtn'),
      exerciseModal: document.getElementById('exerciseModal'),
      exerciseCards: document.getElementById('exerciseCards'),
      regenerateBtn: document.getElementById('regenerateBtn'),
      confirmBtn: document.getElementById('confirmBtn'),
      settingsBtn: document.getElementById('settingsBtn'),
      settingsModal: document.getElementById('settingsModal'),
      closeSettingsBtn: document.getElementById('closeSettingsBtn'),
      saveSettingsBtn: document.getElementById('saveSettingsBtn'),
      workDuration: document.getElementById('workDuration'),
      breakDuration: document.getElementById('breakDuration'),
      longBreakDuration: document.getElementById('longBreakDuration'),
      sessionsBeforeLongBreak: document.getElementById('sessionsBeforeLongBreak'),
      audioEnabled: document.getElementById('audioEnabled'),
      themeSelect: document.getElementById('themeSelect'),
      breakExtensionPanel: document.getElementById('breakExtensionPanel'),
      extensionForm: document.getElementById('extensionForm'),
      extensionExercises: document.getElementById('extensionExercises'),
      confirmExtensionBtn: document.getElementById('confirmExtensionBtn'),
      skipExtensionBtn: document.getElementById('skipExtensionBtn'),
      closeExtensionBtn: document.getElementById('closeExtensionBtn'),
      successMessage: document.getElementById('successMessage'),
      rewardBadge: document.getElementById('rewardBadge'),
      timeBefore: document.getElementById('timeBefore'),
      timeAfter: document.getElementById('timeAfter'),
      exerciseDifficulty: document.getElementById('exerciseDifficulty'),
      excludeFloorExercises: document.getElementById('excludeFloorExercises'),
      excludeEquipment: document.getElementById('excludeEquipment'),
      fullscreenBtn: document.getElementById('fullscreenBtn'),
      fullscreenIcon: document.querySelector('.fullscreen-icon'),
      exitFullscreenIcon: document.querySelector('.exit-fullscreen-icon')
    };

    this.progressCircleRadius = 130; // Should match SVG circle radius
    this.progressCircleCircumference = 2 * Math.PI * this.progressCircleRadius;

    // Set initial stroke dasharray for progress ring
    if (this.elements.progressCircle) {
      this.elements.progressCircle.style.strokeDasharray = this.progressCircleCircumference;
      this.elements.progressCircle.style.strokeDashoffset = 0;
    }

    // Initialize
    this.init();
  }

  async init() {
    // Load exercises
    await this.exerciseManager.loadExercises();
    this.exerciseManager.loadHistory();

    // Set exercise preferences
    this.exerciseManager.setPreferences(this.settings.exercisePreferences);

    // Create timer
    this.createTimer();

    // Setup event listeners
    this.setupEventListeners();

    // Update UI
    this.updateDisplay();
    this.updateSessionCounter();
    this.loadSettingsToForm();

    // Show welcome panel for first-time users
    this.checkWelcomePanel();
  }

  createTimer() {
    const duration = this.getDurationForMode() * 60; // Convert to seconds
    this.timer = new Timer(
      duration,
      (remaining) => this.onTimerTick(remaining),
      () => this.onTimerComplete()
    );
  }

  getDurationForMode() {
    switch (this.currentMode) {
      case 'work':
        return this.settings.workDuration;
      case 'break':
        return this.settings.breakDuration;
      case 'longBreak':
        return this.settings.longBreakDuration;
      default:
        return this.settings.workDuration;
    }
  }

  setupEventListeners() {
    // Timer controls
    this.elements.playPauseBtn.addEventListener('click', () => this.toggleTimer());
    this.elements.resetBtn.addEventListener('click', () => this.resetTimer());
    this.elements.skipBtn.addEventListener('click', () => this.skipTimer());

    // Exercise modal
    this.elements.regenerateBtn.addEventListener('click', () => this.regenerateExercises());
    this.elements.confirmBtn.addEventListener('click', () => this.confirmExercise());

    // Settings
    this.elements.settingsBtn.addEventListener('click', () => this.openSettings());
    this.elements.closeSettingsBtn.addEventListener('click', () => this.closeSettings());

    // Auto-save settings on change
    this.elements.workDuration.addEventListener('change', () => this.autoSaveSettings());
    this.elements.breakDuration.addEventListener('change', () => this.autoSaveSettings());
    this.elements.longBreakDuration.addEventListener('change', () => this.autoSaveSettings());
    this.elements.sessionsBeforeLongBreak.addEventListener('change', () => this.autoSaveSettings());
    this.elements.audioEnabled.addEventListener('change', () => this.autoSaveSettings());
    this.elements.themeSelect.addEventListener('change', () => this.autoSaveSettings());
    this.elements.exerciseDifficulty.addEventListener('change', () => this.autoSaveSettings());
    this.elements.excludeFloorExercises.addEventListener('change', () => this.autoSaveSettings());
    this.elements.excludeEquipment.addEventListener('change', () => this.autoSaveSettings());

    // Break extension
    this.elements.confirmExtensionBtn.addEventListener('click', () => this.confirmExtensionExercise());
    this.elements.skipExtensionBtn.addEventListener('click', () => this.skipBreakExtension());
    this.elements.closeExtensionBtn.addEventListener('click', () => this.skipBreakExtension());

    // Welcome panel
    this.elements.welcomeStartBtn.addEventListener('click', () => this.startFromWelcome());
    this.elements.welcomeSkipBtn.addEventListener('click', () => this.closeWelcomePanel());
    this.elements.welcomeCloseBtn.addEventListener('click', () => this.closeWelcomePanel());
    this.elements.helpBtn.addEventListener('click', () => this.showWelcomePanel());

    // Fullscreen
    this.elements.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    document.addEventListener('fullscreenchange', () => this.updateFullscreenButton());

    // Close modal on outside click
    this.elements.exerciseModal.addEventListener('click', (e) => {
      if (e.target === this.elements.exerciseModal) {
        // Don't allow closing exercise modal by clicking outside
        // User must complete exercise
      }
    });

    this.elements.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.elements.settingsModal) {
        this.closeSettings();
      }
    });
  }

  toggleTimer() {
    if (this.timer.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    // Initialize audio context on first user interaction (required by browsers)
    if (!this.audio.audioContext && this.settings.audioEnabled) {
      this.audio.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Request notification permission on first timer start (user interaction required)
    if (!this.audio.permissionRequested && this.settings.audioEnabled) {
      this.audio.requestNotificationPermission();
      this.audio.permissionRequested = true;
    }

    // Hide break extension panel when starting a work session
    if (this.currentMode === 'work' && this.elements.breakExtensionPanel) {
      this.elements.breakExtensionPanel.classList.remove('active');
    }

    this.timer.start();
    this.updatePlayPauseButton(true);
  }

  pauseTimer() {
    this.timer.pause();
    this.updatePlayPauseButton(false);
  }

  updatePlayPauseButton(isRunning) {
    if (isRunning) {
      this.elements.playIcon.style.display = 'none';
      this.elements.pauseIcon.style.display = 'block';
      this.elements.playPauseBtn.setAttribute('aria-label', 'Pause');
    } else {
      this.elements.playIcon.style.display = 'block';
      this.elements.pauseIcon.style.display = 'none';
      this.elements.playPauseBtn.setAttribute('aria-label', 'Start');
    }
  }

  resetTimer() {
    // Recreate timer with current settings (in case settings changed)
    this.createTimer();
    this.updatePlayPauseButton(false);
    this.updateDisplay();
    this.updateProgressRing();
  }

  skipTimer() {
    // Stop the current timer
    this.timer.pause();

    // Trigger the completion handler
    this.onTimerComplete();
  }

  onTimerTick(remaining) {
    this.updateDisplay();
    this.updateProgressRing();

    // Add warning class when time is running low
    const minutes = Math.floor(remaining / 60);
    if (minutes === 0 && remaining <= 60) {
      this.elements.timerDisplay.classList.add('danger');
    } else if (minutes <= 2) {
      this.elements.timerDisplay.classList.add('warning');
      this.elements.timerDisplay.classList.remove('danger');
    } else {
      this.elements.timerDisplay.classList.remove('warning', 'danger');
    }
  }

  onTimerComplete() {
    this.updatePlayPauseButton(false);
    this.elements.timerDisplay.classList.remove('warning', 'danger');

    if (this.currentMode === 'work') {
      // Work session complete - show exercise modal
      this.audio.playWorkComplete();
      this.showExerciseModal();

      // Track work session completion
      if (window.umami) {
        umami.track('work-session-complete', { duration: this.settings.workDuration });
      }
    } else {
      // Break complete
      this.audio.playBreakComplete();

      this.sessionCount++;
      this.updateSessionCounter();
      this.switchMode('work');

      // Track break session completion
      if (window.umami) {
        const breakType = this.currentMode === 'longBreak' ? 'long' : 'short';
        umami.track('break-session-complete', { type: breakType });
      }

      // Keep break extension panel visible - it will be hidden when work session starts
    }
  }

  showExerciseModal() {
    const exercises = this.exerciseManager.selectSnackExercises();
    this.renderExerciseCards(exercises);
    this.elements.exerciseModal.classList.add('active');
    this.themeManager.updateExercisePrompt();
    this.selectedExercise = null;
    this.elements.confirmBtn.disabled = true;
  }

  renderExerciseCards(exercises) {
    this.elements.exerciseCards.innerHTML = exercises.map((exercise, index) => `
      <div class="exercise-card" data-exercise-id="${exercise.id}">
        <div class="exercise-card-header">
          <span class="exercise-badge ${exercise.environment}">${exercise.environment}</span>
        </div>
        <h3 class="exercise-name">${exercise.name}</h3>
        <div class="exercise-meta">
          <span class="exercise-difficulty ${exercise.difficulty}">${exercise.difficulty}</span>
          <span>~${exercise.duration}s</span>
        </div>
        <p class="exercise-instructions">${exercise.instructions}</p>
      </div>
    `).join('');

    // Add click handlers to cards
    this.elements.exerciseCards.querySelectorAll('.exercise-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const exerciseId = card.dataset.exerciseId;
        const exercise = exercises.find(ex => ex.id === exerciseId);
        this.selectExercise(exercise);

        // Update UI
        this.elements.exerciseCards.querySelectorAll('.exercise-card').forEach(c => {
          c.classList.remove('selected');
        });
        card.classList.add('selected');
      });
    });
  }

  regenerateExercises() {
    const exercises = this.exerciseManager.selectSnackExercises();
    this.renderExerciseCards(exercises);
    this.selectedExercise = null;
    this.elements.confirmBtn.disabled = true;
  }

  selectExercise(exercise) {
    this.selectedExercise = exercise;
    this.elements.confirmBtn.disabled = false;
  }

  confirmExercise() {
    if (!this.selectedExercise) return;

    // Record completion
    this.exerciseManager.recordCompletion(this.selectedExercise);

    // Track exercise selection
    if (window.umami) {
      umami.track('exercise-selected', {
        name: this.selectedExercise.name,
        category: this.selectedExercise.category,
        difficulty: this.selectedExercise.difficulty,
        environment: this.selectedExercise.environment
      });
    }

    // Close modal
    this.elements.exerciseModal.classList.remove('active');

    // Determine next mode (break or long break)
    const isLongBreak = this.sessionCount > 0 && (this.sessionCount + 1) % this.settings.sessionsBeforeLongBreak === 0;
    const breakMode = isLongBreak ? 'longBreak' : 'break';

    // Store the break mode so we can restore it if user extends after timer ends
    this.lastBreakMode = breakMode;

    this.switchMode(breakMode);

    // Track break start
    const breakDuration = isLongBreak ? this.settings.longBreakDuration : this.settings.breakDuration;
    this.currentBreakStartDuration = breakDuration;

    // Reset break extension flag
    this.breakExtensionShown = false;

    // Auto-start break
    this.startTimer();

    // Show break extension panel after a short delay
    setTimeout(() => {
      if (this.currentMode === 'break' || this.currentMode === 'longBreak') {
        this.showBreakExtensionPanel();
      }
    }, 2000); // Show after 2 seconds into the break
  }

  switchMode(mode, hideExtensionPanel = false) {
    this.currentMode = mode;

    // Hide break extension panel only when explicitly requested
    if (hideExtensionPanel && this.elements.breakExtensionPanel) {
      this.elements.breakExtensionPanel.classList.remove('active');
    }

    // Update mode display
    const modeText = {
      'work': 'Work Session',
      'break': 'Short Break',
      'longBreak': 'Long Break'
    };
    this.elements.modeDisplay.textContent = modeText[mode];

    // Create new timer with appropriate duration
    this.createTimer();
    this.updateDisplay();
    this.updateProgressRing();

    // Reset button states
    this.updatePlayPauseButton(false);
  }

  updateDisplay() {
    const remaining = this.timer.getRemaining();
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    this.elements.timerDisplay.textContent =
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  updateProgressRing() {
    const progress = this.timer.getProgress();
    const offset = this.progressCircleCircumference * (1 - progress);
    this.elements.progressCircle.style.strokeDashoffset = offset;
  }

  updateSessionCounter() {
    const currentInCycle = (this.sessionCount % this.settings.sessionsBeforeLongBreak) + 1;
    this.elements.sessionCounter.textContent =
      `Session ${currentInCycle} of ${this.settings.sessionsBeforeLongBreak}`;

    // Update progress dots
    this.updateProgressDots();
  }

  updateProgressDots() {
    const progressContainer = document.getElementById('sessionProgress');
    if (!progressContainer) return;

    const totalDots = this.settings.sessionsBeforeLongBreak;
    const completedCount = this.sessionCount % this.settings.sessionsBeforeLongBreak;
    const currentInCycle = completedCount + 1;

    // Recreate dots if count changed
    const existingDots = progressContainer.querySelectorAll('.progress-dot');
    if (existingDots.length !== totalDots) {
      progressContainer.innerHTML = '';
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        progressContainer.appendChild(dot);
      }
    }

    // Update dot states
    const dots = progressContainer.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
      dot.classList.remove('completed', 'active');
      if (index < completedCount) {
        dot.classList.add('completed');
      } else if (index === completedCount) {
        dot.classList.add('active');
      }
    });
  }

  // Settings
  openSettings() {
    this.loadSettingsToForm();
    this.elements.settingsModal.classList.add('active');
  }

  closeSettings() {
    // Add closing animation
    this.elements.settingsModal.classList.add('closing');
    this.elements.settingsModal.classList.remove('active');

    // Remove modal from DOM after animation completes
    setTimeout(() => {
      this.elements.settingsModal.classList.remove('closing');
    }, 250); // Match --transition-base duration
  }

  loadSettingsToForm() {
    this.elements.workDuration.value = this.settings.workDuration;
    this.elements.breakDuration.value = this.settings.breakDuration;
    this.elements.longBreakDuration.value = this.settings.longBreakDuration;
    this.elements.sessionsBeforeLongBreak.value = this.settings.sessionsBeforeLongBreak;
    this.elements.audioEnabled.checked = this.settings.audioEnabled;
    this.elements.themeSelect.value = this.settings.theme || 'professional';

    // Exercise preferences
    const prefs = this.settings.exercisePreferences || { difficulty: 'any', excludeFloorExercises: false, excludeEquipment: false };
    this.elements.exerciseDifficulty.value = prefs.difficulty;
    this.elements.excludeFloorExercises.checked = prefs.excludeFloorExercises;
    this.elements.excludeEquipment.checked = prefs.excludeEquipment;
  }

  autoSaveSettings() {
    // Get values from form
    this.settings.workDuration = parseInt(this.elements.workDuration.value);
    this.settings.breakDuration = parseInt(this.elements.breakDuration.value);
    this.settings.longBreakDuration = parseInt(this.elements.longBreakDuration.value);
    this.settings.sessionsBeforeLongBreak = parseInt(this.elements.sessionsBeforeLongBreak.value);
    this.settings.audioEnabled = this.elements.audioEnabled.checked;
    this.settings.theme = this.elements.themeSelect.value;

    // Exercise preferences
    this.settings.exercisePreferences = {
      difficulty: this.elements.exerciseDifficulty.value,
      excludeFloorExercises: this.elements.excludeFloorExercises.checked,
      excludeEquipment: this.elements.excludeEquipment.checked
    };

    // Update audio
    this.audio.setMuted(!this.settings.audioEnabled);

    // Update theme
    const oldTheme = this.themeManager.currentTheme;
    this.themeManager.setTheme(this.settings.theme);

    // Track theme change
    if (window.umami && oldTheme !== this.settings.theme) {
      umami.track('theme-changed', { theme: this.settings.theme });
    }

    // Update exercise preferences
    this.exerciseManager.setPreferences(this.settings.exercisePreferences);

    // Save to storage
    this.storage.saveSettings(this.settings);

    // Update timer if in idle state
    if (!this.timer.isRunning && this.timer.getRemaining() === this.timer.duration) {
      this.createTimer();
      this.updateDisplay();
      this.updateProgressRing();
    }

    // Update session counter
    this.updateSessionCounter();

    // Play subtle confirmation sound
    this.audio.playNotification();
  }

  // Break Extension System
  showBreakExtensionPanel() {
    if (this.breakExtensionShown) return; // Only show once per break

    const exercises = this.exerciseManager.selectExtensionExercises(3);
    this.renderExtensionExercises(exercises);
    this.elements.breakExtensionPanel.classList.add('active');
    this.breakExtensionShown = true;
  }

  renderExtensionExercises(exercises) {
    this.elements.extensionExercises.innerHTML = exercises.map(exercise => {
      const minutes = Math.floor(exercise.duration / 60);
      const extensionMinutes = Math.floor(exercise.breakExtension / 60);

      return `
        <div class="extension-exercise-card" data-exercise-id="${exercise.id}">
          <div class="extension-exercise-header">
            <div class="extension-exercise-name">${exercise.name}</div>
            <div class="extension-exercise-reward">+${extensionMinutes} min</div>
          </div>
          <div class="extension-exercise-meta">
            <span class="exercise-difficulty ${exercise.difficulty}">${exercise.difficulty}</span>
            <span>~${minutes} min</span>
            <span class="exercise-badge ${exercise.environment}">${exercise.environment}</span>
          </div>
          <div class="extension-exercise-instructions">${exercise.instructions}</div>
        </div>
      `;
    }).join('');

    // Add click handlers
    this.elements.extensionExercises.querySelectorAll('.extension-exercise-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const exerciseId = card.dataset.exerciseId;
        const exercise = exercises.find(ex => ex.id === exerciseId);
        this.selectExtensionExercise(exercise);

        // Update UI
        this.elements.extensionExercises.querySelectorAll('.extension-exercise-card').forEach(c => {
          c.classList.remove('selected');
        });
        card.classList.add('selected');
      });
    });
  }

  selectExtensionExercise(exercise) {
    this.selectedExtensionExercise = exercise;
    this.elements.confirmExtensionBtn.disabled = false;
  }

  confirmExtensionExercise() {
    if (!this.selectedExtensionExercise) return;

    // Record completion
    this.exerciseManager.recordCompletion(this.selectedExtensionExercise);

    // Calculate extension time
    const extensionMinutes = Math.floor(this.selectedExtensionExercise.breakExtension / 60);

    // Track break extension
    if (window.umami) {
      umami.track('break-extended', {
        exercise: this.selectedExtensionExercise.name,
        extensionMinutes: extensionMinutes
      });
    }

    // Switch back to break mode if currently in work mode
    const wasWorkMode = this.currentMode === 'work';
    const extensionSeconds = this.selectedExtensionExercise.breakExtension;

    if (wasWorkMode) {
      // If we're in work mode (break ended), switch back to the previous break type
      const breakMode = this.lastBreakMode || 'break';
      this.switchMode(breakMode);
    }

    // Calculate before and after times
    const beforeSeconds = wasWorkMode ? 0 : this.timer.getRemaining();
    const afterSeconds = wasWorkMode ? extensionSeconds : beforeSeconds + extensionSeconds;

    // Extend/set break timer
    this.timer.pause();
    this.timer.duration = afterSeconds;
    this.timer.remaining = afterSeconds;
    this.timer.start();

    // Update button states since timer is now running
    this.updatePlayPauseButton(true);

    // Show success message (keep panel open)
    this.showSuccessMessage(extensionMinutes, beforeSeconds, afterSeconds);

    // Pulse the main timer
    this.pulseTimer();

    this.selectedExtensionExercise = null;
    this.elements.confirmExtensionBtn.disabled = true;
  }

  showSuccessMessage(extensionMinutes, beforeSeconds, afterSeconds) {
    // Format time display helper
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Update reward badge
    this.elements.rewardBadge.textContent = `+${extensionMinutes} min`;

    // Update time comparison
    this.elements.timeBefore.textContent = formatTime(beforeSeconds);
    this.elements.timeAfter.textContent = formatTime(afterSeconds);

    // Hide extension form, show success message
    this.elements.extensionForm.style.display = 'none';
    this.elements.successMessage.style.display = 'block';

    // Hide after 4.5 seconds and close the extension panel
    setTimeout(() => {
      this.elements.successMessage.style.display = 'none';
      this.elements.extensionForm.style.display = 'block';
      this.elements.breakExtensionPanel.classList.remove('active');
    }, 4500);
  }

  pulseTimer() {
    // Add pulse animation to timer
    if (this.elements.timerTime) {
      this.elements.timerTime.classList.add('reward-pulse');

      // Remove class after animation completes
      setTimeout(() => {
        this.elements.timerTime.classList.remove('reward-pulse');
      }, 1000);
    }
  }

  skipBreakExtension() {
    this.elements.breakExtensionPanel.classList.remove('active');
  }

  // Welcome Panel Methods
  checkWelcomePanel() {
    // Show welcome panel if user hasn't seen it yet
    if (!this.storage.hasSeenWelcome()) {
      // Delay showing the panel slightly for better UX
      setTimeout(() => {
        this.showWelcomePanel();
      }, 500);
    }
  }

  showWelcomePanel() {
    if (this.elements.welcomePanel) {
      this.elements.welcomePanel.classList.add('active');
    }
  }

  closeWelcomePanel() {
    if (this.elements.welcomePanel) {
      this.elements.welcomePanel.classList.remove('active');
      this.storage.setWelcomeSeen();
    }
  }

  startFromWelcome() {
    // Close welcome panel
    this.closeWelcomePanel();

    // Start the timer
    this.startTimer();
  }

  // Fullscreen Methods
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      // Exit fullscreen
      document.exitFullscreen();
    }
  }

  updateFullscreenButton() {
    if (document.fullscreenElement) {
      // Currently in fullscreen - show exit icon
      this.elements.fullscreenIcon.style.display = 'none';
      this.elements.exitFullscreenIcon.style.display = 'block';
    } else {
      // Not in fullscreen - show enter icon
      this.elements.fullscreenIcon.style.display = 'block';
      this.elements.exitFullscreenIcon.style.display = 'none';
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new PomodoroApp();
});
