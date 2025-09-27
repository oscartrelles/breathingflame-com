// Content types for static content generation

export interface ContentData {
  home: any;
  programs: any[];
  experiences: any[];
  solutions: any[];
  posts: any[];
  testimonials: any[];
  settings: any;
  navigation: any;
  pageIndividuals: any;
  pageOrganizations: any;
  pagePrograms: any;
  pageEvents: any;
  pageResources: any;
  pageTestimonials: any;
  pageContact: any;
  pageCommunity: any;
  pagePress: any;
  about: any;
  lastUpdated: string;
}

export interface ContentHookResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export type Locale = 'en' | 'es' | 'fr' | 'de'; // Add more as needed

export interface ContentConfig {
  defaultLocale: Locale;
  supportedLocales: Locale[];
  fallbackLocale: Locale;
}
