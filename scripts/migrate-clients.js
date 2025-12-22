const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const initialClients = [
  { name: 'FERMATA', logo: '/logos/Group 14.png', order: 1 },
  { name: 'PIXWARD GAMES', logo: '/logos/Group 15.png', order: 2 },
  { name: 'REASK', logo: '/logos/Group 16.png', order: 3 },
  { name: 'PROMETHEAN AI', logo: '/logos/Group 17.png', order: 4 },
  { name: 'JOYTERACTIVE', logo: '/logos/Group 18.png', order: 5 },
  { name: 'MACHINET', logo: '/logos/Group 19.png', order: 6 },
  { name: 'FightVR.ai', logo: '/logos/Group 20.png', order: 7 },
  { name: 'SLEEPAGOTCHI', logo: '/logos/Group 21.png', order: 8 },
];

async function main() {
  console.log('Начинаем миграцию клиентов...');

  try {
    // Проверяем, есть ли уже клиенты в базе
    const existingClientsCount = await prisma.client.count();
    
    if (existingClientsCount > 0) {
      console.log(`База данных уже содержит ${existingClientsCount} клиентов. Пропускаем миграцию.`);
      return;
    }

    // Добавляем клиентов в базу
    for (const client of initialClients) {
      await prisma.client.create({
        data: {
          name: client.name,
          logo: client.logo,
          website: null,
          active: true,
          order: client.order
        }
      });
      console.log(`✓ Добавлен клиент: ${client.name}`);
    }

    console.log(`\nУспешно добавлено ${initialClients.length} клиентов в базу данных.`);
  } catch (error) {
    console.error('Ошибка при миграции клиентов:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 