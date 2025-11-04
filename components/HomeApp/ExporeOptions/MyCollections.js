"use client"

// ExploreScreen.js
import { useState, useRef, useEffect } from "react"
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
  RefreshControl,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { getUserCollections, createCollection } from "../../../functions/collection";
import ToastManager, {Toast} from "toastify-react-native"

const { width, height } = Dimensions.get("window")

export default function ExploreScreen({ navigation }) {
  // State for collections and quotes
  const [collections, setCollections] = useState([])
  const [currentView, setCurrentView] = useState("collections")
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [quotes, setQuotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredQuotes, setFilteredQuotes] = useState([])

  // Loading states
  const [loading, setLoading] = useState({
    collections: true,
    quotes: false,
    creatingCollection: false,
    refreshing: false
  })

  // State for new collection modal
  const [modalVisible, setModalVisible] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")

  // State for quote detail modal
  const [quoteDetailVisible, setQuoteDetailVisible] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState(null)

  // Animation values
  const collectionsOpacity = useRef(new Animated.Value(1)).current
  const quotesOpacity = useRef(new Animated.Value(0)).current
  const headerTitleOpacity = useRef(new Animated.Value(1)).current
  const headerButtonsOpacity = useRef(new Animated.Value(1)).current
  const quotesScrollY = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  // Pulse animation for loading states
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    );
    
    if (loading.collections || loading.quotes) {
      pulse.start();
    } else {
      pulse.stop();
      pulseAnim.setValue(1);
    }

    return () => pulse.stop();
  }, [loading.collections, loading.quotes]);

  const fetchCollections = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(prev => ({ ...prev, collections: true }))
      }
      
      const userCollections = await getUserCollections();
      console.log("Fetched collections:", userCollections);
      
      if (userCollections && Array.isArray(userCollections.collections) && userCollections.collections.length > 0) {
        const mappedCollections = userCollections.collections.map((col) => ({
          id: col.id,
          title: col.name,
          quotes: col.quotes || [],
        }));
        setCollections(mappedCollections);
      } else {
        setCollections([]);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      Toast.error("Failed to load collections");
    } finally {
      setLoading(prev => ({ 
        ...prev, 
        collections: false,
        refreshing: false 
      }))
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
  const handleCollectionPress = async (collection) => {
    console.log("Selected collection:", collection)
    setSelectedCollection(collection)
    setLoading(prev => ({ ...prev, quotes: true }))

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
    ]).start(async () => {
      setCurrentView("quotes")
      
      // Simulate loading quotes (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 800));
      setQuotes(collection.quotes || [])
      setLoading(prev => ({ ...prev, quotes: false }))

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

    setLoading(prev => ({ ...prev, creatingCollection: true }))
    try {
      const createdCollection = await createCollection(newCollectionName.trim());
      console.log("Created collections:", createdCollection);
      if (createdCollection.success) {
        Toast.success(createdCollection.message || "Collection created successfully")
        setNewCollectionName("")
        setModalVisible(false)
        // Refresh collections
        fetchCollections();
      } else {
        Toast.error(createdCollection.message || "Failed to create collection")
      }
    } catch (error) {
      console.error("Error creating collection:", error);
      Toast.error("Failed to create collection")
    } finally {
      setLoading(prev => ({ ...prev, creatingCollection: false }))
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

    setFilteredQuotes((prevQuotes) =>
      prevQuotes.map((quote) => (quote.id === quoteId ? { ...quote, isLiked: !quote.isLiked } : quote)),
    )

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

  // Pull to refresh
  const onRefresh = () => {
    setLoading(prev => ({ ...prev, refreshing: true }))
    fetchCollections(true);
  }

  // Render loading skeleton for collections
  const renderCollectionSkeleton = () => (
    <Animated.View 
      style={[
        styles.collectionCard,
        { transform: [{ scale: pulseAnim }] }
      ]}
    >
      <View style={styles.skeletonContent}>
        <View style={[styles.skeletonLine, { width: '70%', height: 20 }]} />
        <View style={[styles.skeletonLine, { width: '40%', height: 14 }]} />
      </View>
      <View style={styles.skeletonIcon} />
    </Animated.View>
  )

  // Render a collection item
  const renderCollectionItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.collectionCard} 
        onPress={() => handleCollectionPress(item)} 
        activeOpacity={0.7}
      >
        <View style={styles.collectionContent}>
          <Text style={styles.collectionTitle}>{item.title}</Text>
          <Text style={styles.collectionCount}>
            {item.quotes?.length || 0} {item.quotes?.length === 1 ? 'quote' : 'quotes'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#8D9CB0" />
      </TouchableOpacity>
    )
  }

  // Render loading skeleton for quotes
  const renderQuoteSkeleton = ({ index }) => (
    <Animated.View
      style={[
        styles.quoteCard,
        { 
          transform: [{ scale: pulseAnim }],
          opacity: pulseAnim.interpolate({
            inputRange: [1, 1.1],
            outputRange: [0.7, 1]
          })
        }
      ]}
    >
      <View style={styles.skeletonContent}>
        <View style={[styles.skeletonLine, { height: 16, marginBottom: 8 }]} />
        <View style={[styles.skeletonLine, { height: 16, marginBottom: 8 }]} />
        <View style={[styles.skeletonLine, { width: '80%', height: 16 }]} />
      </View>
      <View style={styles.skeletonFooter}>
        <View style={[styles.skeletonLine, { width: '30%', height: 12 }]} />
        <View style={styles.skeletonActions}>
          <View style={[styles.skeletonAction, { width: 30 }]} />
          <View style={[styles.skeletonAction, { width: 30 }]} />
        </View>
      </View>
    </Animated.View>
  )

  // Render a quote item with animation
  const renderQuoteItem = ({ item, index }) => {
    const translateY = quotesScrollY.interpolate({
      inputRange: [(index - 1) * 100, index * 100],
      outputRange: [50, 0],
      extrapolate: "clamp",
    })

    const opacity = quotesScrollY.interpolate({
      inputRange: [(index - 1) * 100, index * 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    })

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => openQuoteDetail(item)}>
        <Animated.View
          style={[
            styles.quoteCard,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <View style={styles.quoteHeader}>
            <Text style={styles.quoteText}>{item.text}</Text>
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
                    <Ionicons name="arrow-back" size={28} color="white" />
                  </Animated.View>
                </TouchableOpacity>
              )}

              <Animated.View style={[styles.headerTitleContainer, { opacity: headerTitleOpacity }]}>
                <Text style={styles.headerTitle}>
                  {currentView === "collections" ? "Explore topics" : selectedCollection?.title}
                </Text>
                {loading.quotes && (
                  <View style={styles.headerLoading}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.headerLoadingText}>Loading quotes...</Text>
                  </View>
                )}
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
                  placeholder="Search quotes..."
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
          {loading.collections ? (
            <FlatList
              data={[1, 2, 3, 4]} // Dummy data for skeleton
              renderItem={renderCollectionSkeleton}
              keyExtractor={(item, index) => `skeleton-${index}`}
              contentContainerStyle={styles.collectionsList}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={loading.refreshing}
                  onRefresh={onRefresh}
                  tintColor="#fff"
                  colors={["#fff"]}
                />
              }
            />
          ) : collections.length > 0 ? (
            <FlatList
              data={collections}
              renderItem={renderCollectionItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.collectionsList}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={loading.refreshing}
                  onRefresh={onRefresh}
                  tintColor="#fff"
                  colors={["#fff"]}
                />
              }
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
          {loading.quotes ? (
            <FlatList
              data={[1, 2, 3, 4, 5]} // Dummy data for skeleton
              renderItem={renderQuoteSkeleton}
              keyExtractor={(item, index) => `quote-skeleton-${index}`}
              contentContainerStyle={styles.quotesList}
              showsVerticalScrollIndicator={false}
            />
          ) : filteredQuotes.length > 0 ? (
            <Animated.FlatList
              data={filteredQuotes}
              renderItem={renderQuoteItem}
              keyExtractor={(item, index) => `quote-${index}`}
              contentContainerStyle={styles.quotesList}
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: quotesScrollY } } }], {
                useNativeDriver: true,
              })}
              scrollEventThrottle={16}
            />
          ) : searchQuery.length > 0 ? (
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.3)" />
              <Text style={styles.noResultsText}>No quotes found for "{searchQuery}"</Text>
              <Text style={styles.noResultsSubtext}>Try different keywords</Text>
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
            source={require("../../../assets/4.jpg")}
            style={styles.backgroundImage}
          >
            <LinearGradient colors={["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.7)"]} style={styles.container}>
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
                            (newCollectionName.trim() === "" || loading.creatingCollection) && styles.disabledButton
                          ]}
                          onPress={handleCreateCollection}
                          disabled={newCollectionName.trim() === "" || loading.creatingCollection}
                        >
                          {loading.creatingCollection ? (
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
    flex: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  headerLoading: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  headerLoadingText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginLeft: 6,
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
    marginBottom: 12,
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
    flex: 1,
  },
  noResultsText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
  },

  // Skeleton Loading Styles
  skeletonContent: {
    flex: 1,
  },
  skeletonLine: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonIcon: {
    width: 24,
    height: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  skeletonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  skeletonActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  skeletonAction: {
    height: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 11,
    marginLeft: 12,
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
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.6,
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