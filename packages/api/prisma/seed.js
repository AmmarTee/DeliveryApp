import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { phone: '923001112223' },
    update: {},
    create: { phone: '923001112223', name: 'Admin' }
  });

  const merchant = await prisma.merchant.upsert({
    where: { id: '00000000-0000-0000-0000-000000000010' },
    update: {},
    create: { id: '00000000-0000-0000-0000-000000000010', name: 'Sample Merchant', rating: 5 }
  });

  console.log({ admin, merchant });
}

main().finally(() => prisma.$disconnect());
