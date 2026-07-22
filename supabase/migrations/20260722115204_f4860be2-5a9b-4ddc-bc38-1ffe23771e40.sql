
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  cover_image TEXT,
  external_url TEXT,
  overview TEXT,
  challenge TEXT,
  solution TEXT,
  process TEXT,
  tools TEXT[] NOT NULL DEFAULT '{}',
  results TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX blog_posts_published_sort_idx ON public.blog_posts (published, sort_order, created_at DESC);

GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
  ON public.blog_posts FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.blog_posts (slug, title, summary, cover_image, external_url, overview, challenge, solution, process, tools, results, tags, sort_order) VALUES
('mindmesh-ai-travel-blog',
 'MindMesh: An AI-Enhanced Travel & Lifestyle Blog',
 'An editorial-grade travel and lifestyle platform powered by AI for smarter discovery and personalization.',
 'https://media.contra.com/image/upload/q_auto,w_1600/x5xlzdf4aw0pvv6x6jm2.avif',
 'https://contra.com/p/bgLrobWF-mind-mesh-ai-enhanced-travel-and-lifestyle-blog',
 'MindMesh is an AI-enhanced travel and lifestyle publication where every article, itinerary, and recommendation adapts to the reader. We built a modern editorial platform that blends long-form storytelling with AI-powered discovery.',
 'Legacy travel blogs are static, hard to navigate, and slow to personalize. MindMesh needed an editorial platform that felt magazine-grade while surfacing the right content to every visitor without manual curation.',
 'We designed a clean, typography-first reading experience with AI recommendations, semantic search, and dynamic collections. Content is structured so the editorial team ships fast while machines understand every article.',
 'Discovery workshops, information architecture, design system, editorial CMS mapping, AI recommendation layer, staged rollout.',
 ARRAY['Next.js','TypeScript','OpenAI','Vercel','Tailwind CSS','Sanity'],
 'A polished, high-performance publication with strong Core Web Vitals, sticky sessions, and a scalable AI recommendation layer.',
 ARRAY['AI','Web','Editorial'], 10),

('jobfit-ai-recruitment',
 'JobFit AI: AI-Powered Recruitment Platform',
 'A recruitment platform that matches talent to roles at scale using LLM-based signals.',
 'https://media.contra.com/image/upload/q_auto,w_1600/fhk5off99wsy4rtg6vms.avif',
 'https://contra.com/p/gqYRLqO3-job-fit-ai-ai-powered-recruitment-platform',
 'JobFit AI is a modern hiring platform that scores candidate-role fit using LLMs, structured resume parsing, and behavioural signals, replacing keyword-only ATS matching.',
 'Traditional ATS tools rank on keywords, missing high-quality candidates. Recruiters needed a faster shortlist with explainable fit reasoning.',
 'We built a candidate ingest pipeline, an evaluation service using LLMs with grounded prompts, and a recruiter workspace with side-by-side comparison, notes, and pipeline stages.',
 'Product discovery with recruiters, data modelling, LLM eval loop, UI prototyping, private beta, iterative refinement.',
 ARRAY['Next.js','Node.js','PostgreSQL','OpenAI','LangChain','shadcn/ui'],
 'Recruiters reported 3x faster shortlisting with clearer justification for each candidate.',
 ARRAY['AI','SaaS','Hiring'], 20),

('batchq-ai-data-pipeline',
 'BatchQ: Real-time AI Data Pipeline Automation',
 'Real-time AI data pipelines that let engineering teams orchestrate, monitor, and scale jobs.',
 'https://media.contra.com/image/upload/q_auto,w_1600/pdzoosftnkoukdxpv2vw.avif',
 'https://contra.com/p/MP2EZF7q-batch-q-real-time-ai-data-pipeline-automation',
 'BatchQ gives modern data teams a control plane for AI and ETL jobs, with real-time monitoring, retries, and cost visibility across environments.',
 'Data teams juggled scripts, cron jobs, and orchestrators with no unified visibility, causing missed SLAs and silent failures.',
 'We shipped a workflow builder, a streaming events layer, and a cost dashboard so teams can compose, observe, and optimize AI pipelines from one place.',
 'Interviews with data engineers, event schema design, product design sprints, MVP, private pilot.',
 ARRAY['React','TypeScript','Python','Kafka','ClickHouse','Kubernetes'],
 'Pilot teams cut pipeline debugging time by more than half and unified observability across three environments.',
 ARRAY['AI','Data','DevTools'], 30),

('prismpay-payments-interface',
 'PrismPay: A Seamless Payment Interface',
 'A next-generation payment interface designed for clarity, trust, and speed.',
 'https://media.contra.com/image/upload/q_auto,w_1600/dlrvk0otsfjri9rl4dge.avif',
 'https://contra.com/p/UlvsYXe3-prism-pay-designing-a-seamless-payment-interface',
 'PrismPay is a fintech product where the payment interface itself is the product. We designed an end-to-end flow that reduces friction, builds trust, and holds up across geographies and devices.',
 'The client had a functional but confusing checkout with a high drop-off rate on mobile. Regulatory copy, multiple payment methods, and 3DS steps made the flow feel heavy.',
 'We redesigned the flow with progressive disclosure, motion-guided steps, and a component system built for localization. Every state, error, retry, success, was designed intentionally.',
 'UX audit, user testing, prototyping, motion system, design system tokens, engineering handoff.',
 ARRAY['Figma','Framer','React','Stripe','shadcn/ui'],
 'Prototype testing showed a measurable lift in checkout completion and improved trust scores.',
 ARRAY['Fintech','Product','Design'], 40),

