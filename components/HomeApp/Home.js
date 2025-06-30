import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  PanResponder,
  Share,
  Dimensions,
  StatusBar,
  Platform,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Crown } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import PremiumModal from "./PremiumModal";
import SettingsModal from "./SettingScreen";
import ThemesModal from "./Themes";
import Color from "color";
import { useStore } from "../../store/useStore";
import { CheckHasFreeTrial } from "../../functions/check-has-free-trial";
import { CheckActivePaidSubscriptions } from "../../functions/check-active-paid-subscription";
import { getMultipleQuotes, saveQuote } from "../../functions/quotes";

const { width, height } = Dimensions.get("window");

// Sample quotes data (fallback)
const quotesA = [
  { 
    id: "default-1", 
    text: "I deserve to have joy in my life.",
    author: "Self",
    source: "default",
    backgroundColor: "#EAE6DF" 
  },
  { 
    id: "default-2", 
    text: "I am worthy of love and respect.",
    author: "Self",
    source: "default",
    backgroundColor: "#E5E1D8" 
  },
  { 
    id: "default-3", 
    text: "My potential is limitless.",
    author: "Self",
    source: "default",
    backgroundColor: "#D8D3C8" 
  },
  { 
    id: "default-4", 
    text: "I embrace challenges as opportunities.",
    author: "Self",
    source: "default",
    backgroundColor: "#E8E4DD" 
  },
  { 
    id: "default-5", 
    text: "I am enough just as I am.",
    author: "Self",
    source: "default",
    backgroundColor: "#F0EDE6" 
  },
  { 
    id: "default-6", 
    text: "Today I choose happiness.",
    author: "Self",
    source: "default",
    backgroundColor: "#E2DED7" 
  },
  { 
    id: "default-7", 
    text: "I am in control of my thoughts and feelings.",
    author: "Self",
    source: "default",
    backgroundColor: "#EBE7E0" 
  }
];

// Default theme
const defaultTheme = {
  id: "color-1",
  name: "Light Cream",
  type: "color",
  value: "#F5F5F0",
  isPremium: false,
  isGradient: false,
};

// Helper function to determine if a color is dark
const isDarkColor = (colorValue) => {
  try {
    if (typeof colorValue === "string") {
      return Color(colorValue).isDark();
    } else if (Array.isArray(colorValue)) {
      return Color(colorValue[0]).isDark();
    }
    return false;
  } catch (error) {
    console.log("Error determining color brightness:", error);
    return false;
  }
};

