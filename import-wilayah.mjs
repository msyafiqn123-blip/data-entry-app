import { PrismaClient } from '@prisma/client';
import xlsx from 'xlsx';

const prisma = new PrismaClient();

async function main() {
  console.log("Membaca file Excel Desa Kelurahan.xlsx...");
  const workbook = xlsx.readFile('C:/Users/msyaf/Downloads/Desa Kelurahan.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Format assumed: 
  // Row 0: Headers (e.g. Kode Kecamatan, Nama Kecamatan, Kode Kelurahan, Nama Kelurahan)
  // Rows > 0: Data
  
  let insertedCount = 0;

  // If there are no headers and it starts directly from row 0, adapt accordingly
  // We will assume row 0 is header.
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 3) continue;
    
    const namaKec = String(row[0] || "").trim();
    const namaKel = String(row[1] || "").trim();
    const nopPrefix = String(row[2] || "").trim(); // e.g. "32.16.010.006."

    if (!namaKec || !namaKel || !nopPrefix) continue;

    const parts = nopPrefix.split(".");
    if (parts.length < 4) continue;

    const kodeKec = parts[2];
    const kodeKel = parts[3];

    await prisma.wilayah.upsert({
      where: {
        kodeKecamatan_kodeKelurahan: {
          kodeKecamatan: kodeKec,
          kodeKelurahan: kodeKel,
        }
      },
      update: {
        namaKecamatan: namaKec,
        namaKelurahan: namaKel,
      },
      create: {
        kodeKecamatan: kodeKec,
        namaKecamatan: namaKec,
        kodeKelurahan: kodeKel,
        namaKelurahan: namaKel,
      }
    });
    insertedCount++;
  }

  console.log(`Berhasil memproses ${insertedCount} data wilayah.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
