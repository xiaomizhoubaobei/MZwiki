/**
 * Automated SEO and Meta Management for MZ Wiki
 * Adheres to standard Applet SEO guidelines:
 * - Dynamic <title>, <meta name="description">
 * - OpenGraph (og:title, og:description, og:type, og:url, og:image, og:site_name)
 * - Twitter Cards (twitter:card, twitter:title, twitter:description, twitter:image)
 * - Canonical link tag (<link rel="canonical">)
 * - Schema.org JSON-LD Structured Data (<script type="application/ld+json">)
 */

export interface PageSEOMetadata {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'profile';
  imageUrl?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  schemaType?: 'MedicalWebPage' | 'ScholarlyArticle' | 'CollectionPage' | 'WebApplication' | 'Article';
}

const BRAND_SUFFIX = 'MZ维基，自由的百科全书';
const SITE_NAME = 'MZ维基';
const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tampax_Compak.jpg/640px-Tampax_Compak.jpg';

/**
 * Updates DOM head elements dynamically for SEO and Social Cards
 */
export function applyPageSEO(meta: PageSEOMetadata): void {
  if (typeof document === 'undefined') return;

  const fullTitle = meta.title.includes(SITE_NAME)
    ? meta.title
    : `${meta.title} - ${BRAND_SUFFIX}`;

  // 1. Title
  document.title = fullTitle;

  // Helper to set or create meta tag
  const setMetaTag = (attributeName: 'name' | 'property', attributeValue: string, content: string) => {
    let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 2. Standard Meta Description
  const trimmedDesc = meta.description.length > 160
    ? `${meta.description.slice(0, 157)}...`
    : meta.description;
  setMetaTag('name', 'description', trimmedDesc);

  // 3. OpenGraph Tags
  setMetaTag('property', 'og:title', fullTitle);
  setMetaTag('property', 'og:description', trimmedDesc);
  setMetaTag('property', 'og:type', meta.ogType || 'article');
  setMetaTag('property', 'og:site_name', SITE_NAME);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mz-wiki.app';
  const canonicalUrl = meta.canonicalPath
    ? `${origin}${meta.canonicalPath}`
    : (typeof window !== 'undefined' ? window.location.href : origin);

  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:image', meta.imageUrl || DEFAULT_IMAGE);

  // 4. Twitter Card Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', fullTitle);
  setMetaTag('name', 'twitter:description', trimmedDesc);
  setMetaTag('name', 'twitter:image', meta.imageUrl || DEFAULT_IMAGE);

  // 5. Canonical Link Tag
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // 6. Schema.org JSON-LD Structured Data
  let scriptTag = document.getElementById('mzwiki-schema-jsonld') as HTMLScriptElement | null;
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.id = 'mzwiki-schema-jsonld';
    scriptTag.type = 'application/ld+json';
    document.head.appendChild(scriptTag);
  }

  const structuredData = generateSchemaOrgJsonLd(meta, canonicalUrl, fullTitle);
  scriptTag.textContent = JSON.stringify(structuredData, null, 2);
}

/**
 * Builds Schema.org JSON-LD metadata according to semantic type
 */
function generateSchemaOrgJsonLd(meta: PageSEOMetadata, canonicalUrl: string, fullTitle: string) {
  const schemaType = meta.schemaType || 'MedicalWebPage';

  const baseSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: fullTitle,
    headline: meta.title,
    description: meta.description,
    url: canonicalUrl,
    inLanguage: 'zh-Hans',
    isPartOf: {
      '@type': 'WebSite',
      name: 'MZ维基',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://mz-wiki.app',
      description: '自由的女性生理卫生、经期健康与解剖医学百科全书。'
    },
    publisher: {
      '@type': 'Organization',
      name: 'MZ维基百科基金会',
      logo: {
        '@type': 'ImageObject',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/500px-Wikipedia-logo-v2.svg.png'
      }
    }
  };

  if (meta.imageUrl) {
    baseSchema.image = meta.imageUrl;
  }

  if (meta.tags && meta.tags.length > 0) {
    baseSchema.keywords = meta.tags.join(', ');
  }

  if (schemaType === 'MedicalWebPage') {
    baseSchema.aspect = ['Symptoms', 'Causes', 'Prevention', 'Treatment', 'Usage Guidelines'];
    baseSchema.audience = {
      '@type': 'MedicalAudience',
      audienceType: 'Public & Healthcare consumers'
    };
  }

  return baseSchema;
}
