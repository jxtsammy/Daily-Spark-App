import api from '../helpers/api';
import { useStore } from '../store/useStore';



export const getRandomQuote = async () => {
  try {
    const response = await api.get('/quotes/random');
    return response.data;
  } catch (error) {
    console.error('Error getting random quote:', error);
    return null;
  }
};

export const getMultipleQuotes = async (limit = 10) => {
  try {
    const response = await api.get('/quotes/multiple', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting multiple quotes:', error);
    return [];
  }
};

export const getTodaysQuote = async () => {
  try {
    const response = await api.get('/quotes/today');
    return response.data;
  } catch (error) {
    console.error('Error getting today\'s quote:', error);
    return null;
  }
};

export const getQuotesByAuthor = async (author) => {
  try {
    const response = await api.get(`/quotes/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    console.error('Error getting quotes by author:', error);
    return [];
  }
};

/**
 * User-Specific Quote Functions (require userId)
 */

export const saveQuote = async (quoteData) => {
  try {
    const { userId } = useStore.getState();
    
    if (!userId) {
      console.log("User ID is required");
      return null;
    }

    const response = await api.post('/quotes/save', {
      ...quoteData,
      userId
    });
    return response.data;
  } catch (error) {
    console.error('Error saving quote:', error.response?.data || error.message);
    return null;
  }
};

export const getSavedQuotes = async () => {
  try {
    const { userId } = useStore.getState();
    
    if (!userId) {
      console.log("User ID is required");
      return [];
    }

    const response = await api.post('/quotes/saved', { userId });
    return response.data;
  } catch (error) {
    console.error('Error getting saved quotes:', error);
    return [];
  }
};

export const deleteSavedQuote = async (quoteId) => {
  try {
    const { userId } = useStore.getState();
    
    if (!userId) {
      console.log("User ID is required");
      return false;
    }

    await api.delete('/quotes/saved', {
      data: { userId, quoteId }
    });
    return true;
  } catch (error) {
    console.error('Error deleting quote:', error);
    return false;
  }
};

/**
 * Utility Functions
 */

export const saveRandomQuote = async () => {
  try {
    // First get a random quote
    const quote = await getRandomQuote();
    if (!quote) return null;
    
    // Then save it
    return await saveQuote({
      text: quote.text,
      author: quote.author,
      htmlFormatted: quote.htmlFormatted
    });
  } catch (error) {
    console.error('Error in saveRandomQuote:', error);
    return null;
  }
};