import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SchemaCheck: React.FC = () => {
  const location = useLocation();
  const [schemaData, setSchemaData] = useState<any>(null);

  useEffect(() => {
    const key = new URLSearchParams(location.search).get('key');
    const expectedKey = import.meta.env.VITE_SCHEMA_KEY;

    if (!key || key !== expectedKey) {
      setSchemaData({ error: 'Invalid or missing key' });
      return;
    }

    // Get injected JSON-LD types from global window object
    const injectedTypes = window.__jsonldTypes ? Array.from(window.__jsonldTypes) : [];

    // Define expected schemas for each path
    const expectedSchemas: Record<string, string[]> = {
      '/': ['Organization'],
      '/about': ['Person', 'Organization'],
      '/individuals': ['CollectionPage'],
      '/organizations': ['CollectionPage'],
      '/programs': ['CollectionPage'],
      '/programs/reverse-aging-challenge': ['Course'],
      '/programs/unblocked-in-ten-weeks': ['Course'],
      '/programs/unstoppable': ['Course'],
      '/experiences/wim-hof-method': ['Course'],
      '/experiences/9d-breathwork': ['Course'],
      '/solutions/stress-management-masterclass': ['Service'],
      '/solutions/breathwork-for-teams': ['Service'],
      '/solutions/wim-hof-method-corporate': ['Service'],
      '/solutions/business-constellations': ['Service'],
      '/solutions/executive-leadership-coaching': ['Service'],
      '/resources': ['CollectionPage'],
      '/article/test-article': ['Article'],
      '/testimonials': ['CollectionPage'],
      '/contact': ['Organization'],
      '/community': ['CollectionPage', 'Organization']
    };

    const currentPath = location.pathname;
    const recommended = expectedSchemas[currentPath] || [];
    const ok = recommended.every(schema => injectedTypes.includes(schema));

    setSchemaData({
      path: currentPath,
      injectedTypes,
      recommended,
      ok,
      timestamp: new Date().toISOString()
    });
  }, [location]);

  if (!schemaData) {
    return <div>Loading schema check...</div>;
  }

  if (schemaData.error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Schema Check - Access Denied</h1>
        <p>{schemaData.error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Schema Check</h1>
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '1rem', 
        borderRadius: '4px',
        overflow: 'auto',
        fontSize: '14px'
      }}>
        {JSON.stringify(schemaData, null, 2)}
      </pre>
      
      <div style={{ marginTop: '1rem' }}>
        <h3>Status: {schemaData.ok ? '✅ All recommended schemas present' : '❌ Missing schemas'}</h3>
        {!schemaData.ok && (
          <div>
            <p>Missing schemas:</p>
            <ul>
              {schemaData.recommended
                .filter((schema: string) => !schemaData.injectedTypes.includes(schema))
                .map((schema: string) => (
                  <li key={schema}>{schema}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaCheck;
