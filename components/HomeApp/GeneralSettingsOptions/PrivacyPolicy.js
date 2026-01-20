import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';

export default function PrivacyPolicyScreen({ navigation }) {
  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  const openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#1E2732" />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowRight stroke="#fff" width={24} height={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Privacy & Data</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
            {/* Introduction */}
            <Text style={styles.sectionTitle}>YOUR PRIVACY MATTERS</Text>
            <Text style={styles.description}>
              Daily Spark is committed to protecting your privacy. We collect minimal data necessary to provide you with personalized daily quotes and a great experience.
            </Text>

            {/* Data Collection Section */}
            <Text style={styles.sectionTitle}>WHAT DATA WE COLLECT</Text>

            <View style={styles.dataItem}>
              <Text style={styles.dataTitle}>📱 Account Information</Text>
              <Text style={styles.dataDescription}>
                Name, email, language preferences, and authentication tokens (only to keep you logged in)
              </Text>
            </View>

            <View style={styles.dataItem}>
              <Text style={styles.dataTitle}>⭐ Your Preferences</Text>
              <Text style={styles.dataDescription}>
                Saved quotes, favorite themes, notification settings, and content preferences
              </Text>
            </View>

            <View style={styles.dataItem}>
              <Text style={styles.dataTitle}>📊 Usage Analytics</Text>
              <Text style={styles.dataDescription}>
                How you use the app (which quotes you view, which features you use) to improve the app
              </Text>
            </View>

            <View style={styles.dataItem}>
              <Text style={styles.dataTitle}>🎯 Advertising Data</Text>
              <Text style={styles.dataDescription}>
                Google AdMob collects your advertising ID to show you relevant ads. Learn more at Google's Privacy Policy.
              </Text>
            </View>

            {/* Data Usage Section */}
            <Text style={styles.sectionTitle}>HOW WE USE YOUR DATA</Text>
            <Text style={styles.description}>
              ✓ Personalize your Daily Spark experience{'\n'}
              ✓ Send you daily quote reminders{'\n'}
              ✓ Show you relevant ads{'\n'}
              ✓ Improve the app and fix bugs{'\n'}
              ✓ Keep your account secure
            </Text>

            <Text style={styles.sectionTitle}>WHAT WE DO NOT DO</Text>
            <Text style={styles.description}>
              ✗ We do NOT sell your personal data{'\n'}
              ✗ We do NOT share your email or quotes with advertisers{'\n'}
              ✗ We do NOT use your precise location{'\n'}
              ✗ We do NOT share your data with third parties (except Google AdMob for ads)
            </Text>

            {/* Your Rights Section */}
            <Text style={styles.sectionTitle}>YOUR RIGHTS</Text>

            <View style={styles.rightItem}>
              <Text style={styles.rightTitle}>🔐 Access Your Data</Text>
              <Text style={styles.rightDescription}>
                You can view your saved quotes, preferences, and account information in the app
              </Text>
            </View>

            <View style={styles.rightItem}>
              <Text style={styles.rightTitle}>🗑️ Delete Your Account</Text>
              <Text style={styles.rightDescription}>
                You can request to delete your account and all associated data at any time
              </Text>
            </View>

            <View style={styles.rightItem}>
              <Text style={styles.rightTitle}>🔕 Control Notifications</Text>
              <Text style={styles.rightDescription}>
                You can turn off notifications anytime in Settings
              </Text>
            </View>

            <View style={styles.rightItem}>
              <Text style={styles.rightTitle}>📢 Opt-out of Ads Tracking</Text>
              <Text style={styles.rightDescription}>
                On iOS: Settings {'>'} Privacy {'>'} Tracking. On Android: Google Settings {'>'} Ads
              </Text>
            </View>

            {/* Permissions Section */}
            <Text style={styles.sectionTitle}>WHY WE REQUEST PERMISSIONS</Text>

            <View style={styles.permissionItem}>
              <Text style={styles.permissionTitle}>🔔 POST_NOTIFICATIONS</Text>
              <Text style={styles.permissionDescription}>
                To send you daily quote reminders at the time you choose
              </Text>
            </View>

            <View style={styles.permissionItem}>
              <Text style={styles.permissionTitle}>📳 VIBRATE</Text>
              <Text style={styles.permissionDescription}>
                To provide haptic feedback when you interact with buttons
              </Text>
            </View>

            <View style={styles.permissionItem}>
              <Text style={styles.permissionTitle}>🔄 RECEIVE_BOOT_COMPLETED</Text>
              <Text style={styles.permissionDescription}>
                To ensure your daily reminders work even after your phone restarts
              </Text>
            </View>

            {/* Third-Party Section */}
            <Text style={styles.sectionTitle}>THIRD-PARTY SERVICES</Text>
            <Text style={styles.description}>
              We use the following services that collect data:
            </Text>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => openURL('https://policies.google.com/privacy')}
            >
              <Text style={styles.linkText}>🔗 Google AdMob Privacy Policy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => openURL('https://expo.dev/privacy')}
            >
              <Text style={styles.linkText}>🔗 Expo Services Privacy Policy</Text>
            </TouchableOpacity>

            {/* Contact Section */}
            <Text style={styles.sectionTitle}>QUESTIONS?</Text>
            <Text style={styles.description}>
              If you have any questions about your privacy or how we handle your data, please contact us at:
            </Text>
            <Text style={styles.contactInfo}>support@dailysparkquotes.com</Text>

            {/* Bottom Padding */}
            <View style={styles.bottomPadding} />
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    backgroundColor: '#222',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
    marginBottom: 10,
  },
  backButton: {
    marginRight: 16,
    transform: [{ rotate: '180deg' }],
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.9,
  },
  description: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  dataItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  dataTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  dataDescription: {
    color: '#bbb',
    fontSize: 13,
    lineHeight: 19,
  },
  rightItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  rightTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  rightDescription: {
    color: '#bbb',
    fontSize: 13,
    lineHeight: 19,
  },
  permissionItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  permissionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  permissionDescription: {
    color: '#bbb',
    fontSize: 13,
    lineHeight: 19,
  },
  linkButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.4)',
  },
  linkText: {
    color: '#64B5F6',
    fontSize: 14,
    fontWeight: '500',
  },
  contactInfo: {
    color: '#64B5F6',
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: 'rgba(100, 181, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 16,
  },
  bottomPadding: {
    height: 40,
  },
});
