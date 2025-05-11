// ImprovementAreasScreen.js
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
import { Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function ImprovementAreasScreen({ route }) {
  // Navigation hook
  const navigation = useNavigation();

  // Get the selected mood and factors from previous screens if available
  const selectedMood = route.params?.selectedMood;
  const selectedFactors = route.params?.selectedFactors || [];

  // State to track selected improvement areas (multiple selection)
  const [selectedAreas, setSelectedAreas] = useState([]);

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
            toValue: Math.random() * 0.3 + 0.1,
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

  // Toggle area selection
  const toggleAreaSelection = (areaId) => {
    setSelectedAreas((prevSelected) => {
      if (prevSelected.includes(areaId)) {
        // Remove if already selected
        return prevSelected.filter((id) => id !== areaId);
      } else {
        // Add if not selected
        return [...prevSelected, areaId];
      }
    });
  };

  // Handle continue button press
  const handleContinue = () => {
    if (selectedAreas.length > 0) {
      navigation.navigate('Onboarding16', {
        selectedMood,
        selectedFactors,
        selectedAreas,
      });
    }
  };

  // Improvement areas options
  const improvementAreas = [
    { id: 'faith', label: 'Faith & spirituality' },
    { id: 'positive', label: 'Positive thinking' },
    { id: 'stress', label: 'Stress & anxiety' },
    { id: 'goals', label: 'Achieving goals' },
    { id: 'esteem', label: 'Self-esteem' },
    { id: 'relationships', label: 'Relationships' },
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
          <Text style={styles.title}>What do you want to improve?</Text>
          <Text style={styles.subtitle}>
            Choose at least one to tailor your quotes so they resonate with you
          </Text>
        </View>

        {/* Improvement Areas Options */}
        <View style={styles.optionsContainer}>
          {improvementAreas.map((area) => (
            <TouchableOpacity
              key={area.id}
              style={[
                styles.areaOption,
                selectedAreas.includes(area.id) && styles.selectedAreaOption,
              ]}
              onPress={() => toggleAreaSelection(area.id)}
              activeOpacity={0.7}>
              <Text style={styles.areaLabel}>{area.label}</Text>

              {selectedAreas.includes(area.id) && (
                <View style={styles.checkContainer}>
                  <Check size={16} color="#222" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedAreas.length === 0 && styles.disabledButton,
          ]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={selectedAreas.length === 0}>
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
    marginTop: 0,
    flex: 1,
  },
  areaOption: {
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
  selectedAreaOption: {
    borderColor: 'white',
  },
  areaLabel: {
    fontSize: 18,
    color: 'white',
    flex: 1,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
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
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
