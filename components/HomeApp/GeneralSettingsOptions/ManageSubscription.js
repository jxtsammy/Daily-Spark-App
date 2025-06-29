import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ToastManager, { Toast } from 'toastify-react-native';
import PremiumModal from '../PremiumModal';
import { useStore } from '../../../store/useStore';
import { CheckActivePaidSubscriptions } from '../../../functions/check-active-paid-subscription';
import { CancelSubscription } from '../../../functions/cancel-subscription';

const ManageSubscriptionScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const openPremiumModal = () => {
    setModalVisible(true);
  };

  const closePremiumModal = () => {
    setModalVisible(false);
  };

  const handleCancelSubscription = async (planId) => {
    if (!planId) {
      Toast.error('No active subscription found to cancel');
      return;
    }

    setCancelling(true);
    try {
      const res = await CancelSubscription(planId);
      if (res?.status === "success") {
        Toast.success('Subscription cancelled successfully');
        await checkSubscription();
        navigation.navigate("Home");
      } else {
        Toast.error(res?.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      Toast.error('An error occurred while cancelling subscription');
    } finally {
      setCancelling(false);
    }
  };

  const checkSubscription = async () => {
    setLoading(true);
    try {
      const res = await CheckActivePaidSubscriptions();
      if (res?.status === "success" && res.payload?.plan) {
        setPlan(res.payload);
      } else {
        setPlan(null);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      Toast.error('Failed to load subscription details');
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRestorePurchase = async () => {
    setLoading(true);
    try {
      const res = await CheckActivePaidSubscriptions();
      if (res?.status === "success" && res.payload?.plan) {
        setPlan(res.payload);
        Toast.success('Subscription restored successfully');
      } else {
        Toast.info('No active subscription found to restore');
      }
    } catch (error) {
      console.error("Error restoring purchase:", error);
      Toast.error('Failed to restore purchase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', checkSubscription);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
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
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <ChevronLeft color="#fff" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Manage subscription</Text>
          </View>

          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Loading subscription details...</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
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
        <ToastManager />
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <ChevronLeft color="#fff" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Manage subscription</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.subscriptionInfo}>
              {plan?.plan 
                ? 'Manage your premium subscription and access all features.'
                : 'Upgrade to Premium to access our full library of content and features.'}
            </Text>
          </View>

          {plan?.plan ? (
            <View style={styles.planContainer}>
              <Text style={styles.planName}>{plan.plan.name}</Text>
              <Text style={styles.planDescription}>{plan.plan.description}</Text>

              <View style={styles.datesContainer}>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Started</Text>
                  <Text style={styles.dateValue}>
                    {new Date(plan.subscription.start_date._seconds * 1000).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Ends</Text>
                  <Text style={styles.dateValue}>
                    {new Date(plan.subscription.end_date._seconds * 1000).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <Text style={styles.planPrice}>
                {plan.plan.currency} {plan.plan.price} / {plan.plan.duration_days} days
              </Text>

              <View style={styles.featuresContainer}>
                {Array.isArray(plan.plan.features) && plan.plan.features.map((feature, idx) => (
                  <Text key={idx} style={styles.featureItem}>
                    • {feature}
                  </Text>
                ))}
              </View>

              {plan.subscription.status === 'active' && (
                <TouchableOpacity
                  style={[styles.cancelButton, cancelling && styles.disabledButton]}
                  activeOpacity={0.8}
                  onPress={() => handleCancelSubscription(plan.subscription.id)}
                  disabled={cancelling}
                >
                  {cancelling ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              <View style={styles.noPlanContainer}>
                <Text style={styles.noPlanTitle}>No active subscription</Text>
                <Text style={styles.noPlanText}>
                  Upgrade to Premium to unlock all features and content
                </Text>
              </View>

              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={openPremiumModal}
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
                  onPress={handleRestorePurchase}
                >
                  <Text style={styles.restoreButtonText}>Restore purchase</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </LinearGradient>

      <PremiumModal
        visible={modalVisible}
        onClose={closePremiumModal}
        onSubscriptionSuccess={checkSubscription}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
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
    padding: 24,
  },
  subscriptionInfo: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  planContainer: {
    backgroundColor: 'rgba(49, 35, 43, 0.79)',
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  planName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  planDescription: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  dateValue: {
    color: '#fff',
    fontSize: 14,
  },
  planPrice: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureItem: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 4,
    marginBottom: 4,
  },
  cancelButton: {
    marginTop: 18,
    backgroundColor: '#FF4D4F',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noPlanContainer: {
    backgroundColor: 'rgba(13, 12, 13, 0.72)',
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  noPlanTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  noPlanText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
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
    fontWeight: '600',
  },
});

export default ManageSubscriptionScreen;