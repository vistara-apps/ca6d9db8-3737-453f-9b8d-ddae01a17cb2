import { EnergyLevel } from './types';

export const energyLevels: EnergyLevel[] = [
  { value: 1, label: 'Very Low', color: 'hsl(0, 70%, 50%)' },
  { value: 2, label: 'Low', color: 'hsl(30, 70%, 50%)' },
  { value: 3, label: 'Medium', color: 'hsl(60, 80%, 50%)' },
  { value: 4, label: 'High', color: 'hsl(90, 60%, 50%)' },
  { value: 5, label: 'Very High', color: 'hsl(120, 60%, 50%)' },
];

export function getEnergyCategory(value: number): 'low' | 'medium' | 'high' {
  if (value <= 2) return 'low';
  if (value <= 3) return 'medium';
  return 'high';
}

export function getEnergyColor(value: number): string {
  const level = energyLevels.find(l => l.value === value);
  return level?.color || 'hsl(60, 80%, 50%)';
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
