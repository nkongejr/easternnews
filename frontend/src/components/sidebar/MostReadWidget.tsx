import Link from 'next/link';
import { api } from '@/lib/api';

export default async function MostReadWidget() {
  const articles = await api.getMostRead(5);
  if (!articles?.length) return null;

  return (
    <div className="bg-paper-muted border border-gray-200 p-4" aria-labelledby="most-read-heading">
      <h3
        id="most-read-heading"
        className="font-headline font-bold text-brand-blue-dark uppercase text-sm tracking-[0.12em] pb-2 mb-3 border-b-2 border-brand-gold"
      >
        Most Read
      </h3>
      <ol className="divide-y divide-gray-200">
        {articles.map((a, i) => (
          <li key={a._id} className="flex gap-3 py-3">
            <span className="font-headline font-black text-2xl text-brand-gold-dark leading-none w-7 shrink-0">
              {i + 1}
            </span>
            <Link
              href={`/articles/${a.slug}`}
              className="text-sm font-semibold leading-snug hover:text-brand-blue line-clamp-3"
            >
              {a.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
