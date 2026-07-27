import { ArrowUpRight, Linkedin } from "lucide-react";
import devowiseLogo from "@/assets/devowise-logo.png";
import { services } from "@/content/services";
import { platforms } from "@/content/platforms";
import { industries } from "@/content/industries";

function Col({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">{title}</div>
      <ul className="flex flex-col gap-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <img src={devowiseLogo} alt="Devowise" className="h-4 max-h-4 w-auto max-w-[96px] object-contain logo-animated" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Devowise is a product and design studio building AI systems, SaaS platforms, and high-performance web experiences.
          </p>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <a href="https://contra.com/devowise" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"><ArrowUpRight className="h-4 w-4" /> Contra</a>
            <a href="https://www.linkedin.com/company/devowise" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"><Linkedin className="h-4 w-4" /> LinkedIn</a>
          </div>
        </div>
        <Col title="Services" links={services.slice(0, 8).map((s) => ({ label: s.h1, href: `/services/${s.slug}` }))} />
        <Col title="Platforms" links={platforms.map((p) => ({ label: p.eyebrow, href: `/platforms/${p.slug}` }))} />
        <Col title="Industries" links={industries.slice(0, 8).map((i) => ({ label: i.eyebrow, href: `/industries/${i.slug}` }))} />
        <Col
          title="Company"
          links={[
            { label: "Case Studies", href: "/case-studies" },
            { label: "Blog", href: "/blog" },
            { label: "Resources", href: "/resources" },
            { label: "Solutions", href: "/solutions" },
            { label: "Contact", href: "mailto:contact@devowise.com" },
          ]}
        />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Devowise. All rights reserved.</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/services" className="hover:text-foreground">Services</a>
            <a href="/platforms" className="hover:text-foreground">Platforms</a>
            <a href="/industries" className="hover:text-foreground">Industries</a>
            <a href="/solutions" className="hover:text-foreground">Solutions</a>
            <a href="/resources" className="hover:text-foreground">Resources</a>
            <a href="/blog" className="hover:text-foreground">Blog</a>
          </div>
        </div>
      </div>
    </footer>
  );
}