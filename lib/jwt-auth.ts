// JWT система аутентификации для работы между API и Middleware
// Использует Web Crypto API для совместимости с Edge Runtime

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Простая реализация JWT для токенов сессий
interface JWTPayload {
  userId: string;
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
}

// Кодирование в base64url
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(bytes)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Декодирование из base64url
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  const bytes = atob(str);
  const uint8Array = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    uint8Array[i] = bytes.charCodeAt(i);
  }
  return new TextDecoder().decode(uint8Array);
}

// Создание подписи HMAC-SHA256 с использованием Web Crypto API
async function createSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(data);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const signatureArray = new Uint8Array(signature);
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(signatureArray)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Создание JWT токена
export async function createJWT(userId: string, expiresInHours: number = 24): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    userId,
    exp: now + (expiresInHours * 60 * 60), // expiration time
    iat: now // issued at
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  
  const signature = await createSignature(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Проверка и декодирование JWT токена
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    
    // Проверяем подпись
    const expectedSignature = await createSignature(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);

    if (signature !== expectedSignature) {
      console.log('JWT signature verification failed');
      return null;
    }

    // Декодируем payload
    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));
    
    // Проверяем срок действия
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      console.log('JWT token expired');
      return null;
    }

    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// Проверка валидности токена (упрощенная функция для middleware)
export async function isValidJWT(token: string): Promise<boolean> {
  const payload = await verifyJWT(token);
  return payload !== null;
}

// Получение информации о пользователе из токена
export async function getUserFromJWT(token: string): Promise<{ userId: string; expiresAt: Date } | null> {
  const payload = await verifyJWT(token);
  if (!payload) return null;
  
  return {
    userId: payload.userId,
    expiresAt: new Date(payload.exp * 1000)
  };
} 