import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Отключаем статический пререндеринг для этого API-роута
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// PUT - обновить клиента
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, logo, website, order, active } = body;
    const id = parseInt(params.id);
    
    if (!name || !logo) {
      return NextResponse.json(
        { error: 'Name and logo are required' },
        { status: 400 }
      );
    }
    
    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        logo,
        website: website || null,
        order: parseInt(order) || 0,
        active: active !== undefined ? active : true
      }
    });
    
    return NextResponse.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    );
  }
} 