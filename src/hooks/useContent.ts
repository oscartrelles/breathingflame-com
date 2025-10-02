import { useState, useEffect } from 'react';
import { ContentData, ContentHookResult, Locale } from '../types/content';

// Content cache
let contentCache: { [key in Locale]?: ContentData } = {};
let isLoading = false;

// Load content for a specific locale
async function loadContent(locale: Locale): Promise<ContentData> {
  if (contentCache[locale]) {
    return contentCache[locale]!;
  }

  if (isLoading) {
    // Wait for ongoing load
    return new Promise((resolve) => {
      const checkCache = () => {
        if (contentCache[locale]) {
          resolve(contentCache[locale]!);
        } else {
          setTimeout(checkCache, 50);
        }
      };
      checkCache();
    });
  }

  isLoading = true;
  
  try {
    const contentModule = await import(`../content/${locale}.json`);
    const content = contentModule.default as ContentData;
    contentCache[locale] = content;
    return content;
  } catch (error) {
    console.warn(`Failed to load content for locale ${locale}, falling back to en`);
    if (locale !== 'en') {
      return loadContent('en');
    }
    throw error;
  } finally {
    isLoading = false;
  }
}

// Main content hook
export function useContent(locale: Locale = 'en'): ContentHookResult<ContentData> {
  const [data, setData] = useState<ContentData | null>(contentCache[locale] || null);
  const [loading, setLoading] = useState(!contentCache[locale]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contentCache[locale]) {
      setData(contentCache[locale]!);
      setLoading(false);
      return;
    }

    loadContent(locale)
      .then((content) => {
        setData(content);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [locale]);

  return { data, loading, error };
}

// Individual content hooks for better performance
export function useHome(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.pages?.home || data?.home || null,
    loading,
    error
  };
}

export function usePrograms(locale: Locale = 'en'): ContentHookResult<any[]> {
  const { data, loading, error } = useContent(locale);
  // Check if programs is an array (collection) or object (page data)
  const programsData = Array.isArray(data?.programs) ? data?.programs : [];
  return {
    data: programsData,
    loading,
    error
  };
}

export function useExperiences(locale: Locale = 'en'): ContentHookResult<any[]> {
  const { data, loading, error } = useContent(locale);
  // Check if experiences is an array (collection) or object (page data)
  const experiencesData = Array.isArray(data?.experiences) ? data?.experiences : [];
  return {
    data: experiencesData,
    loading,
    error
  };
}

export function useSolutions(locale: Locale = 'en'): ContentHookResult<any[]> {
  const { data, loading, error } = useContent(locale);
  // Check if solutions is an array (collection) or object (page data)
  const solutionsData = Array.isArray(data?.solutions) ? data?.solutions : [];
  return {
    data: solutionsData,
    loading,
    error
  };
}

export function usePosts(locale: Locale = 'en'): ContentHookResult<any[]> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.posts || [],
    loading,
    error
  };
}

export function useTestimonials(locale: Locale = 'en'): ContentHookResult<any[]> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.testimonials || [],
    loading,
    error
  };
}

export function useSettings(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.settings || null,
    loading,
    error
  };
}

export function useNavigation(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.navigation || null,
    loading,
    error
  };
}

// Page-specific hooks
export function usePageIndividuals(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.pages?.individuals || data?.pageIndividuals || data?.individuals || null,
    loading,
    error
  };
}

export function usePageOrganizations(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.pages?.organizations || data?.pageOrganizations || data?.organizations || null,
    loading,
    error
  };
}

export function usePagePrograms(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.pages?.programs || data?.programs || data?.pagePrograms || data?.programsPage || null,
    loading,
    error
  };
}

export function usePageEvents(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.pages?.events || data?.pageEvents || data?.events || null,
    loading,
    error
  };
}

export function usePageResources(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.pages?.resources || data?.pageResources || data?.resources || null,
    loading,
    error
  };
}

export function usePageTestimonials(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.pages?.testimonials || data?.pageTestimonials || data?.testimonialsPage || null,
    loading,
    error
  };
}

export function usePageContact(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.pages?.contact || data?.pageContact || data?.contact || null,
    loading,
    error
  };
}

export function usePageCommunity(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  
  const communityData = data?.pages?.community || data?.pageCommunity || data?.community || null;
  
  return {
    data: communityData,
    loading,
    error
  };
}

