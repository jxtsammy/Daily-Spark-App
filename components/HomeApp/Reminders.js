import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  ImageBackground,
  Platform,
  StatusBar
} from 'react-native';
import { ArrowLeft, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PremiumModal from './PremiumModal';

// Sample reminder data
const reminderData = [
  {
    id: 1,
    title: 'General',
    timeRange: '09:00 - 22:00',
    frequency: '10X',
    schedule: 'Every weekday',
    enabled: true,
    isPremiumLocked: false
  },
  {
    id: 2,
    title: 'General',
    timeRange: '09:00 - 22:00',
    frequency: '3X',
    schedule: 'Fri,Sat',
    enabled: false,
    isPremiumLocked: true
  },
  {
    id: 3,
    title: 'Positive thinking and Gratitude',
    timeRange: '09:00',
    frequency: '1X',
    schedule: 'Every weekday',
    enabled: false,
    isPremiumLocked: true
  }
];

export default function RemindersScreen({ navigation, isPremiumUser = false }) {
  const [reminders, setReminders] = useState(reminderData);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Toggle reminder enabled state
  const toggleReminder = (id) => {
    const updatedReminders = reminders.map(reminder => {
      if (reminder.id === id) {
        // Only toggle if user has premium or the reminder is not premium-locked
        if (!reminder.isPremiumLocked || isPremiumUser) {
          return { ...reminder, enabled: !reminder.enabled };
        }
      }
      return reminder;
    });
    
    setReminders(updatedReminders);
  };

  // Show premium modal when trying to toggle a locked reminder
  const handleReminderPress = (reminder) => {
    if (reminder.isPremiumLocked && !isPremiumUser) {
      setShowPremiumModal(true);
    } else {
      toggleReminder(reminder.id);
    }
  };

  // Render a single reminder card
  const renderReminderCard = (reminder) => {
    const isLocked = reminder.isPremiumLocked && !isPremiumUser;
    
    return (
      <View 
        key={reminder.id} 
        style={[
          styles.reminderCard,
          isLocked && styles.lockedCard
        ]}
      >
        <View style={styles.reminderHeader}>
          <Text style={[
            styles.reminderTitle,
            isLocked && styles.lockedText
          ]}>
            {reminder.title}
          </Text>
          <Text style={[
            styles.reminderTime,
            isLocked && styles.lockedText
          ]}>
            {reminder.timeRange}
          </Text>
        </View>
        
        <View style={styles.reminderDetails}>
          <View style={styles.frequencyContainer}>
            <Text style={[
              styles.frequencyText,
              isLocked && styles.lockedText
            ]}>
              {reminder.frequency}
            </Text>
            <Text style={[
              styles.scheduleText,
              isLocked && styles.lockedText
            ]}>
              {reminder.schedule}
            </Text>
          </View>
          
          <Switch
            value={reminder.enabled}
            onValueChange={() => handleReminderPress(reminder)}
            trackColor={{ false: '#767577', true: '#8A65C5' }}
            thumbColor={reminder.enabled ? '#ffffff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            disabled={isLocked}
            style={styles.switch}
          />
        </View>
      </View>
    );
  };

  return (
    <ImageBackground 
      source={require('../../assets/background.jpg')} // Replace with your background image path
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(22, 31, 46, 0.8)', 'rgba(0, 0, 0, 0.9)']}
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
          <Text style={styles.headerTitle}>Reminders</Text>
        </View>
        
        <ScrollView style={styles.scrollView}>
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Set up your daily routine to make Motivation fit your habits
          </Text>
          
          {/* Notifications Info */}
          <TouchableOpacity style={styles.notificationInfo}>
            <Info size={20} color="#fff" />
            <Text style={styles.notificationText}>Notifications not working?</Text>
          </TouchableOpacity>
          
          {/* Reminder Cards */}
          <View style={styles.remindersList}>
            {reminders.map(reminder => renderReminderCard(reminder))}
          </View>
          
          {/* Unlock More Button - Only show for non-premium users */}
          {!isPremiumUser && (
            <TouchableOpacity 
              style={styles.unlockButton}
              onPress={() => setShowPremiumModal(true)}
            >
              <Text style={styles.unlockButtonText}>Unlock more reminders</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.bottomPadding} />
        </ScrollView>
        
        {/* Premium Modal */}
        <PremiumModal 
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          feature="Reminders"
        />
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
  notificationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  notificationText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  remindersList: {
    marginBottom: 20,
  },
  reminderCard: {
    backgroundColor: 'rgba(45, 55, 72, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  lockedCard: {
    opacity: 0.8,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  reminderTime: {
    fontSize: 16,
    color: 'white',
  },
  reminderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frequencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequencyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  scheduleText: {
    fontSize: 16,
    color: '#8A9AB0',
  },
  lockedText: {
    color: '#8A9AB0',
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  unlockButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 150,
  },
  unlockButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  bottomPadding: {
    height: 50,
  },
});