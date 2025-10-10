/**
 * Theme Manager class
 * Handles theme switching and theme-specific messaging
 */
class ThemeManager {
  constructor() {
    this.currentTheme = 'professional';

    // Theme-specific messages
    this.messages = {
      professional: {
        workStart: "Focus time. Let's accomplish something great.",
        workComplete: "Excellent work! Time to move your body.",
        exercisePrompt: "Choose an exercise to unlock your break.",
        breakStart: "Break time. You've earned this.",
        breakComplete: "Ready to get back to it?"
      },
      zen: {
        workStart: "Breathe in. Center yourself. Begin.",
        workComplete: "Well done. Your body calls for movement.",
        exercisePrompt: "Mindful movement awaits. Choose your practice.",
        breakStart: "Rest now. Be present in this moment.",
        breakComplete: "Return to your work with renewed energy."
      },
      retro: {
        workStart: "GAME START! Level up your focus.",
        workComplete: "🎮 STAGE CLEAR! Boss fight: Choose your exercise.",
        exercisePrompt: "SELECT YOUR MOVE: Click to choose",
        breakStart: "BONUS STAGE! Take your well-earned rest.",
        breakComplete: "CONTINUE? Resuming in 3...2...1..."
      },
      gymbro: {
        workStart: "LET'S GO! CRUSH THIS SESSION! 💪",
        workComplete: "BEAST MODE ACTIVATED! TIME TO MOVE!",
        exercisePrompt: "PICK YOUR EXERCISE! NO PAIN, NO GAIN!",
        breakStart: "YOU EARNED IT! REST UP, WARRIOR!",
        breakComplete: "BREAK'S OVER! LET'S GET AFTER IT!"
      },
      cafe: {
        workStart: "Grab your favorite mug and let's focus ☕",
        workComplete: "Nice work! Time to stretch those legs.",
        exercisePrompt: "Pick a quick activity – your break is brewing!",
        breakStart: "Your break is served. Enjoy this moment!",
        breakComplete: "Feeling refreshed? Let's dive back in."
      }
    };
  }

  setTheme(themeName) {
    // Validate theme exists
    if (!this.messages[themeName]) {
      console.warn(`Theme "${themeName}" not found, using professional`);
      themeName = 'professional';
    }

    this.currentTheme = themeName;

    // Set data-theme attribute on html element
    document.documentElement.setAttribute('data-theme', themeName);

    return themeName;
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  getMessage(key) {
    const theme = this.messages[this.currentTheme];
    return theme && theme[key] ? theme[key] : this.messages.professional[key] || '';
  }

  updateExercisePrompt() {
    const promptText = this.getMessage('exercisePrompt');
    const promptElement = document.querySelector('.modal-subtitle');
    if (promptElement) {
      promptElement.textContent = promptText;
    }
  }
}
