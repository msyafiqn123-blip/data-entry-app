import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("Mulai memproses auto-generate akun kelurahan...");

  const wilayahs = await prisma.wilayah.findMany();
  let createdCount = 0;
  let skippedCount = 0;

  for (const w of wilayahs) {
    // Generate username: lowercase, remove spaces
    const rawUsername = w.namaKelurahan.toLowerCase().replace(/\s+/g, '');
    
    // Ensure no duplicates by checking first
    const existing = await prisma.user.findUnique({
      where: { username: rawUsername }
    });

    if (existing) {
      skippedCount++;
      continue;
    }

    const password = `${rawUsername}123`;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username: rawUsername,
        password: hashedPassword,
        role: "INPUTTER",
        kodeKecamatan: w.kodeKecamatan,
        namaKecamatan: w.namaKecamatan,
        kodeKelurahan: w.kodeKelurahan,
        namaKelurahan: w.namaKelurahan
      }
    });
    
    createdCount++;
  }

  console.log(`Selesai! Berhasil membuat ${createdCount} akun baru. Dilewati: ${skippedCount} (sudah ada).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
