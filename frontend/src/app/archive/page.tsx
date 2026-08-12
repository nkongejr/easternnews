import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';

export const metadata = { title: 'Back Issues' };

export default async function ArchivePage() {
  const issues = await api.getIssues();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-headline text-3xl font-bold mb-8">Back Issues</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {issues.map((issue) => (
          <div key={issue._id} className="border rounded-lg overflow-hidden">
            <div className="relative w-full h-56">
              <Image
                src={issue.coverImage || 'https://placehold.co/400x600'}
                alt={issue.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <p className="font-bold">{issue.title}</p>
              <p className="text-sm text-gray-600 mb-3">{issue.coverHeadline}</p>
              {issue.pdfUrl ? (
                <a href={issue.pdfUrl} target="_blank" className="text-brand-blue font-semibold text-sm hover:underline">
                  Download PDF →
                </a>
              ) : (
                <span className="text-xs text-gray-400">Digital replica coming soon</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}