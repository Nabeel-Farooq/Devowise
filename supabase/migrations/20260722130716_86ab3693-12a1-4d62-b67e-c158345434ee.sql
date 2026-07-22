GRANT SELECT ON public.pdf_files TO anon;
GRANT SELECT ON public.pdf_events TO anon;
ALTER TABLE public.pdf_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdf_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read pdf_files" ON public.pdf_files;
CREATE POLICY "Public read pdf_files" ON public.pdf_files FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public read pdf_events" ON public.pdf_events;
CREATE POLICY "Public read pdf_events" ON public.pdf_events FOR SELECT TO anon, authenticated USING (true);