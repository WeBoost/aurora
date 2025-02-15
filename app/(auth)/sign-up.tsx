import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

type UserType = 'business' | 'visitor' | null;

export default function SignUp() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>(
    params.type === 'business' || params.type === 'visitor' 
      ? params.type 
      : null
  );
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!userType) {
      setError('Please select an account type');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signUp(email, password);
      router.replace('/(tabs)');
    } catch (e) {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (!userType) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2850&q=80' }}
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient
          colors={['rgba(11, 16, 33, 0.8)', 'rgba(11, 16, 33, 0.95)']}
          style={StyleSheet.absoluteFillObject}
        />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Join Aurora</Text>
            <Text style={styles.subtitle}>
              Choose how you want to use Aurora
            </Text>
          </View>

          <View style={styles.typeSelection}>
            <TouchableOpacity 
              style={styles.typeCard}
              onPress={() => setUserType('business')}>
              <View style={styles.typeIcon}>
                <Ionicons name="business" size={32} color="#45B08C" />
              </View>
              <Text style={styles.typeTitle}>Business Account</Text>
              <Text style={styles.typeDescription}>
                Create your business profile and reach more customers
              </Text>
              <View style={styles.typeFeatures}>
                <View style={styles.typeFeature}>
                  <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
                  <Text style={styles.typeFeatureText}>Professional website</Text>
                </View>
                <View style={styles.typeFeature}>
                  <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
                  <Text style={styles.typeFeatureText}>Booking management</Text>
                </View>
                <View style={styles.typeFeature}>
                  <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
                  <Text style={styles.typeFeatureText}>Analytics & insights</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.typeCard}
              onPress={() => setUserType('visitor')}>
              <View style={styles.typeIcon}>
                <Ionicons name="compass" size={32} color="#45B08C" />
              </View>
              <Text style={styles.typeTitle}>Visitor Account</Text>
              <Text style={styles.typeDescription}>
                Discover and book amazing experiences in Iceland
              </Text>
              <View style={styles.typeFeatures}>
                <View style={styles.typeFeature}>
                  <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
                  <Text style={styles.typeFeatureText}>Save favorites</Text>
                </View>
                <View style={styles.typeFeature}>
                  <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
                  <Text style={styles.typeFeatureText}>Manage bookings</Text>
                </View>
                <View style={styles.typeFeature}>
                  <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
                  <Text style={styles.typeFeatureText}>Personalized recommendations</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/sign-in" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2850&q=80' }}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={['rgba(11, 16, 33, 0.8)', 'rgba(11, 16, 33, 0.95)']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create {userType === 'business' ? 'Business' : 'Visitor'} Account</Text>
          <Text style={styles.subtitle}>
            {userType === 'business'
              ? 'Join Aurora to showcase your business in Iceland'
              : 'Start exploring the best of Iceland'}
          </Text>
        </View>

        <View style={styles.form}>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#A0AEC0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#A0AEC0"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#A0AEC0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#A0AEC0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#A0AEC0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#A0AEC0"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
            onPress={handleSignUp}
            disabled={loading}>
            <Text style={styles.signUpButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.changeTypeButton}
            onPress={() => setUserType(null)}>
            <Text style={styles.changeTypeButtonText}>Change Account Type</Text>
          </TouchableOpacity>

          <Link href="/sign-in" asChild>
            <TouchableOpacity style={styles.signInButton}>
              <Text style={styles.signInButtonText}>Sign In Instead</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1021',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  typeSelection: {
    gap: 16,
  },
  typeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  typeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  typeDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 16,
    lineHeight: 20,
  },
  typeFeatures: {
    gap: 8,
  },
  typeFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeFeatureText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    paddingLeft: 44,
    color: '#FFFFFF',
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#45B08C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#A0AEC0',
    paddingHorizontal: 16,
  },
  changeTypeButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#45B08C',
    marginBottom: 12,
  },
  changeTypeButtonText: {
    color: '#45B08C',
    fontSize: 16,
    fontWeight: '600',
  },
  signInButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  footerText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  footerLink: {
    color: '#45B08C',
    fontSize: 14,
    fontWeight: '500',
  },
});