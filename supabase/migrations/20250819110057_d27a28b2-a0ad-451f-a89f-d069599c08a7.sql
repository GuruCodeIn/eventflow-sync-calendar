-- Fix the search path security issue for delete_user_completely function
CREATE OR REPLACE FUNCTION public.delete_user_completely()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to delete account';
  END IF;
  
  -- Delete user's notifications (both received and sent)
  DELETE FROM public.notifications WHERE user_id = current_user_id OR from_user_id = current_user_id;
  
  -- Delete user's events
  DELETE FROM public.events WHERE user_id = current_user_id;
  
  -- Remove user from shared_with arrays in other users' events
  UPDATE public.events 
  SET shared_with = shared_with - current_user_id::text 
  WHERE shared_with ? current_user_id::text;
  
  -- Delete user's profile
  DELETE FROM public.users WHERE id = current_user_id;
  
  -- Delete from auth.users (this will cascade and remove the user completely)
  DELETE FROM auth.users WHERE id = current_user_id;
END;
$$;