import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = [];
  for (let i = 0; i < 10000; i++) {
    users.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      password: 'password123', // En una aplicación real, esto debería ser un hash
    });
  }
  await prisma.user.createMany({
    data: users,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


  