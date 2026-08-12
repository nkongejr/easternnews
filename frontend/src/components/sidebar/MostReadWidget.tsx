import Link from 'next/link';
import { api } from '@/lib/api';

export default async function MostReadWidget() {
  const articles = await api.getMostRead(5);
  if (!articles?.length) return null;

  return (
    <div className="bg-gray-50 border rounded-lg p-4">
      <h3 className="font-headline font-bold text-brand-blue mb-3 uppercase text-sm">Most Read</h3>
      <ol className="space-y-3">
        {articles.map((a, i) => (
          <li key={a._id} className="flex gap-3">
            <span className="font-headline font-black text-2xl text-brand-gold">{i + 1}</span>
            <Link href={`/articles/${a.slug}`} className="text-sm font-semibold hover:text-brand-blue line-clamp-2">
              {a.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}