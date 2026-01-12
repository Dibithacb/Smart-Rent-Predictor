import React, { useState } from "react";
import { propertyData } from "../data/propertyData";
import Property from "./Property";
import Filter from "./Filter";
import { FaFilter, FaSortAmountDown, FaMapMarkedAlt } from "react-icons/fa";
import { MdGridView, MdList } from "react-icons/md";

const Properties = () => {
  const [properties, setProperties] = useState(propertyData);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");

  //Handle filter changes
  const handleFilterChanges = (filters) => {
    let filtered = [...propertyData];

    //Apply filters
    if (filters.emirate) {
      filtered = filtered.filter((p) => p.location.emirate === filters.emirate);
    }
    if (filters.area) {
      filtered = filtered.filter((p) => p.location.area === filters.area);
    }
    if (filters.bedrooms) {
      filtered = filtered.filter(
        (p) => p.location.bedrooms === filters.bedrooms
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
        filters.amenities.every((amenity) => p.amenities.includes(amenity))
      );
    }

    //Apply sorting
    filtered = sortProperties(filtered, sortBy);
    setProperties(filtered);
  };

  //Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    const sorted = sortProperties([...properties], value);
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Smart Rent Predictor
        </h1>
        <p className="text-gray-600">
          Find your perfect home in UAE with AI-powered rent predictions
        </p>
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
              {properties.length} properties found
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
              name=""
              id=""
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

      {/* Properties Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-6"
        }
      >
        {properties.map((property) => (
          <Property key={property.id} property={property} viewMode={viewMode} />
        ))}
      </div>

      {/* No result */}
      {properties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold mb-2">No properties found</h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more results
          </p>
        </div>
      )}
    </div>
  );
};

export default Properties;
