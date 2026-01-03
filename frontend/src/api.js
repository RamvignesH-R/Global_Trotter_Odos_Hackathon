// src/api.js
const API_BASE_URL = 'http://localhost:8000';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // FastAPI URL
});


// REGISTER USER
export const registerUser = (data) => API.post("/users", data);


// User APIs
export const createUser = (userData) => {
  return apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const getUser = (userId) => {
  return apiCall(`/users/${userId}`);
};

// Trip APIs
export const createTrip = (tripData) => {
  return apiCall('/trips', {
    method: 'POST',
    body: JSON.stringify(tripData),
  });
};

export const getUserTrips = (userId) => {
  return apiCall(`/users/${userId}/trips`);
};

export const deleteTrip = (tripId) => {
  return apiCall(`/trips/${tripId}`, {
    method: 'DELETE',
  });
};

export const getTripStops = (tripId) => {
  return apiCall(`/trips/${tripId}/stops`);
};

export const calculateTripBudget = (tripId) => {
  return apiCall(`/trips/${tripId}/calculate-budget`);
};

// City APIs
export const getCities = () => {
  return apiCall('/cities');
};

export const createCity = (cityData) => {
  return apiCall('/cities', {
    method: 'POST',
    body: JSON.stringify(cityData),
  });
};

// Activity APIs
export const getActivities = () => {
  return apiCall('/activities');
};

export const createActivity = (activityData) => {
  return apiCall('/activities', {
    method: 'POST',
    body: JSON.stringify(activityData),
  });
};

// Trip Stop APIs
export const addTripStop = (stopData) => {
  return apiCall('/trip-stops', {
    method: 'POST',
    body: JSON.stringify(stopData),
  });
};

// Stop Activity APIs
export const addActivityToStop = (stopActivityData) => {
  return apiCall('/stop-activities', {
    method: 'POST',
    body: JSON.stringify(stopActivityData),
  });
};

// Budget APIs
export const createOrUpdateBudget = (budgetData) => {
  return apiCall('/budgets', {
    method: 'POST',
    body: JSON.stringify(budgetData),
  });
};

// src/api.js

export const addStopActivity = async (data) => {
  const response = await fetch(`${API_BASE_URL}/stop-activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stop_id: data.stop_id,
      activity_id: data.activity_id,
      scheduled_date: data.scheduled_date
    }),
  });
  
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.detail || "Failed to add activity");
  }
  
  return response.json();
};