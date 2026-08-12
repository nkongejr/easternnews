'use client';

import { useState } from 'react';
import adminApi from '@/lib/adminApi';

export default function ImageUploader({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await adminApi.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(data.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {value && <img src={value} alt="preview" className="w-40 h-28 object-cover rounded mb-2 border" />}
      <input type="file" accept="image/*" onChange={handleFile} />
      {uploading && <p className="text-xs text-gray-500 mt-1">Uploading to Cloudinary...</p>}
    </div>
  );
}