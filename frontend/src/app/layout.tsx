import type { Metadata } from 'next';
import './globals.css';
import TopBar from '@/components/layout/TopBar';
import MainNav from '@/components/layout/MainNav';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'The Eastern Newspaper — Be in the Know',
    template: '%s | The Eastern Newspaper',
  },
  description: 'Regional monthly newspaper covering Meru, Embu, Tharaka Nithi, Isiolo, Samburu, Marsabit, Laikipia, Machakos, Kitui, Makueni and Kirinyaga counties.',
  metadataBase: new URL('https://www.easternnewspaper.co.ke'),
  openGraph: {
    siteName: 'The Eastern Newspaper',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopBar />
        <MainNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}