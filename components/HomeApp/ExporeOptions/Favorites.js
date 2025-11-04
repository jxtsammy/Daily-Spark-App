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
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { getSavedQuotes, deleteSavedQuote } from "../../../functions/quotes"
import { getUserCollections, addQuoteToCollection } from "../../../functions/collection"
import ToastManager, {Toast} from 'toastify-react-native'

const { width, height } = Dimensions.get("window")

export default function QuoteDisplayScreen({ navigation }) {
  // State for quotes
  const [quotes, setQuotes] = useState([])
  const [filteredQuotes, setFilteredQuotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  // Loading states
  const [loading, setLoading] = useState({
    quotes: true,
    collections: false,
    addingToCollection: false,
    deleting: false,
    refreshing: false
  })

  // State for quote detail modal
  const [quoteDetailVisible, setQuoteDetailVisible] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState(null)

  // State for bookmark modal
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState(false)
  const [selectedQuoteForBookmark, setSelectedQuoteForBookmark] = useState(null)
  const [selectedCollectionId, setSelectedCollectionId] = useState(null)
  const [collections, setCollections] = useState([])

  // State for follow button
  const [isFollowing, setIsFollowing] = useState(true)

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  })
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
    
    if (loading.quotes) {
      pulse.start();
    } else {
      pulse.stop();
      pulseAnim.setValue(1);
    }

    return () => pulse.stop();
  }, [loading.quotes]);

  // Fetch saved quotes
  const fetchSavedQuotes = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(prev => ({ ...prev, quotes: true }))
      }
      
      const savedQuotes = await getSavedQuotes();
      console.log("Fetched saved quotes:", savedQuotes)
      
      if (savedQuotes && savedQuotes.length > 0) {
        setQuotes(savedQuotes)
      } else {
        setQuotes([])
        console.log("No saved quotes found")
      }
    } catch (error) {
      console.error("Error fetching saved quotes:", error)
      Toast.error("Failed to load quotes")
    } finally {
      setLoading(prev => ({ 
        ...prev, 
        quotes: false,
        refreshing: false 
      }))
    }
  }

  // Fetch collections
  const fetchCollections = async () => {
    try {
      setLoading(prev => ({ ...prev, collections: true }))
      const userCollections = await getUserCollections();
      console.log("Fetched collections:", userCollections)

      if (userCollections && Array.isArray(userCollections.collections) && userCollections.collections.length > 0) {
        const mappedCollections = userCollections.collections.map((col) => ({
          id: col.id,
          title: col.name,
          count: col.quotes ? col.quotes.length : 0,
        }));
        setCollections(mappedCollections);
      } else {
        setCollections([])
      }
    } catch (error) {
      console.error("Error fetching collections:", error)
      setCollections([])
    } finally {
      setLoading(prev => ({ ...prev, collections: false }))
    }
  }

  useEffect(() => {
    fetchSavedQuotes()
    fetchCollections()
  }, [])

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

  // Delete a quote
  const deleteQuote = async (quoteId) => {
    try {
      setLoading(prev => ({ ...prev, deleting: true }))
      const result = await deleteSavedQuote(quoteId);
      console.log("Delete result:", result)
      
      if (result && result.success) {
        setQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== quoteId));
        Toast.success(result.message || "Quote deleted successfully");
      } else {
        Toast.error((result && result.message) || "Failed to delete quote");
      }
    } catch (error) {
      Toast.error("An error occurred while deleting the quote");
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, deleting: false }))
    }
  };

  // Handle delete quote confirmation
  const handleDeleteQuote = (quoteId) => {
    Alert.alert("Delete Quote", "Are you sure you want to delete this quote?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => deleteQuote(quoteId),
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

  // Toggle save status for a quote - now opens bookmark modal
  const toggleSave = (quote) => {
    setSelectedQuoteForBookmark(quote)
    setSelectedCollectionId(null)
    setBookmarkModalVisible(true)
  }

  // Add quote to collection
  const addToCollection = async () => {
    if (!selectedCollectionId || !selectedQuoteForBookmark) {
      Toast.info("Please select a collection first");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, addingToCollection: true }))
      console.log(`Adding quote "${selectedQuoteForBookmark.text}" to collection ${selectedCollectionId}`);

      const collectionId = selectedCollectionId;
      const quote = {
        text: selectedQuoteForBookmark.text,
        author: selectedQuoteForBookmark.author
      };

      const result = await addQuoteToCollection(collectionId, quote);
      console.log("Add quote to collection result:", result);

      if (result?.success) {
        Toast.success(result.message || "Quote added successfully");
        
        setTimeout(() => {
          setBookmarkModalVisible(false);
          setSelectedQuoteForBookmark(null);
          setSelectedCollectionId(null);
          fetchCollections();
        }, 1500);

      } else {
        Toast.error(result?.message || "Failed to add quote to collection");
      }

    } catch (error) {
      console.error("Error adding quote to collection:", error);
      Toast.error("Failed to add quote to collection");
    } finally {
      setLoading(prev => ({ ...prev, addingToCollection: false }))
    }
  };

  // Handle collection selection
  const handleCollectionSelect = (collectionId) => {
    setSelectedCollectionId(collectionId)
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

  // Pull to refresh
  const onRefresh = () => {
    setLoading(prev => ({ ...prev, refreshing: true }))
    fetchSavedQuotes(true);
    fetchCollections();
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

  // Render a quote item
  const renderQuoteItem = ({ item, index }) => {
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
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => handleDeleteQuote(item.id)}
              disabled={loading.deleting}
            >
              {loading.deleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="trash-outline" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {item.author ? <Text style={styles.quoteAuthor}>- {item.author}</Text> : null}

          <View style={styles.quoteFooter}>
            <Text style={styles.quoteDate}>{item.date}</Text>
            <View style={styles.quoteActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => toggleSave(item)}>
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

  // Render collection loading skeleton
  const renderCollectionSkeleton = () => (
    <Animated.View 
      style={[
        styles.bookmarkCollectionItem,
        { transform: [{ scale: pulseAnim }] }
      ]}
    >
      <View style={styles.bookmarkCollectionInfo}>
        <View style={[styles.skeletonIcon, { width: 20, height: 20 }]} />
        <View style={[styles.skeletonLine, { width: '60%', height: 16, marginLeft: 12 }]} />
      </View>
      <View style={styles.bookmarkCollectionMeta}>
        <View style={[styles.skeletonLine, { width: 40, height: 14 }]} />
        <View style={[styles.skeletonIcon, { width: 20, height: 20, marginLeft: 8 }]} />
      </View>
    </Animated.View>
  )

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color="rgba(255,255,255,0.3)" />
      <Text style={styles.emptyStateTitle}>No quotes yet</Text>
      <Text style={styles.emptyStateText}>
        Add your favorite quotes to see them here. Your saved quotes will appear here.
      </Text>
    </View>
  )

  return (
    <ImageBackground
      source={require("../../../assets/2.jpg")}
      style={styles.backgroundImage}
    >
      <LinearGradient colors={["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0.3)"]} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ToastManager/>

        {/* Header */}
        <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={28} color="white" />
                </TouchableOpacity>
                <View>
                  <Text style={styles.headerTitle}>My Favorites</Text>
                  {loading.quotes && (
                    <Text style={styles.headerSubtitle}>Loading your quotes...</Text>
                  )}
                </View>
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
                placeholder="Search your quotes..."
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
        {loading.quotes ? (
          <FlatList
            data={[1, 2, 3, 4, 5]} // Dummy data for skeleton
            renderItem={renderQuoteSkeleton}
            keyExtractor={(item, index) => `skeleton-${index}`}
            contentContainerStyle={styles.quotesList}
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
        ) : quotes.length > 0 ? (
          <Animated.FlatList
            data={filteredQuotes}
            renderItem={renderQuoteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.quotesList}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={loading.refreshing}
                onRefresh={onRefresh}
                tintColor="#fff"
                colors={["#fff"]}
              />
            }
            ListEmptyComponent={
              searchQuery.length > 0 ? (
                <View style={styles.noResults}>
                  <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.3)" />
                  <Text style={styles.noResultsText}>No quotes found for "{searchQuery}"</Text>
                  <Text style={styles.noResultsSubtext}>Try different keywords</Text>
                </View>
              ) : null
            }
          />
        ) : (
          <ScrollView 
            style={styles.content} 
            contentContainerStyle={styles.contentContainer}
            refreshControl={
              <RefreshControl
                refreshing={loading.refreshing}
                onRefresh={onRefresh}
                tintColor="#fff"
                colors={["#fff"]}
              />
            }
          >
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
          <ToastManager/>
          <ImageBackground
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

        {/* Bookmark Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={bookmarkModalVisible}
          onRequestClose={() => setBookmarkModalVisible(false)}
        >
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <View style={styles.bookmarkModalBackground}>
            <TouchableWithoutFeedback onPress={() => setBookmarkModalVisible(false)}>
              <View style={styles.bookmarkModalOverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.bookmarkModalContainer}>
              <View style={styles.bookmarkModalHandle} />

              {/* Modal Header */}
              <View style={styles.bookmarkModalHeader}>
                <Text style={styles.bookmarkModalTitle}>Save to Collection</Text>
                <TouchableOpacity
                  onPress={() => {
                    setBookmarkModalVisible(false)
                    setSelectedCollectionId(null)
                  }}
                  style={styles.bookmarkModalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Quote Preview */}
              {selectedQuoteForBookmark && (
                <View style={styles.bookmarkQuotePreview}>
                  <Text style={styles.bookmarkQuoteText} numberOfLines={2}>
                    "{selectedQuoteForBookmark.text}"
                  </Text>
                  {selectedQuoteForBookmark.author && (
                    <Text style={styles.bookmarkQuoteAuthor}>- {selectedQuoteForBookmark.author}</Text>
                  )}
                </View>
              )}

              {/* Collections List */}
              <View style={styles.bookmarkCollectionsList}>
                <Text style={styles.bookmarkCollectionsTitle}>Choose a collection:</Text>
                {loading.collections ? (
                  <View style={styles.bookmarkLoadingContainer}>
                    {[1, 2, 3].map((item) => (
                      <View key={item}>
                        {renderCollectionSkeleton()}
                      </View>
                    ))}
                  </View>
                ) : collections.length === 0 ? (
                  <View style={styles.bookmarkEmptyContainer}>
                    <Ionicons name="folder-outline" size={32} color="#CCC" />
                    <Text style={styles.bookmarkEmptyText}>No collections available</Text>
                    <Text style={styles.bookmarkEmptySubText}>Create collections from the main menu to organize your quotes</Text>
                  </View>
                ) : (
                  <FlatList
                    data={collections}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.bookmarkCollectionItem,
                          selectedCollectionId === item.id && styles.bookmarkCollectionItemSelected
                        ]}
                        onPress={() => handleCollectionSelect(item.id)}
                      >
                        <View style={styles.bookmarkCollectionInfo}>
                          <Ionicons name="folder-outline" size={20} color="#A78BFA" />
                          <Text style={styles.bookmarkCollectionTitle}>{item.title}</Text>
                        </View>
                        <View style={styles.bookmarkCollectionMeta}>
                          <Text style={styles.bookmarkCollectionCount}>{item.count} quotes</Text>
                          {selectedCollectionId === item.id ? (
                            <Ionicons name="checkmark-circle" size={20} color="#A78BFA" />
                          ) : (
                            <Ionicons name="chevron-forward" size={16} color="#999" />
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>

              {/* Save Button */}
              <View style={styles.bookmarkSaveContainer}>
                <TouchableOpacity
                  style={[
                    styles.bookmarkSaveButton,
                    (!selectedCollectionId || loading.addingToCollection) && styles.bookmarkSaveButtonDisabled
                  ]}
                  onPress={addToCollection}
                  disabled={!selectedCollectionId || loading.addingToCollection}
                >
                  {loading.addingToCollection ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={[styles.bookmarkSaveButtonText, { marginLeft: 8 }]}>
                        Adding...
                      </Text>
                    </View>
                  ) : (
                    <Text style={[
                      styles.bookmarkSaveButtonText,
                      !selectedCollectionId && styles.bookmarkSaveButtonTextDisabled
                    ]}>
                      Save to Collection
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    marginLeft: 5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginLeft: 5,
    marginTop: 2,
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
    minWidth: 28,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
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

  // Bookmark Modal Styles
  bookmarkModalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bookmarkModalOverlay: {
    flex: 1,
  },
  bookmarkModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    maxHeight: height * 0.85,
    minHeight: height * 0.6,
  },
  bookmarkModalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E5E5",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  bookmarkModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  bookmarkModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  bookmarkModalCloseButton: {
    padding: 4,
  },
  bookmarkQuotePreview: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F8F9FA",
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#A78BFA",
  },
  bookmarkQuoteText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    fontStyle: "italic",
  },
  bookmarkQuoteAuthor: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  bookmarkCollectionsList: {
    paddingHorizontal: 20,
    flex: 1,
  },
  bookmarkCollectionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  bookmarkLoadingContainer: {
    flex: 1,
  },
  bookmarkLoadingText: {
    fontSize: 16,
    color: "#666",
  },
  bookmarkEmptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  bookmarkEmptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginTop: 12,
    textAlign: "center",
  },
  bookmarkEmptySubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  bookmarkCollectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  bookmarkCollectionItemSelected: {
    backgroundColor: "#F0F4FF",
    borderColor: "#A78BFA",
  },
  bookmarkCollectionInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bookmarkCollectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginLeft: 12,
  },
  bookmarkCollectionMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookmarkCollectionCount: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  bookmarkSaveContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  bookmarkSaveButton: {
    backgroundColor: "#A78BFA",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkSaveButtonDisabled: {
    backgroundColor: "#E5E5E5",
  },
  bookmarkSaveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bookmarkSaveButtonTextDisabled: {
    color: "#999",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
})