import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          animationTypeForReplace: 'push',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          presentation: 'card',
        }}>
        <Stack.Screen 
          name="+not-found" 
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="auth" 
          options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="login" 
          options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="signup" 
          options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
