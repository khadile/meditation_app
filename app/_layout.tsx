import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider, tokenCache, CLERK_PUBLISHABLE_KEY } from '@/utils/clerkConfig';
import { useAuth as useClerkAuth } from '@clerk/clerk-expo';
import { View, Text, ActivityIndicator } from 'react-native';
import { AuthProvider } from '@/hooks/useAuth';

// Loading component for auth initialization
const AuthLoading = () => (
  <View style={{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  }}>
    <ActivityIndicator size="large" color="#3b82f6" />
    <Text style={{ 
      marginTop: 16, 
      fontSize: 16, 
      color: '#64748b',
      fontWeight: '500'
    }}>
      Loading...
    </Text>
  </View>
);

// Auth wrapper component with redirect logic
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setIsInitialized(true);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthScreen = segments[0] === 'auth';

    if (!isSignedIn && !inAuthScreen) {
      // Redirect to auth screen if not signed in
      router.replace('/auth');
    } else if (isSignedIn && inAuthScreen) {
      // Redirect to main app if signed in
      router.replace('/(tabs)');
    }
  }, [isSignedIn, segments, isLoaded]);

  if (!isInitialized) {
    return <AuthLoading />;
  }

  return children;
};

export default function RootLayout() {
  return (
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <AuthProvider>
        <AuthWrapper>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 300,
            }}
          >
            <Stack.Screen
              name="auth"
              options={{
                animation: 'slide_from_bottom',
                animationDuration: 400,
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                animation: 'slide_from_bottom',
                animationDuration: 400,
              }}
            />
            <Stack.Screen
              name="signup"
              options={{
                animation: 'slide_from_bottom',
                animationDuration: 400,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                animation: 'slide_from_right',
                animationDuration: 300,
              }}
            />
            <Stack.Screen
              name="edit-profile"
              options={{
                animation: 'slide_from_right',
                animationDuration: 300,
              }}
            />
            <Stack.Screen
              name="+not-found"
              options={{
                animation: 'fade',
                animationDuration: 200,
              }}
            />
          </Stack>
        </AuthWrapper>
      </AuthProvider>
    </ClerkProvider>
  );
}
