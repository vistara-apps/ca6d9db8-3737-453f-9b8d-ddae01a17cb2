'use client';

import { useState } from 'react';
import { Clock, CheckCircle, Play, Star } from 'lucide-react';
import { Habit } from '../lib/types';
import { PrimaryButton } from './PrimaryButton';
import { FeedbackButtons } from './FeedbackButtons';
import { formatDuration } from '../lib/utils';

interface HabitSuggestionCardProps {
  habit: Habit;
  onComplete: (habitId: string) => void;
  onFeedback: (habitId: string, feedback: 'helpful' | 'not_helpful') => void;
  onAddToWorkflow: (habitId: string) => void;
  variant?: 'default' | 'compact';
  className?: string;
}

export function HabitSuggestionCard({
  habit,
  onComplete,
  onFeedback,
  onAddToWorkflow,
  variant = 'default',
  className = ''
}: HabitSuggestionCardProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    setShowFeedback(true);
    onComplete(habit.habitId);
  };

  const handleFeedback = (feedback: 'helpful' | 'not_helpful') => {
    setFeedbackGiven(true);
    onFeedback(habit.habitId, feedback);
  };

  const handleAddToWorkflow = () => {
    onAddToWorkflow(habit.habitId);
  };

  if (variant === 'compact') {
    return (
      <div className={`energy-card ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-text-primary text-sm">{habit.name}</h4>
            <p className="text-text-secondary text-xs mt-1">{habit.description}</p>
          </div>
          <div className="flex items-center space-x-2 ml-3">
            <div className="flex items-center text-text-secondary text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(habit.durationMinutes)}
            </div>
            <PrimaryButton
              size="sm"
              onClick={handleComplete}
              disabled={isCompleted}
              className="px-3 py-1"
            >
              {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`energy-card hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-accent uppercase tracking-wide">
              {habit.category}
            </span>
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            {habit.name}
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {habit.description}
          </p>
        </div>
      </div>

      {/* Duration */}
      <div className="flex items-center text-text-secondary text-sm mb-4">
        <Clock className="w-4 h-4 mr-2" />
        <span>{formatDuration(habit.durationMinutes)}</span>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-text-primary mb-3">How to do it:</h4>
        <ol className="space-y-2">
          {habit.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start text-sm text-text-secondary">
              <span className="flex-shrink-0 w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                {index + 1}
              </span>
              {instruction}
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        {!isCompleted ? (
          <div className="flex space-x-3">
            <PrimaryButton
              onClick={handleComplete}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Start Habit</span>
            </PrimaryButton>

            <PrimaryButton
              variant="secondary"
              onClick={handleAddToWorkflow}
              className="px-4"
            >
              Add to Workflow
            </PrimaryButton>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="flex items-center justify-center space-x-2 text-green-400 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Habit Completed!</span>
            </div>
            <p className="text-sm text-text-secondary">
              Great job! How was this habit for you?
            </p>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && !feedbackGiven && (
          <div className="border-t border-border pt-4">
            <p className="text-sm text-text-secondary mb-3 text-center">
              Was this suggestion helpful?
            </p>
            <FeedbackButtons
              onFeedback={handleFeedback}
              className="justify-center"
            />
          </div>
        )}

        {feedbackGiven && (
          <div className="text-center py-2">
            <p className="text-sm text-text-secondary">
              Thanks for your feedback! We'll use it to improve future suggestions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

