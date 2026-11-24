/** Typed site copy. Each language implements this shape (see en.ts / ur.ts). */

export const CATEGORY_SLUGS = [
  'plumber',
  'electrician',
  'carpenter',
  'painter',
  'ac-technician',
  'cleaner',
  'mason',
  'labourer',
] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export interface LinkItem {
  label: string;
  to: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface QA {
  q: string;
  a: string;
}

export interface SectionIntro {
  eyebrow: string;
  title: string;
  description: string;
}

export interface CategoryContent {
  name: string;
  short: string;
  description: string;
  includes: string[];
}

export interface CommonContent {
  skipToContent: string;
  learnMore: string;
  viewAll: string;
  getStarted: string;
  bookService: string;
  joinAsWorker: string;
  perVisit: string;
  sampleNotice: string;
}

export interface NavContent {
  services: string;
  servicesMenuTitle: string;
  servicesMenuDescription: string;
  servicesMenuCta: string;
  servicesMenuPromoTitle: string;
  servicesMenuPromoBody: string;
  links: LinkItem[];
  login: string;
  signup: string;
  openMenu: string;
  closeMenu: string;
  switchLanguage: string;
}

export interface FooterContent {
  ctaEyebrow: string;
  ctaTitle: string;
  ctaBody: string;
  blurb: string;
  columns: { title: string; links: LinkItem[] }[];
  contactTitle: string;
  hoursLabel: string;
  followUs: string;
  rights: string;
  madeIn: string;
  legal: LinkItem[];
}

export interface HomeContent {
  hero: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
    serviceLabel: string;
    servicePlaceholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    searchCta: string;
    popular: string;
    citiesLabel: string;
  };
  mockup: {
    workerName: string;
    workerRole: string;
    jobs: string;
    verified: string;
    tevta: string;
    hire: string;
    bookingTitle: string;
    bookingBody: string;
    earningsTitle: string;
    earningsBody: string;
  };
  stats: { value: string; label: string }[];
  categories: SectionIntro;
  howItWorks: SectionIntro & {
    tabs: {
      customers: { label: string; steps: Step[] };
      workers: { label: string; steps: Step[] };
    };
  };
  features: SectionIntro & { items: Step[] };
  workers: SectionIntro & { bullets: Step[] };
  tevta: SectionIntro & { points: string[]; badgeTitle: string; badgeBody: string };
  testimonials: SectionIntro & {
    items: { quote: string; name: string; role: string; city: string }[];
  };
  faq: SectionIntro & { items: QA[] };
}

export interface CalculatorContent {
  title: string;
  description: string;
  amountLabel: string;
  jobAmount: string;
  platformFee: string;
  youEarn: string;
  note: string;
}

export interface PageHeroContent {
  eyebrow: string;
  title: string;
  description: string;
}

export interface ServicesPageContent {
  hero: PageHeroContent;
  includesTitle: string;
  bookCta: string;
  guarantee: SectionIntro & { items: Step[] };
}

export interface WorkersPageContent {
  hero: PageHeroContent;
  benefits: SectionIntro & { items: Step[] };
  bonus: SectionIntro & {
    tiers: { name: string; requirement: string; reward: string }[];
    note: string;
  };
  fund: SectionIntro & { points: string[] };
  requirements: SectionIntro & { items: string[] };
  steps: SectionIntro & { items: Step[] };
}

export interface TevtaPageContent {
  hero: PageHeroContent;
  about: SectionIntro & { paragraphs: string[] };
  forWorkers: { title: string; items: string[] };
  forCustomers: { title: string; items: string[] };
  steps: SectionIntro & { items: Step[] };
}

export interface AboutPageContent {
  hero: PageHeroContent;
  story: SectionIntro & { paragraphs: string[] };
  mission: { title: string; body: string };
  vision: { title: string; body: string };
  values: SectionIntro & { items: Step[] };
  commitments: SectionIntro & { items: { value: string; label: string }[] };
}

export interface FaqPageContent {
  hero: PageHeroContent;
  groups: { title: string; items: QA[] }[];
  stillQuestions: { title: string; body: string; cta: string };
}

export interface ContactPageContent {
  hero: PageHeroContent;
  form: {
    title: string;
    description: string;
    name: string;
    email: string;
    phone: string;
    phoneHint: string;
    topic: string;
    topics: string[];
    message: string;
    submit: string;
    submitHint: string;
    success: string;
    errors: { name: string; email: string; phone: string; message: string };
  };
  channels: {
    title: string;
    email: string;
    phone: string;
    whatsapp: string;
    hours: string;
    office: string;
  };
}

export interface LegalPageContent {
  hero: PageHeroContent;
  updated: string;
  draftNotice: string;
  sections: { title: string; body: string[] }[];
}

export interface AuthPlaceholderContent {
  loginTitle: string;
  signupTitle: string;
  body: string;
  customer: { title: string; body: string };
  worker: { title: string; body: string };
  back: string;
}

export interface SiteContent {
  common: CommonContent;
  nav: NavContent;
  footer: FooterContent;
  categories: Record<CategorySlug, CategoryContent>;
  home: HomeContent;
  calculator: CalculatorContent;
  services: ServicesPageContent;
  workers: WorkersPageContent;
  tevta: TevtaPageContent;
  about: AboutPageContent;
  faq: FaqPageContent;
  contact: ContactPageContent;
  privacy: LegalPageContent;
  terms: LegalPageContent;
  auth: AuthPlaceholderContent;
}
