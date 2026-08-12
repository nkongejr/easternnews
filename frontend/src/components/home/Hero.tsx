import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types';

export default function Hero({ article }: { article: Article }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-6">
      <Link href={`/articles/${article.slug}`} className="grid md:grid-cols-2 gap-6 group">
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
          <Image
            src={article.featuredImage?.url || 'https://placehold.co/900x600'}
            alt={article.featuredImage?.caption || article.title}
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="inline-block bg-brand-gold text-brand-blue-dark text-xs font-bold px-2 py-1 rounded w-fit mb-3">
            COVER STORY
          </span>
          <h1 className="font-headline text-3xl md:text-4xl font-black leading-tight group-hover:text-brand-blue">
            {article.title}
          </h1>
          {article.deck && (
            <p className="italic text-gray-600 mt-3 text-lg">{article.deck}</p>
          )}
          <p className="text-sm text-gray-500 mt-4">
            By {article.author?.name || 'Eastern Newspaper team'} · {article.bylineCredit}
          </p>
        </div>
      </Link>
    </section>
  );
}