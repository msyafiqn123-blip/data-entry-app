import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SPOP & LSPOP forms...");

  // Seed SPOP
  await prisma.form.create({
    data: {
      title: "SPOP (Surat Pemberitahuan Objek Pajak)",
      description: "Formulir pendataan data bumi / tanah",
      fields: {
        create: [
          { label: "Nomor Formulir", type: "TEXT", required: true, order: 0 },
          { label: "NOP (Nomor Objek Pajak)", type: "TEXT", required: true, order: 1 },
          { label: "Nama Wajib Pajak", type: "TEXT", required: true, order: 2 },
          { label: "Jalan Objek Pajak", type: "TEXT", required: true, order: 3 },
          { label: "RT/RW Objek Pajak", type: "TEXT", required: false, order: 4 },
          { label: "Luas Bumi (m2)", type: "NUMBER", required: true, order: 5 },
          { label: "Kelas Bumi / ZNT", type: "TEXT", required: false, order: 6 },
          { label: "NIP Pendata", type: "TEXT", required: true, order: 7 },
        ]
      }
    }
  });

  // Seed LSPOP
  await prisma.form.create({
    data: {
      title: "LSPOP (Lampiran Surat Pemberitahuan Objek Pajak)",
      description: "Formulir pendataan detail bangunan",
      fields: {
        create: [
          { label: "NOP (Nomor Objek Pajak)", type: "TEXT", required: true, order: 0 },
          { label: "Bangunan Ke", type: "NUMBER", required: true, order: 1 },
          { label: "Jenis Penggunaan Bangunan", type: "SELECT", required: true, options: "Perumahan,Perkantoran,Pabrik,Toko/Apotek/Pasar/Ruko,Rumah Sakit,Olahraga/Rekreasi", order: 2 },
          { label: "Luas Bangunan (m2)", type: "NUMBER", required: true, order: 3 },
          { label: "Jumlah Lantai", type: "NUMBER", required: true, order: 4 },
          { label: "Tahun Dibangun", type: "NUMBER", required: true, order: 5 },
          { label: "Kondisi Bangunan", type: "SELECT", required: true, options: "Sangat Baik,Baik,Sedang,Jelek", order: 6 },
          { label: "Konstruksi", type: "SELECT", required: true, options: "Baja,Beton,Batu Bata,Kayu", order: 7 },
        ]
      }
    }
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
