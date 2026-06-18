import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const res = await prisma.user.updateMany({
    where: { role: 'INPUTTER' },
    data: { role: 'PENDATA' }
  });
  console.log(`Updated ${res.count} users from INPUTTER to PENDATA`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
