import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, User, LogOut, Settings } from 'lucide-react';
import { currentUser } from '../mockData';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Compass className="h-8 w-8 text-secondary" />
            <span className="text-xl font-bold tracking-wide">GlobeTrotter</span>
          </Link>

          {/* Navigation Links (Added Community!) */}
          <div className="hidden md:flex space-x-8">
            <Link to="/dashboard" className="hover:text-secondary transition font-medium">Dashboard</Link>
            <Link to="/create-trip" className="hover:text-secondary transition font-medium">Plan a Trip</Link>
            <Link to="/community" className="hover:text-secondary transition font-medium">Community</Link>
          </div>

          {/* Profile Dropdown (Goibibo Style) */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 focus:outline-none hover:bg-blue-800 px-3 py-2 rounded-lg transition"
            >
              <span className="hidden md:block text-sm font-semibold">{currentUser.name}</span>
              <div className="h-10 w-10 rounded-full border-2 border-secondary overflow-hidden">
                <img src={currentUser.avatar} alt="User" className="h-full w-full object-cover" />
              </div>
            </button>

            {/* The Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 text-gray-800 z-50 border border-gray-100">
                <Link to="/profile" className="block px-4 py-2 hover:bg-blue-50 flex items-center">
                  <User size={16} className="mr-2 text-gray-500" /> My Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 hover:bg-blue-50 flex items-center">
                  <Settings size={16} className="mr-2 text-gray-500" /> Settings
                </Link>
                <div className="border-t my-1"></div>
                <Link to="/login" className="block px-4 py-2 hover:bg-red-50 text-red-600 flex items-center">
                  <LogOut size={16} className="mr-2" /> Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}