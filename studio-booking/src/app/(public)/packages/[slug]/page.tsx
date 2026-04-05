import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDuration } from "@/lib/utils";
import SampleGrid from "@/components/packages/SampleGrid";

type Props = { params: Promise<{ slug: string }> };

async function getPackage(slug: string) {
  return prisma.package.findUnique({
    where: { slug },
    include: {
      category: true,
      tiers: { orderBy: { price: "asc" } },
      samples: { orderBy: { order: "asc" } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) return { title: "Paket tidak ditemukan" };
  return { title: pkg.name, description: pkg.description ?? undefined };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) notFound();

  const cheapestTier = pkg.tiers[0];

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-0">

      {/* ── Hero — lebih compact ── */}
      <div className="relative h-[40vh] md:h-[55vh] bg-stone-900 overflow-hidden">
        <Image
          src={pkg.coverImage}
          alt={pkg.name}
          fill
          className="object-cover opacity-70 grayscale"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Back link */}
        <Link
          href="/packages"
          className="absolute top-7 left-6 md:left-12 font-cinzel text-[9px] tracking-[0.35em] uppercase text-white hover:text-accent transition-colors drop-shadow-md"
        >
          ← Semua Paket
        </Link>

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8">
         <span className="font-cinzel text-[9px] tracking-[0.5em] text-accent uppercase mb-2 bg-black px-2 py-1 inline-block">
            {pkg.category.name}
          </span>
          <h1 className="font-cinzel text-3xl md:text-5xl text-white tracking-tight">
            {pkg.name.toUpperCase()}
          </h1>
          {cheapestTier && (
            <p className="text-white/40 text-xs mt-2 font-light">
              Mulai dari <span className="text-accent font-cinzel">{formatRupiah(cheapestTier.price)}</span>
            </p>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16 md:grid md:grid-cols-3 md:gap-16">

        {/* ── KIRI: info + samples ── */}
        <div className="md:col-span-2 space-y-12">

          {/* Description */}
          {pkg.description && (
            <div>
              <span className="font-cinzel text-[9px] tracking-[0.5em] text-accent uppercase mb-3 block">
                Tentang Paket
              </span>
              <p className="text-black/55 leading-loose text-sm md:text-base font-light max-w-xl">
                {pkg.description}
              </p>
            </div>
          )}

          {/* Tier list — mobile only, di atas samples */}
          <div className="md:hidden space-y-3">
            <span className="font-cinzel text-[9px] tracking-[0.5em] text-accent uppercase block">
              Pilih Paket
            </span>
            {pkg.tiers.map((tier, i) => (
              <div
                key={tier.id}
                className={`border p-5 space-y-4 ${
                  i === 1 ? "border-black bg-black text-white" : "border-black/10"
                }`}
              >
                {i === 1 && (
                  <span className="font-cinzel text-[8px] tracking-[0.3em] text-accent uppercase">
                    Paling Populer
                  </span>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`font-cinzel text-sm tracking-wide ${i === 1 ? "text-white" : "text-black"}`}>
                      {tier.name.toUpperCase()}
                    </h3>
                    <p className={`text-[10px] mt-0.5 ${i === 1 ? "text-white/40" : "text-black/40"}`}>
                      {formatDuration(tier.duration)}
                    </p>
                  </div>
                  <p className="font-cinzel text-sm text-accent">{formatRupiah(tier.price)}</p>
                </div>
                <ul className="space-y-1.5">
                  {tier.includes.map((item) => (
                    <li key={item} className={`flex items-start gap-2 text-xs ${i === 1 ? "text-white/60" : "text-black/50"}`}>
                      <span className="text-accent shrink-0 mt-0.5">—</span>{item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/booking?packageId=${pkg.id}&tierId=${tier.id}`}
                  className={`block text-center py-3 font-cinzel text-[10px] tracking-[0.25em] uppercase transition-all duration-300 ${
                    i === 1
                      ? "bg-accent text-white hover:brightness-110"
                      : "border border-black text-black hover:bg-black hover:text-white"
                  }`}
                >
                  Booking Sekarang
                </Link>
              </div>
            ))}
          </div>

          {/* Samples */}
          {pkg.samples.length > 0 && (
            <div>
              <span className="font-cinzel text-[9px] tracking-[0.5em] text-accent uppercase mb-6 block">
                Hasil Foto
              </span>
              <SampleGrid samples={pkg.samples} />
            </div>
          )}
        </div>

        {/* ── KANAN: tiers — desktop only ── */}
        <div className="hidden md:block space-y-4">
          <span className="font-cinzel text-[9px] tracking-[0.5em] text-accent uppercase block mb-2">
            Pilih Paket
          </span>
          {pkg.tiers.map((tier, i) => (
            <div
              key={tier.id}
              className={`border p-6 space-y-5 transition-all duration-300 ${
                i === 1
                  ? "border-black bg-black text-white"
                  : "border-black/10 hover:border-black"
              }`}
            >
              {i === 1 && (
                <span className="font-cinzel text-[8px] tracking-[0.3em] text-accent uppercase">
                  Paling Populer
                </span>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-cinzel text-lg tracking-wide ${i === 1 ? "text-white" : "text-black"}`}>
                    {tier.name.toUpperCase()}
                  </h3>
                  <p className={`text-xs mt-1 ${i === 1 ? "text-white/40" : "text-black/40"}`}>
                    {formatDuration(tier.duration)}
                  </p>
                </div>
                <p className="font-cinzel text-base text-accent">{formatRupiah(tier.price)}</p>
              </div>
              <ul className="space-y-2">
                {tier.includes.map((item) => (
                  <li key={item} className={`flex items-start gap-3 text-xs ${i === 1 ? "text-white/70" : "text-black/50"}`}>
                    <span className="text-accent mt-0.5 shrink-0">—</span>{item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/booking?packageId=${pkg.id}&tierId=${tier.id}`}
                className={`block text-center py-3 font-cinzel text-[10px] tracking-[0.25em] uppercase transition-all duration-300 ${
                  i === 1
                    ? "bg-accent text-white hover:brightness-110"
                    : "border border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                Booking Sekarang
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── STICKY BOTTOM BAR — mobile only ── */}
      {cheapestTier && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/10 px-5 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-black/30 font-cinzel">Mulai dari</p>
            <p className="font-cinzel text-base text-accent">{formatRupiah(cheapestTier.price)}</p>
          </div>
          <Link
            href={`/booking?packageId=${pkg.id}`}
            className="flex-1 bg-black text-white text-center font-cinzel text-[10px] tracking-[0.3em] uppercase py-3.5 hover:bg-accent transition-colors duration-300"
          >
            Booking Sekarang
          </Link>
        </div>
      )}

    </div>
  );
}