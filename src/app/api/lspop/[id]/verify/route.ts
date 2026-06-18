import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VERIFIKATOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { isVerified } = await req.json();
    const params = await context.params;

    const updatedLspop = await prisma.lspopData.update({
      where: { id: params.id },
      data: {
        isVerified,
        verifiedAt: isVerified ? new Date() : null,
        verifiedBy: isVerified ? session.user.username : null,
      },
    });

    return NextResponse.json(updatedLspop);
  } catch (error) {
    console.error("Error verifying LSPOP:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
