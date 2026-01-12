import React from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkedAlt,
  FaChartLine,
  FaSearch,
  FaExchangeAlt,
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold mb-4">Smart Rent Predictor</h1>
          <p className="text-xl mb-8 opacity-90">
            AI-powered rental platform for UAE. Find your perfect home with
            intelligent rent estimation.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/properties"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              to="/predictor"
              className="bg-transparant border-2 border-white px-8 py-3 reounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              Try AI Predictor
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl text-blue-600 mb-4">
              <FaMapMarkedAlt />
            </div>
            <h3 className="text-xl font-bold mb-2">Intercative Map</h3>
            <p className="text-gray-600">
              Explore properties across UAE with our interactive map view.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl text-green-600 mb-4">
              <FaChartLine />
            </div>
            <h3 className="text-4xl font-bold mb-2">AI Predictions</h3>
            <p className="text-gray-600">
              Get accurate rent predictions using machine learning algorithms.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl text-purple-600 mb-4">
              <FaSearch />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Search</h3>
            <p className="text-gray-600">
              Advanced filters to find properties matching your exact needs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl text-orange-600 mb-4">
              <FaExchangeAlt />
            </div>
            <h3 className="text-xl font-bold mb-2">Compare Properties</h3>
            <p className="text-gray-600">
              Side-by-side comparison to make the best decision.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who found their ideal rental property using
            our AI-powered platform.
          </p>
          <Link to="/properties" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
          Start Exploring Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
