import CategoryArchivePage from '@/components/category/CategoryArchivePage';

export const metadata = { title: 'Editorial' };

type Props = { searchParams: Promise<{ page?: string }> };

export default async function EditorialPage({ searchParams }: Props) {
  const { page } = await searchParams;
  return (
    <CategoryArchivePage
      categoryName="Editorial"
      baseHref="/editorial"
      page={Number(page || 1)}
      description="The Eastern Newspaper editorial voice."
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Editorial' }]}
    />
  );
}
