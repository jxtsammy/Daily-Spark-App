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
import { Star, Brain, Activity, Mountain, Heart, Users, ChevronLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const DOT_COUNT = 15;

const ContentPreferencesScreen = ({ navigation }) => {
  const [selectedTopics, setSelectedTopics] = useState(['Positive thinking']);

  const topics = [
    { id: 1, name: 'Faith & spirituality', icon: <Star color="#fff" size={24} /> },
    { id: 2, name: 'Positive thinking', icon: <Brain color="#fff" size={24} /> },
    { id: 3, name: 'Stress & anxiety', icon: <Activity color="#fff" size={24} /> },
    { id: 4, name: 'Achieving goals', icon: <Mountain color="#fff" size={24} /> },
    { id: 5, name: 'Self-esteem', icon: <Heart color="#fff" size={24} /> },
    { id: 6, name: 'Relationships', icon: <Users color="#fff" size={24} /> },
  ];

  const toggleTopic = (topicName) => {
    if (selectedTopics.includes(topicName)) {
      setSelectedTopics(selectedTopics.filter(name => name !== topicName));
    } else {
      setSelectedTopics([...selectedTopics, topicName]);
    }
  };

  // Floating Dots Animation
  const dots = useRef(
    Array.from({ length: DOT_COUNT }).map(() => ({
      position: new Animated.ValueXY({
        x: Math.random() * width,
        y: Math.random() * height,
      }),
      size: new Animated.Value(Math.random() * 7 + 8),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.4),
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
        <Text style={styles.headerTitle}>Content preferences</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>Select all topics that interest you</Text>
        
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={[
              styles.topicItem,
              selectedTopics.includes(topic.name) && styles.selectedTopic,
            ]}
            onPress={() => toggleTopic(topic.name)}
          >
            <View style={styles.topicLeft}>
              {topic.icon}
              <Text style={styles.topicText}>{topic.name}</Text>
            </View>
            {selectedTopics.includes(topic.name) && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: 16,
    zIndex: 1,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 18,
    marginBottom: 24,
  },
  topicItem: {
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
  selectedTopic: {
    borderColor: '#fff',
  },
  topicLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 16,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#222',
    fontWeight: 'bold',
  },
});

export default ContentPreferencesScreen;