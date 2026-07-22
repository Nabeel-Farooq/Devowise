import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/p/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: row, error } = await supabaseAdmin
          .from("pdf_files" as never)
          .select("id, name")
          .eq("id", params.id)
          .maybeSingle();
        if (error || !row) {
          return new Response("PDF not found", {
            status: 404,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }
        const { name } = row as { id: string; name: string };
        const country =
          request.headers.get("cf-ipcountry") ||
          request.headers.get("x-vercel-ip-country") ||
          request.headers.get("x-country-code") ||
          null;
        await Promise.all([
          supabaseAdmin.rpc("increment_pdf_open" as never, { _id: params.id } as never),
          supabaseAdmin
            .from("pdf_events" as never)
            .insert({ pdf_id: params.id, event_type: "open", country } as never),
        ]);
        const escape = (s: string) =>
          s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
        const safeName = escape(name);
        const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="robots" content="noindex"/><title>${safeName}</title><style>html,body{margin:0;padding:0;height:100%;background:#0a0a0a;}iframe{border:0;width:100vw;height:100vh;display:block;}</style></head><body><iframe src="/api/public/pdf/${params.id}/inline" title="${safeName}" allow="fullscreen"></iframe></body></html>`;
        return new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});