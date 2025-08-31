import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const c = await prisma.user.create({ data: { phone: "+15550000001", role: "CUSTOMER" } });
  await prisma.address.create({ data: { userId: c.id, line: "Main Street 1", city: "Karachi", lat: 24.8607, lng: 67.0011 } });
  for (let i = 0; i < 5; i++) {
    const u = await prisma.user.create({ data: { phone: `+1555000001${i}`, role: "MERCHANT" } });
    await prisma.merchant.create({ data: { userId: u.id, shopName: `Shop ${i}`, isOpen: true, radiusKm: 5 } });
  }
  console.log("seeded");
}

main().finally(() => prisma.$disconnect());
