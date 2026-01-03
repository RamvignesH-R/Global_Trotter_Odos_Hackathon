import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Calendar, MapPin, Edit2, Save, X, 
  Globe, Heart, Trash2, Camera, LogOut, ChevronRight 
} from 'lucide-react';
import { getUser, getUserTrips } from '../api';

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Data States
  const [userData, setUserData] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Editable States
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhoto, setEditedPhoto] = useState('');
  const [language, setLanguage] = useState('English');
  
  // Mock Saved Destinations (You can later fetch this from your API)
  const [savedDestinations, setSavedDestinations] = useState([
    { id: 1, name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400' },
    { id: 2, name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
    { id: 3, name: 'Amalfi Coast, Italy', image: 'https://images.unsplash.com/photo-1633321088355-d0f81134ca3b?w=400' }
  ]);

  const userId = parseInt(localStorage.getItem('userId') || '0');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [user, userTrips] = await Promise.all([
        getUser(userId),
        getUserTrips(userId)
      ]);
      setUserData(user);
      setEditedName(user.name);
      setEditedEmail(user.email || '');
      setEditedPhoto(user.photo || ''); // Assuming your API provides a photo URL
      setTrips(userTrips);
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // In a real app, call: await updateUser(userId, { name: editedName, email: editedEmail, photo: editedPhoto, language })
    localStorage.setItem('userName', editedName);
    setUserData({ 
      ...userData, 
      name: editedName, 
      email: editedEmail,
      photo: editedPhoto 
    });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For local preview; in production, you'd upload this to a server/S3
      const reader = new FileReader();
      reader.onloadend = () => setEditedPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Warning: This will permanently delete your account and all trip data. Are you sure?")) {
      // Call delete API here
      localStorage.clear();
      navigate('/login');
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-gray-600 animate-pulse">Loading profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-12 gap-6">
              
              {/* Profile Photo with Edit Overlay */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
                  <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-white">
                    {editedPhoto ? (
                      <img src={editedPhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-blue-600">{getInitials(userData.name)}</span>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <Camera className="h-8 w-8" />
                  </button>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </div>

              {/* Name & Email Fields */}
              <div className="text-center md:text-left flex-1">
                {isEditing ? (
                  <div className="space-y-3 max-w-xs mx-auto md:mx-0">
                    <input 
                      type="text" 
                      value={editedName} 
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none w-full bg-transparent"
                      placeholder="Your Name"
                    />
                    <div className="flex items-center gap-2 text-gray-600 border-b border-gray-300">
                      <Mail className="h-4 w-4" />
                      <input 
                        type="email" 
                        value={editedEmail} 
                        onChange={(e) => setEditedEmail(e.target.value)}
                        className="focus:outline-none w-full bg-transparent py-1"
                        placeholder="Your Email"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2">
                      {userData.name}
                      <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-blue-600 transition">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </h1>
                    <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
                      <Mail className="h-4 w-4" /> {userData.email}
                    </p>
                  </>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    <Save className="h-4 w-4" /> Save
                  </button>
                  <button onClick={() => { setIsEditing(false); fetchUserData(); }} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                    <X className="h-4 w-4" /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{trips.length}</div>
            <div className="text-gray-500 text-sm flex items-center justify-center gap-2 uppercase tracking-wider font-semibold">
              <MapPin className="h-4 w-4" /> Total Trips
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">{trips.length * 3}</div>
            <div className="text-gray-500 text-sm flex items-center justify-center gap-2 uppercase tracking-wider font-semibold">
              <Globe className="h-4 w-4" /> Cities Visited
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-lg font-bold text-green-600 mb-1">January 2026</div>
            <div className="text-gray-500 text-sm flex items-center justify-center gap-2 uppercase tracking-wider font-semibold">
              <Calendar className="h-4 w-4" /> Joined
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" /> Preferences
          </h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-700">Display Language</p>
              <p className="text-sm text-gray-500">Choose your preferred language for the interface.</p>
            </div>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>

        {/* Saved Destinations List */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" /> Saved Destinations
            </h2>
            <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {savedDestinations.map((dest) => (
              <div key={dest.id} className="group relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition">
                <img src={dest.image} alt={dest.name} className="h-32 w-full object-cover" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-end p-3">
                  <span className="text-white font-medium text-sm">{dest.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trips Section (Existing Component) */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Trips</h2>
          {trips.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Start planning your first adventure!</p>
          ) : (
            <div className="space-y-3">
              {trips.slice(0, 3).map((trip) => (
                <div key={trip.trip_id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate(`/itinerary/${trip.trip_id}`)}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><MapPin className="h-5 w-5" /></div>
                    <div>
                      <h3 className="font-bold text-gray-800">{trip.trip_name}</h3>
                      <p className="text-xs text-gray-500">{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Settings (Cleaned Up) */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-red-50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Account Safety</h2>
          <p className="text-sm text-gray-500 mb-4">Deleting your account is permanent. All saved destinations, trips, and preferences will be wiped.</p>
          <button 
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 px-6 py-3 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition font-bold"
          >
            <Trash2 className="h-5 w-5" /> Delete My Account
          </button>
        </div>

      </div>
    </div>
  );
}