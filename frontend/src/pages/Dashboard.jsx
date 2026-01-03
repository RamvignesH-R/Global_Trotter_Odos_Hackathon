import React from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { myTrips, popularDestinations } from '../mockData'; // Ensure this file exists from previous steps!

export default function Dashboard() {
  return (
    <div className="min-h-screen pb-10 bg-gray-50">
      {/* --- HERO SECTION (The Blue Banner) --- */}
      <div className="bg-primary pt-10 pb-24 px-4 rounded-b-3xl shadow-xl relative">
        <div className="max-w-4xl mx-auto text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">Where to next?</h1>
          <p className="text-lg opacity-90">Plan your multi-city adventure in minutes.</p>
        </div>

        {/* --- SEARCH BAR (Floating Card) --- */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-4 flex flex-col md:flex-row items-center gap-4 relative top-6">
          <div className="flex-1 flex items-center px-4 h-14 bg-gray-50 rounded-lg border border-gray-200 w-full hover:border-primary transition">
            <MapPin className="text-gray-400 mr-3" />
            <input type="text" placeholder="Where are you going?" className="bg-transparent w-full outline-none text-gray-700 font-medium" />
          </div>
          <div className="flex-1 flex items-center px-4 h-14 bg-gray-50 rounded-lg border border-gray-200 w-full hover:border-primary transition">
            <Calendar className="text-gray-400 mr-3" />
            <input type="text" placeholder="Add dates" className="bg-transparent w-full outline-none text-gray-700 font-medium" />
          </div>
          <button className="h-14 px-8 bg-secondary text-white font-bold rounded-lg hover:bg-orange-600 transition w-full md:w-auto shadow-lg">
            Search
          </button>
        </div>
      </div>

      {/* --- YOUR TRIPS SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Trips</h2>
          <Link to="/create-trip" className="text-primary font-bold hover:underline flex items-center bg-blue-50 px-4 py-2 rounded-lg transition">
            + Plan New Trip
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {myTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300 group">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img src={trip.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={trip.title} />
                <span className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm uppercase tracking-wider">
                  {trip.status}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-800 mb-2">{trip.title}</h3>
                <p className="text-gray-500 text-sm mb-4 flex items-center">
                  <Calendar size={14} className="mr-2"/> {trip.dates} 
                </p>
                <div className="flex justify-between items-center border-t pt-4">
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase">Budget</span>
                    <p className="text-green-600 font-bold text-lg">${trip.budget}</p>
                  </div>
                  <Link to={`/builder/${trip.id}`} className="text-primary text-sm font-bold flex items-center hover:bg-blue-50 px-3 py-2 rounded transition">
                    View <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- TRENDING SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Trending Destinations</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {popularDestinations.map((dest, idx) => (
            <div key={idx} className="relative group rounded-2xl overflow-hidden cursor-pointer h-72 shadow-lg">
              <img src={dest.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={dest.city} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold">{dest.city}</h3>
                <p className="opacity-90">{dest.country}</p>
                <div className="mt-2 inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-medium">
                  Avg. {dest.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}