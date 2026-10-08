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

/**
 * `highlight` renders the link as a gold button — used for Publications so the
 * print-edition library is the most visible item in the desk list.
 */
export type NavLink = { label: string; href: string; highlight?: boolean };

export const PRIMARY_NAV: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Latest', href: '/latest' },
  { label: 'Politics', href: '/politics' },
  { label: 'Business', href: '/business' },
  { label: 'Sports', href: '/sports' },
  { label: 'Opinion', href: '/opinion' },
  { label: 'Features', href: '/editorial' },
  { label: 'Publications', href: '/publications', highlight: true },
];

export const MORE_NAV: NavLink[] = [
  { label: 'Profiles', href: '/profiles' },
  { label: 'Technology', href: '/technology' },
  { label: 'Entertainment', href: '/entertainment' },
  { label: 'Lifestyle', href: '/lifestyle' },
  { label: 'About', href: '/about' },
  { label: 'Advertise', href: '/advertise' },
  { label: 'Contact', href: '/contact' },
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
   The Eastern Newspaper logo colours — cyan, blue and yellow on
   black and white. Mirrored as CSS custom properties in
   globals.css (--brand-primary, --brand-secondary, --brand-cyan,
   --brand-accent, --background, --surface, --text, --muted,
   --border) so a rebrand is still a one-file change.

   `primary` is the logo blue deepened to #1573C4: identical hue
   family, but it clears WCAG AA both as white-on-colour (buttons,
   badges) and as a link colour on white. The unmodified logo blue
   #3099F0 is kept as `primaryBright` for rules, gradients and
   other decorative work that carries no text.
   ------------------------------------------------------------ */

export const BRAND = {
  cyan: '#45d8fe',
  cyanDark: '#12b7e8',
  cyanInk: '#0a6e8f',
  primary: '#1573c4',
  primaryDark: '#0f5ca8',
  primaryDarker: '#0a2e52',
  primaryBright: '#3099f0',
  secondary: '#f5ff00',
  secondaryDark: '#d9e300',
  accent: '#c8102e',
} as const;

/**
 * Desk and county slug colours.
 *
 * One tonal ramp built from the logo's blue and cyan — navy through
 * brand blue to teal — plus ink for comment. Every value clears
 * 4.5:1 against the white badge text, so the slugs stay legible on
 * photographs and on white alike. Yellow is deliberately NOT used
 * here: it is reserved for the paper's highlights (current issue,
 * subscribe buttons, the active nav underline).
 */
export const CATEGORY_COLORS: Record<string, string> = {
  Meru: '#0a2e52',
  'Tharaka Nithi': '#12497c',
  Isiolo: '#0a6e8f',
  Embu: '#0f5ca8',
  Samburu: '#1573c4',
  Kirinyaga: '#0e5f86',
  Laikipia: '#14508a',
  Kitui: '#0b5f7a',
  Machakos: '#1b4f86',
  Makueni: '#12497c',
  Marsabit: '#33475b',
  Business: '#0f5ca8',
  Sports: '#0a6e8f',
  Opinion: '#111111',
  Editorial: '#111111',
  National: '#0a2e52',
  Technology: '#14508a',
  Entertainment: '#1b4f86',
  Lifestyle: '#0e5f86',
  Profiles: '#06121f',
};

export const DEFAULT_ACCENT = '#0f5ca8';

/** Badge colours light enough to need ink rather than white text. */
export const LIGHT_ACCENTS = ['#f5ff00', '#d9e300', '#45d8fe'];

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
