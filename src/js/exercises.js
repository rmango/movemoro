/**
 * Exercise Manager class
 * Handles loading, selecting, and tracking exercises
 */
class ExerciseManager {
  constructor() {
    this.exercises = [];
    this.history = [];
    this.currentPair = null;
    this.preferences = null;
  }

  setPreferences(preferences) {
    this.preferences = preferences;
  }

  // Floor exercises that require lying down
  floorExercises = ['burpees', 'mountain climbers', 'push-ups', 'plank', 'bicycle crunches',
    'glute bridges', 'superman', 'side plank', 'inchworms', 'dead bug', 'leg raises',
    'russian twists', 'yoga', 'pilates', 'stretching'];

  isFloorExercise(exercise) {
    const nameLower = exercise.name.toLowerCase();
    const instructionsLower = exercise.instructions.toLowerCase();
    return this.floorExercises.some(floor =>
      nameLower.includes(floor) ||
      instructionsLower.includes('lie') ||
      instructionsLower.includes('lying') ||
      instructionsLower.includes('floor')
    );
  }

  filterExercises(exercises) {
    if (!this.preferences) return exercises;

    let filtered = exercises;

    // Filter by difficulty
    if (this.preferences.difficulty && this.preferences.difficulty !== 'any') {
      filtered = filtered.filter(e => e.difficulty === this.preferences.difficulty);
    }

    // Exclude floor exercises
    if (this.preferences.excludeFloorExercises) {
      filtered = filtered.filter(e => !this.isFloorExercise(e));
    }

    // Exclude equipment
    if (this.preferences.excludeEquipment) {
      filtered = filtered.filter(e => !e.equipment || e.equipment.length === 0);
    }

    return filtered;
  }

  async loadExercises() {
    try {
      const response = await fetch('src/data/exercises.json');
      if (!response.ok) {
        throw new Error('Failed to load exercises');
      }
      this.exercises = await response.json();
      return true;
    } catch (error) {
      console.error('Error loading exercises:', error);
      return false;
    }
  }

  selectSnackExercises() {
    let officeExercises = this.exercises.filter(
      e => e.environment === 'office' && e.category === 'snack'
    );
    let homeExercises = this.exercises.filter(
      e => e.environment === 'home' && e.category === 'snack'
    );

    // Apply filtering
    officeExercises = this.filterExercises(officeExercises);
    homeExercises = this.filterExercises(homeExercises);

    // Fallback if filtering removes all exercises - relax difficulty requirement only
    if (officeExercises.length === 0) {
      officeExercises = this.exercises.filter(e => e.environment === 'office' && e.category === 'snack');
      // Re-apply non-difficulty filters
      if (this.preferences?.excludeFloorExercises) {
        officeExercises = officeExercises.filter(e => !this.isFloorExercise(e));
      }
      if (this.preferences?.excludeEquipment) {
        officeExercises = officeExercises.filter(e => !e.equipment || e.equipment.length === 0);
      }
    }
    if (homeExercises.length === 0) {
      homeExercises = this.exercises.filter(e => e.environment === 'home' && e.category === 'snack');
      // Re-apply non-difficulty filters
      if (this.preferences?.excludeFloorExercises) {
        homeExercises = homeExercises.filter(e => !this.isFloorExercise(e));
      }
      if (this.preferences?.excludeEquipment) {
        homeExercises = homeExercises.filter(e => !e.equipment || e.equipment.length === 0);
      }
    }

    const office = this.getRandomExercise(officeExercises);
    const home = this.getRandomExercise(homeExercises);

    this.currentPair = [office, home];
    return this.currentPair;
  }

  selectExtensionExercises(count = 3) {
    let extensionExercises = this.exercises.filter(
      e => e.category === 'extension'
    );

    // Apply filtering
    extensionExercises = this.filterExercises(extensionExercises);

    // Fallback if filtering removes all exercises
    if (extensionExercises.length === 0) {
      extensionExercises = this.exercises.filter(e => e.category === 'extension');
    }

    // Filter out recently completed
    const recentIds = this.history.slice(-5).map(h => h.id);
    let available = extensionExercises.filter(e => !recentIds.includes(e.id));

    if (available.length < count) {
      available = extensionExercises;
    }

    // Shuffle and take requested count
    const shuffled = available.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  getRandomExercise(exerciseArray) {
    // Filter out recently completed exercises
    const recentIds = this.history.slice(-5).map(h => h.id);
    let available = exerciseArray.filter(e => !recentIds.includes(e.id));

    // Also filter out currently displayed exercises to prevent duplicates on regenerate
    if (this.currentPair && this.currentPair.length > 0) {
      const currentIds = this.currentPair.map(ex => ex.id);
      available = available.filter(e => !currentIds.includes(e.id));
    }

    // If we've filtered out everything, use the full array
    if (available.length === 0) {
      available = exerciseArray;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }

  recordCompletion(exercise) {
    this.history.push({
      id: exercise.id,
      name: exercise.name,
      environment: exercise.environment,
      timestamp: Date.now()
    });

    // Keep history to last 50 exercises
    if (this.history.length > 50) {
      this.history = this.history.slice(-50);
    }

    // Save to localStorage
    this.saveHistory();
  }

  saveHistory() {
    try {
      localStorage.setItem('pomodoro_exercise_history', JSON.stringify(this.history));
    } catch (error) {
      console.error('Error saving exercise history:', error);
    }
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem('pomodoro_exercise_history');
      if (saved) {
        this.history = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading exercise history:', error);
      this.history = [];
    }
  }

  getCurrentPair() {
    return this.currentPair;
  }

  getHistory() {
    return this.history;
  }
}
