import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  getPostBySlug,
  listPublishedPosts,
  type BlogPost,
  type BlogPostSummary,
} from "@/lib/blog.functions";

const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog", "post", slug],
    queryFn: () => getPostBySlug({ data: { slug } }),
  });

const relatedQuery = queryOptions({
  queryKey: ["blog", "list"],
  queryFn: () => listPublishedPosts(),
});

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!post) throw notFound();
    await context.queryClient.ensureQueryData(relatedQuery);
    return post;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Case study not found — Devowise" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData as BlogPost;
    const url = `/blog/${params.slug}`;
    const title = `${p.title} — Devowise Case Study`;
    const desc = p.summary;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(p.cover_image
          ? [
              { property: "og:image", content: p.cover_image },
              { name: "twitter:image", content: p.cover_image },
            ]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        ...(p.tags.length
          ? [{ name: "keywords", content: p.tags.join(", ") }]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            description: p.summary,
            image: p.cover_image ? [p.cover_image] : undefined,
            datePublished: p.created_at,
            dateModified: p.updated_at,
            author: { "@type": "Organization", name: "Devowise" },
            publisher: {
              "@type": "Organization",
              name: "Devowise",
              logo: {
                "@type": "ImageObject",
                url: "/favicon.svg",
              },
            },
            mainEntityOfPage: url,
            keywords: p.tags.join(", "),
          }),
        },
      ],
    };
  },
  component: PostPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background p-10 text-foreground">
      Failed to load: {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background p-10 text-center text-foreground">
      <div>
        <h1 className="text-3xl font-semibold">Case study not found</h1>
        <p className="mt-2 text-muted-foreground">This post may have been moved or unpublished.</p>
        <Link
          to="/blog"
          className="mt-6 inline-block rounded-md border border-border px-4 py-2 text-sm hover:bg-accent"
        >
          Back to blog
        </Link>
      </div>
    </div>
  ),
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  const { data: all } = useSuspenseQuery(relatedQuery);
  if (!post) return null;

  const related = all
    .filter((r) => r.slug !== post.slug)
    .filter((r) => r.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);
  const fallbackRelated = all.filter((r) => r.slug !== post.slug).slice(0, 3);
  const relatedList = related.length > 0 ? related : fallbackRelated;

  return (
    <article className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">
            ← All case studies
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Devowise
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 pt-14">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{post.summary}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          Published {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {post.cover_image && (
        <figure className="mx-auto mt-10 max-w-5xl px-6">
          <img
            src={post.cover_image}
            alt={`${post.title} — cover image`}
            className="w-full rounded-2xl border border-border/50 object-cover"
            loading="eager"
          />
        </figure>
      )}

      <div className="mx-auto mt-14 max-w-3xl space-y-12 px-6 pb-16">
        {post.overview && <Section title="Project overview" body={post.overview} />}
        {post.challenge && <Section title="The challenge" body={post.challenge} />}
        {post.solution && <Section title="Our solution" body={post.solution} />}
        {post.process && <Section title="Process" body={post.process} />}
        {post.tools.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Tools used</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tools.map((t) => (
                <li
                  key={t}
                  className="rounded-md border border-border/60 bg-card/40 px-3 py-1.5 text-sm text-foreground"
                >
                  {t}
                </li>
              ))}
            </ul>
          </section>
        )}
        {post.results && <Section title="Results" body={post.results} />}

        {post.gallery.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Gallery</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {post.gallery.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${post.title} screenshot ${i + 1}`}
                  loading="lazy"
                  className="w-full rounded-xl border border-border/50"
                />
              ))}
            </div>
          </section>
        )}

        {post.external_url && (
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <p className="text-sm text-muted-foreground">
              Explore the full project on Contra
            </p>
            <a
              href={post.external_url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
            >
              View on Contra <span aria-hidden>↗</span>
            </a>
          </div>
        )}
      </div>

      {relatedList.length > 0 && (
        <aside className="border-t border-border/50 bg-card/20">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <h2 className="text-xl font-semibold tracking-tight">Related case studies</h2>
            <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {relatedList.map((r) => (
                <RelatedCard key={r.id} post={r} />
              ))}
            </ul>
          </div>
        </aside>
      )}

      <footer className="border-t border-border/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Devowise</span>
          <Link to="/blog" className="hover:text-foreground">More case studies</Link>
        </div>
      </footer>
    </article>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-4 text-base leading-relaxed text-muted-foreground">
        {body.split(/\n{2,}/).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </section>
  );
}

function RelatedCard({ post }: { post: BlogPostSummary }) {
  return (
    <li className="overflow-hidden rounded-xl border border-border/60 bg-background/40">
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="block">
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={`${post.title} cover`}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover"
          />
        )}
        <div className="p-4">
          <h3 className="text-sm font-medium text-foreground">{post.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{post.summary}</p>
        </div>
      </Link>
    </li>
  );
}
