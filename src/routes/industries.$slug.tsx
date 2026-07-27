import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { ContentPageTemplate } from "@/components/site/ContentPageTemplate";
import { breadcrumbJsonLd } from "@/components/site/Breadcrumbs";
import { industries } from "@/content/industries";

export const Route = createFileRoute("/industries/$slug")({
  loader: ({ params }) => {
    const p = industries.find((s) => s.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Industry not found — Devowise" }, { name: "robots", content: "noindex" }] };
    const url = `/industries/${params.slug}`;
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
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }, { label: loaderData.h1, href: url }])) },
      ],
    };
  },
  component: IndustryDetail,
});

function IndustryDetail() {
  const p = Route.useLoaderData();
  return (
    <PageShell>
      <ContentPageTemplate page={p} crumbs={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }, { label: p.h1 }]} />
    </PageShell>
  );
}