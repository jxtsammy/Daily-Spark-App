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
  import { useNavigation } from '@react-navigation/native';
import { GetAllPlans } from '../../functions/get-all-plans';
import { GoPremium } from '../../functions/go-premium';
import * as WebBrowser from 'expo-web-browser';
import { VerifyPayment } from '../../functions/verify-payment';



export default function PremiumModal({ visible, onClose }) {
  const { height } = Dimensions.get('window');
  const slideAnim = useRef(new Animated.Value(height)).current;
  const loggedIn = useStore((state) => state.loggedIn);
  const [plans, setPlans] = React.useState([]);
  const [selectedSubscriptionID, setSelectedSubscriptionID] = React.useState(null);

  const navigation = useNavigation();

 const handleGoPremium = async () => {
  if (!selectedSubscriptionID) {
    alert("Please select a subscription plan");
    return;
  }
  console.log("Selected Subscription ID:", selectedSubscriptionID);

  try {
    // 1. Initialize payment
    const res = await GoPremium(selectedSubscriptionID);
    console.log("Go Premium response:", res);

    if (res.status === "error") {
      alert(res.message + " Please Sign In to continue");
      navigation.navigate("ManageSubscription");
      onClose()
      return;
    }

    if (!res.payload?.payment_url) {
      alert("Failed to initialize payment. Please try again.");
      return;
    }

    // 2. Open payment URL
    await WebBrowser.openBrowserAsync(res.payload.payment_url);
    
    // 3. Verify payment (with retry logic)
    let verificationAttempts = 0;
    const maxAttempts = 3;
    let paymentResult;

    while (verificationAttempts < maxAttempts) {
      paymentResult = await VerifyPayment(res.payload.reference);
      
      if (paymentResult.status === "success") {
        alert("Payment verified successfully!");
         onClose()
        return;
      }

      verificationAttempts++;
      if (verificationAttempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds before retrying
      }
    }

    // If all attempts fail
    alert("Payment verification failed. Please check your subscription status later.");
    navigation.navigate("ManageSubscriptions");

  } catch (error) {
    console.error("Error in handleGoPremium:", error);
    alert("An error occurred. Please try again.");
  }
};
// wrap in useEffect to ensure it runs only once
  useEffect(() => {
    const fetchPlans = async () => {
      const response = await GetAllPlans();
      if (response && response.status === "success" && Array.isArray(response.payload)) {
        setPlans(response.payload);
        console.log('Fetched plans:', response.payload);
      } else {
        setPlans([]);
        console.log('Failed to fetch plans:', response);
      }
    };
    fetchPlans();
  }, []);
  
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
        

        <View style={styles.subscriptionContainer}>
          {plans.length > 0 ? (
            plans.map((plan, idx) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.subscriptionOption,
                  { borderWidth: 2, borderColor: '#8A92B2' },
                  selectedSubscriptionID === plan.id && { borderWidth: 2, borderColor: '#EC4899' }
                ]}
                onPress={() => setSelectedSubscriptionID(plan.id)}
              >
                {plan.discount > 0 && (
                  <LinearGradient
                    colors={['purple', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.freeBadge}
                  >
                    <Text style={styles.freeBadgeText}>
                      {plan.discount}% off
                    </Text>
                  </LinearGradient>
                )}
                <View style={styles.subscriptionContent}>
                  <Text style={styles.subscriptionType}>{plan.name}</Text>
                  <Text style={styles.subscriptionPrice}>
                    GH&#8373; {plan.price.toFixed(2)}
                    {plan.duration_days >= 365
                      ? ' / year'
                      : plan.duration_days >= 30
                      ? ' / month'
                      : ` / ${plan.duration_days} days`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: 'white', textAlign: 'center', flex: 1 }}>
              No plans available.
            </Text>
          )}
        </View>

        <Text style={styles.cancelText}>Cancel anytime · No questions asked</Text>
        <TouchableOpacity onPress={handleGoPremium }>
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