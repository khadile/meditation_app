import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { presetRoutines } from '@/data/presetRoutines';
import { Routine } from '@/types/breathing';
import { getSpeedColor } from '@/utils/breathingTimer';
import { Clock, Zap, Target, Plus, ArrowLeft, Trash2 } from 'lucide-react-native';
import { getCustomRoutines, deleteCustomRoutine } from '@/utils/storage';

const { width } = Dimensions.get('window');

interface RoutineCardProps {
  routine: Routine;
  onPress: () => void;
}

// Function to get gradient colors based on routine type
const getRoutineGradient = (routine: Routine): [string, string, string] => {
  if (!routine.isPreset) {
    // Custom routines get the default blue gradient
    return ['#1e3a8a', '#1e40af', '#3b82f6'];
  }

  switch (routine.id) {
    case 'beginner':
      // Soft blue for beginners - gentle and welcoming
      return ['#3b82f6', '#60a5fa', '#93c5fd'];
    case 'energizer':
      // Vibrant orange for energy and morning vibes
      return ['#ea580c', '#f97316', '#fb923c'];
    case 'calm':
      // Soothing purple for evening calm
      return ['#7c3aed', '#8b5cf6', '#a78bfa'];
    case 'advanced':
      // Intense red for advanced challenge
      return ['#dc2626', '#ef4444', '#f87171'];
    default:
      // Default blue gradient
      return ['#1e3a8a', '#1e40af', '#3b82f6'];
  }
};

function RoutineCard({ routine, onPress }: RoutineCardProps) {
  const totalDuration = routine.rounds.reduce((total, round) => {
    const breathingTime = (round.breaths * 2) / 60; // roughly 2 seconds per breath cycle
    const holdTime = (round.exhaleHold + round.inhaleHold) / 60;
    return total + breathingTime + holdTime;
  }, 0);

  const averageSpeed = routine.rounds[0]?.breathSpeed || 'Medium';
  const gradientColors = getRoutineGradient(routine);

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={gradientColors}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{routine.routineName}</Text>
            <View
              style={[
                styles.speedBadge,
                { backgroundColor: getSpeedColor(averageSpeed) },
              ]}>
              <Text style={styles.speedText}>{averageSpeed}</Text>
            </View>
          </View>

          <Text style={styles.cardDescription}>{routine.description}</Text>

          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Target size={16} color="#93c5fd" />
              <Text style={styles.statText}>{routine.rounds.length} rounds</Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={16} color="#93c5fd" />
              <Text style={styles.statText}>{Math.round(totalDuration)} min</Text>
            </View>
            <View style={styles.statItem}>
              <Zap size={16} color="#93c5fd" />
              <Text style={styles.statText}>
                {routine.rounds[0]?.breaths || 30} breaths
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

export default function WimHofScreen() {
  const [customRoutines, setCustomRoutines] = useState<Routine[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      loadCustomRoutines();
    }, [])
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const loadCustomRoutines = async () => {
    try {
      const routines = await getCustomRoutines();
      setCustomRoutines(routines);
    } catch (error) {
      console.error('Error loading custom routines:', error);
    }
  };

  const handleStartSession = (routine: Routine) => {
    router.push({
      pathname: '/(tabs)/routine-details',
      params: { routineData: JSON.stringify(routine) },
    });
  };

  const handleDeleteRoutine = async (routine: Routine) => {
    Alert.alert(
      'Delete Routine',
      `Are you sure you want to delete "${routine.routineName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCustomRoutine(routine.id);
              await loadCustomRoutines();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete routine. Please try again.');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <LinearGradient
          colors={["#ffffff", "#f3f4f6", "#e5e7eb"] as [import('react-native').ColorValue, import('react-native').ColorValue, import('react-native').ColorValue]}
          style={styles.container}>
          
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}>
              <ArrowLeft size={24} color="#222" />
            </TouchableOpacity>
            <Text style={styles.title}>Wim Hof Breathing</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.intro}>
            <Text style={styles.subtitle}>
              Choose a preset routine to begin your practice
            </Text>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}>
            {customRoutines.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Custom Routines</Text>
                <View style={styles.routinesGrid}>
                  {customRoutines.map((routine) => (
                    <RoutineCard
                      key={routine.id}
                      routine={routine}
                      onPress={() => handleStartSession(routine)}
                    />
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preset Routines</Text>
              <View style={styles.routinesGrid}>
                {presetRoutines.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    routine={routine}
                    onPress={() => handleStartSession(routine)}
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.customButton}
              onPress={() => router.push({
                pathname: '/(tabs)/custom',
                params: { fromScreen: 'wim-hof' }
              })}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#10b981', '#059669', '#047857']}
                style={styles.customButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <Plus size={24} color="white" />
                <Text style={styles.customButtonText}>Create Custom Routine</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    marginRight: 32,
  },
  headerSpacer: {
    width: 32,
  },
  intro: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  routinesGrid: {
    paddingHorizontal: 24,
  },
  cardWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    backgroundColor: '#f8fafc',
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardGradient: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  speedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
    elevation: 4,
    shadowColor: '#1a1a1a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  speedText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 4,
    fontWeight: '500',
  },
  customButton: {
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#1a1a1a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  customButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  customButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
});