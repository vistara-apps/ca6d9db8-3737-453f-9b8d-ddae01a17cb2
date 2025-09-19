import { User } from './types';

export class UserPreferences {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  /**
   * Update user's preferred habit categories based on completion history
   */
  updatePreferredCategories(completedHabits: string[]) {
    const categoryCount: Record<string, number> = {};

    // Count completions by category
    completedHabits.forEach(habitId => {
      // This would need to be implemented with actual habit data
      // For now, we'll use a simple approach
      const category = this.inferCategoryFromHabitId(habitId);
      if (category) {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });

    // Get top 3 categories
    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    this.user.preferredHabitCategories = topCategories;
  }

  /**
   * Infer category from habit ID (simplified implementation)
   */
  private inferCategoryFromHabitId(habitId: string): string | null {
    const categoryMap: Record<string, string> = {
      'deep-breathing': 'Mindfulness',
      'gentle-stretch': 'Movement',
      'gratitude-moment': 'Mindfulness',
      'desk-exercises': 'Movement',
      'hydration-check': 'Wellness',
      'quick-tidy': 'Organization',
      'power-walk': 'Movement',
      'creative-burst': 'Creativity',
      'learning-bite': 'Learning'
    };

    return categoryMap[habitId] || null;
  }

  /**
   * Get user's preferred energy levels based on history
   */
  getPreferredEnergyLevels(): number[] {
    // This would analyze the user's habit history to determine
    // which energy levels they respond best to
    // For now, return all levels
    return [1, 2, 3, 4, 5];
  }

  /**
   * Get user's habit completion patterns
   */
  getCompletionPatterns() {
    return {
      bestTimeOfDay: this.analyzeBestTimeOfDay(),
      preferredDuration: this.analyzePreferredDuration(),
      successRateByCategory: this.analyzeSuccessByCategory()
    };
  }

  /**
   * Analyze best time of day for habit completion
   */
  private analyzeBestTimeOfDay(): string {
    // This would analyze timestamps from habit logs
    // For now, return a default
    return 'morning';
  }

  /**
   * Analyze preferred habit duration
   */
  private analyzePreferredDuration(): number {
    // This would analyze completed habits by duration
    // For now, return average
    return 3; // minutes
  }

  /**
   * Analyze success rate by category
   */
  private analyzeSuccessByCategory(): Record<string, number> {
    // This would calculate completion rates by category
    // For now, return mock data
    return {
      'Mindfulness': 85,
      'Movement': 78,
      'Wellness': 92,
      'Organization': 71,
      'Creativity': 88,
      'Learning': 76
    };
  }

  /**
   * Get personalized recommendations based on user preferences
   */
  getPersonalizedRecommendations() {
    const patterns = this.getCompletionPatterns();

    return {
      recommendedCategories: this.user.preferredHabitCategories,
      bestTimeOfDay: patterns.bestTimeOfDay,
      optimalDuration: patterns.preferredDuration,
      successRates: patterns.successRateByCategory
    };
  }

  /**
   * Update user profile with new information
   */
  updateProfile(updates: Partial<User>) {
    Object.assign(this.user, updates);
  }

  /**
   * Get user insights for dashboard
   */
  getInsights() {
    return {
      totalHabitsCompleted: this.user.habitHistory?.filter(h => h.completed).length || 0,
      favoriteCategories: this.user.preferredHabitCategories,
      averageEnergyLevel: this.calculateAverageEnergyLevel(),
      consistencyScore: this.calculateConsistencyScore()
    };
  }

  /**
   * Calculate average energy level from history
   */
  private calculateAverageEnergyLevel(): number {
    if (!this.user.habitHistory || this.user.habitHistory.length === 0) {
      return 3; // Default to medium
    }

    const total = this.user.habitHistory.reduce((sum, log) => sum + log.energyLevelAtSuggestion, 0);
    return Math.round(total / this.user.habitHistory.length);
  }

  /**
   * Calculate consistency score (0-100)
   */
  private calculateConsistencyScore(): number {
    if (!this.user.habitHistory || this.user.habitHistory.length === 0) {
      return 0;
    }

    const completedCount = this.user.habitHistory.filter(h => h.completed).length;
    const totalCount = this.user.habitHistory.length;

    return Math.round((completedCount / totalCount) * 100);
  }
}

