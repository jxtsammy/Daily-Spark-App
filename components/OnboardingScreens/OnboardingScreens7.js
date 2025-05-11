import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Check } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Floating Dots Background Component (reused from previous example)
const FloatingDots = () => {
  // Create 15 animated dots with different properties
  const dots = Array.from({ length: 15 }, (_, i) => {
    const size = Math.random() * 7 + 8; // Random size between 2-8
    const posX = new Animated.Value(Math.random() * width);
    const posY = new Animated.Value(Math.random() * height);
    const opacity = new Animated.Value(Math.random() * 0.5 + 0.6); // Random opacity between 0.1-0.6
    
    return { size, posX, posY, opacity, id: i };
  });

  React.useEffect(() => {
    // Animate each dot
    dots.forEach(dot => {
      const animateX = Animated.timing(dot.posX, {
        toValue: Math.random() * width,
        duration: 15000 + Math.random() * 10000, // Random duration between 15-25s
        useNativeDriver: true,
      });
      
      const animateY = Animated.timing(dot.posY, {
        toValue: Math.random() * height,
        duration: 15000 + Math.random() * 10000,
        useNativeDriver: true,
      });
      
      const animateOpacity = Animated.timing(dot.opacity, {
        toValue: Math.random() * 0.5 + 0.1,
        duration: 8000 + Math.random() * 5000,
        useNativeDriver: true,
      });
      
      // Create loop animations
      Animated.loop(
        Animated.parallel([animateX, animateY, animateOpacity])
      ).start();
    });
  }, []);

  return (
    <View style={styles.dotsContainer}>
      {dots.map(dot => (
        <Animated.View
          key={dot.id}
          style={[
            styles.dot,
            {
              width: dot.size,
              height: dot.size,
              borderRadius: dot.size / 2,
              opacity: dot.opacity,
              transform: [
                { translateX: dot.posX },
                { translateY: dot.posY }
              ]
            }
          ]}
        />
      ))}
    </View>
  );
};

const ReligiousBeliefScreen = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigation = useNavigation();

  const handleSelect = (option) => {
    setSelectedOption(option);
    
    // Navigate to different screens based on selection after a short delay
    setTimeout(() => {
      if (option === 'Yes') {
        navigation.navigate('Onboarding8', { belief: option });
      } else {
        // Both "No" and "Spiritual but not religious" go to the same screen
        navigation.navigate('Onboarding9', { belief: option });
      }
    }, 50);
  };

  return (
    <View style={styles.container}>
      {/* Floating dots background */}
      <StatusBar barStyle="light-content" />
      
      <FloatingDots />
      
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Are you religious?</Text>
        <Text style={styles.subtitle}>This information will be used to tailor your quotes to your beliefs</Text>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOption === 'Yes' && styles.selectedOption,
            ]}
            onPress={() => handleSelect('Yes')}
          >
            <Text style={styles.optionText}>Yes</Text>
            {selectedOption === 'Yes' && (
              <View style={styles.checkContainer}>
                <Check color="#222" size={16} />
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOption === 'No' && styles.selectedOption,
            ]}
            onPress={() => handleSelect('No')}
          >
            <Text style={styles.optionText}>No</Text>
            {selectedOption === 'No' && (
              <View style={styles.checkContainer}>
                <Check color="#222" size={16} />
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOption === 'Spiritual but not religious' && styles.selectedOption,
            ]}
            onPress={() => handleSelect('Spiritual but not religious')}
          >
            <Text style={styles.optionText}>Spiritual but not religious</Text>
            {selectedOption === 'Spiritual but not religious' && (
              <View style={styles.checkContainer}>
                <Check color="#222" size={16} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  dotsContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
    zIndex: 1,
    marginTop: 70
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
    color: '#B0B8C1',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: 20
  },
  selectedOption: {
    borderColor: 'white',
  },
  optionText: {
    color: 'white',
    fontSize: 18,
  },
  checkContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReligiousBeliefScreen;