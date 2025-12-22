import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidJWT, getUserFromJWT } from '../../../../lib/jwt-auth';

// GET /api/auth/sessions - получение информации о текущей сессии
export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;
    
    // Проверяем что пользователь авторизован
    if (!sessionToken || !(await isValidJWT(sessionToken))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userInfo = await getUserFromJWT(sessionToken);
    if (!userInfo) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        userId: userInfo.userId,
        expiresAt: userInfo.expiresAt,
        sessionType: 'JWT'
      }
    });
  } catch (error) {
    console.error('Ошибка получения информации о сессии:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// DELETE /api/auth/sessions - выход из системы (то же что и DELETE /api/auth)
export async function DELETE(req: Request) {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;
    
    // Проверяем что пользователь авторизован
    if (!sessionToken || !(await isValidJWT(sessionToken))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Удаляем куки (JWT токены нельзя "отозвать" без blacklist, но мы удаляем куки)
    cookieStore.set({
      name: 'admin_session',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      path: '/',
      sameSite: 'strict'
    });
    
    return NextResponse.json({
      success: true,
      message: 'Выход из системы выполнен'
    });
  } catch (error) {
    console.error('Ошибка выхода:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
} 