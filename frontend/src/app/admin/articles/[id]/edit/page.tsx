'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import adminApi from '@/lib/adminApi';
import ArticleForm from '@/components/admin/ArticleForm';
import { Article } from '@/types';

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    adminApi.get(`/articles/id/${id}`).then((res) => setArticle(res.data));
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
      <ArticleForm initial={article} />
    </div>
  );
}