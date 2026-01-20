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
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

export default function ManageDataScreen({ navigation }) {
  const [dataPreferences, setDataPreferences] = useState({
    analytics: true,
    crashReports: true,
    personalizedAds: true,
  });

  const handleDataDeletion = (dataType) => {
    const messages = {
      quotes: "Delete all saved quotes and collections?",
      preferences: "Reset all app preferences (theme, language, notifications)?",
      history: "Clear view history and recently viewed quotes?",
      analytics: "Disable analytics tracking?",
    };

    Alert.alert(
      "Delete Data",
      messages[dataType],
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            Alert.alert("Success", `${dataType} has been deleted.`);
          },
          style: "destructive",
        },
      ]
    );
  };

  const toggleDataCollection = (type) => {
    setDataPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
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
          <Text style={styles.headerTitle}>Manage Data</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Ionicons name="shield-checkmark" size={32} color="#4CAF50" />
            <Text style={styles.bannerText}>
              You can delete specific data without closing your account
            </Text>
          </View>

          {/* Delete Individual Data Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delete Specific Data</Text>

            {/* Saved Quotes */}
            <TouchableOpacity
              style={styles.dataItem}
              onPress={() => handleDataDeletion("quotes")}
            >
              <View style={styles.itemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name="bookmark" size={20} color="#FFC107" />
                </View>
                <View>
                  <Text style={styles.itemTitle}>Saved Quotes & Collections</Text>
                  <Text style={styles.itemDescription}>All bookmarked quotes and custom collections</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>

            {/* Preferences */}
            <TouchableOpacity
              style={styles.dataItem}
              onPress={() => handleDataDeletion("preferences")}
            >
              <View style={styles.itemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name="settings" size={20} color="#2196F3" />
                </View>
                <View>
                  <Text style={styles.itemTitle}>App Preferences</Text>
                  <Text style={styles.itemDescription}>Theme, language, and notification settings</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>

            {/* History */}
            <TouchableOpacity
              style={styles.dataItem}
              onPress={() => handleDataDeletion("history")}
            >
              <View style={styles.itemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name="time" size={20} color="#9C27B0" />
                </View>
                <View>
                  <Text style={styles.itemTitle}>View History</Text>
                  <Text style={styles.itemDescription}>Recently viewed quotes and browsing history</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Data Collection Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Collection Preferences</Text>
            <Text style={styles.sectionDescription}>
              Choose what data you'd like us to collect to improve your experience
            </Text>

            {/* Analytics */}
            <View style={styles.toggleItem}>
              <View>
                <Text style={styles.toggleTitle}>Analytics & Crash Reports</Text>
                <Text style={styles.toggleDescription}>
                  Help us improve the app by sharing usage data
                </Text>
              </View>
              <Switch
                value={dataPreferences.analytics}
                onValueChange={() => toggleDataCollection("analytics")}
                trackColor={{ false: "#767577", true: "#4CAF50" }}
                thumbColor={dataPreferences.analytics ? "#81C784" : "#f4f3f4"}
              />
            </View>

            {/* Personalized Ads */}
            <View style={styles.toggleItem}>
              <View>
                <Text style={styles.toggleTitle}>Personalized Ads</Text>
                <Text style={styles.toggleDescription}>
                  See ads tailored to your interests
                </Text>
              </View>
              <Switch
                value={dataPreferences.personalizedAds}
                onValueChange={() => toggleDataCollection("personalizedAds")}
                trackColor={{ false: "#767577", true: "#4CAF50" }}
                thumbColor={dataPreferences.personalizedAds ? "#81C784" : "#f4f3f4"}
              />
            </View>
          </View>

          {/* Data Retention */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Retention</Text>
            <View style={styles.retentionBox}>
              <View style={styles.retentionItem}>
                <Text style={styles.retentionLabel}>Saved Quotes</Text>
                <Text style={styles.retentionValue}>Until you delete them</Text>
              </View>
              <View style={styles.retentionItem}>
                <Text style={styles.retentionLabel}>Analytics Data</Text>
                <Text style={styles.retentionValue}>12 months</Text>
              </View>
              <View style={styles.retentionItem}>
                <Text style={styles.retentionLabel}>Crash Reports</Text>
                <Text style={styles.retentionValue}>30 days</Text>
              </View>
              <View style={styles.retentionItem}>
                <Text style={styles.retentionLabel}>Advertising ID</Text>
                <Text style={styles.retentionValue}>~90 days (Google AdMob policy)</Text>
              </View>
            </View>
          </View>

          {/* Delete Full Account */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.deleteAccountButton}
              onPress={() => navigation.navigate("DeleteAccount")}
            >
              <Ionicons name="trash" size={20} color="#FF6B6B" />
              <Text style={styles.deleteAccountText}>Delete Entire Account</Text>
              <Ionicons name="chevron-forward" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
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
  infoBanner: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 25,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  bannerText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
    textAlign: "center",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 15,
  },
  dataItem: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: "#aaa",
  },
  toggleItem: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 13,
    color: "#aaa",
  },
  retentionBox: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 15,
  },
  retentionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  retentionLabel: {
    fontSize: 14,
    color: "#ccc",
    fontWeight: "500",
  },
  retentionValue: {
    fontSize: 14,
    color: "#8bcdff",
    fontWeight: "600",
  },
  deleteAccountButton: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  deleteAccountText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
  },
});
