// components/admin/EditProperty.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  FaArrowLeft, FaSave, FaTimes, FaPlus, FaTrash, 
  FaImage, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt,
  FaBuilding, FaStar, FaHeart, FaChartLine,
  FaCheck, FaSpinner, FaLink, FaEye, FaEdit, FaDollarSign
} from 'react-icons/fa';

const URL = import.meta.env.VITE_API_URL;

const EditProperty = () => {
  const { id } = useParams(); // Get property ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeSection, setActiveSection] = useState('basic');
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    price: '',
    predictedPrice: '',
    priceTrend: 'stable',
    type: 'apartment',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    location: {
      lat: '',
      lng: '',
      area: '',
      emirate: 'Dubai'
    },
    amenities: [],
    images: [],
    rating: '',
    reviews: '',
    features: {
      furnished: false,
      view: '',
      floor: ''
    }
  });

  const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
  const propertyTypes = ['apartment', 'villa', 'townhouse', 'penthouse', 'studio'];
  const amenitiesList = [
    { name: 'pool', icon: '🏊', label: 'Swimming Pool' },
    { name: 'gym', icon: '💪', label: 'Gym' },
    { name: 'parking', icon: '🅿️', label: 'Parking' },
    { name: 'security', icon: '👮', label: 'Security' },
    { name: 'balcony', icon: '🌇', label: 'Balcony' },
    { name: 'garden', icon: '🌳', label: 'Garden' },
    { name: 'beach', icon: '🏖️', label: 'Beach Access' },
    { name: 'maid-room', icon: '👩‍🍳', label: "Maid's Room" },
    { name: 'study-room', icon: '📚', label: 'Study Room' },
    { name: 'concierge', icon: '🛎️', label: 'Concierge' }
  ];

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: <FaBuilding /> },
    { id: 'details', label: 'Property Details', icon: <FaBed /> },
    { id: 'location', label: 'Location', icon: <FaMapMarkerAlt /> },
    { id: 'amenities', label: 'Amenities', icon: <FaCheck /> },
    { id: 'media', label: 'Media', icon: <FaImage /> },
    { id: 'features', label: 'Features', icon: <FaStar /> }
  ];

  // Fetch property data on mount
  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setFetching(true);
      console.log('Fetching property with ID:', id);
      
      const response = await axios.get(`${URL}/api/property/getProperty/${id}`, {
        withCredentials: true
      });
      
      console.log('Property data:', response.data);
      const property = response.data.data;
      
      if (property) {
        setFormData({
          id: property.id || '',
          title: property.title || '',
          description: property.description || '',
          price: property.price || '',
          predictedPrice: property.predictedPrice || '',
          priceTrend: property.priceTrend || 'stable',
          type: property.type || 'apartment',
          bedrooms: property.bedrooms || '',
          bathrooms: property.bathrooms || '',
          sqft: property.sqft || '',
          location: {
            lat: property.location?.lat || '',
            lng: property.location?.lng || '',
            area: property.location?.area || '',
            emirate: property.location?.emirate || 'Dubai'
          },
          amenities: property.amenities || [],
          images: property.images || [],
          rating: property.rating || '',
          reviews: property.reviews || '',
          features: {
            furnished: property.features?.furnished || false,
            view: property.features?.view || '',
            floor: property.features?.floor || ''
          }
        });
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      alert('Failed to load property data');
      navigate('/admin');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageAdd = () => {
    const newImage = prompt('Enter image URL:');
    if (newImage && newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
    }
  };

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        predictedPrice: formData.predictedPrice ? parseFloat(formData.predictedPrice) : undefined,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        sqft: parseInt(formData.sqft) || 0,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        reviews: parseInt(formData.reviews) || 0
      };
      
      console.log('Updating property:', propertyData);
      
      await axios.put(`${URL}/api/property/updateProperty/${id}`, propertyData, {
        withCredentials: true
      });
      
      alert('Property updated successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating property:', error);
      alert(error.response?.data?.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Edit Property
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Editing: <span className="font-semibold">{formData.title || 'Untitled'}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Update Property</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Sections</h3>
              <div className="space-y-1">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-linear-to-r from-blue-50 to-purple-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium">{section.label}</span>
                    {activeSection === section.id && (
                      <FaCheck className="ml-auto text-green-500 text-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="flex-1">
            <form>
              {/* Basic Info Section */}
              <div className={`space-y-6 ${activeSection === 'basic' ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Basic Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Details Section */}
              <div className={`space-y-6 ${activeSection === 'details' ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Property Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (AED/year) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Predicted Price
                      </label>
                      <input
                        type="number"
                        name="predictedPrice"
                        value={formData.predictedPrice}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Trend
                      </label>
                      <select
                        name="priceTrend"
                        value={formData.priceTrend}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="up">📈 Upward Trend</option>
                        <option value="down">📉 Downward Trend</option>
                        <option value="stable">➡️ Stable</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        {propertyTypes.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms
                      </label>
                      <div className="relative">
                        <FaBed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          name="bedrooms"
                          value={formData.bedrooms}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bathrooms
                      </label>
                      <div className="relative">
                        <FaBath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          name="bathrooms"
                          value={formData.bathrooms}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Square Feet
                      </label>
                      <div className="relative">
                        <FaRulerCombined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          name="sqft"
                          value={formData.sqft}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Reviews
                      </label>
                      <input
                        type="number"
                        name="reviews"
                        value={formData.reviews}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className={`space-y-6 ${activeSection === 'location' ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Location Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emirate
                      </label>
                      <select
                        name="location.emirate"
                        value={formData.location.emirate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        {emirates.map(emirate => (
                          <option key={emirate} value={emirate}>{emirate}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area
                      </label>
                      <input
                        type="text"
                        name="location.area"
                        value={formData.location.area}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitude
                      </label>
                      <input
                        type="text"
                        name="location.lat"
                        value={formData.location.lat}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitude
                      </label>
                      <input
                        type="text"
                        name="location.lng"
                        value={formData.location.lng}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities Section */}
              <div className={`space-y-6 ${activeSection === 'amenities' ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Amenities</h2>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {amenitiesList.map(amenity => (
                      <button
                        key={amenity.name}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity.name)}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                          formData.amenities.includes(amenity.name)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xl">{amenity.icon}</span>
                        <span className="text-sm font-medium">{amenity.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500">
                      Selected: <span className="font-semibold text-blue-600">{formData.amenities.length}</span> amenities
                    </p>
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className={`space-y-6 ${activeSection === 'media' ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Images</h2>
                  
                  <button
                    type="button"
                    onClick={handleImageAdd}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors mb-4"
                  >
                    <FaLink />
                    <span>Add Image URL</span>
                  </button>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Property ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleImageRemove(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                    
                    {formData.images.length === 0 && (
                      <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                        <FaImage className="text-4xl mx-auto mb-2 text-gray-300" />
                        <p>No images added yet</p>
                        <p className="text-sm">Click "Add Image URL" to add property images</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className={`space-y-6 ${activeSection === 'features' ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Additional Features</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.features.furnished}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            features: { ...prev.features, furnished: e.target.checked }
                          }))}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Fully Furnished</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        View Type
                      </label>
                      <select
                        name="features.view"
                        value={formData.features.view}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select view</option>
                        <option value="sea">Sea View</option>
                        <option value="city">City View</option>
                        <option value="waterfront">Waterfront</option>
                        <option value="golf">Golf View</option>
                        <option value="park">Park View</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Floor Number
                      </label>
                      <input
                        type="number"
                        name="features.floor"
                        value={formData.features.floor}
                        onChange={handleInputChange}
                        placeholder="e.g., 24"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-8 bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-blue-600 to-purple-600 transition-all duration-300"
                        style={{ 
                          width: `${(sections.findIndex(s => s.id === activeSection) + 1) / sections.length * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-sm text-gray-500">
                    Section {sections.findIndex(s => s.id === activeSection) + 1} of {sections.length}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;