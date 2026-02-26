import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@imobiliario.com' },
    update: {},
    create: {
      email: 'admin@imobiliario.com',
      password: hashedPassword,
      name: 'Administrador Master',
      role: 'ADMIN',
    },
  });

  console.log('Usuário ADMIN criado:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
