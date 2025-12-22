'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '../components/Header';

type BlogPost = {
  id: number;
  title: string;
  content: string;
  preview: string;
  image: string;
  date: string;
};

const titleVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch('/api/blog');
        
        if (!response.ok) {
          throw new Error('Ошибка при получении постов');
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError('Не удалось загрузить посты');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-primary-dark to-primary-blue pt-20">
        <div className="container mx-auto px-4 py-16">
          <motion.h1
            className="text-5xl font-bold text-white font-display text-center mb-12"
            variants={titleVariants}
            initial="hidden"
            animate="show"
          >
            Blog
          </motion.h1>
          
          {loading ? (
            <div className="text-center text-white text-xl">Загрузка постов...</div>
          ) : error ? (
            <div className="text-center text-red-400 text-xl">{error}</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-white text-xl">Нет доступных постов</div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {posts.map(post => (
                <motion.div
                  key={post.id}
                  variants={cardVariants}
                  className="w-full max-w-md"
                >
                  <Link href={`/blog/${post.id}`} className="block w-full bg-white/10 hover:bg-white/20 p-8 rounded-xl shadow-glass transition-all duration-300 cursor-pointer">
                    {post.image && (
                      <img src={post.image} alt={post.title} className="mb-4 rounded-xl max-h-40 w-full object-cover" />
                    )}
                    <h2 className="text-2xl font-bold text-white mb-2 font-display">{post.title}</h2>
                    <p className="text-gray-300 mb-4">{post.preview || post.content.substring(0, 100) + '...'}</p>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
