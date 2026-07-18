
-- Remove the spoofable session-setting-based policy
DROP POLICY IF EXISTS "Users can find share recipients by email" ON public.users;

-- Rewrite functions as SECURITY DEFINER so they can look up recipients
-- without exposing user enumeration through RLS.
CREATE OR REPLACE FUNCTION public.share_event_with_user(recipient_email text, event_id uuid)
RETURNS TABLE(recipient_user_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sender_id uuid;
  target_user_id uuid;
  target_email text;
  event_title text;
  existing_shared_with jsonb;
BEGIN
  sender_id := auth.uid();
  IF sender_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  target_email := lower(trim(recipient_email));
  IF target_email IS NULL OR target_email = '' THEN
    RAISE EXCEPTION 'Recipient email is required';
  END IF;

  SELECT u.id INTO target_user_id
  FROM public.users u
  WHERE lower(u.email) = target_email
  LIMIT 1;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  SELECT e.title, COALESCE(e.shared_with, '[]'::jsonb)
    INTO event_title, existing_shared_with
  FROM public.events e
  WHERE e.id = event_id AND e.user_id = sender_id
  FOR UPDATE;

  IF event_title IS NULL THEN
    RAISE EXCEPTION 'Event not found or you do not have permission to share it';
  END IF;

  UPDATE public.events e
  SET shared_with = CASE
    WHEN existing_shared_with ? target_user_id::text THEN existing_shared_with
    ELSE existing_shared_with || to_jsonb(target_user_id::text)
  END
  WHERE e.id = event_id AND e.user_id = sender_id;

  INSERT INTO public.notifications (user_id, from_user_id, event_id, type, title, message)
  VALUES (
    target_user_id, sender_id, event_id, 'event_share',
    'Event Shared With You',
    format('"%s" has been shared with you', event_title)
  );

  recipient_user_id := target_user_id;
  RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_by_email(user_email text)
RETURNS TABLE(user_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_email text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  target_email := lower(trim(user_email));

  RETURN QUERY
  SELECT u.id FROM public.users u
  WHERE lower(u.email) = target_email
  LIMIT 1;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.share_event_with_user(text, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_by_email(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.share_event_with_user(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_by_email(text) TO authenticated;
