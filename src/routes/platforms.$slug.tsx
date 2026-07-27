import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { ContentPageTemplate } from "@/components/site/ContentPageTemplate";
import { breadcrumbJsonLd } from "@/components/site/Breadcrumbs";
import { platforms } from "@/content/platforms";

export const Route = createFileRoute("/platforms/$slug")({
  loader: ({ params }) => {
    const p = platforms.find((s) => s.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Platform not found — Devowise" }, { name: "robots", content: "noindex" }] };
    const url = `/platforms/${params.slug}`;
    return {
      meta: [
        { title: loaderData.metaTitle },
        { name: "description", content: loaderData.metaDescription },
        { property: "og:title", content: loaderData.metaTitle },
        { property: "og:description", content: loaderData.metaDescription },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: loaderData.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Platforms", href: "/platforms" }, { label: loaderData.h1, href: url }])) },
      ],
    };
  },
  component: PlatformDetail,
});

function PlatformDetail() {
  const p = Route.useLoaderData();
  return (
    <PageShell>
      <ContentPageTemplate page={p} crumbs={[{ label: "Home", href: "/" }, { label: "Platforms", href: "/platforms" }, { label: p.h1 }]} />
    </PageShell>
  );
}