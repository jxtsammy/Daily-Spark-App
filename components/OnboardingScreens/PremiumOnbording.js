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
  Linking,
  Dimensions
} from 'react-native';
import { X, Lock, Bell, Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { CheckHasFreeTrial } from '../../functions/check-has-free-trial';
import { createFreeTrial } from '../../functions/create-free-trial';
import AdManager from '../../services/AdManager';
import ToastManager, { Toast } from 'toastify-react-native';
import { createAnonymous } from '../../functions/create-anonymous';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

export default function FreeTrialScreen() {
  const navigation = useNavigation();
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [dots, setDots] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await createFreeTrial();
      if (res) {
        Toast.success('Free trial started successfully!');
        setTimeout(() => {
          navigation.replace('Home');
        }, 1500);
      } else {
        Toast.error(res?.message || 'Failed to start free trial');
      }
    } catch (error) {
      console.error('API Error:', error);
      Toast.error('An error occurred while starting your trial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const timeout = setTimeout(() => {
      if (isMounted) {
        setCheckingStatus(false);
        Toast.error('Connection timeout');
      }
    }, 10000); // 10 second timeout

    const checkFreeTrialStatus = async () => {
      try {
        setCheckingStatus(true);
        await createAnonymous('FreeTrialScreen');
        const hasActiveTrial = await CheckHasFreeTrial();
        if (hasActiveTrial) {
          navigation.replace('Home');
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
        Toast.error('Failed to check trial status');
      } finally {
        if (isMounted) {
          clearTimeout(timeout);
          setCheckingStatus(false);
        }
      }
    };

    checkFreeTrialStatus();
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [navigation]);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#1E2A38');
      StatusBar.setTranslucent(true);
    }

    createFloatingDots();
    return () => {
      dots.forEach(dot => {
        dot.posX.stopAnimation();
        dot.posY.stopAnimation();
        dot.opacity.stopAnimation();
      });
    };
  }, []);

  const createFloatingDots = () => {
    const newDots = [];
    // Reduce dots on smaller screens for better performance
    const numDots = isSmallScreen ? 8 : (Platform.OS === 'ios' ? 20 : 15);

    for (let i = 0; i < numDots; i++) {
      const posX = new Animated.Value(Math.random() * 100);
      const posY = new Animated.Value(Math.random() * 100);
      const size = Math.random() * 6 + 8;
      const opacity = new Animated.Value(Math.random() * 0.5 + 0.4);

      Animated.loop(
        Animated.parallel([
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
          ]),
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
        ])
      ).start();

      newDots.push({ posX, posY, size, opacity });
    }

    setDots(newDots);
  };

  const handleClose = () => {
    navigation.navigate('WidgetOnboarding');
  };

  const handleStartTrial = async () => {
    if (loading) return;
    await fetchData();
  };

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
      <ToastManager />

      {/* Floating Dots Background - Contained to prevent overlapping */}
      <View style={styles.dotsContainer}>
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
      </View>

      {/* Close Button - Better positioned and larger touch area */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
        activeOpacity={0.7}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <X size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.content} pointerEvents="box-none">
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>How your free trial works</Text>
          <Text style={styles.subtitle}>
            You won't be charged anything today
          </Text>
        </View>

        {/* Timeline Section */}
        <View style={styles.timelineContainer}>
          <View style={styles.timeline}>
            <View style={styles.timelineBar}>
              <LinearGradient
                colors={['#F2709C', 'purple', '#4A5568']}
                locations={[0, 0.83, 0.83]}
                style={styles.timelineGradient}
              />
            </View>

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
            Unlimited free access for 3 days without ads, then{' '}
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
          <TouchableOpacity 
            onPress={() => openLink('https://example.com/restore')}
            style={styles.footerLinkTouchable}
          >
            <Text style={styles.footerLink}>Restore</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => openLink('https://example.com/terms')}
            style={styles.footerLinkTouchable}
          >
            <Text style={styles.footerLink}>Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => openLink('https://example.com/privacy')}
            style={styles.footerLinkTouchable}
          >
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
  // Dots container to keep them in background
  dotsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0, // Lower z-index to stay in background
  },
  content: {
    flex: 1,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingTop: isSmallScreen ? 10 : 20,
    paddingBottom: isSmallScreen ? 10 : 20,
    zIndex: 1, // Higher z-index to stay above dots
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 20, // Highest z-index to ensure it's always clickable
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  header: {
    marginTop: isSmallScreen ? 50 : 60,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 20,
  },
  timelineContainer: {
    backgroundColor: '#2D3748',
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#9B7AEA',
    zIndex: 1,
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
    marginBottom: isSmallScreen ? 20 : 30,
    position: 'relative',
  },
  timelineIconContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    zIndex: 2,
  },
  activeIconContainer: {
    position: 'relative',
  },
  timelineIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIcon: {
    // Add any active icon styles if needed
  },
  timelineTextContainer: {
    flex: 1,
    paddingTop: 8,
  },
  timelineTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  timelineDescription: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#A0AEC0',
    lineHeight: 20,
  },
  pricingContainer: {
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
  },
  pricingText: {
    fontSize: isSmallScreen ? 14 : 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#A0AEC0',
  },
  monthlyPrice: {
    fontSize: isSmallScreen ? 12 : 14,
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
    zIndex: 1,
    minHeight: 60, // Ensure minimum touch height
  },
  reminderText: {
    fontSize: isSmallScreen ? 14 : 16,
    color: 'white',
    flex: 1,
  },
  startTrialButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 20,
    zIndex: 1,
    minHeight: 60, // Larger touch area
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    paddingVertical: isSmallScreen ? 16 : 18,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  startTrialText: {
    color: 'white',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    zIndex: 1,
  },
  footerLinkTouchable: {
    padding: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  footerLink: {
    color: '#A0AEC0',
    fontSize: isSmallScreen ? 13 : 14,
    textAlign: 'center',
  },
  floatingDot: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: 0, // Ensure dots stay in background
  },
});