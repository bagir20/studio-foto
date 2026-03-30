import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDuration } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export const metadata: Metadata = {
  title: "Booking Berhasil",
};

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function KonfirmasiPage({ searchParams }: Props) {
  const { id } = await searchParams;

  if (!id) notFound();

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      package: true,
      tier: true,
    },
  });

  if (!booking) notFound();

  const formattedDate = format(new Date(booking.date), "EEEE, d MMMM yyyy", {
    locale: localeId,
  });

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-stone-950 pt-16 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h1 className="text-4xl font-bold text-white">Booking Diterima!</h1>
          <p className="text-stone-400 text-lg max-w-sm mx-auto">
            Terima kasih! Kami akan konfirmasi via WhatsApp dalam 1×24 jam.
          </p>
        </div>
      </section>

      <section className="max-w-lg mx-auto px-6 py-16 space-y-6">

        {/* Booking detail card */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden">
          <div className="bg-stone-900 px-6 py-4">
            <p className="text-stone-400 text-xs uppercase tracking-widest">Nomor Booking</p>
            <p className="text-white font-mono text-sm mt-1">{booking.id}</p>
          </div>

          <div className="divide-y divide-stone-100">
            <Row label="Nama" value={booking.clientName} />
            <Row label="WhatsApp" value={booking.clientPhone} />
            <Row label="Email" value={booking.clientEmail} />
            <Row label="Paket" value={booking.package.name} />
            <Row label="Tier" value={`${booking.tier.name} — ${formatDuration(booking.tier.duration)}`} />
            <Row label="Harga" value={formatRupiah(booking.tier.price)} highlight />
            <Row label="Tanggal" value={formattedDate} />
            <Row label="Jam" value={booking.timeSlot + " WIB"} />
            {booking.notes && <Row label="Catatan" value={booking.notes} />}
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-stone-500">Status</span>
              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Menunggu Konfirmasi
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-700 space-y-2">
          <p className="font-semibold">Langkah selanjutnya:</p>
          <ol className="space-y-1 list-decimal list-inside text-blue-600">
            <li>Simpan screenshot halaman ini sebagai bukti booking</li>
            <li>Tim kami akan menghubungi via WhatsApp untuk konfirmasi</li>
            <li>Lakukan pembayaran DP setelah mendapat konfirmasi</li>
            <li>Datang tepat waktu sesuai jadwal yang telah dikonfirmasi</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 text-center bg-stone-900 hover:bg-stone-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            Kembali ke Home
          </Link>
          <Link
            href="/booking"
            className="flex-1 text-center border border-stone-200 hover:border-stone-300 text-stone-700 font-semibold py-3.5 rounded-xl transition-colors"
          >
            Booking Lagi
          </Link>
        </div>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="px-6 py-4 flex items-start justify-between gap-4">
      <span className="text-sm text-stone-500 shrink-0">{label}</span>
      <span className={`text-sm text-right ${highlight ? "font-bold text-amber-600" : "text-stone-900"}`}>
        {value}
      </span>
    </div>
  );
}
