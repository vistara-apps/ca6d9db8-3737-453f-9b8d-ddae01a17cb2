'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '../components/AppShell';
import { OnboardingFlow } from '../components/OnboardingFlow';
import { DailyFlow } from '../components/DailyFlow';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { User } from '../lib/types';
import { StorageManager } from '../lib/storage';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Load user data on app start
    const loadUserData = async () => {
      try {
        const savedUser = StorageManager.loadUser();
        if (savedUser) {
          setUser(savedUser);
        } else {
          // First time user - show onboarding
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setShowOnboarding(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleOnboardingComplete = (newUser: User) => {
    setUser(newUser);
    setShowOnboarding(false);
    // Save user data
    StorageManager.saveUser(newUser);
  };

  const handleOnboardingSkip = () => {
    // Create anonymous user
    const anonymousUser: User = {
      userId: `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      preferredHabitCategories: [],
      habitHistory: [],
      feedbackData: []
    };

    setUser(anonymousUser);
    setShowOnboarding(false);
    StorageManager.saveUser(anonymousUser);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    // Save updated user data
    StorageManager.saveUser(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Energy Flow..." />
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <ErrorBoundary>
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      </ErrorBoundary>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-text-secondary">Setting up your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AppShell>
        <DailyFlow
          user={user}
          onUpdateUser={handleUpdateUser}
        />
      </AppShell>
    </ErrorBoundary>
  );
}

