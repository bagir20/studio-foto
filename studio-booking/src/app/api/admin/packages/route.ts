import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Tier = { name: string; price: number; duration: number; includes: string[] };
type Sample = { imageUrl: string; caption: string; order: number };

export async function POST(request: NextRequest) {
  try {
    const { name, slug, description, coverImage, isActive, categoryId, tiers, samples } =
      await request.json();

    const pkg = await prisma.package.create({
      data: {
        name, slug, description, coverImage, isActive, categoryId,
        tiers: {
          create: tiers.map((t: Tier) => ({
            name: t.name, price: t.price, duration: t.duration, includes: t.includes,
          })),
        },
        samples: {
          create: (samples ?? []).map((s: Sample) => ({
            imageUrl: s.imageUrl, caption: s.caption || null, order: s.order,
          })),
        },
      },
    });

    return NextResponse.json({ data: pkg }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal membuat paket";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}