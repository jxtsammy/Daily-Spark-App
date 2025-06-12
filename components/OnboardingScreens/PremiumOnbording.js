import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Switch,
  Animated
} from 'react-native';
import { X, Lock, Bell, Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function FreeTrialScreen() {
  // Navigation hook
  const navigation = useNavigation();
  
  // State for reminder toggle
  const [reminderEnabled, setReminderEnabled] = useState(false);
  
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
      const size = Math.random() * 6 + 8;
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
          })
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
          })
        ])
      ).start();
      
      newDots.push({ posX, posY, size, opacity });
    }
    
    setDots(newDots);
  };
  
  // Handle close button press
  const handleClose = () => {
    navigation.navigate('WidgetOnboarding');
  };
  
  // Handle start trial button press
  const handleStartTrial = () => {
    // Add a console log to debug
    console.log('Starting trial, navigating to MoodSelection');
    // Try using replace instead of navigate
    navigation.replace('MoodSelection');
  };
  
  // Toggle reminder
  const toggleReminder = () => {
    setReminderEnabled(!reminderEnabled);
  };

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
      
      {/* Close Button (X) */}
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={handleClose}
        activeOpacity={0.7}
      >
        <X size={24} color="white" />
      </TouchableOpacity>
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>How your free trial works</Text>
          <Text style={styles.subtitle}>
            You won't be charged anything today
          </Text>
        </View>
        
        {/* Trial Timeline */}
        <View style={styles.timelineContainer}>
          <View style={styles.timeline}>
            {/* Timeline Bar */}
            <View style={styles.timelineBar}>
              <LinearGradient
                colors={['#F2709C', 'purple', '#4A5568']}
                locations={[0, 0.83, 0.83]}
                style={styles.timelineGradient}
              />
            </View>
            
            {/* Timeline Items */}
            <View style={styles.timelineItems}>
              {/* Today */}
              <View style={styles.timelineItem}>
                <View style={[styles.timelineIconContainer, styles.activeIconContainer]}>
                  <View style={[styles.timelineIcon, styles.activeIcon]}>
                    <Lock size={24} color="white" />
                  </View>
                </View>
                <View style={styles.timelineTextContainer}>
                  <Text style={styles.timelineTitle}>Today</Text>
                  <Text style={styles.timelineDescription}>
                    Get full access and see your mindset start to change
                  </Text>
                </View>
              </View>
              
              {/* Day 2 */}
              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={styles.timelineIcon}>
                    <Bell size={24} color="white" />
                  </View>
                </View>
                <View style={styles.timelineTextContainer}>
                  <Text style={styles.timelineTitle}>Day 2</Text>
                  <Text style={styles.timelineDescription}>
                    Get a reminder that your trial ends in 24 hours
                  </Text>
                </View>
              </View>
              
              {/* After day 3 */}
              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={styles.timelineIcon}>
                    <Crown size={24} color="white" />
                  </View>
                </View>
                <View style={styles.timelineTextContainer}>
                  <Text style={styles.timelineTitle}>After day 3</Text>
                  <Text style={styles.timelineDescription}>
                    Your free trial ends and you'll be charged, cancel anytime before
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Pricing Info */}
        <View style={styles.pricingContainer}>
          <Text style={styles.pricingText}>
            Unlimited free access for 3 days, then{' '}
            <Text style={styles.strikethrough}>GH₵600.00</Text>{' '}
            GH₵560.00/year
          </Text>
          <Text style={styles.monthlyPrice}>(only GH₵46.66/month)</Text>
        </View>
        
        {/* Reminder Toggle */}
        <View style={styles.reminderContainer}>
          <Text style={styles.reminderText}>Reminder before trial ends</Text>
          <Switch
            trackColor={{ false: '#4A5568', true: '#9B7AEA' }}
            thumbColor={'#FFFFFF'}
            ios_backgroundColor="#4A5568"
            onValueChange={toggleReminder}
            value={reminderEnabled}
          />
        </View>
        
        {/* Start Trial Button */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleStartTrial}
        >
          <LinearGradient
            colors={['purple', '#F2709C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startTrialButton}
          >
            <Text style={styles.startTrialText}>Start 3-day free trial now</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Footer Links */}
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Restore</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms & Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
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
    paddingTop: 20,
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 10,
    padding: 5,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
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
  },
  timelineContainer: {
    backgroundColor: '#2D3748',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#9B7AEA',
  },
  timeline: {
    position: 'relative',
  },
  timelineBar: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    width: 34,
    height: '100%',
    borderRadius: 30,
  },
  timelineGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  timelineItems: {
    marginLeft: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    position: 'relative',
  },
  timelineIconContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activeIconContainer: {
    position: 'relative',
  },
  timelineIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIcon: {
  },
  timelineTextContainer: {
    flex: 1,
    paddingTop: 8,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 20,
  },
  pricingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pricingText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#A0AEC0',
  },
  monthlyPrice: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 5,
  },
  reminderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  reminderText: {
    fontSize: 16,
    color: 'white',
  },
  startTrialButton: {
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  startTrialText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  footerLink: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  floatingDot: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'white',
    zIndex: -1,
  },
});