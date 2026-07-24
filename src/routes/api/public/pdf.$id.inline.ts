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
        // Buffer the file so we can send Content-Length and support byte ranges.
        // Mobile PDF viewers often request ranges and can reject a streamed
        // response without proper 206 handling as "invalid format".
        const buffer = await file.arrayBuffer();
        const safeName = (name || "document").replace(/[^\w.\-]+/g, "_").replace(/\.pdf$/i, "") + ".pdf";
        const totalLength = buffer.byteLength;
        const baseHeaders = {
          "content-type": "application/pdf",
          "content-disposition": `inline; filename="${safeName}"`,
          "accept-ranges": "bytes",
          "cache-control": "private, max-age=300",
          "x-content-type-options": "nosniff",
        };

        const rangeHeader = request.headers.get("range");
        if (rangeHeader) {
          const match = rangeHeader.match(/^bytes=(\d*)-(\d*)$/);
          if (!match) {
            return new Response("Invalid range", {
              status: 416,
              headers: { ...baseHeaders, "content-range": `bytes */${totalLength}` },
            });
          }

          const startPart = match[1] ?? "";
          const endPart = match[2] ?? "";
          let start = 0;
          let end = totalLength - 1;

          if (startPart === "" && endPart !== "") {
            const suffixLength = Number(endPart);
            start = Math.max(totalLength - suffixLength, 0);
          } else if (startPart !== "") {
            start = Number(startPart);
            end = endPart === "" ? totalLength - 1 : Number(endPart);
          }

          const isValidRange =
            Number.isInteger(start) &&
            Number.isInteger(end) &&
            start >= 0 &&
            end >= start &&
            start < totalLength;

          if (!isValidRange) {
            return new Response("Range not satisfiable", {
              status: 416,
              headers: { ...baseHeaders, "content-range": `bytes */${totalLength}` },
            });
          }

          const clampedEnd = Math.min(end, totalLength - 1);
          const chunk = new Uint8Array(buffer, start, clampedEnd - start + 1);
          return new Response(chunk, {
            status: 206,
            headers: {
              ...baseHeaders,
              "content-length": String(chunk.byteLength),
              "content-range": `bytes ${start}-${clampedEnd}/${totalLength}`,
            },
          });
        }

        return new Response(buffer, {
          headers: { ...baseHeaders, "content-length": String(totalLength) },
        });
      },
    },
  },
});