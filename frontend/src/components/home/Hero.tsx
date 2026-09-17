import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types';

export default function Hero({ article }: { article: Article }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-6 pb-8" aria-label="Cover story">
      <Link
        href={`/articles/${article.slug}`}
        className="grid md:grid-cols-5 gap-6 group block"
      >
        <div className="md:col-span-3">
          <div className="img-frame aspect-[16/10] md:aspect-[3/2]">
            <Image
              src={article.featuredImage?.url || 'https://placehold.co/900x600'}
              alt={article.featuredImage?.caption || article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          {article.featuredImage?.caption && (
            <p className="text-[11px] italic text-gray-500 mt-1.5">
              {article.featuredImage.caption}
            </p>
          )}
        </div>

        <div className="md:col-span-2 flex flex-col justify-center border-t-4 border-brand-gold md:border-t-0 md:border-l md:border-gray-200 md:pl-6 pt-4 md:pt-0">
          <span className="kicker mb-2">Cover Story</span>
          <h1 className="h-hero group-hover:text-brand-blue transition-colors">
            {article.title}
          </h1>
          {article.deck && (
            <p className="italic text-gray-600 mt-3 text-base md:text-lg leading-relaxed">
              {article.deck}
            </p>
          )}
          <p className="meta-line mt-4">
            By {article.author?.name || 'Eastern Newspaper team'}
            {article.bylineCredit ? ` · ${article.bylineCredit}` : ''}
          </p>
        </div>
      </Link>
    </section>
  );
}
