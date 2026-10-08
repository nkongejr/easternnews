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
   Extracted from the official mark "EASTERN NEWSPAPER LOGO 1.jpg".
   Cyan #44d8fe (73% of the logo's ink) is the wordmark colour,
   blue #449ddf (15%) the band, lime #c4ee5f (7%) the accent
   stripe, and #001b2e the outline ink.

   The interactive shades below keep those exact hues but are
   darkened until they clear WCAG AA (4.5:1) against white — the
   raw logo cyan is only 1.8:1 on white, so it stays decorative
   (see --logo-* in globals.css).

   Mirrored as CSS custom properties in globals.css
   (--brand-primary, --brand-secondary, --brand-accent,
   --background, --surface, --text, --muted, --border) so a
   rebrand is a one-file change.
   ------------------------------------------------------------ */

export const BRAND = {
  primary: '#0d6b80',
  primaryDark: '#085060',
  primaryDarker: '#072c3c',
  secondary: '#c4ee5f',
  secondaryDark: '#97ca21',
  accent: '#13629a',
  /** Verbatim logo colours, for decorative fills only. */
  logoCyan: '#44d8fe',
  logoBlue: '#449ddf',
  logoLime: '#c4ee5f',
  logoInk: '#001b2e',
} as const;

/**
 * County + section badge colours.
 *
 * Every hue below is one that actually occurs in the logo — the
 * mark carries a full sweep from yellow (60°) through green (120°)
 * and teal (167°) to cyan (191°) and blue (225°) — so the badges
 * stay distinguishable without reaching outside it. Each shade is
 * darkened to clear 4.5:1 against the white badge label, except
 * Kitui, which is the logo's lime and therefore takes dark text
 * (see CategoryBadge).
 */
export const CATEGORY_COLORS: Record<string, string> = {
  Meru: '#0d6b80', // cyan 191°
  'Tharaka Nithi': '#1f6b2f', // green 133°
  Isiolo: '#72760a', // olive 62°
  Embu: '#21488c', // blue 218°
  Samburu: '#487515', // lime-green 88°
  Kirinyaga: '#157568', // teal 172°
  Laikipia: '#1468a3', // blue 205°
  Kitui: '#c4ee5f', // lime 78° — dark text
  Machakos: '#1378aa', // cyan-blue 200°
  Makueni: '#217343', // green 145°
  Marsabit: '#51595d', // slate
  Business: '#137396', // cyan 196°
  Sports: '#507d12', // lime 85°
  Opinion: '#313a3f',
  Editorial: '#313a3f',
  National: '#0d6c82', // cyan 191°
  Technology: '#185491', // blue 210°
  Entertainment: '#1b745e', // teal-green 165°
  Lifestyle: '#256d22', // green 118°
  Profiles: '#1c3440', // ink
};

export const DEFAULT_ACCENT = '#0d6b80';

/**
 * Badge fills light enough that the label must flip to dark ink
 * to stay legible. Kept in sync with CATEGORY_COLORS.
 */
export const LIGHT_BADGE_COLORS: readonly string[] = ['#c4ee5f'];

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
