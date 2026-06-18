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

  const data = await prisma.lspopData.findMany({
    where,
    include: {
      spop: true,
      user: {
        select: { username: true, namaKecamatan: true, namaKelurahan: true }
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
      const { 
        nop, 
        noBangunan,
        jenisBangunan,
        luasBangunan,
        jumlahLantai,
        tahunDibangun,
        kondisiBangunan,
        konstruksi,
        atap,
        dinding,
        lantai,
        langitLangit,
        dayaListrik,
        tahunRenovasi
      } = data;
  
      // Try to find the SPOP (optional now)
      const spop = await prisma.spopData.findUnique({
        where: { nop }
      });
  
      // Auto-generate No Formulir: YYYY.MMDD.NNN
      const today = new Date();
      const year = today.getFullYear().toString();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      const prefix = `${year}.${month}${day}.`;
  
      const todayStart = new Date(today.setHours(0,0,0,0));
      const tomorrowStart = new Date(todayStart);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  
      const where = session.user.role === "ADMIN" || session.user.role === "VERIFIKATOR"
        ? {}
        : { userId: session.user.id };

      const countToday = await prisma.lspopData.count({
        where: {
          createdAt: {
            gte: todayStart,
            lt: tomorrowStart,
          }
        }
      });
  
      const sequence = (countToday + 1).toString().padStart(3, '0');
      const autoNoFormulir = `${prefix}${sequence}`;

      const lspop = await prisma.lspopData.create({
        data: {
          nop: nop,
          spopId: spop ? spop.id : null,
          noFormulir: autoNoFormulir,
          noBangunan: parseInt(noBangunan),
          jenisBangunan,
          luasBangunan: parseFloat(luasBangunan),
          jumlahLantai: parseInt(jumlahLantai),
          tahunDibangun: parseInt(tahunDibangun),
          kondisiBangunan,
          konstruksi,
          atap,
          dinding,
          lantai,
          langitLangit,
          dayaListrik,
          tahunRenovasi: tahunRenovasi ? parseInt(tahunRenovasi) : null,
          userId: session.user.id
        }
      });
  
      return NextResponse.json({ success: true, id: lspop.id, noFormulir: autoNoFormulir });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
       return NextResponse.json({ error: "Data LSPOP untuk bangunan ini sudah ada." }, { status: 400 });
    }
    
    let errMsg = "Terjadi kesalahan internal server saat menyimpan LSPOP.";
    if (error.name === "PrismaClientValidationError") {
      errMsg = "Data tidak valid! Mohon periksa kembali isian Anda. Pastikan semua angka diisi dengan benar (tidak boleh kosong pada form wajib).";
    }
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
