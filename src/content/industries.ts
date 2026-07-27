import type { ContentPage } from "./types";

const mk = (
  slug: string,
  name: string,
  hero: string,
  overview: string[],
  challenges: string[],
  services: string[],
  faqs: { q: string; a: string }[],
): ContentPage => ({
  slug,
  h1: `${name} — Web Design & Development`,
  metaTitle: `${name} Web Design, Branding & Product Development | Devowise`,
  metaDescription: `Devowise designs and builds websites, brands, and digital products for ${name.toLowerCase()} companies. ${hero}`,
  eyebrow: name,
  heroTitle: hero,
  heroSub: `A specialist team that understands the specifics of building for ${name.toLowerCase()}.`,
  overview,
  benefits: challenges.map((c) => ({ title: c.split(":")[0], desc: c.split(":")[1]?.trim() ?? c })),
  process: [
    { step: "01", title: "Discover", desc: "Audience, positioning, and business goals mapped." },
    { step: "02", title: "Design", desc: "Bespoke UI grounded in industry norms and edge cases." },
    { step: "03", title: "Build", desc: "Fast, accessible, integrated with the tools you already use." },
    { step: "04", title: "Grow", desc: "SEO, CRO, and iteration retainer for compounding results." },
  ],
  features: services,
  faqs,
  related: {
    services: ["website-design", "website-development", "seo-services"],
  },
});

