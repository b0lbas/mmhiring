import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET - получение всех постов
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Ошибка при чтении постов:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении списка постов' },
      { status: 500 }
    );
  }
}

// POST - создание нового поста
export async function POST(req: Request) {
  try {
    const { title, content, image, preview } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Необходимо указать заголовок и содержание' },
        { status: 400 }
      );
    }
    
    const newPost = await prisma.blogPost.create({
      data: {
        title,
        content,
        preview: preview || content.substring(0, 100) + '...',
        image: image || '',
        date: new Date().toISOString().substring(0, 10)
      }
    });
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Ошибка при добавлении поста:', error);
    return NextResponse.json(
      { error: 'Ошибка при добавлении поста' },
      { status: 500 }
    );
  }
}
