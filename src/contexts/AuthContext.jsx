import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase/config';

// Create context with default values
const AuthContext = createContext({
  currentUser: null,
  signup: () => {},
  login: () => {},
  loginWithGoogle: () => {},
  logout: () => {},
  resetPassword: () => {},
  loading: true
});

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔧 AuthProvider - Setting up auth listener');
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔧 AuthProvider - Auth state changed:', user?.email);
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Signup function
  const signup = (email, password) => {
    console.log('🔧 AuthProvider - Signup called:', email);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login function
  const login = (email, password) => {
    console.log('🔧 AuthProvider - Login called:', email);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Login with Google
  const loginWithGoogle = async () => {
    console.log('🔧 AuthProvider - Google login called');
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Logout function
  const logout = () => {
    console.log('🔧 AuthProvider - Logout called');
    return signOut(auth);
  };

  // Reset password
  const resetPassword = (email) => {
    console.log('🔧 AuthProvider - Reset password called:', email);
    return sendPasswordResetEmail(auth, email);
  };

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    loading
  };

  console.log('🔧 AuthProvider - Current user:', currentUser?.email);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};