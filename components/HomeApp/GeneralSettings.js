import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  TouchableOpacity, 
  ImageBackground,
  ScrollView
} from 'react-native';
import { 
  ArrowRight, 
  Crown, 
  BookOpen, 
  User,  
  UserCircle, 
  Globe,  
  Volume2, 
  Flame,
  LogIn,
  ChevronRight
} from 'lucide-react-native';

export default function App({navigation}) {
  // Navigation handlers for each setting item
  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  const renderSettingItem = (icon, title, screenName, isLast = false) => (
    <TouchableOpacity 
      style={[styles.settingItem, isLast ? styles.lastItem : null]}
      onPress={() => navigateTo(screenName)}
    >
      <View style={styles.settingItemLeft}>
        {icon}
        <Text style={styles.settingItemText}>{title}</Text>
      </View>
      <ChevronRight stroke="#fff" width={20} height={20}/>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={require('../../assets/settings.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
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
            <Text style={styles.headerTitle}>General</Text>
          </View>
          
          <ScrollView style={styles.content}>
            {/* Premium Section */}
            <Text style={styles.sectionTitle}>PREMIUM</Text>
            {renderSettingItem(
              <Crown stroke="#fff" width={24} height={24} style={styles.icon} />,
              "Manage subscription",
              "ManageSubscription"
            )}
            
            {/* Make It Yours Section */}
            <Text style={[styles.sectionTitle, styles.sectionTitleSpacing]}>MAKE IT YOURS</Text>
            {renderSettingItem(
              <BookOpen stroke="#fff" width={24} height={24} style={styles.icon} />,
              "Content preferences",
              "ContentPrefrencesSettings"
            )}
            {renderSettingItem(
              <User stroke="#fff" width={24} height={24} style={styles.icon} />,
              "Gender identity",
              "GenderIdentitySettings"
            )}
            {renderSettingItem(
              <UserCircle stroke="#fff" width={24} height={24} style={styles.icon} />,
              "Name",
              "EditName"
            )}
            {renderSettingItem(
              <Globe stroke="#fff" width={24} height={24} style={styles.icon} />,
              "Language",
              "LanguageSettings"
            )}
            {renderSettingItem(
              <Flame stroke="#fff" width={24} height={24} style={styles.icon} />,
              "Streak",
              "StreakSettings",
              true
            )}
            
            {/* Account Section */}
            <Text style={[styles.sectionTitle, styles.sectionTitleSpacing]}>ACCOUNT</Text>
            {renderSettingItem(
              <LogIn stroke="#fff" width={24} height={24} style={styles.icon} />,
              "Sign in",
              "SignIn"
            )}
            
            {/* Bottom padding */}
            <View style={styles.bottomPadding} />
          </ScrollView>
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
    paddingVertical: 22
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