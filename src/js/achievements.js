/**
 * Achievement Definitions
 */
const ACHIEVEMENTS = {
  'first-session': {
    id: 'first-session',
    name: 'First Steps',
    description: 'Complete your first pomodoro session',
    icon: '🌱',
    category: 'milestone'
  },
  'getting-started': {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Complete 10 pomodoro sessions',
    icon: '🎯',
    category: 'milestone'
  },
  'dedicated': {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Complete 50 pomodoro sessions',
    icon: '💎',
    category: 'milestone'
  },
  'centurion': {
    id: 'centurion',
    name: 'Centurion',
    description: 'Complete 100 pomodoro sessions',
    icon: '👑',
    category: 'milestone'
  },
  'legend': {
    id: 'legend',
    name: 'Legend',
    description: 'Complete 500 pomodoro sessions',
    icon: '⭐',
    category: 'milestone'
  },
  'week-warrior': {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: 'streak'
  },
  'month-master': {
    id: 'month-master',
    name: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: '🏆',
    category: 'streak'
  },
  'century-streak': {
    id: 'century-streak',
    name: 'Century Streak',
    description: 'Maintain a 100-day streak',
    icon: '💯',
    category: 'streak'
  },
  'overachiever': {
    id: 'overachiever',
    name: 'Overachiever',
    description: 'Extend your break 10 times',
    icon: '💪',
    category: 'exercise'
  },
  'exercise-enthusiast': {
    id: 'exercise-enthusiast',
    name: 'Exercise Enthusiast',
    description: 'Complete 50 exercises',
    icon: '🏃',
    category: 'exercise'
  },
  'fitness-fanatic': {
    id: 'fitness-fanatic',
    name: 'Fitness Fanatic',
    description: 'Complete 200 exercises',
    icon: '🦾',
    category: 'exercise'
  },
  'early-bird': {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete a session before 8 AM',
    icon: '🌅',
    category: 'special'
  },
  'night-owl': {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete a session after 10 PM',
    icon: '🦉',
    category: 'special'
  },
  'theme-explorer': {
    id: 'theme-explorer',
    name: 'Theme Explorer',
    description: 'Try all 5 themes',
    icon: '🎨',
    category: 'special'
  },
  'marathon': {
    id: 'marathon',
    name: 'Marathon',
    description: 'Complete 10 sessions in one day',
    icon: '🏃‍♂️',
    category: 'special'
  },
  'focus-master': {
    id: 'focus-master',
    name: 'Focus Master',
    description: 'Accumulate 100 hours of focus time',
    icon: '🧘',
    category: 'time'
  },
  'time-warrior': {
    id: 'time-warrior',
    name: 'Time Warrior',
    description: 'Accumulate 50 hours of focus time',
    icon: '⏰',
    category: 'time'
  },
  'consistency': {
    id: 'consistency',
    name: 'Consistency',
    description: 'Complete at least 1 session for 14 consecutive days',
    icon: '📊',
    category: 'streak'
  },
  'weekend-warrior': {
    id: 'weekend-warrior',
    name: 'Weekend Warrior',
    description: 'Complete sessions on Saturday and Sunday',
    icon: '🎉',
    category: 'special'
  },
  'variety-seeker': {
    id: 'variety-seeker',
    name: 'Variety Seeker',
    description: 'Complete 20 different unique exercises',
    icon: '🌈',
    category: 'exercise'
  },
  'daily-champion': {
    id: 'daily-champion',
    name: 'Daily Champion',
    description: 'Reach your daily goal 30 times',
    icon: '🥇',
    category: 'goal'
  }
};

// Get achievement definition by ID
function getAchievement(id) {
  return ACHIEVEMENTS[id] || null;
}

// Get all achievements
function getAllAchievements() {
  return Object.values(ACHIEVEMENTS);
}

// Get achievements by category
function getAchievementsByCategory(category) {
  return Object.values(ACHIEVEMENTS).filter(a => a.category === category);
}
