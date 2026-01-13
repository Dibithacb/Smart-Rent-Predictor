import React, { useEffect, useState } from "react";
import { propertyData } from "../data/propertyData";
import Property from "./Property";
import Filter from "./Filter";
import { FaFilter, FaSortAmountDown, FaMapMarkedAlt } from "react-icons/fa";
import { MdGridView, MdList } from "react-icons/md";
import { useOutletContext } from "react-router-dom";

const Properties = () => {
  // Get searchTerm from context - add debug
  const context = useOutletContext();
  const searchTerm = context?.searchTerm || '';
  
  console.log("Properties Component - searchTerm:", searchTerm);
  console.log("Full context:", context);
  
  const [properties, setProperties] = useState(propertyData);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [filteredProperties, setFilteredProperties] = useState(propertyData);

  // Apply search filter when searchTerm changes
  useEffect(() => {
    console.log("useEffect running with searchTerm:", searchTerm);
    
    let result = [...propertyData];
    
    if (searchTerm && searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.toLowerCase().trim(); // FIXED: toLowerCase()
      console.log("Searching for:", searchTermLower);
      
      result = result.filter((p) => {
        if (!p?.location) {
          console.log("No location for property:", p?.title);
          return false;
        }

        const area = p.location?.area || '';
        const emirate = p.location?.emirate || '';
        const address = p.address || '';
        const title = p.title || '';

        const areaStr = String(area).toLowerCase();
        const emirateStr = String(emirate).toLowerCase();
        const addressStr = String(address).toLowerCase();
        const titleStr = String(title).toLowerCase();

        const matches = (
          areaStr.includes(searchTermLower) || 
          emirateStr.includes(searchTermLower) || 
          addressStr.includes(searchTermLower) || 
          titleStr.includes(searchTermLower)
        );
        
        if (matches) {
          console.log("Matched property:", p.title);
        }
        
        return matches;
      });
      
      console.log("Filtered result count:", result.length);
    }

    // Apply sorting
    result = sortProperties(result, sortBy);
    setFilteredProperties(result);
    setProperties(result); // Also update properties state for display

  }, [searchTerm, sortBy]);

  // Handle filter changes
  const handleFilterChanges = (filters) => {
    let filtered = [...propertyData];

    // Apply search filter first if searchTerm exists
    if (searchTerm && searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        if (!p?.location) return false;
        
        const area = p.location?.area || '';
        const emirate = p.location?.emirate || '';
        
        return (
          String(area).toLowerCase().includes(searchTermLower) ||
          String(emirate).toLowerCase().includes(searchTermLower)
        );
      });
    }

    // Apply filters
    if (filters.emirate) {
      filtered = filtered.filter((p) => p.location?.emirate === filters.emirate);
    }
    if (filters.area) {
      filtered = filtered.filter((p) => p.location?.area === filters.area);
    }
    if (filters.bedrooms) {
      filtered = filtered.filter(
        (p) => p.bedrooms === filters.bedrooms // FIXED: should be p.bedrooms not p.location.bedrooms
      );
    }
    if (filters.priceRange) {
      filtered = filtered.filter(
        (p) =>
          p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      );
    }
    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((p) => p.type === filters.type);
    }
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter((p) =>
        filters.amenities.every((amenity) => p.amenities?.includes(amenity))
      );
    }

    // Apply sorting
    filtered = sortProperties(filtered, sortBy);
    setFilteredProperties(filtered);
    setProperties(filtered);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    const sorted = sortProperties([...filteredProperties], value); // Use filteredProperties
    setFilteredProperties(sorted);
    setProperties(sorted);
  };

  const sortProperties = (propertiesList, sortType) => {
    const sorted = [...propertiesList];
    switch (sortType) {
      case "price_asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price_desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "popularity":
        return sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      case "predicted":
        return sorted.sort((a, b) => b.predictedPrice - a.predictedPrice);
      default:
        return sorted;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header - Show search term if exists */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Smart Rent Predictor
        </h1>
        <p className="text-gray-600">
          Find your perfect home in UAE with AI-powered rent predictions
        </p>
        
        {searchTerm && searchTerm.trim() && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-700">
              Showing results for: <span className="font-semibold">"{searchTerm}"</span>
              <button 
                onClick={() => {
                  // To clear search, you'll need to pass a function from parent
                  // For now, reload the page
                  window.location.href = '/properties';
                }}
                className="ml-3 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
              >
                Clear Search
              </button>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Found {filteredProperties.length} properties
            </p>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left: View toggle & Result count */}
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid" ? "bg-white shadow" : ""
                }`}
              >
                <MdGridView />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list" ? "bg-white shadow" : ""
                }`}
              >
                <MdList />
              </button>
            </div>
            <span className="text-gray-600">
              {filteredProperties.length} properties found
            </span>
          </div>

          {/* Right: sort & filter buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-2 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Sort by</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
              <option value="popularity">Most Popular</option>
              <option value="predicted">Best Value Prediction</option>
            </select>

            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaMapMarkedAlt className="mr-2" />
              Map View
            </button>
          </div>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6">
            <Filter onFilterChange={handleFilterChanges} />
          </div>
        )}
      </div>

      {/* Properties Grid/List - Use filteredProperties */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-6"
        }
      >
        {filteredProperties.map((property) => (
          <Property key={property.id} property={property} viewMode={viewMode} />
        ))}
      </div>

      {/* No result */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold mb-2">No properties found</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? `No properties found for "${searchTerm}". Try a different search term.`
              : "Try adjusting your filters to see more results"}
          </p>
          {searchTerm && (
            <button
              onClick={() => window.location.href = '/properties'}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View All Properties
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Properties;