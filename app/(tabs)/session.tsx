import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Vibration,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Routine, SessionState, SessionPhase } from '@/types/breathing';
import { formatTime, getBreathingDuration } from '@/utils/breathingTimer';
import BreathingAnimation from '@/components/BreathingAnimation';
import { Pause, Play, SkipForward, X, Volume2 } from 'lucide-react-native';
import { recordSession } from '@/utils/auth';

const { width, height } = Dimensions.get('window');

export default function SessionScreen() {
  const { routineData, fromScreen } = useLocalSearchParams();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>({
    currentRound: 0,
    currentPhase: 'breathing',
    currentBreath: 0,
    timeRemaining: 0,
    isPaused: false,
  });
  const [showExitModal, setShowExitModal] = useState(false);

  const timerRef = useRef<any>(null);
  const lastTapRef = useRef<number>(0);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Parse routine data
  useEffect(() => {
    if (routineData && typeof routineData === 'string') {
      try {
        const parsedRoutine = JSON.parse(routineData);
        setRoutine(parsedRoutine);
      } catch (error) {
        Alert.alert('Error', 'Failed to load routine data');
        handleBackNavigation();
      }
    }
  }, [routineData]);

  // Handle back navigation based on where we came from
  const handleBackNavigation = () => {
    if (fromScreen === 'index') {
      router.replace('/(tabs)');
    } else if (fromScreen === 'explore') {
      router.replace('/(tabs)/explore');
    } else {
      router.replace('/(tabs)/wim-hof');
    }
  };

  // Handle double tap for skip
  const handleDoubleTap = () => {
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;
    
    if (timeDiff < 300) {
      skipCurrentPhase();
    }
    
    lastTapRef.current = now;
  };

  const skipCurrentPhase = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    nextPhase();
  };

  const startSession = () => {
    if (!routine) return;
    
    setIsSessionActive(true);
    const firstRound = routine.rounds[0];
    setSessionState({
      currentRound: 0,
      currentPhase: 'breathing',
      currentBreath: 1,
      timeRemaining: getBreathingDuration(firstRound.breathSpeed) / 1000,
      isPaused: false,
    });
    
    startBreathingPhase(firstRound);
  };

  const startBreathingPhase = (round: any) => {
    const breathDuration = getBreathingDuration(round.breathSpeed);
    let breathCount = 1;
    
    const breathTimer = setInterval(() => {
      if (breathCount >= round.breaths) {
        clearInterval(breathTimer);
        startHoldPhase('exhaleHold', round.exhaleHold);
        return;
      }
      
      breathCount++;
      setSessionState(prev => ({
        ...prev,
        currentBreath: breathCount,
        timeRemaining: breathDuration / 1000,
      }));
    }, breathDuration);
    
    timerRef.current = breathTimer;
  };

  const startHoldPhase = (type: 'exhaleHold' | 'inhaleHold', duration: number) => {
    let timeLeft = duration;
    
    setSessionState(prev => ({
      ...prev,
      currentPhase: type === 'exhaleHold' ? 'exhaleHold' : 'inhaleHold',
      timeRemaining: timeLeft,
    }));

    const holdTimer = setInterval(() => {
      timeLeft--;
      
      // Countdown alerts
      if (timeLeft === 30 || timeLeft === 15) {
        showCountdownAlert(timeLeft);
      } else if (timeLeft <= 5 && timeLeft > 0) {
        showFinalCountdown(timeLeft);
      }
      
      setSessionState(prev => ({
        ...prev,
        timeRemaining: timeLeft,
      }));
      
      if (timeLeft <= 0) {
        clearInterval(holdTimer);
        nextPhase();
      }
    }, 1000);
    
    timerRef.current = holdTimer;
  };

  const nextPhase = () => {
    if (!routine) return;
    
    const currentRound = routine.rounds[sessionState.currentRound];
    
    if (sessionState.currentPhase === 'breathing') {
      startHoldPhase('exhaleHold', currentRound.exhaleHold);
    } else if (sessionState.currentPhase === 'exhaleHold') {
      startHoldPhase('inhaleHold', currentRound.inhaleHold);
    } else if (sessionState.currentPhase === 'inhaleHold') {
      // Move to next round or complete session
      if (sessionState.currentRound < routine.rounds.length - 1) {
        const nextRoundIndex = sessionState.currentRound + 1;
        const nextRound = routine.rounds[nextRoundIndex];
        
        setSessionState(prev => ({
          ...prev,
          currentRound: nextRoundIndex,
          currentPhase: 'breathing',
          currentBreath: 1,
          timeRemaining: getBreathingDuration(nextRound.breathSpeed) / 1000,
        }));
        
        startBreathingPhase(nextRound);
      } else {
        completeSession();
      }
    }
  };

  const completeSession = async () => {
    setIsSessionActive(false);
    setSessionState(prev => ({
      ...prev,
      currentPhase: 'completed',
      timeRemaining: 0,
    }));
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Record the completed session
    if (routine) {
      try {
        // Calculate session duration (approximate based on routine structure)
        const totalDuration = routine.rounds.reduce((total, round) => {
          const breathDuration = getBreathingDuration(round.breathSpeed) / 1000; // in seconds
          const breathingTime = round.breaths * breathDuration;
          const holdTime = round.exhaleHold + round.inhaleHold;
          return total + breathingTime + holdTime;
        }, 0);

        const sessionData = {
          routineId: routine.id,
          routineName: routine.routineName,
          duration: Math.round(totalDuration / 60), // Convert to minutes
          completedAt: new Date().toISOString(),
        };
        
        await recordSession(sessionData);
      } catch (error) {
        console.error('Error recording session:', error);
      }
    }
    
    Alert.alert(
      'Session Complete!',
      'Congratulations on completing your breathing session.',
      [
        { text: 'New Session', onPress: handleBackNavigation },
        { text: 'Stay Here', style: 'cancel' },
      ]
    );
  };

  const togglePause = () => {
    if (sessionState.isPaused) {
      // Resume
      setSessionState(prev => ({ ...prev, isPaused: false }));
      // Restart current phase
      if (!routine) return;
      const currentRound = routine.rounds[sessionState.currentRound];
      
      if (sessionState.currentPhase === 'breathing') {
        startBreathingPhase(currentRound);
      } else if (sessionState.currentPhase === 'exhaleHold') {
        startHoldPhase('exhaleHold', sessionState.timeRemaining);
      } else if (sessionState.currentPhase === 'inhaleHold') {
        startHoldPhase('inhaleHold', sessionState.timeRemaining);
      }
    } else {
      // Pause
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setSessionState(prev => ({ ...prev, isPaused: true }));
    }
  };

  const showCountdownAlert = (seconds: number) => {
    if (Platform.OS !== 'web') {
      Vibration.vibrate(200);
    }
  };

  const showFinalCountdown = (seconds: number) => {
    if (Platform.OS !== 'web') {
      Vibration.vibrate([100, 100]);
    }
  };

  const getPhaseText = () => {
    switch (sessionState.currentPhase) {
      case 'breathing':
        return 'Breathe';
      case 'exhaleHold':
        return 'Hold (Empty Lungs)';
      case 'inhaleHold':
        return 'Hold (Full Lungs)';
      case 'completed':
        return 'Complete!';
      default:
        return 'Ready';
    }
  };

  const getInstructionText = () => {
    if (!isSessionActive) {
      return 'Tap Start to begin your session';
    }
    
    switch (sessionState.currentPhase) {
      case 'breathing':
        return `Breath ${sessionState.currentBreath} of ${routine?.rounds[sessionState.currentRound]?.breaths}`;
      case 'exhaleHold':
        return 'Exhale completely and hold your breath';
      case 'inhaleHold':
        return 'Take a deep breath and hold';
      case 'completed':
        return 'Session completed successfully!';
      default:
        return '';
    }
  };

  // Reset session state
  const resetSession = () => {
    setRoutine(null);
    setSessionState({
      currentRound: 0,
      currentPhase: 'breathing',
      currentBreath: 0,
      timeRemaining: 0,
      isPaused: false,
    });
    setIsSessionActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  if (!routine) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Loading routine...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#ffffff", "#f3f4f6", "#e5e7eb"] as [import('react-native').ColorValue, import('react-native').ColorValue, import('react-native').ColorValue]}
        style={styles.container}>
        {/* Exit Confirmation Modal */}
        {showExitModal && (
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Exit Session</Text>
              <Text style={styles.modalText}>
                Are you sure you want to leave this session? All progress will be lost.
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowExitModal(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalExit} onPress={() => {
                  resetSession();
                  setShowExitModal(false);
                  handleBackNavigation();
                }}>
                  <Text style={styles.modalExitText}>Exit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowExitModal(true)} style={styles.closeButton}>
            <X size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.routineTitle}>{routine.routineName}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Round {sessionState.currentRound + 1} of {routine.rounds.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((sessionState.currentRound + 1) / routine.rounds.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Main Content */}
        <TouchableOpacity
          style={styles.mainContent}
          onPress={handleDoubleTap}
          activeOpacity={1}>
          
          <BreathingAnimation
            isBreathing={isSessionActive && sessionState.currentPhase === 'breathing' && !sessionState.isPaused}
            breathSpeed={routine.rounds[sessionState.currentRound]?.breathSpeed || 'Medium'}
            phase={
              sessionState.currentPhase === 'breathing'
                ? sessionState.currentBreath % 2 === 1
                  ? 'inhale'
                  : 'exhale'
                : 'hold'
            }
          />

          {/* Phase Text */}
          <Text style={styles.phaseText}>{getPhaseText()}</Text>

          {/* Timer */}
          {isSessionActive && sessionState.currentPhase !== 'completed' && (
            <Text style={styles.timerText}>
              {sessionState.currentPhase === 'breathing'
                ? `${sessionState.currentBreath} / ${routine.rounds[sessionState.currentRound]?.breaths}`
                : formatTime(sessionState.timeRemaining)}
            </Text>
          )}

          {/* Instruction */}
          <Text style={styles.instructionText}>{getInstructionText()}</Text>

          {/* Double tap hint */}
          {isSessionActive && (
            <Text style={styles.hintText}>Double tap to skip phase</Text>
          )}
        </TouchableOpacity>

        {/* Controls */}
        <View style={styles.controls}>
          {!isSessionActive ? (
            <TouchableOpacity style={styles.startButton} onPress={startSession}>
              <LinearGradient
                colors={['#10b981', '059669', '#047857']}
                style={styles.controlButtonGradient}>
                <Play size={32} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.sessionControls}>
              <TouchableOpacity style={styles.controlButton} onPress={togglePause}>
                <LinearGradient
                  colors={['#3b82f6', '#2563eb', '#1d4ed8']}
                  style={styles.controlButtonGradient}>
                  {sessionState.isPaused ? (
                    <Play size={24} color="white" />
                  ) : (
                    <Pause size={24} color="white" />
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton} onPress={skipCurrentPhase}>
                <LinearGradient
                  colors={['#f59e0b', '#d97706', '#b45309']}
                  style={styles.controlButtonGradient}>
                  <SkipForward size={24} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  routineTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  phaseText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#60a5fa',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  instructionText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginHorizontal: 40,
    lineHeight: 24,
  },
  hintText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  startButton: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  controlButtonGradient: {
    padding: 20,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  controlButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancel: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modalExit: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
  },
  modalExitText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});