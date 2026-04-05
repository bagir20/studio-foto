import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Packages",
  description: "Pilih paket foto sesuai kebutuhanmu.",
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

async function getData(categorySlug?: string) {
  const [packages, categories] = await Promise.all([
    prisma.package.findMany({
      where: {
        isActive: true,
        ...(categorySlug && { category: { slug: categorySlug } }),
      },
      include: {
        category: true,
        tiers: { select: { price: true }, orderBy: { price: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.packageCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { packages, categories };
}

export default async function PackagesPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const { packages, categories } = await getData(category);

  return (
    <div className="bg-white min-h-screen canvas-texture">
      <section className="px-8 md:px-12 pt-10 pb-32">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
<div className="mb-1">
  <span className="text-[9px] uppercase tracking-[0.5em] text-accent font-bold">
    Pilihan Terbaik Kami
  </span>
</div>
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
  <h1 className="font-cinzel text-3xl md:text-5xl text-black tracking-tight leading-tight">
    ABADIKAN Keindahan<br />
    <span className="italic font-normal">SEMUA</span>
  </h1>
  <p className="text-black/40 text-sm font-light max-w-xs leading-relaxed">
    Setiap paket dirancang untuk memberikan hasil terbaik dengan sentuhan editorial profesional.
  </p>
</div>

{/* Filter */}
<div className="flex flex-wrap gap-6 mb-8 border-b border-black/10 pb-5">
  <Link
    href="/packages"
    className={`font-cinzel text-xs tracking-[0.3em] uppercase pb-1 transition-all ${
      !category ? "text-black border-b-2 border-black" : "text-black/30 hover:text-black"
    }`}
  >
    All
  </Link>
  {categories.map((cat) => (
    <Link
      key={cat.id}
      href={`/packages?category=${cat.slug}`}
      className={`font-cinzel text-xs tracking-[0.3em] uppercase pb-1 transition-all ${
        category === cat.slug ? "text-black border-b-2 border-black" : "text-black/30 hover:text-black"
      }`}
    >
      {cat.name}
    </Link>
  ))}
</div>

          {/* Packages grid */}
          {packages.length === 0 ? (
            <p className="font-cinzel text-black/20 text-xs uppercase tracking-widest text-center py-24">
              Belum ada paket
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {packages.map((pkg, i) => {
                const startingPrice = pkg.tiers.length > 0
                  ? Math.min(...pkg.tiers.map((t) => t.price))
                  : null;

                return (
                  <Link key={pkg.id} href={`/packages/${pkg.slug}`} className="group flex flex-col gap-4">
                    {/* Image */}
                    <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                      <Image
                        src={pkg.coverImage}
                        alt={pkg.name}
                        fill
                        className="object-cover group-hover:grayscale group-hover:scale-105 transition-all duration-700"
                        unoptimized
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-white text-black font-cinzel text-[10px] tracking-widest uppercase px-3 py-1">
                          {pkg.category.name}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                   <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-cinzel text-sm text-black tracking-wide group-hover:text-accent transition-colors">
                          {pkg.name.toUpperCase()}
                        </h3>
                        {pkg.description && (
                          <p className="hidden sm:block text-black/40 text-xs mt-1 font-light leading-relaxed line-clamp-2">
                            {pkg.description}
                          </p>
                        )}
                      </div>
                      {startingPrice && (
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-[10px] text-black/30 uppercase tracking-widest">Mulai</p>
                          <p className="font-cinzel text-accent text-sm">{formatRupiah(startingPrice)}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-black/30 group-hover:text-accent transition-colors font-cinzel">
                        View details →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-12 py-24 bg-black">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-cinzel text-3xl md:text-5xl text-white tracking-widest">
            READY TO FRAME YOUR STORY?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/booking"
              className="bg-white text-black px-12 py-4 text-xs tracking-[0.2em] uppercase font-cinzel hover:bg-accent hover:text-white transition-all duration-300"
            >
              Book Session
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}