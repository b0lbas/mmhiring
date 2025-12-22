'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка аутентификации');
      }

      console.log('Login successful, redirecting to admin...');
      
      // Получаем параметр redirect из URL если есть
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get('redirect') || '/admin/blog';
      
      // Небольшая задержка чтобы убедиться что куки установлены
      setTimeout(() => {
        console.log('Redirecting to:', redirectTo);
        window.location.href = redirectTo;
      }, 100);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-dark to-primary-blue flex items-center justify-center">
      <div className="bg-white/10 p-8 rounded-xl shadow-glass max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-6 text-center font-display">Вход в Админ-панель</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-white mb-2">Пароль администратора</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-pink"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-pink text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </main>
  );
}
