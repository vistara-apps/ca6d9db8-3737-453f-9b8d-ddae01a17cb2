'use client';

import { useEffect, useState } from 'react';
import { ProgressStats } from '../lib/types';
import { formatDuration } from '../lib/utils';

interface ProgressMeterProps {
  stats: ProgressStats;
  variant?: 'circular' | 'bar';
  className?: string;
  animated?: boolean;
}

export function ProgressMeter({
  stats,
  variant = 'circular',
  className = '',
  animated = true
}: ProgressMeterProps) {
  const [animatedStats, setAnimatedStats] = useState({
    totalHabitsCompleted: 0,
    totalTimeSpent: 0
  });

  useEffect(() => {
    if (!animated) {
      setAnimatedStats({
        totalHabitsCompleted: stats.totalHabitsCompleted,
        totalTimeSpent: stats.totalTimeSpent
      });
      return;
    }

    const duration = 1000; // 1 second animation
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        totalHabitsCompleted: Math.floor(stats.totalHabitsCompleted * progress),
        totalTimeSpent: Math.floor(stats.totalTimeSpent * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats({
          totalHabitsCompleted: stats.totalHabitsCompleted,
          totalTimeSpent: stats.totalTimeSpent
        });
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [stats, animated]);

  if (variant === 'circular') {
    const percentage = Math.min((animatedStats.totalHabitsCompleted / Math.max(stats.totalHabitsCompleted || 1, 10)) * 100, 100);
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`flex flex-col items-center space-y-4 ${className}`}>
        <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-muted"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {animatedStats.totalHabitsCompleted}
              </div>
              <div className="text-xs text-text-secondary">habits</div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-1">
          <div className="text-sm font-medium text-text-primary">
            {formatDuration(animatedStats.totalTimeSpent)}
          </div>
          <div className="text-xs text-text-secondary">
            Time invested in growth
          </div>
          {stats.streakDays > 0 && (
            <div className="text-xs text-accent font-medium">
              🔥 {stats.streakDays} day streak
            </div>
          )}
        </div>
      </div>
    );
  }

  // Bar variant
  const maxHabits = Math.max(stats.totalHabitsCompleted, 10);
  const percentage = (animatedStats.totalHabitsCompleted / maxHabits) * 100;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-text-primary">
          Progress This Week
        </span>
        <span className="text-sm text-text-secondary">
          {animatedStats.totalHabitsCompleted}/{maxHabits} habits
        </span>
      </div>

      <div className="w-full bg-muted rounded-full h-3">
        <div
          className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-text-secondary">
        <span>{formatDuration(animatedStats.totalTimeSpent)} invested</span>
        {stats.favoriteCategory && (
          <span>🎯 {stats.favoriteCategory}</span>
        )}
      </div>
    </div>
  );
}

