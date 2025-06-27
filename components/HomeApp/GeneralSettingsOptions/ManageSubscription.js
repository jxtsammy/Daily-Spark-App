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


const ManageSubscriptionScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const loggedIn = useStore((state) => state.loggedIn);


  const openPremiumModal = () => {
    setModalVisible(true);
  };

  const closePremiumModal = () => {
    setModalVisible(false);
  };


  const goPremium = () => {
    // if (!loggedIn) return console.log("Can't go premuim,Log In")

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

          {/* Content */}
          <View style={styles.content}>

            {
              loggedIn ?
                "" :
                <Text style={styles.subscriptionStatus}>
                  You are not logged In
                </Text>


            }

            <Text style={styles.subscriptionInfo}>
              You have a free Motivation account. You can purchase a Premium subscription to access our full library of content and features.
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
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
          </View>
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