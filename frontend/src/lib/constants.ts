export const COUNTIES = [
  { name: 'Meru', slug: 'meru' },
  { name: 'Tharaka Nithi', slug: 'tharaka-nithi' },
  { name: 'Isiolo', slug: 'isiolo' },
  { name: 'Embu', slug: 'embu' },
  { name: 'Samburu', slug: 'samburu' },
  { name: 'Kirinyaga', slug: 'kirinyaga' },
  { name: 'Laikipia', slug: 'laikipia' },
  { name: 'Kitui', slug: 'kitui' },
  { name: 'Machakos', slug: 'machakos' },
  { name: 'Makueni', slug: 'makueni' },
  { name: 'Marsabit', slug: 'marsabit' },
];

export const COUNTY_NAMES = COUNTIES.map((c) => c.name);

/**
 * Primary navigation. Counties are not listed here — they live in their own
 * dropdown so a county list of this size never crowds the main nav.
 */
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Business', href: '/business' },
  { label: 'Sports', href: '/sports' },
  { label: 'Opinion', href: '/opinion' },
  { label: 'Editorial', href: '/editorial' },
  { label: 'About', href: '/about' },
  { label: 'Advertise', href: '/advertise' },
  { label: 'Contact', href: '/contact' },
];

/** Sections that get their own homepage block, in order. */
export const HOMEPAGE_SECTIONS = [
  { name: 'Business', href: '/business' },
  { name: 'Sports', href: '/sports' },
  { name: 'Opinion', href: '/opinion' },
];

/** Counties given the full editorial treatment on the homepage. */
export const FEATURED_COUNTIES = [
  { name: 'Meru', slug: 'meru' },
  { name: 'Embu', slug: 'embu' },
  { name: 'Tharaka Nithi', slug: 'tharaka-nithi' },
  { name: 'Kitui', slug: 'kitui' },
];

export const CATEGORY_COLORS: Record<string, string> = {
  Meru: '#1a4d8f',
  'Tharaka Nithi': '#2e7d32',
  Isiolo: '#b8860b',
  Embu: '#8e44ad',
  Samburu: '#d35400',
  Kirinyaga: '#16a085',
  Laikipia: '#c0392b',
  Kitui: '#f2c94c',
  Machakos: '#2980b9',
  Makueni: '#27ae60',
  Marsabit: '#7f8c8d',
  Business: '#1a4d8f',
  Sports: '#f2c94c',
  Opinion: '#333333',
  Editorial: '#333333',
  National: '#1a4d8f',
};

/** Default accent used when a category has no mapped colour. */
export const DEFAULT_ACCENT = '#1a4d8f';

export const TILL_NUMBER = '610589';

/** Publisher details — mirrors the information already used in the footer. */
export const SITE = {
  name: 'The Eastern Newspaper',
  wordmarkTop: 'EASTERN',
  wordmarkBottom: 'NEWSPAPER',
  tagline: 'Be in the Know',
  description:
    'Regional newspaper covering Meru, Embu, Tharaka Nithi, Isiolo, Samburu, Marsabit, Laikipia, Machakos, Kitui, Makueni and Kirinyaga counties.',
  address: 'Mashariki Communications Centre, Meru-Maua Road',
  postal: 'P.O Box 2736-60200, Meru',
  city: 'Meru, Kenya',
  phoneLabel: '0712 992269 / 0722 599651',
  phoneHref: 'tel:+254712992269',
  email: 'info@easternnewspaper.co.ke',
  altEmail: 'themasharikinewspaper@gmail.com',
  publisher:
    'The Mashariki Newspaper Ltd. Registered as a Newspaper at the GPO.',
  social: {
    facebook: 'https://facebook.com',
    x: 'https://x.com',
  },
};
