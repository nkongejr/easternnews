import { notFound, permanentRedirect } from 'next/navigation';
import { COUNTIES } from '@/lib/constants';
import { CATEGORY_ALIASES } from '@/lib/routes';

type Props = { params: Promise<{ slug: string }> };

/**
 * Kenyanews-style `/category/<slug>` aliases.
 * Permanent (308) redirects to the canonical Eastern Newspaper URLs so any
 * legacy links and search listings (`/politics`, `/business`,
 * `/counties/meru` …) consolidate onto the live URLs.
 */
export default async function CategoryAliasPage({ params }: Props) {
  const { slug } = await params;
  const key = slug.toLowerCase();

  if (CATEGORY_ALIASES[key]) {
    permanentRedirect(CATEGORY_ALIASES[key]);
  }

  const county = COUNTIES.find((c) => c.slug === key);
  if (county) {
    permanentRedirect(`/counties/${county.slug}`);
  }

  notFound();
}
