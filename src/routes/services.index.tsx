import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { HubGrid } from "@/components/site/HubGrid";
import { PageCTA } from "@/components/site/PageCTA";
import { services } from "@/content/services";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Digital Services — Branding, Design, Web, AI & Growth | Devowise" },
      { name: "description", content: "Explore Devowise services: branding, UI/UX, web design, Framer, Webflow, Shopify, Kajabi, SEO, CRO, and AI systems built for growth." },
      { property: "og:title", content: "Devowise Services" },
      { property: "og:description", content: "Full-stack studio for branding, design, web, and AI." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesHub,
});

function ServicesHub() {
  return (
    <PageShell>
      <section className="pt-32 pb-10">
        <div className="mx-auto max-w-6xl px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
          <h1 className="mt-8 text-4xl md:text-6xl font-semibold tracking-tight text-gradient max-w-3xl">Services engineered for outcomes, not deliverables.</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">Design, engineering, and growth services delivered as a system, from brand strategy to AI-native products.</p>
        </div>
      </section>
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <HubGrid base="/services" items={services} />
        </div>
      </section>
      <PageCTA />
    </PageShell>
  );
}