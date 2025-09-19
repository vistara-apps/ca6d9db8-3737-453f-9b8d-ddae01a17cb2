import { User, HabitLog, FeedbackData } from './types';

const STORAGE_KEYS = {
  USER: 'energy_flow_user',
  HABIT_LOGS: 'energy_flow_habit_logs',
  FEEDBACK_DATA: 'energy_flow_feedback_data',
  SETTINGS: 'energy_flow_settings'
};

export class StorageManager {
  /**
   * Save user data to localStorage
   */
  static saveUser(user: User): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  /**
   * Load user data from localStorage
   */
  static loadUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) {
        const user = JSON.parse(data);
        // Convert date strings back to Date objects
        if (user.habitHistory) {
          user.habitHistory = user.habitHistory.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp)
          }));
        }
        if (user.feedbackData) {
          user.feedbackData = user.feedbackData.map((feedback: any) => ({
            ...feedback,
            timestamp: new Date(feedback.timestamp)
          }));
        }
        return user;
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
    return null;
  }

  /**
   * Save habit logs to localStorage
   */
  static saveHabitLogs(logs: HabitLog[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HABIT_LOGS, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving habit logs:', error);
    }
  }

  /**
   * Load habit logs from localStorage
   */
  static loadHabitLogs(): HabitLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABIT_LOGS);
      if (data) {
        const logs = JSON.parse(data);
        // Convert date strings back to Date objects
        return logs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading habit logs:', error);
    }
    return [];
  }

  /**
   * Save feedback data to localStorage
   */
  static saveFeedbackData(feedback: FeedbackData[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FEEDBACK_DATA, JSON.stringify(feedback));
    } catch (error) {
      console.error('Error saving feedback data:', error);
    }
  }

  /**
   * Load feedback data from localStorage
   */
  static loadFeedbackData(): FeedbackData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK_DATA);
      if (data) {
        const feedback = JSON.parse(data);
        // Convert date strings back to Date objects
        return feedback.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading feedback data:', error);
    }
    return [];
  }

  /**
   * Save app settings
   */
  static saveSettings(settings: Record<string, any>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  /**
   * Load app settings
   */
  static loadSettings(): Record<string, any> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading settings:', error);
      return {};
    }
  }

  /**
   * Clear all stored data
   */
  static clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  /**
   * Export all user data
   */
  static exportData(): string {
    try {
      const data = {
        user: this.loadUser(),
        habitLogs: this.loadHabitLogs(),
        feedbackData: this.loadFeedbackData(),
        settings: this.loadSettings(),
        exportDate: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  }

  /**
   * Import user data
   */
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.user) this.saveUser(data.user);
      if (data.habitLogs) this.saveHabitLogs(data.habitLogs);
      if (data.feedbackData) this.saveFeedbackData(data.feedbackData);
      if (data.settings) this.saveSettings(data.settings);

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   */
  static isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  static getStorageInfo(): { used: number; available: number; percentage: number } {
    if (!this.isStorageAvailable()) {
      return { used: 0, available: 0, percentage: 0 };
    }

    try {
      // Estimate storage usage (rough approximation)
      let used = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          used += data.length * 2; // Rough estimate: 2 bytes per character
        }
      });

      // LocalStorage typically has 5-10MB limit
      const available = 5 * 1024 * 1024; // 5MB in bytes
      const percentage = (used / available) * 100;

      return { used, available, percentage };
    } catch {
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

