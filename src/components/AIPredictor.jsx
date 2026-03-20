import React, { useState } from 'react'
import { FaCalculator, FaChartLine, FaHome, FaMapMarkerAlt } from 'react-icons/fa'

const RentPredictor = () => {
  const [formData, setFormData] = useState({
    emirate: 'Dubai',
    area: 'Dubai Marina',
    bedrooms: 2,
    sqft: 1500,
    amenities: ['pool', 'gym'],
    propertyType: 'apartment',
    yearBuilt: 2020
  })

  const [prediction, setPrediction] = useState(null)

  const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah']
  const areas = {
    'Dubai': ['Dubai Marina', 'Downtown Dubai', 'JBR', 'Palm Jumeirah', 'Arabian Ranches'],
    'Abu Dhabi': ['Corniche Area', 'Al Reem Island', 'Yas Island'],
    'Sharjah': ['Al Nahda', 'Al Majaz']
  }
  const amenitiesList = ['pool', 'gym', 'parking', 'security', 'balcony', 'garden', 'beach']

  const calculatePrediction = () => {
    // Mock AI calculation
    const basePrice = {
      'Dubai': 60000,
      'Abu Dhabi': 55000,
      'Sharjah': 35000
    }[formData.emirate] || 40000

    const areaMultiplier = {
      'Dubai Marina': 1.8,
      'Downtown Dubai': 2.2,
      'Arabian Ranches': 2.0,
      'JBR': 1.9,
      'Corniche Area': 1.7
    }[formData.area] || 1.2

    const bedroomPrice = formData.bedrooms * 15000
    const sqftPrice = formData.sqft * 50
    const amenitiesBonus = formData.amenities.length * 3000
    const yearBonus = formData.yearBuilt > 2020 ? 10000 : 0

    const predicted = Math.round(
      (basePrice + bedroomPrice + sqftPrice + amenitiesBonus + yearBonus) * areaMultiplier
    )

    setPrediction({
      predictedRent: predicted,
      confidence: 85,
      factors: [
        { name: 'Location Premium', value: `${Math.round((areaMultiplier - 1) * 100)}%` },
        { name: 'Bedrooms', value: formData.bedrooms },
        { name: 'Size', value: `${formData.sqft} sqft` },
        { name: 'Amenities', value: formData.amenities.length }
      ],
      marketComparison: predicted * 0.9 // 10% lower than market
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <FaChartLine className="text-4xl text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold">AI Rent Predictor</h1>
          </div>
          <p className="text-gray-600 text-lg">Get accurate rent predictions using machine learning algorithms</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaCalculator className="mr-3 text-blue-600" />
              Enter Property Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emirate</label>
                <select
                  value={formData.emirate}
                  onChange={(e) => setFormData({...formData, emirate: e.target.value, area: ''})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {emirates.map(emirate => (
                    <option key={emirate} value={emirate}>{emirate}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {areas[formData.emirate]?.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms: {formData.bedrooms}
                </label>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet: {formData.sqft}
                </label>
                <input
                  type="range"
                  min="300"
                  max="5000"
                  step="100"
                  value={formData.sqft}
                  onChange={(e) => setFormData({...formData, sqft: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="penthouse">Penthouse</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
                <select
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData({...formData, yearBuilt: parseInt(e.target.value)})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">Select Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenitiesList.map(amenity => (
                  <button
                    key={amenity}
                    onClick={() => {
                      const newAmenities = formData.amenities.includes(amenity)
                        ? formData.amenities.filter(a => a !== amenity)
                        : [...formData.amenities, amenity]
                      setFormData({...formData, amenities: newAmenities})
                    }}
                    className={`p-3 rounded-lg border flex items-center justify-center ${
                      formData.amenities.includes(amenity)
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">
                      {amenity === 'pool' ? '🏊' : 
                       amenity === 'gym' ? '💪' : 
                       amenity === 'parking' ? '🅿️' : 
                       amenity === 'security' ? '👮' : 
                       amenity === 'balcony' ? '🌇' : 
                       amenity === 'garden' ? '🌳' : 
                       '🏖️'}
                    </span>
                    <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={calculatePrediction}
              className="w-full mt-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              <FaChartLine className="inline mr-2" />
              Calculate Rent Prediction
            </button>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Prediction Results</h2>
            
            {prediction ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    AED {prediction.predictedRent.toLocaleString()}
                  </div>
                  <div className="text-gray-600">Predicted Annual Rent</div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">AI Confidence</span>
                    <span className="font-bold">{prediction.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold">Key Factors</h3>
                  {prediction.factors.map((factor, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>{factor.name}</span>
                      <span className="font-bold">{factor.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="font-bold mb-3">💡 AI Insight</h3>
                  <p className="text-gray-700">
                    This property is estimated to be <span className="font-bold text-green-600">
                      AED {(prediction.predictedRent - prediction.marketComparison).toLocaleString()}
                    </span> below market average in this area.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-2">Enter Details to Predict</h3>
                <p className="text-gray-600">Fill in the property information to get an AI-powered rent estimate</p>
              </div>
            )}

            {/* Market Trends */}
            <div className="mt-8 p-6 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl">
              <h3 className="font-bold mb-3 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                {formData.area} Market Trends
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Average Rent</span>
                  <span className="font-bold">AED 130,000</span>
                </div>
                <div className="flex justify-between">
                  <span>3-Month Trend</span>
                  <span className="font-bold text-green-600">+3.5% ↗</span>
                </div>
                <div className="flex justify-between">
                  <span>Demand Level</span>
                  <span className="font-bold text-green-600">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RentPredictor