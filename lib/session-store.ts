// Глобальное хранилище сессий
// В production используйте Redis или базу данных

interface Session {
  expiresAt: Date;
  userId?: string;
  createdAt: Date;
}

// Глобальное хранилище через globalThis для устойчивости между модулями
declare global {
  var __sessionStore: Map<string, Session> | undefined;
}

// Инициализируем хранилище если оно не существует
if (!globalThis.__sessionStore) {
  globalThis.__sessionStore = new Map<string, Session>();
}

// Экспортируем хранилище
export const activeSessions = globalThis.__sessionStore;

// Экспортируем тип для использования в других файлах
export type { Session }; 