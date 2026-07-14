
CREATE OR REPLACE FUNCTION public.get_user_by_email(user_email text)
RETURNS TABLE(user_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY SELECT au.id FROM auth.users au WHERE au.email = user_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_by_email(text) TO authenticated;
