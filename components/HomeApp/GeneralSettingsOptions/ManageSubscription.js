import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PremiumModal from '../PremiumModal';
import { useStore } from '../../../store/useStore';
import { CheckActivePaidSubscriptions } from '../../../functions/check-active-paid-subscription';
import { CancelSubscription } from '../../../functions/cancel-subscription';


const ManageSubscriptionScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [plan, setPlan] = useState({});


  const openPremiumModal = () => {
    setModalVisible(true);
  };

  const closePremiumModal = () => {
    setModalVisible(false);
  };

  const handleCancelSubscription = async (planId) => {
    console.log("Cancelling subscription for plan ID:", planId);

    if (!planId) {
      alert("No active subscription found to cancel");

    }



    const res = await CancelSubscription(planId);
    if (res && res.status === "success") {
      alert("Subscription cancelled successfully");
      checkSubscription();

      navigation.navigate("Home");
    }

    if (res && res.status === "error") {
      checkSubscription();

      alert(res.message || "Failed to cancel subscription");
      console.error("Error cancelling subscription:", res.message);
      return;
    }

  }

  const checkSubscription = async () => {
    setPlan({});
    const res = await CheckActivePaidSubscriptions();
    if (res && res.status === "success" && res.payload && res.payload.plan) {
      setPlan(res.payload);
      console.log("Active subscription found:", res.payload);
    }
  };


  React.useEffect(() => {
    checkSubscription();
  }, [modalVisible]);



  const goPremium = () => {

    openPremiumModal()
  }

  return (
    <ImageBackground
      source={require('../../../assets/smile.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.4)']}
        style={styles.gradientOverlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft color="#fff" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Manage subscription</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.subscriptionInfo}>
              You have a Motivation account. You can purchase a Premium subscription to access our full library of content and features.
            </Text>
          </View>

          {plan?.plan ? (
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(49, 35, 43, 0.79)',
                borderRadius: 14,
                padding: 20,
                marginHorizontal: 24,
                marginBottom: 24,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
              }}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 6 }}>
                {plan.plan.name}
              </Text>
              <Text style={{ color: '#fff', fontSize: 16, marginBottom: 10 }}>
                {plan.plan.description}
              </Text>

              {/* Subscription Dates */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <View>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Started</Text>
                  <Text style={{ color: '#fff', fontSize: 14 }}>
                    {new Date(plan.subscription.start_date._seconds * 1000).toLocaleDateString()}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Ends</Text>
                  <Text style={{ color: '#fff', fontSize: 14 }}>
                    {new Date(plan.subscription.end_date._seconds * 1000).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <Text style={{ color: '#fff', fontSize: 16, marginBottom: 10 }}>
                {plan.plan.currency} {plan.plan.price} / {plan.plan.duration_days} days
              </Text>

              <View style={{ marginTop: 8 }}>
                {Array.isArray(plan.plan.features) && plan.plan.features.map((feature, idx) => (
                  <Text key={idx} style={{ color: '#fff', fontSize: 15, marginLeft: 4 }}>
                    • {feature}
                  </Text>
                ))}
              </View>

              {/* Cancel Subscription Button */}
              {plan.subscription.status === 'active' && (
                <TouchableOpacity
                  style={{
                    marginTop: 18,
                    backgroundColor: '#FF4D4F',
                    borderRadius: 8,
                    paddingVertical: 10,
                    alignItems: 'center',
                  }}
                  activeOpacity={0.8}
                  onPress={() => handleCancelSubscription(plan.subscription.id)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                    Cancel Subscription
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ) : (
            <><View style={{
              backgroundColor: 'rgba(13, 12, 13, 0.72)',
              borderRadius: 14,
              padding: 20,
              marginHorizontal: 24,
              marginBottom: 24,
              alignItems: 'center',
            }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>
                No active subscription plan
              </Text>
              <Text style={{ color: '#fff', fontSize: 15, textAlign: 'center' }}>
                You are currently on no plan. Tap "Go Premium" to upgrade!
              </Text>
            </View><View style={styles.footer}>
                <TouchableOpacity
                  onPress={goPremium}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#9C6AFF', '#FF7EB3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.premiumButton}
                  >

                    <Text style={styles.premiumButtonText}>Go Premium</Text>

                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.restoreButton}
                  activeOpacity={0.6}
                >
                  <Text style={styles.restoreButtonText}>Restore purchase</Text>
                </TouchableOpacity>
              </View></>
          )}



          {/* Footer */}

        </SafeAreaView>
      </LinearGradient>

      {/* Premium Modal */}
      <PremiumModal
        visible={modalVisible}
        onClose={closePremiumModal}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  subscriptionStatus: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subscriptionInfo: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  premiumButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  restoreButton: {
    alignItems: 'center',
  },
  restoreButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
});

export default ManageSubscriptionScreen;