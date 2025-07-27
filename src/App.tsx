import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Dashboard from './components/dashboard/Dashboard';
import CalendarView from './components/calendar/CalendarView';
import SharedCalendars from './components/shared/SharedCalendars';
import ProfilePage from './components/profile/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthPage from './components/auth/AuthPage';
import Navbar from './components/layout/Navbar';
import NotFound from "./pages/NotFound";
import { Toaster as HotToaster } from 'react-hot-toast';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HotToaster />
        <AuthProvider>
          <SocketProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <Dashboard />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <CalendarView />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shared"
                  element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <SharedCalendars />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <ProfilePage />
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SocketProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;