// ThemeSelector.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
import { Check, Play } from 'react-native-feather';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_MARGIN = 10;
const ITEM_WIDTH = (width - (COLUMN_COUNT + 1) * ITEM_MARGIN * 2) / COLUMN_COUNT;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

export default function ThemeSelector({navigation}) {
  // Array of theme colors with their hex values
  const themeColors = [
    { id: 1, color: '#8D7358', hasVideo: false }, // Brown (first one in the image)
    { id: 2, color: '#C8A9C1', hasVideo: true },  // Light purple
    { id: 3, color: '#6E5C41', hasVideo: true },  // Dark brown
    { id: 4, color: '#B5C4CF', hasVideo: false }, // Light blue/gray
    { id: 5, color: '#F2EEE3', hasVideo: false }, // Off-white
    { id: 6, color: '#9F7F5F', hasVideo: false }, // Tan
    { id: 7, color: '#5C7C8A', hasVideo: true },  // Blue-gray
    { id: 8, color: '#D1A77F', hasVideo: false }, // Light brown
    { id: 9, color: '#8A9EA7', hasVideo: true },  // Gray-blue
    { id: 10, color: '#6B4E3D', hasVideo: false }, // Dark brown
    { id: 11, color: '#E6D2C7', hasVideo: true },  // Light beige
    { id: 12, color: '#4A6670', hasVideo: false }, // Dark blue-gray
    { id: 13, color: '#B39F8D', hasVideo: true },  // Taupe
    { id: 14, color: '#D9C5B4', hasVideo: false }, // Light tan
    { id: 15, color: '#34495E', hasVideo: true },  // Dark blue
  ];

  // State to track the selected theme
  const [selectedTheme, setSelectedTheme] = useState(themeColors[0].id);

  // Set status bar to light content (white text)
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#1E2A38');
      StatusBar.setTranslucent(true);
    }
  }, []);

  // Handle theme selection
  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Which theme would you like to start with?</Text>
        <Text style={styles.subtitle}>
          Choose from a larger selection of themes or create your own later
        </Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.colorGrid}>
          {themeColors.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[styles.colorItem, { backgroundColor: theme.color }]}
              onPress={() => handleThemeSelect(theme.id)}
              activeOpacity={0.8}
            >
              {selectedTheme === theme.id && (
                <View style={styles.checkmarkContainer}>
                  <Check width={20} height={20} color="white" />
                </View>
              )}
              
              {theme.hasVideo && (
                <View style={styles.playIconContainer}>
                  <Play width={16} height={16} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <TouchableOpacity style={styles.continueButton} onPress={ () => navigation.navigate('Onboarding12')}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
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
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  colorItem: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    margin: ITEM_MARGIN,
    position: 'relative',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: 'white',
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#1A202C',
    fontSize: 18,
    fontWeight: 'bold',
  },
});