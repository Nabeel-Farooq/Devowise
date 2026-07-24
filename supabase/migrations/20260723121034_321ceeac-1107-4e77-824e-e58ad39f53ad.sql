
ALTER TABLE public.pdf_files ADD COLUMN IF NOT EXISTS slug text;

-- Backfill: slugify name (strip .pdf), ensure unique by appending short id suffix on collision
WITH base AS (
  SELECT
    id,
    NULLIF(
      regexp_replace(
        lower(regexp_replace(name, '\.pdf$', '', 'i')),
        '[^a-z0-9]+', '-', 'g'
      ),
      ''
    ) AS s
  FROM public.pdf_files
  WHERE slug IS NULL
),
cleaned AS (
  SELECT id, trim(both '-' from coalesce(s, 'file')) AS s FROM base
),
numbered AS (
  SELECT
    id,
    s,
    row_number() OVER (PARTITION BY s ORDER BY id) AS rn
  FROM cleaned
)
UPDATE public.pdf_files p
SET slug = CASE WHEN n.rn = 1 THEN n.s ELSE n.s || '-' || substr(p.id::text, 1, 6) END
FROM numbered n
WHERE p.id = n.id;

CREATE UNIQUE INDEX IF NOT EXISTS pdf_files_slug_key ON public.pdf_files (slug);
