// contexts/FavoriteContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const FavoriteContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoriteProvider');
  }
  return context;
};

export const FavoriteProvider = ({ children }) => {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const { currentUser } = useAuth();

  const fetchFavoriteCount = useCallback(async () => {
    if (!currentUser) {
      setFavoriteCount(0);
      return;
    }
    
    try {
      const response = await axios.get(
        'http://localhost:3000/api/users/favoriteCount',
        { withCredentials: true }
      );
      if (response.data.success) {
        setFavoriteCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching favorite count:', error);
    }
  }, [currentUser]);

  const updateFavoriteCount = useCallback(() => {
    fetchFavoriteCount();
  }, [fetchFavoriteCount]);

  return (
    <FavoriteContext.Provider value={{
      favoriteCount,
      updateFavoriteCount,
      fetchFavoriteCount
    }}>
      {children}
    </FavoriteContext.Provider>
  );
};