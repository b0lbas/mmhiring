'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Link from 'next/link';

type BlogPost = {
  id: number;
  title: string;
  content: string;
  preview: string;
  image: string;
  date: string;
};

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            router.replace('/blog');
            return;
          }
          throw new Error('Ошибка при получении поста');
        }
        
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError('Не удалось загрузить пост');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [params.id, router]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-primary-dark to-primary-blue pt-20">
          <div className="container mx-auto px-4 py-16 max-w-2xl">
            <div className="text-center text-white text-xl">Загрузка...</div>
          </div>
        </main>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-primary-dark to-primary-blue pt-20">
          <div className="container mx-auto px-4 py-16 max-w-2xl">
            <div className="text-center text-red-400 text-xl">{error || 'Пост не найден'}</div>
            <div className="text-center mt-4">
              <Link href="/blog" className="text-primary-pink hover:underline">
                Вернуться к блогу
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-primary-dark to-primary-blue pt-20">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <h1 className="text-4xl font-bold text-white mb-6 font-display text-center">{post.title}</h1>
          {post.image && (
            <div className="mb-8 flex justify-center">
              <img src={post.image} alt={post.title} className="rounded-xl max-h-80 w-full object-cover" />
            </div>
          )}
          <p className="text-lg text-gray-300 mb-8 text-center">{post.preview}</p>
          <div className="prose prose-invert max-w-none text-white" style={{whiteSpace: 'pre-line'}}>{post.content}</div>
          
          <div className="mt-12 text-center">
            <Link href="/blog" className="text-primary-pink hover:underline">
              ← Вернуться к блогу
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
