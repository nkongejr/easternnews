'use client';

import { useRef, useState } from 'react';
import adminApi from '@/lib/adminApi';

/**
 * PDF picker for an issue record. The file is streamed to Cloudinary as a raw
 * asset and the returned public URL is stored on the issue.
 *
 * Uploading PDFs can be switched off on the storage account, or the issue may
 * simply live elsewhere (web host, Drive) — so the URL field in the form stays
 * the primary, always-available route.
 */
export default function PdfUploader({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await adminApi.post('/upload/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(data.url);
    } catch {
      setError('Upload failed — paste a public PDF link below instead.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="publication-pdf-upload"
          className="cursor-pointer rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          {uploading ? 'Uploading…' : 'Upload PDF file'}
        </label>
        <input
          id="publication-pdf-upload"
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFile}
          disabled={uploading}
          className="sr-only"
        />
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-brand-blue hover:underline"
          >
            Open current PDF ↗
          </a>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
