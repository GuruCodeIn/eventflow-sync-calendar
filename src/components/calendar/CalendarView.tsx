
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { getEvents } from '../../api/events';
import EventModal from '../events/EventModal';
import CalendarGrid from './CalendarGrid';
import ViewSelector from './ViewSelector';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

export type CalendarView = 'month' | 'week' | 'day';

interface Event {
  _id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  color: string;
}

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
    }
  };

  const getTitle = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (view === 'week') {
      return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventModal(true);
  };

  const handleEventCreated = () => {
    fetchEvents();
    setShowEventModal(false);
    setSelectedDate(null);
    // Show success message here to avoid duplicates
    import('react-hot-toast').then(({ default: toast }) => {
      toast.success('Event created successfully!');
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-7 gap-4">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              <h1 className="text-2xl font-semibold text-gray-900">{getTitle()}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <ViewSelector view={view} onViewChange={setView} />
              
              <button
                onClick={() => setShowEventModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transform transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <CalendarGrid
            currentDate={currentDate}
            view={view}
            events={events}
            onDateClick={handleDateClick}
          />
        </div>
      </div>

      {showEventModal && (
        <EventModal
          onClose={() => {
            setShowEventModal(false);
            setSelectedDate(null);
          }}
          onEventCreated={handleEventCreated}
          initialDate={selectedDate || undefined}
        />
      )}
    </div>
  );
};

export default CalendarView;
