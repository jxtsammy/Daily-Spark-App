import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Modal,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App({navigation}) {
  const [quoteCount, setQuoteCount] = useState(10);
  const [startTime, setStartTime] = useState(new Date().setHours(9, 0, 0, 0));
  const [endTime, setEndTime] = useState(new Date().setHours(22, 0, 0, 0));
  
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  // Format time to display in HH:MM format
  const formatTime = (date) => {
    const hours = new Date(date).getHours().toString().padStart(2, '0');
    const minutes = new Date(date).getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  // Handle time change for start time
  const onStartTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || startTime;
    setShowStartPicker(Platform.OS === 'ios');
    setStartTime(currentDate);
  };
  
  // Handle time change for end time
  const onEndTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || endTime;
    setShowEndPicker(Platform.OS === 'ios');
    setEndTime(currentDate);
  };
  
  return (
    <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content"/>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Get quotes throughout the day</Text>
          <Text style={styles.subHeaderText}>
            Small doses of motivation can make a big difference in your life
          </Text>
        </View>
        
        <View style={styles.quoteCard}>
          <View style={styles.quoteHeader}>
            <Text style={styles.quoteCategory}>❝ Daily Spark</Text>
            <Text style={styles.quoteTime}>now</Text>
            <Text style={styles.expandIcon}>^</Text>
          </View>
          <Text style={styles.quoteText}>
            One day, you'll be at the place you always wanted to be.
          </Text>
        </View>
        
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>How many</Text>
            <Text style={styles.settingValue}>{quoteCount}x</Text>
          </View>
          
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={20}
            step={1}
            value={quoteCount}
            onValueChange={setQuoteCount}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#4A5568"
            thumbTintColor="#FFFFFF"
          />
          
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>1</Text>
            <Text style={styles.sliderLabel}>20</Text>
          </View>
        </View>
        
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Start at</Text>
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.timeButtonText}>{formatTime(startTime)}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>End at</Text>
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.timeButtonText}>{formatTime(endTime)}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={styles.saveButton} onPress={ () => navigation.navigate('Onboarding11')}>
          <Text style={styles.saveButtonText}>Allow and Save</Text>
        </TouchableOpacity>
        
        {/* Time Pickers */}
        {showStartPicker && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={showStartPicker}
            onRequestClose={() => setShowStartPicker(false)}
          >
            <View style={styles.pickerModalContainer}>
              <View style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <TouchableOpacity onPress={() => setShowStartPicker(false)}>
                    <Text style={styles.pickerCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={styles.pickerTitle}>Select Start Time</Text>
                  <TouchableOpacity onPress={() => setShowStartPicker(false)}>
                    <Text style={styles.pickerDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={new Date(startTime)}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={onStartTimeChange}
                  style={styles.picker}
                />
              </View>
            </View>
          </Modal>
        )}
        
        {showEndPicker && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={showEndPicker}
            onRequestClose={() => setShowEndPicker(false)}
          >
            <View style={styles.pickerModalContainer}>
              <View style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <TouchableOpacity onPress={() => setShowEndPicker(false)}>
                    <Text style={styles.pickerCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={styles.pickerTitle}>Select End Time</Text>
                  <TouchableOpacity onPress={() => setShowEndPicker(false)}>
                    <Text style={styles.pickerDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={new Date(endTime)}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={onEndTimeChange}
                  style={styles.picker}
                />
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 24,
  },
  quoteCard: {
    backgroundColor: '#1A202C',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quoteCategory: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quoteTime: {
    color: '#A0AEC0',
    fontSize: 14,
    marginLeft: 8,
  },
  expandIcon: {
    color: 'white',
    marginLeft: 'auto',
    fontSize: 16,
    transform: [{ rotate: '180deg' }],
  },
  quoteText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },
  settingCard: {
    backgroundColor: '#2D3748',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  settingValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  sliderLabel: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  timeButton: {
    backgroundColor: '#1A202C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  timeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#1A202C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  pickerCancel: {
    color: '#3182CE',
    fontSize: 16,
  },
  pickerDone: {
    color: '#3182CE',
    fontSize: 16,
    fontWeight: '600',
  },
  picker: {
    height: 200,
  },
});