import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getBreathingDuration } from '@/utils/breathingTimer';

const { width } = Dimensions.get('window');

interface BreathingAnimationProps {
  isBreathing: boolean;
  breathSpeed: 'Fast' | 'Medium' | 'Slow';
  phase: 'inhale' | 'exhale' | 'hold';
}

export default function BreathingAnimation({ 
  isBreathing, 
  breathSpeed, 
  phase 
}: BreathingAnimationProps) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  const getDuration = () => getBreathingDuration(breathSpeed);

  useEffect(() => {
    if (!isBreathing) {
      // Reset to neutral state
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.6,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    const breathingLoop = () => {
      // Inhale (expand)
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: getDuration() / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: getDuration() / 2,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Exhale (contract)
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: getDuration() / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: getDuration() / 2,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isBreathing) {
            breathingLoop();
          }
        });
      });
    };

    breathingLoop();
  }, [isBreathing, breathSpeed, scaleAnim, opacityAnim]);

  // Hold state animation
  useEffect(() => {
    if (phase === 'hold') {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: phase === 'hold' ? 1.0 : 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [phase, scaleAnim, opacityAnim]);

  const getGradientColors = () => {
    switch (phase) {
      case 'inhale':
        return ['#3b82f6', '#1d4ed8', '#1e40af'] as const;
      case 'exhale':
        return ['#10b981', '#059669', '#047857'] as const;
      case 'hold':
        return ['#f59e0b', '#d97706', '#b45309'] as const;
      default:
        return ['#6366f1', '#4f46e5', '#4338ca'] as const;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.breathingCircle,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}>
        <LinearGradient
          colors={getGradientColors()}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={styles.innerCircle} />
        </LinearGradient>
      </Animated.View>
      
      {/* Outer ring for visual depth */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            transform: [{ scale: scaleAnim }],
            opacity: Animated.multiply(opacityAnim, 0.3),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: width * 0.8,
    width: width * 0.8,
  },
  breathingCircle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.6) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: '60%',
    height: '60%',
    borderRadius: (width * 0.36) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  outerRing: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});