// FactorsSelectionScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import {
  Check,
  Home,
  Users,
  Briefcase,
  Heart,
  HeartPulse,
  MoreHorizontal,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function FactorsSelectionScreen({ route }) {
  // Navigation hook
  const navigation = useNavigation();

  // Get the selected mood from previous screen if available
  const selectedMood = route.params?.selectedMood;

  // State to track selected factors (multiple selection)
  const [selectedFactors, setSelectedFactors] = useState([]);

  // Animated values for floating dots
  const [dots, setDots] = useState([]);

  // Set status bar to light content (white text)
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#1E2A38');
      StatusBar.setTranslucent(true);
    }

    // Create animated dots
    createFloatingDots();
  }, []);

  // Create animated floating dots
  const createFloatingDots = () => {
    const newDots = [];
    const numDots = 15;

    for (let i = 0; i < numDots; i++) {
      const posX = new Animated.Value(Math.random() * 100);
      const posY = new Animated.Value(Math.random() * 100);
      const size = Math.random() * 7 + 8;
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
          }),
        ])
      ).start();

      // Animate dot opacity
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: Math.random() * 0.3 + 0.8,
            duration: 3000 + Math.random() * 5000,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: Math.random() * 0.5 + 0.1,
            duration: 3000 + Math.random() * 5000,
            useNativeDriver: false,
          }),
        ])
      ).start();

      newDots.push({ posX, posY, size, opacity });
    }

    setDots(newDots);
  };

  // Toggle factor selection
  const toggleFactorSelection = (factorId) => {
    setSelectedFactors((prevSelected) => {
      if (prevSelected.includes(factorId)) {
        // Remove if already selected
        return prevSelected.filter((id) => id !== factorId);
      } else {
        // Add if not selected
        return [...prevSelected, factorId];
      }
    });
  };

  // Handle continue button press
  const handleContinue = () => {
    navigation.navigate('Onboarding15', {
      selectedMood,
      selectedFactors,
    });
  };

  // Factor options with their icons
  const factorOptions = [
    { id: 'family', label: 'Family', icon: <Home size={24} color="white" /> },
    {
      id: 'friends',
      label: 'Friends',
      icon: <Users size={24} color="white" />,
    },
    { id: 'work', label: 'Work', icon: <Briefcase size={24} color="white" /> },
    {
      id: 'health',
      label: 'Health',
      icon: <HeartPulse size={24} color="white" />,
    },
    { id: 'love', label: 'Love', icon: <Heart size={24} color="white" /> },
    {
      id: 'other',
      label: 'Other',
      icon: <MoreHorizontal size={24} color="white" />,
    },
  ];

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
                outputRange: ['0%', '100%'],
              }),
              top: dot.posY.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
            },
          ]}
        />
      ))}

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What's making you feel that way?</Text>
          <Text style={styles.subtitle}>
            You can select more than one option
          </Text>
        </View>

        {/* Factor Options */}
        <View style={styles.optionsContainer}>
          {factorOptions.map((factor) => (
            <TouchableOpacity
              key={factor.id}
              style={[
                styles.factorOption,
                selectedFactors.includes(factor.id) &&
                  styles.selectedFactorOption,
              ]}
              onPress={() => toggleFactorSelection(factor.id)}
              activeOpacity={0.7}>
              <View style={styles.iconContainer}>{factor.icon}</View>
              <Text style={styles.factorLabel}>{factor.label}</Text>

              {selectedFactors.includes(factor.id) && (
                <View style={styles.checkContainer}>
                  <Check size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 40,
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
    lineHeight: 24,
  },
  optionsContainer: {
    marginTop: 20,
    flex: 1,
  },
  factorOption: {
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
  selectedFactorOption: {
    borderColor: 'white',
  },
  iconContainer: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
  },
  factorLabel: {
    fontSize: 20,
    color: 'white',
    flex: 1,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#1A202C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  floatingDot: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'white',
    zIndex: -1,
  },
});
