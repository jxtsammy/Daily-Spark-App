import { useState, useRef, useEffect } from "react"
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
}

// Helper function to determine if a color is dark
const isDarkColor = (colorValue) => {
  try {
    // For solid colors
    if (typeof colorValue === "string") {
      return Color(colorValue).isDark()
    }
    // For gradients (use the first color)
    else if (Array.isArray(colorValue)) {
      return Color(colorValue[0]).isDark()
    }
    return false
  } catch (error) {
    console.log("Error determining color brightness:", error)
    return false
  }
}

export default function QuotesScreen({ navigation, isPremiumUser = false }) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [likedQuotes, setLikedQuotes] = useState([])
  const [currentQuoteLiked, setCurrentQuoteLiked] = useState(false)
  const [premiumModalVisible, setPremiumModalVisible] = useState(false)
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const [themesModalVisible, setThemesModalVisible] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(defaultTheme)
  const [isDark, setIsDark] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false) // Add animation state

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
      setIsDark(isDarkColor(currentTheme.value))
    } else if (currentTheme.type === "gradient") {
      // For gradients, check the average darkness of the colors
      const isDarkGradient = currentTheme.value.some((color) => isDarkColor(color))
      setIsDark(isDarkGradient)
    } else if (currentTheme.type === "image") {
      // For images, assume darker backgrounds for better visibility
      setIsDark(true)
    }
  }, [currentTheme])

  // Get text color based on background darkness
  const getTextColor = () => (isDark ? "#FFFFFF" : "#000000")

  // Get background color for UI elements
  const getElementBgColor = () => (isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)")

  // Improved Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to vertical swipes with significant movement
        // And only if we're not already animating
        const { dx, dy } = gestureState
        return !isAnimating && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30
      },
      onPanResponderGrant: () => {
        // Prevent other touch interactions during pan
        setIsAnimating(true)
      },
      onPanResponderMove: (evt, gestureState) => {
        // Add resistance to make swiping feel more natural
        const resistance = 0.7
        const dampedDy = gestureState.dy * resistance
        
        if (dampedDy < 0) {
          // Swiping up - show next quote
          swipeAnim.setValue(dampedDy)
          nextQuoteAnim.setValue(height + dampedDy)
        } else if (dampedDy > 0) {
          // Swiping down - show previous quote
          swipeAnim.setValue(dampedDy)
          prevQuoteAnim.setValue(-height + dampedDy)
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dy, vy } = gestureState
        const threshold = 80 // Reduced threshold for easier swiping
        const velocityThreshold = 0.5
        
        if (dy < -threshold || vy < -velocityThreshold) {
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
            setCurrentQuoteLiked(false)
            setIsAnimating(false)
          })
        } else if (dy > threshold || vy > velocityThreshold) {
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
            setCurrentQuoteLiked(false)
            setIsAnimating(false)
          })
        } else {
          // Return to original position with spring animation
          Animated.parallel([
            Animated.spring(swipeAnim, {
              toValue: 0,
              tension: 200,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.spring(nextQuoteAnim, {
              toValue: height,
              tension: 200,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.spring(prevQuoteAnim, {
              toValue: -height,
              tension: 200,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setIsAnimating(false)
          })
        }
      },
      onPanResponderTerminate: () => {
        // Reset animation state if gesture is terminated
        setIsAnimating(false)
      },
    }),
  ).current

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
  }

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

  // Render background based on current theme
  const renderBackground = () => {
    if (currentTheme.type === "color" && !currentTheme.isGradient) {
      return <View style={[styles.backgroundContainer, { backgroundColor: currentTheme.value }]} />
    } else if (currentTheme.type === "gradient") {
      return <LinearGradient colors={currentTheme.value} style={styles.backgroundContainer} />
    } else if (currentTheme.type === "image") {
      return (
        <ImageBackground source={{ uri: currentTheme.value }} style={styles.backgroundContainer} resizeMode="cover">
          <View style={styles.imageOverlay} />
        </ImageBackground>
      )
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
          >
            <Crown size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Quote container - Only apply panHandlers to this specific area */}
        <View style={styles.quoteContainer}>
          <View style={styles.swipeArea} {...panResponder.panHandlers}>
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
        </View>

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

        <Text style={[styles.swipeText, { color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.5)" }]}>
          Swipe up/down for more quotes
        </Text>

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
      </SafeAreaView>

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
    </View>
  )
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
})