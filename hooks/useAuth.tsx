import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials, SignupCredentials, ProfileUpdateData, PreferencesUpdateData } from '@/types/auth';
import {
  createUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  updateUserPreferences,
  isAuthenticated,
} from '@/utils/auth';
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import storage keys for consistency
const AUTH_KEYS = {
  CURRENT_USER: '@auth_current_user',
  SESSION: '@auth_session',
  PREFERENCES: '@user_preferences',
  SESSIONS: '@user_sessions',
  ANALYTICS: '@user_analytics',
  ACHIEVEMENTS: '@user_achievements',
  CUSTOM_ROUTINES: '@user_custom_routines',
  OFFLINE_DATA: '@user_offline_data',
} as const;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: ProfileUpdateData) => Promise<void>;
  updatePreferences: (updates: PreferencesUpdateData) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  // Clerk hooks
  const { isLoaded: clerkLoaded, isSignedIn } = useClerkAuth();
  const { user: clerkUser } = useClerkUser();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (clerkLoaded) {
          if (isSignedIn && clerkUser) {
            // User is signed in with Clerk
            setIsAuth(true);
            
            // Get or create local user data
            let localUser = await getUser();
            
            if (!localUser) {
              // Create local user data from Clerk user
              localUser = {
                id: clerkUser.id,
                email: clerkUser.primaryEmailAddress?.emailAddress || '',
                firstName: clerkUser.firstName || '',
                lastName: clerkUser.lastName || '',
                bio: '',
                profilePicture: clerkUser.imageUrl,
                createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : new Date().toISOString(),
                updatedAt: clerkUser.updatedAt ? new Date(clerkUser.updatedAt).toISOString() : new Date().toISOString(),
                lastLoginAt: clerkUser.lastSignInAt ? new Date(clerkUser.lastSignInAt).toISOString() : new Date().toISOString(),
                isEmailVerified: clerkUser.primaryEmailAddress?.verification.status === 'verified',
                preferences: {
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
                },
                stats: {
                  totalSessions: 0,
                  totalMinutes: 0,
                  currentStreak: 0,
                  longestStreak: 0,
                  achievements: [],
                  averageSessionDuration: 0,
                },
              };
              
              // Save user data to AsyncStorage
              await AsyncStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(localUser));
              await AsyncStorage.setItem(AUTH_KEYS.PREFERENCES, JSON.stringify(localUser.preferences));
              await AsyncStorage.setItem(AUTH_KEYS.SESSIONS, JSON.stringify([]));
              await AsyncStorage.setItem(AUTH_KEYS.ANALYTICS, JSON.stringify({}));
              await AsyncStorage.setItem(AUTH_KEYS.CUSTOM_ROUTINES, JSON.stringify([]));
            } else {
              // Update existing local user with latest Clerk data
              localUser = {
                ...localUser,
                email: clerkUser.primaryEmailAddress?.emailAddress || localUser.email,
                firstName: clerkUser.firstName || localUser.firstName,
                lastName: clerkUser.lastName || localUser.lastName,
                profilePicture: clerkUser.imageUrl || localUser.profilePicture,
                isEmailVerified: clerkUser.primaryEmailAddress?.verification.status === 'verified',
                lastLoginAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              
              // Save updated user data to AsyncStorage
              await AsyncStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(localUser));
            }
            
            setUser(localUser);
          } else {
            // User is signed out
            setIsAuth(false);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [clerkLoaded, isSignedIn, clerkUser]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // Note: Clerk handles the actual sign-in through their UI
      // This is mainly for local state management
      const user = await loginUser(credentials);
      if (user) {
        setUser(user);
        setIsAuth(true);
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // Note: Clerk handles the actual sign-up through their UI
      // This is mainly for local state management
      const user = await createUser(userData);
      setUser(user);
      setIsAuth(true);
    } catch (error: any) {
      setError(error.message || 'Signup failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await logoutUser();
      setUser(null);
      setIsAuth(false);
    } catch (error: any) {
      setError(error.message || 'Logout failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: ProfileUpdateData) => {
    try {
      setError(null);
      
      const updatedUser = await updateUser(updates);
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const updatePreferences = async (updates: PreferencesUpdateData) => {
    try {
      setError(null);
      
      const updatedUser = await updateUserPreferences(updates);
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to update preferences');
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: isAuth,
    login,
    signup,
    logout,
    updateProfile,
    updatePreferences,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 