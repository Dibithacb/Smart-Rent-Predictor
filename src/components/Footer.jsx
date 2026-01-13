import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaPhone,
  FaHome,
  FaMapMarkedAlt,
  FaFileContract,
  FaEnvelope,
  FaLocationArrow,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaHome className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">HomeWorth</h2>
                <p className="text-gray-400 text-sm">AI Rent Predictor</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Your trusted partner in finding the perfect rental property with
              AI-powered insights and accurate price predictions.
            </p>
            <div className="flex space-x-4 gap-4">
              <a href="">
                <FaFacebook size={20} />
              </a>
              <a href="">
                <FaTwitter size={20} />
              </a>
              <a href="">
                <FaInstagram size={20} />
              </a>
              <a href="">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-all flex items-center"
                >
                  <FaHome className="mr-3" size={16} />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/properties"
                  className="text-gray-400 hover:text-white transition-all flex items-center"
                >
                  <FaHome className="mr-3" size={16} />
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/map"
                  className="text-gray-400 hover:text-white transition-all flex items-center"
                >
                  <FaMapMarkedAlt className="mr-3" size={16} />
                  Map View
                </Link>
              </li>
              <li>
                <Link
                  to="/compare"
                  className="text-gray-400 hover:text-white transition-all flex items-center"
                >
                  <FaFileContract className="mr-3" size={16} />
                  Compare Properties
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaEnvelope className="mt-1 mr-3 text-blue-400" size={16} />
                <div>
                  <span className="text-gray-400">Email</span>
                  <p className="text-gray-300">support@homeworth.ae</p>
                </div>
              </li>
              <li className="flex items-start">
                <FaPhone className="mt-1 mr-3 text-blue-400" size={16} />
                <div>
                  <span className="text-gray-400">Phone</span>
                  <p className="text-gray-300">+971 4 123 4567</p>
                </div>
              </li>
              <li className="flex items-start">
                <MdLocationOn className="mt-1 mr-3 text-red-400" size={16} />
                <div>
                  <span className="text-gray-400">Address</span>
                  <p className="text-gray-300">Business Bay, Dubai<br />
                    United Arab Emirates</p>
                </div>
              </li>
            </ul>
          </div>

          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
