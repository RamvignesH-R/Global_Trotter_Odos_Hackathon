import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Map, Type } from 'lucide-react';

export default function CreateTrip() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to the backend here.
    // For the hackathon demo, we just assume it worked and go to the Builder.
    // We pass a fake ID '123' to the route.
    navigate('/builder/123'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Plan a New Adventure</h2>
          <p className="text-gray-500 mt-2">Start by giving your trip a name and dates.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Trip Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Map className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary focus:outline-none"
                placeholder="e.g., Summer in Italy"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>

          {/* Dates Row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary focus:outline-none"
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary focus:outline-none"
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                <Type className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                rows={4}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary focus:outline-none"
                placeholder="What are your goals for this trip?"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-secondary hover:bg-orange-600 focus:outline-none transition transform hover:scale-[1.02]"
          >
            Start Planning
          </button>
        </form>
      </div>
    </div>
  );
}