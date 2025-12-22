// Клиентская утилита для работы с аутентификацией

export interface AuthStatus {
  authenticated: boolean;
  expiresAt?: string;
  userId?: string;
}

export interface SessionStats {
  activeSessions: number;
  sessions: Array<{
    token: string;
    userId?: string;
    expiresAt: Date;
    createdAt: Date;
  }>;
}

// Вход в систему
export async function login(password: string): Promise<{ success: boolean; error?: string }> {
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
      return { success: false, error: data.error || 'Ошибка авторизации' };
    }

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Ошибка сети' };
  }
}

// Выход из системы
export async function logout(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/auth', {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Ошибка выхода' };
    }

    // Перенаправляем на страницу входа
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Ошибка сети' };
  }
}

// Проверка статуса аутентификации
export async function checkAuthStatus(): Promise<AuthStatus> {
  try {
    const response = await fetch('/api/auth', {
      method: 'GET',
    });

    if (!response.ok) {
      return { authenticated: false };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Auth check error:', error);
    return { authenticated: false };
  }
}

// Получение статистики сессий
export async function getSessionStats(): Promise<SessionStats | null> {
  try {
    const response = await fetch('/api/auth/sessions', {
      method: 'GET',
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Session stats error:', error);
    return null;
  }
}

// Очистка истекших сессий
export async function cleanupSessions(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch('/api/auth/sessions', {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Ошибка очистки' };
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error('Cleanup sessions error:', error);
    return { success: false, error: 'Ошибка сети' };
  }
} 