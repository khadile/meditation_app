import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, User, Camera, Edit3 } from 'lucide-react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { validateEmail, validatePassword, validateName } from '@/utils/auth';
import * as ImagePicker from 'expo-image-picker';

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const { signUp, setActive } = useSignUp();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photo library.');
        return;
      }

      // Launch image picker
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
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your camera.');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Profile Picture',
      'Choose how you want to add a profile picture',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Library',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleSignup = async () => {
    if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      Alert.alert('Error', passwordValidation.errors[0]);
      return;
    }

    // Validate names
    if (!validateName(firstName) || !validateName(lastName)) {
      Alert.alert('Error', 'First and last names must be between 2 and 50 characters');
      return;
    }

    setIsSubmitting(true);
    
    // Development mode: If Clerk is not available, show a mock success
    if (!signUp) {
      setTimeout(() => {
        Alert.alert(
          'Development Mode', 
          'Clerk is not configured. This is a mock signup for development purposes.',
          [
            {
              text: 'Continue to App',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
        setIsSubmitting(false);
      }, 1000);
      return;
    }

    try {
      const result = await signUp.create({
        emailAddress: email.trim(),
        password,
        unsafeMetadata: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          bio: bio.trim(),
          profilePicture: profilePicture || undefined,
        },
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)');
      } else if (result.status === 'missing_requirements') {
        // Check if email verification is needed
        if (result.unverifiedFields && result.unverifiedFields.includes('email_address')) {
          Alert.alert(
            'Email Verification Required',
            'Please check your email and click the verification link to complete your signup.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Signup Incomplete', 'Please complete all required fields and try again.');
        }
      } else {
        Alert.alert('Error', 'Signup failed. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Please check your information');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <LinearGradient
          colors={['#0f172a', '#1e293b', '#334155']}
          style={styles.gradient}
        >
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Animated.View 
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                  <ArrowLeft size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join us on your breathing journey</Text>
              </View>

              {/* Profile Picture Section */}
              <View style={styles.profilePictureSection}>
                <TouchableOpacity 
                  style={styles.profilePictureContainer}
                  onPress={showImagePickerOptions}
                >
                  {profilePicture ? (
                    <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                  ) : (
                    <View style={styles.profilePicturePlaceholder}>
                      <User size={40} color="#64748b" />
                    </View>
                  )}
                  <View style={styles.cameraOverlay}>
                    <Camera size={16} color="white" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.profilePictureText}>Tap to add profile picture</Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {/* Name Inputs */}
                <View style={styles.nameRow}>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <View style={styles.inputIcon}>
                      <User size={20} color="#64748b" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="First Name *"
                      placeholderTextColor="#64748b"
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <View style={styles.inputIcon}>
                      <User size={20} color="#64748b" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Last Name *"
                      placeholderTextColor="#64748b"
                      value={lastName}
                      onChangeText={setLastName}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Mail size={20} color="#64748b" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Email *"
                    placeholderTextColor="#64748b"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Lock size={20} color="#64748b" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Password *"
                    placeholderTextColor="#64748b"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
                  </TouchableOpacity>
                </View>

                {/* Bio Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Edit3 size={20} color="#64748b" />
                  </View>
                  <TextInput
                    style={[styles.input, styles.bioInput]}
                    placeholder="Tell us about yourself (optional)"
                    placeholderTextColor="#64748b"
                    value={bio}
                    onChangeText={setBio}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Signup Button */}
                <TouchableOpacity
                  style={[styles.signupButton, isSubmitting && styles.signupButtonDisabled]}
                  onPress={handleSignup}
                  disabled={isSubmitting}
                >
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    style={styles.signupButtonGradient}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.signupButtonText}>Create Account</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Login Link */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.loginLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 24,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 12,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  cameraOverlay: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profilePictureText: {
    color: '#cbd5e1',
    fontSize: 14,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfWidth: {
    width: '48%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 16,
  },
  bioInput: {
    paddingTop: 16,
    paddingBottom: 16,
    minHeight: 80,
  },
  eyeButton: {
    padding: 8,
  },
  signupButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#cbd5e1',
    fontSize: 16,
  },
  loginLink: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 