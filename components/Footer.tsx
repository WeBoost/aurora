import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from './Logo';

export function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Logo />
          <Text style={styles.description}>
            Iceland's first dedicated provider of digital tools and websites, helping businesses be found and visitors find what they want.
          </Text>
          <View style={styles.social}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={20} color="#A0AEC0" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-twitter" size={20} color="#A0AEC0" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-instagram" size={20} color="#A0AEC0" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-linkedin" size={20} color="#A0AEC0" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.links}>
          <View style={styles.linkColumn}>
            <Text style={styles.columnTitle}>Product</Text>
            <TouchableOpacity><Text style={styles.link}>Features</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.link}>Pricing</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.link}>Templates</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.link}>Integrations</Text></TouchableOpacity>
          </View>

          <View style={styles.linkColumn}>
            <Text style={styles.columnTitle}>Company</Text>
            <TouchableOpacity><Text style={styles.link}>About</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.link}>Careers</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.link}>Press</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.link}>Partners</Text></TouchableOpacity>
          </View>

          <View style={styles.linkColumn}>
            <Text style={styles.columnTitle}>Resources</Text>
            <TouchableOpacity><Text style={styles.link}>Blog</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.link}>Help Center</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.link}>Documentation</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.link}>Status</Text></TouchableOpacity>
          </View>

          <View style={styles.linkColumn}>
            <Text style={styles.columnTitle}>Legal</Text>
            <TouchableOpacity><Text style={styles.link}>Privacy</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.link}>Terms</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.link}>Security</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.link}>Cookies</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.copyright}>
          © 2025 Aurora. All rights reserved.
        </Text>
        <View style={styles.bottomLinks}>
          <TouchableOpacity><Text style={styles.bottomLink}>Privacy Policy</Text></TouchableOpacity>
          <Text style={styles.divider}>•</Text>
          <TouchableOpacity><Text style={styles.bottomLink}>Terms of Service</Text></TouchableOpacity>
          <Text style={styles.divider}>•</Text>
          <TouchableOpacity><Text style={styles.bottomLink}>Cookies Settings</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#0B1021',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 60,
    ...(Platform.OS === 'web' ? {
      paddingBottom: 60, // Height of the tab bar
    } : {}),
  },
  content: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 20,
    gap: 40,
  },
  section: {
    flex: 1,
    marginBottom: Platform.OS === 'web' ? 0 : 40,
  },
  description: {
    color: '#A0AEC0',
    fontSize: 14,
    lineHeight: 24,
    marginTop: 20,
    marginBottom: 24,
  },
  social: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  links: {
    flex: 2,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: Platform.OS === 'web' ? 60 : 40,
  },
  linkColumn: {
    gap: 16,
  },
  columnTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  link: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  bottom: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 60,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  copyright: {
    color: '#A0AEC0',
    fontSize: 14,
    marginBottom: Platform.OS === 'web' ? 0 : 16,
  },
  bottomLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomLink: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  divider: {
    color: '#A0AEC0',
    fontSize: 14,
  },
});