import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log(`Начинаем заполнение базы данных...`);

  try {
    // Проверяем, есть ли уже посты в базе
    const postsCount = await prisma.blogPost.count();
    
    if (postsCount > 0) {
      console.log(`База данных уже содержит ${postsCount} постов. Пропускаем заполнение.`);
      return;
    }

    // Путь к JSON файлу с начальными данными
    const dataPath = path.join(process.cwd(), 'data', 'blog-posts.json');
    
    // Читаем файл с начальными данными
    const rawData = readFileSync(dataPath, 'utf8');
    const posts = JSON.parse(rawData);

    // Добавляем посты в базу
    for (const post of posts) {
      await prisma.blogPost.create({
        data: {
          title: post.title,
          content: post.content,
          preview: post.preview || post.content.substring(0, 100) + '...',
          image: post.image || '',
          date: post.date || new Date().toISOString().substring(0, 10)
        }
      });
    }

    console.log(`Успешно добавлено ${posts.length} постов в базу данных.`);
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
