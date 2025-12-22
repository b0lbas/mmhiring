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
  console.log('Исправляем клиентов: используем только файлы из public/logos\n');

  try {
    // Шаг 1: Удаляем всех клиентов, которые ссылаются на файлы из uploads
    console.log('Шаг 1: Удаляем клиентов из папки uploads...\n');
    const allClients = await prisma.client.findMany();
    const clientsFromUploads = allClients.filter(client => 
      client.logo.includes('/uploads/') || client.logo.includes('/api/uploads/')
    );

    if (clientsFromUploads.length > 0) {
      console.log(`Найдено ${clientsFromUploads.length} клиентов из папки uploads для удаления:\n`);
      for (const client of clientsFromUploads) {
        await prisma.client.delete({
          where: { id: client.id }
        });
        console.log(`✗ Удален клиент: ${client.name} (${client.logo})`);
      }
      console.log(`\n✓ Удалено ${clientsFromUploads.length} клиентов из папки uploads.\n`);
    } else {
      console.log('✓ Клиентов из папки uploads не найдено.\n');
    }

    // Шаг 2: Получаем все файлы из папки logos
    console.log('Шаг 2: Проверяем файлы из папки logos...\n');
    const logosDir = path.join(process.cwd(), 'public', 'logos');
    const logoFiles = await fs.readdir(logosDir);
    const imageFiles = logoFiles.filter(file => 
      /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file)
    );

    console.log(`В папке logos найдено ${imageFiles.length} изображений:\n`);
    imageFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });

    // Шаг 3: Получаем всех оставшихся клиентов из базы
    const remainingClients = await prisma.client.findMany();
    console.log(`\nВ базе данных осталось ${remainingClients.length} клиентов из папки logos.\n`);

    // Создаем Set из имен файлов существующих клиентов
    const existingLogos = new Set();
    remainingClients.forEach(client => {
      // Извлекаем имя файла из пути (может быть /logos/filename.png)
      const logoPath = client.logo;
      if (logoPath.includes('/logos/')) {
        const filename = logoPath.split('/logos/')[1];
        if (filename) {
          existingLogos.add(filename);
        }
      }
    });

    // Находим файлы из logos, которые не используются клиентами
    const unusedLogoFiles = imageFiles.filter(file => !existingLogos.has(file));

    if (unusedLogoFiles.length === 0) {
      console.log('✓ Все файлы из папки logos уже связаны с клиентами в базе данных.\n');
      return;
    }

    console.log(`Найдено ${unusedLogoFiles.length} файлов из logos, которые нужно добавить:\n`);
    unusedLogoFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });

    // Шаг 4: Добавляем клиентов для каждого неиспользуемого файла из logos
    console.log('\nШаг 3: Добавляем клиентов из папки logos...\n');

    // Получаем максимальный порядок для новых клиентов
    const maxOrder = remainingClients.length > 0 
      ? Math.max(...remainingClients.map(c => c.order || 0))
      : 0;

    // Добавляем клиентов для каждого неиспользуемого файла
    for (let i = 0; i < unusedLogoFiles.length; i++) {
      const file = unusedLogoFiles[i];
      const logoPath = `/logos/${file}`;
      const order = maxOrder + i + 1;
      
      // Создаем имя клиента на основе имени файла (убираем расширение и пробелы)
      const nameWithoutExt = file.replace(/\.[^/.]+$/, '').replace(/Group\s+/, '');
      const clientName = nameWithoutExt === 'gismart' ? 'GISMART' : `Клиент ${order}`;

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

    console.log(`\n✓ Успешно добавлено ${unusedLogoFiles.length} новых клиентов из папки logos.`);
    console.log('Вы можете отредактировать их названия в админ-панели (/admin/blog).\n');

    // Финальная статистика
    const finalClients = await prisma.client.findMany();
    console.log(`\nИтого клиентов в базе данных: ${finalClients.length}`);
    console.log('Все клиенты теперь из папки logos.\n');

  } catch (error) {
    console.error('Ошибка при исправлении клиентов:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();



