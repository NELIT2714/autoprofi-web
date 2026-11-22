import { Lang } from '../i18n/i18n';

export const SITE_URL = 'https://autoprofi.kh.ua';

const TEXT = {
  uk: {
    description:
      'Викуп автомобілів у Харкові: онлайн-оцінка за описом, огляд і гроші в день угоди.',
    street: 'вул. Валківська, 1',
    locality: 'Пісочин',
    city: 'Харків',
    region: 'Харківська область',
  },
  ru: {
    description:
      'Выкуп автомобилей в Харькове: онлайн-оценка по описанию, осмотр и деньги в день сделки.',
    street: 'ул. Валковская, 1',
    locality: 'Песочин',
    city: 'Харьков',
    region: 'Харьковская область',
  },
} satisfies Record<
  Lang,
  {
    description: string;
    street: string;
    locality: string;
    city: string;
    region: string;
  }
>;

export function buildBusinessSchema(lang: Lang) {
  const text = TEXT[lang];

  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': `${SITE_URL}/#business`,
    name: 'AutoProfi',
    url: `${SITE_URL}/`,
    telephone: '+380999573405',
    // image: `${SITE_URL}/images/og-cover.jpg`,
    // logo: `${SITE_URL}/images/logo.png`,

    description: text.description,
    areaServed: { '@type': 'City', name: text.city },

    address: {
      '@type': 'PostalAddress',
      streetAddress: text.street,
      postalCode: '62416',
      addressLocality: text.locality,
      addressRegion: text.region,
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
