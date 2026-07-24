import { createFileRoute } from "@tanstack/react-router";
import { createSupabasePublicClient } from "@/lib/supabase-public.server";

export const Route = createFileRoute("/p/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const supabase = createSupabasePublicClient();
        const raw = params.id;
        const stripped = raw.replace(/\.pdf$/i, "");
        const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        let row: { id: string; name: string } | null = null;
        // Try slug first (strip .pdf), then fall back to raw id (UUID)
        {
          const { data } = await supabase
            .from("pdf_files" as never)
            .select("id, name")
            .eq("slug", stripped)
            .maybeSingle();
          row = (data as { id: string; name: string } | null) ?? null;
        }
        if (!row && uuidRe.test(raw)) {
          const { data } = await supabase
            .from("pdf_files" as never)
            .select("id, name")
            .eq("id", raw)
            .maybeSingle();
          row = (data as { id: string; name: string } | null) ?? null;
        }
        const error = null;
        if (error || !row) {
          return new Response("PDF not found", {
            status: 404,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }
        const { id: pdfId, name } = row;
        const { buildEventEnrichment } = await import("@/lib/tracking.server");
        const enrichment = await buildEventEnrichment(request);
        await supabase
          .from("pdf_events" as never)
          .insert({ pdf_id: pdfId, event_type: "open", ...enrichment } as never);
        const escape = (s: string) =>
          s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
        const safeName = escape(name);
        const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="robots" content="noindex"/><title>${safeName}</title><style>html,body{margin:0;padding:0;height:100%;background:#0a0a0a;}iframe{border:0;width:100vw;height:100vh;display:block;}</style></head><body><iframe src="/api/public/pdf/${pdfId}/inline" title="${safeName}" allow="fullscreen"></iframe></body></html>`;
        return new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});