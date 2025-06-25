import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  ColorValue,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Wind, Clock, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface MeditationTypeProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: [ColorValue, ColorValue, ...ColorValue[]];
  onPress: () => void;
  duration?: string;
  difficulty?: string;
  imageUrl?: string;
}

function MeditationCard({ 
  title, 
  description, 
  icon, 
  gradient, 
  onPress, 
  duration, 
  difficulty,
  imageUrl 
}: MeditationTypeProps) {
  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
        <LinearGradient
          colors={gradient}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          
          {imageUrl && (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.cardImage}
              resizeMode="cover"
            />
          )}
          
          <View style={styles.cardOverlay}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                {icon}
              </View>
              <View style={styles.cardMeta}>
                {duration && (
                  <View style={styles.metaItem}>
                    <Clock size={12} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.metaText}>{duration}</Text>
                  </View>
                )}
                {difficulty && (
                  <View style={styles.metaItem}>
                    <Zap size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.metaText}>{difficulty}</Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardDescription}>{description}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const meditationTypes = [
    {
      title: 'Wim Hof Breathing',
      description: 'Powerful breathing technique for energy and focus',
      icon: <Wind size={24} color="white" />,
      gradient: ['#1e3a8a', '#3b82f6', '#60a5fa'] as [ColorValue, ColorValue, ColorValue],
      duration: '5-20 min',
      difficulty: 'All levels',
      imageUrl: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800',
      onPress: () => router.push('/(tabs)/wim-hof'),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <LinearGradient
          colors={["#ffffff", "#f3f4f6", "#e5e7eb"] as [import('react-native').ColorValue, import('react-native').ColorValue, import('react-native').ColorValue]}
          style={styles.container}>
          
          <View style={styles.header}>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.title}>Find your center</Text>
            <Text style={styles.subtitle}>
              Master the Wim Hof breathing technique for energy and focus
            </Text>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.meditationGrid}>
              {meditationTypes.map((meditation, index) => (
                <MeditationCard
                  key={index}
                  {...meditation}
                />
              ))}
            </View>

            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Start</Text>
              <View style={styles.quickActionRow}>
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => {
                    const quickRoutine = {
                      id: 'quick-5min',
                      routineName: '5-Minute Quick Start',
                      description: 'Perfect for a quick energy boost and focus',
                      isPreset: true,
                      rounds: [
                        {
                          breaths: 20,
                          breathSpeed: 'Fast',
                          exhaleHold: 30,
                          inhaleHold: 10,
                        },
                        {
                          breaths: 20,
                          breathSpeed: 'Fast',
                          exhaleHold: 45,
                          inhaleHold: 10,
                        },
                      ],
                    };
                    router.push({
                      pathname: '/(tabs)/routine-details',
                      params: { 
                        routineData: JSON.stringify(quickRoutine),
                        fromScreen: 'index'
                      },
                    });
                  }}>
                  <LinearGradient
                    colors={['#1e3a8a', '#3b82f6']}
                    style={styles.quickActionGradient}>
                    <Wind size={20} color="white" />
                    <Text style={styles.quickActionText}>5 min Breathing</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => router.push({
                    pathname: '/(tabs)/custom',
                    params: { fromScreen: 'index' }
                  })}>
                  <LinearGradient
                    colors={['#059669', '#10b981']}
                    style={styles.quickActionGradient}>
                    <Wind size={20} color="white" />
                    <Text style={styles.quickActionText}>Custom Routine</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 18,
    color: '#222',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  meditationGrid: {
    paddingHorizontal: 24,
  },
  cardWrapper: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    height: 200,
    elevation: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    backgroundColor: '#f8fafc',
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardGradient: {
    flex: 1,
    position: 'relative',
  },
  cardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  cardOverlay: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#1a1a1a',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  cardMeta: {
    alignItems: 'flex-end',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
  },
  quickActions: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#1a1a1a',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});