import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listPublishedPosts, type BlogPostSummary } from "@/lib/blog.functions";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PageCTA } from "@/components/site/PageCTA";

const postsQuery = queryOptions({ queryKey: ["blog", "list"], queryFn: () => listPublishedPosts() });

export const Route = createFileRoute("/case-studies/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  head: () => ({
    meta: [
      { title: "Case Studies — Real Projects, Real Outcomes | Devowise" },
      { name: "description", content: "Case studies from Devowise: AI systems, SaaS platforms, and high-performance web experiences with real outcomes." },
      { property: "og:title", content: "Devowise Case Studies" },
      { property: "og:description", content: "Selected work with real outcomes." },
      { property: "og:url", content: "/case-studies" },
    ],
    links: [{ rel: "canonical", href: "/case-studies" }],
  }),
  component: CaseStudiesHub,
});

function CaseStudiesHub() {
  const { data: posts } = useSuspenseQuery(postsQuery);
  return (
    <PageShell>
      <section className="pt-32 pb-10">
        <div className="mx-auto max-w-6xl px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Case Studies" }]} />
          <h1 className="mt-8 text-4xl md:text-6xl font-semibold tracking-tight text-gradient max-w-3xl">Selected work with real outcomes.</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">Detailed teardowns of the products we've shipped, the systems behind them, and what actually moved.</p>
        </div>
      </section>
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p: BlogPostSummary) => (
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
        </div>
      </section>
      <PageCTA />
    </PageShell>
  );
}