DROP INDEX IF EXISTS public.notifications_user_dedupe_key_idx;
CREATE UNIQUE INDEX notifications_user_dedupe_key_idx
  ON public.notifications USING btree (user_id, dedupe_key);