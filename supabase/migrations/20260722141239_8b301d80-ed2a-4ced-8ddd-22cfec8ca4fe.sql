
ALTER TABLE public.pdf_events
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS referrer_source text,
  ADD COLUMN IF NOT EXISTS user_agent text,
  ADD COLUMN IF NOT EXISTS device_type text,
  ADD COLUMN IF NOT EXISTS browser text,
  ADD COLUMN IF NOT EXISTS os text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS is_bot boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS pdf_events_pdf_created_idx ON public.pdf_events (pdf_id, created_at DESC);
CREATE INDEX IF NOT EXISTS pdf_events_is_bot_idx ON public.pdf_events (is_bot);

DROP POLICY IF EXISTS "Public insert pdf_events" ON public.pdf_events;
CREATE POLICY "Public insert pdf_events" ON public.pdf_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (event_type = ANY (ARRAY['open'::text, 'view'::text]));
