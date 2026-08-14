import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Article } from '@/types';
import CategoryBadge from './CategoryBadge';

export default function ArticleCard({ article }: { article: Article }) {
  const excerpt =
    article.deck || (article.body ? article.body.slice(0, 140) + '...' : '');

  return (
    <article className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <Link href={`/articles/${article.slug}`}>
        <div className="relative w-full h-44">
          <Image
            src={article.featuredImage?.url || 'https://placehold.co/600x400'}
            alt={article.featuredImage?.caption || article.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <CategoryBadge category={article.category} />
        <Link href={`/articles/${article.slug}`}>
          <h3 className="font-headline font-bold text-lg mt-2 mb-1 hover:text-brand-blue line-clamp-2">
            {article.title}
          </h3>
        </Link>
        {excerpt && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            By {article.author?.name || article.bylineCredit || 'Eastern Newspaper Team'}
            {article.bylineCredit ? ` · ${article.bylineCredit}` : ''}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span>
            {article.publishDate
              ? format(new Date(article.publishDate), 'MMM d, yyyy')
              : ''}
          </span>
          <span>{article.commentCount ?? 0} comments</span>
        </div>
        <Link
          href={`/articles/${article.slug}`}
          className="inline-block mt-3 text-brand-blue font-semibold text-sm hover:underline"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}