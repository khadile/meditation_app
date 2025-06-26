import React, { useState } from 'react';
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
} from 'react-native';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { validateEmail, validatePassword, validateName } from '@/utils/auth';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, setActive } = useSignIn();
  const { signUp, setActive: setActiveSignUp } = useSignUp();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isLogin) {
        // Login validation
        if (!email.trim()) {
          Alert.alert('Error', 'Please enter your email');
          return;
        }
        if (!password.trim()) {
          Alert.alert('Error', 'Please enter your password');
          return;
        }
        if (!validateEmail(email)) {
          Alert.alert('Error', 'Please enter a valid email address');
          return;
        }

        if (!signIn) {
          Alert.alert('Error', 'Sign in not available');
          return;
        }

        const result = await signIn.create({
          identifier: email.trim(),
          password,
        });

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
        } else {
          Alert.alert('Error', 'Login failed. Please try again.');
        }
      } else {
        // Signup validation
        if (!email.trim()) {
          Alert.alert('Error', 'Please enter your email');
          return;
        }
        if (!password.trim()) {
          Alert.alert('Error', 'Please enter a password');
          return;
        }
        if (!firstName.trim()) {
          Alert.alert('Error', 'Please enter your first name');
          return;
        }
        if (!lastName.trim()) {
          Alert.alert('Error', 'Please enter your last name');
          return;
        }
        if (!validateEmail(email)) {
          Alert.alert('Error', 'Please enter a valid email address');
          return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
          Alert.alert('Error', passwordValidation.errors[0]);
          return;
        }

        if (!validateName(firstName) || !validateName(lastName)) {
          Alert.alert('Error', 'First and last names must be between 2 and 50 characters');
          return;
        }

        if (!signUp) {
          Alert.alert('Error', 'Sign up not available');
          return;
        }

        const result = await signUp.create({
          emailAddress: email.trim(),
          password,
          unsafeMetadata: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          },
        });

        if (result.status === 'complete') {
          await setActiveSignUp({ session: result.createdSessionId });
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
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setBio('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin 
                ? 'Sign in to continue your breathing journey' 
                : 'Start your breathing journey today'
              }
            </Text>
          </View>

          <View style={styles.form}>
            {!isLogin && (
              <>
                <View style={styles.nameRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    autoCorrect={false}
                    placeholderTextColor="#94a3b8"
                  />
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    autoCorrect={false}
                    placeholderTextColor="#94a3b8"
                  />
                </View>
                
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Bio (optional)"
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  placeholderTextColor="#94a3b8"
                />
              </>
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#94a3b8"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#94a3b8"
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
              <Text style={styles.toggleText}>
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
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
    minHeight: 300,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 16,
    color: '#1e293b',
    minHeight: 50,
  },
  halfInput: {
    flex: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    minHeight: 50,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
}); 