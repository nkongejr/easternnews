import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Article } from '@/types';
import CategoryBadge from './CategoryBadge';

export default function ArticleCard({ article }: { article: Article }) {
  const excerpt =
    article.deck || (article.body ? article.body.slice(0, 140) + '…' : '');
  const href = `/articles/${article.slug}`;

  return (
    <article className="border-b border-gray-200 pb-5 group">
      <Link href={href} className="block">
        <div className="img-frame aspect-[16/10] mb-3">
          <Image
            src={article.featuredImage?.url || 'https://placehold.co/600x400'}
            alt={article.featuredImage?.caption || article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <CategoryBadge category={article.category} />
        <h3 className="h-card mt-2 mb-1 group-hover:text-brand-blue transition-colors line-clamp-3">
          {article.title}
        </h3>
        {excerpt && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-2">
            {excerpt}
          </p>
        )}
      </Link>
      <div className="meta-line">
        By {article.author?.name || article.bylineCredit || 'Eastern Newspaper Team'}
        {article.bylineCredit ? ` · ${article.bylineCredit}` : ''}
      </div>
      <div className="meta-line mt-0.5">
        {article.publishDate
          ? format(new Date(article.publishDate), 'MMM d, yyyy')
          : ''}
        {article.commentCount ? ` · ${article.commentCount} comments` : ''}
      </div>
    </article>
  );
}
