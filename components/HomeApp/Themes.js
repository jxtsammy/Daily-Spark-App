import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  FlatList,
  StatusBar,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import PremiumModal from './PremiumModal';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 3;
const ITEM_HEIGHT = ITEM_WIDTH * 1.6;

// Generate color themes
const generateColorThemes = () => {
  return [
    // Original colors
    {
      id: 'color-1',
      name: 'Light Cream',
      type: 'color',
      value: '#F5F5F0',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-2',
      name: 'Deep Black',
      type: 'color',
      value: '#121212',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-3',
      name: 'Soft Blue',
      type: 'color',
      value: '#E0F7FA',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-4',
      name: 'Lavender',
      type: 'color',
      value: '#E6E6FA',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-5',
      name: 'Mint Green',
      type: 'color',
      value: '#E0F2F1',
      isPremium: false,
      isGradient: false,
    },
    // 15 additional solid colors
    {
      id: 'color-6',
      name: 'Coral',
      type: 'color',
      value: '#FF7F50',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-7',
      name: 'Teal',
      type: 'color',
      value: '#008080',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-8',
      name: 'Slate Gray',
      type: 'color',
      value: '#708090',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-9',
      name: 'Dusty Rose',
      type: 'color',
      value: '#DCAE96',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-10',
      name: 'Sage Green',
      type: 'color',
      value: '#B2AC88',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-11',
      name: 'Powder Blue',
      type: 'color',
      value: '#B0E0E6',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-12',
      name: 'Terracotta',
      type: 'color',
      value: '#E2725B',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-13',
      name: 'Olive',
      type: 'color',
      value: '#808000',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-14',
      name: 'Mauve',
      type: 'color',
      value: '#E0B0FF',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-15',
      name: 'Navy Blue',
      type: 'color',
      value: '#000080',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-16',
      name: 'Burgundy',
      type: 'color',
      value: '#800020',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-17',
      name: 'Forest Green',
      type: 'color',
      value: '#228B22',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-18',
      name: 'Mustard',
      type: 'color',
      value: '#FFDB58',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-19',
      name: 'Charcoal',
      type: 'color',
      value: '#36454F',
      isPremium: false,
      isGradient: false,
    },
    {
      id: 'color-20',
      name: 'Blush Pink',
      type: 'color',
      value: '#FFB6C1',
      isPremium: false,
      isGradient: false,
    },
    // Gradient themes
    {
      id: 'gradient-1',
      name: 'Sunset',
      type: 'gradient',
      value: ['#FF512F', '#F09819'],
      isPremium: true,
      isGradient: true,
    },
    {
      id: 'gradient-2',
      name: 'Ocean Blue',
      type: 'gradient',
      value: ['#2E3192', '#1BFFFF'],
      isPremium: true,
      isGradient: true,
    },
    {
      id: 'gradient-3',
      name: 'Purple Haze',
      type: 'gradient',
      value: ['#8E2DE2', '#4A00E0'],
      isPremium: true,
      isGradient: true,
    },
    {
      id: 'gradient-4',
      name: 'Emerald',
      type: 'gradient',
      value: ['#43C6AC', '#191654'],
      isPremium: true,
      isGradient: true,
    },
    {
      id: 'gradient-5',
      name: 'Peach',
      type: 'gradient',
      value: ['#FFB88C', '#DE6262'],
      isPremium: true,
      isGradient: true,
    },
    {
      id: 'gradient-6',
      name: 'Moonlight',
      type: 'gradient',
      value: ['#0F2027', '#203A43', '#2C5364'],
      isPremium: true,
      isGradient: true,
    },
    {
      id: 'gradient-7',
      name: 'Calm Dawn',
      type: 'gradient',
      value: ['#F3F9A7', '#CAC531'],
      isPremium: true,
      isGradient: true,
    },
    {
      id: 'gradient-8',
      name: 'Royal Purple',
      type: 'gradient',
      value: ['#834D9B', '#D04ED6'],
      isPremium: true,
      isGradient: true,
    },
    {
      id: 'gradient-9',
      name: 'Soft Peach',
      type: 'gradient',
      value: ['#FFC3A0', '#FFAFBD'],
      isPremium: true,
      isGradient: true,
    },
    {
      id: 'gradient-10',
      name: 'Deep Ocean',
      type: 'gradient',
      value: ['#4B79A1', '#283E51'],
      isPremium: true,
      isGradient: true,
    },
  ];
};

