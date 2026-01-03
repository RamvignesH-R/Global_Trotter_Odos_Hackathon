import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip, getCities, addTripStop } from '../api';

function CreateTrip() {
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    trip_name: '',
    start_date: '',
    end_date: '',
    description: '',
    selectedCities: []
  });

  const currentUserId = parseInt(localStorage.getItem('userId'));

  useEffect(() => {
    if (!currentUserId) {
      navigate('/login');
      return;
    }
    fetchCities();
  }, [currentUserId, navigate]);

  const fetchCities = async () => {
    try {
      const citiesData = await getCities();
      setCities(citiesData);
    } catch (err) {
      console.error('Error fetching cities:', err);
      alert('Failed to load cities');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCityToggle = (cityId) => {
    setFormData(prev => ({
      ...prev,
      selectedCities: prev.selectedCities.includes(cityId)
        ? prev.selectedCities.filter(id => id !== cityId)
        : [...prev.selectedCities, cityId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.trip_name || !formData.start_date || !formData.end_date) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.selectedCities.length === 0) {
      alert('Please select at least one city');
      return;
    }

    setLoading(true);

    try {
      const tripData = {
        user_id: currentUserId,
        trip_name: formData.trip_name,
        start_date: formData.start_date,
        end_date: formData.end_date,
        description: formData.description || null
      };

      const newTrip = await createTrip(tripData);

      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      const daysPerCity = Math.floor(totalDays / formData.selectedCities.length);

      for (let i = 0; i < formData.selectedCities.length; i++) {
        const stopStart = new Date(start);
        stopStart.setDate(start.getDate() + i * daysPerCity);

        const stopEnd = new Date(stopStart);
        stopEnd.setDate(stopStart.getDate() + daysPerCity - 1);

        if (i === formData.selectedCities.length - 1) {
          stopEnd.setTime(end.getTime());
        }

        await addTripStop({
          trip_id: newTrip.trip_id,
          city_id: formData.selectedCities[i],
          start_date: stopStart.toISOString().split('T')[0],
          end_date: stopEnd.toISOString().split('T')[0],
          stop_order: i + 1
        });
      }

      alert('Trip created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating trip:', err);
      alert('Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-slate-100">

          <h1 className="text-3xl font-extrabold text-slate-800 mb-8">
            Create New Trip ✈️
          </h1>

          <form onSubmit={handleSubmit}>

            {/* Trip Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Trip Name *
              </label>
              <input
                type="text"
                name="trip_name"
                value={formData.trip_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Cities */}
            <div className="mb-10">
              <label className="block text-sm font-semibold text-slate-600 mb-4">
                Select Cities (in order)
              </label>

              <div className="grid md:grid-cols-3 gap-4">
                {cities.map(city => (
                  <div
                    key={city.city_id}
                    onClick={() => handleCityToggle(city.city_id)}
                    className={`p-5 rounded-xl cursor-pointer border-2 transition-all duration-200
                      ${
                        formData.selectedCities.includes(city.city_id)
                          ? 'border-blue-600 bg-blue-50 shadow-md scale-[1.02]'
                          : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <h3 className="font-bold text-slate-800">
                      {city.city_name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {city.country}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl
                font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Trip'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-8 bg-slate-200 hover:bg-slate-300 py-3 rounded-xl
                font-semibold transition"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;
