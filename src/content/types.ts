export type FAQ = { q: string; a: string };
export type ProcessStep = { step: string; title: string; desc: string };
export type Benefit = { title: string; desc: string };

export type ContentPage = {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heroTitle: string;
  heroSub: string;
  overview: string[];
  benefits: Benefit[];
  process: ProcessStep[];
  features: string[];
  industries?: string[];
  faqs: FAQ[];
  related?: {
    services?: string[];
    platforms?: string[];
    industries?: string[];
    solutions?: string[];
    resources?: string[];
  };
  ctaTitle?: string;
  ctaSub?: string;
};

export type Section = "services" | "platforms" | "industries" | "solutions" | "resources";

export const SECTION_LABEL: Record<Section, string> = {
  services: "Services",
  platforms: "Platforms",
  industries: "Industries",
  solutions: "Solutions",
  resources: "Resources",
};

export const SECTION_PATH: Record<Section, string> = {
  services: "/services",
  platforms: "/platforms",
  industries: "/industries",
  solutions: "/solutions",
  resources: "/resources",
};