import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Search, Play, Clock, Star, X } from 'lucide-react-native';
import { presetRoutines } from '@/data/presetRoutines';

interface CategoryProps {
  title: string;
  sessions: SessionProps[];
}

interface SessionProps {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  rating: number;
  isNew?: boolean;
  isPremium?: boolean;
  routineData: any;
}

// Function to get gradient colors based on routine type (same as Wim Hof screen)
const getRoutineGradient = (routine: any): [string, string, string] => {
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
    case 'quick-5min':
      // Default blue gradient for quick start
      return ['#1e3a8a', '#1e40af', '#3b82f6'];
    default:
      // Default blue gradient
      return ['#1e3a8a', '#1e40af', '#3b82f6'];
  }
};

function SessionCard({ id, title, instructor, duration, rating, isNew, isPremium, routineData }: SessionProps) {
  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/routine-details',
      params: { 
        routineData: JSON.stringify(routineData),
        fromScreen: 'explore'
      },
    });
  };

  const gradientColors = getRoutineGradient(routineData);

  return (
    <View style={styles.sessionCardWrapper}>
      <TouchableOpacity style={styles.sessionCard} activeOpacity={0.8} onPress={handlePress}>
        <LinearGradient
          colors={gradientColors}
          style={styles.sessionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          
          <View style={styles.sessionBadges}>
            {isNew && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
            {isPremium && (
              <View style={[styles.badge, styles.premiumBadge]}>
                <Star size={10} color="#ffd700" />
                <Text style={[styles.badgeText, { color: '#ffd700' }]}>PRO</Text>
              </View>
            )}
          </View>

          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTitle}>{title}</Text>
            <Text style={styles.sessionInstructor}>{instructor}</Text>
            <View style={styles.sessionMeta}>
              <View style={styles.metaItem}>
                <Clock size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>{duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <Star size={12} color="#ffd700" />
                <Text style={styles.metaText}>{rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.playButton} onPress={handlePress}>
            <Play size={16} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function CategorySection({ title, sessions }: CategoryProps) {
  return (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sessionsList}>
        {sessions.map((session, index) => (
          <SessionCard key={session.id || index} {...session} />
        ))}
      </ScrollView>
    </View>
  );
}

export default function ExploreScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Calculate duration for a routine
  const calculateDuration = (routine: any) => {
    const totalDuration = routine.rounds.reduce((total: number, round: any) => {
      const breathingTime = (round.breaths * 2) / 60; // roughly 2 seconds per breath cycle
      const holdTime = (round.exhaleHold + round.inhaleHold) / 60;
      return total + breathingTime + holdTime;
    }, 0);
    return `${Math.round(totalDuration)} min`;
  };

  const allSessions = [
    {
      id: 'quick-5min',
      title: '5-Minute Quick Start',
      instructor: 'Wim Hof Method',
      duration: '5 min',
      rating: 4.9,
      isNew: true,
      routineData: presetRoutines.find(r => r.id === 'quick-5min'),
    },
    {
      id: 'energizer',
      title: 'Morning Energizer',
      instructor: 'Wim Hof Method',
      duration: calculateDuration(presetRoutines.find(r => r.id === 'energizer')),
      rating: 4.8,
      routineData: presetRoutines.find(r => r.id === 'energizer'),
    },
    {
      id: 'advanced',
      title: 'Advanced Challenge',
      instructor: 'Wim Hof Method',
      duration: calculateDuration(presetRoutines.find(r => r.id === 'advanced')),
      rating: 4.9,
      isPremium: true,
      routineData: presetRoutines.find(r => r.id === 'advanced'),
    },
    {
      id: 'beginner',
      title: 'Beginner Flow',
      instructor: 'Wim Hof Method',
      duration: calculateDuration(presetRoutines.find(r => r.id === 'beginner')),
      rating: 4.7,
      routineData: presetRoutines.find(r => r.id === 'beginner'),
    },
    {
      id: 'calm',
      title: 'Evening Calm',
      instructor: 'Wim Hof Method',
      duration: calculateDuration(presetRoutines.find(r => r.id === 'calm')),
      rating: 4.6,
      routineData: presetRoutines.find(r => r.id === 'calm'),
    },
  ];

  // Filter sessions based on search query
  const filterSessions = (sessions: SessionProps[]) => {
    return sessions.filter(session => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  };

  const filteredSessions = filterSessions(allSessions);

  // Organize filtered sessions into categories
  const getFilteredCategories = () => {
    const featured = filteredSessions.filter(session => session.isNew || session.isPremium);
    const variations = filteredSessions.filter(session => !session.isNew && !session.isPremium);

    const categories = [];
    
    if (featured.length > 0) {
      categories.push({
        title: 'Featured This Week',
        sessions: featured,
      });
    }
    
    if (variations.length > 0) {
      categories.push({
        title: 'Wim Hof Variations',
        sessions: variations,
      });
    }

    return categories;
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const filteredCategories = getFilteredCategories();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <LinearGradient
          colors={["#ffffff", "#f3f4f6", "#e5e7eb"] as [import('react-native').ColorValue, import('react-native').ColorValue, import('react-native').ColorValue]}
          style={styles.container}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Explore</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton} onPress={handleSearchToggle}>
                <Search size={20} color="#222" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Input */}
          {showSearch && (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search routines..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <TouchableOpacity style={styles.searchCloseButton} onPress={handleSearchToggle}>
                <X size={20} color="#222" />
              </TouchableOpacity>
            </View>
          )}

          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}>
            
            {filteredCategories.map((category, index) => (
              <CategorySection key={index} {...category} />
            ))}

            {filteredCategories.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No routines found</Text>
                <Text style={styles.emptyStateSubtext}>Try adjusting your search</Text>
              </View>
            )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#1a1a1a',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  scrollContainer: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  sessionsList: {
    paddingLeft: 24,
    paddingRight: 12,
  },
  sessionCardWrapper: {
    width: 200,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
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
  sessionCard: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sessionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    justifyContent: 'space-between',
  },
  sessionBadges: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255,215,0,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  sessionInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  sessionInstructor: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2,
  },
  sessionMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
  },
  playButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
  },
  searchCloseButton: {
    padding: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
});