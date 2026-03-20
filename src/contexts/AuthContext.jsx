// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create context with default values
const AuthContext = createContext({
  currentUser: null,
  register: () => {},
  login: () => {},
  logout: () => {},
  checkUserStatus: () => {},
  loading: true,
  error: null
});

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  const API_URL = 'http://localhost:3000/api/users';

  // Check if user is logged in on mount
  useEffect(() => {
    checkUserStatus();
  }, []);

  // Check user authentication status
  const checkUserStatus = async () => {
    try {
      console.log('🔍 Checking user status...');
      setLoading(true);
      
      const response = await axios.get(`${API_URL}/checkUser`, {
        withCredentials: true
      });
      
      console.log('🔍 Check user response:', response.data);
      console.log('🔍 Check user status:', response.status);
      
      // If we get a 200 response, user is authenticated
      if (response.status === 200) {
        // The validateToken middleware sets req.user with payload
        // But we need to get the actual user data
        // Try to get user from localStorage first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setCurrentUser(parsedUser);
            console.log('✅ User loaded from localStorage:', parsedUser);
          } catch (e) {
            console.error('Error parsing stored user:', e);
            // If we can't parse stored user, create basic user from email
            // You might want to call another endpoint to get full user profile
            setCurrentUser({ email: 'user@example.com' });
          }
        } else {
          // No stored user but authenticated - create placeholder
          // Ideally your backend should return user data in checkUser
          setCurrentUser({ email: 'user@example.com' });
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('user');
        console.log('❌ User not authenticated');
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      
      // Check if error is due to 401 (not authorized)
      if (error.response?.status === 401) {
        console.log('User not authorized');
        setCurrentUser(null);
        localStorage.removeItem('user');
      } else {
        // For other errors, check localStorage as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('📦 Using stored user from localStorage (fallback):', parsedUser);
            setCurrentUser(parsedUser);
          } catch (e) {
            console.error('Error parsing stored user:', e);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Registering user:', userData);
      
      const response = await axios.post(`${API_URL}/register`, userData, {
        withCredentials: true
      });
      
      console.log('✅ Register response:', response.data);
      console.log('✅ Register status:', response.status);
      
      if (response.status === 201) {
        // Registration successful
        // Your backend doesn't auto-login, so we don't set currentUser here
        return { 
          success: true, 
          message: response.data.message || 'User registered successfully'
        };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('❌ Register error:', error);
      
      let errorMessage = 'Registration failed';
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'User already exists';
        } else {
          errorMessage = error.response.data?.message || 'Server error';
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Attempting login for:', email);
      
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      }, {
        withCredentials: true
      });
      
      console.log('✅ Login response:', response.data);
      console.log('✅ Login status:', response.status);
      
      if (response.status === 200) {
        // Login successful - token is set in cookie by backend
        // Create user object from email
        const user = { email };
        
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('✅ User set in context:', user.email);
        
        return { 
          success: true, 
          message: response.data.message || 'Login successful'
        };
      } else {
        return { success: false, error: 'Login failed' };
      }
      
    } catch (error) {
      console.error('❌ Login error:', error);
      
      let errorMessage = 'Login failed';
      
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error status:', error.response.status);
        
        if (error.response.status === 404) {
          errorMessage = error.response.data?.message || 'User not found';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.error || 'Login details cannot be empty';
        } else if (error.response.status === 401) {
          errorMessage = error.response.data?.message || 'Invalid credentials';
        } else if (error.response.status === 501) {
          errorMessage = error.response.data?.message || 'Invalid token';
        } else {
          errorMessage = error.response.data?.message || 'Server error';
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check your internet.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Logging out...');
      
      const response = await axios.post(`${API_URL}/logout`, {}, {
        withCredentials: true
      });
      
      console.log('✅ Logout response:', response.data);
      console.log('✅ Logout status:', response.status);
      
      // Clear user state
      setCurrentUser(null);
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      return { 
        success: true, 
        message: response.data?.message || 'Logged out successfully' 
      };
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Even if API fails, clear local state
      setCurrentUser(null);
      localStorage.removeItem('user');
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Logout failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Get user profile (optional - if you have this endpoint)
  const getUserProfile = async () => {
    try {
      // You might need to create this endpoint in your backend
      const response = await axios.get(`${API_URL}/profile`, {
        withCredentials: true
      });
      
      if (response.data?.user) {
        setCurrentUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      
      return null;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    checkUserStatus,
    getUserProfile
  };

  console.log('🔧 AuthProvider - Current user:', currentUser?.email);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};