"use client"

// ExploreScreen.js
import { useState, useRef, useEffect, use } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  FlatList,
  ImageBackground,
  Animated,
  Dimensions,
  Share,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { getUserCollections, createCollection } from "../../../functions/collection";
import ToastManager, {Toast} from "toastify-react-native"


const { width, height } = Dimensions.get("window")
// Sample data for collections
const INITIAL_COLLECTIONS = [
  { id: "1", title: "New" },
  { id: "2", title: "Tgy" },
  { id: "3", title: "Motivation" },
  { id: "4", title: "Success" },
  { id: "5", title: "Happiness" },
  { id: "6", title: "Mindfulness" },
]

// Sample data for quotes in each collection
const QUOTES_BY_COLLECTION = {
  1: [
    {
      id: "101",
      text: "Don't cry over the past, it's gone. Don't stress about the future, it hasn't arrived. Live in the present and make it beautiful.",
      author: "",
      date: "Fri, May 09, 2025",
      isLiked: true,
      isSaved: false,
    },
    {
      id: "102",
      text: "Van",
      author: "Jwise",
      date: "Sat, May 10, 2025",
      isLiked: false,
      isSaved: false,
    },
  ],
  2: [
    {
      id: "201",
      text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      author: "Nelson Mandela",
      date: "Sat, May 10, 2025",
      isLiked: false,
      isSaved: true,
    },
  ],
  3: [
    {
      id: "301",
      text: "Believe you can and you are halfway there.",
      author: "Theodore Roosevelt",
      date: "Fri, May 09, 2025",
      isLiked: false,
      isSaved: false,
    },
    {
      id: "302",
      text: "It does not matter how slowly you go as long as you do not stop.",
      author: "Confucius",
      date: "Sat, May 10, 2025",
      isLiked: false,
      isSaved: false,
    },
    // Add more quotes as needed
  ],
  // Add more collections as needed
}

