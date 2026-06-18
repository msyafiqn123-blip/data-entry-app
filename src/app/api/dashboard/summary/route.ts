import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalSpop, totalLspop, totalSpopVerified, totalLspopVerified] = await Promise.all([
    prisma.spopData.count(),
    prisma.lspopData.count(),
    prisma.spopData.count({ where: { isVerified: true } }),
    prisma.lspopData.count({ where: { isVerified: true } })
  ]);

  const wilayahList = await prisma.wilayah.findMany();
  
  const allSpop = await prisma.spopData.findMany({
    include: {
      user: {
        select: { kodeKecamatan: true, kodeKelurahan: true }
      }
    }
  });

  const regions = wilayahList.map(w => {
    const spopInRegion = allSpop.filter(s => {
      const parts = s.nop.split('.');
      if (parts.length >= 4) {
        return parts[2] === w.kodeKecamatan && parts[3] === w.kodeKelurahan;
      }
      return s.user?.kodeKecamatan === w.kodeKecamatan && s.user?.kodeKelurahan === w.kodeKelurahan;
    });
    
    return {
      kodeKecamatan: w.kodeKecamatan,
      kodeKelurahan: w.kodeKelurahan,
      kecamatan: w.namaKecamatan,
      kelurahan: w.namaKelurahan,
      totalInput: spopInRegion.length,
      totalVerified: spopInRegion.filter(s => s.isVerified).length
    };
  }).sort((a, b) => b.totalInput - a.totalInput);

  return NextResponse.json({
    totalSpop,
    totalLspop,
    totalSpopVerified,
    totalLspopVerified,
    regions
  });
}
