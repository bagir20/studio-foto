import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, caption, categoryId } = await request.json();

    if (!imageUrl || !categoryId) {
      return NextResponse.json({ error: "imageUrl dan categoryId wajib diisi" }, { status: 400 });
    }

    // Hitung order terakhir untuk kategori ini
    const lastPhoto = await prisma.galleryPhoto.findFirst({
      where: { categoryId },
      orderBy: { order: "desc" },
    });

    const photo = await prisma.galleryPhoto.create({
      data: {
        imageUrl,
        caption: caption || null,
        categoryId,
        order: (lastPhoto?.order ?? 0) + 1,
      },
      include: { category: true },
    });

    return NextResponse.json({ data: photo }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal menambah foto";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
