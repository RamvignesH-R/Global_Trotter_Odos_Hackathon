import React from 'react';
import { Heart, Share2, MapPin } from 'lucide-react';
import { popularDestinations } from '../mockData'; // Reusing mock data for demo

export default function Community() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-primary py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-white">Travel Community</h1>
        <p className="text-blue-100 mt-2">Discover itineraries created by travelers like you.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* We duplicate the mock data to make the list look longer */}
        {[...popularDestinations, ...popularDestinations].map((trip, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
            <div className="h-48 relative">
              <img src={trip.image} className="w-full h-full object-cover" alt={trip.city} />
              <div className="absolute top-3 right-3 flex space-x-2">
                <button className="bg-white/90 p-2 rounded-full text-red-500 hover:scale-110 transition">
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center mb-2">
                <img src={`https://ui-avatars.com/api/?name=User+${idx}&background=random`} className="w-6 h-6 rounded-full mr-2"/>
                <span className="text-xs text-gray-500 font-bold">By Traveler {idx + 1}</span>
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-1">{trip.city} Adventure</h3>
              <p className="text-gray-500 text-sm flex items-center mb-4">
                <MapPin size={14} className="mr-1" /> {trip.country}
              </p>
              
              <div className="flex justify-between items-center border-t pt-4">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                  Budget: {trip.price}
                </span>
                <button className="text-primary text-sm font-bold flex items-center hover:underline">
                  <Share2 size={16} className="mr-1" /> Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}