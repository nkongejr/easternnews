import { notFound } from 'next/navigation';
import { api, safe, EMPTY_PAGE } from '@/lib/api';
import PageHeader from '@/components/shared/PageHeader';
import NewsGrid from '@/components/articles/NewsGrid';
import Sidebar from '@/components/sidebar/Sidebar';
import { SITE } from '@/lib/constants';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const author = await api.getAuthorBySlug(slug);
    return {
      title: author.name,
      description: author.bio || `Stories by ${author.name} for ${SITE.name}.`,
      alternates: { canonical: `/authors/${slug}` },
    };
  } catch {
    return { title: 'Author' };
  }
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;

  let author;
  try {
    author = await api.getAuthorBySlug(slug);
  } catch (err) {
    const status = (err as { status?: number })?.status;
    if (status === 404) notFound();
    throw err;
  }

  const result = await safe(
    api.getArticles({ author: author._id, limit: '24' }),
    EMPTY_PAGE,
  );

  return (
    <div>
      <PageHeader
        title={author.name}
        description={author.title || 'Correspondent'}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Authors' }, { label: author.name }]}
      />

      <div className="en-container grid gap-10 py-8 md:py-10 lg:grid-cols-3 lg:gap-12">
        <div className="min-w-0 lg:col-span-2">
          {author.bio && <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-muted">{author.bio}</p>}

          {result.data.length > 0 ? (
            <NewsGrid articles={result.data} columns={2} />
          ) : (
            <p className="text-sm text-muted">No published stories from this writer yet.</p>
          )}
        </div>
        <Sidebar />
      </div>
    </div>
  );
}
