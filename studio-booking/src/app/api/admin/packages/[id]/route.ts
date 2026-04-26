// app/api/admin/packages/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Tier = { id?: string; name: string; price: number; duration: number; includes: string[] };
type Sample = { id?: string; imageUrl: string; caption: string; order: number };

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, slug, description, coverImage, isActive, categoryId, tiers, samples } =
      await request.json();

    // ── 1. Upsert tiers (update yg ada, create yg baru) ──
    const upsertedTierIds: string[] = [];

    for (const t of tiers as Tier[]) {
      if (t.id) {
        // Update tier yang sudah ada
        const updated = await prisma.packageTier.update({
          where: { id: t.id },
          data: { name: t.name, price: t.price, duration: t.duration, includes: t.includes },
        });
        upsertedTierIds.push(updated.id);
      } else {
        // Buat tier baru
        const created = await prisma.packageTier.create({
          data: {
            packageId: id,
            name: t.name,
            price: t.price,
            duration: t.duration,
            includes: t.includes,
          },
        });
        upsertedTierIds.push(created.id);
      }
    }

    // ── 2. Hapus tier lama HANYA jika tidak ada booking ──
    await prisma.packageTier.deleteMany({
      where: {
        packageId: id,
        id: { notIn: upsertedTierIds },
        bookings: { none: {} }, // ← aman, tidak hapus tier yang masih dipakai booking
      },
    });

    // ── 3. Samples: hapus semua lalu recreate (tidak ada FK ke booking) ──
    await prisma.packageSample.deleteMany({ where: { packageId: id } });

    // ── 4. Update package data ──
    const pkg = await prisma.package.update({
      where: { id },
      data: {
        name, slug, description, coverImage, isActive, categoryId,
        samples: {
          create: (samples ?? []).map((s: Sample) => ({
            imageUrl: s.imageUrl,
            caption: s.caption || null,
            order: s.order,
          })),
        },
      },
    });

    return NextResponse.json({ data: pkg });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal update paket";
    console.error("[PUT /api/admin/packages/[id]]", error);
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