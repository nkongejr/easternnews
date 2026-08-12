import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import CategoryArchivePage from '@/components/category/CategoryArchivePage';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const category = await api.getCategoryBySlug(params.slug);
    return { title: `${category.name} News` };
  } catch {
    return { title: 'County News' };
  }
}

export default async function CountyPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  let category;
  try {
    category = await api.getCategoryBySlug(params.slug);
  } catch {
    notFound();
  }

  const page = Number(searchParams.page || 1);

  return (
    <CategoryArchivePage
      categoryName={category!.name}
      baseHref={`/counties/${params.slug}`}
      page={page}
    />
  );
}