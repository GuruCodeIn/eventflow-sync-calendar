-- Create private schema for sensitive functions
CREATE SCHEMA IF NOT EXISTS private;

-- Move delete_user_completely to private schema
CREATE OR REPLACE FUNCTION private.delete_user_completely()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = private, public
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

-- Move get_user_by_email to private schema
CREATE OR REPLACE FUNCTION private.get_user_by_email(user_email TEXT)
RETURNS TABLE(user_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT au.id
  FROM auth.users au
  WHERE au.email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = private, public;

-- Drop old public functions
DROP FUNCTION IF EXISTS public.delete_user_completely();
DROP FUNCTION IF EXISTS public.get_user_by_email(TEXT);

-- Grant execute to authenticated
GRANT EXECUTE ON FUNCTION private.delete_user_completely() TO authenticated;
GRANT EXECUTE ON FUNCTION private.get_user_by_email(TEXT) TO authenticated;

-- Revoke from PUBLIC
REVOKE EXECUTE ON FUNCTION private.delete_user_completely() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION private.get_user_by_email(TEXT) FROM PUBLIC;

-- Grant usage on private schema to authenticated
GRANT USAGE ON SCHEMA private TO authenticated;