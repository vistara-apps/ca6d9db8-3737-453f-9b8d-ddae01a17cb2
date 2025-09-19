import { Habit } from './types';

export const defaultHabits: Habit[] = [
  // Low Energy Habits
  {
    habitId: 'deep-breathing',
    name: '3-Minute Deep Breathing',
    description: 'Gentle breathing exercise to restore calm energy',
    category: 'Mindfulness',
    durationMinutes: 3,
    energyLevel: 'low',
    instructions: [
      'Find a comfortable seated position',
      'Close your eyes and breathe in for 4 counts',
      'Hold for 4 counts, then exhale for 6 counts',
      'Repeat for 3 minutes'
    ]
  },
  {
    habitId: 'gentle-stretch',
    name: 'Gentle Neck & Shoulder Stretch',
    description: 'Release tension with simple stretches',
    category: 'Movement',
    durationMinutes: 2,
    energyLevel: 'low',
    instructions: [
      'Sit up straight in your chair',
      'Slowly roll your shoulders backward 5 times',
      'Gently tilt your head to each side for 15 seconds',
      'Take 3 deep breaths'
    ]
  },
  {
    habitId: 'gratitude-moment',
    name: 'Quick Gratitude Check',
    description: 'Shift perspective with gratitude',
    category: 'Mindfulness',
    durationMinutes: 1,
    energyLevel: 'low',
    instructions: [
      'Think of 3 things you\'re grateful for today',
      'Feel the positive emotion for each one',
      'Smile and take a deep breath'
    ]
  },

  // Medium Energy Habits
  {
    habitId: 'desk-exercises',
    name: 'Desk Energy Boost',
    description: 'Quick exercises to energize your body',
    category: 'Movement',
    durationMinutes: 3,
    energyLevel: 'medium',
    instructions: [
      'Stand up and do 10 desk push-ups',
      'Do 15 calf raises',
      'Stretch your arms overhead for 30 seconds',
      'Take 5 deep breaths'
    ]
  },
  {
    habitId: 'hydration-check',
    name: 'Mindful Hydration',
    description: 'Drink water mindfully and check in with your body',
    category: 'Wellness',
    durationMinutes: 2,
    energyLevel: 'medium',
    instructions: [
      'Get a glass of water',
      'Drink slowly and mindfully',
      'Notice how your body feels',
      'Set intention for the next hour'
    ]
  },
  {
    habitId: 'quick-tidy',
    name: '2-Minute Tidy',
    description: 'Clear your space, clear your mind',
    category: 'Organization',
    durationMinutes: 2,
    energyLevel: 'medium',
    instructions: [
      'Clear your desk of unnecessary items',
      'Organize your immediate workspace',
      'Take a moment to appreciate the clean space'
    ]
  },

  // High Energy Habits
  {
    habitId: 'power-walk',
    name: 'Quick Power Walk',
    description: 'Get your blood flowing with movement',
    category: 'Movement',
    durationMinutes: 3,
    energyLevel: 'high',
    instructions: [
      'Step outside or walk around your space',
      'Walk briskly for 3 minutes',
      'Focus on your breathing and surroundings',
      'Return feeling refreshed'
    ]
  },
  {
    habitId: 'creative-burst',
    name: 'Creative Brain Dump',
    description: 'Channel high energy into creativity',
    category: 'Creativity',
    durationMinutes: 3,
    energyLevel: 'high',
    instructions: [
      'Grab paper or open a note app',
      'Write down every idea in your head for 2 minutes',
      'Don\'t filter - just brain dump',
      'Circle the most interesting idea'
    ]
  },
  {
    habitId: 'learning-bite',
    name: 'Quick Learning Bite',
    description: 'Feed your curious mind',
    category: 'Learning',
    durationMinutes: 3,
    energyLevel: 'high',
    instructions: [
      'Pick a topic you\'re curious about',
      'Read or watch something for 3 minutes',
      'Write down one key insight',
      'Think about how to apply it'
    ]
  }
];

export function getHabitsByEnergyLevel(energyLevel: 'low' | 'medium' | 'high'): Habit[] {
  return defaultHabits.filter(habit => habit.energyLevel === energyLevel);
}

export function getRandomHabit(energyLevel: 'low' | 'medium' | 'high'): Habit {
  const habits = getHabitsByEnergyLevel(energyLevel);
  return habits[Math.floor(Math.random() * habits.length)];
}
