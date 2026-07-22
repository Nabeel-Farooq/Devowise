
CREATE TABLE public.pdf_events (
  id BIGSERIAL PRIMARY KEY,
  pdf_id UUID NOT NULL REFERENCES public.pdf_files(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('open','view')),
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX pdf_events_pdf_id_created_at_idx ON public.pdf_events (pdf_id, created_at DESC);
CREATE INDEX pdf_events_created_at_idx ON public.pdf_events (created_at DESC);

GRANT ALL ON public.pdf_events TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.pdf_events_id_seq TO service_role;

ALTER TABLE public.pdf_events ENABLE ROW LEVEL SECURITY;
-- No policies: service_role bypasses RLS; nobody else has access.
