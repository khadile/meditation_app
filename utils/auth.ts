import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  User, 
  LoginCredentials, 
  SignupCredentials, 
  ProfileUpdateData, 
  PreferencesUpdateData,
  SessionRecord,
  UserAnalytics,
  ClerkUser
} from '@/types/auth';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';

// Storage keys
const AUTH_KEYS = {
  CURRENT_USER: '@auth_current_user', // Store current user data
  SESSION: '@auth_session',
  PREFERENCES: '@user_preferences',
  SESSIONS: '@user_sessions',
  ANALYTICS: '@user_analytics',
  ACHIEVEMENTS: '@user_achievements',
  CUSTOM_ROUTINES: '@user_custom_routines',
  OFFLINE_DATA: '@user_offline_data', // Store offline data for sync
} as const;

// Default user preferences
const DEFAULT_PREFERENCES = {
  notifications: {
    enabled: true,
    sessionReminders: true,
    weeklyProgress: true,
    achievements: true,
  },
  app: {
    darkMode: false,
    soundEnabled: true,
    hapticFeedback: true,
    autoPlay: false,
  },
  privacy: {
    shareProgress: false,
    shareAchievements: true,
    analyticsEnabled: true,
  },
};

// Default user stats
const DEFAULT_STATS = {
  totalSessions: 0,
  totalMinutes: 0,
  currentStreak: 0,
  longestStreak: 0,
  achievements: [],
  averageSessionDuration: 0,
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

// Convert Clerk user to our User type
const clerkUserToUser = (clerkUser: ClerkUser, additionalData?: Partial<User>): User => {
  return {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddress || '',
    firstName: additionalData?.firstName || clerkUser.firstName || '',
    lastName: additionalData?.lastName || clerkUser.lastName || '',
    bio: additionalData?.bio || '',
    profilePicture: clerkUser.imageUrl || additionalData?.profilePicture,
    createdAt: new Date(clerkUser.createdAt).toISOString(),
    updatedAt: new Date(clerkUser.updatedAt).toISOString(),
    lastLoginAt: clerkUser.lastSignInAt ? new Date(clerkUser.lastSignInAt).toISOString() : new Date().toISOString(),
    isEmailVerified: clerkUser.primaryEmailAddress?.verification.status === 'verified',
    preferences: additionalData?.preferences || DEFAULT_PREFERENCES,
    stats: additionalData?.stats || DEFAULT_STATS,
  };
};

// User management
export const createUser = async (userData: SignupCredentials): Promise<User> => {
  try {
    // Note: Clerk handles user creation through their sign-up flow
    // This function is mainly for local data setup after Clerk sign-up
    
    const newUser: User = {
      id: `temp_${Date.now()}`, // Will be replaced with actual Clerk user ID
      email: userData.email.toLowerCase(),
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      bio: userData.bio?.trim() || '',
      profilePicture: userData.profilePicture,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isEmailVerified: false,
      preferences: DEFAULT_PREFERENCES,
      stats: DEFAULT_STATS,
    };

    // Store user data locally
    await AsyncStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(newUser));
    await AsyncStorage.setItem(AUTH_KEYS.PREFERENCES, JSON.stringify(DEFAULT_PREFERENCES));
    await AsyncStorage.setItem(AUTH_KEYS.SESSIONS, JSON.stringify([]));
    await AsyncStorage.setItem(AUTH_KEYS.ANALYTICS, JSON.stringify({}));
    await AsyncStorage.setItem(AUTH_KEYS.CUSTOM_ROUTINES, JSON.stringify([]));

    return newUser;
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create account. Please try again.');
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(AUTH_KEYS.CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const updateUser = async (updates: ProfileUpdateData): Promise<User | null> => {
  try {
    const user = await getUser();
    if (!user) return null;
    
    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Update local storage
    await AsyncStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

export const updateUserPreferences = async (updates: PreferencesUpdateData): Promise<User | null> => {
  try {
    const user = await getUser();
    if (!user) return null;
    
    const updatedPreferences = {
      notifications: {
        ...user.preferences.notifications,
        ...updates.notifications,
      },
      app: {
        ...user.preferences.app,
        ...updates.app,
      },
      privacy: {
        ...user.preferences.privacy,
        ...updates.privacy,
      },
    };
    
    const updatedUser: User = {
      ...user,
      preferences: updatedPreferences,
      updatedAt: new Date().toISOString(),
    };
    
    // Update local storage
    await AsyncStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    await AsyncStorage.setItem(AUTH_KEYS.PREFERENCES, JSON.stringify(updatedPreferences));
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return null;
  }
};

// Session management (offline-first)
export const recordSession = async (sessionData: Omit<SessionRecord, 'id' | 'userId'>): Promise<void> => {
  try {
    const user = await getUser();
    if (!user) {
      return;
    }
    
    const session: SessionRecord = {
      ...sessionData,
      id: generateSessionId(),
      userId: user.id,
    };
    
    const existingSessions = await getSessions();
    const updatedSessions = [session, ...existingSessions];
    
    await AsyncStorage.setItem(AUTH_KEYS.SESSIONS, JSON.stringify(updatedSessions));
    
    // Update user stats
    await updateUserStats(session);
    
    // Store in offline data for future sync
    await storeOfflineData('sessions', session);
  } catch (error) {
    console.error('Error recording session:', error);
  }
};

export const getSessions = async (): Promise<SessionRecord[]> => {
  try {
    const sessionsJson = await AsyncStorage.getItem(AUTH_KEYS.SESSIONS);
    return sessionsJson ? JSON.parse(sessionsJson) : [];
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
};

export const updateUserStats = async (session: SessionRecord): Promise<void> => {
  try {
    const user = await getUser();
    if (!user) return;
    
    const sessions = await getSessions();
    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    const averageSessionDuration = totalSessions > 0 ? totalMinutes / totalSessions : 0;
    
    // Calculate streak
    const currentStreak = calculateStreak(sessions);
    const longestStreak = Math.max(user.stats.longestStreak, currentStreak);
    
    const updatedStats = {
      ...user.stats,
      totalSessions,
      totalMinutes,
      currentStreak,
      longestStreak,
      averageSessionDuration,
      lastSessionDate: session.completedAt,
    };
    
    const updatedUser: User = {
      ...user,
      stats: updatedStats,
      updatedAt: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
};

// Analytics (offline-first)
export const getUserAnalytics = async (): Promise<UserAnalytics> => {
  try {
    const sessions = await getSessions();
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    
    const weeklySessions = sessions.filter(s => new Date(s.completedAt) >= oneWeekAgo);
    const monthlySessions = sessions.filter(s => new Date(s.completedAt) >= oneMonthAgo);
    const yearlySessions = sessions.filter(s => new Date(s.completedAt) >= oneYearAgo);
    
    return {
      weeklyProgress: {
        sessions: weeklySessions.length,
        minutes: weeklySessions.reduce((sum, s) => sum + s.duration, 0),
        streak: calculateStreak(sessions),
      },
      monthlyProgress: {
        sessions: monthlySessions.length,
        minutes: monthlySessions.reduce((sum, s) => sum + s.duration, 0),
        averageSessionDuration: monthlySessions.length > 0 
          ? monthlySessions.reduce((sum, s) => sum + s.duration, 0) / monthlySessions.length 
          : 0,
      },
      yearlyProgress: {
        sessions: yearlySessions.length,
        minutes: yearlySessions.reduce((sum, s) => sum + s.duration, 0),
        totalStreak: calculateStreak(sessions),
      },
    };
  } catch (error) {
    console.error('Error getting user analytics:', error);
    return {
      weeklyProgress: { sessions: 0, minutes: 0, streak: 0 },
      monthlyProgress: { sessions: 0, minutes: 0, averageSessionDuration: 0 },
      yearlyProgress: { sessions: 0, minutes: 0, totalStreak: 0 },
    };
  }
};

// Authentication (Clerk handles this, these are for local state management)
export const loginUser = async (credentials: LoginCredentials): Promise<User | null> => {
  try {
    // Note: Clerk handles authentication through their sign-in flow
    // This function is mainly for local data setup after Clerk sign-in
    
    // Get existing user data from local storage or create new
    let existingUser = await getUser();
    
    if (!existingUser) {
      // Create user object (will be updated with actual Clerk user data)
      existingUser = {
        id: `temp_${Date.now()}`,
        email: credentials.email.toLowerCase(),
        firstName: '',
        lastName: '',
        bio: '',
        profilePicture: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isEmailVerified: false,
        preferences: DEFAULT_PREFERENCES,
        stats: DEFAULT_STATS,
      };
    } else {
      // Update existing user
      existingUser = {
        ...existingUser,
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    // Store updated user data locally
    await AsyncStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(existingUser));
    
    return existingUser;
  } catch (error: any) {
    console.error('Error logging in user:', error);
    throw new Error('Login failed. Please check your credentials.');
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    // Clear local user data
    await AsyncStorage.multiRemove([
      AUTH_KEYS.CURRENT_USER,
      AUTH_KEYS.SESSION,
    ]);
  } catch (error) {
    console.error('Error logging out user:', error);
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    // Check if we have local user data
    const user = await getUser();
    return user !== null;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Offline data management
const storeOfflineData = async (type: string, data: any): Promise<void> => {
  try {
    const offlineDataJson = await AsyncStorage.getItem(AUTH_KEYS.OFFLINE_DATA);
    const offlineData = offlineDataJson ? JSON.parse(offlineDataJson) : {};
    
    if (!offlineData[type]) {
      offlineData[type] = [];
    }
    
    offlineData[type].push({
      ...data,
      timestamp: new Date().toISOString(),
      synced: false,
    });
    
    await AsyncStorage.setItem(AUTH_KEYS.OFFLINE_DATA, JSON.stringify(offlineData));
  } catch (error) {
    console.error('Error storing offline data:', error);
  }
};

// Utility functions
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const calculateStreak = (sessions: SessionRecord[]): number => {
  if (sessions.length === 0) return 0;
  
  const sortedSessions = sessions.sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const session of sortedSessions) {
    const sessionDate = new Date(session.completedAt);
    sessionDate.setHours(0, 0, 0, 0);
    
    const diffTime = currentDate.getTime() - sessionDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak + 1) {
      break;
    }
  }
  
  return streak;
}; 