import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import PremiumModal from './PremiumModal';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 3;
const ITEM_HEIGHT = ITEM_WIDTH * 1.6;

// Enhanced image caching function with better error handling and quality control
const cacheImages = async (images) => {
  const cachePromises = images.map(async (imageUrl, index) => {
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) return null;
    
    // Add quality parameters to URLs that support them
    let optimizedUrl = imageUrl;
    if (imageUrl.includes('pexels.com')) {
      // Pexels images - ensure we get high quality but reasonable file size
      optimizedUrl = imageUrl.includes('?') 
        ? `${imageUrl}&auto=compress&cs=tinysrgb&w=800&dpr=2` 
        : `${imageUrl}?auto=compress&cs=tinysrgb&w=800&dpr=2`;
    }
    
    const fileName = `theme_image_${index}_${imageUrl.split('/').pop().split('?')[0]}`;
    const filePath = `${FileSystem.cacheDirectory}${fileName}`;
    
    try {
      const info = await FileSystem.getInfoAsync(filePath);
      if (info.exists) {
        return { uri: filePath };
      }
      
      // Download the image with timeout and error handling
      const downloadPromise = new Promise(async (resolve, reject) => {
        // Set a 10 second timeout
        const timeoutId = setTimeout(() => {
          reject(new Error('Image download timeout'));
        }, 10000);
        
        try {
          const downloadResumable = FileSystem.createDownloadResumable(
            optimizedUrl,
            filePath,
            {},
            (downloadProgress) => {
              const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
              // Could use this progress for a UI progress indicator
            }
          );
          
          const { uri } = await downloadResumable.downloadAsync();
          clearTimeout(timeoutId);
          resolve({ uri });
        } catch (e) {
          clearTimeout(timeoutId);
          reject(e);
        }
      });
      
      return await downloadPromise;
    } catch (e) {
      console.warn(`Error caching image ${imageUrl}:`, e);
      // Return the original URL as fallback
      return { uri: optimizedUrl };
    }
  });
  
  return Promise.all(cachePromises);
};

// Function to validate image URLs
const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.match(/\.(jpeg|jpg|gif|png)($|\?)/i) !== null || 
         url.includes('unsplash.com') || 
         url.includes('images.pexels.com');
};

