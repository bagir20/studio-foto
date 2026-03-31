import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDuration } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { a } from "framer-motion/client";

export const metadata: Metadata = { title: "Booking Confirmed" };

type Props = { searchParams: Promise<{ id?: string }> };

export default async function KonfirmasiPage({ searchParams }: Props) {
  const { id } = await searchParams;
  if (!id) notFound();

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { package: true, tier: true },
  });
  if (!booking) notFound();

  const isExpired = Date.now() - new Date(booking.createdAt).getTime() > 7 * 24 * 60 * 60 * 1000;

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center canvas-texture px-8">
        <div className="text-center space-y-6 max-w-sm">
          <span className="font-cinzel text-[10px] tracking-[0.5em] text-accent uppercase block">
            Expired
          </span>
          <h1 className="font-cinzel text-3xl text-black tracking-tight">
            LINK KEDALUWARSA
          </h1>
          <p className="text-black/40 text-sm font-light leading-relaxed">
            Halaman konfirmasi hanya tersedia 7 hari setelah booking dibuat.
            Hubungi kami via WhatsApp untuk informasi booking kamu.
          </p>
          <div className="flex flex-col gap-3 pt-4">
            
              href="https://wa.me/6282251168216"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white font-cinzel text-xs tracking-[0.2em] uppercase py-4 hover:bg-accent transition-all duration-300"
            <a>
              Hubungi via WhatsApp
            </a>
            <Link
              href="/"
              className="border border-black/10 hover:border-black text-black font-cinzel text-xs tracking-[0.2em] uppercase py-4 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(booking.date), "EEEE, d MMMM yyyy", { locale: localeId });

  const rows = [
    { label: "Paket", value: booking.package.name },
    { label: "Tier", value: `${booking.tier.name} — ${formatDuration(booking.tier.duration)}` },
    { label: "Harga", value: formatRupiah(booking.tier.price), accent: true },
    { label: "Tanggal", value: formattedDate },
    { label: "Jam", value: `${booking.timeSlot} WIB` },
    { label: "Nama", value: booking.clientName },
    { label: "WhatsApp", value: booking.clientPhone },
    { label: "Email", value: booking.clientEmail },
    ...(booking.notes ? [{ label: "Catatan", value: booking.notes }] : []),
  ];

  return (
    <div className="bg-white min-h-screen canvas-texture">
      <section className="px-8 md:px-16 pt-24 pb-16 border-b border-black/5">
        <div className="max-w-2xl">
          <span className="font-cinzel text-[10px] tracking-[0.5em] text-accent uppercase mb-4 block">
            Confirmed
          </span>
          <h1 className="font-cinzel text-5xl md:text-6xl text-black tracking-tight mb-6">
            BOOKING<br />RECEIVED
          </h1>
          <p className="text-black/40 font-light leading-relaxed">
            Terima kasih! Kami akan konfirmasi via WhatsApp dalam 1×24 jam.
          </p>
        </div>
      </section>

      <section className="max-w-2xl px-8 md:px-16 py-16 space-y-10">
        <div className="border border-black/10 p-6">
          <p className="font-cinzel text-[10px] tracking-[0.5em] text-accent uppercase mb-2">
            Booking Reference
          </p>
          <p className="font-mono text-sm text-black/60 break-all">{booking.id}</p>
        </div>

        <div className="border border-black/10 divide-y divide-black/5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start justify-between px-6 py-4 gap-4">
              <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-black/30 shrink-0">
                {row.label}
              </span>
              <span className={`text-sm text-right ${row.accent ? "font-cinzel text-accent" : "text-black/70"}`}>
                {row.value}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between px-6 py-4">
            <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-black/30">Status</span>
            <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-accent border border-accent px-3 py-1">
              Pending Confirmation
            </span>
          </div>
        </div>

        <div className="border-l-2 border-accent pl-6 space-y-2">
          <p className="font-cinzel text-xs tracking-widest uppercase text-black/40">Next Steps</p>
          <ol className="space-y-1.5 text-sm text-black/50 font-light">
            <li>1. Screenshot halaman ini sebagai bukti booking</li>
            <li>2. Tim kami akan menghubungi via WhatsApp</li>
            <li>3. Lakukan pembayaran DP setelah konfirmasi</li>
            <li>4. Datang tepat waktu sesuai jadwal</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/"
            className="flex-1 text-center bg-black hover:bg-accent text-white font-cinzel text-xs tracking-[0.2em] uppercase py-4 transition-all duration-300"
          >
            Back to Home
          </Link>
          <Link
            href="/booking"
            className="flex-1 text-center border border-black/10 hover:border-black text-black font-cinzel text-xs tracking-[0.2em] uppercase py-4 transition-all duration-300"
          >
            New Booking
          </Link>
        </div>
      </section>
    </div>
  );
}