import { DICTIONARIES, Lang } from '../core/i18n/i18n';

export const SITE_URL = 'https://autoprofi.kh.ua';

export function buildBusinessSchema(lang: Lang) {
  const b = DICTIONARIES[lang].business;

  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': `${SITE_URL}/#business`,
    name: 'AutoProfi',
    url: `${SITE_URL}/`,
    telephone: '+380999573405',
    image: `${SITE_URL}/images/og-cover-${lang}.jpg`,
    logo: `${SITE_URL}/images/logo.svg`,

    description: b.description,
    areaServed: { '@type': 'City', name: b.city },

    address: {
      '@type': 'PostalAddress',
      streetAddress: b.street,
      postalCode: '62416',
      addressLocality: b.locality,
      addressRegion: b.region,
      addressCountry: 'UA',
    },

    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.955698,
      longitude: 36.0846496,
    },
    hasMap: 'https://maps.app.goo.gl/QSdqrfs5XoodFeEfA',

    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],

    sameAs: [
      'https://t.me/Autoprofikh1654',
      'https://www.instagram.com/autoprofi.kh',
      'https://www.tiktok.com/@autoprofi.kh',
    ],
  };
}
