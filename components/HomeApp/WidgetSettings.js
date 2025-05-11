import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
  StatusBar
} from 'react-native';
import { ArrowLeft, LayoutGrid } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WidgetsHelpScreen({ navigation }) {
  return (
    <ImageBackground 
      source={require('../../assets/bg.jpg')} // Replace with your background image path
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 1)']}
        style={styles.overlay}
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Widgets</Text>
        </View>
        
        <ScrollView style={styles.scrollView}>
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            How to add a widget to your phone's Home Screen
          </Text>
          
          {/* Step 1 */}
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Step 1</Text>
            <View style={styles.divider} />
            <Text style={styles.stepDescription}>
              On your phone's Home Screen, touch and hold an empty space where you want to add a widget
            </Text>
          </View>
          
          {/* Step 2 */}
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Step 2</Text>
            <View style={styles.divider} />
            <View style={styles.stepRow}>
              <Text style={styles.stepDescription}>Tap</Text>
              <LayoutGrid size={20} color="white" style={styles.stepIcon} />
              <Text style={styles.stepDescription}>Widgets</Text>
            </View>
          </View>
          
          {/* Step 3 */}
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Step 3</Text>
            <View style={styles.divider} />
            <Text style={styles.stepDescription}>
              Look for the Daily Spark widgets in the list and select the one you want
            </Text>
            
            {/* Widget Preview */}
            <View style={styles.widgetPreview}>
              <View style={styles.quoteIconContainer}>
                <Text style={styles.quoteIcon}>"</Text>
              </View>
              <Text style={styles.quoteText}>
                Today is going to be a great day
              </Text>
            </View>
          </View>
          
          {/* Step 4 */}
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Step 4</Text>
            <View style={styles.divider} />
            <Text style={styles.stepDescription}>
              Follow the on-screen instructions to place the widget on your Home Screen
            </Text>
          </View>
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 70 : 40,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 15,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 25,
    lineHeight: 26,
  },
  stepCard: {
    backgroundColor: 'rgba(45, 55, 72, 0.7)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIcon: {
    marginHorizontal: 8,
  },
  widgetPreview: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteIconContainer: {
    alignSelf: 'flex-start',
    marginBottom: -10,
  },
  quoteIcon: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  quoteText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    lineHeight: 26,
  },
  bottomPadding: {
    height: 50,
  },
});