// Generate color themes with transparency options
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
      opacity: 1.0,
    },
    {
      id: 'color-2',
      name: 'Deep Black',
      type: 'color',
      value: '#121212',
      isPremium: false,
      isGradient: false,
      opacity: 1.0,
    },
    {
      id: 'color-3',
      name: 'Soft Blue',
      type: 'color',
      value: '#E0F7FA',
      isPremium: false,
      isGradient: false,
      opacity: 1.0,
    },
    {
      id: 'color-4',
      name: 'Lavender',
      type: 'color',
      value: '#E6E6FA',
      isPremium: false,
      isGradient: false,
      opacity: 1.0,
    },
    {
      id: 'color-5',
      name: 'Mint Green',
      type: 'color',
      value: '#E0F2F1',
      isPremium: false,
      isGradient: false,
      opacity: 1.0,
    },
    // Transparent colors
    {
      id: 'color-trans-1',
      name: 'Light Cream (70%)',
      type: 'color',
      value: '#F5F5F0',
      isPremium: false,
      isGradient: false,
      opacity: 0.7,
    },
    {
      id: 'color-trans-2',
      name: 'Soft Blue (70%)',
      type: 'color',
      value: '#E0F7FA',
      isPremium: false,
      isGradient: false,
      opacity: 0.7,
    },
    {
      id: 'color-trans-3',
      name: 'Lavender (70%)',
      type: 'color',
      value: '#E6E6FA',
      isPremium: false,
      isGradient: false,
      opacity: 0.7,
    },
    {
      id: 'color-trans-4',
      name: 'Mint Green (70%)',
      type: 'color',
      value: '#E0F2F1',
      isPremium: false,
      isGradient: false,
      opacity: 0.7,
    },
    {
      id: 'color-trans-5',
      name: 'Light Gray (50%)',
      type: 'color',
      value: '#D3D3D3',
      isPremium: false,
      isGradient: false,
      opacity: 0.5,
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
  // Local assets for faster loading
  const localAssets = [
    {
      id: 'local-1',
      name: 'Local Image 1',
      type: 'image',
      value: require('../../assets/1.jpg'),
      isPremium: false,
      isLocal: true
    },
    {
      id: 'local-2',
      name: 'Local Image 2',
      type: 'image',
      value: require('../../assets/2.jpg'),
      isPremium: false,
      isLocal: true
    },
    {
      id: 'local-3',
      name: 'Local Image 3',
      type: 'image',
      value: require('../../assets/3.jpg'),
      isPremium: false,
      isLocal: true
    },
    {
      id: 'local-4',
      name: 'Local Image 4',
      type: 'image',
      value: require('../../assets/4.jpg'),
      isPremium: false,
      isLocal: true
    },
    {
      id: 'local-5',
      name: 'Local Image 7',
      type: 'image',
      value: require('../../assets/7.jpg'),
      isPremium: false,
      isLocal: true
    },
    {
      id: 'local-6',
      name: 'Local Image 8',
      type: 'image',
      value: require('../../assets/8.jpg'),
      isPremium: false,
      isLocal: true
    },
    {
      id: 'local-7',
      name: 'Local Image 10',
      type: 'image',
      value: require('../../assets/10.jpg'),
      isPremium: false,
      isLocal: true
    },
    {
      id: 'local-8',
      name: 'Local Image 11',
      type: 'image',
      value: require('../../assets/11.jpg'),
      isPremium: false,
      isLocal: true
    },
    {
      id: 'local-9',
      name: 'Background',
      type: 'image',
      value: require('../../assets/background.jpg'),
      isPremium: false,
      isLocal: true
    },
    {
      id: 'local-10',
      name: 'Background 2',
      type: 'image',
      value: require('../../assets/bg.jpg'),
      isPremium: false,
      isLocal: true
    },
  ];
  
  // Remote assets with optimized loading
  const remoteAssets = [
    {
      id: 'image-1',
      name: 'Sunset Beach',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&q=80',
      isPremium: false,
      isLocal: false
    },
    {
      id: 'image-2',
      name: 'Forest Path',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&q=80',
      isPremium: false,
      isLocal: false
    },
    {
      id: 'image-3',
      name: 'Mountain View',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&auto=format&q=80',
      isPremium: false,
      isLocal: false
    },
    {
      id: 'image-4',
      name: 'Calm Lake',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1552083375-1447ce886485?w=600&auto=format&q=80',
      isPremium: false,
      isLocal: false
    },
    // Pattern designs from Unsplash (free) - replacing Pinterest images
    {
      id: 'pattern-1',
      name: 'Geometric Pattern',
      type: 'image',
      value: 'https://images.pexels.com/photos/2693212/pexels-photo-2693212.png?auto=compress&cs=tinysrgb&w=800&dpr=2',
      isPremium: false,
      isLocal: false
    },
    {
      id: 'pattern-2',
      name: 'Marble Texture',
      type: 'image',
      value: 'https://images.pexels.com/photos/2341290/pexels-photo-2341290.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2',
      isPremium: false,
      isLocal: false
    },
    {
      id: 'pattern-3',
      name: 'Abstract Waves',
      type: 'image',
      value: 'https://images.pexels.com/photos/3109807/pexels-photo-3109807.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2',
      isPremium: false,
      isLocal: false
    },
    {
      id: 'pattern-4',
      name: 'Minimal Lines',
      type: 'image',
      value: 'https://images.pexels.com/photos/7130555/pexels-photo-7130555.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2',
      isPremium: false,
      isLocal: false
    },
    {
      id: 'pattern-5',
      name: 'Watercolor Splash',
      type: 'image',
      value: 'https://images.pexels.com/photos/5022847/pexels-photo-5022847.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=2',
      isPremium: false,
      isLocal: false
    },
    // Premium image themes
    {
      id: 'image-5',
      name: 'Starry Night',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-6',
      name: 'Desert Dunes',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-7',
      name: 'Autumn Path',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-8',
      name: 'Ocean Waves',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-9',
      name: 'Lavender Field',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-10',
      name: 'Misty Forest',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-11',
      name: 'Cherry Blossoms',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-12',
      name: 'Snowy Mountains',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-13',
      name: 'Tropical Beach',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-14',
      name: 'Waterfall',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1467890947394-8171244e5410?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-15',
      name: 'Northern Lights',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    // Additional premium nature themes
    {
      id: 'image-16',
      name: 'Golden Sunset',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-17',
      name: 'Misty Mountains',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-18',
      name: 'Tropical Paradise',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1520690214124-2405c5217036?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-19',
      name: 'Desert Night',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-20',
      name: 'Wheat Field',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-21',
      name: 'Coastal Cliffs',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-22',
      name: 'Cityscape',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-23',
      name: 'Calm Waters',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-24',
      name: 'Rainy Street',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1501180895265-c59bf9611e4d?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
    {
      id: 'image-25',
      name: 'Palm Beach',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc32?w=600&auto=format&q=80',
      isPremium: true,
      isLocal: false
    },
  ];
  
  return [...localAssets, ...popularFreeNatureImages, ...remoteAssets];
};

// Free nature images for popular category
const popularFreeNatureImages = [
  {
    id: 'free-nature-1',
    name: 'Mountain Lake',
    type: 'image',
    value: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=600',
    isPremium: false,
    isLocal: false,
    category: 'popular'
  },
  {
    id: 'free-nature-2',
    name: 'Forest Path',
    type: 'image',
    value: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600',
    isPremium: false,
    isLocal: false,
    category: 'popular'
  },
  {
    id: 'free-nature-3',
    name: 'Beach Sunset',
    type: 'image',
    value: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=600',
    isPremium: false,
    isLocal: false,
    category: 'popular'
  },
  {
    id: 'free-nature-4',
    name: 'Waterfall',
    type: 'image',
    value: 'https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=600',
    isPremium: false,
    isLocal: false,
    category: 'popular'
  },
  {
    id: 'free-nature-5',
    name: 'Spring Flowers',
    type: 'image',
    value: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=600',
    isPremium: false,
    isLocal: false,
    category: 'popular'
  },
  {
    id: 'free-nature-6',
    name: 'Autumn Trees',
    type: 'image',
    value: 'https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=600',
    isPremium: false,
    isLocal: false,
    category: 'popular'
  },
  {
    id: 'free-nature-7',
    name: 'Desert Landscape',
    type: 'image',
    value: 'https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg?auto=compress&cs=tinysrgb&w=600',
    isPremium: false,
    isLocal: false,
    category: 'popular'
  },
  {
    id: 'free-nature-8',
    name: 'Winter Forest',
    type: 'image',
    value: 'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg?auto=compress&cs=tinysrgb&w=600',
    isPremium: false,
    isLocal: false,
    category: 'popular'
  }
];

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
  const [loadingImages, setLoadingImages] = useState(true);
  const [cachedImages, setCachedImages] = useState({});

  // Initialize themes with image caching
  useEffect(() => {
    const initializeThemes = async () => {
      setLoadingImages(true);
      const colorThemes = generateColorThemes();
      const imageThemes = generateImageThemes();
      
      // Cache remote image URLs
      const remoteThemes = imageThemes.filter(theme => !theme.isLocal);
      const imageUrls = remoteThemes.map(theme => theme.value);
      
      try {
        // Cache images for faster loading on subsequent renders
        const cachedImageResults = await cacheImages(imageUrls);
        
        // Create a mapping of original URL to cached URL
        const cacheMap = {};
        imageUrls.forEach((url, index) => {
          if (cachedImageResults[index]) {
            cacheMap[url] = cachedImageResults[index];
          }
        });
        
        setCachedImages(cacheMap);
      } catch (error) {
        console.warn('Error caching images', error);
      }
      
      setThemes([...colorThemes, ...imageThemes]);
      setLoadingImages(false);
    };

    if (visible) {
      initializeThemes();
    }
  }, [visible]);

  // Reset selected theme when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedTheme(currentTheme);
      setThemeChanged(false);
    }
  }, [visible, currentTheme]);

  // Handle theme selection
  const handleThemeSelect = useCallback((theme) => {
    // If theme is premium and user is not premium, show premium modal
    if (theme.isPremium && !isPremiumUser) {
      setFocusedFeature(theme.name);
      setShowPremiumModal(true);
      return;
    }

    setSelectedTheme(theme);
    setThemeChanged(true);
  }, [isPremiumUser]);

  // Apply theme change
  const applyThemeChange = useCallback(() => {
    onThemeChange(selectedTheme);
    onClose();
  }, [selectedTheme, onThemeChange, onClose]);

  // Filter themes based on active filter - memoized for performance
  const filteredThemes = useMemo(() => {
    switch (activeFilter) {
      case 'all':
        return themes;
      case 'free':
        return themes.filter(theme => !theme.isPremium);
      case 'random':
        // Shuffle and return all themes (maintaining the same order during renders)
        return [...themes].sort(() => 0.5 - Math.random());
      case 'new':
        // Return last 10 themes (simulating new themes)
        return themes.slice(-10);
      case 'popular':
        // Prioritize free nature images and add some other popular themes
        const popularThemes = themes.filter(theme => theme.category === 'popular');
        const otherPopularThemes = themes
          .filter(theme => !theme.category && !theme.isPremium && theme.type === 'image')
          .sort(() => 0.5 - Math.random())
          .slice(0, 7);
        
        return [...popularThemes, ...otherPopularThemes];
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
  }, [themes, activeFilter]);

  // Render theme item with image optimization
  const renderThemeItem = useCallback(({ item, index }) => {
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
          <View style={[styles.themePreview, { 
            backgroundColor: item.value,
            opacity: item.opacity !== undefined ? item.opacity : 1.0
          }]}>
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
          item.isLocal ? (
            <ImageBackground
              source={item.value}
              style={styles.themePreview}
              resizeMode="cover"
            >
              <View style={styles.imageOverlay}>
                <Text style={styles.previewText}>Aa</Text>
              </View>
            </ImageBackground>
          ) : (
            <View style={styles.themePreview}>
              {cachedImages[`${item.id}_error`] ? (
                // Show fallback for failed images
                <View style={styles.imageOverlay}>
                  <Text style={[styles.previewText, {color: '#fff'}]}>Aa</Text>
                  <Text style={styles.errorText}>Image unavailable</Text>
                </View>
              ) : (
                <>
                  {/* Show placeholder while image is loading */}
                  {!cachedImages[item.value] && (
                    <View style={styles.imagePlaceholder}>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={styles.placeholderText}>Loading...</Text>
                    </View>
                  )}
                  
                  <Image
                    source={cachedImages[item.value] || { uri: item.value }}
                    style={[styles.themePreviewImage]}
                    resizeMode="cover"
                    progressiveRenderingEnabled={true}
                    fadeDuration={300}
                    defaultSource={require('../../assets/bg.jpg')}
                    onLoadStart={() => {
                      // Could track loading state here if needed
                    }}
                    onLoadEnd={() => {
                      // Clear any error state if the image loads successfully
                      if (cachedImages[`${item.id}_error`]) {
                        const updatedCache = {...cachedImages};
                        delete updatedCache[`${item.id}_error`];
                        setCachedImages(updatedCache);
                      }
                    }} 
                    onError={(e) => {
                      console.warn(`Error loading image ${item.id}:`, e.nativeEvent.error);
                      // Trigger fallback for this specific image
                      const updatedCache = {...cachedImages};
                      updatedCache[`${item.id}_error`] = true;
                      setCachedImages(updatedCache);
                      
                      // Try with a different quality or format if Pexels
                      if (item.value.includes('pexels.com') && !item.value.includes('&q=')) {
                        // Try with lower quality for better compatibility
                        const fallbackUrl = item.value + '&q=70';
                        
                        // Update the cached images with the fallback URL
                        updatedCache[item.value] = { uri: fallbackUrl };
                        setCachedImages(updatedCache);
                      }
                    }}
                  />
                  
                  <View style={styles.imageOverlay}>
                    <Text style={styles.previewText}>Aa</Text>
                  </View>
                </>
              )}
            </View>
          )
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
  }, [selectedTheme, handleThemeSelect, loadingImages, cachedImages, isPremiumUser]);

  // Memoize the theme mix item rendering
  const renderThemeMixItem = useCallback(({ item }) => (
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
  ), [activeFilter]);

  // Create header component for the main FlatList
  const ListHeaderComponent = useCallback(() => (
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
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={3}
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
  ), [themeMixes, renderThemeMixItem, activeFilter]);

  // Use memo for header
  const headerComponent = useMemo(() => <ListHeaderComponent />, [ListHeaderComponent]);

  // Memoize key extractor for performance
  const keyExtractor = useCallback((item) => item.id, []);

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

        {/* Loading indicator */}
        {loadingImages && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading themes...</Text>
          </View>
        )}

        {/* Main FlatList with header - this replaces the ScrollView */}
        <FlatList
          data={filteredThemes}
          renderItem={renderThemeItem}
          keyExtractor={keyExtractor}
          numColumns={3}
          ListHeaderComponent={headerComponent}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          initialNumToRender={9} // Show first 9 themes initially (3x3 grid)
          maxToRenderPerBatch={12} // Render 12 items per batch
          windowSize={5} // Keep 5 windows worth of items rendered
          removeClippedSubviews={Platform.OS === 'android'} // Improve performance on Android
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
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(34, 34, 34, 0.7)',
    paddingVertical: 10,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
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
  themePreviewImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#444', // Add a background color while loading
  },
  imagePlaceholder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  placeholderText: {
    color: 'white',
    fontSize: 14,
  },
  errorText: {
    color: '#ff8080',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
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

// Enhanced helper function to get share image from a theme
export const getShareImageFromTheme = (theme) => {
  if (!theme) return null;
  
  if (theme.type === 'image') {
    // For image themes, return the image source
    return theme.isLocal ? theme.value : { uri: theme.value };
  } else if (theme.type === 'color') {
    // For color themes, return an object with the color value
    return { color: theme.value, opacity: theme.opacity || 1.0 };
  } else if (theme.type === 'gradient') {
    // For gradient themes, return the colors array
    return { gradient: theme.value };
  }
  
  return null;
};