import React, { useEffect, useRef } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  Dimensions,
  Animated
} from 'react-native';

const { width } = Dimensions.get('window');

const AnimatedDot = ({ style }) => {
  const moveAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(style.opacity || 0.3)).current;
  
  useEffect(() => {
    // Random duration between 2-4 seconds for varied movement
    const duration = 2000 + Math.random() * 2000;
    
    // Create floating animation
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(moveAnim, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: (style.opacity || 0.3) + 0.1,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(moveAnim, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: (style.opacity || 0.3) - 0.1,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  // Calculate a small random movement (5-10px)
  const movement = 5 + Math.random() * 5;
  
  const animatedStyle = {
    transform: [
      {
        translateY: moveAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, movement],
        }),
      },
    ],
    opacity: opacityAnim,
  };

  return <Animated.View style={[styles.floatingDot, style, animatedStyle]} />;
};

export default function App({navigation}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.container}>
        {/* Animated floating dots */}
        <AnimatedDot style={{ top: '10%', left: '15%', width: 12, height: 12, opacity: 0.4 }} />
        <AnimatedDot style={{ top: '25%', right: '10%', width: 20, height: 20, opacity: 0.3 }} />
        <AnimatedDot style={{ top: '60%', left: '8%', width: 15, height: 15, opacity: 0.5 }} />
        <AnimatedDot style={{ bottom: '15%', right: '15%', width: 10, height: 10, opacity: 0.4 }} />
        <AnimatedDot style={{ bottom: '30%', left: '20%', width: 8, height: 8, opacity: 0.3 }} />
        
        <View style={styles.content}>
          <Text style={styles.title}>Add a widget to your Home Screen</Text>
          
          <Text style={styles.instructions}>
            On your phone's Home Screen, touch and hold an empty area and 
            then select the Motivation widget from the list
          </Text>
          
          <View style={styles.phoneContainer}>
            <View style={styles.phone}>
              <View style={styles.phoneNotch} />
              <View style={styles.widgetContainer}>
                <Text style={styles.widgetText}>
                  You are stronger than you think
                </Text>
              </View>
              <View style={styles.iconsContainer}>
                {[...Array(12)].map((_, index) => (
                  <View key={index} style={styles.appIcon} />
                ))}
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.installButton}>
            <Text style={styles.installButtonText}>Install widget</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.remindButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.remindButtonText}>Remind me later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#222',
  },
  container: {
    flex: 1,
    padding: 20,
    margin: 0, 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  instructions: {
    fontSize: 16,
    color: '#B0B8C1',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  phoneContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50
  },
  phone: {
    width: width * 0.6,
    height: width * 1.2,
    backgroundColor: '#ccc',
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  phoneNotch: {
    width: 80,
    height: 20,
    backgroundColor: '#1E2A38',
    borderRadius: 10,
    marginBottom: 20,
  },
  widgetContainer: {
    width: '100%',
    height: 80,
    backgroundColor: '#121920',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  widgetText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  appIcon: {
    width: width * 0.14,
    height: width * 0.13,
    backgroundColor: '#3A4755',
    borderRadius: 12,
    margin: 5,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  installButton: {
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 1,
    width: '95%', 
  },
  installButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '800',
  },
  remindButton: {
    paddingVertical: 12,
    alignItems: 'center',
    width: '80%', 
  },
  remindButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  floatingDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    opacity: 0.3,
  },
});