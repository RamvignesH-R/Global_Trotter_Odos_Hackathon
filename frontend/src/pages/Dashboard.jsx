// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, ArrowRight, Search, Filter, DollarSign, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserTrips, getCities, deleteTrip, getUser } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState('All');
  
  const currentUserId = parseInt(localStorage.getItem('userId') || '0');

  useEffect(() => {
    if (!currentUserId) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [currentUserId]);

  useEffect(() => {
    filterCities();
  }, [searchQuery, selectedCountry, selectedBudget, cities]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userData = await getUser(currentUserId);
      setUserName(userData.name);
      localStorage.setItem('userName', userData.name);
      
      const [tripsData, citiesData] = await Promise.all([
        getUserTrips(currentUserId),
        getCities()
      ]);
      
      setTrips(tripsData);
      setCities(citiesData);
      setFilteredCities(citiesData);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Make sure the backend is running.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCities = () => {
    let filtered = [...cities];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(city => 
        city.city_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Country filter
    if (selectedCountry !== 'All') {
      filtered = filtered.filter(city => city.country === selectedCountry);
    }

    // Budget filter
    if (selectedBudget !== 'All') {
      if (selectedBudget === 'Low') {
        filtered = filtered.filter(city => city.cost_index <= 4);
      } else if (selectedBudget === 'Medium') {
        filtered = filtered.filter(city => city.cost_index >= 5 && city.cost_index <= 7);
      } else if (selectedBudget === 'High') {
        filtered = filtered.filter(city => city.cost_index >= 8);
      }
    }

    setFilteredCities(filtered);
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await deleteTrip(tripId);
        setTrips(trips.filter(trip => trip.trip_id !== tripId));
      } catch (err) {
        alert('Failed to delete trip');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDateRange = (startDate, endDate) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getTripStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (today < start) return 'Upcoming';
    if (today > end) return 'Completed';
    return 'Ongoing';
  };

  const cityImages = {
    'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop',
    'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop',
    'Berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&auto=format&fit=crop',
    'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop',
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop',
    'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop',
    'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&auto=format&fit=crop',
    'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&auto=format&fit=crop',
    'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop',
    'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop',
    'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop',
    'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop',
    'Santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop',
    'Kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop',
    'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop',
    'default': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop'
  };

  const getCityImage = (cityName) => {
    return cityImages[cityName] || cityImages.default;
  };

const getDetailedBudget = (cityId) => {
  // simple seeded random
  const seed = cityId * 999;
  const random = (min, max) =>
    Math.floor((Math.sin(seed + min) * 10000) % 1 * (max - min) + min);

  const stay = Math.abs(random(80, 200));
  const meals = Math.abs(random(40, 120));
  const misc = Math.abs(random(30, 100));

  return {
    stay,
    meals,
    misc,
    total: stay + meals + misc
  };
};

  const getEstimatedBudget = (costIndex) => {
    const budgetRanges = {
      1: { min: 30, max: 50 },
      2: { min: 40, max: 60 },
      3: { min: 50, max: 80 },
      4: { min: 60, max: 100 },
      5: { min: 80, max: 120 },
      6: { min: 100, max: 150 },
      7: { min: 120, max: 180 },
      8: { min: 150, max: 220 },
      9: { min: 180, max: 280 },
      10: { min: 200, max: 350 }
    };
    
    const range = budgetRanges[costIndex] || { min: 50, max: 100 };
    return `$${range.min}-${range.max}/day`;
  };

  const getBudgetLabel = (costIndex) => {
    if (costIndex <= 4) return { label: 'Budget Friendly', color: 'bg-green-100 text-green-800' };
    if (costIndex <= 7) return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Luxury', color: 'bg-purple-100 text-purple-800' };
  };

  const getUniqueCountries = () => {
    const countries = [...new Set(cities.map(city => city.country))];
    return countries.sort();
  };

  const getDestinationCount = (tripName) => {
    const matches = tripName.match(/\d+/);
    return matches ? matches[0] : '1';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10 bg-gray-50">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 pt-10 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl font-bold mb-2">Where to next, {userName}?</h1>
            <p className="text-lg opacity-90">Discover amazing destinations for your multi-city adventure</p>
          </div>
        </div>
      </div>

      {/* YOUR TRIPS SECTION */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Trips</h2>
            <Link to="/create-trip" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2">
              <span>+ Plan New Trip</span>
            </Link>
          </div>
          
          {trips.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't created any trips yet.</p>
              <Link 
                to="/create-trip"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Create Your First Trip
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {trips.map((trip) => (
    <div 
      key={trip.trip_id} 
      className="relative bg-blue-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
    >
      {/* Status Badge */}
      <span
        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow ${
          getTripStatus(trip.start_date, trip.end_date) === 'Upcoming'
            ? 'bg-green-500 text-white'
            : getTripStatus(trip.start_date, trip.end_date) === 'Ongoing'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-500 text-white'
        }`}
      >
        {getTripStatus(trip.start_date, trip.end_date)}
      </span>

      {/* Trip Content */}
      <div className="p-5 flex flex-col justify-between h-full">
        <div>
          <h3 className="font-bold text-lg text-blue-900 mb-2">{trip.trip_name}</h3>
          <p className="text-blue-700 text-sm mb-4 flex items-center gap-1">
            <Calendar size={14} /> {getDateRange(trip.start_date, trip.end_date)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Link
            to={`/itinerary/${trip.trip_id}`}
            className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1"
          >
            View <ArrowRight size={16} />
          </Link>
          <button
            onClick={() => handleDeleteTrip(trip.trip_id)}
            className="px-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
          )}
        </div>


        {/* DESTINATIONS SECTION */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Recommended Destinations</h2>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Country Filter */}
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option value="All">All Countries</option>
                  {getUniqueCountries().map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>Showing {filteredCities.length} of {cities.length} destinations</span>
              {(searchQuery || selectedCountry !== 'All' || selectedBudget !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCountry('All');
                    setSelectedBudget('All');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Cities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => {
              const details = getDetailedBudget(city.city_id);

              return (
                <div
  key={city.city_id}
  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group"
>
  <div className="relative h-56 overflow-hidden">
    <img
      src={getCityImage(city.city_name)}
      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
      alt={city.city_name}
    />
  </div>

  {/* CONTENT */}
  <div className="p-4">
    <h3 className="text-lg font-bold text-gray-800">
      {city.city_name}
    </h3>
    <p className="text-sm text-gray-500 mb-3">
      {city.country}
    </p>

    {/* BUDGET GRID (VISIBLE NOW) */}
    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center">
      <div>
        <p className="text-[10px] uppercase text-gray-400">Stay</p>
        <p className="font-bold text-gray-700">${details.stay}</p>
      </div>

      <div>
        <p className="text-[10px] uppercase text-gray-400">Meals</p>
        <p className="font-bold text-gray-700">${details.meals}</p>
      </div>

      <div>
        <p className="text-[10px] uppercase text-gray-400">Misc</p>
        <p className="font-bold text-gray-700">${details.misc}</p>
      </div>
    </div>
  </div>
</div>

              );
            })}
          </div>

          {filteredCities.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-600 text-lg">No destinations found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCountry('All');
                  setSelectedBudget('All');
                }}
                className="mt-4 text-blue-600 hover:text-blue-800 font-semibold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}