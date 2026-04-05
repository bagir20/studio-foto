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
    <div className="bg-white min-h-screen">

      {/* Header compact */}
      <section className="px-6 md:px-16 pt-10 pb-8 border-b border-black/5">
        <div className="max-w-lg">
          <span className="font-cinzel text-[9px] tracking-[0.5em] text-accent uppercase mb-3 block">
            Reservasi
          </span>
          <h1 className="font-cinzel text-3xl md:text-4xl text-black tracking-tight mb-3">
            BOOKING SESI
          </h1>
          <p className="text-black/35 text-xs font-light leading-relaxed">
            Isi form di bawah untuk memesan sesi foto.
          </p>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-lg">
        <Suspense fallback={
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-stone-100 animate-pulse" />
            ))}
          </div>
        }>
          <BookingForm packages={packages} />
        </Suspense>
      </div>

    </div>
  );
}