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
        const pdfUrl = `/api/public/pdf/${pdfId}/inline`;
        const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="robots" content="noindex"/><title>${safeName}</title><style>html,body{margin:0;padding:0;height:100%;background:#0a0a0a;color:#e5e5e5;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}iframe,object{border:0;width:100vw;height:100vh;display:block;}.fallback{display:none;flex-direction:column;align-items:center;justify-content:center;height:100vh;padding:24px;text-align:center;gap:16px;}.fallback h1{font-size:18px;margin:0;font-weight:600;}.fallback p{font-size:14px;margin:0;color:#a3a3a3;max-width:320px;line-height:1.5;}.fallback a{display:inline-block;padding:12px 24px;background:#fff;color:#000;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;}@media (max-width:768px){.desktop-view{display:none;}.fallback{display:flex;}}</style></head><body><div class="desktop-view"><object data="${pdfUrl}" type="application/pdf"><iframe src="${pdfUrl}" title="${safeName}" allow="fullscreen"></iframe></object></div><div class="fallback"><h1>${safeName}</h1><p>Tap below to open the PDF in your device's viewer.</p><a href="${pdfUrl}" target="_blank" rel="noopener">Open PDF</a></div><script>(function(){var ua=navigator.userAgent||"";var isMobile=/Android|iPhone|iPad|iPod|Mobile/i.test(ua);if(isMobile){window.location.replace(${JSON.stringify(pdfUrl)});}})();</script></body></html>`;
        return new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});