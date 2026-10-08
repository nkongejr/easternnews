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
   The nine colours of the Eastern Newspaper logo, verbatim, plus
   the five derived shades the logo palette cannot supply on its
   own. Mirrored as CSS custom properties in globals.css (`--en-*`
   for the raw palette, `--brand-*` for the roles those colours
   play) — keep the two in step, as this file is what any
   non-Tailwind surface (SVG, canvas, meta theme) reads from.
   ------------------------------------------------------------ */

const LOGO = {
  navy: '#133041',
  blue: '#409ef4',
  cyan: '#57d7f4',
  steel: '#59a2c0',
  lime: '#edfb20',
  limeSoft: '#d7f953',
  green: '#6fb286',
  pale: '#aee174',
  ice: '#e5fcfc',
} as const;

/* Shades of the logo colours — see the note in globals.css. */
const SHADE = {
  navyDark: '#0d2432',
  navyDeep: '#081a25',
  navyTint: '#24506a',
  blueDeep: '#1874c6',
  cyanDeep: '#2ba8cc',
  greenDeep: '#4e8f66',
  limeDark: '#d3e312',
} as const;

export const BRAND = {
  /* The nine logo colours, untouched. */
  ...LOGO,
  /* The derived shades. */
  ...SHADE,
  /* Semantic roles, pointing at the values above so the two can
     never drift apart. */
  primary: LOGO.navy,
  primaryDark: SHADE.navyDark,
  primaryDarker: SHADE.navyDeep,
  secondary: LOGO.lime,
  secondaryDark: SHADE.limeDark,
  accent: LOGO.blue,
  accentDeep: SHADE.blueDeep,
  danger: '#c0392b', // errors only — outside the logo palette
} as const;

export const WHITE = '#ffffff';

/**
 * Hex values behind the CSS custom properties.
 *
 * Components may pass a brand colour either as a hex or as a token
 * reference (`accent="var(--color-ink)"`). Contrast maths needs the
 * actual value, so anything that measures a colour resolves it through
 * this map first. Keep in step with the `:root` block in globals.css.
 */
export const TOKEN_HEX: Record<string, string> = {
  '--brand-primary': BRAND.navy,
  '--brand-primary-dark': BRAND.navyDark,
  '--brand-primary-darker': BRAND.navyDeep,
  '--brand-secondary': BRAND.lime,
  '--brand-secondary-dark': BRAND.secondaryDark,
  '--brand-accent': BRAND.blue,
  '--brand-accent-deep': BRAND.blueDeep,
  '--brand-cyan': BRAND.cyan,
  '--brand-steel': BRAND.steel,
  '--brand-green': BRAND.green,
  '--brand-pale': BRAND.pale,
  '--brand-tint': BRAND.ice,
  '--danger': BRAND.danger,
  '--text': BRAND.navy,
  '--text-soft': BRAND.navyTint,
  /* Tailwind theme names. */
  '--color-brand-primary': BRAND.navy,
  '--color-brand-primary-dark': BRAND.navyDark,
  '--color-brand-primary-darker': BRAND.navyDeep,
  '--color-brand-secondary': BRAND.lime,
  '--color-brand-secondary-dark': BRAND.secondaryDark,
  '--color-brand-accent': BRAND.blue,
  '--color-brand-accent-deep': BRAND.blueDeep,
  '--color-brand-blue': BRAND.navy,
  '--color-brand-blue-dark': BRAND.navyDark,
  '--color-brand-blue-darker': BRAND.navyDeep,
  '--color-brand-gold': BRAND.lime,
  '--color-brand-gold-dark': BRAND.secondaryDark,
  '--color-ink': BRAND.navy,
  '--color-text': BRAND.navy,
  '--color-accent': BRAND.blue,
  '--color-danger': BRAND.danger,
};

/**
 * Desk colours.
 *
 * Every value is a logo colour or a shade of one, which is why the
 * eleven county desks read as a single navy → blue → cyan → green →
 * lime spectrum instead of a bag of unrelated hues. Badges and
 * section bars always ask `readableInk()` which ink to set on top,
 * so no entry here has to be legibility-checked by hand.
 */
export const CATEGORY_COLORS: Record<string, string> = {
  Meru: BRAND.navy,
  'Tharaka Nithi': BRAND.blue,
  Isiolo: BRAND.cyanDeep,
  Embu: BRAND.cyan,
  Samburu: BRAND.steel,
  Kirinyaga: BRAND.green,
  Laikipia: BRAND.pale,
  Kitui: BRAND.lime,
  Machakos: BRAND.limeSoft,
  Makueni: BRAND.ice,
  Marsabit: BRAND.navyTint,
  Business: BRAND.navyTint,
  Sports: BRAND.blue,
  Opinion: BRAND.steel,
  Editorial: BRAND.cyanDeep,
  National: BRAND.navy,
  Technology: BRAND.cyan,
  Entertainment: BRAND.green,
  Lifestyle: BRAND.pale,
  Profiles: BRAND.limeSoft,
};

export const DEFAULT_ACCENT = BRAND.navy;

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
