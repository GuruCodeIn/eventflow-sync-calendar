
-- 1. Drop unused SECURITY DEFINER helper (superseded by share_event_with_user)
DROP FUNCTION IF EXISTS public.get_user_by_email(text);

-- 2. Tighten EXECUTE on remaining SECURITY DEFINER function
REVOKE ALL ON FUNCTION public.share_event_with_user(text, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.share_event_with_user(text, uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.share_event_with_user(text, uuid) TO authenticated;

-- 3. Allow users to delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 4. Narrow user directory lookup: only reveal users you share an event with
CREATE POLICY "Users can view profiles of shared event participants"
ON public.users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.user_id = auth.uid()
      AND e.shared_with ? users.id::text
  )
  OR EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.user_id = users.id
      AND e.shared_with ? auth.uid()::text
  )
);
