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
  const spop = await prisma.spopData.findUnique({
    where: { id }
  });

  if (!spop) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.user.role !== "ADMIN" && session.user.role !== "VERIFIKATOR" && spop.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(spop);
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const spop = await prisma.spopData.findUnique({ where: { id } });
  if (!spop) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.user.role !== "ADMIN" && session.user.role !== "VERIFIKATOR" && spop.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const updated = await prisma.spopData.update({
      where: { id },
      data: {
        jenisTransaksi: data.jenisTransaksi,
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
        keteranganBumi: data.keteranganBumi,
        keteranganBphtb: data.keteranganBphtb,
        
        latitude: data.latitude,
        longitude: data.longitude,

        nipPendata: data.nipPendata,
        status: session.user.role === "PENDATA" ? "MENUNGGU" : (data.status !== undefined ? data.status : undefined),
        catatanVerifikasi: session.user.role === "PENDATA" ? "" : (data.catatanVerifikasi !== undefined ? data.catatanVerifikasi : undefined)
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
  const spop = await prisma.spopData.findUnique({ where: { id } });
  if (!spop) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.user.role !== "ADMIN" && session.user.role !== "VERIFIKATOR" && spop.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete LSPOPs first
    await prisma.lspopData.deleteMany({ where: { spopId: id } });
    await prisma.spopData.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
