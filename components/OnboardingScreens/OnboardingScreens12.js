// OnboardingScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Platform,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function OnboardingScreen({navigation}) {
  // Set status bar to light content (white text)
  React.useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ImageBackground
        source={require('../../assets/bg.jpg')} // Replace with your background image URL
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          {/* Illustration - Replace with your image */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../../assets/verified.png')} // Replace with your illustration image URL
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
          
          {/* Text */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Answer a few questions to get personalized quotes
            </Text>
          </View>
          
          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={ () => navigation.navigate('Onboarding13')}>
              <LinearGradient
                colors={['#9B7AEA', '#F2709C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 2, 2, 0.7)', 
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  illustration: {
    width: 250,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 80
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    lineHeight: 36,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  continueButton: {
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});