// Helper function for background colors
const getRandomBackgroundColor = () => {
  const colors = [
    "#EAE6DF", "#E5E1D8", "#D8D3C8", 
    "#E8E4DD", "#F0EDE6", "#E2DED7", "#EBE7E0"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function QuotesScreen({ navigation, isPremiumUser = false }) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [currentQuoteLiked, setCurrentQuoteLiked] = useState(false);
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [themesModalVisible, setThemesModalVisible] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [quotes, setQuotes] = useState(quotesA); // Initialize with default quotes
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreQuotes, setHasMoreQuotes] = useState(true);
  const [isPremium, setIsPremium] = useState(isPremiumUser);

  // Animation values
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const nextQuoteAnim = useRef(new Animated.Value(height)).current;
  const prevQuoteAnim = useRef(new Animated.Value(-height)).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;

  // Get current quote
  const currentQuote = quotes[currentQuoteIndex];
  const nextQuote = quotes[(currentQuoteIndex + 1) % quotes.length];
  const prevQuote = quotes[currentQuoteIndex === 0 ? quotes.length - 1 : currentQuoteIndex - 1];

  // Calculate progress
  const progress = likedQuotes.length;
  const maxProgress = 5;
  const progressWidth = (progress / maxProgress) * 120;

  // Fetch quotes from backend
  const fetchQuotes = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const response = await getMultipleQuotes(10); // Get 10 quotes
      
      if (response && Array.isArray(response)) {
        if (response.length === 0) {
          setHasMoreQuotes(false);
          return;
        }
        
        // Map API response to our expected format
        const mappedQuotes = response.map((quote, index) => ({
          id: `${quote.source}-${index}-${Date.now()}`, // Create unique ID
          text: quote.text,
          author: quote.author || "Unknown",
          source: quote.source || "unknown",
          backgroundColor: getRandomBackgroundColor()
        }));

        setQuotes(mappedQuotes);
        setCurrentQuoteIndex(0);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check when we're near the end of quotes
  useEffect(() => {
    if (currentQuoteIndex >= quotes.length - 3 && hasMoreQuotes && !isLoading) {
      if(isPremium){
        fetchQuotes(); 
      }
    }
  }, [currentQuoteIndex, quotes.length]);

  // Check user status and fetch initial quotes if needed
  useEffect(() => {
    let isMounted = true;

    const checkUserAndFetch = async () => {
      const { userId } = useStore.getState();
      
      if (!userId) {
        console.log("No user ID, navigating to onboarding");
        navigation.reset({ index: 0, routes: [{ name: 'PremiumOnbording' }] });
        return;
      }

      // Check free trial status
      const hasActiveTrial = await CheckHasFreeTrial();
      
      if (!isMounted) return;

      if (hasActiveTrial) {
        navigation.navigate('Home');
      } else {
        // If no trial, check subscriptions
        const res = await CheckActivePaidSubscriptions();
        setIsPremium(res.payload?.subscription?.is_free === false)
        
        if (res.payload?.subscription?.is_free === false) {
          fetchQuotes();
        }
      }
    };

    checkUserAndFetch();

    return () => { isMounted = false; };
  }, [navigation,setIsPremium]);

  // Determine text and icon colors based on background
  useEffect(() => {
    if (currentTheme.type === "color" && !currentTheme.isGradient) {
      setIsDark(isDarkColor(currentTheme.value));
    } else if (currentTheme.type === "gradient") {
      const isDarkGradient = currentTheme.value.some((color) => isDarkColor(color));
      setIsDark(isDarkGradient);
    } else if (currentTheme.type === "image") {
      setIsDark(true);
    }
  }, [currentTheme]);

  // Get text color based on background darkness
  const getTextColor = () => (isDark ? "#FFFFFF" : "#000000");

  // Get background color for UI elements
  const getElementBgColor = () => (isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)");

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return (Math.abs(dy) > Math.abs(dx)) && Math.abs(dy) > 10;
      },
      onPanResponderGrant: () => {
        setIsAnimating(true);
      },
      onPanResponderMove: (_, gestureState) => {
        const { dy } = gestureState;
        swipeAnim.setValue(dy);
        
        if (dy < 0) {
          // Swiping up - show next quote
          nextQuoteAnim.setValue(height + dy);
        } else if (dy > 0) {
          // Swiping down - show previous quote
          prevQuoteAnim.setValue(-height + dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;
        const threshold = height * 0.1; // 10% of screen height
        const velocityThreshold = 0.5;

        if (dy < -threshold || vy < -velocityThreshold) {
          // Swipe up - next quote
          Animated.parallel([
            Animated.timing(swipeAnim, {
              toValue: -height,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(nextQuoteAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            swipeAnim.setValue(0);
            nextQuoteAnim.setValue(height);
            prevQuoteAnim.setValue(-height);
            setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
            setCurrentQuoteLiked(false);
            setIsAnimating(false);
          });
        } else if (dy > threshold || vy > velocityThreshold) {
          // Swipe down - previous quote
          Animated.parallel([
            Animated.timing(swipeAnim, {
              toValue: height,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(prevQuoteAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            swipeAnim.setValue(0);
            nextQuoteAnim.setValue(height);
            prevQuoteAnim.setValue(-height);
            setCurrentQuoteIndex((prev) => (prev === 0 ? quotes.length - 1 : prev - 1));
            setCurrentQuoteLiked(false);
            setIsAnimating(false);
          });
        } else {
          // Return to center
          Animated.parallel([
            Animated.spring(swipeAnim, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.spring(nextQuoteAnim, {
              toValue: height,
              useNativeDriver: true,
            }),
            Animated.spring(prevQuoteAnim, {
              toValue: -height,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setIsAnimating(false);
          });
        }
      },
      onPanResponderTerminate: () => {
        setIsAnimating(false);
      },
    }),
  ).current;

  // Handle like action
  const handleLike = async () => {
    if (currentQuoteLiked) {
      setLikedQuotes((prev) => {
        const index = prev.indexOf(currentQuote.id);
        if (index !== -1) {
          const newLiked = [...prev];
          newLiked.splice(index, 1);
          return newLiked;
        }
        return prev;
      });
      setCurrentQuoteLiked(false);
    } else if (likedQuotes.length < maxProgress) {
      setLikedQuotes((prev) => {
        if (!prev.includes(currentQuote.id)) {
          return [...prev, currentQuote.id];
        }
        return prev;
      });
      setCurrentQuoteLiked(true);

      // Save the quote to backend if it's not from the default quotes
      if (currentQuote.source !== "default") {
        try {
          await saveQuote({
            quoteId: currentQuote.id,
            text: currentQuote.text,
            author: currentQuote.author,
            source: currentQuote.source
          });
        } catch (error) {
          console.error("Error saving quote:", error);
        }
      }

      Animated.sequence([
        Animated.parallel([
          Animated.timing(heartScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(heartOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1000),
        Animated.parallel([
          Animated.timing(heartScale, {
            toValue: 1.2,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(heartOpacity, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        heartScale.setValue(0);
      });
    }
  };

  // Handle share action
  const handleShare = async () => {
    try {
      let shareMessage = currentQuote.text;
      if (currentQuote.author && currentQuote.author !== "Unknown") {
        shareMessage += `\n\n— ${currentQuote.author}`;
      }
      
      await Share.share({
        message: shareMessage,
        title: "Daily Inspiration",
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  // Toggle modals
  const togglePremiumModal = () => setPremiumModalVisible(!premiumModalVisible);
  const toggleSettingsModal = () => setSettingsModalVisible(!settingsModalVisible);
  const toggleThemesModal = () => setThemesModalVisible(!themesModalVisible);
  const handleThemeChange = (theme) => setCurrentTheme(theme);

  // Render background based on current theme
  const renderBackground = () => {
    if (currentTheme.type === "color" && !currentTheme.isGradient) {
      return <View style={[styles.backgroundContainer, { backgroundColor: currentTheme.value }]} />;
    } else if (currentTheme.type === "gradient") {
      return <LinearGradient colors={currentTheme.value} style={styles.backgroundContainer} />;
    } else if (currentTheme.type === "image") {
      return (
        <ImageBackground source={{ uri: currentTheme.value }} style={styles.backgroundContainer} resizeMode="cover">
          <View style={styles.imageOverlay} />
        </ImageBackground>
      );
    }
    return <View style={[styles.backgroundContainer, { backgroundColor: "#F5F5F0" }]} />;
  };

  // Get the current text color
  const textColor = getTextColor();
  const elementBgColor = getElementBgColor();
  const getHeartIconName = () => (currentQuoteLiked ? "heart" : "heart-outline");

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background */}
      {renderBackground()}

      {/* Content */}
      <View style={styles.safeArea}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        {/* Progress bar */}
        <View style={styles.header}>
          <View style={[styles.progressContainer, { backgroundColor: elementBgColor }]}>
            <Ionicons name="heart" size={18} color={textColor} style={{ opacity: progress > 0 ? 1 : 0.3 }} />
            <Text style={[styles.progressText, { color: textColor }]}>
              {progress}/{maxProgress}
            </Text>
            <View
              style={[
                styles.progressBar,
                { backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)" },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: progressWidth,
                    backgroundColor: isDark ? "#FFFFFF" : "#000000",
                  },
                ]}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.crownButton, { backgroundColor: elementBgColor }]}
            onPress={togglePremiumModal}
          >
            <Crown size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Quote container */}
        <View style={styles.quoteContainer}>
          <View style={styles.swipeArea} {...panResponder.panHandlers}>
            {/* Previous quote */}
            <Animated.View
              style={[styles.quoteWrapper, styles.prevQuote, { transform: [{ translateY: prevQuoteAnim }] }]}
            >
              <Text style={[styles.quoteText, { color: textColor }]}>{prevQuote.text}</Text>
              {prevQuote.author && prevQuote.author !== "Unknown" && (
                <Text style={[styles.authorText, { color: textColor }]}>— {prevQuote.author}</Text>
              )}
            </Animated.View>

            {/* Current quote */}
            <Animated.View style={[styles.quoteWrapper, { transform: [{ translateY: swipeAnim }] }]}>
              <Text style={[styles.quoteText, { color: textColor }]}>{currentQuote.text}</Text>
              {currentQuote.author && currentQuote.author !== "Unknown" && (
                <Text style={[styles.authorText, { color: textColor }]}>— {currentQuote.author}</Text>
              )}
            </Animated.View>

            {/* Next quote */}
            <Animated.View
              style={[styles.quoteWrapper, styles.nextQuote, { transform: [{ translateY: nextQuoteAnim }] }]}
            >
              <Text style={[styles.quoteText, { color: textColor }]}>{nextQuote.text}</Text>
              {nextQuote.author && nextQuote.author !== "Unknown" && (
                <Text style={[styles.authorText, { color: textColor }]}>— {nextQuote.author}</Text>
              )}
            </Animated.View>
          </View>
        </View>

        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={textColor} />
          </View>
        )}

        {/* Heart animation overlay */}
        <Animated.View
          style={[
            styles.heartOverlay,
            {
              opacity: heartOpacity,
              transform: [{ scale: heartScale }],
            },
          ]}
          pointerEvents="none"
        >
          <Ionicons name="heart" size={120} color="#fff" />
        </Animated.View>

        {/* Action buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity onPress={handleShare} style={styles.actionButton} disabled={isAnimating}>
            <Ionicons name="share-outline" size={28} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLike} style={styles.actionButton} disabled={isAnimating}>
            <Ionicons name={getHeartIconName()} size={28} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Swipe/no more quotes text */}
        {!hasMoreQuotes && quotes.length > 0 ? (
          <Text style={[styles.swipeText, { color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.5)" }]}>
            No more quotes available
          </Text>
        ) : (
          <Text style={[styles.swipeText, { color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.5)" }]}>
            Swipe up/down for more quotes
          </Text>
        )}

        {/* Bottom navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: elementBgColor }]}
            onPress={() => navigation.navigate("Topics")}
            disabled={isAnimating}
          >
            <Ionicons name="grid" size={24} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: elementBgColor }]}
            onPress={toggleThemesModal}
            disabled={isAnimating}
          >
            <Ionicons name="color-wand" size={24} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: elementBgColor }]}
            onPress={toggleSettingsModal}
            disabled={isAnimating}
          >
            <Ionicons name="person" size={24} color={textColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <PremiumModal visible={premiumModalVisible} onClose={togglePremiumModal} />
      <SettingsModal visible={settingsModalVisible} onClose={setSettingsModalVisible} />
      <ThemesModal
        visible={themesModalVisible}
        onClose={toggleThemesModal}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        isPremiumUser={isPremiumUser}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressText: {
    marginLeft: 5,
    marginRight: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    width: 120,
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  crownButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  quoteContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  swipeArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  quoteWrapper: {
    position: "absolute",
    width: width * 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  nextQuote: {
    top: 0,
    height: height,
    justifyContent: "center",
  },
  prevQuote: {
    top: 0,
    height: height,
    justifyContent: "center",
  },
  quoteText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 36,
    paddingHorizontal: 20,
  },
  authorText: {
    fontSize: 18,
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.7
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  heartOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  swipeText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 12,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});