import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:3000/api/users/checkUser", {
          withCredentials: true
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.log('Not authenticated:', error);
        setIsAuthenticated(false);
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;