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
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { Crown } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import PremiumModal from "./PremiumModal"
import SettingsModal from "./SettingScreen"
import ThemesModal from "./Themes"
import Color from "color"

const { width, height } = Dimensions.get("window")

// Sample quotes data
const quotes = [
  { id: 1, text: "I deserve to have joy in my life.", backgroundColor: "#EAE6DF" },
  { id: 2, text: "I am worthy of love and respect.", backgroundColor: "#E5E1D8" },
  { id: 3, text: "My potential is limitless.", backgroundColor: "#D8D3C8" },
  { id: 4, text: "I embrace challenges as opportunities.", backgroundColor: "#E8E4DD" },
  { id: 5, text: "I am enough just as I am.", backgroundColor: "#F0EDE6" },
  { id: 6, text: "Today I choose happiness.", backgroundColor: "#E2DED7" },
  { id: 7, text: "I am in control of my thoughts and feelings.", backgroundColor: "#EBE7E0" },
]

// Default theme
const defaultTheme = {
  id: "color-1",
  name: "Light Cream",
  type: "color",
  value: "#F5F5F0",
  isPremium: false,
  isGradient: false,
};

const isDarkColor = (colorValue) => {
  try {
    if (typeof colorValue === "string") {
      return Color(colorValue).isDark()
    }
    // For gradients (use the first color)
    else if (Array.isArray(colorValue)) {
      return Color(colorValue[0]).isDark()
    }
    return false;
  } catch (error) {
    console.log("Error determining color brightness:", error);
    return false;
  }
};

