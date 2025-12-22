// Система управления сессиями для аутентификации
// В production используйте Redis или базу данных для хранения сессий

import { activeSessions, type Session } from './session-store';

// Проверка валидности токена сессии  
export function isValidSession(token: string): boolean {
  if (!token) return false;
  
  const session = activeSessions.get(token);
  if (!session) return false;
  
  // Проверяем не истек ли токен
  if (session.expiresAt < new Date()) {
    activeSessions.delete(token);
    return false;
  }
  
  return true;
}

// Создание новой сессии
export function createSession(userId?: string, durationDays: number = 1): { token: string; expiresAt: Date } {
  const crypto = require('crypto');
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);
  
  activeSessions.set(sessionToken, {
    expiresAt,
    userId: userId || 'admin',
    createdAt: new Date()
  });
  
  return { token: sessionToken, expiresAt };
}

// Удаление сессии
export function deleteSession(token: string): boolean {
  return activeSessions.delete(token);
}

// Получение информации о сессии
export function getSession(token: string): Session | null {
  if (!isValidSession(token)) return null;
  return activeSessions.get(token) || null;
}

// Очистка истекших сессий
export function cleanupExpiredSessions(): number {
  const now = new Date();
  let cleaned = 0;
  const tokensToDelete: string[] = [];
  
  // Собираем токены для удаления
  activeSessions.forEach((session, token) => {
    if (session.expiresAt < now) {
      tokensToDelete.push(token);
    }
  });
  
  // Удаляем истекшие сессии
  tokensToDelete.forEach(token => {
    activeSessions.delete(token);
    cleaned++;
  });
  
  return cleaned;
}

// Получение статистики сессий
export function getSessionStats() {
  const sessions: Array<{
    token: string;
    userId?: string;
    expiresAt: Date;
    createdAt: Date;
  }> = [];
  
  activeSessions.forEach((session, token) => {
    sessions.push({
      token: token.substring(0, 8) + '...',
      userId: session.userId,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt
    });
  });
  
  return {
    activeSessions: activeSessions.size,
    sessions
  };
}

// Экспортируем хранилище для прямого доступа (осторожно!)
export { activeSessions }; 