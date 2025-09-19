'use client';

import { useState } from 'react';
import { energyLevels, getEnergyColor } from '../lib/utils';

interface EnergySliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function EnergySlider({ value, onChange, className = '' }: EnergySliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  const currentLevel = energyLevels.find(level => level.value === value);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          How's your energy right now?
        </h3>
        <div 
          className="text-2xl font-bold transition-colors duration-300"
          style={{ color: getEnergyColor(value) }}
        >
          {currentLevel?.label}
        </div>
      </div>

      <div className="relative">
        {/* Energy level indicators */}
        <div className="flex justify-between mb-2 px-1">
          {energyLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => onChange(level.value)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                value === level.value 
                  ? 'scale-125 ring-2 ring-white ring-opacity-50' 
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: level.color }}
              aria-label={level.label}
            />
          ))}
        </div>

        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min="1"
            max="5"
            value={value}
            onChange={handleSliderChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer energy-gradient"
            style={{
              background: `linear-gradient(90deg, 
                hsl(0, 70%, 50%) 0%, 
                hsl(30, 70%, 50%) 25%, 
                hsl(60, 80%, 50%) 50%, 
                hsl(90, 60%, 50%) 75%, 
                hsl(120, 60%, 50%) 100%)`
            }}
          />
          
          {/* Custom slider thumb */}
          <div
            className={`absolute top-1/2 w-6 h-6 bg-white rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-200 ${
              isDragging ? 'scale-125' : ''
            }`}
            style={{
              left: `calc(${((value - 1) / 4) * 100}% - 12px)`,
              boxShadow: `0 2px 8px ${getEnergyColor(value)}40`
            }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-2 text-xs text-text-secondary">
          <span>Drained</span>
          <span>Energized</span>
        </div>
      </div>
    </div>
  );
}
