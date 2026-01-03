import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, MapPin, DollarSign, Clock, Trash2, Calendar } from 'lucide-react';
import { popularDestinations } from '../mockData'; 

export default function ItineraryBuilder() {
  const { tripId } = useParams(); // Get the ID from the URL

  // 1. Load data from "Hard Drive" (LocalStorage) if it exists, otherwise use default
  const [days, setDays] = useState(() => {
    const saved = localStorage.getItem(`trip_${tripId}`);
    return saved ? JSON.parse(saved) : [
      { id: 1, day: 1, activities: [] },
      { id: 2, day: 2, activities: [] },
    ];
  });

  const [selectedDay, setSelectedDay] = useState(1);

  // 2. SAVE to "Hard Drive" whenever 'days' changes
  useEffect(() => {
    localStorage.setItem(`trip_${tripId}`, JSON.stringify(days));
  }, [days, tripId]);

  // Function: Add a new blank day
  const addDay = () => {
    const newDayNum = days.length + 1;
    setDays([...days, { id: newDayNum, day: newDayNum, activities: [] }]);
    setSelectedDay(newDayNum); 
  };

  // Function: Add an activity
  const addActivity = (place) => {
    const updatedDays = days.map((d) => {
      if (d.day === selectedDay) {
        return { ...d, activities: [...d.activities, place] };
      }
      return d;
    });
    setDays(updatedDays);
  };

  // Function: Delete an activity
  const removeActivity = (dayNum, activityIndex) => {
    const updatedDays = days.map((d) => {
      if (d.day === dayNum) {
        const newActivities = [...d.activities];
        newActivities.splice(activityIndex, 1);
        return { ...d, activities: newActivities };
      }
      return d;
    });
    setDays(updatedDays);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Left Panel */}
      <div className="w-full md:w-2/3 bg-gray-50 p-6 overflow-y-auto border-r border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Trip Itinerary</h1>
            <p className="text-gray-500 text-sm">Auto-saving your changes...</p>
          </div>
          
          <div className="flex gap-3">
             <Link 
               to={`/budget/${tripId}`} 
               className="flex items-center bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 px-4 py-2 rounded-lg transition shadow-sm"
             >
               <DollarSign size={20} className="mr-2 text-green-600" /> Budget
             </Link>

             <button 
               onClick={addDay} 
               className="flex items-center bg-white border-2 border-primary text-primary font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition shadow-sm"
             >
               <Plus size={20} className="mr-2" /> Add Day
             </button>
          </div>
        </div>

        <div className="space-y-6">
          {days.map((day) => (
            <div 
              key={day.id} 
              onClick={() => setSelectedDay(day.day)}
              className={`rounded-xl shadow-sm border-2 p-5 transition cursor-pointer ${selectedDay === day.day ? 'bg-white border-secondary ring-1 ring-orange-100' : 'bg-white border-transparent opacity-70 hover:opacity-100'}`}
            >
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-xl font-bold text-gray-700 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-400"/> Day {day.day}
                </h3>
                <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">
                  {day.activities.length} Activities
                </span>
              </div>
              
              {day.activities.length === 0 ? (
                <div className="text-gray-400 italic text-sm py-6 text-center border-2 border-dashed border-gray-200 rounded-lg">
                  Empty Day. Click "Add" on the right panel to plan activities.
                </div>
              ) : (
                <div className="space-y-3">
                  {day.activities.map((act, idx) => (
                    <div key={idx} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100 group hover:shadow-md transition">
                      <img src={act.image} alt="thumb" className="w-16 h-16 rounded-md object-cover mr-4" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{act.city}</h4>
                        <div className="flex text-xs text-gray-500 gap-4 mt-1">
                          <span className="flex items-center text-green-600 font-bold">
                            <DollarSign size={12} className="mr-1"/> {act.price}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeActivity(day.day, idx); }} 
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel (Mock Search) */}
      <div className="hidden md:block w-1/3 bg-white p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Explore Activities</h2>
        <div className="relative mb-6">
          <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none shadow-sm" />
        </div>
        <div className="space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recommended</p>
          {popularDestinations.map((place, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-3 hover:shadow-lg transition bg-white">
              <div className="flex gap-3 mb-3">
                <img src={place.image} className="w-20 h-20 rounded-lg object-cover" alt={place.city} />
                <div>
                  <h4 className="font-bold text-gray-800">{place.city}</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-2 inline-block font-medium">
                    {place.price} est.
                  </span>
                </div>
              </div>
              <button onClick={() => addActivity(place)} className="w-full py-2 bg-blue-50 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition flex justify-center items-center">
                <Plus size={16} className="mr-1" /> Add to Day {selectedDay}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}