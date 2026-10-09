import { notFound } from 'next/navigation';
import { api, safe } from '@/lib/api';
import { COUNTIES } from '@/lib/constants';
import CategoryArchivePage from '@/components/category/CategoryArchivePage';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

const countyBySlug = (slug: string) => COUNTIES.find((c) => c.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const county = countyBySlug(slug);
  if (!county) return { title: 'County News' };

  // Editorial blurb from the county's CMS desk when the newsroom has written
  // one; otherwise an honest, generated description of what the desk covers.
  const category = await safe(api.getCategoryBySlug(slug), null);
  const description =
    category?.description?.trim() ||
    `Latest news in ${county.name} County — politics, county government, business, education, sports and community reporting from the ${county.name} desk at The Eastern Newspaper.`;

  return {
    title: `Latest News in ${county.name} County`,
    description,
    alternates: { canonical: `/counties/${slug}` },
    openGraph: {
      title: `Latest News in ${county.name} County | The Eastern Newspaper`,
      description,
      url: `/counties/${slug}`,
      type: 'website',
    },
  };
}

export default async function CountyPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;

  const county = countyBySlug(slug);
  if (!county) notFound();

  // County coverage comes from each story's category, which is known without
  // the CMS. The Category doc only carries an optional editorial description,
  // so a desk missing from the CMS must still get a working county page
  // instead of a 404.
  const category = await safe(api.getCategoryBySlug(slug), null);

  return (
    <CategoryArchivePage
      categoryName={county.name}
      baseHref={`/counties/${slug}`}
      page={Number(page || 1)}
      description={category?.description}
      crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Counties', href: '/counties' },
        { label: `${county.name} News` },
      ]}
    />
  );
}
