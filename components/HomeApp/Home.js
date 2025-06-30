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
  Alert,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { Crown } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import ViewShot from "react-native-view-shot"
import PremiumModal from "./PremiumModal"
import SettingsModal from "./SettingScreen"
import ThemesModal from "./Themes"
import Color from "color"

const { width, height } = Dimensions.get("window")

// App Store Links - UPDATE THESE WITH YOUR ACTUAL LINKS
const APP_STORE_LINKS = {
  ios: "https://apps.apple.com/app/your-app-id",
  android: "https://play.google.com/store/apps/details?id=your.package.name",
}

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
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // Animation values
  const swipeAnim = useRef(new Animated.Value(0)).current
  const nextQuoteAnim = useRef(new Animated.Value(height)).current
  const prevQuoteAnim = useRef(new Animated.Value(-height)).current
  const heartScale = useRef(new Animated.Value(0)).current
  const heartOpacity = useRef(new Animated.Value(0)).current

  // Ref for capturing the share image
  const viewShotRef = useRef()

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
      onStartShouldSetPanResponder: () => !isAnimating && !isSharing,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return !isAnimating && !isSharing && Math.abs(gestureState.dy) > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
      },
      onPanResponderGrant: () => {
        swipeAnim.setValue(0)
        nextQuoteAnim.setValue(height)
        prevQuoteAnim.setValue(-height)
      },
      onPanResponderMove: (_, gestureState) => {
        if (isAnimating || isSharing) return

        if (gestureState.dy < 0) {
          const progress = Math.max(gestureState.dy, -height)
          swipeAnim.setValue(progress)
          nextQuoteAnim.setValue(height + progress)
        } else if (gestureState.dy > 0) {
          const progress = Math.min(gestureState.dy, height)
          swipeAnim.setValue(progress)
          prevQuoteAnim.setValue(-height + progress)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isAnimating || isSharing) return

        const threshold = height * 0.2

        if (gestureState.dy < -threshold && gestureState.vy < -0.5) {
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
            swipeAnim.setValue(0)
            nextQuoteAnim.setValue(height)
            prevQuoteAnim.setValue(-height)
            setIsAnimating(false)
          })
        } else if (gestureState.dy > threshold && gestureState.vy > 0.5) {
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
            swipeAnim.setValue(0)
            nextQuoteAnim.setValue(height)
            prevQuoteAnim.setValue(-height)
            setIsAnimating(false)
          })
        } else {
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

  // Handle like action (keeping existing)
  const handleLike = () => {
    if (isAnimating || isSharing) return

    if (currentQuoteLiked) {
      setLikedQuotes((prev) => prev.filter(id => id !== currentQuote.id))
      setCurrentQuoteLiked(false)
    } else if (likedQuotes.length < maxProgress) {
      if (!likedQuotes.includes(currentQuote.id)) {
        setLikedQuotes((prev) => [...prev, currentQuote.id])
        setCurrentQuoteLiked(true)

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

  // Modal handlers (keeping existing)
  const togglePremiumModal = () => {
    if (isAnimating || isSharing) return
    setPremiumModalVisible(!premiumModalVisible)
  }

  const toggleSettingsModal = () => {
    if (isAnimating || isSharing) return
    setSettingsModalVisible(!settingsModalVisible)
  }

  const toggleThemesModal = () => {
    if (isAnimating || isSharing) return
    setThemesModalVisible(!themesModalVisible)
  }

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

  const textColor = getTextColor()
  const elementBgColor = getElementBgColor()
  const getHeartIconName = () => (currentQuoteLiked ? "heart" : "heart-outline")

  return (
    <View style={styles.container}>
      {renderBackground()}

      {/* Hidden ViewShot for creating share images */}
      <ViewShot
        ref={viewShotRef}
        options={{
          fileName: "quote-share",
          format: "png",
          quality: 0.9,
          width: 400,
          height: 600,
        }}
        style={styles.shareImageContainer}
      >
        <View style={[styles.shareBackground, renderShareBackground()]}>
          {currentTheme.type === "gradient" && renderShareBackground()}
          {currentTheme.type === "image" && renderShareBackground()}
          <View style={styles.shareContent}>
            <Text style={[styles.shareQuoteText, { color: textColor }]}>
              {currentQuote.text}
            </Text>
            <View style={styles.shareAppLink}>
              <Text style={[styles.shareAppText, { color: textColor }]}>
                » motivation.app
              </Text>
            </View>
          </View>
        </View>
      </ViewShot>

      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        {/* Header */}
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
        <View style={styles.quoteContainer}>
          <View style={styles.gestureArea} {...panResponder.panHandlers}>
            <Animated.View
              style={[styles.quoteWrapper, styles.prevQuote, { transform: [{ translateY: prevQuoteAnim }] }]}
              pointerEvents="none"
            >
              <Text style={[styles.quoteText, { color: textColor }]}>{prevQuote.text}</Text>
            </Animated.View>

            <Animated.View
              style={[styles.quoteWrapper, { transform: [{ translateY: swipeAnim }] }]}
              pointerEvents="none"
            >
              <Text style={[styles.quoteText, { color: textColor }]}>{currentQuote.text}</Text>
            </Animated.View>

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

        {/* Action buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            onPress={handleShare}
            style={styles.actionButton}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            disabled={isSharing}
          >
            <Ionicons
              name={isSharing ? "hourglass-outline" : "share-outline"}
              size={28}
              color={textColor}
            />
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

        {/* Bottom navigation */}
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
  // Share image styles
  shareImageContainer: {
    position: "absolute",
    top: -10000, // Hide off-screen
    left: 0,
    width: 400,
    height: 600,
  },
  shareBackground: {
    width: 400,
    height: 600,
    justifyContent: "center",
    alignItems: "center",
  },
  shareContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    position: "relative",
  },
  shareQuoteText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 42,
    marginBottom: 60,
  },
  shareAppLink: {
    position: "absolute",
    bottom: 80,
    alignItems: "center",
  },
  shareAppText: {
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
})