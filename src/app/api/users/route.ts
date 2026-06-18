import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true, namaKecamatan: true, namaKelurahan: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username, password, role, kodeKecamatan, namaKecamatan, kodeKelurahan, namaKelurahan } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        username, 
        password: hashedPassword, 
        role,
        kodeKecamatan,
        namaKecamatan,
        kodeKelurahan,
        namaKelurahan
      },
    });
    return NextResponse.json({ id: user.id, username: user.username, role: user.role });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  // Prevent self-deletion
  if (id === session.user.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, password } = await req.json();
    if (!id || !password) {
      return NextResponse.json({ error: "Missing ID or password" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update password" }, { status: 400 });
  }
}
