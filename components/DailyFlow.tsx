'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Calendar } from 'lucide-react';
import { EnergySlider } from './EnergySlider';
import { HabitSuggestionCard } from './HabitSuggestionCard';
import { ProgressMeter } from './ProgressMeter';
import { PrimaryButton } from './PrimaryButton';
import { LoadingSpinner } from './LoadingSpinner';
import { HabitEngine } from '../lib/habit-engine';
import { ProgressTracker } from '../lib/progress-tracker';
import { OpenAIClient } from '../lib/openai-client';
import { User, Habit, HabitLog, FeedbackData, ProgressStats } from '../lib/types';
import { getEnergyCategory } from '../lib/utils';

interface DailyFlowProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export function DailyFlow({ user, onUpdateUser }: DailyFlowProps) {
  const [energyLevel, setEnergyLevel] = useState(3);
  const [currentHabit, setCurrentHabit] = useState<Habit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalHabitsCompleted: 0,
    totalTimeSpent: 0,
    streakDays: 0,
    favoriteCategory: ''
  });

  const habitEngine = new HabitEngine(user);
  const progressTracker = new ProgressTracker(user.habitHistory || []);
  const openaiClient = new OpenAIClient();

  useEffect(() => {
    // Load progress stats on mount
    const stats = progressTracker.getOverallStats();
    setProgressStats(stats);
  }, [user.habitHistory]);

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    try {
      // Try to get AI-generated suggestion first
      const suggestions = await openaiClient.generateHabitSuggestions(
        energyLevel,
        user.habitHistory?.map(log => log.habitId),
        user.preferredHabitCategories
      );

      if (suggestions.length > 0) {
        // Convert AI suggestion to Habit format
        const aiHabit: Habit = {
          habitId: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: suggestions[0].name,
          description: suggestions[0].description,
          category: suggestions[0].category,
          durationMinutes: suggestions[0].durationMinutes,
          energyLevel: suggestions[0].energyLevel,
          instructions: suggestions[0].instructions
        };
        setCurrentHabit(aiHabit);
      } else {
        // Fallback to engine suggestion
        const habit = habitEngine.suggestHabit(energyLevel);
        setCurrentHabit(habit);
      }
    } catch (error) {
      console.error('Error getting suggestion:', error);
      // Fallback to engine suggestion
      const habit = habitEngine.suggestHabit(energyLevel);
      setCurrentHabit(habit);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteHabit = (habitId: string) => {
    const log = habitEngine.recordHabitCompletion(habitId, energyLevel, true);

    // Update user data
    const updatedUser = {
      ...user,
      habitHistory: [...(user.habitHistory || []), log]
    };

    onUpdateUser(updatedUser);

    // Update progress stats
    const updatedStats = progressTracker.getOverallStats();
    setProgressStats(updatedStats);

    // Clear current habit to allow new suggestion
    setCurrentHabit(null);
  };

  const handleFeedback = (habitId: string, feedback: 'helpful' | 'not_helpful') => {
    const feedbackData = habitEngine.recordFeedback(habitId, feedback);

    // Update user data
    const updatedUser = {
      ...user,
      feedbackData: [...(user.feedbackData || []), feedbackData]
    };

    onUpdateUser(updatedUser);
  };

  const handleAddToWorkflow = (habitId: string) => {
    // This would integrate with calendar/reminder systems
    console.log('Adding habit to workflow:', habitId);
    // For now, just show a success message
    alert('Habit added to your daily workflow! 📅');
  };

  const toggleProgressView = () => {
    setShowProgress(!showProgress);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gradient">
          Energy Flow
        </h1>
        <p className="text-text-secondary">
          Sync your energy, master your day
        </p>
      </div>

      {/* Progress Toggle */}
      <div className="flex justify-center">
        <PrimaryButton
          variant="secondary"
          size="sm"
          onClick={toggleProgressView}
          className="flex items-center space-x-2"
        >
          <TrendingUp className="w-4 h-4" />
          <span>{showProgress ? 'Hide' : 'Show'} Progress</span>
        </PrimaryButton>
      </div>

      {/* Progress View */}
      {showProgress && (
        <div className="energy-card">
          <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
            Your Progress
          </h3>
          <ProgressMeter
            stats={progressStats}
            variant="bar"
            className="mb-4"
          />
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {progressStats.streakDays}
              </div>
              <div className="text-sm text-text-secondary">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {progressStats.favoriteCategory || 'None'}
              </div>
              <div className="text-sm text-text-secondary">Top Category</div>
            </div>
          </div>
        </div>
      )}

      {/* Energy Level Selection */}
      <div className="energy-card">
        <EnergySlider
          value={energyLevel}
          onChange={setEnergyLevel}
        />
      </div>

      {/* Habit Suggestion */}
      <div className="space-y-4">
        {!currentHabit ? (
          <div className="energy-card text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Ready for your next micro-habit?
                </h3>
                <p className="text-text-secondary">
                  Get a personalized suggestion based on your current energy level
                </p>
              </div>
              <PrimaryButton
                onClick={handleGetSuggestion}
                loading={isLoading}
                className="flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Get Suggestion</span>
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <HabitSuggestionCard
            habit={currentHabit}
            onComplete={handleCompleteHabit}
            onFeedback={handleFeedback}
            onAddToWorkflow={handleAddToWorkflow}
          />
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="energy-card text-center">
          <div className="text-xl font-bold text-primary">
            {progressStats.totalHabitsCompleted}
          </div>
          <div className="text-xs text-text-secondary">Habits Done</div>
        </div>
        <div className="energy-card text-center">
          <div className="text-xl font-bold text-accent">
            {Math.floor(progressStats.totalTimeSpent / 60)}h {progressStats.totalTimeSpent % 60}m
          </div>
          <div className="text-xs text-text-secondary">Time Invested</div>
        </div>
        <div className="energy-card text-center">
          <div className="text-xl font-bold text-secondary-500">
            {getEnergyCategory(energyLevel).toUpperCase()}
          </div>
          <div className="text-xs text-text-secondary">Current Energy</div>
        </div>
      </div>
    </div>
  );
}

