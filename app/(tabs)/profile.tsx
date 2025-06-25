import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import {
  Settings,
  Award,
  Calendar,
  Clock,
  TrendingUp,
  Bell,
  Moon,
  Volume2,
  Smartphone,
  ChevronRight,
  Edit3,
  Camera,
  User
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture?: string;
}

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Meditation enthusiast exploring the Wim Hof method for better health and focus.',
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProfile();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleEditProfile = () => {
    router.push('/(tabs)/edit-profile');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <LinearGradient
          colors={["#ffffff", "#f3f4f6", "#e5e7eb"] as [import('react-native').ColorValue, import('react-native').ColorValue, import('react-native').ColorValue]}
          style={styles.container}>
          
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                {profile.profilePicture ? (
                  <Image 
                    source={{ uri: profile.profilePicture }} 
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <User size={40} color="#6b7280" />
                  </View>
                )}
                <TouchableOpacity style={styles.cameraButton}>
                  <Camera size={16} color="white" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.profileName}>
                {profile.firstName} {profile.lastName}
              </Text>
              
              <Text style={styles.profileBio}>
                {profile.bio}
              </Text>
              
              <TouchableOpacity 
                style={styles.editButton}
                onPress={handleEditProfile}>
                <LinearGradient
                  colors={['#3b82f6', '#1d4ed8']}
                  style={styles.editButtonGradient}>
                  <Edit3 size={16} color="white" />
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Stats Section */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Your Progress</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['#3b82f6', '#1d4ed8']}
                    style={styles.statGradient}>
                    <Calendar size={24} color="white" />
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statTitle}>Total Sessions</Text>
                  </LinearGradient>
                </View>
                
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['#10b981', '#047857']}
                    style={styles.statGradient}>
                    <Clock size={24} color="white" />
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statTitle}>Minutes</Text>
                  </LinearGradient>
                </View>
                
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['#f59e0b', '#b45309']}
                    style={styles.statGradient}>
                    <TrendingUp size={24} color="white" />
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statTitle}>Day Streak</Text>
                  </LinearGradient>
                </View>
                
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['#8b5cf6', '#6d28d9']}
                    style={styles.statGradient}>
                    <Award size={24} color="white" />
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statTitle}>Achievements</Text>
                  </LinearGradient>
                </View>
              </View>
            </View>

            {/* Settings Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Settings</Text>
              <View style={styles.settingsList}>
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Bell size={20} color="#374151" />
                    <Text style={styles.settingText}>Notifications</Text>
                  </View>
                  <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Moon size={20} color="#374151" />
                    <Text style={styles.settingText}>Dark Mode</Text>
                  </View>
                  <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Volume2 size={20} color="#374151" />
                    <Text style={styles.settingText}>Sound Settings</Text>
                  </View>
                  <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Smartphone size={20} color="#374151" />
                    <Text style={styles.settingText}>App Settings</Text>
                  </View>
                  <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  profileBio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  editButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    backgroundColor: '#f8fafc',
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12,
  },
});