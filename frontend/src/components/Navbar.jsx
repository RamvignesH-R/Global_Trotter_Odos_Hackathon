import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { currentUser } from '../mockData';

export default function Navbar() {
  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2">
            <Compass className="h-8 w-8 text-secondary" />
            <span className="text-xl font-bold tracking-wide">GlobeTrotter</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/dashboard" className="hover:text-secondary transition">Dashboard</Link>
            <Link to="/create-trip" className="hover:text-secondary transition">Plan a Trip</Link>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <span className="hidden md:block text-sm">{currentUser.name}</span>
            <img src={currentUser.avatar} alt="User" className="h-10 w-10 rounded-full border-2 border-secondary" />
          </div>
        </div>
      </div>
    </nav>
  );
}