'use client';

import { useState } from 'react';
import { ArrowRight, Wallet, CheckCircle } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';
import { EnergySlider } from './EnergySlider';
import { BaseClient } from '../lib/base-client';
import { User } from '../lib/types';

interface OnboardingFlowProps {
  onComplete: (user: User) => void;
  onSkip: () => void;
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [userName, setUserName] = useState('');

  const baseClient = new BaseClient();
  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      const user: User = {
        userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        farcasterId: undefined, // Would be populated from Farcaster integration
        walletAddress: walletAddress || undefined,
        preferredHabitCategories: [],
        habitHistory: [],
        feedbackData: []
      };

      onComplete(user);
    }
  };

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    try {
      const result = await baseClient.connectWallet();
      if (result) {
        setWalletAddress(result.address);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-colors duration-300 ${
            i + 1 <= step ? 'bg-primary' : 'bg-muted'
          }`}
        />
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">⚡</span>
        </div>
        <h1 className="text-3xl font-bold text-gradient">
          Welcome to Energy Flow
        </h1>
        <p className="text-lg text-text-secondary max-w-md mx-auto">
          Sync your energy, master your day with micro-habits that adapt to how you feel.
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-left max-w-sm mx-auto">
          <label className="block text-sm font-medium text-text-primary mb-2">
            What's your name? (Optional)
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text-primary">
          Connect Your Wallet
        </h2>
        <p className="text-text-secondary max-w-md mx-auto">
          Connect your Base wallet to unlock premium features and micro-transactions in the future.
        </p>
      </div>

      <div className="space-y-4">
        {!walletAddress ? (
          <PrimaryButton
            onClick={handleConnectWallet}
            loading={isConnectingWallet}
            className="flex items-center justify-center space-x-2"
          >
            <Wallet className="w-5 h-5" />
            <span>Connect Base Wallet</span>
          </PrimaryButton>
        ) : (
          <div className="flex items-center justify-center space-x-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Wallet Connected</span>
          </div>
        )}

        <p className="text-sm text-text-secondary">
          Optional - you can connect later in settings
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-text-primary">
          How are you feeling right now?
        </h2>
        <p className="text-text-secondary max-w-md mx-auto">
          This helps us suggest the perfect micro-habit for your current energy level.
        </p>
      </div>

      <EnergySlider
        value={energyLevel}
        onChange={setEnergyLevel}
        className="max-w-md mx-auto"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {renderStepIndicator()}

        <div className="w-full max-w-lg">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={onSkip}
            className="text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            Skip for now
          </button>

          <PrimaryButton
            onClick={handleNext}
            className="flex items-center space-x-2"
          >
            <span>{step === totalSteps ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

