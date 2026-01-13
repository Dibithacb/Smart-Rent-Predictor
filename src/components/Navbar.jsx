import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaUser, FaHeart, FaHome, FaChartLine, FaMapMarkedAlt, FaExchangeAlt, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { MdMenu, MdClose } from 'react-icons/md';

const Navbar = ({onSearch}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search,setSearch]=useState("")

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };
 
  const authContext = useAuth();
  
  const { currentUser, logout, loading } = authContext;
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Properties', path: '/properties', icon: <FaHome /> },
    { name: 'Map View', path: '/map', icon: <FaMapMarkedAlt /> },
    { name: 'Compare', path: '/compare', icon: <FaExchangeAlt /> },
    { name: 'AI Predictor', path: '/predictor', icon: <FaChartLine /> },
    { name: 'Favorites', path: '/favorites', icon: <FaHeart /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading state in Navbar
  if (loading) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaHome className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HomeWorth</h1>
                <p className="text-xs text-gray-500">AI Rent Predictor</p>
              </div>
            </div>
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FaHome className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HomeWorth</h1>
              <p className="text-xs text-gray-500">AI Rent Predictor</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="mr-2">{link.icon}</span>
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FaSearch />
            </button>

            {/* Favorites with Count */}
            <NavLink
              to="/favorites"
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <FaHeart />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </NavLink>

            {/* User Profile / Auth */}
            {currentUser ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {currentUser.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium truncate max-w-30">
                      {currentUser.email?.split('@')[0] || 'User'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaSignOutAlt className="mr-1" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                >
                  <FaSignInAlt className="inline mr-1" />
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by location, property type, or amenities..."
                className="w-full p-4 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={search}
          onChange={handleSearchChange}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {/* <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Search
              </button> */}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="py-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.name}
                </NavLink>
              ))}

              {/* Auth in Mobile Menu */}
              <div className="pt-4 border-t">
                {currentUser ? (
                  <>
                    <div className="px-4 py-3 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {currentUser.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-medium">{currentUser.email?.split('@')[0] || 'User'}</div>
                        <div className="text-sm text-gray-500">Logged in</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg flex items-center"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <FaSignInAlt className="mr-3" />
                      Login
                    </NavLink>
                    <NavLink
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg mt-2"
                    >
                      <FaUser className="mr-3" />
                      Sign Up
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;