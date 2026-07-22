
CREATE TABLE public.pdf_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  size_bytes BIGINT,
  link_opens INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.pdf_files TO service_role;
ALTER TABLE public.pdf_files ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (server code) may read/write.

CREATE INDEX pdf_files_created_at_idx ON public.pdf_files (created_at DESC);

-- Atomic counter helpers
CREATE OR REPLACE FUNCTION public.increment_pdf_open(_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.pdf_files SET link_opens = link_opens + 1 WHERE id = _id;
$$;

CREATE OR REPLACE FUNCTION public.increment_pdf_view(_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.pdf_files SET views = views + 1, last_viewed_at = now() WHERE id = _id;
$$;

REVOKE ALL ON FUNCTION public.increment_pdf_open(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.increment_pdf_view(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_pdf_open(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_pdf_view(UUID) TO service_role;

-- Storage policies: public read for portfolio-pdfs bucket only
CREATE POLICY "Public read of portfolio pdfs"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio-pdfs');
