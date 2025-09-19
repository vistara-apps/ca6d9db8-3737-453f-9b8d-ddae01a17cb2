import { HabitLog, ProgressStats } from './types';
import { defaultHabits } from './habits';

export class ProgressTracker {
  private habitLogs: HabitLog[] = [];

  constructor(habitLogs: HabitLog[] = []) {
    this.habitLogs = habitLogs;
  }

  /**
   * Add a new habit log
   */
  addHabitLog(log: HabitLog) {
    this.habitLogs.push(log);
  }

  /**
   * Get overall progress statistics
   */
  getOverallStats(): ProgressStats {
    const completedHabits = this.habitLogs.filter(log => log.completed);
    const totalHabitsCompleted = completedHabits.length;

    // Calculate total time spent
    const totalTimeSpent = completedHabits.reduce((total, log) => {
      const habit = defaultHabits.find(h => h.habitId === log.habitId);
      return total + (habit?.durationMinutes || 0);
    }, 0);

    // Calculate streak days
    const streakDays = this.calculateStreakDays();

    // Find favorite category
    const favoriteCategory = this.getFavoriteCategory();

    return {
      totalHabitsCompleted,
      totalTimeSpent,
      streakDays,
      favoriteCategory
    };
  }

  /**
   * Get progress statistics for a specific time period
   */
  getStatsForPeriod(startDate: Date, endDate: Date): ProgressStats {
    const periodLogs = this.habitLogs.filter(log =>
      log.timestamp >= startDate && log.timestamp <= endDate && log.completed
    );

    const totalHabitsCompleted = periodLogs.length;

    const totalTimeSpent = periodLogs.reduce((total, log) => {
      const habit = defaultHabits.find(h => h.habitId === log.habitId);
      return total + (habit?.durationMinutes || 0);
    }, 0);

    const streakDays = this.calculateStreakDaysInPeriod(startDate, endDate);
    const favoriteCategory = this.getFavoriteCategoryInPeriod(startDate, endDate);

    return {
      totalHabitsCompleted,
      totalTimeSpent,
      streakDays,
      favoriteCategory
    };
  }

  /**
   * Get weekly progress
   */
  getWeeklyStats(): ProgressStats {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    return this.getStatsForPeriod(weekStart, now);
  }

  /**
   * Get monthly progress
   */
  getMonthlyStats(): ProgressStats {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return this.getStatsForPeriod(monthStart, now);
  }

  /**
   * Calculate current streak of consecutive days with completed habits
   */
  private calculateStreakDays(): number {
    if (this.habitLogs.length === 0) return 0;

    const completedLogs = this.habitLogs
      .filter(log => log.completed)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (completedLogs.length === 0) return 0;

    let streak = 1;
    let currentDate = new Date(completedLogs[0].timestamp);
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < completedLogs.length; i++) {
      const logDate = new Date(completedLogs[i].timestamp);
      logDate.setHours(0, 0, 0, 0);

      const dayDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        streak++;
        currentDate = logDate;
      } else if (dayDiff > 1) {
        break; // Streak broken
      }
      // If dayDiff === 0, it's the same day, continue
    }

    return streak;
  }

  /**
   * Calculate streak days within a specific period
   */
  private calculateStreakDaysInPeriod(startDate: Date, endDate: Date): number {
    const periodLogs = this.habitLogs.filter(log =>
      log.timestamp >= startDate && log.timestamp <= endDate && log.completed
    );

    if (periodLogs.length === 0) return 0;

    // Group by date
    const dateGroups: Record<string, boolean> = {};
    periodLogs.forEach(log => {
      const dateKey = log.timestamp.toDateString();
      dateGroups[dateKey] = true;
    });

    const dates = Object.keys(dateGroups).sort();
    if (dates.length === 0) return 0;

    let streak = 1;
    let currentDate = new Date(dates[0]);

    for (let i = 1; i < dates.length; i++) {
      const nextDate = new Date(dates[i]);
      const dayDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        streak++;
        currentDate = nextDate;
      } else if (dayDiff > 1) {
        break;
      }
    }

    return streak;
  }

  /**
   * Get the most completed habit category
   */
  private getFavoriteCategory(): string {
    const categoryCount: Record<string, number> = {};

    this.habitLogs
      .filter(log => log.completed)
      .forEach(log => {
        const habit = defaultHabits.find(h => h.habitId === log.habitId);
        if (habit) {
          categoryCount[habit.category] = (categoryCount[habit.category] || 0) + 1;
        }
      });

    const favorite = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0];

    return favorite ? favorite[0] : '';
  }

  /**
   * Get favorite category within a specific period
   */
  private getFavoriteCategoryInPeriod(startDate: Date, endDate: Date): string {
    const periodLogs = this.habitLogs.filter(log =>
      log.timestamp >= startDate && log.timestamp <= endDate && log.completed
    );

    const categoryCount: Record<string, number> = {};

    periodLogs.forEach(log => {
      const habit = defaultHabits.find(h => h.habitId === log.habitId);
      if (habit) {
        categoryCount[habit.category] = (categoryCount[habit.category] || 0) + 1;
      }
    });

    const favorite = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0];

    return favorite ? favorite[0] : '';
  }

  /**
   * Get daily completion data for the last N days
   */
  getDailyCompletionData(days: number = 30): Array<{ date: string; completed: number }> {
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateKey = date.toDateString();

      const completedCount = this.habitLogs.filter(log =>
        log.timestamp.toDateString() === dateKey && log.completed
      ).length;

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: completedCount
      });
    }

    return data;
  }

  /**
   * Get energy level distribution
   */
  getEnergyLevelDistribution(): Array<{ level: string; count: number; percentage: number }> {
    const total = this.habitLogs.length;
    if (total === 0) return [];

    const levelCount: Record<string, number> = {};

    this.habitLogs.forEach(log => {
      const level = this.getEnergyLevelLabel(log.energyLevelAtSuggestion);
      levelCount[level] = (levelCount[level] || 0) + 1;
    });

    return Object.entries(levelCount)
      .map(([level, count]) => ({
        level,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Convert energy level number to label
   */
  private getEnergyLevelLabel(level: number): string {
    if (level <= 2) return 'Low';
    if (level <= 3) return 'Medium';
    return 'High';
  }
}

