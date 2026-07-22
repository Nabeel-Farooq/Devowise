import { createServerFn } from "@tanstack/react-start";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  cover_image: string | null;
  external_url: string | null;
  overview: string | null;
  challenge: string | null;
  solution: string | null;
  process: string | null;
  tools: string[];
  results: string | null;
  gallery: string[];
  tags: string[];
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BlogPostSummary = Pick<
  BlogPost,
  "id" | "slug" | "title" | "summary" | "cover_image" | "tags" | "created_at"
>;

function serverClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  // Use the shared supabase client (SSR-safe, no localStorage in server context via publishable client)
  // Import lazily to keep module client-safe.
  return import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    }),
  );
}

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogPostSummary[]> => {
    const sb = await serverClient();
    const { data, error } = await sb
      .from("blog_posts")
      .select("id, slug, title, summary, cover_image, tags, created_at")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as BlogPostSummary[];
  },
);

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }): Promise<BlogPost | null> => {
    const sb = await serverClient();
    const { data: row, error } = await sb
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row as BlogPost | null) ?? null;
  });

// -------- Admin CRUD --------

export type BlogPostInput = {
  slug: string;
  title: string;
  summary: string;
  cover_image?: string | null;
  external_url?: string | null;
  overview?: string | null;
  challenge?: string | null;
  solution?: string | null;
  process?: string | null;
  tools?: string[];
  results?: string | null;
  gallery?: string[];
  tags?: string[];
  published?: boolean;
  sort_order?: number;
};

export const adminListPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogPost[]> => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("blog_posts" as never)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as BlogPost[];
  },
);

export const adminGetPost = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }): Promise<BlogPost | null> => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("blog_posts" as never)
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row as unknown as BlogPost | null) ?? null;
  });

export const adminSavePost = createServerFn({ method: "POST" })
  .inputValidator((d: { id?: string; input: BlogPostInput }) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      slug: data.input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
      title: data.input.title.trim(),
      summary: data.input.summary.trim(),
      cover_image: data.input.cover_image?.trim() || null,
      external_url: data.input.external_url?.trim() || null,
      overview: data.input.overview ?? null,
      challenge: data.input.challenge ?? null,
      solution: data.input.solution ?? null,
      process: data.input.process ?? null,
      tools: data.input.tools ?? [],
      results: data.input.results ?? null,
      gallery: data.input.gallery ?? [],
      tags: data.input.tags ?? [],
      published: data.input.published ?? true,
      sort_order: data.input.sort_order ?? 0,
    };
    if (!payload.slug || !payload.title || !payload.summary) {
      return { ok: false as const, error: "Slug, title, and summary are required." };
    }
    if (data.id) {
      const { error } = await supabaseAdmin
        .from("blog_posts" as never)
        .update(payload as never)
        .eq("id", data.id);
      if (error) return { ok: false as const, error: error.message };
      return { ok: true as const, id: data.id };
    }
    const { data: inserted, error } = await supabaseAdmin
      .from("blog_posts" as never)
      .insert(payload as never)
      .select("id")
      .maybeSingle();
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, id: (inserted as { id: string } | null)?.id ?? "" };
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("blog_posts" as never)
      .delete()
      .eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });
