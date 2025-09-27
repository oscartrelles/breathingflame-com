import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ExternalLink, Calendar, Users, BookOpen, Briefcase } from 'lucide-react';
import { useAllOfferingsLite, useLatestPostsLite } from '../hooks/useFirestore';
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
  
  const { offerings } = useAllOfferingsLite();
  const { posts } = useLatestPostsLite();

  // Known routes for search
  const knownRoutes = [
    { title: 'Home', url: '/', description: 'Main homepage' },
    { title: 'Individuals', url: '/individuals', description: 'Programs and experiences for individuals' },
    { title: 'Organizations', url: '/organizations', description: 'Corporate solutions and team programs' },
    { title: 'Programs', url: '/programs', description: 'All programs and experiences' },
    { title: 'Events', url: '/events', description: 'Upcoming events and workshops' },
    { title: 'Resources', url: '/resources', description: 'Articles and free resources' },
    { title: 'Testimonials', url: '/testimonials', description: 'Client testimonials and success stories' },
    { title: 'About', url: '/about', description: 'About Breathing Flame and our mission' },
    { title: 'Contact', url: '/contact', description: 'Get in touch with us' },
    { title: 'Community', url: '/community', description: 'Join our community channels' },
  ];

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
    switch (type) {
      case 'route': return 'Page';
      case 'program': return 'Program';
      case 'experience': return 'Experience';
      case 'solution': return 'Solution';
      case 'post': return 'Article';
      default: return 'Result';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Search</h1>
        <p className={styles.subtitle}>Find programs, experiences, articles, and more</p>
      </div>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchInputWrapper}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for programs, experiences, articles..."
            className={styles.searchInput}
            autoFocus
          />
        </div>
        <button type="submit" className={styles.searchButton} disabled={!query.trim()}>
          Search
        </button>
      </form>

      {query.trim() && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>
              {isSearching ? 'Searching...' : `${searchResults.length} results for "${query}"`}
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
              <p>No results found for "{query}"</p>
              <p className={styles.noResultsHint}>
                Try searching for "programs", "breathwork", "resilience", or "events"
              </p>
            </div>
          ) : null}
        </div>
      )}

      {!query.trim() && (
        <div className={styles.suggestions}>
          <h3 className={styles.suggestionsTitle}>Popular searches</h3>
          <div className={styles.suggestionsList}>
            {['breathwork', 'resilience', 'programs', 'events', 'wim hof', 'cold exposure'].map((term) => (
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
