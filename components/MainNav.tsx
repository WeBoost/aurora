import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from './Logo';

export function MainNav() {
  const router = useRouter();

  return (
    <View style={styles.nav}>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Logo />
      </TouchableOpacity>
      
      <View style={styles.links}>
        <TouchableOpacity 
          style={styles.link}
          onPress={() => router.push('/pricing')}>
          <Text style={styles.linkText}>Pricing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Features</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Help Center</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={() => router.push('/sign-in')}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(11, 16, 33, 0.98)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    ...(Platform.OS === 'web' ? {
      position: 'sticky',
      top: 32, // Height of the TopBar
      zIndex: 50,
    } : {
      marginTop: Platform.OS === 'ios' ? 20 : 0,
    }),
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  link: {
    padding: 8,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});