import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import BookingForm from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Booking",
  description: "Booking sesi foto di wanpicture Palangkaraya.",
};

async function getPackages() {
  return prisma.package.findMany({
    where: { isActive: true },
    include: { category: true, tiers: { orderBy: { price: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export default async function BookingPage() {
  const packages = await getPackages();

  return (
    <div className="bg-white min-h-screen canvas-texture">

      {/* Header */}
      <section className="px-8 md:px-16 pt-24 pb-16 border-b border-black/5">
        <div className="max-w-3xl">
          <span className="font-cinzel text-[10px] tracking-[0.5em] text-accent uppercase mb-4 block">
            Reservasi
          </span>
          <h1 className="font-cinzel text-5xl md:text-6xl text-black tracking-tight mb-6">
            BOOK A<br />SESSION
          </h1>
          <p className="text-black/40 font-light leading-relaxed max-w-md">
            Isi form di bawah untuk memesan sesi foto. Kami akan konfirmasi via WhatsApp dalam 1×24 jam.
          </p>
        </div>
      </section>

      <section className="max-w-2xl px-8 md:px-16 py-16">
        <Suspense fallback={
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-stone-100 animate-pulse" />
            ))}
          </div>
        }>
          <BookingForm packages={packages} />
        </Suspense>
      </section>
    </div>
  );
}