import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Share,
  Dimensions,
  StatusBar,
  Platform,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  Image
} from "react-native";
// Removed MediaLibrary and view-shot imports that were causing errors
import * as FileSystem from 'expo-file-system';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Crown } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import PremiumModal from "./PremiumModal";
import SettingsModal from "./SettingScreen";
import { getShareImageFromTheme } from "./Themes";
import ThemesModal from "./Themes";
import Color from "color";
import { useStore } from "../../store/useStore";
import { CheckHasFreeTrial } from "../../functions/check-has-free-trial";
import { getMultipleQuotes, saveQuote } from "../../functions/quotes";
import ToastManager, { Toast } from "toastify-react-native";
import AdManager from "../../services/AdManager";

const { width, height } = Dimensions.get("window");

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
      return Color(colorValue).isDark();
    } else if (Array.isArray(colorValue)) {
      return Color(colorValue[0]).isDark();
    }
    return false;
  } catch (error) {
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
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [themesModalVisible, setThemesModalVisible] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [hasMoreQuotes, setHasMoreQuotes] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Ad tracking states
  const [scrollCount, setScrollCount] = useState(0);
  const [totalScrolls, setTotalScrolls] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);

  const scrollViewRef = useRef(null);
  const currentQuote = quotes[currentQuoteIndex] || { text: "", author: "", source: "" };
  const progress = likedQuotes.length;
  const maxProgress = 5;
  const progressWidth = (progress / maxProgress) * 120;

  // Calculate the height for each quote item
  const ITEM_HEIGHT = height;

  const fetchQuotes = useCallback(async (append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await getMultipleQuotes(10);
      if (response && Array.isArray(response)) {
        if (response.length === 0) {
          setHasMoreQuotes(false);
          if (!append) {
            Toast.show("No quotes available.", "warning");
          }
          return;
        }
        
        const mappedQuotes = response.map((quote, index) => ({
          id: `${quote.source}-${index}-${Date.now()}-${Math.random()}`,
          text: quote.text,
          author: quote.author || "Unknown",
          source: quote.source || "unknown",
          backgroundColor: getRandomBackgroundColor()
        }));

        if (append) {
          setQuotes(prev => [...prev, ...mappedQuotes]);
        } else {
          setQuotes(mappedQuotes);
          setCurrentQuoteIndex(0);
        }
      } else {
        Toast.show("Failed to load quotes.", "error");
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
      Toast.show("Error fetching quotes.", "error");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  const checkUserAndInitialize = useCallback(async () => {
    const { userId } = useStore.getState();
    if (!userId) {
      navigation.reset({ index: 0, routes: [{ name: 'PremiumOnbording' }] });
      return false;
    }
    
    const hasActiveTrial = await CheckHasFreeTrial();
    if (!hasActiveTrial) {
      navigation.reset({ index: 0, routes: [{ name: 'PremiumOnbording' }] });
      return false;
    }
    
    return true;
  }, [navigation]);

  // Handle ad display logic
  const handleAdDisplay = useCallback(async (direction) => {
    const newScrollCount = scrollCount + 1;
    const newTotalScrolls = totalScrolls + 1;
    
    // Console log for debugging
    console.log(`Ad tracking: ${direction} scroll, count: ${newScrollCount}, total: ${newTotalScrolls}`);
    
    // Update counts
    setScrollCount(newScrollCount);
    setTotalScrolls(newTotalScrolls);
    
    // Show rewarded ad every 5 scrolls (regardless of direction)
    if (newScrollCount % 5 === 0) {
      console.log('Showing rewarded ad after 5 scrolls');
      const rewardShown = await AdManager.showRewarded((reward) => {
        console.log('Reward earned:', reward);
        Toast.show("Reward earned! Keep scrolling for more quotes.", "success");
      });
      
      if (rewardShown) {
        console.log('Rewarded ad was shown successfully');
      } else {
        console.log('Rewarded ad failed to show or not loaded');
      }
    }
    
    // Show interstitial ad every 10 total scrolls
    if (newTotalScrolls % 10 === 0) {
      console.log('Showing interstitial ad after 10 total scrolls');
      const interstitialShown = await AdManager.showInterstitial();
      
      if (interstitialShown) {
        console.log('Interstitial ad was shown successfully');
      } else {
        console.log('Interstitial ad failed to show or not loaded');
      }
    }
  }, [scrollCount, totalScrolls]);

  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      const isValid = await checkUserAndInitialize();
      if (isValid && isMounted) {
        await fetchQuotes();
      }
    };
    
    initialize();
    return () => { isMounted = false; };
  }, [checkUserAndInitialize, fetchQuotes]);

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

  const getTextColor = () => (isDark ? "#FFFFFF" : "#000000");
  const getElementBgColor = () => (isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)");

