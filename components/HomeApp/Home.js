"use client"

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
    if (typeof colorValue === "string") {
      return Color(colorValue).isDark()
    } else if (Array.isArray(colorValue)) {
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
      const isDarkGradient = currentTheme.value.some((color) => isDarkColor(color))
      setIsDark(isDarkGradient)
    } else if (currentTheme.type === "image") {
      setIsDark(true)
    }
  }, [currentTheme])

  // Get text color based on background darkness
  const getTextColor = () => (isDark ? "#FFFFFF" : "#000000")

  // Get background color for UI elements
  const getElementBgColor = () => (isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)")

  // FIXED: Improved Pan responder with better gesture handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isAnimating, // Prevent gestures during animation
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return !isAnimating && Math.abs(gestureState.dy) > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
      },
      onPanResponderGrant: () => {
        // Reset animation values when gesture starts
        swipeAnim.setValue(0)
        nextQuoteAnim.setValue(height)
        prevQuoteAnim.setValue(-height)
      },
      onPanResponderMove: (_, gestureState) => {
        if (isAnimating) return // Prevent movement during animation

        if (gestureState.dy < 0) {
          // Swiping up - show next quote
          const progress = Math.max(gestureState.dy, -height)
          swipeAnim.setValue(progress)
          nextQuoteAnim.setValue(height + progress)
        } else if (gestureState.dy > 0) {
          // Swiping down - show previous quote
          const progress = Math.min(gestureState.dy, height)
          swipeAnim.setValue(progress)
          prevQuoteAnim.setValue(-height + progress)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isAnimating) return

        const threshold = height * 0.2 // 20% of screen height

        if (gestureState.dy < -threshold && gestureState.vy < -0.5) {
          // Swipe up to next quote
          setIsAnimating(true)
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
            setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length)
            setCurrentQuoteLiked(false)
            // Reset animations
            swipeAnim.setValue(0)
            nextQuoteAnim.setValue(height)
            prevQuoteAnim.setValue(-height)
            setIsAnimating(false)
          })
        } else if (gestureState.dy > threshold && gestureState.vy > 0.5) {
          // Swipe down to previous quote
          setIsAnimating(true)
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
            setCurrentQuoteIndex((prevIndex) => (prevIndex === 0 ? quotes.length - 1 : prevIndex - 1))
            setCurrentQuoteLiked(false)
            // Reset animations
            swipeAnim.setValue(0)
            nextQuoteAnim.setValue(height)
            prevQuoteAnim.setValue(-height)
            setIsAnimating(false)
          })
        } else {
          // Return to original position
          Animated.parallel([
            Animated.spring(swipeAnim, {
              toValue: 0,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.spring(nextQuoteAnim, {
              toValue: height,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.spring(prevQuoteAnim, {
              toValue: -height,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start()
        }
      },
      onPanResponderTerminate: () => {
        // Handle gesture termination
        Animated.parallel([
          Animated.spring(swipeAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(nextQuoteAnim, {
            toValue: height,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(prevQuoteAnim, {
            toValue: -height,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start()
      },
    }),
  ).current

  // FIXED: Handle like action with proper state management
  const handleLike = () => {
    if (isAnimating) return // Prevent action during animation

    if (currentQuoteLiked) {
      // Unlike the quote
      setLikedQuotes((prev) => prev.filter(id => id !== currentQuote.id))
      setCurrentQuoteLiked(false)
    } else if (likedQuotes.length < maxProgress) {
      // Like the quote
      if (!likedQuotes.includes(currentQuote.id)) {
        setLikedQuotes((prev) => [...prev, currentQuote.id])
        setCurrentQuoteLiked(true)

        // Animate heart
        heartScale.setValue(0)
        heartOpacity.setValue(0)

        Animated.sequence([
          Animated.parallel([
            Animated.spring(heartScale, {
              toValue: 1,
              tension: 100,
              friction: 5,
              useNativeDriver: true,
            }),
            Animated.timing(heartOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(800),
          Animated.parallel([
            Animated.timing(heartScale, {
              toValue: 1.2,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(heartOpacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]).start()
      }
    }
  }

  // FIXED: Handle share action with error handling
  const handleShare = async () => {
    if (isAnimating) return

    try {
      const result = await Share.share({
        message: currentQuote.text,
        title: "Daily Inspiration",
      })
      console.log('Share result:', result)
    } catch (error) {
      console.log("Error sharing:", error)
    }
  }

  // FIXED: Modal handlers with proper state management
  const togglePremiumModal = () => {
    if (isAnimating) return
    setPremiumModalVisible(!premiumModalVisible)
  }

  const toggleSettingsModal = () => {
    if (isAnimating) return
    setSettingsModalVisible(!settingsModalVisible)
  }

  const toggleThemesModal = () => {
    if (isAnimating) return
    setThemesModalVisible(!themesModalVisible)
  }

  // Handle theme change
  const handleThemeChange = (theme) => {
    setCurrentTheme(theme)
  }

  // FIXED: Navigation handler
  const handleNavigation = (screenName) => {
    if (isAnimating) return
    if (navigation && navigation.navigate) {
      navigation.navigate(screenName)
    }
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
    return <View style={[styles.backgroundContainer, { backgroundColor: "#F5F5F0" }]} />
  }

  // Get the current text color
  const textColor = getTextColor()
  const elementBgColor = getElementBgColor()

  // Get heart icon name based on liked status
  const getHeartIconName = () => (currentQuoteLiked ? "heart" : "heart-outline")

  return (
    <View style={styles.container}>
      {renderBackground()}

      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        {/* FIXED: Header with proper touch targets */}
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

        {/* FIXED: Quote container with proper gesture handling */}
        <View style={styles.quoteContainer}>
          <View style={styles.gestureArea} {...panResponder.panHandlers}>
            {/* Previous quote */}
            <Animated.View
              style={[styles.quoteWrapper, styles.prevQuote, { transform: [{ translateY: prevQuoteAnim }] }]}
              pointerEvents="none"
            >
              <Text style={[styles.quoteText, { color: textColor }]}>{prevQuote.text}</Text>
            </Animated.View>

            {/* Current quote */}
            <Animated.View
              style={[styles.quoteWrapper, { transform: [{ translateY: swipeAnim }] }]}
              pointerEvents="none"
            >
              <Text style={[styles.quoteText, { color: textColor }]}>{currentQuote.text}</Text>
            </Animated.View>

            {/* Next quote */}
            <Animated.View
              style={[styles.quoteWrapper, styles.nextQuote, { transform: [{ translateY: nextQuoteAnim }] }]}
              pointerEvents="none"
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

        {/* FIXED: Action buttons with proper touch handling */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            onPress={handleShare}
            style={styles.actionButton}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="share-outline" size={28} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLike}
            style={styles.actionButton}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name={getHeartIconName()} size={28} color={textColor} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.swipeText, { color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.5)" }]}>
          Swipe up/down
        </Text>

        {/* FIXED: Bottom navigation with proper touch targets */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: elementBgColor }]}
            onPress={() => handleNavigation("Topics")}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="grid" size={24} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: elementBgColor }]}
            onPress={toggleThemesModal}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="color-wand" size={24} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: elementBgColor }]}
            onPress={toggleSettingsModal}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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

// FIXED: Updated styles with better touch targets
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
    zIndex: 10, // Ensure header is above gesture area
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
  gestureArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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