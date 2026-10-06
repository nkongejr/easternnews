import AuthorForm from '@/components/admin/AuthorForm';

export default function NewAuthorPage() {
  return <div><div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue">Authors</p><h1 className="mt-1 text-3xl font-bold">New author</h1><p className="mt-1 text-gray-600">Add a byline profile for your newsroom.</p></div><AuthorForm /></div>;
}
