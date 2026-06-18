import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const wils = await prisma.wilayah.findMany();
  const users = await prisma.user.findMany();
  
  const missing = wils.filter(w => !users.some(u => u.kodeKecamatan === w.kodeKecamatan && u.kodeKelurahan === w.kodeKelurahan));
  
  console.log('Missing count:', missing.length);
  if(missing.length > 0) {
    console.log(missing.map(m => m.namaKelurahan));
  }
  
  const otherRoles = users.filter(u => u.kodeKelurahan && u.role !== 'PENDATA');
  console.log('Other roles count:', otherRoles.length);
  if(otherRoles.length > 0) {
    console.log(otherRoles.map(o => o.username + ' (' + o.role + ')'));
  }
}

main().catch(console.error).finally(()=>prisma.$disconnect());
