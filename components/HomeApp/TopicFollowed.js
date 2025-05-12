"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
  ImageBackground,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { LinearGradient } from "expo-linear-gradient"
import { Crown } from "lucide-react-native"
import PremiumModal from "./PremiumModal" // Import the PremiumModal component

const { width, height } = Dimensions.get("window")

// Topic sections data
const topicSections = [
  {
    title: "Most Popular",
    isPremium: false,
    showFollowAll: true,
    topics: [
      { id: 5, name: "Self-Worth", isPremium: true, isFollowing: false },
      { id: 6, name: "Money And Wealth", isPremium: true, isFollowing: false },
      { id: 7, name: "Affirmations", isPremium: true, isFollowing: false },
      { id: 8, name: "Mental Toughness", isPremium: false, isFollowing: false },
      { id: 9, name: "Love", isPremium: true, isFollowing: false },
      { id: 10, name: "Breaking Barriers", isPremium: true, isFollowing: false },
    ]
  },
  {
    title: "Personal Growth",
    isPremium: true,
    topics: [
      { id: 11, name: "Self-Esteem", isPremium: true, isFollowing: false },
      { id: 12, name: "Self-Development", isPremium: true, isFollowing: false },
      { id: 13, name: "Start Change", isPremium: true, isFollowing: false },
      { id: 14, name: "Feeling Blessed", isPremium: true, isFollowing: false },
      { id: 15, name: "Be Strong", isPremium: true, isFollowing: false },
      { id: 16, name: "Accept Yourself", isPremium: true, isFollowing: false },
      { id: 17, name: "Positive Thinking", isPremium: true, isFollowing: false },
      { id: 18, name: "Happiness", isPremium: true, isFollowing: false },
      { id: 19, name: "Growth", isPremium: true, isFollowing: false },
      { id: 20, name: "Self-Love", isPremium: true, isFollowing: false },
      { id: 21, name: "New Beginnings", isPremium: true, isFollowing: false },
      { id: 22, name: "Gratitude", isPremium: true, isFollowing: false },
      { id: 23, name: "Moving On", isPremium: true, isFollowing: false },
      { id: 24, name: "Letting Go", isPremium: true, isFollowing: false },
      { id: 25, name: "Be Yourself", isPremium: true, isFollowing: false },
      { id: 26, name: "Finding Purpose", isPremium: true, isFollowing: false },
      { id: 27, name: "Self-Respect", isPremium: true, isFollowing: false },
      { id: 28, name: "Ego", isPremium: true, isFollowing: false },
      { id: 29, name: "Optimism", isPremium: true, isFollowing: false },
      { id: 30, name: "Psychology", isPremium: true, isFollowing: false },
      { id: 31, name: "Dream Big", isPremium: true, isFollowing: false },
      { id: 32, name: "Mental Health", isPremium: true, isFollowing: false },
      { id: 33, name: "Being Present", isPremium: true, isFollowing: false },
      { id: 34, name: "Life Balance", isPremium: true, isFollowing: false },
      { id: 35, name: "Making Decisions", isPremium: true, isFollowing: false },
      { id: 36, name: "Start Your Day", isPremium: true, isFollowing: false },
      { id: 37, name: "Self Worth", isPremium: true, isFollowing: false },
      { id: 38, name: "Visionary Thinkers", isPremium: true, isFollowing: false },
    ]
  },
  {
    title: "Hard Times",
    isPremium: true,
    topics: [
      { id: 39, name: "Overthinking", isPremium: true, isFollowing: false },
      { id: 40, name: "Missing Someone", isPremium: true, isFollowing: false },
      { id: 41, name: "Haters", isPremium: true, isFollowing: false },
      { id: 42, name: "Toxic Relationships", isPremium: true, isFollowing: false },
      { id: 43, name: "Death", isPremium: true, isFollowing: false },
      { id: 44, name: "Depression", isPremium: true, isFollowing: false },
      { id: 45, name: "Loneliness", isPremium: true, isFollowing: false },
      { id: 46, name: "Dealing With Change", isPremium: true, isFollowing: false },
      { id: 47, name: "Unrequired Love", isPremium: true, isFollowing: false },
      { id: 48, name: "Uncertainty", isPremium: true, isFollowing: false },
      { id: 49, name: "Sadness", isPremium: true, isFollowing: false },
      { id: 50, name: "Heartbroken", isPremium: true, isFollowing: false },
      { id: 51, name: "Breakup", isPremium: true, isFollowing: false },
      { id: 52, name: "Resilience", isPremium: true, isFollowing: false },
      { id: 53, name: "Bipolar Disorder", isPremium: true, isFollowing: false },
      { id: 54, name: "Addiction Disorder", isPremium: true, isFollowing: false },
      { id: 55, name: "Autism", isPremium: true, isFollowing: false },
      { id: 56, name: "ADHD", isPremium: true, isFollowing: false },
      { id: 57, name: "Post-Traumatic Stress", isPremium: true, isFollowing: false },
    ]
  },
  {
    title: "Relationships",
    isPremium: true,
    topics: [
      { id: 58, name: "Forgiveness", isPremium: true, isFollowing: false },
      { id: 59, name: "Trust", isPremium: true, isFollowing: false },
      { id: 60, name: "Relationships", isPremium: true, isFollowing: false },
      { id: 61, name: "Social Anxiety", isPremium: true, isFollowing: false },
      { id: 62, name: "Introvert", isPremium: true, isFollowing: false },
      { id: 63, name: "Unconditional Love", isPremium: true, isFollowing: false },
      { id: 64, name: "Marriage", isPremium: true, isFollowing: false },
      { id: 65, name: "Cheating", isPremium: true, isFollowing: false },
      { id: 66, name: "Friendship", isPremium: true, isFollowing: false },
      { id: 67, name: "Loyalty", isPremium: true, isFollowing: false },
      { id: 68, name: "Distance", isPremium: true, isFollowing: false },
      { id: 69, name: "Love", isPremium: true, isFollowing: false },
      { id: 70, name: "Falling In Love", isPremium: true, isFollowing: false },
      { id: 71, name: "Honesty", isPremium: true, isFollowing: false },
      { id: 72, name: "Fake People", isPremium: true, isFollowing: false },
      { id: 73, name: "Family", isPremium: true, isFollowing: false },
      { id: 74, name: "Listening", isPremium: true, isFollowing: false },
      { id: 75, name: "Setting Boundaries", isPremium: true, isFollowing: false },
    ]
  },
  {
    title: "Work & Productivity",
    isPremium: true,
    topics: [
      { id: 76, name: "Success", isPremium: true, isFollowing: false },
      { id: 77, name: "Passion", isPremium: true, isFollowing: false },
      { id: 78, name: "Money And Wealth", isPremium: true, isFollowing: false },
      { id: 79, name: "Business", isPremium: true, isFollowing: false },
      { id: 80, name: "Leadership", isPremium: true, isFollowing: false },
      { id: 81, name: "Hustling", isPremium: true, isFollowing: false },
      { id: 82, name: "Work", isPremium: true, isFollowing: false },
      { id: 83, name: "Discipline", isPremium: true, isFollowing: false },
      { id: 84, name: "Routine", isPremium: true, isFollowing: false },
      { id: 85, name: "Entrepreneurs", isPremium: true, isFollowing: false },
      { id: 86, name: "Productivity", isPremium: true, isFollowing: false },
      { id: 87, name: "Focus", isPremium: true, isFollowing: false },
      { id: 88, name: "Study", isPremium: true, isFollowing: false },
      { id: 89, name: "Making Decisions", isPremium: true, isFollowing: false },
      { id: 90, name: "Building Habits", isPremium: true, isFollowing: false },
      { id: 91, name: "Consistency", isPremium: true, isFollowing: false },
    ]
  },
  {
    title: "Inspiration",
    isPremium: true,
    topics: [
      { id: 92, name: "Short Quotes", isPremium: true, isFollowing: false },
      { id: 93, name: "Proverbs", isPremium: true, isFollowing: false },
      { id: 94, name: "Funny", isPremium: true, isFollowing: false },
      { id: 95, name: "African-American", isPremium: true, isFollowing: false },
      { id: 96, name: "Future", isPremium: true, isFollowing: false },
      { id: 97, name: "Beauty", isPremium: true, isFollowing: false },
      { id: 98, name: "Passion", isPremium: true, isFollowing: false },
      { id: 99, name: "Encouraging Words", isPremium: true, isFollowing: false },
      { id: 100, name: "Feeling Sassy", isPremium: true, isFollowing: false },
      { id: 101, name: "Sayings", isPremium: true, isFollowing: false },
      { id: 102, name: "Feeling Blessed", isPremium: true, isFollowing: false },
      { id: 103, name: "LGBTQ+", isPremium: true, isFollowing: false },
      { id: 104, name: "Sarcastic", isPremium: true, isFollowing: false },
      { id: 105, name: "Dream Big", isPremium: true, isFollowing: false },
      { id: 106, name: "Breaking Barriers", isPremium: true, isFollowing: false },
    ]
  },
  {
    title: "Spiritual & Philosophy",
    isPremium: true,
    topics: [
      { id: 107, name: "Life", isPremium: true, isFollowing: false },
      { id: 108, name: "Karma", isPremium: true, isFollowing: false },
      { id: 109, name: "Mindfulness", isPremium: true, isFollowing: false },
      { id: 110, name: "Loving Kindness", isPremium: true, isFollowing: false },
      { id: 111, name: "Mantras", isPremium: true, isFollowing: false },
      { id: 112, name: "Wisdom", isPremium: true, isFollowing: false },
      { id: 113, name: "Stoicism", isPremium: true, isFollowing: false },
      { id: 114, name: "God", isPremium: true, isFollowing: false },
      { id: 115, name: "Feeling Blessed", isPremium: true, isFollowing: false },
      { id: 116, name: "Faith", isPremium: true, isFollowing: false },
      { id: 117, name: "Hope", isPremium: true, isFollowing: false },
      { id: 118, name: "Bible Verses", isPremium: true, isFollowing: false },
      { id: 119, name: "Philosophy", isPremium: true, isFollowing: false },
      { id: 120, name: "Zen", isPremium: true, isFollowing: false },
      { id: 121, name: "Devotions", isPremium: true, isFollowing: false },
      { id: 122, name: "Deep", isPremium: true, isFollowing: false },
      { id: 123, name: "Christianity", isPremium: true, isFollowing: false },
      { id: 124, name: "Universe", isPremium: true, isFollowing: false },
    ]
  },
  {
    title: "Calm Down",
    isPremium: true,
    topics: [
      { id: 125, name: "Mindfulness", isPremium: true, isFollowing: false },
      { id: 126, name: "Calm", isPremium: true, isFollowing: false },
      { id: 127, name: "Enjoy The Moment", isPremium: true, isFollowing: false },
      { id: 128, name: "Sleep", isPremium: true, isFollowing: false },
      { id: 129, name: "Managing Anxiety", isPremium: true, isFollowing: false },
      { id: 130, name: "Inner Peace", isPremium: true, isFollowing: false },
      { id: 131, name: "Patience", isPremium: true, isFollowing: false },
      { id: 132, name: "Stress", isPremium: true, isFollowing: false },
      { id: 133, name: "Smile", isPremium: true, isFollowing: false },
      { id: 134, name: "Appreciation", isPremium: true, isFollowing: false },
      { id: 135, name: "Life Balance", isPremium: true, isFollowing: false },
    ]
  },
  {
    title: "Health & Fitness",
    isPremium: true,
    topics: [
      { id: 136, name: "Work Out", isPremium: true, isFollowing: false },
      { id: 137, name: "Strength", isPremium: true, isFollowing: false },
      { id: 138, name: "Health", isPremium: true, isFollowing: false },
      { id: 139, name: "Weight Loss", isPremium: true, isFollowing: false },
      { id: 140, name: "Fitness", isPremium: true, isFollowing: false },
      { id: 141, name: "No Excuses", isPremium: true, isFollowing: false },
      { id: 142, name: "Body Positivity", isPremium: true, isFollowing: false },
      { id: 143, name: "Training", isPremium: true, isFollowing: false },
      { id: 144, name: "Before A Game", isPremium: true, isFollowing: false },
      { id: 145, name: "Mental Toughness", isPremium: true, isFollowing: false },
    ]
  },
  {
    title: "Tips",
    isPremium: true,
    topics: [
      { id: 146, name: "Life Lessons", isPremium: true, isFollowing: false },
      { id: 147, name: "Mental Exercise", isPremium: true, isFollowing: false },
      { id: 148, name: "Tips To Stay Motivated", isPremium: true, isFollowing: false },
      { id: 149, name: "Tips To Be Happy", isPremium: true, isFollowing: false },
      { id: 150, name: "Tips To Find Inspiration", isPremium: true, isFollowing: false },
      { id: 151, name: "Tips To Get Over Anxiety", isPremium: true, isFollowing: false },
    ]
  },
  {
    title: "Zodiac Signs",
    isPremium: true,
    topics: [
      { id: 152, name: "Pisces", isPremium: true, isFollowing: false },
      { id: 153, name: "Gemini", isPremium: true, isFollowing: false },
      { id: 154, name: "Cancer", isPremium: true, isFollowing: false },
      { id: 155, name: "Leo", isPremium: true, isFollowing: false },
      { id: 156, name: "Virgo", isPremium: true, isFollowing: false },
      { id: 157, name: "Libra", isPremium: true, isFollowing: false },
      { id: 158, name: "Aries", isPremium: true, isFollowing: false },
      { id: 159, name: "Sagittarius", isPremium: true, isFollowing: false },
      { id: 160, name: "Scorpio", isPremium: true, isFollowing: false },
      { id: 161, name: "Taurus", isPremium: true, isFollowing: false },
      { id: 162, name: "Aquarius", isPremium: true, isFollowing: false },
      { id: 163, name: "Capricorn", isPremium: true, isFollowing: false },
    ]
  },
];

