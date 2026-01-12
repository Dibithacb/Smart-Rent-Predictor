import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { propertyData } from "../data/propertyData";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaStar,
  FaHeart,
  FaShareAlt,
  FaChartLine,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [comparisonProperties, setComparisonProperties] = useState([]);

  // Load property by id
  useEffect(() => {
    const data = propertyData.find((p) => p.id === id);
    if (data) {
      setProperty(data);
    }
  }, [id]);

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto">
            <p className="mt-4 text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToComparison = () => {
    if (!comparisonProperties.includes(property.id)) {
      setComparisonProperties([...comparisonProperties, property.id]);
      alert("Added to comparison!");
    }
  };

  const getPriceTrendColor = () => {
    switch (property.priceTrend) {
      case "up":
        return "text-green-600 bg-green-50";
      case "down":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPriceTrendIcon = () => {
    switch (property.priceTrend) {
      case "up":
        return "📈";
      case "down":
        return "📉";
      default:
        return "➡";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" />
            Back to Properties
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Property header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-gary-600">
                <FaMapMarkerAlt className="mr-2 text-red-500" />
                <span className="text-lg">
                  {property.location.area},{property.location.emirate}
                </span>
                <MdVerified className="ml-2 text-blue-500" />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-full ${
                  isFavorite
                    ? "bg-red-50 text-red-500"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <FaHeart />
              </button>
              <button className="p-3 bg-gray-100 rounded-full text-gray-600">
                <FaShareAlt />
              </button>
            </div>
          </div>
          {/* Price Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  AED {property.price.toLocaleString()}/year
                </div>
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full ${getPriceTrendColor()}`}
                >
                  <FaChartLine className="mr-2" />
                  <span>
                    {getPriceTrendIcon()} Predicted: AED{" "}
                    {property.predictedPrice?.toLocaleString() || "N/A"}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <button className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Contat Agent
                </button>
                <button
                  onClick={handleAddToComparison}
                  className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Add to Compare
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column -Image & Details */}
          <div className="lg:col-span-2">
            {/* Image Carousal */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <Carousel
                showThumbs={true}
                showStatus={false}
                infiniteLoop
                useKeyboardArrows
                className="rounded-xl"
              >
                {property.images.map((img, index) => (
                  <div key={index} className="h-125">
                    <img
                      src={img}
                      alt={`${property.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </Carousel>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b">
                <nav className="flex">
                  {["overview", "amenities", "neighborhood", "price-trend"].map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-4 text-center font-medium ${
                          activeTab == tab
                            ? "border-b-2 border-primary text-primary"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() +
                          tab.slice(1).replace("-", " ")}
                      </button>
                    )
                  )}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      Property Overview
                    </h3>
                    <p className="text-gary-700 mb-6">{property.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaBed className="text-gray-500 mr-2" />
                          <span className="font-semibold">Bedrooms</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {property.bedrooms}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaBath className="text-gray-500 mr-2" />
                          <span className="font-semibold">Bathrooms</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {property.bathrooms}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaRulerCombined className="text-gray-500 mr-2" />
                          <span className="font-semibold">Square Feet</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {property.sqft}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaStar className="text-gray-500 mr-2" />
                          <span className="font-semibold">Rating</span>
                        </div>
                        <div className="text-2xl font-bold">
                          {property.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "amenities" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      Amenities & Features
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-xl mr-3">
                            {amenity === "pool"
                              ? "🏊‍♂️"
                              : amenity === "gym"
                              ? "💪"
                              : amenity === "parking"
                              ? "🅿️"
                              : amenity === "security"
                              ? "👮"
                              : amenity === "balcony"
                              ? "🌇"
                              : amenity === "garden"
                              ? "🌳"
                              : amenity === "beach"
                              ? "�️"
                              : "🎩"}
                          </span>
                          <span className="font-medium">
                            {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "neighborhood" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      Neighborhood Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-6 rounded-xl">
                        <h4 className="font-bold text-lg mb-4">
                          Area Highlights
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex justify-between">
                            <span>Safety Score</span>
                            <span className="font-bold">9.2/10</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Schools Nearby</span>
                            <span className="font-bold">8.5/10</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Public Transport</span>
                            <span className="font-bold">9.5/10</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Amenities Access</span>
                            <span className="font-bold">9.8/10</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-6 rounded-xl">
                        <h4 className="font-bold text-lg mb-4">Price Trends</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Current Avg.Rent</span>
                              <span className="font-bold">AED 130,000</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: "75%" }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Predicted Change</span>
                              <span className="font-bold text-green-600">
                                +3.5% ↗
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: "85%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "price-trend" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      AI Rent Prediction Analysis
                    </h3>
                    <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-primary mb-2">
                          AED{" "}
                          {property.predictedPrice?.toLocaleString() || "N/A"}
                        </div>
                        <div className="text-gray-600">
                          AI Predicted Annual Rent
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Location Premium</span>
                          <span className="font-bold">+15%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Property Size</span>
                          <span className="font-bold">+8%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Amenities Value</span>
                          <span className="font-bold">+12%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Market Demand</span>
                          <span className="font-bold">+5%</span>
                        </div>
                      </div>
                      <div className="mt-8 p-4 bg-white rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">
                          AI Confidence Score
                        </div>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: "85%" }}
                            ></div>
                          </div>
                          <span className="ml-3 font-bold">85%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/*Contact Agent  */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Contact Agent</h3>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                  👨‍💼
                </div>
                <div className="ml-4">
                  <div className="font-bold">Agmed Hassan</div>
                  <div className="text-gray-600">
                    Certified Real Estate Agent
                  </div>
                  <div className="flex items-center mt-1">
                    <MdVerified className="text-blue-500 mr-1" />
                    <span className="text-sm text-gray-500">
                      Verified Agent
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  <FaPhone className="mr-2" />
                  Call Now
                </button>
                <button className="w-full flex items-center justify-center py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  <FaEnvelope className="mr-2" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Rent Calculator */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">AI Rent Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select className="w-full p-3 border rounded-lg">
                    <option>
                      {property.bedrooms} Bedroom
                      {property.bedrooms !== 1 ? "s" : ""}
                    </option>
                    <option>1 Bedroom</option>
                    <option>2 Bedrooms</option>
                    <option>3 Bedrooms</option>
                    <option>4+ Bedrooms</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Feet
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>500 sqft</span>
                    <span>{property.sqft} sqft</span>
                    <span>5000 sqft</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Calculate Rent Prediction
                </button>
              </div>
            </div>

            {/* Similar Properties */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Similar Properties</h3>
              <div className="space-y-4">
                {propertyData
                  .filter(
                    (p) =>
                      p.id !== property.id &&
                      p.location.area === property.location.area
                  )
                  .slice(0, 3)
                  .map((similar) => (
                    <div
                      key={similar.id}
                      className="flex border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <img
                        src={similar.images[0]}
                        alt={similar.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="ml-4">
                        <div className="font-semibold line-clamp-1">
                          {similar.title}
                        </div>
                        <div className="text-primary font-bold">
                          AED {similar.price.toLocaleString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-3">🛏️ {similar.bedrooms}</span>
                          <span>🚿 {similar.bathrooms}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
