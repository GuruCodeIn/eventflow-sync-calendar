-- Explicitly revoke from anon and authenticated roles
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_user_completely() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_by_email(TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;

-- Ensure authenticated can still call the intended functions
GRANT EXECUTE ON FUNCTION public.delete_user_completely() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_by_email(TEXT) TO authenticated;

-- Double-check: revoke from PUBLIC too
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;