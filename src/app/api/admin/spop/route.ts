import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VERIFIKATOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const spopData = await prisma.spopData.findMany({
    include: {
      user: {
        select: { username: true, namaKecamatan: true, namaKelurahan: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(spopData);
}
