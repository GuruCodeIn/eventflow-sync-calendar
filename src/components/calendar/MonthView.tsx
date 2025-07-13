
import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';

interface Event {
  _id: string;
  title: string;
  start: string;
  end: string;
  color: string;
}

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, events, onDateClick }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return isSameDay(eventStart, day);
    });
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      {weekdays.map((day) => (
        <div key={day} className="bg-gray-50 px-3 py-2 text-center">
          <span className="text-sm font-medium text-gray-700">{day}</span>
        </div>
      ))}
      
      {/* Calendar Days */}
      {days.map((day, index) => {
        const dayEvents = getEventsForDay(day);
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isCurrentDay = isToday(day);
        
        return (
          <div
            key={day.toISOString()}
            onClick={() => onDateClick(day)}
            className={`bg-white min-h-[120px] p-2 cursor-pointer hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] ${
              !isCurrentMonth ? 'text-gray-400' : ''
            }`}
            style={{ animationDelay: `${index * 20}ms` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-sm font-medium ${
                  isCurrentDay
                    ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                    : isCurrentMonth
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {format(day, 'd')}
              </span>
            </div>
            
            <div className="space-y-1">
              {dayEvents.slice(0, 3).map((event) => (
                <div
                  key={event._id}
                  className="text-xs p-1 rounded truncate text-white font-medium transform transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: event.color }}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-gray-500 font-medium">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MonthView;
