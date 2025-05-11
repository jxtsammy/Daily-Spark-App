import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Animated
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function SelectSourceScreen({ navigation }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const fadeAnim = useState(new Animated.Value(1))[0];
  
  const options = [
    'TikTok',
    'Instagram',
    'Facebook',
    'Google Play',
    'Web search',
    'Friend/family',
    'Other'
  ];

  // Handle option selection
  const handleSelect = (option) => {
    setSelectedOption(option);
    
    // Animate fade out after selection
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        navigation.navigate('Onboarding3');
      });
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View style={styles.skipContainer}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Onboarding3')}
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>How did you hear about Motivation?</Text>
          <Text style={styles.subtitle}>Select an option to continue</Text>
        </View>
        
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option && styles.selectedOption
              ]}
              onPress={() => handleSelect(option)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{option}</Text>
              {selectedOption === option && (
                <View style={styles.checkmarkContainer}>
                  <Feather name="check" size={18} color="#1A2533" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
  },
  skipContainer: {
    alignItems: 'flex-end',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: '#A0AEC0',
    fontSize: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
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
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedOption: {
    borderColor: 'white',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  checkmarkContainer: {
    backgroundColor: 'white',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});