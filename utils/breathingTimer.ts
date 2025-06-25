import { BreathingSpeed } from '@/types/breathing';

export const getBreathingDuration = (speed: BreathingSpeed): number => {
  switch (speed) {
    case 'Fast':
      return 4000; // 2 second per breath
    case 'Medium':
      return 6000; // 5 seconds per breath
    case 'Slow':
      return 8000; // 8 seconds per breath
    default:
      return 1500;
  }
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getSpeedColor = (speed: BreathingSpeed): string => {
  switch (speed) {
    case 'Fast':
      return '#ef4444'; // red
    case 'Medium':
      return '#f59e0b'; // amber
    case 'Slow':
      return '#10b981'; // emerald
    default:
      return '#6b7280'; // gray
  }
};