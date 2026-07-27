import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listPublishedPosts, type BlogPostSummary } from "@/lib/blog.functions";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PageCTA } from "@/components/site/PageCTA";
import { findCategory, blogCategories } from "@/content/categories";

const postsQuery = queryOptions({ queryKey: ["blog", "list"], queryFn: () => listPublishedPosts() });

export const Route = createFileRoute("/blog/category/$slug")({
  loader: async ({ context, params }) => {
    const cat = findCategory(params.slug);
    if (!cat) throw notFound();
    await context.queryClient.ensureQueryData(postsQuery);
    return cat;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Category not found — Devowise" }, { name: "robots", content: "noindex" }] };
    const url = `/blog/category/${params.slug}`;
    return {
      meta: [
        { title: loaderData.metaTitle },
        { name: "description", content: loaderData.metaDescription },
        { property: "og:title", content: loaderData.metaTitle },
        { property: "og:description", content: loaderData.metaDescription },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: BlogCategory,
});

function BlogCategory() {
  const cat = Route.useLoaderData();
  const { data: posts } = useSuspenseQuery(postsQuery);
  const filtered = posts.filter((p: BlogPostSummary & { tags?: string[] }) =>
    (p.tags ?? []).some((t) => t.toLowerCase() === cat.slug.toLowerCase() || t.toLowerCase() === cat.name.toLowerCase()),
  );
  return (
    <PageShell>
      <section className="pt-32 pb-10">
        <div className="mx-auto max-w-6xl px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: cat.name }]} />
          <h1 className="mt-8 text-4xl md:text-6xl font-semibold tracking-tight text-gradient max-w-3xl">{cat.name} articles</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">{cat.intro}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {blogCategories.map((c) => (
              <Link
                key={c.slug}
                to="/blog/category/$slug"
                params={{ slug: c.slug }}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${c.slug === cat.slug ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-6">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground">No posts in this category yet, check back soon.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <li key={p.id} className="group overflow-hidden rounded-2xl border border-border bg-card/40 hover:border-primary/40 transition">
                  <Link to="/blog/$slug" params={{ slug: p.slug }} className="block">
                    {p.cover_image && (
                      <div className="aspect-[16/10] overflow-hidden bg-muted">
                        <img src={p.cover_image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]" />
                      </div>
                    )}
                    <div className="p-5">
                      <h2 className="text-lg font-medium">{p.title}</h2>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.summary}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <PageCTA />
    </PageShell>
  );
}