const handleLike = async () => {
    if (!currentQuote.id) return;

    const isLiked = likedQuotes.includes(currentQuote.id);
    
    if (isLiked) {
      setLikedQuotes(prev => prev.filter(id => id !== currentQuote.id));
    } else if (likedQuotes.length < maxProgress) {
      setLikedQuotes(prev => [...prev, currentQuote.id]);

      try {
        const { userId } = useStore.getState();
        if (!userId) {
          Toast.error("You need to be logged in to save quotes.");
          return;
        }
        
        const res = await saveQuote({
          text: currentQuote.text,
          author: currentQuote.author,
          userId: userId,
        });

        if (res && res.success) {
          Toast.success("Quote saved!");
        } else if (res && res.message === "Quote already saved by user") {
          Toast.success("You already saved this quote.");
        } else {
          Toast.error("Could not save quote.");
        }
      } catch (error) {
        console.error("Error saving quote:", error);
        Toast.error("Error saving quote.");
      }
    }
  };
  
  const handleShare = async () => {
    try {
      // Check if already loading
      if (isLoading) return;
      
      // Set loading state
      setIsLoading(true);
      
      // Enhanced text sharing with theme information
      let shareMessage = currentQuote.text || "";
      if (currentQuote.author && currentQuote.author !== "Unknown") {
        shareMessage += `\n\n— ${currentQuote.author}`;
      }
      shareMessage += "\n\nShared from Daily Spark";
      
      // Add theme information if available
      if (currentTheme) {
        if (currentTheme.type === 'color') {
          shareMessage += `\nTheme: ${currentTheme.name}`;
        } else if (currentTheme.type === 'gradient') {
          shareMessage += `\nTheme: ${currentTheme.name} Gradient`;
        } else if (currentTheme.type === 'image') {
          shareMessage += `\nTheme: ${currentTheme.name} Background`;
        }
      }

      // First attempt to share with image if the theme has one
      if (currentTheme && currentTheme.type === 'image') {
        try {
          const imageAsset = getShareImageFromTheme(currentTheme);
          
          // If we have a valid image, attempt to share it with the text
          if (imageAsset && (imageAsset.uri || typeof imageAsset === 'number')) {
            // For iOS, we can share the URL directly
            if (Platform.OS === 'ios' && imageAsset.uri) {
              await Share.share({
                message: shareMessage,
                url: imageAsset.uri,
                title: "Daily Inspiration",
              });
              setIsLoading(false);
              return;
            }
          }
        } catch (imageError) {
          console.log('Error preparing image for sharing:', imageError);
          // Fall back to text-only sharing
        }
      }

      // If image sharing isn't possible or failed, do text-only sharing
      await Share.share({
        message: shareMessage,
        title: "Daily Inspiration",
      });
    } catch (error) {
      console.log('Error sharing:', error);
      // Simple fallback sharing if needed
      try {
        const simpleMessage = `${currentQuote.text}\n\n— ${currentQuote.author || "Unknown"}\n\nShared from Daily Spark`;
        await Share.share({
          message: simpleMessage,
          title: "Daily Inspiration",
        });
      } catch (innerError) {
        console.log('Error with fallback sharing:', innerError);
      }
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  const handleScroll = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    
    if (index !== currentQuoteIndex && index >= 0 && index < quotes.length) {
      // Determine scroll direction
      const direction = index > currentQuoteIndex ? 'down' : 'up';
      
      // Trigger ad logic for every scroll movement
      handleAdDisplay(direction);
      
      setPreviousIndex(currentQuoteIndex);
      setCurrentQuoteIndex(index);
    }

    // Load more quotes when near the end
    if (index >= quotes.length - 2 && hasMoreQuotes && !isLoadingMore) {
      fetchQuotes(true);
    }
  }, [currentQuoteIndex, quotes.length, hasMoreQuotes, isLoadingMore, fetchQuotes, handleAdDisplay]);

  const handleMomentumScrollEnd = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    
    // Ensure we're exactly on the item
    if (scrollViewRef.current && index >= 0 && index < quotes.length) {
      scrollViewRef.current.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: true,
      });
      setCurrentQuoteIndex(index);
    }
  }, [quotes.length]);

  const togglePremiumModal = () => setPremiumModalVisible(!premiumModalVisible);
  const toggleSettingsModal = () => setSettingsModalVisible(!settingsModalVisible);
  const toggleThemesModal = () => setThemesModalVisible(!themesModalVisible);
  const handleThemeChange = (theme) => setCurrentTheme(theme);

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

  const renderQuoteItem = (item, index) => {
    const isCurrentQuoteLiked = likedQuotes.includes(item.id);
    const isCurrentItem = index === currentQuoteIndex;
    
    return (
      <View key={item.id} style={styles.quoteItemContainer}>
        <View style={styles.quoteContent}>
          <Text style={[styles.quoteText, { color: getTextColor() }]}>{item.text}</Text>
          {item.author && item.author !== "Unknown" && (
            <Text style={[styles.authorText, { color: getTextColor() }]}>— {item.author}</Text>
          )}
        </View>
        
        {/* Action buttons for current quote */}
        {isCurrentItem && (
          <View style={styles.actionContainer}>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Ionicons name="share-outline" size={28} color={getTextColor()} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
              <Ionicons 
                name={isCurrentQuoteLiked ? "heart" : "heart-outline"} 
                size={28} 
                color={getTextColor()} 
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const textColor = getTextColor();
  const elementBgColor = getElementBgColor();

  if (isLoading && quotes.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderBackground()}
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={textColor} />
          <Text style={[styles.loadingText, { color: textColor }]}>Loading quotes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (quotes.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderBackground()}
        <ToastManager />
        <View style={[styles.container, styles.centerContent]}>
          <Text style={[styles.emptyText, { color: textColor }]}>No quotes available</Text>
          <TouchableOpacity
            onPress={() => fetchQuotes()}
            style={[styles.retryButton, { backgroundColor: elementBgColor }]}
          >
            <Text style={[styles.retryText, { color: textColor }]}>Try again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderBackground()}
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ToastManager />
      
      {/* Removed hidden capture view - using text-only sharing instead */}
      
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.progressContainer, { backgroundColor: elementBgColor }]}>
          <Ionicons name="heart" size={18} color={textColor} style={{ opacity: progress > 0 ? 1 : 0.3 }} />
          <Text style={[styles.progressText, { color: textColor }]}>
            {progress}/{maxProgress}
          </Text>
          <View style={[styles.progressBar, { backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)" }]}>
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

      {/* Quotes ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        overScrollMode="never"
        removeClippedSubviews={true}
      >
        {quotes.map((item, index) => renderQuoteItem(item, index))}
        
        {/* Loading indicator at the end */}
        {isLoadingMore && (
          <View style={styles.loadingFooter}>
            <ActivityIndicator size="small" color={textColor} />
            <Text style={[styles.loadingText, { color: textColor }]}>Loading more quotes...</Text>
          </View>
        )}
      </ScrollView>

      {/* Swipe instruction */}
      {/* <Text style={[styles.swipeText, { color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.5)" }]}>
        {!hasMoreQuotes ? "No more quotes available" : "Swipe up/down for more quotes"}
      </Text> */}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: elementBgColor }]}
          onPress={() => navigation.navigate("Topics")}
        >
          <Ionicons name="grid" size={24} color={textColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: elementBgColor }]}
          onPress={toggleThemesModal}
        >
          <Ionicons name="color-wand" size={24} color={textColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: elementBgColor }]}
          onPress={toggleSettingsModal}
        >
          <Ionicons name="person" size={24} color={textColor} />
        </TouchableOpacity>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
  scrollView: {
    flex: 1,
  },
  quoteItemContainer: {
    height: height,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 140 : 120,
    paddingBottom: Platform.OS === "ios" ? 160 : 140,
  },
  quoteContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
    marginTop: 20,
    textAlign: 'center',
    opacity: 0.7,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
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
    marginBottom: 10,
    fontSize: 12,
    position: 'absolute',
    bottom: Platform.OS === "ios" ? 120 : 100,
    left: 0,
    right: 0,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingFooter: {
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    padding: 12,
    borderRadius: 20,
    marginTop: 20,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "500",
  },
});