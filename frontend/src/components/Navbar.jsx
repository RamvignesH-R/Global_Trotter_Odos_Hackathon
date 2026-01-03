import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, User, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isLoggedIn = localStorage.getItem('userId');

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'Traveler';
    setUserName(storedName);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Don't show navbar on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 text-primary font-bold text-xl">
            <Compass className="h-8 w-8" />
            <span>GlobeTrotter</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`font-medium transition ${
                    location.pathname === '/dashboard' 
                      ? 'text-primary' 
                      : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/create-trip" 
                  className={`font-medium transition ${
                    location.pathname === '/create-trip' 
                      ? 'text-primary' 
                      : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  Create Trip
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer">
                      {getInitials(userName)}
                    </div>
                  </button>

                  {showDropdown && (
                    <>
                      {/* Overlay to close dropdown when clicking outside */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowDropdown(false)}
                      ></div>
                      
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                          <p className="text-xs text-gray-500 truncate">{localStorage.getItem('userEmail')}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setShowDropdown(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          View Profile
                        </Link>
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            handleLogout();
                          }}
                          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="font-medium text-gray-700 hover:text-primary transition">
                  Login
                </Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {isLoggedIn ? (
              <>
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {getInitials(userName)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{userName}</p>
                      <p className="text-sm text-gray-500">{localStorage.getItem('userEmail')}</p>
                    </div>
                  </div>
                </div>
                <Link 
                  to="/dashboard" 
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/create-trip" 
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Create Trip
                </Link>
                <Link 
                  to="/profile" 
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-4 py-3 text-primary font-semibold hover:bg-gray-50"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}