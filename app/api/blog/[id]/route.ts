import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET - получение конкретного поста по ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const post = await prisma.blogPost.findUnique({
      where: { id }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Пост не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Ошибка при получении поста:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении поста' },
      { status: 500 }
    );
  }
}

// PUT - обновление поста
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { title, content, image, preview } = await req.json();
    
    const post = await prisma.blogPost.findUnique({
      where: { id }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Пост не найден' },
        { status: 404 }
      );
    }
    
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title: title || post.title,
        content: content || post.content,
        preview: preview || (content ? content.substring(0, 100) + '...' : post.preview),
        image: image !== undefined ? image : post.image,
        date: new Date().toISOString().substring(0, 10)
      }
    });
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Ошибка при обновлении поста:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении поста' },
      { status: 500 }
    );
  }
}

// DELETE - удаление поста
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    
    const post = await prisma.blogPost.findUnique({
      where: { id }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Пост не найден' },
        { status: 404 }
      );
    }
    
    await prisma.blogPost.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при удалении поста:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении поста' },
      { status: 500 }
    );
  }
}
