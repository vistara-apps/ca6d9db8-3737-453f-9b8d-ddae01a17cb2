import { Habit, HabitLog, FeedbackData, User } from './types';
import { defaultHabits, getHabitsByEnergyLevel, getRandomHabit } from './habits';
import { getEnergyCategory } from './utils';

export class HabitEngine {
  private user: User | null = null;
  private habitHistory: HabitLog[] = [];
  private feedbackHistory: FeedbackData[] = [];

  constructor(user?: User) {
    if (user) {
      this.user = user;
      this.habitHistory = user.habitHistory || [];
      this.feedbackHistory = user.feedbackData || [];
    }
  }

  /**
   * Get a personalized habit suggestion based on energy level and user history
   */
  suggestHabit(energyLevel: number): Habit {
    const energyCategory = getEnergyCategory(energyLevel);
    const availableHabits = getHabitsByEnergyLevel(energyCategory);

    if (!this.user || this.habitHistory.length === 0) {
      // First time user or no history - return random habit
      return getRandomHabit(energyCategory);
    }

    // Analyze user preferences and feedback
    const preferences = this.analyzeUserPreferences(energyCategory);
    const scoredHabits = this.scoreHabits(availableHabits, preferences);

    // Return the highest scoring habit
    return scoredHabits[0] || getRandomHabit(energyCategory);
  }

  /**
   * Analyze user preferences based on feedback and completion history
   */
  private analyzeUserPreferences(energyCategory: 'low' | 'medium' | 'high') {
    const preferences: Record<string, number> = {};

    // Initialize all habits with neutral score
    getHabitsByEnergyLevel(energyCategory).forEach(habit => {
      preferences[habit.habitId] = 0;
    });

    // Factor in feedback history
    this.feedbackHistory.forEach(feedback => {
      const habit = defaultHabits.find(h => h.habitId === feedback.habitId);
      if (habit && habit.energyLevel === energyCategory) {
        const score = feedback.feedback === 'helpful' ? 2 : -1;
        preferences[habit.habitId] = (preferences[habit.habitId] || 0) + score;
      }
    });

    // Factor in completion rates
    const recentHabits = this.habitHistory.slice(-10); // Last 10 habits
    recentHabits.forEach(log => {
      const habit = defaultHabits.find(h => h.habitId === log.habitId);
      if (habit && habit.energyLevel === energyCategory) {
        const score = log.completed ? 1 : -0.5;
        preferences[habit.habitId] = (preferences[habit.habitId] || 0) + score;
      }
    });

    // Factor in category preferences
    if (this.user?.preferredHabitCategories) {
      this.user.preferredHabitCategories.forEach(category => {
        getHabitsByEnergyLevel(energyCategory)
          .filter(habit => habit.category === category)
          .forEach(habit => {
            preferences[habit.habitId] = (preferences[habit.habitId] || 0) + 0.5;
          });
      });
    }

    return preferences;
  }

  /**
   * Score habits based on user preferences
   */
  private scoreHabits(habits: Habit[], preferences: Record<string, number>): Habit[] {
    return habits
      .map(habit => ({
        ...habit,
        score: preferences[habit.habitId] || 0
      }))
      .sort((a, b) => (b as any).score - (a as any).score);
  }

  /**
   * Record a habit completion
   */
  recordHabitCompletion(habitId: string, energyLevel: number, completed: boolean = true): HabitLog {
    const log: HabitLog = {
      logId: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: this.user?.userId || 'anonymous',
      habitId,
      timestamp: new Date(),
      energyLevelAtSuggestion: energyLevel,
      completed
    };

    this.habitHistory.push(log);

    // Update user data if available
    if (this.user) {
      this.user.habitHistory = this.habitHistory;
    }

    return log;
  }

  /**
   * Record user feedback on a habit
   */
  recordFeedback(habitId: string, feedback: 'helpful' | 'not_helpful'): FeedbackData {
    const feedbackData: FeedbackData = {
      habitId,
      feedback,
      timestamp: new Date()
    };

    this.feedbackHistory.push(feedbackData);

    // Update user data if available
    if (this.user) {
      this.user.feedbackData = this.feedbackHistory;
    }

    return feedbackData;
  }

  /**
   * Get habit completion statistics
   */
  getHabitStats() {
    const stats = {
      totalCompleted: 0,
      totalAttempted: this.habitHistory.length,
      completionRate: 0,
      favoriteCategory: '',
      averageEnergyLevel: 0
    };

    if (this.habitHistory.length === 0) return stats;

    stats.totalCompleted = this.habitHistory.filter(log => log.completed).length;
    stats.completionRate = (stats.totalCompleted / stats.totalAttempted) * 100;

    // Calculate favorite category
    const categoryCount: Record<string, number> = {};
    this.habitHistory.forEach(log => {
      const habit = defaultHabits.find(h => h.habitId === log.habitId);
      if (habit) {
        categoryCount[habit.category] = (categoryCount[habit.category] || 0) + 1;
      }
    });

    const favoriteCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0];
    stats.favoriteCategory = favoriteCategory ? favoriteCategory[0] : '';

    // Calculate average energy level
    const totalEnergy = this.habitHistory.reduce((sum, log) => sum + log.energyLevelAtSuggestion, 0);
    stats.averageEnergyLevel = totalEnergy / this.habitHistory.length;

    return stats;
  }

  /**
   * Update user preferences based on behavior
   */
  updateUserPreferences() {
    if (!this.user) return;

    const stats = this.getHabitStats();

    // Update preferred categories based on completion history
    const categoryCompletions: Record<string, number> = {};
    this.habitHistory
      .filter(log => log.completed)
      .forEach(log => {
        const habit = defaultHabits.find(h => h.habitId === log.habitId);
        if (habit) {
          categoryCompletions[habit.category] = (categoryCompletions[habit.category] || 0) + 1;
        }
      });

    // Get top 3 categories
    const topCategories = Object.entries(categoryCompletions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    this.user.preferredHabitCategories = topCategories;
  }

  /**
   * Get personalized recommendations for different energy levels
   */
  getPersonalizedRecommendations(): Record<'low' | 'medium' | 'high', Habit[]> {
    const recommendations = {
      low: [] as Habit[],
      medium: [] as Habit[],
      high: [] as Habit[]
    };

    (['low', 'medium', 'high'] as const).forEach(level => {
      const habits = getHabitsByEnergyLevel(level);
      const preferences = this.analyzeUserPreferences(level);
      recommendations[level] = this.scoreHabits(habits, preferences).slice(0, 3);
    });

    return recommendations;
  }
}

