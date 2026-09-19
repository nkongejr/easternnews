/* ============================================================
   EASTERN NEWSPAPER — CENTRAL CONFIGURATION
   Single source of truth for branding, navigation, counties,
   topics and contact details. Editors/devs change it here only.
   ============================================================ */

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

/* ------------------------------------------------------------
   NAVIGATION
   Counties live in their own dropdown so an 11-county list never
   crowds the bar. Secondary desks collapse into "More".
   ------------------------------------------------------------ */

export const PRIMARY_NAV = [
  { label: 'Home', href: '/' },
  { label: 'Latest', href: '/latest' },
  { label: 'Politics', href: '/politics' },
  { label: 'Business', href: '/business' },
  { label: 'Sports', href: '/sports' },
  { label: 'Opinion', href: '/opinion' },
  { label: 'Features', href: '/editorial' },
];

export const MORE_NAV = [
  { label: 'Technology', href: '/technology' },
  { label: 'Entertainment', href: '/entertainment' },
  { label: 'Lifestyle', href: '/lifestyle' },
  { label: 'About', href: '/about' },
  { label: 'Advertise', href: '/advertise' },
  { label: 'Contact', href: '/contact' },
  { label: 'Back Issues', href: '/archive' },
];

export const NAV_LINKS = [...PRIMARY_NAV, ...MORE_NAV];

/* ------------------------------------------------------------
   HOMEPAGE SECTIONS
   Data-driven: a block renders only when its category has
   published stories, so the front page is never built around
   today's example content.
   ------------------------------------------------------------ */

export const HOMEPAGE_SECTIONS = [
  {
    name: 'Politics & Governance',
    href: '/politics',
    // Governance reporting is filed under the existing "National" desk.
    category: 'National',
    kicker: 'Politics',
    topics: [
      { label: 'County Governments', href: '/search?q=county' },
      { label: 'Devolution', href: '/search?q=devolution' },
      { label: 'Policy', href: '/search?q=policy' },
    ],
  },
  {
    name: 'Business',
    href: '/business',
    category: 'Business',
    kicker: 'Business & Economy',
    topics: [
      { label: 'Agriculture', href: '/search?q=agriculture' },
      { label: 'Finance', href: '/search?q=finance' },
      { label: 'SMEs', href: '/search?q=SME' },
      { label: 'Markets', href: '/search?q=market' },
      { label: 'Regional Development', href: '/search?q=development' },
    ],
  },
  {
    name: 'Sports',
    href: '/sports',
    category: 'Sports',
    kicker: 'Sport',
    topics: [
      { label: 'Football', href: '/search?q=football' },
      { label: 'Athletics', href: '/search?q=athletics' },
      { label: 'Regional', href: '/search?q=regional' },
      { label: 'National', href: '/search?q=national' },
      { label: 'Community', href: '/search?q=community' },
    ],
  },
];

/** Counties given the full editorial treatment on the homepage. */
export const FEATURED_COUNTIES = [
  { name: 'Meru', slug: 'meru' },
  { name: 'Embu', slug: 'embu' },
  { name: 'Tharaka Nithi', slug: 'tharaka-nithi' },
  { name: 'Kitui', slug: 'kitui' },
];

/* ------------------------------------------------------------
   BRAND PALETTE
   The existing Eastern Newspaper colours. Mirrored as CSS custom
   properties in globals.css (--brand-primary, --brand-secondary,
   --brand-accent, --background, --surface, --text, --muted,
   --border) so a rebrand is a one-file change.
   ------------------------------------------------------------ */

export const BRAND = {
  primary: '#1a4d8f',
  primaryDark: '#123563',
  primaryDarker: '#0b2545',
  secondary: '#f2c94c',
  secondaryDark: '#d4a92e',
  accent: '#c0392b',
} as const;

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
  Technology: '#1a4d8f',
  Entertainment: '#8e44ad',
  Lifestyle: '#16a085',
};

export const DEFAULT_ACCENT = '#1a4d8f';

export const TILL_NUMBER = '610589';

/**
 * Master switch for every M-PESA till placement (TopBar, header nav drawer,
 * footer and the advertise page). Set to `true` to restore all of them at
 * once — no per-component edits needed.
 */
export const SHOW_MPESA_TILL = false;

/* ------------------------------------------------------------
   CONTACT
   ------------------------------------------------------------
   NOTE FOR THE CLIENT — the three desk addresses below are stored
   EXACTLY as supplied. They were provided without a domain suffix
   and have deliberately NOT been "corrected" or guessed. Add the
   domain in this one object and every page updates.
   ------------------------------------------------------------ */
export const CONTACT = {
  /**
   * Supplied by the client, preserved verbatim.
   * These are incomplete (no domain) and are therefore rendered as
   * plain text rather than mailto: links until the client confirms.
   */
  deskEmails: [
    { label: 'General enquiries', email: 'info@theeasternnewspaper' },
    { label: 'Editor & Publisher', email: 'simonkobia@easternnewspaper' },
    { label: 'News desk', email: 'news@easternnewspaper' },
  ],
  /** Currently verified, deliverable address — kept alongside the above. */
  verifiedEmail: 'info@easternnewspaper.co.ke',
  altEmail: 'themasharikinewspaper@gmail.com',
  phones: ['0712 992269', '0722 599651'],
  phoneHref: 'tel:+254712992269',
  address: 'Mashariki Communications Centre, Meru-Maua Road',
  postal: 'P.O Box 2736-60200, Meru',
  city: 'Meru, Kenya',
};

export const SITE = {
  name: 'The Eastern Newspaper',
  wordmarkTop: 'EASTERN',
  wordmarkBottom: 'NEWSPAPER',
  tagline: 'Be in the Know',
  description:
    'Regional newspaper covering Meru, Embu, Tharaka Nithi, Isiolo, Samburu, Marsabit, Laikipia, Machakos, Kitui, Makueni and Kirinyaga counties.',
  address: CONTACT.address,
  postal: CONTACT.postal,
  city: CONTACT.city,
  phoneLabel: CONTACT.phones.join(' / '),
  phoneHref: CONTACT.phoneHref,
  email: CONTACT.verifiedEmail,
  altEmail: CONTACT.altEmail,
  publisher:
    'The Mashariki Newspaper Ltd. Registered as a Newspaper at the GPO.',
  /** Used for canonical URLs / structured data. */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.easternnewspaper.co.ke',
  social: {
    facebook: 'https://facebook.com',
    x: 'https://x.com',
  },
};
