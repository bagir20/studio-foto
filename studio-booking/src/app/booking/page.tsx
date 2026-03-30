import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import BookingForm from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Booking",
  description: "Booking sesi foto di wanpicture Palangkaraya. Pilih paket, tanggal, dan jam sesimu.",
};

async function getPackages() {
  return prisma.package.findMany({
    where: { isActive: true },
    include: {
      category: true,
      tiers: { orderBy: { price: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function BookingPage() {
  const packages = await getPackages();

  return (
    <div className="bg-white min-h-screen">

      {/* Header */}
      <section className="bg-stone-950 pt-16 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase">
            Buat Janji
          </p>
          <h1 className="text-5xl font-bold text-white">Booking Sesi</h1>
          <p className="text-stone-400 text-lg max-w-md mx-auto">
            Isi form di bawah untuk memesan sesi foto. Kami akan konfirmasi via WhatsApp.
          </p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-16">

        {/* Info box */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10 space-y-2">
          <p className="font-semibold text-amber-800 text-sm">Cara booking:</p>
          <ol className="text-amber-700 text-sm space-y-1 list-decimal list-inside">
            <li>Pilih paket dan tier yang sesuai</li>
            <li>Tentukan tanggal dan jam sesi</li>
            <li>Isi data diri</li>
            <li>Submit — kami akan konfirmasi via WhatsApp dalam 1×24 jam</li>
          </ol>
        </div>

        {/* Form — Suspense karena BookingForm pakai useSearchParams */}
        <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-10 bg-stone-100 rounded-xl"/><div className="h-32 bg-stone-100 rounded-xl"/></div>}>
          <BookingForm packages={packages} />
        </Suspense>
      </section>
    </div>
  );
}
