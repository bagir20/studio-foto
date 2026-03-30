import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/gallery?category=portrait
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const photos = await prisma.galleryPhoto.findMany({
      where: {
        ...(category && { category: { slug: category } }),
      },
      include: {
        category: true,
      },
      orderBy: { order: "asc" },
    });

    const categories = await prisma.galleryCategory.findMany();

    return NextResponse.json({ data: photos, categories });
  } catch (error) {
    console.error("[GET /api/gallery]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
