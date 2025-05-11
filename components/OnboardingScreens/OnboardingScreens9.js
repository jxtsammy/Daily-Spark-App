import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const CustomizationScreen = () => {
  const navigation = useNavigation();

  const handleContinue = () => {
    // Navigate to the next screen
    navigation.navigate('Onboarding10');
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={require('../../assets/bg.jpg')} // Replace with your background image path
        style={styles.backgroundImage}>
        {/* Dark Overlay Gradient */}
        <LinearGradient
          colors={['rgba(26, 30, 42, 0.1)', 'rgba(00, 0, 0, 075)']}
          style={styles.overlay}
        />

        {/* Falling Stars Animation */}

        <StatusBar barStyle="light-content" />

        {/* Main content */}
        <View style={styles.content}>
          {/* Illustration image */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../../assets/istockphoto-2170708776-612x612-removebg-preview.png')} // Replace with your illustration image path
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Text */}
          <Text style={styles.title}>
            Customize the app to improve your experience
          </Text>
        </View>

        {/* Gradient Button */}
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleContinue}
          activeOpacity={0.9}>
          <LinearGradient
            colors={['#8A65C5', '#E17899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}>
            <Text style={styles.buttonText}>Let's do it</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1E2A', // Fallback color if image fails to load
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  illustrationContainer: {
    width: 240,
    height: 240,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 32,
  },
  buttonContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 30,
  },
  gradientButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#1A1E2A',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomizationScreen;
