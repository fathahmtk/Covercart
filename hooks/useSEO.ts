import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  schema?: object;
}

export const useSEO = ({ title, description, keywords, schema }: SEOProps): void => {
  useEffect(() => {
    // Set Title
    document.title = title;

    // Set Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Set Meta Keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Set JSON-LD Schema
    const schemaId = 'app-schema-ld-json';
    let scriptTag = document.getElementById(schemaId);
    if (schema) {
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.id = schemaId;
            scriptTag.setAttribute('type', 'application/ld+json');
            document.head.appendChild(scriptTag);
        }
        scriptTag.innerHTML = JSON.stringify(schema);
    } else if (scriptTag) {
        // If no schema is provided but the tag exists, remove it
        scriptTag.remove();
    }

    // Cleanup function to remove tags when component unmounts
    // This is useful in an SPA to not leave old tags behind on navigation.
    return () => {
      // In a simple app, you might not need cleanup if the main App component
      // sets the default tags. However, if multiple components use this hook
      // without a parent setting defaults, this cleanup is important.
      // For this app, we'll let the next `useSEO` call override the previous.
    };
  }, [title, description, keywords, schema]); // Rerun effect if any of these change
};