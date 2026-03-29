import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaSearch, FaUser, FaHeart, FaHome, FaChartLine, 
  FaMapMarkedAlt, FaExchangeAlt, FaSignOutAlt, FaSignInAlt,
  FaCog, FaUserEdit, FaSpinner
} from 'react-icons/fa';
import { MdMenu, MdClose } from 'react-icons/md';
import axios from 'axios';
import { useFavorites } from '../contexts/FavoriteContext';

const Navbar = ({ onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [search, setSearch] = useState("");
  //const [favoriteCount,setFavoriteCount]=useState(0)
  const [loadingCount,SetLoadingCount]=useState(0)

  const { currentUser, logout, loading } = useAuth();
  const {favoriteCount}=useFavorites()
  console.log("favoriteCount" + favoriteCount)
  const navigate = useNavigate();

  // Use displayUser directly from currentUser - no extra state
  const displayUser = currentUser;

  const navLinks = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Properties', path: '/properties', icon: <FaHome /> },
    { name: 'Map View', path: '/map', icon: <FaMapMarkedAlt /> },
    { name: 'Compare', path: '/compare', icon: <FaExchangeAlt /> },
    { name: 'AI Predictor', path: '/predictor', icon: <FaChartLine /> },
    { name: 'Favorites', path: '/favorites', icon: <FaHeart /> },
  ];

  if(currentUser?.role=="admin"){
    navLinks.push({name:'Admin Dashboard',path:'/admin',icon:<FaCog/>})
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setIsMenuOpen(false);
      setShowUserMenu(false);
      setSearch("");
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (onSearch) onSearch(value);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearch("");
    if (onSearch) onSearch("");
  };

  const getUserInitials = () => {
    if (displayUser?.name) return displayUser.name[0].toUpperCase();
    if (displayUser?.email) return displayUser.email[0].toUpperCase();
    return 'U';
  };

  const getUserDisplayName = () => {
    if (displayUser?.name) return displayUser.name;
    if (displayUser?.email) return displayUser.email.split('@')[0];
    return 'User';
  };

  // REMOVED: console logs that were spamming the console

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
      {/* REMOVED: Debug banner that was causing layout shifts */}
      
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all">
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
                  `flex items-center px-4 py-2 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
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
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <FaSearch className="text-gray-600" />
            </button>

            {/* Favorites with Count */}
            <NavLink to="/favorites" className="p-2 hover:bg-gray-100 rounded-full relative">
            <FaHeart className="text-gray-600" />
            {currentUser && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </NavLink>

            {/* User Profile / Auth - Desktop */}
            {displayUser ? (
              <div className="hidden md:block relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-all"
                  disabled={isLoggingOut}
                >
                  <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {getUserInitials()}
                  </div>
                  <div className="text-sm text-left">
                    <div className="font-medium text-gray-700">
                      {getUserDisplayName()}
                    </div>
                    <div className="text-xs text-gray-500">Logged in</div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {displayUser.email}
                      </p>
                      {displayUser.name && (
                        <p className="text-xs text-gray-500">{displayUser.name}</p>
                      )}
                    </div>
                    
                    {/* <NavLink
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaUserEdit className="mr-3 text-gray-500" />
                      Edit Profile
                    </NavLink>
                    
                    <NavLink
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaCog className="mr-3 text-gray-500" />
                      Settings
                    </NavLink> */}
                    
                    {/* <div className="border-t my-1"></div> */}
                    
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {isLoggingOut ? (
                        <>
                          <FaSpinner className="mr-3 animate-spin" />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <FaSignOutAlt className="mr-3" />
                          Logout
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Sign Up
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                className="w-full p-4 pl-12 pr-24 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={search}
                onChange={handleSearchChange}
                autoFocus
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                onClick={handleCloseSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
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
                    `flex items-center px-4 py-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.name}
                </NavLink>
              ))}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t">
                {displayUser ? (
                  <>
                    <div className="px-4 py-3 flex items-center space-x-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {getUserInitials()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{getUserDisplayName()}</div>
                        <div className="text-xs text-gray-500 truncate">{displayUser.email}</div>
                      </div>
                    </div>

                    {/* <NavLink
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mt-2"
                    >
                      <FaUserEdit className="mr-3 text-gray-500" />
                      Edit Profile
                    </NavLink>

                    <NavLink
                      to="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <FaCog className="mr-3 text-gray-500" />
                      Settings
                    </NavLink> */}

                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-2 border border-red-200 disabled:opacity-50"
                    >
                      {isLoggingOut ? (
                        <>
                          <FaSpinner className="mr-3 animate-spin" />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <FaSignOutAlt className="mr-3" />
                          <span className="font-medium">Logout</span>
                        </>
                      )}
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
                      <span className="font-medium">Login</span>
                    </NavLink>
                    <NavLink
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg mt-2"
                    >
                      <FaUser className="mr-3" />
                      <span className="font-medium">Sign Up</span>
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