import React, { useState } from 'react'
import MapView from './MapView'
import { propertyData } from '../data/propertyData'
import { FaFilter, FaList, FaTimes } from 'react-icons/fa'

const MapPage = () => {
  const [properties, setProperties] = useState(propertyData)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)

  const handlePropertySelect = (property) => {
    setSelectedProperty(property)
  }

  const handleFilter = (filters) => {
    let filtered = [...propertyData]
    
    if (filters.emirate) {
      filtered = filtered.filter(p => p.location.emirate === filters.emirate)
    }
    if (filters.priceRange) {
      filtered = filtered.filter(p => 
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      )
    }
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(p => p.type === filters.type)
    }
    
    setProperties(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Interactive Map View</h1>
              <p className="text-gray-600">Explore properties across UAE</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {showSidebar ? <FaTimes className="mr-2" /> : <FaList className="mr-2" />}
                {showSidebar ? 'Hide List' : 'Show List'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Map */}
          <div className={`${showSidebar ? 'lg:w-2/3' : 'w-full'}`}>
            <div className="bg-white rounded-xl shadow p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">UAE Property Map</h2>
                <span className="text-gray-600">{properties.length} properties</span>
              </div>
              <MapView 
                properties={properties} 
                onPropertySelect={handlePropertySelect}
              />
            </div>
          </div>

          {/* Sidebar with Property List */}
          {showSidebar && (
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-4">Properties in View</h3>
                
                {/* Quick Filters */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button 
                      onClick={() => handleFilter({})}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg"
                    >
                      All
                    </button>
                    <button 
                      onClick={() => handleFilter({ emirate: 'Dubai' })}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                    >
                      Dubai
                    </button>
                    <button 
                      onClick={() => handleFilter({ emirate: 'Abu Dhabi' })}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                    >
                      Abu Dhabi
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range: Up to AED 500,000
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="1000000" 
                        step="50000"
                        defaultValue="500000"
                        onChange={(e) => handleFilter({ priceRange: [0, parseInt(e.target.value)] })}
                        className="w-full"
                      />
                    </div>
                    
                    <select 
                      onChange={(e) => handleFilter({ type: e.target.value })}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="all">All Property Types</option>
                      <option value="apartment">Apartments</option>
                      <option value="villa">Villas</option>
                      <option value="penthouse">Penthouses</option>
                    </select>
                  </div>
                </div>

                {/* Property List */}
                <div className="space-y-4 max-h-125 overflow-y-auto">
                  {properties.map(property => (
                    <div 
                      key={property.id}
                      className={`p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${
                        selectedProperty?.id === property.id ? 'bg-blue-50 border-blue-500' : 'border-gray-200'
                      }`}
                      onClick={() => handlePropertySelect(property)}
                    >
                      <div className="flex">
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="ml-4 flex-1">
                          <h4 className="font-bold line-clamp-1">{property.title}</h4>
                          <p className="text-blue-600 font-bold">AED {property.price.toLocaleString()}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span className="mr-3">{property.location.area}</span>
                            <span>🛏️ {property.bedrooms}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Property Details */}
        {selectedProperty && (
          <div className="mt-6 bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedProperty.title}</h3>
                <p className="text-gray-600">{selectedProperty.location.area}, {selectedProperty.location.emirate}</p>
              </div>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <img 
                  src={selectedProperty.images[0]} 
                  alt={selectedProperty.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Price</div>
                    <div className="font-bold text-lg text-blue-600">AED {selectedProperty.price.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Bedrooms</div>
                    <div className="font-bold text-lg">{selectedProperty.bedrooms}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Bathrooms</div>
                    <div className="font-bold text-lg">{selectedProperty.bathrooms}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Size</div>
                    <div className="font-bold text-lg">{selectedProperty.sqft} sqft</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.slice(0, 5).map((amenity, index) => (
                      <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                
                <a 
                  href={`/properties/${selectedProperty.id}`}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                  View Full Details
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapPage