import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import CategoryBadge from '@/components/articles/CategoryBadge';
import ArticleBody from '@/components/articles/ArticleBody';
import RelatedArticles from '@/components/articles/RelatedArticles';
import ShareButtons from '@/components/shared/ShareButtons';
import Sidebar from '@/components/sidebar/Sidebar';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const article = await api.getArticleBySlug(params.slug);
    return {
      title: article.title,
      description: article.deck || article.body.slice(0, 150),
      openGraph: {
        title: article.title,
        description: article.deck,
        images: [article.featuredImage?.url],
      },
    };
  } catch {
    return { title: 'Article' };
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  let article;
  try {
    article = await api.getArticleBySlug(params.slug);
  } catch {
    notFound();
  }

  const url = `https://www.easternnewspaper.co.ke/articles/${params.slug}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-10">
      <article className="lg:col-span-2">
        <CategoryBadge category={article!.category} />
        <h1 className="font-headline text-3xl md:text-4xl font-black mt-3 mb-2">{article!.title}</h1>
        {article!.deck && <p className="italic text-lg text-gray-600 mb-4">{article!.deck}</p>}

        <p className="text-sm text-gray-500 mb-6">
          By {article!.author?.name || article!.bylineCredit} · {article!.bylineCredit} ·{' '}
          {format(new Date(article!.publishDate), 'MMMM d, yyyy')}
        </p>

        <div className="relative w-full h-72 md:h-[420px] rounded-lg overflow-hidden mb-3">
          <Image
            src={article!.featuredImage?.url || 'https://placehold.co/900x600'}
            alt={article!.featuredImage?.caption || article!.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        {article!.featuredImage?.caption && (
          <p className="text-xs text-gray-500 mb-6">
            {article!.featuredImage.caption} — <em>{article!.featuredImage.credit}</em>
          </p>
        )}

        <ArticleBody body={article!.body} />

        <ShareButtons title={article!.title} url={url} />

        <RelatedArticles articles={article!.relatedArticles || []} />
      </article>
      <Sidebar />
    </div>
  );
}