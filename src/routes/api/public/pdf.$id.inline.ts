import { createFileRoute } from "@tanstack/react-router";
import { createSupabasePublicClient } from "@/lib/supabase-public.server";

export const Route = createFileRoute("/api/public/pdf/$id/inline")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const supabase = createSupabasePublicClient();
        const { data: row, error } = await supabase
          .from("pdf_files" as never)
          .select("storage_path")
          .eq("id", params.id)
          .maybeSingle();
        if (error || !row) return new Response("Not found", { status: 404 });
        const path = (row as { storage_path: string }).storage_path;
        const { data: file, error: dlErr } = await supabase.storage
          .from("portfolio-pdfs")
          .download(path);
        if (dlErr || !file) return new Response("File not found", { status: 404 });
        const { buildEventEnrichment } = await import("@/lib/tracking.server");
        const enrichment = await buildEventEnrichment(request);
        await supabase
          .from("pdf_events" as never)
          .insert({ pdf_id: params.id, event_type: "view", ...enrichment } as never);
        return new Response(file.stream(), {
          headers: {
            "content-type": "application/pdf",
            "content-disposition": "inline",
            "cache-control": "private, max-age=300",
          },
        });
      },
    },
  },
});