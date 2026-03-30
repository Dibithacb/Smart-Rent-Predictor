// components/admin/EditProperty.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  FaArrowLeft, FaSave, FaPlus, FaTrash, 
  FaImage, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt,
  FaBuilding, FaStar, FaCheck, FaSpinner, FaLink, FaEye, FaDollarSign
} from 'react-icons/fa';

const URL = import.meta.env.VITE_API_URL;
const FALLBACK_IMAGE = 'https://placehold.co/400x300/3498db/white?text=No+Image';

const EditProperty = () => {
  const { id } = useParams();
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

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setFetching(true);
      console.log('🔍 Fetching property with ID:', id);
      
      const response = await axios.get(`${URL}/api/property/getProperty/${id}`, {
        withCredentials: true
      });
      
      console.log('✅ Property data received:', response.data);
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
      console.error('❌ Error fetching property:', error);
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
        id: formData.id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        predictedPrice: formData.predictedPrice ? parseFloat(formData.predictedPrice) : undefined,
        priceTrend: formData.priceTrend,
        type: formData.type,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        sqft: parseInt(formData.sqft) || 0,
        location: {
          lat: formData.location.lat ? parseFloat(formData.location.lat) : undefined,
          lng: formData.location.lng ? parseFloat(formData.location.lng) : undefined,
          area: formData.location.area,
          emirate: formData.location.emirate
        },
        amenities: formData.amenities,
        images: formData.images,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        reviews: parseInt(formData.reviews) || 0,
        features: {
          furnished: formData.features.furnished,
          view: formData.features.view,
          floor: formData.features.floor ? parseInt(formData.features.floor) : undefined
        }
      };
      
      console.log('📤 Updating property at:', `${URL}/api/property/updateProperty/${id}`);
      console.log('📦 Update data:', propertyData);
      
      // ✅ Make sure the endpoint matches your backend route
      const response = await axios.put(`${URL}/api/property/updateProperty/${id}`, propertyData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Update response:', response.data);
      
      if (response.data.success) {
        alert('✅ Property updated successfully!');
        navigate('/admin');
      } else {
        alert(response.data.message || 'Failed to update property');
      }
    } catch (error) {
      console.error('❌ Error updating property:', error);
      console.error('❌ Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        alert('❌ You are not authorized. Please login as admin.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert('❌ You do not have admin privileges.');
      } else if (error.response?.status === 404) {
        alert('❌ Property not found or update endpoint is incorrect.\n\nMake sure your backend route is: PUT /api/property/updateProperty/:id');
      } else if (error.response?.status === 400) {
        alert(`❌ Invalid data: ${error.response.data?.message || 'Please check your inputs.'}`);
      } else {
        alert(`❌ Failed to update property: ${error.response?.data?.message || 'Unknown error occurred'}`);
      }
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
              <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-full">
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
              <button onClick={() => navigate('/admin')} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 disabled:opacity-50"
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
                    {activeSection === section.id && <FaCheck className="ml-auto text-green-500" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Form - Simplified for clarity */}
          <div className="flex-1">
            <form>
              {/* Basic Info Section */}
              <div className={`space-y-6 ${activeSection === 'basic' ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Property ID *</label>
                      <input type="text" name="id" value={formData.id} onChange={handleInputChange} className="w-full border rounded-lg p-2" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full border rounded-lg p-2" required />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Description *</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full border rounded-lg p-2" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (AED/year) *</label>
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border rounded-lg p-2" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Property Type</label>
                      <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border rounded-lg p-2">
                        {propertyTypes.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bedrooms</label>
                      <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="w-full border rounded-lg p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bathrooms</label>
                      <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full border rounded-lg p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Square Feet</label>
                      <input type="number" name="sqft" value={formData.sqft} onChange={handleInputChange} className="w-full border rounded-lg p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Emirate</label>
                      <select name="location.emirate" value={formData.location.emirate} onChange={handleInputChange} className="w-full border rounded-lg p-2">
                        {emirates.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Area</label>
                      <input type="text" name="location.area" value={formData.location.area} onChange={handleInputChange} className="w-full border rounded-lg p-2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-8 bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-blue-600 to-purple-600 transition-all duration-300" style={{ width: `${(sections.findIndex(s => s.id === activeSection) + 1) / sections.length * 100}%` }} />
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