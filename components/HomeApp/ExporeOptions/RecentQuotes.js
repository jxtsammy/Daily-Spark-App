import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ImageBackground,
  Share,
  Animated,
  Easing,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getTodaysQuote } from "../../../functions/quotes";

const { width, height } = Dimensions.get('window');

export default function TodaysQuoteScreen({ navigation }) {
  const [todaysQuote, setTodaysQuote] = useState({
    text: "",
    author: "",
    date: new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    isLiked: false
  });
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [pulseAnim] = useState(new Animated.Value(1));

  // Pulse animation for loading state
  useEffect(() => {
    if (loading) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease)
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease)
          })
        ])
      );
      pulse.start();
      
      return () => pulse.stop();
    }
  }, [loading]);

  useEffect(() => {
    const fetchTodaysQuote = async () => {
      setLoading(true);
      try {
        // Simulate a small delay to show loading state (remove in production)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const quote = await getTodaysQuote();
        if (quote) {
          setTodaysQuote(prev => ({
            ...prev,
            text: quote.text,
            author: quote.author || "Unknown",
          }));
        } else {
          // Handle case where no quote is returned
          setTodaysQuote(prev => ({
            ...prev,
            text: "Inspiration comes from within. Start your day with positivity.",
            author: "Daily Spark"
          }));
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
        // Fallback quote in case of error
        setTodaysQuote(prev => ({
          ...prev,
          text: "Every day is a new beginning. Take a deep breath and start again.",
          author: "Daily Spark"
        }));
      } finally {
        setLoading(false);
        // Animate in the content
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic)
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic)
          })
        ]).start();
      }
    };
    fetchTodaysQuote();
  }, []);

  const shareQuote = async () => {
    try {
      const shareMessage = todaysQuote.author && todaysQuote.author !== "Unknown"
        ? `"${todaysQuote.text}" - ${todaysQuote.author}\n\nShared from Daily Spark`
        : `"${todaysQuote.text}"\n\nShared from Daily Spark`;

      await Share.share({
        message: shareMessage,
        title: "Today's Inspiring Quote",
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const toggleLike = () => {
    setTodaysQuote(prev => ({
      ...prev,
      isLiked: !prev.isLiked
    }));
  };

  if (loading) {
    return (
      <ImageBackground
        source={require("../../../assets/3.jpg")}
        style={styles.backgroundImage}
        blurRadius={2}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.4)"]}
          style={styles.container}
        >
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

          {/* Header during loading */}
          <SafeAreaView style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Ionicons name="chevron-back" size={28} color="white" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            
            <View style={styles.headerTitle}>
              <Text style={styles.headerTitleText}>Daily Quote</Text>
            </View>
            
            <View style={styles.headerPlaceholder} />
          </SafeAreaView>

          {/* Enhanced Loading Animation */}
          <View style={styles.loadingContainer}>
            <Animated.View 
              style={[
                styles.loadingIconContainer,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <Ionicons name="book-outline" size={50} color="rgba(255,255,255,0.7)" />
            </Animated.View>
            
            <Text style={styles.loadingTitle}>Preparing Your Daily Inspiration</Text>
            <Text style={styles.loadingSubtitle}>Loading today's special quote...</Text>
            
            <View style={styles.quoteSkeleton}>
              <Animated.View 
                style={[
                  styles.loadingLine,
                  { transform: [{ scale: pulseAnim }] }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.loadingLine, 
                  { width: '90%', transform: [{ scale: pulseAnim }] }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.loadingLine, 
                  { width: '80%', transform: [{ scale: pulseAnim }] }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.loadingLine, 
                  { width: '70%', transform: [{ scale: pulseAnim }] }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.loadingLine, 
                  { width: '40%', transform: [{ scale: pulseAnim }] }
                ]} 
              />
            </View>
            
            <View style={styles.loadingDots}>
              <Animated.View 
                style={[
                  styles.dot,
                  { transform: [{ scale: pulseAnim }] }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.dot,
                  { transform: [{ scale: pulseAnim }] }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.dot,
                  { transform: [{ scale: pulseAnim }] }
                ]} 
              />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../../assets/3.jpg")}
      style={styles.backgroundImage}
      blurRadius={3}
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.85)", "rgba(0, 0, 0, 0.45)", "rgba(0, 0, 0, 0.3)"]}
        locations={[0, 0.5, 1]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Enhanced Header */}
        <SafeAreaView style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="chevron-back" size={28} color="white" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>Daily Quote</Text>
          </View>
          
          <View style={styles.headerPlaceholder} />
        </SafeAreaView>

        {/* Animated Quote Container */}
        <Animated.View 
          style={[
            styles.quoteContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.6)" />
            <Text style={styles.dateText}>
              {todaysQuote.date}
            </Text>
          </View>

          <View style={styles.quoteContent}>
            <Text style={styles.quoteMark}>"</Text>
            
            <Text style={styles.quoteText}>
              {todaysQuote.text}
            </Text>

            {todaysQuote.author && todaysQuote.author !== "Unknown" && (
              <View style={styles.authorContainer}>
                <View style={styles.authorLine} />
                <Text style={styles.authorText}>
                  {todaysQuote.author}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Enhanced Action Buttons */}
        <View style={styles.actionSection}>
          <Text style={styles.actionTitle}>Save or share this quote</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              onPress={toggleLike} 
              style={[
                styles.actionButton,
                todaysQuote.isLiked && styles.likedButton
              ]}
            >
              <Ionicons
                name={todaysQuote.isLiked ? "heart" : "heart-outline"}
                size={24}
                color={todaysQuote.isLiked ? "#FF5A5F" : "white"}
              />
              <Text style={styles.actionButtonText}>
                {todaysQuote.isLiked ? "Saved" : "Save"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={shareQuote} 
              style={styles.actionButton}
            >
              <Ionicons name="share-social-outline" size={24} color="white" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  backText: {
    color: "white",
    fontSize: 16,
    marginLeft: 4,
    fontWeight: "500",
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
  },
  headerTitleText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  headerPlaceholder: {
    width: 80,
  },
  quoteContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    fontWeight: "500",
  },
  quoteContent: {
    alignItems: "center",
  },
  quoteMark: {
    fontSize: 80,
    color: "rgba(255,255,255,0.9)",
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    lineHeight: 60,
    marginBottom: -20,
  },
  quoteText: {
    fontSize: 26,
    fontWeight: "500",
    color: "white",
    lineHeight: 36,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.3,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  authorLine: {
    width: 30,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginRight: 12,
  },
  authorText: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    fontStyle: "italic",
    fontWeight: "400",
  },
  actionSection: {
    paddingBottom: 40,
    alignItems: "center",
  },
  actionTitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  likedButton: {
    backgroundColor: "rgba(255, 90, 95, 0.2)",
    borderColor: "rgba(255, 90, 95, 0.3)",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
  // Enhanced Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingIconContainer: {
    marginBottom: 30,
    padding: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  loadingTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  quoteSkeleton: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    marginBottom: 40,
  },
  loadingLine: {
    height: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 7,
    width: '100%',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});