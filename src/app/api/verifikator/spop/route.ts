import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VERIFIKATOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  try {
    let whereCondition: any = {};
    if (status === 'verified') {
      whereCondition.isVerified = true;
    } else if (status === 'unverified') {
      whereCondition.isVerified = false;
    }

    const spops = await prisma.spopData.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { username: true } },
      },
    });

    return NextResponse.json(spops);
  } catch (error) {
    console.error("Error fetching SPOP data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
