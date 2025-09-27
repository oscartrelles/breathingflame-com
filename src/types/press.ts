export interface PagePress {
  hero: {
    headline: string;
    subtext: string;
  };
  intro?: {
    title: string;
    body: string;
  };
  mentions: {
    outlet: string;
    title: string;
    url: string;
    date?: string;
    excerpt?: string;
    image?: string;
  }[];
  pressKit: {
    headline: string;
    description?: string;
    assets: {
      label: string;
      url: string;
      type?: string;
    }[];
  };
  contact: {
    headline: string;
    subtext?: string;
    email: string;
    phone?: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
}
