import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listPublishedPosts, type BlogPostSummary } from "@/lib/blog.functions";

const postsQuery = queryOptions({
  queryKey: ["blog", "list"],
  queryFn: () => listPublishedPosts(),
});

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  head: () => ({
    meta: [
      { title: "Case Studies & Insights — Devowise Blog" },
      {
        name: "description",
        content:
          "Case studies from Devowise: AI systems, SaaS platforms, and high-performance web experiences. Read how we design and build category-defining digital products.",
      },
      { property: "og:title", content: "Devowise Blog — Case Studies & Insights" },
      {
        property: "og:description",
        content:
          "In-depth case studies from our AI, SaaS, and web product engagements.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/blog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background p-10 text-foreground">
      <p className="text-sm text-muted-foreground">Failed to load posts: {error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background p-10 text-foreground">No posts yet.</div>
  ),
});

function BlogIndex() {
  const { data: posts } = useSuspenseQuery(postsQuery);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Devowise
          </Link>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/blog" className="text-foreground">Blog</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Journal</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Case studies & insights
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Long-form breakdowns of the products we build, the systems behind them, and the decisions
          that make them work.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts published yet.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function PostCard({ post }: { post: BlogPostSummary }) {
  return (
    <li className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition hover:border-border">
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="block"
        aria-label={`Read case study: ${post.title}`}
      >
        {post.cover_image && (
          <div className="aspect-[16/10] overflow-hidden bg-muted">
            <img
              src={post.cover_image}
              alt={`${post.title} cover image`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
          <h2 className="mt-3 text-lg font-medium leading-snug text-foreground">
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.summary}</p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
            Read more
            <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
          </div>
        </div>
      </Link>
    </li>
  );
}