('clay-real-estate',
 'Clay: Modern Real Estate Website Development',
 'A refined real estate website with a design system built to scale.',
 'https://media.contra.com/image/upload/q_auto,w_1600/jlp1znzefqnqliegbqp6.avif',
 'https://contra.com/p/UkbUqLqP-clay-modern-real-estate-website-development',
 'Clay is a boutique real estate brand that needed a digital presence matching the polish of their portfolio. We built a fast, editorial site with tools for showcasing listings and stories.',
 'Their previous site was a slow template that did not match the brand and made adding new properties painful.',
 'We designed a bespoke visual system, built a headless CMS-driven site, and created reusable modules for listings, neighborhoods, and stories.',
 'Brand alignment, IA, design system, CMS setup, engineering, launch.',
 ARRAY['Next.js','Tailwind CSS','Sanity','Vercel'],
 'A sharper brand, quicker publishing workflow for the team, and a strong mobile experience.',
 ARRAY['Web','Real Estate','Design'], 50),

('velto-fashion-ecommerce',
 'VELTO: Fashion E-commerce Landing',
 'A premium landing page built to convert luxury fashion shoppers.',
 'https://media.contra.com/image/upload/q_auto,w_1600/mzrsbth59bt0gxajcgpz.avif',
 'https://contra.com/p/BREErcUb-velto-fashion-e-commerce-landing-page-design',
 'VELTO wanted a landing page that felt like a magazine cover but converted like a product page. We designed and built a premium editorial commerce experience.',
 'Standard e-commerce templates felt generic and did not match the brand''s premium positioning; conversion suffered.',
 'We crafted a bespoke visual identity for the landing, layered motion, and shipped a fast, mobile-first build with careful attention to typography and product storytelling.',
 'Moodboards, direction, prototyping, build, performance tuning.',
 ARRAY['Framer','Figma','Motion'],
 'A landing that lifted engagement time and improved add-to-cart intent on early traffic.',
 ARRAY['E-commerce','Web','Fashion'], 60),

('archon-website',
 'Archon: Website Development for a B2B Brand',
 'A category-defining B2B site with a modern engineering foundation.',
 'https://media.contra.com/image/upload/q_auto,w_1600/znlna13le5kwwwiinkz2.avif',
 'https://contra.com/p/7W3lbNXW-archon-website-development',
 'Archon is a B2B company positioning itself as category-defining. Their website had to communicate leadership, scale, and technical credibility from the first scroll.',
 'They had strong content but a dated site that undercut the message. They needed a modern foundation without a full rebrand.',
 'We rebuilt the site on a modern stack with a bespoke component system, richer motion, and structured content so the team can ship pages without dev help.',
 'Content audit, IA, component system, build, CMS wiring, launch.',
 ARRAY['Next.js','TypeScript','Tailwind CSS','Framer Motion'],
 'A faster site, a higher-signal message, and a system the marketing team ships from weekly.',
 ARRAY['Web','B2B','Framer'], 70),

('goplay-sports-booking',
 'GoPlay: Outdoor Sports Booking App',
 'A mobile-first outdoor sports booking product designed for daily use.',
 'https://media.contra.com/image/upload/q_auto,w_1600/mqv7xfz9jzeln20n2jnm.avif',
 'https://contra.com/p/P7boRPNb-outdoor-sports-booking-application-go-play',
 'GoPlay is a booking product for outdoor sports facilities. We designed a mobile-first experience that turns finding, booking, and joining games into a single flow.',
 'Users had to bounce between social groups, chats, and phone calls to book a court and get a game together.',
 'We designed unified discovery, booking, and social pieces around a fast mobile core with real-time availability and friendly onboarding.',
 'User interviews, journey mapping, mobile design system, prototyping, iterative build.',
 ARRAY['React Native','Expo','Node.js','PostgreSQL'],
 'A mobile app that consolidates the entire flow with strong retention on active courts.',
 ARRAY['Mobile','Product','Sports'], 80),

('noireve-luxury-beauty',
 'NOIREVE: French Luxury Beauty & Skincare',
 'A brand experience for a French luxury beauty and skincare house.',
 'https://media.contra.com/image/upload/q_auto,w_1600/lfzbmz09gzhnj32ru1wx.avif',
 'https://contra.com/p/mPlEX3Br-noireve-french-luxury-beauty-and-skincare',
 'NOIREVE is a French luxury beauty and skincare brand. We shaped a digital experience that carries the weight and quiet confidence of the brand.',
 'Luxury beauty online lives or dies on craft. The brand needed a site that felt tactile, editorial, and unmistakably French, without slowing anything down.',
 'We built a bespoke component system with editorial motion, considered typography, and a modular structure for launches and stories.',
 'Direction, art direction, design system, engineering, CMS, launch.',
 ARRAY['Framer','Figma','Motion'],
 'An experience that reinforced the premium positioning and improved key engagement metrics at launch.',
 ARRAY['Brand','E-commerce','Beauty'], 90);
