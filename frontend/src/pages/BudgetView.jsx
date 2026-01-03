import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowLeft, DollarSign, TrendingUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function BudgetView() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [totalCost, setTotalCost] = useState(0);
  const [chartData, setChartData] = useState([]);

  // Calculate Real Costs when page loads
  useEffect(() => {
    // 1. Get the itinerary from storage
    const saved = localStorage.getItem(`trip_${tripId}`);
    if (saved) {
      const days = JSON.parse(saved);
      let activitiesCost = 0;
      
      // 2. Loop through every day and every activity
      days.forEach(day => {
        day.activities.forEach(act => {
          // Remove '$' and '/day' to get raw number (e.g. "$120/day" -> 120)
          const price = parseInt(act.price.replace(/[^0-9]/g, '')) || 50; 
          activitiesCost += price;
        });
      });

      setTotalCost(activitiesCost);

      // 3. Update Chart Data dynamically
      setChartData([
        { name: 'Activities', value: activitiesCost, color: '#FF8042' },
        { name: 'Accommodation', value: 1000, color: '#0088FE' }, // Hardcoded estimate
        { name: 'Flights', value: 800, color: '#00C49F' },        // Hardcoded estimate
        { name: 'Food', value: 450, color: '#FFBB28' },           // Hardcoded estimate
      ]);
    }
  }, [tripId]);

  const totalBudget = 5000;
  const currentSpend = totalCost + 2250; // Activities + Fixed Costs (Hotel/Flight)
  const remaining = totalBudget - currentSpend;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-primary transition">
          <ArrowLeft className="mr-2" /> Back to Itinerary
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Trip Budget Breakdown</h1>
        <div className="w-10"></div>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Expense Distribution</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-primary flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Estimated Cost</p>
              <p className="text-3xl font-bold text-gray-800">${currentSpend}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full"><DollarSign className="text-primary" /></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm font-medium">Budget Remaining</p>
              <p className={`text-3xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>${remaining}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full"><TrendingUp className="text-green-600" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}