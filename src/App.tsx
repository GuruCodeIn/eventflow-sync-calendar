
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import Dashboard from './components/dashboard/Dashboard';
import CalendarView from './components/calendar/CalendarView';
import SharedCalendars from './components/shared/SharedCalendars';
import ProfilePage from './components/profile/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import NotFound from "./pages/NotFound";
import { Toaster as HotToaster } from 'react-hot-toast';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <SocketProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <HotToaster position="top-right" />
            <BrowserRouter>
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
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <div className="flex flex-col h-screen">
                      <Navbar />
                      <div className="flex-1 overflow-hidden">
                        <ProfilePage />
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </BrowserRouter>
          </div>
        </SocketProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
