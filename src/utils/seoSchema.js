import { FAQS } from '../components/landing/faq/faq.data.js'

/**
 * Schema.org @graph for the homepage — shared by build script and tests.
 * @param {string} siteUrl — canonical origin without trailing slash
 */
export function buildHomepageJsonLd(siteUrl) {
  const faqPage = {
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'KursoKo',
        url: siteUrl,
        logo: `${siteUrl}/favicon.svg`,
        description: 'Career guidance for Filipino SHS students',
        areaServed: {
          '@type': 'Country',
          name: 'Philippines',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'KursoKo',
        description:
          'Take a free 10-minute RIASEC assessment. Discover college courses, careers, and scholarships in the Philippines that match your strengths. No sign-up required.',
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: 'en-PH',
      },
      {
        '@type': 'WebApplication',
        '@id': `${siteUrl}/#app`,
        name: 'KursoKo',
        url: siteUrl,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        browserRequirements: 'Requires JavaScript',
        description:
          'Free RIASEC career assessment for Filipino SHS students with course, university, and scholarship matching.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'PHP',
        },
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'student',
          geographicArea: {
            '@type': 'Country',
            name: 'Philippines',
          },
        },
        featureList: [
          'RIASEC personality assessment',
          'Philippine college course recommendations',
          'University matching',
          'Scholarship finder',
          'Six character archetypes',
        ],
      },
      { ...faqPage, '@id': `${siteUrl}/#faq` },
    ],
  }
}
