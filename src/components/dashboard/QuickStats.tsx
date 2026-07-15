
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, TrendingUp } from 'lucide-react';
import { getEvents } from '../../api/events-supabase';

interface Stats {
  totalEvents: number;
  upcomingEvents: number;
  sharedCalendars: number;
  todayEvents: number;
}

interface QuickStatsProps {
  refreshKey?: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({ refreshKey }) => {
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    upcomingEvents: 0,
    sharedCalendars: 0,
    todayEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const events = await getEvents();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

        const upcomingEvents = events.filter(event => new Date(event.start_time) > now);
        const todayEvents = events.filter(event => {
          const eventDate = new Date(event.start_time);
          return eventDate >= today && eventDate < tomorrow;
        });

        // Count real shared events instead of placeholder shared calendars.
        const sharedEventsCount = events.filter(event => event.shared_with && event.shared_with.length > 0).length;

        setStats({
          totalEvents: events.length,
          upcomingEvents: upcomingEvents.length,
          sharedCalendars: sharedEventsCount,
          todayEvents: todayEvents.length
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshKey]);

  const statItems = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Today\'s Events',
      value: stats.todayEvents,
      icon: Clock,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Upcoming',
      value: stats.upcomingEvents,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Shared Calendars',
      value: stats.sharedCalendars,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['total', 'today', 'upcoming', 'shared'].map((type) => (
          <div key={`loading-${type}`} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div 
          key={`stat-${item.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
          className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 ${item.bgColor} bg-opacity-20 cursor-pointer`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{item.title}</p>
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
            </div>
            <div className={`h-12 w-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center`}>
              <item.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
