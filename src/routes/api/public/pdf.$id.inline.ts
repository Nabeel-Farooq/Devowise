import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/pdf/$id/inline")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: row, error } = await supabaseAdmin
          .from("pdf_files" as never)
          .select("storage_path")
          .eq("id", params.id)
          .maybeSingle();
        if (error || !row) return new Response("Not found", { status: 404 });
        const path = (row as { storage_path: string }).storage_path;
        const { data: signed, error: signErr } = await supabaseAdmin.storage
          .from("portfolio-pdfs")
          .createSignedUrl(path, 60 * 60);
        if (signErr || !signed) return new Response("Signing failed", { status: 500 });
        const country =
          request.headers.get("cf-ipcountry") ||
          request.headers.get("x-vercel-ip-country") ||
          request.headers.get("x-country-code") ||
          null;
        await Promise.all([
          supabaseAdmin.rpc("increment_pdf_view" as never, { _id: params.id } as never),
          supabaseAdmin
            .from("pdf_events" as never)
            .insert({ pdf_id: params.id, event_type: "view", country } as never),
        ]);
        return Response.redirect(signed.signedUrl, 302);
      },
    },
  },
});