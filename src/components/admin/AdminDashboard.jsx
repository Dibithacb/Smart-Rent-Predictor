// components/admin/AdminDashboard.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaHome, FaBuilding, FaChartLine, FaSignOutAlt, FaPlus, FaEdit, FaTrash,
  FaEye, FaBed, FaBath, FaRulerCombined, FaSearch, FaTimes, FaTimesCircle,
  FaHeart, FaStar, FaBars, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaCalendarAlt, FaDollarSign, FaChevronDown, FaChevronUp
} from 'react-icons/fa';

const URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmirate, setFilterEmirate] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

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

  const [stats, setStats] = useState({
    totalProperties: 0,
    totalVillas: 0,
    totalApartments: 0,
    avgPrice: 0,
    avgRating: 0
  });

  const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
  const propertyTypes = ['apartment', 'villa', 'townhouse', 'penthouse', 'studio'];
  const amenitiesList = ['pool', 'gym', 'parking', 'security', 'balcony', 'garden', 'beach', 'maid-room', 'study-room', 'concierge'];

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      navigate('/properties');
      return;
    }
    fetchProperties();
  }, [currentUser, navigate]);

  // Close sidebar on resize if screen becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/api/property/getProperties`);
      const propertyData = response.data.data || response.data;
      setProperties(propertyData);
      
      const villas = propertyData.filter(p => p.type === 'villa');
      const apartments = propertyData.filter(p => p.type === 'apartment');
      const avgPrice = propertyData.reduce((sum, p) => sum + (p.price || 0), 0) / (propertyData.length || 1);
      const avgRating = propertyData.reduce((sum, p) => sum + (p.rating || 0), 0) / (propertyData.length || 1);
      
      setStats({
        totalProperties: propertyData.length,
        totalVillas: villas.length,
        totalApartments: apartments.length,
        avgPrice: Math.round(avgPrice),
        avgRating: avgRating.toFixed(1)
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
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
    if (newImage) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
    }
  };

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
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
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    try {
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        predictedPrice: formData.predictedPrice ? parseFloat(formData.predictedPrice) : undefined,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        sqft: parseInt(formData.sqft),
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        reviews: parseInt(formData.reviews) || 0
      };
      
      await axios.post(`${URL}/api/property/createProperty`, propertyData, {
        withCredentials: true
      });
      alert('Property created successfully!');
      setShowAddModal(false);
      resetForm();
      fetchProperties();
    } catch (error) {
      console.error('Error creating property:', error);
      alert(error.response?.data?.message || 'Failed to create property');
    }
  };

  const handleEditClick = (property) => {
    setSelectedProperty(property);
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
    setShowEditModal(true);
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();
    try {
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        predictedPrice: formData.predictedPrice ? parseFloat(formData.predictedPrice) : undefined,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        sqft: parseInt(formData.sqft),
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        reviews: parseInt(formData.reviews) || 0
      };
      
      await axios.put(`${URL}/api/property/updateProperty/${selectedProperty._id}`, propertyData, {
        withCredentials: true
      });
      alert('Property updated successfully!');
      setShowEditModal(false);
      resetForm();
      fetchProperties();
    } catch (error) {
      console.error('Error updating property:', error);
      alert(error.response?.data?.message || 'Failed to update property');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`${URL}/api/property/deleteProperty/${propertyId}`, {
          withCredentials: true
        });
        alert('Property deleted successfully!');
        fetchProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
        alert(error.response?.data?.message || 'Failed to delete property');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleRowExpand = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchTerm === '' || 
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.emirate?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEmirate = filterEmirate === '' || property.location?.emirate === filterEmirate;
    
    return matchesSearch && matchesEmirate;
  });

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-linear-to-r from-blue-800 to-purple-800 text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            <FaBars size={24} />
          </button>
          <div className="flex items-center space-x-2">
            <FaHome className="text-xl" />
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="p-2">
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      {/* <nav className="hidden md:block bg-linear-to-r from-blue-800 to-purple-800 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <FaHome className="text-2xl" />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <span className="text-sm bg-yellow-500 text-gray-900 px-2 py-1 rounded">
                {currentUser?.role?.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm hidden lg:block">{currentUser?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav> */}

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Responsive */}
        <div className={`
          fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:block min-h-screen
        `}>
          <div className="p-4">
            {/* Mobile User Info */}
            <div className="md:hidden border-b pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <div>
                  <p className="font-medium">{currentUser?.email?.split('@')[0]}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
              </div>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaChartLine />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('properties');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'properties' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaBuilding />
                <span>Properties</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content - Responsive */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-6">Dashboard Overview</h2>
              
              {/* Stats Cards - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs sm:text-sm">Total Properties</p>
                      <p className="text-2xl sm:text-3xl font-bold">{stats.totalProperties}</p>
                    </div>
                    <FaBuilding className="text-blue-500 text-3xl sm:text-4xl" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs sm:text-sm">Villas</p>
                      <p className="text-2xl sm:text-3xl font-bold">{stats.totalVillas}</p>
                    </div>
                    <FaHome className="text-green-500 text-3xl sm:text-4xl" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs sm:text-sm">Apartments</p>
                      <p className="text-2xl sm:text-3xl font-bold">{stats.totalApartments}</p>
                    </div>
                    <FaBuilding className="text-purple-500 text-3xl sm:text-4xl" />
                  </div>
                </div>
                
                {/* <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs sm:text-sm">Average Price</p>
                      <p className="text-lg sm:text-xl font-bold">{formatPrice(stats.avgPrice)}</p>
                    </div>
                    <FaDollarSign className="text-red-500 text-3xl sm:text-4xl" />
                  </div>
                </div> */}
              </div>

              {/* Recent Properties - Responsive */}
              
            </div>
          )}

          {activeTab === 'properties' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Manage Properties</h2>
                <button
                  onClick={() => navigate('/admin/add-property')}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto justify-center"
                >
                  <FaPlus />
                  <span>Add Property</span>
                </button>
              </div>

              {/* Search and Filter - Responsive */}
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by title, area, or emirate..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <select
                      value={filterEmirate}
                      onChange={(e) => setFilterEmirate(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Emirates</option>
                      {emirates.map(emirate => (
                        <option key={emirate} value={emirate}>{emirate}</option>
                      ))}
                    </select>
                  </div>
                  {(searchTerm || filterEmirate) && (
                    <button
                      onClick={() => { setSearchTerm(''); setFilterEmirate(''); }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>

              {/* Properties Table - Desktop */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bed/Bath/Sqft</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProperties.map(property => (
                        <tr key={property._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <img src={property.images?.[0] || 'https://via.placeholder.com/50'} alt={property.title} className="w-10 h-10 object-cover rounded" />
                          </td>
                          <td className="px-4 py-3 font-medium max-w-xs truncate">{property.title}</td>
                          <td className="px-4 py-3">{formatPrice(property.price)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="flex items-center"><FaBed className="mr-1" size={12} />{property.bedrooms}</span>
                              <span className="flex items-center"><FaBath className="mr-1" size={12} />{property.bathrooms}</span>
                              <span className="flex items-center"><FaRulerCombined className="mr-1" size={12} />{property.sqft}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{property.location?.area}, {property.location?.emirate}</td>
                          <td className="px-4 py-3 capitalize text-sm">{property.type}</td>
                          <td className="px-4 py-3 text-sm">{property.rating} ⭐ ({property.reviews})</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button onClick={() => navigate(`/admin/edit-property/${property._id}`)} className="text-green-600 hover:text-green-800" title="Edit">
                                <FaEdit />
                              </button>
                              <button onClick={() => handleDeleteProperty(property._id)} className="text-red-600 hover:text-red-800" title="Delete">
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Tablet View - 2 column grid */}
                <div className="hidden md:block lg:hidden">
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {filteredProperties.map(property => (
                      <div key={property._id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                        <img src={property.images?.[0] || 'https://via.placeholder.com/200'} alt={property.title} className="w-full h-32 object-cover" />
                        <div className="p-3">
                          <h4 className="font-semibold text-gray-800 truncate">{property.title}</h4>
                          <p className="text-blue-600 font-bold text-sm">{formatPrice(property.price)}</p>
                          <div className="flex items-center text-gray-500 text-xs mt-1">
                            <FaMapMarkerAlt className="mr-1 text-red-400" size={10} />
                            <span>{property.location?.area}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center space-x-2 text-xs">
                              <span><FaBed className="inline mr-1" size={10} />{property.bedrooms}</span>
                              <span><FaBath className="inline mr-1" size={10} />{property.bathrooms}</span>
                              <span><FaRulerCombined className="inline mr-1" size={10} />{property.sqft}</span>
                            </div>
                            <div className="flex space-x-2">
                              <button onClick={() => navigate(`/admin/edit-property/${property._id}`)} className="text-green-600">
                                <FaEdit size={14} />
                              </button>
                              <button onClick={() => handleDeleteProperty(property._id)} className="text-red-600">
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile View - Card with expand */}
                <div className="md:hidden">
                  {filteredProperties.map(property => {
                    const isExpanded = expandedRows[property._id];
                    return (
                      <div key={property._id} className="border-b border-gray-200 last:border-b-0">
                        <div className="p-4 hover:bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <img src={property.images?.[0] || 'https://via.placeholder.com/60'} alt={property.title} className="w-14 h-14 object-cover rounded" />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-gray-800">{property.title}</h4>
                                  <p className="text-blue-600 font-bold text-sm">{formatPrice(property.price)}</p>
                                </div>
                                <button onClick={() => toggleRowExpand(property._id)} className="text-gray-500">
                                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                              </div>
                              <div className="flex items-center text-gray-500 text-xs mt-1">
                                <FaMapMarkerAlt className="mr-1 text-red-400" size={10} />
                                <span>{property.location?.area}, {property.location?.emirate}</span>
                              </div>
                              <div className="flex items-center space-x-3 mt-2 text-xs">
                                <span><FaBed className="inline mr-1" />{property.bedrooms} beds</span>
                                <span><FaBath className="inline mr-1" />{property.bathrooms} baths</span>
                                <span>{property.sqft} sqft</span>
                                <span className="capitalize bg-gray-100 px-2 py-0.5 rounded">{property.type}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Expandable Details */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600 text-sm">Rating:</span>
                                <span>{property.rating} ⭐ ({property.reviews} reviews)</span>
                              </div>
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-600 text-sm">Amenities:</span>
                                <span className="text-sm">{property.amenities?.length || 0} amenities</span>
                              </div>
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => navigate(`/admin/edit-property/${property._id}`)}
                                  className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm flex items-center justify-center space-x-1"
                                >
                                  <FaEdit size={12} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteProperty(property._id)}
                                  className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm flex items-center justify-center space-x-1"
                                >
                                  <FaTrash size={12} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredProperties.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FaBuilding className="text-4xl mx-auto mb-3 text-gray-300" />
                    <p>No properties found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modals remain the same but add responsive classes */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal content - same as before but with responsive padding */}
            <div className="p-4 sm:p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-bold">Add New Property</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimesCircle size={24} />
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateProperty} className="p-4 sm:p-6">
              {/* Form fields - keep same but ensure responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* ... existing form fields ... */}
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 order-2 sm:order-1">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 order-1 sm:order-2">
                  Create Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal - similar responsive styling */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-bold">Edit Property</h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimesCircle size={24} />
                </button>
              </div>
            </div>
            <form onSubmit={handleUpdateProperty} className="p-4 sm:p-6">
              {/* Form fields */}
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 order-2 sm:order-1">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 order-1 sm:order-2">
                  Update Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;