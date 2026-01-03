import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // <--- THIS IMPORT IS CRITICAL
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';

const Layout = ({ children }) => {
  const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* <--- THIS ROUTE IS CRITICAL */}
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/builder/:tripId" element={<ItineraryBuilder />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}