-- Recreate users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  shared_with JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GRANT statements
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.events TO service_role;
GRANT ALL ON public.notifications TO service_role;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Events policies
DROP POLICY IF EXISTS "Users can view their own events" ON public.events;
CREATE POLICY "Users can view their own events" 
ON public.events 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view shared events" ON public.events;
CREATE POLICY "Users can view shared events" 
ON public.events 
FOR SELECT 
USING (shared_with ? auth.uid()::text);

DROP POLICY IF EXISTS "Users can create their own events" ON public.events;
CREATE POLICY "Users can create their own events" 
ON public.events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own events" ON public.events;
CREATE POLICY "Users can update their own events" 
ON public.events 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own events" ON public.events;
CREATE POLICY "Users can delete their own events" 
ON public.events 
FOR DELETE 
USING (auth.uid() = user_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create notifications" ON public.notifications;
CREATE POLICY "Users can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = from_user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Trigger to create user profile on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to delete user completely
CREATE OR REPLACE FUNCTION public.delete_user_completely()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to delete account';
  END IF;
  
  DELETE FROM public.notifications WHERE user_id = current_user_id OR from_user_id = current_user_id;
  DELETE FROM public.events WHERE user_id = current_user_id;
  UPDATE public.events SET shared_with = shared_with - current_user_id::text WHERE shared_with ? current_user_id::text;
  DELETE FROM public.users WHERE id = current_user_id;
  DELETE FROM auth.users WHERE id = current_user_id;
END;
$$;

-- Function to get user by email
CREATE OR REPLACE FUNCTION public.get_user_by_email(user_email TEXT)
RETURNS TABLE(user_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT au.id
  FROM auth.users au
  WHERE au.email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for notifications timestamp
DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.events(start_time);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);