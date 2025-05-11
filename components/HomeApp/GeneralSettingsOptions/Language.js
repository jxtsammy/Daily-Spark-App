import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Animated,
  Dimensions,
  Easing
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const DOT_COUNT = 15;

const LanguageScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    'Arabic',
    'Dutch',
    'English',
    'French',
    'German',
    'Italian',
    'Japanese',
    'Korean',
    'Portuguese',
    'Russian',
    'Simplified Chinese'
  ];

  // Floating Dots Animation
  const dots = useRef(
    Array.from({ length: DOT_COUNT }).map(() => ({
      position: new Animated.ValueXY({
        x: Math.random() * width,
        y: Math.random() * height,
      }),
      size: new Animated.Value(Math.random() * 6 + 8),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.6),
      speed: Math.random() * 1 + 0.5,
    }))
  ).current;

  useEffect(() => {
    // Animate each dot
    dots.forEach((dot) => {
      animateDot(dot);
    });
  }, []);

  const animateDot = (dot) => {
    // Generate new random position
    const newX = Math.random() * width;
    const newY = Math.random() * height;
    const duration = 15000 / dot.speed;

    // Animate position
    Animated.timing(dot.position, {
      toValue: { x: newX, y: newY },
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => animateDot(dot));

    // Animate size
    Animated.sequence([
      Animated.timing(dot.size, {
        toValue: Math.random() * 4 + 2,
        duration: duration / 2,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(dot.size, {
        toValue: Math.random() * 4 + 2,
        duration: duration / 2,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();

    // Animate opacity
    Animated.sequence([
      Animated.timing(dot.opacity, {
        toValue: Math.random() * 0.5 + 0.1,
        duration: duration / 2,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(dot.opacity, {
        toValue: Math.random() * 0.5 + 0.1,
        duration: duration / 2,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating Dots */}
      <View style={styles.dotsContainer}>
        {dots.map((dot, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                left: dot.position.x,
                top: dot.position.y,
                opacity: dot.opacity,
                width: dot.size,
                height: dot.size,
                borderRadius: dot.size.interpolate({
                  inputRange: [0, 10],
                  outputRange: [0, 5],
                }),
              },
            ]}
          />
        ))}
      </View>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.languageContainer}>
          {languages.map((language, index) => (
            <TouchableOpacity
              key={index}
              style={styles.languageItem}
              onPress={() => setSelectedLanguage(language)}
            >
              <Text style={styles.languageText}>{language}</Text>
              <View style={styles.radioContainer}>
                {selectedLanguage === language ? (
                  <View style={styles.radioSelected}>
                    <View style={styles.radioInner} />
                  </View>
                ) : (
                  <View style={styles.radioUnselected} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  // Floating Dots Styles
  dotsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  dot: {
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
    zIndex: 1,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  // Content Styles
  content: {
    flex: 1,
    zIndex: 1,
  },
  languageContainer: {
    
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  languageItem: {
    backgroundColor: 'rgba(42, 53, 65, 0.8)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: 25
  },
  languageText: {
    color: '#fff',
    fontSize: 18,
  },
  radioContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  radioUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666',
  },
});

export default LanguageScreen;