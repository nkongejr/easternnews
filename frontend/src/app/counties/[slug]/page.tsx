import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import CategoryArchivePage from '@/components/category/CategoryArchivePage';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const category = await api.getCategoryBySlug(slug);
    return { title: `${category.name} News` };
  } catch {
    return { title: 'County News' };
  }
}

export default async function CountyPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;

  let category;
  try {
    category = await api.getCategoryBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <CategoryArchivePage
      categoryName={category!.name}
      baseHref={`/counties/${slug}`}
      page={Number(page || 1)}
    />
  );
}