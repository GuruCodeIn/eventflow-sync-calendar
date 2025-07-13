
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { SocketProvider } from '../contexts/SocketContext';
import LoginPage from '../components/auth/LoginPage';
import SignupPage from '../components/auth/SignupPage';
import Dashboard from '../components/dashboard/Dashboard';
import CalendarView from '../components/calendar/CalendarView';
import SharedCalendars from '../components/shared/SharedCalendars';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Navbar from '../components/layout/Navbar';
import { Toaster } from 'react-hot-toast';

const Index = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <Toaster position="top-right" />
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <div className="flex flex-col h-screen">
                    <Navbar />
                    <div className="flex-1 overflow-hidden">
                      <Dashboard />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <div className="flex flex-col h-screen">
                    <Navbar />
                    <div className="flex-1 overflow-hidden">
                      <CalendarView />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/shared" element={
                <ProtectedRoute>
                  <div className="flex flex-col h-screen">
                    <Navbar />
                    <div className="flex-1 overflow-hidden">
                      <SharedCalendars />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </div>
      </SocketProvider>
    </AuthProvider>
  );
};

export default Index;
