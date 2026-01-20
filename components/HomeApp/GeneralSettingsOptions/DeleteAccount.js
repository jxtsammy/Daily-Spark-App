import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

export default function DeleteAccountScreen({ navigation }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account and all associated data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            setIsDeleting(true);
            try {
              // Call your backend API to delete the account
              // const response = await fetch('YOUR_API_ENDPOINT/delete-account', {
              //   method: 'DELETE',
              //   headers: { 'Content-Type': 'application/json' },
              // });
              
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              Alert.alert(
                "Account Deleted",
                "Your account and all associated data have been successfully deleted.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      // Navigate to login/onboarding
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "OnboardingScreens1" }],
                      });
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert("Error", "Failed to delete account. Please try again.");
            } finally {
              setIsDeleting(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleContactSupport = async () => {
    const email = "amyeze321@gmail.com";
    try {
      await Linking.openURL(`mailto:${email}?subject=Delete My Account - Daily Spark`);
    } catch (error) {
      Alert.alert("Error", "Could not open email client");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundImage}>
        <LinearGradient
          colors={["rgba(25,25,112,0.9)", "rgba(0,0,0,0.8)"]}
          style={styles.gradientOverlay}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Delete Account</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {/* Warning Section */}
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={40} color="#FF6B6B" />
            <Text style={styles.warningTitle}>Permanent Action</Text>
            <Text style={styles.warningText}>
              Deleting your account is permanent and cannot be undone. All your data will be permanently removed.
            </Text>
          </View>

          {/* What Gets Deleted */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>What Gets Deleted</Text>
            <View style={styles.infoBox}>
              <View style={styles.infoItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Your Account</Text>
                  <Text style={styles.infoDescription}>Email and login credentials</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Saved Quotes</Text>
                  <Text style={styles.infoDescription}>All your collections and bookmarks</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Preferences</Text>
                  <Text style={styles.infoDescription}>Theme, language, and notification settings</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Payment History</Text>
                  <Text style={styles.infoDescription}>Subscription and purchase records</Text>
                </View>
              </View>
            </View>
          </View>

          {/* What Gets Retained */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>What Gets Retained</Text>
            <View style={styles.infoBox}>
              <View style={styles.infoItem}>
                <Ionicons name="information-circle" size={24} color="#FFC107" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Aggregate Analytics</Text>
                  <Text style={styles.infoDescription}>Anonymous usage statistics (up to 12 months)</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="information-circle" size={24} color="#FFC107" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Legal Records</Text>
                  <Text style={styles.infoDescription}>For compliance and fraud prevention (as required by law)</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Alternatives Section */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Before You Go</Text>
            <Text style={styles.alternativeText}>
              You can also delete individual items (quotes, collections) without deleting your entire account. Go to the item and select "Delete".
            </Text>
          </View>

          {/* Contact Support */}
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Need Help?</Text>
            <Text style={styles.contactText}>
              If you have questions or need assistance, contact our support team:
            </Text>
            <TouchableOpacity 
              style={styles.emailButton}
              onPress={handleContactSupport}
            >
              <Ionicons name="mail" size={20} color="#FFFFFF" />
              <Text style={styles.emailButtonText}>amyeze321@gmail.com</Text>
            </TouchableOpacity>
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="trash" size={20} color="#FFFFFF" />
                <Text style={styles.deleteButtonText}>Delete My Account</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 20 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  warningBox: {
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginTop: 10,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    lineHeight: 20,
  },
  infoSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 15,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: "#aaa",
  },
  alternativeText: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
  },
  contactSection: {
    marginBottom: 25,
  },
  contactText: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 12,
    lineHeight: 20,
  },
  emailButton: {
    flexDirection: "row",
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  emailButtonText: {
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 10,
    fontSize: 14,
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
