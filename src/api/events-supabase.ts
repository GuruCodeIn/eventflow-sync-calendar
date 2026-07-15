import { supabase } from '../integrations/supabase/client';

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  shared_with: any[];
  created_at: string;
}

export interface SharedEvent extends Event {
  isOwnedByCurrentUser: boolean;
  isSharedWithCurrentUser: boolean;
}

export const getEvents = async (): Promise<Event[]> => {
  try {
    // Get session instead of just user to ensure proper auth context
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw sessionError;
    }
    
    if (!session?.user) {
      console.error('No authenticated user found');
      throw new Error('User not authenticated');
    }

    console.log('Fetching events for user:', session.user.id);

    // Use a simpler query that relies on RLS policies
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    console.log('Fetched events:', data?.length || 0, 'events');
    console.log('Events data:', data);

    return (data || []).map(event => ({
      ...event,
      shared_with: Array.isArray(event.shared_with) ? event.shared_with : []
    }));
  } catch (error) {
    console.error('getEvents error:', error);
    throw error;
  }
};

export const createEvent = async (event: Omit<Event, 'id' | 'user_id' | 'created_at'>): Promise<Event> => {
  try {
    // Get session to ensure proper auth context
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw sessionError;
    }
    
    if (!session?.user) {
      console.error('No authenticated user found');
      throw new Error('User not authenticated');
    }

    console.log('Creating event for user:', session.user.id);
    console.log('Event data:', event);

    // Ensure we're using the correct user_id from session
    const eventData = {
      ...event,
      user_id: session.user.id,
    };

    console.log('Event data with user_id:', eventData);

    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Created event successfully:', data);

    return {
      ...data,
      shared_with: Array.isArray(data.shared_with) ? data.shared_with : []
    };
  } catch (error) {
    console.error('createEvent error:', error);
    throw error;
  }
};

export const updateEvent = async (id: string, event: Partial<Event>): Promise<Event> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('events')
    .update(event)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }

  return {
    ...data,
    shared_with: Array.isArray(data.shared_with) ? data.shared_with : []
  };
};

export const deleteEvent = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

export const shareEvent = async (eventId: string, userEmail: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase.rpc('share_event_with_user' as any, {
    event_id: eventId,
    recipient_email: userEmail.trim().toLowerCase(),
  });

  if (error) {
    console.error('Error sharing event:', error);
    throw new Error(error.message || 'Failed to share event');
  }
};

export const getSharedEvents = async (): Promise<SharedEvent[]> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session?.user) {
    throw new Error('User not authenticated');
  }

  const events = await getEvents();
  const currentUserId = session.user.id;

  return events
    .map(event => {
      const sharedWith = Array.isArray(event.shared_with) ? event.shared_with : [];

      return {
        ...event,
        shared_with: sharedWith,
        isOwnedByCurrentUser: event.user_id === currentUserId,
        isSharedWithCurrentUser: event.user_id !== currentUserId,
      };
    })
    .filter(event => event.isSharedWithCurrentUser || event.shared_with.length > 0);
};