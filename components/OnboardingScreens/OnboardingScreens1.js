import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing
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


export default function App({ navigation }) {

  const setOnboardedTrue = useStore((state) => state.setOnboardedTrue);
  const getOnboarded = useStore((state) => state.onboarded);
  const userId = useStore((state) => state.userId);
  const [userCreatedState, setUserCreatedState] = React.useState(false);

  const initialRouteName = getOnboarded ? 'PremiumOnbording' : 'Onboarding2';

  let attempts = 0;


  const tryCreateAnonymous = async () => {
    if (userId) {
      setUserCreatedState(true);
      console.log('User already exists, skipping creation...userId:',userId);
      return true;
    }

    if (!userId) {
      console.log('Creating anonymous user... Attempt:', attempts + 1);
      const userCreated = await createAnonymous();
      if (userCreated) {
        console.log('Anonymous user created successfully');
        return true;
      } else if (attempts < 1) {
        attempts += 1;
        await tryCreateAnonymous();
      } else {
        console.error('Failed to create anonymous user after 2 attempts');
        return false;
      }
    }
  };


  useEffect(() => {
    const handleUserCreation = async () => {
     const rep= await tryCreateAnonymous();


      if (getOnboarded  && rep) {
        console.log('User already onboarded, navigating to PremiumOnboarding');
        navigation.navigate("PremiumOnbording");
      }


    };

    handleUserCreation();
  }, [getOnboarded, userId, navigation, setUserCreatedState]);


  const onCLickContinue = () => {
    console.log(getOnboarded)
    setOnboardedTrue();
    navigation.navigate(initialRouteName);
  }

  // Animation value for the sun
  const sunAnimValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sun hovering animation
    Animated.loop(
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
    ).start();
  }, []);

  // Animation interpolation for sun movement
  const sunTranslateY = sunAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15], // Sun moves up 15 pixels and back down
  });


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Get motivation throughout the day</Text>
          <Text style={styles.subtitle}>
            Inspiration to think positively, stay consistent, and focus on your growth
          </Text>
        </View>

        <View style={styles.illustrationContainer}>
          {/* Window with animated sun */}
          <View style={styles.windowContainer}>
            <WindowWithSun sunTranslateY={sunTranslateY} />
          </View>
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onCLickContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Window with Sun SVG Component
const WindowWithSun = ({ sunTranslateY }) => {
  // Convert Animated.Value to number for SVG
  const translateY = sunTranslateY.__getValue ? sunTranslateY.__getValue() : 0;

  return (
    <Svg width="280" height="320" viewBox="0 0 280 320">
      {/* Sky background */}
      <Defs>
        <LinearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#7EB6FF" />
          <Stop offset="100%" stopColor="#C4E0FF" />
        </LinearGradient>
      </Defs>

      {/* Window background (sky) */}
      <Rect x="20" y="20" width="240" height="280" rx="8" fill="url(#skyGradient)" />

      {/* Sun with rays */}
      <Circle
        cx="140"
        cy={140 + translateY}
        r="50"
        fill="#FFD700"
      />

      {/* Sun rays */}
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

      {/* Window frame */}
      <Rect x="20" y="20" width="240" height="280" rx="8" fill="none" stroke="#4A5568" strokeWidth="10" />

      {/* Window panes */}
      <Line x1="20" y1="160" x2="260" y2="160" stroke="#4A5568" strokeWidth="6" />
      <Line x1="140" y1="20" x2="140" y2="300" stroke="#4A5568" strokeWidth="6" />

      {/* Window sill */}
      <Rect x="10" y="300" width="260" height="15" rx="2" fill="#4A5568" />
    </Svg>
  );
};

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
});