import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const wils = await prisma.wilayah.findMany();
  const users = await prisma.user.findMany();
  
  const missing = wils.filter(w => !users.some(u => u.kodeKecamatan === w.kodeKecamatan && u.kodeKelurahan === w.kodeKelurahan));
  
  console.log('Missing count:', missing.length);
  
  for (const w of missing) {
    const baseName = w.namaKelurahan.toLowerCase().replace(/\s+/g, '');
    const kecName = w.namaKecamatan.toLowerCase().replace(/\s+/g, '');
    const rawUsername = `${baseName}_${kecName}`;
    
    console.log(`Membuat akun: ${rawUsername}`);
    
    const password = `${rawUsername}123`;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username: rawUsername,
        password: hashedPassword,
        role: "PENDATA",
        kodeKecamatan: w.kodeKecamatan,
        namaKecamatan: w.namaKecamatan,
        kodeKelurahan: w.kodeKelurahan,
        namaKelurahan: w.namaKelurahan
      }
    });
  }
  
  console.log("Selesai memperbaiki akun yang hilang.");
}

main().catch(console.error).finally(()=>prisma.$disconnect());
