"use client"

// MyOwnQuotesScreen.js
import { useState, useEffect } from "react"
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
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  ImageBackground,
  Alert,
  Share,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width, height } = Dimensions.get("window")

const STORAGE_KEY = 'my_quotes_data'

export default function MyOwnQuotesScreen({ navigation }) {
  // State for quotes
  const [quotes, setQuotes] = useState([])
  const [filteredQuotes, setFilteredQuotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  // Loading states
  const [loading, setLoading] = useState({
    initial: true,
    saving: false,
    deleting: false,
    refreshing: false
  })

  // State for modal
  const [modalVisible, setModalVisible] = useState(false)
  const [newQuote, setNewQuote] = useState("")
  const [newAuthor, setNewAuthor] = useState("")

  // State for quote actions
  const [likedQuotes, setLikedQuotes] = useState({})
  const [savedQuotes, setSavedQuotes] = useState({})

  // State for follow button
  const [isFollowing, setIsFollowing] = useState(true)

  // State for quote detail modal
  const [quoteDetailVisible, setQuoteDetailVisible] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState(null)

  // Animation values
  const pulseAnim = useState(new Animated.Value(1))[0]
  const fadeAnim = useState(new Animated.Value(0))[0]

  // Load quotes from local storage on component mount
  useEffect(() => {
    loadQuotesFromStorage()
  }, [])

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
    
    if (loading.initial) {
      pulse.start();
      // Fade in content after load
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } else {
      pulse.stop();
      pulseAnim.setValue(1);
    }

    return () => pulse.stop();
  }, [loading.initial]);

  // Load quotes from AsyncStorage
  const loadQuotesFromStorage = async () => {
    try {
      setLoading(prev => ({ ...prev, initial: true }))
      const storedData = await AsyncStorage.getItem(STORAGE_KEY)
      
      if (storedData) {
        const data = JSON.parse(storedData)
        setQuotes(data.quotes || [])
        setLikedQuotes(data.likedQuotes || {})
        setSavedQuotes(data.savedQuotes || {})
      }
    } catch (error) {
      console.error('Error loading quotes from storage:', error)
    } finally {
      setLoading(prev => ({ ...prev, initial: false }))
    }
  }

  // Save quotes to AsyncStorage
  const saveQuotesToStorage = async (updatedQuotes, updatedLikes = likedQuotes, updatedSaves = savedQuotes) => {
    try {
      const dataToStore = {
        quotes: updatedQuotes,
        likedQuotes: updatedLikes,
        savedQuotes: updatedSaves,
        lastUpdated: new Date().toISOString()
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
    } catch (error) {
      console.error('Error saving quotes to storage:', error)
      throw error
    }
  }

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
  const handleAddQuote = async () => {
    if (newQuote.trim() === "") return

    setLoading(prev => ({ ...prev, saving: true }))

    try {
      const currentDate = new Date()
      const formattedDate = currentDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })

      const newQuoteObj = {
        id: Date.now().toString(),
        text: newQuote.trim(),
        author: newAuthor.trim() === "" ? "Anonymous" : newAuthor.trim(),
        date: formattedDate,
        createdAt: new Date().toISOString()
      }

      const updatedQuotes = [newQuoteObj, ...quotes]
      setQuotes(updatedQuotes)
      
      // Save to storage
      await saveQuotesToStorage(updatedQuotes)
      
      setNewQuote("")
      setNewAuthor("")
      setModalVisible(false)
      
      // Show success feedback
      Alert.alert("Success", "Quote added successfully!")
      
    } catch (error) {
      console.error('Error adding quote:', error)
      Alert.alert("Error", "Failed to save quote. Please try again.")
    } finally {
      setLoading(prev => ({ ...prev, saving: false }))
    }
  }

  // Delete a quote
  const handleDeleteQuote = async (quoteId) => {
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

  const deleteQuote = async (quoteId) => {
    try {
      setLoading(prev => ({ ...prev, deleting: true }))
      
      const updatedQuotes = quotes.filter((quote) => quote.id !== quoteId)
      setQuotes(updatedQuotes)
      
      // Remove from liked and saved states
      const updatedLikes = { ...likedQuotes }
      const updatedSaves = { ...savedQuotes }
      delete updatedLikes[quoteId]
      delete updatedSaves[quoteId]
      
      setLikedQuotes(updatedLikes)
      setSavedQuotes(updatedSaves)
      
      // Save to storage
      await saveQuotesToStorage(updatedQuotes, updatedLikes, updatedSaves)
      
      // If the deleted quote is currently selected in the modal, close the modal
      if (selectedQuote && selectedQuote.id === quoteId) {
        setQuoteDetailVisible(false)
      }
      
    } catch (error) {
      console.error('Error deleting quote:', error)
      Alert.alert("Error", "Failed to delete quote. Please try again.")
    } finally {
      setLoading(prev => ({ ...prev, deleting: false }))
    }
  }

  // Toggle like status for a quote
  const toggleLike = async (quoteId) => {
    try {
      const updatedLikes = {
        ...likedQuotes,
        [quoteId]: !likedQuotes[quoteId],
      }
      setLikedQuotes(updatedLikes)
      
      // Save to storage
      await saveQuotesToStorage(quotes, updatedLikes, savedQuotes)
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  // Toggle save status for a quote
  const toggleSave = async (quoteId) => {
    try {
      const updatedSaves = {
        ...savedQuotes,
        [quoteId]: !savedQuotes[quoteId],
      }
      setSavedQuotes(updatedSaves)
      
      // Save to storage
      await saveQuotesToStorage(quotes, likedQuotes, updatedSaves)
    } catch (error) {
      console.error('Error toggling save:', error)
    }
  }

  // Toggle follow status
  const toggleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  // Share a quote
  const shareQuote = async (quote) => {
    try {
      await Share.share({
        message: `"${quote.text}" - ${quote.author}`,
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
    // Simulate refresh - in real app, this might fetch from server
    setTimeout(() => {
      setLoading(prev => ({ ...prev, refreshing: false }))
    }, 1000)
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
          <View style={[styles.skeletonAction, { width: 30 }]} />
        </View>
      </View>
    </Animated.View>
  )

  // Render a quote item
  const renderQuoteItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => openQuoteDetail(item)}>
      <Animated.View style={[styles.quoteCard, { opacity: fadeAnim }]}>
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
        <Text style={styles.quoteAuthor}>- {item.author}</Text>
        <View style={styles.quoteFooter}>
          <Text style={styles.quoteDate}>{item.date}</Text>
          <View style={styles.quoteActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
              <Ionicons
                name={likedQuotes[item.id] ? "heart" : "heart-outline"}
                size={22}
                color={likedQuotes[item.id] ? "#FF6B8E" : "#fff"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => toggleSave(item.id)}>
              <Ionicons
                name={savedQuotes[item.id] ? "bookmark" : "bookmark-outline"}
                size={22}
                color={savedQuotes[item.id] ? "#A78BFA" : "#fff"}
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

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="create-outline" size={64} color="rgba(255,255,255,0.3)" />
      <Text style={styles.emptyStateTitle}>No quotes yet</Text>
      <Text style={styles.emptyStateText}>
        Create your own inspirational quotes and save them here for daily motivation.
      </Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.emptyStateButtonText}>Create Your First Quote</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <ImageBackground
      source={require("../../../assets/1.jpg")}
      style={styles.backgroundImage}
    >
      <LinearGradient colors={["rgba(0, 0, 0, 0.95)", "rgba(0, 0, 0, 0)"]} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Header */}
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={28} color="white" />
              </TouchableOpacity>
              <View>
                <Text style={styles.headerTitle}>My Quotes</Text>
                {loading.initial && (
                  <Text style={styles.headerSubtitle}>Loading your quotes...</Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={toggleFollow}
            >
              <Ionicons
                name={isFollowing ? "lock-closed" : "lock-open"}
                size={16}
                color="white"
                style={styles.followIcon}
              />
              <Text style={styles.followButtonText}>{isFollowing ? "Private" : "Public"}</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your quotes..."
              placeholderTextColor="#ccc"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#8D9CB0" />
              </TouchableOpacity>
            )}
          </View>

          {/* Quotes List */}
          {loading.initial ? (
            <FlatList
              data={[1, 2, 3, 4, 5]} // Dummy data for skeleton
              renderItem={renderQuoteSkeleton}
              keyExtractor={(item, index) => `skeleton-${index}`}
              contentContainerStyle={styles.quotesList}
              showsVerticalScrollIndicator={false}
            />
          ) : filteredQuotes.length > 0 ? (
            <FlatList
              data={filteredQuotes}
              renderItem={renderQuoteItem}
              keyExtractor={(item) => item.id}
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

          {/* Add Quote Button */}
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={24} color="#1E2A38" />
            <Text style={styles.addButtonText}>Add quote</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Add Quote Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
              <ImageBackground
                source={require("../../../assets/1.jpg")}
                style={styles.modalBackground}
              >
                <LinearGradient colors={["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.7)"]} style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    {/* Modal Header */}
                    <SafeAreaView style={styles.modalSafeArea}>
                      <View style={styles.modalHeader}>
                        <TouchableOpacity style={styles.modalBackButton} onPress={() => setModalVisible(false)}>
                          <Ionicons name="chevron-back" size={28} color="white" />
                          <Text style={styles.modalBackText}>Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Add Quote</Text>
                        <View style={styles.modalHeaderRight} />
                      </View>

                      {/* Modal Body */}
                      <View style={styles.modalBody}>
                        <Text style={styles.modalDescription}>Add your own quote. It will only be visible to you.</Text>

                        {/* Quote Input */}
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Your Quote *</Text>
                          <TextInput
                            style={styles.quoteInput}
                            placeholder="Enter your inspirational quote..."
                            placeholderTextColor="#8D9CB0"
                            multiline
                            value={newQuote}
                            onChangeText={setNewQuote}
                            maxLength={500}
                          />
                          <Text style={styles.charCount}>{newQuote.length}/500</Text>
                        </View>

                        {/* Author Input */}
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Author (optional)</Text>
                          <TextInput
                            style={styles.authorInput}
                            placeholder="Who said this? Leave blank for Anonymous"
                            placeholderTextColor="#8D9CB0"
                            value={newAuthor}
                            onChangeText={setNewAuthor}
                            maxLength={100}
                          />
                          <Text style={styles.charCount}>{newAuthor.length}/100</Text>
                        </View>

                        {/* Save Button */}
                        <TouchableOpacity
                          style={[
                            styles.saveButton, 
                            (newQuote.trim() === "" || loading.saving) && styles.disabledButton
                          ]}
                          onPress={handleAddQuote}
                          disabled={newQuote.trim() === "" || loading.saving}
                        >
                          {loading.saving ? (
                            <View style={styles.loadingContainer}>
                              <ActivityIndicator size="small" color="#fff" />
                              <Text style={[styles.saveButtonText, { marginLeft: 8 }]}>
                                Saving...
                              </Text>
                            </View>
                          ) : (
                            <Text style={styles.saveButtonText}>Save Quote</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </SafeAreaView>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Quote Detail Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={quoteDetailVisible}
          onRequestClose={() => setQuoteDetailVisible(false)}
        >
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <ImageBackground
            source={require("../../../assets/11.jpg")}
            style={styles.detailModalBackground}
            resizeMode="cover"
          >
            <LinearGradient colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.3)"]} style={styles.detailModalOverlay}>
              <SafeAreaView style={styles.detailModalContainer}>
                {/* Header */}
                <View style={styles.detailModalHeader}>
                  <TouchableOpacity onPress={() => setQuoteDetailVisible(false)} style={styles.detailModalBackButton}>
                    <Ionicons name="chevron-back" size={28} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.detailModalHeaderTitle}>My Quotes</Text>
                  <TouchableOpacity
                    style={[styles.detailModalFollowButton, isFollowing && styles.followingButton]}
                    onPress={toggleFollow}
                  >
                    <Ionicons
                      name={isFollowing ? "lock-closed" : "lock-open"}
                      size={16}
                      color="white"
                      style={styles.followIcon}
                    />
                    <Text style={styles.detailModalFollowButtonText}>{isFollowing ? "Private" : "Public"}</Text>
                  </TouchableOpacity>
                </View>

                {/* Quote Content */}
                {selectedQuote && (
                  <View style={styles.detailModalQuoteContainer}>
                    <Text style={styles.detailModalQuoteText}>"{selectedQuote.text}"</Text>
                    <Text style={styles.detailModalAuthorText}>- {selectedQuote.author}</Text>
                    <Text style={styles.detailModalDate}>{selectedQuote.date}</Text>
                  </View>
                )}

                {/* Action Buttons */}
                {selectedQuote && (
                  <View style={styles.detailModalActionButtons}>
                    <TouchableOpacity
                      onPress={() => selectedQuote && shareQuote(selectedQuote)}
                      style={styles.detailModalActionButton}
                    >
                      <Ionicons name="share-outline" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedQuote) {
                          toggleLike(selectedQuote.id)
                        }
                      }}
                      style={styles.detailModalActionButton}
                    >
                      <Ionicons
                        name={likedQuotes[selectedQuote.id] ? "heart" : "heart-outline"}
                        size={28}
                        color={likedQuotes[selectedQuote.id] ? "#FF6B8E" : "white"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedQuote) {
                          toggleSave(selectedQuote.id)
                        }
                      }}
                      style={styles.detailModalActionButton}
                    >
                      <Ionicons
                        name={savedQuotes[selectedQuote.id] ? "bookmark" : "bookmark-outline"}
                        size={28}
                        color={savedQuotes[selectedQuote.id] ? "#A78BFA" : "white"}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Page Indicator */}
                <View style={styles.detailModalPageIndicator}>
                  <View style={styles.detailModalIndicatorLine} />
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
    flex: 1,
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
  followButton: {
    flexDirection: "row",
    alignItems: "center",
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
  followIcon: {
    marginRight: 6,
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
    paddingHorizontal: 16,
  },
  quotesList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  quoteCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
    color: "#fff",
    marginTop: 8,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  quoteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  quoteDate: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  quoteActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
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
  addButton: {
    backgroundColor: "white",
    borderRadius: 30,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 30,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "#1E2A38",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
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
  modalBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  modalOverlay: {
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
    fontSize: 16,
    marginLeft: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  modalHeaderRight: {
    width: 60,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  quoteInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    color: "white",
    fontSize: 16,
    padding: 16,
    minHeight: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  authorInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    color: "white",
    fontSize: 16,
    padding: 16,
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  charCount: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    textAlign: 'right',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#222",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // Quote Detail Modal Styles
  detailModalBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  detailModalOverlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  detailModalContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  detailModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  detailModalBackButton: {
    padding: 5,
  },
  detailModalHeaderTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  detailModalFollowButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  detailModalFollowButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  detailModalQuoteContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  detailModalQuoteText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    lineHeight: 38,
    fontStyle: 'italic',
  },
  detailModalAuthorText: {
    fontSize: 20,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 20,
    textAlign: "center",
    fontWeight: '500',
  },
  detailModalDate: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 10,
    textAlign: "center",
  },
  detailModalActionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  detailModalActionButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
  },
  detailModalPageIndicator: {
    alignItems: "center",
    paddingBottom: 20,
  },
  detailModalIndicatorLine: {
    width: 60,
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 3,
  },
})