export const industries: ContentPage[] = [
  mk(
    "saas",
    "SaaS",
    "Marketing sites, product UX, and design systems for SaaS teams that treat design as leverage.",
    [
      "We build for SaaS the way we build products: componentized, measurable, and engineered for the funnel. From homepage to onboarding, every surface is designed to activate.",
      "Whether you're pre-PMF or scaling past Series B, we plug in as a senior design and engineering partner your team can compound on.",
    ],
    [
      "Positioning: Sharpened messaging that closes deals faster",
      "Onboarding: Activation-focused UX that moves trials to paid",
      "Design system: Reusable components for marketing and product",
      "Integrations: CRM, billing, and analytics wired for growth",
    ],
    ["SaaS marketing sites", "Product UX & UI", "Design systems", "Onboarding & activation flows", "Pricing pages that convert", "Feature launch pages"],
    [
      { q: "Do you work with pre-seed teams?", a: "Yes, sprints for MVP design and marketing site are our normal starting point." },
      { q: "Can you extend our existing design system?", a: "Yes, audit, refactor, and extend." },
      { q: "Do you handle in-app UI too?", a: "Yes, product UX and UI is a core capability." },
    ],
  ),
  mk(
    "ai-startups",
    "AI Startups",
    "Websites, product UX, and AI systems for teams building the next category of AI-native products.",
    [
      "AI moves fast, and your surfaces need to keep up. We design and build websites, product UX, and AI systems for teams shipping in weeks, not quarters.",
      "We speak LLM, RAG, evals, and agents fluently, so the site sells the product accurately and the product ships correctly.",
    ],
    [
      "Category creation: Messaging that explains a new AI product to skeptical buyers",
      "Model UX: Chat, agent, and prompt-driven interfaces done well",
      "Trust: Enterprise-friendly UX around security, logs, and controls",
      "Speed: Design and build cycles that match your model shipping cadence",
    ],
    ["AI product UX", "Marketing sites for AI companies", "Agent and chat UI", "Enterprise trust pages", "Docs and playgrounds", "AI systems engineering"],
    [
      { q: "Do you actually build AI products?", a: "Yes, we ship AI systems with RAG, agents, and evals in production, not demos." },
      { q: "Can you help with docs and playgrounds?", a: "Yes, both design and technical implementation." },
      { q: "Do you know enterprise buyer patterns?", a: "Yes, SOC2 messaging, admin controls, and audit UX are common asks." },
    ],
  ),
  mk(
    "healthcare",
    "Healthcare",
    "HIPAA-aware websites and product UX for healthcare, telehealth, and health-tech companies.",
    [
      "Healthcare has non-negotiable constraints: compliance, accessibility, and trust. We design and build with those baked in, not bolted on.",
      "From provider directories to patient portals, we ship experiences that pass legal review and still feel modern.",
    ],
    [
      "Compliance: HIPAA-aware content, forms, and data flows",
      "Accessibility: WCAG 2.2 AA baseline across every surface",
      "Trust: Clear credentials, privacy, and outcomes messaging",
      "Conversion: Booking, intake, and eligibility flows tuned for completion",
    ],
    ["Provider and clinic websites", "Telehealth product UX", "Patient portals", "Intake and eligibility forms", "Accessibility audits (WCAG 2.2)", "Content and CMS for medical teams"],
    [
      { q: "Do you handle HIPAA-compliant infrastructure?", a: "We design forms and flows to be HIPAA-aware and integrate with your compliant backend." },
      { q: "Can you handle multi-location clinics?", a: "Yes, location templates and provider directories are common asks." },
      { q: "Accessibility certification?", a: "We build to WCAG 2.2 AA and can pair with a formal accessibility auditor." },
    ],
  ),
  mk(
    "real-estate",
    "Real Estate",
    "Websites, listing portals, and lead flows for real estate developers, brokerages, and prop-tech companies.",
    [
      "Real estate lives on trust and imagery. We design sites that showcase properties, developments, or platforms with editorial-grade polish and back it with lead-capture that actually converts.",
      "From single-project microsites to multi-listing platforms, we cover design, CMS, and integrations with your CRM.",
    ],
    [
      "Presentation: Editorial imagery, layouts, and motion that sell high-ticket real estate",
      "Search & filter: Fast, structured browsing for large inventories",
      "Leads: Multi-step flows that qualify and route intelligently",
      "CRM: Direct integration with Salesforce, HubSpot, or bespoke systems",
    ],
    ["Developer & project microsites", "Brokerage websites", "Listing search UX", "Lead capture and CRM integration", "Prop-tech product design", "3D and virtual tour integration"],
    [
      { q: "Do you handle MLS integrations?", a: "Yes, via IDX or direct feeds depending on region." },
      { q: "Can you support multiple languages?", a: "Yes, native i18n and Weglot both supported." },
      { q: "Do you build for developers vs brokers?", a: "Both, they have very different UX needs and we scope accordingly." },
    ],
  ),
  mk(
    "restaurants",
    "Restaurants",
    "Websites, ordering, and reservations for restaurants, groups, and hospitality brands.",
    [
      "Restaurant sites need to sell the experience in three seconds. We design bold, editorial sites that do exactly that, then wire in the boring-but-critical stuff: menus, reservations, and delivery.",
    ],
    [
      "Brand-first: Sites that make people want to eat there",
      "Menu ops: CMS your team can update daily",
      "Reservations: Direct integration with OpenTable, Resy, or SevenRooms",
      "Delivery: Toast, Square, ChowNow integrated cleanly",
    ],
    ["Restaurant websites & branding", "Menu CMS", "Reservations integration", "Online ordering", "Multi-location templates", "SEO for local search"],
    [
      { q: "Can you support multi-location groups?", a: "Yes, one CMS, location templates, and local SEO structure." },
      { q: "Do you handle photography?", a: "We art-direct, and can bring a food photographer if needed." },
      { q: "Which reservation systems?", a: "OpenTable, Resy, SevenRooms, Tock, and Google Reserve." },
    ],
  ),
  mk(
    "law-firms",
    "Law Firms",
    "Websites and lead systems for law firms, practices, and legal-tech companies that expect a credible, modern presence.",
    [
      "Legal is a trust industry. We design sites that read as credible in the first second: careful typography, real case results, and clean IA that helps prospects self-qualify.",
    ],
    [
      "Credibility: Editorial design that reads authoritative",
      "Self-qualification: IA that helps prospects find the right practice area",
      "Intake: Forms that capture the right info without scaring off leads",
      "Compliance: State-bar-friendly content and disclaimers",
    ],
    ["Law firm websites", "Practice area architecture", "Attorney profiles", "Intake and consultation flows", "Blog and legal insights CMS", "Local SEO for law firms"],
    [
      { q: "Can you handle multi-office firms?", a: "Yes, location and jurisdiction templates included." },
      { q: "Do you support state-bar compliance?", a: "We design with disclaimers and content patterns in mind; your compliance lead signs off on copy." },
      { q: "Do you write legal content?", a: "We brief structure, your attorneys or a specialist writer author." },
    ],
  ),
  mk(
    "finance",
    "Finance",
    "Websites, product UX, and design systems for fintech, wealth management, and financial services.",
    [
      "Finance sites and products live and die on trust. We design surfaces that feel credible, disclose transparently, and convert without dark patterns.",
      "From fintech product UX to advisor websites, we know the regulatory and reputational stakes.",
    ],
    [
      "Trust: Layouts and content that read as safe and precise",
      "Compliance: Disclosures, footnotes, and content patterns done right",
      "Data UX: Charts, dashboards, and complex flows made legible",
      "Onboarding: KYC and account flows tuned for completion",
    ],
    ["Fintech product UX", "Advisor and RIA websites", "Onboarding & KYC flows", "Dashboard and reporting UI", "Compliance content patterns", "Design systems for finance"],
    [
      { q: "Do you work with regulated fintech?", a: "Yes, and we work with your compliance team on messaging and disclosures." },
      { q: "Can you handle complex data UX?", a: "Yes, charts, tables, and reporting UI are a strength." },
      { q: "SOC2 or similar?", a: "We design to fit your audit posture; your infra team owns cert itself." },
    ],
  ),
  mk(
    "ecommerce",
    "E-commerce",
    "Storefronts, PDPs, and CRO programs for premium DTC and B2B commerce brands.",
    [
      "E-commerce is a compounding funnel: 100 small decisions across PLP, PDP, cart, and checkout that add up to margin. We design and build for that math.",
      "Shopify, Hydrogen, Webflow Ecommerce, or bespoke, we pick the stack that fits your catalog, checkout, and international needs.",
    ],
    [
      "Conversion: PDPs and cart designed against real funnel data",
      "Speed: LCP under 2s on mid-range mobile",
      "Merchandising: Section-based theming for campaigns",
      "Post-purchase: Email, subs, and upsell flows tuned for LTV",
    ],
    ["Custom Shopify themes", "Hydrogen headless storefronts", "PDP and cart optimization", "Subscription & bundles", "Klaviyo and email automations", "CRO retainers"],
    [
      { q: "Shopify or Webflow Ecommerce?", a: "Shopify for scale and checkout depth. Webflow for small catalogs with editorial storytelling." },
      { q: "Do you handle app dev?", a: "Yes, custom Shopify apps and headless components." },
      { q: "Migration from WooCommerce?", a: "Yes, full catalog, orders, redirects, SEO." },
    ],
  ),
  mk(
    "education",
    "Education",
    "Websites and platforms for schools, cohort courses, and edtech startups.",
    [
      "Education spans K-12, higher-ed, cohort, and edtech, each with different buyers and constraints. We design sites and platforms that serve learners, parents, faculty, and admissions all at once.",
    ],
    [
      "Multi-audience: IA that serves parents, students, and staff",
      "Enrollment: Application and inquiry flows tuned for completion",
      "Learning: LMS and cohort UX that keeps learners engaged",
      "Accessibility: WCAG 2.2 AA baseline for public institutions",
    ],
    ["School and university websites", "Edtech product UX", "Cohort course platforms (Kajabi, custom)", "LMS UX", "Enrollment and inquiry flows", "Accessibility audits"],
    [
      { q: "K-12 vs higher-ed vs cohort?", a: "All three, they have very different buyer journeys and we scope accordingly." },
      { q: "LMS integrations?", a: "Canvas, Moodle, Kajabi, Thinkific, and custom." },
      { q: "Accessibility?", a: "WCAG 2.2 AA is our default; can pair with a formal auditor." },
    ],
  ),
  mk(
    "travel",
    "Travel",
    "Websites, booking flows, and brand experiences for travel, hospitality, and tourism.",
    [
      "Travel sells experiences with imagery and trust. We design editorial sites and build booking flows that convert without feeling like an OTA.",
    ],
    [
      "Editorial: Imagery-forward design that sells the experience",
      "Booking: Multi-step flows tuned against real drop-off data",
      "Localization: Multi-language and multi-currency",
      "Content ops: CMS your team can update daily",
    ],
    ["Hotel and resort websites", "Tour operator platforms", "Booking flow UX", "Multi-language sites", "Loyalty program design", "Local SEO for destinations"],
    [
      { q: "Do you integrate with booking engines?", a: "Yes, Cloudbeds, SiteMinder, Mews, Rezdy, and custom." },
      { q: "Can you handle 5+ languages?", a: "Yes, native i18n or Weglot depending on stack." },
      { q: "Photography?", a: "We art-direct and can bring specialist photographers." },
    ],
  ),
  mk(
    "marketing-agencies",
    "Marketing Agencies",
    "White-label and partner-friendly design and development for marketing agencies who need senior technical capacity.",
    [
      "We partner with agencies as a senior technical arm. You keep the client relationship and creative ownership, we handle the design system, Framer/Webflow build, or product engineering.",
    ],
    [
      "White-label: Deliver under your brand or ours",
      "Senior only: No juniors, no offshore, no dropped balls",
      "Fast turnaround: Sprints for landing pages, weeks for full sites",
      "Retainer capacity: Predictable monthly hours for your book",
    ],
    ["White-label Framer & Webflow builds", "Design system engineering", "Landing page sprints", "Custom development for agencies", "Retainer capacity", "NDA-friendly engagements"],
    [
      { q: "Do you work under NDA?", a: "Standard practice for agency partnerships." },
      { q: "Retainer minimums?", a: "Yes, we allocate senior capacity monthly with 3-month minimum." },
      { q: "How do we start?", a: "One project first, retainer after we've proven fit." },
    ],
  ),
  mk(
    "construction",
    "Construction",
    "Websites and lead systems for construction, contractors, and building companies.",
    [
      "Construction sites need to communicate scale, safety, and craft. We design and build sites that look as serious as your projects and generate qualified leads.",
    ],
    [
      "Portfolio: Project galleries that showcase scale and craft",
      "Credibility: Certifications, insurance, and case studies front and center",
      "Leads: Quote-request flows tuned for qualified inquiries",
      "Local SEO: Service-area pages and Google Business integration",
    ],
    ["Contractor and construction websites", "Project portfolio CMS", "Quote-request forms", "Multi-service-area SEO", "Google Business optimization", "Photography direction"],
    [
      { q: "Do you handle multi-region service areas?", a: "Yes, service-area page architecture is a strength." },
      { q: "Can you integrate with a CRM?", a: "Yes, JobNimbus, ServiceTitan, HubSpot, or bespoke." },
      { q: "Photography and drone?", a: "We art-direct and can source specialists." },
    ],
  ),
  mk(
    "interior-design",
    "Interior Design",
    "Editorial websites and portfolios for interior designers, studios, and furniture brands.",
    [
      "Interior design is judged on the second image. We build editorial portfolios that let the work breathe and layer in the storytelling, press, and inquiries that turn browsers into clients.",
    ],
    [
      "Editorial: Layouts that let large imagery do the talking",
      "Case studies: Long-form project storytelling",
      "Press: Publications and awards surfaced elegantly",
      "Inquiries: Qualified project inquiry flows",
    ],
    ["Interior designer portfolios", "Studio and firm websites", "Project case studies", "E-commerce for furniture brands", "Press and awards features", "Client inquiry flows"],
    [
      { q: "Can you handle a huge image library?", a: "Yes, image pipelines and CDN delivery designed for it." },
      { q: "Do you offer photography direction?", a: "Yes, we art-direct or bring specialists." },
      { q: "Can you sell furniture too?", a: "Yes, Shopify or Webflow Ecommerce depending on catalog." },
    ],
  ),
  mk(
    "coaches-consultants",
    "Coaches & Consultants",
    "Websites, funnels, and Kajabi builds for coaches, consultants, and expert-led businesses.",
    [
      "Coaches and consultants sell trust and outcomes. We design sites and funnels that position you as the category authority and turn traffic into booked calls.",
    ],
    [
      "Positioning: Sharpened messaging around your unique method",
      "Funnels: Sales pages, lead magnets, and email flows",
      "Booking: Calendly, Acuity, and native booking done well",
      "Programs: Kajabi, custom portals, and community",
    ],
    ["Coaching and consulting websites", "Kajabi builds", "Sales funnels and landing pages", "Lead-magnet flows", "Podcast and content hubs", "Booking and payments"],
    [
      { q: "Kajabi or custom?", a: "Kajabi for course + community + email in one. Custom when you need bespoke flows." },
      { q: "Do you write copy?", a: "We collaborate with a specialist or work from your existing copy." },
      { q: "How fast can we launch?", a: "Landing pages in 1–2 weeks. Full sites in 4–6." },
    ],
  ),
];