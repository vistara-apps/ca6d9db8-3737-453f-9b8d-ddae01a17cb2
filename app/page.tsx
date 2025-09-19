'use client';

import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { EnergySlider } from '@/components/EnergySlider';

export default function Home() {
  const [energyLevel, setEnergyLevel] = useState(3);

  return (
    <AppShell>
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Energy Flow</h1>
          <p className="text-gray-300">Sync your energy, master your day with micro-habits</p>
        </div>

        <EnergySlider
          value={energyLevel}
          onChange={setEnergyLevel}
        />
      </div>
    </AppShell>
  );
}
