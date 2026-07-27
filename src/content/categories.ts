export type BlogCategory = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
};

export const blogCategories: BlogCategory[] = [
  { slug: "branding", name: "Branding", metaTitle: "Branding Articles & Case Studies | Devowise Blog", metaDescription: "Branding strategy, identity systems, and applied guidelines from real Devowise engagements.", intro: "Deep looks at how we build brands that hold up in product, marketing, and market." },
  { slug: "ui-ux", name: "UI/UX", metaTitle: "UI/UX Design Articles & Case Studies | Devowise Blog", metaDescription: "Product UX, interaction design, and design system articles from the Devowise team.", intro: "How we design interfaces that ship and survive contact with real users." },
  { slug: "web-design", name: "Web Design", metaTitle: "Web Design Articles & Case Studies | Devowise Blog", metaDescription: "Web design principles, layouts, motion, and case studies from Devowise projects.", intro: "The craft, decisions, and tradeoffs behind sites we've shipped." },
  { slug: "development", name: "Development", metaTitle: "Web Development Articles | Devowise Blog", metaDescription: "Modern web development notes across TanStack, Next.js, Framer, Webflow, and Shopify.", intro: "Engineering notes from a team that ships production sites and products." },
  { slug: "framer", name: "Framer", metaTitle: "Framer Articles & Case Studies | Devowise Blog", metaDescription: "Everything Framer: CMS, motion, code overrides, and case studies from a certified Framer team.", intro: "Real-world Framer builds, patterns, and tips from certified experts." },
  { slug: "webflow", name: "Webflow", metaTitle: "Webflow Articles & Case Studies | Devowise Blog", metaDescription: "Webflow CMS, custom code, localization, and case studies from the Devowise team.", intro: "Notes and case studies from shipping serious Webflow builds." },
  { slug: "shopify", name: "Shopify", metaTitle: "Shopify Articles & Case Studies | Devowise Blog", metaDescription: "Shopify themes, Hydrogen, and CRO articles from a Shopify Partner.", intro: "Storefront design, engineering, and conversion notes from live Shopify work." },
  { slug: "kajabi", name: "Kajabi", metaTitle: "Kajabi Articles & Case Studies | Devowise Blog", metaDescription: "Kajabi theme, funnel, and community engineering notes from certified Kajabi experts.", intro: "How to make Kajabi look and sell like a bespoke product." },
  { slug: "seo", name: "SEO", metaTitle: "SEO Articles & Playbooks | Devowise Blog", metaDescription: "SEO playbooks, technical audits, topical authority, and content strategy from a shipping team.", intro: "Search engineered as a system, not a checklist." },
  { slug: "cro", name: "CRO", metaTitle: "Conversion Optimization Articles | Devowise Blog", metaDescription: "CRO methodology, experiment design, and case studies from the Devowise team.", intro: "How we run experiments that actually move revenue." },
  { slug: "ai", name: "AI", metaTitle: "AI Product & Engineering Articles | Devowise Blog", metaDescription: "AI product design, engineering, and case studies for teams building AI-native products.", intro: "Design and engineering for AI-native products." },
  { slug: "startups", name: "Startups", metaTitle: "Startup Design & Product Articles | Devowise Blog", metaDescription: "How early-stage teams design, ship, and grow product without wasting a runway.", intro: "Product and design notes for pre-seed to Series A teams." },
  { slug: "marketing", name: "Marketing", metaTitle: "Marketing Site & Growth Articles | Devowise Blog", metaDescription: "Marketing site strategy, landing pages, and growth engineering articles.", intro: "How marketing sites and funnels actually move numbers." },
];

export const findCategory = (slug: string) => blogCategories.find((c) => c.slug === slug);