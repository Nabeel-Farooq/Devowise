import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { ContentPageTemplate } from "@/components/site/ContentPageTemplate";
import { breadcrumbJsonLd } from "@/components/site/Breadcrumbs";
import { services } from "@/content/services";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const p = services.find((s) => s.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Service not found — Devowise" }, { name: "robots", content: "noindex" }] };
    const url = `/services/${params.slug}`;
    return {
      meta: [
        { title: loaderData.metaTitle },
        { name: "description", content: loaderData.metaDescription },
        { property: "og:title", content: loaderData.metaTitle },
        { property: "og:description", content: loaderData.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: loaderData.h1,
            description: loaderData.metaDescription,
            provider: { "@type": "Organization", name: "Devowise", url: "https://www.devowise.com" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: loaderData.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: loaderData.h1, href: url },
            ]),
          ),
        },
      ],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const p = Route.useLoaderData();
  return (
    <PageShell>
      <ContentPageTemplate
        page={p}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: p.h1 }]}
      />
    </PageShell>
  );
}