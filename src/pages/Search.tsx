import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ExternalLink, Calendar, Users, BookOpen, Briefcase } from 'lucide-react';
import { useAllOfferingsLite, useLatestPostsLite, usePageSearch, useNavigation } from '../hooks/useFirestore';
import { SEO } from '@/components/SEO';
import { HeroSection } from '@/components/HeroSection';
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
    if (offerings && offerings.length > 0) {
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
    }

    // Search posts
    if (posts && posts.length > 0) {
      posts.forEach(post => {
        const titleMatch = post.title.toLowerCase().includes(searchTerm);
        const excerptMatch = post.excerpt?.toLowerCase().includes(searchTerm);
        const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
        
        if (titleMatch || excerptMatch || tagMatch) {
          results.push({
            id: `post-${post.slug}`,
            title: post.title,
            description: post.excerpt || '',
            url: `/article/${post.slug}`,
            type: 'post'
          });
        }
      });
    }

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
    if (!pageData?.sections?.typeLabels) {
      switch (type) {
        case 'route': return 'Page';
        case 'program': return 'Program';
        case 'experience': return 'Experience';
        case 'solution': return 'Solution';
        case 'post': return 'Article';
        default: return 'Result';
      }
    }
    return pageData.sections.typeLabels[type] || pageData.sections.typeLabels.default || 'Result';
  };

  return (
    <>
      <SEO data={{
        title: pageData?.seo?.title || 'Search - Breathing Flame',
        description: pageData?.seo?.description || 'Search for programs, experiences, articles, and resources'
      }} />
      
      {/* Hero Section */}
      {(pageData?.sections?.hero?.visible !== false) && pageData?.sections?.hero && (
        <HeroSection
          title={pageData.sections.hero.headline}
          subtitle={pageData.sections.hero.subtext}
          media={pageData.sections.hero.media}
          ctas={pageData.sections.hero.ctas}
        />
      )}

      <div className="container" style={{ maxWidth: '800px', paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)' }}>

      {/* Search Form Section */}
      {(pageData?.sections?.searchForm?.visible !== false) && pageData?.sections?.searchForm && (
        <form onSubmit={handleSearch} className={styles.searchForm} aria-label={pageData.sections.searchForm.ariaLabel}>
          <div className={styles.searchInputWrapper}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={pageData.sections.searchForm.placeholder}
              className="form-input"
              style={{ paddingLeft: '3rem' }}
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn--primary" disabled={!query.trim()}>
            {pageData.sections.searchForm.buttonLabel}
          </button>
        </form>
      )}

      {/* Results Section */}
      {query.trim() && (pageData?.sections?.results?.visible !== false) && pageData?.sections?.results && (
        <section className="section" style={{ paddingTop: 'var(--spacing-8)' }}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>
              {isSearching 
                ? pageData.sections.results.searchingText
                : pageData.sections.results.resultsText.replace('{count}', searchResults.length.toString()).replace('{query}', query)
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
              <p>{pageData.sections.results.noResultsMessage.replace('{query}', query)}</p>
              <p className={styles.noResultsHint}>
                {pageData.sections.results.noResultsHint}
              </p>
            </div>
          ) : null}
        </section>
      )}

      {/* Popular Searches Section */}
      {!query.trim() && (pageData?.sections?.popularSearches?.visible !== false) && pageData?.sections?.popularSearches && (
        <section className="section" style={{ paddingTop: 'var(--spacing-8)', textAlign: 'center' }}>
          <h3 className={styles.suggestionsTitle}>{pageData.sections.popularSearches.headline}</h3>
          <div className={styles.suggestionsList}>
            {pageData.sections.popularSearches.terms.map((term: string) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className={styles.suggestionTag}
              >
                {term}
              </button>
            ))}
          </div>
        </section>
      )}
      </div>
    </>
  );
};

export default Search;
