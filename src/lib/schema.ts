import type { CaseStudy, Faq, Service, Teardown } from '../types/content';
import { SITE_ORIGIN, SITE_NAME, SITE_DESCRIPTION, CONTACT_EMAIL, absoluteUrl } from './site';
import { COMPANY_FACTS, RESOLVED_SOCIAL_LINKS } from '../data/navigation';

/* ---------------------------------------------------------------------------
   JSON-LD BUILDERS — master.md §21.5.

   Permitted types, and only these: Organization, WebSite, Service,
   BreadcrumbList, FAQPage, Article.

   §21.5 PROHIBITS, in these words: "AggregateRating and Review schema without
   genuine reviews; Organization numberOfEmployees or award properties that are
   not true. Fabricated structured data is a manual-action risk and, more
   importantly, A LIE IN MACHINE-READABLE FORM."

   That prohibition is enforced BY CONSTRUCTION rather than by review: the
   builders below take no argument that could carry a rating, a review, a
   headcount or an award, so none can be emitted by mistake. The banned types
   are absent from the union, so a caller cannot even name one.

   ⚠ NO LocalBusiness. LocalBusiness asserts a staffed place a customer can
   visit, and it is the single most commonly faked schema on agency sites. It is
   emitted only when COMPANY_FACTS.address is a real, verified postal address —
   which is to say, not at all today. A virtual office or a registered-agent
   address does NOT qualify.
--------------------------------------------------------------------------- */

export type JsonLd = Record<string, unknown>;

/** The stable @id for the organisation, so other nodes can reference it. */
const ORG_ID = `${SITE_ORIGIN}/#organization`;

/**
 * §21.5 — "Organization: Legal name, URL, logo, sameAs FOR REAL PROFILES ONLY."
 *
 * Every optional property is conditional on a verified fact existing:
 *   · `sameAs` only lists profiles whose URL has actually been set
 *   · `legalName` only when the registered entity has been supplied
 *   · `foundingDate` only when the year has been supplied
 *   · `address` only when a full postal address has been supplied
 *
 * See COMPANY_FACTS in data/navigation.ts. Emitting an empty array or a guessed
 * value is exactly the "lie in machine-readable form" §21.5 names.
 */
export function organizationSchema(): JsonLd {
  const schema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_ORIGIN,
    logo: absoluteUrl('/brand/icon-512.png'),
    image: absoluteUrl('/brand/og-default.png'),
    description: SITE_DESCRIPTION,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: CONTACT_EMAIL,
        // §7.3 and the footer — the regions Trenvo states it works across.
        // Not a claim about offices; a claim about who it takes work from.
        areaServed: ['US', 'GB', 'EU', 'AE', 'AU', 'CA'],
        availableLanguage: ['English'],
      },
    ],
  };

  if (RESOLVED_SOCIAL_LINKS.length > 0) {
    schema['sameAs'] = RESOLVED_SOCIAL_LINKS.map((s) => s.href);
  }
  if (COMPANY_FACTS.legalName) schema['legalName'] = COMPANY_FACTS.legalName;
  if (COMPANY_FACTS.founded) schema['foundingDate'] = COMPANY_FACTS.founded;
  if (COMPANY_FACTS.address) {
    schema['address'] = {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_FACTS.address.street,
      addressLocality: COMPANY_FACTS.address.locality,
      addressRegion: COMPANY_FACTS.address.region,
      postalCode: COMPANY_FACTS.address.postalCode,
      addressCountry: COMPANY_FACTS.address.country,
    };
  }

  return schema;
}

/**
 * §21.5 — "WebSite: With SearchAction ONLY IF site search exists."
 * There is no site search, so no SearchAction is emitted.
 */
export function webSiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    name: SITE_NAME,
    url: SITE_ORIGIN,
    description: SITE_DESCRIPTION,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
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
    provider: { '@id': ORG_ID },
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
 * §21.5 — "FAQPage: ONLY FOR QUESTIONS GENUINELY ON THE PAGE."
 *
 * Callers pass the same array the page renders, and null is returned for an
 * empty one, so a page without visible FAQs cannot emit FAQPage. That is not a
 * stylistic preference: FAQPage markup with no matching on-page content is a
 * documented manual-action trigger.
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
    description: teardown.observation,
    datePublished: teardown.datePublished,
    dateModified: teardown.dateModified ?? teardown.datePublished,
    author: { '@type': 'Person', name: authorName },
    publisher: { '@id': ORG_ID },
    image: absoluteUrl('/brand/og-default.png'),
    url: absoluteUrl(`/teardowns/${teardown.slug}`),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/teardowns/${teardown.slug}`),
    },
    isAccessibleForFree: true,
  };
}

/**
 * A case study, as an Article.
 *
 * ⚠ NOT `Review`, and NOT carrying `aggregateRating`. A case study is Trenvo
 * writing about its own work; presenting it as a review would be the exact
 * fabrication §21.5 prohibits. `about` names the client only because a
 * published case study requires the client's permission to publish in the
 * first place.
 */
export function caseStudySchema(study: CaseStudy, publishedAt: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: study.context,
    description: study.diagnosis,
    datePublished: publishedAt,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    url: absoluteUrl(`/work/${study.slug}`),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/work/${study.slug}`),
    },
  };
}
