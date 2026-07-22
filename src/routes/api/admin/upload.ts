import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { getAdminSession } = await import("@/lib/admin-session.server");
        const session = await getAdminSession();
        if (!session.data.authed) {
          return new Response("Unauthorized", { status: 401 });
        }
        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File)) {
          return new Response("No file provided", { status: 400 });
        }
        if (file.type && file.type !== "application/pdf") {
          return new Response("Only PDF files allowed", { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const key = `${crypto.randomUUID()}-${safeName}`;
        const buffer = new Uint8Array(await file.arrayBuffer());
        const { error: upErr } = await supabaseAdmin.storage
          .from("portfolio-pdfs")
          .upload(key, buffer, {
            contentType: "application/pdf",
            upsert: false,
          });
        if (upErr) return new Response(upErr.message, { status: 500 });
        const { error: insErr } = await supabaseAdmin
          .from("pdf_files" as never)
          .insert({
            name: file.name,
            storage_path: key,
            size_bytes: file.size,
          } as never);
        if (insErr) {
          await supabaseAdmin.storage.from("portfolio-pdfs").remove([key]);
          return new Response(insErr.message, { status: 500 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});