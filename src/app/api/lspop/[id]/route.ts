import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const lspop = await prisma.lspopData.findUnique({
    where: { id },
    include: { spop: true }
  });

  if (!lspop) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.user.role !== "ADMIN" && session.user.role !== "VERIFIKATOR" && lspop.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(lspop);
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const lspop = await prisma.lspopData.findUnique({ where: { id } });
  if (!lspop) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.user.role !== "ADMIN" && session.user.role !== "VERIFIKATOR" && lspop.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const updated = await prisma.lspopData.update({
      where: { id },
      data: {
        noBangunan: parseInt(data.noBangunan),
        jenisBangunan: data.jenisBangunan,
        luasBangunan: parseFloat(data.luasBangunan),
        jumlahLantai: parseInt(data.jumlahLantai),
        tahunDibangun: parseInt(data.tahunDibangun),
        kondisiBangunan: data.kondisiBangunan,
        konstruksi: data.konstruksi,
        atap: data.atap,
        dinding: data.dinding,
        lantai: data.lantai,
        langitLangit: data.langitLangit,
        dayaListrik: data.dayaListrik,
        tahunRenovasi: data.tahunRenovasi ? parseInt(data.tahunRenovasi) : null
      }
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const lspop = await prisma.lspopData.findUnique({ where: { id } });
  if (!lspop) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.user.role !== "ADMIN" && lspop.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.lspopData.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
