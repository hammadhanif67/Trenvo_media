import type { Faq, Service, Teardown } from '../types/content';
import { SITE_ORIGIN, absoluteUrl } from './site';

/* ---------------------------------------------------------------------------
   JSON-LD BUILDERS — master.md §21.5.

   §21.5 permits exactly six types: Organization, WebSite, Service,
   BreadcrumbList, FAQPage, Article.

   §21.5 PROHIBITS, in these words: "AggregateRating and Review schema without
   genuine reviews; Organization numberOfEmployees or award properties that are
   not true. Fabricated structured data is a manual-action risk and, more
   importantly, A LIE IN MACHINE-READABLE FORM."

   That prohibition is enforced by construction rather than by review: the
   builders below take no argument that could carry a rating, a review, a
   headcount or an award, so none can be emitted by mistake. The banned types
   are absent from the union, so a caller cannot even name one.
--------------------------------------------------------------------------- */

export type JsonLd = Record<string, unknown>;

/**
 * §21.5 — "Organization: Legal name, URL, logo, sameAs FOR REAL PROFILES ONLY."
 *
 * `sameAs` is deliberately omitted rather than passed as an empty array: no
 * social profile is documented anywhere, and an empty array is noise. It is
 * added when real profiles exist.
 */
export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Trenvo Media',
    url: SITE_ORIGIN,
    logo: absoluteUrl('/brand/icon-512.png'),
    description:
      'Trenvo Media runs the complete performance loop — the creative, the media that distributes it, and the destination it lands on — with a named specialist accountable for each part.',
  };
}

/**
 * §21.5 — "WebSite: With SearchAction ONLY IF site search exists."
 * There is no site search, so no SearchAction is emitted.
 */
export function webSiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Trenvo Media',
    url: SITE_ORIGIN,
  };
}

/** §21.5 — "Service: provider, serviceType, areaServed." */
export function serviceSchema(service: Service): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    serviceType: service.name,
    description: service.outcome,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { '@type': 'Organization', name: 'Trenvo Media', url: SITE_ORIGIN },
    // §7.3 and wireframe.md §12 — the regions Trenvo states it works across.
    areaServed: ['US', 'GB', 'EU', 'AE', 'AU', 'CA'],
  };
}

/** §21.5 — "BreadcrumbList: All nested pages." */
export function breadcrumbSchema(trail: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * §21.5 — "FAQPage: Homepage §11 and service FAQs. ONLY FOR QUESTIONS
 * GENUINELY ON THE PAGE."
 *
 * Callers pass the same array the page renders, so the schema and the page
 * cannot drift.
 */
export function faqSchema(faqs: Faq[]): JsonLd | null {
  if (faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/** §21.5 — "Article: author as the discipline/person, datePublished." */
export function articleSchema(teardown: Teardown, authorName: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: teardown.subject,
    datePublished: teardown.datePublished,
    author: { '@type': 'Person', name: authorName },
    publisher: { '@type': 'Organization', name: 'Trenvo Media', url: SITE_ORIGIN },
    url: absoluteUrl(`/teardowns/${teardown.slug}`),
  };
}
