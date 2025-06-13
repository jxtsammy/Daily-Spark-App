import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { X, Check, Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';

const { height } = Dimensions.get('window');

export default function PremiumModal({ visible, onClose }) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const loggedIn = useStore((state) => state.loggedIn);
  
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Animated.View 
      style={[
        styles.modalContainer,
        { 
          transform: [{ translateY: slideAnim }],
          opacity: visible ? 1 : 0,
          zIndex: visible ? 100 : -1,
        }
      ]}
    >
      <View style={styles.modalContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Try Premium</Text>
        </View>
        
        {/* Crown Icon */}
        <View style={styles.crownContainer}>
          <Crown size={60} color="#8A92B2" fill="#8A92B2" />
        </View>
        
        {/* Main Content */}
        <Text style={styles.subtitle}>Unlock everything</Text>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureRow}>
            <View style={styles.checkCircle}>
              <Check size={18} color="white" />
            </View>
            <Text style={styles.featureText}>Quotes you can't find anywhere else</Text>
          </View>
          
          <View style={styles.featureRow}>
            <View style={styles.checkCircle}>
              <Check size={18} color="white" />
            </View>
            <Text style={styles.featureText}>Categories for any situation</Text>
          </View>
          
          <View style={styles.featureRow}>
            <View style={styles.checkCircle}>
              <Check size={18} color="white" />
            </View>
            <Text style={styles.featureText}>Original themes, customizable</Text>
          </View>
          
          <View style={styles.featureRow}>
            <View style={styles.checkCircle}>
              <Check size={18} color="white" />
            </View>
            <Text style={styles.featureText}>Enjoy the full experience</Text>
          </View>
        </View>
        
        {/* Subscription Options */}
        <View style={styles.subscriptionContainer}>
          <TouchableOpacity style={styles.subscriptionOption}>
            <LinearGradient
              colors={['purple', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.freeBadge}
            >
              <Text style={styles.freeBadgeText}>3 days free</Text>
            </LinearGradient>
            <View style={styles.subscriptionContent}>
              <Text style={styles.subscriptionType}>Annual</Text>
              <Text style={styles.subscriptionPrice}>GH₵540.00/year</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.subscriptionOption}>
            <View style={styles.subscriptionContent}>
              <Text style={styles.subscriptionType}>Monthly</Text>
              <Text style={styles.subscriptionPrice}>GH₵190.00/month</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.cancelText}>Cancel anytime · No questions asked</Text>
        
        {/* Continue Button */}
        <TouchableOpacity>
          <LinearGradient
            colors={['purple', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButton}
          >
            <Text style={styles.continueText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Restore</Text>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms & Conditions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Text style={styles.footerLink}>Other options</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#222',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 70 : 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
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
  crownContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4C566A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: 'white',
    flex: 1,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  subscriptionOption: {
    width: '48%',
    height: 100,
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 15,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  freeBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 5,
    alignItems: 'center',
  },
  freeBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  subscriptionContent: {
    marginTop: 15,
  },
  subscriptionType: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subscriptionPrice: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: 5,
  },
  cancelText: {
    textAlign: 'center',
    color: '#A0AEC0',
    marginBottom: 20,
  },
  continueButton: {
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  footerLink: {
    color: '#A0AEC0',
    fontSize: 14,
  },
});