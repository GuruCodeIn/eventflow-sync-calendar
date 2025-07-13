
const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-api.com/api';

export interface Event {
  _id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  color: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
  sharedWith?: string[];
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

// Mock events for development
const mockEvents: Event[] = [
  {
    _id: 'mock-event-1',
    title: 'Team Meeting',
    description: 'Weekly team sync',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString(),
    location: 'Conference Room A',
    color: '#3b82f6',
    createdBy: 'mock-user-id',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-event-2',
    title: 'Project Review',
    description: 'Quarterly project review',
    start: new Date(Date.now() + 86400000).toISOString(),
    end: new Date(Date.now() + 86400000 + 7200000).toISOString(),
    color: '#10b981',
    createdBy: 'mock-user-id',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch {
    return false;
  }
};

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const getEvents = async (): Promise<Event[]> => {
  const backendAvailable = await isBackendAvailable();
  
  if (!backendAvailable) {
    console.warn('Backend not available, using mock events');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEvents;
  }

  const response = await fetch(`${API_URL}/events`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  const data = await response.json();
  return data.events;
};

export const createEvent = async (event: Omit<Event, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
  const backendAvailable = await isBackendAvailable();
  
  if (!backendAvailable) {
    console.warn('Backend not available, creating mock event');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const newEvent: Event = {
      ...event,
      _id: 'mock-event-' + Date.now(),
      createdBy: 'mock-user-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockEvents.push(newEvent);
    return newEvent;
  }

  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(event)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create event');
  }

  const data = await response.json();
  return data.event;
};

export const updateEvent = async (id: string, event: Partial<Event>): Promise<Event> => {
  const backendAvailable = await isBackendAvailable();
  
  if (!backendAvailable) {
    console.warn('Backend not available, updating mock event');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const eventIndex = mockEvents.findIndex(e => e._id === id);
    if (eventIndex >= 0) {
      mockEvents[eventIndex] = { ...mockEvents[eventIndex], ...event };
      return mockEvents[eventIndex];
    }
    throw new Error('Event not found');
  }

  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(event)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update event');
  }

  const data = await response.json();
  return data.event;
};

export const deleteEvent = async (id: string): Promise<void> => {
  const backendAvailable = await isBackendAvailable();
  
  if (!backendAvailable) {
    console.warn('Backend not available, deleting mock event');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const eventIndex = mockEvents.findIndex(e => e._id === id);
    if (eventIndex >= 0) {
      mockEvents.splice(eventIndex, 1);
    }
    return;
  }

  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete event');
  }
};

export const shareEvent = async (eventId: string, email: string, permission: 'view' | 'edit'): Promise<void> => {
  const backendAvailable = await isBackendAvailable();
  
  if (!backendAvailable) {
    console.warn('Backend not available, mock sharing event');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  }

  const response = await fetch(`${API_URL}/events/${eventId}/share`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, permission })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to share event');
  }
};
