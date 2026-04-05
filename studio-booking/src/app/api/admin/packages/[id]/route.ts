import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Tier = { name: string; price: number; duration: number; includes: string[] };
type Sample = { imageUrl: string; caption: string; order: number };

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, slug, description, coverImage, isActive, categoryId, tiers, samples } =
      await request.json();

    await prisma.packageTier.deleteMany({ where: { packageId: id } });
    await prisma.packageSample.deleteMany({ where: { packageId: id } });

    const pkg = await prisma.package.update({
      where: { id },
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

    return NextResponse.json({ data: pkg });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal update paket";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.booking.deleteMany({ where: { packageId: id } });
    await prisma.packageTier.deleteMany({ where: { packageId: id } });
    await prisma.packageSample.deleteMany({ where: { packageId: id } });
    await prisma.package.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal hapus paket";
    console.error("[DELETE /api/admin/packages/[id]]", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}