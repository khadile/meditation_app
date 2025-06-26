import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Edit, Settings, LogOut, Calendar, Clock, Target } from 'lucide-react-native';
import { getSessions } from '@/utils/auth';

interface ProfileStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
}

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load profile statistics
  useFocusEffect(
    React.useCallback(() => {
      const loadProfileStats = async () => {
        try {
          const sessions = await getSessions();
          
          // Calculate statistics
          const totalSessions = sessions.length;
          const totalMinutes = sessions.reduce((total, session) => total + (session.duration || 0), 0);
          
          // Calculate current streak (sessions completed on consecutive days)
          let currentStreak = 0;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const sessionDates = sessions
            .map(session => new Date(session.completedAt))
            .map(date => {
              date.setHours(0, 0, 0, 0);
              return date;
            })
            .sort((a, b) => b.getTime() - a.getTime()); // Sort descending
          
          if (sessionDates.length > 0) {
            let checkDate = today;
            for (const sessionDate of sessionDates) {
              const diffTime = checkDate.getTime() - sessionDate.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays <= 1) {
                currentStreak++;
                checkDate = sessionDate;
              } else {
                break;
              }
            }
          }
          
          const stats = {
            totalSessions,
            totalMinutes,
            currentStreak,
          };
          
          setProfileStats(stats);
        } catch (error) {
          console.error('Error loading profile stats:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadProfileStats();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await signOut();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to sign out');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              {(() => {
                const metadata = user.unsafeMetadata as any;
                const profilePictureUri = metadata?.profilePictureUri || user.imageUrl;
                
                if (profilePictureUri) {
                  return (
                    <Image 
                      source={{ uri: profilePictureUri }} 
                      style={styles.profileImage}
                    />
                  );
                } else {
                  return (
                    <View style={styles.profileImagePlaceholder}>
                      <Ionicons name="person" size={40} color="#94a3b8" />
                    </View>
                  );
                }
              })()}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {(() => {
                  const metadata = user.unsafeMetadata as any;
                  const displayFirstName = metadata?.firstName || user.firstName;
                  const displayLastName = metadata?.lastName || user.lastName;
                  
                  if (displayFirstName && displayLastName) {
                    return `${displayFirstName} ${displayLastName}`;
                  } else if (displayFirstName) {
                    return displayFirstName;
                  } else if (displayLastName) {
                    return displayLastName;
                  } else {
                    return user.primaryEmailAddress?.emailAddress || 'User';
                  }
                })()}
              </Text>
              <Text style={styles.profileEmail}>
                {user.primaryEmailAddress?.emailAddress}
              </Text>
              {(() => {
                const metadata = user.unsafeMetadata as any;
                const bio = metadata?.bio;
                if (bio && bio.trim()) {
                  return (
                    <Text style={styles.profileBio} numberOfLines={2}>
                      {bio}
                    </Text>
                  );
                }
                return null;
              })()}
              <View style={styles.verificationBadge}>
                <Ionicons 
                  name={user.primaryEmailAddress?.verification.status === 'verified' ? 'checkmark-circle' : 'alert-circle'} 
                  size={16} 
                  color={user.primaryEmailAddress?.verification.status === 'verified' ? '#10b981' : '#f59e0b'} 
                />
                <Text style={[
                  styles.verificationText,
                  { color: user.primaryEmailAddress?.verification.status === 'verified' ? '#10b981' : '#f59e0b' }
                ]}>
                  {user.primaryEmailAddress?.verification.status === 'verified' ? 'Verified' : 'Unverified'}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{profileStats.totalSessions}</Text>
                <Text style={styles.statLabel}>Total Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{Math.round(profileStats.totalMinutes)}</Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{profileStats.currentStreak}</Text>
                <Text style={styles.statLabel}>Current Streak</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Longest Streak</Text>
              </View>
            </View>
          </View>

          {/* Actions Section */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
              <View style={styles.actionContent}>
                <Ionicons name="person-outline" size={24} color="#64748b" />
                <Text style={styles.actionText}>Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionContent}>
                <Ionicons name="notifications-outline" size={24} color="#64748b" />
                <Text style={styles.actionText}>Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionContent}>
                <Ionicons name="settings-outline" size={24} color="#64748b" />
                <Text style={styles.actionText}>Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionContent}>
                <Ionicons name="help-circle-outline" size={24} color="#64748b" />
                <Text style={styles.actionText}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity 
            style={[styles.signOutButton, isLoading && styles.signOutButtonDisabled]} 
            onPress={handleLogout}
            disabled={isLoading}
          >
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
            <Text style={styles.signOutText}>
              {isLoading ? 'Signing out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  signOutButtonDisabled: {
    opacity: 0.6,
  },
  signOutText: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '600',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#94a3b8',
  },
});