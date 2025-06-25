import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Routine, RoutineRound, BreathingSpeed } from '@/types/breathing';
import { getSpeedColor } from '@/utils/breathingTimer';
import { Plus, Minus, Play, Trash2, Copy, Save, ArrowLeft } from 'lucide-react-native';
import { saveCustomRoutine } from '@/utils/storage';

interface RoundEditorProps {
  round: RoutineRound;
  index: number;
  onUpdate: (index: number, round: RoutineRound) => void;
  onDelete: (index: number) => void;
  onDuplicate: (index: number) => void;
}

function RoundEditor({ round, index, onUpdate, onDelete, onDuplicate }: RoundEditorProps) {
  const updateRound = (updates: Partial<RoutineRound>) => {
    onUpdate(index, { ...round, ...updates });
  };

  const speedOptions: BreathingSpeed[] = ['Slow', 'Medium', 'Fast'];

  return (
    <View style={styles.roundCardWrapper}>
      <View style={styles.roundCard}>
        <View style={styles.roundHeader}>
          <Text style={styles.roundTitle}>Round {index + 1}</Text>
          <View style={styles.roundActions}>
            <TouchableOpacity onPress={() => onDuplicate(index)} style={styles.actionButton}>
              <Copy size={16} color="#60a5fa" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(index)} style={styles.actionButton}>
              <Trash2 size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Breath Count */}
        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Breaths</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              onPress={() => updateRound({ breaths: Math.max(10, round.breaths - 5) })}
              style={styles.counterButton}>
              <Minus size={16} color="white" />
            </TouchableOpacity>
            <Text style={styles.counterValue}>{round.breaths}</Text>
            <TouchableOpacity
              onPress={() => updateRound({ breaths: Math.min(100, round.breaths + 5) })}
              style={styles.counterButton}>
              <Plus size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Breath Speed */}
        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Speed</Text>
          <View style={styles.speedSelector}>
            {speedOptions.map((speed) => (
              <TouchableOpacity
                key={speed}
                onPress={() => updateRound({ breathSpeed: speed })}
                style={[
                  styles.speedOption,
                  {
                    backgroundColor: round.breathSpeed === speed ? getSpeedColor(speed) : '#374151',
                  },
                ]}>
                <Text
                  style={[
                    styles.speedOptionText,
                    {
                      color: round.breathSpeed === speed ? 'white' : '#9ca3af',
                    },
                  ]}>
                  {speed}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Exhale Hold */}
        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Exhale Hold (sec)</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              onPress={() => updateRound({ exhaleHold: Math.max(15, round.exhaleHold - 15) })}
              style={styles.counterButton}>
              <Minus size={16} color="white" />
            </TouchableOpacity>
            <Text style={styles.counterValue}>{round.exhaleHold}</Text>
            <TouchableOpacity
              onPress={() => updateRound({ exhaleHold: Math.min(300, round.exhaleHold + 15) })}
              style={styles.counterButton}>
              <Plus size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Inhale Hold */}
        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Inhale Hold (sec)</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              onPress={() => updateRound({ inhaleHold: Math.max(5, round.inhaleHold - 5) })}
              style={styles.counterButton}>
              <Minus size={16} color="white" />
            </TouchableOpacity>
            <Text style={styles.counterValue}>{round.inhaleHold}</Text>
            <TouchableOpacity
              onPress={() => updateRound({ inhaleHold: Math.min(60, round.inhaleHold + 5) })}
              style={styles.counterButton}>
              <Plus size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Final Hold Toggle */}
        <TouchableOpacity
          onPress={() => updateRound({ finalHold: !round.finalHold })}
          style={[
            styles.toggleButton,
            { backgroundColor: round.finalHold ? '#10b981' : '#374151' },
          ]}>
          <Text style={styles.toggleButtonText}>
            {round.finalHold ? '✓ Final Hold (Hold as long as possible)' : 'Make Final Hold Round'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CustomScreen() {
  const params = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Get the screen we came from for proper back navigation
  const fromScreen = params.fromScreen as string;
  
  const [routineName, setRoutineName] = useState(
    params.routineData ? JSON.parse(params.routineData as string).routineName : 'My Custom Routine'
  );
  const [rounds, setRounds] = useState<RoutineRound[]>(
    params.routineData
      ? JSON.parse(params.routineData as string).rounds
      : [
          {
            breaths: 30,
            breathSpeed: 'Medium',
            exhaleHold: 60,
            inhaleHold: 15,
          },
        ]
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Handle back navigation based on where we came from
  const handleBackNavigation = () => {
    if (fromScreen === 'index') {
      router.replace('/(tabs)');
    } else {
      router.replace('/(tabs)/wim-hof');
    }
  };

  const addRound = () => {
    const lastRound = rounds[rounds.length - 1];
    setRounds([
      ...rounds,
      {
        breaths: lastRound?.breaths || 30,
        breathSpeed: lastRound?.breathSpeed || 'Medium',
        exhaleHold: lastRound?.exhaleHold || 60,
        inhaleHold: lastRound?.inhaleHold || 15,
      },
    ]);
  };

  const updateRound = (index: number, round: RoutineRound) => {
    const newRounds = [...rounds];
    newRounds[index] = round;
    setRounds(newRounds);
  };

  const deleteRound = (index: number) => {
    if (rounds.length > 1) {
      setRounds(rounds.filter((_, i) => i !== index));
    } else {
      Alert.alert('Cannot Delete', 'You must have at least one round in your routine.');
    }
  };

  const duplicateRound = (index: number) => {
    const roundToDuplicate = { ...rounds[index] };
    const newRounds = [...rounds];
    newRounds.splice(index + 1, 0, roundToDuplicate);
    setRounds(newRounds);
  };

  const startCustomSession = () => {
    if (!routineName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for your routine.');
      return;
    }

    const customRoutine: Routine = {
      id: `custom-${Date.now()}`,
      routineName: routineName.trim(),
      rounds,
      isPreset: false,
    };

    router.push({
      pathname: '/(tabs)/session',
      params: { routineData: JSON.stringify(customRoutine) },
    });
  };

  const saveRoutine = async () => {
    if (!routineName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for your routine.');
      return;
    }

    try {
      const customRoutine: Routine = {
        id: `custom-${Date.now()}`,
        routineName: routineName.trim(),
        description: 'Custom breathing routine',
        rounds,
        isPreset: false,
      };

      await saveCustomRoutine(customRoutine);
      Alert.alert(
        'Success',
        'Routine saved successfully!',
        [
          {
            text: 'OK',
            onPress: handleBackNavigation,
          },
        ]
      );
    } catch (error) {
      console.error('Error saving routine:', error);
      Alert.alert('Error', 'Failed to save routine. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <LinearGradient
          colors={["#ffffff", "#f3f4f6", "#e5e7eb"] as [import('react-native').ColorValue, import('react-native').ColorValue, import('react-native').ColorValue]}
          style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={handleBackNavigation} 
              style={styles.backButton}>
              <ArrowLeft size={24} color="#222" />
            </TouchableOpacity>
            <Text style={styles.title}>Custom Routine</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.nameInputContainer}>
            <Text style={styles.nameLabel}>Routine Name</Text>
            <TextInput
              style={styles.nameInput}
              value={routineName}
              onChangeText={setRoutineName}
              placeholder="Enter routine name"
              placeholderTextColor="#6b7280"
            />
          </View>

          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {rounds.map((round, index) => (
              <RoundEditor
                key={index}
                round={round}
                index={index}
                onUpdate={updateRound}
                onDelete={deleteRound}
                onDuplicate={duplicateRound}
              />
            ))}

            <TouchableOpacity style={styles.addRoundButton} onPress={addRound}>
              <Plus size={24} color="#60a5fa" />
              <Text style={styles.addRoundText}>Add Round</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={saveRoutine}>
              <LinearGradient
                colors={['#3b82f6', '#2563eb', '#1d4ed8']}
                style={styles.saveButtonGradient}>
                <Save size={24} color="white" />
                <Text style={styles.buttonText}>Save Routine</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.startButton} onPress={startCustomSession}>
              <LinearGradient
                colors={['#10b981', '#059669', '#047857']}
                style={styles.startButtonGradient}>
                <Play size={24} color="white" />
                <Text style={styles.buttonText}>Start Session</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  nameInputContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  nameLabel: {
    fontSize: 16,
    color: '#222',
    marginBottom: 8,
    fontWeight: '500',
  },
  nameInput: {
    backgroundColor: '#ffffff',
    color: '#222',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  roundCardWrapper: {
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
  roundCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  roundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  roundActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  paramLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  counterValue: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  speedSelector: {
    flexDirection: 'row',
  },
  speedOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  speedOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  toggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  addRoundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderStyle: 'dashed',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  addRoundText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    backgroundColor: '#f8fafc',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  startButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    backgroundColor: '#f8fafc',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});