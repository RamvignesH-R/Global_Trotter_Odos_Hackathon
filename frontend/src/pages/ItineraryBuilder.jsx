import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calendar, ChevronDown, ChevronUp, AlertCircle, Utensils, Bed, Plane, Plus, X, Ticket } from 'lucide-react';
// 🔹 Ensure addStopActivity is imported
import { getUserTrips, getTripStops, getActivities, getCities, addStopActivity } from '../api';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [expandedDays, setExpandedDays] = useState({});
  const [loading, setLoading] = useState(true);

  const [showActivityPicker, setShowActivityPicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayActivities, setDayActivities] = useState({});

  useEffect(() => {
    fetchData();
  }, [tripId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const [trips, stopsData, citiesData, activitiesData] = await Promise.all([
        getUserTrips(userId),
        getTripStops(tripId),
        getCities(),
        getActivities()
      ]);

      setTrip(trips.find(t => t.trip_id === parseInt(tripId)));
      setStops(stopsData);
      setCities(citiesData);
      setActivities(activitiesData);

      // 🔹 IMPORTANT: Fetch existing activities assigned to this trip from DB
      // In a real app, you'd have an endpoint like getTripItinerary(tripId)
      // For now, we are simulating the state.
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };
const itineraryDays = useMemo(() => {
  if (!stops.length || !cities.length) return [];
  let days = [];

  stops.sort((a, b) => a.stop_order - b.stop_order).forEach(stop => {
    const city = cities.find(c => c.city_id === stop.city_id);
    const start = new Date(stop.start_date);
    const end = new Date(stop.end_date);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];

      const currentDayActs = dayActivities[dateKey] || [];
      const activityCost = currentDayActs.reduce((sum, a) => sum + (Number(a.avg_cost) || 0), 0);

      // 🔹 Randomize stay and meals for each day
      const stay = Math.floor(Math.random() * 100 + 50);  // Random 50-149
      const meals = Math.floor(Math.random() * 50 + 20);  // Random 20-69

      days.push({
        date: dateKey,
        stop_id: stop.stop_id,
        cityName: city?.city_name,
        stay,
        meals,
        transport: i === 0 ? 100 : 0,
        activities: currentDayActs,
        activityCost,
        total: stay + meals + activityCost + (i === 0 ? 100 : 0)
      });
    }
  });
  return days;
}, [stops, cities, dayActivities]);

  const handleAddActivity = async (activity) => {
    try {
      // 🔹 1. SAVE TO DATABASE
      const payload = {
        stop_id: selectedDay.stop_id,
        activity_id: activity.activity_id,
        scheduled_date: selectedDay.date
      };
      
      console.log("Sending to DB:", payload);
      await addStopActivity(payload);

      // 🔹 2. UPDATE LOCAL UI
      setDayActivities(prev => ({
        ...prev,
        [selectedDay.date]: [...(prev[selectedDay.date] || []), activity]
      }));

      setShowActivityPicker(false);
    } catch (err) {
      alert("Error adding to database. Check console.");
      console.error(err);
    }
  };

 const chartData = useMemo(() => {
  let transport = 0, stay = 0, meals = 0, activitiesCost = 0;
  itineraryDays.forEach(d => {
    transport += d.transport;
    stay += d.stay;
    meals += d.meals;
    activitiesCost += d.activityCost;
  });
  return [
    { name: 'Transport', value: transport },
    { name: 'Stay', value: stay },
    { name: 'Meals', value: meals },
    { name: 'Activities', value: activitiesCost }
  ];
}, [itineraryDays]);

  if (loading) return <div className="p-10 text-center">Loading Itinerary...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER SECTION - SAME AS BEFORE */}
      <div className="bg-white border-b px-8 py-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{trip?.trip_name}</h1>
                <p className="text-slate-500 text-sm">Trip Plan & Budget Tracker</p>
            </div>
            <div className="text-right">
                <p className="text-xs uppercase text-slate-400 font-bold">Total Estimate</p>
                <p className="text-3xl font-black text-indigo-600">
                    ${chartData.reduce((a, b) => a + b.value, 0)}
                </p>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {itineraryDays.map((day, idx) => (
            <div key={day.date} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div onClick={() => setExpandedDays(p => ({...p, [day.date]: !p[day.date]}))} 
                   className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{day.cityName} – Day {idx + 1}</h3>
                  <p className="text-sm text-slate-400">{day.date}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xl font-bold text-slate-700">${day.total}</span>
                  {expandedDays[day.date] ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>

              {expandedDays[day.date] && (
                <div className="p-5 border-t bg-slate-50/50 space-y-3">
                  <Expense icon={<Bed size={16}/>} label="Accommodation" value={day.stay} />
                  <Expense icon={<Utensils size={16}/>} label="Food & Dining" value={day.meals} />
                  
                  {/* 🔹 FIX: List added activities with avg_cost */}
                  {day.activities.map((a, i) => (
                    <Expense 
                      key={i} 
                      icon={<Ticket size={16} className="text-indigo-500"/>} 
                      label={a.activity_name} 
                      value={a.avg_cost} // 👈 CHANGED FROM cost TO avg_cost
                    />
                  ))}

                  <button onClick={() => { setSelectedDay(day); setShowActivityPicker(true); }}
                    className="w-full border-2 border-dashed border-slate-200 rounded-xl p-4 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <Plus size={18} /> Add Activity
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Breakdown Sidebar */}
        <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-28 border border-slate-100">
                <h2 className="font-bold text-slate-800 mb-6">Budget Distribution</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartData} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-3 mt-6">
                    {chartData.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}} />
                                <span className="text-slate-600">{item.name}</span>
                            </div>
                            <span className="font-bold text-slate-800">${item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* MODAL */}
      {showActivityPicker && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-xl text-slate-800">Explore {selectedDay.cityName}</h3>
              <button onClick={() => setShowActivityPicker(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto space-y-3">
              {activities.filter(a => a.city_name === selectedDay.cityName).map(a => (
                <div key={a.activity_id} onClick={() => handleAddActivity(a)}
                  className="p-4 border border-slate-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition-all flex justify-between items-center group"
                >
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-indigo-700">{a.activity_name}</p>
                    <p className="text-xs text-slate-400 uppercase font-semibold">{a.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-600 font-black">${a.avg_cost}</p>
                    <p className="text-[10px] text-slate-400">per person</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 🔹 REUSABLE EXPENSE COMPONENT
function Expense({ icon, label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm border border-slate-50">
      <div className="flex items-center gap-3 text-slate-600 font-medium">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        {label}
      </div>
      <span className="font-bold text-slate-800">${value || 0}</span>
    </div>
  );
}