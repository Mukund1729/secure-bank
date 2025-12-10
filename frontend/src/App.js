import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import PersonalFinance from './components/PersonalFinance';
import BankOverview from './components/BankOverview';
import AlertsCenter from './components/AlertsCenter';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/personal-finance" element={<ProtectedRoute><PersonalFinance /></ProtectedRoute>} />
            <Route path="/banking" element={<ProtectedRoute><BankOverview /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><AlertsCenter /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user && user.role === 'ADMIN' ? children : <Navigate to="/dashboard" />;
}

export default App;
