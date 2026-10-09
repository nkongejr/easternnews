import type { Metadata } from 'next';
import './globals.css';
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import MainNav from '@/components/layout/MainNav';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import { COUNTIES, SITE } from '@/lib/constants';

/** Default social card — 1200×630, built from the existing wordmark and brand palette. */
const defaultOgImage = {
  url: `${SITE.url}/og-default.png`,
  width: 1200,
  height: 630,
  alt: `${SITE.name} — ${SITE.tagline}`,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  publisher: SITE.name,
  alternates: { canonical: '/' },
  /**
   * Explicit icon declarations alongside the file-convention icons
   * (app/favicon.ico → /favicon.ico, app/icon.png → /icon.png,
   * app/apple-icon.png → /apple-icon.png, which Next links automatically).
   * These two extra files are the Google-Search-friendly square PNG
   * (multiple of 48px) and a scalable SVG, both rendered from the official
   * "E" monogram. Google reads the home page's icon links for Search results.
   */
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    siteName: SITE.name,
    type: 'website',
    url: SITE.url,
    locale: 'en_KE',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [defaultOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'news',
};

/** Publisher identity for search engines and news aggregators. */
const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: SITE.name,
  alternateName: 'Eastern Newspaper',
  url: SITE.url,
  logo: `${SITE.url}${SITE.logo}`,
  description: SITE.description,
  slogan: SITE.tagline,
  foundingDate: '2016',
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address,
    addressLocality: 'Meru',
    addressRegion: 'Eastern Kenya',
    addressCountry: 'KE',
  },
  email: SITE.email,
  telephone: SITE.phoneLabel,
  areaServed: COUNTIES.map((c) => ({ '@type': 'AdministrativeArea', name: `${c.name} County` })),
  // sameAs should only ever list real, verified profiles. The X entry in
  // SITE.social is still a placeholder, so it is deliberately excluded here
  // — add it back (with the real profile URL) once the account is confirmed.
  sameAs: [SITE.social.facebook],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <header>
          <TopBar />
          <Header />
        </header>

        <MainNav />

        <main id="main">{children}</main>

        <Footer />

        <JsonLd data={organizationLd} />
      </body>
    </html>
  );
}
