import { useState, useEffect, use } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getTodaysQuote } from "../../../functions/quotes";

export default function TodaysQuoteScreen({ navigation }) {
  // Today's quote data
  const [todaysQuote, setTodaysQuote] = useState({
  });
  useEffect(() => {
    // Fetch today's quote from the server
    const fetchTodaysQuote = async () => {
      const quote = await getTodaysQuote();
      if (quote) {
        setTodaysQuote({
          text: quote.text,
          author: quote.author || "",
          date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
        })
      }
    }
    fetchTodaysQuote();
  }, []);

  // Share today's quote
  const shareQuote = async () => {
    try {
      const shareMessage = todaysQuote.author
        ? `"${todaysQuote.text}" - ${todaysQuote.author}`
        : `"${todaysQuote.text}"`;

      await Share.share({
        message: shareMessage,
        title: "Today's Quote",
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  // Toggle like status
  const toggleLike = () => {
    setTodaysQuote(prev => ({
      ...prev,
      isLiked: !prev.isLiked
    }));
  };

  return (
    <ImageBackground
      source={require("../../../assets/3.jpg")}
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.7)", "rgba(0, 0, 0, 0.3)"]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" translucent />

        {/* Simple header with back button */}
        <SafeAreaView style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Today's quote display */}
        <View style={styles.quoteContainer}>
          <Text style={styles.dateText}>
            {todaysQuote.date}
          </Text>

          <Text style={styles.quoteText}>
            "{todaysQuote.text}"
          </Text>

          {todaysQuote.author && (
            <Text style={styles.authorText}>
              — {todaysQuote.author}
            </Text>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
            <Ionicons
              name={todaysQuote.isLiked ? "heart" : "heart-outline"}
              size={28}
              color={todaysQuote.isLiked ? "#FF5A5F" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={shareQuote} style={styles.actionButton}>
            <Ionicons name="share-outline" size={28} color="white" />
          </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  quoteContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 30,
    textAlign: "center",
  },
  quoteText: {
    fontSize: 28,
    fontWeight: "600",
    color: "white",
    lineHeight: 38,
    textAlign: "center",
    marginBottom: 20,
  },
  authorText: {
    fontSize: 20,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 40,
    gap: 40,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});