// Generate image themes
const generateImageThemes = () => {
  return [
    {
      id: 'image-1',
      name: 'Sunset Beach',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      isPremium: false,
    },
    {
      id: 'image-2',
      name: 'Forest Path',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1448375240586-882707db888b',
      isPremium: false,
    },
    {
      id: 'image-3',
      name: 'Mountain View',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
      isPremium: false,
    },
    {
      id: 'image-4',
      name: 'Calm Lake',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1552083375-1447ce886485',
      isPremium: false,
    },
    // Pattern designs from Unsplash (free) - replacing Pinterest images
    {
      id: 'pattern-1',
      name: 'Geometric Pattern',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3',
      isPremium: false,
    },
    {
      id: 'pattern-2',
      name: 'Marble Texture',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1517329782449-810562a4ec2f',
      isPremium: false,
    },
    {
      id: 'pattern-3',
      name: 'Abstract Waves',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1',
      isPremium: false,
    },
    {
      id: 'pattern-4',
      name: 'Minimal Lines',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1544280500-7a40e2bfd4cb',
      isPremium: false,
    },
    {
      id: 'pattern-5',
      name: 'Watercolor Splash',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1550537687-c91072c4792d',
      isPremium: false,
    },
    // Premium image themes
    {
      id: 'image-5',
      name: 'Starry Night',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
      isPremium: true,
    },
    {
      id: 'image-6',
      name: 'Desert Dunes',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0',
      isPremium: true,
    },
    {
      id: 'image-7',
      name: 'Autumn Path',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6',
      isPremium: true,
    },
    {
      id: 'image-8',
      name: 'Ocean Waves',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0',
      isPremium: true,
    },
    {
      id: 'image-9',
      name: 'Lavender Field',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec',
      isPremium: true,
    },
    {
      id: 'image-10',
      name: 'Misty Forest',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
      isPremium: true,
    },
    {
      id: 'image-11',
      name: 'Cherry Blossoms',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1522383225653-ed111181a951',
      isPremium: true,
    },
    {
      id: 'image-12',
      name: 'Snowy Mountains',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5',
      isPremium: true,
    },
    {
      id: 'image-13',
      name: 'Tropical Beach',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a',
      isPremium: true,
    },
    {
      id: 'image-14',
      name: 'Waterfall',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1467890947394-8171244e5410',
      isPremium: true,
    },
    {
      id: 'image-15',
      name: 'Northern Lights',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7',
      isPremium: true,
    },
  ];
};

// Theme mixes - curated collections with filter functionality
const themeMixes = [
  {
    id: 'all',
    name: 'All Themes',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    icon: 'color-palette',
    filter: 'all'
  },
  {
    id: 'free',
    name: 'Free Themes',
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
    icon: 'star',
    filter: 'free'
  },
  {
    id: 'popular',
    name: 'Popular',
    image: 'https://images.unsplash.com/photo-1507371341162-763b5e419408',
    icon: 'sparkles',
    filter: 'popular'
  },
  {
    id: 'random',
    name: 'Random Mix',
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900',
    icon: 'shuffle',
    filter: 'random'
  },
  {
    id: 'new',
    name: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    icon: 'time',
    filter: 'new'
  },
  {
    id: 'colors',
    name: 'Solid Colors',
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85',
    icon: 'water',
    filter: 'colors'
  },
  {
    id: 'gradients',
    name: 'Gradients',
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    icon: 'layers',
    filter: 'gradients'
  },
  {
    id: 'images',
    name: 'Images',
    image: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a',
    icon: 'image',
    filter: 'images'
  },
  {
    id: 'create',
    name: 'Create Your Own',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
    icon: 'add',
    filter: 'create'
  },
];

