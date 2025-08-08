
import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MoreVertical } from 'lucide-react';
import { getEvents } from '../../api/events-supabase';
import { format, isToday, isPast } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  user_id: string;
  shared_with: any[];
  created_at: string;
}

interface RecentEventsProps {
  refreshKey?: number;
}

const RecentEvents: React.FC<RecentEventsProps> = ({ refreshKey }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await getEvents();
        const recent = allEvents
          .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
          .slice(0, 6);
        
        setEvents(recent);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [refreshKey]);

  const getEventStatus = (event: Event) => {
    const startDate = new Date(event.start_time);
    const endDate = new Date(event.end_time);
    const now = new Date();

    if (now >= startDate && now <= endDate) {
      return { label: 'Ongoing', color: 'text-green-600 bg-green-100' };
    } else if (isPast(endDate)) {
      return { label: 'Completed', color: 'text-gray-600 bg-gray-100' };
    } else if (isToday(startDate)) {
      return { label: 'Today', color: 'text-blue-600 bg-blue-100' };
    } else {
      return { label: 'Upcoming', color: 'text-purple-600 bg-purple-100' };
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Events</h2>
        <div className="space-y-4">
          {['recent-1', 'recent-2', 'recent-3', 'recent-4'].map((id) => (
            <div key={`loading-${id}`} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Events</h2>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No events yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => {
            const startDate = new Date(event.start_time);
            const status = getEventStatus(event);
            
            return (
              <div 
                key={event.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0 bg-blue-500"></div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {format(startDate, 'MMM d, h:mm a')}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentEvents;
