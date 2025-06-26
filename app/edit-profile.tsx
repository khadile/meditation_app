import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize form data when user is available
  useEffect(() => {
    if (user) {
      // Read from unsafeMetadata for custom fields
      const metadata = user.unsafeMetadata as any;
      setFirstName(metadata?.firstName || user.firstName || '');
      setLastName(metadata?.lastName || user.lastName || '');
      setBio(metadata?.bio || '');
      setProfilePicture(metadata?.profilePictureUri || user.imageUrl || null);
    }
  }, [user]);

  const pickImage = async () => {
    try {
      // Request permissions first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (!firstName.trim()) {
        Alert.alert('Error', 'Please enter your first name');
        return;
      }

      if (!lastName.trim()) {
        Alert.alert('Error', 'Please enter your last name');
        return;
      }

      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      // Update Clerk user profile using unsafeMetadata (including profile picture URI)
      await user.update({
        unsafeMetadata: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          bio: bio.trim(),
          profilePictureUri: profilePicture, // Store the local image URI
        }
      });

      // Wait for the update to complete and user to refresh
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert('Success', 'Profile updated successfully', [
        { 
          text: 'OK', 
          onPress: () => {
            // Navigate back to profile tab
            router.push('/(tabs)/profile');
          }
        }
      ]);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
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
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
                <Ionicons name="arrow-back" size={24} color="#64748b" />
              </TouchableOpacity>
              <Text style={styles.title}>Edit Profile</Text>
              <TouchableOpacity 
                style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              {/* Profile Picture Section */}
              <View style={styles.profilePictureSection}>
                <Text style={styles.sectionTitle}>Profile Picture</Text>
                <TouchableOpacity style={styles.profilePictureContainer} onPress={pickImage}>
                  {profilePicture ? (
                    <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                  ) : (
                    <View style={styles.profilePicturePlaceholder}>
                      <Ionicons name="person" size={40} color="#94a3b8" />
                    </View>
                  )}
                  <View style={styles.editOverlay}>
                    <Ionicons name="camera" size={20} color="white" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.helperText}>Tap to change profile picture</Text>
              </View>

              {/* Name Fields */}
              <View style={styles.nameSection}>
                <Text style={styles.sectionTitle}>Name</Text>
                <View style={styles.nameRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Bio Section */}
              <View style={styles.bioSection}>
                <Text style={styles.sectionTitle}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tell us about yourself (optional)"
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={200}
                />
                <Text style={styles.characterCount}>{bio.length}/200</Text>
              </View>

              {/* Email Section (Read-only) */}
              <View style={styles.emailSection}>
                <Text style={styles.sectionTitle}>Email</Text>
                <View style={styles.emailContainer}>
                  <Text style={styles.emailText}>
                    {user.primaryEmailAddress?.emailAddress}
                  </Text>
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
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardContainer: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  helperText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 4,
  },
  nameSection: {
    marginBottom: 32,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    color: 'black',
  },
  halfInput: {
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    color: 'black',
  },
  bioSection: {
    marginBottom: 32,
  },
  characterCount: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
    marginTop: 4,
  },
  emailSection: {
    marginBottom: 24,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emailText: {
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
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
}); 