const getRandomBackgroundColor = () => {
  const colors = [
    "#EAE6DF", "#E5E1D8", "#D8D3C8",
    "#E8E4DD", "#F0EDE6", "#E2DED7", "#EBE7E0"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function QuotesScreen({ navigation, isPremiumUser = false }) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [likedQuotes, setLikedQuotes] = useState([])
  const [currentQuoteLiked, setCurrentQuoteLiked] = useState(false)
  const [premiumModalVisible, setPremiumModalVisible] = useState(false)
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const [themesModalVisible, setThemesModalVisible] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(defaultTheme)
  const [isDark, setIsDark] = useState(false)

  // Animation values
  const swipeAnim = useRef(new Animated.Value(0)).current
  const nextQuoteAnim = useRef(new Animated.Value(height)).current
  const prevQuoteAnim = useRef(new Animated.Value(-height)).current
  const heartScale = useRef(new Animated.Value(0)).current
  const heartOpacity = useRef(new Animated.Value(0)).current

  // Get current quote
  const currentQuote = quotes[currentQuoteIndex]
  const nextQuote = quotes[(currentQuoteIndex + 1) % quotes.length]
  const prevQuote = quotes[currentQuoteIndex === 0 ? quotes.length - 1 : currentQuoteIndex - 1]

  // Calculate progress
  const progress = likedQuotes.length
  const maxProgress = 5
  const progressWidth = (progress / maxProgress) * 120

  // Determine text and icon colors based on background
  useEffect(() => {
    if (currentTheme.type === "color" && !currentTheme.isGradient) {
      setIsDark(isDarkColor(currentTheme.value));
    } else if (currentTheme.type === "gradient") {
      // For gradients, check the average darkness of the colors
      const isDarkGradient = currentTheme.value.some((color) => isDarkColor(color))
      setIsDark(isDarkGradient)
    } else if (currentTheme.type === "image") {
      // For images, assume darker backgrounds for better visibility
      setIsDark(true)
    }
  }, [currentTheme]);

  // Get text color based on background darkness
  const getTextColor = () => (isDark ? "#FFFFFF" : "#000000");
  const getElementBgColor = () => (isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)");
  const getHeartIconName = () => (currentQuoteLiked ? "heart" : "heart-outline");

  // Get platform-specific app store link
  const getAppStoreLink = () => {
    return Platform.OS === "ios" ? APP_STORE_LINKS.ios : APP_STORE_LINKS.android
  }

  // Create and share image
  const handleShare = async () => {
    if (isAnimating || isSharing) return

    try {
      setIsSharing(true)

      // First try to capture the image
      if (viewShotRef.current && viewShotRef.current.capture) {
        try {
          const uri = await viewShotRef.current.capture()
          console.log("Image captured:", uri)

          // Get the appropriate app store link
          const appStoreLink = getAppStoreLink()

          // Try to share with image
          const shareOptions = {
            title: "Daily Inspiration",
            message: `${currentQuote.text}\n\nDownload the app: ${appStoreLink}`,
          }

          // Add URL for iOS, different approach for Android
          if (Platform.OS === 'ios') {
            shareOptions.url = uri
          } else {
            // For Android, we'll share the message and handle image separately
            shareOptions.message = `${currentQuote.text}\n\nDownload the app: ${appStoreLink}`
          }

          const result = await Share.share(shareOptions)
          console.log('Share result:', result)

        } catch (captureError) {
          console.log("Image capture failed, sharing text only:", captureError)
          // Fallback to text-only sharing
          await shareTextOnly()
        }
      } else {
        console.log("ViewShot ref not available, sharing text only")
        await shareTextOnly()
      }

    } catch (error) {
      console.log("Share error:", error)
      Alert.alert("Share Failed", "Unable to share the quote. Please try again.")
    } finally {
      setIsSharing(false)
    }
  }

  // Fallback text-only sharing
  const shareTextOnly = async () => {
    const appStoreLink = getAppStoreLink()
    await Share.share({
      message: `${currentQuote.text}\n\nDownload the app: ${appStoreLink}`,
      title: "Daily Inspiration",
    })
  }

  // Pan responder implementation (keeping existing)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 20
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          // Swiping up - show next quote
          swipeAnim.setValue(gestureState.dy)
          nextQuoteAnim.setValue(height + gestureState.dy)
        } else if (gestureState.dy > 0) {
          // Swiping down - show previous quote
          swipeAnim.setValue(gestureState.dy)
          prevQuoteAnim.setValue(-height + gestureState.dy)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -100) {
          // Swipe up to next quote
          Animated.parallel([
            Animated.timing(swipeAnim, {
              toValue: -height,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(nextQuoteAnim, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
          ]).start(() => {
            swipeAnim.setValue(0)
            nextQuoteAnim.setValue(height)
            prevQuoteAnim.setValue(-height)
            setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length)
            setCurrentQuoteLiked(false) // Always reset like status for new quote
          })
        } else if (gestureState.dy > 100) {
          // Swipe down to previous quote
          Animated.parallel([
            Animated.timing(swipeAnim, {
              toValue: height,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(prevQuoteAnim, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
          ]).start(() => {
            swipeAnim.setValue(0)
            nextQuoteAnim.setValue(height)
            prevQuoteAnim.setValue(-height)
            setCurrentQuoteIndex((prevIndex) => (prevIndex === 0 ? quotes.length - 1 : prevIndex - 1))
            setCurrentQuoteLiked(false) // Always reset like status for new quote
          })
        } else {
          Animated.parallel([
            Animated.spring(swipeAnim, {
              toValue: 0,
              friction: 5,
              useNativeDriver: true,
            }),
            Animated.spring(nextQuoteAnim, {
              toValue: height,
              friction: 5,
              useNativeDriver: true,
            }),
            Animated.spring(prevQuoteAnim, {
              toValue: -height,
              friction: 5,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setIsAnimating(false);
          });
        }
      },
    }),
  ).current;

  // Handle like action
  const handleLike = () => {
    if (currentQuoteLiked) {
      // Unlike the quote
      setLikedQuotes((prev) => {
        // Find the index of this quote in the liked array
        const index = prev.indexOf(currentQuote.id)
        // If found, remove it
        if (index !== -1) {
          const newLiked = [...prev]
          newLiked.splice(index, 1)
          return newLiked
        }
        return prev
      })
      setCurrentQuoteLiked(false)
    } else if (likedQuotes.length < maxProgress) {
      // Like the quote
      setLikedQuotes((prev) => {
        // Only add if not already in the array
        if (!prev.includes(currentQuote.id)) {
          return [...prev, currentQuote.id]
        }
        return prev
      })
      setCurrentQuoteLiked(true)

      // Animate heart
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
        heartScale.setValue(0)
      })
    }
  };

  // Handle share action
  const handleShare = async () => {
    try {
      await Share.share({
        message: currentQuote.text,
        title: "Daily Inspiration",
      })
    } catch (error) {
      console.log("Error sharing:", error)
    }
  }

  // Toggle premium modal
  const togglePremiumModal = () => {
    setPremiumModalVisible(!premiumModalVisible)
  }

  // Toggle Settings modal
  const toggleSettingsModal = () => {
    setSettingsModalVisible(!settingsModalVisible)
  }

  // Toggle Themes modal
  const toggleThemesModal = () => {
    setThemesModalVisible(!themesModalVisible)
  }

  // Handle theme change
  const handleThemeChange = (theme) => {
    setCurrentTheme(theme)
  }

  const handleNavigation = (screenName) => {
    if (isAnimating || isSharing) return
    if (navigation && navigation.navigate) {
      navigation.navigate(screenName)
    }
  }

  // Render background for share image
  const renderShareBackground = () => {
    if (currentTheme.type === "color" && !currentTheme.isGradient) {
      return { backgroundColor: currentTheme.value }
    } else if (currentTheme.type === "gradient") {
      return (
        <LinearGradient
          colors={currentTheme.value}
          style={StyleSheet.absoluteFillObject}
        />
      )
    } else if (currentTheme.type === "image") {
      return (
        <ImageBackground
          source={{ uri: currentTheme.value }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        >
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0, 0, 0, 0.3)" }]} />
        </ImageBackground>
      )
    }
    return { backgroundColor: "#F5F5F0" }
  }

  // Render background for main view
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

    // Default fallback
    return <View style={[styles.backgroundContainer, { backgroundColor: "#F5F5F0" }]} />
  }

  // Get the current text color
  const textColor = getTextColor()
  const elementBgColor = getElementBgColor()

  // Get heart icon name based on liked status
  const getHeartIconName = () => (currentQuoteLiked ? "heart" : "heart-outline")

  return (
    <View style={styles.container}>
      {/* Background that covers the entire screen */}
      {renderBackground()}

      {/* Content within SafeAreaView */}
      <SafeAreaView style={styles.safeArea}>
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
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Crown size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Quote container */}
        <View style={styles.quoteContainer} {...panResponder.panHandlers}>
          {/* Previous quote (for swipe down) */}
          <Animated.View
            style={[styles.quoteWrapper, styles.prevQuote, { transform: [{ translateY: prevQuoteAnim }] }]}
          >
            <Text style={[styles.quoteText, { color: textColor }]}>{prevQuote.text}</Text>
          </Animated.View>

          {/* Current quote */}
          <Animated.View style={[styles.quoteWrapper, { transform: [{ translateY: swipeAnim }] }]}>
            <Text style={[styles.quoteText, { color: textColor }]}>{currentQuote.text}</Text>
          </Animated.View>

          {/* Next quote (for swipe up) */}
          <Animated.View
            style={[styles.quoteWrapper, styles.nextQuote, { transform: [{ translateY: nextQuoteAnim }] }]}
          >
            <Text style={[styles.quoteText, { color: textColor }]}>{nextQuote.text}</Text>
          </Animated.View>
        </View>

        {/* Loading indicator */}
        {/* {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={textColor} />
          </View>
        )} */}


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
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Ionicons name="share-outline" size={28} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
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
          >
            <Ionicons name="grid" size={24} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.navButton, { backgroundColor: elementBgColor }]} onPress={toggleThemesModal}>
            <Ionicons name="color-wand" size={24} color={textColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: elementBgColor }]}
            onPress={toggleSettingsModal}
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
    zIndex: 10,
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
    zIndex: 20,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    zIndex: 10,
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
    zIndex: 10,
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
})