import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: "Nama kategori wajib diisi" }, { status: 400 });

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const category = await prisma.galleryCategory.create({
      data: { name, slug },
    });
    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah kategori" }, { status: 500 });
  }
}