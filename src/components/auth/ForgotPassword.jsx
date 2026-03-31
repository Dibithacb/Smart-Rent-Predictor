// components/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaSpinner, FaCheckCircle, FaTimesCircle, FaCopy } from 'react-icons/fa';
import axios from 'axios';

const URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [resetLink, setResetLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setLoading(true);
    setStatus(null);
    setResetLink('');
    
    try {
      console.log('Sending request to:', `${URL}/api/users/forgot-password`);
      console.log('With email:', email);
      
      const response = await axios.post(`${URL}/api/users/forgot-password`, {
        email
      });
      
      console.log('Response:', response.data);
      
      setStatus('success');
      setMessage(response.data.message);
      
      // ✅ Check for resetLink in response
      if (response.data.resetLink) {
        console.log('Reset link received:', response.data.resetLink);
        setResetLink(response.data.resetLink);
      } else {
        console.log('No reset link in response');
      }
      
    } catch (error) {
      console.error('Forgot password error:', error);
      setStatus('error');
      setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resetLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                <FaEnvelope className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
              <p className="text-gray-600 mt-2">
                Enter your email address to reset your password.
              </p>
            </div>

            {status && (
              <div className={`mb-6 p-4 rounded-lg ${
                status === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start space-x-3">
                  {status === 'success' ? (
                    <FaCheckCircle className="text-green-500 text-xl shrink-0 mt-0.5" />
                  ) : (
                    <FaTimesCircle className="text-red-500 text-xl shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm ${status === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                      {message}
                    </p>
                    {resetLink && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-800 font-semibold mb-2">🔗 Your Reset Link:</p>
                        <div className="bg-white p-2 rounded border border-blue-200 mb-2 break-all">
                          <a 
                            href={resetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline break-all"
                          >
                            {resetLink}
                          </a>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={copyToClipboard}
                            className="flex items-center justify-center space-x-1 text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200 transition-colors"
                          >
                            <FaCopy size={12} />
                            <span>Copy Link</span>
                          </button>
                          <a
                            href={resetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded hover:bg-green-200 transition-colors"
                          >
                            Open Link
                          </a>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          ⏰ This link expires in 1 hour
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;