
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus } from 'lucide-react';
import EventModal from '../events/EventModal';
import RecentEvents from '../events/RecentEvents';
import QuickStats from './QuickStats';
import UpcomingEvents from './UpcomingEvents';

const Dashboard = () => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [key, setKey] = useState(0);

  const handleEventCreated = () => {
    setRefreshKey(prev => prev + 1);
    setShowEventModal(false);
    // Show success message here to avoid duplicates
    import('react-hot-toast').then(({ default: toast }) => {
      toast.success('Event created successfully!');
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your calendar.</p>
          </div>
          <button
            onClick={() => setShowEventModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transform transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuickStats key={`stats-${refreshKey}`} refreshKey={refreshKey} />
          <UpcomingEvents key={`upcoming-${refreshKey}`} />
        </div>
        
        <div className="space-y-6">
          <RecentEvents key={`recent-${refreshKey}`} />
        </div>
      </div>

      {showEventModal && (
        <EventModal
          onClose={() => setShowEventModal(false)}
          onEventCreated={handleEventCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
