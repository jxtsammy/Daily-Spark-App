import api from '../helpers/api';
import { useStore } from '../store/useStore';

/**
 * Create a new collection for the current user
 */
export const createCollection = async (name) => {
  try {
    const { userId } = useStore.getState();
    if (!userId) {
      console.log("User ID is required");
      return null;
    }
    const response = await api.post('/collection', { name, userId });
    return response.data;
  } catch (error) {
    console.error('Error creating collection:', error.response?.data || error.message);
    return null;
  }
};

/**
 * Get all collections for the current user
 */
export const getUserCollections = async () => {
  try {
    const { userId } = useStore.getState();
    if (!userId) {
      console.log("User ID is required");
      return [];
    }
    const response = await api.get('/collection', { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error getting collections:', error.response?.data || error.message);
    return [];
  }
};

/**
 * Update a collection by ID for the current user
 */
export const updateCollection = async (collectionId, name) => {
  try {
    const { userId } = useStore.getState();
    if (!userId) {
      console.log("User ID is required");
      return null;
    }
    const response = await api.patch(`/collection/${collectionId}`, { name, userId });
    return response.data;
  } catch (error) {
    console.error('Error updating collection:', error.response?.data || error.message);
    return null;
  }
};

/**
 * Delete a collection by ID for the current user
 */
export const deleteCollection = async (collectionId) => {
  try {
    const { userId } = useStore.getState();
    if (!userId) {
      console.log("User ID is required");
      return false;
    }
    const response = await api.delete(`/collection/${collectionId}`, {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting collection:', error.response?.data || error.message);
    return false;
  }
};

/**
 * Add a quote to a collection
 */
export const addQuoteToCollection = async (collectionId, quote) => {
  try {
    const { userId } = useStore.getState();
    if (!userId) {
      console.log("User ID is required");
      return false;
    }
    const response = await api.post('/collection/add-quote', { 
      collectionId, 
      quote,
      userId 
    });
    return response.data;
  } catch (error) {
    console.error('Error adding quote to collection:', error.response?.data || error.message);
    return false;
  }
};