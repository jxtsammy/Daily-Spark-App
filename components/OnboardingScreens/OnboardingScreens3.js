import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Enhanced Floating Dot component with truly infinite animation
const FloatingDot = ({ size, position, duration, delay, color }) => {
  const moveAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create a continuous floating animation that never ends
    const startFloatingAnimation = () => {
      moveAnimation.setValue(0); // Reset to start position

      Animated.timing(moveAnimation, {
        toValue: 1,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        // When animation completes, start it again
        startFloatingAnimation();
      });
    };

    // Start with initial delay
    setTimeout(() => {
      startFloatingAnimation();
    }, delay);

    // Continuous pulsing animation
    const startPulsingAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        startPulsingAnimation();
      });
    };

    startPulsingAnimation();

    return () => {
      // Cleanup animations if component unmounts
      moveAnimation.stopAnimation();
      pulseAnimation.stopAnimation();
    };
  }, []);

  // Create a continuous path for the dot to follow
  const translateY = moveAnimation.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -20, -30, -20, 0], // Smooth up and down motion
  });

  const translateX = moveAnimation.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [0, 8, 0, -8, 0, 0], // Gentle side-to-side motion
  });

  // Keep dots visible throughout the animation
  const opacity = moveAnimation.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0.6, 0.6, 0.6, 0.6], // Maintain consistent opacity
  });

  const scale = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: position.x,
          top: position.y,
          backgroundColor: color,
          transform: [{ translateY }, { translateX }, { scale }],
          opacity,
        },
      ]}
    />
  );
};

// Generate random dots with different colors
const generateDots = (count) => {
  const colors = [
    'rgba(255, 255, 255, 0.2)',
    'rgba(135, 206, 250, 0.15)',
    'rgba(173, 216, 230, 0.15)',
    'rgba(176, 224, 230, 0.15)',
  ];

  const dots = [];
  for (let i = 0; i < count; i++) {
    dots.push({
      id: i,
      size: Math.random() * 12 + 4, // 4-16px
      position: {
        x: Math.random() * width,
        y: Math.random() * height,
      },
      duration: Math.random() * 4000 + 6000, // 6-10 seconds for a complete cycle
      delay: Math.random() * 2000, // 0-2 seconds delay
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  return dots;
};

const AgeSelectionScreen = () => {
  const [selectedAge, setSelectedAge] = useState(null);
  const navigation = useNavigation();
  // Use useMemo to prevent regenerating dots on re-renders
  const dots = React.useMemo(() => generateDots(35), []); // Generate 35 floating dots

  const ageRanges = [
    '13 to 17',
    '18 to 24',
    '25 to 34',
    '35 to 44',
    '45 to 54',
    '55+',
  ];

  useEffect(() => {
    // Navigate to next screen when an option is selected
    if (selectedAge !== null) {
      const timer = setTimeout(() => {
        navigation.navigate('Onboarding4', { age: selectedAge });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [selectedAge, navigation]);

  const handleSelectAge = (index) => {
    setSelectedAge(index);
  };

  const renderCheckmark = () => (
    <View style={styles.checkmarkContainer}>
      <Text style={styles.checkmark}>✓</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating Dots Background */}
      <StatusBar barStyle="light-content" />
      <View style={styles.dotsContainer}>
        {dots.map((dot) => (
          <FloatingDot
            key={dot.id}
            size={dot.size}
            position={dot.position}
            duration={dot.duration}
            delay={dot.delay}
            color={dot.color}
          />
        ))}
      </View>

      <View style={styles.header}>
        <View style={styles.skipContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Onboarding4')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>How old are you?</Text>
        <Text style={styles.subtitle}>
          Your age is used to personalize your content
        </Text>

        <View style={styles.optionsContainer}>
          {ageRanges.map((range, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAge === index && styles.selectedOption,
              ]}
              onPress={() => handleSelectAge(index)}>
              <Text style={styles.optionText}>{range}</Text>
              {selectedAge === index && renderCheckmark()}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  dotsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  dot: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'flex-end',
    zIndex: 1,
  },
  skipContainer: {
    alignSelf: 'flex-end',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    width: '100%',
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#FFFFFF',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#1E2A38',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AgeSelectionScreen;
