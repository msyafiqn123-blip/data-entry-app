import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VERIFIKATOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { isVerified, status, catatanVerifikasi } = await req.json();
    const params = await context.params;

    const updatedSpop = await prisma.spopData.update({
      where: { id: params.id },
      data: {
        isVerified,
        status: status || (isVerified ? "TERVERIFIKASI" : "MENUNGGU"),
        catatanVerifikasi: catatanVerifikasi || null,
        verifiedAt: isVerified ? new Date() : null,
        verifiedBy: isVerified ? session.user.username : null,
      },
    });

    return NextResponse.json(updatedSpop);
  } catch (error) {
    console.error("Error verifying SPOP:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
