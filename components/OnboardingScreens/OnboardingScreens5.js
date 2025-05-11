import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Animated, 
  Dimensions, 
  Easing,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Check } from 'lucide-react-native';

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

// Generate random dots with different colors - more spread out
const generateDots = (count) => {
  const colors = [
    'rgba(255, 255, 255, 0.2)',
    'rgba(135, 206, 250, 0.15)',
    'rgba(173, 216, 230, 0.15)',
    'rgba(176, 224, 230, 0.15)',
  ];
  
  // Create a grid-like distribution for better spread
  const gridCells = Math.ceil(Math.sqrt(count));
  const cellWidth = width / gridCells;
  const cellHeight = height / gridCells;
  
  const dots = [];
  for (let i = 0; i < count; i++) {
    // Calculate grid position
    const gridX = i % gridCells;
    const gridY = Math.floor(i / gridCells);
    
    // Add some randomness within each grid cell
    const randomOffsetX = Math.random() * cellWidth * 0.8;
    const randomOffsetY = Math.random() * cellHeight * 0.8;
    
    dots.push({
      id: i,
      size: Math.random() * 12 + 4, // 4-16px
      position: {
        x: gridX * cellWidth + randomOffsetX,
        y: gridY * cellHeight + randomOffsetY,
      },
      duration: Math.random() * 4000 + 6000, // 6-10 seconds for a complete cycle
      delay: Math.random() * 2000, // 0-2 seconds delay
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  return dots;
};

const GenderSelectionScreen = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const navigation = useNavigation();
  // Use useMemo to prevent regenerating dots on re-renders
  const dots = React.useMemo(() => generateDots(40), []); // Generate 40 floating dots
  
  const genderOptions = [
    'Female',
    'Male',
    'Other',
    'Prefer not to say'
  ];
  
  useEffect(() => {
    if (selectedGender !== null) {
      // Very short delay to show the selection before navigating
      const timer = setTimeout(() => {
        navigation.navigate('Onboarding6', { gender: genderOptions[selectedGender] });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [selectedGender, navigation, genderOptions]);
  
  const handleSelectGender = (index) => {
    setSelectedGender(index);
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
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Which option represents you best?</Text>
          <Text style={styles.subtitle}>This information will be used to customize some quotes</Text>
          
          <View style={styles.optionsContainer}>
            {genderOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedGender === index && styles.selectedOption
                ]}
                onPress={() => handleSelectGender(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{option}</Text>
                {selectedGender === index && (
                  <View style={styles.checkmarkContainer}>
                    <Check size={16} color="#222" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222'
  },
  dotsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  dot: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 13,
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
});

export default GenderSelectionScreen;