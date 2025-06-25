export type BreathingSpeed = 'Fast' | 'Medium' | 'Slow';

export interface RoutineRound {
  breaths: number;
  breathSpeed: BreathingSpeed;
  exhaleHold: number;
  inhaleHold: number;
  finalHold?: boolean;
}

export interface Routine {
  id: string;
  routineName: string;
  description?: string;
  rounds: RoutineRound[];
  isPreset?: boolean;
}

export type SessionPhase = 'breathing' | 'exhaleHold' | 'inhaleHold' | 'completed';

export interface SessionState {
  currentRound: number;
  currentPhase: SessionPhase;
  currentBreath: number;
  timeRemaining: number;
  isPaused: boolean;
}