export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  isEmailVerified: boolean;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  notifications: {
    enabled: boolean;
    sessionReminders: boolean;
    weeklyProgress: boolean;
    achievements: boolean;
  };
  app: {
    darkMode: boolean;
    soundEnabled: boolean;
    hapticFeedback: boolean;
    autoPlay: boolean;
  };
  privacy: {
    shareProgress: boolean;
    shareAchievements: boolean;
    analyticsEnabled: boolean;
  };
}

export interface UserStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  achievements: string[];
  averageSessionDuration: number;
  lastSessionDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  progress?: number;
  maxProgress?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePicture?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePicture?: string;
}

export interface PreferencesUpdateData {
  notifications?: Partial<UserPreferences['notifications']>;
  app?: Partial<UserPreferences['app']>;
  privacy?: Partial<UserPreferences['privacy']>;
}

// Session tracking types
export interface SessionRecord {
  id: string;
  userId: string;
  routineId: string;
  routineName: string;
  duration: number; // in minutes
  completedAt: string;
  notes?: string;
  rating?: number; // 1-5 stars
}

// Analytics types
export interface UserAnalytics {
  weeklyProgress: {
    sessions: number;
    minutes: number;
    streak: number;
  };
  monthlyProgress: {
    sessions: number;
    minutes: number;
    averageSessionDuration: number;
  };
  yearlyProgress: {
    sessions: number;
    minutes: number;
    totalStreak: number;
  };
}

// Clerk-specific types
export interface ClerkUser {
  id: string;
  emailAddresses: Array<{
    emailAddress: string;
    id: string;
    linkedTo: Array<{ id: string; type: string }>;
    object: string;
    verification: {
      status: string;
      strategy: string;
    };
  }>;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
  lastSignInAt?: number;
  emailAddress?: string;
  primaryEmailAddress?: {
    emailAddress: string;
    id: string;
    verification: {
      status: string;
      strategy: string;
    };
  };
}

// Offline sync types
export interface OfflineDataItem {
  id: string;
  type: 'session' | 'profile_update' | 'preference_update';
  data: any;
  timestamp: string;
  synced: boolean;
}

export interface SyncStatus {
  lastSync: string;
  pendingItems: number;
  isOnline: boolean;
  syncInProgress: boolean;
} 