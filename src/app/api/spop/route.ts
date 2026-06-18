import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const where = session.user.role === "ADMIN" || session.user.role === "VERIFIKATOR"
    ? {}
    : { userId: session.user.id };

  const data = await prisma.spopData.findMany({
    where,
    include: {
      user: {
        select: { username: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();

    // Auto-generate No Formulir: YYYY.MMDD.NNN
    const today = new Date();
    // Use local time offset for Indonesia (WIB = UTC+7) or just use server time?
    // NextJS runs on Node. We can just use UTC or simple offset. Let's use simple local.
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const prefix = `${year}.${month}${day}.`;

    // Find the latest form for today to get the sequence number
    const todayStart = new Date(today.setHours(0,0,0,0));
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const countToday = await prisma.spopData.count({
      where: {
        createdAt: {
          gte: todayStart,
          lt: tomorrowStart,
        }
      }
    });

    const sequence = (countToday + 1).toString().padStart(3, '0');
    const autoNoFormulir = `${prefix}${sequence}`;

    let finalNop = data.nop;
    if (data.jenisTransaksi === "Perekaman Data Baru" && finalNop && finalNop.endsWith(".0000.0")) {
      // Create a unique temporary NOP using "T" + sequence for Urut to preserve the Blok
      const nopPrefix = finalNop.substring(0, 18); // "32.16.KEC.KEL.BLK."
      finalNop = `${nopPrefix}T${sequence.padStart(3, '0')}.0`;
    }

    let finalKeteranganBumi = data.nopTetangga 
      ? `NOP Tetangga: ${data.nopTetangga}\n${data.keteranganBumi || ""}`
      : data.keteranganBumi || "";

    if (data.jenisTransaksi === "Penghapusan Data" && data.alasanPenghapusan) {
      let hapusNote = `[ALASAN PENGHAPUSAN: ${data.alasanPenghapusan}]`;
      if (data.alasanPenghapusan === "Double NOP" && data.nopDouble) {
        hapusNote += ` NOP Double: ${data.nopDouble}`;
      }
      finalKeteranganBumi = `${hapusNote}\n${finalKeteranganBumi}`;
    }

    const spopPayload = {
      userId: session.user.id,
      noFormulir: autoNoFormulir,
      jenisTransaksi: data.jenisTransaksi || "Perekaman Data Baru",
      nop: finalNop,
      isPecah: data.isPecah,
      nopAsal: data.nopAsal,
      
      noKtp: data.noKtp,
      kelurahanWp: data.kelurahanWp,
      namaWp: data.namaWp,
      statusWp: data.statusWp,
      npwp: data.npwp,
      jalanWp: data.jalanWp,
      pekerjaan: data.pekerjaan,
      telepon: data.telepon,
      rtRwWp: data.rtRwWp,
      noHp: data.noHp,
      dati2: data.dati2,
      blokKavNoWp: data.blokKavNoWp,
      kodePosWp: data.kodePosWp,

      noPersil: data.noPersil,
      blokKavNoOp: data.blokKavNoOp,
      rtRwOp: data.rtRwOp,
      jalanOp: data.jalanOp,
      statusCabang: data.statusCabang,

      luasBumi: parseFloat(data.luasBumi),
      kodeZnt: data.kodeZnt,
      jenisBumi: data.jenisBumi,
      jenisTanah: data.jenisTanah,
      jenisSurat: data.jenisSurat,
      keteranganBumi: finalKeteranganBumi,
      keteranganBphtb: data.keteranganBphtb,

      latitude: data.latitude,
      longitude: data.longitude,

      nipPendata: session.user.username,
      
      // Reset verification if updated
      isVerified: false,
      status: "MENUNGGU"
    };

    const newSpop = await prisma.spopData.upsert({
      where: { nop: finalNop },
      update: spopPayload,
      create: spopPayload
    });

    return NextResponse.json(newSpop, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "NOP sudah terdaftar. Silakan gunakan Transaksi Pemutakhiran Data jika ingin memperbarui." }, { status: 400 });
    }
    
    let errMsg = "Terjadi kesalahan internal server saat menyimpan SPOP.";
    if (error.name === "PrismaClientValidationError") {
      errMsg = "Data tidak valid! Mohon periksa kembali isian Anda. Pastikan semua kolom wajib (*) telah diisi dan format angka sudah benar (contoh: Luas Bumi tidak boleh kosong).";
    }
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