export default function ThemesModal({ visible, onClose, currentTheme, onThemeChange, isPremiumUser = false }) {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [themeChanged, setThemeChanged] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [focusedFeature, setFocusedFeature] = useState('');

  // Initialize themes
  useEffect(() => {
    const colorThemes = generateColorThemes();
    const imageThemes = generateImageThemes();
    setThemes([...colorThemes, ...imageThemes]);
  }, []);

  // Reset selected theme when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedTheme(currentTheme);
      setThemeChanged(false);
    }
  }, [visible, currentTheme]);

  // Handle theme selection
  const handleThemeSelect = (theme) => {
    // If theme is premium and user is not premium, show premium modal
    if (theme.isPremium && !isPremiumUser) {
      setFocusedFeature(theme.name);
      setShowPremiumModal(true);
      return;
    }

    setSelectedTheme(theme);
    setThemeChanged(true);
  };

  // Apply theme change
  const applyThemeChange = () => {
    onThemeChange(selectedTheme);
    onClose();
  };

  // Filter themes based on active filter
  const getFilteredThemes = () => {
    switch (activeFilter) {
      case 'all':
        return themes;
      case 'free':
        return themes.filter(theme => !theme.isPremium);
      case 'random':
        // Shuffle and return all themes
        return [...themes].sort(() => 0.5 - Math.random());
      case 'new':
        // Return last 6 themes (simulating new themes)
        return themes.slice(-6);
      case 'popular':
        // Return a mix of themes (simulating popular themes)
        return [...themes].sort(() => 0.3 - Math.random()).slice(0, 12);
      case 'colors':
        // Return only solid color themes
        return themes.filter(theme => theme.type === 'color' && !theme.isGradient);
      case 'gradients':
        // Return only gradient themes
        return themes.filter(theme => theme.isGradient);
      case 'images':
        // Return only image themes
        return themes.filter(theme => theme.type === 'image');
      case 'create':
        // For now, just return a few themes as examples
        return themes.slice(0, 3);
      default:
        return themes;
    }
  };

  // Render theme item
  const renderThemeItem = ({ item, index }) => {
    const isSelected = selectedTheme && selectedTheme.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.themeItem,
          isSelected && styles.selectedThemeItem,
          // Handle spacing for 3 columns
          {
            marginLeft: index % 3 === 0 ? 0 : 5,
            marginRight: index % 3 === 2 ? 0 : 5,
          }
        ]}
        onPress={() => handleThemeSelect(item)}
      >
        {/* Theme preview */}
        {item.type === 'color' && !item.isGradient && (
          <View style={[styles.themePreview, { backgroundColor: item.value }]}>
            <Text style={[styles.previewText, { color: item.value === '#121212' ? '#FFFFFF' : '#000000' }]}>Aa</Text>
          </View>
        )}

        {item.type === 'gradient' && (
          <LinearGradient
            colors={item.value}
            style={styles.themePreview}
          >
            <Text style={styles.previewText}>Aa</Text>
          </LinearGradient>
        )}

        {item.type === 'image' && (
          <ImageBackground
            source={{ uri: item.value }}
            style={styles.themePreview}
            resizeMode="cover"
          >
            <View style={styles.imageOverlay}>
              <Text style={styles.previewText}>Aa</Text>
            </View>
          </ImageBackground>
        )}

        {/* Premium lock icon */}
        {item.isPremium && !isPremiumUser && (
          <View style={styles.lockIconContainer}>
            <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
          </View>
        )}

        {/* Selected checkmark */}
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark" size={16} color="#222" />
          </View>
        )}

        {/* Edit button for selected theme (only shown for the first theme as an example) */}
        {isSelected && item.id === 'color-1' && (
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  // Render theme mix item
  const renderThemeMixItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.themeMixItem,
        activeFilter === item.filter && styles.activeThemeMixItem
      ]}
      onPress={() => setActiveFilter(item.filter)}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.themeMixImage}
        resizeMode="cover"
      >
        <View style={[
          styles.themeMixOverlay,
          activeFilter === item.filter && styles.activeThemeMixOverlay
        ]}>
          <View style={styles.themeMixIconContainer}>
            <Ionicons name={item.icon} size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.themeMixText}>{item.name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  // Create header component for the main FlatList
  const ListHeaderComponent = () => (
    <View>
      {/* Theme mixes section */}
      <Text style={styles.sectionTitle}>Categories</Text>

      <FlatList
        data={themeMixes}
        renderItem={renderThemeMixItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.themeMixesContainer}
      />

      {/* Filtered themes section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {themeMixes.find(mix => mix.filter === activeFilter)?.name || 'For you'}
        </Text>
        {activeFilter !== 'all' && (
          <TouchableOpacity onPress={() => setActiveFilter('all')}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1A2235" />

        {/* Header - Repositioned title next to X icon */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Themes</Text>
          </View>

          <TouchableOpacity
            style={styles.unlockButton}
            onPress={() => {
              setFocusedFeature('All Themes');
              setShowPremiumModal(true);
            }}
          >
            <Text style={styles.unlockButtonText}>Unlock all</Text>
          </TouchableOpacity>
        </View>

        {/* Main FlatList with header - this replaces the ScrollView */}
        <FlatList
          data={getFilteredThemes()}
          renderItem={renderThemeItem}
          keyExtractor={item => item.id}
          numColumns={3}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          key={activeFilter} // Force re-render when filter changes
        />

        {/* Apply theme button - only show if theme has changed */}
        {themeChanged && (
          <TouchableOpacity
            style={styles.applyButton}
            onPress={applyThemeChange}
          >
            <Text style={styles.applyButtonText}>Apply Theme</Text>
          </TouchableOpacity>
        )}

        {/* Premium Modal */}
        <PremiumModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          focusedFeature={focusedFeature}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 70 : 20,
    paddingBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  unlockButton: {
    paddingVertical: 5,
  },
  unlockButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  themeMixesContainer: {
    paddingBottom: 10,
  },
  themeMixItem: {
    width: width * 0.35,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 10,
  },
  activeThemeMixItem: {
    borderWidth: 2,
    borderColor: '#8A65C5',
  },
  themeMixImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeMixOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  activeThemeMixOverlay: {
    backgroundColor: 'rgba(138, 101, 197, 0.6)',
  },
  themeMixIconContainer: {
    marginBottom: 8,
  },
  themeMixText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  themeItem: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedThemeItem: {
    borderWidth: 2,
    borderColor: 'white',
  },
  themePreview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  lockIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  editButtonText: {
    color: '#1A2235',
    fontWeight: 'bold',
    fontSize: 14,
  },
  applyButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#222',
    fontSize: 18,
    fontWeight: 'bold',
  },
});