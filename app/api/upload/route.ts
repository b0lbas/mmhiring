import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      );
    }

    // Проверка типа файла (только изображения)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Разрешены только изображения' },
        { status: 400 }
      );
    }
    
    // Создаем уникальное имя файла
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Путь для сохранения
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Проверяем существование директории
    try {
      await fs.access(uploadDir);
      console.log('Директория для загрузки существует:', uploadDir);
    } catch (err) {
      console.log('Создаем директорию для загрузки:', uploadDir);
      await fs.mkdir(uploadDir, { recursive: true });
    }
    
    // Путь к файлу
    const filePath = path.join(uploadDir, fileName);
    
    // Конвертируем файл в массив байтов и сохраняем
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);
    
    // Проверяем, что файл был успешно сохранен
    try {
      await fs.access(filePath);
      console.log('Файл успешно сохранен:', filePath);
    } catch (err) {
      console.error('Ошибка при проверке сохраненного файла:', err);
      throw new Error('Файл не был сохранен');
    }
    
    // Путь для доступа через API
    const fileUrl = `/api/uploads/${fileName}`;
    console.log('URL файла для сохранения в БД:', fileUrl);
    
    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке файла' },
      { status: 500 }
    );
  }
}
