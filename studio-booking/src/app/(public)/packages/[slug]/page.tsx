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

  return (
    <div className="bg-white min-h-screen">

      {/* Hero cover */}
      <div className="relative h-[60vh] bg-stone-900 overflow-hidden">
        <Image
          src={pkg.coverImage}
          alt={pkg.name}
          fill
          className="object-cover grayscale opacity-60"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-12">
          <span className="font-cinzel text-[10px] tracking-[0.5em] text-accent uppercase mb-4 block">
            {pkg.category.name}
          </span>
          <h1 className="font-cinzel text-4xl md:text-6xl text-white tracking-tight">
            {pkg.name.toUpperCase()}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 md:px-16 py-20 grid md:grid-cols-3 gap-16">

        {/* Left */}
        <div className="md:col-span-2 space-y-16">

          {/* Description */}
          {pkg.description && (
            <div>
              <span className="font-cinzel text-[10px] tracking-[0.5em] text-accent uppercase mb-4 block">
                Overview
              </span>
              <p className="text-black/60 leading-loose text-lg font-light max-w-xl">
                {pkg.description}
              </p>
            </div>
          )}

          {/* Samples */}
        {pkg.samples.length > 0 && (
          <div>
            <span className="font-cinzel text-[10px] tracking-[0.5em] text-accent uppercase mb-8 block">
              Sample Work
            </span>
            <SampleGrid samples={pkg.samples} />
          </div>
        )}
        </div>

        {/* Right — tiers */}
        <div className="space-y-6">
          <span className="font-cinzel text-[10px] tracking-[0.5em] text-accent uppercase block">
            Select Package
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
                <span className="font-cinzel text-[10px] tracking-[0.3em] text-accent uppercase">
                  Most Popular
                </span>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-cinzel text-xl tracking-wide ${i === 1 ? "text-white" : "text-black"}`}>
                    {tier.name.toUpperCase()}
                  </h3>
                  <p className={`text-xs mt-1 ${i === 1 ? "text-white/40" : "text-black/40"}`}>
                    {formatDuration(tier.duration)}
                  </p>
                </div>
                <p className="font-cinzel text-lg text-accent">{formatRupiah(tier.price)}</p>
              </div>

              <ul className="space-y-2">
                {tier.includes.map((item) => (
                  <li key={item} className={`flex items-start gap-3 text-sm ${i === 1 ? "text-white/70" : "text-black/50"}`}>
                    <span className="text-accent mt-0.5 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={`/booking?packageId=${pkg.id}&tierId=${tier.id}`}
                className={`block text-center py-3 font-cinzel text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                  i === 1
                    ? "bg-accent text-white hover:brightness-110"
                    : "border border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                Book This
              </Link>
            </div>
          ))}

          <Link
            href="/packages"
            className="block text-center font-cinzel text-[10px] tracking-widest uppercase text-black/30 hover:text-black transition-colors mt-4"
          >
            ← All Packages
          </Link>
        </div>
      </div>
    </div>
  );
}