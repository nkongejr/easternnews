import CategoryArchivePage from '@/components/category/CategoryArchivePage';

export const metadata = { title: 'Opinion' };

type Props = { searchParams: Promise<{ page?: string }> };

export default async function OpinionPage({ searchParams }: Props) {
  const { page } = await searchParams;
  return (
    <CategoryArchivePage
      categoryName="Opinion"
      baseHref="/opinion"
      page={Number(page || 1)}
      description="Op-eds, analysis and comment."
      crumbs={[{ label: 'Home', href: '/' }, { label: 'Opinion' }]}
    />
  );
}
