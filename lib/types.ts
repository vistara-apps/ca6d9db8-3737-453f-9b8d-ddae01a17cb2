export interface User {
  userId: string;
  farcasterId?: string;
  walletAddress?: string;
  preferredHabitCategories: string[];
  habitHistory: HabitLog[];
  feedbackData: FeedbackData[];
}

export interface HabitLog {
  logId: string;
  userId: string;
  habitId: string;
  timestamp: Date;
  energyLevelAtSuggestion: number;
  feedback?: 'helpful' | 'not_helpful';
  completed: boolean;
}

export interface Habit {
  habitId: string;
  name: string;
  description: string;
  category: string;
  durationMinutes: number;
  energyLevel: 'low' | 'medium' | 'high';
  instructions: string[];
}

export interface FeedbackData {
  habitId: string;
  feedback: 'helpful' | 'not_helpful';
  timestamp: Date;
}

export interface EnergyLevel {
  value: number;
  label: string;
  color: string;
}

export interface ProgressStats {
  totalHabitsCompleted: number;
  totalTimeSpent: number;
  streakDays: number;
  favoriteCategory: string;
}
