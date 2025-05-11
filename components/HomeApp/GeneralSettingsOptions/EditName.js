import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Animated,
  Dimensions,
  Easing
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const DOT_COUNT = 15;

const NameScreen = ({ navigation }) => {
  const [name, setName] = useState();
  const [showNotification, setShowNotification] = useState(false);
  
  // Notification animation value
  const notificationTranslateY = useRef(new Animated.Value(-100)).current;

  // Show notification
  const showNotificationMessage = () => {
    setShowNotification(true);
    Animated.spring(notificationTranslateY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
    }).start();

    // Auto hide after 3 seconds
    setTimeout(() => {
      hideNotification();
    }, 3000);
  };

  // Hide notification
  const hideNotification = () => {
    Animated.timing(notificationTranslateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowNotification(false);
    });
  };

  const handleSave = () => {
    // Here you would typically save to AsyncStorage or your backend
    console.log('Saving name:', name);
    showNotificationMessage();
  };

  // Floating Dots Animation
  const dots = useRef(
    Array.from({ length: DOT_COUNT }).map(() => ({
      position: new Animated.ValueXY({
        x: Math.random() * width,
        y: Math.random() * height,
      }),
      size: new Animated.Value(Math.random() * 6 + 8),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.7),
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
      {/* Notification */}
      {showNotification && (
        <Animated.View
          style={[
            styles.notification,
            {
              transform: [{ translateY: notificationTranslateY }],
            },
          ]}
        >
          <Text style={styles.notificationMessage}>Name saved successfully!</Text>
        </Animated.View>
      )}
      
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
        <Text style={styles.headerTitle}>Name</Text>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={styles.subtitle}>
          Your name is used to personalize your content
        </Text>
        
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#ccc"
          selectionColor="#8B5CF6"
        />
        
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  // Notification Styles
  notification: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#8B5CF6',
    padding: 16,
    zIndex: 1000,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  notificationMessage: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
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
    paddingHorizontal: 16,
    zIndex: 1,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 18,
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(42, 53, 65, 0.8)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
    paddingVertical: 20
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  saveButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#222',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NameScreen;