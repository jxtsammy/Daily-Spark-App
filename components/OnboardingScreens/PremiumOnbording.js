import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Switch,
  Animated,
  ActivityIndicator,
  Linking
} from 'react-native';
import { X, Lock, Bell, Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import api from '../../helpers/api';
import { useStore } from '../../store/useStore';
import { CheckHasFreeTrial } from '../../functions/check-has-free-trial';
import { createFreeTrial } from '../../functions/create-free-trial';


export default function FreeTrialScreen() {
  const navigation = useNavigation();

  // State for reminder toggle
  const [reminderEnabled, setReminderEnabled] = useState(false);

  // Animated values for floating dots
  const [dots, setDots] = useState([]);




  const fetchData = async () => {
    try {
      const res = createFreeTrial()
      if (res) {
        console.log('Free trial created successfully');
        navigation.navigate('Home');
      }

    } catch (error) {
      console.error('API Error:', error);
    }
  };

useEffect(() => {
  const checkFreeTrial = async () => {
    const hasActiveTrial = await CheckHasFreeTrial();
    console.log('Free trial status:', hasActiveTrial);

    if (hasActiveTrial) {
      console.log('Navigating to home - active trial found');
      navigation.navigate('Home');
    } else {
      console.log('No active trial found');

    }
  };


  checkFreeTrial();
}, [navigation]);


  // Set status bar to light content (white text)
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#1E2A38');
      StatusBar.setTranslucent(true);
    }

    // Create animated dots
    createFloatingDots();
    return () => {
      dots.forEach(dot => {
        dot.posX.stopAnimation();
        dot.posY.stopAnimation();
        dot.opacity.stopAnimation();
      });
    };
  }, []);

  // Create animated floating dots
  const createFloatingDots = () => {
    const newDots = [];
    const numDots = 15;

    for (let i = 0; i < numDots; i++) {
      const posX = new Animated.Value(Math.random() * 100);
      const posY = new Animated.Value(Math.random() * 100);
      const size = Math.random() * 6 + 8;
      const opacity = new Animated.Value(Math.random() * 0.5 + 0.4);

      // Animate dot position
      Animated.loop(
        Animated.sequence([
          Animated.timing(posY, {
            toValue: Math.random() * 100,
            duration: 5000 + Math.random() * 10000,
            useNativeDriver: false,
          }),
          Animated.timing(posX, {
            toValue: Math.random() * 100,
            duration: 5000 + Math.random() * 10000,
            useNativeDriver: false,
          })
        ])
      ).start();

      // Animate dot opacity
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: Math.random() * 0.3 + 0.1,
            duration: 3000 + Math.random() * 5000,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: Math.random() * 0.5 + 0.1,
            duration: 3000 + Math.random() * 5000,
            useNativeDriver: false,
          })
        ])
      ).start();

      newDots.push({ posX, posY, size, opacity });
    }

    setDots(newDots);
  };

  // Handle close button press
  const handleClose = () => {
    navigation.navigate('WidgetOnboarding');
  };

  // Handle start trial button press
  const handleStartTrial = () => {
    // Add a console log to debug
    fetchData()
    // Try using replace instead of navigate
    // navigation.replace('MoodSelection');
  };

  // Toggle reminder
  const toggleReminder = () => {
    setReminderEnabled(prev => !prev);
    Toast.info(`Reminder ${!reminderEnabled ? 'enabled' : 'disabled'}`);
  };

  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open link:', error);
      Toast.error('Could not open link');
    }
  };

  if (checkingStatus) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Floating Dots */}
      {dots.map((dot, index) => (
        <Animated.View
          key={index}
          style={[
            styles.floatingDot,
            {
              left: dot.posX.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '90%'],
              }),
              top: dot.posY.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '90%'],
              }),
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
              borderRadius: dot.size / 2,
            },
          ]}
        />
      ))}

      {/* Close Button (X) */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
        activeOpacity={0.7}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <X size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>How your free trial works</Text>
          <Text style={styles.subtitle}>
            You won't be charged anything today
          </Text>
        </View>

        {/* Trial Timeline */}
        <View style={styles.timelineContainer}>
          <View style={styles.timeline}>
            <View style={styles.timelineBar}>
              <LinearGradient
                colors={['#F2709C', 'purple', '#4A5568']}
                locations={[0, 0.83, 0.83]}
                style={styles.timelineGradient}
              />
            </View>

            {/* Timeline Items */}
            <View style={styles.timelineItems}>
              {/* Today */}
              <View style={styles.timelineItem}>
                <View style={[styles.timelineIconContainer, styles.activeIconContainer]}>
                  <View style={[styles.timelineIcon, styles.activeIcon]}>
                    <Lock size={24} color="white" />
                  </View>
                </View>
                <View style={styles.timelineTextContainer}>
                  <Text style={styles.timelineTitle}>Today</Text>
                  <Text style={styles.timelineDescription}>
                    Get full access and see your mindset start to change
                  </Text>
                </View>
              </View>

              {/* Day 2 */}
              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={styles.timelineIcon}>
                    <Bell size={24} color="white" />
                  </View>
                </View>
                <View style={styles.timelineTextContainer}>
                  <Text style={styles.timelineTitle}>Day 2</Text>
                  <Text style={styles.timelineDescription}>
                    Get a reminder that your trial ends in 24 hours
                  </Text>
                </View>
              </View>

              {/* After day 3 */}
              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={styles.timelineIcon}>
                    <Crown size={24} color="white" />
                  </View>
                </View>
                <View style={styles.timelineTextContainer}>
                  <Text style={styles.timelineTitle}>After day 3</Text>
                  <Text style={styles.timelineDescription}>
                    Your free trial ends and you'll be charged, cancel anytime before
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Pricing Info */}
        <View style={styles.pricingContainer}>
          <Text style={styles.pricingText}>
            Unlimited free access for 3 days, then{' '}
            <Text style={styles.strikethrough}>GH₵600.00</Text>{' '}
            GH₵560.00/year
          </Text>
          <Text style={styles.monthlyPrice}>(only GH₵46.66/month)</Text>
        </View>

        {/* Reminder Toggle */}
        <View style={styles.reminderContainer}>
          <Text style={styles.reminderText}>Reminder before trial ends</Text>
          <Switch
            trackColor={{ false: '#4A5568', true: '#9B7AEA' }}
            thumbColor={'#FFFFFF'}
            ios_backgroundColor="#4A5568"
            onValueChange={toggleReminder}
            value={reminderEnabled}
          />
        </View>

        {/* Start Trial Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleStartTrial}
          disabled={loading}
          style={[styles.startTrialButton, loading && styles.disabledButton]}
        >
          <LinearGradient
            colors={['purple', '#F2709C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.startTrialText}>Start 3-day free trial now</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Footer Links */}
        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => openLink('https://example.com/restore')}>
            <Text style={styles.footerLink}>Restore</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink('https://example.com/terms')}>
            <Text style={styles.footerLink}>Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink('https://example.com/privacy')}>
            <Text style={styles.footerLink}>Privacy</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Ad Banner */}
      {AdManager.getBannerAd()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 10,
    padding: 5,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  timelineContainer: {
    backgroundColor: '#2D3748',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#9B7AEA',
  },
  timeline: {
    position: 'relative',
  },
  timelineBar: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    width: 34,
    height: '100%',
    borderRadius: 30,
  },
  timelineGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  timelineItems: {
    marginLeft: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    position: 'relative',
  },
  timelineIconContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activeIconContainer: {
    position: 'relative',
  },
  timelineIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIcon: {
  },
  timelineTextContainer: {
    flex: 1,
    paddingTop: 8,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 20,
  },
  pricingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pricingText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#A0AEC0',
  },
  monthlyPrice: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 5,
  },
  reminderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  reminderText: {
    fontSize: 16,
    color: 'white',
  },
  startTrialButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 20,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  startTrialText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  footerLink: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  floatingDot: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: -1,
  },
});