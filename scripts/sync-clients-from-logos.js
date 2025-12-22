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
  console.log('Синхронизируем клиентов с файлами из public/logos...\n');

  try {
    // Шаг 1: Получаем все файлы из папки logos
    const logosDir = path.join(process.cwd(), 'public', 'logos');
    const logoFiles = await fs.readdir(logosDir);
    const imageFiles = logoFiles.filter(file => 
      /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file)
    ).sort();

    console.log(`В папке logos найдено ${imageFiles.length} изображений:\n`);
    imageFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });

    // Шаг 2: Получаем всех клиентов из базы данных
    const existingClients = await prisma.client.findMany({
      orderBy: { order: 'asc' }
    });
    console.log(`\nВ базе данных найдено ${existingClients.length} клиентов.\n`);

    // Шаг 3: Создаем Map из клиентов по имени файла логотипа
    const clientsByLogoFile = new Map();
    existingClients.forEach(client => {
      const logoPath = client.logo;
      if (logoPath.includes('/logos/')) {
        const filename = logoPath.split('/logos/')[1];
        if (filename) {
          clientsByLogoFile.set(filename, client);
        }
      }
    });

    // Шаг 4: Находим файлы, которые не связаны с клиентами
    const missingFiles = imageFiles.filter(file => !clientsByLogoFile.has(file));

    if (missingFiles.length > 0) {
      console.log(`Найдено ${missingFiles.length} файлов без клиентов:\n`);
      missingFiles.forEach((file, index) => {
        console.log(`${index + 1}. ${file}`);
      });

      // Добавляем клиентов для недостающих файлов
      console.log('\nДобавляем недостающих клиентов...\n');
      const maxOrder = existingClients.length > 0 
        ? Math.max(...existingClients.map(c => c.order || 0))
        : 0;

      for (let i = 0; i < missingFiles.length; i++) {
        const file = missingFiles[i];
        const logoPath = `/logos/${file}`;
        const order = maxOrder + i + 1;
        
        // Создаем имя клиента на основе имени файла
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
    } else {
      console.log('✓ Все файлы из папки logos уже связаны с клиентами.\n');
    }

    // Шаг 5: Проверяем клиентов, которые ссылаются на несуществующие файлы
    const allClients = await prisma.client.findMany();
    const clientsWithMissingFiles = [];

    for (const client of allClients) {
      if (client.logo.includes('/logos/')) {
        const filename = client.logo.split('/logos/')[1];
        if (!imageFiles.includes(filename)) {
          clientsWithMissingFiles.push(client);
        }
      }
    }

    if (clientsWithMissingFiles.length > 0) {
      console.log(`\nНайдено ${clientsWithMissingFiles.length} клиентов с несуществующими файлами:\n`);
      clientsWithMissingFiles.forEach(client => {
        const filename = client.logo.split('/logos/')[1];
        console.log(`- ${client.name} ссылается на несуществующий файл: ${filename}`);
      });
      console.log('\nЭти клиенты останутся в базе, но файлы не найдены.');
    }

    // Финальная статистика
    const finalClients = await prisma.client.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    console.log(`\n✓ Синхронизация завершена!`);
    console.log(`Активных клиентов в базе данных: ${finalClients.length}`);
    console.log(`Файлов в папке logos: ${imageFiles.length}\n`);

    // Показываем список всех активных клиентов
    if (finalClients.length > 0) {
      console.log('Активные клиенты на сайте:\n');
      finalClients.forEach((client, index) => {
        const filename = client.logo.includes('/logos/') 
          ? client.logo.split('/logos/')[1] 
          : client.logo;
        console.log(`${index + 1}. ${client.name} (${filename})`);
      });
    }

  } catch (error) {
    console.error('Ошибка при синхронизации:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();


