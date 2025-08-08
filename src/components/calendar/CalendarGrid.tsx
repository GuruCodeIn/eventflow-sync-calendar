
import React from 'react';
import { CalendarView } from './CalendarView';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';

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

interface CalendarGridProps {
  currentDate: Date;
  view: CalendarView;
  events: Event[];
  onDateClick: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, view, events, onDateClick }) => {
  switch (view) {
    case 'month':
      return <MonthView currentDate={currentDate} events={events} onDateClick={onDateClick} />;
    case 'week':
      return <WeekView currentDate={currentDate} events={events} onDateClick={onDateClick} />;
    case 'day':
      return <DayView currentDate={currentDate} events={events} onDateClick={onDateClick} />;
    default:
      return <MonthView currentDate={currentDate} events={events} onDateClick={onDateClick} />;
  }
};

export default CalendarGrid;
