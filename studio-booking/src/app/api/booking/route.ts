import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";

// Kirim notif WA ke admin via Fonnte
async function sendWhatsAppNotif(booking: {
  clientName: string;
  clientPhone: string;
  packageName: string;
  tierName: string;
  date: Date;
  timeSlot: string;
  notes?: string | null;
}) {
  const token = process.env.FONNTE_TOKEN;
  const adminNumber = process.env.WHATSAPP_ADMIN;
  if (!token || !adminNumber) return;

  const tanggal = booking.date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const message = [
  `BOOKING BARU - WanPicture Studio`,
  ``,
  `Nama     : ${booking.clientName}`,
  `WA       : ${booking.clientPhone}`,
  `Paket    : ${booking.packageName}`,
  `Tier     : ${booking.tierName}`,
  `Tanggal  : ${tanggal}`,
  `Jam      : ${booking.timeSlot}`,
  booking.notes ? `Catatan  : ${booking.notes}` : null,
  ``,
  `Dashboard: ${appUrl}/admin/bookings`,
]
  .filter(Boolean)
  .join("\n");

  try {
    await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { Authorization: token },
      body: new URLSearchParams({
        target: adminNumber,
        message,
      }),
    });
  } catch (err) {
    // Jangan crash server kalau notif gagal
    console.error("[Fonnte] Gagal kirim notif WA:", err);
  }
}

// POST /api/booking — menerima form booking dari visitor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data tidak valid", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { clientName, clientEmail, clientPhone, packageId, tierId, date, timeSlot, notes } =
      parsed.data;

    // Cek slot sudah dipesan
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

    // Simpan booking
    const booking = await prisma.booking.create({
      data: {
        clientName,
        clientEmail: clientEmail ?? "",
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

    // Kirim notif WA ke admin (tidak await — tidak bloking response)
    sendWhatsAppNotif({
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      packageName: booking.package.name,
      tierName: booking.tier.name,
      date: booking.date,
      timeSlot: booking.timeSlot,
      notes: booking.notes,
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
      select: { timeSlot: true },
    });

    const bookedSlots = bookings.map((b) => b.timeSlot);
    return NextResponse.json({ bookedSlots });
  } catch (error) {
    console.error("[GET /api/booking]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}