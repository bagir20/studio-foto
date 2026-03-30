import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";

// POST /api/booking — menerima form booking dari visitor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validasi input pakai Zod (seperti middleware validator di Express)
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data tidak valid", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { clientName, clientEmail, clientPhone, packageId, tierId, date, timeSlot, notes } =
      parsed.data;

    // Cek apakah slot sudah dipesan
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: new Date(date),
        timeSlot,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Slot waktu ini sudah dipesan. Silakan pilih waktu lain." },
        { status: 409 }
      );
    }

    // Simpan booking ke database
    const booking = await prisma.booking.create({
      data: {
        clientName,
        clientEmail,
        clientPhone,
        packageId,
        tierId,
        date: new Date(date),
        timeSlot,
        notes,
        status: "PENDING",
      },
      include: {
        package: { select: { name: true } },
        tier: { select: { name: true, price: true } },
      },
    });

    return NextResponse.json(
      { message: "Booking berhasil! Kami akan menghubungi Anda segera.", data: booking },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/booking]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// GET /api/booking?date=2025-01-15 — cek slot yang sudah terisi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Parameter date diperlukan" }, { status: 400 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        date: new Date(date),
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { timeSlot: true }, // hanya kirim timeSlot, bukan data personal
    });

    const bookedSlots = bookings.map((b) => b.timeSlot);
    return NextResponse.json({ bookedSlots });
  } catch (error) {
    console.error("[GET /api/booking]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
