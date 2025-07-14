
import React, { useState, useEffect } from 'react';
import { Share2, Users, Plus, Calendar, Eye, Edit3 } from 'lucide-react';
import ShareEventModal from './ShareEventModal';
import { getEvents } from '../../api/events';

interface SharedCalendar {
  id: string;
  name: string;
  owner: string;
  participants: string[];
  color: string;
  eventCount: number;
  permission: 'view' | 'edit';
}

const SharedCalendars = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharedCalendars, setSharedCalendars] = useState<SharedCalendar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedCalendars = async () => {
      try {
        const events = await getEvents();
        
        // Create mock shared calendars based on events that have sharedWith data
        const sharedEvents = events.filter(event => event.sharedWith && event.sharedWith.length > 0);
        
        const calendars: SharedCalendar[] = [
          {
            id: '1',
            name: 'Team Events',
            owner: 'john@example.com',
            participants: ['alice@example.com', 'bob@example.com'],
            color: '#3B82F6',
            eventCount: sharedEvents.length || 12,
            permission: 'edit'
          },
          {
            id: '2',
            name: 'Family Calendar',
            owner: 'sarah@example.com',
            participants: ['john@example.com', 'emily@example.com'],
            color: '#10B981',
            eventCount: Math.floor(sharedEvents.length / 2) || 8,
            permission: 'view'
          },
          {
            id: '3',
            name: 'Project Meetings',
            owner: 'demo@example.com',
            participants: ['team@example.com', 'manager@example.com'],
            color: '#F59E0B',
            eventCount: Math.ceil(sharedEvents.length / 3) || 5,
            permission: 'edit'
          }
        ];
        
        setSharedCalendars(calendars);
      } catch (error) {
        console.error('Failed to fetch shared calendars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedCalendars();
  }, []);

  const handleViewCalendar = (calendar: SharedCalendar) => {
    // Navigate to calendar view filtered by this shared calendar
    window.location.href = '/calendar';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shared Calendars</h1>
            <p className="text-gray-600">Manage calendars shared with you and share your own.</p>
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transform transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Calendar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sharedCalendars.map((calendar, index) => (
          <div 
            key={calendar.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: calendar.color }}
                  ></div>
                  <h3 className="text-lg font-semibold text-gray-900">{calendar.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {calendar.permission === 'edit' ? (
                    <Edit3 className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Owner:</span>
                  <p className="text-sm font-medium text-gray-900">{calendar.owner}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Participants:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {calendar.participants.map((participant, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{calendar.participants.length + 1} members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {calendar.eventCount} events
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      calendar.permission === 'edit' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {calendar.permission === 'edit' ? 'Can Edit' : 'View Only'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <button 
                onClick={() => handleViewCalendar(calendar)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                View Calendar
              </button>
            </div>
          </div>
        ))}

        {/* Add new calendar card */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border-2 border-dashed border-gray-200 hover:border-blue-300">
          <div className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Create New</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Start sharing events with your team or family
            </p>
            <button
              onClick={() => setShowShareModal(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareEventModal
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default SharedCalendars;
