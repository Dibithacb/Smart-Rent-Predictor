import React, { useState, useEffect } from 'react'
import { FaCalculator, FaChartLine, FaHome, FaMapMarkerAlt, FaSpinner, FaBrain, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import * as tf from '@tensorflow/tfjs'
import RentPredictionModel from '../utils/rentModel'

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
  const [loading, setLoading] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [model, setModel] = useState(null)

  const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah']
  const areas = {
    'Dubai': ['Dubai Marina', 'Downtown Dubai', 'JBR', 'Palm Jumeirah', 'Arabian Ranches'],
    'Abu Dhabi': ['Corniche', 'Al Reem Island', 'Yas Island'],
    'Sharjah': ['Al Majaz', 'Al Nahda', 'Al Khan']
  }
  const amenitiesList = ['pool', 'gym', 'parking', 'security', 'balcony', 'garden', 'beach', 'maid-room', 'study-room']
  const propertyTypes = ['apartment', 'villa', 'townhouse', 'penthouse', 'studio']

  // Initialize TensorFlow and load/create model
  useEffect(() => {
    const initModel = async () => {
      try {
        console.log('🤖 Initializing TensorFlow.js...');
        await tf.ready();
        console.log('✅ TensorFlow.js ready');
        
        const rentModel = new RentPredictionModel();
        
        // Try to load existing model
        const loaded = await rentModel.loadModel();
        
        if (!loaded) {
          console.log('🆕 No existing model found. Training new model...');
          const history = await rentModel.trainModel(80, 32);
          await rentModel.saveModel();
          console.log('🎉 Model trained and saved!');
        }
        
        setModel(rentModel);
        setModelReady(true);
        console.log('🚀 Model ready for predictions!');
        
      } catch (error) {
        console.error('Error initializing model:', error);
      }
    };
    
    initModel();
  }, []);

  const calculatePrediction = async () => {
    if (!model || !modelReady) {
      alert('Model is still loading. Please wait...');
      return;
    }
    
    setLoading(true);
    
    try {
      const features = {
        emirate: formData.emirate,
        area: formData.area,
        bedrooms: formData.bedrooms,
        sqft: formData.sqft,
        propertyType: formData.propertyType,
        yearBuilt: formData.yearBuilt,
        amenities: formData.amenities
      };
      
      const result = await model.predict(features);
      
      setPrediction(result);
      
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Error making prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 85) return 'bg-green-500'
    if (confidence >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getConfidenceMessage = (confidence) => {
    if (confidence >= 85) return '🎯 High confidence prediction'
    if (confidence >= 70) return '⚠️ Moderate confidence - Good estimate'
    return '❓ Low confidence - Consider adding more details'
  }

  if (!modelReady) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Initializing AI Model</h2>
          <p className="text-gray-600">Loading TensorFlow.js and preparing neural network...</p>
          <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <FaBrain className="text-5xl text-blue-600 mr-3" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Rent Predictor
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Powered by TensorFlow.js Neural Network • Trained on 10,000+ UAE properties</p>
          <div className="mt-2 inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            AI Model Ready
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaCalculator className="mr-3 text-blue-600" />
              Enter Property Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emirate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emirate</label>
                <select
                  value={formData.emirate}
                  onChange={(e) => setFormData({...formData, emirate: e.target.value, area: ''})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {emirates.map(emirate => (
                    <option key={emirate} value={emirate}>{emirate}</option>
                  ))}
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {areas[formData.emirate]?.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms: <span className="font-bold text-blue-600">{formData.bedrooms}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Studio</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6+</span>
                </div>
              </div>

              {/* Square Feet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet: <span className="font-bold text-blue-600">{formData.sqft.toLocaleString()} sqft</span>
                </label>
                <input
                  type="range"
                  min="300"
                  max="5000"
                  step="50"
                  value={formData.sqft}
                  onChange={(e) => setFormData({...formData, sqft: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>300</span>
                  <span>1500</span>
                  <span>3000</span>
                  <span>5000</span>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Built */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
                <select
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData({...formData, yearBuilt: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({length: 25}, (_, i) => 2000 + i).map(year => (
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
                    type="button"
                    onClick={() => {
                      const newAmenities = formData.amenities.includes(amenity)
                        ? formData.amenities.filter(a => a !== amenity)
                        : [...formData.amenities, amenity]
                      setFormData({...formData, amenities: newAmenities})
                    }}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center ${
                      formData.amenities.includes(amenity)
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2 text-lg">
                      {amenity === 'pool' ? '🏊' : 
                       amenity === 'gym' ? '💪' : 
                       amenity === 'parking' ? '🅿️' : 
                       amenity === 'security' ? '👮' : 
                       amenity === 'balcony' ? '🌇' : 
                       amenity === 'garden' ? '🌳' : 
                       amenity === 'beach' ? '🏖️' :
                       amenity === 'maid-room' ? '👩‍🍳' :
                       '📚'}
                    </span>
                    <span className="capitalize">{amenity.replace('-', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={calculatePrediction}
              disabled={loading}
              className="w-full mt-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="inline mr-2 animate-spin" />
                  Analyzing with Neural Network...
                </>
              ) : (
                <>
                  <FaChartLine className="inline mr-2" />
                  Calculate AI Prediction
                </>
              )}
            </button>
          </div>

          {/* Results Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Neural Network Results</h2>
            
            {prediction ? (
              <div className="space-y-6">
                {/* Main Price */}
                <div className="text-center bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {formatCurrency(prediction.predictedRent)}
                  </div>
                  <div className="text-gray-600">Predicted Annual Rent</div>
                </div>

                {/* Confidence Meter */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">AI Confidence Score</span>
                    <span className="font-bold text-blue-600">{prediction.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`${getConfidenceColor(prediction.confidence)} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {getConfidenceMessage(prediction.confidence)}
                  </p>
                </div>

                {/* Market Analysis - CORRECTED */}
                <div className="bg-green-50 p-4 rounded-xl">
                  <h3 className="font-bold mb-3 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-green-600" />
                    Market Analysis
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Market Average</span>
                      <span className="font-bold">{formatCurrency(prediction.marketAverage)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Your Property</span>
                      <span className={`font-bold ${
                        prediction.aboveMarket ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(prediction.predictedRent)}
                      </span>
                    </div>
                    
                    <div className="border-t border-green-200 my-2"></div>
                    
                    <div className="flex justify-between items-center">
                      <span>Market Position</span>
                      <span className={`font-bold flex items-center gap-1 ${
                        prediction.aboveMarket ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {prediction.aboveMarket ? (
                          <>
                            <FaArrowUp className="text-green-600" />
                            Premium Property
                          </>
                        ) : (
                          <>
                            <FaArrowDown className="text-red-600" />
                            Value Opportunity
                          </>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Difference from Market</span>
                      <span className={`font-bold ${
                        prediction.aboveMarket ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {prediction.aboveMarket ? '+' : '-'}
                        {formatCurrency(Math.abs(prediction.difference))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Insight - CORRECTED */}
                <div className="bg-purple-50 p-6 rounded-xl">
                  <h3 className="font-bold mb-3 flex items-center">
                    <FaBrain className="mr-2 text-purple-600" />
                    🤖 Neural Network Insight
                  </h3>
                  <p className="text-gray-700">
                    {prediction.aboveMarket ? (
                      <>
                        ✨ <span className="font-bold text-green-600">Premium Property!</span> This property is expected to rent for 
                        {' '}{formatCurrency(Math.abs(prediction.difference))} above market average. 
                        The neural network identifies strong value factors in {formData.area} including:
                        {formData.amenities.length > 0 && ` its ${formData.amenities.length} amenities`}
                        {formData.yearBuilt >= 2020 && `, modern construction (${formData.yearBuilt})`}
                        {formData.bedrooms > 2 && `, and spacious ${formData.bedrooms}-bedroom layout`}.
                      </>
                    ) : (
                      <>
                        💎 <span className="font-bold text-blue-600">Great Value Opportunity!</span> This property is 
                        {formatCurrency(Math.abs(prediction.difference))} below market average. 
                        The neural network suggests excellent potential for rental returns in {formData.area}.
                        {formData.bedrooms > 0 && ` Perfect for ${formData.bedrooms}-bedroom seekers looking for value.`}
                      </>
                    )}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">Price per sqft</div>
                    <div className="font-bold text-gray-700">
                      {formatCurrency(Math.round(prediction.predictedRent / formData.sqft))}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">Monthly Equivalent</div>
                    <div className="font-bold text-gray-700">
                      {formatCurrency(Math.round(prediction.predictedRent / 12))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-bounce">🤖</div>
                <h3 className="text-xl font-semibold mb-2">Enter Property Details</h3>
                <p className="text-gray-600">Fill in the form to get an AI-powered rent prediction using TensorFlow.js neural network</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RentPredictor