const { PrismaClient } = require('@prisma/client');

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
  console.log('Обновляем замененный логотип...\n');

  try {
    // Находим клиента, который ссылается на несуществующий файл Group 22.png
    const clientWithOldLogo = await prisma.client.findFirst({
      where: {
        logo: {
          contains: 'Group 22.png'
        }
      }
    });

    if (clientWithOldLogo) {
      console.log(`Найден клиент с замененным файлом:`);
      console.log(`- ID: ${clientWithOldLogo.id}`);
      console.log(`- Название: ${clientWithOldLogo.name}`);
      console.log(`- Старый логотип: ${clientWithOldLogo.logo}\n`);

      // Обновляем на новый файл Group 27.png
      const updatedClient = await prisma.client.update({
        where: { id: clientWithOldLogo.id },
        data: {
          logo: '/logos/Group 27.png'
        }
      });

      console.log(`✓ Обновлен логотип клиента "${updatedClient.name}"`);
      console.log(`  Новый логотип: ${updatedClient.logo}\n`);

      // Удаляем дубликат клиента 12, если он был создан
      const duplicateClient = await prisma.client.findFirst({
        where: {
          logo: '/logos/Group 27.png',
          id: {
            not: updatedClient.id
          }
        }
      });

      if (duplicateClient) {
        await prisma.client.delete({
          where: { id: duplicateClient.id }
        });
        console.log(`✓ Удален дубликат клиента "${duplicateClient.name}" (ID: ${duplicateClient.id})\n`);
      }
    } else {
      console.log('Клиент с Group 22.png не найден.\n');
    }

    // Финальная проверка
    const allClients = await prisma.client.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });

    console.log(`✓ Всего активных клиентов: ${allClients.length}\n`);
    console.log('Список всех активных клиентов:\n');
    allClients.forEach((client, index) => {
      const filename = client.logo.includes('/logos/') 
        ? client.logo.split('/logos/')[1] 
        : client.logo;
      console.log(`${index + 1}. ${client.name} (${filename})`);
    });

  } catch (error) {
    console.error('Ошибка при обновлении:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();


