import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// GET - получить всех клиентов
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    
    const clients = await prisma.client.findMany({
      where: all ? {} : { active: true },
      orderBy: { order: 'asc' }
    });
    
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

// POST - создать нового клиента
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, logo, website, order } = body;
    
    if (!name || !logo) {
      return NextResponse.json(
        { error: 'Name and logo are required' },
        { status: 400 }
      );
    }
    
    const client = await prisma.client.create({
      data: {
        name,
        logo,
        website: website || null,
        order: parseInt(order) || 0,
        active: true
      }
    });
    
    return NextResponse.json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}

// DELETE - удалить клиента и его логотип
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }
    
    // Получаем информацию о клиенте перед удалением
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    // Удаляем файл логотипа если он в папке uploads
    if (client.logo && client.logo.includes('/uploads/')) {
      try {
        const logoPath = path.join(process.cwd(), 'public', client.logo);
        await fs.unlink(logoPath);
        console.log('Logo file deleted:', logoPath);
      } catch (err) {
        console.log('Logo file not found or already deleted:', err);
      }
    }
    
    // Удаляем запись из базы данных
    await prisma.client.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
} 