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
  
  const spopGroupedByKecKel = await prisma.spopData.groupBy({
    by: ['nop'],
    _count: { nop: true },
  });

  const spopVerifiedGrouped = await prisma.spopData.groupBy({
    by: ['nop'],
    where: { isVerified: true },
    _count: { nop: true },
  });

  const regions = wilayahList.map(w => {
    // Count SPOP that belongs to this wilayah based on NOP (parts[2] === kodeKecamatan, parts[3] === kodeKelurahan)
    let totalInput = 0;
    let totalVerified = 0;

    spopGroupedByKecKel.forEach(group => {
      const parts = group.nop.split('.');
      if (parts.length >= 4 && parts[2] === w.kodeKecamatan && parts[3] === w.kodeKelurahan) {
        totalInput += group._count.nop;
      }
    });

    spopVerifiedGrouped.forEach(group => {
      const parts = group.nop.split('.');
      if (parts.length >= 4 && parts[2] === w.kodeKecamatan && parts[3] === w.kodeKelurahan) {
        totalVerified += group._count.nop;
      }
    });

    return {
      kodeKecamatan: w.kodeKecamatan,
      kodeKelurahan: w.kodeKelurahan,
      kecamatan: w.namaKecamatan,
      kelurahan: w.namaKelurahan,
      totalInput,
      totalVerified
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
