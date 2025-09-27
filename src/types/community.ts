export interface PageCommunity {
  hero: {
    headline: string;
    subtext: string;
  };
  intro?: {
    title: string;
    body: string;
  };
  sections: {
    title: string;
    description?: string;
    cards: {
      label: string;
      sublabel?: string;
      url: string;
      external?: boolean;
      icon?: string;
      badge?: string;
      order?: number;
    }[];
    order?: number;
  }[];
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
}
