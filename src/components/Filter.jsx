import React, { useState } from 'react'
import { FaSlidersH, FaTimes } from 'react-icons/fa'

const Filter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    emirate: '',
    area: '',
    bedrooms: '',
    priceRange: [0, 1000000],
    type: 'all',
    amenities: []
  })

  const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah']
  const areas = {
    'Dubai': ['Dubai Marina', 'Downtown Dubai', 'JBR', 'Palm Jumeirah', 'Arabian Ranches', 'Business Bay', 'JLT', 'Al Barsha'],
    'Abu Dhabi': ['Corniche Area', 'Al Reem Island', 'Yas Island'],
    'Sharjah': ['Al Nahda', 'Al Majaz']
  }
  const propertyTypes = ['apartment', 'villa', 'townhouse', 'penthouse', 'studio']
  const amenitiesList = ['pool', 'gym', 'parking', 'security', 'balcony', 'garden', 'beach', 'concierge']
  const bedroomOptions = ['1', '2', '3', '4+']

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity]
    handleFilterChange('amenities', newAmenities)
  }

  const handlePriceChange = (min, max) => {
    handleFilterChange('priceRange', [parseInt(min), parseInt(max)])
  }

  const clearFilters = () => {
    const clearedFilters = {
      emirate: '',
      area: '',
      bedrooms: '',
      priceRange: [0, 1000000],
      type: 'all',
      amenities: []
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center">
          <FaSlidersH className="mr-2" />
          Advanced Filters
        </h3>
        <button
          onClick={clearFilters}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Emirate Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Emirate</label>
          <select
            value={filters.emirate}
            onChange={(e) => handleFilterChange('emirate', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Emirates</option>
            {emirates.map(emirate => (
              <option key={emirate} value={emirate}>{emirate}</option>
            ))}
          </select>
        </div>

        {/* Area Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
          <select
            value={filters.area}
            onChange={(e) => handleFilterChange('area', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={!filters.emirate}
          >
            <option value="">All Areas</option>
            {filters.emirate && areas[filters.emirate]?.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
          <div className="flex space-x-2">
            {bedroomOptions.map(option => (
              <button
                key={option}
                onClick={() => handleFilterChange('bedrooms', option === '4+' ? 4 : parseInt(option))}
                className={`flex-1 py-2 text-center rounded-lg border ${
                  filters.bedrooms === (option === '4+' ? 4 : parseInt(option))
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range: AED {filters.priceRange[0].toLocaleString()} - AED {filters.priceRange[1].toLocaleString()}
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="1000000"
              step="50000"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(e.target.value, filters.priceRange[1])}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max="1000000"
              step="50000"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(filters.priceRange[0], e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>0</span>
            <span>500,000</span>
            <span>1,000,000</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {amenitiesList.map(amenity => (
              <button
                key={amenity}
                onClick={() => handleAmenityToggle(amenity)}
                className={`p-3 rounded-lg border flex items-center justify-center space-x-2 ${
                  filters.amenities.includes(amenity)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{amenity === 'pool' ? '🏊' : 
                       amenity === 'gym' ? '💪' : 
                       amenity === 'parking' ? '🅿️' : 
                       amenity === 'security' ? '👮' : 
                       amenity === 'balcony' ? '🌇' : 
                       amenity === 'garden' ? '🌳' : 
                       amenity === 'beach' ? '🏖️' : 
                       '🎩'}</span>
                <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Filter