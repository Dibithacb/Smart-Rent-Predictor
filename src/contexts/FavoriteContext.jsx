// contexts/FavoriteContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
const URL=import.meta.env.VITE_API_URL
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
  const { currentUser,loading } = useAuth();

  const fetchFavoriteCount = useCallback(async () => {
    if (!currentUser) {
      setFavoriteCount(0);
      return;
    }
    
    try {
      const response = await axios.get(
        `${URL}/api/users/favoriteCount`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setFavoriteCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching favorite count:', error);
    }
  }, [currentUser]);

  useEffect(()=>{
    if(currentUser && !loading){
      fetchFavoriteCount();
    }else if(!currentUser && !loading){
      setFavoriteCount(0)
    }
  },[currentUser,loading,fetchFavoriteCount])

  useEffect(()=>{
    if(currentUser && !loading){
      fetchFavoriteCount()
    }
  },[])

  const updateFavoriteCount = useCallback(async() => {
    await fetchFavoriteCount();
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