export default function ExploreScreen({ navigation }) {
  // State for collections and quotes
  const [collections, setCollections] = useState([])
  const [currentView, setCurrentView] = useState("collections") // 'collections' or 'quotes'
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [quotes, setQuotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredQuotes, setFilteredQuotes] = useState([])

  // State for new collection modal
  const [modalVisible, setModalVisible] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [isCreatingCollection, setIsCreatingCollection] = useState(false)

  // State for quote detail modal
  const [quoteDetailVisible, setQuoteDetailVisible] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState(null)

  // Animation values
  const collectionsOpacity = useRef(new Animated.Value(1)).current
  const quotesOpacity = useRef(new Animated.Value(0)).current
  const headerTitleOpacity = useRef(new Animated.Value(1)).current
  const headerButtonsOpacity = useRef(new Animated.Value(1)).current
  const quotesScrollY = useRef(new Animated.Value(0)).current

  // Filter quotes based on search query

  const fetchCollections = async () => {
    try {
      const userCollections = await getUserCollections();
      console.log("Fetched collections:", userCollections);
      if (
        userCollections &&
        Array.isArray(userCollections.collections) &&
        userCollections.collections.length > 0
      ) {
        // Map the API fields to match the expected collection structure
        const mappedCollections = userCollections.collections.map((col) => ({
          id: col.id,
          title: col.name,
          quotes: col.quotes || [], // Ensure quotes is an array
        }));
        setCollections(mappedCollections);
      } else {
        setCollections([]);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };
  useEffect(() => {

    fetchCollections();
  }, []);
  useEffect(() => {
    if (!quotes) return

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

  // Handle collection selection
  const handleCollectionPress = (collection) => {
    console.log("Selected collection:", collection)
    setSelectedCollection(collection)
    setQuotes(collection.quotes || [])
    // setFilteredQuotes(collection.quotes || [])

    // Reset scroll position
    quotesScrollY.setValue(0)

    // Animate transition
    Animated.parallel([
      Animated.timing(collectionsOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(headerTitleOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(headerButtonsOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentView("quotes")

      Animated.parallel([
        Animated.timing(quotesOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(headerTitleOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(headerButtonsOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    })
  }

  // Handle back to collections
  const handleBackToCollections = () => {
    Animated.parallel([
      Animated.timing(quotesOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(headerTitleOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(headerButtonsOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentView("collections")
      setSelectedCollection(null)
      setSearchQuery("")

      Animated.parallel([
        Animated.timing(collectionsOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(headerTitleOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(headerButtonsOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    })
  }

  // Handle creating a new collection
  const handleCreateCollection = async () => {
    if (newCollectionName.trim() === "") return

    setIsCreatingCollection(true)
    try {
      const createdCollection = await createCollection(newCollectionName.trim());
      console.log("Created collections:", createdCollection);
      if (
        createdCollection.success
      ) {
        Toast.success(createdCollection.message || "Collection created successfully")
        setNewCollectionName("")
        setModalVisible(false)

      } else {
        Toast.error( createdCollection.message || "Failed to create collection")
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setIsCreatingCollection(false)
    }
  }

  // Open quote detail modal
  const openQuoteDetail = (quote) => {
    setSelectedQuote(quote)
    setQuoteDetailVisible(true)
  }

  // Toggle like status for a quote
  const toggleLike = (quoteId) => {
    setQuotes((prevQuotes) =>
      prevQuotes.map((quote) => (quote.id === quoteId ? { ...quote, isLiked: !quote.isLiked } : quote)),
    )

    // Also update filtered quotes
    setFilteredQuotes((prevQuotes) =>
      prevQuotes.map((quote) => (quote.id === quoteId ? { ...quote, isLiked: !quote.isLiked } : quote)),
    )

    // Update the selected quote if it's the one being liked
    if (selectedQuote && selectedQuote.id === quoteId) {
      setSelectedQuote((prevQuote) => ({
        ...prevQuote,
        isLiked: !prevQuote.isLiked,
      }))
    }
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
      console.log("Error sharing quote:", error)
    }
  }

  // Render a collection item (simple, without animations)
  const renderCollectionItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.collectionCard} onPress={() => handleCollectionPress(item)} activeOpacity={0.7}>
        <View style={styles.collectionContent}>
          <Text style={styles.collectionTitle}>{item.title}</Text>
          <Text style={styles.collectionCount}>Collection</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#8D9CB0" />
      </TouchableOpacity>
    )
  }

  // Render a quote item with animation
  const renderQuoteItem = ({ item, index }) => {
    // Add animation for staggered appearance
    const translateY = quotesScrollY.interpolate({
      inputRange: [(index - 1) * 100, index * 100],
      outputRange: [50, 0],
      extrapolate: "clamp",
    })

    const opacity = quotesScrollY.interpolate({
      inputRange: [(index - 1) * 100, index * 100],
      outputRange: [7, 1],
      extrapolate: "clamp",
    })

    const scale = quotesScrollY.interpolate({
      inputRange: [(index - 1) * 100, index * 100],
      outputRange: [1, 1],
      extrapolate: "clamp",
    })

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => openQuoteDetail(item)}>
        <Animated.View
          style={[
            {
              transform: [{ translateY }, { scale }],
              opacity,
            },
          ]}
        >
          <View style={styles.quoteCard}>
            <View style={styles.quoteHeader}>
              <Text style={styles.quoteText}>{item.text}</Text>
              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {item.author ? <Text style={styles.quoteAuthor}>- {item.author}</Text> : null}

            <View style={styles.quoteFooter}>
              <Text style={styles.quoteDate}>{item.date}</Text>
              <View style={styles.quoteActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
                  <Ionicons
                    name={item.isLiked ? "heart" : "heart-outline"}
                    size={22}
                    color={item.isLiked ? "#FF6B8E" : "#fff"}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => shareQuote(item)}>
                  <Ionicons name="share-outline" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  // Empty state for quotes
  const QuotesEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color="rgba(255,255,255,0.3)" />
      <Text style={styles.emptyStateTitle}>No quotes found</Text>
      <Text style={styles.emptyStateText}>This collection doesn't have any quotes yet.</Text>
    </View>
  )

  // Empty state for collections
  const CollectionsEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="folder-outline" size={64} color="rgba(255,255,255,0.3)" />
      <Text style={styles.emptyStateTitle}>No collections yet</Text>
      <Text style={styles.emptyStateText}>Create your first collection to organize your favorite quotes.</Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.emptyStateButtonText}>Create Collection</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <ImageBackground source={require("../../../assets/4.jpg")} style={styles.backgroundImage}>
      <LinearGradient colors={["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0.25)"]} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ToastManager/>

        {/* Header */}
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {currentView === "collections" ? (
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Animated.View style={{ opacity: headerButtonsOpacity }}>
                    <Ionicons name="chevron-back" size={28} color="white" />
                  </Animated.View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.backButton} onPress={handleBackToCollections}>
                  <Animated.View style={{ opacity: headerButtonsOpacity }}>
                    <Ionicons name="close" size={28} color="white" />
                  </Animated.View>
                </TouchableOpacity>
              )}

              <Animated.View style={[styles.headerTitleContainer, { opacity: headerTitleOpacity }]}>
                <Text style={styles.headerTitle}>
                  {currentView === "collections" ? "Explore topics" : selectedCollection?.title}
                </Text>
              </Animated.View>
            </View>

            {/* Only show Add New button in collections view */}
            {currentView === "collections" && (
              <Animated.View style={[styles.headerRight, { opacity: headerButtonsOpacity }]}>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                  <Text style={styles.addButtonText}>Add new</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          {/* Search Bar - Only visible in quotes view */}
          {currentView === "quotes" && (
            <Animated.View style={{ opacity: quotesOpacity }}>
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
            </Animated.View>
          )}
        </SafeAreaView>

        {/* Collections List */}
        <Animated.View
          style={[
            styles.contentContainer,
            { opacity: collectionsOpacity, display: currentView === "collections" ? "flex" : "none" },
          ]}
        >
          {collections.length > 0 ? (
            <FlatList
              data={collections}
              renderItem={renderCollectionItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.collectionsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <CollectionsEmptyState />
          )}
        </Animated.View>

        {/* Quotes List */}
        <Animated.View
          style={[
            styles.contentContainer,
            { opacity: quotesOpacity, display: currentView === "quotes" ? "flex" : "none" },
          ]}
        >
          {filteredQuotes.length > 0 ? (
            <Animated.FlatList
              data={filteredQuotes}
              renderItem={renderQuoteItem}
              keyExtractor={(item) => item.text}
              contentContainerStyle={styles.quotesList}
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: quotesScrollY } } }], {
                useNativeDriver: true,
              })}
              scrollEventThrottle={16}
            />
          ) : searchQuery.length > 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No quotes found for "{searchQuery}"</Text>
            </View>
          ) : (
            <QuotesEmptyState />
          )}
        </Animated.View>

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
            source={require("../../../assets/10.jpg")}
            style={styles.modalBackground}
            resizeMode="cover"
          >
            <LinearGradient colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.3)"]} style={styles.modalOverlay}>
              <SafeAreaView style={styles.quoteModalContainer}>
                {/* Header */}
                <View style={styles.quoteModalHeader}>
                  <TouchableOpacity onPress={() => setQuoteDetailVisible(false)} style={styles.quoteModalBackButton}>
                    <Ionicons name="chevron-back" size={28} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.quoteModalHeaderTitle}>
                    {selectedCollection ? selectedCollection.title : "Quote"}
                  </Text>
                  <View style={{ width: 40 }} />
                </View>

                {/* Quote Content */}
                {selectedQuote && (
                  <View style={styles.quoteModalContent}>
                    <Text style={styles.quoteModalText}>{selectedQuote.text}</Text>
                    {selectedQuote.author ? (
                      <Text style={styles.quoteModalAuthorText}>- {selectedQuote.author}</Text>
                    ) : null}
                  </View>
                )}

                {/* Action Buttons */}
                {selectedQuote && (
                  <View style={styles.quoteModalActions}>
                    <TouchableOpacity
                      onPress={() => selectedQuote && shareQuote(selectedQuote)}
                      style={styles.quoteModalActionButton}
                    >
                      <Ionicons name="share-outline" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedQuote) {
                          toggleLike(selectedQuote.id)
                        }
                      }}
                      style={styles.quoteModalActionButton}
                    >
                      <Ionicons
                        name={selectedQuote.isLiked ? "heart" : "heart-outline"}
                        size={28}
                        color={selectedQuote.isLiked ? "#FF6B8E" : "white"}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Page Indicator */}
                <View style={styles.quoteModalPageIndicator}>
                  <View style={styles.quoteModalIndicatorLine} />
                </View>
              </SafeAreaView>
            </LinearGradient>
          </ImageBackground>
        </Modal>

        {/* New Collection Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80",
            }}
            style={styles.backgroundImage}
          >
            <LinearGradient colors={["rgba(2, 2, 2, 0.1)", "rgba(2, 2, 2, 0.9)"]} style={styles.container}>
              <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalContainer}
              >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalContent}>
                    {/* Modal Header */}
                    <SafeAreaView style={styles.modalSafeArea}>
                      <View style={styles.modalHeader}>
                        <TouchableOpacity
                          style={styles.modalBackButton}
                          onPress={() => {
                            setModalVisible(false)
                            setNewCollectionName("")
                          }}
                        >
                          <Ionicons name="chevron-back" size={28} color="white" />
                          <Text style={styles.modalBackText}>Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>New collection</Text>
                        <View style={{ width: 80 }} />
                      </View>

                      {/* Modal Content */}
                      <View style={styles.modalBody}>
                        <Text style={styles.modalDescription}>
                          Enter a name for your new collection. You can rename it later.
                        </Text>

                        <TextInput
                          style={styles.modalInput}
                          placeholder="My new collection"
                          placeholderTextColor="#8D9CB0"
                          value={newCollectionName}
                          onChangeText={setNewCollectionName}
                          autoFocus
                        />

                        <TouchableOpacity
                          style={[
                            styles.saveButton, 
                            (newCollectionName.trim() === "" || isCreatingCollection) && styles.disabledButton
                          ]}
                          onPress={handleCreateCollection}
                          disabled={newCollectionName.trim() === "" || isCreatingCollection}
                        >
                          {isCreatingCollection ? (
                            <View style={styles.loadingContainer}>
                              <ActivityIndicator size="small" color="#fff" />
                              <Text style={[styles.saveButtonText, { marginLeft: 8 }]}>
                                Creating...
                              </Text>
                            </View>
                          ) : (
                            <Text style={styles.saveButtonText}>Save</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </SafeAreaView>
                  </View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
  headerTitleContainer: {
    marginLeft: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
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
  contentContainer: {
    flex: 1,
  },
  collectionsList: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  collectionCard: {
    backgroundColor: "rgba(45, 55, 72, 0.7)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  collectionContent: {
    flex: 1,
  },
  collectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  collectionCount: {
    fontSize: 14,
    color: "#8D9CB0",
  },
  quotesList: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  quoteCard: {
    backgroundColor: "rgba(45, 55, 72, 0.7)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 5,
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
  moreButton: {
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
    marginBottom: 30,
  },
  emptyStateButton: {
    backgroundColor: "white",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  emptyStateButtonText: {
    color: "#1E2A38",
    fontSize: 16,
    fontWeight: "bold",
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
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  modalSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  modalBackButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  modalBackText: {
    color: "white",
    fontSize: 18,
    marginLeft: -5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  modalDescription: {
    fontSize: 18,
    color: "white",
    marginBottom: 30,
    lineHeight: 26,
  },
  modalInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "white",
    fontSize: 18,
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 450,
  },
  disabledButton: {
    opacity: 1,
  },
  saveButtonText: {
    color: "#1E2A38",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Quote Detail Modal Styles
  modalBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  quoteModalContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  quoteModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  quoteModalBackButton: {
    padding: 5,
  },
  quoteModalHeaderTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  quoteModalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  quoteModalText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    lineHeight: 38,
  },
  quoteModalAuthorText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 20,
    textAlign: "center",
  },
  quoteModalActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  quoteModalActionButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  quoteModalPageIndicator: {
    alignItems: "center",
    paddingBottom: 20,
  },
  quoteModalIndicatorLine: {
    width: 60,
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 3,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
})
