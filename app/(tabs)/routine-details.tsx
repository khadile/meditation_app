import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Routine, RoutineRound } from '@/types/breathing';
import { getSpeedColor } from '@/utils/breathingTimer';
import { ArrowLeft, Play, Trash2, Edit2, Clock, Zap, Target } from 'lucide-react-native';
import { deleteCustomRoutine } from '@/utils/storage';

export default function RoutineDetailsScreen() {
  const params = useLocalSearchParams();
  const routine: Routine = JSON.parse(params.routineData as string);
  const fromScreen = params.fromScreen as string;
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleStartSession = () => {
    router.push({
      pathname: '/(tabs)/session',
      params: { 
        routineData: JSON.stringify(routine),
        fromScreen: fromScreen
      },
    });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCustomRoutine(routine.id);
      setShowDeleteModal(false);
      if (fromScreen === 'index') {
        router.replace('/(tabs)');
      } else if (fromScreen === 'explore') {
        router.replace('/(tabs)/explore');
      } else {
        router.replace('/(tabs)/wim-hof');
      }
    } catch (error) {
      setShowDeleteModal(false);
      Alert.alert('Error', 'Failed to delete routine. Please try again.');
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: '/(tabs)/custom',
      params: { 
        routineData: JSON.stringify(routine),
        fromScreen: fromScreen
      },
    });
  };

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#ffffff", "#f3f4f6", "#e5e7eb"] as [import('react-native').ColorValue, import('react-native').ColorValue, import('react-native').ColorValue]}
        style={styles.container}>
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Delete Routine</Text>
              <Text style={styles.modalText}>
                Are you sure you want to delete "{routine.routineName}"?
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowDeleteModal(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalDelete} onPress={confirmDelete}>
                  <Text style={styles.modalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleBackNavigation} 
            style={styles.backButton}>
            <ArrowLeft size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.title}>{routine.routineName}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {routine.description || 'A custom breathing routine designed to help you achieve your goals.'}
            </Text>
          </View>

          {/* Overview Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Target size={20} color="#1e3a8a" />
              <Text style={styles.statValue}>{routine.rounds.length}</Text>
              <Text style={styles.statLabel}>Rounds</Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={20} color="#1e3a8a" />
              <Text style={styles.statValue}>
                {routine.rounds.reduce((total, round) => {
                  const breathingTime = (round.breaths * 2) / 60;
                  const holdTime = (round.exhaleHold + round.inhaleHold) / 60;
                  return total + breathingTime + holdTime;
                }, 0).toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statItem}>
              <Zap size={20} color="#1e3a8a" />
              <Text style={styles.statValue}>{routine.rounds[0]?.breaths || 30}</Text>
              <Text style={styles.statLabel}>Breaths</Text>
            </View>
          </View>

          {/* Rounds */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rounds</Text>
            {routine.rounds.map((round, index) => (
              <View key={index} style={styles.roundCard}>
                <View style={styles.roundHeader}>
                  <Text style={styles.roundTitle}>Round {index + 1}</Text>
                  <View
                    style={[
                      styles.speedBadge,
                      { backgroundColor: getSpeedColor(round.breathSpeed) },
                    ]}>
                    <Text style={styles.speedText}>{round.breathSpeed}</Text>
                  </View>
                </View>

                <View style={styles.roundDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Breaths:</Text>
                    <Text style={styles.detailValue}>{round.breaths}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Exhale Hold:</Text>
                    <Text style={styles.detailValue}>{round.exhaleHold}s</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Inhale Hold:</Text>
                    <Text style={styles.detailValue}>{round.inhaleHold}s</Text>
                  </View>
                  {round.finalHold && (
                    <View style={styles.finalHoldBadge}>
                      <Text style={styles.finalHoldText}>Final Hold Round</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {!routine.isPreset && (
            <>
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <LinearGradient
                  colors={['#3b82f6', '#2563eb', '#1d4ed8']}
                  style={styles.editButtonGradient}>
                  <Edit2 size={24} color="white" />
                  <Text style={styles.buttonText}>Edit</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <LinearGradient
                  colors={['#ef4444', '#dc2626', '#b91c1c']}
                  style={styles.deleteButtonGradient}>
                  <Trash2 size={24} color="white" />
                  <Text style={styles.buttonText}>Delete</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.startButton} onPress={handleStartSession}>
            <LinearGradient
              colors={['#10b981', '#059669', '#047857']}
              style={styles.startButtonGradient}>
              <Play size={24} color="white" />
              <Text style={styles.buttonText}>Start Session</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
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
  scrollContainer: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  roundCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // Add 3D effects for light background
    elevation: 8,
    shadowColor: '#1a1a1a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  speedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  speedText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  roundDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  finalHoldBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  finalHoldText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  editButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  deleteButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  deleteButtonGradient: {
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
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    // Add 3D effects for modal
    elevation: 16,
    shadowColor: '#1a1a1a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
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
  modalDelete: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
  },
  modalDeleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
}); 