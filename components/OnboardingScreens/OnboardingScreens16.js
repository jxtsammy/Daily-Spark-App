// AchievementGoalsScreen.js
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

export default function AchievementGoalsScreen({ route }) {
  // Navigation hook
  const navigation = useNavigation();

  // Get the selected data from previous screens if available
  const selectedMood = route.params?.selectedMood;
  const selectedFactors = route.params?.selectedFactors || [];
  const selectedAreas = route.params?.selectedAreas || [];

  // State to track selected goals (multiple selection)
  const [selectedGoals, setSelectedGoals] = useState([]);

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

  // Toggle goal selection
  const toggleGoalSelection = (goalId) => {
    setSelectedGoals((prevSelected) => {
      if (prevSelected.includes(goalId)) {
        // Remove if already selected
        return prevSelected.filter((id) => id !== goalId);
      } else {
        // Add if not selected
        return [...prevSelected, goalId];
      }
    });
  };

  // Handle continue button press
  const handleContinue = () => {
    // Only proceed if at least one goal is selected
    if (selectedGoals.length > 0) {
      navigation.navigate('PremiumOnbording', {
        selectedMood,
        selectedFactors,
        selectedAreas,
        selectedGoals,
      });
    }
  };

  // Achievement goals options
  const achievementGoals = [
    { id: 'confidence', label: 'Improve my self-confidence' },
    { id: 'accomplish', label: 'Accomplish my goals' },
    { id: 'energy', label: 'Renew my energy and focus' },
    { id: 'happiness', label: 'Find happiness' },
    { id: 'mindset', label: 'Develop a positive mindset' },
    { id: 'present', label: 'Be more present and enjoy life' },
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
          <Text style={styles.title}>
            What do you want to achieve with Motivation?
          </Text>
          <Text style={styles.subtitle}>
            Choose at least one to see quotes based on your goals
          </Text>
        </View>

        {/* Achievement Goals Options */}
        <View style={styles.optionsContainer}>
          {achievementGoals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalOption,
                selectedGoals.includes(goal.id) && styles.selectedGoalOption,
              ]}
              onPress={() => toggleGoalSelection(goal.id)}
              activeOpacity={0.7}>
              <Text style={styles.goalLabel}>{goal.label}</Text>

              {selectedGoals.includes(goal.id) && (
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
            selectedGoals.length === 0 && styles.disabledButton,
          ]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={selectedGoals.length === 0}>
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
    flex: 1,
  },
  goalOption: {
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
  selectedGoalOption: {
    borderColor: 'white',
  },
  goalLabel: {
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
