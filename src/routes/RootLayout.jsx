// routes/RootLayout.jsx
import React, { useState, useCallback, memo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { FavoriteProvider } from '../contexts/FavoriteContext';


// Memoize the entire layout to prevent unnecessary re-renders
const RootLayout = memo(() => {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  const updateFavoriteCount = (newCount) => {
    setFavoriteCount(newCount);
  };

  const fetchFavoriteCount = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/users/favorite-count',
        { withCredentials: true }
      );
      if (response.data.success) {
        setFavoriteCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching favorite count:', error);
    }
  };

  return (
    <AuthProvider>
      <FavoriteProvider>
      <Navbar 
      onSearch={handleSearch}
      favoriteCount={favoriteCount}
      onFavoriteUpdate={fetchFavoriteCount}
       />
      <main>
        <Outlet context={{ searchTerm,updateFavoriteCount: fetchFavoriteCount }} />
      </main>
      <Footer />
      </FavoriteProvider>
    </AuthProvider>
  );
});

export default RootLayout;