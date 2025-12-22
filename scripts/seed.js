const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

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

    // Создаем начальный пост, если нет файла с данными
    await prisma.blogPost.create({
      data: {
        title: 'Добро пожаловать в блог MatchMakers!',
        content: 'Это ваш первый пост в блоге. Начните делиться своими мыслями с миром!',
        preview: 'Новая эра найма и подбора технических талантов начинается здесь.',
        image: '',
        date: new Date().toISOString().substring(0, 10)
      }
    });

    console.log(`Успешно добавлен начальный пост в базу данных.`);
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