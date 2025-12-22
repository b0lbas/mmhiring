const { PrismaClient } = require('@prisma/client');
const { promises: fs } = require('fs');
const path = require('path');

// Используем localhost для локального запуска, если DATABASE_URL не установлен
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/matchmakers?schema=public';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

async function main() {
  console.log('Проверяем загруженные картинки...\n');

  try {
    // Получаем всех клиентов из базы данных
    const existingClients = await prisma.client.findMany();
    console.log(`В базе данных найдено ${existingClients.length} клиентов.`);

    // Получаем все файлы из папки uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const files = await fs.readdir(uploadsDir);
    const imageFiles = files.filter(file => 
      /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file)
    );

    console.log(`В папке uploads найдено ${imageFiles.length} изображений.\n`);

    // Создаем Set из имен файлов существующих клиентов
    const existingLogos = new Set();
    existingClients.forEach(client => {
      // Извлекаем имя файла из пути
      const logoPath = client.logo;
      if (logoPath.includes('/uploads/')) {
        const filename = logoPath.split('/uploads/')[1] || logoPath.split('/api/uploads/')[1];
        if (filename) {
          existingLogos.add(filename);
        }
      }
    });

    // Находим файлы, которые не используются клиентами
    const unusedFiles = imageFiles.filter(file => !existingLogos.has(file));

    if (unusedFiles.length === 0) {
      console.log('✓ Все загруженные картинки уже связаны с клиентами в базе данных.');
      return;
    }

    console.log(`Найдено ${unusedFiles.length} неиспользуемых картинок:\n`);
    unusedFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });

    console.log('\nДобавляем этих клиентов в базу данных...\n');

    // Получаем максимальный порядок для новых клиентов
    const maxOrder = existingClients.length > 0 
      ? Math.max(...existingClients.map(c => c.order || 0))
      : 0;

    // Добавляем клиентов для каждого неиспользуемого файла
    for (let i = 0; i < unusedFiles.length; i++) {
      const file = unusedFiles[i];
      const logoPath = `/api/uploads/${file}`;
      const order = maxOrder + i + 1;
      
      // Создаем имя клиента на основе имени файла (убираем расширение)
      const nameWithoutExt = file.replace(/\.[^/.]+$/, '');
      const clientName = `Клиент ${order}`;

      try {
        const newClient = await prisma.client.create({
          data: {
            name: clientName,
            logo: logoPath,
            website: null,
            active: true,
            order: order
          }
        });
        console.log(`✓ Добавлен клиент: ${clientName} (${file})`);
      } catch (error) {
        console.error(`✗ Ошибка при добавлении клиента для ${file}:`, error.message);
      }
    }

    console.log(`\n✓ Успешно добавлено ${unusedFiles.length} новых клиентов в базу данных.`);
    console.log('Вы можете отредактировать их названия в админ-панели (/admin/blog).\n');

  } catch (error) {
    console.error('Ошибка при проверке файлов:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
