'use client';

import React, { useState, useEffect } from 'react';
import { checkAuthStatus, logout, type AuthStatus } from '../../lib/auth-client';

// Хук для автоматической проверки аутентификации
export function useAuth() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ authenticated: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus().then((status) => {
      setAuthStatus(status);
      setLoading(false);
    });
  }, []);

  const refreshAuth = async () => {
    setLoading(true);
    const status = await checkAuthStatus();
    setAuthStatus(status);
    setLoading(false);
  };

  return { authStatus, loading, refreshAuth };
}

// Компонент для защиты контента
export function ProtectedContent({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { authStatus, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (!authStatus.authenticated) {
    return fallback || (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">Доступ запрещен</div>
      </div>
    );
  }

  return <>{children}</>;
}

// Кнопка выхода
export function LogoutButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 ${className}`}
    >
      {loading ? 'Выход...' : 'Выйти'}
    </button>
  );
}

// Индикатор статуса аутентификации
export function AuthStatusIndicator() {
  const { authStatus, loading } = useAuth();

  if (loading) {
    return <div className="text-gray-500 text-sm">Проверка...</div>;
  }

  return (
    <div className={`text-sm ${authStatus.authenticated ? 'text-green-600' : 'text-red-600'}`}>
      {authStatus.authenticated ? (
        <span>✓ Авторизован {authStatus.userId && `(${authStatus.userId})`}</span>
      ) : (
        <span>✗ Не авторизован</span>
      )}
    </div>
  );
} 