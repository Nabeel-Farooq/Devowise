import { createFileRoute } from "@tanstack/react-router";
import { createSupabasePublicClient } from "@/lib/supabase-public.server";

export const Route = createFileRoute("/api/public/pdf/$id/inline")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const supabase = createSupabasePublicClient();
        const { data: row, error } = await supabase
          .from("pdf_files" as never)
          .select("storage_path, name")
          .eq("id", params.id)
          .maybeSingle();
        if (error || !row) return new Response("Not found", { status: 404 });
        const { storage_path: path, name } = row as { storage_path: string; name: string };
        const { data: file, error: dlErr } = await supabase.storage
          .from("portfolio-pdfs")
          .download(path);
        if (dlErr || !file) return new Response("File not found", { status: 404 });
        const { buildEventEnrichment } = await import("@/lib/tracking.server");
        const enrichment = await buildEventEnrichment(request);
        await supabase
          .from("pdf_events" as never)
          .insert({ pdf_id: params.id, event_type: "view", ...enrichment } as never);
        // Buffer the file so we can send Content-Length — mobile PDF viewers
        // (Chrome Android in particular) reject streamed responses without a
        // known length as "invalid format".
        const buffer = await file.arrayBuffer();
        const safeName = (name || "document").replace(/[^\w.\-]+/g, "_").replace(/\.pdf$/i, "") + ".pdf";
        return new Response(buffer, {
          headers: {
            "content-type": "application/pdf",
            "content-length": String(buffer.byteLength),
            "content-disposition": `inline; filename="${safeName}"`,
            "accept-ranges": "bytes",
            "cache-control": "private, max-age=300",
            "x-content-type-options": "nosniff",
          },
        });
      },
    },
  },
});