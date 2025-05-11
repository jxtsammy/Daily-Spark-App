import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Animated, 
  Dimensions, 
  Easing,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

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
        })
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
          transform: [
            { translateY },
            { translateX },
            { scale }
          ],
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

const NameInputScreen = ({navigation}) => {
  const [name, setName] = useState('');
  // Use useMemo to prevent regenerating dots on re-renders
  const dots = React.useMemo(() => generateDots(35), []); // Generate 35 floating dots
  
  const handleContinue = () => {
    // Navigate to next screen with the name
    navigation.navigate('Onboarding5', { name });
  };
  
  return (
    <>
      {/* Set status bar to white text on dark background */}
      <StatusBar barStyle="light-content" backgroundColor="#222" />
      
      <SafeAreaView style={styles.container}>
        {/* Floating Dots Background */}
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
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <View style={styles.skipContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Onboarding5')}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={styles.title}>What do you want to be called?</Text>
            <Text style={styles.subtitle}>Your name will be displayed in your motivational quotes</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              selectionColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222', // Changed to #222 as requested
  },
  keyboardAvoidingView: {
    flex: 1,
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
  input: {
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 10,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 30,
    zIndex: 1,
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#222',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NameInputScreen;