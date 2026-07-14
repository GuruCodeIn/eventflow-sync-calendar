-- Fix security linter warnings

-- 1. Set search_path on update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- 2. Revoke execute from public/anon on all security definer functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.delete_user_completely() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_by_email(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;

-- 3. Revoke execute from authenticated on trigger functions (they shouldn't be called directly)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM authenticated;

-- 4. Grant execute to authenticated on functions meant to be called by logged-in users
GRANT EXECUTE ON FUNCTION public.delete_user_completely() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_by_email(TEXT) TO authenticated;