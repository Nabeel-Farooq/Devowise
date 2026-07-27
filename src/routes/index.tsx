import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Sparkles, Layers, Zap, Cpu, PenTool, Globe, Linkedin, Plus, Clock, Handshake, Rocket, Menu, X } from "lucide-react";
import { useState } from "react";
import devowiseLogo from "@/assets/devowise-logo.png";
import { services as allServices } from "@/content/services";
import { platforms } from "@/content/platforms";
import { industries } from "@/content/industries";
import { solutions } from "@/content/solutions";
import { resources } from "@/content/resources";
import { blogCategories } from "@/content/categories";

function SiteDirectory() {
  const groups: { title: string; base: string; items: { label: string; slug: string }[]; hub: string }[] = [
    { title: "Services", hub: "/services", base: "/services", items: allServices.map((s) => ({ label: s.h1, slug: s.slug })) },
    { title: "Platforms", hub: "/platforms", base: "/platforms", items: platforms.map((p) => ({ label: p.h1, slug: p.slug })) },
    { title: "Industries", hub: "/industries", base: "/industries", items: industries.map((i) => ({ label: i.eyebrow, slug: i.slug })) },
    { title: "Solutions", hub: "/solutions", base: "/solutions", items: solutions.map((s) => ({ label: s.h1, slug: s.slug })) },
    { title: "Resources", hub: "/resources", base: "/resources", items: resources.map((r) => ({ label: r.h1, slug: r.slug })) },
    { title: "Blog Categories", hub: "/blog", base: "/blog/category", items: blogCategories.map((c) => ({ label: c.name, slug: c.slug })) },
  ];
  return (
    <section className="py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Explore Devowise</div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-2xl">Every service, platform, industry, and guide.</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">A full directory of what we do and who we build for. Jump straight to a page.</p>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g.title} className="rounded-2xl border border-border bg-background/40 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{g.title}</div>
                <a href={g.hub} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">All <ArrowUpRight className="h-3 w-3" /></a>
              </div>
              <ul className="flex flex-col gap-1.5">
                {g.items.map((it) => (
                  <li key={it.slug}>
                    <a href={`${g.base}/${it.slug}`} className="text-sm text-foreground/80 hover:text-foreground block truncate">
                      {it.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="/case-studies" className="hover:text-foreground">Case Studies</a>
          <a href="/blog" className="hover:text-foreground">Blog</a>
          <a href="/services" className="hover:text-foreground">All Services</a>
          <a href="/platforms" className="hover:text-foreground">All Platforms</a>
          <a href="/industries" className="hover:text-foreground">All Industries</a>
          <a href="/solutions" className="hover:text-foreground">All Solutions</a>
          <a href="/resources" className="hover:text-foreground">All Resources</a>
        </div>
      </div>
    </section>
  );
}

const CALENDLY_URL = "https://calendly.com/nabeelfarooq1515/30min";

const certifications = [
  { name: "Framer Expert", desc: "Certified by Framer as highly skilled.", domain: "framer.com" },
  { name: "LottieFiles × Framer Expert", desc: "Certified by LottieFiles × Framer as highly skilled.", domain: "lottiefiles.com" },
  { name: "Kajabi Expert", desc: "Certified by Kajabi as highly skilled.", domain: "kajabi.com" },
  { name: "Ideogram Partner", desc: "Certified by Ideogram as highly skilled.", domain: "ideogram.ai" },
  { name: "MagicPath Expert", desc: "Certified by MagicPath as highly skilled.", domain: "magicpath.ai" },
  { name: "Kit Expert", desc: "Certified by Kit as highly skilled.", domain: "kit.com" },
  { name: "Anything Expert", desc: "Certified by Anything as highly skilled.", domain: "anything.com" },
  { name: "Lovart Expert", desc: "Certified by Lovart as highly skilled.", domain: "lovart.ai" },
  { name: "React Certified", desc: "Verified proficiency building production React applications.", domain: "react.dev" },
  { name: "Next.js Certified", desc: "Verified proficiency shipping Next.js apps at scale.", domain: "nextjs.org" },
  { name: "Node.js Certified", desc: "Verified proficiency with Node.js server runtimes and APIs.", domain: "nodejs.org" },
  { name: "TypeScript Certified", desc: "Verified proficiency across large TypeScript codebases.", domain: "typescriptlang.org" },
  { name: "Tailwind CSS Certified", desc: "Verified proficiency with Tailwind design systems.", domain: "tailwindcss.com" },
  { name: "Webflow Expert", desc: "Certified by Webflow for building production sites and CMS-driven experiences.", domain: "webflow.com" },
  { name: "Shopify Partner", desc: "Recognized Shopify partner shipping storefronts and custom themes.", domain: "shopify.com" },
  { name: "Vercel Certified", desc: "Verified proficiency deploying edge and serverless apps on Vercel.", domain: "vercel.com" },
];

export const Route = createFileRoute("/")({
  component: Index,
});

const work = [
  {
    name: "MindMesh",
    outcome: "AI-enhanced travel & lifestyle blog with editorial-grade UX.",
    tags: ["AI", "Web"],
    image: "https://media.contra.com/image/upload/q_auto,w_1100/x5xlzdf4aw0pvv6x6jm2.avif",
    slug: "mindmesh-ai-travel-blog",
  },
  {
    name: "JobFit AI",
    outcome: "AI-powered recruitment platform matching talent to roles at scale.",
    tags: ["AI", "SaaS"],
    image: "https://media.contra.com/image/upload/q_auto,w_1100/fhk5off99wsy4rtg6vms.avif",
    slug: "jobfit-ai-recruitment",
  },
  {
    name: "BatchQ",
    outcome: "Real-time AI data pipeline automation for modern engineering teams.",
    tags: ["AI", "Data"],
    image: "https://media.contra.com/image/upload/q_auto,w_1100/pdzoosftnkoukdxpv2vw.avif",
    slug: "batchq-ai-data-pipeline",
  },
  {
    name: "PrismPay",
    outcome: "Designing a seamless payment interface for a next-gen fintech.",
    tags: ["Fintech", "Product"],
    image: "https://media.contra.com/image/upload/q_auto,w_1100/dlrvk0otsfjri9rl4dge.avif",
    slug: "prismpay-payments-interface",
  },
  {
    name: "Clay",
    outcome: "Modern real estate website development with a refined design system.",
    tags: ["Web", "Design"],
    image: "https://media.contra.com/image/upload/q_auto,w_1100/jlp1znzefqnqliegbqp6.avif",
    slug: "clay-real-estate",
  },
  {
    name: "VELTO",
    outcome: "Fashion e-commerce landing built to convert premium shoppers.",
    tags: ["E-commerce", "Web"],
    image: "https://media.contra.com/image/upload/q_auto,w_1100/mzrsbth59bt0gxajcgpz.avif",
    slug: "velto-fashion-ecommerce",
  },
  {
    name: "Archon",
    outcome: "Website development for a category-defining B2B brand.",
    tags: ["Web", "Framer"],
    image: "https://media.contra.com/image/upload/q_auto,w_1100/znlna13le5kwwwiinkz2.avif",
    slug: "archon-website",
  },
  {
    name: "GoPlay",
    outcome: "Outdoor sports booking application, mobile-first product design.",
    tags: ["Mobile", "Product"],
    image: "https://media.contra.com/image/upload/q_auto,w_1100/mqv7xfz9jzeln20n2jnm.avif",
    slug: "goplay-sports-booking",
  },
  {
    name: "NOIREVE",
    outcome: "French luxury beauty & skincare brand experience.",
    tags: ["Brand", "E-commerce"],
    image: "https://media.contra.com/image/upload/q_auto,w_1100/lfzbmz09gzhnj32ru1wx.avif",
    slug: "noireve-luxury-beauty",
  },
];

const services = [
  {
    icon: Cpu,
    title: "AI Systems & AI Agents",
    outcome: "Production-grade AI features and autonomous agents wired into your real workflows, with evals, guardrails, and observability, not weekend demos.",
    bullets: [
      "LLM pipelines with RAG and evals",
      "Autonomous agents & tool use",
      "Vector search & knowledge bases",
      "OpenAI, Anthropic, open models",
    ],
  },
  {
    icon: Layers,
    title: "SaaS & Web Applications",
    outcome: "End-to-end SaaS and web apps engineered for scale, from auth and billing to multi-tenant data models and edge performance that compounds as you grow.",
    bullets: [
      "Full-stack React / Next / TanStack",
      "Auth, billing, multi-tenant",
      "Postgres, edge & serverless",
      "Observability from day one",
    ],
  },
  {
    icon: PenTool,
    title: "UX/UI & Design Systems",
    outcome: "Product-led UX and reusable design systems that unify your surface area across web, mobile, and marketing, so every team ships faster with a consistent brand.",
    bullets: [
      "Product UX & interaction design",
      "Component libraries in Figma",
      "Tokens, theming & dark mode",
      "Motion & micro-interactions",
    ],
  },
  {
    icon: Zap,
    title: "Automation & Integrations",
    outcome: "Custom automations, internal tools, and API integrations that connect your stack end-to-end and remove repetitive ops work from your team's plate.",
    bullets: [
      "Internal tools & dashboards",
      "Zapier, n8n, custom workflows",
      "Stripe, CRM & API integrations",
      "Data sync & webhooks",
    ],
  },
  {
    icon: Globe,
    title: "Framer / Webflow Websites",
    outcome: "Framer and Webflow builds for marketing sites, product pages, portfolios, storefronts, and content-heavy platforms, fast, CMS-driven, and easy for your team to own.",
    bullets: [
      "Framer & Webflow builds",
      "CMS, forms & localization",
      "Motion, 3D & Lottie",
      "SEO, performance & analytics",
    ],
  },
  {
    icon: Sparkles,
    title: "Product Strategy",
    outcome: "Discovery, scoping, and roadmapping sessions that sharpen your positioning and de-risk the build before a single line of code or pixel is committed.",
    bullets: [
      "Discovery & product scoping",
      "Roadmapping & milestones",
      "Positioning & messaging",
      "Metrics & experimentation",
    ],
  },
];

const techStack = [
  "react.dev", "nextjs.org", "typescriptlang.org", "javascript.com", "nodejs.org",
  "tanstack.com", "remix.run", "vitejs.dev", "vuejs.org", "svelte.dev",
  "astro.build", "tailwindcss.com", "sass-lang.com", "framer.com", "webflow.com",
  "figma.com", "lottiefiles.com", "gsap.com", "threejs.org", "storybook.js.org",
  "shadcn.com", "radix-ui.com", "prisma.io", "supabase.com", "firebase.google.com",
  "postgresql.org", "mysql.com", "mongodb.com", "redis.io", "planetscale.com",
  "vercel.com", "netlify.com", "cloudflare.com", "aws.amazon.com", "cloud.google.com",
  "docker.com", "kubernetes.io", "github.com", "gitlab.com", "expo.dev",
  "reactnative.dev", "flutter.dev", "swift.org", "kotlinlang.org", "python.org",
  "django.com", "fastapi.tiangolo.com", "openai.com", "anthropic.com", "huggingface.co",
  "langchain.com", "pinecone.io", "stripe.com", "twilio.com", "sentry.io",
  "posthog.com", "algolia.com", "clerk.com", "auth0.com", "shopify.com",
];

const process = [
  { step: "01", title: "Discover", desc: "Product strategy, technical scoping, and success metrics." },
  { step: "02", title: "Design", desc: "Design systems and interfaces engineered for scale." },
  { step: "03", title: "Build", desc: "Ship production software with modern, tested foundations." },
  { step: "04", title: "Scale", desc: "Iterate on data, optimize performance, growth, and revenue." },
];

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <a href="#top" className="flex h-10 items-center gap-2 font-semibold tracking-tight shrink-0">
          <img src={devowiseLogo} alt="Devowise" className="h-5 max-h-5 w-auto max-w-[112px] object-contain logo-animated" />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#work" className="hover:text-foreground transition-colors">Work</a>
          <a href="#services" className="hover:text-foreground transition-colors">Services</a>
          <a href="#how" className="hover:text-foreground transition-colors">Engagements</a>
          <a href="#certifications" className="hover:text-foreground transition-colors">Certifications</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          <a href="/blog" className="hover:text-foreground transition-colors">Blog</a>
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Book a Call <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden inline-flex items-center gap-1 rounded-full bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Book <ArrowRight className="h-3 w-3" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-border text-foreground/80 hover:text-foreground"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1 text-sm">
            {[
              { href: "#work", label: "Work" },
              { href: "#services", label: "Services" },
              { href: "#how", label: "Engagements" },
              { href: "#certifications", label: "Certifications" },
              { href: "#faq", label: "FAQ" },
              { href: "/blog", label: "Blog" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative pt-40 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.15]" style={{
        backgroundImage: "linear-gradient(to right, oklch(1 0 0 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.06) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        maskImage: "radial-gradient(ellipse 60% 60% at 50% 30%, black, transparent 80%)",
      }} />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-muted-foreground mb-8 animate-fade-up">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Because Your Success Is Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.02] text-gradient animate-fade-up">
            We design and build AI-powered digital products that scale businesses.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-up">
            Devowise is a product and design studio crafting SaaS, AI systems, and high-performance web experiences.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3 animate-fade-up">
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary-glow transition-colors">
              Book a Call <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#work" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-5 py-3 text-sm font-medium hover:bg-card transition-colors">
              View Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const items = [
    { num: "14", suffix: "+", suffixColor: "text-primary", label: "Products Shipped" },
    { num: "04", suffix: "", suffixColor: "", label: "Projects Ongoing" },
    { num: "4.9", suffix: "/5", suffixColor: "text-muted-foreground", label: "Client Satisfaction" },
  ];
  return (
    <section className="py-2">
      <div className="mx-auto max-w-3xl px-6">
        <div className="group relative flex flex-col md:flex-row items-stretch justify-between rounded-2xl border border-border bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="pointer-events-none absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
          <div className="pointer-events-none absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-30" />
          {items.map((i, idx) => (
            <div
              key={i.label}
              className={`relative flex-1 p-5 md:p-6 flex flex-col items-center justify-center transition-colors duration-500 hover:bg-foreground/[0.02] ${
                idx < items.length - 1 ? "border-b md:border-b-0 md:border-r border-border/60" : ""
              }`}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-extrabold tracking-tighter text-foreground">{i.num}</span>
                {i.suffix ? (
                  <span className={`text-lg font-semibold ${i.suffixColor}`}>{i.suffix}</span>
                ) : null}
              </div>
              <div className="mt-2 text-[9px] md:text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground">
                {i.label}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto h-8 w-4/5 rounded-full -mt-4 opacity-50 blur-3xl bg-primary/5" />
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-6 mb-14">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Selected Work</div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-2xl">Products shipped, systems that scale.</h2>
          </div>
          <a href="#contact" className="hidden md:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Start a project <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {work.map((p, i) => (
            <a
              key={p.name}
              href={`/blog/${p.slug}`}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40 transition-all duration-300 ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? "h-80 md:h-[26rem]" : "h-56 md:h-64"}`}>
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
              </div>
              <div className="relative p-6 md:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {p.tags.map((t) => (
                        <span key={t} className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2 py-0.5">{t}</span>
                      ))}
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{p.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md">{p.outcome}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <a
            href="https://contra.com/devowise"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View full portfolio on Contra <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Capabilities</div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Everything needed to ship a serious product.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {services.map((s) => (
            <div key={s.title} className="group bg-background p-8 hover:bg-card transition-colors flex flex-col">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/60 text-primary group-hover:border-primary/40 transition-colors">
                <s.icon className="h-4.5 w-4.5" />
              </div>
              <h3 className="mt-6 text-lg font-medium tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.outcome}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  const row = [...techStack, ...techStack];
  return (
    <section id="stack" className="py-24 border-t border-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 mb-10 text-center">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Technology Stack</div>
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">Modern tools we ship with, every day.</h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">A cross-section of the frameworks, platforms, and services powering our web, mobile, and AI builds.</p>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />
        <div className="marquee-track flex gap-4 w-max">
          {row.map((domain, i) => (
            <div
              key={`${domain}-${i}`}
              className="group flex items-center gap-3 rounded-full border border-border bg-card/40 px-5 py-2.5 hover:bg-card hover:border-primary/40 transition-colors shrink-0"
              title={domain}
            >
              <img
                src={`https://img.logo.dev/${domain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&format=png&size=64&retina=true`}
                alt=""
                loading="lazy"
                className="h-6 w-6 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                }}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors capitalize">
                {domain.replace(/^(www\.)/, "").split(".")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Process</div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">A structured pipeline, not a pitch deck.</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {process.map((p) => (
            <div key={p.step} className="relative pt-6 border-t border-border">
              <div className="absolute -top-px left-0 h-px w-12 bg-primary" />
              <div className="text-xs text-muted-foreground font-mono">{p.step}</div>
              <h3 className="mt-3 text-lg font-medium">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return _about();
}

function Certifications() {
  return (
    <section id="certifications" className="py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Certifications</div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Officially certified across the tools we ship with.</h2>
          <p className="mt-4 text-muted-foreground max-w-xl">Recognized partners and experts across leading product, design, and AI platforms.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {certifications.map((c) => (
            <div
              key={c.name}
              className="group relative bg-background p-6 flex items-start gap-4 transition-colors duration-300 hover:bg-card overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
              <div className="relative h-12 w-12 shrink-0 flex items-center justify-center">
                <img
                  src={`https://img.logo.dev/${c.domain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&format=png&size=200&retina=true`}
                  alt={`${c.name} logo`}
                  loading="lazy"
                  className="cert-logo h-11 w-11 object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${c.domain}&sz=128`;
                  }}
                />
              </div>
              <div className="relative">
                <h3 className="text-sm font-medium leading-tight transition-colors group-hover:text-foreground">{c.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function _about() {
  return (
    <section id="about" className="py-32 border-t border-border">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-6">About</div>
        <p className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-gradient">
          Devowise is a small, senior team building AI and product systems for companies that take software seriously.
        </p>
        <p className="mt-8 text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          We focus on the intersection of engineering, design, and AI, shipping infrastructure, interfaces, and automation that hold up under real load. Every engagement is led by principals. No account managers, no ceremony.
        </p>
      </div>
    </section>
  );
}

function CTA() {
  return _cta();
}

const engagements = [
  { icon: Rocket, title: "Sprint", meta: "2–4 weeks", desc: "Focused build for a landing page, MVP feature, or AI prototype. Fixed scope, fast turnaround." },
  { icon: Handshake, title: "Partnership", meta: "1–3 months", desc: "Full product engagements, design system, app build, launch. Weekly demos, shared Linear." },
  { icon: Clock, title: "Retainer", meta: "Ongoing", desc: "Embedded team for iteration, growth, and scaling. Dedicated capacity, senior only." },
];

const faqs = [
  { q: "How long does a typical project take?", a: "Sprints ship in 2–4 weeks. Full product engagements run 4–12 weeks depending on scope. We share a milestone plan before kickoff." },
  { q: "What does an engagement cost?", a: "Sprints start at $6k. Full builds typically range $15k–$60k. Retainers are monthly. We scope pricing after a discovery call." },
  { q: "Do you work with early-stage startups?", a: "Yes, a good portion of our work is with pre-seed to Series A teams. We help sharpen scope so you spend the least amount to prove the most." },
  { q: "Which stack do you build on?", a: "React / Next / TanStack, TypeScript, Postgres, edge runtimes, and modern AI infrastructure (OpenAI, Anthropic, vector DBs). Framer & Webflow for marketing sites." },
  { q: "Do we own the code and IP?", a: "Yes. All source code, designs, and IP transfer to you at project close. We keep no rights beyond a portfolio credit unless you prefer otherwise." },
  { q: "How do we get started?", a: "Book a 30-minute call. We'll align on the problem, scope, and next steps. If there's a fit, we send a proposal within 72 hours." },
];

function HowWeWork() {
  return (
    <section id="how" className="py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Engagements</div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Three ways to engage, all senior, all shipping.</h2>
          <p className="mt-4 text-muted-foreground">Pick the shape that matches your stage. Every engagement is principal-led with weekly demos and a shared board.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {engagements.map((e) => (
            <div key={e.title} className="rounded-2xl border border-border bg-card/40 p-8 hover:bg-card transition-colors">
              <e.icon className="h-5 w-5 text-primary" />
              <div className="mt-6 flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-medium">{e.title}</h3>
                <span className="text-xs text-muted-foreground font-mono">{e.meta}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-32 border-t border-border">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-14 max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">FAQ</div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Questions, answered.</h2>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="text-base md:text-lg font-medium group-hover:text-primary transition-colors">{f.q}</span>
                  <Plus className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-45 text-primary" : ""}`} />
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function _cta() {
  return (
    <section id="contact" className="py-32 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-80 pointer-events-none" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-gradient">Let's build something exceptional.</h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
          Have an idea or product? We help turn it into a scalable digital system.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary-glow transition-colors">
            Book a Call <ArrowRight className="h-4 w-4" />
          </a>
          <a href="mailto:contact@devowise.com" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-5 py-3 text-sm font-medium hover:bg-card transition-colors">
            contact@devowise.com
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-wrap items-center justify-between gap-6 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <img src={devowiseLogo} alt="Devowise" className="h-4 max-h-4 w-auto max-w-[96px] object-contain logo-animated" />
          <span>© {new Date().getFullYear()} Devowise. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href="#work" className="hover:text-foreground transition-colors">Work</a>
          <a href="#services" className="hover:text-foreground transition-colors">Services</a>
          <a href="#certifications" className="hover:text-foreground transition-colors">Certifications</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          <a href="/blog" className="hover:text-foreground transition-colors">Blog</a>
          <a
            href="https://contra.com/devowise"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            aria-label="Devowise on Contra"
          >
            <ArrowUpRight className="h-4 w-4" /> Contra
          </a>
          <a
            href="https://www.linkedin.com/company/devowise"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
            aria-label="Devowise on LinkedIn"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="ambient-bg" aria-hidden="true">
        <div className="aurora" />
        <div className="grid" />
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="noise" />
      </div>
      <Nav />
      <main className="relative z-10">
        <Hero />
        <SocialProof />
        <Services />
        <TechStack />
        <Certifications />
        <Work />
        <Process />
        <HowWeWork />
        <About />
        <FAQ />
        <SiteDirectory />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
