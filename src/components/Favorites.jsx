import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { propertyData } from "../data/propertyData";
import Property from "./Property";
import { FaHeart, FaHome, FaFilter } from "react-icons/fa";

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //simulate loading properties
    setTimeout(() => {
      //demo-first 3 properties in fav
      setFavorites(propertyData.slice(0, 3));
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex-items-center">
            <FaHeart className="text-pink-500 mr-3" />
            My Favorites
          </h1>
          <p className="text-gray-600">
            Hello,{user?.email}! Here are your saved properties.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <FaHeart className="text-red-500 text-xl" />
              </div>
              <div>
                <div className="text-3xl font-bold">{favorites.length}</div>
                <div className="text-gray-600">Saved Properties</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FaHome className="text-blue-500 text-xl" />
              </div>
              <div>
                <div className="text-3xl font-bold">
                  AED {Math.round(favorites.reduce((sum, p) => sum + p.price, 0) / favorites.length || 0).toLocaleString()}
                </div>
                <div className="text-gray-600">Average Price</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <FaFilter className="text-green-500 text-xl" />
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {[...new Set(favorites.map(p => p.location.emirate))].length}
                </div>
                <div className="text-gray-600">Emirates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites List */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Saved Properties ({favorites.length})</h2>
          </div>
          
          {favorites.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">💔</div>
              <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-6">
                Start saving properties by clicking the heart icon on property cards.
              </p>
              <a 
                href="/properties" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700"
              >
                Browse Properties
              </a>
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
        {favorites.length > 1 && (
          <div className="mt-8 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Compare Your Favorites</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {favorites.slice(0, 3).map((property, index) => (
                <div key={property.id} className="border rounded-lg p-4">
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h3 className="font-bold mb-2">{property.title}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price</span>
                      <span className="font-bold">AED {property.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms</span>
                      <span className="font-bold">{property.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-bold">⭐ {property.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {favorites.length > 3 && (
              <div className="mt-6 text-center">
                <a 
                  href="/compare" 
                  className="inline-block bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90"
                >
                  Compare All ({favorites.length})
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
