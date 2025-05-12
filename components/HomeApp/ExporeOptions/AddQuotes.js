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
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

export default function MyOwnQuotesScreen({ navigation }) {
  // State for quotes
  const [quotes, setQuotes] = useState([])
  const [filteredQuotes, setFilteredQuotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

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

  // Filter quotes based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredQuotes(quotes)
    } else {
      const filtered = quotes.filter(
        (quote) =>
          quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          quote.author.toLowerCase().includes(searchQuery.toLowerCase()),
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
      author: newAuthor.trim() === "" ? "Anonymous" : newAuthor,
      date: formattedDate,
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
          // If the deleted quote is currently selected in the modal, close the modal
          if (selectedQuote && selectedQuote.id === quoteId) {
            setQuoteDetailVisible(false)
          }
        },
        style: "destructive",
      },
    ])
  }

  // Toggle like status for a quote
  const toggleLike = (quoteId) => {
    setLikedQuotes((prev) => ({
      ...prev,
      [quoteId]: !prev[quoteId],
    }))
  }

  // Toggle save status for a quote
  const toggleSave = (quoteId) => {
    setSavedQuotes((prev) => ({
      ...prev,
      [quoteId]: !prev[quoteId],
    }))
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

  // Render a quote item
  const renderQuoteItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => openQuoteDetail(item)}>
      <View style={styles.quoteCard}>
        <View style={styles.quoteHeader}>
          <Text style={styles.quoteText}>{item.text}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteQuote(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#fff" />
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
      </View>
    </TouchableOpacity>
  )

  return (
    <ImageBackground
      // Replace this with your actual background image
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
              <Text style={styles.headerTitle}>My Quotes</Text>
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
              <Text style={styles.followButtonText}>{isFollowing ? "Following" : "Follow"}</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#cccc"
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
          {filteredQuotes.length > 0 ? (
            <FlatList
              data={filteredQuotes}
              renderItem={renderQuoteItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.quotesList}
            />
          ) : (
            <ScrollView style={styles.content}>
              <View style={styles.emptyState}>
                <Ionicons name="create-outline" size={64} color="rgba(255,255,255,0.3)" />
                <Text style={styles.emptyStateTitle}>No quotes yet</Text>
                <Text style={styles.emptyStateText}>
                  Create your own inspirational quotes and save them here for daily motivation.
                </Text>
              </View>
            </ScrollView>
          )}

          {/* Add Quote Button */}
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
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
              <View style={styles.modalContent}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity style={styles.modalBackButton} onPress={() => setModalVisible(false)}>
                    <Ionicons name="chevron-back" size={28} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Add Quote</Text>
                  <View style={styles.modalHeaderRight} />
                </View>

                {/* Modal Description */}
                <Text style={styles.modalDescription}>Add your own quote. It will only be visible to you.</Text>

                {/* Quote Input */}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.quoteInput}
                    placeholder="Quote"
                    placeholderTextColor="#ccc"
                    multiline
                    value={newQuote}
                    onChangeText={setNewQuote}
                  />
                </View>

                {/* Author Input */}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.authorInput}
                    placeholder="Author (optional)"
                    placeholderTextColor="#ccc"
                    value={newAuthor}
                    onChangeText={setNewAuthor}
                  />
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  style={[styles.saveButton, newQuote.trim() === "" && styles.disabledButton]}
                  onPress={handleAddQuote}
                  disabled={newQuote.trim() === ""}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
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
            // Replace this with your imported image
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
                    <Text style={styles.detailModalFollowButtonText}>{isFollowing ? "Following" : "Follow"}</Text>
                  </TouchableOpacity>
                </View>

                {/* Quote Content */}
                {selectedQuote && (
                  <View style={styles.detailModalQuoteContainer}>
                    <Text style={styles.detailModalQuoteText}>{selectedQuote.text}</Text>
                    <Text style={styles.detailModalAuthorText}>- {selectedQuote.author}</Text>
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
    backgroundColor: "rgba(167, 139, 250, 0)",
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
    color: "#fff",
    marginTop: 8,
    marginBottom: 12,
  },
  quoteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  quoteDate: {
    fontSize: 14,
    color: "#fff",
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
  },
  addButton: {
    backgroundColor: "white",
    borderRadius: 30,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 30,
    alignItems: "center",
  },
  addButtonText: {
    color: "#1E2A38",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#222", // Keep the solid background for the modal
  },
  modalContent: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 70,
  },
  modalBackButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  modalHeaderRight: {
    width: 60, // To balance the header
  },
  modalDescription: {
    fontSize: 16,
    color: "white",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  inputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  quoteInput: {
    color: "white",
    fontSize: 16,
    paddingVertical: 12,
    minHeight: 100,
    textAlignVertical: "top",
  },
  authorInput: {
    color: "white",
    fontSize: 16,
    paddingVertical: 12,
    height: 44,
  },
  saveButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 400,
    alignItems: "center",
    bottom: 0,
  },
  disabledButton: {
    opacity: 1,
  },
  saveButtonText: {
    color: "#222",
    fontSize: 16,
    fontWeight: "bold",
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
  },
  detailModalAuthorText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 20,
    textAlign: "center",
  },
  detailModalActionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
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