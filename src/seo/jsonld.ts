// JSON-LD helper utilities for structured data

declare global {
  interface Window {
    __jsonldTypes?: Set<string>;
  }
}

export function injectJSONLD(data: unknown) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);

  // Track injected types for verification
  if (typeof window !== 'undefined') {
    if (!window.__jsonldTypes) {
      window.__jsonldTypes = new Set();
    }
    
    if (typeof data === 'object' && data !== null && '@type' in data) {
      window.__jsonldTypes.add((data as any)['@type']);
    }
  }
}

// Organization JSON-LD
export function orgJSONLD(settings: {
  name: string;
  url: string;
  description?: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    email: string;
    areaServed?: string;
    availableLanguage?: string[];
  };
}) {
  const org: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.name,
    "url": settings.url,
  };

  if (settings.description) {
    org.description = settings.description;
  }

  if (settings.logo) {
    org.logo = settings.logo;
  }

  if (settings.sameAs && settings.sameAs.length > 0) {
    org.sameAs = settings.sameAs.filter(Boolean);
  }

  if (settings.contactPoint) {
    org.contactPoint = [{
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": settings.contactPoint.email,
      "areaServed": settings.contactPoint.areaServed || "Worldwide",
      "availableLanguage": settings.contactPoint.availableLanguage || ["en", "es"]
    }];
  }

  return org;
}

// Person JSON-LD (for founder)
export function personJSONLD(founder: {
  name: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  url?: string;
  sameAs?: string[];
}) {
  const person: any = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": founder.name,
  };

  if (founder.jobTitle) {
    person.jobTitle = founder.jobTitle;
  }

  if (founder.description) {
    person.description = founder.description;
  }

  if (founder.image) {
    person.image = founder.image;
  }

  if (founder.url) {
    person.url = founder.url;
  }

  if (founder.sameAs && founder.sameAs.length > 0) {
    person.sameAs = founder.sameAs.filter(Boolean);
  }

  return person;
}

// CollectionPage JSON-LD
export function collectionPageJSONLD(name: string, url: string, about?: string) {
  const collection: any = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "url": url,
  };

  if (about) {
    collection.about = about;
  }

  return collection;
}

// Article JSON-LD
export function articleJSONLD(post: {
  title: string;
  description?: string;
  url: string;
  author?: {
    name: string;
    url?: string;
  };
  datePublished?: string;
  dateModified?: string;
  image?: string;
  wordCount?: number;
}) {
  const article: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "url": post.url,
  };

  if (post.description) {
    article.description = post.description;
  }

  if (post.author) {
    article.author = {
      "@type": "Person",
      "name": post.author.name,
    };
    if (post.author.url) {
      article.author.url = post.author.url;
    }
  }

  if (post.datePublished) {
    article.datePublished = post.datePublished;
  }

  if (post.dateModified) {
    article.dateModified = post.dateModified;
  }

  if (post.image) {
    article.image = post.image;
  }

  if (post.wordCount) {
    article.wordCount = post.wordCount;
  }

  return article;
}

// VideoObject JSON-LD
export function videoJSONLD(video: {
  name: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  duration?: string;
  embedUrl?: string;
}) {
  const videoObj: any = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.name,
    "url": video.url,
  };

  if (video.description) {
    videoObj.description = video.description;
  }

  if (video.thumbnailUrl) {
    videoObj.thumbnailUrl = video.thumbnailUrl;
  }

  if (video.uploadDate) {
    videoObj.uploadDate = video.uploadDate;
  }

  if (video.duration) {
    videoObj.duration = video.duration;
  }

  if (video.embedUrl) {
    videoObj.embedUrl = video.embedUrl;
  }

  return videoObj;
}

// Course JSON-LD (for programs and experiences)
export function courseJSONLD(course: {
  name: string;
  description?: string;
  url: string;
  provider: {
    name: string;
    url: string;
  };
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
  courseMode?: string;
  educationalLevel?: string;
  timeRequired?: string;
}) {
  const courseObj: any = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "url": course.url,
    "provider": {
      "@type": "Organization",
      "name": course.provider.name,
      "url": course.provider.url,
    },
  };

  if (course.description) {
    courseObj.description = course.description;
  }

  if (course.offers) {
    courseObj.offers = {
      "@type": "Offer",
      ...course.offers,
    };
  }

  if (course.courseMode) {
    courseObj.courseMode = course.courseMode;
  }

  if (course.educationalLevel) {
    courseObj.educationalLevel = course.educationalLevel;
  }

  if (course.timeRequired) {
    courseObj.timeRequired = course.timeRequired;
  }

  return courseObj;
}

// Service JSON-LD (for B2B solutions)
export function serviceJSONLD(service: {
  name: string;
  description?: string;
  url: string;
  provider: {
    name: string;
    url: string;
  };
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
  serviceType?: string;
  areaServed?: string;
}) {
  const serviceObj: any = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "url": service.url,
    "provider": {
      "@type": "Organization",
      "name": service.provider.name,
      "url": service.provider.url,
    },
  };

  if (service.description) {
    serviceObj.description = service.description;
  }

  if (service.offers) {
    serviceObj.offers = {
      "@type": "Offer",
      ...service.offers,
    };
  }

  if (service.serviceType) {
    serviceObj.serviceType = service.serviceType;
  }

  if (service.areaServed) {
    serviceObj.areaServed = service.areaServed;
  }

  return serviceObj;
}

// Event JSON-LD (for future Luma API integration)
export function eventJSONLD(event: {
  name: string;
  description?: string;
  url: string;
  startDate: string;
  endDate?: string;
  location?: {
    name: string;
    address?: string;
    url?: string;
  };
  organizer: {
    name: string;
    url: string;
  };
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
}) {
  const eventObj: any = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "url": event.url,
    "startDate": event.startDate,
    "organizer": {
      "@type": "Organization",
      "name": event.organizer.name,
      "url": event.organizer.url,
    },
  };

  if (event.description) {
    eventObj.description = event.description;
  }

  if (event.endDate) {
    eventObj.endDate = event.endDate;
  }

  if (event.location) {
    eventObj.location = {
      "@type": "Place",
      "name": event.location.name,
    };
    if (event.location.address) {
      eventObj.location.address = event.location.address;
    }
    if (event.location.url) {
      eventObj.location.url = event.location.url;
    }
  }

  if (event.offers) {
    eventObj.offers = {
      "@type": "Offer",
      ...event.offers,
    };
  }

  return eventObj;
}
