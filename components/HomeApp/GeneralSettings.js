import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import {
  ArrowRight,
  Crown,
  BookOpen,
  User,
  UserCircle,
  Globe,
  Flame,
  LogIn,
  ChevronRight,
  Smartphone
} from 'lucide-react-native';
import { useStore } from '../../store/useStore';
import ToastManager, { Toast } from 'toastify-react-native';

export default function App({ navigation }) {
  const { loggedIn, resetStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      // Add any async sign out operations here if needed
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async operation
      
      resetStore();
      Toast.success('Signed out successfully');
      navigation.navigate("Home");
    } catch (error) {
      console.error('Sign out error:', error);
      Toast.error('Failed to sign out');
    } finally {
      setSigningOut(false);
    }
  };

  const renderSettingItem = (icon, title, screenName, isLast = false, disabled = false) => (
    <TouchableOpacity
      style={[
        styles.settingItem, 
        isLast ? styles.lastItem : null,
        disabled && styles.disabledItem
      ]}
      onPress={() => !disabled && navigateTo(screenName)}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <View style={styles.settingItemLeft}>
        {React.cloneElement(icon, { 
          color: disabled ? '#888' : '#fff',
          style: styles.icon 
        })}
        <Text style={[styles.settingItemText, disabled && styles.disabledText]}>
          {title}
        </Text>
      </View>
      {!disabled && <ChevronRight stroke="#fff" width={20} height={20} />}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/settings.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ToastManager />
      <View style={styles.overlay}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#1E2732" />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <ArrowRight stroke="#fff" width={24} height={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          ) : (
            <ScrollView 
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* Premium Section */}
              <Text style={styles.sectionTitle}>PREMIUM</Text>

              {loggedIn ? (
                renderSettingItem(
                  <Crown stroke="#fff" width={24} height={24} />,
                  "Manage subscription",
                  "ManageSubscription"
                )
              ) : (
                renderSettingItem(
                  <Crown stroke="#fff" width={24} height={24} />,
                  "Sign In to Manage subscription",
                  "SignIn"
                )
              )}

              {/* Make It Yours Section */}
              <Text style={[styles.sectionTitle, styles.sectionTitleSpacing]}>PREFERENCES</Text>
              {renderSettingItem(
                <BookOpen stroke="#fff" width={24} height={24} />,
                "Content preferences",
                "ContentPrefrencesSettings"
              )}
              {renderSettingItem(
                <User stroke="#fff" width={24} height={24} />,
                "Gender identity",
                "GenderIdentitySettings"
              )}
              {renderSettingItem(
                <UserCircle stroke="#fff" width={24} height={24} />,
                "Name",
                "EditName"
              )}
              {renderSettingItem(
                <Globe stroke="#fff" width={24} height={24} />,
                "Language",
                "LanguageSettings"
              )}
              {renderSettingItem(
                <Flame stroke="#fff" width={24} height={24} />,
                "Streak",
                "StreakSettings"
              )}
              {renderSettingItem(
                <Smartphone stroke="#fff" width={24} height={24} />,
                "About App",
                "About",
                true
              )}

              {/* Account Section */}
              <Text style={[styles.sectionTitle, styles.sectionTitleSpacing]}>ACCOUNT</Text>

              {loggedIn ? (
                <TouchableOpacity
                  style={[styles.settingItem, styles.lastItem]}
                  onPress={handleSignOut}
                  activeOpacity={0.7}
                  disabled={signingOut}
                >
                  <View style={styles.settingItemLeft}>
                    <LogIn stroke="#fff" width={24} height={24} style={styles.icon} />
                    <Text style={styles.settingItemText}>
                      {signingOut ? 'Signing out...' : 'Sign Out'}
                    </Text>
                  </View>
                  {signingOut ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <ChevronRight stroke="#fff" width={20} height={20} />
                  )}
                </TouchableOpacity>
              ) : (
                renderSettingItem(
                  <LogIn stroke="#fff" width={24} height={24} />,
                  "Sign in",
                  "SignIn"
                )
              )}

              {/* Bottom padding */}
              <View style={styles.bottomPadding} />
            </ScrollView>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
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
    marginBottom: 10
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8
  },
  sectionTitleSpacing: {
    marginTop: 28,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    paddingVertical: 20
  },
  disabledItem: {
    opacity: 0.6,
  },
  disabledText: {
    color: '#888',
  },
  lastItem: {
    marginBottom: 0,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  settingItemText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
});