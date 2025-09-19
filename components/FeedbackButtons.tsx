'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';

interface FeedbackButtonsProps {
  onFeedback: (feedback: 'helpful' | 'not_helpful') => void;
  disabled?: boolean;
  className?: string;
}

export function FeedbackButtons({ onFeedback, disabled = false, className = '' }: FeedbackButtonsProps) {
  return (
    <div className={`flex space-x-3 ${className}`}>
      <PrimaryButton
        variant="secondary"
        size="sm"
        onClick={() => onFeedback('helpful')}
        disabled={disabled}
        className="flex items-center space-x-2 bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-400 hover:text-green-300"
      >
        <ThumbsUp className="w-4 h-4" />
        <span>Helpful</span>
      </PrimaryButton>

      <PrimaryButton
        variant="secondary"
        size="sm"
        onClick={() => onFeedback('not_helpful')}
        disabled={disabled}
        className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400 hover:text-red-300"
      >
        <ThumbsDown className="w-4 h-4" />
        <span>Not Helpful</span>
      </PrimaryButton>
    </div>
  );
}

