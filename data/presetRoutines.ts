import { Routine } from '@/types/breathing';

export const presetRoutines: Routine[] = [
  {
    id: 'quick-5min',
    routineName: '5-Minute Quick Start',
    description: 'Perfect for a quick energy boost and focus',
    isPreset: true,
    rounds: [
      {
        breaths: 20,
        breathSpeed: 'Fast',
        exhaleHold: 30,
        inhaleHold: 10,
      },
      {
        breaths: 20,
        breathSpeed: 'Fast',
        exhaleHold: 45,
        inhaleHold: 10,
      },
    ],
  },
  {
    id: 'beginner',
    routineName: 'Beginner Flow',
    description: 'Perfect for starting your Wim Hof journey',
    isPreset: true,
    rounds: [
      {
        breaths: 30,
        breathSpeed: 'Medium',
        exhaleHold: 60,
        inhaleHold: 15,
      },
      {
        breaths: 30,
        breathSpeed: 'Medium',
        exhaleHold: 90,
        inhaleHold: 15,
      },
      {
        breaths: 30,
        breathSpeed: 'Medium',
        exhaleHold: 120,
        inhaleHold: 15,
      },
    ],
  },
  {
    id: 'energizer',
    routineName: 'Morning Energizer',
    description: 'Boost your energy for the day ahead',
    isPreset: true,
    rounds: [
      {
        breaths: 40,
        breathSpeed: 'Fast',
        exhaleHold: 45,
        inhaleHold: 15,
      },
      {
        breaths: 40,
        breathSpeed: 'Fast',
        exhaleHold: 60,
        inhaleHold: 15,
      },
      {
        breaths: 40,
        breathSpeed: 'Fast',
        exhaleHold: 75,
        inhaleHold: 15,
      },
      {
        breaths: 40,
        breathSpeed: 'Fast',
        exhaleHold: 90,
        inhaleHold: 15,
      },
    ],
  },
  {
    id: 'calm',
    routineName: 'Evening Calm',
    description: 'Relax and unwind with slower breathing',
    isPreset: true,
    rounds: [
      {
        breaths: 25,
        breathSpeed: 'Slow',
        exhaleHold: 90,
        inhaleHold: 20,
      },
      {
        breaths: 25,
        breathSpeed: 'Slow',
        exhaleHold: 105,
        inhaleHold: 20,
      },
      {
        breaths: 25,
        breathSpeed: 'Slow',  
        exhaleHold: 120,
        inhaleHold: 20,
      },
    ],
  },
  {
    id: 'advanced',
    routineName: 'Advanced Challenge',
    description: 'For experienced practitioners seeking intensity',
    isPreset: true,
    rounds: [
      {
        breaths: 50,
        breathSpeed: 'Fast',
        exhaleHold: 60,
        inhaleHold: 15,
      },
      {
        breaths: 50,
        breathSpeed: 'Fast',
        exhaleHold: 90,
        inhaleHold: 15,
      },
      {
        breaths: 50,
        breathSpeed: 'Fast',
        exhaleHold: 120,
        inhaleHold: 15,
      },
      {
        breaths: 50,
        breathSpeed: 'Fast',
        exhaleHold: 150,
        inhaleHold: 15,
        finalHold: true,
      },
    ],
  },
];