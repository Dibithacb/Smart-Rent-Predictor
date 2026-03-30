import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaSearch, FaUser, FaHeart, FaHome, FaChartLine, 
  FaMapMarkedAlt, FaExchangeAlt, FaSignOutAlt, FaSignInAlt,
  FaCog, FaSpinner
} from 'react-icons/fa';
import { MdMenu, MdClose } from 'react-icons/md';
import { useFavorites } from '../contexts/FavoriteContext';

const Navbar = ({ onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [search, setSearch] = useState("");

  const { currentUser, logout, loading } = useAuth();
  const { favoriteCount } = useFavorites();
  const navigate = useNavigate();

  const displayUser = currentUser;

  let navLinks = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Properties', path: '/properties', icon: <FaHome /> },
    { name: 'Map View', path: '/map', icon: <FaMapMarkedAlt /> },
    { name: 'Compare', path: '/compare', icon: <FaExchangeAlt /> },
    { name: 'AI Predictor', path: '/predictor', icon: <FaChartLine /> },
    { name: 'Favorites', path: '/favorites', icon: <FaHeart /> },
  ];

  if (currentUser?.role === "admin") {
    navLinks.push({ name: 'Admin Dashboard', path: '/admin', icon: <FaCog /> });
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
          <NavLink to="/" className="flex items-center space-x-2 group shrink-0">
            <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all">
              <FaHome className="text-white text-xl" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">HomeWorth</h1>
              <p className="text-xs text-gray-500">AI Rent Predictor</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-lg transition-all text-sm ${
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

          {/* Right Side Actions - CORRECTED: smaller on mobile, larger on desktop */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
              aria-label="Search"
            >
              <FaSearch className="text-gray-600 text-sm sm:text-base" />
            </button>

            {/* Favorites with Count */}
            <NavLink 
              to="/favorites" 
              className="p-1 sm:p-2 hover:bg-gray-100 rounded-full relative shrink-0"
            >
              <FaHeart className="text-gray-600 text-sm sm:text-base" />
              {currentUser && favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                  {favoriteCount > 99 ? '99+' : favoriteCount}
                </span>
              )}
            </NavLink>

            {/* User Profile / Auth - Desktop */}
            {displayUser ? (
              <div className="hidden md:block relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 sm:space-x-2 hover:bg-gray-100 rounded-lg px-1 sm:px-2 py-1 transition-all"
                  disabled={isLoggingOut}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                    {getUserInitials()}
                  </div>
                  <div className="text-sm text-left hidden lg:block">
                    <div className="font-medium text-gray-700 max-w-25 truncate">
                      {getUserDisplayName()}
                    </div>
                    <div className="text-xs text-gray-500">Logged in</div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {displayUser.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {isLoggingOut ? (
                          <>
                            <FaSpinner className="mr-2 animate-spin" />
                            Logging out...
                          </>
                        ) : (
                          <>
                            <FaSignOutAlt className="mr-2" />
                            Logout
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
                <NavLink
                  to="/login"
                  className="px-2 sm:px-3 py-1 sm:py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors text-sm"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-2 sm:px-3 py-1 sm:py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all text-sm"
                >
                  Sign Up
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <MdClose size={20} className="sm:w-6 sm:h-6" /> : <MdMenu size={20} className="sm:w-6 sm:h-6" />}
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
                className="w-full p-3 pl-10 pr-20 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                value={search}
                onChange={handleSearchChange}
                autoFocus
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <button
                onClick={handleCloseSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t mt-2">
            <div className="py-2 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto">
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
              <div className="pt-2 border-t mt-2">
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

                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-2 border border-red-200 disabled:opacity-50"
                    >
                      {isLoggingOut ? (
                        <>
                          <FaSpinner className="mr-2 animate-spin" />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <FaSignOutAlt className="mr-2" />
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