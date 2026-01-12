import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaSearch, FaUser, FaHeart, FaHome, FaChartLine, FaMapMarkedAlt } from 'react-icons/fa'
import { MdMenu, MdClose,MdCompareArrows  } from 'react-icons/md'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navLinks = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Properties', path: '/properties', icon: <FaHome /> },
    { name: 'Map View', path: '/map', icon: <FaMapMarkedAlt /> },
    { name: 'Compare', path: '/compare', icon: <MdCompareArrows  /> },
    { name: 'AI Predictor', path: '/predictor', icon: <FaChartLine /> },
    { name: 'Favorites', path: '/favorites', icon: <FaHeart /> },
  ]

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

            {/* User Profile */}
            <button className="hidden md:flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <FaUser />
              </div>
              <span className="font-medium">Profile</span>
            </button>

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
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Search
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
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar