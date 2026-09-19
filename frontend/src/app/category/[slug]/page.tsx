import { notFound, redirect } from 'next/navigation';
import { COUNTIES } from '@/lib/constants';
import { CATEGORY_ALIASES } from '@/lib/routes';

type Props = { params: Promise<{ slug: string }> };

/**
 * Kenyanews-style `/category/<slug>` aliases.
 * Redirects to the canonical Eastern Newspaper URLs so existing SEO
 * listings (`/politics`, `/business`, `/counties/meru` …) stay intact.
 */
export default async function CategoryAliasPage({ params }: Props) {
  const { slug } = await params;
  const key = slug.toLowerCase();

  if (CATEGORY_ALIASES[key]) {
    redirect(CATEGORY_ALIASES[key]);
  }

  const county = COUNTIES.find((c) => c.slug === key);
  if (county) {
    redirect(`/counties/${county.slug}`);
  }

  notFound();
}
