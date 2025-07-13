
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface Event {
  _id?: string;
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

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const getEvents = async (): Promise<Event[]> => {
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
