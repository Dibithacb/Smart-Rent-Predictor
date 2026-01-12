import React, { useState } from 'react'
import { propertyData } from '../data/propertyData'
import { FaTimes, FaChartLine } from 'react-icons/fa'

const ComparisonTool = () => {
  const [selectedProperties, setSelectedProperties] = useState(['DXB-001', 'DXB-002'])
  const [comparisonData, setComparisonData] = useState([])

  const properties = propertyData.filter(p => selectedProperties.includes(p.id))

  const compareMetrics = [
    { key: 'price', label: 'Annual Rent', format: (val) => `AED ${val.toLocaleString()}` },
    { key: 'predictedPrice', label: 'AI Prediction', format: (val) => `AED ${val.toLocaleString()}` },
    { key: 'sqft', label: 'Size', format: (val) => `${val} sqft` },
    { key: 'bedrooms', label: 'Bedrooms', format: (val) => val },
    { key: 'bathrooms', label: 'Bathrooms', format: (val) => val },
    { key: 'rating', label: 'Rating', format: (val) => `${val}/5` },
    { key: 'amenities', label: 'Amenities', format: (val) => val.length },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Property Comparison Tool</h1>
          <p className="text-gray-600">Compare multiple properties side-by-side to make the best decision</p>
        </div>

        {/* Property Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Select Properties to Compare</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {propertyData.map(property => (
              <div
                key={property.id}
                onClick={() => {
                  if (selectedProperties.includes(property.id)) {
                    setSelectedProperties(selectedProperties.filter(id => id !== property.id))
                  } else if (selectedProperties.length < 4) {
                    setSelectedProperties([...selectedProperties, property.id])
                  }
                }}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedProperties.includes(property.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img src={property.images[0]} alt={property.title} className="w-full h-32 object-cover rounded mb-2" />
                <div className="font-medium line-clamp-1">{property.title}</div>
                <div className="text-primary font-bold">AED {property.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Select 2-4 properties to compare. Currently selected: {selectedProperties.length}
          </div>
        </div>

        {/* Comparison Table */}
        {properties.length > 1 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-6 text-left">Feature</th>
                    {properties.map(property => (
                      <th key={property.id} className="p-6 text-center">
                        <div className="relative">
                          <button
                            onClick={() => setSelectedProperties(selectedProperties.filter(id => id !== property.id))}
                            className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1"
                          >
                            <FaTimes size={12} />
                          </button>
                          <img src={property.images[0]} alt={property.title} className="w-32 h-24 object-cover rounded mx-auto mb-2" />
                          <div className="font-bold">{property.title}</div>
                          <div className="text-primary">{property.location.area}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareMetrics.map((metric, index) => (
                    <tr key={metric.key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-4 font-medium">{metric.label}</td>
                      {properties.map(property => (
                        <td key={`${property.id}-${metric.key}`} className="p-4 text-center">
                          <div className="font-bold">{metric.format(property[metric.key])}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Recommendation */}
            <div className="border-t p-6 bg-linear-to-r from-blue-50 to-indigo-50">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaChartLine className="mr-2" />
                AI Recommendation
              </h3>
              {properties.length > 0 && (
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <FaChartLine className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold">Best Value Pick</h4>
                      <p className="text-gray-600">Based on price, amenities, and location score</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {properties.map(property => {
                      const valueScore = (
                        (property.rating * 20) + 
                        (property.amenities.length * 5) - 
                        (property.price / 2000)
                      ).toFixed(1)
                      
                      return (
                        <div key={property.id} className={`p-4 rounded-lg border-2 ${
                          valueScore === Math.max(...properties.map(p => 
                            (p.rating * 20) + (p.amenities.length * 5) - (p.price / 2000)
                          )).toFixed(1)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200'
                        }`}>
                          <div className="font-bold mb-2">{property.title}</div>
                          <div className="text-3xl font-bold text-primary mb-2">
                            {valueScore}
                          </div>
                          <div className="text-sm text-gray-600">Value Score</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {properties.length < 2 && (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Select at least 2 properties</h3>
            <p className="text-gray-600">Choose 2-4 properties to start comparing</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComparisonTool