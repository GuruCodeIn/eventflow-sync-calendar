
import React from 'react';
import { format, isSameDay, isToday } from 'date-fns';

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

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
}

const DayView: React.FC<DayViewProps> = ({ currentDate, events, onDateClick }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_time);
      return isSameDay(eventStart, currentDate) && eventStart.getHours() === hour;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gray-50 p-4 rounded-t-lg border-b border-gray-200">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700">
            {format(currentDate, 'EEEE')}
          </div>
          <div className={`text-2xl font-bold mt-1 ${
            isToday(currentDate) ? 'text-blue-600' : 'text-gray-900'
          }`}>
            {format(currentDate, 'MMMM d, yyyy')}
          </div>
        </div>
      </div>

      {/* Time slots */}
      <div className="bg-white rounded-b-lg overflow-hidden">
        {hours.map((hour, index) => {
          const hourEvents = getEventsForHour(hour);
          
          return (
            <div 
              key={hour}
              className="flex border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-20 p-4 text-right border-r border-gray-200">
                <span className="text-sm text-gray-500">
                  {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                </span>
              </div>
              
              <div 
                className="flex-1 min-h-[80px] p-4 cursor-pointer"
                onClick={() => onDateClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour))}
              >
                {hourEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg mb-2 bg-blue-500 text-white shadow-sm transform transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm opacity-90 mt-1">
                      {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                    </div>
                    {event.description && (
                      <div className="text-sm opacity-90 mt-2">{event.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;
