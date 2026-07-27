import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { ContentPageTemplate } from "@/components/site/ContentPageTemplate";
import { breadcrumbJsonLd } from "@/components/site/Breadcrumbs";
import { resources } from "@/content/resources";

export const Route = createFileRoute("/resources/$slug")({
  loader: ({ params }) => {
    const p = resources.find((s) => s.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Resource not found — Devowise" }, { name: "robots", content: "noindex" }] };
    const url = `/resources/${params.slug}`;
    return {
      meta: [
        { title: loaderData.metaTitle },
        { name: "description", content: loaderData.metaDescription },
        { property: "og:title", content: loaderData.metaTitle },
        { property: "og:description", content: loaderData.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: loaderData.h1, description: loaderData.metaDescription, author: { "@type": "Organization", name: "Devowise" } }) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: loaderData.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: loaderData.h1, href: url }])) },
      ],
    };
  },
  component: ResourceDetail,
});

function ResourceDetail() {
  const p = Route.useLoaderData();
  return (
    <PageShell>
      <ContentPageTemplate page={p} crumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: p.h1 }]} />
    </PageShell>
  );
}