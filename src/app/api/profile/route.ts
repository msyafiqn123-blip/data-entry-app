import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      role: true,
      kodeKecamatan: true,
      namaKecamatan: true,
      kodeKelurahan: true,
      namaKelurahan: true
    }
  });

  let { kodeKecamatan, kodeKelurahan } = user;

  // Fallback for older accounts where kode wasn't saved in DB
  if (!kodeKecamatan && user.username.toLowerCase() === "ciseureuh") {
    kodeKecamatan = "080";
    kodeKelurahan = "014";
  } else if (!kodeKecamatan && user.username.toLowerCase() === "purwakarta") {
    kodeKecamatan = "080";
  }

  return NextResponse.json({
    ...user,
    kodeKecamatan,
    kodeKelurahan
  });
}
