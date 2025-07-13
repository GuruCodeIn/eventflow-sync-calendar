
import React from 'react';
import { Calendar, Grid3X3, LayoutGrid } from 'lucide-react';
import { CalendarView } from './CalendarView';

interface ViewSelectorProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ view, onViewChange }) => {
  const views = [
    { key: 'day' as CalendarView, label: 'Day', icon: Calendar },
    { key: 'week' as CalendarView, label: 'Week', icon: Grid3X3 },
    { key: 'month' as CalendarView, label: 'Month', icon: LayoutGrid },
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {views.map((viewOption) => (
        <button
          key={viewOption.key}
          onClick={() => onViewChange(viewOption.key)}
          className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            view === viewOption.key
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <viewOption.icon className="h-4 w-4 mr-1.5" />
          {viewOption.label}
        </button>
      ))}
    </div>
  );
};

export default ViewSelector;
