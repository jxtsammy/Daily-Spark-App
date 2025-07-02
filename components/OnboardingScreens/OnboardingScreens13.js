// MoodSelectionScreen.js
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
import { Check } from 'react-native-feather';
import { useNavigation } from '@react-navigation/native';

export default function MoodSelectionScreen() {
  // Navigation hook
  const navigation = useNavigation();

  // State to track the selected mood
  const [selectedMood, setSelectedMood] = useState(null);

  // State to track if navigation is in progress
  const [isNavigating, setIsNavigating] = useState(false);

  // Animated values for floating dots
  const [dots, setDots] = useState([]);

  // Set status bar to light content (white text)
  useEffect(() => {
    StatusBar.setBarStyle('light-content');

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
      const opacity = new Animated.Value(Math.random() * 0.5 + 0.3);

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

  // Handle mood selection and navigation
  const handleMoodSelect = (mood) => {
    // Prevent multiple selections while navigating
    if (isNavigating) return;

    setSelectedMood(mood);
    setIsNavigating(true);

    setTimeout(() => {
      navigation.navigate('Onboarding14', { selectedMood: mood });
    }, 50);
  };

  // Mood options with their icons
  const moodOptions = [
    { id: 'awesome', label: 'Awesome', icon: '◡' },
    { id: 'good', label: 'Good', icon: '◠' },
    { id: 'neutral', label: 'Neutral', icon: '—' },
    { id: 'bad', label: 'Bad', icon: '◝' },
    { id: 'terrible', label: 'Terrible', icon: '◞' },
    { id: 'other', label: 'Other', icon: '~' },
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
            How would you decribe how you've been feeling lately?
          </Text>
          <Text style={styles.subtitle}>
            You'll see quotes that align with your current mood
          </Text>
        </View>

        {/* Mood Options */}
        <View style={styles.optionsContainer}>
          {moodOptions.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodOption,
                selectedMood === mood.id && styles.selectedMoodOption,
              ]}
              onPress={() => handleMoodSelect(mood.id)}
              activeOpacity={0.7}
              disabled={isNavigating}>
              <Text style={styles.moodIcon}>{mood.icon}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>

              {selectedMood === mood.id && (
                <View style={styles.checkContainer}>
                  <Check width={16} height={16} color="#222" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
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
  },
  moodOption: {
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
  selectedMoodOption: {
    borderColor: 'white',
  },
  moodIcon: {
    fontSize: 26,
    color: 'white',
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  moodLabel: {
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
  floatingDot: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'white',
    zIndex: -1,
  },
});
