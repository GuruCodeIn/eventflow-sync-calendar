REVOKE EXECUTE ON FUNCTION public.share_event_with_user(text, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.share_event_with_user(text, uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.share_event_with_user(text, uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_user_by_email(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_by_email(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_user_by_email(text) TO authenticated;