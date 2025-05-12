"use client"

// QuoteDisplayScreen.js
import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
  TextInput,
  Modal,
  ImageBackground,
  Alert,
  Share,
  Animated,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get("window")

export default function QuoteDisplayScreen({ navigation }) {
  // State for quotes
  const [quotes, setQuotes] = useState([
    {
      id: "1",
      text: "Grind now. Shine later.",
      author: "",
      date: "Fri, May 09, 2025",
      isLiked: false,
      isSaved: false,
    },
    {
      id: "2",
      text: "Don't cry over the past, it's gone. Don't stress about the future, it hasn't arrived. Live in the present and make it beautiful.",
      author: "",
      date: "Fri, May 09, 2025",
      isLiked: false,
      isSaved: true,
    },
    {
      id: "3",
      text: "Not all success comes from hard work; it also requires a vision of the end goal.",
      author: "",
      date: "Sat, May 10, 2025",
      isLiked: false,
      isSaved: false,
    },
    {
      id: "4",
      text: "Put down your phone and let yourself be bored. You'll be surprised at the turns your brain might take.",
      author: "",
      date: "Sat, May 10, 2025",
      isLiked: false,
      isSaved: false,
    },
    {
      id: "5",
      text: "Stop hating yourself for everything you aren't. Start loving yourself for everything you are.",
      author: "",
      date: "Sat, May 10, 2025",
      isLiked: false,
      isSaved: false,
    },
    {
      id: "6",
      text: "Believe that you can do it because you can do it.",
      author: "Bob Ross",
      date: "Sat, May 10, 2025",
      isLiked: false,
      isSaved: false,
    },
  ])

  const [filteredQuotes, setFilteredQuotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  // State for add quote modal
  const [modalVisible, setModalVisible] = useState(false)
  const [newQuote, setNewQuote] = useState("")
  const [newAuthor, setNewAuthor] = useState("")

  // State for quote detail modal
  const [quoteDetailVisible, setQuoteDetailVisible] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState(null)

  // State for follow button
  const [isFollowing, setIsFollowing] = useState(true)

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  })

  // Filter quotes based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredQuotes(quotes)
    } else {
      const filtered = quotes.filter(
        (quote) =>
          quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (quote.author && quote.author.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredQuotes(filtered)
    }
  }, [searchQuery, quotes])

  // Add a new quote
  const handleAddQuote = () => {
    if (newQuote.trim() === "") return

    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    const newQuoteObj = {
      id: Date.now().toString(),
      text: newQuote,
      author: newAuthor.trim() === "" ? "" : newAuthor,
      date: formattedDate,
      isLiked: false,
      isSaved: false,
    }

    setQuotes((prevQuotes) => [newQuoteObj, ...prevQuotes])
    setNewQuote("")
    setNewAuthor("")
    setModalVisible(false)
  }

  // Delete a quote
  const handleDeleteQuote = (quoteId) => {
    Alert.alert("Delete Quote", "Are you sure you want to delete this quote?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          setQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== quoteId))
        },
        style: "destructive",
      },
    ])
  }

  // Toggle like status for a quote
  const toggleLike = (quoteId) => {
    setQuotes((prevQuotes) =>
      prevQuotes.map((quote) => (quote.id === quoteId ? { ...quote, isLiked: !quote.isLiked } : quote)),
    )
  }

  // Toggle save status for a quote
  const toggleSave = (quoteId) => {
    setQuotes((prevQuotes) =>
      prevQuotes.map((quote) => (quote.id === quoteId ? { ...quote, isSaved: !quote.isSaved } : quote)),
    )
  }

  // Toggle follow status
  const toggleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  // Share a quote
  const shareQuote = async (quote) => {
    try {
      const shareMessage = quote.author ? `"${quote.text}" - ${quote.author}` : `"${quote.text}"`

      await Share.share({
        message: shareMessage,
        title: "Share Quote",
      })
    } catch (error) {
      Alert.alert("Error", "Could not share the quote")
    }
  }

  // Open quote detail modal
  const openQuoteDetail = (quote) => {
    setSelectedQuote(quote)
    setQuoteDetailVisible(true)
  }

  // Render a quote item
  const renderQuoteItem = ({ item, index }) => {
    // Add animation for staggered appearance
    const translateY = scrollY.interpolate({
      inputRange: [(index - 1) * 100, index * 100],
      outputRange: [50, 0],
      extrapolate: "clamp",
    })

    const opacity = scrollY.interpolate({
      inputRange: [(index - 1) * 100, index * 100],
      outputRange: [0.3, 1],
      extrapolate: "clamp",
    })

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => openQuoteDetail(item)}>
        <Animated.View style={[styles.quoteCard, { transform: [{ translateY }], opacity }]}>
          <View style={styles.quoteHeader}>
            <Text style={styles.quoteText}>{item.text}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteQuote(item.id)}>
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {item.author ? <Text style={styles.quoteAuthor}>- {item.author}</Text> : null}

          <View style={styles.quoteFooter}>
            <Text style={styles.quoteDate}>{item.date}</Text>
            <View style={styles.quoteActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => toggleSave(item.id)}>
                <Ionicons
                  name={item.isSaved ? "bookmark" : "bookmark-outline"}
                  size={22}
                  color={item.isSaved ? "#A78BFA" : "#fff"}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => shareQuote(item)}>
                <Ionicons name="share-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color="rgba(255,255,255,0.3)" />
      <Text style={styles.emptyStateTitle}>No quotes yet</Text>
      <Text style={styles.emptyStateText}>
        Add your favorite quotes to see them here. Tap the "Add quote" button below to get started.
      </Text>
    </View>
  )

  return (
    <ImageBackground
      // Replace with your actual background image
      source={require("../../../assets/2.jpg")}
      style={styles.backgroundImage}
    >
      <LinearGradient colors={["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0.3)"]} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Header */}
        <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Favorites </Text>
              </View>

              <View style={styles.headerRight}>
                <TouchableOpacity
                  style={[styles.followButton, isFollowing && styles.followingButton]}
                  onPress={toggleFollow}
                >
                  <Text style={styles.followButtonText}>{isFollowing ? "Following" : "Follow"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#8D9CB0" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#8D9CB0"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#8D9CB0" />
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </Animated.View>

        {/* Quotes List */}
        {quotes.length > 0 ? (
          <Animated.FlatList
            data={filteredQuotes}
            renderItem={renderQuoteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.quotesList}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
            scrollEventThrottle={16}
            ListEmptyComponent={
              searchQuery.length > 0 ? (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>No quotes found for "{searchQuery}"</Text>
                </View>
              ) : null
            }
          />
        ) : (
          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            <EmptyState />
          </ScrollView>
        )}

        {/* Quote Detail Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={quoteDetailVisible}
          onRequestClose={() => setQuoteDetailVisible(false)}
        >
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <ImageBackground
            // Replace this with your imported image
            source={require("../../../assets/7.jpg")}
            style={styles.modalBackground}
            resizeMode="cover"
          >
            <LinearGradient colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.3)"]} style={styles.modalOverlay}>
              <SafeAreaView style={styles.modalContainer}>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setQuoteDetailVisible(false)} style={styles.modalBackButton}>
                    <Ionicons name="chevron-back" size={28} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.modalHeaderTitle}>My favorites</Text>
                  <TouchableOpacity
                    style={[styles.modalFollowButton, isFollowing && styles.followingButton]}
                    onPress={toggleFollow}
                  >
                    <Text style={styles.modalFollowButtonText}>{isFollowing ? "Following" : "Follow"}</Text>
                  </TouchableOpacity>
                </View>

                {/* Quote Content */}
                {selectedQuote && (
                  <View style={styles.modalQuoteContainer}>
                    <Text style={styles.modalQuoteText}>{selectedQuote.text}</Text>
                    {selectedQuote.author ? <Text style={styles.modalAuthorText}>- {selectedQuote.author}</Text> : null}
                  </View>
                )}

                {/* Action Buttons */}
                {selectedQuote && (
                  <View style={styles.modalActionButtons}>
                    <TouchableOpacity
                      onPress={() => selectedQuote && shareQuote(selectedQuote)}
                      style={styles.modalActionButton}
                    >
                      <Ionicons name="share-outline" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedQuote) {
                          toggleLike(selectedQuote.id)
                        }
                      }}
                      style={styles.modalActionButton}
                    >
                      <Ionicons name={selectedQuote.isLiked ? "heart" : "heart-outline"} size={28} color="white" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Page Indicator */}
                <View style={styles.modalPageIndicator}>
                  <View style={styles.modalIndicatorLine} />
                </View>
              </SafeAreaView>
            </LinearGradient>
          </ImageBackground>
        </Modal>
      </LinearGradient>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  safeArea: {
    width: "100%",
  },
  headerContainer: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    borderBottomWidth: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5, // Reduced margin to bring title closer to back button
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  followButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  followingButton: {
    backgroundColor: "rgba(167, 139, 250, 0.3)",
    borderColor: "rgba(167, 139, 250, 0.5)",
  },
  followButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    height: "100%",
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  quotesList: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 100,
  },
  quoteCard: {
    backgroundColor: "rgba(45, 55, 72, 0.7)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  quoteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  quoteText: {
    fontSize: 18,
    color: "white",
    lineHeight: 24,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  quoteAuthor: {
    fontSize: 16,
    color: "#A0AEC0",
    marginTop: 8,
    marginBottom: 4,
  },
  quoteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  quoteDate: {
    fontSize: 14,
    color: "#8D9CB0",
  },
  quoteActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 6,
    marginLeft: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
    flex: 1,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 24,
  },
  noResults: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },

  // Modal Styles
  modalBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  modalContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  modalBackButton: {
    padding: 5,
  },
  modalHeaderTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  modalFollowButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalFollowButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  modalQuoteContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalQuoteText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    lineHeight: 38,
  },
  modalAuthorText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 20,
    textAlign: "center",
  },
  modalActionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  modalActionButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  modalPageIndicator: {
    alignItems: "center",
    paddingBottom: 20,
  },
  modalIndicatorLine: {
    width: 60,
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 3,
  },
})
