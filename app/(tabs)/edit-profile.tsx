import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Camera, User, Save } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture?: string;
}

export default function EditProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    bio: '',
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

  const saveProfile = async () => {
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      Alert.alert('Missing Information', 'Please enter both first and last name.');
      return;
    }

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/profile'),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const handleProfilePicture = () => {
    // TODO: Implement image picker functionality
    Alert.alert('Profile Picture', 'Image picker functionality will be implemented here.');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <LinearGradient
          colors={["#ffffff", "#f3f4f6", "#e5e7eb"] as [import('react-native').ColorValue, import('react-native').ColorValue, import('react-native').ColorValue]}
          style={styles.container}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.replace('/(tabs)/profile')} 
              style={styles.backButton}>
              <ArrowLeft size={24} color="#222" />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Profile</Text>
            <TouchableOpacity 
              onPress={saveProfile}
              style={styles.saveButton}>
              <Save size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Profile Picture Section */}
            <View style={styles.profilePictureSection}>
              <Text style={styles.sectionTitle}>Profile Picture</Text>
              <TouchableOpacity 
                style={styles.profileImageContainer}
                onPress={handleProfilePicture}>
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
                <View style={styles.cameraOverlay}>
                  <Camera size={20} color="white" />
                </View>
              </TouchableOpacity>
              <Text style={styles.helperText}>Tap to change profile picture</Text>
            </View>

            {/* Name Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Name</Text>
              <View style={styles.nameRow}>
                <View style={styles.nameInputContainer}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={profile.firstName}
                    onChangeText={(text) => setProfile({ ...profile, firstName: text })}
                    placeholder="Enter first name"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                <View style={styles.nameInputContainer}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={profile.lastName}
                    onChangeText={(text) => setProfile({ ...profile, lastName: text })}
                    placeholder="Enter last name"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>
            </View>

            {/* Bio Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                value={profile.bio}
                onChangeText={(text) => setProfile({ ...profile, bio: text })}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.helperText}>Share your meditation journey or goals</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  saveButton: {
    padding: 8,
    marginRight: -8,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  helperText: {
    paddingTop: 20,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameInputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#222',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bioInput: {
    height: 100,
    paddingTop: 15,
  },
}); 