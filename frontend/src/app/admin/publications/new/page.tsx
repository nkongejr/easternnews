import PublicationForm from '@/components/admin/PublicationForm';

export default function NewPublicationPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue">Publications</p>
        <h1 className="mt-1 text-3xl font-bold">New publication</h1>
        <p className="mt-1 text-gray-600">
          Add a print edition so it appears in the public Publications library.
        </p>
      </div>
      <PublicationForm />
    </div>
  );
}
