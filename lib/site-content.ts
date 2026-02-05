export type HomePageReason = {
  title: string;
  description: string;
  icon: string;
};

export type HomePageOffer = {
  title: string;
  description: string;
  icon: string;
};

export type HomePageContent = {
  heroTitle: string;
  heroCtaText: string;

  aboutTitle: string;
  aboutBody: string;

  reasonsTitle: string;
  reasons: HomePageReason[];

  offersTitle: string;
  offers: HomePageOffer[];

  clientsTitle: string;
  contactTitle: string;
};

export const defaultHomePageContent: HomePageContent = {
  heroTitle: 'UNLOCKING THE POWER OF TALENT, WORLDWIDE.',
  heroCtaText: "Let's Get Hiring",

  aboutTitle: 'Who we are',
  aboutBody:
    "We are partners committed to your success, dedicated to finding the ideal match for your team. We understand the importance of time and the impact a wrong hire can have on your business. That's why we offer personalized recruitment services that prioritize efficiency and effectiveness. At MatchMakers we try to create the perfect synergy between your company and exceptional talent.",

  reasonsTitle: 'Main reasons to choose MatchMakers',
  reasons: [
    {
      title: 'Quality',
      description:
        'We understand the importance of time and the impact a wrong hire can have on your business.',
      icon: '✅'
    },
    {
      title: 'Personalization',
      description:
        'We offer personalized recruitment services that prioritize efficiency and effectiveness.',
      icon: '🧩'
    },
    {
      title: 'Experience',
      description:
        'Our team members brings over five years of experience in hiring top-tier professionals.',
      icon: '🏆'
    },
    {
      title: 'Transparency',
      description:
        'We are committed to transparency at every stage, providing full visibility into our processes.',
      icon: '🔎'
    }
  ],

  offersTitle: 'What we can offer',
  offers: [
    {
      title: 'Executive search',
      description:
        'Executive search and sourcing of top talent for your company, startup, or new projects.',
      icon: '🎯'
    },
    {
      title: 'Team building',
      description:
        "Building high-impact teams where employees truly complement each other and work towards your company's goals.",
      icon: '🤝'
    },
    {
      title: 'End-to-end guidance',
      description:
        'Guiding you through every step of the recruitment process with care, making it seamless, transparent, and effective.',
      icon: '🧭'
    }
  ],

  clientsTitle: 'Our Clients',
  contactTitle: "Let's Get Hiring"
};

export function isHomePageContent(value: unknown): value is HomePageContent {
  if (!value || typeof value !== 'object') return false;
  const v = value as any;

  const isNonEmptyString = (x: unknown) => typeof x === 'string' && x.trim().length > 0;
  const isString = (x: unknown) => typeof x === 'string';

  const isReason = (x: any) =>
    x && typeof x === 'object' && isNonEmptyString(x.title) && isNonEmptyString(x.description) && isString(x.icon);

  const isOffer = (x: any) =>
    x && typeof x === 'object' && isNonEmptyString(x.title) && isNonEmptyString(x.description) && isString(x.icon);

  return (
    isNonEmptyString(v.heroTitle) &&
    isNonEmptyString(v.heroCtaText) &&
    isNonEmptyString(v.aboutTitle) &&
    isNonEmptyString(v.aboutBody) &&
    isNonEmptyString(v.reasonsTitle) &&
    Array.isArray(v.reasons) &&
    v.reasons.every(isReason) &&
    isNonEmptyString(v.offersTitle) &&
    Array.isArray(v.offers) &&
    v.offers.every(isOffer) &&
    isNonEmptyString(v.clientsTitle) &&
    isNonEmptyString(v.contactTitle)
  );
}
