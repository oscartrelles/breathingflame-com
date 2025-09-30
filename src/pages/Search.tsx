import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ExternalLink, Calendar, Users, BookOpen, Briefcase } from 'lucide-react';
import { useAllOfferingsLite, useLatestPostsLite, usePageSearch, useNavigation } from '../hooks/useFirestore';
import { SEO } from '@/components/SEO';
import styles from './Search.module.css';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'route' | 'program' | 'experience' | 'solution' | 'post';
  external?: boolean;
}

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { data: pageData, loading, error } = usePageSearch();
  const { data: navigation } = useNavigation();
  
  const { offerings } = useAllOfferingsLite();
  const { posts } = useLatestPostsLite();
  
  // Debug: log what we're getting
  React.useEffect(() => {
    console.log('Search page data:', { pageData, loading, error });
  }, [pageData, loading, error]);

  // Known routes come from navigation data in en.json
  const knownRoutes = useMemo(() => {
    const headerLinks = navigation?.headerLinks || [];
    const footerGroups = navigation?.footerGroups || [];
    const baseRoutes = [
      { title: pageData?.routes?.home || 'Home', url: '/', description: pageData?.routes?.homeDesc || 'Main homepage' }
    ];
    const navRoutes = headerLinks.map((l: any) => ({ title: l.label, url: l.pathOrUrl, description: '' }));
    const footerRoutes = footerGroups.flatMap((g: any) => (g.links || []).filter((l: any) => !l.external).map((l: any) => ({ title: l.label, url: l.pathOrUrl, description: '' })));
    const combined = [...baseRoutes, ...navRoutes, ...footerRoutes];
    const deduped = Array.from(new Map(combined.map(r => [r.url, r])).values());
    return deduped;
  }, [navigation, pageData]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search routes
    knownRoutes.forEach(route => {
      if (route.title.toLowerCase().includes(searchTerm) || 
          route.description.toLowerCase().includes(searchTerm)) {
        results.push({
          id: `route-${route.url}`,
          title: route.title,
          description: route.description,
          url: route.url,
          type: 'route'
        });
      }
    });

    // Search offerings (programs, experiences, solutions)
    offerings.forEach(offering => {
      const titleMatch = offering.title.toLowerCase().includes(searchTerm);
      const tagMatch = offering.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
      const summaryMatch = offering.summary?.toLowerCase().includes(searchTerm);
      
      if (titleMatch || tagMatch || summaryMatch) {
        results.push({
          id: `${offering.kind}-${offering.slug}`,
          title: offering.title,
          description: offering.summary || offering.description || '',
          url: `/${offering.kind}s/${offering.slug}`,
          type: offering.kind as 'program' | 'experience' | 'solution'
        });
      }
    });

    // Search posts
    posts.forEach(post => {
      const titleMatch = post.title.toLowerCase().includes(searchTerm);
      const excerptMatch = post.excerpt?.toLowerCase().includes(searchTerm);
      const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
      
      if (titleMatch || excerptMatch || tagMatch) {
        results.push({
          id: `post-${post.slug}`,
          title: post.title,
          description: post.excerpt || '',
          url: `/resources/${post.slug}`,
          type: 'post'
        });
      }
    });

    return results.slice(0, 20); // Limit to 20 results
  }, [query, offerings, posts]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      // Track search event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'search_submit', {
          search_term: query,
          results_count: searchResults.length
        });
      }
    }
  }, [query, searchResults.length]);

  const handleResultClick = useCallback((result: SearchResult) => {
    // Track result click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search_result_click', {
        result_title: result.title,
        result_type: result.type,
        result_url: result.url
      });
    }

    if (result.external) {
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(result.url);
    }
  }, [navigate]);

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'route': return <SearchIcon className={styles.typeIcon} />;
      case 'program': return <BookOpen className={styles.typeIcon} />;
      case 'experience': return <Calendar className={styles.typeIcon} />;
      case 'solution': return <Briefcase className={styles.typeIcon} />;
      case 'post': return <BookOpen className={styles.typeIcon} />;
      default: return <SearchIcon className={styles.typeIcon} />;
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    if (!pageData?.typeLabels) {
      switch (type) {
        case 'route': return 'Page';
        case 'program': return 'Program';
        case 'experience': return 'Experience';
        case 'solution': return 'Solution';
        case 'post': return 'Article';
        default: return 'Result';
      }
    }
    return pageData.typeLabels[type] || pageData.typeLabels.default || 'Result';
  };

  return (
    <div className={styles.container}>
      <SEO data={{
        title: pageData?.seo?.title || 'Search - Breathing Flame',
        description: pageData?.seo?.description || 'Search for programs, experiences, articles, and resources'
      }} />
      
      <div className={styles.header}>
        <h1 className={styles.title}>{pageData?.hero?.headline || 'Search'}</h1>
        <p className={styles.subtitle}>{pageData?.hero?.subtext || 'Find programs, experiences, articles, and more'}</p>
      </div>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchInputWrapper}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={pageData?.searchPlaceholder || 'Search for programs, experiences, articles...'}
            className={styles.searchInput}
            autoFocus
          />
        </div>
        <button type="submit" className={styles.searchButton} disabled={!query.trim()}>
          {pageData?.searchButton || 'Search'}
        </button>
      </form>

      {query.trim() && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>
              {isSearching 
                ? (pageData?.searchingText || 'Searching...') 
                : (pageData?.resultsText?.replace('{count}', searchResults.length.toString()).replace('{query}', query) || `${searchResults.length} results for "${query}"`)
              }
            </h2>
          </div>

          {searchResults.length > 0 ? (
            <div className={styles.resultsList}>
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={styles.resultItem}
                  aria-label={`Open ${result.title} (${getTypeLabel(result.type)})`}
                >
                  <div className={styles.resultIcon}>
                    {getTypeIcon(result.type)}
                  </div>
                  <div className={styles.resultContent}>
                    <div className={styles.resultTitle}>
                      {result.title}
                      <span className={styles.resultType}>
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    {result.description && (
                      <div className={styles.resultDescription}>
                        {result.description}
                      </div>
                    )}
                  </div>
                  {result.external && (
                    <ExternalLink className={styles.externalIcon} />
                  )}
                </button>
              ))}
            </div>
          ) : query.trim() && !isSearching ? (
            <div className={styles.noResults}>
              <p>{pageData?.noResultsMessage?.replace('{query}', query) || `No results found for "${query}"`}</p>
              <p className={styles.noResultsHint}>
                {pageData?.noResultsHint || 'Try searching for "programs", "breathwork", "resilience", or "events"'}
              </p>
            </div>
          ) : null}
        </div>
      )}

      {!query.trim() && (
        <div className={styles.suggestions}>
          <h3 className={styles.suggestionsTitle}>{pageData?.popularSearches?.headline || 'Popular searches'}</h3>
          <div className={styles.suggestionsList}>
            {(pageData?.popularSearches?.terms || ['breathwork', 'resilience', 'programs', 'events', 'wim hof', 'cold exposure']).map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className={styles.suggestionTag}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
