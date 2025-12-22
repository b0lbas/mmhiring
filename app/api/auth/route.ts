import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createJWT, verifyJWT, getUserFromJWT } from '../../../lib/jwt-auth';

// В реальном приложении используйте безопасное хеширование и хранение
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'secret123';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    console.log('=================================');    
    console.log('password', password);
    console.log('ADMIN_PASSWORD', ADMIN_PASSWORD);
    console.log('=================================');
    
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Неверный пароль' },
        { status: 401 }
      );
    }

    // Создаем JWT токен
    const jwtToken = await createJWT('admin', 24); // действителен 24 часа
    
    // Установка защищенного куки с JWT токеном
    cookies().set({
      name: 'admin_session',
      value: jwtToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 часа
      path: '/',
      sameSite: 'strict'
    });

    console.log('JWT token created successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    return NextResponse.json(
      { error: 'Ошибка аутентификации' },
      { status: 500 }
    );
  }
}

// Роут для выхода из системы
export async function DELETE(req: Request) {
  try {
    const cookieStore = cookies();
    
    // Удаляем куки
    cookieStore.set({
      name: 'admin_session',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      path: '/',
      sameSite: 'strict'
    });
    
    console.log('Session logged out');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка выхода:', error);
    return NextResponse.json(
      { error: 'Ошибка выхода' },
      { status: 500 }
    );
  }
}

// Проверка статуса сессии
export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ authenticated: false });
    }
    
    const userInfo = await getUserFromJWT(sessionToken);
    if (!userInfo) {
      return NextResponse.json({ authenticated: false });
    }
    
    return NextResponse.json({ 
      authenticated: true,
      expiresAt: userInfo.expiresAt.toISOString(),
      userId: userInfo.userId
    });
  } catch (error) {
    console.error('Ошибка проверки сессии:', error);
    return NextResponse.json({ authenticated: false });
  }
}
