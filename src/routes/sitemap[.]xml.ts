import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { services } from "@/content/services";
import { platforms } from "@/content/platforms";
import { industries } from "@/content/industries";
import { solutions } from "@/content/solutions";
import { resources } from "@/content/resources";
import { blogCategories } from "@/content/categories";

const BASE_URL = "https://www.devowise.com";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          "/",
          "/services",
          "/platforms",
          "/industries",
          "/solutions",
          "/resources",
          "/case-studies",
          "/blog",
        ];
        const paths: string[] = [
          ...staticPaths,
          ...services.map((s) => `/services/${s.slug}`),
          ...platforms.map((s) => `/platforms/${s.slug}`),
          ...industries.map((s) => `/industries/${s.slug}`),
          ...solutions.map((s) => `/solutions/${s.slug}`),
          ...resources.map((s) => `/resources/${s.slug}`),
          ...blogCategories.map((c) => `/blog/category/${c.slug}`),
        ];

        // Dynamic blog posts
        try {
          const { createClient } = await import("@supabase/supabase-js");
          const url = process.env.SUPABASE_URL;
          const key = process.env.SUPABASE_PUBLISHABLE_KEY;
          if (url && key) {
            const sb = createClient(url, key, {
              auth: { persistSession: false, autoRefreshToken: false },
              global: {
                fetch: (input, init) => {
                  const h = new Headers(init?.headers);
                  if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
                  h.set("apikey", key);
                  return fetch(input, { ...init, headers: h });
                },
              },
            });
            const { data } = await sb.from("blog_posts").select("slug").eq("published", true);
            for (const row of data ?? []) paths.push(`/blog/${(row as { slug: string }).slug}`);
          }
        } catch {
          // ignore, fall back to static entries
        }

        const urls = paths
          .map((p) => `  <url>\n    <loc>${BASE_URL}${p}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`)
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});