// General options data
const generalOptions = [
  { id: 1, name: "My favorites", icon: "heart-outline" },
  { id: 2, name: "My collections", icon: "albums-outline" },
  { id: 3, name: "My own quotes", icon: "create-outline" },
  { id: 4, name: "Recent quotes", icon: "time-outline" },
]

export default function TopicsScreen({ navigation, customBackgroundImage }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [topicData, setTopicData] = useState(topicSections)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [focusedTopic, setFocusedTopic] = useState("")

  // Handle search
  const handleSearch = (text) => {
    setSearchQuery(text)

    if (text.trim() === "") {
      setTopicData(topicSections)
      return
    }

    const filteredData = topicSections
      .map((section) => {
        const filteredTopics = section.topics.filter((topic) => topic.name.toLowerCase().includes(text.toLowerCase()))

        return {
          ...section,
          topics: filteredTopics,
        }
      })
      .filter((section) => section.topics.length > 0)

    setTopicData(filteredData)
  }

  // Toggle follow status
  const toggleFollow = (sectionIndex, topicIndex) => {
    const topic = topicData[sectionIndex].topics[topicIndex]

    // If premium topic, show premium modal
    if (topic.isPremium) {
      setFocusedTopic(topic.name)
      setShowPremiumModal(true)
      return
    }

    // Otherwise toggle follow status
    const updatedData = [...topicData]
    updatedData[sectionIndex].topics[topicIndex].isFollowing = !updatedData[sectionIndex].topics[topicIndex].isFollowing

    setTopicData(updatedData)
  }

  // Follow all topics in a section
  const followAllInSection = (sectionIndex) => {
    const updatedData = [...topicData]
    const section = updatedData[sectionIndex]

    // Only update non-premium topics
    section.topics.forEach((topic, index) => {
      if (!topic.isPremium) {
        section.topics[index].isFollowing = true
      }
    })

    setTopicData(updatedData)
  }

  // Render topic item
  const renderTopicItem = (topic, sectionIndex, topicIndex) => {
    return (
      <View style={styles.topicItem} key={topic.id}>
        <View style={styles.topicNameContainer}>
          <Text style={styles.topicName} numberOfLines={1} ellipsizeMode="tail">
            {topic.name}
          </Text>
          {topic.isPremium && <Ionicons name="lock-closed" size={20} color="#fff" style={styles.lockIcon} />}
        </View>

        <TouchableOpacity
          style={[styles.followButton, topic.isFollowing && styles.followingButton]}
          onPress={() => toggleFollow(sectionIndex, topicIndex)}
        >
          <Text style={[styles.followButtonText, topic.isFollowing && styles.followingButtonText]}>
            {topic.isFollowing ? "Unlocked" : "Unlock"}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Render section
  const renderSection = (section, index) => {
    if (section.topics.length === 0) return null

    return (
      <View key={section.title} style={styles.sectionContainer}>
        {/* Section header is now outside the section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.showFollowAll && (
            <TouchableOpacity onPress={() => followAllInSection(index)}>
              <Text style={styles.followAllText}>Follow all</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Section content */}
        <View style={styles.section}>
          <View style={styles.topicsList}>
            {section.topics.map((topic, topicIndex) => renderTopicItem(topic, index, topicIndex))}
          </View>
        </View>
      </View>
    )
  }

  // Render general option item
  const renderGeneralOption = (option) => {
  // Map option IDs to screen names
  const screenMap = {
    1: "Favorites",
    2: "MyCollections",
    3: "AddQuotes",
    4: "RecentQuotes"
  };

  return (
    <TouchableOpacity
      key={option.id}
      style={styles.generalOption}
      onPress={() => navigation.navigate(screenMap[option.id])}
    >
      <View style={styles.generalOptionContent}>
        <Text style={styles.generalOptionText}>{option.name}</Text>
        <Ionicons name={option.icon} size={24} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
};

  return (
    <ImageBackground
      source={require("../../assets/277a53bca9186d041a22a546a9b685cf.jpg")}
      style={styles.backgroundImage}
    >
      {/* Dark overlay */}
      <LinearGradient colors={["rgba(0, 0, 0, 0.85)", "rgba(0, 0, 0, 0.45)"]} style={styles.overlay}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Explore Topics</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#fff" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#fff"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={() => handleSearch("")}>
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Topics List */}
        <ScrollView style={styles.scrollView}>
          {/* White container for unlock all topics */}
          <View style={styles.unlockContainer}>
            {/* This will be replaced with a custom background image */}
            <ImageBackground
              source={customBackgroundImage}
              style={styles.unlockBackground}
              imageStyle={styles.unlockBackgroundImage}
            >
              <View style={styles.unlockOverlay}>
                <View style={styles.unlockContent}>
                  <View style={styles.unlockTextContainer}>
                    <Text style={styles.unlockTitle}>Unlock all topics</Text>
                    <Text style={styles.unlockSubtitle}>
                      Browse topics you're interested in and follow them to customize your feed
                    </Text>
                  </View>
                  <View style={styles.crownIconContainer}>
                    <Crown size={48} color="#222" />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* General options grid */}
          <View style={styles.generalOptionsContainer}>
            <View style={styles.generalOptionsGrid}>
              {generalOptions.map((option, index) => (
                <View key={option.id} style={styles.generalOptionWrapper}>
                  {renderGeneralOption(option)}
                </View>
              ))}
            </View>
          </View>

          {/* Topic sections */}
          {topicData.map((section, index) => renderSection(section, index))}
          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Premium Modal */}
        <PremiumModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          focusedTopic={focusedTopic}
        />
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
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 70 : 50,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginLeft: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    height: "100%",
  },
  clearButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // White container for "Unlock all topics"
  unlockContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    height: 120,
  },
  unlockBackground: {
    width: "100%",
    height: "100%",
  },
  unlockBackgroundImage: {
    borderRadius: 16,
  },
  unlockOverlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 20,
  },
  unlockContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  unlockTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  unlockTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  unlockSubtitle: {
    fontSize: 14,
    color: "#555",
    lineHeight: 18,
  },
  crownIconContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  // General options grid
  generalOptionsContainer: {
    marginBottom: 20,
  },
  generalOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  generalOptionWrapper: {
    width: "48%",
    marginBottom: 15,
  },
  generalOption: {
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    borderRadius: 16,
    padding: 20,
    height: 100,
    justifyContent: "center",
  },
  generalOptionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  generalOptionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    marginRight: 10,
  },
  // Topic sections
  sectionContainer: {
    marginBottom: 20,
  },
  section: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  followAllText: {
    fontSize: 14,
    color: "#A78BFA",
    fontWeight: "600",
  },
  topicsList: {
    paddingVertical: 5,
  },
  topicItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  topicNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  topicName: {
    fontSize: 18,
    color: "white",
    flex: 1,
  },
  lockIcon: {
    marginLeft: 8,
  },
  followButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  followingButton: {
    backgroundColor: "rgba(167, 139, 250, 0.3)",
    borderColor: "transparent",
  },
  followButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  followingButtonText: {
    color: "white",
  },
  bottomPadding: {
    height: 50,
  },
})