export function usePagePress(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.pages?.press || data?.pagePress || data?.press || null,
    loading,
    error
  };
}

export function useAbout(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.pages?.about || data?.about || null,
    loading,
    error
  };
}

export function usePageSearch(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.pages?.search || data?.pageSearch || data?.search || null,
    loading,
    error
  };
}

export function usePageNotFound(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.pages?.notFound || data?.pageNotFound || data?.notFound || null,
    loading,
    error
  };
}

export function useResourceIgniteYourFlame(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.igniteYourFlame || null,
    loading,
    error
  };
}

export function useResourcePeakEnergyProfiler(locale: Locale = 'en'): ContentHookResult<any> {
  const { data, loading, error } = useContent(locale);
  return {
    data: data?.peakEnergyProfiler || null,
    loading,
    error
  };
}

// Utility hooks for specific data needs
export function useAllOfferings(locale: Locale = 'en'): ContentHookResult<any[]> {
  const { data: programs, loading: programsLoading, error: programsError } = usePrograms(locale);
  const { data: experiences, loading: experiencesLoading, error: experiencesError } = useExperiences(locale);
  const { data: solutions, loading: solutionsLoading, error: solutionsError } = useSolutions(locale);

  const [mergedData, setMergedData] = useState<any[]>([]);

  useEffect(() => {
    if (programs && experiences && solutions) {
      const merged = [
        ...programs.map((p: any) => ({ ...p, kind: 'program' })),
        ...experiences.map((e: any) => ({ ...e, kind: 'experience' })),
        ...solutions.map((s: any) => ({ ...s, kind: 'solution' }))
      ].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return a.title.localeCompare(b.title);
      });
      setMergedData(merged);
    }
  }, [programs, experiences, solutions]);

  return {
    data: mergedData,
    loading: programsLoading || experiencesLoading || solutionsLoading,
    error: programsError || experiencesError || solutionsError
  };
}

export function useAllOfferingsLite(locale: Locale = 'en'): ContentHookResult<any[]> {
  return useAllOfferings(locale);
}

export function useLatestPostsLite(locale: Locale = 'en'): ContentHookResult<any[]> {
  const { data, loading, error } = usePosts(locale);
  
  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const sorted = [...data]
        .sort((a, b) => new Date(b.publishedAt || b.createdAt || 0).getTime() - new Date(a.publishedAt || a.createdAt || 0).getTime())
        .slice(0, 3);
      setLatestPosts(sorted);
    }
  }, [data]);

  return {
    data: latestPosts,
    loading,
    error
  };
}

// Hook for getting a specific item by slug
export function useProgramBySlug(slug: string, locale: Locale = 'en'): ContentHookResult<any> {
  const { data: programs, loading, error } = usePrograms(locale);
  const [program, setProgram] = useState<any>(null);

  useEffect(() => {
    if (programs) {
      const found = programs.find((p: any) => p.slug === slug);
      setProgram(found || null);
    }
  }, [programs, slug]);

  return { data: program, loading, error };
}

export function useExperienceBySlug(slug: string, locale: Locale = 'en'): ContentHookResult<any> {
  const { data: experiences, loading, error } = useExperiences(locale);
  const [experience, setExperience] = useState<any>(null);

  useEffect(() => {
    if (experiences) {
      const found = experiences.find((e: any) => e.slug === slug);
      setExperience(found || null);
    }
  }, [experiences, slug]);

  return { data: experience, loading, error };
}

export function useSolutionBySlug(slug: string, locale: Locale = 'en'): ContentHookResult<any> {
  const { data: solutions, loading, error } = useSolutions(locale);
  const [solution, setSolution] = useState<any>(null);

  useEffect(() => {
    if (solutions) {
      const found = solutions.find((s: any) => s.slug === slug);
      setSolution(found || null);
    }
  }, [solutions, slug]);

  return { data: solution, loading, error };
}

export function usePostBySlug(slug: string, locale: Locale = 'en'): ContentHookResult<any> {
  const { data: posts, loading, error } = usePosts(locale);
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (posts) {
      const found = posts.find((p: any) => p.slug === slug);
      setPost(found || null);
    }
  }, [posts, slug]);

  return { data: post, loading, error };
}

