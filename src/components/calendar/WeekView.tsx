
import React from 'react';
import { format, startOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

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

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, events, onDateClick }) => {
  const weekStart = startOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ 
    start: weekStart, 
    end: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000) 
  });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_time);
      return isSameDay(eventStart, day);
    });
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
        <div className="bg-gray-50 p-3"></div>
        {weekDays.map((day, index) => (
          <div 
            key={day.toISOString()}
            className="bg-gray-50 p-3 text-center cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            onClick={() => onDateClick(day)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-sm font-medium text-gray-700">
              {format(day, 'EEE')}
            </div>
            <div className={`text-lg font-semibold mt-1 ${
              isToday(day) 
                ? 'bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto'
                : 'text-gray-900'
            }`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Time slots */}
      <div className="grid grid-cols-8 gap-px bg-gray-200 flex-1">
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="bg-white p-2 text-right border-r border-gray-200">
              <span className="text-xs text-gray-500">
                {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
              </span>
            </div>
            {weekDays.map((day) => {
              const dayEvents = getEventsForDay(day).filter(event => {
                const eventHour = new Date(event.start_time).getHours();
                return eventHour === hour;
              });

              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="bg-white min-h-[60px] p-1 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => onDateClick(new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour))}
                >
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded mb-1 bg-blue-500 text-white font-medium transform transition-all duration-200 hover:scale-105"
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WeekView;
