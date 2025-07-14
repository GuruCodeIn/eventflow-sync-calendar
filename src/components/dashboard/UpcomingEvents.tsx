
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { getEvents } from '../../api/events';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';

interface Event {
  _id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  color: string;
}

const UpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await getEvents();
        const now = new Date();
        const upcoming = allEvents
          .filter(event => new Date(event.start) > now)
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
          .slice(0, 5);
        
        setEvents(upcoming);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {['upcoming-1', 'upcoming-2', 'upcoming-3'].map((id) => (
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
        <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
        <Calendar className="h-5 w-5 text-gray-400" />
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event, index) => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            
            return (
              <div 
                key={event._id}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div 
                  className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: event.color }}
                ></div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {event.title}
                  </h3>
                  
                  <div className="mt-1 flex items-center text-xs text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{getDateLabel(startDate)} at {format(startDate, 'h:mm a')}</span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {event.description && (
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
