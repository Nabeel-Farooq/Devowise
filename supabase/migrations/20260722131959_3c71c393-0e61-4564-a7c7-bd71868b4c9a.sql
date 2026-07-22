
-- Allow anonymous read of files in the portfolio-pdfs bucket (bucket stays private; served via signed URL from server)
DROP POLICY IF EXISTS "Anon read portfolio pdfs" ON storage.objects;
CREATE POLICY "Anon read portfolio pdfs" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'portfolio-pdfs');

-- Allow anonymous open/view event logging
GRANT INSERT ON public.pdf_events TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.pdf_events_id_seq TO anon;

DROP POLICY IF EXISTS "Public insert pdf_events" ON public.pdf_events;
CREATE POLICY "Public insert pdf_events" ON public.pdf_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (event_type IN ('open','view'));
