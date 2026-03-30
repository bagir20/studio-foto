import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/packages?category=wedding
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category"); // filter by slug kategori

    const packages = await prisma.package.findMany({
      where: {
        isActive: true,
        ...(category && { category: { slug: category } }),
      },
      include: {
        category: true,
        tiers: {
          orderBy: { price: "asc" },
        },
        samples: {
          orderBy: { order: "asc" },
          take: 4, // preview 4 foto saja untuk list
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: packages });
  } catch (error) {
    console.error("[GET /api/packages]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
