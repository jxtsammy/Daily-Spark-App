import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import {
  X,
  Check,
  ChevronRight,
  Settings,
  CheckCircle,
  Smartphone,
  Bell,
  LayoutGrid,
  Flame,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const getDays = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const currentDayIndex = today.getDay();
  const reorderedDays = [];

  for (let i = 0; i < 7; i++) {
    const dayIndex = (currentDayIndex + i) % 7;
    reorderedDays.push(days[dayIndex]);
  }

  return reorderedDays;
};

export default function SettingsModal({ visible, onClose }) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [days] = useState(getDays());
  const [streak, setStreak] = useState(1);
  const [dots, setDots] = useState([]);
  const [isClosing, setIsClosing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const createDots = () => {
      const newDots = [];
      const numDots = 10;

      for (let i = 0; i < numDots; i++) {
        const posX = Math.random() * width;
        const posY = height - Math.random() * 200;
        const size = Math.random() * 7 + 8;
        const opacity = Math.random() * 0.3 + 0.8;

        newDots.push({ posX, posY, size, opacity });
      }

      setDots(newDots);
    };

    createDots();
  }, []);

  useEffect(() => {
    if (visible && !isClosing) {
      setIsClosing(false);
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else if (!visible || isClosing) {
      Animated.timing(slideAnim, {
        toValue: height * 0.9,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (isClosing) {
          onClose();
          setIsClosing(false);
        }
      });
    }
  }, [visible, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
  };

  if (!visible && !isClosing) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {dots.map((dot, index) => (
          <View
            key={index}
            style={[
              styles.floatingDot,
              {
                left: dot.posX,
                top: dot.posY,
                width: dot.size,
                height: dot.size,
                opacity: dot.opacity,
              },
            ]}
          />
        ))}

        <View style={styles.modalContent}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />

          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Settings</Text>
          </View>

          {/* Premium Card */}
          <TouchableOpacity style={styles.premiumCardContainer}>
            <LinearGradient
              colors={['#4B0082', '#1E3A8A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumCardBackground}
            >
              <View style={styles.premiumCardContent}>
                <View>
                  <Text style={styles.premiumCardTitle}>
                    Try Motivation Premium
                  </Text>
                  <Text style={styles.premiumCardDescription}>
                    Access all categories, quotes, themes, and remove ads!
                  </Text>
                </View>
                <View style={styles.phoneIconContainer}>
                  <Smartphone size={40} color="white" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Firestreak */}
          {/* <View style={styles.firestreakContainer}>
            <View style={styles.firestreakContent}>
              <View style={styles.fireIcon}>
                <LinearGradient
                  colors={['#A78BFA', '#EC4899']}
                  style={styles.fireGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}>
                  <Flame size={34} color="white" />
                </LinearGradient>
              </View>

              <View style={styles.daysContainer}>
                {days.map((day, index) => (
                  <View key={index} style={styles.dayColumn}>
                    <Text style={styles.dayText}>{day}</Text>
                    <View
                      style={[
                        styles.dayCircle,
                        index === 0 && styles.activeDayCircle,
                      ]}>
                      {index === 0 && <Check size={16} color="white" />}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View> */}

          {/* Settings */}
          {/* <Text style={styles.sectionTitle}>SETTINGS</Text> */}
          <View style={styles.settingsContainer}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate('GeneralSettings')}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <Settings size={20} color="white" />
                </View>
                <Text style={styles.settingText}>General</Text>
              </View>
              <ChevronRight size={20} color="#A0AEC0" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate('Topics')}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <CheckCircle size={20} color="white" />
                </View>
                <Text style={styles.settingText}>Topics you follow</Text>
              </View>
              <ChevronRight size={20} color="#A0AEC0" />
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate('Reminders')}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <Bell size={20} color="white" />
                </View>
                <Text style={styles.settingText}>Reminders</Text>
              </View>
              <ChevronRight size={20} color="#A0AEC0" />
            </TouchableOpacity> */}

            {/* <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate('Widgets')}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <LayoutGrid size={20} color="white" />
                </View>
                <Text style={styles.settingText}>Widgets</Text>
              </View>
              <ChevronRight size={20} color="#A0AEC0" />
            </TouchableOpacity> */}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.9,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 70 : StatusBar.currentHeight + 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 15,
  },
  premiumCardContainer: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  premiumCardBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
  },
  premiumCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
premiumCardTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: 'white',
  marginBottom: 5,
},
premiumCardDescription: {
  fontSize: 14,
  color: 'white',
  opacity: 0.9,
  width: '80%',
},
phoneIconContainer: {
  width: 60,
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  transform: [{ rotateZ: '15deg' }],
},
firestreakContainer: {
  backgroundColor: 'rgba(45, 55, 72, 0.5)',
  borderRadius: 16,
  padding: 15,
  marginBottom: 20,
},
firestreakContent: {
  flexDirection: 'row',
  alignItems: 'center',
},
fireIcon: {
  width: 40,
  height: 50,
  marginRight: 15,
  overflow: 'hidden',
},
fireGradient: {
  width: 40,
  height: 50,
  borderRadius: 15,
  justifyContent: 'center',
  alignItems: 'center',
},
daysContainer: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
},
dayColumn: {
  alignItems: 'center',
},
dayText: {
  color: 'white',
  fontSize: 12,
  marginBottom: 8,
},
dayCircle: {
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: 'rgba(160, 174, 192, 0.3)',
  justifyContent: 'center',
  alignItems: 'center',
},
activeDayCircle: {
  backgroundColor: 'rgba(167, 139, 250, 0.8)',
},
sectionTitle: {
  fontSize: 14,
  fontWeight: 'bold',
  color: 'white',
  marginBottom: 10,
},
settingsContainer: {
  backgroundColor: 'rgba(45, 55, 72, 0.5)',
  borderRadius: 16,
  overflow: 'hidden',
},
modalContainer: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: height * 0.9,
  backgroundColor: '#000',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  overflow: 'hidden',
},
modalContent: {
  flex: 1,
  padding: 20,
  paddingTop: Platform.OS === 'ios' ? 70 : StatusBar.currentHeight + 20,
},
header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
},
closeButton: {
  padding: 5,
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  color: 'white',
  marginLeft: 15,
},
premiumCardContainer: {
  height: 120,
  borderRadius: 16,
  overflow: 'hidden',
  marginBottom: 20,
},
premiumCardBackground: {
  width: '100%',
  height: '100%',
  borderRadius: 16,
  padding: 20,
  justifyContent: 'center',
},
premiumCardContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
premiumCardTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: 'white',
  marginBottom: 5,
},
premiumCardDescription: {
  fontSize: 14,
  color: 'white',
  opacity: 0.9,
  width: '80%',
},
phoneIconContainer: {
  width: 60,
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  transform: [{ rotateZ: '15deg' }],
},
firestreakContainer: {
  backgroundColor: 'rgba(45, 55, 72, 0.5)',
  borderRadius: 16,
  padding: 15,
  marginBottom: 20,
},
firestreakContent: {
  flexDirection: 'row',
  alignItems: 'center',
},
fireIcon: {
  width: 40,
  height: 50,
  marginRight: 15,
  overflow: 'hidden',
},
fireGradient: {
  width: 40,
  height: 50,
  borderRadius: 15,
  justifyContent: 'center',
  alignItems: 'center',
},
daysContainer: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
},
dayColumn: {
  alignItems: 'center',
},
dayText: {
  color: 'white',
  fontSize: 12,
  marginBottom: 8,
},
dayCircle: {
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: 'rgba(160, 174, 192, 0.3)',
  justifyContent: 'center',
  alignItems: 'center',
},
activeDayCircle: {
  backgroundColor: 'rgba(167, 139, 250, 0.8)',
},
sectionTitle: {
  fontSize: 14,
  fontWeight: 'bold',
  color: 'white',
  marginBottom: 10,
},
settingsContainer: {
  backgroundColor: 'rgba(45, 55, 72, 0.5)',
  borderRadius: 16,
  overflow: 'hidden',
},
settingItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 15,
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(160, 174, 192, 0.1)',
  paddingVertical: 20,
},
settingLeft: {
  flexDirection: 'row',
  alignItems: 'center',
},
settingIconContainer: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: 'rgba(160, 174, 192, 0.2)',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 15,
},
settingText: {
  fontSize: 20,
  color: 'white',
},
floatingDot: {
  position: 'absolute',
  borderRadius: 50,
  backgroundColor: 'white',
  zIndex: -1,
},
});