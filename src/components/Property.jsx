import React, { useState } from "react";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaStar,
  FaHeart,
  FaChartLine,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { NavLink } from "react-router-dom";

const Property = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const getPriceTrendIcon = () => {
    switch (property.priceTrend) {
      case "up":
        return "📈";
      case "down":
        return "📉";
      default:
        return "➡️";
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={handleFavorite}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-red-100 transition-colors"
          >
            <FaHeart
              className={isFavorite ? "text-red-500" : "text-gray-400"}
            />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          AED {property.price.toLocaleString()}/year
        </div>
        {/* {property.predictedPrice && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
            <span className="flex items-center gap-1">
              <FaChartLine className={property.priceTrend === 'up' ? 'text-green-500' : property.priceTrend === 'down' ? 'text-red-500' : 'text-gray-500'}/>
              <span className={property.priceTrend === 'up' ? 'text-green-600' : property.priceTrend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                {getPriceTrendIcon()} Predicted: AED {property.predictedPrice.toLocaleString()} 
              </span>
            </span>

          </div>
        )} */}
      </div>

      {/* Property Details */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{property.title}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MdLocationOn className="text-red-500 mr-1" />
          <span className="text-sm">{property.location.area}, {property.location.emirate}</span>
        </div>

        {/* Property Features */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaBed className="text-gray-500 mr-2" />
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <FaBath className="text-gray-500 mr-2" />
              <span className="font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <FaRulerCombined className="text-gray-500 mr-2" />
              <span className="font-medium">{property.sqft} sqft</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="font-bold">{property.rating}</span>
            <span className="text-gray-500 text-sm ml-1">({property.reviews})</span>
          </div>
        </div>

        {/* Amenities Preview */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <NavLink 
            to={`/properties/${property.id}`}
            className="flex-1 bg-primary text-white text-center py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Details
          </NavLink>
          <button className="px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Compare
          </button>
        </div>
      </div>
    </div>
  )
}
export default Property;
