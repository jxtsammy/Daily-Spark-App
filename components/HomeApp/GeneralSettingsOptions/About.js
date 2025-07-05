import React from "react";
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
  Image,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Error Boundary to catch rendering errors
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in AboutScreen:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Something went wrong.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const { width, height } = Dimensions.get("window");

export default function AboutScreen({ navigation }) {
  const socialLinks = [
    { name: "facebook-f", color: "#3b5998", url: "https://facebook.com" },
    { name: "twitter", color: "#1DA1F2", url: "https://twitter.com" },
    { name: "linkedin-in", color: "#0077B5", url: "https://linkedin.com" },
    { name: "instagram", color: "#C13584", url: "https://instagram.com" },
    { name: "github", color: "#333", url: "https://github.com" },
  ];

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        {/* Background Image with Gradient Overlay */}
        <View style={styles.backgroundImage}>
          <LinearGradient
            colors={["rgba(25,25,112,0.9)", "rgba(0,0,0,0.8)"]}
            style={styles.gradientOverlay}
          />
        </View>

        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" />

          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (navigation) {
                  navigation.goBack();
                } else {
                  console.warn('Navigation prop is undefined');
                }
              }}
              disabled={!navigation}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>About</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImageBorder}>
                  {(() => {
                    try {
                      return (
                        <Image
                          style={styles.profileImageStyle}
                          source={require("../../../assets/img.jpg")}
                          resizeMode="cover"
                        />
                      );
                    } catch (e) {
                      console.error('Error loading image:', e);
                      return (
                        <Image
                          style={styles.profileImageStyle}
                          source={{ uri: 'https://via.placeholder.com/100' }}
                          resizeMode="cover"
                        />
                      );
                    }
                  })()}
                </View>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Ame Eze</Text>
                <Text style={styles.profileEmail}>amyeze321@gmail.com</Text>
                <Text style={styles.profileRole}>Software Developer</Text>
              </View>
            </View>

            {/* Social Media Links */}
            <View style={styles.socialLinksContainer}>
              {socialLinks.map((social, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.socialButton, { backgroundColor: social.color }]}
                  onPress={async () => {
                    try {
                      const supported = await Linking.canOpenURL(social.url);
                      if (supported) {
                        await Linking.openURL(social.url);
                      } else {
                        console.error(`Cannot open URL: ${social.url}`);
                      }
                    } catch (err) {
                      console.error('Error opening URL:', err);
                    }
                  }}
                >
                  <FontAwesome name={social.name} size={20} color="#FFFFFF" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Bio Section */}
            <View style={styles.bioSection}>
              <Text style={styles.bioTitle}>Bio</Text>
              <Text style={styles.bioText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                ea commodo consequat.
              </Text>
            </View>

            {/* Skills Section */}
            <View style={styles.bioSection}>
              <Text style={styles.bioTitle}>Skills</Text>
              <View style={styles.skillsContainer}>
                {["JavaScript", "React Native", "Node.js", "UI/UX Design", "Python"].map((skill, index) => (
                  <View key={index} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ErrorBoundary>
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
  profileSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImageBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    overflow: 'hidden',
  },
  profileImageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 55,
  },
  profileInfo: {
    alignItems: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 14,
    color: "#8bcdff",
    fontStyle: "italic",
  },
  socialLinksContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
    flexWrap: "wrap",
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  bioSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bioTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#fff",
    letterSpacing: 0.3,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillBadge: {
    backgroundColor: "rgba(139, 205, 255, 0.2)",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 5,
  },
  skillText: {
    color: "#8bcdff",
    fontWeight: "600",
    fontSize: 14,
  },
});