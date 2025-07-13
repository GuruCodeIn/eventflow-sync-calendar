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
    sharedWith: ['alice@example.com'],
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
    sharedWith: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-event-3',
    title: 'Client Presentation',
    description: 'Product demo for new client',
    start: new Date(Date.now() + 172800000).toISOString(),
    end: new Date(Date.now() + 172800000 + 5400000).toISOString(),
    color: '#f59e0b',
    createdBy: 'mock-user-id',
    sharedWith: ['bob@example.com', 'carol@example.com'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const isBackendAvailable = async (): Promise<boolean> => {
  try {
    console.log('Checking backend availability at:', `${API_URL}/health`);
    const response = await fetch(`${API_URL}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    
    if (!response.ok) {
      console.log('Backend health check failed with status:', response.status);
      return false;
    }
    
    // Check if the response is actually JSON (not HTML from domain parking)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log('Backend returned non-JSON response, likely not a real API');
      return false;
    }
    
    // Try to parse the response to ensure it's valid JSON
    try {
      await response.json();
      console.log('Backend is available and returning valid JSON');
      return true;
    } catch {
      console.log('Backend returned invalid JSON');
      return false;
    }
  } catch (error) {
    console.log('Backend health check failed:', error);
    return false;
  }
};

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const getEvents = async (): Promise<Event[]> => {
  console.log('Getting events...');
  const backendAvailable = await isBackendAvailable();
  
  if (!backendAvailable) {
    console.warn('Backend not available, using mock events');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEvents;
  }

  try {
    const response = await fetch(`${API_URL}/events`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      console.error('Events API call failed, falling back to mock data');
      return mockEvents;
    }

    const data = await response.json();
    return data.events;
  } catch (error) {
    console.error('Events API call failed:', error);
    console.warn('Falling back to mock events');
    return mockEvents;
  }
};

export const createEvent = async (event: Omit<Event, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
  console.log('Creating event:', event);
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

  try {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      console.error('Create event API call failed, falling back to mock');
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

    const data = await response.json();
    return data.event;
  } catch (error) {
    console.error('Create event API call failed:', error);
    console.warn('Falling back to mock event creation');
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
  console.log('Sharing event:', eventId, 'with:', email, 'permission:', permission);
  const backendAvailable = await isBackendAvailable();
  
  if (!backendAvailable) {
    console.warn('Backend not available, mock sharing event');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update mock event with shared user
    const eventIndex = mockEvents.findIndex(e => e._id === eventId);
    if (eventIndex >= 0) {
      if (!mockEvents[eventIndex].sharedWith) {
        mockEvents[eventIndex].sharedWith = [];
      }
      if (!mockEvents[eventIndex].sharedWith!.includes(email)) {
        mockEvents[eventIndex].sharedWith!.push(email);
      }
    }
    return;
  }

  try {
    const response = await fetch(`${API_URL}/events/${eventId}/share`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, permission })
    });

    if (!response.ok) {
      console.error('Share event API call failed, using mock sharing');
      const eventIndex = mockEvents.findIndex(e => e._id === eventId);
      if (eventIndex >= 0) {
        if (!mockEvents[eventIndex].sharedWith) {
          mockEvents[eventIndex].sharedWith = [];
        }
        if (!mockEvents[eventIndex].sharedWith!.includes(email)) {
          mockEvents[eventIndex].sharedWith!.push(email);
        }
      }
      return;
    }
  } catch (error) {
    console.error('Share event API call failed:', error);
    console.warn('Falling back to mock sharing');
    const eventIndex = mockEvents.findIndex(e => e._id === eventId);
    if (eventIndex >= 0) {
      if (!mockEvents[eventIndex].sharedWith) {
        mockEvents[eventIndex].sharedWith = [];
      }
      if (!mockEvents[eventIndex].sharedWith!.includes(email)) {
        mockEvents[eventIndex].sharedWith!.push(email);
      }
    }
  }
};
