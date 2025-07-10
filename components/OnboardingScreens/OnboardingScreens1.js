import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  ActivityIndicator
} from 'react-native';
import Svg, {
  Rect,
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
  Line
} from 'react-native-svg';
import { useStore } from '../../store/useStore';
import { createAnonymous } from '../../functions/create-anonymous';
import AdManager from '../../services/AdManager';
import ToastManager, { Toast } from 'toastify-react-native';
// import {NotificationInitializer} from '../../services/notoficationInitializer'



const WindowWithSun = ({ sunTranslateY }) => {
  const translateY = sunTranslateY.__getValue ? sunTranslateY.__getValue() : 0;

  return (
    <Svg width="280" height="320" viewBox="0 0 280 320">
      <Defs>
        <LinearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#7EB6FF" />
          <Stop offset="100%" stopColor="#C4E0FF" />
        </LinearGradient>
      </Defs>

      <Rect x="20" y="20" width="240" height="280" rx="8" fill="url(#skyGradient)" />

      <Circle
        cx="140"
        cy={140 + translateY}
        r="50"
        fill="#FFD700"
      />

      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        const innerRadius = 55;
        const outerRadius = 75;
        const x1 = 140 + innerRadius * Math.cos(angle);
        const y1 = (140 + translateY) + innerRadius * Math.sin(angle);
        const x2 = 140 + outerRadius * Math.cos(angle);
        const y2 = (140 + translateY) + outerRadius * Math.sin(angle);

        return (
          <Line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FFD700"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}

      <Rect x="20" y="20" width="240" height="280" rx="8" fill="none" stroke="#4A5568" strokeWidth="10" />
      <Line x1="20" y1="160" x2="260" y2="160" stroke="#4A5568" strokeWidth="6" />
      <Line x1="140" y1="20" x2="140" y2="300" stroke="#4A5568" strokeWidth="6" />
      <Rect x="10" y="300" width="260" height="15" rx="2" fill="#4A5568" />
    </Svg>
  );
};

export default function App({ navigation }) {
  const setOnboardedTrue = useStore((state) => state.setOnboardedTrue);
  const getOnboarded = useStore((state) => state.onboarded);
  const [loading, setLoading] = useState(true);
  const [showScreen, setShowScreen] = useState(false);
  const sunAnimValue = useRef(new Animated.Value(0)).current;
   const navigationRef = useRef(null);


  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const initializeApp = async () => {
      try {
        // 1. Create anonymous user if needed
        await createAnonymous("OnboardingScreen");
        
        if (!isMounted) return;

        // 2. Check onboarding status
        if (getOnboarded) {
          console.log('User already onboarded, redirecting...');
          // await NotificationInitializer.initializeNotifications(navigationRef.current);

          setOnboardedTrue();
          
          Toast.info('Welcome back!');
          
          // Show rewarded ad in background
          AdManager.showRewarded((reward) => {
            console.log(`Earned ${reward.amount} ${reward.type}`);
          });

          // Navigate after short delay for toast
          timeoutId = setTimeout(() => {
            if (isMounted) {
              navigation.replace('PremiumOnbording');
            }
          }, 1500);
        } else {
          // User needs to see onboarding
          if (isMounted) {
            setShowScreen(true);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
        if (isMounted) {
          Toast.error('Error loading app');
          setShowScreen(true); // Fallback to showing screen
          setLoading(false);
        }
      }
    };

    initializeApp();

    // Start sun animation
    const sunAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sunAnimValue, {
          toValue: 1,
          duration: 3000,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(sunAnimValue, {
          toValue: 0,
          duration: 3000,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
      ])
    );
    sunAnimation.start();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      sunAnimation.stop();
    };
  }, [navigation, getOnboarded]);

  const handleContinue = async () => {
    try {
      await AdManager.showInterstitial();
      setOnboardedTrue();
      navigation.replace('PremiumOnbording');
    } catch (error) {
      console.error('Continue error:', error);
      // Fallback if ad fails
      setOnboardedTrue();
      navigation.replace('PremiumOnbording');
    }
  };

  const sunTranslateY = sunAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </SafeAreaView>
    );
  }

  if (!showScreen) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ToastManager />

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Get motivation throughout the day</Text>
          <Text style={styles.subtitle}>
            Inspiration to think positively, stay consistent, and focus on your growth
          </Text>
        </View>

        <View style={styles.illustrationContainer}>
          <View style={styles.windowContainer}>
            <WindowWithSun sunTranslateY={sunTranslateY} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 24,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  windowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2533',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});