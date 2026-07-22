
REVOKE EXECUTE ON FUNCTION public.increment_pdf_open(UUID) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_pdf_view(UUID) FROM anon, authenticated;
DROP POLICY IF EXISTS "Public read of portfolio pdfs" ON storage.objects;
