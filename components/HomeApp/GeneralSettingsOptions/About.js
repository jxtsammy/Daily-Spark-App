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
  ImageBackground,
  Image,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Ionicons from "react-native-vector-icons/Ionicons"

const { width, height } = Dimensions.get("window")

export default function AboutScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Background Image with Gradient Overlay */}
      <ImageBackground source={require("../../../assets/about.jpg")} style={styles.backgroundImage} resizeMode="cover">
        <LinearGradient
          colors={[ "rgba(0,0,0,0.9)", "rgba(0,0,0,0.35)"]}
          style={styles.gradientOverlay}
        />
      </ImageBackground>

      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            {/* Circular Image */}
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 40,
                  }}
                  source={require("../../../assets/img.jpg")}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Profile Info */}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Ame Eze</Text>
              <Text style={styles.profileEmail}>amyeze321@gmail.com</Text>
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.bioSection}>
            <Text style={styles.bioTitle}>Bio</Text>
            <Text style={styles.bioText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
  },
  profileImageContainer: {
    marginRight: 20,
  },
  profileImage: {
    width: 85,
    height: 85,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
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
  },
  bioSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  bioTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  bioText: {
    fontSize: 18,
    lineHeight: 24,
    color: "#fff",
  },
})