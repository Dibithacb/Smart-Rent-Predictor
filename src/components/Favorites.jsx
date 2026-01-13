import React, { useState, useEffect } from 'react';
import { propertyData } from '../data/propertyData'; // Update path as needed
import Property from './Property'; // Update path as needed
import { FaHeart, FaHome, FaFilter, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Favorites = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading favorites with delay
    const loadFavorites = () => {
      setLoading(true);
      
      // For demo, show first 3 properties as favorites
      // In a real app, you would fetch user's saved properties from a database
      setTimeout(() => {
        setFavorites(propertyData.slice(0, 3));
        setLoading(false);
      }, 1000);
    };

    loadFavorites();
  }, []);

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalProperties = favorites.length;
  const averagePrice = totalProperties > 0 
    ? Math.round(favorites.reduce((sum, p) => sum + p.price, 0) / totalProperties)
    : 0;
  const uniqueEmirates = [...new Set(favorites.map(p => p.location.emirate))].length;
  const averageRating = totalProperties > 0
    ? (favorites.reduce((sum, p) => sum + p.rating, 0) / totalProperties).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with user greeting */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                <FaHeart className="text-red-500 mr-3" />
                My Favorites
              </h1>
              <p className="text-gray-600 mt-2">
                {currentUser ? (
                  <>
                    Hello, <span className="font-semibold text-blue-600">{currentUser.email}</span>! 
                    Here are your saved properties.
                  </>
                ) : (
                  "Please log in to view your favorites"
                )}
              </p>
            </div>
            
        
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg mr-3">
                  <FaHeart className="text-red-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalProperties}</div>
                  <div className="text-gray-600 text-sm">Saved Properties</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-3">
                  <FaHome className="text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">AED {averagePrice.toLocaleString()}</div>
                  <div className="text-gray-600 text-sm">Average Price</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-3">
                  <FaFilter className="text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{uniqueEmirates}</div>
                  <div className="text-gray-600 text-sm">Emirates</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg mr-3">
                  <FaStar className="text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{averageRating}</div>
                  <div className="text-gray-600 text-sm">Avg. Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites List */}
        <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Saved Properties ({totalProperties})</h2>
              {totalProperties > 0 && (
                <Link 
                  to="/compare" 
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  <FaFilter className="mr-2" />
                  Compare All
                </Link>
              )}
            </div>
          </div>
          
          {totalProperties === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">💔</div>
              <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-6">
                Start saving properties by clicking the heart icon on property cards.
              </p>
              <Link 
                to="/properties" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {favorites.map((property) => (
                <Property key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>

        {/* Comparison Section */}
        {totalProperties > 1 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Compare Your Favorites</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {favorites.slice(0, 3).map((property) => (
                <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                  <h3 className="font-bold mb-2 text-lg">{property.title}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    <span>{property.location.area}, {property.location.emirate}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price</span>
                      <span className="font-bold text-blue-600">AED {property.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bedrooms</span>
                      <span className="font-bold">{property.bedrooms}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bathrooms</span>
                      <span className="font-bold">{property.bathrooms}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-bold flex items-center">
                        <FaStar className="text-yellow-500 mr-1" />
                        {property.rating}
                      </span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/properties/${property.id}`}
                    className="block mt-4 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
            
            {totalProperties > 3 && (
              <div className="mt-6 text-center">
                <Link 
                  to="/compare" 
                  className="inline-block bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                >
                  Compare All Properties ({totalProperties})
                </Link>
              </div>
            )}
          </div>
        )}

        {/* User Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-linear-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-3">Need help?</h3>
            <p className="text-gray-700 mb-4">
              Contact our support team for assistance with your saved properties.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
          </div>
          
          <div className="bg-linear-to-r from-green-50 to-green-100 p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-3">Get AI Recommendations</h3>
            <p className="text-gray-700 mb-4">
              Based on your favorites, our AI can suggest similar properties you might like.
            </p>
            <Link 
              to="/predictor"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Get Recommendations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;